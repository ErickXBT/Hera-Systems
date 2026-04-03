import { useEffect, useRef, useState } from "react";

interface LandingProps {
  onPlayGame: () => void;
}

export default function Landing({ onPlayGame }: LandingProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const container = heroRef.current;
    if (!container) return;

    const script = document.createElement("script");
    script.type = "module";
    script.id = "hero-three-script";
    script.textContent = `
      import * as THREE from "https://esm.sh/three";

      (function() {
      const container = document.getElementById('hero-canvas-container');
      if (!container || container.dataset.initialized) return;
      container.dataset.initialized = "true";

      const width = container.clientWidth;
      const height = container.clientHeight;

      const scene = new THREE.Scene();
      scene.fog = new THREE.Fog(0x000000, 15, 60);

      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      camera.position.set(0, 0, 20);

      let heroRenderer;
      try { heroRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); }
      catch(e) { return; }
      heroRenderer.setSize(width, height);
      heroRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(heroRenderer.domElement);

      const mouse = { x: 0, y: 0 };
      const targetMouse = { x: 0, y: 0 };

      const particleCount = window.innerWidth < 768 ? 1000 : window.innerWidth < 1024 ? 1500 : 2000;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const velocities = new Float32Array(particleCount);
      const sizes = new Float32Array(particleCount);
      const colors = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 80;
        positions[i3 + 1] = (Math.random() - 0.5) * 80;
        positions[i3 + 2] = (Math.random() - 0.5) * 50;
        velocities[i] = Math.random() * 0.08 + 0.02;
        sizes[i] = Math.random() * 0.3 + 0.1;
        const brightness = Math.random() * 0.6 + 0.4;
        colors[i3] = 0;
        colors[i3 + 1] = brightness;
        colors[i3 + 2] = brightness * 0.2;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const particleMaterial = new THREE.PointsMaterial({
        size: 0.2, sizeAttenuation: true, vertexColors: true,
        transparent: true, opacity: 0.8,
        blending: THREE.AdditiveBlending, depthWrite: false
      });

      const particleSystem = new THREE.Points(geometry, particleMaterial);
      scene.add(particleSystem);

      const gridSize = 50; const gridDivisions = 50;
      const gridHelper = new THREE.GridHelper(gridSize, gridDivisions, 0x00ff00, 0x003300);
      gridHelper.position.y = -15; gridHelper.rotation.x = Math.PI / 6;
      gridHelper.material.transparent = true; gridHelper.material.opacity = 0.3;
      scene.add(gridHelper);

      const verticalGrid = new THREE.GridHelper(gridSize, gridDivisions, 0x00ff00, 0x002200);
      verticalGrid.rotation.x = Math.PI / 2; verticalGrid.position.z = -20;
      verticalGrid.material.transparent = true; verticalGrid.material.opacity = 0.15;
      scene.add(verticalGrid);

      const shapeGeometries = [
        new THREE.TetrahedronGeometry(1.5, 0),
        new THREE.OctahedronGeometry(1.2, 0),
        new THREE.IcosahedronGeometry(1.3, 0),
        new THREE.TorusGeometry(1, 0.4, 8, 16),
      ];

      const shapeCount = window.innerWidth < 768 ? 4 : window.innerWidth < 1024 ? 6 : 8;
      const shapes = [];
      for (let i = 0; i < shapeCount; i++) {
        const geom = shapeGeometries[Math.floor(Math.random() * shapeGeometries.length)];
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true, transparent: true, opacity: Math.random() * 0.2 + 0.15 });
        const mesh = new THREE.Mesh(geom, material);
        mesh.position.set((Math.random() - 0.5) * 30, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20);
        mesh.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);
        shapes.push({ mesh, rotationSpeed: { x: (Math.random()-0.5)*0.02, y: (Math.random()-0.5)*0.02, z: (Math.random()-0.5)*0.02 }, floatSpeed: Math.random()*0.5+0.3, floatOffset: Math.random()*Math.PI*2 });
        scene.add(mesh);
      }

      const ambientLight = new THREE.AmbientLight(0x00ff00, 0.3); scene.add(ambientLight);
      const pointLight1 = new THREE.PointLight(0x00ff00, 1, 50); pointLight1.position.set(10, 10, 10); scene.add(pointLight1);
      const pointLight2 = new THREE.PointLight(0x00ff00, 0.5, 50); pointLight2.position.set(-10, -10, -10); scene.add(pointLight2);

      let time = 0; let heroAnimActive = true;
      function animate() {
        if (!heroAnimActive) return;
        requestAnimationFrame(animate);
        time += 0.01;
        mouse.x += (targetMouse.x - mouse.x) * 0.05;
        mouse.y += (targetMouse.y - mouse.y) * 0.05;
        const pos = particleSystem.geometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          pos[i3 + 1] -= velocities[i];
          if (pos[i3 + 1] < -40) { pos[i3 + 1] = 40; pos[i3] = (Math.random()-0.5)*80; pos[i3+2] = (Math.random()-0.5)*50; }
        }
        particleSystem.geometry.attributes.position.needsUpdate = true;
        particleSystem.rotation.y += 0.0001;
        shapes.forEach(s => {
          s.mesh.rotation.x += s.rotationSpeed.x;
          s.mesh.rotation.y += s.rotationSpeed.y;
          s.mesh.rotation.z += s.rotationSpeed.z;
          s.mesh.position.y += Math.sin(time * s.floatSpeed + s.floatOffset) * 0.01;
        });
        camera.position.x += (mouse.x * 5 - camera.position.x) * 0.03;
        camera.position.y += (-mouse.y * 3 - camera.position.y) * 0.03;
        camera.lookAt(0, 0, 0);
        heroRenderer.render(scene, camera);
      }
      animate();

      window.__heroAnimActive = true;
      window.addEventListener('hero-stop', () => { heroAnimActive = false; });

      function handleResize() {
        const nw = container.clientWidth; const nh = container.clientHeight;
        camera.aspect = nw / nh; camera.updateProjectionMatrix(); heroRenderer.setSize(nw, nh);
      }
      function handleMouseMove(e) {
        const rect = container.getBoundingClientRect();
        targetMouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        targetMouse.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      }
      window.addEventListener('resize', handleResize);
      container.addEventListener('mousemove', handleMouseMove);
      })();
    `;
    document.head.appendChild(script);

    return () => {
      window.dispatchEvent(new Event("hero-stop"));
      const el = document.getElementById("hero-three-script");
      if (el) el.remove();
      const canvas = container.querySelector("canvas");
      if (canvas) canvas.remove();
      delete (container as any).dataset.initialized;
    };
  }, []);

  const navLinks = ["Home", "GameFi", "Launchpad", "Tokenomics", "Roadmap"];

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div style={{ background: "#020a04", color: "#c8ffd4", fontFamily: "'Share Tech Mono', monospace", overflowX: "hidden" }}>

      {/* ===== NAVBAR ===== */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 24px", height: "56px",
        background: "rgba(2,10,4,0.95)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(41,255,122,0.15)"
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }} onClick={() => scrollTo("home")}>
          <img src="https://i.imgur.com/09UMi8r.png" alt="HERA" style={{ height: "34px", width: "auto", objectFit: "contain", filter: "drop-shadow(0 0 6px rgba(41,255,122,0.5))" }} />
          <span style={{ fontFamily: "'Orbitron', monospace", fontWeight: 700, fontSize: "17px", color: "#29ff7a", letterSpacing: "3px" }}>HERA</span>
        </div>

        {/* Center Nav — desktop only */}
        <div style={{ display: "flex", gap: "32px", alignItems: "center" }} className="nav-links-desktop">
          {navLinks.map(link => (
            <button key={link} onClick={() => scrollTo(link.toLowerCase())}
              style={{ background: "none", border: "none", color: "rgba(200,255,212,0.65)", fontFamily: "'Share Tech Mono', monospace", fontSize: "12px", letterSpacing: "2px", cursor: "pointer", padding: "4px 0", transition: "color 0.2s" }}
              onMouseOver={e => (e.currentTarget.style.color = "#29ff7a")}
              onMouseOut={e => (e.currentTarget.style.color = "rgba(200,255,212,0.65)")}
            >{link.toUpperCase()}</button>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button className="connect-wallet-btn" style={{
            background: "transparent", border: "1px solid #29ff7a", color: "#29ff7a",
            fontFamily: "'Orbitron', monospace", fontSize: "11px", letterSpacing: "2px",
            padding: "7px 16px", cursor: "pointer", transition: "all 0.2s"
          }}
            onMouseOver={e => { e.currentTarget.style.background = "rgba(41,255,122,0.12)"; e.currentTarget.style.boxShadow = "0 0 16px rgba(41,255,122,0.3)"; }}
            onMouseOut={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.boxShadow = "none"; }}>
            ◈ CONNECT WALLET
          </button>

          {/* Hamburger — mobile only */}
          <button className="hamburger-btn" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="mobile-menu">
          {navLinks.map(link => (
            <button key={link} onClick={() => scrollTo(link.toLowerCase())}>
              {link.toUpperCase()}
            </button>
          ))}
          <button onClick={onPlayGame} style={{ color: "#29ff7a", fontWeight: 700 }}>
            ▶ PLAY NOW
          </button>
        </div>
      )}

      {/* ===== HERO SECTION ===== */}
      <section id="home" style={{ position: "relative", height: "100vh", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div id="hero-canvas-container" ref={heroRef} style={{ position: "absolute", inset: 0, zIndex: 0 }} />

        {/* Gradient overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(2,10,4,0.3) 0%, rgba(2,10,4,0.1) 40%, rgba(2,10,4,0.7) 85%, rgba(2,10,4,1) 100%)", zIndex: 1 }} />

        {/* Hero Content */}
        <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 24px", maxWidth: "800px" }}>
          <div style={{ fontSize: "11px", letterSpacing: "6px", color: "rgba(41,255,122,0.7)", marginBottom: "16px", fontFamily: "'Share Tech Mono', monospace" }}>
            ◈ POWERING THE NEXT WEB3 ECOSYSTEM ◈
          </div>
          <h1 style={{
            fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: "clamp(42px, 8vw, 88px)",
            color: "#29ff7a", letterSpacing: "4px", lineHeight: 1.05, marginBottom: "8px",
            textShadow: "0 0 40px rgba(41,255,122,0.5), 0 0 80px rgba(41,255,122,0.2)"
          }}>
            HERA<br />SYSTEMS
          </h1>
          <p style={{ fontSize: "clamp(12px, 2vw, 15px)", letterSpacing: "3px", color: "rgba(200,255,212,0.6)", marginBottom: "40px", lineHeight: 1.8 }}>
            GameFi. Launchpad. One Ecosystem.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={onPlayGame} style={{
              background: "rgba(41,255,122,0.12)", border: "1px solid #29ff7a", color: "#29ff7a",
              fontFamily: "'Orbitron', monospace", fontWeight: 700, fontSize: "13px",
              letterSpacing: "3px", padding: "16px 36px", cursor: "pointer", transition: "all 0.2s",
              boxShadow: "0 0 24px rgba(41,255,122,0.2)"
            }}
              onMouseOver={e => { e.currentTarget.style.background = "rgba(41,255,122,0.22)"; e.currentTarget.style.boxShadow = "0 0 40px rgba(41,255,122,0.4)"; }}
              onMouseOut={e => { e.currentTarget.style.background = "rgba(41,255,122,0.12)"; e.currentTarget.style.boxShadow = "0 0 24px rgba(41,255,122,0.2)"; }}>
              ▶ PLAY NOW
            </button>
            <button onClick={() => scrollTo("tokenomics")} style={{
              background: "transparent", border: "1px solid rgba(41,255,122,0.35)", color: "rgba(200,255,212,0.7)",
              fontFamily: "'Orbitron', monospace", fontSize: "12px", letterSpacing: "2px",
              padding: "16px 28px", cursor: "pointer", transition: "all 0.2s"
            }}
              onMouseOver={e => { e.currentTarget.style.borderColor = "#29ff7a"; e.currentTarget.style.color = "#29ff7a"; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = "rgba(41,255,122,0.35)"; e.currentTarget.style.color = "rgba(200,255,212,0.7)"; }}>
              ◈ TOKENOMICS
            </button>
          </div>

          {/* Scroll hint */}
          <div style={{ position: "absolute", bottom: "-100px", left: "50%", transform: "translateX(-50%)", opacity: 0.4, fontSize: "10px", letterSpacing: "3px", color: "#29ff7a" }}>
            ▾ SCROLL
          </div>
        </div>
      </section>

      {/* ===== HERA GAMEFI SECTION ===== */}
      <section id="gamefi" className="section-pad" style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div style={sectionTag}>// GAMEFI</div>
          <h2 style={sectionTitle}>HERA GameFi</h2>
          <p style={sectionSub}>Stealth browser game meets Web3 economy. Infiltrate. Extract. Earn.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
          {[
            { icon: "◈", title: "PLAY-TO-EARN", desc: "Score points through stealth, combat, and extraction. Leaderboard rewards distributed to top agents each season." },
            { icon: "⬡", title: "BROWSER NATIVE", desc: "Full 3D stealth game running entirely in your browser via Three.js. No downloads, no installs — jack in instantly." },
            { icon: "◉", title: "LEVEL PROGRESSION", desc: "Procedurally generated maps. Each level scales in difficulty: faster enemies, larger grids, higher stakes." },
            { icon: "▲", title: "WEB3 IDENTITY", desc: "Connect your wallet as your Agent ID. Your scores, achievements, and rank are tied to your on-chain identity." },
            { icon: "✦", title: "STEALTH MECHANICS", desc: "Three-tier alert system. Evade, distract, or eliminate. Every decision impacts your final score multiplier." },
            { icon: "◈", title: "SEASONAL REWARDS", desc: "HERA tokens distributed to top agents. Compete across seasons and climb the global leaderboard." },
          ].map((card) => (
            <div key={card.title} style={featureCard}
              onMouseOver={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(41,255,122,0.5)"; (e.currentTarget as HTMLElement).style.background = "rgba(41,255,122,0.05)"; }}
              onMouseOut={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(41,255,122,0.15)"; (e.currentTarget as HTMLElement).style.background = "rgba(41,255,122,0.02)"; }}>
              <div style={{ fontSize: "24px", color: "#29ff7a", marginBottom: "12px" }}>{card.icon}</div>
              <h3 style={{ fontFamily: "'Orbitron', monospace", fontSize: "12px", letterSpacing: "3px", color: "#29ff7a", marginBottom: "10px" }}>{card.title}</h3>
              <p style={{ fontSize: "12px", color: "rgba(200,255,212,0.6)", lineHeight: 1.7 }}>{card.desc}</p>
            </div>
          ))}
        </div>

        {/* Play CTA */}
        <div style={{ textAlign: "center", marginTop: "56px" }}>
          <button onClick={onPlayGame} style={{
            background: "rgba(41,255,122,0.1)", border: "1px solid #29ff7a", color: "#29ff7a",
            fontFamily: "'Orbitron', monospace", fontWeight: 700, fontSize: "14px",
            letterSpacing: "4px", padding: "18px 48px", cursor: "pointer", transition: "all 0.25s",
            boxShadow: "0 0 20px rgba(41,255,122,0.15)"
          }}
            onMouseOver={e => { e.currentTarget.style.background = "rgba(41,255,122,0.2)"; e.currentTarget.style.boxShadow = "0 0 40px rgba(41,255,122,0.35)"; }}
            onMouseOut={e => { e.currentTarget.style.background = "rgba(41,255,122,0.1)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(41,255,122,0.15)"; }}>
            ▶ ENTER THE GRID
          </button>
        </div>
      </section>

      {/* ===== AGENT LAUNCHPAD SECTION ===== */}
      <section id="launchpad" className="section-pad" style={{ background: "rgba(0,20,8,0.5)", borderTop: "1px solid rgba(41,255,122,0.08)", borderBottom: "1px solid rgba(41,255,122,0.08)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <div style={sectionTag}>// LAUNCHPAD</div>
            <h2 style={sectionTitle}>AGENT LAUNCHPAD</h2>
            <p style={sectionSub}>Mint your Agent NFT. Stake HERA. Access exclusive missions and early season rewards.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "2px", border: "1px solid rgba(41,255,122,0.15)" }}>
            {[
              { tier: "GHOST", price: "FREE", perks: ["Access to public grid", "Standard agent skin", "Season leaderboard entry"], color: "rgba(200,255,212,0.5)" },
              { tier: "PHANTOM", price: "50 HERA", perks: ["Priority mission queue", "Exclusive Phantom skin", "2x score multiplier", "Early season access"], color: "#29ff7a", featured: true },
              { tier: "SPECTER", price: "200 HERA", perks: ["All Phantom perks", "Specter holographic skin", "5x score multiplier", "DAO voting rights", "Revenue share eligibility"], color: "#00ffff" },
            ].map(tier => (
              <div key={tier.tier} style={{
                padding: "40px 32px", background: tier.featured ? "rgba(41,255,122,0.06)" : "transparent",
                borderRight: "1px solid rgba(41,255,122,0.1)", textAlign: "center", position: "relative"
              }}>
                {tier.featured && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "#29ff7a" }} />}
                <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "10px", letterSpacing: "4px", color: tier.color, marginBottom: "8px" }}>TIER</div>
                <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "22px", fontWeight: 900, color: tier.color, marginBottom: "16px" }}>{tier.tier}</div>
                <div style={{ fontSize: "28px", fontWeight: 700, color: tier.color, fontFamily: "'Orbitron', monospace", marginBottom: "24px" }}>{tier.price}</div>
                <div style={{ borderTop: "1px solid rgba(41,255,122,0.1)", paddingTop: "24px", textAlign: "left" }}>
                  {tier.perks.map(p => (
                    <div key={p} style={{ fontSize: "12px", color: "rgba(200,255,212,0.65)", marginBottom: "10px", display: "flex", gap: "8px" }}>
                      <span style={{ color: tier.color }}>▸</span>{p}
                    </div>
                  ))}
                </div>
                <button style={{
                  marginTop: "24px", width: "100%", background: "transparent", border: `1px solid ${tier.color}`,
                  color: tier.color, fontFamily: "'Orbitron', monospace", fontSize: "11px",
                  letterSpacing: "2px", padding: "12px", cursor: "pointer", transition: "all 0.2s"
                }}
                  onMouseOver={e => { e.currentTarget.style.background = `rgba(41,255,122,0.1)`; }}
                  onMouseOut={e => { e.currentTarget.style.background = "transparent"; }}>
                  {tier.price === "FREE" ? "CLAIM AGENT ID" : "MINT NOW"}
                </button>
              </div>
            ))}
          </div>
          <p style={{ textAlign: "center", marginTop: "24px", fontSize: "10px", color: "rgba(200,255,212,0.3)", letterSpacing: "2px" }}>
            AGENT IDs STORED ON-CHAIN · HERA TOKEN REQUIRED FOR PAID TIERS
          </p>
        </div>
      </section>

      {/* ===== TOKENOMICS SECTION ===== */}
      <section id="tokenomics" className="section-pad" style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div style={sectionTag}>// TOKENOMICS</div>
          <h2 style={sectionTitle}>HERA TOKEN</h2>
          <p style={sectionSub}>Fixed supply. Transparent allocation. Built for long-term protocol health.</p>
        </div>

        <div className="tokenomics-grid">
          {/* Supply visual */}
          <div>
            <div style={{ border: "1px solid rgba(41,255,122,0.15)", padding: "40px", marginBottom: "24px" }}>
              <div style={{ fontSize: "11px", letterSpacing: "3px", color: "rgba(200,255,212,0.4)", marginBottom: "8px" }}>TOTAL SUPPLY</div>
              <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 900, color: "#29ff7a", letterSpacing: "2px" }}>1,000,000,000</div>
              <div style={{ fontSize: "12px", color: "rgba(200,255,212,0.5)", marginTop: "4px", letterSpacing: "2px" }}>HERA — FIXED SUPPLY · NO MINT</div>
            </div>

            {/* Stacked bar */}
            <div style={{ height: "20px", display: "flex", borderRadius: "2px", overflow: "hidden", marginBottom: "8px" }}>
              <div style={{ width: "80%", background: "#29ff7a" }} title="80% Public" />
              <div style={{ width: "10%", background: "#00ffff" }} title="10% Vesting" />
              <div style={{ width: "5%", background: "#fb8500" }} title="5% Dev" />
              <div style={{ width: "5%", background: "#9b5de5" }} title="5% Marketing" />
            </div>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", fontSize: "10px", letterSpacing: "1px", color: "rgba(200,255,212,0.5)" }}>
              <span><span style={{ color: "#29ff7a" }}>■</span> Public 80%</span>
              <span><span style={{ color: "#00ffff" }}>■</span> Vesting 10%</span>
              <span><span style={{ color: "#fb8500" }}>■</span> Dev 5%</span>
              <span><span style={{ color: "#9b5de5" }}>■</span> Marketing 5%</span>
            </div>
          </div>

          {/* Allocation breakdown */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              { label: "PUBLIC SALE / LIQUIDITY POOL", pct: 80, amount: "800,000,000", color: "#29ff7a", desc: "Open to all — DEX liquidity + public sale" },
              { label: "LOCK VESTING", pct: 10, amount: "100,000,000", color: "#00ffff", desc: "30-day cliff lock · team vesting schedule" },
              { label: "DEVELOPMENT", pct: 5, amount: "50,000,000", color: "#fb8500", desc: "Protocol infrastructure & smart contracts" },
              { label: "MARKETING", pct: 5, amount: "50,000,000", color: "#9b5de5", desc: "Community growth, campaigns & partnerships" },
            ].map(item => (
              <div key={item.label} style={{ border: "1px solid rgba(41,255,122,0.1)", padding: "20px 24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                  <div>
                    <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "10px", letterSpacing: "2px", color: item.color, marginBottom: "2px" }}>{item.label}</div>
                    <div style={{ fontSize: "11px", color: "rgba(200,255,212,0.4)" }}>{item.desc}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "22px", fontWeight: 900, color: item.color }}>{item.pct}%</div>
                    <div style={{ fontSize: "10px", color: "rgba(200,255,212,0.35)", whiteSpace: "nowrap" }}>{item.amount} HERA</div>
                  </div>
                </div>
                <div style={{ height: "3px", background: "rgba(41,255,122,0.08)", borderRadius: "2px" }}>
                  <div style={{ height: "100%", width: `${item.pct}%`, background: item.color, borderRadius: "2px" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ROADMAP SECTION ===== */}
      <section id="roadmap" className="section-pad" style={{ background: "rgba(0,20,8,0.5)", borderTop: "1px solid rgba(41,255,122,0.08)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <div style={sectionTag}>// ROADMAP</div>
            <h2 style={sectionTitle}>PROTOCOL TIMELINE</h2>
            <p style={sectionSub}>The grid expands. Follow the mission sequence.</p>
          </div>
          <div style={{ position: "relative" }}>
            {/* Vertical line */}
            <div className="roadmap-center-line" style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: "1px", background: "rgba(41,255,122,0.2)", transform: "translateX(-50%)" }} />

            {[
              { phase: "PHASE 01", label: "GENESIS", status: "COMPLETE", side: "left", items: ["Core game engine", "Three.js stealth mechanics", "Alert system & AI enemies", "Score & level progression"] },
              { phase: "PHASE 02", label: "IDENTITY", status: "IN PROGRESS", side: "right", items: ["Wallet connect integration", "Agent NFT mint", "On-chain leaderboard", "HERA token contract deploy"] },
              { phase: "PHASE 03", label: "ECONOMY", status: "UPCOMING", side: "left", items: ["P2E reward distribution", "DEX liquidity pool launch", "Public token sale", "Staking mechanism"] },
              { phase: "PHASE 04", label: "EXPANSION", status: "UPCOMING", side: "right", items: ["Season 1 missions", "Guild system", "Mobile-optimized client", "DAO governance launch"] },
            ].map((phase, i) => (
              <div key={phase.phase} className={phase.side === "left" ? "roadmap-item-left" : "roadmap-item-right"} style={{ marginBottom: "48px", position: "relative" }}>
                {/* Dot on center line */}
                <div className="roadmap-dot" style={{ position: "absolute", left: "50%", top: "20px", transform: "translateX(-50%)", width: "12px", height: "12px", border: "2px solid #29ff7a", background: phase.status === "COMPLETE" ? "#29ff7a" : "#020a04", zIndex: 1 }} />

                <div className="roadmap-card" style={{
                  padding: "28px 32px",
                  border: "1px solid rgba(41,255,122,0.15)",
                  background: phase.status === "IN PROGRESS" ? "rgba(41,255,122,0.04)" : "transparent",
                  position: "relative"
                }}>
                  {phase.status === "IN PROGRESS" && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(to right, transparent, #29ff7a, transparent)" }} />}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <span style={{ fontFamily: "'Orbitron', monospace", fontSize: "10px", color: "rgba(200,255,212,0.4)", letterSpacing: "2px" }}>{phase.phase}</span>
                    <span style={{
                      fontSize: "9px", letterSpacing: "1px", padding: "2px 8px", border: "1px solid",
                      borderColor: phase.status === "COMPLETE" ? "#29ff7a" : phase.status === "IN PROGRESS" ? "#fb8500" : "rgba(200,255,212,0.2)",
                      color: phase.status === "COMPLETE" ? "#29ff7a" : phase.status === "IN PROGRESS" ? "#fb8500" : "rgba(200,255,212,0.3)"
                    }}>{phase.status}</span>
                  </div>
                  <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "18px", fontWeight: 900, color: "#29ff7a", marginBottom: "16px", letterSpacing: "2px" }}>{phase.label}</div>
                  {phase.items.map(item => (
                    <div key={item} style={{ fontSize: "12px", color: "rgba(200,255,212,0.6)", marginBottom: "6px", display: "flex", gap: "8px" }}>
                      <span style={{ color: "#29ff7a", opacity: phase.status === "COMPLETE" ? 1 : 0.4 }}>✓</span>{item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BOTTOM NAVBAR / FOOTER ===== */}
      <footer style={{ borderTop: "1px solid rgba(41,255,122,0.12)", padding: "48px 40px 32px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div className="footer-grid">
            {/* Brand */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <img src="https://i.imgur.com/09UMi8r.png" alt="HERA" style={{ height: "32px", width: "auto", objectFit: "contain", filter: "drop-shadow(0 0 6px rgba(41,255,122,0.5))" }} />
                <span style={{ fontFamily: "'Orbitron', monospace", fontWeight: 700, fontSize: "16px", color: "#29ff7a", letterSpacing: "3px" }}>HERA</span>
              </div>
              <p style={{ fontSize: "12px", color: "rgba(200,255,212,0.4)", lineHeight: 1.8, maxWidth: "280px" }}>
                Browser-based stealth game meets Web3 economy. Infiltrate the grid. Earn HERA.
              </p>
              <div style={{ marginTop: "20px" }}>
                <a href="https://twitter.com/HERAGameFi" target="_blank" rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "rgba(200,255,212,0.5)", fontSize: "12px", textDecoration: "none", border: "1px solid rgba(41,255,122,0.2)", padding: "6px 14px", transition: "all 0.2s" }}
                  onMouseOver={e => { (e.currentTarget as HTMLElement).style.color = "#29ff7a"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(41,255,122,0.5)"; }}
                  onMouseOut={e => { (e.currentTarget as HTMLElement).style.color = "rgba(200,255,212,0.5)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(41,255,122,0.2)"; }}>
                  <span style={{ fontWeight: "bold" }}>𝕏</span> @HERAGameFi
                </a>
              </div>
            </div>

            {/* Game */}
            <div>
              <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "10px", letterSpacing: "3px", color: "#29ff7a", marginBottom: "16px", opacity: 0.7 }}>GAME</div>
              {["Play Now", "How to Play", "Leaderboard", "Patch Notes"].map(l => (
                <div key={l} style={{ marginBottom: "10px" }}>
                  <button onClick={l === "Play Now" ? onPlayGame : undefined} style={{ background: "none", border: "none", color: "rgba(200,255,212,0.45)", fontSize: "12px", cursor: "pointer", padding: 0, letterSpacing: "1px", transition: "color 0.2s" }}
                    onMouseOver={e => (e.currentTarget.style.color = "#29ff7a")}
                    onMouseOut={e => (e.currentTarget.style.color = "rgba(200,255,212,0.45)")}>{l}</button>
                </div>
              ))}
            </div>

            {/* Token */}
            <div>
              <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "10px", letterSpacing: "3px", color: "#29ff7a", marginBottom: "16px", opacity: 0.7 }}>TOKEN</div>
              {["Tokenomics", "Buy HERA", "Staking", "Whitepaper"].map(l => (
                <div key={l} style={{ marginBottom: "10px" }}>
                  <button onClick={() => scrollTo("tokenomics")} style={{ background: "none", border: "none", color: "rgba(200,255,212,0.45)", fontSize: "12px", cursor: "pointer", padding: 0, letterSpacing: "1px", transition: "color 0.2s" }}
                    onMouseOver={e => (e.currentTarget.style.color = "#29ff7a")}
                    onMouseOut={e => (e.currentTarget.style.color = "rgba(200,255,212,0.45)")}>{l}</button>
                </div>
              ))}
            </div>

            {/* Community */}
            <div>
              <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "10px", letterSpacing: "3px", color: "#29ff7a", marginBottom: "16px", opacity: 0.7 }}>COMMUNITY</div>
              {["X / Twitter", "Agent Launchpad", "DAO Governance", "Bug Reports"].map(l => (
                <div key={l} style={{ marginBottom: "10px" }}>
                  <a href={l === "X / Twitter" ? "https://twitter.com/HERAGameFi" : "#"} target={l === "X / Twitter" ? "_blank" : undefined} rel="noopener noreferrer"
                    style={{ color: "rgba(200,255,212,0.45)", fontSize: "12px", textDecoration: "none", letterSpacing: "1px", transition: "color 0.2s" }}
                    onMouseOver={e => (e.currentTarget.style.color = "#29ff7a")}
                    onMouseOut={e => (e.currentTarget.style.color = "rgba(200,255,212,0.45)")}>{l}</a>
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderTop: "1px solid rgba(41,255,122,0.08)", paddingTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <div style={{ fontSize: "10px", color: "rgba(200,255,212,0.25)", letterSpacing: "2px" }}>
              © 2025 HERA ECOSYSTEMS · ALL RIGHTS RESERVED
            </div>
            <div style={{ fontSize: "10px", color: "rgba(200,255,212,0.25)", letterSpacing: "2px" }}>
              NOT FINANCIAL ADVICE · DYOR
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');
        #home, #gamefi, #launchpad, #tokenomics, #roadmap { scroll-margin-top: 64px; }
        @media (max-width: 768px) {
          .nav-links-desktop { display: none !important; }
          section[id] { padding: 60px 20px !important; }
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
          div[style*="grid-template-columns: 2fr 1fr 1fr 1fr"] { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
}

const sectionTag: React.CSSProperties = {
  fontSize: "10px", letterSpacing: "5px", color: "rgba(41,255,122,0.5)",
  fontFamily: "'Share Tech Mono', monospace", marginBottom: "12px"
};
const sectionTitle: React.CSSProperties = {
  fontFamily: "'Orbitron', monospace", fontWeight: 900,
  fontSize: "clamp(28px, 5vw, 44px)", color: "#29ff7a",
  letterSpacing: "3px", marginBottom: "16px"
};
const sectionSub: React.CSSProperties = {
  fontSize: "13px", color: "rgba(200,255,212,0.5)",
  letterSpacing: "2px", lineHeight: 1.8, maxWidth: "600px", margin: "0 auto"
};
const featureCard: React.CSSProperties = {
  border: "1px solid rgba(41,255,122,0.15)", padding: "28px 24px",
  background: "rgba(41,255,122,0.02)", cursor: "default", transition: "all 0.2s"
};
