import React, { useState, useEffect, useCallback } from 'react';
import { RotateCcw, Lock, Hand, Zap, Target, Settings } from 'lucide-react';

export default function TypingPracticeGame() {
  const [currentScreen, setCurrentScreen] = useState('menu');
  const [gameActive, setGameActive] = useState(false);
  const [language, setLanguage] = useState(null);
  const [mode, setMode] = useState('sequence');
  const [level, setLevel] = useState('words');
  const [keyboardLayout, setKeyboardLayout] = useState(null);
  const [setupStep, setSetupStep] = useState('language');
  const [uiLanguage, setUiLanguage] = useState('en');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [speed, setSpeed] = useState(3);
  const [handModality, setHandModality] = useState('both');
  const [hoveredButton, setHoveredButton] = useState(null);
  
  const [currentPhrase, setCurrentPhrase] = useState('');
  const [currentPattern, setCurrentPattern] = useState('');
  const [patternIndex, setPatternIndex] = useState(0);
  const [sequenceStep, setSequenceStep] = useState(0);
  
  const [flashingKey, setFlashingKey] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);
  const [autoDetectedLayout, setAutoDetectedLayout] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [keyJustCorrect, setKeyJustCorrect] = useState(false);

  const layouts = {
    'en-us': {
      q: 'a', a: 'a', z: 'a', w: 's', s: 's', x: 's', e: 'd', d: 'd', c: 'd',
      r: 'f', f: 'f', v: 'f', t: 'g', g: 'g', b: 'g', y: 'h', h: 'h', n: 'h',
      u: 'j', j: 'j', m: 'j', i: 'k', k: 'k', ',': 'k', o: 'l', l: 'l', '.': 'l',
      p: ';', ';': ';', '-': ';', ' ': ' '
    },
    'es-mx': {
      q: 'a', a: 'a', z: 'a', w: 's', s: 's', x: 's', e: 'd', d: 'd', c: 'd',
      r: 'f', f: 'f', v: 'f', t: 'g', g: 'g', b: 'g', y: 'h', h: 'h', n: 'h',
      u: 'j', j: 'j', m: 'j', i: 'k', k: 'k', ',': 'k', o: 'l', l: 'l', '.': 'l',
      p: ';', ';': ';', ñ: ';', ' ': ' '
    }
  };

  const frequencyPatterns = {
    english: {
      bigrams: ['re', 'er', 'te', 'ed', 'at', 'ar', 'no', 'on', 'in', 'he', 'en', 'ne', 'me', 'th', 'st', 'an', 'to', 'it', 'is', 'go'],
      trigrams: ['the', 'ing', 'and', 'ent', 'ion', 'ter', 'ere', 'tag', 'bag', 'big', 'hag', 'hot', 'hat', 'red', 'are', 'eat', 'her'],
      words: ['mama', 'papa', 'water', 'better', 'under', 'enter', 'their', 'tag', 'bag', 'big', 'hag', 'hot', 'hat', 'that', 'night', 'there']
    },
    spanish: {
      bigrams: ['ne', 'en', 'er', 're', 'ra', 'ta', 'ar', 'at', 'ee', 'ce', 'te', 'eo', 'co', 'on', 'om', 'or', 'ot', 'ri', 'ti', 'an'],
      trigrams: ['ene', 'ent', 'rar', 'tar', 'ner', 'net', 'eon', 'con', 'cer', 'der', 'tra', 'gra', 'ere', 'ete', 'men', 'tie'],
      words: ['mama', 'papa', 'menos', 'tiene', 'entre', 'tierra', 'manera', 'noche', 'nene', 'tener', 'ente', 'gente', 'rato', 'grato', 'tres', 'tren']
    }
  };

  const translations = {
    en: {
      appTitle: 'Type-Oh!',
      appSubtitle: 'Improve your typing skills with interactive games',
      patternTrainer: 'Pattern Finger Trainer',
      patternDesc: 'Train finger positions through patterns',
      speedTyper: 'Speed Typer',
      speedDesc: 'Increase your typing speed',
      accuracyMaster: 'Accuracy Master',
      accuracyDesc: 'Perfect your typing accuracy',
      playNow: 'Play Now',
      comingSoon: 'Coming Soon',
      selectLanguage: 'Select Your Language',
      selectKeyboard: 'Select Keyboard Layout',
      configureTraining: 'Configure Training',
      selectMode: 'Select Mode',
      selectLevel: 'Select Level',
      selectSpeed: 'Select Speed',
      selectHand: 'Hand Modality',
      both: 'Both Hands',
      rightHand: 'Right Hand',
      leftHand: 'Left Hand',
      perCharacter: 'Per-Character',
      sequence: 'Sequence',
      bigrams: 'Bigrams',
      trigrams: 'Trigrams',
      words: 'Words',
      slow: 'Slow',
      normal: 'Normal',
      fast: 'Fast',
      veryFast: 'Very Fast',
      extreme: 'Extreme',
      startTraining: 'Start Training',
      stopTraining: 'Stop Training',
      score: 'Score',
      streak: 'Streak',
      mistakes: 'Mistakes',
      progress: 'Progress',
      currentlyTyping: 'Currently typing:',
      typeThis: 'Type this sequence:',
      chooseLanguage: 'Choose your language to load frequency-optimized training patterns',
      trainFinger: 'Train finger positions through patterns'
    },
    es: {
      appTitle: 'Type-Oh!',
      appSubtitle: 'Entrena tus dedos en el teclado',
      patternTrainer: 'Entrena las posiciones de los dedos',
      patternDesc: 'Teclea con el dedo correcto',
      speedTyper: 'Escritura Rápida',
      speedDesc: 'Aumenta tu velocidad de escritura',
      accuracyMaster: 'Maestro de Precisión',
      accuracyDesc: 'Perfecciona la precisión de tu escritura',
      playNow: 'Jugar Ahora',
      comingSoon: 'Próximamente',
      selectLanguage: 'Selecciona tu Idioma',
      selectKeyboard: 'Selecciona la Disposición del Teclado',
      configureTraining: 'Configura el Entrenamiento',
      selectMode: 'Selecciona el Modo',
      selectLevel: 'Selecciona el Nivel',
      selectSpeed: 'Selecciona la Velocidad',
      selectHand: 'Modalidad de Mano',
      both: 'Ambas Manos',
      rightHand: 'Mano Derecha',
      leftHand: 'Mano Izquierda',
      perCharacter: 'Por Carácter',
      sequence: 'Secuencia',
      bigrams: 'Bigramas',
      trigrams: 'Trigramas',
      words: 'Palabras',
      slow: 'Lento',
      normal: 'Normal',
      fast: 'Rápido',
      veryFast: 'Muy Rápido',
      extreme: 'Extremo',
      startTraining: 'Comenzar Entrenamiento',
      stopTraining: 'Detener Entrenamiento',
      score: 'Puntuación',
      streak: 'Racha',
      mistakes: 'Errores',
      progress: 'Progreso',
      currentlyTyping: 'Escribiendo actualmente:',
      typeThis: 'Escribe esta secuencia:',
      chooseLanguage: 'Elige tu idioma para cargar patrones de entrenamiento optimizados por frecuencia',
      trainFinger: 'Entrena las posiciones de los dedos a través de patrones'
    }
  };

  const t = (key) => translations[uiLanguage]?.[key] || key;

  const layoutOptions = [
    { code: 'en-us', label: 'English (United States)', region: 'US', special: ';' },
    { code: 'es-mx', label: 'Spanish (Mexico)', region: 'Latin American', special: 'ñ' }
  ];

  const languageOptions = [
    { code: 'english', label: 'English' },
    { code: 'spanish', label: 'Español' }
  ];

  const gamesList = [
    { id: 1, icon: Hand, gradient: 'from-rose-400 to-pink-500', status: 'available' },
    { id: 2, icon: Zap, gradient: 'from-teal-400 to-cyan-500', status: 'coming' },
    { id: 3, icon: Target, gradient: 'from-orange-500 to-red-500', status: 'coming' }
  ];

  const phraseToPattern = useCallback((phrase) => {
    return phrase.split('').map(char => layouts[keyboardLayout]?.[char.toLowerCase()] || '?').join('');
  }, [keyboardLayout]);

  const selectLanguage = (lang) => {
    setLanguage(lang);
    setSetupStep('layout');
  };

  const selectLayout = (layout) => {
    setKeyboardLayout(layout);
  };

  useEffect(() => {
    if (autoDetectedLayout && setupStep === 'layout') {
      setKeyboardLayout(autoDetectedLayout);
    }
  }, [autoDetectedLayout, setupStep]);

  const getKeySequence = useCallback((key) => {
    const sequences = { g: ['g', 'f'], h: ['h', 'j'] };
    return sequences[key] || [key];
  }, []);

  const nextPattern = useCallback(() => {
    const patterns = frequencyPatterns[language]?.[level] || [];
    if (patterns.length === 0) return;
    
    let validPatterns = patterns;
    
    if (handModality === 'right') {
      validPatterns = patterns.filter(p => p.split('').every(char => ['h', 'j', 'k', 'l', ';', ' '].includes(char.toLowerCase())));
    } else if (handModality === 'left') {
      validPatterns = patterns.filter(p => p.split('').every(char => ['a', 's', 'd', 'f', 'g', ' '].includes(char.toLowerCase())));
    }
    
    if (validPatterns.length === 0) {
      const defaultPhrase = handModality === 'right' ? 'hj' : handModality === 'left' ? 'as' : 'mama';
      setCurrentPhrase(defaultPhrase);
      setCurrentPattern(phraseToPattern(defaultPhrase));
      setPatternIndex(0);
      setSequenceStep(0);
      return;
    }
    
    const phrase = validPatterns[Math.floor(Math.random() * validPatterns.length)];
    setCurrentPhrase(phrase);
    setCurrentPattern(phraseToPattern(phrase));
    setPatternIndex(0);
    setSequenceStep(0);
  }, [language, level, handModality, phraseToPattern]);

  const startGame = useCallback(() => {
    if (!language || !keyboardLayout) return;
    
    const patterns = frequencyPatterns[language]?.[level] || [];
    if (patterns.length === 0) return;
    
    let validPatterns = patterns;
    
    if (handModality === 'right') {
      validPatterns = patterns.filter(p => p.split('').every(char => ['h', 'j', 'k', 'l', ';', ' '].includes(char.toLowerCase())));
    } else if (handModality === 'left') {
      validPatterns = patterns.filter(p => p.split('').every(char => ['a', 's', 'd', 'f', 'g', ' '].includes(char.toLowerCase())));
    }
    
    if (validPatterns.length === 0) {
      const defaultPhrase = handModality === 'right' ? 'hj' : handModality === 'left' ? 'as' : 'mama';
      setCurrentPhrase(defaultPhrase);
      setCurrentPattern(phraseToPattern(defaultPhrase));
    } else {
      const phrase = validPatterns[Math.floor(Math.random() * validPatterns.length)];
      setCurrentPhrase(phrase);
      setCurrentPattern(phraseToPattern(phrase));
    }
    
    setPatternIndex(0);
    setSequenceStep(0);
    setScore(0);
    setStreak(0);
    setMistakes(0);
    setSetupStep(null);
    setGameActive(true);
  }, [language, keyboardLayout, level, handModality, phraseToPattern]);



  const handleKeyPress = useCallback((e) => {
    if (!gameActive || !currentPattern) return;

    const key = e.key === ' ' ? ' ' : e.key?.toLowerCase?.();
    if (!key) return;

    const validKeys = new Set(['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', ' ']);
    if (!validKeys.has(key)) return;

    const currentPatternKey = currentPattern[patternIndex];
    const expectedSequence = getKeySequence(currentPatternKey);
    const expectedKey = expectedSequence[sequenceStep];

    if (key === expectedKey) {
      setFlashingKey(key);
      setKeyJustCorrect(true);
      
      const speedDelays = {
        1: { flash: 200, transition: 200 },
        2: { flash: 150, transition: 150 },
        3: { flash: 50, transition: 50 },
        4: { flash: 30, transition: 30 },
        5: { flash: 15, transition: 15 }
      };
      
      const delays = speedDelays[speed];
      
      setTimeout(() => {
        setFlashingKey(null);
        setTimeout(() => {
          setKeyJustCorrect(false);
          if (sequenceStep < expectedSequence.length - 1) {
            setSequenceStep(sequenceStep + 1);
          } else {
            const newPatternIdx = patternIndex + 1;
            setSequenceStep(0);
            
            if (newPatternIdx >= currentPattern.length) {
              setScore(s => s + 1);
              setStreak(st => st + 1);
              setTimeout(() => nextPattern(), Math.max(delays.transition, 30));
            } else {
              setPatternIndex(newPatternIdx);
            }
          }
        }, delays.transition);
      }, delays.flash);
    } else {
      setMistakes(m => m + 1);
      setStreak(0);
      setErrorMessage('Wrong key!');
    }
  }, [gameActive, currentPattern, patternIndex, sequenceStep, speed, getKeySequence, nextPattern]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 400);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (keyJustCorrect) {
      const timer = setTimeout(() => setKeyJustCorrect(false), 300);
      return () => clearTimeout(timer);
    }
  }, [keyJustCorrect]);

  useEffect(() => {
    if (gameActive) {
      const handler = (e) => handleKeyPress(e);
      window.addEventListener('keydown', handler);
      return () => window.removeEventListener('keydown', handler);
    }
  }, [gameActive, handleKeyPress]);

  useEffect(() => {
    if (gameActive && handModality) {
      setPatternIndex(0);
      setSequenceStep(0);
      nextPattern();
    }
  }, [gameActive, handModality, language, level, nextPattern]);

  const getKeySequenceAtCurrentStep = useCallback(() => {
    if (patternIndex >= currentPattern.length) return null;
    const patternKey = currentPattern[patternIndex];
    const sequence = getKeySequence(patternKey);
    return sequence[sequenceStep];
  }, [patternIndex, currentPattern, sequenceStep, getKeySequence]);

  const keyColors = {
    a: 'bg-purple-500', s: 'bg-indigo-500', d: 'bg-blue-500',
    f: 'bg-cyan-500', g: 'bg-cyan-500', h: 'bg-cyan-500', j: 'bg-cyan-500',
    k: 'bg-indigo-500', l: 'bg-blue-500', ';': 'bg-purple-500'
  };

  const getFingerInstruction = useCallback((key) => {
    if (!key) return '';
    
    const instructions = {
      'a': uiLanguage === 'en' ? 'With your left hand, using your pinky finger, type letter A' : 'Con tu mano izquierda, usando tu dedo meñique, teclea la letra A',
      's': uiLanguage === 'en' ? 'With your left hand, using your ring finger, type letter S' : 'Con tu mano izquierda, usando tu dedo anular, teclea la letra S',
      'd': uiLanguage === 'en' ? 'With your left hand, using your middle finger, type letter D' : 'Con tu mano izquierda, usando tu dedo medio, teclea la letra D',
      'f': uiLanguage === 'en' ? 'With your left hand, using your index finger, type letter F' : 'Con tu mano izquierda, usando tu dedo índice, teclea la letra F',
      'g': uiLanguage === 'en' ? 'With your left hand, using your index finger, type letter G' : 'Con tu mano izquierda, usando tu dedo índice, teclea la letra G',
      'h': uiLanguage === 'en' ? 'With your right hand, using your index finger, type letter H' : 'Con tu mano derecha, usando tu dedo índice, teclea la letra H',
      'j': uiLanguage === 'en' ? 'With your right hand, using your index finger, type letter J' : 'Con tu mano derecha, usando tu dedo índice, teclea la letra J',
      'k': uiLanguage === 'en' ? 'With your right hand, using your middle finger, type letter K' : 'Con tu mano derecha, usando tu dedo medio, teclea la letra K',
      'l': uiLanguage === 'en' ? 'With your right hand, using your ring finger, type letter L' : 'Con tu mano derecha, usando tu dedo anular, teclea la letra L',
      ';': uiLanguage === 'en' ? 'With your right hand, using your pinky finger, type semicolon' : 'Con tu mano derecha, usando tu dedo meñique, teclea punto y coma'
    };
    
    return instructions[key] || '';
  }, [uiLanguage]);

  const nextKeyToPress = getKeySequenceAtCurrentStep();

  const renderKey = (finger, label) => {
    const isNext = nextKeyToPress === finger;
    const isFlashing = flashingKey === finger;
    const isJustCorrect = keyJustCorrect && flashingKey === finger;
    const displayLabel = keyboardLayout === 'es-mx' && finger === ';' ? 'Ñ' : label;

    return (
      <div key={finger} className={`${finger === ' ' ? 'w-64 px-3 sm:w-80 sm:px-4' : 'w-10 sm:w-12'} h-10 sm:h-12 rounded-lg flex items-center justify-center font-bold text-sm sm:text-lg transition-all duration-100 ${
        isJustCorrect ? 'bg-gradient-to-r from-green-400 to-green-500 text-white shadow-lg scale-110' :
        isFlashing ? 'bg-green-500 text-white shadow-lg scale-105' :
        isNext ? `${keyColors[finger]} text-white shadow-lg scale-110` :
        'bg-slate-500 text-slate-500'
      }`}>
        {displayLabel}
      </div>
    );
  };

  if (errorMessage) {
    return (
      <div className="fixed inset-0 bg-red-500/70 flex items-center justify-center z-50">
        <div className="text-center">
          <p className="text-6xl font-bold text-white">✗</p>
          <p className="text-4xl font-bold text-white mt-4">{errorMessage}</p>
        </div>
      </div>
    );
  }

  if (currentScreen === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 text-slate-900 overflow-hidden relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-72 h-72 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="absolute top-20 left-16 w-16 h-16 bg-white/40 rounded-lg border border-slate-300/40"></div>
        <div className="absolute top-32 left-32 w-12 h-12 bg-white/40 rounded-lg border border-slate-300/40"></div>
        <div className="absolute top-40 right-40 w-20 h-20 bg-white/40 rounded-lg border border-slate-300/40"></div>
        <div className="absolute top-64 left-1/4 w-14 h-14 bg-white/40 rounded-lg border border-slate-300/40"></div>
        <div className="absolute bottom-32 right-24 w-16 h-16 bg-white/40 rounded-lg border border-slate-300/40"></div>
        <div className="absolute bottom-48 left-20 w-12 h-12 bg-white/40 rounded-lg border border-slate-300/40"></div>
        <div className="absolute top-1/3 right-20 w-14 h-14 bg-white/40 rounded-lg border border-slate-300/40"></div>

        <div className="fixed top-8 right-8 flex gap-2 z-50">
          <button 
            onMouseEnter={() => setHoveredButton('lang-en')}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={() => setUiLanguage('en')} 
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${uiLanguage === 'en' ? 'bg-blue-500 text-white shadow-lg' : hoveredButton === 'lang-en' ? 'bg-white text-blue-600 shadow-md' : 'bg-white/80 text-slate-700'}`}
          >
            EN
          </button>
          <button 
            onMouseEnter={() => setHoveredButton('lang-es')}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={() => setUiLanguage('es')} 
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${uiLanguage === 'es' ? 'bg-blue-500 text-white shadow-lg' : hoveredButton === 'lang-es' ? 'bg-white text-blue-600 shadow-md' : 'bg-white/80 text-slate-700'}`}
          >
            ES
          </button>
        </div>

        <div className="relative z-10 container mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h1 className="text-7xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-teal-600 to-orange-600 bg-clip-text text-transparent leading-tight pb-2">Type-Oh!</h1>
            <p className="text-xl text-slate-600">{t('appSubtitle')}</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {gamesList.map((game) => {
              const Icon = game.icon;
              const isAvailable = game.status === 'available';
              const gameNames = [t('patternTrainer'), t('speedTyper'), t('accuracyMaster')];
              const gameDescs = [t('patternDesc'), t('speedDesc'), t('accuracyDesc')];
              
              return (
                <div key={game.id} onMouseEnter={() => setHoveredCard(game.id)} onMouseLeave={() => setHoveredCard(null)} className={`relative group transition-all duration-300 ${hoveredCard === game.id ? 'scale-105' : ''}`}>
                  <div className={`relative bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/50 shadow-lg ${isAvailable ? 'hover:border-blue-400/50 hover:shadow-xl' : 'opacity-75'} transition-all duration-300 overflow-hidden`}>
                    {isAvailable && (
                      <div className={`absolute inset-0 bg-gradient-to-r ${game.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                    )}
                    
                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className={`p-4 rounded-xl bg-gradient-to-r ${game.gradient} ${!isAvailable && 'grayscale opacity-50'}`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        
                        <div>
                          <h3 className="text-2xl font-bold mb-2 flex items-center gap-3 text-slate-900">
                            {gameNames[game.id - 1]}
                            {!isAvailable && <Lock className="w-5 h-5 text-slate-400" />}
                          </h3>
                          <p className="text-slate-600">{gameDescs[game.id - 1]}</p>
                        </div>
                      </div>

                      <div>
                        {isAvailable ? (
                          <button 
                            onMouseEnter={() => setHoveredButton(`play-${game.id}`)}
                            onMouseLeave={() => setHoveredButton(null)}
                            onClick={() => { setCurrentScreen('game'); setSetupStep('language'); }} 
                            className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 text-white ${
                              hoveredButton === `play-${game.id}` 
                                ? 'bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg shadow-blue-500/50 -translate-y-1' 
                                : 'bg-gradient-to-r from-blue-500 to-blue-600 shadow-md'
                            }`}
                          >
                            {t('playNow')}
                          </button>
                        ) : (
                          <span className="px-8 py-3 bg-slate-200 rounded-xl font-semibold text-orange-600">
                            {t('comingSoon')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'game' && setupStep === 'language') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 text-slate-900 overflow-hidden relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-72 h-72 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="fixed top-8 right-8 flex gap-2 z-50">
          <button 
            onMouseEnter={() => setHoveredButton('lang-en')}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={() => setUiLanguage('en')} 
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${uiLanguage === 'en' ? 'bg-blue-500 text-white shadow-lg' : hoveredButton === 'lang-en' ? 'bg-white text-blue-600 shadow-md' : 'bg-white/80 text-slate-700'}`}
          >
            EN
          </button>
          <button 
            onMouseEnter={() => setHoveredButton('lang-es')}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={() => setUiLanguage('es')} 
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${uiLanguage === 'es' ? 'bg-blue-500 text-white shadow-lg' : hoveredButton === 'lang-es' ? 'bg-white text-blue-600 shadow-md' : 'bg-white/80 text-slate-700'}`}
          >
            ES
          </button>
        </div>

        <div className="relative z-10 container mx-auto px-6 py-20 flex items-center justify-center min-h-screen">
          <div className="max-w-3xl w-full">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/50 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <button 
                  onMouseEnter={() => setHoveredButton('back')}
                  onMouseLeave={() => setHoveredButton(null)}
                  onClick={() => setCurrentScreen('menu')} 
                  className={`px-4 py-2 rounded-lg transition-all duration-300 font-semibold ${
                    hoveredButton === 'back'
                      ? 'bg-white text-slate-900 shadow-md'
                      : 'bg-white/80 text-slate-700'
                  }`}
                >
                  ← Back
                </button>
                <div></div>
              </div>

              <div className="bg-white/40 rounded-xl p-8 mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 mb-6 text-center">{t('selectLanguage')}</h2>
                <div className="grid grid-cols-2 gap-6">
                  {languageOptions.map(option => (
                    <button 
                      key={option.code}
                      onMouseEnter={() => setHoveredButton(`select-lang-${option.code}`)}
                      onMouseLeave={() => setHoveredButton(null)}
                      onClick={() => selectLanguage(option.code)} 
                      className={`py-6 px-4 rounded-lg font-bold text-lg transition-all duration-300 text-white ${
                        hoveredButton === `select-lang-${option.code}`
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg shadow-blue-500/50 -translate-y-1'
                          : 'bg-gradient-to-r from-blue-500 to-blue-600 shadow-md'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-slate-600 text-center text-sm">{t('chooseLanguage')}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'game' && setupStep === 'layout') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 text-slate-900 overflow-hidden relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-72 h-72 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="absolute top-20 left-16 w-16 h-16 bg-white/40 rounded-lg border border-slate-300/40"></div>
        <div className="absolute bottom-32 right-24 w-16 h-16 bg-white/40 rounded-lg border border-slate-300/40"></div>

        <div className="fixed top-8 right-8 flex gap-2 z-50">
          <button 
            onMouseEnter={() => setHoveredButton('lang-en')}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={() => setUiLanguage('en')} 
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${uiLanguage === 'en' ? 'bg-blue-500 text-white shadow-lg' : hoveredButton === 'lang-en' ? 'bg-white text-blue-600 shadow-md' : 'bg-white/80 text-slate-700'}`}
          >
            EN
          </button>
          <button 
            onMouseEnter={() => setHoveredButton('lang-es')}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={() => setUiLanguage('es')} 
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${uiLanguage === 'es' ? 'bg-blue-500 text-white shadow-lg' : hoveredButton === 'lang-es' ? 'bg-white text-blue-600 shadow-md' : 'bg-white/80 text-slate-700'}`}
          >
            ES
          </button>
        </div>

        <div className="relative z-10 container mx-auto px-6 py-20 flex items-center justify-center min-h-screen">
          <div className="max-w-3xl w-full">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/50 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <button 
                  onMouseEnter={() => setHoveredButton('back')}
                  onMouseLeave={() => setHoveredButton(null)}
                  onClick={() => setSetupStep('language')} 
                  className={`px-4 py-2 rounded-lg transition-all duration-300 font-semibold ${
                    hoveredButton === 'back'
                      ? 'bg-white text-slate-900 shadow-md'
                      : 'bg-white/80 text-slate-700'
                  }`}
                >
                  ← Back
                </button>
                <div></div>
              </div>
              <p className="text-2xl font-semibold text-slate-900 mb-6 text-center">{uiLanguage === 'en' ? 'Which key does your keyboard have?' : '¿Qué tecla tiene tu teclado?'}</p>

              <div className="space-y-4 mb-8">
                {layoutOptions.map(option => (
                  <button 
                    key={option.code} 
                    onMouseEnter={() => setHoveredButton(`layout-${option.code}`)}
                    onMouseLeave={() => setHoveredButton(null)}
                    onClick={() => selectLayout(option.code)} 
                    className={`w-full p-6 rounded-xl transition-all duration-300 border-2 ${keyboardLayout === option.code ? 'bg-gradient-to-r from-blue-500 to-blue-600 border-blue-300 shadow-lg text-white transform scale-105' : hoveredButton === `layout-${option.code}` ? 'bg-blue-50 border-blue-400 shadow-md scale-102 text-slate-900' : 'bg-white/40 border-transparent text-slate-900'}`}
                  >
                    <div className="font-semibold mb-3 text-lg">{option.label}</div>
                    <div className="flex justify-center gap-8 mb-3">
                      <div className="flex justify-center gap-1">
                        <div className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold transition-all duration-300 ${keyboardLayout === option.code ? 'bg-white/30 text-white' : 'bg-slate-300/50 text-slate-700'}`}>A</div>
                        <div className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold transition-all duration-300 ${keyboardLayout === option.code ? 'bg-white/30 text-white' : 'bg-slate-300/50 text-slate-700'}`}>S</div>
                        <div className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold transition-all duration-300 ${keyboardLayout === option.code ? 'bg-white/30 text-white' : 'bg-slate-300/50 text-slate-700'}`}>D</div>
                        <div className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold transition-all duration-300 ${keyboardLayout === option.code ? 'bg-white/30 text-white' : 'bg-slate-300/50 text-slate-700'}`}>F</div>
                        <div className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold transition-all duration-300 ${keyboardLayout === option.code ? 'bg-white/30 text-white' : 'bg-slate-300/50 text-slate-700'}`}>G</div>
                      </div>
                      <div className="flex justify-center gap-1">
                        <div className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold transition-all duration-300 ${keyboardLayout === option.code ? 'bg-white/30 text-white' : 'bg-slate-300/50 text-slate-700'}`}>H</div>
                        <div className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold transition-all duration-300 ${keyboardLayout === option.code ? 'bg-white/30 text-white' : 'bg-slate-300/50 text-slate-700'}`}>J</div>
                        <div className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold transition-all duration-300 ${keyboardLayout === option.code ? 'bg-white/30 text-white' : 'bg-slate-300/50 text-slate-700'}`}>K</div>
                        <div className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold transition-all duration-300 ${keyboardLayout === option.code ? 'bg-white/30 text-white' : 'bg-slate-300/50 text-slate-700'}`}>L</div>
                        <div className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold transition-all duration-300 ${keyboardLayout === option.code ? 'bg-gradient-to-r from-rose-400 to-pink-500 text-white' : 'bg-gradient-to-r from-rose-400 to-pink-500 text-white'}`}>
                          {option.code === 'es-mx' ? 'Ñ' : ';'}
                        </div>
                      </div>
                    </div>
                    <div className={`text-xs transition-all duration-300 ${keyboardLayout === option.code ? 'text-white/80' : 'text-slate-600'}`}>{option.region} {autoDetectedLayout === option.code && '(detected)'}</div>
                  </button>
                ))}
              </div>
              
              {keyboardLayout && (
                <button 
                  onMouseEnter={() => setHoveredButton('start-training')}
                  onMouseLeave={() => setHoveredButton(null)}
                  onClick={() => startGame()}
                  className={`w-full py-3 px-6 rounded-xl font-bold text-lg transition-all duration-300 text-white ${
                    hoveredButton === 'start-training'
                      ? 'bg-gradient-to-r from-green-600 to-green-700 shadow-lg shadow-green-500/50 -translate-y-1'
                      : 'bg-gradient-to-r from-green-500 to-green-600 shadow-md'
                  }`}
                >
                  {t('startTraining')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 text-slate-900 overflow-hidden relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-72 h-72 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="fixed top-8 right-8 flex gap-2 z-50">
          <button 
            onMouseEnter={() => setHoveredButton('lang-en')}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={() => setUiLanguage('en')} 
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${uiLanguage === 'en' ? 'bg-blue-500 text-white shadow-lg' : hoveredButton === 'lang-en' ? 'bg-white text-blue-600 shadow-md' : 'bg-white/80 text-slate-700'}`}
          >
            EN
          </button>
          <button 
            onMouseEnter={() => setHoveredButton('lang-es')}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={() => setUiLanguage('es')} 
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${uiLanguage === 'es' ? 'bg-blue-500 text-white shadow-lg' : hoveredButton === 'lang-es' ? 'bg-white text-blue-600 shadow-md' : 'bg-white/80 text-slate-700'}`}
          >
            ES
          </button>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
          <div className="max-w-4xl w-full">
            <div className="bg-slate-700 rounded-lg shadow-2xl p-6 sm:p-8 h-full flex flex-col">
              <div className="grid grid-cols-4 gap-3 mb-4">
                <div className="bg-green-500 bg-opacity-20 rounded-lg p-3 text-center">
                  <p className="text-slate-300 text-xs">{t('score')}</p>
                  <p className="text-2xl font-bold text-green-400">{score}</p>
                </div>
                <div className="bg-blue-500 bg-opacity-20 rounded-lg p-3 text-center">
                  <p className="text-slate-300 text-xs">{t('streak')}</p>
                  <p className="text-2xl font-bold text-blue-400">{streak}</p>
                </div>
                <div className="bg-red-500 bg-opacity-20 rounded-lg p-3 text-center">
                  <p className="text-slate-300 text-xs">{t('mistakes')}</p>
                  <p className="text-2xl font-bold text-red-400">{mistakes}</p>
                </div>
                <div className="bg-purple-500 bg-opacity-20 rounded-lg p-3 text-center">
                  <p className="text-slate-300 text-xs">{t('progress')}</p>
                  <p className="text-2xl font-bold text-purple-400">{patternIndex}/{currentPattern.length}</p>
                </div>
              </div>

              {/* Settings Toggle Button */}
              <div className="mb-4">
                <button 
                  onClick={() => setShowSettings(!showSettings)}
                  onMouseEnter={() => setHoveredButton('settings')}
                  onMouseLeave={() => setHoveredButton(null)}
                  className={`w-full text-white px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-between ${
                    hoveredButton === 'settings'
                      ? 'bg-slate-400'
                      : 'bg-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Settings size={20} />
                    <span className="font-semibold">Settings</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded">{speed}x</span>
                    <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded">{mode === 'sequence' ? t('sequence') : t('perCharacter')}</span>
                    <span className="bg-orange-500/20 text-orange-300 px-2 py-1 rounded">{t(level)}</span>
                    <span className="bg-teal-500/20 text-teal-300 px-2 py-1 rounded">
                      {handModality === 'both' ? t('both') : handModality === 'left' ? t('leftHand') : t('rightHand')}
                    </span>
                    <span className={`transform transition-transform ${showSettings ? 'rotate-180' : ''}`}>▼</span>
                  </div>
                </button>
              </div>

              {/* Collapsible Settings Panel */}
              {showSettings && (
                <div className="space-y-4 mb-6">
                  {/* Speed Control Row */}
                  <div className="bg-slate-600 rounded-lg p-4">
                    <p className="text-slate-300 text-xs font-semibold mb-2 uppercase tracking-wide">Speed</p>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(s => (
                        <button 
                          key={s}
                          onMouseEnter={() => setHoveredButton(`speed-${s}`)}
                          onMouseLeave={() => setHoveredButton(null)}
                          onClick={() => setSpeed(s)} 
                          className={`flex-1 px-4 py-2 text-sm rounded-lg font-semibold transition-all duration-200 ${
                            speed === s 
                              ? 'bg-blue-500 text-white shadow-lg' 
                              : hoveredButton === `speed-${s}`
                              ? 'bg-slate-500 text-white'
                              : 'bg-slate-700 text-slate-300'
                          }`}
                        >
                          {s}x
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mode Control Row */}
                  <div className="bg-slate-600 rounded-lg p-4">
                    <p className="text-slate-300 text-xs font-semibold mb-2 uppercase tracking-wide">Mode</p>
                    <div className="flex gap-2">
                      {['per-character', 'sequence'].map(m => (
                        <button 
                          key={m}
                          onMouseEnter={() => setHoveredButton(`mode-${m}`)}
                          onMouseLeave={() => setHoveredButton(null)}
                          onClick={() => setMode(m)} 
                          className={`flex-1 px-4 py-2 text-sm rounded-lg font-semibold transition-all duration-200 ${
                            mode === m 
                              ? 'bg-purple-500 text-white shadow-lg' 
                              : hoveredButton === `mode-${m}`
                              ? 'bg-slate-500 text-white'
                              : 'bg-slate-700 text-slate-300'
                          }`}
                        >
                          {m === 'per-character' ? t('perCharacter') : t('sequence')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Level Control Row */}
                  <div className="bg-slate-600 rounded-lg p-4">
                    <p className="text-slate-300 text-xs font-semibold mb-2 uppercase tracking-wide">Difficulty</p>
                    <div className="flex gap-2">
                      {['bigrams', 'trigrams', 'words'].map(lvl => (
                        <button 
                          key={lvl}
                          onMouseEnter={() => setHoveredButton(`level-${lvl}`)}
                          onMouseLeave={() => setHoveredButton(null)}
                          onClick={() => setLevel(lvl)} 
                          className={`flex-1 px-4 py-2 text-sm rounded-lg font-semibold transition-all duration-200 ${
                            level === lvl 
                              ? 'bg-orange-500 text-white shadow-lg' 
                              : hoveredButton === `level-${lvl}`
                              ? 'bg-slate-500 text-white'
                              : 'bg-slate-700 text-slate-300'
                          }`}
                        >
                          {t(lvl)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Hand Modality Control Row */}
                  <div className="bg-slate-600 rounded-lg p-4">
                    <p className="text-slate-300 text-xs font-semibold mb-2 uppercase tracking-wide">Hand Modality</p>
                    <div className="flex gap-2">
                      {['left', 'both', 'right'].map(hand => (
                        <button 
                          key={hand}
                          onMouseEnter={() => setHoveredButton(`hand-${hand}`)}
                          onMouseLeave={() => setHoveredButton(null)}
                          onClick={() => setHandModality(hand)} 
                          className={`flex-1 px-4 py-2 text-sm rounded-lg font-semibold transition-all duration-200 ${
                            handModality === hand 
                              ? 'bg-teal-500 text-white shadow-lg' 
                              : hoveredButton === `hand-${hand}`
                              ? 'bg-slate-500 text-white'
                              : 'bg-slate-700 text-slate-300'
                          }`}
                        >
                          {hand === 'left' ? t('leftHand') : hand === 'both' ? t('both') : t('rightHand')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-slate-600 rounded-lg p-6 mb-8 flex-grow flex flex-col justify-center">
                <div className="flex justify-center gap-1 mb-6">
                  {renderKey('a', 'A')}
                  {renderKey('s', 'S')}
                  {renderKey('d', 'D')}
                  <div className="relative">
                    <div className="absolute -inset-1.5 border-2 border-dashed border-purple-400 rounded-lg pointer-events-none"></div>
                    <div className="flex gap-1">
                      {renderKey('f', 'F')}
                      {renderKey('g', 'G')}
                    </div>
                  </div>
                  <div style={{ width: '115px' }}></div>
                  <div className="relative">
                    <div className="absolute -inset-1.5 border-2 border-dashed border-cyan-400 rounded-lg pointer-events-none"></div>
                    <div className="flex gap-1">
                      {renderKey('h', 'H')}
                      {renderKey('j', 'J')}
                    </div>
                  </div>
                  {renderKey('k', 'K')}
                  {renderKey('l', 'L')}
                  {renderKey(';', ';')}
                </div>
                <div className="flex justify-center">
                  {renderKey(' ', '─────────────')}
                </div>
              </div>

              <div className="bg-slate-600 rounded-lg p-8 mb-8 text-center min-h-32 flex flex-col items-center justify-center">
                {gameActive && nextKeyToPress && (
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="flex items-center justify-center gap-3">
                      <p className="text-slate-300 text-lg">{uiLanguage === 'en' ? 'Type the letter' : 'Teclea la letra'}</p>
                      <div className={`rounded-md flex items-center justify-center font-bold text-lg text-white shadow-lg px-3 py-1 transition-all duration-300 ${
                        keyJustCorrect 
                          ? 'bg-gradient-to-r from-green-400 to-green-500 scale-110' 
                          : 'bg-gradient-to-r from-cyan-400 to-blue-500'
                      }`}>
                        {nextKeyToPress.toUpperCase()}
                      </div>
                    </div>
                    <p className="text-slate-200 text-base font-medium max-w-md leading-relaxed">{getFingerInstruction(nextKeyToPress)}</p>
                  </div>
                )}
              </div>

              <button 
                onMouseEnter={() => setHoveredButton('stop')}
                onMouseLeave={() => setHoveredButton(null)}
                onClick={() => { setGameActive(false); setSetupStep('language'); }} 
                className={`w-full text-white font-bold py-3 rounded-lg transition-all duration-200 ${
                  hoveredButton === 'stop'
                    ? 'bg-red-600'
                    : 'bg-red-500'
                }`}
              >
                {t('stopTraining')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}