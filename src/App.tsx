import { useEffect, type ReactNode } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { StoreProvider, useStore } from './state/store';
import { TabBar } from './components/TabBar';
import { Toast } from './components/Toast';
import { DesktopHeader } from './components/DesktopHeader';
import { useIsDesktop } from './lib/useIsDesktop';
import { Home } from './screens/Home';
import { Department } from './screens/Department';
import { Search } from './screens/Search';
import { ProductDetail } from './screens/ProductDetail';
import { Cart } from './screens/Cart';
import { Checkout } from './screens/Checkout';
import { Sent } from './screens/Sent';
import { Orders } from './screens/Orders';
import { Login } from './screens/Login';
import { Admin } from './screens/Admin';
import { EditProduct } from './screens/EditProduct';

const TAB_ROUTES = [/^\/$/, /^\/departamento\//, /^\/buscar$/, /^\/sacola$/, /^\/pedidos$/];

function RequireOwner({ children }: { children: ReactNode }) {
  const { owner, authReady } = useStore();
  if (!authReady) return null;
  return owner ? children : <Navigate to="/loja/entrar" replace />;
}

function Shell() {
  const { pathname } = useLocation();
  const { dismissToast } = useStore();
  const desktop = useIsDesktop();
  // O toast some ao trocar de tela; no painel ele acompanha a volta após salvar.
  useEffect(() => {
    if (!pathname.startsWith('/loja')) dismissToast();
  }, [pathname]);

  return (
    <div className="app">
      {desktop && <DesktopHeader />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/departamento/:slug" element={<Department />} />
        <Route path="/buscar" element={<Search />} />
        <Route path="/produto/:id" element={<ProductDetail />} />
        <Route path="/sacola" element={<Cart />} />
        <Route path="/pedido" element={<Checkout />} />
        <Route path="/pedido/enviado" element={<Sent />} />
        <Route path="/pedidos" element={<Orders />} />
        <Route path="/loja/entrar" element={<Login />} />
        <Route path="/loja" element={<RequireOwner><Admin /></RequireOwner>} />
        <Route path="/loja/produto/:id" element={<RequireOwner><EditProduct /></RequireOwner>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toast />
      {!desktop && TAB_ROUTES.some((r) => r.test(pathname)) && <TabBar />}
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <Shell />
      </StoreProvider>
    </BrowserRouter>
  );
}
