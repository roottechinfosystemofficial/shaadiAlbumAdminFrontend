import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  StatusBar,
  Platform,
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
import HeartIcon from "../../assets/Icons/HeartIcon";
import { hp } from "../helpers/Common";

const Home = () => {
  const navigation = useNavigation();
  const [eventCode, setEventCode] = useState("");
  const [eventData, setEventData] = useState([]);
  const [eventList, setEventList] = useState([]);
  const { token, user, getUserData, eventListIds, setEventListIds } = useAuth();


  useEffect(() => {
    setEventListIds(user);
  }, [eventList, setEventListIds]);
  const handleEventCodeChange = async (text) => {
    setEventCode(text);

    if (text.length === 6) {
      try {
        const response = await fetch(
          "https://api.shaadialbum.in/api/v1/app-event/findEventByEventcode",
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
    
        console.log(JSON.stringify(data), "The data")
        if (response.ok) {
          const newEvent = data.event;
          console.log("Fetched Event:========>", newEvent);

          // Check if already exists in the list
          const exists = eventList.some((e) => e._id === newEvent._id);

          if (!exists) {
            setEventList((prev) => [newEvent, ...prev]);
          } else {
            Alert.alert("Event already added.");
          }

          setEventCode(""); // Clear input after successful fetch
        } else {
          Alert.alert("Invalid Code", data.message || "Event not found.");
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    }
  };
  console.log(JSON.stringify(user),"all data")
  // setEventListIds(user);
  useEffect(() => {
    if (user?.searchEvent?.length) {
      setEventList(user.searchEvent);
  
    }
  }, []);

  const handleDelete = async (eventId) => {
    try {
      const response = await fetch(
        "https://api.shaadialbum.in/api/v1/app-event/deleteSearchedEvent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ eventId }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Remove event from local state
        setEventList((prev) => prev.filter((event) => event._id !== eventId));
        Alert.alert("Deleted", "Event removed from your search list.");
      } else {
        Alert.alert("Error", data.message || "Failed to delete event.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <ScreenWrapper bg="white">
      <StatusBar
        barStyle={"dark-content"} // icon/text color
        backgroundColor={"transparent"}
        translucent
      />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flexDirection: "row", gap: 5 }}>
            <Text style={styles.greeting}>Hi!</Text>
            <Text style={styles.name}>{user?.name}</Text>
          </View>
          <View style={{ flexDirection: "row", gap: 10 }}>
            {/* <TouchableOpacity
              style={styles.bell}
              onPress={() => {
                navigation.navigate("Favorites");
              }}
            >
              <HeartIcon size={24} strokeWidth={1.5} color="#65350F" />
            </TouchableOpacity> */}
            {/* <TouchableOpacity style={styles.bell}>
              <Ionicons
                name="notifications-outline"
                size={24}
                color="#65350F"
              />
            </TouchableOpacity> */}
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
            placeholder="Event Id"
            placeholderTextColor="#65350F"
            style={styles.input}
            value={eventCode}
            onChangeText={handleEventCodeChange}
            maxLength={6}
          />
          {/* <TouchableOpacity
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
          </TouchableOpacity> */}
        </View>
        <ScrollView style={{ marginTop: 20 }}>
          {eventList.map((event, index) => (
            <TouchableOpacity
              key={event?._id || index.toString()}
              onPress={() => {
                const id = event?._id;
                const subevents = event?.subevents || [];
                console.log(
                  "Navigating to EventFolders with ID and subevents:",
                  id,
                  subevents
                );

                navigation.navigate("EventFolders", {
                  id,
                  subevents,
                  eventImage: event?.eventImage,
                  eventName: event?.eventName,
                });
              }}
            >
              <EventCard
                event={event}
                eventImage={event?.eventImage}
                eventName={event?.eventName}
                onDeletePress={() => handleDelete(event._id)}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default Home;

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
    // fontWeight: "bold",
    color: "#000",
  },
  name: {
    fontSize: 24,
    // fontWeight: "bold",
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
    paddingVertical: Platform.OS === "android" ? hp(0.8) : 10,
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
