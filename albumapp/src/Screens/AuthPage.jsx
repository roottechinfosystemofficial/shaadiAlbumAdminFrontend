import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { theme } from "../constants/themes";
import { LinearGradient } from "expo-linear-gradient";
import { wp } from "../helpers/Common";
import { useNavigation } from "@react-navigation/native";
import Loading from "../Components/Loading";
const AuthPage = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/AuthBack.jpg")}
        style={styles.background}
      />
      <LinearGradient
        colors={["#1C1C1E50", "#1C1C1E90", "#723F0E95"]}
        style={styles.gradient}
      />
      <View style={styles.overlay}>
        <Image
          source={require("../../assets/images/logo_1.png")}
          style={styles.logo}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.signUpButton}
            onPress={() => navigation.navigate("SignUp")}
          >
            <Text style={styles.signUpText}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default AuthPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",

    paddingHorizontal: 20,
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 290,
    resizeMode: "contain",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  button: {
    backgroundColor: theme.colours.primary,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 90,
    width: "100%",
    alignItems: "center",
  },
  signUpButton: {
    backgroundColor: "#FFF",
    width: wp(40),
    paddingVertical: 12,
    paddingHorizontal: 30,
    alignItems: "center",
    borderBottomRightRadius: theme.radius.md,
    borderTopLeftRadius: theme.radius.md,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  signUpText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#723F0E",
  },
  loginButton: {
    borderColor: "#723F0E",
    borderWidth: 2,
    width: wp(40),
    paddingVertical: 12,
    paddingHorizontal: 30,
    alignItems: "center",
    borderBottomRightRadius: theme.radius.md,
    borderTopLeftRadius: theme.radius.md,
  },
  loginText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
  },
});
