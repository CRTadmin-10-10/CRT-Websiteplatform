const STORAGE_KEY = "crt_teams_roster_v1";

const state = {
  activeTeam: "alpha",
  teams: {
    alpha: [],
    bravo: []
  }
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.teams) {
      state.teams = parsed.teams;
    }
  } catch (e) {
    console.warn("Failed to load roster from storage", e);
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ teams: state.teams }));
  } catch (e) {
    console.warn("Failed to save roster to storage", e);
  }
}

function renderTeam(teamKey) {
  const rosterEl = document.getElementById(teamKey + "-roster");
  const team = state.teams[teamKey];

  rosterEl.innerHTML = "";

  if (!team || team.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent =
      "No operators assigned yet. Use “Add operator” to populate " +
      (teamKey === "alpha" ? "Alpha Team." : "Bravo Team.");
    rosterEl.appendChild(empty);
    return;
  }

  team.forEach((op, index) => {
    const row = document.createElement("div");
    row.className = "operator-row";

    const main = document.createElement("div");
    main.className = "operator-main";

    const name = document.createElement("div");
    name.className = "operator-name";
    name.textContent = op.name || "Unnamed operator";

    const role = document.createElement("div");
    role.className = "operator-role";
    role.textContent = op.role || "No role set";

    main.appendChild(name);
    main.appendChild(role);

    const actions = document.createElement("div");
    actions.className = "operator-actions";

    const removeBtn = document.createElement("button");
    removeBtn.className = "small-btn danger";
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", () => {
      state.teams[teamKey].splice(index, 1);
      saveState();
      renderAll();
    });

    actions.appendChild(removeBtn);

    row.appendChild(main);
    row.appendChild(actions);

    rosterEl.appendChild(row);
  });
}

function renderSummary() {
  const alphaCount = state.teams.alpha.length;
  const bravoCount = state.teams.bravo.length;
  const total = alphaCount + bravoCount;

  document.getElementById("summary-alpha").textContent = alphaCount;
  document.getElementById("summary-bravo").textContent = bravoCount;
  document.getElementById("summary-total").textContent = total;
  document.getElementById("active-operators-count").textContent = total;

  let capacity = 0;
  if (alphaCount >= 4) capacity++;
  if (bravoCount >= 4) capacity++;
  document.getElementById("summary-capacity").textContent = capacity + " / 2";
}

function renderAll() {
  renderTeam("alpha");
  renderTeam("bravo");
  renderSummary();
}

function openModal(teamKey) {
  state.activeTeam = teamKey;
  const label = document.getElementById("modal-team-label");
  label.textContent = "Assigning to: " + (teamKey === "alpha" ? "Alpha Team" : "Bravo Team");
  document.getElementById("operator-name-input").value = "";
  document.getElementById("operator-role-input").value = "";
  document.getElementById("modal-backdrop").style.display = "flex";
}

function closeModal() {
  document.getElementById("modal-backdrop").style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  loadState();
  renderAll();

  document.querySelectorAll(".qa-btn[data-team]").forEach(btn => {
    btn.addEventListener("click", () => {
      const team = btn.getAttribute("data-team");
      openModal(team);
    });
  });

  document.getElementById("add-operator-global").addEventListener("click", () => {
    openModal("alpha");
  });

  document.getElementById("add-alpha-btn").addEventListener("click", () => openModal("alpha"));
  document.getElementById("add-bravo-btn").addEventListener("click", () => openModal("bravo"));

  document.getElementById("clear-alpha-btn").addEventListener("click", () => {
    if (confirm("Clear all operators from Alpha Team?")) {
      state.teams.alpha = [];
      saveState();
      renderAll();
    }
  });

  document.getElementById("clear-bravo-btn").addEventListener("click", () => {
    if (confirm("Clear all operators from Bravo Team?")) {
      state.teams.bravo = [];
      saveState();
      renderAll();
    }
  });

  document.getElementById("clear-all-btn").addEventListener("click", () => {
    if (confirm("Clear all operators from all teams?")) {
      state.teams.alpha = [];
      state.teams.bravo = [];
      saveState();
      renderAll();
    }
  });

  document.getElementById("modal-close").addEventListener("click", closeModal);
  document.getElementById("modal-cancel").addEventListener("click", closeModal);

  document.getElementById("modal-save").addEventListener("click", () => {
    const name = document.getElementById("operator-name-input").value.trim();
    const role = document.getElementById("operator-role-input").value.trim();

    if (!name) {
      alert("Enter an operator name.");
      return;
    }

    const team = state.activeTeam;
    if (!state.teams[team]) state.teams[team] = [];
    if (state.teams[team].length >= 4) {
      alert("This team is already at capacity (4 operators).");
      return;
    }

    state.teams[team].push({ name, role });
    saveState();
    renderAll();
    closeModal();
  });

  document.getElementById("modal-backdrop").addEventListener("click", (e) => {
    if (e.target.id === "modal-backdrop") {
      closeModal();
    }
  });
});