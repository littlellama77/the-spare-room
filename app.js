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

  // The Living World
  world: {
    month: 'September',
    theme: 'day', // 'day' | 'sunset' | 'night'
    unlockedPieces: [
      { id: 'p-1', name: 'Wildflower Patch', icon: '🌸', count: 2 },
      { id: 'p-2', name: 'Ancient Oak', icon: '🌳', count: 1 },
      { id: 'p-3', name: 'Cozy Cabin', icon: '🏡', count: 1 },
      { id: 'p-4', name: 'Stone Lantern', icon: '🏮', count: 2 },
      { id: 'p-5', name: 'Pond Duck', icon: '🦆', count: 1 },
      { id: 'p-6', name: 'River Stone', icon: '🪨', count: 3 }
    ],
    placedEntities: [
      { id: 'e-1', icon: '🏡', label: 'Cozy Cabin', x: 44, y: 46 },
      { id: 'e-2', icon: '🌳', label: 'Ancient Oak', x: 28, y: 40 },
      { id: 'e-3', icon: '🌳', label: 'Birch Grove', x: 66, y: 42 },
      { id: 'e-4', icon: '🌸', label: 'Wildflower Meadow', x: 36, y: 58 },
      { id: 'e-5', icon: '🌸', label: 'Poppy Cluster', x: 60, y: 62 },
      { id: 'e-6', icon: '🪨', label: 'River Stone', x: 50, y: 52 },
      { id: 'e-7', icon: '🦆', label: 'Pond Duck', x: 54, y: 48 },
      { id: 'e-8', icon: '🏮', label: 'Tea Lantern', x: 46, y: 64 }
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
  const dioramaCount = document.getElementById('diorama-piece-count');
  if (dioramaCount) {
    dioramaCount.textContent = `${AppState.world.placedEntities.length} pieces grown →`;
  }

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
            piecesContainer.innerHTML = '<span>🌱</span> <span>🌸</span> <span>🪨</span>';
          }

          // 4. Flying seeds float to the world anchor
          const cardRect = document.getElementById('scratch-sequence-card').getBoundingClientRect();
          flySeedsToWorld(cardRect.left + cardRect.width / 2 - 20, cardRect.top + 140);

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
// 9. THE LIVING WORLD & BOUNDED PLAY SPACE
// ============================================================================
function initLivingWorldScreen() {
  const btnOpen = document.getElementById('btn-open-world');
  const btnBack = document.getElementById('btn-back-to-desk');
  const screen = document.getElementById('world-play-screen');

  if (btnOpen) {
    btnOpen.addEventListener('click', () => {
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
      setIslandTheme(btn.dataset.time);
      audio.playTap(480);
    });
  });

  const btnBreakTrigger = document.getElementById('btn-trigger-break-modal');
  if (btnBreakTrigger) {
    btnBreakTrigger.addEventListener('click', () => {
      openBreakPrompt();
      audio.playTap(460);
    });
  }
}

function openLivingWorld() {
  const screen = document.getElementById('world-play-screen');
  if (screen) {
    screen.style.display = 'block';
    renderIslandScene();
  }
}

function setIslandTheme(theme) {
  AppState.world.theme = theme;
  const vp = document.getElementById('island-viewport');
  if (vp) vp.className = `island-viewport theme-${theme}`;
}

let activeDockItem = null;

function renderIslandScene() {
  const layer = document.getElementById('island-entities-layer');
  if (!layer) return;
  layer.innerHTML = '';

  AppState.world.placedEntities.forEach(ent => {
    const el = document.createElement('div');
    el.className = 'placed-entity';
    el.style.left = `${ent.x}%`;
    el.style.top = `${ent.y}%`;
    el.innerHTML = `
      <span class="entity-icon">${ent.icon}</span>
      <span class="entity-label">${ent.label}</span>
    `;

    el.addEventListener('click', (e) => {
      e.stopPropagation();
      el.classList.add('spark-burst');
      audio.playTap(600 + Math.random() * 200);
      setTimeout(() => el.classList.remove('spark-burst'), 650);
    });

    layer.appendChild(el);
  });

  const ground = document.getElementById('island-interactive-ground');
  if (ground) {
    ground.onclick = (e) => {
      const rect = ground.getBoundingClientRect();
      const xPct = Math.round(((e.clientX - rect.left) / rect.width) * 100);
      const yPct = Math.round(((e.clientY - rect.top) / rect.height) * 100);

      if (xPct > 22 && xPct < 78 && yPct > 32 && yPct < 78) {
        placeDockPieceOnIsland(xPct, yPct);
      }
    };
  }

  renderDockShelf();
}

function renderDockShelf() {
  const dock = document.getElementById('dock-pieces-row');
  if (!dock) return;
  dock.innerHTML = '';

  AppState.world.unlockedPieces.forEach(p => {
    if (p.count > 0) {
      const btn = document.createElement('button');
      btn.className = `dock-piece-btn ${activeDockItem === p.name ? 'active' : ''}`;
      btn.innerHTML = `<span>${p.icon}</span> <span>${p.name} (${p.count})</span>`;
      btn.addEventListener('click', () => {
        activeDockItem = (activeDockItem === p.name) ? null : p.name;
        renderDockShelf();
        audio.playTap(500);
      });
      dock.appendChild(btn);
    }
  });

  if (dock.children.length === 0) {
    dock.innerHTML = '<span style="font-size:0.8rem; color:var(--ink-tertiary); font-style:italic;">Finish work sessions to unlock more living pieces!</span>';
  }
}

function placeDockPieceOnIsland(x, y) {
  const target = AppState.world.unlockedPieces.find(p => p.name === activeDockItem && p.count > 0)
              || AppState.world.unlockedPieces.find(p => p.count > 0);

  if (target) {
    target.count--;
    AppState.world.placedEntities.push({
      id: `e-${Date.now()}`,
      icon: target.icon,
      label: target.name,
      x, y
    });
    audio.playChime();
    renderIslandScene();

    const dioramaCount = document.getElementById('diorama-piece-count');
    if (dioramaCount) dioramaCount.textContent = `${AppState.world.placedEntities.length} pieces grown →`;
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
