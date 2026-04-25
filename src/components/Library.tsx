import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Video, Book, Users, Search, Play, Globe, LayoutGrid, List } from 'lucide-react';
import { ResourceItem } from '../types';
import { DICTIONARY } from '../data/dictionary';

const RESOURCES: ResourceItem[] = [
  {
    title: 'Lernu.net',
    description: 'A maior plataforma do mundo para aprender Esperanto. Gratuito, multilíngue e com fóruns ativos.',
    url: 'https://lernu.net',
    category: 'Course',
    icon: 'Book'
  },
  {
    title: 'Duolingo Esperanto',
    description: 'Curso rápido e gamificado para celular e web. Excelente para vocabulário diário.',
    url: 'https://www.duolingo.com/course/eo/en/Learn-Esperanto',
    category: 'Course',
    icon: 'Play'
  },
  {
    title: 'Esperanto Variety Show',
    description: 'Canal de YouTube com lições práticas, música e curiosidades sobre a cultura esperantista.',
    url: 'https://www.youtube.com/user/EsperantoVarietyShow',
    category: 'Video',
    icon: 'Video'
  },
  {
    title: 'Vortaro.net',
    description: 'O dicionário oficial (Plena Ilustrita Vortaro) para quem busca precisão gramatical.',
    url: 'https://vortaro.net',
    category: 'Dictionary',
    icon: 'Search'
  },
  {
    title: 'Esperanto Brasil',
    description: 'Portal da Liga Brasileira de Esperanto. Encontre clubes locais e eventos no Brasil.',
    url: 'https://esperanto.org.br',
    category: 'Community',
    icon: 'Users'
  }
];

export function LibrarySection() {
  const [view, setView] = useState<'resources' | 'glossary'>('resources');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGlossary = useMemo(() => {
    if (!searchTerm.trim()) return DICTIONARY;
    const lower = searchTerm.toLowerCase();
    return DICTIONARY.filter(e => 
      e.word.toLowerCase().includes(lower) || 
      e.translation.toLowerCase().includes(lower)
    );
  }, [searchTerm]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'Video': return <Video size={18} />;
      case 'Course': return <Book size={18} />;
      case 'Community': return <Users size={18} />;
      default: return <Search size={18} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="mb-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
        <div>
          <h2 className="text-5xl font-bold text-slate-900 mb-6">Acervo Digital</h2>
          <p className="text-slate-500 max-w-2xl text-lg font-medium">
            Explore recursos externos e nosso glossário completo de termos usados no curso.
          </p>
        </div>
        <div className="bg-white p-1.5 rounded-2xl border border-slate-200 flex gap-2 shadow-sm">
          <button 
            onClick={() => setView('resources')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${view === 'resources' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <LayoutGrid size={18} />
            Recursos
          </button>
          <button 
            onClick={() => setView('glossary')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${view === 'glossary' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <List size={18} />
            Glossário
          </button>
        </div>
      </div>

      {view === 'resources' ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {RESOURCES.map((item, i) => (
            <motion.a
              key={item.title}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="group block bento-card-interactive p-10"
            >
              <div className="flex justify-between items-start mb-8">
                <div className={`p-4 rounded-[20px] ${
                  item.category === 'Video' ? 'bg-red-50 text-red-500 border border-red-100' :
                  item.category === 'Course' ? 'bg-blue-50 text-blue-500 border border-blue-100' :
                  item.category === 'Community' ? 'bg-indigo-50 text-indigo-500 border border-indigo-100' :
                  'bg-emerald-50 text-emerald-500 border border-emerald-100'
                }`}>
                  {getIcon(item.category)}
                </div>
                <ExternalLink size={18} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
              </div>

              <span className="bento-label mb-4 block">
                {item.category}
              </span>

              <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-emerald-700 transition-colors">
                {item.title}
              </h3>
              
              <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium">
                {item.description}
              </p>

              <div className="flex items-center text-xs font-bold text-emerald-600 gap-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                <span>EXPLORAR RECURSO</span>
                <Play size={10} className="fill-current" />
              </div>
            </motion.a>
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          <div className="relative max-w-xl">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar no glossário..."
              className="w-full pl-16 pr-6 py-4 bg-white border border-slate-200 rounded-[24px] outline-none focus:border-emerald-500 transition-all shadow-sm font-bold"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredGlossary.map((entry, idx) => (
                <motion.div 
                  key={entry.word}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bento-card p-8 bg-white border border-slate-100 hover:border-emerald-500 transition-all group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="bento-label text-emerald-600 group-hover:text-emerald-700">{entry.category}</span>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-2">{entry.word}</h3>
                  <p className="text-slate-500 font-bold mb-6">{entry.translation}</p>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-sm italic text-slate-600 mb-2">"{entry.example}"</p>
                    <p className="text-xs text-slate-400 font-medium">{entry.exampleTranslation}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Suggestion Card */}
      <div className="mt-16 p-8 md:p-12 bento-gradient rounded-[40px] md:rounded-[48px] text-white overflow-hidden relative shadow-2xl shadow-emerald-900/20">
        <div className="relative z-10 max-w-2xl">
          <h3 className="text-4xl font-bold mb-6 italic tracking-tight">Sentiu falta de algo?</h3>
          <p className="text-emerald-100 text-xl mb-6 font-medium opacity-90 leading-relaxed">
            Nossa biblioteca é viva. Se você conhece um recurso público de qualidade sobre Esperanto, informe a comunidade nos fóruns oficiais.
          </p>
        </div>
        <div className="absolute -right-20 -bottom-20 h-full w-1/2 opacity-10 pointer-events-none rotate-12">
          <Globe size={450} />
        </div>
      </div>
    </div>
  );
}
