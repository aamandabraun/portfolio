import './App.css';
import { useEffect, useState } from "react";

const PROJECTS = [
  {
    title: "Caixa do Mundo",
    short: "Uma viagem por mês sem sair do sofá. Carimbe seu passaporte!",
    desc: "Plataforma fullstack de clube de livros por assinatura. Backend em Node.js com Prisma + PostgreSQL, frontend com React Router + Tailwind, pagamentos recorrentes via Stripe com webhooks, autenticação JWT e e-mails transacionais com Resend. Deploy automatizado no Render (Docker) e Vercel, com documentação via Swagger.",
    tags: ["Fullstack", "Stripe", "API REST"],
    site: "https://caixa-do-mundo.vercel.app/",
    github: "https://github.com/aamandabraun/book-club-api",
    gif: "/demo-caixa.gif",
    wip: false,
  },
  {
    title: "Bicho Solto",
    short: "Animais que mentem, fogem e embaralham. Você consegue pegá-los?",
    desc: "Jogo da memória onde os bichos fogem, cartas se embaralham, clicks desviados e mesa que vira. Desenvolvido com TypeScript puro, sem frameworks, com animações CSS e lógica de estado customizada. Foco em manipulação do DOM, eventos e controle de tempo.",
    tags: ["Jogo", "Responsivo", "Typescript"],
    site: "https://bicho-solto.vercel.app/",
    github: "https://github.com/aamandabraun/bicho-solto",
    gif: "/demo-bicho.gif",
    wip: false,
  },
  {
    title: "Tintas Fischer",
    short: "Loja virtual com catálogo completo, identidade visual e gestão de produtos",
    desc: "Implementação completa de e-commerce para loja física de tintas na plataforma Moovin. Responsável por cadastro de toda a linha de produtos com descrições, pesos e variações, criação de artes institucionais e configuração de frete e pagamentos. Loja em produção com identidade visual consistente.",
    tags: ["E-commerce", "Negócios", "Product Manager"],
    site: "https://www.lojatintasfischer.com.br/",
    gif: "/demo-tintas.gif",
    wip: false,
  },
  {
    title: "BarbiApp",
    short: "Gestão completa de academia no bolso — do check-in ao treino.",
    desc: "Plataforma multi-tenant para gestão de academias com app mobile em React Native + Expo e painel web em Next.js. API em NestJS com Prisma + PostgreSQL, autenticação JWT com refresh token e arquitetura em monorepo via Turborepo. Stack 100% TypeScript.",
    tags: ["Aplicativo", "Negócios", "Multi-tenant"],
    site: null,
    wip: true,
  },
  {
    title: "É Vero?",
    short: "O seu voto não precisa ser no escuro.",
    desc: "Ferramenta de inteligência política com LLM para cruzar valores do eleitor com planos de governo. Interface web com ranking de aderência por candidato e painel de acompanhamento de mandato com PLs em tempo real. Validada no Techstars Startup Weekend com 10 vendas em 2 horas.",
    tags: ["Inteligência Artificial", "Negócios", "FastAPI"],
    site: null,
    wip: true,
  },
];

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("sobre");
  const [visible, setVisible] = useState({});
  const [scrollProgress, setScrollProgress] = useState(0);
  const [dark, setDark] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);

  const toggleProject = (i) => setOpenIndex(openIndex === i ? null : i);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setDark(mq.matches);
    const handler = (e) => setDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible((v) => ({ ...v, [e.target.dataset.id]: true }));
            setActiveSection(e.target.dataset.id);
          }
        }),
      { threshold: 0.3 }
    );
    const timer = setTimeout(() => {
      document.querySelectorAll("[data-id]").forEach((el) => obs.observe(el));
    }, 200);
    return () => {
      clearTimeout(timer);
      obs.disconnect();
    };
  }, []);

  useEffect(() => {
  const moveBlobs = (x, y) => {
    const main = document.getElementById("blob-main");
    const sec  = document.getElementById("blob-secondary");
    const isMobile = window.innerWidth <= 640;
    const f = isMobile ? 1.2 : 0.6;
    const fs = isMobile ? -0.9 : -0.4;
    if (main) {
      main.style.left = `${50 + (x - 50) * f}%`;
      main.style.top  = `${50 + (y - 50) * f}%`;
    }
    if (sec) {
      sec.style.left = `${50 + (x - 50) * fs}%`;
      sec.style.top  = `${50 + (y - 50) * fs}%`;
    }
  };

  const onMove  = (e) => moveBlobs(
    (e.clientX / window.innerWidth)  * 100,
    (e.clientY / window.innerHeight) * 100
  );
  const onTouch = (e) => {
    const t = e.touches[0];
    moveBlobs(
      (t.clientX / window.innerWidth)  * 100,
      (t.clientY / window.innerHeight) * 100
    );
  };

  if (window.innerWidth <= 640) {
    window.addEventListener("touchstart", onTouch, { passive: true });
    window.addEventListener("touchmove",  onTouch, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("touchmove",  onTouch);
    };
  } else {
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }
}, []);

