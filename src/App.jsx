import { useState } from "react";

const initialCompras = [
  { id: 1, data: "Primeira compra", descricao: "Kit Especial (Álbum Capa Dura Dourado + 60 pacotes)", pacotes: 60, valor: 500, tipo: "kit" },
  { id: 2, data: "Segunda compra", descricao: "12 pacotes de figurinha", pacotes: 12, valor: 84, tipo: "pacote" },
  { id: 3, data: "Hoje", descricao: "10 pacotes de figurinha", pacotes: 10, valor: 70, tipo: "pacote" },
];

const FIGURINHAS_PRESENTE = 27;
const TOTAL_ALBUM = 994;
const COLADAS = 469;

const faltando = [
  { code: "FWC⭐️", nome: "FWC Especiais", nums: [1,4,6,7] },
  { code: "FWC🌎", nome: "FWC Globo", nums: [11,12,13,14,17,19] },
  { code: "CC💼", nome: "Estádios", nums: [1,2,3,4,5,6,7,8,9,10,11,12,13,14] },
  { code: "MEX🇲🇽", nome: "México", nums: [1,2,3,4,5,6,7,8,9,10,11,12,14,17,19] },
  { code: "RSA🇿🇦", nome: "África do Sul", nums: [1,8,10,12,15,17,18] },
  { code: "KOR🇰🇷", nome: "Coreia do Sul", nums: [1,2,3,4,5,6,7,8,9,11,12,14,15,16,17,18,19,20] },
  { code: "CZE🇨🇿", nome: "República Tcheca", nums: [1,2,3,5,6,7,9,10,13,15,16,17,19,20] },
  { code: "CAN🇨🇦", nome: "Canadá", nums: [4,8,9,12,13,14,18] },
  { code: "BIH🇧🇦", nome: "Bósnia", nums: [2,5,7,10,11,13,15,19,20] },
  { code: "QAT🇶🇦", nome: "Catar", nums: [1,2,3,4,8,10,12,15,17,19,20] },
  { code: "SUI🇨🇭", nome: "Suíça", nums: [2,6,8,11,12,13,15,16,17,19,20] },
  { code: "BRA🇧🇷", nome: "Brasil", nums: [1,5,9,14,15,16,18,19,20] },
  { code: "MAR🇲🇦", nome: "Marrocos", nums: [2,5,6,7,8,9,10,11,13,14,15,16,17,18,19] },
  { code: "HAI🇭🇹", nome: "Haiti", nums: [1,2,3,4,6,10,11,13,14,16] },
  { code: "SCO🏴󠁧󠁢󠁳󠁣󠁴󠁿", nome: "Escócia", nums: [2,18,19,20] },
  { code: "USA🇺🇸", nome: "EUA", nums: [7,8,9,11,12,13,17,18] },
  { code: "PAR🇵🇾", nome: "Paraguai", nums: [3,6,10,11,15,16,19,20] },
  { code: "AUS🇦🇺", nome: "Austrália", nums: [1,4,9,13,14,17,18] },
  { code: "TUR🇹🇷", nome: "Turquia", nums: [1,5,8,9,13,14,18,19] },
  { code: "GER🇩🇪", nome: "Alemanha", nums: [3,4,6,7,8,10,12,13,20] },
  { code: "CUW🇨🇼", nome: "Curaçao", nums: [2,3,5,6,9,10,13,14,15,16,18,19,20] },
  { code: "CIV🇨🇮", nome: "Costa do Marfim", nums: [1,3,6,8,12,19] },
  { code: "ECU🇪🇨", nome: "Equador", nums: [3,4,5,6,9,13,14,17,18] },
  { code: "NED🇳🇱", nome: "Holanda", nums: [2,3,5,7,8,9,11,12,13,14,16,19,20] },
  { code: "JPN🇯🇵", nome: "Japão", nums: [1,2,5,6,8,9,10,12,14,15,16,17,18,19,20] },
  { code: "SWE🇸🇪", nome: "Suécia", nums: [3,5,7,9,10,14,15,18,20] },
  { code: "TUN🇹🇳", nome: "Tunísia", nums: [1,10,12,13,17,18,19] },
  { code: "BEL🇧🇪", nome: "Bélgica", nums: [2,4,5,8,9,10,11,12,15] },
  { code: "EGY🇪🇬", nome: "Egito", nums: [1,2,3,6,7,8,11,12,15,16,17,19,20] },
  { code: "IRN🇮🇷", nome: "Irã", nums: [2,4,6,7,8,11,14,16,17,18,19] },
  { code: "NZL🇳🇿", nome: "Nova Zelândia", nums: [4,7,9,11,13,14,16,17,18,20] },
  { code: "ESP🇪🇸", nome: "Espanha", nums: [1,2,3,4,5,6,7,8,10,11,12,13,14,16,17,19,20] },
  { code: "CPV🇨🇻", nome: "Cabo Verde", nums: [1,2,3,4,6,7,8,10,11,12,13,15,16,17,19,20] },
  { code: "KSA🇸🇦", nome: "Arábia Saudita", nums: [1,2,4,5,7,8,9,12,14,15,17,18,20] },
  { code: "URU🇺🇾", nome: "Uruguai", nums: [1,2,6,7,10,12,20] },
  { code: "FRA🇫🇷", nome: "França", nums: [2,4,5,6,8,9,10,12,14,15,17,19] },
  { code: "SEN🇸🇳", nome: "Senegal", nums: [1,12,17] },
  { code: "IRQ🇮🇶", nome: "Iraque", nums: [1,3,4,5,6,7,8,9,10,11,14,16,17,18,19,20] },
  { code: "NOR🇳🇴", nome: "Noruega", nums: [2,3,4,7,8,9,12,13,15,17,18,19] },
  { code: "ARG🇦🇷", nome: "Argentina", nums: [1,2,3,11,16,19] },
  { code: "ALG🇩🇿", nome: "Argélia", nums: [4,6,8,9,10,11,12,13,14,15,18,19] },
  { code: "AUT🇦🇹", nome: "Áustria", nums: [2,3,6,8,12,13,16,17,20] },
  { code: "JOR🇯🇴", nome: "Jordânia", nums: [2,6,7,8,11,12,15,17,20] },
  { code: "POR🇵🇹", nome: "Portugal", nums: [1,4,5,7,8,9,11,12,14,16,18] },
  { code: "COD🇨🇩", nome: "Congo", nums: [1,4,5,8,9,11,12,13,14,16,17,18,20] },
  { code: "UZB🇺🇿", nome: "Uzbequistão", nums: [1,2,3,5,8,9,11,13,14,16,20] },
  { code: "COL🇨🇴", nome: "Colômbia", nums: [1,2,4,5,6,8,10,12,14,15,19] },
  { code: "ENG🏴󠁧󠁢󠁥󠁮󠁧󠁿", nome: "Inglaterra", nums: [1,4,6,12,14,17,18,19] },
  { code: "CRO🇭🇷", nome: "Croácia", nums: [1,2,4,5,6,8,9,10,11,12,14,15,16,17,18,19,20] },
  { code: "GHA🇬🇭", nome: "Gana", nums: [2,3,9,14,16] },
  { code: "PAN🇵🇦", nome: "Panamá", nums: [1,2,5,10,12,15,17,18] },
];

