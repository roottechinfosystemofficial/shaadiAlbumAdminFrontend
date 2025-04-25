import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  Alert,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Pressable,
  FlatList,
  TouchableWithoutFeedback,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ScreenWrapper from "../Components/ScreenWrapper";

import Modal from "react-native-modal";
import { wp } from "../helpers/Common";
import { Camera } from "expo-camera";

import { theme } from "../constants/themes";
import { useNavigation, useRoute } from "@react-navigation/native";
import ArrowLeft from "../../assets/Icons/ArrowLeft";
import ScrollLoading from "../Components/Scrollloading";
import BackButton from "../Components/BackButton";

const screenWidth = Dimensions.get("window").width;
const imagePadding = 8;

const SeletEventImages = () => {
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
  const [selectedImages, setSelectedImages] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const modalFlatListRef = useRef(null);

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
        }, 100);
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

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const openImageModal = (img) => {
    setSelectedImage(img);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setModalVisible(false);
  };

  useEffect(() => {
    fetchEventImages(1);
  }, []);

  const fetchEventImages = async (pageToFetch) => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const response = await fetch(
        `http://192.168.1.66:5000/api/v1/list-app-images?eventId=${id}&page=${pageToFetch}`
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
        const processedImages = await Promise.all(
          newImages.map(async (url) => {
            const { width, height } = await getImageDimensions(url);
            Image.prefetch(url);

            return {
              id: url,
              uri: { uri: url },
              type: "square",
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

        setPage(pageToFetch);
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

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      const nextPage = page + 1;
      fetchEventImages(nextPage);
    }
  };

  return (
    <ScreenWrapper bg="#FBFBFB">
      <StatusBar backgroundColor="transparent" translucent />
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton navigation={navigation} />
          <Text style={styles.title}>Select</Text>

          <TouchableOpacity
            style={
              selectedImages.length == 0
                ? styles.gridButton
                : styles.gridButtonActive
            }
          >
            <Text
              style={
                selectedImages.length == 0
                  ? styles.Subbutton
                  : styles.ActiveSubbutton
              }
            >
              Submit
            </Text>
          </TouchableOpacity>
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
                  flex: 1 / gridCount,
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
                </View>
              </TouchableOpacity>
            );
          }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
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
                      <View style={styles.imageWrapper}>
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

export default SeletEventImages;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBFBFB",
  },
  Subbutton: { fontSize: 16, color: theme.colours.primary, fontWeight: "bold" },
  ActiveSubbutton: { fontSize: 16, color: "white", fontWeight: "bold" },
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
    // flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",

    alignItems: "flex-start",
    paddingHorizontal: wp(4),
    marginBottom: 16,
  },
  gridButton: {
    height: 40,
    // width: 40,
    position: "absolute",
    right: wp(4),
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    padding: 6,
    backgroundColor: "#eee",
    borderRadius: 8,
  },
  gridButtonActive: {
    height: 40,
    // width: 40,
    position: "absolute",
    right: wp(4),
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    padding: 6,
    backgroundColor: theme.colours.primary,
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
