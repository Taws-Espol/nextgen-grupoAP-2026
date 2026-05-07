// dq-screens.jsx — All screen components

// ═══════════════════════════════════════════
// LORE SCREEN
// ═══════════════════════════════════════════
function LoreScreen({ onStart }) {
  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center",
      backgroundImage:`radial-gradient(ellipse at 15% 30%, ${C.purple}16 0%, transparent 55%), radial-gradient(ellipse at 85% 70%, ${C.cyan}14 0%, transparent 52%)` }}>

      {["🛰️","📊","🤖","💡","📺","⚡"].map((e,i)=>(
        <div key={i} style={{ position:"fixed", fontSize:26, opacity:0.09, userSelect:"none",
          left:`${8+i*16}%`, top:`${18+Math.sin(i*1.4)*28}%`, animation:`pulse ${2.2+i*0.35}s infinite` }}>{e}</div>
      ))}

      <div className="fade-in" style={{ width:760, maxWidth:"92vw" }}>
        <Card style={{ padding:34 }} glow={C.cyan}>
          <div style={{ display:"flex", gap:20, alignItems:"flex-start" }}>
            <div style={{ fontSize:54, lineHeight:1 }}>🛰️</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12, color:C.cyan, fontWeight:800, letterSpacing:1, textTransform:"uppercase", marginBottom:8 }}>Briefing inicial</div>
              <h1 style={{ fontSize:34, fontWeight:900, marginBottom:12, background:`linear-gradient(135deg,${C.cyan},${C.purple})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                TawsTube necesita tu ayuda
              </h1>
              <p style={{ color:C.text, fontSize:16, lineHeight:1.7, marginBottom:10 }}>
                La plataforma está creciendo demasiado rápido y nadie logra detectar a tiempo qué contenido está funcionando de verdad.
              </p>
              <p style={{ color:C.muted, fontSize:15, lineHeight:1.7, marginBottom:10 }}>
                Tu equipo fue convocado para simular una unidad de analistas y entrenar una IA con datos reales. Solo con insights claros podrán tomar decisiones importantes para el futuro de los TawsTubers.
              </p>
              <p style={{ color:C.yellow, fontSize:14, fontWeight:700, marginBottom:18 }}>
                Objetivo: descubrir patrones, justificar decisiones y activar la inteligencia de TawsTube.
              </p>

              <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginBottom:22 }}>
                <Chip label="Lore" color={C.cyan}/>
                <Chip label="Misión de datos" color={C.purple}/>
                <Chip label="Insights accionables" color={C.yellow}/>
              </div>

              <Btn onClick={onStart} size="lg" style={{ minWidth:260, justifyContent:"center" }}>
                Comenzar registro del equipo →
              </Btn>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
const AVATARS = ["🚀","🕵️","💻","🥷","🏴‍☠️","👑","🦊","🐉","⚡","🎯","🌟","🔥","🦋","🎮","🤖","🦄"];

function LoginScreen({ onParticipantLogin, onAdminLogin }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const [adminError, setAdminError] = useState("");
  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState(["","","","","",""]);
  const [avatar, setAvatar] = useState("🚀");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  const updateMember = (i,v) => setMembers(m => { const n=[...m]; n[i]=v; return n; });

  const canNext1 = teamName.trim().length >= 2;
  const canNext2 = members.filter(m=>m.trim()).length >= 2;

  const submit = () => {
    if(!canNext2) { setError("¡Al menos 2 integrantes!"); return; }
    onParticipantLogin({ name:teamName, members:members.filter(m=>m.trim()), avatar, xp:0, rank:2, phase:1, badges:[] });
  };

  const handleAdminSubmit = () => {
    if (adminPass.trim().length >= 4) {
      setAdminError("");
      onAdminLogin();
    } else {
      setAdminError("Contraseña requerida (mín. 4 caracteres)");
    }
  };

  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"flex-start", justifyContent:"center", overflowY:"auto", padding:"32px 0",
      backgroundImage:`radial-gradient(ellipse at 20% 50%, ${C.purple}12 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, ${C.cyan}10 0%, transparent 50%)` }}>

      {/* Floating particles */}
      {["📊","📈","🔍","💡","🎯","⚡"].map((e,i)=>(
        <div key={i} style={{ position:"fixed", fontSize:24, opacity:0.08, userSelect:"none",
          left:`${10+i*15}%`, top:`${20+Math.sin(i)*30}%`, animation:`pulse ${2+i*0.4}s infinite` }}>{e}</div>
      ))}

      <div className="fade-in" style={{ width:480, padding:8 }}>
        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:36 }}>
          <div style={{ fontSize:52, marginBottom:8 }}>🧾</div>
          <h1 style={{ fontSize:36, fontWeight:800, background:`linear-gradient(135deg,${C.purple},${C.cyan})`,
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", marginBottom:4 }}>DataQuest WiDS</h1>
          <p style={{ color:C.muted, fontSize:15 }}>Registro oficial de escuadrones analistas · WiDS 2026</p>
        </div>

        {/* Role Selection */}
        {step === 1 && !isAdmin && (
          <Card style={{ padding:32 }} glow={C.purple}>
            <h2 style={{ fontSize:20, fontWeight:800, marginBottom:16, textAlign:"center" }}>¿Cuál es tu rol?</h2>
            <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:24 }}>
              <button onClick={() => setStep(2)} style={{ padding:16, background:`${C.cyan}15`, border:`2px solid ${C.cyan}`, borderRadius:12,
                color:C.light, cursor:"pointer", textAlign:"left", fontSize:15, fontWeight:700, transition:"all 0.2s" }}>
                <div style={{ marginBottom:4 }}>👥 Participante</div>
                <div style={{ color:C.muted, fontSize:12, fontWeight:400 }}>Regístrate con tu equipo y participa en los análisis</div>
              </button>
              <button onClick={() => setIsAdmin(true)} style={{ padding:16, background:`${C.purple}15`, border:`2px solid ${C.purple}`, borderRadius:12,
                color:C.light, cursor:"pointer", textAlign:"left", fontSize:15, fontWeight:700, transition:"all 0.2s" }}>
                <div style={{ marginBottom:4 }}>🛡️ Administrador</div>
                <div style={{ color:C.muted, fontSize:12, fontWeight:400 }}>Acceso a leaderboard y monitoreo de equipos</div>
              </button>
            </div>
          </Card>
        )}

        {/* Admin Login */}
        {isAdmin && (
          <Card style={{ padding:32 }} glow={C.purple}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
              <h2 style={{ fontSize:20, fontWeight:800 }}>🛡️ Panel Administrativa</h2>
              <button onClick={() => setIsAdmin(false)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:20, color:C.muted }}>✕</button>
            </div>
            <p style={{ color:C.muted, fontSize:13, marginBottom:20 }}>Ingresa una contraseña para acceder al panel como administrador.</p>
            <input value={adminPass} onChange={e=>setAdminPass(e.target.value)} placeholder="Contraseña de administrador"
              type="password" onKeyDown={e=>e.key==="Enter"&&handleAdminSubmit()}
              style={{ marginBottom:24, fontSize:16, padding:"12px 16px" }}/>
            {adminError && <p style={{ color:C.red, fontSize:12, marginBottom:12 }}>{adminError}</p>}
            <div style={{ display:"flex", gap:10 }}>
              <Btn onClick={() => setIsAdmin(false)} variant="secondary" style={{ flex:1, justifyContent:"center" }}>← Volver</Btn>
              <Btn onClick={handleAdminSubmit} variant="primary" style={{ flex:2, justifyContent:"center" }}>Entrar →</Btn>
            </div>
          </Card>
        )}

        {/* Participant Registration */}
        {!isAdmin && step >= 2 && (
          <Card style={{ padding:32 }} glow={C.purple}>
            {/* Progress steps */}
            <div style={{ display:"flex", alignItems:"center", gap:0, marginBottom:28 }}>
              {[2,3,4].map((s,i)=>(
                <React.Fragment key={s}>
                  <div style={{ width:28, height:28, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center",
                    background:step>=s?`linear-gradient(135deg,${C.purple},${C.cyan})`:"rgba(255,255,255,0.08)",
                    fontSize:12, fontWeight:800, color:step>=s?"#fff":C.muted, transition:"all 0.3s", flexShrink:0 }}>{s-1}</div>
                  {i<2 && <div style={{ flex:1, height:2, background:step>s?`linear-gradient(90deg,${C.purple},${C.cyan})`:"rgba(255,255,255,0.08)", transition:"all 0.5s" }}/>}
                </React.Fragment>
              ))}
            </div>

            {step===2 && (
              <div className="fade-in">
                <h2 style={{ fontSize:20, fontWeight:800, marginBottom:6 }}>Nombre del escuadrón</h2>
                <p style={{ color:C.muted, fontSize:13, marginBottom:20 }}>Asigna el nombre oficial de tu equipo de analistas Taws.</p>
                <input value={teamName} onChange={e=>setTeamName(e.target.value)} placeholder="Ej: Data Detectives, Neural Ninjas..."
                  onKeyDown={e=>e.key==="Enter"&&canNext1&&setStep(3)}
                  style={{ marginBottom:24, fontSize:16, padding:"12px 16px" }}/>
                <div style={{ display:"flex", gap:10 }}>
                  <Btn onClick={() => setStep(1)} variant="secondary" style={{ flex:1, justifyContent:"center" }}>← Volver</Btn>
                  <Btn onClick={()=>canNext1&&setStep(3)} disabled={!canNext1} style={{ flex:2, justifyContent:"center" }}>Siguiente →</Btn>
                </div>
              </div>
            )}

            {step===3 && (
              <div className="fade-in">
                <h2 style={{ fontSize:20, fontWeight:800, marginBottom:6 }}>Integrantes del equipo</h2>
                <p style={{ color:C.muted, fontSize:13, marginBottom:20 }}>Selecciona quienes ayudaran a Tawsito a entrenar la IA con insights confiables.</p>
                <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:24, maxHeight:"48vh", overflowY:"auto", paddingRight:8 }}>
                  {members.map((m,i)=>(
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ width:32, height:32, borderRadius:8, background:`${C.purple}20`, display:"flex", alignItems:"center", justifyContent:"center", color:C.purple, fontWeight:800, fontSize:13, flexShrink:0 }}>{i+1}</div>
                      <input value={m} onChange={e=>updateMember(i,e.target.value)} placeholder={`Integrante ${i+1}${i<2?" (requerido)":""}`}/>
                    </div>
                  ))}
                </div>
                {error && <p style={{ color:C.red, fontSize:12, marginBottom:12 }}>{error}</p>}
                <div style={{ display:"flex", gap:10 }}>
                  <Btn onClick={()=>setStep(2)} variant="secondary" style={{ flex:1, justifyContent:"center" }}>← Volver</Btn>
                  <Btn onClick={()=>{if(canNext2){setError("");setStep(4);}else setError("¡Al menos 2 integrantes!")} } style={{ flex:2, justifyContent:"center" }}>Siguiente →</Btn>
                </div>
              </div>
            )}

            {step===4 && (
              <div className="fade-in">
                <h2 style={{ fontSize:20, fontWeight:800, marginBottom:6 }}>Avatar del equipo</h2>
                <p style={{ color:C.muted, fontSize:13, marginBottom:18 }}>Elige su insignia para entrar al laboratorio de inteligencia de TawsTube.</p>
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
                  <Btn onClick={()=>setStep(3)} variant="secondary" style={{ flex:1, justifyContent:"center" }}>← Volver</Btn>
                  <Btn onClick={submit} variant="success" size="lg" style={{ flex:2, justifyContent:"center" }}>
                    ¡Empezar aventura! 🚀
                  </Btn>
                </div>
              </div>
            )}
          </Card>
        )}

        <p style={{ textAlign:"center", color:C.dim, fontSize:12, marginTop:20 }}>
          WiDS 2026 · Registro de equipos para la misión TawsTube 📺
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
        <p style={{ color:C.muted, fontSize:15 }}>Tu misión: convertir datos de canales en insights accionables para guiar el futuro de TawsTube.</p>
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
// NUCLEUS CORE — Drag Drop Target
// ═══════════════════════════════════════════
function NucleusCore({ isActive, isCorrect, correctAnswerText }) {
  const [glowIntensity, setGlowIntensity] = useState(0);
  const nucleusRef = useRef(null);

  useEffect(() => {
    if (isCorrect) {
      let t = 0;
      const interval = setInterval(() => {
        t += 0.02;
        setGlowIntensity(Math.sin(t * 3) * 0.5 + 0.5);
        if (t > 1) clearInterval(interval);
      }, 16);
      return () => clearInterval(interval);
    }
  }, [isCorrect]);

  return (
    <div
      ref={nucleusRef}
      style={{
        position: "relative",
        width: 158,
        height: 158,
        borderRadius: "50%",
        border: `2px solid ${C.cyan}`,
        background: `radial-gradient(circle at 30% 30%, ${C.cyan}28, ${C.purple}14 55%, ${C.bg} 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: isActive ? "grab" : "default",
        transition: "all 0.2s ease",
        boxShadow: `0 0 ${22 + glowIntensity * 42}px ${C.cyan}${Math.floor(50 + glowIntensity * 90).toString(16)}`,
        transform: isActive ? "scale(1.08)" : "scale(1)",
        borderColor: isActive ? `${C.cyan}` : `${C.cyan}60`,
      }}
      onDragOver={(e) => {
        if (!isActive) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
      }}
    >
      <svg
        viewBox="0 0 160 160"
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}
      >
        <defs>
          <radialGradient id="nucleusCoreGlow" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor={C.cyan} stopOpacity="0.8" />
            <stop offset="55%" stopColor={C.purple} stopOpacity="0.3" />
            <stop offset="100%" stopColor={C.bg} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="nucleusRing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={C.cyan} />
            <stop offset="100%" stopColor={C.purple} />
          </linearGradient>
        </defs>
        <circle cx="80" cy="80" r="62" fill="url(#nucleusCoreGlow)" opacity="0.95" />
        <circle cx="80" cy="80" r="68" fill="none" stroke="url(#nucleusRing)" strokeWidth="2" strokeOpacity="0.9" strokeDasharray="7 8" />
        <circle cx="80" cy="80" r="48" fill="none" stroke={C.cyan} strokeOpacity="0.22" strokeWidth="1.5" />
        <ellipse cx="80" cy="80" rx="46" ry="20" fill="none" stroke={C.cyan} strokeOpacity="0.22" strokeWidth="1.4" transform="rotate(-28 80 80)" />
        <ellipse cx="80" cy="80" rx="38" ry="14" fill="none" stroke={C.purple} strokeOpacity="0.28" strokeWidth="1.2" transform="rotate(22 80 80)" />
        <circle cx="56" cy="58" r="4" fill={C.cyan} opacity="0.95" />
        <circle cx="104" cy="56" r="3" fill={C.purple} opacity="0.9" />
        <circle cx="111" cy="101" r="2.6" fill={C.green} opacity="0.85" />
        <circle cx="58" cy="106" r="2.4" fill={C.yellow} opacity="0.8" />
      </svg>
      <div style={{
        position: "absolute",
        width: "56%",
        height: "56%",
        borderRadius: "50%",
        background: `radial-gradient(circle, ${C.cyan}48, transparent 72%)`,
        filter: "blur(10px)",
      }} />
      <div style={{
        position: "relative",
        zIndex: 2,
        textAlign: "center",
        fontSize: 34,
        marginBottom: 10,
        textShadow: `0 0 18px ${C.cyan}90`,
      }}>
        {isCorrect ? "⚛️" : "🔬"}
      </div>
      <div style={{
        position: "relative",
        zIndex: 2,
        fontSize: 11,
        fontWeight: 700,
        color: C.cyan,
        textAlign: "center",
        maxWidth: "84%",
        lineHeight: 1.35,
      }}>
        {isCorrect ? `✓ ${correctAnswerText}` : "Arrastra la respuesta"}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// DATA CELL — Draggable Option
