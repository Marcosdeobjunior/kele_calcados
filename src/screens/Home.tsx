import { useMemo, useState } from 'react';
import { ChevronRight, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CATS, DEPTS, DEPT_NAMES } from '../data/catalog';
import { useStore } from '../state/store';
import { useOpenDept } from '../lib/useOpenDept';
import { EMPTY_FILTERS, countFilters, filterProducts } from '../lib/catalog';
import { plural } from '../lib/format';
import { Plate } from '../components/Plate';
import { ProductGrid } from '../components/ProductGrid';
import { FilterSheet } from '../components/FilterSheet';
import { CartButton, FilterButton, SearchButton } from '../components/Buttons';

export function Home() {
  const { products, loading, loadError, reloadProducts, owner, cat, setCat, filters, setFilters } = useStore();
  const navigate = useNavigate();
  const openDept = useOpenDept();
  const [sheet, setSheet] = useState(false);
  const list = useMemo(() => filterProducts(products, { cat }, filters), [products, cat, filters]);
  const nFilters = countFilters(filters);
  const clear = () => {
    setFilters(EMPTY_FILTERS);
    setCat('Todos');
  };

  return (
    <div className="screen">
      <div style={{ flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 14px 10px 20px', borderBottom: '1px solid var(--color-divider)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 500 }}>Kele</span>
          <span style={{ fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--color-accent-700)' }}>Calçados</span>
        </div>
        <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {owner && <button className="btn btn-ghost" onClick={() => navigate('/loja')} style={{ fontSize: 12 }}>Painel</button>}
          <SearchButton />
          <CartButton badge />
        </div>
      </div>

      <div className="scroll">
        {cat === 'Todos' && nFilters === 0 && (
          <div style={{ padding: '18px 20px 4px' }}>
            <Plate caption="foto · campanha família" stripe={10} style={{ height: 200 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12, marginTop: 14 }}>
              <div>
                <div className="kicker">Nova coleção · 2026</div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 29, lineHeight: 1.05, marginTop: 4 }}>
                  Um par para<br /><em>cada passo da casa</em>
                </div>
              </div>
              <button className="btn btn-primary" onClick={() => setCat('Novidades')} style={{ flex: 'none' }}>Novidades</button>
            </div>
          </div>
        )}

        <div style={{ padding: '22px 20px 4px' }}>
          <div className="kicker" style={{ marginBottom: 10 }}>Departamentos</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
            {DEPT_NAMES.map((d) => (
              <button
                key={d}
                onClick={() => openDept(d)}
                style={{ background: 'none', border: 0, padding: 0, cursor: 'pointer', font: 'inherit', color: 'var(--color-text)', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 6 }}
              >
                <Plate stripe={7} style={{ width: '100%', aspectRatio: '3 / 4' }}>
                  <span className="tnum" style={{ position: 'absolute', left: 6, top: 4, fontFamily: 'var(--font-heading)', fontSize: 22, color: 'var(--color-accent)' }}>
                    {DEPTS[d].num}
                  </span>
                </Plate>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 600 }}>{d}</span>
                  <ChevronRight size={14} strokeWidth={1.6} color="var(--color-accent)" />
                </div>
                <span className="muted" style={{ fontSize: 11, marginTop: -4 }}>
                  {plural(products.filter((p) => p.dept === d).length, 'modelo', 'modelos')}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="chips" style={{ padding: '18px 20px 4px' }}>
          {CATS.map((c) => (
            <button key={c} className="pill" aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>
          ))}
        </div>

        <div className="list-head">
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: 21, fontWeight: 600 }}>{cat === 'Todos' ? 'Vitrine' : cat}</div>
            <div className="muted tnum" style={{ fontSize: 12 }}>{plural(list.length, 'modelo', 'modelos')}</div>
          </div>
          <FilterButton count={nFilters} onClick={() => setSheet(true)} />
        </div>

        {loadError ? (
          <div style={{ margin: '0 20px 40px', display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start' }}>
            <p className="muted" style={{ margin: 0, fontSize: 14, fontStyle: 'italic' }}>Não foi possível carregar a vitrine.</p>
            <button className="btn btn-secondary" onClick={reloadProducts}>Tentar de novo</button>
          </div>
        ) : loading ? (
          <p className="muted" style={{ margin: '0 20px 40px', fontSize: 14, fontStyle: 'italic' }}>Carregando a vitrine…</p>
        ) : (
          <ProductGrid products={list} kicker={(p) => p.dept} onClear={clear} />
        )}

        <div style={{ margin: '8px 20px 0', padding: '18px 0 24px', borderTop: '1px solid var(--color-divider)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="muted" style={{ fontSize: 11 }}>Kele Calçados · atendimento pelo WhatsApp</span>
          <button
            onClick={() => navigate(owner ? '/loja' : '/loja/entrar')}
            className="muted"
            style={{ background: 'none', border: 0, padding: '6px 0', cursor: 'pointer', font: 'inherit', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Lock size={13} strokeWidth={1.6} />Área da loja
          </button>
        </div>
      </div>

      {sheet && (
        <FilterSheet filters={filters} onChange={setFilters} onClear={clear} onClose={() => setSheet(false)} resultCount={list.length} />
      )}
    </div>
  );
}
