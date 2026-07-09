const video = document.getElementById("videoPlayer");
const imageViewer = document.getElementById("imageViewer");

const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

const playOverlay = document.getElementById("playOverlay");
const playButton = document.getElementById("playButton");

const locationReminder = document.getElementById("locationReminder");

let reminderTimeout1;
let reminderTimeout2;

const clips = [
  "clip1.mp4",
  "clip2.mp4",
  "clip3.mp4",
  "location.png",
  "invitation.png",
];

let currentClip = 0;

function isImage(src) {
  return /\.(png|jpe?g|gif|webp)$/i.test(src);
}

// Read from localStorage
let hasOpened = localStorage.getItem("miraInvitationOpened") === "true";

// PLAY BUTTON
playButton.addEventListener("click", () => {
  playOverlay.style.display = "none";

  hasOpened = true;
  localStorage.setItem("miraInvitationOpened", "true");

  video.play();
});

// LOAD CLIP
function loadClip(index) {
  currentClip = index;
  const src = clips[currentClip];

  clearTimeout(reminderTimeout1);
  clearTimeout(reminderTimeout2);
  locationReminder.classList.remove("show");

  // Update Previous button
  prevBtn.style.visibility = currentClip > 0 ? "visible" : "hidden";

  // Hide Next until allowed
  nextBtn.style.visibility = "hidden";

  if (isImage(src)) {
    // IMAGE
    video.pause();
    video.style.display = "none";

    imageViewer.src = src;
    imageViewer.style.display = "block";

    // Show Next immediately for images except last
    if (currentClip < clips.length - 1) {
      nextBtn.style.visibility = "visible";
    }

    // Location reminder
    if (src === "location.png") {
      reminderTimeout1 = setTimeout(() => {
        locationReminder.classList.add("show");
      }, 100);

      reminderTimeout2 = setTimeout(() => {
        locationReminder.classList.remove("show");
      }, 4000);
    }
  } else {
    // VIDEO
    imageViewer.style.display = "none";

    video.style.display = "block";
    video.src = src;
    video.load();

    if (hasOpened) {
      video.play();
    }
  }
}

// VIDEO PROGRESS
video.addEventListener("timeupdate", () => {
  if (!hasOpened) return;

  if (isImage(clips[currentClip])) return;

  // Last clip
  if (currentClip === clips.length - 1) {
    nextBtn.style.visibility = "hidden";
    return;
  }

  // Clip 1: show at 27 seconds
  if (currentClip === 0) {
    if (video.currentTime >= 27) {
      nextBtn.style.visibility = "visible";
    } else {
      nextBtn.style.visibility = "hidden";
    }
    return;
  }

  // Other video clips: show during last second
  const remainingTime = video.duration - video.currentTime;

  if (remainingTime <= 1) {
    nextBtn.style.visibility = "visible";
  } else {
    nextBtn.style.visibility = "hidden";
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

// INITIAL STATE
loadClip(0);

if (!hasOpened) {
  playOverlay.style.display = "flex";
} else {
  playOverlay.style.display = "none";
  video.play();
}
