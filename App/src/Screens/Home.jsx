import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import {
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../constants/themes";
import useAuth from "../Context/UserContext";
import EventCard from "../Components/EventCard";

const Home = () => {
  const navigation = useNavigation();
  const [eventCode, setEventCode] = useState("");
  const [eventData, setEventData] = useState(null);
  const { token, user } = useAuth();
  const handleEventCodeChange = async (text) => {
    setEventCode(text);

    if (text.length === 6) {
      try {
        const response = await fetch(
          "http://192.168.1.66:5000/api/v1/app-event/findEventByEventcode",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
            body: JSON.stringify({ eventCode: text }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          console.log("Event data:", data);
          setEventData(data.event);
        } else {
          Alert.alert("Invalid Code", data.message || "Event not found.");
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    }
  };
  console.log("User", user);
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: "row", gap: 5 }}>
          <Text style={styles.greeting}>Hi!</Text>
          <Text style={styles.name}>{user?.name}</Text>
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
          value={eventCode}
          onChangeText={handleEventCodeChange}
          maxLength={6}
        />
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("QRScanner");
          }}
        >
          <MaterialCommunityIcons
            name="qrcode-scan"
            size={22}
            color="#65350F"
            style={styles.qrIcon}
          />
        </TouchableOpacity>
      </View>
      {eventData && <EventCard event={eventData} />}
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  qrIcon: {
    marginRight: 7,
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
    paddingVertical: 7,
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
