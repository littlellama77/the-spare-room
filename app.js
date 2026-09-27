/**
 * THE SPARE ROOM — Gentle Prototype
 * "A little extra space for your brain."
 *
 * Fully interactive prototype with local state, realistic data,
 * Web Audio sound design & ambient room sound, and smooth transitions.
 */

// ============================================================================
// 1. GENTLE AUDIO SYNTHESIZER (Web Audio API)
// ============================================================================
class GentleAudioEngine {
  constructor() {
    this.ctx = null;
    this.soundEffectsEnabled = true;
    this.ambientPlaying = false;
    this.ambientSource = null;
    this.ambientGain = null;
  }

  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Soft wooden tap / marimba click
  playTap() {
    if (!this.soundEffectsEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(240, now + 0.08);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  // Warm chime for quiet validation / completion (E5 -> G#5)
  playChime() {
    if (!this.soundEffectsEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, now); // E5
      osc.frequency.exponentialRampToValueAtTime(830.61, now + 0.16); // G#5

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.9);
    } catch (e) {
      // Audio fallback
    }
  }

  // Ambient gentle room sound (procedural pink noise filtered to simulate soft rain)
  toggleAmbient(enable) {
    this.init();
    if (!this.ctx) return false;

    if (enable && !this.ambientPlaying) {
      try {
        const bufferSize = 2 * this.ctx.sampleRate;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
          output[i] *= 0.04;
          b6 = white * 0.115926;
        }

        const whiteNoise = this.ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(650, this.ctx.currentTime);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.04, this.ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        whiteNoise.start();
        this.ambientSource = whiteNoise;
        this.ambientGain = gain;
        this.ambientPlaying = true;
        return true;
      } catch (e) {
        return false;
      }
    } else if (!enable && this.ambientPlaying) {
      if (this.ambientSource) {
        try {
          this.ambientSource.stop();
          this.ambientSource.disconnect();
        } catch (e) {}
      }
      this.ambientPlaying = false;
      return false;
    }
    return this.ambientPlaying;
  }
}

const audio = new GentleAudioEngine();

// ============================================================================
// 2. CENTRAL LOCAL STATE & MOCK DATA
// ============================================================================
const AppState = {
  activeScreen: 'screen-home',
  currentMood: null,
  energyFilter: 'all',

  // Home Focus Item
  homeFocus: {
    title: 'Finish presentation',
    step: 'Open the presentation.',
    energy: 'high',
    subtext: 'You do not have to write, edit, or finish anything. Just open it.',
    completed: false
  },

  // Home Reminder
  homeReminder: {
    title: 'Swimming · 6:00 PM',
    sub: 'Pack your goggles and towel beforehand',
    completed: false
  },

  // Home Note to remember
  homeRemember: {
    text: 'Buy paint on the way home.',
    completed: false
  },

  // Still on my mind list
  mindItems: [
    { id: 'm1', title: 'Finish portfolio', energy: 'medium', step: 'Pick one project to look at' },
    { id: 'm2', title: 'Call dentist', energy: 'low', step: 'Find the clinic number' },
    { id: 'm3', title: 'Buy birthday gift', energy: 'low', step: 'Write 2 small ideas' },
    { id: 'm4', title: 'Pay electricity bill', energy: 'low', step: 'Open the utility app' }
  ],

  // Things Organizer (Today, Soon, Later)
  things: {
    today: [
      { id: 't1', title: 'Finish presentation', energy: 'high', step: 'Open the presentation.', done: false },
      { id: 't2', title: 'Reply to Isha', energy: 'low', step: 'Just read her message first.', done: false },
      { id: 't3', title: 'Swim session', energy: 'medium', step: 'Put towel in backpack.', done: false }
    ],
    soon: [
      { id: 't4', title: 'Book dentist', energy: 'medium', step: 'Check open dates on phone.', done: false },
      { id: 't5', title: 'Buy birthday gift', energy: 'low', step: 'Jot down 2 ideas.', done: false },
      { id: 't6', title: 'Review health insurance', energy: 'medium', step: 'Log in to portal.', done: false }
    ],
    later: [
      { id: 't7', title: 'Clean cupboard', energy: 'medium', step: 'Sort just one single shelf.', done: false },
      { id: 't8', title: 'Research Japan trip', energy: 'low', step: 'Save one scenic place to a list.', done: false },
      { id: 't9', title: 'Organize photo albums', energy: 'low', step: 'Look through 5 pictures.', done: false }
    ]
  },

  // Calendar Planner (Physical desk planner translated to digital)
  calendar: [
    {
      dateKey: '2026-09-28',
      dayName: 'MON',
      dayNum: '28',
      isToday: false,
      items: [
        { type: 'reminder', title: 'Dentist · 4 PM', sub: 'Clinic downtown' },
        { type: 'task', title: 'Submit assignment', energy: 'high' },
        { type: 'note', noteText: 'Bring insurance card and medical record' }
      ]
    },
    {
      dateKey: '2026-09-29',
      dayName: 'TUE',
      dayNum: '29',
      isToday: true,
      items: [
        { type: 'task', title: 'Gym workout', energy: 'low' },
        { type: 'task', title: 'Buy groceries', energy: 'medium' },
        { type: 'reminder', title: 'Swimming · 6:00 PM', sub: 'Bring goggles' }
      ]
    },
    {
      dateKey: '2026-09-30',
      dayName: 'WED',
      dayNum: '30',
      isToday: false,
      items: [
        { type: 'task', title: 'Call Mom', energy: 'low' },
        { type: 'reminder', title: 'Evening walk · 7:30 PM', sub: 'With tea' }
      ]
    },
    {
      dateKey: '2026-10-01',
      dayName: 'THU',
      dayNum: '1',
      isToday: false,
      items: [
        { type: 'task', title: 'Water the plants', energy: 'low' },
        { type: 'note', noteText: 'Book package delivery expected afternoon' }
      ]
    },
    {
      dateKey: '2026-10-02',
      dayName: 'FRI',
      dayNum: '2',
      isToday: false,
      items: [
        { type: 'task', title: 'Team recap', energy: 'medium' },
        { type: 'reminder', title: 'Movie night · 8:00 PM', sub: 'Relax' }
      ]
    },
    {
      dateKey: '2026-10-03',
      dayName: 'SAT',
      dayNum: '3',
      isToday: false,
      items: [
        { type: 'note', noteText: 'Quiet reading morning. No screens until noon.' }
      ]
    },
    {
      dateKey: '2026-10-04',
      dayName: 'SUN',
      dayNum: '4',
      isToday: false,
      items: [
        { type: 'task', title: 'Gentle weekly prep', energy: 'low' }
      ]
    }
  ],

  // Journal Entries
  journalEntries: [
    {
      id: 'j1',
      date: 'Today · 9:14 PM',
      mood: '🫠',
      text: 'I have so much to do and somehow starting any of it feels impossible.'
    },
    {
      id: 'j2',
      date: 'Yesterday · 7:42 PM',
      mood: '😵💫',
      text: 'Maybe I don\'t need to finish everything. Maybe I just need to start with one thing.'
    },
    {
      id: 'j3',
      date: 'Sep 25 · 3:15 PM',
      mood: '✨',
      text: 'Took a walk without my phone. The air was cool and my mind finally stopped buzzing for twenty minutes.'
    }
  ],

  // Unstuck Mode Context
  unstuck: {
    currentTask: 'Finish my presentation',
    obstacle: null,
    tinyStep: 'Open the presentation.',
    reassurance: 'You do not have to write, edit, or finish anything. Just open it.',
    stepIndex: 0,
    evenSmallerSteps: []
  }
};

