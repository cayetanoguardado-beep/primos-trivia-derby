import { getAdminSupabase } from '@/lib/supabase';
import { cleanRoomCode, jsonError } from '@/lib/api';
import { QUESTIONS } from '@/lib/questions';

export async function POST(request) {
  try {
    const { roomCode, playerId, playerToken, questionIndex, answerIndex } = await request.json();
    const code = cleanRoomCode(roomCode);
    const qIndex = Number(questionIndex);
    const aIndex = Number(answerIndex);
    if (!code || !playerId || !playerToken || !Number.isInteger(qIndex) || !Number.isInteger(aIndex)) return jsonError('Invalid answer submission.');
    const question = QUESTIONS[qIndex];
    if (!question || aIndex < 0 || aIndex >= question.options.length) return jsonError('Invalid question or answer.');

    const supabase = getAdminSupabase();
    const { data: playerAuth } = await supabase.from('players')
      .select('id')
      .eq('id', playerId)
      .eq('room_code', code)
      .eq('player_token', playerToken)
      .maybeSingle();
    if (!playerAuth) return jsonError('Invalid player session.',403);
    const { data:room } = await supabase.from('rooms').select('status,current_question').eq('code',code).maybeSingle();
    if (!room || room.status !== 'running') return jsonError('Race is not currently running.',409);
    if (room.current_question !== qIndex) return jsonError('That question is no longer active.',409);

    const correct = question.answer === aIndex;
    const { data, error } = await supabase.rpc('apply_answer', {
      p_room_code:code,
      p_player_id:playerId,
      p_question_index:qIndex,
      p_answer_index:aIndex,
      p_correct:correct
    });
    if (error) {
      if (String(error.message).toLowerCase().includes('duplicate')) return jsonError('You already answered this question.',409);
      throw error;
    }
    return Response.json({ok:true,correct,...(data || {})});
  } catch(e){ console.error(e); return jsonError('Could not submit answer.',500); }
}
