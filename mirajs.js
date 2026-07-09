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

// Check if the invitation has been opened before
const hasOpened = localStorage.getItem("miraInvitationOpened") === "true";

// START VIDEO
playButton.addEventListener("click", () => {
  playOverlay.style.display = "none";
  video.play();

  // Save that the invitation has been opened
  localStorage.setItem("miraInvitationOpened", "true");
});

// LOAD CLIPS
function loadClip(index) {
  currentClip = index;
  const src = clips[currentClip];

  if (isImage(src)) {
    clearTimeout(reminderTimeout1);
clearTimeout(reminderTimeout2);
locationReminder.classList.remove("show");
    // SHOW IMAGE, HIDE VIDEO
    video.pause();
    video.style.display = "none";
    imageViewer.src = src;
    imageViewer.style.display = "block";

    // Show reminder only for location.png
if (src === "location.png") {

  reminderTimeout1 = setTimeout(() => {
    locationReminder.classList.add("show");
  });

  reminderTimeout2 = setTimeout(() => {
    locationReminder.classList.remove("show");
  }, 4000);

}

    // Only show Next if the invitation has been opened before
    if (hasOpened) {
      nextBtn.style.visibility =
        currentClip < clips.length - 1 ? "visible" : "hidden";
    } else {
      nextBtn.style.visibility = "hidden";
    }

  } else {
    // SHOW VIDEO, HIDE IMAGE
    imageViewer.style.display = "none";
    video.style.display = "block";
    video.src = src;
    video.load();
    video.play();

    nextBtn.style.visibility = "hidden";
  }

  // Previous button
  if (hasOpened) {
    prevBtn.style.visibility =
      currentClip > 0 ? "visible" : "hidden";
  } else {
    prevBtn.style.visibility = "hidden";
  }
}

// SHOW NEXT BUTTON (video-only logic)
video.addEventListener("timeupdate", () => {
  if (!hasOpened) return;

  if (isImage(clips[currentClip])) return;

  if (currentClip === clips.length - 1) {
    nextBtn.style.visibility = "hidden";
    return;
  }

  // Clip 1: show next at 27 seconds
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
if (hasOpened) {
  prevBtn.style.visibility = currentClip > 0 ? "visible" : "hidden";
  nextBtn.style.visibility = "hidden";
} else {
  prevBtn.style.visibility = "hidden";
  nextBtn.style.visibility = "hidden";
}