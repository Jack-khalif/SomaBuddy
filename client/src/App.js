import React, { useState, useEffect } from 'react';
import { BookOpen, Volume2, Mic, Settings, Star, Upload, Type } from 'lucide-react';
import BookLibrary from './components/BookLibrary';
import ReadingView from './components/ReadingView';
import TextInput from './components/TextInput';
import SettingsPanel from './components/SettingsPanel';
import axios from 'axios';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedBook, setSelectedBook] = useState(null);
  const [customText, setCustomText] = useState('');
  const [settings, setSettings] = useState({
    fontSize: 'large',
    fontFamily: 'dyslexic',
    highContrast: false,
    readingSpeed: 1.0,
    highlightColor: 'yellow'
  });
  const [stars, setStars] = useState(0);

  // Check server connection on load
  useEffect(() => {
    checkServerConnection();
  }, []);

  const checkServerConnection = async () => {
    try {
      const response = await axios.get('/api/health');
      console.log('Server connected:', response.data);
    } catch (error) {
      console.error('Server connection failed:', error);
    }
  };

  const handleBookSelect = (book) => {
    setSelectedBook(book);
    setCurrentView('reading');
  };

  const handleTextSubmit = (text) => {
    setCustomText(text);
    setSelectedBook({
      id: 'custom',
      title: 'Your Text',
      content: text,
      author: 'You',
      level: 'Custom'
    });
    setCurrentView('reading');
  };

  const awardStar = () => {
    setStars(prev => prev + 1);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'library':
        return <BookLibrary onBookSelect={handleBookSelect} />;
      case 'text-input':
        return <TextInput onTextSubmit={handleTextSubmit} />;
      case 'reading':
        return (
          <ReadingView 
            book={selectedBook}
            settings={settings}
            onAwardStar={awardStar}
            onBack={() => setCurrentView('home')}
          />
        );
      case 'settings':
        return (
          <SettingsPanel 
            settings={settings}
            onSettingsChange={setSettings}
            onBack={() => setCurrentView('home')}
          />
        );
      default:
        return <HomeView />;
    }
  };

  const HomeView = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="w-12 h-12 text-primary-500 mr-3" />
            <h1 className="text-5xl font-bold text-gray-800 child-font">SomaBuddy</h1>
          </div>
          <p className="text-xl text-gray-600 mb-2">Reading Made Fun! 📚✨</p>
          <p className="text-lg text-primary-600 font-semibold italic">
            "Dyslexia is no disorder, dyslexics think differently."
          </p>
          
          {/* Stars Display */}
          <div className="flex items-center justify-center mt-4 space-x-2">
            <Star className="w-6 h-6 text-yellow-500" />
            <span className="text-2xl font-bold text-yellow-600">{stars}</span>
            <span className="text-gray-600">stars earned!</span>
          </div>
        </div>

        {/* Main Menu Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Book Library */}
          <div 
            className="card hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
            onClick={() => setCurrentView('library')}
          >
            <div className="text-center">
              <BookOpen className="w-16 h-16 text-primary-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2 child-font">Book Library</h3>
              <p className="text-gray-600">Choose from Kenyan syllabus books</p>
            </div>
          </div>

          {/* Text Input */}
          <div 
            className="card hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
            onClick={() => setCurrentView('text-input')}
          >
            <div className="text-center">
              <Type className="w-16 h-16 text-success-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2 child-font">Your Text</h3>
              <p className="text-gray-600">Paste or upload your own text</p>
            </div>
          </div>
        </div>

        {/* Features Preview */}
        <div className="card mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 child-font text-center">
            What makes SomaBuddy special?
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <Volume2 className="w-12 h-12 text-blue-500 mx-auto mb-3" />
              <h4 className="font-bold text-gray-800 mb-2">Listen & Learn</h4>
              <p className="text-sm text-gray-600">Books read aloud with word highlighting</p>
            </div>
            <div className="text-center">
              <Mic className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <h4 className="font-bold text-gray-800 mb-2">Practice Speaking</h4>
              <p className="text-sm text-gray-600">Get feedback on your pronunciation</p>
            </div>
            <div className="text-center">
              <Settings className="w-12 h-12 text-purple-500 mx-auto mb-3" />
              <h4 className="font-bold text-gray-800 mb-2">Visual Aids</h4>
              <p className="text-sm text-gray-600">Adjustable fonts and highlighting</p>
            </div>
          </div>
        </div>

        {/* Settings Button */}
        <div className="text-center">
          <button
            onClick={() => setCurrentView('settings')}
            className="btn-secondary inline-flex items-center space-x-2"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`App ${settings.highContrast ? 'high-contrast' : ''}`}>
      {renderCurrentView()}
    </div>
  );
}

export default App;
