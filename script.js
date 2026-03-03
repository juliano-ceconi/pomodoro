// Game State
let gameState = {
  xp: 0,
  level: 0,
  missions: [
    {
      id: 1,
      text: "Completar 4 Pomodoros",
      completed: false,
      xp: 0, 
      bonusXp: 200, 
      currentProgress: 0,
      targetProgress: 4,
    },
    {
      id: 2,
      text: "Ler 1 capítulo de um livro",
      completed: false,
      xp: 500,
    },
    { id: 3, text: "Meditar por 2 min (mínimo)", completed: false, xp: 100 },
    {
      id: 4,
      text: "Beber 500ml de água",
      completed: false,
      xp: 100, 
      bonusXp: 200, 
      currentProgress: 0,
      targetProgress: 4,
    },
    { id: 5, text: "Arrumar 5 coisas", completed: false, xp: 200 },
    { id: 6, text: "Exercício físico 2 min (mínimo)", completed: false, xp: 500 },
  ],

  streak: 0,
  lastLogin: null,
  agentMode: false,
};

// Config
const XP_PER_MINUTE = 4;
let currentFocusTime = 25;
let currentBreakTime = 5;
const LEVELS = [
  { name: "Iniciante", xp: 0 },
  { name: "Leitora Iniciante", xp: 18 },
  { name: "Ouvinte Curiosa", xp: 103 },
  { name: "Admiradora de Gatos", xp: 284 },
  { name: "Aprendiz de Arya", xp: 583 },
  { name: "Iniciada do Norte", xp: 1017 },
  { name: "Garota de Winterfell", xp: 1600 },
  { name: "Devoradora de Livros", xp: 2361 },
  { name: "Back to Black", xp: 3314 },
  { name: "Amiga dos Cachorros", xp: 4474 },
  { name: "Mãe de Gatos", xp: 5854 },
  { name: "Stark Honorária", xp: 7465 },
  { name: "Entusiasta de Rock", xp: 9320 },
  { name: "Colecionadora de Vinil", xp: 11432 },
  { name: "Senhora de Rochedo Casterly", xp: 13812 },
  { name: "Defensora do Norte", xp: 16471 },
  { name: "Alma do Rock n Roll", xp: 19419 },
  { name: "Guardiã da Biblioteca", xp: 22668 },
  { name: "Eternamente Amy", xp: 26226 },
  { name: "Sussurradora de Animais", xp: 30105 },
  { name: "Membro da Patrulha da Noite", xp: 34313 },
  { name: "Californication", xp: 38861 },
  { name: "Crítica Literária", xp: 43758 },
  { name: "Valar Dohaeris", xp: 49013 },
  { name: "Valar Morghulis", xp: 54635 },
  { name: "Musa do Rock", xp: 60633 },
  { name: "Senhorita Targaryen", xp: 67016 },
  { name: "Mãe de Dragões", xp: 73792 },
  { name: "Protetora do Reino", xp: 80971 },
  { name: "Lenda da Guitarra", xp: 88560 },
  { name: "Rainha dos Animais", xp: 96568 },
  { name: "Bebedeira com Tyrion", xp: 105004 },
  { name: "Filósofa Literária", xp: 113875 },
  { name: "Voz de Veludo", xp: 123190 },
  { name: "Senhora dos Sete Reinos", xp: 132958 },
  { name: "Rockstar Cativante", xp: 143185 },
  { name: "A Quebradoura de Correntes", xp: 153880 },
  { name: "Rainha do Norte", xp: 165050 },
  { name: "Ícone da Literatura", xp: 176703 },
  { name: "Mito do Rock", xp: 188847 },
  { name: "Espírito Animal Maior", xp: 201490 },
  { name: "Lenda Viva", xp: 214638 },
  { name: "A Princesa Prometida", xp: 228300 },
  { name: "Poder Targaryen", xp: 242481 },
  { name: "Guardiã de Westeros", xp: 257190 },
  { name: "Deusa do Rock", xp: 272433 },
  { name: "Poetisa Eterna", xp: 288218 },
  { name: "Estrela Guia", xp: 304552 },
  { name: "Imortal da Arte", xp: 321443 },
  { name: "Rainha de Tudo", xp: 338896 },
];

