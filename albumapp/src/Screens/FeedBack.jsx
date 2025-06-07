import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  TextInput,
  Linking,
} from "react-native";
import React, { useState } from "react";
import ScreenWrapper from "../Components/ScreenWrapper";
import BackButton from "../Components/BackButton";
import { useNavigation } from "@react-navigation/native";
import { hp, wp } from "../helpers/Common";
import { theme } from "../constants/themes";
import { Ionicons } from "@expo/vector-icons"; // Make sure you have `expo install @expo/vector-icons`

const FeedBack = () => {
  const navigation = useNavigation();
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");

  const handleShare = () => {
    if (!rating && !message.trim()) {
      return alert("Please rate and enter a message before sharing.");
    }

    const stars = "⭐".repeat(rating);
    const text = `Feedback:\n\nRating: ${stars}\n\nMessage: ${message}`;
    const phoneNumber = "918128943908";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;

    Linking.openURL(url).catch(() =>
      alert("Could not open WhatsApp. Make sure it's installed.")
    );
  };

  return (
    <ScreenWrapper bg={"white"}>
      <ScrollView contentContainerStyle={styles.container}>
        <BackButton navigation={navigation} />
        <Text style={styles.title}>Share Your Feedback</Text>

        {/* Star Rating */}
        <View style={styles.starRow}>
          {[1, 2, 3, 4, 5].map((i) => (
            <TouchableOpacity key={i} onPress={() => setRating(i)}>
              <Ionicons
                name={i <= rating ? "star" : "star-outline"}
                size={32}
                color={i <= rating ? "#FFD700" : "#aaa"}
                style={styles.star}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Message Box */}
        <TextInput
          style={styles.messageBox}
          placeholder="Write your feedback here..."
          multiline
          numberOfLines={4}
          value={message}
          onChangeText={setMessage}
        />

        <TouchableOpacity style={styles.callButton} onPress={handleShare}>
          <Text style={styles.callButtonText}>Share Now</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default FeedBack;

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
  starRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: hp(2),
  },
  star: {
    marginHorizontal: 6,
  },
  messageBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: wp(4),
    minHeight: hp(15),
    textAlignVertical: "top",
    fontSize: 14,
    marginBottom: hp(3),
    color: "#333",
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
