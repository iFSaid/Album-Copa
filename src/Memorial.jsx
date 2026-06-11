import { useState, useEffect } from "react";
import { Trophy, ChevronRight, Sun, Moon, LogOut, X } from "lucide-react";

export default function Memorial({
  totalPacotes, totalFigurinhas, totalGasto, mediaPorPacote,
  secoes, tema, setTema, onLogout, t, F, MONO, loadingDados,
}) {
  const [anelOn, setAnelOn] = useState(false);
  const [showSheet, setShowSheet] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnelOn(true), 120);
    return () => clearTimeout(timer);
  }, []);

  const r = 78;
  const circ = 2 * Math.PI * r;

  const stats = [
    { v: loadingDados ? "—" : String(totalPacotes), l: "pacotes abertos" },
    { v: loadingDados ? "—" : String(totalFigurinhas), l: "figurinhas recebidas" },
    { v: loadingDados ? "—" : `R$ ${totalGasto.toFixed(0)}`, l: "investidos na campanha" },
    { v: loadingDados ? "—" : `R$ ${mediaPorPacote.toFixed(2).replace(".", ",")}`, l: "custo médio por pacote" },
  ];

  return (
    <div style={{ padding: "24px 16px 110px", fontFamily: F }}>

      {/* Header */}
      <div className="nj-in" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ color: t.texto3, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em" }}>COPA 2026 · CAMPANHA ENCERRADA</div>
          <h1 style={{ margin: "4px 0 0", color: t.texto, fontSize: 34, fontWeight: 800, letterSpacing: "-0.03em" }}>Álbum</h1>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
          <button className="nj-press" onClick={() => setTema(tema === "dark" ? "light" : "dark")}
            style={{ width: 34, height: 34, borderRadius: 12, background: t.vidro, border: `0.5px solid ${t.borda}`, color: t.texto2, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            {tema === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <button className="nj-press" onClick={onLogout}
            style={{ width: 34, height: 34, borderRadius: 12, background: t.vidro, border: `0.5px solid ${t.borda}`, color: t.texto2, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <LogOut size={15} />
          </button>
        </div>
      </div>

      {/* Círculo central — linha do meio-campo + anel de progresso */}
      <div className="nj-in" style={{ position: "relative", width: 210, height: 210, margin: "22px auto 0", animationDelay: "0.06s" }}>
        <svg width="210" height="210" viewBox="0 0 210 210" style={{ transform: "rotate(-90deg)" }}>
          {/* Linha do meio-campo (tracejada horizontal) */}
          <line x1="105" y1="2" x2="105" y2="208"
            stroke={tema === "dark" ? "rgba(236,244,248,0.10)" : "rgba(19,32,43,0.08)"}
            strokeWidth="2" strokeDasharray="1 7" strokeLinecap="round"
            transform="rotate(90 105 105)" />
          {/* Círculo de giz (tracejado externo) */}
          <circle cx="105" cy="105" r={r + 11} fill="none"
            stroke={tema === "dark" ? "rgba(236,244,248,0.13)" : "rgba(19,32,43,0.10)"}
            strokeWidth="1.5" strokeDasharray="2 9" strokeLinecap="round" />
          {/* Track */}
          <circle cx="105" cy="105" r={r} fill="none"
            stroke={tema === "dark" ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}
            strokeWidth="11" />
          {/* Anel de progresso — sempre 100% */}
          <circle cx="105" cy="105" r={r} fill="none"
            stroke={t.verde} strokeWidth="11" strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={anelOn ? 0 : circ}
            style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.22,1,0.36,1)", filter: `drop-shadow(0 0 14px rgba(${t.verdeDim},0.45))` }} />
          {/* Ponto central */}
          <circle cx="105" cy="105" r="3" fill={tema === "dark" ? "rgba(236,244,248,0.25)" : "rgba(19,32,43,0.20)"} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <Trophy size={26} color="#ffd778" />
          <span style={{ color: t.texto, fontSize: 30, fontWeight: 800, fontFamily: MONO, marginTop: 4, lineHeight: 1 }}>994</span>
          <span style={{ color: t.texto2, fontSize: 11.5, fontWeight: 600, marginTop: 3 }}>de 994 · completo</span>
        </div>
      </div>

      {/* Campanha em números */}
      <div style={{ color: t.texto3, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", margin: "22px 4px 10px" }}>A CAMPANHA EM NÚMEROS</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {stats.map((s, i) => (
          <div key={s.l} className="nj-in" style={{ animationDelay: `${0.1 + i * 0.04}s`, background: t.vidro, backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", border: `0.5px solid ${t.borda}`, borderRadius: 18, padding: "14px 16px" }}>
            <div style={{ color: t.texto, fontSize: 20, fontWeight: 800, fontFamily: MONO }}>{s.v}</div>
            <div style={{ color: t.texto2, fontSize: 11.5, marginTop: 3 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Ver figurinhas */}
      <button className="nj-press nj-in" onClick={() => setShowSheet(true)}
        style={{ animationDelay: "0.28s", width: "100%", marginTop: 14, padding: "15px 16px", background: t.vidro, backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", border: `0.5px solid ${t.borda}`, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", fontFamily: F }}>
        <span style={{ color: t.texto, fontSize: 14, fontWeight: 600 }}>Ver as 994 figurinhas</span>
        <ChevronRight size={17} color={t.texto3} />
      </button>

      {/* Rodapé */}
      <div className="nj-in" style={{ color: t.texto3, fontSize: 11, textAlign: "center", marginTop: 20, lineHeight: 1.6, animationDelay: "0.32s" }}>
        Dados da campanha preservados — nada foi apagado.<br />Álbum 100% completo. Agora é hora das Legends. ⭐
      </div>

      {/* Bottom sheet — lista completa */}
      {showSheet && (
        <div onClick={() => setShowSheet(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", zIndex: 50, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div onClick={e => e.stopPropagation()}
            style={{ width: "100%", maxWidth: 480, maxHeight: "80vh", background: "rgba(16,10,28,0.95)", backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)", border: "0.5px solid rgba(255,255,255,0.14)", borderBottom: "none", borderRadius: "26px 26px 0 0", padding: "14px 0 34px", display: "flex", flexDirection: "column", fontFamily: F }}>
            {/* Handle */}
            <div style={{ width: 38, height: 5, background: "rgba(255,255,255,0.22)", borderRadius: 99, margin: "0 auto 14px" }} />
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", marginBottom: 14 }}>
              <span style={{ color: "#eef4f8", fontSize: 17, fontWeight: 700 }}>994 figurinhas coladas</span>
              <button onClick={() => setShowSheet(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(238,244,248,0.45)", display: "flex" }}>
                <X size={20} />
              </button>
            </div>
            {/* Scroll area */}
            <div className="nj-scroll" style={{ overflowY: "auto", flex: 1, padding: "0 20px" }}>
              {secoes.map(s => (
                <div key={s.code} style={{ marginBottom: 18 }}>
                  <div style={{ color: "rgba(238,244,248,0.55)", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 8 }}>
                    {s.emoji} {s.nome}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {s.nums.map(n => (
                      <span key={n} style={{ fontFamily: MONO, fontSize: 12, padding: "5px 8px", borderRadius: 8, background: "rgba(53,217,119,0.10)", border: "0.5px solid rgba(53,217,119,0.22)", color: "#35d977" }}>
                        {String(n).padStart(2, "0")}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
