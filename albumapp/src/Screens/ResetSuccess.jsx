import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect } from "react";
import ScreenWrapper from "../Components/ScreenWrapper";
import { useNavigation } from "@react-navigation/native";
import { hp, wp } from "../helpers/Common";
import { theme } from "../constants/themes";
import { FontAwesome } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

const ResetSuccess = () => {
  const navigation = useNavigation();
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 5, stiffness: 100 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <ScreenWrapper bg={"white"}>
      <View style={styles.container}>
        {/* Success Icon with Animation */}
        <Animated.View style={[styles.iconContainer, animatedStyle]}>
          <FontAwesome
            name="check-circle"
            size={100}
            color={theme.colours.primary}
          />
        </Animated.View>

        {/* Success Message */}
        <Text style={styles.title}>Congrats!</Text>
        <Text style={styles.subtitle}>Password Reset Successful</Text>

        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("Login")} 
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

export default ResetSuccess;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp(4),
  },
  iconContainer: {
    backgroundColor: "#8B5A2B1A", // Light purple background
    width: 140,
    height: 140,
    borderRadius: 70, // Centered icon
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp(2),
  },
  title: {
    fontSize: 30,
    fontWeight: theme.fonts.semibold,
    color: theme.colours.primary,
    marginTop: hp(2),
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: hp(1),
  },
  backButton: {
    position: "absolute",
    bottom: 40,
    width: "90%",
    backgroundColor: theme.colours.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
