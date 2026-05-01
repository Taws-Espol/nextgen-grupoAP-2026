// dq-core.jsx — Data, constants, shared components
const { useState, useEffect, useRef, useCallback } = React;

// ═══════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════
const YT_DATA = [
  { id:1, channel:"MrBeast",          category:"Entertainment", subs:262, views:40000, videos:742,   avgViews:53.9, likes:96, country:"USA",       revenue:3.2 },
  { id:2, channel:"PewDiePie",        category:"Gaming",        subs:111, views:29000, videos:4400,  avgViews:6.5,  likes:94, country:"Sweden",     revenue:1.5 },
  { id:3, channel:"T-Series",         category:"Music",         subs:265, views:240000,videos:20000, avgViews:12.0, likes:87, country:"India",      revenue:5.2 },
  { id:4, channel:"Cocomelon",        category:"Kids",          subs:175, views:177000,videos:1000,  avgViews:177,  likes:78, country:"USA",        revenue:8.1 },
  { id:5, channel:"SET India",        category:"Entertainment", subs:174, views:148000,videos:105000,avgViews:1.4,  likes:69, country:"India",      revenue:2.3 },
  { id:6, channel:"Markiplier",       category:"Gaming",        subs:38,  views:19000, videos:5700,  avgViews:3.3,  likes:97, country:"USA",        revenue:0.8 },
  { id:7, channel:"Tasty",            category:"Cooking",       subs:21,  views:7500,  videos:2400,  avgViews:3.1,  likes:88, country:"USA",        revenue:0.5 },
  { id:8, channel:"Bon Appétit",      category:"Cooking",       subs:8.2, views:2800,  videos:980,   avgViews:2.9,  likes:95, country:"USA",        revenue:0.3 },
  { id:9, channel:"MKBHD",           category:"Tech",          subs:18,  views:4200,  videos:1600,  avgViews:2.6,  likes:97, country:"USA",        revenue:0.6 },
  { id:10,channel:"Dude Perfect",     category:"Sports",        subs:60,  views:16000, videos:270,   avgViews:59.3, likes:98, country:"USA",        revenue:1.2 },
  { id:11,channel:"5-Minute Crafts",  category:"DIY",           subs:80,  views:26000, videos:5000,  avgViews:5.2,  likes:65, country:"Cyprus",     revenue:1.5 },
  { id:12,channel:"Kurzgesagt",       category:"Education",     subs:22,  views:2900,  videos:190,   avgViews:15.3, likes:99, country:"Germany",    revenue:0.9 },
  { id:13,channel:"NoCopyright­Sounds",category:"Music",        subs:33,  views:12000, videos:1200,  avgViews:10.0, likes:82, country:"UK",         revenue:0.2 },
  { id:14,channel:"Linus Tech Tips",  category:"Tech",          subs:15,  views:5900,  videos:5700,  avgViews:1.0,  likes:92, country:"Canada",     revenue:0.7 },
  { id:15,channel:"Veritasium",       category:"Education",     subs:15,  views:2100,  videos:340,   avgViews:6.2,  likes:98, country:"Australia",  revenue:0.4 },
];

const COLUMNS = [
  { key:"subs",     label:"Suscriptores (M)",       type:"number",   emoji:"👥" },
  { key:"views",    label:"Vistas totales (M)",      type:"number",   emoji:"👁️" },
  { key:"videos",   label:"Nº de videos",            type:"number",   emoji:"🎬" },
  { key:"avgViews", label:"Avg vistas/video (M)",    type:"number",   emoji:"📈" },
  { key:"likes",    label:"% likes positivos",       type:"number",   emoji:"👍" },
  { key:"revenue",  label:"Ingresos/mes (M$)",       type:"number",   emoji:"💰" },
  { key:"category", label:"Categoría",               type:"category", emoji:"🏷️" },
  { key:"country",  label:"País",                    type:"category", emoji:"🌍" },
  { key:"channel",  label:"Canal",                   type:"text",     emoji:"📺" },
];

