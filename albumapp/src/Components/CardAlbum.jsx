import React from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CardAlbum = ({ title, photos, videos, image, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <ImageBackground
        source={image}
        style={styles.image}
        imageStyle={styles.imageBorder}
      >
        <View style={styles.overlay}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>
              {photos} Photos{videos ? ` | ${videos} Videos` : ""}
            </Text>
          </View>
          <Ionicons
            name="chevron-forward-circle"
            size={24}
            color="#fff"
            style={styles.icon}
          />
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default CardAlbum;

const styles = StyleSheet.create({
  card: {
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: "hidden",
    marginTop: 12,
    marginHorizontal: 16,
  },
  image: {
    height: 160,
    width: "100%",
    justifyContent: "flex-end",
  },
  imageBorder: {
    // you can add border styling if needed
  },
  overlay: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  textContainer: {
    flexDirection: "column",
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  subtitle: {
    color: "#fff",
    fontSize: 12,
    marginTop: 5,
  },
  icon: {
    alignSelf: "flex-start",
  },
});
