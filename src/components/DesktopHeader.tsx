import { Lock, Package, Search, ShoppingBag } from 'lucide-react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { DEPT_NAMES } from '../data/catalog';
import { useStore } from '../state/store';
import { cartCount } from '../lib/order';
import { useOpenDept } from '../lib/useOpenDept';

/** Cabeçalho do desktop: substitui a tab bar e os cabeçalhos de cada tela do celular. */
export function DesktopHeader() {
  const { lines, owner, query, setQuery, cat, setCat } = useStore();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const openDept = useOpenDept();
  const n = cartCount(lines);

  const goHome = (novidades = false) => {
    setCat(novidades ? 'Novidades' : 'Todos');
    navigate('/');
  };

  return (
    <header className="dheader">
      <div className="dheader-in">
        <button className="dlogo" onClick={() => goHome()} aria-label="Kele Calçados — vitrine">
          <span>Kele</span>
          <span>Calçados</span>
        </button>
        <nav className="dnav" aria-label="Departamentos">
          <button aria-current={pathname === '/' && cat !== 'Novidades' ? 'page' : undefined} onClick={() => goHome()}>Vitrine</button>
          <button aria-current={pathname === '/' && cat === 'Novidades' ? 'page' : undefined} onClick={() => goHome(true)}>Novidades</button>
          {DEPT_NAMES.map((d) => (
            <button key={d} aria-current={pathname === `/departamento/${d.toLowerCase()}` ? 'page' : undefined} onClick={() => openDept(d)}>
              {d}
            </button>
          ))}
        </nav>
        <div className="dsearch">
          <Search size={16} strokeWidth={1.5} />
          <input
            className="input"
            type="search"
            placeholder="Tênis, bota, sandália infantil…"
            aria-label="Buscar produtos"
            value={query}
            onFocus={() => pathname !== '/buscar' && navigate('/buscar')}
            onChange={(e) => {
              setQuery(e.target.value);
              if (pathname !== '/buscar') navigate('/buscar');
            }}
          />
        </div>
        <div className="dactions">
          <NavLink to="/pedidos" className="dlink"><Package size={18} strokeWidth={1.5} />Pedidos</NavLink>
          <NavLink to="/sacola" className="dlink">
            <ShoppingBag size={18} strokeWidth={1.5} />Sacola{n ? <span className="dbadge tnum">{n}</span> : null}
          </NavLink>
          <NavLink to={owner ? '/loja' : '/loja/entrar'} className="dlink" title="Área da loja">
            <Lock size={16} strokeWidth={1.5} />{owner ? 'Painel' : 'Área da loja'}
          </NavLink>
        </div>
      </div>
    </header>
  );
}
