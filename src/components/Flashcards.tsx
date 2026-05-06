import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, RotateCcw, ChevronLeft, ChevronRight, Check, X, Sparkles, Search, Shuffle } from 'lucide-react';
import { Flashcard } from '../types';
import { soundService } from '../services/soundService';

interface FlashcardsProps {
  cards: Flashcard[];
  onAddCard: (front: string, back: string, category?: string) => void;
  onUpdateCard: (card: Flashcard) => void;
  onDeleteCard: (id: string) => void;
  onAwardPoints: (amount: number) => void;
  soundEnabled?: boolean;
}

export function Flashcards({ cards, onAddCard, onUpdateCard, onDeleteCard, onAwardPoints, soundEnabled }: FlashcardsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');
  const [newCategory, setNewCategory] = useState('Geral');
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [practiceMode, setPracticeMode] = useState(false);
  const [isQuickReview, setIsQuickReview] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [lastResult, setLastResult] = useState<'correct' | 'incorrect' | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [shuffleOrder, setShuffleOrder] = useState(true);
  const [sideMode, setSideMode] = useState<'front' | 'back' | 'random'>('front');
  const [nextIsSuggestion, setNextIsSuggestion] = useState(false);
  const [sessionCards, setSessionCards] = useState<any[]>([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [initialSessionSize, setInitialSessionSize] = useState(0);
  const [cardToDelete, setCardToDelete] = useState<string | null>(null);
  const [hasSavedSession, setHasSavedSession] = useState(false);

  const now = Date.now();
  const dueCards = cards.filter(c => !c.nextReview || c.nextReview <= now);

  // Check for saved session
  const checkSavedSession = () => {
    const saved = localStorage.getItem('flashcards_session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.sessionCards && parsed.sessionCards.length > 0) {
          setHasSavedSession(true);
          return true;
        }
      } catch (e) {
        localStorage.removeItem('flashcards_session');
      }
    }
    setHasSavedSession(false);
    return false;
  };

  // Load saved session on mount and when practiceMode changes
  React.useEffect(() => {
    checkSavedSession();
  }, [practiceMode]);

  // Save session state to localStorage
  React.useEffect(() => {
    if (practiceMode && !showSummary && sessionCards.length > 0) {
      localStorage.setItem('flashcards_session', JSON.stringify({
        sessionCards,
        currentIndex,
        correctCount,
        incorrectCount,
        reviewCount,
        initialSessionSize,
        isQuickReview,
        sideMode,
        shuffleOrder,
        isFlipped,
        timestamp: Date.now()
      }));
    }
  }, [practiceMode, showSummary, sessionCards, currentIndex, correctCount, incorrectCount, reviewCount, initialSessionSize, isQuickReview, sideMode, shuffleOrder, isFlipped]);
  
  const categories = ['Todos', ...Array.from(new Set(cards.map(c => c.category || 'Geral')))];
  
  const filteredCards = cards.filter(c => {
    const matchesCategory = selectedCategory === 'Todos' || (c.category || 'Geral') === selectedCategory;
    const matchesSearch = c.front.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.back.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const startPractice = () => {
    if (filteredCards.length === 0) return;
    
    // Clear any previous session immediately when starting a new one
    localStorage.removeItem('flashcards_session');
    setHasSavedSession(false);

    let prepared = filteredCards.map(c => {
      const showFrontFirst = sideMode === 'random' ? Math.random() > 0.5 : sideMode === 'front';
      return {
        ...c,
        displayFront: showFrontFirst ? c.front : c.back,
        displayBack: showFrontFirst ? c.back : c.front,
        frontLabel: showFrontFirst ? (c.category || 'Esperanto') : 'Português',
        backLabel: showFrontFirst ? 'Português' : (c.category || 'Esperanto')
      };
    });

    if (shuffleOrder) {
      prepared = [...prepared].sort(() => Math.random() - 0.5);
    }

    setIsQuickReview(false);
    setSessionCards(prepared);
    setInitialSessionSize(prepared.length);
    setReviewCount(0);
    setCurrentIndex(0);
    setCorrectCount(0);
    setIncorrectCount(0);
    setShowSummary(false);
    setPracticeMode(true);
    setShowConfig(false);
    setLastResult(null);
  };

  const resumePractice = () => {
    const saved = localStorage.getItem('flashcards_session');
    if (!saved) return;
    
    try {
      const p = JSON.parse(saved);
      setSessionCards(p.sessionCards);
      setCurrentIndex(p.currentIndex);
      setCorrectCount(p.correctCount);
      setIncorrectCount(p.incorrectCount);
      setReviewCount(p.reviewCount);
      setInitialSessionSize(p.initialSessionSize);
      setIsQuickReview(p.isQuickReview);
      setSideMode(p.sideMode || 'front');
      setShuffleOrder(p.shuffleOrder !== undefined ? p.shuffleOrder : true);
      setIsFlipped(p.isFlipped || false);
      
      setPracticeMode(true);
      setShowSummary(false);
      setLastResult(null);
      setHasSavedSession(false);
    } catch (e) {
      localStorage.removeItem('flashcards_session');
      setHasSavedSession(false);
    }
  };

  const startQuickReview = () => {
    const reviewedCards = cards.filter(c => c.lastReview && (!c.nextReview || c.nextReview <= now));
    const newCards = cards.filter(c => !c.lastReview);
    
    // Priority: Lower easeFactor cards first (they are harder)
    let toReview = [...reviewedCards].sort((a, b) => (a.easeFactor || 2.5) - (b.easeFactor || 2.5)).slice(0, 5);
    let toLearn = [...newCards].sort(() => Math.random() - 0.5).slice(0, 3);
    
    const combined = [...toReview, ...toLearn].sort(() => Math.random() - 0.5);
    
    if (combined.length === 0) return;

    const prepared = combined.map(c => ({
      ...c,
      displayFront: c.front,
      displayBack: c.back,
      frontLabel: c.category || 'Esperanto',
      backLabel: 'Português'
    }));

    setIsQuickReview(true);
    setSessionCards(prepared);
    setInitialSessionSize(prepared.length);
    setReviewCount(0);
    setCurrentIndex(0);
    setCorrectCount(0);
    setIncorrectCount(0);
    setShowSummary(false);
    setPracticeMode(true);
    setShowConfig(false);
    setLastResult(null);
  };

  const handleAdd = () => {
    if (!newFront.trim() || !newBack.trim()) {
      setError('Por favor, preencha tanto a frente quanto o verso do cartão.');
      if (soundEnabled) soundService.playIncorrect();
      return;
    }

    onAddCard(newFront, newBack, newCategory.trim() || 'Geral');
    setNewFront('');
    setNewBack('');
    setNewCategory('Geral');
    setError(null);
    setIsAdding(false);
  };

  const nextCard = (correct: boolean) => {
    setLastResult(correct ? 'correct' : 'incorrect');
    
    // Spaced Repetition Logic (SM-2 Simplified)
    const card = sessionCards[currentIndex];
    const newCardData = { ...card };
    
    // Quality mapping for SM-2 (0-5)
    // 5 = Perfect, 4 = Correct (after slight hesitation), 3 = Correct (difficult)
    // 0 = Total blackout
    const quality = correct ? 5 : 0;
    
    if (correct) {
      onAwardPoints(5);
      setCorrectCount(prev => prev + 1);
      if (soundEnabled) soundService.playCorrect();
      
      let easeFactor = card.easeFactor || 2.5;
      let reps = (card.reps || 0);
      let interval = card.interval || 0;
      
      // Standard SM-2 Algorithm
      if (quality >= 3) {
        if (reps === 0) {
          interval = 1;
        } else if (reps === 1) {
          interval = 6;
        } else {
          interval = Math.round(interval * easeFactor);
        }
        reps++;
      } else {
        reps = 0;
        interval = 1;
      }
      
      // Update ease factor
      easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
      easeFactor = Math.max(1.3, easeFactor);
      
      newCardData.reps = reps;
      newCardData.interval = interval;
      newCardData.easeFactor = easeFactor;
      newCardData.lastReview = Date.now();
      newCardData.nextReview = Date.now() + interval * 24 * 60 * 60 * 1000;
    } else {
      setIncorrectCount(prev => prev + 1);
      setReviewCount(prev => prev + 1);
      if (soundEnabled) soundService.playIncorrect();
      
      let easeFactor = card.easeFactor || 2.5;
      // Drop ease factor on incorrect
      easeFactor = Math.max(1.3, easeFactor - 0.2);

      newCardData.reps = 0;
      newCardData.interval = 1;
      newCardData.easeFactor = easeFactor;
      newCardData.lastReview = Date.now();
      newCardData.nextReview = Date.now() + 1 * 60 * 60 * 1000; // Review in 1 hour if totally failed

      // QUEUE FOR RE-STUDY: Add same card to the end of currently active session
      setSessionCards(prev => [...prev, card]);
    }

    // Call onUpdateCard to persist changes
    onUpdateCard(newCardData);

    setIsFlipped(false);
    setTimeout(() => {
      setLastResult(null);
      setNextIsSuggestion(false);
      
      if (currentIndex === sessionCards.length - 1) {
        setShowSummary(true);
        onAwardPoints(20); // Bonus for finishing session
        localStorage.removeItem('flashcards_session');
      } else {
        // Maintain flow: suggest next card of similar category or difficulty
        if (correct) {
          const nextIndex = currentIndex + 1;
          const remaining = sessionCards.slice(nextIndex);
          const currentCard = sessionCards[currentIndex];
          
          let bestIdx = -1;
          let maxScore = -1;
          
          remaining.forEach((card, idx) => {
            let score = 0;
            // Primary matches: Category
            if (card.category && currentCard.category && card.category === currentCard.category) {
              score += 50;
            }
            
            // Secondary match: Similar difficulty (easeFactor)
            const cardEase = card.easeFactor || 2.5;
            const currentEase = currentCard.easeFactor || 2.5;
            const easeDiff = Math.abs(cardEase - currentEase);
            score += (1 - easeDiff) * 20;

            if (score > maxScore) {
              maxScore = score;
              bestIdx = idx;
            }
          });

          // If we found a better candidate that isn't the immediate next card
          if (bestIdx > 0 && maxScore > 30) {
            const newSession = [...sessionCards];
            const bestCard = newSession.splice(nextIndex + bestIdx, 1)[0];
            newSession.splice(nextIndex, 0, bestCard);
            setSessionCards(newSession);
            setNextIsSuggestion(true);
          }
        }
        
        setCurrentIndex((prev) => prev + 1);
      }
    }, 400);
  };

  if (practiceMode && sessionCards.length > 0) {
    if (showSummary) {
      return (
        <div className="max-w-2xl mx-auto py-12 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bento-card p-8 md:p-12 bg-white"
          >
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <RotateCcw size={32} />
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-2">Treino Concluído!</h2>
            <p className="text-slate-500 font-medium mb-10">Veja como você se saiu nesta sessão.</p>

            <div className="grid grid-cols-2 gap-6 mb-12">
              <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                <Check className="text-emerald-500 mx-auto mb-2" size={24} />
                <span className="block text-3xl font-black text-emerald-700">{correctCount}</span>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-600/60">Corretos</span>
              </div>
              <div className="p-6 bg-red-50 rounded-3xl border border-red-100">
                <X className="text-red-500 mx-auto mb-2" size={24} />
                <span className="block text-3xl font-black text-red-700">{incorrectCount}</span>
                <span className="text-xs font-bold uppercase tracking-widest text-red-600/60">Errados</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={startPractice}
                className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw size={18} /> Tentar Novamente
              </button>
              <button 
                onClick={() => {
                  setPracticeMode(false);
                  localStorage.removeItem('flashcards_session');
                }}
                className="px-10 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
              >
                Voltar ao Baralho
              </button>
            </div>
          </motion.div>
        </div>
      );
    }

    const totalAnswered = correctCount; // Only count correctly answered as completed in the flow
    const progress = (totalAnswered / initialSessionSize) * 100;
    const card = sessionCards[currentIndex];

    return (
      <div className="max-w-2xl mx-auto py-12">
        <div className="flex flex-col gap-6 mb-12">
          <div className="flex justify-between items-center">
            <button 
              onClick={() => setPracticeMode(false)}
              className="flex items-center text-slate-500 hover:text-slate-900 font-bold transition-colors"
            >
              <ChevronLeft size={20} /> Sair do Treino
            </button>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600/50 leading-none mb-1">Aprendidos</span>
                  <span className="flex items-center gap-1.5 text-emerald-600 font-black text-lg leading-none">
                    <Check size={18} className="translate-y-[-1px]" /> {correctCount}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-500/50 leading-none mb-1">Revisões</span>
                  <span className="flex items-center gap-1.5 text-amber-500 font-black text-lg leading-none">
                    <RotateCcw size={16} className="translate-y-[-1px]" /> {reviewCount}
                  </span>
                </div>
              </div>
              <div className="h-8 w-px bg-slate-100" />
              <div className="text-right">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1 block">Faltam</span>
                <span className="text-slate-900 font-black text-lg leading-none block">
                  {Math.max(0, initialSessionSize - correctCount)}
                </span>
              </div>
            </div>
          </div>

          <div className="relative w-full h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            />
            {sessionCards.map((_, idx) => (
              <div 
                key={idx}
                className="absolute top-0 h-full w-px bg-white/20 z-10"
                style={{ left: `${(idx / sessionCards.length) * 100}%` }}
              />
            ))}
          </div>
        </div>

        <div className="perspective-1000 h-[400px] cursor-pointer relative" onClick={() => setIsFlipped(!isFlipped)}>
          <AnimatePresence>
            {lastResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.5 }}
                className={`absolute inset-0 z-50 flex items-center justify-center rounded-[2.5rem] pointer-events-none ${
                    lastResult === 'correct' ? 'bg-emerald-500/20' : 'bg-red-500/20'
                }`}
              >
                <div className={`p-6 rounded-full bg-white shadow-2xl ${
                    lastResult === 'correct' ? 'text-emerald-500' : 'text-red-500'
                }`}>
                  {lastResult === 'correct' ? <Check size={48} /> : <X size={48} />}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            className="relative w-full h-full transition-all duration-500 preserve-3d"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
          >
            {/* Front */}
            <div className={`absolute inset-0 bento-card flex flex-col items-center justify-center p-8 text-center backface-hidden overflow-hidden transition-colors ${
              lastResult === 'correct' ? 'bg-emerald-50 border-emerald-200' : lastResult === 'incorrect' ? 'bg-red-50 border-red-200' : 'bg-white'
            }`}>
              {card.imageUrl && (
                <div className="absolute inset-0 z-0">
                  <img 
                    src={card.imageUrl} 
                    alt={card.displayFront}
                    className="w-full h-full object-cover opacity-20 grayscale"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-white/60" />
                </div>
              )}
              <div className="relative z-10 flex flex-col items-center max-h-full overflow-y-auto px-4 custom-scrollbar">
                <span className="bento-label mb-6 flex items-center gap-2">
                  {card.frontLabel}
                  {card.imageUrl && <Sparkles size={10} className="text-emerald-500 fill-current" title="Visual por IA" />}
                  {nextIsSuggestion && (
                    <motion.span 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="ml-2 px-2 py-0.5 bg-amber-50 text-amber-600 border border-amber-100 rounded-full text-[8px] font-black uppercase tracking-tight flex items-center gap-1 shadow-sm"
                    >
                      <Shuffle size={8} /> Sugestão de Fluxo
                    </motion.span>
                  )}
                </span>
                <h3 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight break-words">{card.displayFront}</h3>
                <p className="mt-12 text-slate-400 text-xs font-bold tracking-widest uppercase mb-4">Clique para revelar</p>
              </div>
            </div>

            {/* Back */}
            <div className="absolute inset-0 bento-card flex flex-col items-center justify-center p-8 md:p-12 text-center backface-hidden rotate-y-180 bg-emerald-50 border-emerald-200 overflow-y-auto custom-scrollbar">
              <span className="bento-label text-emerald-600 mb-4">{card.backLabel}</span>
              <h3 className="text-3xl md:text-4xl font-bold text-emerald-900 break-words">{card.displayBack}</h3>
              <p className="mt-8 text-emerald-600/60 text-sm">Continuar aprendendo</p>
            </div>
          </motion.div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-6">
          <div className="flex justify-center gap-6 w-full">
            <button 
              disabled={!!lastResult}
              onClick={() => nextCard(false)}
              className="flex-1 max-w-[200px] h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center gap-2 text-slate-500 hover:text-amber-600 hover:border-amber-200 transition-all shadow-sm active:scale-95 disabled:opacity-50 font-bold"
            >
              <RotateCcw size={20} /> Preciso Revisar
            </button>
            <button 
              disabled={!!lastResult}
              onClick={() => nextCard(true)}
              className="flex-1 max-w-[200px] h-16 rounded-2xl bg-emerald-600 flex items-center justify-center gap-2 text-white hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 active:scale-95 disabled:opacity-50 font-bold"
            >
              <Check size={20} /> Aprendido
            </button>
          </div>
          <p className="text-slate-400 text-xs font-medium italic">
            Cards marcados para revisão reaparecerão no final desta sessão.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h2 className="text-5xl font-bold text-slate-900 mb-4">Seu Baralho</h2>
          <p className="text-slate-500 font-medium">Memorize vocabulário com repetição espaçada.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          {hasSavedSession && (
            <button 
              onClick={resumePractice}
              className="px-8 py-3 bg-amber-50 text-amber-600 border-2 border-amber-200 rounded-2xl font-bold hover:bg-amber-600 hover:text-white transition-all flex items-center gap-2"
            >
              <RotateCcw size={18} /> Continuar Treino
            </button>
          )}

          <div className="relative group">
            <button 
              onClick={startQuickReview}
              disabled={cards.length === 0}
              className="px-8 py-3 bg-white text-slate-900 border-2 border-slate-900 rounded-2xl font-bold hover:bg-slate-900 hover:text-white transition-all flex items-center gap-2 relative overflow-hidden disabled:opacity-50 h-full"
            >
              <div className="absolute inset-0 bg-emerald-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <RotateCcw size={18} className="relative z-10" /> 
              <span className="relative z-10">Revisão Rápida</span>
            </button>
            {dueCards.length > 0 && (
              <div className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white font-bold ring-2 ring-white shadow-lg z-20 animate-bounce cursor-default">
                {dueCards.length}
              </div>
            )}
          </div>
          
          {filteredCards.length > 0 && (
            <button 
              onClick={() => setShowConfig(true)}
              className="px-8 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-emerald-600 hover:text-white transition-all flex items-center gap-2"
            >
              <Sparkles size={18} /> Estudar Baralho
            </button>
          )}
          <button 
            onClick={() => {
              setIsAdding(true);
              setError(null);
            }}
            className="px-8 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-lg shadow-emerald-600/20"
          >
            <Plus size={18} /> Novo Card
          </button>
        </div>
      </div>

      {cards.length > 0 && (
        <div className="space-y-6 mb-10 pb-4 border-b border-slate-100">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Buscar no meu baralho..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 transition-all font-medium text-sm shadow-sm"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  selectedCategory === cat 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' 
                    : 'bg-white text-slate-400 hover:text-slate-600 border border-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {cardToDelete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm"
          >
            <div className="bento-card p-8 bg-white max-w-sm w-full shadow-2xl text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Trash2 size={28} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Excluir Card?</h3>
              <p className="text-slate-500 mb-8 font-medium">Esta ação não pode ser desfeita. Você perderá este item do seu baralho.</p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setCardToDelete(null)}
                  className="flex-1 px-6 py-3 bg-slate-100 text-slate-500 rounded-xl font-bold hover:bg-slate-200 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => {
                    if (cardToDelete) {
                      onDeleteCard(cardToDelete);
                      setCardToDelete(null);
                    }
                  }}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {showConfig && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm"
          >
            <div className="bento-card p-8 bg-white max-w-md w-full shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                  <Shuffle size={24} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Configurar Treino</h3>
              </div>

              <div className="space-y-6 mb-8">
                <div>
                  <label className="bento-label mb-3 block text-slate-500">Ordem dos Cards</label>
                  <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={shuffleOrder}
                      onChange={(e) => setShuffleOrder(e.target.checked)}
                      className="w-5 h-5 accent-emerald-500"
                    />
                    <span className="font-bold text-slate-700">Embaralhar ordem</span>
                  </label>
                </div>

                <div>
                  <label className="bento-label mb-3 block text-slate-500">Lado Inicial</label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { id: 'front', label: 'Esperanto Primeiro' },
                      { id: 'back', label: 'Português Primeiro' },
                      { id: 'random', label: 'Misturado (Aleatório)' }
                    ].map(option => (
                      <label 
                        key={option.id}
                        className={`flex items-center gap-3 p-4 rounded-2xl cursor-pointer border-2 transition-all ${
                          sideMode === option.id 
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-700' 
                            : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'
                        }`}
                      >
                        <input 
                          type="radio" 
                          name="sideMode"
                          checked={sideMode === option.id}
                          onChange={() => setSideMode(option.id as any)}
                          className="hidden"
                        />
                        <span className="font-bold">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setShowConfig(false)}
                  className="flex-1 px-6 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  onClick={startPractice}
                  className="flex-1 px-6 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
                >
                  Começar
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bento-card p-8 mb-12 bg-slate-50"
          >
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="bento-label mb-2 block">Frente (Esperanto)</label>
                <input 
                  type="text" 
                  value={newFront}
                  onChange={(e) => {
                    setNewFront(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Ex: Verda Birdo"
                  className={`w-full p-4 bg-white border rounded-2xl outline-none transition-all font-bold ${
                    error && !newFront.trim() ? 'border-red-500 bg-red-50 focus:border-red-600' : 'border-slate-200 focus:border-emerald-500'
                  }`}
                />
              </div>
              <div>
                <label className="bento-label mb-2 block">Verso (Português)</label>
                <input 
                  type="text" 
                  value={newBack}
                  onChange={(e) => {
                    setNewBack(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Ex: Pássaro Verde"
                  className={`w-full p-4 bg-white border rounded-2xl outline-none transition-all font-bold ${
                    error && !newBack.trim() ? 'border-red-500 bg-red-50 focus:border-red-600' : 'border-slate-200 focus:border-emerald-500'
                  }`}
                />
              </div>
              <div className="md:col-span-2">
                <label className="bento-label mb-2 block">Categoria</label>
                <input 
                  type="text" 
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Ex: Natureza, Viagem, Geral..."
                  className="w-full p-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 transition-colors font-bold"
                />
              </div>
            </div>
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold shadow-sm"
                >
                  <X size={18} className="shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setIsAdding(false)}
                className="px-6 py-2 text-slate-500 font-bold hover:text-slate-900"
              >
                Cancelar
              </button>
              <button 
                onClick={handleAdd}
                className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold"
              >
                Salvar Card
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {cards.length === 0 ? (
        <div className="bento-card p-10 md:p-20 text-center flex flex-col items-center justify-center bg-white">
          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 mb-6">
            <Sparkles size={32} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Seu baralho está vazio</h3>
          <p className="text-slate-400 max-w-sm mx-auto">Adicione cards manualmente ou complete lições para gerar sugestões de estudo.</p>
        </div>
      ) : filteredCards.length === 0 ? (
        <div className="bento-card p-10 md:p-20 text-center flex flex-col items-center justify-center bg-white">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-4">
            <Search size={24} />
          </div>
          <p className="text-slate-400 font-medium">Nenhum card encontrado com esses filtros.</p>
          <button 
            onClick={() => { setSelectedCategory('Todos'); setSearchQuery(''); }}
            className="mt-4 text-emerald-600 font-bold hover:underline"
          >
            Limpar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCards.map((card) => (
            <motion.div 
              key={card.id}
              layout
              className="bento-card p-6 pb-12 flex flex-col justify-between group min-h-64 relative overflow-hidden"
            >
              {card.imageUrl && (
                <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <img 
                    src={card.imageUrl} 
                    alt={card.front}
                    className="w-full h-full object-cover rounded-full rotate-12"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bento-label text-[8px]">{card.category || 'Esperanto'}</span>
                  {card.imageUrl && <Sparkles size={8} className="text-emerald-500" />}
                  {(!card.nextReview || card.nextReview <= now) && (
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" title="Pronto para revisão" />
                  )}
                </div>
                <p className="text-xl font-bold text-slate-900">{card.front}</p>
                <div className="mt-4 pt-4 border-t border-slate-50">
                  <span className="bento-label text-[8px] text-emerald-600">Tradução</span>
                  <p className="text-slate-500 font-medium break-words">{card.back}</p>
                </div>
              </div>
              <button 
                onClick={() => setCardToDelete(card.id)}
                className="self-end p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 relative z-20"
              >
                <Trash2 size={16} />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
