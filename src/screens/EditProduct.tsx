import { useRef, useState, type ChangeEvent } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { DEPTS, DEPT_NAMES, PRESET_COLORS } from '../data/catalog';
import type { Dept } from '../types';
import { useStore } from '../state/store';
import { backend } from '../services/backend';
import { cycleSize, draftErrors, draftFromProduct, emptyDraft, productFromDraft, type Draft } from '../lib/productForm';
import { Plate } from '../components/Plate';
import { BackButton } from '../components/Buttons';

const MAX_PHOTOS = 5;

export function EditProduct() {
  const { id } = useParams();
  const { products, loading } = useStore();
  if (id === 'novo') return <Editor key="novo" initial={emptyDraft()} />;
  const p = products.find((x) => x.id === id);
  if (!p) return loading ? null : <Navigate to="/loja" replace />;
  return <Editor key={p.id} editId={p.id} initial={draftFromProduct(p)} />;
}

function Editor({ initial, editId }: { initial: Draft; editId?: string }) {
  const { saveProduct, deleteProduct, flash } = useStore();
  const navigate = useNavigate();
  const [d, setD] = useState<Draft>(initial);
  const [tried, setTried] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fail, setFail] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const errs = tried ? draftErrors(d) : [];
  const patch = (p: Partial<Draft>) => setD((cur) => ({ ...cur, ...p }));
  const back = () => navigate('/loja', { replace: true });

  const save = async () => {
    if (draftErrors(d).length) return setTried(true);
    setBusy(true);
    setFail('');
    try {
      await saveProduct(productFromDraft(d, editId));
      flash(editId ? 'Alterações salvas' : 'Produto adicionado à vitrine');
      back();
    } catch {
      setFail('Não foi possível salvar. Verifique a conexão e tente de novo.');
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!editId) return;
    setBusy(true);
    try {
      await deleteProduct(editId);
      flash('Produto removido');
      back();
    } catch {
      setConfirmDel(false);
      setFail('Não foi possível excluir. Tente de novo.');
      setBusy(false);
    }
  };

  const addPhotos = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, MAX_PHOTOS - d.photos.length);
    e.target.value = '';
    if (!files.length) return;
    setUploading(true);
    try {
      const urls = await Promise.all(files.map((f) => backend.uploadPhoto(f)));
      setD((cur) => ({ ...cur, photos: [...cur.photos, ...urls] }));
    } catch {
      setFail('Não foi possível enviar a foto.');
    } finally {
      setUploading(false);
    }
  };

  const range = DEPTS[d.dept].range;
  const pickBtn = <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} style={photoSlot}><Plus size={18} strokeWidth={1.5} />{uploading ? 'Enviando…' : 'Foto'}</button>;

  return (
    <div className="screen">
      <div className="topbar titled">
        <BackButton onClick={back} />
        <div className="title">{editId ? 'Editar produto' : 'Novo produto'}</div>
      </div>
      <div className="scroll" style={{ padding: '16px 20px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          <Plate photo={d.photos[0]} caption="foto principal" stripe={10} style={{ gridColumn: 'span 2', gridRow: 'span 2', aspectRatio: '1 / 1' }}>
            {d.photos[0] && <RemovePhoto onClick={() => patch({ photos: d.photos.slice(1) })} />}
          </Plate>
          {d.photos.slice(1).map((src, i) => (
            <Plate key={src} photo={src} style={{ aspectRatio: '1 / 1' }}>
              <RemovePhoto onClick={() => patch({ photos: d.photos.filter((_, j) => j !== i + 1) })} />
            </Plate>
          ))}
          {d.photos.length < MAX_PHOTOS && pickBtn}
          {d.photos.length < 2 && pickBtn}
          <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={addPhotos} />
        </div>

        <label className="field">
          <span className="label">Nome do produto</span>
          <input className={`input ${errs.includes('name') ? 'invalid' : ''}`} placeholder="Ex.: Sandália Lis" value={d.name} onChange={(e) => patch({ name: e.target.value })} />
        </label>

        <label className="field">
          <span className="label">Preço</span>
          <div style={{ position: 'relative' }}>
            <span className="muted" style={{ position: 'absolute', left: 12, top: 12, fontSize: 14 }}>R$</span>
            <input
              className={`input tnum ${errs.includes('price') ? 'invalid' : ''}`} inputMode="decimal" placeholder="0,00" value={d.price}
              onChange={(e) => patch({ price: e.target.value.replace(/[^0-9,]/g, '') })} style={{ paddingLeft: 38, width: '100%' }}
            />
          </div>
        </label>

        <div className="field">
          <span className="label">Departamento</span>
          <div className="seg">
            {DEPT_NAMES.map((k: Dept) => (
              <button key={k} type="button" aria-pressed={d.dept === k} onClick={() => d.dept !== k && patch({ dept: k, type: DEPTS[k].subs[0], sizes: [], off: [] })}>
                {k}
              </button>
            ))}
          </div>
        </div>

        <div className="field" style={{ gap: 8 }}>
          <span className="label">Subcategoria</span>
          <div className="chips wrap">
            {DEPTS[d.dept].subs.map((t) => (
              <button key={t} type="button" className="pill" style={{ padding: '8px 14px' }} aria-pressed={d.type === t} onClick={() => patch({ type: t })}>{t}</button>
            ))}
          </div>
        </div>

        <div className="field" style={{ gap: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, fontSize: 12 }}>
            <span>Cores</span>
            <span className="muted" style={{ fontStyle: 'italic', textAlign: 'right' }}>{d.colors.length ? d.colors.map((c) => c[0]).join(', ') : 'nenhuma selecionada'}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10, justifyItems: 'center' }}>
            {PRESET_COLORS.map(([name, hex]) => {
              const on = d.colors.some((c) => c[1] === hex);
              return (
                <button
                  key={hex} type="button" className="swatch" aria-label={name} title={name} aria-pressed={on} style={{ width: 40, height: 40 }}
                  onClick={() => patch({ colors: on ? d.colors.filter((c) => c[1] !== hex) : [...d.colors, [name, hex]] })}
                >
                  <span style={{ background: hex }} />
                  {on && <span style={{ position: 'absolute', right: -2, top: -2, width: 14, height: 14, borderRadius: '50%', background: 'var(--color-bg)', border: '1px solid var(--color-accent)' }} />}
                </button>
              );
            })}
          </div>
          {errs.includes('colors') && <span className="err">Escolha ao menos uma cor.</span>}
        </div>

        <div className="field" style={{ gap: 8 }}>
          <span className="label">Tamanhos</span>
          <div className="muted" style={{ fontSize: 11, lineHeight: 1.5 }}>Toque para alternar: tracejado = não oferece · contorno dourado = disponível · riscado = esgotado</div>
          <div className="size-grid" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {range.map((n) => {
              const has = d.sizes.includes(n);
              const out = d.off.includes(n);
              return (
                <button
                  key={n} type="button" className="size" onClick={() => patch(cycleSize(d, n))}
                  aria-label={`${n}: ${!has ? 'não oferece' : out ? 'esgotado' : 'disponível'}`}
                  style={{
                    background: has && !out ? 'var(--sel-bg)' : 'transparent',
                    border: `1px ${has ? 'solid' : 'dashed'} ${has ? (out ? 'var(--color-accent-400)' : 'var(--color-accent)') : 'var(--color-divider)'}`,
                    color: has ? (out ? 'var(--color-neutral-700)' : 'var(--color-accent-700)') : 'var(--color-neutral-400)',
                    textDecoration: out ? 'line-through' : 'none',
                  }}
                >
                  {n}
                </button>
              );
            })}
          </div>
          {errs.includes('sizes') && <span className="err">Deixe ao menos um tamanho disponível.</span>}
        </div>

        <label className="field">
          <span className="label">Descrição</span>
          <textarea className="input" rows={4} placeholder="Material, altura do salto, conforto…" value={d.desc} onChange={(e) => patch({ desc: e.target.value })} style={{ resize: 'none', lineHeight: 1.55, paddingTop: 10 }} />
        </label>

        <button
          type="button" onClick={() => patch({ isNew: !d.isNew })} aria-pressed={d.isNew}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', border: `1px solid ${d.isNew ? 'var(--color-accent)' : 'var(--color-divider)'}`, borderRadius: 'var(--radius-md)', background: 'transparent', cursor: 'pointer', font: 'inherit', color: 'var(--color-text)' }}
        >
          <span style={{ fontSize: 13 }}>Destacar como novidade</span>
          <span style={{ fontSize: 12, color: d.isNew ? 'var(--color-accent-700)' : 'var(--color-neutral-700)' }}>{d.isNew ? 'Sim, marcar como Novo' : 'Não marcar'}</span>
        </button>

        {errs.length > 0 && <div className="err">Revise os campos destacados antes de salvar.</div>}
        {fail && <div className="err">{fail}</div>}
        {editId && (
          <button type="button" className="btn btn-ghost muted" onClick={() => setConfirmDel(true)} style={{ alignSelf: 'center', fontSize: 13, gap: 6, color: 'var(--color-neutral-700)' }}>
            <Trash2 size={14} strokeWidth={1.5} />Excluir produto
          </button>
        )}
      </div>
      <div className="footer-cta" style={{ paddingBottom: 'calc(26px + env(safe-area-inset-bottom))' }}>
        <button className="btn btn-primary cta" onClick={save} disabled={busy || uploading}>{editId ? 'Salvar alterações' : 'Publicar na vitrine'}</button>
      </div>

      {confirmDel && (
        <div className="modal-wrap" role="alertdialog" aria-modal="true" aria-labelledby="del-title">
          <div className="modal">
            <div id="del-title" style={{ fontFamily: 'var(--font-heading)', fontSize: 24 }}>Excluir “{d.name}”?</div>
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: 'var(--color-neutral-800)' }}>
              O produto sai da vitrine e das sacolas abertas. Essa ação não pode ser desfeita.
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
              <button className="btn btn-secondary" onClick={() => setConfirmDel(false)} style={{ flex: 1, height: 44 }}>Cancelar</button>
              <button className="btn btn-primary" onClick={remove} disabled={busy} style={{ flex: 1, height: 44 }}>Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RemovePhoto({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button" onClick={onClick} aria-label="Remover foto"
      style={{ position: 'absolute', top: 4, right: 4, width: 24, height: 24, borderRadius: '50%', border: '1px solid var(--color-divider)', background: 'var(--color-bg)', color: 'var(--color-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}
    >
      <X size={14} strokeWidth={1.5} />
    </button>
  );
}

const photoSlot = {
  font: 'inherit', border: '1px dashed var(--color-divider)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
  gap: 4, fontSize: 11, color: 'var(--color-neutral-700)', cursor: 'pointer', background: 'transparent', aspectRatio: '1 / 1',
} as const;
