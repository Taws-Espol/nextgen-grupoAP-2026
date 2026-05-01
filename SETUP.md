# DataQuest WiDS - Setup & Troubleshooting

## 🚀 Inicio Rápido

### Opción 1: Sin Server (Desarrollo Local)

Simplemente abre `DataQuest WiDS.html` en el navegador. La app funcionará en modo local con `localStorage`.

**Características en modo local:**
- ✅ Participantes pueden jugar normalmente
- ✅ Datos persistentes en localStorage
- ✅ Admin dashboard verá datos locales
- ⚠️ Sin sincronización en tiempo real entre tabs

**Acceso:**
```
http://localhost:3000         → App Participante
http://localhost:3000/admin.html  → Dashboard Admin
```

---

### Opción 2: Con Server WebSocket (Completo)

Para tener **real-time leaderboard** y múltiples jugadores simultáneos:

#### Paso 1: Instalar dependencias
```bash
cd /workspaces/nextgenGrupAP-TAWS
npm install
```

#### Paso 2: Iniciar servidor
```bash
npm start
```

Verás:
```
╔════════════════════════════════════════╗
║  DataQuest WiDS WebSocket Server      ║
║  Port: 3000                           ║
║  Participant: http://localhost:3000   ║
║  Admin: http://localhost:3000/admin   ║
╚════════════════════════════════════════╝
```

#### Paso 3: Abrir en navegador
- **Participante**: http://localhost:3000
- **Admin**: http://localhost:3000/admin.html

---

## 🔧 Troubleshooting

### Error: "WebSocket connection failed"

**Causa:** El servidor Node.js no está corriendo.

**Solución:**
```bash
# En una terminal, ejecutar:
npm install
npm start

# Luego refrescar el navegador
```

**Fallback Automático:**
La app detecta automáticamente si WebSocket no está disponible y cambia a modo **localStorage** sin errores críticos.

---

### Error: "SyntaxError: Unexpected token 'export'"

**Causa:** Problema con importación ES6 en archivo específico.

**Solución:** No es problema nuestro, probablemente es extensión del navegador. Ignorar o:
```javascript
// En DevTools console:
localStorage.clear()
location.reload()
```

---

### Admin dashboard muestra "💾 Local"

**Significa:** El admin está en modo localStorage (sin WebSocket).

**Opciones:**
1. Iniciar servidor WebSocket: `npm start`
2. Continuar en modo local (funciona bien para testing local)

---

## 📊 Modos de Funcionamiento

### Modo 1: Local (Sin Server)
```
┌─────────────────────────────────┐
│  Browser Local Storage            │
│  ├─ Participante App              │
│  ├─ Admin Dashboard               │
│  └─ Datos persistentes (localStorage) │
└─────────────────────────────────┘
```

**Ventajas:**
- No requiere servidor
- Datos persistentes en browser
- Funciona offline

**Limitaciones:**
- Sin sync real-time
- 1 solo dispositivo
- Admin ve solo datos locales

---

### Modo 2: WebSocket (Con Server)
```
┌──────────────────┐
│  Node.js Server  │
│  ├─ WebSocket    │
│  └─ State Manager│
└────────┬─────────┘
         │
    ┌────┴────┐
    │          │
┌───▼──┐    ┌──▼──┐
│ Part │    │Admin │
│  App │    │ App  │
└──────┘    └──────┘
```

**Ventajas:**
- Real-time leaderboard
- Múltiples jugadores simultáneos
- Admin ve updates en vivo
- Escalable

**Requisitos:**
- Node.js ≥ 14.0.0
- npm
- `npm install` una sola vez

---

## 📝 Flujos de Uso

### Testing Local (Sin Server)
```bash
# 1. Abrir navegador
# 2. Ir a: file:///path/to/DataQuest%20WiDS.html
# 3. Jugar como participante
# 4. Abrir nueva tab: file:///path/to/admin.html
# 5. Ver datos en admin dashboard (actualizados con F5)
```

### Testing Completo (Con Server)
```bash
# Terminal 1
npm start
# → Server listening on port 3000

# Terminal 2 (o browser)
# Abrir http://localhost:3000         (Participante)
# Abrir http://localhost:3000/admin.html (Admin)
# Jugar, ver updates en tiempo real
```

### Testing Kahoot-Style (Múltiples Equipos)
```bash
# 1. Terminal: npm start (servidor)
# 2. Browser Tab 1: http://localhost:3000
#    → Registrar equipo "Alpha"
#    → Completar algunas fases
# 3. Browser Tab 2: http://localhost:3000
#    → Registrar equipo "Beta"
#    → Completar fases diferentes
# 4. Browser Tab 3: http://localhost:3000/admin.html
#    → Ver leaderboard actualizado en tiempo real
#    → Ver ambos equipos competiendo
```

---

## ✅ Checklist de Ejecución

### Local (Sin Server)
- [ ] Abrir DataQuest WiDS.html
- [ ] Aparecer pantalla de Lore
- [ ] Elegir Participante
- [ ] Registrarse correctamente
- [ ] Ver mapa de 5 fases
- [ ] Abrir admin.html en otra tab
- [ ] Admin muestra "💾 Local"
- [ ] Datos persisten (F5)

### Con Server
- [ ] `npm install` sin errores
- [ ] `npm start` → server escucha port 3000
- [ ] http://localhost:3000 carga
- [ ] http://localhost:3000/admin.html carga
- [ ] Registrar participante → WebSocket conecta
- [ ] Admin muestra "🌐 WebSocket"
- [ ] Completar fase → leaderboard actualiza
- [ ] Cerrar tab participante → admin ve offline

---

## 🐛 Debug Mode

### Logs del Cliente
```javascript
// En DevTools → Console:
localStorage.getItem("dq_teams")     // Ver teams guardados
localStorage.clear()                 // Limpiar datos
location.reload()                    // Refrescar
```

### Logs del Servidor
```bash
# El servidor imprime eventos:
[JOIN] Participant: Data Detectives (123456789)
[PHASE] Data Detectives → Phase 2 (+100 XP)
[DISCONNECT] Admin: admin_123456789
```

---

## 🌐 Deployment

### GitHub Codespaces (Como está ahora)

En Codespaces, el puerto puede cambiar. Usar:
- **Ports** tab para ver URL pública
- WebSocket necesitará `wss://` (Secure)

### Heroku Deploy

```bash
git push heroku main
```

Configurar `Procfile`:
```
web: node server.js
```

### Vercel / Netlify (Frontend solo)

1. Copiar archivos (sin server.js)
2. Configurar CORS para WebSocket remoto
3. Apuntar a servidor backend externo

---

## 📞 Soporte Rápido

| Problema | Solución |
|----------|----------|
| WebSocket error | `npm start` en terminal |
| Datos desaparecen | Guardados en localStorage automáticamente |
| Admin offline | Iniciar servidor o usar localStorage |
| Performance lento | Refrescar F5 |
| Múltiples tabs | Usar modo servidor para sync |

---

## 🎯 Recomendación

**Para desarrollo local:** Usar modo sin servidor (más rápido)  
**Para testing Kahoot:** Usar modo con servidor (múltiples tabs)  
**Para producción:** Deploying en cloud con servidor

---

**Última actualización: Mayo 2026** ✨
