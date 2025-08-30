# SomaBuddy 📚✨

**"Dyslexia is no disorder, dyslexics think differently."**

A dyslexia-friendly reading app designed for Kenyan children, providing multisensory reading support through text-to-speech, speech-to-text, and visual aids.

## Features

- 🎧 **Text-to-Speech**: Listen to books read aloud with Google TTS
- 🎤 **Speech-to-Text**: Practice pronunciation with Whisper/Vosk feedback
- 🌈 **Visual Aids**: Color highlighting, adjustable fonts, text chunking
- 📖 **Text Input**: Upload books or paste text directly
- ⭐ **Engagement**: Reward system and shared reading mode
- 📚 **Library**: Simple catalogue of Kenyan syllabus books

## Tech Stack

- **Frontend**: React with Tailwind CSS
- **Backend**: Express.js
- **AI/ML**: TensorFlow.js, Whisper/Vosk, Google TTS
- **Deployment**: Vercel/Render ready

## Quick Start

```bash
# Install dependencies
npm install

# Start development server (both frontend and backend)
npm run dev
```

## Project Structure

```
somabuddy/
├── client/          # React frontend
├── server/          # Express.js backend
├── shared/          # Shared utilities
└── docs/           # Documentation
```

## Demo Flow

1. Child opens SomaBuddy
2. Picks a book or pastes text
3. System reads aloud with word highlighting
4. Child repeats words for pronunciation feedback
5. Visual aids help with comprehension
6. Child earns rewards for effort

## Contributing

Built for the DevOps Hackathon - focusing on accessibility and inclusive education for African learners.
