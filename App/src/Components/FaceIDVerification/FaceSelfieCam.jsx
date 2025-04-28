import React, { useState, useRef } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";

import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import BackButton from "../BackButton";
import { useNavigation } from "@react-navigation/native";
import { hp, wp } from "../../helpers/Common";
import { theme } from "../../constants/themes";
import * as FaceDetector from "expo-face-detector";

import ScreenWrapper from "../ScreenWrapper";

const FaceSelfieCam = () => {
  const navigation = useNavigation();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [faceDetected, setFaceDetected] = useState(false); // NEW: track face detection
  const [isCapturing, setIsCapturing] = useState(false); // prevent multiple captures

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }

  const handleFacesDetected = ({ faces }) => {
    if (faces.length > 0) {
      setFaceDetected(true);
    } else {
      setFaceDetected(false);
    }
  };

  const handleCaptureSelfie = async () => {
    if (!faceDetected) {
      Alert.alert(
        "No Face Detected",
        "Please ensure your face is in the frame."
      );
      return;
    }

    if (cameraRef.current && !isCapturing) {
      try {
        setIsCapturing(true); // avoid double captures
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.7,
          base64: true,
        });
        console.log("Captured selfie:", photo.uri);
        Alert.alert("Selfie Captured!", "Check console for URI.");
        setIsCapturing(false);
      } catch (error) {
        console.error("Error capturing photo", error);
        setIsCapturing(false);
      }
    }
  };

  return (
    <ScreenWrapper bg="white">
      <View style={styles.header}>
        <View style={{ position: "absolute", left: wp(4) }}>
          <BackButton navigation={navigation} />
        </View>
        <Text style={styles.title}>Selfie Capture</Text>
      </View>

      <View style={styles.container}>
        <View
          style={[
            styles.cameraWrapper,
            { borderColor: faceDetected ? "green" : "gray" },
          ]}
        >
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing="front"
            onFacesDetected={handleFacesDetected}
            faceDetectorSettings={{
              mode: FaceDetector.FaceDetectorMode.fast,
              detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
              runClassifications: FaceDetector.FaceDetectorClassifications.none,
              minDetectionInterval: 100,
              tracking: true,
            }}
          />
        </View>

        <View style={{ marginTop: hp(5), alignItems: "center" }}>
          <Text
            style={{
              color: theme.colours.primary,
              fontSize: 16,
              marginBottom: 10,
            }}
          >
            Take Selfie
          </Text>

          <Text
            style={{
              color: faceDetected ? "green" : "red",
              fontSize: 14,
              marginBottom: 10,
            }}
          >
            {faceDetected
              ? "Face detected! Now you can capture."
              : "Please keep camera steady towards your face."}
          </Text>

          <TouchableOpacity
            onPress={handleCaptureSelfie}
            style={[
              styles.captureButtonWrapper,
              { backgroundColor: faceDetected ? "#4CAF50" : "#ccc" },
            ]}
            disabled={!faceDetected}
          >
            <MaterialIcons
              name="photo-camera"
              size={60}
              color={faceDetected ? "white" : "gray"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default FaceSelfieCam;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    paddingVertical: hp(1),
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 50,
    alignItems: "center",
  },
  message: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: theme.colours.primary,
    fontFamily: "Poppins",
    textAlign: "center",
  },
  cameraWrapper: {
    width: 300,
    height: 300,
    borderRadius: 150,
    overflow: "hidden",
    borderWidth: 5,
    borderColor: "gray", // default gray
  },
  camera: {
    flex: 1,
  },
  captureButtonWrapper: {
    marginTop: hp(5),
    padding: 15,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});
