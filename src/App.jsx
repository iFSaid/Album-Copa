import { useState, useMemo, useEffect } from "react";
import { supabase } from './supabase.js'

const initialCompras = [
  { id: 1, data: "Primeira compra", descricao: "Kit Especial (Álbum Capa Dura Dourado + 60 pacotes)", pacotes: 60, valor: 500, tipo: "kit" },
  { id: 2, data: "Segunda compra", descricao: "12 pacotes de figurinha", pacotes: 12, valor: 84, tipo: "pacote" },
  { id: 3, data: "16/05/2026", descricao: "10 pacotes de figurinha", pacotes: 10, valor: 70, tipo: "pacote" },
  { id: 4, data: "16/05/2026", descricao: "10 pacotes de figurinha", pacotes: 10, valor: 70, tipo: "pacote" },
];

const FIGURINHAS_PRESENTE = 47;
const TOTAL_ALBUM = 994;
const COLADAS_BASE = 591;

// Grupos da Copa 2026
const grupos = [
  { id: "especiais", label: "Especiais", emoji: "🌟", cor: "#f0c060", codes: ["FWC-ESP", "FWC-SEL", "CC"] },
  { id: "A", label: "Grupo A", emoji: "🅰️", cor: "#7ec8e3", codes: ["MEX", "RSA", "KOR", "CZE"] },
  { id: "B", label: "Grupo B", emoji: "🅱️", cor: "#7ec8e3", codes: ["CAN", "BIH", "QAT", "SUI"] },
  { id: "C", label: "Grupo C", emoji: "🇧🇷", cor: "#90e0a0", codes: ["BRA", "MAR", "HAI", "SCO"] },
  { id: "D", label: "Grupo D", emoji: "🇺🇸", cor: "#7ec8e3", codes: ["USA", "PAR", "AUS", "TUR"] },
  { id: "E", label: "Grupo E", emoji: "⚽", cor: "#7ec8e3", codes: ["GER", "CUW", "CIV", "ECU"] },
  { id: "F", label: "Grupo F", emoji: "⚽", cor: "#7ec8e3", codes: ["NED", "JPN", "SWE", "TUN"] },
  { id: "G", label: "Grupo G", emoji: "⚽", cor: "#7ec8e3", codes: ["BEL", "EGY", "IRN", "NZL"] },
  { id: "H", label: "Grupo H", emoji: "⚽", cor: "#7ec8e3", codes: ["ESP", "CPV", "KSA", "URU"] },
  { id: "I", label: "Grupo I", emoji: "⚽", cor: "#c8922a", codes: ["FRA", "SEN", "IRQ", "NOR"] },
  { id: "J", label: "Grupo J", emoji: "⚽", cor: "#7ec8e3", codes: ["ARG", "ALG", "AUT", "JOR"] },
  { id: "K", label: "Grupo K", emoji: "⚽", cor: "#7ec8e3", codes: ["POR", "COD", "UZB", "COL"] },
  { id: "L", label: "Grupo L", emoji: "⚽", cor: "#7ec8e3", codes: ["ENG", "CRO", "GHA", "PAN"] },
];