const PHASES = [
  { id:1, name:"Conoce tus datos",      icon:"🔍", duration:"30 min", color:"#9D6EF8", xpReward:200, desc:"¿Qué es un dataset? Filas, columnas y tipos de datos." },
  { id:2, name:"Detective de patrones", icon:"📊", duration:"40 min", color:"#22D3EE", xpReward:400, desc:"Descubre tendencias y correlaciones con gráficos." },
  { id:3, name:"Tu análisis",           icon:"🧪", duration:"40 min", color:"#4ADE80", xpReward:400, desc:"Explora libremente con tus propias preguntas." },
  { id:4, name:"Pitch Builder",         icon:"🎤", duration:"30 min", color:"#F59E0B", xpReward:300, desc:"Construye tu presentación con tus hallazgos." },
  { id:5, name:"Pitch en vivo",         icon:"🚀", duration:"Live",   color:"#F87171", xpReward:500, desc:"¡Presenta ante todos y vota por el mejor equipo!" },
];

const LEADERBOARD_DATA = [
  { name:"Data Detectives", xp:1850, rank:1, phase:3, badges:["🏆","⚡","🔥"], avatar:"🕵️", color:"#9D6EF8" },
  { name:"Team Rocket",     xp:1250, rank:2, phase:2, badges:["⚡","🎯"],      avatar:"🚀", color:"#22D3EE", isUs:true },
  { name:"Code Sisters",    xp:980,  rank:3, phase:2, badges:["🎯"],           avatar:"💻", color:"#4ADE80" },
  { name:"Neural Ninjas",   xp:720,  rank:4, phase:1, badges:["🌟"],           avatar:"🥷", color:"#F59E0B" },
  { name:"Pixel Pirates",   xp:650,  rank:5, phase:1, badges:[],               avatar:"🏴‍☠️", color:"#F87171" },
  { name:"Algo Queens",     xp:420,  rank:6, phase:1, badges:[],               avatar:"👑", color:"#EC4899" },
];

const QUIZ_QUESTIONS = [
  { q:"¿Cuál es el canal con más suscriptores en el dataset?", opts:["MrBeast","T-Series","Cocomelon","PewDiePie"], ans:1, xp:100, hint:"Pista: no es un canal de entretenimiento americano." },
  { q:"¿Cuántas categorías diferentes de canales hay?", opts:["5","7","8","10"], ans:2, xp:80, hint:"Cuenta: Gaming, Music, Kids, Entertainment, Cooking, Tech, Sports, DIY, Education." },
  { q:"¿Qué canal tiene el mayor promedio de vistas por video?", opts:["MrBeast","Dude Perfect","Cocomelon","T-Series"], ans:2, xp:120, hint:"Piensa: ¿quién tiene muchas vistas pero pocos videos?" },
  { q:"¿Cuál categoría genera más ingresos en promedio?", opts:["Gaming","Music","Kids","Entertainment"], ans:2, xp:150, hint:"Los canales infantiles tienen muchísimas reproducciones automáticas." },
  { q:"¿Cuántos canales en el dataset son de USA?", opts:["4","6","7","9"], ans:2, xp:100, hint:"Revisa: MrBeast, Cocomelon, Markiplier, Tasty, Bon Appétit, MKBHD, Dude Perfect." },
];

const LESSON_SLIDES = [
  {
    title:"¿Qué es un dataset?",
    content:"Un dataset es una colección organizada de datos. Imagínalo como una hoja de cálculo gigante donde cada fila es un canal de YouTube y cada columna es una característica diferente.",
    visual:"table",
    tip:"💡 Nuestro dataset tiene 15 canales y 9 columnas de información.",
  },
  {
    title:"Filas y columnas",
    content:"Cada fila = un canal de YouTube. Cada columna = una característica medible. Esta estructura se llama datos tabulares y es la forma más común de datos en el mundo real.",
    visual:"grid",
    tip:"📊 Los científicos de datos pasan el 80% del tiempo entendiendo sus datos antes de analizarlos.",
  },
  {
    title:"Tipos de datos",
    content:"Los datos pueden ser numéricos (números como suscriptores o vistas) o categóricos (texto como el país o la categoría del canal). ¡Cada tipo se analiza diferente!",
    visual:"types",
    tip:"🔑 Saber el tipo de dato te dice qué gráfico puedes usar para visualizarlo.",
  },
  {
    title:"¿Para qué sirve el análisis?",
    content:"Analizando datos podemos responder preguntas: ¿Los canales de Gaming tienen más suscriptores? ¿Los videos cortos generan más likes? ¡Eso es exactamente lo que van a descubrir hoy!",
    visual:"question",
    tip:"🚀 Los datos sin análisis son solo números. Con análisis, se convierten en historias.",
  },
];

