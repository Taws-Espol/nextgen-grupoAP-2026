// screens/ResearchLabScreen.jsx — Fase 5 rediseñada: Laboratorio de investigación

function ResearchLabScreen({ team, initialProgress, onProgress, onComplete }) {
  const members = ((team?.members || []).concat(["", "", "", "", "", ""])).slice(0, 6);
  const mCount = members.filter(m => m && m.trim()).length || 6;
  const memberName = (i) => members[i]?.trim() || `Integrante ${i + 1}`;

  const RESEARCH_THEMES = [
    { id: 1, title: "¿Qué canal genera MÁS INGRESOS?", emoji: "💰", desc: "Investigar qué factores hacen que un canal sea más rentable" },
    { id: 2, title: "¿Cuál es la estrategia de contenido ganadora?", emoji: "📹", desc: "Comparar cantidad de videos vs vistas y suscriptores" },
    { id: 3, title: "¿Dónde está el público más leal?", emoji: "📍", desc: "Analizar qué países tienen mejores porcentajes de likes" },
    { id: 4, title: "¿Existe una fórmula del éxito?", emoji: "⚡", desc: "Buscar correlaciones entre múltiples variables" },
    { id: 5, title: "¿Quién y por qué es un outlier?", emoji: "🎯", desc: "Encontrar canales excepcionales y entender su éxito" },
  ];

  const NUMERIC_COLS = COLUMNS.filter(c => c.type === "number");

  const [step, setStep] = useState(initialProgress?.step ?? 0);
  const [themesProposed, setThemesProposed] = useState(initialProgress?.themesProposed ?? {});
  const [selectedTheme, setSelectedTheme] = useState(initialProgress?.selectedTheme ?? null);
  const [xVar, setXVar] = useState(initialProgress?.xVar ?? null);
  const [yVar, setYVar] = useState(initialProgress?.yVar ?? null);
  const [findings, setFindings] = useState(initialProgress?.findings ?? {});
  const [approvals, setApprovals] = useState(initialProgress?.approvals ?? {});
  const [earnedXP, setEarnedXP] = useState(initialProgress?.earnedXP ?? 0);
  const [showXPAmount, setShowXPAmount] = useState(null);

  useEffect(() => {
    onProgress?.({ step, themesProposed, selectedTheme, xVar, yVar, findings, approvals, earnedXP });
  }, [step, themesProposed, selectedTheme, xVar, yVar, findings, approvals, earnedXP]);

  const giveXP = (amount) => { setEarnedXP(p => p + amount); setShowXPAmount(amount); };

  const xCol = COLUMNS.find(c => c.key === xVar);
  const yCol = COLUMNS.find(c => c.key === yVar);
  const selectedThemeObj = RESEARCH_THEMES.find(t => t.id === selectedTheme);

  // Step 0: Intro
  if (step === 0) return (
    <div style={{ padding:28, flex:1, overflowY:"auto", display:"flex", alignItems:"center", justifyContent:"center" }}>
      {showXPAmount && <XPPop amount={showXPAmount} onDone={()=>setShowXPAmount(null)} />}
      <div className="fade-in" style={{ maxWidth:640, width:"100%" }}>
        <Card style={{ padding:32 }} glow={C.pink}>
          <div style={{ display:"flex", gap:16, alignItems:"flex-start", marginBottom:22 }}>
            <div style={{ fontSize:52 }}>🔬</div>
            <div>
              <Chip label="Fase 5 · Laboratorio de Investigación" color={C.pink} />
              <h1 style={{ fontSize:26, fontWeight:900, margin:"8px 0" }}>Investiguen como científicos de datos</h1>
              <div style={{ background:`${C.pink}12`, border:`1px solid ${C.pink}30`, borderRadius:12, padding:14, marginTop:8 }}>
                <p style={{ color:C.text, fontSize:14, lineHeight:1.7, margin:0 }}>
                  Usen DATASETS y GRAFICOS para investigar un tema que elijan. Planteen preguntas, exploren, documenten y validen.
                </p>
              </div>
            </div>
          </div>
          <Btn onClick={()=>setStep(1)} variant="success" size="lg" style={{ width:"100%", justifyContent:"center" }}>¡Empezar investigación! 🔬 →</Btn>
        </Card>
      </div>
    </div>
  );

  // Step 1: Propose themes
  if (step === 1) return (
    <div style={{ padding:28, flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:20 }}>
      {showXPAmount && <XPPop amount={showXPAmount} onDone={()=>setShowXPAmount(null)} />}
      <div>
        <Chip label="Fase 5 · Selección de tema" color={C.pink} />
        <h2 style={{ fontSize:22, fontWeight:800, margin:"8px 0 4px" }}>¿Qué tema querés investigar?</h2>
        <p style={{ color:C.muted, fontSize:14, margin:0 }}>El equipo elige un único tema para investigar</p>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        {RESEARCH_THEMES.map(theme => (
          <Card key={theme.id} onClick={() => {
            setThemesProposed({ 0: theme.id });
            setSelectedTheme(theme.id);
            giveXP(70);
            setStep(2);
          }} style={{ padding:16, cursor:"pointer" }}>
            <div style={{ fontSize:32, marginBottom:8 }}>{theme.emoji}</div>
            <h3 style={{ fontSize:14, fontWeight:800, margin:"0 0 6px" }}>{theme.title}</h3>
            <p style={{ margin:0, color:C.muted, fontSize:12 }}>{theme.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  );


  // Step 2: Free exploration
  if (step === 2) return (
    <div style={{ padding:28, flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:20 }}>
      {showXPAmount && <XPPop amount={showXPAmount} onDone={()=>setShowXPAmount(null)} />}
      <div>
        <Chip label="Fase 5 · Exploración" color={C.cyan} />
        <h2 style={{ fontSize:22, fontWeight:800, margin:"8px 0 4px" }}>Exploren los datos libremente</h2>
        <p style={{ color:C.muted, fontSize:14, margin:0 }}>{selectedThemeObj?.title}</p>
      </div>

      <Card style={{ padding:20 }} glow={C.cyan}>
        <h3 style={{ fontSize:14, fontWeight:700, color:C.cyan, marginBottom:12 }}>Tabla de datos</h3>
        <div style={{ overflowX:"auto", borderRadius:10, border:`1px solid ${C.border}` }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
            <thead>
              <tr style={{ background:C.surface, borderBottom:`1px solid ${C.border}` }}>
                <th style={{ padding:10, textAlign:"left", color:C.muted, fontWeight:700 }}>Canal</th>
                {NUMERIC_COLS.slice(0,3).map(col=> (
                  <th key={col.key} style={{ padding:10, textAlign:"right", color:C.muted, fontWeight:700 }}>{col.emoji} {col.label.split("(")[0]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {YT_DATA.map((row,i)=>(
                <tr key={i} style={{ borderBottom:`1px solid ${C.border2}` }}>
                  <td style={{ padding:10, color:C.text, fontWeight:600 }}>{row.channel}</td>
                  {NUMERIC_COLS.slice(0,3).map(col=> (
                    <td key={col.key} style={{ padding:10, textAlign:"right", color:C.muted }}>{row[col.key]?.toFixed?.(1) ?? row[col.key]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card style={{ padding:20 }} glow={C.green}>
        <h3 style={{ fontSize:14, fontWeight:700, color:C.green }}>Scatter plot interactivo</h3>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginTop:12 }}>
          <div>
            <label style={{ fontSize:11, color:C.muted, display:"block", marginBottom:6 }}>Variable X</label>
            <select value={xVar||""} onChange={e=>setXVar(e.target.value||null)} style={{ width:"100%", padding:10, background:C.surface, border:`1px solid ${C.border}` }}>
              <option value="">Elegir variable...</option>
              {NUMERIC_COLS.map(col=> <option key={col.key} value={col.key}>{col.emoji} {col.label}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize:11, color:C.muted, display:"block", marginBottom:6 }}>Variable Y</label>
            <select value={yVar||""} onChange={e=>setYVar(e.target.value||null)} style={{ width:"100%", padding:10, background:C.surface, border:`1px solid ${C.border}` }}>
              <option value="">Elegir variable...</option>
              {NUMERIC_COLS.map(col=> <option key={col.key} value={col.key}>{col.emoji} {col.label}</option>)}
            </select>
          </div>
        </div>

        {xVar && yVar ? (
          <div style={{ border:`1px solid ${C.border}`, borderRadius:10, padding:12, marginTop:12 }}>
            <ScatterChart data={YT_DATA} xKey={xVar} yKey={yVar} />
          </div>
        ) : (
          <div style={{ padding:30, textAlign:"center", color:C.dim }}>Selecciona ambas variables para ver el gráfico</div>
        )}
      </Card>

      <Btn onClick={()=>setStep(3)} variant="success">Continuar → Documentar hallazgos</Btn>
    </div>
  );

  // Step 3: Document findings
  if (step === 3) return (
    <div style={{ padding:28, flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:20 }}>
      {showXPAmount && <XPPop amount={showXPAmount} onDone={()=>setShowXPAmount(null)} />}
      <div>
        <Chip label="Fase 5 · Documentación" color={C.purple} />
        <h2 style={{ fontSize:22, fontWeight:800, margin:"8px 0 4px" }}>Documenten sus hallazgos</h2>
      </div>

      <Card style={{ padding:24 }} glow={C.purple}>
        <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
          <div>
            <label style={{ fontSize:12, color:C.muted }}>💭 Pregunta de investigación</label>
            <input value={findings.question||""} onChange={e=>setFindings(p=>({ ...p, question:e.target.value }))} placeholder={selectedThemeObj?.title} style={{ width:"100%", padding:10 }} />
          </div>
          {xVar && yVar && (
            <div style={{ padding:12, background:`${C.green}12`, border:`1px solid ${C.green}30`, borderRadius:8 }}>
              <div style={{ fontSize:11, fontWeight:700, color:C.green }}>Variables seleccionadas</div>
              <div style={{ display:"flex", gap:8, marginTop:8 }}>
                <Chip label={`X: ${xCol?.emoji} ${xCol?.label}`} color={C.green} />
                <Chip label={`Y: ${yCol?.emoji} ${yCol?.label}`} color={C.green} />
              </div>
            </div>
          )}

          <div>
            <label style={{ fontSize:12, color:C.muted }}>📈 Patrón encontrado</label>
            <textarea value={findings.pattern||""} onChange={e=>setFindings(p=>({ ...p, pattern:e.target.value }))} rows={3} style={{ width:"100%", padding:10 }} placeholder="Describan el patrón observado" />
          </div>

          <div>
            <label style={{ fontSize:12, color:C.muted }}>💡 Impacto / Por qué importa</label>
            <textarea value={findings.impact||""} onChange={e=>setFindings(p=>({ ...p, impact:e.target.value }))} rows={3} style={{ width:"100%", padding:10 }} placeholder="Por qué este hallazgo importa" />
          </div>

          <div>
            <label style={{ fontSize:12, color:C.muted }}>🔍 Observaciones adicionales</label>
            <textarea value={findings.notes||""} onChange={e=>setFindings(p=>({ ...p, notes:e.target.value }))} rows={3} style={{ width:"100%", padding:10 }} placeholder="Notas, limitaciones, outliers..." />
          </div>
        </div>
      </Card>

      <Btn onClick={() => { if (findings.question?.trim() && findings.pattern?.trim() && findings.impact?.trim()) { giveXP(100); setStep(4); } }}
        disabled={!findings.question?.trim() || !findings.pattern?.trim() || !findings.impact?.trim()} variant="success" size="lg">Documentación lista → Validación grupal</Btn>
    </div>
  );

  // Step 4: Approval
  if (step === 4) return (
    <div style={{ padding:28, flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:20 }}>
      {showXPAmount && <XPPop amount={showXPAmount} onDone={()=>setShowXPAmount(null)} />}
      <div>
        <Chip label="Fase 5 · Validación" color={C.green} />
        <h2 style={{ fontSize:22, fontWeight:800 }}>¿El equipo valida el reporte?</h2>
        <p style={{ color:C.muted }}>Cada integrante debe aprobar el análisis</p>
      </div>

      <Card style={{ padding:20 }}>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          <div><strong>Pregunta:</strong> {findings.question}</div>
          <div><strong>Patrón:</strong> {findings.pattern}</div>
          <div><strong>Impacto:</strong> {findings.impact}</div>
          {findings.notes && <div><strong>Notas:</strong> {findings.notes}</div>}
        </div>
      </Card>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
        {Array.from({ length: 6 }, (_, i) => i).map(i => {
          if (i >= mCount) return null;
          const approved = approvals[i];
          return (
            <div key={i} style={{ padding:14, borderRadius:12, background: approved?`${C.green}12` : "rgba(255,255,255,0.03)", border:`1px solid ${approved?C.green:C.border}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ fontWeight:700 }}>{memberName(i)}</div>
                  <div style={{ fontSize:12, color:C.muted }}>{approved?"✓ Validó":"Pendiente"}</div>
                </div>
                <button onClick={() => { if(!approved) { setApprovals(p=>({...p,[i]:true})); giveXP(25); } }} disabled={approved}
                  style={{ border:"none", borderRadius:8, padding:"8px 16px", background: approved?`${C.green}25`:C.purple, color: approved?C.green:"#fff", fontWeight:700 }}>
                  {approved?"✓ OK":"Validar"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {Object.keys(approvals).length === mCount && (
        <Card style={{ padding:20, textAlign:"center" }} glow={C.pink}>
          <div style={{ fontSize:40 }}>🎉</div>
          <div style={{ fontWeight:800, fontSize:18, color:C.pink }}>¡Reporte validado! Investigación completada.</div>
          <Btn onClick={()=>{ onComplete?.(500); }} variant="success" size="lg" style={{ marginTop:12 }}>Completar Fase 5 +500 XP ⚡</Btn>
        </Card>
      )}
    </div>
  );

  return null;
}
