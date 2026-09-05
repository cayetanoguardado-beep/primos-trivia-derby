import { getAdminSupabase } from './supabase';
import { cleanRoomCode } from './api';

export async function requireHost(roomCode, hostKey) {
  const code = cleanRoomCode(roomCode);
  if (!code || !hostKey) return { ok:false, status:401, error:'Missing host credentials.' };
  const supabase = getAdminSupabase();
  const { data:room } = await supabase.from('rooms').select('*').eq('code',code).eq('host_key',hostKey).maybeSingle();
  if (!room) return { ok:false, status:403, error:'Invalid host credentials.' };
  return { ok:true, room, supabase, code };
}
