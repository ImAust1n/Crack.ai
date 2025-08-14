import React, { useEffect, useState, useRef, useMemo } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";

// Fallback avatar if model fails to load
function SimpleAvatar({ scale = 1, position = [0, 0, 0] }) {
  return (
    <group scale={scale} position={position}>
      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.5, 1, 0.3]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.6, 0]}>
        <sphereGeometry args={[0.25]} />
        <meshStandardMaterial color="#FDBCB4" />
      </mesh>
    </group>
  );
}

export function Avatar({ scale = 1, position = [0, 0, 0], rotation, ttsText }) {
  const groupRef = useRef();
  // Speak fetched text from parent (right panel). If not provided, stay silent.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const synth = window.speechSynthesis;
    if (!synth) return;
    // Cancel any ongoing speech before speaking new text
    synth.cancel();
    if (!ttsText || !ttsText.trim()) return;
    const utter = new SpeechSynthesisUtterance(ttsText);
    utter.lang = 'en-US';
    utter.rate = 1.0;
    utter.pitch = 1.0;
    try {
      synth.speak(utter);
    } catch (e) {
      console.warn('TTS speak failed:', e);
    }
    return () => {
      try {
        synth.cancel();
      } catch {}
    };
  }, [ttsText]);

  // Load the GLB model safely
  let gltf;
  try {
    gltf = useGLTF(    "https://models.readyplayer.me/64722c41c977ad9f22319186.glb?morphTargets=Oculus%20Visemes"
    );
  } catch (error) {
    console.error("Error loading GLTF model:", error);
    return <SimpleAvatar scale={scale} position={position} />;
  }

  const { scene } = gltf || {};

  // If no scene is available, fallback
  if (!scene) {
    console.warn("Avatar: Missing GLTF scene, using fallback.");
    return <SimpleAvatar scale={scale} position={position} />;
  }

  // Text-to-speech
  const speak = () => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    } else {
      console.warn("Speech synthesis not supported in this browser.");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      speak();
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Calculate vertical offset so the model sits on ground (y=0)
  const baseOffsetY = useMemo(() => {
    try {
      const temp = scene.clone(true);
      const box = new THREE.Box3().setFromObject(temp);
      // Move model up by -min.y so lowest point is at y=0
      return -box.min.y;
    } catch (e) {
      console.warn("Avatar: failed to compute bounding box for offset", e);
      return 0;
    }
  }, [scene]);

  // If scale is a number, multiply the offset; otherwise leave as-is
  const offsetY = typeof scale === "number" ? baseOffsetY * scale : baseOffsetY;

  return (
    <group ref={groupRef} dispose={null} position={position} rotation={rotation}>
      <group position={[0, offsetY, 0]} scale={scale}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

useGLTF.preload("https://models.readyplayer.me/64722c41c977ad9f22319186.glb?morphTargets=Oculus%20Visemes");
