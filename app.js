/**
 * THE SPARE ROOM — TIME + WORK = WORLD
 * Signature Interaction: Physical Hand-Drawn Scratch, Flying Seeds, Living World
 */

// ============================================================================
// 1. GENTLE AUDIO SYNTHESIZER (Native Web Audio API)
// ============================================================================
class GentleAudioEngine {
  constructor() {
    this.ctx = null;
    this.ambientGain = null;
    this.ambientSource = null;
    this.isAmbientPlaying = false;
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

  // Soft wooden tap
  playTap(freq = 440) {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, now + 0.08);

      gain.gain.setValueAtTime(0.045, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {}
  }

  // Satisfying mechanical wooden latch snap & click on puzzle piece placement
  playSnapClick() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // 1. High-frequency crisp mechanical click transient (2600Hz - 3400Hz)
      const clickBufferSize = Math.floor(this.ctx.sampleRate * 0.016);
      const clickBuffer = this.ctx.createBuffer(1, clickBufferSize, this.ctx.sampleRate);
      const clickData = clickBuffer.getChannelData(0);
      for (let i = 0; i < clickBufferSize; i++) {
        clickData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (clickBufferSize * 0.18));
      }
      const clickSource = this.ctx.createBufferSource();
      clickSource.buffer = clickBuffer;
      const clickFilter = this.ctx.createBiquadFilter();
      clickFilter.type = 'bandpass';
      clickFilter.frequency.setValueAtTime(2900, now);
      clickFilter.Q.setValueAtTime(4.2, now);
      const clickGain = this.ctx.createGain();
      clickGain.gain.setValueAtTime(0.35, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.016);
      clickSource.connect(clickFilter);
      clickFilter.connect(clickGain);
      clickGain.connect(this.ctx.destination);
      clickSource.start(now);

      // 2. Deep wooden desk knock / latch body resonance
      const woodOsc = this.ctx.createOscillator();
      const woodGain = this.ctx.createGain();
      woodOsc.type = 'triangle';
      woodOsc.frequency.setValueAtTime(220, now);
      woodOsc.frequency.exponentialRampToValueAtTime(55, now + 0.09);
      woodGain.gain.setValueAtTime(0.28, now);
      woodGain.gain.exponentialRampToValueAtTime(0.001, now + 0.095);
      woodOsc.connect(woodGain);
      woodGain.connect(this.ctx.destination);
      woodOsc.start(now);
      woodOsc.stop(now + 0.095);

      // 3. Sparkling harmonic chime overtone (G5, B5, E6)
      const chimeNotes = [783.99, 987.77, 1318.51];
      chimeNotes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + 0.02 + idx * 0.04);
        g.gain.setValueAtTime(0.08, now + 0.02 + idx * 0.04);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.55 + idx * 0.04);
        osc.connect(g);
        g.connect(this.ctx.destination);
        osc.start(now + 0.02 + idx * 0.04);
        osc.stop(now + 0.6 + idx * 0.04);
      });
    } catch (e) {}
  }

  // Subtle resonant magnetic glide cue when entering snap proximity
  playMagneticGlide() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.lastGlideTime && Date.now() - this.lastGlideTime < 240) return;
      this.lastGlideTime = Date.now();

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880.00, now + 0.12); // A5
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {}
  }

  // Continuous real-time marker/pencil friction stream on rough paper
  startScratchFriction() {
    try {
      this.init();
      if (!this.ctx || this.frictionNode) return;

      const sampleRate = this.ctx.sampleRate;
      const buffer = this.ctx.createBuffer(1, sampleRate, sampleRate);
      const data = buffer.getChannelData(0);
      let lastVal = 0;
      for (let i = 0; i < sampleRate; i++) {
        const white = Math.random() * 2 - 1;
        lastVal = (lastVal * 0.72 + white * 0.28);
        const tooth = (Math.random() < 0.14) ? (Math.random() * 2 - 1) * 2.0 : 0;
        data[i] = (lastVal * 2.0 + tooth * 0.7);
      }

      const src = this.ctx.createBufferSource();
      src.buffer = buffer;
      src.loop = true;

      // Resonant bandpass tuned to dry cardstock paper scraping (3400Hz - 4600Hz)
      const bandpass = this.ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(3600, this.ctx.currentTime);
      bandpass.Q.setValueAtTime(3.8, this.ctx.currentTime);

      const highpass = this.ctx.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.setValueAtTime(1200, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);

      src.connect(highpass);
      highpass.connect(bandpass);
      bandpass.connect(gain);
      gain.connect(this.ctx.destination);

      src.start();
      this.frictionSrc = src;
      this.frictionGain = gain;
      this.frictionFilter = bandpass;
      this.frictionNode = true;

      // Subtle contact touch tick
      this.playTap(260);
    } catch (e) {}
  }

  // Real-time ASMR paper scratch crunch step on pointer movement
  playPaperScratchStep(velocity, dist) {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const sampleRate = this.ctx.sampleRate;

      // 1. Crispy paper fiber crunch noise burst (14ms - 22ms)
      const durationSec = Math.max(0.014, Math.min(0.024, 0.012 + dist * 0.0006));
      const bufferSize = Math.floor(sampleRate * durationSec);
      const buffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        // Asymmetric decay with micro-grain spikes
        const env = Math.exp(-i / (bufferSize * 0.45));
        const grain = (Math.random() < 0.22) ? (Math.random() * 2 - 1) * 2.2 : (Math.random() * 2 - 1) * 0.8;
        data[i] = grain * env;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      // Resonant bandpass at paper scraping frequency (3400Hz - 5000Hz)
      const bandpass = this.ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      const centerFreq = Math.min(5200, 3600 + velocity * 600 + Math.random() * 400);
      bandpass.frequency.setValueAtTime(centerFreq, now);
      bandpass.Q.setValueAtTime(3.4, now);

      // Paper desk body resonator (850Hz)
      const bodyFilter = this.ctx.createBiquadFilter();
      bodyFilter.type = 'bandpass';
      bodyFilter.frequency.setValueAtTime(850 + Math.random() * 200, now);
      bodyFilter.Q.setValueAtTime(1.8, now);

      const gain = this.ctx.createGain();
      const targetGain = Math.min(0.36, 0.12 + Math.min(velocity, 2.5) * 0.14);
      gain.gain.setValueAtTime(targetGain, now);
      gain.gain.exponentialRampToValueAtTime(0.0005, now + durationSec);

      noise.connect(bandpass);
      noise.connect(bodyFilter);
      bandpass.connect(gain);
      bodyFilter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
    } catch (e) {}
  }

  updateScratchVelocity(velocity) {
    if (!this.ctx || !this.frictionGain) return;
    try {
      const now = this.ctx.currentTime;
      if (velocity > 0.02) {
        const targetVol = Math.min(0.26, 0.06 + velocity * 0.12);
        this.frictionGain.gain.cancelScheduledValues(now);
        this.frictionGain.gain.setTargetAtTime(targetVol, now, 0.015);

        if (this.frictionFilter) {
          const targetFreq = Math.min(5000, 3200 + velocity * 600);
          this.frictionFilter.frequency.setTargetAtTime(targetFreq, now, 0.02);
        }
      } else {
        this.frictionGain.gain.setTargetAtTime(0.0001, now, 0.03);
      }
    } catch (e) {}
  }

  stopScratchFriction() {
    if (!this.ctx || !this.frictionGain) return;
    try {
      const now = this.ctx.currentTime;
      this.frictionGain.gain.cancelScheduledValues(now);
      this.frictionGain.gain.setTargetAtTime(0.0001, now, 0.02);
      setTimeout(() => {
        if (this.frictionSrc) {
          try { this.frictionSrc.stop(); } catch(e){}
          try { this.frictionSrc.disconnect(); } catch(e){}
        }
        this.frictionSrc = null;
        this.frictionGain = null;
        this.frictionFilter = null;
        this.frictionNode = false;
      }, 35);
    } catch (e) {}
  }

  // Tactile physical stamp impact thud on completion
  playStampThud() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // 1. Resonant desk punch (low sine dropping fast)
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(170, now);
      osc.frequency.exponentialRampToValueAtTime(36, now + 0.12);

      oscGain.gain.setValueAtTime(0.32, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);

      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.13);

      // 2. Paper snap / crackle
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.035);
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      const nGain = this.ctx.createGain();
      nGain.gain.setValueAtTime(0.24, now);
      nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
      noise.connect(nGain);
      nGain.connect(this.ctx.destination);
      noise.start(now);
    } catch (e) {}
  }

  // Dopamine Chime: Lush, resonant, warm celestial chord
  playDopamineChime() {
    try {
      this.init();
      if (!this.ctx) return;
      const notes = [
        { freq: 523.25, time: 0.00, gain: 0.16 }, // C5
        { freq: 659.25, time: 0.06, gain: 0.18 }, // E5
        { freq: 783.99, time: 0.12, gain: 0.20 }, // G5
        { freq: 1046.50, time: 0.18, gain: 0.24 }, // C6
        { freq: 1318.51, time: 0.24, gain: 0.16 }  // E6
      ];

      notes.forEach(({ freq, time, gain: maxGain }) => {
        const now = this.ctx.currentTime + time;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(maxGain, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 1.65);
      });
    } catch (e) {}
  }

  // Legacy fallback
  playChime() {
    this.playDopamineChime();
  }

  // Procedural ambient rain
  toggleAmbientRain(shouldPlay) {
    this.init();
    if (!this.ctx) return false;

    if (shouldPlay && !this.isAmbientPlaying) {
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, this.ctx.currentTime);

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.025, this.ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);

      whiteNoise.start();
      this.ambientSource = whiteNoise;
      this.isAmbientPlaying = true;
      return true;
    } else if (!shouldPlay && this.isAmbientPlaying) {
      if (this.ambientGain) {
        this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.4);
        setTimeout(() => {
          if (this.ambientSource) {
            this.ambientSource.stop();
            this.ambientSource.disconnect();
          }
          this.isAmbientPlaying = false;
        }, 400);
      }
      return false;
    }
    return this.isAmbientPlaying;
  }
}

const audio = new GentleAudioEngine();

// ============================================================================
// 2. STATE STORE & DEMO DATA
// ============================================================================
const AppState = {
  activeProjectId: 'proj-1',
  isDrawerOpen: false,

  // Completed items shelf
  completedSlips: [],

  // Demo Projects
  projects: [
    {
      id: 'proj-1',
      title: 'Marketing Presentation',
      deadlineDay: 'FRI',
      deadlineText: 'Friday',
      totalSessions: 3,
      sessionDurationMin: 30,
      sessions: [
        {
          id: 'sess-1',
          projectId: 'proj-1',
          day: 'MON',
          title: 'Write the introduction',
          durationMin: 30,
          completed: false,
          isToday: true
        },
        {
          id: 'sess-2',
          projectId: 'proj-1',
          day: 'TUE',
          title: 'Draft slides 1–6 (Core thesis)',
          durationMin: 30,
          completed: false,
          isToday: false
        },
        {
          id: 'sess-3',
          projectId: 'proj-1',
          day: 'THU',
          title: 'Polish design & rehearse 5m pitch',
          durationMin: 30,
          completed: false,
          isToday: false
        }
      ]
    },
    {
      id: 'proj-2',
      title: 'Reply to internship emails',
      deadlineDay: 'WED',
      deadlineText: 'Wednesday',
      totalSessions: 2,
      sessionDurationMin: 30,
      sessions: [
        {
          id: 'sess-2-1',
          projectId: 'proj-2',
          day: 'MON',
          title: 'Draft email responses to Acme & Studio',
          durationMin: 30,
          completed: false,
          isToday: true
        },
        {
          id: 'sess-2-2',
          projectId: 'proj-2',
          day: 'TUE',
          title: 'Attach portfolio links & send',
          durationMin: 30,
          completed: false,
          isToday: false
        }
      ]
    },
    {
      id: 'proj-3',
      title: 'Book dentist appointment',
      deadlineDay: 'THU',
      deadlineText: 'Thursday',
      totalSessions: 1,
      sessionDurationMin: 15,
      sessions: [
        {
          id: 'sess-3-1',
          projectId: 'proj-3',
          day: 'MON',
          title: 'Call clinic & confirm insurance coverage',
          durationMin: 15,
          completed: false,
          isToday: true
        }
      ]
    }
  ],

  // 7 Days of the Week
  days: [
    { dayCode: 'MON', dateNumber: '28', isToday: true },
    { dayCode: 'TUE', dateNumber: '29', isToday: false },
    { dayCode: 'WED', dateNumber: '30', isToday: false },
    { dayCode: 'THU', dateNumber: '1',  isToday: false },
    { dayCode: 'FRI', dateNumber: '2',  isToday: false },
    { dayCode: 'SAT', dateNumber: '3',  isToday: false },
    { dayCode: 'SUN', dateNumber: '4',  isToday: false }
  ],

  // The Living Illustration World — Hand-Drawn Continuous Puzzle
  world: {
    title: 'The Valley of the Watermill',
    month: 'September',
    theme: 'day', // 'day' | 'sunset' | 'night'
    fragments: [
      {
        id: 'frag-1',
        name: 'Watermill Cottage & Hearth',
        subtitle: 'The Anchor Stone',
        x: 220,
        y: 170,
        targetX: 220,
        targetY: 170,
        width: 270,
        height: 240,
        isUnlocked: true,
        isPlaced: true,
        visualClue: 'The hearth of the valley sits by the millstream.',
        feedback: 'The hearth of the valley rests peacefully.',
        renderer: 'sector1'
      },
      {
        id: 'frag-2',
        name: 'Arched Bridge & River Basin',
        subtitle: 'Clue: Riverbank & Bridge Footings',
        x: 0,
        y: 0,
        targetX: 470,
        targetY: 190,
        width: 280,
        height: 230,
        isUnlocked: true,
        isPlaced: false,
        visualClue: 'Look closely at the riverbank on the cottage’s right edge—the bridge approach and water ripples continue across.',
        feedback: 'The stone bridge arches seamlessly across the flowing river! 🌉',
        renderer: 'sector2'
      },
      {
        id: 'frag-3',
        name: 'Clocktower & Starlit Observatory',
        subtitle: 'Clue: Terracotta Roofline & Copper Chimney',
        x: 0,
        y: 0,
        targetX: 250,
        targetY: 10,
        width: 260,
        height: 200,
        isUnlocked: true,
        isPlaced: false,
        visualClue: 'The cottage roof ridge, copper stovepipe, and purple wisteria vines climb upward toward this timber tower.',
        feedback: 'The clocktower roofline and wisteria vines connect above the cottage! 🕰️',
        renderer: 'sector3'
      },
      {
        id: 'frag-4',
        name: 'Cobblestone Lane & Pumpkin Patch',
        subtitle: 'Clue: Dirt Wagon Ruts & Dry-Stone Wall',
        x: 0,
        y: 0,
        targetX: 190,
        targetY: 380,
        width: 290,
        height: 190,
        isUnlocked: false,
        isPlaced: false,
        visualClue: 'The dirt wagon trail exiting south from the mill turns into a sunlit cobblestone lane bordered by stone walls.',
        feedback: 'The cobblestone lane and stone wall continue down into the valley! 🌻',
        renderer: 'sector4'
      },
      {
        id: 'frag-5',
        name: 'Ancient Oak & Windmill Bluff',
        subtitle: 'Clue: Gnarled Knotted Oak Boughs',
        x: 0,
        y: 0,
        targetX: 10,
        targetY: 130,
        width: 240,
        height: 270,
        isUnlocked: false,
        isPlaced: false,
        visualClue: 'The leafy branch stubs reaching out from the left edge of the cottage belong to the giant Ancient Oak.',
        feedback: 'The ancient oak boughs join together in a lush canopy! 🌳',
        renderer: 'sector5'
      },
      {
        id: 'frag-6',
        name: 'Mountain Waterfall & Alpine Aqueduct',
        subtitle: 'Clue: Cascading Mountain Spring & Cliff Face',
        x: 0,
        y: 0,
        targetX: 490,
        targetY: 10,
        width: 260,
        height: 210,
        isUnlocked: false,
        isPlaced: false,
        visualClue: 'The mountain spring cascade rushes down the granite cliff face directly into the river basin below.',
        feedback: 'The mountain waterfall rushes down to feed the valley river! 🌊',
        renderer: 'sector6'
      }
    ]
  },

  // Focus Timer
  focusTimer: {
    activeSessionId: null,
    durationMins: 30,
    totalSeconds: 30 * 60,
    remainingSeconds: 30 * 60,
    isRunning: false,
    intervalId: null
  },

  // Break Companion
  breakTimer: {
    durationMins: 5,
    remainingSeconds: 5 * 60,
    isRunning: false,
    intervalId: null
  }
};

