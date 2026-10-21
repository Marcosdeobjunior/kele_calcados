import { useRef, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { PICKUP_ENABLED } from '../config';
import { PAYMENTS } from '../data/catalog';
import type { CheckoutForm, DeliveryMode } from '../types';
import { useStore } from '../state/store';
import { buildMessage, cartTotal, missingFields, orderId, orderSummary, requiredFields } from '../lib/order';
import { maskCep } from '../lib/format';
import { openWhatsApp, waDisplay } from '../lib/whatsapp';
import { BackButton } from '../components/Buttons';
import { useIsDesktop } from '../lib/useIsDesktop';

type FieldDef = [key: keyof CheckoutForm, label: string, placeholder: string, span: number, mode: 'text' | 'numeric'];

const ADDRESS_FIELDS: FieldDef[] = [
  ['name', 'Nome completo', 'Como devemos te chamar?', 6, 'text'],
  ['cep', 'CEP', '00000-000', 2, 'numeric'],
  ['street', 'Rua / Avenida', 'Rua das Flores', 4, 'text'],
  ['num', 'Número', '123', 2, 'numeric'],
  ['comp', 'Complemento', 'Apto, bloco (opcional)', 4, 'text'],
  ['bairro', 'Bairro', 'Centro', 3, 'text'],
  ['city', 'Cidade / UF', 'São Paulo / SP', 3, 'text'],
];

export function Checkout() {
  const { lines, orders, addOrder, clearCart, form, setForm, delivery: storedDelivery, setDelivery, payment, setPayment } = useStore();
  const navigate = useNavigate();
  const [tried, setTried] = useState(false);
  // Depois do envio a sacola esvazia antes da troca de rota; não redirecionar para a sacola nesse meio-tempo.
  const sent = useRef(false);
  const desktop = useIsDesktop();
  const delivery: DeliveryMode = PICKUP_ENABLED ? storedDelivery : 'entrega';

  if (!lines.length) return sent.current ? null : <Navigate to="/sacola" replace />;

  const id = orderId(orders.length);
  const message = buildMessage(id, lines, form, delivery, payment);
  const required = requiredFields(delivery);
  const missing = tried ? missingFields(form, delivery) : [];
  const fields = delivery === 'entrega' ? ADDRESS_FIELDS : ADDRESS_FIELDS.slice(0, 1);

  const set = (k: keyof CheckoutForm, v: string) => setForm({ ...form, [k]: k === 'cep' ? maskCep(v) : v });

  const send = () => {
    if (missingFields(form, delivery).length) return setTried(true);
    addOrder({ id, text: message, total: cartTotal(lines), summary: orderSummary(lines), createdAt: new Date().toISOString() });
    openWhatsApp(message);
    sent.current = true;
    clearCart();
    navigate('/pedido/enviado', { replace: true, state: { id } });
  };

  const sendButton = (
    <button className="btn btn-primary cta" onClick={send} style={desktop ? { marginTop: 20 } : undefined}>
      <MessageCircle size={18} strokeWidth={1.5} />Enviar pedido no WhatsApp
    </button>
  );

  return (
    <div className="screen">
      <div className="topbar titled">
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <BackButton fallback="/sacola" />
          <div className="title">Dados do pedido</div>
        </div>
      </div>
      <div className="scroll">
      <div className="container split">
      <div style={{ padding: '16px 20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: 'var(--color-neutral-800)', textAlign: 'justify' }}>
          Vamos montar a mensagem para a loja. Frete e pagamento são confirmados por lá.
        </p>
        {PICKUP_ENABLED && (
          <div className="field">
            <span className="label">Como prefere receber?</span>
            <div className="seg">
              {([['entrega', 'Entrega no endereço'], ['retirada', 'Retirar na loja']] as const).map(([v, label]) => (
                <button key={v} aria-pressed={delivery === v} onClick={() => setDelivery(v)} style={{ height: 42 }}>{label}</button>
              ))}
            </div>
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px 10px' }}>
          {fields.map(([k, label, ph, span, mode]) => (
            <label key={k} className="field" style={{ gridColumn: `span ${span}`, gap: 5 }}>
              <span className="label">{label}</span>
              <input
                className={`input ${missing.includes(k) ? 'invalid' : ''}`}
                placeholder={ph}
                value={form[k]}
                inputMode={mode}
                required={required.includes(k)}
                autoComplete={AUTOCOMPLETE[k]}
                onChange={(e) => set(k, e.target.value)}
              />
            </label>
          ))}
        </div>
        {missing.length > 0 && <div className="err" style={{ marginTop: -6 }}>Preencha os campos destacados para enviar.</div>}
        <div className="field" style={{ gap: 8 }}>
          <span className="label">Pagamento preferido</span>
          <div className="chips wrap">
            {PAYMENTS.map((p) => (
              <button key={p} className="pill" style={{ padding: '9px 14px' }} aria-pressed={payment === p} onClick={() => setPayment(p)}>{p}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="split-aside" style={{ padding: '16px 20px 24px', alignSelf: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="kicker">Prévia da mensagem</div>
          <div
            className="tnum"
            style={{
              border: '1px solid var(--color-divider)', borderRadius: 'var(--radius-lg) var(--radius-lg) 2px var(--radius-lg)', padding: '14px 16px',
              fontSize: 12.5, lineHeight: 1.6, whiteSpace: 'pre-wrap', background: 'color-mix(in srgb, var(--color-accent-100) 45%, transparent)',
            }}
          >
            {message}
          </div>
          <div className="muted tnum" style={{ fontSize: 11, textAlign: 'right' }}>para Kele Calçados · {waDisplay()}</div>
        </div>
        {desktop && sendButton}
      </div>
      </div>
      </div>
      {!desktop && <div className="footer-cta">{sendButton}</div>}
    </div>
  );
}

const AUTOCOMPLETE: Record<keyof CheckoutForm, string> = {
  name: 'name', cep: 'postal-code', street: 'address-line1', num: 'address-line2', comp: 'address-line3', bairro: 'address-level3', city: 'address-level2',
};
