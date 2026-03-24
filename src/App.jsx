import { useEffect, useState } from "react";

const PROJECTS = [
  { title:"Stripe Animation", desc:"Animação 3D interativa de raios com Three.js e WebGL. Os raios respondem ao movimento do mouse em tempo real.", tags:["Three.js","React","WebGL"], emoji:"✦" },
  { title:"Portfolio", desc:"Este portfolio — construído com React e Vite. Mesh gradients animados, scroll fluido e tipografia editorial.", tags:["React","Vite","Canvas"], emoji:"◈" },
  { title:"Projeto 3", desc:"Descrição do seu projeto. Substitua com o que você realmente criou e as tecnologias que utilizou.", tags:["Tag1","Tag2","Tag3"], emoji:"◎" },
];

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("sobre");
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
    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth)  * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      const main = document.getElementById("blob-main");
      const sec  = document.getElementById("blob-secondary");
      if (main) {
        main.style.left = `${50 + (x - 50) * 0.6}%`;
        main.style.top  = `${50 + (y - 50) * 0.4}%`;
      }
      if (sec) {
        sec.style.left = `${50 + (x - 50) * -0.4}%`;
        sec.style.top  = `${50 + (y - 50) * -0.4}%`;
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
      const sec  = document.getElementById("blob-secondary");
      if (main) main.style.width  = `400px`; main.style.height = `550px`;
      if (sec)  sec.style.width  = `900px`; sec.style.height = `750px`;
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
    <div style={{ fontFamily:"'Bernoru Ultra', sans-serif" }}>

      {/* ── BLOBS ── */}
      <div style={{
        position:"fixed", inset:0, zIndex:1, pointerEvents:"none",
        overflow:"visible",
      }}>
        <div id="blob-main" style={{
          position:"absolute",
          width:400, height:550,
          borderRadius:"30% 70% 55% 45% / 60% 35% 65% 40%",
          background:"conic-gradient(from 0deg, #1E3A8A, #6D28D9, #C93C9B)",
          filter:"blur(45px)",
          opacity:0.85,
          top:"50%", left:"50%",
          transform:"translate(-50%, -50%)",
          transition:"top 0.15s ease, left 0.15s ease",
          animation:"blobMorph 5s ease-in-out infinite",
        }}/>

        <div id="blob-secondary" style={{
          position:"absolute",
          width:900, height:750,
          borderRadius:"70% 30% 40% 60% / 35% 65% 35% 65%",
          background:"conic-gradient(from 180deg, #FF8A5B, #6366f1, #c026d3, #ff3d7f, #06b6d4)",
          filter:"blur(55px)",
          opacity:0.6,
          top:"50%", left:"50%",
          transform:"translate(-50%, -50%)",
          transition:"top 0.9s ease, left 0.9s ease",
          animation:"blobMorph2 7s ease-in-out infinite",
        }}/>
      </div>

      {/* ── NAV ── */}
      <nav style={{
        position:"fixed", top:0, left:0, right:0, zIndex:200,
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"22px 48px",
      }}>
        <div style={{
          position:"absolute", bottom:0, left:0,
          height:"2px", width:"100%",
          background:"rgba(192,132,252,0.15)",
        }}>
          <div style={{
            height:"100%", width:`${scrollProgress}%`,
            background:"linear-gradient(90deg, #ff9cf2, #ff35da, #ff00d0)",
            transition:"width 0.1s linear",
            position:"relative",
          }}>
            <div style={{
              position:"absolute", right:0, top:"50%",
              transform:"translateY(-50%)",
              width:6, height:6, borderRadius:"50%",
              background:"#ffffffcb",
              boxShadow:"0 0 8px 3px rgba(255, 255, 255, 0.54), 0 0 16px 4px rgba(255, 100, 219, 0.6)",
            }}/>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:18 }}>
          <span style={{ fontSize:11, color:"#ffffff", letterSpacing:"2px", textTransform:"uppercase" }}>
            Creative Dev
          </span>
        </div>
        <div style={{ display:"flex", gap:32 }}>
          {["sobre","projetos","contato"].map(s => (
            <button key={s} onClick={() => scrollTo(s)} style={{
              background:"none", border:"none", cursor:"pointer",
              fontSize:13, letterSpacing:"1px", textTransform:"lowercase",
              color: activeSection===s ? "#ea33d2" : "#d46fbb",
              fontWeight: activeSection===s ? 700 : 400,
              fontFamily:"inherit", padding:0, transition:"color 0.3s",
            }}>
              {s}
            </button>
          ))}
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="sobre" data-id="sobre" style={{
        minHeight:"100vh", position:"relative", zIndex:3,
        display:"flex", alignItems:"flex-end",
        padding:"0 48px 64px",
      }}>
        <div style={{ flex:1, ...fadeIn("sobre") }}>
          <h1 style={{
            fontSize:"clamp(56px,9vw,120px)", fontWeight:900,
            letterSpacing:"-3px", lineHeight:0.88, margin:0,
            textTransform:"uppercase",
            color:"rgba(255, 255, 255, 0.88)"
          }}>
            AMANDA<br/>BRAUN
          </h1>
        </div>

        <div style={{ maxWidth:380, textAlign:"right", ...fadeIn("sobre",0.25) }}>
          <p style={{
            fontSize:"clamp(15px,1.8vw,20px)", color:"#ffffff",
            fontWeight:800, lineHeight:1.3, letterSpacing:"-0.3px",
            textTransform:"uppercase", margin:"0 0 24px",
          }}>
            DESENVOLVIMENTO FULLSTACK ORIENTADO A EXPERIÊNCIA — DO FLUXO AO DETALHE QUE NINGUÉM PERCEBE, MAS TODO MUNDO SENTE.
          </p>
          <button onClick={() => scrollTo("contato")} style={{
            padding:"13px 30px", borderRadius:50,
            border:"2px solid #ffffff", background:"transparent",
            color:"#ffffff", fontSize:12, fontWeight:700,
            cursor:"pointer", letterSpacing:"2px",
            textTransform:"uppercase", fontFamily:"inherit", transition:"all 0.25s",
          }}
            onMouseEnter={e=>{e.target.style.background="#ffffff";e.target.style.color="#862d9f";}}
            onMouseLeave={e=>{e.target.style.background="transparent";e.target.style.color="#ffffff";}}
          >
            ENTRE EM CONTATO ↗
          </button>
        </div>

        <div style={{
          position:"absolute", bottom:28, left:"50%", transform:"translateX(-50%)",
          display:"flex", flexDirection:"column", alignItems:"center", gap:6,
          opacity:0.45, animation:"bounce 2s ease-in-out infinite",
        }}>
          <span style={{ fontSize:10, letterSpacing:"2px", color:"#9333ea", textTransform:"uppercase" }}>scroll</span>
          <div style={{ width:1, height:30, background:"linear-gradient(#9333ea,transparent)" }}/>
        </div>
      </section>

      {/* ── SOBRE ── */}
      <section id="projetos" data-id="projetos" style={{
        minHeight:"100vh", position:"relative", zIndex:3,
        display:"flex", alignItems:"center", padding:"180px 48px",
      }}>
        <div style={{
          maxWidth:1100, width:"100%", margin:"0 auto",
          background:"rgba(255,255,255,0.45)", backdropFilter:"blur(24px)",
          borderRadius:32, padding:"64px",
          border:"1px solid rgba(255,255,255,0.75)",
          boxShadow:"0 12px 60px rgba(147,51,234,0.1)",
          ...fadeIn("projetos"),
        }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:72, alignItems:"start" }}>
            <div>
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
                Formada em Comércio Exterior, formanda em Análise e Desenvolvimento de Sistemas e acrobata nas horas vagas.
                </p>
              <p style={{ fontSize:16, color:"#4a2060", lineHeight:1.9 }}>
                Tenho construído uma base consistente em Estrutura de Dados, Programação Orientada a Objetos e desenvolvimento de aplicações web, atuando tanto no front quanto no back-end.              
              </p>
            </div>
            <div style={{ paddingTop:8 }}>
              {[
                { label:"Designer imobiliária", pct: 2019 - 2025 },
                { label:"Analista de migração", pct: 2025 },
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
                      width: visible["projetos"] ? `${sk.pct}%` : "0%",
                      transition:`width 1.4s ease ${0.2+i*0.15}s`,
                    }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects" data-id="projects" style={{
        minHeight:"100vh", position:"relative", zIndex:3,
        padding:"180px 48px",
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
              background:"rgba(255,255,255,0.5)", backdropFilter:"blur(20px)",
              borderRadius:24, padding:"36px 32px",
              border:"1px solid rgba(255,255,255,0.75)",
              boxShadow:"0 8px 32px rgba(147,51,234,0.07)",
              cursor:"pointer",
              ...fadeIn("projetos", i*0.15),
              transition:[
                `opacity 0.9s ease ${i*0.15}s`,
                `transform 0.9s ease ${i*0.15}s`,
                "box-shadow 0.25s","translate 0.25s",
              ].join(", "),
            }}
              onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 24px 56px rgba(147,51,234,0.16)";e.currentTarget.style.translate="0 -6px";}}
              onMouseLeave={e=>{e.currentTarget.style.boxShadow="0 8px 32px rgba(147,51,234,0.07)";e.currentTarget.style.translate="0 0";}}
            >
              <div style={{
                width:48, height:48, borderRadius:14,
                background:"linear-gradient(135deg,rgba(233,121,249,0.2),rgba(147,51,234,0.3))",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:22, marginBottom:22, border:"1px solid rgba(192,132,252,0.3)",
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

      {/* ── CONTATO ── */}
      <section id="contato" data-id="contato" style={{
        minHeight:"100vh", position:"relative", zIndex:3,
        display:"flex", alignItems:"center", justifyContent:"center",
        padding:"180px 48px",
      }}>
        <div style={{ maxWidth:640, width:"100%", textAlign:"center" }}>
          <div style={fadeIn("contato")}>
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
            ...fadeIn("contato",0.3),
          }}>
            {[
              { icon:"✉️", label:"Email",    value:"amanda@exemplo.com", href:"mailto:amanda@exemplo.com" },
              { icon:"💼", label:"LinkedIn", value:"/in/amandabraun",    href:"https://linkedin.com" },
              { icon:"🐙", label:"GitHub",   value:"@amandabraun",       href:"https://github.com" },
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
          <p style={{ ...fadeIn("contato",0.5), marginTop:52, fontSize:13, color:"#b06fd4" }}>
            © 2026 Amanda Braun — Feito com ♥
          </p>
        </div>
      </section>

      <style>{`
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html { scroll-behavior:smooth; }
        html, body { height:auto; overflow-y:scroll; overflow-x:hidden; }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:rgba(233,121,249,0.4); border-radius:3px; }
        @keyframes bounce {
          0%,100% { transform:translateX(-50%) translateY(0); }
          50%      { transform:translateX(-50%) translateY(8px); }
        }
        @keyframes blobMorph {
          0%,100% { border-radius: 30% 70% 55% 45% / 60% 35% 65% 40%; }
          25%     { border-radius: 55% 45% 30% 70% / 40% 65% 35% 60%; }
          50%     { border-radius: 70% 30% 60% 40% / 55% 40% 60% 45%; }
          75%     { border-radius: 45% 55% 70% 30% / 35% 60% 40% 65%; }
        }
        @keyframes blobMorph2 {
          0%,100% { border-radius: 70% 30% 40% 60% / 35% 65% 35% 65%; }
          33%     { border-radius: 40% 60% 70% 30% / 65% 35% 65% 35%; }
          66%     { border-radius: 55% 45% 35% 65% / 45% 55% 45% 55%; }
        }
      `}</style>
    </div>
  );
}