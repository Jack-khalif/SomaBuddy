import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, Mic, MicOff, Volume2, Star, Settings } from 'lucide-react';
import axios from 'axios';

const ReadingView = ({ book, settings, onAwardStar, onBack }) => {
  const [processedText, setProcessedText] = useState(null);
  const [currentSentence, setCurrentSentence] = useState(0);
  const [currentWord, setCurrentWord] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechFeedback, setSpeechFeedback] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  
  const speechSynthesis = useRef(window.speechSynthesis);
  const speechRecognition = useRef(null);
  const utteranceRef = useRef(null);

  useEffect(() => {
    if (book?.content) {
      processTextForReading();
    }
    
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      speechRecognition.current = new SpeechRecognition();
      speechRecognition.current.continuous = false;
      speechRecognition.current.interimResults = false;
      speechRecognition.current.lang = 'en-US';
    }

    return () => {
      if (utteranceRef.current) {
        speechSynthesis.current.cancel();
      }
    };
  }, [book]);

  const processTextForReading = async () => {
    try {
      const response = await axios.post('/api/process-text', {
        text: book.content,
        options: settings
      });
      setProcessedText(response.data);
    } catch (error) {
      console.error('Error processing text:', error);
      // Fallback processing
      const sentences = book.content.match(/[^\.!?]+[\.!?]+/g) || [book.content];
      const processed = {
        sentences: sentences.map((sentence, index) => ({
          id: index,
          text: sentence.trim(),
          words: sentence.trim().split(/\s+/).map((word, wordIndex) => ({
            id: wordIndex,
            text: word,
            highlighted: false
          }))
        }))
      };
      setProcessedText(processed);
    }
  };

  const speakText = (text, onWordBoundary = null) => {
    if (utteranceRef.current) {
      speechSynthesis.current.cancel();
    }

    utteranceRef.current = new SpeechSynthesisUtterance(text);
    utteranceRef.current.rate = settings.readingSpeed || 1.0;
    utteranceRef.current.pitch = 1.1; // Slightly higher pitch for children
    utteranceRef.current.volume = 1.0;

    // Try to use a child-friendly voice
    const voices = speechSynthesis.current.getVoices();
    const childVoice = voices.find(voice => 
      voice.name.includes('Google') && voice.lang.startsWith('en')
    ) || voices.find(voice => voice.lang.startsWith('en'));
    
    if (childVoice) {
      utteranceRef.current.voice = childVoice;
    }

    if (onWordBoundary) {
      utteranceRef.current.onboundary = onWordBoundary;
    }

    utteranceRef.current.onend = () => {
      setIsPlaying(false);
      setCurrentWord(-1);
    };

    speechSynthesis.current.speak(utteranceRef.current);
  };

  const playCurrentSentence = () => {
    if (!processedText || currentSentence >= processedText.sentences.length) return;

    const sentence = processedText.sentences[currentSentence];
    setIsPlaying(true);
    setCurrentWord(0);

    let wordIndex = 0;
    const words = sentence.words;

    speakText(sentence.text, (event) => {
      if (event.name === 'word' && wordIndex < words.length) {
        setCurrentWord(wordIndex);
        wordIndex++;
      }
    });
  };

  const pauseReading = () => {
    speechSynthesis.current.pause();
    setIsPlaying(false);
  };

  const resumeReading = () => {
    speechSynthesis.current.resume();
    setIsPlaying(true);
  };

  const stopReading = () => {
    speechSynthesis.current.cancel();
    setIsPlaying(false);
    setCurrentWord(-1);
  };

  const nextSentence = () => {
    if (currentSentence < processedText.sentences.length - 1) {
      setCurrentSentence(prev => prev + 1);
      setCurrentWord(-1);
      stopReading();
    }
  };

  const previousSentence = () => {
    if (currentSentence > 0) {
      setCurrentSentence(prev => prev - 1);
      setCurrentWord(-1);
      stopReading();
    }
  };

  const startListening = () => {
    if (!speechRecognition.current) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    setIsListening(true);
    setSpeechFeedback(null);
    setShowFeedback(false);

    speechRecognition.current.onresult = async (event) => {
      const spokenText = event.results[0][0].transcript;
      const confidence = event.results[0][0].confidence;
      
      const currentSentenceText = processedText.sentences[currentSentence].text;
      
      try {
        const response = await axios.post('/api/speech-feedback', {
          originalText: currentSentenceText,
          spokenText: spokenText,
          confidence: confidence
        });
        
        setSpeechFeedback(response.data);
        setShowFeedback(true);
        
        // Award star for good pronunciation
        if (response.data.score > 0.7) {
          onAwardStar();
        }
        
        // Hide feedback after 3 seconds
        setTimeout(() => setShowFeedback(false), 3000);
        
      } catch (error) {
        console.error('Error getting speech feedback:', error);
      }
      
      setIsListening(false);
    };

    speechRecognition.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    speechRecognition.current.start();
  };

  const stopListening = () => {
    if (speechRecognition.current) {
      speechRecognition.current.stop();
    }
    setIsListening(false);
  };

  const getFontSizeClass = () => {
    switch (settings.fontSize) {
      case 'small': return 'reading-text';
      case 'large': return 'reading-text-large';
      case 'huge': return 'reading-text-huge';
      default: return 'reading-text-large';
    }
  };

  const getFontFamilyClass = () => {
    return settings.fontFamily === 'dyslexic' ? 'dyslexic-font' : 'font-sans';
  };

  if (!processedText) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-xl text-gray-600">Preparing your text...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button 
              onClick={onBack}
              className="btn-secondary mr-4 p-3"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 child-font">{book.title}</h1>
              <p className="text-gray-600">{book.author} • {book.level}</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">
              Sentence {currentSentence + 1} of {processedText.sentences.length}
            </div>
            <div className="w-48 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentSentence + 1) / processedText.sentences.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Reading Area */}
        <div className="card mb-6">
          <div className={`${getFontSizeClass()} ${getFontFamilyClass()} text-gray-800 leading-relaxed`}>
            {processedText.sentences[currentSentence]?.words.map((word, index) => (
              <span
                key={index}
                className={`${
                  index === currentWord 
                    ? 'text-highlight-active' 
                    : index < currentWord 
                      ? 'text-highlight' 
                      : ''
                } mr-2 transition-all duration-200`}
              >
                {word.text}
              </span>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Reading Controls */}
          <div className="card">
            <h3 className="text-lg font-bold text-gray-800 mb-4 child-font flex items-center">
              <Volume2 className="w-5 h-5 mr-2" />
              Listen & Read
            </h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={isPlaying ? pauseReading : playCurrentSentence}
                className="btn-primary flex items-center space-x-2"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>
              
              <button
                onClick={stopReading}
                className="btn-secondary flex items-center space-x-2"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Stop</span>
              </button>
            </div>
            
            <div className="flex justify-between mt-4">
              <button
                onClick={previousSentence}
                disabled={currentSentence === 0}
                className="btn-secondary disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={nextSentence}
                disabled={currentSentence >= processedText.sentences.length - 1}
                className="btn-secondary disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>

          {/* Speech Practice */}
          <div className="card">
            <h3 className="text-lg font-bold text-gray-800 mb-4 child-font flex items-center">
              <Mic className="w-5 h-5 mr-2" />
              Practice Speaking
            </h3>
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Read the highlighted sentence aloud and get feedback!
              </p>
              <button
                onClick={isListening ? stopListening : startListening}
                className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-semibold transition-all ${
                  isListening 
                    ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                    : 'bg-success-500 hover:bg-success-600 text-white'
                }`}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                <span>{isListening ? 'Stop Listening' : 'Start Speaking'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Speech Feedback */}
        {showFeedback && speechFeedback && (
          <div className={`card mb-6 border-l-4 ${
            speechFeedback.score > 0.8 
              ? 'border-green-500 bg-green-50' 
              : speechFeedback.score > 0.6 
                ? 'border-yellow-500 bg-yellow-50'
                : 'border-blue-500 bg-blue-50'
          }`}>
            <div className="flex items-center space-x-3">
              <Star className={`w-8 h-8 ${
                speechFeedback.score > 0.7 ? 'text-yellow-500' : 'text-gray-400'
              }`} />
              <div>
                <h4 className="font-bold text-gray-800">{speechFeedback.message}</h4>
                <p className="text-gray-600">{speechFeedback.encouragement}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadingView;
