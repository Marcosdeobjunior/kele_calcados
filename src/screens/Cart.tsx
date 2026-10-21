import { MessageCircle, Minus, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../state/store';
import { cartCount, cartTotal } from '../lib/order';
import { fmt } from '../lib/format';
import { useIsDesktop } from '../lib/useIsDesktop';
import { Plate } from '../components/Plate';

export function Cart() {
  const { lines, changeQty, removeFromCart } = useStore();
  const navigate = useNavigate();
  const desktop = useIsDesktop();
  const count = cartCount(lines);
  const total = fmt(cartTotal(lines));

  const summary = (
    <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}><span>Subtotal</span><span className="tnum">{total}</span></div>
      <div className="muted" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}><span>Frete</span><span style={{ fontStyle: 'italic' }}>a combinar</span></div>
      <div style={{ border: '1px solid var(--color-divider)', borderRadius: 'var(--radius-md)', padding: '12px 14px', marginTop: 10, fontSize: 12, lineHeight: 1.55, color: 'var(--color-neutral-800)', display: 'flex', gap: 10 }}>
        <MessageCircle size={18} strokeWidth={1.5} color="var(--color-accent)" style={{ flex: 'none', marginTop: 1 }} />
        <span>Nenhum pagamento é feito no app. Sua sacola vira uma mensagem para a Kele, que confirma estoque e frete e envia o pagamento pela conversa.</span>
      </div>
    </div>
  );

  const checkout = (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
        <span style={{ fontSize: 13 }}>Total dos itens</span>
        <span className="tnum" style={{ fontFamily: 'var(--font-heading)', fontSize: 24 }}>{total}</span>
      </div>
      <button className="btn btn-primary cta" onClick={() => navigate('/pedido')}>
        <MessageCircle size={18} strokeWidth={1.5} />Finalizar compra
      </button>
    </>
  );

  const items = lines.map((l) => (
    <div key={`${l.productId}|${l.colorIndex}|${l.size}`} style={{ display: 'flex', gap: 14, padding: '16px 20px', borderBottom: '1px solid var(--color-divider)' }}>
      <button onClick={() => navigate(`/produto/${l.productId}`)} aria-label={l.product.name} style={{ padding: 0, border: 0, background: 'none', cursor: 'pointer', flex: 'none' }}>
        <Plate photo={l.product.photos?.[0]} stripe={6} style={{ width: 84, height: 100 }} />
      </button>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 600, lineHeight: 1.1 }}>{l.product.name}</div>
          <button onClick={() => removeFromCart(l)} aria-label="Remover" className="muted" style={{ background: 'none', border: 0, padding: 2, cursor: 'pointer' }}>
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>
        <div className="muted tnum" style={{ fontSize: 12 }}>Tam. {l.size} · {l.colorName} · {fmt(l.product.price)}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-divider)', borderRadius: 'var(--radius-md)' }}>
            <button onClick={() => changeQty(l, -1)} aria-label="Menos" style={stepBtn}><Minus size={14} strokeWidth={1.6} /></button>
            <span className="tnum" style={{ minWidth: 22, textAlign: 'center', fontSize: 14 }}>{l.qty}</span>
            <button onClick={() => changeQty(l, 1)} aria-label="Mais" style={stepBtn}><Plus size={14} strokeWidth={1.6} /></button>
          </div>
          <span className="tnum" style={{ fontSize: 14 }}>{fmt(l.line)}</span>
        </div>
      </div>
    </div>
  ));

  const header = (
    <div className="header" style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
      <div className="title">Sacola</div>
      <div className="muted tnum" style={{ fontSize: 12 }}>{count ? `${count} ${count > 1 ? 'pares' : 'par'}` : ''}</div>
    </div>
  );

  const empty = (
    <div className="empty">
      <div className="title">Sua sacola está vazia</div>
      <p>Escolha um par na vitrine — o pedido é finalizado com a loja pelo WhatsApp.</p>
      <button className="btn btn-primary" onClick={() => navigate('/')} style={{ marginTop: 8 }}>Ver vitrine</button>
    </div>
  );

  if (desktop)
    return (
      <div className="screen">
        <div className="scroll">
          <div className="container">
            {header}
            {count === 0 ? empty : (
              <div className="split">
                <div>{items}</div>
                <aside className="split-aside">
                  {summary}
                  <div style={{ padding: '0 20px 20px' }}>{checkout}</div>
                </aside>
              </div>
            )}
          </div>
        </div>
      </div>
    );

  return (
    <div className="screen">
      {header}
      <div className="scroll">
        {count === 0 ? empty : <>{items}{summary}</>}
      </div>
      {count > 0 && <div className="footer-cta" style={{ paddingBottom: 14 }}>{checkout}</div>}
    </div>
  );
}

const stepBtn = { width: 36, height: 34, background: 'none', border: 0, cursor: 'pointer', color: 'var(--color-text)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' } as const;
