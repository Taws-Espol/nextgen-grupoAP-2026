// dq-app.jsx — Main App component + mount

const { useState, useEffect, useRef } = React;

const PHASE_SCORE_RULES = Object.fromEntries(
  (PHASES || []).map(phase => [phase.id, phase])
);

function computePhaseXp(phaseId, rawXp = 0, elapsedMs = 0) {
  const phase = PHASE_SCORE_RULES[phaseId] || { xpReward: 200, difficulty: 1, targetMinutes: 15 };
  const baseXp = phase.xpReward || 200;
  const difficultyBonus = Math.round(baseXp * 0.12 * Math.max(0, (phase.difficulty || phaseId) - 1));
  const targetMs = Math.max(1, (phase.targetMinutes || 15) * 60 * 1000);
  const speedRatio = Math.max(0, Math.min(1, 1 - (elapsedMs / targetMs)));
  const timeBonus = Math.round(baseXp * 0.35 * speedRatio);
  const activityBonus = Math.round(rawXp * 0.75);
  return Math.max(baseXp, baseXp + difficultyBonus + timeBonus + activityBonus);
}

function getPhaseIdForScreen(screen, teamPhase) {
  if (screen === "mapa") return teamPhase === 1 ? 1 : null;
  if (screen === "lesson") return 1;
  if (screen === "quiz") return 2;
  if (screen === "analysis") return 3;
  if (screen === "correlaciones") return 4;
  if (screen === "pitch") return 5;
  return null;
}

const DEFAULT_PHASE_FOUR_PROGRESS = {
  step: 0,
  picks: {},
  pickerIdx: 0,
  xVar: null,
  yVar: null,
  votes: {},
  voterIdx: 0,
  analysisAnswers: {},
  analysisQIdx: 0,
  conclusionText: "",
  approvals: {},
  earnedXP: 0,
};

const DEFAULT_PHASE_FIVE_PROGRESS = {
  step: 0,
  selectedTheme: null,
  xVar: "views",
  yVar: "revenue",
  slides: [{ title: 'Introducción', bullets: ['Contexto / pregunta'], evidence: [] }],
  generatedCharts: [],
  earnedXP: 0,
};

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

const DEFAULT_PHASE_TWO_PROGRESS = {
  qIdx: 0,
  totalXP: 0,
  streak: 0,
  answered: false,
  feedbackType: null,
  done: false,
};

function cloneDefaultPhaseThreeProgress() {
  return {
    mission: { ...DEFAULT_PHASE_THREE_PROGRESS.mission },
    datasets: { ...DEFAULT_PHASE_THREE_PROGRESS.datasets, hiddenRows: [] },
    chart: { ...DEFAULT_PHASE_THREE_PROGRESS.chart },
  };
}

function cloneDefaultPhaseTwoProgress() {
  return { ...DEFAULT_PHASE_TWO_PROGRESS };
}

function cloneDefaultPhaseFourProgress() {
  return { ...DEFAULT_PHASE_FOUR_PROGRESS, picks: {}, votes: {}, analysisAnswers: {}, approvals: {} };
}

function cloneDefaultPhaseFiveProgress() {
  return { ...DEFAULT_PHASE_FIVE_PROGRESS, slides: [{ title: 'Introducción', bullets: ['Contexto / pregunta'], evidence: [] }], generatedCharts: [] };
}

