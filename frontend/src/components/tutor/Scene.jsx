import { CameraControls, Environment, Gltf, Html } from "@react-three/drei";
import { useEffect, useState } from "react";
import { useTopicContent } from "../hooks/useTopicContent";
import { Avatar } from "./Avatar";

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

const Scene = ({ subjectId, topicId }) => {
  // Shared hook to mirror VideoLesson behavior exactly
  const { topicImage, topicText, title } = useTopicContent(subjectId, topicId);

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

      {/* AI Tutor Avatar at previous location, with TTS text from right panel */}
      <Avatar
        rotation={[0, 0, 0]}
        scale={100}
        position={[0, -140, -250]}
        ttsText={topicText}
      />


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
            <h3 style={{margin: "0 0 8px", fontSize: "18px", color: "#fff"}}>{title}</h3>
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
