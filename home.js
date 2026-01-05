/* ================= SHEET IDS ================= */
const SHEETS = {
  music: "1bAR9UhzVJdK2dh-PvE3LI0HP7wbA-lMVP-H_GEbSwG0",
  video: "1zCCxU949thb2YYrpl6qPZ-td4vJFAxUkY078oOl0Lwc",
  devotionals: "1kEea5XwYqU7b0yEi1baFIibBOkb1MCJbNg2PM3qGo6g",
  events: "1GRZunQnbhg5POMFX3K_Qo4849rj9INXZMWIpViQkpCo",
  gallery: "1IsaPFkHyEcQtTBt_vXqf0o08kiyc08rs3bUFut5PWJ8"
};

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
    cachedFetchSheet(SHEETS.music),
    cachedFetchSheet(SHEETS.video)
  ])
    .then(([musicRows, videoRows]) => {
      mediaGrid.innerHTML = "";

      const music = musicRows
        .map(r => ({
          title: r.c[0]?.v,
          artist: r.c[1]?.v,
          cover: r.c[2]?.v,
          audio: r.c[3]?.v,
          date: parseDate(r.c[4]?.v)
        }))
        .filter(m => m.title && m.audio)
        .sort((a, b) => b.date - a.date)
        .slice(0, 2);

      music.forEach(m => {
        mediaGrid.innerHTML += `
          <div class="media-card">
            <img src="${m.cover}">
            <h3>${m.title}</h3>
            <button onclick='playTrack(${JSON.stringify(m)})'>
              ▶ Play
            </button>
          </div>
        `;
      });

      const videos = videoRows
        .map(r => ({
          title: r.c[0]?.v,
          youtube: r.c[2]?.v
        }))
        .filter(v => v.title && v.youtube)
        .slice(0, 2);

      videos.forEach(v => {
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
      mediaGrid.innerHTML = `<p>Unable to load media.</p>`;
    });
}

/* ================= TODAY'S DEVOTIONAL ================= */
if (todayDevotionalCard) {
  cachedFetchSheet(SHEETS.devotionals)
    .then(rows => {
      const devotionals = rows
        .map(r => ({
          date: parseDate(r.c[0]?.v),
          title: r.c[1]?.v,
          scripture: r.c[2]?.v,
          ref: r.c[3]?.v,
          body: r.c[4]?.v,
          author: r.c[5]?.v
        }))
        .filter(d => d.title && d.body)
        .sort((a, b) => b.date - a.date);

      if (!devotionals.length) {
        todayDevotionalCard.innerHTML =
          `<p>No devotional available.</p>`;
        return;
      }

      const today = new Date().toDateString();

      const todays =
        devotionals.find(d =>
          d.date && d.date.toDateString() === today
        ) || devotionals[0];

      renderTodayDevotional(todays);
    })
    .catch(err => {
      console.error("Devotional error:", err);
      todayDevotionalCard.innerHTML =
        `<p>Unable to load devotional.</p>`;
    });
}

function renderTodayDevotional(d) {
  const excerpt =
    d.body.length > 160 ? d.body.slice(0, 160) + "…" : d.body;

  todayDevotionalCard.innerHTML = `
    <div class="devotional-card">
      <span class="badge">Today</span>

      <h3>${d.title}</h3>

      <blockquote>
        <p>${d.scripture}</p>
        <cite>${d.ref}</cite>
      </blockquote>

      <p class="excerpt">${excerpt}</p>

      <a href="devotionals.html" class="read-more">
        Read Full Devotional →
      </a>
    </div>
  `;
}

/* ================= EVENTS PREVIEW ================= */
if (eventsGrid) {
  cachedFetchSheet(SHEETS.events)
    .then(rows => {
      const events = rows
        .map(r => ({
          date: r.c[0]?.v,
          title: r.c[1]?.v,
          location: r.c[2]?.v
        }))
        .filter(e => e.title)
        .slice(0, 2);

      eventsGrid.innerHTML = "";

      events.forEach(e => {
        eventsGrid.innerHTML += `
          <div class="event-card">
            <strong>${e.date}</strong>
            <h3>${e.title}</h3>
            <p>${e.location || ""}</p>
          </div>
        `;
      });
    })
    .catch(err => {
      console.error("Events preview error:", err);
      eventsGrid.innerHTML = `<p>Unable to load events.</p>`;
    });
}

/* ================= GALLERY PREVIEW ================= */
if (galleryPreviewGrid) {
  cachedFetchSheet(SHEETS.gallery)
    .then(rows => {
      const images = rows
        .filter(r => r.c && r.c[2]?.v)
        .map(r => ({
          title: r.c[1]?.v,
          url: r.c[2]?.v
        }))
        .slice(0, 6);

      galleryPreviewGrid.innerHTML = "";

      if (!images.length) {
        galleryPreviewGrid.innerHTML =
          `<p>No gallery images yet.</p>`;
        return;
      }

      images.forEach(img => {
        galleryPreviewGrid.innerHTML += `
          <a href="gallery.html" class="gallery-preview-item">
            <img src="${img.url}" alt="${img.title || ""}">
          </a>
        `;
      });
    })
    .catch(err => {
      console.error("Gallery preview error:", err);
      galleryPreviewGrid.innerHTML =
        `<p>Unable to load gallery.</p>`;
    });
}





