const video = document.getElementById("videoPlayer");
const imageViewer = document.getElementById("imageViewer");

const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

const playOverlay = document.getElementById("playOverlay");
const playButton = document.getElementById("playButton");

const locationReminder = document.getElementById("locationReminder");

let reminderTimeout1;
let reminderTimeout2;

const slides = [
  "clip1.mp4",
  "location.png",
  "invitation.png"
];

let currentSlide = 0;

function isImage(src) {
  return /\.(png|jpe?g|gif|webp)$/i.test(src);
}

// Play button
playButton.addEventListener("click", () => {
  playOverlay.style.display = "none";
  video.play();
});

// Load slide
function loadSlide(index) {
  currentSlide = index;
  const src = slides[currentSlide];

  clearTimeout(reminderTimeout1);
  clearTimeout(reminderTimeout2);
  locationReminder.classList.remove("show");

  if (isImage(src)) {
    // Show image
    video.pause();
    video.style.display = "none";

    imageViewer.src = src;
    imageViewer.style.display = "block";

    // Show reminder only on location image
    if (src === "location.png") {
      reminderTimeout1 = setTimeout(() => {
        locationReminder.classList.add("show");
      }, 1000);

      reminderTimeout2 = setTimeout(() => {
        locationReminder.classList.remove("show");
      }, 5000);
    }

    // Navigation buttons
    prevBtn.style.visibility = currentSlide > 0 ? "visible" : "hidden";
    nextBtn.style.visibility =
      currentSlide < slides.length - 1 ? "visible" : "hidden";

  } else {
    // Show video
    imageViewer.style.display = "none";

    video.style.display = "block";
    video.src = src;
    video.load();
    video.play();

    // Hide buttons while video plays
    prevBtn.style.visibility = "hidden";
    nextBtn.style.visibility = "hidden";
  }
}

// When video ends, show both buttons
video.addEventListener("ended", () => {
  prevBtn.style.visibility = currentSlide > 0 ? "visible" : "hidden";
  nextBtn.style.visibility =
    currentSlide < slides.length - 1 ? "visible" : "hidden";
});

// Next
nextBtn.addEventListener("click", () => {
  if (currentSlide < slides.length - 1) {
    loadSlide(currentSlide + 1);
  }
});

// Previous
prevBtn.addEventListener("click", () => {
  if (currentSlide > 0) {
    loadSlide(currentSlide - 1);
  }
});

// Start with the video
loadSlide(0);
