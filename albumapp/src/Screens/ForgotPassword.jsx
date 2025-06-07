import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "../Components/ScreenWrapper";
import BackButton from "../Components/BackButton";
import { useNavigation, useRoute } from "@react-navigation/native";
import { hp, wp } from "../helpers/Common";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { theme } from "../constants/themes";
import MessageIcon from "../../assets/Icons/MessageIcon";

const ForgotPassword = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [phoneNumber, setPhoneNumber] = useState("");

  const phoneFromLogin = route.params?.phone || "";
  const maskPhoneNumber = (phone) => {
    if (phone.length === 10) {
      return "●●●●●● " + phone.slice(-4);
    }
    return phone; // If not 10 digits, return as is
  };

  return (
    <ScreenWrapper bg={"white"}>
      <View style={styles.container}>
        <BackButton navigation={navigation} />
        <View>
          <Text style={styles.title}>Forgot password?</Text>
          <Text style={styles.subtitle}>
            Select which contact details should we use to reset your password
          </Text>
        </View>

        {/* SMS Option */}
        <View style={[styles.optionContainer, styles.selectedOption]}>
          <MessageIcon
            width={35}
            height={35}
            color={theme.colours.primary}
            // fill={theme.colours.primary}
            // stroke={"#000"}
          />
          <View
            style={{
              flexDirection: "colmn",
              alignItems: "flex-start",
              marginLeft: 10,
            }}
          >
            <Text style={styles.optionText}>Via SMS:</Text>

            <TextInput
              style={styles.input}
              value={maskPhoneNumber(phoneFromLogin)}
              editable={false}
              keyboardType="numeric"
            />
          </View>
        </View>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() =>
            navigation.navigate("PinVerify", { phone: phoneFromLogin })
          }
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

export default ForgotPassword;

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
  input: {
    fontSize: 14,
    fontWeight: theme.fonts.semibold,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: hp(3),
    marginBottom: 20,
  },

  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    paddingHorizontal: 20,
    // borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: theme.radius.xxl,
    marginTop: hp(2),
    backgroundColor: "white",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 1,

    // Shadow for Android
    elevation: 1,
  },
  selectedOption: {
    // backgroundColor: "gray
    borderColor: theme.colours.primary,
  },
  optionText: {
    // marginLeft: 10,
    fontSize: 14,
    color: theme.colours.textLight,
  },
  maskedText: {
    marginLeft: "auto",
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
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
});
