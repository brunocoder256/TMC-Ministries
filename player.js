const player = document.getElementById("audioPlayer");
const audio = document.getElementById("playerAudio");
const cover = document.getElementById("playerCover");
const title = document.getElementById("playerTitle");
const artist = document.getElementById("playerArtist");
const playPause = document.getElementById("playPause");

let isPlaying = false;

window.playTrack = function (track) {
  title.textContent = track.title;
  artist.textContent = track.artist || "";
  cover.src = track.cover;
  audio.src = track.audio;

  player.classList.remove("hidden");
  audio.play();
  isPlaying = true;
  playPause.textContent = "❚❚";
};

playPause.addEventListener("click", () => {
  if (!audio.src) return;

  if (isPlaying) {
    audio.pause();
    playPause.textContent = "▶";
  } else {
    audio.play();
    playPause.textContent = "❚❚";
  }
  isPlaying = !isPlaying;
});
