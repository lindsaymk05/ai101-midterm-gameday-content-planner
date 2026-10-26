const STORAGE_KEY = "gameday-content-planner-v2";

const defaultTasks = [
  { id: "graphic", title: "Create the game-day graphic", detail: "Confirm opponent, date, time, and location.", category: "PREGAME" },
  { id: "announcement", title: "Publish the game-day announcement", detail: "Include stream, tickets, or live stats when available.", category: "PREGAME" },
  { id: "lineup", title: "Share the starting lineup", detail: "Double-check names, numbers, and spelling.", category: "WARMUPS" },
  { id: "warmups", title: "Capture warmups and arrival content", detail: "Get a mix of photos, vertical video, and atmosphere.", category: "WARMUPS" },
  { id: "score", title: "Post a score update", detail: "Verify the score before publishing.", category: "IN-GAME" },
  { id: "highlights", title: "Capture key plays and highlights", detail: "Prioritize sharp, usable clips and standout moments.", category: "IN-GAME" },
  { id: "final", title: "Create and publish the final score", detail: "Confirm the official final score and result.", category: "POSTGAME" },
  { id: "recap", title: "Publish a postgame recap", detail: "Include key performances, stats, and a photo or clip.", category: "POSTGAME" }
];

const $ = (id) => document.getElementById(id);
let state = loadState();
let toastTimeout;

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && Array.isArray(saved.tasks)) {
      return {
        tasks: saved.tasks,
        sport: saved.sport || "Women's Lacrosse",
        opponent: saved.opponent || "",
        date: saved.date || "",
        time: saved.time || ""
      };
    }
  } catch (error) {
    console.warn("Could not load saved planner data.", error);
  }
  return {
    tasks: defaultTasks.map(task => ({ ...task, completed: false, custom: false })),
    sport: "Women's Lacrosse",
    opponent: "",
    date: "",
    time: ""
  };
}

function saveState(showMessage = false) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    if (showMessage) showToast("Saved on this device.");
  } catch (error) {
    showToast("Could not save. Check your browser storage settings.");
  }
}

function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove("show"), 2300);
}

function renderTasks() {
  const container = $("checklist-items");
  container.replaceChildren();

  state.tasks.forEach(task => {
    const row = document.createElement("div");
    row.className = `task-row${task.completed ? " completed" : ""}`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-check";
    checkbox.checked = Boolean(task.completed);
    checkbox.setAttribute("aria-label", `Mark ${task.title} complete`);
    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      saveState();
      renderTasks();
      updateProgress();
    });

    const copy = document.createElement("div");
    copy.className = "task-copy";
    const title = document.createElement("strong");
    title.textContent = task.title;
    const detail = document.createElement("small");
    detail.textContent = task.detail || (task.custom ? "Custom task" : "Game-day task");
    copy.append(title, detail);
    row.append(checkbox, copy);

    if (!task.custom) {
      const category = document.createElement("span");
      category.className = "task-category";
      category.textContent = task.category;
      row.append(category);
    } else {
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "task-delete";
      remove.textContent = "×";
      remove.setAttribute("aria-label", `Delete ${task.title}`);
      remove.title = "Delete custom task";
      remove.addEventListener("click", () => {
        state.tasks = state.tasks.filter(item => item.id !== task.id);
        saveState();
        renderTasks();
        updateProgress();
        showToast("Custom task removed.");
      });
      row.append(remove);
    }
    container.append(row);
  });

  $("total-count").textContent = state.tasks.length;
  updateProgress();
}

function updateProgress() {
  const total = state.tasks.length;
  const completed = state.tasks.filter(task => task.completed).length;
  const percent = total ? Math.round((completed / total) * 100) : 0;

  $("completed-count").textContent = completed;
  $("total-count").textContent = total;
  $("progress-percent").textContent = percent;
  $("task-count-badge").textContent = `${completed} / ${total}`;
  $("progress-fill").style.width = `${percent}%`;
  $("mini-progress").style.width = `${percent}%`;
  $("progress-track").setAttribute("aria-valuenow", String(percent));

  let caption = "A fresh start. Let's get organized.";
  if (percent === 100 && total > 0) caption = "You're ready. Great work!";
  else if (percent >= 70) caption = "Almost there. Finish strong!";
  else if (percent >= 35) caption = "Nice progress. Keep it moving!";
  else if (completed > 0) caption = "Good start. Keep checking things off.";
  $("completion-caption").textContent = caption;
}

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(`${dateString}T12:00:00`);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(date);
}

