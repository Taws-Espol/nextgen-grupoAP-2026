// dq-app.jsx — Main App component + mount

function App() {
  const [screen, setScreen] = useState("lore");
  const [user, setUser] = useState(null);
  const [wsConnected, setWsConnected] = useState(false);
  const [useLocalStorage, setUseLocalStorage] = useState(false);
  const [phaseOneTutorialProgress, setPhaseOneTutorialProgress] = useState({ datasets: false, graficos: false, confirmed: false });
  const wsRef = useRef(null);

  // WebSocket Connection (with localStorage fallback)
  useEffect(() => {
    if (!user || user.role !== "participant") return;

    // Try to connect to WebSocket
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}`;
    
    console.log("Intentando conectar a WebSocket:", wsUrl);
    
    let ws;
    try {
      ws = new WebSocket(wsUrl);
    } catch (err) {
      console.warn("WebSocket no disponible, usando localStorage");
      setUseLocalStorage(true);
      return;
    }
    
    const timeout = setTimeout(() => {
      if (ws.readyState !== WebSocket.OPEN) {
        console.warn("WebSocket timeout, usando localStorage como fallback");
        setUseLocalStorage(true);
        ws.close();
      }
    }, 3000);
    
    ws.onopen = () => {
      clearTimeout(timeout);
      console.log("✓ WebSocket conectado");
      setWsConnected(true);
      setUseLocalStorage(false);
      
      // Send join message with team data
      ws.send(JSON.stringify({
        type: "join_participant",
        teamId: user.team.id,
        team: user.team
      }));
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log("Mensaje recibido:", message.type);
      } catch (err) {
        console.error("Parse error:", err);
      }
    };

    ws.onerror = (err) => {
      clearTimeout(timeout);
      console.warn("WebSocket error, activando localStorage:", err);
      setWsConnected(false);
      setUseLocalStorage(true);
    };

    ws.onclose = () => {
      clearTimeout(timeout);
      console.log("WebSocket desconectado");
      setWsConnected(false);
      // No necesariamente activar localStorage aquí, dejar al user decidir
    };

    wsRef.current = ws;
    
    return () => {
      clearTimeout(timeout);
      if (ws && ws.readyState === WebSocket.OPEN) ws.close();
    };
  }, [user?.role]);

  const handleParticipantLogin = (teamData) => {
    const newTeam = { ...teamData, xp: 0, rank: 2, phase: 1, badges: [], id: Date.now() };
    setUser({ role: "participant", team: newTeam });
    setPhaseOneTutorialProgress({ datasets: false, graficos: false, confirmed: false });
    
    // Guardar en localStorage como backup
    const teams = JSON.parse(localStorage.getItem("dq_teams") || "[]");
    teams.push(newTeam);
    localStorage.setItem("dq_teams", JSON.stringify(teams));
    
    setScreen("mapa");
  };

  const handleAdminLogin = () => {
    // Redirect to admin panel
    window.location.href = "/admin.html";
  };

  const completePhase = () => {
    if (user?.role === "participant") {
      const needsTutorial = user.team.phase === 1;
      const tutorialReady = phaseOneTutorialProgress.datasets && phaseOneTutorialProgress.graficos && phaseOneTutorialProgress.confirmed;

      if (needsTutorial && !tutorialReady) {
        console.warn("Fase 1 bloqueada: abre DATASETS y GRAFICOS primero");
        return;
      }

      const updatedTeam = { ...user.team, phase: Math.min(5, user.team.phase + 1), xp: (user.team.xp || 0) + 100 };
      setUser(prev => ({ ...prev, team: updatedTeam }));
      
      // Try WebSocket first
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: "phase_complete",
          teamId: user.team.id,
          newPhase: updatedTeam.phase
        }));
        console.log("✓ Phase complete enviado via WebSocket");
      } else if (useLocalStorage) {
        // Fallback a localStorage
        const teams = JSON.parse(localStorage.getItem("dq_teams") || "[]");
        const updated = teams.map(t => t.id === updatedTeam.id ? updatedTeam : t);
        localStorage.setItem("dq_teams", JSON.stringify(updated));
        console.log("✓ Phase complete guardado en localStorage");
      }
    }
  };

  if (!user) {
    if (screen === "lore") return <LoreScreen onStart={() => setScreen("login")} />;
    return <LoginScreen onParticipantLogin={handleParticipantLogin} onAdminLogin={handleAdminLogin} />;
  }

  // Participant view
  if (user.role === "participant") {
    const team = user.team;
    const phaseOneTutorialReady = team.phase > 1 || (phaseOneTutorialProgress.datasets && phaseOneTutorialProgress.graficos && phaseOneTutorialProgress.confirmed);
    
    const renderParticipantScreen = () => {
      switch (screen) {
        case "datasets":
          return (
            <DatasetsScreen
              tutorialMode={team.phase === 1}
              onVisit={() => setPhaseOneTutorialProgress(prev => ({ ...prev, datasets: true }))}
              onBackToMap={() => setScreen("mapa")}
            />
          );
        case "graficos":
          return (
            <ChartEditorScreen
              freeMode={false}
              tutorialMode={team.phase === 1}
              onVisit={() => setPhaseOneTutorialProgress(prev => ({ ...prev, graficos: true }))}
              onBackToMap={() => setScreen("mapa")}
              onComplete={() => {}}
            />
          );
        case "mapa":
        default:
          return (
            <MapaScreen
              team={team}
              onNav={setScreen}
              onPhaseComplete={completePhase}
              phaseOneTutorialReady={phaseOneTutorialReady}
              phaseOneTutorialProgress={phaseOneTutorialProgress}
              onConfirmPhaseOneTutorial={() => setPhaseOneTutorialProgress(prev => ({ ...prev, confirmed: true }))}
            />
          );
      }
    };

    return (
      <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: C.bg }}>
        {/* Sidebar */}
        <Sidebar screen={screen} onNav={setScreen} />

        {/* Main area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <TopBar team={team} screen={screen} onLogout={() => { setUser(null); setScreen("lore"); }} />

          {/* Content */}
          <div className="fade-in" key={screen} style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            {renderParticipantScreen()}
          </div>
        </div>
      </div>
    );
  }

}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
