// server.js - WebSocket Server for DataQuest WiDS (Kahoot-style real-time)

const WebSocket = require("ws");
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const server = http.createServer((req, res) => {
  // Serve static files
  let filePath = "." + req.url;
  if (filePath === "./") filePath = "./DataQuest WiDS.html";
  
  const extname = String(path.extname(filePath)).toLowerCase();
  const mimeTypes = {
    ".html": "text/html",
    ".jsx": "text/javascript",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml"
  };

  const contentType = mimeTypes[extname] || "application/octet-stream";

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === "ENOENT") {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end("<h1>404 Not Found</h1>", "utf-8");
      } else {
        res.writeHead(500);
        res.end("Sorry, check with the site admin for error: " + error.code + " ..\n");
      }
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf-8");
    }
  });
});

const wss = new WebSocket.Server({ server });

// ═══════════════════════════════════════════
// STATE MANAGEMENT
// ═══════════════════════════════════════════
const state = {
  teams: new Map(), // teamId -> { id, name, avatar, members, phase, xp, connected: true|false }
  admins: new Set(), // adminId connections
  participants: new Map(), // teamId -> ws connection
};

// ═══════════════════════════════════════════
// WEBSOCKET HANDLERS
// ═══════════════════════════════════════════
wss.on("connection", (ws) => {
  let userId = null;
  let userRole = null;
  let teamId = null;

  console.log("New WebSocket connection");

  ws.on("message", (data) => {
    try {
      const message = JSON.parse(data);
      
      switch (message.type) {
        // ─── PARTICIPANT: Register/Join ────
        case "join_participant":
          userRole = "participant";
          teamId = message.teamId;
          userId = `participant_${teamId}`;
          
          // Store participant connection
          state.participants.set(teamId, ws);
          
          // Add or update team
          const teamData = message.team;
          teamData.connected = true;
          state.teams.set(teamId, teamData);
          
          console.log(`[JOIN] Participant: ${teamData.name} (${teamId})`);
          
          // Notify all admins about new/updated team
          broadcastToAdmins({
            type: "team_update",
            team: teamData,
            action: "joined"
          });
          
          break;

        // ─── PARTICIPANT: Phase Complete ────
        case "phase_complete":
          if (userRole === "participant" && state.teams.has(teamId)) {
            const team = state.teams.get(teamId);
            team.phase = Math.min(5, team.phase + 1);
            team.xp = (team.xp || 0) + 100; // Award XP
            
            console.log(`[PHASE] ${team.name} → Phase ${team.phase} (+100 XP)`);
            
            // Broadcast to admins
            broadcastToAdmins({
              type: "phase_completed",
              team: team,
              newPhase: team.phase,
              totalXP: team.xp
            });
          }
          break;

        // ─── ADMIN: Connect ────
        case "join_admin":
          userRole = "admin";
          userId = `admin_${Date.now()}`;
          state.admins.add(ws);
          
          console.log(`[ADMIN] Connected (${userId})`);
          
          // Send current teams state to new admin
          ws.send(JSON.stringify({
            type: "teams_snapshot",
            teams: Array.from(state.teams.values())
          }));
          
          break;

        // ─── ADMIN: Request Leaderboard ────
        case "request_leaderboard":
          if (userRole === "admin") {
            const teams = Array.from(state.teams.values()).sort((a, b) => {
              if (b.phase !== a.phase) return b.phase - a.phase;
              return b.xp - a.xp;
            });
            
            ws.send(JSON.stringify({
              type: "leaderboard_update",
              teams: teams,
              timestamp: Date.now()
            }));
          }
          break;

        default:
          console.log("Unknown message type:", message.type);
      }
    } catch (err) {
      console.error("Message parse error:", err);
    }
  });

  ws.on("close", () => {
    if (userRole === "participant" && teamId) {
      const team = state.teams.get(teamId);
      if (team) {
        team.connected = false;
        console.log(`[DISCONNECT] Participant: ${team.name}`);
        
        // Notify admins
        broadcastToAdmins({
          type: "team_update",
          team: team,
          action: "disconnected"
        });
      }
      state.participants.delete(teamId);
    } else if (userRole === "admin") {
      state.admins.delete(ws);
      console.log(`[DISCONNECT] Admin: ${userId}`);
    }
  });

  ws.on("error", (err) => {
    console.error("WebSocket error:", err);
  });
});

// ═══════════════════════════════════════════
// BROADCAST FUNCTIONS
// ═══════════════════════════════════════════
function broadcastToAdmins(message) {
  const data = JSON.stringify(message);
  state.admins.forEach(adminWs => {
    if (adminWs.readyState === WebSocket.OPEN) {
      adminWs.send(data);
    }
  });
}

function broadcastToParticipants(message) {
  const data = JSON.stringify(message);
  state.participants.forEach(participantWs => {
    if (participantWs.readyState === WebSocket.OPEN) {
      participantWs.send(data);
    }
  });
}

// ═══════════════════════════════════════════
// START SERVER
// ═══════════════════════════════════════════
server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║  DataQuest WiDS WebSocket Server      ║
║  Port: ${PORT}                           ║
║  Participant: http://localhost:${PORT}   ║
║  Admin: http://localhost:${PORT}/admin   ║
╚════════════════════════════════════════╝
  `);
});