function loadSavedSession() {
  try {
    const raw = localStorage.getItem("dq_session_v1");
    if (!raw) return { user: null, screen: "lore", phaseOneTutorialProgress: { datasets: false, graficos: false, confirmed: false }, missionProgress: { missionIdx: 0 }, phaseTwoProgress: cloneDefaultPhaseTwoProgress(), phaseThreeProgress: cloneDefaultPhaseThreeProgress(), phaseFourProgress: cloneDefaultPhaseFourProgress(), phaseFiveProgress: cloneDefaultPhaseFiveProgress() };

    const parsed = JSON.parse(raw);
    return {
      user: parsed.user || null,
      screen: parsed.screen || (parsed.user?.role === "participant" ? "mapa" : "lore"),
      phaseOneTutorialProgress: parsed.phaseOneTutorialProgress || { datasets: false, graficos: false, confirmed: false },
      missionProgress: parsed.missionProgress || { missionIdx: 0 },
      phaseTwoProgress: parsed.phaseTwoProgress || cloneDefaultPhaseTwoProgress(),
      phaseThreeProgress: parsed.phaseThreeProgress || cloneDefaultPhaseThreeProgress(),
      phaseFourProgress: parsed.phaseFourProgress || cloneDefaultPhaseFourProgress(),
      phaseFiveProgress: parsed.phaseFiveProgress || cloneDefaultPhaseFiveProgress(),
    };
  } catch {
    return { user: null, screen: "lore", phaseOneTutorialProgress: { datasets: false, graficos: false, confirmed: false }, missionProgress: { missionIdx: 0 }, phaseTwoProgress: cloneDefaultPhaseTwoProgress(), phaseThreeProgress: cloneDefaultPhaseThreeProgress(), phaseFourProgress: cloneDefaultPhaseFourProgress(), phaseFiveProgress: cloneDefaultPhaseFiveProgress() };
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
  const [phaseTwoProgress, setPhaseTwoProgress] = useState(initialSession.phaseTwoProgress || cloneDefaultPhaseTwoProgress());
  const [phaseThreeProgress, setPhaseThreeProgress] = useState(initialSession.phaseThreeProgress || cloneDefaultPhaseThreeProgress());
  const [phaseFourProgress, setPhaseFourProgress] = useState(initialSession.phaseFourProgress || cloneDefaultPhaseFourProgress());
  const [phaseFiveProgress, setPhaseFiveProgress] = useState(initialSession.phaseFiveProgress || cloneDefaultPhaseFiveProgress());
  const wsRef = useRef(null);
  const hasLoadedSessionRef = useRef(false);
  const phaseTimingRef = useRef({ phaseId: null, startedAt: Date.now() });
  const phaseCompletionLockRef = useRef(false);

  const markPhaseStart = (phaseId) => {
    if (!phaseId) return;
    if (phaseTimingRef.current.phaseId !== phaseId) {
      phaseTimingRef.current = { phaseId, startedAt: Date.now() };
    }
  };

  const getElapsedForPhase = (phaseId) => {
    if (phaseTimingRef.current.phaseId !== phaseId) return 0;
    return Math.max(0, Date.now() - phaseTimingRef.current.startedAt);
  };

  useEffect(() => {
    if (hasLoadedSessionRef.current) return;
    hasLoadedSessionRef.current = true;
    if (initialSession.user?.role === "participant") {
      setScreen(initialSession.screen || "mapa");
      setUser(initialSession.user);
      setPhaseOneTutorialProgress(initialSession.phaseOneTutorialProgress || { datasets: false, graficos: false, confirmed: false });
      setMissionProgress(initialSession.missionProgress || { missionIdx: 0 });
      setPhaseTwoProgress(initialSession.phaseTwoProgress || cloneDefaultPhaseTwoProgress());
      setPhaseThreeProgress(initialSession.phaseThreeProgress || cloneDefaultPhaseThreeProgress());
      setPhaseFourProgress(initialSession.phaseFourProgress || cloneDefaultPhaseFourProgress());
      setPhaseFiveProgress(initialSession.phaseFiveProgress || cloneDefaultPhaseFiveProgress());
    }
  }, []);

  useEffect(() => {
    if (!user || user.role !== "participant") return;
    const phaseId = getPhaseIdForScreen(screen, user.team?.phase);
    markPhaseStart(phaseId);
  }, [screen, user?.role, user?.team?.phase]);

  useEffect(() => {
    if (!user || user.role !== "participant") return;
    localStorage.setItem("dq_session_v1", JSON.stringify({
      user,
      screen,
      phaseOneTutorialProgress,
      missionProgress,
      phaseTwoProgress,
      phaseThreeProgress,
      phaseFourProgress,
      phaseFiveProgress,
    }));
  }, [user, screen, phaseOneTutorialProgress, missionProgress, phaseTwoProgress, phaseThreeProgress, phaseFourProgress, phaseFiveProgress]);

  useEffect(() => {
    if (!user) {
      localStorage.removeItem("dq_session_v1");
    }
  }, [user]);

  const syncTeamState = (updatedTeam, xpEarned = 0, extraSessionData = {}) => {
    setUser(prev => ({ ...prev, team: updatedTeam }));

    // Always save to localStorage as fallback
    const teams = JSON.parse(localStorage.getItem("dq_teams") || "[]");
    const updated = teams.map(t => t.id === updatedTeam.id ? updatedTeam : t);
    if (!updated.some(t => t.id === updatedTeam.id)) {
      updated.push(updatedTeam);
    }
    localStorage.setItem("dq_teams", JSON.stringify(updated));

    // Update session with new team data
    localStorage.setItem("dq_session_v1", JSON.stringify({
      user: { role: "participant", team: updatedTeam },
      screen: "mapa",
      phaseOneTutorialProgress,
      missionProgress,
      phaseTwoProgress,
      phaseThreeProgress,
      phaseFourProgress,
      phaseFiveProgress: extraSessionData.phaseFiveProgress || phaseFiveProgress,
    }));

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: "phase_complete",
        teamId: updatedTeam.id,
        newPhase: updatedTeam.phase,
        xpEarned,
        team: updatedTeam
      }));
    }
  };

  const advanceParticipantPhase = (xpEarned, extraTeamData = {}) => {
    if (user?.role !== "participant") return;
    const now = Date.now();
    const nextPhase = Math.min(6, user.team.phase + 1);
    const hasStartedRace = Boolean(user.team.phase1CompletedAt);
    const elapsedFromPhase1Ms = nextPhase > 1 && hasStartedRace ? Math.max(0, now - user.team.phase1CompletedAt) : (user.team.elapsedFromPhase1Ms || 0);
    const updatedTeam = {
      ...user.team,
      phase: nextPhase,
      xp: (user.team.xp || 0) + (xpEarned || 0),
      phase1CompletedAt: user.team.phase === 1 ? now : (user.team.phase1CompletedAt || null),
      elapsedFromPhase1Ms,
      raceFinishedAt: nextPhase === 6 ? now : (user.team.raceFinishedAt || null),
      ...extraTeamData,
    };
    syncTeamState(updatedTeam, xpEarned || 0);
    setMissionProgress({ missionIdx: 0 });
    setPhaseTwoProgress(cloneDefaultPhaseTwoProgress());
    setPhaseThreeProgress(cloneDefaultPhaseThreeProgress());
    setPhaseFourProgress(cloneDefaultPhaseFourProgress());
    setScreen("mapa");
  };

  const completePhaseWithScore = (phaseId, rawXp = 0, extraTeamData = {}) => {
    if (user?.role !== "participant") return;
    if ((user?.team?.phase || 0) !== phaseId) return;
    if (phaseCompletionLockRef.current) return;
    phaseCompletionLockRef.current = true;
    const elapsedMs = getElapsedForPhase(phaseId);
    const phaseXp = computePhaseXp(phaseId, rawXp, elapsedMs);
    advanceParticipantPhase(phaseXp, extraTeamData);
    setTimeout(() => {
      phaseCompletionLockRef.current = false;
    }, 600);
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
    const newTeam = { ...teamData, xp: 0, rank: 2, phase: 1, badges: [], id: Date.now(), phase1CompletedAt: null, elapsedFromPhase1Ms: 0, raceFinishedAt: null };
    setUser({ role: "participant", team: newTeam });
    setPhaseOneTutorialProgress({ datasets: false, graficos: false, confirmed: false });
    setMissionProgress({ missionIdx: 0 });
    setPhaseTwoProgress(cloneDefaultPhaseTwoProgress());
    setPhaseThreeProgress(cloneDefaultPhaseThreeProgress());
    setPhaseFourProgress(cloneDefaultPhaseFourProgress());
    setPhaseFiveProgress(cloneDefaultPhaseFiveProgress());
    
    // Guardar en localStorage como backup
    const teams = JSON.parse(localStorage.getItem("dq_teams") || "[]");
    teams.push(newTeam);
    localStorage.setItem("dq_teams", JSON.stringify(teams));
    localStorage.setItem("dq_session_v1", JSON.stringify({
      user: { role: "participant", team: newTeam },
      screen: "mapa",
      phaseOneTutorialProgress: { datasets: false, graficos: false, confirmed: false },
      missionProgress: { missionIdx: 0 },
      phaseTwoProgress: cloneDefaultPhaseTwoProgress(),
      phaseThreeProgress: cloneDefaultPhaseThreeProgress(),
      phaseFourProgress: cloneDefaultPhaseFourProgress(),
      phaseFiveProgress: cloneDefaultPhaseFiveProgress(),
    }));
    
    setScreen("mapa");
  };

  const handleAdminLogin = () => {
    // Redirect to admin panel
    window.location.href = "/admin.html";
  };

  const completePhase = () => {
    if (user?.role === "participant") {
      // Completa la fase activa del equipo (no fija solo la fase 1)
      const currentPhase = (user.team && user.team.phase) ? user.team.phase : 1;
      completePhaseWithScore(currentPhase, 0);
    }
  };

  const handleQuizComplete = (xpEarned) => {
    completePhaseWithScore(2, xpEarned);
  };

  const handleMissionComplete = (xpEarned) => {
    completePhaseWithScore(3, xpEarned);
  };

  const handleCorrelacionesComplete = (xpEarned) => {
    completePhaseWithScore(4, xpEarned);
  };

  const handleLessonComplete = (xpEarned) => {
    completePhaseWithScore(1, xpEarned);
  };

  const handlePitchComplete = (result) => {
    if (typeof result === "number") {
      completePhaseWithScore(5, result);
      return;
    }
    const xpEarned = Number(result?.xp || 0);
    completePhaseWithScore(5, xpEarned, {
      pitchSummary: result?.pitchSummary || null,
      phaseFiveProgress: result?.phaseFiveProgress || phaseFiveProgress,
    });
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
              onBackToSummary={() => setScreen("resumen")}
              phaseThreeActive={team.phase === 3}
              onBackToMission={() => setScreen("analysis")}
              initialProgress={phaseThreeProgress.datasets}
                phaseFiveSubmitted={Boolean(phaseFiveProgress?.submitted)}
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
              onBackToSummary={() => setScreen("resumen")}
              phaseThreeActive={team.phase === 3}
              onBackToMission={() => setScreen("analysis")}
              initialProgress={phaseThreeProgress.chart}
                phaseFiveSubmitted={Boolean(phaseFiveProgress?.submitted)}
              onProgress={(nextProgress) => setPhaseThreeProgress(prev => ({ ...prev, chart: nextProgress }))}
              onComplete={() => {}}
            />
          );
        case "quiz":
          return (
            <QuizScreen
              initialProgress={phaseTwoProgress}
              onProgress={(nextProgress) => setPhaseTwoProgress(prev => ({ ...prev, ...nextProgress }))}
              onComplete={(xp) => handleQuizComplete(xp)}
              autoAdvance={true}
            />
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
        case "correlaciones":
          return (
            <CorrelacionesScreen
              team={team}
              initialProgress={phaseFourProgress}
              onProgress={(p) => setPhaseFourProgress(p)}
              onComplete={(xp) => handleCorrelacionesComplete(xp)}
            />
          );
        case "pitch":
          return (
            <ResearchLabScreen
              team={team}
              initialProgress={phaseFiveProgress}
              onProgress={(p) => setPhaseFiveProgress(p)}
              onComplete={(xp) => handlePitchComplete(xp)}
              onNav={setScreen}
            />
          );
        case "resumen":
          return <FinalScreen team={team} onNav={setScreen} />;
        case "resumen-slides":
          return (
            <ResearchLabScreen
              team={team}
              initialProgress={phaseFiveProgress}
              onNav={setScreen}
              viewOnly={true}
            />
          );
        case "leaderboard":
          return <LeaderboardScreen />;
        case "mapa":
          if (team.phase >= 6) return <FinalScreen team={team} onNav={setScreen} />;
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
        <Sidebar screen={screen} onNav={setScreen} hideMap={team.phase >= 6} />

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
