import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Camera, CameraType } from "expo-camera";
import * as FaceDetector from "expo-face-detector";

// Keep the face type if needed (optional)
type DetectedFace = {
  bounds: {
    origin: { x: number, y: number },
    size: { width: number, height: number },
  },
  faceID?: number,
  rollAngle?: number,
  smilingProbability?: number,
  leftEyeOpenProbability?: number,
  rightEyeOpenProbability?: number,
  leftEyePosition?: { x: number, y: number },
  rightEyePosition?: { x: number, y: number },
  noseBasePosition?: { x: number, y: number },
  mouthPosition?: { x: number, y: number },
  leftCheekPosition?: { x: number, y: number },
  rightCheekPosition?: { x: number, y: number },
  leftEarPosition?: { x: number, y: number },
  rightEarPosition?: { x: number, y: number },
};

export default function SelfieWithFaceDetector() {
  const [hasPermission, setHasPermission] = useState(null); // inferred as null | boolean
  const [faceDetected, setFaceDetected] = useState(false); // inferred as boolean
  const [isCapturing, setIsCapturing] = useState(false); // inferred as boolean

  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        console.log("Camera permission status:", status);
        setHasPermission(status === "granted");
      } catch (err) {
        console.error("Failed to get camera permissions", err);
      }
    })();
  }, []);

  const handleFacesDetected = ({ faces }: { faces: DetectedFace[] }) => {
    setFaceDetected(faces.length > 0);
  };

  const takeSelfie = async () => {
    if (cameraRef.current && faceDetected && !isCapturing) {
      setIsCapturing(true);
      const photo = await cameraRef.current.takePictureAsync();
      console.log("📸 Selfie taken:", photo.uri);
      setIsCapturing(false);
    }
  };

  if (hasPermission === null) {
    return <ActivityIndicator />;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type="front"
        onFacesDetected={handleFacesDetected}
        faceDetectorSettings={{
          mode: FaceDetector.FaceDetectorMode.fast,
          detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
          runClassifications: FaceDetector.FaceDetectorClassifications.none,
        }}
      />

      <View style={styles.controls}>
        {faceDetected ? (
          <Text style={styles.readyText}>✅ Face Detected</Text>
        ) : (
          <Text style={styles.waitingText}>🔍 Looking for face...</Text>
        )}
        <TouchableOpacity
          style={[
            styles.captureButton,
            !faceDetected && { backgroundColor: "#aaa" },
          ]}
          onPress={takeSelfie}
          disabled={!faceDetected || isCapturing}
        >
          <Text style={styles.captureText}>Capture</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  camera: { flex: 4 },
  controls: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111",
    paddingBottom: 20,
  },
  readyText: { color: "#0f0", fontSize: 18, marginBottom: 10 },
  waitingText: { color: "#f00", fontSize: 18, marginBottom: 10 },
  captureButton: {
    backgroundColor: "#1e90ff",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  captureText: { color: "#fff", fontSize: 16 },
});
