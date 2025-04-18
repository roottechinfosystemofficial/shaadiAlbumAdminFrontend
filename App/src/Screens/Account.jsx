import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import {
  MaterialIcons,
  Ionicons,
  FontAwesome,
  Feather,
  Entypo,
} from "@expo/vector-icons";
import { theme } from "../constants/themes";
import ScreenWrapper from "../Components/ScreenWrapper";

const Account = ({ navigation }) => {
  return (
    <ScreenWrapper bg="white">
      <ScrollView style={styles.container}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Image
            source={require("../../assets/fav/0X1A1764.jpg")}
            style={styles.avatar}
          />
          <Text style={styles.name}>Priyank</Text>
          <Text style={styles.email}>carlarosser23@gmail.com</Text>
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
          onPress={() => navigation.navigate("FAQs")}
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
          onPress={() => navigation.navigate("Feedback")}
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
          style={[styles.menuItem, { marginTop: 10 }]}
          onPress={() => console.log("Log out")}
        >
          <View style={[styles.iconWrapper, { backgroundColor: "#FF3B30" }]}>
            <MaterialIcons name="logout" size={20} color="#FFF" />
          </View>
          <Text style={[styles.menuText, { color: "#FF3B30" }]}>Log Out</Text>
        </TouchableOpacity>
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
    fontWeight: "bold",
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
});
