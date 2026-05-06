import React from 'react';
import { motion } from 'motion/react';
import { Award, Trophy, Users, Star, Flame, Zap, Settings, Bell, Volume2, LayoutGrid, List, Palette, History, Calendar, Clock, Search, BookOpen } from 'lucide-react';
import { Badge, UserStats, NotificationSettings, DashboardSettings } from '../types';
import { SAMPLE_LESSONS } from './Lessons';

interface DashboardProps {
  stats: UserStats;
  allBadges: Badge[];
  settings: NotificationSettings;
  onUpdateSettings: (settings: NotificationSettings) => void;
}

const MOCK_LEADERBOARD = [
  { name: 'Esperantisto_99', points: 2500, level: 12 },
  { name: 'Verda_Stelo', points: 2150, level: 10 },
  { name: 'Zamenhof_Fan', points: 1900, level: 9 },
  { name: 'Lernejo_Pro', points: 1850, level: 9 },
  { name: 'Knabo_Bona', points: 1600, level: 8 },
];

const THEMES = {
  emerald: {
    primary: 'text-emerald-500',
    secondary: 'text-emerald-700',
    bg: 'bg-emerald-50',
    bgHover: 'group-hover:bg-emerald-100',
    border: 'border-emerald-100',
    accent: 'emerald',
    gradient: 'bento-gradient',
    leaderboardUser: 'bg-emerald-600 border-emerald-500',
    leaderboardPoints: 'text-emerald-400',
    toggleOn: 'bg-emerald-500'
  },
  blue: {
    primary: 'text-blue-500',
    secondary: 'text-blue-700',
    bg: 'bg-blue-50',
    bgHover: 'group-hover:bg-blue-100',
    border: 'border-blue-100',
    accent: 'blue',
    gradient: 'bg-gradient-to-br from-blue-500 to-indigo-600',
    leaderboardUser: 'bg-blue-600 border-blue-500',
    leaderboardPoints: 'text-blue-400',
    toggleOn: 'bg-blue-500'
  },
  violet: {
    primary: 'text-violet-500',
    secondary: 'text-violet-700',
    bg: 'bg-violet-50',
    bgHover: 'group-hover:bg-violet-100',
    border: 'border-violet-100',
    accent: 'violet',
    gradient: 'bg-gradient-to-br from-violet-500 to-purple-600',
    leaderboardUser: 'bg-violet-600 border-violet-500',
    leaderboardPoints: 'text-violet-400',
    toggleOn: 'bg-violet-500'
  },
  rose: {
    primary: 'text-rose-500',
    secondary: 'text-rose-700',
    bg: 'bg-rose-50',
    bgHover: 'group-hover:bg-rose-100',
    border: 'border-rose-100',
    accent: 'rose',
    gradient: 'bg-gradient-to-br from-rose-500 to-pink-600',
    leaderboardUser: 'bg-rose-600 border-rose-500',
    leaderboardPoints: 'text-rose-400',
    toggleOn: 'bg-rose-500'
  }
};

