// Sample student voices keep the board useful without collecting identifying details.
const studentVoices = [
  { title: 'KCSE & Mock Academic Shaming', text: '“When grades tumble from B+ to C, prefects and subject teachers publicly label it ‘laziness’ or ‘lack of prayer’ in front of school assembly, rather than checking on insomnia, depression, or 4:00 AM prep fatigue.”', origin: 'Observed in Form 3 & 4', emoji: '❤️‍🩹', count: 48 },
  { title: 'Boarding School “Vumilia” Stoicism', text: '“Toxic resilience culture where boys having panic attacks at night in dorms are ordered to ‘be a man’ (vumilia). Visiting the dispensary gets you mocked as trying to dodge cold morning run or punishment.”', origin: 'National Boys School Dorms', emoji: '🤝', count: 61 },
  { title: 'G&C Confidentiality Breach Terrors', text: '“Students fear opening up to school Guidance & Counseling teachers because intimate struggles become staffroom tea or are brought up during PTA meetings without consent.”', origin: 'Extra-County Girls High', emoji: '💔', count: 93 },
  { title: 'Social Isolation of Neurodivergent Peers', text: '“Students struggling with ADHD or social anxiety get ostracized and nicknamed ‘weirdo’ or ‘silent demon’. There is almost zero basic education on sensory overload.”', origin: 'Day Secondary Nairobi', emoji: '🫂', count: 35 }
];

const storyList = document.querySelector('#story-list');
const toast = document.querySelector('#toast');
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}

function renderStories() {
  studentVoices.forEach((voice, index) => {
    const article = document.createElement('article');
    article.className = 'story-card';
    article.innerHTML = `<div class="story-main"><span class="story-arrow" aria-hidden="true">→</span><div class="story-copy"><h3></h3><p></p></div></div><div class="story-footer"><span class="story-origin"></span><button class="reaction" type="button" aria-pressed="false" aria-label="Say you relate to this story"><span aria-hidden="true">${voice.emoji}</span><span class="reaction-label">${voice.count} felt this</span></button></div>`;
    article.querySelector('h3').textContent = voice.title;
    article.querySelector('.story-copy p').textContent = voice.text;
    article.querySelector('.story-origin').textContent = voice.origin;
    const button = article.querySelector('.reaction');
    button.addEventListener('click', () => toggleReaction(button, index));
    storyList.append(article);
  });
}

function toggleReaction(button, index) {
  const isPressed = button.getAttribute('aria-pressed') === 'true';
  const count = studentVoices[index].count + (isPressed ? 0 : 1);
  button.setAttribute('aria-pressed', String(!isPressed));
  button.querySelector('.reaction-label').textContent = `${count} felt this${isPressed ? '' : ' • You'}`;
  if (isPressed) button.querySelector('.reaction-label').textContent = `${studentVoices[index].count} felt this`;
}

function activatePillar(number) {
  document.querySelectorAll('.pillar-tab').forEach((tab) => {
    const selected = tab.dataset.pillar === String(number);
    tab.classList.toggle('active', selected);
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  document.querySelectorAll('.pillar-section').forEach((section, index) => {
    const selected = index + 1 === Number(number);
    section.hidden = !selected;
    section.classList.toggle('hidden', !selected);
  });
  document.querySelectorAll('.nav-item').forEach((item) => item.classList.remove('current'));
  const matchingNav = document.querySelector(`[data-nav-pillar="${number}"]`) || document.querySelector('.nav-item[href="#pillar-1"]');
  matchingNav?.classList.add('current');
}

renderStories();
document.querySelectorAll('.pillar-tab').forEach((tab) => {
  tab.addEventListener('click', () => activatePillar(tab.dataset.pillar));
  tab.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    const next = ((Number(tab.dataset.pillar) - 1 + direction + 3) % 3) + 1;
    activatePillar(next);
    document.querySelector(`#tab-${next}`).focus();
  });
});
document.querySelectorAll('[data-nav-pillar]').forEach((item) => item.addEventListener('click', (event) => {
  event.preventDefault();
  activatePillar(item.dataset.navPillar);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}));

const dialog = document.querySelector('#note-dialog');
document.querySelectorAll('[data-modal]').forEach((button) => button.addEventListener('click', () => {
  document.querySelector('#dialog-title').textContent = button.dataset.modal;
  document.querySelector('#form-feedback').textContent = '';
  dialog.showModal();
}));
const noteText = document.querySelector('#note-text');
noteText.addEventListener('input', () => {
  document.querySelector('#character-count').textContent = `${noteText.value.length} / 500`;
});
document.querySelector('#send-note').addEventListener('click', () => {
  const feedback = document.querySelector('#form-feedback');
  if (noteText.value.trim().length < 8) {
    feedback.textContent = 'Add a little more so others can understand your note.';
    noteText.focus();
    return;
  }
  // This static demo does not send or save notes. Avoid implying that it has.
  feedback.textContent = 'Thanks for sharing. This demo does not send or store notes yet.';
  noteText.value = '';
  document.querySelector('#character-count').textContent = '0 / 500';
});

document.querySelectorAll('.mood-option').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('.mood-option').forEach((option) => {
    option.classList.remove('selected');
    option.setAttribute('aria-pressed', 'false');
  });
  button.classList.add('selected');
  button.setAttribute('aria-pressed', 'true');
  document.querySelector('#mood-feedback').textContent = `Thanks for checking in: ${button.dataset.mood}. Your mood stays on this page only.`;
}));

document.querySelector('#veil-toggle').addEventListener('click', (event) => {
  const active = document.body.classList.toggle('veil');
  event.currentTarget.setAttribute('aria-pressed', String(active));
  event.currentTarget.setAttribute('aria-label', active ? 'Turn off privacy veil' : 'Turn on privacy veil');
  showToast(active ? 'Privacy veil on. Tap again to reveal.' : 'Privacy veil off.');
});

document.querySelector('#download-button').addEventListener('click', () => {
  const pageCopy = `Sema Nasi — Safe Space for Students\n\n${studentVoices.map((voice) => `${voice.title}\n${voice.text}\n${voice.origin}`).join('\n\n')}`;
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([pageCopy], { type: 'text/plain' }));
  link.download = 'sema-nasi-student-voices.txt';
  link.click();
  URL.revokeObjectURL(link.href);
  showToast('A copy of the student stories was downloaded.');
});
