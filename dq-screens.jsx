// dq-screens.jsx — All screen components

// ═══════════════════════════════════════════
// LOGIN SCREEN
// ═══════════════════════════════════════════
const AVATARS = ["🚀","🕵️","💻","🥷","🏴‍☠️","👑","🦊","🐉","⚡","🎯","🌟","🔥","🦋","🎮","🤖","🦄"];

function LoginScreen({ onLogin }) {
  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState(["","","",""]);
  const [avatar, setAvatar] = useState("🚀");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  const updateMember = (i,v) => setMembers(m => { const n=[...m]; n[i]=v; return n; });

  const canNext1 = teamName.trim().length >= 2;
  const canNext2 = members.filter(m=>m.trim()).length >= 2;

  const submit = () => {
    if(!canNext2) { setError("¡Al menos 2 integrantes!"); return; }
    onLogin({ name:teamName, members:members.filter(m=>m.trim()), avatar, xp:0, rank:2, phase:1, badges:[] });
  };

  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center",
      backgroundImage:`radial-gradient(ellipse at 20% 50%, ${C.purple}12 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, ${C.cyan}10 0%, transparent 50%)` }}>

      {/* Floating particles */}
      {["📊","📈","🔍","💡","🎯","⚡"].map((e,i)=>(
        <div key={i} style={{ position:"fixed", fontSize:24, opacity:0.08, userSelect:"none",
          left:`${10+i*15}%`, top:`${20+Math.sin(i)*30}%`, animation:`pulse ${2+i*0.4}s infinite` }}>{e}</div>
      ))}

      <div className="fade-in" style={{ width:480, padding:8 }}>
        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:36 }}>
          <div style={{ fontSize:52, marginBottom:8 }}>📊</div>
          <h1 style={{ fontSize:36, fontWeight:800, background:`linear-gradient(135deg,${C.purple},${C.cyan})`,
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", marginBottom:4 }}>DataQuest WiDS</h1>
          <p style={{ color:C.muted, fontSize:15 }}>Plataforma de análisis de datos · WiDS 2026</p>
        </div>

        <Card style={{ padding:32 }} glow={C.purple}>
          {/* Progress steps */}
          <div style={{ display:"flex", alignItems:"center", gap:0, marginBottom:28 }}>
            {[1,2,3].map((s,i)=>(
              <React.Fragment key={s}>
                <div style={{ width:28, height:28, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center",
                  background:step>=s?`linear-gradient(135deg,${C.purple},${C.cyan})`:"rgba(255,255,255,0.08)",
                  fontSize:12, fontWeight:800, color:step>=s?"#fff":C.muted, transition:"all 0.3s", flexShrink:0 }}>{s}</div>
                {i<2 && <div style={{ flex:1, height:2, background:step>s?`linear-gradient(90deg,${C.purple},${C.cyan})`:"rgba(255,255,255,0.08)", transition:"all 0.5s" }}/>}
              </React.Fragment>
            ))}
          </div>

          {step===1 && (
            <div className="fade-in">
              <h2 style={{ fontSize:20, fontWeight:800, marginBottom:6 }}>Nombre del equipo</h2>
              <p style={{ color:C.muted, fontSize:13, marginBottom:20 }}>Elige un nombre épico para tu equipo de datos.</p>
              <input value={teamName} onChange={e=>setTeamName(e.target.value)} placeholder="Ej: Data Detectives, Neural Ninjas..."
                onKeyDown={e=>e.key==="Enter"&&canNext1&&setStep(2)}
                style={{ marginBottom:24, fontSize:16, padding:"12px 16px" }}/>
              <Btn onClick={()=>canNext1&&setStep(2)} disabled={!canNext1} size="lg" style={{ width:"100%", justifyContent:"center" }}>
                Siguiente →
              </Btn>
            </div>
          )}

          {step===2 && (
            <div className="fade-in">
              <h2 style={{ fontSize:20, fontWeight:800, marginBottom:6 }}>Integrantes del equipo</h2>
              <p style={{ color:C.muted, fontSize:13, marginBottom:20 }}>¿Quiénes van a descubrir los secretos de YouTube?</p>
              <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:24 }}>
                {members.map((m,i)=>(
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:32, height:32, borderRadius:8, background:`${C.purple}20`, display:"flex", alignItems:"center", justifyContent:"center", color:C.purple, fontWeight:800, fontSize:13, flexShrink:0 }}>{i+1}</div>
                    <input value={m} onChange={e=>updateMember(i,e.target.value)} placeholder={`Integrante ${i+1}${i<2?" (requerido)":""}`}/>
                  </div>
                ))}
              </div>
              {error && <p style={{ color:C.red, fontSize:12, marginBottom:12 }}>{error}</p>}
              <div style={{ display:"flex", gap:10 }}>
                <Btn onClick={()=>setStep(1)} variant="secondary" style={{ flex:1, justifyContent:"center" }}>← Volver</Btn>
                <Btn onClick={()=>{if(canNext2){setError("");setStep(3);}else setError("¡Al menos 2 integrantes!")} } style={{ flex:2, justifyContent:"center" }}>Siguiente →</Btn>
              </div>
            </div>
          )}

          {step===3 && (
            <div className="fade-in">
              <h2 style={{ fontSize:20, fontWeight:800, marginBottom:6 }}>Avatar del equipo</h2>
              <p style={{ color:C.muted, fontSize:13, marginBottom:18 }}>Elige el ícono que los represente.</p>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(8,1fr)", gap:8, marginBottom:24 }}>
                {AVATARS.map(a=>(
                  <button key={a} onClick={()=>setAvatar(a)}
                    style={{ width:"100%", aspectRatio:"1", border:`2px solid ${avatar===a?C.purple:"transparent"}`,
                      borderRadius:10, background:avatar===a?`${C.purple}20`:"rgba(255,255,255,0.04)", cursor:"pointer", fontSize:24,
                      transition:"all 0.15s", boxShadow:avatar===a?`0 0 12px ${C.purple}40`:"none" }}>{a}</button>
                ))}
              </div>

              {/* Preview */}
              <div style={{ background:`${C.purple}10`, border:`1px solid ${C.purple}25`, borderRadius:12, padding:"12px 16px", marginBottom:20, display:"flex", alignItems:"center", gap:12 }}>
                <span style={{ fontSize:36 }}>{avatar}</span>
                <div>
                  <div style={{ fontWeight:800, fontSize:16 }}>{teamName}</div>
                  <div style={{ color:C.muted, fontSize:12 }}>{members.filter(m=>m).join(" · ")}</div>
                </div>
              </div>

              <div style={{ display:"flex", gap:10 }}>
                <Btn onClick={()=>setStep(2)} variant="secondary" style={{ flex:1, justifyContent:"center" }}>← Volver</Btn>
                <Btn onClick={submit} variant="success" size="lg" style={{ flex:2, justifyContent:"center" }}>
                  ¡Empezar aventura! 🚀
                </Btn>
              </div>
            </div>
          )}
        </Card>

        <p style={{ textAlign:"center", color:C.dim, fontSize:12, marginTop:20 }}>
          WiDS 2026 · Análisis de datos con YouTube 📺
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// DASHBOARD — Game Map
// ═══════════════════════════════════════════
function DashboardScreen({ team, onNav, onPhaseSelect }) {
  const nodePos = [
    { x:110, y:200 }, { x:270, y:130 }, { x:430, y:200 }, { x:590, y:130 }, { x:750, y:200 }
  ];

  return (
    <div style={{ padding:28, flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:24 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize:28, fontWeight:800, marginBottom:4 }}>
          Bienvenida, <span style={{ background:`linear-gradient(135deg,${C.purple},${C.cyan})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{team.name}</span> {team.avatar}
        </h1>
        <p style={{ color:C.muted, fontSize:15 }}>Tu misión: analizar el dataset de YouTube y encontrar los mejores insights.</p>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:20, flex:1 }}>
        {/* Main — Phase map */}
        <Card style={{ padding:28 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
            <h2 style={{ fontSize:18, fontWeight:800 }}>🗺️ Mapa de Fases</h2>
            <Chip label={`Fase ${team.phase} activa`} color={PHASES[team.phase-1].color}/>
          </div>

          {/* SVG Map */}
          <div style={{ position:"relative", width:"100%", overflow:"hidden" }}>
            <svg width="100%" viewBox="0 0 870 330" style={{ display:"block" }}>
              {/* Path between nodes */}
              {nodePos.slice(0,-1).map((_,i)=>{
                const a=nodePos[i], b=nodePos[i+1];
                const unlocked = i+1 < team.phase;
                return (
                  <path key={i}
                    d={`M ${a.x} ${a.y} C ${a.x+80} ${a.y} ${b.x-80} ${b.y} ${b.x} ${b.y}`}
                    fill="none" stroke={unlocked?PHASES[i].color:"rgba(255,255,255,0.1)"}
                    strokeWidth={unlocked?3:2} strokeDasharray={unlocked?"none":"8 6"} opacity={unlocked?0.6:0.3}/>
                );
              })}

              {/* Star decorations */}
              {[{x:190,y:240},{x:350,y:90},{x:510,y:260},{x:670,y:90}].map((p,i)=>(
                <text key={i} x={p.x} y={p.y} fontSize={10} fill={PHASES[i]?.color||C.muted} opacity={0.3} textAnchor="middle">✦</text>
              ))}

              {/* Phase nodes */}
              {PHASES.map((phase, i) => {
                const pos = nodePos[i];
                const state = i+1 < team.phase ? "done" : i+1 === team.phase ? "active" : "locked";
                const col = state==="locked" ? C.muted : phase.color;
                return (
                  <g key={i} onClick={()=>state!=="locked"&&onPhaseSelect(i+1)} style={{ cursor:state!=="locked"?"pointer":"default" }}>
                    {/* Glow ring for active */}
                    {state==="active" && (
                      <circle cx={pos.x} cy={pos.y} r={44} fill="none" stroke={phase.color} strokeWidth={2} opacity={0.25} className="pulse"/>
                    )}
                    {/* Outer ring */}
                    <circle cx={pos.x} cy={pos.y} r={36} fill={state==="locked"?"rgba(255,255,255,0.04)":`${phase.color}18`}
                      stroke={col} strokeWidth={state==="active"?2.5:1.5} opacity={state==="locked"?0.5:1}/>
                    {/* Inner circle */}
                    <circle cx={pos.x} cy={pos.y} r={28} fill={state==="done"?phase.color:state==="active"?`${phase.color}30`:C.card}/>
                    {/* Icon */}
                    <text x={pos.x} y={pos.y+8} textAnchor="middle" fontSize={state==="locked"?18:22}>
                      {state==="locked" ? "🔒" : state==="done" ? "✅" : phase.icon}
                    </text>
                    {/* Label below */}
                    <text x={pos.x} y={pos.y+54} textAnchor="middle" fontSize={10} fontWeight={700}
                      fill={state==="locked"?C.dim:phase.color} fontFamily="Space Grotesk">{phase.name}</text>
                    <text x={pos.x} y={pos.y+68} textAnchor="middle" fontSize={9} fill={C.muted} fontFamily="Space Grotesk">{phase.duration}</text>
                    {/* XP badge */}
                    {state!=="locked" && (
                      <g>
                        <rect x={pos.x-18} y={pos.y-52} width={36} height={16} rx={8} fill={state==="done"?phase.color:`${phase.color}30`}/>
                        <text x={pos.x} y={pos.y-42} textAnchor="middle" fontSize={8} fontWeight={800} fill={state==="done"?"#fff":phase.color} fontFamily="Space Mono">+{phase.xpReward}XP</text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Current phase CTA */}
          <div style={{ marginTop:8, padding:"16px 20px", background:`${PHASES[team.phase-1].color}12`,
            border:`1px solid ${PHASES[team.phase-1].color}30`, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div>
              <div style={{ fontSize:13, color:C.muted, marginBottom:2 }}>Fase actual</div>
              <div style={{ fontWeight:800, fontSize:16 }}>{PHASES[team.phase-1].icon} {PHASES[team.phase-1].name}</div>
              <div style={{ color:C.muted, fontSize:12, marginTop:2 }}>{PHASES[team.phase-1].desc}</div>
            </div>
            <Btn onClick={()=>onNav(team.phase===1?"lesson":team.phase===2?"charts":team.phase===3?"analysis":team.phase===4?"pitch":"leaderboard")}
              style={{ background:PHASES[team.phase-1].color, color:"#0B0B1A", boxShadow:`0 0 20px ${PHASES[team.phase-1].color}40` }}>
              ¡Continuar! →
            </Btn>
          </div>
        </Card>

        {/* Right — Stats sidebar */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {/* XP Card */}
          <Card style={{ padding:20 }} glow={C.yellow}>
            <div style={{ fontSize:13, color:C.muted, marginBottom:8 }}>Tu progreso</div>
            <XPBar xp={team.xp}/>
            <div style={{ marginTop:14, display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              <div style={{ background:`${C.purple}15`, borderRadius:10, padding:"10px 12px", textAlign:"center" }}>
                <div style={{ fontSize:22, fontWeight:800, color:C.purple }}>#{team.rank}</div>
                <div style={{ fontSize:11, color:C.muted }}>Posición</div>
              </div>
              <div style={{ background:`${C.green}15`, borderRadius:10, padding:"10px 12px", textAlign:"center" }}>
                <div style={{ fontSize:22, fontWeight:800, color:C.green }}>{team.phase}/5</div>
                <div style={{ fontSize:11, color:C.muted }}>Fases</div>
              </div>
            </div>
          </Card>

          {/* Badges */}
          <Card style={{ padding:20 }}>
            <div style={{ fontSize:13, fontWeight:700, marginBottom:12 }}>🏅 Badges ganados</div>
            {team.badges.length ? (
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {team.badges.map((b,i)=>(
                  <div key={i} style={{ width:44, height:44, background:`${C.purple}15`, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, border:`1px solid ${C.purple}20` }}>{b}</div>
                ))}
              </div>
            ) : (
              <div style={{ color:C.dim, fontSize:13, textAlign:"center", padding:"16px 0" }}>¡Completa fases para ganar badges!</div>
            )}
          </Card>

          {/* Mini leaderboard */}
          <Card style={{ padding:20 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
              <div style={{ fontSize:13, fontWeight:700 }}>🏆 Leaderboard</div>
              <button onClick={()=>onNav("leaderboard")} style={{ border:"none", background:"transparent", color:C.purple, fontSize:12, cursor:"pointer", fontWeight:600 }}>Ver todo →</button>
            </div>
            {LEADERBOARD_DATA.slice(0,4).map((t,i)=>(
              <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"6px 0",
                borderBottom:i<3?`1px solid ${C.border2}`:"none" }}>
                <span style={{ width:20, fontSize:13, fontWeight:800, color:i===0?C.yellow:i===1?"#C0C0C0":i===2?"#CD7F32":C.muted, textAlign:"center" }}>
                  {i===0?"🥇":i===1?"🥈":i===2?"🥉":`#${i+1}`}
                </span>
                <span style={{ fontSize:16 }}>{t.avatar}</span>
                <span style={{ flex:1, fontSize:12, fontWeight:t.isUs?800:500, color:t.isUs?C.cyan:C.text }}>{t.name}</span>
                <span style={{ fontSize:11, fontFamily:"Space Mono", color:C.yellow }}>⚡{t.xp}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// LESSON SCREEN
// ═══════════════════════════════════════════
function LessonScreen({ onComplete, teamXp }) {
  const [slide, setSlide] = useState(0);
  const total = LESSON_SLIDES.length;
  const s = LESSON_SLIDES[slide];

  const visuals = {
    table: (
      <div style={{ overflowX:"auto", borderRadius:10, border:`1px solid ${C.border}` }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
          <thead>
            <tr style={{ background:`${C.purple}15` }}>
              {["Canal","Categoría","Subs (M)","Vistas (M)","% Likes"].map(h=>(
                <th key={h} style={{ padding:"8px 12px", color:C.purple, fontWeight:700, textAlign:"left", borderBottom:`1px solid ${C.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {YT_DATA.slice(0,6).map((d,i)=>(
              <tr key={i} style={{ borderBottom:`1px solid ${C.border2}`, background:i%2?"transparent":`${C.purple}05` }}>
                <td style={{ padding:"7px 12px", fontWeight:600 }}>{d.channel}</td>
                <td style={{ padding:"7px 12px" }}><Chip label={d.category} color={C.cyan} size="sm"/></td>
                <td style={{ padding:"7px 12px", fontFamily:"Space Mono", color:C.green }}>{d.subs}</td>
                <td style={{ padding:"7px 12px", fontFamily:"Space Mono", color:C.cyan }}>{d.views.toLocaleString()}</td>
                <td style={{ padding:"7px 12px", fontFamily:"Space Mono", color:C.yellow }}>{d.likes}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
    grid: (
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
        {COLUMNS.slice(0,6).map(col=>(
          <div key={col.key} style={{ background:col.type==="number"?`${C.green}10`:`${C.cyan}10`,
            border:`1px solid ${col.type==="number"?C.green:C.cyan}25`, borderRadius:10, padding:"12px 14px" }}>
            <div style={{ fontSize:22, marginBottom:4 }}>{col.emoji}</div>
            <div style={{ fontWeight:700, fontSize:13, marginBottom:2 }}>{col.label}</div>
            <Chip label={col.type==="number"?"Numérico":"Categórico"} color={col.type==="number"?C.green:C.cyan} size="sm"/>
          </div>
        ))}
      </div>
    ),
    types: (
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <div style={{ background:`${C.green}10`, border:`1px solid ${C.green}25`, borderRadius:12, padding:20 }}>
          <div style={{ fontSize:28, marginBottom:8 }}>🔢</div>
          <div style={{ fontWeight:800, fontSize:16, color:C.green, marginBottom:8 }}>Numérico</div>
          <p style={{ color:C.muted, fontSize:13, marginBottom:12 }}>Son números que se pueden sumar, restar, comparar.</p>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {["👥 Suscriptores: 262M","👁️ Vistas: 40,000M","💰 Ingresos: $3.2M"].map((ex,i)=>(
              <div key={i} style={{ background:`${C.green}10`, borderRadius:6, padding:"5px 10px", fontSize:12, fontFamily:"Space Mono", color:C.green }}>{ex}</div>
            ))}
          </div>
        </div>
        <div style={{ background:`${C.cyan}10`, border:`1px solid ${C.cyan}25`, borderRadius:12, padding:20 }}>
          <div style={{ fontSize:28, marginBottom:8 }}>🏷️</div>
          <div style={{ fontWeight:800, fontSize:16, color:C.cyan, marginBottom:8 }}>Categórico</div>
          <p style={{ color:C.muted, fontSize:13, marginBottom:12 }}>Son etiquetas o nombres, no se pueden sumar.</p>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {["🏷️ Categoría: Gaming","🌍 País: USA","📺 Canal: MrBeast"].map((ex,i)=>(
              <div key={i} style={{ background:`${C.cyan}10`, borderRadius:6, padding:"5px 10px", fontSize:12, fontFamily:"Space Mono", color:C.cyan }}>{ex}</div>
            ))}
          </div>
        </div>
      </div>
    ),
    question: (
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {["¿Qué categoría tiene más suscriptores?","¿Los canales de USA generan más ingresos?","¿Más videos = más vistas?"].map((q,i)=>(
          <div key={i} style={{ display:"flex", alignItems:"center", gap:14, background:`${C.yellow}08`,
            border:`1px solid ${C.yellow}20`, borderRadius:12, padding:"14px 18px" }}>
            <div style={{ width:32, height:32, borderRadius:8, background:`${C.yellow}20`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>💡</div>
            <span style={{ fontSize:14, fontWeight:600 }}>{q}</span>
          </div>
        ))}
        <div style={{ textAlign:"center", padding:"12px 0", color:C.purple, fontWeight:700, fontSize:14 }}>¡Hoy van a responder estas preguntas con datos reales!</div>
      </div>
    ),
  };

  return (
    <div style={{ padding:28, flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <Chip label="Fase 1 · Conoce tus datos" color={C.purple}/>
          <h1 style={{ fontSize:24, fontWeight:800, marginTop:8 }}>📖 Lección interactiva</h1>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ color:C.muted, fontSize:13 }}>{slide+1} / {total}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height:4, background:"rgba(255,255,255,0.06)", borderRadius:2 }}>
        <div style={{ width:`${((slide+1)/total)*100}%`, height:"100%", background:`linear-gradient(90deg,${C.purple},${C.cyan})`, borderRadius:2, transition:"width 0.4s" }}/>
      </div>

      <Card className="fade-in" style={{ padding:32, flex:1 }} glow={C.purple}>
        <h2 style={{ fontSize:24, fontWeight:800, marginBottom:12 }}>{s.title}</h2>
        <p style={{ color:C.muted, fontSize:15, lineHeight:1.7, marginBottom:24 }}>{s.content}</p>
        {visuals[s.visual]}
        <div style={{ marginTop:24, background:`${C.yellow}10`, border:`1px solid ${C.yellow}20`, borderRadius:10, padding:"12px 16px", display:"flex", gap:10, alignItems:"flex-start" }}>
          <span style={{ fontSize:20 }}>💡</span>
          <span style={{ fontSize:13, color:C.yellow, fontWeight:600 }}>{s.tip}</span>
        </div>
      </Card>

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <Btn onClick={()=>setSlide(Math.max(0,slide-1))} variant="secondary" disabled={slide===0}>← Anterior</Btn>
        <div style={{ display:"flex", gap:6 }}>
          {LESSON_SLIDES.map((_,i)=>(
            <div key={i} onClick={()=>setSlide(i)} style={{ width:8, height:8, borderRadius:"50%", cursor:"pointer",
              background:i===slide?C.purple:"rgba(255,255,255,0.15)", transition:"all 0.2s" }}/>
          ))}
        </div>
        {slide < total-1
          ? <Btn onClick={()=>setSlide(slide+1)}>Siguiente →</Btn>
          : <Btn onClick={()=>onComplete(150)} variant="success">¡Completar lección! +150 XP ⚡</Btn>
        }
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// QUIZ SCREEN
// ═══════════════════════════════════════════
function QuizScreen({ onComplete }) {
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [totalXP, setTotalXP] = useState(0);
  const [streak, setStreak] = useState(0);
  const [done, setDone] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const [showXP, setShowXP] = useState(null);

  const q = QUIZ_QUESTIONS[qIdx];

  const handleAnswer = (idx) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    const correct = idx === q.ans;
    const xpEarned = correct ? q.xp + (streak >= 2 ? 50 : 0) : 0;
    if (xpEarned) setShowXP(xpEarned);
    setTotalXP(p => p + xpEarned);
    setStreak(p => correct ? p+1 : 0);
  };

  const next = () => {
    if (qIdx >= QUIZ_QUESTIONS.length-1) { setDone(true); return; }
    setQIdx(q => q+1);
    setSelected(null);
    setAnswered(false);
    setShowXP(null);
    setTimerKey(k => k+1);
  };

  const optColors = ["#9D6EF8","#22D3EE","#4ADE80","#F59E0B"];

  if (done) return (
    <div style={{ padding:28, flex:1, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <Card style={{ padding:40, maxWidth:480, width:"100%", textAlign:"center" }} glow={C.green}>
        <div style={{ fontSize:64, marginBottom:16 }}>🎉</div>
        <h2 style={{ fontSize:28, fontWeight:800, marginBottom:8 }}>¡Quiz completado!</h2>
        <p style={{ color:C.muted, marginBottom:24 }}>Demostraste que entiendes el dataset de YouTube.</p>
        <div style={{ background:`${C.yellow}15`, border:`1px solid ${C.yellow}25`, borderRadius:12, padding:20, marginBottom:24 }}>
          <div style={{ fontSize:42, fontWeight:900, color:C.yellow, fontFamily:"Space Mono" }}>+{totalXP} XP</div>
          <div style={{ color:C.muted, fontSize:14 }}>¡Ganados en este quiz!</div>
          {streak > 1 && <div style={{ marginTop:8, color:C.green, fontWeight:700 }}>🔥 Racha de {streak} correctas</div>}
        </div>
        <Btn onClick={()=>onComplete(totalXP)} variant="success" size="lg" style={{ width:"100%", justifyContent:"center" }}>
          Siguiente fase → Detective de patrones 📊
        </Btn>
      </Card>
    </div>
  );

  return (
    <div style={{ padding:28, flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:20 }}>
      {showXP && <XPPop amount={showXP} onDone={()=>setShowXP(null)}/>}

      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <Chip label={`Pregunta ${qIdx+1} de ${QUIZ_QUESTIONS.length}`} color={C.cyan}/>
          <h1 style={{ fontSize:22, fontWeight:800, marginTop:6 }}>❓ Quiz: Conoce tus datos</h1>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          {streak >= 2 && <div style={{ background:`${C.red}20`, border:`1px solid ${C.red}30`, borderRadius:20, padding:"4px 12px", color:C.red, fontWeight:700, fontSize:13 }}>🔥 Racha ×{streak}</div>}
          <div style={{ background:`${C.yellow}15`, border:`1px solid ${C.yellow}25`, borderRadius:20, padding:"4px 14px" }}>
            <span style={{ color:C.yellow, fontWeight:800, fontFamily:"Space Mono" }}>⚡ {totalXP} XP</span>
          </div>
          <Timer key={timerKey} totalSeconds={60} onEnd={()=>{ setAnswered(true); setSelected(-1); }} running={!answered}/>
        </div>
      </div>

      {/* Progress */}
      <div style={{ height:4, background:"rgba(255,255,255,0.06)", borderRadius:2 }}>
        <div style={{ width:`${(qIdx/QUIZ_QUESTIONS.length)*100}%`, height:"100%", background:`linear-gradient(90deg,${C.cyan},${C.purple})`, borderRadius:2, transition:"width 0.4s" }}/>
      </div>

      {/* Question */}
      <Card className="fade-in" style={{ padding:28 }} glow={C.purple}>
        <div style={{ fontSize:11, color:C.muted, fontWeight:700, letterSpacing:1, textTransform:"uppercase", marginBottom:12 }}>Sobre el dataset de YouTube</div>
        <h2 style={{ fontSize:22, fontWeight:800, lineHeight:1.4 }}>{q.q}</h2>
      </Card>

      {/* Options */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        {q.opts.map((opt,i)=>{
          const isCorrect = i===q.ans;
          const isSelected = i===selected;
          let bg = `${optColors[i]}12`, border = `${optColors[i]}30`, textColor = C.text;
          if (answered) {
            if (isCorrect) { bg=`${C.green}20`; border=C.green; textColor=C.green; }
            else if (isSelected && !isCorrect) { bg=`${C.red}20`; border=C.red; textColor=C.red; }
            else { bg="rgba(255,255,255,0.03)"; border="rgba(255,255,255,0.06)"; textColor=C.dim; }
          }
          return (
            <button key={i} onClick={()=>handleAnswer(i)} disabled={answered}
              className={isSelected&&!answered?"pop-in":""}
              style={{ background:bg, border:`2px solid ${border}`, borderRadius:14, padding:"18px 20px",
                cursor:answered?"default":"pointer", textAlign:"left", transition:"all 0.25s", display:"flex", alignItems:"center", gap:14 }}>
              <div style={{ width:32, height:32, borderRadius:8, background:answered&&isCorrect?C.green:answered&&isSelected&&!isCorrect?C.red:`${optColors[i]}25`,
                display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:14, color:answered?(isCorrect||isSelected)?C.text:C.dim:optColors[i], flexShrink:0 }}>
                {answered ? (isCorrect?"✓":isSelected?"✗":String.fromCharCode(65+i)) : String.fromCharCode(65+i)}
              </div>
              <span style={{ fontWeight:600, fontSize:15, color:textColor }}>{opt}</span>
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {answered && (
        <Card className="fade-in" style={{ padding:20, background:selected===q.ans?`${C.green}10`:`${C.red}08`, border:`1px solid ${selected===q.ans?C.green:C.red}30` }}>
          <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
            <span style={{ fontSize:24 }}>{selected===q.ans?"🎉":"💡"}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:800, fontSize:15, color:selected===q.ans?C.green:C.red, marginBottom:4 }}>
                {selected===q.ans?"¡Correcto! +" + (q.xp+(streak>2?50:0)) + " XP":"Respuesta incorrecta"}
              </div>
              <div style={{ color:C.muted, fontSize:13 }}>{q.hint}</div>
            </div>
            <Btn onClick={next} variant={selected===q.ans?"success":"secondary"} style={{ flexShrink:0 }}>
              {qIdx>=QUIZ_QUESTIONS.length-1?"Ver resultados →":"Siguiente →"}
            </Btn>
          </div>
        </Card>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// CHART EDITOR SCREEN (KEY SCREEN)
// ═══════════════════════════════════════════
function ChartEditorScreen({ onComplete, freeMode=false }) {
  const hypotheses = [
    { id:0, text:"¿Los canales con más suscriptores generan más ingresos?", xSuggestion:"subs", ySuggestion:"revenue", type:"scatter" },
    { id:1, text:"¿Qué categoría de YouTube tiene más vistas en total?", xSuggestion:"category", ySuggestion:"views", type:"bar" },
    { id:2, text:"¿Los canales con más videos tienen más vistas promedio?", xSuggestion:"videos", ySuggestion:"avgViews", type:"scatter" },
    { id:3, text:"¿Cómo se distribuyen los ingresos por categoría?", xSuggestion:"category", ySuggestion:"revenue", type:"pie" },
  ];

  const [hypoIdx, setHypoIdx] = useState(0);
  const [chartType, setChartType] = useState("bar");
  const [xAxis, setXAxis] = useState(null);
  const [yAxis, setYAxis] = useState(null);
  const [catFilter, setCatFilter] = useState("all");
  const [conclusion, setConclusion] = useState("");
  const [dragging, setDragging] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [showXP, setShowXP] = useState(null);
  const [userQuestion, setUserQuestion] = useState("");

  const hypo = hypotheses[hypoIdx];
  const cats = ["all","Entertainment","Gaming","Music","Kids","Cooking","Tech","Sports","DIY","Education"];
  const numCols = COLUMNS.filter(c=>c.type==="number");
  const catCols = COLUMNS.filter(c=>c.type!=="number");
  const allCols = COLUMNS;

  const filteredData = catFilter==="all" ? YT_DATA : YT_DATA.filter(d=>d.category===catFilter);

  const getChartData = () => {
    if(!xAxis||!yAxis) return null;
    if(chartType==="pie") return filteredData;
    return filteredData.sort((a,b)=>b[yAxis]-a[yAxis]).slice(0,10);
  };

  const chartData = getChartData();

  const renderChart = () => {
    if(!xAxis||!yAxis) return (
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16, opacity:0.5 }}>
        <div style={{ fontSize:56 }}>📊</div>
        <div style={{ color:C.muted, fontSize:16, fontWeight:700, textAlign:"center" }}>Arrastra columnas a los ejes<br/>para generar el gráfico</div>
        <div style={{ display:"flex", gap:10, marginTop:8 }}>
          <div style={{ background:`${C.purple}15`, border:`2px dashed ${C.purple}40`, borderRadius:10, padding:"8px 20px", color:C.purple, fontSize:13 }}>Eje X: {xAxis||"vacío"}</div>
          <div style={{ background:`${C.cyan}15`, border:`2px dashed ${C.cyan}40`, borderRadius:10, padding:"8px 20px", color:C.cyan, fontSize:13 }}>Eje Y: {yAxis||"vacío"}</div>
        </div>
      </div>
    );
    return (
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", paddingTop:8 }}>
        {chartType==="bar" && <BarChart data={chartData} xKey={xAxis} yKey={yAxis} color={C.purple}/>}
        {chartType==="scatter" && <ScatterChart data={chartData} xKey={xAxis} yKey={yAxis}/>}
        {chartType==="pie" && <PieChart data={chartData} groupKey={xAxis} valueKey={yAxis}/>}
        {chartType==="line" && <LineChart data={chartData} xKey={xAxis} yKey={yAxis} color={C.cyan}/>}
      </div>
    );
  };

  const handleDragStart = (col) => setDragging(col);
  const handleDropX = () => { if(dragging){setXAxis(dragging);setDragging(null);setDragOver(null);} };
  const handleDropY = () => { if(dragging){setYAxis(dragging);setDragging(null);setDragOver(null);} };

  const handleSubmit = () => {
    setSubmitted(true);
    setShowXP(200);
    setTimeout(()=>onComplete&&onComplete(200), 2500);
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", overflow:"hidden" }}>
      {showXP && <XPPop amount={showXP} onDone={()=>setShowXP(null)}/>}

      {/* Top bar — hypothesis */}
      <div style={{ padding:"12px 20px", background:C.surface, borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
        {freeMode ? (
          <div style={{ display:"flex", gap:12, alignItems:"center" }}>
            <span style={{ fontSize:20 }}>🧪</span>
            <input value={userQuestion} onChange={e=>setUserQuestion(e.target.value)}
              placeholder="Escribe tu pregunta de análisis... Ej: ¿Los canales de Gaming tienen más likes que los de Cooking?"
              style={{ flex:1, background:"transparent", border:"none", fontSize:15, fontWeight:700, color:C.text, padding:0 }}/>
          </div>
        ) : (
          <div style={{ display:"flex", gap:12, alignItems:"center", flexWrap:"wrap" }}>
            <div style={{ background:`${C.cyan}15`, border:`1px solid ${C.cyan}30`, borderRadius:10, padding:"8px 16px", display:"flex", alignItems:"center", gap:10, flex:1 }}>
              <span style={{ fontSize:20 }}>🔍</span>
              <span style={{ fontWeight:700, fontSize:15, color:C.text }}>{hypo.text}</span>
            </div>
            <div style={{ display:"flex", gap:6 }}>
              {hypotheses.map((_,i)=>(
                <button key={i} onClick={()=>{ setHypoIdx(i); setXAxis(null); setYAxis(null); setConclusion(""); }}
                  style={{ width:28, height:28, borderRadius:6, border:"none", cursor:"pointer",
                    background:i===hypoIdx?C.cyan:"rgba(255,255,255,0.08)", color:i===hypoIdx?"#0B1A1A":C.muted, fontWeight:700, fontSize:12 }}>{i+1}</button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main 3-panel layout */}
      <div style={{ display:"grid", gridTemplateColumns:"200px 1fr 220px", flex:1, overflow:"hidden" }}>

        {/* LEFT — Columns */}
        <div style={{ background:C.surface, borderRight:`1px solid ${C.border}`, overflowY:"auto", padding:14 }}>
          <div style={{ fontSize:11, fontWeight:800, color:C.muted, letterSpacing:1, textTransform:"uppercase", marginBottom:12 }}>Columnas del dataset</div>
          <div style={{ fontSize:11, color:C.dim, marginBottom:10 }}>Arrastra a Eje X o Eje Y</div>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {allCols.map(col=>(
              <div key={col.key} className="drag-col"
                draggable onDragStart={()=>handleDragStart(col.key)}
                onClick={()=>{ if(!xAxis){setXAxis(col.key);}else if(!yAxis&&col.key!==xAxis){setYAxis(col.key);}}}
                style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 10px", borderRadius:8,
                  background:xAxis===col.key?`${C.purple}20`:yAxis===col.key?`${C.cyan}20`:"rgba(255,255,255,0.04)",
                  border:`1px solid ${xAxis===col.key?C.purple:yAxis===col.key?C.cyan:"transparent"}`,
                  transition:"all 0.15s", cursor:"grab" }}>
                <span style={{ fontSize:16 }}>{col.emoji}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:xAxis===col.key?C.purple:yAxis===col.key?C.cyan:C.text }}>{col.label}</div>
                  <div style={{ fontSize:10, color:C.dim }}>{col.type}</div>
                </div>
                {xAxis===col.key && <span style={{ fontSize:10, color:C.purple, fontWeight:700 }}>X</span>}
                {yAxis===col.key && <span style={{ fontSize:10, color:C.cyan, fontWeight:700 }}>Y</span>}
              </div>
            ))}
          </div>
        </div>

        {/* CENTER — Chart area */}
        <div style={{ display:"flex", flexDirection:"column", overflow:"hidden", background:C.bg }}>
          {/* Axis drop zones */}
          <div style={{ display:"flex", gap:10, padding:"10px 16px", flexShrink:0 }}>
            <div onDragOver={e=>{e.preventDefault();setDragOver("x");}} onDragLeave={()=>setDragOver(null)} onDrop={handleDropX}
              onClick={()=>{ if(xAxis){setXAxis(null); return;} }}
              style={{ flex:1, padding:"8px 14px", borderRadius:8, border:`2px dashed ${dragOver==="x"?C.purple:xAxis?C.purple:"rgba(157,110,248,0.3)"}`,
                background:xAxis?`${C.purple}15`:"transparent", display:"flex", alignItems:"center", gap:8, cursor:"pointer", transition:"all 0.2s" }}>
              <span style={{ fontSize:14, color:C.purple, fontWeight:800 }}>X</span>
              <span style={{ fontSize:13, color:xAxis?C.purple:C.dim }}>{xAxis ? COLUMNS.find(c=>c.key===xAxis)?.label : "Eje X (arrastra aquí)"}</span>
              {xAxis && <button onClick={(e)=>{e.stopPropagation();setXAxis(null);}} style={{ marginLeft:"auto", border:"none", background:"transparent", color:C.muted, cursor:"pointer", fontSize:16 }}>×</button>}
            </div>
            <div onDragOver={e=>{e.preventDefault();setDragOver("y");}} onDragLeave={()=>setDragOver(null)} onDrop={handleDropY}
              onClick={()=>{ if(yAxis){setYAxis(null); return;} }}
              style={{ flex:1, padding:"8px 14px", borderRadius:8, border:`2px dashed ${dragOver==="y"?C.cyan:yAxis?C.cyan:"rgba(34,211,238,0.3)"}`,
                background:yAxis?`${C.cyan}15`:"transparent", display:"flex", alignItems:"center", gap:8, cursor:"pointer", transition:"all 0.2s" }}>
              <span style={{ fontSize:14, color:C.cyan, fontWeight:800 }}>Y</span>
              <span style={{ fontSize:13, color:yAxis?C.cyan:C.dim }}>{yAxis ? COLUMNS.find(c=>c.key===yAxis)?.label : "Eje Y (arrastra aquí)"}</span>
              {yAxis && <button onClick={(e)=>{e.stopPropagation();setYAxis(null);}} style={{ marginLeft:"auto", border:"none", background:"transparent", color:C.muted, cursor:"pointer", fontSize:16 }}>×</button>}
            </div>
          </div>

          {/* Chart */}
          <div style={{ flex:1, padding:"0 20px", display:"flex", flexDirection:"column", overflow:"hidden" }}>
            {renderChart()}
          </div>

          {/* Conclusion */}
          <div style={{ padding:"12px 16px", borderTop:`1px solid ${C.border}`, flexShrink:0 }}>
            <div style={{ fontSize:12, fontWeight:700, color:C.muted, marginBottom:6 }}>✍️ Su conclusión:</div>
            <div style={{ display:"flex", gap:10, alignItems:"flex-end" }}>
              <textarea value={conclusion} onChange={e=>setConclusion(e.target.value)} rows={2}
                placeholder={freeMode?"¿Qué descubrieron con este gráfico?":"¿Qué les dice el gráfico sobre la hipótesis?"}
                style={{ flex:1, resize:"none", fontSize:13, padding:"10px 14px", borderRadius:10 }}/>
              <Btn onClick={handleSubmit} disabled={!xAxis||!yAxis||conclusion.length<10||submitted}
                variant="success" style={{ flexShrink:0, height:60 }}>
                {submitted?"¡Enviado! ✓":"Enviar +200XP"}
              </Btn>
            </div>
          </div>
        </div>

        {/* RIGHT — Controls */}
        <div style={{ background:C.surface, borderLeft:`1px solid ${C.border}`, overflowY:"auto", padding:14, display:"flex", flexDirection:"column", gap:14 }}>
          {/* Chart type */}
          <div>
            <div style={{ fontSize:11, fontWeight:800, color:C.muted, letterSpacing:1, textTransform:"uppercase", marginBottom:10 }}>Tipo de gráfico</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
              {[{type:"bar",icon:"📊",label:"Barras"},{type:"scatter",icon:"⚡",label:"Scatter"},{type:"pie",icon:"🥧",label:"Pie"},{type:"line",icon:"📈",label:"Línea"}].map(ct=>(
                <button key={ct.type} onClick={()=>setChartType(ct.type)}
                  style={{ padding:"10px 6px", border:`1px solid ${chartType===ct.type?C.purple:"transparent"}`,
                    borderRadius:8, background:chartType===ct.type?`${C.purple}20`:"rgba(255,255,255,0.04)",
                    cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                  <span style={{ fontSize:20 }}>{ct.icon}</span>
                  <span style={{ fontSize:10, fontWeight:700, color:chartType===ct.type?C.purple:C.muted, fontFamily:"Space Grotesk" }}>{ct.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Filter by category */}
          <div>
            <div style={{ fontSize:11, fontWeight:800, color:C.muted, letterSpacing:1, textTransform:"uppercase", marginBottom:10 }}>Filtrar por categoría</div>
            <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
              {cats.map(cat=>(
                <button key={cat} onClick={()=>setCatFilter(cat)}
                  style={{ padding:"7px 10px", border:"none", borderRadius:7, cursor:"pointer", textAlign:"left",
                    background:catFilter===cat?`${C.cyan}20`:"transparent",
                    color:catFilter===cat?C.cyan:C.muted, fontSize:12, fontWeight:catFilter===cat?700:500, fontFamily:"Space Grotesk" }}>
                  {cat==="all"?"🌐 Todas las categorías":"● "+cat}
                </button>
              ))}
            </div>
          </div>

          {/* Quick suggestions */}
          {!freeMode && (
            <div>
              <div style={{ fontSize:11, fontWeight:800, color:C.muted, letterSpacing:1, textTransform:"uppercase", marginBottom:10 }}>Sugerencia</div>
              <button onClick={()=>{ setXAxis(hypo.xSuggestion); setYAxis(hypo.ySuggestion); setChartType(hypo.type); }}
                style={{ width:"100%", padding:"10px 12px", background:`${C.yellow}10`, border:`1px solid ${C.yellow}25`, borderRadius:8, cursor:"pointer", color:C.yellow, fontSize:12, fontWeight:600, fontFamily:"Space Grotesk", textAlign:"left" }}>
                💡 Autocompletar ejes sugeridos
              </button>
            </div>
          )}

          {/* Data summary */}
          <div style={{ background:`${C.green}10`, border:`1px solid ${C.green}20`, borderRadius:10, padding:12 }}>
            <div style={{ fontSize:11, fontWeight:800, color:C.green, marginBottom:8 }}>📋 Dataset actual</div>
            <div style={{ fontSize:12, color:C.muted }}>{filteredData.length} canales</div>
            <div style={{ fontSize:12, color:C.muted }}>{COLUMNS.length} columnas</div>
            <div style={{ fontSize:12, color:C.muted, marginTop:4 }}>Categoría: <span style={{ color:C.green }}>{catFilter==="all"?"Todas":catFilter}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// PITCH BUILDER
// ═══════════════════════════════════════════
function PitchBuilderScreen({ team, onComplete }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([
    { title:"Título", fields:{ titulo:team.name+" presenta:", subtitulo:"Análisis de canales de YouTube · WiDS 2026" }},
    { title:"Pregunta", fields:{ pregunta:"", contexto:"" }},
    { title:"Hallazgo principal", fields:{ hallazgo:"", evidencia:"" }},
    { title:"¿Por qué importa?", fields:{ importancia:"", impacto:"" }},
    { title:"Recomendación", fields:{ recomendacion:"", conclusion:"" }},
  ]);
  const [presenting, setPresenting] = useState(false);

  const updateField = (field, val) => {
    setSlides(prev => prev.map((s,i)=>i===currentSlide?{...s, fields:{...s.fields,[field]:val}}:s));
  };

  const slideColors = [C.purple, C.cyan, C.green, C.yellow, C.red];
  const slideIcons = ["📋","❓","💡","🌍","🚀"];

  const formFields = [
    [{ k:"titulo", label:"Título de la presentación", ph:"Ej: Los secretos del algoritmo de YouTube" },
     { k:"subtitulo", label:"Subtítulo / Equipo", ph:"Tu equipo · WiDS 2026" }],
    [{ k:"pregunta", label:"¿Cuál fue su pregunta de investigación?", ph:"Ej: ¿Los canales con más suscriptores generan más ingresos?" },
     { k:"contexto", label:"Contexto del dataset", ph:"Ej: Analizamos 15 canales de YouTube con datos de suscriptores, vistas, ingresos..." }],
    [{ k:"hallazgo", label:"¿Qué descubrieron? (el hallazgo más sorprendente)", ph:"Ej: Los canales infantiles generan 3x más ingresos que los de gaming a pesar de tener menos suscriptores" },
     { k:"evidencia", label:"¿Qué gráfico lo demuestra?", ph:"Describe el gráfico que generaron..." }],
    [{ k:"importancia", label:"¿Por qué es importante este hallazgo?", ph:"Ej: Los creadores de contenido deberían considerar diversificar hacia contenido familiar" },
     { k:"impacto", label:"¿A quién le sirve saber esto?", ph:"Ej: Creadores de contenido, marcas, plataformas de streaming" }],
    [{ k:"recomendacion", label:"Su recomendación principal", ph:"Ej: Si quieres maximizar ingresos, el contenido familiar y educativo supera al de entretenimiento puro" },
     { k:"conclusion", label:"Reflexión final", ph:"¿Qué aprendieron del análisis de datos?" }],
  ];

  if (presenting) return (
    <div style={{ position:"fixed", inset:0, background:C.bg, display:"flex", flexDirection:"column", zIndex:100 }}>
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:40,
        background:`radial-gradient(ellipse at center, ${slideColors[currentSlide]}15, transparent 70%)` }}>
        <div style={{ maxWidth:800, width:"100%", textAlign:"center" }}>
          <div style={{ fontSize:80, marginBottom:24 }}>{slideIcons[currentSlide]}</div>
          <div style={{ fontSize:13, color:slideColors[currentSlide], fontWeight:700, letterSpacing:2, textTransform:"uppercase", marginBottom:16 }}>{slides[currentSlide].title}</div>
          {Object.values(slides[currentSlide].fields).filter(v=>v).map((v,i)=>(
            <p key={i} style={{ fontSize:i===0?32:18, fontWeight:i===0?800:400, color:i===0?C.text:C.muted, marginBottom:12, lineHeight:1.5 }}>{v}</p>
          ))}
        </div>
      </div>
      <div style={{ padding:"16px 32px", background:C.surface, borderTop:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <Btn onClick={()=>setCurrentSlide(p=>Math.max(0,p-1))} variant="secondary" disabled={currentSlide===0}>← Anterior</Btn>
        <div style={{ display:"flex", gap:8 }}>
          {slides.map((_,i)=>(
            <div key={i} onClick={()=>setCurrentSlide(i)} style={{ width:10, height:10, borderRadius:"50%", background:i===currentSlide?slideColors[i]:"rgba(255,255,255,0.15)", cursor:"pointer", transition:"all 0.2s" }}/>
          ))}
        </div>
        {currentSlide<slides.length-1
          ? <Btn onClick={()=>setCurrentSlide(p=>p+1)} variant="cyan">Siguiente →</Btn>
          : <Btn onClick={()=>{ setPresenting(false); onComplete&&onComplete(250); }} variant="success">Finalizar pitch ✓</Btn>
        }
        <button onClick={()=>setPresenting(false)} style={{ position:"fixed", top:16, right:16, border:"none", background:"rgba(255,255,255,0.1)", borderRadius:8, color:C.muted, padding:"6px 12px", cursor:"pointer", fontSize:13 }}>Salir ×</button>
      </div>
    </div>
  );

  return (
    <div style={{ padding:24, flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <Chip label="Fase 4 · Pitch Builder" color={C.yellow}/>
          <h1 style={{ fontSize:24, fontWeight:800, marginTop:6 }}>🎤 Construye tu pitch</h1>
        </div>
        <Btn onClick={()=>setPresenting(true)} variant="success">▶ Vista de presentación</Btn>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1.6fr", gap:20, flex:1 }}>
        {/* Slide navigator */}
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {slides.map((s,i)=>(
            <div key={i} onClick={()=>setCurrentSlide(i)}
              style={{ padding:"14px 16px", borderRadius:12, cursor:"pointer",
                background:currentSlide===i?`${slideColors[i]}15`:C.card,
                border:`1px solid ${currentSlide===i?slideColors[i]:C.border}`,
                display:"flex", alignItems:"center", gap:12, transition:"all 0.2s" }}>
              <div style={{ width:36, height:36, borderRadius:8, background:`${slideColors[i]}20`,
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{slideIcons[i]}</div>
              <div>
                <div style={{ fontWeight:700, fontSize:14, color:currentSlide===i?slideColors[i]:C.text }}>Slide {i+1}: {s.title}</div>
                <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>
                  {Object.values(s.fields).filter(v=>v).length}/{Object.values(s.fields).length} campos completos
                </div>
              </div>
              <div style={{ marginLeft:"auto", width:8, height:8, borderRadius:"50%",
                background:Object.values(s.fields).every(v=>v)?C.green:"rgba(255,255,255,0.15)" }}/>
            </div>
          ))}
          <div style={{ marginTop:8 }}>
            <Btn onClick={()=>onComplete&&onComplete(250)} variant="success" size="lg" style={{ width:"100%", justifyContent:"center" }}>
              Completar pitch +250 XP ⚡
            </Btn>
          </div>
        </div>

        {/* Editor */}
        <Card style={{ padding:24 }} glow={slideColors[currentSlide]}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
            <span style={{ fontSize:28 }}>{slideIcons[currentSlide]}</span>
            <div>
              <div style={{ fontSize:11, color:slideColors[currentSlide], fontWeight:700, letterSpacing:1, textTransform:"uppercase" }}>Slide {currentSlide+1}</div>
              <h2 style={{ fontSize:20, fontWeight:800 }}>{slides[currentSlide].title}</h2>
            </div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {formFields[currentSlide].map(f=>(
              <div key={f.k}>
                <label style={{ fontSize:12, fontWeight:700, color:C.muted, display:"block", marginBottom:6 }}>{f.label}</label>
                <textarea value={slides[currentSlide].fields[f.k]||""} onChange={e=>updateField(f.k,e.target.value)}
                  placeholder={f.ph} rows={3}
                  style={{ resize:"none", fontSize:14, padding:"12px 14px", borderRadius:10, width:"100%" }}/>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:20 }}>
            <Btn onClick={()=>setCurrentSlide(p=>Math.max(0,p-1))} variant="ghost" disabled={currentSlide===0}>← Anterior</Btn>
            <Btn onClick={()=>setCurrentSlide(p=>Math.min(slides.length-1,p+1))} disabled={currentSlide===slides.length-1}>Siguiente →</Btn>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// LEADERBOARD SCREEN
// ═══════════════════════════════════════════
function LeaderboardScreen({ bigMode=false, onToggleBig }) {
  const [teams, setTeams] = useState(LEADERBOARD_DATA);
  const [highlight, setHighlight] = useState(null);

  const simulateChange = () => {
    setTeams(prev => {
      const next = [...prev].map(t=>({ ...t, xp: t.xp + Math.floor(Math.random()*80) }))
        .sort((a,b)=>b.xp-a.xp).map((t,i)=>({ ...t, rank:i+1 }));
      const changed = next.find((t,i)=>prev.findIndex(p=>p.name===t.name)!==i);
      if (changed) setHighlight(changed.name);
      setTimeout(()=>setHighlight(null), 2000);
      return next;
    });
  };

  const rankColors = ["#FFD700","#C0C0C0","#CD7F32"];

  return (
    <div style={{ padding: bigMode?48:28, flex:1, overflowY:"auto", background:bigMode?C.bg:undefined,
      backgroundImage:bigMode?`radial-gradient(ellipse at top,${C.purple}15,transparent 60%)`:"none" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:bigMode?40:20 }}>
        <div>
          {!bigMode && <Chip label="En tiempo real" color={C.green}/>}
          <h1 style={{ fontSize:bigMode?48:26, fontWeight:900, marginTop:bigMode?12:6 }}>
            {bigMode?"🏆 LEADERBOARD LIVE":"🏆 Leaderboard"}</h1>
          {bigMode && <p style={{ color:C.muted, fontSize:20, marginTop:4 }}>DataQuest WiDS 2026</p>}
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <Btn onClick={simulateChange} variant="secondary" size={bigMode?"lg":"md"}>⚡ Simular actualización</Btn>
          {onToggleBig && <Btn onClick={onToggleBig} variant={bigMode?"secondary":"primary"} size={bigMode?"lg":"md"}>{bigMode?"Vista normal":"Vista proyector 📺"}</Btn>}
        </div>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:bigMode?16:10, maxWidth:bigMode?900:"100%", margin:"0 auto" }}>
        {teams.map((team,i)=>{
          const isHighlighted = highlight===team.name;
          return (
            <div key={team.name} className={isHighlighted?"pop-in":""} style={{ display:"flex", alignItems:"center", gap:bigMode?20:14,
              padding:bigMode?"20px 28px":"14px 18px", borderRadius:bigMode?20:14,
              background:team.isUs?`${C.cyan}12`:isHighlighted?`${C.yellow}10`:C.card,
              border:`${bigMode?"2px":"1px"} solid ${team.isUs?C.cyan:isHighlighted?C.yellow:i<3?team.color+"30":C.border}`,
              transition:"all 0.4s", boxShadow:team.isUs?`0 0 30px ${C.cyan}20`:isHighlighted?`0 0 20px ${C.yellow}30`:"none",
              animation:isHighlighted?"rankUp 0.5s ease forwards":"none" }}>

              {/* Rank */}
              <div style={{ width:bigMode?56:44, height:bigMode?56:44, borderRadius:bigMode?14:10, flexShrink:0,
                background:i<3?`${rankColors[i]}20`:`${team.color}15`,
                display:"flex", alignItems:"center", justifyContent:"center", border:`2px solid ${i<3?rankColors[i]:team.color}40` }}>
                {i<3
                  ? <span style={{ fontSize:bigMode?28:22 }}>{["🥇","🥈","🥉"][i]}</span>
                  : <span style={{ fontFamily:"Space Mono", fontWeight:900, fontSize:bigMode?20:16, color:C.muted }}>#{i+1}</span>}
              </div>

              {/* Avatar */}
              <span style={{ fontSize:bigMode?40:28 }}>{team.avatar}</span>

              {/* Name + badges */}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                  <span style={{ fontWeight:800, fontSize:bigMode?24:16, color:team.isUs?C.cyan:C.text }}>{team.name}</span>
                  {team.isUs && <Chip label="← Tu equipo" color={C.cyan} size="sm"/>}
                </div>
                <div style={{ display:"flex", gap:6, marginTop:4, alignItems:"center" }}>
                  <Chip label={`Fase ${team.phase}`} color={PHASES[team.phase-1]?.color||C.muted} size="sm"/>
                  {team.badges.map((b,j)=><span key={j} style={{ fontSize:bigMode?20:14 }}>{b}</span>)}
                </div>
              </div>

              {/* XP bar + score */}
              <div style={{ width:bigMode?200:150, flexShrink:0 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                  <span style={{ color:C.yellow, fontFamily:"Space Mono", fontWeight:800, fontSize:bigMode?22:16 }}>⚡ {team.xp}</span>
                  <span style={{ color:C.muted, fontSize:11 }}>XP</span>
                </div>
                <div style={{ height:bigMode?8:5, background:"rgba(255,255,255,0.08)", borderRadius:4 }}>
                  <div style={{ width:`${(team.xp/2000)*100}%`, height:"100%",
                    background:i<3?`linear-gradient(90deg,${rankColors[i]},${team.color})`:team.color,
                    borderRadius:4, transition:"width 0.8s cubic-bezier(0.34,1.56,0.64,1)", boxShadow:`0 0 8px ${team.color}60` }}/>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// ADMIN PANEL
// ═══════════════════════════════════════════
function AdminScreen() {
  const teams = [
    { name:"Data Detectives", avatar:"🕵️", phase:3, xp:1850, members:["Ana G.","María L.","Sofia R.","Carmen T."], status:"on-track", activity:"Editando gráfico scatter" },
    { name:"Team Rocket",     avatar:"🚀", phase:2, xp:1250, members:["Elena M.","Paula V.","Lucia B.","Sara C."], status:"on-track", activity:"Respondiendo quiz" },
    { name:"Code Sisters",   avatar:"💻", phase:2, xp:980,  members:["Diego F.","Carlos P.","Andrés M.","Jorge H."], status:"slow", activity:"Viendo lección" },
    { name:"Neural Ninjas",  avatar:"🥷", phase:1, xp:720,  members:["Valentina O.","Camila G.","Isabela S.","Natalia R."], status:"slow", activity:"Sin actividad (5 min)" },
    { name:"Pixel Pirates",  avatar:"🏴‍☠️", phase:1, xp:650, members:["Miguel A.","Roberto J.","Daniel V.","Francisco M."], status:"stuck", activity:"Sin actividad (12 min)" },
    { name:"Algo Queens",    avatar:"👑", phase:1, xp:420,  members:["Mariana T.","Alejandra F.","Valeria C.","Daniela R."], status:"stuck", activity:"Sin actividad (18 min)" },
  ];
  const statusColor = { "on-track":C.green, slow:C.yellow, stuck:C.red };
  const statusLabel = { "on-track":"✓ Al día", slow:"⚠ Lento", stuck:"🚨 Necesita ayuda" };

  return (
    <div style={{ padding:24, flex:1, overflowY:"auto" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div>
          <Chip label="Panel de administración" color={C.yellow}/>
          <h1 style={{ fontSize:24, fontWeight:800, marginTop:6 }}>🛡️ Vista de mentores</h1>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <div style={{ background:`${C.green}15`, border:`1px solid ${C.green}25`, borderRadius:10, padding:"8px 16px", textAlign:"center" }}>
            <div style={{ fontSize:22, fontWeight:800, color:C.green }}>2</div>
            <div style={{ fontSize:11, color:C.muted }}>Al día</div>
          </div>
          <div style={{ background:`${C.yellow}15`, border:`1px solid ${C.yellow}25`, borderRadius:10, padding:"8px 16px", textAlign:"center" }}>
            <div style={{ fontSize:22, fontWeight:800, color:C.yellow }}>2</div>
            <div style={{ fontSize:11, color:C.muted }}>Lentos</div>
          </div>
          <div style={{ background:`${C.red}15`, border:`1px solid ${C.red}25`, borderRadius:10, padding:"8px 16px", textAlign:"center" }}>
            <div style={{ fontSize:22, fontWeight:800, color:C.red }}>2</div>
            <div style={{ fontSize:11, color:C.muted }}>Necesitan ayuda</div>
          </div>
        </div>
      </div>

      {/* Timeline overview */}
      <Card style={{ padding:20, marginBottom:20 }}>
        <div style={{ fontSize:13, fontWeight:800, marginBottom:12 }}>⏱️ Progreso general — 3h totales</div>
        <div style={{ display:"flex", alignItems:"center", gap:0, height:32 }}>
          {PHASES.map((p,i)=>(
            <div key={i} style={{ flex:p.duration==="Live"?1:parseInt(p.duration),
              background:`${p.color}30`, border:`1px solid ${p.color}50`, borderRadius:i===0?8:i===4?"0 8px 8px 0":0,
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:p.color, height:"100%" }}>
              {p.icon} {p.name.split(" ")[0]}
            </div>
          ))}
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
          <span style={{ fontSize:10, color:C.muted }}>9:00</span>
          <span style={{ fontSize:10, color:C.muted }}>9:30</span>
          <span style={{ fontSize:10, color:C.muted }}>10:10</span>
          <span style={{ fontSize:10, color:C.muted }}>10:50</span>
          <span style={{ fontSize:10, color:C.muted }}>11:20</span>
          <span style={{ fontSize:10, color:C.muted }}>12:00</span>
        </div>
      </Card>

      {/* Team grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
        {teams.map((team,i)=>(
          <Card key={i} style={{ padding:18 }} glow={team.status==="stuck"?C.red:undefined}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:28 }}>{team.avatar}</span>
                <div>
                  <div style={{ fontWeight:800, fontSize:14 }}>{team.name}</div>
                  <div style={{ fontSize:11, color:C.muted }}>{team.members.length} integrantes</div>
                </div>
              </div>
              <span style={{ fontSize:11, fontWeight:700, color:statusColor[team.status], background:`${statusColor[team.status]}15`, padding:"3px 8px", borderRadius:6 }}>
                {statusLabel[team.status]}
              </span>
            </div>

            {/* Phase progress */}
            <div style={{ display:"flex", gap:3, marginBottom:10 }}>
              {PHASES.map((p,j)=>(
                <div key={j} style={{ flex:1, height:6, borderRadius:3,
                  background:j<team.phase?p.color:j===team.phase-1?`${p.color}50`:"rgba(255,255,255,0.08)" }}/>
              ))}
            </div>

            <div style={{ fontSize:12, color:C.muted, marginBottom:6 }}>
              Fase {team.phase}/5 · <span style={{ fontFamily:"Space Mono", color:C.yellow }}>⚡{team.xp}</span>
            </div>

            <div style={{ fontSize:11, color:team.status==="stuck"?C.red:C.muted,
              background:`${statusColor[team.status]}08`, borderRadius:6, padding:"5px 8px", fontStyle:"italic" }}>
              {team.activity}
            </div>

            {/* Members */}
            <div style={{ marginTop:10, display:"flex", flexWrap:"wrap", gap:4 }}>
              {team.members.map((m,j)=>(
                <span key={j} style={{ fontSize:10, color:C.muted, background:"rgba(255,255,255,0.05)", borderRadius:4, padding:"2px 6px" }}>{m}</span>
              ))}
            </div>

            {team.status==="stuck" && (
              <Btn variant="danger" size="sm" style={{ width:"100%", justifyContent:"center", marginTop:10 }}>🚨 Enviar alerta al equipo</Btn>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

// Export all screens
Object.assign(window, {
  LoginScreen, DashboardScreen, LessonScreen, QuizScreen,
  ChartEditorScreen, PitchBuilderScreen, LeaderboardScreen, AdminScreen,
});
