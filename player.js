/* =====================
   AUDIO PLAYER ENHANCED
===================== */
const player = document.getElementById("audioPlayer");
const audio = document.getElementById("playerAudio");
const cover = document.getElementById("playerCover");
const title = document.getElementById("playerTitle");
const artist = document.getElementById("playerArtist");
const playPause = document.getElementById("playPause");

let isPlaying = false;
let currentTrack = null;

/* =====================
   PLAY TRACK FUNCTION
===================== */
window.playTrack = function (track) {
  currentTrack = track;
  title.textContent = track.title;
  artist.textContent = track.artist || "TMC Ministries";
  cover.src = track.cover || "Logo TMC.png";
  audio.src = track.audio;

  player.classList.remove("hidden");
  
  // Play audio
  audio.play().then(() => {
    isPlaying = true;
    playPause.innerHTML = "⏸";
    
    // Show success notification
    if (typeof showNotification === 'function') {
      showNotification("Now Playing", track.title, "success");
    }
  }).catch(err => {
    console.error("Playback error:", err);
    if (typeof showNotification === 'function') {
      showNotification("Error", "Failed to play audio", "error");
    }
  });
};

/* =====================
   PLAY/PAUSE CONTROL
===================== */
playPause?.addEventListener("click", () => {
  if (!audio.src) return;

  if (isPlaying) {
    audio.pause();
    playPause.innerHTML = "▶";
    isPlaying = false;
  } else {
    audio.play();
    playPause.innerHTML = "⏸";
    isPlaying = true;
  }
});

/* =====================
   PROGRESS BAR
===================== */
// Create progress bar elements if they don't exist
if (player && !document.querySelector(".player-progress")) {
  const playerMeta = player.querySelector(".player-meta");
  if (playerMeta) {
    const progressHTML = `
      <div class="player-progress">
        <span class="player-time" id="currentTime">0:00</span>
        <div class="progress-bar" id="progressBar">
          <div class="progress-fill" id="progressFill"></div>
        </div>
        <span class="player-time" id="duration">0:00</span>
      </div>
    `;
    playerMeta.insertAdjacentHTML("beforeend", progressHTML);
  }
}

const progressBar = document.getElementById("progressBar");
const progressFill = document.getElementById("progressFill");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");

// Format time helper
function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// Update progress bar
audio?.addEventListener("timeupdate", () => {
  if (audio.duration) {
    const progress = (audio.currentTime / audio.duration) * 100;
    if (progressFill) progressFill.style.width = `${progress}%`;
    if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
  }
});

// Update duration when loaded
audio?.addEventListener("loadedmetadata", () => {
  if (durationEl) durationEl.textContent = formatTime(audio.duration);
});

// Seek functionality
progressBar?.addEventListener("click", (e) => {
  if (!audio.duration) return;
  const rect = progressBar.getBoundingClientRect();
  const pos = (e.clientX - rect.left) / rect.width;
  audio.currentTime = pos * audio.duration;
});

/* =====================
   VOLUME CONTROL
===================== */
// Create volume control if it doesn't exist
const playerControls = player?.querySelector(".player-controls");
if (playerControls && !document.querySelector(".volume-control")) {
  const volumeHTML = `
    <div class="volume-control">
      <span class="volume-icon" id="volumeIcon">🔊</span>
      <div class="volume-slider" id="volumeSlider">
        <div class="volume-fill" id="volumeFill"></div>
      </div>
    </div>
  `;
  playerControls.insertAdjacentHTML("afterbegin", volumeHTML);
}

const volumeIcon = document.getElementById("volumeIcon");
const volumeSlider = document.getElementById("volumeSlider");
const volumeFill = document.getElementById("volumeFill");

// Set initial volume
if (audio) audio.volume = 1;

// Volume slider
volumeSlider?.addEventListener("click", (e) => {
  const rect = volumeSlider.getBoundingClientRect();
  const pos = (e.clientX - rect.left) / rect.width;
  audio.volume = pos;
  if (volumeFill) volumeFill.style.width = `${pos * 100}%`;
  updateVolumeIcon(pos);
});

