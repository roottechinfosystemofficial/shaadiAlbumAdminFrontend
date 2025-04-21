import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const EventCard = ({ event }) => {
  return (
    <TouchableOpacity style={styles.card}>
      <ImageBackground
        source={{ uri: event.eventImage }}
        style={styles.image}
        imageStyle={styles.imageBorder}
      >
        <View style={styles.overlay}>
          <View style={styles.textContainer}>
            <Text style={styles.eventName}>{event.eventName}</Text>
            <Text style={styles.mediaCount}>30 Photos{"\n"}4 videos</Text>
          </View>
          <Ionicons
            name="refresh-circle"
            size={24}
            color="#fff"
            style={styles.refreshIcon}
          />
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default EventCard;

const styles = StyleSheet.create({
  card: {
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: "hidden",
    marginTop: 30,
  },
  image: {
    height: 160,
    width: "100%",
    justifyContent: "flex-end",
  },
  imageBorder: {
    // borderRadius: 15,
  },
  overlay: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  textContainer: {
    flexDirection: "column",
  },
  eventName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  mediaCount: {
    color: "#fff",
    fontSize: 12,
    marginTop: 5,
  },
  refreshIcon: {
    alignSelf: "flex-start",
  },
});
