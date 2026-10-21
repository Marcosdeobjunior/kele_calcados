import { useStore } from '../state/store';
import { fmt } from '../lib/format';
import { formatWhen } from '../lib/order';
import { openWhatsApp } from '../lib/whatsapp';

export function Orders() {
  const { orders } = useStore();
  return (
    <div className="screen">
      <div className="header title">Pedidos</div>
      <div className="scroll">
        {orders.length === 0 && (
          <div className="empty">
            <div className="title">Nenhum pedido enviado</div>
            <p>Pedidos enviados pelo WhatsApp aparecem aqui para você retomar a conversa.</p>
          </div>
        )}
        {orders.map((o) => (
          <div key={o.id} style={{ padding: '18px 20px', borderBottom: '1px solid var(--color-divider)', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="tnum" style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 600 }}>{o.id}</span>
              <span className="tag tag-accent">Enviado à loja</span>
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--color-neutral-800)' }}>{o.summary}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="muted tnum" style={{ fontSize: 12 }}>{formatWhen(o.createdAt)} · {fmt(o.total)}</span>
              <button className="btn btn-ghost" onClick={() => openWhatsApp(o.text)} style={{ fontSize: 13 }}>Abrir conversa</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
