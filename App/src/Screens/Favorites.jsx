import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  Alert,
  View,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  Pressable,
  FlatList,
  TouchableWithoutFeedback,
  StatusBar,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import ScreenWrapper from "../Components/ScreenWrapper";

import Modal from "react-native-modal";
import * as MediaLibrary from "expo-media-library";
import { Asset } from "expo-asset";
import { wp } from "../helpers/Common";
import { Camera } from "expo-camera";

import { theme } from "../constants/themes";
import { useNavigation } from "@react-navigation/native";
import ArrowLeft from "../../assets/Icons/ArrowLeft";

const screenWidth = Dimensions.get("window").width;
const imagePadding = 8;

const images = [
  { id: "1", uri: require("../../assets/fav/0X1A0657.jpg"), type: "vertical" },
  { id: "2", uri: require("../../assets/fav/0X1A0663.jpg"), type: "square" },
  {
    id: "3",
    uri: require("../../assets/fav/0X1A0695.jpg"),
    type: "horizontal",
  },
  { id: "4", uri: require("../../assets/fav/0X1A0936.jpg"), type: "square" },
  { id: "5", uri: require("../../assets/fav/0X1A1135.jpg"), type: "vertical" },
  {
    id: "6",
    uri: require("../../assets/fav/0X1A1200.jpg"),
    type: "horizontal",
  },
  {
    id: "7",
    uri: require("../../assets/fav/0X1A1200.jpg"),
    type: "horizontal",
  },
  {
    id: "8",
    uri: require("../../assets/fav/0X1A1764.jpg"),
    type: "horizontal",
  },
  {
    id: "9",
    uri: require("../../assets/fav/0X1A2034.jpg"),
    type: "horizontal",
  },
  {
    id: "10",
    uri: require("../../assets/fav/0X1A2139.jpg"),
    type: "horizontal",
  },
];

