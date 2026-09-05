import crypto from 'node:crypto';
import { getAdminSupabase } from '@/lib/supabase';
import { cleanRoomCode, jsonError } from '@/lib/api';

export async function POST(request) {
  try {
    const { roomCode } = await request.json();
    const code = cleanRoomCode(roomCode || 'PRIMOS26');
    if (code.length < 4) return jsonError('Room code must be at least 4 characters.');
    const supabase = getAdminSupabase();
    const hostKey = crypto.randomBytes(24).toString('hex');

    const { data: existing } = await supabase.from('rooms').select('code').eq('code', code).maybeSingle();
    if (existing) return jsonError('That room code already exists. Try another one.', 409);

    const { error } = await supabase.from('rooms').insert({
      code,
      host_key: hostKey,
      status:'lobby',
      current_question:-1,
      question_started_at:null
    });
    if (error) throw error;
    return Response.json({ ok:true, roomCode:code, hostKey });
  } catch (e) {
    console.error(e);
    return jsonError('Could not create room.', 500);
  }
}