// ============================================================================
// 3. FREEHAND REAL-TIME TACTILE SCRATCH ENGINE
// ============================================================================
class FreehandScratcher {
  constructor({ canvas, textElement, slipElement, onProgress, onComplete }) {
    this.canvas = canvas;
    this.textEl = textElement;
    this.slipEl = slipElement || canvas.closest('.sequence-slip') || canvas.closest('.paper-task-slip');
    this.onProgress = onProgress || null;
    this.onComplete = onComplete;
    this.ctx = canvas.getContext('2d');
    this.isDrawing = false;
    this.isCompleted = false;
    this.coveredMinX = Infinity;
    this.coveredMaxX = -Infinity;
    this.points = [];
    this.allStrokes = [];
    this.lastX = 0;
    this.lastY = 0;
    this.lastTime = 0;
    this.prevMid = null;

    this.resize = this.resize.bind(this);
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);

    this.initEvents();
    this.resize();
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = Math.floor(rect.width * dpr);
    this.canvas.height = Math.floor(rect.height * dpr);
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(dpr, dpr);
    this.redraw();
  }

  redraw() {
    if (!this.allStrokes || this.allStrokes.length === 0) return;
    for (const stroke of this.allStrokes) {
      if (stroke.length < 2) continue;
      let prevMid = { x: stroke[0].x, y: stroke[0].y };
      for (let i = 1; i < stroke.length; i++) {
        const pt = stroke[i];
        const nextMid = { x: (stroke[i - 1].x + pt.x) / 2, y: (stroke[i - 1].y + pt.y) / 2 };
        this.renderCurve(prevMid, stroke[i - 1], nextMid, pt.width);
        prevMid = nextMid;
      }
    }
  }

  initEvents() {
    this.canvas.addEventListener('pointerdown', this.onPointerDown);
    this.canvas.addEventListener('pointermove', this.onPointerMove);
    this.canvas.addEventListener('pointerup', this.onPointerUp);
    this.canvas.addEventListener('pointercancel', this.onPointerUp);
    window.addEventListener('resize', this.resize);
  }

  destroy() {
    if (this.canvas) {
      this.canvas.removeEventListener('pointerdown', this.onPointerDown);
      this.canvas.removeEventListener('pointermove', this.onPointerMove);
      this.canvas.removeEventListener('pointerup', this.onPointerUp);
      this.canvas.removeEventListener('pointercancel', this.onPointerUp);
    }
    window.removeEventListener('resize', this.resize);
    audio.stopScratchFriction();
  }

  reset() {
    this.isDrawing = false;
    this.isCompleted = false;
    this.coveredMinX = Infinity;
    this.coveredMaxX = -Infinity;
    this.points = [];
    this.allStrokes = [];
    this.prevMid = null;
    const dpr = window.devicePixelRatio || 1;
    const w = this.canvas.width / dpr;
    const h = this.canvas.height / dpr;
    this.ctx.clearRect(0, 0, w, h);
    if (this.slipEl) {
      this.slipEl.classList.remove('pressing', 'stamped-complete');
    }
  }

  getCanvasCoords(e) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  onPointerDown(e) {
    if (this.isCompleted) return;
    e.preventDefault();
    window.getSelection()?.removeAllRanges();

    this.isDrawing = true;
    try {
      this.canvas.setPointerCapture(e.pointerId);
    } catch (err) {}

    audio.init();
    audio.startScratchFriction();

    if (this.slipEl) {
      this.slipEl.classList.add('pressing');
    }

    const { x, y } = this.getCanvasCoords(e);
    this.lastX = x;
    this.lastY = y;
    this.lastTime = Date.now();

    const initialWidth = 3.6;
    const pt = { x, y, width: initialWidth, time: this.lastTime };
    this.points = [pt];
    this.currentStroke = [pt];
    this.allStrokes.push(this.currentStroke);

    // Initial authentic pen ink touch dab on paper
    this.ctx.save();
    this.ctx.fillStyle = '#9A291A';
    this.ctx.beginPath();
    this.ctx.arc(x, y, initialWidth * 0.45, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();

    this.updateCoverage(x, y);
  }

  onPointerMove(e) {
    if (!this.isDrawing || this.isCompleted) return;
    e.preventDefault();
    window.getSelection()?.removeAllRanges();

    const events = (e.getCoalescedEvents && e.getCoalescedEvents().length > 0)
      ? e.getCoalescedEvents()
      : [e];

    for (const evt of events) {
      const { x, y } = this.getCanvasCoords(evt);
      const dx = x - this.lastX;
      const dy = y - this.lastY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 1.0) continue;

      const now = Date.now();
      const dt = Math.max(1, now - this.lastTime);
      const speed = dist / dt;

      // Real-time ASMR paper scratch step crunch on movement
      audio.playPaperScratchStep(speed, dist);
      audio.updateScratchVelocity(speed);

      // Authentic stationery pen width: 2.8px to 4.0px
      let width = Math.max(2.8, Math.min(4.0, 3.6 - speed * 0.15));
      if (evt.pressure && evt.pressure > 0) {
        width = 2.4 + evt.pressure * 1.8;
      }

      const curPt = { x, y, width, time: now };
      this.points.push(curPt);
      this.currentStroke.push(curPt);

      // Render the papery pen stroke segment
      this.renderPaperySegment({ x: this.lastX, y: this.lastY }, curPt, speed);

      this.lastX = x;
      this.lastY = y;
      this.lastTime = now;
      this.updateCoverage(x, y);
    }
  }

  renderPaperySegment(p1, p2, speed) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 0.5) return;

    // Normal unit vector perpendicular to drag
    const nx = -dy / dist;
    const ny = dx / dist;
    const baseWidth = p2.width;

    this.ctx.save();

    // 1. Organic paper-tooth micro-jitter (natural hand & paper texture friction)
    const tooth = (Math.random() - 0.5) * 0.75;
    const midX = (p1.x + p2.x) / 2 + nx * tooth;
    const midY = (p1.y + p2.y) / 2 + ny * tooth;

    // 2. Primary authentic stationery terracotta ink stroke
    this.ctx.beginPath();
    this.ctx.moveTo(p1.x, p1.y);
    this.ctx.quadraticCurveTo(midX, midY, p2.x, p2.y);
    this.ctx.strokeStyle = '#9A291A';
    this.ctx.lineWidth = baseWidth;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.globalAlpha = 0.88;
    this.ctx.stroke();

    // 3. Concentrated inner rollerball/ballpoint core filament
    this.ctx.beginPath();
    this.ctx.moveTo(p1.x + nx * 0.35, p1.y + ny * 0.35);
    this.ctx.lineTo(p2.x + nx * 0.3, p2.y + ny * 0.3);
    this.ctx.strokeStyle = '#6B1B10';
    this.ctx.lineWidth = Math.max(1.0, baseWidth * 0.42);
    this.ctx.globalAlpha = 0.72;
    this.ctx.stroke();

    // 4. Subtle paper-tooth fiber edge grain
    this.ctx.beginPath();
    const edgeOffset = (Math.random() > 0.5 ? 1 : -1) * (baseWidth * 0.4);
    this.ctx.moveTo(p1.x + nx * edgeOffset, p1.y + ny * edgeOffset);
    this.ctx.lineTo(p2.x + nx * (edgeOffset * 0.85), p2.y + ny * (edgeOffset * 0.85));
    this.ctx.strokeStyle = '#BA412C';
    this.ctx.lineWidth = Math.max(0.7, baseWidth * 0.28);
    this.ctx.globalAlpha = 0.38;
    this.ctx.stroke();

    // 5. Paper fiber dry flecks & tooth stipples
    if (dist > 3 && Math.random() < 0.35) {
      const fleckOffset = (Math.random() - 0.5) * baseWidth * 1.1;
      const fX = midX + nx * fleckOffset;
      const fY = midY + ny * fleckOffset;
      this.ctx.beginPath();
      this.ctx.arc(fX, fY, 0.35 + Math.random() * 0.45, 0, Math.PI * 2);
      this.ctx.fillStyle = '#6B1B10';
      this.ctx.globalAlpha = 0.55;
      this.ctx.fill();
    }

    this.ctx.restore();
  }

  onPointerUp(e) {
    if (!this.isDrawing) return;
    this.isDrawing = false;
    audio.stopScratchFriction();
    this.prevMid = null;

    if (this.slipEl) {
      this.slipEl.classList.remove('pressing');
    }

    try {
      this.canvas.releasePointerCapture(e.pointerId);
    } catch (err) {}
  }

  updateCoverage(x, y) {
    if (this.isCompleted || !this.textEl) return;
    const textRect = this.textEl.getBoundingClientRect();
    const canvasRect = this.canvas.getBoundingClientRect();

    const textTop = textRect.top - canvasRect.top;
    const textBottom = textRect.bottom - canvasRect.top;

    // Forgiving vertical range (+/- 45px)
    if (y >= textTop - 45 && y <= textBottom + 45) {
      this.coveredMinX = Math.min(this.coveredMinX, x);
      this.coveredMaxX = Math.max(this.coveredMaxX, x);

      const textLeft = textRect.left - canvasRect.left;
      const textRight = textRect.right - canvasRect.left;
      const textWidth = Math.max(textRect.width, 1);

      const strokeOverlapLeft = Math.max(this.coveredMinX, textLeft);
      const strokeOverlapRight = Math.min(this.coveredMaxX, textRight);
      const coveredWidth = Math.max(0, strokeOverlapRight - strokeOverlapLeft);
      const ratio = coveredWidth / textWidth;

      if (this.onProgress) {
        this.onProgress(ratio);
      }

      // Dopamine threshold: 42% crossing!
      if (ratio >= 0.42 && !this.isCompleted) {
        this.isCompleted = true;
        audio.stopScratchFriction();
        audio.playStampThud();
        audio.playDopamineChime();

        if (this.slipEl) {
          this.slipEl.classList.remove('pressing');
          this.slipEl.classList.add('stamped-complete');
        }

        this.onComplete();
      }
    }
  }
}

// ============================================================================
// 4. INITIALIZATION
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  renderMainHero();
  renderProjectFilterPills();
  renderCalendarDesk();
  initProgressiveDrawer();
  initFocusTimerFlow();
  initLivingWorldScreen();
  initMiniPlayTools();
  initAITaskEntryModal();
  initBreakSystem();
  initAmbientSoundToggle();
});

function getActiveProject() {
  return AppState.projects.find(p => p.id === AppState.activeProjectId) || AppState.projects[0];
}

// ============================================================================
// 5. MAIN HERO: "Just this." & TACTILE PAPER SLIP
// ============================================================================
let heroScratcher = null;

