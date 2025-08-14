# 🧠 Exam AI VR Tutor - Phase 1

## Project Overview

A production-ready web application that provides AI-powered Exam exam preparation with immersive VR learning experiences. Built with React, TypeScript, Tailwind CSS, and A-Frame for VR capabilities.

## ✨ Features Implemented

### 🔐 Authentication System
- Sign in/Sign up forms with validation (Zod)
- Mock authentication with demo mode
- Auto-redirect based on user state

### 🎯 Onboarding Flow
- Unskippable 4-step wizard
- Collects study preferences and profile data
- AI-powered topic selection based on user profile
- Progress tracking with visual indicators

### 📚 Learning System
- Single-topic gated flow: Topic → Flashcards → Video → Quiz → Analysis
- Progress tracking and step completion
- Visual progress indicators
- Responsive design for all devices

### 🥽 VR Experience
- 180° panoramic VR classroom environment
- Interactive hotspots for different learning modules
- A-Frame powered immersive experience
- Fallback to 2D learning if VR unsupported
- Custom generated classroom panorama

### 📊 Dashboard & Analytics
- Progress overview with charts (Recharts)
- Study time tracking
- Subject-wise progress visualization
- Quick action buttons

### 🎨 Blue Haze Design System
- Consistent color palette throughout
- Beautiful gradients and animations
- Semantic design tokens
- Mobile-first responsive design
- HSL color system for consistency

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: Zustand with persistence
- **Validation**: Zod for form validation
- **VR**: A-Frame for immersive experiences
- **Charts**: Recharts for analytics
- **Routing**: React Router DOM

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Modern browser with WebXR support (optional for VR)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:8080`

### Demo Mode

The application runs in demo mode by default with:
- ✅ Mock authentication (any email/password works)
- ✅ Local data persistence
- ✅ All features functional without backend
- ✅ VR experience with generated assets

## 📱 Usage Guide

### 1. Landing Page
- Beautiful hero section with feature highlights
- Call-to-action buttons for sign up/sign in
- SEO optimized with proper meta tags

### 2. Authentication
- Create account or sign in (demo mode)
- Form validation with helpful error messages
- Auto-redirect based on completion status

### 3. Onboarding (Required)
- **Step 1**: Set daily study hours (1-8h slider)
- **Step 2**: Choose learning format preference
- **Step 3**: Identify challenging subject
- **Step 4**: Set confidence level and exam date
- AI recommends topics based on profile

### 4. Learning Flow
- **Topic Overview**: Read description and start learning
- **Flashcards**: Interactive cards with mnemonics (placeholder)
- **Video Lessons**: Embedded video content (placeholder)
- **Quiz**: Multiple choice questions (placeholder)
- **Analysis**: Performance insights (placeholder)

### 5. VR Experience
- Click "VR Mode" button in any learning page
- Navigate to VR Preview for 180° classroom
- Click floating spheres to interact with content
- Press VR button for immersive headset mode

### 6. Dashboard
- View study progress and analytics
- Track completion across subjects
- Access quick actions for learning continuation

## 🎨 Design System

### Color Palette (Blue Haze)
```css
Primary: #7C659C (Purple)
Accent: #A191C1 (Light Purple)
Background: #F8F7FB (Light Blue-Gray)
Cards: #F2F0F7 (Soft Purple-Gray)
```

### Key Design Features
- Gradient hero sections
- Smooth animations and transitions
- Consistent spacing and typography
- Accessible color contrasts
- Mobile-responsive layouts

## 🗂️ Project Structure

```
src/
├── components/ui/          # shadcn/ui components
├── data/                   # JSON seed data
│   ├── topics.json        # Subject topics
│   ├── flashcards.json    # Learning cards
│   └── questions.json     # Quiz questions
├── lib/
│   ├── store.ts           # Zustand state management
│   └── utils.ts           # Utility functions
├── pages/
│   ├── auth/              # Authentication pages
│   ├── vr/                # VR experience pages
│   ├── Dashboard.tsx      # Progress overview
│   ├── Learn.tsx          # Main learning flow
│   ├── Onboarding.tsx     # User setup wizard
│   └── Profile.tsx        # User settings
└── App.tsx                # Main app with routing
```

## 🎯 Data Architecture

### Topics
- Subject categorization (Physics, Chemistry, Biology, Math)
- Difficulty levels and time estimates
- Video IDs and descriptions

### Flashcards
- Topic-specific learning cards
- Front/back content with mnemonics
- Spaced repetition ready structure

### Questions
- Multiple choice quiz questions
- Explanations and difficulty tagging
- Subject and topic categorization

### User Progress
- Step completion tracking
- Time spent and accuracy metrics
- Persistent local storage

## 🥽 VR Implementation

### A-Frame Integration
- 180° equirectangular panorama support
- Interactive hotspot system
- Cursor-based navigation
- WebXR compatibility

### Generated Assets
- Custom classroom panorama (`/public/vr-classroom-panorama.jpg`)
- Social media preview image (`/public/Exam-tutor-og.jpg`)
- Optimized for VR display

### VR Features
- Gaze-based interaction
- Floating UI panels
- Ambient lighting and atmosphere
- Fallback to 2D mode

## 🔧 Customization

### Adding New Topics
1. Edit `src/data/topics.json`
2. Add corresponding flashcards and questions
3. Update topic selection logic in onboarding

### Extending VR Experience
1. Modify `src/pages/vr/Preview.tsx`
2. Add new hotspots or interactive elements
3. Update click handlers for navigation

### Theme Customization
1. Edit `src/index.css` for design tokens
2. Update `tailwind.config.ts` for color extensions
3. Modify component variants as needed

## ⚡ Performance

- Lazy loading for VR components
- Optimized image assets
- Local state management for fast interactions
- Mobile-first responsive design
- Semantic HTML for accessibility

## 🚀 Future Enhancements (Phase 2+)

- Real backend integration
- Live AI tutoring with LLM APIs
- Advanced VR interactions
- Social learning features
- Real-time progress sync
- Payment and subscription system

## 📄 License

This project is a demo implementation for educational purposes.

---

**Built with ❤️ for Exam aspirants using cutting-edge web technologies.**