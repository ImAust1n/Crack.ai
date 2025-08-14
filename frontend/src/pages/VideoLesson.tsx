import { Canvas } from "@react-three/fiber";
import Scene from "../components/yt/Scene";
import { LoadingScreen } from "../components/yt/LoadingScreen";
import { Suspense, useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const App = () => {
  const [start, setStart] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const containerRef = useRef(null);
  const navigate = useNavigate();
  const { subjectId, topicId } = useParams();

  // Load video URL from topic data
  useEffect(() => {
    const loadVideoUrl = async () => {
      if (!subjectId || !topicId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/data/${subjectId}.json`);
        if (!response.ok) {
          throw new Error(`Failed to load ${subjectId} data`);
        }
        
        const data = await response.json();
        const topic = data.topics?.find((t: { id: string; video?: string; videos?: string }) => t.id === topicId);
        
        if (topic) {
          // Extract video URL (handle both 'video' and 'videos' properties)
          const url = topic.video || topic.videos;
          if (url) {
            setVideoUrl(url);
          }
        }
      } catch (err) {
        console.error('Error loading video:', err);
      } finally {
        setLoading(false);
      }
    };

    loadVideoUrl();
  }, [subjectId, topicId]);

  // Persist current lesson so VRTutor can pick it up
  useEffect(() => {
    try {
      const payload = {
        subjectId: subjectId ?? null,
        topicId: topicId ?? null,
        videoUrl: videoUrl ?? null,
        storedAt: Date.now(),
      };
      localStorage.setItem('currentLesson', JSON.stringify(payload));
    } catch (e) {
      console.warn('Failed to persist current lesson', e);
    }
  }, [subjectId, topicId, videoUrl]);

  const toggleFullscreen = async () => {
    const doc = document;
    // Prefer requesting fullscreen on the Canvas CONTAINER so Html overlays remain visible
    const elem = containerRef.current || doc.documentElement;
    const isFs = !!(
      doc.fullscreenElement ||
      doc.fullscreenElement ||
      doc.fullscreenElement ||
      doc.fullscreenElement
    );

    try {
      if (!isFs) {
        const req =
          elem.requestFullscreen ||
          elem.webkitRequestFullscreen ||
          elem.mozRequestFullScreen ||
          elem.msRequestFullscreen;
        if (req) {
          const r = req.call(elem);
          if (r && typeof r.then === 'function') {
            await r;
          }
        }
        // try to lock orientation if supported (best-effort)
        type OrientationWithLock = { lock?: (orientation: 'landscape' | 'portrait') => Promise<void> | void };
        const so = (screen as unknown as { orientation?: OrientationWithLock }).orientation;
        if (so?.lock) {
          try {
            await so.lock('landscape');
          } catch (err) {
            console.debug('Orientation lock not supported:', err);
          }
        }
      } else {
        const exit =
          doc.exitFullscreen ||
          doc.webkitExitFullscreen ||
          doc.mozCancelFullScreen ||
          doc.msExitFullscreen;
        if (exit) {
          const r = exit.call(doc);
          if (r && typeof r.then === 'function') {
            await r;
          }
        }
      }
    } catch (e) {
      console.warn('Fullscreen request failed:', e);
    }
  };

  const goToQuiz = () => {
    if (subjectId && topicId) {
      navigate(`/learn/${subjectId}/${topicId}/quiz`);
    } else {
      // Fallback if params are missing
      navigate('/learn/quiz');
    }
  };
  return (
    <>
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100vh',
          position: 'relative',
          overflow: 'visible',
        }}
      >
        <Canvas
          style={{ width: '100%', height: '100%' }}
          camera={{
            position: [0, 0, 1],
          }}
        >
          <Suspense fallback={null}>
            <Scene videoUrl={videoUrl} subjectId={subjectId} topicId={topicId} />
          </Suspense>
        </Canvas>
      </div>
      <LoadingScreen started={start} onStarted={() => setStart(true)} />
      {/* Fixed bottom-left VR button overlay */}
      <button
        className="vrFixedBtn"
        style={{
          position: 'fixed',
          bottom: 16,
          left: 16,
          zIndex: 9999,
          backgroundColor: '#111',
          color: '#fff',
          padding: '10px 14px',
          borderRadius: 8,
          border: '1px solid rgba(255,255,255,0.4)',
          boxShadow: '0 6px 18px rgba(0,0,0,0.35)',
          fontWeight: 600,
          letterSpacing: 0.2,
          cursor: 'pointer'
        }}
        onClick={toggleFullscreen}
      >
        Fullscreen
      </button>

      {/* Bottom-right Go to Quiz button */}
      <button
        className="vrFixedBtn"
        style={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 9999,
          backgroundColor: '#111',
          color: '#fff',
          padding: '10px 14px',
          borderRadius: 8,
          border: '1px solid rgba(255,255,255,0.4)',
          boxShadow: '0 6px 18px rgba(0,0,0,0.35)',
          fontWeight: 600,
          letterSpacing: 0.2,
          cursor: 'pointer'
        }}
        onClick={goToQuiz}
      >
        Go to Quiz
      </button>
    </>
  );
};

export default App;
