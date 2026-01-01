/* ================= SHEET IDS ================= */
const MUSIC_SHEET_ID = "1bAR9UhzVJdK2dh-PvE3LI0HP7wbA-lMVP-H_GEbSwG0";
const VIDEO_SHEET_ID = "1zCCxU949thb2YYrpl6qPZ-td4vJFAxUkY078oOl0Lwc";
const DEVOTIONALS_SHEET_ID = "1kEea5XwYqU7b0yEi1baFIibBOkb1MCJbNg2PM3qGo6g";
const EVENTS_SHEET_ID = "1GRZunQnbhg5POMFX3K_Qo4849rj9INXZMWIpViQkpCo";

/* ================= DOM ================= */
const mediaGrid = document.getElementById("mediaGrid");
const devotionalGrid = document.getElementById("devotionalGrid");
const eventsGrid = document.getElementById("eventsGrid");

/* ================= MEDIA PREVIEW ================= */
if (mediaGrid) {
  Promise.all([
    fetchSheet(MUSIC_SHEET_ID),
    fetchSheet(VIDEO_SHEET_ID)
  ])
    .then(([musicRows, videoRows]) => {
      mediaGrid.innerHTML = "";

      // AUDIO (2)
      musicRows.slice(0, 2).forEach(r => {
        const title = r.c[0]?.v;
        const artist = r.c[1]?.v;
        const cover = r.c[2]?.v;
        const audio = r.c[3]?.v;

        if (!title || !audio) return;

        mediaGrid.innerHTML += `
          <div class="media-card">
            <img src="${cover}">
            <h3>${title}</h3>
            <button onclick='playTrack(${JSON.stringify({
              title,
              artist,
              cover,
              audio
            })})'>▶ Play</button>
          </div>
        `;
      });

      // VIDEO (2)
      videoRows.slice(0, 2).forEach(r => {
        const title = r.c[0]?.v;
        const youtube = r.c[2]?.v;

        if (!title || !youtube) return;

        mediaGrid.innerHTML += `
          <div class="media-card">
            <img src="https://img.youtube.com/vi/${youtube}/hqdefault.jpg">
            <h3>${title}</h3>
          </div>
        `;
      });
    })
    .catch(err => {
      console.error("Media preview error:", err);
    });
}

/* ================= DEVOTIONALS ================= */
if (devotionalGrid) {
  fetchSheet(DEVOTIONALS_SHEET_ID)
    .then(rows => {
      devotionalGrid.innerHTML = "";

      rows.slice(0, 2).forEach(r => {
        const title = r.c[1]?.v;
        const body = r.c[4]?.v;
        const author = r.c[5]?.v;

        if (!title || !body) return;

        devotionalGrid.innerHTML += `
          <div class="devotional-card">
            <h3>${title}</h3>
            <p>${body.substring(0, 120)}...</p>
            <small>${author || ""}</small>
          </div>
        `;
      });
    })
    .catch(err => {
      console.error("Devotional preview error:", err);
    });
}

/* ================= EVENTS ================= */
if (eventsGrid) {
  fetchSheet(EVENTS_SHEET_ID)
    .then(rows => {
      eventsGrid.innerHTML = "";

      rows.slice(0, 2).forEach(r => {
        const date = r.c[0]?.v;
        const title = r.c[1]?.v;
        const location = r.c[2]?.v;

        if (!title) return;

        eventsGrid.innerHTML += `
          <div class="event-card">
            <strong>${date}</strong>
            <h3>${title}</h3>
            <p>${location}</p>
          </div>
        `;
      });
    })
    .catch(err => {
      console.error("Events preview error:", err);
    });
}
