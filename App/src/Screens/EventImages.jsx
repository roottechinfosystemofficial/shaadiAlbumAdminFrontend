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
import { useNavigation, useRoute } from "@react-navigation/native";
import ArrowLeft from "../../assets/Icons/ArrowLeft";

const screenWidth = Dimensions.get("window").width;
const imagePadding = 8;

const EventImages = () => {
  const route = useRoute();
  const { id } = route.params;
  const [images, setImages] = useState([]);
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
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const modalFlatListRef = useRef(null);

  const flatListRef = useRef(null);
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  useEffect(() => {
    if (modalVisible && selectedImage && modalFlatListRef.current) {
      const index = images.findIndex((img) => img.id === selectedImage.id);
      if (index !== -1) {
        setTimeout(() => {
          try {
            modalFlatListRef.current?.scrollToIndex({
              index,
              animated: false,
            });
          } catch (e) {
            console.log("scrollToIndex error:", e);
          }
        }, 100); // allow layout to settle
      }
    }
  }, [modalVisible, selectedImage, images]);

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
  const handleSelfieCapture = () => {
    navigation.navigate("FaceIDVerification");
  };

  //   useEffect(() => {
  //     if (modalVisible && selectedImage) {
  //       const index = images.findIndex((img) => img.id === selectedImage.id);
  //       setTimeout(() => {
  //         flatListRef.current?.scrollToIndex({ index, animated: false });
  //       }, 100);
  //     }
  //   }, [modalVisible, selectedImage]);

  useEffect(() => {
    fetchEventImages();
  }, []);

  const fetchEventImages = async (pageNum = 1) => {
    if (loading) return; // Prevent multiple calls

    setLoading(true);

    try {
      const response = await fetch(
        `http://192.168.1.66:5000/api/v1/list-app-images?eventId=${id}&page=${pageNum}`
      );

      const responseText = await response.text(); // Get the response as text

      // Check if the response is valid JSON
      let data;
      try {
        data = JSON.parse(responseText); // Try parsing the response text
      } catch (error) {
        console.error("JSON Parse error:", error);
        Alert.alert("Error", "Failed to parse image data.");
        return;
      }

      // Check if the response contains valid image data
      if (!data.images) {
        Alert.alert("Error", "Error fetching images.");
        return;
      }

      const newImages = data.images || [];
      if (newImages.length === 0) {
        setHasMore(false); // No more images to load
      } else {
        const processedImages = await Promise.all(
          newImages.map(async (url, index) => {
            // Get image dimensions to determine type
            const { width, height } = await getImageDimensions(url);

            // Prefetch image for faster display
            Image.prefetch(url); // Prefetch image URL here

            // Determine image type based on its aspect ratio
            let type = "square"; // Default to square
            if (width > height) {
              type = "horizontal";
            } else if (width < height) {
              type = "vertical";
            }

            return {
              id: url,
              uri: { uri: url }, // Ensure this is the correct format
              type: type,
            };
          })
        );

        setImages((prev) => {
          const existingIds = new Set(prev.map((img) => img.id));
          const newUniqueImages = processedImages.filter(
            (img) => !existingIds.has(img.id)
          );
          return [...prev, ...newUniqueImages];
        });

        setPage(pageNum); // Update the page
      }
    } catch (error) {
      console.error("Fetch error:", error);
      Alert.alert("Error", "Could not load event images.");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get image dimensions
  const getImageDimensions = (uri) => {
    return new Promise((resolve, reject) => {
      Image.getSize(
        uri,
        (width, height) => resolve({ width, height }),
        (error) => reject(error)
      );
    });
  };

  const columns = Array.from({ length: gridCount }, () => []);
  images.forEach((img, index) => {
    columns[index % gridCount].push(img);
  });

  const renderColumn = (column) =>
    column.map((item, idx) => {
      const isFavorite = favorites.includes(item.id);
      const imgStyle = getImageStyle(item.type);
      const uniqueKey = `${item.id}-${idx}`;
      return (
        <TouchableOpacity
          key={uniqueKey}
          onPress={() => openImageModal(item)}
          activeOpacity={0.9}
        >
          <View style={[styles.card, imgStyle]}>
            {/* Log image source for debugging */}
            <Image
              source={item.uri} // Ensure the URI is valid
              style={[styles.image, imgStyle]}
              resizeMode="cover"
              onError={(error) => console.error("Image Load Error: ", error)} // Handle image load errors
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
            {/* <TouchableOpacity
              style={styles.gridButton}
              onPress={handleSelfieCapture}
            >
              <MaterialIcons
                name="face-retouching-natural"
                size={28}
                color={theme.colours.primary}
              />
            </TouchableOpacity> */}

            <TouchableOpacity style={styles.gridButton} onPress={toggleGrid}>
              <Ionicons
                name={gridCount === 3 ? "grid-outline" : "grid"}
                size={22}
                color={theme.colours.primary}
              />
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          ref={flatListRef}
          data={images}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={() => null} // We use ListHeaderComponent for layout
          onEndReached={() => {
            if (hasMore) fetchEventImages(page + 1);
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loading && <Text>Loading...</Text>}
          ListHeaderComponent={
            <ScrollView contentContainerStyle={{ flexDirection: "row" }}>
              {columns.map((col, index) => (
                <View
                  key={index}
                  style={{ flex: 1 / gridCount, paddingHorizontal: 4 }}
                >
                  {renderColumn(col)}
                </View>
              ))}
            </ScrollView>
          }
        />

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
                ref={modalFlatListRef}
                horizontal
                pagingEnabled
                windowSize={3}
                initialNumToRender={1}
                maxToRenderPerBatch={2}
                removeClippedSubviews={true}
                showsHorizontalScrollIndicator={false}
                data={images}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  return (
                    <TouchableWithoutFeedback onPress={closeModal}>
                      <View style={styles.imageWrapper}>
                        <Image
                          source={item.fullUri} // Load full image here
                          style={styles.fullscreenImage}
                          resizeMode="contain"
                        />
                      </View>
                    </TouchableWithoutFeedback>
                  );
                }}
              />
            </View>
          </Modal>
        )}
      </View>
    </ScreenWrapper>
  );
};

export default EventImages;

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
    // flex: 1,
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