function renderMainHero() {
  const project = getActiveProject();
  const todaySession = project.sessions.find(s => s.isToday && !s.completed)
                    || project.sessions.find(s => !s.completed);

  const projLabel = document.getElementById('hero-project-label');
  if (projLabel) projLabel.textContent = project.title.toUpperCase();

  const taskTitle = document.getElementById('hero-task-title');
  const scratchBox = document.getElementById('hero-scratch-box');
  const durationLabel = document.getElementById('hero-duration-label');
  const startBtn = document.getElementById('btn-start-hero');

  if (todaySession) {
    if (taskTitle) {
      taskTitle.textContent = todaySession.title;
      taskTitle.classList.remove('is-scratched');
    }
    if (scratchBox) {
      scratchBox.textContent = '□';
      scratchBox.classList.remove('completed');
    }
    if (durationLabel) {
      durationLabel.textContent = `${todaySession.durationMin} minutes`;
    }
    if (startBtn) {
      startBtn.style.opacity = '1';
      startBtn.style.pointerEvents = 'auto';
      startBtn.onclick = () => {
        launchFocusMode(todaySession);
        audio.playTap(520);
      };
    }
    initHeroFreehandScratch(todaySession, project);
  } else {
    // All sessions complete for today
    if (taskTitle) {
      taskTitle.textContent = 'All sessions complete for today ✨';
      taskTitle.classList.remove('is-scratched');
    }
    if (scratchBox) {
      scratchBox.textContent = '✓';
      scratchBox.classList.add('completed');
    }
    if (durationLabel) {
      durationLabel.textContent = 'Rest & celebrate your world 🌿';
    }
    if (startBtn) {
      startBtn.style.opacity = '0.5';
      startBtn.style.pointerEvents = 'none';
      startBtn.onclick = null;
    }
    initHeroFreehandScratch(null, project);
  }

  // Update top bar diorama count
  updateWorldTrackerCounters();

  renderCompletedShelf();
}

function initHeroFreehandScratch(session, project) {
  const canvas = document.getElementById('hero-freehand-canvas');
  const taskTitle = document.getElementById('hero-task-title');
  const scratchBox = document.getElementById('hero-scratch-box');
  const scratchCue = document.getElementById('hero-scratch-cue');
  if (!canvas || !taskTitle) return;

  if (heroScratcher) {
    heroScratcher.destroy();
    heroScratcher = null;
  }

  if (!session || session.completed) {
    canvas.style.display = 'none';
    if (scratchCue) scratchCue.style.display = 'none';
    return;
  }

  canvas.style.display = 'block';
  if (scratchCue) {
    scratchCue.style.display = 'inline-block';
    scratchCue.textContent = 'drag across to scratch off ✏️';
    scratchCue.style.opacity = '0.8';
  }

  // Allow DOM to layout before canvas sizing
  requestAnimationFrame(() => {
    heroScratcher = new FreehandScratcher({
      canvas: canvas,
      textElement: taskTitle,
      slipElement: document.getElementById('hero-task-slip'),
      onProgress: (ratio) => {
        if (ratio > 0.08 && scratchCue) {
          scratchCue.style.opacity = '0.5';
        }
      },
      onComplete: () => {
        // 1. Recognition
        if (scratchBox) {
          scratchBox.textContent = '✓';
          scratchBox.classList.add('completed');
        }
        if (taskTitle) {
          taskTitle.classList.add('is-scratched');
        }
        if (scratchCue) {
          scratchCue.textContent = '✓ DONE';
          scratchCue.style.opacity = '1';
        }

        session.completed = true;

        // 2. Hold crossed-out task visible for ~1 second (1000ms)
        setTimeout(() => {
          const slipEl = document.getElementById('hero-task-slip');
          if (slipEl) {
            const slipRect = slipEl.getBoundingClientRect();
            flySeedsToWorld(slipRect.left + 100, slipRect.top + 40);
          }

          // Unlock next hand-drawn sketch fragment
          unlockNextIllustrationFragment();

          AppState.completedSlips.unshift({
            title: session.title,
            projectTitle: project.title,
            durationMin: session.durationMin,
            completedAt: 'Just now'
          });

          renderCompletedShelf();
          renderCalendarDesk();
          renderMainHero();
          if (AppState.isDrawerOpen) renderDrawerContent();
        }, 1000);
      }
    });
  });
}

// Render Completed Shelf
function renderCompletedShelf() {
  const tray = document.getElementById('completed-today-tray');
  const rack = document.getElementById('scratched-slips-rack');
  if (!tray || !rack) return;

  if (AppState.completedSlips.length === 0) {
    tray.style.display = 'none';
    return;
  }

  tray.style.display = 'block';
  rack.innerHTML = '';

  AppState.completedSlips.forEach(slip => {
    const item = document.createElement('div');
    item.className = 'scratched-slip-item';
    item.innerHTML = `
      <span class="scratched-slip-text">${slip.title}</span>
      <span class="scratched-slip-tag">${slip.durationMin}m session complete ✓</span>
    `;
    rack.appendChild(item);
  });
}

// ============================================================================
// 5. FLYING PIECES (SEEDS TRAVEL TO WORLD ANCHOR)
// ============================================================================
function flySeedsToWorld(startX, startY) {
  const worldWidget = document.getElementById('btn-open-world');
  if (!worldWidget) return;
  const targetRect = worldWidget.getBoundingClientRect();
  const endX = targetRect.left + targetRect.width / 2;
  const endY = targetRect.top + targetRect.height / 2;

  const icons = ['🌱', '🌸', '✨'];
  icons.forEach((icon, idx) => {
    const seed = document.createElement('div');
    seed.className = 'floating-world-seed';
    seed.textContent = icon;
    seed.style.left = `${startX + idx * 24}px`;
    seed.style.top = `${startY}px`;
    seed.style.opacity = '1';
    seed.style.transform = 'scale(0.8)';
    document.body.appendChild(seed);

    setTimeout(() => {
      seed.style.left = `${endX}px`;
      seed.style.top = `${endY}px`;
      seed.style.transform = 'scale(1.4) rotate(20deg)';
      seed.style.opacity = '0.9';
    }, 50 + idx * 80);

    setTimeout(() => {
      seed.remove();
      if (idx === icons.length - 1) {
        // World anchor receives it
        worldWidget.classList.add('receiving-sparkle');
        audio.playChime();
        setTimeout(() => worldWidget.classList.remove('receiving-sparkle'), 650);

        // Add a new entity to world
        growWorldFromSession();
      }
    }, 950 + idx * 80);
  });
}

function growWorldFromSession() {
  const newOptions = [
    { icon: '🌸', label: 'Wildflower Patch' },
    { icon: '🌳', label: 'Sapling Oak' },
    { icon: '🪨', label: 'River Stone' },
    { icon: '🍄', label: 'Forest Mushroom' },
    { icon: '🦆', label: 'Pond Duck' }
  ];
  const chosen = newOptions[Math.floor(Math.random() * newOptions.length)];

  const x = Math.floor(30 + Math.random() * 40);
  const y = Math.floor(45 + Math.random() * 25);

  AppState.world.placedEntities.push({
    id: `e-${Date.now()}`,
    icon: chosen.icon,
    label: chosen.label,
    x, y
  });

  const dioramaCount = document.getElementById('diorama-piece-count');
  if (dioramaCount) {
    dioramaCount.textContent = `${AppState.world.placedEntities.length} pieces grown →`;
  }
}

// ============================================================================
// 6. PROGRESSIVE DISCLOSURE: PROJECT DETAILS DRAWER
// ============================================================================
function initProgressiveDrawer() {
  const revealBtn = document.getElementById('btn-reveal-project');
  const drawer = document.getElementById('project-drawer');
  const closeBtn = document.getElementById('btn-close-drawer');

  if (revealBtn && drawer) {
    revealBtn.addEventListener('click', () => {
      AppState.isDrawerOpen = !AppState.isDrawerOpen;
      drawer.style.display = AppState.isDrawerOpen ? 'block' : 'none';
      if (AppState.isDrawerOpen) renderDrawerContent();
      audio.playTap(480);
    });
  }

  if (closeBtn && drawer) {
    closeBtn.addEventListener('click', () => {
      AppState.isDrawerOpen = false;
      drawer.style.display = 'none';
      audio.playTap(440);
    });
  }
}

function renderDrawerContent() {
  const project = getActiveProject();
  if (!project) return;

  const titleEl = document.getElementById('drawer-project-title');
  if (titleEl) titleEl.textContent = project.title.toUpperCase();

  const metaEl = document.getElementById('drawer-project-meta-text');
  if (metaEl) metaEl.textContent = `Estimated: ${project.totalSessions} × 30 min · Due ${project.deadlineText}`;

  const deadlineLabel = document.getElementById('drawer-deadline-label');
  if (deadlineLabel) deadlineLabel.textContent = project.deadlineText.toUpperCase();

  const remaining = project.sessions.filter(s => !s.completed).length;
  const remEl = document.getElementById('drawer-remaining-sessions');
  if (remEl) remEl.textContent = `${remaining} sessions left`;

  const trackBar = document.getElementById('drawer-track-bar');
  if (!trackBar) return;
  trackBar.innerHTML = '<div class="drawer-rail"></div>';

  project.sessions.forEach((sess, idx) => {
    const node = document.createElement('div');
    node.className = 'drawer-node';
    node.title = `${sess.durationMin}m · ${sess.title}`;

    const circle = document.createElement('div');
    circle.className = `drawer-dot-circle ${sess.completed ? 'completed' : ''}`;
    circle.innerHTML = sess.completed ? '✓' : (idx + 1);

    node.appendChild(circle);
    node.addEventListener('click', () => {
      launchFocusMode(sess);
      audio.playTap(520);
    });
    trackBar.appendChild(node);
  });

  const dlNode = document.createElement('div');
  dlNode.className = 'drawer-node';
  const diamond = document.createElement('div');
  diamond.className = 'drawer-diamond';
  diamond.innerHTML = '◆';
  dlNode.appendChild(diamond);
  trackBar.appendChild(dlNode);
}

// ============================================================================
// 7. THE CALENDAR DESK (WITH ACCUMULATED SCRATCHES)
// ============================================================================
function renderProjectFilterPills() {
  const container = document.getElementById('quiet-project-filter');
  if (!container) return;
  container.innerHTML = '';

  AppState.projects.forEach(proj => {
    const pill = document.createElement('button');
    pill.className = `filter-pill ${proj.id === AppState.activeProjectId ? 'active' : ''}`;
    pill.textContent = proj.title;
    pill.addEventListener('click', () => {
      AppState.activeProjectId = proj.id;
      renderProjectFilterPills();
      renderMainHero();
      renderCalendarDesk();
      if (AppState.isDrawerOpen) renderDrawerContent();
      audio.playTap(460);
    });
    container.appendChild(pill);
  });
}

function renderCalendarDesk() {
  const board = document.getElementById('calendar-wall-desk');
  if (!board) return;
  board.innerHTML = '';

  const activeProj = getActiveProject();

  AppState.days.forEach(day => {
    const col = document.createElement('div');
    col.className = `desk-col ${day.isToday ? 'is-today' : ''}`;
    col.dataset.day = day.dayCode;

    // Drag-and-drop
    col.addEventListener('dragover', (e) => {
      e.preventDefault();
      col.classList.add('drag-over');
    });

    col.addEventListener('dragleave', () => {
      col.classList.remove('drag-over');
    });

    col.addEventListener('drop', (e) => {
      e.preventDefault();
      col.classList.remove('drag-over');
      const sessionId = e.dataTransfer.getData('text/plain');
      if (sessionId) {
        moveSessionToDay(sessionId, day.dayCode);
        audio.playTap(440);
      }
    });

    // Header
    const header = document.createElement('div');
    header.className = 'col-header';
    header.innerHTML = `
      <span class="col-day-name">${day.dayCode}</span>
      <span class="col-date-num">${day.dateNumber}</span>
    `;
    col.appendChild(header);

    // Sessions space
    const space = document.createElement('div');
    space.className = 'col-sessions-space';

    AppState.projects.forEach(proj => {
      const isCur = proj.id === activeProj.id;
      const daySessions = proj.sessions.filter(s => s.day === day.dayCode);

      daySessions.forEach(sess => {
        const pill = document.createElement('div');
        pill.className = `work-piece-pill ${sess.completed ? 'completed' : ''} ${!isCur ? 'other-proj' : ''}`;
        pill.draggable = true;
        pill.title = `${sess.durationMin}m · ${sess.title} (${proj.title})`;

        pill.innerHTML = `
          <div class="piece-dot ${sess.completed ? 'scratched' : ''}">${sess.completed ? '✓' : '●'}</div>
          <span class="piece-title-text">${sess.title}</span>
        `;

        pill.addEventListener('dragstart', (e) => {
          e.dataTransfer.setData('text/plain', sess.id);
          pill.classList.add('dragging');
        });

        pill.addEventListener('dragend', () => {
          pill.classList.remove('dragging');
        });

        pill.addEventListener('click', (e) => {
          e.stopPropagation();
          showPiecePopover(sess, proj, pill);
          audio.playTap(480);
        });

        space.appendChild(pill);
      });
    });

    if (activeProj && activeProj.deadlineDay === day.dayCode) {
      const dl = document.createElement('div');
      dl.className = 'col-deadline-badge';
      dl.innerHTML = `<span class="diamond">◆</span> <span>Due ${activeProj.deadlineText}</span>`;
      space.appendChild(dl);
    }

    col.appendChild(space);
    board.appendChild(col);
  });
}

function moveSessionToDay(sessionId, targetDay) {
  for (const proj of AppState.projects) {
    const found = proj.sessions.find(s => s.id === sessionId);
    if (found) {
      found.day = targetDay;
      found.isToday = (targetDay === 'MON');
      break;
    }
  }
  renderCalendarDesk();
  renderMainHero();
  if (AppState.isDrawerOpen) renderDrawerContent();
}

function showPiecePopover(session, project, anchorElement) {
  const popover = document.getElementById('piece-popover');
  if (!popover) return;

  const durEl = document.getElementById('popover-duration');
  const taskEl = document.getElementById('popover-task');
  const projEl = document.getElementById('popover-project');
  const btnGo = document.getElementById('btn-popover-go');
  const btnScratch = document.getElementById('btn-popover-scratch');
  const btnHide = document.getElementById('btn-popover-hide');

  if (durEl) durEl.textContent = `${session.durationMin} MINUTE SESSION`;
  if (taskEl) taskEl.textContent = session.title;
  if (projEl) projEl.textContent = project.title;

  const rect = anchorElement.getBoundingClientRect();
  popover.style.display = 'block';
  popover.style.top = `${rect.bottom + window.scrollY + 8}px`;
  popover.style.left = `${Math.min(window.innerWidth - 260, Math.max(10, rect.left + window.scrollX - 20))}px`;

  btnGo.onclick = () => {
    popover.style.display = 'none';
    launchFocusMode(session);
    audio.playTap(520);
  };

  btnScratch.onclick = () => {
    popover.style.display = 'none';
    triggerScratchSequenceModal(session, project);
  };

  btnHide.onclick = () => {
    popover.style.display = 'none';
  };
}

