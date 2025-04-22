import React, { useRef, useState, useEffect } from "react";
import {
  Animated,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  StatusBar,
  PanResponder,
} from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import ScreenWrapper from "../Components/ScreenWrapper";

const { width, height } = Dimensions.get("window");

const images = [
  require("../../assets/albumbook/img1.jpg"),
  require("../../assets/albumbook/img2.jpg"),
  require("../../assets/albumbook/img8.jpg"),
  require("../../assets/albumbook/img14.jpg"),
  require("../../assets/albumbook/img20.jpg"),
  require("../../assets/albumbook/img26.jpg"),
];

export default function FlipBookScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pan = useRef(new Animated.ValueXY()).current;

  // Lock screen orientation to landscape
  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  const flipPage = (direction) => {
    Animated.sequence([
      Animated.timing(rotateAnim, {
        toValue: direction === "next" ? 180 : -180,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (direction === "next" && currentIndex + 1 < images.length) {
        setCurrentIndex((prev) => prev + 1);
      } else if (direction === "prev" && currentIndex - 1 >= 0) {
        setCurrentIndex((prev) => prev - 1);
      }
    });
  };

  const rotateY = rotateAnim.interpolate({
    inputRange: [-180, 0, 180],
    outputRange: ["-180deg", "0deg", "180deg"],
  });

  const frontOpacity = rotateAnim.interpolate({
    inputRange: [-180, 0, 180],
    outputRange: [0, 1, 0],
  });

  const backOpacity = rotateAnim.interpolate({
    inputRange: [-180, 0, 180],
    outputRange: [0, 0, 1],
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderRelease: (e, gestureState) => {
        // Swipe from left to right (previous image)
        if (gestureState.dx > 50 && currentIndex - 1 >= 0) {
          flipPage("prev");
        }
        // Swipe from right to left (next image)
        else if (gestureState.dx < -50 && currentIndex + 1 < images.length) {
          flipPage("next");
        }
      },
    })
  ).current;

  return (
    <ScreenWrapper bg="#000">
      {/* Wrap the content with ScreenWrapper */}
      <StatusBar hidden />
      <TouchableWithoutFeedback onPress={() => flipPage("next")}>
        <View style={styles.flipWrapper} {...panResponder.panHandlers}>
          <Animated.View
            style={[
              styles.page,
              {
                width: width - 40, // Ensure full screen size
                height: height - 40,
                transform: [{ perspective: 2000 }, { rotateY }],
              },
            ]}
          >
            <Animated.Image
              source={images[currentIndex]}
              style={[styles.pageImage, { opacity: frontOpacity }]}
              resizeMode="contain"
            />
            {currentIndex + 1 < images.length && (
              <Animated.Image
                source={images[currentIndex + 1]}
                style={[
                  styles.pageImage,
                  styles.pageBack,
                  { opacity: backOpacity },
                ]}
                resizeMode="contain"
              />
            )}
            {currentIndex - 1 >= 0 && (
              <Animated.Image
                source={images[currentIndex - 1]}
                style={[
                  styles.pageImage,
                  styles.pageBack,
                  { opacity: backOpacity },
                ]}
                resizeMode="contain"
              />
            )}
          </Animated.View>
          <View style={styles.crease} />
        </View>
      </TouchableWithoutFeedback>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  flipWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  page: {
    position: "relative",
    backfaceVisibility: "hidden",
  },
  pageImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  pageBack: {
    transform: [{ rotateY: "180deg" }],
  },
  crease: {
    position: "absolute",
    left: "50%",
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    zIndex: 10,
  },
});