// Volume icon toggle mute
volumeIcon?.addEventListener("click", () => {
  if (audio.volume > 0) {
    audio.dataset.prevVolume = audio.volume;
    audio.volume = 0;
    if (volumeFill) volumeFill.style.width = "0%";
    updateVolumeIcon(0);
  } else {
    const prevVolume = parseFloat(audio.dataset.prevVolume) || 1;
    audio.volume = prevVolume;
    if (volumeFill) volumeFill.style.width = `${prevVolume * 100}%`;
    updateVolumeIcon(prevVolume);
  }
});

function updateVolumeIcon(volume) {
  if (!volumeIcon) return;
  if (volume === 0) {
    volumeIcon.textContent = "🔇";
  } else if (volume < 0.5) {
    volumeIcon.textContent = "🔉";
  } else {
    volumeIcon.textContent = "🔊";
  }
}

/* =====================
   CLOSE BUTTON
===================== */
// Create close button if it doesn't exist
if (playerControls && !document.querySelector(".player-close")) {
  const closeBtn = document.createElement("button");
  closeBtn.className = "player-close";
  closeBtn.innerHTML = "×";
  closeBtn.setAttribute("aria-label", "Close player");
  playerControls.appendChild(closeBtn);
  
  closeBtn.addEventListener("click", () => {
    audio.pause();
    player.classList.add("hidden");
    isPlaying = false;
    playPause.innerHTML = "▶";
  });
}

/* =====================
   AUDIO EVENTS
===================== */
// Auto-play next or loop
audio?.addEventListener("ended", () => {
  isPlaying = false;
  playPause.innerHTML = "▶";
  
  // Reset progress
  if (progressFill) progressFill.style.width = "0%";
  if (currentTimeEl) currentTimeEl.textContent = "0:00";
});

// Handle errors
audio?.addEventListener("error", (e) => {
  console.error("Audio error:", e);
  if (typeof showNotification === 'function') {
    showNotification("Playback Error", "Unable to play this track", "error");
  }
  isPlaying = false;
  playPause.innerHTML = "▶";
});

/* =====================
   KEYBOARD SHORTCUTS
===================== */
document.addEventListener("keydown", (e) => {
  // Only if player is visible
  if (player?.classList.contains("hidden")) return;
  
  // Space bar - play/pause
  if (e.code === "Space" && e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
    e.preventDefault();
    playPause?.click();
  }
  
  // Arrow keys - seek
  if (e.code === "ArrowLeft") {
    e.preventDefault();
    audio.currentTime = Math.max(0, audio.currentTime - 5);
  }
  if (e.code === "ArrowRight") {
    e.preventDefault();
    audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
  }
  
  // Arrow up/down - volume
  if (e.code === "ArrowUp") {
    e.preventDefault();
    audio.volume = Math.min(1, audio.volume + 0.1);
    if (volumeFill) volumeFill.style.width = `${audio.volume * 100}%`;
    updateVolumeIcon(audio.volume);
  }
  if (e.code === "ArrowDown") {
    e.preventDefault();
    audio.volume = Math.max(0, audio.volume - 0.1);
    if (volumeFill) volumeFill.style.width = `${audio.volume * 100}%`;
    updateVolumeIcon(audio.volume);
  }
});

/* =====================
   MEDIA SESSION API
===================== */
if ("mediaSession" in navigator && currentTrack) {
  navigator.mediaSession.metadata = new MediaMetadata({
    title: currentTrack?.title || "TMC Ministries",
    artist: currentTrack?.artist || "TMC Ministries",
    artwork: [
      { src: currentTrack?.cover || "Logo TMC.png", sizes: "512x512", type: "image/png" }
    ]
  });

  navigator.mediaSession.setActionHandler("play", () => {
    audio.play();
    isPlaying = true;
    playPause.innerHTML = "⏸";
  });

  navigator.mediaSession.setActionHandler("pause", () => {
    audio.pause();
    isPlaying = false;
    playPause.innerHTML = "▶";
  });

  navigator.mediaSession.setActionHandler("seekbackward", () => {
    audio.currentTime = Math.max(0, audio.currentTime - 10);
  });

  navigator.mediaSession.setActionHandler("seekforward", () => {
    audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
  });
}
