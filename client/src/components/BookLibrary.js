import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, User, GraduationCap } from 'lucide-react';
import axios from 'axios';

const BookLibrary = ({ onBookSelect }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('/api/books');
      setBooks(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load books');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-xl text-gray-600">Loading books...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-20">
            <p className="text-xl text-red-600">{error}</p>
            <button 
              onClick={fetchBooks}
              className="btn-primary mt-4"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

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
            <h1 className="text-4xl font-bold text-gray-800 child-font">Book Library</h1>
            <p className="text-lg text-gray-600">Choose a book to start reading</p>
          </div>
        </div>

        {/* Books Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div
              key={book.id}
              className="card hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
              onClick={() => onBookSelect(book)}
            >
              <div className="text-center">
                <BookOpen className="w-16 h-16 text-primary-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2 child-font">
                  {book.title}
                </h3>
                
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center justify-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>{book.author}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <GraduationCap className="w-4 h-4" />
                    <span>{book.level}</span>
                  </div>
                  <div className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-semibold">
                    {book.language}
                  </div>
                </div>

                <p className="text-sm text-gray-500 line-clamp-3">
                  {book.content.substring(0, 100)}...
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {books.length === 0 && (
          <div className="text-center py-20">
            <BookOpen className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-600 mb-2">No books available</h3>
            <p className="text-gray-500">Check back later for more books!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookLibrary;