const QUOTES = [
  "Um leitor vive mil vidas antes de morrer.",
  "O inverno está chegando. Termine suas tarefas.",
  "Você não sabe de nada... a menos que estude.",
  "A mente precisa de livros como uma espada precisa de uma pedra de amolar.",
  "O caos não é um abismo. O caos é uma escada.",
  "Miau. Vá focar.",
  "O medo corta mais profundo que espadas. O foco corta mais que distrações.",
  "Um leão não se preocupa com a opinião de ovelhas... nem com o Instagram.",
  "Trabalhe como um Stark, relaxe como um Lannister (só na pausa!).",
  "O Norte se lembra... que você deixou essa tarefa para depois ontem.",
  "Sob pressão é onde os melhores solos acontecem.",
  "Keep calm e escute Chili Peppers. Mas termina esse ciclo primeiro!",
  "Gatos não procrastinam, eles apenas 'otimizam o descanso'.",
  "Sua mente é sua arma. Mantenha-a afiada.",
  "Tudo que temos de decidir é o que fazer com o tempo que nos é dado.",
];

// Audio Context for Beeps
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSound(type) {
  if (audioCtx.state === "suspended") audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  if (type === "start") {
    osc.frequency.value = 600;
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
  } else if (type === "finish") {
    osc.frequency.setValueAtTime(400, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.1);
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.5);
  }
}

// DOM Elements
const timerDisplay = document.getElementById("timer");

// Timer Logic
let timerInterval;
let timeLeft = 25 * 60;
let totalTime = 25 * 60;
let isRunning = false;
let mode = "focus"; // focus, break

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  document.title = `${minutes}:${seconds < 10 ? "0" : ""}${seconds} - ${mode.toUpperCase()}`;
}

function tick() {
  if (timeLeft > 0) {
    timeLeft--;
    updateTimerDisplay();
  } else {
    clearInterval(timerInterval);
    isRunning = false;
    playSound("finish");
    document.body.classList.remove("status-active");
    document.getElementById("system-status").innerText = "CICLO FINALIZADO.";

    if (mode === "focus") {
      const baseReward = Math.ceil(currentFocusTime * XP_PER_MINUTE);
      const xpMultiplier = gameState.agentMode ? 2 : 1;
      const reward = baseReward * xpMultiplier;

      addXP(reward);
      alert(
        `Foco concluído! +${reward} XP ${gameState.agentMode ? "(DRAGON MODE 2x)" : ""}`,
      );

      // Avançar missão de pomodoros (ID 1)
      const missionPoints = gameState.agentMode ? 2 : 1;
      incrementMissionProgress(1, missionPoints);

      resetTimer(currentBreakTime, "break"); // Default break after focus
    } else {
      alert("Pausa finalizada! Pronto para o próximo round?");
      resetTimer(currentFocusTime, "focus"); // Auto-return to focus after break
    }
  }
}

function startTimer() {
  if (!isRunning) {
    isRunning = true;
    timerInterval = setInterval(tick, 1000);
    document.body.classList.add("status-active");
    updateSystemStatus();
    document.getElementById("btn-focus").innerText = "PAUSAR";
    playSound("start");
  }
}

function pauseTimer() {
  if (isRunning) {
    clearInterval(timerInterval);
    isRunning = false;
    document.body.classList.remove("status-active");
    document.getElementById("system-status").innerText = "SISTEMA PAUSADO";
    document.getElementById("btn-focus").innerText = "CONTINUAR";
  }
}

function updateSystemStatus() {
  const statusEl = document.getElementById("system-status");
  if (mode === "focus") {
    statusEl.innerText = "MODO: FOCO";
    toggleBreakModeVisuals(false);
  } else {
    statusEl.innerText = "MODO: PAUSA";
    toggleBreakModeVisuals(true);
  }
}

function resetTimer(newTime, newMode) {
  clearInterval(timerInterval);
  isRunning = false;
  mode = newMode;

  // Update the stored duration for the current mode
  if (mode === "focus") {
    currentFocusTime = newTime;
  } else {
    currentBreakTime = newTime;
  }

  totalTime = Math.round(newTime * 60);
  timeLeft = totalTime;
  document.body.classList.remove("status-active");
  updateSystemStatus();
  document.getElementById("btn-focus").innerText = "INICIAR";
  updateTimerDisplay();
}