// ============================================================================
// 3. TOAST NOTIFICATIONS (Gentle & Calming)
// ============================================================================
function showCalmToast(message, duration = 3400) {
  const toast = document.getElementById('calm-toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('visible');

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('visible');
  }, duration);
}

// ============================================================================
// 4. NAVIGATION HANDLER
// ============================================================================
function navigateToScreen(targetScreenId) {
  audio.playTap();

  // Update tabs
  document.querySelectorAll('.nav-tab').forEach(tab => {
    const isTarget = tab.getAttribute('data-target') === targetScreenId;
    tab.classList.toggle('active', isTarget);
  });

  document.querySelectorAll('.m-nav-item').forEach(tab => {
    const isTarget = tab.getAttribute('data-target') === targetScreenId;
    tab.classList.toggle('active', isTarget);
  });

  // Switch screen views
  document.querySelectorAll('.screen-view').forEach(screen => {
    screen.classList.remove('active');
  });

  const activeScreen = document.getElementById(targetScreenId);
  if (activeScreen) {
    activeScreen.classList.add('active');
    AppState.activeScreen = targetScreenId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// ============================================================================
// 5. RENDERING FUNCTIONS
// ============================================================================

// Render Home Screen Components
function renderHomeScreen() {
  // Update Greeting based on time of day
  const hour = new Date().getHours();
  const greetingEl = document.getElementById('home-greeting-heading');
  if (greetingEl) {
    let greet = 'Good morning 🌱';
    if (hour >= 12 && hour < 17) greet = 'Good afternoon 🌱';
    else if (hour >= 17) greet = 'Good evening 🌱';
    greetingEl.textContent = greet;
  }

  // Focus Task Card
  const focusTitle = document.getElementById('home-focus-title');
  const focusStep = document.getElementById('home-focus-step');
  const focusCard = document.getElementById('home-focus-card');
  if (focusTitle && focusStep && focusCard) {
    if (AppState.homeFocus.completed) {
      focusCard.style.opacity = '0.55';
      focusTitle.style.textDecoration = 'line-through';
    } else {
      focusCard.style.opacity = '1';
      focusTitle.style.textDecoration = 'none';
      focusTitle.textContent = AppState.homeFocus.title;
      focusStep.textContent = AppState.homeFocus.step;
    }
  }

  // Reminder Card
  const remTitle = document.getElementById('home-reminder-title');
  const remCard = document.getElementById('home-reminder-card');
  if (remTitle && remCard) {
    if (AppState.homeReminder.completed) {
      remCard.style.display = 'none';
    } else {
      remCard.style.display = 'flex';
      remTitle.textContent = AppState.homeReminder.title;
    }
  }

  // Remember Card
  const remNoteText = document.getElementById('home-remember-text');
  const remNoteCard = document.getElementById('home-remember-card');
  if (remNoteText && remNoteCard) {
    if (AppState.homeRemember.completed) {
      remNoteCard.style.display = 'none';
    } else {
      remNoteCard.style.display = 'flex';
      remNoteText.textContent = AppState.homeRemember.text;
    }
  }

  // Still on my mind list
  const mindList = document.getElementById('home-mind-list');
  if (mindList) {
    if (AppState.mindItems.length === 0) {
      mindList.innerHTML = `<li class="mind-empty" style="text-align: center; color: var(--text-muted); font-size: 0.88rem; padding: 18px 0;">All clear. Your head has room to breathe. 🌿</li>`;
    } else {
      mindList.innerHTML = AppState.mindItems.map(item => `
        <li class="mind-item" data-id="${item.id}">
          <div class="mind-item-top">
            <div class="mind-title-wrap">
              <input type="checkbox" class="mind-checkbox" title="Mark done">
              <span class="mind-title">${escapeHTML(item.title)}</span>
            </div>
            <span class="energy-badge energy-${item.energy}">
              ${item.energy === 'low' ? '🌱 Low' : item.energy === 'medium' ? '🌿 Med' : '🔥 High'}
            </span>
          </div>
          <div class="mind-actions">
            <button class="btn-pill-action action-schedule-pill" data-id="${item.id}" data-title="${escapeHTML(item.title)}">Schedule</button>
            <button class="btn-pill-action action-remind-pill" data-id="${item.id}">Remind me</button>
            <button class="btn-pill-action action-unstuck-pill" data-id="${item.id}" data-title="${escapeHTML(item.title)}">🛟 Make smaller</button>
            <button class="btn-pill-action action-nottoday-pill" data-id="${item.id}" title="Quietly move to Later with no guilt">Not today</button>
          </div>
        </li>
      `).join('');
    }
  }
}

// Render Calendar Planner Desk (Spacious physical planner)
function renderCalendar() {
  const grid = document.getElementById('planner-days-grid');
  if (!grid) return;

  grid.innerHTML = AppState.calendar.map(day => `
    <div class="planner-day-col ${day.isToday ? 'is-today' : ''}" data-date="${day.dateKey}">
      <div class="day-header">
        <div class="day-title-wrap">
          <span class="day-name">${day.dayName}</span>
          <span class="day-num">${day.dayNum}</span>
        </div>
        ${day.isToday ? '<span class="day-today-tag">TODAY</span>' : ''}
      </div>

      <ul class="day-entries-list">
        ${day.items.map(item => {
          if (item.type === 'reminder') {
            return `
              <li class="planner-item item-type-reminder">
                <div class="planner-item-row">
                  <span class="planner-item-title">⏰ ${escapeHTML(item.title)}</span>
                </div>
                ${item.sub ? `<span class="planner-item-time">${escapeHTML(item.sub)}</span>` : ''}
              </li>
            `;
          } else if (item.type === 'task') {
            return `
              <li class="planner-item item-type-task">
                <div class="planner-item-row">
                  <span class="planner-item-title">📝 ${escapeHTML(item.title)}</span>
                  ${item.energy ? `<span class="energy-badge energy-${item.energy}" style="font-size:0.65rem; padding:1px 5px;">${item.energy === 'low' ? '🌱' : item.energy === 'medium' ? '🌿' : '🔥'}</span>` : ''}
                </div>
              </li>
            `;
          } else {
            return `
              <li class="planner-item item-type-note">
                <div class="planner-item-row">
                  <span class="planner-item-note-text">💡 "${escapeHTML(item.noteText)}"</span>
                </div>
              </li>
            `;
          }
        }).join('')}
      </ul>

      <button class="day-add-btn" data-date="${day.dateKey}" data-dayname="${day.dayName} ${day.dayNum}">+ Add item</button>
    </div>
  `).join('');
}

// Render Things Screen (TODAY, SOON, LATER) with energy filtering
function renderThings() {
  const filter = AppState.energyFilter;

  const renderColumn = (items, containerId, countId, category) => {
    const container = document.getElementById(containerId);
    const countEl = document.getElementById(countId);
    if (!container) return;

    let filtered = items;
    if (filter !== 'all') {
      filtered = items.filter(i => i.energy === filter);
    }

    if (countEl) countEl.textContent = filtered.length;

    if (filtered.length === 0) {
      container.innerHTML = `<div style="text-align:center; padding: 24px 0; color: var(--text-muted); font-size: 0.85rem; font-style: italic;">Nothing here right now. Put something down when you need to.</div>`;
      return;
    }

    container.innerHTML = filtered.map(item => `
      <div class="thing-card ${item.done ? 'completed' : ''}" data-id="${item.id}" data-category="${category}">
        <div class="thing-card-top">
          <span class="thing-title">${escapeHTML(item.title)}</span>
          <span class="energy-badge energy-${item.energy}">
            ${item.energy === 'low' ? '🌱 Low' : item.energy === 'medium' ? '🌿 Med' : '🔥 High'}
          </span>
        </div>

        ${item.step ? `
          <div class="thing-micro-step">
            <span>🌱 Tiny step: ${escapeHTML(item.step)}</span>
          </div>
        ` : ''}

        <div class="thing-actions-row">
          <button class="btn-thing-action action-done" data-id="${item.id}" data-category="${category}">
            ${item.done ? 'Undo' : '✓ Done'}
          </button>
          <button class="btn-thing-action action-schedule" data-id="${item.id}" data-title="${escapeHTML(item.title)}">Schedule</button>
          <button class="btn-thing-action action-remind" data-id="${item.id}">Remind me</button>
          <button class="btn-thing-action action-unstuck" data-id="${item.id}" data-title="${escapeHTML(item.title)}">🛟 Make smaller</button>
          <button class="btn-thing-action action-nottoday" data-id="${item.id}" data-category="${category}" title="Move quietly to Later">Not today</button>
        </div>
      </div>
    `).join('');
  };

  renderColumn(AppState.things.today, 'list-things-today', 'count-today', 'today');
  renderColumn(AppState.things.soon, 'list-things-soon', 'count-soon', 'soon');
  renderColumn(AppState.things.later, 'list-things-later', 'count-later', 'later');
}

// Render Journal Entries
function renderJournal() {
  const container = document.getElementById('journal-entries-container');
  if (!container) return;

  if (AppState.journalEntries.length === 0) {
    container.innerHTML = `<div style="text-align: center; color: var(--text-muted); font-style: italic; padding: 20px;">Your notebook is open and ready. Put down whatever comes to mind.</div>`;
    return;
  }

  container.innerHTML = AppState.journalEntries.map(entry => `
    <article class="journal-entry-card" data-id="${entry.id}">
      <div class="entry-header">
        <span class="entry-date">${escapeHTML(entry.date)}</span>
        <span class="entry-mood-badge">${escapeHTML(entry.mood)}</span>
      </div>
      <p class="entry-body-text">${escapeHTML(entry.text)}</p>
    </article>
  `).join('');
}

// Helper: Escape HTML string
function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag] || tag));
}

