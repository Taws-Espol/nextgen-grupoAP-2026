// screens/ResearchLabScreen.jsx — Fase 5 reimaginada: Preparar un pitch (diapositivas + ensayo)

function ResearchLabScreen({ team, initialProgress, onProgress, onComplete }) {
  const members = ((team?.members || []).concat(["", "", "", "", "", ""])).slice(0, 6);
  const mCount = members.filter(m => m && m.trim()).length || 6;
  const memberName = (i) => members[i]?.trim() || `Integrante ${i + 1}`;

  const THEMES = [
    { id: 1, title: "Quién genera más ingresos", desc: "Identificar factores detrás de ingresos altos" },
    { id: 2, title: "Estrategia de contenido", desc: "Qué tipos de contenido funcionan mejor" },
    { id: 3, title: "Audiencia y retención", desc: "Dónde están los públicos más fieles" },
    { id: 4, title: "Correlaciones clave", desc: "Relaciones entre métricas que importan" },
    { id: 5, title: "Outliers interesantes", desc: "Casos excepcionales que dejan lecciones" },
  ];

  const TEMPLATES = [
    {
      id: 'story', name: 'Historia (Story)', desc: 'Conectar contexto → hallazgo → recomendación',
      slides: [
        { title: 'Título / Pregunta', bullets: ['Contexto breve', 'Pregunta que respondemos'], evidence: [] },
        { title: 'Hallazgo clave', bullets: ['Punto principal (1 frase)', 'Soporte rápido'], evidence: [] },
        { title: 'Evidencia visual', bullets: ['Gráfico 1', 'Interpretación breve'], evidence: [] },
        { title: 'Recomendación', bullets: ['Qué proponemos', 'Impacto esperado'], evidence: [] }
      ]
    },
    {
      id: 'problem', name: 'Problema → Solución', desc: 'Plantear problema y solución con evidencia',
      slides: [
        { title: 'Problema', bullets: ['¿Qué sucede?', 'A quién afecta'], evidence: [] },
        { title: 'Causas / Evidencia', bullets: ['Evidencia 1', 'Evidencia 2'], evidence: [] },
        { title: 'Solución propuesta', bullets: ['Acción 1', 'Acción 2'], evidence: [] },
        { title: 'Impacto y próximos pasos', bullets: ['Métrica de éxito', 'Siguiente paso'], evidence: [] }
      ]
    },
    {
      id: 'data', name: 'Insight Data-Driven', desc: 'Mostrar insight cuantitativo y su implicancia',
      slides: [
        { title: 'Pregunta de negocio', bullets: ['Contexto', 'Métrica objetivo'], evidence: [] },
        { title: 'Insight numérico', bullets: ['Resultado clave', 'Confianza / limitaciones'], evidence: [] },
        { title: 'Evidencias', bullets: ['Gráfico principal', 'Comparativa breve'], evidence: [] },
        { title: 'Recomendación basada en datos', bullets: ['Acción', 'Impacto esperado'], evidence: [] }
      ]
    }
  ];

  const applyTemplate = (tplId) => {
    const tpl = TEMPLATES.find(t=>t.id===tplId);
    if (!tpl) return;
    setSlides(tpl.slides.map(s => ({ ...s, evidence: [] })));
    giveXP(50);
  };

  const [step, setStep] = useState(initialProgress?.step ?? 0);
  const [selectedTheme, setSelectedTheme] = useState(initialProgress?.selectedTheme ?? null);
  const [showThemeIntro, setShowThemeIntro] = useState(false);
  const [xVar, setXVar] = useState(initialProgress?.xVar ?? "views");
  const [yVar, setYVar] = useState(initialProgress?.yVar ?? "revenue");
  const [slides, setSlides] = useState(initialProgress?.slides ?? [ { title: 'Introducción', bullets: ['Contexto / pregunta'], evidence: [] } ]);
  const [generatedCharts, setGeneratedCharts] = useState(initialProgress?.generatedCharts ?? []);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [earnedXP, setEarnedXP] = useState(initialProgress?.earnedXP ?? 0);
  const [showXPAmount, setShowXPAmount] = useState(null);
  const [showFullTable, setShowFullTable] = useState(false);

  useEffect(() => {
    onProgress?.({ step, selectedTheme, xVar, yVar, slides, generatedCharts, earnedXP });
  }, [step, selectedTheme, xVar, yVar, slides, generatedCharts, earnedXP]);

  const giveXP = (n) => { setEarnedXP(p => p + n); setShowXPAmount(n); };

  // NOTE: removed timed rehearsal — practice is untimed

  const addSlide = () => {
    if (slides.length >= 6) return;
    setSlides(s => [...s, { title: `Slide ${s.length+1}`, bullets: [''], evidence: [] }]);
  };
  const updateSlide = (idx, patch) => setSlides(s => s.map((sl,i) => i===idx ? { ...sl, ...patch } : sl));
  const removeSlide = (idx) => setSlides(s => s.filter((_,i) => i!==idx));

  const startRehearsal = () => { /* kept for compatibility but not used */ };

  const completeAndSubmit = () => {
    // give XP for slides completeness and rehearsal
    const slideScore = Math.min(300, slides.length * 60);
    giveXP(slideScore);
    onComplete?.(earnedXP + slideScore);
  };

  // STEP 0: Intro
  if (step === 0) return (
    <div style={{ padding:28, flex:1, overflowY:"auto", display:"flex", alignItems:"center", justifyContent:"center" }}>
      {showXPAmount && <XPPop amount={showXPAmount} onDone={()=>setShowXPAmount(null)} />}
      <div style={{ maxWidth:780, width:"100%" }}>
        <Card style={{ padding:28 }} glow={C.pink}>
          <div style={{ display:"flex", gap:16, alignItems:"flex-start" }}>
            <div style={{ fontSize:46 }}>🎤</div>
            <div>
              <Chip label="Fase 5 · Preparar Pitch" color={C.pink} />
              <h1 style={{ fontSize:24, fontWeight:900, marginTop:8 }}>Preparen un pitch de 3–4 minutos</h1>
              <p style={{ color:C.muted }}>Esta fase los guía para convertir sus hallazgos en una presentación corta y poderosa. Al final deberán presentar 3–5 diapositivas y ensayar el tiempo.</p>
            </div>
          </div>
          <div style={{ display:"flex", gap:10, marginTop:18 }}>
            <Btn variant="primary" onClick={()=>setStep(1)}>Empezar →</Btn>
            <Btn variant="ghost" onClick={()=>{ setSlides([{ title:'Introducción', bullets:['Contexto'], evidence:[] }, { title:'Hallazgo', bullets:['Punto clave'], evidence:[] }, { title:'Impacto', bullets:['Qué hacemos con esto'], evidence:[] }]); setStep(2); }}>Plantilla rápida</Btn>
          </div>
        </Card>
      </div>
    </div>
  );

  // STEP 1: Elegir tema y explorar datos
  if (step === 1) return (
    <div style={{ padding:28, flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:18 }}>
      {showXPAmount && <XPPop amount={showXPAmount} onDone={()=>setShowXPAmount(null)} />}
      <div>
        <Chip label="Seleccionar tema" color={C.cyan} />
        <h2 style={{ fontSize:20, fontWeight:800, marginTop:8 }}>Elijan un ángulo para su pitch</h2>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
        {THEMES.map(t => (
          <Card key={t.id} onClick={() => { setSelectedTheme(t.id); giveXP(40); setShowThemeIntro(true); }} style={{ padding:14, cursor:'pointer' }}>
            <div style={{ fontWeight:800 }}>{t.title}</div>
            <div style={{ color:C.muted, fontSize:13, marginTop:6 }}>{t.desc}</div>
          </Card>
        ))}
      </div>
      {showThemeIntro && (
        <div style={{ position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:40 }}>
          <Card style={{ width:720, padding:20 }}>
            <div style={{ display:'flex', gap:12 }}>
              <div style={{ fontSize:28 }}>🎯</div>
              <div>
                <div style={{ fontWeight:900, fontSize:18 }}>{THEMES.find(t=>t.id===selectedTheme)?.title || 'Objetivo'}</div>
                <div style={{ color:C.muted, marginTop:8 }}>{THEMES.find(t=>t.id===selectedTheme)?.desc}</div>
                <div style={{ marginTop:10, fontSize:13 }}>
                  {selectedTheme === 1 && <>Objetivo: Identificar qué factores impulsan mayores ingresos. Por qué: entender esto permite priorizar canales y formatos que generan valor.</>}
                  {selectedTheme === 2 && <>Objetivo: Determinar qué tipos de contenido rinden mejor. Por qué: enfocar producción hacia formatos que aumentan alcance y retención.</>}
                  {selectedTheme === 3 && <>Objetivo: Localizar audiencias con mejor retención. Por qué: adaptar mensajes y campañas para fidelizar usuarios clave.</>}
                  {selectedTheme === 4 && <>Objetivo: Encontrar correlaciones que expliquen comportamiento. Por qué: ver relaciones que sugieren acciones concretas.</>}
                  {selectedTheme === 5 && <>Objetivo: Detectar outliers interesantes y lecciones. Por qué: los casos extremos pueden revelar tácticas replicables o riesgos a evitar.</>}
                </div>
                <div style={{ marginTop:12, color:C.muted, fontSize:13 }}>Qué haremos: formular una hipótesis, explorar con el scatter y capturar 2–3 evidencias (gráficos) para incluir en el pitch.</div>
                <div style={{ marginTop:12, display:'flex', gap:8 }}>
                  <Btn variant='secondary' onClick={()=>{ setShowThemeIntro(false); setStep(2); }}>Continuar →</Btn>
                  <Btn variant='ghost' onClick={()=>{ setShowThemeIntro(false); setSelectedTheme(null); }}>Volver</Btn>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
      <div style={{ marginTop:6 }}>
        <Btn variant='secondary' onClick={()=>setStep(0)}>← Volver</Btn>
      </div>
    </div>
  );

  // STEP 2: Explorar y seleccionar evidencias (guiado)
  if (step === 2) return (
    <div style={{ padding:28, flex:1, overflowY:'auto', display:'flex', flexDirection:'column', gap:16 }}>
      {showXPAmount && <XPPop amount={showXPAmount} onDone={()=>setShowXPAmount(null)} />}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <Chip label='Exploración guiada' color={C.cyan} />
          <h2 style={{ margin:6, fontWeight:800 }}>Sigan los pasos: hipótesis → evidencia → síntesis</h2>
          <div style={{ color:C.muted }}>No adivinen: aquí les proponemos qué comprobar y cómo capturarlo para la presentación.</div>
        </div>
        <div>
          <div style={{ color:C.muted, fontSize:13 }}>Variables (para scatter):</div>
          <div style={{ display:'flex', gap:8, marginTop:6 }}>
            <select value={xVar} onChange={e=>setXVar(e.target.value)}>
              {COLUMNS.filter(c=>c.type==='number').map(c=> <option key={c.key} value={c.key}>{c.label}</option>)}
            </select>
            <select value={yVar} onChange={e=>setYVar(e.target.value)}>
              {COLUMNS.filter(c=>c.type==='number').map(c=> <option key={c.key} value={c.key}>{c.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 420px', gap:12 }}>
        <div>
          <Card style={{ padding:12 }}>
            <div style={{ fontSize:13, fontWeight:700, color:C.muted }}>Paso 1 — Formulen una hipótesis</div>
            <div style={{ marginTop:8 }}>
                  <div style={{ marginBottom:8 }}>{THEMES.find(t=>t.id===selectedTheme)?.desc || 'Elijan un ángulo claro: qué quieren probar exactamente'}</div>
                  <input placeholder='Escriban la hipótesis del equipo (ej: "Canales con más videos generan más ingresos")' style={{ width:'100%', padding:10 }} onChange={e=>{/* optional capture if needed */}} />
                  <div style={{ marginTop:8, fontSize:13, color:C.muted }}>
                    Preguntas guía: 1) ¿Qué variable es la que mediremos (X)? 2) ¿Cuál es la variable de resultado (Y)? 3) ¿Qué dirección esperamos (aumenta/disminuye)? 4) ¿Qué significaría confirmar/descartar la hipótesis?
                  </div>
            </div>
          </Card>

          <Card style={{ padding:12, marginTop:12 }}>
            <div style={{ fontSize:13, fontWeight:700, color:C.muted }}>Paso 2 — Exploren evidencia (tabla + gráfico grande)</div>
            <div style={{ display:'flex', gap:12, marginTop:8 }}>
              <div style={{ flex:1, overflowX:'auto' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div style={{ fontSize:12, color:C.muted, marginBottom:6 }}>Resumen (top 10) — información clave por canal</div>
                  <div><Btn size='sm' variant='ghost' onClick={()=>setShowFullTable(s=>!s)}>{showFullTable? 'Ocultar tabla completa' : 'Ver tabla completa'}</Btn></div>
                </div>
                {!showFullTable ? (
                  <div style={{ marginTop:8 }}>
                    {YT_DATA.slice().sort((a,b)=>b.views - a.views).slice(0,10).map((r,idx)=> (
                      <div key={r.id} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:`1px solid ${C.border2}` }}>
                        <div style={{ fontWeight:700 }}>{idx+1}. {r.channel}</div>
                        <div style={{ color:C.muted }}>{r.views.toLocaleString()} views · {r.subs.toLocaleString()} subs</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ overflowX:'auto', marginTop:8 }}>
                    <table style={{ width:'100%', borderCollapse:'collapse' }}>
                      <thead>
                        <tr>{COLUMNS.map(h=> <th key={h.key} style={{ padding:8, textAlign:'left' }}>{h.label}</th>)}</tr>
                      </thead>
                      <tbody>
                        {YT_DATA.map(r=> (
                          <tr key={r.id}><td style={{ padding:8 }}>{r.channel}</td><td>{r.category}</td><td>{r.country}</td><td>{r.subs}</td><td>{r.views}</td><td>{r.videos}</td><td>{r.avgViews}</td><td>{r.likes}</td><td>{r.revenue}</td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            <div style={{ marginTop:12 }}>
              <div style={{ fontSize:12, color:C.muted, marginBottom:6 }}>Gráfico principal (ampliado)</div>
              <div style={{ border:`1px solid ${C.border}`, borderRadius:10, padding:12, minHeight:360 }}>
                <ScatterChart data={YT_DATA} xKey={xVar} yKey={yVar} showLabels={true} style={{ width:'100%', height:340 }} />
              </div>
              <div style={{ marginTop:10, fontSize:13, color:C.muted }}>
                ¿Qué buscar en el gráfico? Busquen tendencias (sube/ baja), outliers, agrupamientos y relaciones fuertes entre X e Y. Anoten 2–3 observaciones claras.
              </div>
            </div>
          </Card>

          <Card style={{ padding:12, marginTop:12 }}>
            <div style={{ fontSize:13, fontWeight:700, color:C.muted }}>Paso 3 — Recomendaciones de evidencia</div>
            <div style={{ display:'grid', gap:8, marginTop:8 }}>
              <div style={{ display:'flex', gap:8 }}>
                <Card style={{ padding:10, flex:1 }}>
                  <div style={{ fontWeight:800 }}>Top canales por vistas</div>
                  <div style={{ color:C.muted, fontSize:12, marginTop:6 }}>Bar chart de los 10 canales con más vistas.</div>
                  <div style={{ marginTop:8, display:'flex', gap:8 }}>
                    <Btn size='sm' onClick={() => { const cfg = { type:'bar', key:'views', top:10 }; setGeneratedCharts(g=>[...g,cfg]); }}>Agregar evidencia</Btn>
                  </div>
                </Card>
                <Card style={{ padding:10, flex:1 }}>
                  <div style={{ fontWeight:800 }}>Distribución por categoría</div>
                  <div style={{ color:C.muted, fontSize:12, marginTop:6 }}>Pie chart de los canales por categoría.</div>
                  <div style={{ marginTop:8 }}>
                    <Btn size='sm' onClick={() => { const cfg = { type:'pie', key:'category' }; setGeneratedCharts(g=>[...g,cfg]); }}>Agregar evidencia</Btn>
                  </div>
                </Card>
              </div>

              <Card style={{ padding:10 }}>
                <div style={{ fontWeight:800 }}>Correlación rápida (scatter)</div>
                <div style={{ color:C.muted, fontSize:12, marginTop:6 }}>Qué aporta: muestra relación entre X e Y y ayuda a visualizar tendencia y outliers.</div>
                <div style={{ marginTop:8 }}>
                  <Btn size='sm' onClick={() => { const cfg = { type:'scatter', xKey:xVar, yKey:yVar, desc:'Muestra relación entre X e Y; busquen tendencia o outliers' }; setGeneratedCharts(g=>[...g,cfg]); }}>Agregar evidencia</Btn>
                </div>
              </Card>
            </div>
          </Card>
        </div>

        <div>
          <Card style={{ padding:12 }}>
            <div style={{ fontSize:13, fontWeight:700 }}>Evidencias guardadas</div>
            <div style={{ fontSize:12, color:C.muted, marginTop:6 }}>Cómo funciona: pulse "Agregar evidencia" para crear un gráfico; aparecerá aquí. Use el menú "Agregar a slide..." para adjuntarlo al módulo deseado.</div>
            <div style={{ marginTop:8, display:'flex', flexDirection:'column', gap:8 }}>
                {generatedCharts.length === 0 && <div style={{ color:C.muted }}>No hay evidencias aún. Agreguen una desde las recomendaciones.</div>}
              {generatedCharts.map((g,gi)=> (
                <div key={gi} style={{ border:`1px solid ${C.border}`, padding:8, borderRadius:8 }}>
                  <div style={{ fontWeight:800 }}>{g.type.toUpperCase()} {g.key?`· ${g.key}`:''} {g.xKey?`· ${g.xKey} vs ${g.yKey}`:''}</div>
                  {g.desc && <div style={{ fontSize:12, color:C.muted, marginTop:6 }}>{g.desc}</div>}
                  <div style={{ marginTop:8 }}>
                    <div style={{ width:'100%', height:120, border:`1px solid ${C.border}`, borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      {g.type === 'scatter' ? <ScatterChart data={YT_DATA} xKey={g.xKey||xVar} yKey={g.yKey||yVar} small /> : <div style={{ color:C.muted }}>Vista previa</div>}
                    </div>
                    <div style={{ display:'flex', gap:8, marginTop:8 }}>
                      <select onChange={e=> { const slideIdx = parseInt(e.target.value); if(!isNaN(slideIdx)) { updateSlide(slideIdx, { evidence: [...(slides[slideIdx].evidence||[]), g] }); } }}>
                        <option value=''>Agregar a slide...</option>
                        {slides.map((_,i)=> <option key={i} value={i}>{i+1} · {slides[i].title}</option>)}
                      </select>
                      <Btn size='sm' variant='ghost' onClick={()=> setGeneratedCharts(gs => gs.filter((_,i)=>i!==gi))}>Eliminar</Btn>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop:12 }}>
              <Btn variant='secondary' onClick={()=>setStep(3)}>Continuar → Crear presentación</Btn>
            </div>
          </Card>
        </div>
      </div>

    </div>
  );

  // STEP 3: Editor de diapositivas
  if (step === 3) return (
    <div style={{ padding:28, flex:1, overflowY:'auto', display:'flex', flexDirection:'column', gap:14 }}>
      {showXPAmount && <XPPop amount={showXPAmount} onDone={()=>setShowXPAmount(null)} />}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <Chip label='Crear presentación' color={C.purple} />
          <h2 style={{ margin:6, fontWeight:800 }}>Armen 3–5 módulos (plantillas pulidas)</h2>
          <div style={{ color:C.muted, fontSize:13 }}>Cada módulo tiene un título, bullets y evidencias. Usen una plantilla para comenzar rápido.</div>
        </div>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <select onChange={e=> applyTemplate(e.target.value)} style={{ padding:8, background:C.surface, border:`1px solid ${C.border}` }}>
            <option value=''>Aplicar plantilla...</option>
            {TEMPLATES.map(t=> <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <Btn variant='ghost' onClick={()=>addSlide()}>+ Añadir módulo</Btn>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 420px', gap:12 }}>
        <div>
          {slides.map((sl,i)=> (
            <Card key={i} style={{ padding:12, marginBottom:8 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:8 }}>
                <div style={{ fontWeight:800 }}>{i+1}. <input value={sl.title} onChange={e=>updateSlide(i,{ title:e.target.value })} style={{ fontSize:16, fontWeight:800, border:'none', background:'transparent' }} /></div>
                <div style={{ display:'flex', gap:8 }}>
                  <Btn size='sm' variant='ghost' onClick={()=>removeSlide(i)}>Eliminar</Btn>
                </div>
              </div>
                <div style={{ marginTop:8 }}>
                  <div style={{ fontSize:12, color:C.muted, marginBottom:8 }}>Guía: pongan un título claro; 1–4 viñetas que expliquen el mensaje; si adjuntan evidencia escriban una frase que conecte la evidencia con el hallazgo.</div>
                {sl.bullets.map((b,j) => (
                  <div key={j} style={{ display:'flex', gap:8, marginBottom:6 }}>
                    <div style={{ width:8 }}>•</div>
                    <input value={b} onChange={e=> { const copy = [...sl.bullets]; copy[j]=e.target.value; updateSlide(i,{ bullets: copy }); }} style={{ flex:1 }} />
                    <Btn size='sm' variant='ghost' onClick={()=> { const copy = [...sl.bullets]; copy.splice(j,1); updateSlide(i,{ bullets: copy }); }}>x</Btn>
                  </div>
                ))}
                <div style={{ marginTop:6 }}><Btn size='sm' variant='secondary' onClick={()=> updateSlide(i,{ bullets: [...sl.bullets, ''] })}>+ Viñeta</Btn></div>
                <div style={{ marginTop:8 }}>
                  <div style={{ fontSize:12, color:C.muted }}>Evidencias (gráficos) adjuntas</div>
                  {(!sl.evidence || sl.evidence.length===0) && <div style={{ color:C.muted, marginTop:6 }}>Ninguna. Agreguen evidencias desde la exploración.</div>}
                  {(sl.evidence||[]).map((ev,ei) => (
                    <div key={ei} style={{ display:'flex', alignItems:'center', gap:8, marginTop:8 }}>
                      <div style={{ width:120, height:64, border:`1px solid ${C.border}`, borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center' }}>
                        {ev.type === 'scatter' ? <ScatterChart data={YT_DATA} xKey={ev.xKey||xVar} yKey={ev.yKey||yVar} small /> : <div style={{ color:C.muted }}>Preview</div>}
                      </div>
                      <div style={{ flex:1 }}>{ev.type.toUpperCase()} {ev.key||''} {ev.xKey?`· ${ev.xKey} vs ${ev.yKey}`:''}</div>
                      <Btn size='sm' variant='ghost' onClick={()=> { const copy = [...(sl.evidence||[])]; copy.splice(ei,1); updateSlide(i,{ evidence: copy }); }}>Quitar</Btn>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div>
          <Card style={{ padding:12 }}>
            <div style={{ fontSize:13, fontWeight:700, marginBottom:8 }}>Vista previa</div>
            <div style={{ minHeight:360, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <div style={{ width:'100%' }}>
                      <div style={{ background:`linear-gradient(90deg, ${C.purple}22, ${C.purple}10)`, padding:14, borderRadius:8 }}>
                        <div style={{ fontSize:20, fontWeight:900 }}>{slides[currentSlide]?.title}</div>
                      </div>
                      <div style={{ marginTop:12, padding:12, background:'rgba(255,255,255,0.02)', borderRadius:8 }}>
                        <ul style={{ marginTop:8, paddingLeft:18 }}>
                          {(slides[currentSlide]?.bullets||[]).map((b,bi) => <li key={bi} style={{ marginBottom:8, fontSize:15 }}>{b}</li>)}
                        </ul>
                      </div>
                      <div style={{ marginTop:12, display:'flex', gap:8, flexWrap:'wrap' }}>
                        {(slides[currentSlide]?.evidence || []).map((ev,ei) => (
                          <div key={ei} style={{ width:180, border:`1px solid ${C.border}`, borderRadius:8, padding:8, background:C.surface }}>
                            <div style={{ fontSize:11, color:C.muted, marginBottom:6 }}>{ev.type.toUpperCase()}</div>
                            <div style={{ width:'100%', height:90, display:'flex', alignItems:'center', justifyContent:'center' }}>
                              {ev.type === 'scatter' ? <ScatterChart data={YT_DATA} xKey={ev.xKey||xVar} yKey={ev.yKey||yVar} small /> : <div style={{ color:C.muted }}>Vista</div>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', marginTop:10 }}>
              <div style={{ display:'flex', gap:8 }}>
                <Btn size='sm' variant='ghost' onClick={()=>setCurrentSlide(s => Math.max(0, s-1))}>←</Btn>
                <Btn size='sm' variant='ghost' onClick={()=>setCurrentSlide(s => Math.min(slides.length-1, s+1))}>→</Btn>
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <Btn size='sm' variant='secondary' onClick={()=>setStep(2)}>← Volver</Btn>
                <Btn size='sm' variant='primary' onClick={()=> { giveXP(80); setStep(4); }}>Guardar diapositivas → Ensayar</Btn>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );

  // STEP 4: Revisión / práctica (sin presión de tiempo)
  if (step === 4) return (
    <div style={{ padding:28, flex:1, overflowY:'auto', display:'flex', flexDirection:'column', gap:16 }}>
      {showXPAmount && <XPPop amount={showXPAmount} onDone={()=>setShowXPAmount(null)} />}
      <div>
        <Chip label='Revisión y práctica' color={C.green} />
        <h2 style={{ margin:6, fontWeight:800 }}>Repasen la presentación — sin temporizador</h2>
        <div style={{ color:C.muted }}>Naveguen por los módulos y ajusten el texto o evidencias. Cuando estén listos, envíen el pitch.</div>
      </div>

      <Card style={{ padding:16 }}>
        <div style={{ minHeight:260 }}>
          <div style={{ fontSize:18, fontWeight:900 }}>{slides[currentSlide]?.title}</div>
          <ul style={{ marginTop:8 }}>{(slides[currentSlide]?.bullets||[]).map((b,i)=><li key={i}>{b}</li>)}</ul>
          <div style={{ marginTop:12, display:'flex', gap:8, flexWrap:'wrap' }}>
            {(slides[currentSlide]?.evidence||[]).map((ev,ei)=> (
              <div key={ei} style={{ width:200, border:`1px solid ${C.border}`, borderRadius:8, padding:8 }}>{ev.type.toUpperCase()}</div>
            ))}
          </div>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:12 }}>
          <div style={{ display:'flex', gap:8 }}>
            <Btn variant='ghost' onClick={()=>setCurrentSlide(s=>Math.max(0,s-1))}>←</Btn>
            <Btn variant='ghost' onClick={()=>setCurrentSlide(s=>Math.min(slides.length-1,s+1))}>→</Btn>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <Btn variant='secondary' onClick={()=>setStep(3)}>← Editar</Btn>
            <Btn variant='primary' onClick={()=>{ completeAndSubmit(); }}>Enviar pitch y completar fase</Btn>
          </div>
        </div>
      </Card>
    </div>
  );

  return null;
}
