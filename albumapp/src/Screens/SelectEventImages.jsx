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
  BackHandler,
  Keyboard,
  StatusBar,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ScreenWrapper from "../Components/ScreenWrapper";

import Modal from "react-native-modal";
import { hp, wp } from "../helpers/Common";
import { Camera } from "expo-camera";

import { theme } from "../constants/themes";
import { useNavigation, useRoute } from "@react-navigation/native";
import ArrowLeft from "../../assets/Icons/ArrowLeft";
import ScrollLoading from "../Components/Scrollloading";
import BackButton from "../Components/BackButton";
import AsyncStorage from "@react-native-async-storage/async-storage";

const screenWidth = Dimensions.get("window").width;
const imagePadding = 8;

const SeletEventImages = () => {
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
  const [hasSelectedImages, setHasSelectedImages] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const modalFlatListRef = useRef(null);

  console.log(selectedImage,images,"image============")
  const loadStoredSelections = async (newImages) => {
    try {
      const storedData = await AsyncStorage.getItem(`final_selection_${subId}`);
      if (storedData) {
        const parsed = JSON.parse(storedData);

        // Match image by `originalUrl`
        const selectedIds = newImages
          .filter((img) => parsed.some((sel) => sel.id === img.id))
          .map((img) => img.id);

        // Update selection state without duplicates
        setSelectedImages((prev) => {
          const merged = new Set([...prev, ...selectedIds]);
          return [...merged];
        });
      }
    } catch (err) {
      console.error("Failed to load stored selections:", err);
    }
  };

  useEffect(() => {
    const backAction = () => {
      if (modalVisible) {
        closeModal();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [modalVisible]);

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
  const toggleSelectedImage = async (id) => {
    let updatedSelectedImages;

    if (selectedImages.includes(id)) {
      updatedSelectedImages = selectedImages.filter((itemId) => itemId !== id);
    } else {
      updatedSelectedImages = [...selectedImages, id];
    }

    setSelectedImages(updatedSelectedImages);

    // Build updated image objects and store
    const updatedSelectedImageObjects = images
      .filter((img) => updatedSelectedImages.includes(img.id))
      .map((img) => ({
        id: img.id,
        originalUrl: img.originalUrl,
        thumbnailUrl: img.uri.uri,
      }));

    try {
      await AsyncStorage.setItem(
        `final_selection_${subId}`,
        JSON.stringify(updatedSelectedImageObjects)
      );
    } catch (err) {
      console.error("Failed to store updated selection in AsyncStorage:", err);
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
    console.log("Closing modal...");
    setSelectedImage(null);
    setModalVisible(false);
  };

  useEffect(() => {
    const init = async () => {
      await fetchClientSelectedImages();
    };
    init();
  }, []);

  const fetchEventImages = async (pageToFetch) => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const response = await fetch(
        `https://api.shaadialbum.in/api/v1/list-app-images?eventId=${id}&page=${pageToFetch}&subEventId=${subId}`
      );


      const responseText = await response.text();
      console.log(responseText)
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
        // console.log("thumb", newImages);
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
        await loadStoredSelections(processedImages);

        setPage(pageToFetch); // Update state
      }
    } catch (error) {
      console.error("Fetch error:", error);
      Alert.alert("Error", "Could not load event images.");
    } finally {
      setLoading(false);
    }
  };

  const fetchClientSelectedImages = async () => {
    try {
      const response = await fetch(
        "https://api.shaadialbum.in/api/v1/app-event/client-selected",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            eventId: id,
            subEventId: subId,
          }),
        }
      );

      const data = await response.json();
      console.log(data,"data")
      const newImages = data.images || [];
      if (response.ok && data.images.length > 0) {
        setHasSelectedImages(true);
        await AsyncStorage.removeItem(`final_selection_${subId}`);
        // console.log(data.images);
        const selectedIds = data.images.map((img) => img.id);

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
      } else {
        console.warn("Failed to fetch client-selected images");
        setHasSelectedImages(false);
        fetchEventImages(1);
      }
    } catch (error) {
      console.error("Error fetching client-selected images:", error);
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

  const handleFinalSubmit = async () => {
    if (selectedImages.length === 0) {
      Alert.alert(
        "No images selected",
        "Please select images before submitting."
      );
      return;
    }

    Alert.alert(
      "Confirm Submission",
      "Once you submit your selection, you cannot make changes. Do you want to proceed?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Submit",
          onPress: async () => {
            try {
              const selectedImageObjects = images
                .filter((img) => selectedImages.includes(img.id))
                .map((img) => ({
                  id: img.id,
                  originalUrl: img.originalUrl,
                  thumbnailUrl: img.uri.uri,
                }));
              console.log("Passing data", selectedImageObjects);
              // Save to AsyncStorage
              await AsyncStorage.setItem(
                `final_selection_${subId}`,
                JSON.stringify(selectedImageObjects)
              );

              // Send to backend
              const response = await fetch(
                "https://api.shaadialbum.in/api/v1/app-event/final-submit",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    subEventId: subId,
                    images: selectedImageObjects,
                  }),
                }
              );
              console.log("======================",JSON.stringify(response),JSON.stringify({
                    subEventId: subId,
                    images: selectedImageObjects,
                  }),"imageSend")

              const data = await response.json();
              if (response.ok) {
                Alert.alert("Success", "Images submitted successfully.");
                navigation.goBack();
              } else {
                Alert.alert("Error", data.message || "Submission failed.");
              }
            } catch (err) {
              console.error(err);
              Alert.alert("Error", "An error occurred during submission.");
            }
          },
        },
      ]
    );
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      const nextPage = page + 1;
      fetchEventImages(nextPage);
    }
  };
  const handleNextImage = () => {
    if (!selectedImage) return;
    const currentIndex = images.findIndex((img) => img.id === selectedImage.id);
    if (currentIndex < images.length - 1) {
      setSelectedImage(images[currentIndex + 1]);
    }
  };

  const handlePrevImage = () => {
    if (!selectedImage) return;
    const currentIndex = images.findIndex((img) => img.id === selectedImage.id);
    if (currentIndex > 0) {
      setSelectedImage(images[currentIndex - 1]);
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
          {hasSelectedImages ? (
            <Text style={styles.title}>Allready Selected</Text>
          ) : (
            <>
              <Text style={styles.title}>
                {selectedImages?.length === 0
                  ? "Select"
                  : `${selectedImages?.length} Selected`}
              </Text>

              <TouchableOpacity
                style={
                  selectedImages.length == 0
                    ? styles.gridButton
                    : styles.gridButtonActive
                }
                onPress={handleFinalSubmit}
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
            </>
          )}
        </View>
        <FlatList
          data={images}
          keyExtractor={(item) => item.id}
          key={gridCount}
          numColumns={gridCount}
          renderItem={({ item }) => {
            const isSelected = selectedImages.includes(item.id);
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
                  />
                  {selectedImages.includes(item.id) && (
                    <View style={styles.checkOverlay}>
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color="green"
                      />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loading && <ScrollLoading />}
        />
        {hasSelectedImages ? null : (
          <Modal
            isVisible={modalVisible}
            onBackdropPress={closeModal}
            style={{ margin: 0 }}
            animationIn="fadeIn"
            animationOut="fadeOut"
          >
            <View style={styles.modalOverlay}>
              <Pressable onPress={closeModal} style={styles.fullscreenImage}>
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
                  renderItem={({ item }) => (
                    <View style={styles.imageWrapper}>
                      {/* Background touch area */}
                      <TouchableWithoutFeedback onPress={closeModal}>
                        <View style={styles.fullscreenBackground} />
                      </TouchableWithoutFeedback>

                      {/* Image */}
                      <Image
                        source={item.uri}
                        style={styles.fullscreenImage}
                        resizeMode="contain"
                      />
                      <View style={styles.navigationButtons}>
                        <TouchableOpacity
                          onPress={handlePrevImage}
                          style={styles.navButton}
                        >
                          <Ionicons
                            name="chevron-back"
                            size={30}
                            color="white"
                          />
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={handleNextImage}
                          style={styles.navButton}
                        >
                          <Ionicons
                            name="chevron-forward"
                            size={30}
                            color="white"
                          />
                        </TouchableOpacity>
                      </View>
                      {/* Select button */}
                      <Pressable
                        onPress={() => toggleSelectedImage(item.id)}
                        style={styles.checkButton}
                      >
                        <Ionicons
                          name={
                            selectedImages.includes(item.id)
                              ? "checkmark-circle"
                              : "ellipse-outline"
                          }
                          size={30}
                          color={
                            selectedImages.includes(item.id) ? "green" : "white"
                          }
                        />
                      </Pressable>
                    </View>
                  )}
                  getItemLayout={(data, index) => ({
                    length: screenWidth, // Adjust to your item height (or width for horizontal scroll)
                    offset: screenWidth * index, // Calculate offset for each item
                    index,
                  })}
                  onScrollToIndexFailed={(error) => {
                    const offset =
                      error.index > 0 ? error.index * screenWidth : 0;
                    modalFlatListRef.current?.scrollToOffset({ offset });
                  }}
                />
              </Pressable>
              {/* Back button */}
              <Pressable onPress={closeModal} style={styles.btnStyle}>
                <ArrowLeft strokeWidth={3} color="white" />
              </Pressable>
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
  checkOverlay: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 20,
  },

  checkbox: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 5,
  },
  modalContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  navigationButtons: {
    position: "absolute",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    top: "50%",
    paddingHorizontal: 20,
  },
  navButton: {
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 30,
    padding: 4,
  },

  title: {
    fontSize: 24,
    color: theme.colours.primary,
    fontFamily: "Poppins",
    fontWeight: "bold",
    paddingHorizontal: wp(4),
    marginBottom: 16,
  },
  fullscreenBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.7)",
  },

  checkButton: {
    position: "absolute",
    top: 30,
    right: 30,
    marginTop: Platform.OS === "ios" ? StatusBar.currentHeight || hp(5) : hp(3),
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
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    width: "100%",
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
    marginTop: Platform.OS === "ios" ? StatusBar.currentHeight || hp(8) : hp(3),
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "black",
  },
});
