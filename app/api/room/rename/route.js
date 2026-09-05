import { requireHost } from '@/lib/host-auth';
import { cleanRoomCode, jsonError } from '@/lib/api';

export async function POST(request) {
  try {
    const { roomCode, hostKey, newRoomCode } = await request.json();
    const auth = await requireHost(roomCode, hostKey);
    if (!auth.ok) return jsonError(auth.error, auth.status);

    const newCode = cleanRoomCode(newRoomCode || 'PRIMOS26');
    if (newCode.length < 4) return jsonError('Room code must be at least 4 characters.');
    if (newCode === auth.code) return Response.json({ok:true, roomCode:newCode, hostKey});

    const { count, error: countError } = await auth.supabase
      .from('players')
      .select('*',{count:'exact',head:true})
      .eq('room_code',auth.code);
    if (countError) throw countError;
    if ((count || 0) > 0) return jsonError('Use Clear All before changing the room code.',409);

    const { data: existing, error: existingError } = await auth.supabase
      .from('rooms')
      .select('code,status')
      .eq('code',newCode)
      .maybeSingle();
    if (existingError) throw existingError;

    if (existing) {
      const { count: targetPlayers, error: targetCountError } = await auth.supabase
        .from('players')
        .select('*',{count:'exact',head:true})
        .eq('room_code',newCode);
      if (targetCountError) throw targetCountError;
      if ((targetPlayers || 0) > 0 || existing.status !== 'lobby') {
        return jsonError('That room code is already being used by another active room.',409);
      }
      const { error: deleteError } = await auth.supabase.from('rooms').delete().eq('code',newCode);
      if (deleteError) throw deleteError;
    }

    const { error } = await auth.supabase.from('rooms').update({
      code:newCode,
      updated_at:new Date().toISOString()
    }).eq('code',auth.code);
    if (error) throw error;

    return Response.json({ok:true, roomCode:newCode, hostKey});
  } catch(e){
    console.error(e);
    return jsonError('Could not change room code.',500);
  }
}
