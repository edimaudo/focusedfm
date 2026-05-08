let currentGenre = "Rain";
let currentTrackIndex = 0;
const audio = new Audio();
const playBtn = document.getElementById('play-btn');
const genreSelector = document.getElementById('genre-selector');

function loadTrack(index) {
    const track = playlists[currentGenre][index];
    audio.src = track.url;
    document.getElementById('current-track-name').innerText = track.name;
    updateTrackListUI();
}

function updateTrackListUI() {
    const list = document.getElementById('track-list');
    list.innerHTML = '';
    playlists[currentGenre].forEach((track, index) => {
        const li = document.createElement('li');
        li.className = `track-item ${index === currentTrackIndex ? 'active' : ''}`;
        li.innerText = track.name;
        li.onclick = () => {
            currentTrackIndex = index;
            loadTrack(index);
            audio.play();
            playBtn.innerText = '⏸';
        };
        list.appendChild(li);
    });
}

// Controls
playBtn.onclick = () => {
    if (audio.paused) {
        audio.play();
        playBtn.innerText = '⏸';
    } else {
        audio.pause();
        playBtn.innerText = '▶';
    }
};

document.getElementById('next-btn').onclick = () => {
    currentTrackIndex = (currentTrackIndex + 1) % playlists[currentGenre].length;
    loadTrack(currentTrackIndex);
    audio.play();
};

document.getElementById('prev-btn').onclick = () => {
    currentTrackIndex = (currentTrackIndex - 1 + playlists[currentGenre].length) % playlists[currentGenre].length;
    loadTrack(currentTrackIndex);
    audio.play();
};

genreSelector.onchange = (e) => {
    currentGenre = e.target.value;
    currentTrackIndex = 0;
    loadTrack(currentTrackIndex);
    document.getElementById('current-genre-display').innerText = `Genre: ${currentGenre}`;
};

// Auto-advance
audio.onended = () => document.getElementById('next-btn').click();

// Theme Toggle Logic
const themeToggle = document.getElementById('theme-toggle');
themeToggle.onchange = () => {
    const theme = themeToggle.checked ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
};

// Initialize
window.onload = () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeToggle.checked = savedTheme === 'dark';
    loadTrack(0);
};
