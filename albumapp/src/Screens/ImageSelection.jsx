// import {
//   StyleSheet,
//   Text,
//   View,
//   TextInput,
//   TouchableOpacity,
//   Alert,
//   ScrollView,
// } from "react-native";
// import React, { useEffect, useState } from "react";
// import {
//   Ionicons,
//   FontAwesome5,
//   MaterialCommunityIcons,
// } from "@expo/vector-icons";
// import { useNavigation } from "@react-navigation/native";
// import { theme } from "../constants/themes";
// import useAuth from "../Context/UserContext";
// import EventCard from "../Components/EventCard";
// import ScreenWrapper from "../Components/ScreenWrapper";

// const ImageSelection = () => {
//   // const id = event?._id;
//   const navigation = useNavigation();
//   const [eventPin, setEventPin] = useState("");
//   const [eventList, setEventList] = useState([]);
//   const { token, user } = useAuth();
//   console.log("User Data:", user?.imageSelectionEvent);

//   const handleEventCodeChange = async (text) => {
//     setEventPin(text);

//     if (text.length === 8) {
//       try {
//         const response = await fetch(
//           "https://api.shaadialbum.in/api/v1/app-event/findEventByEventPin",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: token,
//             },
//             body: JSON.stringify({ eventPin: text }),
//           }
//         );

//         const data = await response.json();

//         if (response.ok) {
//           const newEvent = data.event;
//           console.log("Fetched Event:", newEvent);

//           // Check if already exists in the list
//           const exists = eventList.some((e) => e._id === newEvent._id);

//           if (!exists) {
//             setEventList((prev) => [newEvent, ...prev]);
//           } else {
//             Alert.alert("Event already added.");
//           }

//           setEventPin(""); // Clear input after successful fetch
//         } else {
//           Alert.alert("Invalid Code", data.message || "Event not found.");
//         }
//       } catch (error) {
//         console.error("Error fetching event:", error);
//         Alert.alert("Error", "Something went wrong. Please try again.");
//       }
//     }
//   };

//   useEffect(() => {
//     if (user?.imageSelectionEvent?.length) {
//       setEventList(user.imageSelectionEvent);
//     }
//   }, [user]);
//   return (
//     <ScreenWrapper bg="white">
//       <View style={styles.container}>
//         {/* Header */}
//         <View style={styles.header}>
//           <View style={{ flexDirection: "row", gap: 5 }}>
//             <Text style={styles.greeting}>Image Selection</Text>
//           </View>
//         </View>

//         {/* Event ID Input */}
//         <View style={styles.inputContainer}>
//           <FontAwesome5
//             name="ticket-alt"
//             size={16}
//             color="#65350F"
//             style={styles.icon}
//           />
//           <TextInput
//             placeholder="Event PIN"
//             placeholderTextColor="#65350F"
//             style={styles.input}
//             value={eventPin}
//             onChangeText={handleEventCodeChange}
//             maxLength={8}
//           />
//         </View>
//         <ScrollView style={{ marginTop: 20 }}>
//           {eventList.length === 0 ? (
//             <View style={styles.emptyContainer}>
//               <MaterialCommunityIcons
//                 name="image-search"
//                 size={80}
//                 color="#ccc"
//               />
//               <Text style={styles.emptyTitle}>No Events Yet</Text>
//               <Text style={styles.emptyText}>
//                 Please fill the secure Event PIN above to find your event and
//                 start selecting images.
//               </Text>
//             </View>
//           ) : (
//             eventList.map((event, index) => (
//               <TouchableOpacity
//                 key={event?._id || index.toString()}
//                 onPress={() => {
//                   const id = event?._id;
//                   const subevents = event?.subevents || [];
//                   console.log(
//                     "Navigating to EventFolders with ID and subevents:",
//                     id,
//                     subevents
//                   );

//                   navigation.navigate("SelectionEventFolders", {
//                     id,
//                     subevents,
//                     eventImage: event?.eventImage,
//                     eventName: event?.eventName,
//                   });
//                 }}
//               >
//                 <EventCard
//                   event={event}
//                   eventImage={event?.eventImage}
//                   eventName={event?.eventName}
//                 />
//               </TouchableOpacity>
//             ))
//           )}
//         </ScrollView>
//       </View>
//     </ScreenWrapper>
//   );
// };

