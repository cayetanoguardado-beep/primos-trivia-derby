import { getAdminSupabase } from '@/lib/supabase';
import { cleanRoomCode, jsonError } from '@/lib/api';
import { publicQuestion, QUESTIONS } from '@/lib/questions';

export async function GET(request) {
  try {
    const code = cleanRoomCode(new URL(request.url).searchParams.get('room'));
    if (!code) return jsonError('Room code required.');
    const supabase = getAdminSupabase();
    const { data:room } = await supabase.from('rooms')
      .select('code,status,current_question,question_started_at,created_at')
      .eq('code',code).maybeSingle();
    if (!room) return jsonError('Room not found.',404);

    const { data:players, error } = await supabase.from('players')
      .select('id,name,yards,finish_place,joined_at')
      .eq('room_code',code)
      .order('joined_at',{ascending:true});
    if (error) throw error;

    const question = room.current_question >= 0 ? publicQuestion(room.current_question) : null;
    return Response.json({
      ok:true,
      room:{...room, total_questions:QUESTIONS.length},
      players:players || [],
      question
    });
  } catch (e) {
    console.error(e);
    return jsonError('Could not load room.',500);
  }
}
