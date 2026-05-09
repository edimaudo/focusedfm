/**
 * focusedfm — Music Player
 */

(function () {
  'use strict';

  /* ── State ─────────────────────────────── */
  const state = {
    genre:       'rain',
    trackIndex:  0,
    playing:     false,
    muted:       false,
    volume:      80,
    seeking:     false,
  };

  /* ── DOM refs ───────────────────────────── */
  const audio         = document.getElementById('audioPlayer');
  const playBtn       = document.getElementById('playBtn');
  const prevBtn       = document.getElementById('prevBtn');
  const nextBtn       = document.getElementById('nextBtn');
  const muteBtn       = document.getElementById('muteBtn');
  const volumeSlider  = document.getElementById('volumeSlider');
  const volValue      = document.getElementById('volValue');
  const progressBar   = document.getElementById('progressBar');
  const progressFill  = document.getElementById('progressFill');
  const progressThumb = document.getElementById('progressThumb');
  const currentTime   = document.getElementById('currentTime');
  const totalTime     = document.getElementById('totalTime');
  const trackName     = document.getElementById('currentTrackName');
  const genreLabel    = document.getElementById('currentGenreLabel');
  const tracklist     = document.getElementById('tracklist');
  const playerCard    = document.querySelector('.player-card');
  const themeToggle   = document.getElementById('themeToggle');
  const errorToast    = document.getElementById('errorToast');
  const errorMsg      = document.getElementById('errorMsg');
  const genreBtns     = document.querySelectorAll('.genre-btn');

  /* ── Helpers ────────────────────────────── */
  function formatTime(sec) {
    if (!isFinite(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  function currentTracks() {
    return window.TRACKS[state.genre] || [];
  }

  function currentTrack() {
    return currentTracks()[state.trackIndex] || null;
  }

  function showError(msg) {
    errorMsg.textContent = msg || 'Audio failed to load.';
    errorToast.setAttribute('aria-hidden', 'false');
    errorToast.classList.add('show');
    setTimeout(() => {
      errorToast.classList.remove('show');
      errorToast.setAttribute('aria-hidden', 'true');
    }, 3500);
  }

  /* ── Theme ──────────────────────────────── */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const isDark = theme === 'dark';
    themeToggle.setAttribute('aria-checked', isDark ? 'true' : 'false');
    localStorage.setItem('focusedfm-theme', theme);
  }

  function initTheme() {
    const saved = localStorage.getItem('focusedfm-theme') || 'dark';
    applyTheme(saved);
  }

  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  themeToggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      themeToggle.click();
    }
  });

  /* ── Genre selection ────────────────────── */
  function selectGenre(genre) {
    if (!(genre in window.TRACKS)) return;

    state.genre = genre;
    state.trackIndex = 0;

    // Update tab buttons
    genreBtns.forEach(btn => {
      const isActive = btn.dataset.genre === genre;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // Show/hide track items
    document.querySelectorAll('.track-item').forEach(li => {
      li.style.display = li.dataset.genre === genre ? 'flex' : 'none';
      li.classList.remove('active');
      li.setAttribute('aria-selected', 'false');
    });

    // Load first track of new genre (don't autoplay on genre switch)
    const wasPlaying = state.playing;
    loadTrack(0, wasPlaying);
  }

  genreBtns.forEach(btn => {
    btn.addEventListener('click', () => selectGenre(btn.dataset.genre));
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); }
    });
  });

  /* ── Track loading ──────────────────────── */
  function loadTrack(index, autoPlay = false) {
    const tracks = currentTracks();
    if (!tracks.length) return;

    // Clamp index
    state.trackIndex = ((index % tracks.length) + tracks.length) % tracks.length;
    const track = tracks[state.trackIndex];
    const meta  = window.GENRE_META[state.genre] || {};

    // Update display
    trackName.textContent  = track.title;
    genreLabel.textContent = meta.label || state.genre;

    // Update tracklist UI
    document.querySelectorAll(`.track-item[data-genre="${state.genre}"]`).forEach(li => {
      const isActive = parseInt(li.dataset.trackIndex) === state.trackIndex;
      li.classList.toggle('active', isActive);
      li.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // Set audio source
    audio.src = track.url;
    audio.load();
    resetProgress();

    if (autoPlay) {
      playAudio();
    } else {
      state.playing = false;
      updatePlayBtn();
      playerCard.classList.remove('playing');
    }
  }

  /* ── Playback ───────────────────────────── */
  function playAudio() {
    const promise = audio.play();
    if (promise !== undefined) {
      promise.then(() => {
        state.playing = true;
        updatePlayBtn();
        playerCard.classList.add('playing');
      }).catch(() => {
        showError('Audio could not be played. The source may be unavailable.');
        state.playing = false;
        updatePlayBtn();
        playerCard.classList.remove('playing');
      });
    }
  }

  function pauseAudio() {
    audio.pause();
    state.playing = false;
    updatePlayBtn();
    playerCard.classList.remove('playing');
  }

  function togglePlay() {
    if (!audio.src || audio.src === window.location.href) {
      // No track loaded yet, load first
      loadTrack(0, true);
      return;
    }
    if (state.playing) {
      pauseAudio();
    } else {
      playAudio();
    }
  }

  function updatePlayBtn() {
    const isPlaying = state.playing;
    playBtn.setAttribute('aria-pressed', isPlaying ? 'true' : 'false');
    playBtn.setAttribute('aria-label', isPlaying ? 'Pause' : 'Play');
    playBtn.querySelector('.icon-play').style.display  = isPlaying ? 'none' : '';
    playBtn.querySelector('.icon-pause').style.display = isPlaying ? '' : 'none';
  }

  playBtn.addEventListener('click', togglePlay);

  prevBtn.addEventListener('click', () => {
    loadTrack(state.trackIndex - 1, state.playing);
  });

  nextBtn.addEventListener('click', () => {
    loadTrack(state.trackIndex + 1, state.playing);
  });

  /* ── Audio events ───────────────────────── */
  audio.addEventListener('ended', () => {
    loadTrack(state.trackIndex + 1, true);
  });

  audio.addEventListener('error', () => {
    showError('Audio file failed to load.');
    state.playing = false;
    updatePlayBtn();
    playerCard.classList.remove('playing');
  });

  audio.addEventListener('timeupdate', updateProgress);
  audio.addEventListener('loadedmetadata', () => {
    totalTime.textContent = formatTime(audio.duration);
    // Cache duration in track-list items
    const durationEls = document.querySelectorAll(
      `.track-item[data-genre="${state.genre}"][data-track-index="${state.trackIndex}"] .track-dur`
    );
    durationEls.forEach(el => el.textContent = formatTime(audio.duration));
  });

  /* ── Progress ───────────────────────────── */
  function resetProgress() {
    progressFill.style.width = '0%';
    progressThumb.style.left = '0%';
    currentTime.textContent  = '0:00';
    totalTime.textContent    = '0:00';
    progressBar.setAttribute('aria-valuenow', 0);
  }

  function updateProgress() {
    if (!audio.duration || state.seeking) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width  = `${pct}%`;
    progressThumb.style.left  = `${pct}%`;
    currentTime.textContent   = formatTime(audio.currentTime);
    progressBar.setAttribute('aria-valuenow', Math.round(pct));
  }

  function seek(e) {
    const rect = progressBar.getBoundingClientRect();
    const x    = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const pct  = x / rect.width;
    if (audio.duration) {
      audio.currentTime = pct * audio.duration;
    }
  }

  progressBar.addEventListener('mousedown', (e) => {
    state.seeking = true;
    seek(e);
    const onMove = (ev) => seek(ev);
    const onUp   = () => {
      state.seeking = false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });

  progressBar.addEventListener('touchstart', (e) => {
    state.seeking = true;
    seek(e.touches[0]);
    const onMove = (ev) => seek(ev.touches[0]);
    const onEnd  = () => {
      state.seeking = false;
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onEnd);
    };
    document.addEventListener('touchmove', onMove, { passive: true });
    document.addEventListener('touchend', onEnd);
  }, { passive: true });

  progressBar.addEventListener('keydown', (e) => {
    if (!audio.duration) return;
    const step = 5;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      audio.currentTime = Math.max(0, audio.currentTime - step);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      audio.currentTime = Math.min(audio.duration, audio.currentTime + step);
    }
  });

  /* ── Volume ─────────────────────────────── */
  function applyVolume(vol) {
    state.volume = vol;
    audio.volume = vol / 100;
    volumeSlider.value = vol;
    volumeSlider.setAttribute('aria-valuenow', vol);
    volValue.textContent = vol;

    // Update slider fill gradient
    const pct = vol;
    volumeSlider.style.background =
      `linear-gradient(90deg, var(--primary) ${pct}%, var(--bg-raised) ${pct}%)`;
  }

  volumeSlider.addEventListener('input', () => {
    const vol = parseInt(volumeSlider.value);
    if (state.muted) toggleMute(); // unmute on slider move
    applyVolume(vol);
  });

  function toggleMute() {
    state.muted = !state.muted;
    audio.muted = state.muted;
    muteBtn.setAttribute('aria-label', state.muted ? 'Unmute' : 'Toggle mute');
    muteBtn.querySelector('.icon-vol').style.display  = state.muted ? 'none' : '';
    muteBtn.querySelector('.icon-mute').style.display = state.muted ? '' : 'none';
  }

  muteBtn.addEventListener('click', toggleMute);

  /* ── Track list click ────────────────────── */
  tracklist.addEventListener('click', (e) => {
    const item = e.target.closest('.track-item');
    if (!item) return;
    const idx   = parseInt(item.dataset.trackIndex);
    const genre = item.dataset.genre;
    if (genre !== state.genre) {
      // Shouldn't happen (hidden items) but handle gracefully
      selectGenre(genre);
    }
    loadTrack(idx, true);
  });

  tracklist.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const item = e.target.closest('.track-item');
      if (item) { e.preventDefault(); item.click(); }
    }
  });

  /* ── Keyboard shortcuts ──────────────────── */
  document.addEventListener('keydown', (e) => {
    const tag = document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    switch (e.key) {
      case ' ':
        if (document.activeElement === document.body) {
          e.preventDefault();
          togglePlay();
        }
        break;
      case 'ArrowRight':
        if (document.activeElement === document.body) {
          e.preventDefault();
          loadTrack(state.trackIndex + 1, state.playing);
        }
        break;
      case 'ArrowLeft':
        if (document.activeElement === document.body) {
          e.preventDefault();
          loadTrack(state.trackIndex - 1, state.playing);
        }
        break;
      case 'm': case 'M':
        toggleMute();
        break;
    }
  });

  /* ── Init ────────────────────────────────── */
  function init() {
    initTheme();
    applyVolume(state.volume);
    loadTrack(0, false);
  }

  init();

})();
