import { useState, useEffect, useMemo } from "react";
import { supabase } from "./supabase.js";
import { Delete, Share } from "lucide-react";

const SECOES = [
  "FWC-ESP", "FWC-SEL", "CC",
  "MEX", "RSA", "KOR", "CZE", "CAN", "BIH", "QAT", "SUI",
  "BRA", "MAR", "HAI", "SCO", "USA", "PAR", "AUS", "TUR",
  "GER", "CUW", "CIV", "ECU", "NED", "JPN", "SWE", "TUN",
  "BEL", "EGY", "IRN", "NZL", "ESP", "CPV", "KSA", "URU",
  "FRA", "SEN", "IRQ", "NOR", "ARG", "ALG", "AUT", "JOR",
  "POR", "COD", "UZB", "COL", "ENG", "CRO", "GHA", "PAN",
];

export default function Trocas({ user, t, F, MONO }) {
  const [itens, setItens] = useState({});
  const [loading, setLoading] = useState(true);
  const [modo, setModo] = useState("mais");
  const [codigo, setCodigo] = useState("BRA");
  const [display, setDisplay] = useState("");
  const [pop, setPop] = useState(null);

  // Carga inicial
  useEffect(() => {
    let ativo = true;
    async function carregar() {
      const { data, error } = await supabase.from("repetidas").select("*");
      if (!ativo) return;
      if (!error) {
        const map = {};
        (data || []).forEach(r => { map[`${r.code}-${r.num}`] = r; });
        setItens(map);
      }
      setLoading(false);
    }
    carregar();
    return () => { ativo = false; };
  }, []);

  // Realtime
  useEffect(() => {
    const canal = supabase
      .channel("repetidas-sync")
      .on("postgres_changes", { event: "*", schema: "public", table: "repetidas" }, payload => {
        setItens(prev => {
          const next = { ...prev };
          if (payload.eventType === "DELETE") {
            const id = payload.old?.id;
            for (const k of Object.keys(next)) if (next[k].id === id) delete next[k];
          } else {
            const r = payload.new;
            next[`${r.code}-${r.num}`] = r;
          }
          return next;
        });
      })
      .subscribe();
    return () => { supabase.removeChannel(canal); };
  }, []);

  async function aplicar(key, delta) {
    const parts = key.split("-");
    // code pode ter hífen (ex: FWC-ESP), num é sempre o último segmento
    const num = parseInt(parts[parts.length - 1], 10);
    const code = parts.slice(0, -1).join("-");
    const existing = itens[key];

    if (existing) {
      const newQty = existing.qty + delta;
      if (newQty <= 0) {
        setItens(prev => { const n = { ...prev }; delete n[key]; return n; });
        await supabase.from("repetidas").delete().eq("id", existing.id);
      } else {
        const updated = { ...existing, qty: newQty, updated_by: user?.email || null };
        setItens(prev => ({ ...prev, [key]: updated }));
        await supabase.from("repetidas").update({ qty: newQty, updated_by: user?.email || null }).eq("id", existing.id);
      }
    } else if (delta > 0) {
      const nova = { code, num, qty: 1, updated_by: user?.email || null };
      const { data, error } = await supabase.from("repetidas").insert([nova]).select();
      if (!error && data && data[0]) {
        setItens(prev => ({ ...prev, [key]: data[0] }));
      } else if (error) {
        // conflito: busca o existente
        const { data: ex } = await supabase.from("repetidas").select("*").eq("code", code).eq("num", num).maybeSingle();
        if (ex) setItens(prev => ({ ...prev, [key]: ex }));
      }
    }
    setPop(key);
    setTimeout(() => setPop(null), 320);
  }

  function confirmar() {
    if (display === "") return;
    const num = parseInt(display, 10);
    if (isNaN(num) || num < 0) return;
    aplicar(`${codigo}-${num}`, recebendo ? 1 : -1);
    setDisplay("");
  }

  const recebendo = modo === "mais";
  const corModo = recebendo ? t.verde : t.coral;
  const dimModo = recebendo ? t.verdeDim : t.coralDim;

  const total = useMemo(() => Object.values(itens).reduce((a, r) => a + r.qty, 0), [itens]);
  const distintas = Object.keys(itens).length;

  const grupos = useMemo(() => {
    const g = {};
    Object.entries(itens).forEach(([k, row]) => {
      (g[row.code] = g[row.code] || []).push({ key: k, num: row.num, qty: row.qty });
    });
    Object.values(g).forEach(arr => arr.sort((a, b) => a.num - b.num));
    return Object.entries(g).sort((a, b) => SECOES.indexOf(a[0]) - SECOES.indexOf(b[0]));
  }, [itens]);

  function compartilharLista() {
    const linhas = ["🔁 REPETIDAS — Álbum Copa 2026 (FSaid & Romeo)\n"];
    grupos.forEach(([code, arr]) => {
      arr.forEach(({ num, qty }) => {
        linhas.push(`${code} ${String(num).padStart(2, "0")} ×${qty}`);
      });
    });
    linhas.push(`\nTotal: ${total} figurinhas (${distintas} números distintos)`);
    const texto = linhas.join("\n");
    if (navigator.share) navigator.share({ title: "Repetidas — Copa 2026", text: texto });
    else navigator.clipboard.writeText(texto).then(() => alert("Lista copiada!"));
  }

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", color: t.texto3, fontFamily: F, fontSize: 14 }}>
      Carregando...
    </div>
  );

  return (
    <div style={{ padding: "24px 16px 110px", fontFamily: F }}>

      {/* Header */}
      <div className="nj-in" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ color: t.texto3, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em" }}>MOEDA DE TROCA · FERNANDO & ROMEO</div>
          <h1 style={{ margin: "4px 0 0", color: t.texto, fontSize: 34, fontWeight: 800, letterSpacing: "-0.03em" }}>Trocas</h1>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ color: t.ceu, fontSize: 22, fontWeight: 800, fontFamily: MONO, lineHeight: 1 }}>{total}</div>
          <div style={{ color: t.texto3, fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", marginTop: 3 }}>{distintas} FIGURINHAS</div>
        </div>
      </div>

      {/* Interruptor de modo */}
      <div className="nj-in" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3, background: "rgba(0,0,0,0.35)", borderRadius: 14, padding: 3, marginTop: 16, animationDelay: "0.05s" }}>
        {[
          { id: "mais", rotulo: "+ Recebendo", dica: "abrindo pacotes" },
          { id: "menos", rotulo: "− Trocando", dica: "no evento de troca" },
        ].map(m => {
          const ativo = modo === m.id;
          const cor = m.id === "mais" ? t.verde : t.coral;
          const dim = m.id === "mais" ? t.verdeDim : t.coralDim;
          return (
            <button key={m.id} className="nj-press" onClick={() => setModo(m.id)}
              style={{ padding: "10px 4px 8px", borderRadius: 11, border: "none", cursor: "pointer", fontFamily: F, background: ativo ? `rgba(${dim},0.16)` : "transparent" }}>
              <div style={{ color: ativo ? cor : t.texto3, fontSize: 14, fontWeight: 800 }}>{m.rotulo}</div>
              <div style={{ color: ativo ? `rgba(${dim},0.75)` : t.texto3, fontSize: 10, fontWeight: 600, marginTop: 1 }}>{m.dica}</div>
            </button>
          );
        })}
      </div>

      {/* Registro rápido: seletor grudento + teclado */}
      <div className="nj-in" style={{ background: t.vidro, backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", border: `0.5px solid ${t.borda}`, borderRadius: 20, padding: "12px 0 12px", marginTop: 12, animationDelay: "0.1s", overflow: "hidden" }}>

        {/* Seletor de seção — scroll horizontal */}
        <div className="nj-scroll" style={{ display: "flex", gap: 6, overflowX: "auto", padding: "2px 14px 10px" }}>
          {SECOES.map(s => {
            const ativo = codigo === s;
            return (
              <button key={s} className="nj-press" onClick={() => setCodigo(s)}
                style={{ flexShrink: 0, padding: "7px 13px", borderRadius: 99, border: `0.5px solid ${ativo ? `rgba(${dimModo},0.55)` : t.borda}`, cursor: "pointer", fontFamily: MONO, fontSize: 12.5, fontWeight: 800, letterSpacing: "0.04em", background: ativo ? `rgba(${dimModo},0.18)` : "rgba(255,255,255,0.04)", color: ativo ? corModo : t.texto3 }}>
                {s}
              </button>
            );
          })}
        </div>

        {/* Display: BRA 07 */}
        <div style={{ textAlign: "center", minHeight: 40, display: "flex", alignItems: "baseline", justifyContent: "center", gap: 9, padding: "2px 14px 0" }}>
          <span style={{ color: t.texto2, fontSize: 17, fontWeight: 800, fontFamily: MONO, letterSpacing: "0.06em" }}>{codigo}</span>
          <span style={{ color: corModo, fontSize: 28, fontWeight: 800, fontFamily: MONO, letterSpacing: "0.08em" }}>
            {display !== "" ? display.padStart(2, "0") : <span style={{ color: t.texto3, fontSize: 13, fontWeight: 600, fontFamily: F, letterSpacing: 0 }}>nº…</span>}
          </span>
        </div>

        {/* Teclado numérico */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 7, marginTop: 8, padding: "0 14px" }}>
          {["1","2","3","4","5","6","7","8","9","⌫","0","ok"].map(k => (
            <button key={k} className="nj-press"
              onClick={() => {
                if (k === "⌫") setDisplay(d => d.slice(0, -1));
                else if (k === "ok") confirmar();
                else if (display.length < 2) setDisplay(d => d + k);
              }}
              style={{ padding: "13px 0", borderRadius: 13, border: "none", cursor: "pointer",
                fontFamily: k === "ok" ? F : MONO,
                fontSize: k === "ok" ? 14 : 18, fontWeight: 800,
                background: k === "ok" ? `rgba(${dimModo},0.9)` : "rgba(255,255,255,0.07)",
                color: k === "ok" ? "#0b0f14" : t.texto }}>
              {k === "⌫" ? <Delete size={17} style={{ verticalAlign: "-3px" }} /> : k === "ok" ? (recebendo ? "+1" : "−1") : k}
            </button>
          ))}
        </div>
      </div>

      {/* Cabeçalho do estoque */}
      <div className="nj-in" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "20px 4px 10px", animationDelay: "0.15s" }}>
        <span style={{ color: t.texto3, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em" }}>ESTOQUE — toque para {recebendo ? "somar" : "dar"}</span>
        <button className="nj-press" onClick={compartilharLista}
          style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 99, background: `rgba(${t.ceuDim},0.12)`, border: `0.5px solid rgba(${t.ceuDim},0.3)`, color: t.ceu, fontSize: 11.5, fontWeight: 700, cursor: "pointer", fontFamily: F }}>
          <Share size={12} /> Lista
        </button>
      </div>

      {/* Estoque agrupado por seção */}
      {grupos.length === 0 ? (
        <div className="nj-in" style={{ background: t.vidro, border: `0.5px solid ${t.borda}`, borderRadius: 18, padding: "26px 18px", textAlign: "center", color: t.texto2, fontSize: 13, lineHeight: 1.5 }}>
          Estoque vazio. Abra uns pacotes na caçada Legends<br />e registre as repetidas aqui pelo teclado.
        </div>
      ) : grupos.map(([code, arr], gi) => (
        <div key={code} className="nj-in" style={{ marginBottom: 14, animationDelay: `${0.18 + gi * 0.04}s` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", margin: "0 4px 8px" }}>
            <span style={{ color: t.texto, fontSize: 13, fontWeight: 800, fontFamily: MONO, letterSpacing: "0.06em" }}>{code}</span>
            <span style={{ color: t.texto3, fontSize: 11, fontFamily: MONO }}>{arr.reduce((a, x) => a + x.qty, 0)} un.</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
            {arr.map(({ key, num, qty }) => (
              <button key={key}
                className={`nj-press${pop === key ? " nj-pop" : ""}`}
                onClick={() => aplicar(key, recebendo ? 1 : -1)}
                style={{ position: "relative", padding: "11px 0 9px", borderRadius: 13, cursor: "pointer", border: `0.5px solid rgba(${t.ceuDim},0.28)`, background: `rgba(${t.ceuDim},0.10)` }}>
                <div style={{ color: `rgba(${t.ceuDim},0.6)`, fontSize: 8.5, fontWeight: 800, fontFamily: MONO, letterSpacing: "0.08em" }}>{code}</div>
                <div style={{ color: t.ceu, fontSize: 15.5, fontWeight: 800, fontFamily: MONO, marginTop: 1 }}>{String(num).padStart(2, "0")}</div>
                {qty > 1 && (
                  <span style={{ position: "absolute", top: -6, right: -5, background: t.ceu, color: "#0b0f14", fontSize: 10, fontWeight: 800, padding: "1px 6px", borderRadius: 99, border: `2px solid ${t.bg}`, fontFamily: MONO }}>×{qty}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="nj-in" style={{ color: t.texto3, fontSize: 11.5, textAlign: "center", marginTop: 8, lineHeight: 1.5, animationDelay: "0.3s" }}>
        Banco compartilhado com Romeo, em tempo real.<br />Número que não existe no estoque? Ele nasce com ×1.
      </div>
    </div>
  );
}
