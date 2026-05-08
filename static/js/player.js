// Timer Logic
let timeLeft = 25 * 60;
let timerId = null;
const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start-pause');

function updateTimerDisplay() {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    timerDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

startBtn.addEventListener('click', () => {
    if (timerId) {
        clearInterval(timerId);
        timerId = null;
        startBtn.textContent = 'START';
    } else {
        startBtn.textContent = 'PAUSE';
        timerId = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            if (timeLeft <= 0) clearInterval(timerId);
        }, 1000);
    }
});

document.getElementById('reset-timer').onclick = () => {
    clearInterval(timerId);
    timerId = null;
    timeLeft = 25 * 60;
    updateTimerDisplay();
    startBtn.textContent = 'START';
};

// Audio Logic
let currentGenre = "Rain";
let trackIndex = 0;
const audio = new Audio();
const playPauseBtn = document.getElementById('play-pause-audio');

function selectGenre(genre) {
    currentGenre = genre;
    trackIndex = 0;
    loadAndPlay();
    
    document.querySelectorAll('.genre-btn').forEach(btn => {
        btn.classList.toggle('active', btn.textContent === genre);
    });
}

function loadAndPlay() {
    const track = playlists[currentGenre][trackIndex];
    audio.src = track.url;
    document.getElementById('track-name').textContent = track.name;
    document.getElementById('genre-name').textContent = currentGenre;
    audio.play();
    playPauseBtn.textContent = '⏸';
}

playPauseBtn.onclick = () => {
    if (audio.paused) {
        audio.play();
        playPauseBtn.textContent = '⏸';
    } else {
        audio.pause();
        playPauseBtn.textContent = '▶';
    }
};

document.getElementById('next-track').onclick = () => {
    trackIndex = (trackIndex + 1) % playlists[currentGenre].length;
    loadAndPlay();
};

document.getElementById('prev-track').onclick = () => {
    trackIndex = (trackIndex - 1 + playlists[currentGenre].length) % playlists[currentGenre].length;
    loadAndPlay();
};

document.getElementById('volume').oninput = (e) => {
    audio.volume = e.target.value;
};

// Handle auto-looping for continuous focus
audio.onended = () => document.getElementById('next-track').click();
