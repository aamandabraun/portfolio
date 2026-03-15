import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const RAY_COUNT = 280;
const SEGS = 20;

const TIME_THEMES = [
  {
    id: "antes-amanhecer", label: "Antes do amanhecer", icon: "🌙",
    bgCenter: "#1a0a3d", bgMid: "#6a30b0", bgEdge: "#e8d8ff",
    rayA: "#8040e0", rayB: "#4020a0", dot: "#c080ff",
    glowInner: [1.0, 0.5, 1.0], glowOuter: [0.4, 0.1, 0.8],
  },
  {
    id: "nascer-sol", label: "Nascer do sol", icon: "🌅",
    bgCenter: "#ff8c30", bgMid: "#ffb870", bgEdge: "#fff5e0",
    rayA: "#ff40a0", rayB: "#8020c0", dot: "#ff80c0",
    glowInner: [1.0, 0.7, 0.3], glowOuter: [1.0, 0.3, 0.5],
  },
  {
    id: "por-sol", label: "Pôr do sol", icon: "🌆",
    bgCenter: "#ff6080", bgMid: "#e080c8", bgEdge: "#f8e0ff",
    rayA: "#ff7040", rayB: "#9030c0", dot: "#ff90a0",
    glowInner: [1.0, 0.5, 0.4], glowOuter: [0.8, 0.2, 0.7],
  },
  {
    id: "noite", label: "Noite", icon: "🌃",
    bgCenter: "#0a0a2a", bgMid: "#2a2080", bgEdge: "#d0c8ff",
    rayA: "#6060ff", rayB: "#3030c0", dot: "#a0a0ff",
    glowInner: [0.6, 0.6, 1.0], glowOuter: [0.2, 0.1, 0.8],
  },
];

