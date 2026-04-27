import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle, 
  Play, 
  Info, 
  PlusSquare,
  Download,
  Cloud,
  Zap,
  WifiOff,
  Home,
  MessageCircle,
  Users,
  Book,
  Heart,
  Globe,
  Coffee,
  ShoppingBag,
  Plane,
  Stethoscope,
  Briefcase,
  Music,
  Code,
  Smile,
  Mic,
  Star,
  Trophy,
  Share2
} from 'lucide-react';

import { soundService } from '../services/soundService';

const renderPartIcon = (name: string) => {
  switch (name) {
    case 'message': return <MessageCircle size={40} />;
    case 'users': return <Users size={40} />;
    case 'book': return <Book size={40} />;
    case 'heart': return <Heart size={40} />;
    case 'globe': return <Globe size={40} />;
    case 'coffee': return <Coffee size={40} />;
    case 'shopping': return <ShoppingBag size={40} />;
    case 'plane': return <Plane size={40} />;
    case 'health': return <Stethoscope size={40} />;
    case 'work': return <Briefcase size={40} />;
    case 'music': return <Music size={40} />;
    case 'code': return <Code size={40} />;
    case 'smile': return <Smile size={40} />;
    case 'mic': return <Mic size={40} />;
    case 'star': return <Star size={40} />;
    case 'zap': return <Zap size={40} />;
    default: return <Info size={40} />;
  }
};

interface GrammarHotspot {
  term: string;
  explanation: string;
  examples: string[];
}

const GRAMMAR_HOTSPOTS: GrammarHotspot[] = [
  { term: '-o', explanation: 'Sufixo para Substantivos (nomes de coisas, pessoas ou lugares).', examples: ['Domo (Casa)', 'Libro (Livro)', 'Amiko (Amigo)'] },
  { term: '-a', explanation: 'Sufixo para Adjetivos (qualidades ou características).', examples: ['Bela (Belo)', 'Granda (Grande)', 'Feliĉa (Feliz)'] },
  { term: '-e', explanation: 'Sufixo para Advérbios (modo como algo acontece).', examples: ['Rapide (Rapidamente)', 'Bone (Bem)', 'Kune (Juntos)'] },
  { term: '-as', explanation: 'Terminação verbal para o Tempo Presente.', examples: ['Mi manĝas (Eu como)', 'Li lernas (Ele aprende)'] },
  { term: '-is', explanation: 'Terminação verbal para o Tempo Passado.', examples: ['Mi manĝis (Eu comi)', 'Ili iris (Eles foram)'] },
  { term: '-os', explanation: 'Terminação verbal para o Tempo Futuro.', examples: ['Ni vojaĝos (Nós viajaremos)', 'Ŝi laboros (Ela trabalhará)'] },
  { term: '-us', explanation: 'Terminação verbal para o Condicional (faria, seria).', examples: ['Mi estus (Eu seria/fosse)', 'Vi amus (Você amaria)'] },
  { term: '-u', explanation: 'Terminação verbal para o Volitivo (ordens, desejos, pedidos).', examples: ['Venu! (Venha)', 'Lernu! (Aprendam)'] },
  { term: '-n', explanation: 'O Acusativo. Indica o objeto direto (quem recebe a ação).', examples: ['Mi vidas birdon (Eu vejo um pássaro)', 'Li amas vin (Ele ama você)'] },
  { term: '-j', explanation: 'Sufixo do Plural.', examples: ['Birdoj (Pássaros)', 'Belaj floroj (Belas flores)'] },
  { term: '-in-', explanation: 'Sufixo para o gênero Feminino.', examples: ['Patrino (Mãe)', 'Instruistino (Professora)'] },
  { term: '-eg-', explanation: 'Aumentativo (intensifica o sentido).', examples: ['Domego (Casarão)', 'Bonege (Muito bem)'] },
  { term: '-et-', explanation: 'Diminutivo (reduz o sentido).', examples: ['Dometo (Casinha)', 'Vireto (Homenzinho)'] },
  { term: '-ar-', explanation: 'Sufixo Coletivo (grupo de coisas iguais).', examples: ['Arbaro (Floresta)', 'Vortaro (Dicionário)'] },
  { term: 'mal-', explanation: 'Prefixo que inverte o sentido da palavra (o oposto).', examples: ['Bona (Bom) -> Malbona (Mau)', 'Granda (Grande) -> Malgranda (Pequeno)'] },
  { term: 'bo-', explanation: 'Prefixo indicando parentesco por casamento/afinidade.', examples: ['Bopatro (Sogro)', 'Bofrato (Cunhado)'] },
  { term: 'ge-', explanation: 'Prefixo que indica ambos os sexos juntos.', examples: ['Gepatroj (Pais - pai e mãe)', 'Gefratoj (Irmãos e irmãs)'] },
  { term: 're-', explanation: 'Prefixo indicando repetição ou retorno.', examples: ['Reveni (Retornar)', 'Refari (Refazer)'] },
  { term: '-ilo', explanation: 'Sufixo para ferramenta, instrumento ou meio.', examples: ['Tranĉilo (Faca - ferramenta de cortar)', 'Veturilo (Veículo)'] },
  { term: '-ejo', explanation: 'Sufixo para lugar ou estabelecimento.', examples: ['Lernejo (Escola)', 'Vendejo (Loja)'] },
  { term: '-isto', explanation: 'Sufixo para profissão ou ocupação habitual.', examples: ['Dentisto (Dentista)', 'Instruisto (Professor)'] },
  { term: '-ano', explanation: 'Sufixo para membro ou habitante de um lugar/grupo.', examples: ['Kristano (Cristão)', 'Urbano (Citadino)'] },
];