// export default ImageSelection;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     paddingHorizontal: 20,
//     // paddingTop: 30,
//   },
//   qrIcon: {
//     marginRight: 7,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   greeting: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: theme.colours.primary,
//   },
//   name: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: theme.colours.primary,
//   },
//   bell: {
//     backgroundColor: "#F2ECE7",
//     padding: 10,
//     borderRadius: 12,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 50,
//     paddingHorizontal: 20,
//   },
//   emptyTitle: {
//     fontSize: 22,
//     fontWeight: "bold",
//     color: "#999",
//     marginTop: 20,
//   },
//   emptyText: {
//     fontSize: 16,
//     color: "#999",
//     textAlign: "center",
//     marginTop: 10,
//   },

//   inputContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#F2ECE7",
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     paddingVertical: 7,
//     marginTop: 20,
//   },
//   icon: {
//     marginRight: 8,
//   },
//   input: {
//     flex: 1,
//     color: "#65350F",
//     fontSize: 16,
//   },
// });


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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from "../constants/themes";
import useAuth from "../Context/UserContext";
import EventCard from "../Components/EventCard";
import ScreenWrapper from "../Components/ScreenWrapper";

const ImageSelection = () => {
  const navigation = useNavigation();
  const [eventPin, setEventPin] = useState("");
  const [eventList, setEventList] = useState([]);
  const [deletedEventIds, setDeletedEventIds] = useState([]);
  const { token, user } = useAuth();
  console.log("User Data:", user?.imageSelectionEvent);

  // Load deleted event IDs from AsyncStorage on component mount
  useEffect(() => {
    loadDeletedEventIds();
  }, []);

  // Load deleted event IDs from storage
  const loadDeletedEventIds = async () => {
    try {
      const stored = await AsyncStorage.getItem('deletedEventIds');
      if (stored) {
        setDeletedEventIds(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading deleted event IDs:', error);
    }
  };

  // Save deleted event IDs to storage
  const saveDeletedEventIds = async (ids) => {
    try {
      await AsyncStorage.setItem('deletedEventIds', JSON.stringify(ids));
    } catch (error) {
      console.error('Error saving deleted event IDs:', error);
    }
  };

  const handleEventCodeChange = async (text) => {
    setEventPin(text);

    if (text.length === 8) {
      try {
        const response = await fetch(
          "https://api.shaadialbum.in/api/v1/app-event/findEventByEventPin",
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

  // Filter events when user data or deletedEventIds change
  useEffect(() => {
    if (user?.imageSelectionEvent?.length) {
      const filtered = user.imageSelectionEvent.filter(
        (e) => !deletedEventIds.includes(e._id)
      );
      setEventList(filtered);
    }
  }, [user, deletedEventIds]);

  const handleDeleteEvent = async (eventId) => {
    const updatedDeletedIds = [...deletedEventIds, eventId];
    
    // Update state
    setDeletedEventIds(updatedDeletedIds);
    setEventList((prevList) => prevList.filter((event) => event._id !== eventId));
    
    // Persist to storage
    await saveDeletedEventIds(updatedDeletedIds);
  };

  // Optional: Add a function to clear all deleted events (for testing or reset)
  const clearDeletedEvents = async () => {
    try {
      await AsyncStorage.removeItem('deletedEventIds');
      setDeletedEventIds([]);
      // Reload events
      if (user?.imageSelectionEvent?.length) {
        setEventList(user.imageSelectionEvent);
      }
    } catch (error) {
      console.error('Error clearing deleted events:', error);
    }
  };

  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flexDirection: "row", gap: 5 }}>
            <Text style={styles.greeting}>Image Selection</Text>
          </View>
          {/* Optional: Add reset button for testing */}
          {/* <TouchableOpacity onPress={clearDeletedEvents} style={styles.resetButton}>
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity> */}
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
          {eventList.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons
                name="image-search"
                size={80}
                color="#ccc"
              />
              <Text style={styles.emptyTitle}>No Events Yet</Text>
              <Text style={styles.emptyText}>
                Please fill the secure Event PIN above to find your event and
                start selecting images.
              </Text>
            </View>
          ) : (
            eventList.map((event, index) => (
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

                  navigation.navigate("SelectionEventFolders", {
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
                  onDeletePress={() => handleDeleteEvent(event._id)}
                />
              </TouchableOpacity>
            ))
          )}
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#999",
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 10,
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
  // Optional styles for reset button
  resetButton: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  resetText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
