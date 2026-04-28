/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Library, 
  ChevronRight, 
  Globe, 
  ExternalLink,
  Award,
  Sparkles,
  Menu,
  X,
  Wifi,
  WifiOff,
  RefreshCw,
  Bell,
  Flame,
  Trophy,
  Star
} from 'lucide-react';
import { Hero } from './components/Hero';
import { Lessons } from './components/Lessons';
import { LibrarySection } from './components/Library';
import { Flashcards } from './components/Flashcards';
import { Dashboard } from './components/Dashboard';
import { DictionarySearch } from './components/DictionarySearch';
import { NotificationCenter } from './components/NotificationCenter';
import { Flashcard, SyncQueueItem, UserStats, Badge, AppNotification, NotificationSettings } from './types';

const BADGES: Badge[] = [
  { id: 'first-step', name: 'Primeiro Passo', description: 'Completou sua primeira lição', icon: '🌱' },
  { id: 'polyglot', name: 'Poliglota', description: 'Completou 5 lições', icon: '🌍' },
  { id: 'streak-3', name: 'Fogo nos Estudos', description: 'Manteve uma sequência de 3 dias', icon: '🔥' },
  { id: 'flash-master', name: 'Mestre dos Flashcards', description: 'Criou 10 flashcards personalizados', icon: '🧠' },
  { id: 'advanced-explorer', name: 'Explorador Avançado', description: 'Iniciou sua jornada em lições avançadas', icon: '🚀' },
  { id: 'course-complete', name: 'Mestre do Esperanto', description: 'Completou todas as 100 lições', icon: '👑' },
];

type Tab = 'home' | 'lessons' | 'library' | 'dashboard';