// ============================================================================
// 6. MOOD CHECK-IN BEHAVIOR
// ============================================================================
function setupMoodCheckin() {
  const moodResponses = {
    overwhelmed: {
      text: "Breathe out. When everything is loud, you only have to do one tiny thing at a time. The rest can wait in The Spare Room.",
      actionText: "Break down what's in front of you 🛟",
      action: () => launchUnstuckMode("Finish my presentation", "overwhelming")
    },
    stuck: {
      text: "Inertia is completely normal and not a character flaw. Let's find one physical action that takes almost zero effort.",
      actionText: "Launch Unstuck Mode 🛟",
      action: () => launchUnstuckMode("Finish my presentation", "dont-know-start")
    },
    'low-energy': {
      text: "Honor your battery today. You don't have to push through exhaustion. Let's look at gentle things that require almost nothing.",
      actionText: "Filter by 🌱 Low energy tasks",
      action: () => {
        AppState.energyFilter = 'low';
        document.querySelectorAll('.filter-pill').forEach(p => p.classList.toggle('active', p.getAttribute('data-energy') === 'low'));
        renderThings();
        navigateToScreen('screen-things');
        showCalmToast("Filtered to low energy tasks. Rest whenever you need 🌱");
      }
    },
    okay: {
      text: "Steady is a lovely place to be. Take things at a peaceful pace today, one item at a time.",
      actionText: "View Today's items",
      action: () => navigateToScreen('screen-things')
    },
    good: {
      text: "Wonderful. Enjoy your natural energy, but remember you still don't have to carry the whole world today.",
      actionText: "Check your planner 📅",
      action: () => navigateToScreen('screen-calendar')
    }
  };

  const pills = document.querySelectorAll('.mood-pill');
  const responseBox = document.getElementById('mood-response-box');
  const responseText = document.getElementById('mood-response-text');
  const responseAction = document.getElementById('mood-response-action');

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      audio.playTap();
      const mood = pill.getAttribute('data-mood');
      AppState.currentMood = mood;

      pills.forEach(p => p.classList.remove('selected'));
      pill.classList.add('selected');

      const data = moodResponses[mood];
      if (data && responseBox && responseText && responseAction) {
        responseText.textContent = data.text;
        responseAction.textContent = data.actionText;
        responseAction.onclick = () => {
          audio.playTap();
          data.action();
        };
        responseBox.style.display = 'flex';
      }
    });
  });
}