// ═══════════════════════════════════════════
// COLOR TOKENS
// ═══════════════════════════════════════════
const C = {
  bg:"#0B0B1A", surface:"#12122A", card:"#1A1A35",
  border:"rgba(255,255,255,0.08)", border2:"rgba(255,255,255,0.04)",
  purple:"#9D6EF8", cyan:"#22D3EE", green:"#4ADE80",
  yellow:"#F59E0B", red:"#F87171", pink:"#EC4899",
  text:"#E8E8FF", muted:"#7777AA", dim:"#4444AA",
};

// ═══════════════════════════════════════════
// UTILITY COMPONENTS
// ═══════════════════════════════════════════

function Btn({ children, onClick, variant="primary", size="md", disabled=false, style={} }) {
  const sizes = { sm:{padding:"6px 14px",fontSize:12}, md:{padding:"10px 20px",fontSize:14}, lg:{padding:"14px 28px",fontSize:15} };
  const variants = {
    primary: { background:C.purple, color:"#fff", boxShadow:`0 0 20px ${C.purple}30` },
    secondary: { background:"rgba(255,255,255,0.07)", color:C.text, border:`1px solid ${C.border}` },
    success: { background:C.green, color:"#061506", boxShadow:`0 0 20px ${C.green}30` },
    cyan: { background:C.cyan, color:"#06151a", boxShadow:`0 0 20px ${C.cyan}30` },
    danger: { background:C.red, color:"#fff" },
    ghost: { background:"transparent", color:C.muted },
  };
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ border:"none", borderRadius:10, cursor:disabled?"not-allowed":"pointer", fontFamily:"Space Grotesk,sans-serif", fontWeight:700, letterSpacing:0.3,
        transition:"all 0.15s", display:"inline-flex", alignItems:"center", gap:6, opacity:disabled?0.5:1,
        ...sizes[size], ...variants[variant], ...style }}>
      {children}
    </button>
  );
}

function Card({ children, style={}, glow=null, onClick=null }) {
  return (
    <div onClick={onClick}
      style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16,
        ...(glow?{boxShadow:`0 0 30px ${glow}25`}:{}),
        ...(onClick?{cursor:"pointer"}:{}), ...style }}>
      {children}
    </div>
  );
}

function Chip({ label, color=C.purple, size="sm" }) {
  return (
    <span style={{ background:`${color}18`, color, border:`1px solid ${color}35`, borderRadius:20,
      padding:size==="sm"?"2px 9px":"4px 13px", fontSize:size==="sm"?11:13, fontWeight:700, whiteSpace:"nowrap", display:"inline-block" }}>
      {label}
    </span>
  );
}

function XPPop({ amount, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 1200); return ()=>clearTimeout(t); }, []);
  return (
    <div style={{ position:"fixed", top:"30%", left:"50%", transform:"translateX(-50%)", zIndex:9999,
      background:`linear-gradient(135deg,${C.purple},${C.cyan})`, color:"#fff", padding:"12px 28px",
      borderRadius:50, fontWeight:800, fontSize:28, fontFamily:"Space Mono,monospace",
      boxShadow:`0 0 40px ${C.purple}60`, animation:"xpFloat 1.2s ease-out forwards", pointerEvents:"none" }}>
      +{amount} XP ⚡
    </div>
  );
}

function XPBar({ xp, maxXp=2000, showLabel=true }) {
  const pct = Math.min(100, (xp / maxXp) * 100);
  return (
    <div>
      {showLabel && (
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
          <span style={{ color:C.yellow, fontSize:13, fontWeight:700, fontFamily:"Space Mono" }}>⚡ {xp} XP</span>
          <span style={{ color:C.muted, fontSize:11 }}>nivel {Math.floor(xp/400)+1}</span>
        </div>
      )}
      <div style={{ height:7, background:"rgba(255,255,255,0.08)", borderRadius:4, overflow:"hidden" }}>
        <div style={{ width:`${pct}%`, height:"100%", background:`linear-gradient(90deg,${C.purple},${C.cyan})`,
          borderRadius:4, transition:"width 0.8s cubic-bezier(0.34,1.56,0.64,1)", boxShadow:`0 0 8px ${C.cyan}60` }} />
      </div>
    </div>
  );
}

