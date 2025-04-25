import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../constants/themes";
import useAuth from "../Context/UserContext";
import EventCard from "../Components/EventCard";
import ScreenWrapper from "../Components/ScreenWrapper";

const ImageSelection = () => {
  // const id = event?._id;
  const navigation = useNavigation();
  const [eventPin, setEventPin] = useState("");
  const [eventList, setEventList] = useState([]);
  const { token, user } = useAuth();
  const handleEventCodeChange = async (text) => {
    setEventPin(text);

    if (text.length === 8) {
      try {
        const response = await fetch(
          "http://192.168.1.66:5000/api/v1/app-event/findEventByEventPin",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
            body: JSON.stringify({ eventPin: text }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          const newEvent = data.event;
          console.log("Fetched Event:", newEvent);

          // Check if already exists in the list
          const exists = eventList.some((e) => e._id === newEvent._id);

          if (!exists) {
            setEventList((prev) => [newEvent, ...prev]);
          } else {
            Alert.alert("Event already added.");
          }

          setEventPin(""); // Clear input after successful fetch
        } else {
          Alert.alert("Invalid Code", data.message || "Event not found.");
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    }
  };

  useEffect(() => {
    if (user?.imageSelectionEvent?.length) {
      setEventList(user.imageSelectionEvent);
    }
  }, [user]);
  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flexDirection: "row", gap: 5 }}>
            <Text style={styles.greeting}>Image Selection</Text>
          </View>
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
            placeholder="Event PIN"
            placeholderTextColor="#65350F"
            style={styles.input}
            value={eventPin}
            onChangeText={handleEventCodeChange}
            maxLength={8}
          />
        </View>
        <ScrollView style={{ marginTop: 20 }}>
          {eventList.map((event, index) => (
            <TouchableOpacity
              key={event?._id || index.toString()}
              onPress={() => {
                const id = event?._id;
                return navigation.navigate("SeletEventImages", {
                  id,
                });
              }}
            >
              <EventCard event={event} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default ImageSelection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    // paddingTop: 30,
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
    color: theme.colours.primary,
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
    marginTop: 20,
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
