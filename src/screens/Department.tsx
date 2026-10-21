import { useMemo, useState } from 'react';
import { Navigate, useParams, useSearchParams } from 'react-router-dom';
import { DEPTS, DEPT_NAMES } from '../data/catalog';
import type { Dept } from '../types';
import { useStore } from '../state/store';
import { EMPTY_FILTERS, countFilters, filterProducts } from '../lib/catalog';
import { plural } from '../lib/format';
import { ProductGrid } from '../components/ProductGrid';
import { FilterSheet } from '../components/FilterSheet';
import { BackButton, FilterButton, SearchButton } from '../components/Buttons';

export function Department() {
  const { slug } = useParams();
  const dept = DEPT_NAMES.find((d) => d.toLowerCase() === slug);
  return dept ? <DepartmentView key={dept} dept={dept} /> : <Navigate to="/" replace />;
}

function DepartmentView({ dept }: { dept: Dept }) {
  const { products, filters, setFilters } = useStore();
  const [params, setParams] = useSearchParams();
  const sub = params.get('tipo') || 'Todos';
  const setSub = (t: string) => setParams(t === 'Todos' ? {} : { tipo: t }, { replace: true });
  const [sheet, setSheet] = useState(false);
  const d = DEPTS[dept];
  const all = products.filter((p) => p.dept === dept);
  const list = useMemo(() => filterProducts(products, { dept, sub }, filters), [products, dept, sub, filters]);

  const clear = () => {
    setFilters(EMPTY_FILTERS);
    setSub('Todos');
  };

  return (
    <div className="screen">
      <div className="topbar" style={{ paddingBottom: 0 }}>
        <BackButton />
        <div className="kicker">Departamento</div>
        <SearchButton />
      </div>
      <div className="scroll">
        <div style={{ padding: '6px 20px 0', position: 'relative' }}>
          <span
            aria-hidden
            style={{ position: 'absolute', right: 16, top: -6, fontFamily: 'var(--font-heading)', fontSize: 96, lineHeight: 1, color: 'var(--color-accent-200)', fontVariantNumeric: 'lining-nums tabular-nums' }}
          >
            {d.num}
          </span>
          <h1 style={{ margin: 0, position: 'relative', fontWeight: 400, fontSize: 46, lineHeight: 1, letterSpacing: 0 }}>{dept}</h1>
          <p style={{ margin: '8px 0 0', position: 'relative', maxWidth: 260, fontSize: 13, lineHeight: 1.55, fontStyle: 'italic', color: 'var(--color-neutral-800)' }}>
            {d.line}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 20, overflowX: 'auto', padding: '20px 20px 0', borderBottom: '1px solid var(--color-divider)' }}>
          {['Todos', ...d.subs].map((label) => {
            const on = sub === label;
            const n = label === 'Todos' ? all.length : all.filter((p) => p.type === label).length;
            return (
              <button
                key={label}
                onClick={() => setSub(label)}
                aria-pressed={on}
                style={{
                  flex: 'none', background: 'none', border: 0, borderBottom: `1px solid ${on ? 'var(--color-accent)' : 'transparent'}`, marginBottom: -1,
                  padding: '0 0 10px', cursor: 'pointer', font: 'inherit', fontSize: 14, color: on ? 'var(--color-text)' : 'var(--color-neutral-700)',
                  display: 'flex', alignItems: 'baseline', gap: 5,
                }}
              >
                {label}
                <span className="tnum muted" style={{ fontSize: 10 }}>{n}</span>
              </button>
            );
          })}
        </div>
        <div className="list-head" style={{ paddingTop: 10 }}>
          <div className="muted tnum" style={{ fontSize: 12 }}>{plural(list.length, 'modelo', 'modelos')}</div>
          <FilterButton count={countFilters(filters)} onClick={() => setSheet(true)} />
        </div>
        <ProductGrid products={list} kicker={(p) => p.type} onClear={clear} />
      </div>
      {sheet && (
        <FilterSheet filters={filters} onChange={setFilters} onClear={clear} onClose={() => setSheet(false)} resultCount={list.length} />
      )}
    </div>
  );
}
