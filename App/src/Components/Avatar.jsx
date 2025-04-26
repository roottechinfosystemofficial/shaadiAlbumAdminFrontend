// Components/Avatar.js
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { theme } from "../constants/themes";

const Avatar = ({ name, image, size = 100 }) => {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "";

  return image ? (
    <Image
      source={{ uri: image }}
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    />
  ) : (
    <View
      style={[
        styles.avatarPlaceholder,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <Text style={styles.initials}>{initials}</Text>
    </View>
  );
};

export default Avatar;

const styles = StyleSheet.create({
  avatar: {
    borderWidth: 2,
    borderColor: theme.colours.primary,
  },
  avatarPlaceholder: {
    backgroundColor: theme.colours.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: theme.colours.primary,
  },
  initials: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
  },
});
