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
import React, { useEffect, useState } from "react";
import ScreenWrapper from "../Components/ScreenWrapper";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import BackButton from "../Components/BackButton";
import { theme } from "../constants/themes";
import { hp, wp } from "../helpers/Common";
import Modal from "react-native-modal"; //
import { ScrollView } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
import Avatar from "../Components/Avatar";
import useAuth from "../Context/UserContext";

const EditProfile = () => {
  const navigation = useNavigation();
  const { user, token, setUser } = useAuth();
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");
  const [phone, setPhone] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const handleReset = async () => {
    try {
      const res = await fetch(
        "https://api.shaadialbum.in/api/v1/app-user/update-profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ name: userName }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      Alert.alert("Success", "Profile updated");
      setUser(data.user);
      // Optionally navigate or update context
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (user) {
      setUserName(user.name);
      setPhone(user.phoneNo);
    }
  }, []);

  return (
    <ScreenWrapper bg="white">
      <View style={styles.header}>
        <BackButton navigation={navigation} />
        <Text style={styles.title}>Edit Your Profile</Text>
      </View>
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.profileSection}>
            <View>
              <Avatar name={user?.name} size={100} />
            </View>
            <Text style={styles.name}>{user?.name}</Text>
            <Text style={styles.email}>{user?.phoneNo}</Text>
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
              value={userName}
              placeholder="Enter your Name"
              placeholderTextColor={theme.colours.primary}
              onChangeText={setUserName}
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons
              name="phone"
              size={25}
              color={theme.colours.primary}
              style={styles.inIcon}
            />
            <TextInput
              style={[styles.input, { color: "#999" }]} // Optional: grey out the text
              value={phone}
              placeholder="Enter your Phone"
              placeholderTextColor={theme.colours.primary}
              textContentType="telephoneNumber"
              editable={false} // ✅ Make it read-only
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
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 10,
    alignItems: "center",
    // marginTop: hp(4),
    marginHorizontal: wp(4),
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
    // marginTop: hp(4),
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
