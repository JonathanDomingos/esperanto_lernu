import React from 'react';
import { motion } from 'motion/react';
import { Award, Trophy, Users, Star, Flame, Zap, Settings, Bell, Volume2 } from 'lucide-react';
import { Badge, UserStats, NotificationSettings } from '../types';

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

export function Dashboard({ stats, allBadges, settings, onUpdateSettings }: DashboardProps) {
  const level = Math.floor(stats.points / 500) + 1;
  const progressToNextLevel = (stats.points % 500) / 5;

  const toggleSetting = (key: keyof NotificationSettings) => {
    onUpdateSettings({ ...settings, [key]: !settings[key] });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: Progress & Stats */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bento-card p-8 md:p-12 bg-white relative overflow-hidden group">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-50 group-hover:bg-emerald-100 transition-colors duration-700" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
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
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center text-white border-4 border-white shadow-lg animate-bounce">
                  <Trophy size={18} />
                </div>
              </div>
            </div>

            <div className="space-y-6 relative z-10">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Experiência do Nível</span>
                  <div className="text-2xl font-black text-slate-900">{stats.points % 500} <span className="text-slate-300">/ 500 XP</span></div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-emerald-500">{Math.round(progressToNextLevel)}%</div>
                </div>
              </div>
              <div className="h-6 bg-slate-100 rounded-2xl p-1 shadow-inner relative overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressToNextLevel}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full rounded-xl bento-gradient shadow-lg relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)] animate-[shimmer_2s_infinite]" />
                </motion.div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 relative z-10">
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
                <div className="w-14 h-14 bg-yellow-100 text-yellow-600 rounded-2xl flex items-center justify-center group-hover/stat:scale-110 group-hover/stat:rotate-12 transition-all">
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
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center group-hover/stat:scale-110 group-hover/stat:rotate-12 transition-all">
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
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Award size={120} />
            </div>
            
            <h3 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-4 relative z-10">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                <Award size={24} />
              </div>
              Suas Medalhas
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
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
                        ? 'bg-white border-emerald-100 shadow-lg shadow-emerald-500/5 ring-4 ring-emerald-500/5' 
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
                          className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center"
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

          {/* Settings Section */}
          <div className="bento-card p-6 md:p-10 bg-slate-50">
            <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <Settings className="text-slate-400" />
              Configurações
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between p-6 bg-white rounded-3xl border border-slate-100">
                <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                    <Bell size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">Lembretes de aula</div>
                    <div className="text-[10px] text-slate-400 font-medium">Notificar para praticar diariamente</div>
                  </div>
                </div>
                <button 
                  onClick={() => toggleSetting('lessonReminders')}
                  className={`w-12 h-6 rounded-full transition-all relative ${settings.lessonReminders ? 'bg-emerald-500' : 'bg-slate-200'}`}
                >
                  <motion.div 
                    animate={{ x: settings.lessonReminders ? 26 : 4 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-6 bg-white rounded-3xl border border-slate-100">
                <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                    <Zap size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">Novas lições</div>
                    <div className="text-[10px] text-slate-400 font-medium">Alertar quando houver conteúdo novo</div>
                  </div>
                </div>
                <button 
                  onClick={() => toggleSetting('newContentAlerts')}
                  className={`w-12 h-6 rounded-full transition-all relative ${settings.newContentAlerts ? 'bg-blue-500' : 'bg-slate-200'}`}
                >
                  <motion.div 
                    animate={{ x: settings.newContentAlerts ? 26 : 4 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-6 bg-white rounded-3xl border border-slate-100">
                <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                    <Volume2 size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">Efeitos Sonoros</div>
                    <div className="text-[10px] text-slate-400 font-medium">Sons ao completar desafios</div>
                  </div>
                </div>
                <button 
                  onClick={() => toggleSetting('soundEnabled')}
                  className={`w-12 h-6 rounded-full transition-all relative ${settings.soundEnabled ? 'bg-orange-500' : 'bg-slate-200'}`}
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

        {/* Right Column: Leaderboard */}
        <div className="space-y-8">
          <div className="bento-card p-6 md:p-10 bg-slate-900 text-white h-full">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <Trophy className="text-yellow-400" />
              Ranking Global
            </h3>
            <div className="space-y-6">
              {/* User Position */}
              <div className="p-4 bg-emerald-600 rounded-2xl flex items-center justify-between border border-emerald-500 shadow-lg scale-105">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-white text-emerald-600 flex items-center justify-center font-bold text-sm">
                    6
                  </div>
                  <div>
                    <div className="font-bold">Você</div>
                    <div className="text-[10px] opacity-80 uppercase font-bold">Nível {level}</div>
                  </div>
                </div>
                <div className="font-bold text-sm">{stats.points} XP</div>
              </div>

              {MOCK_LEADERBOARD.map((user, i) => (
                <div key={user.name} className="flex items-center justify-between p-2 border-b border-slate-800 last:border-0 hover:bg-white/5 transition-colors rounded-lg">
                  <div className="flex items-center gap-4">
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
                  <div className="font-bold text-sm text-emerald-400">{user.points} XP</div>
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
