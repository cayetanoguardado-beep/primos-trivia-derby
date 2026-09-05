'use client';
import { useEffect, useMemo, useState } from 'react';

const POLL=500;
export default function HostPage(){
  const [roomCode,setRoomCode]=useState('PRIMOS26');
  const [hostKey,setHostKey]=useState('');
  const [state,setState]=useState(null);
  const [error,setError]=useState('');
  const [busy,setBusy]=useState(false);

  useEffect(()=>{const saved=localStorage.getItem('primos_host');if(saved){try{const x=JSON.parse(saved);setRoomCode(x.roomCode||'PRIMOS26');setHostKey(x.hostKey||'');}catch{}}},[]);

  async function fetchState(){
    if(!roomCode)return;
    try{const r=await fetch(`/api/room/state?room=${encodeURIComponent(roomCode)}`,{cache:'no-store'});const d=await r.json();if(d.ok)setState(d);}catch{}
  }
  useEffect(()=>{if(!hostKey)return;fetchState();const id=setInterval(fetchState,POLL);return()=>clearInterval(id);},[hostKey,roomCode]);

  async function createRoom(){
    setBusy(true);setError('');
    const r=await fetch('/api/room/create',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({roomCode})});const d=await r.json();setBusy(false);
    if(!d.ok){setError(d.error||'Could not create room.');return;}setRoomCode(d.roomCode);setHostKey(d.hostKey);localStorage.setItem('primos_host',JSON.stringify(d));await fetchState();
  }

  async function hostAction(path,extra={}){
    setBusy(true);setError('');
    const r=await fetch(path,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({roomCode,hostKey,...extra})});
    const d=await r.json();setBusy(false);
    if(!d.ok){setError(d.error||'Action failed.');return d;}
    await fetchState();return d;
  }

  const start=()=>hostAction('/api/room/start');
  const nextQuestion=()=>hostAction('/api/room/next');
  const clearAll=async()=>{if(confirm('Clear the entire room? This removes ALL managers, answers, yards, and draft positions.'))await hostAction('/api/room/reset');};
  const removeManager=async(p)=>{if(confirm(`Remove ${p.name} from the next race?`))await hostAction('/api/room/remove',{playerId:p.id});};

  const invite=typeof window!=='undefined'?`${location.origin}/?room=${roomCode}`:'';
  const standings=useMemo(()=>[...(state?.players||[])].sort((a,b)=>{
    if(a.finish_place&&b.finish_place)return a.finish_place-b.finish_place;
    if(a.finish_place)return -1;
    if(b.finish_place)return 1;
    return b.yards-a.yards;
  }),[state]);

  if(!hostKey){
    return <main className="page"><div className="hero card"><div className="top"><h1>📺 Primos Trivia Derby Host</h1><p>Create the room you’ll show on the TV.</p></div><div className="stack"><label><span className="label">Room code</span><input className="input" value={roomCode} onChange={e=>setRoomCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,''))} maxLength={10}/></label>{error&&<div className="error">{error}</div>}<button className="btn primary" disabled={busy} onClick={createRoom}>{busy?'Creating…':'Create Room'}</button><a className="btn center" href="/" style={{textDecoration:'none'}}>Player Screen</a></div></div></main>;
  }

  return <main className="page"><div className="shell"><div className="top"><h1>🏇 2026 Primos Trivia Derby</h1><p>Room <strong>{roomCode}</strong> · No timer · First correct answer advances the race</p></div>

    <div className="hostLayout">
      <aside className="card hostSidebar">
        <div className="status">ROOM CODE</div><div className="bigcode">{roomCode}</div>
        <div className="muted center">Managers open:</div><div className="inviteLink">{invite}</div>
        <div className="hostButtons"><button className="btn" onClick={()=>navigator.clipboard?.writeText(invite)}>Copy Invite Link</button><button className="btn" onClick={()=>document.documentElement.requestFullscreen?.()}>⛶ Full Screen</button></div>
        <div className="playersCompact">{(state?.players||[]).map(p=><div className="playerCompact" key={p.id}><div><strong>{p.name}</strong><div className="muted">{p.finish_place?`Draft Pick #${p.finish_place}`:`${p.yards} yd`}</div></div>{state?.room?.status==='finished'&&<button className="removeBtn" onClick={()=>removeManager(p)} disabled={busy}>Remove</button>}</div>)}</div>
        <div className="hostButtons"><button className="btn primary" disabled={busy||state?.room?.status!=='lobby'||(state?.players?.length||0)<1} onClick={start}>Start Race</button><button className="btn" disabled={busy||state?.room?.status!=='running'} onClick={nextQuestion}>Skip Question</button><button className="btn danger" disabled={busy} onClick={clearAll}>Clear All</button></div>
        {error&&<div className="error">{error}</div>}
      </aside>

      <section className="hostMain stack">
        <div className="card raceCard"><div className="track">{(state?.players||[]).map(p=><div key={p.id} className={`lane${p.finish_place?' finish':''}`}><div className="horse" style={{left:`${Math.min(86,2+p.yards*.84)}%`}}><span className="horseIcon">🐎</span><span className="horseName">{p.name}{p.finish_place?` • Pick #${p.finish_place}`:` • ${p.yards} yd`}</span></div></div>)}</div></div>

        <div className="card questionCard">
          {state?.room?.status==='lobby'&&<><div className="status">LOBBY</div><div className="question">{state.players.length}/10 managers joined</div><p className="muted">Start whenever the participating managers are ready.</p></>}
          {state?.room?.status==='running'&&state.question&&<><div className="row"><span className="pill">{state.question.category}</span><span className="muted">Question {state.question.index+1}</span><span className="raceMode">⚡ First correct answer advances</span></div><div className="question">{state.question.question}</div><div className="answers hostAnswers">{state.question.options.map((o,i)=><div key={i} className="btn answer" style={{cursor:'default'}}>{String.fromCharCode(65+i)}. {o}</div>)}</div><p className="muted">Wrong answer: −3 yards. Correct answer: +10 yards and the next question appears immediately for everyone.</p></>}
          {state?.room?.status==='finished'&&<><div className="status">RACE COMPLETE</div><div className="question">Final draft order locked in</div><p className="muted">Use Remove for individual managers, or Clear All to empty the room completely.</p></>}
        </div>
      </section>
    </div>

    <section className="card standingsCard"><div className="standingsHeader"><div><div className="status">DRAFT ORDER / LIVE STANDINGS</div><h2>{state?.room?.status==='finished'?'Final Picking Order':'Current Race Order'}</h2></div><div className="muted">Race continues until every remaining manager has a draft position.</div></div><div className="standingsList hostStandings">{standings.map((p,i)=><div className="standingRow" key={p.id}><span className="standingPlace">{p.finish_place?`#${p.finish_place}`:`${i+1}`}</span><strong>{p.name}</strong><span className="standingYards">{p.finish_place?'FINISHED':`${p.yards} yd`}</span></div>)}</div></section>
  </div></main>;
}
