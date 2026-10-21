import type { CSSProperties, ReactNode } from 'react';

type Props = {
  photo?: string;
  /** Legenda do placeholder ("foto · …") quando não há foto. */
  caption?: string;
  stripe?: number;
  style?: CSSProperties;
  className?: string;
  children?: ReactNode;
};

/** Imagem com moldura `.plate`; sem foto, mostra o placeholder listrado do protótipo. */
export function Plate({ photo, caption, stripe = 8, style, className, children }: Props) {
  return (
    <div className={`plate ${className ?? ''}`} style={{ '--stripe': `${stripe}px`, ...style } as CSSProperties}>
      {photo ? <img src={photo} alt="" loading="lazy" /> : caption && <span className="plate-caption" aria-hidden>{caption}</span>}
      {children}
    </div>
  );
}
