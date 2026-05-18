import { useEffect, useState } from "react";

const PROJECTS = [
  { title: "Stripe Animation", desc: "Animação 3D interativa de raios com Three.js e WebGL. Os raios respondem ao movimento do mouse em tempo real.", tags: ["Three.js", "React", "WebGL"], emoji: "✦" },
  { title: "Portfolio", desc: "Este portfolio — construído com React e Vite. Mesh gradients animados, scroll fluido e tipografia editorial.", tags: ["React", "Vite", "Canvas"], emoji: "◈" },
  { title: "Projeto 3", desc: "Descrição do seu projeto. Substitua com o que você realmente criou e as tecnologias que utilizou.", tags: ["Tag1", "Tag2", "Tag3"], emoji: "◎" },
];

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("sobre");
  const [visible, setVisible] = useState({});
  const [scrollProgress, setScrollProgress] = useState(0);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setDark(mq.matches);
    const handler = e => setDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          setVisible(v => ({ ...v, [e.target.dataset.id]: true }));
          setActiveSection(e.target.dataset.id);
        }
      }),
      { threshold: 0.6 }
    );
    setTimeout(() => {
      document.querySelectorAll("[data-id]").forEach(el => obs.observe(el));
    }, 100);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      const main = document.getElementById("blob-main");
      const sec = document.getElementById("blob-secondary");
      if (main) {
        main.style.left = `${50 + (x - 50) * 0.6}%`;
        main.style.top = `${50 + (y - 50) * 0.4}%`;
      }
      if (sec) {
        sec.style.left = `${50 + (x - 50) * -0.4}%`;
        sec.style.top = `${50 + (y - 50) * -0.4}%`;
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const total = document.body.scrollHeight - window.innerHeight;
      const current = window.scrollY;
      setScrollProgress((current / total) * 100);
      const main = document.getElementById("blob-main");
      const sec = document.getElementById("blob-secondary");
      if (main) { main.style.width = `400px`; main.style.height = `550px`; }
      if (sec) { sec.style.width = `900px`; sec.style.height = `750px`; }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const titleStyle = dark ? {
    color: "#EEF2FF",
  } : {
    background: "linear-gradient(135deg, #0EA5E9 20%, #1E40AF 70%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    backgroundSize: "100% 100%",
  };

  const titleStyleLarge = dark ? {
    color: "#EEF2FF",
  } : {
    background: "linear-gradient(90deg, #0EA5E9 20%, #1E40AF 70%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    display: "block",
  };

  const fadeIn = (id, delay = 0) => ({
    opacity: visible[id] ? 1 : 0,
    transform: visible[id] ? "translateY(0)" : "translateY(44px)",
    transition: `opacity 1s ease ${delay}s, transform 1s ease ${delay}s`,
  });

  return (
    <div style={{ fontFamily: "'Unbounded', sans-serif" }}>

      {/* ── BLOBS ── */}
      <div style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none", overflow: "visible" }}>
        <div id="blob-main" style={{
          position: "absolute",
          width: 450, height: 600,
          borderRadius: "30% 70% 55% 45% / 60% 35% 65% 40%",
          background: dark
            ? "conic-gradient(from 0deg, #1E1B4B, #363084, #282083)"
            : "conic-gradient(from 0deg, #7DD3FC, #f874fd, #e8fb3cc6)",
          filter: "blur(30px)", 
          opacity: dark ? 1 : 1, 
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          transition: "top 0.15s ease, left 0.15s ease, background 0.6s ease, opacity 0.6s ease",
          animation: "blobMorph 5s ease-in-out infinite",
        }} />

        <div id="blob-secondary" style={{
          position: "absolute",
          width: 950, height: 800,
          borderRadius: "70% 30% 40% 60% / 35% 65% 35% 65%",
          background: dark
            ? "conic-gradient(from 180deg, #312E81, #352ba0, #17116f, #37336b, #312E81)"
            : "conic-gradient(from 180deg, #FAE8FF, #7DD3FC, #A855F7, #FDBA74, #fbe83c)",
          filter: "blur(40px)",
          opacity: dark ? 0.9 : 0.8, // Presença forte no fundo
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          transition: "top 0.9s ease, left 0.9s ease, background 0.6s ease",
          animation: "blobMorph2 7s ease-in-out infinite",
        }} />
      </div>

      {/* ── TOGGLE DARK MODE ── */}
      <button
        onClick={() => setDark(d => !d)}
        title={dark ? "Modo claro" : "Modo escuro"}
        style={{
          position: "fixed", top: 22, right: 48, zIndex: 300,
          width: 38, height: 22, borderRadius: 11,
          border: dark ? "1.5px solid #4338CA" : "1.5px solid #0EA5E9",
          background: dark ? "#312E81" : "#F0F9FF",
          cursor: "pointer", padding: 0,
          transition: "background 0.3s, border 0.3s",
          display: "flex", alignItems: "center",
          paddingInline: 3,
        }}
      >
        <div style={{
          width: 14, height: 14, borderRadius: "50%",
          background: dark ? "#F0F9FF" : "#0EA5E9",
          transform: dark ? "translateX(16px)" : "translateX(0px)",
          transition: "transform 0.3s, background 0.3s",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 8,
        }}>
          {dark ? "☽" : "☀"}
        </div>
      </button>

      {/* ── NAV ── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 48px" }}>
        <div style={{ position: "absolute", bottom: 0, left: 0, height: "2px", width: "100%", background: dark ? "rgba(67,56,202,0.2)" : "rgba(14,165,233,0.15)" }}>
          <div style={{
            height: "100%", width: `${scrollProgress}%`,
            background: dark
              ? "linear-gradient(90deg, #4338CA, #6B7CF6, #C7D2FE)"
              : "linear-gradient(90deg, #0EA5E9, #7DD3FC, #F0F9FF)",
            transition: "width 0.1s linear",
            position: "relative",
          }}>
            <div style={{
              position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", width: 6, height: 6, borderRadius: "50%",
              background: dark ? "#EEF2FF" : "#F0F9FF",
              boxShadow: dark
                ? "0 0 8px 3px rgba(199,210,254,0.5), 0 0 16px 4px rgba(67,56,202,0.4)"
                : "0 0 8px 3px rgba(14,165,233,0.5), 0 0 16px 4px rgba(125,211,252,0.4)",
            }} />
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <span style={{ fontSize: 11, color: dark ? "#C7D2FE" : "#0EA5E9", letterSpacing: "2px" }}>aamandabraun.dev</span>
        </div>

        <div style={{ display: "flex", gap: 32, marginRight: 52 }}>
          {["sobre", "projetos", "contato"].map(s => (
            <button key={s} onClick={() => scrollTo(s)} style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 13, letterSpacing: "1px", textTransform: "lowercase",
              color: activeSection === s
                ? (dark ? "#C7D2FE" : "#0EA5E9")
                : (dark ? "#4338CA" : "#7DD3FC"),
              fontWeight: activeSection === s ? 700 : 400,
              fontFamily: "Unbounded", padding: 0, transition: "color 0.3s",
            }}>
              {s}
            </button>
          ))}
        </div>
      </nav>

      {/* ── HERO ── */}
      <section data-id="hero" style={{ minHeight: "100vh", position: "relative", zIndex: 2, display: "flex", alignItems: "flex-end", padding: "0 48px 64px" }}>
        <div style={{ flex: 1 }}>
          <h1 style={{
            fontFamily: "'Nasalization', 'Century Gothic', sans-serif",
            fontSize: "clamp(56px,9vw,120px)",
            fontWeight: 900,
            letterSpacing: "-3px",
            lineHeight: 0.88,
            margin: 0,
            textTransform: "uppercase",
            display: "block",
            width: "100%",
            background: dark ? "none" : "linear-gradient(135deg, #ff73e8 10%, #0EA5E9 30%, #4338CA 70%)",
            WebkitBackgroundClip: dark ? "unset" : "text",
            WebkitTextFillColor: dark ? "#FFFFFF" : "transparent",
            color: dark ? "#FFFFFF" : "transparent"
          }}>
            AMANDA<br />BRAUN
          </h1>
        </div>

        <div style={{ maxWidth: 500, textAlign: "right" }}>
          <p style={{ fontSize: "clamp(14px,1.6vw,18px)", color: dark ? "#C7D2FE" : "#0369A1", fontWeight: 500, lineHeight: 1.6, letterSpacing: "0px", margin: "0 0 24px" }}>
            Desenvolvimento fullstack orientado a experiência — do fluxo ao detalhe que ninguém percebe, mas todo mundo sente.
          </p>
          <button onClick={() => scrollTo("projetos")} style={{
            padding: "13px 30px", borderRadius: 50,
            border: dark ? "2px solid #C7D2FE" : "2px solid #0EA5E9",
            background: "transparent",
            color: dark ? "#C7D2FE" : "#0EA5E9",
            fontSize: 12, fontWeight: 700, cursor: "pointer", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "Unbounded", transition: "all 0.25s",
          }}
            onMouseEnter={e => {
              e.target.style.background = dark ? "#C7D2FE" : "#0EA5E9";
              e.target.style.color = dark ? "#1E1B4B" : "#F0F9FF";
            }}
            onMouseLeave={e => {
              e.target.style.background = "transparent";
              e.target.style.color = dark ? "#C7D2FE" : "#0EA5E9";
            }}
          >
            DIFERENCIAIS ↗
          </button>
        </div>

        <div style={{ position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: 0.45, animation: "bounce 2s ease-in-out infinite" }}>
          <span style={{ fontSize: 10, letterSpacing: "2px", color: dark ? "#4338CA" : "#0EA5E9", textTransform: "uppercase" }}>scroll</span>
          <div style={{ width: 1, height: 30, background: dark ? "linear-gradient(#4338CA,transparent)" : "linear-gradient(#0EA5E9,transparent)" }} />
        </div>
      </section>

      {/* ── SOBRE ── */}
      <section id="sobre" data-id="sobre" style={{ minHeight: "auto", position: "relative", zIndex: 3, display: "flex", alignItems: "center", padding: "100px 48px" }}>
        <div style={{
          maxWidth: 1100, width: "100%", margin: "0 auto",
          background: dark ? "rgba(30,27,75,0.55)" : "rgba(224,242,254,0.55)",
          backdropFilter: "blur(24px)",
          borderRadius: 32, padding: "64px",
          border: dark ? "1px solid rgba(67,56,202,0.35)" : "1px solid rgba(125,211,252,0.6)",
          boxShadow: dark ? "0 12px 60px rgba(30,27,75,0.4)" : "0 12px 60px rgba(14,165,233,0.1)",
          ...fadeIn("sobre"),
          transform: visible["sobre"] ? "scale(0.8)" : "scale(0.8) translateY(44px)",
          transformOrigin: "center center"
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "start" }}>

            {/* COLUNA DA ESQUERDA */}
            <div>
              <p style={{ fontSize: 11, color: dark ? "#4338CA" : "#0EA5E9", letterSpacing: "3px", textTransform: "uppercase", marginBottom: 16, fontWeight: 600 }}>sobre</p>
              <h2 style={{ fontFamily: "'Nasalization', 'Century Gothic', sans-serif", fontSize: "clamp(36px,4.5vw,60px)", fontWeight: 900, letterSpacing: "-2px", lineHeight: 0.95, textTransform: "uppercase", marginBottom: 32, ...titleStyle }}>
                DESIGNER<br />
                <span style={{ 
                  WebkitTextStroke: dark ? "2px #4338CA" : "2px #0EA5E9", 
                  WebkitTextFillColor: "transparent",
                  color: "transparent",
                  backgroundImage: "none", 
                  WebkitBackgroundClip: "initial", 
                  display: "inline-block"
                }}>&</span>
                {" "}DEV
              </h2>
              <p style={{ fontSize: 16, color: dark ? "#C7D2FE" : "#0369A1", lineHeight: 1.9, marginBottom: 18 }}>
                Formada em Comércio Exterior, formanda em Análise e Desenvolvimento de Sistemas e acrobata nas horas vagas.
              </p>
              <p style={{ fontSize: 16, color: dark ? "#C7D2FE" : "#0369A1", lineHeight: 1.9 }}>
                Desenvolvo projetos que cobrem desde lógica de programação, estrutura de dados em C e POO em Java, até interfaces em React + TypeScript e APIs Node.js em produção.
              </p>
            </div>

            {/* COLUNA DA DIREITA*/}
            <div style={{ paddingTop: 8, display: "flex", flexDirection: "column", height: "100%" }}>
              <div style={{ flex: 1 }}>
                {[
                  { label: "Projetista e vendedora", years: "Tintas Fischer, 2019 — 2025" },
                  { label: "Desenvolvedora", years: "Clinicorp Solutions, 2025 — hoje" },
                ].map((sk, i) => (
                  <div key={i} style={{ marginBottom: 36 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontFamily: "'Nasalization', 'Century Gothic', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: dark ? "#C7D2FE" : "#0369A1" }}>{sk.label}</span>
                      <span style={{ fontSize: 12, color: dark ? "#4338CA" : "#0EA5E9" }}>{sk.years}</span>
                    </div>
                    <div style={{ height: 1, background: dark ? "rgba(67,56,202,0.25)" : "rgba(14,165,233,0.2)", borderRadius: 1, overflow: "hidden" }}>
                      <div style={{
                        height: "100%", borderRadius: 1,
                        background: dark ? "linear-gradient(90deg,#3730A3,#C7D2FE)" : "linear-gradient(90deg,#0369A1,#7DD3FC)",
                        width: visible["sobre"] ? "100%" : "0%",
                        transition: `width 1.6s ease ${0.3 + i * 0.2}s`,
                      }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* ── FOTO ── */}
              <div style={{ 
                marginTop: -65,
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
                opacity: visible["sobre"] ? 1 : 0,
                transform: visible["sobre"] ? "translateY(0)" : "translateY(20px)",
                transition: "all 1s ease 0.6s"
              }}>
                <img 
                  src="/AMANDA.png" alt="Amanda"
                  style={{ 
                    maxWidth: "400px", 
                    height: "auto",
                    filter: dark ? "drop-shadow(0 0 20px rgba(67,56,202,0.2))" : "none",
                    WebkitMaskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
                    maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)"
                  }} 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROJETOS ── */}
      <section id="projetos" data-id="projetos" style={{ minHeight: "auto", position: "relative", zIndex: 3, padding: "70px 48px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ 
          textAlign: "center", marginBottom: 64, ...fadeIn("projetos"),
          // ✅ REDUÇÃO DE TAMANHO PARA 80%
          transform: visible["projetos"] ? "scale(0.8)" : "scale(0.8) translateY(44px)"
        }}>
          <p style={{ fontSize: 11, color: dark ? "#4338CA" : "#0EA5E9", letterSpacing: "3px", textTransform: "uppercase", marginBottom: 16, fontWeight: 600 }}>portfólio</p>
          <h2 style={{ fontFamily: "'Nasalization', 'Century Gothic', sans-serif", fontSize: "clamp(40px,6vw,80px)", fontWeight: 900, letterSpacing: "-2.5px", textTransform: "uppercase", margin: 0, lineHeight: 1, ...titleStyle }}>
            PROJETOS
          </h2>
        </div>
        <div style={{ 
          display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 24, maxWidth: 1100, width: "100%",
          // ✅ REDUÇÃO DE TAMANHO PARA 80% NO GRID
          transform: "scale(0.8)", transformOrigin: "top center"
        }}>
          {PROJECTS.map((p, i) => (
            <div key={i} style={{
              background: dark ? "rgba(30,27,75,0.55)" : "rgba(224,242,254,0.55)",
              backdropFilter: "blur(20px)",
              borderRadius: 24, padding: "36px 32px",
              border: dark ? "1px solid rgba(67,56,202,0.35)" : "1px solid rgba(125,211,252,0.6)",
              boxShadow: dark ? "0 8px 32px rgba(30,27,75,0.3)" : "0 8px 32px rgba(14,165,233,0.07)",
              cursor: "pointer",
              ...fadeIn("projetos", i * 0.15),
              transition: "all 0.3s ease",
            }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = dark ? "0 24px 56px rgba(67,56,202,0.3)" : "0 24px 56px rgba(14,165,233,0.16)";
                e.currentTarget.style.translate = "0 -6px";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = dark ? "0 8px 32px rgba(30,27,75,0.3)" : "0 8px 32px rgba(14,165,233,0.07)";
                e.currentTarget.style.translate = "0 0";
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: dark ? "linear-gradient(135deg,rgba(67,56,202,0.3),rgba(55,48,163,0.4))" : "linear-gradient(135deg,rgba(224,242,254,0.6),rgba(14,165,233,0.2))",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, marginBottom: 22,
                border: dark ? "1px solid rgba(67,56,202,0.4)" : "1px solid rgba(125,211,252,0.25)",
                color: dark ? "#C7D2FE" : "#0EA5E9",
              }}>
                {p.emoji}
              </div>
              <h3 style={{ fontFamily: "'Nasalization', 'Century Gothic', sans-serif", fontSize: 18, fontWeight: 700, color: dark ? "#EEF2FF" : "#0369A1", margin: "0 0 12px", letterSpacing: "0.5px", textTransform: "uppercase" }}>
                {p.title}
              </h3>
              <p style={{ fontSize: 14, color: dark ? "#C7D2FE" : "#0369A1", lineHeight: 1.75, margin: "0 0 22px" }}>
                {p.desc}
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {p.tags.map(tag => (
                  <span key={tag} style={{ padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: dark ? "rgba(67,56,202,0.15)" : "rgba(14,165,233,0.1)", color: dark ? "#C7D2FE" : "#0EA5E9", border: dark ? "1px solid rgba(67,56,202,0.3)" : "1px solid rgba(14,165,233,0.2)", letterSpacing: "0.5px", textTransform: "uppercase" }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CONTATO ── */}
      <section id="contato" data-id="contato" style={{ 
          minHeight: "auto", 
          position: "relative", 
          zIndex: 3, 
          display: "flex", 
          alignItems: "center",
          justifyContent: "center", 
          padding: "70px 48px -3px 48px"
        }}>
          <div style={{ 
            width: "100%", 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            textAlign: "center",
            transform: visible["contato"] ? "scale(0.8) translateY(20px)" : "scale(0.8) translateY(60px)",
            transformOrigin: "center center", 
            transition: "transform 1s ease"
          }}>
          <div style={fadeIn("contato")}>
            <p style={{ fontSize: 11, color: dark ? "#4338CA" : "#0EA5E9", letterSpacing: "3px", textTransform: "uppercase", marginBottom: 18, fontWeight: 600 }}>let's talk</p>
            <h2 style={{ fontFamily: "'Nasalization', 'Century Gothic', sans-serif", fontSize: "clamp(52px,8vw,100px)", fontWeight: 900, color: dark ? "#EEF2FF" : "#0369A1", letterSpacing: "-3px", lineHeight: 0.9, textTransform: "uppercase", margin: "0 0 28px", ...titleStyle }}>
              ENTRE EM<br />
              <span style={{ 
                WebkitTextStroke: dark ? "2.5px #4338CA" : "2.5px unset", 
                WebkitTextFillColor: "transparent",
                color: dark ? "transparent" : "unset",
                WebkitBackgroundClip: dark ? "initial" : "text",
                fontSize: "clamp(52px,8vw,100px)", 
                fontWeight: 900, 
                letterSpacing: "25px", 
                lineHeight: 0.9, 
                whiteSpace: "nowrap" 
              }}>CONTATO</span>
            </h2>
            <p style={{ fontSize: 17, color: dark ? "#C7D2FE" : "#0369A1", lineHeight: 1.75, marginBottom: 55 }}>
              Tem um projeto em mente? Me chama
            </p>
          </div>
          
          <div style={{ 
            maxWidth: 640, 
            width: "100%", 
            borderRadius: 28, 
            overflow: "hidden", 
            border: dark ? "1px solid rgba(67,56,202,0.3)" : "1px solid rgba(14,165,233,0.25)", 
            ...fadeIn("contato", 0.3) 
          }}>
            {[
              {
                icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill={dark ? "#FFFFFF" : "#ff73e8"} xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4ZM20 6.04L12 11L4 6.04V18H20V6.04ZM12 9.06L19.25 4.5H4.75L12 9.06Z" fill={dark ? "#FFFFFF" : "#ff73e8"}/></svg>
                ),
                label: "E-mail", 
                value: "aamandabraun@gmail.com", 
                href: "https://mail.google.com/mail/?view=cm&fs=1&to=aamandabraun@gmail.com"
              },
              { 
                icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill={dark ? "#FFFFFF" : "#ff73e8"} xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
                    <path d="M19 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.11 21 21 20.11 21 19V5C21 3.9 20.11 3 19 3ZM8.32 18.06H5.66V9.06H8.32V18.06ZM6.99 7.94C6.11 7.94 5.39 7.23 5.39 6.35C5.39 5.47 6.11 4.76 6.99 4.76C7.87 4.76 8.58 5.47 8.58 6.35C8.58 7.23 7.87 7.94 6.99 7.94ZM18.34 18.06H15.68V13.68C15.68 12.63 15.66 11.28 14.16 11.28C12.66 11.28 12.63 12.61 12.63 13.61V18.06H9.97V9.06H12.63V10.29H12.67C13.04 9.66 13.92 8.99 15.22 8.99C17.92 8.99 18.34 10.77 18.34 13.06V18.06Z" fill={dark ? "#FFFFFF" : "#ff73e8"}/></svg>
                ),
                label: "LinkedIn", 
                value: "/aamandabraun", 
                href: "https://www.linkedin.com/in/aamandabraun/" 
              },
              { 
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill={dark ? "#FFFFFF" : "#ff73e8"} xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
                    <path d="M12 2.25C6.61 2.25 2.25 6.61 2.25 12C2.25 16.32 5.05 19.96 8.95 21.26C9.44 21.35 9.61 21.05 9.61 20.79V19.14C6.9 19.74 6.32 18.08 6.32 18.08C5.87 16.96 5.23 16.66 5.23 16.66C4.34 16.05 5.29 16.06 5.29 16.06C6.27 16.13 6.78 17.06 6.78 17.06C7.65 18.57 9.08 18.13 9.65 17.88C9.74 17.26 9.99 16.83 10.26 16.59C8.08 16.35 5.81 15.5 5.81 11.75C5.81 10.68 6.19 9.8 6.81 9.11C6.71 8.86 6.37 7.86 6.9 6.5C6.9 6.5 7.73 6.24 9.61 7.51C10.4 7.29 11.25 7.18 12.1 7.18C12.95 7.18 13.8 7.29 14.59 7.51C16.47 6.24 17.3 6.5 17.3 6.5C17.83 7.86 17.49 8.86 17.39 9.11C18.02 9.8 18.39 10.68 18.39 11.75C18.39 15.51 16.11 16.35 13.93 16.59C14.28 16.9 14.59 17.49 14.59 18.42V20.79C14.59 21.05 14.77 21.36 15.26 21.26C19.16 19.95 21.96 16.32 21.96 12C21.96 6.61 17.6 2.25 12 2.25Z" fill={dark ? "#FFFFFF" : "#ff73e8"}/></svg>
                ),
                label: "GitHub", 
                value: "@aamandabraun", 
                href: "https://github.com/aamandabraun" 
              },
            ].map((item, i) => (
            <a key={i} href={item.href} target="_blank" rel="noopener noreferrer" 
                style={{ 
                  display: "flex", alignItems: "center", gap: 20, padding: "22px 32px", 
                  textDecoration: "none", 
                  background: dark ? "rgba(30,27,75,0.6)" : "rgba(224,242,254,0.6)", 
                  borderBottom: i < 2 ? (dark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(14,165,233,0.15)") : "none", 
                  transition: "all 0.4s ease" 
                }}
                onMouseEnter={e => { 
                  e.currentTarget.style.background = "transparent"; 
                  e.currentTarget.style.paddingLeft = "40px"; 
                  e.currentTarget.style.backdropFilter = "blur(4px)"; 
                }}
                onMouseLeave={e => { 
                  e.currentTarget.style.background = dark ? "rgba(30,27,75,0.6)" : "rgba(224,242,254,0.6)"; 
                  e.currentTarget.style.paddingLeft = "32px"; 
                  e.currentTarget.style.backdropFilter = "blur(16px)";
                }}>
                <span style={{ fontSize: 22 }}>{item.icon}</span>
                <div style={{ textAlign: "left", flex: 1 }}>
                  <div style={{ fontSize: 10, color: dark ? "#4338CA" : "#0EA5E9", letterSpacing: "1.5px", textTransform: "uppercase", fontWeight: 700 }}>{item.label}</div>
                  <div style={{ fontSize: 15, color: dark ? "#EEF2FF" : "#0369A1", fontWeight: 600, marginTop: 3 }}>{item.value}</div>
                </div>
                <span style={{ color: dark ? "#C7D2FE" : "#0EA5E9", fontSize: 18 }}>↗</span>
              </a>
            ))}
          </div>
          <p style={{ ...fadeIn("contato", 0.5), marginTop: 24, fontSize: 13, color: dark ? "#4338CA" : "#0EA5E9" }}>© 2026 Amanda Braun</p>
        </div>
      </section>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@400;700;900&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html { scroll-behavior:smooth; }
        html, body { height:auto; overflow-y:scroll; overflow-x:hidden; background: var(--bg); transition: background 0.4s ease; }
        :root[data-theme="light"] { --bg: #F0F9FF; }
        :root[data-theme="dark"]  { --bg: #1E1B4B; }
        body::after { content: ""; position: fixed; inset: 0; z-index: 9999; pointer-events: none; opacity: 0.06; mix-blend-mode: screen; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.80' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)'/%3E%3C/svg%3E"); background-size: 180px 180px; background-repeat: repeat; }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:rgba(14,165,233,0.4); border-radius:3px; }
        @keyframes bounce { 0%,100% { transform:translateX(-50%) translateY(0); } 50% { transform:translateX(-50%) translateY(8px); } }
        @keyframes blobMorph { 0%,100% { border-radius: 30% 70% 55% 45% / 60% 35% 65% 40%; } 25% { border-radius: 55% 45% 30% 70% / 40% 65% 35% 60%; } 50% { border-radius: 70% 30% 60% 40% / 55% 40% 60% 45%; } 75% { border-radius: 45% 55% 70% 30% / 35% 60% 40% 65%; } }
        @keyframes blobMorph2 { 0%,100% { border-radius: 70% 30% 40% 60% / 35% 65% 35% 65%; } 33% { border-radius: 40% 60% 70% 30% / 65% 35% 65% 35%; } 66% { border-radius: 55% 45% 35% 65% / 45% 55% 45% 55%; } }
      `}</style>
    </div>
  );
}