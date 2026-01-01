/* =========================
   SHEET ID
========================= */
const DEVOTIONALS_SHEET_ID = "1kEea5XwYqU7b0yEi1baFIibBOkb1MCJbNg2PM3qGo6g";

/* =========================
   DOM
========================= */
const list = document.getElementById("devotionalList");
const reader = document.getElementById("devotionalReader");

let devotionals = [];

/* =========================
   FETCH
========================= */
fetchSheet(DEVOTIONALS_SHEET_ID).then(rows => {
  devotionals = rows.map(r => ({
    date: r.c[0]?.v,
    title: r.c[1]?.v,
    scripture: r.c[2]?.v,
    ref: r.c[3]?.v,
    body: r.c[4]?.v,
    author: r.c[5]?.v
  })).filter(d => d.title && d.body);

  renderList(devotionals);

  if (devotionals.length) {
    renderReader(devotionals[0]);
  }
});

/* =========================
   LIST
========================= */
function renderList(items) {
  list.innerHTML = "";

  items.forEach((d, i) => {
    const item = document.createElement("div");
    item.className = "devotional-item";
    item.textContent = d.title;

    item.onclick = () => {
      document
        .querySelectorAll(".devotional-item")
        .forEach(el => el.classList.remove("active"));
      item.classList.add("active");
      renderReader(d);
    };

    if (i === 0) item.classList.add("active");
    list.appendChild(item);
  });
}

/* =========================
   READER
========================= */
function renderReader(d) {
  reader.innerHTML = `
    <h2>${d.title}</h2>

    <div class="devotional-meta">
      <span>${d.date}</span>
      ${d.author ? `<span>• ${d.author}</span>` : ""}
    </div>

    <blockquote>
      <p>${d.scripture}</p>
      <cite>${d.ref}</cite>
    </blockquote>

    <div class="devotional-body">
      ${d.body.replace(/\n/g, "<br><br>")}
    </div>
  `;
}
