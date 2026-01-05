const GALLERY_SHEET_ID = "1IsaPFkHyEcQtTBt_vXqf0o08kiyc08rs3bUFut5PWJ8";

const grid = document.getElementById("galleryGrid");
const filterBtns = document.querySelectorAll(".gallery-filters button");

let allImages = [];

cachedFetchSheet(GALLERY_SHEET_ID).then(rows => {
  allImages = rows
    .map(r => ({
      date: r.c[0]?.v,
      title: r.c[1]?.v,
      url: r.c[2]?.v,
      category: r.c[3]?.v || "Other",
      desc: r.c[4]?.v
    }))
    .filter(i => i.url);

  renderGallery(allImages);
});

function renderGallery(items) {
  grid.innerHTML = "";

  items.forEach(img => {
    const div = document.createElement("div");
    div.className = "gallery-item";

    div.innerHTML = `
      <img src="${img.url}" alt="${img.title || ""}">
      <div class="gallery-overlay">
        <div>
          <strong>${img.title || ""}</strong>
          <p>${img.category}</p>
        </div>
      </div>
    `;

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