// ============================================================================
// 7. UNSTUCK MODE LOGIC (The gentle step-down engine)
// ============================================================================
function launchUnstuckMode(taskName = 'Finish my presentation', preselectedObstacle = null) {
  audio.playTap();
  const overlay = document.getElementById('unstuck-modal-overlay');
  const taskInput = document.getElementById('unstuck-task-name-input');
  if (!overlay) return;

  AppState.unstuck.currentTask = taskName;
  AppState.unstuck.stepIndex = 0;
  if (taskInput) taskInput.value = taskName;

  // Show Phase 1 by default
  showUnstuckPhase(1);
  overlay.classList.add('active');

  if (preselectedObstacle) {
    handleObstacleSelect(preselectedObstacle);
  }
}

function closeUnstuckMode() {
  audio.playTap();
  const overlay = document.getElementById('unstuck-modal-overlay');
  if (overlay) overlay.classList.remove('active');
}

function showUnstuckPhase(phaseNum) {
  document.querySelectorAll('.unstuck-view-phase').forEach(el => el.classList.remove('active'));
  const target = document.getElementById(`unstuck-view-phase${phaseNum}`);
  if (target) target.classList.add('active');
}

function handleObstacleSelect(obstacleType) {
  audio.playTap();
  AppState.unstuck.obstacle = obstacleType;
  const taskName = document.getElementById('unstuck-task-name-input')?.value || AppState.unstuck.currentTask;

  const headlineEl = document.getElementById('tiny-step-headline');
  const sublineEl = document.getElementById('tiny-step-subline');
  const taskTextEl = document.getElementById('tiny-step-task-text');
  const reassureEl = document.getElementById('tiny-step-task-reassurance');
  const standardBranch = document.getElementById('unstuck-standard-branch');
  const mindBranch = document.getElementById('unstuck-mind-branch');

  // Reset branches
  if (standardBranch) standardBranch.style.display = 'flex';
  if (mindBranch) mindBranch.style.display = 'none';

  // Tailored Micro-Actions based on psychological resistance
  if (obstacleType === 'overwhelming') {
    headlineEl.textContent = "Let's make it smaller.";
    sublineEl.textContent = "That's your only job right now.";
    taskTextEl.textContent = `Open the ${extractKeyword(taskName)}.`;
    reassureEl.textContent = "You do not have to write, edit, or finish anything. Just open it.";
    AppState.unstuck.evenSmallerSteps = [
      `Just open the ${extractKeyword(taskName)}.`,
      `Sit down at your desk and open your computer.`,
      `Put your hand on the mouse or keyboard.`
    ];
  } else if (obstacleType === 'dont-know-start') {
    headlineEl.textContent = "Let's find the first physical action.";
    sublineEl.textContent = "Inertia breaks when your body moves first.";
    taskTextEl.textContent = `Open the ${extractKeyword(taskName)}.`;
    reassureEl.textContent = "Look at the first slide or page. Don't touch the keyboard.";
    AppState.unstuck.evenSmallerSteps = [
      `Open the ${extractKeyword(taskName)}.`,
      `Locate the file and double click it.`,
      `Just open a blank page.`
    ];
  } else if (obstacleType === 'no-energy') {
    headlineEl.textContent = "Let's make this a low-energy task.";
    sublineEl.textContent = "No stamina required. Just presence.";
    taskTextEl.textContent = `Open the ${extractKeyword(taskName)} and just look at the first slide.`;
    reassureEl.textContent = "No typing, no formatting. Just rest your eyes on it for 30 seconds.";
    AppState.unstuck.evenSmallerSteps = [
      `Look at the first slide for 30 seconds.`,
      `Just take one sip of water and sit comfortably.`,
      `Rest for 5 minutes without feeling guilty.`
    ];
  } else if (obstacleType === 'dont-want-to') {
    headlineEl.textContent = "That is completely valid.";
    sublineEl.textContent = "You don't have to feel motivated to take one tiny step.";
    taskTextEl.textContent = `Set a timer for 2 minutes, or type one single word.`;
    reassureEl.textContent = "Once 2 minutes are up, you are free to stop if you still want to.";
    AppState.unstuck.evenSmallerSteps = [
      `Type one single word.`,
      `Open the window and leave it open.`,
      `Put a pencil next to your paper.`
    ];
  } else if (obstacleType === 'distracted') {
    headlineEl.textContent = "Your brain is looking for comfort. That's okay.";
    sublineEl.textContent = "Let's give you a clean quiet pocket of space.";
    taskTextEl.textContent = `Take one deep breath. Close every window except the ${extractKeyword(taskName)}.`;
    reassureEl.textContent = "Just 60 seconds with this single screen.";
    AppState.unstuck.evenSmallerSteps = [
      `Close or minimize background tabs.`,
      `Take three slow deep breaths.`,
      `Turn your phone face down.`
    ];
  } else if (obstacleType === 'something-else') {
    headlineEl.textContent = "Maybe the task isn't the problem.";
    sublineEl.textContent = "When another thought is crowding your mind, working is twice as hard.";
    taskTextEl.textContent = `Put down what's distracting you first.`;
    reassureEl.textContent = "Write the other thought in your Journal so your brain can let go.";
    if (standardBranch) standardBranch.style.display = 'none';
    if (mindBranch) mindBranch.style.display = 'block';
  }

  showUnstuckPhase(2);
}