function InteractiveText({ text }: { text: string }) {
  const [activeHotspot, setActiveHotspot] = useState<GrammarHotspot | null>(null);

  // Sorting hotspots by length descending to match longer patterns first
  const sortedHotspots = [...GRAMMAR_HOTSPOTS].sort((a, b) => b.term.length - a.term.length);
  
  const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${sortedHotspots.map(h => escapeRegExp(h.term)).join('|')})`, 'gi');

  const parts = text.split(regex);

  return (
    <div className="relative inline">
      {parts.map((part, i) => {
        const hotspot = sortedHotspots.find(h => h.term.toLowerCase() === part.toLowerCase());
        if (hotspot) {
          return (
            <span key={i} className="relative inline-block group">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveHotspot(activeHotspot?.term === hotspot.term ? null : hotspot);
                }}
                className="interactive-hotspot mx-0.5 text-emerald-800"
              >
                {part}
              </button>
              
              <AnimatePresence>
                {activeHotspot?.term === hotspot.term && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setActiveHotspot(null)}
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 10 }}
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-[280px] sm:w-72 p-5 bg-white rounded-2xl shadow-2xl border border-emerald-100 z-50 text-left"
                      style={{ maxWidth: 'calc(100vw - 2rem)' }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                          <Zap size={16} />
                        </div>
                        <span className="font-black text-emerald-700 uppercase tracking-widest text-[10px]">Dica Rápida</span>
                      </div>
                      <h4 className="text-slate-900 font-bold mb-2">Gramática: "{hotspot.term}"</h4>
                      <p className="text-slate-600 text-sm mb-4 leading-relaxed">{hotspot.explanation}</p>
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-slate-400 border-b border-slate-100 pb-1 mb-2 block uppercase tracking-tighter">Exemplos Adicionais</span>
                        {hotspot.examples.map((ex, idx) => (
                          <div key={idx} className="bg-slate-50 px-3 py-2 rounded-xl text-xs font-bold text-emerald-700 border border-emerald-50/50">
                            {ex}
                          </div>
                        ))}
                      </div>
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r border-b border-emerald-100 rotate-45" />
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </div>
  );
}
import { Lesson, LessonPart } from '../types';

const MANUAL_LESSONS: Lesson[] = [
  {
    id: 'l1',
    title: 'Fundamentos: Saudações e o Verbo Esti',
    description: 'Aprenda a cumprimentar, se apresentar e usar o verbo mais importante.',
    parts: [
      { type: 'text', content: 'Saluton! O Esperanto é uma língua projetada para ser simples e lógica. "Saluton" é a saudação universal, derivada de "Saluti" (Saudar).' },
      { type: 'icon', content: 'Boas-vindas', iconName: 'smile' },
      { type: 'text', content: 'Para dizer "Bom dia", "Boa tarde" ou "Boa noite", usamos combinações com a palavra "Bona" (Bom/Boa).' },
      { type: 'example', content: '"Bonan tagon!" (Bom dia/Boa tarde - literalmente "Bom dia"). O "-n" final indica que estamos desejando algo a alguém.' },
      { type: 'example', content: '"Bonan vesperon!" (Boa noite - ao chegar) e "Bonan nokton!" (Boa noite - ao dormir).' },
      { type: 'question', content: 'Qual saudação você usaria ao encontrar alguém durante o dia?', options: ['Bonan tagon', 'Bonan nokton', 'Saluton nokto'], correctAnswer: 'Bonan tagon', explanation: '"Tago" significa dia, e "Bonan tagon" é a forma padrão de saudação diurna.' },
      { type: 'combine', content: 'Complete a saudação "Boa noite" (ao dormir):', root: 'Bonan', targetMeaning: 'Boa noite', options: ['tagon', 'vesperon', 'nokton'], correctAnswer: 'nokton', explanation: '"Nokto" é noite (sono), "Vespero" é tarde/noite (chegada).' },
      { type: 'text', content: 'Ao se apresentar, você pode usar "Mia nomo estas..." ou simplesmente "Mi estas...".' },
      { type: 'example', content: '"Saluton, mia nomo estas Johano" (Olá, meu nome é João).' },
      { type: 'text', content: 'Note que "estas" é o verbo ser/estar no presente, e ele é IMUTÁVEL. Não existe "sou", "somos", "são"... é tudo "estas"!' },
      { type: 'example', content: '"Mi estas", "Vi estas", "Ni estas" - Simples, não? No passado usamos "estis" e no futuro "estos".' },
      { type: 'combine', content: 'Como dizer "Eu sou" em Esperanto?', root: 'Mi', targetMeaning: 'Eu sou', options: ['estas', 'estis', 'estos'], correctAnswer: 'estas', explanation: '"Estas" é o presente para todas as pessoas.' },
      { type: 'question', content: 'Como se diz "Nós fomos" (passado de ser) em Esperanto?', options: ['Ni estas', 'Ni estis', 'Ni estos'], correctAnswer: 'Ni estis', explanation: 'O sufixo -is indica o passado.' },
      { type: 'text', content: 'Para perguntar "Como vai?", usamos "Kiel vi fartas?". "Kiel" é como, "vi" é você, e "fartas" é o verbo para "passar bem/mal/estar de saúde".' },
      { type: 'example', content: '"Mi fartas bone, dankon!" (Vou bem, obrigado!). "Bone" é bem (advérbio terminando em -e), e "Dankon" é obrigado.' },
      { type: 'question', content: 'Como se diz "Até a vista" ou "Tchau"?', options: ['Dankon', 'Saluton', 'Ĝis revido'], correctAnswer: 'Ĝis revido', explanation: '"Ĝis" significa até, e "revido" é o ato de rever.' }
    ]
  },
  {
    id: 'l2',
    title: 'Gramática: O e A (Substantivos e Adjetivos)',
    description: 'A regra de ouro: como distinguir nomes de qualidades e criar novas palavras.',
    parts: [
      { type: 'icon', content: 'Lógica Pura', iconName: 'zap' },
      { type: 'text', content: 'No Esperanto, a terminação das palavras revela sua função gramatical. É como uma etiqueta que diz o que a palavra é.' },
      { type: 'text', content: 'Todos os substantivos (nomes de seres, objetos, ideias) terminam em -o. Ex: "Hundo" (Cão), "Amiko" (Amigo).' },
      { type: 'example', content: '"Domo" (Casa), "Libro" (Livro), "Tablo" (Mesa), "Knabo" (Menino).' },
      { type: 'question', content: 'Qual dessas palavras é obrigatoriamente um substantivo?', options: ['Bela', 'Kuri', 'Tablo'], correctAnswer: 'Tablo', explanation: 'Apenas "Tablo" termina em -o, indicando um objeto (mesa).' },
      { type: 'combine', content: 'Se "Amiko" é amigo, como é a raiz para "Amizade"? (Substantivo)', root: 'Amik', targetMeaning: 'Amigo', options: ['-o', '-a', '-e'], correctAnswer: '-o', explanation: 'Substantivos usam a terminação -o.' },
      { type: 'text', content: 'Todos os adjetivos (características, qualidades) terminam em -a. Você pode criar um adjetivo a partir de qualquer substantivo simplesmente trocando a letra final!' },
      { type: 'example', content: '"Suno" (Sol) -> "Suna" (Solar). "Nokto" (Noite) -> "Nokta" (Noturno).' },
      { type: 'example', content: '"Bela domo" (Uma casa bela). Note que em Esperanto o adjetivo geralmente vem ANTES do substantivo, mas pode vir depois se quiser dar ênfase.' },
      { type: 'combine', content: 'Como transformar "Flor(o)" em adjetivo (Floral)?', root: 'Flor', targetMeaning: 'Floral', options: ['-o', '-a', '-is'], correctAnswer: '-a', explanation: 'Adjetivos usam a terminação -a.' },
      { type: 'question', content: 'Como você diria "Um menino bom"? (Knabo = Menino, Bona = Bom)', options: ['Bona knabo', 'Bono knaba', 'Knabo bonas'], correctAnswer: 'Bona knabo', explanation: 'Bona (adjetivo com -a) + knabo (substantivo com -o).' },
      { type: 'question', content: 'Qual a tradução de "Granda hundo"?', options: ['Cachorro grande', 'Cachorro pequeno', 'Gato grande'], correctAnswer: 'Cachorro grande', explanation: 'Granda = Grande, Hundo = Cachorro.' }
    ]
  },
  {
    id: 'l3',
    title: 'Verbos: O Tempo das Coisas (Presente, Passado e Futuro)',
    description: 'Domine os verbos sem tabelas infinitas de conjugação.',
    parts: [
      { type: 'text', content: 'Verbos em português são complexos. Em Esperanto, eles são um alívio! Não existem conjugações por pessoa (eu, tu, ele...).' },
      { type: 'example', content: 'O infinitivo (forma base) termina em -i. "Lerni" (Aprender), "Manĝi" (Comer), "Labori" (Trabalhar).' },
      { type: 'text', content: 'Basta trocar o -i por uma das 3 terminações de tempo universal:' },
      { type: 'example', content: 'Presente: -as. "Mi lernas" (Eu aprendo), "Ni lernas" (Nós aprendemos).' },
      { type: 'combine', content: 'Como dizer "Eu como" (Presente)?', root: 'Mi manĝ', targetMeaning: 'Eu como', options: ['-as', '-is', '-os'], correctAnswer: '-as', explanation: '-as é a marca do presente.' },
      { type: 'example', content: 'Passado: -is. "Mi lernis" (Eu aprendi), "Ili lernis" (Eles aprenderam).' },
      { type: 'combine', content: 'Como dizer "Eu aprendi" (Passado)?', root: 'Mi lern', targetMeaning: 'Eu aprendi', options: ['-as', '-is', '-os'], correctAnswer: '-is', explanation: '-is é a marca do passado.' },
      { type: 'example', content: 'Futuro: -os. "Mi lernos" (Eu aprenderei), "Vi lernos" (Você aprenderá).' },
      { type: 'combine', content: 'Como dizer "Nós trabalharemos" (Futuro)?', root: 'Ni labor', targetMeaning: 'Nós trabalharemos', options: ['-as', '-is', '-os'], correctAnswer: '-os', explanation: '-os é a marca do futuro.' },
      { type: 'question', content: 'Se "Vidi" é ver, como se diz "Eles verão" (futuro)?', options: ['Ili vidas', 'Ili vidis', 'Ili vidos'], correctAnswer: 'Ili vidos', explanation: 'O sufixo -os indica sempre o futuro, independente de quem faz a ação.' },
      { type: 'text', content: 'Além dos tempos, temos o modo Volitivo (ordens/desejos) que termina em -u.' },
      { type: 'example', content: '"Lernu!" (Aprenda!), "Venu ĉi tien" (Venha aqui). "Mi volas ke vi lernu" (Eu quero que você aprenda).' },
      { type: 'question', content: 'Qual seria o comando para "Coma!"? (Manĝi = Comer)', options: ['Manĝas!', 'Manĝu!', 'Manĝi!'], correctAnswer: 'Manĝu!', explanation: 'O sufixo -u é usado para imperativo e vontades.' },
      { type: 'question', content: 'Como se diz "Eu quero ver" (Infinitivo)?', options: ['Mi volas vidu', 'Mi volas vidi', 'Mi volas vidas'], correctAnswer: 'Mi volas vidi', explanation: 'Usamos o infinitivo (-i) após verbos de querer/poder.' }
    ]
  },
  {
    id: 'l4',
    title: 'O Plural (-j) e os Advérbios (-e)',
    description: 'Como falar de grupos e descrever como as ações acontecem.',
    parts: [
      { type: 'text', content: 'Para indicar plural no Esperanto, adicionamos a letra -j ao final da palavra. Ela tem som de "i" curto (como na palavra "lei").' },
      { type: 'example', content: '"Domo" (casa) -> "Domoj" (casas). "Amiko" (amigo) -> "Amikoj" (amigos).' },
      { type: 'text', content: 'Uma regra vital: o adjetivo deve CONCORDAR com o substantivo. Se o nome está no plural, a qualidade também deve estar!' },
      { type: 'example', content: '"Bela domo" (Bela casa) -> "Belaj domoj" (Belas casas).' },
      { type: 'text', content: 'Vamos praticar! Como você transformaria estas palavras para o plural?' },
      { type: 'combine', content: 'Transforme o substantivo "Amiko" (Amigo) em plural:', root: 'Amiko', targetMeaning: 'Amigos', options: ['-o', '-as', '-j'], correctAnswer: '-j', explanation: 'O sufixo -j é a marca universal do plural para substantivos e adjetivos.' },
      { type: 'combine', content: 'Agora transforme o adjetivo "Bona" (Bom) em plural:', root: 'Bona', targetMeaning: 'Bons', options: ['-a', '-e', '-j'], correctAnswer: '-j', explanation: 'Lembre-se: no Esperanto, o adjetivo SEMPRE concorda com o substantivo em número.' },
      { type: 'text', content: 'Prática de concordância: Se temos "Hundo" (Cão) e "Granda" (Grande), como fica o plural?' },
      { type: 'question', content: 'Como se diz "Cães grandes"?', options: ['Grandaj hundoj', 'Granda hundoj', 'Grandaj hundo'], correctAnswer: 'Grandaj hundoj', explanation: 'A concordância é obrigatória: se o substantivo ganha -j, o adjetivo também ganha.' },
      { type: 'question', content: 'Qual a tradução correta para "Maçãs vermelhas"? (Pomo = Maçã, Ruĝa = Vermelho)', options: ['Ruĝaj pomoj', 'Ruĝa pomoj', 'Ruĝaj pomo'], correctAnswer: 'Ruĝaj pomoj', explanation: 'Ambos (adjetivo e substantivo) recebem o -j do plural.' },
      { type: 'question', content: 'Como se diria "Casas grandes"? (Granda = Grande, Domo = Casa)', options: ['Granda domoj', 'Grandaj domo', 'Grandaj domoj'], correctAnswer: 'Grandaj domoj', explanation: 'Lembre-se: no plural, tanto o adjetivo quanto o substantivo precisam do sufixo -j.' },
      { type: 'text', content: 'Agora, para descrever COMO algo é feito, usamos o advérbio, que termina em -e.' },
      { type: 'example', content: '"Rapida" (Rápido - adj.) -> "Rapide" (Rapidamente - adv.). "Li kuras rapide" (Ele corre rapidamente).' },
      { type: 'question', content: 'Como se diz "Ela canta bem"? (Bona = Bom, Kanti = Cantar)', options: ['Ŝi kantas bona', 'Ŝi kantas bone', 'Ŝi kantas bonu'], correctAnswer: 'Ŝi kantas bone', explanation: 'O advérbio "bone" descreve o modo de cantar.' },
      { type: 'text', content: 'Veja mais exemplos de como transformar adjetivos em advérbios:' },
      { type: 'example', content: '"Flua" (fluente) -> "Flue" (fluentemente). Ex: "Mi parolas Esperanton flue".' },
      { type: 'example', content: '"Bona" (bom) -> "Bone" (bem). Ex: "Vi laboras tre bone".' },
      { type: 'example', content: '"Facila" (fácil) -> "Facile" (facilmente). Ex: "Esperanto estas lernata facile".' },
      { type: 'question', content: 'Como se diz "Eles correm rapidamente"? (Rapida = Rápido, Kuri = Correr)', options: ['Ili kuras rapida', 'Ili kuras rapide', 'Ili kuras rapidu'], correctAnswer: 'Ili kuras rapide', explanation: 'Usamos a terminação "-e" para indicar o modo como a ação é realizada.' }
    ]
  },
  {
    id: 'l5',
    title: 'O Famoso Acusativo (-n)',
    description: 'A ferramenta secreta para liberdade total na ordem das palavras.',
    parts: [
      { type: 'text', content: 'O sufixo -n é usado para marcar o "Objeto Direto" — ou seja, quem ou o que recebe a ação do verbo.' },
      { type: 'example', content: '"La hundo amas la katon" (O cão ama o gato). O gato é quem recebe o amor, por isso leva o -n.' },
      { type: 'combine', content: 'Complete: "Mi vidas la domo..." (Eu vejo a casa):', root: 'domo', targetMeaning: 'casa (objeto)', options: ['-n', '-j', '-o'], correctAnswer: '-n', explanation: 'O objeto da visão recebe o acusativo -n.' },
      { type: 'example', content: '"La katon amas la hundo" - O sentido é exatamente o mesmo! O -n nos diz quem é o objeto, não importa a ordem.' },
      { type: 'text', content: 'Isso dá ao Esperanto uma flexibilidade imensa. Você pode escolher a ordem que soa melhor ou que destaca o que você quer.' },
      { type: 'question', content: 'Na frase "Mi manĝas pomon", o que está sendo comido?', options: ['Eu', 'A maçã', 'Não dá pra saber'], correctAnswer: 'A maçã', explanation: '"Pomon" tem o -n do acusativo, logo é o objeto da ação de comer.' },
      { type: 'combine', content: 'Como dizer "O menino vê o amigo"? (Knabo = Menino, Amiko = Amigo, Vidi = Ver)', root: 'La knabo vidas la amiko', targetMeaning: 'O menino vê o amigo', options: ['-n', '-s', '-u'], correctAnswer: '-n', explanation: 'Amiko é o objeto, então recebe -n.' },
      { type: 'text', content: 'Se você tem mais de um objeto, o -n vem DEPOIS do -j. Primeiro o plural, depois o objeto.' },
      { type: 'example', content: '"Mi vidas belajn florojn" (Eu vejo belas flores). Tanto o adjetivo quanto o substantivo recebem -j e depois -n.' },
      { type: 'question', content: 'Qual a ordem correta dos sufixos?', options: ['Radical + n + j', 'Radical + j + n', 'Não importa'], correctAnswer: 'Radical + j + n', explanation: 'Primeiro indicamos a quantidade (-j), depois a função na frase (-n).' }
    ]
  },
  {
    id: 'l6',
    title: 'Pronomes e Possessivos',
    description: 'Aprendendo a se situar e indicar posse.',
    parts: [
      { type: 'text', content: 'Os pronomes são curtos e todos terminam em -i.' },
      { type: 'example', content: 'Mi (Eu), Vi (Você/Vocês), Li (Ele), Ŝi (Ela), Ĝi (Ele/Ela - neutro para objetos/animais), Ni (Nós), Ili (Eles/Elas).' },
      { type: 'question', content: 'Como se diz "Ela" em Esperanto?', options: ['Mi', 'Li', 'Ŝi'], correctAnswer: 'Ŝi', explanation: '"Ŝi" é o pronome feminino singular.' },
      { type: 'combine', content: 'Como dizer "Nós" em Esperanto?', root: 'N', targetMeaning: 'Nós', options: ['-i', '-a', '-o'], correctAnswer: '-i', explanation: 'Todos os pronomes pessoais terminam em -i.' },
      { type: 'text', content: 'Lembra da regra do -A para adjetivos? Se aplicarmos aos pronomes, criamos os possessivos!' },
      { type: 'example', content: 'Mi -> Mia (Meu/Minha). Vi -> Via (Teu/Seu). Ni -> Nia (Nosso/Nossa).' },
      { type: 'combine', content: 'Como transformar "Vi" (Você) em "Seu/Teu"?', root: 'Vi', targetMeaning: 'Seu', options: ['-a', '-o', '-e'], correctAnswer: '-a', explanation: 'O sufixo -a cria a ideia de posse (adjetivo).' },
      { type: 'example', content: '"Mia hundo" (Meu cão). "Niaj libroj" (Nossos livros). Note que o possessivo também concorda em plural ou acusativo!' },
      { type: 'question', content: 'Como se diz "Eu amo meu cachorro"? (Ami = Amar, Hundo = Cachorro)', options: ['Mi amas mia hundo', 'Mi amas mian hundon', 'Min amas mian hundon'], correctAnswer: 'Mi amas mian hundon', explanation: '"mian hundon" precisa do acusativo pois é o objeto do amor.' },
      { type: 'question', content: 'O que significa "Ili"?', options: ['Nós', 'Vocês', 'Eles/Elas'], correctAnswer: 'Eles/Elas', explanation: '"Ili" é o plural de terceira pessoa.' }
    ]
  },
  {
    id: 'l7',
    title: 'Números e Lógica Decimal',
    description: 'Contar é como encaixar peças de um quebra-cabeça.',
    parts: [
      { type: 'text', content: 'Contar no Esperanto é extremamente lógico e segue o sistema decimal de forma pura.' },
      { type: 'example', content: '1: Unu, 2: Du, 3: Tri, 4: Kvar, 5: Kvin, 6: Ses, 7: Sep, 8: Ok, 9: Naŭ, 10: Dek.' },
      { type: 'question', content: 'Como se diz o número 4?', options: ['Du', 'Tri', 'Kvar'], correctAnswer: 'Kvar', explanation: 'Unu, du, tri, kvar...' },
      { type: 'text', content: 'De 11 a 19: "Dek" (10) seguido do número.' },
      { type: 'example', content: '11: Dek unu (10 e 1), 12: Dek du, 15: Dek kvin.' },
      { type: 'combine', content: 'Como dizer 13?', root: 'Dek', targetMeaning: 'Treze', options: ['unu', 'du', 'tri'], correctAnswer: 'tri', explanation: '10 (dek) + 3 (tri) = 13.' },
      { type: 'text', content: 'Para dezenas (20, 30...): colocamos o número ANTES do "Dek".' },
      { type: 'example', content: '20: Dudek (2 dezes), 30: Tridek, 50: Kvindek.' },
      { type: 'question', content: 'Como se diz "Cinquenta e cinco" (55)?', options: ['Kvindek kvin', 'Dek kvin kvin', 'Kvin dek kvin'], correctAnswer: 'Kvindek kvin', explanation: 'Kvindek (50) + kvin (5).' },
      { type: 'combine', content: 'E o número 20?', root: 'Du', targetMeaning: 'Vinte', options: ['dek', 'mil', 'cent'], correctAnswer: 'dek', explanation: '2 dezenas = Dudek.' },
      { type: 'text', content: 'Cent (100) e Mil (1000) seguem o mesmo padrão. "Dukvarcent" seria 2.400? Não, centenas funcionam como as dezenas: "Du mil kvarcent" (2.400).' },
      { type: 'question', content: 'Como se diz 100?', options: ['Cent', 'Mil', 'Dek'], correctAnswer: 'Cent', explanation: 'Cent é cem.' }
    ]
  },
  {
    id: 'l8',
    title: 'Afixos: O Poder de Multiplicação do Vocabulário',
    description: 'Transforme uma palavra em dezenas usando prefixos e sufixos.',
    parts: [
      { type: 'text', content: 'O Esperanto é como um Lego. Você tem raízes básicas e adiciona "peças" (afixos) para mudar o sentido.' },
      { type: 'text', content: 'Prefixo mal-: Inverte completamente o sentido (o oposto perfeito).' },
      { type: 'example', content: '"Bona" (Bom) -> "Malbona" (Mau). "Fermi" (Fechar) -> "Malfermi" (Abrir).' },
      { type: 'question', content: 'Se "Alta" é alto, o que significa "Malalta"?', options: ['Muito alto', 'Baixo', 'Largo'], correctAnswer: 'Baixo', explanation: 'Mal- inverte a qualidade.' },
      { type: 'combine', content: 'Qual o oposto de "Feliĉa" (Feliz)?', root: 'feliĉa', targetMeaning: 'Infeliz', options: ['Bo-', 'Ge-', 'Mal-'], correctAnswer: 'Mal-', explanation: 'O prefixo Mal- indica o oposto.' },
      { type: 'text', content: 'Sufixo -in-: Indica o gênero feminino.' },
      { type: 'example', content: '"Patro" (Pai) -> "Patrino" (Mãe). "Knabo" (Menino) -> "Knabino" (Menina).' },
      { type: 'combine', content: 'Transforme "Frato" (Irmão) em "Irmã":', root: 'Frat', targetMeaning: 'Irmã', options: ['-in-o', '-eg-o', '-et-o'], correctAnswer: '-in-o', explanation: '-in- é o sufixo feminino.' },
      { type: 'text', content: 'Sufixos -eg- e -et-: Intensidade (Aumentativo e Diminutivo).' },
      { type: 'example', content: '"Domo" (Casa) -> "Domego" (Casarão) / "Dometo" (Casinha).' },
      { type: 'question', content: 'Qual seria uma "Menininha"? (Knabo = Menino)', options: ['Knabineto', 'Knabinego', 'Malknabino'], correctAnswer: 'Knabineto', explanation: 'Knab- (raiz) + -in- (feminino) + -et- (diminutivo) + -o (substantivo).' },
      { type: 'question', content: 'O que significa "Varmega"? (Varma = Quente)', options: ['Frio', 'Morno', 'Muito quente'], correctAnswer: 'Muito quente', explanation: '-eg- aumenta a intensidade.' }
    ]
  },
  {
    id: 'l9',
    title: 'Preposições e Direção',
    description: 'Aprendendo a situar objetos no espaço e no tempo.',
    parts: [
      { type: 'text', content: 'As preposições conectam palavras indicando lugar, tempo ou modo. Elas NÃO levam acusativo (-n), a menos que indiquem MOVIMENTO.' },
      { type: 'example', content: 'En (Em/Dentro), Sur (Sobre), Sub (Sob/Debaixo), Antaŭ (Na frente), Malantaŭ (Atrás).' },
      { type: 'example', content: '"La libro estas sur la tablo" (O livro está sobre a mesa).' },
      { type: 'question', content: 'Como se diz "Debaixo" de algo?', options: ['Sur', 'En', 'Sub'], correctAnswer: 'Sub', explanation: 'Sub = debaixo/sob.' },
      { type: 'text', content: 'Regra especial: Se houver movimento EM DIREÇÃO a algum lugar, usamos o -n no lugar.' },
      { type: 'example', content: '"Mi kuras en la domo" (Eu corro dentro da casa - já estou lá). "Mi kuras en la domon" (Eu corro para dentro da casa - vindo de fora).' },
      { type: 'combine', content: 'Movimento para dentro de "La ĝardeno" (O jardim):', root: 'La ĝardenon', targetMeaning: 'Para o jardim', options: ['en', 'sur', 'sub'], correctAnswer: 'en', explanation: 'En = em/para dentro.' },
      { type: 'question', content: 'O que significa "Mi sidas sur la seĝo"?', options: ['Eu sento na cadeira', 'Eu sento em direção à cadeira', 'A cadeira está em cima de mim'], correctAnswer: 'Eu sento na cadeira', explanation: 'Sidi (estar sentado) indica estado, então não há -n de movimento.' }
    ]
  },
  {
    id: 'l10',
    title: 'A Tabela de Correlativos (Introdução)',
    description: 'Os "KI" e "TI" que formam perguntas e respostas lógicas.',
    parts: [
      { type: 'text', content: 'Muitas palavras em português como "onde", "quando", "quem" parecem aleatórias. No Esperanto, elas formam uma matriz lógica.' },
      { type: 'text', content: 'As palavras de pergunta começam com ki-. As de resposta específica começam com ti-.' },
      { type: 'example', content: 'Kie? (Onde?) -> Tie (Lá/Ali). Kie estas vi? (Onde está você?).' },
      { type: 'combine', content: 'Complete a pergunta: "... estas vi?" (Onde está você?)', root: 'e', targetMeaning: 'Onde', options: ['Ki', 'Ti', 'Ĉi'], correctAnswer: 'Ki', explanation: 'Ki- inicia perguntas.' },
      { type: 'example', content: 'Kiu? (Quem/Qual pessoa?) -> Tiu (Aquele/Aquela pessoa).' },
      { type: 'example', content: 'Kiam? (Quando?) -> Tiam (Naquele tempo).' },
      { type: 'combine', content: 'Complete a resposta: "... estas li." (Lá está ele)', root: 'e', targetMeaning: 'Lá/Ali', options: ['Ti', 'Ki', 'Ni'], correctAnswer: 'Ti', explanation: 'Ti- indica algo apontado ou específico.' },
      { type: 'question', content: 'Se você quer perguntar "Quem é este?", qual palavra usaria?', options: ['Kie', 'Kiu', 'Kiam'], correctAnswer: 'Kiu', explanation: 'Kiu refere-se a indivíduos ou coisas específicas.' },
      { type: 'text', content: 'Essa matriz tem 45 combinações que cobrem quase tudo! Veremos mais detalhes nas lições avançadas.' },
      { type: 'question', content: 'Como se diz "Qual tipo de"?', options: ['Kia', 'Kie', 'Kio'], correctAnswer: 'Kia', explanation: 'O final -a indica qualidade/tipo.' }
    ]
  }
];


const THEMES = [
  { name: 'Natureza', icon: 'globe', terms: ['Arbo', 'Floro', 'Besto', 'Suno', 'Luno'] },
  { name: 'Tecnologia', icon: 'code', terms: ['Reto', 'Komputilo', 'Telefono', 'Softvaro', 'Paĝo'] },
  { name: 'Viagem', icon: 'plane', terms: ['Aviadilo', 'Bileto', 'Pasporto', 'Valizo', 'Urbo'] },
  { name: 'Saúde', icon: 'health', terms: ['Kuracisto', 'Malsano', 'Hospitalo', 'Kapdoloro', 'Sano'] },
  { name: 'Culinária', icon: 'coffee', terms: ['Manĝo', 'Kafo', 'Sukero', 'Pano', 'Trinkaĵo'] },
  { name: 'Música', icon: 'music', terms: ['Kanto', 'Gitaro', 'Piano', 'Aŭskulti', 'Melodio'] },
  { name: 'Trabalho', icon: 'work', terms: ['Oficejo', 'Salajro', 'Estro', 'Laboro', 'Projekto'] },
  { name: 'Sentimentos', icon: 'heart', terms: ['Amo', 'Feliĉo', 'Tristo', 'Sperto', 'Espero'] },
  { name: 'Comunicações', icon: 'message', terms: ['Letero', 'Retpoŝto', 'Konversacio', 'Paroli', 'Aŭdi'] },
  { name: 'Compras', icon: 'shopping', terms: ['Prezo', 'Butiko', 'Mono', 'Aĉeti', 'Vendi'] }
];

const THEME_CONTENT: Record<string, { intro: string, questions: {q: string, o: string[], a: string, e: string}[], combineQuestions: {c: string, r: string, m: string, o: string[], a: string, e: string}[] }> = {
  'Natureza': {
    intro: 'A natureza (Naturo) é descrita com precisão no Esperanto. Usamos o sufixo "-aro" para grupos. Assim, de "Arbo" (árvore) temos "Arbaro" (floresta). De "Membro" (membro) temos "Membraro" (corpo/conjunto de membros).',
    questions: [
      { q: 'O que é um "Birdo"?', o: ['Pássaro', 'Peixe', 'Inseto'], a: 'Pássaro', e: 'Birdo é uma raiz internacional que lembra o inglês "Bird".' },
      { q: 'Se "Floro" é flor, o que é um "Floraro"?', o: ['Uma flor grande', 'Um buquê ou jardim', 'Uma flor murcha'], a: 'Um buquê ou jardim', e: 'O sufixo -ar- indica um conjunto ou coletivo de coisas iguais.' },
      { q: 'Qual o oposto de "Bela floro" (Bela flor)?', o: ['Malbela floro', 'Bela malfloro', 'Granda floro'], a: 'Malbela floro', e: 'O prefixo Mal- inverte a qualidade (adjetivo).' },
      { q: 'Como se diz "Água" em Esperanto?', o: ['Akvo', 'Viro', 'Luno'], a: 'Akvo', e: 'Akvo é a raiz para água.' },
      { q: 'O que é o "Suno"?', o: ['Sol', 'Lua', 'Estrela'], a: 'Sol', e: 'Suno é o sol.' }
    ],
    combineQuestions: [
      { c: 'Como transformar "Arbo" (árvore) em plural?', r: 'Arbo', m: 'Árvores', o: ['-o', '-j', '-as'], a: '-j', e: 'O -j é o plural universal.' },
      { c: 'Como dizer que algo é "Solar" vindo de "Suno"?', r: 'Sun', m: 'Solar', o: ['-o', '-a', '-e'], a: '-a', e: 'O sufixo -a cria adjetivos.' },
      { c: 'Como transformar "Flor" em "Flores"?', r: 'Flor', m: 'Flores', o: ['-o', '-j', '-n'], a: '-oj', e: 'Terminação de plural para substantivos é -oj.' },
      { c: 'Muitos animais: de "Besto" (animal) para "Manada/Grupo":', r: 'Best', m: 'Animais (conjunto)', o: ['-aro', '-ejo', '-ilo'], a: '-aro', e: 'Sufixo -aro indica coletivo.' }
    ]
  },
  'Tecnologia': {
    intro: 'O Esperanto cria palavras técnicas unindo funções e ferramentas. O sufixo "-ilo" (instrumento) é rei aqui. "Komputi" (computar) + "ilo" = "Komputilo" (computador). "Ludi" (jogar) + "ilo" = "Ludilo" (brinquedo/joystick).',
    questions: [
      { q: 'O que é um "Reto"?', o: ['Rede/Internet', 'Roda', 'Retângulo'], a: 'Rede/Internet', e: 'Reto significa rede, e por extensão, a Internet (Interreto).' },
      { q: 'O que faz um "Presilo"? (Presi = Imprimir)', o: ['Scanner', 'Impressora', 'Monitor'], a: 'Impressora', e: 'Presi (imprimir) + ilo (ferramenta) = Impressora.' },
      { q: 'Como se diz "Software"?', o: ['Softvaro', 'Programaro', 'Mola kodo'], a: 'Softvaro', e: 'Muitas palavras técnicas usam o sufixo -var- para conjuntos de mercadorias ou sistemas.' },
      { q: 'O que significa "Klavi"?', o: ['Cantar', 'Teclar', 'Correr'], a: 'Teclar', e: 'Klavi é a ação de usar um teclado (Klavaro).' },
      { q: 'O que é um "Televidilo"?', o: ['Televisão', 'Telescópio', 'Lanterna'], a: 'Televisão', e: 'Tele (longe) + vid (ver) + ilo (aparelho).' }
    ],
    combineQuestions: [
      { c: 'Transforme "Skribi" (Escrever) na ferramenta "Caneta":', r: 'Skrib', m: 'Caneta/Lápis', o: ['-ilo', '-isto', '-ejo'], a: '-ilo', e: 'Sufixo -ilo indica ferramenta.' },
      { c: 'Como dizer "Teclado" partindo de "Klavo" (Tecla)?', r: 'Klav', m: 'Teclado', o: ['-aro', '-ejo', '-ilo'], a: '-aro', e: 'Conjunto de teclas = Teclado.' }
    ]
  },
  'Viagem': {
    intro: 'Viajar (Vojaĝi) é fundamental na cultura esperantista. Termos de transporte facilitam a comunicação internacional. De "Vojo" (caminho) temos "Vojaĝi" (viajar).',
    questions: [
      { q: 'O que significa "Aviadilo"?', o: ['Avião', 'Navio', 'Trem'], a: 'Avião', e: 'Avi- (voar) + ad (ação) + ilo (ferramenta).' },
      { q: 'Onde você pegaria um trem?', o: ['Stacidomo', 'Flughaveno', 'Vendejo'], a: 'Stacidomo', e: 'Stacio (estação) + domo (casa).' },
      { q: 'O que é um "Bileto"?', o: ['Passagem/Bilhete', 'Dinheiro', 'Mapa'], a: 'Passagem/Bilhete', e: 'Raiz internacional fácil de reconhecer.' },
      { q: 'Como se diz "Passaporte"?', o: ['Pasporto', 'Bileto', 'Vizo'], a: 'Pasporto', e: 'Raiz internacional.' },
      { q: 'O que é uma "Valizo"?', o: ['Mala', 'Cama', 'Mesa'], a: 'Mala', e: 'Valizo é mala de viagem.' }
    ],
    combineQuestions: [
      { c: 'Se "Urbo" é cidade, como dizer "Urbano"?', r: 'Urb', m: 'Urbano', o: ['-o', '-a', '-e'], a: '-a', e: 'Adjetivos terminam em -a.' },
      { c: 'Como dizer "Caminho" vindo de "Vojo"?', r: 'Voj', m: 'Caminho (substantivo)', o: ['-o', '-a', '-e'], a: '-o', e: 'Substantivos têm final -o.' }
    ]
  },
  'Saúde': {
    intro: 'Saúde (Sano) e medicina usam sufixos como "-isto" (profissional) e "-ejo" (local). "Kuraci" (curar) gera "Kuracisto" (médico) e "Kuracejo" (clínica).',
    questions: [
      { q: 'Como se diz "Doutor"?', o: ['Doktoro', 'Kuracisto', 'Sanigisto'], a: 'Kuracisto', e: 'Embora Doktoro exista para títulos acadêmicos, o médico é chamado de Kuracisto.' },
      { q: 'Qual a diferença entre "Sana" e "Malsana"?', o: ['Sério e Brincalhão', 'Saudável e Doente', 'Forte e Fraco'], a: 'Saudável e Doente', e: 'Mal- inverte o sentido de Sano (saúde).' },
      { q: 'O que é o "Kapo"?', o: ['Coração', 'Cabeça', 'Mão'], a: 'Cabeça', e: 'Raiz internacional vinda do latim.' },
      { q: 'O que é "Dentisto"?', o: ['Dentista', 'Policial', 'Professor'], a: 'Dentista', e: 'Dento (dente) + isto (profissional).' },
      { q: 'O que significa "Hospitalo"?', o: ['Hospital', 'Hospício', 'Hotel'], a: 'Hospital', e: 'Raiz internacional.' }
    ],
    combineQuestions: [
      { c: 'Transforme "Sana" (Saudável) em "Saúde":', r: 'San', m: 'Saúde', o: ['-o', '-a', '-e'], a: '-o', e: 'Substantivos terminam em -o.' },
      { c: 'Profissão vinda de "Kuraci" (Curar):', r: 'Kurac', m: 'Médico', o: ['-isto', '-ilo', '-ejo'], a: '-isto', e: '-isto indica profissão.' }
    ]
  },
  'Culinária': {
    intro: 'Culinária envolve Manĝi (Comer) e Trinki (Beber). Utensílios usam "-ilo", locais usam "-ejo". "Manĝejo" é refeitório ou restaurante.',
    questions: [
      { q: 'O que é "Forko"?', o: ['Garfo', 'Faca', 'Colher'], a: 'Garfo', e: 'Raiz similar ao inglês "Fork" e francês "Fourchette".' },
      { q: 'Como se diz "Açúcar"?', o: ['Sukero', 'Dolĉo', 'Salo'], a: 'Sukero', e: 'Raiz internacional.' },
      { q: 'O que significa "Trinkaĵo"? (Trinki = Beber)', o: ['Alimento', 'Bebida', 'Copo'], a: 'Bebida', e: 'O sufixo -aĵ- indica algo concreto feito de uma raiz.' },
      { q: 'O que é "Pano"?', o: ['Pão', 'Panela', 'Pano'], a: 'Pão', e: 'Raiz para o alimento básico.' },
      { q: 'Como se diz "Café"?', o: ['Kafo', 'Teo', 'Akvo'], a: 'Kafo', e: 'Kafo é café.' }
    ],
    combineQuestions: [
      { c: 'Transforme "Manĝi" (Comer) em "Restaurante":', r: 'Manĝ', m: 'Restaurante/Local de comer', o: ['-isto', '-ilo', '-ejo'], a: '-ejo', e: 'Sufixo -ejo indica lugar.' },
      { c: 'Algo concreto para comer vindo de "Manĝi":', r: 'Manĝ', m: 'Comida (alimento)', o: ['-aĵo', '-ilo', '-aro'], a: '-aĵo', e: '-aĵo indica coisa física.' }
    ]
  },
  'Música': {
    intro: 'Música (Muziko) é celebrada com "Kanto" (canção). O verbo "Aŭskulti" (escutar) é essencial para qualquer fã.',
    questions: [
      { q: 'O que é um "Aŭskultanto"?', o: ['Ouvinte', 'Cantor', 'Músico'], a: 'Ouvinte', e: 'Aŭskulti (ouvir) + ant- (quem faz) + o (indivíduo).' },
      { q: 'Qual o nome do "Violão"?', o: ['Gitaro', 'Violono', 'Fluto'], a: 'Gitaro', e: 'Raiz internacional.' },
      { q: 'O que significa "Kanti"?', o: ['Dançar', 'Cantar', 'Tocar'], a: 'Cantar', e: 'Do latim "cantare".' },
      { q: 'Como se diz "Volume" alto?', o: ['Laŭta', 'Mola', 'Longa'], a: 'Laŭta', e: 'Laŭta significa alto (som).' },
      { q: 'O que é "Aplaŭdi"?', o: ['Aplaudir', 'Cantar', 'Vaiar'], a: 'Aplaudir', e: 'Raiz internacional.' }
    ],
    combineQuestions: [
      { c: 'Transforme "Kanti" (Cantar) no profissional "Cantor":', r: 'Kant', m: 'Cantor', o: ['-ilo', '-isto', '-ejo'], a: '-isto', e: 'Sufixo -isto indica ocupação.' },
      { c: 'Como transformar "Muziko" em adjetivo "Musical"?', r: 'Muzik', m: 'Musical', o: ['-a', '-o', '-e'], a: '-a', e: 'Adjetivos têm final -a.' }
    ]
  },
  'Trabalho': {
    intro: 'No trabalho (Laboro), temos o "Oficejo" (escritório). O sufixo "-estro" indica quem lidera (chefe). "Lernejestro" seria o diretor de escola.',
    questions: [
      { q: 'O que é um "Laboristo"?', o: ['Trabalhador', 'Escritório', 'Fábrica'], a: 'Trabalhador', e: 'Labor- (trabalho) + ist- (quem exerce).' },
      { q: 'Como se diz "Salário"?', o: ['Salajro', 'Mono', 'Prezo'], a: 'Salajro', e: 'Raiz internacional.' },
      { q: 'O que é o "Estro"?', o: ['O Chefe', 'O Empregado', 'O Cliente'], a: 'O Chefe', e: 'Estro é o líder de qualquer organização.' },
      { q: 'Como se diz "Empresa"?', o: ['Firmao', 'Domo', 'Loko'], a: 'Firmao', e: 'Raiz para firma ou empresa.' },
      { q: 'O que é um "Projekto"?', o: ['Projeto', 'Paredes', 'Janelas'], a: 'Projeto', e: 'Raiz internacional.' }
    ],
    combineQuestions: [
      { c: 'Transforme "Ofico" (Ofício) no lugar "Escritório":', r: 'Ofic', m: 'Escritório', o: ['-ejo', '-ilo', '-ano'], a: '-ejo', e: 'Sufixo -ejo para lugares.' },
      { c: 'De "Lerni" (Aprender) para "Escola":', r: 'Lern', m: 'Escola (local)', o: ['-ejo', '-aro', '-isto'], a: '-ejo', e: 'Lugar de aprender = Escola.' }
    ]
  },
  'Sentimentos': {
    intro: 'Sentimentos (Sentoj) como Amo (Amor) e Espero (Esperança) são a alma da língua. O prefixo "BO-" indica parentesco por afinidade (casamento). "Bopatro" é o sogro.',
    questions: [
      { q: 'Como se diz "Infeliz"?', o: ['Malfeliĉa', 'Ne-feliĉa', 'Trista'], a: 'Malfeliĉa', e: 'Prefixo Mal- cria o oposto direto de Feliĉa.' },
      { q: 'O que é "Ami"?', o: ['Gostar', 'Amar', 'Odiar'], a: 'Amar', e: 'Raiz latina.' },
      { q: 'O que significa "Ĝojo"?', o: ['Raiva', 'Alegria', 'Medo'], a: 'Alegria', e: 'Ĝoji é estar alegre.' },
      { q: 'Como se diz "Espero"?', o: ['Medo', 'Esperança', 'Dúvida'], a: 'Esperança', e: 'Raiz da palavra Esperanto.' },
      { q: 'O que significa "Tristo"?', o: ['Tristeza', 'Raiva', 'Sono'], a: 'Tristeza', e: 'Vem do adjetivo Trista.' }
    ],
    combineQuestions: [
      { c: 'Transforme "Ami" (Amar) no adjetivo "Amável":', r: 'Am', m: 'Amável', o: ['-o', '-a', '-e'], a: '-a', e: 'Adjetivos terminam em -a.' },
      { c: 'O oposto de "Amo":', r: 'Amo', m: 'Ódio', o: ['Mal-', 'Ge-', 'Bo-'], a: 'Mal-', e: 'Mal- inverte o sentimento.' }
    ]
  },
  'Comunicações': {
    intro: 'Comunicação evoluiu de "Letero" (carta) para "Retpoŝto" (e-mail). O verbo "Paroli" (falar) diferencia o ser humano.',
    questions: [
      { q: 'Como se diz "Escrever"?', o: ['Skribi', 'Legi', 'Diri'], a: 'Skribi', e: 'Raiz latina.' },
      { q: 'O que é "Lingvo"?', o: ['Língua/Idioma', 'Palavra', 'Som'], a: 'Língua/Idioma', e: 'Vem do latim "lingua".' },
      { q: 'O que significa "Diri"?', o: ['Falar', 'Dizer', 'Ouvir'], a: 'Dizer', e: 'Diri é dizer algo específico. Paroli é o ato de falar.' },
      { q: 'Como se diz "Telefone"?', o: ['Telefono', 'Poŝto', 'Radio'], a: 'Telefono', e: 'Raiz internacional.' },
      { q: 'O que é "Konversacio"?', o: ['Conversa', 'Disputa', 'Grito'], a: 'Conversa', e: 'Raiz internacional.' }
    ],
    combineQuestions: [
      { c: 'Transforme "Paroli" (Falar) no indivíduo que "Fala" (Falante):', r: 'Parol', m: 'Falante', o: ['-anto', '-ilo', '-ejo'], a: '-anto', e: 'Sufixo -ant- para participante ativo.' },
      { c: 'Como dizer "Linguístico" em relação a "Lingvo"?', r: 'Lingv', m: 'Linguístico', o: ['-a', '-o', '-e'], a: '-a', e: 'Adjetivo sobre língua.' }
    ]
  },
  'Compras': {
    intro: 'Em uma "Butiko" (loja), você usa "Mono" (dinheiro) para "Aĉeti" (comprar). "Vendi" (vender) é o oposto.',
    questions: [
      { q: 'Qual o nome do "Preço"?', o: ['Prezo', 'Kosto', 'Valoro'], a: 'Prezo', e: 'Raiz internacional.' },
      { q: 'O que é a "Monujo"?', o: ['Moeda', 'Carteira', 'Banco'], a: 'Carteira', e: 'Mon- (dinheiro) + uj- (recipiente) + o (coisa).' },
      { q: 'Como se diz "Barato"?', o: ['Libera', 'Malmultekosta', 'Malalta'], a: 'Malmultekosta', e: 'Literalmente "Mal" (oposto) "multe" (muito) "kosta" (caro).' },
      { q: 'O que é "Butikisto"?', o: ['Vendedor/Lojista', 'Cliente', 'Prateleira'], a: 'Vendedor/Lojista', e: 'Butiko (loja) + isto (profissional).' },
      { q: 'Como se diz "Caro"?', o: ['Kosta', 'Libera', 'Granda'], a: 'Kosta', e: 'Vem de custo/kosto.' }
    ],
    combineQuestions: [
      { c: 'Transforme "Aĉeti" (Comprar) em "Compra":', r: 'Aĉet', m: 'Compra (substantivo)', o: ['-as', '-o', '-is'], a: '-o', e: 'Substantivos terminam em -o.' },
      { c: 'Oposto de "Aĉeti" (Comprar):', r: 'Vendi', m: 'Vender', o: ['Vendi', 'Doni', 'Peti'], a: 'Vendi', e: 'Vendi é o oposto de Aĉeti.' }
    ]
  }
};

const GENERATED_LESSONS: Lesson[] = Array.from({ length: 90 }, (_, i) => {
  const idNum = i + 11;
  const theme = THEMES[i % THEMES.length];
  const content = THEME_CONTENT[theme.name] || { 
    intro: `Nesta unidade exploraremos o vocabulário de ${theme.name.toLowerCase()}. O Esperanto preza pela clareza e termos internacionais.`,
    questions: [{ q: `Qual o foco de ${theme.name}?`, o: [theme.name, 'Gramática pura', 'Nada'], a: theme.name, e: 'Foco na imersão temática.' }],
    combineQuestions: []
  };
  const termIdx = Math.floor(i / THEMES.length) % theme.terms.length;
  const term = theme.terms[termIdx];
  const nextTerm = theme.terms[(termIdx + 1) % theme.terms.length];
  
  const lessonParts: LessonPart[] = [
    { type: 'icon', content: `Imersão em ${theme.name}`, iconName: theme.icon },
    { type: 'text', content: content.intro },
    { type: 'text', content: `No dia a dia de ${theme.name.toLowerCase()}, essas palavras são essenciais:` },
    { type: 'example', content: `Termo 1: "${term}" - muito usado em conversas sobre o assunto.` },
    { type: 'example', content: `Termo 2: "${nextTerm}" - amplia seu entendimento situcional.` }
  ];

  // Include some combine exercises if available
  if (content.combineQuestions.length > 0) {
    const combine = content.combineQuestions[i % content.combineQuestions.length];
    lessonParts.push({
      type: 'combine',
      content: combine.c,
      root: combine.r,
      targetMeaning: combine.m,
      options: combine.o,
      correctAnswer: combine.a,
      explanation: combine.e
    });
  }

  // Include ALL available questions for the theme to make lessons richer
  content.questions.forEach((q) => {
    lessonParts.push({
      type: 'question',
      content: q.q,
      options: q.o,
      correctAnswer: q.a,
      explanation: q.e
    });
  });

  lessonParts.push({ type: 'text', content: 'Continue consolidando seu aprendizado. Cada passo é uma vitória na sua jornada rumo ao bilinguismo!' });

  return {
    id: `l${idNum}`,
    title: `${theme.name}: Módulo ${Math.floor(i / THEMES.length) + 1}`,
    description: `Lição ${idNum}: Vocabulário aplicado de ${theme.name.toLowerCase()} (${term} e ${nextTerm}).`,
    parts: lessonParts
  };
});

const ADVANCED_LESSONS: Lesson[] = [
  {
    id: 'adv1',
    title: 'Aprofundamento: Os Correlativos',
    description: 'Entenda a matriz lógica dos 45 correlativos que formam a espinha dorsal da precisão no Esperanto.',
    difficulty: 'advanced',
    parts: [
      { type: 'text', content: 'Os correlativos são palavras que se relacionam de forma sistemática. Eles são formados por um radical de "pergunta/indicação" e um radical de "tipo".' },
      { type: 'icon', content: 'Matriz Lógica', iconName: 'zap' },
      { type: 'text', content: 'Existem 5 começos: KI- (pergunta), TI- (ponto), ĈI- (tudo), NENI- (nada), I- (alguma coisa).' },
      { type: 'text', content: 'E 9 finais: -O (coisa), -A (qualidade), -E (lugar), -AM (tempo), -EL (modo), -AL (razão), -OM (quantidade), -ES (posse), -U (indivíduo).' },
      { type: 'example', content: 'KI (pergunta) + O (coisa) = KIO (O quê). TI (ponto) + E (lugar) = TIE (Lá/Ali).' },
      { type: 'question', content: 'Como se diz "Sempre" (Tudo + Tempo) em Esperanto?', options: ['Ĉiam', 'Ĉio', 'Tiam'], correctAnswer: 'Ĉiam', explanation: 'Ĉi- (todo) + -am (tempo) = Ĉiam.' },
      { type: 'question', content: 'Como se diz "Em lugar nenhum"?', options: ['Nenie', 'Ie', 'Ĉie'], correctAnswer: 'Nenie', explanation: 'Neni- (nada) + -e (lugar) = Nenie.' },
      { type: 'combine', content: 'Crie "Alguém" (Algum + Indivíduo):', root: 'i', targetMeaning: 'Alguém', options: ['-u', '-o', '-a'], correctAnswer: '-u', explanation: '-u indica pessoa/indivíduo.' },
      { type: 'text', content: 'Dominar essa tabela permite que você expresse quase qualquer relação lógica sem precisar decorar palavras isoladas.' }
    ]
  },
  {
    id: 'adv2',
    title: 'Nuances: O Sufixo -UM-',
    description: 'O sufixo "coringa" que não tem um sentido definido, mas cria relações intuitivas.',
    difficulty: 'advanced',
    parts: [
      { type: 'text', content: 'O sufixo -UM- é o mais flexível e indefinido do Esperanto. Ele indica uma relação vaga com a raiz.' },
      { type: 'example', content: '"Kolo" (Pescoço) -> "Kolumo" (Colarinho). "Butono" (Botão) -> "Butonumi" (Abotoar).' },
      { type: 'text', content: 'Ele é usado quando nenhum outro sufixo se encaixa perfeitamente na lógica técnica.' },
      { type: 'example', content: '"Plena" (Cheio) -> "Plenumi" (Cumprir/Realizar).' },
      { type: 'question', content: 'O que significa "Krucumi"? (Kruco = Cruz)', options: ['Crucificar', 'Fazer uma cruz', 'Comprar uma cruz'], correctAnswer: 'Crucificar', explanation: 'Kruco (Cruz) + um (relação indefinida/vaga/especial) + i (verbo) = Crucificar.' },
      { type: 'question', content: 'O que é um "Kolumo"? (Kolo = Pescoço)', options: ['Colar', 'Colarinho', 'Gravata'], correctAnswer: 'Colarinho', explanation: 'Kolo (pescoço) + um (peça relacionada) = colarinho.' }
    ]
  },
  {
    id: 'adv3',
    title: 'Cultura: O Idealismo (Interna Ideo)',
    description: 'Explore a filosofia por trás da língua e o impacto social do movimento esperantista.',
    difficulty: 'advanced',
    parts: [
      { type: 'text', content: 'O Esperanto não é apenas uma gramática; ele carrega a "Interna Ideo" (Ideia Interna): a promoção da paz e compreensão mútua.' },
      { type: 'icon', content: 'Idealismo', iconName: 'globe' },
      { type: 'text', content: 'Zamenhof criou a língua para derrubar barreiras linguísticas que geravam desconfiança entre os povos.' },
      { type: 'example', content: '"Ni fosu la teron, por ke la popoloj povu nin kompreni" (Cavemos o chão, para que os povos possam nos entender).' },
      { type: 'text', content: 'Hoje, a cultura esperantista inclui festivais (UK - Universala Kongreso), música, literatura original e uma rede mundial de hospitalidade.' },
      { type: 'question', content: 'Qual o principal objetivo de Zamenhof ao criar o Esperanto?', options: ['Lucrar com livros', 'Facilitar a paz e compreensão mundial', 'Substituir o latim na igreja'], correctAnswer: 'Facilitar a paz e compreensão mundial', explanation: 'A "Interna Ideo" foca na fraternidade humana.' }
    ]
  },
  {
    id: 'adv4',
    title: 'Estilo: Literatura e Poesia',
    description: 'A flexibilidade do Esperanto na arte. Como a ordem das palavras e as rimas funcionam.',
    difficulty: 'advanced',
    parts: [
      { type: 'text', content: 'O Esperanto é extremamente maleável. Graças ao acusativo (-n), você pode mudar a ordem das palavras para criar ênfase ou rimas sem mudar o sentido básico.' },
      { type: 'example', content: 'Normal: "Mi amas vin". Poético: "Vin amas mi" ou "Amas mi vin".' },
      { type: 'icon', content: 'Arte Literal', iconName: 'music' },
      { type: 'text', content: 'Existem milhares de livros originais em Esperanto, não apenas traduções. Autores como Julio Baghy e William Auld elevaram o status da língua à literatura de alto nível.' },
      { type: 'example', content: '"Ho, mia kor\', ne batu maltrankvile" - Famosos versos de Zamenhof sobre a ansiedade de criar a língua.' },
      { type: 'question', content: 'Por que o Esperanto é bom para poesia?', options: ['Ordem flexível e sufixos regulares', 'Tem poucas palavras', 'É uma língua antiga'], correctAnswer: 'Ordem flexível e sufixos regulares', explanation: 'A flexibilidade gramatical permite métricas e rimas muito criativas.' },
      { type: 'question', content: 'O que o acusativo (-n) permite em termos de estilo?', options: ['Rimar melhor', 'Mudar a ordem das palavras sem mudar o sentido', 'Falar mais rápido'], correctAnswer: 'Mudar a ordem das palavras sem mudar o sentido', explanation: 'O -n marca o objeto, permitindo ordens como OVS ou VOS mantendo a clareza.' }
    ]
  }
];

const SAMPLE_LESSONS: Lesson[] = [
  ...MANUAL_LESSONS.map(l => ({ ...l, difficulty: 'beginner' as const })), 
  ...GENERATED_LESSONS.map(l => ({ ...l, difficulty: 'intermediate' as const })),
  ...ADVANCED_LESSONS
];

interface LessonsProps {
  completedLessons: string[];
  downloadedLessons: string[];
  isOnline: boolean;
  onComplete: (lessonId: string) => void;
  onAddToFlashcards: (front: string, back: string, category?: string) => void;
  onDownload: (lessonId: string) => void;
  onBackToHome: () => void;
  soundEnabled?: boolean;
}

interface GrammarQuizQuestion {
  id: string;
  topic: 'substantivo' | 'verbo' | 'adjetivo' | 'acusativo' | 'plural';
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

const GRAMMAR_QUIZ_QUESTIONS: GrammarQuizQuestion[] = [
  {
    id: 'q1',
    topic: 'substantivo',
    question: 'Qual é o sufixo correto para todos os substantivos no Esperanto?',
    options: ['-a', '-o', '-e', '-as'],
    correctAnswer: '-o',
    explanation: 'Em Esperanto, todos os nomes de coisas, seres e conceitos (substantivos) terminam obrigatoriamente com a letra -o.'
  },
  {
    id: 'q2',
    topic: 'adjetivo',
    question: 'Como transformamos a palavra "Amiko" (amigo) em "Amigável"?',
    options: ['Amikoj', 'Amikon', 'Amika', 'Amike'],
    correctAnswer: 'Amika',
    explanation: 'Substituímos o -o (substantivo) pelo -a para criar um adjetivo (qualidade).'
  },
  {
    id: 'q3',
    topic: 'verbo',
    question: 'Qual terminação indica que uma ação está ocorrendo AGORA (Presente)?',
    options: ['-is', '-os', '-us', '-as'],
    correctAnswer: '-as',
    explanation: '-as é o sufixo para o tempo presente. Ex: Mi manĝas (Eu como).'
  },
  {
    id: 'q4',
    topic: 'plural',
    question: 'Como dizemos "Belas casas" em Esperanto? (Domo = Casa, Bela = Belo)',
    options: ['Belaj domo', 'Bela domoj', 'Belaj domoj', 'Bela domojn'],
    correctAnswer: 'Belaj domoj',
    explanation: 'O plural -j deve ser aplicado tanto ao substantivo quanto ao adjetivo que o qualifica.'
  },
  {
    id: 'q5',
    topic: 'acusativo',
    question: 'Na frase "A hundo vidas la katon", quem é o objeto direto (quem está sendo visto)?',
    options: ['La hundo', 'La katon', 'Ambos', 'Ninguém'],
    correctAnswer: 'La katon',
    explanation: 'O sufixo -n marca o acusativo, indicando que o gato é o receptor da ação de ver.'
  },
  {
    id: 'q6',
    topic: 'verbo',
    question: 'Qual é a terminação para o futuro?',
    options: ['-is', '-as', '-os', '-u'],
    correctAnswer: '-os',
    explanation: 'O sufixo -os indica ações que ainda acontecerão.'
  },
  {
    id: 'q7',
    topic: 'verbo',
    question: 'Se "Lerni" é aprender, como se diz "Eu aprendi" (passado)?',
    options: ['Mi lernas', 'Mi lernis', 'Mi lernos', 'Mi lernu'],
    correctAnswer: 'Mi lernis',
    explanation: '-is é o sufixo universal para o passado.'
  }
];

const VERB_PRACTICE_QUESTIONS: GrammarQuizQuestion[] = [
  {
    id: 'vp1',
    topic: 'verbo',
    question: 'Como se diz "Nós trabalharemos" (Futuro)? (Labori = Trabalhar)',
    options: ['Ni laboras', 'Ni laboros', 'Ni laboru', 'Ni laboris'],
    correctAnswer: 'Ni laboros',
    explanation: 'O sufixo -os indica sempre o futuro, independente da pessoa.'
  },
  {
    id: 'vp2',
    topic: 'verbo',
    question: 'Qual a forma correta para o comando "Cante!"? (Kanti = Cantar)',
    options: ['Kanti!', 'Kantas!', 'Kantu!', 'Kantos!'],
    correctAnswer: 'Kantu!',
    explanation: 'O modo volitivo/imperativo em Esperanto termina em -u.'
  },
  {
    id: 'vp3',
    topic: 'verbo',
    question: 'Traduza: "Eu vi um pássaro". (Vidi = Ver, Birdo = Pássaro)',
    options: ['Mi vidas birdon', 'Mi vidos birdon', 'Mi vidis birdon', 'Mi vidu birdon'],
    correctAnswer: 'Mi vidis birdon',
    explanation: 'O sufixo -is marca o passado. Note também o -n do acusativo em birdon.'
  },
  {
    id: 'vp4',
    topic: 'verbo',
    question: 'O que significa a frase: "Ili manĝas"?',
    options: ['Eles comeram', 'Eles comerão', 'Eles comem', 'Eles querem comer'],
    correctAnswer: 'Eles comem',
    explanation: 'O sufixo -as indica o presente habitual ou contínuo.'
  },
  {
    id: 'vp5',
    topic: 'verbo',
    question: 'Como transformar "Lerni" (Aprender) em "Aprenda"?',
    options: ['Lernas', 'Lernos', 'Lernis', 'Lernu'],
    correctAnswer: 'Lernu',
    explanation: 'A terminação -u é usada para expressar desejo, ordem ou pedido (volitivo).'
  }
];

export function Lessons({ 
  completedLessons, 
  downloadedLessons, 
  isOnline, 
  onComplete, 
  onAddToFlashcards, 
  onDownload,
  onBackToHome,
  soundEnabled
}: LessonsProps) {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [maxVisitedIndex, setMaxVisitedIndex] = useState(0); // Track progress for review jumping
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [focusedOptionIndex, setFocusedOptionIndex] = useState<number>(-1);
  const [isLessonFinished, setIsLessonFinished] = useState(false);
  const lessonContainerRef = useRef<HTMLDivElement>(null);

  // Suggested Next Lesson Logic
  const suggestedNextLesson = useMemo(() => {
    if (!selectedLesson) return null;
    const currentIndex = SAMPLE_LESSONS.findIndex(l => l.id === selectedLesson.id);
    if (currentIndex === -1) return null;
    
    // Try to find the next lesson of the same difficulty
    const sameLevelNext = SAMPLE_LESSONS.slice(currentIndex + 1).find(l => l.difficulty === selectedLesson.difficulty);
    if (sameLevelNext) return sameLevelNext;
    
    // Fallback: next sequential lesson in the entire list
    if (currentIndex < SAMPLE_LESSONS.length - 1) return SAMPLE_LESSONS[currentIndex + 1];
    
    return null;
  }, [selectedLesson?.id]);

  // Grammar Quiz State
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);

  // Verb Practice State
  const [isVerbPracticeMode, setIsVerbPracticeMode] = useState(false);
  const [verbPracticeIndex, setVerbPracticeIndex] = useState(0);
  const [verbPracticeScore, setVerbPracticeScore] = useState(0);
  const [verbPracticeFinished, setVerbPracticeFinished] = useState(false);

  // Auto-scroll to top of lesson when selecting or moving through parts
  useEffect(() => {
    if (selectedLesson || isQuizMode || isVerbPracticeMode) {
      // Small timeout to ensure the DOM has updated before scrolling
      setTimeout(() => {
        lessonContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  }, [selectedLesson?.id, currentPartIndex, isQuizMode, quizIndex, isVerbPracticeMode, verbPracticeIndex]);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const resetVerbPractice = () => {
    setVerbPracticeIndex(0);
    setVerbPracticeScore(0);
    setVerbPracticeFinished(false);
    setSelectedOption(null);
    setIsCorrect(null);
    setFocusedOptionIndex(-1);
  };

  const handleNextVerbPractice = () => {
    if (verbPracticeIndex < VERB_PRACTICE_QUESTIONS.length - 1) {
      setVerbPracticeIndex(verbPracticeIndex + 1);
      setSelectedOption(null);
      setIsCorrect(null);
      setFocusedOptionIndex(-1);
    } else {
      setVerbPracticeFinished(true);
    }
  };

  const checkVerbPracticeAnswer = (option: string) => {
    const question = VERB_PRACTICE_QUESTIONS[verbPracticeIndex];
    setSelectedOption(option);
    const correct = option === question.correctAnswer;
    setIsCorrect(correct);
    if (correct) {
      setVerbPracticeScore(verbPracticeScore + 1);
      if (soundEnabled) soundService.playCorrect();
    } else {
      if (soundEnabled) soundService.playIncorrect();
    }
  };

  const resetQuiz = () => {
    setQuizIndex(0);
    setQuizScore(0);
    setQuizFinished(false);
    setSelectedOption(null);
    setIsCorrect(null);
    setFocusedOptionIndex(-1);
  };

  const handleNextQuiz = () => {
    if (quizIndex < GRAMMAR_QUIZ_QUESTIONS.length - 1) {
      setQuizIndex(quizIndex + 1);
      setSelectedOption(null);
      setIsCorrect(null);
      setFocusedOptionIndex(-1);
    } else {
      setQuizFinished(true);
    }
  };

  const checkQuizAnswer = (option: string) => {
    const question = GRAMMAR_QUIZ_QUESTIONS[quizIndex];
    setSelectedOption(option);
    const correct = option === question.correctAnswer;
    setIsCorrect(correct);
    if (correct) {
      setQuizScore(quizScore + 1);
      if (soundEnabled) soundService.playCorrect();
    } else {
      if (soundEnabled) soundService.playIncorrect();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Logic for Lesson Parts
      if (selectedLesson && !quizFinished && !isQuizMode) {
        const part = selectedLesson.parts[currentPartIndex];
        const options = part.options || [];

        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          if (part.type === 'question' || part.type === 'combine') {
            e.preventDefault();
            const direction = e.key === 'ArrowDown' ? 1 : -1;
            setFocusedOptionIndex(prev => {
              const next = prev + direction;
              if (next >= options.length) return 0;
              if (next < 0) return options.length - 1;
              return next;
            });
          }
        } else if (e.key === 'Enter') {
          if (focusedOptionIndex !== -1 && !selectedOption) {
            checkAnswer(options[focusedOptionIndex]);
          } else if (isCorrect) {
            handleNext();
          }
        } else if (e.key === 'ArrowRight') {
          const isInteractive = part.type === 'question' || part.type === 'combine';
          if (!isInteractive || isCorrect) {
            handleNext();
          }
        } else if (e.key === 'ArrowLeft') {
          if (currentPartIndex > 0) {
            setCurrentPartIndex(currentPartIndex - 1);
            setSelectedOption(null);
            setIsCorrect(null);
            setFocusedOptionIndex(-1);
          }
        }
      }

      // Logic for Grammar Quiz
      if (isQuizMode && !quizFinished) {
        const question = GRAMMAR_QUIZ_QUESTIONS[quizIndex];
        const options = question.options;

        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault();
          const direction = e.key === 'ArrowDown' ? 1 : -1;
          setFocusedOptionIndex(prev => {
            const next = prev + direction;
            if (next >= options.length) return 0;
            if (next < 0) return options.length - 1;
            return next;
          });
        } else if (e.key === 'Enter') {
          if (focusedOptionIndex !== -1 && !selectedOption) {
            checkQuizAnswer(options[focusedOptionIndex]);
          } else if (isCorrect !== null) {
            handleNextQuiz();
          }
        } else if (e.key === 'ArrowRight') {
          if (isCorrect !== null) handleNextQuiz();
        } else if (e.key === 'ArrowLeft') {
          if (quizIndex > 0) {
            setQuizIndex(quizIndex - 1);
            setSelectedOption(null);
            setIsCorrect(null);
            setFocusedOptionIndex(-1);
          }
        }
      }

      // Logic for Verb Practice
      if (isVerbPracticeMode && !verbPracticeFinished) {
        const question = VERB_PRACTICE_QUESTIONS[verbPracticeIndex];
        const options = question.options;

        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault();
          const direction = e.key === 'ArrowDown' ? 1 : -1;
          setFocusedOptionIndex(prev => {
            const next = prev + direction;
            if (next >= options.length) return 0;
            if (next < 0) return options.length - 1;
            return next;
          });
        } else if (e.key === 'Enter') {
          if (focusedOptionIndex !== -1 && !selectedOption) {
            checkVerbPracticeAnswer(options[focusedOptionIndex]);
          } else if (isCorrect !== null) {
            handleNextVerbPractice();
          }
        } else if (e.key === 'ArrowRight') {
          if (isCorrect !== null) handleNextVerbPractice();
        } else if (e.key === 'ArrowLeft') {
          if (verbPracticeIndex > 0) {
            setVerbPracticeIndex(verbPracticeIndex - 1);
            setSelectedOption(null);
            setIsCorrect(null);
            setFocusedOptionIndex(-1);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedLesson, currentPartIndex, isCorrect, quizFinished, isQuizMode, quizIndex, focusedOptionIndex, selectedOption, isVerbPracticeMode, verbPracticeIndex, verbPracticeFinished]);

  const handleNext = () => {
    if (!selectedLesson) return;
    if (currentPartIndex < selectedLesson.parts.length - 1) {
      const nextIndex = currentPartIndex + 1;
      setCurrentPartIndex(nextIndex);
      setMaxVisitedIndex(Math.max(maxVisitedIndex, nextIndex));
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      onComplete(selectedLesson.id);
      setIsLessonFinished(true);
    }
  };

  const checkAnswer = (option: string) => {
    if (!selectedLesson) return;
    const part = selectedLesson.parts[currentPartIndex];
    setSelectedOption(option);
    const correct = option === part.correctAnswer;
    setIsCorrect(correct);
    if (soundEnabled) {
      if (correct) soundService.playCorrect();
      else soundService.playIncorrect();
    }
  };

  const filteredLessons = useMemo(() => {
    let base = SAMPLE_LESSONS.filter(l => l.difficulty === selectedLevel);
    if (!isOnline) {
      base = base.filter(l => downloadedLessons.includes(l.id));
    }
    return base;
  }, [selectedLevel, isOnline, downloadedLessons]);

  if (isQuizMode) {
    const question = GRAMMAR_QUIZ_QUESTIONS[quizIndex];
    const progress = ((quizIndex + 1) / GRAMMAR_QUIZ_QUESTIONS.length) * 100;

    return (
      <div ref={lessonContainerRef} className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => {
              setIsQuizMode(false);
              resetQuiz();
            }}
            className="flex items-center text-slate-500 hover:text-emerald-600 transition-colors font-bold text-sm"
          >
            <ChevronLeft size={20} className="mr-1" />
            <span>Sair do Desafio</span>
          </button>
          <div className="text-sm font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-4 py-2 rounded-xl">
            Desafio Gramatical
          </div>
        </div>

        <div className="bento-card overflow-hidden">
          <div className="p-10 md:p-14">
            <AnimatePresence mode="wait">
              {!quizFinished ? (
                <motion.div
                  key={quizIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="space-y-8"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-widest text-emerald-600">
                        Questão {quizIndex + 1} de {GRAMMAR_QUIZ_QUESTIONS.length}
                      </span>
                      <div className="flex-grow mx-8 h-1 bg-slate-100 rounded-full relative overflow-hidden">
                        <motion.div 
                          className="absolute inset-y-0 left-0 bg-emerald-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-black text-emerald-600">
                        {quizScore} pts
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="bento-label text-blue-600">{question.topic}</span>
                    <h2 className="text-3xl font-bold text-slate-900 leading-tight">
                      {question.question}
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {question.options.map((option, index) => (
                      <button
                        key={option}
                        onClick={() => !isCorrect && checkQuizAnswer(option)}
                        className={`w-full p-5 text-left rounded-2xl border-2 transition-all font-bold ${
                          selectedOption === option
                            ? isCorrect 
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                              : 'bg-red-50 border-red-500 text-red-700'
                            : focusedOptionIndex === index
                              ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/50 text-emerald-700'
                              : 'border-slate-100 hover:border-emerald-600 bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{option}</span>
                          {selectedOption === option && (
                            isCorrect ? <CheckCircle2 size={22} /> : <AlertCircle size={22} />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  {isCorrect !== null && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-6 rounded-3xl border ${isCorrect ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}
                    >
                      <div className="flex space-x-3 items-start">
                        <Info className={isCorrect ? 'text-emerald-500' : 'text-red-500'} />
                        <div>
                          <p className={`text-sm font-bold uppercase mb-1 ${isCorrect ? 'text-emerald-600' : 'text-red-600'}`}>
                            {isCorrect ? 'Excelente!' : 'Não desanime!'}
                          </p>
                          <p className={`text-sm font-medium ${isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>
                            {question.explanation}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div className="pt-8 flex justify-end">
                    <button
                      disabled={isCorrect === null}
                      onClick={handleNextQuiz}
                      className={`px-10 py-4 rounded-2xl font-bold flex items-center transition-all ${
                        isCorrect === null
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          : 'bg-slate-900 text-white hover:bg-emerald-700 shadow-xl'
                      }`}
                    >
                      {quizIndex === GRAMMAR_QUIZ_QUESTIONS.length - 1 ? 'Finalizar Desafio' : 'Próxima Questão'}
                      <ChevronRight size={20} className="ml-2" />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20"
                >
                  <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-bounce">
                    <Trophy size={48} />
                  </div>
                  <h2 className="text-5xl font-black text-slate-900 mb-4">Desafio Concluído!</h2>
                  <p className="text-xl text-slate-500 mb-10">Você acertou {quizScore} de {GRAMMAR_QUIZ_QUESTIONS.length} questões gramaticais.</p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                      onClick={resetQuiz}
                      className="w-full sm:w-auto px-10 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-colors"
                    >
                      Tentar Novamente
                    </button>
                    <button
                      onClick={() => {
                        setIsQuizMode(false);
                        resetQuiz();
                      }}
                      className="w-full sm:w-auto px-10 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-colors"
                    >
                      Ver Outras Lições
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  }

  if (isVerbPracticeMode) {
    const question = VERB_PRACTICE_QUESTIONS[verbPracticeIndex];
    const progress = ((verbPracticeIndex + 1) / VERB_PRACTICE_QUESTIONS.length) * 100;

    return (
      <div ref={lessonContainerRef} className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => {
              setIsVerbPracticeMode(false);
              resetVerbPractice();
            }}
            className="flex items-center text-slate-500 hover:text-blue-600 transition-colors font-bold text-sm"
          >
            <ChevronLeft size={20} className="mr-1" />
            <span>Sair do Treino</span>
          </button>
          <div className="text-sm font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-4 py-2 rounded-xl">
            Treino de Verbos
          </div>
        </div>

        <div className="bento-card overflow-hidden">
          <div className="p-10 md:p-14">
            <AnimatePresence mode="wait">
              {!verbPracticeFinished ? (
                <motion.div
                  key={verbPracticeIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="space-y-8"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-widest text-blue-600">
                        Questão {verbPracticeIndex + 1} de {VERB_PRACTICE_QUESTIONS.length}
                      </span>
                      <div className="flex-grow mx-8 h-1 bg-slate-100 rounded-full relative overflow-hidden">
                        <motion.div 
                          className="absolute inset-y-0 left-0 bg-blue-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-black text-blue-600">
                        {verbPracticeScore} pts
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="bento-label text-blue-600">verbo</span>
                    <h2 className="text-3xl font-bold text-slate-900 leading-tight">
                      {question.question}
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {question.options.map((option, index) => (
                      <button
                        key={option}
                        onClick={() => !isCorrect && checkVerbPracticeAnswer(option)}
                        className={`w-full p-5 text-left rounded-2xl border-2 transition-all font-bold ${
                          selectedOption === option
                            ? isCorrect 
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                              : 'bg-red-50 border-red-500 text-red-700'
                            : focusedOptionIndex === index
                              ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/50 text-blue-700'
                              : 'border-slate-100 hover:border-blue-600 bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{option}</span>
                          {selectedOption === option && (
                            isCorrect ? <CheckCircle2 size={22} /> : <AlertCircle size={22} />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  {isCorrect !== null && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-6 rounded-3xl border ${isCorrect ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}
                    >
                      <div className="flex space-x-3 items-start">
                        <Info className={isCorrect ? 'text-emerald-500' : 'text-red-500'} />
                        <div>
                          <p className={`text-sm font-bold uppercase mb-1 ${isCorrect ? 'text-emerald-600' : 'text-red-600'}`}>
                            {isCorrect ? 'Excelente!' : 'Não desanime!'}
                          </p>
                          <p className={`text-sm font-medium ${isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>
                            {question.explanation}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div className="pt-8 flex justify-end">
                    <button
                      disabled={isCorrect === null}
                      onClick={handleNextVerbPractice}
                      className={`px-10 py-4 rounded-2xl font-bold flex items-center transition-all ${
                        isCorrect === null
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          : 'bg-slate-900 text-white hover:bg-blue-700 shadow-xl'
                      }`}
                    >
                      {verbPracticeIndex === VERB_PRACTICE_QUESTIONS.length - 1 ? 'Finalizar Treino' : 'Próxima Questão'}
                      <ChevronRight size={20} className="ml-2" />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20"
                >
                  <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-bounce">
                    <Zap size={48} />
                  </div>
                  <h2 className="text-5xl font-black text-slate-900 mb-4">Treino Concluído!</h2>
                  <p className="text-xl text-slate-500 mb-10">Você acertou {verbPracticeScore} de {VERB_PRACTICE_QUESTIONS.length} questões verbais.</p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                      onClick={resetVerbPractice}
                      className="w-full sm:w-auto px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-colors"
                    >
                      Tentar Novamente
                    </button>
                    <button
                      onClick={() => {
                        setIsVerbPracticeMode(false);
                        resetVerbPractice();
                      }}
                      className="w-full sm:w-auto px-10 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-colors"
                    >
                      Ver Outras Lições
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  }

  if (selectedLesson) {
    const part = selectedLesson.parts[currentPartIndex];
    const progress = ((currentPartIndex + 1) / selectedLesson.parts.length) * 100;

    if (isLessonFinished) {
      return (
        <div ref={lessonContainerRef} className="max-w-4xl mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bento-card overflow-hidden"
          >
            <div className="p-10 md:p-20 text-center">
              <motion.div 
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl"
              >
                <Trophy size={48} />
              </motion.div>
              
              <h2 className="text-5xl font-black text-slate-900 mb-4">Gratulon!</h2>
              <p className="text-xl text-slate-500 mb-10 font-medium">
                Você completou a lição: <span className="text-emerald-600 font-bold">{selectedLesson.title}</span>
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                {suggestedNextLesson ? (
                  <button
                    onClick={() => {
                      setSelectedLesson(suggestedNextLesson);
                      setIsLessonFinished(false);
                      setCurrentPartIndex(0);
                      setMaxVisitedIndex(0);
                      setSelectedOption(null);
                      setIsCorrect(null);
                      setFocusedOptionIndex(-1);
                      if (suggestedNextLesson.difficulty !== selectedLevel) {
                        setSelectedLevel(suggestedNextLesson.difficulty as any);
                      }
                    }}
                    className="w-full sm:w-auto px-10 py-5 bg-emerald-600 text-white rounded-2xl font-black hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-3 active:scale-95"
                  >
                    <span>Próxima Lição</span>
                    <ChevronRight size={24} />
                  </button>
                ) : (
                  <p className="text-emerald-600 font-black mb-4">Parabéns! Você completou todas as lições deste nível!</p>
                )}
                
                <button
                  onClick={() => {
                    setSelectedLesson(null);
                    setIsLessonFinished(false);
                    setCurrentPartIndex(0);
                    setMaxVisitedIndex(0);
                  }}
                  className="w-full sm:w-auto px-10 py-5 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Book size={20} />
                  <span>Ver todas as lições</span>
                </button>
              </div>
              
              {suggestedNextLesson && (
                <div className="mt-12 p-6 bg-slate-50 rounded-3xl border border-slate-100 max-w-sm mx-auto">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Sugestão automática</p>
                  <h4 className="font-bold text-slate-900 mb-1">{suggestedNextLesson.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-1">{suggestedNextLesson.description}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      );
    }

    return (
      <div ref={lessonContainerRef} className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => setSelectedLesson(null)}
            className="flex items-center text-slate-500 hover:text-emerald-600 transition-colors font-bold text-sm"
          >
            <ChevronLeft size={20} className="mr-1" />
            <span>Voltar para as lições</span>
          </button>
          
          <button 
            onClick={onBackToHome}
            className="flex items-center text-slate-400 hover:text-slate-900 transition-all font-bold text-sm bg-white border border-slate-100 px-4 py-2 rounded-xl"
          >
            <Home size={18} className="mr-2" />
            <span>Página Inicial</span>
          </button>
        </div>

        <div className="bento-card overflow-hidden">
          {/* Dynamic Header */}
          <div className="bg-slate-50 border-b border-slate-100 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm font-black ring-1 ring-slate-200">
                  {currentPartIndex + 1}
                </div>
                <div>
                  <h3 className="font-black text-slate-900 leading-tight">{selectedLesson.title}</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">Status da Lição</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {selectedLesson.parts.map((_, i) => (
                  <button
                    key={i}
                    onMouseEnter={() => i <= maxVisitedIndex && setCurrentPartIndex(i)}
                    className={`h-2 w-8 rounded-full transition-all duration-300 ${
                      i === currentPartIndex 
                        ? 'bg-emerald-500 w-12 shadow-lg shadow-emerald-500/20' 
                        : i < currentPartIndex
                          ? 'bg-emerald-200'
                          : i <= maxVisitedIndex
                            ? 'bg-emerald-100 cursor-pointer'
                            : 'bg-slate-200 cursor-not-allowed'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Barra de Progresso Visual */}
            <div className="w-full">
              <div className="flex justify-between items-center mb-2 text-xs font-bold text-slate-500">
                <span>Parte {currentPartIndex + 1} de {selectedLesson.parts.length}</span>
                <span className="text-emerald-600">{Math.round(progress)}% Concluído</span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                <motion.div 
                  className="h-full bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)] relative"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-white/30" />
                </motion.div>
              </div>
            </div>
          </div>

          <div className="p-10 md:p-14">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPartIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="space-y-8"
              >
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="bento-label text-emerald-600">
                        Parto {currentPartIndex + 1} el {selectedLesson.parts.length}
                      </span>
                    </div>
                  </div>

                <h2 className="text-4xl font-bold text-slate-900 leading-tight">
                  {part.type === 'question' ? 'Teste seu conhecimento' : (
                    <div className="flex flex-col gap-1">
                      <span className="text-xs uppercase tracking-[0.2em] font-black text-emerald-500 mb-2">Lição Selecionada</span>
                      {selectedLesson.title}
                    </div>
                  )}
                </h2>

                <div className="text-xl text-slate-600 leading-relaxed font-medium flex justify-between items-start gap-4">
                  <span>
                    <InteractiveText text={part.content} />
                  </span>
                  {part.type === 'example' && (
                    <button 
                      onClick={() => {
                        const [front, back] = part.content.split(' significa ').map(s => s.replace(/"/g, '').trim());
                        if (front && back) onAddToFlashcards(front, back, selectedLesson.title);
                      }}
                      className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors shrink-0"
                      title="Adicionar aos Flashcards"
                    >
                      <PlusSquare size={20} />
                    </button>
                  )}
                </div>

                {part.type === 'icon' && part.iconName && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="my-10 flex flex-col items-center justify-center p-8 md:p-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200"
                  >
                    <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-xl text-emerald-500 mb-4 hover:scale-110 transition-transform">
                      {renderPartIcon(part.iconName)}
                    </div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{part.content}</p>
                  </motion.div>
                )}

                {part.type === 'image' && part.imageUrl && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative aspect-video rounded-3xl overflow-hidden border border-slate-100 shadow-md"
                  >
                    <img 
                      src={part.imageUrl} 
                      alt={part.content}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                    <div className="absolute bottom-6 left-6 text-white font-bold text-lg">
                      {part.content}
                    </div>
                  </motion.div>
                )}

                {part.type === 'combine' && (
                  <div className="space-y-10 py-4">
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <div className="px-8 py-5 bg-slate-900 text-white rounded-[2rem] text-3xl font-black shadow-2xl ring-4 ring-slate-100">
                        {part.root}
                      </div>
                      <PlusSquare className="text-emerald-500 animate-pulse" size={28} />
                      <div className={`px-8 py-5 rounded-[2rem] text-3xl font-black border-4 border-dashed transition-all duration-500 ${
                        selectedOption 
                          ? isCorrect ? 'bg-emerald-50 border-emerald-500 text-emerald-600 scale-105' : 'bg-red-50 border-red-500 text-red-600'
                          : 'bg-white border-slate-200 text-slate-200'
                      }`}>
                        {selectedOption || '???'}
                      </div>
                      <div className="text-3xl font-black text-slate-300 mx-2">→</div>
                      <div className="px-8 py-5 bg-emerald-600 text-white rounded-[2rem] text-xl font-bold shadow-lg shadow-emerald-900/20">
                        {part.targetMeaning}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      {part.options?.map((option, index) => (
                        <button
                          key={option}
                          onClick={() => !isCorrect && checkAnswer(option)}
                          className={`group relative p-6 rounded-3xl border-2 font-black text-lg transition-all active:scale-95 ${
                            selectedOption === option
                              ? isCorrect 
                                ? 'bg-emerald-500 border-emerald-500 text-white shadow-xl shadow-emerald-500/30' 
                                : 'bg-red-500 border-red-500 text-white shadow-xl shadow-red-500/30'
                              : focusedOptionIndex === index
                                ? 'border-emerald-500 ring-4 ring-emerald-500/20 bg-emerald-50 text-emerald-700'
                                : 'bg-white border-slate-100 hover:border-emerald-500 hover:bg-emerald-50 text-slate-600'
                          }`}
                        >
                          <div className="relative z-10 flex items-center justify-center gap-2">
                            {option}
                             {selectedOption === option && (
                              isCorrect ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {part.type === 'question' && (
                  <div className="space-y-3">
                    {part.options?.map((option, index) => (
                      <button
                        key={option}
                        onClick={() => !isCorrect && checkAnswer(option)}
                        className={`w-full p-5 text-left rounded-2xl border-2 transition-all font-bold ${
                          selectedOption === option
                            ? isCorrect 
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                              : 'bg-red-50 border-red-500 text-red-700'
                            : focusedOptionIndex === index
                              ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/50 text-emerald-700'
                              : 'border-slate-100 hover:border-emerald-600 bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{option}</span>
                          {selectedOption === option && (
                            isCorrect ? <CheckCircle2 size={22} /> : <AlertCircle size={22} />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {isCorrect !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-6 rounded-3xl border ${isCorrect ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}
                  >
                    <div className="flex space-x-3 items-start justify-between">
                      <div className="flex space-x-3">
                        <Info className={isCorrect ? 'text-emerald-500' : 'text-red-500'} />
                        <p className={`text-sm font-medium ${isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>
                          {part.explanation}
                        </p>
                      </div>
                      {isCorrect && (
                        <button 
                          onClick={() => {
                            if (part.correctAnswer) onAddToFlashcards(part.correctAnswer, part.explanation || '', selectedLesson.title);
                          }}
                          className="p-2 text-emerald-600 hover:bg-white rounded-xl transition-colors shrink-0"
                          title="Adicionar resposta aos Flashcards"
                        >
                          <PlusSquare size={16} />
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}

                {selectedLesson.id === 'l1' && currentPartIndex === selectedLesson.parts.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex justify-center pt-4"
                  >
                    <button
                      onClick={() => {
                        const shareUrl = `https://esperanto.app/lessons?id=l1`;
                        if (navigator.share) {
                          navigator.share({
                            title: 'Esperanto Lernu - Lição 1',
                            text: 'Estou aprendendo Esperanto! Veja esta lição:',
                            url: shareUrl,
                          }).catch(console.error);
                        } else {
                          navigator.clipboard.writeText(shareUrl);
                          alert('Link da lição copiado para a área de transferência!');
                        }
                      }}
                      className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-emerald-500 text-emerald-600 rounded-2xl font-bold hover:bg-emerald-50 transition-all shadow-sm"
                    >
                      <Share2 size={20} />
                      Compartilhar Lição
                    </button>
                  </motion.div>
                )}

                <div className="pt-8 flex justify-end">
                  <button
                    disabled={(part.type === 'question' || part.type === 'combine') && !isCorrect}
                    onClick={handleNext}
                    className={`px-10 py-4 rounded-2xl font-bold flex items-center transition-all ${
                      (part.type === 'question' || part.type === 'combine') && !isCorrect
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-slate-900 text-white hover:bg-emerald-700 shadow-xl'
                    }`}
                  >
                    {currentPartIndex === selectedLesson.parts.length - 1 ? 'Finalizar Lição' : 'Próxima etapa'}
                    <ChevronRight size={20} className="ml-2" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="flex items-center justify-between mb-8 md:hidden">
        <button 
          onClick={onBackToHome}
          className="flex items-center text-slate-500 hover:text-slate-900 transition-all font-bold text-sm bg-white border border-slate-100 px-4 py-2 rounded-xl"
        >
          <Home size={18} className="mr-2" />
          <span>Home</span>
        </button>
      </div>
      <div className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="hidden md:block mb-6">
             <button 
              onClick={onBackToHome}
              className="flex items-center text-slate-500 hover:text-slate-900 transition-all font-bold text-xs bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg mb-2"
            >
              <Home size={14} className="mr-1.5" />
              <span>Voltar para Início</span>
            </button>
          </div>
          <h2 className="text-5xl font-bold text-slate-900 mb-6">Trilha de Aprendizado</h2>
          <p className="text-slate-500 max-w-2xl text-lg font-medium">Módulos sequenciais projetados para levar você do zero à fluência em tempo recorde.</p>
          
          <div className="flex flex-wrap items-center gap-2 mt-10">
            {[
              { id: 'beginner', label: 'Iniciante', active: 'bg-emerald-600 shadow-emerald-600/20' },
              { id: 'intermediate', label: 'Intermediário', active: 'bg-blue-600 shadow-blue-600/20' },
              { id: 'advanced', label: 'Avançado', active: 'bg-purple-600 shadow-purple-600/20' }
            ].map((level) => (
              <button
                key={level.id}
                onClick={() => setSelectedLevel(level.id as any)}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  selectedLevel === level.id
                    ? `${level.active} text-white shadow-lg`
                    : 'bg-white border border-slate-100 text-slate-500 hover:border-slate-300'
                }`}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>
        {!isOnline && (
          <div className="flex items-center gap-3 px-4 py-2 bg-red-50 text-red-600 rounded-2xl border border-red-100 font-bold text-sm">
            <WifiOff size={18} />
            Modo Offline Ativo
          </div>
        )}
      </div>

      {/* Grammar Quiz Highlight */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <button 
          onClick={() => {
            setIsQuizMode(true);
            setIsVerbPracticeMode(false);
            setSelectedLesson(null);
            resetQuiz();
          }}
          className="w-full text-left group"
        >
          <div className="p-1 inset-0 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 rounded-[2.5rem] p-[1px]">
            <div className="bg-slate-900 rounded-[2.4rem] p-10 md:p-14 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity">
                <Trophy size={180} />
              </div>
              <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="px-4 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-black uppercase tracking-widest ring-1 ring-emerald-500/30">
                      Novo: Desafio Real
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
                      <Star size={14} className="text-yellow-500 fill-current" />
                      Ganha +50 XP
                    </span>
                  </div>
                  <h3 className="text-4xl md:text-5xl font-black text-white leading-none tracking-tight">
                    Mestre da <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">Gramática</span>
                  </h3>
                  <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-sm">
                    Um teste rápido cobrindo as 16 regras fundamentais. Você está pronto para validar seu progresso?
                  </p>
                  <div className="flex items-center gap-4 pt-4">
                    <div className="h-14 px-8 bg-white text-slate-900 rounded-2xl font-black flex items-center gap-3 group-hover:scale-105 transition-transform">
                      Começar Agora
                      <ChevronRight size={20} className="text-emerald-600" />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Substantivos', icon: 'O', color: 'bg-emerald-500' },
                    { label: 'Adjetivos', icon: 'A', color: 'bg-blue-500' },
                    { label: 'Verbos', icon: 'AS', color: 'bg-purple-500' },
                    { label: 'Acusativo', icon: 'N', color: 'bg-orange-500' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-3xl backdrop-blur-sm">
                      <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center text-white font-black mb-3 text-xs`}>
                        {stat.icon}
                      </div>
                      <p className="text-white font-bold text-sm">{stat.label}</p>
                      <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest mt-1">Quiz Dinâmico</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </button>
      </motion.div>

      {/* Verb Practice Highlight */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <button 
          onClick={() => {
            setIsVerbPracticeMode(true);
            setIsQuizMode(false);
            setSelectedLesson(null);
            resetVerbPractice();
          }}
          className="w-full text-left group"
        >
          <div className="bg-white border-2 border-dashed border-blue-200 rounded-[2.5rem] p-1 shadow-sm hover:border-blue-500 transition-colors">
            <div className="bg-slate-50 rounded-[2.4rem] p-10 md:p-14 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity text-blue-600">
                <Zap size={180} />
              </div>
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                <div className="space-y-6 flex-grow">
                  <div className="flex items-center gap-3">
                    <span className="px-4 py-1.5 bg-blue-100 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest ring-1 ring-blue-500/10">
                      Foco: Verbos
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
                      <Star size={14} className="text-blue-500 fill-current" />
                      Ganha +30 XP
                    </span>
                  </div>
                  <h3 className="text-4xl md:text-5xl font-black text-slate-900 leading-none tracking-tight">
                    Coração da <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Ação</span>
                  </h3>
                  <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-sm">
                    Prática intensiva de tempos verbais e modo volitivo. Domine o presente, passado, futuro e ordens!
                  </p>
                </div>
                <div className="shrink-0">
                  <div className="h-20 w-20 bg-blue-600 text-white rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-600/20 group-hover:scale-110 transition-transform">
                    <Play size={32} className="ml-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </button>
      </motion.div>

      {filteredLessons.length === 0 && !isOnline ? (
        <div className="bento-card p-10 md:p-20 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 mb-6">
            <Zap size={32} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Nenhuma lição offline</h3>
          <p className="text-slate-500 max-w-md mx-auto mb-8 font-medium">Você precisa baixar lições enquanto estiver online para estudá-las sem internet.</p>
          <button 
            className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold"
            disabled
          >
            Aguardando Conexão...
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {filteredLessons.map((lesson, idx) => {
            const isDownloaded = downloadedLessons.includes(lesson.id);
            return (
              <div 
                key={lesson.id}
                className="group relative bento-card p-8 md:p-10 flex flex-col justify-between"
              >
                <div 
                  onClick={() => {
                    setSelectedLesson(lesson);
                    setCurrentPartIndex(0);
                    setMaxVisitedIndex(0);
                    setIsLessonFinished(false);
                  }}
                  className="cursor-pointer"
                >
                  {completedLessons.includes(lesson.id) && (
                    <div className="absolute top-10 right-20 text-emerald-500">
                      <CheckCircle2 size={24} />
                    </div>
                  )}
                  <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-8">
                    <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white group-hover:bg-emerald-600 transition-colors shadow-lg shrink-0">
                      <span className="text-2xl font-bold">{idx + 1}</span>
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">{lesson.title}</h3>
                      <p className="text-slate-500 mb-6 font-medium leading-relaxed text-sm">{lesson.description}</p>
                      <div className="flex items-center justify-center md:justify-start text-emerald-600 font-bold gap-2 text-sm">
                        <span>{completedLessons.includes(lesson.id) ? 'Revisar Conteúdo' : 'Praticar Agora'}</span>
                        <Play size={16} className="fill-current group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>

                {isOnline && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDownload(lesson.id);
                    }}
                    className={`absolute bottom-10 right-10 p-3 rounded-2xl transition-all ${
                      isDownloaded 
                        ? 'bg-emerald-100 text-emerald-600' 
                        : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                    }`}
                    title={isDownloaded ? 'Disponível Offline' : 'Baixar para Offline'}
                  >
                    {isDownloaded ? <CheckCircle2 size={20} /> : <Download size={20} />}
                  </button>
                )}
                {!isOnline && isDownloaded && (
                  <div className="absolute bottom-10 right-10 p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                    <Cloud size={20} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
