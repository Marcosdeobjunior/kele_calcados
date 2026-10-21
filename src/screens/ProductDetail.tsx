import { useState } from 'react';
import { Pencil } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../state/store';
import { fmt } from '../lib/format';
import { Plate } from '../components/Plate';
import { BackButton, CartButton } from '../components/Buttons';

export function ProductDetail() {
  const { id } = useParams();
  const { products, loading, owner, addToCart, flash } = useStore();
  const navigate = useNavigate();
  const [color, setColor] = useState(0);
  const [size, setSize] = useState<number | null>(null);
  const [sizeErr, setSizeErr] = useState(false);
  const p = products.find((x) => x.id === id);

  if (!p)
    return (
      <div className="screen">
        <div className="topbar"><BackButton /></div>
        <div className="empty">
          <div className="title">{loading ? 'Carregando…' : 'Produto indisponível'}</div>
          {!loading && <p>Este par saiu da vitrine.</p>}
        </div>
      </div>
    );

  const colorName = p.colors[color]?.[0] ?? '';
  const add = () => {
    if (size == null) return setSizeErr(true);
    addToCart(p.id, color, size);
    flash(`Adicionado: ${p.name} · ${size}`, true);
  };

  return (
    <div className="screen">
      <div className="topbar">
        <BackButton />
        <div className="kicker">{p.dept} · {p.type}</div>
        <CartButton />
      </div>
      <div className="scroll" style={{ padding: '0 20px 24px' }}>
        <Plate photo={p.photos?.[0]} caption={`foto · ${p.name.toLowerCase()} · ${colorName}`} stripe={12} style={{ aspectRatio: '1 / 1' }} />
        <h2 style={{ margin: '18px 0 0', fontWeight: 500, fontSize: 32, lineHeight: 1.05, letterSpacing: 0 }}>{p.name}</h2>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 6, flexWrap: 'wrap' }}>
          <span className="tnum" style={{ fontSize: 18 }}>{fmt(p.price)}</span>
          <span className="muted" style={{ fontSize: 12 }}>ou 3× de {fmt(p.price / 3)} · combinado no WhatsApp</span>
        </div>
        {owner && (
          <button className="btn btn-secondary" onClick={() => navigate(`/loja/produto/${p.id}`)} style={{ marginTop: 12, gap: 6, fontSize: 13 }}>
            <Pencil size={14} strokeWidth={1.5} />Editar este produto
          </button>
        )}
        <div className="hairline" style={{ margin: '18px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
          <span>Cor</span><span className="muted" style={{ fontStyle: 'italic' }}>{colorName}</span>
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 10, flexWrap: 'wrap' }}>
          {p.colors.map(([name, hex], i) => (
            <button key={hex + i} className="swatch" aria-label={name} aria-pressed={i === color} onClick={() => setColor(i)}>
              <span style={{ background: hex }} />
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: 13, marginTop: 22 }}>
          <span>Tamanho</span><span className="muted" style={{ fontSize: 12 }}>riscado = esgotado</span>
        </div>
        <div className="size-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginTop: 10 }}>
          {p.sizes.map((n) => (
            <button
              key={n}
              className="size"
              disabled={p.off.includes(n)}
              aria-pressed={size === n}
              onClick={() => { setSize(n); setSizeErr(false); }}
              style={{ height: 44, fontSize: 14, borderColor: sizeErr ? 'var(--color-accent-400)' : undefined }}
            >
              {n}
            </button>
          ))}
        </div>
        {sizeErr && <div className="err" style={{ marginTop: 8 }}>Escolha um tamanho para continuar.</div>}
        <div className="hairline" style={{ margin: '20px 0 14px' }} />
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, textAlign: 'justify', hyphens: 'auto' }} lang="pt-BR">{p.desc}</p>
      </div>
      <div className="footer-cta" style={{ paddingBottom: 'calc(26px + env(safe-area-inset-bottom))' }}>
        <button className="btn btn-primary cta" onClick={add}>Adicionar à sacola</button>
      </div>
    </div>
  );
}