function extractKeyword(task) {
  if (!task) return 'task';
  const clean = task.toLowerCase();
  if (clean.includes('presentation')) return 'presentation';
  if (clean.includes('portfolio')) return 'portfolio';
  if (clean.includes('assignment')) return 'assignment';
  if (clean.includes('email')) return 'inbox';
  if (clean.includes('bill')) return 'billing page';
  if (clean.includes('room') || clean.includes('cupboard')) return 'space';
  return task;
}

// Setup Unstuck events
function setupUnstuckEvents() {
  // Close button
  document.getElementById('btn-close-unstuck')?.addEventListener('click', closeUnstuckMode);

  // Phase 1: Obstacle buttons
  document.querySelectorAll('.obstacle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const obstacle = btn.getAttribute('data-obstacle');
      handleObstacleSelect(obstacle);
    });
  });

  // Back to Phase 1
  document.getElementById('btn-unstuck-back-phase1')?.addEventListener('click', () => {
    audio.playTap();
    showUnstuckPhase(1);
  });

  // Even smaller button
  document.getElementById('btn-unstuck-even-smaller')?.addEventListener('click', () => {
    audio.playTap();
    const steps = AppState.unstuck.evenSmallerSteps;
    if (steps && steps.length > 0) {
      AppState.unstuck.stepIndex = (AppState.unstuck.stepIndex + 1) % steps.length;
      const nextSmallest = steps[AppState.unstuck.stepIndex];
      const taskTextEl = document.getElementById('tiny-step-task-text');
      const reassureEl = document.getElementById('tiny-step-task-reassurance');
      if (taskTextEl) taskTextEl.textContent = nextSmallest;
      if (reassureEl) reassureEl.textContent = "Ridiculously small. That's the secret to breaking inertia.";
    }
  });

  // I did this tiny step (Phase 3 transition)
  document.getElementById('btn-unstuck-did-step')?.addEventListener('click', () => {
    audio.playChime();
    showUnstuckPhase(3);
  });

  // Branch: Write down in Journal
  document.getElementById('btn-unstuck-goto-journal')?.addEventListener('click', () => {
    closeUnstuckMode();
    navigateToScreen('screen-journal');
    const jInput = document.getElementById('journal-textarea');
    if (jInput) {
      jInput.value = `Right now my head is occupied with: `;
      jInput.focus();
    }
    showCalmToast("Put it down in your private notebook 🌱");
  });

  document.getElementById('btn-unstuck-mind-back')?.addEventListener('click', () => {
    audio.playTap();
    showUnstuckPhase(1);
  });

  // Phase 3: One more tiny step
  document.getElementById('btn-unstuck-next-step')?.addEventListener('click', () => {
    audio.playTap();
    const taskTextEl = document.getElementById('tiny-step-task-text');
    const reassureEl = document.getElementById('tiny-step-task-reassurance');
    if (taskTextEl) taskTextEl.textContent = "Read the first two bullet points.";
    if (reassureEl) reassureEl.textContent = "Still tiny. No writing yet. Just observe.";
    showUnstuckPhase(2);
  });

  // Phase 3: I'm done for now
  document.getElementById('btn-unstuck-done-now')?.addEventListener('click', () => {
    audio.playTap();
    closeUnstuckMode();
    showCalmToast("You moved. Starting was enough 🌱");
  });

  // Header & Home buttons launching unstuck
  document.getElementById('header-unstuck-btn')?.addEventListener('click', () => {
    launchUnstuckMode('Finish my presentation');
  });
  document.getElementById('m-nav-unstuck')?.addEventListener('click', () => {
    launchUnstuckMode('Finish my presentation');
  });
  document.getElementById('home-btn-unstuck')?.addEventListener('click', () => {
    launchUnstuckMode('Finish my presentation');
  });
  document.getElementById('btn-focus-unstuck')?.addEventListener('click', () => {
    launchUnstuckMode(AppState.homeFocus.title);
  });
  document.getElementById('btn-focus-start')?.addEventListener('click', () => {
    launchUnstuckMode(AppState.homeFocus.title, 'overwhelming');
  });
}

// ============================================================================
// 8. "NOT TODAY" POSTPONING PHILOSOPHY
// ============================================================================
// Crucial: "Not today doesn't mean never. Postponing is not failure."
function handleNotToday(taskTitle, taskId, sourceCategory = 'today') {
  audio.playTap();

  // If it's the home focus task
  if (taskTitle === AppState.homeFocus.title) {
    // Move home focus to Later
    AppState.things.later.unshift({
      id: 'postponed_' + Date.now(),
      title: AppState.homeFocus.title,
      energy: AppState.homeFocus.energy,
      step: AppState.homeFocus.step,
      done: false
    });
    AppState.homeFocus.title = 'Reply to Isha';
    AppState.homeFocus.step = 'Just read her message first.';
    AppState.homeFocus.energy = 'low';
    renderHomeScreen();
    renderThings();
    showCalmToast("Not today doesn't mean never. Safely moved to Later 🌱");
    return;
  }

  // If from "Still on my mind"
  const mindIndex = AppState.mindItems.findIndex(i => i.id === taskId);
  if (mindIndex !== -1) {
    const item = AppState.mindItems.splice(mindIndex, 1)[0];
    AppState.things.later.unshift({
      id: 'postponed_' + Date.now(),
      title: item.title,
      energy: item.energy,
      step: item.step,
      done: false
    });
    renderHomeScreen();
    renderThings();
    showCalmToast("Not today doesn't mean never. Moved to Later 🌱");
    return;
  }

  // If from Things (TODAY or SOON)
  if (sourceCategory && AppState.things[sourceCategory]) {
    const idx = AppState.things[sourceCategory].findIndex(t => t.id === taskId);
    if (idx !== -1) {
      const movedItem = AppState.things[sourceCategory].splice(idx, 1)[0];
      AppState.things.later.unshift(movedItem);
      renderThings();
      showCalmToast("Not today doesn't mean never. Moved to Later 🌱");
    }
  }
}

