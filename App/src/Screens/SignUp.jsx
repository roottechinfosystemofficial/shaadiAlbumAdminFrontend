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
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { theme } from "../constants/themes";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { hp, wp } from "../helpers/Common";
import { useNavigation } from "@react-navigation/native";

const SignUp = () => {
  const [password, setPassword] = useState("");
  const [secureText, setSecureText] = useState(true);
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const toggleCheckbox = () => {
    setKeepSignedIn(!keepSignedIn);
  };
  const handleFocus = (event) => {
    // Scroll to the focused input
    scrollViewRef.current?.scrollTo({
      y: event.nativeEvent.target + 50,
      animated: true,
    });
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
          extraScrollHeight={Platform.OS === "ios" ? 100 : 0} // Push content up
          enableOnAndroid={true}
        >
          <View style={styles.bgimg}>
            <ImageBackground
              source={require("../../assets/images/signupback.png")}
              style={styles.background}
            />
          </View>
          {/* Curved Overlay */}
          <View style={styles.overlay}>
            <Text style={styles.title}>SignUp For Free</Text>

            {/* Input Fields */}
            <View style={styles.inputContainer}>
              <FontAwesome
                style={styles.inIcon}
                name="user"
                size={25}
                color="#8B5A2B"
              />
              <TextInput
                style={styles.input}
                placeholder="Your Name"
                onFocus={handleFocus}
                placeholderTextColor={theme.colours.primary}
              />
            </View>
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
                keyboardType="phone-pad"
                onFocus={handleFocus}
                placeholderTextColor={theme.colours.primary}
                autoComplete="tel"
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
                autoComplete="password" // Enables Google password suggestion
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

            {/* Social SignUp */}
            <View style={styles.bottomArea}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={toggleCheckbox}
              >
                <View
                  style={[
                    styles.checkbox,
                    keepSignedIn && styles.checkboxChecked,
                  ]}
                >
                  {keepSignedIn && (
                    <FontAwesome name="check" size={14} color="#fff" />
                  )}
                </View>
                <Text style={styles.checkboxText}>Keep Me Signed In</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.nextButton}
                onPress={() => navigation.navigate("SuccessSignUp")}
              >
                <Text style={styles.nextText}>Next</Text>
              </TouchableOpacity>

              {/* Create Account */}
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.createText}>Already have an Account?</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "rgba(114, 63, 14, 0.4)",
  },
  bgimg: {
    height: hp(70),
    backgroundColor: "rgba(114, 63, 14, 0.4)",
  },
  bottomArea: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: "2%",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  inIcon: {
    padding: "2%",
  },
  eyeIcon: {
    padding: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 50, // Makes it round
    borderWidth: 2,
    borderColor: theme.colours.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: theme.colours.primary,
  },
  checkboxText: {
    fontSize: hp(1.7),
    color: "gray",
    fontWeight: theme.fonts.bold,
  },
  background: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    top: -10,
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
    paddingBottom: 50,
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
    alignSelf: "flex-start",
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
