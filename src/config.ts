const env = import.meta.env;

/** Número da dona no WhatsApp (só dígitos, com DDI e DDD). */
export const WHATSAPP_NUMBER = String(env.VITE_WHATSAPP_NUMBER || '5511900000000').replace(/\D/g, '');
/** Mostra a opção "Retirar na loja" no checkout. */
export const PICKUP_ENABLED = String(env.VITE_PICKUP_ENABLED ?? 'true') !== 'false';
/** Paleta: Noir & ouro (padrão) ou Marfim. */
export const PALETTE: 'noir' | 'marfim' = env.VITE_PALETTE === 'marfim' ? 'marfim' : 'noir';

export const SUPABASE_URL: string = env.VITE_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY: string = env.VITE_SUPABASE_ANON_KEY || '';
/** Sem Supabase o app roda em modo demonstração (dados no localStorage). */
export const DEMO_MODE = !SUPABASE_URL || !SUPABASE_ANON_KEY;