// ============================================================================
// 9. BRAIN DUMP PARSER (Simulated AI Thought Extraction)
// ============================================================================
function setupBrainDump() {
  const input = document.getElementById('braindump-input');
  const sampleBtn = document.getElementById('btn-load-sample-dump');
  const submitBtn = document.getElementById('btn-submit-dump');
  const clearBtn = document.getElementById('btn-clear-dump');
  const resultsArea = document.getElementById('braindump-results-area');
  const parsingState = document.getElementById('dump-parsing-state');
  const extractedCard = document.getElementById('dump-extracted-card');
  const itemsContainer = document.getElementById('extracted-items-container');
  const saveBtn = document.getElementById('btn-save-extracted-items');

  const defaultSample = "I need to finish my assignment and buy shampoo and call the dentist and I forgot to pay the bill and also I need to figure out what I'm doing this weekend...";

  sampleBtn?.addEventListener('click', () => {
    audio.playTap();
    if (input) input.value = defaultSample;
  });

  clearBtn?.addEventListener('click', () => {
    audio.playTap();
    if (input) input.value = '';
    if (resultsArea) resultsArea.style.display = 'none';
  });

  submitBtn?.addEventListener('click', () => {
    const text = input?.value.trim();
    if (!text) {
      showCalmToast("Type a few thoughts first, or tap 'Try example thoughts' 🌱");
      return;
    }

    audio.playTap();
    if (resultsArea) resultsArea.style.display = 'block';
    if (parsingState) parsingState.style.display = 'flex';
    if (extractedCard) extractedCard.style.display = 'none';

    // Simulated parsing delay (gentle unpacking feeling)
    setTimeout(() => {
      if (parsingState) parsingState.style.display = 'none';
      if (extractedCard) extractedCard.style.display = 'block';

      // Parse realistic items from text
      const extractedList = parseThoughtText(text);
      renderExtractedItems(extractedList, itemsContainer);
    }, 700);
  });

  function parseThoughtText(rawText) {
    // If user typed custom things or default sample, intelligently extract clauses
    if (rawText.includes('assignment') || rawText.includes('shampoo')) {
      return [
        { text: 'Finish assignment', defaultDest: 'today', energy: 'high' },
        { text: 'Buy shampoo', defaultDest: 'soon', energy: 'low' },
        { text: 'Call dentist', defaultDest: 'soon', energy: 'medium' },
        { text: 'Pay electricity bill', defaultDest: 'today', energy: 'low' },
        { text: 'Figure out weekend plans', defaultDest: 'later', energy: 'low' }
      ];
    }

    // Generic fallback split by 'and', commas, or periods
    const clauses = rawText.split(/(?:and|also|\.|\n|,)+/i)
      .map(s => s.trim())
      .filter(s => s.length > 3)
      .slice(0, 6);

    return clauses.map((item, idx) => ({
      text: item.charAt(0).toUpperCase() + item.slice(1),
      defaultDest: idx === 0 ? 'today' : idx === 1 ? 'soon' : 'later',
      energy: idx % 2 === 0 ? 'low' : 'medium'
    }));
  }

  function renderExtractedItems(items, container) {
    if (!container) return;
    container.innerHTML = items.map((item, index) => `
      <div class="extracted-row" data-index="${index}" data-text="${escapeHTML(item.text)}" data-energy="${item.energy}">
        <span class="extracted-item-text">☐ ${escapeHTML(item.text)}</span>
        <div class="extracted-dest-options" role="radiogroup">
          <button class="dest-pill ${item.defaultDest === 'today' ? 'active' : ''}" data-dest="today">Today</button>
          <button class="dest-pill ${item.defaultDest === 'soon' ? 'active' : ''}" data-dest="soon">Soon</button>
          <button class="dest-pill ${item.defaultDest === 'later' ? 'active' : ''}" data-dest="later">Later</button>
          <button class="dest-pill ${item.defaultDest === 'remember' ? 'active' : ''}" data-dest="remember">Just remember</button>
        </div>
      </div>
    `).join('');

    // Toggle destination pills
    container.querySelectorAll('.dest-pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        audio.playTap();
        const row = e.target.closest('.extracted-row');
        row.querySelectorAll('.dest-pill').forEach(p => p.classList.remove('active'));
        e.target.classList.add('active');
      });
    });
  }

  saveBtn?.addEventListener('click', () => {
    audio.playChime();
    const rows = itemsContainer?.querySelectorAll('.extracted-row');
    if (!rows || rows.length === 0) return;

    let savedCount = 0;
    rows.forEach(row => {
      const text = row.getAttribute('data-text');
      const energy = row.getAttribute('data-energy') || 'medium';
      const activeDest = row.querySelector('.dest-pill.active')?.getAttribute('data-dest') || 'soon';

      if (activeDest === 'remember') {
        AppState.homeRemember.text = text;
        AppState.homeRemember.completed = false;
      } else if (AppState.things[activeDest]) {
        AppState.things[activeDest].push({
          id: 'dump_' + Date.now() + Math.random().toString(36).substr(2, 4),
          title: text,
          energy: energy,
          step: `Open or start ${text.toLowerCase()}`,
          done: false
        });
      }
      savedCount++;
    });

    renderHomeScreen();
    renderThings();
    if (input) input.value = '';
    if (resultsArea) resultsArea.style.display = 'none';

    showCalmToast(`Unloaded ${savedCount} thoughts into The Spare Room 🌱`);
    navigateToScreen('screen-things');
  });

  // Direct home shortcut
  document.getElementById('home-btn-braindump')?.addEventListener('click', () => {
    navigateToScreen('screen-braindump');
  });
}

// ============================================================================
// 10. JOURNAL SAVE BEHAVIOR
// ============================================================================
function setupJournal() {
  const saveBtn = document.getElementById('btn-save-journal');
  const textarea = document.getElementById('journal-textarea');
  const moodBtns = document.querySelectorAll('.j-mood-btn');
  let selectedMood = '🫠';

  moodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      audio.playTap();
      moodBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedMood = btn.getAttribute('data-mood');
    });
  });

  saveBtn?.addEventListener('click', () => {
    const text = textarea?.value.trim();
    if (!text) {
      showCalmToast("Write a line or two first 🌱");
      return;
    }

    audio.playChime();
    const newEntry = {
      id: 'j_' + Date.now(),
      date: 'Just now',
      mood: selectedMood,
      text: text
    };

    AppState.journalEntries.unshift(newEntry);
    renderJournal();
    if (textarea) textarea.value = '';
    showCalmToast("Saved in your private notebook 📖");
  });
}

