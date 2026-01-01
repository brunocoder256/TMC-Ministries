/* =========================
   SHEET ID
========================= */
const MUSIC_SHEET_ID = "1bAR9UhzVJdK2dh-PvE3LI0HP7wbA-lMVP-H_GEbSwG0";

/* =========================
   DOM
========================= */
const audioGrid = document.getElementById("audioGrid");
const searchInput = document.getElementById("audioSearch");

let allAudio = [];

/* =========================
   FETCH AUDIO
========================= */
fetchSheet(MUSIC_SHEET_ID).then(rows => {
  allAudio = rows
    .map(r => ({
      title: r.c[0]?.v,
      artist: r.c[1]?.v,
      cover: r.c[2]?.v,
      audio: r.c[3]?.v,
      date: r.c[4]?.v
    }))
    .filter(item => item.title && item.audio)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  renderAudio(allAudio);
});

/* =========================
   RENDER AUDIO
========================= */
function renderAudio(items) {
  audioGrid.innerHTML = "";

  if (items.length === 0) {
    audioGrid.innerHTML =
      `<p style="text-align:center;color:#6b7280;">No audio found.</p>`;
    return;
  }

  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "media-card";

    card.innerHTML = `
      <img src="${item.cover}" alt="${item.title}">
      <div class="content">
        <h3>${item.title}</h3>
        ${item.artist ? `<p>${item.artist}</p>` : ""}
        <button class="btn-play"
         onclick='playTrack(${JSON.stringify(item)})'>
         ▶ Play
        </button>

      </div>
    `;

    audioGrid.appendChild(card);
  });
}

/* =========================
   SEARCH
========================= */
searchInput.addEventListener("input", e => {
  const q = e.target.value.toLowerCase();

  const filtered = allAudio.filter(item =>
    item.title.toLowerCase().includes(q) ||
    (item.artist && item.artist.toLowerCase().includes(q))
  );

  renderAudio(filtered);
});