// ═══════════════════════════════════════════
function DataCell({ label, index, isDragging, onDragStart, onDragEnd, isDisabled }) {
  const cellColors = [C.purple, C.cyan, C.green, C.yellow];
  const cellColor = cellColors[index];

  return (
    <div
      draggable={!isDisabled}
      onDragStart={(e) => {
        if (!isDisabled) onDragStart(e, index, { label, cellColor });
      }}
      onDragEnd={(e) => onDragEnd(e, index)}
      style={{
        cursor: isDisabled ? "not-allowed" : "grab",
        userSelect: "none",
        width: 238,
        minHeight: 192,
        maxWidth: 238,
        borderRadius: 18,
        border: `2px solid ${cellColor}60`,
        background: `linear-gradient(135deg, ${cellColor}18, ${cellColor}08 60%, rgba(255,255,255,0.02))`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 18,
        textAlign: "center",
        fontSize: 13,
        fontWeight: 700,
        color: C.text,
        transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
        transform: isDragging ? "scale(1.08) rotate(2deg)" : "scale(1)",
        boxShadow: isDragging 
          ? `0 10px 28px ${cellColor}28, inset 0 0 16px ${cellColor}12`
          : `0 4px 12px rgba(0,0,0,0.2)`,
        opacity: isDisabled ? 0.4 : 1,
        pointerEvents: isDisabled ? "none" : "auto",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <svg
        viewBox="0 0 156 154"
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", opacity: 0.95 }}
      >
        <defs>
          <linearGradient id={`cellGrad-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={cellColor} stopOpacity="0.42" />
            <stop offset="100%" stopColor={cellColor} stopOpacity="0.04" />
          </linearGradient>
        </defs>
        {/* Forma decorativa centrada y ampliada; ajuste de translate para mantener el centro al escalar */}
        <g transform="translate(-8.7,-8.5) scale(1.12)">
          <path d="M20 26 Q78 4 136 26 Q148 77 136 128 Q78 150 20 128 Q8 77 20 26 Z" fill={`url(#cellGrad-${index})`} stroke={cellColor} strokeOpacity="0.32" strokeWidth="1.4" />
          <circle cx="48" cy="42" r="7" fill={cellColor} fillOpacity="0.16" />
          <circle cx="110" cy="108" r="6.2" fill={cellColor} fillOpacity="0.12" />
          <path d="M36 102 C50 92, 60 90, 72 96" stroke={cellColor} strokeOpacity="0.22" strokeWidth="1.6" fill="none" />
        </g>
      </svg>
      <div style={{
        position: "absolute",
        top: 7,
        right: 9,
        fontSize: 10,
        fontWeight: 800,
        color: cellColor,
        opacity: 0.6,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        zIndex: 1,
      }}>
        {String.fromCharCode(65 + index)}
      </div>
      <div style={{ lineHeight: 1.25, padding: "12px 18px", whiteSpace: "normal", overflowWrap: "anywhere", wordBreak: "break-word", hyphens: "auto", position: "relative", zIndex: 1, maxWidth: "100%" }}>
        {label}
      </div>
      {isDragging && (
        <div style={{
          position: "absolute",
          inset: 0,
          borderRadius: 18,
          border: `2px solid ${cellColor}`,
          animation: "pulse 0.6s infinite",
        }} />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// PARTICLE POOL — Absorption Effect
// ═══════════════════════════════════════════
function ParticlePool({ triggerEmit, cellColor }) {
  const [particles, setParticles] = useState([]);
  const particlesRef = useRef([]);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!triggerEmit) return;

    const newParticles = Array.from({ length: 14 }).map((_, i) => {
      const angle = (i / 14) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
      const speed = 1.8 + Math.random() * 2.8;
      return {
        id: `${Date.now()}-${i}`,
        x: 80 + Math.cos(angle) * (54 + Math.random() * 24),
        y: 80 + Math.sin(angle) * (54 + Math.random() * 24),
        vx: Math.cos(angle) * speed * -1,
        vy: Math.sin(angle) * speed * -1,
        life: 1,
        r: 2.5 + Math.random() * 4.2,
        color: cellColor,
      };
    });

    particlesRef.current = newParticles;
    setParticles([...particlesRef.current]);

    const animate = () => {
      particlesRef.current = particlesRef.current.map(p => ({
        ...p,
        x: p.x + p.vx,
        y: p.y + p.vy + 0.12,
        life: p.life - 0.03,
        vy: p.vy + 0.08,
        r: Math.max(0.8, p.r * 0.992),
      })).filter(p => p.life > 0);

      setParticles([...particlesRef.current]);
      if (particlesRef.current.length > 0) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      particlesRef.current = [];
    };
  }, [triggerEmit, cellColor]);

  return (
    <svg
      viewBox="0 0 160 160"
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, width: 160, height: 160, overflow: "visible", pointerEvents: "none", zIndex: 3 }}
    >
      <defs>
        <filter id="particleGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {particles.map(p => (
        <circle
          key={p.id}
          cx={p.x}
          cy={p.y}
          r={p.r}
          fill={p.color}
          opacity={Math.max(0, p.life)}
          filter="url(#particleGlow)"
        />
      ))}
    </svg>
  );
}

// ═══════════════════════════════════════════
// ELECTRIC BAR — Energy Fill Indicator
// ═══════════════════════════════════════════
function ElectricBar({ fillPercentage, isAnimating }) {
  const displayPercent = Math.round(fillPercentage * 100);

  return (
    <div style={{ width: "100%", marginTop: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ width: 12, height: 12, borderRadius: 6, background: `linear-gradient(90deg, ${C.cyan}, ${C.purple})`, boxShadow: `0 0 10px ${C.cyan}40` }} />
          <div style={{ fontSize: 12, fontWeight: 800, color: C.cyan }}>Energía</div>
        </div>
        <div style={{ fontSize: 13, fontWeight: 800, color: C.yellow, fontFamily: "Space Mono" }}>{displayPercent}%</div>
      </div>

      <div ref={(el)=>{ if(el) el.dataset.role = 'electric-bar'; }} style={{
        width: "100%",
        height: 14,
        borderRadius: 10,
        background: `linear-gradient(90deg, rgba(10,10,10,0.18), rgba(10,10,10,0.12))`,
        border: `1px solid rgba(255,255,255,0.04)`,
        overflow: "hidden",
        position: "relative",
        marginTop: 8,
        boxShadow: `inset 0 -6px 18px rgba(0,0,0,0.4), 0 8px 30px rgba(0,0,0,0.35)`
      }}>
        <div style={{
          width: `${displayPercent}%`,
          height: "100%",
          background: `linear-gradient(90deg, ${C.cyan}, ${C.purple})`,
          transition: "width 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
          boxShadow: isAnimating ? `0 0 26px ${C.purple}60, inset 0 0 18px ${C.cyan}60` : "none",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}>
          {/* bulb */}
          <div style={{ width: 20, height: 20, borderRadius: 10, marginRight: -8, background: C.yellow, boxShadow: `0 0 18px ${C.yellow}`, border: `2px solid ${C.yellow}30` }} />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// FEEDBACK TOAST — Immediate Response
// ═══════════════════════════════════════════
function FeedbackToast({ type, xpGain, correctAnswer, animated }) {
  if (!animated) return null;

  const isCorrect = type === "correct";
  const bgColor = isCorrect ? C.green : C.red;
  const icon = isCorrect ? "✨" : "❌";
  const title = isCorrect ? "¡Correcto!" : "Incorrecto";

  return (
    <div
      className="fade-in"
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 1000,
        padding: 20,
        borderRadius: 16,
        background: `${bgColor}15`,
        border: `2px solid ${bgColor}`,
        textAlign: "center",
        minWidth: 200,
        boxShadow: `0 8px 32px ${bgColor}30`,
      }}
    >
      <div style={{ fontSize: 40, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 18, fontWeight: 800, color: bgColor, marginBottom: 6 }}>
        {title}
      </div>
      {isCorrect ? (
        <div>
          <div style={{ fontSize: 28, fontWeight: 900, color: C.yellow, fontFamily: "Space Mono" }}>
            +{xpGain} XP
          </div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>
            ¡Energía correcta absorbida!
          </div>
        </div>
      ) : (
        <div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 8 }}>
            La respuesta correcta era:
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.cyan, marginTop: 4 }}>
            {correctAnswer}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// QUIZ SCREEN
// ═══════════════════════════════════════════
function QuizScreen({ onComplete, initialProgress=null, onProgress }) {
  const [qIdx, setQIdx] = useState(initialProgress?.qIdx ?? 0);
  const [answered, setAnswered] = useState(initialProgress?.answered ?? false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [totalXP, setTotalXP] = useState(initialProgress?.totalXP ?? 0);
  const [streak, setStreak] = useState(initialProgress?.streak ?? 0);
  const [done, setDone] = useState(initialProgress?.done ?? false);
  const [draggedCell, setDraggedCell] = useState(null);
  const [nucleusActive, setNucleusActive] = useState(false);
  const [particleTrigger, setParticleTrigger] = useState(false);
  const [particleColor, setParticleColor] = useState(null);
  const [feedbackType, setFeedbackType] = useState(initialProgress?.feedbackType ?? null);
  const [canContinue, setCanContinue] = useState(initialProgress?.answered ?? false);
  const nucleusWrapperRef = useRef(null);

  const q = QUIZ_QUESTIONS[qIdx];
  const hasLoadedInitialProgressRef = useRef(false);

  useEffect(() => {
    const timeout = setTimeout(() => setShowQuestion(true), 300);
    return () => clearTimeout(timeout);
  }, [qIdx]);

  useEffect(() => {
    if (hasLoadedInitialProgressRef.current) return;
    hasLoadedInitialProgressRef.current = true;
    if (!initialProgress) return;

    setQIdx(initialProgress.qIdx ?? 0);
    setAnswered(initialProgress.answered ?? false);
    setTotalXP(initialProgress.totalXP ?? 0);
    setStreak(initialProgress.streak ?? 0);
    setDone(initialProgress.done ?? false);
    setFeedbackType(initialProgress.feedbackType ?? null);
    setCanContinue(initialProgress.answered ?? false);
  }, [initialProgress]);

  useEffect(() => {
    onProgress && onProgress({
      qIdx,
      totalXP,
      streak,
      answered,
      feedbackType,
      done,
    });
  }, [qIdx, totalXP, streak, answered, feedbackType, done]);

  const cellColors = ["#9D6EF8", "#22D3EE", "#4ADE80", "#F59E0B"];

  const playSound = (soundName) => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      if (soundName === "correct") {
        const osc1 = audioContext.createOscillator();
        const osc2 = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc1.frequency.value = 800;
        osc2.frequency.value = 600;
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(audioContext.destination);
        gain.gain.setValueAtTime(0.2, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        osc1.start(audioContext.currentTime);
        osc2.start(audioContext.currentTime + 0.1);
        osc1.stop(audioContext.currentTime + 0.3);
        osc2.stop(audioContext.currentTime + 0.3);
      } else if (soundName === "wrong") {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.frequency.value = 100;
        osc.connect(gain);
        gain.connect(audioContext.destination);
        gain.gain.setValueAtTime(0.15, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        osc.start(audioContext.currentTime);
        osc.stop(audioContext.currentTime + 0.2);
      }
    } catch (e) {
      console.log("Audio context not available");
    }
  };

  const handleDragStart = (e, idx, data) => {
    setDraggedCell(idx);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("cellIndex", idx);
    setNucleusActive(true);
  };

  const handleDragEnd = (e, idx) => {
    setDraggedCell(null);
    setNucleusActive(false);
  };

  const handleNucleusDrop = (e) => {
    e.preventDefault();
    if (answered) return;

    const cellIdx = parseInt(e.dataTransfer.getData("cellIndex"));
    if (Number.isNaN(cellIdx) || cellIdx < 0 || cellIdx >= cellColors.length) {
      setNucleusActive(false);
      return;
    }
    const isCorrect = cellIdx === q.ans;

    setAnswered(true);
    setFeedbackType(isCorrect ? "correct" : "incorrect");
    setParticleTrigger(true);
    setParticleColor(cellColors[cellIdx]);
    setCanContinue(false);

    if (isCorrect) {
      const xpEarned = q.xp + (streak >= 2 ? 50 : 0);
      setTotalXP(p => p + xpEarned);
      setStreak(p => p + 1);

      playSound("correct");
    } else {
      playSound("wrong");
      setStreak(0);
    }

    setTimeout(() => setCanContinue(true), 700);

    setNucleusActive(false);
  };

  const next = () => {
    if (qIdx >= QUIZ_QUESTIONS.length - 1) {
      setDone(true);
      return;
    }
    setQIdx(q => q + 1);
    setAnswered(false);
    setFeedbackType(null);
    setParticleTrigger(false);
    setCanContinue(false);
    setShowQuestion(false);
  };

  if (done) {
    return (
      <div style={{ padding: 28, flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Card style={{ padding: 40, maxWidth: 480, width: "100%", textAlign: "center" }} glow={C.green}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
          <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>¡Quiz completado!</h2>
          <p style={{ color: C.muted, marginBottom: 24 }}>Demostraste que entiendes el dataset de YouTube. Absorbiste toda la energía correcta.</p>
          <div style={{ background: `${C.yellow}15`, border: `1px solid ${C.yellow}25`, borderRadius: 12, padding: 20, marginBottom: 24 }}>
            <div style={{ fontSize: 42, fontWeight: 900, color: C.yellow, fontFamily: "Space Mono" }}>+{totalXP} XP</div>
            <div style={{ color: C.muted, fontSize: 14 }}>¡Ganados en El Alquimista!</div>
            {streak > 1 && <div style={{ marginTop: 8, color: C.green, fontWeight: 700 }}>🔥 Racha final: {streak} correctas</div>}
          </div>
          <Btn onClick={() => onComplete(totalXP)} variant="success" size="lg" style={{ width: "100%", justifyContent: "center" }}>
            Siguiente fase → Detective de patrones 📊
          </Btn>
        </Card>
      </div>
    );
  }

  return (
    <div style={{
      padding: 28,
      flex: 1,
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
      background: C.bg,
      overflowY: "auto",
    }}>
      <Card style={{
        padding: 24,
        maxWidth: 920,
        width: "100%",
        position: "relative",
        maxHeight: "calc(100vh - 120px)",
        overflowY: "auto",
      }}>
        
        {/* Header */}
        <div style={{
          fontSize: 12,
          color: C.cyan,
          fontWeight: 800,
          letterSpacing: 1,
          marginBottom: 20,
          textTransform: "uppercase",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <span>🧪 Pregunta {qIdx + 1} de {QUIZ_QUESTIONS.length}</span>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ color: C.yellow, fontWeight: 800 }}>⚡ XP acumulados: {totalXP}</span>
          </div>
        </div>

        {/* Concept + Question */}
        <div style={{ marginBottom: 32 }}>
          <div style={{
            background: `linear-gradient(135deg, ${C.purple}20, rgba(255,255,255,0.04))`,
            border: `1px solid ${C.purple}66`,
            borderRadius: 16,
            padding: 16,
            marginBottom: 16,
            color: C.text,
            lineHeight: 1.6,
            boxShadow: `0 0 28px ${C.purple}18`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
              <span style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 34,
                height: 34,
                borderRadius: 10,
                background: `${C.purple}24`,
                border: `1px solid ${C.purple}55`,
                boxShadow: `0 0 16px ${C.purple}20`,
                fontSize: 18,
              }}>💡</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <div style={{
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  color: C.cyan,
                }}>Concepto</div>
                <div style={{
                  fontSize: 22,
                  fontWeight: 900,
                  color: C.purple,
                  lineHeight: 1.1,
                }}>{q.concept}</div>
              </div>
            </div>
            <div style={{ fontSize: 14, color: C.text, opacity: 0.96 }}>
              {q.conceptText}
            </div>
          </div>

          {showQuestion && (
            <h3 className="fade-in" style={{
              fontSize: 20,
              fontWeight: 700,
              lineHeight: 1.5,
              color: C.text,
            }}>
              {q.q}
            </h3>
          )}
        </div>

        {/* Nucleus + DataCells Grid */}
        {showQuestion && (
          <div
            className="fade-in"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 40,
              marginBottom: 30,
            }}
          >
            {/* NUCLEUS */}
            <div
              ref={nucleusWrapperRef}
              style={{ position: "relative", width: 160, height: 160 }}
              onDragOver={(e) => {
                e.preventDefault();
              }}
              onDrop={handleNucleusDrop}
            >
              <NucleusCore
                isActive={nucleusActive}
                isCorrect={answered && feedbackType === "correct"}
                correctAnswerText={q.opts[q.ans]}
              />
              <ParticlePool
                triggerEmit={particleTrigger}
                cellColor={particleColor}
              />
            </div>

            {/* DATA CELLS (responsive grid) */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(238px, 1fr))",
              gap: 18,
              width: "100%",
              maxWidth: 1180,
              justifyItems: "center",
              margin: "0 auto",
            }}>
              {q.opts.map((opt, idx) => (
                <DataCell
                  key={idx}
                  index={idx}
                  label={opt}
                  isDragging={draggedCell === idx}
                  isDisabled={answered}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                />
              ))}
            </div>

          </div>
        )}

        {/* FEEDBACK TOAST */}
        <FeedbackToast
          type={feedbackType}
          xpGain={feedbackType === "correct" ? q.xp + (streak >= 2 ? 50 : 0) : 0}
          correctAnswer={q.opts[q.ans]}
          animated={answered && feedbackType !== null}
        />

        {answered && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: 18 }}>
            <Btn
              variant="success"
              size="lg"
              onClick={next}
              disabled={!canContinue}
              style={{ minWidth: 240 }}
            >
              {canContinue ? "Siguiente pregunta →" : "Prepara la siguiente..."}
            </Btn>
          </div>
        )}

        {/* Hint */}
        <div style={{
          fontSize: 12,
          color: C.muted,
          fontStyle: "italic",
          marginTop: 20,
          paddingTop: 14,
          borderTop: `1px solid ${C.cyan}20`,
        }}>
          💬 Pista: {q.hint}
        </div>
        {/* cable removed per user request */}
      </Card>
    </div>
  );
}

