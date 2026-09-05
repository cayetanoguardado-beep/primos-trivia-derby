'use client';
import { useEffect, useMemo, useRef, useState } from 'react';

const POLL=500;
const CATEGORY_ICONS={NFL:'🏈',NBA:'🏀',MLB:'⚾',NHL:'🏒','College Football':'🏟️',Soccer:'⚽','UFC / Boxing':'🥊',Olympics:'🏅',Movies:'🎬',Music:'🎵',Geography:'🌎',Food:'🍔',History:'📜',Cars:'🏎️',Military:'🦅',General:'🧠','Who Knows This Shit?':'🤷'};

export default function HostPage(){
  const [roomCode,setRoomCode]=useState('PRIMOS26');
  const [hostKey,setHostKey]=useState('');
  const [state,setState]=useState(null);
  const [error,setError]=useState('');
  const [busy,setBusy]=useState(false);
  const [difficulty,setDifficulty]=useState('normal');
  const [answerFlash,setAnswerFlash]=useState(null);
  const [finishFlash,setFinishFlash]=useState(null);
  const [stumbleId,setStumbleId]=useState(null);
  const [surgeId,setSurgeId]=useState(null);
  const [categoryBanner,setCategoryBanner]=useState(null);
  const [loserFlash,setLoserFlash]=useState(null);
  const [finalRevealActive,setFinalRevealActive]=useState(false);
  const [finalRevealList,setFinalRevealList]=useState([]);
  const [revealCount,setRevealCount]=useState(0);

  const awayAnnounced=useRef(false);
  const audioRef=useRef(null);
  const lastAnswerId=useRef(null);
  const prevPlayers=useRef(new Map());
  const eventReady=useRef(false);
  const prevStatus=useRef(null);
  const categoryTimer=useRef(null);
  const flashTimer=useRef(null);
  const finishTimer=useRef(null);
  const stumbleTimer=useRef(null);
  const surgeTimer=useRef(null);
  const celebrationTimers=useRef([]);

  useEffect(()=>{const saved=localStorage.getItem('primos_host');if(saved){try{const x=JSON.parse(saved);setRoomCode(x.roomCode||'PRIMOS26');setHostKey(x.hostKey||'');}catch{}}},[]);

  async function fetchState(){
    if(!roomCode)return;
    try{const r=await fetch(`/api/room/state?room=${encodeURIComponent(roomCode)}`,{cache:'no-store'});const d=await r.json();if(d.ok)setState(d);}catch{}
  }
  useEffect(()=>{if(!hostKey)return;fetchState();const id=setInterval(fetchState,POLL);return()=>clearInterval(id);},[hostKey,roomCode]);

  function ensureAudio(){
    if(typeof window==='undefined')return null;
    const Ctx=window.AudioContext||window.webkitAudioContext;
    if(!Ctx)return null;
    if(!audioRef.current)audioRef.current=new Ctx();
    if(audioRef.current.state==='suspended')audioRef.current.resume();
    return audioRef.current;
  }
  function tone(freq,duration,delay=0,type='sine',volume=.12){
    const ctx=ensureAudio();if(!ctx)return;
    const osc=ctx.createOscillator(),gain=ctx.createGain();
    const t=ctx.currentTime+delay;
    osc.type=type;osc.frequency.setValueAtTime(freq,t);
    gain.gain.setValueAtTime(0.0001,t);gain.gain.exponentialRampToValueAtTime(volume,t+.015);gain.gain.exponentialRampToValueAtTime(.0001,t+duration);
    osc.connect(gain);gain.connect(ctx.destination);osc.start(t);osc.stop(t+duration+.03);
  }
  function noise(duration=.5,volume=.06,delay=0){
    const ctx=ensureAudio();if(!ctx)return;
    const length=Math.max(1,Math.floor(ctx.sampleRate*duration));
    const buffer=ctx.createBuffer(1,length,ctx.sampleRate);const data=buffer.getChannelData(0);
    for(let i=0;i<length;i++)data[i]=(Math.random()*2-1)*(1-i/length);
    const src=ctx.createBufferSource(),gain=ctx.createGain(),t=ctx.currentTime+delay;
    src.buffer=buffer;gain.gain.setValueAtTime(volume,t);gain.gain.exponentialRampToValueAtTime(.0001,t+duration);
    src.connect(gain);gain.connect(ctx.destination);src.start(t);
  }
  const playStartBell=()=>{tone(880,.55,0,'sine',.18);tone(1320,.7,.05,'sine',.1);};
  const playGallop=()=>{[0,.11,.24,.35].forEach((d,i)=>tone(i%2?120:150,.07,d,'square',.055));};
  const playWrong=()=>{tone(150,.18,0,'sawtooth',.09);tone(95,.24,.12,'sawtooth',.07);};
  const playCheer=()=>{noise(.8,.075);tone(523,.16,.05,'triangle',.05);tone(659,.16,.2,'triangle',.05);tone(784,.28,.36,'triangle',.06);};
  const playFinalFanfare=()=>{tone(392,.2,0,'triangle',.08);tone(523,.2,.2,'triangle',.08);tone(659,.2,.4,'triangle',.08);tone(784,.6,.62,'triangle',.1);noise(.9,.045,.55);};
  function speak(text){if(typeof window!=='undefined'&&'speechSynthesis' in window){window.speechSynthesis.cancel();const call=new SpeechSynthesisUtterance(text);call.rate=1.04;call.pitch=1;call.volume=1;window.speechSynthesis.speak(call);}}

  useEffect(()=>{
    if(state?.room?.status==='lobby'){
      awayAnnounced.current=false;
      lastAnswerId.current=state?.latestAnswer?.id||null;
      prevPlayers.current=new Map((state?.players||[]).map(p=>[p.id,p]));
      eventReady.current=true;
      setAnswerFlash(null);setFinishFlash(null);setStumbleId(null);setSurgeId(null);setLoserFlash(null);setFinalRevealActive(false);setRevealCount(0);
      celebrationTimers.current.forEach(clearTimeout);celebrationTimers.current=[];
      return;
    }
    if(!state)return;
    if(!eventReady.current){lastAnswerId.current=state.latestAnswer?.id||null;prevPlayers.current=new Map((state.players||[]).map(p=>[p.id,p]));eventReady.current=true;return;}

    const evt=state.latestAnswer;
    if(evt&&evt.id!==lastAnswerId.current){
      lastAnswerId.current=evt.id;
      if(evt.correct){
        setAnswerFlash({name:evt.playerName,yards:evt.awarded_yards,double:evt.awarded_yards>=20});
        setSurgeId(evt.player_id);playGallop();
        clearTimeout(flashTimer.current);flashTimer.current=setTimeout(()=>setAnswerFlash(null),950);
        clearTimeout(surgeTimer.current);surgeTimer.current=setTimeout(()=>setSurgeId(null),650);
        if(!awayAnnounced.current){awayAnnounced.current=true;speak('And away they go!');}
      }else{
        setStumbleId(evt.player_id);playWrong();
        clearTimeout(stumbleTimer.current);stumbleTimer.current=setTimeout(()=>setStumbleId(null),700);
      }
    }

    const old=prevPlayers.current;
    const newlyFinished=(state.players||[]).filter(p=>p.finish_place&&!old.get(p.id)?.finish_place);
    if(newlyFinished.length){
      const p=newlyFinished.sort((a,b)=>a.finish_place-b.finish_place)[0];
      setFinishFlash(p);playCheer();speak(`${p.name} locks in draft pick number ${p.finish_place}!`);
      clearTimeout(finishTimer.current);finishTimer.current=setTimeout(()=>setFinishFlash(null),2200);
    }
    prevPlayers.current=new Map((state.players||[]).map(p=>[p.id,p]));
  },[state]);

  useEffect(()=>{
    if(state?.room?.status==='running'&&state?.question){
      const icon=CATEGORY_ICONS[state.question.category]||'❓';
      setCategoryBanner(`${icon} ${state.question.category}${state.question.doubleYards?' · 🔥 DOUBLE YARDS':''}`);
      clearTimeout(categoryTimer.current);categoryTimer.current=setTimeout(()=>setCategoryBanner(null),550);
    }
  },[state?.question?.index,state?.room?.status]);

  useEffect(()=>{
    const status=state?.room?.status;
    if(!status)return;
    if(prevStatus.current==='running'&&status==='finished'){
      const final=(state.players||[]).filter(p=>p.finish_place).sort((a,b)=>b.finish_place-a.finish_place);
      if(final.length){
        playFinalFanfare();
        setLoserFlash(final[0]);
        celebrationTimers.current.forEach(clearTimeout);celebrationTimers.current=[];
        celebrationTimers.current.push(setTimeout(()=>{setLoserFlash(null);setFinalRevealList(final);setFinalRevealActive(true);setRevealCount(1);},1700));
        for(let i=1;i<final.length;i++)celebrationTimers.current.push(setTimeout(()=>setRevealCount(i+1),1700+i*850));
        celebrationTimers.current.push(setTimeout(()=>setFinalRevealActive(false),1700+final.length*850+1800));
      }
    }
    prevStatus.current=status;
  },[state?.room?.status]);

  useEffect(()=>()=>{[categoryTimer.current,flashTimer.current,finishTimer.current,stumbleTimer.current,surgeTimer.current].forEach(clearTimeout);celebrationTimers.current.forEach(clearTimeout);},[]);

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
  async function changeRoom(){
    const raw=prompt('Enter the new room code:','PRIMOS26');if(raw===null)return;
    const newRoomCode=raw.toUpperCase().replace(/[^A-Z0-9]/g,'');
    if(newRoomCode.length<4){setError('Room code must be at least 4 letters or numbers.');return;}
    setBusy(true);setError('');
    const r=await fetch('/api/room/rename',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({roomCode,hostKey,newRoomCode})});
    const d=await r.json();setBusy(false);
    if(!d.ok){setError(d.error||'Could not change room code.');return;}
    setRoomCode(d.roomCode);setState(null);localStorage.setItem('primos_host',JSON.stringify({roomCode:d.roomCode,hostKey}));
  }

  const start=async()=>{ensureAudio();const d=await hostAction('/api/room/start',{difficulty});if(d?.ok)playStartBell();};
  const nextQuestion=()=>hostAction('/api/room/next');
  const clearAll=async()=>{if(confirm('Clear the entire room? This removes ALL managers, answers, yards, and draft positions.'))await hostAction('/api/room/reset');};
  const removeManager=async(p)=>{if(confirm(`Remove ${p.name} from the next race?`))await hostAction('/api/room/remove',{playerId:p.id});};

  const invite=typeof window!=='undefined'?`${location.origin}/?room=${roomCode}`:'';
  const standings=useMemo(()=>[...(state?.players||[])].sort((a,b)=>{if(a.finish_place&&b.finish_place)return a.finish_place-b.finish_place;if(a.finish_place)return -1;if(b.finish_place)return 1;return b.yards-a.yards;}),[state]);
  const activeDifficulty=state?.room?.status==='running'||state?.room?.status==='finished'?state?.room?.difficulty||difficulty:difficulty;

  if(!hostKey){
    return <main className="page"><div className="hero card"><div className="top"><h1>📺 Primos Trivia Derby Host</h1><p>Create the room you’ll show on the TV.</p></div><div className="stack"><label><span className="label">Room code</span><input className="input" value={roomCode} onChange={e=>setRoomCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,''))} maxLength={10}/></label>{error&&<div className="error">{error}</div>}<button className="btn primary" disabled={busy} onClick={createRoom}>{busy?'Creating…':'Create Room'}</button><a className="btn center" href="/" style={{textDecoration:'none'}}>Player Screen</a></div></div></main>;
  }

  return <main className="page"><div className="shell">
    {categoryBanner&&<div className="categoryOverlay">{categoryBanner}</div>}
    {answerFlash&&<div className="raceFlash">⚡ {answerFlash.name.toUpperCase()} GOT IT! +{answerFlash.yards} YARDS {answerFlash.double?'🔥':''}</div>}
    {finishFlash&&<div className="finishOverlay"><div>{finishFlash.finish_place===1?'🥇':finishFlash.finish_place===2?'🥈':finishFlash.finish_place===3?'🥉':'🏁'}</div><strong>{finishFlash.name.toUpperCase()}</strong><span>DRAFT PICK #{finishFlash.finish_place}!</span></div>}
    {loserFlash&&<div className="loserOverlay">🐌 DEAD LAST — {loserFlash.name.toUpperCase()} — PICK #{loserFlash.finish_place}</div>}
    {finalRevealActive&&<div className="finalRevealOverlay"><div className="finalRevealBox"><div className="status">FINAL DRAFT ORDER</div><h2>🏆 Primos Draft Order</h2>{finalRevealList.slice(0,revealCount).map(p=><div className="revealRow" key={p.id}><span>Pick #{p.finish_place}</span><strong>{p.name}</strong></div>)}</div></div>}

    <div className="top"><h1>🏇 2026 Primos Trivia Derby</h1><p>Room <strong>{roomCode}</strong> · No timer · First correct answer advances · <strong>{activeDifficulty?.toUpperCase()}</strong></p></div>
    <div className="hostLayout">
      <aside className="card hostSidebar">
        <div className="status">ROOM CODE</div><div className="bigcode">{roomCode}</div>
        <div className="muted center">Managers open:</div><div className="inviteLink">{invite}</div>
        <div className="hostButtons"><button className="btn" onClick={()=>navigator.clipboard?.writeText(invite)}>Copy Link</button><button className="btn" onClick={changeRoom} disabled={busy}>Change Room Code</button><button className="btn" onClick={()=>document.documentElement.requestFullscreen?.()}>⛶ Full Screen</button></div>
        <div className="difficultyBox"><span className="label">Race Difficulty</span><select className="difficultySelect" value={difficulty} disabled={busy||state?.room?.status!=='lobby'} onChange={e=>setDifficulty(e.target.value)}><option value="easy">Easy</option><option value="normal">Normal</option><option value="hard">Hard</option></select></div>
        <div className="playersCompact">{(state?.players||[]).map(p=><div className="playerCompact" key={p.id}><div className="playerCompactText"><strong>{p.name}</strong><div className="muted">{p.finish_place?`Pick #${p.finish_place}`:`${p.yards} yd`}</div></div>{state?.room?.status==='finished'&&<button className="removeBtn" onClick={()=>removeManager(p)} disabled={busy}>Remove</button>}</div>)}</div>
        <div className="hostButtons"><button className="btn primary" disabled={busy||state?.room?.status!=='lobby'||(state?.players?.length||0)<1} onClick={start}>Start Race</button><button className="btn" disabled={busy||state?.room?.status!=='running'} onClick={nextQuestion}>Skip Question</button><button className="btn danger" disabled={busy} onClick={clearAll}>Clear All</button></div>
        {error&&<div className="error hostError">{error}</div>}
      </aside>

      <section className="hostMain stack">
        <div className={`card raceCard${finalRevealActive?' finalDim':''}`}><div className="track">{(state?.players||[]).map(p=><div key={p.id} className={`lane${p.finish_place?' finish':''}`}><div className={`horse${stumbleId===p.id?' stumble':''}${surgeId===p.id?' surge':''}${p.finish_place?' finishedHorse':''}`} style={{left:p.finish_place?'91%':`${Math.min(86,2+p.yards*.84)}%`}}><span className="horseIcon">🐎</span><span className="horseName">{p.name}{p.finish_place?` • Pick #${p.finish_place}`:` • ${p.yards} yd`}</span></div></div>)}</div></div>

        <section className="card draftTower"><div className="standingsHeader"><div><div className="status">LIVE DRAFT-ORDER TOWER</div><h2>{state?.room?.status==='finished'?'Final Picking Order':'Current Race Order'}</h2></div><div className="muted">Finished managers lock into place. Everyone else reorders by yards.</div></div><div className="towerList">{standings.map((p,i)=><div className={`towerRow${p.finish_place?' locked':''}`} key={p.id}><span className="towerPlace">{p.finish_place?`#${p.finish_place}`:`${i+1}`}</span><strong>{p.name}</strong><span className="towerStatus">{p.finish_place?'FINISHED':`${p.yards} yards`}</span></div>)}</div></section>

        <div className="card questionCard">
          {state?.room?.status==='lobby'&&<><div className="status">LOBBY</div><div className="question">{state.players.length}/10 managers joined</div><p className="muted">Choose a difficulty and start whenever the participating managers are ready.</p></>}
          {state?.room?.status==='running'&&state.question&&<><div className="row"><span className="pill">{CATEGORY_ICONS[state.question.category]||'❓'} {state.question.category}</span><span className="muted">Question {state.question.index+1}</span>{state.question.doubleYards&&<span className="doubleBadge">🔥 DOUBLE YARDS</span>}<span className="raceMode">⚡ First correct answer advances</span></div><div className="question">{state.question.question}</div><div className="answers hostAnswers">{state.question.options.map((o,i)=><div key={i} className="btn answer" style={{cursor:'default'}}>{String.fromCharCode(65+i)}. {o}</div>)}</div><p className="muted">Wrong answer: −3 yards. Correct answer: {state.question.doubleYards?'+20':'+10'} yards and the next question appears immediately for everyone.</p></>}
          {state?.room?.status==='finished'&&<><div className="status">RACE COMPLETE</div><div className="question">Final draft order locked in</div><p className="muted">Use Remove for individual managers, or Clear All to empty the room completely.</p></>}
        </div>
      </section>
    </div>
  </div></main>;
}