// ============================================================================
// 11. ADD SOMETHING MODAL (Tasks, Reminders, Notes)
// ============================================================================
function setupAddModal() {
  const overlay = document.getElementById('add-modal-overlay');
  const form = document.getElementById('add-item-form');
  const closeBtn = document.getElementById('btn-close-add-modal');
  const cancelBtn = document.getElementById('btn-cancel-add');
  const typeTabs = document.querySelectorAll('.modal-tab');

  const secTask = document.getElementById('form-section-task');
  const secReminder = document.getElementById('form-section-reminder');
  const secNote = document.getElementById('form-section-note');

  let activeType = 'task';

  const openModal = (initialType = 'task') => {
    audio.playTap();
    activeType = initialType;
    typeTabs.forEach(t => t.classList.toggle('active', t.getAttribute('data-type') === initialType));
    toggleSections(initialType);
    if (overlay) overlay.classList.add('active');
    document.getElementById('add-input-title')?.focus();
  };

  const closeModal = () => {
    audio.playTap();
    if (overlay) overlay.classList.remove('active');
    form?.reset();
  };

  function toggleSections(type) {
    if (secTask) secTask.style.display = type === 'task' ? 'block' : 'none';
    if (secReminder) secReminder.style.display = type === 'reminder' ? 'block' : 'none';
    if (secNote) secNote.style.display = type === 'note' ? 'block' : 'none';

    const titleLabel = document.getElementById('add-label-title');
    if (titleLabel) {
      if (type === 'task') titleLabel.textContent = "What is the task?";
      else if (type === 'reminder') titleLabel.textContent = "What would you like a reminder for?";
      else titleLabel.textContent = "What note would you like to keep?";
    }
  }

  typeTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      audio.playTap();
      activeType = tab.getAttribute('data-type');
      typeTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      toggleSections(activeType);
    });
  });

  closeBtn?.addEventListener('click', closeModal);
  cancelBtn?.addEventListener('click', closeModal);

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('add-input-title')?.value.trim();
    if (!title) return;

    audio.playChime();

    if (activeType === 'task') {
      const category = document.getElementById('add-select-category')?.value || 'today';
      const energy = document.getElementById('add-select-energy')?.value || 'medium';
      const tinystep = document.getElementById('add-input-tinystep')?.value.trim() || `Open or start ${title.toLowerCase()}`;

      AppState.things[category].unshift({
        id: 'task_' + Date.now(),
        title: title,
        energy: energy,
        step: tinystep,
        done: false
      });
      renderThings();
      showCalmToast(`Added "${title}" to ${category.toUpperCase()} 🌱`);
    } else if (activeType === 'reminder') {
      const time = document.getElementById('add-input-rem-time')?.value || '18:00';
      AppState.homeReminder.title = `${title} · ${time}`;
      AppState.homeReminder.completed = false;
      renderHomeScreen();
      showCalmToast(`Reminder set for ${time} ⏰`);
    } else if (activeType === 'note') {
      const placement = document.getElementById('add-note-placement')?.value || 'home';
      if (placement === 'home') {
        AppState.homeRemember.text = title;
        AppState.homeRemember.completed = false;
        renderHomeScreen();
      } else {
        // Today in calendar
        AppState.calendar[1].items.push({
          type: 'note',
          noteText: title
        });
        renderCalendar();
      }
      showCalmToast("Note pinned to your space 📌");
    }

    closeModal();
  });

  // Triggers for opening Add Modal
  document.getElementById('home-btn-add')?.addEventListener('click', () => openModal('task'));
  document.getElementById('btn-things-add-modal')?.addEventListener('click', () => openModal('task'));
  document.getElementById('cal-btn-add')?.addEventListener('click', () => openModal('reminder'));
  document.getElementById('btn-mind-add')?.addEventListener('click', () => openModal('task'));
}

// ============================================================================
// 12. QUICK SCHEDULE MODAL
// ============================================================================
function setupScheduleModal() {
  const overlay = document.getElementById('schedule-modal-overlay');
  const titleEl = document.getElementById('schedule-item-title');
  const confirmBtn = document.getElementById('btn-confirm-schedule');
  const cancelBtn = document.getElementById('btn-cancel-schedule');
  const closeBtn = document.getElementById('btn-close-schedule-modal');
  const selectEl = document.getElementById('schedule-date-select');

  let currentScheduleTitle = '';

  window.openScheduleModal = (title) => {
    audio.playTap();
    currentScheduleTitle = title;
    if (titleEl) titleEl.textContent = `Schedule: "${title}"`;
    if (overlay) overlay.classList.add('active');
  };

  const closeScheduleModal = () => {
    audio.playTap();
    if (overlay) overlay.classList.remove('active');
  };

  closeBtn?.addEventListener('click', closeScheduleModal);
  cancelBtn?.addEventListener('click', closeScheduleModal);

  confirmBtn?.addEventListener('click', () => {
    audio.playChime();
    const dateVal = selectEl?.value;
    const targetDay = AppState.calendar.find(d => d.dateKey === dateVal);

    if (targetDay) {
      targetDay.items.push({
        type: 'task',
        title: currentScheduleTitle,
        energy: 'medium'
      });
      renderCalendar();
      showCalmToast(`Placed on ${targetDay.dayName} ${targetDay.dayNum} in Calendar 📅`);
    }
    closeScheduleModal();
  });
}

