import { useState, useMemo, useEffect } from "react";
import { supabase } from "./supabase.js";

const LENDAS = [
  { code: "HAK", nome: "Achraf Hakimi", emoji: "🇲🇦" },
  { code: "DAV", nome: "Alphonso Davies", emoji: "🇨🇦" },
  { code: "PUL", nome: "Christian Pulisic", emoji: "🇺🇸" },
  { code: "GAK", nome: "Cody Gakpo", emoji: "🇳🇱" },
  { code: "CR7", nome: "Cristiano Ronaldo", emoji: "🇵🇹" },
  { code: "HAA", nome: "Erling Haaland", emoji: "🇳🇴" },
  { code: "VAL", nome: "Federico Valverde", emoji: "🇺🇾" },
  { code: "WIR", nome: "Florian Wirtz", emoji: "🇩🇪" },
  { code: "DOK", nome: "Jérémy Doku", emoji: "🇧🇪" },
  { code: "BLG", nome: "Jude Bellingham", emoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { code: "MBA", nome: "Kylian Mbappé", emoji: "🇫🇷" },
  { code: "YAM", nome: "Lamine Yamal", emoji: "🇪🇸" },
  { code: "MES", nome: "Lionel Messi", emoji: "🇦🇷" },
  { code: "DIA", nome: "Luis Díaz", emoji: "🇨🇴" },
  { code: "MOD", nome: "Luka Modrić", emoji: "🇭🇷" },
  { code: "SAL", nome: "Mohamed Salah", emoji: "🇪🇬" },
  { code: "CAI", nome: "Moisés Caicedo", emoji: "🇪🇨" },
  { code: "JIM", nome: "Raúl Jiménez", emoji: "🇲🇽" },
  { code: "SON", nome: "Son Heung-min", emoji: "🇰🇷" },
  { code: "VIN", nome: "Vinícius Júnior", emoji: "🇧🇷" },
];

const ACABAMENTOS = [
  { id: "lilas",  label: "Lilás",  cor: "#c9a2ff", rgb: "201,162,255", lightCor: "#7a4fd0" },
  { id: "bronze", label: "Bronze", cor: "#e0a070", rgb: "224,160,112", lightCor: "#9a5c20" },
  { id: "prata",  label: "Prata",  cor: "#dde3ee", rgb: "221,227,238", lightCor: "#7e8ba0" },
  { id: "ouro",   label: "Ouro",   cor: "#ffd778", rgb: "255,215,120", lightCor: "#9a7800" },
];

const ORIGENS = [
  { id: "pacote", label: "Pacote" },
  { id: "troca",  label: "Troca"  },
  { id: "compra", label: "Compra" },
];

const TOTAL_VARIANTES = LENDAS.length * ACABAMENTOS.length;

const css = `
.lg-root * { -webkit-tap-highlight-color: transparent; box-sizing: border-box; }

@keyframes lgShimmer {
  0% { background-position: 200% center; }
  100% { background-position: -200% center; }
}
@keyframes lgFloat {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(-18px, 14px); }
}
@keyframes lgSheetUp {
  from { transform: translateY(40px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
@keyframes lgFadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.lg-card {
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation: lgFadeIn 0.5s ease-out both;
}
.lg-card:active { transform: scale(0.975); }

.lg-seal {
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.25s;
}
.lg-seal:active { transform: scale(0.82); }

.lg-ouro-inner {
  background: linear-gradient(110deg, #9a6c14 18%, #ffe9ad 38%, #d9a23a 55%, #9a6c14 78%) !important;
  background-size: 220% auto !important;
  animation: lgShimmer 3.2s linear infinite;
}

.lg-ring-progress {
  transition: stroke-dashoffset 1.2s cubic-bezier(0.22, 1, 0.36, 1);
}

.lg-seg {
  transition: background 0.25s, color 0.25s;
}

.lg-press { transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s; }
.lg-press:active { transform: scale(0.96); opacity: 0.85; }

@media (prefers-reduced-motion: reduce) {
  .lg-ouro-inner { animation: none; }
  .lg-card, .lg-seal, .lg-ring-progress, .lg-press { transition: none; animation: none; }
}
`;

function Aneis({ lendas, variantes, centerColor, centerSubColor }) {
  const [animado, setAnimado] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimado(true), 150);
    return () => clearTimeout(t);
  }, []);

  const ringOut = { r: 50, c: 2 * Math.PI * 50 };
  const ringIn  = { r: 36, c: 2 * Math.PI * 36 };
  const pLendas = lendas / LENDAS.length;
  const pVar    = variantes / TOTAL_VARIANTES;

  return (
    <div style={{ position: "relative", width: 124, height: 124, flexShrink: 0 }}>
      <svg width="124" height="124" viewBox="0 0 124 124" style={{ transform: "rotate(-90deg)" }}>
        <defs>
          <linearGradient id="lgGradLendas" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8a5cd0" />
            <stop offset="100%" stopColor="#d4b0ff" />
          </linearGradient>
          <linearGradient id="lgGradVar" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c8922a" />
            <stop offset="100%" stopColor="#ffe08a" />
          </linearGradient>
        </defs>
        <circle cx="62" cy="62" r={ringOut.r} fill="none" stroke="rgba(201,162,255,0.12)" strokeWidth="10" />
        <circle cx="62" cy="62" r={ringIn.r}  fill="none" stroke="rgba(255,215,120,0.10)" strokeWidth="10" />
        <circle
          className="lg-ring-progress"
          cx="62" cy="62" r={ringOut.r} fill="none"
          stroke="url(#lgGradLendas)" strokeWidth="10" strokeLinecap="round"
          strokeDasharray={ringOut.c}
          strokeDashoffset={animado ? ringOut.c * (1 - pLendas) : ringOut.c}
        />
        <circle
          className="lg-ring-progress"
          cx="62" cy="62" r={ringIn.r} fill="none"
          stroke="url(#lgGradVar)" strokeWidth="10" strokeLinecap="round"
          strokeDasharray={ringIn.c}
          strokeDashoffset={animado ? ringIn.c * (1 - pVar) : ringIn.c}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ color: centerColor, fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1 }}>{lendas}</span>
        <span style={{ color: centerSubColor, fontSize: 10, fontWeight: 600, marginTop: 2 }}>de {LENDAS.length}</span>
      </div>
    </div>
  );
}