useEffect(() => {
  const onScroll = () => {
  const isMobile = window.innerWidth <= 640;
  const factor = isMobile ? 1 : 1.35;
  const total = document.body.scrollHeight - window.innerHeight;
  const progress = Math.min((window.scrollY / total) * 100 * factor, 100);
  setScrollProgress(progress);
  };
  window.addEventListener("scroll", onScroll);
  return () => window.removeEventListener("scroll", onScroll);
}, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const c = {
    eyebrow:    dark ? "#4338CA"                  : "#0EA5E9",
    line:       dark ? "rgba(67,56,202,0.35)"      : "rgba(14,165,233,0.25)",
    dot:        "#4338CA",
    cardBg:     dark ? "rgba(30,27,75,0.60)"       : "rgba(224,242,254,0.55)",
    cardBorder: dark ? "rgba(67,56,202,0.40)"      : "rgba(125,211,252,0.65)",
    cardOpen:   dark ? "#7DD3FC"                  : "#0EA5E9",
    title:      dark ? "#EEF2FF"                  : "#0369A1",
    titleOpen:  dark ? "#7DD3FC"                  : "#0EA5E9",
    short:      dark ? "rgba(199,210,254,0.75)"    : "#0369A1",
    desc:       dark ? "rgba(199,210,254,0.80)"    : "#0369A1",
    tagBg:      dark ? "rgba(67,56,202,0.20)"      : "rgba(14,165,233,0.10)",
    tagColor:   dark ? "#C7D2FE"                  : "#0EA5E9",
    tagBorder:  dark ? "rgba(67,56,202,0.45)"      : "rgba(14,165,233,0.30)",
    wipBg:      "rgba(186,117,23,0.20)",
    wipColor:   "#FAC775",
    wipBorder:  "rgba(186,117,23,0.45)",
    divider:    dark ? "rgba(67,56,202,0.25)"      : "rgba(14,165,233,0.20)",
    gifBg:      dark ? "rgba(30,27,75,0.80)"       : "rgba(186,230,253,0.35)",
    gifBorder:  dark ? "rgba(67,56,202,0.30)"      : "rgba(14,165,233,0.20)",
    btnColor:   dark ? "#C7D2FE"                  : "#0EA5E9",
    btnBorder:  dark ? "rgba(199,210,254,0.40)"    : "rgba(14,165,233,0.40)",
  };

  const titleGradient = dark
    ? { color: "#EEF2FF" }
    : {
        background: "linear-gradient(135deg, #0EA5E9 20%, #1E40AF 70%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      };

  const fadeIn = (id, delay = 0) => ({
    opacity: visible[id] ? 1 : 0,
    transform: visible[id] ? "translateY(0)" : "translateY(44px)",
    transition: `opacity 1s ease ${delay}s, transform 1s ease ${delay}s`,
  });

  const cardFadeIn = (delay = 0) => ({
    opacity: visible["projetos"] ? 1 : 0,
    transform: visible["projetos"] ? "translateY(0)" : "translateY(44px)",
    transition: `opacity 1s ease ${delay}s, transform 1s ease ${delay}s`,
  });

  return (
    <div style={{ fontFamily: "'Unbounded', sans-serif" }}>

      {/* ── BLOBS ── */}
      <div style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none", overflow: "hidden" }}>
        <div id="blob-main" style={{
          position: "absolute",
          width: 450, height: 600,
          borderRadius: "30% 70% 55% 45% / 60% 35% 65% 40%",
          background: dark
            ? "conic-gradient(from 0deg, #312d5e, #372eb2, #7c31a2)"
            : "conic-gradient(from 0deg, #7DD3FC, #f874fd, #e8fb3ce4)",
          filter: "blur(30px)",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          transition: "top 0.15s ease, left 0.15s ease, background 0.6s ease",
          animation: "blobMorph 5s ease-in-out infinite",
        }} />
        <div id="blob-secondary" style={{
          position: "absolute",
          width: 950, height: 800,
          borderRadius: "70% 30% 40% 60% / 35% 65% 35% 65%",
          background: dark
            ? "conic-gradient(from 180deg, #312E81, #2c2393, #047e99, #7e12b4, #312d5e)"
            : "conic-gradient(from 180deg, #9ab0ed, #7DD3FC, #A855F7, #f874fd, #e8fb3c)",
          filter: "blur(40px)",
          opacity: dark ? 0.9 : 0.8,
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          transition: "top 0.9s ease, left 0.9s ease, background 0.6s ease",
          animation: "blobMorph2 7s ease-in-out infinite",
        }} />
      </div>

      {/* ── NAV ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "22px 24px",
      }}>
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
              position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)",
              width: 6, height: 6, borderRadius: "50%",
              background: dark ? "#EEF2FF" : "#F0F9FF",
              boxShadow: dark
                ? "0 0 8px 3px rgba(199,210,254,0.5)"
                : "0 0 8px 3px rgba(14,165,233,0.5)",
            }} />
          </div>
        </div>

        <span style={{ fontSize: 11, color: dark ? "#C7D2FE" : "#0EA5E9", letterSpacing: "2px" }}>
          aamandabraun.dev
        </span>

        <div className="nav-links" style={{ display: "flex", gap: 32, marginRight: 60 }}>
          {["sobre", "projetos", "contato"].map((s) => (
            <button key={s} onClick={() => scrollTo(s)} style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 13, letterSpacing: "1px", textTransform: "lowercase",
              color: activeSection === s
                ? (dark ? "#C7D2FE" : "#0EA5E9")
                : (dark ? "#4338CA" : "#7DD3FC"),
              fontWeight: activeSection === s ? 700 : 400,
              fontFamily: "'Unbounded', sans-serif", padding: 0, transition: "color 0.3s",
            }}>
              {s}
            </button>
          ))}

            {/* TOGGLE DARK MODE */}
            <button
              onClick={() => setDark((d) => !d)}
              title={dark ? "Modo claro" : "Modo escuro"}
              className="dark-toggle"
              style={{
                width: 38, height: 22, borderRadius: 11,
                border: dark ? "1.5px solid #4338CA" : "1.5px solid #0EA5E9",
                background: dark ? "#312E81" : "#F0F9FF",
                cursor: "pointer", padding: 0,
                transition: "background 0.3s, border 0.3s",
                display: "flex", alignItems: "center", paddingInline: 3,
              }}
            >
              <div style={{
                width: 14, height: 14, borderRadius: "50%",
                background: dark ? "#F0F9FF" : "#0EA5E9",
                transform: dark ? "translateX(16px)" : "translateX(0px)",
                transition: "transform 0.3s, background 0.3s",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {dark ? (
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#312E81"/>
                  </svg>
                ) : (
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="4.5" fill="#F0F9FF"/>
                    <line x1="12" y1="2" x2="12" y2="5" stroke="#F0F9FF" strokeWidth="2.5" strokeLinecap="round"/>
                    <line x1="12" y1="19" x2="12" y2="22" stroke="#F0F9FF" strokeWidth="2.5" strokeLinecap="round"/>
                    <line x1="2" y1="12" x2="5" y2="12" stroke="#F0F9FF" strokeWidth="2.5" strokeLinecap="round"/>
                    <line x1="19" y1="12" x2="22" y2="12" stroke="#F0F9FF" strokeWidth="2.5" strokeLinecap="round"/>
                    <line x1="4.93" y1="4.93" x2="7.05" y2="7.05" stroke="#F0F9FF" strokeWidth="2.5" strokeLinecap="round"/>
                    <line x1="16.95" y1="16.95" x2="19.07" y2="19.07" stroke="#F0F9FF" strokeWidth="2.5" strokeLinecap="round"/>
                    <line x1="4.93" y1="19.07" x2="7.05" y2="16.95" stroke="#F0F9FF" strokeWidth="2.5" strokeLinecap="round"/>
                    <line x1="16.95" y1="7.05" x2="19.07" y2="4.93" stroke="#F0F9FF" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                )}
              </div>
            </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section
        data-id="hero"
        className="hero-section-global"
        style={{
          minHeight: "100vh", position: "relative", zIndex: 2,
          display: "flex", alignItems: "flex-end",
          padding: "0 24px 64px",
        }}
      >
        <div style={{ flex: 1 }}>
          <h1 style={{
            fontFamily: "'Nasalization', 'Century Gothic', sans-serif",
            fontSize: "clamp(48px, 9vw, 120px)",
            fontWeight: 900, letterSpacing: "-3px", lineHeight: 0.88,
            margin: 0, textTransform: "uppercase",
            background: dark ? "none" : "linear-gradient(135deg, #ff73e8 10%, #0EA5E9 30%, #4338CA 70%)",
            WebkitBackgroundClip: dark ? "unset" : "text",
            WebkitTextFillColor: dark ? "#FFFFFF" : "transparent",
            color: dark ? "#FFFFFF" : "transparent",
          }}>
            AMANDA<br />BRAUN
          </h1>
        </div>

        <div className="hero-right" style={{ maxWidth: 500, textAlign: "right" }}>
          <p style={{
            fontSize: "clamp(13px, 1.6vw, 18px)",
            color: dark ? "#C7D2FE" : "#0369A1",
            fontWeight: 500, lineHeight: 1.6, margin: "0 0 24px",
          }}>
            Desenvolvimento fullstack orientado a experiência: do fluxo ao detalhe que ninguém percebe, mas todo mundo sente.
          </p>
          <div style={{ width: "100%" }}>
          <button
            onClick={() => scrollTo("projetos")}
            className="btn-diferenciais"
            style={{
              padding: "13px 30px", borderRadius: 50,
              border: dark ? "2px solid #C7D2FE" : "2px solid #0EA5E9",
              background: "transparent",
              color: dark ? "#C7D2FE" : "#0EA5E9",
              fontSize: 12, fontWeight: 700, cursor: "pointer",
              letterSpacing: "2px", textTransform: "uppercase",
              fontFamily: "'Unbounded', sans-serif", transition: "all 0.25s",
              width: "100%",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = dark ? "#C7D2FE" : "#0EA5E9";
              e.currentTarget.style.color = dark ? "#1E1B4B" : "#F0F9FF";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = dark ? "#C7D2FE" : "#0EA5E9";
            }}
          >
            DIFERENCIAIS
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        </div>

        <div className="scroll-indicator" style={{
          position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
          opacity: 0.45, animation: "bounce 2s ease-in-out infinite",
        }}>
          <span style={{ fontSize: 10, letterSpacing: "2px", color: dark ? "#4338CA" : "#0EA5E9", textTransform: "uppercase" }}>scroll</span>
          <div style={{ width: 1, height: 30, background: dark ? "linear-gradient(#4338CA,transparent)" : "linear-gradient(#0EA5E9,transparent)" }} />
        </div>
      </section>

      {/* ── SOBRE ── */}
      <section
        id="sobre"
        data-id="sobre"
        style={{
          minHeight: "100vh", position: "relative", zIndex: 3,
          display: "flex", alignItems: "center",
          padding: "100px 24px",
        }}
      >
        <div style={{
          maxWidth: 1100, width: "100%", margin: "0 auto",
          background: dark ? "rgba(30,27,75,0.55)" : "rgba(224,242,254,0.55)",
          backdropFilter: "blur(24px)",
          borderRadius: 32, padding: "clamp(32px, 5vw, 64px)",
          border: dark ? "1px solid rgba(67,56,202,0.35)" : "1px solid rgba(125,211,252,0.6)",
          boxShadow: dark ? "0 12px 60px rgba(30,27,75,0.4)" : "0 12px 60px rgba(14,165,233,0.1)",
          ...fadeIn("sobre"),
        }}>
          <div className="sobre-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(32px,5vw,72px)", alignItems: "start" }}>
            <div>
              <p style={{ fontSize: 11, color: dark ? "#4338CA" : "#0EA5E9", letterSpacing: "3px", textTransform: "uppercase", marginBottom: 16, fontWeight: 600 }}>sobre</p>
              <h2 style={{
                fontFamily: "'Nasalization', 'Century Gothic', sans-serif",
                fontSize: "clamp(28px, 4.5vw, 60px)",
                fontWeight: 900, letterSpacing: "-2px", lineHeight: 0.95,
                textTransform: "uppercase", marginBottom: 32,
              }}>
                <span style={{ ...titleGradient, display: "block" }}>DESIGNER</span>
                <span style={{ display: "block" }}>
                  <span style={{
                    WebkitTextStroke: dark ? "2px #4338CA" : "2px #0EA5E9",
                    WebkitTextFillColor: "transparent",
                    color: "transparent",
                  }}>&</span>
                  {" "}
                  <span style={{ ...titleGradient }}>DEV</span>
                </span>
              </h2>
              <p style={{ fontSize: "clamp(14px,1.5vw,16px)", color: dark ? "#C7D2FE" : "#0369A1", lineHeight: 1.9, marginBottom: 18, textAlign: "justify" }}>
                Formada em Comércio Exterior, formanda em Análise e Desenvolvimento de Sistemas e acrobata nas horas vagas.
              </p>
              <p style={{ fontSize: "clamp(14px,1.5vw,16px)", color: dark ? "#C7D2FE" : "#0369A1", lineHeight: 1.9, textAlign: "justify" }}>
                Desenvolvo projetos que cobrem desde lógica de programação a estrutura de dados em C, POO em Java, APIs Node.js em produção e até interfaces em React + TypeScript.
              </p>
            </div>

            <div style={{ paddingTop: 8, display: "flex", flexDirection: "column", height: "100%" }}>
              <div style={{ flex: 1 }}>
                {[
                  { label: "Designer e vendedora", years: "Tintas Fischer, 2019 — 2025" },
                  { label: "Desenvolvedora", years: "Clinicorp Solutions, 2025 — hoje" },
                ].map((sk, i) => (
                  <div key={i} style={{ marginBottom: 36 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, flexWrap: "wrap", gap: 4 }}>
                      <span style={{ fontFamily: "'Nasalization','Century Gothic',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: dark ? "#C7D2FE" : "#0369A1" }}>{sk.label}</span>
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

              <div style={{
                marginTop: -65, width: "100%", display: "flex", justifyContent: "flex-end",
                opacity: visible["sobre"] ? 1 : 0,
                transform: visible["sobre"] ? "translateY(0)" : "translateY(20px)",
                transition: "all 1s ease 0.6s",
              }}>
                <img
                  src="/AMANDA.png" alt="Amanda"
                  style={{
                    maxWidth: "min(400px, 100%)", height: "auto",
                    filter: dark ? "drop-shadow(0 0 20px rgba(67,56,202,0.2))" : "none",
                    WebkitMaskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
                    maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROJETOS ── */}
      <section
        id="projetos"
        data-id="projetos"
        style={{
          minHeight: "100vh", position: "relative", zIndex: 3,
          padding: "70px 24px 100px",
          display: "flex", flexDirection: "column", alignItems: "center",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 56, ...cardFadeIn(0) }}>
          <p style={{ fontSize: 11, color: c.eyebrow, letterSpacing: "3px", textTransform: "uppercase", marginBottom: 16, fontWeight: 600, textAlign: "center" }}>
            portfólio
          </p>
          <h2 style={{
            fontFamily: "'Nasalization', 'Century Gothic', sans-serif",
            fontSize: "clamp(40px, 6vw, 80px)",
            fontWeight: 900, letterSpacing: "-2.5px", textTransform: "uppercase",
            margin: 0, lineHeight: 1, ...titleGradient,
          }}>
            PROJETOS
          </h2>
        </div>

        <div style={{ maxWidth: 1100, width: "100%", position: "relative", paddingLeft: 40 }}>
          <div style={{ position: "absolute", left: 10, top: 8, bottom: 8, width: 1, background: c.line }} />

          {PROJECTS.map((p, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                style={{
                  position: "relative",
                  marginBottom: i < PROJECTS.length - 1 ? 14 : 0,
                  ...cardFadeIn(i * 0.12),
                }}
              >
                <div style={{
                  position: "absolute", left: -34, top: 26,
                  width: 13, height: 13, borderRadius: "50%",
                  background: c.dot,
                  border: `2.5px solid ${dark ? "#1E1B4B" : "#F0F9FF"}`,
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  transform: isOpen ? "scale(1.4)" : "scale(1)",
                  boxShadow: isOpen ? "0 0 0 4px rgba(67,56,202,0.3)" : "none",
                  zIndex: 1,
                }} />

                <div
                  onClick={() => toggleProject(i)}
                  style={{
                    borderRadius: 18,
                    border: `1px solid ${isOpen ? c.cardOpen : c.cardBorder}`,
                    background: c.cardBg,
                    backdropFilter: "blur(20px)",
                    cursor: "pointer",
                    transition: "border-color 0.25s ease, box-shadow 0.25s ease",
                    boxShadow: isOpen
                      ? dark ? "0 16px 56px rgba(67,56,202,0.22)" : "0 16px 56px rgba(14,165,233,0.12)"
                      : "none",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) => { if (!isOpen) e.currentTarget.style.borderColor = c.cardOpen; }}
                  onMouseLeave={(e) => { if (!isOpen) e.currentTarget.style.borderColor = c.cardBorder; }}
                >
                  <div style={{ padding: "22px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, flexWrap: "nowrap" }}>
                      <span style={{ fontFamily: "'Nasalization','Century Gothic',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "2px", color: c.eyebrow, flexShrink: 0 }}>
                        {p.num}
                      </span>
                      <h3 style={{
                        fontFamily: "'Nasalization','Century Gothic',sans-serif",
                        fontSize: "clamp(15px, 2vw, 17px)",
                        fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px",
                        color: c.title,
                        margin: 0, flex: 1, transition: "color 0.25s",
                        minWidth: 0,
                      }}>
                        {p.title}
                      </h3>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                        <svg
                          width="16" height="16" viewBox="0 0 24 24" fill="none"
                          style={{ transition: "transform 0.35s ease", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                        >
                          <path d="M6 9L12 15L18 9" stroke={c.eyebrow} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>

                    <p style={{ fontSize: 13, color: c.short, lineHeight: 1.7, marginBottom: 14 }}>
                      {p.short}
                    </p>

                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {p.tags.map((tag) => (
                        <span key={tag} style={{
                          padding: "4px 13px", borderRadius: 20,
                          fontSize: 10, fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase",
                          background: c.tagBg, color: c.tagColor, border: `1px solid ${c.tagBorder}`,
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{
                    maxHeight: isOpen ? 700 : 0,
                    overflow: "hidden",
                    transition: "max-height 0.5s cubic-bezier(0.4,0,0.2,1)",
                  }}>
                    <div style={{ padding: "0 20px 24px", borderTop: `1px solid ${c.divider}` }}>
                      <div className="card-expanded-grid" style={{ display: "grid", gridTemplateColumns: p.wip ? "1fr" : "1fr 1fr", gap: 24, paddingTop: 22, alignItems: "start" }}>
                        <div>
                          <p style={{ fontSize: 13, color: c.desc, lineHeight: 1.85, marginBottom: 22, textAlign: "justify" }}>
                            {p.desc}
                          </p>
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 22 }}>
                            {p.site ? (
                              <a href={p.site} target="_blank" rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                  display: "inline-flex", alignItems: "center", gap: 8,
                                  padding: "10px 22px", borderRadius: 50,
                                  border: `1.5px solid ${c.btnBorder}`,
                                  background: "transparent", color: c.btnColor,
                                  fontSize: 11, fontWeight: 700, letterSpacing: "1.5px",
                                  textTransform: "uppercase", fontFamily: "'Unbounded', sans-serif",
                                  textDecoration: "none", transition: "all 0.2s",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = dark ? "#C7D2FE" : "#0EA5E9";
                                  e.currentTarget.style.color = dark ? "#1E1B4B" : "#F0F9FF";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = "transparent";
                                  e.currentTarget.style.color = c.btnColor;
                                }}
                              >
                                ACESSE
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ marginLeft: 6 }}>
                                  <path d="M7 17L17 7M17 7H7M17 7V17" stroke={c.btnColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </a>
                            ) : (
                              <span style={{
                                display: "inline-flex", alignItems: "center",
                                padding: "10px 22px", borderRadius: 50,
                                border: `1.5px solid ${c.wipBorder}`,
                                color: c.wipColor,
                                fontSize: 11, fontWeight: 700, letterSpacing: "1.5px",
                                textTransform: "uppercase", fontFamily: "'Unbounded', sans-serif",
                              }}>
                                EM BREVE
                              </span>
                            )}
                            {p.github && (
                              <a href={p.github} target="_blank" rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                  display: "inline-flex", alignItems: "center", gap: 8,
                                  padding: "10px 22px", borderRadius: 50,
                                  border: `1.5px solid ${c.btnBorder}`,
                                  background: "transparent", color: c.btnColor,
                                  fontSize: 11, fontWeight: 700, letterSpacing: "1.5px",
                                  textTransform: "uppercase", fontFamily: "'Unbounded', sans-serif",
                                  textDecoration: "none", transition: "all 0.2s",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = dark ? "#C7D2FE" : "#0EA5E9";
                                  e.currentTarget.style.color = dark ? "#1E1B4B" : "#F0F9FF";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = "transparent";
                                  e.currentTarget.style.color = c.btnColor;
                                }}
                              >
                                CÓDIGO
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ marginLeft: 6 }}>
                                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" stroke={c.btnColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </a>
                            )}
                          </div>
                        </div>

                        {!p.wip && (
                          <div style={{
                            borderRadius: 10, border: `1px solid ${c.gifBorder}`,
                            background: c.gifBg, aspectRatio: "16/9",
                            overflow: "hidden",
                          }}>
                            {p.gif && (
                              <img src={p.gif} alt={`${p.title} demo`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
          </div>)})}
        </div>
      </section>

      {/* ── CONTATO ── */}
      <section
        id="contato"
        data-id="contato"
        style={{
          minHeight: "100vh", position: "relative", zIndex: 3,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "70px 24px 80px",
        }}
      >
        <div style={{
          width: "100%", display: "flex", flexDirection: "column",
          alignItems: "center", textAlign: "center",
          ...fadeIn("contato"),
        }}>
          <p style={{ fontSize: 11, color: dark ? "#4338CA" : "#0EA5E9", letterSpacing: "3px", textTransform: "uppercase", marginBottom: 18, fontWeight: 600 }}>let's talk</p>
          <h2 style={{
            fontFamily: "'Nasalization', 'Century Gothic', sans-serif",
            fontSize: "clamp(40px, 8vw, 100px)",
            fontWeight: 900, letterSpacing: "-3px", lineHeight: 0.9,
            textTransform: "uppercase", margin: "0 0 28px",
            color: "transparent",
          }}>
            <span style={{
              display: "block",
              ...(dark
                ? { color: "#EEF2FF", WebkitTextFillColor: "#EEF2FF" }
                : {
                    background: "linear-gradient(135deg, #0EA5E9 20%, #1E40AF 70%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }),
            }}>ENTRE EM</span>
            <span style={{
              display: "block",
              WebkitTextStroke: dark ? "2.5px #4338CA" : "2.5px #0EA5E9",
              WebkitTextFillColor: "transparent",
              color: "transparent",
              fontSize: "clamp(40px,8vw,100px)",
              fontWeight: 900, letterSpacing: "clamp(4px,2vw,25px)", lineHeight: 0.9,
              whiteSpace: "nowrap",
            }}>CONTATO</span>
          </h2>
          <p style={{ fontSize: "clamp(14px,1.5vw,17px)", color: dark ? "#C7D2FE" : "#0369A1", lineHeight: 1.75, marginBottom: 55 }}>
            Tem um projeto em mente? Me chama
          </p>

          <div style={{
            maxWidth: 640, width: "100%", borderRadius: 28, overflow: "hidden",
            border: dark ? "1px solid rgba(67,56,202,0.3)" : "1px solid rgba(14,165,233,0.25)",
          }}>
            {[
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4ZM20 6.04L12 11L4 6.04V18H20V6.04ZM12 9.06L19.25 4.5H4.75L12 9.06Z" fill={dark ? "#FFFFFF" : "#ff73e8"} />
                  </svg>
                ),
                label: "E-mail", value: "aamandabraun@gmail.com",
                href: "https://mail.google.com/mail/?view=cm&fs=1&to=aamandabraun@gmail.com",
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
                    <path d="M19 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.11 21 21 20.11 21 19V5C21 3.9 20.11 3 19 3ZM8.32 18.06H5.66V9.06H8.32V18.06ZM6.99 7.94C6.11 7.94 5.39 7.23 5.39 6.35C5.39 5.47 6.11 4.76 6.99 4.76C7.87 4.76 8.58 5.47 8.58 6.35C8.58 7.23 7.87 7.94 6.99 7.94ZM18.34 18.06H15.68V13.68C15.68 12.63 15.66 11.28 14.16 11.28C12.66 11.28 12.63 12.61 12.63 13.61V18.06H9.97V9.06H12.63V10.29H12.67C13.04 9.66 13.92 8.99 15.22 8.99C17.92 8.99 18.34 10.77 18.34 13.06V18.06Z" fill={dark ? "#FFFFFF" : "#ff73e8"} />
                  </svg>
                ),
                label: "LinkedIn", value: "/aamandabraun",
                href: "https://www.linkedin.com/in/aamandabraun/",
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
                    <path d="M12 2.25C6.61 2.25 2.25 6.61 2.25 12C2.25 16.32 5.05 19.96 8.95 21.26C9.44 21.35 9.61 21.05 9.61 20.79V19.14C6.9 19.74 6.32 18.08 6.32 18.08C5.87 16.96 5.23 16.66 5.23 16.66C4.34 16.05 5.29 16.06 5.29 16.06C6.27 16.13 6.78 17.06 6.78 17.06C7.65 18.57 9.08 18.13 9.65 17.88C9.74 17.26 9.99 16.83 10.26 16.59C8.08 16.35 5.81 15.5 5.81 11.75C5.81 10.68 6.19 9.8 6.81 9.11C6.71 8.86 6.37 7.86 6.9 6.5C6.9 6.5 7.73 6.24 9.61 7.51C10.4 7.29 11.25 7.18 12.1 7.18C12.95 7.18 13.8 7.29 14.59 7.51C16.47 6.24 17.3 6.5 17.3 6.5C17.83 7.86 17.49 8.86 17.39 9.11C18.02 9.8 18.39 10.68 18.39 11.75C18.39 15.51 16.11 16.35 13.93 16.59C14.28 16.9 14.59 17.49 14.59 18.42V20.79C14.59 21.05 14.77 21.36 15.26 21.26C19.16 19.95 21.96 16.32 21.96 12C21.96 6.61 17.6 2.25 12 2.25Z" fill={dark ? "#FFFFFF" : "#ff73e8"} />
                  </svg>
                ),
                label: "GitHub", value: "@aamandabraun",
                href: "https://github.com/aamandabraun",
              },
            ].map((item, i) => (
              <a key={i} href={item.href} target="_blank" rel="noopener noreferrer"
                style={{
                  display: "flex", alignItems: "center", gap: 20, padding: "22px 32px",
                  textDecoration: "none",
                  background: dark ? "rgba(30,27,75,0.6)" : "rgba(224,242,254,0.6)",
                  borderBottom: i < 2 ? (dark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(14,165,233,0.15)") : "none",
                  transition: "all 0.4s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.paddingLeft = "40px";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = dark ? "rgba(30,27,75,0.6)" : "rgba(224,242,254,0.6)";
                  e.currentTarget.style.paddingLeft = "32px";
                }}
              >
                <span style={{ fontSize: 22, flexShrink: 0 }}>{item.icon}</span>
                <div style={{ textAlign: "left", flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 10, color: dark ? "#4338CA" : "#0EA5E9", letterSpacing: "1.5px", textTransform: "uppercase", fontWeight: 700 }}>{item.label}</div>
                  <div style={{ fontSize: "clamp(12px,2vw,15px)", color: dark ? "#EEF2FF" : "#0369A1", fontWeight: 600, marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.value}</div>
                </div>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                  <path d="M7 17L17 7M17 7H7M17 7V17" stroke={dark ? "#C7D2FE" : "#0EA5E9"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            ))}
          </div>

          <p style={{ marginTop: 24, fontSize: 13, color: dark ? "#4338CA" : "#0EA5E9" }}>© 2026 Amanda Braun</p>
        </div>
      </section>
    </div>
  );
}