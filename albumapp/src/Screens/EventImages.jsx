import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  Alert,
  View,
  ScrollView,
  Platform,
  Image,
  Dimensions,
  TouchableOpacity,
  Pressable,
  FlatList,
  TouchableWithoutFeedback,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import ScreenWrapper from "../Components/ScreenWrapper";
import * as FileSystem from "expo-file-system";

import Modal from "react-native-modal";
import * as MediaLibrary from "expo-media-library";
import { Asset } from "expo-asset";
import { hp, wp } from "../helpers/Common";
import { Camera } from "expo-camera";

import { theme } from "../constants/themes";
import { useNavigation, useRoute } from "@react-navigation/native";
import ArrowLeft from "../../assets/Icons/ArrowLeft";
import ScrollLoading from "../Components/Scrollloading";
import BackButton from "../Components/BackButton";

const screenWidth = Dimensions.get("window").width;
const imagePadding = 8;

const EventImages = () => {
  const route = useRoute();
  const { subId, id, subEventName } = route.params;
  const [images, setImages] = useState([]);
  const [favorites, setFavorites] = useState(images.map((img) => img.id));
  const [gridCount, setGridCount] = useState(2);
  const columnWidth =
    (screenWidth - imagePadding * (gridCount + 1)) / gridCount;
  const navigation = useNavigation();
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  // const [hasPermission, setHasPermission] = useState(null);
  // const [cameraRef, setCameraRef] = useState(null);

  // const [cameraVisible, setCameraVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const modalFlatListRef = useRef(null);

  const flatListRef = useRef(null);
  // useEffect(() => {
  //   (async () => {
  //     const { status } = await Camera.requestCameraPermissionsAsync();
  //     setHasPermission(status === "granted");
  //   })();
  // }, []);

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
        return { width: columnWidth, height: columnWidth * 1.5 }; // Vertical images
      case "horizontal":
        return { width: columnWidth, height: columnWidth * 0.6 }; // Horizontal images
      default:
        return { width: columnWidth, height: columnWidth }; // Square images
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

  const downloadImage = async (imageUrl) => {
    try {
      console.log(imageUrl);
      
      // Request permission first
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission denied",
          "Cannot save image without permission."
        );
        return;
      }
  
      // Generate local path to save
      const fileName = imageUrl.split("/").pop().split("?")[0]; // safer filename
      const fileUri = FileSystem.documentDirectory + fileName;
  
      // Download original image
      const downloadedFile = await FileSystem.downloadAsync(imageUrl, fileUri);
      console.log("Downloaded to:", downloadedFile.uri);
  
      // Save to gallery - this is the main fix
      const asset = await MediaLibrary.createAssetAsync(downloadedFile.uri);
      console.log("Asset created:", asset);
  
      // Try to add to album, but don't fail if album creation fails
      try {
        const album = await MediaLibrary.getAlbumAsync("Download");
        if (album) {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        } else {
          await MediaLibrary.createAlbumAsync("Download", asset, false);
        }
      } catch (albumError) {
        console.log("Album creation/addition failed, but image was saved:", albumError);
        // Image is still saved to gallery even if album fails
      }
  
      Alert.alert("Success", "Image saved to your gallery.");
    } catch (err) {
      console.log("Download failed:", err);
      
      // More specific error handling
      if (err.message && err.message.includes('MEDIA_LIBRARY')) {
        Alert.alert("Permission Error", "Media library permission is required to save images.");
      } else if (err.message && err.message.includes('Network')) {
        Alert.alert("Network Error", "Please check your internet connection.");
      } else {
        Alert.alert("Error", "Could not download image. Please try again.");
      }
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

  useEffect(() => {
    fetchEventImages(1);
  }, []);

  const fetchEventImages = async (pageToFetch) => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const response = await fetch(
        `https://api.shaadialbum.in/api/v1/list-app-images?eventId=${id}&page=${pageToFetch}&subEventId=${subId}`
      );

      const responseText = await response.text();
      let data;

      try {
        data = JSON.parse(responseText);
      } catch (error) {
        console.error("JSON Parse error:", error);
        Alert.alert("Error", "Failed to parse image data.");
        return;
      }

      const newImages = data.images || [];

      if (newImages.length === 0) {
        setHasMore(false);
      } else {
        console.log("thumb", newImages);
        const processedImages = await Promise.all(
          newImages.map(async (img) => {
            const { width, height } = await getImageDimensions(
              img.thumbnailUrl
            );
            Image.prefetch(img.thumbnailUrl);

            return {
              id: img.id,
              uri: { uri: img.thumbnailUrl }, // for <Image> component
              originalUrl: img.originalUrl,
              type: "square", // You can later derive from width/height
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

        setPage(pageToFetch); // Update state
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
        uri, // must be a string, not { uri: ... }
        (width, height) => resolve({ width, height }),
        (error) => reject(error)
      );
    });
  };

  const columns = Array.from({ length: gridCount }, () => []);
  images.forEach((img, index) => {
    columns[index % gridCount].push(img);
  });

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      const nextPage = page + 1;
      fetchEventImages(nextPage);
    }
  };

  return (
    <ScreenWrapper bg="#FBFBFB">
      <StatusBar
        barStyle={modalVisible ? "light-content" : "dark-content"} // icon/text color
        backgroundColor={
          Platform.OS === "android"
            ? modalVisible
              ? "#000"
              : "transparent"
            : "transparent"
        }
        translucent
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton navigation={navigation} />
          <Text style={styles.title}>{subEventName}</Text>

          {/*  */}
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
          data={images}
          keyExtractor={(item) => item.id}
          key={gridCount}
          numColumns={gridCount}
          renderItem={({ item }) => {
            const isFavorite = favorites.includes(item.id);
            const imgStyle = getImageStyle(item.type);

            return (
              <TouchableOpacity
                onPress={() => openImageModal(item)}
                activeOpacity={0.9}
                style={{
                  flex: 1 / gridCount, // Ensure each column takes equal space
                  padding: imagePadding / 2,
                }}
              >
                <View style={[styles.card, imgStyle]}>
                  <Image
                    source={item.uri}
                    style={[styles.image, imgStyle]}
                    resizeMode="cover"
                    onError={(error) =>
                      console.error("Image Load Error: ", error)
                    }
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
                    onPress={() => {
                      console.log("Original URL: ", item.originalUrl);
                      console.log("item URL: ", item.uri);

                      return downloadImage(item.originalUrl);
                    }}
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
          }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5} // Adjust this for when to load more
          ListFooterComponent={loading && <ScrollLoading />}
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
                getItemLayout={(data, index) => ({
                  length: Dimensions.get("window").width,
                  offset: Dimensions.get("window").width * index,
                  index,
                })}
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
                      <View
                        style={{
                          width: Dimensions.get("window").width,
                          height: Dimensions.get("window").height,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Image
                          source={item.uri} // Load full image here
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
    backgroundColor: "#FBFBFB",
  },
  title: {
    fontSize: 24,
    color: theme.colours.primary,
    fontFamily: "Poppins",
    fontWeight: "bold",
    paddingHorizontal: wp(4),
    textAlign:"center",
    marginBottom: 16,
  },
  scroll: {
    paddingHorizontal: imagePadding,
    paddingBottom: 100,
  },
  header: {
    // flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    // alignItems: "flex-start",
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
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },

  modalOverlay: {
    flex: 1,
    // margin: 2,
    backgroundColor: "rgba(0,0,0,0.9)",
    // justifyContent: "center",
    // alignItems: "center",
    // marginTop: Platform.OS === "ios" ? StatusBar.currentHeight || 44 : 0,
  },
  btnStyle: {
    alignSelf: "flex-start",
    padding: 7,
    position: "absolute",
    marginLeft: wp(4),
    top: 0,
    marginTop: Platform.OS === "ios" ? StatusBar.currentHeight || hp(7) : hp(3),
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
  // imageWrapper: {
  //   width: Dimensions.get("window").width,
  //   height: Dimensions.get("window").height,
  //   justifyContent: "center",
  //   alignItems: "center",
  // },
});
