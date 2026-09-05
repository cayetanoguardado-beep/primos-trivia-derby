import { requireHost } from '@/lib/host-auth';
import { jsonError } from '@/lib/api';

export async function POST(request) {
  try {
    const { roomCode, hostKey, playerId } = await request.json();
    const auth = await requireHost(roomCode, hostKey);
    if (!auth.ok) return jsonError(auth.error, auth.status);
    if (auth.room.status !== 'finished') return jsonError('Managers can only be removed after the race is finished.',409);
    if (!playerId) return jsonError('Player ID required.');

    const { error } = await auth.supabase
      .from('players')
      .delete()
      .eq('room_code', auth.code)
      .eq('id', playerId);
    if (error) throw error;

    return Response.json({ok:true});
  } catch(e){
    console.error(e);
    return jsonError('Could not remove manager.',500);
  }
}
