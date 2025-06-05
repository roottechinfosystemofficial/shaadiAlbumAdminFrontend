import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import ScreenWrapper from "../Components/ScreenWrapper";
import BackButton from "../Components/BackButton";
import { useNavigation } from "@react-navigation/native";
import { hp, wp } from "../helpers/Common";
import { theme } from "../constants/themes";

const faqData = [
  {
    question: "1. What is included in a Shaadi album?",
    answer:
      "A Shaadi album typically includes a collection of high-quality photographs from various events throughout the wedding...",
  },
  {
    question:
      "2. How long does it take to receive my Shaadi album after the wedding?",
    answer:
      "The delivery time for a Shaadi album typically ranges from 4 to 8 weeks after the wedding...",
  },
  {
    question: "3. Can I add extra photos or pages to my album later?",
    answer: "Yes, you can usually add extra photos or pages to your album...",
  },
  {
    question: "4. Can I receive my Shaadi album in a digital format as well?",
    answer: "Many photographers offer digital versions of your Shaadi album...",
  },
  {
    question: "5. How many photos will be included in the Shaadi album?",
    answer:
      "The number of photos in the album depends on the package you choose.",
  },
];

const Faq = () => {
  const navigation = useNavigation();
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleAnswer = (index) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  return (
    <ScreenWrapper bg={"white"}>
      <ScrollView contentContainerStyle={styles.container}>
        <BackButton navigation={navigation} />
        <Text style={styles.title}>Frequently Asked Questions</Text>

        {faqData.map((item, index) => (
          <View key={index} style={styles.faqItem}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                expandedIndex === index && styles.activeToggle,
              ]}
              onPress={() => toggleAnswer(index)}
            >
              <Text
                style={[
                  styles.questionText,
                  expandedIndex === index && { color: "#FFF" },
                ]}
              >
                {item.question}
              </Text>
              <Text
                style={[
                  styles.icon,
                  expandedIndex === index && { color: "#FFF" },
                ]}
              >
                {expandedIndex === index ? "▲" : "▼"}
              </Text>
            </TouchableOpacity>
            {expandedIndex === index && (
              <Text style={styles.answerText}>{item.answer}</Text>
            )}
          </View>
        ))}
      </ScrollView>
    </ScreenWrapper>
  );
};

export default Faq;

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
    textAlign: "center",
  },
  faqItem: {
    marginBottom: hp(2),
  },
  toggleButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: hp(1.5),
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  activeToggle: {
    backgroundColor: theme.colours.primary,
    color: "#ffffff",
  },
  questionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
  },
  icon: {
    fontSize: 18,
    marginLeft: 10,
    color: "#000",
  },
  answerText: {
    padding: hp(1.5),
    backgroundColor: "#fff8f0",
    borderRadius: 8,
    fontSize: 13,
    color: "#333",
    lineHeight: 22,
  },
});
