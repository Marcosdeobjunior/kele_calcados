import { useSyncExternalStore } from 'react';

/** Largura a partir da qual o app usa o layout de desktop (cabeçalho no topo, telas em colunas). */
export const DESKTOP_QUERY = '(min-width: 900px)';

const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(DESKTOP_QUERY);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};

export const useIsDesktop = () =>
  useSyncExternalStore(subscribe, () => window.matchMedia(DESKTOP_QUERY).matches, () => false);
