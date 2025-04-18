// screens/AlbumScreen.js
import React from "react";
import { StyleSheet, View } from "react-native";
import ScreenWrapper from "../Components/ScreenWrapper";
import CardAlbum from "../Components/CardAlbum";
import { useNavigation } from "@react-navigation/native";

const AlbumScreen = () => {
  const navigation = useNavigation();

  return (
    <ScreenWrapper bg="white">
      <CardAlbum onPress={() => navigation.navigate("Flipbook")} />
    </ScreenWrapper>
  );
};

export default AlbumScreen;

const styles = StyleSheet.create({});
