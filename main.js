/* =====================
   MOBILE MENU TOGGLE
===================== */
const menuToggle = document.getElementById("menuToggle");
const nav = document.querySelector(".main-nav");

menuToggle?.addEventListener("click", () => {
  nav.classList.toggle("active");
});

// Close menu when clicking outside
document.addEventListener("click", (e) => {
  if (nav && nav.classList.contains("active")) {
    if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
      nav.classList.remove("active");
    }
  }
});

// Close menu when clicking a link
nav?.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("active");
  });
});

/* =====================
   FOOTER YEAR
===================== */
const yearElement = document.getElementById("year");
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

/* =====================
   SCROLL TO TOP BUTTON
===================== */
// Create scroll to top button
const scrollToTopBtn = document.createElement("button");
scrollToTopBtn.className = "scroll-to-top";
scrollToTopBtn.innerHTML = "↑";
scrollToTopBtn.setAttribute("aria-label", "Scroll to top");
document.body.appendChild(scrollToTopBtn);

// Show/hide scroll to top button
window.addEventListener("scroll", () => {
  if (window.pageYOffset > 300) {
    scrollToTopBtn.classList.add("visible");
  } else {
    scrollToTopBtn.classList.remove("visible");
  }
});

// Scroll to top on click
scrollToTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

/* =====================
   NOTIFICATION SYSTEM
===================== */
window.showNotification = function(title, message, type = "success") {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  
  // Icon based on type
  let icon = "✓";
  if (type === "error") icon = "✕";
  if (type === "warning") icon = "⚠";
  
  notification.innerHTML = `
    <div class="notification-icon">${icon}</div>
    <div class="notification-content">
      <div class="notification-title">${title}</div>
      <div class="notification-message">${message}</div>
    </div>
    <div class="notification-close">×</div>
  `;
  
  // Add to body
  document.body.appendChild(notification);
  
  // Close button
  const closeBtn = notification.querySelector(".notification-close");
  closeBtn.addEventListener("click", () => {
    notification.style.opacity = "0";
    notification.style.transform = "translateX(400px)";
    setTimeout(() => notification.remove(), 300);
  });
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.opacity = "0";
      notification.style.transform = "translateX(400px)";
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
};

/* =====================
   SMOOTH SCROLL FOR ANCHOR LINKS
===================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    const href = this.getAttribute("href");
    if (href !== "#" && href.length > 1) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    }
  });
});

/* =====================
   LAZY LOADING IMAGES
===================== */
if ("IntersectionObserver" in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
          img.classList.add("fade-in");
          observer.unobserve(img);
        }
      }
    });
  });

  // Observe all images with data-src attribute
  document.querySelectorAll("img[data-src]").forEach(img => {
    imageObserver.observe(img);
  });
}

/* =====================
   ADD ANIMATION ON SCROLL
===================== */
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("fade-in");
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe elements with animation classes
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".media-card, .event-card, .devotional-card, .gallery-item").forEach(el => {
    observer.observe(el);
  });
});

/* =====================
   HEADER SCROLL EFFECT
===================== */
let lastScroll = 0;
const header = document.querySelector(".site-header");

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 100) {
    header?.classList.add("scrolled");
  } else {
    header?.classList.remove("scrolled");
  }
  
  lastScroll = currentScroll;
});

/* =====================
   PERFORMANCE: Debounce Function
===================== */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/* =====================
   COPY TO CLIPBOARD UTILITY
===================== */
window.copyToClipboard = async function(text) {
  try {
    await navigator.clipboard.writeText(text);
    showNotification("Copied!", "Text copied to clipboard", "success");
    return true;
  } catch (err) {
    showNotification("Error", "Failed to copy to clipboard", "error");
    return false;
  }
};

/* =====================
   CONSOLE BRANDING
===================== */
console.log(
  "%c🎵 TMC Ministries %c\nRaising a Sound to the Nations",
  "color: #d97706; font-size: 20px; font-weight: bold;",
  "color: #6b7280; font-size: 12px;"
);
