import { useNavigate } from 'react-router-dom';
import { useStore } from '../state/store';

export function Toast() {
  const { toast } = useStore();
  const navigate = useNavigate();
  if (!toast) return null;
  return (
    <div className="toast" role="status">
      <span style={{ padding: '6px 0' }}>{toast.msg}</span>
      {toast.withCart && (
        <button className="btn btn-ghost" onClick={() => navigate('/sacola')} style={{ fontSize: 13 }}>Ver sacola</button>
      )}
    </div>
  );
}