// XP & Level System
function updateLevel() {
  let currentLevel = LEVELS[0];
  let nextLevel = LEVELS[1];

  for (let i = 0; i < LEVELS.length; i++) {
    if (gameState.xp >= LEVELS[i].xp) {
      currentLevel = LEVELS[i];
      nextLevel = LEVELS[i + 1] || { xp: 999999, name: "MAX LEVEL" };
      gameState.level = i; // Sync numeric level
    }
  }

  document.getElementById("current-level").innerText = currentLevel.name;
  document.getElementById("current-xp").innerText = gameState.xp;
  document.getElementById("next-level-xp").innerText = nextLevel.xp;

  // Update Operator ID (Dynamic visual)
  const opId = document.getElementById("operator-id");
  const levelIndex = LEVELS.indexOf(currentLevel);
  const opText = `${String(levelIndex + 1).padStart(2, "0")}`;
  opId.innerText = opText;
  opId.setAttribute("data-text", opText);

  const xpNeeded = nextLevel.xp - currentLevel.xp;
  const xpProgress = gameState.xp - currentLevel.xp;
  let progressPercent = 0;

  if (xpNeeded > 0) {
    progressPercent = (xpProgress / xpNeeded) * 100;
    if (progressPercent > 100) progressPercent = 100;
  }

  document.getElementById("xp-progress").style.width = `${progressPercent}%`;
  saveGame();
}

function addXP(amount) {
  gameState.xp += amount;
  updateLevel();
}

// Missions
function renderMissions() {
  const list = document.getElementById("mission-list");
  list.innerHTML = "";
  gameState.missions.forEach((mission) => {
    const li = document.createElement("li");
    li.className = `mission-item ${mission.completed ? "completed" : ""}`;

    let progressText = "";
    if (mission.targetProgress) {
      progressText = ` (${mission.currentProgress}/${mission.targetProgress})`;
    }

    li.innerText = `${mission.text}${progressText} [${mission.xp} XP]`;
    li.onclick = () => toggleMission(mission.id);
    list.appendChild(li);
  });
}

function incrementMissionProgress(id, amount = 1) {
  const mission = gameState.missions.find((m) => m.id === id);
  if (mission && !mission.completed && mission.targetProgress) {
    mission.currentProgress += amount;

    // Give XP per step (if defined)
    if (mission.xp > 0) {
      addXP(mission.xp * amount);
    }

    if (mission.currentProgress >= mission.targetProgress) {
      mission.completed = true;

      // Give Bonus XP (if defined)
      if (mission.bonusXp) {
        addXP(mission.bonusXp);
        alert(`BÔNUS DE MISSÃO: +${mission.bonusXp} XP!`);
      } else if (mission.xp > 0 && mission.xp !== 100) {
        // Fallback or legacy behavior for total mission XP
        addXP(mission.xp);
      }

      playSound("finish");

      // Auto-reset para permitir repetição
      setTimeout(() => {
        mission.completed = false;
        mission.currentProgress =
          mission.currentProgress % mission.targetProgress;
        renderMissions();
        saveGame();
      }, 2000);
    }
    renderMissions();
    saveGame();
  }
}

function toggleMission(id) {
  const mission = gameState.missions.find((m) => m.id === id);
  if (!mission || mission.completed) return;

  if (mission.targetProgress) {
    incrementMissionProgress(id);
  } else {
    mission.completed = true;
    addXP(mission.xp);
    playSound("finish");
    renderMissions();

    // Auto-reset para permitir repetição após 1.5 segundos
    setTimeout(() => {
      mission.completed = false;
      renderMissions();
      saveGame();
    }, 1500);

    saveGame();
  }
}

// Persistence
function saveGame() {
  localStorage.setItem("uberToDevSave", JSON.stringify(gameState));
}

function loadGame() {
  const saved = localStorage.getItem("uberToDevSave");
  if (saved) {
    const parsed = JSON.parse(saved);

    // Restore numeric stats
    gameState.xp = parsed.xp !== undefined ? parsed.xp : 1700;
    gameState.level = parsed.level || 0;
    gameState.streak = parsed.streak || 0;
    gameState.lastLogin = parsed.lastLogin;
    gameState.agentMode = parsed.agentMode || false;

    // Restore mission status ONLY (keep text/xp from code)

    if (parsed.missions) {
      gameState.missions = gameState.missions.map((mission) => {
        // Find saved version of this mission by ID
        const savedMission = parsed.missions.find((m) => m.id === mission.id);
        if (savedMission) {
          // Update ONLY the completed status and progress
          return {
            ...mission,
            completed: savedMission.completed,
            currentProgress: savedMission.currentProgress || 0,
          };
        }
        return mission;
      });
    }
  }
  updateLevel();
  renderMissions();

  // Sync Agent Mode Visuals
  const statusText = document.getElementById("agent-status-text");
  if (statusText) {
    statusText.innerText = gameState.agentMode ? "ON" : "OFF";
    toggleAgentModeVisuals(gameState.agentMode);
  }
}

