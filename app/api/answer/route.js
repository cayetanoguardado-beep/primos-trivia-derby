import { getAdminSupabase } from '@/lib/supabase';
import { cleanRoomCode, jsonError } from '@/lib/api';
import { questionForIndex, isDoubleQuestion } from '@/lib/questions';

export async function POST(request) {
  try {
    const { roomCode, playerId, playerToken, questionIndex, answerIndex } = await request.json();
    const code = cleanRoomCode(roomCode);
    const qIndex = Number(questionIndex);
    const aIndex = Number(answerIndex);
    if (!code || !playerId || !playerToken || !Number.isInteger(qIndex) || !Number.isInteger(aIndex)) return jsonError('Invalid answer submission.');

    const supabase = getAdminSupabase();
    const { data:room } = await supabase.from('rooms').select('difficulty').eq('code',code).maybeSingle();
    if (!room) return jsonError('Room not found.',404);
    const question = questionForIndex(qIndex,room.difficulty||'normal');
    if (!question || aIndex < 0 || aIndex >= question.options.length) return jsonError('Invalid question or answer.');

    const { data: playerAuth } = await supabase.from('players')
      .select('id,finish_place')
      .eq('id', playerId)
      .eq('room_code', code)
      .eq('player_token', playerToken)
      .maybeSingle();
    if (!playerAuth) return jsonError('Invalid player session.',403);
    if (playerAuth.finish_place) return jsonError('You already finished the race.',409);

    const correct = question.answer === aIndex;
    const correctYards = isDoubleQuestion(qIndex) ? 20 : 10;
    const { data, error } = await supabase.rpc('apply_answer_v2', {
      p_room_code:code,
      p_player_id:playerId,
      p_question_index:qIndex,
      p_answer_index:aIndex,
      p_correct:correct,
      p_correct_yards:correctYards
    });
    if (error) {
      const msg = String(error.message).toLowerCase();
      if (msg.includes('duplicate')) return jsonError('You already answered this question.',409);
      if (msg.includes('no longer active')) return jsonError('Another manager got it right first. New question loading…',409);
      throw error;
    }
    return Response.json({ok:true,correct,doubleYards:isDoubleQuestion(qIndex),...(data || {})});
  } catch(e){ console.error(e); return jsonError('Could not submit answer.',500); }
}
