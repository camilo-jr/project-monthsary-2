 document.addEventListener("DOMContentLoaded", function () {
// Get references to the video elements
const videos = document.querySelectorAll('video');

// Get references to the shuffle and toggle buttons
const shuffleButton = document.getElementById('shuffleBtn');
const toggleButton = document.getElementById('toggleBtn');

// Track the current video index
let currentIndex = 0;

// Track the repeat mode (0 = no repeat, 1 = repeat once, 2 = repeat all)
let repeatMode = 0;

// Function to shuffle the videos
function shuffleVideos() {
// Pause and reset the current video
videos[currentIndex].pause();
videos[currentIndex].currentTime = 0;

const videoSources = Array.from(videos).map(video => video.querySelector('source').src);
shuffleArray(videoSources);

// Update video sources and play the first video
videoSources.forEach((source, index) => {
    videos[index].querySelector('source').src = source;
    videos[index].load();
});

// Play the first video
videos[currentIndex].play();
}

// Function to toggle repeat mode
function toggleRepeatMode() {
repeatMode = (repeatMode + 1) % 3; // Cycle through 0, 1, 2
switch (repeatMode) {
    case 0:
    videos.forEach((video) => (video.loop = false));
    toggleButton.textContent = 'Toggle';
    break;
    case 1:
    videos.forEach((video) => (video.loop = true));
    toggleButton.textContent = 'Repeat Once';
    break;
    case 2:
    videos.forEach((video) => (video.loop = false));
    toggleButton.textContent = 'Repeat All';
    break;
}
}

// Function to play the next video with a fading effect
function playNextVideoWithFade() {
    const currentVideo = videos[currentIndex];
    const nextIndex = (currentIndex + 1) % videos.length;
    const nextVideo = videos[nextIndex];

// Add the fading class to the current video to initiate the fade-out effect
currentVideo.classList.add('video-fading');

// When the transition is complete (after 1 second), remove the fading class
setTimeout(() => {
    currentVideo.classList.remove('video-fading');
    currentVideo.pause();
    currentIndex = nextIndex;

// Request fullscreen for the next video
if (nextVideo.requestFullscreen) {
    nextVideo.requestFullscreen().then(() => {
// Play the next video
nextVideo.play();
}).catch((error) => {
    console.error('Failed to enter fullscreen:', error);
});
} else {
    console.error('Fullscreen API is not supported in this browser.');
// Play the next video without fullscreen
nextVideo.play();
}
}, 1000); // Adjust the delay (in milliseconds) to match your transition duration
}

// Shuffle an array in place (Fisher-Yates algorithm)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Add click event listeners to the shuffle, toggle, and video ended buttons
shuffleButton.addEventListener('click', shuffleVideos);
toggleButton.addEventListener('click', toggleRepeatMode);
videos.forEach((video) => {
    video.addEventListener('ended', () => {
        if (repeatMode === 2) {
            playNextVideoWithFade();
        }
    });
});

// Play the first video
videos[currentIndex].play();
});