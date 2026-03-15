  import { useEffect, useState } from "react";

  const PROJECTS = [
    { title:"Stripe Animation", desc:"Animação 3D interativa de raios com Three.js e WebGL. Os raios respondem ao movimento do mouse em tempo real.", tags:["Three.js","React","WebGL"], emoji:"✦" },
    { title:"Portfolio", desc:"Este portfolio — construído com React e Vite. Mesh gradients animados, scroll fluido e tipografia editorial.", tags:["React","Vite","Canvas"], emoji:"◈" },
    { title:"Projeto 3", desc:"Descrição do seu projeto. Substitua com o que você realmente criou e as tecnologias que utilizou.", tags:["Tag1","Tag2","Tag3"], emoji:"◎" },
  ];

  export default function Portfolio() {
    const [activeSection, setActiveSection] = useState("works");
    const [visible, setVisible]             = useState({});
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
      const obs = new IntersectionObserver(
        entries => entries.forEach(e => {
          if (e.isIntersecting) {
            setVisible(v => ({ ...v, [e.target.dataset.id]:true }));
            setActiveSection(e.target.dataset.id);
          }
        }),
        { threshold:0.2 }
      );
      setTimeout(() => {
        document.querySelectorAll("[data-id]").forEach(el => obs.observe(el));
      }, 100);
      return () => obs.disconnect();
    }, []);

    useEffect(() => {
      const bases = [
        { id:"blob1", bx:30, by:20 },
        { id:"blob2", bx:70, by:30 },
        { id:"blob3", bx:20, by:60 },
        { id:"blob4", bx:60, by:10 },
        { id:"blob5", bx:75, by:75 },
      ];

      const onMove = (e) => {
        const mx = (e.clientX / window.innerWidth  - 0.5) * 2; // -1 a 1
        const my = (e.clientY / window.innerHeight - 0.5) * 2; // -1 a 1

        const strengths = [12, -10, 15, -8, 10];

        bases.forEach((b, i) => {
          const el = document.getElementById(b.id);
          if (el) {
            el.style.left = `${b.bx + mx * strengths[i]}%`;
            el.style.top  = `${b.by + my * strengths[i]}%`;
          }
        });
      };

      window.addEventListener("mousemove", onMove);
      return () => window.removeEventListener("mousemove", onMove);
    }, []);

  useEffect(() => {
    const onScroll = () => {
      const total = document.body.scrollHeight - window.innerHeight;
      const current = window.scrollY;
      setScrollProgress((current / total) * 100);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

    const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });

    const fadeIn = (id, delay=0) => ({
      opacity:   visible[id] ? 1 : 0,
      transform: visible[id] ? "translateY(0)" : "translateY(44px)",
      transition:`opacity 1s ease ${delay}s, transform 1s ease ${delay}s`,
    });

    return (
      <div style={{ fontFamily:"'Sora', sans-serif" }}>

        {/* ── BLOBS ── */}
        <div style={{
          position:"fixed", inset:0, zIndex:0, pointerEvents:"none",
          background:"#fff0ee", overflow:"hidden",
        }}>
          <div id="blob1" style={{ position:"absolute", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle at center, #ff6b9d, #ff3d7f)", filter:"blur(80px)", opacity:0.75, top:"20%", left:"30%", transform:"translate(-50%,-50%)", transition:"top 0.8s ease, left 0.8s ease", animation:"blob1 8s ease-in-out infinite" }}/>
          <div id="blob2" style={{ position:"absolute", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle at center, #ffaa00, #ff6b35)", filter:"blur(90px)", opacity:0.8,  top:"30%", left:"70%", transform:"translate(-50%,-50%)", transition:"top 0.8s ease, left 0.8s ease", animation:"blob2 10s ease-in-out infinite" }}/>
          <div id="blob3" style={{ position:"absolute", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle at center, #c026d3, #9333ea)", filter:"blur(85px)", opacity:0.65, top:"60%", left:"20%", transform:"translate(-50%,-50%)", transition:"top 0.8s ease, left 0.8s ease", animation:"blob3 12s ease-in-out infinite" }}/>
          <div id="blob4" style={{ position:"absolute", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle at center, #f9a8d4, #fb7185)", filter:"blur(70px)", opacity:0.6,  top:"10%", left:"60%", transform:"translate(-50%,-50%)", transition:"top 0.8s ease, left 0.8s ease", animation:"blob4 9s ease-in-out infinite" }}/>
          <div id="blob5" style={{ position:"absolute", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle at center, #fdba74, #f97316)", filter:"blur(75px)", opacity:0.7,  top:"75%", left:"75%", transform:"translate(-50%,-50%)", transition:"top 0.8s ease, left 0.8s ease", animation:"blob5 11s ease-in-out infinite" }}/>
        </div>

        {/* Overlay */}
        <div style={{
          position:"fixed", inset:0, zIndex:0, pointerEvents:"none",
          background:"rgba(253,246,255,0.18)",
        }}/>

        {/* ── NAV ──────────────────────────────────────────── */}
        <nav style={{
          position:"fixed", top:0, left:0, right:0, zIndex:200,
          display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"22px 48px",
        }}>
          {/* linha de progresso */}
          <div style={{
            position:"absolute", bottom:0, left:0,
            height:"2px",
            width:"100%",
            background:"rgba(192,132,252,0.15)",
          }}>
            <div style={{
              height:"100%",
              width:`${scrollProgress}%`,
              background:"linear-gradient(90deg, #ff3d7f, #ff6b35, #ffaa00)",
              transition:"width 0.1s linear",
              position:"relative",
            }}/>
          </div>

          <div style={{
            position:"absolute", right:0, top:"50%",
            transform:"translateY(-50%)",
            width:6, height:6, borderRadius:"50%",
            background:"#ffffff",
            boxShadow:"0 0 8px 3px rgba(255,255,255,0.9), 0 0 16px 4px rgba(255,180,100,0.6)",
          }}/>

          <div style={{ display:"flex", alignItems:"center", gap:18 }}>
            <span style={{ fontWeight:700, fontSize:15, color:"#1a0030", letterSpacing:"-0.2px" }}>
              Amanda Braun
            </span>
            <span style={{ fontSize:11, color:"#b06fd4", letterSpacing:"2px", textTransform:"uppercase" }}>
              Web Developer
            </span>
          </div>
          <div style={{ display:"flex", gap:32 }}>
            {["works","about","contact"].map(s => (
              <button key={s} onClick={() => scrollTo(s)} style={{
                background:"none", border:"none", cursor:"pointer",
                fontSize:13, letterSpacing:"1px", textTransform:"lowercase",
                color: activeSection===s ? "#9333ea" : "#b06fd4",
                fontWeight: activeSection===s ? 700 : 400,
                fontFamily:"inherit", padding:0, transition:"color 0.3s",
              }}>
                {s}
              </button>
            ))}
          </div>
        </nav>

        {/* ══════════════════════════════════════════════════
            SEÇÃO 1 — HERO
        ══════════════════════════════════════════════════ */}
        <section id="works" data-id="works" style={{
          minHeight:"100vh", position:"relative", zIndex:1,
          display:"flex", alignItems:"flex-end",
          padding:"0 48px 64px",
          overflow:"hidden",
        }}>
          {/* WEB DEV fantasma */}
          <div style={{
            position:"absolute", left:32, top:"50%",
            transform:"translateY(-60%)", pointerEvents:"none", userSelect:"none",
            fontSize:"clamp(90px,15vw,180px)", fontWeight:900, lineHeight:0.9,
            color:"rgba(147,51,234,0.08)", letterSpacing:"-4px",
          }}>
            WEB<br/>DEV
          </div>

          {/* Inferior esquerdo: nome */}
          <div style={{ flex:1, ...fadeIn("works") }}>
            <p style={{ fontSize:11, color:"#b06fd4", letterSpacing:"3px", textTransform:"uppercase", marginBottom:14 }}>
              creative
            </p>
            <h1 style={{
              fontSize:"clamp(56px,9vw,120px)", fontWeight:900,
              letterSpacing:"-3px", lineHeight:0.88, margin:0,
              textTransform:"uppercase",
              background:"linear-gradient(135deg, #c026d3, #ff3d7f, #ff6b35, #ff9a00)",
              WebkitBackgroundClip:"text",
              WebkitTextFillColor:"transparent",
              backgroundClip:"text",
            }}>
              AMANDA<br/>BRAUN
            </h1>
          </div>

          {/* Inferior direito: desc */}
          <div style={{ maxWidth:380, textAlign:"right", ...fadeIn("works",0.25) }}>
            <div style={{
              display:"inline-flex", alignItems:"center", gap:8,
              background:"rgba(255,255,255,0.65)", backdropFilter:"blur(12px)",
              borderRadius:30, padding:"6px 16px 6px 10px",
              border:"1px solid rgba(192,132,252,0.35)",
              marginBottom:22,
            }}>
              <span style={{ width:8, height:8, borderRadius:"50%", background:"#22c55e", boxShadow:"0 0 8px #22c55e" }}/>
              <span style={{ fontSize:12, color:"#7e22ce" }}>available for work</span>
            </div>

            <p style={{
              fontSize:"clamp(15px,1.8vw,20px)", color:"#1a0030",
              fontWeight:800, lineHeight:1.3, letterSpacing:"-0.3px",
              textTransform:"uppercase", margin:"0 0 24px",
            }}>
              I BUILD WEBSITES THAT BLEND DESIGN AND CODE INTO MEMORABLE EXPERIENCES.
            </p>

            <button onClick={() => scrollTo("contact")} style={{
              padding:"13px 30px", borderRadius:50,
              border:"2px solid #1a0030", background:"transparent",
              color:"#1a0030", fontSize:12, fontWeight:700,
              cursor:"pointer", letterSpacing:"2px",
              textTransform:"uppercase", fontFamily:"inherit",
              transition:"all 0.25s",
            }}
              onMouseEnter={e=>{e.target.style.background="#1a0030";e.target.style.color="#fdf6ff";}}
              onMouseLeave={e=>{e.target.style.background="transparent";e.target.style.color="#1a0030";}}
            >
              CONTACT ME ↗
            </button>
          </div>

          {/* scroll hint */}
          <div style={{
            position:"absolute", bottom:28, left:"50%", transform:"translateX(-50%)",
            display:"flex", flexDirection:"column", alignItems:"center", gap:6,
            opacity:0.45, animation:"bounce 2s ease-in-out infinite",
          }}>
            <span style={{ fontSize:10, letterSpacing:"2px", color:"#9333ea", textTransform:"uppercase" }}>scroll</span>
            <div style={{ width:1, height:30, background:"linear-gradient(#9333ea,transparent)" }}/>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            SEÇÃO 2 — ABOUT
        ══════════════════════════════════════════════════ */}
        <section id="about" data-id="about" style={{
          minHeight:"100vh", position:"relative", zIndex:1,
          display:"flex", alignItems:"center",
          padding:"120px 48px",
        }}>
          {/* Glassmorphism card */}
          <div style={{
            maxWidth:1100, width:"100%", margin:"0 auto",
            background:"rgba(255,255,255,0.45)",
            backdropFilter:"blur(24px)",
            borderRadius:32, padding:"64px",
            border:"1px solid rgba(255,255,255,0.75)",
            boxShadow:"0 12px 60px rgba(147,51,234,0.1)",
            ...fadeIn("about"),
          }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:72, alignItems:"start" }}>

              {/* Left */}
              <div>
                <p style={{ fontSize:11, color:"#b06fd4", letterSpacing:"3px", textTransform:"uppercase", marginBottom:16 }}>
                  about me
                </p>
                <h2 style={{
                  fontSize:"clamp(36px,4.5vw,60px)", fontWeight:900,
                  color:"#1a0030", letterSpacing:"-2px", lineHeight:0.95,
                  textTransform:"uppercase", marginBottom:32,
                }}>
                  DESIGNER<br/>
                  <span style={{ WebkitTextStroke:"2px #e879f9", color:"transparent" }}>&</span>
                  {" "}DEV
                </h2>
                <p style={{ fontSize:16, color:"#4a2060", lineHeight:1.9, marginBottom:18 }}>
                  Sou desenvolvedora web apaixonada por criar interfaces que unem estética e funcionalidade. Cada projeto é uma oportunidade de transformar ideias em experiências digitais marcantes.
                </p>
                <p style={{ fontSize:16, color:"#4a2060", lineHeight:1.9 }}>
                  Trabalho com React, Three.js e tecnologias modernas para entregar produtos que impressionam — do design ao deploy.
                </p>
              </div>

              {/* Right: skills */}
              <div style={{ paddingTop:8 }}>
                {[
                  { label:"Frontend Development", pct:90 },
                  { label:"UI/UX Design",          pct:80 },
                  { label:"React & Three.js",       pct:85 },
                  { label:"Motion & Animation",     pct:75 },
                ].map((sk,i) => (
                  <div key={i} style={{ marginBottom:30 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                      <span style={{ fontSize:12, fontWeight:700, color:"#2d1a4a", letterSpacing:"0.5px", textTransform:"uppercase" }}>
                        {sk.label}
                      </span>
                      <span style={{ fontSize:12, color:"#b06fd4" }}>{sk.pct}%</span>
                    </div>
                    <div style={{ height:2, background:"rgba(192,132,252,0.2)", borderRadius:2, overflow:"hidden" }}>
                      <div style={{
                        height:"100%", borderRadius:2,
                        background:"linear-gradient(90deg,#9333ea,#e879f9)",
                        width: visible["about"] ? `${sk.pct}%` : "0%",
                        transition:`width 1.4s ease ${0.2+i*0.15}s`,
                      }}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            SEÇÃO 2.5 — PROJECTS
        ══════════════════════════════════════════════════ */}
        <section id="projects" data-id="projects" style={{
          minHeight:"100vh", position:"relative", zIndex:1,
          padding:"120px 48px",
          display:"flex", flexDirection:"column", alignItems:"center",
        }}>
          <div style={{ textAlign:"center", marginBottom:64, ...fadeIn("projects") }}>
            <p style={{ fontSize:11, color:"#b06fd4", letterSpacing:"3px", textTransform:"uppercase", marginBottom:16 }}>
              portfólio
            </p>
            <h2 style={{
              fontSize:"clamp(40px,6vw,80px)", fontWeight:900,
              color:"#1a0030", letterSpacing:"-2.5px",
              textTransform:"uppercase", margin:0, lineHeight:1,
            }}>
              PROJETOS
            </h2>
          </div>

          <div style={{
            display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",
            gap:24, maxWidth:1100, width:"100%",
          }}>
            {PROJECTS.map((p,i) => (
              <div key={i} style={{
                background:"rgba(255,255,255,0.5)",
                backdropFilter:"blur(20px)",
                borderRadius:24, padding:"36px 32px",
                border:"1px solid rgba(255,255,255,0.75)",
                boxShadow:"0 8px 32px rgba(147,51,234,0.07)",
                cursor:"pointer",
                ...fadeIn("projects", i*0.15),
                transition: [
                  `opacity 0.9s ease ${i*0.15}s`,
                  `transform 0.9s ease ${i*0.15}s`,
                  "box-shadow 0.25s",
                  "translate 0.25s",
                ].join(", "),
              }}
                onMouseEnter={e=>{
                  e.currentTarget.style.boxShadow="0 24px 56px rgba(147,51,234,0.16)";
                  e.currentTarget.style.translate="0 -6px";
                }}
                onMouseLeave={e=>{
                  e.currentTarget.style.boxShadow="0 8px 32px rgba(147,51,234,0.07)";
                  e.currentTarget.style.translate="0 0";
                }}
              >
                <div style={{
                  width:48, height:48, borderRadius:14,
                  background:"linear-gradient(135deg,rgba(233,121,249,0.2),rgba(147,51,234,0.3))",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:22, marginBottom:22,
                  border:"1px solid rgba(192,132,252,0.3)",
                }}>
                  {p.emoji}
                </div>
                <h3 style={{ fontSize:20, fontWeight:800, color:"#1a0030", margin:"0 0 12px", letterSpacing:"-0.5px" }}>
                  {p.title}
                </h3>
                <p style={{ fontSize:14, color:"#6b4d8a", lineHeight:1.75, margin:"0 0 22px" }}>
                  {p.desc}
                </p>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                  {p.tags.map(tag => (
                    <span key={tag} style={{
                      padding:"4px 12px", borderRadius:20, fontSize:11, fontWeight:700,
                      background:"rgba(147,51,234,0.1)", color:"#9333ea",
                      border:"1px solid rgba(147,51,234,0.2)",
                      letterSpacing:"0.5px", textTransform:"uppercase",
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            SEÇÃO 3 — CONTACT
        ══════════════════════════════════════════════════ */}
        <section id="contact" data-id="contact" style={{
          minHeight:"100vh", position:"relative", zIndex:1,
          display:"flex", alignItems:"center", justifyContent:"center",
          padding:"120px 48px",
        }}>
          <div style={{ maxWidth:640, width:"100%", textAlign:"center" }}>

            <div style={fadeIn("contact")}>
              <p style={{ fontSize:11, color:"#b06fd4", letterSpacing:"3px", textTransform:"uppercase", marginBottom:18 }}>
                let's talk
              </p>
              <h2 style={{
                fontSize:"clamp(52px,8vw,100px)", fontWeight:900,
                color:"#1a0030", letterSpacing:"-3px", lineHeight:0.9,
                textTransform:"uppercase", margin:"0 0 28px",
              }}>
                GET IN<br/>
                <span style={{ WebkitTextStroke:"2.5px #e879f9", color:"transparent" }}>TOUCH</span>
              </h2>
              <p style={{ fontSize:17, color:"#6b4d8a", lineHeight:1.75, marginBottom:52 }}>
                Tem um projeto em mente? Vamos construir algo incrível juntos.
              </p>
            </div>

            <div style={{
              borderRadius:28, overflow:"hidden",
              border:"1px solid rgba(192,132,252,0.25)",
              ...fadeIn("contact",0.3),
            }}>
              {[
                { icon:"✉️", label:"Email",    value:"amanda@exemplo.com",  href:"mailto:amanda@exemplo.com" },
                { icon:"💼", label:"LinkedIn", value:"/in/amandabraun",     href:"https://linkedin.com" },
                { icon:"🐙", label:"GitHub",   value:"@amandabraun",        href:"https://github.com" },
              ].map((item,i) => (
                <a key={i} href={item.href} target="_blank" rel="noopener noreferrer" style={{
                  display:"flex", alignItems:"center", gap:20,
                  padding:"22px 32px", textDecoration:"none",
                  background:"rgba(255,255,255,0.55)", backdropFilter:"blur(16px)",
                  borderBottom: i<2 ? "1px solid rgba(192,132,252,0.15)" : "none",
                  transition:"background 0.3s, padding-left 0.25s",
                }}
                  onMouseEnter={e=>{e.currentTarget.style.background="rgba(147,51,234,0.07)";e.currentTarget.style.paddingLeft="40px";}}
                  onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.55)";e.currentTarget.style.paddingLeft="32px";}}
                >
                  <span style={{ fontSize:22 }}>{item.icon}</span>
                  <div style={{ textAlign:"left", flex:1 }}>
                    <div style={{ fontSize:10, color:"#b06fd4", letterSpacing:"1.5px", textTransform:"uppercase", fontWeight:700 }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize:15, color:"#1a0030", fontWeight:600, marginTop:3 }}>
                      {item.value}
                    </div>
                  </div>
                  <span style={{ color:"#e879f9", fontSize:18 }}>↗</span>
                </a>
              ))}
            </div>

            <p style={{ ...fadeIn("contact",0.5), marginTop:52, fontSize:13, color:"#b06fd4" }}>
              © 2026 Amanda Braun — Feito com ♥
            </p>
          </div>
        </section>

      <style>{`
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html { scroll-behavior:smooth; }
        html, body { 
          height:auto; 
          overflow-y:scroll;   /* força a scrollbar aparecer */
          overflow-x:hidden;
        }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:rgba(233,121,249,0.4); border-radius:3px; }
        @keyframes bounce {
          0%,100% { transform:translateX(-50%) translateY(0); }
          50%      { transform:translateX(-50%) translateY(8px); }
        }
        @keyframes blob1 {
        0%,100% { transform:translate(-50%,-50%) scale(1); }
        33%     { transform:translate(-40%,-60%) scale(1.15); }
        66%     { transform:translate(-60%,-40%) scale(0.9); }
      }
      @keyframes blob2 {
        0%,100% { transform:translate(-50%,-50%) scale(1); }
        33%     { transform:translate(-60%,-55%) scale(1.1); }
        66%     { transform:translate(-40%,-45%) scale(0.95); }
      }
      @keyframes blob3 {
        0%,100% { transform:translate(-50%,-50%) scale(1); }
        33%     { transform:translate(-45%,-60%) scale(1.2); }
        66%     { transform:translate(-55%,-40%) scale(0.85); }
      }
      @keyframes blob4 {
        0%,100% { transform:translate(-50%,-50%) scale(1); }
        50%     { transform:translate(-55%,-60%) scale(1.1); }
      }
      @keyframes blob5 {
        0%,100% { transform:translate(-50%,-50%) scale(1); }
        50%     { transform:translate(-45%,-45%) scale(1.15); }
      }
      `}</style>
      </div>
    );
  }