// CableConnector removed — kept history in git if needed

// ═══════════════════════════════════════════
// MISSION SCREEN — PHASE 3
// ═══════════════════════════════════════════
function getMissionContext(mission) {
  switch (mission?.id) {
    case 1:
      return {
        label: "Contexto del caso",
        body: "Tawsito está revisando qué país se repite más en el ranking porque quiere entender dónde se concentra la atención global del público. La clave aquí es ver la moda de la lista, no solo un valor aislado.",
        hint: "Fíjate en la frecuencia con la que aparece cada país: si uno domina varias posiciones, ahí suele estar la respuesta.",
      };
    case 2:
      return {
        label: "Contexto del caso",
        body: "En esta misión Tawsito quiere medir la brecha real entre el líder y el último lugar visible para entender cuánto se separa la cima del resto. No se trata de saber quién gana, sino cuánto margen hay entre extremos.",
        hint: "Compara los valores más altos y más bajos de la tabla: el rango cuenta más que la posición en sí.",
      };
    case 3:
      return {
        label: "Contexto del caso",
        body: "Aquí el sospechoso es un canal que convierte muy pocas publicaciones en una montaña de vistas. Eso apunta a una relación rara entre esfuerzo de producción y alcance, algo perfecto para leer con ciencia de datos.",
        hint: "Busca combinaciones extrañas entre vistas y número de videos; un punto muy separado del resto suele delatar al intruso.",
      };
    case 4:
      return {
        label: "Contexto del caso",
        body: "Tawsito sospecha que la comunidad más fiel no siempre coincide con el canal más grande. Por eso quiere mirar quién recibe más aprobación relativa, no solo quién tiene más suscriptores.",
        hint: "La pista está en comparar porcentajes, no volumen bruto; una audiencia pequeña pero muy comprometida puede destacar más.",
      };
    case 5:
      return {
        label: "Contexto del caso",
        body: "Esta misión nace de una duda clásica: ¿más publicaciones significan más ingresos o solo más ruido? La idea es comprobar si existe una relación real entre ambas variables antes de creer el mito.",
        hint: "Piensa en la forma de la nube de puntos: si los datos se dispersan mucho, la relación entre variables es débil.",
      };
    case 6:
      return {
        label: "Contexto del caso",
        body: "Tawsito quiere abrir un canal nuevo donde el público esté más hambriento de contenido. Aquí importa detectar qué categoría concentra más interés promedio por canal, aunque no tenga la mayor cantidad total de creadores.",
        hint: "Mira promedios por categoría: una audiencia intensa en un nicho pequeño puede ser más valiosa que un mercado saturado.",
      };
    case 7:
      return {
        label: "Contexto del caso",
        body: "Los canales más extremos pueden distorsionar la historia completa. En esta misión, Tawsito quiere quitar a los gigantes para estimar qué ingreso representa mejor al creador típico y evitar que el promedio engañe.",
        hint: "Cuando eliminas valores atípicos, el centro de la distribución suele cambiar bastante; ahí aparece el número más representativo.",
      };
    case 8:
      return {
        label: "Contexto del caso",
        body: "Aquí buscas una contradicción famosa: canales enormes que, aun así, generan poco ingreso mensual. Es una buena forma de mostrar que tamaño de audiencia y rentabilidad no siempre se alinean.",
        hint: "Cruza suscriptores con ingresos mensuales; un canal grande que cae al fondo de la segunda métrica suele llamar la atención.",
      };
    case 9:
      return {
        label: "Contexto del caso",
        body: "Un patrocinador quiere apostar por el país donde la comunidad responde mejor. La historia no va de volumen total, sino de calidad de reacción: qué país deja una huella más positiva en promedio.",
        hint: "Agrupar por país y comparar Likes % te permite ver dónde la audiencia reacciona con más entusiasmo.",
      };
    case 10:
      return {
        label: "Contexto del caso",
        body: "Tawsito quiere saber si la riqueza de YouTube está repartida o concentrada. El foco está en entender si un solo país domina la mitad del pastel o si los ingresos están más distribuidos.",
        hint: "Un gráfico circular o acumulado ayuda a ver cuándo una región se lleva casi todo el peso del total.",
      };
    default:
      return {
        label: "Contexto del caso",
        body: mission?.problem || "Lee el problema para identificar qué patrón o métrica conviene observar primero.",
        hint: mission?.feedback || "Piensa qué variable explica mejor el comportamiento descrito.",
      };
  }
}

