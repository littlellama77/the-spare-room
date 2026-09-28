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
// Powered by Authentic Hand-Drawn Reference Artworks
// ============================================================================

const ArtCollections = {
  workshop: {
    id: 'workshop',
    title: "The Clockmaker's Cozy Workshop",
    desc: 'Notice the visual connections—copper steam pipes, stone staircases, hanging lanterns, and ornate arches connect the fragments into one rich storybook drawing.',
    image: 'assets/art/cozy_fantasy_workshop.jpg',
    boardWidth: 700,
    boardHeight: 468,
    fragments: [
      {
        id: 'frag-ws-1',
        name: 'The Central Arched Door & Clock',
        subtitle: 'Anchor: Ornate Iron Hinges & Wall Gauge',
        targetX: 235,
        targetY: 105,
        width: 220,
        height: 260,
        isUnlocked: true,
        isPlaced: true,
        visualClue: 'The central hearth & wooden archway with wall clock.',
        feedback: 'The clockmaker door and glowing stained glass bell anchor the room!',
        deckleClass: 'deckle-1'
      },
      {
        id: 'frag-ws-2',
        name: 'The Moonlit Stone Staircase & Ficus',
        subtitle: 'Clue: Stone Arch & Ascending Steps',
        targetX: 435,
        targetY: 65,
        width: 265,
        height: 300,
        isUnlocked: true,
        isPlaced: false,
        visualClue: 'Look at the right side of the door—the stone archway and copper steam pipe continue into a moonlit stairwell with a potted ficus.',
        feedback: 'The stone archway connects into the moonlit stairway! 🌙',
        deckleClass: 'deckle-2'
      },
      {
        id: 'frag-ws-3',
        name: 'The Cozy Tavern Alcove & Barrel',
        subtitle: 'Clue: Coffee Cup Sign & Copper Pipe',
        targetX: 0,
        targetY: 75,
        width: 250,
        height: 290,
        isUnlocked: true,
        isPlaced: false,
        visualClue: 'The tavern wooden arch, coffee sign, and treasure chest connect onto the left wall.',
        feedback: 'The tavern arch and wooden beams connect seamlessly! ☕',
        deckleClass: 'deckle-3'
      },
      {
        id: 'frag-ws-4',
        name: 'The Overhead Loft & Steampunk Pipes',
        subtitle: 'Clue: Hanging Filigree Lantern & Steam Valves',
        targetX: 130,
        targetY: 0,
        width: 440,
        height: 135,
        isUnlocked: false,
        isPlaced: false,
        visualClue: 'The large hanging Moroccan lantern, brass pressure meters, and ceiling rafters drop down onto the doorway.',
        feedback: 'The overhead pipes and lantern chains align across the ceiling! 🏮',
        deckleClass: 'deckle-4'
      },
      {
        id: 'frag-ws-5',
        name: 'The Courtyard & Arcane Star Seal',
        subtitle: 'Clue: Cobblestone Joints & Star Pavement',
        targetX: 130,
        targetY: 330,
        width: 440,
        height: 138,
        isUnlocked: false,
        isPlaced: false,
        visualClue: 'The circular carved star stone seal and wildflower planters align across the lower courtyard floor.',
        feedback: 'The cobblestone courtyard and star seal complete the floor! 🌸',
        deckleClass: 'deckle-5'
      },
      {
        id: 'frag-ws-6',
        name: 'The Alchemist Rafters & Lantern Hoist',
        subtitle: 'Clue: Timber Cornice & Upper Pipe Corner',
        targetX: 0,
        targetY: 0,
        width: 170,
        height: 120,
        isUnlocked: false,
        isPlaced: false,
        visualClue: 'The upper left hanging lantern and curved copper steam pipe corner bridge the ceiling.',
        feedback: 'The entire workshop is unified into one continuous magical drawing! ✨',
        deckleClass: 'deckle-6'
      }
    ]
  },
  cats: {
    id: 'cats',
    title: 'The Whimsical Flowing Cats',
    desc: 'Notice the visual connections—one cat’s body, tail, and whiskers flow continuously into the next in a hypnotic single-contour drawing.',
    image: 'assets/art/continuous_line_cats.jpg',
    boardWidth: 540,
    boardHeight: 720,
    fragments: [
      {
        id: 'frag-cat-1',
        name: 'The Crescent Moon & Center Cats',
        subtitle: 'Anchor: Sleeping Cat Contours',
        targetX: 130,
        targetY: 190,
        width: 280,
        height: 330,
        isUnlocked: true,
        isPlaced: true,
        visualClue: 'The round sleeping cat in the center.',
        feedback: 'The central cat curls peacefully in line!',
        deckleClass: 'deckle-1'
      },
      {
        id: 'frag-cat-2',
        name: 'The Stretching Cat & Little Bee',
        subtitle: 'Clue: Curving Tail & Flying Bee',
        targetX: 350,
        targetY: 120,
        width: 190,
        height: 420,
        isUnlocked: true,
        isPlaced: false,
        visualClue: 'The tail curves up right toward a perched cat and honeybee.',
        feedback: 'The curling tail flows into the watchful cat! 🐝',
        deckleClass: 'deckle-2'
      },
      {
        id: 'frag-cat-3',
        name: 'The Tall Whisker Cat & Star',
        subtitle: 'Clue: Long Elegant Backline',
        targetX: 0,
        targetY: 90,
        width: 180,
        height: 440,
        isUnlocked: true,
        isPlaced: false,
        visualClue: 'The tall cat silhouette continues along the left boundary.',
        feedback: 'The elegant backline connects into the tall cat! 🐱',
        deckleClass: 'deckle-3'
      },
      {
        id: 'frag-cat-4',
        name: 'The Overhead Cat Ears & Starlight',
        subtitle: 'Clue: Pointed Ears & Crescent Sky',
        targetX: 110,
        targetY: 0,
        width: 350,
        height: 210,
        isUnlocked: false,
        isPlaced: false,
        visualClue: 'The top row of perked cat ears and starlight dots.',
        feedback: 'The ears and starry sky crown the tapestry! 🌙',
        deckleClass: 'deckle-4'
      },
      {
        id: 'frag-cat-5',
        name: 'The Kitten Pile & Yarn Ball',
        subtitle: 'Clue: Wavy Groundline & Tiny Paws',
        targetX: 40,
        targetY: 480,
        width: 460,
        height: 240,
        isUnlocked: false,
        isPlaced: false,
        visualClue: 'The cozy curled kitten with paws resting at the bottom.',
        feedback: 'The cozy kitten pile completes the groundline! 🧶',
        deckleClass: 'deckle-5'
      },
      {
        id: 'frag-cat-6',
        name: 'The Upper Corner Moon & Bird',
        subtitle: 'Clue: Crescent Moon & Flying Finch',
        targetX: 0,
        targetY: 0,
        width: 160,
        height: 160,
        isUnlocked: false,
        isPlaced: false,
        visualClue: 'The crescent moon and little songbird in the top left corner.',
        feedback: 'The entire flowing cat tapestry is complete and alive! ✨',
        deckleClass: 'deckle-6'
      }
    ]
  },
  tower: {
    id: 'tower',
    title: 'The Vintage Galata Tower & Sky',
    desc: 'Notice the visual connections—horizontal engraved cloud lines, classical stone arches, and roof shingles connect into an architectural master etching.',
    image: 'assets/art/ink_architectural_tower.jpg',
    boardWidth: 460,
    boardHeight: 770,
    fragments: [
      {
        id: 'frag-tw-1',
        name: 'The Conical Spire & Weather Vane',
        subtitle: 'Anchor: Stone Drum & Etched Shingles',
        targetX: 110,
        targetY: 110,
        width: 240,
        height: 340,
        isUnlocked: true,
        isPlaced: true,
        visualClue: 'The soaring conical tower spire.',
        feedback: 'The historic stone spire rises into the clouds!',
        deckleClass: 'deckle-1'
      },
      {
        id: 'frag-tw-2',
        name: 'The Classical Arches & Cornice',
        subtitle: 'Clue: Round Roman Arches & Stippling',
        targetX: 270,
        targetY: 400,
        width: 190,
        height: 370,
        isUnlocked: true,
        isPlaced: false,
        visualClue: 'The classical arched masonry on the right facade.',
        feedback: 'The classical stone arches connect with fine masonry! 🏛️',
        deckleClass: 'deckle-2'
      },
      {
        id: 'frag-tw-3',
        name: 'The Rooftops & Fire Escapes',
        subtitle: 'Clue: Chimneys & Window Grilles',
        targetX: 0,
        targetY: 420,
        width: 200,
        height: 350,
        isUnlocked: true,
        isPlaced: false,
        visualClue: 'The historic residential building rooftops on the left.',
        feedback: 'The neighborhood rooftops connect beneath the tower! 🏘️',
        deckleClass: 'deckle-3'
      },
      {
        id: 'frag-tw-4',
        name: 'The Tower Balcony & Gallery',
        subtitle: 'Clue: Columned Balustrade',
        targetX: 90,
        targetY: 320,
        width: 280,
        height: 180,
        isUnlocked: false,
        isPlaced: false,
        visualClue: 'The 360-degree observation gallery balustrade.',
        feedback: 'The stone gallery rings the tower cleanly! 🗼',
        deckleClass: 'deckle-4'
      },
      {
        id: 'frag-tw-5',
        name: 'The Whispering Cloud Hatching',
        subtitle: 'Clue: Parallel Line-Engraved Sky',
        targetX: 30,
        targetY: 0,
        width: 400,
        height: 180,
        isUnlocked: false,
        isPlaced: false,
        visualClue: 'The dense horizontal parallel engraved lines of the cloud canopy.',
        feedback: 'The dramatic cloud engraving completes the sky! ☁️',
        deckleClass: 'deckle-5'
      },
      {
        id: 'frag-tw-6',
        name: 'The Distant Harbor Spire',
        subtitle: 'Clue: Flagpole & Classical Pediment',
        targetX: 300,
        targetY: 280,
        width: 160,
        height: 200,
        isUnlocked: false,
        isPlaced: false,
        visualClue: 'The smaller distant dome and flagpole on the right horizon.',
        feedback: 'The entire historical city engraving is unified! 🖋️',
        deckleClass: 'deckle-6'
      }
    ]
  },
  landscape: {
    id: 'landscape',
    title: 'The Hatched Alpine Valley',
    desc: 'Notice the visual connections—rhythmic parallel hatch lines in the green slopes and blue stream carry the eye through the alpine pass.',
    image: 'assets/art/hatched_landscape.jpg',
    boardWidth: 440,
    boardHeight: 780,
    fragments: [
      {
        id: 'frag-ls-1',
        name: 'The Alpine Meandering Stream',
        subtitle: 'Anchor: Blue Flow & Stepped Terraces',
        targetX: 110,
        targetY: 250,
        width: 220,
        height: 320,
        isUnlocked: true,
        isPlaced: true,
        visualClue: 'The meandering stream flowing between terraced slopes.',
        feedback: 'The alpine stream winds through the valley floor!',
        deckleClass: 'deckle-1'
      },
      {
        id: 'frag-ls-2',
        name: 'The Pink Wildflower Meadows',
        subtitle: 'Clue: Magenta Flower Bushes',
        targetX: 260,
        targetY: 420,
        width: 180,
        height: 360,
        isUnlocked: true,
        isPlaced: false,
        visualClue: 'The pink wildflower clusters and green field lines on the right.',
        feedback: 'The wildflower clusters bloom along the riverbank! 🌸',
        deckleClass: 'deckle-2'
      },
      {
        id: 'frag-ls-3',
        name: 'The Left Terraced Banks',
        subtitle: 'Clue: Vertical Green Hatching',
        targetX: 0,
        targetY: 420,
        width: 180,
        height: 360,
        isUnlocked: true,
        isPlaced: false,
        visualClue: 'The left wildflower bush and horizontal pasture lines.',
        feedback: 'The terraced pastures line the valley stream! 🌾',
        deckleClass: 'deckle-3'
      },
      {
        id: 'frag-ls-4',
        name: 'The Snow-Capped Peak & Horizon',
        subtitle: 'Clue: Straight Sky Lines & Snowy Summit',
        targetX: 70,
        targetY: 0,
        width: 300,
        height: 250,
        isUnlocked: false,
        isPlaced: false,
        visualClue: 'The snow-covered peak and horizontal cyan sky lines.',
        feedback: 'The snow-capped summit crowns the alpine vista! ⛰️',
        deckleClass: 'deckle-4'
      },
      {
        id: 'frag-ls-5',
        name: 'The Blue Mountain Gorge Ridge',
        subtitle: 'Clue: Diagonal Indigo Hatching',
        targetX: 240,
        targetY: 150,
        width: 200,
        height: 330,
        isUnlocked: false,
        isPlaced: false,
        visualClue: 'The deep indigo diagonal ridge shading on the right mountain.',
        feedback: 'The diagonal mountain ridge completes the gorge! 🌲',
        deckleClass: 'deckle-5'
      },
      {
        id: 'frag-ls-6',
        name: 'The Whispering Pine Bluff',
        subtitle: 'Clue: Dark Green Crag Ridge',
        targetX: 0,
        targetY: 150,
        width: 180,
        height: 330,
        isUnlocked: false,
        isPlaced: false,
        visualClue: 'The dark pine crag standing tall on the left mountain flank.',
        feedback: 'The entire alpine landscape is assembled and alive! 🌿',
        deckleClass: 'deckle-6'
      }
    ]
  },
  celestial: {
    id: 'celestial',
    title: 'The Luminous Celestial City',
    desc: 'Notice the visual connections—glowing oval portals revealing cosmic nebulae, floating bioluminescent jellyfish lanterns, and glass shopfronts connect into a futuristic night scape.',
    image: 'assets/art/celestial_portal_city.jpg',
    boardWidth: 540,
    boardHeight: 720,
    fragments: [
      {
        id: 'frag-cel-1',
        name: 'The Center Moon Portal & Glass Arcade',
        subtitle: 'Anchor: Oval Portal & Starlit Shopfront',
        targetX: 130,
        targetY: 180,
        width: 280,
        height: 340,
        isUnlocked: true,
        isPlaced: true,
        visualClue: 'The oval moon portal peering into starry nebulae.',
        feedback: 'The celestial oval portal glows with cosmic light! 🌌',
        deckleClass: 'deckle-1'
      },
      {
        id: 'frag-cel-2',
        name: 'The Bioluminescent Jellyfish Lanterns',
        subtitle: 'Clue: Glowing Pink Floating Domes',
        targetX: 360,
        targetY: 120,
        width: 180,
        height: 410,
        isUnlocked: true,
        isPlaced: false,
        visualClue: 'The luminous pink jellyfish lanterns floating above the skybridge.',
        feedback: 'The jellyfish lanterns drift through the evening avenue! 🎐',
        deckleClass: 'deckle-2'
      },
      {
        id: 'frag-cel-3',
        name: 'The Left Portal Windows & Terrace',
        subtitle: 'Clue: Blue Architecture & Balconies',
        targetX: 0,
        targetY: 90,
        width: 180,
        height: 430,
        isUnlocked: true,
        isPlaced: false,
        visualClue: 'The tiered glass balconies and oval portal windows on the left facade.',
        feedback: 'The multi-story observatory facade connects seamlessly! 🏢',
        deckleClass: 'deckle-3'
      },
      {
        id: 'frag-cel-4',
        name: 'The Cosmic Nebula & Giant Moon',
        subtitle: 'Clue: Cyan Starfield & Heavenly Sphere',
        targetX: 90,
        targetY: 0,
        width: 360,
        height: 210,
        isUnlocked: false,
        isPlaced: false,
        visualClue: 'The cosmic nebula and celestial sphere glowing in the night sky.',
        feedback: 'The shimmering starfield illuminates the city skyline! ⭐',
        deckleClass: 'deckle-4'
      },
      {
        id: 'frag-cel-5',
        name: 'The Reflective Promenade & Strollers',
        subtitle: 'Clue: Mirror Floor & Warm Lights',
        targetX: 30,
        targetY: 490,
        width: 480,
        height: 230,
        isUnlocked: false,
        isPlaced: false,
        visualClue: 'The illuminated street floor with strollers and glowing shop display.',
        feedback: 'The reflective avenue mirrors the stars below! 💫',
        deckleClass: 'deckle-5'
      },
      {
        id: 'frag-cel-6',
        name: 'The Upper Sky Portal & Rooftop Garden',
        subtitle: 'Clue: Deep Violet Nebula Edge',
        targetX: 0,
        targetY: 0,
        width: 170,
        height: 180,
        isUnlocked: false,
        isPlaced: false,
        visualClue: 'The top left corner portal framing deep violet space.',
        feedback: 'The entire celestial metropolis is assembled into one breathtaking drawing! ✨',
        deckleClass: 'deckle-6'
      }
    ]
  }
};

