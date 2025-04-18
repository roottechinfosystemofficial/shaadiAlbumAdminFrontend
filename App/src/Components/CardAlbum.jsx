// components/CardAlbum.js
import React from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const CardAlbum = ({ title, photos, videos, image, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <ImageBackground
        source={image}
        style={styles.image}
        imageStyle={{ borderRadius: 16 }}
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>
            {photos} Photos{"\n"}
            {videos} Videos
          </Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default CardAlbum;

const styles = StyleSheet.create({
  card: {
    margin: 16,
    height: 180,
    borderRadius: 16,
    overflow: "hidden",
  },
  image: {
    flex: 1,
    justifyContent: "flex-end",
  },
  overlay: {
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#eee",
    marginTop: 4,
  },
});
