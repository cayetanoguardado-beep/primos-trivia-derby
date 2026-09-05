'use client';
import { useEffect, useMemo, useState } from 'react';

const POLL=1000;
export default function PlayerPage(){
  const [roomCode,setRoomCode]=useState('');
  const [name,setName]=useState('');
  const [player,setPlayer]=useState(null);
  const [state,setState]=useState(null);
  const [error,setError]=useState('');
  const [answerResult,setAnswerResult]=useState(null);
  const [answeredQuestion,setAnsweredQuestion]=useState(null);
  const [seconds,setSeconds]=useState(20);

  useEffect(()=>{
    const p=new URLSearchParams(location.search);
    const code=(p.get('room')||'').toUpperCase();
    if(code){
      setRoomCode(code);
      try{
        const saved=JSON.parse(localStorage.getItem(`primos_player_${code}`)||'null');
        if(saved?.id&&saved?.token){setPlayer(saved);setName(saved.name||'Manager');}
      }catch{}
    }
  },[]);

  async function fetchState(){
    if(!roomCode)return;
    try{const r=await fetch(`/api/room/state?room=${encodeURIComponent(roomCode)}`,{cache:'no-store'});const d=await r.json();if(d.ok)setState(d);}catch{}
  }
  useEffect(()=>{if(!player)return;fetchState();const id=setInterval(fetchState,POLL);return()=>clearInterval(id);},[player,roomCode]);
  useEffect(()=>{if(state?.room?.current_question!==answeredQuestion){setAnswerResult(null);}},[state?.room?.current_question,answeredQuestion]);

  useEffect(()=>{
    if(state?.room?.status!=='running'||!state.room.question_started_at){setSeconds(20);return;}
    const tick=()=>{const elapsed=Math.floor((Date.now()-new Date(state.room.question_started_at).getTime())/1000);setSeconds(Math.max(0,20-elapsed));};
    tick();const id=setInterval(tick,250);return()=>clearInterval(id);
  },[state?.room?.question_started_at,state?.room?.status]);

  async function join(e){
    e.preventDefault();setError('');
    const r=await fetch('/api/room/join',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({roomCode,name})});
    const d=await r.json();if(!d.ok){setError(d.error||'Could not join.');return;}setPlayer(d.player);setName(d.player.name);localStorage.setItem(`primos_player_${roomCode}`,JSON.stringify(d.player));await fetchState();
  }

  async function answer(index){
    if(!state?.question || answerResult)return;
    const q=state.question.index;setAnsweredQuestion(q);
    const r=await fetch('/api/answer',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({roomCode,playerId:player.id,playerToken:player.token,questionIndex:q,answerIndex:index})});
    const d=await r.json();if(!d.ok){setError(d.error||'Could not submit answer.');return;}setAnswerResult({...d,chosen:index});await fetchState();
  }

  const me=useMemo(()=>state?.players?.find(p=>p.id===player?.id),[state,player]);

  if(!player){
    return <main className="page"><div className="hero card"><div className="top"><h1>🏇 Primos Trivia Derby</h1><p>Join the room, answer trivia, move your horse.</p></div><form className="stack" onSubmit={join}><label><span className="label">Room code</span><input className="input" value={roomCode} onChange={e=>setRoomCode(e.target.value.toUpperCase())} maxLength={10} placeholder="PRIMOS26" /></label><label><span className="label">Manager name</span><input className="input" value={name} onChange={e=>setName(e.target.value)} maxLength={24} placeholder="Your name" /></label>{error&&<div className="error">{error}</div>}<button className="btn primary" type="submit">Join Race</button><a className="btn center" href="/host" style={{textDecoration:'none'}}>Host / TV Screen</a></form></div></main>;
  }

  return <main className="page"><div className="shell"><div className="top"><h1>🏇 {name}</h1><p>Room <strong>{roomCode}</strong></p></div>
    <div className="grid cols">
      <section className="card"><div className="status">YOUR HORSE</div><div className="question">{me?.finish_place ? `Finished — Draft Pick #${me.finish_place}` : `${me?.yards||0} yards`}</div><div className="lane"><div className="horse" style={{left:`${Math.min(90,2+(me?.yards||0)*.88)}%`}}><span className="horseIcon">🐎</span></div></div><div className="spacer"/><div className="muted">Correct answer: +10 yards. Fastest correct answers can earn +3, +2, or +1 bonus yards.</div></section>
      <section className="card">
        {state?.room?.status==='lobby' && <><div className="status">WAITING FOR HOST</div><div className="question">You’re in the race.</div><p className="muted">Keep this page open. The first question will appear automatically.</p></>}
        {state?.room?.status==='running' && state.question && <><div className="row"><span className="pill">{state.question.category}</span><span className="muted">Question {state.question.index+1}</span><span style={{marginLeft:'auto'}} className="timer">{seconds}</span></div><div className="question">{state.question.question}</div><div className="answers">{state.question.options.map((opt,i)=>{const cls=answerResult?.chosen===i ? (answerResult.correct?' correct':' wrong'):'';return <button key={i} className={`btn answer${cls}`} disabled={!!answerResult || !!me?.finish_place} onClick={()=>answer(i)}>{String.fromCharCode(65+i)}. {opt}</button>})}</div>{answerResult&&<div className="status" style={{marginTop:12}}>{answerResult.correct ? `CORRECT! +${answerResult.awardedYards} yards${answerResult.speedBonus?` (${answerResult.speedBonus} speed bonus)`:''}` : 'WRONG — no yards this question'}</div>}</>}
        {state?.room?.status==='finished' && <><div className="status">RACE COMPLETE</div><div className="question">Draft Pick #{me?.finish_place||'—'}</div><p className="muted">The host has the final 1–10 draft order.</p></>}
        {error&&<div className="error" style={{marginTop:10}}>{error}</div>}
      </section>
    </div>
  </div></main>;
}