function MissionScreen({ team, onComplete, onNav, initialMissionIdx=0, initialProgress=null, onMissionProgress, onProgress }) {
  const [missionIdx, setMissionIdx] = useState(initialProgress?.missionIdx ?? initialMissionIdx);
  const [showQuestion, setShowQuestion] = useState(initialProgress?.showQuestion ?? false);
  const [answer, setAnswer] = useState(initialProgress?.answer ?? "");
  const [feedback, setFeedback] = useState(initialProgress?.feedback ?? null);
  const [earnedXP, setEarnedXP] = useState(initialProgress?.earnedXP ?? 0);
  const [finished, setFinished] = useState(initialProgress?.finished ?? false);

  const mission = MISSION_CHALLENGES[missionIdx];
  const missionContext = getMissionContext(mission);

  useEffect(() => {
    setMissionIdx(initialProgress?.missionIdx ?? (initialMissionIdx || 0));
    setShowQuestion(initialProgress?.showQuestion ?? false);
    setAnswer(initialProgress?.answer ?? "");
    setFeedback(initialProgress?.feedback ?? null);
    setEarnedXP(initialProgress?.earnedXP ?? 0);
    setFinished(initialProgress?.finished ?? false);
  }, [initialMissionIdx, initialProgress]);

  useEffect(() => {
    onMissionProgress && onMissionProgress({ missionIdx });
  }, [missionIdx]);

  useEffect(() => {
    onProgress && onProgress({ missionIdx, showQuestion, answer, feedback, earnedXP, finished });
  }, [missionIdx, showQuestion, answer, feedback, earnedXP, finished]);

  const normalize = (value) => String(value ?? "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9.]+/g, " ").trim();

  const isCorrect = () => {
    const value = normalize(answer);
    if (!value) return false;
    if (mission.answerType === "number") {
      const numeric = Number(String(value).replace(/[^0-9.\-]/g, ""));
      return Number.isFinite(numeric) && Math.abs(numeric - mission.answer) <= (mission.tolerance || 0.5);
    }
    return (mission.accepted || []).some(expected => value.includes(normalize(expected)) || normalize(expected).includes(value));
  };

  const handleSubmit = () => {
    if (!showQuestion || feedback) return;
    if (!answer.trim()) {
      setFeedback({ ok: false, text: "Escribe una respuesta antes de validar." });
      return;
    }

    const correct = isCorrect();
    if (correct && !feedback?.ok) {
      setEarnedXP(prev => prev + mission.xp);
    }

    setFeedback({
      ok: correct,
      text: correct ? `Correcto. +${mission.xp} XP` : `Aún no. ${mission.feedback}`,
      solution: correct ? null : (mission.answerType === "number" ? `${mission.answer}` : (mission.accepted || [])[0]),
    });
  };

  const nextMission = () => {
    if (missionIdx >= MISSION_CHALLENGES.length - 1) {
      setFinished(true);
      return;
    }
    setMissionIdx(i => i + 1);
    setShowQuestion(false);
    setFeedback(null);
    setAnswer("");
  };

  if (finished) {
    return (
      <div style={{ padding:28, flex:1, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <Card style={{ padding:36, maxWidth:560, width:"100%", textAlign:"center" }} glow={C.green}>
          <div style={{ fontSize:56, marginBottom:14 }}>🕵️</div>
          <h2 style={{ fontSize:28, fontWeight:900, marginBottom:10 }}>Misiones completadas</h2>
          <p style={{ color:C.muted, marginBottom:18, lineHeight:1.6 }}>
            Resolvieron el bloque de investigación libre y encontraron pistas con datos reales.
          </p>
          <div style={{ background:`${C.yellow}14`, border:`1px solid ${C.yellow}30`, borderRadius:14, padding:18, marginBottom:22 }}>
            <div style={{ fontSize:36, fontWeight:900, color:C.yellow, fontFamily:"Space Mono" }}>+{earnedXP} XP</div>
            <div style={{ color:C.muted, fontSize:13 }}>Ganados en la fase 3</div>
          </div>
          <Btn onClick={() => onComplete && onComplete(earnedXP)} variant="success" size="lg" style={{ width:"100%", justifyContent:"center" }}>
            Completar fase 3 →
          </Btn>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding:28, flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:12, flexWrap:"wrap" }}>
        <div>
          <Chip label={`Misión ${missionIdx + 1} de ${MISSION_CHALLENGES.length}`} color={C.green} />
          <h1 style={{ fontSize:24, fontWeight:900, marginTop:8 }}>🕵️ Fase 3: Misiones libres</h1>
          <p style={{ color:C.muted, fontSize:14, marginTop:6 }}>Primero el problema, luego la pregunta, y después a trastear la herramienta para encontrar la respuesta.</p>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
          <div style={{ background:`${C.yellow}15`, border:`1px solid ${C.yellow}25`, borderRadius:20, padding:"4px 14px" }}>
            <span style={{ color:C.yellow, fontWeight:800, fontFamily:"Space Mono" }}>⚡ {earnedXP} XP</span>
          </div>
        </div>
      </div>

      <div style={{ height:4, background:"rgba(255,255,255,0.06)", borderRadius:2 }}>
        <div style={{ width:`${(missionIdx / MISSION_CHALLENGES.length) * 100}%`, height:"100%", background:`linear-gradient(90deg,${C.green},${C.cyan})`, borderRadius:2, transition:"width 0.4s" }} />
      </div>

      <Card className="fade-in" style={{ padding:28 }} glow={C.green}>
        <div style={{ fontSize:11, color:C.muted, fontWeight:700, letterSpacing:1, textTransform:"uppercase", marginBottom:12 }}>Problema de negocio</div>
        <div style={{ display:"grid", gap:14 }}>
          <div style={{ padding:18, borderRadius:14, background:`linear-gradient(180deg, ${C.green}16, rgba(255,255,255,0.03))`, border:`1px solid ${C.green}35`, boxShadow:`0 12px 30px rgba(0,0,0,0.18)` }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
              <span style={{ fontSize:20 }}>🧩</span>
              <h2 style={{ fontSize:20, fontWeight:800, lineHeight:1.3 }}>{mission.title}</h2>
            </div>
            <div style={{ color:C.text, fontSize:15, lineHeight:1.75, fontWeight:500 }}>{mission.problem}</div>
            <div style={{ marginTop:14, padding:16, borderRadius:12, background:"linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.04))", border:`1px solid ${C.green}42`, color:C.text, fontSize:15, lineHeight:1.7, boxShadow:"0 10px 24px rgba(0,0,0,0.16)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                <span style={{ color:C.green, fontWeight:900, letterSpacing:0.3 }}>{missionContext.label}</span>
              </div>
              <div style={{ fontSize:16, fontWeight:600 }}>{missionContext.body}</div>
              <div style={{ marginTop:10, paddingTop:10, borderTop:`1px solid rgba(255,255,255,0.10)`, color:"rgba(255,255,255,0.88)", fontStyle:"italic" }}>{missionContext.hint}</div>
            </div>
          </div>

          {!showQuestion ? (
            <div style={{ display:"flex", justifyContent:"space-between", gap:10, flexWrap:"wrap", alignItems:"center" }}>
              <div style={{ color:C.muted, fontSize:13 }}>Cuando estés listo, pasa a la pregunta y luego vuelve a buscar la respuesta en DATASETS o GRAFICOS.</div>
              <Btn onClick={() => setShowQuestion(true)} variant="success">Ver pregunta →</Btn>
            </div>
          ) : (
            <div style={{ padding:16, borderRadius:14, background:"rgba(255,255,255,0.03)", border:`1px solid ${C.border}` }}>
              <div style={{ fontSize:11, color:C.muted, fontWeight:700, letterSpacing:1, textTransform:"uppercase", marginBottom:8 }}>Reto</div>
              <h2 style={{ fontSize:22, fontWeight:800, lineHeight:1.4, marginBottom:14 }}>{mission.question}</h2>

              <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:14 }}>
                {(mission.tools || []).map(tool => (
                  <Btn key={tool} variant="secondary" size="sm" onClick={() => onNav && onNav(tool)}>
                    Abrir {tool === "datasets" ? "DATASETS" : "GRAFICOS"}
                  </Btn>
                ))}
              </div>

              <input
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                placeholder="Escribe el nombre del canal o el valor que encontraste para resolver el misterio"
                style={{ marginBottom:12, fontSize:16, padding:"12px 16px" }}
              />

              {feedback && (
                <div style={{ marginBottom:12, padding:12, borderRadius:10, background:feedback.ok ? `${C.green}12` : `${C.yellow}10`, border:`1px solid ${feedback.ok ? C.green : C.yellow}30` }}>
                  <div style={{ fontWeight:800, color:feedback.ok ? C.green : C.yellow, marginBottom:4 }}>{feedback.ok ? "Respuesta validada" : "Pista"}</div>
                  <div style={{ color:C.muted, fontSize:13, lineHeight:1.5 }}>{feedback.text}</div>
                  {!feedback.ok && feedback.solution && (
                    <div style={{ color:C.text, fontSize:12, marginTop:8 }}>Referencia esperada: {feedback.solution}</div>
                  )}
                </div>
              )}

              <div style={{ display:"flex", justifyContent:"space-between", gap:10, flexWrap:"wrap" }}>
                <Btn
                  variant="secondary"
                  size="sm"
                  disabled={!!feedback}
                  onClick={() => { setShowQuestion(false); setFeedback(null); }}
                >
                  Volver al problema
                </Btn>
                <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                  <Btn variant="primary" size="sm" onClick={handleSubmit} disabled={!!feedback}>Validar respuesta</Btn>
                  {feedback && <Btn variant="success" size="sm" onClick={nextMission}>{missionIdx === MISSION_CHALLENGES.length - 1 ? "Finalizar fase 3" : "Siguiente misión"}</Btn>}
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════
// CHART EDITOR SCREEN (KEY SCREEN)
// ═══════════════════════════════════════════
function getCinematicPlacement(focus, preferredPlacement=null, forcePreferred=false) {
  const map = {
    left: { bottom:20, right:20 },
    right: { bottom:20, left:20 },
    axes: { bottom:20, right:20 },
    chart: { top:20, right:20 },
    chartTypes: { top:20, left:20 },
    header: { bottom:20, left:20 },
    filters: { bottom:20, right:20 },
    table: { top:20, right:20 },
    side: { top:20, left:20 },
    none: { bottom:20, left:"50%", transform:"translateX(-50%)" },
  };

  if (typeof window === "undefined" || typeof document === "undefined") {
    return map[focus] || map.none;
  }

  try {
    const selectors = [
      `[data-focus="${focus}"]`,
      `.${"focus-"+focus}`,
      `#${focus}`,
      `[data-tutorial="${focus}"]`,
      `[data-tut="${focus}"]`,
      `[aria-label="${focus}"]`,
    ];
    let el = null;
    for (const s of selectors) {
      try { el = document.querySelector(s); } catch(e) { el = null; }
      if (el) break;
    }
    if (!el) return map[focus] || map.none;

    const rect = el.getBoundingClientRect();
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    const overlayW = Math.min(560, vw - 40);
    const overlayH = Math.min(260, vh - 80);

    const clamp = (v, minV, maxV) => Math.max(minV, Math.min(maxV, v));

    const makeStyle = (placement) => {
      if (placement === "top") {
        const left = clamp(rect.left + rect.width/2 - overlayW/2, 20, vw - overlayW - 20);
        const top = clamp(rect.top - overlayH - 12, 20, vh - overlayH - 20);
        return { left: `${left}px`, top: `${top}px` };
      }
      if (placement === "bottom") {
        const left = clamp(rect.left + rect.width/2 - overlayW/2, 20, vw - overlayW - 20);
        const top = clamp(rect.bottom + 12, 20, vh - overlayH - 20);
        return { left: `${left}px`, top: `${top}px` };
      }
      if (placement === "left") {
        const left = clamp(rect.left - overlayW - 12, 20, vw - overlayW - 20);
        const top = clamp(rect.top, 20, vh - overlayH - 20);
        return { left: `${left}px`, top: `${top}px` };
      }
      if (placement === "right") {
        const left = clamp(rect.right + 12, 20, vw - overlayW - 20);
        const top = clamp(rect.top, 20, vh - overlayH - 20);
        return { left: `${left}px`, top: `${top}px` };
      }
      return null;
    };

    const space = {
      top: rect.top,
      bottom: vh - rect.bottom,
      left: rect.left,
      right: vw - rect.right,
    };

    // allow forcing preferred placement for specific tutorial steps
    if (preferredPlacement && forcePreferred) {
      const forced = makeStyle(preferredPlacement);
      if (forced) return forced;
    }

    // if a preferred placement was supplied, only use it when it fits (enough free space)
    if (preferredPlacement) {
      if (preferredPlacement === 'top' && space.top >= overlayH + 24) return makeStyle('top');
      if (preferredPlacement === 'bottom' && space.bottom >= overlayH + 24) return makeStyle('bottom');
      if (preferredPlacement === 'left' && space.left >= overlayW + 24) return makeStyle('left');
      if (preferredPlacement === 'right' && space.right >= overlayW + 24) return makeStyle('right');
      // if preferred doesn't have space, fall through to heuristics
    }

    const fits = [];
    if (space.bottom >= overlayH + 24) fits.push({ name: 'bottom', style: makeStyle('bottom'), score: space.bottom });
    if (space.top >= overlayH + 24) fits.push({ name: 'top', style: makeStyle('top'), score: space.top });
    if (space.right >= overlayW + 24) fits.push({ name: 'right', style: makeStyle('right'), score: space.right });
    if (space.left >= overlayW + 24) fits.push({ name: 'left', style: makeStyle('left'), score: space.left });

    if (fits.length) {
      fits.sort((a,b)=>b.score - a.score);
      return fits[0].style;
    }

    // fallback: try non-overlapping candidates (best-effort)
    const candidates = [
      { name: 'bottom', style: makeStyle('bottom') },
      { name: 'top', style: makeStyle('top') },
      { name: 'right', style: makeStyle('right') },
      { name: 'left', style: makeStyle('left') },
      { name: 'center', style: { left: `${Math.max(20, (vw - overlayW)/2)}px`, top: `${Math.min(vh - overlayH - 20, rect.bottom + 12)}px` } },
    ];

    const overlaps = (s) => {
      const left = parseFloat(s.left);
      const top = parseFloat(s.top);
      const right = left + overlayW;
      const bottom = top + overlayH;
      if (right < rect.left || left > rect.right || bottom < rect.top || top > rect.bottom) return false;
      return true;
    };

    for (const c of candidates) {
      if (!overlaps(c.style)) return c.style;
    }

    return map.none;
  } catch (e) {
    return map[focus] || map.none;
  }
}

function CinematicGuideOverlay({ step, total, accent, onNext, onSkip }) {
  if (!step) return null;
  const placement = getCinematicPlacement(step.focus, step.placement, !!step.forcePlacement);

  try {
    const selectors = [
      `[data-focus="${step.focus}"]`,
      `.${"focus-"+step.focus}`,
      `#${step.focus}`,
      `[data-tutorial="${step.focus}"]`,
      `[data-tut="${step.focus}"]`,
      `[aria-label="${step.focus}"]`,
    ];
    let targetEl = null;
    for (const s of selectors) {
      try { targetEl = document.querySelector(s); } catch(e) { targetEl = null; }
      if (targetEl) break;
    }

    const targetRect = targetEl ? targetEl.getBoundingClientRect() : null;
    const holePad = 8;
    const hole = targetRect ? {
      left: Math.max(0, targetRect.left - holePad),
      top: Math.max(0, targetRect.top - holePad),
      right: Math.min(window.innerWidth, targetRect.right + holePad),
      bottom: Math.min(window.innerHeight, targetRect.bottom + holePad),
    } : null;

    const dimStyle = {
      position: 'fixed',
      zIndex: 59,
      background: 'rgba(4,6,14,0.48)',
      backdropFilter: 'blur(2px) saturate(0.85)',
    };

    const backdrop = hole ? (
      <>
        <div onClick={onNext} style={{ ...dimStyle, left:0, top:0, right:0, height:`${hole.top}px` }} />
        <div onClick={onNext} style={{ ...dimStyle, left:0, top:`${hole.top}px`, width:`${hole.left}px`, height:`${Math.max(0, hole.bottom-hole.top)}px` }} />
        <div onClick={onNext} style={{ ...dimStyle, left:`${hole.right}px`, top:`${hole.top}px`, right:0, height:`${Math.max(0, hole.bottom-hole.top)}px` }} />
        <div onClick={onNext} style={{ ...dimStyle, left:0, top:`${hole.bottom}px`, right:0, bottom:0 }} />
      </>
    ) : (
      <div onClick={onNext} style={{ ...dimStyle, inset:0 }} />
    );

    let connector = null;
    if (targetRect) {
      const cx = targetRect.left + targetRect.width/2;
      const cy = targetRect.top + targetRect.height/2;
      const connStyle = {
        position: 'fixed',
        left: `${Math.max(8, cx - 22)}px`,
        top: `${Math.max(8, cy - 22)}px`,
        width: 44,
        height: 44,
        borderRadius: 44,
        border: `2px solid ${accent}88`,
        boxShadow: `0 0 22px ${accent}55`,
        background: 'transparent',
        zIndex: 10055,
        pointerEvents: 'none',
        animation: 'pulse 1.6s infinite',
      };
      connector = <div style={connStyle} />;
    }

    const cardStyle = {
      position: 'fixed',
      zIndex: 10060,
      width: 'min(560px, calc(100vw - 40px))',
      borderRadius: 16,
      border: `${'1px solid ' + accent}88`,
      background: `linear-gradient(135deg, ${accent}20, rgba(10,12,30,0.92))`,
      boxShadow: `0 14px 40px ${accent}44`,
      padding: 16,
      ...placement,
    };

    const card = (
      <div className="fade-in" style={cardStyle} onClick={(e)=>{ e.stopPropagation(); onNext(); }}>
        <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
          <div style={{ position:"relative", width:58, height:58, borderRadius:"50%", background:`radial-gradient(circle at 30% 30%, #fff, ${accent})`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <div style={{ position:"absolute", inset:-7, borderRadius:"50%", border:`1px solid ${accent}66`, animation:"pulse 2s infinite" }} />
            <span style={{ fontSize:28 }}>🧑‍🏫</span>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:10, flexWrap:"wrap", marginBottom:6 }}>
              <div style={{ fontSize:15, fontWeight:900, color:accent }}>{step.title}</div>
              <Chip label={`Cinemática ${step.index}/${total}`} color={accent} size="sm" />
            </div>
            <div style={{ color:C.text, fontSize:14, lineHeight:1.65 }}>{step.text}</div>
            <div style={{ marginTop:10, display:"flex", justifyContent:"space-between", alignItems:"center", gap:12, flexWrap:"wrap" }}>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.75)", fontStyle:"italic" }}>Haz clic en cualquier lugar para continuar</div>
              <Btn
                size="sm"
                variant="ghost"
                onClick={(e) => { e.stopPropagation(); onSkip(); }}
                style={{ border:`1px solid ${accent}66`, color:C.text }}
              >
                Saltar tutorial
              </Btn>
            </div>
          </div>
        </div>
      </div>
    );

    if (typeof ReactDOM !== 'undefined' && typeof document !== 'undefined' && document.body) {
      return ReactDOM.createPortal(
        <>
          {backdrop}
          {connector}
          {card}
        </>,
        document.body
      );
    }

    return (
      <div onClick={onNext} style={{ position: 'absolute', inset:0 }}>
        {backdrop}
        {connector}
        {card}
      </div>
    );
  } catch (e) {
    return null;
  }
}

function ChartEditorScreen({ onComplete, onVisit, onBackToMap, onBackToMission, phaseThreeActive=false, freeMode=false, tutorialMode=false, initialProgress=null, onProgress }) {
  const [chartType, setChartType] = useState(initialProgress?.chartType || "bar");
  const [xAxis, setXAxis] = useState(initialProgress?.xAxis ?? null);
  const [yAxis, setYAxis] = useState(initialProgress?.yAxis ?? null);
  const [catFilter, setCatFilter] = useState(initialProgress?.catFilter || "all");
  const [dragging, setDragging] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const [tutorialStep, setTutorialStep] = useState(0);

  useEffect(() => {
    setChartType(initialProgress?.chartType || "bar");
    setXAxis(initialProgress?.xAxis ?? null);
    setYAxis(initialProgress?.yAxis ?? null);
    setCatFilter(initialProgress?.catFilter || "all");
  }, [initialProgress]);

  const cats = ["all","Entertainment","Gaming","Music","Kids","Cooking","Tech","Sports","DIY","Education"];
  const allCols = COLUMNS;

  const chartTutorial = [
    {
      index: 1,
      focus: "left",
      title: "Bienvenida a GRAFICOS",
      text: "Soy Tawsito Analista. Esta herramienta te ayuda a convertir datos en historias visuales. Empezamos por el panel izquierdo: aquí eliges las variables del dataset.",
    },
    {
      index: 2,
      focus: "axes",
      placement: "top",
      title: "Ejes para construir una pregunta",
      text: "Arrastra una variable al eje X para agrupar y otra al eje Y para medir. Esta combinación define qué pregunta estás respondiendo con datos.",
    },
    {
      index: 3,
      focus: "chart",
      placement: "top",
      title: "Área de visualización",
      text: "Aquí aparece el gráfico. Si ves una tendencia clara o una diferencia fuerte entre grupos, ya estás encontrando evidencia útil para tu análisis.",
    },
    {
      index: 4,
      focus: "right",
      placement: "left",
      title: "Controles de lectura",
      text: "En este panel cambias tipo de gráfico y filtros. Esto te sirve para validar hipótesis: si el patrón se mantiene al filtrar, probablemente es robusto.",
    },
    {
      index: 5,
      focus: "chartTypes",
      placement: "left",
      title: "Tipos de gráficos: ¿cuál usar?",
      text: "Barras comparan categorías, línea muestra evolución, scatter revela relaciones y pie muestra proporciones del total. Elegir bien el tipo evita conclusiones engañosas.",
    },
    {
      index: 6,
      focus: "none",
      title: "Ahora juega como analista",
      text: "Listo. Prueba una comparación simple: categoría en X y una métrica en Y. Luego cambia el gráfico y observa si la historia sigue siendo la misma.",
    },
  ];

  useEffect(() => {
    if (tutorialMode) setTutorialStep(0);
  }, [tutorialMode]);

  useEffect(() => {
    if (onComplete) onComplete(200);
  }, []);

  useEffect(() => {
    onVisit && onVisit();
  }, []);

  useEffect(() => {
    onProgress && onProgress({ chartType, xAxis, yAxis, catFilter });
  }, [chartType, xAxis, yAxis, catFilter]);

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

  const tutorialActive = tutorialMode && tutorialStep < chartTutorial.length;
  const currentTutorial = tutorialActive ? chartTutorial[tutorialStep] : null;
  const highlight = (key) => tutorialActive && currentTutorial.focus === key;
  const nextTutorialStep = () => setTutorialStep((s) => Math.min(chartTutorial.length, s + 1));
  const skipTutorial = () => setTutorialStep(chartTutorial.length);

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", overflow:"hidden", position:"relative" }}>
      {/* Top bar */}
      <div style={{ padding:"12px 20px", background:C.surface, borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
        <div style={{ display:"flex", justifyContent:"space-between", gap:10, alignItems:"center", flexWrap:"wrap" }}>
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          <span style={{ fontSize:20 }}>📊</span>
          <span style={{ fontWeight:700, fontSize:15, color:C.text }}>Configura ejes, tipo de gráfico y filtros para explorar los datos.</span>
          </div>
          {tutorialMode && onBackToMap && (
            <Btn variant="ghost" size="sm" onClick={onBackToMap}>← Volver al mapa</Btn>
          )}
          {phaseThreeActive && onBackToMission && (
            <Btn variant="success" size="sm" onClick={onBackToMission}>🕵️ Volver a misiones</Btn>
          )}
        </div>
      </div>

      {/* Main 3-panel layout */}
      <div style={{ display:"grid", gridTemplateColumns:"200px 1fr 220px", flex:1, overflow:"hidden" }}>

        {/* LEFT — Columns */}
        <div data-tutorial="left" style={{ background:C.surface, borderRight:`1px solid ${C.border}`, overflowY:"auto", padding:14, position:"relative", zIndex:highlight("left") ? 10050 : 1, boxShadow:highlight("left") ? `0 0 0 2px ${C.cyan}, 0 0 22px ${C.cyan}66` : "none", animation:highlight("left") ? "pulse 1.6s infinite" : "none" }}>
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
        <div style={{ display:"flex", flexDirection:"column", overflow:"hidden", background:C.bg, position:"relative", zIndex:highlight("chart") || highlight("axes") ? 10050 : 1 }}>
          {/* Axis drop zones */}
          <div data-tutorial="axes" style={{ display:"flex", gap:10, padding:"10px 16px", flexShrink:0, boxShadow:highlight("axes") ? `0 0 0 2px ${C.purple}, 0 0 20px ${C.purple}66` : "none", borderRadius:10, animation:highlight("axes") ? "pulse 1.6s infinite" : "none" }}>
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
          <div data-tutorial="chart" style={{ flex:1, padding:"0 20px", display:"flex", flexDirection:"column", overflow:"hidden", boxShadow:highlight("chart") ? `0 0 0 2px ${C.yellow}, inset 0 0 22px ${C.yellow}2e` : "none", borderRadius:12, animation:highlight("chart") ? "pulse 1.6s infinite" : "none" }}>
            {renderChart()}
          </div>
        </div>

        {/* RIGHT — Controls */}
        <div data-tutorial="right" style={{ background:C.surface, borderLeft:`1px solid ${C.border}`, overflowY:"auto", padding:14, display:"flex", flexDirection:"column", gap:14, position:"relative", zIndex:highlight("right") || highlight("chartTypes") ? 10050 : 1, boxShadow:highlight("right") ? `0 0 0 2px ${C.green}, 0 0 22px ${C.green}66` : "none", animation:highlight("right") ? "pulse 1.6s infinite" : "none" }}>
          {/* Chart type */}
          <div data-tutorial="chartTypes" style={{ boxShadow:highlight("chartTypes") ? `0 0 0 2px ${C.yellow}, 0 0 18px ${C.yellow}66` : "none", borderRadius:10, padding:highlight("chartTypes") ? 8 : 0, animation:highlight("chartTypes") ? "pulse 1.4s infinite" : "none" }}>
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

          {/* Data summary */}
          <div style={{ background:`${C.green}10`, border:`1px solid ${C.green}20`, borderRadius:10, padding:12 }}>
            <div style={{ fontSize:11, fontWeight:800, color:C.green, marginBottom:8 }}>📋 Dataset actual</div>
            <div style={{ fontSize:12, color:C.muted }}>{filteredData.length} canales</div>
            <div style={{ fontSize:12, color:C.muted }}>{COLUMNS.length} columnas</div>
            <div style={{ fontSize:12, color:C.muted, marginTop:4 }}>Categoría: <span style={{ color:C.green }}>{catFilter==="all"?"Todas":catFilter}</span></div>
          </div>
        </div>
      </div>

      {tutorialActive && (
        <CinematicGuideOverlay
          step={currentTutorial}
          total={chartTutorial.length}
          accent={C.purple}
          onNext={nextTutorialStep}
          onSkip={skipTutorial}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// PITCH BUILDER
// ═══════════════════════════════════════════
function PitchBuilderScreen({ team, onComplete }) {
  const members = ((team?.members || []).concat(["", "", "", "", "", ""])).slice(0, 6);
  const mCount = members.filter(m => m && m.trim()).length || 6;
  const memberName = (i) => members[i]?.trim() || `Integrante ${i + 1}`;

  const SLIDE_DEFS = [
    { title:"Portada del equipo",  icon:"📋", color:C.purple,
      fields:[
        { k:"titulo",    label:"Título de su análisis",       ph:`Ej: \"Los secretos del algoritmo de TawsTube\"` },
        { k:"subtitulo", label:"Integrantes y fecha",         ph:`${team?.name || "Tu equipo"} · WiDS 2026` },
      ]},
    { title:"Pregunta de investigación", icon:"❓", color:C.cyan,
      fields:[
        { k:"pregunta",  label:"¿Qué pregunta intentaron responder?", ph:"Ej: ¿Los canales con más subs generan más ingresos?" },
        { k:"contexto",  label:"¿Qué datos usaron?",                  ph:"Ej: 15 canales de YouTube con datos de subs, vistas, ingresos..." },
      ]},
    { title:"Hallazgo principal", icon:"💡", color:C.green,
      fields:[
        { k:"hallazgo",  label:"¿Qué descubrieron? (lo más sorprendente)", ph:"Ej: Los canales infantiles generan 3× más ingresos que gaming" },
        { k:"evidencia", label:"¿Qué gráfico o correlación lo demuestra?", ph:"Ej: El scatter plot de subs vs. ingresos mostró que..." },
      ]},
    { title:"¿Por qué importa?", icon:"🌍", color:C.yellow,
      fields:[
        { k:"importancia", label:"¿Por qué es útil este hallazgo?",  ph:"Ej: Los creadores deberían diversificar hacia contenido familiar" },
        { k:"audiencia",   label:"¿A quién le sirve saber esto?",    ph:"Ej: Creadores, marcas, plataformas de streaming" },
      ]},
    { title:"Recomendación a Tawsito", icon:"🚀", color:C.pink,
      fields:[
        { k:"recomendacion", label:"Su consejo principal para la IA", ph:"Ej: Priorizar canales Kids y Educación en el algoritmo" },
        { k:"reflexion",     label:"¿Qué aprendió el equipo?",        ph:"Ej: Aprendimos que correlación no es causalidad..." },
      ]},
  ];

  const [step, setStep]           = useState(0);
  const [slideIdx, setSlideIdx]   = useState(0);
  const [slides, setSlides]       = useState(SLIDE_DEFS.map(s => ({ ...s, values: Object.fromEntries(s.fields.map(f=>[f.k,""])) })));
  const [approvals, setApprovals] = useState({});
  const [presenting, setPres]     = useState(false);
  const [presSlide, setPresSlide] = useState(0);
  const [xpAmount, setXpAmount]   = useState(null);

  const slideColors = SLIDE_DEFS.map(s => s.color);
  const memberForSlide = (i) => i % mCount;
  const updateField = (k, v) => setSlides(prev => prev.map((s,i) => i===slideIdx ? { ...s, values:{ ...s.values, [k]:v } } : s));
  const currentSlide = slides[slideIdx];
  const allApproved = Object.keys(approvals).length >= mCount;
  const slidesDone = slides.filter(s => Object.values(s.values).every(v => v.trim())).length;

  const giveXP = (amt) => { setXpAmount(amt); };

  if (presenting) return (
    <div style={{ position:"fixed", inset:0, background:C.bg, display:"flex", flexDirection:"column", zIndex:100,
      backgroundImage:`radial-gradient(ellipse at center, ${slideColors[presSlide]}18, transparent 65%)` }}>
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"32px 48px" }}>
        <div className="fade-in" style={{ maxWidth:760, width:"100%", textAlign:"center" }}>
          <div style={{ fontSize:72, marginBottom:20 }}>{SLIDE_DEFS[presSlide].icon}</div>
          <div style={{ fontSize:12, color:slideColors[presSlide], fontWeight:800, letterSpacing:2, textTransform:"uppercase", marginBottom:14 }}>
            Slide {presSlide+1} — {SLIDE_DEFS[presSlide].title}
          </div>
          {Object.values(slides[presSlide].values).filter(v=>v).map((v,i)=>(
            <p key={i} style={{ fontSize:i===0?26:16, fontWeight:i===0?800:400, color:i===0?C.text:C.muted, marginBottom:10, lineHeight:1.6 }}>{v}</p>
          ))}
          {!Object.values(slides[presSlide].values).some(v=>v) && (
            <p style={{ color:C.dim, fontStyle:"italic", fontSize:15 }}>— slide vacío —</p>
          )}
        </div>
      </div>
      <div style={{ padding:"14px 28px", background:C.surface, borderTop:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <Btn onClick={()=>setPresSlide(p=>Math.max(0,p-1))} variant="secondary" disabled={presSlide===0}>← Anterior</Btn>
        <div style={{ display:"flex", gap:8 }}>
          {SLIDE_DEFS.map((_,i)=>(
            <div key={i} onClick={()=>setPresSlide(i)} style={{ width:10, height:10, borderRadius:"50%",
              background:i===presSlide?slideColors[i]:"rgba(255,255,255,0.15)", cursor:"pointer", transition:"all 0.2s" }}/>
          ))}
        </div>
        {presSlide < SLIDE_DEFS.length-1
          ? <Btn onClick={()=>setPresSlide(p=>p+1)} variant="cyan">Siguiente →</Btn>
          : <Btn onClick={()=>{ setPres(false); if(step>=3) { onComplete&&onComplete(300); } }} variant="success">
              {step>=3 ? "Finalizar presentación ✓" : "Cerrar vista previa"}
            </Btn>
        }
      </div>
      <button onClick={()=>setPres(false)}
        style={{ position:"fixed", top:14, right:14, border:"none", background:"rgba(255,255,255,0.1)", borderRadius:8, color:C.muted, padding:"6px 14px", cursor:"pointer", fontSize:13, fontWeight:700 }}>
        ✕ Salir
      </button>
    </div>
  );

  if (step === 0) return (
    <div style={{ padding:28, flex:1, overflowY:"auto", display:"flex", alignItems:"center", justifyContent:"center" }}>
      {xpAmount && <XPPop amount={xpAmount} onDone={()=>setXpAmount(null)} />}
      <div className="fade-in" style={{ maxWidth:640, width:"100%" }}>
        <Card style={{ padding:32 }} glow={C.pink}>
          <div style={{ display:"flex", gap:16, alignItems:"flex-start", marginBottom:22 }}>
            <div style={{ fontSize:52, lineHeight:1, flexShrink:0 }}>🎤</div>
            <div>
              <Chip label="Fase 5 · Presentar Hallazgos" color={C.pink} />
              <h1 style={{ fontSize:26, fontWeight:900, margin:"8px 0" }}>Tawsito quiere escuchar su pitch</h1>
              <div style={{ background:`${C.pink}12`, border:`1px solid ${C.pink}30`, borderRadius:12, padding:14, marginTop:8 }}>
                <p style={{ color:C.text, fontSize:14, lineHeight:1.7, margin:0 }}>
                  "¡Lo lograron, equipo! 🎉 Analizaron los datos, encontraron correlaciones y descubrieron patrones increíbles.
                  Ahora necesito que me presenten sus hallazgos en 5 slides para que yo pueda aprender de verdad.
                  ¡Cada integrante tendrá su momento de protagonismo! 🚀"
                </p>
              </div>
            </div>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:22 }}>
            {SLIDE_DEFS.map((s,i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px",
                background:`${s.color}10`, border:`1px solid ${s.color}25`, borderRadius:10 }}>
                <span style={{ fontSize:20 }}>{s.icon}</span>
                <div>
                  <div style={{ fontWeight:700, fontSize:12, color:s.color }}>Slide {i+1}</div>
                  <div style={{ fontSize:12, color:C.muted }}>{s.title}</div>
                </div>
                <div style={{ marginLeft:"auto", fontSize:11, color:C.dim }}>{memberName(memberForSlide(i))}</div>
              </div>
            ))}
          </div>

          <Btn onClick={() => setStep(1)} variant="success" size="lg" style={{ width:"100%", justifyContent:"center" }}>
            ¡Construir presentación! 🎤 →
          </Btn>
        </Card>
      </div>
    </div>
  );

  if (step === 1) {
    const assignedMember = memberForSlide(slideIdx);
    const canAdvance = Object.values(currentSlide.values).every(v => v.trim().length >= 3);

    return (
      <div style={{ padding:28, flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:20 }}>
        {xpAmount && <XPPop amount={xpAmount} onDone={()=>setXpAmount(null)} />}

        <div style={{ display:"flex", gap:6, alignItems:"center" }}>
          {SLIDE_DEFS.map((s,i) => {
            const done = Object.values(slides[i].values).every(v=>v.trim().length>=3);
            const isCur = i === slideIdx;
            return (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:6 }}>
                <div style={{ width:isCur?36:28, height:28, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center",
                  background:done?`${s.color}30`:isCur?`${s.color}20`:"rgba(255,255,255,0.05)",
                  border:`2px solid ${done||isCur?s.color:C.border}`,
                  fontSize:isCur?14:12, transition:"all 0.2s" }}>
                  {done ? <span style={{ color:s.color }}>✓</span> : <span style={{ color:isCur?s.color:C.dim }}>{i+1}</span>}
                </div>
                {i < SLIDE_DEFS.length-1 && <div style={{ width:20, height:2, background:done?`${s.color}50`:C.border, borderRadius:1 }}/>} 
              </div>
            );
          })}
          <div style={{ marginLeft:"auto", fontSize:12, color:C.muted }}>{slidesDone}/5 completos</div>
        </div>

        <div style={{ display:"flex", alignItems:"center", gap:10, background:`${SLIDE_DEFS[slideIdx].color}15`,
          border:`1px solid ${SLIDE_DEFS[slideIdx].color}35`, borderRadius:12, padding:"10px 16px", alignSelf:"flex-start" }}>
          <span style={{ fontSize:20 }}>👤</span>
          <div>
            <div style={{ fontSize:11, color:SLIDE_DEFS[slideIdx].color, fontWeight:700 }}>Turno de</div>
            <div style={{ fontWeight:800, fontSize:15 }}>{memberName(assignedMember)}</div>
          </div>
          <div style={{ marginLeft:12, padding:"4px 10px", background:`${SLIDE_DEFS[slideIdx].color}20`, borderRadius:6, fontSize:11, color:SLIDE_DEFS[slideIdx].color, fontWeight:700 }}>
            {SLIDE_DEFS[slideIdx].icon} Slide {slideIdx+1}
          </div>
        </div>

        <Card style={{ padding:28 }} glow={SLIDE_DEFS[slideIdx].color}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:22 }}>
            <div style={{ width:48, height:48, borderRadius:12, background:`${SLIDE_DEFS[slideIdx].color}20`,
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>
              {SLIDE_DEFS[slideIdx].icon}
            </div>
            <div>
              <div style={{ fontSize:11, color:SLIDE_DEFS[slideIdx].color, fontWeight:800, letterSpacing:1, textTransform:"uppercase" }}>Slide {slideIdx+1}</div>
              <h2 style={{ fontSize:20, fontWeight:800, margin:0 }}>{SLIDE_DEFS[slideIdx].title}</h2>
            </div>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
            {currentSlide.fields.map(f => (
              <div key={f.k}>
                <label style={{ fontSize:12, fontWeight:700, color:C.muted, display:"block", marginBottom:6 }}>{f.label}</label>
                <textarea
                  value={currentSlide.values[f.k] || ""}
                  onChange={e => updateField(f.k, e.target.value)}
                  placeholder={f.ph}
                  rows={3}
                  style={{ resize:"none", fontSize:14, padding:"12px 14px", borderRadius:10, width:"100%", boxSizing:"border-box",
                    background:C.surface, border:`1px solid ${C.border}`, color:C.text, fontFamily:"Space Grotesk,sans-serif" }}
                />
              </div>
            ))}
          </div>
        </Card>

        <div style={{ display:"flex", gap:10 }}>
          {slideIdx > 0 && (
            <Btn onClick={() => setSlideIdx(i=>i-1)} variant="secondary">← Slide anterior</Btn>
          )}
          {slideIdx < SLIDE_DEFS.length-1 ? (
            <Btn onClick={() => { if(canAdvance){ giveXP(40); setSlideIdx(i=>i+1); } }} disabled={!canAdvance}
              variant="primary" style={{ marginLeft:"auto" }}>
              Guardar slide y continuar →
            </Btn>
          ) : (
            <Btn onClick={() => { if(canAdvance){ giveXP(40); setStep(2); } }} disabled={!canAdvance}
              variant="success" size="lg" style={{ marginLeft:"auto" }}>
              ¡Slides listos! → Revisión del equipo 👀
            </Btn>
          )}
        </div>

        {!canAdvance && (
          <p style={{ color:C.dim, fontSize:12, textAlign:"center" }}>Completa ambos campos para continuar (mínimo 3 caracteres cada uno).</p>
        )}
      </div>
    );
  }

  if (step === 2) return (
    <div style={{ padding:28, flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:20 }}>
      {xpAmount && <XPPop amount={xpAmount} onDone={()=>setXpAmount(null)} />}
      <div>
        <Chip label="Fase 5 · Revisión grupal" color={C.pink} />
        <h2 style={{ fontSize:22, fontWeight:800, margin:"8px 0 4px" }}>Revisen la presentación juntos</h2>
        <p style={{ color:C.muted, fontSize:14, margin:0 }}>Antes de aprobar, vean cómo quedó cada slide.</p>
      </div>

      <Btn onClick={() => { setPresSlide(0); setPres(true); }} variant="success" size="lg" style={{ alignSelf:"flex-start" }}>
        ▶ Ver presentación completa
      </Btn>

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {slides.map((s,i) => (
          <Card key={i} style={{ padding:16 }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:40, height:40, borderRadius:10, background:`${slideColors[i]}20`,
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>
                {SLIDE_DEFS[i].icon}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12, color:slideColors[i], fontWeight:700 }}>Slide {i+1} · {memberName(memberForSlide(i))}</div>
                <div style={{ fontWeight:700, fontSize:14 }}>{SLIDE_DEFS[i].title}</div>
                <div style={{ fontSize:12, color:C.muted, marginTop:2, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                  {Object.values(s.values).filter(v=>v)[0] || "— vacío —"}
                </div>
              </div>
              <Btn onClick={() => { setSlideIdx(i); setStep(1); }} variant="ghost" size="sm">Editar</Btn>
            </div>
          </Card>
        ))}
      </div>

      <Btn onClick={() => setStep(3)} variant="primary" size="lg" style={{ justifyContent:"center" }}>
        Todo se ve bien → Aprobación del equipo ✅
      </Btn>
    </div>
  );

  if (step === 3) return (
    <div style={{ padding:28, flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:20 }}>
      {xpAmount && <XPPop amount={xpAmount} onDone={()=>setXpAmount(null)} />}
      <div>
        <Chip label="Fase 5 · Aprobación final" color={C.pink} />
        <h2 style={{ fontSize:22, fontWeight:800, margin:"8px 0 4px" }}>¿El equipo aprueba la presentación?</h2>
        <p style={{ color:C.muted, fontSize:14, margin:0 }}>Cada integrante debe dar su OK antes de presentarle a Tawsito.</p>
      </div>

      <div style={{ padding:14, background:`${C.pink}10`, border:`1px solid ${C.pink}30`, borderRadius:12, display:"flex", gap:10 }}>
        <span style={{ fontSize:20 }}>🤖</span>
        <span style={{ fontSize:13, color:C.muted, lineHeight:1.6 }}>
          <strong style={{ color:C.pink }}>Tawsito:</strong> "¡Necesito que todos estén convencidos del análisis antes de entrenar mi IA con esos datos! La validación del equipo es parte del proceso científico. 🔬"
        </span>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
        {Array.from({ length: 6 }, (_, i) => i).map(i => {
          if (i >= mCount) return null;
          const approved = approvals[i];
          return (
            <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 16px",
              borderRadius:12, background:approved?`${C.green}12`:"rgba(255,255,255,0.03)",
              border:`1px solid ${approved?C.green:C.border}`, transition:"all 0.3s" }}>
              <div>
                <div style={{ fontWeight:700, fontSize:14, color:approved?C.green:C.text }}>{memberName(i)}</div>
                <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{approved?"✓ Aprobó la presentación":"Esperando aprobación..."}</div>
              </div>
              <button onClick={() => { if(!approved){ setApprovals(p=>({...p,[i]:true})); giveXP(30); } }}
                disabled={approved}
                style={{ border:"none", borderRadius:8, cursor:approved?"default":"pointer",
                  padding:"8px 16px", background:approved?`${C.green}25`:C.purple,
                  color:approved?C.green:"#fff", fontWeight:700, fontSize:13, transition:"all 0.2s" }}>
                {approved ? "✓ Aprobado" : "Yo apruebo"}
              </button>
            </div>
          );
        })}
      </div>

      {allApproved && (
        <Card style={{ padding:20, background:`linear-gradient(135deg,${C.pink}15,${C.purple}15)`, border:`1px solid ${C.pink}` }} glow={C.pink}>
          <div style={{ textAlign:"center", marginBottom:16 }}>
            <div style={{ fontSize:40, marginBottom:8 }}>🎉</div>
            <div style={{ fontWeight:800, fontSize:18, color:C.pink }}>¡El equipo aprobó! Tawsito está listo para aprender.</div>
          </div>
          <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
            <Btn onClick={() => { setPresSlide(0); setPres(true); }} variant="secondary">▶ Ver presentación final</Btn>
            <Btn onClick={() => { onComplete&&onComplete(300); }} variant="success" size="lg">
              Completar Fase 5 +300 XP ⚡
            </Btn>
          </div>
        </Card>
      )}
    </div>
  );

  return null;
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

// ═══════════════════════════════════════════
// NEW CORE MODULES: MAPA / DATASETS / GRAFICOS
// ═══════════════════════════════════════════

function MapaScreen({ team, onNav, onPhaseComplete, phaseOneTutorialReady=true, phaseOneTutorialProgress={ datasets:false, graficos:false, confirmed:false }, onConfirmPhaseOneTutorial }) {
  const tutorialStep = !phaseOneTutorialProgress.datasets
    ? 1
    : !phaseOneTutorialProgress.graficos
      ? 2
      : !phaseOneTutorialProgress.confirmed
        ? 3
        : 4;

  const tutorialFlow = {
    1: { title: "Paso 1 · Explora la tabla", copy: "Abre DATASETS y mira qué columnas tienes disponibles. No busques respuestas todavía; solo ubica el terreno.", color: C.cyan, icon: "🧭" },
    2: { title: "Paso 2 · Construye una vista", copy: "Ahora abre GRAFICOS y prueba una métrica simple. Empieza con una comparación fácil de leer.", color: C.purple, icon: "📊" },
    3: { title: "Paso 3 · Confirma tu lectura", copy: "Si ya viste ambos módulos, confirma la guía para desbloquear la fase 1.", color: C.green, icon: "✅" },
    4: { title: "Guía completada", copy: "Ya puedes completar la fase 1 y avanzar al siguiente reto.", color: C.green, icon: "🚀" },
  };

  const tutorialState = tutorialFlow[tutorialStep];

  const PHASES = [
    {
      id: 1,
      title: "Tutorial de Datasets y Gráficos",
      desc: "Aprende a leer columnas, filtrar datos y construir tu primer gráfico.",
      task: "Abre DATASETS para conocer la tabla y luego pasa a GRAFICOS para visualizar una métrica simple.",
      icon: "🔎",
      color: C.cyan,
    },
    {
      id: 2,
      title: "Fase teórica",
      desc: "Lee un concepto antes de cada pregunta y responde elige la opción correcta.",
      task: "Completa el quiz teórico: lee el concepto y escoge la mejor opción.",
      icon: "❓",
      color: C.cyan,
    },
    {
      id: 3,
      title: "Analizar Categorías",
      desc: "Descubre distribuciones y segmentación.",
      task: "Filtra DATASETS por categoría y analiza patrones.",
      icon: "🏷️",
      color: C.green,
    },
    {
      id: 4,
      title: "Descubrir Correlaciones",
      desc: "Encuentra relaciones entre métricas clave.",
      task: "Crea gráficos de dispersión en GRAFICOS.",
      icon: "🔗",
      color: C.yellow,
    },
    {
      id: 5,
      title: "Presentar Hallazgos",
      desc: "Resume tus descubrimientos principales.",
      task: "Documenta los 3 insights más importantes.",
      icon: "🎯",
      color: C.pink,
    },
  ];

  return (
    <div style={{ padding:28, flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:24 }}>
      <div>
        <h1 style={{ fontSize:28, fontWeight:800, marginBottom:4 }}>
          Mapa de Fases de <span style={{ background:`linear-gradient(135deg,${C.purple},${C.cyan})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{team.name}</span>
        </h1>
        <p style={{ color:C.muted, fontSize:15 }}>Recorrido de análisis: 5 fases de descubrimiento usando DATASETS y GRAFICOS como herramientas.</p>
      </div>

      <Card style={{ padding:18 }} glow={C.cyan}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <div style={{ fontSize:13, fontWeight:700, color:C.muted }}>Progreso de fases</div>
          <div style={{ fontFamily:"Space Mono", fontWeight:800, color:C.cyan }}>Fase {team.phase}/5</div>
        </div>
        <div style={{ height:10, background:"rgba(255,255,255,0.08)", borderRadius:8, overflow:"hidden" }}>
          <div style={{ width:`${(team.phase / 5) * 100}%`, height:"100%", background:`linear-gradient(90deg,${C.cyan},${C.purple})`, transition:"width 0.4s" }}/>
        </div>
      </Card>

      

      <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
        {PHASES.map((phase, idx) => {
          const isActive = team.phase === phase.id;
          const isCompleted = team.phase > phase.id;
          const isLocked = team.phase < phase.id;

          return (
            <Card
              key={phase.id}
              style={{
                padding:18,
                border:`2px solid ${isActive ? phase.color : isCompleted ? C.green : isLocked ? C.border : C.border}`,
                background:isActive ? `${phase.color}12` : isCompleted ? `${C.green}08` : isLocked ? "rgba(255,255,255,0.02)" : C.card,
                opacity: isLocked ? 0.6 : 1,
                transition:"all 0.3s",
              }}
            >
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                <div style={{ display:"flex", gap:12, flex:1 }}>
                  <div style={{ fontSize:28 }}>{phase.icon}</div>
                  <div>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                      <div style={{ fontSize:16, fontWeight:800 }}>Fase {phase.id}: {phase.title}</div>
                      {isCompleted && <Chip label="✓ Completado" color={C.green} size="sm" />}
                      {isActive && <Chip label="Actual" color={phase.color} size="sm" />}
                      {isLocked && <Chip label="Bloqueado" color={C.muted} size="sm" />}
                    </div>
                    <div style={{ color:C.muted, fontSize:13, marginBottom:8 }}>{phase.desc}</div>
                    <div style={{ fontSize:12, color:C.muted, background:"rgba(255,255,255,0.03)", padding:"8px 12px", borderRadius:6 }}>
                      <strong>Tarea:</strong> {phase.task}
                    </div>
                  </div>
                </div>
              </div>

              {isActive && phase.id === 1 ? (
                <div style={{ marginTop:14, paddingTop:14, borderTop:`1px solid ${phase.color}40` }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, marginBottom:14, flexWrap:"wrap" }}>
                    <div>
                      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
                        <span style={{ fontSize:20 }}>{tutorialState.icon}</span>
                        <div style={{ fontSize:16, fontWeight:800 }}>{tutorialState.title}</div>
                      </div>
                      <div style={{ color:C.muted, fontSize:13 }}>{tutorialState.copy}</div>
                    </div>
                    <Chip label={phaseOneTutorialReady ? "Listo para completar" : `Paso ${tutorialStep}/3`} color={phaseOneTutorialReady ? C.green : tutorialState.color} />
                  </div>

                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:10, marginBottom:14 }}>
                    <div style={{ padding:12, borderRadius:10, background:phaseOneTutorialProgress.datasets ? `${C.green}18` : tutorialStep === 1 ? `${tutorialState.color}16` : "rgba(255,255,255,0.03)", border:`1px solid ${phaseOneTutorialProgress.datasets ? C.green : tutorialStep === 1 ? tutorialState.color : C.border}`, boxShadow:tutorialStep === 1 && !phaseOneTutorialProgress.datasets ? `0 0 18px ${tutorialState.color}22` : "none", animation:tutorialStep === 1 ? "fadeIn 0.25s ease" : "none" }}>
                      <div style={{ fontWeight:800, marginBottom:6 }}>1. Explora la tabla</div>
                      <div style={{ fontSize:12, color:C.muted, marginBottom:10 }}>Abre DATASETS para revisar columnas, filtros y ordenamiento.</div>
                      <Btn variant={phaseOneTutorialProgress.datasets ? "success" : "primary"} size="sm" onClick={() => onNav("datasets")}>
                        {phaseOneTutorialProgress.datasets ? "Visto" : "Abrir DATASETS"}
                      </Btn>
                    </div>
                    <div style={{ padding:12, borderRadius:10, background:phaseOneTutorialProgress.graficos ? `${C.green}18` : tutorialStep === 2 ? `${tutorialState.color}16` : "rgba(255,255,255,0.03)", border:`1px solid ${phaseOneTutorialProgress.graficos ? C.green : tutorialStep === 2 ? tutorialState.color : C.border}`, boxShadow:tutorialStep === 2 && !phaseOneTutorialProgress.graficos ? `0 0 18px ${tutorialState.color}22` : "none", animation:tutorialStep === 2 ? "fadeIn 0.25s ease" : "none" }}>
                      <div style={{ fontWeight:800, marginBottom:6 }}>2. Crea un gráfico</div>
                      <div style={{ fontSize:12, color:C.muted, marginBottom:10 }}>Abre GRAFICOS y arrastra una métrica numérica al eje Y.</div>
                      <Btn variant={phaseOneTutorialProgress.graficos ? "success" : "primary"} size="sm" onClick={() => onNav("graficos")}>
                        {phaseOneTutorialProgress.graficos ? "Visto" : "Abrir GRAFICOS"}
                      </Btn>
                    </div>
                    <div style={{ padding:12, borderRadius:10, background:phaseOneTutorialProgress.confirmed ? `${C.green}18` : tutorialStep === 3 ? `${tutorialState.color}16` : "rgba(255,255,255,0.03)", border:`1px solid ${phaseOneTutorialProgress.confirmed ? C.green : tutorialStep === 3 ? tutorialState.color : C.border}`, boxShadow:tutorialStep === 3 && !phaseOneTutorialProgress.confirmed ? `0 0 18px ${tutorialState.color}22` : "none", animation:tutorialStep === 3 ? "fadeIn 0.25s ease" : "none" }}>
                      <div style={{ fontWeight:800, marginBottom:6 }}>3. Confirma que entendiste</div>
                      <div style={{ fontSize:12, color:C.muted, marginBottom:10 }}>Cuando ya abriste ambos módulos, confirma para desbloquear la fase.</div>
                      <Btn
                        variant={phaseOneTutorialProgress.confirmed ? "success" : "secondary"}
                        size="sm"
                        disabled={!phaseOneTutorialProgress.datasets || !phaseOneTutorialProgress.graficos || phaseOneTutorialProgress.confirmed}
                        onClick={() => onConfirmPhaseOneTutorial && onConfirmPhaseOneTutorial()}
                      >
                        {phaseOneTutorialProgress.confirmed ? "Confirmado" : "Confirmar guía"}
                      </Btn>
                    </div>
                  </div>

                  <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:12, color:C.muted }}>
                    <span style={{ color:tutorialState.color, fontSize:14 }}>{tutorialState.icon}</span>
                    <span>
                      Estado: {phaseOneTutorialProgress.datasets ? "DATASETS listo" : "DATASETS pendiente"} · {phaseOneTutorialProgress.graficos ? "GRAFICOS listo" : "GRAFICOS pendiente"} · {phaseOneTutorialProgress.confirmed ? "Guía confirmada" : "Guía pendiente"}
                    </span>
                  </div>

                  <div style={{ display:"flex", gap:10, marginTop:14 }}>
                    <Btn
                      variant="secondary"
                      disabled={!phaseOneTutorialReady}
                      onClick={() => onPhaseComplete && onPhaseComplete()}
                    >
                      {phaseOneTutorialReady ? "Completar Fase 1 y desbloquear Fase 2 →" : "Completa la guía para habilitar Fase 2"}
                    </Btn>
                  </div>
                </div>
              ) : isActive ? (
                <div style={{ display:"flex", gap:10, marginTop:14, paddingTop:14, borderTop:`1px solid ${phase.color}40` }}>
                  <Btn variant="primary" onClick={() => onNav("datasets")}>
                    📊 DATASETS
                  </Btn>
                  {/* For phase 2 show the theoretical quiz instead of opening GRAFICOS */}
                  {phase.id === 2 ? (
                    <Btn variant="primary" onClick={() => onNav("quiz")}>
                      ❓ Fase Teórica (Quiz)
                    </Btn>
                  ) : phase.id === 3 ? (
                    <Btn variant="primary" onClick={() => onNav("analysis")}> 
                      🕵️ Misiones libres
                    </Btn>
                  ) : phase.id === 4 ? (
                    <Btn variant="primary" onClick={() => onNav("correlaciones") }>
                      📈 Correlaciones
                    </Btn>
                  ) : phase.id === 5 ? (
                    <Btn variant="primary" onClick={() => onNav("pitch") }>
                      🎤 Pitch Builder
                    </Btn>
                  ) : (
                    <Btn variant="primary" onClick={() => onNav("graficos")}>
                      📈 GRAFICOS
                    </Btn>
                  )}
                  <Btn
                    variant="secondary"
                    disabled={phase.id === 1 && !phaseOneTutorialReady}
                    onClick={() => onPhaseComplete && onPhaseComplete()}
                  >
                    {phase.id === 1 && !phaseOneTutorialReady ? "Abre DATASETS y GRAFICOS primero" : "Fase completada →"}
                  </Btn>
                </div>
              ) : null}
              {isCompleted && (
                <div style={{ display:"flex", gap:10, marginTop:14, paddingTop:14, borderTop:`1px solid ${C.green}40` }}>
                  <Btn variant="secondary" onClick={() => onNav("datasets")}>
                    📊 Revisar DATASETS
                  </Btn>
                  {phase.id === 2 ? (
                    <Btn variant="secondary" onClick={() => onNav("quiz")}>
                      ❓ Revisar Quiz
                    </Btn>
                  ) : phase.id === 3 ? (
                    <Btn variant="secondary" onClick={() => onNav("analysis")}>
                      🕵️ Revisar Misiones
                    </Btn>
                  ) : phase.id === 4 ? (
                    <Btn variant="secondary" onClick={() => onNav("correlaciones") }>
                      📈 Revisar Correlaciones
                    </Btn>
                  ) : phase.id === 5 ? (
                    <Btn variant="secondary" onClick={() => onNav("pitch") }>
                      🎤 Revisar Pitch
                    </Btn>
                  ) : (
                    <Btn variant="secondary" onClick={() => onNav("graficos")}>
                      📈 Revisar GRAFICOS
                    </Btn>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {team.phase >= 5 && (
        <Card style={{ padding:20, background:`linear-gradient(135deg,${C.green}20,${C.cyan}20)`, border:`1px solid ${C.green}` }} glow={C.green}>
          <div style={{ fontSize:20, fontWeight:800, marginBottom:8, display:"flex", alignItems:"center", gap:8 }}>
            🎉 ¡Análisis completado!
          </div>
          <p style={{ color:C.muted, fontSize:14 }}>
            Has recorrido todas las fases de análisis de TawsTube. Tus hallazgos han ayudado a entender mejor los datos de contenido de video.
          </p>
        </Card>
      )}
    </div>
  );
}

function DatasetsScreen({ onVisit, onBackToMap, onBackToMission, phaseThreeActive=false, tutorialMode=false, initialProgress=null, onProgress }) {
  const [search, setSearch] = useState(initialProgress?.search || "");
  const [category, setCategory] = useState(initialProgress?.category || "all");
  const [country, setCountry] = useState(initialProgress?.country || "all");
  const [sortKey, setSortKey] = useState(initialProgress?.sortKey || "views");
  const [sortDir, setSortDir] = useState(initialProgress?.sortDir || "desc");
  const [hiddenRows, setHiddenRows] = useState(initialProgress?.hiddenRows || []);
  const [tutorialStep, setTutorialStep] = useState(0);

  useEffect(() => { onVisit && onVisit(); }, []);

  useEffect(() => {
    setSearch(initialProgress?.search || "");
    setCategory(initialProgress?.category || "all");
    setCountry(initialProgress?.country || "all");
    setSortKey(initialProgress?.sortKey || "views");
    setSortDir(initialProgress?.sortDir || "desc");
    setHiddenRows(initialProgress?.hiddenRows || []);
  }, [initialProgress]);

  useEffect(() => {
    onProgress && onProgress({ search, category, country, sortKey, sortDir, hiddenRows });
  }, [search, category, country, sortKey, sortDir, hiddenRows]);

  const categories = ["all", ...new Set(YT_DATA.map(d => d.category))];
  const countries = ["all", ...new Set(YT_DATA.map(d => d.country))];

  const datasetTutorial = [
    {
      index: 1,
      focus: "header",
      title: "Llegaste a DATASETS",
      text: "Soy Tawsito Analista. Aquí lees el estado real del problema en formato tabla: filas como canales y columnas como variables que luego podrás comparar.",
    },
    {
      index: 2,
      focus: "filters",
      title: "Búsqueda y filtros",
      text: "Este bloque te ayuda a recortar ruido. Buscar, filtrar por categoría o país y ordenar es la base para no sacar conclusiones con datos mezclados.",
    },
    {
      index: 3,
      focus: "table",
      placement: "top",
      forcePlacement: true,
      title: "Lectura de la tabla",
      text: "En la tabla puedes detectar extremos, comparar magnitudes y ubicar patrones preliminares. Es el paso previo a cualquier gráfico serio.",
    },
    {
      index: 4,
      focus: "side",
      title: "Ocultar para comparar mejor",
      text: "Este panel sirve para ocultar filas y quedarte con los casos importantes. Así puedes observar contrastes sin que todo compita por tu atención.",
    },
    {
      index: 5,
      focus: "none",
      title: "Transición a GRAFICOS",
      text: "Cuando ya entendiste qué variable mirar, ve a GRAFICOS para convertir esta lectura tabular en una visualización que comunique el hallazgo.",
    },
  ];

  useEffect(() => {
    if (tutorialMode) setTutorialStep(0);
  }, [tutorialMode]);

  const filtered = YT_DATA.filter(d => {
    const txt = search.trim().toLowerCase();
    const matchText = !txt || d.channel.toLowerCase().includes(txt) || d.category.toLowerCase().includes(txt) || d.country.toLowerCase().includes(txt);
    const matchCategory = category === "all" || d.category === category;
    const matchCountry = country === "all" || d.country === country;
    return matchText && matchCategory && matchCountry;
  });

  const sorted = [...filtered].sort((a,b) => {
    const va = a[sortKey];
    const vb = b[sortKey];
    const cmp = typeof va === "number" && typeof vb === "number"
      ? va - vb
      : String(va).localeCompare(String(vb));
    return sortDir === "asc" ? cmp : -cmp;
  });

  const visibleRows = sorted.filter(d => !hiddenRows.includes(d.id));
  const hiddenItems = YT_DATA.filter(d => hiddenRows.includes(d.id));

  const toggleRow = (id) => {
    setHiddenRows(prev => prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]);
  };

  const showOnly = (id) => setHiddenRows(YT_DATA.filter(d => d.id !== id).map(d => d.id));

  const resetHidden = () => setHiddenRows([]);

  const headers = [
    { key:"channel", label:"Canal" },
    { key:"category", label:"Categoría" },
    { key:"country", label:"País" },
    { key:"subs", label:"Subs (M)" },
    { key:"views", label:"Vistas (M)" },
    { key:"videos", label:"Videos" },
    { key:"avgViews", label:"Avg/video (M)" },
    { key:"likes", label:"Likes %" },
    { key:"revenue", label:"Ingresos (M$)" },
    { key:"actions", label:"Acciones" },
  ];

  const toggleSort = (k) => {
    if (sortKey === k) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(k); setSortDir("desc"); }
  };

  const tutorialActive = tutorialMode && tutorialStep < datasetTutorial.length;
  const currentTutorial = tutorialActive ? datasetTutorial[tutorialStep] : null;
  const highlight = (key) => tutorialActive && currentTutorial.focus === key;
  const nextTutorialStep = () => setTutorialStep((s) => Math.min(datasetTutorial.length, s + 1));
  const skipTutorial = () => setTutorialStep(datasetTutorial.length);

  return (
    <div style={{ padding:28, flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:16, position:"relative" }}>
      <div data-tutorial="header" style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", gap:14, flexWrap:"wrap", position:"relative", zIndex:highlight("header") ? 10050 : 1, boxShadow:highlight("header") ? `0 0 0 2px ${C.cyan}, 0 0 22px ${C.cyan}66` : "none", borderRadius:12, animation:highlight("header") ? "pulse 1.6s infinite" : "none" }}>
        <div>
          <h1 style={{ fontSize:26, fontWeight:800, marginBottom:4 }}>DATASETS</h1>
          <p style={{ color:C.muted, fontSize:14 }}>Tabla interactiva para explorar datos con filtros, búsqueda y ordenamiento.</p>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
          <Chip label={`${sorted.length} filas visibles`} color={C.cyan} />
          {tutorialMode && onBackToMap && <Btn variant="ghost" size="sm" onClick={onBackToMap}>← Volver al mapa</Btn>}
          {phaseThreeActive && onBackToMission && <Btn variant="success" size="sm" onClick={onBackToMission}>🕵️ Volver a misiones</Btn>}
        </div>
      </div>

      <Card data-tutorial="filters" style={{ padding:14, position:"relative", zIndex:highlight("filters") ? 10050 : 1, boxShadow:highlight("filters") ? `0 0 0 2px ${C.purple}, 0 0 22px ${C.purple}66` : "none", animation:highlight("filters") ? "pulse 1.6s infinite" : "none" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1.3fr 1fr 1fr auto auto", gap:10 }}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar por canal, categoría o país" />
          <select value={category} onChange={e=>setCategory(e.target.value)}>
            {categories.map(c => <option key={c} value={c}>{c === "all" ? "Todas las categorías" : c}</option>)}
          </select>
          <select value={country} onChange={e=>setCountry(e.target.value)}>
            {countries.map(c => <option key={c} value={c}>{c === "all" ? "Todos los países" : c}</option>)}
          </select>
          <Btn variant="secondary" onClick={() => { setSearch(""); setCategory("all"); setCountry("all"); setSortKey("views"); setSortDir("desc"); }}>
            Reset
          </Btn>
          <Btn variant="ghost" onClick={resetHidden}>Mostrar todo</Btn>
        </div>
      </Card>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 280px", gap:14, alignItems:"start" }}>
        <Card data-tutorial="table" style={{ overflowX:"auto", position:"relative", zIndex:highlight("table") ? 10050 : 1, boxShadow:highlight("table") ? `0 0 0 2px ${C.green}, 0 0 22px ${C.green}66` : "none", animation:highlight("table") ? "pulse 1.6s infinite" : "none" }}>
          <div style={{ padding:"12px 14px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:`1px solid ${C.border}` }}>
            <div style={{ fontSize:12, color:C.muted }}>Mostrando {visibleRows.length} de {sorted.length} filas filtradas</div>
            <div style={{ fontSize:12, color:C.muted }}>Ocultas: {hiddenRows.length}</div>
          </div>
          <table style={{ width:"100%", borderCollapse:"collapse", minWidth:980 }}>
          <thead>
            <tr style={{ background:`${C.purple}12` }}>
              {headers.map(h => {
                const active = sortKey === h.key;
                return (
                  <th key={h.key} onClick={() => toggleSort(h.key)}
                    style={{ padding:"10px 12px", textAlign:"left", cursor:"pointer", fontSize:12, color:active ? C.purple : C.muted, borderBottom:`1px solid ${C.border}` }}>
                    {h.label} {active ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((d, i) => (
              <tr key={d.id} style={{ borderBottom:`1px solid ${C.border2}`, background:i % 2 ? "transparent" : "rgba(255,255,255,0.02)" }}>
                <td style={{ padding:"9px 12px", fontWeight:700 }}>{d.channel}</td>
                <td style={{ padding:"9px 12px" }}><Chip label={d.category} color={C.cyan} size="sm" /></td>
                <td style={{ padding:"9px 12px", color:C.muted }}>{d.country}</td>
                <td style={{ padding:"9px 12px", fontFamily:"Space Mono" }}>{d.subs}</td>
                <td style={{ padding:"9px 12px", fontFamily:"Space Mono" }}>{d.views.toLocaleString()}</td>
                <td style={{ padding:"9px 12px", fontFamily:"Space Mono" }}>{d.videos.toLocaleString()}</td>
                <td style={{ padding:"9px 12px", fontFamily:"Space Mono" }}>{d.avgViews}</td>
                <td style={{ padding:"9px 12px", fontFamily:"Space Mono" }}>{d.likes}%</td>
                <td style={{ padding:"9px 12px", fontFamily:"Space Mono" }}>${d.revenue}</td>
                <td style={{ padding:"9px 12px", textAlign:"right" }}>
                  <Btn variant="ghost" size="sm" onClick={() => toggleRow(d.id)}>{hiddenRows.includes(d.id) ? "Mostrar" : "Ocultar"}</Btn>
                </td>
              </tr>
            ))}
            {!visibleRows.length && (
              <tr>
                <td colSpan={10} style={{ padding:"20px", textAlign:"center", color:C.muted }}>No hay filas visibles con estos filtros.</td>
              </tr>
            )}
          </tbody>
          </table>
        </Card>

        <Card data-tutorial="side" style={{ padding:14, position:"sticky", top:14, zIndex:highlight("side") ? 10050 : 1, boxShadow:highlight("side") ? `0 0 0 2px ${C.yellow}, 0 0 22px ${C.yellow}66` : "none", animation:highlight("side") ? "pulse 1.6s infinite" : "none" }}>
          <div style={{ fontSize:12, fontWeight:800, color:C.muted, letterSpacing:1, textTransform:"uppercase", marginBottom:10 }}>Ocultar / mostrar filas</div>
          <div style={{ fontSize:12, color:C.muted, marginBottom:12 }}>Usa esta lista para esconder registros individuales y comparar sin ruido.</div>
          <div style={{ display:"flex", flexDirection:"column", gap:8, maxHeight:540, overflowY:"auto" }}>
            {YT_DATA.map(d => {
              const isHidden = hiddenRows.includes(d.id);
              return (
                <div key={d.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8, padding:"8px 10px", borderRadius:10, background:isHidden ? `${C.red}10` : `${C.green}08`, border:`1px solid ${isHidden ? C.red : C.green}20` }}>
                  <div style={{ minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:700, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{d.channel}</div>
                    <div style={{ fontSize:11, color:C.muted }}>{d.category} · {d.country}</div>
                  </div>
                  <div style={{ display:"flex", gap:6 }}>
                    <Btn variant={isHidden ? "success" : "secondary"} size="sm" onClick={() => toggleRow(d.id)}>{isHidden ? "Mostrar" : "Ocultar"}</Btn>
                    <Btn variant="ghost" size="sm" onClick={() => showOnly(d.id)}>Solo este</Btn>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {tutorialActive && (
        <CinematicGuideOverlay
          step={currentTutorial}
          total={datasetTutorial.length}
          accent={C.cyan}
          onNext={nextTutorialStep}
          onSkip={skipTutorial}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// ADMIN: LEADERBOARD
// ═══════════════════════════════════════════
function AdminLeaderboardScreen({ teams }) {
  const sorted = [...teams].sort((a, b) => {
    if (b.phase !== a.phase) return b.phase - a.phase;
    return b.xp - a.xp;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card style={{ padding: 20, background: `linear-gradient(135deg,${C.purple}20,${C.cyan}20)`, border: `1px solid ${C.purple}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>🏆 Top Equipos</div>
            <p style={{ color: C.muted, fontSize: 13 }}>Ranking por fase completada y experiencia acumulada</p>
          </div>
          <div style={{ fontSize: 48 }}>📊</div>
        </div>
      </Card>

      <Card style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ background: `${C.purple}15`, borderBottom: `1px solid ${C.border}` }}>
              <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 800, color: C.muted }}>Posición</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 800, color: C.muted }}>Equipo</th>
              <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 800, color: C.muted }}>Integrantes</th>
              <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 800, color: C.muted }}>Fase</th>
              <th style={{ padding: "12px 16px", textAlign: "right", fontWeight: 800, color: C.muted }}>XP</th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: "24px", textAlign: "center", color: C.muted }}>
                  Sin equipos registrados aún
                </td>
              </tr>
            ) : (
              sorted.map((team, idx) => (
                <tr key={team.id} style={{ borderBottom: `1px solid ${C.border}`, background: idx < 3 ? `${C.purple}08` : "transparent" }}>
                  <td style={{ padding: "12px 16px", textAlign: "left", fontWeight: 800, color: idx === 0 ? C.yellow : idx === 1 ? C.cyan : idx === 2 ? C.green : C.light }}>
                    {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`}
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "left" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 20 }}>{team.avatar}</span>
                      <div>
                        <div style={{ fontWeight: 700 }}>{team.name}</div>
                        <div style={{ color: C.muted, fontSize: 11 }}>{team.members.length} miembro{team.members.length !== 1 ? "s" : ""}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "center", color: C.muted, fontSize: 12 }}>
                    {team.members.join(", ")}
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "center" }}>
                    <Chip label={`Fase ${team.phase}/5`} color={team.phase === 5 ? C.green : team.phase >= 3 ? C.cyan : C.muted} size="sm" />
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "right", fontFamily: "Space Mono", fontWeight: 700 }}>
                    {team.xp.toLocaleString()} XP
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>

      {sorted.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <Card style={{ padding: 16, textAlign: "center", background: `${C.cyan}10`, border: `1px solid ${C.cyan}25` }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>📊</div>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 2 }}>{sorted.length}</div>
            <div style={{ fontSize: 12, color: C.muted }}>Equipos Totales</div>
          </Card>
          <Card style={{ padding: 16, textAlign: "center", background: `${C.purple}10`, border: `1px solid ${C.purple}25` }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>👥</div>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 2 }}>{sorted.reduce((sum, t) => sum + t.members.length, 0)}</div>
            <div style={{ fontSize: 12, color: C.muted }}>Participantes</div>
          </Card>
          <Card style={{ padding: 16, textAlign: "center", background: `${C.green}10`, border: `1px solid ${C.green}25` }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>✅</div>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 2 }}>{sorted.filter(t => t.phase === 5).length}</div>
            <div style={{ fontSize: 12, color: C.muted }}>Completados</div>
          </Card>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// ADMIN: EQUIPOS DETALLADOS
// ═══════════════════════════════════════════
function AdminTeamsScreen({ teams }) {
  const [expandedId, setExpandedId] = useState(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {teams.length === 0 ? (
        <Card style={{ padding: 40, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎯</div>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Sin equipos registrados</div>
          <p style={{ color: C.muted }}>Los equipos aparecerán aquí cuando se registren</p>
        </Card>
      ) : (
        teams.map(team => (
          <Card
            key={team.id}
            style={{
              padding: 20,
              cursor: "pointer",
              background: expandedId === team.id ? `${C.purple}10` : C.card,
              border: `1px solid ${expandedId === team.id ? C.purple : C.border}`,
              transition: "all 0.2s",
            }}
            onClick={() => setExpandedId(expandedId === team.id ? null : team.id)}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", gap: 16, flex: 1 }}>
                <div style={{ fontSize: 40 }}>{team.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <div style={{ fontSize: 18, fontWeight: 800 }}>{team.name}</div>
                    <Chip label={`Fase ${team.phase}/5`} color={team.phase === 5 ? C.green : team.phase >= 3 ? C.cyan : C.muted} size="sm" />
                  </div>
                  <div style={{ color: C.muted, fontSize: 13, marginBottom: 12 }}>
                    {team.members.length} integrante{team.members.length !== 1 ? "s" : ""} · {team.xp.toLocaleString()} XP
                  </div>

                  {expandedId === team.id && (
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                        <div>
                          <div style={{ fontSize: 11, color: C.muted, marginBottom: 4, fontWeight: 600 }}>Progreso</div>
                          <div style={{ height: 8, background: `rgba(255,255,255,0.08)`, borderRadius: 4, overflow: "hidden" }}>
                            <div style={{ width: `${(team.phase / 5) * 100}%`, height: "100%", background: `linear-gradient(90deg,${C.cyan},${C.purple})` }} />
                          </div>
                          <div style={{ fontSize: 10, color: C.muted, marginTop: 4 }}>Fase {team.phase}/5</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 11, color: C.muted, marginBottom: 4, fontWeight: 600 }}>Experiencia</div>
                          <div style={{ fontSize: 18, fontWeight: 800, color: C.yellow }}>{team.xp.toLocaleString()} XP</div>
                        </div>
                      </div>

                      <div style={{ background: `rgba(255,255,255,0.02)`, borderRadius: 8, padding: 12 }}>
                        <div style={{ fontSize: 11, color: C.muted, marginBottom: 8, fontWeight: 600 }}>Integrantes</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                          {team.members.map((member, idx) => (
                            <div key={idx} style={{ fontSize: 12, color: C.light, display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{ fontWeight: 700, color: C.purple, width: 20 }}>#{idx + 1}</span>
                              {member}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div style={{ fontSize: 18, color: C.muted, transition: "transform 0.2s" }}>
                {expandedId === team.id ? "▼" : "▶"}
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}

// Export all screens
Object.assign(window, {
  MapaScreen, DatasetsScreen,
  LoreScreen, LoginScreen, ChartEditorScreen,
  QuizScreen, CorrelacionesScreen, PitchBuilderScreen,
  AdminLeaderboardScreen, AdminTeamsScreen,
});
