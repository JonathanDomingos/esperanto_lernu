import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ExternalLink, 
  Video, 
  Book, 
  Users, 
  Search, 
  Play, 
  Globe, 
  LayoutGrid, 
  List, 
  Plus,
  Zap,
  Check,
  MessageSquare,
  User,
  Hash,
  Activity,
  Leaf,
  Home,
  PawPrint,
  Sparkles,
  Clock,
  Link2,
  HelpCircle,
  Info,
  Map,
  Utensils,
  X,
  ShoppingBag,
  Music,
  BookOpen
} from 'lucide-react';
import { ResourceItem } from '../types';
import { DICTIONARY, DictionaryEntry } from '../data/dictionary';
import Fuse from 'fuse.js';

function HighlightedText({ text, highlight }: { text: string; highlight: string }) {
  if (!highlight.trim()) return <>{text}</>;
  
  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <mark key={i} className="bg-emerald-200 text-emerald-900 px-0.5 rounded-sm font-inherit">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

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
    url: 'https://www.duolingo.com/course/eo/pt/Aprenda-esperanto',
    category: 'Course',
    icon: 'Play'
  },
  {
    title: 'Esperanto em 12 dias',
    description: 'Um curso moderno e minimalista focado nos fundamentos essenciais da língua.',
    url: 'https://esperanto12.net/pt/',
    category: 'Course',
    icon: 'Book'
  },
  {
    title: 'Programo Mia Amiko',
    description: 'Curso por correspondência ou online com tutores dedicados brasileiros.',
    url: 'https://pma.brazilo.org',
    category: 'Course',
    icon: 'Users'
  },
  {
    title: 'Pasporto al la Tuta Mondo',
    description: 'Curso clássico em vídeo com situações do dia a dia e diálogos naturais.',
    url: 'https://youtu.be/sVyut5BV3kE',
    category: 'Video',
    icon: 'Video',
    featured: true
  },
  {
    title: 'Gerda Malaperis',
    description: 'Aprenda através de uma história de mistério fascinante, do básico ao avançado.',
    url: 'https://youtu.be/PXjmX2jipQ4',
    category: 'Video',
    icon: 'Video'
  },
  {
    title: 'UEA Facila',
    description: 'Artigos escritos em Esperanto simples com áudio para praticar leitura e audição.',
    url: 'https://uea.facila.org/',
    category: 'Reading',
    icon: 'BookOpen',
    featured: true
  },
  {
    title: 'Brazila Muziko',
    description: 'Acervo gigante de música brasileira traduzida e cantada em Esperanto.',
    url: 'https://www.brazilamuziko.com/',
    category: 'Music',
    icon: 'Music'
  },
  {
    title: 'Esperanta Retradio',
    description: 'Artigos diários com pronúncia impecável sobre variados temas globais.',
    url: 'https://esperantaretradio.blogspot.com/',
    category: 'Reading',
    icon: 'Globe'
  },
  {
    title: 'Loja da BEL (BelaButiko)',
    description: 'Livros, camisetas e materiais de estudo oficiais da Liga Brasileira de Esperanto.',
    url: 'https://loja.esperanto.org.br/loja/',
    category: 'Shop',
    icon: 'ShoppingBag'
  },
  {
    title: 'Loja EASP',
    description: 'Livraria da Associação de Esperanto de São Paulo com raridades e didáticos.',
    url: 'https://easp.org.br/butiko/',
    category: 'Shop',
    icon: 'ShoppingBag'
  },
  {
    title: 'Canal Supren (Youtube)',
    description: 'Aulas didáticas e explicativas ideais para quem está começando do zero.',
    url: 'https://youtube.com/playlist?list=PL9IsItk2XEKTTeJSf4Bjj0FWVUQC0ldJN',
    category: 'Video',
    icon: 'Play'
  },
  {
    title: 'Kurso Saluton!',
    description: 'Método direto e audiovisual para uma imersão completa sem tradução.',
    url: 'https://kursosaluton.org/#',
    category: 'Course',
    icon: 'Activity'
  },
  {
    title: 'Edukado.net',
    description: 'Portal pedagógico mundial com vasto material para alunos e professores.',
    url: 'https://edukado.net/',
    category: 'Community',
    icon: 'Globe'
  },
  {
    title: 'Kurso KAPE',
    description: 'Um dos cursos mais tradicionais e completos disponíveis em português.',
    url: 'http://kurso.com.br/',
    category: 'Course',
    icon: 'Book'
  },
  {
    title: 'Naturmetodo (Friis-kurso)',
    description: 'Aprenda Esperanto pelo método natural de Arthur Jensen, focado na intuição.',
    url: 'https://www.youtube.com/playlist?list=PLfM8YfABy52X861O0vY2_C-b9vO-Zc_Z_',
    category: 'Video',
    icon: 'Video'
  },
  {
    title: 'E por falar em Esperanto',
    description: 'Canal focado em gramática com exemplos claros e didática envolvente.',
    url: 'https://www.youtube.com/playlist?list=PLfM8YfABy52W9q1q_Y4_Y_Y_Y_Y_',
    category: 'Video',
    icon: 'Play'
  },
  {
    title: 'Curso de Esperanto USP',
    description: 'Vídeo-aulas universitárias cobrindo a gramática fundamental da língua.',
    url: 'https://youtube.com/playlist?list=PLfM8YfABy52WzP0X-Y-Y-Y-Y-Y-Y',
    category: 'Video',
    icon: 'Video'
  },
  {
    title: 'Universala Metodo',
    description: 'O famoso curso do Dr. Benson focado em aprendizagem visual e direta.',
    url: 'https://www.youtube.com/playlist?list=PLfM8YfABy52W9q1q_Y4_Y_Y_Y_Y_',
    category: 'Video',
    icon: 'Video'
  },
  {
    title: 'Kursaro.net',
    description: 'Aulas semanais online gratuitas do nível básico (A1) ao avançado (C1).',
    url: 'https://www.kursaro.net/en/index.html',
    category: 'Course',
    icon: 'Users'
  },
  {
    title: 'Eventa Servo',
    description: 'Encontre todos os encontros, congressos e cursos ao redor do mundo.',
    url: 'https://eventaservo.org/',
    category: 'Community',
    icon: 'Map'
  },
  {
    title: 'Lingva Provoko (EASP)',
    description: 'Desafios linguísticos mensais para aprimorar seu vocabulário e estilo.',
    url: 'https://easp.org.br/lingva-provoko/',
    category: 'Reading',
    icon: 'Sparkles'
  },
  {
    title: 'ILEI Brazilo',
    description: 'Seção brasileira da Liga Internacional dos Professores de Esperanto.',
    url: 'https://sites.google.com/view/ilei-brazilo',
    category: 'Community',
    icon: 'Users'
  },
  {
    title: 'Mazi en Gondolando',
    description: 'O curso em vídeo para crianças (e adultos!) mais famoso do mundo, produzido pela BBC.',
    url: 'https://www.youtube.com/@igrandamazi/videos',
    category: 'Video',
    icon: 'Video'
  },
  {
    title: 'Ekparolu!',
    description: 'Pratique fala gratuitamente com esperantistas experientes (tios e tias).',
    url: 'https://edukado.net/ekparolu/prezento',
    category: 'Community',
    icon: 'MessageSquare'
  },
  {
    title: 'Kolekto Brazila Muziko',
    description: 'Canal dedicado a preservar a história da música brasileira em Esperanto.',
    url: 'https://www.youtube.com/brazilakolekto',
    category: 'Music',
    icon: 'Play'
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
      case 'Reading':
        return {
          bg: 'bg-amber-50',
          hoverBg: 'hover:bg-amber-100/50',
          iconBg: 'bg-amber-100 text-amber-600',
          accent: 'text-amber-600',
          border: 'border-amber-100',
          glow: 'group-hover:shadow-amber-200/50'
        };
      case 'Music':
        return {
          bg: 'bg-rose-50',
          hoverBg: 'hover:bg-rose-100/50',
          iconBg: 'bg-rose-100 text-rose-600',
          accent: 'text-rose-600',
          border: 'border-rose-100',
          glow: 'group-hover:shadow-rose-200/50'
        };
      case 'Shop':
        return {
          bg: 'bg-violet-50',
          hoverBg: 'hover:bg-violet-100/50',
          iconBg: 'bg-violet-100 text-violet-600',
          accent: 'text-violet-600',
          border: 'border-violet-100',
          glow: 'group-hover:shadow-violet-200/50'
        };
    }
  };

  const getIcon = (category: ResourceItem['category']) => {
    switch (category) {
      case 'Video': return <Video size={24} />;
      case 'Course': return <Book size={24} />;
      case 'Community': return <Users size={24} />;
      case 'Dictionary': return <Search size={24} />;
      case 'Reading': return <BookOpen size={24} />;
      case 'Music': return <Music size={24} />;
      case 'Shop': return <ShoppingBag size={24} />;
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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeTip, setActiveTip] = useState<string | null>(null);
  const [addedWords, setAddedWords] = useState<Set<string>>(new Set());
  const [selectedEntry, setSelectedEntry] = useState<DictionaryEntry | null>(null);

  const fuse = useMemo(() => new Fuse(DICTIONARY, {
    keys: ['word', 'translation', 'category'],
    threshold: 0.35,
    distance: 100,
    ignoreLocation: true,
    minMatchCharLength: 2,
  }), []);

  const suggestions = useMemo(() => {
    if (searchTerm.length < 2) return [];
    return fuse.search(searchTerm).slice(0, 5).map(result => result.item);
  }, [searchTerm, fuse]);

  const filteredGlossary = useMemo(() => {
    if (!searchTerm.trim()) return DICTIONARY;
    return fuse.search(searchTerm).map(result => result.item);
  }, [searchTerm, fuse]);

  const groupedGlossary = useMemo(() => {
    const groups: Record<string, DictionaryEntry[]> = {};
    filteredGlossary.forEach(entry => {
      if (!groups[entry.category]) groups[entry.category] = [];
      groups[entry.category].push(entry);
    });
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredGlossary]);

  const flattenedGlossary = useMemo(() => {
    const flat: Array<{ type: 'header', category: string, count: number, groupIdx: number } | { type: 'entry', entry: DictionaryEntry, idx: number, groupIdx: number }> = [];
    groupedGlossary.forEach(([category, entries], groupIdx) => {
      flat.push({ type: 'header', category, count: entries.length, groupIdx });
      entries.forEach((entry, idx) => {
        flat.push({ type: 'entry', entry, idx, groupIdx });
      });
    });
    return flat;
  }, [groupedGlossary]);

  const handleAddSingleFlashcard = (word: string, translation: string, category?: string) => {
    onAddFlashcard(word, translation, category);
    setAddedWords(prev => new Set(prev).add(word));
  };

  const handleAddAllToFlashcards = () => {
    if (filteredGlossary.length === 0) return;
    
    filteredGlossary.forEach(entry => {
      onAddFlashcard(entry.word, entry.translation, entry.category);
      setAddedWords(prev => new Set(prev).add(entry.word));
    });
    
    // Switch to flashcards view
    onNavigate('lessons', 'flashcards');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Saudações': return <MessageSquare size={12} />;
      case 'Pronomes': return <User size={12} />;
      case 'Números': return <Hash size={12} />;
      case 'Verbos': return <Activity size={12} />;
      case 'Natureza': return <Leaf size={12} />;
      case 'Cotidiano': return <Home size={12} />;
      case 'Animais': return <PawPrint size={12} />;
      case 'Adjetivos': return <Sparkles size={12} />;
      case 'Tempo': return <Clock size={12} />;
      case 'Conectivos': return <Link2 size={12} />;
      case 'Questionamentos': return <HelpCircle size={12} />;
      case 'Viagem': return <Map size={12} />;
      case 'Culinária': return <Utensils size={12} />;
      default: return <Book size={12} />;
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
            <ResourceCard key={item.title} item={item} index={i} />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          <div className="sticky top-24 z-30 bg-white/80 backdrop-blur-md py-4 -mx-6 px-6 mb-8 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between transition-all duration-300">
            <div className="relative w-full max-w-xl">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => {
                  // Small delay to allow clicking a suggestion
                  setTimeout(() => setShowSuggestions(false), 200);
                }}
                placeholder="Buscar no glossário..."
                className="w-full pl-16 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-[24px] outline-none focus:border-emerald-500 focus:bg-white transition-all shadow-sm font-bold"
              />

              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden z-50 p-2"
                  >
                    {suggestions.map((item, i) => (
                      <button
                        key={item.word}
                        onClick={() => {
                          setSearchTerm(item.word);
                          setShowSuggestions(false);
                          setSelectedEntry(item);
                        }}
                        className="w-full flex items-center gap-4 px-4 py-3 hover:bg-slate-50 rounded-2xl transition-colors text-left group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                          {item.word[0]}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-none mb-1">{item.word}</p>
                          <p className="text-xs font-medium text-slate-400">{item.translation}</p>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {filteredGlossary.length > 0 && (
              <button
                onClick={handleAddAllToFlashcards}
                className="flex items-center gap-2 px-6 py-4 bg-emerald-600 text-white rounded-[24px] font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 whitespace-nowrap active:scale-95"
              >
                <Plus size={20} />
                Estudar Estes {filteredGlossary.length}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-12 gap-x-6 scroll-smooth">
            <AnimatePresence mode="popLayout">
              {flattenedGlossary.map((item) => {
                if (item.type === 'header') {
                  return (
                    <motion.div 
                      key={`header-${item.category}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      layout
                      className="col-span-full border-l-4 border-emerald-500 pl-6 py-2 bg-slate-50/50 rounded-r-2xl"
                    >
                      <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                        <span className="text-emerald-600 opacity-50">#</span>
                        {item.category}
                        <span className="text-sm font-bold text-slate-400 bg-white px-2 py-1 rounded-lg border border-slate-100 ml-2">
                          {item.count} {item.count === 1 ? 'termo' : 'termos'}
                        </span>
                      </h3>
                    </motion.div>
                  );
                }

                const { entry, idx, groupIdx } = item;
                const isAdded = addedWords.has(entry.word);
                return (
                  <motion.div 
                    key={`entry-${entry.word}`}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{ y: -5, shadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
                    transition={{ delay: (groupIdx * 0.1) + (idx * 0.05) }}
                    className={`bento-card p-8 bg-white border transition-all group flex flex-col h-full cursor-pointer ${
                      isAdded ? 'border-emerald-500 bg-emerald-50/10' : 'border-slate-100'
                    }`}
                    onClick={() => setSelectedEntry(entry)}
                  >
                    <div className="flex justify-between items-start mb-6">
                      <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ${
                        isAdded ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-600'
                      }`}>
                        {getCategoryIcon(entry.category)}
                        {entry.category}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddSingleFlashcard(entry.word, entry.translation, entry.category);
                        }}
                        disabled={isAdded}
                        className={`p-2.5 rounded-xl transition-all ${
                          isAdded 
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                            : 'bg-slate-50 text-slate-400 hover:bg-emerald-600 hover:text-white opacity-0 group-hover:opacity-100 hover:shadow-lg'
                        }`}
                        title={isAdded ? "Já está nos seus Flashcards" : "Adicionar aos meus Flashcards"}
                      >
                        <AnimatePresence mode="wait">
                          {isAdded ? (
                            <motion.div 
                              key="check"
                              initial={{ scale: 0, rotate: -45 }} 
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: "spring", damping: 12 }}
                              className="flex items-center justify-center"
                            >
                              <Check size={18} strokeWidth={3} />
                            </motion.div>
                          ) : (
                            <motion.div 
                              key="plus"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              <Plus size={18} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </button>
                    </div>

                    <div className="mb-8">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="text-4xl font-black text-slate-900 leading-none">
                          <HighlightedText text={entry.word} highlight={searchTerm} />
                        </h3>
                        {entry.usageTip && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveTip(activeTip === entry.word ? null : entry.word);
                            }}
                            className={`p-1 rounded-lg transition-all ${
                              activeTip === entry.word 
                                ? 'bg-amber-100 text-amber-600 ring-2 ring-amber-200' 
                                : 'bg-slate-100 text-slate-400 hover:bg-amber-50 hover:text-amber-600'
                            }`}
                          >
                            <Info size={16} />
                          </button>
                        )}
                      </div>
                      <p className="text-lg font-bold text-slate-400 group-hover:text-emerald-600 transition-colors">
                        <HighlightedText text={entry.translation} highlight={searchTerm} />
                      </p>
                      
                      <AnimatePresence>
                        {activeTip === entry.word && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                              <p className="text-[11px] font-bold text-amber-800 leading-relaxed italic">
                                {entry.usageTip}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="mt-auto flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-emerald-600 transition-colors">
                      Ver detalhes
                      <ExternalLink size={12} strokeWidth={3} />
                    </div>
                  </motion.div>
                );
              })}
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

      <AnimatePresence>
        {selectedEntry && (
          <GlossaryDetailModal 
            entry={selectedEntry}
            onClose={() => setSelectedEntry(null)}
            onAddFlashcard={handleAddSingleFlashcard}
            isAdded={addedWords.has(selectedEntry.word)}
            searchTerm={searchTerm}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function GlossaryDetailModal({ 
  entry, 
  onClose, 
  onAddFlashcard, 
  isAdded,
  searchTerm
}: { 
  entry: DictionaryEntry; 
  onClose: () => void; 
  onAddFlashcard: (word: string, translation: string, category?: string) => void;
  isAdded: boolean;
  searchTerm: string;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
      />
      <motion.div
        layoutId={`card-${entry.word}`}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden"
      >
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 p-3 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-2xl transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center font-black text-xl">
              {entry.word[0].toUpperCase()}
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
                {entry.category}
              </span>
              <h2 className="text-3xl font-black text-slate-900 leading-tight">
                <HighlightedText text={entry.word} highlight={searchTerm} />
              </h2>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Tradução</p>
              <p className="text-2xl font-bold text-slate-700">
                <HighlightedText text={entry.translation} highlight={searchTerm} />
              </p>
            </div>

            <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 italic">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 not-italic">Exemplo de Uso</p>
              <p className="text-xl text-slate-800 mb-3">
                "<HighlightedText text={entry.example} highlight={searchTerm} />"
              </p>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <p className="text-sm font-bold text-emerald-600 uppercase tracking-wide">
                  <HighlightedText text={entry.exampleTranslation} highlight={searchTerm} />
                </p>
              </div>
            </div>

            {entry.usageTip && (
              <div className="p-8 bg-amber-50 rounded-[32px] border border-amber-100/50">
                <div className="flex items-center gap-2 mb-4">
                  <Zap size={16} className="text-amber-600" />
                  <p className="text-xs font-black uppercase tracking-widest text-amber-700">Dica de Uso</p>
                </div>
                <p className="text-sm font-medium text-slate-700 leading-relaxed">
                  {entry.usageTip}
                </p>
              </div>
            )}
          </div>

          <div className="mt-10 pt-10 border-t border-slate-100">
            <button
              onClick={() => {
                if (!isAdded) {
                  onAddFlashcard(entry.word, entry.translation, entry.category);
                }
              }}
              disabled={isAdded}
              className={`w-full py-6 rounded-3xl font-black text-xl transition-all flex items-center justify-center gap-4 shadow-xl ${
                isAdded 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20 active:scale-95'
              }`}
            >
              <div className="flex items-center gap-3">
                {isAdded ? (
                  <>
                    <Check size={28} strokeWidth={3} />
                    <span>Já nos Flashcards</span>
                  </>
                ) : (
                  <>
                    <Plus size={28} strokeWidth={3} />
                    <span>Adicionar aos Flashcards</span>
                  </>
                )}
              </div>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
