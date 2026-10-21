import { useState, type CSSProperties } from 'react';
import { LogOut, Pencil, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../state/store';
import { availableSizes } from '../lib/catalog';
import { fmt, norm, plural } from '../lib/format';
import { Plate } from '../components/Plate';

export function Admin() {
  const { products, signOut } = useStore();
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const nq = norm(q.trim());
  const list = products.filter((p) => !nq || norm(`${p.name} ${p.dept} ${p.type}`).includes(nq));

  return (
    <div className="screen narrow-page" style={{ "--page-w": "880px" } as CSSProperties}>
      <div className="header" style={{ flex: 'none', padding: '6px 14px 12px 20px', borderBottom: '1px solid var(--color-divider)', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="kicker" style={{ letterSpacing: '.14em' }}>Painel da dona</div>
            <div className="title">Produtos</div>
          </div>
          <div style={{ display: 'flex', gap: 2 }}>
            <button className="btn btn-ghost" onClick={() => navigate('/')} style={{ fontSize: 13, whiteSpace: 'nowrap' }}>Ver vitrine</button>
            <button
              className="btn btn-ghost btn-icon icon-btn" aria-label="Sair"
              onClick={async () => { await signOut(); navigate('/', { replace: true }); }}
            >
              <LogOut size={19} strokeWidth={1.5} />
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, paddingRight: 6 }}>
          <input className="input" type="search" placeholder="Buscar no estoque" aria-label="Buscar no estoque" value={q} onChange={(e) => setQ(e.target.value)} style={{ minHeight: 42, flex: 1 }} />
          <button className="btn btn-primary" onClick={() => navigate('/loja/produto/novo')} style={{ flex: 'none', height: 42, gap: 6 }}>
            <Plus size={16} strokeWidth={1.6} />Novo
          </button>
        </div>
      </div>
      <div className="scroll">
        <div className="muted tnum" style={{ padding: '10px 20px 4px', fontSize: 12 }}>{plural(products.length, 'produto', 'produtos')} na vitrine</div>
        {list.map((p) => {
          const av = availableSizes(p).length;
          return (
            <button key={p.id} className="row-btn" onClick={() => navigate(`/loja/produto/${p.id}`)}>
              <Plate photo={p.photos?.[0]} stripe={6} style={{ width: 56, height: 66, flex: 'none' }} />
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 600 }}>{p.name}</span>
                  {p.isNew && <span className="tag tag-outline" style={{ fontSize: 9, padding: '1px 6px' }}>Novo</span>}
                </div>
                <span className="muted" style={{ fontSize: 11 }}>{p.dept} · {p.type}</span>
                <span style={{ fontSize: 11, color: av ? 'var(--color-neutral-700)' : 'var(--color-accent-700)' }}>
                  {av ? `${plural(av, 'tamanho disponível', 'tamanhos disponíveis')}` : 'Esgotado'}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                <span className="tnum" style={{ fontSize: 13 }}>{fmt(p.price)}</span>
                <span style={{ fontSize: 11, color: 'var(--color-accent-700)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Pencil size={12} strokeWidth={1.6} />Editar
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