document.addEventListener('click', (e) => {
  const popover = document.getElementById('piece-popover');
  if (popover && !popover.contains(e.target) && !e.target.closest('.work-piece-pill')) {
    popover.style.display = 'none';
  }
});

// ============================================================================
// 8. FOCUS TIMER MODE & SIGNATURE SCRATCH OVERLAY SEQUENCE
// ============================================================================
function launchFocusMode(session) {
  AppState.focusTimer.activeSessionId = session.id;
  AppState.focusTimer.durationMins = session.durationMin || 30;
  AppState.focusTimer.totalSeconds = AppState.focusTimer.durationMins * 60;
  AppState.focusTimer.remainingSeconds = AppState.focusTimer.totalSeconds;

  const clockTitle = document.getElementById('focus-clock-task-name');
  if (clockTitle) clockTitle.textContent = session.title;

  updateClockDisplay();
  startFocusClock();

  const screen = document.getElementById('focus-timer-screen');
  if (screen) screen.style.display = 'flex';
}

function initFocusTimerFlow() {
  const btnExit = document.getElementById('btn-exit-focus');
  if (btnExit) {
    btnExit.addEventListener('click', () => {
      closeFocusMode();
      audio.playTap(440);
    });
  }

  const btnToggle = document.getElementById('btn-clock-toggle');
  if (btnToggle) {
    btnToggle.addEventListener('click', () => {
      toggleClock();
      audio.playTap(450);
    });
  }

  // "Scratch it off & finish ✏️"
  const btnComplete = document.getElementById('btn-clock-complete');
  if (btnComplete) {
    btnComplete.addEventListener('click', () => {
      closeFocusMode();
      triggerScratchSequenceModal();
    });
  }

  const btnBreak = document.getElementById('btn-clock-break');
  if (btnBreak) {
    btnBreak.addEventListener('click', () => {
      openBreakPrompt();
      audio.playTap(460);
    });
  }
}

function startFocusClock() {
  if (AppState.focusTimer.intervalId) clearInterval(AppState.focusTimer.intervalId);
  AppState.focusTimer.isRunning = true;
  updateClockControls();

  AppState.focusTimer.intervalId = setInterval(() => {
    if (AppState.focusTimer.remainingSeconds > 0) {
      AppState.focusTimer.remainingSeconds--;
      updateClockDisplay();
    } else {
      clearInterval(AppState.focusTimer.intervalId);
      closeFocusMode();
      triggerScratchSequenceModal();
    }
  }, 1000);
}

function toggleClock() {
  if (AppState.focusTimer.isRunning) {
    clearInterval(AppState.focusTimer.intervalId);
    AppState.focusTimer.isRunning = false;
  } else {
    startFocusClock();
  }
  updateClockControls();
}

function updateClockControls() {
  const icon = document.getElementById('clock-toggle-icon');
  const text = document.getElementById('clock-toggle-text');
  if (icon && text) {
    icon.textContent = AppState.focusTimer.isRunning ? '⏸️' : '▶️';
    text.textContent = AppState.focusTimer.isRunning ? 'Pause' : 'Resume';
  }
}

function updateClockDisplay() {
  const numEl = document.getElementById('focus-clock-number');
  const fillEl = document.getElementById('focus-progress-fill');
  const secs = AppState.focusTimer.remainingSeconds;
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  const str = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;

  if (numEl) numEl.textContent = str;

  if (fillEl && AppState.focusTimer.totalSeconds > 0) {
    const elapsed = AppState.focusTimer.totalSeconds - secs;
    const pct = Math.min(100, (elapsed / AppState.focusTimer.totalSeconds) * 100);
    fillEl.style.width = `${pct}%`;
  }
}

function closeFocusMode() {
  if (AppState.focusTimer.intervalId) clearInterval(AppState.focusTimer.intervalId);
  AppState.focusTimer.isRunning = false;
  const screen = document.getElementById('focus-timer-screen');
  if (screen) screen.style.display = 'none';
}

// Sequence Modal: User-Controlled Interactive Scratch Gesture
let modalScratcher = null;

function triggerScratchSequenceModal(targetSession = null, targetProject = null) {
  const modal = document.getElementById('scratch-moment-overlay');
  const project = targetProject || getActiveProject();
  const session = targetSession
               || project.sessions.find(s => s.id === AppState.focusTimer.activeSessionId)
               || project.sessions.find(s => s.isToday && !s.completed)
               || project.sessions.find(s => !s.completed)
               || project.sessions[0];

  const slipBox = document.getElementById('seq-slip-box');
  const slipProj = document.getElementById('seq-slip-project');
  const slipTitle = document.getElementById('seq-slip-title');
  const doneTag = document.getElementById('seq-done-tag');
  const guidanceCue = document.getElementById('scratch-guidance-cue');
  const piecesContainer = document.getElementById('seq-emerging-pieces');
  const actionsRow = document.getElementById('seq-actions-row');
  const canvas = document.getElementById('modal-freehand-canvas');

  // Reset modal state: Clean paper slip waiting for USER to scratch
  if (slipBox) {
    slipBox.textContent = '□';
    slipBox.classList.remove('checked');
  }
  if (slipProj) slipProj.textContent = project.title.toUpperCase();
  if (slipTitle) {
    slipTitle.textContent = session.title;
    slipTitle.classList.remove('crossed-out');
  }
  if (doneTag) doneTag.style.display = 'none';
  if (guidanceCue) {
    guidanceCue.style.opacity = '1';
    guidanceCue.style.display = 'flex';
  }
  if (piecesContainer) piecesContainer.innerHTML = '';
  if (actionsRow) actionsRow.style.display = 'none';

  modal.style.display = 'flex';

  requestAnimationFrame(() => {
    if (modalScratcher) {
      modalScratcher.destroy();
      modalScratcher = null;
    }

    modalScratcher = new FreehandScratcher({
      canvas: canvas,
      textElement: slipTitle,
      slipElement: document.getElementById('sequence-slip'),
      onProgress: (ratio) => {
        if (ratio > 0.08 && guidanceCue) {
          guidanceCue.style.opacity = '0.5';
        }
      },
      onComplete: () => {
        // 1. Recognize the task as scratched off
        if (slipBox) {
          slipBox.textContent = '✓';
          slipBox.classList.add('checked');
        }
        if (doneTag) {
          doneTag.style.display = 'inline-block';
        }
        if (slipTitle) {
          slipTitle.classList.add('crossed-out');
        }
        if (guidanceCue) {
          guidanceCue.style.opacity = '0';
        }

        session.completed = true;

        // 2. Hold crossed-out task visible for ~1 second (1000ms)
        setTimeout(() => {
          // 3. Emerging world pieces appear & unlock
          if (piecesContainer) {
            piecesContainer.innerHTML = '<span>🎨</span> <span>✨</span> <span>🌿</span>';
          }

          // 4. Flying seeds float to the world anchor
          const cardRect = document.getElementById('scratch-sequence-card').getBoundingClientRect();
          flySeedsToWorld(cardRect.left + cardRect.width / 2 - 20, cardRect.top + 140);

          // Unlock next hand-drawn sketch fragment
          unlockNextIllustrationFragment();

          // 5. Update state
          AppState.completedSlips.unshift({
            title: session.title,
            projectTitle: project.title,
            durationMin: session.durationMin,
            completedAt: 'Just now'
          });

          renderCompletedShelf();
          renderCalendarDesk();
          renderMainHero();
          if (AppState.isDrawerOpen) renderDrawerContent();

          // 6. Reveal Post-Scratch Options
          if (actionsRow) {
            actionsRow.style.display = 'flex';
          }

          // Gentle auto-slide back to desk if left untouched
          const autoCloseTimeout = setTimeout(() => {
            if (modal.style.display === 'flex') {
              modal.style.display = 'none';
            }
          }, 3200);

          const btnWorld = document.getElementById('btn-seq-open-world');
          const btnDesk = document.getElementById('btn-seq-back-desk');
          if (btnWorld) {
            btnWorld.onclick = () => {
              clearTimeout(autoCloseTimeout);
              modal.style.display = 'none';
              openLivingWorld();
              audio.playTap(520);
            };
          }
          if (btnDesk) {
            btnDesk.onclick = () => {
              clearTimeout(autoCloseTimeout);
              modal.style.display = 'none';
              audio.playTap(440);
            };
          }
        }, 1000);
      }
    });
  });
}

// ============================================================================
// 9. THE LIVING HAND-DRAWN ILLUSTRATION PUZZLE (VISUAL CONTINUITY)
// ============================================================================

function initLivingWorldScreen() {
  const btnOpen = document.getElementById('btn-open-world');
  const btnBack = document.getElementById('btn-back-to-desk');
  const screen = document.getElementById('world-play-screen');
  const dioramaCount = document.getElementById('diorama-piece-count');

  if (btnOpen) {
    btnOpen.addEventListener('click', () => {
      openLivingWorld();
      audio.playTap(500);
    });
  }

  if (dioramaCount) {
    dioramaCount.addEventListener('click', () => {
      openLivingWorld();
      audio.playTap(500);
    });
  }

  if (btnBack && screen) {
    btnBack.addEventListener('click', () => {
      screen.style.display = 'none';
      audio.playTap(440);
    });
  }

  const btnBrandHome = document.getElementById('btn-brand-home');
  if (btnBrandHome && screen) {
    btnBrandHome.addEventListener('click', () => {
      screen.style.display = 'none';
      audio.playTap(440);
    });
  }

  // Play sub-tabs
  const tabs = document.querySelectorAll('.play-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const sub = tab.dataset.sub;
      document.querySelectorAll('.play-pane').forEach(p => p.classList.remove('active'));
      const target = document.getElementById(`pane-${sub}`);
      if (target) target.classList.add('active');
      audio.playTap(460);
    });
  });

  // Time of Day
  const tods = document.querySelectorAll('.btn-tod');
  tods.forEach(btn => {
    btn.addEventListener('click', () => {
      tods.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      setBoardTheme(btn.dataset.time);
      audio.playTap(480);
    });
  });

  // Timed Break Modal Trigger
  const btnBreakTrigger = document.getElementById('btn-trigger-break-modal');
  if (btnBreakTrigger) {
    btnBreakTrigger.addEventListener('click', () => {
      openBreakPrompt();
      audio.playTap(460);
    });
  }

  // Discover Next Fragment (for user testing / on-demand exploration)
  const btnUnlockTest = document.getElementById('btn-unlock-test-frag');
  if (btnUnlockTest) {
    btnUnlockTest.addEventListener('click', () => {
      unlockNextIllustrationFragment(true);
    });
  }

  renderIllustrationWorkspace();
}

function openLivingWorld() {
  const screen = document.getElementById('world-play-screen');
  if (screen) {
    screen.style.display = 'block';
    renderIllustrationWorkspace();
  }
}

function setBoardTheme(theme) {
  AppState.world.theme = theme;
  const board = document.getElementById('illustration-drawing-board');
  if (!board) return;
  board.classList.remove('theme-day', 'theme-sunset', 'theme-night');
  board.classList.add(`theme-${theme}`);
}

function updateWorldTrackerCounters() {
  const frags = AppState.world.fragments || [];
  const placed = frags.filter(f => f.isPlaced).length;
  const total = frags.length;

  const fragCountEl = document.getElementById('frag-tracker-count');
  if (fragCountEl) {
    fragCountEl.textContent = `${placed} / ${total}`;
  }

  const dioramaCount = document.getElementById('diorama-piece-count');
  if (dioramaCount) {
    dioramaCount.textContent = `${placed} / ${total} assembled 🎨 →`;
  }
}

function renderIllustrationWorkspace() {
  updateWorldTrackerCounters();
  renderPlacedFragments();
  renderSketchbookTray();
}

function renderPlacedFragments() {
  const layer = document.getElementById('placed-fragments-layer');
  if (!layer) return;
  layer.innerHTML = '';

  const placedFrags = AppState.world.fragments.filter(f => f.isPlaced);

  placedFrags.forEach(frag => {
    const el = document.createElement('div');
    el.className = 'placed-fragment';
    el.id = `placed-${frag.id}`;
    el.style.left = `${frag.targetX}px`;
    el.style.top = `${frag.targetY}px`;
    el.style.width = `${frag.width}px`;
    el.style.height = `${frag.height}px`;
    el.innerHTML = getFragmentSVG(frag);

    // Subtle tactile tap response
    el.addEventListener('click', () => {
      audio.playTap(520);
      el.style.transform = 'scale(1.02)';
      setTimeout(() => el.style.transform = '', 180);
    });

    layer.appendChild(el);
  });
}

function renderSketchbookTray() {
  const rack = document.getElementById('tray-fragments-rack');
  if (!rack) return;
  rack.innerHTML = '';

  const unplacedFrags = AppState.world.fragments.filter(f => f.isUnlocked && !f.isPlaced);
  const totalPlaced = AppState.world.fragments.filter(f => f.isPlaced).length;
  const totalFrags = AppState.world.fragments.length;

  if (totalPlaced === totalFrags) {
    rack.innerHTML = `
      <div class="tray-all-placed-notice">
        <span>✨ The Valley of the Watermill is whole! All hand-drawn fragments are seamlessly connected.</span>
      </div>
    `;
    return;
  }

  if (unplacedFrags.length === 0) {
    rack.innerHTML = `
      <div class="tray-all-placed-notice" style="color: var(--ink-secondary);">
        <span>Scratch off your next work session on the desk to discover more sketch fragments! 🌿</span>
      </div>
    `;
    return;
  }

  unplacedFrags.forEach(frag => {
    const card = document.createElement('div');
    card.className = 'sketch-fragment-card';
    card.id = `tray-card-${frag.id}`;
    card.setAttribute('draggable', 'false');

    card.innerHTML = `
      <div class="frag-card-thumb-wrap">
        ${getFragmentSVG(frag, true)}
      </div>
      <div class="frag-card-info">
        <h4 class="frag-card-title">${frag.name}</h4>
        <span class="frag-card-clue">${frag.subtitle}</span>
        <span class="frag-card-drag-cue">↖ Pick up & drag onto drawing board</span>
      </div>
    `;

    // Initialize physical drag controller
    card.addEventListener('pointerdown', (e) => {
      initFragmentDragController(e, frag);
    });

    rack.appendChild(card);
  });
}

