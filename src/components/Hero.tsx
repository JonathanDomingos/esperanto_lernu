import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Globe, Sparkles, BookOpen, Search, Users, Target, Clock, Zap, Library, Trophy, ArrowRight } from 'lucide-react';
import { UserStats } from '../types';

const WORDS_OF_THE_DAY = [
  { word: 'Klopodi', type: 'Verb', ipa: '/kloˈpodi/', definition: 'Se esforçar, empenhar-se, fazer um esforço para realizar algo.', example: '"Mi klopodas lerni Esperanton ĉiutage."' },
  { word: 'Feliĉa', type: 'Adj', ipa: '/feˈlit͡ʃa/', definition: 'Feliz, contente, satisfeito com algo ou alguém.', example: '"Mi estas feliĉa renkonti vin."' },
  { word: 'Danki', type: 'Verb', ipa: '/ˈdanki/', definition: 'Agradecer, expressar gratidão por algo recebido.', example: '"Mi dankas vin pro via helpo."' },
  { word: 'Ebleco', type: 'Noun', ipa: '/eˈblet͡so/', definition: 'Possibilidade, chance de que algo aconteça.', example: '"Estas ebleco venki en la ludo."' },
  { word: 'Ĉiutaga', type: 'Adj', ipa: '/t͡ʃiuˈtaga/', definition: 'Diário, cotidiano, que ocorre todos os dias.', example: '"Lernado estas mia ĉiutaga tasko."' },
];

interface HeroProps {
  onStart: () => void;
  onNavigate: (tab: string) => void;
  stats: UserStats;
}

