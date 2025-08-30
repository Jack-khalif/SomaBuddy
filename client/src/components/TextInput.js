import React, { useState } from 'react';
import { ArrowLeft, Upload, Type, FileText } from 'lucide-react';

const TextInput = ({ onTextSubmit }) => {
  const [inputText, setInputText] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [activeTab, setActiveTab] = useState('paste');

  const handleTextSubmit = () => {
    if (inputText.trim()) {
      onTextSubmit(inputText.trim());
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      
      // Read file content
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        setInputText(content);
      };
      reader.readAsText(file);
    }
  };

  const sampleTexts = [
    {
      title: "The Clever Hare",
      content: "Once upon a time, there was a clever hare who lived in the forest. Every day, the hare would hop around looking for fresh vegetables to eat. One day, the hare met a wise old tortoise who taught him about patience and friendship."
    },
    {
      title: "Amina's School Day",
      content: "Amina wakes up early every morning. She brushes her teeth and eats breakfast with her family. Then she walks to school with her friends. At school, she learns mathematics, English, and Kiswahili. She loves reading stories during break time."
    },
    {
      title: "The Rainbow After Rain",
      content: "After the rain stops, beautiful colors appear in the sky. Red, orange, yellow, green, blue, indigo, and violet make a rainbow. Children love to point at the rainbow and count all the colors they can see."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button 
            onClick={() => window.history.back()}
            className="btn-secondary mr-4 p-3"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-4xl font-bold text-gray-800 child-font">Your Text</h1>
            <p className="text-lg text-gray-600">Paste text or upload a file to start reading</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('paste')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'paste' 
                ? 'bg-primary-500 text-white shadow-lg' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Type className="w-5 h-5" />
            <span>Paste Text</span>
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'upload' 
                ? 'bg-primary-500 text-white shadow-lg' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Upload className="w-5 h-5" />
            <span>Upload File</span>
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Input Area */}
          <div className="lg:col-span-2">
            {activeTab === 'paste' ? (
              <div className="card">
                <h3 className="text-xl font-bold text-gray-800 mb-4 child-font">
                  Paste Your Text Here
                </h3>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste any text you'd like to read here..."
                  className="w-full h-64 p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg leading-relaxed"
                />
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-gray-500">
                    {inputText.length} characters
                  </span>
                  <button
                    onClick={handleTextSubmit}
                    disabled={!inputText.trim()}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Start Reading
                  </button>
                </div>
              </div>
            ) : (
              <div className="card">
                <h3 className="text-xl font-bold text-gray-800 mb-4 child-font">
                  Upload a Text File
                </h3>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-400 transition-colors">
                  <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg text-gray-600 mb-4">
                    Drop a file here or click to browse
                  </p>
                  <input
                    type="file"
                    accept=".txt,.pdf,.epub"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="btn-secondary cursor-pointer inline-block"
                  >
                    Choose File
                  </label>
                  <p className="text-sm text-gray-500 mt-2">
                    Supports: TXT, PDF, EPUB files
                  </p>
                </div>

                {uploadedFile && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-6 h-6 text-green-600" />
                      <div>
                        <p className="font-semibold text-green-800">{uploadedFile.name}</p>
                        <p className="text-sm text-green-600">
                          {(uploadedFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {inputText && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Preview:</h4>
                    <div className="p-4 bg-gray-50 rounded-xl max-h-32 overflow-y-auto">
                      <p className="text-sm text-gray-700">
                        {inputText.substring(0, 200)}
                        {inputText.length > 200 && '...'}
                      </p>
                    </div>
                    <button
                      onClick={handleTextSubmit}
                      className="btn-primary mt-4"
                    >
                      Start Reading
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sample Texts Sidebar */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800 child-font">
              Try These Samples
            </h3>
            {sampleTexts.map((sample, index) => (
              <div
                key={index}
                className="card cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
                onClick={() => setInputText(sample.content)}
              >
                <h4 className="font-bold text-gray-800 mb-2">{sample.title}</h4>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {sample.content.substring(0, 80)}...
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextInput;
