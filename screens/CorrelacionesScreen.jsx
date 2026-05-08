// screens/CorrelacionesScreen.jsx — extracted phase 4 screen

function CorrelacionesScreen({ team, initialProgress, onProgress, onComplete, autoAdvance=true }) {
  const members = ((team?.members || []).concat(["", "", "", "", "", ""])).slice(0, 6);
  const mCount = members.filter(m => m && m.trim()).length || 6;
  const NUMERIC_COLS = COLUMNS.filter(c => c.type === "number");
  const memberName = (i) => members[i]?.trim() || `Integrante ${i + 1}`;

  const [step, setStep] = useState(initialProgress?.step ?? 0);
  const [picks, setPicks] = useState(initialProgress?.picks ?? {});
  const [pickerIdx, setPickerIdx] = useState(initialProgress?.pickerIdx ?? 0);
  const [xVar, setXVar] = useState(initialProgress?.xVar ?? null);
  const [yVar, setYVar] = useState(initialProgress?.yVar ?? null);
  const [votes, setVotes] = useState(initialProgress?.votes ?? {});
  const [voterIdx, setVoterIdx] = useState(initialProgress?.voterIdx ?? 0);
  const [analysisAnswers, setAnalysisAnswers] = useState(initialProgress?.analysisAnswers ?? {});
  const [analysisQIdx, setAnalysisQIdx] = useState(initialProgress?.analysisQIdx ?? 0);
  const [conclusionText, setConclusionText] = useState(initialProgress?.conclusionText ?? "");
  const [approvals, setApprovals] = useState(initialProgress?.approvals ?? {});
  const [earnedXP, setEarnedXP] = useState(initialProgress?.earnedXP ?? 0);
  const [showXPAmount, setShowXPAmount] = useState(null);
  const [hoverIdx, setHoverIdx] = useState(null);
  const [showIntroDetails, setShowIntroDetails] = useState(false);
  const [selectedVars, setSelectedVars] = useState(initialProgress?.selectedVars ?? []);
  const [readonlyView, setReadonlyView] = useState(false);
  const [submitted, setSubmitted] = useState(initialProgress?.submitted ?? false);
  const autoAdvancedRef = useRef(false);
  const predictedAwardedRef = useRef(false);

  const xCol = COLUMNS.find(c => c.key === xVar);
  const yCol = COLUMNS.find(c => c.key === yVar);

  const valid = xVar && yVar ? YT_DATA.filter(d => {
    const a = Number(d[xVar]); const b = Number(d[yVar]);
    return !isNaN(a) && !isNaN(b);
  }) : [];

  const previewValidCount = valid.length;

  const pearson = (a, b) => {
    if (!a || !b || a.length === 0 || a.length !== b.length) return 0;
    const n = a.length;
    const meanA = a.reduce((s,x) => s + x, 0) / n;
    const meanB = b.reduce((s,x) => s + x, 0) / n;
    let num = 0, denA = 0, denB = 0;
    for (let i=0;i<n;i++) {
      const da = a[i] - meanA; const db = b[i] - meanB;
      num += da * db; denA += da*da; denB += db*db;
    }
    const denom = Math.sqrt(denA * denB);
    if (denom === 0) return 0;
    return num / denom;
  };

  useEffect(() => {
    if (step !== 3 || !xVar || !yVar) return;
    const xs = valid.map(d => d[xVar]), ys = valid.map(d => d[yVar]);
    const r = pearson(xs, ys);
    const corrCategory = Math.abs(r) < 0.2 ? "nul" : (r > 0 ? "pos" : "neg");
    const voteCount3 = { pos:0, neg:0, nul:0 };
    Object.values(votes).forEach(v => { if (v in voteCount3) voteCount3[v]++; });
    const majority = Object.entries(voteCount3).sort((a,b) => b[1]-a[1])[0][0];
    const predictedCorrect = majority === corrCategory;
    if (predictedCorrect && !predictedAwardedRef.current && !readonlyView) { predictedAwardedRef.current = true; giveXP(40); }
  }, [step, xVar, yVar, votes, readonlyView]);

  useEffect(() => {
    onProgress?.({ step, picks, pickerIdx, xVar, yVar, votes, voterIdx, analysisAnswers, analysisQIdx, conclusionText, approvals, earnedXP, selectedVars, readonlyView, submitted });
  }, [step, picks, pickerIdx, xVar, yVar, votes, voterIdx, analysisAnswers, analysisQIdx, conclusionText, approvals, earnedXP, selectedVars, readonlyView, submitted]);

  useEffect(() => {
    if (xVar || yVar) return;
    const pickedKeys = Object.values(picks).filter(Boolean);
    if (pickedKeys.length >= 2) {
      setXVar(pickedKeys[0]);
      setYVar(pickedKeys[1]);
      return;
    }
    if (selectedVars.length >= 2) {
      setXVar(selectedVars[0]);
      setYVar(selectedVars[1]);
    }
  }, [picks, selectedVars, xVar, yVar]);

  useEffect(() => {
    const ready = step === 6 && submitted;
    if (!autoAdvance || !ready) return;
    if (autoAdvancedRef.current) return;
    autoAdvancedRef.current = true;
    const t = setTimeout(() => {
      onComplete && onComplete(earnedXP);
    }, 700);
    return () => clearTimeout(t);
  }, [step, submitted, earnedXP, autoAdvance, onComplete]);

  // Reset readonlyView when leaving the graph step
  useEffect(() => {
    if (readonlyView && step !== 3) setReadonlyView(false);
  }, [step, readonlyView]);

  const giveXP = (amount) => { if (readonlyView) return; setEarnedXP(p => p + amount); setShowXPAmount(amount); };

  const ANALYSIS_QS = [
    {
      q: () => `¿Qué tipo de correlación ves en el gráfico entre ${xCol?.label || "X"} y ${yCol?.label || "Y"}?`,
      opts: ["📈 Positiva: cuando X sube, Y también sube", "📉 Negativa: cuando X sube, Y baja", "🔀 Nula: no hay patrón claro"],
      explains: [
        "¡Los puntos forman una línea ascendente! Correlación positiva confirmada. 📈",
        "¡Los puntos forman una línea descendente! Correlación negativa encontrada. 📉",
        "Los puntos están dispersos sin patrón lineal. Correlación nula. 🔀",
      ],
      hasCorrect: false, xp: 50,
    },
    {
      q: () => "¿Ves algún punto muy alejado del grupo principal?",
      opts: ["Sí, hay un outlier claramente visible", "No, todos los puntos están bien agrupados", "Hay varios subgrupos separados"],
      explains: [
        "¡Exacto! Ese outlier es un canal con métricas extremas (ej: Cocomelon o T-Series). Vale investigarlo. 🔍",
        "Datos bien agrupados: los canales se comportan de manera similar en estas métricas. ",
        "Múltiples grupos suelen indicar que otra variable (categoría, país) también influye en la relación.",
      ],
      hasCorrect: false, xp: 50,
    },
    {
      q: () => "¿Correlación significa que una variable CAUSA la otra?",
      opts: ["Sí, correlación fuerte = una causa la otra", "No — correlación ≠ causalidad", "Solo si hay más de 100 datos"],
      explains: [
        "¡Ojo! Podría haber una tercera variable oculta que cause ambas. Esa es la trampa clásica del análisis de datos. 🧠",
        "¡Correcto! Esta es la regla más importante: correlación no implica causalidad. Siempre hay que investigar más. 🎯",
        "El tamaño de muestra importa para la significancia estadística, pero no determina causalidad por sí solo.",
      ],
      hasCorrect: true, ans: 1, xp: 100,
    },
  ];

  const StepPills = () => (
    <div style={{ display:"flex", alignItems:"center", gap:4, flexWrap:"wrap" }}>
      {["Inicio","Variables","Predicción","Gráfico","Análisis","Conclusión"].map((label, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <React.Fragment key={i}>
            <div style={{ padding:"5px 12px", borderRadius:20, fontSize:11, fontWeight:700,
              background:done?`${C.green}20`:active?`${C.yellow}20`:"rgba(255,255,255,0.05)",
              border:`1px solid ${done?C.green:active?C.yellow:C.border}`,
              color:done?C.green:active?C.yellow:C.dim, whiteSpace:"nowrap" }}>
              {done?"✓ ":""}{label}
            </div>
            {i < 5 && <div style={{ width:12, height:1, background:done?`${C.green}40`:C.border }}/>} 
          </React.Fragment>
        );
      })}
    </div>
  );

  const TurnBadge = ({ idx, color=C.yellow }) => (
    <div style={{ display:"flex", alignItems:"center", gap:12, background:`${color}12`, border:`1px solid ${color}35`,
      borderRadius:14, padding:"12px 18px", alignSelf:"flex-start" }}>
      <div style={{ width:40, height:40, borderRadius:10, background:`${color}20`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>👤</div>
      <div>
        <div style={{ fontSize:11, color, fontWeight:800, letterSpacing:0.5, textTransform:"uppercase" }}>Turno de</div>
        <div style={{ fontWeight:900, fontSize:17, color:C.text }}>{memberName(idx)}</div>
      </div>
    </div>
  );

  if (step === 0) return (
    <div style={{ padding:28, flex:1, overflowY:"auto", display:"flex", alignItems:"center", justifyContent:"center" }}>
      {showXPAmount && <XPPop amount={showXPAmount} onDone={() => setShowXPAmount(null)} />}
      <div className="fade-in" style={{ maxWidth:580, width:"100%" }}>
        <Card style={{ padding:32 }} glow={C.yellow}>
          <div style={{ display:"flex", gap:16, alignItems:"flex-start", marginBottom:24 }}>
            <div style={{ fontSize:52, lineHeight:1, flexShrink:0 }}>🤖</div>
            <div style={{ flex:1 }}>
              <Chip label="Fase 4 · Correlaciones" color={C.yellow} />
              <h1 style={{ fontSize:24, fontWeight:900, margin:"8px 0 12px" }}>Tawsito tiene una pregunta urgente</h1>
              <div style={{ background:`${C.yellow}12`, border:`1px solid ${C.yellow}30`, borderRadius:12, padding:"14px 16px" }}>
                <p style={{ color:C.text, fontSize:14, lineHeight:1.75, margin:0 }}>
                  "¡Equipo, necesito su ayuda! 🚨 Mi algoritmo no entiende qué métricas de YouTube realmente se relacionan entre sí.
                  ¿Los canales con más subs tienen más views? ¿Más videos = más plata? 💸
                  Necesito que analicen las <strong style={{ color:C.yellow }}>correlaciones</strong> en los datos para mejorar mis recomendaciones."
                </p>
              </div>
            </div>
          </div>

          <div style={{ fontSize:13, fontWeight:800, color:C.muted, marginBottom:12, textTransform:"uppercase", letterSpacing:0.5 }}>¿Qué es una correlación?</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:28 }}>
            {[
              { icon:"📈", c:C.green,  label:"Positiva",  desc:"Sube una → sube la otra" },
              { icon:"📉", c:C.red,    label:"Negativa",  desc:"Sube una → baja la otra" },
              { icon:"🔀", c:C.muted,  label:"Nula",      desc:"Sin patrón entre ellas" },
            ].map((t,i) => (
              <div key={i} style={{ background:`${t.c}10`, border:`1px solid ${t.c}30`, borderRadius:12, padding:"16px 12px", textAlign:"center" }}>
                <div style={{ fontSize:32, marginBottom:8 }}>{t.icon}</div>
                <div style={{ fontWeight:800, fontSize:14, color:t.c }}>{t.label}</div>
                <div style={{ fontSize:11, color:C.muted, marginTop:4, lineHeight:1.4 }}>{t.desc}</div>
              </div>
            ))}
          </div>

          <Card style={{ padding:12, marginBottom:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:12 }}>
              <div>
                <div style={{ fontSize:14, fontWeight:800 }}>¿Cómo interpretar la correlación?</div>
                <div style={{ color:C.muted, fontSize:13, marginTop:6 }}>
                  Breve: observa la <strong>dirección</strong> (pos/neg), la <strong>fuerza</strong> (qué tan agrupados están los puntos) y si hay <strong>outliers</strong>. Correlación no implica causalidad.
                </div>
              </div>
              <div>
                <Btn onClick={() => setShowIntroDetails(s => !s)} variant="secondary" size="sm">
                  {showIntroDetails ? "Ocultar" : "Más detalles"}
                </Btn>
              </div>
            </div>

            {showIntroDetails && (
              <div style={{ color:C.muted, fontSize:13, marginTop:12, lineHeight:1.5 }}>
                <ul style={{ margin:"8px 0 0 18px", padding:0 }}>
                  <li><strong>Definición:</strong> La correlación mide la relación lineal entre dos variables; su valor (r) va de -1 a 1.</li>
                  <li><strong>Dirección:</strong> r&gt;0 → positiva (ambas suben juntas); r&lt;0 → negativa (una sube, la otra baja); r≈0 → sin patrón.</li>
                  <li><strong>Fuerza (orientativa):</strong> |r| ≥ 0.7 fuerte, 0.3–0.7 moderada, 0.1–0.3 débil.</li>
                  <li><strong>Cuidado:</strong> correlación ≠ causalidad. Busca outliers, subgrupos o variables ocultas que expliquen la relación.</li>
                  <li><strong>Qué mirar en el scatter:</strong> dirección, dispersión (fuerza), outliers, patrones por categoría y si la escala/log-transformación cambia la forma.</li>
                </ul>
              </div>
            )}
          </Card>

          <Btn onClick={() => setStep(1)} variant="success" size="lg" style={{ width:"100%", justifyContent:"center" }}>
            ¡Aceptar misión! 🚀 →
          </Btn>
        </Card>
      </div>
    </div>
  );

  if (step === 1) {
    const pickedKeys = Object.values(picks);
    const uniquePicked = [...new Set(pickedKeys)].filter(Boolean);
    const allPicked = uniquePicked.length >= 2 && pickedKeys.length >= mCount;

    if (uniquePicked.length === 2) return (
      <div style={{ padding:28, flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:20 }}>
        {showXPAmount && <XPPop amount={showXPAmount} onDone={() => setShowXPAmount(null)} />}
        <StepPills />

        <div>
          <Chip label="Paso 2/6 · Acuerdo del equipo" color={C.cyan} />
          <h2 style={{ fontSize:20, fontWeight:800, margin:"8px 0 4px" }}>¿En qué ejes van las variables?</h2>
          <p style={{ color:C.muted, fontSize:14, margin:0 }}>Ahora acuerden cuál variable va en X y cuál en Y (solo se escogieron dos variables).</p>
        </div>

        <Card style={{ padding:12, marginTop:8, marginBottom:6 }}>
          <div style={{ fontSize:13, fontWeight:800 }}>Recordatorio rápido antes de elegir</div>
          <div style={{ color:C.muted, fontSize:13, marginTop:6 }}>
            Piensa cuál variable podría influir en la otra (eje X = independiente). ¿Tienes hipótesis sobre la dirección de la relación? Esto te ayudará a interpretar el gráfico.
          </div>
        </Card>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(130px, 1fr))", gap:10 }}>
          {members.slice(0, mCount).map((m, i) => {
            const col = COLUMNS.find(c => c.key === picks[i]);
            return (
              <div key={i} style={{ padding:"12px 14px", borderRadius:12, background:`${C.green}10`, border:`1px solid ${C.green}30`, textAlign:"center" }}>
                <div style={{ fontSize:22, marginBottom:4 }}>{col?.emoji}</div>
                <div style={{ fontWeight:800, fontSize:12, color:C.green }}>{col?.label}</div>
                <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{memberName(i)}</div>
              </div>
            );
          })}
        </div>

        <Card style={{ padding:24 }} glow={C.cyan}>
          <div style={{ display:"flex", gap:16, flexDirection:"column" }}>
            <div>
              <label style={{ fontSize:12, fontWeight:800, color:C.purple, display:"block", marginBottom:8, textTransform:"uppercase", letterSpacing:0.5 }}>
                Eje X — variable independiente (causa)
              </label>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(140px, 1fr))", gap:8 }}>
                {uniquePicked.map(k => {
                  const col = COLUMNS.find(c => c.key === k);
                  return (
                    <button key={k} onClick={() => setXVar(xVar === k ? null : k)}
                      style={{ padding:"14px 12px", borderRadius:12, border:`2px solid ${xVar===k?C.purple:C.border}`,
                        background:xVar===k?`${C.purple}20`:"rgba(255,255,255,0.03)", cursor:"pointer", textAlign:"center", transition:"all 0.2s" }}>
                      <div style={{ fontSize:20, marginBottom:4 }}>{col?.emoji}</div>
                      <div style={{ fontSize:12, fontWeight:700, color:xVar===k?C.purple:C.text }}>{col?.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label style={{ fontSize:12, fontWeight:800, color:C.cyan, display:"block", marginBottom:8, textTransform:"uppercase", letterSpacing:0.5 }}>
                Eje Y — variable dependiente (efecto)
              </label>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(140px, 1fr))", gap:8 }}>
                {uniquePicked.filter(k => k !== xVar).map(k => {
                  const col = COLUMNS.find(c => c.key === k);
                  return (
                    <button key={k} onClick={() => setYVar(yVar === k ? null : k)}
                      style={{ padding:"14px 12px", borderRadius:12, border:`2px solid ${yVar===k?C.cyan:C.border}`,
                        background:yVar===k?`${C.cyan}20`:"rgba(255,255,255,0.03)", cursor:"pointer", textAlign:"center", transition:"all 0.2s" }}>
                      <div style={{ fontSize:20, marginBottom:4 }}>{col?.emoji}</div>
                      <div style={{ fontSize:12, fontWeight:700, color:yVar===k?C.cyan:C.text }}>{col?.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <Btn onClick={() => setStep(2)} disabled={!xVar || !yVar} variant="primary" size="lg"
            style={{ width:"100%", justifyContent:"center", marginTop:20 }}>
            Confirmar variables → Ir a predecir 🗳️
          </Btn>
        </Card>
      </div>
    );

    return (
      <div style={{ padding:28, flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:20 }}>
        {showXPAmount && <XPPop amount={showXPAmount} onDone={() => setShowXPAmount(null)} />}
        <StepPills />

        <div>
          <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:8 }}>
            <div style={{ fontSize:12, color:C.muted }}>Variables:</div>
            <div style={{ fontWeight:800, color:C.purple }}>{String(xVar)}</div>
            <div style={{ fontSize:12, color:C.muted }}>vs</div>
            <div style={{ fontWeight:800, color:C.cyan }}>{String(yVar)}</div>
            <div style={{ marginLeft:'auto', fontSize:12, color:C.muted }}>Puntos válidos: <strong style={{ color:C.text }}>{previewValidCount}</strong></div>
          </div>
          <Chip label="Paso 1/6 · Elegir variables" color={C.yellow} />
          <h2 style={{ fontSize:20, fontWeight:800, margin:"8px 0 4px" }}>Cada integrante elige su variable favorita</h2>
          <p style={{ color:C.muted, fontSize:14, margin:0 }}>La variable que les parece más interesante de analizar en los datos de YouTube.</p>
        </div>

        <div>
          <Chip label="Paso 1/6 · Elegir variables" color={C.yellow} />
          <h2 style={{ fontSize:20, fontWeight:800, margin:"8px 0 4px" }}>Elijan 2 variables</h2>
          <p style={{ color:C.muted, fontSize:14, margin:0 }}>Como equipo, seleccionen exactamente dos variables para analizar (luego elegirán cuál va en X y cuál en Y).</p>
        </div>

        <Card style={{ padding:22 }}>
          <div style={{ fontSize:13, fontWeight:700, color:C.yellow, marginBottom:16 }}>
            Selección del equipo ({selectedVars.length}/2)
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(150px, 1fr))", gap:12 }}>
            {NUMERIC_COLS.map(col => {
              const taken = selectedVars.includes(col.key);
              const disabled = !taken && selectedVars.length >= 2;
              return (
                <button key={col.key}
                  onClick={() => {
                    setSelectedVars(s => {
                      if (s.includes(col.key)) return s.filter(x => x !== col.key);
                      if (s.length >= 2) return s; // ignore
                      return [...s, col.key];
                    });
                  }}
                  disabled={disabled}
                  style={{ padding:"18px 14px", border:`2px solid ${taken?C.purple:C.border}`,
                    borderRadius:14, background:taken?`${C.purple}12`:"rgba(255,255,255,0.02)",
                    cursor:disabled?"not-allowed":"pointer", textAlign:"center", opacity:disabled?0.5:1, transition:"all 0.2s" }}>
                  <div style={{ fontSize:30, marginBottom:8 }}>{col.emoji}</div>
                  <div style={{ fontSize:13, fontWeight:700, color:taken?C.purple:C.text, lineHeight:1.3 }}>{col.label}</div>
                </button>
              );
            })}
          </div>
          <div style={{ marginTop:16, display:"flex", gap:8 }}>
            <Btn onClick={() => {
              if (selectedVars.length === 2) {
                // set picks to the two chosen keys so downstream UI can reuse pickedKeys
                setPicks(p => ({ ...p, 0: selectedVars[0], 1: selectedVars[1] }));
                setXVar(selectedVars[0]);
                setYVar(selectedVars[1]);
                setStep(2);
              }
            }} variant="primary" disabled={selectedVars.length !== 2}>
              Confirmar variables → Ir a predecir 🗳️
            </Btn>
          </div>
        </Card>
      </div>
    );
  }

  if (step === 2) {
    const voteOptions = [
      { key:"pos", icon:"📈", label:"Correlación positiva", desc:`Cuando ${xCol?.label} sube, ${yCol?.label} también sube`, color:C.green },
      { key:"neg", icon:"📉", label:"Correlación negativa", desc:`Cuando ${xCol?.label} sube, ${yCol?.label} baja`, color:C.red },
      { key:"nul", icon:"🔀", label:"Sin correlación", desc:"No esperamos ningún patrón claro", color:C.muted },
    ];
    const voteCount = { pos:0, neg:0, nul:0 };
    Object.values(votes).forEach(v => { if (v in voteCount) voteCount[v]++; });
    const allVoted = Object.keys(votes).length >= mCount;

    return (
      <div style={{ padding:28, flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:20 }}>
        {showXPAmount && <XPPop amount={showXPAmount} onDone={() => setShowXPAmount(null)} />}
        <StepPills />

        <div>
          <Chip label="Paso 3/6 · Predicción grupal" color={C.yellow} />
          <h2 style={{ fontSize:20, fontWeight:800, margin:"8px 0 4px" }}>¿Qué correlación esperan encontrar?</h2>
          <p style={{ color:C.muted, fontSize:14, margin:0 }}>Cada integrante vota antes de ver el gráfico. Sin ver los datos, ¿qué creen?</p>
        </div>

        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          <div style={{ padding:"8px 16px", background:`${C.purple}15`, border:`1px solid ${C.purple}30`, borderRadius:8, fontSize:13 }}>
            <span style={{ color:C.purple, fontWeight:700 }}>X:</span> {xCol?.emoji} {xCol?.label}
          </div>
          <div style={{ padding:"8px 16px", background:`${C.cyan}15`, border:`1px solid ${C.cyan}30`, borderRadius:8, fontSize:13 }}>
            <span style={{ color:C.cyan, fontWeight:700 }}>Y:</span> {yCol?.emoji} {yCol?.label}
          </div>
        </div>

        {!allVoted && (
          <>
            <TurnBadge idx={voterIdx} />
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {voteOptions.map(opt => (
                <button key={opt.key}
                    onClick={() => {
                      if (readonlyView) return;
                      if (votes[voterIdx] !== undefined) return;
                      setVotes(v => ({ ...v, [voterIdx]: opt.key }));
                      setVoterIdx(i => Math.min(i + 1, mCount - 1));
                      giveXP(20);
                    }}
                  style={{ padding:"18px 22px", border:`2px solid ${opt.color}40`, borderRadius:14, background:`${opt.color}08`,
                    cursor:"pointer", textAlign:"left", display:"flex", gap:16, alignItems:"center", transition:"all 0.2s" }}>
                  <span style={{ fontSize:36, flexShrink:0 }}>{opt.icon}</span>
                  <div>
                    <div style={{ fontWeight:800, fontSize:16, color:opt.color }}>{opt.label}</div>
                    <div style={{ fontSize:13, color:C.muted, marginTop:4 }}>{opt.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        <Card style={{ padding:18 }}>
          <div style={{ fontSize:13, fontWeight:700, marginBottom:12 }}>🗳️ Votos del equipo ({Object.keys(votes).length}/{mCount})</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(100px, 1fr))", gap:8 }}>
            {members.slice(0, mCount).map((m, i) => {
              const vote = votes[i];
              const opt = voteOptions.find(o => o.key === vote);
              return (
                <div key={i} style={{ padding:"10px 8px", borderRadius:10, textAlign:"center",
                  background:vote?`${opt?.color}15`:"rgba(255,255,255,0.03)",
                  border:`1px solid ${vote?opt?.color:C.border}` }}>
                  <div style={{ fontSize:22, marginBottom:4 }}>{vote ? opt?.icon : "⏳"}</div>
                  <div style={{ fontSize:11, fontWeight:700, color:vote?opt?.color:C.dim }}>{memberName(i)}</div>
                </div>
              );
            })}
          </div>
          {allVoted && (
            <div style={{ marginTop:16, paddingTop:16, borderTop:`1px solid ${C.border}` }}>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:16 }}>
                {voteOptions.map(o => voteCount[o.key] > 0 && (
                  <div key={o.key} style={{ background:`${o.color}15`, border:`1px solid ${o.color}30`, borderRadius:8,
                    padding:"6px 14px", display:"flex", gap:6, alignItems:"center" }}>
                    <span>{o.icon}</span>
                    <strong style={{ color:o.color }}>{voteCount[o.key]}</strong>
                    <span style={{ fontSize:11, color:C.muted }}>voto{voteCount[o.key]!==1?"s":""}</span>
                  </div>
                ))}
              </div>
              <Btn onClick={() => { giveXP(30); setStep(3); }} variant="success" size="lg" style={{ width:"100%", justifyContent:"center" }}>
                ¡Ver el scatter plot! 📊 →
              </Btn>
            </div>
          )}
        </Card>
      </div>
    );
  }

  if (step === 3) {
    if (!xVar || !yVar || !valid.length) {
      const sample = xVar && yVar ? YT_DATA.slice(0,5).map(d=>({
        id: d.id,
        [xVar]: d[xVar],
        [yVar]: d[yVar]
      })) : [];
      return (
        <div style={{ padding:28, flex:1, overflowY:"auto", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Card style={{ maxWidth:720, width:"100%", padding:28 }} glow={C.yellow}>
            <div style={{ fontSize:18, fontWeight:800, marginBottom:8 }}>No hay datos suficientes para mostrar el gráfico</div>
            <div style={{ color:C.muted, fontSize:14, lineHeight:1.6, marginBottom:12 }}>
              Verifiquen que hayan confirmado ambas variables en el paso anterior. Si una selección quedó vacía o no tiene valores numéricos, el scatter no puede dibujarse.
            </div>
            <div style={{ fontSize:13, marginBottom:8 }}><strong>Variables actuales:</strong> X = <strong style={{ color:C.purple }}>{String(xVar)}</strong> · Y = <strong style={{ color:C.cyan }}>{String(yVar)}</strong></div>
            <div style={{ fontSize:13, color:C.muted, marginBottom:12 }}>Filas de ejemplo (primeras 5):</div>
            <div style={{ fontSize:13, marginBottom:12 }}>
              {sample.length ? (
                <div style={{ overflowX:'auto' }}>
                  <table style={{ width:'100%', borderCollapse:'collapse' }}>
                    <thead><tr><th style={{ textAlign:'left', padding:6 }}>id</th><th style={{ textAlign:'left', padding:6 }}>{xVar}</th><th style={{ textAlign:'left', padding:6 }}>{yVar}</th></tr></thead>
                    <tbody>
                      {sample.map(s => (
                        <tr key={s.id}><td style={{ padding:6 }}>{s.id}</td><td style={{ padding:6 }}>{String(s[xVar])}</td><td style={{ padding:6 }}>{String(s[yVar])}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : <div style={{ color:C.muted }}>No hay muestra disponible.</div>}
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <Btn variant="primary" onClick={() => setStep(2)}>Volver a elegir variables</Btn>
              <Btn variant="ghost" onClick={() => { setXVar(null); setYVar(null); setStep(1); }}>Reiniciar selección</Btn>
            </div>
          </Card>
        </div>
      );
    }
    const xs = valid.map(d => d[xVar]), ys = valid.map(d => d[yVar]);
    const r = pearson(xs, ys);
    const corrCategory = Math.abs(r) < 0.2 ? "nul" : (r > 0 ? "pos" : "neg");
    const voteCount3 = { pos:0, neg:0, nul:0 };
    Object.values(votes).forEach(v => { if (v in voteCount3) voteCount3[v]++; });
    const majority = Object.entries(voteCount3).sort((a,b) => b[1]-a[1])[0][0];
    const predictedCorrect = majority === corrCategory;
    const xMin = Math.min(...xs), xMax = Math.max(...xs);
    const yMin = Math.min(...ys), yMax = Math.max(...ys);
    const W = 520, H = 290, pad = 56;
    const px = x => xMax === xMin ? W/2 : pad + (x - xMin)/(xMax - xMin) * (W - 2*pad);
    const py = y => yMax === yMin ? H/2 : H - pad - (y - yMin)/(yMax - yMin) * (H - 2*pad);
    const catColors = [C.purple, C.cyan, C.green, C.yellow, C.red, C.pink, "#F97316", "#3B82F6"];
    const cats = [...new Set(valid.map(d => d.category))];
    const hovered = hoverIdx !== null ? valid[hoverIdx] : null;

    return (
      <div style={{ padding:28, flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:20 }}>
        {showXPAmount && <XPPop amount={showXPAmount} onDone={() => setShowXPAmount(null)} />}
        <StepPills />

        <div>
          <Chip label="Paso 4/6 · Scatter plot interactivo" color={C.yellow} />
          <h2 style={{ fontSize:20, fontWeight:800, margin:"8px 0 4px" }}>¡Aquí están los datos reales!</h2>
          <p style={{ color:C.muted, fontSize:14, margin:0 }}>Pasa el mouse por los puntos para identificar cada canal.</p>
        </div>

        <Card style={{ padding:10, marginTop:8, marginBottom:6 }}>
          <div style={{ fontSize:13, fontWeight:700 }}>Qué evaluar en este scatter</div>
          <div style={{ color:C.muted, fontSize:13, marginTop:6 }}>
            Observa: dirección (pos/neg), qué tan pegados están los puntos (fuerza) y si hay outliers o subgrupos. Si ves muchos outliers, considera segmentar por categoría.
          </div>
        </Card>

        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          <div style={{ padding:"8px 16px", background:`${C.purple}15`, border:`1px solid ${C.purple}30`, borderRadius:8, fontSize:13 }}>
            <span style={{ color:C.purple, fontWeight:700 }}>Eje X:</span> {xCol?.emoji} {xCol?.label}
          </div>
          <div style={{ padding:"8px 16px", background:`${C.cyan}15`, border:`1px solid ${C.cyan}30`, borderRadius:8, fontSize:13 }}>
            <span style={{ color:C.cyan, fontWeight:700 }}>Eje Y:</span> {yCol?.emoji} {yCol?.label}
          </div>
        </div>

        <Card style={{ padding:20 }} glow={C.yellow}>
          <div style={{ marginBottom:12 }}>
            <strong style={{ fontSize:13 }}>{predictedCorrect ? "✓ La predicción del equipo fue acertada" : "✗ La predicción del equipo no coincidió"}</strong>
            <div style={{ color:C.muted, fontSize:13, marginTop:6 }}>Correlación real: <strong style={{ color:C.purple }}>{r.toFixed(2)}</strong> — interpretación: <strong style={{ color:C.green }}>{corrCategory === 'pos' ? 'Positiva' : corrCategory === 'neg' ? 'Negativa' : 'Nula'}</strong></div>
          </div>
          {/* Feedback XP awarded via effect (avoid side-effects during render) */}
          {hovered ? (
            <div style={{ marginBottom:14, padding:"10px 14px", background:`${C.yellow}15`, border:`1px solid ${C.yellow}40`,
              borderRadius:10, display:"flex", gap:12, alignItems:"center" }}>
              <span style={{ fontSize:22, flexShrink:0 }}>📺</span>
              <div>
                <div style={{ fontWeight:800, fontSize:15 }}>{hovered.channel}</div>
                <div style={{ fontSize:12, color:C.muted }}>
                  {xCol?.label}: <span style={{ color:C.purple, fontWeight:700 }}>{hovered[xVar]}</span>
                  {" · "}
                  {yCol?.label}: <span style={{ color:C.cyan, fontWeight:700 }}>{hovered[yVar]}</span>
                  {" · "}<Chip label={hovered.category} color={C.muted} size="sm"/>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ marginBottom:14, padding:"8px 14px", background:"rgba(255,255,255,0.02)", border:`1px solid ${C.border}`,
              borderRadius:10, fontSize:12, color:C.dim, textAlign:"center" }}>
              🖱️ Pasa el cursor por un punto para ver el canal
            </div>
          )}

          <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display:"block", cursor:"crosshair" }}>
            {[0,0.25,0.5,0.75,1].map(t => {
              const gy = pad + (H - 2*pad) * (1 - t);
              const gx = pad + t * (W - 2*pad);
              return <g key={t}>
                <line x1={pad} x2={W-pad} y1={gy} y2={gy} stroke="rgba(255,255,255,0.05)" strokeWidth={1}/>
                <line x1={gx} x2={gx} y1={pad} y2={H-pad} stroke="rgba(255,255,255,0.05)" strokeWidth={1}/>
                <text x={pad-8} y={gy+4} fill={C.muted} fontSize={9} textAnchor="end" fontFamily="Space Mono">{(yMin + t*(yMax-yMin)).toFixed(1)}</text>
                <text x={gx} y={H-pad+16} fill={C.muted} fontSize={9} textAnchor="middle" fontFamily="Space Mono">{(xMin + t*(xMax-xMin)).toFixed(1)}</text>
              </g>;
            })}
            <line x1={pad} x2={pad} y1={pad} y2={H-pad} stroke={C.border} strokeWidth={1}/>
            <line x1={pad} x2={W-pad} y1={H-pad} y2={H-pad} stroke={C.border} strokeWidth={1}/>
            <text x={W/2} y={H-4} fill={C.muted} fontSize={10} textAnchor="middle" fontFamily="Space Grotesk">{xCol?.label}</text>
            <text x={14} y={H/2} fill={C.muted} fontSize={10} textAnchor="middle" fontFamily="Space Grotesk" transform={`rotate(-90,14,${H/2})`}>{yCol?.label}</text>
            {valid.map((d, i) => {
              const ci = cats.indexOf(d.category);
              const col = catColors[ci % catColors.length];
              const isHov = hoverIdx === i;
              return (
                <g key={i} style={{ cursor:"pointer" }} onMouseEnter={() => setHoverIdx(i)} onMouseLeave={() => setHoverIdx(null)}>
                  {isHov && <circle cx={px(d[xVar])} cy={py(d[yVar])} r={18} fill={col} opacity={0.15}/>} 
                  <circle cx={px(d[xVar])} cy={py(d[yVar])} r={isHov?10:7} fill={col} opacity={0.9} style={{ transition:"r 0.12s" }}/>
                  {isHov && <text x={px(d[xVar])+14} y={py(d[yVar])-12} fill={C.text} fontSize={11} fontFamily="Space Grotesk" fontWeight={700}>{d.channel}</text>}
                </g>
              );
            })}
          </svg>

          <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop:14 }}>
            {cats.map((cat, i) => (
              <div key={cat} style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:C.muted }}>
                <div style={{ width:10, height:10, borderRadius:"50%", background:catColors[i % catColors.length] }}/>
                {cat}
              </div>
            ))}
          </div>
        </Card>

        <div style={{ padding:"12px 16px", background:`${C.yellow}10`, border:`1px solid ${C.yellow}25`, borderRadius:12, fontSize:13, display:"flex", gap:10 }}>
          <span style={{ flexShrink:0 }}>🤖</span>
          <span style={{ color:C.muted }}><strong style={{ color:C.yellow }}>Tawsito:</strong> "¿La predicción del equipo fue correcta? ¡No importa si fallaron — ese error también es un dato valioso para mí! 🎯"</span>
        </div>

        <Btn onClick={() => { giveXP(50); setStep(4); }} variant="success" size="lg" style={{ width:"100%", justifyContent:"center" }}>
          ¡Analizar juntos! → Preguntas guiadas 📝
        </Btn>
      </div>
    );
  }

  if (step === 4) {
    // Build a dynamic set of analysis questions so we can validate the first question against the real data
    const dynamicQs = ANALYSIS_QS.map(s => ({ ...s }));
    if (xVar && yVar) {
      const xs = valid.map(d => d[xVar]), ys = valid.map(d => d[yVar]);
      const r = pearson(xs, ys);
      const ansIndex = Math.abs(r) < 0.2 ? 2 : (r > 0 ? 0 : 1);
      dynamicQs[0].hasCorrect = true;
      dynamicQs[0].ans = ansIndex;
    }
    const q = dynamicQs[analysisQIdx];
    const memberForQ = analysisQIdx % mCount;
    const answered = analysisAnswers[analysisQIdx] !== undefined;

    return (
      <div style={{ padding:28, flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:20 }}>
        {showXPAmount && <XPPop amount={showXPAmount} onDone={() => setShowXPAmount(null)} />}
        <StepPills />

        <div>
          <Chip label="Paso 5/6 · Análisis guiado" color={C.yellow} />
          <h2 style={{ fontSize:20, fontWeight:800, margin:"8px 0 4px" }}>Tawsito hace 3 preguntas</h2>
          <p style={{ color:C.muted, fontSize:14, margin:0 }}>Respóndanlas juntos como equipo — cada integrante tiene su turno.</p>
        </div>

        <div style={{ display:"flex", gap:8 }}>
          {[0,1,2].map(i => {
            const done = i < analysisQIdx;
            const active = i === analysisQIdx;
            return (
              <div key={i} style={{ flex:1, padding:"10px", borderRadius:10, textAlign:"center", fontSize:12, fontWeight:700,
                background:done?`${C.green}15`:active?`${C.yellow}15`:"rgba(255,255,255,0.04)",
                border:`1px solid ${done?C.green:active?C.yellow:C.border}`,
                color:done?C.green:active?C.yellow:C.dim }}>
                {done?"✓":active?"▶":"○"} Pregunta {i+1}
              </div>
            );
          })}
        </div>

        <TurnBadge idx={memberForQ} />

        <Card className="fade-in" style={{ padding:24 }} glow={C.yellow}>
          <div style={{ display:"flex", gap:12, marginBottom:20 }}>
            <div style={{ width:42, height:42, borderRadius:12, background:`${C.yellow}20`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>🤖</div>
            <div>
              <div style={{ fontSize:11, color:C.yellow, fontWeight:800, marginBottom:6, textTransform:"uppercase", letterSpacing:0.5 }}>Tawsito pregunta</div>
              <div style={{ fontSize:17, fontWeight:800, lineHeight:1.45 }}>{q.q()}</div>
            </div>
          </div>

          {!answered ? (
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {q.opts.map((opt, i) => (
                <button key={i}
                            onClick={() => {
                              if (readonlyView) return;
                              setAnalysisAnswers(p => ({ ...p, [analysisQIdx]: i }));
                              giveXP(q.hasCorrect && i === q.ans ? q.xp : 20);
                            }}
                  style={{ padding:"14px 18px", border:`2px solid rgba(255,255,255,0.1)`, borderRadius:12,
                    background:"rgba(255,255,255,0.04)", cursor:"pointer", textAlign:"left", fontSize:14,
                    fontWeight:600, color:C.text, transition:"all 0.2s", display:"flex", alignItems:"center", gap:12 }}>
                  <span style={{ width:30, height:30, borderRadius:8, background:`${C.yellow}20`, display:"inline-flex",
                    alignItems:"center", justifyContent:"center", fontWeight:800, color:C.yellow, flexShrink:0, fontSize:13 }}>
                    {String.fromCharCode(65+i)}
                  </span>
                  {opt}
                </button>
              ))}
            </div>
          ) : (
            <div>
              <div style={{ padding:14, borderRadius:12, marginBottom:16,
                background:`${q.hasCorrect&&analysisAnswers[analysisQIdx]===q.ans?C.green:q.hasCorrect?C.yellow:C.cyan}15`,
                border:`1px solid ${q.hasCorrect&&analysisAnswers[analysisQIdx]===q.ans?C.green:q.hasCorrect?C.yellow:C.cyan}40` }}>
                <div style={{ fontWeight:800, marginBottom:6, fontSize:14,
                  color:q.hasCorrect&&analysisAnswers[analysisQIdx]===q.ans?C.green:q.hasCorrect?C.yellow:C.cyan }}>
                  {q.hasCorrect ? (analysisAnswers[analysisQIdx]===q.ans ? "✓ ¡Correcto!" : "🧠 Casi...") : "✓ Respuesta registrada"}
                </div>
                <div style={{ fontSize:13, color:C.muted, lineHeight:1.65 }}>{q.explains[analysisAnswers[analysisQIdx]]}</div>
                {q.hasCorrect && analysisAnswers[analysisQIdx] !== q.ans && (
                  <div style={{ marginTop:8, fontSize:12, color:C.muted }}>La respuesta más precisa: <strong style={{ color:C.green }}>{q.opts[q.ans]}</strong></div>
                )}
              </div>
              <div style={{ display:"flex", justifyContent:"flex-end" }}>
                {analysisQIdx < dynamicQs.length - 1
                  ? <Btn onClick={() => setAnalysisQIdx(i => i+1)} variant="primary">Siguiente pregunta →</Btn>
                  : <Btn onClick={() => setStep(5)} variant="success" size="lg">¡Pasar a la conclusión! ✍️ →</Btn>
                }
              </div>
            </div>
          )}
        </Card>
      </div>
    );
  }

  if (step === 5) {
    const approvedCount = Object.keys(approvals).length;
    const allApproved = approvedCount >= mCount;
    const writerIdx = (mCount - 1) % mCount;

    return (
      <div style={{ padding:28, flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:20 }}>
        {showXPAmount && <XPPop amount={showXPAmount} onDone={() => setShowXPAmount(null)} />}
        <StepPills />

        <div>
          <Chip label="Paso 6/6 · Conclusión del equipo" color={C.yellow} />
          <h2 style={{ fontSize:20, fontWeight:800, margin:"8px 0 4px" }}>Escriban la conclusión final</h2>
          <p style={{ color:C.muted, fontSize:14, margin:0 }}>Una sola oración que resuma lo que aprendió Tawsito sobre la correlación analizada.</p>
        </div>

        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <div style={{ padding:"12px 16px", background:`${C.yellow}10`, border:`1px solid ${C.yellow}25`, borderRadius:12, display:"flex", gap:10 }}>
            <span style={{ fontSize:20, flexShrink:0 }}>🤖</span>
            <p style={{ fontSize:13, color:C.muted, lineHeight:1.6, margin:0 }}>
              <strong style={{ color:C.yellow }}>Tawsito:</strong> "Una sola oración clara sobre <strong style={{ color:C.text }}>{xCol?.label}</strong> y <strong style={{ color:C.text }}>{yCol?.label}</strong>. ¡Pueden revisar el gráfico antes de enviar. 📝"
            </p>
          </div>
          <div style={{ marginLeft:"auto", display:"flex", gap:8 }}>
            <Btn onClick={() => { setReadonlyView(true); setStep(3); }} variant="secondary">Ver gráfico</Btn>
          </div>
        </div>

        <Card style={{ padding:14, marginBottom:12 }}>
          <div style={{ fontSize:13, fontWeight:800 }}>¿Qué debe contener la conclusión?</div>
          <ul style={{ color:C.muted, fontSize:13, marginTop:8, marginLeft:18 }}>
            <li><strong>Dirección y fuerza:</strong> p. ej. "correlación positiva moderada".</li>
            <li><strong>Outliers o subgrupos:</strong> mencionar si hay puntos que alteran la relación.</li>
            <li><strong>Posible causa/confusores:</strong> hipótesis breves (p. ej. categoría, país).</li>
            <li><strong>Implicación práctica:</strong> qué acción o siguiente paso recomiendan (segmentar, recolectar más datos, modelar causalidad).</li>
            <li><strong>Lenguaje cauteloso:</strong> usar "relación" o "asociación", no afirmar causalidad sin evidencia.</li>
          </ul>
          <div style={{ marginTop:10, fontSize:13, color:C.muted }}>
            Ejemplo: "Tawsito aprendió que subs y views muestran una correlación positiva moderada: los canales con más subs tienden a recibir más views; sin embargo, hay outliers (Kids/Music) y la categoría parece influir, por lo que recomendamos segmentar antes de asumir causalidad."
          </div>
        </Card>

        <Card style={{ padding:22 }}>
          <div style={{ fontSize:13, color:C.muted, marginBottom:10 }}>
            <span style={{ color:C.yellow, fontWeight:700 }}>{memberName(writerIdx)}</span> escribe la conclusión del equipo:
          </div>
          <textarea
            value={conclusionText}
            onChange={e => setConclusionText(e.target.value.slice(0, 200))}
            placeholder={`Ej: "Tawsito aprendió que ${xCol?.label} y ${yCol?.label} tienen una correlación [positiva/negativa/nula], lo que significa que..."`}
            rows={3}
            style={{ resize:"none", fontSize:15, padding:"12px 14px", borderRadius:10, width:"100%",
              boxSizing:"border-box", marginBottom:6, background:C.surface, border:`1px solid ${C.border}`, color:C.text, fontFamily:"Space Grotesk,sans-serif" }}
          />
          <div style={{ fontSize:11, color:C.dim }}>{conclusionText.length}/200</div>
        </Card>

        {conclusionText.trim().length >= 10 && (
          <Btn 
            onClick={() => {
              setSubmitted(true);
              setStep(6);
              giveXP(50);
            }} 
            variant="success" 
            size="lg"
            style={{ width:"100%", justifyContent:"center" }}>
            ✅ Enviar conclusión →
          </Btn>
        )}
      </div>
    );
  }

  if (step === 6) {
    return (
      <div style={{ padding:28, flex:1, overflowY:"auto", display:"flex", alignItems:"center", justifyContent:"center" }}>
        {showXPAmount && <XPPop amount={showXPAmount} onDone={() => setShowXPAmount(null)} />}
        <div className="fade-in" style={{ maxWidth:580, width:"100%" }}>
          <Card style={{ padding:40, textAlign:"center" }} glow={C.green}>
            <div style={{ fontSize:60, marginBottom:16 }}>✅</div>
            <h2 style={{ fontSize:24, fontWeight:800, margin:"0 0 12px", color:C.green }}>¡Conclusión enviada!</h2>
            <p style={{ fontSize:15, color:C.muted, margin:"0 0 28px", lineHeight:1.6 }}>
              Tawsito aprendió que <strong>{xCol?.label}</strong> y <strong>{yCol?.label}</strong> tienen una relación importante. ¡Excelente análisis de equipo! 📊
            </p>
            
            <Card style={{ padding:20, background:`${C.green}10`, border:`1px solid ${C.green}30`, marginBottom:20 }}>
              <div style={{ fontSize:13, color:C.muted, marginBottom:8 }}>Puntos ganados en Fase 4</div>
              <div style={{ fontSize:42, fontWeight:900, color:C.green }}>+{earnedXP}</div>
            </Card>

            <Btn 
              onClick={() => onComplete && onComplete(earnedXP)} 
              variant="success" 
              size="lg"
              style={{ width:"100%", justifyContent:"center" }}>
              Continuar a Fase 5 →
            </Btn>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}

Object.assign(window, { CorrelacionesScreen });
