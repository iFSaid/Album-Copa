import { useState, useEffect, useMemo } from "react";
import { supabase } from './supabase.js';
import { Star, Repeat2, Trophy } from "lucide-react";
import Legends from './Legends.jsx';
import Memorial from './Memorial.jsx';
import Trocas from './Trocas.jsx';

const F = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Segoe UI', Roboto, sans-serif";
const MONO = "ui-monospace, 'SF Mono', SFMono-Regular, Menlo, monospace";

export const DARK = {
  bg: "#0b0f14",
  verde: "#35d977", verdeDim: "53,217,119",
  ceu: "#6cb8ff", ceuDim: "108,184,255",
  coral: "#ff7a70", coralDim: "255,122,112",
  texto: "#eef4f8", texto2: "rgba(238,244,248,0.55)", texto3: "rgba(238,244,248,0.32)",
  vidro: "rgba(255,255,255,0.055)", borda: "rgba(255,255,255,0.10)",
  violeta: "#b78cf0", violetaDim: "183,140,240",
};

export const LIGHT = {
  bg: "#f2f5f7",
  verde: "#1a9e4e", verdeDim: "26,158,78",
  ceu: "#2a7fd4", ceuDim: "42,127,212",
  coral: "#d44530", coralDim: "212,69,48",
  texto: "#13202b", texto2: "rgba(19,32,43,0.60)", texto3: "rgba(19,32,43,0.40)",
  vidro: "rgba(0,0,0,0.04)", borda: "rgba(0,0,0,0.10)",
  violeta: "#7d4abf", violetaDim: "125,74,191",
};

const css = `
.nj-root * { -webkit-tap-highlight-color: transparent; box-sizing: border-box; }
@keyframes njIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes njPop { 0% { transform: scale(1); } 40% { transform: scale(1.18); } 100% { transform: scale(1); } }
.nj-in { animation: njIn 0.45s ease-out both; }
.nj-press { transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s; }
.nj-press:active { transform: scale(0.94); opacity: 0.85; }
.nj-pop { animation: njPop 0.3s ease-out; }
.nj-scroll { scrollbar-width: none; -ms-overflow-style: none; }
.nj-scroll::-webkit-scrollbar { display: none; }
@media (prefers-reduced-motion: reduce) { .nj-in, .nj-press, .nj-pop { animation: none; transition: none; } }
`;

const initialCompras = [
  { id: 1, data: "Primeira compra", descricao: "Kit Especial (Álbum Capa Dura Dourado + 60 pacotes)", pacotes: 60, valor: 500, tipo: "kit" },
  { id: 2, data: "Segunda compra", descricao: "12 pacotes de figurinha", pacotes: 12, valor: 84, tipo: "pacote" },
  { id: 3, data: "16/05/2026", descricao: "10 pacotes de figurinha", pacotes: 10, valor: 70, tipo: "pacote" },
  { id: 4, data: "16/05/2026", descricao: "10 pacotes de figurinha", pacotes: 10, valor: 70, tipo: "pacote" },
];

const initialHistoricoTrocas = [
  { descricao: "Presente Camila → Romeo", deu: 0, recebeu: 47, data: "17/05/2026" },
  { descricao: "Troca com amigo", deu: 18, recebeu: 26, data: "18/05/2026" },
  { descricao: "Troca com amigo", deu: 30, recebeu: 3, data: "18/05/2026" },
];

