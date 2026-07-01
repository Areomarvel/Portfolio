// Windows 11 Developer Portfolio Interactive Logic
document.addEventListener("DOMContentLoaded", () => {
  // Check if portfolioData is loaded
  if (typeof portfolioData === "undefined") {
    console.error("portfolioData is not defined. Ensure data.js is loaded first.");
    return;
  }

  const { profile, projects, skills, experience, education, system } = portfolioData;

  // State Management
  const state = {
    theme: localStorage.getItem("win11-theme") || "light",
    activeWallpaper: parseInt(localStorage.getItem("win11-wallpaper") || "0"),
    windows: {
      explorer: { top: 60, left: 100, width: 800, height: 500, isMaximized: false, isMinimized: false, isOpen: false, zIndex: 10 },
      settings: { top: 90, left: 140, width: 820, height: 520, isMaximized: false, isMinimized: false, isOpen: false, zIndex: 10 },
      taskmanager: { top: 120, left: 180, width: 760, height: 480, isMaximized: false, isMinimized: false, isOpen: false, zIndex: 10 },
      mail: { top: 150, left: 220, width: 760, height: 480, isMaximized: false, isMinimized: false, isOpen: false, zIndex: 10 },
      terminal: { top: 180, left: 260, width: 680, height: 420, isMaximized: false, isMinimized: false, isOpen: false, zIndex: 10 }
    },
    activeWindow: null,
    highestZIndex: 10,
    explorerCurrentFilter: "all",
    explorerHistory: ["all"],
    explorerHistoryIndex: 0,
    performanceChart: null,
    activePerfMetric: "frontend",
    sentEmails: JSON.parse(localStorage.getItem("win11-emails") || "[]")
  };

  // ==================== SYSTEM BOOT LOADER ====================
  const bootScreen = document.getElementById("boot-screen");
  const desktopShell = document.getElementById("desktop-shell");

  setTimeout(() => {
    bootScreen.classList.add("fade-out");
    desktopShell.classList.remove("hidden");
    initializeDesktop();
  }, 2200); // Elegant Windows-like boot transition

  // ==================== INIT FUNCTIONS ====================
  function initializeDesktop() {
    updateClock();
    setInterval(updateClock, 1000);

    applyTheme(state.theme);
    applyWallpaper(state.activeWallpaper);

    renderDesktopShortcuts();
    renderWallpaperSelectors();
    renderAboutTab();
    renderExperienceTab();
    renderSkillsProcesses();
    renderRecommendedProjects();
    updateSentMailCount();
    setupCalendar();

    // Auto-open explorer (Portfolio Hub) on startup to showcase projects
    setTimeout(() => {
      openWindow("explorer");
    }, 800);
  }

  // ==================== THEME & WALLPAPER SYSTEM ====================
  function applyTheme(theme) {
    state.theme = theme;
    localStorage.setItem("win11-theme", theme);
    if (theme === "dark") {
      document.body.classList.remove("light-theme");
      document.body.classList.add("dark-theme");
      document.getElementById("btn-theme-dark").classList.add("active");
      document.getElementById("btn-theme-light").classList.remove("active");
      document.getElementById("toggle-dark-mode").classList.add("active");
    } else {
      document.body.classList.remove("dark-theme");
      document.body.classList.add("light-theme");
      document.getElementById("btn-theme-light").classList.add("active");
      document.getElementById("btn-theme-dark").classList.remove("active");
      document.getElementById("toggle-dark-mode").classList.remove("active");
    }
  }

  function applyWallpaper(index) {
    state.activeWallpaper = index;
    localStorage.setItem("win11-wallpaper", index);
    const wall = system.wallpapers[index];
    desktopShell.style.background = wall.value;
    desktopShell.style.backgroundSize = "cover";
    desktopShell.style.backgroundPosition = "center";

    // Update visual selector border
    document.querySelectorAll(".wallpaper-thumb").forEach((el, idx) => {
      if (idx === index) el.classList.add("active");
      else el.classList.remove("active");
    });
    document.querySelectorAll(".mini-wallpaper-dot").forEach((el, idx) => {
      if (idx === index) el.classList.add("active-border");
      else el.classList.remove("active-border");
    });

    // Auto theme adjust based on wallpaper preset
    if (wall.isDark) {
      applyTheme("dark");
    } else {
      applyTheme("light");
    }
  }

  // ==================== TRAY CLOCK & SYSTEM INFO ====================
  function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // hour 0 is 12

    document.getElementById("tray-time").textContent = `${hours}:${minutes} ${ampm}`;
    document.getElementById("tray-date").textContent = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;
  }

  // ==================== SYSTEM NOTIFICATIONS (TOASTS) ====================
  function triggerNotification(title, message, iconClass = "bi-info-circle-fill text-primary") {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = "win-toast";

    toast.innerHTML = `
      <i class="bi ${iconClass}"></i>
      <div class="flex-grow-1">
        <span class="toast-title">${title}</span>
        <span class="toast-desc">${message}</span>
      </div>
    `;

    container.appendChild(toast);

    // Sound effect trigger (simulated HTML5 audio synth)
    if (document.getElementById("toggle-sound-mute").classList.contains("active")) {
      playSystemBeep();
    }

    setTimeout(() => {
      toast.style.animation = "slideOut 0.3s ease-in forwards";
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }

  function playSystemBeep() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5 note
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5 note
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch (e) {
      console.log("Audio synthesis blocked or not supported by browser security policy.");
    }
  }

  // ==================== WINDOW MANAGEMENT CORE ====================
  const windowElements = {};

  // Register and Setup Events for all windows
  document.querySelectorAll(".win-window").forEach(winEl => {
    const id = winEl.dataset.window;
    windowElements[id] = winEl;

    // Apply default positioning styles
    const winState = state.windows[id];
    winEl.style.width = `${winState.width}px`;
    winEl.style.height = `${winState.height}px`;
    winEl.style.top = `${winState.top}px`;
    winEl.style.left = `${winState.left}px`;

    // Window click events (focus layering)
    winEl.addEventListener("mousedown", () => focusWindow(id));
    winEl.addEventListener("touchstart", () => focusWindow(id), { passive: true });

    // Close/Min/Max buttons controls
    const header = winEl.querySelector(".win-header");
    winEl.querySelector(".win-btn-close").addEventListener("click", (e) => {
      e.stopPropagation();
      closeWindow(id);
    });
    winEl.querySelector(".win-btn-minimize").addEventListener("click", (e) => {
      e.stopPropagation();
      minimizeWindow(id);
    });
    winEl.querySelector(".win-btn-maximize").addEventListener("click", (e) => {
      e.stopPropagation();
      toggleMaximizeWindow(id);
    });

    // Double-click header to maximize
    header.addEventListener("dblclick", (e) => {
      if (e.target.closest(".win-controls")) return;
      toggleMaximizeWindow(id);
    });

    // Drag systems
    setupDraggable(winEl, header);

    // Resize systems
    setupResizable(winEl);
  });

  // Taskbar shortcuts events
  document.querySelectorAll(".app-shortcut").forEach(btn => {
    const appId = btn.dataset.app;
    btn.addEventListener("click", () => {
      toggleAppFromTaskbar(appId);
    });
  });

  function toggleAppFromTaskbar(id) {
    const winState = state.windows[id];
    if (!winState.isOpen) {
      openWindow(id);
    } else if (winState.isMinimized) {
      restoreWindow(id);
    } else if (state.activeWindow === id) {
      minimizeWindow(id);
    } else {
      focusWindow(id);
    }
  }

  function openWindow(id) {
    const winEl = windowElements[id];
    const winState = state.windows[id];
    winState.isOpen = true;
    winState.isMinimized = false;

    winEl.classList.remove("closed", "minimized");

    // Update taskbar icon marker state
    const shortcut = document.querySelector(`.app-shortcut[data-app="${id}"]`);
    if (shortcut) {
      shortcut.classList.add("running");
    }

    focusWindow(id);

    // Focus terminal input if opening terminal
    if (id === "terminal") {
      setTimeout(() => document.getElementById("term-input").focus(), 100);
    }
    // Render chart if opening task manager
    if (id === "taskmanager" && state.activePerfMetric) {
      setTimeout(() => initPerformanceChart(state.activePerfMetric), 100);
    }
  }

  function closeWindow(id) {
    const winEl = windowElements[id];
    const winState = state.windows[id];
    winState.isOpen = false;
    winEl.classList.add("closed");

    const shortcut = document.querySelector(`.app-shortcut[data-app="${id}"]`);
    if (shortcut) {
      shortcut.classList.remove("running", "focused");
    }

    if (state.activeWindow === id) {
      state.activeWindow = null;
      // Pass focus to next highest window
      findAndFocusNextWindow();
    }
  }

  function minimizeWindow(id) {
    const winEl = windowElements[id];
    const winState = state.windows[id];
    winState.isMinimized = true;
    winEl.classList.add("minimized");
    winEl.classList.remove("active");

    const shortcut = document.querySelector(`.app-shortcut[data-app="${id}"]`);
    if (shortcut) {
      shortcut.classList.remove("focused");
    }

    if (state.activeWindow === id) {
      state.activeWindow = null;
      findAndFocusNextWindow();
    }
  }

  function restoreWindow(id) {
    const winEl = windowElements[id];
    const winState = state.windows[id];
    winState.isMinimized = false;
    winEl.classList.remove("minimized");
    focusWindow(id);
  }

  function toggleMaximizeWindow(id) {
    const winEl = windowElements[id];
    const winState = state.windows[id];
    winState.isMaximized = !winState.isMaximized;

    const maxBtn = winEl.querySelector(".win-btn-maximize i");
    if (winState.isMaximized) {
      winEl.classList.add("maximized");
      maxBtn.className = "bi bi-files"; // Restore icon
    } else {
      winEl.classList.remove("maximized");
      maxBtn.className = "bi bi-square"; // Maximize icon
    }

    // Redraw performance charts if resizing task manager
    if (id === "taskmanager" && state.performanceChart) {
      setTimeout(() => state.performanceChart.resize(), 150);
    }
  }

  function focusWindow(id) {
    if (state.activeWindow === id) return;

    // Reset active labels on all windows
    document.querySelectorAll(".win-window").forEach(el => el.classList.remove("active"));
    document.querySelectorAll(".app-shortcut").forEach(el => el.classList.remove("focused"));

    // Activate target
    const winEl = windowElements[id];
    winEl.classList.add("active");

    state.highestZIndex += 1;
    winEl.style.zIndex = state.highestZIndex;
    state.activeWindow = id;

    // Highlight taskbar shortcut icon
    const shortcut = document.querySelector(`.app-shortcut[data-app="${id}"]`);
    if (shortcut) {
      shortcut.classList.add("focused");
    }
  }

  function findAndFocusNextWindow() {
    let nextId = null;
    let highestZ = 0;

    Object.keys(state.windows).forEach(id => {
      const winState = state.windows[id];
      if (winState.isOpen && !winState.isMinimized) {
        const z = parseInt(windowElements[id].style.zIndex) || 0;
        if (z > highestZ) {
          highestZ = z;
          nextId = id;
        }
      }
    });

    if (nextId) {
      focusWindow(nextId);
    }
  }

  // ==================== DRAGGABLE PHYSICS ENGINE ====================
  function setupDraggable(winEl, dragHandle) {
    let offsetX = 0, offsetY = 0, currentX = 0, currentY = 0;

    dragHandle.addEventListener("mousedown", dragStart);
    dragHandle.addEventListener("touchstart", dragStart, { passive: false });

    function dragStart(e) {
      // Don't drag if window is maximized
      const id = winEl.dataset.window;
      if (state.windows[id].isMaximized) return;

      focusWindow(id);

      const clientX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
      const clientY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;

      currentX = winEl.offsetLeft;
      currentY = winEl.offsetTop;

      offsetX = clientX - currentX;
      offsetY = clientY - currentY;

      if (e.type === "mousedown") {
        document.addEventListener("mousemove", dragMove);
        document.addEventListener("mouseup", dragEnd);
      } else {
        document.addEventListener("touchmove", dragMove, { passive: false });
        document.addEventListener("touchend", dragEnd);
      }
    }

    function dragMove(e) {
      if (e.cancelable) e.preventDefault();
      const clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
      const clientY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;

      let newX = clientX - offsetX;
      let newY = clientY - offsetY;

      // Keep boundary inside desktop viewport
      const docWidth = window.innerWidth;
      const docHeight = window.innerHeight - 48; // minus taskbar

      if (newY < 0) newY = 0;
      if (newY > docHeight - 40) newY = docHeight - 40;
      if (newX < -winEl.offsetWidth + 100) newX = -winEl.offsetWidth + 100;
      if (newX > docWidth - 100) newX = docWidth - 100;

      winEl.style.left = `${newX}px`;
      winEl.style.top = `${newY}px`;

      // Save state position coordinates
      const id = winEl.dataset.window;
      state.windows[id].left = newX;
      state.windows[id].top = newY;
    }

    function dragEnd(e) {
      document.removeEventListener("mousemove", dragMove);
      document.removeEventListener("mouseup", dragEnd);
      document.removeEventListener("touchmove", dragMove);
      document.removeEventListener("touchend", dragEnd);
    }
  }

  // ==================== RESIZABLE SYSTEM ====================
  function setupResizable(winEl) {
    const id = winEl.dataset.window;
    const minW = 400;
    const minH = 300;

    winEl.querySelectorAll(".resize-handle").forEach(handle => {
      handle.addEventListener("mousedown", initResize);

      function initResize(e) {
        e.preventDefault();
        e.stopPropagation();

        const startWidth = winEl.offsetWidth;
        const startHeight = winEl.offsetHeight;
        const startX = e.clientX;
        const startY = e.clientY;
        const startTop = winEl.offsetTop;
        const startLeft = winEl.offsetLeft;

        document.addEventListener("mousemove", performResize);
        document.addEventListener("mouseup", stopResize);

        function performResize(e) {
          const deltaX = e.clientX - startX;
          const deltaY = e.clientY - startY;

          let w = startWidth;
          let h = startHeight;
          let t = startTop;
          let l = startLeft;

          if (handle.classList.contains("e")) {
            w = startWidth + deltaX;
          } else if (handle.classList.contains("w")) {
            w = startWidth - deltaX;
            l = startLeft + deltaX;
            if (w < minW) { l = startLeft + (startWidth - minW); w = minW; }
          } else if (handle.classList.contains("s")) {
            h = startHeight + deltaY;
          } else if (handle.classList.contains("n")) {
            h = startHeight - deltaY;
            t = startTop + deltaY;
            if (h < minH) { t = startTop + (startHeight - minH); h = minH; }
          } else if (handle.classList.contains("se")) {
            w = startWidth + deltaX;
            h = startHeight + deltaY;
          } else if (handle.classList.contains("sw")) {
            w = startWidth - deltaX;
            h = startHeight + deltaY;
            l = startLeft + deltaX;
            if (w < minW) { l = startLeft + (startWidth - minW); w = minW; }
          } else if (handle.classList.contains("ne")) {
            w = startWidth + deltaX;
            h = startHeight - deltaY;
            t = startTop + deltaY;
            if (h < minH) { t = startTop + (startHeight - minH); h = minH; }
          } else if (handle.classList.contains("nw")) {
            w = startWidth - deltaX;
            h = startHeight - deltaY;
            l = startLeft + deltaX;
            t = startTop + deltaY;
            if (w < minW) { l = startLeft + (startWidth - minW); w = minW; }
            if (h < minH) { t = startTop + (startHeight - minH); h = minH; }
          }

          if (w >= minW) {
            winEl.style.width = `${w}px`;
            winEl.style.left = `${l}px`;
            state.windows[id].width = w;
            state.windows[id].left = l;
          }
          if (h >= minH) {
            winEl.style.height = `${h}px`;
            winEl.style.top = `${t}px`;
            state.windows[id].height = h;
            state.windows[id].top = t;
          }

          // Redraw chart if task manager is resizing
          if (id === "taskmanager" && state.performanceChart) {
            state.performanceChart.resize();
          }
        }

        function stopResize() {
          document.removeEventListener("mousemove", performResize);
          document.removeEventListener("mouseup", stopResize);
        }
      }
    });
  }

  // ==================== SYSTEM FLYOUTS SYSTEM ====================
  const flyouts = {
    start: { el: document.getElementById("start-menu"), btn: document.getElementById("taskbar-start") },
    search: { el: document.getElementById("search-panel"), btn: document.getElementById("taskbar-search") },
    widgets: { el: document.getElementById("widgets-panel"), btn: document.getElementById("taskbar-widgets") },
    qs: { el: document.getElementById("quick-settings-panel"), btn: document.getElementById("taskbar-quick-settings") },
    calendar: { el: document.getElementById("calendar-panel"), btn: document.getElementById("taskbar-clock-calendar") }
  };

  Object.keys(flyouts).forEach(key => {
    const f = flyouts[key];
    f.btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = f.el.classList.contains("open");
      closeAllFlyouts();
      if (!isOpen) {
        f.el.classList.add("open");
        f.btn.classList.add("bg-glass-active");
        if (key === "start") setTimeout(() => document.getElementById("start-search-input").focus(), 100);
        if (key === "search") setTimeout(() => document.getElementById("panel-search-input").focus(), 100);
      }
    });

    // Prevent closing when clicking inside the flyout panel itself
    f.el.addEventListener("click", (e) => e.stopPropagation());
  });

  // Close flyouts on clicking wallpaper
  document.getElementById("desktop-shell").addEventListener("click", () => {
    closeAllFlyouts();
  });

  function closeAllFlyouts() {
    Object.keys(flyouts).forEach(key => {
      flyouts[key].el.classList.remove("open");
      flyouts[key].btn.classList.remove("bg-glass-active");
    });
  }

  // ==================== START MENU & SEARCH FLYOUT LOGIC ====================
  // Pinned items open windows
  document.querySelectorAll(".pinned-app-item[data-open]").forEach(el => {
    el.addEventListener("click", () => {
      const id = el.dataset.open;
      openWindow(id);
      closeAllFlyouts();
    });
  });

  document.getElementById("start-web-github").addEventListener("click", () => {
    window.open(profile.socials.github, "_blank");
    closeAllFlyouts();
  });

  // Recommended Projects in Start Menu
  function renderRecommendedProjects() {
    const recContainer = document.getElementById("start-recommended-list");
    recContainer.innerHTML = "";

    // Pick 3 projects
    projects.slice(0, 3).forEach(p => {
      const item = document.createElement("div");
      item.className = "rec-project-item";
      item.innerHTML = `
        <i class="bi bi-folder-fill color-folder fs-4"></i>
        <div>
          <span class="title">${p.title}</span>
          <span class="desc">${p.summary}</span>
        </div>
      `;
      item.addEventListener("click", () => {
        openWindow("explorer");
        renderProjectDetails(p.id);
        closeAllFlyouts();
      });
      recContainer.appendChild(item);
    });
  }

  // Start menu power options simulation
  document.getElementById("btn-start-power").addEventListener("click", () => {
    const shutdownScreen = document.getElementById("shutdown-screen");
    shutdownScreen.classList.remove("hidden");
    closeAllFlyouts();

    // Turn screen dark, simulate restart option
    setTimeout(() => {
      document.getElementById("btn-restart").classList.remove("hidden");
    }, 3000);
  });

  document.getElementById("btn-restart").addEventListener("click", () => {
    document.getElementById("btn-restart").classList.add("hidden");
    document.getElementById("shutdown-screen").classList.add("hidden");
    // Show boot screen and trigger fresh loading
    bootScreen.classList.remove("fade-out");
    setTimeout(() => {
      bootScreen.classList.add("fade-out");
    }, 2000);
  });

  // Search logic inputs
  const startSearch = document.getElementById("start-search-input");
  const panelSearch = document.getElementById("panel-search-input");

  startSearch.addEventListener("input", (e) => {
    const val = e.target.value;
    closeAllFlyouts();
    flyouts.search.el.classList.add("open");
    flyouts.search.btn.classList.add("bg-glass-active");
    panelSearch.value = val;
    panelSearch.focus();
    performSearch(val);
  });

  panelSearch.addEventListener("input", (e) => {
    performSearch(e.target.value);
  });

  function performSearch(query) {
    const bestMatchContainer = document.getElementById("search-best-match");
    const relatedContainer = document.getElementById("search-related-items");

    bestMatchContainer.innerHTML = "";
    relatedContainer.innerHTML = "";

    if (!query.trim()) {
      bestMatchContainer.innerHTML = `<div class="text-muted small">Type to query projects, tech skills, or settings.</div>`;
      return;
    }

    const searchVal = query.toLowerCase();

    // Search projects
    const matchedProjects = projects.filter(p =>
      p.title.toLowerCase().includes(searchVal) ||
      p.summary.toLowerCase().includes(searchVal) ||
      p.tags.some(t => t.toLowerCase().includes(searchVal))
    );

    // Search skills
    const matchedSkills = [];
    Object.keys(skills).forEach(cat => {
      skills[cat].forEach(s => {
        if (s.name.toLowerCase().includes(searchVal)) {
          matchedSkills.push(s);
        }
      });
    });

    if (matchedProjects.length > 0) {
      const best = matchedProjects[0];
      // Best Match card
      bestMatchContainer.innerHTML = `
        <div class="card p-3 border-0 bg-glass-card hover-glow shadow-sm" style="cursor: pointer;">
          <div class="d-flex align-items-center gap-3">
            <i class="bi bi-folder-fill color-folder fs-2"></i>
            <div>
              <h6 class="mb-0 fw-bold">${best.title}</h6>
              <span class="text-muted small">${best.summary}</span>
            </div>
          </div>
        </div>
      `;
      bestMatchContainer.firstElementChild.addEventListener("click", () => {
        openWindow("explorer");
        renderProjectDetails(best.id);
        closeAllFlyouts();
      });

      // Related matches
      matchedProjects.slice(1).forEach(p => {
        const item = document.createElement("div");
        item.className = "d-flex align-items-center gap-3 p-2 bg-glass-card border-0 rounded hover-bg-glass";
        item.style.cursor = "pointer";
        item.innerHTML = `
          <i class="bi bi-folder2 color-folder fs-4"></i>
          <div>
            <span class="small fw-semibold d-block">${p.title}</span>
            <span class="text-muted small">${p.summary}</span>
          </div>
        `;
        item.addEventListener("click", () => {
          openWindow("explorer");
          renderProjectDetails(p.id);
          closeAllFlyouts();
        });
        relatedContainer.appendChild(item);
      });
    }

    // Append skills
    matchedSkills.forEach(s => {
      const item = document.createElement("div");
      item.className = "d-flex align-items-center gap-3 p-2 bg-glass-card border-0 rounded hover-bg-glass";
      item.style.cursor = "pointer";
      item.innerHTML = `
        <i class="bi ${s.icon || 'bi-cpu-fill'} text-success fs-4"></i>
        <div>
          <span class="small fw-semibold d-block">${s.name} (Skill)</span>
          <span class="text-muted small">Proficiency: ${s.level}% • ${s.xp} Years Experience</span>
        </div>
      `;
      item.addEventListener("click", () => {
        openWindow("taskmanager");
        // Open processes tab or switch performance tab
        closeAllFlyouts();
      });
      relatedContainer.appendChild(item);
    });

    if (bestMatchContainer.innerHTML === "" && relatedContainer.innerHTML === "") {
      bestMatchContainer.innerHTML = `<div class="text-muted small">No matches found for "${query}"</div>`;
    }
  }

  // ==================== QUICK SETTINGS PANEL LOGIC ====================
  // Wi-Fi toggle
  document.getElementById("toggle-wifi").addEventListener("click", (e) => {
    e.target.closest("button").classList.toggle("active");
    const isActive = e.target.closest("button").classList.contains("active");
    triggerNotification(
      isActive ? "Wi-Fi Connected" : "Wi-Fi Disconnected",
      isActive ? "Successfully connected to default interface." : "Offline mode active.",
      isActive ? "bi-wifi text-success" : "bi-wifi-off text-secondary"
    );
  });

  // Bluetooth toggle
  document.getElementById("toggle-bluetooth").addEventListener("click", (e) => {
    e.target.closest("button").classList.toggle("active");
  });

  // Dark mode toggle quick setting
  document.getElementById("toggle-dark-mode").addEventListener("click", () => {
    applyTheme(state.theme === "light" ? "dark" : "light");
  });

  // Sound toggle quick setting
  const soundBtn = document.getElementById("toggle-sound-mute");
  soundBtn.addEventListener("click", () => {
    soundBtn.classList.toggle("active");
    const icon = soundBtn.querySelector("i");
    const sysIcon = document.getElementById("taskbar-quick-settings").querySelector(".bi-volume-up, .bi-volume-mute");
    if (soundBtn.classList.contains("active")) {
      icon.className = "bi bi-volume-up";
      if (sysIcon) sysIcon.className = "bi bi-volume-up";
    } else {
      icon.className = "bi bi-volume-mute";
      if (sysIcon) sysIcon.className = "bi bi-volume-mute";
    }
  });

  // Slider sound control
  const soundSlider = document.getElementById("sound-slider");
  soundSlider.addEventListener("input", (e) => {
    const val = e.target.value;
    document.getElementById("sound-val").textContent = val;
    const trayQsBtn = document.getElementById("taskbar-quick-settings");
    let icon = trayQsBtn.querySelector(".bi-volume-up, .bi-volume-down, .bi-volume-mute");

    if (val == 0) {
      if (icon) icon.className = "bi bi-volume-mute";
      soundBtn.classList.remove("active");
      soundBtn.querySelector("i").className = "bi bi-volume-mute";
    } else {
      if (icon) icon.className = val < 50 ? "bi bi-volume-down" : "bi bi-volume-up";
      soundBtn.classList.add("active");
      soundBtn.querySelector("i").className = "bi bi-volume-up";
    }
  });

  // Settings click inside Quick Settings
  document.getElementById("btn-qs-settings").addEventListener("click", () => {
    openWindow("settings");
    closeAllFlyouts();
  });
  // Terminal click inside Quick Settings
  document.getElementById("btn-qs-terminal").addEventListener("click", () => {
    openWindow("terminal");
    closeAllFlyouts();
  });

  // ==================== DESKTOP SHORTCUT RENDER ====================
  function renderDesktopShortcuts() {
    document.querySelectorAll(".desktop-shortcut[data-open]").forEach(el => {
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        openWindow(el.dataset.open);
      });
    });
  }

  // ==================== ABOUT SETTINGS RENDERING ====================
  function renderAboutTab() {
    document.getElementById("settings-avatar").src = profile.avatar;
    document.getElementById("settings-user-name").textContent = profile.name;
    document.getElementById("settings-user-role").textContent = profile.title;
    document.getElementById("about-bio").textContent = profile.bio;

    document.getElementById("spec-name").textContent = profile.name;
    document.getElementById("spec-focus").textContent = profile.title;
    document.getElementById("spec-loc").textContent = profile.location;

    const emailEl = document.getElementById("spec-email");
    emailEl.href = `mailto:${profile.email}`;
    emailEl.textContent = profile.email;

    document.getElementById("link-github").href = profile.socials.github;
    document.getElementById("link-linkedin").href = profile.socials.linkedin;

    document.getElementById("build-version").textContent = `${system.updates.version} • ${profile.name} Portfolio Build`;
    document.getElementById("update-details").textContent = `Last checked: ${system.updates.lastChecked}`;
  }

  function renderExperienceTab() {
    const container = document.getElementById("experience-timeline");
    container.innerHTML = "";

    experience.forEach(exp => {
      const card = document.createElement("div");
      card.className = "timeline-card";

      const bullets = exp.points.map(pt => `<li>${pt}</li>`).join("");

      card.innerHTML = `
        <h6 class="mb-1 text-primary fw-semibold">${exp.role}</h6>
        <div class="small fw-bold text-muted mb-2">${exp.company} | ${exp.period}</div>
        <ul class="small text-muted ps-3 mb-0">${bullets}</ul>
      `;
      container.appendChild(card);
    });
  }

  // Wallpaper Personalization list
  function renderWallpaperSelectors() {
    const gallery = document.getElementById("wallpaper-gallery");
    const quickList = document.getElementById("quick-wallpaper-list");

    gallery.innerHTML = "";
    quickList.innerHTML = "";

    system.wallpapers.forEach((wall, idx) => {
      // Main settings list
      const col = document.createElement("div");
      col.className = "col-6 col-md-3";
      col.innerHTML = `
        <div class="wallpaper-thumb shadow-sm" style="background: ${wall.value}; background-size: cover;" title="${wall.name}"></div>
      `;
      col.firstElementChild.addEventListener("click", () => applyWallpaper(idx));
      gallery.appendChild(col);

      // System Tray mini circles
      const circle = document.createElement("div");
      circle.className = "mini-wallpaper-dot";
      circle.style.width = "24px";
      circle.style.height = "24px";
      circle.style.borderRadius = "50%";
      circle.style.background = wall.value;
      circle.style.cursor = "pointer";
      circle.title = wall.name;
      circle.addEventListener("click", () => applyWallpaper(idx));
      quickList.appendChild(circle);
    });

    applyWallpaper(state.activeWallpaper);
  }

  // Settings Navigation Tabs Toggle
  document.querySelectorAll(".settings-menu-item").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".settings-menu-item").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const tabId = btn.dataset.tab;
      document.querySelectorAll(".settings-tab-pane").forEach(pane => pane.classList.add("d-none"));
      document.getElementById(`tab-${tabId}`).classList.remove("d-none");
    });
  });

  // Windows Update simulation check
  const btnCheckUpdates = document.getElementById("btn-check-updates");
  btnCheckUpdates.addEventListener("click", () => {
    btnCheckUpdates.disabled = true;
    document.getElementById("update-title").textContent = "Checking for updates...";

    setTimeout(() => {
      document.getElementById("update-title").textContent = "You're up to date";
      const now = new Date();
      const checkStr = `Today at ${now.getHours() % 12 || 12}:${String(now.getMinutes()).padStart(2, "0")} ${now.getHours() >= 12 ? 'PM' : 'AM'}`;
      document.getElementById("update-details").textContent = `Last checked: ${checkStr}`;
      btnCheckUpdates.disabled = false;
      triggerNotification("Windows Update", "Your device is running the latest build version.", "bi-arrow-clockwise text-success");
    }, 2000);
  });

  // ==================== PROJECTS EXPLORER APP RENDERING ====================
  function renderProjectsGrid(filter) {
    const grid = document.getElementById("explorer-grid");
    grid.innerHTML = "";

    const filtered = filter === "all" ? projects : projects.filter(p => p.category === filter);

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="col-12 text-center py-5 text-muted">
          <i class="bi bi-folder-x fs-1 d-block mb-2"></i>
          <span>No folders found in this directory.</span>
        </div>
      `;
      return;
    }

    filtered.forEach(p => {
      const col = document.createElement("div");
      col.className = "col-6 col-sm-4 col-md-3";

      col.innerHTML = `
        <div class="folder-card text-center d-flex flex-column align-items-center justify-content-center">
          <i class="bi bi-folder-fill folder-icon"></i>
          <span class="project-title mt-2 text-truncate w-100" title="${p.title}">${p.title}</span>
          <span class="project-summary text-truncate w-100">${p.summary}</span>
        </div>
      `;

      // Double click to open folder contents (details panel)
      col.firstElementChild.addEventListener("click", () => {
        renderProjectDetails(p.id);
      });
      grid.appendChild(col);
    });

    document.getElementById("explorer-current-path").textContent = filter.charAt(0).toUpperCase() + filter.slice(1).replace("-", " ");
  }

  // Sidebar item filters
  document.querySelectorAll(".sidebar-item").forEach(item => {
    item.addEventListener("click", () => {
      document.querySelectorAll(".sidebar-item").forEach(el => el.classList.remove("active"));
      item.classList.add("active");

      const filter = item.dataset.filter;
      state.explorerCurrentFilter = filter;

      // Append to history
      if (state.explorerHistory[state.explorerHistoryIndex] !== filter) {
        state.explorerHistory = state.explorerHistory.slice(0, state.explorerHistoryIndex + 1);
        state.explorerHistory.push(filter);
        state.explorerHistoryIndex++;
      }

      updateExplorerNavButtons();
      renderProjectsGrid(filter);
    });
  });

  function updateExplorerNavButtons() {
    const backBtn = document.getElementById("btn-exp-back");
    const forwardBtn = document.getElementById("btn-exp-forward");

    backBtn.disabled = state.explorerHistoryIndex === 0;
    forwardBtn.disabled = state.explorerHistoryIndex >= state.explorerHistory.length - 1;
  }

  document.getElementById("btn-exp-back").addEventListener("click", () => {
    if (state.explorerHistoryIndex > 0) {
      state.explorerHistoryIndex--;
      const filter = state.explorerHistory[state.explorerHistoryIndex];
      state.explorerCurrentFilter = filter;

      // Update sidebar active state
      document.querySelectorAll(".sidebar-item").forEach(el => {
        if (el.dataset.filter === filter) el.classList.add("active");
        else el.classList.remove("active");
      });

      updateExplorerNavButtons();
      renderProjectsGrid(filter);
    }
  });

  document.getElementById("btn-exp-forward").addEventListener("click", () => {
    if (state.explorerHistoryIndex < state.explorerHistory.length - 1) {
      state.explorerHistoryIndex++;
      const filter = state.explorerHistory[state.explorerHistoryIndex];
      state.explorerCurrentFilter = filter;

      document.querySelectorAll(".sidebar-item").forEach(el => {
        if (el.dataset.filter === filter) el.classList.add("active");
        else el.classList.remove("active");
      });

      updateExplorerNavButtons();
      renderProjectsGrid(filter);
    }
  });

  // Projects search filter
  document.getElementById("explorer-project-search").addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    const grid = document.getElementById("explorer-grid");

    if (!query.trim()) {
      renderProjectsGrid(state.explorerCurrentFilter);
      return;
    }

    grid.innerHTML = "";
    const filtered = projects.filter(p =>
      p.title.toLowerCase().includes(query) ||
      p.summary.toLowerCase().includes(query) ||
      p.tags.some(t => t.toLowerCase().includes(query))
    );

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="col-12 text-center py-5 text-muted">
          <i class="bi bi-search fs-1 d-block mb-2"></i>
          <span>No matching projects found.</span>
        </div>
      `;
      return;
    }

    filtered.forEach(p => {
      const col = document.createElement("div");
      col.className = "col-6 col-sm-4 col-md-3";
      col.innerHTML = `
        <div class="folder-card text-center d-flex flex-column align-items-center justify-content-center">
          <i class="bi bi-folder-fill folder-icon"></i>
          <span class="project-title mt-2 text-truncate w-100" title="${p.title}">${p.title}</span>
          <span class="project-summary text-truncate w-100">${p.summary}</span>
        </div>
      `;
      col.firstElementChild.addEventListener("click", () => renderProjectDetails(p.id));
      grid.appendChild(col);
    });
  });

  // Show detailed slide-in inside explorer window
  function renderProjectDetails(id) {
    const project = projects.find(p => p.id === id);
    if (!project) return;

    const grid = document.getElementById("explorer-grid");

    const tagsHtml = project.tags.map(t => `<span class="badge bg-secondary me-1">${t}</span>`).join("");
    const pointsHtml = project.features.map(f => `<li>${f}</li>`).join("");

    grid.innerHTML = `
      <div class="col-12">
        <div class="p-3 bg-glass-card rounded border">
          <div class="detail-view-header d-flex justify-content-between align-items-center mb-3">
            <h5 class="fw-bold mb-0 text-primary"><i class="bi bi-file-earmark-code me-2"></i>${project.title}</h5>
            <button class="btn btn-sm btn-outline-secondary" id="btn-back-to-grid"><i class="bi bi-arrow-left"></i> Back to Directory</button>
          </div>
          <div class="detail-view-body">
            <p class="mb-3 fs-6 lead">${project.description}</p>
            
            <h6 class="fw-bold mb-2">Key Features:</h6>
            <ul class="ps-3 mb-3">${pointsHtml}</ul>
            
            <h6 class="fw-bold mb-2">Technologies Used:</h6>
            <div class="mb-4">${tagsHtml}</div>
            
            <div class="d-flex gap-3">
              <a href="${project.github}" target="_blank" class="btn btn-sm btn-primary d-flex align-items-center gap-1"><i class="bi bi-github"></i> Repository</a>
              <a href="${project.demo}" target="_blank" class="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"><i class="bi bi-box-arrow-up-right"></i> Live Demo</a>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById("btn-back-to-grid").addEventListener("click", () => {
      renderProjectsGrid(state.explorerCurrentFilter);
    });

    document.getElementById("explorer-current-path").textContent = `This PC > Projects > ${project.title}`;
  }

  // Initial projects render
  renderProjectsGrid("all");

  // ==================== SKILLS TASK MANAGER RENDERING ====================
  function renderSkillsProcesses() {
    const container = document.getElementById("skills-process-list");
    container.innerHTML = "";

    let pid = 1024;
    Object.keys(skills).forEach(cat => {
      skills[cat].forEach(s => {
        pid += 12;
        const row = document.createElement("tr");

        row.innerHTML = `
          <td>
            <i class="bi ${s.icon || 'bi-cpu-fill'} me-2 text-success"></i>
            <span class="fw-bold">${s.name}</span>
          </td>
          <td class="text-end text-success small">Running</td>
          <td class="text-end">
            <div class="d-flex align-items-center justify-content-end gap-2">
              <span class="small font-monospace">${s.level}%</span>
              <div class="progress progress-thin" style="width: 60px;">
                <div class="progress-bar bg-success" style="width: ${s.level}%"></div>
              </div>
            </div>
          </td>
          <td class="text-end">
            <button class="btn btn-xs btn-outline-danger py-0 px-2 btn-end-task" style="font-size:0.65rem;" data-name="${s.name}">End Task</button>
          </td>
        `;

        // Add option to "End Task" (simulated toast and status change)
        row.querySelector(".btn-end-task").addEventListener("click", (e) => {
          const btn = e.target;
          const statusCell = row.children[1];
          const levelBar = row.querySelector(".progress-bar");
          const levelText = row.querySelector(".font-monospace");

          if (btn.textContent === "End Task") {
            btn.textContent = "Restart";
            btn.className = "btn btn-xs btn-outline-success py-0 px-2 btn-end-task";
            statusCell.textContent = "Suspended";
            statusCell.className = "text-end text-danger small";
            levelBar.style.width = "0%";
            levelText.textContent = "0%";
            triggerNotification("Task Manager", `Suspended process engine: ${s.name}`, "bi-exclamation-triangle-fill text-danger");
          } else {
            btn.textContent = "End Task";
            btn.className = "btn btn-xs btn-outline-danger py-0 px-2 btn-end-task";
            statusCell.textContent = "Running";
            statusCell.className = "text-end text-success small";
            levelBar.style.width = `${s.level}%`;
            levelText.textContent = `${s.level}%`;
            triggerNotification("Task Manager", `Resumed process engine: ${s.name}`, "bi-play-circle-fill text-success");
          }
        });

        container.appendChild(row);
      });
    });
  }

  // Tab buttons click inside Task Manager
  document.querySelectorAll(".taskmgr-tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".taskmgr-tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const tabId = btn.dataset.taskTab;
      if (tabId === "processes") {
        document.getElementById("taskmgr-processes").classList.remove("d-none");
        document.getElementById("taskmgr-performance").classList.add("d-none");
      } else {
        document.getElementById("taskmgr-processes").classList.add("d-none");
        document.getElementById("taskmgr-performance").classList.remove("d-none");
        initPerformanceChart(state.activePerfMetric);
      }
    });
  });

  // Performance Tab sub-cards metric selectors
  document.querySelectorAll(".perf-metric-card").forEach(card => {
    card.addEventListener("click", () => {
      document.querySelectorAll(".perf-metric-card").forEach(c => c.classList.remove("active"));
      card.classList.add("active");

      const metric = card.dataset.metric;
      state.activePerfMetric = metric;
      initPerformanceChart(metric);
    });
  });

  // Performance live Chart.js renderer
  function initPerformanceChart(metric) {
    const canvas = document.getElementById("performance-chart");
    if (!canvas) return;

    if (state.performanceChart) {
      state.performanceChart.destroy();
    }

    // Customize text/info based on target metric
    let title = "Frontend Engine";
    let dataPoints = [40, 52, 60, 58, 68, 76, 85, 92];
    let strokeColor = "#0067b8";
    let bgColor = "rgba(0, 103, 184, 0.1)";
    let xpText = "4 Years XP";
    let efficiencyText = "92%";

    if (metric === "backend") {
      title = "Backend Core";
      dataPoints = [35, 42, 50, 48, 62, 70, 80, 85];
      strokeColor = "#10b981";
      bgColor = "rgba(16, 185, 129, 0.1)";
      xpText = "3 Years XP";
      efficiencyText = "85%";
    } else if (metric === "devops") {
      title = "DevOps & Network";
      dataPoints = [20, 30, 45, 52, 60, 68, 78, 82];
      strokeColor = "#f59e0b";
      bgColor = "rgba(245, 158, 11, 0.1)";
      xpText = "3 Years XP";
      efficiencyText = "82%";
    }

    document.getElementById("perf-chart-title").textContent = `${title} - Resource Monitor`;
    document.getElementById("perf-avg-xp").textContent = xpText;
    document.getElementById("perf-stat-efficiency").textContent = efficiencyText;
    document.getElementById("perf-stat-efficiency").className = `fw-bold fs-5 text-${metric === 'frontend' ? 'primary' : metric === 'backend' ? 'success' : 'warning'}`;

    const ctx = canvas.getContext("2d");
    state.performanceChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ["2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026"],
        datasets: [{
          label: 'Proficiency Engine',
          data: dataPoints,
          borderColor: strokeColor,
          backgroundColor: bgColor,
          borderWidth: 2,
          fill: true,
          tension: 0.35,
          pointRadius: 3,
          pointBackgroundColor: strokeColor
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            min: 0,
            max: 100,
            grid: { color: "rgba(128,128,128,0.1)" },
            ticks: { color: "gray", font: { size: 9 } }
          },
          x: {
            grid: { display: false },
            ticks: { color: "gray", font: { size: 9 } }
          }
        }
      }
    });

    // Run active waves simulation updater
    simulatePerformanceTicks(metric);
  }

  let chartTickerTimer = null;
  function simulatePerformanceTicks(metric) {
    if (chartTickerTimer) clearInterval(chartTickerTimer);

    chartTickerTimer = setInterval(() => {
      if (!state.performanceChart || state.activePerfMetric !== metric || !state.windows.taskmanager.isOpen || state.windows.taskmanager.isMinimized) return;

      const dataset = state.performanceChart.data.datasets[0];
      const data = dataset.data;

      // Random walk around peak proficiency to simulate live computer monitor ticks
      const peak = data[data.length - 1];
      const nextTick = Math.min(100, Math.max(70, peak + (Math.random() * 8 - 4)));

      // Update UI panels levels indicators
      const idStr = `val-${metric}`;
      const barId = `bar-${metric}`;
      document.getElementById(idStr).textContent = `${Math.round(nextTick)}%`;
      document.getElementById(barId).style.width = `${Math.round(nextTick)}%`;

      data.shift();
      data.push(nextTick);
      state.performanceChart.update("none");
    }, 2500);
  }

  // ==================== MAIL CONNECT (CONTACT FORM) ====================
  // Mail pane navigation folders
  document.querySelectorAll(".mail-folder-item").forEach(item => {
    item.addEventListener("click", () => {
      document.querySelectorAll(".mail-folder-item").forEach(el => el.classList.remove("active"));
      item.classList.add("active");

      const folder = item.dataset.folder;
      if (folder === "compose") {
        document.getElementById("mail-compose-pane").classList.remove("d-none");
        document.getElementById("mail-history-pane").classList.add("d-none");
      } else {
        document.getElementById("mail-compose-pane").classList.add("d-none");
        document.getElementById("mail-history-pane").classList.remove("d-none");
        renderSentEmailsHistory();
      }
    });
  });

  document.getElementById("btn-mail-new").addEventListener("click", () => {
    document.querySelector('.mail-folder-item[data-folder="compose"]').click();
  });

  const contactForm = document.getElementById("contact-form");
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("contact-email").value;
    const subject = document.getElementById("contact-subject").value;
    const message = document.getElementById("contact-message").value;

    const newMail = {
      email,
      subject,
      message,
      date: new Date().toLocaleString()
    };

    state.sentEmails.push(newMail);
    localStorage.setItem("win11-emails", JSON.stringify(state.sentEmails));

    triggerNotification("Mail Sent Successfully", `To: ${profile.name} - Subj: ${subject}`, "bi-check-circle-fill text-success");

    // Reset form
    contactForm.reset();
    updateSentMailCount();

    // Switch to sent log to verify
    document.querySelector('.mail-folder-item[data-folder="history"]').click();
  });

  function updateSentMailCount() {
    document.getElementById("mail-sent-count").textContent = state.sentEmails.length;
  }

  function renderSentEmailsHistory() {
    const list = document.getElementById("sent-emails-list");
    const noMail = document.getElementById("no-sent-emails");

    // Keep header placeholder visible if no mail
    if (state.sentEmails.length === 0) {
      noMail.classList.remove("d-none");
      list.querySelectorAll(".email-history-card").forEach(el => el.remove());
      return;
    }

    noMail.classList.add("d-none");
    // Clear old renders
    list.querySelectorAll(".email-history-card").forEach(el => el.remove());

    state.sentEmails.forEach(mail => {
      const card = document.createElement("div");
      card.className = "email-history-card mb-2";

      card.innerHTML = `
        <div class="d-flex justify-content-between mb-1">
          <span class="small fw-bold text-primary">From: ${mail.email}</span>
          <span class="date">${mail.date}</span>
        </div>
        <div class="subject mb-2">${mail.subject}</div>
        <div class="body">${mail.message}</div>
      `;

      list.appendChild(card);
    });
  }

  // ==================== COMMAND PROMPT (TERMINAL SCREEN) ====================
  const termInput = document.getElementById("term-input");
  const termOutput = document.getElementById("term-output");

  // Make clicking anywhere on terminal screen auto-focus the input line
  document.getElementById("win-terminal").querySelector(".terminal-container").addEventListener("click", () => {
    termInput.focus();
  });

  termInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const commandLine = termInput.value.trim();
      termInput.value = "";

      if (commandLine) {
        executeTerminalCommand(commandLine);
      }
    }
  });

  function termPrint(text, isHtml = false) {
    const line = document.createElement("div");
    if (isHtml) {
      line.innerHTML = text;
    } else {
      line.textContent = text;
    }
    termOutput.appendChild(line);
    // Auto Scroll bottom
    termOutput.scrollTop = termOutput.scrollHeight;
  }

  function executeTerminalCommand(cmdString) {
    // Print input echo first
    termPrint(`C:\\Users\\Developer> ${cmdString}`);

    const parts = cmdString.split(" ");
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (cmd) {
      case "help":
        termPrint(`Available commands:
  help      - Show this manual screen
  about     - Overview summary of Developer specifications
  neofetch  - Windows-themed developer neofetch system info
  projects  - Print all project folders matching profile
  skills    - List tech stack resource indexes
  contact   - Display official developer contact details
  theme     - Switch layout theme (usage: theme [dark|light])
  clear     - Clean the output logs screen`);
        break;

      case "clear":
        termOutput.innerHTML = "";
        break;

      case "about":
        termPrint(`ABOUT Areo Marvellous:
Role:     ${profile.title}
Location: ${profile.location}
Bio:      ${profile.bio}`);
        break;

      case "neofetch":
        const neofetchHtml = `
<div class="d-flex gap-4 align-items-start font-monospace text-light">
  <pre class="text-info mb-0" style="line-height: 1.1;">
   .-----------.
  /             \\
 /               \\
|   (o)     (o)   |
|                 |
|       ===       |
 \\               /
  \\             /
   '-----------'</pre>
  <div>
    <span class="text-info fw-bold">${profile.name}</span>@win11-portfolio
    <br>--------------------------
    <br><span class="text-info">OS:</span> Windows 11 Developer Portfolio
    <br><span class="text-info">Kernel:</span> WebKit / Chrome JS V8 Engine
    <br><span class="text-info">Shell:</span> Custom Portfolio Prompt v1.0
    <br><span class="text-info">Uptime:</span> Simulated Live
    <br><span class="text-info">Processor:</span> ${profile.title}
    <br><span class="text-info">Theme:</span> Fluent Glassmorphism
    <br><span class="text-info">Terminal:</span> JetBrains Mono Font
  </div>
</div>`;
        termPrint(neofetchHtml, true);
        break;

      case "projects":
        let projTable = `<table class="terminal-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Project Title</th>
              <th>Stack</th>
            </tr>
          </thead>
          <tbody>`;
        projects.forEach(p => {
          projTable += `<tr>
            <td>${p.id}</td>
            <td><strong>${p.title}</strong></td>
            <td>${p.tags.join(", ")}</td>
          </tr>`;
        });
        projTable += "</tbody></table>";
        termPrint(projTable, true);
        break;

      case "skills":
        let skillsTable = `<table class="terminal-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Skill</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>`;
        Object.keys(skills).forEach(cat => {
          skills[cat].forEach(s => {
            skillsTable += `<tr>
              <td>${cat.toUpperCase()}</td>
              <td>${s.name}</td>
              <td>${s.level}%</td>
            </tr>`;
          });
        });
        skillsTable += "</tbody></table>";
        termPrint(skillsTable, true);
        break;

      case "contact":
        termPrint(`GET IN TOUCH:
Email:    ${profile.email}
GitHub:   ${profile.socials.github}
LinkedIn: ${profile.socials.linkedin}`);
        break;

      case "theme":
        if (args[0] === "dark" || args[0] === "light") {
          applyTheme(args[0]);
          termPrint(`System theme adjusted to: ${args[0]} Mode`);
        } else {
          termPrint(`Invalid argument. Usage: theme [dark|light] (current: ${state.theme})`);
        }
        break;

      default:
        termPrint(`'${cmd}' is not recognized as an internal or external command,
operable program or batch file. Type 'help' for manual commands.`);
    }
  }

  // ==================== CALENDAR SETUP ====================
  let calDate = new Date();

  function setupCalendar() {
    document.getElementById("btn-cal-prev").addEventListener("click", () => {
      calDate.setMonth(calDate.getMonth() - 1);
      renderCalendarDays();
    });
    document.getElementById("btn-cal-next").addEventListener("click", () => {
      calDate.setMonth(calDate.getMonth() + 1);
      renderCalendarDays();
    });

    renderCalendarDays();
  }

  function renderCalendarDays() {
    const daysContainer = document.getElementById("calendar-days");
    const monthYear = document.getElementById("calendar-month-year");

    daysContainer.innerHTML = "";

    const year = calDate.getFullYear();
    const month = calDate.getMonth();

    // Set header
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    monthYear.textContent = `${months[month]} ${year}`;

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    // Empty cells for alignment
    for (let i = 0; i < firstDayIndex; i++) {
      const cell = document.createElement("div");
      cell.className = "cal-day-cell empty";
      daysContainer.appendChild(cell);
    }

    // Render actual days
    for (let d = 1; d <= totalDays; d++) {
      const cell = document.createElement("div");
      cell.className = "cal-day-cell";
      cell.textContent = d;

      // If it is today, mark active
      if (d === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
        cell.classList.add("active");
      }

      daysContainer.appendChild(cell);
    }
  }

});
