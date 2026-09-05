import crypto from 'node:crypto';
import { getAdminSupabase } from '@/lib/supabase';
import { cleanName, cleanRoomCode, jsonError } from '@/lib/api';

export async function POST(request) {
  try {
    const { roomCode, name } = await request.json();
    const code = cleanRoomCode(roomCode);
    const playerName = cleanName(name);
    if (!code || !playerName) return jsonError('Room code and manager name are required.');
    const supabase = getAdminSupabase();

    const { data: room } = await supabase.from('rooms').select('code,status').eq('code', code).maybeSingle();
    if (!room) return jsonError('Room not found.', 404);
    if (room.status !== 'lobby') return jsonError('This race has already started.', 409);

    const { count } = await supabase.from('players').select('*', { count:'exact', head:true }).eq('room_code', code);
    if ((count || 0) >= 10) return jsonError('This room already has 10 managers.', 409);

    const playerToken = crypto.randomBytes(24).toString('hex');
    const { data, error } = await supabase.from('players')
      .insert({ room_code:code, name:playerName, player_token:playerToken })
      .select('id,name')
      .single();
    if (error) {
      if (String(error.code) === '23505') return jsonError('That manager name is already in the room.', 409);
      throw error;
    }
    return Response.json({ ok:true, player:{...data, token:playerToken} });
  } catch (e) {
    console.error(e);
    return jsonError('Could not join room.', 500);
  }
}
