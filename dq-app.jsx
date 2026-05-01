// dq-app.jsx — Main App component + mount

function App() {
  const [screen, setScreen] = useState("login");
  const [team, setTeam] = useState(null);
  const [bigLeaderboard, setBigLeaderboard] = useState(false);
  const [showXP, setShowXP] = useState(null);

  const handleLogin = (teamData) => {
    setTeam({ ...teamData, xp: 0, rank: 2, phase: 1, badges: [] });
    setScreen("dashboard");
  };

  const gainXP = (amount, badge = null) => {
    setTeam(prev => {
      const next = { ...prev, xp: prev.xp + amount };
      if (badge) next.badges = [...prev.badges, badge];
      return next;
    });
    setShowXP(amount);
  };

  const advancePhase = () => {
    setTeam(prev => ({ ...prev, phase: Math.min(5, prev.phase + 1) }));
  };

  const handleComplete = (xp, badge) => {
    gainXP(xp, badge);
    advancePhase();
    setTimeout(() => setScreen("dashboard"), 1800);
  };

  if (!team) return <LoginScreen onLogin={handleLogin} />;

  // Big leaderboard overlay (projector mode)
  if (bigLeaderboard) return (
    <div style={{ width: "100%", height: "100vh", background: C.bg, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <LeaderboardScreen bigMode={true} onToggleBig={() => setBigLeaderboard(false)} />
    </div>
  );

  const renderScreen = () => {
    switch (screen) {
      case "dashboard":   return <DashboardScreen team={team} onNav={setScreen} onPhaseSelect={(p) => { setTeam(prev => ({ ...prev, phase: Math.max(prev.phase, p) })); setScreen(["","lesson","charts","analysis","pitch","leaderboard"][p]); }} />;
      case "lesson":      return <LessonScreen onComplete={(xp) => handleComplete(xp, "📖")} teamXp={team.xp} />;
      case "quiz":        return <QuizScreen onComplete={(xp) => handleComplete(xp, "🎯")} />;
      case "charts":      return <ChartEditorScreen onComplete={(xp) => gainXP(xp)} freeMode={false} />;
      case "analysis":    return <ChartEditorScreen onComplete={(xp) => gainXP(xp)} freeMode={true} />;
      case "pitch":       return <PitchBuilderScreen team={team} onComplete={(xp) => handleComplete(xp, "🎤")} />;
      case "leaderboard": return <LeaderboardScreen bigMode={false} onToggleBig={() => setBigLeaderboard(true)} />;
      case "admin":       return <AdminScreen />;
      default:            return <DashboardScreen team={team} onNav={setScreen} onPhaseSelect={() => {}} />;
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: C.bg }}>
      {showXP && <XPPop amount={showXP} onDone={() => setShowXP(null)} />}

      {/* Sidebar */}
      <Sidebar screen={screen} onNav={setScreen} />

      {/* Main area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <TopBar team={team} onLogout={() => { setTeam(null); setScreen("login"); }} />

        {/* Content */}
        <div className="fade-in" key={screen} style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {renderScreen()}
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
