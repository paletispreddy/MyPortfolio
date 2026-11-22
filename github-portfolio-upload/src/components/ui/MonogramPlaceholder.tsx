import React from 'react';

interface MonogramPlaceholderProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const MonogramPlaceholder: React.FC<MonogramPlaceholderProps> = ({
  className = '',
  size = 'lg',
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16 text-lg',
    md: 'w-32 h-32 text-2xl',
    lg: 'w-56 h-56 text-4xl',
    xl: 'w-72 h-72 text-6xl',
  };

  return (
    <div
      className={`relative flex items-center justify-center rounded-[20px] bg-gradient-to-br from-[#12141C] via-[#0E1016] to-[#07080B] border border-gold/30 shadow-[0_0_30px_rgba(212,175,55,0.15)] overflow-hidden ${sizeClasses[size]} ${className}`}
    >
      {/* Background subtle lattice */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Decorative concentric gold ring */}
      <div className="absolute inset-3 rounded-[16px] border border-gold/20 pointer-events-none" />
      <div className="absolute inset-5 rounded-[12px] border border-dashed border-gold/15 pointer-events-none" />

      {/* Monogram letters */}
      <div className="relative z-10 font-fraunces font-bold tracking-widest text-gold-gradient drop-shadow-[0_2px_10px_rgba(212,175,55,0.4)]">
        SP
      </div>

      {/* Teal focal accent */}
      <div className="absolute bottom-4 right-4 w-2 h-2 rounded-full bg-teal shadow-[0_0_8px_#2DE2C7]" />
    </div>
  );
};
