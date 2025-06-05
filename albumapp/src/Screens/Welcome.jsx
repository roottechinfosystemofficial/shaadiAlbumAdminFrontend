import React, { useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  StyleSheet,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { PanGestureHandler } from "react-native-gesture-handler"; // Import PanGestureHandler

const { width, height } = Dimensions.get("window");

const data = [
  { id: 1, image: require("../../assets/images/welcome-1.jpg") },
  { id: 2, image: require("../../assets/images/welcome-2.jpg") },
  { id: 3, image: require("../../assets/images/welcome-3.jpg") },
];

const Welcome = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigation = useNavigation();

  const goToNextSlide = () => {
    if (activeIndex === data.length - 1) {
      navigation.navigate("AuthPage");
    } else {
      setActiveIndex(activeIndex + 1);
    }
  };

  const handleDotPress = (index) => {
    setActiveIndex(index);
  };

  const handleGestureEvent = (event) => {
    if (event.nativeEvent.translationX > 100) {
      setActiveIndex((prevIndex) => (prevIndex === 0 ? 0 : prevIndex - 1)); // Swipe right
    } else if (event.nativeEvent.translationX < -100) {
      setActiveIndex((prevIndex) =>
        prevIndex === data.length - 1 ? data.length - 1 : prevIndex + 1
      ); // Swipe left
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent={true}
        backgroundColor="transparent"
      />
      <PanGestureHandler onGestureEvent={handleGestureEvent}>
        <View style={styles.imageWrapper}>
          <ImageBackground
            source={data[activeIndex].image}
            style={styles.image}
          >
            {/* Gradient Overlay */}
            <LinearGradient
              colors={["#1C1C1E50", "#1C1C1E90", "#723F0E95"]}
              style={styles.gradient}
            />

            {/* Text Content */}
            <View style={styles.textContainer}>
              <Text style={styles.title}>Cherish Your Wedding</Text>
              <Text style={styles.description}>
                Neque porro quisquam est qui dolorem ipsum quia dolor sit amet,
                consectetur, adipisci velit...
              </Text>
            </View>

            {/* Pagination Dots */}
            <View style={styles.pagination}>
              {data.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleDotPress(index)}
                >
                  <View
                    style={[
                      styles.dot,
                      activeIndex === index && [
                        styles.activeDot,
                        index === 1 && styles.wideDot, // Make the second dot wider when active
                      ],
                    ]}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Right Arrow Button */}
            <TouchableOpacity style={styles.rightArrow} onPress={goToNextSlide}>
              <AntDesign name="arrowright" size={30} color="#723F0E" />
            </TouchableOpacity>
          </ImageBackground>
        </View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  imageWrapper: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  textContainer: {
    position: "absolute",
    bottom: 70,
    left: 20,
    right: 80, // Pushes away from arrow button
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
  },
  description: {
    fontSize: 14,
    color: "#DDD",
    marginTop: 5,
  },
  leftTextContainer: {
    position: "absolute",
    top: 20,
    left: 20,
  },
  leftText: {
    fontSize: 16,
    color: "#FFF",
  },
  pagination: {
    flexDirection: "row",
    position: "absolute",
    bottom: 40,
    left: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFF", // Change the color of the dots to white
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#723F0E", // Active dot color
  },
  wideDot: {
    width: 16, // Make the second active dot wider
  },
  rightArrow: {
    position: "absolute",
    right: 20,
    bottom: 40,
    backgroundColor: "#FFF", // Arrow button background color
    padding: 15,
    borderRadius: 50,
  },
});

export default Welcome;