// ============================================================================
// 13. GLOBAL EVENT DELEGATION & INTERACTIONS
// ============================================================================
function setupGlobalInteractions() {
  // Navigation tabs (desktop)
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-target');
      navigateToScreen(target);
    });
  });

  // Mobile bottom nav items
  document.querySelectorAll('.m-nav-item:not(.m-unstuck-btn)').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-target');
      navigateToScreen(target);
    });
  });

  // Brand link goes to home
  document.getElementById('brand-home-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    navigateToScreen('screen-home');
  });

  // Audio toggles in top bar
  const soundBtn = document.getElementById('sound-effects-toggle');
  soundBtn?.addEventListener('click', () => {
    audio.soundEffectsEnabled = !audio.soundEffectsEnabled;
    const icon = document.getElementById('sound-icon');
    if (icon) icon.textContent = audio.soundEffectsEnabled ? '🔔' : '🔕';
    showCalmToast(audio.soundEffectsEnabled ? 'Interaction sounds enabled' : 'Muted');
  });

  const ambientBtn = document.getElementById('ambient-sound-toggle');
  ambientBtn?.addEventListener('click', () => {
    const isPlaying = audio.toggleAmbient(!audio.ambientPlaying);
    ambientBtn.classList.toggle('active', isPlaying);
    showCalmToast(isPlaying ? 'Gentle rain ambience playing 🌧️' : 'Ambience paused');
  });

  // Energy Filter buttons in Things screen
  document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      audio.playTap();
      document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      AppState.energyFilter = pill.getAttribute('data-energy');
      renderThings();
    });
  });

  // Focus Task Card actions
  document.getElementById('btn-focus-done')?.addEventListener('click', () => {
    audio.playChime();
    AppState.homeFocus.completed = !AppState.homeFocus.completed;
    renderHomeScreen();
    showCalmToast(AppState.homeFocus.completed ? "Done! One step at a time 🌱" : "Marked active");
  });

  document.getElementById('btn-focus-nottoday')?.addEventListener('click', () => {
    handleNotToday(AppState.homeFocus.title, 'focus-task');
  });

  // Reminder done
  document.getElementById('btn-reminder-done')?.addEventListener('click', () => {
    audio.playChime();
    AppState.homeReminder.completed = true;
    renderHomeScreen();
    showCalmToast("Reminder completed ✓");
  });

  // Remember note done
  document.getElementById('btn-remember-done')?.addEventListener('click', () => {
    audio.playChime();
    AppState.homeRemember.completed = true;
    renderHomeScreen();
    showCalmToast("Note archived");
  });

  // Column Add buttons in Things screen
  document.querySelectorAll('.btn-column-add').forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-category');
      const select = document.getElementById('add-select-category');
      if (select) select.value = cat;
      const modalTrigger = document.getElementById('btn-things-add-modal');
      modalTrigger?.click();
    });
  });

  // Calendar inline day Add buttons
  document.addEventListener('click', (e) => {
    const dayAddBtn = e.target.closest('.day-add-btn');
    if (dayAddBtn) {
      const date = dayAddBtn.getAttribute('data-date');
      const dayName = dayAddBtn.getAttribute('data-dayname');
      const remDateInput = document.getElementById('add-input-rem-date');
      if (remDateInput) remDateInput.value = date;
      const modalTrigger = document.getElementById('cal-btn-add');
      modalTrigger?.click();
    }
  });

  // Calendar View Switch pills
  const btnPlanner = document.getElementById('btn-view-planner');
  const btnMonth = document.getElementById('btn-view-month');
  btnPlanner?.addEventListener('click', () => {
    audio.playTap();
    btnPlanner.classList.add('active');
    btnMonth?.classList.remove('active');
    document.getElementById('planner-days-grid').style.gridTemplateColumns = 'repeat(auto-fit, minmax(220px, 1fr))';
  });
  btnMonth?.addEventListener('click', () => {
    audio.playTap();
    btnMonth.classList.add('active');
    btnPlanner?.classList.remove('active');
    document.getElementById('planner-days-grid').style.gridTemplateColumns = 'repeat(auto-fit, minmax(160px, 1fr))';
    showCalmToast("Expanded to month layout view 📅");
  });

  // Calendar Prev/Next periods
  document.getElementById('cal-prev')?.addEventListener('click', () => {
    audio.playTap();
    showCalmToast("Viewing previous period");
  });
  document.getElementById('cal-next')?.addEventListener('click', () => {
    audio.playTap();
    showCalmToast("Viewing upcoming period");
  });

  // Things & Mind List action delegations
  document.addEventListener('click', (e) => {
    // Make smaller on any task
    const unstuckBtn = e.target.closest('.action-unstuck') || e.target.closest('.action-unstuck-pill');
    if (unstuckBtn) {
      const title = unstuckBtn.getAttribute('data-title');
      launchUnstuckMode(title || 'Finish my presentation');
      return;
    }

    // Not today on any task
    const notTodayBtn = e.target.closest('.action-nottoday') || e.target.closest('.action-nottoday-pill');
    if (notTodayBtn) {
      const id = notTodayBtn.getAttribute('data-id');
      const cat = notTodayBtn.getAttribute('data-category') || 'today';
      handleNotToday(null, id, cat);
      return;
    }

    // Done on any task
    const doneBtn = e.target.closest('.action-done');
    if (doneBtn) {
      audio.playChime();
      const id = doneBtn.getAttribute('data-id');
      const cat = doneBtn.getAttribute('data-category');
      const item = AppState.things[cat]?.find(t => t.id === id);
      if (item) {
        item.done = !item.done;
        renderThings();
        showCalmToast(item.done ? "Peaceful checkoff ✓" : "Restored");
      }
      return;
    }

    // Schedule on any task
    const schedBtn = e.target.closest('.action-schedule') || e.target.closest('.action-schedule-pill');
    if (schedBtn) {
      const title = schedBtn.getAttribute('data-title');
      window.openScheduleModal(title);
      return;
    }

    // Remind me on any task
    const remindBtn = e.target.closest('.action-remind') || e.target.closest('.action-remind-pill');
    if (remindBtn) {
      audio.playTap();
      showCalmToast("Gentle reminder set for this evening ⏰");
      return;
    }

    // Mind checkbox
    const mindCheck = e.target.closest('.mind-checkbox');
    if (mindCheck) {
      audio.playChime();
      const itemRow = mindCheck.closest('.mind-item');
      const id = itemRow.getAttribute('data-id');
      const idx = AppState.mindItems.findIndex(i => i.id === id);
      if (idx !== -1) {
        AppState.mindItems.splice(idx, 1);
        renderHomeScreen();
        showCalmToast("Cleared from your mind 🌱");
      }
      return;
    }
  });
}

// ============================================================================
// 14. INITIALIZATION
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  renderHomeScreen();
  renderCalendar();
  renderThings();
  renderJournal();

  setupMoodCheckin();
  setupUnstuckEvents();
  setupBrainDump();
  setupJournal();
  setupAddModal();
  setupScheduleModal();
  setupGlobalInteractions();

  // Allow clicking anywhere once to initialize audio context smoothly
  document.body.addEventListener('click', () => audio.init(), { once: true });
});
