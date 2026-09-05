import { getAdminSupabase } from '@/lib/supabase';
import { cleanRoomCode, jsonError } from '@/lib/api';
import { publicQuestion, questionPool } from '@/lib/questions';

export async function GET(request) {
  try {
    const code = cleanRoomCode(new URL(request.url).searchParams.get('room'));
    if (!code) return jsonError('Room code required.');
    const supabase = getAdminSupabase();
    const { data:room } = await supabase.from('rooms')
      .select('code,status,current_question,question_started_at,created_at,difficulty')
      .eq('code',code).maybeSingle();
    if (!room) return jsonError('Room not found.',404);

    const { data:players, error } = await supabase.from('players')
      .select('id,name,yards,finish_place,joined_at')
      .eq('room_code',code)
      .order('joined_at',{ascending:true});
    if (error) throw error;

    const { data:latestAnswer } = await supabase.from('answers')
      .select('id,player_id,question_index,correct,awarded_yards,answered_at')
      .eq('room_code',code)
      .order('id',{ascending:false})
      .limit(1)
      .maybeSingle();

    const difficulty=room.difficulty||'normal';
    const question = room.current_question >= 0 ? publicQuestion(room.current_question,difficulty) : null;
    const playerList=players || [];
    const latest = latestAnswer ? {
      ...latestAnswer,
      playerName:playerList.find(p=>p.id===latestAnswer.player_id)?.name || 'Manager'
    } : null;

    return Response.json({
      ok:true,
      room:{...room, difficulty, total_questions:questionPool(difficulty).length},
      players:playerList,
      question,
      latestAnswer:latest
    });
  } catch (e) {
    console.error(e);
    return jsonError('Could not load room.',500);
  }
}
