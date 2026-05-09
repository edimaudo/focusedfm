/**
 * focusedfm — Player JS
 * Clean minimal, focusmusic.fm
 */
(function () {
  'use strict';

  /* ── State ── */
  const state = {
    genre:      'rain',
    trackIndex: 0,
    playing:    false,
    volume:     80,
    seeking:    false,
  };

  /* ── DOM ── */
  const audio          = document.getElementById('audioPlayer');
  const playBtn        = document.getElementById('playBtn');
  const prevBtn        = document.getElementById('prevBtn');
  const nextBtn        = document.getElementById('nextBtn');
  const muteBtn        = document.getElementById('muteBtn');
  const volUpBtn       = document.getElementById('volUpBtn');
  const volumeSlider   = document.getElementById('volumeSlider');
  const progressBar    = document.getElementById('progressBar');
  const progressFill   = document.getElementById('progressFill');
  const progressThumb  = document.getElementById('progressThumb');
  const currentTimeEl  = document.getElementById('currentTime');
  const totalTimeEl    = document.getElementById('totalTime');
  const trackNameEl    = document.getElementById('currentTrackName');
  const genreLabelEl   = document.getElementById('currentGenreLabel');
  const themeToggle    = document.getElementById('themeToggle');
  const channelsBtn    = document.getElementById('channelsBtn');
  const channelsDrop   = document.getElementById('channelsDropdown');
  const trackInfoBtn   = document.getElementById('trackInfoBtn');
  const trackInfoPanel = document.getElementById('trackInfoPanel');
  const trackInfoBack  = document.getElementById('trackInfoBackdrop');
  const sheetClose     = document.getElementById('sheetClose');
  const sheetTracklist = document.getElementById('sheetTracklist');
  const sheetGenreTitle= document.getElementById('sheetGenreTitle');
  const errorToast     = document.getElementById('errorToast');
  const errorMsg       = document.getElementById('errorMsg');

  /* ── Helpers ── */
  function fmt(sec) {
    if (!isFinite(sec) || sec < 0) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  function tracks() { return window.TRACKS[state.genre] || []; }
  function track()  { return tracks()[state.trackIndex] || null; }
  function meta()   { return window.GENRE_META[state.genre] || {}; }

  function showError(msg) {
    errorMsg.textContent = msg;
    errorToast.setAttribute('aria-hidden', 'false');
    errorToast.classList.add('show');
    setTimeout(() => {
      errorToast.classList.remove('show');
      errorToast.setAttribute('aria-hidden', 'true');
    }, 3500);
  }

  /* ── Theme ── */
  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    themeToggle.setAttribute('aria-checked', t === 'dark' ? 'true' : 'false');
    localStorage.setItem('focusedfm-theme', t);
  }

  themeToggle.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme');
    applyTheme(cur === 'dark' ? 'light' : 'dark');
  });

  themeToggle.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); themeToggle.click(); }
  });

  /* ── Genre / Channels ── */
  function selectGenre(genre) {
    if (!(genre in window.TRACKS)) return;
    state.genre      = genre;
    state.trackIndex = 0;

    // Update channel items
    channelsDrop.querySelectorAll('.channel-item').forEach(btn => {
      const active = btn.dataset.genre === genre;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    closeChannels();
    const wasPlaying = state.playing;
    loadTrack(0, wasPlaying);
  }

  function openChannels() {
    channelsDrop.classList.add('open');
    channelsBtn.setAttribute('aria-expanded', 'true');
    // Focus first item
    const first = channelsDrop.querySelector('.channel-item');
    if (first) first.focus();
  }

  function closeChannels() {
    channelsDrop.classList.remove('open');
    channelsBtn.setAttribute('aria-expanded', 'false');
  }

  channelsBtn.addEventListener('click', () => {
    channelsDrop.classList.contains('open') ? closeChannels() : openChannels();
  });

  channelsDrop.addEventListener('click', e => {
    const item = e.target.closest('.channel-item');
    if (item) selectGenre(item.dataset.genre);
  });

  channelsDrop.addEventListener('keydown', e => {
    const items = [...channelsDrop.querySelectorAll('.channel-item')];
    const idx   = items.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); items[(idx + 1) % items.length]?.focus(); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); items[(idx - 1 + items.length) % items.length]?.focus(); }
    if (e.key === 'Escape')    { closeChannels(); channelsBtn.focus(); }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const item = e.target.closest('.channel-item');
      if (item) selectGenre(item.dataset.genre);
    }
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.channels-section')) closeChannels();
  });

  /* ── Track loading ── */
  function loadTrack(index, autoPlay = false) {
    const list = tracks();
    if (!list.length) return;
    state.trackIndex = ((index % list.length) + list.length) % list.length;
    const t = list[state.trackIndex];

    trackNameEl.textContent  = t.title;
    genreLabelEl.textContent = meta().label || state.genre;

    audio.src = t.url;
    audio.load();
    resetProgress();

    if (autoPlay) {
      playAudio();
    } else {
      state.playing = false;
      updatePlayBtn();
    }
  }

  /* ── Playback ── */
  function playAudio() {
    if (!audio.src || audio.src === window.location.href) {
      loadTrack(0, true); return;
    }
    audio.play().then(() => {
      state.playing = true;
      updatePlayBtn();
    }).catch(() => {
      showError('Audio could not be played.');
      state.playing = false;
      updatePlayBtn();
    });
  }

  function pauseAudio() {
    audio.pause();
    state.playing = false;
    updatePlayBtn();
  }

  function togglePlay() {
    if (!audio.src || audio.src === window.location.href) {
      loadTrack(0, true); return;
    }
    state.playing ? pauseAudio() : playAudio();
  }

  function updatePlayBtn() {
    const p = state.playing;
    playBtn.setAttribute('aria-pressed', p ? 'true' : 'false');
    playBtn.setAttribute('aria-label', p ? 'Pause' : 'Play');
    playBtn.querySelector('.icon-play').style.display  = p ? 'none' : '';
    playBtn.querySelector('.icon-pause').style.display = p ? '' : 'none';
  }

  playBtn.addEventListener('click', togglePlay);
  prevBtn.addEventListener('click', () => loadTrack(state.trackIndex - 1, state.playing));
  nextBtn.addEventListener('click', () => loadTrack(state.trackIndex + 1, state.playing));

  audio.addEventListener('ended',  () => loadTrack(state.trackIndex + 1, true));
  audio.addEventListener('error',  () => {
    showError('Audio file failed to load.');
    state.playing = false;
    updatePlayBtn();
  });

  /* ── Progress ── */
  function resetProgress() {
    progressFill.style.width = '0%';
    progressThumb.style.left = '0%';
    currentTimeEl.textContent = '0:00';
    totalTimeEl.textContent   = '0:00';
    progressBar.setAttribute('aria-valuenow', 0);
  }

  audio.addEventListener('timeupdate', () => {
    if (!audio.duration || state.seeking) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = `${pct}%`;
    progressThumb.style.left = `${pct}%`;
    currentTimeEl.textContent = fmt(audio.currentTime);
    progressBar.setAttribute('aria-valuenow', Math.round(pct));
  });

  audio.addEventListener('loadedmetadata', () => {
    totalTimeEl.textContent = fmt(audio.duration);
  });

  function seekTo(e) {
    const rect = progressBar.getBoundingClientRect();
    const pct  = Math.max(0, Math.min((e.clientX - rect.left) / rect.width, 1));
    if (audio.duration) audio.currentTime = pct * audio.duration;
  }

  progressBar.addEventListener('mousedown', e => {
    state.seeking = true;
    seekTo(e);
    const mv = ev => seekTo(ev);
    const up = ()  => { state.seeking = false; document.removeEventListener('mousemove', mv); document.removeEventListener('mouseup', up); };
    document.addEventListener('mousemove', mv);
    document.addEventListener('mouseup', up);
  });

  progressBar.addEventListener('keydown', e => {
    if (!audio.duration) return;
    if (e.key === 'ArrowLeft'  || e.key === 'ArrowDown')  { e.preventDefault(); audio.currentTime = Math.max(0, audio.currentTime - 5); }
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp')    { e.preventDefault(); audio.currentTime = Math.min(audio.duration, audio.currentTime + 5); }
  });

  /* ── Volume ── */
  function setVolume(v) {
    state.volume    = Math.max(0, Math.min(100, v));
    audio.volume    = state.volume / 100;
    volumeSlider.value = state.volume;
    volumeSlider.setAttribute('aria-valuenow', state.volume);
    const pct = state.volume;
    volumeSlider.style.background =
      `linear-gradient(90deg, var(--blue) ${pct}%, var(--border) ${pct}%)`;
  }

  volumeSlider.addEventListener('input', () => setVolume(parseInt(volumeSlider.value)));

  // Volume down button nudges down
  muteBtn.addEventListener('click', () => setVolume(state.volume - 10));
  volUpBtn.addEventListener('click', () => setVolume(state.volume + 10));

  /* ── Track info sheet ── */
  function buildSheet() {
    sheetGenreTitle.textContent = (meta().label || state.genre).toUpperCase();
    const list = tracks();
    sheetTracklist.innerHTML = list.map((t, i) =>
      `<li class="sheet-track-item ${i === state.trackIndex ? 'active' : ''}"
           role="option"
           aria-selected="${i === state.trackIndex ? 'true' : 'false'}"
           data-index="${i}"
           tabindex="0">
         <span class="sheet-track-num">${i + 1}</span>
         <span class="sheet-track-title">${t.title}</span>
       </li>`
    ).join('');

    // Click to play from sheet
    sheetTracklist.querySelectorAll('.sheet-track-item').forEach(item => {
      item.addEventListener('click', () => {
        loadTrack(parseInt(item.dataset.index), true);
        closeSheet();
      });
      item.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); item.click(); }
      });
    });
  }

  function openSheet() {
    buildSheet();
    trackInfoPanel.classList.add('open');
    sheetClose.focus();
  }

  function closeSheet() {
    trackInfoPanel.classList.remove('open');
    trackInfoBtn.focus();
  }

  trackInfoBtn.addEventListener('click', openSheet);
  sheetClose.addEventListener('click',   closeSheet);
  trackInfoBack.addEventListener('click', closeSheet);

  trackInfoPanel.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeSheet();
  });

  /* ── Keyboard shortcuts ── */
  document.addEventListener('keydown', e => {
    const tag = document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'BUTTON') return;
    if (e.key === ' ') { e.preventDefault(); togglePlay(); }
  });

  /* ── Init ── */
  function init() {
    const saved = localStorage.getItem('focusedfm-theme') || 'light';
    applyTheme(saved);
    setVolume(80);
    loadTrack(0, false);
  }

  init();
})();
