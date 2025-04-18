import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { theme } from "../constants/themes";

const Home = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: "row", gap: 5 }}>
          <Text style={styles.greeting}>Hi!</Text>
          <Text style={styles.name}>Priyank</Text>
        </View>
        <TouchableOpacity style={styles.bell}>
          <Ionicons name="notifications-outline" size={24} color="#65350F" />
        </TouchableOpacity>
      </View>

      {/* Event ID Input */}
      <View style={styles.inputContainer}>
        <FontAwesome5
          name="ticket-alt"
          size={16}
          color="#65350F"
          style={styles.icon}
        />
        <TextInput
          placeholder="Event Id"
          placeholderTextColor="#65350F"
          style={styles.input}
        />
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colours.primary,
  },
  bell: {
    backgroundColor: "#F2ECE7",
    padding: 10,
    borderRadius: 12,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2ECE7",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 30,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: "#65350F",
    fontSize: 16,
  },
});
