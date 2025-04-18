import { Pressable, StyleSheet } from "react-native";
import React from "react";
import ArrowLeft from "../../assets/Icons/ArrowLeft";
import { theme } from "../constants/themes";

const BackButton = ({ size = 26, navigation }) => {
  return (
    <Pressable onPress={() => navigation.goBack()} style={styles.btnStyle}>
      <ArrowLeft strokeWidth={2.5} color={theme.colours.primary} size={size} />
    </Pressable>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  btnStyle: {
    alignSelf: "flex-start",
    padding: 7,
    borderWidth: 1,
    borderColor: theme.colours.primary,
    borderRadius: theme.radius.sm,
    // backgroundColor: "rgba(0,0,0,0.07)",
  },
});
