export interface DictionaryEntry {
  word: string;
  translation: string;
  example: string;
  exampleTranslation: string;
  category: string;
}

export const DICTIONARY: DictionaryEntry[] = [
  { word: 'Saluton', translation: 'Olá', example: 'Saluton, amiko!', exampleTranslation: 'Olá, amigo!', category: 'Saudações' },
  { word: 'Dankon', translation: 'Obrigado', example: 'Dankon pro la helpo.', exampleTranslation: 'Obrigado pela ajuda.', category: 'Saudações' },
  { word: 'Bonvolu', translation: 'Por favor', example: 'Bonvolu sidiĝi.', exampleTranslation: 'Por favor, sente-se.', category: 'Saudações' },
  { word: 'Kiel vi fartas?', translation: 'Como vai você?', example: 'Kiel vi fartas hodiaŭ?', exampleTranslation: 'Como vai você hoje?', category: 'Saudações' },
  { word: 'Paco', translation: 'Paz', example: 'Ni volas pacon en la mondo.', exampleTranslation: 'Queremos paz no mundo.', category: 'Abstrato' },
  { word: 'Amo', translation: 'Amor', example: 'Amo ĉiam venkas.', exampleTranslation: 'O amor sempre vence.', category: 'Abstrato' },
  { word: 'Birdo', translation: 'Pássaro', example: 'La birdo flugas alte.', exampleTranslation: 'O pássaro voa alto.', category: 'Natureza' },
  { word: 'Floro', translation: 'Flor', example: 'La floro estas ruĝa.', exampleTranslation: 'A flor é vermelha.', category: 'Natureza' },
  { word: 'Granda', translation: 'Grande', example: 'Tio estas granda hundo.', exampleTranslation: 'Aquele é um cachorro grande.', category: 'Adjetivos' },
  { word: 'Malgranda', translation: 'Pequeno', example: 'Mi loĝas en malgranda domo.', exampleTranslation: 'Eu moro em uma casa pequena.', category: 'Adjetivos' },
  { word: 'Bona', translation: 'Bom', example: 'Vi estas bona lernanto.', exampleTranslation: 'Você é um bom aluno.', category: 'Adjetivos' },
  { word: 'Malbona', translation: 'Mau', example: 'Tio estas malbona ideo.', exampleTranslation: 'Aquela é uma ideia ruim.', category: 'Adjetivos' },
  { word: 'Bela', translation: 'Belo/Bonito', example: 'La sunsubiro estas bela.', exampleTranslation: 'O pôr do sol é bonito.', category: 'Adjetivos' },
  { word: 'Vidi', translation: 'Ver', example: 'Mi vidas vin.', exampleTranslation: 'Eu vejo você.', category: 'Verbos' },
  { word: 'Aŭdi', translation: 'Ouvir', example: 'Mi aŭdas muzikon.', exampleTranslation: 'Eu ouço música.', category: 'Verbos' },
  { word: 'Manĝi', translation: 'Comer', example: 'Kion vi manĝas?', exampleTranslation: 'O que você está comendo?', category: 'Verbos' },
  { word: 'Trinki', translation: 'Beber', example: 'Mi trinkas akvon.', exampleTranslation: 'Eu bebo água.', category: 'Verbos' },
  { word: 'Lerni', translation: 'Aprender', example: 'Ni lernas Esperanton.', exampleTranslation: 'Nós aprendemos Esperanto.', category: 'Verbos' },
  { word: 'Paroli', translation: 'Falar', example: 'Ĉu vi parolas la anglan?', exampleTranslation: 'Você fala inglês?', category: 'Verbos' },
  { word: 'Hundo', translation: 'Cachorro', example: 'La hundo bojas.', exampleTranslation: 'O cachorro late.', category: 'Animais' },
  { word: 'Kato', translation: 'Gato', example: 'Mia kato dormas.', exampleTranslation: 'Meu gato está dormindo.', category: 'Animais' },
  { word: 'Domo', translation: 'Casa', example: 'Nia domo estas verda.', exampleTranslation: 'Nossa casa é verde.', category: 'Cotidiano' },
  { word: 'Tablo', translation: 'Mesa', example: 'La libro estas sur la tablo.', exampleTranslation: 'O livro está em cima da mesa.', category: 'Cotidiano' },
  { word: 'Libro', translation: 'Livro', example: 'Mi legas bonan libron.', exampleTranslation: 'Estou lendo um bom livro.', category: 'Cotidiano' },
  { word: 'Skribi', translation: 'Escrever', example: 'Mi skribas leteron.', exampleTranslation: 'Estou escrevendo uma carta.', category: 'Verbos' },
];
