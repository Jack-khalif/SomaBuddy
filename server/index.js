const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|epub|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF, EPUB, and TXT files are allowed'));
    }
  }
});

// Sample Kenyan syllabus books for demo
const sampleBooks = [
  {
    id: 1,
    title: "Kiswahili Darasa la 1",
    author: "Kenya Institute of Education",
    level: "Grade 1",
    language: "Kiswahili",
    content: "Hapa kuna kitabu cha Kiswahili. Tunajifunza maneno mapya kila siku. Soma polepole na uelewa."
  },
  {
    id: 2,
    title: "English Reader Grade 2",
    author: "Kenya Literature Bureau",
    level: "Grade 2", 
    language: "English",
    content: "This is a story about a little girl named Amina. She loves to read books every day. Reading helps her learn new words and ideas."
  },
  {
    id: 3,
    title: "My First Storybook",
    author: "Longhorn Publishers",
    level: "Grade 1",
    language: "English", 
    content: "Once upon a time, there was a clever rabbit. The rabbit lived in a big forest with many other animals. Every day was a new adventure."
  }
];

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'SomaBuddy server is running!', timestamp: new Date().toISOString() });
});

// Get sample books
app.get('/api/books', (req, res) => {
  res.json(sampleBooks);
});

// Get specific book
app.get('/api/books/:id', (req, res) => {
  const book = sampleBooks.find(b => b.id === parseInt(req.params.id));
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }
  res.json(book);
});

// Upload book file
app.post('/api/upload', upload.single('book'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  // For demo purposes, return file info
  // In production, you'd parse the file content here
  res.json({
    message: 'File uploaded successfully',
    filename: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size,
    path: req.file.path
  });
});

// Process text for reading
app.post('/api/process-text', (req, res) => {
  const { text, options = {} } = req.body;
  
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  // Break text into sentences for easier reading
  const sentences = text.match(/[^\.!?]+[\.!?]+/g) || [text];
  
  // Break sentences into words for highlighting
  const processedSentences = sentences.map((sentence, index) => ({
    id: index,
    text: sentence.trim(),
    words: sentence.trim().split(/\s+/).map((word, wordIndex) => ({
      id: wordIndex,
      text: word,
      highlighted: false
    }))
  }));

  res.json({
    originalText: text,
    sentences: processedSentences,
    totalSentences: sentences.length,
    options: options
  });
});

// Text-to-speech endpoint (placeholder - will integrate with Google TTS on frontend)
app.post('/api/tts', (req, res) => {
  const { text, voice = 'en-US', speed = 1.0 } = req.body;
  
  // Return configuration for frontend TTS
  res.json({
    text: text,
    voice: voice,
    speed: speed,
    message: 'Use Web Speech API on frontend for TTS'
  });
});

// Speech-to-text feedback endpoint (placeholder)
app.post('/api/speech-feedback', (req, res) => {
  const { originalText, spokenText, confidence = 0.8 } = req.body;
  
  // Simple similarity check (in production, use more sophisticated matching)
  const similarity = calculateSimilarity(originalText.toLowerCase(), spokenText.toLowerCase());
  
  let feedback = {
    score: similarity,
    message: '',
    encouragement: ''
  };

  if (similarity > 0.8) {
    feedback.message = 'Excellent pronunciation!';
    feedback.encouragement = '⭐ Well done! You read that perfectly!';
  } else if (similarity > 0.6) {
    feedback.message = 'Good try! Almost there.';
    feedback.encouragement = '👍 Keep practicing, you\'re doing great!';
  } else {
    feedback.message = 'Let\'s try again slowly.';
    feedback.encouragement = '💪 Don\'t worry, practice makes perfect!';
  }

  res.json(feedback);
});

// Simple similarity calculation
function calculateSimilarity(str1, str2) {
  const words1 = str1.split(/\s+/);
  const words2 = str2.split(/\s+/);
  
  let matches = 0;
  const maxLength = Math.max(words1.length, words2.length);
  
  for (let i = 0; i < Math.min(words1.length, words2.length); i++) {
    if (words1[i] === words2[i]) {
      matches++;
    }
  }
  
  return maxLength > 0 ? matches / maxLength : 0;
}

app.listen(PORT, () => {
  console.log(`🚀 SomaBuddy server running on port ${PORT}`);
  console.log(`📚 "Dyslexia is no disorder, dyslexics think differently."`);
});
