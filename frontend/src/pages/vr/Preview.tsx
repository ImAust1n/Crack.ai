import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import topics from "@/data/topics.json";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'a-scene': any;
      'a-sky': any;
      'a-entity': any;
      'a-camera': any;
      'a-cursor': any;
      'a-sphere': any;
      'a-plane': any;
      'a-text': any;
      'a-box': any;
      'a-assets': any;
      'a-mixin': any;
      'a-light': any;
    }
  }
  
  interface Navigator {
    xr?: any;
  }
}

const VRPreview = () => {
  const navigate = useNavigate();
  const { user, currentTopic, isVRMode } = useStore();
  const vrContainerRef = useRef<HTMLDivElement>(null);
  const [vrSupported, setVrSupported] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check WebXR support
    if (!navigator.xr) {
      setVrSupported(false);
    }
    
    // Load A-Frame
    const loadAFrame = async () => {
      try {
        await import('aframe');
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load A-Frame:', error);
        setVrSupported(false);
        setIsLoading(false);
      }
    };

    loadAFrame();
  }, []);

  if (!user) {
    navigate("/auth/sign-in");
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground">Loading VR Experience...</p>
        </div>
      </div>
    );
  }

  if (!vrSupported) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card-bg p-4">
          <div className="container mx-auto flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/learn")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-bold">VR Preview</h1>
          </div>
        </header>
        
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Card className="card-bg border-warning">
            <CardContent className="p-6 text-center space-y-4">
              <AlertTriangle className="h-12 w-12 text-warning mx-auto" />
              <h2 className="text-xl font-bold">VR Not Supported</h2>
              <p className="text-muted-foreground">
                Your browser doesn't support WebXR or A-Frame couldn't be loaded. 
                Please try using a WebXR-compatible browser like Chrome or Firefox.
              </p>
              <Button onClick={() => navigate("/learn")} className="hero-gradient">
                Continue with 2D Learning
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // A-Frame scene setup with 180° panorama and interactive hotspots
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card-bg p-4 relative z-10">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/learn")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-bold">VR Learning Experience</h1>
          </div>
          <div className="text-sm text-muted-foreground">
            Look around and click on the floating icons to interact
          </div>
        </div>
      </header>

      <div ref={vrContainerRef} className="w-full h-[calc(100vh-80px)]">
        <a-scene 
          background="color: #F8F7FB"
          vr-mode-ui="enabled: true"
          embedded
          style={{ width: '100%', height: '100%' }}
        >
          {/* Assets */}
          <a-assets>
            <a-mixin 
              id="hotspot"
              geometry="primitive: sphere; radius: 0.1"
              material="color: #7C659C; opacity: 0.8"
              animation__mouseenter="property: scale; to: 1.2 1.2 1.2; startEvents: mouseenter; dur: 200"
              animation__mouseleave="property: scale; to: 1 1 1; startEvents: mouseleave; dur: 200"
            />
            <a-mixin
              id="panel"
              geometry="primitive: plane; width: 2; height: 1.5"
              material="color: #F2F0F7; opacity: 0.95"
            />
          </a-assets>

          {/* 180° Sky Panorama */}
          <a-sky
            src="/vr-classroom-panorama.jpg"
            theta-length="180"
            rotation="0 -90 0"
          />

          {/* Camera Rig */}
          <a-entity id="rig" position="0 1.6 0">
            <a-camera>
              <a-cursor
                animation__click="property: scale; startEvents: click; from: 0.1 0.1 0.1; to: 1 1 1; dur: 150"
                animation__fusing="property: scale; startEvents: fusing; from: 1 1 1; to: 0.1 0.1 0.1; dur: 1500"
                geometry="primitive: ring; radiusInner: 0.02; radiusOuter: 0.03"
                material="color: #7C659C; shader: flat"
              />
            </a-camera>
          </a-entity>

          {/* Interactive Hotspots */}
          
          {/* Flashcards Hotspot */}
          <a-sphere
            mixin="hotspot"
            position="-2 2 -3"
            class="clickable flashcards-hotspot"
            data-action="flashcards"
          />
          <a-text
            value="🧠 Flashcards"
            position="-2 1.7 -3"
            align="center"
            color="#372D48"
            width="8"
          />

          {/* Video Lesson Hotspot */}
          <a-sphere
            mixin="hotspot"
            position="2 2 -3"
            class="clickable video-hotspot"
            data-action="video"
          />
          <a-text
            value="🎥 Video Lesson"
            position="2 1.7 -3"
            align="center"
            color="#372D48"
            width="8"
          />

          {/* Quiz Hotspot */}
          <a-sphere
            mixin="hotspot"
            position="0 2.5 -4"
            class="clickable quiz-hotspot"
            data-action="quiz"
          />
          <a-text
            value="❓ Take Quiz"
            position="0 2.2 -4"
            align="center"
            color="#372D48"
            width="8"
          />

          {/* Topic Information Panel */}
          <a-plane
            mixin="panel"
            position="0 1.5 -2"
            rotation="-15 0 0"
          />
          <a-text
            value={`Current Topic:\n${currentTopic ? topics.find(t => t.id === currentTopic)?.name || 'Loading...' : 'No Topic Selected'}`}
            position="0 1.5 -1.99"
            align="center"
            color="#372D48"
            width="6"
            wrap-count="25"
          />

          {/* Progress Panel */}
          <a-plane
            geometry="primitive: plane; width: 1.5; height: 0.8"
            material="color: #F2F0F7; opacity: 0.9"
            position="-3 1 -2"
            rotation="0 30 0"
          />
          <a-text
            value="Progress:\n📚 Topics: 0/4\n⏱️ Time: 2h\n🎯 Accuracy: 85%"
            position="-3 1 -1.99"
            align="center"
            color="#372D48"
            width="4"
          />

          {/* Instructions Panel */}
          <a-plane
            geometry="primitive: plane; width: 1.5; height: 0.8"
            material="color: #E6E4F0; opacity: 0.9"
            position="3 1 -2"
            rotation="0 -30 0"
          />
          <a-text
            value="Instructions:\n👀 Look around\n👆 Click spheres\n🎧 Use headphones\n🥽 Enter VR mode"
            position="3 1 -1.99"
            align="center"
            color="#372D48"
            width="4"
          />

          {/* Ground plane for depth */}
          <a-plane
            position="0 0 -4"
            rotation="-90 0 0"
            width="20"
            height="20"
            material="color: #C9C3DE; opacity: 0.3"
          />

          {/* Ambient lighting */}
          <a-light type="ambient" color="#A191C1" intensity="0.6" />
          <a-light type="directional" position="2 4 2" color="#FFFFFF" intensity="0.4" />
        </a-scene>
      </div>

      {/* VR Instructions Overlay */}
      <div className="fixed bottom-4 left-4 right-4 z-10">
        <Card className="card-bg border-primary/20">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">
              <strong>VR Controls:</strong> Look around to explore • Click on glowing spheres to interact • 
              Press VR button in bottom right for immersive mode
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Add click handlers for hotspots
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners for VR hotspot interactions
    const hotspots = document.querySelectorAll('.clickable');
    hotspots.forEach(hotspot => {
      hotspot.addEventListener('click', (event) => {
        const action = (event.target as any).getAttribute('data-action');
        switch (action) {
          case 'flashcards':
            window.location.href = '/learn#flashcards';
            break;
          case 'video':
            window.location.href = '/learn#video';
            break;
          case 'quiz':
            window.location.href = '/learn#quiz';
            break;
        }
      });
    });
  });
}

export default VRPreview;