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
  Trophy
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
                className="mx-0.5 px-1 bg-emerald-100 text-emerald-800 rounded-md font-black border-b-2 border-emerald-300 hover:bg-emerald-200 transition-colors cursor-help"
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
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-72 p-5 bg-white rounded-2xl shadow-2xl border border-emerald-100 z-50 text-left"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                          <Zap size={16} />
                        </div>
                        <span className="font-black text-emerald-700 uppercase tracking-widest text-[10px]">Dica Gramatical</span>
                      </div>
                      <h4 className="text-slate-900 font-bold mb-2">Significado de "{hotspot.term}"</h4>
                      <p className="text-slate-600 text-sm mb-4 leading-relaxed">{hotspot.explanation}</p>
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Exemplos</span>
                        {hotspot.examples.map((ex, idx) => (
                          <div key={idx} className="bg-slate-50 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-700">
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
    title: 'Fundamentos: Saudações',
    description: 'Aprenda a cumprimentar e se apresentar com naturalidade.',
    parts: [
      { type: 'text', content: 'Saluton! O Esperanto é uma língua projetada para ser simples e lógica. "Saluton" é a saudação universal, derivada de "Saluti" (Saudar).' },
      { type: 'icon', content: 'Boas-vindas', iconName: 'smile' },
      { type: 'text', content: 'Para dizer "Bom dia", "Boa tarde" ou "Boa noite", usamos combinações com a palavra "Bona" (Bom/Boa).' },
      { type: 'example', content: '"Bonan tagon!" (Bom dia/Boa tarde - literalmente "Bom dia"). O "-n" final indica que estamos desejando algo a alguém.' },
      { type: 'example', content: '"Bonan vesperon!" (Boa noite - ao chegar) e "Bonan nokton!" (Boa noite - ao dormir).' },
      { type: 'question', content: 'Qual saudação você usaria ao encontrar alguém durante o dia?', options: ['Bonan tagon', 'Bonan nokton', 'Saluton nokto'], correctAnswer: 'Bonan tagon', explanation: '"Tago" significa dia, e "Bonan tagon" é a forma padrão de saudação diurna.' },
      { type: 'text', content: 'Ao se apresentar, você pode usar "Mia nomo estas..." ou simplesmente "Mi estas...".' },
      { type: 'example', content: '"Saluton, mia nomo estas Johano" (Olá, meu nome é João).' },
      { type: 'text', content: 'Note que "estas" é o verbo ser/estar no presente, e ele é IMUTÁVEL. Não existe "sou", "somos", "são"... é tudo "estas"!' },
      { type: 'example', content: '"Mi estas", "Vi estas", "Ni estas" - Simples, não?' },
      { type: 'question', content: 'Como se diz "Nós somos" em Esperanto?', options: ['Ni estas', 'Ni nomas', 'Ni esti'], correctAnswer: 'Ni estas', explanation: 'O verbo "estas" serve para todas as pessoas gramaticais.' },
      { type: 'text', content: 'Para perguntar "Como vai?", usamos "Kiel vi fartas?". "Kiel" é como, "vi" é você, e "fartas" é o verbo para "passar bem/mal/estar de saúde".' },
      { type: 'example', content: '"Mi fartas bone, dankon!" (Vou bem, obrigado!). "Bone" é bem, e "Dankon" é obrigado.' }
    ]
  },
  {
    id: 'l2',
    title: 'Gramática: O e A (Substantivos e Adjetivos)',
    description: 'A regra de ouro: como distinguir nomes de qualidades.',
    parts: [
      { type: 'icon', content: 'Lógica Pura', iconName: 'zap' },
      { type: 'text', content: 'No Esperanto, a terminação das palavras revela sua função gramatical. É como uma etiqueta que diz o que a palavra é.' },
      { type: 'text', content: 'Todos os substantivos (nomes de seres, objetos, ideias) terminam em -O.' },
      { type: 'example', content: '"Domo" (Casa), "Libro" (Livro), "Hundo" (Cão), "Amiko" (Amigo).' },
      { type: 'question', content: 'Qual dessas palavras é obrigatoriamente um substantivo?', options: ['Bela', 'Kuri', 'Tablo'], correctAnswer: 'Tablo', explanation: 'Apenas "Tablo" termina em -o, indicando um objeto (mesa).' },
      { type: 'text', content: 'Todos os adjetivos (características, qualidades) terminam em -A. Você pode criar um adjetivo a partir de qualquer substantivo!' },
      { type: 'example', content: '"Suno" (Sol) -> "Suna" (Solar). "Nokto" (Noite) -> "Nokta" (Noturno).' },
      { type: 'example', content: '"Bela domo" (Uma casa bela). Note que em Esperanto o adjetivo geralmente vem ANTES do substantivo.' },
      { type: 'question', content: 'Como você diria "Um amigo amigável"? (Amiko = Amigo)', options: ['Amika amiko', 'Amiko amiko', 'Amika amika'], correctAnswer: 'Amika amiko', explanation: 'Amika (adjetivo) + amiko (substantivo).' },
      { type: 'text', content: 'Essa lógica permite que você entenda palavras que nunca viu antes, apenas olhando para a última letra!' }
    ]
  },
  {
    id: 'l3',
    title: 'Verbos: O Tempo das Coisas',
    description: 'Domine os verbos no presente, passado e futuro.',
    parts: [
      { type: 'text', content: 'Verbos em português são complexos. Em Esperanto, eles são um alívio! Não existem conjugações por pessoa (eu, tu, ele...).' },
      { type: 'example', content: 'O infinitivo (forma base) termina em -I. "Lerni" (Aprender), "Manĝi" (Comer), "Labori" (Trabalhar).' },
      { type: 'text', content: 'Basta trocar o -i por uma das 3 terminações de tempo:' },
      { type: 'example', content: 'Presente: -AS. "Mi lernas" (Eu aprendo), "Ni lernas" (Nós aprendemos).' },
      { type: 'example', content: 'Passado: -IS. "Mi lernis" (Eu aprendi), "Ili lernis" (Eles aprenderam).' },
      { type: 'example', content: 'Futuro: -OS. "Mi lernos" (Eu aprenderei), "Vi lernos" (Você aprenderá).' },
      { type: 'question', content: 'Se "Vidi" é ver, como se diz "Eles verão" (futuro)?', options: ['Ili vidas', 'Ili vidis', 'Ili vidos'], correctAnswer: 'Ili vidos', explanation: 'O sufixo -os indica sempre o futuro, independente de quem faz a ação.' },
      { type: 'text', content: 'Existe também o modo Volitivo (ordens/desejos) que termina em -U.' },
      { type: 'example', content: '"Lernu!" (Aprenda!), "Venu ĉi tien" (Venha aqui).' },
      { type: 'question', content: 'Qual seria o comando para "Coma!"? (Manĝi = Comer)', options: ['Manĝas!', 'Manĝu!', 'Manĝi!'], correctAnswer: 'Manĝu!', explanation: 'O sufixo -u é usado para imperativo e vontades.' }
    ]
  },
  {
    id: 'l4',
    title: 'O Plural (-J)',
    description: 'Como falar de mais de um objeto ou pessoa.',
    parts: [
      { type: 'text', content: 'Para indicar plural no Esperanto, adicionamos a letra -J ao final da palavra. Ela tem som de "i" curto, como em "pai".' },
      { type: 'example', content: '"Domo" (casa) -> "Domoj" (casas). "Amiko" (amigo) -> "Amikoj" (amigos).' },
      { type: 'text', content: 'Uma regra vital: o adjetivo deve CONCORDAR com o substantivo. Se o nome está no plural, a qualidade também deve estar!' },
      { type: 'example', content: '"Bela domo" (Bela casa) -> "Belaj domoj" (Belas casas).' },
      { type: 'question', content: 'Qual a tradução correta para "Maçãs vermelhas"? (Pomo = Maçã, Ruĝa = Vermelho)', options: ['Ruĝaj pomoj', 'Ruĝa pomoj', 'Ruĝaj pomo'], correctAnswer: 'Ruĝaj pomoj', explanation: 'Ambos (adjetivo e substantivo) recebem o -j do plural.' },
      { type: 'text', content: 'Note que até em frases complexas, essa harmonia sonora do "-j" ajuda a saber o que pertence a quê.' }
    ]
  },
  {
    id: 'l5',
    title: 'O Famoso Acusativo (-N)',
    description: 'A parte mais poderosa e flexível da língua.',
    parts: [
      { type: 'text', content: 'O sufixo -N é usado para marcar o "Objeto Direto" — ou seja, quem ou o que recebe a ação do verbo.' },
      { type: 'example', content: '"La hundo amas la katon" (O cão ama o gato). O gato é quem recebe o amor, por isso leva o -N.' },
      { type: 'example', content: '"La katon amas la hundo" - O sentido é exatamente o mesmo! O -N nos diz quem é o objeto, não importa a ordem.' },
      { type: 'text', content: 'Isso dá ao Esperanto uma flexibilidade imensa, típica de línguas como o latim ou russo, mas sem a complexidade delas.' },
      { type: 'question', content: 'Na frase "Mi manĝas pomon", o que está sendo comido?', options: ['Eu', 'A maçã', 'Não dá pra saber'], correctAnswer: 'A maçã', explanation: '"Pomon" tem o -n do acusativo, logo é o objeto da ação de comer.' },
      { type: 'text', content: 'Se você tem mais de um objeto, o -N vem depois do -J. Ex: "Mi manĝas pomojn" (Eu como maçãs).' }
    ]
  },
  {
    id: 'l6',
    title: 'Pronomes Pessoais',
    description: 'Como se referir a pessoas e coisas.',
    parts: [
      { type: 'text', content: 'Os pronomes são a base de qualquer frase. Em Esperanto, eles são curtos e terminam em -i.' },
      { type: 'example', content: 'Mi (Eu), Vi (Você/Vocês), Li (Ele), Ŝi (Ela), Ĝi (Ele/Ela - neutro para objetos ou animais).' },
      { type: 'example', content: 'Ni (Nós), Ili (Eles/Elas).' },
      { type: 'text', content: 'Curiosidade: "Vi" serve tanto para o singular quanto para o plural (você/vocês), simplificando muito o aprendizado!' },
      { type: 'question', content: 'Como se diz "Ela" em Esperanto?', options: ['Mi', 'Li', 'Ŝi'], correctAnswer: 'Ŝi', explanation: '"Ŝi" (pronunciado como o "ch" de bicho) é ela.' },
      { type: 'text', content: 'Para transformar pronome em possessivo (meu, seu, nosso), basta adicionar a terminação de adjetivo -A.' },
      { type: 'example', content: '"Mia" (Meu/Minha), "Via" (Teu/Seu), "Nia" (Nosso/Nossa).' },
      { type: 'question', content: 'Como se traduziria "Nosso amigo"? (Amiko = Amigo)', options: ['Nia amikon', 'Nia amiko', 'Mi amiko'], correctAnswer: 'Nia amiko', explanation: 'Nia (Nosso) + amiko (Amigo).' }
    ]
  },
  {
    id: 'l7',
    title: 'Números e Contagem',
    description: 'Aprenda a contar de 1 a 10 e além.',
    parts: [
      { type: 'text', content: 'Contar no Esperanto é extremamente lógico e segue o sistema decimal de forma pura.' },
      { type: 'example', content: '1: Unu, 2: Du, 3: Tri, 4: Kvar, 5: Kvin, 6: Ses, 7: Sep, 8: Ok, 9: Naŭ, 10: Dek.' },
      { type: 'text', content: 'De 11 a 19, basta dizer "Dek" (10) seguido do número.' },
      { type: 'example', content: '11: Dek unu (10 e 1), 12: Dek du, 19: Dek naŭ.' },
      { type: 'text', content: 'Para dezenas (20, 30...), colocamos o número ANTES do "Dek".' },
      { type: 'example', content: '20: Dudek (2 dezes), 30: Tridek, 90: Naŭdek.' },
      { type: 'question', content: 'Como se diz "Vinte e dois" (22)?', options: ['Dudek du', 'Dek du du', 'Dudek dek'], correctAnswer: 'Dudek du', explanation: 'Dudek (20) + du (2).' },
      { type: 'text', content: 'Cent (100) e Mil (1000) seguem a mesma regra lógica. "Dukvarcent" seria 2.400?' },
      { type: 'question', content: 'Qual o valor de "Kvindek tri"?', options: ['53', '35', '15'], correctAnswer: '53', explanation: 'Kvin (5) + dek (dezes) + tri (3) = 53.' }
    ]
  },
  {
    id: 'l8',
    title: 'Afixos: O Poder de Criação',
    description: 'Crie centenas de palavras a partir de uma única raiz.',
    parts: [
      { type: 'text', content: 'O Esperanto é como um Lego. Você tem peças básicas (raízes) e adiciona prefixos e sufixos para mudar o sentido de forma matemática.' },
      { type: 'text', content: 'Prefixo "MAL-": Inverte completamente o sentido. É o oposto perfeito.' },
      { type: 'example', content: '"Bona" (Bom) -> "Malbona" (Mau). "Granda" (Grande) -> "Malgranda" (Pequeno).' },
      { type: 'question', content: 'Se "Alta" é alto, o que significa "Malalta"?', options: ['Muito alto', 'Baixo', 'Largo'], correctAnswer: 'Baixo', explanation: 'Mal- inverte o sentido de altura, resultando em baixo.' },
      { type: 'text', content: 'Sufixo "-IN-": Indica o gênero feminino.' },
      { type: 'example', content: '"Patro" (Pai) -> "Patrino" (Mãe). "Frato" (Irmão) -> "Fratino" (Irmã).' },
      { type: 'combine', content: 'Vamos praticar! Como se diz "Mãe" (Pai feminino)?', root: 'Patr', options: ['-in-o', '-eg-o', '-et-o'], correctAnswer: '-in-o', targetMeaning: 'Mãe', explanation: 'Patr (Pai) + -in- (Feminino) + -o (Substantivo) = Patrino.' },
      { type: 'text', content: 'Sufixos "-EG-" e "-ET-": Aumentativo e Diminutivo.' },
      { type: 'example', content: '"Domo" (Casa) -> "Domego" (Casarão) / "Dometo" (Casinha).' },
      { type: 'text', content: 'Sufixo "-IST-": Indica profissão ou alguém que se ocupa habitualmente de algo.' },
      { type: 'example', content: '"Instrui" (Ensinar) -> "Instruisto" (Professor). "Arto" (Arte) -> "Artisto" (Artista).' },
      { type: 'question', content: 'Qual seria o profissional que trabalha com dentes? (Dento = Dente)', options: ['Dentisto', 'Mal-dento', 'Dent-ino'], correctAnswer: 'Dentisto', explanation: 'O sufixo -ist indica o profissional da área.' }
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

const THEME_CONTENT: Record<string, { intro: string, questions: {q: string, o: string[], a: string, e: string}[] }> = {
  'Natureza': {
    intro: 'A natureza (Naturo) é descrita com precisão no Esperanto. Usamos o sufixo "-aro" para grupos. Assim, de "Arbo" (árvore) temos "Arbaro" (floresta). De "Membro" (membro) temos "Membraro" (corpo/conjunto de membros).',
    questions: [
      { q: 'O que é um "Birdo"?', o: ['Pássaro', 'Peixe', 'Inseto'], a: 'Pássaro', e: 'Birdo é uma raiz internacional que lembra o inglês "Bird".' },
      { q: 'Se "Floro" é flor, o que é um "Floraro"?', o: ['Uma flor grande', 'Um buquê ou jardim', 'Uma flor murcha'], a: 'Um buquê ou jardim', e: 'O sufixo -ar- indica um conjunto ou coletivo de coisas iguais.' },
      { q: 'Qual o oposto de "Bela floro" (Bela flor)?', o: ['Malbela floro', 'Bela malfloro', 'Granda floro'], a: 'Malbela floro', e: 'O prefixo Mal- inverte a qualidade (adjetivo).' }
    ]
  },
  'Tecnologia': {
    intro: 'O Esperanto cria palavras técnicas unindo funções e ferramentas. O sufixo "-ilo" (instrumento) é rei aqui. "Komputi" (computar) + "ilo" = "Komputilo" (computador). "Ludi" (jogar) + "ilo" = "Ludilo" (brinquedo/joystick).',
    questions: [
      { q: 'O que é um "Reto"?', o: ['Rede/Internet', 'Roda', 'Retângulo'], a: 'Rede/Internet', e: 'Reto significa rede, e por extensão, a Internet (Interreto).' },
      { q: 'O que faz um "Presilo"? (Presi = Imprimir)', o: ['Scanner', 'Impressora', 'Monitor'], a: 'Impressora', e: 'Presi (imprimir) + ilo (ferramenta) = Impressora.' },
      { q: 'Como se diz "Software"?', o: ['Softvaro', 'Programaro', 'Mola kodo'], a: 'Softvaro', e: 'Muitas palavras técnicas usam o sufixo -var- para conjuntos de mercadorias ou sistemas.' }
    ]
  },
  'Viagem': {
    intro: 'Viajar (Vojaĝi) é fundamental na cultura esperantista. Termos de transporte facilitam a comunicação internacional. De "Vojo" (caminho) temos "Vojaĝi" (viajar).',
    questions: [
      { q: 'O que significa "Aviadilo"?', o: ['Avião', 'Navio', 'Trem'], a: 'Avião', e: 'Avi- (voar) + ad (ação) + ilo (ferramenta).' },
      { q: 'Onde você pegaria um trem?', o: ['Stacidomo', 'Flughaveno', 'Vendejo'], a: 'Stacidomo', e: 'Stacio (estação) + domo (casa).' },
      { q: 'O que é um "Bileto"?', o: ['Passagem/Bilhete', 'Dinheiro', 'Mapa'], a: 'Passagem/Bilhete', e: 'Raiz internacional fácil de reconhecer.' }
    ]
  },
  'Saúde': {
    intro: 'Saúde (Sano) e medicina usam sufixos como "-isto" (profissional) e "-ejo" (local). "Kuraci" (curar) gera "Kuracisto" (médico) e "Kuracejo" (clínica).',
    questions: [
      { q: 'Como se diz "Doutor"?', o: ['Doktoro', 'Kuracisto', 'Sanigisto'], a: 'Kuracisto', e: 'Embora Doktoro exista para títulos acadêmicos, o médico é chamado de Kuracisto.' },
      { q: 'Qual a diferença entre "Sana" e "Malsana"?', o: ['Sério e Brincalhão', 'Saudável e Doente', 'Forte e Fraco'], a: 'Saudável e Doente', e: 'Mal- inverte o sentido de Sano (saúde).' },
      { q: 'O que é o "Kapo"?', o: ['Coração', 'Cabeça', 'Mão'], a: 'Cabeça', e: 'Raiz internacional vinda do latim.' }
    ]
  },
  'Culinária': {
    intro: 'Culinária envolve Manĝi (Comer) e Trinki (Beber). Utensílios usam "-ilo", locais usam "-ejo". "Manĝejo" é refeitório ou restaurante.',
    questions: [
      { q: 'O que é "Forko"?', o: ['Garfo', 'Faca', 'Colher'], a: 'Garfo', e: 'Raiz similar ao inglês "Fork" e francês "Fourchette".' },
      { q: 'Como se diz "Açúcar"?', o: ['Sukero', 'Dolĉo', 'Salo'], a: 'Sukero', e: 'Raiz internacional.' },
      { q: 'O que significa "Trinkaĵo"? (Trinki = Beber)', o: ['Alimento', 'Bebida', 'Copo'], a: 'Bebida', e: 'O sufixo -aĵ- indica algo concreto feito de uma raiz.' }
    ]
  },
  'Música': {
    intro: 'Música (Muziko) é celebrada com "Kanto" (canção). O verbo "Aŭskulti" (escutar) é essencial para qualquer fã.',
    questions: [
      { q: 'O que é um "Aŭskultanto"?', o: ['Ouvinte', 'Cantor', 'Músico'], a: 'Ouvinte', e: 'Aŭskulti (ouvir) + ant- (quem faz) + o (indivíduo).' },
      { q: 'Qual o nome do "Violão"?', o: ['Gitaro', 'Violono', 'Fluto'], a: 'Gitaro', e: 'Raiz internacional.' },
      { q: 'O que significa "Kanti"?', o: ['Dançar', 'Cantar', 'Tocar'], a: 'Cantar', e: 'Do latim "cantare".' }
    ]
  },
  'Trabalho': {
    intro: 'No trabalho (Laboro), temos o "Oficejo" (escritório). O sufixo "-estro" indica quem lidera (chefe). "Lernejestro" seria o diretor de escola.',
    questions: [
      { q: 'O que é um "Laboristo"?', o: ['Trabalhador', 'Escritório', 'Fábrica'], a: 'Trabalhador', e: 'Labor- (trabalho) + ist- (quem exerce).' },
      { q: 'Como se diz "Salário"?', o: ['Salajro', 'Mono', 'Prezo'], a: 'Salajro', e: 'Raiz internacional.' },
      { q: 'O que é o "Estro"?', o: ['O Chefe', 'O Empregado', 'O Cliente'], a: 'O Chefe', e: 'Estro é o líder de qualquer organização.' }
    ]
  },
  'Sentimentos': {
    intro: 'Sentimentos (Sentoj) como Amo (Amor) e Espero (Esperança) são a alma da língua. O prefixo "BO-" indica parentesco por afinidade (casamento). "Bopatro" é o sogro.',
    questions: [
      { q: 'Como se diz "Infeliz"?', o: ['Malfeliĉa', 'Ne-feliĉa', 'Trista'], a: 'Malfeliĉa', e: 'Prefixo Mal- cria o oposto direto de Feliĉa.' },
      { q: 'O que é "Ami"?', o: ['Gostar', 'Amar', 'Odiar'], a: 'Amar', e: 'Raiz latina.' },
      { q: 'O que significa "Ĝojo"?', o: ['Raiva', 'Alegria', 'Medo'], a: 'Alegria', e: 'Ĝoji é estar alegre.' }
    ]
  },
  'Comunicações': {
    intro: 'Comunicação evoluiu de "Letero" (carta) para "Retpoŝto" (e-mail). O verbo "Paroli" (falar) diferencia o ser humano.',
    questions: [
      { q: 'Como se diz "Escrever"?', o: ['Skribi', 'Legi', 'Diri'], a: 'Skribi', e: 'Raiz latina.' },
      { q: 'O que é "Lingvo"?', o: ['Língua/Idioma', 'Palavra', 'Som'], a: 'Língua/Idioma', e: 'Vem do latim "lingua".' },
      { q: 'O que significa "Diri"?', o: ['Falar', 'Dizer', 'Ouvir'], a: 'Dizer', e: 'Diri é dizer algo específico. Paroli é o ato de falar.' }
    ]
  },
  'Compras': {
    intro: 'Em uma "Butiko" (loja), você usa "Mono" (dinheiro) para "Aĉeti" (comprar). "Vendi" (vender) é o oposto.',
    questions: [
      { q: 'Qual o nome do "Preço"?', o: ['Prezo', 'Kosto', 'Valoro'], a: 'Prezo', e: 'Raiz internacional.' },
      { q: 'O que é a "Monujo"?', o: ['Moeda', 'Carteira', 'Banco'], a: 'Carteira', e: 'Mon- (dinheiro) + uj- (recipiente) + o (coisa).' },
      { q: 'Como se diz "Barato"?', o: ['Libera', 'Malmultekosta', 'Malalta'], a: 'Malmultekosta', e: 'Literalmente "Mal" (oposto) "multe" (muito) "kosta" (caro).' }
    ]
  }
};

const GENERATED_LESSONS: Lesson[] = Array.from({ length: 92 }, (_, i) => {
  const idNum = i + 9;
  const theme = THEMES[i % THEMES.length];
  const content = THEME_CONTENT[theme.name] || { 
    intro: `Nesta unidade exploraremos o vocabulário de ${theme.name.toLowerCase()}. O Esperanto preza pela clareza e termos internacionais.`,
    questions: [{ q: `Qual o foco de ${theme.name}?`, o: [theme.name, 'Gramática pura', 'Nada'], a: theme.name, e: 'Foco na imersão temática.' }]
  };
  const termIdx = Math.floor(i / THEMES.length) % theme.terms.length;
  const term = theme.terms[termIdx];
  const nextTerm = theme.terms[(termIdx + 1) % theme.terms.length];
  const question = content.questions[i % content.questions.length];
  
  return {
    id: `l${idNum}`,
    title: `${theme.name}: Módulo ${Math.floor(i / THEMES.length) + 1}`,
    description: `Lição ${idNum}: Domine termos como "${term}" e "${nextTerm}" no contexto de ${theme.name.toLowerCase()}.`,
    parts: [
      { type: 'icon', content: `Domínio de ${theme.name}`, iconName: theme.icon },
      { type: 'text', content: content.intro },
      { type: 'text', content: `No contexto de ${theme.name.toLowerCase()}, aprenderemos palavras essenciais para a comunicação diária.` },
      { type: 'example', content: `Palavra-chave 1: "${term}" é fundamental para expressar conceitos neste tema.` },
      { type: 'example', content: `Palavra-chave 2: "${nextTerm}" complementa o sentido de frases sobre ${theme.name.toLowerCase()}.` },
      { type: 'text', content: 'Tente associar essas palavras com imagens mentais para facilitar a memorização.' },
      {
        type: 'question',
        content: question.q,
        options: question.o,
        correctAnswer: question.a,
        explanation: question.e
      },
      { type: 'text', content: 'Continue praticando para alcançar a fluência! Cada palavra conta.' }
    ]
  };
});

const SAMPLE_LESSONS: Lesson[] = [...MANUAL_LESSONS, ...GENERATED_LESSONS];

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
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [maxVisitedIndex, setMaxVisitedIndex] = useState(0); // Track progress for review jumping
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [focusedOptionIndex, setFocusedOptionIndex] = useState<number>(-1);
  const lessonContainerRef = useRef<HTMLDivElement>(null);

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
      setSelectedLesson(null);
      setCurrentPartIndex(0);
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

  const filteredLessons = isOnline 
    ? SAMPLE_LESSONS 
    : SAMPLE_LESSONS.filter(l => downloadedLessons.includes(l.id));

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
          <div className="bg-slate-50 border-b border-slate-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm font-black ring-1 ring-slate-200">
                {currentPartIndex + 1}
              </div>
              <div>
                <h3 className="font-black text-slate-900">{selectedLesson.title}</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Progresso na Unidade</p>
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
                    className="my-10 flex flex-col items-center justify-center p-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200"
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
          <p className="text-slate-500 max-w-2xl text-lg font-medium">Módulos sequenciais projetados para levar você do zero ao nível básico em tempo recorde.</p>
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
        <div className="bento-card p-20 text-center flex flex-col items-center">
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
                className="group relative bento-card p-10 flex flex-col justify-between"
              >
                <div 
                  onClick={() => {
                    setSelectedLesson(lesson);
                    setCurrentPartIndex(0);
                    setMaxVisitedIndex(0);
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