// ----------------------------------------------------------------------------
// DRAG CONTROLLER WITH SUBTLE MAGNETIC ATTRACTION & SATISFYING CLICK SNAP
// ----------------------------------------------------------------------------
function initFragmentDragController(initialEvent, fragment) {
  initialEvent.preventDefault();
  audio.init();
  audio.playTap(480);

  const board = document.getElementById('illustration-drawing-board');
  const dragLayer = document.getElementById('active-drag-layer');
  const snapHint = document.getElementById('magnetic-snap-hint');
  if (!board || !dragLayer) return;

  const boardRect = board.getBoundingClientRect();

  // Create floating drag node
  const dragNode = document.createElement('div');
  dragNode.className = 'dragging-fragment-node';
  dragNode.style.width = `${fragment.width}px`;
  dragNode.style.height = `${fragment.height}px`;
  dragNode.innerHTML = getFragmentSVG(fragment);
  dragLayer.appendChild(dragNode);

  // Position snap hint aura at the fragment's intended target
  if (snapHint) {
    snapHint.style.left = `${fragment.targetX}px`;
    snapHint.style.top = `${fragment.targetY}px`;
    snapHint.style.width = `${fragment.width}px`;
    snapHint.style.height = `${fragment.height}px`;
    snapHint.classList.remove('active');
  }

  const grabOffsetX = fragment.width / 2;
  const grabOffsetY = fragment.height / 2;

  let isMagneticActive = false;
  let lastDist = Infinity;

  function updateDragPosition(e) {
    const bRect = board.getBoundingClientRect();
    const pointerX = e.clientX - bRect.left;
    const pointerY = e.clientY - bRect.top;

    const rawX = pointerX - grabOffsetX;
    const rawY = pointerY - grabOffsetY;

    // Euclidean distance to intended continuous alignment
    const dist = Math.hypot(rawX - fragment.targetX, rawY - fragment.targetY);
    lastDist = dist;

    // Proximity threshold for magnetic attraction (80px)
    if (dist < 80) {
      if (!isMagneticActive) {
        isMagneticActive = true;
        dragNode.classList.add('is-magnetic');
        if (snapHint) snapHint.classList.add('active');
        audio.playMagneticGlide();
      }

      // Gentle magnetic interpolation toward alignment
      const pullFactor = Math.min(0.68, ((80 - dist) / 80) * 0.76);
      const renderX = rawX + (fragment.targetX - rawX) * pullFactor;
      const renderY = rawY + (fragment.targetY - rawY) * pullFactor;

      dragNode.style.transform = `translate(${renderX}px, ${renderY}px)`;
    } else {
      if (isMagneticActive) {
        isMagneticActive = false;
        dragNode.classList.remove('is-magnetic');
        if (snapHint) snapHint.classList.remove('active');
      }
      dragNode.style.transform = `translate(${rawX}px, ${rawY}px)`;
    }
  }

  updateDragPosition(initialEvent);

  function onPointerMove(e) {
    e.preventDefault();
    updateDragPosition(e);
  }

  function onPointerUp(e) {
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('pointercancel', onPointerUp);

    if (snapHint) snapHint.classList.remove('active');

    // Snap threshold: if within 58px of alignment on release
    if (lastDist < 58) {
      // 1. Mark fragment as placed
      fragment.isPlaced = true;

      // 2. Tactile click audio
      audio.playSnapClick();

      // 3. Remove dragging node
      dragNode.remove();

      // 4. Re-render placed layers & tray
      renderIllustrationWorkspace();

      // 5. Add snap bloom animation to newly placed fragment
      const placedEl = document.getElementById(`placed-${fragment.id}`);
      if (placedEl) {
        placedEl.classList.add('just-snapped');
        setTimeout(() => placedEl.classList.remove('just-snapped'), 700);
      }

      // 6. Show continuous visual connection celebration toast
      showSnapCelebrationToast(fragment.feedback);

    } else {
      // Failed to align - piece floats smoothly back
      dragNode.style.transition = 'transform 0.25s ease, opacity 0.25s ease';
      dragNode.style.opacity = '0';
      audio.playTap(340);
      setTimeout(() => {
        dragNode.remove();
      }, 250);
    }
  }

  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', onPointerUp);
}

function showSnapCelebrationToast(message) {
  const toast = document.getElementById('snap-celebration-toast');
  const msgEl = document.getElementById('snap-toast-msg');
  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  toast.style.display = 'flex';

  if (window._snapToastTimer) clearTimeout(window._snapToastTimer);
  window._snapToastTimer = setTimeout(() => {
    toast.style.display = 'none';
  }, 2800);
}

function unlockNextIllustrationFragment(isManual = false) {
  const lockedFrag = AppState.world.fragments.find(f => !f.isUnlocked);
  if (lockedFrag) {
    lockedFrag.isUnlocked = true;
    audio.playDopamineChime();
    renderIllustrationWorkspace();
    showSnapCelebrationToast(`Discovered new sketch fragment: ${lockedFrag.name}! 🎨`);
    return lockedFrag;
  } else {
    if (isManual) {
      showSnapCelebrationToast('All sketch fragments have already been discovered! 🌿');
    }
    return null;
  }
}

// ----------------------------------------------------------------------------
// HAND-DRAWN SVG GENERATORS FOR THE 6 INTERCONNECTED SECTORS
// Visual Continuity: Roads, Bridges, Rooflines, Rivers, Pipes, Vines, & Boughs
// ----------------------------------------------------------------------------
function getFragmentSVG(frag, isThumbnail = false) {
  switch (frag.id) {
    case 'frag-1':
      return renderSector1SVG(frag, isThumbnail);
    case 'frag-2':
      return renderSector2SVG(frag, isThumbnail);
    case 'frag-3':
      return renderSector3SVG(frag, isThumbnail);
    case 'frag-4':
      return renderSector4SVG(frag, isThumbnail);
    case 'frag-5':
      return renderSector5SVG(frag, isThumbnail);
    case 'frag-6':
      return renderSector6SVG(frag, isThumbnail);
    default:
      return '';
  }
}

// Sector 1: Watermill Cottage & Hearth (Anchor)
function renderSector1SVG(frag, isThumb) {
  return `
    <svg viewBox="0 0 270 240" xmlns="http://www.w3.org/2000/svg" style="width:100%; height:100%; overflow:visible;">
      <!-- Organic Paper Deckle Background Wash -->
      <path d="M 8 12 Q 130 6 262 14 Q 266 120 264 228 Q 135 234 10 226 Q 6 120 8 12 Z" 
            fill="#FAF6EE" stroke="#E2DACB" stroke-width="1.2" stroke-dasharray="3,2" />

      <!-- Meadow Grass Washes -->
      <path d="M 12 18 Q 135 25 258 20 L 260 220 Q 140 228 14 220 Z" fill="#F0EDE1" opacity="0.6" />

      <!-- Left Edge: Branch Stubs reaching from Ancient Oak (Seam to Sector 5) -->
      <path d="M 0 75 Q 35 78 55 86" stroke="#4A3828" stroke-width="4.5" stroke-linecap="round" fill="none" />
      <path d="M 0 75 Q 35 78 55 86" stroke="#69513B" stroke-width="2.5" stroke-linecap="round" fill="none" />
      <path d="M 0 120 Q 25 125 45 130" stroke="#4A3828" stroke-width="3.5" stroke-linecap="round" fill="none" />
      <!-- Leaf Clusters along Oak Stub -->
      <path d="M 10 70 Q 25 60 40 72 Q 25 80 10 70 Z" fill="#758B62" stroke="#3D4B33" stroke-width="1.2" />
      <path d="M 2 115 Q 18 105 30 118 Q 15 128 2 115 Z" fill="#88A072" stroke="#3D4B33" stroke-width="1.2" />

      <!-- Bottom Edge: Cart Road & Dry-Stone Wall (Seam to Sector 4) -->
      <path d="M 85 160 Q 95 195 105 240" stroke="#C8B89E" stroke-width="14" stroke-linecap="round" fill="none" opacity="0.6" />
      <path d="M 115 160 Q 125 195 135 240" stroke="#C8B89E" stroke-width="14" stroke-linecap="round" fill="none" opacity="0.6" />
      <!-- Cart Wheel Ruts in Dirt Trail -->
      <path d="M 90 165 C 95 190 102 215 106 240" stroke="#8A765D" stroke-width="1.8" stroke-dasharray="6,4" fill="none" />
      <path d="M 120 165 C 125 190 132 215 136 240" stroke="#8A765D" stroke-width="1.8" stroke-dasharray="6,4" fill="none" />
      <!-- Dry Stone Wall Exiting South -->
      <path d="M 148 175 Q 152 210 156 240" stroke="#4E443B" stroke-width="3" stroke-linecap="round" fill="none" />
      <circle cx="150" cy="190" r="4" fill="#9C9283" stroke="#4E443B" stroke-width="1" />
      <circle cx="153" cy="215" r="4.5" fill="#887E71" stroke="#4E443B" stroke-width="1" />
      <circle cx="155" cy="235" r="4" fill="#AAA192" stroke="#4E443B" stroke-width="1" />

      <!-- Millstream River Flowing East (Seam to Sector 2) -->
      <path d="M 195 140 C 220 142 245 141 270 142 L 270 190 C 245 192 220 190 195 188 Z" fill="#8EB7C7" opacity="0.75" />
      <!-- Water ripple ink lines -->
      <path d="M 205 152 C 225 150 245 153 268 151" stroke="#567E8F" stroke-width="1.4" fill="none" />
      <path d="M 215 165 C 235 163 252 166 270 164" stroke="#FFF" stroke-width="1.2" stroke-linecap="round" fill="none" opacity="0.9" />
      <path d="M 208 178 C 228 177 248 180 270 178" stroke="#567E8F" stroke-width="1.4" fill="none" />

      <!-- Right Edge: Bridge Footings & Railings (Seam to Sector 2) -->
      <!-- Bridge Timber Decking -->
      <path d="M 225 134 C 240 135 255 136 270 137" stroke="#684A33" stroke-width="3.5" stroke-linecap="round" fill="none" />
      <path d="M 225 122 C 240 123 255 124 270 125" stroke="#4A3423" stroke-width="2.2" stroke-linecap="round" fill="none" />
      <line x1="242" y1="123" x2="242" y2="135" stroke="#4A3423" stroke-width="1.8" />
      <line x1="262" y1="124" x2="262" y2="136" stroke="#4A3423" stroke-width="1.8" />
      <!-- Bridge Foundation Pier Stones -->
      <rect x="238" y="137" width="16" height="28" rx="2" fill="#B0A694" stroke="#4E443B" stroke-width="1.5" />

      <!-- The Watermill Cottage Building -->
      <!-- Stone Wall Base -->
      <path d="M 75 95 L 205 95 L 205 175 L 75 175 Z" fill="#DDD5C7" stroke="#3D3228" stroke-width="2.2" stroke-linejoin="round" />
      <!-- Random Stone Masonry Texture -->
      <rect x="85" y="110" width="14" height="8" rx="2" fill="#C2B8A4" stroke="#4A3F33" stroke-width="1" />
      <rect x="105" y="112" width="18" height="7" rx="2" fill="#CFC6B3" stroke="#4A3F33" stroke-width="1" />
      <rect x="88" y="135" width="22" height="9" rx="2" fill="#C2B8A4" stroke="#4A3F33" stroke-width="1" />
      <rect x="120" y="140" width="16" height="8" rx="2" fill="#BDB29D" stroke="#4A3F33" stroke-width="1" />
      
      <!-- Wooden Door with Arch -->
      <path d="M 100 135 L 100 175 L 122 175 L 122 135 Q 111 128 100 135 Z" fill="#6B482B" stroke="#382617" stroke-width="1.8" />
      <circle cx="118" cy="155" r="1.5" fill="#DDB258" />

      <!-- Glowing Window with Panes -->
      <rect x="145" y="115" width="24" height="26" rx="2" fill="#FCE5A4" stroke="#382617" stroke-width="1.8" />
      <line x1="157" y1="115" x2="157" y2="141" stroke="#382617" stroke-width="1.4" />
      <line x1="145" y1="128" x2="169" y2="128" stroke="#382617" stroke-width="1.4" />
      <path d="M 141 113 L 173 113" stroke="#5E4029" stroke-width="2.5" stroke-linecap="round" />

      <!-- The Mill Water Wheel -->
      <circle cx="205" cy="148" r="26" fill="none" stroke="#5E4029" stroke-width="3" />
      <circle cx="205" cy="148" r="5" fill="#3D2919" />
      <line x1="180" y1="148" x2="230" y2="148" stroke="#5E4029" stroke-width="2" />
      <line x1="205" y1="123" x2="205" y2="173" stroke="#5E4029" stroke-width="2" />
      <line x1="187" y1="130" x2="223" y2="166" stroke="#5E4029" stroke-width="2" />
      <line x1="187" y1="166" x2="223" y2="130" stroke="#5E4029" stroke-width="2" />

      <!-- Terracotta Tiled Cottage Roof -->
      <!-- Main Roof Triangle/Hip -->
      <path d="M 60 98 L 140 35 L 220 98 Z" fill="#D36B46" stroke="#3D2B1F" stroke-width="2.4" stroke-linejoin="round" />
      <!-- Roof Tile Shingle Lines -->
      <path d="M 80 82 Q 140 45 200 82" stroke="#A84C2C" stroke-width="1.8" fill="none" />
      <path d="M 70 92 Q 140 55 210 92" stroke="#A84C2C" stroke-width="1.8" fill="none" />

      <!-- Top Edge: Roof Ridge & Chimney (Seam to Sector 3) -->
      <!-- Roof Ridge Peak continuing upward -->
      <path d="M 132 40 L 140 35 L 148 40" stroke="#3D2B1F" stroke-width="2.2" fill="none" />
      <!-- Copper Kitchen Stovepipe -->
      <path d="M 166 45 L 166 18 Q 170 12 176 16 L 176 53" fill="#C47A46" stroke="#3D2B1F" stroke-width="1.8" />
      <!-- Wispy Chimney Smoke curling North -->
      <path d="M 172 12 Q 175 4 170 0" stroke="#A99E91" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.6" />
      <!-- Purple Wisteria Vines Climbing Left Roof Pitch (Seam to Sector 3) -->
      <path d="M 78 85 Q 95 55 105 30" stroke="#48633D" stroke-width="2" fill="none" />
      <circle cx="88" cy="68" r="3.5" fill="#9B72AA" />
      <circle cx="98" cy="52" r="4" fill="#B388C4" />
      <circle cx="106" cy="34" r="3.5" fill="#9B72AA" />

      <!-- Warm Lantern by the Door -->
      <line x1="90" y1="125" x2="96" y2="125" stroke="#3D2919" stroke-width="1.5" />
      <rect x="92" y="127" width="6" height="9" rx="1" fill="#FFDA73" stroke="#3D2919" stroke-width="1.2" />
    </svg>
  `;
}