export function Dashboard({ stats, allBadges, settings, onUpdateSettings }: DashboardProps) {
  const level = Math.floor(stats.points / 500) + 1;
  const progressToNextLevel = (stats.points % 500) / 5;
  const { layout, sections } = settings.dashboard;

  const toggleSetting = (key: keyof NotificationSettings) => {
    onUpdateSettings({ ...settings, [key]: !settings[key] });
  };

  const updateDashboardSetting = (key: keyof DashboardSettings, value: any) => {
    onUpdateSettings({
      ...settings,
      dashboard: { ...settings.dashboard, [key]: value }
    });
  };

  const updateSectionColor = (section: keyof DashboardSettings['sections'], color: any) => {
    onUpdateSettings({
      ...settings,
      dashboard: {
        ...settings.dashboard,
        sections: {
          ...settings.dashboard.sections,
          [section]: color
        }
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className={`grid ${layout === 'grid' ? 'lg:grid-cols-3' : 'grid-cols-1'} gap-8`}>
        
        {/* Left Column: Progress & Stats */}
        <div className={`${layout === 'grid' ? 'lg:col-span-2' : ''} space-y-8`}>
          <div className="bento-card p-8 md:p-12 bg-white relative overflow-hidden group">
            <div className={`absolute -top-24 -right-24 w-64 h-64 ${THEMES[sections.progress].bg} rounded-full blur-3xl opacity-50 ${THEMES[sections.progress].bgHover} transition-colors duration-700`} />
            
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6 text-left">
              <div>
                <div className={`inline-flex items-center gap-2 px-3 py-1 ${THEMES[sections.progress].bg} ${THEMES[sections.progress].secondary} rounded-full text-[10px] font-black uppercase tracking-widest mb-4`}>
                  <Flame size={12} /> Status da Jornada
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-2 tracking-tight">Seu Progresso</h2>
                <p className="text-slate-500 font-medium text-lg italic">"Paŝo post paŝo, ni atingos la celon."</p>
              </div>
              <div className="relative">
                <div className="w-24 h-24 bg-slate-900 rounded-[32px] flex flex-col items-center justify-center text-white shadow-2xl shadow-slate-900/40 transform -rotate-3 hover:rotate-0 transition-transform cursor-default group/level">
                  <span className="text-[10px] font-black uppercase tracking-tighter opacity-50">Nível</span>
                  <span className="text-4xl font-black leading-none">{level}</span>
                </div>
                <div className={`absolute -bottom-2 -right-2 w-10 h-10 ${THEMES[sections.progress].primary.replace('text-', 'bg-')} rounded-2xl flex items-center justify-center text-white border-4 border-white shadow-lg animate-bounce`}>
                  <Flame size={18} />
                </div>
              </div>
            </div>

            <div className="space-y-6 relative z-10">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Experiência do Nível</span>
                  <div className="text-2xl font-black text-slate-900">{stats.points % 500} <span className="text-slate-300">/ 500 XP</span></div>
                </div>
                <div className="text-right text-left">
                  <div className={`text-3xl font-black ${THEMES[sections.progress].primary}`}>{Math.round(progressToNextLevel)}%</div>
                </div>
              </div>
              <div className="h-6 bg-slate-100 rounded-2xl p-1 shadow-inner relative overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressToNextLevel}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full rounded-xl ${THEMES[sections.progress].gradient} shadow-lg relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)] animate-[shimmer_2s_infinite]" />
                </motion.div>
              </div>
            </div>

            <div className={`grid grid-cols-1 ${layout === 'grid' ? 'sm:grid-cols-3' : 'sm:grid-cols-3'} gap-6 mt-12 relative z-10`}>
              <motion.div 
                whileHover={{ y: -5 }}
                className="flex items-center gap-6 p-6 bg-slate-50 rounded-[32px] border border-slate-100 transition-all hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 group/stat"
              >
                <div className="w-14 h-14 bg-orange-100 text-orange-500 rounded-2xl flex items-center justify-center group-hover/stat:scale-110 group-hover/stat:rotate-12 transition-all">
                  <Flame size={28} />
                </div>
                <div className="text-left">
                  <div className="text-3xl font-black text-slate-900 tracking-tight">{stats.streak}</div>
                  <div className="text-[10px] bento-label text-slate-400 uppercase tracking-widest">Dias de Ofensiva</div>
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -5 }}
                className="flex items-center gap-6 p-6 bg-slate-50 rounded-[32px] border border-slate-100 transition-all hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 group/stat"
              >
                <div className={`w-14 h-14 bg-yellow-100 text-yellow-600 rounded-2xl flex items-center justify-center group-hover/stat:scale-110 group-hover/stat:rotate-12 transition-all`}>
                  <Zap size={28} />
                </div>
                <div className="text-left">
                  <div className="text-3xl font-black text-slate-900 tracking-tight">{stats.points}</div>
                  <div className="text-[10px] bento-label text-slate-400 uppercase tracking-widest">Total de XP</div>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -5 }}
                className="flex items-center gap-6 p-6 bg-slate-50 rounded-[32px] border border-slate-100 transition-all hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 group/stat"
              >
                <div className={`w-14 h-14 ${THEMES[sections.progress].bg} ${THEMES[sections.progress].primary} rounded-2xl flex items-center justify-center group-hover/stat:scale-110 group-hover/stat:rotate-12 transition-all`}>
                  <Star size={28} />
                </div>
                <div className="text-left">
                  <div className="text-3xl font-black text-slate-900 tracking-tight">{stats.badges.length}</div>
                  <div className="text-[10px] bento-label text-slate-400 uppercase tracking-widest">Conquistas</div>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="bento-card p-6 md:p-10 bg-white overflow-hidden relative">
            <div className={`absolute top-0 right-0 p-8 opacity-5 ${THEMES[sections.progress].primary}`}>
              <History size={120} />
            </div>
            
            <h3 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-4 relative z-10 text-left">
              <div className={`w-10 h-10 ${THEMES[sections.progress].bg} ${THEMES[sections.progress].primary} rounded-xl flex items-center justify-center shadow-lg`}>
                <History size={24} />
              </div>
              Histórico de Lições
            </h3>

            <div className="space-y-4 relative z-10">
              {!stats.lessonScores || stats.lessonScores.length === 0 ? (
                <div className="py-12 text-center bg-slate-50 rounded-[32px] border border-dashed border-slate-200">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 mx-auto mb-4 shadow-sm">
                    <Clock size={32} />
                  </div>
                  <p className="text-slate-400 font-bold">Nenhuma lição concluída ainda.</p>
                  <p className="text-slate-300 text-xs mt-1">Sua jornada está esperando por você!</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {[...stats.lessonScores].reverse().slice(0, 5).map((score, i) => {
                    const lesson = SAMPLE_LESSONS.find(l => l.id === score.lessonId);
                    const date = new Date(score.timestamp).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    });
                    
                    return (
                      <motion.div 
                        key={`${score.lessonId}-${score.timestamp}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all group/history"
                      >
                        <div className="flex items-center gap-5">
                          <div className={`w-12 h-12 ${score.score >= 80 ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'} rounded-2xl flex items-center justify-center font-black text-lg group-hover/history:scale-110 transition-transform`}>
                            {score.score}%
                          </div>
                          <div className="text-left">
                            <h4 className="font-bold text-slate-900 group-hover/history:text-emerald-600 transition-colors">{lesson?.title || 'Lição Desconhecida'}</h4>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="flex items-center gap-1 text-[10px] text-slate-400 font-black uppercase tracking-widest">
                                <Calendar size={12} className="opacity-50" /> {date}
                              </span>
                              <span className={`w-1 h-1 rounded-full bg-slate-200`} />
                              <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{lesson?.difficulty || 'geral'}</span>
                            </div>
                          </div>
                        </div>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${score.score >= 80 ? 'text-emerald-500' : 'text-amber-500'} opacity-0 group-hover/history:opacity-100 transition-opacity`}>
                          <Zap size={18} fill="currentColor" />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Resource Quick Access */}
          <div className="bento-card p-6 md:p-10 bg-slate-900 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Zap size={120} />
            </div>
            
            <h3 className="text-3xl font-black text-white mb-8 flex items-center gap-4 relative z-10 text-left">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                <Zap size={24} />
              </div>
              Atalhos de Estudo
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
              {[
                { 
                  title: 'Dicionário Pleno', 
                  desc: 'Consulte milhares de verbetes', 
                  icon: Search, 
                  color: 'bg-blue-500'
                },
                { 
                  title: 'Gramática Prática', 
                  desc: 'As 16 regras sem exceções', 
                  icon: BookOpen, 
                  color: 'bg-emerald-500'
                },
                { 
                  title: 'Meus Flashcards', 
                  desc: 'Revise o que você aprendeu', 
                  icon: Star, 
                  color: 'bg-amber-500'
                }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <motion.div 
                    key={item.title}
                    whileHover={{ y: -4 }}
                    className="bg-white/5 border border-white/10 p-6 rounded-[32px] hover:bg-white/10 transition-all cursor-pointer group"
                  >
                    <div className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                      <Icon size={24} />
                    </div>
                    <h4 className="font-bold text-lg mb-1 text-left">{item.title}</h4>
                    <p className="text-slate-400 text-[10px] text-left uppercase font-black tracking-widest">{item.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="bento-card p-6 md:p-10 bg-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Award size={120} />
            </div>
            
            <h3 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-4 relative z-10 text-left">
              <div className={`w-10 h-10 ${THEMES[sections.achievements].primary.replace('text-', 'bg-')} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                <Award size={24} />
              </div>
              Suas Medalhas
            </h3>
            <div className={`grid ${layout === 'grid' ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2 md:grid-cols-6'} gap-6 relative z-10`}>
              {allBadges.map(badge => {
                const isUnlocked = stats.badges.includes(badge.id);
                return (
                  <motion.div 
                    key={badge.id}
                    layout
                    whileHover={isUnlocked ? { 
                      scale: 1.05, 
                      y: -5,
                      rotate: [0, -2, 2, 0],
                      transition: { duration: 0.3 }
                    } : {}}
                    className={`group relative p-6 rounded-[32px] border text-center transition-all duration-500 ${
                      isUnlocked 
                        ? `bg-white ${THEMES[sections.achievements].border} shadow-lg ring-4 ${THEMES[sections.achievements].primary.replace('text-', 'ring-')}/5` 
                        : 'bg-slate-50 border-slate-100 opacity-40 grayscale grayscale-[0.8]'
                    }`}
                  >
                    <div className="relative">
                      <div className={`text-5xl mb-4 transform transition-transform duration-500 ${isUnlocked ? 'group-hover:scale-110 drop-shadow-lg' : ''}`}>
                        {badge.icon}
                      </div>
                      {isUnlocked && (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className={`absolute -top-1 -right-1 w-5 h-5 ${THEMES[sections.achievements].primary.replace('text-', 'bg-')} rounded-full border-2 border-white flex items-center justify-center`}
                        >
                          <Zap size={10} className="text-white" />
                        </motion.div>
                      )}
                    </div>
                    <div className="text-sm font-black text-slate-900 mb-1 tracking-tight">{badge.name}</div>
                    <div className="text-[10px] text-slate-500 leading-tight font-bold uppercase tracking-tighter opacity-70">
                      {badge.description}
                    </div>

                    {!isUnlocked && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/5 rounded-[32px] backdrop-blur-[1px]">
                        <div className="bg-slate-800 text-white text-[9px] font-black uppercase px-2 py-1 rounded-lg tracking-widest">Bloqueado</div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Customization & Settings Section */}
          <div className="bento-card p-6 md:p-10 bg-slate-50 space-y-12">
            <div>
              <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3 text-left">
                <Palette className="text-slate-400" />
                Personalizar Dashboard por Seção
              </h3>
              
              <div className="space-y-8">
                {/* Layout Style */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block text-left">Estilo Geral do Layout</label>
                  <div className="flex max-w-md gap-3">
                    <button
                      onClick={() => updateDashboardSetting('layout', 'grid')}
                      className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-2xl font-bold transition-all ${
                        layout === 'grid' 
                          ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' 
                          : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <LayoutGrid size={20} /> Grade
                    </button>
                    <button
                      onClick={() => updateDashboardSetting('layout', 'list')}
                      className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-2xl font-bold transition-all ${
                        layout === 'list' 
                          ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' 
                          : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <List size={20} /> Lista
                    </button>
                  </div>
                </div>

                {/* Section Colors */}
                <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-slate-200">
                  {[
                    { id: 'progress', label: 'Progresso e Atividade' },
                    { id: 'achievements', label: 'Conquistas e Medalhas' },
                    { id: 'settings', label: 'Preferências de App' },
                    { id: 'leaderboard', label: 'Ranking Global' }
                  ].map((sec) => (
                    <div key={sec.id} className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block text-left">Cor: {sec.label}</label>
                      <div className="flex flex-wrap gap-2">
                        {Object.keys(THEMES).map((color) => (
                          <button
                            key={color}
                            onClick={() => updateSectionColor(sec.id as any, color)}
                            className={`w-10 h-10 rounded-xl transition-all relative flex items-center justify-center border-2 ${
                              sections[sec.id as keyof typeof sections] === color 
                                ? 'border-slate-900 scale-110 shadow-md' 
                                : 'border-transparent opacity-60 hover:opacity-100'
                            }`}
                            title={color.charAt(0).toUpperCase() + color.slice(1)}
                          >
                            <div className={`w-6 h-6 rounded-lg ${color === 'emerald' ? 'bg-emerald-500' : color === 'blue' ? 'bg-blue-500' : color === 'violet' ? 'bg-violet-500' : 'bg-rose-500'}`} />
                            {sections[sec.id as keyof typeof sections] === color && <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-slate-900 rounded-full flex items-center justify-center text-[7px] text-white font-bold">✓</div>}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3 border-t border-slate-200 pt-10 text-left">
                <Settings className="text-slate-400" />
                Preferências de Aplicativo
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between p-6 bg-white rounded-3xl border border-slate-100">
                  <div className="flex gap-4 items-center">
                    <div className={`w-10 h-10 ${THEMES[sections.settings].bg} ${THEMES[sections.settings].secondary} rounded-xl flex items-center justify-center`}>
                      <Bell size={20} />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-slate-900 text-sm font-bold">Lembretes de aula</div>
                      <div className="text-[10px] text-slate-400 font-medium font-medium">Notificar para praticar diariamente</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleSetting('lessonReminders')}
                    className={`w-12 h-6 rounded-full transition-all relative ${settings.lessonReminders ? THEMES[sections.settings].toggleOn : 'bg-slate-200'}`}
                  >
                    <motion.div 
                      animate={{ x: settings.lessonReminders ? 26 : 4 }}
                      className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-6 bg-white rounded-3xl border border-slate-100">
                  <div className="flex gap-4 items-center">
                    <div className={`w-10 h-10 ${THEMES[sections.settings].bg} ${THEMES[sections.settings].secondary} rounded-xl flex items-center justify-center`}>
                      <Zap size={20} />
                    </div>
                    <div className="text-left text-left">
                      <div className="font-bold text-slate-900 text-sm font-bold">Novas lições</div>
                      <div className="text-[10px] text-slate-400 font-medium font-medium">Alertar quando houver conteúdo novo</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleSetting('newContentAlerts')}
                    className={`w-12 h-6 rounded-full transition-all relative ${settings.newContentAlerts ? THEMES[sections.settings].toggleOn : 'bg-slate-200'}`}
                  >
                    <motion.div 
                      animate={{ x: settings.newContentAlerts ? 26 : 4 }}
                      className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-6 bg-white rounded-3xl border border-slate-100">
                  <div className="flex gap-4 items-center">
                    <div className={`w-10 h-10 ${THEMES[sections.settings].bg} ${THEMES[sections.settings].secondary} rounded-xl flex items-center justify-center`}>
                      <Volume2 size={20} />
                    </div>
                    <div className="text-left text-left">
                      <div className="font-bold text-slate-900 text-sm font-bold">Efeitos Sonoros</div>
                      <div className="text-[10px] text-slate-400 font-medium font-medium">Sons ao completar desafios</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleSetting('soundEnabled')}
                    className={`w-12 h-6 rounded-full transition-all relative ${settings.soundEnabled ? THEMES[sections.settings].toggleOn : 'bg-slate-200'}`}
                  >
                    <motion.div 
                      animate={{ x: settings.soundEnabled ? 26 : 4 }}
                      className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Leaderboard */}
        <div className={`space-y-8 ${layout === 'list' ? 'max-w-xl mx-auto w-full' : ''}`}>
          <div className="bento-card p-6 md:p-10 bg-slate-900 text-white h-full">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 text-left">
              <Trophy className="text-yellow-400" />
              Ranking Global
            </h3>
            <div className="space-y-6">
              {/* User Position */}
              <div className={`p-4 ${THEMES[sections.leaderboard].leaderboardUser} rounded-2xl flex items-center justify-between border shadow-lg scale-105`}>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-white text-slate-900 flex items-center justify-center font-bold text-sm">
                    6
                  </div>
                  <div className="text-left">
                    <div className="font-bold">Você</div>
                    <div className="text-[10px] opacity-80 uppercase font-bold">Nível {level}</div>
                  </div>
                </div>
                <div className="font-bold text-sm">{stats.points} XP</div>
              </div>

              {MOCK_LEADERBOARD.map((user, i) => (
                <div key={user.name} className="flex items-center justify-between p-2 border-b border-slate-800 last:border-0 hover:bg-white/5 transition-colors rounded-lg">
                  <div className="flex items-center gap-4 text-left">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      i === 0 ? 'bg-yellow-400 text-slate-900' :
                      i === 1 ? 'bg-slate-300 text-slate-900' :
                      i === 2 ? 'bg-orange-400 text-slate-900' :
                      'text-slate-500'
                    }`}>
                      {i + 1}
                    </div>
                    <div>
                      <div className="font-bold text-sm">{user.name}</div>
                      <div className="text-[10px] text-slate-500 uppercase font-bold">Nível {user.level}</div>
                    </div>
                  </div>
                  <div className={`font-bold text-sm ${THEMES[sections.leaderboard].leaderboardPoints}`}>{user.points} XP</div>
                </div>
              ))}
            </div>

            <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/10 text-center">
              <Users size={24} className="mx-auto mb-3 opacity-40" />
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                Suba no ranking completando lições diárias e acertando flashcards!
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
