import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Globe, Sparkles, BookOpen, Play, Search, Users, Target, Clock, Zap } from 'lucide-react';

const WORDS_OF_THE_DAY = [
  { word: 'Klopodi', type: 'Verb', ipa: '/kloˈpodi/', definition: 'Se esforçar, empenhar-se, fazer um esforço para realizar algo.', example: '"Mi klopodas lerni Esperanton ĉiutage."' },
  { word: 'Feliĉa', type: 'Adj', ipa: '/feˈlit͡ʃa/', definition: 'Feliz, contente, satisfeito com algo ou alguém.', example: '"Mi estas feliĉa renkonti vin."' },
  { word: 'Danki', type: 'Verb', ipa: '/ˈdanki/', definition: 'Agradecer, expressar gratidão por algo recebido.', example: '"Mi dankas vin pro via helpo."' },
  { word: 'Ebleco', type: 'Noun', ipa: '/eˈblet͡so/', definition: 'Possibilidade, chance de que algo aconteça.', example: '"Estas ebleco venki en la ludo."' },
  { word: 'Ĉiutaga', type: 'Adj', ipa: '/t͡ʃiuˈtaga/', definition: 'Diário, cotidiano, que ocorre todos os dias.', example: '"Lernado estas mia ĉiutaga tasko."' },
];

interface HeroProps {
  onStart: () => void;
}

export function Hero({ onStart }: HeroProps) {
  const dailyWord = useMemo(() => {
    return WORDS_OF_THE_DAY[Math.floor(Math.random() * WORDS_OF_THE_DAY.length)];
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10">
      {/* Bento Grid layout matches the provided Design HTML */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Main Learning Track (Bento) - Emerald-600 background */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="md:col-span-2 md:row-span-3 bg-emerald-600 rounded-[40px] p-8 md:p-10 text-white relative overflow-hidden flex flex-col justify-between shadow-xl shadow-emerald-600/20"
        >
          <div className="relative z-10">
            <span className="bento-label text-white mb-2 border-b border-emerald-500 pb-1">Leciono de la tago</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight mt-6">
              La Akuzativo: <br/>
              <span className="text-emerald-200 italic font-serif">Kiam uzi la literon '-n'</span>
            </h2>

            <p className="text-emerald-50 mb-8 max-w-sm text-lg font-medium opacity-90 leading-relaxed">
              Aprenda como identificar o objeto direto em uma frase usando a regra mais distinta do Esperanto.
            </p>
          </div>
          
          <button 
            onClick={onStart}
            className="w-fit bg-white text-emerald-700 px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg"
          >
            Começar Lição Interativa
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="absolute -right-8 -bottom-8 opacity-10 text-[240px] font-black pointer-events-none select-none">
            -N
          </div>
        </motion.div>

        {/* Word of the Day (Bento) - Slate base */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="md:col-span-1 md:row-span-2 bento-card p-8 flex flex-col justify-between"
        >
          <div>
            <span className="bg-emerald-100 text-emerald-700 text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider">Vorto de la tago</span>
            <h4 className="text-3xl font-serif font-bold text-slate-900 mt-6 tracking-tight italic">{dailyWord.word}</h4>
            <p className="text-slate-500 text-xs font-mono mb-4">{dailyWord.type} • {dailyWord.ipa}</p>
            <p className="text-slate-600 text-sm leading-relaxed font-medium">
              {dailyWord.definition}
            </p>
          </div>
          <p className="text-slate-400 text-[11px] italic font-medium leading-tight mt-4">
            {dailyWord.example}
          </p>
        </motion.div>

        {/* Stats / Progress Card (Bento) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="md:col-span-1 md:row-span-2 bento-card p-6 flex flex-col items-center justify-center text-center overflow-hidden group"
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
                strokeDashoffset="75.4" // 75%
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-black text-2xl text-slate-900">75%</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Completo</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center justify-between px-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
                <Target size={12} className="text-emerald-500" /> Metas
              </span>
              <span className="text-xs font-black text-slate-900">3/4</span>
            </div>
            <div className="flex items-center justify-between px-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
                <Clock size={12} className="text-blue-500" /> Tempo
              </span>
              <span className="text-xs font-black text-slate-900">45m</span>
            </div>
          </div>
          
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Zap className="text-emerald-500 translate-x-3 translate-y-3" size={24} />
          </div>
        </motion.div>

        {/* Resources Card (Bento) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="md:col-span-2 md:row-span-2 bento-card p-8 flex items-center justify-around gap-4"
        >
          {[
            { label: 'Duolingo', color: 'bg-green-100 text-green-600', char: 'D' },
            { label: 'Lernu.net', color: 'bg-blue-100 text-blue-600', char: 'L' },
            { label: 'Vikipedio', color: 'bg-slate-100 text-slate-600', char: 'V' },
            { label: 'Reddit', color: 'bg-orange-100 text-orange-600', char: 'R' }
          ].map((item, i) => (
            <div key={i} className="text-center group cursor-pointer">
              <div className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center font-bold text-xl mb-2 group-hover:scale-110 transition-transform`}>
                {item.char}
              </div>
              <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-600 transition-colors uppercase">{item.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Search Card (Bento) - Dark theme like design */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="md:col-span-1 md:row-span-2 bg-slate-900 rounded-[40px] p-8 text-white flex flex-col justify-between"
        >
          <div>
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <Search size={18} className="text-emerald-500" />
              Rapida Vortaro
            </h3>
            <div className="relative mb-6">
              <input 
                type="text" 
                placeholder="Pesquisar..." 
                className="w-full bg-slate-800 border-none rounded-xl py-3 px-4 text-xs focus:ring-1 focus:ring-emerald-500 text-slate-200 outline-none"
              />
            </div>
            <ul className="space-y-4">
              <li className="flex justify-between text-xs font-medium">
                <span className="text-emerald-400 font-mono">Bela</span>
                <span className="text-slate-400 italic">Beautiful</span>
              </li>
              <li className="flex justify-between text-xs font-medium">
                <span className="text-emerald-400 font-mono">Danki</span>
                <span className="text-slate-400 italic">To thank</span>
              </li>
              <li className="flex justify-between text-xs font-medium">
                <span className="text-emerald-400 font-mono">Feliĉa</span>
                <span className="text-slate-400 italic">Happy</span>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* History of Esperanto Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="md:col-span-4 bg-white border border-slate-100 rounded-[40px] p-10 flex flex-col gap-10 overflow-hidden"
        >
          <div className="w-full text-center md:text-left">
            <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                <Globe size={20} />
              </div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Historio de Esperanto</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Uma língua para unir o mundo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <p className="text-slate-600 text-lg leading-relaxed mb-6">
                  Criada em 1887 pelo médico polonês <strong>L.L. Zamenhof</strong>, o Esperanto foi projetado para ser uma língua neutra e fácil de aprender, promovendo a paz e a compreensão internacional. Zamenhof acreditava que grande parte dos conflitos mundiais vinha da falta de comunicação efetiva.
                </p>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Design Lógico</h4>
                    <p className="text-slate-500 text-xs">Sem exceções gramaticais e com um sistema de sufixos eficiente.</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-slate-600 text-lg leading-relaxed mb-6">
                  Diferente de outras línguas, o Esperanto não pertence a nenhuma nação. É o "Linguagem da Amizade", permitindo que pessoas de culturas diferentes conversem em pé de igualdade, sem a barreira da hegemonia cultural.
                </p>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                    <Users size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Cultura Viva</h4>
                    <p className="text-slate-500 text-xs">Milhões de falantes, música, literatura e congressos anuais por todo o globo.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
