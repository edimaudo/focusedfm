let currentGenre = "Rain";
let trackIdx = 0;
let isPlaying = false;
const audio = new Audio();

// Audio Handlers
function loadAndPlay() {
    const track = playlists[currentGenre][trackIdx];
    audio.src = track.url;
    document.getElementById('track-info').innerText = track.name;
    if (isPlaying) audio.play();
}

document.getElementById('play-btn').onclick = () => {
    if (audio.paused) {
        audio.play();
        isPlaying = true;
    } else {
        audio.pause();
        isPlaying = false;
    }
};

document.getElementById('next-btn').onclick = () => {
    trackIdx = (trackIdx + 1) % playlists[currentGenre].length;
    loadAndPlay();
};

document.getElementById('prev-btn').onclick = () => {
    trackIdx = (trackIdx - 1 + playlists[currentGenre].length) % playlists[currentGenre].length;
    loadAndPlay();
};

// Auto-advance logic
audio.onended = () => document.getElementById('next-btn').click();

// Volume logic
document.getElementById('volume-slider').oninput = (e) => {
    audio.volume = e.target.value;
};

// Genre Selection
function selectGenre(genre) {
    currentGenre = genre;
    trackIdx = 0;
    document.getElementById('genre-menu').style.display = 'none';
    loadAndPlay();
}

document.getElementById('channels-btn').onclick = () => {
    const menu = document.getElementById('genre-menu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
};

// Theme Persistence
const themeToggle = document.getElementById('theme-toggle');
themeToggle.onchange = () => {
    const mode = themeToggle.checked ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', mode);
    localStorage.setItem('theme', mode);
};

window.onload = () => {
    const saved = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    themeToggle.checked = (saved === 'dark');
    loadAndPlay();
};
