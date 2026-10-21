import type { Filters } from '../types';
import { FILTER_SIZES, PRICES, SORTS } from '../data/catalog';
import { plural } from '../lib/format';

type Props = {
  filters: Filters;
  onChange: (f: Filters) => void;
  onClear: () => void;
  onClose: () => void;
  resultCount: number;
};

export function FilterSheet({ filters: f, onChange, onClear, onClose, resultCount }: Props) {
  const toggleSize = (n: number) =>
    onChange({ ...f, sizes: f.sizes.includes(n) ? f.sizes.filter((x) => x !== n) : [...f.sizes, n] });
  return (
    <div className="sheet-wrap" role="dialog" aria-modal="true" aria-label="Filtrar">
      <button className="backdrop" onClick={onClose} aria-label="Fechar filtros" />
      <div className="sheet">
        <div className="grabber" />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div className="title" style={{ fontSize: 24 }}>Filtrar</div>
          <button className="btn btn-ghost" onClick={onClear} style={{ fontSize: 13 }}>Limpar</button>
        </div>
        <div className="field" style={{ gap: 8 }}>
          <span className="label">Tamanho</span>
          <div className="size-grid" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {FILTER_SIZES.map((n) => (
              <button key={n} className="size" aria-pressed={f.sizes.includes(n)} onClick={() => toggleSize(n)}>{n}</button>
            ))}
          </div>
        </div>
        <div className="field" style={{ gap: 8 }}>
          <span className="label">Preço</span>
          <div className="chips wrap">
            {PRICES.map(([v, label]) => (
              <button key={v} className="pill" style={{ padding: '8px 13px' }} aria-pressed={f.price === v} onClick={() => onChange({ ...f, price: v })}>
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="field" style={{ gap: 8 }}>
          <span className="label">Ordenar por</span>
          <div className="seg">
            {SORTS.map(([v, label]) => (
              <button key={v} aria-pressed={f.sort === v} onClick={() => onChange({ ...f, sort: v })}>{label}</button>
            ))}
          </div>
        </div>
        <button className="btn btn-primary" onClick={onClose} style={{ width: '100%', height: 48, fontSize: 15 }}>
          Ver {plural(resultCount, 'modelo', 'modelos')}
        </button>
      </div>
    </div>
  );
}
