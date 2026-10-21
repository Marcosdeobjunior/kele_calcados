import { useState, type CSSProperties, type FormEvent } from 'react';
import { Lock } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { DEMO_MODE } from '../config';
import { DEMO_OWNER } from '../services/local';
import { useStore } from '../state/store';
import { BackButton } from '../components/Buttons';

export function Login() {
  const { owner, signIn } = useStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [show, setShow] = useState(false);
  const [err, setErr] = useState(false);
  const [busy, setBusy] = useState(false);

  if (owner) return <Navigate to="/loja" replace />;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const ok = await signIn(email, pass);
    setBusy(false);
    if (ok) navigate('/loja', { replace: true });
    else setErr(true);
  };

  return (
    <div className="screen narrow-page" style={{ "--page-w": "440px" } as CSSProperties}>
      <div style={{ flex: 'none', padding: '2px 12px 0' }}><BackButton /></div>
      <form onSubmit={submit} className="scroll" style={{ padding: '36px 28px 28px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div className="circle-icon" style={{ width: 56, height: 56 }}><Lock size={22} strokeWidth={1.4} /></div>
          <div className="kicker" style={{ letterSpacing: '.16em', marginTop: 6 }}>Acesso exclusivo</div>
          <h2 style={{ margin: 0, fontWeight: 400, fontSize: 36, lineHeight: 1.05, letterSpacing: 0 }}>Área da <em>loja</em></h2>
          <p className="muted" style={{ margin: 0, fontSize: 13, lineHeight: 1.55, maxWidth: 260 }}>
            Somente a dona da Kele Calçados entra aqui para cadastrar e editar produtos.
          </p>
        </div>
        <div className="hairline" style={{ margin: '4px 0' }} />
        <label className="field">
          <span className="label">E-mail</span>
          <input
            className={`input ${err ? 'invalid' : ''}`} type="email" autoComplete="username" placeholder="seu@email.com" required
            value={email} onChange={(e) => { setEmail(e.target.value); setErr(false); }} style={{ minHeight: 46 }}
          />
        </label>
        <div className="field">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <label className="label" htmlFor="pass">Senha</label>
            <button type="button" onClick={() => setShow(!show)} style={{ background: 'none', border: 0, padding: 0, cursor: 'pointer', font: 'inherit', fontSize: 12, color: 'var(--color-accent-700)' }}>
              {show ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>
          <input
            id="pass" className={`input ${err ? 'invalid' : ''}`} type={show ? 'text' : 'password'} autoComplete="current-password" placeholder="••••••••" required
            value={pass} onChange={(e) => { setPass(e.target.value); setErr(false); }} style={{ minHeight: 46 }}
          />
        </div>
        {err && <div className="err" style={{ marginTop: -8 }}>E-mail ou senha incorretos.</div>}
        <button className="btn btn-primary cta" type="submit" disabled={busy}>Entrar</button>
        {DEMO_MODE && (
          <div className="muted tnum" style={{ marginTop: 'auto', border: '1px dashed var(--color-divider)', borderRadius: 'var(--radius-md)', padding: '10px 12px', fontSize: 11, lineHeight: 1.6 }}>
            Modo demonstração (sem Supabase) — acesso de teste:<br />{DEMO_OWNER.email} · {DEMO_OWNER.password}
          </div>
        )}
      </form>
    </div>
  );
}
