export interface MediaItem {
  id: string;
  src: string;
  filename: string;
  title: string;
  category: string;
  description?: string;
  date?: string;
  width?: number;
  height?: number;
}

export interface VideoItem {
  id: string;
  src: string;
  filename: string;
  title: string;
  category: string;
  description?: string;
  poster?: string;
  isExternal?: boolean;
  externalProvider?: 'youtube' | 'vimeo';
  embedUrl?: string;
  date?: string;
}

export interface CaptionEntry {
  title?: string;
  description?: string;
  date?: string;
}

export interface VideoLinkEntry {
  title: string;
  url: string;
  category: string;
  description?: string;
  date?: string;
  poster?: string;
}

// Prettify kebab-case or snake_case or camelCase to Title Case
export function prettifyString(input: string): string {
  if (!input) return '';
  return input
    .replace(/^(\d{4}[-_]\d{2}[-_]\d{2}[-_]?)/, '') // Strip leading dates like 2026-01-15-
    .replace(/[-_]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .trim()
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// Format folder name to Category
export function formatCategory(folder: string): string {
  if (!folder || folder.trim() === '' || folder.toLowerCase() === 'photos' || folder.toLowerCase() === 'videos') {
    return 'General';
  }
  return prettifyString(folder);
}

// Extract YouTube ID
export function getYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

// Extract Vimeo ID
export function getVimeoId(url: string): string | null {
  const match = url.match(/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:[a-zA-Z0-9_\-]+)?/);
  return match ? match[1] : null;
}

// Eager load captions and links
const captionsMap: Record<string, CaptionEntry> = (() => {
  try {
    const modules = import.meta.glob<Record<string, CaptionEntry> | { default: Record<string, CaptionEntry> }>(
      '/src/media/captions.json',
      { eager: true }
    );
    for (const key in modules) {
      const mod = modules[key];
      return (mod as any).default || mod;
    }
  } catch (e) {
    console.warn('Could not load captions.json', e);
  }
  return {};
})();

const externalVideoLinks: VideoLinkEntry[] = (() => {
  try {
    const modules = import.meta.glob<VideoLinkEntry[] | { default: VideoLinkEntry[] }>(
      '/src/media/videos/links.json',
      { eager: true }
    );
    for (const key in modules) {
      const mod = modules[key];
      const val = (mod as any).default || mod;
      if (Array.isArray(val)) return val;
    }
  } catch (e) {
    console.warn('Could not load links.json', e);
  }
  return [];
})();

// Discover Profile Photo
export function getProfilePhoto(): string | null {
  const profileModules = import.meta.glob<string>(
    '/src/media/profile/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}',
    { eager: true, query: '?url', import: 'default' }
  );

  for (const path in profileModules) {
    const filename = path.split('/').pop() || '';
    if (!filename.startsWith('README')) {
      return profileModules[path];
    }
  }
  return null;
}

// Discover Photos
export function getAllPhotos(): MediaItem[] {
  const photoModules = import.meta.glob<string>(
    '/src/media/photos/**/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}',
    { eager: true, query: '?url', import: 'default' }
  );

  const items: MediaItem[] = [];

  for (const fullPath in photoModules) {
    // Expected path like /src/media/photos/category/filename.jpg or /src/media/photos/filename.jpg
    const relative = fullPath.replace('/src/media/photos/', '');
    const parts = relative.split('/');
    const filename = parts.pop() || '';
    if (filename.toLowerCase().startsWith('readme')) continue;

    const subfolder = parts.length > 0 ? parts.join('/') : '';
    const category = formatCategory(subfolder);

    // Check captions.json
    const caption = captionsMap[filename] || {};
    const baseName = filename.replace(/\.[^/.]+$/, '');
    const title = caption.title || prettifyString(baseName);
    const date = caption.date;
    const description = caption.description;

    items.push({
      id: fullPath,
      src: photoModules[fullPath],
      filename,
      title,
      category,
      description,
      date,
    });
  }

  // Sort by date descending if available, else by filename descending
  items.sort((a, b) => {
    if (a.date && b.date) {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    if (a.date && !b.date) return -1;
    if (!a.date && b.date) return 1;
    return b.filename.localeCompare(a.filename);
  });

  return items;
}

// Discover Videos (Local Files + External Links)
export function getAllVideos(): VideoItem[] {
  const videoModules = import.meta.glob<string>(
    '/src/media/videos/**/*.{mp4,webm,MP4,WEBM}',
    { eager: true, query: '?url', import: 'default' }
  );

  const posterModules = import.meta.glob<string>(
    '/src/media/videos/**/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}',
    { eager: true, query: '?url', import: 'default' }
  );

  const items: VideoItem[] = [];

  // Index posters by subpath without extension
  const postersMap: Record<string, string> = {};
  for (const p in posterModules) {
    const clean = p.replace(/\.[^/.]+$/, '');
    postersMap[clean] = posterModules[p];
  }

  // Process Local Videos
  for (const fullPath in videoModules) {
    const relative = fullPath.replace('/src/media/videos/', '');
    const parts = relative.split('/');
    const filename = parts.pop() || '';
    if (filename.toLowerCase().startsWith('readme')) continue;

    const subfolder = parts.length > 0 ? parts.join('/') : '';
    const category = formatCategory(subfolder);

    const basePathWithoutExt = fullPath.replace(/\.[^/.]+$/, '');
    const poster = postersMap[basePathWithoutExt] || undefined;

    const caption = captionsMap[filename] || {};
    const baseName = filename.replace(/\.[^/.]+$/, '');
    const title = caption.title || prettifyString(baseName);

    items.push({
      id: fullPath,
      src: videoModules[fullPath],
      filename,
      title,
      category,
      description: caption.description,
      date: caption.date,
      poster,
      isExternal: false,
    });
  }

  // Process External Links (YouTube / Vimeo)
  for (let i = 0; i < externalVideoLinks.length; i++) {
    const link = externalVideoLinks[i];
    const ytId = getYouTubeId(link.url);
    const vmId = getVimeoId(link.url);

    if (ytId) {
      items.push({
        id: `yt-${ytId}-${i}`,
        src: link.url,
        filename: `youtube-${ytId}`,
        title: link.title || 'Featured Presentation',
        category: formatCategory(link.category || 'Presentations'),
        description: link.description,
        date: link.date,
        poster: link.poster || `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
        isExternal: true,
        externalProvider: 'youtube',
        embedUrl: `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0`,
      });
    } else if (vmId) {
      items.push({
        id: `vm-${vmId}-${i}`,
        src: link.url,
        filename: `vimeo-${vmId}`,
        title: link.title || 'Featured Keynote',
        category: formatCategory(link.category || 'Presentations'),
        description: link.description,
        date: link.date,
        poster: undefined, // Vimeo thumbnail can fallback or use embed
        isExternal: true,
        externalProvider: 'vimeo',
        embedUrl: `https://player.vimeo.com/video/${vmId}?autoplay=1`,
      });
    }
  }

  // Sort by date descending if available, else by filename descending
  items.sort((a, b) => {
    if (a.date && b.date) {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    if (a.date && !b.date) return -1;
    if (!a.date && b.date) return 1;
    return b.filename.localeCompare(a.filename);
  });

  return items;
}
