/* =========================
   SHEET ID
========================= */
const VIDEO_SHEET_ID = "1zCCxU949thb2YYrpl6qPZ-td4vJFAxUkY078oOl0Lwc";

/* =========================
   DOM
========================= */
const grid = document.getElementById("videoGrid");
const filter = document.getElementById("categoryFilter");

let allVideos = [];

/* =========================
   FETCH VIDEOS
========================= */
fetchSheet(VIDEO_SHEET_ID).then(rows => {
  allVideos = rows.map(r => ({
    title: r.c[0]?.v,
    description: r.c[1]?.v,
    youtube: r.c[2]?.v,
    category: r.c[3]?.v || "Other",
    date: r.c[4]?.v
  })).filter(v => v.youtube);

  populateCategories(allVideos);
  renderVideos(allVideos);
});

/* =========================
   CATEGORIES
========================= */
function populateCategories(videos) {
  const categories = [...new Set(videos.map(v => v.category))];

  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    filter.appendChild(opt);
  });
}

/* =========================
   RENDER
========================= */
function renderVideos(videos) {
  grid.innerHTML = "";

  videos.forEach(v => {
    const card = document.createElement("div");
    card.className = "media-card";

    card.innerHTML = `
      <div class="video-thumb">
        <img src="https://img.youtube.com/vi/${v.youtube}/hqdefault.jpg">
      </div>
      <div class="content">
        <h3>${v.title}</h3>
        <p>${v.description || ""}</p>
        <iframe
          src="https://www.youtube.com/embed/${v.youtube}"
          allowfullscreen
          loading="lazy">
        </iframe>
      </div>
    `;

    grid.appendChild(card);
  });
}

/* =========================
   FILTER
========================= */
filter.addEventListener("change", () => {
  const val = filter.value;
  renderVideos(val === "all"
    ? allVideos
    : allVideos.filter(v => v.category === val)
  );
});