const Favorites = () => {
  const [favorites, setFavorites] = useState(images.map((img) => img.id));
  const [gridCount, setGridCount] = useState(2);
  const columnWidth =
    (screenWidth - imagePadding * (gridCount + 1)) / gridCount;
  const navigation = useNavigation();
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [cameraVisible, setCameraVisible] = useState(false);

  const flatListRef = useRef(null);
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const getImageStyle = (type) => {
    switch (type) {
      case "vertical":
        return { width: columnWidth, height: columnWidth * 1.5 };
      case "horizontal":
        return { width: columnWidth, height: columnWidth * 0.7 };
      default:
        return { width: columnWidth, height: columnWidth };
    }
  };

  const toggleGrid = () => {
    setGridCount((prev) => (prev === 3 ? 2 : 3));
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const downloadImage = async (image) => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission denied",
          "Cannot save image without permission."
        );
        return;
      }

      const asset = Asset.fromModule(image);
      await asset.downloadAsync();
      const savedAsset = await MediaLibrary.createAssetAsync(asset.localUri);
      await MediaLibrary.createAlbumAsync("Download", savedAsset, false);

      Alert.alert("Downloaded", "Image saved to your gallery.");
    } catch (err) {
      console.log("Download failed:", err);
      Alert.alert("Error", "Could not download image.");
    }
  };

  const openImageModal = (img) => {
    setSelectedImage(img);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setModalVisible(false);
  };
  const handleSelfieCapture = async () => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) {
      return Alert.alert("Permission denied", "Camera permission is required.");
    }

    const result = await ImagePicker.launchCameraAsync({
      // allowsEditing: true,
      aspect: [1, 1], // square selfie
      quality: 0.7,
      cameraType: ImagePicker.CameraType.front, // selfie camera
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      console.log("Captured selfie:", imageUri);

      // TODO: you can upload this image or store it in state
      // setSelfieImage(imageUri);
    }
  };

  useEffect(() => {
    if (modalVisible && selectedImage) {
      const index = images.findIndex((img) => img.id === selectedImage.id);
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({ index, animated: false });
      }, 100);
    }
  }, [modalVisible, selectedImage]);

  const columns = Array.from({ length: gridCount }, () => []);
  images.forEach((img, index) => {
    columns[index % gridCount].push(img);
  });

  const renderColumn = (column) =>
    column.map((item) => {
      const isFavorite = favorites.includes(item.id);
      const imgStyle = getImageStyle(item.type);
      return (
        <TouchableOpacity
          key={item.id}
          onPress={() => openImageModal(item)}
          activeOpacity={0.9}
        >
          <View style={[styles.card, imgStyle]}>
            <Image
              source={item.uri}
              style={[styles.image, imgStyle]}
              resizeMode="cover"
            />

            <TouchableOpacity
              style={styles.heartIcon}
              onPress={() => toggleFavorite(item.id)}
            >
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={20}
                color={theme.colours.primary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.downloadIcon}
              onPress={() => downloadImage(item.uri)}
            >
              <Ionicons
                name="download-outline"
                size={20}
                color={theme.colours.primary}
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      );
    });

  return (
    <ScreenWrapper bg="#fff">
      <StatusBar backgroundColor="transparent" translucent />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Favorite List</Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity
              style={styles.gridButton}
              onPress={handleSelfieCapture}
            >
              <MaterialIcons
                name="face-retouching-natural"
                size={28}
                color={theme.colours.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.gridButton} onPress={toggleGrid}>
              <Ionicons
                name={gridCount === 3 ? "grid-outline" : "grid"}
                size={22}
                color={theme.colours.primary}
              />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            {columns.map((col, index) => (
              <View key={index} style={{ width: columnWidth }}>
                {renderColumn(col)}
              </View>
            ))}
          </View>
        </ScrollView>
        {modalVisible && (
          <Modal
            isVisible={modalVisible}
            onBackdropPress={closeModal}
            style={{ margin: 0 }}
            animationIn="fadeIn"
            animationOut="fadeOut"
          >
            <View style={styles.modalOverlay}>
              <Pressable onPress={closeModal} style={styles.btnStyle}>
                <ArrowLeft strokeWidth={3} color="white" />
              </Pressable>

              <FlatList
                ref={flatListRef}
                horizontal
                pagingEnabled
                windowSize={3}
                initialNumToRender={1}
                maxToRenderPerBatch={2}
                removeClippedSubviews={true}
                showsHorizontalScrollIndicator={false}
                data={images}
                keyExtractor={(item) => item.id}
                initialScrollIndex={images.findIndex(
                  (img) => img.id === selectedImage?.id
                )}
                getItemLayout={(data, index) => ({
                  length: screenWidth,
                  offset: screenWidth * index,
                  index,
                })}
                renderItem={({ item }) => (
                  <TouchableWithoutFeedback onPress={closeModal}>
                    <View style={styles.imageWrapper}>
                      <Image
                        source={item.uri}
                        style={styles.fullscreenImage}
                        resizeMode="contain"
                      />
                    </View>
                  </TouchableWithoutFeedback>
                )}
              />
            </View>
          </Modal>
        )}
      </View>
    </ScreenWrapper>
  );
};

export default Favorites;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    color: theme.colours.primary,
    fontFamily: "Poppins",
    fontWeight: "bold",
    paddingHorizontal: wp(4),
    marginBottom: 16,
  },
  scroll: {
    paddingHorizontal: imagePadding,
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    // alignItems: "center",
    paddingHorizontal: wp(4),
    marginBottom: 16,
  },
  gridButton: {
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    padding: 6,
    backgroundColor: "#eee",
    borderRadius: 8,
  },
  card: {
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginBottom: imagePadding,
    overflow: "hidden",
    position: "relative",
  },
  image: {},
  heartIcon: {
    position: "absolute",
    top: 7,
    right: 7,
    backgroundColor: "#fff",
    padding: 2,
    borderRadius: 20,
    elevation: 5,
  },
  downloadIcon: {
    position: "absolute",
    bottom: 7,
    right: 7,
    backgroundColor: "#fff",
    padding: 2,
    borderRadius: 20,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  btnStyle: {
    alignSelf: "flex-start",
    padding: 7,
    position: "absolute",
    marginLeft: wp(4),
    top: 0,
    marginTop: wp(4),
    borderWidth: 3,
    borderColor: theme.colours.primary,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colours.primary,
  },
  fullscreenImage: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  imageCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageWrapper: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    justifyContent: "center",
    alignItems: "center",
  },
});