export default function Legends({ user, tema }) {
  const [itens, setItens] = useState({});
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(false);
  const [editor, setEditor] = useState(null);

  useEffect(() => {
    let ativo = true;
    async function carregar() {
      const { data, error } = await supabase.from("legends").select("*");
      if (!ativo) return;
      if (error) { console.error(error); setErro(true); }
      else {
        const map = {};
        (data || []).forEach(r => { map[`${r.player}-${r.finish}`] = r; });
        setItens(map);
      }
      setLoading(false);
    }
    carregar();
    return () => { ativo = false; };
  }, []);

  useEffect(() => {
    const canal = supabase
      .channel("legends-sync")
      .on("postgres_changes", { event: "*", schema: "public", table: "legends" }, payload => {
        setItens(prev => {
          const next = { ...prev };
          if (payload.eventType === "DELETE") {
            const idRemovido = payload.old?.id;
            for (const k of Object.keys(next)) if (next[k].id === idRemovido) delete next[k];
          } else {
            const r = payload.new;
            next[`${r.player}-${r.finish}`] = r;
          }
          return next;
        });
      })
      .subscribe();
    return () => { supabase.removeChannel(canal); };
  }, []);

  async function adicionarVariante(player, finish) {
    const nova = { player, finish, qty: 1, obtained_via: "pacote", valor: 0, updated_by: user?.email || null };
    const { data, error } = await supabase.from("legends").insert([nova]).select();
    if (error) {
      const { data: existente } = await supabase
        .from("legends").select("*").eq("player", player).eq("finish", finish).maybeSingle();
      if (existente) setItens(prev => ({ ...prev, [`${player}-${finish}`]: existente }));
      return;
    }
    if (data && data[0]) {
      setItens(prev => ({ ...prev, [`${player}-${finish}`]: data[0] }));
      setEditor({ player, finish });
    }
  }

  async function atualizarVariante(row, campos) {
    const atualizada = { ...row, ...campos, updated_by: user?.email || null };
    setItens(prev => ({ ...prev, [`${row.player}-${row.finish}`]: atualizada }));
    await supabase.from("legends").update({ ...campos, updated_by: user?.email || null }).eq("id", row.id);
  }

  async function removerVariante(row) {
    setItens(prev => {
      const next = { ...prev };
      delete next[`${row.player}-${row.finish}`];
      return next;
    });
    setEditor(null);
    await supabase.from("legends").delete().eq("id", row.id);
  }

  const stats = useMemo(() => {
    const linhas = Object.values(itens);
    const jogadores = new Set(linhas.map(r => r.player));
    const duplicadas = linhas.reduce((a, r) => a + Math.max((r.qty || 1) - 1, 0), 0);
    const investido = linhas.reduce((a, r) => a + Number(r.valor || 0), 0);
    return { lendas: jogadores.size, variantes: linhas.length, duplicadas, investido };
  }, [itens]);

  function compartilhar() {
    const linhas = ["⭐ LEGENDS — Copa 2026 (FSaid & Romeo)"];
    linhas.push(`${stats.lendas}/20 lendas · ${stats.variantes}/80 variantes\n`);
    const dups = [];
    Object.values(itens).forEach(r => {
      if ((r.qty || 1) > 1) {
        const l = LENDAS.find(x => x.code === r.player);
        const a = ACABAMENTOS.find(x => x.id === r.finish);
        dups.push(`  ${l?.emoji} ${l?.nome} — ${a?.label} (×${r.qty - 1} p/ troca)`);
      }
    });
    if (dups.length) { linhas.push("🔄 DUPLICADAS PARA TROCA:", ...dups, ""); }
    const falta = LENDAS.filter(l => !ACABAMENTOS.some(a => itens[`${l.code}-${a.id}`]));
    if (falta.length) { linhas.push("🔍 AINDA PROCURAMOS:", ...falta.map(l => `  ${l.emoji} ${l.nome}`)); }
    const texto = linhas.join("\n");
    if (navigator.share) navigator.share({ title: "Legends — Copa 2026", text: texto });
    else navigator.clipboard.writeText(texto).then(() => alert("Lista copiada!"));
  }

  const rowEditor  = editor ? itens[`${editor.player}-${editor.finish}`] : null;
  const lendaEditor = editor ? LENDAS.find(l => l.code === editor.player) : null;
  const acabEditor  = editor ? ACABAMENTOS.find(a => a.id === editor.finish) : null;

  const fontStack = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Segoe UI', Roboto, sans-serif";

  const isDark = tema !== "light";

  const lg = isDark ? {
    bg:               "radial-gradient(110% 60% at 50% -8%, #1a1028 0%, #0a0810 55%)",
    orbeTop:          "rgba(138,92,208,0.30)",
    orbeBot:          "rgba(200,146,42,0.16)",
    loadingColor:     "rgba(183,140,240,0.5)",
    title:            "#fff",
    titleDot:         "#b78cf0",
    tag:              "rgba(212,176,255,0.55)",
    subtitle:         "rgba(255,255,255,0.40)",
    chipBg:           "rgba(255,255,255,0.055)",
    chipBorder:       "rgba(255,255,255,0.12)",
    chipLabel:        "rgba(255,255,255,0.40)",
    chipValue:        "#fff",
    shareBg:          "rgba(183,140,240,0.13)",
    shareBorder:      "rgba(183,140,240,0.30)",
    shareColor:       "#d4b0ff",
    cardBg:           "rgba(255,255,255,0.045)",
    cardBorderDef:    "rgba(255,255,255,0.09)",
    cardBorderPart:   "rgba(183,140,240,0.30)",
    playerActive:     "#fff",
    playerInactive:   "rgba(255,255,255,0.45)",
    badgeBg:          "rgba(183,140,240,0.16)",
    badgeColor:       "#d4b0ff",
    sealEmpty:        "rgba(255,255,255,0.07)",
    sealInner:        "#0b0712",
    sealDashOpa:      "0.30",
    sealLabelEmpty:   "rgba(255,255,255,0.25)",
    qtyBadgeBorder:   "#020103",
    centerColor:      "#fff",
    centerSub:        "rgba(255,255,255,0.45)",
    overlay:          "rgba(0,0,0,0.55)",
    sheetBg:          "rgba(26,18,42,0.92)",
    sheetBorder:      "rgba(255,255,255,0.14)",
    sheetHandle:      "rgba(255,255,255,0.22)",
    sheetRowBg:       "rgba(255,255,255,0.06)",
    sheetQtyBg:       "rgba(255,255,255,0.08)",
    sheetLabel:       "#fff",
    sheetSub:         "rgba(255,255,255,0.38)",
    sheetQtyColor:    "#fff",
    sheetQtyPlus:     "#d4b0ff",
    segBg:            "rgba(0,0,0,0.35)",
    segActiveBg:      "rgba(183,140,240,0.85)",
    segActiveColor:   "#14081f",
    segInactiveColor: "rgba(255,255,255,0.55)",
    prefix:           "rgba(255,255,255,0.45)",
    inputBg:          "rgba(0,0,0,0.35)",
    inputBorder:      "rgba(255,255,255,0.14)",
    inputColor:       "#fff",
    updatedColor:     "rgba(255,255,255,0.22)",
  } : {
    bg:               "radial-gradient(110% 60% at 50% -8%, #efe9f8 0%, #f7f4fb 55%)",
    orbeTop:          "rgba(138,92,208,0.18)",
    orbeBot:          "rgba(200,146,42,0.10)",
    loadingColor:     "rgba(122,79,208,0.6)",
    title:            "#221636",
    titleDot:         "#7a4fd0",
    tag:              "rgba(34,22,54,0.45)",
    subtitle:         "rgba(34,22,54,0.55)",
    chipBg:           "rgba(40,20,80,0.05)",
    chipBorder:       "rgba(90,50,160,0.14)",
    chipLabel:        "rgba(34,22,54,0.50)",
    chipValue:        "#221636",
    shareBg:          "rgba(122,79,208,0.08)",
    shareBorder:      "rgba(122,79,208,0.22)",
    shareColor:       "#7a4fd0",
    cardBg:           "rgba(40,20,80,0.05)",
    cardBorderDef:    "rgba(90,50,160,0.14)",
    cardBorderPart:   "rgba(122,79,208,0.30)",
    playerActive:     "#221636",
    playerInactive:   "rgba(34,22,54,0.40)",
    badgeBg:          "rgba(122,79,208,0.12)",
    badgeColor:       "#7a4fd0",
    sealEmpty:        "rgba(90,50,160,0.06)",
    sealInner:        "#e9e2f4",
    sealDashOpa:      "0.50",
    sealLabelEmpty:   "rgba(34,22,54,0.30)",
    qtyBadgeBorder:   "#f7f4fb",
    centerColor:      "#221636",
    centerSub:        "rgba(34,22,54,0.40)",
    overlay:          "rgba(34,22,54,0.35)",
    sheetBg:          "rgba(242,238,252,0.96)",
    sheetBorder:      "rgba(90,50,160,0.18)",
    sheetHandle:      "rgba(34,22,54,0.20)",
    sheetRowBg:       "rgba(90,50,160,0.06)",
    sheetQtyBg:       "rgba(90,50,160,0.08)",
    sheetLabel:       "#221636",
    sheetSub:         "rgba(34,22,54,0.45)",
    sheetQtyColor:    "#221636",
    sheetQtyPlus:     "#7a4fd0",
    segBg:            "rgba(90,50,160,0.10)",
    segActiveBg:      "rgba(122,79,208,0.90)",
    segActiveColor:   "#fff",
    segInactiveColor: "rgba(34,22,54,0.55)",
    prefix:           "rgba(34,22,54,0.45)",
    inputBg:          "rgba(235,225,255,0.7)",
    inputBorder:      "rgba(90,50,160,0.18)",
    inputColor:       "#221636",
    updatedColor:     "rgba(34,22,54,0.30)",
  };

  // Finish color: darker variants for light mode to maintain AA contrast
  const finCor = (a) => isDark ? a.cor : a.lightCor;

  // Silver needs a visible outer ring on light background
  const sealBoxShadow = (a, tem) => {
    if (!tem) return "none";
    const base = `0 0 16px rgba(${a.rgb},0.35), inset 0 0 4px rgba(255,255,255,0.3)`;
    return !isDark && a.id === "prata" ? `${base}, 0 0 0 1.5px rgba(130,140,165,0.45)` : base;
  };

  // Dashed border opacity for empty seals (silver needs more opacity in light mode)
  const sealDashOpa = (a) => !isDark && a.id === "prata" ? "0.65" : lg.sealDashOpa;

  if (loading) {
    return (
      <div className="lg-root" style={{ minHeight: "100vh", background: lg.bg, fontFamily: fontStack, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <style>{css}</style>
        <span style={{ color: lg.loadingColor, fontSize: 14 }}>Carregando Legends...</span>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="lg-root" style={{ minHeight: "100vh", background: lg.bg, fontFamily: fontStack, display: "flex", alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center" }}>
        <style>{css}</style>
        <span style={{ color: "#ff8a8a", fontSize: 14 }}>
          Verifique se a tabela <code style={{ background: "rgba(255,138,138,0.12)", padding: "2px 6px", borderRadius: 4 }}>legends</code> existe no Supabase.
        </span>
      </div>
    );
  }

  return (
    <div className="lg-root" style={{ minHeight: "100vh", background: lg.bg, fontFamily: fontStack, paddingBottom: 110, position: "relative", overflow: "hidden" }}>
      <style>{css}</style>

      {/* Atmosfera: orbes de luz desfocadas */}
      <div style={{ position: "fixed", top: -120, right: -100, width: 340, height: 340, borderRadius: "50%", background: `radial-gradient(circle, ${lg.orbeTop} 0%, transparent 70%)`, filter: "blur(40px)", animation: "lgFloat 14s ease-in-out infinite", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: -80, left: -120, width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle, ${lg.orbeBot} 0%, transparent 70%)`, filter: "blur(40px)", animation: "lgFloat 18s ease-in-out infinite reverse", pointerEvents: "none" }} />

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 16px", position: "relative", zIndex: 1 }}>

        {/* Large title estilo iOS */}
        <div style={{ padding: "26px 4px 4px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div style={{ color: lg.tag, fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", marginBottom: 4 }}>COPA 2026 · EXTRA</div>
            <h1 style={{ margin: 0, color: lg.title, fontSize: 34, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.05 }}>
              Legends<span style={{ color: lg.titleDot }}>.</span>
            </h1>
            <div style={{ color: lg.subtitle, fontSize: 13, fontWeight: 500, marginTop: 6, lineHeight: 1.35 }}>
              {stats.variantes} de {TOTAL_VARIANTES} variantes<br />coleção de Fernando & Romeo
            </div>
          </div>
          <Aneis lendas={stats.lendas} variantes={stats.variantes} centerColor={lg.centerColor} centerSubColor={lg.centerSub} />
        </div>

        {/* Chips de vidro: troca + investido */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 16 }}>
          {[
            { icone: "🔄", label: "Para troca", valor: `${stats.duplicadas} ${stats.duplicadas === 1 ? "extra" : "extras"}` },
            { icone: "💎", label: "Investido",   valor: `R$ ${stats.investido.toFixed(0)}` },
          ].map(c => (
            <div key={c.label} style={{ background: lg.chipBg, backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", border: `0.5px solid ${lg.chipBorder}`, borderRadius: 18, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 18 }}>{c.icone}</span>
              <div>
                <div style={{ color: lg.chipLabel, fontSize: 10, fontWeight: 600, letterSpacing: "0.04em" }}>{c.label.toUpperCase()}</div>
                <div style={{ color: lg.chipValue, fontSize: 15, fontWeight: 700, letterSpacing: "-0.01em" }}>{c.valor}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Botão compartilhar */}
        <button className="lg-press" onClick={compartilhar} style={{ width: "100%", marginTop: 12, padding: "13px", background: lg.shareBg, backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", border: `0.5px solid ${lg.shareBorder}`, borderRadius: 18, color: lg.shareColor, fontSize: 13, fontWeight: 600, fontFamily: fontStack, cursor: "pointer", letterSpacing: "0.01em" }}>
          📤&nbsp; Compartilhar duplicadas e faltantes
        </button>

        {/* Vitrine dos 20 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 22 }}>
          {LENDAS.map((l, idx) => {
            const variantesDoJogador = ACABAMENTOS.filter(a => itens[`${l.code}-${a.id}`]).length;
            const completo = variantesDoJogador === 4;
            return (
              <div
                key={l.code}
                className="lg-card"
                style={{
                  animationDelay: `${Math.min(idx * 0.03, 0.4)}s`,
                  background: completo
                    ? "linear-gradient(135deg, rgba(183,140,240,0.16), rgba(255,215,120,0.10))"
                    : lg.cardBg,
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  border: `0.5px solid ${completo ? "rgba(255,215,120,0.45)" : variantesDoJogador > 0 ? lg.cardBorderPart : lg.cardBorderDef}`,
                  borderRadius: 22,
                  padding: "14px 16px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ color: variantesDoJogador > 0 ? lg.playerActive : lg.playerInactive, fontSize: 15, fontWeight: 650, letterSpacing: "-0.015em" }}>
                    <span style={{ marginRight: 7 }}>{l.emoji}</span>{l.nome}
                  </span>
                  {completo ? (
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#ffd778", letterSpacing: "0.06em" }}>COMPLETO ✦</span>
                  ) : variantesDoJogador > 0 ? (
                    <span style={{ background: lg.badgeBg, color: lg.badgeColor, fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 99 }}>{variantesDoJogador}/4</span>
                  ) : null}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
                  {ACABAMENTOS.map(a => {
                    const row = itens[`${l.code}-${a.id}`];
                    const tem = !!row;
                    const ehOuroTem = tem && a.id === "ouro";
                    return (
                      <button
                        key={a.id}
                        className="lg-seal"
                        onClick={() => tem ? setEditor({ player: l.code, finish: a.id }) : adicionarVariante(l.code, a.id)}
                        style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, fontFamily: fontStack }}
                      >
                        <span style={{
                          position: "relative",
                          width: 46, height: 46, borderRadius: "50%",
                          padding: 2.5,
                          display: "flex",
                          background: tem
                            ? `conic-gradient(from 210deg, rgba(${a.rgb},1), rgba(${a.rgb},0.25), rgba(255,255,255,0.95), rgba(${a.rgb},0.45), rgba(${a.rgb},1))`
                            : lg.sealEmpty,
                          boxShadow: sealBoxShadow(a, tem),
                        }}>
                          <span
                            className={ehOuroTem ? "lg-ouro-inner" : undefined}
                            style={{
                              flex: 1, borderRadius: "50%",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: 16,
                              background: tem
                                ? `radial-gradient(circle at 32% 28%, rgba(${a.rgb},0.55), rgba(${a.rgb},0.14) 70%), #120a1e`
                                : lg.sealInner,
                              border: tem ? "none" : `1px dashed rgba(${a.rgb},${sealDashOpa(a)})`,
                              color: tem ? (a.id === "ouro" ? "#3a2800" : a.cor) : "transparent",
                            }}
                          >
                            ★
                          </span>
                          {tem && (row.qty || 1) > 1 && (
                            <span style={{ position: "absolute", top: -4, right: -6, background: "#ff5d5d", color: "#fff", fontSize: 10, fontWeight: 800, padding: "1px 6px", borderRadius: 99, border: `2px solid ${lg.qtyBadgeBorder}`, fontFamily: fontStack }}>
                              {row.qty}
                            </span>
                          )}
                        </span>
                        <span style={{ fontSize: 9, fontWeight: 650, letterSpacing: "0.07em", color: tem ? finCor(a) : lg.sealLabelEmpty }}>
                          {a.label.toUpperCase()}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Folha inferior estilo iOS */}
      {editor && rowEditor && (
        <div onClick={() => setEditor(null)} style={{ position: "fixed", inset: 0, background: lg.overlay, backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", zIndex: 50, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 480, background: lg.sheetBg, backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)", border: `0.5px solid ${lg.sheetBorder}`, borderBottom: "none", borderRadius: "26px 26px 0 0", padding: "14px 22px 34px", animation: "lgSheetUp 0.38s cubic-bezier(0.22, 1, 0.36, 1)", fontFamily: fontStack }}>
            <div style={{ width: 38, height: 5, background: lg.sheetHandle, borderRadius: 99, margin: "0 auto 18px" }} />

            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ color: lg.sheetLabel, fontSize: 17, fontWeight: 700, letterSpacing: "-0.02em" }}>{lendaEditor?.emoji} {lendaEditor?.nome}</div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 7, padding: "4px 12px", borderRadius: 99, background: `rgba(${acabEditor?.rgb},0.13)`, border: `0.5px solid rgba(${acabEditor?.rgb},0.35)` }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: finCor(acabEditor) }} />
                <span style={{ color: finCor(acabEditor), fontSize: 12, fontWeight: 700, letterSpacing: "0.08em" }}>{acabEditor?.label.toUpperCase()}</span>
              </div>
            </div>

            {/* Quantidade */}
            <div style={{ background: lg.sheetRowBg, borderRadius: 18, padding: "14px 16px", marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ color: lg.sheetLabel, fontSize: 14, fontWeight: 600 }}>Quantidade</div>
                <div style={{ color: lg.sheetSub, fontSize: 11, marginTop: 1 }}>extras viram moeda de troca</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 0, background: lg.sheetQtyBg, borderRadius: 12, overflow: "hidden" }}>
                <button className="lg-press" onClick={() => rowEditor.qty > 1 && atualizarVariante(rowEditor, { qty: rowEditor.qty - 1 })} style={{ width: 42, height: 38, background: "none", border: "none", color: lg.sheetQtyColor, fontSize: 19, cursor: "pointer", fontFamily: fontStack }}>−</button>
                <span style={{ color: lg.sheetQtyColor, fontSize: 16, fontWeight: 700, minWidth: 30, textAlign: "center" }}>{rowEditor.qty}</span>
                <button className="lg-press" onClick={() => atualizarVariante(rowEditor, { qty: (rowEditor.qty || 1) + 1 })} style={{ width: 42, height: 38, background: "none", border: "none", color: lg.sheetQtyPlus, fontSize: 19, cursor: "pointer", fontFamily: fontStack }}>+</button>
              </div>
            </div>

            {/* Origem — controle segmentado iOS */}
            <div style={{ background: lg.sheetRowBg, borderRadius: 18, padding: "14px 16px", marginBottom: 10 }}>
              <div style={{ color: lg.sheetLabel, fontSize: 14, fontWeight: 600, marginBottom: 10 }}>Como conseguimos</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 3, background: lg.segBg, borderRadius: 11, padding: 3 }}>
                {ORIGENS.map(o => {
                  const ativo = rowEditor.obtained_via === o.id;
                  return (
                    <button key={o.id} className="lg-seg" onClick={() => atualizarVariante(rowEditor, { obtained_via: o.id })} style={{ padding: "8px 4px", borderRadius: 9, fontSize: 12.5, fontWeight: ativo ? 700 : 500, border: "none", cursor: "pointer", fontFamily: fontStack, background: ativo ? lg.segActiveBg : "transparent", color: ativo ? lg.segActiveColor : lg.segInactiveColor }}>
                      {o.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Valor */}
            <div style={{ background: lg.sheetRowBg, borderRadius: 18, padding: "14px 16px", marginBottom: 18, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <div>
                <div style={{ color: lg.sheetLabel, fontSize: 14, fontWeight: 600 }}>Valor pago</div>
                <div style={{ color: lg.sheetSub, fontSize: 11, marginTop: 1 }}>deixe 0 se veio em pacote</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: lg.prefix, fontSize: 14, fontWeight: 600 }}>R$</span>
                <input
                  type="number"
                  inputMode="decimal"
                  value={rowEditor.valor ?? 0}
                  onChange={e => atualizarVariante(rowEditor, { valor: e.target.value === "" ? 0 : parseFloat(e.target.value) })}
                  style={{ width: 84, padding: "9px 10px", background: lg.inputBg, border: `0.5px solid ${lg.inputBorder}`, borderRadius: 10, color: lg.inputColor, fontSize: 15, fontWeight: 600, outline: "none", textAlign: "right", fontFamily: fontStack }}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button className="lg-press" onClick={() => removerVariante(rowEditor)} style={{ flex: 1, padding: "14px", background: "rgba(255,93,93,0.13)", border: "0.5px solid rgba(255,93,93,0.30)", borderRadius: 16, color: "#ff8a8a", cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: fontStack }}>Remover</button>
              <button className="lg-press" onClick={() => setEditor(null)} style={{ flex: 2, padding: "14px", background: "linear-gradient(135deg, #8a5cd0, #b78cf0)", border: "none", borderRadius: 16, color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 15, fontFamily: fontStack, boxShadow: "0 6px 22px rgba(138,92,208,0.40)" }}>Concluir</button>
            </div>
            {rowEditor.updated_by && (
              <div style={{ color: lg.updatedColor, fontSize: 10, textAlign: "center", marginTop: 14, fontWeight: 500 }}>último registro: {rowEditor.updated_by}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
