import {
  StyleSheet,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Platform,
  ActionSheetIOS,
  View,
  Alert,
} from "react-native";
import React, { useState } from "react";
import ScreenWrapper from "../Components/ScreenWrapper";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import BackButton from "../Components/BackButton";
import { theme } from "../constants/themes";
import { hp, wp } from "../helpers/Common";
import Modal from "react-native-modal"; //
import { ScrollView } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";

const EditProfile = () => {
  const navigation = useNavigation();
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const handlePickFromCamera = async () => {
    toggleModal();
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted)
      return Alert.alert("Permission denied", "Camera permission required.");
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) setProfileImage(result.assets[0].uri);
  };

  const handlePickFromGallery = async () => {
    toggleModal();
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted)
      return Alert.alert("Permission denied", "Gallery permission required.");
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) setProfileImage(result.assets[0].uri);
  };
  const onPickImage = async () => {
    const requestPermissions = async () => {
      const cameraPerm = await ImagePicker.requestCameraPermissionsAsync();
      const mediaPerm = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!cameraPerm.granted || !mediaPerm.granted) {
        Alert.alert(
          "Permissions Required",
          "We need both camera and gallery permissions to continue."
        );
        return false;
      }
      return true;
    };

    const launchCamera = async () => {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
      }
    };

    const launchGallery = async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
      }
    };

    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancel", "Take Photo", "Choose from Library"],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            launchCamera();
          } else if (buttonIndex === 2) {
            launchGallery();
          }
        }
      );
    } else {
      Alert.alert("Select Image", "Choose an option", [
        { text: "Camera", onPress: launchCamera },
        { text: "Gallery", onPress: launchGallery },
        { text: "Cancel", style: "cancel" },
      ]);
    }
  };

  const handleReset = () => {
    // Submit logic here
  };

  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        <BackButton navigation={navigation} />
        <Text style={styles.title}>Edit Your Profile</Text>
        <ScrollView>
          <View style={styles.profileSection}>
            <View>
              <Modal
                isVisible={isModalVisible}
                onBackdropPress={toggleModal}
                animationIn="slideInUp"
                animationOut="slideOutDown"
                style={{ justifyContent: "flex-end", margin: 0 }}
              >
                <View style={styles.modalContainer}>
                  <TouchableOpacity
                    style={styles.modalOption}
                    onPress={handlePickFromCamera}
                  >
                    <Text style={styles.modalText}>📷 Take Photo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalOption}
                    onPress={handlePickFromGallery}
                  >
                    <Text style={styles.modalText}>🖼️ Choose from Gallery</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalOption, { borderTopWidth: 0.5 }]}
                    onPress={toggleModal}
                  >
                    <Text style={[styles.modalText, { color: "red" }]}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              </Modal>

              <Image
                source={
                  profileImage
                    ? { uri: profileImage }
                    : require("../../assets/fav/0X1A1764.jpg")
                }
                style={styles.avatar}
              />

              <TouchableOpacity style={styles.pencilIcon} onPress={toggleModal}>
                <FontAwesome name="pencil" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={styles.name}>Carla Rosser</Text>
            <Text style={styles.email}>carlarosser23@gmail.com</Text>
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons
              name="person"
              size={25}
              color={theme.colours.primary}
              style={styles.inIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter your Name"
              placeholderTextColor={theme.colours.primary}
              onChangeText={setUserName}
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons
              name="email"
              size={25}
              color={theme.colours.primary}
              style={styles.inIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter your Email"
              placeholderTextColor={theme.colours.primary}
              textContentType="emailAddress"
              onChangeText={setEmail}
            />
          </View>

          {error ? <Text style={styles.errorText}>* {error}</Text> : null}

          <TouchableOpacity style={styles.nextButton} onPress={handleReset}>
            <Text style={styles.nextButtonText}>Update</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(4),
    flex: 1,
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalOption: {
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderColor: "#ccc",
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    color: theme.colours.primary,
    fontWeight: "600",
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: theme.colours.primary,
    fontFamily: "Poppins",
    marginTop: hp(4),
    textAlign: "center",
  },
  profileSection: {
    alignItems: "center",
    marginVertical: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: theme.colours.primary,
  },
  editIcon: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: theme.colours.primary,
    borderRadius: 15,
    padding: 6,
    borderWidth: 2,
    borderColor: "#fff",
    elevation: 5,
  },
  profileImageWrapper: {
    position: "relative",
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },

  pencilIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: theme.colours.primary,
    padding: 6,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#fff",
    zIndex: 10,
  },

  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  email: {
    fontSize: 14,
    color: "gray",
    marginTop: 4,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 10,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: "1.8%",
    borderRadius: 13,
    borderWidth: 0.8,
    borderColor: "#ddd",
    paddingHorizontal: 10,
    alignSelf: "center",
    width: "95%",
    marginBottom: "4%",
  },
  inIcon: {
    padding: "2%",
  },
  input: {
    flex: 1,
    marginLeft: "5%",
    fontSize: hp(1.8),
    color: "#5B3A29",
  },
  nextButton: {
    marginTop: 20,
    width: "100%",
    alignSelf: "center",
    backgroundColor: theme.colours.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