// Sector 2: Arched Bridge & River Basin (Connects to Sector 1 on Left, Sector 6 on Top)
function renderSector2SVG(frag, isThumb) {
  return `
    <svg viewBox="0 0 280 230" xmlns="http://www.w3.org/2000/svg" style="width:100%; height:100%; overflow:visible;">
      <!-- Organic Paper Wash Background -->
      <path d="M 8 10 Q 140 4 272 12 Q 275 115 270 220 Q 135 228 10 222 Q 4 110 8 10 Z" 
            fill="#FAF6EE" stroke="#E2DACB" stroke-width="1.2" stroke-dasharray="3,2" />

      <!-- River Basin Body (Receives waterfall from Sector 6 above and continues from Sector 1 left) -->
      <path d="M 0 102 C 40 104 80 110 120 125 C 160 140 190 170 215 225 L 0 225 Z" fill="#7EABB9" opacity="0.75" />
      <path d="M 60 0 C 70 40 85 80 115 125" stroke="#FFF" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.8" />
      <path d="M 90 0 C 95 35 110 75 135 120" stroke="#A8D1DE" stroke-width="2.2" stroke-linecap="round" fill="none" />

      <!-- Left Seam to Sector 1: Continuing the Bridge -->
      <!-- Upper Handrail -->
      <path d="M 0 105 C 45 104 90 103 150 104" stroke="#4A3423" stroke-width="2.4" stroke-linecap="round" fill="none" />
      <!-- Lower Decking Walkway -->
      <path d="M 0 117 C 45 116 90 115 150 116" stroke="#684A33" stroke-width="3.5" stroke-linecap="round" fill="none" />
      <!-- Balusters -->
      <line x1="20" y1="105" x2="20" y2="117" stroke="#4A3423" stroke-width="1.8" />
      <line x1="45" y1="105" x2="45" y2="117" stroke="#4A3423" stroke-width="1.8" />
      <line x1="75" y1="104" x2="75" y2="116" stroke="#4A3423" stroke-width="1.8" />
      <line x1="110" y1="104" x2="110" y2="116" stroke="#4A3423" stroke-width="1.8" />
      <line x1="140" y1="104" x2="140" y2="116" stroke="#4A3423" stroke-width="1.8" />

      <!-- Majestic Stone Arch Underneath Bridge -->
      <path d="M 10 120 Q 75 112 145 155 L 140 170 Q 75 128 10 135 Z" fill="#BDB3A1" stroke="#3D3328" stroke-width="1.8" />
      <!-- Keystones in the Arch -->
      <line x1="35" y1="117" x2="33" y2="129" stroke="#3D3328" stroke-width="1.4" />
      <line x1="60" y1="114" x2="59" y2="127" stroke="#3D3328" stroke-width="1.4" />
      <line x1="88" y1="115" x2="86" y2="132" stroke="#3D3328" stroke-width="1.4" />
      <line x1="115" y1="123" x2="112" y2="142" stroke="#3D3328" stroke-width="1.4" />

      <!-- Cozy Bridge Fisherman sitting on the balustrade -->
      <ellipse cx="92" cy="98" rx="5" ry="6" fill="#88735C" stroke="#382819" stroke-width="1.4" />
      <circle cx="92" cy="90" r="4.5" fill="#E8C7A0" stroke="#382819" stroke-width="1.2" />
      <!-- Straw Hat -->
      <path d="M 83 88 Q 92 82 101 88 Z" fill="#DDB766" stroke="#382819" stroke-width="1.2" />
      <!-- Fishing Rod dangling line into river -->
      <line x1="94" y1="94" x2="128" y2="78" stroke="#5E4129" stroke-width="1.5" stroke-linecap="round" />
      <path d="M 128 78 Q 135 110 132 165" stroke="#FFF" stroke-width="1" stroke-dasharray="3,2" fill="none" opacity="0.8" />
      <!-- Red Float Bobber -->
      <circle cx="132" cy="165" r="2.5" fill="#D94E34" stroke="#FFF" stroke-width="0.8" />

      <!-- Riverbank Rocks & Water Lilies -->
      <circle cx="35" cy="180" r="9" fill="#B5AC9E" stroke="#42392E" stroke-width="1.5" />
      <circle cx="50" cy="188" r="6" fill="#A19889" stroke="#42392E" stroke-width="1.5" />
      <!-- Water Lily Pads -->
      <ellipse cx="65" cy="155" rx="8" ry="4" fill="#58855A" stroke="#2D472E" stroke-width="1" />
      <ellipse cx="80" cy="168" rx="10" ry="5" fill="#6B996D" stroke="#2D472E" stroke-width="1" />
      <circle cx="82" cy="166" r="2.5" fill="#FCE5EB" />

      <!-- Right Edge & Top Edge: Granite Mountain Cliff & Carved Steps (Seam to Sector 6) -->
      <path d="M 150 115 Q 170 120 185 105 Q 210 95 240 50 Q 255 30 270 0 L 280 0 L 280 230 L 195 230 Q 170 180 150 115 Z" 
            fill="#D3CCC0" stroke="#3B3227" stroke-width="2.2" stroke-linejoin="round" />
      <!-- Rock Crevice Hatching -->
      <path d="M 215 110 L 235 90" stroke="#7A6F60" stroke-width="1.4" />
      <path d="M 220 125 L 245 102" stroke="#7A6F60" stroke-width="1.4" />
      <path d="M 235 150 L 260 130" stroke="#7A6F60" stroke-width="1.4" />

      <!-- Stone Steps Carved into Cliff Face climbing toward mountain -->
      <path d="M 152 110 L 168 110 L 168 102 L 184 102 L 184 92 L 202 92 L 202 80 L 220 80 L 220 66 L 240 66 L 240 50" 
            stroke="#3B3227" stroke-width="2" stroke-linejoin="round" fill="none" />
      
      <!-- Mountain Pine Clinging to Cliff -->
      <path d="M 245 42 L 245 55" stroke="#483321" stroke-width="2.5" />
      <path d="M 235 48 L 245 32 L 255 48 Z" fill="#4B6344" stroke="#2C3D28" stroke-width="1.4" />
      <path d="M 238 36 L 245 22 L 252 36 Z" fill="#5A7852" stroke="#2C3D28" stroke-width="1.4" />
    </svg>
  `;
}

// Sector 3: Clocktower & Starlit Observatory (Connects to Sector 1 Below, Sector 6 Right)
function renderSector3SVG(frag, isThumb) {
  return `
    <svg viewBox="0 0 260 200" xmlns="http://www.w3.org/2000/svg" style="width:100%; height:100%; overflow:visible;">
      <!-- Organic Paper Wash Background -->
      <path d="M 8 10 Q 130 6 252 12 Q 256 100 252 192 Q 128 196 10 190 Q 6 95 8 10 Z" 
            fill="#FAF6EE" stroke="#E2DACB" stroke-width="1.2" stroke-dasharray="3,2" />

      <!-- Bottom Seam: Cottage Roofline, Stovepipe, & Wisteria Continuing down to Sector 1 -->
      <!-- Cottage Roof Peak Seam: connects at (110, 195) -->
      <path d="M 60 195 Q 110 190 160 198" stroke="#3D2B1F" stroke-width="2.5" stroke-dasharray="4,2" fill="none" />
      <!-- Copper Kitchen Stovepipe connecting from (140, 180) -->
      <path d="M 136 200 L 136 175 Q 142 165 150 170 L 150 200" fill="#C47A46" stroke="#3D2B1F" stroke-width="1.8" />
      <!-- Purple Wisteria Vines Twining Up from Sector 1 -->
      <path d="M 75 195 Q 82 170 90 145" stroke="#48633D" stroke-width="2.2" fill="none" />
      <circle cx="78" cy="180" r="4" fill="#9B72AA" />
      <circle cx="85" cy="162" r="4.5" fill="#B388C4" />
      <circle cx="92" cy="146" r="4" fill="#9B72AA" />

      <!-- The Timber-Frame Clocktower -->
      <!-- Main Tower Body -->
      <path d="M 85 75 L 165 75 L 160 185 L 90 185 Z" fill="#E6DFD1" stroke="#3B2E22" stroke-width="2.2" stroke-linejoin="round" />
      <!-- Half-timbering Tudor Cross-Beams -->
      <line x1="88" y1="130" x2="162" y2="130" stroke="#5E4029" stroke-width="2.5" />
      <line x1="88" y1="130" x2="162" y2="185" stroke="#5E4029" stroke-width="2" />
      <line x1="162" y1="130" x2="88" y2="185" stroke="#5E4029" stroke-width="2" />

      <!-- Clock Face with Roman Numerals -->
      <circle cx="125" cy="102" r="18" fill="#FFF9E8" stroke="#3B2E22" stroke-width="2" />
      <circle cx="125" cy="102" r="15" fill="none" stroke="#D1BE8E" stroke-width="1" stroke-dasharray="2,2" />
      <!-- Clock Hands pointing to 3:30 -->
      <line x1="125" y1="102" x2="134" y2="102" stroke="#3B2E22" stroke-width="2.2" stroke-linecap="round" />
      <line x1="125" y1="102" x2="125" y2="113" stroke="#3B2E22" stroke-width="1.8" stroke-linecap="round" />
      <circle cx="125" cy="102" r="2" fill="#D49E35" />

      <!-- Open Balcony with Starlit Brass Telescope -->
      <!-- Balcony Railing on Right Side -->
      <path d="M 165 110 L 205 110 L 205 130 L 165 130" fill="#755235" stroke="#3B2E22" stroke-width="1.8" />
      <line x1="175" y1="110" x2="175" y2="130" stroke="#3B2E22" stroke-width="1.4" />
      <line x1="190" y1="110" x2="190" y2="130" stroke="#3B2E22" stroke-width="1.4" />
      <line x1="202" y1="110" x2="202" y2="130" stroke="#3B2E22" stroke-width="1.4" />

      <!-- Polished Brass Astronomical Telescope -->
      <line x1="180" y1="124" x2="188" y2="104" stroke="#4A3B2C" stroke-width="2" />
      <line x1="195" y1="124" x2="188" y2="104" stroke="#4A3B2C" stroke-width="2" />
      <path d="M 174 112 L 208 92 L 213 98 L 178 118 Z" fill="#DDB550" stroke="#4A3B2C" stroke-width="1.6" />
      <circle cx="211" cy="95" r="4" fill="#C2DCEB" stroke="#4A3B2C" stroke-width="1" />

      <!-- Steep Slate Clocktower Spire / Roof -->
      <path d="M 75 76 L 125 18 L 175 76 Z" fill="#586A7A" stroke="#2B3640" stroke-width="2.4" stroke-linejoin="round" />
      <!-- Slate Shingles Lines -->
      <path d="M 90 60 L 160 60" stroke="#40505E" stroke-width="1.6" />
      <path d="M 105 44 L 145 44" stroke="#40505E" stroke-width="1.6" />

      <!-- Golden Brass Weather Vane Rooster at Peak -->
      <line x1="125" y1="18" x2="125" y2="4" stroke="#9E782A" stroke-width="2" />
      <path d="M 120 8 Q 125 2 132 7 Q 127 12 120 8 Z" fill="#E5B942" stroke="#9E782A" stroke-width="1" />

      <!-- Little Wise Owl resting on eave corbel -->
      <ellipse cx="78" cy="74" rx="4.5" ry="6" fill="#8A6E55" stroke="#3B2E22" stroke-width="1.2" />
      <circle cx="76" cy="71" r="1.5" fill="#FFE27A" />
      <circle cx="80" cy="71" r="1.5" fill="#FFE27A" />

      <!-- Delicate Evening Clouds & Starlight -->
      <path d="M 18 35 Q 40 25 60 36" stroke="#D1C8BA" stroke-width="1.8" stroke-linecap="round" fill="none" opacity="0.6" />
      <path d="M 195 25 Q 220 18 245 28" stroke="#D1C8BA" stroke-width="1.8" stroke-linecap="round" fill="none" opacity="0.6" />
      <!-- Little 4-point sparkle star -->
      <path d="M 225 38 L 227 44 L 233 46 L 227 48 L 225 54 L 223 48 L 217 46 L 223 44 Z" fill="#FCE5A4" />
    </svg>
  `;
}