function formatTime(timeString) {
  if (!timeString) return "";
  const [hours, minutes] = timeString.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(date);
}

function updateGameSummary() {
  const sport = state.sport;
  const opponent = state.opponent.trim();
  const date = formatDate(state.date);
  const time = formatTime(state.time);
  const details = [date, time].filter(Boolean).join(" · ");

  $("game-title").textContent = opponent ? `${sport} vs. ${opponent}` : "Make every moment count.";
  $("game-summary").textContent = [details, opponent ? "Your game-day content plan is ready to go." : "Add your matchup details to build your game-day plan."].filter(Boolean).join("  •  ");
  $("today-label").textContent = date ? date.toUpperCase() : "YOUR GAME DAY";
}

function setGameField(id, key) {
  $(id).value = state[key];
  $(id).addEventListener("input", () => {
    state[key] = $(id).value;
    updateGameSummary();
    saveState();
  });
  $(id).addEventListener("change", () => {
    state[key] = $(id).value;
    updateGameSummary();
    saveState();
  });
}


// CesiumJS 3D venue explorer. Uses demonstration locations, not official event data.
const venueLocations = {
  "alvernia": {
    name: "Alvernia University",
    description: "A sample home-campus location for planning Golden Wolves game-day coverage.",
    location: "Reading, Pennsylvania",
    longitude: -75.9349,
    latitude: 40.3078,
    height: 8000
  },
  "penn-state": {
    name: "Penn State",
    description: "A sample college venue location for comparing away-game coverage.",
    location: "University Park, Pennsylvania",
    longitude: -77.8599,
    latitude: 40.7982,
    height: 12000
  },
  "villanova": {
    name: "Villanova University",
    description: "A sample college venue location in the Philadelphia area.",
    location: "Villanova, Pennsylvania",
    longitude: -75.3372,
    latitude: 40.0379,
    height: 9000
  },
  "maryland": {
    name: "University of Maryland",
    description: "A sample college venue location in the Washington, D.C. area.",
    location: "College Park, Maryland",
    longitude: -76.9378,
    latitude: 38.9897,
    height: 11000
  },
  "syracuse": {
    name: "Syracuse University",
    description: "A sample college venue location in central New York.",
    location: "Syracuse, New York",
    longitude: -76.1351,
    latitude: 43.0392,
    height: 10000
  }
};

let cesiumViewer = null;
let venueEntities = {};

function setVenueDetails(key) {
  const venue = venueLocations[key];
  if (!venue) return;
  $("venue-name").textContent = venue.name;
  $("venue-description").textContent = venue.description;
  $("venue-coordinates").textContent = venue.location;
  $("venue-select").value = key;
}

function focusVenue(key) {
  const venue = venueLocations[key];
  if (!venue) return;
  setVenueDetails(key);
  if (cesiumViewer) {
    cesiumViewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(venue.longitude, venue.latitude, venue.height),
      duration: 1.2
    });
    Object.entries(venueEntities).forEach(([id, entity]) => {
      entity.point.pixelSize = id === key ? 15 : 10;
      entity.point.outlineWidth = id === key ? 3 : 2;
    });
  }
}

