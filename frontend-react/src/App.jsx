import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Loader2, Zap, Moon, Sun, FileText, Video, 
  Headphones, Trash2, ExternalLink, Pencil, Check, X, Plus, Sparkles 
} from 'lucide-react';

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [recursos, setRecursos] = useState([]);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  
  const [mostrarForm, setMostrarForm] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState('PDF');
  const [link, setLink] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tags, setTags] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [gerandoIA, setGerandoIA] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [editDesc, setEditDesc] = useState('');
  const [editTags, setEditTags] = useState('');
  const [confirmarExclusaoId, setConfirmarExclusaoId] = useState(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/recursos`);
      setRecursos(res.data.reverse());
    } catch (err) { console.error("Erro ao buscar dados:", err); }
  };

  const handleGerarIA = async () => {
    if (!titulo.trim()) return alert("Por favor, insira um tema primeiro.");
    setGerandoIA(true);
    try {
      const res = await axios.post(`${API_URL}/sugerir`, { titulo, tipo, link });
      setDescricao(res.data.descricao);
      setTags(res.data.tags);
    } catch (err) { alert("Erro ao conectar com a IA."); }
    finally { setGerandoIA(false); }
  };

  const handleFinalizarCadastro = async (e) => {
    e.preventDefault();
    // Validação rigorosa: Título, Link, Descrição e Tags
    if (!titulo.trim() || !link.trim() || !descricao.trim() || !tags.trim()) {
      alert("Todos os campos (Título, Link, Descrição e Tags) precisam estar preenchidos!");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/smart-assist`, { 
        titulo, tipo, link, 
        descricao_manual: descricao, 
        tags_manuais: tags 
      });
      setRecursos([res.data, ...recursos]);
      resetForm();
    } catch (err) { alert("Erro ao salvar."); }
    finally { setLoading(false); }
  };

  const resetForm = () => {
    setTitulo(''); setLink(''); setDescricao(''); setTags(''); setMostrarForm(false);
  };

  const handleDeletarFinal = async (id) => {
    try {
      await axios.delete(`${API_URL}/recursos/${id}`);
      setRecursos(recursos.filter(r => r.id !== id));
      setConfirmarExclusaoId(null);
    } catch (err) { alert("Erro ao excluir."); }
  };

  const handleSalvarEdicao = async (id) => {
    if (!editDesc.trim() || !editTags.trim()) return alert("Campos vazios.");
    try {
      const res = await axios.put(`${API_URL}/recursos/${id}`, { descricao: editDesc, tags: editTags });
      setRecursos(recursos.map(r => r.id === id ? res.data : r));
      setEditandoId(null);
    } catch (err) { alert("Erro ao atualizar."); }
  };

  const getFormatDetails = (type) => {
    const baseStyle = "text-indigo-900 border-indigo-400 bg-indigo-100 dark:bg-indigo-900/40 dark:text-indigo-300 dark:border-indigo-700";
    switch (type) {
      case 'Vídeo': return { icon: <Video size={14}/>, color: baseStyle };
      case 'Áudio': return { icon: <Headphones size={14}/>, color: baseStyle };
      default: return { icon: <FileText size={14}/>, color: baseStyle };
    }
  };

  // Lógica para verificar se o botão de salvar deve estar habilitado
  const formInvalido = !titulo.trim() || !link.trim() || !descricao.trim() || !tags.trim();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      <nav className="p-6 border-b-2 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-20 shadow-sm transition-colors duration-300">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Zap className="text-indigo-600 fill-indigo-600" size={28} />
            <h1 className="text-2xl font-black tracking-tight uppercase text-slate-900 dark:text-white">StudyFlow</h1>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => setMostrarForm(!mostrarForm)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 shadow-md active:scale-95 transition-all"
            >
              {mostrarForm ? <X size={20}/> : <Plus size={20}/>}
              {mostrarForm ? 'Cancelar' : 'Cadastrar Material'}
            </button>
            <button onClick={() => setDarkMode(!darkMode)} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300">
              {darkMode ? ( <Moon size={20} className="text-indigo-600" /> ) : ( <Sun size={20} className="text-amber-400" />) }
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-6">
        
        {mostrarForm && (
          <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-300">
            <form onSubmit={handleFinalizarCadastro} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border-4 border-indigo-600 shadow-2xl grid gap-6 transition-colors duration-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-black uppercase text-slate-600 dark:text-slate-400">Tema</label>
                  <input className="p-4 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-950 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-indigo-500 font-bold transition-all duration-300"
                    placeholder="Nome do material..." value={titulo} onChange={(e)=>setTitulo(e.target.value)} required />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-black uppercase text-slate-600 dark:text-slate-400">Link</label>
                  <input className="p-4 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-950 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-indigo-500 font-bold transition-all duration-300"
                    placeholder="Inserir link..." value={link} onChange={(e)=>setLink(e.target.value)} required />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-black uppercase text-slate-600 dark:text-slate-400">Formato</label>
                  <select className="p-4 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-950 dark:text-white outline-none font-bold cursor-pointer transition-all duration-300"
                    value={tipo} onChange={(e)=>setTipo(e.target.value)}>
                    <option value="PDF">PDF / Documento</option>
                    <option value="Vídeo">Vídeo / Aula</option>
                    <option value="Áudio">Áudio / Podcast</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-center">
                <button 
                  type="button" onClick={handleGerarIA} disabled={gerandoIA || !titulo.trim() || !link.trim()}
                  className="flex items-center gap-2 bg-amber-500 text-white px-8 py-3 rounded-full font-black hover:bg-amber-600 shadow-lg active:scale-95 disabled:opacity-40 transition-all duration-300"
                >
                  {gerandoIA ? <Loader2 className="animate-spin" size={20}/> : <Sparkles size={20}/>}
                  {gerandoIA ? 'PROCESSANDO...' : 'GERAR DESCRIÇÃO COM IA'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-black uppercase text-slate-600 dark:text-slate-400">Descrição</label>
                  <textarea className="p-4 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-950 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-indigo-500 font-medium resize-none transition-all duration-300"
                    rows="3" value={descricao} onChange={(e)=>setDescricao(e.target.value)} placeholder="A IA ou você deve preencher aqui..." />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-black uppercase text-slate-600 dark:text-slate-400">Tags</label>
                  <input className="p-4 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-950 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-indigo-500 font-bold transition-all duration-300"
                    value={tags} onChange={(e)=>setTags(e.target.value)} placeholder="Tags separadas por vírgula..." />
                </div>
              </div>

              <button 
                disabled={loading || formInvalido} 
                className={`w-full py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 transition-all duration-300
                  ${formInvalido ? 'bg-slate-200 text-slate-500 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl active:scale-[0.99]'}`}
              >
                {loading ? <Loader2 className="animate-spin" /> : <Check size={26} />}
                SALVAR MATERIAL NO HUB
              </button>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {recursos.map((item) => {
            const format = getFormatDetails(item.tipo);
            const isEditando = editandoId === item.id;
            const isConfirmando = confirmarExclusaoId === item.id;

            return (
              <div key={item.id} className={`bg-white dark:bg-slate-900 p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col border-l-[10px] ${isConfirmando ? 'border-red-500 bg-red-50 dark:bg-red-950/20' : 'border-slate-200 dark:border-slate-800 border-l-indigo-600 shadow-md'}`}>
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase border-2 flex items-center gap-1.5 transition-all duration-300 ${format.color}`}>
                    {format.icon} {item.tipo}
                  </span>
                  
                  <div className="flex gap-2">
                    {isEditando ? (
                      <div className="flex gap-1">
                        {isConfirmando ? (
                          <div className="flex items-center gap-1 bg-red-100 dark:bg-red-900/40 p-1 rounded-lg">
                             <span className="text-[9px] font-black text-red-700 dark:text-red-400 px-1">APAGAR?</span>
                             <button onClick={() => handleDeletarFinal(item.id)} className="bg-red-600 text-white p-1.5 rounded-md hover:bg-red-700 transition-colors"><Check size={14}/></button>
                             <button onClick={() => setConfirmarExclusaoId(null)} className="bg-slate-400 text-white p-1.5 rounded-md hover:bg-slate-500 transition-colors"><X size={14}/></button>
                          </div>
                        ) : (
                          <>
                            <button onClick={() => setConfirmarExclusaoId(item.id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 size={18}/></button>
                            <button onClick={() => setEditandoId(null)} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"><X size={18}/></button>
                          </>
                        )}
                      </div>
                    ) : (
                      <button onClick={() => { setEditandoId(item.id); setEditDesc(item.descricao); setEditTags(item.tags); }} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"><Pencil size={18}/></button>
                    )}
                  </div>
                </div>

                <h3 className="text-xl font-black mb-3 text-slate-950 dark:text-white transition-colors duration-300">{item.titulo}</h3>
                
                {isEditando ? (
                  <div className="flex flex-col gap-3">
                    <textarea className="p-3 border-2 border-indigo-500 rounded-xl bg-white dark:bg-slate-800 text-slate-950 dark:text-white text-sm font-medium outline-none resize-none" rows="3" value={editDesc} onChange={(e)=>setEditDesc(e.target.value)} />
                    <input className="p-3 border-2 border-indigo-500 rounded-xl bg-white dark:bg-slate-800 text-slate-950 dark:text-white text-sm font-black outline-none" value={editTags} onChange={(e)=>setEditTags(e.target.value)} />
                    {!isConfirmando && (
                      <button onClick={() => handleSalvarEdicao(item.id)} className="bg-green-600 text-white py-2.5 rounded-xl font-black hover:bg-green-700 shadow-md transition-colors">SALVAR ALTERAÇÕES</button>
                    )}
                  </div>
                ) : (
                  <>
                    <p className="text-sm font-medium bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl mb-4 italic text-slate-800 dark:text-slate-300 border border-slate-100 dark:border-slate-800 transition-colors duration-300">
                      "{item.descricao}"
                    </p>
                    <div className="mt-auto pt-4 flex flex-col gap-4">
                      {item.link && (
                        <a href={item.link} target="_blank" rel="noreferrer" className="text-[10px] font-black text-indigo-700 dark:text-indigo-400 hover:underline flex items-center gap-1 uppercase tracking-wider">
                          <ExternalLink size={14}/> Acessar Material
                        </a>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {item.tags?.split(',').map((t, i) => (
                          <span key={i} className="text-[9px] font-black bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 transition-colors duration-300">
                            #{t.trim().toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default App;