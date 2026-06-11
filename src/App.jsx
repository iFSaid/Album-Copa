import { useState, useMemo, useEffect } from "react";
import { supabase } from './supabase.js'
import Legends from './Legends.jsx'

const initialCompras = [
  { id: 1, data: "Primeira compra", descricao: "Kit Especial (Álbum Capa Dura Dourado + 60 pacotes)", pacotes: 60, valor: 500, tipo: "kit" },
  { id: 2, data: "Segunda compra", descricao: "12 pacotes de figurinha", pacotes: 12, valor: 84, tipo: "pacote" },
  { id: 3, data: "16/05/2026", descricao: "10 pacotes de figurinha", pacotes: 10, valor: 70, tipo: "pacote" },
  { id: 4, data: "16/05/2026", descricao: "10 pacotes de figurinha", pacotes: 10, valor: 70, tipo: "pacote" },
];

const initialTrocas = [
  { descricao: "Presente Camila → Romeo", deu: 0, recebeu: 47, data: "17/05/2026" },
  { descricao: "Troca com amigo", deu: 18, recebeu: 26, data: "18/05/2026" },
  { descricao: "Troca com amigo", deu: 30, recebeu: 3, data: "18/05/2026" },
];

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
  const [trocas, setTrocas] = useState([])
  const [showForm, setShowForm] = useState(false);
  const [showFormTroca, setShowFormTroca] = useState(false);
  const [form, setForm] = useState({ descricao: "", pacotes: "", valor: "" });
  const [formTroca, setFormTroca] = useState({ descricao: "", deu: "", recebeu: "" });
  const [aba, setAba] = useState("resumo");
  const [busca, setBusca] = useState("");
  const [grupoAberto, setGrupoAberto] = useState(null);
  const [faltando, setFaltando] = useState({})
  const [loadingDados, setLoadingDados] = useState(true)
  const [user, setUser] = useState(null)
  const [loadingAuth, setLoadingAuth] = useState(true)
  const [anelAnimado, setAnelAnimado] = useState(false)
  const [tema, setTema] = useState("dark")
  const [repetidasData, setRepetidasData] = useState([])

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

        const { data: trocasData } = await supabase
          .from('trocas').select('*').eq('user_id', user.id).order('id')

        if (trocasData && trocasData.length > 0) {
          setTrocas(trocasData)
        } else {
          const iniciaisTrocas = initialTrocas.map(t => ({ ...t, user_id: user.id }))
          const { data: trocasIns } = await supabase.from('trocas').insert(iniciaisTrocas).select()
          setTrocas(trocasIns || initialTrocas)
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

        const { data: repetidasDB } = await supabase
          .from('repetidas').select('*').eq('user_id', user.id)
        setRepetidasData(repetidasDB || [])
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

  useEffect(() => {
    if (aba !== "resumo") return
    setAnelAnimado(false)
    const t = setTimeout(() => setAnelAnimado(true), 100)
    return () => clearTimeout(t)
  }, [aba])

  const totalGasto = compras.reduce((acc, c) => acc + c.valor, 0);
  const totalPacotes = compras.reduce((acc, c) => acc + c.pacotes, 0);
  const totalRecebidoTrocas = trocas.reduce((s, t) => s + t.recebeu, 0)
  const totalDadoTrocas = trocas.reduce((s, t) => s + t.deu, 0)
  const totalFigurinhas = totalPacotes * 7 + totalRecebidoTrocas;
  const totalAindaFaltando = Object.values(faltando).filter(Boolean).length;
  const totalColadas = COLADAS_BASE + (totalFaltandoInicial - totalAindaFaltando);
  const repetidas = totalFigurinhas - totalColadas - totalDadoTrocas;
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

  const toggleRepetida = async (code, num) => {
    const existe = repetidasData.find(r => r.code === code && String(r.num) === String(num))
    if (existe) {
      await supabase.from('repetidas').delete()
        .eq('user_id', user.id).eq('code', code).eq('num', Number(num))
      setRepetidasData(prev => prev.filter(r => !(r.code === code && String(r.num) === String(num))))
    } else {
      const nova = { user_id: user.id, code, num: Number(num), quantidade: 1 }
      const { data } = await supabase.from('repetidas').insert([nova]).select()
      if (data) setRepetidasData(prev => [...prev, data[0]])
    }
  }

  const compartilharRepetidas = () => {
    const gruposParaCompartilhar = grupoStats.filter(g => g.id !== 'especiais')
    let texto = "🔁 MINHAS REPETIDAS — Álbum Copa 2026\n\n"
    gruposParaCompartilhar.forEach(g => {
      const linhas = []
      g.codes.forEach(code => {
        const nums = repetidasData
          .filter(r => r.code === code)
          .map(r => r.num)
          .sort((a, b) => a - b)
        if (nums.length > 0) {
          const secao = secaoMap[code]
          linhas.push(`  ${secao?.emoji || ''} ${secao?.nome || code}: ${nums.join(', ')}`)
        }
      })
      if (linhas.length > 0) {
        texto += `Grupo ${g.id}:\n${linhas.join('\n')}\n\n`
      }
    })
    texto += `Total: ${repetidasData.length} figurinhas repetidas\n`
    texto += `Gerado em: ${new Date().toLocaleDateString('pt-BR')}`
    if (navigator.share) {
      navigator.share({ title: 'Minhas Repetidas — Copa 2026', text: texto })
    } else {
      navigator.clipboard.writeText(texto).then(() => alert('Lista copiada!'))
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
  async function addTroca() {
    if (!formTroca.descricao || !user) return
    const nova = {
      user_id: user.id,
      descricao: formTroca.descricao,
      deu: parseInt(formTroca.deu) || 0,
      recebeu: parseInt(formTroca.recebeu) || 0,
      data: new Date().toLocaleDateString('pt-BR')
    }
    const { data } = await supabase.from('trocas').insert([nova]).select()
    if (data) setTrocas(prev => [...prev, data[0]])
    setShowFormTroca(false)
    setFormTroca({ descricao: "", deu: "", recebeu: "" })
  }
  async function deleteTroca(id) {
    await supabase.from('trocas').delete().eq('id', id)
    setTrocas(prev => prev.filter(t => t.id !== id))
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

  const tabStyle = (abaId) => ({
    flex: 1, padding: "10px 2px",
    background: aba === abaId ? "rgba(200,146,42,0.12)" : "none",
    border: "none",
    borderBottom: aba === abaId ? `2px solid ${t.accent}` : "2px solid transparent",
    color: aba === abaId ? t.accent : t.textMuted,
    fontSize: 10, fontWeight: "bold", cursor: "pointer",
    letterSpacing: "0.05em", fontFamily: "sans-serif",
  });

  const chipBase = { fontSize: 15, padding: "8px 12px", borderRadius: 8, fontFamily: "monospace", cursor: "pointer", userSelect: "none", minWidth: 36, minHeight: 36, display: "inline-flex", alignItems: "center", justifyContent: "center" };

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
        <div key={g.id} style={{ background: t.rowBg, border: `1px solid ${isAberto ? t.inputBorder : t.rowBorder}`, borderRadius: 12, overflow: "hidden", transition: "border 0.2s" }}>
          {/* Header do grupo */}
          <div onClick={() => setGrupoAberto(isAberto ? null : `${modo}-${g.id}`)} style={{ padding: "12px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ color: t.text, fontSize: 13, fontWeight: "bold" }}>{g.label}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {modo === "faltando" && g.faltam > 0 && <span style={{ background: "rgba(224,112,112,0.14)", color: "#e07070", fontSize: 11, fontWeight: "bold", padding: "2px 8px", borderRadius: 20 }}>{g.faltam} fig.</span>}
                  {modo === "tenho" && <span style={{ background: "rgba(144,224,160,0.12)", color: "#90e0a0", fontSize: 11, fontWeight: "bold", padding: "2px 8px", borderRadius: 20 }}>{g.tenho} fig.</span>}
                  <span style={{ color: t.textMuted, fontSize: 14 }}>{isAberto ? "▲" : "▼"}</span>
                </div>
              </div>
              {/* Mini barra de progresso */}
              <div style={{ height: 4, background: t.barTrack, borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? "linear-gradient(90deg,#90e0a0,#60c080)" : "linear-gradient(90deg,#c8922a,#f0c060)", borderRadius: 99, transition: "width 0.3s" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
                <span style={{ color: t.textMuted, fontSize: 10 }}>{g.codes.map(c => secaoMap[c]?.emoji).join(" ")}</span>
                <span style={{ color: t.textMuted, fontSize: 10 }}>{pct}%</span>
              </div>
            </div>
          </div>

          {/* Conteúdo expandido */}
          {isAberto && (
            <div style={{ borderTop: `1px solid ${t.rowBorder}`, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
              {secoesDoGrupo.map(s => {
                const nums = modo === "faltando" ? s.faltamNums : s.tenhoNums;
                const totalSec = s.nums.length;
                const coladasSec = s.tenhoNums.length;
                const pctSec = totalSec > 0 ? Math.round((coladasSec / totalSec) * 100) : 0;
                const corSec = pctSec === 100 ? '#1D9E75' : pctSec >= 70 ? '#6ab0e8' : pctSec >= 50 ? '#c9a84c' : '#e07050';
                return (
                  <div key={s.code}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ color: t.textSub, fontSize: 12 }}>{s.emoji} {s.nome}</span>
                        {pctSec === 100 && <span style={{ fontSize: 9, padding: '1px 7px', borderRadius: 99, background: '#0d2018', color: '#1D9E75', border: '1px solid #1D9E75' }}>completa</span>}
                      </div>
                      <span style={{ color: corSec, fontSize: 11 }}>{pctSec}%</span>
                    </div>
                    <div style={{ height: 3, background: t.barTrack, borderRadius: 99, overflow: 'hidden', marginBottom: 6 }}>
                      <div style={{ height: '100%', width: `${pctSec}%`, background: corSec, borderRadius: 99 }} />
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {nums.map(n => (
                        <span key={n} onClick={() => toggleFaltando(s.code, n)}
                          style={{ ...chipBase,
                            background: t.bgCard,
                            color: t.textMuted,
                            border: `1px solid ${t.border}`,
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

  function renderGruposRepetidas() {
    const gruposFiltrados = grupoStats.filter(g => g.id !== 'especiais' && g.tenho > 0)

    if (gruposFiltrados.length === 0) {
      return <div style={{textAlign:'center', color:t.textMuted, padding:'40px 16px', fontSize:14}}>
        Nenhuma figurinha colada ainda.
      </div>
    }

    return gruposFiltrados.map(g => {
      const isAberto = grupoAberto === `repetidas-${g.id}`
      const secoesComTenho = g.codes
        .map(c => secaoData[c])
        .filter(s => s && s.tenhoNums.length > 0)

      if (secoesComTenho.length === 0) return null

      const repDoGrupo = secoesComTenho.reduce((acc, s) => {
        return acc + s.tenhoNums.filter(n => repetidasData.some(r => r.code === s.code && r.num === n)).length
      }, 0)

      return (
        <div key={g.id} style={{marginBottom:12, borderRadius:12, overflow:'hidden',
          border:'1px solid '+(repDoGrupo > 0 ? t.accent : t.border), background:t.bgCard}}>

          <div onClick={() => setGrupoAberto(isAberto ? null : `repetidas-${g.id}`)}
            style={{display:'flex', justifyContent:'space-between', alignItems:'center',
              padding:'12px 16px', cursor:'pointer'}}>
            <span style={{fontWeight:'bold', color:t.text, fontSize:14}}>Grupo {g.id}</span>
            <div style={{display:'flex', alignItems:'center', gap:8}}>
              {repDoGrupo > 0 && (
                <span style={{fontSize:11, padding:'2px 8px', borderRadius:99,
                  background:t.accent, color:'#1a1200', fontWeight:'bold'}}>
                  {repDoGrupo} rep.
                </span>
              )}
              <span style={{color:t.textMuted, fontSize:12}}>{isAberto ? '▲' : '▼'}</span>
            </div>
          </div>

          {isAberto && (
            <div style={{padding:'0 16px 16px'}}>
              {secoesComTenho.map(s => {
                const repDaSecao = s.tenhoNums.filter(n =>
                  repetidasData.some(r => r.code === s.code && r.num === n)
                ).length
                return (
                  <div key={s.code} style={{marginBottom:14}}>
                    <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:7}}>
                      <span style={{fontSize:16}}>{s.emoji}</span>
                      <span style={{fontSize:13, fontWeight:600, color:t.text}}>{s.nome}</span>
                      {repDaSecao > 0 && (
                        <span style={{fontSize:10, padding:'1px 7px', borderRadius:99,
                          background:t.accent, color:'#1a1200', fontWeight:'bold'}}>
                          {repDaSecao}×
                        </span>
                      )}
                    </div>
                    <div style={{display:'flex', flexWrap:'wrap', gap:6}}>
                      {s.tenhoNums.map(n => {
                        const isRep = repetidasData.some(r => r.code === s.code && r.num === n)
                        return (
                          <button key={n}
                            onClick={() => toggleRepetida(s.code, n)}
                            style={{
                              minWidth:36, minHeight:36, padding:'6px 10px',
                              fontSize:14, fontWeight: isRep ? 'bold' : 'normal',
                              borderRadius:8, cursor:'pointer', border:'1px solid',
                              borderColor: isRep ? t.accent : t.border,
                              background: isRep ? t.accent : t.bgCard2,
                              color: isRep ? '#1a1200' : t.textMuted,
                              transition:'all 0.15s'
                            }}>
                            {n}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )
    }).filter(Boolean)
  }

  const t = tema === "dark" ? {
    bg: "#1a1400", bgCard: "#211900", bgCard2: "#181200",
    border: "#3a2e00", border2: "#2a2000",
    text: "#f0d080", textMuted: "#666", textSub: "#aaa",
    accent: "#c9a84c", barTrack: "#2a2200",
    headerBg: "#1a1200", headerBorder: "#2d1f00",
    tabBg: "#0c0a00", tabBorder: "#2a2200",
    inputBg: "rgba(255,255,255,0.06)", inputBorder: "rgba(200,146,42,0.3)", inputColor: "#f0d080",
    rowBg: "rgba(255,255,255,0.03)", rowBorder: "rgba(200,146,42,0.15)",
    rowBgAlt: "rgba(144,224,160,0.04)", skeletonBg: "#2a2200"
  } : {
    bg: "#fef9ee", bgCard: "#fffbea", bgCard2: "#fffbea",
    border: "#f0d878", border2: "#f0d878",
    text: "#78450a", textMuted: "#b8a060", textSub: "#888",
    accent: "#c9a84c", barTrack: "#f0d878",
    headerBg: "#fff8e1", headerBorder: "#f0d878",
    tabBg: "#fffbea", tabBorder: "#f0d878",
    inputBg: "rgba(0,0,0,0.04)", inputBorder: "#f0d878", inputColor: "#78450a",
    rowBg: "#fffbea", rowBorder: "#f0d878",
    rowBgAlt: "#e8f8ee", skeletonBg: "#f0d878"
  }

  const circumMain = 2 * Math.PI * 54
  const offsetMain = anelAnimado ? circumMain * (1 - parseFloat(pctCompleto) / 100) : circumMain
  const gruposLetra = grupoStats.filter(g => g.id !== 'especiais')

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

  return (
    <div style={{ minHeight: "100vh", background: t.bg, color: t.text, fontFamily: "'Georgia', serif", paddingBottom: 60 }}>
      {/* Header */}
      <div style={{ background: t.headerBg, borderBottom: `2px solid ${t.headerBorder}`, padding: "22px 24px 16px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 20% 50%, rgba(200,146,42,0.08) 0%, transparent 60%)" }} />
        <div style={{ fontSize: 28, marginBottom: 2 }}>⚽🏆</div>
        <h1 style={{ margin: 0, color: "#f0c060", fontSize: "clamp(15px, 5vw, 21px)", fontWeight: "bold", letterSpacing: "0.04em", textShadow: "0 0 24px rgba(240,192,96,0.4)" }}>ÁLBUM DA COPA 2026</h1>
        <p style={{ margin: "3px 0 0", color: "#a07030", fontSize: 11, letterSpacing: "0.1em" }}>FSAID & ROMEO</p>
        <div style={{marginTop:8,display:'flex',alignItems:'center',gap:10,justifyContent:'center'}}>
          <span style={{color:t.textMuted,fontSize:11}}>{user.email}</span>
          <button onClick={() => setTema(tema === 'dark' ? 'light' : 'dark')} style={{background: tema === 'dark' ? t.headerBg : '#fde68a', color: tema === 'dark' ? t.accent : '#78450a', fontSize:10, padding:'4px 10px', borderRadius:99, border: tema === 'dark' ? `1px solid ${t.border}` : '1px solid #f0d878', cursor:'pointer'}}>{tema === 'dark' ? '☀️ light' : '🌙 dark'}</button>
          <button onClick={logout} style={{background:'none',border:'1px solid #444',borderRadius:6,color:'#666',fontSize:10,padding:'3px 8px',cursor:'pointer'}}>Sair</button>
        </div>
        <div style={{ marginTop: 10, maxWidth: 320, margin: "10px auto 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ color: "#777", fontSize: 11 }}>{totalColadas} coladas</span>
            <span style={{ color: "#f0c060", fontSize: 11, fontWeight: "bold" }}>{pctCompleto}% completo</span>
          </div>
          <div style={{ height: 7, background: t.barTrack, borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pctCompleto}%`, background: "linear-gradient(90deg, #c8922a, #f0c060)", borderRadius: 99, transition: "width 0.4s" }} />
          </div>
          <div style={{ color: "#444", fontSize: 10, marginTop: 4, textAlign: "right" }}>de {TOTAL_ALBUM} · faltam {totalAindaFaltando}</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: `1px solid ${t.tabBorder}`, background: t.bg }}>
        <button style={tabStyle("resumo")} onClick={() => setAba("resumo")}>🏠 RESUMO</button>
        <button style={tabStyle("gastos")} onClick={() => setAba("gastos")}>💰 GASTOS</button>
        <button style={tabStyle("faltando")} onClick={() => { setAba("faltando"); setGrupoAberto(null); }}>🔍 FALTANDO ({totalAindaFaltando})</button>
        <button style={tabStyle("tenho")} onClick={() => { setAba("tenho"); setGrupoAberto(null); }}>✅ TENHO ({totalColadas})</button>
        <button style={tabStyle("repetidas")} onClick={() => { setAba("repetidas"); setGrupoAberto(null); }}>🔁 REP. ({repetidasData.length})</button>
        <button style={{ ...tabStyle("legends"), ...(aba === "legends" ? { color: "#b78cf0", borderBottom: "2px solid #8a5cd0", background: "rgba(138,92,208,0.10)" } : {}) }} onClick={() => setAba("legends")}>⭐ LEGENDS</button>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 16px" }}>
        {loadingDados ? (
          <div style={{ paddingTop: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[60, 44, 44].map((h, i) => (
              <div key={i} style={{ height: h, borderRadius: 10, background: t.skeletonBg, animation: 'pulse 1.2s ease-in-out infinite' }} />
            ))}
          </div>
        ) : (<>

        {/* === ABA RESUMO === */}
        {aba === "resumo" && (
          <div style={{ paddingTop: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Anel central */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
              <svg width={132} height={132} viewBox="0 0 132 132">
                <circle cx={66} cy={66} r={54} fill="none" stroke={t.barTrack} strokeWidth={10} />
                <circle cx={66} cy={66} r={54} fill="none" stroke="#c9a84c" strokeWidth={10}
                  strokeDasharray={circumMain} strokeDashoffset={offsetMain}
                  strokeLinecap="round" transform="rotate(-90 66 66)"
                  style={{ transition: 'stroke-dashoffset 1s ease' }} />
                <text x={66} y={62} textAnchor="middle" dominantBaseline="central"
                  fill="#f0c060" fontSize={20} fontWeight="bold" fontFamily="sans-serif">
                  {pctCompleto}%
                </text>
                <text x={66} y={80} textAnchor="middle"
                  fill={t.textMuted} fontSize={10} fontFamily="sans-serif">
                  completo
                </text>
              </svg>
              <div style={{ width: '100%', maxWidth: 300 }}>
                <div style={{ height: 6, background: t.barTrack, borderRadius: 99, overflow: 'hidden', marginBottom: 7 }}>
                  <div style={{ height: '100%', width: `${pctCompleto}%`, background: 'linear-gradient(90deg,#c8922a,#f0c060)', borderRadius: 99, transition: 'width 1s ease' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 10, fontSize: 11, fontFamily: 'sans-serif' }}>
                  <span style={{ color: '#90e0a0' }}>{totalColadas} coladas</span>
                  <span style={{ color: '#444' }}>·</span>
                  <span style={{ color: '#e07070' }}>{totalAindaFaltando} faltando</span>
                  <span style={{ color: '#444' }}>·</span>
                  <span style={{ color: '#555' }}>de 994</span>
                </div>
              </div>
            </div>
            {/* Mini cards 3x2 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              {[
                { label: 'Faltando', valor: totalAindaFaltando, cor: '#e07050' },
                { label: 'Repetidas', valor: repetidas >= 0 ? repetidas : '—', cor: '#7ec8e3' },
                { label: 'Pacotes', valor: totalPacotes, cor: '#7ec8e3' },
                { label: 'Investido', valor: `R$ ${totalGasto.toFixed(0)}`, cor: '#f0c060' },
                { label: 'Recebidas', valor: totalFigurinhas, cor: '#7ec8e3' },
                { label: 'Custo/pct', valor: totalPacotes > 0 ? `R$ ${(totalGasto / totalPacotes).toFixed(1)}` : '—', cor: '#c9a84c' },
              ].map(card => (
                <div key={card.label} style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 10, padding: '12px 6px', textAlign: 'center' }}>
                  <div style={{ color: card.cor, fontWeight: 'bold', fontSize: 15 }}>{card.valor}</div>
                  <div style={{ color: t.textMuted, fontSize: 9, marginTop: 3, letterSpacing: '0.04em', fontFamily: 'sans-serif' }}>{card.label.toUpperCase()}</div>
                </div>
              ))}
            </div>
            {/* Grid grupos A-L */}
            <div>
              <div style={{ color: t.textMuted, fontSize: 10, letterSpacing: '0.12em', marginBottom: 10, fontFamily: 'sans-serif' }}>GRUPOS</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {gruposLetra.map(g => {
                  const pctG = g.total > 0 ? Math.round((g.tenho / g.total) * 100) : 0
                  const corG = pctG === 100 ? '#1D9E75' : pctG >= 70 ? '#6ab0e8' : pctG >= 50 ? '#c9a84c' : '#e07050'
                  const circumG = 2 * Math.PI * 14
                  const offsetG = anelAnimado ? circumG * (1 - pctG / 100) : circumG
                  return (
                    <div key={g.id} style={{ background: pctG === 100 ? '#0d2018' : t.bgCard2, border: `1px solid ${pctG === 100 ? '#1D9E75' : t.border2}`, borderRadius: 10, padding: '10px 4px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <svg width={36} height={36} viewBox="0 0 36 36">
                        <circle cx={18} cy={18} r={14} fill="none" stroke={t.barTrack} strokeWidth={4} />
                        <circle cx={18} cy={18} r={14} fill="none" stroke={corG} strokeWidth={4}
                          strokeDasharray={circumG} strokeDashoffset={offsetG}
                          strokeLinecap="round" transform="rotate(-90 18 18)"
                          style={{ transition: 'stroke-dashoffset 1s ease' }} />
                      </svg>
                      <div style={{ color: t.textSub, fontSize: 9, fontFamily: 'sans-serif', letterSpacing: '0.04em' }}>GRP {g.id}</div>
                      <div style={{ color: corG, fontSize: 10, fontWeight: 'bold', fontFamily: 'sans-serif' }}>{pctG}%</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* === ABA GASTOS === */}
        {aba === "gastos" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, margin: "20px 0 14px" }}>
              {[
                { label: "Total Gasto", valor: `R$ ${totalGasto.toFixed(2).replace(".", ",")}`, icon: "💰", cor: "#f0c060" },
                { label: "Pacotes", valor: totalPacotes, icon: "📦", cor: "#7ec8e3" },
                { label: "Repetidas", valor: repetidas, icon: "🔁", cor: "#e07070" },
              ].map(card => (
                <div key={card.label} style={{ background: t.rowBg, border: `1px solid ${t.rowBorder}`, borderRadius: 12, padding: "14px 8px", textAlign: "center" }}>
                  <div style={{ fontSize: 20 }}>{card.icon}</div>
                  <div style={{ color: card.cor, fontWeight: "bold", fontSize: "clamp(12px, 4vw, 17px)", marginTop: 4 }}>{card.valor}</div>
                  <div style={{ color: t.textMuted, fontSize: 10, marginTop: 2, letterSpacing: "0.04em" }}>{card.label.toUpperCase()}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
              {[
                { label: "Total recebido", valor: `${totalFigurinhas} figurinhas` },
                { label: "Custo médio/pacote", valor: `R$ ${mediaPorPacote.replace(".", ",")}` },
              ].map(s => (
                <div key={s.label} style={{ background: t.rowBg, border: `1px solid ${t.rowBorder}`, borderRadius: 10, padding: "10px 14px" }}>
                  <div style={{ color: t.textMuted, fontSize: 10, letterSpacing: "0.06em", marginBottom: 3 }}>{s.label.toUpperCase()}</div>
                  <div style={{ color: "#f0c060", fontWeight: "bold", fontSize: 14 }}>{s.valor}</div>
                </div>
              ))}
            </div>
            <h2 style={{ color: t.textMuted, fontSize: 10, letterSpacing: "0.12em", margin: "0 0 10px", fontFamily: "sans-serif" }}>HISTÓRICO</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
              {compras.map(c => (
                <div key={c.id} style={{ background: t.rowBg, border: `1px solid ${t.rowBorder}`, borderRadius: 12, padding: "13px 15px", display: "flex", alignItems: "center", gap: 12, position: "relative" }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: c.tipo === "kit" ? "rgba(240,192,96,0.15)" : "rgba(126,200,227,0.1)", border: `1px solid ${c.tipo === "kit" ? "rgba(240,192,96,0.3)" : "rgba(126,200,227,0.2)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                    {c.tipo === "kit" ? "🏆" : "📦"}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: t.text, fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>{c.descricao}</div>
                    <div style={{ color: t.textMuted, fontSize: 11 }}>{c.pacotes} pacotes · {c.pacotes * 7} fig.</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0, paddingRight: 16 }}>
                    <div style={{ color: "#f0c060", fontWeight: "bold", fontSize: 14 }}>R$ {c.valor.toFixed(2).replace(".", ",")}</div>
                    <div style={{ color: "#444", fontSize: 10 }}>{c.data}</div>
                  </div>
                  <button onClick={() => removeCompra(c.id)} style={{ position: "absolute", top: 7, right: 8, background: "none", border: "none", color: "#383838", cursor: "pointer", fontSize: 15, lineHeight: 1 }}>×</button>
                </div>
              ))}
            </div>

            <h2 style={{ color: t.textMuted, fontSize: 10, letterSpacing: "0.12em", margin: "20px 0 10px", fontFamily: "sans-serif" }}>🔄 TROCAS</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
              {[
                { label: "Recebidas", valor: `+${totalRecebidoTrocas}`, cor: "#90e0a0" },
                { label: "Dadas", valor: `-${totalDadoTrocas}`, cor: "#e07070" },
                { label: "Saldo", valor: `${totalRecebidoTrocas - totalDadoTrocas >= 0 ? "+" : ""}${totalRecebidoTrocas - totalDadoTrocas}`, cor: "#c9a84c" },
              ].map(card => (
                <div key={card.label} style={{ background: t.rowBg, border: `1px solid ${t.rowBorder}`, borderRadius: 12, padding: "14px 8px", textAlign: "center" }}>
                  <div style={{ color: card.cor, fontWeight: "bold", fontSize: 17, marginTop: 4 }}>{card.valor}</div>
                  <div style={{ color: t.textMuted, fontSize: 10, marginTop: 2, letterSpacing: "0.04em" }}>{card.label.toUpperCase()}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 12 }}>
              {trocas.map(troca => {
                const saldo = troca.recebeu - troca.deu;
                return (
                  <div key={troca.id} style={{ background: t.rowBg, border: `1px solid ${t.rowBorder}`, borderRadius: 12, padding: "13px 15px", display: "flex", alignItems: "center", gap: 12, position: "relative" }}>
                    <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(126,200,227,0.1)", border: "1px solid rgba(126,200,227,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>🔄</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: t.text, fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>{troca.descricao}</div>
                      <div style={{ display: "flex", gap: 8, fontSize: 11 }}>
                        {troca.recebeu > 0 && <span style={{ color: "#90e0a0" }}>+{troca.recebeu} recebidas</span>}
                        {troca.deu > 0 && <span style={{ color: "#e07070" }}>-{troca.deu} dadas</span>}
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0, paddingRight: 16 }}>
                      <div style={{ color: saldo >= 0 ? "#90e0a0" : "#e07070", fontWeight: "bold", fontSize: 14 }}>{saldo >= 0 ? "+" : ""}{saldo} fig.</div>
                      <div style={{ color: "#444", fontSize: 10 }}>{troca.data}</div>
                    </div>
                    <button onClick={() => deleteTroca(troca.id)} style={{ position: "absolute", top: 7, right: 8, background: "none", border: "none", color: "#383838", cursor: "pointer", fontSize: 15, lineHeight: 1 }}>×</button>
                  </div>
                );
              })}
            </div>
            {!showFormTroca ? (
              <button onClick={() => setShowFormTroca(true)} style={{ width: "100%", padding: "13px", background: "linear-gradient(135deg, #0d1a2d, #0a1520)", border: "1px solid #7ec8e3", borderRadius: 12, color: "#7ec8e3", fontSize: 13, fontWeight: "bold", cursor: "pointer", letterSpacing: "0.05em", marginBottom: 16 }}>
                + REGISTRAR TROCA
              </button>
            ) : (
              <div style={{ background: t.rowBg, border: `1px solid ${t.inputBorder}`, borderRadius: 12, padding: "16px", marginBottom: 16 }}>
                <h3 style={{ color: "#7ec8e3", margin: "0 0 14px", fontSize: 11, letterSpacing: "0.08em" }}>NOVA TROCA</h3>
                {[
                  { label: "Descrição", key: "descricao", type: "text", placeholder: "Ex: Troca com João" },
                  { label: "Figurinhas recebidas", key: "recebeu", type: "number", placeholder: "Ex: 5" },
                  { label: "Figurinhas dadas", key: "deu", type: "number", placeholder: "Ex: 3" },
                ].map(f => (
                  <div key={f.key} style={{ marginBottom: 12 }}>
                    <label style={{ color: "#777", fontSize: 10, display: "block", marginBottom: 4, letterSpacing: "0.06em" }}>{f.label.toUpperCase()}</label>
                    <input type={f.type} placeholder={f.placeholder} value={formTroca[f.key]} onChange={e => setFormTroca({ ...formTroca, [f.key]: e.target.value })} style={{ width: "100%", padding: "10px 12px", background: t.inputBg, border: `1px solid ${t.inputBorder}`, borderRadius: 8, color: t.inputColor, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                  </div>
                ))}
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => { setShowFormTroca(false); setFormTroca({ descricao: "", deu: "", recebeu: "" }); }} style={{ flex: 1, padding: "11px", background: "none", border: "1px solid #333", borderRadius: 8, color: "#777", cursor: "pointer", fontSize: 13 }}>Cancelar</button>
                  <button onClick={addTroca} style={{ flex: 2, padding: "11px", background: "linear-gradient(135deg, #1a4060, #2060a0)", border: "none", borderRadius: 8, color: "#e0e0e0", fontWeight: "bold", cursor: "pointer", fontSize: 13 }}>Salvar</button>
                </div>
              </div>
            )}
            {!showForm ? (
              <button onClick={() => setShowForm(true)} style={{ width: "100%", padding: "13px", background: "linear-gradient(135deg, #2d1f00, #3d2a00)", border: "1px solid #c8922a", borderRadius: 12, color: "#f0c060", fontSize: 13, fontWeight: "bold", cursor: "pointer", letterSpacing: "0.05em" }}>
                + REGISTRAR NOVA COMPRA
              </button>
            ) : (
              <div style={{ background: t.rowBg, border: `1px solid ${t.inputBorder}`, borderRadius: 12, padding: "16px" }}>
                <h3 style={{ color: "#f0c060", margin: "0 0 14px", fontSize: 11, letterSpacing: "0.08em" }}>NOVA COMPRA</h3>
                {[
                  { label: "Descrição", key: "descricao", type: "text", placeholder: "Ex: 8 pacotes avulsos" },
                  { label: "Qtd. de pacotes", key: "pacotes", type: "number", placeholder: "Ex: 8" },
                  { label: "Valor pago (R$)", key: "valor", type: "number", placeholder: "Ex: 56" },
                ].map(f => (
                  <div key={f.key} style={{ marginBottom: 12 }}>
                    <label style={{ color: "#777", fontSize: 10, display: "block", marginBottom: 4, letterSpacing: "0.06em" }}>{f.label.toUpperCase()}</label>
                    <input type={f.type} placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} style={{ width: "100%", padding: "10px 12px", background: t.inputBg, border: `1px solid ${t.inputBorder}`, borderRadius: 8, color: t.inputColor, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
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
            <div style={{ background: t.rowBg, border: `1px solid ${t.rowBorder}`, borderRadius: 8, padding: "9px 12px", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 12 }}>💡</span>
              <span style={{ color: t.textMuted, fontSize: 11 }}>Toque no número para {aba === "faltando" ? "marcar como colada ✅" : "mover de volta para faltando 🔍"}</span>
            </div>
            {aba === "faltando" && (
              <button onClick={exportarFaltando} style={{ width: "100%", padding: "11px", background: "linear-gradient(135deg, #1a1200, #2d1f00)", border: "1px solid rgba(200,146,42,0.4)", borderRadius: 10, color: "#f0c060", fontSize: 12, fontWeight: "bold", cursor: "pointer", letterSpacing: "0.05em", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                📤 COMPARTILHAR LISTA DE FALTANTES
              </button>
            )}
            <input placeholder="🔍 Buscar seleção..." value={busca} onChange={e => { setBusca(e.target.value); setGrupoAberto(null); }} style={{ width: "100%", padding: "10px 14px", background: t.inputBg, border: `1px solid ${t.inputBorder}`, borderRadius: 10, color: t.inputColor, fontSize: 13, outline: "none", boxSizing: "border-box", marginBottom: 12 }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {renderGrupos(aba)}
            </div>
          </div>
        )}
        {/* === ABA REPETIDAS === */}
        {aba === "repetidas" && (
          <div style={{ paddingTop: 18 }}>
            {repetidasData.length > 0 && (
              <button onClick={compartilharRepetidas}
                style={{ width: '100%', marginBottom: 12, padding: '11px', borderRadius: 10,
                  background: 'transparent', border: `1px solid ${t.accent}`, color: t.accent,
                  fontSize: 12, fontWeight: 'bold', cursor: 'pointer', letterSpacing: '0.05em',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                📤 COMPARTILHAR REPETIDAS ({repetidasData.length})
              </button>
            )}
            <div style={{ background: t.rowBg, border: `1px solid ${t.rowBorder}`, borderRadius: 8, padding: '9px 12px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 12 }}>💡</span>
              <span style={{ color: t.textMuted, fontSize: 11 }}>Toque no número para marcar ou desmarcar como repetida 🔁</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {renderGruposRepetidas()}
            </div>
          </div>
        )}
        </>)}
      </div>
      {aba === "legends" && <Legends user={user} />}
    </div>
  );
}