export const secoes = [
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

export default function App() {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [tema, setTema] = useState("dark");
  const [aba, setAba] = useState("legends");
  const [compras, setCompras] = useState([]);
  const [historicoTrocas, setHistoricoTrocas] = useState([]);
  const [loadingDados, setLoadingDados] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoadingAuth(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    async function carregar() {
      try {
        const { data: c } = await supabase.from('compras').select('*').eq('user_id', user.id).order('id');
        setCompras(c && c.length > 0 ? c : initialCompras);
        const { data: tr } = await supabase.from('trocas').select('*').eq('user_id', user.id).order('id');
        setHistoricoTrocas(tr && tr.length > 0 ? tr : initialHistoricoTrocas);
      } catch (err) {
        console.error(err);
        setCompras(initialCompras);
        setHistoricoTrocas(initialHistoricoTrocas);
      } finally {
        setLoadingDados(false);
      }
    }
    carregar();
  }, [user]);

  const totalGasto = useMemo(() => compras.reduce((a, c) => a + c.valor, 0), [compras]);
  const totalPacotes = useMemo(() => compras.reduce((a, c) => a + c.pacotes, 0), [compras]);
  const totalRecebidoTrocas = useMemo(() => historicoTrocas.reduce((s, t) => s + t.recebeu, 0), [historicoTrocas]);
  const totalFigurinhas = totalPacotes * 7 + totalRecebidoTrocas;
  const mediaPorPacote = totalPacotes > 0 ? totalGasto / totalPacotes : 0;

  async function loginGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: 'https://album-copa-theta.vercel.app' }
    });
  }
  async function logout() {
    await supabase.auth.signOut();
  }

  const t = tema === "dark" ? DARK : LIGHT;

  const fundo = tema === "light"
    ? (aba === "legends" ? "#f0ebfc" : aba === "trocas" ? "#eaf2fc" : "#f2f5f7")
    : aba === "legends"
      ? "radial-gradient(110% 60% at 50% -8%, #1a1028 0%, #0a0810 55%)"
      : aba === "trocas"
        ? "radial-gradient(110% 60% at 50% -8%, #11202e 0%, #0a0e13 55%)"
        : "radial-gradient(110% 60% at 50% -8%, #18222c 0%, #0b0f14 55%)";

  const tabBarBg = tema === "dark" ? "rgba(14,18,24,0.80)" : "rgba(242,245,247,0.92)";
  const tabBarShadow = tema === "dark" ? "0 12px 36px rgba(0,0,0,0.5)" : "0 4px 20px rgba(0,0,0,0.12)";

  if (loadingAuth) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#0b0f14", color: DARK.texto2, fontSize: 16, fontFamily: F }}>
      Carregando...
    </div>
  );

  if (!user) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", background: "#0b0f14", gap: 24, padding: 32, fontFamily: F }}>
      <div style={{ fontSize: 48 }}>⚽🏆</div>
      <h1 style={{ color: "#eef4f8", fontSize: 22, fontWeight: 800, textAlign: "center", margin: 0 }}>ÁLBUM DA COPA 2026</h1>
      <p style={{ color: DARK.texto3, fontSize: 13, letterSpacing: "0.1em", margin: 0 }}>FSAID & ROMEO</p>
      <button onClick={loginGoogle} style={{ marginTop: 16, padding: "14px 32px", background: "white", border: "none", borderRadius: 12, fontSize: 15, fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, color: "#333" }}>
        <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/><path fill="#FF3D00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"/><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/></svg>
        Entrar com Google
      </button>
    </div>
  );

  const TABS = [
    { id: "legends", label: "Legends", Icone: Star, cor: t.violeta, bg: `rgba(${t.violetaDim},0.16)` },
    { id: "trocas", label: "Trocas", Icone: Repeat2, cor: t.ceu, bg: `rgba(${t.ceuDim},0.14)` },
    { id: "album", label: "Álbum", Icone: Trophy, cor: t.verde, bg: `rgba(${t.verdeDim},0.14)` },
  ];

  return (
    <div className="nj-root" style={{ minHeight: "100vh", fontFamily: F, background: fundo, transition: "background 0.5s", position: "relative" }}>
      <style>{css}</style>
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        {aba === "legends" && <Legends user={user} />}
        {aba === "trocas" && <Trocas user={user} t={t} F={F} MONO={MONO} />}
        {aba === "album" && (
          <Memorial
            totalPacotes={totalPacotes}
            totalFigurinhas={totalFigurinhas}
            totalGasto={totalGasto}
            mediaPorPacote={mediaPorPacote}
            secoes={secoes}
            tema={tema}
            setTema={setTema}
            onLogout={logout}
            t={t}
            F={F}
            MONO={MONO}
            loadingDados={loadingDados}
          />
        )}
      </div>

      {/* Tab bar inferior — pílula flutuante */}
      <div style={{ position: "fixed", left: 0, right: 0, bottom: 0, display: "flex", justifyContent: "center", padding: "0 16px calc(14px + env(safe-area-inset-bottom))", pointerEvents: "none", zIndex: 40 }}>
        <div style={{ pointerEvents: "auto", display: "flex", gap: 4, background: tabBarBg, backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)", border: `0.5px solid ${t.borda}`, borderRadius: 99, padding: 5, boxShadow: tabBarShadow }}>
          {TABS.map(tab => {
            const ativo = aba === tab.id;
            return (
              <button key={tab.id} className="nj-press" onClick={() => setAba(tab.id)}
                style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 18px", borderRadius: 99, border: "none", cursor: "pointer", fontFamily: F, background: ativo ? tab.bg : "transparent", color: ativo ? tab.cor : t.texto3 }}>
                <tab.Icone size={17} strokeWidth={ativo ? 2.4 : 2} />
                <span style={{ fontSize: 13, fontWeight: ativo ? 800 : 600 }}>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
