/* ================= SHEET IDS ================= */
const SHEETS = {
  music: "1bAR9UhzVJdK2dh-PvE3LI0HP7wbA-lMVP-H_GEbSwG0",
  video: "1zCCxU949thb2YYrpl6qPZ-td4vJFAxUkY078oOl0Lwc",
  devotionals: "1kEea5XwYqU7b0yEi1baFIibBOkb1MCJbNg2PM3qGo6g",
  events: "1GRZunQnbhg5POMFX3K_Qo4849rj9INXZMWIpViQkpCo",
  gallery: "1IsaPFkHyEcQtTBt_vXqf0o08kiyc08rs3bUFut5PWJ8"
};

/* ================= FETCH HELPER ================= */
const fetchData =
  typeof cachedFetchSheet === "function"
    ? cachedFetchSheet
    : fetchSheet;

/* ================= DOM ================= */
const mediaGrid = document.getElementById("mediaGrid");
const todayDevotionalCard = document.getElementById("todayDevotionalCard");
const eventsGrid = document.getElementById("eventsGrid");
const galleryPreviewGrid = document.getElementById("galleryPreviewGrid");

/* ================= HELPERS ================= */
function parseDate(val) {
  if (!val) return null;
  const d = new Date(val);
  return isNaN(d) ? null : d;
}

/* ================= MEDIA PREVIEW ================= */
if (mediaGrid) {
  Promise.all([
    fetchData(SHEETS.music),
    fetchData(SHEETS.video)
  ])
    .then(([musicRows, videoRows]) => {
      mediaGrid.innerHTML = "";

      musicRows
        .map(r => ({
          title: r.c[0]?.v,
          cover: r.c[2]?.v,
          audio: r.c[3]?.v,
          date: parseDate(r.c[4]?.v)
        }))
        .filter(m => m.title && m.audio)
        .sort((a, b) => b.date - a.date)
        .slice(0, 2)
        .forEach(m => {
          mediaGrid.innerHTML += `
            <div class="media-card">
              <img src="${m.cover || ""}">
              <h3>${m.title}</h3>
              <button onclick='playTrack(${JSON.stringify(m)})'>▶ Play</button>
            </div>
          `;
        });

      videoRows
        .map(r => ({
          title: r.c[0]?.v,
          youtube: r.c[2]?.v
        }))
        .filter(v => v.title && v.youtube)
        .slice(0, 2)
        .forEach(v => {
          mediaGrid.innerHTML += `
            <div class="media-card">
              <img src="https://img.youtube.com/vi/${v.youtube}/hqdefault.jpg">
              <h3>${v.title}</h3>
            </div>
          `;
        });
    })
    .catch(err => {
      console.error("Media preview error:", err);
    });
}

/* ================= TODAY'S DEVOTIONAL ================= */
if (todayDevotionalCard) {
  fetchData(SHEETS.devotionals)
    .then(rows => {
      const devotionals = rows
        .map(r => ({
          date: parseDate(r.c[0]?.v),
          title: r.c[1]?.v,
          scripture: r.c[2]?.v,
          ref: r.c[3]?.v,
          body: r.c[4]?.v
        }))
        .filter(d => d.title && d.body)
        .sort((a, b) => b.date - a.date);

      if (!devotionals.length) return;

      const today = new Date().toDateString();
      const d =
        devotionals.find(x => x.date?.toDateString() === today) ||
        devotionals[0];

      todayDevotionalCard.innerHTML = `
        <div class="devotional-card">
          <span class="badge">Today</span>
          <h3>${d.title}</h3>
          <blockquote>
            <p>${d.scripture || ""}</p>
            <cite>${d.ref || ""}</cite>
          </blockquote>
          <p>${d.body.slice(0, 160)}…</p>
          <a href="devotionals.html">Read Full →</a>
        </div>
      `;
    })
    .catch(err => {
      console.error("Devotional preview error:", err);
    });
}

/* ================= EVENTS PREVIEW ================= */
if (eventsGrid) {
  fetchData(SHEETS.events)
    .then(rows => {
      eventsGrid.innerHTML = "";

      rows
        .map(r => ({
          date: r.c[0]?.v,
          title: r.c[1]?.v,
          location: r.c[2]?.v
        }))
        .filter(e => e.title)
        .slice(0, 2)
        .forEach(e => {
          eventsGrid.innerHTML += `
            <div class="event-card">
              <strong>${e.date || ""}</strong>
              <h3>${e.title}</h3>
              <p>${e.location || ""}</p>
            </div>
          `;
        });
    })
    .catch(err => {
      console.error("Events preview error:", err);
    });
}

/* ================= GALLERY PREVIEW ================= */
if (galleryPreviewGrid) {
  fetchData(SHEETS.gallery)
    .then(rows => {
      galleryPreviewGrid.innerHTML = "";

      rows
        .filter(r => r.c && r.c[2]?.v)
        .slice(0, 6)
        .forEach(r => {
          galleryPreviewGrid.innerHTML += `
            <a href="gallery.html" class="gallery-preview-item">
              <img src="${r.c[2].v}" alt="">
            </a>
          `;
        });
    })
    .catch(err => {
      console.error("Gallery preview error:", err);
    });
}
