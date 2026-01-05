const GALLERY_SHEET_ID =
  "1IsaPFkHyEcQtTBt_vXqf0o08kiyc08rs3bUFut5PWJ8";

const grid = document.getElementById("galleryGrid");
const filterBtns = document.querySelectorAll(".gallery-filters button");

let allImages = [];

/* ================= SAFE FETCH ================= */
const fetchGallerySheet =
  typeof cachedFetchSheet === "function"
    ? cachedFetchSheet
    : fetchSheet;

fetchGallerySheet(GALLERY_SHEET_ID)
  .then(rows => {
    allImages = rows
      .filter(r => r.c && r.c[2] && r.c[2].v) // ⬅ skip headers & empty rows
      .map(r => ({
        date: r.c[0]?.v,
        title: r.c[1]?.v || "",
        url: r.c[2]?.v?.trim(),
        category: r.c[3]?.v || "Other",
        desc: r.c[4]?.v || ""
      }));

    if (!allImages.length) {
      grid.innerHTML =
        `<p style="text-align:center">No images available.</p>`;
      return;
    }

    renderGallery(allImages);
  })
  .catch(err => {
    console.error("Gallery load error:", err);
    grid.innerHTML =
      `<p>Unable to load gallery.</p>`;
  });

/* ================= RENDER ================= */
function renderGallery(items) {
  grid.innerHTML = "";

  items.forEach(img => {
    const div = document.createElement("div");
    div.className = "gallery-item";

    const image = document.createElement("img");
    image.src = img.url;
    image.alt = img.title;

    const overlay = document.createElement("div");
    overlay.className = "gallery-overlay";
    overlay.innerHTML = `
      <div>
        <strong>${img.title}</strong>
        <p>${img.category}</p>
      </div>
    `;

    div.appendChild(image);
    div.appendChild(overlay);
    grid.appendChild(div);
  });
}

/* ================= FILTER ================= */
filterBtns.forEach(btn => {
  btn.onclick = () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const cat = btn.dataset.filter;

    renderGallery(
      cat === "all"
        ? allImages
        : allImages.filter(i => i.category === cat)
    );
  };
});
