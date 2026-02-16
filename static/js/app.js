const audio = document.getElementById('player-audio');
const playIcon = document.getElementById('play-icon');
const themeBtn = document.getElementById('theme-toggle');

// Theme Logic
themeBtn.onclick = () => {
    const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    themeBtn.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
};

// Music Logic
async function changeGenre(genre) {
    const res = await fetch(`/api/tracks/${genre}`);
    const data = await res.json();
    audio.src = `/static/tracks/${data.file}`;
    audio.play();
    playIcon.className = "fas fa-pause";
}

playIcon.onclick = () => {
    if (audio.paused) { audio.play(); playIcon.className = "fas fa-pause"; }
    else { audio.pause(); playIcon.className = "fas fa-play"; }
};

document.getElementById('volume').oninput = (e) => audio.volume = e.target.value;