export function Hero({ onStart, onNavigate, stats }: HeroProps) {
  const dailyWord = useMemo(() => {
    return WORDS_OF_THE_DAY[Math.floor(Math.random() * WORDS_OF_THE_DAY.length)];
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10 space-y-10">
      {/* Welcome Message */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter"
          >
            Bonvenon al la <span className="text-emerald-600 italic">Hubo</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 font-medium mt-2"
          >
            {stats.points > 0 ? `Continue sua jornada épica, você já conquistou ${stats.points} XP!` : 'Inicie sua jornada rumo à fluência no idioma internacional.'}
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-3"
        >
          <button 
            onClick={() => onNavigate('lessons')}
            className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:border-emerald-500 hover:text-emerald-600 transition-all shadow-sm flex items-center gap-2"
          >
            <BookOpen size={18} />
            Lições
          </button>
          <button 
            onClick={() => onNavigate('library')}
            className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm flex items-center gap-2"
          >
            <Library size={18} />
            Acervo
          </button>
        </motion.div>
      </div>

      {/* Bento Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Main Learning Track (Bento) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="md:col-span-2 md:row-span-3 bg-emerald-600 rounded-[40px] p-8 md:p-10 text-white relative overflow-hidden flex flex-col justify-between shadow-xl shadow-emerald-600/20 group cursor-pointer"
          onClick={onStart}
        >
          <div className="relative z-10">
            <span className="bento-label text-white mb-2 border-b border-emerald-500 pb-1">Retomar Estudos</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight mt-6">
              La Akuzativo: <br/>
              <span className="text-emerald-200 italic font-serif">Kiam uzi la literon '-n'</span>
            </h2>

            <p className="text-emerald-50 mb-8 max-w-sm text-lg font-medium opacity-90 leading-relaxed">
              Aprenda como identificar o objeto direto em uma frase usando a regra mais distinta do Esperanto.
            </p>
          </div>
          
          <div className="flex items-center gap-4 relative z-10">
            <button 
              className="bg-white text-emerald-700 px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg"
            >
              Começar Agora
              <ChevronRight className="w-5 h-5" />
            </button>
            <span className="text-xs font-bold text-emerald-100/60 uppercase tracking-widest hidden sm:block">15 minutos • Nível A1</span>
          </div>

          <div className="absolute -right-8 -bottom-8 opacity-10 text-[240px] font-black pointer-events-none select-none group-hover:scale-110 transition-transform duration-700">
            -N
          </div>
        </motion.div>

        {/* Word of the Day (Bento) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="md:col-span-1 md:row-span-2 bento-card p-8 flex flex-col justify-between cursor-pointer group"
          onClick={() => onNavigate('library')}
        >
          <div>
            <div className="flex justify-between items-center mb-6">
              <span className="bg-emerald-100 text-emerald-700 text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider">Vorto de la tago</span>
              <ArrowRight size={14} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
            </div>
            <h4 className="text-3xl font-serif font-bold text-slate-900 tracking-tight italic">{dailyWord.word}</h4>
            <p className="text-slate-500 text-xs font-mono mb-4">{dailyWord.type} • {dailyWord.ipa}</p>
            <p className="text-slate-600 text-sm leading-relaxed font-medium">
              {dailyWord.definition}
            </p>
          </div>
          <p className="text-slate-400 text-[11px] italic font-medium leading-tight mt-4">
            {dailyWord.example}
          </p>
        </motion.div>

        {/* Stats Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="md:col-span-1 md:row-span-2 bento-card p-6 flex flex-col items-center justify-center text-center overflow-hidden group cursor-pointer"
          onClick={() => onNavigate('dashboard')}
        >
          <div className="relative mb-6">
            <svg className="w-28 h-28 transform -rotate-90">
              <circle cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-100" />
              <circle 
                cx="56" cy="56" r="48" 
                stroke="currentColor" 
                strokeWidth="10" 
                fill="transparent" 
                className="text-emerald-500" 
                strokeDasharray="301.6" 
                strokeDashoffset={301.6 - (301.6 * (Math.min(stats.points, 1000) / 1000))} 
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-black text-2xl text-slate-900">{Math.round((Math.min(stats.points, 1000) / 1000) * 100)}%</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Nível 1</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center justify-between px-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
                <Target size={12} className="text-emerald-500" /> Pontos
              </span>
              <span className="text-xs font-black text-slate-900">{stats.points}</span>
            </div>
            <div className="flex items-center justify-between px-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
                <Trophy size={12} className="text-blue-500" /> Badges
              </span>
              <span className="text-xs font-black text-slate-900">{stats.badges.length}</span>
            </div>
          </div>
          
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Zap className="text-emerald-500 translate-x-3 translate-y-3" size={24} />
          </div>
        </motion.div>

        {/* Resources Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="md:col-span-2 md:row-span-2 bento-card p-8 flex flex-col justify-between"
        >
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Recursos Externos</h4>
          <div className="flex items-center justify-around gap-4">
            {[
              { label: 'Duolingo', color: 'bg-green-100 text-green-600', char: 'D', url: 'https://duolingo.com' },
              { label: 'Lernu.net', color: 'bg-blue-100 text-blue-600', char: 'L', url: 'https://lernu.net' },
              { label: 'Vikipedio', color: 'bg-slate-100 text-slate-600', char: 'V', url: 'https://eo.wikipedia.org' },
              { label: 'Reddit', color: 'bg-orange-100 text-orange-600', char: 'R', url: 'https://reddit.com/r/esperanto' }
            ].map((item, i) => (
              <a 
                key={i} 
                href={item.url} 
                target="_blank" 
                rel="noreferrer" 
                className="text-center group cursor-pointer"
              >
                <div className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center font-bold text-xl mb-2 group-hover:scale-110 transition-transform`}>
                  {item.char}
                </div>
                <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-600 transition-colors uppercase">{item.label}</span>
              </a>
            ))}
          </div>
        </motion.div>

        {/* Search Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="md:col-span-1 md:row-span-2 bg-slate-900 rounded-[40px] p-8 text-white flex flex-col justify-between shadow-2xl shadow-slate-900/20"
        >
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Search size={18} className="text-emerald-500" />
                Vortaro
              </h3>
              <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Beta</span>
            </div>
            
            <ul className="space-y-4 mb-6">
              <li className="flex justify-between text-xs font-medium group cursor-help">
                <span className="text-emerald-400 font-mono group-hover:scale-105 transition-transform origin-left">Bela</span>
                <span className="text-slate-400 italic">Beautiful</span>
              </li>
              <li className="flex justify-between text-xs font-medium group cursor-help">
                <span className="text-emerald-400 font-mono group-hover:scale-105 transition-transform origin-left">Danki</span>
                <span className="text-slate-400 italic">To thank</span>
              </li>
              <li className="flex justify-between text-xs font-medium group cursor-help">
                <span className="text-emerald-400 font-mono group-hover:scale-105 transition-transform origin-left">Feliĉa</span>
                <span className="text-slate-400 italic">Happy</span>
              </li>
            </ul>
          </div>
          
          <button 
            onClick={() => onNavigate('library')}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
          >
            Abrir Dicionário Pleno
            <ArrowRight size={12} />
          </button>
        </motion.div>

        {/* Bottom Feature card - Community */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="md:col-span-1 md:row-span-2 bento-card p-8 flex flex-col justify-between bg-gradient-to-br from-blue-50 to-white"
        >
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Comunidade</span>
            <h4 className="text-xl font-bold text-slate-900">Encontros Locais</h4>
            <p className="text-slate-500 text-xs">Descubra grupos de Esperanto perto de você ou online.</p>
          </div>
          <button className="flex items-center gap-2 text-blue-600 font-bold text-sm hover:translate-x-1 transition-transform mt-4">
            Explorar <ArrowRight size={16} />
          </button>
        </motion.div>

        {/* History Area - Refined */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="md:col-span-4 bg-white border border-slate-100 rounded-[40px] p-10 flex flex-col gap-10 overflow-hidden shadow-sm"
        >
          <div className="w-full text-center md:text-left">
            <div className="flex items-center gap-3 mb-6 justify-center md:justify-start">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                <Globe size={20} />
              </div>
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Nia Historio</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-none">Uma língua para <span className="text-emerald-500 italic">unir</span> o mundo</h3>
                <p className="text-slate-600 text-lg leading-relaxed font-medium">
                  Criada em 1887 pelo médico polonês <span className="text-emerald-600">L.L. Zamenhof</span>, o Esperanto foi projetado para ser uma língua neutra e fácil de aprender, promovendo a paz e a compreensão internacional.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 space-y-4">
                  <div className="p-3 bg-white text-emerald-600 rounded-2xl w-fit shadow-sm">
                    <Sparkles size={20} />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Design Lógico</h4>
                  <p className="text-slate-500 text-xs leading-relaxed">Gramática regular sem exceções e sistema lógico de afixos.</p>
                </div>
                
                <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 space-y-4">
                  <div className="p-3 bg-white text-blue-600 rounded-2xl w-fit shadow-sm">
                    <Users size={20} />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Cultura Viva</h4>
                  <p className="text-slate-500 text-xs leading-relaxed">Música, literatura e encontros globais em mais de 100 países.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