function toggleAgentModeVisuals(active) {
  if (active) {
    document.body.classList.add("agent-mode-active");
  } else {
    document.body.classList.remove("agent-mode-active");
  }

  const mainTitle = document.querySelector(".glitch-text");
  const subTitle = document.querySelector(".subtitle");
  
  if (mainTitle && subTitle) {
    if (active) {
      mainTitle.innerText = "FIRE AND BLOOD";
      mainTitle.setAttribute("data-text", "FIRE AND BLOOD");
      subTitle.innerText = "FOCUS LIKE A DRAGON.";
    } else {
      mainTitle.innerText = "WINTER IS COMING";
      mainTitle.setAttribute("data-text", "WINTER IS COMING");
      subTitle.innerText = "FOCUS LIKE A DIRE WOLF.";
    }
  }
}

function toggleBreakModeVisuals(active) {
  if (active) {
    document.body.classList.add("break-mode-active");
  } else {
    document.body.classList.remove("break-mode-active");
  }
}

// Random Quote
let quoteTimeout;
function showRandomQuote() {
  const el = document.getElementById("quote-display");
  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  let i = 0;

  clearTimeout(quoteTimeout);
  el.innerText = "";

  function type() {
    if (i < quote.length) {
      el.textContent += quote.charAt(i);
      i++;
      quoteTimeout = setTimeout(type, 50);
    }
  }
  type();
}

// Init
document.addEventListener("DOMContentLoaded", () => {
  loadGame();
  showRandomQuote();
  resetTimer(currentFocusTime, "focus"); // Init state

  document.getElementById("btn-focus").addEventListener("click", () => {
    if (isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  });

  document.getElementById("btn-set-focus").addEventListener("click", () => {
    resetTimer(currentFocusTime, "focus");
  });

  document
    .getElementById("btn-short-break")
    .addEventListener("click", () => resetTimer(currentBreakTime, "break"));

  // Timer Presets Logic
  document.querySelectorAll(".btn-preset").forEach((button) => {
    button.addEventListener("click", () => {
      const minutes = parseInt(button.getAttribute("data-time"));
      resetTimer(minutes, mode); // Adjusts whichever mode we are in
    });
  });

  // Manual Timer Logic
  document.getElementById("btn-apply-manual").addEventListener("click", () => {
    const input = document.getElementById("manual-input");
    const minutes = parseFloat(input.value);

    if (minutes > 0 && minutes <= 999) {
      resetTimer(minutes, mode); // Adjusts whichever mode we are in
      input.value = ""; // Clear for next use
    } else {
      alert("Por favor, insira um valor entre 1 e 999.");
    }
  });

  // Quote Change on Double-Click
  document
    .getElementById("quote-container")
    .addEventListener("dblclick", () => {
      showRandomQuote();
    });

  // Hidden XP Override Logic
  let opClickCount = 0;
  let opClickTimer;
  document.getElementById("operator-id").addEventListener("click", () => {
    opClickCount++;
    clearTimeout(opClickTimer);

    if (opClickCount >= 5) {
      const newXP = prompt(
        "PROTOCOLO DE SOBREPOSIÇÃO: Insira o novo valor de XP:",
      );
      if (newXP !== null && !isNaN(newXP)) {
        gameState.xp = parseInt(newXP);
        updateLevel();
        alert(`XP atualizado para ${gameState.xp}`);
      }
      opClickCount = 0;
    } else {
      opClickTimer = setTimeout(() => {
        opClickCount = 0;
      }, 2000);
    }
  });

  // Agent Mode Toggle logic
  const agentToggleButton = document.getElementById("btn-agent-toggle");
  agentToggleButton.addEventListener("click", () => {
    gameState.agentMode = !gameState.agentMode;
    document.getElementById("agent-status-text").innerText = gameState.agentMode
      ? "ON"
      : "OFF";
    toggleAgentModeVisuals(gameState.agentMode);
    saveGame();
  });
});
