import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import ScreenWrapper from "../Components/ScreenWrapper";
import BackButton from "../Components/BackButton";
import { useNavigation } from "@react-navigation/native";
import { hp, wp } from "../helpers/Common";
import { theme } from "../constants/themes";
import { FontAwesome } from "@expo/vector-icons";
import useAuth from "../Context/UserContext";

const ChangePassword = () => {
  const navigation = useNavigation();
  const { user, token } = useAuth();
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [secureText, setSecureText] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secureTextConfirm, setSecureTextConfirm] = useState(true);
  const [secureTextOld, setSecureTextOld] = useState(true);
  const [error, setError] = useState("");
  //   console.log(user.phoneNo);

  const handleReset = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        "https://api.shaadialbum.in/api/v1/app-user/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            phone: user.phoneNo,
            oldPassword,
            newPassword: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to change password");
      }

      navigation.navigate("ResetSuccess"); // or any confirmation screen
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <ScreenWrapper bg={"white"}>
      <View style={styles.container}>
        <BackButton navigation={navigation} />
        <View>
          <Text style={styles.title}>Change Your Password Here</Text>
          <View style={styles.subtitle}>
            <Text>
              Fill Old True Password, So we use that to Change your password
            </Text>
          </View>
        </View>
        <View style={styles.inputContainer}>
          <FontAwesome
            name="lock"
            size={25}
            color="#8B5A2B"
            style={styles.inIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Old Password"
            placeholderTextColor={theme.colours.primary}
            secureTextEntry={secureTextOld}
            textContentType="password" // Helps with autofill
            onChangeText={setOldPassword}
          />
          <TouchableOpacity onPress={() => setSecureTextOld(!secureTextOld)}>
            <FontAwesome
              name={secureText ? "eye-slash" : "eye"}
              size={20}
              color={theme.colours.primary}
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <FontAwesome
            name="lock"
            size={25}
            color="#8B5A2B"
            style={styles.inIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="New Password"
            placeholderTextColor={theme.colours.primary}
            secureTextEntry={secureText}
            textContentType="password" // Helps with autofill
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setSecureText(!secureText)}>
            <FontAwesome
              name={secureText ? "eye-slash" : "eye"}
              size={20}
              color={theme.colours.primary}
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <FontAwesome
            name="lock"
            size={25}
            color="#8B5A2B"
            style={styles.inIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor={theme.colours.primary}
            secureTextEntry={secureTextConfirm}
            textContentType="password"
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity
            onPress={() => setSecureTextConfirm(!secureTextConfirm)}
          >
            <FontAwesome
              name={secureTextConfirm ? "eye-slash" : "eye"}
              size={20}
              color={theme.colours.primary}
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Error Message */}
        {error ? <Text style={styles.errorText}>* {error}</Text> : null}
        {/* SMS Option */}
        <TouchableOpacity style={styles.nextButton} onPress={handleReset}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(4),
    flex: 1,
    // gap: hp(10),
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    marginTop: hp(4),
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 10,
    textAlign: "center",
  },
  input: {
    fontSize: 14,
    fontWeight: theme.fonts.semibold,
  },
  subtitle: {
    fontSize: 14,
    flexDirection: "column",

    color: "#666",
    marginTop: hp(3),
    marginBottom: 20,
  },

  nextButton: {
    marginTop: 20,
    position: "absolute",
    bottom: 20,
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
  inIcon: {
    padding: "2%",
  },
  eyeIcon: {
    padding: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: "#F8F8F8",
    paddingVertical: "1.8%",
    borderRadius: 13,
    borderWidth: 0.8,
    borderColor: "#ddd",
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",

    alignSelf: "center",
    width: "95%",
    marginBottom: "4%",
  },
  input: {
    flex: 1,
    marginLeft: "5%",
    fontSize: hp(1.8),
    placeholderTextColor: "blue",
    color: "#5B3A29",
  },
});
