export function cleanRoomCode(value='') {
  return String(value).toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,10);
}

export function cleanName(value='') {
  return String(value).replace(/[<>]/g,'').trim().slice(0,24);
}

export function jsonError(message, status=400) {
  return Response.json({ ok:false, error:message }, { status });
}