let currentArtKey = 'workshop';

function getCurrentArt() {
  return ArtCollections[currentArtKey] || ArtCollections.workshop;
}

function initLivingWorldScreen() {
  const btnOpen = document.getElementById('btn-open-world');
  const btnBack = document.getElementById('btn-back-to-desk');
  const screen = document.getElementById('world-play-screen');
  const dioramaCount = document.getElementById('diorama-piece-count');
  const btnDeskGateway = document.getElementById('btn-desk-enter-world');

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

  if (btnDeskGateway) {
    btnDeskGateway.addEventListener('click', () => {
      openLivingWorld();
      audio.playTap(520);
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

  // Art Theme Selector Buttons
  const artBtns = document.querySelectorAll('.btn-art-theme');
  artBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      setArtCollection(btn.dataset.art);
      audio.playTap(520);
    });
  });

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

function setArtCollection(key) {
  if (!ArtCollections[key]) return;
  currentArtKey = key;
  AppState.world.fragments = ArtCollections[key].fragments;

  const titleEl = document.getElementById('canvas-world-title');
  const descEl = document.getElementById('canvas-world-desc');
  const art = getCurrentArt();

  if (titleEl) titleEl.textContent = art.title;
  if (descEl) descEl.textContent = art.desc;

  const gatewayHeading = document.querySelector('.gateway-heading');
  const gatewaySub = document.querySelector('.gateway-sub');
  const gatewayIcon = document.querySelector('.gateway-icon-art');
  const icons = {
    workshop: '🏰',
    cats: '🐱',
    tower: '🗼',
    landscape: '⛰️',
    celestial: '🌌'
  };
  if (gatewayHeading) gatewayHeading.textContent = art.title;
  if (gatewaySub) gatewaySub.textContent = art.desc;
  if (gatewayIcon) gatewayIcon.textContent = icons[key] || '🎨';

  document.querySelectorAll('.btn-art-theme').forEach(b => {
    b.classList.toggle('active', b.dataset.art === key);
  });

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
  const art = getCurrentArt();
  const frags = art.fragments || [];
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

  const deskPill = document.getElementById('desk-world-count-pill');
  if (deskPill) {
    deskPill.textContent = `${placed} / ${total} Assembled`;
  }
}

