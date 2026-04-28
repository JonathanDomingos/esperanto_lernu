import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Library, LayoutDashboard, ChevronRight, X, Sparkles } from 'lucide-react';

interface Step {
  title: string;
  description: string;
  icon: React.ReactNode;
  bgColor: string;
}

const STEPS: Step[] = [
  {
    title: 'Bem-vindo ao Esperanto Hub!',
    description: 'Sua jornada para aprender a língua internacional mais falada no mundo começa aqui. Vamos conhecer as ferramentas disponíveis?',
    icon: <Sparkles className="text-emerald-500" size={48} />,
    bgColor: 'bg-emerald-50'
  },
  {
    title: 'Aprenda com Lições',
    description: 'Domine o básico com trilhas de aprendizado interativas e pratique o que aprendeu criando seus próprios flashcards.',
    icon: <BookOpen className="text-blue-500" size={48} />,
    bgColor: 'bg-blue-50'
  },
  {
    title: 'Biblioteca de Recursos',
    description: 'Explore uma curadoria de cursos, vídeos e comunidades, além de um glossário completo para expandir seu vocabulário.',
    icon: <Library className="text-indigo-500" size={48} />,
    bgColor: 'bg-indigo-50'
  },
  {
    title: 'Seu Painel Pessoal',
    description: 'Acompanhe seu progresso, revise seus flashcards e veja suas estatísticas de aprendizado crescerem dia após dia.',
    icon: <LayoutDashboard className="text-purple-500" size={48} />,
    bgColor: 'bg-purple-50'
  }
];

export function Onboarding({ onFinish }: { onFinish: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setIsVisible(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      finish();
    }
  };

  const finish = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setIsVisible(false);
    onFinish();
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-white rounded-[40px] shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100"
        >
          <div className="relative p-10 pt-16">
            <button
              onClick={finish}
              className="absolute top-6 right-6 p-2 text-slate-300 hover:text-slate-600 transition-colors"
            >
              <X size={24} />
            </button>

            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col items-center text-center"
            >
              <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-8 ${STEPS[currentStep].bgColor}`}>
                {STEPS[currentStep].icon}
              </div>

              <h2 className="text-3xl font-black text-slate-900 mb-4 leading-tight">
                {STEPS[currentStep].title}
              </h2>

              <p className="text-slate-500 font-medium leading-relaxed mb-10 text-lg">
                {STEPS[currentStep].description}
              </p>
            </motion.div>

            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 transition-all duration-300 rounded-full ${
                      i === currentStep ? 'w-8 bg-emerald-500' : 'w-2 bg-slate-200'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
              >
                {currentStep === STEPS.length - 1 ? 'Começar Agora' : 'Próximo'}
                <ChevronRight size={20} strokeWidth={3} />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