const secoes = [
  { code: "FWC-ESP", nome: "FWC Especiais", emoji: "⭐️", nums: ["00",1,2,3,4,5,6,7,8] },
  { code: "FWC-SEL", nome: "FWC Seleções", emoji: "🌎", nums: [9,10,11,12,13,14,15,16,17,18,19] },
  { code: "CC", nome: "Coca", emoji: "🥤", nums: [1,2,3,4,5,6,7,8,9,10,11,12,13,14] },
  { code: "MEX", nome: "México", emoji: "🇲🇽", nums: Array.from({length:20},(_,i)=>i+1) },
  { code: "RSA", nome: "África do Sul", emoji: "🇿🇦", nums: Array.from({length:20},(_,i)=>i+1) },
  { code: "KOR", nome: "Coreia do Sul", emoji: "🇰🇷", nums: Array.from({length:20},(_,i)=>i+1) },
  { code: "CZE", nome: "Rep. Tcheca", emoji: "🇨🇿", nums: Array.from({length:20},(_,i)=>i+1) },
  { code: "CAN", nome: "Canadá", emoji: "🇨🇦", nums: Array.from({length:20},(_,i)=>i+1) },
  { code: "BIH", nome: "Bósnia", emoji: "🇧🇦", nums: Array.from({length:20},(_,i)=>i+1) },
  { code: "QAT", nome: "Catar", emoji: "🇶🇦", nums: Array.from({length:20},(_,i)=>i+1) },
  { code: "SUI", nome: "Suíça", emoji: "🇨🇭", nums: Array.from({length:20},(_,i)=>i+1) },
  { code: "BRA", nome: "Brasil", emoji: "🇧🇷", nums: Array.from({length:20},(_,i)=>i+1) },
  { code: "MAR", nome: "Marrocos", emoji: "🇲🇦", nums: Array.from({length:20},(_,i)=>i+1) },
  { code: "HAI", nome: "Haiti", emoji: "🇭🇹", nums: Array.from({length:20},(_,i)=>i+1) },
  { code: "SCO", nome: "Escócia", emoji: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", nums: Array.from({length:20},(_,i)=>i+1) },
  { code: "USA", nome: "EUA", emoji: "🇺🇸", nums: Array.from({length:20},(_,i)=>i+1) },
  { code: "PAR", nome: "Paraguai", emoji: "🇵🇾", nums: Array.from({length:20},(_,i)=>i+1) },
  { code: "AUS", nome: "Austrália", emoji: "🇦🇺", nums: Array.from({length:20},(_,i)=>i+1) },
  { code: "TUR", nome: "Turquia", emoji: "🇹🇷", nums: Array.from({length:20},(_,i)=>i+1) },
  { code: "GER", nome: "Alemanha", emoji: "🇩🇪", nums: Array.from({length:20},(_,i)=>i+1) },
  { code: "CUW", nome: "Curaçao", emoji: "🇨🇼", nums: Array.from({length:20},(_,i)=>i+1) },
  { code: "CIV", nome: "Costa do Marfim", emoji: "🇨🇮", nums: Array.from({length:20},(_,i)=>i+1) },
  { code: "ECU", nome: "Equador", emoji: "🇪🇨", nums: Array.from({length:20},(_,i)=>i+1) },
  { code: "NED", nome: "Holanda", emoji: "🇳🇱", nums: Array.from({length:20},(_,i)=>i+1) },
  { code: "JPN", nome: "Japão", emoji: "🇯🇵", nums: Array.from({length:20},(_,i)=>i+1) },
  { code: "SWE", nome: "Suécia", emoji: "🇸🇪", nums: Array.from({length:20},(_,i)=>i+1) },
  { code: "TUN", nome: "Tunísia", emoji: "🇹🇳", nums: Array.from({length:20},(_,i)=>i+1) },
  { code: "BEL", nome: "Bélgica", emoji: "🇧🇪", nums: Array.from({length:20},(_,i)=>i+1) },
  { code: "EGY", nome: "Egito", emoji: "🇪🇬", nums: Array.from({length:20},(_,i)=>i+1) },
  { code: "IRN", nome: "Irã", emoji: "🇮🇷", nums: Array.from({length:20},(_,i)=>i+1) },
  { code: "NZL", nome: "Nova Zelândia", emoji: "🇳🇿", nums: Array.from({length:20},(_,i)=>i+1) },
  { code: "ESP", nome: "Espanha", emoji: "🇪🇸", nums: Array.from({length:20},(_,i)=>i+1) },
  { code: "CPV", nome: "Cabo Verde", emoji: "🇨🇻", nums: Array.from({length:20},(_,i)=>i+1) },
  { code: "KSA", nome: "Arábia Saudita", emoji: "🇸🇦", nums: Array.from({length:20},(_,i)=>i+1) },
  { code: "URU", nome: "Uruguai", emoji: "🇺🇾", nums: Array.from({length:20},(_,i)=>i+1) },
  { code: "FRA", nome: "França", emoji: "🇫🇷", nums: Array.from({length:20},(_,i)=>i+1) },
  { code: "SEN", nome: "Senegal", emoji: "🇸🇳", nums: Array.from({length:20},(_,i)=>i+1) },
  { code: "IRQ", nome: "Iraque", emoji: "🇮🇶", nums: Array.from({length:20},(_,i)=>i+1) },
  { code: "NOR", nome: "Noruega", emoji: "🇳🇴", nums: Array.from({length:20},(_,i)=>i+1) },
  { code: "ARG", nome: "Argentina", emoji: "🇦🇷", nums: Array.from({length:20},(_,i)=>i+1) },
  { code: "ALG", nome: "Argélia", emoji: "🇩🇿", nums: Array.from({length:20},(_,i)=>i+1) },
  { code: "AUT", nome: "Áustria", emoji: "🇦🇹", nums: Array.from({length:20},(_,i)=>i+1) },
  { code: "JOR", nome: "Jordânia", emoji: "🇯🇴", nums: Array.from({length:20},(_,i)=>i+1) },
  { code: "POR", nome: "Portugal", emoji: "🇵🇹", nums: Array.from({length:20},(_,i)=>i+1) },
  { code: "COD", nome: "Congo", emoji: "🇨🇩", nums: Array.from({length:20},(_,i)=>i+1) },
  { code: "UZB", nome: "Uzbequistão", emoji: "🇺🇿", nums: Array.from({length:20},(_,i)=>i+1) },
  { code: "COL", nome: "Colômbia", emoji: "🇨🇴", nums: Array.from({length:20},(_,i)=>i+1) },
  { code: "ENG", nome: "Inglaterra", emoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", nums: Array.from({length:20},(_,i)=>i+1) },
  { code: "CRO", nome: "Croácia", emoji: "🇭🇷", nums: Array.from({length:20},(_,i)=>i+1) },
  { code: "GHA", nome: "Gana", emoji: "🇬🇭", nums: Array.from({length:20},(_,i)=>i+1) },
  { code: "PAN", nome: "Panamá", emoji: "🇵🇦", nums: Array.from({length:20},(_,i)=>i+1) },
];

const secaoMap = Object.fromEntries(secoes.map(s => [s.code, s]));

const faltandoInicial = {
  "FWC-ESP": [1,4,7], "FWC-SEL": [11,12,13,14,17,19],
  "CC": [1,2,3,4,5,6,7,8,9,10,11,12,13,14],
  "MEX": [2,3,6,7,12,14,17,19],
  "RSA": [1,15,17],
  "KOR": [1,4,5,7,8,9,11,12,14,15,16,17,18,19],
  "CZE": [1,2,3,5,6,7,10,15,17,19,20],
  "CAN": [4,8,12,13,14,18], "BIH": [2,5,7,10,11,13,15,19,20],
  "QAT": [1,2,4,8,12,15,17], "SUI": [2,6,8,11,12,13,15,16,17,19,20],
  "BRA": [1,5,9,14,16,18,19,20],
  "MAR": [5,6,8,10,11,13,14,15,17,18],
  "HAI": [1,2,3,4,13], "SCO": [2,19,20],
  "USA": [7,8,9,11,12,13,17,18], "PAR": [6,11,16],
  "AUS": [13,14,18], "TUR": [1,5,8,9,13,14,18,19],
  "GER": [3,4,7,10,12,20], "CUW": [5,6,9,10,13,14,15,18,19],
  "CIV": [1,3,6,8,12,19], "ECU": [3,4,5,9,13,14,17],
  "NED": [3,5,7,8,9,12,13,14,16,19,20],
  "JPN": [2,5,6,8,10,12,15,16,17,19,20],
  "SWE": [5,7,9,10,14,15,18,20], "TUN": [1,12,13,17,19],
  "BEL": [2,4,8,9,10,12,15], "EGY": [1,2,3,6,8,11,12,15,16,19,20],
  "IRN": [4,7,8,11,16,17,18,19], "NZL": [4,9,13,14,17],
  "ESP": [1,2,3,4,5,6,7,10,11,12,13,14,16,20],
  "CPV": [1,2,3,4,6,7,8,10,11,12,13,15,16,17,19],
  "KSA": [1,2,4,7,8,12,14,18], "URU": [1,2,6,7,10],
  "FRA": [4,5,6,10,12,14,15,17,19], "SEN": [1,12,17],
  "IRQ": [1,3,4,6,7,8,9,10,11,14,16,17,18,19,20],
  "NOR": [2,3,7,9,13,15,19], "ARG": [1,11,16,19],
  "ALG": [4,6,8,9,10,12,13,14,15,18,19], "AUT": [2,3,6,8,12,17],
  "JOR": [2,6,7,12,17], "POR": [1,4,8,9,11,12,16,18],
  "COD": [1,4,5,8,11,12,13,14,16,17,18,20], "UZB": [1,2,3,5,8,9,11,13,14,16,20],
  "COL": [4,5,8,10,12,15,19], "ENG": [1,6,12,14,17,18,19],
  "CRO": [1,2,4,8,10,11,12,15,16,17,19,20],
  "GHA": [2,14,16], "PAN": [1,2,10,12,15,17,18],
};

const totalFaltandoInicial = Object.values(faltandoInicial).reduce((a, v) => a + v.length, 0);

export default function AlbumTracker() {
  const [compras, setCompras] = useState([])
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ descricao: "", pacotes: "", valor: "" });
  const [aba, setAba] = useState("gastos");
  const [busca, setBusca] = useState("");
  const [grupoAberto, setGrupoAberto] = useState(null);
  const [faltando, setFaltando] = useState({})
  const [loadingDados, setLoadingDados] = useState(true)
  const [user, setUser] = useState(null)
  const [loadingAuth, setLoadingAuth] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoadingAuth(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!user) return
    async function carregarDados() {
      setLoadingDados(true)
      try {
        const { data: comprasData, error: erroCompras } = await supabase
          .from('compras').select('*').eq('user_id', user.id).order('id')

        if (erroCompras) throw erroCompras

        if (comprasData && comprasData.length > 0) {
          setCompras(comprasData)
        } else {
          const iniciais = initialCompras.map(({ id, ...c }) => ({ ...c, user_id: user.id }))
          const { data } = await supabase.from('compras').insert(iniciais).select()
          setCompras(data || initialCompras)
        }

        const { data: figsData, error: erroFigs } = await supabase
          .from('figurinhas').select('*').eq('user_id', user.id)

        if (erroFigs) throw erroFigs

        if (figsData && figsData.length > 0) {
          const map = {}
          figsData.forEach(f => { map[`${f.code}-${f.num}`] = f.faltando === true })
          setFaltando(map)
        } else {
          const rows = []
          Object.entries(faltandoInicial).forEach(([code, nums]) => {
            nums.forEach(n => rows.push({ user_id: user.id, code, num: String(n), faltando: true }))
          })
          const BATCH = 500
          for (let i = 0; i < rows.length; i += BATCH) {
            await supabase.from('figurinhas').insert(rows.slice(i, i + BATCH))
          }
          const init = {}
          Object.entries(faltandoInicial).forEach(([code, nums]) => {
            nums.forEach(n => { init[`${code}-${n}`] = true })
          })
          setFaltando(init)
        }
      } catch (err) {
        console.error('Erro ao carregar dados:', err)
        // Fallback para estado local
        setCompras(initialCompras)
        const init = {}
        Object.entries(faltandoInicial).forEach(([code, nums]) => {
          nums.forEach(n => { init[`${code}-${n}`] = true })
        })
        setFaltando(init)
      } finally {
        setLoadingDados(false)
      }
    }
    carregarDados()
  }, [user])

  const totalGasto = compras.reduce((acc, c) => acc + c.valor, 0);
  const totalPacotes = compras.reduce((acc, c) => acc + c.pacotes, 0);
  const totalFigurinhas = totalPacotes * 7 + FIGURINHAS_PRESENTE;
  const totalAindaFaltando = Object.values(faltando).filter(Boolean).length;
  const totalColadas = COLADAS_BASE + (totalFaltandoInicial - totalAindaFaltando);
  const repetidas = totalFigurinhas - totalColadas;
  const mediaPorPacote = totalPacotes > 0 ? (totalGasto / totalPacotes).toFixed(2) : 0;
  const pctCompleto = ((totalColadas / TOTAL_ALBUM) * 100).toFixed(1);

  async function toggleFaltando(code, num) {
    const key = `${code}-${num}`
    const novoValor = !faltando[key]
    setFaltando(prev => ({ ...prev, [key]: novoValor }))
    await supabase.from('figurinhas')
      .update({ faltando: novoValor })
      .eq('user_id', user.id)
      .eq('code', code)
      .eq('num', String(num))
  }

  function exportarFaltando() {
    const linhas = [];
    linhas.push("⚽ FIGURINHAS QUE PRECISO — Álbum Copa 2026");
    linhas.push(`📊 ${totalAindaFaltando} figurinhas faltando de ${TOTAL_ALBUM} (${pctCompleto}% completo)\n`);
    grupos.forEach(g => {
      const faltamNesseGrupo = g.codes.flatMap(code => {
        const s = secaoData[code];
        if (!s || s.faltamNums.length === 0) return [];
        return [`  ${s.emoji} ${s.nome}: ${s.faltamNums.join(", ")}`];
      });
      if (faltamNesseGrupo.length > 0) {
        linhas.push(`${g.label}:`);
        faltamNesseGrupo.forEach(l => linhas.push(l));
        linhas.push("");
      }
    });
    const texto = linhas.join("\n");
    if (navigator.share) {
      navigator.share({ title: "Figurinhas que preciso — Copa 2026", text: texto });
    } else {
      navigator.clipboard.writeText(texto).then(() => alert("Lista copiada para a área de transferência!"));
    }
  }

  async function addCompra() {
    if (!form.descricao || !form.pacotes || !form.valor) return
    const nova = { user_id: user.id, data: new Date().toLocaleDateString('pt-BR'), descricao: form.descricao, pacotes: parseInt(form.pacotes), valor: parseFloat(form.valor), tipo: 'pacote' }
    const { data } = await supabase.from('compras').insert([nova]).select()
    if (data) setCompras(prev => [...prev, data[0]])
    setForm({ descricao: '', pacotes: '', valor: '' })
    setShowForm(false)
  }
  async function removeCompra(id) {
    await supabase.from('compras').delete().eq('id', id)
    setCompras(prev => prev.filter(c => c.id !== id))
  }
  async function loginGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: 'https://album-copa-theta.vercel.app' }
    })
  }
  async function logout() {
    await supabase.auth.signOut()
  }

  // Monta dados enriquecidos por seção
  const secaoData = useMemo(() => {
    const map = {};
    secoes.forEach(s => {
      const faltamNums = s.nums.filter(n => faltando[`${s.code}-${n}`]);
      const tenhoNums = s.nums.filter(n => !faltando[`${s.code}-${n}`]);
      map[s.code] = { ...s, faltamNums, tenhoNums };
    });
    return map;
  }, [faltando]);

  // Stats por grupo
  const grupoStats = useMemo(() => {
    return grupos.map(g => {
      const total = g.codes.reduce((a, c) => a + (secaoMap[c]?.nums.length || 0), 0);
      const faltam = g.codes.reduce((a, c) => a + (secaoData[c]?.faltamNums.length || 0), 0);
      const tenho = total - faltam;
      return { ...g, total, faltam, tenho, completo: faltam === 0 };
    });
  }, [secaoData]);

  const tabStyle = (t) => ({
    flex: 1, padding: "10px 2px",
    background: aba === t ? "rgba(200,146,42,0.12)" : "none",
    border: "none",
    borderBottom: aba === t ? "2px solid #c8922a" : "2px solid transparent",
    color: aba === t ? "#f0c060" : "#555",
    fontSize: 10, fontWeight: "bold", cursor: "pointer",
    letterSpacing: "0.05em", fontFamily: "sans-serif",
  });

  const chipBase = { fontSize: 11, padding: "3px 8px", borderRadius: 6, fontFamily: "monospace", cursor: "pointer", userSelect: "none" };

  // Filtra por busca nas abas faltando/tenho
  const buscaLower = busca.toLowerCase().trim();
  const secoesFiltradas = useMemo(() => {
    if (!buscaLower) return secoes;
    return secoes.filter(s => s.nome.toLowerCase().includes(buscaLower) || s.code.toLowerCase().includes(buscaLower));
  }, [buscaLower]);

  function renderGrupos(modo) {
    // modo: "faltando" | "tenho"
    const gruposFiltrados = grupoStats.filter(g => {
      if (!buscaLower) return true;
      return g.codes.some(c => {
        const s = secaoMap[c];
        return s && (s.nome.toLowerCase().includes(buscaLower) || s.code.toLowerCase().includes(buscaLower));
      });
    });

    return gruposFiltrados.map(g => {
      const isAberto = grupoAberto === `${modo}-${g.id}`;
      const secoesDoGrupo = g.codes
        .map(c => secaoData[c])
        .filter(s => {
          if (buscaLower) return s.nome.toLowerCase().includes(buscaLower) || s.code.toLowerCase().includes(buscaLower);
          return true;
        })
        .filter(s => modo === "faltando" ? s.faltamNums.length > 0 : s.tenhoNums.length > 0);

      if (secoesDoGrupo.length === 0 && !buscaLower) {
        if (modo === "faltando" && g.faltam === 0) return (
          <div key={g.id} style={{ background: "rgba(144,224,160,0.05)", border: "1px solid rgba(144,224,160,0.15)", borderRadius: 12, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#90e0a0", fontSize: 13, fontWeight: "bold" }}>{g.label}</span>
            <span style={{ background: "rgba(144,224,160,0.15)", color: "#90e0a0", fontSize: 11, padding: "2px 10px", borderRadius: 20 }}>✓ completo</span>
          </div>
        );
        if (modo === "tenho" && g.tenho === 0) return null;
      }
      if (secoesDoGrupo.length === 0) return null;

      const pct = Math.round((g.tenho / g.total) * 100);

      return (
        <div key={g.id} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${isAberto ? "rgba(200,146,42,0.3)" : "rgba(255,255,255,0.07)"}`, borderRadius: 12, overflow: "hidden", transition: "border 0.2s" }}>
          {/* Header do grupo */}
          <div onClick={() => setGrupoAberto(isAberto ? null : `${modo}-${g.id}`)} style={{ padding: "12px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ color: "#e0e0e0", fontSize: 13, fontWeight: "bold" }}>{g.label}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {modo === "faltando" && g.faltam > 0 && <span style={{ background: "rgba(224,112,112,0.14)", color: "#e07070", fontSize: 11, fontWeight: "bold", padding: "2px 8px", borderRadius: 20 }}>{g.faltam} fig.</span>}
                  {modo === "tenho" && <span style={{ background: "rgba(144,224,160,0.12)", color: "#90e0a0", fontSize: 11, fontWeight: "bold", padding: "2px 8px", borderRadius: 20 }}>{g.tenho} fig.</span>}
                  <span style={{ color: "#555", fontSize: 14 }}>{isAberto ? "▲" : "▼"}</span>
                </div>
              </div>
              {/* Mini barra de progresso */}
              <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? "linear-gradient(90deg,#90e0a0,#60c080)" : "linear-gradient(90deg,#c8922a,#f0c060)", borderRadius: 99, transition: "width 0.3s" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
                <span style={{ color: "#555", fontSize: 10 }}>{g.codes.map(c => secaoMap[c]?.emoji).join(" ")}</span>
                <span style={{ color: "#555", fontSize: 10 }}>{pct}%</span>
              </div>
            </div>
          </div>

          {/* Conteúdo expandido */}
          {isAberto && (
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
              {secoesDoGrupo.map(s => {
                const nums = modo === "faltando" ? s.faltamNums : s.tenhoNums;
                return (
                  <div key={s.code}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ color: "#bbb", fontSize: 12 }}>{s.emoji} {s.nome}</span>
                      <span style={{ color: "#555", fontSize: 11 }}>{nums.length} fig.</span>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {nums.map(n => (
                        <span key={n} onClick={() => toggleFaltando(s.code, n)}
                          style={{ ...chipBase,
                            background: modo === "faltando" ? "rgba(224,112,112,0.12)" : "rgba(144,224,160,0.1)",
                            color: modo === "faltando" ? "#e07070" : "#90e0a0",
                            border: `1px solid ${modo === "faltando" ? "rgba(224,112,112,0.25)" : "rgba(144,224,160,0.2)"}`,
                          }}>
                          {n}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    }).filter(Boolean);
  }

  if (loadingAuth) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:'#0a0a0f',color:'#f0c060',fontSize:16}}>Carregando...</div>

  if (!user) return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100vh',background:'#0a0a0f',gap:24,padding:32}}>
      <div style={{fontSize:48}}>⚽🏆</div>
      <h1 style={{color:'#f0c060',fontSize:22,fontWeight:'bold',textAlign:'center',textShadow:'0 0 24px rgba(240,192,96,0.4)'}}>ÁLBUM DA COPA 2026</h1>
      <p style={{color:'#a07030',fontSize:13,letterSpacing:'0.1em'}}>FSAID & ROMEO</p>
      <button onClick={loginGoogle} style={{marginTop:16,padding:'14px 32px',background:'white',border:'none',borderRadius:12,fontSize:15,fontWeight:'bold',cursor:'pointer',display:'flex',alignItems:'center',gap:12,color:'#333'}}>
        <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/><path fill="#FF3D00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"/><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/></svg>
        Entrar com Google
      </button>
    </div>
  )

  if (loadingDados) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:'#0a0a0f',color:'#f0c060',fontSize:16}}>Carregando seus dados...</div>

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", fontFamily: "'Georgia', serif", paddingBottom: 60 }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1a1200 0%, #2d1f00 50%, #1a0a00 100%)", borderBottom: "2px solid #c8922a", padding: "22px 24px 16px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 20% 50%, rgba(200,146,42,0.08) 0%, transparent 60%)" }} />
        <div style={{ fontSize: 28, marginBottom: 2 }}>⚽🏆</div>
        <h1 style={{ margin: 0, color: "#f0c060", fontSize: "clamp(15px, 5vw, 21px)", fontWeight: "bold", letterSpacing: "0.04em", textShadow: "0 0 24px rgba(240,192,96,0.4)" }}>ÁLBUM DA COPA 2026</h1>
        <p style={{ margin: "3px 0 0", color: "#a07030", fontSize: 11, letterSpacing: "0.1em" }}>FSAID & ROMEO</p>
        <div style={{marginTop:8,display:'flex',alignItems:'center',gap:10,justifyContent:'center'}}>
          <span style={{color:'#666',fontSize:11}}>{user.email}</span>
          <button onClick={logout} style={{background:'none',border:'1px solid #444',borderRadius:6,color:'#666',fontSize:10,padding:'3px 8px',cursor:'pointer'}}>Sair</button>
        </div>
        <div style={{ marginTop: 10, maxWidth: 320, margin: "10px auto 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ color: "#777", fontSize: 11 }}>{totalColadas} coladas</span>
            <span style={{ color: "#f0c060", fontSize: 11, fontWeight: "bold" }}>{pctCompleto}% completo</span>
          </div>
          <div style={{ height: 7, background: "rgba(255,255,255,0.08)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pctCompleto}%`, background: "linear-gradient(90deg, #c8922a, #f0c060)", borderRadius: 99, transition: "width 0.4s" }} />
          </div>
          <div style={{ color: "#444", fontSize: 10, marginTop: 4, textAlign: "right" }}>de {TOTAL_ALBUM} · faltam {totalAindaFaltando}</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.07)", background: "#0c0c12" }}>
        <button style={tabStyle("gastos")} onClick={() => setAba("gastos")}>💰 GASTOS</button>
        <button style={tabStyle("faltando")} onClick={() => { setAba("faltando"); setGrupoAberto(null); }}>🔍 FALTANDO ({totalAindaFaltando})</button>
        <button style={tabStyle("tenho")} onClick={() => { setAba("tenho"); setGrupoAberto(null); }}>✅ TENHO ({totalColadas})</button>
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
              ].map(card => (
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
              {compras.map(c => (
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
                  <button onClick={() => removeCompra(c.id)} style={{ position: "absolute", top: 7, right: 8, background: "none", border: "none", color: "#383838", cursor: "pointer", fontSize: 15, lineHeight: 1 }}>×</button>
                </div>
              ))}
              <div style={{ background: "rgba(144,224,160,0.04)", border: "1px solid rgba(144,224,160,0.12)", borderRadius: 12, padding: "13px 15px", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(144,224,160,0.1)", border: "1px solid rgba(144,224,160,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>🎁</div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: "#90e0a0", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>Presentes de amigos</div>
                  <div style={{ color: "#555", fontSize: 11 }}>47 figurinhas avulsas</div>
                </div>
                <div style={{ color: "#90e0a0", fontWeight: "bold", fontSize: 14 }}>R$ 0,00</div>
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
                ].map(f => (
                  <div key={f.key} style={{ marginBottom: 12 }}>
                    <label style={{ color: "#777", fontSize: 10, display: "block", marginBottom: 4, letterSpacing: "0.06em" }}>{f.label.toUpperCase()}</label>
                    <input type={f.type} placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} style={{ width: "100%", padding: "10px 12px", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#e0e0e0", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
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
        {(aba === "faltando" || aba === "tenho") && (
          <div style={{ paddingTop: 18 }}>
            <div style={{ background: aba === "faltando" ? "rgba(200,146,42,0.07)" : "rgba(144,224,160,0.06)", border: `1px solid ${aba === "faltando" ? "rgba(200,146,42,0.18)" : "rgba(144,224,160,0.18)"}`, borderRadius: 10, padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ color: "#888", fontSize: 12 }}>{aba === "faltando" ? "Total faltando" : "Total coladas"}</span>
              <span style={{ color: aba === "faltando" ? "#f0c060" : "#90e0a0", fontWeight: "bold", fontSize: 17 }}>{aba === "faltando" ? totalAindaFaltando : totalColadas} figurinhas</span>
            </div>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: "9px 12px", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 12 }}>💡</span>
              <span style={{ color: "#666", fontSize: 11 }}>Toque no número para {aba === "faltando" ? "marcar como colada ✅" : "mover de volta para faltando 🔍"}</span>
            </div>
            {aba === "faltando" && (
              <button onClick={exportarFaltando} style={{ width: "100%", padding: "11px", background: "linear-gradient(135deg, #1a1200, #2d1f00)", border: "1px solid rgba(200,146,42,0.4)", borderRadius: 10, color: "#f0c060", fontSize: 12, fontWeight: "bold", cursor: "pointer", letterSpacing: "0.05em", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                📤 COMPARTILHAR LISTA DE FALTANTES
              </button>
            )}
            <input placeholder="🔍 Buscar seleção..." value={busca} onChange={e => { setBusca(e.target.value); setGrupoAberto(null); }} style={{ width: "100%", padding: "10px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 10, color: "#e0e0e0", fontSize: 13, outline: "none", boxSizing: "border-box", marginBottom: 12 }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {renderGrupos(aba)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
