import React from 'react';
import { ArrowLeft, Type, Eye, Volume2, Palette } from 'lucide-react';

const SettingsPanel = ({ settings, onSettingsChange, onBack }) => {
  const updateSetting = (key, value) => {
    onSettingsChange(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button 
            onClick={onBack}
            className="btn-secondary mr-4 p-3"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-4xl font-bold text-gray-800 child-font">Settings</h1>
            <p className="text-lg text-gray-600">Customize your reading experience</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Font Settings */}
          <div className="card">
            <h3 className="text-xl font-bold text-gray-800 mb-4 child-font flex items-center">
              <Type className="w-6 h-6 mr-2" />
              Text Settings
            </h3>
            
            <div className="space-y-6">
              {/* Font Size */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Font Size
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['small', 'large', 'huge'].map((size) => (
                    <button
                      key={size}
                      onClick={() => updateSetting('fontSize', size)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        settings.fontSize === size
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`font-semibold ${
                        size === 'small' ? 'text-sm' : 
                        size === 'large' ? 'text-lg' : 'text-2xl'
                      }`}>
                        Aa
                      </div>
                      <div className="text-xs text-gray-600 capitalize">{size}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Family */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Font Style
                </label>
                <div className="space-y-2">
                  <button
                    onClick={() => updateSetting('fontFamily', 'dyslexic')}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      settings.fontFamily === 'dyslexic'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="dyslexic-font text-lg font-semibold">
                      Dyslexic Friendly Font
                    </div>
                    <div className="text-sm text-gray-600">
                      Specially designed for easier reading
                    </div>
                  </button>
                  
                  <button
                    onClick={() => updateSetting('fontFamily', 'standard')}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      settings.fontFamily === 'standard'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-sans text-lg font-semibold">
                      Standard Font
                    </div>
                    <div className="text-sm text-gray-600">
                      Regular reading font
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Settings */}
          <div className="card">
            <h3 className="text-xl font-bold text-gray-800 mb-4 child-font flex items-center">
              <Eye className="w-6 h-6 mr-2" />
              Visual Aids
            </h3>
            
            <div className="space-y-6">
              {/* High Contrast */}
              <div>
                <label className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-700">High Contrast Mode</div>
                    <div className="text-sm text-gray-600">Makes text easier to see</div>
                  </div>
                  <button
                    onClick={() => updateSetting('highContrast', !settings.highContrast)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.highContrast ? 'bg-primary-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.highContrast ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </label>
              </div>

              {/* Highlight Color */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Highlight Color
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { name: 'yellow', color: 'bg-yellow-300', border: 'border-yellow-400' },
                    { name: 'blue', color: 'bg-blue-300', border: 'border-blue-400' },
                    { name: 'green', color: 'bg-green-300', border: 'border-green-400' },
                    { name: 'pink', color: 'bg-pink-300', border: 'border-pink-400' }
                  ].map((colorOption) => (
                    <button
                      key={colorOption.name}
                      onClick={() => updateSetting('highlightColor', colorOption.name)}
                      className={`w-12 h-12 rounded-xl border-2 transition-all ${
                        settings.highlightColor === colorOption.name
                          ? `${colorOption.border} ring-2 ring-primary-500`
                          : 'border-gray-200 hover:border-gray-300'
                      } ${colorOption.color}`}
                    >
                      <span className="sr-only">{colorOption.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Audio Settings */}
          <div className="card">
            <h3 className="text-xl font-bold text-gray-800 mb-4 child-font flex items-center">
              <Volume2 className="w-6 h-6 mr-2" />
              Audio Settings
            </h3>
            
            <div className="space-y-6">
              {/* Reading Speed */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Reading Speed: {settings.readingSpeed}x
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={settings.readingSpeed}
                  onChange={(e) => updateSetting('readingSpeed', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Slow</span>
                  <span>Normal</span>
                  <span>Fast</span>
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="card">
            <h3 className="text-xl font-bold text-gray-800 mb-4 child-font flex items-center">
              <Palette className="w-6 h-6 mr-2" />
              Preview
            </h3>
            
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className={`${
                settings.fontSize === 'small' ? 'text-lg' :
                settings.fontSize === 'large' ? 'text-2xl' : 'text-4xl'
              } ${
                settings.fontFamily === 'dyslexic' ? 'dyslexic-font' : 'font-sans'
              } leading-relaxed`}>
                <span className={`${
                  settings.highlightColor === 'yellow' ? 'bg-yellow-300' :
                  settings.highlightColor === 'blue' ? 'bg-blue-300' :
                  settings.highlightColor === 'green' ? 'bg-green-300' : 'bg-pink-300'
                } px-1 rounded`}>
                  This
                </span> is how your text will look when reading.
              </div>
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <div className="text-center mt-8">
          <button
            onClick={() => onSettingsChange({
              fontSize: 'large',
              fontFamily: 'dyslexic',
              highContrast: false,
              readingSpeed: 1.0,
              highlightColor: 'yellow'
            })}
            className="btn-secondary"
          >
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
