const video = document.getElementById("videoPlayer");

const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

const playOverlay = document.getElementById("playOverlay");
const playButton = document.getElementById("playButton");

const clips = [
  "clip1.mp4",
  "clip2.mp4",
  "clip3.mp4",
  "clip4.mp4",
  "clip5.mp4"
];

let currentClip = 0;

// START VIDEO
playButton.addEventListener("click", () => {
  playOverlay.style.display = "none";
  video.play();
});

// LOAD CLIPS
function loadClip(index) {
  currentClip = index;

  video.src = clips[currentClip];
  video.load();
  video.play();

  // PREVIOUS BUTTON
  prevBtn.style.visibility = currentClip > 0 ? "visible" : "hidden";

  // NEXT BUTTON
  nextBtn.style.visibility = "hidden";
}

// SHOW NEXT BUTTON
video.addEventListener("timeupdate", () => {
  if (currentClip === clips.length - 1) {
    nextBtn.style.visibility = "hidden";
    return;
  }

  // Clip 1: show next at 0:27
  if (currentClip === 0 && video.currentTime >= 27) {
    nextBtn.style.visibility = "visible";
  }

  // Clips 2 onwards: show next during last 1 second
  if (currentClip > 0) {
    const remainingTime = video.duration - video.currentTime;

    if (remainingTime <= 1) {
      nextBtn.style.visibility = "visible";
    } else {
      nextBtn.style.visibility = "hidden";
    }
  }
});

// NEXT
nextBtn.addEventListener("click", () => {
  if (currentClip < clips.length - 1) {
    loadClip(currentClip + 1);
  }
});

// PREVIOUS
prevBtn.addEventListener("click", () => {
  if (currentClip > 0) {
    loadClip(currentClip - 1);
  }
});

// INITIAL BUTTON STATE
prevBtn.style.visibility = "hidden";
nextBtn.style.visibility = "hidden";