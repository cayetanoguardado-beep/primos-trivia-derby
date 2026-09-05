'use client';
import { useEffect, useMemo, useRef, useState } from 'react';

const POLL=900;
export default function HostPage(){
  const [roomCode,setRoomCode]=useState('PRIMOS26');
  const [hostKey,setHostKey]=useState('');
  const [state,setState]=useState(null);
  const [error,setError]=useState('');
  const [busy,setBusy]=useState(false);
  const [seconds,setSeconds]=useState(20);
  const lastAuto=useRef(-1);

  useEffect(()=>{const saved=localStorage.getItem('primos_host');if(saved){try{const x=JSON.parse(saved);setRoomCode(x.roomCode||'PRIMOS26');setHostKey(x.hostKey||'');}catch{}}},[]);

  async function fetchState(){
    if(!roomCode)return;
    try{const r=await fetch(`/api/room/state?room=${encodeURIComponent(roomCode)}`,{cache:'no-store'});const d=await r.json();if(d.ok)setState(d);}catch{}
  }
  useEffect(()=>{if(!hostKey)return;fetchState();const id=setInterval(fetchState,POLL);return()=>clearInterval(id);},[hostKey,roomCode]);

  useEffect(()=>{
    if(state?.room?.status!=='running'||!state.room.question_started_at){setSeconds(20);return;}
    const tick=()=>{const elapsed=Math.floor((Date.now()-new Date(state.room.question_started_at).getTime())/1000);setSeconds(Math.max(0,20-elapsed));};tick();const id=setInterval(tick,250);return()=>clearInterval(id);
  },[state?.room?.question_started_at,state?.room?.status]);

  useEffect(()=>{
    const q=state?.room?.current_question;
    if(state?.room?.status==='running'&&seconds===0&&Number.isInteger(q)&&lastAuto.current!==q){lastAuto.current=q;nextQuestion();}
  },[seconds,state?.room?.status,state?.room?.current_question]);

  async function createRoom(){
    setBusy(true);setError('');
    const r=await fetch('/api/room/create',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({roomCode})});const d=await r.json();setBusy(false);
    if(!d.ok){setError(d.error||'Could not create room.');return;}setRoomCode(d.roomCode);setHostKey(d.hostKey);localStorage.setItem('primos_host',JSON.stringify(d));await fetchState();
  }
  async function hostAction(path){
    setBusy(true);setError('');const r=await fetch(path,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({roomCode,hostKey})});const d=await r.json();setBusy(false);if(!d.ok){setError(d.error||'Action failed.');return d;}await fetchState();return d;
  }
  const start=()=>hostAction('/api/room/start');
  const nextQuestion=()=>hostAction('/api/room/next');
  const reset=async()=>{if(confirm('Reset all yards, answers, and draft positions?'))await hostAction('/api/room/reset');};

  const invite=typeof window!=='undefined'?`${location.origin}/?room=${roomCode}`:'';
  const sorted=useMemo(()=>[...(state?.players||[])].sort((a,b)=>(a.finish_place||99)-(b.finish_place||99)||b.yards-a.yards),[state]);

  if(!hostKey){
    return <main className="page"><div className="hero card"><div className="top"><h1>📺 Primos Trivia Derby Host</h1><p>Create the room you’ll show on the TV.</p></div><div className="stack"><label><span className="label">Room code</span><input className="input" value={roomCode} onChange={e=>setRoomCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,''))} maxLength={10}/></label>{error&&<div className="error">{error}</div>}<button className="btn primary" disabled={busy} onClick={createRoom}>{busy?'Creating…':'Create Room'}</button><a className="btn center" href="/" style={{textDecoration:'none'}}>Player Screen</a></div></div></main>;
  }

  return <main className="page"><div className="shell"><div className="top"><h1>🏇 2026 Primos Trivia Derby</h1><p>Room <strong>{roomCode}</strong></p></div>
    <div className="grid cols">
      <aside className="card stack"><div className="status">ROOM CODE</div><div className="bigcode">{roomCode}</div><div className="muted center">Managers open:</div><div className="center" style={{wordBreak:'break-all'}}>{invite}</div><button className="btn" onClick={()=>navigator.clipboard?.writeText(invite)}>Copy Invite Link</button><button className="btn" onClick={()=>document.documentElement.requestFullscreen?.()}>⛶ Full Screen</button><div className="players">{(state?.players||[]).map(p=><div className="player" key={p.id}>{p.finish_place&&<span className="pick">#{p.finish_place}</span>}<strong>{p.name}</strong><div className="muted">{p.yards} yd</div></div>)}</div><div className="row"><button className="btn primary" disabled={busy||state?.room?.status!=='lobby'||state?.players?.length!==10} onClick={start}>Start Race</button><button className="btn" disabled={busy||state?.room?.status!=='running'} onClick={nextQuestion}>Next</button><button className="btn danger" disabled={busy} onClick={reset}>Reset</button></div>{error&&<div className="error">{error}</div>}</aside>
      <section className="stack">
        <div className="card"><div className="track">{(state?.players||[]).map(p=><div key={p.id} className={`lane${p.finish_place?' finish':''}`}><div className="horse" style={{left:`${Math.min(90,2+p.yards*.88)}%`}}><span className="horseIcon">🐎</span><span className="horseName">{p.name}{p.finish_place?` • Pick #${p.finish_place}`:''}</span></div></div>)}</div></div>
        <div className="card">
          {state?.room?.status==='lobby'&&<><div className="status">LOBBY</div><div className="question">{state.players.length}/10 managers joined</div><p className="muted">Share the link or room code, then start when everybody is ready.</p></>}
          {state?.room?.status==='running'&&state.question&&<><div className="row"><span className="pill">{state.question.category}</span><span className="muted">Question {state.question.index+1} of {state.room.total_questions}</span><span style={{marginLeft:'auto'}} className="timer">{seconds}</span></div><div className="question">{state.question.question}</div><div className="answers">{state.question.options.map((o,i)=><div key={i} className="btn answer" style={{cursor:'default'}}>{String.fromCharCode(65+i)}. {o}</div>)}</div><p className="muted">The host auto-advances at 0 seconds, or you can press Next manually.</p></>}
          {state?.room?.status==='finished'&&<><div className="status">FINAL DRAFT ORDER</div><div className="question">Race complete</div><div className="players">{sorted.filter(p=>p.finish_place).map(p=><div className="player" key={p.id}><span className="pick">#{p.finish_place}</span><strong>{p.name}</strong></div>)}</div></>}
        </div>
      </section>
    </div>
  </div></main>;
}
