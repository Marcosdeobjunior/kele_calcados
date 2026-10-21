import { ChevronLeft, ListFilter, Search, ShoppingBag } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../state/store';
import { cartCount } from '../lib/order';

/** Volta no histórico; se a página foi aberta direto, vai para `fallback`. */
export function useBack(fallback = '/') {
  const navigate = useNavigate();
  const location = useLocation();
  return () => (location.key !== 'default' ? navigate(-1) : navigate(fallback, { replace: true }));
}

export function BackButton({ fallback = '/', onClick }: { fallback?: string; onClick?: () => void }) {
  const back = useBack(fallback);
  return (
    <button className="btn btn-ghost btn-icon icon-btn" onClick={onClick ?? back} aria-label="Voltar">
      <ChevronLeft size={22} strokeWidth={1.5} />
    </button>
  );
}

export function SearchButton() {
  const navigate = useNavigate();
  return (
    <button className="btn btn-ghost btn-icon icon-btn" onClick={() => navigate('/buscar')} aria-label="Buscar">
      <Search size={20} strokeWidth={1.5} />
    </button>
  );
}

export function CartButton({ badge = false }: { badge?: boolean }) {
  const navigate = useNavigate();
  const n = cartCount(useStore().lines);
  return (
    <button className="btn btn-ghost btn-icon icon-btn" onClick={() => navigate('/sacola')} aria-label="Sacola">
      <ShoppingBag size={20} strokeWidth={1.5} />
      {badge && n > 0 && (
        <span
          className="tnum"
          style={{
            position: 'absolute', top: 2, right: 0, minWidth: 16, height: 16, borderRadius: 8, border: '1px solid var(--color-accent)',
            background: 'var(--color-bg)', color: 'var(--color-accent-700)', fontSize: 10, lineHeight: '14px', textAlign: 'center',
          }}
        >
          {n}
        </span>
      )}
    </button>
  );
}

export function FilterButton({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <button className="btn btn-ghost" onClick={onClick} style={{ fontSize: 13, gap: 6 }}>
      <ListFilter size={16} strokeWidth={1.5} />
      Filtrar{count ? ` · ${count}` : ''}
    </button>
  );
}