function Timer({ totalSeconds, onEnd, running=true }) {
  const [s, setS] = useState(totalSeconds);
  useEffect(() => {
    if (!running || s <= 0) { if(s<=0) onEnd&&onEnd(); return; }
    const t = setTimeout(() => setS(p => p-1), 1000);
    return () => clearTimeout(t);
  }, [s, running]);
  const pct = (s / totalSeconds) * 100;
  const color = s < 10 ? C.red : s < 30 ? C.yellow : C.green;
  const mm = String(Math.floor(s/60)).padStart(2,"0");
  const ss = String(s%60).padStart(2,"0");
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
      <div style={{ position:"relative", width:44, height:44, flexShrink:0 }}>
        <svg width={44} height={44} style={{ transform:"rotate(-90deg)" }}>
          <circle cx={22} cy={22} r={18} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={3}/>
          <circle cx={22} cy={22} r={18} fill="none" stroke={color} strokeWidth={3}
            strokeDasharray={`${2*Math.PI*18}`}
            strokeDashoffset={`${2*Math.PI*18*(1-pct/100)}`}
            style={{ transition:"stroke-dashoffset 1s linear, stroke 0.5s" }}/>
        </svg>
        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <span style={{ fontSize:10, fontWeight:700, color, fontFamily:"Space Mono" }}>{s<60?ss:mm}</span>
        </div>
      </div>
      <span style={{ fontFamily:"Space Mono", fontSize:18, fontWeight:700, color }}>{mm}:{ss}</span>
    </div>
  );
}

// ═══════════════════════════════════════════
// CHART COMPONENTS (SVG)
// ═══════════════════════════════════════════

function BarChart({ data, xKey, yKey, color=C.purple }) {
  const numericData = data.filter(d => d[yKey] !== undefined && !isNaN(d[yKey]));
  if (!numericData.length) return null;
  const max = Math.max(...numericData.map(d=>d[yKey]));
  const W=520, H=260, pL=48, pB=52, pT=16, pR=12;
  const bW = Math.min(36, (W-pL-pR)/numericData.length - 6);
  const slot = (W-pL-pR)/numericData.length;
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display:"block" }}>
      {[0,0.25,0.5,0.75,1].map(t=>{
        const y = pT+(H-pT-pB)*(1-t);
        return <g key={t}>
          <line x1={pL} x2={W-pR} y1={y} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth={1}/>
          <text x={pL-6} y={y+4} fill={C.muted} fontSize={9} textAnchor="end" fontFamily="Space Mono">{(max*t).toFixed(1)}</text>
        </g>;
      })}
      {numericData.map((d,i)=>{
        const x = pL + slot*i + slot/2;
        const barH = max>0 ? ((d[yKey]||0)/max)*(H-pT-pB) : 0;
        const y = H-pB-barH;
        return <g key={i} style={{ animation:`barGrow 0.5s ${i*0.05}s both` }}>
          <rect x={x-bW/2} y={y} width={bW} height={barH} fill={color} rx={4} opacity={0.85}/>
          <rect x={x-bW/2} y={y} width={bW} height={Math.min(barH,4)} fill="#fff" rx={4} opacity={0.2}/>
          <text x={x} y={H-pB+14} fill={C.muted} fontSize={8} textAnchor="middle" fontFamily="Space Grotesk">{String(d[xKey]).slice(0,10)}</text>
        </g>;
      })}
      <line x1={pL} x2={pL} y1={pT} y2={H-pB} stroke={C.border} strokeWidth={1}/>
      <line x1={pL} x2={W-pR} y1={H-pB} y2={H-pB} stroke={C.border} strokeWidth={1}/>
      <text x={W/2} y={H-2} fill={C.muted} fontSize={9} textAnchor="middle" fontFamily="Space Grotesk">{COLUMNS.find(c=>c.key===xKey)?.label||xKey}</text>
    </svg>
  );
}

