import { useProgress } from "@react-three/drei";
import { useEffect } from "react";

export const LoadingScreen = ({ started, onStarted }) => {
  const { progress } = useProgress();
  console.log(progress);

  // Auto start when assets are fully loaded
  useEffect(() => {
    if (progress >= 100 && !started) {
      onStarted();
    }
  }, [progress, started, onStarted]);
  return (
    <div className={`loadingScreen ${started ? "loadingScreen--started" : ""}`}>
      <div className="loadingScreen__background" />
      <div className="loadingScreen__board">
        <h1 className="loadingScreen__title">
          Loading {Math.round(progress)}%
        </h1>
        {/* Removed Start button; auto-starts when progress reaches 100% */}
      </div>
      <div className="loadingScreen__progress">
        <div
          className="loadingScreen__progress__value"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </div>
  );
};
