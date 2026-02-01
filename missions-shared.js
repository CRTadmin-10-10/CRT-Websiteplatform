// Load missions from Supabase
async function loadMissions() {
  const { data, error } = await supabase
    .from("missions")
    .select("*");

  if (error) {
    console.error("Error loading missions:", error);
    return;
  }

  const list = document.getElementById("mission-list");
  list.innerHTML = "";

  data.forEach(m => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${m.title}</strong><br>
      Status: ${m.status}<br>
      Notes: ${m.notes}
    `;
    list.appendChild(li);
  });
}

// Add mission from form
async function addMissionFromForm() {
  const title = document.getElementById("missionTitle").value;
  const status = document.getElementById("missionStatus").value;
  const notes = document.getElementById("missionNotes").value;

  if (!title || !status) {
    alert("Please fill in the title and status.");
    return;
  }

  const { error } = await supabase
    .from("missions")
    .insert([{ title, status, notes }]);

  if (error) {
    console.error("Error adding mission:", error);
    return;
  }

  // Clear form
  document.getElementById("missionTitle").value = "";
  document.getElementById("missionStatus").value = "";
  document.getElementById("missionNotes").value = "";

  loadMissions();
}

// Load missions when page opens
loadMissions();
