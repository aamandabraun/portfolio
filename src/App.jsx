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
          width: 400, height: 550,
          borderRadius: "30% 70% 55% 45% / 60% 35% 65% 40%",
          background: dark
            ? "conic-gradient(from 0deg, #1E1B4B, #3730A3, #4338CA)"
            : "conic-gradient(from 0deg, #7DD3FC, #FDBA74, #FB923C)",
          filter: "blur(45px)",
          opacity: dark ? 0.9 : 0.75,
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          transition: "top 0.15s ease, left 0.15s ease, background 0.6s ease, opacity 0.6s ease",
          animation: "blobMorph 5s ease-in-out infinite",
        }} />

        <div id="blob-secondary" style={{
          position: "absolute",
          width: 900, height: 750,
          borderRadius: "70% 30% 40% 60% / 35% 65% 35% 65%",
          background: dark
            ? "conic-gradient(from 180deg, #312E81, #4338CA, #3730A3, #37336b, #312E81)"
            : "conic-gradient(from 180deg, #FAE8FF, #7DD3FC, #A855F7, #FDBA74, #FB923C)",
          filter: "blur(55px)",
          opacity: dark ? 0.7 : 0.55,
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
          <span style={{ fontSize: 11, color: dark ? "#C7D2FE" : "#0369A1", letterSpacing: "2px", textTransform: "uppercase" }}>Creative Dev</span>
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
          <button onClick={() => scrollTo("contato")} style={{
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
            ENTRE EM CONTATO ↗
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
            <div>
              <p style={{ fontSize: 11, color: dark ? "#4338CA" : "#0EA5E9", letterSpacing: "3px", textTransform: "uppercase", marginBottom: 16, fontWeight: 600 }}>sobre mim</p>
              <h2 style={{ fontFamily: "'Nasalization', 'Century Gothic', sans-serif", fontSize: "clamp(36px,4.5vw,60px)", fontWeight: 900, letterSpacing: "-2px", lineHeight: 0.95, textTransform: "uppercase", marginBottom: 32, ...titleStyle }}>
                DESIGNER<br />
                <span style={{ 
                  WebkitTextStroke: dark ? "2px #4338CA" : "2px #0EA5E9", 
                  WebkitTextFillColor: "transparent",
                  color: "transparent",
                  backgroundImage: "none", 
                  WebkitBackgroundClip: "initial", 
                  display: "inline-block"
                }}>
                  &
                </span>
                {" "}DEV
              </h2>
              <p style={{ fontSize: 16, color: dark ? "#C7D2FE" : "#0369A1", lineHeight: 1.9, marginBottom: 18 }}>
                Formada em Comércio Exterior, formanda em Análise e Desenvolvimento de Sistemas e acrobata nas horas vagas.
              </p>
              <p style={{ fontSize: 16, color: dark ? "#C7D2FE" : "#0369A1", lineHeight: 1.9 }}>
                Tenho construído uma base consistente em Estrutura de Dados, Programação Orientada a Objetos e desenvolvimento de aplicações web, atuando tanto no front quanto no back-end.
              </p>
            </div>
            <div style={{ paddingTop: 8 }}>
              {[
                { label: "Designer imobiliária", years: "Tintas Fischer, 2019 — 2025" },
                { label: "Analista de migração", years: "Clinicorp Solutions, 2025 — hoje" },
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
          padding: "70px 48px 0.5px 48px"
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
            <h2 style={{ fontFamily: "'Nasalization', 'Century Gothic', sans-serif", fontSize: "clamp(52px,8vw,100px)", fontWeight: 900, color: dark ? "#EEF2FF" : "#0369A1", letterSpacing: "-3px", lineHeight: 0.9, textTransform: "uppercase", margin: "0 0 28px" }}>
              ENTRE EM<br />
              <span style={{ 
                WebkitTextStroke: dark ? "2.5px #4338CA" : "2.5px #0EA5E9", 
                WebkitTextFillColor: "transparent",
                color: "transparent",
                WebkitBackgroundClip: "initial",
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
              { icon: "✉️", label: "E-mail", value: "aamandabraun@gmail.com", href: "mailto:aamandabraun@gmail.com" },
              { icon: "💼", label: "LinkedIn", value: "/aamandabraun", href: "https://www.linkedin.com/in/aamandabraun/" },
              { icon: "🐙", label: "GitHub", value: "@aamandabraun", href: "https://github.com/aamandabraun" },
            ].map((item, i) => (
              <a key={i} href={item.href} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 20, padding: "22px 32px", textDecoration: "none", background: dark ? "rgba(30,27,75,0.6)" : "rgba(224,242,254,0.6)", backdropFilter: "blur(16px)", borderBottom: i < 2 ? (dark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(14,165,233,0.15)") : "none", transition: "all 0.3s ease" }}>
                <span style={{ fontSize: 22 }}>{item.icon}</span>
                <div style={{ textAlign: "left", flex: 1 }}>
                  <div style={{ fontSize: 10, color: dark ? "#4338CA" : "#0EA5E9", letterSpacing: "1.5px", textTransform: "uppercase", fontWeight: 700 }}>{item.label}</div>
                  <div style={{ fontSize: 15, color: dark ? "#EEF2FF" : "#0369A1", fontWeight: 600, marginTop: 3 }}>{item.value}</div>
                </div>
                <span style={{ color: dark ? "#C7D2FE" : "#0EA5E9", fontSize: 18 }}>↗</span>
              </a>
            ))}
          </div>
          <p style={{ ...fadeIn("contato", 0.5), marginTop: 52, fontSize: 13, color: dark ? "#4338CA" : "#0EA5E9" }}>© 2026 Amanda Braun</p>
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