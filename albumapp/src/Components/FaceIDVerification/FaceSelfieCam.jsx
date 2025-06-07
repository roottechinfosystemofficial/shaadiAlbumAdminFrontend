// import { StyleSheet, Text, View } from "react-native";
// import React from "react";

// const FaceSelfieCam = () => {
//   return (
//     <View>
//       <Text>FaceSelfieCam</Text>
//     </View>
//   );
// };

// export default FaceSelfieCam;

// const styles = StyleSheet.create({});
import React, { useState, useRef, useEffect } from "react";
import { CameraView, Camera } from "expo-camera";
// import * as FaceDetector from "expo-face-detector";

import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import BackButton from "../BackButton";
import { hp, wp } from "../../helpers/Common";
import { theme } from "../../constants/themes";
import ScreenWrapper from "../ScreenWrapper";

const FaceSelfieCam = () => {
  const navigation = useNavigation();
  const cameraRef = useRef(null);
  // const [permission, setPermission] = useState(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  // useEffect(() => {
  //   (async () => {
  //     const { status } = await Camera.requestCameraPermissionsAsync();
  //     setPermission(status === "granted");
  //   })();
  // }, []);

  const handleFacesDetected = ({ faces }) => {
    setFaceDetected(faces.length > 0);
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
        setIsCapturing(true);
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.7,
          base64: true,
        });
        console.log("Captured selfie URI:", photo.uri);
        Alert.alert("Selfie Captured!", "Check console for URI.");
      } catch (error) {
        console.error("Error capturing photo:", error);
      } finally {
        setIsCapturing(false);
      }
    }
  };

  if (permission === null) {
    return <View style={styles.loadingContainer} />;
  }

  if (permission === false) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          We need your permission to access the camera
        </Text>
        <Button
          title="Grant Permission"
          onPress={Camera.requestCameraPermissionsAsync}
        />
      </View>
    );
  }

  return (
    <ScreenWrapper bg="white">
      <StatusBar
        barStyle={"dark-content"} // icon/text color
        backgroundColor={"transparent"}
        translucent
      />
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.backButton}>
          <BackButton navigation={navigation} />
        </View>
        <Text style={styles.title}>Selfie Capture</Text>
      </View>

      {/* Camera + Controls */}
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
            onFacesDetected={({ faces }) => {
              console.log("Faces detected:", faces); // LOG ADD KIYA
              if (faces.length > 0) {
                console.log("✅ Face detected!");
                setFaceDetected(true);
              } else {
                setFaceDetected(false);
              }
            }}
            // faceDetectorSettings={{
            //   mode: FaceDetector.FaceDetectorMode.fast,
            //   detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
            //   runClassifications: FaceDetector.FaceDetectorClassifications.none,
            // }}
          />
        </View>

        {/* Instructions + Capture Button */}
        <View style={styles.instructionContainer}>
          <Text style={styles.instructionText}>Take a Selfie</Text>
          <Text
            style={[
              styles.faceDetectionText,
              { color: faceDetected ? "green" : "red" },
            ]}
          >
            {faceDetected
              ? "Face detected! Ready to capture."
              : "Keep your face within the frame."}
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
    alignItems: "center",
    paddingVertical: hp(2),
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: wp(4),
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: theme.colours.primary,
    fontFamily: "Poppins",
  },
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: hp(2),
    backgroundColor: "white",
  },
  cameraWrapper: {
    width: 300,
    height: 300,
    borderRadius: 150,
    overflow: "hidden",
    borderWidth: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  instructionContainer: {
    marginTop: hp(5),
    alignItems: "center",
  },
  instructionText: {
    fontSize: 16,
    color: theme.colours.primary,
    marginBottom: 10,
  },
  faceDetectionText: {
    fontSize: 14,
    marginBottom: 10,
  },
  captureButtonWrapper: {
    marginTop: hp(3),
    padding: 15,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  permissionText: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 20,
    color: "black",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "white",
  },
});
