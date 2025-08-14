import { Canvas } from "@react-three/fiber";
import Scene from "../components/tutor/Scene";
import { LoadingScreen } from "../components/tutor/LoadingScreen";
import { Suspense, useRef, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const VRTutor = () => {
  const [start, setStart] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Derive subject/topic from route state or query params
  type TutorNavState = { subjectId?: string; topicId?: string } | null;
  const { subjectId, topicId } = useMemo(() => {
    const state = (location.state as TutorNavState) || null;
    const params = new URLSearchParams(location.search);
    let subj = state?.subjectId ?? params.get("subject") ?? undefined;
    let topic = state?.topicId ?? params.get("topic") ?? undefined;

    // Fallback to last VideoLesson in localStorage
    if (!subj || !topic) {
      try {
        const raw = localStorage.getItem('currentLesson');
        if (raw) {
          const saved = JSON.parse(raw) as { subjectId?: string | null; topicId?: string | null };
          subj = subj ?? (saved.subjectId ?? undefined);
          topic = topic ?? (saved.topicId ?? undefined);
        }
      } catch (e) {
        console.warn('VRTutor: failed to read currentLesson from storage', e);
      }
    }

    if (!subj || !topic) {
      console.warn("VRTutor: subjectId/topicId missing. Pass via navigation state or ?subject=&topic=, or open a VideoLesson first.");
    }
    console.log("VRTutor route params:", { subjectId: subj, topicId: topic, fromState: state, fromQuery: Object.fromEntries(params.entries()) });
    return { subjectId: subj, topicId: topic };
  }, [location.state, location.search]);

  const toggleFullscreen = async () => {
    const doc = document as any; // Type assertion for browser compatibility
    // Prefer requesting fullscreen on the Canvas CONTAINER so Html overlays remain visible
    const elem = containerRef.current || doc.documentElement;
    const isFs = !!(
      doc.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement
    );

    try {
      if (!isFs) {
        const req =
          (elem as any).requestFullscreen ||
          (elem as any).webkitRequestFullscreen ||
          (elem as any).mozRequestFullScreen ||
          (elem as any).msRequestFullscreen;
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

  const goToDashboard = () => {
    navigate('/dashboard');
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
          dpr={[1, 1.5]}
          shadows={false}
          frameloop="always"
          camera={{
            position: [0, 0, 1],
          }}
          gl={{
            // Reduce GPU pressure to avoid context loss
            powerPreference: 'high-performance',
            antialias: false,
            alpha: false,
            stencil: false,
            depth: true,
            preserveDrawingBuffer: false,
            failIfMajorPerformanceCaveat: false,
          }}
          onCreated={({ gl }) => {
            // Add WebGL context recovery handling
            const canvas = gl.domElement;
            // Try to get WEBGL_lose_context to manually restore when possible
            const raw: WebGLRenderingContext | WebGL2RenderingContext | null = (gl as any).getContext?.() ?? null;
            const loseCtxExt: { restoreContext?: () => void } | null = raw ? (raw.getExtension('WEBGL_lose_context') as any) : null;

            const handleContextLost = (event: Event) => {
              event.preventDefault();
              console.warn('WebGL context lost. Attempting recovery...');
              // Best-effort restore via extension
              if (loseCtxExt && typeof loseCtxExt.restoreContext === 'function') {
                // Give the browser a moment before restoring
                setTimeout(() => {
                  try {
                    loseCtxExt.restoreContext();
                  } catch (e) {
                    console.warn('Failed to call restoreContext:', e);
                  }
                }, 250);
              }
            };

            const handleContextRestored = () => {
              console.log('WebGL context restored successfully.');
              // Force re-render by remounting scene
              setStart(false);
              setTimeout(() => setStart(true), 100);
            };

            canvas.addEventListener('webglcontextlost', handleContextLost as EventListener, { passive: false });
            canvas.addEventListener('webglcontextrestored', handleContextRestored as EventListener);

            // Cleanup listeners on unmount
            return () => {
              canvas.removeEventListener('webglcontextlost', handleContextLost as EventListener);
              canvas.removeEventListener('webglcontextrestored', handleContextRestored as EventListener);
            };
          }}
        >
          <Suspense fallback={null}>
            {start && <Scene subjectId={subjectId} topicId={topicId} />}
          </Suspense>
        </Canvas>
      </div>
      <LoadingScreen started={start} onStarted={() => setStart(true)} />
      
      {/* Fixed bottom-left Fullscreen button overlay */}
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

      {/* Bottom-right Retake Quiz button */}
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
        onClick={() => {
          if (subjectId && topicId) {
            navigate(`/learn/${subjectId}/${topicId}/quiz`);
          } else {
            // fallback if ids are missing
            navigate('/learn/quiz');
          }
        }}
      >
        Retake Quiz
      </button>
    </>
  );
};

export default VRTutor;
