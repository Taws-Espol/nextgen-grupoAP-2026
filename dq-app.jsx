// dq-app.jsx — Main App component + mount

const DEFAULT_PHASE_THREE_PROGRESS = {
  mission: {
    missionIdx: 0,
    showQuestion: false,
    answer: "",
    feedback: null,
    earnedXP: 0,
    finished: false,
  },
  datasets: {
    search: "",
    category: "all",
    country: "all",
    sortKey: "views",
    sortDir: "desc",
    hiddenRows: [],
  },
  chart: {
    chartType: "bar",
    xAxis: null,
    yAxis: null,
    catFilter: "all",
  },
};

function cloneDefaultPhaseThreeProgress() {
  return {
    mission: { ...DEFAULT_PHASE_THREE_PROGRESS.mission },
    datasets: { ...DEFAULT_PHASE_THREE_PROGRESS.datasets, hiddenRows: [] },
    chart: { ...DEFAULT_PHASE_THREE_PROGRESS.chart },
  };
}

function loadSavedSession() {
  try {
    const raw = localStorage.getItem("dq_session_v1");
    if (!raw) return { user: null, screen: "lore", phaseOneTutorialProgress: { datasets: false, graficos: false, confirmed: false }, missionProgress: { missionIdx: 0 }, phaseThreeProgress: cloneDefaultPhaseThreeProgress() };

    const parsed = JSON.parse(raw);
    return {
      user: parsed.user || null,
      screen: parsed.screen || (parsed.user?.role === "participant" ? "mapa" : "lore"),
      phaseOneTutorialProgress: parsed.phaseOneTutorialProgress || { datasets: false, graficos: false, confirmed: false },
      missionProgress: parsed.missionProgress || { missionIdx: 0 },
      phaseThreeProgress: parsed.phaseThreeProgress || cloneDefaultPhaseThreeProgress(),
    };
  } catch {
    return { user: null, screen: "lore", phaseOneTutorialProgress: { datasets: false, graficos: false, confirmed: false }, missionProgress: { missionIdx: 0 }, phaseThreeProgress: cloneDefaultPhaseThreeProgress() };
  }
}