function initCesiumVenueExplorer() {
  const status = $("cesium-status");
  if (!window.Cesium || !$("cesium-globe")) {
    status.textContent = "The 3D globe library did not load. Check your internet connection or try refreshing the page.";
    return;
  }

  try {
    cesiumViewer = new Cesium.Viewer("cesium-globe", {
      animation: false,
      timeline: false,
      geocoder: false,
      homeButton: true,
      sceneModePicker: false,
      navigationHelpButton: true,
      baseLayerPicker: false,
      fullscreenButton: false,
      infoBox: false,
      selectionIndicator: false,
      shouldAnimate: false,
      baseLayer: false,
      terrainProvider: new Cesium.EllipsoidTerrainProvider()
    });

    // Use real aerial/satellite imagery instead of illustrated street-map tiles.
    // ArcGIS World Imagery is a public imagery service; availability and usage
    // remain subject to the provider's service terms and rate limits.
    // Use Cesium's supported URL-template provider for Esri World Imagery tiles.
    // This avoids relying on ArcGisMapServerImageryProvider, which is unavailable
    // in some CesiumJS builds.
    cesiumViewer.imageryLayers.addImageryProvider(
      new Cesium.UrlTemplateImageryProvider({
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        credit: "Imagery © Esri and its contributors"
      })
    );

    Object.entries(venueLocations).forEach(([key, venue]) => {
      const entity = cesiumViewer.entities.add({
        id: key,
        name: venue.name,
        position: Cesium.Cartesian3.fromDegrees(venue.longitude, venue.latitude),
        point: {
          pixelSize: 10,
          color: Cesium.Color.fromCssColorString("#eeba2b"),
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 2,
          disableDepthTestDistance: Number.POSITIVE_INFINITY
        },
        label: {
          text: venue.name,
          font: "12px DM Sans",
          fillColor: Cesium.Color.WHITE,
          outlineColor: Cesium.Color.fromCssColorString("#171923"),
          outlineWidth: 3,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          pixelOffset: new Cesium.Cartesian2(0, -20),
          scaleByDistance: new Cesium.NearFarScalar(1.5e5, 1.0, 8.0e6, 0.5),
          disableDepthTestDistance: Number.POSITIVE_INFINITY
        },
        properties: { venueKey: key }
      });
      venueEntities[key] = entity;
    });

    cesiumViewer.selectedEntityChanged.addEventListener(entity => {
      if (entity && entity.properties && entity.properties.venueKey) {
        focusVenue(entity.properties.venueKey.getValue());
      }
    });

    $("venue-select").addEventListener("change", event => focusVenue(event.target.value));
    focusVenue("alvernia");
    status.textContent = "Drag to rotate · scroll to zoom · select a marker to explore";
    window.setTimeout(() => { if (status) status.textContent = ""; }, 6500);
  } catch (error) {
    console.error("Cesium venue explorer could not initialize.", error);
    status.textContent = "The globe could not initialize. It may be blocked by network settings or a Cesium service requirement.";
  }
}


function init() {
  $("sport").value = state.sport;
  $("sport").addEventListener("change", () => {
    state.sport = $("sport").value;
    updateGameSummary();
    saveState();
  });
  setGameField("opponent", "opponent");
  setGameField("game-date", "date");
  setGameField("game-time", "time");

  $("add-task-form").addEventListener("submit", event => {
    event.preventDefault();
    const input = $("new-task");
    const title = input.value.trim();
    if (!title) {
      input.focus();
      showToast("Type a task first.");
      return;
    }
    state.tasks.push({
      id: `custom-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`,
      title,
      detail: "Custom task added by you.",
      category: "CUSTOM",
      completed: false,
      custom: true
    });
    input.value = "";
    saveState();
    renderTasks();
    showToast("Task added to your checklist.");
  });

  $("reset-checklist").addEventListener("click", () => {
    if (!window.confirm("Reset all checklist tasks and remove custom tasks? Your game details will stay saved.")) return;
    state.tasks = defaultTasks.map(task => ({ ...task, completed: false, custom: false }));
    saveState();
    renderTasks();
    showToast("Checklist reset.");
  });

  $("clear-game").addEventListener("click", () => {
    if (!window.confirm("Clear the sport, opponent, date, and time details? Your checklist will stay saved.")) return;
    state.sport = "Women's Lacrosse";
    state.opponent = "";
    state.date = "";
    state.time = "";
    $("sport").value = state.sport;
    $("opponent").value = "";
    $("game-date").value = "";
    $("game-time").value = "";
    updateGameSummary();
    saveState();
    showToast("Game details cleared.");
  });

  renderTasks();
  updateGameSummary();
  initCesiumVenueExplorer();
}

init();
