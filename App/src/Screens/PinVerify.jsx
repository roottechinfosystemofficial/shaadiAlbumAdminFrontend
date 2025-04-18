import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import ScreenWrapper from "../Components/ScreenWrapper";
import BackButton from "../Components/BackButton";
import { useNavigation, useRoute } from "@react-navigation/native";
import { hp, wp } from "../helpers/Common";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { theme } from "../constants/themes";
import MessageIcon from "../../assets/Icons/MessageIcon";

const PinVerify = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = [
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
  ];

  const phoneFromForgot = route.params?.phone || "";
  const maskPhoneNumber = (phone) => {
    if (phone.length === 10) {
      return `+91${phone.slice(0, 5)}` + "****";
    }
    return phone; // If not 10 digits, return as is
  };
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;

    let newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (value && index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };

  return (
    <ScreenWrapper bg={"white"}>
      <View style={styles.container}>
        <BackButton navigation={navigation} />
        <View>
          <Text style={styles.title}>Enter 4-digit Verification code</Text>
          <View style={styles.subtitle}>
            <Text>Code send to {maskPhoneNumber(phoneFromForgot)} This</Text>
            <Text>code will expired in 2:00</Text>
          </View>
        </View>
        <View style={styles.otpWrapper}>
          {otp.map((digit, index) => (
            <React.Fragment key={index}>
              <TextInput
                ref={inputRefs[index]}
                style={styles.otpInput}
                keyboardType="numeric"
                maxLength={1}
                value={digit}
                onChangeText={(value) => handleOtpChange(index, value)}
                returnKeyType="done"
              />
              {index < 5 && <View style={styles.separator} />}
            </React.Fragment>
          ))}
        </View>
        {/* SMS Option */}
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => navigation.navigate("ResetPassword")}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

export default PinVerify;

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
    flexDirection: "column",

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
  otpContainer: {
    flexDirection: "row",
    alignSelf: "center",
    marginTop: hp(2),
  },
  //   otpInput: {
  //     width: 55,
  //     height: 55,
  //     textAlign: "center",
  //     fontSize: 22,
  //     fontWeight: "bold",
  //     color: theme.colours.primary,
  //     // backgroundColor: "#F8F6FF",
  //     borderWidth: 2,
  //     borderBottomColor: theme.colours.primary,
  //   },
  otpWrapper: {
    width: "90%",
    marginTop: hp(2),
    flexDirection: "row",
    alignSelf: "center",
    backgroundColor: "white",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#999",
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  otpInput: {
    width: "16.6%",
    height: "100%",
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
    color: theme.colours.primary,
    backgroundColor: "white",
  },
  separator: {
    width: 1,
    height: "120%",
    backgroundColor: "#999",
    alignSelf: "center",
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
