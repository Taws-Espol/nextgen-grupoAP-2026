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

function getRaceElapsedMs(team) {
  if (!team || !team.phase1CompletedAt) return Number.POSITIVE_INFINITY;
  if (team.raceFinishedAt) return Number(team.elapsedFromPhase1Ms || 0);
  if (team.elapsedFromPhase1Ms && team.phase >= 2) return Number(team.elapsedFromPhase1Ms || 0);
  return Math.max(0, Date.now() - Number(team.phase1CompletedAt || Date.now()));
}

function sortTeamsForLeaderboard(teams) {
  return [...teams].sort((a, b) => {
    if ((b.phase || 0) !== (a.phase || 0)) return (b.phase || 0) - (a.phase || 0);
    if ((b.xp || 0) !== (a.xp || 0)) return (b.xp || 0) - (a.xp || 0);
    return getRaceElapsedMs(a) - getRaceElapsedMs(b);
  });
}

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
            const xpEarned = Number(message.xpEarned || 0);

            team.phase = Math.min(5, message.newPhase || (team.phase + 1));
            if (message.team) {
              Object.assign(team, message.team);
            }
            team.xp = Number((message.team && message.team.xp) || team.xp || 0);
            
            console.log(`[PHASE] ${team.name} → Phase ${team.phase} (+${xpEarned || 0} XP)`);
            
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
            const teams = sortTeamsForLeaderboard(Array.from(state.teams.values()));
            
            ws.send(JSON.stringify({
              type: "leaderboard_update",
              teams: teams,
              timestamp: Date.now()
            }));
          }
          break;

        // ─── ADMIN: Delete single team ────
        case "admin_delete_team":
          if (userRole === "admin") {
            const delId = message.teamId;
            if (state.teams.has(delId)) {
              const t = state.teams.get(delId);
              state.teams.delete(delId);

              // notify participant (if connected) and close their socket
              if (state.participants.has(delId)) {
                try {
                  const pws = state.participants.get(delId);
                  if (pws && pws.readyState === WebSocket.OPEN) {
                    pws.send(JSON.stringify({ type: "kicked", reason: "deleted_by_admin" }));
                    pws.close();
                  }
                } catch (e) { /* ignore */ }
                state.participants.delete(delId);
              }

              // broadcast deletion to all admins
              broadcastToAdmins({ type: "team_deleted", teamId: delId });

              // broadcast updated snapshot
              broadcastToAdmins({ type: "teams_snapshot", teams: Array.from(state.teams.values()) });
              console.log(`[ADMIN] Deleted team ${delId} (${t.name})`);
            }
          }
          break;

        // ─── ADMIN: Reset all teams ────
        case "admin_reset_all":
          if (userRole === "admin") {
            // notify and close all participant sockets
            state.participants.forEach((pws, pid) => {
              try {
                if (pws && pws.readyState === WebSocket.OPEN) {
                  pws.send(JSON.stringify({ type: "kicked", reason: "reset_by_admin" }));
                  pws.close();
                }
              } catch (e) { /* ignore */ }
            });

            state.participants.clear();
            state.teams.clear();

            // notify admins
            broadcastToAdmins({ type: "teams_cleared" });
            broadcastToAdmins({ type: "teams_snapshot", teams: [] });
            console.log(`[ADMIN] Reset all teams`);
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