function App() {
  const initialSession = loadSavedSession();
  const [screen, setScreen] = useState(initialSession.screen);
  const [user, setUser] = useState(initialSession.user);
  const [wsConnected, setWsConnected] = useState(false);
  const [useLocalStorage, setUseLocalStorage] = useState(false);
  const [phaseOneTutorialProgress, setPhaseOneTutorialProgress] = useState(initialSession.phaseOneTutorialProgress);
  const [missionProgress, setMissionProgress] = useState(initialSession.missionProgress || { missionIdx: 0 });
  const [phaseThreeProgress, setPhaseThreeProgress] = useState(initialSession.phaseThreeProgress || cloneDefaultPhaseThreeProgress());
  const wsRef = useRef(null);
  const hasLoadedSessionRef = useRef(false);

  useEffect(() => {
    if (hasLoadedSessionRef.current) return;
    hasLoadedSessionRef.current = true;
    if (initialSession.user?.role === "participant") {
      setScreen(initialSession.screen || "mapa");
      setUser(initialSession.user);
      setPhaseOneTutorialProgress(initialSession.phaseOneTutorialProgress || { datasets: false, graficos: false, confirmed: false });
      setMissionProgress(initialSession.missionProgress || { missionIdx: 0 });
      setPhaseThreeProgress(initialSession.phaseThreeProgress || cloneDefaultPhaseThreeProgress());
    }
  }, []);

  useEffect(() => {
    if (!user || user.role !== "participant") return;
    localStorage.setItem("dq_session_v1", JSON.stringify({
      user,
      screen,
      phaseOneTutorialProgress,
      missionProgress,
      phaseThreeProgress,
    }));
  }, [user, screen, phaseOneTutorialProgress, missionProgress, phaseThreeProgress]);

  useEffect(() => {
    if (!user) {
      localStorage.removeItem("dq_session_v1");
    }
  }, [user]);

  const syncTeamState = (updatedTeam) => {
    setUser(prev => ({ ...prev, team: updatedTeam }));

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: "phase_complete",
        teamId: updatedTeam.id,
        newPhase: updatedTeam.phase
      }));
      return;
    }

    if (useLocalStorage) {
      const teams = JSON.parse(localStorage.getItem("dq_teams") || "[]");
      const updated = teams.map(t => t.id === updatedTeam.id ? updatedTeam : t);
      localStorage.setItem("dq_teams", JSON.stringify(updated));
    }
  };

  const advanceParticipantPhase = (xpEarned) => {
    if (user?.role !== "participant") return;
    const updatedTeam = { ...user.team, phase: Math.min(5, user.team.phase + 1), xp: (user.team.xp || 0) + (xpEarned || 0) };
    syncTeamState(updatedTeam);
    setMissionProgress({ missionIdx: 0 });
    setPhaseThreeProgress(cloneDefaultPhaseThreeProgress());
    setScreen("mapa");
  };

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
    setMissionProgress({ missionIdx: 0 });
    setPhaseThreeProgress(cloneDefaultPhaseThreeProgress());
    
    // Guardar en localStorage como backup
    const teams = JSON.parse(localStorage.getItem("dq_teams") || "[]");
    teams.push(newTeam);
    localStorage.setItem("dq_teams", JSON.stringify(teams));
    localStorage.setItem("dq_session_v1", JSON.stringify({
      user: { role: "participant", team: newTeam },
      screen: "mapa",
      phaseOneTutorialProgress: { datasets: false, graficos: false, confirmed: false },
      missionProgress: { missionIdx: 0 },
      phaseThreeProgress: cloneDefaultPhaseThreeProgress(),
    }));
    
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

      advanceParticipantPhase(100);
    }
  };

  const handleQuizComplete = (xpEarned) => {
    advanceParticipantPhase(xpEarned);
  };

  const handleMissionComplete = (xpEarned) => {
    advanceParticipantPhase(xpEarned);
  };

  const handleLessonComplete = (xpEarned) => {
    advanceParticipantPhase(xpEarned);
  };

  const handlePitchComplete = (xpEarned) => {
    advanceParticipantPhase(xpEarned);
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
        case "lesson":
          return <LessonScreen onComplete={(xp) => handleLessonComplete(xp)} teamXp={team.xp} />;
        case "datasets":
          return (
            <DatasetsScreen
              tutorialMode={team.phase === 1}
              onVisit={() => setPhaseOneTutorialProgress(prev => ({ ...prev, datasets: true }))}
              onBackToMap={() => setScreen("mapa")}
              phaseThreeActive={team.phase === 3}
              onBackToMission={() => setScreen("analysis")}
              initialProgress={phaseThreeProgress.datasets}
              onProgress={(nextProgress) => setPhaseThreeProgress(prev => ({ ...prev, datasets: nextProgress }))}
            />
          );
        case "graficos":
        case "charts":
          return (
            <ChartEditorScreen
              freeMode={false}
              tutorialMode={team.phase === 1}
              onVisit={() => setPhaseOneTutorialProgress(prev => ({ ...prev, graficos: true }))}
              onBackToMap={() => setScreen("mapa")}
              phaseThreeActive={team.phase === 3}
              onBackToMission={() => setScreen("analysis")}
              initialProgress={phaseThreeProgress.chart}
              onProgress={(nextProgress) => setPhaseThreeProgress(prev => ({ ...prev, chart: nextProgress }))}
              onComplete={() => {}}
            />
          );
        case "quiz":
          return (
            <QuizScreen onComplete={(xp) => handleQuizComplete(xp)} />
          );
        case "analysis":
          return (
            <MissionScreen
              team={team}
              initialMissionIdx={missionProgress.missionIdx || 0}
              initialProgress={phaseThreeProgress.mission}
              onMissionProgress={(nextMissionProgress) => setMissionProgress(nextMissionProgress)}
              onProgress={(nextProgress) => setPhaseThreeProgress(prev => ({ ...prev, mission: nextProgress }))}
              onComplete={(xp) => handleMissionComplete(xp)}
              onNav={setScreen}
            />
          );
        case "pitch":
          return (
            <PitchBuilderScreen team={team} onComplete={(xp) => handlePitchComplete(xp)} />
          );
        case "leaderboard":
          return <LeaderboardScreen />;
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
