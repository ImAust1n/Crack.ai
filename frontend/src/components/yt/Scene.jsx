import { CameraControls, Environment, Gltf, Html } from "@react-three/drei";
import { useEffect, useState } from "react";

const CameraManager = () => {
  return (
    <CameraControls
      // maxAzimuthAngle={Math.PI / 2}
      // minAzimuthAngle={-Math.PI / 2}
      maxPolarAngle={(2 * Math.PI) / 3}
      minPolarAngle={Math.PI / 3}
      zoom={true}
      mouseButtons={{
        left: 1,   // select / left-drag (for areas not covered by iframe)
        right: 2,  // allow right-drag orbit even when iframe needs left-click
        wheel: 16,
      }}
      touches={{ one: 32, two: 512 }}
    />
  );
};

const Scene = ({ videoUrl, subjectId, topicId }) => {
  // State for single topic image
  const [topicImage, setTopicImage] = useState("https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=1280&q=80&auto=format&fit=crop");
  // State for topic text content
  const [topicText, setTopicText] = useState("Loading topic information...");

  // Fetch single topic-related image from backend
  useEffect(() => {
    const fetchTopicImage = async () => {
      if (!subjectId || !topicId) return;

      try {
        const searchTerm = topicId.replace(/-/g, ' '); // Convert topic ID to readable term

        const response = await fetch(import.meta.env.REACT_APP_BACKEND_URL || 'http://127.0.0.1:5000/api/image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: searchTerm,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.response && !data.response.startsWith('Error:')) {
            setTopicImage(data.response);
          } else {
            console.warn('Invalid image response from backend, using default image');
          }
        } else {
          console.warn('Failed to fetch topic image from backend, using default image');
        }
      } catch (error) {
        console.error('Error fetching topic image:', error);
        // Keep default image on error
      }
    };

    fetchTopicImage();
  }, [subjectId, topicId]);

  // Fetch topic-related text content from backend
  useEffect(() => {
    const fetchTopicText = async () => {
      if (!subjectId || !topicId) return;

      try {
        const searchTerm = topicId.replace(/-/g, ' '); // Convert topic ID to readable term

        const response = await fetch('http://127.0.0.1:5000/api/text', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: searchTerm,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.response && !data.response.startsWith('Error:')) {
            // Ensure we extract just the text content, not JSON formatting
            let textContent = data.response;
            
            // If the response is a stringified JSON, parse it
            if (typeof textContent === 'string' && textContent.startsWith('{')) {
              try {
                const parsed = JSON.parse(textContent);
                textContent = parsed.response || parsed.text || textContent;
              } catch (e) {
                // If parsing fails, use the original text
              }
            }
            
            // Clean up any extra formatting
            textContent = String(textContent).trim();
            setTopicText(textContent);
          } else {
            setTopicText("Unable to load topic information. Please check your connection.");
          }
        } else {
          setTopicText("Failed to load topic information from server.");
        }
      } catch (error) {
        console.error('Error fetching topic text:', error);
        setTopicText("Error loading topic information. Please try again later.");
      }
    };

    fetchTopicText();
  }, [subjectId, topicId]);

  // Convert YouTube URL to embed format
  const getEmbedUrl = (url) => {
    if (!url) return "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&playsinline=1&rel=0&controls=1&modestbranding=1";
    
    try {
      // Handle various YouTube URL formats
      if (url.includes('youtube.com/watch?v=')) {
        const videoId = url.split('v=')[1]?.split('&')[0];
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&playsinline=1&rel=0&controls=1&modestbranding=1`;
      } else if (url.includes('youtube.com/playlist?list=')) {
        const playlistId = url.split('list=')[1]?.split('&')[0];
        return `https://www.youtube.com/embed/videoseries?list=${playlistId}&autoplay=1&mute=1&playsinline=1&rel=0&controls=1&modestbranding=1`;
      } else if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1]?.split('?')[0];
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&playsinline=1&rel=0&controls=1&modestbranding=1`;
      }
      return url; // Return as-is if already embed format
    } catch (error) {
      console.error('Error converting YouTube URL:', error);
      return "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&playsinline=1&rel=0&controls=1&modestbranding=1";
    }
  };


  return (
    <>
      <CameraManager />
      <Environment preset="sunset" />
      <ambientLight intensity={0.6} />
      <Gltf
        src="/models/classroom.glb"
        position={[110, -140, 40]}
        rotation={[0, Math.PI, 0]}
      />

      {/* Center frame with YouTube video anchored in scene (world space) */}
      <group position={[0, 0, -1.5]}>
        {/* Inner dark panel (slightly smaller) */}
        <mesh position={[0, 0, -0.01]}> 
          <planeGeometry args={[1.2, 0.7]} />
          <meshStandardMaterial color="#222" />
        </mesh>
        {/* Outer border/backing */}
        <mesh position={[0, 0, -0.02]}>
          <planeGeometry args={[1.3, 0.8]} />
          <meshStandardMaterial color="#696969" />
        </mesh>

        {/* YouTube iframe projected in 3D space (no auto-tilt) */}
        <Html transform distanceFactor={1.8} zIndexRange={[200, 200]}>
          <div
            style={{
              width: "640px",
              height: "360px",
              border: "2px solid #ffffff",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 8px 24px rgba(0,0,0,0.45)",
              background: "#000",
              pointerEvents: "auto",
            }}
          >
            <iframe
              width="100%"
              height="100%"
              src={getEmbedUrl(videoUrl)}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </Html>
      </group>

      {/* Left screen-like frame (further left, tilted toward user) */}
      <group position={[-3.0, 0, -1.4]} rotation={[0, 0.35, 0]}>
        {/* Inner dark panel */}
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[1.0, 0.6]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        {/* Outer border/backing */}
        <mesh position={[0, 0, -0.02]}>
          <planeGeometry args={[1.1, 0.7]} />
          <meshStandardMaterial color="#606060" />
        </mesh>
        {/* Html image container; ignore pointer events to keep camera free */}
        <Html transform sprite distanceFactor={2.0} zIndexRange={[180, 180]}>
          <div
            style={{
              width: "480px",
              height: "270px",
              border: "2px solid #ffffff",
              borderRadius: "6px",
              background: "#000",
              boxShadow: "0 6px 18px rgba(0,0,0,0.4)",
              overflow: "hidden",
              pointerEvents: "none",
            }}
          >
            <img
              src={topicImage}
              alt="Topic related image"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
        </Html>
      </group>
      
      {/* Right screen-like frame (further right, tilted toward user) */}
      <group position={[3.0, 0, -1.4]} rotation={[0, -0.35, 0]}>
        {/* Inner dark panel */}
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[1.0, 0.6]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        {/* Outer border/backing */}
        <mesh position={[0, 0, -0.02]}>
          <planeGeometry args={[1.1, 0.7]} />
          <meshStandardMaterial color="#606060" />
        </mesh>
        {/* Html scrollable text panel; pointer events enabled for scrolling */}
        <Html transform distanceFactor={2.0} portal={document.body} zIndexRange={[90, 90]}>
          <div
            style={{
              width: "480px",
              height: "270px",
              border: "2px solid #ffffff",
              borderRadius: "6px",
              background: "#111",
              boxShadow: "0 6px 18px rgba(0,0,0,0.4)",
              color: "#e6e6e6",
              overflowY: "auto",
              overflowX: "hidden",
              padding: "14px 16px",
              lineHeight: 1.4,
              fontSize: "14px",
              pointerEvents: "auto",
              overscrollBehavior: "contain",
            }}
          >
            <h3 style={{margin: "0 0 8px", fontSize: "18px", color: "#fff"}}>
              {topicId ? topicId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Topic Information'}
            </h3>
            <div style={{margin: "0", opacity: 0.9, whiteSpace: "pre-wrap", lineHeight: 1.5}}>
              {topicText}
            </div>
          </div>
        </Html>
      </group>
    </>
  );
};

export default Scene;
