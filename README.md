# DataQuest WiDS — Real-Time Collaborative Data Analysis Platform

🎮 Plataforma gamificada **estilo Kahoot** para análisis colaborativo de datos, con **arquitectura WebSocket** para dashboards en tiempo real.

## 🏗️ Arquitectura

### Rutas
- **Participante**: `http://localhost:3000/` → Flujo de análisis de datos (5 fases)
- **Administrador**: `http://localhost:3000/admin.html` → Leaderboard en tiempo real

### Tecnología
- **Frontend**: React 18 + Babel (compilación en navegador)
- **Backend**: Node.js + WebSocket (ws)
- **Comunicación**: Protocolo JSON bidireccional en tiempo real

## 🚀 Instalación & Ejecución

### Requisitos
- Node.js ≥ 14.0.0
- npm

### Pasos

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor WebSocket
npm start

# 3. Abrir en navegador
# Participante: http://localhost:3000
# Admin: http://localhost:3000/admin.html
```

El servidor iniciará en **puerto 3000** y escuchará conexiones WebSocket.

## 📊 Flujo de Aplicación

### Participante 🧑‍💻
1. **Lore Screen** → Briefing de la misión TawsTube
2. **Login Screen** → Seleccionar rol (Participante/Admin)
3. **Registro** → Nombre equipo → Integrantes → Avatar
4. **Mapa de Fases** → 5 fases de análisis de datos
   - Fase 1: Explorar Dataset
   - Fase 2: Encontrar Patrones
   - Fase 3: Analizar Categorías
   - Fase 4: Descubrir Correlaciones
   - Fase 5: Presentar Hallazgos
5. **Modules** → DATASETS (tabla + filtros) | GRAFICOS (visualizaciones)

### Administrador 🛡️
1. **Login Screen** → Elegir "Administrador"
2. **Ingresar Contraseña** (cualquier texto ≥4 caracteres)
3. **Leaderboard en Vivo** → Ranking actualizado en tiempo real
   - 🥇 Ranking por fase completada y XP
   - 📊 Estadísticas: equipos totales, conectados, completados
   - 👁️ Cards expandibles con detalles por equipo
   - ● Indicadores de conexión en vivo

## 📡 Protocolo WebSocket

### Mensajes Participante → Servidor

#### 1. Unirse (Join)
```json
{
  "type": "join_participant",
  "teamId": 1714563847123,
  "team": {
    "id": 1714563847123,
    "name": "Data Detectives",
    "avatar": "🚀",
    "members": ["Alice", "Bob"],
    "phase": 1,
    "xp": 0,
    "connected": true
  }
}
```

#### 2. Completar Fase
```json
{
  "type": "phase_complete",
  "teamId": 1714563847123,
  "newPhase": 2
}
```

### Mensajes Administrador → Servidor

#### 1. Conectarse como Admin
```json
{
  "type": "join_admin"
}
```

#### 2. Solicitar Leaderboard
```json
{
  "type": "request_leaderboard"
}
```

### Mensajes Servidor → Clientes

#### Snapshot Inicial (para Admin)
```json
{
  "type": "teams_snapshot",
  "teams": [
    {
      "id": 1714563847123,
      "name": "Data Detectives",
      "avatar": "🚀",
      "members": ["Alice", "Bob"],
      "phase": 1,
      "xp": 100,
      "connected": true
    }
  ]
}
```

#### Actualización de Equipo
```json
{
  "type": "team_update",
  "team": { ... },
  "action": "joined"|"disconnected"
}
```

#### Fase Completada
```json
{
  "type": "phase_completed",
  "team": { ... },
  "newPhase": 2,
  "totalXP": 100
}
```

#### Update Leaderboard
```json
{
  "type": "leaderboard_update",
  "teams": [ ... ],
  "timestamp": 1714563847123
}
```

## 📁 Estructura de Archivos

```
/
├── server.js              # WebSocket server (Node.js)
├── package.json           # Dependencias
├── index.html             # Redirect → DataQuest WiDS.html
├── DataQuest WiDS.html    # App Participante (HTML)
├── admin.html             # App Admin (HTML)
├── dq-app.jsx             # Main component (Participant)
├── dq-screens.jsx         # UI screens (Lore, Login, Mapa, etc)
├── dq-core.jsx            # Utilities & Layout (Sidebar, TopBar, etc)
└── README.md              # Este archivo
```

## 🎯 Features de Kahoot

✅ **Real-Time Updates** — Leaderboard actualiza instantáneamente  
✅ **Live Feedback** — Admin ve progreso de equipos en vivo  
✅ **Connection Status** — Indicadores de conexión por equipo  
✅ **Phase Progression** — Equipos avanzan en sincronía  
✅ **XP Rewards** — +100 XP por fase completada  

## 🔒 Seguridad (Básica)

- Admin solo requiere contraseña mínima (4 caracteres) para demo
- Teams se identifican por ID único (timestamp)
- Conexión WebSocket se cierra on disconnect

## 🛠️ Desarrollo

### Logs del Servidor
```
[JOIN] Participant: Data Detectives (1714563847123)
[PHASE] Data Detectives → Phase 2 (+100 XP)
[DISCONNECT] Admin: admin_1714563847500
```

### Debugging Admin
- Abrir DevTools → Network tab → WS filter
- Ver mensajes enviados/recibidos en tiempo real

## 📝 Próximas Mejoras

- [ ] Base de datos persistente (MongoDB/PostgreSQL)
- [ ] Verificación real de contraseña admin
- [ ] Sistema de puntos por análisis
- [ ] Chat en vivo entre admin y participantes
- [ ] Exportar resultados finales
- [ ] Animations party cuando completar fase

## 📄 Licencia

MIT License - WiDS 2026

---

**v1.0** — Mayo 2026 — Real-time WebSocket Architecture ✨
