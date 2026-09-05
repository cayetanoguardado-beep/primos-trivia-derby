import { requireHost } from '@/lib/host-auth';
import { jsonError } from '@/lib/api';
import { QUESTIONS } from '@/lib/questions';

export async function POST(request) {
  try {
    const { roomCode, hostKey } = await request.json();
    const auth = await requireHost(roomCode, hostKey);
    if (!auth.ok) return jsonError(auth.error, auth.status);

    const { data:players } = await auth.supabase.from('players').select('finish_place').eq('room_code',auth.code);
    const allFinished = (players || []).length > 0 && (players || []).every(p=>p.finish_place);
    const next = auth.room.current_question + 1;
    if (allFinished || next >= QUESTIONS.length) {
      if (!allFinished) {
        const { data: standings } = await auth.supabase.from('players')
          .select('id,yards,finish_place,joined_at')
          .eq('room_code',auth.code);
        const finished = (standings || []).filter(p=>p.finish_place);
        let nextPlace = finished.reduce((m,p)=>Math.max(m,p.finish_place||0),0) + 1;
        const remaining = (standings || [])
          .filter(p=>!p.finish_place)
          .map(p=>({...p,tie:Math.random()}))
          .sort((a,b)=>b.yards-a.yards || a.tie-b.tie);
        for (const p of remaining) {
          await auth.supabase.from('players').update({finish_place:nextPlace++}).eq('id',p.id);
        }
      }
      await auth.supabase.from('rooms').update({status:'finished',question_started_at:null}).eq('code',auth.code);
      return Response.json({ok:true,finished:true});
    }

    const { error } = await auth.supabase.from('rooms').update({
      current_question:next,
      question_started_at:new Date().toISOString()
    }).eq('code',auth.code);
    if (error) throw error;
    return Response.json({ok:true,finished:false});
  } catch(e){ console.error(e); return jsonError('Could not advance question.',500); }
}