const totalFaltando = faltando.reduce((acc, s) => acc + s.nums.length, 0);

export default function AlbumTracker() {
  const [compras, setCompras] = useState(initialCompras);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ descricao: "", pacotes: "", valor: "" });
  const [aba, setAba] = useState("gastos");
  const [busca, setBusca] = useState("");

  const totalGasto = compras.reduce((acc, c) => acc + c.valor, 0);
  const totalPacotes = compras.reduce((acc, c) => acc + c.pacotes, 0);
  const totalFigurinhas = totalPacotes * 7 + FIGURINHAS_PRESENTE;
  const repetidas = totalFigurinhas - COLADAS;
  const mediaPorPacote = totalPacotes > 0 ? (totalGasto / totalPacotes).toFixed(2) : 0;
  const pctCompleto = ((COLADAS / TOTAL_ALBUM) * 100).toFixed(1);

  function addCompra() {
    if (!form.descricao || !form.pacotes || !form.valor) return;
    setCompras([...compras, {
      id: Date.now(), data: "Nova compra",
      descricao: form.descricao, pacotes: parseInt(form.pacotes),
      valor: parseFloat(form.valor), tipo: "pacote",
    }]);
    setForm({ descricao: "", pacotes: "", valor: "" });
    setShowForm(false);
  }

  function removeCompra(id) { setCompras(compras.filter((c) => c.id !== id)); }

  const faltandoFiltrado = busca.trim()
    ? faltando.filter(s => s.nome.toLowerCase().includes(busca.toLowerCase()) || s.code.toLowerCase().includes(busca.toLowerCase()))
    : faltando;

  const tabStyle = (t) => ({
    flex: 1, padding: "11px 4px",
    background: aba === t ? "rgba(200,146,42,0.12)" : "none",
    border: "none",
    borderBottom: aba === t ? "2px solid #c8922a" : "2px solid transparent",
    color: aba === t ? "#f0c060" : "#555",
    fontSize: 11, fontWeight: "bold", cursor: "pointer",
    letterSpacing: "0.07em", fontFamily: "sans-serif",
    transition: "all 0.2s",
  });

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", fontFamily: "'Georgia', serif", paddingBottom: 60 }}>

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #1a1200 0%, #2d1f00 50%, #1a0a00 100%)",
        borderBottom: "2px solid #c8922a",
        padding: "26px 24px 18px", textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 20% 50%, rgba(200,146,42,0.08) 0%, transparent 60%)" }} />
        <div style={{ fontSize: 30, marginBottom: 2 }}>⚽🏆</div>
        <h1 style={{ margin: 0, color: "#f0c060", fontSize: "clamp(16px, 5vw, 22px)", fontWeight: "bold", letterSpacing: "0.04em", textShadow: "0 0 24px rgba(240,192,96,0.4)" }}>
          ÁLBUM DA COPA 2026
        </h1>
        <p style={{ margin: "3px 0 0", color: "#a07030", fontSize: 11, letterSpacing: "0.1em" }}>FSAID & ROMEO</p>

        <div style={{ marginTop: 14, maxWidth: 320, margin: "12px auto 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ color: "#777", fontSize: 11 }}>{COLADAS} coladas</span>
            <span style={{ color: "#f0c060", fontSize: 11, fontWeight: "bold" }}>{pctCompleto}% completo</span>
          </div>
          <div style={{ height: 7, background: "rgba(255,255,255,0.08)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pctCompleto}%`, background: "linear-gradient(90deg, #c8922a, #f0c060)", borderRadius: 99 }} />
          </div>
          <div style={{ color: "#444", fontSize: 10, marginTop: 4, textAlign: "right" }}>de {TOTAL_ALBUM} · faltam {totalFaltando}</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.07)", background: "#0c0c12" }}>
        <button style={tabStyle("gastos")} onClick={() => setAba("gastos")}>💰 GASTOS</button>
        <button style={tabStyle("faltando")} onClick={() => setAba("faltando")}>🔍 FALTANDO ({totalFaltando})</button>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 16px" }}>

        {/* === ABA GASTOS === */}
        {aba === "gastos" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, margin: "20px 0 14px" }}>
              {[
                { label: "Total Gasto", valor: `R$ ${totalGasto.toFixed(2).replace(".", ",")}`, icon: "💰", cor: "#f0c060" },
                { label: "Pacotes", valor: totalPacotes, icon: "📦", cor: "#7ec8e3" },
                { label: "Repetidas", valor: repetidas, icon: "🔁", cor: "#e07070" },
              ].map((card) => (
                <div key={card.label} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "14px 8px", textAlign: "center" }}>
                  <div style={{ fontSize: 20 }}>{card.icon}</div>
                  <div style={{ color: card.cor, fontWeight: "bold", fontSize: "clamp(12px, 4vw, 17px)", marginTop: 4 }}>{card.valor}</div>
                  <div style={{ color: "#555", fontSize: 10, marginTop: 2, letterSpacing: "0.04em" }}>{card.label.toUpperCase()}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
              {[
                { label: "Total recebido", valor: `${totalFigurinhas} figurinhas` },
                { label: "Custo médio/pacote", valor: `R$ ${mediaPorPacote.replace(".", ",")}` },
              ].map(s => (
                <div key={s.label} style={{ background: "rgba(200,146,42,0.06)", border: "1px solid rgba(200,146,42,0.13)", borderRadius: 10, padding: "10px 14px" }}>
                  <div style={{ color: "#666", fontSize: 10, letterSpacing: "0.06em", marginBottom: 3 }}>{s.label.toUpperCase()}</div>
                  <div style={{ color: "#f0c060", fontWeight: "bold", fontSize: 14 }}>{s.valor}</div>
                </div>
              ))}
            </div>

            <h2 style={{ color: "#444", fontSize: 10, letterSpacing: "0.12em", margin: "0 0 10px", fontFamily: "sans-serif" }}>HISTÓRICO</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
              {compras.map((c) => (
                <div key={c.id} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "13px 15px", display: "flex", alignItems: "center", gap: 12, position: "relative" }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: c.tipo === "kit" ? "rgba(240,192,96,0.15)" : "rgba(126,200,227,0.1)", border: `1px solid ${c.tipo === "kit" ? "rgba(240,192,96,0.3)" : "rgba(126,200,227,0.2)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                    {c.tipo === "kit" ? "🏆" : "📦"}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: "#e0e0e0", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>{c.descricao}</div>
                    <div style={{ color: "#555", fontSize: 11 }}>{c.pacotes} pacotes · {c.pacotes * 7} fig.</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0, paddingRight: 16 }}>
                    <div style={{ color: "#f0c060", fontWeight: "bold", fontSize: 14 }}>R$ {c.valor.toFixed(2).replace(".", ",")}</div>
                    <div style={{ color: "#444", fontSize: 10 }}>{c.data}</div>
                  </div>
                  <button onClick={() => removeCompra(c.id)} style={{ position: "absolute", top: 7, right: 8, background: "none", border: "none", color: "#383838", cursor: "pointer", fontSize: 15, padding: "2px 4px", lineHeight: 1 }}>×</button>
                </div>
              ))}

              {/* Presente */}
              <div style={{ background: "rgba(144,224,160,0.04)", border: "1px solid rgba(144,224,160,0.12)", borderRadius: 12, padding: "13px 15px", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(144,224,160,0.1)", border: "1px solid rgba(144,224,160,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>🎁</div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: "#90e0a0", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>Presente de amigo</div>
                  <div style={{ color: "#555", fontSize: 11 }}>27 figurinhas avulsas</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: "#90e0a0", fontWeight: "bold", fontSize: 14 }}>R$ 0,00</div>
                </div>
              </div>
            </div>

            {!showForm ? (
              <button onClick={() => setShowForm(true)} style={{ width: "100%", padding: "13px", background: "linear-gradient(135deg, #2d1f00, #3d2a00)", border: "1px solid #c8922a", borderRadius: 12, color: "#f0c060", fontSize: 13, fontWeight: "bold", cursor: "pointer", letterSpacing: "0.05em" }}>
                + REGISTRAR NOVA COMPRA
              </button>
            ) : (
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(200,146,42,0.3)", borderRadius: 12, padding: "16px" }}>
                <h3 style={{ color: "#f0c060", margin: "0 0 14px", fontSize: 11, letterSpacing: "0.08em" }}>NOVA COMPRA</h3>
                {[
                  { label: "Descrição", key: "descricao", type: "text", placeholder: "Ex: 8 pacotes avulsos" },
                  { label: "Qtd. de pacotes", key: "pacotes", type: "number", placeholder: "Ex: 8" },
                  { label: "Valor pago (R$)", key: "valor", type: "number", placeholder: "Ex: 56" },
                ].map((f) => (
                  <div key={f.key} style={{ marginBottom: 12 }}>
                    <label style={{ color: "#777", fontSize: 10, display: "block", marginBottom: 4, letterSpacing: "0.06em" }}>{f.label.toUpperCase()}</label>
                    <input type={f.type} placeholder={f.placeholder} value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} style={{ width: "100%", padding: "10px 12px", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#e0e0e0", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                  </div>
                ))}
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => { setShowForm(false); setForm({ descricao: "", pacotes: "", valor: "" }); }} style={{ flex: 1, padding: "11px", background: "none", border: "1px solid #333", borderRadius: 8, color: "#777", cursor: "pointer", fontSize: 13 }}>Cancelar</button>
                  <button onClick={addCompra} style={{ flex: 2, padding: "11px", background: "linear-gradient(135deg, #c8922a, #e0a830)", border: "none", borderRadius: 8, color: "#0a0a0f", fontWeight: "bold", cursor: "pointer", fontSize: 13 }}>Salvar</button>
                </div>
              </div>
            )}
          </>
        )}

        {/* === ABA FALTANDO === */}
        {aba === "faltando" && (
          <div style={{ paddingTop: 18 }}>
            <div style={{ background: "rgba(200,146,42,0.07)", border: "1px solid rgba(200,146,42,0.18)", borderRadius: 10, padding: "11px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <span style={{ color: "#888", fontSize: 12 }}>Total faltando</span>
              <span style={{ color: "#f0c060", fontWeight: "bold", fontSize: 18 }}>{totalFaltando} figurinhas</span>
            </div>

            <input
              placeholder="🔍 Buscar seleção..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
              style={{ width: "100%", padding: "10px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 10, color: "#e0e0e0", fontSize: 13, outline: "none", boxSizing: "border-box", marginBottom: 12 }}
            />

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {faltandoFiltrado.map((s) => (
                <div key={s.code} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "12px 14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ color: "#e0e0e0", fontSize: 13, fontWeight: "bold" }}>{s.nome}</span>
                    <span style={{ background: "rgba(200,146,42,0.14)", color: "#c8922a", fontSize: 11, fontWeight: "bold", padding: "2px 9px", borderRadius: 20 }}>{s.nums.length}</span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {s.nums.map(n => (
                      <span key={n} style={{ background: "rgba(255,255,255,0.07)", color: "#aaa", fontSize: 11, padding: "3px 8px", borderRadius: 6, fontFamily: "monospace" }}>{n}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