export default function Portfolio() {
  const mountRef = useRef(null);
  const stateRef = useRef({
    mouse: { x: 0.5, y: 0.5 },
    targetMouse: { x: 0.5, y: 0.5 },
    tick: 0,
    scroll: 0,
    targetScroll: 0,
    themeIdx: 0,
    targetThemeIdx: 0,
    transition: 1.0,
  });

  const [scrollProgress, setScrollProgress] = useState(0);
  const [nameVisible, setNameVisible] = useState(false);
  const [activeTheme, setActiveTheme] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setNameVisible(true), 600);
    return () => clearTimeout(t);
  }, []);

  const changeTheme = (idx) => {
    stateRef.current.targetThemeIdx = idx;
    stateRef.current.transition = 0;
    setActiveTheme(idx);
    setMenuOpen(false);
  };

  useEffect(() => {
    const container = mountRef.current;
    let W = container.clientWidth;
    let H = container.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-W/2, W/2, H/2, -H/2, 0.1, 100);
    camera.position.z = 10;

    // ── Background radial ─────────────────────────────────────
    const bgMat = new THREE.ShaderMaterial({
      uniforms: {
        colorCenter: { value: new THREE.Color(TIME_THEMES[0].bgCenter) },
        colorMid:    { value: new THREE.Color(TIME_THEMES[0].bgMid) },
        colorEdge:   { value: new THREE.Color(TIME_THEMES[0].bgEdge) },
        scroll:      { value: 0.0 },
        aspect:      { value: W / H },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 colorCenter;
        uniform vec3 colorMid;
        uniform vec3 colorEdge;
        uniform float scroll;
        uniform float aspect;
        varying vec2 vUv;
        void main() {
          vec2 centered = vec2((vUv.x - 0.5) * aspect, vUv.y - 0.5);
          float dist = length(centered) / (aspect * 0.6);
          dist = clamp(dist, 0.0, 1.0);
          float expandedDist = clamp(dist - scroll * 0.6, 0.0, 1.0);
          vec3 col = mix(colorCenter, colorMid, smoothstep(0.0, 0.45, expandedDist));
          col = mix(col, colorEdge, smoothstep(0.35, 1.0, expandedDist));
          float alpha = 1.0 - scroll * 0.85;
          gl_FragColor = vec4(col, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
    });
    const bgMesh = new THREE.Mesh(new THREE.PlaneGeometry(W, H), bgMat);
    bgMesh.position.z = -5;
    scene.add(bgMesh);

    // ── Raios ─────────────────────────────────────────────────
    const rayData = Array.from({ length: RAY_COUNT }, (_, i) => ({
      baseAngle: (i / RAY_COUNT) * Math.PI * 2,
      len:       Math.min(W, H) * 0.38 + Math.random() * Math.min(W, H) * 0.42,
      speed:     0.4 + Math.random() * 1.2,
      phase:     Math.random() * Math.PI * 2,
      phaseY:    Math.random() * Math.PI * 2,
      dotR:      2.5 + Math.random() * 7,
    }));

    const rayObjects = rayData.map((rd) => {
      const positions = new Float32Array((SEGS + 1) * 3);
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const mat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.7 });
      const line = new THREE.Line(geo, mat);
      scene.add(line);

      const dotGeo = new THREE.CircleGeometry(rd.dotR, 14);
      const dotMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      scene.add(dot);

      return { line, geo, mat, dot, dotMat, rd };
    });

    // ── Glow central ──────────────────────────────────────────
    const glowMat = new THREE.ShaderMaterial({
      uniforms: {
        scroll:     { value: 0.0 },
        innerColor: { value: new THREE.Vector3(...TIME_THEMES[0].glowInner) },
        outerColor: { value: new THREE.Vector3(...TIME_THEMES[0].glowOuter) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
      `,
      fragmentShader: `
        uniform float scroll;
        uniform vec3 innerColor;
        uniform vec3 outerColor;
        varying vec2 vUv;
        void main() {
          vec2 c = vUv - 0.5;
          float d = length(c) * 2.0;
          float glow = 1.0 - smoothstep(0.0, 1.0, d);
          glow = pow(glow, 1.8);
          float alpha = glow * (1.0 - scroll * 1.2) * 0.75;
          alpha = clamp(alpha, 0.0, 1.0);
          vec3 col = mix(outerColor, innerColor, pow(max(0.0, 1.0 - d), 2.0));
          gl_FragColor = vec4(col, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const glowSize = Math.min(W, H) * 0.55;
    const glowMesh = new THREE.Mesh(new THREE.PlaneGeometry(glowSize, glowSize), glowMat);
    glowMesh.position.z = 0.5;
    scene.add(glowMesh);

    // ── Helper: lerp entre temas ──────────────────────────────
    const gc = (key, fi, ti, t) =>
      new THREE.Color(TIME_THEMES[fi][key]).lerp(new THREE.Color(TIME_THEMES[ti][key]), t);

    const lerpVec3 = (a, b, t) => [
      a[0] + (b[0] - a[0]) * t,
      a[1] + (b[1] - a[1]) * t,
      a[2] + (b[2] - a[2]) * t,
    ];

    // ── Animate ───────────────────────────────────────────────
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const s = stateRef.current;

      s.tick += 0.018;
      s.scroll   += (s.targetScroll - s.scroll)   * 0.06;
      s.mouse.x  += (s.targetMouse.x - s.mouse.x) * 0.05;
      s.mouse.y  += (s.targetMouse.y - s.mouse.y) * 0.05;
      if (s.transition < 1) s.transition = Math.min(1, s.transition + 0.022);
      else s.themeIdx = s.targetThemeIdx;

      const { tick, scroll, mouse, transition: tr, themeIdx: fi, targetThemeIdx: ti } = s;
      const shrink = Math.max(0, 1 - scroll * 1.4);

      // Atualiza BG com tema atual
      bgMat.uniforms.colorCenter.value = gc("bgCenter", fi, ti, tr);
      bgMat.uniforms.colorMid.value    = gc("bgMid",    fi, ti, tr);
      bgMat.uniforms.colorEdge.value   = gc("bgEdge",   fi, ti, tr);
      bgMat.uniforms.scroll.value      = scroll;
      bgMat.uniforms.aspect.value      = W / H;

      // Atualiza glow com tema
      const gi = lerpVec3(TIME_THEMES[fi].glowInner, TIME_THEMES[ti].glowInner, tr);
      const go = lerpVec3(TIME_THEMES[fi].glowOuter, TIME_THEMES[ti].glowOuter, tr);
      glowMat.uniforms.innerColor.value.set(...gi);
      glowMat.uniforms.outerColor.value.set(...go);
      glowMat.uniforms.scroll.value = scroll;

      // Cores de raio interpoladas
      const cRayA = gc("rayA", fi, ti, tr);
      const cRayB = gc("rayB", fi, ti, tr);
      const cDot  = gc("dot",  fi, ti, tr);

      rayObjects.forEach(({ geo, mat, dot, dotMat, rd }, i) => {
        const progress = i / RAY_COUNT; // 0→1 ao longo do círculo

        const angle = rd.baseAngle
          + Math.sin(tick * rd.speed + rd.phase) * 0.02
          + (mouse.x - 0.5) * 0.35;

        const currentLen = rd.len * shrink;
        const pos = geo.attributes.position.array;

        for (let seg = 0; seg <= SEGS; seg++) {
          const frac = seg / SEGS;
          const dist = currentLen * frac;

          const mouseInfluenceX = (mouse.x - 0.5) * frac * frac * 180;
          const mouseInfluenceY = (mouse.y - 0.5) * frac * frac * 120;

          const wobbleAmp = 60 + Math.sin(rd.phase) * 30;
          const wobble = Math.sin(tick * rd.speed + rd.phaseY + frac * Math.PI * 2)
                         * frac * frac * wobbleAmp * shrink;

          const px = Math.cos(angle + Math.PI / 2);
          const py = Math.sin(angle + Math.PI / 2);

          pos[seg*3]   = Math.cos(angle) * dist + px * wobble + mouseInfluenceX * Math.cos(rd.baseAngle);
          pos[seg*3+1] = Math.sin(angle) * dist + py * wobble + mouseInfluenceY * Math.sin(rd.baseAngle);
          pos[seg*3+2] = 0;
        }
        geo.attributes.position.needsUpdate = true;

        // Cor do raio: interpola rayA → rayB ao longo do círculo
        const rayColor = new THREE.Color().lerpColors(cRayA, cRayB, progress);
        mat.color.copy(rayColor);
        mat.opacity = (0.5 + Math.sin(tick * rd.speed + rd.phase) * 0.15) * shrink;

        const tipX = pos[SEGS*3];
        const tipY = pos[SEGS*3+1];
        dot.position.set(tipX, tipY, 0.2);
        const pulse = (0.7 + Math.sin(tick * rd.speed * 1.3 + rd.phase) * 0.3) * shrink;
        dot.scale.setScalar(Math.max(0.01, pulse));
        dotMat.color.copy(cDot);
        dotMat.opacity = (0.7 + Math.sin(tick * rd.speed + rd.phase) * 0.2) * shrink;
      });

      renderer.render(scene, camera);
    };
    animate();

    // ── Resize ────────────────────────────────────────────────
    const onResize = () => {
      W = container.clientWidth;
      H = container.clientHeight;
      renderer.setSize(W, H);
      camera.left = -W/2; camera.right = W/2;
      camera.top  =  H/2; camera.bottom = -H/2;
      camera.updateProjectionMatrix();
      bgMesh.geometry.dispose();
      bgMesh.geometry = new THREE.PlaneGeometry(W, H);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (container.contains(renderer.domElement))
        container.removeChild(renderer.domElement);
    };
  }, []);

  // ── Scroll ────────────────────────────────────────────────
  useEffect(() => {
    const onWheel = (e) => {
      const s = stateRef.current;
      s.targetScroll = Math.min(1, Math.max(0, s.targetScroll + e.deltaY * 0.001));
      setScrollProgress(s.targetScroll);
    };
    let touchStartY = 0;
    const onTouchStart = (e) => { touchStartY = e.touches[0].clientY; };
    const onTouchMove  = (e) => {
      const delta = touchStartY - e.touches[0].clientY;
      touchStartY = e.touches[0].clientY;
      const s = stateRef.current;
      s.targetScroll = Math.min(1, Math.max(0, s.targetScroll + delta * 0.003));
      setScrollProgress(s.targetScroll);
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove",  onTouchMove,  { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove",  onTouchMove);
    };
  }, []);

  const onMouseMove = (e) => {
    const rect = mountRef.current.getBoundingClientRect();
    stateRef.current.targetMouse.x = (e.clientX - rect.left) / rect.width;
    stateRef.current.targetMouse.y = (e.clientY - rect.top)  / rect.height;
  };

  const introOpacity   = Math.max(0, 1 - scrollProgress * 2.5);
  const contentOpacity = Math.max(0, (scrollProgress - 0.3) * 2.5);
  const theme = TIME_THEMES[activeTheme];

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", overflow: "hidden", fontFamily: "'Georgia', serif" }}>

      <div ref={mountRef} onMouseMove={onMouseMove}
        style={{ position: "absolute", inset: 0, cursor: "crosshair",
          opacity: Math.max(0, 1 - scrollProgress * 1.2) }} />

      {/* Nome */}
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", pointerEvents: "none",
        opacity: introOpacity, transition: "opacity 0.2s" }}>
        <div style={{ fontSize: "clamp(36px, 6vw, 80px)", fontWeight: 700, color: "#fff",
          letterSpacing: "-1px", textShadow: "0 0 40px rgba(220,100,255,0.9), 0 0 80px rgba(180,60,255,0.5)",
          opacity: nameVisible ? 1 : 0, transform: nameVisible ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 1.2s ease, transform 1.2s ease", textAlign: "center" }}>
          Amanda Braun
        </div>
        <div style={{ marginTop: 14, fontSize: "clamp(13px, 1.8vw, 20px)", color: "rgba(255,255,255,0.75)",
          letterSpacing: "3px", textTransform: "uppercase", textShadow: "0 0 20px rgba(200,100,255,0.6)",
          opacity: nameVisible ? 1 : 0, transform: nameVisible ? "translateY(0)" : "translateY(8px)",
          transition: "opacity 1.4s ease 0.3s, transform 1.4s ease 0.3s" }}>
          Designer & Developer
        </div>
        <div style={{ position: "absolute", bottom: 36, display: "flex", flexDirection: "column",
          alignItems: "center", gap: 8, opacity: nameVisible ? 0.6 : 0,
          transition: "opacity 1.5s ease 0.8s", animation: "bounce 2s ease-in-out infinite" }}>
          <span style={{ color: "#e0c8ff", fontSize: 12, letterSpacing: 2, textTransform: "uppercase" }}>scroll</span>
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
            <rect x="6" y="1" width="4" height="10" rx="2" fill="rgba(220,180,255,0.7)"/>
            <path d="M8 16 L3 21 M8 16 L13 21" stroke="rgba(220,180,255,0.7)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      {/* Conteúdo */}
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", opacity: contentOpacity,
        transform: `translateY(${Math.max(0, (0.3 - scrollProgress) * 60)}px)`,
        pointerEvents: contentOpacity > 0.1 ? "auto" : "none", padding: "0 24px", textAlign: "center" }}>
        <p style={{ fontSize: "clamp(16px, 2.5vw, 28px)", color: "#4a2060", maxWidth: 600, lineHeight: 1.7, fontStyle: "italic" }}>
          "Crio experiências digitais que combinam design e código — onde cada detalhe importa."
        </p>
        <div style={{ marginTop: 40, display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
          {["Projetos", "Sobre mim", "Contato"].map((label) => (
            <button key={label} style={{ padding: "12px 28px", borderRadius: 30,
              border: "1.5px solid rgba(150,60,200,0.4)", background: "rgba(180,100,255,0.08)",
              color: "#7030a0", fontSize: 14, fontFamily: "inherit", letterSpacing: 1, cursor: "pointer",
              backdropFilter: "blur(8px)" }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Seletor de tema */}
      <div style={{ position: "absolute", top: 16, right: 16, display: "flex", gap: 8, zIndex: 10 }}>
        <div style={{ position: "relative" }}>
          <button onClick={() => setMenuOpen(m => !m)} style={{ width: 38, height: 38, borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(12px)", cursor: "pointer", fontSize: 16,
            display: "flex", alignItems: "center", justifyContent: "center" }}>
            {theme.icon}
          </button>
          {menuOpen && (
            <div style={{ position: "absolute", top: 46, right: 0, background: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(20px)", borderRadius: 14, padding: "6px 0", minWidth: 210,
              boxShadow: "0 8px 40px rgba(0,0,0,0.18)", border: "1px solid rgba(255,255,255,0.6)" }}>
              {TIME_THEMES.map((th, i) => (
                <button key={th.id} onClick={() => changeTheme(i)} style={{
                  width: "calc(100% - 8px)", margin: "0 4px", padding: "10px 14px", border: "none",
                  background: activeTheme === i ? "rgba(99,102,241,0.1)" : "transparent",
                  cursor: "pointer", textAlign: "left", fontSize: 13,
                  color: activeTheme === i ? "#4f46e5" : "#374151",
                  fontWeight: activeTheme === i ? 600 : 400,
                  display: "flex", alignItems: "center", gap: 10, borderRadius: 8 }}>
                  <span>{th.icon}</span><span>{th.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
      `}</style>
    </div>
  );
}