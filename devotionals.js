/* =========================
   SHEET ID
========================= */
const DEVOTIONALS_SHEET_ID =
  "1kEea5XwYqU7b0yEi1baFIibBOkb1MCJbNg2PM3qGo6g";

/* =========================
   DOM
========================= */
const list = document.getElementById("devotionalList");
const reader = document.getElementById("devotionalReader");

let devotionals = [];
let currentIndex = 0;

/* =========================
   HELPERS
========================= */
function formatDate(d) {
  const date = new Date(d);
  return date.toISOString().split("T")[0];
}

const today = formatDate(new Date());

/* =========================
   FETCH
========================= */
fetchSheet(DEVOTIONALS_SHEET_ID).then(rows => {
  devotionals = rows
    .map(r => ({
      date: r.c[0]?.v,
      title: r.c[1]?.v,
      scripture: r.c[2]?.v,
      ref: r.c[3]?.v,
      body: r.c[4]?.v,
      author: r.c[5]?.v
    }))
    .filter(d => d.title && d.body);

  renderList(devotionals);
});

/* =========================
   LIST + AUTO SELECT TODAY
========================= */
function renderList(items) {
  list.innerHTML = "";

  let todayIndex = -1;

  items.forEach((d, i) => {
    if (d.date) {
      const sheetDate = new Date(d.date).toDateString();
      const todayDate = new Date().toDateString();

      if (sheetDate === todayDate) {
        todayIndex = i;
      }
    }
  });

  // Fallback: if today not found, use first devotional
  if (todayIndex === -1) {
    todayIndex = 0;
  }

  items.forEach((d, i) => {
    const item = document.createElement("div");
    item.className = "devotional-item";
    item.textContent = d.title;

    if (i === todayIndex) {
      item.classList.add("active", "today");
      renderReader(d, i); // 🔥 THIS LINE FIXES EVERYTHING
    }

    item.onclick = () => {
      document
        .querySelectorAll(".devotional-item")
        .forEach(el =>
          el.classList.remove("active", "today")
        );

      item.classList.add("active");
      renderReader(d, i);
    };

    list.appendChild(item);
  });
}


/* =========================
   READER
========================= */
function renderReader(d, index) {
  currentIndex = index;

  reader.innerHTML = `
    <h2>${d.title}</h2>

    <div class="devotional-meta">
      <span>${d.date || ""}</span>
      ${d.author ? `<span>• ${d.author}</span>` : ""}
    </div>

    <blockquote>
      <p>${d.scripture}</p>
      <cite>${d.ref}</cite>
    </blockquote>

    <div class="devotional-body">
      ${d.body.replace(/\n/g, "<br><br>")}
    </div>

    <div class="devotional-actions">
      <button class="action-btn whatsapp" onclick="shareDevotional()">
        Share on WhatsApp
      </button>

      <button class="action-btn copy" onclick="copyDevotional()">
        Copy Devotional
      </button>
    </div>
  `;
}

/* =========================
   SHARE
========================= */
function shareDevotional() {
  const d = devotionals[currentIndex];

  const text = `
${d.title}

"${d.scripture}"
(${d.ref})

${d.body}

— ${d.author || "TMC Ministries"}
`.trim();

  window.open(
    "https://wa.me/?text=" + encodeURIComponent(text),
    "_blank"
  );
}

/* =========================
   COPY
========================= */
function copyDevotional() {
  const d = devotionals[currentIndex];

  const text = `
${d.title}

"${d.scripture}"
(${d.ref})

${d.body}

— ${d.author || "TMC Ministries"}
`.trim();

  navigator.clipboard.writeText(text).then(() => {
    alert("Devotional copied ✔");
  });
}

