import { Check } from 'lucide-react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../state/store';
import { fmt } from '../lib/format';
import { openWhatsApp } from '../lib/whatsapp';

const STEPS = [
  'A loja confirma estoque, tamanho e o valor do frete.',
  'Você recebe a chave Pix ou o link de pagamento na conversa.',
  'Pagamento confirmado, o pedido segue para entrega.',
];

export function Sent() {
  const { orders } = useStore();
  const navigate = useNavigate();
  const id = (useLocation().state as { id?: string } | null)?.id;
  const order = orders.find((o) => o.id === id);
  if (!order) return <Navigate to="/pedidos" replace />;

  return (
    <div className="screen scroll narrow-page" style={{ padding: '40px 28px calc(28px + env(safe-area-inset-bottom))', alignItems: 'center', textAlign: 'center', gap: 12 }}>
      <div className="circle-icon" style={{ width: 72, height: 72, flex: 'none' }}><Check size={30} strokeWidth={1.4} /></div>
      <div className="kicker tnum" style={{ marginTop: 8 }}>Pedido {order.id} · {fmt(order.total)}</div>
      <h2 style={{ margin: 0, fontWeight: 400, fontSize: 34, lineHeight: 1.05, letterSpacing: 0 }}>Pedido enviado<br /><em>para a Kele</em></h2>
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: 'var(--color-neutral-800)', maxWidth: 290 }}>
        Agora é só seguir pelo WhatsApp. A sacola foi esvaziada e o pedido ficou salvo em Pedidos.
      </p>
      <div style={{ width: '100%', textAlign: 'left', marginTop: 12, borderTop: '1px solid var(--color-divider)' }}>
        {STEPS.map((s, i) => (
          <div key={s} style={{ display: 'flex', gap: 14, padding: '13px 0', borderBottom: '1px solid var(--color-divider)' }}>
            <span className="tnum" style={{ fontFamily: 'var(--font-heading)', fontSize: 20, color: 'var(--color-accent-700)' }}>{i + 1}</span>
            <span style={{ fontSize: 13, lineHeight: 1.5 }}>{s}</span>
          </div>
        ))}
      </div>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10, marginTop: 'auto', paddingTop: 16 }}>
        <button className="btn btn-primary" onClick={() => openWhatsApp(order.text)} style={{ width: '100%', height: 48 }}>Abrir conversa novamente</button>
        <button className="btn btn-secondary" onClick={() => navigate('/pedidos')} style={{ width: '100%', height: 48 }}>Ver meus pedidos</button>
      </div>
    </div>
  );
}