// Sector 4: Cobblestone Lane & Pumpkin Patch (Connects to Sector 1 Above)
function renderSector4SVG(frag, isThumb) {
  return `
    <svg viewBox="0 0 290 190" xmlns="http://www.w3.org/2000/svg" style="width:100%; height:100%; overflow:visible;">
      <!-- Organic Paper Wash Background -->
      <path d="M 8 10 Q 145 4 282 12 Q 285 95 280 182 Q 140 188 10 180 Q 4 95 8 10 Z" 
            fill="#FAF6EE" stroke="#E2DACB" stroke-width="1.2" stroke-dasharray="3,2" />

      <!-- Warm Country Meadow Wash -->
      <path d="M 12 15 Q 145 20 276 18 L 275 175 Q 140 180 14 175 Z" fill="#EDE9DA" opacity="0.6" />

      <!-- Top Seam: Dirt Wagon Trail entering from Sector 1 (X: 110-170) -->
      <!-- Road curves gently through countryside -->
      <path d="M 110 0 C 114 40 125 90 145 190 L 195 190 C 180 90 172 40 170 0 Z" fill="#D9CBB7" opacity="0.8" />
      
      <!-- Hand-laid Cobblestones filling the lane -->
      <!-- Row 1 -->
      <ellipse cx="125" cy="25" rx="5.5" ry="3.5" fill="#C2B49F" stroke="#5E4F3E" stroke-width="1" />
      <ellipse cx="140" cy="22" rx="6.5" ry="4" fill="#B0A08B" stroke="#5E4F3E" stroke-width="1" />
      <ellipse cx="155" cy="26" rx="5" ry="3.5" fill="#C7BBA8" stroke="#5E4F3E" stroke-width="1" />
      <!-- Row 2 -->
      <ellipse cx="128" cy="50" rx="6" ry="4" fill="#B0A08B" stroke="#5E4F3E" stroke-width="1" />
      <ellipse cx="144" cy="52" rx="7" ry="4.5" fill="#C2B49F" stroke="#5E4F3E" stroke-width="1" />
      <ellipse cx="160" cy="48" rx="6" ry="4" fill="#A89883" stroke="#5E4F3E" stroke-width="1" />
      <!-- Row 3 -->
      <ellipse cx="132" cy="85" rx="7" ry="4.5" fill="#C7BBA8" stroke="#5E4F3E" stroke-width="1" />
      <ellipse cx="150" cy="88" rx="6.5" ry="4" fill="#B0A08B" stroke="#5E4F3E" stroke-width="1" />
      <ellipse cx="168" cy="84" rx="7" ry="4.5" fill="#C2B49F" stroke="#5E4F3E" stroke-width="1" />
      <!-- Row 4 -->
      <ellipse cx="140" cy="125" rx="8" ry="5" fill="#B8A893" stroke="#5E4F3E" stroke-width="1" />
      <ellipse cx="158" cy="128" rx="7" ry="4.5" fill="#C7BBA8" stroke="#5E4F3E" stroke-width="1" />
      <ellipse cx="176" cy="122" rx="8" ry="5" fill="#A89883" stroke="#5E4F3E" stroke-width="1" />
      <!-- Row 5 -->
      <ellipse cx="148" cy="165" rx="8.5" ry="5" fill="#C2B49F" stroke="#5E4F3E" stroke-width="1" />
      <ellipse cx="168" cy="168" rx="8" ry="5" fill="#B0A08B" stroke="#5E4F3E" stroke-width="1" />
      <ellipse cx="186" cy="162" rx="7.5" ry="4.5" fill="#C7BBA8" stroke="#5E4F3E" stroke-width="1" />

      <!-- Top Seam: Dry-Stone Wall continuing from Sector 1 (X: 185) -->
      <path d="M 185 0 C 188 45 195 90 205 190" stroke="#4A3F33" stroke-width="3" stroke-linecap="round" fill="none" />
      <!-- Stone Wall Boulders -->
      <ellipse cx="186" cy="15" rx="6" ry="5" fill="#AAA090" stroke="#4A3F33" stroke-width="1.2" />
      <ellipse cx="188" cy="40" rx="7" ry="6" fill="#958A7A" stroke="#4A3F33" stroke-width="1.2" />
      <ellipse cx="192" cy="72" rx="8" ry="6.5" fill="#B5AB9B" stroke="#4A3F33" stroke-width="1.2" />
      <ellipse cx="198" cy="110" rx="8" ry="6.5" fill="#958A7A" stroke="#4A3F33" stroke-width="1.2" />
      <ellipse cx="204" cy="155" rx="9" ry="7" fill="#AAA090" stroke="#4A3F33" stroke-width="1.2" />

      <!-- Curious Barn Cat sitting on stone wall -->
      <ellipse cx="190" cy="28" rx="4" ry="5.5" fill="#DE7A3E" stroke="#3D2919" stroke-width="1" />
      <circle cx="190" cy="22" r="3" fill="#DE7A3E" stroke="#3D2919" stroke-width="1" />
      <!-- Tail hanging down wall -->
      <path d="M 194 32 Q 198 38 196 44" stroke="#DE7A3E" stroke-width="1.8" stroke-linecap="round" fill="none" />

      <!-- The Country Pumpkin Patch (Right of Wall) -->
      <path d="M 205 40 Q 245 45 275 40 L 275 160 Q 235 165 210 160 Z" fill="#E6DFCC" opacity="0.6" />
      <!-- Plump Orange Pumpkins -->
      <!-- Pumpkin 1 -->
      <ellipse cx="230" cy="75" rx="14" ry="11" fill="#E87D38" stroke="#3B2615" stroke-width="1.5" />
      <path d="M 230 64 Q 233 58 236 60" stroke="#4A633B" stroke-width="2" stroke-linecap="round" fill="none" />
      <!-- Pumpkin 2 -->
      <ellipse cx="255" cy="95" rx="16" ry="13" fill="#DB6E28" stroke="#3B2615" stroke-width="1.5" />
      <path d="M 255 82 Q 252 75 258 78" stroke="#4A633B" stroke-width="2.2" stroke-linecap="round" fill="none" />
      <!-- Pumpkin 3 -->
      <ellipse cx="235" cy="130" rx="13" ry="10" fill="#E87D38" stroke="#3B2615" stroke-width="1.5" />
      <!-- Curling Pumpkin Vines -->
      <path d="M 220 80 Q 240 100 250 120" stroke="#557544" stroke-width="1.6" fill="none" />

      <!-- Wooden Fingerpost Signpost on Left Side -->
      <line x1="85" y1="65" x2="85" y2="135" stroke="#5E4029" stroke-width="3" stroke-linecap="round" />
      <!-- Top Finger pointing north: "← TO MILL" -->
      <path d="M 85 75 L 50 75 L 42 81 L 50 87 L 85 87 Z" fill="#E0D5C3" stroke="#422D1D" stroke-width="1.4" />
      <text x="48" y="83" font-family="serif" font-size="6.5" font-weight="bold" fill="#3D2B1F">← MILL</text>
      <!-- Bottom Finger pointing south: "ORCHARD →" -->
      <path d="M 85 95 L 120 95 L 128 101 L 120 107 L 85 107 Z" fill="#E0D5C3" stroke="#422D1D" stroke-width="1.4" />
      <text x="89" y="103" font-family="serif" font-size="6" font-weight="bold" fill="#3D2B1F">ORCHARD →</text>

      <!-- Nodding Country Sunflowers -->
      <path d="M 30 140 Q 35 105 32 80" stroke="#4D6B3C" stroke-width="2" fill="none" />
      <circle cx="32" cy="78" r="7" fill="#5E381A" stroke="#2B1A0C" stroke-width="1" />
      <circle cx="32" cy="78" r="11" fill="none" stroke="#EBB534" stroke-width="3.5" stroke-dasharray="3,2" />
    </svg>
  `;
}

// Sector 5: Ancient Oak & Windmill Bluff (Connects to Sector 1 Right)
function renderSector5SVG(frag, isThumb) {
  return `
    <svg viewBox="0 0 240 270" xmlns="http://www.w3.org/2000/svg" style="width:100%; height:100%; overflow:visible;">
      <!-- Organic Paper Wash Background -->
      <path d="M 8 10 Q 120 4 232 12 Q 236 135 232 260 Q 120 266 10 258 Q 4 135 8 10 Z" 
            fill="#FAF6EE" stroke="#E2DACB" stroke-width="1.2" stroke-dasharray="3,2" />

      <!-- Grassy Knoll Bluff Wash -->
      <path d="M 12 140 Q 90 120 180 150 Q 215 160 236 165 L 236 255 L 12 255 Z" fill="#E5E2D1" opacity="0.7" />

      <!-- Right Seam: Giant Knotted Oak Boughs reaching toward Sector 1 (Y: 115 and Y: 160) -->
      <!-- Massive Oak Trunk Rooted on Bluff -->
      <path d="M 75 240 C 70 190 85 150 110 130 C 135 110 190 112 240 115" stroke="#453323" stroke-width="14" stroke-linecap="round" fill="none" />
      <path d="M 75 240 C 70 190 85 150 110 130 C 135 110 190 112 240 115" stroke="#634B36" stroke-width="10" stroke-linecap="round" fill="none" />
      <!-- Lower Bough extending to seam Y: 160 -->
      <path d="M 120 135 Q 170 148 240 160" stroke="#453323" stroke-width="8" stroke-linecap="round" fill="none" />
      <path d="M 120 135 Q 170 148 240 160" stroke="#634B36" stroke-width="5.5" stroke-linecap="round" fill="none" />
      
      <!-- Bark Texturing & Knothole -->
      <path d="M 72 230 C 76 195 82 170 95 150" stroke="#332417" stroke-width="1.6" fill="none" />
      <path d="M 88 235 C 92 190 102 165 115 145" stroke="#332417" stroke-width="1.6" fill="none" />
      <!-- Cozy Hollow Knothole -->
      <ellipse cx="98" cy="165" rx="5.5" ry="9" fill="#24170E" stroke="#453323" stroke-width="1.8" />

      <!-- Swaying Paper Lantern hanging from limb -->
      <line x1="165" y1="112" x2="165" y2="135" stroke="#332417" stroke-width="1.2" />
      <rect x="158" y="135" width="14" height="18" rx="2" fill="#FFEAA8" stroke="#453323" stroke-width="1.6" />
      <line x1="158" y1="144" x2="172" y2="144" stroke="#453323" stroke-width="1" />
      <circle cx="165" cy="144" r="2.5" fill="#FFA533" />

      <!-- Giant Lush Oak Leaf Canopy -->
      <!-- Canopy Cloud Mass 1 -->
      <path d="M 40 80 Q 25 50 55 35 Q 85 20 115 35 Q 155 15 185 45 Q 215 40 225 70 Q 235 100 205 115 Q 175 130 145 115 Q 115 125 85 115 Q 55 110 40 80 Z" 
            fill="#698555" stroke="#2B3B22" stroke-width="2.2" stroke-linejoin="round" />
      <!-- Interior Leaf Layers with watercolor highlight -->
      <path d="M 65 65 Q 85 40 120 50 Q 155 35 175 60 Q 195 75 175 95 Q 140 105 110 95 Q 80 100 65 65 Z" 
            fill="#809E69" stroke="#3B4F30" stroke-width="1.4" opacity="0.8" />

      <!-- Cheerful Songbird Perched on Upper Branch -->
      <ellipse cx="140" cy="40" rx="4.5" ry="3.5" fill="#4B88A6" stroke="#1F3F52" stroke-width="1" />
      <circle cx="144" cy="38" r="2.5" fill="#D65638" />
      <line x1="146" y1="38" x2="149" y2="39" stroke="#E0A72B" stroke-width="1" />

      <!-- Rustic Canvas Windmill on the Meadow Bluff in Background -->
      <!-- Tower Body -->
      <path d="M 28 175 L 48 175 L 44 135 L 32 135 Z" fill="#DDD5C7" stroke="#453628" stroke-width="1.6" />
      <path d="M 26 135 L 50 135 L 38 120 Z" fill="#996043" stroke="#453628" stroke-width="1.6" />
      <!-- Windmill 4 Canvas Sails -->
      <line x1="15" y1="130" x2="61" y2="130" stroke="#3D2E21" stroke-width="1.8" />
      <line x1="38" y1="107" x2="38" y2="153" stroke="#3D2E21" stroke-width="1.8" />
      <rect x="16" y="125" width="18" height="5" fill="#F4EFE6" stroke="#453628" stroke-width="0.8" />
      <rect x="42" y="130" width="18" height="5" fill="#F4EFE6" stroke="#453628" stroke-width="0.8" />
      <rect x="38" y="108" width="5" height="18" fill="#F4EFE6" stroke="#453628" stroke-width="0.8" />
      <rect x="33" y="134" width="5" height="18" fill="#F4EFE6" stroke="#453628" stroke-width="0.8" />
      <circle cx="38" cy="130" r="2.5" fill="#453628" />
    </svg>
  `;
}