function ScatterChart({ data, xKey, yKey }) {
  const valid = data.filter(d => !isNaN(d[xKey]) && !isNaN(d[yKey]));
  if (!valid.length) return null;
  const xs = valid.map(d=>d[xKey]), ys = valid.map(d=>d[yKey]);
  const xMin=Math.min(...xs),xMax=Math.max(...xs),yMin=Math.min(...ys),yMax=Math.max(...ys);
  const W=520,H=260,pad=50;
  const px = x => xMax===xMin ? W/2 : pad+(x-xMin)/(xMax-xMin)*(W-2*pad);
  const py = y => yMax===yMin ? H/2 : H-pad-(y-yMin)/(yMax-yMin)*(H-2*pad);
  const cats = [...new Set(valid.map(d=>d.category))];
  const catColors = [C.purple,C.cyan,C.green,C.yellow,C.red,C.pink,"#F97316","#3B82F6","#06B6D4"];
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display:"block" }}>
      {[0,0.25,0.5,0.75,1].map(t=>{
        const y = pad+(H-2*pad)*(1-t);
        return <g key={t}>
          <line x1={pad} x2={W-pad} y1={y} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth={1}/>
          <text x={pad-6} y={y+4} fill={C.muted} fontSize={9} textAnchor="end" fontFamily="Space Mono">{(yMin+t*(yMax-yMin)).toFixed(1)}</text>
        </g>;
      })}
      {[0,0.25,0.5,0.75,1].map(t=>{
        const x = pad+t*(W-2*pad);
        return <g key={t}>
          <line x1={x} x2={x} y1={pad} y2={H-pad} stroke="rgba(255,255,255,0.05)" strokeWidth={1}/>
          <text x={x} y={H-pad+14} fill={C.muted} fontSize={9} textAnchor="middle" fontFamily="Space Mono">{(xMin+t*(xMax-xMin)).toFixed(1)}</text>
        </g>;
      })}
      {valid.map((d,i)=>{
        const ci = cats.indexOf(d.category);
        const col = catColors[ci%catColors.length];
        return <g key={i} style={{ animation:`dotPop 0.4s ${i*0.04}s both` }}>
          <circle cx={px(d[xKey])} cy={py(d[yKey])} r={6} fill={col} opacity={0.85}/>
          <circle cx={px(d[xKey])} cy={py(d[yKey])} r={6} fill="none" stroke={col} strokeWidth={1} opacity={0.3}/>
        </g>;
      })}
      <line x1={pad} x2={pad} y1={pad} y2={H-pad} stroke={C.border} strokeWidth={1}/>
      <line x1={pad} x2={W-pad} y1={H-pad} y2={H-pad} stroke={C.border} strokeWidth={1}/>
      <text x={W/2} y={H-2} fill={C.muted} fontSize={9} textAnchor="middle" fontFamily="Space Grotesk">{COLUMNS.find(c=>c.key===xKey)?.label||xKey}</text>
      <text x={12} y={H/2} fill={C.muted} fontSize={9} textAnchor="middle" fontFamily="Space Grotesk" transform={`rotate(-90,12,${H/2})`}>{COLUMNS.find(c=>c.key===yKey)?.label||yKey}</text>
    </svg>
  );
}

