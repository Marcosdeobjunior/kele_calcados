import { useNavigate } from 'react-router-dom';
import type { Product } from '../types';
import { fmt } from '../lib/format';
import { Plate } from './Plate';

type Props = {
  products: Product[];
  /** Linha acima do nome: departamento (vitrine) ou subcategoria (departamento). */
  kicker: (p: Product) => string;
  onClear: () => void;
};

export function ProductGrid({ products, kicker, onClear }: Props) {
  const navigate = useNavigate();
  if (!products.length)
    return (
      <div style={{ margin: '0 20px 40px', display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start' }}>
        <p style={{ margin: 0, fontSize: 14, fontStyle: 'italic' }} className="muted">Nenhum par com esses filtros.</p>
        <button className="btn btn-secondary" onClick={onClear}>Limpar filtros</button>
      </div>
    );
  return (
    <div className="product-grid">
      {products.map((p) => (
        <button key={p.id} className="product-card" onClick={() => navigate(`/produto/${p.id}`)}>
          <Plate photo={p.photos?.[0]} caption={`foto · ${p.name.toLowerCase()}`} style={{ aspectRatio: '4 / 5', width: '100%' }}>
            {p.isNew && (
              <span className="tag tag-outline" style={{ position: 'absolute', top: 8, left: 8, background: 'var(--color-bg)' }}>Novo</span>
            )}
          </Plate>
          <div>
            <div className="kicker" style={{ letterSpacing: '.1em' }}>{kicker(p)}</div>
            <div className="name">{p.name}</div>
            <div className="tnum" style={{ fontSize: 14, marginTop: 4 }}>{fmt(p.price)}</div>
          </div>
        </button>
      ))}
    </div>
  );
}
