import { requireHost } from '@/lib/host-auth';
import { jsonError } from '@/lib/api';

export async function POST(request) {
  try {
    const { roomCode, hostKey } = await request.json();
    const auth = await requireHost(roomCode, hostKey);
    if (!auth.ok) return jsonError(auth.error, auth.status);

    const { data:players, error:playersError } = await auth.supabase
      .from('players').select('finish_place').eq('room_code',auth.code);
    if (playersError) throw playersError;

    const allFinished = (players || []).length > 0 && (players || []).every(p=>p.finish_place);
    if (allFinished) {
      await auth.supabase.from('rooms').update({status:'finished',question_started_at:null}).eq('code',auth.code);
      return Response.json({ok:true,finished:true});
    }

    const { error } = await auth.supabase.from('rooms').update({
      current_question:auth.room.current_question + 1,
      question_started_at:new Date().toISOString(),
      updated_at:new Date().toISOString()
    }).eq('code',auth.code);
    if (error) throw error;
    return Response.json({ok:true,finished:false});
  } catch(e){ console.error(e); return jsonError('Could not advance question.',500); }
}