function PieChart({ data, groupKey, valueKey }) {
  const groups = {};
  data.forEach(d => { const k=d[groupKey]||"Otro"; groups[k]=(groups[k]||0)+(d[valueKey]||0); });
  const entries = Object.entries(groups).sort((a,b)=>b[1]-a[1]).slice(0,7);
  const total = entries.reduce((s,[,v])=>s+v,0);
  const colors = [C.purple,C.cyan,C.green,C.yellow,C.red,C.pink,"#F97316"];
  const W=320, H=240, cx=120, cy=120, r=90, rI=50;
  let angle = -Math.PI/2;
  const arcs = entries.map(([k,v],i)=>{
    const frac = v/total;
    const a1=angle, a2=angle+frac*2*Math.PI;
    angle=a2;
    const x1=cx+r*Math.cos(a1), y1=cy+r*Math.sin(a1);
    const x2=cx+r*Math.cos(a2), y2=cy+r*Math.sin(a2);
    const xi1=cx+rI*Math.cos(a1), yi1=cy+rI*Math.sin(a1);
    const xi2=cx+rI*Math.cos(a2), yi2=cy+rI*Math.sin(a2);
    const large = frac>0.5?1:0;
    return { path:`M ${xi1} ${yi1} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${xi2} ${yi2} A ${rI} ${rI} 0 ${large} 0 ${xi1} ${yi1} Z`,
      color:colors[i%colors.length], label:k, pct:Math.round(frac*100) };
  });
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display:"block" }}>
      {arcs.map((arc,i)=>(
        <path key={i} d={arc.path} fill={arc.color} opacity={0.85} stroke={C.bg} strokeWidth={2}/>
      ))}
      <circle cx={cx} cy={cy} r={rI-1} fill={C.card}/>
      <text x={cx} y={cy-4} fill={C.text} fontSize={11} textAnchor="middle" fontWeight={700} fontFamily="Space Grotesk">Total</text>
      <text x={cx} y={cy+12} fill={C.muted} fontSize={9} textAnchor="middle" fontFamily="Space Mono">{total.toFixed(0)}</text>
      {arcs.map((arc,i)=>(
        <g key={i}>
          <rect x={240} y={i*28+20} width={12} height={12} fill={arc.color} rx={3}/>
          <text x={258} y={i*28+31} fill={C.text} fontSize={10} fontFamily="Space Grotesk">{arc.label} ({arc.pct}%)</text>
        </g>
      ))}
    </svg>
  );
}

function LineChart({ data, xKey, yKey, color=C.cyan }) {
  const sorted = [...data].sort((a,b)=>a[xKey]-b[xKey]);
  const xs=sorted.map(d=>d[xKey]), ys=sorted.map(d=>d[yKey]);
  const xMin=Math.min(...xs),xMax=Math.max(...xs),yMin=Math.min(...ys),yMax=Math.max(...ys);
  const W=520,H=260,pL=50,pB=52,pT=16,pR=12;
  const px = x => pL+(x-xMin)/(xMax-xMin||1)*(W-pL-pR);
  const py = y => pT+(H-pT-pB)*(1-(y-yMin)/(yMax-yMin||1));
  const pts = sorted.map(d=>`${px(d[xKey])},${py(d[yKey])}`).join(" ");
  const fillPts = `${pL},${H-pB} ${pts} ${px(xs[xs.length-1])},${H-pB}`;
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display:"block" }}>
      <defs>
        <linearGradient id="lg1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3"/>
          <stop offset="100%" stopColor={color} stopOpacity="0.02"/>
        </linearGradient>
      </defs>
      {[0,0.25,0.5,0.75,1].map(t=>{
        const y=pT+(H-pT-pB)*(1-t);
        return <g key={t}>
          <line x1={pL} x2={W-pR} y1={y} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth={1}/>
          <text x={pL-6} y={y+4} fill={C.muted} fontSize={9} textAnchor="end" fontFamily="Space Mono">{(yMin+t*(yMax-yMin)).toFixed(1)}</text>
        </g>;
      })}
      <polygon points={fillPts} fill="url(#lg1)"/>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round"/>
      {sorted.map((d,i)=>(
        <circle key={i} cx={px(d[xKey])} cy={py(d[yKey])} r={4} fill={color} stroke={C.card} strokeWidth={2}/>
      ))}
      <line x1={pL} x2={pL} y1={pT} y2={H-pB} stroke={C.border} strokeWidth={1}/>
      <line x1={pL} x2={W-pR} y1={H-pB} y2={H-pB} stroke={C.border} strokeWidth={1}/>
    </svg>
  );
}

// ═══════════════════════════════════════════
// LAYOUT: SIDEBAR + TOPBAR
// ═══════════════════════════════════════════

