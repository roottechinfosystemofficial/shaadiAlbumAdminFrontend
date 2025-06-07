import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  MaterialIcons,
  Ionicons,
  FontAwesome,
  Feather,
  Entypo,
} from "@expo/vector-icons";
import { theme } from "../constants/themes";
import ScreenWrapper from "../Components/ScreenWrapper";
import useAuth from "../Context/UserContext";
import Avatar from "../Components/Avatar";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Account = ({ navigation }) => {
  const { removeTokenLogout, user } = useAuth();
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);


  const handleDeactivateAccount = async () => {
    try {

      const token = await AsyncStorage.getItem('token');


      const response = await fetch(
        "https://api.shaadialbum.in/api/v1/app-user/deactivate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      const data = await response.json();
      console.log(JSON.stringify(data), "this data")
      if (data?.message === "User account deactivated successfully") {
        Alert.alert("Account Deactivated", "Your account has been deactivated successfully.");
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
      } else {
        Alert.alert("Error", data.message || "Failed to deactivate account");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while deactivating your account");
      console.error("Deactivation error:", error);
    } finally {
      setShowDeactivateModal(false);
    }
  };

  return (
    <ScreenWrapper bg="white">
      <ScrollView style={styles.container}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Avatar name={user?.name} size={100} />
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.email}>+91 {user?.phoneNo}</Text>
        </View>

        {/* Menu Options */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("EditProfile")}
        >
          <View style={styles.iconWrapper}>
            <MaterialIcons name="person" size={20} color="#FFF" />
          </View>
          <Text style={styles.menuText}>Edit Profile</Text>
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("ChangePassword")}
        >
          <View style={styles.iconWrapper}>
            <Ionicons name="lock-closed" size={20} color="#FFF" />
          </View>
          <Text style={styles.menuText}>Change Password</Text>
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("Faq")}
        >
          <View style={styles.iconWrapper}>
            <FontAwesome name="question-circle" size={20} color="#FFF" />
          </View>
          <Text style={styles.menuText}>FAQs</Text>
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("Policy")}
        >
          <View style={styles.iconWrapper}>
            <Feather name="file-text" size={20} color="#FFF" />
          </View>
          <Text style={styles.menuText}>Policy</Text>
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("FeedBack")}
        >
          <View style={styles.iconWrapper}>
            <MaterialIcons name="messenger" size={20} color="#FFF" />
          </View>
          <Text style={styles.menuText}>Share Feedback</Text>
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("ContactUs")}
        >
          <View style={styles.iconWrapper}>
            <MaterialIcons name="phone" size={20} color="#FFF" />
          </View>
          <Text style={styles.menuText}>Contact Us</Text>
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => setShowDeactivateModal(true)}
        >
          <View style={[styles.iconWrapper, { backgroundColor: "#FF3B30" }]}>
            <MaterialIcons name="remove-circle" size={20} color="#FFF" />
          </View>
          <Text style={[styles.menuText, { color: "#FF3B30" }]}>
            Deactivate Account
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, { marginTop: 10 }]}
          onPress={() => {
            removeTokenLogout(navigation);
          }}
        >
          <View style={[styles.iconWrapper, { backgroundColor: "#FF3B30" }]}>
            <MaterialIcons name="logout" size={20} color="#FFF" />
          </View>
          <Text style={[styles.menuText, { color: "#FF3B30" }]}>Log Out</Text>
        </TouchableOpacity>
        <Modal
          visible={showDeactivateModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowDeactivateModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Deactivate Account?</Text>
              <Text style={styles.modalMessage}>
                Are you sure you want to deactivate your account? This action cannot be undone.
              </Text>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowDeactivateModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.deactivateButton]}
                  onPress={handleDeactivateAccount}
                >
                  <Text style={styles.deactivateButtonText}>Deactivate</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default Account;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: theme.colours.primary,
  },
  name: {
    fontSize: 18,
    // fontWeight: "bold",
    color: theme.colours.primary,
    marginTop: 10,
  },
  email: {
    fontSize: 14,
    color: "gray",
    marginTop: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  iconWrapper: {
    width: 30,
    height: 30,
    backgroundColor: theme.colours.primary,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  menuText: {
    fontSize: 16,
    marginLeft: 15,
    color: "#333",
    flex: 1,
  },



  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    width: "85%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 15,
    color: "#666",
    marginBottom: 24,
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 12,
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
  },
  cancelButtonText: {
    color: "#333",
    fontWeight: "500",
  },
  deactivateButton: {
    backgroundColor: "#FF3B30",
  },
  deactivateButtonText: {
    color: "white",
    fontWeight: "500",
  },
});