export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [activeContent, setActiveContent] = useState<'lessons' | 'flashcards'>('lessons');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(() => {
    const saved = localStorage.getItem('esperanto_notification_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (!parsed.dashboard || !parsed.dashboard.sections) {
        parsed.dashboard = { 
          layout: 'grid',
          sections: {
            progress: 'emerald',
            achievements: 'violet',
            settings: 'blue',
            leaderboard: 'rose'
          }
        };
      }
      return parsed;
    }
    return { 
      lessonReminders: true, 
      newContentAlerts: true, 
      soundEnabled: true,
      dashboard: { 
        layout: 'grid',
        sections: {
          progress: 'emerald',
          achievements: 'violet',
          settings: 'blue',
          leaderboard: 'rose'
        }
      }
    };
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('esperanto_notifications');
    if (saved) return JSON.parse(saved);
    return [{
      id: 'welcome',
      title: 'Bem-vindo ao Esperanto Hub! 🌿',
      message: 'Estamos felizes em ter você aqui. Comece sua jornada na primeira lição e desbloqueie conquistas!',
      type: 'info',
      timestamp: Date.now(),
      read: false
    }];
  });

  const [userStats, setUserStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('esperanto_user_stats');
    if (saved) return JSON.parse(saved);
    return { points: 0, streak: 0, badges: [] };
  });

  useEffect(() => {
    localStorage.setItem('esperanto_notification_settings', JSON.stringify(notificationSettings));
  }, [notificationSettings]);

  useEffect(() => {
    localStorage.setItem('esperanto_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (title: string, message: string, type: AppNotification['type']) => {
    const newNotification: AppNotification = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      message,
      type,
      timestamp: Date.now(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  useEffect(() => {
    localStorage.setItem('esperanto_user_stats', JSON.stringify(userStats));
  }, [userStats]);

  // Handle Streaks
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const lastDate = userStats.lastActivityDate;

    if (lastDate && lastDate !== today) {
      const last = new Date(lastDate);
      const current = new Date(today);
      const diffTime = Math.abs(current.getTime() - last.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Increment streak if it's the next day
        setUserStats(prev => ({ ...prev, streak: prev.streak + 1, lastActivityDate: today }));
      } else if (diffDays > 1) {
        // Reset streak if a day was skipped
        setUserStats(prev => ({ ...prev, streak: 1, lastActivityDate: today }));
      }
    } else if (!lastDate) {
      setUserStats(prev => ({ ...prev, streak: 1, lastActivityDate: today }));
    }
  }, []);

  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    const saved = localStorage.getItem('esperanto_completed_lessons');
    return saved ? JSON.parse(saved) : [];
  });

  const [downloadedLessons, setDownloadedLessons] = useState<string[]>(() => {
    const saved = localStorage.getItem('esperanto_downloaded_lessons');
    return saved ? JSON.parse(saved) : [];
  });

  const [syncQueue, setSyncQueue] = useState<SyncQueueItem[]>(() => {
    const saved = localStorage.getItem('esperanto_sync_queue');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (isOnline && syncQueue.length > 0) {
      handleSync();
    }
  }, [isOnline, syncQueue]);

  const handleSync = async () => {
    setIsSyncing(true);
    // Simulate API delay for syncing progress
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSyncQueue([]);
    localStorage.removeItem('esperanto_sync_queue');
    setIsSyncing(false);
  };

  const handleDownloadLesson = (lessonId: string) => {
    setDownloadedLessons(prev => {
      const next = prev.includes(lessonId) 
        ? prev.filter(id => id !== lessonId)
        : [...prev, lessonId];
      localStorage.setItem('esperanto_downloaded_lessons', JSON.stringify(next));
      return next;
    });
  };

  const [flashcards, setFlashcards] = useState<Flashcard[]>(() => {
    const saved = localStorage.getItem('esperanto_flashcards');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('esperanto_completed_lessons', JSON.stringify(completedLessons));
  }, [completedLessons]);

  useEffect(() => {
    localStorage.setItem('esperanto_flashcards', JSON.stringify(flashcards));
  }, [flashcards]);

  // Handle Badges and Stats
  useEffect(() => {
    setUserStats(prev => {
      const newBadges = [...prev.badges];
      
      // First Lesson
      if (completedLessons.length >= 1 && !newBadges.includes('first-step')) {
        newBadges.push('first-step');
      }
      
      // Polyglot (5 lessons)
      if (completedLessons.length >= 5 && !newBadges.includes('polyglot')) {
        newBadges.push('polyglot');
      }
      
      // Advanced Explorer
      const hasAdvanced = completedLessons.some(id => id.startsWith('adv'));
      if (hasAdvanced && !newBadges.includes('advanced-explorer')) {
        newBadges.push('advanced-explorer');
        addNotification('Novo Horizonte! 🚀', 'Você iniciou seus estudos avançados no Esperanto!', 'success');
      }
      
      // Streak 3
      if (userStats.streak >= 3 && !newBadges.includes('streak-3')) {
        newBadges.push('streak-3');
        addNotification('Conquista Desbloqueada! 🔥', 'Você manteve uma sequência de 3 dias!', 'success');
      }
      
      // Course Complete (100 lessons)
      if (completedLessons.length >= 100 && !newBadges.includes('course-complete')) {
        newBadges.push('course-complete');
        addNotification('Mestre do Esperanto! 👑', 'Parabéns! Você completou todas as 100 lições!', 'success');
      }

      if (newBadges.length !== prev.badges.length) {
        return { ...prev, badges: newBadges };
      }
      return prev;
    });
  }, [completedLessons.length, userStats.streak]);

  const awardPoints = (amount: number) => {
    setUserStats(prev => ({ ...prev, points: prev.points + amount }));
  };

  const handleAddFlashcard = (front: string, back: string, category?: string) => {
    // Simulate AI image generation using a high-quality keyword-based search
    const sanitizedSearch = back.toLowerCase().split(' ')[0].replace(/[^a-z]/g, '');
    const imageUrl = `https://images.unsplash.com/photo-1518173946687-a4c8a9ba332f?q=80&w=800&auto=format&fit=crop&keywords=${sanitizedSearch}`;

    const newCard: Flashcard = {
      id: Math.random().toString(36).substr(2, 9),
      front,
      back,
      category: category || 'Geral',
      imageUrl,
      createdAt: Date.now()
    };
    const newCards = [newCard, ...flashcards];
    setFlashcards(newCards);
    
    // Reward for flashcard creation
    awardPoints(10);
    addNotification('Flashcard Criado! 🧠', `Card "${front}" adicionado com imagem ilustrativa.`, 'success');
    
    // Check for flashcard badge
    if (newCards.length >= 10 && !userStats.badges.includes('flash-master')) {
      setUserStats(prev => ({ ...prev, badges: [...prev.badges, 'flash-master'] }));
      addNotification('Conquista Desbloqueada! 🧠', 'Mestre dos Flashcards: Criou 10 flashcards!', 'success');
    }
  };

  const handleDeleteFlashcard = (id: string) => {
    setFlashcards(prev => prev.filter(c => c.id !== id));
  };

  const handleUpdateFlashcard = (updatedCard: Flashcard) => {
    setFlashcards(prev => prev.map(c => c.id === updatedCard.id ? updatedCard : c));
  };

  const handleLessonComplete = (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      const newCompleted = [...completedLessons, lessonId];
      setCompletedLessons(newCompleted);
      localStorage.setItem('esperanto_completed_lessons', JSON.stringify(newCompleted));
      
      // Award points
      awardPoints(100);
      addNotification('Lição Concluída! 📚', 'Você ganhou 100 XP por completar esta lição.', 'success');

      if (!isOnline) {
        const newItem = { lessonId, timestamp: Date.now() };
        const newQueue = [...syncQueue, newItem];
        setSyncQueue(newQueue);
        localStorage.setItem('esperanto_sync_queue', JSON.stringify(newQueue));
      }
    }
  };

  const navItems = [
    { id: 'home', label: 'Início', icon: Sparkles },
    { id: 'lessons', label: 'Lições Interativas', icon: BookOpen },
    { id: 'library', label: 'Acervo Digital', icon: Library },
    { id: 'dashboard', label: 'Conquistas', icon: Award },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans pb-32 md:pb-0 overflow-x-hidden relative">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200 w-full">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex justify-between h-16 md:h-20 items-center">
            <div 
              className="flex items-center space-x-2 md:space-x-3 cursor-pointer group"
              onClick={() => setActiveTab('home')}
            >
              <div className="w-8 h-8 md:w-10 md:h-10 bg-emerald-50 border border-emerald-100 rounded-lg md:rounded-xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform shadow-sm">
                <Star size={16} className="md:w-5 md:h-5 fill-current" />
              </div>
              <span className="text-lg md:text-2xl font-bold tracking-tight text-slate-900">
                Esperanto<span className="text-emerald-600 italic">Lernu</span>
              </span>
            </div>

            {/* Desktop Nav Items */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                  <span className="text-lg">✨</span>
                  <span className="text-sm">{userStats.points}</span>
                </div>
                <div className="w-px h-4 bg-slate-200" />
                <div className="flex items-center gap-1.5 text-orange-500 font-bold">
                  <span className="text-lg">🔥</span>
                  <span className="text-sm">{userStats.streak}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as Tab)}
                      className={`flex items-center space-x-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                        activeTab === item.id 
                          ? 'bg-slate-900 text-white shadow-lg' 
                          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Status Indicators & Mobile Icons */}
            <div className="flex items-center gap-1.5 md:gap-3">
              {/* Mobile Stats - more compact */}
              <div className="flex md:hidden items-center space-x-2 bg-slate-100/50 px-2 py-1 rounded-lg border border-slate-200/50">
                <div className="flex items-center gap-0.5 text-emerald-600 font-bold text-[10px]">
                  <span>✨</span>
                  <span>{userStats.points}</span>
                </div>
                <div className="w-px h-2.5 bg-slate-200" />
                <div className="flex items-center gap-0.5 text-orange-500 font-bold text-[10px]">
                  <span>🔥</span>
                  <span>{userStats.streak}</span>
                </div>
              </div>

              <AnimatePresence>
                {isSyncing && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold uppercase tracking-wider"
                  >
                    <RefreshCw size={14} className="animate-spin" />
                    Sincronizando
                  </motion.div>
                )}
              </AnimatePresence>

              <div className={`p-1.5 md:p-2 rounded-lg md:rounded-xl border transition-colors ${isOnline ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                {isOnline ? <Wifi size={16} className="md:w-[18px] md:h-[18px]" /> : <WifiOff size={16} className="md:w-[18px] md:h-[18px]" />}
              </div>

              <button 
                onClick={() => setIsNotificationsOpen(true)}
                className="p-1.5 md:p-2 rounded-lg md:rounded-xl border bg-white text-slate-400 hover:text-slate-900 border-slate-100 transition-all relative"
              >
                <Bell size={16} className="md:w-[18px] md:h-[18px]" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-emerald-500 rounded-full border-2 border-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation - Floating Island Design */}
      <div className="md:hidden fixed bottom-6 left-6 right-6 z-50">
        <div className="bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-[32px] px-4 py-3 shadow-2xl shadow-slate-900/40">
          <div className="flex justify-between items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <motion.button
                  key={item.id}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setActiveTab(item.id as Tab);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="relative flex flex-col items-center justify-center flex-1 py-1 group h-full"
                >
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-1 bg-emerald-500/10 rounded-2xl flex items-center justify-center overflow-hidden"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                      >
                        {item.id === 'home' && (
                          <motion.div
                            animate={{ 
                              rotate: [0, -10, 10, -10, 10, 0],
                              scale: [1, 1.1, 1]
                            }}
                            transition={{ 
                              duration: 0.5,
                              repeat: Infinity,
                              repeatDelay: 2
                            }}
                            className="text-emerald-500/10 pointer-events-none"
                          >
                            <Sparkles size={40} />
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <div className={`relative z-10 transition-all duration-300 ${
                    isActive ? 'text-emerald-500 scale-110' : 'text-slate-500'
                  }`}>
                    <Icon size={isActive ? 22 : 20} strokeWidth={isActive ? 3 : 2} />
                  </div>
                  <span className={`relative z-10 text-[9px] font-black uppercase tracking-widest transition-colors duration-300 mt-0.5 ${
                    isActive ? 'text-emerald-500' : 'text-slate-500'
                  }`}>
                    {item.label === 'Lições Interativas' ? 'Lições' : 
                     item.label === 'Acervo Digital' ? 'Acervo' :
                     item.label === 'Início' ? 'Home' :
                     item.label}
                  </span>

                  {isActive && (
                    <motion.div 
                      layoutId="navDot"
                      className="absolute -bottom-1 w-1 h-1 bg-emerald-500 rounded-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow overflow-x-hidden w-full relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="w-full h-full"
          >
            {activeTab === 'home' && (
              <Hero 
                onStart={() => setActiveTab('lessons')} 
                onNavigate={(tab) => setActiveTab(tab as Tab)}
                stats={userStats}
              />
            )}
            {activeTab === 'lessons' && (
              <div>
                <div className="max-w-7xl mx-auto px-6 pt-12 flex justify-center">
                  <div className="bg-white p-1.5 rounded-2xl border border-slate-200 flex gap-1 md:gap-2 shadow-sm overflow-x-auto no-scrollbar max-w-full">
                    <button 
                      onClick={() => setActiveContent('lessons')}
                      className={`px-4 md:px-6 py-2 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap ${activeContent === 'lessons' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                      Lições
                    </button>
                    <button 
                      onClick={() => setActiveContent('flashcards')}
                      className={`px-4 md:px-6 py-2 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap ${activeContent === 'flashcards' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                      Flashcards
                    </button>
                  </div>
                </div>
                
                {activeContent === 'lessons' ? (
                  <Lessons 
                    completedLessons={completedLessons} 
                    downloadedLessons={downloadedLessons}
                    isOnline={isOnline}
                    onComplete={handleLessonComplete}
                    onAddToFlashcards={handleAddFlashcard}
                    onDownload={handleDownloadLesson}
                    onBackToHome={() => setActiveTab('home')}
                    soundEnabled={notificationSettings.soundEnabled}
                  />
                ) : (
                  <Flashcards 
                    cards={flashcards} 
                    onAddCard={handleAddFlashcard}
                    onUpdateCard={handleUpdateFlashcard}
                    onDeleteCard={handleDeleteFlashcard}
                    onAwardPoints={awardPoints}
                    soundEnabled={notificationSettings.soundEnabled}
                  />
                )}
              </div>
            )}
            {activeTab === 'library' && (
              <LibrarySection 
                onAddFlashcard={handleAddFlashcard} 
                onNavigate={(tab, content) => {
                  setActiveTab(tab as Tab);
                  if (content) setActiveContent(content);
                }} 
              />
            )}
            {activeTab === 'dashboard' && (
              <Dashboard 
                stats={userStats} 
                allBadges={BADGES} 
                settings={notificationSettings}
                onUpdateSettings={setNotificationSettings}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Dictionary Tool */}
      <DictionarySearch onAddFlashcard={handleAddFlashcard} />

      {/* Notifications */}
      <NotificationCenter 
        notifications={notifications}
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onMarkAsRead={markNotificationAsRead}
        onClearAll={clearNotifications}
      />

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-emerald-900/20 pt-24 pb-12 text-slate-400 relative overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="space-y-6 md:col-span-1 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white border border-emerald-900/20 rounded-xl flex items-center justify-center text-emerald-500 shadow-xl shadow-emerald-900/40 transform rotate-3">
                  <Star size={20} className="fill-current" />
                </div>
                <span className="font-black text-2xl text-white tracking-tighter text-left">Esperanto<span className="text-emerald-500 italic">Lernu</span></span>
              </div>
              <p className="text-sm leading-relaxed text-slate-400 font-medium max-w-xs">
                A tecnologia aproximando o mundo através da língua da paz. Projeto open-source para a comunidade global.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Navegação
              </h4>
              <ul className="space-y-4 text-sm font-bold">
                <li><button onClick={() => setActiveTab('home')} className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left">Início</button></li>
                <li><button onClick={() => setActiveTab('lessons')} className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left">Lições</button></li>
                <li><button onClick={() => setActiveTab('library')} className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left">Acervo</button></li>
                <li><button onClick={() => setActiveTab('dashboard')} className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left">Dashboard</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                Comunidade
              </h4>
              <ul className="space-y-4 text-sm font-bold">
                <li>
                  <a href="https://lernu.net" target="_blank" rel="noreferrer" className="text-slate-300 hover:text-white transition-colors flex items-center group">
                    Lernu.net <ExternalLink size={14} className="ml-2 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  </a>
                </li>
                <li>
                  <a href="https://esperanto.org.br" target="_blank" rel="noreferrer" className="text-slate-300 hover:text-white transition-colors flex items-center group">
                    Brazila Esperanto-Ligo <ExternalLink size={14} className="ml-2 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  </a>
                </li>
              </ul>
            </div>

            <div className="flex flex-col justify-start">
              <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                Filosofia
              </h4>
              <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800/50">
                <p className="text-xs italic leading-relaxed text-slate-300">
                  "O Esperanto não é apenas uma língua; é um instrumento de entendimento mútuo para um mundo sem fronteiras."
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="w-6 h-px bg-slate-700" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">L. L. Zamenhof</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-10 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] text-slate-500">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded">V2.4</span>
              <span>© 2026 Esperanto Lernu Foundation</span>
            </div>
            <div className="text-emerald-500 hover:text-emerald-400 transition-colors italic normal-case text-sm font-medium tracking-normal text-center">
              Jen la lingvo, kiun mi amas.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

