const menuToggle = document.getElementById("menuToggle");
const nav = document.querySelector(".main-nav");

menuToggle?.addEventListener("click", () => {
  nav.classList.toggle("active");
});
