const tasks = [
  {
    id: 1,
    title: "Create game-day graphic",
    description: "Prepare the matchup graphic for social media.",
    phase: "Pregame"
  },
  {
    id: 2,
    title: "Post game-day announcement",
    description: "Share the game time, location, and opponent.",
    phase: "Pregame"
  },
  {
    id: 3,
    title: "Share the starting lineup",
    description: "Publish the lineup before the game begins.",
    phase: "Pregame"
  },
  {
    id: 4,
    title: "Post warmup content",
    description: "Share photos or videos from warmups.",
    phase: "Pregame"
  },
  {
    id: 5,
    title: "Share a score update",
    description: "Post an in-game score update.",
    phase: "In-game"
  },
  {
    id: 6,
    title: "Capture game highlights",
    description: "Collect photos or videos of key moments.",
    phase: "In-game"
  },
  {
    id: 7,
    title: "Create the final score graphic",
    description: "Prepare the final score and result.",
    phase: "Postgame"
  },
  {
    id: 8,
    title: "Publish a postgame recap",
    description: "Share a recap, standout performances, or highlights.",
    phase: "Postgame"
  }
];

const scheduleItems = [
  {
    time: "2 hours before",
    phase: "Pregame",
    title: "Game-day announcement",
    description: "Publish the matchup graphic and remind fans about the game."
  },
  {
    time: "30 min before",
    phase: "Pregame",
    title: "Lineup and warmups",
    description: "Share the starting lineup and behind-the-scenes content."
  },
  {
    time: "During game",
    phase: "In-game",
    title: "Live updates",
    description: "Post score updates, key plays, and game photos."
  },
  {
    time: "After game",
    phase: "Postgame",
    title: "Final score and recap",
    description: "Publish the result, final score graphic, and highlights."
  }
];

const checklist = document.getElementById("checklist");
const progressText = document.getElementById("progressText");
const progressBar = document.getElementById("progressBar");
const sportSelect = document.getElementById("sport");
const opponentInput = document.getElementById("opponent");
const gameDateInput = document.getElementById("gameDate");
const schedule = document.getElementById("schedule");

let completedTasks = new Set();

function renderChecklist() {
  checklist.innerHTML = "";

  tasks.forEach((task) => {
    const row = document.createElement("div");
    row.className = "task";

    if (completedTasks.has(task.id)) {
      row.classList.add("completed");
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `task-${task.id}`;
    checkbox.checked = completedTasks.has(task.id);
    checkbox.setAttribute("aria-label", task.title);

    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        completedTasks.add(task.id);
      } else {
        completedTasks.delete(task.id);
      }

      renderChecklist();
      updateProgress();
    });

    const label = document.createElement("label");
    label.htmlFor = checkbox.id;

    const title = document.createElement("span");
    title.textContent = task.title;

    const description = document.createElement("small");
    description.textContent = `${task.phase} · ${task.description}`;

    label.appendChild(title);
    label.appendChild(description);

    row.appendChild(checkbox);
    row.appendChild(label);
    checklist.appendChild(row);
  });
}

function updateProgress() {
  const total = tasks.length;
  const completed = completedTasks.size;
  const percentage = total === 0
    ? 0
    : Math.round((completed / total) * 100);

  progressText.textContent = `${completed} of ${total} complete`;
  progressBar.style.width = `${percentage}%`;
  progressBar.setAttribute("role", "progressbar");
  progressBar.setAttribute("aria-valuemin", "0");
  progressBar.setAttribute("aria-valuemax", "100");
  progressBar.setAttribute("aria-valuenow", String(percentage));
}

function renderSchedule() {
  schedule.innerHTML = "";

  scheduleItems.forEach((item) => {
    const row = document.createElement("div");
    row.className = "schedule-item";

    const time = document.createElement("div");
    time.className = "schedule-time";
    time.textContent = item.time;

    const details = document.createElement("div");

    const title = document.createElement("h3");
    title.textContent = item.title;

    const description = document.createElement("p");
    description.textContent = item.description;

    details.appendChild(title);
    details.appendChild(description);

    row.appendChild(time);
    row.appendChild(details);
    schedule.appendChild(row);
  });
}

function updateGameDetails() {
  const sport = sportSelect.value;
  const opponent = opponentInput.value.trim();
  const date = gameDateInput.value;

  let details = `Planning for ${sport}`;

  if (opponent) {
    details += ` vs. ${opponent}`;
  }

  if (date) {
    details += ` · ${date}`;
  }

  document.title = `${sport} | GameDay Content Planner`;
  document.querySelector(".header > p:last-child").textContent = details;
}

sportSelect.addEventListener("change", updateGameDetails);
opponentInput.addEventListener("input", updateGameDetails);
gameDateInput.addEventListener("change", updateGameDetails);

renderChecklist();
updateProgress();
renderSchedule();
updateGameDetails();
