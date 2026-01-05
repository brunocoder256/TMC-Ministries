/* ================= SHEET ID ================= */
const EVENTS_SHEET_ID =
  "1GRZunQnbhg5POMFX3K_Qo4849rj9INXZMWIpViQkpCo";

/* ================= DOM ================= */
const eventsGrid = document.getElementById("eventsGrid");

/* ================= FETCH EVENTS ================= */
if (eventsGrid) {
  fetchSheet(EVENTS_SHEET_ID)
    .then(rows => {
      const events = rows
        .map(r => ({
          date: r.c[0]?.v,
          title: r.c[1]?.v,
          location: r.c[2]?.v,
          description: r.c[3]?.v // optional if exists
        }))
        .filter(e => e.title);

      if (!events.length) {
        eventsGrid.innerHTML =
          `<p style="text-align:center;color:#6b7280;">
            No events available.
          </p>`;
        return;
      }

      eventsGrid.innerHTML = "";

      events.forEach(e => {
        eventsGrid.innerHTML += `
          <div class="event-card fade-in">
            <strong>${e.date || ""}</strong>
            <h3>${e.title}</h3>
            ${e.location ? `<p>${e.location}</p>` : ""}
            ${e.description ? `<p>${e.description}</p>` : ""}
          </div>
        `;
      });
    })
    .catch(err => {
      console.error("Events page error:", err);
      eventsGrid.innerHTML =
        `<p>Unable to load events.</p>`;
    });
}
