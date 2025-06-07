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
import { useNavigation, useRoute } from "@react-navigation/native";
import { theme } from "../constants/themes";
import useAuth from "../Context/UserContext";
import EventCard from "../Components/EventCard";
import ScreenWrapper from "../Components/ScreenWrapper";
import BackButton from "../Components/BackButton";

const SelectionEventFolders = () => {
  const route = useRoute();
  const { id, subevents, eventImage } = route.params;

  console.log("Event ID:", id);
  console.log("subEv ID:", subevents);
  const navigation = useNavigation();
  const [eventList, setEventList] = useState([]);

  const handleEventCodeChange = async (text) => {};

  useEffect(() => {
    if (subevents) {
      console.log("SubEvents:", subevents.length);
      setEventList(subevents);
    }
  }, []);
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
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              gap: 20,
              alignItems: "center",
            }}
          >
            <BackButton navigation={navigation} />
            <Text style={styles.greeting}>SubEvents</Text>
          </View>
        </View>

        <ScrollView style={{ marginTop: 20 }}>
          {eventList.map((event, index) => (
            <TouchableOpacity
              key={event?._id || index.toString()}
              onPress={() => {
                const subId = event?._id;
                 console.log(
                    "events:=============>>>>>>",
                   eventList
                  );
                return navigation.navigate("SeletEventImages", {
                  subId,
                  id,
                  subEventName: event?.subEventName,
                });
              }}
            >
              <EventCard
                event={event}
                eventImage={eventImage}
                eventName={event?.subEventName}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default SelectionEventFolders;

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
