import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Image,
  StyleSheet,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { theme } from "../constants/themes";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { hp, wp } from "../helpers/Common";
import { useNavigation } from "@react-navigation/native";

const Login = () => {
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigation = useNavigation();
  const [secureText, setSecureText] = useState(true);
  const scrollViewRef = useRef(null);

  const handleFocus = (event) => {
    // Scroll to the focused input
    scrollViewRef.current?.scrollTo({
      y: event.nativeEvent.target + 5,
      animated: true,
    });
  };
  const handlePhoneChange = (input) => {
    let cleaned = input.replace(/[^0-9]/g, "").slice(0, 10);
    setPhoneNumber(cleaned);
  };
  const handleForgotPassword = () => {
    if (phoneNumber.length !== 10) {
      Alert.alert("Error", "Please enter a valid 10-digit phone number.");
    } else {
      navigation.navigate("ForgotPassword", { phone: phoneNumber });
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? -2000 : 0}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAwareScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          extraScrollHeight={Platform.OS === "ios" ? 100 : 0}
          enableOnAndroid={true}
        >
          <View style={styles.bgimg}>
            <ImageBackground
              source={require("../../assets/images/AuthBack.jpg")}
              style={styles.background}
            />
          </View>
          {/* Curved Overlay */}
          <View style={styles.overlay}>
            <Text style={styles.title}>Login To Your Account</Text>

            {/* Input Fields */}
            <View style={styles.inputContainer}>
              <FontAwesome
                style={styles.inIcon}
                name="phone"
                size={25}
                color="#8B5A2B"
              />
              <TextInput
                style={styles.input}
                placeholder="Phone"
                keyboardType="numeric"
                placeholderTextColor={theme.colours.primary}
                value={phoneNumber}
                onChangeText={handlePhoneChange}
                maxLength={10}
              />
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
                placeholder="Password"
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

            {/* Social Login */}
            <View style={styles.bottomArea}>
              <Text style={styles.orText}>Or Continue With</Text>

              {/* <View style={styles.socialContainer}> */}
              <TouchableOpacity style={styles.socialButton}>
                <AntDesign name="google" size={20} color="#DB4437" />
                <Text style={styles.socialText}>Google</Text>
              </TouchableOpacity>
              {/* </View> */}

              {/* Forgot Password */}
              <TouchableOpacity onPress={handleForgotPassword}>
                <Text style={styles.forgotText}>Forgot Your Password?</Text>
              </TouchableOpacity>

              {/* Next Button */}
              <TouchableOpacity
                style={styles.nextButton}
                onPress={() => navigation.navigate("HomeScreen")}
              >
                <Text style={styles.nextText}>Next</Text>
              </TouchableOpacity>

              {/* Create Account */}
              <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                <Text style={styles.createText}>Create an account?</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "rgba(114, 63, 14, 0.4)",
  },
  inIcon: {
    padding: "2%",
  },
  eyeIcon: {
    padding: 10,
  },
  bgimg: {
    height: hp(70),
    backgroundColor: "rgba(114, 63, 14, 0.4)",
  },
  bottomArea: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: "1.57%",
  },
  background: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    top: 0,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    borderTopRightRadius: 100,
    paddingBottom: 45,
    padding: 20,
    // height: hp(55),
    alignItems: "center",
  },
  title: {
    fontSize: hp(2),
    fontWeight: theme.fonts.semibold,
    color: theme.colours.primary,

    marginBottom: 20,
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
    placeholderTextColor: "blue",
    color: "#5B3A29",
  },
  orText: {
    fontSize: hp(1.5),
    color: "gray",
    marginVertical: 10,
    fontWeight: theme.fonts.bold,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    alignItems: "center",
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingVertical: "3.5%",
    paddingHorizontal: 5,
    width: "100%",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    width: "95%",
    justifyContent: "center",
  },
  socialText: {
    marginLeft: 8,
    fontSize: hp(1.8),
    fontWeight: theme.fonts.medium,
    color: "#555",
  },
  forgotText: {
    color: "gray",
    marginVertical: 10,
    fontSize: hp(1.7),
    fontWeight: theme.fonts.bold,
  },
  nextButton: {
    backgroundColor: theme.colours.primary,
    paddingVertical: 10,
    paddingHorizontal: 35,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 5,
  },
  nextText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  createText: {
    color: "gray",
    marginTop: 10,
    fontSize: hp(1.7),
    fontWeight: theme.fonts.bold,
  },
});
