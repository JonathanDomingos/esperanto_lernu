import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, RotateCcw, ChevronLeft, ChevronRight, Check, X, Sparkles, Search } from 'lucide-react';
import { Flashcard } from '../types';
import { soundService } from '../services/soundService';

interface FlashcardsProps {
  cards: Flashcard[];
  onAddCard: (front: string, back: string, category?: string) => void;
  onDeleteCard: (id: string) => void;
  onAwardPoints: (amount: number) => void;
  soundEnabled?: boolean;
}

export function Flashcards({ cards, onAddCard, onDeleteCard, onAwardPoints, soundEnabled }: FlashcardsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');
  const [newCategory, setNewCategory] = useState('Geral');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [practiceMode, setPracticeMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [lastResult, setLastResult] = useState<'correct' | 'incorrect' | null>(null);

  const categories = ['Todos', ...Array.from(new Set(cards.map(c => c.category || 'Geral')))];
  
  const filteredCards = cards.filter(c => {
    const matchesCategory = selectedCategory === 'Todos' || (c.category || 'Geral') === selectedCategory;
    const matchesSearch = c.front.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.back.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const startPractice = () => {
    if (filteredCards.length === 0) return;
    setCurrentIndex(0);
    setCorrectCount(0);
    setIncorrectCount(0);
    setShowSummary(false);
    setPracticeMode(true);
    setLastResult(null);
  };

  const handleAdd = () => {
    if (newFront.trim() && newBack.trim()) {
      onAddCard(newFront, newBack, newCategory.trim() || 'Geral');
      setNewFront('');
      setNewBack('');
      setNewCategory('Geral');
      setIsAdding(false);
    }
  };

  const nextCard = (correct: boolean) => {
    setLastResult(correct ? 'correct' : 'incorrect');
    if (correct) {
      onAwardPoints(5);
      setCorrectCount(prev => prev + 1);
      if (soundEnabled) soundService.playCorrect();
    } else {
      setIncorrectCount(prev => prev + 1);
      if (soundEnabled) soundService.playIncorrect();
    }

    setIsFlipped(false);
    setTimeout(() => {
      setLastResult(null);
      if (currentIndex === filteredCards.length - 1) {
        setShowSummary(true);
        onAwardPoints(20); // Bonus for finishing session
      } else {
        setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
      }
    }, 400);
  };

  if (practiceMode && filteredCards.length > 0) {
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
                onClick={() => setPracticeMode(false)}
                className="px-10 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
              >
                Voltar ao Baralho
              </button>
            </div>
          </motion.div>
        </div>
      );
    }

    const totalAnswered = correctCount + incorrectCount;
    const progress = (totalAnswered / filteredCards.length) * 100;
    const card = filteredCards[currentIndex];

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
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600/50 leading-none mb-1">Corretos</span>
                  <span className="flex items-center gap-1.5 text-emerald-600 font-black text-lg leading-none">
                    <Check size={18} className="translate-y-[-1px]" /> {correctCount}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black uppercase tracking-widest text-red-500/50 leading-none mb-1">Errados</span>
                  <span className="flex items-center gap-1.5 text-red-500 font-black text-lg leading-none">
                    <X size={18} className="translate-y-[-1px]" /> {incorrectCount}
                  </span>
                </div>
              </div>
              <div className="h-8 w-px bg-slate-100" />
              <div className="text-right">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1 block">Progresso</span>
                <span className="text-slate-900 font-black text-lg leading-none block">
                  {currentIndex + 1} <span className="text-slate-300">/</span> {filteredCards.length}
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
            {filteredCards.map((_, idx) => (
              <div 
                key={idx}
                className="absolute top-0 h-full w-px bg-white/20 z-10"
                style={{ left: `${(idx / filteredCards.length) * 100}%` }}
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
                    alt={card.front}
                    className="w-full h-full object-cover opacity-20 grayscale"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-white/60" />
                </div>
              )}
              <div className="relative z-10 flex flex-col items-center">
                <span className="bento-label mb-6 flex items-center gap-2">
                  {card.category || 'Esperanto'}
                  {card.imageUrl && <Sparkles size={10} className="text-emerald-500 fill-current" title="Visual por IA" />}
                </span>
                <h3 className="text-5xl font-bold text-slate-900 tracking-tight">{card.front}</h3>
                <p className="mt-12 text-slate-400 text-xs font-bold tracking-widest uppercase">Clique para revelar</p>
              </div>
            </div>

            {/* Back */}
            <div className="absolute inset-0 bento-card flex flex-col items-center justify-center p-8 md:p-12 text-center backface-hidden rotate-y-180 bg-emerald-50 border-emerald-200">
              <span className="bento-label text-emerald-600 mb-4">Português</span>
              <h3 className="text-4xl font-bold text-emerald-900">{card.back}</h3>
              <p className="mt-8 text-emerald-600/60 text-sm">Continuar aprendendo</p>
            </div>
          </motion.div>
        </div>

        <div className="mt-12 flex justify-center gap-6">
          <button 
            disabled={!!lastResult}
            onClick={() => nextCard(false)}
            className="w-16 h-16 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-200 transition-all shadow-sm disabled:opacity-50"
          >
            <X size={24} />
          </button>
          <button 
            disabled={!!lastResult}
            onClick={() => nextCard(true)}
            className="w-16 h-16 rounded-full bg-emerald-600 flex items-center justify-center text-white hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 disabled:opacity-50"
          >
            <Check size={24} />
          </button>
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
        <div className="flex gap-4">
          {filteredCards.length > 0 && (
            <button 
              onClick={startPractice}
              className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all flex items-center gap-2"
            >
              <RotateCcw size={18} /> Treinar Agora
            </button>
          )}
          <button 
            onClick={() => setIsAdding(true)}
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
                  onChange={(e) => setNewFront(e.target.value)}
                  placeholder="Ex: Verda Birdo"
                  className="w-full p-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 transition-colors font-bold"
                />
              </div>
              <div>
                <label className="bento-label mb-2 block">Verso (Português)</label>
                <input 
                  type="text" 
                  value={newBack}
                  onChange={(e) => setNewBack(e.target.value)}
                  placeholder="Ex: Pássaro Verde"
                  className="w-full p-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 transition-colors font-bold"
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
              className="bento-card p-6 flex flex-col justify-between group h-48 relative overflow-hidden"
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
                </div>
                <p className="text-xl font-bold text-slate-900">{card.front}</p>
                <div className="mt-4 pt-4 border-t border-slate-50">
                  <span className="bento-label text-[8px] text-emerald-600">Tradução</span>
                  <p className="text-slate-500 font-medium">{card.back}</p>
                </div>
              </div>
              <button 
                onClick={() => onDeleteCard(card.id)}
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
