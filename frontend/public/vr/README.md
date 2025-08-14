# AI VR Tutor - 180° VR Scene

A standalone A-Frame VR scene that provides an immersive 180° learning experience for Exam preparation.

## Quick Start

1. **Local Development**: Open `index.html` directly in your browser or use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   
   # Using Live Server (VS Code extension)
   Right-click index.html → "Open with Live Server"
   ```

2. **Access**: Navigate to `http://localhost:8000/vr/` in your browser

## Features

### 180° VR Experience
- **Panoramic View**: Uses `/vr-classroom-panorama.jpg` as 180° equirectangular background
- **Interactive Hotspots**: Click glowing spheres to access learning content
- **Responsive Panels**: Content panels that always face the user
- **WebXR Support**: Full VR mode with headset compatibility

### Learning Elements
- **Current Topic Panel**: Central display showing active learning topic
- **Flashcards Hotspot**: Access topic-specific flashcard content
- **Video Lesson Hotspot**: Launch video lessons with progress tracking
- **Quiz Hotspot**: Unlocked after 60% video completion

### Controls & Interaction
- **Mouse/Touch**: Click and drag to look around
- **Keyboard**: 
  - `R` - Toggle controls overlay
  - `ESC` - Close panels
- **VR Mode**: Use VR button for immersive headset experience
- **Gaze Cursor**: Automatic interaction for VR headsets

## API Integration

### VR_API Global Object

The scene exposes a global `VR_API` object for integration with the main Next.js app:

```javascript
// Load flashcards for a topic
VR_API.loadFlashcards('organic-chemistry-basics');

// Track video progress (unlocks quiz at 60%)
VR_API.onVideoProgress(75);

// Set current topic
VR_API.setCurrentTopic('photosynthesis', 'Photosynthesis');

// Mark topic complete
VR_API.markTopicComplete();

// Debug helpers
VR_API.debug.unlockAll();
VR_API.debug.setProgress(60);
```

### Video Progress Integration

When video lessons are opened from VR:

1. **VR Scene** → Sends message to parent window with video URL
2. **Video Player** → Posts progress updates via `postMessage`
3. **VR Scene** → Unlocks quiz when 60% threshold reached

Example video player integration:
```javascript
// In your video component
const handleProgress = (progress) => {
  window.parent.postMessage({
    type: 'VIDEO_PROGRESS',
    progress: progress
  }, '*');
};
```

### Data Sources

The VR scene attempts to load data in this order:

1. **API Endpoints**: `/api/flashcards?topic=...`, `/api/questions?topic=...`
2. **Local Seeds**: `/vr/seeds.json` if API unavailable
3. **Fallback**: Empty state with user-friendly messages

## File Structure

```
/public/vr/
├── index.html          # Main VR scene
├── vr-api.js          # API integration layer  
├── seeds.json         # Fallback data
├── README.md          # This file
└── assets/
    └── website_180.jpg # 180° panorama image
```

## Customization

### Adding New Topics

1. **Update seeds.json**: Add topic data, flashcards, and questions
2. **API Integration**: Ensure your `/api/*` endpoints return matching data
3. **VR Scene**: Call `VR_API.setCurrentTopic(id, name)` to switch topics

### Styling & Layout

The scene uses the Blue Haze design system:
- **Primary**: `#7C659C` (hotspots, text)
- **Card Background**: `#F2F0F7` (panels)
- **Text**: `#372D48` (main text)
- **Hover**: `#675582` (interactions)

### Positioning Elements

Hotspot positions can be adjusted in `index.html`:
```html
<!-- Example: Move flashcards hotspot -->
<a-sphere
  id="hotspot-flash"
  position="-1.25 1.4 -1.6"  <!-- x y z coordinates -->
  mixin="hotspot"
/>
```

## Troubleshooting

### Common Issues

1. **VR Mode Not Working**
   - Ensure HTTPS in production (WebXR requirement)
   - Use a WebXR-compatible browser (Chrome, Firefox, Edge)
   - Check that VR headset is properly connected

2. **Panorama Not Loading**
   - Verify `/vr-classroom-panorama.jpg` exists
   - Check browser console for 404 errors
   - Ensure image is equirectangular format (2:1 aspect ratio)

3. **API Integration Issues**
   - Open browser dev tools and check console
   - Verify VR_API object is available: `console.log(VR_API)`
   - Test manual progress: `VR_API.debug.setProgress(60)`

### Debug Mode

Enable debug features in browser console:
```javascript
// Unlock all content immediately
VR_API.debug.unlockAll();

// Simulate video progress
VR_API.debug.setProgress(75);

// Complete current topic
VR_API.debug.completeTopic();

// Check current state
console.log(VR_API.getState());
```

## Performance Tips

- **Image Optimization**: Compress panorama images (recommended size: 4096x2048)
- **Reduced Motion**: Scene respects `prefers-reduced-motion` for accessibility
- **Mobile Performance**: Automatically reduces visual effects on mobile devices

## Browser Support

- **Desktop**: Chrome 79+, Firefox 70+, Safari 14+, Edge 79+
- **Mobile**: Chrome Mobile, Firefox Mobile, Safari iOS 14+
- **VR Headsets**: Oculus Browser, Firefox Reality, Chrome VR

## Next Steps

1. **Integration**: Embed in Next.js app using iframe or route
2. **Authentication**: Connect with user session state
3. **Progress Sync**: Sync VR progress with main app database
4. **Content**: Add more topics, better animations, spatial audio