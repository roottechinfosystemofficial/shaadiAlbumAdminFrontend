import React from "react";
import { View, FlatList, Image, StyleSheet, Dimensions } from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";

const { width, height } = Dimensions.get("window");

export default function FLipbookScreen() {
  React.useEffect(() => {
    // Lock to landscape
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
  }, []);

  const pages = [
    require("../../assets/flipbook/page1.jpg"),
    require("../../assets/flipbook/page2.jpg"),
    require("../../assets/flipbook/page3.jpg"),
  ];

  return (
    <FlatList
      data={pages}
      keyExtractor={(_, index) => index.toString()}
      horizontal
      pagingEnabled
      renderItem={({ item }) => (
        <View style={styles.page}>
          <Image source={item} style={styles.image} resizeMode="contain" />
          <View style={styles.crease} />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  page: {
    width,
    height,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  image: {
    width: width,
    height: height,
  },
  crease: {
    position: "absolute",
    left: width / 2 - 1,
    width: 1,
    height: "100%",
    backgroundColor: "#666",
  },
});
