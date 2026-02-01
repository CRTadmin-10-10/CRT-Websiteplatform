// Load roster from Supabase and show it on the page
async function loadRoster() {
  const { data, error } = await supabase
    .from("roster")
    .select("*");

  if (error) {
    console.error("Error loading roster:", error);
    return;
  }

  const list = document.getElementById("team-list");
  list.innerHTML = "";

  data.forEach(person => {
    const li = document.createElement("li");
    li.textContent = `${person.name} — ${person.role} (${person.team})`;
    list.appendChild(li);
  });
}

// Add operator from the form
async function addOperatorFromForm() {
  const name = document.getElementById("nameInput").value;
  const role = document.getElementById("roleInput").value;
  const team = document.getElementById("teamInput").value;

  if (!name || !role || !team) {
    alert("Please fill all boxes.");
    return;
  }

  const { error } = await supabase
    .from("roster")
    .insert([{ name, role, team }]);

  if (error) {
    console.error("Error adding operator:", error);
    return;
  }

  // Clear boxes
  document.getElementById("nameInput").value = "";
  document.getElementById("roleInput").value = "";
  document.getElementById("teamInput").value = "";

  // Reload roster
  loadRoster();
}

// Load roster when page opens
loadRoster();