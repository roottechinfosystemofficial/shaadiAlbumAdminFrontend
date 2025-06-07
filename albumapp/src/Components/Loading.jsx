import React from "react";
import { View, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { hp, wp } from "../helpers/Common";

const Loading = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/Logo/logo4.gif")}
        style={styles.gif}
        contentFit="cover" // Covers the entire space
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: wp(100),
    backgroundColor: "#FBFBFB",
    height: hp(100),
  },
  gif: {
    width: wp(50),
    height: wp(40),
    backgroundColor: "transparent",
    overflow: "hidden",
  },
});

export default Loading;
