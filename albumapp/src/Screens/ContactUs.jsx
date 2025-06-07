import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
  ScrollView,
} from "react-native";
import React from "react";
import ScreenWrapper from "../Components/ScreenWrapper";
import BackButton from "../Components/BackButton";
import { useNavigation } from "@react-navigation/native";
import { hp, wp } from "../helpers/Common";
import { theme } from "../constants/themes";

const ContactUs = () => {
  const navigation = useNavigation();

  const handleCall = () => {
    Linking.openURL("tel:+918128943908");
  };

  return (
    <ScreenWrapper bg={"white"}>
      <ScrollView contentContainerStyle={styles.container}>
        <BackButton navigation={navigation} />
        <Text style={styles.title}>Contact Us</Text>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Studio Name:</Text>
          <Text style={styles.value}>Shaadi Album</Text>

          <Text style={styles.label}>Person Name:</Text>
          <Text style={styles.value}>Pratham Suthar</Text>

          <Text style={styles.label}>Phone Number:</Text>
          <Text style={styles.value}>+91 8128943908</Text>
        </View>

        <TouchableOpacity style={styles.callButton} onPress={handleCall}>
          <Text style={styles.callButtonText}>Call Now</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default ContactUs;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(4),
    paddingBottom: hp(10),
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    marginTop: hp(4),
    marginBottom: hp(2),
  },
  infoBox: {
    backgroundColor: "#f5f5f5",
    padding: wp(4),
    borderRadius: 10,
    marginBottom: hp(4),
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#444",
    marginTop: hp(1),
  },
  value: {
    fontSize: 16,
    color: "#222",
    marginBottom: hp(1),
  },
  callButton: {
    backgroundColor: theme.colours.primary,
    padding: hp(2),
    borderRadius: 10,
    alignItems: "center",
  },
  callButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