function Sidebar({ screen, onNav }) {
  const nav = [
    { id:"dashboard",  icon:"🗺️",  label:"Mapa" },
    { id:"lesson",     icon:"📖",  label:"Lección" },
    { id:"quiz",       icon:"❓",  label:"Quiz" },
    { id:"charts",     icon:"📊",  label:"Gráficos" },
    { id:"analysis",   icon:"🧪",  label:"Análisis" },
    { id:"pitch",      icon:"🎤",  label:"Pitch" },
    { id:"leaderboard",icon:"🏆",  label:"Ranking" },
  ];
  return (
    <div style={{ width:72, background:C.surface, borderRight:`1px solid ${C.border}`, display:"flex",
      flexDirection:"column", alignItems:"center", padding:"12px 0", gap:2, flexShrink:0, height:"100vh" }}>
      <div style={{ width:44, height:44, background:`linear-gradient(135deg,${C.purple},${C.cyan})`,
        borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:10, fontSize:22, flexShrink:0 }}>
        📊
      </div>
      <div style={{ width:36, height:1, background:C.border, margin:"2px 0 6px" }}/>
      {nav.map(item=>{
        const active = screen===item.id;
        return (
          <button key={item.id} onClick={()=>onNav(item.id)} title={item.label}
            style={{ width:58, height:50, border:"none", borderRadius:10, cursor:"pointer",
              background:active?`${C.purple}20`:"transparent", outline:active?`1px solid ${C.purple}40`:"none",
              display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:1, transition:"all 0.15s" }}>
            <span style={{ fontSize:17 }}>{item.icon}</span>
            <span style={{ fontSize:9, color:active?C.purple:C.muted, fontFamily:"Space Grotesk", fontWeight:700, letterSpacing:0.3 }}>{item.label}</span>
          </button>
        );
      })}
      <div style={{ flex:1 }}/>
      <div style={{ width:36, height:1, background:C.border, margin:"4px 0" }}/>
      <button onClick={()=>onNav("admin")} title="Admin Panel"
        style={{ width:58, height:50, border:"none", borderRadius:10, cursor:"pointer",
          background:screen==="admin"?`${C.yellow}20`:"transparent", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:1 }}>
        <span style={{ fontSize:17 }}>🛡️</span>
        <span style={{ fontSize:9, color:screen==="admin"?C.yellow:C.muted, fontFamily:"Space Grotesk", fontWeight:700 }}>Admin</span>
      </button>
    </div>
  );
}

function TopBar({ team, onLogout }) {
  return (
    <div style={{ height:54, background:C.surface, borderBottom:`1px solid ${C.border}`,
      display:"flex", alignItems:"center", padding:"0 20px", gap:12, flexShrink:0 }}>
      <span style={{ fontSize:22 }}>{team.avatar}</span>
      <div>
        <div style={{ color:C.text, fontWeight:700, fontSize:14, lineHeight:1.1 }}>{team.name}</div>
        <div style={{ color:C.muted, fontSize:11 }}>Fase {team.phase} · {PHASES[team.phase-1]?.name}</div>
      </div>
      <div style={{ flex:1 }}/>
      <div style={{ display:"flex", alignItems:"center", gap:6, background:`${C.yellow}15`, border:`1px solid ${C.yellow}25`, borderRadius:20, padding:"4px 12px" }}>
        <span>⚡</span>
        <span style={{ color:C.yellow, fontWeight:800, fontSize:14, fontFamily:"Space Mono" }}>{team.xp}</span>
        <span style={{ color:C.muted, fontSize:11 }}>XP</span>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:6, background:`${C.purple}15`, border:`1px solid ${C.purple}25`, borderRadius:20, padding:"4px 12px" }}>
        <span>🏆</span>
        <span style={{ color:C.purple, fontWeight:800, fontSize:14 }}>#{team.rank}</span>
      </div>
      {team.badges.map((b,i)=>(
        <span key={i} title="Badge" style={{ fontSize:20 }}>{b}</span>
      ))}
      <button onClick={onLogout} style={{ border:"none", background:`rgba(255,255,255,0.05)`,
        color:C.muted, cursor:"pointer", fontSize:18, padding:"6px 8px", borderRadius:8 }}>⚙️</button>
    </div>
  );
}

// Export everything
Object.assign(window, {
  YT_DATA, COLUMNS, PHASES, LEADERBOARD_DATA, QUIZ_QUESTIONS, LESSON_SLIDES, C,
  Btn, Card, Chip, XPPop, XPBar, Timer,
  BarChart, ScatterChart, PieChart, LineChart,
  Sidebar, TopBar,
});
