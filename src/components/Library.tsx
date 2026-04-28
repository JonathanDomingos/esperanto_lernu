import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Video, Book, Users, Search, Play, Globe, LayoutGrid, List, Plus } from 'lucide-react';
import { ResourceItem } from '../types';
import { DICTIONARY } from '../data/dictionary';
import Fuse from 'fuse.js';

const RESOURCES: (ResourceItem & { featured?: boolean })[] = [
  {
    title: 'Lernu.net',
    description: 'A maior plataforma do mundo para aprender Esperanto. Gratuito, multilíngue e com fóruns ativos.',
    url: 'https://lernu.net',
    category: 'Course',
    icon: 'Book',
    featured: true
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
    icon: 'Video',
    featured: true
  },
  {
    title: 'Vortaro.net',
    description: 'O dicionário oficial (Plena Ilustrita Vortaro) para quem busca precisão gramatical.',
    url: 'https://vortaro.net',
    category: 'Dictionary',
    icon: 'Search'
  },
  {
    title: 'Tujvortaro',
    description: 'Dicionário ultra-rápido e simples de Esperanto. Ideal para buscas instantâneas durante o estudo.',
    url: 'https://tujvortaro.net',
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

interface ResourceCardProps {
  item: ResourceItem & { featured?: boolean };
  index: number;
  key?: string | number;
}

function ResourceCard({ item, index }: ResourceCardProps): React.ReactElement {
  const getTheme = (category: ResourceItem['category']) => {
    switch (category) {
      case 'Video': 
        return {
          bg: 'bg-red-50',
          hoverBg: 'hover:bg-red-100/50',
          iconBg: 'bg-red-100 text-red-600',
          accent: 'text-red-600',
          border: 'border-red-100',
          glow: 'group-hover:shadow-red-200/50'
        };
      case 'Course':
        return {
          bg: 'bg-blue-50',
          hoverBg: 'hover:bg-blue-100/50',
          iconBg: 'bg-blue-100 text-blue-600',
          accent: 'text-blue-600',
          border: 'border-blue-100',
          glow: 'group-hover:shadow-blue-200/50'
        };
      case 'Community':
        return {
          bg: 'bg-indigo-50',
          hoverBg: 'hover:bg-indigo-100/50',
          iconBg: 'bg-indigo-100 text-indigo-600',
          accent: 'text-indigo-600',
          border: 'border-indigo-100',
          glow: 'group-hover:shadow-indigo-200/50'
        };
      case 'Dictionary':
        return {
          bg: 'bg-emerald-50',
          hoverBg: 'hover:bg-emerald-100/50',
          iconBg: 'bg-emerald-100 text-emerald-600',
          accent: 'text-emerald-600',
          border: 'border-emerald-100',
          glow: 'group-hover:shadow-emerald-200/50'
        };
    }
  };

  const getIcon = (category: ResourceItem['category']) => {
    switch (category) {
      case 'Video': return <Video size={24} />;
      case 'Course': return <Book size={24} />;
      case 'Community': return <Users size={24} />;
      case 'Dictionary': return <Search size={24} />;
    }
  };

  const theme = getTheme(item.category);

  return (
    <motion.a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`group relative flex flex-col p-8 rounded-[32px] border-2 transition-all duration-500 overflow-hidden ${theme.bg} ${theme.border} ${theme.hoverBg} hover:shadow-2xl ${theme.glow} h-full`}
    >
      {/* Decorative Background Shape */}
      <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-5 group-hover:scale-150 transition-transform duration-700 pointer-events-none ${theme.iconBg}`} />

      <div className="flex justify-between items-start mb-10 relative z-10">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110 duration-500 ${theme.iconBg}`}>
          {getIcon(item.category)}
        </div>
        {item.featured && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-white/80 backdrop-blur-sm border border-slate-100 rounded-full shadow-sm">
            <span className="animate-pulse w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Destaque</span>
          </div>
        )}
      </div>

      <div className="flex-grow relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-[10px] font-black uppercase tracking-widest ${theme.accent}`}>
            {item.category}
          </span>
          <div className={`h-px flex-grow ${theme.border} opacity-50`} />
        </div>
        
        <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:translate-x-1 transition-transform duration-300">
          {item.title}
        </h3>
        
        <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 opacity-80 group-hover:opacity-100 transition-opacity">
          {item.description}
        </p>
      </div>

      <div className="mt-auto relative z-10 flex items-center justify-between">
        <div className={`font-black text-[10px] uppercase tracking-widest flex items-center gap-2 ${theme.accent} opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 duration-300`}>
          Acessar Agora
          <ExternalLink size={12} strokeWidth={3} />
        </div>
        <div className="p-2 bg-white/50 rounded-xl opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500">
          <Play size={12} className={`fill-current ${theme.accent}`} />
        </div>
      </div>
    </motion.a>
  );
}

interface LibrarySectionProps {
  onAddFlashcard: (front: string, back: string, category?: string) => void;
  onNavigate: (tab: 'home' | 'lessons' | 'library' | 'dashboard', content?: 'lessons' | 'flashcards') => void;
}

export function LibrarySection({ onAddFlashcard, onNavigate }: LibrarySectionProps) {
  const [view, setView] = useState<'resources' | 'glossary'>('resources');
  const [searchTerm, setSearchTerm] = useState('');

  const fuse = useMemo(() => new Fuse(DICTIONARY, {
    keys: ['word', 'translation', 'category'],
    threshold: 0.35,
    distance: 100,
    ignoreLocation: true,
    minMatchCharLength: 2,
  }), []);

  const filteredGlossary = useMemo(() => {
    if (!searchTerm.trim()) return DICTIONARY;
    return fuse.search(searchTerm).map(result => result.item);
  }, [searchTerm, fuse]);

  const handleAddAllToFlashcards = () => {
    if (filteredGlossary.length === 0) return;
    
    filteredGlossary.forEach(entry => {
      onAddFlashcard(entry.word, entry.translation, entry.category);
    });
    
    // Switch to flashcards view
    onNavigate('lessons', 'flashcards');
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
            <ResourceCard key={item.title} item={item} index={i} />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full max-w-xl">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar no glossário..."
                className="w-full pl-16 pr-6 py-4 bg-white border border-slate-200 rounded-[24px] outline-none focus:border-emerald-500 transition-all shadow-sm font-bold"
              />
            </div>
            {filteredGlossary.length > 0 && (
              <button
                onClick={handleAddAllToFlashcards}
                className="flex items-center gap-2 px-6 py-4 bg-emerald-600 text-white rounded-[24px] font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 whitespace-nowrap"
              >
                <Plus size={20} />
                Estudar Estes {filteredGlossary.length}
              </button>
            )}
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
                  className="bento-card p-8 bg-white border border-slate-100 hover:border-emerald-500 transition-all group flex flex-col h-full"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="bento-label text-emerald-600 group-hover:text-emerald-700">{entry.category}</span>
                    <button
                      onClick={() => onAddFlashcard(entry.word, entry.translation, entry.category)}
                      className="p-2 bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                      title="Adicionar aos meus Flashcards"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-2">{entry.word}</h3>
                  <p className="text-slate-500 font-bold mb-6">{entry.translation}</p>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex-grow">
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