function renderIllustrationWorkspace() {
  const art = getCurrentArt();
  AppState.world.fragments = art.fragments;

  // Sync board dimensions
  const board = document.getElementById('illustration-drawing-board');
  if (board) {
    board.style.width = `${art.boardWidth}px`;
    board.style.height = `${art.boardHeight}px`;
  }

  updateWorldTrackerCounters();
  renderPlacedFragments();
  renderSketchbookTray();
}

function renderPlacedFragments() {
  const layer = document.getElementById('placed-fragments-layer');
  if (!layer) return;
  layer.innerHTML = '';

  const art = getCurrentArt();
  const placedFrags = art.fragments.filter(f => f.isPlaced);

  placedFrags.forEach(frag => {
    const el = document.createElement('div');
    el.className = `placed-fragment ${frag.deckleClass || ''}`;
    el.id = `placed-${frag.id}`;
    el.style.left = `${frag.targetX}px`;
    el.style.top = `${frag.targetY}px`;
    el.style.width = `${frag.width}px`;
    el.style.height = `${frag.height}px`;

    // Authentic slice of master reference artwork
    el.style.backgroundImage = `url('${art.image}')`;
    el.style.backgroundSize = `${art.boardWidth}px ${art.boardHeight}px`;
    el.style.backgroundPosition = `-${frag.targetX}px -${frag.targetY}px`;

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

  const art = getCurrentArt();
  const unplacedFrags = art.fragments.filter(f => f.isUnlocked && !f.isPlaced);
  const totalPlaced = art.fragments.filter(f => f.isPlaced).length;
  const totalFrags = art.fragments.length;

  if (totalPlaced === totalFrags) {
    rack.innerHTML = `
      <div class="tray-all-placed-notice">
        <span>✨ "${art.title}" is whole! All hand-drawn fragments are seamlessly connected.</span>
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

    // Calculate thumbnail background scale
    const thumbScale = 120 / frag.height;
    const thumbW = art.boardWidth * thumbScale;
    const thumbH = art.boardHeight * thumbScale;
    const thumbPosX = -frag.targetX * thumbScale;
    const thumbPosY = -frag.targetY * thumbScale;

    card.innerHTML = `
      <div class="frag-card-thumb-wrap">
        <div class="frag-thumb-preview ${frag.deckleClass || ''}" style="
          width: 100%;
          height: 100%;
          background-image: url('${art.image}');
          background-size: ${thumbW}px ${thumbH}px;
          background-position: ${thumbPosX}px ${thumbPosY}px;
          background-repeat: no-repeat;
        "></div>
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

  const art = getCurrentArt();
  const board = document.getElementById('illustration-drawing-board');
  const dragLayer = document.getElementById('active-drag-layer');
  const snapHint = document.getElementById('magnetic-snap-hint');
  if (!board || !dragLayer) return;

  const boardRect = board.getBoundingClientRect();

  // Create floating drag node with authentic slice of the master artwork
  const dragNode = document.createElement('div');
  dragNode.className = `dragging-fragment-node ${fragment.deckleClass || ''}`;
  dragNode.style.width = `${fragment.width}px`;
  dragNode.style.height = `${fragment.height}px`;
  dragNode.style.backgroundImage = `url('${art.image}')`;
  dragNode.style.backgroundSize = `${art.boardWidth}px ${art.boardHeight}px`;
  dragNode.style.backgroundPosition = `-${fragment.targetX}px -${fragment.targetY}px`;
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
  const art = getCurrentArt();
  const lockedFrag = art.fragments.find(f => !f.isUnlocked);
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
