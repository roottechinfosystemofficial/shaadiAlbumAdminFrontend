import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation, useTheme } from "@react-navigation/native";
import { theme } from "../../constants/themes";
import ScreenWrapper from "../ScreenWrapper";
import BackButton from "../BackButton";
import { wp } from "../../helpers/Common";
import UserSelfieIcon from "../../../assets/Icons/UserSelfieIcon";

const FaceIDVerification = () => {
  const navigation = useNavigation();

  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        <BackButton navigation={navigation} />
        <Text style={styles.title}>Face ID verification</Text>

        <View style={styles.instructions}>
          <Text style={styles.instruction}>• Good lighting on your face</Text>
          <Text style={styles.instruction}>
            • Hold the phone in front of you
          </Text>
          <Text style={styles.instruction}>
            • Capture in front of a plain background
          </Text>
        </View>

        <View style={styles.imageContainer}>
          <UserSelfieIcon />
        </View>

        <View style={styles.rulesContainer}>
          <View style={styles.ruleItem}>
            <View style={styles.iconWrapper}>
              <Icon name="face-mask" size={30} color={theme.colours.primary} />
              <View style={styles.crossLine} />
            </View>
            <Text style={styles.ruleText}>No mask</Text>
          </View>
          <View style={styles.ruleItem}>
            <View style={styles.iconWrapper}>
              <Icon name="glasses" size={30} color={theme.colours.primary} />
              <View style={styles.crossLine} />
            </View>
            <Text style={styles.ruleText}>No glasses</Text>
          </View>
          <View style={styles.ruleItem}>
            <View style={styles.iconWrapper}>
              <Icon name="hat-fedora" size={30} color={theme.colours.primary} />
              <View style={styles.crossLine} />
            </View>
            <Text style={styles.ruleText}>No cap</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colours.primary }]}
        >
          <Text style={styles.buttonText}>Proceed to take selfie</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  time: {
    alignSelf: "flex-end",
    fontSize: 16,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginTop: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  instructions: {
    marginBottom: 20,
  },
  instruction: {
    fontSize: 14,
    marginBottom: 8,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  iconWithCross: {
    position: "relative",
  },
  iconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: theme.colours.primary,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  crossLine: {
    position: "absolute",
    width: 2,
    height: 56,
    backgroundColor: theme.colours.primary,
    transform: [{ rotate: "45deg" }],
  },
  crossIcon: {
    position: "absolute",
    top: -6,
    right: -6,
  },
  rulesContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 30,
  },
  ruleItem: {
    alignItems: "center",
  },
  ruleText: {
    marginTop: 5,
    fontSize: 14,
  },
  button: {
    padding: 15,
    borderRadius: theme.radius.xxl,
    alignItems: "center",
    position: "absolute",
    bottom: wp(4),
    width: wp(90),
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default FaceIDVerification;
