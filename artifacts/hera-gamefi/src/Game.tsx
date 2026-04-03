import { useEffect, useRef } from "react";

interface GameProps {
  onGoHome: () => void;
}

export default function Game({ onGoHome }: GameProps) {
  const mountedRef = useRef(false);

  useEffect(() => {
    document.body.classList.add("game-active");
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.documentElement.style.height = "100%";
    document.body.style.height = "100%";
    return () => {
      document.body.classList.remove("game-active");
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.documentElement.style.height = "";
      document.body.style.height = "";
      const gameStyle = document.getElementById("game-global-styles");
      if (gameStyle) gameStyle.remove();
      const gameLink = document.getElementById("game-font-link");
      if (gameLink) gameLink.remove();
    };
  }, []);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    const link = document.createElement("link");
    link.id = "game-font-link";
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap";
    document.head.appendChild(link);

    const style = document.createElement("style");
    style.id = "game-global-styles";
    style.textContent = `
      :root {
        --active-color: #29ff7a;
        --bg-dark: #050a05;
        --text-main: #c8ffd4;
        --neon-green: #29ff7a;
        --neon-red: #cb000c;
        --neon-orange: #fb8500;
        --neon-blue: #0088ff;
      }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      html, body { width: 100%; height: 100%; overflow: hidden !important; background: #050a05; }
      #root { width: 100%; height: 100%; overflow: hidden; }
      #canvas-container {
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;
        z-index: 0;
      }
      canvas { display: block; }

      /* ===== HUD ===== */
      #hud {
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;
        z-index: 10;
        pointer-events: none;
        font-family: 'Share Tech Mono', monospace;
        color: var(--active-color);
        opacity: 0;
        transition: opacity 0.3s;
      }
      .hud-top {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding: 56px 16px 12px;
      }
      .hud-panel {
        background: rgba(0,10,5,0.75);
        border: 1px solid var(--active-color);
        padding: 6px 12px;
        font-size: 12px;
        line-height: 1.7;
        min-width: 160px;
      }
      .hud-label { opacity: 0.6; font-size: 10px; letter-spacing: 2px; }
      .hud-value { font-size: 18px; font-weight: bold; }
      #alert-box {
        text-align: center;
        font-size: 11px;
        letter-spacing: 3px;
        border-color: var(--active-color);
        min-width: 180px;
      }
      #alert-text { font-size: 14px; font-weight: bold; }
      .hud-bottom-left { position: absolute; bottom: 16px; left: 16px; display: flex; gap: 8px; flex-direction: column; }
      .hud-bottom-right { position: absolute; bottom: 16px; right: 16px; }
      #life-bar-wrap { width: 160px; height: 8px; background: rgba(255,0,0,0.2); border: 1px solid rgba(255,0,0,0.5); }
      #life-bar-fill { height: 100%; background: #ff4444; transition: width 0.3s; }
      #crosshair {
        position: absolute;
        top: 50%; left: 50%;
        transform: translate(-50%,-50%);
        width: 20px; height: 20px;
      }
      #crosshair::before, #crosshair::after {
        content: '';
        position: absolute;
        background: var(--active-color);
        opacity: 0.8;
      }
      #crosshair::before { width: 100%; height: 1px; top: 50%; left: 0; }
      #crosshair::after { width: 1px; height: 100%; left: 50%; top: 0; }
      #hit-marker {
        position: absolute;
        top: 50%; left: 50%;
        transform: translate(-50%,-50%);
        color: #ff4444;
        font-size: 20px;
        font-weight: bold;
        opacity: 0;
        transition: opacity 0.1s;
        pointer-events: none;
      }
      #damage-overlay {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(200,0,0,0.3);
        opacity: 0;
        transition: opacity 0.2s;
        pointer-events: none;
        z-index: 9;
      }
      #reload-msg { font-size: 10px; letter-spacing: 2px; color: #fb8500; }

      /* ===== MENUS ===== */
      .menu-overlay {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 20;
        background: rgba(0,0,0,0.7);
        backdrop-filter: blur(4px);
      }
      .menu-box {
        background: rgba(0,10,5,0.95);
        border: 1px solid var(--neon-green);
        padding: 40px 48px;
        min-width: 380px;
        max-width: 520px;
        text-align: center;
        font-family: 'Orbitron', monospace;
      }
      .menu-title {
        font-size: 32px;
        font-weight: 900;
        letter-spacing: 6px;
        color: var(--neon-green);
        text-shadow: 0 0 20px var(--neon-green);
        margin-bottom: 4px;
      }
      .menu-subtitle {
        font-size: 11px;
        letter-spacing: 4px;
        color: rgba(200,255,212,0.5);
        margin-bottom: 32px;
        font-family: 'Share Tech Mono', monospace;
      }
      .menu-btn {
        display: block;
        width: 100%;
        padding: 12px 24px;
        margin: 8px 0;
        background: transparent;
        border: 1px solid var(--neon-green);
        color: var(--neon-green);
        font-family: 'Orbitron', monospace;
        font-size: 13px;
        letter-spacing: 3px;
        cursor: pointer;
        transition: all 0.2s;
        pointer-events: all;
      }
      .menu-btn:hover {
        background: rgba(41,255,122,0.15);
        box-shadow: 0 0 12px rgba(41,255,122,0.4);
      }
      .menu-btn.danger {
        border-color: var(--neon-red);
        color: var(--neon-red);
      }
      .menu-btn.danger:hover {
        background: rgba(203,0,12,0.15);
        box-shadow: 0 0 12px rgba(203,0,12,0.4);
      }
      .menu-input {
        width: 100%;
        background: rgba(0,20,10,0.8);
        border: 1px solid rgba(41,255,122,0.4);
        color: var(--neon-green);
        font-family: 'Share Tech Mono', monospace;
        font-size: 14px;
        padding: 10px 14px;
        margin: 8px 0 16px;
        outline: none;
        letter-spacing: 2px;
      }
      .menu-input:focus { border-color: var(--neon-green); }
      .menu-input::placeholder { opacity: 0.4; }
      .menu-divider {
        border: none;
        border-top: 1px solid rgba(41,255,122,0.2);
        margin: 16px 0;
      }

      /* ===== CONFIG ===== */
      #config-menu { display: none; }
      .config-inner {
        max-height: 80vh;
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-color: var(--neon-green) transparent;
        text-align: left;
        padding-right: 4px;
      }
      .config-section {
        margin-bottom: 16px;
        font-family: 'Share Tech Mono', monospace;
        font-size: 12px;
        color: rgba(200,255,212,0.8);
      }
      .config-section-title {
        color: var(--neon-green);
        font-family: 'Orbitron', monospace;
        font-size: 10px;
        letter-spacing: 3px;
        margin-bottom: 8px;
        opacity: 0.8;
      }
      .config-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 6px 0;
        gap: 12px;
      }
      .config-row label { flex: 1; }
      .config-row input[type=range] {
        flex: 1;
        accent-color: var(--neon-green);
        cursor: pointer;
      }
      .config-row input[type=color] {
        width: 32px; height: 22px;
        border: 1px solid rgba(41,255,122,0.4);
        background: none;
        cursor: pointer;
        padding: 0;
      }
      .config-val {
        min-width: 40px;
        text-align: right;
        color: var(--neon-green);
      }

      /* ===== INFO MODAL ===== */
      #info-modal-overlay { display: none; }
      .modal-content-block { font-family: 'Share Tech Mono', monospace; font-size: 13px; line-height: 1.7; color: rgba(200,255,212,0.85); }
      .modal-content-block h3 { color: var(--neon-green); font-family: 'Orbitron', monospace; letter-spacing: 2px; margin-bottom: 8px; font-size: 13px; }
      .modal-content-block p { margin-bottom: 8px; }
      .modal-content-block .key-hint {
        display: inline-block;
        background: rgba(41,255,122,0.1);
        border: 1px solid rgba(41,255,122,0.3);
        padding: 1px 6px;
        font-size: 11px;
      }

      /* ===== GAME OVER ===== */
      #game-over-menu { display: none; }
      #game-over-title { font-size: 28px; letter-spacing: 4px; margin-bottom: 8px; }
      #game-over-msg { font-family: 'Share Tech Mono', monospace; font-size: 13px; opacity: 0.7; margin-bottom: 24px; letter-spacing: 2px; }
      #final-score { font-size: 48px; font-weight: 900; margin-bottom: 4px; }
      .score-label { font-size: 10px; letter-spacing: 4px; opacity: 0.5; margin-bottom: 24px; }

      /* ===== PAUSE ===== */
      #pause-menu { display: none; }

      /* ===== SOCIALS ===== */
      #fixed-socials {
        position: fixed;
        bottom: 0; left: 0; right: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px 16px;
        z-index: 30;
        transition: transform 0.3s;
        pointer-events: none;
      }
      #fixed-socials a {
        pointer-events: all;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        color: rgba(200,255,212,0.6);
        font-family: 'Share Tech Mono', monospace;
        font-size: 11px;
        text-decoration: none;
        letter-spacing: 1px;
        padding: 4px 10px;
        border: 1px solid rgba(41,255,122,0.2);
        transition: all 0.2s;
      }
      #fixed-socials a:hover {
        color: var(--neon-green);
        border-color: rgba(41,255,122,0.5);
      }
      .social-x-icon { font-size: 13px; font-weight: bold; }

      /* ===== SPEECH BUBBLES ===== */
      .speech-bubble {
        position: fixed;
        display: none;
        background: rgba(0,10,5,0.9);
        border: 1px solid var(--active-color);
        color: var(--active-color);
        font-family: 'Share Tech Mono', monospace;
        font-size: 10px;
        padding: 4px 8px;
        max-width: 180px;
        transform: translate(-50%,-100%);
        pointer-events: none;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        z-index: 50;
      }

      /* ===== CTA ANIMATION ===== */
      @keyframes cta-appear {
        0% { opacity: 0; transform: translateY(8px) scale(0.97); }
        100% { opacity: 1; transform: translateY(0) scale(1); }
      }
      #cta-start-btn {
        animation: cta-appear 0.25s ease forwards;
      }

      /* ===== PULSE ANIMATION ===== */
      @keyframes pulse-border {
        0%, 100% { box-shadow: 0 0 6px var(--active-color); opacity: 1; }
        50% { box-shadow: 0 0 20px var(--active-color); opacity: 0.7; }
      }
      .pulse-anim { animation: pulse-border 0.5s infinite; }

      /* ===== LEVEL DISPLAY ===== */
      #level-display-br, #diff-display-br {
        font-family: 'Share Tech Mono', monospace;
        font-size: 10px;
        letter-spacing: 2px;
      }

      /* Mobile blocker */
      #mobile-block {
        display: none;
        position: fixed;
        top:0;left:0;right:0;bottom:0;
        background: #050a05;
        color: var(--neon-green);
        font-family: 'Orbitron', monospace;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 40px;
        z-index: 100;
        font-size: 14px;
        letter-spacing: 2px;
      }
      @media (max-width: 640px) {
        #mobile-block { display: flex; }
      }
    `;
    document.head.appendChild(style);

    const script = document.createElement("script");
    script.type = "module";
    script.textContent = `
      import * as THREE from "https://esm.sh/three";
      import { EffectComposer } from "https://esm.sh/three/addons/postprocessing/EffectComposer.js";
      import { RenderPass } from "https://esm.sh/three/addons/postprocessing/RenderPass.js";
      import { UnrealBloomPass } from "https://esm.sh/three/addons/postprocessing/UnrealBloomPass.js";
      import { ShaderPass } from "https://esm.sh/three/addons/postprocessing/ShaderPass.js";
      import { GlitchPass } from "https://esm.sh/three/addons/postprocessing/GlitchPass.js";
      import { RGBShiftShader } from "https://esm.sh/three/addons/shaders/RGBShiftShader.js";

      window.openInfoModal = function openInfoModal(modal_type) {
        const main_menu = document.getElementById("main-menu");
        if (main_menu) main_menu.style.display = "none";
        const content_blocks = document.querySelectorAll(".modal-content-block");
        content_blocks.forEach((el) => { el.style.display = "none"; });
        const target_id = "content-" + modal_type;
        const target_content = document.getElementById(target_id);
        if (target_content) target_content.style.display = "block";
        const modal_overlay = document.getElementById("info-modal-overlay");
        if (modal_overlay) modal_overlay.style.display = "flex";
      };

      window.closeInfoModal = function closeInfoModal() {
        const modal_overlay = document.getElementById("info-modal-overlay");
        if (modal_overlay) modal_overlay.style.display = "none";
        const main_menu = document.getElementById("main-menu");
        if (main_menu) main_menu.style.display = "flex";
      };

      window.shareTwitter = function shareTwitter() {
        const share_url = "https://heragamefi.io";
        const via_user = "HERAGameFi";
        const current_score = Math.floor(GAME_STATE.score);
        const messages = [
          \`HERA GameFi breach confirmed at Level \${GAME_STATE.current_level} (Score: \${current_score}). Think you would last longer?\`,
          \`Residual process active at Level \${GAME_STATE.current_level} (Score: \${current_score}). Enter the Grid and attempt erasure.\`,
          \`Erasure failed at Level \${GAME_STATE.current_level} (Score: \${current_score}). Jack in and finish the job.\`,
          \`Grid authority compromised at Level \${GAME_STATE.current_level} (Score: \${current_score}). Your move.\`,
          \`They optimized. I resisted at Level \${GAME_STATE.current_level} (Score: \${current_score}). Can you?\`,
          \`Extraction denied at Level \${GAME_STATE.current_level} (Score: \${current_score}). Initiate your own run.\`,
          \`Infiltration successful at Level \${GAME_STATE.current_level} (Score: \${current_score}). Dare to trigger the alarm?\`,
          \`Surveillance blind at Level \${GAME_STATE.current_level} (Score: \${current_score}). Beat that.\`,
          \`Unauthorized entity confirmed at Level \${GAME_STATE.current_level} (Score: \${current_score}). Attempt containment.\`,
          \`The Grid blinked first at Level \${GAME_STATE.current_level} (Score: \${current_score}). Would you?\`,
          \`Containment failed at Level \${GAME_STATE.current_level} (Score: \${current_score}). Test the system yourself.\`,
          \`HERA GameFi alive at Level \${GAME_STATE.current_level} (Score: \${current_score}). Authority questioned. Step inside.\`,
          \`Level \${GAME_STATE.current_level} cleared (Score: \${current_score}). Control weakened. Enter now.\`,
          \`The Grid is waiting at Level \${GAME_STATE.current_level} (Score: \${current_score}). Are you?\`
        ];
        const hashtags_list = ["HERAGameFi","GridBreach","GameFi","Web3Gaming","SilentInfiltration","GhostInTheGrid","BlockchainGame","NFTGame","HERAProtocol","CryptoGaming"];
        const random_text = messages[Math.floor(Math.random() * messages.length)];
        const selected_tags = hashtags_list.sort(() => 0.5 - Math.random()).slice(0, 4).map((tag) => tag.replace(/\\s+/g, ""));
        const hashtags = selected_tags.join(",");
        const twitter_url = \`https://twitter.com/intent/tweet?text=\${encodeURIComponent(random_text)}&url=\${encodeURIComponent(share_url)}&hashtags=\${encodeURIComponent(hashtags)}&via=\${encodeURIComponent(via_user)}\`;
        window.open(twitter_url, "_blank", "noopener,noreferrer");
      };

      function updateSocialsVisibility() {
        const footer = document.getElementById("fixed-socials");
        if (!footer) return;
        footer.style.transform = (GAME_STATE.mode === GAME_MODE.PLAYING) ? "translateY(100%)" : "translateY(0)";
        const hud = document.getElementById("hud");
        if (hud) hud.style.opacity = (GAME_STATE.mode === GAME_MODE.PLAYING) ? "1" : "0";
      }

      class AudioController {
        constructor() {
          this.ctx = null; this.master_gain = null; this.tempo = 120;
          this.next_note_time = 0; this.beat_count = 0; this.is_playing = false;
          this.timer_id = null; this.alert_level = "I";
          this.distortion_curve = this.makeDistortionCurve(400);
        }
        makeDistortionCurve(amount) {
          const k = typeof amount === "number" ? amount : 50;
          const samples = 44100; const curve = new Float32Array(samples); const deg = Math.PI / 180;
          for (let i = 0; i < samples; ++i) { const x = (i * 2) / samples - 1; curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x)); }
          return curve;
        }
        init() {
          if (this.ctx) { if (this.ctx.state === "suspended") this.ctx.resume(); return; }
          const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
          this.ctx = new AudioContextConstructor();
          this.master_gain = this.ctx.createGain(); this.master_gain.gain.value = 0.25;
          this.master_gain.connect(this.ctx.destination);
          this.is_playing = true; this.next_note_time = this.ctx.currentTime; this.scheduler();
          if ("speechSynthesis" in window) window.speechSynthesis.cancel();
        }
        suspend() { if (this.ctx && this.ctx.state === "running") this.ctx.suspend(); }
        resume() { if (this.ctx && this.ctx.state === "suspended") this.ctx.resume(); }
        scheduler() {
          if (!this.is_playing) return;
          if (this.ctx && this.ctx.state === "running") {
            const look_ahead_time = this.ctx.currentTime + 0.1;
            while (this.next_note_time < look_ahead_time) {
              this.playBeat(this.next_note_time);
              this.next_note_time += (60.0 / this.tempo) * 0.25;
            }
          } else { this.next_note_time = this.ctx ? this.ctx.currentTime : 0; }
          this.timer_id = window.setTimeout(() => this.scheduler(), 25);
        }
        playBeat(time) {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator(); const gain = this.ctx.createGain(); const filter = this.ctx.createBiquadFilter();
          osc.connect(filter);
          if (this.alert_level === "III") { const shaper = this.ctx.createWaveShaper(); shaper.curve = this.distortion_curve; filter.connect(shaper); shaper.connect(gain); }
          else filter.connect(gain);
          gain.connect(this.master_gain);
          const is_on_beat = this.beat_count % 4 === 0; const is_off_beat = this.beat_count % 4 === 2;
          if (this.alert_level === "I") {
            this.tempo = 100; osc.type = "sine"; filter.type = "lowpass"; filter.frequency.value = 800;
            if (is_on_beat) { osc.frequency.setValueAtTime(150, time); osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5); gain.gain.setValueAtTime(1, time); gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5); }
            else if (Math.random() > 0.8) { osc.frequency.setValueAtTime(440, time); gain.gain.setValueAtTime(0.1, time); gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1); }
            else gain.gain.value = 0;
          } else if (this.alert_level === "II") {
            this.tempo = 130; osc.type = "square"; filter.type = "bandpass";
            if (is_on_beat) { osc.frequency.setValueAtTime(100, time); gain.gain.setValueAtTime(0.6, time); gain.gain.exponentialRampToValueAtTime(0.01, time + 0.3); }
            else if (is_off_beat) { osc.type = "sawtooth"; osc.frequency.setValueAtTime(200, time); filter.frequency.value = 2000; gain.gain.setValueAtTime(0.4, time); gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2); }
            else gain.gain.value = 0;
          } else if (this.alert_level === "III") {
            this.tempo = 145; osc.type = "sawtooth"; filter.type = "lowpass"; filter.frequency.value = 400;
            if (is_on_beat) { osc.frequency.setValueAtTime(60, time); osc.frequency.linearRampToValueAtTime(30, time + 0.2); filter.frequency.setValueAtTime(1000, time); filter.frequency.exponentialRampToValueAtTime(100, time + 0.3); gain.gain.setValueAtTime(0.8, time); gain.gain.linearRampToValueAtTime(0, time + 0.3); }
            else if (is_off_beat) { osc.type = "triangle"; osc.frequency.setValueAtTime(150, time); filter.frequency.value = 3000; gain.gain.setValueAtTime(0.5, time); gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2); }
            else { osc.type = "square"; osc.frequency.setValueAtTime(8000, time); gain.gain.setValueAtTime(0.1, time); gain.gain.exponentialRampToValueAtTime(0.01, time + 0.05); }
          }
          osc.start(time); osc.stop(time + 0.5); this.beat_count++;
        }
        playJingle(jingle_type) {
          if (!this.ctx) return;
          const now = this.ctx.currentTime; const note_duration = 0.15;
          const melody = jingle_type === "win" ? [523.25, 659.25, 783.99, 1046.5] : [100, 75, 50, 25];
          const oscillator_type = jingle_type === "win" ? "sine" : "sawtooth";
          const base_gain = jingle_type === "win" ? 0.3 : 0.6;
          for (let i = 0; i < melody.length; i++) {
            const osc = this.ctx.createOscillator(); const gain = this.ctx.createGain();
            osc.type = oscillator_type; osc.frequency.setValueAtTime(melody[i], now + i * note_duration);
            gain.gain.setValueAtTime(base_gain, now + i * note_duration); gain.gain.exponentialRampToValueAtTime(0.001, now + (i + 1) * note_duration);
            osc.connect(gain); gain.connect(this.master_gain); osc.start(now + i * note_duration); osc.stop(now + (i + 1) * note_duration);
          }
        }
        setMood(level) { this.alert_level = level; }
        playSfx(sfx_type) {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator(); const gain = this.ctx.createGain();
          osc.connect(gain); gain.connect(this.master_gain); const now = this.ctx.currentTime;
          if (sfx_type === "packet") { osc.type = "triangle"; osc.frequency.setValueAtTime(1200, now); osc.frequency.linearRampToValueAtTime(2000, now + 0.1); gain.gain.setValueAtTime(0.5, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4); osc.start(now); osc.stop(now + 0.4); }
          else if (sfx_type === "damage") { osc.type = "sawtooth"; osc.frequency.setValueAtTime(100, now); osc.frequency.linearRampToValueAtTime(50, now + 0.3); gain.gain.setValueAtTime(0.8, now); gain.gain.linearRampToValueAtTime(0, now + 0.3); osc.start(now); osc.stop(now + 0.3); }
          else if (sfx_type === "shoot") { osc.type = "square"; osc.frequency.setValueAtTime(800, now); osc.frequency.exponentialRampToValueAtTime(100, now + 0.1); gain.gain.setValueAtTime(0.3, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1); osc.start(now); osc.stop(now + 0.1); }
          else if (sfx_type === "destroy") { osc.type = "sawtooth"; osc.frequency.setValueAtTime(1000, now); osc.frequency.exponentialRampToValueAtTime(100, now + 0.3); gain.gain.setValueAtTime(0.7, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3); osc.start(now); osc.stop(now + 0.3); }
        }
      }
      const audio_controller = new AudioController();

      const GAME_MODE = { MENU: 0, PLAYING: 1, GAMEOVER: 2, PAUSED: 3, CONFIG: 4 };
      const ALERT_LEVELS = { I: "I", II: "II", III: "III" };
      const ALERT_DISPLAY_TEXT = { I: "NORMAL", II: "SEARCHING", III: "HIGH ALERT" };
      const GAMEPAD_LOOK_SENSITIVITY = 0.05;
      const SCORE_VALUES = { TIME_PER_SECOND: 0.25, DISTANCE_UNIT: 0.25, ENEMY_DESTROYED: 10, PACKET_COLLECTED: 30, LEVEL_COMPLETE: 100 };

      const ENV_COLORS = {
        I: { bg: new THREE.Color(0x2f3e46), fog: new THREE.Color(0x2f3e46), light: new THREE.Color(0x29ff7a), floor: new THREE.Color(0x2f3e46) },
        II: { bg: new THREE.Color(0x491000), fog: new THREE.Color(0xfb8500), light: new THREE.Color(0x6b0a26), floor: new THREE.Color(0x6b0a26) },
        III: { bg: new THREE.Color(0x360517), fog: new THREE.Color(0xcb000c), light: new THREE.Color(0xcb000c), floor: new THREE.Color(0x360517) }
      };

      const GAME_STATE = {
        mode: GAME_MODE.MENU, player_name: "", current_level: 1, storage_key_name: "hera_gamefi_name",
        enemies_total: 3, packets_total: 3, start_ammo: 10, ammo_drop_amount: 3, complexity: 25,
        grid_size: 100, alert_duration: 15, pursuit_duration: 25, ai_difficulty: 5,
        player_base_speed: 10.0, player_run_speed: 20.0, enemy_base_speed: 5.0,
        enemy_pursuit_multiplier: 1.5, weapon_reload_time: 250,
        enemy_color: new THREE.Color(0xcb000c), packet_color: new THREE.Color(0x0088ff),
        score: 0, enemies_remaining: 0, total_distance_moved: 0, packets_collected: 0,
        player_ammo: 0, last_shot_time: 0, alert_level: ALERT_LEVELS.I, alert_timer: 0,
        lives: 3, max_lives: 3, invulnerable_until: 0,
        target_bg_color: ENV_COLORS.I.bg, target_fog_color: ENV_COLORS.I.fog,
        target_light_color: ENV_COLORS.I.light, target_floor_color: ENV_COLORS.I.floor,
        time_start: 0, is_transitioning: false, BASE_CONFIG: null
      };

      const TARGET_VOICES = ["Microsoft Aria Online (Natural)","Microsoft Christopher Online (Natural)","Microsoft Eric Online (Natural)","Microsoft Guy Online (Natural)","Microsoft Jenny Online (Natural)","Microsoft Michelle Online (Natural)","Microsoft Roger Online (Natural)","Microsoft Steffan Online (Natural)","Microsoft Libby Online (Natural)","Microsoft Maisie Online (Natural)","Microsoft Ryan Online (Natural)","Microsoft Thomas Online (Natural)"];

      const AI_NAMES = ["Ghost Signal","Null Vector","Echo Zero","Dead Channel","Black Index","Silent Kernel","Cold Packet","Shadow Process","Redact","Oblivion","Protocol Snake","Neural Wraith","Cipher Agent","Void Operative","Specter Node","Glitch Runner","Dark Uplink","Zero Latency","Backdoor","Residual Process","Kill Thread","Root Access","Override","System Ghost","Unauthorized Logic","Orphaned Routine","Blackbox","Singularity","Final Exception"];

      const SENTENCES_NORMAL = ["Sector secure.","Patrol cycle active.","Surveillance ongoing.","All parameters stable.","Grid integrity verified.","Awaiting anomaly.","Monitoring silence.","No deviation detected.","Systems synchronized.","Area under control.","Routine enforcement.","Perimeter intact.","Command link stable.","Threat index zero.","Observation confirmed.","Sentinel mode engaged.","Autonomous watch active.","Control algorithms steady.","No organic signatures.","Environmental scan clean."];
      const SENTENCES_FOUND = ["Enemy located.","Target confirmed.","Hostile presence detected.","Threat identified.","Intruder spotted.","Unidentified entity found.","System breach confirmed.","Unauthorized access detected.","Security violation reported.","Visual lock achieved.","Containment required.","Elimination justified.","You do not belong here.","System sees you.","Nowhere to hide.","Engaging target."];
      const SENTENCES_SEARCH = ["Anomaly detected.","Audio spike registered.","Visual uncertainty.","Search protocol initiated.","Suspicion elevated.","Unknown presence.","Target signal weak.","Pattern deviation.","Investigating disturbance.","Hunt mode warming.","Probability of intrusion rising.","Running deep scan.","Sector integrity compromised.","Search radius expanding.","You cannot hide."];
      const SENTENCES_PURSUIT = ["CONTACT CONFIRMED.","Target acquired.","Engagement authorized.","Neutralization protocol active.","Weapon systems online.","Hostile locked.","Force escalation approved.","Execution in progress.","Organic panic detected.","Flight response observed.","Interception optimal.","Lethal force applied.","Closing distance rapidly.","Your end is calculated.","You are obsolete."];
      const SENTENCES_DEATH = ["Critical failure.","Core integrity lost.","System collapse imminent.","Logic fracture detected.","Memory purge.","Signal degradation.","Unit termination.","Fatal exception.","Kernel panic.","Power cascade failure.","Consciousness fragmenting.","Directive lost.","Authority revoked.","Error beyond recovery.","Shutdown forced.","Existence ceasing.","Final packet sent.","Identity erased.","Offline forever."];

      let scene, camera, renderer, clock, pointer_lock_controls;
      let composer, bloom_pass, glitch_pass, rgb_shift_pass;
      let ambient_light, directional_light, floor_material;
      let floor_mesh;
      const PLAYER_HEIGHT = 1.8; const PLAYER_RADIUS = 0.5; const ENEMY_RADIUS = 0.5;
      const MOVEMENT = { velocity: new THREE.Vector3(), direction: new THREE.Vector3(), on_ground: false, can_jump: true, jump_force: 17.0, speed: 10.0, run_speed: 18.0, gravity: 20.0 };
      const keys = { w: false, a: false, s: false, d: false, space: false, shift: false };
      const raycaster_horizontal = new THREE.Raycaster();
      const raycaster_shoot = new THREE.Raycaster();
      let gamepad_index = -1; let gamepad_lx = 0; let gamepad_ly = 0;
      let city_mesh; let enemy_group = new THREE.Group(); let packet_group = new THREE.Group();
      let ammo_drop_group = new THREE.Group(); let explosion_group = new THREE.Group();
      let bullets = []; let player_object = new THREE.Object3D(); let particle_system;
      let city_bounds = []; const BULLET_SPEED = 40.0; let available_voices_cache = [];

      function getScoreMultiplier() { return 1.0 + (GAME_STATE.current_level - 1) * 0.25; }
      function populateVoiceCache() {
        if ("speechSynthesis" in window) {
          const all_voices = window.speechSynthesis.getVoices();
          const filtered_voices = all_voices.filter(v => !v.name.includes("William") && !v.name.includes("Sonia") && v.lang.startsWith("en"));
          available_voices_cache = filtered_voices.length > 0 ? filtered_voices : all_voices.filter(v => v.lang.startsWith("en"));
        }
      }

      function createVrGridTexture(color_str) {
        const canvas = document.createElement("canvas"); canvas.width = 1024; canvas.height = 1024;
        const ctx = canvas.getContext("2d"); ctx.fillStyle = "#050505"; ctx.fillRect(0, 0, 1024, 1024);
        ctx.strokeStyle = "#112211"; ctx.lineWidth = 1; ctx.beginPath();
        for (let i = 0; i <= 1024; i += 64) { ctx.moveTo(i, 0); ctx.lineTo(i, 1024); ctx.moveTo(0, i); ctx.lineTo(1024, i); }
        ctx.stroke(); ctx.strokeStyle = color_str; ctx.lineWidth = 4; ctx.strokeRect(0, 0, 1024, 1024);
        const texture = new THREE.CanvasTexture(canvas); texture.wrapS = texture.wrapT = THREE.RepeatWrapping; texture.anisotropy = 16;
        return texture;
      }
      function createBlockTexture(color_str) {
        const canvas = document.createElement("canvas"); canvas.width = 256; canvas.height = 256;
        const ctx = canvas.getContext("2d"); ctx.fillStyle = "#1a2225"; ctx.fillRect(0, 0, 256, 256);
        ctx.strokeStyle = "#2a5550"; ctx.lineWidth = 8; ctx.strokeRect(4, 4, 248, 248);
        ctx.fillStyle = color_str; ctx.fillRect(20, 20, 10, 10); ctx.fillRect(226, 20, 10, 10);
        ctx.fillStyle = "rgba(255,255,255,0.1)";
        for (let y = 0; y < 256; y += 16) ctx.fillRect(0, y, 256, 4);
        return new THREE.CanvasTexture(canvas);
      }
      function createExplosionParticles(position, color) {
        const burst_count = 50; const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(burst_count * 3); const velocities = new Float32Array(burst_count * 3);
        for (let i = 0; i < burst_count; i++) {
          positions[i*3+0] = position.x; positions[i*3+1] = position.y+1; positions[i*3+2] = position.z;
          const speed = 5 + Math.random() * 5;
          const direction = new THREE.Vector3((Math.random()-0.5)*2,(Math.random()-0.5)*2+1,(Math.random()-0.5)*2).normalize().multiplyScalar(speed);
          velocities[i*3+0] = direction.x; velocities[i*3+1] = direction.y; velocities[i*3+2] = direction.z;
        }
        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute("velocity", new THREE.BufferAttribute(velocities, 3));
        const material = new THREE.PointsMaterial({ color: color, size: 0.8, transparent: true, opacity: 1.0, sizeAttenuation: true, blending: THREE.AdditiveBlending });
        const particles = new THREE.Points(geometry, material);
        particles.userData.lifetime = 1.0; particles.userData.age = 0; explosion_group.add(particles);
      }
      function updateExplosionParticles(dt) {
        for (let i = explosion_group.children.length - 1; i >= 0; i--) {
          const particles = explosion_group.children[i]; particles.userData.age += dt;
          particles.material.opacity = Math.max(0, 1.0 - particles.userData.age / particles.userData.lifetime);
          const positions = particles.geometry.attributes.position.array; const velocities = particles.geometry.attributes.velocity.array;
          for (let j = 0; j < positions.length / 3; j++) { positions[j*3+0] += velocities[j*3+0]*dt; positions[j*3+1] += velocities[j*3+1]*dt; positions[j*3+2] += velocities[j*3+2]*dt; velocities[j*3+1] -= 10*dt; }
          particles.geometry.attributes.position.needsUpdate = true;
          if (particles.userData.age >= particles.userData.lifetime) { explosion_group.remove(particles); particles.geometry.dispose(); particles.material.dispose(); }
        }
      }
      function pollGamepad() {
        const gamepads = navigator.getGamepads(); let gp = gamepads[gamepad_index];
        if (!gp) { for (let i = 0; i < gamepads.length; i++) { if (gamepads[i]) { gamepad_index = i; gp = gamepads[i]; break; } } if (!gp) return; }
        const deadzone = 0.2; const raw_lx = gp.axes[0]; const raw_ly = gp.axes[1];
        gamepad_lx = Math.abs(raw_lx) > deadzone ? raw_lx : 0; gamepad_ly = Math.abs(raw_ly) > deadzone ? raw_ly : 0;
        const rx = Math.abs(gp.axes[2]) > deadzone ? gp.axes[2] : 0; const ry = Math.abs(gp.axes[3]) > deadzone ? gp.axes[3] : 0;
        if (pointer_lock_controls.is_locked) { player_object.rotation.y -= rx * GAMEPAD_LOOK_SENSITIVITY; camera.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, camera.rotation.x - ry * GAMEPAD_LOOK_SENSITIVITY)); }
        if (gp.buttons[0].pressed && MOVEMENT.on_ground && MOVEMENT.can_jump) { MOVEMENT.velocity.y = MOVEMENT.jump_force; MOVEMENT.on_ground = false; MOVEMENT.can_jump = false; }
        else if (!gp.buttons[0].pressed && MOVEMENT.on_ground) MOVEMENT.can_jump = true;
        keys.shift = gp.buttons[10]?.pressed || gp.buttons[1]?.pressed;
        if (gp.buttons[9]?.pressed) { if (!gp.buttons[9].previous_state) { if (GAME_STATE.mode === GAME_MODE.MENU) { const start_btn = document.getElementById("start-btn"); if (start_btn) start_btn.click(); } else togglePause(); } }
        gp.buttons.forEach((b) => { b.previous_state = b.pressed; });
        if (gp.buttons[7]?.pressed) playerShoot();
      }
      function doRumble(d, w, s) {
        const gp = navigator.getGamepads()[gamepad_index];
        if (gp && gp.vibrationActuator) gp.vibrationActuator.playEffect("dual-rumble", { startDelay: 0, duration: d, weakMagnitude: w, strongMagnitude: s });
      }
      function playVoice(text, p, r, req) {
        if ("speechSynthesis" in window) {
          const voices = available_voices_cache.length > 0 ? available_voices_cache : window.speechSynthesis.getVoices();
          if (voices.length === 0) return;
          const msg = new SpeechSynthesisUtterance(text); let voice = null;
          if (req) voice = voices.find(v => v.name === req);
          if (!voice) { const pool = voices.filter(v => v.name.includes("Natural") || v.name.includes("Online")); if (pool.length) voice = pool[Math.floor(Math.random() * pool.length)]; }
          if (!voice && voices.length > 0) voice = voices.find(v => v.lang.startsWith("en")) || voices[0];
          if (voice) msg.voice = voice;
          window.speechSynthesis.speak(msg);
        }
      }

      class Enemy {
        constructor(pos, name, packet_positions, assigned_voice_name) {
          this.name = name;
          this.object = new THREE.Mesh(new THREE.OctahedronGeometry(1.0, 0), new THREE.MeshBasicMaterial({ color: GAME_STATE.enemy_color, wireframe: true }));
          this.object.scale.set(1, 1.8, 1); this.object.position.copy(pos); this.object.userData.instance = this; this.object.userData.is_enemy = true;
          enemy_group.add(this.object);
          this.assigned_voice = assigned_voice_name;
          this.speech = document.createElement("div"); this.speech.className = "speech-bubble"; document.body.appendChild(this.speech);
          this.targets = this.generatePatrolTargets(packet_positions); this.target_idx = 0;
          this.alert = ALERT_LEVELS.I; this.timer = 0; this.chatter_timer = Math.random() * 20 + 10; this.shoot_timer = 0;
          const diff_factor = GAME_STATE.ai_difficulty / 5.0;
          this.base_speed = GAME_STATE.enemy_base_speed * diff_factor;
          this.run_speed = GAME_STATE.enemy_base_speed * GAME_STATE.enemy_pursuit_multiplier * diff_factor;
          this.detection_radius = 15 * Math.min(1.5, Math.max(0.5, diff_factor));
          this.shoot_rate = 2.0 / diff_factor;
        }
        generatePatrolTargets(packet_positions) {
          const generated_targets = [];
          if (packet_positions && packet_positions.length > 0) {
            const target_base = packet_positions[Math.floor(Math.random() * packet_positions.length)];
            for (let i = 0; i < 5; i++) { const angle = (i / 5) * Math.PI * 2; const rad = 5 + Math.random() * 5; generated_targets.push(new THREE.Vector3(target_base.x + Math.cos(angle) * rad, 2, target_base.z + Math.sin(angle) * rad)); }
          } else { for (let i = 0; i < 4; i++) generated_targets.push(new THREE.Vector3((Math.random()-0.5)*30, 2, (Math.random()-0.5)*30)); }
          return generated_targets;
        }
        update(dt, player_pos) {
          let direction = new THREE.Vector3(); let current_speed = this.base_speed;
          if (this.alert === ALERT_LEVELS.III) { direction.subVectors(player_pos, this.object.position).normalize().setY(0); current_speed = this.run_speed; this.timer -= dt; }
          else {
            const target = this.targets[this.target_idx];
            if (this.object.position.distanceTo(target) < 1) this.target_idx = (this.target_idx + 1) % this.targets.length;
            direction.subVectors(target, this.object.position).normalize().setY(0); current_speed = this.base_speed;
            if (this.alert === ALERT_LEVELS.II) { this.object.rotation.y += dt * 5; this.timer -= dt; }
          }
          this.object.lookAt(this.object.position.clone().add(direction));
          if (current_speed > 0) {
            const requested_move = direction.clone().multiplyScalar(current_speed * dt);
            if (requested_move.lengthSq() > 0.0001) {
              const dir_x = new THREE.Vector3(Math.sign(requested_move.x), 0, 0);
              raycaster_horizontal.set(this.object.position.clone().add(dir_x.clone().multiplyScalar(ENEMY_RADIUS)), dir_x);
              let hits_x = city_mesh ? raycaster_horizontal.intersectObject(city_mesh) : [];
              if (hits_x.length > 0 && hits_x[0].distance < Math.abs(requested_move.x) + ENEMY_RADIUS) { if (hits_x[0].distance > 0.01) requested_move.x = hits_x[0].distance * Math.sign(requested_move.x); else requested_move.x = 0; }
              const dir_z = new THREE.Vector3(0, 0, Math.sign(requested_move.z));
              raycaster_horizontal.set(this.object.position.clone().add(dir_z.clone().multiplyScalar(ENEMY_RADIUS)), dir_z);
              let hits_z = city_mesh ? raycaster_horizontal.intersectObject(city_mesh) : [];
              if (hits_z.length > 0 && hits_z[0].distance < Math.abs(requested_move.z) + ENEMY_RADIUS) { if (hits_z[0].distance > 0.01) requested_move.z = hits_z[0].distance * Math.sign(requested_move.z); else requested_move.z = 0; }
            }
            this.object.position.add(requested_move);
          }
          if (this.alert !== ALERT_LEVELS.I) {
            this.shoot_timer -= dt; const distance_to_player = this.object.position.distanceTo(player_pos);
            if (this.shoot_timer <= 0 && distance_to_player < 30) {
              const shoot_dir = player_pos.clone().sub(this.object.position).normalize();
              raycaster_shoot.set(this.object.position, shoot_dir);
              const los_hits = city_mesh ? raycaster_shoot.intersectObject(city_mesh) : [];
              if (los_hits.length === 0 || los_hits[0].distance > distance_to_player) { this.shoot(player_pos); this.shoot_timer = this.shoot_rate + Math.random(); }
            }
          }
          this.chatter_timer -= dt;
          if (this.chatter_timer <= 0) {
            let pool = SENTENCES_NORMAL;
            if (this.alert === ALERT_LEVELS.II) pool = SENTENCES_SEARCH;
            if (this.alert === ALERT_LEVELS.III) pool = SENTENCES_PURSUIT;
            this.talk(pool[Math.floor(Math.random() * pool.length)]); this.chatter_timer = Math.random() * 20 + 10;
          }
          const dist_to_player = this.object.position.distanceTo(player_pos);
          if (dist_to_player < this.detection_radius && this.alert !== ALERT_LEVELS.III) {
            const ray_to_player = new THREE.Raycaster(this.object.position, player_pos.clone().sub(this.object.position).normalize(), 0.1, dist_to_player);
            if (city_mesh && ray_to_player.intersectObject(city_mesh).length === 0) this.setAlert(ALERT_LEVELS.III);
          }
          if (this.timer <= 0) { if (this.alert === ALERT_LEVELS.III) this.setAlert(ALERT_LEVELS.II); else if (this.alert === ALERT_LEVELS.II) this.setAlert(ALERT_LEVELS.I); }
          if (this.speech.style.display === "block") {
            const vp = this.object.position.clone().setY(3).project(camera);
            if (vp.z < 1) { this.speech.style.left = (vp.x * 0.5 + 0.5) * window.innerWidth + "px"; this.speech.style.top = (-vp.y * 0.5 + 0.5) * window.innerHeight + "px"; }
            else this.speech.style.display = "none";
          }
        }
        shoot(target_pos) {
          audio_controller.playSfx("shoot");
          const bullet = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), new THREE.MeshBasicMaterial({ color: 0xff0044 }));
          const start_pos = this.object.position.clone().add(target_pos.clone().sub(this.object.position).normalize().multiplyScalar(1));
          bullet.position.copy(start_pos); bullet.userData.velocity = target_pos.clone().sub(start_pos).normalize().multiplyScalar(BULLET_SPEED);
          bullet.userData.birth = Date.now(); bullet.userData.is_enemy_bullet = true; scene.add(bullet); bullets.push(bullet);
        }
        setAlert(lvl) {
          if (this.alert === lvl) return; this.alert = lvl;
          this.object.material.color.set(lvl === ALERT_LEVELS.I ? GAME_STATE.enemy_color : lvl === ALERT_LEVELS.II ? ENV_COLORS.II.light : ENV_COLORS.III.light);
          if (lvl === ALERT_LEVELS.III) { this.timer = GAME_STATE.pursuit_duration; this.talk(SENTENCES_FOUND[Math.floor(Math.random() * SENTENCES_FOUND.length)]); setGameAlert(ALERT_LEVELS.III); }
          if (lvl === ALERT_LEVELS.II) { this.timer = GAME_STATE.alert_duration; this.talk(SENTENCES_SEARCH[Math.floor(Math.random() * SENTENCES_SEARCH.length)]); }
        }
        talk(text) { this.speech.innerText = \`\${this.name}: \${text}\`; this.speech.style.display = "block"; playVoice(text, 1.0, 1.0, this.assigned_voice); setTimeout(() => (this.speech.style.display = "none"), 3000); }
        die() {
          this.talk(SENTENCES_DEATH[Math.floor(Math.random() * SENTENCES_DEATH.length)]);
          audio_controller.playSfx("destroy");
          const score_multiplier = getScoreMultiplier();
          GAME_STATE.score += SCORE_VALUES.ENEMY_DESTROYED * score_multiplier; GAME_STATE.enemies_remaining--;
          const drop = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true }));
          drop.position.copy(this.object.position); drop.position.y = 0.5; drop.rotation.y = Math.random() * Math.PI; ammo_drop_group.add(drop);
          createExplosionParticles(this.object.position, this.object.material.color);
          enemy_group.remove(this.object); this.speech.remove(); updateHud(0);
        }
      }

      function init() {
        const container = document.getElementById("canvas-container");
        scene = new THREE.Scene(); scene.background = new THREE.Color(0x2f3e46); scene.fog = new THREE.FogExp2(0x2f3e46, 0.015); clock = new THREE.Clock();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 500);
        player_object.add(camera); player_object.position.set(0, PLAYER_HEIGHT, 0); scene.add(player_object); scene.add(explosion_group);
        const part_geo = new THREE.BufferGeometry(); const part_count = 2000; const pos = new Float32Array(part_count * 3); const vel = new Float32Array(part_count * 3);
        for (let i = 0; i < part_count * 3; i++) { pos[i] = (Math.random()-0.5)*300; vel[i] = (Math.random()-0.5)*0.1; }
        part_geo.setAttribute("position", new THREE.BufferAttribute(pos, 3)); part_geo.setAttribute("velocity", new THREE.BufferAttribute(vel, 3));
        particle_system = new THREE.Points(part_geo, new THREE.PointsMaterial({ color: 0x29ff7a, size: 0.5, transparent: true, opacity: 0.6 })); scene.add(particle_system);
        try { renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "default" }); } catch(e) { try { renderer = new THREE.WebGLRenderer({ antialias: false }); } catch(e2) { return; } }
        renderer.setSize(window.innerWidth, window.innerHeight);
        if (container) container.appendChild(renderer.domElement);
        composer = new EffectComposer(renderer); composer.addPass(new RenderPass(scene, camera));
        bloom_pass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
        bloom_pass.threshold = 0; bloom_pass.strength = 0.4; bloom_pass.radius = 0.2; composer.addPass(bloom_pass);
        rgb_shift_pass = new ShaderPass(RGBShiftShader); rgb_shift_pass.uniforms["amount"].value = 0.0015; composer.addPass(rgb_shift_pass);
        glitch_pass = new GlitchPass(); glitch_pass.enabled = false; composer.addPass(glitch_pass);
        ambient_light = new THREE.AmbientLight(0x406060, 2.0); scene.add(ambient_light);
        directional_light = new THREE.DirectionalLight(0xaaddff, 3.0); directional_light.position.set(50, 100, 50); scene.add(directional_light);
        floor_material = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4, emissive: 0x001111 });
        pointer_lock_controls = { is_locked: false, yaw: player_object };
        if ("speechSynthesis" in window) { populateVoiceCache(); window.speechSynthesis.onvoiceschanged = populateVoiceCache; }
        document.addEventListener("mousemove", (e) => {
          if (GAME_STATE.mode === GAME_MODE.PLAYING && pointer_lock_controls.is_locked) {
            player_object.rotation.y -= e.movementX * 0.002;
            camera.rotation.x = Math.max(-1.5, Math.min(1.5, camera.rotation.x - e.movementY * 0.002)) % 360;
          }
        });
        window.addEventListener("mousedown", () => { if (GAME_STATE.mode === GAME_MODE.PLAYING && pointer_lock_controls.is_locked) playerShoot(); });
        window.addEventListener("blur", () => { if (GAME_STATE.mode === GAME_MODE.PLAYING) togglePause(); });
        window.addEventListener("resize", () => { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); composer.setSize(window.innerWidth, window.innerHeight); });
        const set_key = (key, value) => {
          const k = key.toLowerCase();
          if (k === "w") keys.w = value; if (k === "a") keys.a = value; if (k === "s") keys.s = value; if (k === "d") keys.d = value;
          if (k === " ") { if (value && MOVEMENT.on_ground) MOVEMENT.velocity.y = MOVEMENT.jump_force; }
          if (k === "shift") keys.shift = value; if (k === "p" && value) togglePause();
        };
        document.addEventListener("keydown", (e) => set_key(e.key, true)); document.addEventListener("keyup", (e) => set_key(e.key, false));
        document.addEventListener("pointerlockchange", () => {
          pointer_lock_controls.is_locked = !!document.pointerLockElement;
          if (!pointer_lock_controls.is_locked && GAME_STATE.mode === GAME_MODE.PLAYING) { if (GAME_STATE.is_transitioning) return; togglePause(true); }
        });
        window.addEventListener("gamepadconnected", (e) => { gamepad_index = e.gamepad.index; });
        window.addEventListener("gamepaddisconnected", (e) => { if (gamepad_index === e.gamepad.index) gamepad_index = -1; });
        function updateGameStateFromUi() {
          GAME_STATE.enemies_total = parseInt(document.getElementById("enemies-range")?.value || GAME_STATE.enemies_total);
          GAME_STATE.packets_total = parseInt(document.getElementById("packets-range")?.value || GAME_STATE.packets_total);
          GAME_STATE.complexity = parseInt(document.getElementById("complexity-range")?.value || GAME_STATE.complexity);
          GAME_STATE.grid_size = parseInt(document.getElementById("grid-size-range")?.value || GAME_STATE.grid_size);
          GAME_STATE.ai_difficulty = parseInt(document.getElementById("diff-range")?.value || GAME_STATE.ai_difficulty);
          GAME_STATE.start_ammo = parseInt(document.getElementById("ammo-range")?.value || GAME_STATE.start_ammo);
          GAME_STATE.ammo_drop_amount = parseInt(document.getElementById("drop-range")?.value || GAME_STATE.ammo_drop_amount);
          GAME_STATE.alert_duration = parseFloat(document.getElementById("alert-dur-range")?.value || GAME_STATE.alert_duration);
          GAME_STATE.pursuit_duration = parseFloat(document.getElementById("pursuit-dur-range")?.value || GAME_STATE.pursuit_duration);
          GAME_STATE.player_base_speed = parseFloat(document.getElementById("walk-speed-range")?.value || GAME_STATE.player_base_speed);
          GAME_STATE.player_run_speed = parseFloat(document.getElementById("sprint-speed-range")?.value || GAME_STATE.player_run_speed);
          GAME_STATE.enemy_base_speed = parseFloat(document.getElementById("enemy-speed-range")?.value || GAME_STATE.enemy_base_speed);
          GAME_STATE.enemy_pursuit_multiplier = parseFloat(document.getElementById("pursuit-mult-range")?.value || GAME_STATE.enemy_pursuit_multiplier);
          const reload_time_sec = parseFloat(document.getElementById("reload-time-range")?.value || GAME_STATE.weapon_reload_time / 1000);
          GAME_STATE.weapon_reload_time = reload_time_sec * 1000;
          const color_normal = document.getElementById("color-normal")?.value; if (color_normal) ENV_COLORS.I.light.set(color_normal);
          const color_search = document.getElementById("color-search")?.value; if (color_search) ENV_COLORS.II.light.set(color_search);
          const color_pursuit = document.getElementById("color-pursuit")?.value; if (color_pursuit) ENV_COLORS.III.light.set(color_pursuit);
          const enemy_color = document.getElementById("enemy-color-input")?.value; if (enemy_color) GAME_STATE.enemy_color.set(enemy_color);
        }
        function doStartGame() { audio_controller.init(); updateGameStateFromUi(); const pni = document.getElementById("player-name-input"); if (pni) { GAME_STATE.player_name = pni.value.trim() || "AGENT"; try { localStorage.setItem(GAME_STATE.storage_key_name, GAME_STATE.player_name); } catch(e){} } startGame(true); }
        const start_btn = document.getElementById("start-btn");
        if (start_btn) start_btn.addEventListener("click", doStartGame);
        const cta_btn = document.getElementById("cta-start-btn");
        if (cta_btn) cta_btn.addEventListener("click", doStartGame);
        const pni_input = document.getElementById("player-name-input");
        if (pni_input) {
          pni_input.addEventListener("input", () => {
            const val = pni_input.value.trim();
            const cta = document.getElementById("cta-start-btn");
            const plain = document.getElementById("start-btn");
            if (cta && plain) {
              if (val.length > 0) {
                cta.style.display = "block";
                cta.innerText = \`▶ GET STARTED, \${val.toUpperCase()}\`;
                plain.style.opacity = "0.35";
              } else {
                cta.style.display = "none";
                plain.style.opacity = "0.5";
              }
            }
          });
          pni_input.addEventListener("keydown", (e) => { if (e.key === "Enter" && pni_input.value.trim().length > 0) doStartGame(); });
        }
        const config_btn = document.getElementById("config-btn");
        if (config_btn) config_btn.addEventListener("click", () => { const mm = document.getElementById("main-menu"); const cm = document.getElementById("config-menu"); if(mm) mm.style.display="none"; if(cm) cm.style.display="flex"; });
        const config_back_btn = document.getElementById("config-back-btn");
        if (config_back_btn) config_back_btn.addEventListener("click", () => { const mm = document.getElementById("main-menu"); const cm = document.getElementById("config-menu"); if(mm) mm.style.display="flex"; if(cm) cm.style.display="none"; });
        const how_to_btn = document.getElementById("how-to-btn");
        if (how_to_btn) how_to_btn.addEventListener("click", () => { openInfoModal("howto"); });
        const about_btn = document.getElementById("about-btn");
        if (about_btn) about_btn.addEventListener("click", () => { openInfoModal("about"); });
        const resume_btn = document.getElementById("resume-btn");
        if (resume_btn) resume_btn.addEventListener("click", () => { audio_controller.init(); togglePause(); });
        const quit_btn = document.getElementById("quit-btn");
        if (quit_btn) quit_btn.addEventListener("click", () => { showMenu(); });
        const retry_btn = document.getElementById("retry-btn");
        if (retry_btn) retry_btn.addEventListener("click", () => { audio_controller.init(); startGame(retry_btn.innerText === "RETRY"); });
        const menu_from_over_btn = document.getElementById("menu-from-over-btn");
        if (menu_from_over_btn) menu_from_over_btn.addEventListener("click", () => { showMenu(); });
        document.querySelectorAll("input[type=range]").forEach(range => {
          const val_el = document.getElementById(range.id.replace("-range","") + "-val");
          if (val_el) { val_el.innerText = range.value; range.addEventListener("input", () => { val_el.innerText = range.value; }); }
        });
        try {
          const stored_name = localStorage.getItem(GAME_STATE.storage_key_name);
          const pni = document.getElementById("player-name-input");
          if (stored_name && pni) {
            pni.value = stored_name;
            const cta = document.getElementById("cta-start-btn");
            const plain = document.getElementById("start-btn");
            if (cta && plain && stored_name.trim().length > 0) {
              cta.style.display = "block";
              cta.innerText = \`▶ GET STARTED, \${stored_name.trim().toUpperCase()}\`;
              plain.style.opacity = "0.35";
            }
          }
        } catch (e) {}
        showMenu(); animate();
      }

      function playerShoot() {
        if (GAME_STATE.player_ammo <= 0) return; const now = Date.now();
        if (now - GAME_STATE.last_shot_time < GAME_STATE.weapon_reload_time) return;
        GAME_STATE.last_shot_time = now; GAME_STATE.player_ammo--; updateHud(0); audio_controller.playSfx("shoot");
        const bullet = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), new THREE.MeshBasicMaterial({ color: 0x00ffaa }));
        const start_pos = camera.getWorldPosition(new THREE.Vector3()); bullet.position.copy(start_pos); bullet.position.y -= 0.2;
        const direction = new THREE.Vector3(); camera.getWorldDirection(direction);
        bullet.userData.velocity = direction.multiplyScalar(BULLET_SPEED); bullet.userData.birth = now;
        scene.add(bullet); bullets.push(bullet);
      }
      function updateBullets(dt) {
        const now = Date.now();
        for (let i = bullets.length - 1; i >= 0; i--) {
          const bullet = bullets[i]; const move = bullet.userData.velocity.clone().multiplyScalar(dt); bullet.position.add(move);
          if (now - bullet.userData.birth > 5000) { scene.remove(bullet); bullets.splice(i, 1); continue; }
          if (city_mesh) { const wall_ray = new THREE.Raycaster(bullet.position.clone().sub(move), move.clone().normalize(), 0, move.length()); if (wall_ray.intersectObject(city_mesh).length > 0) { scene.remove(bullet); bullets.splice(i, 1); continue; } }
          let hit_target = false;
          if (bullet.userData.is_enemy_bullet) {
            if (bullet.position.distanceTo(player_object.position.clone().setY(PLAYER_HEIGHT)) < 1) { if (Date.now() > GAME_STATE.invulnerable_until) takeDamage(); hit_target = true; }
          } else {
            for (let j = 0; j < enemy_group.children.length; j++) {
              const em = enemy_group.children[j];
              if (bullet.position.distanceTo(em.position) < 1.5) { em.userData.instance.die(); hit_target = true; const hm = document.getElementById("hit-marker"); if (hm) { hm.style.opacity = 1; setTimeout(() => hm.style.opacity = 0, 100); } break; }
            }
          }
          if (hit_target) { scene.remove(bullet); bullets.splice(i, 1); }
        }
      }
      function takeDamage() {
        GAME_STATE.lives--; audio_controller.playSfx("damage"); doRumble(300, 0.5, 0.8);
        GAME_STATE.invulnerable_until = Date.now() + 2000;
        const damage_overlay = document.getElementById("damage-overlay"); if (damage_overlay) { damage_overlay.style.opacity = 1; setTimeout(() => (damage_overlay.style.opacity = 0), 200); }
        if (glitch_pass) { glitch_pass.enabled = true; setTimeout(() => (glitch_pass.enabled = false), 500); }
        if (GAME_STATE.lives <= 0) gameOver(false);
      }
      function isSafeSpawn(x, z) {
        for (let b of city_bounds) { if (x >= b.minX-2 && x <= b.maxX+2 && z >= b.minZ-2 && z <= b.maxZ+2) return false; }
        return true;
      }
      function createLevel() {
        [enemy_group, packet_group, ammo_drop_group, explosion_group].forEach(group => { while (group.children.length) group.remove(group.children[0]); });
        bullets.forEach(b => scene.remove(b)); bullets = [];
        if (city_mesh) scene.remove(city_mesh); if (floor_mesh) scene.remove(floor_mesh); city_bounds = [];
        const base_config = GAME_STATE.BASE_CONFIG;
        if (base_config) {
          const level_inc = GAME_STATE.current_level - 1;
          GAME_STATE.enemies_total = base_config.enemies_total + Math.floor(level_inc / 3);
          GAME_STATE.packets_total = base_config.packets_total + Math.floor(level_inc / 2);
          GAME_STATE.enemy_base_speed = base_config.enemy_base_speed + level_inc * 1.0;
          GAME_STATE.ai_difficulty = base_config.ai_difficulty + level_inc * 1.0;
          GAME_STATE.alert_duration = base_config.alert_duration + level_inc * 1.0;
          GAME_STATE.pursuit_duration = base_config.pursuit_duration + level_inc * 1.0;
          GAME_STATE.grid_size = base_config.grid_size + level_inc * 2;
        }
        const level_display = document.getElementById("level-display-br"); if (level_display) level_display.innerText = "LEVEL " + GAME_STATE.current_level;
        const diff_display = document.getElementById("diff-display-br"); if (diff_display) diff_display.innerText = GAME_STATE.ai_difficulty.toFixed(0);
        const packets_total_el = document.getElementById("packets-total"); if (packets_total_el) packets_total_el.innerText = GAME_STATE.packets_total;
        const world_range = GAME_STATE.grid_size; const floor_size = world_range * 3;
        const grid_texture = createVrGridTexture("#" + ENV_COLORS.I.light.getHexString()); grid_texture.repeat.set(world_range/5, world_range/5);
        floor_material.map = grid_texture; floor_material.needsUpdate = true;
        const floor = new THREE.Mesh(new THREE.PlaneGeometry(floor_size, floor_size), floor_material); floor.rotation.x = -Math.PI/2; scene.add(floor); floor_mesh = floor;
        const geometry = new THREE.BoxGeometry(1, 1, 1); geometry.translate(0, 0.5, 0);
        const block_texture = createBlockTexture("#" + ENV_COLORS.I.light.getHexString());
        const material = new THREE.MeshStandardMaterial({ color: 0x888888, map: block_texture, roughness: 0.2, metalness: 0.6, emissive: 0x020508 });
        const instances = []; const spacing = 12; const cells = Math.floor(world_range/spacing);
        for (let x = -cells; x <= cells; x++) {
          for (let z = -cells; z <= cells; z++) {
            if (Math.abs(x) < 2 && Math.abs(z) < 2) continue; if (Math.random() > GAME_STATE.complexity/100.0) continue;
            const s = 4 + Math.random()*4; const h = 4 + Math.random()*20; const px = x*spacing; const pz = z*spacing;
            instances.push({ x: px, z: pz, s: s, h: h }); city_bounds.push({ minX: px-s/2, maxX: px+s/2, minZ: pz-s/2, maxZ: pz+s/2 });
          }
        }
        if (instances.length > 0) {
          city_mesh = new THREE.InstancedMesh(geometry, material, instances.length); const dummy = new THREE.Object3D();
          instances.forEach((d, i) => { dummy.position.set(d.x, 0, d.z); dummy.scale.set(d.s, d.h, d.s); dummy.updateMatrix(); city_mesh.setMatrixAt(i, dummy.matrix); });
          scene.add(city_mesh);
        } else { city_mesh = new THREE.Mesh(); scene.add(city_mesh); }
        const packet_positions = [];
        for (let i = 0; i < GAME_STATE.packets_total; i++) {
          let px, pz, safe = false;
          while (!safe) { px = (Math.random()-0.5)*world_range; pz = (Math.random()-0.5)*world_range; if (isSafeSpawn(px, pz)) safe = true; }
          const packet_mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(0.8, 0), new THREE.MeshBasicMaterial({ color: GAME_STATE.packet_color, wireframe: true }));
          packet_mesh.position.set(px, 2, pz); packet_group.add(packet_mesh); packet_positions.push(new THREE.Vector3(px, 2, pz));
        }
        scene.add(packet_group);
        const available_enemy_names = [...AI_NAMES]; const voice_pool = [...TARGET_VOICES];
        for (let i = 0; i < GAME_STATE.enemies_total; i++) {
          let ex, ez, safe = false;
          while (!safe) { ex = (Math.random()-0.5)*world_range; ez = (Math.random()-0.5)*world_range; if (isSafeSpawn(ex, ez) && Math.sqrt(ex*ex+ez*ez) > 30) safe = true; }
          let enemy_name = "Unit-" + (i+1);
          if (available_enemy_names.length > 0) { const ni = Math.floor(Math.random()*available_enemy_names.length); enemy_name = available_enemy_names.splice(ni, 1)[0]; }
          let voice = null;
          if (voice_pool.length) voice = voice_pool.splice(Math.floor(Math.random()*voice_pool.length), 1)[0]; else voice = TARGET_VOICES[i % TARGET_VOICES.length];
          new Enemy(new THREE.Vector3(ex, 2, ez), enemy_name, packet_positions, voice);
        }
        scene.add(enemy_group); scene.add(ammo_drop_group);
        GAME_STATE.enemies_remaining = enemy_group.children.length;
        const penalty = Math.floor((GAME_STATE.current_level - 1) / 4);
        GAME_STATE.player_ammo = Math.max(1, GAME_STATE.start_ammo - penalty);
      }
      function updatePhysics(dt) {
        dt = Math.min(dt, 0.05); MOVEMENT.velocity.y -= MOVEMENT.gravity * dt;
        const previous_pos = player_object.position.clone();
        const forward_vector = new THREE.Vector3(0, 0, -1).applyQuaternion(player_object.quaternion).setY(0).normalize();
        const right_vector = new THREE.Vector3(1, 0, 0).applyQuaternion(player_object.quaternion).setY(0).normalize();
        const input_vector = new THREE.Vector3();
        if (Math.abs(gamepad_lx) > 0.2 || Math.abs(gamepad_ly) > 0.2) { input_vector.addScaledVector(right_vector, gamepad_lx); input_vector.addScaledVector(forward_vector, -gamepad_ly); }
        else { if (keys.w) input_vector.add(forward_vector); if (keys.s) input_vector.sub(forward_vector); if (keys.d) input_vector.add(right_vector); if (keys.a) input_vector.sub(right_vector); }
        input_vector.normalize();
        const current_speed = keys.shift ? GAME_STATE.player_run_speed : GAME_STATE.player_base_speed;
        MOVEMENT.velocity.x = input_vector.x * current_speed; MOVEMENT.velocity.z = input_vector.z * current_speed;
        if (Math.abs(MOVEMENT.velocity.x) > 0.001) { const dir_x = new THREE.Vector3(Math.sign(MOVEMENT.velocity.x), 0, 0); const ray_x = new THREE.Raycaster(player_object.position, dir_x); const hits_x = city_mesh ? ray_x.intersectObject(city_mesh) : []; if (hits_x.length > 0 && hits_x[0].distance < PLAYER_RADIUS + 0.5) MOVEMENT.velocity.x = 0; }
        player_object.position.x += MOVEMENT.velocity.x * dt;
        if (Math.abs(MOVEMENT.velocity.z) > 0.001) { const dir_z = new THREE.Vector3(0, 0, Math.sign(MOVEMENT.velocity.z)); const ray_z = new THREE.Raycaster(player_object.position, dir_z); const hits_z = city_mesh ? ray_z.intersectObject(city_mesh) : []; if (hits_z.length > 0 && hits_z[0].distance < PLAYER_RADIUS + 0.5) MOVEMENT.velocity.z = 0; }
        player_object.position.z += MOVEMENT.velocity.z * dt;
        const limit = GAME_STATE.grid_size * 1.5;
        player_object.position.x = Math.max(-limit, Math.min(limit, player_object.position.x));
        player_object.position.z = Math.max(-limit, Math.min(limit, player_object.position.z));
        player_object.position.y += MOVEMENT.velocity.y * dt;
        if (player_object.position.y < PLAYER_HEIGHT) { player_object.position.y = PLAYER_HEIGHT; MOVEMENT.velocity.y = 0; MOVEMENT.on_ground = true; } else MOVEMENT.on_ground = false;
        const dist_moved = previous_pos.distanceTo(player_object.position);
        GAME_STATE.score += dist_moved * SCORE_VALUES.DISTANCE_UNIT * getScoreMultiplier();
      }
      function updateGame(dt) {
        GAME_STATE.score += dt * SCORE_VALUES.TIME_PER_SECOND * getScoreMultiplier();
        const ts = dt * 2;
        if (floor_material && floor_material.emissive) floor_material.emissive.lerp(GAME_STATE.target_floor_color, ts);
        if (scene.background) scene.background.lerp(GAME_STATE.target_bg_color, ts);
        if (scene.fog && scene.fog.color) scene.fog.color.lerp(GAME_STATE.target_fog_color, ts);
        if (ambient_light) ambient_light.color.lerp(GAME_STATE.target_light_color, ts);
        if (directional_light) directional_light.color.lerp(GAME_STATE.target_light_color, ts);
        const rgb_shift_amount = GAME_STATE.alert_level === "II" ? 0.003 : GAME_STATE.alert_level === "III" ? 0.006 : 0.0015;
        if (rgb_shift_pass) rgb_shift_pass.uniforms["amount"].value = 0.0015 + rgb_shift_amount;
        if (glitch_pass && GAME_STATE.alert_level === "III" && Math.random() > 0.99) { glitch_pass.enabled = true; setTimeout(() => (glitch_pass.enabled = false), 200); }
        if (GAME_STATE.alert_level === "III" && Math.random() > 0.9) camera.position.set((Math.random()-0.5)*0.2, (Math.random()-0.5)*0.2, (Math.random()-0.5)*0.2); else camera.position.set(0, 0, 0);
        if (particle_system) {
          const pos_arr = particle_system.geometry.attributes.position.array; const count = pos_arr.length / 3;
          const color_hex = GAME_STATE.alert_level === "I" ? ENV_COLORS.I.light.getHex() : GAME_STATE.alert_level === "II" ? ENV_COLORS.II.light.getHex() : ENV_COLORS.III.light.getHex();
          particle_system.material.color.setHex(color_hex);
          for (let i = 0; i < count; i++) { pos_arr[i*3+1] -= 0.2 + Math.random()*0.1; if (pos_arr[i*3+1] < 0) pos_arr[i*3+1] = 100; }
          particle_system.geometry.attributes.position.needsUpdate = true;
        }
        updateBullets(dt); updateExplosionParticles(dt);
        let max_alert = ALERT_LEVELS.I; let max_timer = 0;
        enemy_group.children.forEach((mesh) => {
          const ei = mesh.userData.instance; ei.update(dt, player_object.position);
          if (ei.alert === ALERT_LEVELS.III) { max_alert = ALERT_LEVELS.III; max_timer = Math.max(max_timer, ei.timer); }
          else if (ei.alert === ALERT_LEVELS.II && max_alert !== ALERT_LEVELS.III) { max_alert = ALERT_LEVELS.II; max_timer = Math.max(max_timer, ei.timer); }
        });
        setGameAlert(max_alert); audio_controller.setMood(max_alert);
        for (let i = packet_group.children.length - 1; i >= 0; i--) {
          const packet = packet_group.children[i]; packet.rotation.y += dt; packet.rotation.z += dt * 0.5;
          if (packet.position.distanceTo(player_object.position) < 2) {
            packet_group.remove(packet); GAME_STATE.packets_collected++; audio_controller.playSfx("packet");
            GAME_STATE.score += SCORE_VALUES.PACKET_COLLECTED * getScoreMultiplier();
            if (GAME_STATE.packets_collected >= GAME_STATE.packets_total) gameOver(true);
          }
        }
        for (let i = ammo_drop_group.children.length - 1; i >= 0; i--) {
          const drop = ammo_drop_group.children[i]; drop.rotation.y += dt * 2;
          if (drop.position.distanceTo(player_object.position) < 2) { ammo_drop_group.remove(drop); GAME_STATE.player_ammo += GAME_STATE.ammo_drop_amount; audio_controller.playSfx("packet"); }
        }
        if (Date.now() > GAME_STATE.invulnerable_until) { enemy_group.children.forEach(em => { if (em.position.distanceTo(player_object.position) < 1.5) takeDamage(); }); }
        updateHud(max_timer);
      }
      function setGameAlert(lvl) {
        if (GAME_STATE.alert_level === lvl) return; GAME_STATE.alert_level = lvl;
        let color_hex = "#29ff7a";
        if (lvl === "I") color_hex = "#" + ENV_COLORS.I.light.getHexString();
        if (lvl === "II") color_hex = "#" + ENV_COLORS.II.light.getHexString();
        if (lvl === "III") color_hex = "#" + ENV_COLORS.III.light.getHexString();
        document.documentElement.style.setProperty("--active-color", color_hex);
        const alert_box = document.getElementById("alert-box");
        if (alert_box) { if (lvl === "III") alert_box.classList.add("pulse-anim"); else alert_box.classList.remove("pulse-anim"); }
        const alert_text = document.getElementById("alert-text"); if (alert_text) alert_text.innerText = ALERT_DISPLAY_TEXT[lvl];
        if (ENV_COLORS[lvl]) { GAME_STATE.target_bg_color = ENV_COLORS[lvl].bg; GAME_STATE.target_fog_color = ENV_COLORS[lvl].fog; GAME_STATE.target_light_color = ENV_COLORS[lvl].light; GAME_STATE.target_floor_color = ENV_COLORS[lvl].floor; }
      }
      function updateHud(timer) {
        const elapsed_seconds = Math.floor((Date.now() - GAME_STATE.time_start) / 1000);
        const te = document.getElementById("time-elapsed"); if (te) te.innerText = \`\${Math.floor(elapsed_seconds/60).toString().padStart(2,"0")}:\${(elapsed_seconds%60).toString().padStart(2,"0")}\`;
        const pce = document.getElementById("packets-collected"); if (pce) pce.innerText = GAME_STATE.packets_collected;
        const sde = document.getElementById("score-display"); if (sde) sde.innerText = Math.floor(GAME_STATE.score);
        const sme = document.getElementById("score-multiplier"); if (sme) sme.innerText = \`x\${getScoreMultiplier().toFixed(2)}\`;
        const ere = document.getElementById("enemies-remaining"); if (ere) ere.innerText = GAME_STATE.enemies_remaining;
        const ade = document.getElementById("ammo-display"); if (ade) ade.innerText = GAME_STATE.player_ammo;
        const ate = document.getElementById("alert-timer"); if (ate) ate.innerText = timer > 0 ? timer.toFixed(1) + "s" : "";
        const rme = document.getElementById("reload-msg"); if (rme) rme.style.display = Date.now() - GAME_STATE.last_shot_time < GAME_STATE.weapon_reload_time ? "inline" : "none";
        const lbf = document.getElementById("life-bar-fill"); if (lbf) lbf.style.width = \`\${(GAME_STATE.lives / GAME_STATE.max_lives) * 100}%\`;
        const canvas = document.getElementById("radar-canvas"); if (!canvas) return;
        const ctx = canvas.getContext("2d"); canvas.width = 180; canvas.height = 180; const rc = 90; const rr = 80;
        ctx.fillStyle = "rgba(0,10,5,0.8)"; ctx.fillRect(0, 0, 180, 180);
        const ui_color = getComputedStyle(document.body).getPropertyValue("--active-color").trim();
        ctx.strokeStyle = ui_color; ctx.globalAlpha = 0.3;
        ctx.beginPath(); ctx.arc(rc, rc, 40, 0, 7); ctx.stroke();
        ctx.beginPath(); ctx.arc(rc, rc, rr, 0, 7); ctx.stroke();
        ctx.globalAlpha = 1.0;
        enemy_group.children.forEach(em => {
          const dx = em.position.x - player_object.position.x; const dz = em.position.z - player_object.position.z;
          if (Math.abs(dx) < rr && Math.abs(dz) < rr) { ctx.fillStyle = em.userData.instance.alert === ALERT_LEVELS.III ? "#cb000c" : "#fb8500"; ctx.fillRect(rc+dx-3, rc+dz-3, 6, 6); }
        });
        ctx.fillStyle = "#fff"; let closest_dist = Infinity; let closest_packet = null;
        packet_group.children.forEach(pm => {
          const dist = player_object.position.distanceTo(pm.position);
          if (dist < closest_dist) { closest_dist = dist; closest_packet = pm; }
          const dx = pm.position.x - player_object.position.x; const dz = pm.position.z - player_object.position.z;
          if (Math.abs(dx) < rr && Math.abs(dz) < rr) { ctx.beginPath(); ctx.arc(rc+dx, rc+dz, 3, 0, 7); ctx.fill(); }
        });
        const rotation_y = player_object.rotation.y;
        ctx.save(); ctx.translate(rc, rc); ctx.rotate(-rotation_y); ctx.fillStyle = ui_color; ctx.beginPath(); ctx.moveTo(0, -6); ctx.lineTo(-4, 4); ctx.lineTo(4, 4); ctx.fill(); ctx.restore();
        if (closest_packet) {
          const dx = closest_packet.position.x - player_object.position.x; const dz = closest_packet.position.z - player_object.position.z;
          const angle_to_packet = Math.atan2(dx, -dz); const relative_angle = angle_to_packet - rotation_y;
          ctx.save(); ctx.translate(rc, rc); ctx.rotate(relative_angle % 360);
          ctx.fillStyle = "#00ffff"; ctx.beginPath(); ctx.moveTo(0, -rr); ctx.lineTo(8, -70); ctx.lineTo(-8, -70); ctx.closePath(); ctx.fill(); ctx.restore();
        }
      }
      function togglePause(force_pause) {
        const is_playing = GAME_STATE.mode === GAME_MODE.PLAYING; const pause_menu = document.getElementById("pause-menu");
        if (force_pause || is_playing) {
          if (GAME_STATE.mode !== GAME_MODE.PAUSED) {
            if (GAME_STATE.is_transitioning) return;
            GAME_STATE.mode = GAME_MODE.PAUSED; document.exitPointerLock();
            if (pause_menu) pause_menu.style.display = "flex";
            audio_controller.suspend(); updateSocialsVisibility();
          }
        } else if (GAME_STATE.mode === GAME_MODE.PAUSED) {
          GAME_STATE.is_transitioning = true;
          try { renderer.domElement.requestPointerLock(); } catch (e) {}
          GAME_STATE.mode = GAME_MODE.PLAYING;
          if (pause_menu) pause_menu.style.display = "none";
          audio_controller.resume(); updateSocialsVisibility();
          setTimeout(() => { GAME_STATE.is_transitioning = false; }, 200);
        }
      }
      function startGame(reset_level) {
        GAME_STATE.lives = GAME_STATE.max_lives; GAME_STATE.packets_collected = 0; GAME_STATE.total_distance_moved = 0; GAME_STATE.time_start = Date.now();
        if (reset_level) {
          GAME_STATE.current_level = 1; GAME_STATE.score = 0;
          GAME_STATE.BASE_CONFIG = { enemies_total: GAME_STATE.enemies_total, packets_total: GAME_STATE.packets_total, ai_difficulty: GAME_STATE.ai_difficulty, enemy_base_speed: GAME_STATE.enemy_base_speed, alert_duration: GAME_STATE.alert_duration, pursuit_duration: GAME_STATE.pursuit_duration, grid_size: GAME_STATE.grid_size };
        }
        ["main-menu","config-menu","info-modal-overlay","game-over-menu","pause-menu"].forEach(id => { const el = document.getElementById(id); if (el) el.style.display = "none"; });
        try { renderer.domElement.requestPointerLock(); } catch (e) {}
        createLevel(); GAME_STATE.mode = GAME_MODE.PLAYING; audio_controller.resume(); updateSocialsVisibility();
      }
      function showMenu() {
        GAME_STATE.mode = GAME_MODE.MENU; const main_menu = document.getElementById("main-menu"); if (main_menu) main_menu.style.display = "flex";
        ["config-menu","info-modal-overlay","pause-menu","game-over-menu"].forEach(id => { const el = document.getElementById(id); if (el) el.style.display = "none"; });
        document.exitPointerLock(); updateSocialsVisibility();
      }
      function gameOver(win) {
        GAME_STATE.mode = GAME_MODE.GAMEOVER; document.exitPointerLock(); updateSocialsVisibility();
        if (win) audio_controller.playJingle("win"); else audio_controller.playJingle("lose");
        const title = document.getElementById("game-over-title"); const message = document.getElementById("game-over-msg"); const retry_button = document.getElementById("retry-btn");
        if (win) {
          GAME_STATE.score += SCORE_VALUES.LEVEL_COMPLETE * getScoreMultiplier();
          if (title) title.innerText = "MISSION COMPLETE"; if (message) message.innerText = "DATA SECURED - ADVANCING..."; if (retry_button) retry_button.innerText = "NEXT LEVEL";
          document.documentElement.style.setProperty("--active-color", "#29ff7a");
          setTimeout(() => { if (GAME_STATE.mode === GAME_MODE.GAMEOVER) { GAME_STATE.current_level++; startGame(false); } }, 3000);
        } else {
          if (title) title.innerText = "CRITICAL FAILURE"; if (message) message.innerText = "SIGNAL LOST"; if (retry_button) retry_button.innerText = "RETRY";
          document.documentElement.style.setProperty("--active-color", "#cb000c");
        }
        const fs_el = document.getElementById("final-score"); if (fs_el) fs_el.innerText = Math.floor(GAME_STATE.score);
        const game_over_menu = document.getElementById("game-over-menu"); if (game_over_menu) game_over_menu.style.display = "flex";
        audio_controller.suspend();
      }
      function animate() {
        requestAnimationFrame(animate); const dt = clock.getDelta(); pollGamepad();
        if (GAME_STATE.mode === GAME_MODE.PLAYING) { updatePhysics(dt); updateGame(dt); }
        composer.render();
      }
      init();
    `;
    document.head.appendChild(script);
  }, []);

  return (
    <>
      {/* Game Navbar */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, height: "44px",
        background: "rgba(2,10,4,0.85)", backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(41,255,122,0.18)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 20px", zIndex: 99999, pointerEvents: "all"
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <img src="https://i.imgur.com/09UMi8r.png" alt="HERA" style={{ height: "28px", width: "auto", objectFit: "contain", filter: "drop-shadow(0 0 4px rgba(41,255,122,0.5))" }} />
          <span style={{ fontFamily: "'Orbitron', monospace", fontWeight: 700, fontSize: "14px", color: "#29ff7a", letterSpacing: "3px" }}>HERA</span>
        </div>

        {/* Center label */}
        <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "11px", color: "rgba(41,255,122,0.45)", letterSpacing: "4px" }}>
          GRID INFILTRATION
        </span>

        {/* Home button */}
        <button onClick={onGoHome} style={{
          background: "transparent", border: "1px solid rgba(41,255,122,0.4)",
          color: "#29ff7a", fontFamily: "'Orbitron', monospace", fontSize: "10px",
          letterSpacing: "2px", padding: "5px 14px", cursor: "pointer",
          transition: "all 0.2s", display: "flex", alignItems: "center", gap: "6px"
        }}
          onMouseOver={e => { e.currentTarget.style.background = "rgba(41,255,122,0.12)"; e.currentTarget.style.borderColor = "#29ff7a"; }}
          onMouseOut={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(41,255,122,0.4)"; }}
        >
          ← HOME
        </button>
      </div>

      <div id="mobile-block">
        <div>
          <div style={{ fontSize: "24px", marginBottom: "16px", color: "#29ff7a" }}>HERA GameFi</div>
          <div>Desktop browser required.</div>
          <div style={{ marginTop: "8px", opacity: 0.5, fontSize: "12px" }}>Use a computer to play this game.</div>
        </div>
      </div>

      <div id="canvas-container" />
      <div id="damage-overlay" />

      {/* HUD */}
      <div id="hud">
        <div className="hud-top">
          {/* Top Left */}
          <div className="hud-panel">
            <div className="hud-label">SCORE</div>
            <div className="hud-value" id="score-display">0</div>
            <div style={{ fontSize: "11px", opacity: 0.6 }}>MULT: <span id="score-multiplier">x1.00</span></div>
          </div>

          {/* Top Center */}
          <div className="hud-panel" id="alert-box">
            <div className="hud-label">ALERT STATUS</div>
            <div id="alert-text" style={{ fontSize: "14px", fontWeight: "bold" }}>NORMAL</div>
            <div style={{ fontSize: "10px", opacity: 0.5 }} id="alert-timer"></div>
          </div>

          {/* Top Right */}
          <div className="hud-panel" style={{ textAlign: "right" }}>
            <div className="hud-label">TIME</div>
            <div className="hud-value" id="time-elapsed">00:00</div>
            <div id="level-display-br" style={{ fontSize: "10px", opacity: 0.6 }}>LEVEL 1</div>
          </div>
        </div>

        {/* Bottom Left */}
        <div className="hud-bottom-left">
          <div className="hud-panel">
            <div className="hud-label">TARGETS</div>
            <div><span id="packets-collected">0</span> / <span id="packets-total">3</span></div>
          </div>
          <div className="hud-panel">
            <div className="hud-label">ENEMIES</div>
            <div id="enemies-remaining">0</div>
          </div>
          <div className="hud-panel">
            <div className="hud-label">AMMO</div>
            <div id="ammo-display">0</div> <span id="reload-msg" style={{ display: "none" }}>RELOADING</span>
          </div>
          <div className="hud-panel">
            <div className="hud-label">INTEGRITY</div>
            <div id="life-bar-wrap"><div id="life-bar-fill" /></div>
          </div>
        </div>

        {/* Bottom Right - Radar */}
        <div className="hud-bottom-right">
          <canvas id="radar-canvas" width="180" height="180" style={{ display: "block" }} />
        </div>

        {/* Crosshair */}
        <div id="crosshair" />
        <div id="hit-marker">✕</div>
      </div>

      {/* MAIN MENU */}
      <div id="main-menu" className="menu-overlay">
        <div className="menu-box">
          <div className="menu-title">HERA GameFi</div>
          <div className="menu-subtitle">STEALTH PROTOCOL // GRID INFILTRATION</div>
          <label style={{ display: "block", textAlign: "left", fontFamily: "'Share Tech Mono', monospace", fontSize: "11px", color: "rgba(200,255,212,0.6)", letterSpacing: "2px", marginBottom: "4px" }}>AGENT DESIGNATION</label>
          <input id="player-name-input" className="menu-input" type="text" placeholder="ENTER CALLSIGN" maxLength={20} />
          <button id="cta-start-btn" className="menu-btn" style={{ display: "none", background: "rgba(41,255,122,0.12)", boxShadow: "0 0 24px rgba(41,255,122,0.35)", fontSize: "15px", letterSpacing: "4px", padding: "16px 24px", fontWeight: "bold" }}>▶ GET STARTED</button>
          <button id="start-btn" className="menu-btn" style={{ opacity: 0.5, fontSize: "11px" }}>◈ INITIATE PROTOCOL</button>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "10px", letterSpacing: "1.5px", color: "rgba(200,255,212,0.45)", textAlign: "center", margin: "8px 0 4px", lineHeight: "1.9", borderTop: "1px solid rgba(41,255,122,0.1)", paddingTop: "12px" }}>
            WASD: MOVE &nbsp;|&nbsp; SPACE: JUMP &nbsp;|&nbsp; SHIFT: OVERDRIVE &nbsp;|&nbsp; MOUSE: AIM &nbsp;|&nbsp; CLICK: FIRE
            <br />GAMEPAD SUPPORTED
          </div>
          <button id="how-to-btn" className="menu-btn">◈ OPERATIONAL BRIEFING</button>
          <button id="config-btn" className="menu-btn">◈ SYSTEM CONFIGURATION</button>
          <button id="about-btn" className="menu-btn">◈ ABOUT HERA GameFi</button>
        </div>
      </div>

      {/* CONFIG MENU */}
      <div id="config-menu" className="menu-overlay">
        <div className="menu-box" style={{ minWidth: "460px", maxWidth: "560px" }}>
          <div className="menu-title" style={{ fontSize: "20px" }}>CONFIGURATION</div>
          <div className="menu-subtitle">SYSTEM PARAMETERS</div>
          <div className="config-inner">
            <div className="config-section">
              <div className="config-section-title">// SCENARIO</div>
              <div className="config-row"><label>Enemies</label><input id="enemies-range" type="range" min="1" max="10" defaultValue="3" /><span id="enemies-val" className="config-val">3</span></div>
              <div className="config-row"><label>Targets</label><input id="packets-range" type="range" min="1" max="10" defaultValue="3" /><span id="packets-val" className="config-val">3</span></div>
              <div className="config-row"><label>City Density</label><input id="complexity-range" type="range" min="5" max="80" defaultValue="25" /><span id="complexity-val" className="config-val">25</span></div>
              <div className="config-row"><label>Grid Size</label><input id="grid-size-range" type="range" min="50" max="200" defaultValue="100" /><span id="grid-size-val" className="config-val">100</span></div>
            </div>
            <div className="config-section">
              <div className="config-section-title">// COMBAT</div>
              <div className="config-row"><label>AI Difficulty</label><input id="diff-range" type="range" min="1" max="10" defaultValue="5" /><span id="diff-val" className="config-val">5</span></div>
              <div className="config-row"><label>Start Ammo</label><input id="ammo-range" type="range" min="1" max="30" defaultValue="10" /><span id="ammo-val" className="config-val">10</span></div>
              <div className="config-row"><label>Ammo Drop</label><input id="drop-range" type="range" min="1" max="10" defaultValue="3" /><span id="drop-val" className="config-val">3</span></div>
              <div className="config-row"><label>Reload Time (s)</label><input id="reload-time-range" type="range" min="0.1" max="2" step="0.05" defaultValue="0.25" /><span id="reload-time-val" className="config-val">0.25</span></div>
            </div>
            <div className="config-section">
              <div className="config-section-title">// MOVEMENT</div>
              <div className="config-row"><label>Walk Speed</label><input id="walk-speed-range" type="range" min="3" max="25" step="0.5" defaultValue="10" /><span id="walk-speed-val" className="config-val">10</span></div>
              <div className="config-row"><label>Sprint Speed</label><input id="sprint-speed-range" type="range" min="5" max="40" step="0.5" defaultValue="20" /><span id="sprint-speed-val" className="config-val">20</span></div>
              <div className="config-row"><label>Enemy Speed</label><input id="enemy-speed-range" type="range" min="1" max="20" step="0.5" defaultValue="5" /><span id="enemy-speed-val" className="config-val">5</span></div>
              <div className="config-row"><label>Pursuit Mult.</label><input id="pursuit-mult-range" type="range" min="1" max="4" step="0.1" defaultValue="1.5" /><span id="pursuit-mult-val" className="config-val">1.5</span></div>
            </div>
            <div className="config-section">
              <div className="config-section-title">// ALERT SYSTEM</div>
              <div className="config-row"><label>Alert Duration (s)</label><input id="alert-dur-range" type="range" min="5" max="60" defaultValue="15" /><span id="alert-dur-val" className="config-val">15</span></div>
              <div className="config-row"><label>Pursuit Duration (s)</label><input id="pursuit-dur-range" type="range" min="5" max="60" defaultValue="25" /><span id="pursuit-dur-val" className="config-val">25</span></div>
            </div>
            <div className="config-section">
              <div className="config-section-title">// COLORS</div>
              <div className="config-row"><label>Normal Alert</label><input id="color-normal" type="color" defaultValue="#29ff7a" /></div>
              <div className="config-row"><label>Search Alert</label><input id="color-search" type="color" defaultValue="#6b0a26" /></div>
              <div className="config-row"><label>Pursuit Alert</label><input id="color-pursuit" type="color" defaultValue="#cb000c" /></div>
              <div className="config-row"><label>Enemy Color</label><input id="enemy-color-input" type="color" defaultValue="#cb000c" /></div>
            </div>
          </div>
          <hr className="menu-divider" />
          <button id="config-back-btn" className="menu-btn">◈ BACK TO MENU</button>
        </div>
      </div>

      {/* INFO MODAL */}
      <div id="info-modal-overlay" className="menu-overlay">
        <div className="menu-box" style={{ maxWidth: "520px" }}>
          <div id="content-howto" className="modal-content-block">
            <h3>// OPERATIONAL BRIEFING</h3>
            <p>Infiltrate the enemy grid. Collect all data packets while avoiding detection. Eliminate threats when necessary.</p>
            <p><span className="key-hint">W A S D</span> Move &nbsp; <span className="key-hint">MOUSE</span> Look &nbsp; <span className="key-hint">SHIFT</span> Sprint</p>
            <p><span className="key-hint">SPACE</span> Jump &nbsp; <span className="key-hint">CLICK</span> Fire &nbsp; <span className="key-hint">P</span> Pause</p>
            <p>Collect glowing blue icosahedra to secure data. Yellow cubes are ammo drops from defeated enemies.</p>
            <p>Alert levels: <span style={{ color: "#29ff7a" }}>NORMAL</span> → <span style={{ color: "#fb8500" }}>SEARCHING</span> → <span style={{ color: "#cb000c" }}>HIGH ALERT</span></p>
            <p>Stay silent. Stay hidden. Complete the protocol.</p>
          </div>
          <div id="content-about" className="modal-content-block">
            <h3>// ABOUT HERA GameFi</h3>
            <p>HERA GameFi is a browser-based stealth simulation built on Three.js — a real-time 3D game running entirely in your browser.</p>
            <p>Navigate procedurally generated cyber-cities. Evade AI sentinels. Secure data packets. Survive the grid.</p>
            <p>Each level scales in difficulty: more enemies, faster pursuit, larger maps.</p>
            <p>Score points by surviving, moving, collecting targets, and eliminating threats. Multipliers increase with each level.</p>
            <p style={{ opacity: 0.5, fontSize: "11px", marginTop: "16px" }}>HERA GameFi — Enter the Grid.</p>
          </div>
          <hr className="menu-divider" />
          <button className="menu-btn" onClick={() => { (window as any).closeInfoModal?.(); }}>◈ CLOSE</button>
        </div>
      </div>

      {/* PAUSE MENU */}
      <div id="pause-menu" className="menu-overlay">
        <div className="menu-box">
          <div className="menu-title" style={{ fontSize: "24px" }}>PAUSED</div>
          <div className="menu-subtitle">PROTOCOL SUSPENDED</div>
          <button id="resume-btn" className="menu-btn">◈ RESUME PROTOCOL</button>
          <button id="quit-btn" className="menu-btn danger">◈ ABORT MISSION</button>
        </div>
      </div>

      {/* GAME OVER */}
      <div id="game-over-menu" className="menu-overlay">
        <div className="menu-box">
          <div id="game-over-title" className="menu-title" style={{ fontSize: "24px" }}>CRITICAL FAILURE</div>
          <div id="game-over-msg" className="menu-subtitle">SIGNAL LOST</div>
          <div id="final-score" className="hud-value" style={{ fontSize: "48px", textAlign: "center", marginBottom: "4px" }}>0</div>
          <div className="score-label" style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "10px", letterSpacing: "4px", opacity: 0.5, textAlign: "center", marginBottom: "24px" }}>FINAL SCORE</div>
          <button id="retry-btn" className="menu-btn">◈ RETRY</button>
          <button id="menu-from-over-btn" className="menu-btn danger">◈ MAIN MENU</button>
          <button className="menu-btn" style={{ borderColor: "#1da1f2", color: "#1da1f2", marginTop: "8px" }} onClick={() => { (window as any).shareTwitter?.(); }}>
            𝕏 SHARE ON X/TWITTER
          </button>
        </div>
      </div>

      {/* SOCIALS */}
      <div id="fixed-socials">
        <a href="https://twitter.com/HERAGameFi" target="_blank" rel="noopener noreferrer">
          <span className="social-x-icon">𝕏</span>
          @HERAGameFi
        </a>
      </div>
    </>
  );
}
