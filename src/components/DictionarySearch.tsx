import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Plus, Book, X } from 'lucide-react';
import { DICTIONARY, DictionaryEntry } from '../data/dictionary';
import { Tooltip } from './ui/Tooltip';

interface DictionarySearchProps {
  onAddFlashcard: (front: string, back: string, category?: string) => void;
  inline?: boolean;
}

export function DictionarySearch({ onAddFlashcard, inline = false }: DictionarySearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return DICTIONARY.filter(entry => 
      entry.word.toLowerCase().includes(lowerQuery) || 
      entry.translation.toLowerCase().includes(lowerQuery)
    ).slice(0, 5);
  }, [query]);

  return (
    <div className={`${inline ? 'w-full' : 'relative z-50'}`}>
      {!inline && (
        <Tooltip content={isOpen ? "Fechar Dicionário" : "Dicionário Rápido"} position="left">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="fixed bottom-32 md:bottom-8 right-6 md:right-8 w-14 h-14 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-emerald-600 transition-all z-50"
          >
            {isOpen ? <X size={24} /> : <Search size={24} />}
          </button>
        </Tooltip>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={inline ? { opacity: 0, y: 10 } : { opacity: 0, scale: 0.9, y: 20 }}
            animate={inline ? { opacity: 1, y: 0 } : { opacity: 1, scale: 1, y: 0 }}
            exit={inline ? { opacity: 0, y: 10 } : { opacity: 0, scale: 0.9, y: 20 }}
            className={`${inline ? 'w-full mt-4' : 'fixed bottom-48 md:bottom-24 left-6 md:left-auto right-6 md:right-8 w-auto md:w-96'} bento-card shadow-2xl p-6 bg-white overflow-hidden`}
          >
            <div className="flex items-center gap-3 mb-4">
              <Book className="text-emerald-500" size={20} />
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Dicionário Esperanto</h3>
            </div>

            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Pesquisar palavra..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 transition-colors font-medium text-sm"
                autoFocus={!inline}
              />
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {results.length > 0 ? (
                results.map((entry) => (
                  <motion.div 
                    key={entry.word}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-xs bento-label text-emerald-600">{entry.category}</span>
                        <h4 className="font-bold text-slate-900 text-lg">{entry.word}</h4>
                      </div>
                      <Tooltip content="Adicionar aos Flashcards" position="left">
                        <button 
                          onClick={() => onAddFlashcard(entry.word, entry.translation, entry.category)}
                          className="p-2 bg-white text-slate-400 hover:text-emerald-600 hover:shadow-sm rounded-xl transition-all"
                        >
                          <Plus size={18} />
                        </button>
                      </Tooltip>
                    </div>
                    <p className="text-slate-600 font-medium text-sm mb-3">{entry.translation}</p>
                    <div className="bg-white/50 p-3 rounded-xl border border-white">
                      <p className="text-[11px] italic text-slate-500 mb-1">"{entry.example}"</p>
                      <p className="text-[10px] text-slate-400">{entry.exampleTranslation}</p>
                    </div>
                  </motion.div>
                ))
              ) : query.trim() ? (
                <div className="text-center py-8">
                  <p className="text-slate-400 text-sm">Nenhuma palavra encontrada.</p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-400 text-xs font-medium">Digite algo para começar a pesquisar no acervo.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
