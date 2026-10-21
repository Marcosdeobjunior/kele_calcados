import { useMemo } from 'react';
import { ChevronRight, Search as SearchIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DEPT_NAMES, SEARCH_SUGGESTIONS } from '../data/catalog';
import { useStore } from '../state/store';
import { useOpenDept } from '../lib/useOpenDept';
import { searchProducts } from '../lib/catalog';
import { fmt, plural } from '../lib/format';
import { Plate } from '../components/Plate';

export function Search() {
  const { products, query, setQuery } = useStore();
  const navigate = useNavigate();
  const openDept = useOpenDept();
  const results = useMemo(() => searchProducts(products, query), [products, query]);
  const has = query.trim().length > 0;

  return (
    <div className="screen">
      <div className="header" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="title">Buscar</div>
        <div style={{ position: 'relative' }}>
          <SearchIcon size={18} strokeWidth={1.5} color="var(--color-neutral-700)" style={{ position: 'absolute', left: 12, top: 13 }} />
          <input
            className="input"
            type="search"
            autoFocus
            placeholder="Tênis, bota, sandália infantil…"
            aria-label="Buscar produtos"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ minHeight: 44, paddingLeft: 38 }}
          />
        </div>
      </div>
      <div className="scroll">
        {!has ? (
          <div style={{ padding: 20 }}>
            <div className="kicker" style={{ marginBottom: 10 }}>Buscas frequentes</div>
            <div className="chips wrap">
              {SEARCH_SUGGESTIONS.map((s) => (
                <button key={s} className="pill" onClick={() => setQuery(s)}>{s}</button>
              ))}
            </div>
            <div className="kicker" style={{ margin: '28px 0 4px' }}>Departamentos</div>
            {DEPT_NAMES.map((d) => (
              <button
                key={d}
                onClick={() => openDept(d)}
                style={{ width: '100%', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '14px 0', background: 'none', border: 0, borderBottom: '1px solid var(--color-divider)', cursor: 'pointer', font: 'inherit', color: 'var(--color-text)', textAlign: 'left' }}
              >
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: 22 }}>{d}</span>
                <span className="muted tnum" style={{ fontSize: 12 }}>{plural(products.filter((p) => p.dept === d).length, 'modelo', 'modelos')}</span>
              </button>
            ))}
          </div>
        ) : (
          <>
            <div className="muted tnum" style={{ padding: '12px 20px 4px', fontSize: 12 }}>{plural(results.length, 'resultado', 'resultados')}</div>
            {results.map((p) => (
              <button key={p.id} className="row-btn" onClick={() => navigate(`/produto/${p.id}`)}>
                <Plate photo={p.photos?.[0]} stripe={6} style={{ width: 64, height: 76, flex: 'none' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="kicker" style={{ letterSpacing: '.1em' }}>{p.dept} · {p.type}</div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 600 }}>{p.name}</div>
                  <div className="tnum" style={{ fontSize: 13 }}>{fmt(p.price)}</div>
                </div>
                <ChevronRight size={18} strokeWidth={1.5} color="var(--color-neutral-700)" />
              </button>
            ))}
            {results.length === 0 && (
              <p className="muted" style={{ margin: '16px 20px', fontSize: 14, fontStyle: 'italic' }}>Nada encontrado. Tente “tênis” ou “infantil”.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