// Sector 6: Mountain Waterfall & Alpine Aqueduct (Connects to Sector 2 Below)
function renderSector6SVG(frag, isThumb) {
  return `
    <svg viewBox="0 0 260 210" xmlns="http://www.w3.org/2000/svg" style="width:100%; height:100%; overflow:visible;">
      <!-- Organic Paper Wash Background -->
      <path d="M 8 10 Q 130 4 252 12 Q 256 105 250 202 Q 128 206 10 198 Q 4 105 8 10 Z" 
            fill="#FAF6EE" stroke="#E2DACB" stroke-width="1.2" stroke-dasharray="3,2" />

      <!-- Alpine Sky & Snow-capped Peaks -->
      <path d="M 12 75 L 65 20 L 115 75 Z" fill="#CAD7E0" stroke="#425766" stroke-width="2" stroke-linejoin="round" />
      <path d="M 65 20 L 52 42 L 65 36 L 78 44 Z" fill="#FFF" stroke="#425766" stroke-width="1.5" />
      
      <path d="M 105 80 L 165 14 L 225 80 Z" fill="#B5C6D1" stroke="#3D4F5C" stroke-width="2" stroke-linejoin="round" />
      <path d="M 165 14 L 148 40 L 165 32 L 182 42 Z" fill="#FFF" stroke="#3D4F5C" stroke-width="1.5" />

      <!-- Granite Mountain Canyon Gorge -->
      <path d="M 30 75 L 65 120 L 60 210 L 15 210 L 20 110 Z" fill="#C8C0B3" stroke="#3B3227" stroke-width="2" />
      <path d="M 140 75 L 145 120 L 175 210 L 255 210 L 250 80 Z" fill="#C8C0B3" stroke="#3B3227" stroke-width="2" />

      <!-- Roman-style Stone Aqueduct Bridging the Chasm -->
      <!-- Aqueduct Canal Beam -->
      <path d="M 50 105 L 165 105 L 165 122 L 50 122 Z" fill="#D3C9B8" stroke="#3B3227" stroke-width="1.8" />
      <!-- Aqueduct Arches -->
      <path d="M 65 122 Q 85 108 105 122" stroke="#3B3227" stroke-width="1.8" fill="none" />
      <path d="M 110 122 Q 130 108 150 122" stroke="#3B3227" stroke-width="1.8" fill="none" />
      <line x1="107" y1="122" x2="107" y2="155" stroke="#3B3227" stroke-width="2" />

      <!-- The Rushing Mountain Waterfall (Plunges down to Sector 2 Seam at Bottom X: 60-120) -->
      <!-- Waterfall Water Streams -->
      <path d="M 75 110 C 72 140 68 175 70 210 L 115 210 C 118 175 112 140 108 110 Z" fill="#91BAC9" opacity="0.85" />
      <!-- Foaming White Rushes & Foam Lines -->
      <path d="M 82 112 C 80 145 76 180 78 210" stroke="#FFF" stroke-width="2.5" stroke-linecap="round" fill="none" />
      <path d="M 94 112 C 95 145 92 180 94 210" stroke="#E1F2F7" stroke-width="3" stroke-linecap="round" fill="none" />
      <path d="M 104 112 C 106 145 102 180 105 210" stroke="#FFF" stroke-width="2.2" stroke-linecap="round" fill="none" />
      <!-- Water Spray & Mist at Seam Base -->
      <circle cx="76" cy="205" r="5" fill="#FFF" opacity="0.7" />
      <circle cx="92" cy="202" r="7" fill="#FFF" opacity="0.8" />
      <circle cx="108" cy="205" r="6" fill="#FFF" opacity="0.7" />

      <!-- Alpine Evergreens Clinging to the Cliffs -->
      <path d="M 38 120 L 48 105 L 58 120 Z" fill="#3D5438" stroke="#1F2E1C" stroke-width="1.2" />
      <path d="M 40 110 L 48 98 L 56 110 Z" fill="#4B6945" stroke="#1F2E1C" stroke-width="1.2" />

      <path d="M 165 145 L 178 128 L 191 145 Z" fill="#3D5438" stroke="#1F2E1C" stroke-width="1.2" />
      <path d="M 168 134 L 178 120 L 188 134 Z" fill="#4B6945" stroke="#1F2E1C" stroke-width="1.2" />
    </svg>
  `;
}

// ============================================================================
// 10. MINI-ACTIVITIES (ZONE OUT, SAND ZEN, PEBBLES)
// ============================================================================
function initMiniPlayTools() {
  initPondCanvas();
  initZenSandCanvas();
  initPebbleGridDisplay();
}

function initPondCanvas() {
  const canvas = document.getElementById('pond-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  const ripples = [];

  function resize() {
    width = canvas.width = canvas.parentElement.clientWidth;
    height = canvas.height = canvas.parentElement.clientHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function addRipple(x, y) {
    ripples.push({
      x, y,
      radius: 0,
      maxRadius: 180 + Math.random() * 80,
      opacity: 0.8,
      speed: 2.5,
      hue: 200 + Math.random() * 40
    });
    audio.playTap(260 + Math.random() * 120);
  }

  canvas.addEventListener('pointerdown', (e) => {
    const rect = canvas.getBoundingClientRect();
    addRipple(e.clientX - rect.left, e.clientY - rect.top);
  });

  canvas.addEventListener('pointermove', (e) => {
    if (e.buttons === 1 && Math.random() > 0.6) {
      const rect = canvas.getBoundingClientRect();
      addRipple(e.clientX - rect.left, e.clientY - rect.top);
    }
  });

  function render() {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.2)';
    ctx.fillRect(0, 0, width, height);

    for (let i = ripples.length - 1; i >= 0; i--) {
      const r = ripples[i];
      r.radius += r.speed;
      r.opacity -= 0.012;

      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(${r.hue}, 80%, 70%, ${r.opacity})`;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      if (r.opacity <= 0) ripples.splice(i, 1);
    }
    requestAnimationFrame(render);
  }
  render();
}

function initZenSandCanvas() {
  const canvas = document.getElementById('zen-sand-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let isDrawing = false;
  let tool = 'rake';

  function resize() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    smooth();
  }
  window.addEventListener('resize', resize);

  function smooth() {
    ctx.fillStyle = '#F3ECE1';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(195, 175, 150, 0.25)';
    ctx.lineWidth = 1;
    for (let y = 10; y < canvas.height; y += 12) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  }

  resize();

  const btnRake = document.getElementById('btn-sand-rake');
  const btnStone = document.getElementById('btn-sand-stone');
  const btnSmooth = document.getElementById('btn-sand-smooth');

  if (btnRake) {
    btnRake.onclick = () => {
      tool = 'rake';
      btnRake.classList.add('active');
      if (btnStone) btnStone.classList.remove('active');
    };
  }
  if (btnStone) {
    btnStone.onclick = () => {
      tool = 'stone';
      btnStone.classList.add('active');
      if (btnRake) btnRake.classList.remove('active');
    };
  }
  if (btnSmooth) {
    btnSmooth.onclick = () => {
      smooth();
      audio.playTap(350);
    };
  }

  function rake(x, y) {
    ctx.strokeStyle = 'rgba(168, 142, 114, 0.45)';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(x, y, 7, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(168, 142, 114, 0.35)';
    ctx.fill();
    audio.playTap(300);
  }

  function dropStone(x, y) {
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.15)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 6;
    ctx.fillStyle = '#64748B';
    ctx.beginPath();
    ctx.ellipse(x, y, 22, 16, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    audio.playTap(220);
  }

  canvas.addEventListener('pointerdown', (e) => {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (tool === 'rake') rake(x, y);
    else dropStone(x, y);
  });

  canvas.addEventListener('pointermove', (e) => {
    if (isDrawing && tool === 'rake') {
      const rect = canvas.getBoundingClientRect();
      rake(e.clientX - rect.left, e.clientY - rect.top);
    }
  });

  window.addEventListener('pointerup', () => { isDrawing = false; });
}

function initPebbleGridDisplay() {
  const grid = document.getElementById('pebble-grid-display');
  if (!grid) return;
  grid.innerHTML = '';

  const symbols = ['🍃', '🪨', '🌸', '✨', '💧', '🌾', '🌙', '🪵', '🌱', '☀️', '🐚', '🏮', '🌿', '🍂', '🍄', '🕊️'];
  const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];

  for (let i = 0; i < 16; i++) {
    const stone = document.createElement('div');
    stone.className = 'tinker-stone';
    stone.innerHTML = symbols[i];

    stone.addEventListener('click', () => {
      audio.playTap(notes[i % notes.length]);
      stone.style.transform = 'scale(0.85) rotate(15deg)';
      setTimeout(() => stone.style.transform = '', 200);
    });

    grid.appendChild(stone);
  }
}

// ============================================================================
// 11. AI TASK ENTRY MODAL
// ============================================================================
function initAITaskEntryModal() {
  const btnOpen = document.getElementById('btn-open-add-modal');
  const modal = document.getElementById('add-task-modal');
  const btnClose = document.getElementById('btn-close-add-dialog');
  const inputIntent = document.getElementById('input-task-intent');

  if (btnOpen && modal) {
    btnOpen.addEventListener('click', () => {
      modal.style.display = 'flex';
      if (inputIntent) inputIntent.focus();
      audio.playTap(480);
    });
  }

  if (btnClose && modal) {
    btnClose.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  const chips = document.querySelectorAll('.quick-chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      if (inputIntent) inputIntent.value = chip.dataset.text;
      selectDueDayPill(chip.dataset.due);
      updateAIResponse(chip.dataset.text);
      audio.playTap(500);
    });
  });

  const dayPills = document.querySelectorAll('.day-select-pill');
  dayPills.forEach(pill => {
    pill.addEventListener('click', () => {
      dayPills.forEach(p => p.classList.remove('selected'));
      pill.classList.add('selected');
      audio.playTap(460);
    });
  });

  if (inputIntent) {
    inputIntent.addEventListener('input', () => {
      updateAIResponse(inputIntent.value);
    });
  }

  const btnYes = document.getElementById('btn-ai-place-yes');
  if (btnYes) {
    btnYes.addEventListener('click', () => {
      confirmAITaskCreation();
    });
  }

  const btnSmaller = document.getElementById('btn-ai-place-smaller');
  if (btnSmaller) {
    btnSmaller.addEventListener('click', () => {
      const body = document.getElementById('ai-whisper-body');
      if (body) {
        body.innerHTML = `
          <p class="ai-recommend">Made smaller: <strong>4 × 15-minute micro-steps</strong>.</p>
          <p class="ai-question">Does this feel easier to approach?</p>
        `;
      }
      audio.playTap(520);
    });
  }

  const btnSelf = document.getElementById('btn-ai-place-self');
  if (btnSelf) {
    btnSelf.addEventListener('click', () => {
      confirmAITaskCreation();
    });
  }
}

function selectDueDayPill(day) {
  document.querySelectorAll('.day-select-pill').forEach(p => {
    p.classList.toggle('selected', p.dataset.day === day);
  });
}

function updateAIResponse(text) {
  const body = document.getElementById('ai-whisper-body');
  if (!body) return;
  const isEmail = text.toLowerCase().includes('email') || text.toLowerCase().includes('call');
  const count = isEmail ? 2 : 3;
  body.innerHTML = `
    <p class="ai-recommend">Looks like about <strong>${count} short sessions</strong> (30 min each).</p>
    <p class="ai-question">Want me to spread those across your week?</p>
  `;
}

function confirmAITaskCreation() {
  const inputIntent = document.getElementById('input-task-intent');
  const title = (inputIntent && inputIntent.value.trim()) ? inputIntent.value.trim() : 'New project';
  const selDay = document.querySelector('.day-select-pill.selected');
  const dueCode = selDay ? selDay.dataset.day : 'FRI';
  const dueText = selDay ? selDay.textContent : 'Friday';

  const newId = `proj-${Date.now()}`;
  const newProject = {
    id: newId,
    title: title,
    deadlineDay: dueCode,
    deadlineText: dueText,
    totalSessions: 3,
    sessionDurationMin: 30,
    sessions: [
      {
        id: `sess-${Date.now()}-1`,
        projectId: newId,
        day: 'MON',
        title: `Outline: ${title}`,
        durationMin: 30,
        completed: false,
        isToday: true
      },
      {
        id: `sess-${Date.now()}-2`,
        projectId: newId,
        day: 'TUE',
        title: `Draft core: ${title}`,
        durationMin: 30,
        completed: false,
        isToday: false
      },
      {
        id: `sess-${Date.now()}-3`,
        projectId: newId,
        day: dueCode === 'FRI' ? 'THU' : dueCode,
        title: `Review & polish: ${title}`,
        durationMin: 30,
        completed: false,
        isToday: false
      }
    ]
  };

  AppState.projects.unshift(newProject);
  AppState.activeProjectId = newId;

  const modal = document.getElementById('add-task-modal');
  if (modal) modal.style.display = 'none';

  audio.playChime();
  renderProjectFilterPills();
  renderMainHero();
  renderCalendarDesk();
  if (AppState.isDrawerOpen) renderDrawerContent();
}

// ============================================================================
// 12. GENTLE BREAK COMPANION
// ============================================================================
function initBreakSystem() {
  const modal = document.getElementById('break-prompt-modal');
  const btnConfirm = document.getElementById('btn-confirm-break');
  const btnDismiss = document.getElementById('btn-dismiss-break');

  if (btnDismiss && modal) {
    btnDismiss.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  const opts = document.querySelectorAll('.btn-break-opt');
  opts.forEach(btn => {
    btn.addEventListener('click', () => {
      opts.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      AppState.breakTimer.durationMins = parseInt(btn.dataset.mins, 10);
      audio.playTap(480);
    });
  });

  if (btnConfirm && modal) {
    btnConfirm.addEventListener('click', () => {
      modal.style.display = 'none';
      closeFocusMode();
      openLivingWorld();
      startBreakCountdown(AppState.breakTimer.durationMins);
      audio.playTap(520);
    });
  }

  const btnReturn = document.getElementById('btn-toast-return');
  const btnMore = document.getElementById('btn-toast-more');
  const toast = document.getElementById('gentle-return-toast');

  if (btnReturn) {
    btnReturn.addEventListener('click', () => {
      if (toast) toast.style.display = 'none';
      const project = getActiveProject();
      const s = project.sessions.find(item => item.isToday && !item.completed) || project.sessions[0];
      if (s) launchFocusMode(s);
      audio.playTap(500);
    });
  }

  if (btnMore) {
    btnMore.addEventListener('click', () => {
      if (toast) toast.style.display = 'none';
      startBreakCountdown(5);
      audio.playTap(460);
    });
  }
}

function openBreakPrompt() {
  const modal = document.getElementById('break-prompt-modal');
  if (modal) modal.style.display = 'flex';
}

function startBreakCountdown(mins) {
  if (AppState.breakTimer.intervalId) clearInterval(AppState.breakTimer.intervalId);
  AppState.breakTimer.remainingSeconds = mins * 60;
  AppState.breakTimer.isRunning = true;

  AppState.breakTimer.intervalId = setInterval(() => {
    if (AppState.breakTimer.remainingSeconds > 0) {
      AppState.breakTimer.remainingSeconds--;
    } else {
      clearInterval(AppState.breakTimer.intervalId);
      AppState.breakTimer.isRunning = false;
      const toast = document.getElementById('gentle-return-toast');
      if (toast) {
        toast.style.display = 'block';
        audio.playChime();
      }
    }
  }, 1000);
}

// ============================================================================
// 13. AMBIENT RAIN SOUND TOGGLE
// ============================================================================
function initAmbientSoundToggle() {
  const btn = document.getElementById('btn-sound-toggle');
  const icon = document.getElementById('sound-icon');

  if (btn) {
    btn.addEventListener('click', () => {
      const isNowPlaying = audio.toggleAmbientRain(!audio.isAmbientPlaying);
      btn.classList.toggle('active', isNowPlaying);
      if (icon) icon.textContent = isNowPlaying ? '🌧️' : '🔇';
    });
  }
}
