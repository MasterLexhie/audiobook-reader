const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const screens = {
  upload: $('#screen-upload'),
  contents: $('#screen-contents'),
  player: $('#screen-player'),
};

function showScreen(name) {
  Object.values(screens).forEach((s) => s.classList.remove('active'));
  screens[name].classList.add('active');
}

// Theme toggle
const themeBtn = $('#theme-toggle');
themeBtn.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
});

// Upload → Contents
$('#open-file-btn').addEventListener('click', () => {
  showScreen('contents');
});

$('#drop-area').addEventListener('click', (e) => {
  if (e.target.closest('.upload-btn')) return;
  showScreen('contents');
});

// Drag & drop visual feedback
const dropArea = $('#drop-area');
['dragenter', 'dragover'].forEach((evt) =>
  dropArea.addEventListener(evt, (e) => {
    e.preventDefault();
    dropArea.classList.add('dragover');
  })
);
['dragleave', 'drop'].forEach((evt) =>
  dropArea.addEventListener(evt, (e) => {
    e.preventDefault();
    dropArea.classList.remove('dragover');
    if (evt === 'drop') showScreen('contents');
  })
);

// Contents → Player
$('#play-from-start').addEventListener('click', () => showScreen('player'));
$('#mobile-play-btn').addEventListener('click', () => showScreen('player'));

$$('.chapter-item').forEach((item) => {
  item.addEventListener('click', () => showScreen('player'));
});

// Player → Contents
$('#back-contents').addEventListener('click', () => showScreen('contents'));
$('#mobile-back-contents').addEventListener('click', () => showScreen('contents'));

// Contents → Upload
$('#change-book-btn').addEventListener('click', () => showScreen('upload'));

// Play/Pause toggle
function togglePlayPause(btn) {
  const pauseIcon = btn.querySelector('.pause-icon');
  const playIcon = btn.querySelector('.play-icon');
  if (!pauseIcon || !playIcon) {
    const isShowing = btn.querySelector('.pause-icon').style.display !== 'none';
    if (isShowing) {
      btn.querySelector('.pause-icon').style.display = 'none';
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '14');
      svg.setAttribute('height', '16');
      svg.setAttribute('viewBox', '0 0 9 10');
      svg.classList.add('play-icon-svg');
      const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      poly.setAttribute('points', '0,0 9,5 0,10');
      poly.setAttribute('fill', 'currentColor');
      svg.appendChild(poly);
      btn.appendChild(svg);
    } else {
      btn.querySelector('.pause-icon').style.display = '';
      const svg = btn.querySelector('.play-icon-svg');
      if (svg) svg.remove();
    }
    return;
  }
  const isPaused = pauseIcon.style.display === 'none';
  pauseIcon.style.display = isPaused ? '' : 'none';
  playIcon.style.display = isPaused ? 'none' : '';
}

$('#play-pause').addEventListener('click', () => togglePlayPause($('#play-pause')));
$('#mobile-play-pause').addEventListener('click', () => togglePlayPause($('#mobile-play-pause')));

// Speed cycling
const speeds = ['1×', '1.25×', '1.5×', '2×', '0.75×'];
let speedIdx = 0;
$$('.speed-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    speedIdx = (speedIdx + 1) % speeds.length;
    $$('.speed-btn').forEach((b) => (b.textContent = speeds[speedIdx]));
  });
});
