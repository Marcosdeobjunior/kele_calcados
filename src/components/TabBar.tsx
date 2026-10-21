import { House, Package, Search, ShoppingBag } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useStore } from '../state/store';
import { cartCount } from '../lib/order';

export function TabBar() {
  const { pathname } = useLocation();
  const n = cartCount(useStore().lines);
  const tabs = [
    { to: '/', label: 'Vitrine', Icon: House, active: pathname === '/' || pathname.startsWith('/departamento') },
    { to: '/buscar', label: 'Buscar', Icon: Search, active: pathname === '/buscar' },
    { to: '/sacola', label: n ? `Sacola (${n})` : 'Sacola', Icon: ShoppingBag, active: pathname === '/sacola' },
    { to: '/pedidos', label: 'Pedidos', Icon: Package, active: pathname === '/pedidos' },
  ];
  return (
    <nav className="tabbar" aria-label="Navegação principal">
      {tabs.map(({ to, label, Icon, active }) => (
        <NavLink key={to} to={to} className={active ? 'active' : ''} aria-current={active ? 'page' : undefined}>
          <Icon size={22} strokeWidth={1.5} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
