import { requireHost } from '@/lib/host-auth';
import { jsonError } from '@/lib/api';

export async function POST(request) {
  try {
    const { roomCode, hostKey } = await request.json();
    const auth = await requireHost(roomCode,hostKey);
    if (!auth.ok) return jsonError(auth.error,auth.status);

    const { error: answersError } = await auth.supabase
      .from('answers')
      .delete()
      .eq('room_code',auth.code);
    if (answersError) throw answersError;

    const { error: playersError } = await auth.supabase
      .from('players')
      .delete()
      .eq('room_code',auth.code);
    if (playersError) throw playersError;

    const { error: roomError } = await auth.supabase
      .from('rooms')
      .update({
        status:'lobby',
        current_question:-1,
        question_started_at:null,
        updated_at:new Date().toISOString()
      })
      .eq('code',auth.code);
    if (roomError) throw roomError;

    return Response.json({ok:true,cleared:true});
  } catch(e){
    console.error(e);
    return jsonError('Could not clear room.',500);
  }
}
