import { requireHost } from '@/lib/host-auth';
import { jsonError } from '@/lib/api';

export async function POST(request) {
  try {
    const { roomCode, hostKey } = await request.json();
    const auth = await requireHost(roomCode, hostKey);
    if (!auth.ok) return jsonError(auth.error, auth.status);
    const { count } = await auth.supabase.from('players').select('*',{count:'exact',head:true}).eq('room_code',auth.code);
    if ((count || 0) !== 10) return jsonError('All 10 managers must join before the race starts.',409);
    const { error } = await auth.supabase.from('rooms').update({
      status:'running', current_question:0, question_started_at:new Date().toISOString()
    }).eq('code',auth.code);
    if (error) throw error;
    return Response.json({ok:true});
  } catch(e){ console.error(e); return jsonError('Could not start race.',500); }
}
