import { requireHost } from '@/lib/host-auth';
import { jsonError } from '@/lib/api';

export async function POST(request) {
  try {
    const { roomCode, hostKey } = await request.json();
    const auth = await requireHost(roomCode,hostKey);
    if (!auth.ok) return jsonError(auth.error,auth.status);
    await auth.supabase.from('answers').delete().eq('room_code',auth.code);
    await auth.supabase.from('players').update({yards:0,finish_place:null}).eq('room_code',auth.code);
    await auth.supabase.from('rooms').update({status:'lobby',current_question:-1,question_started_at:null}).eq('code',auth.code);
    return Response.json({ok:true});
  } catch(e){ console.error(e); return jsonError('Could not reset race.',500); }
}
