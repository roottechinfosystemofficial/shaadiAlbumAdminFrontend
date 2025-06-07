import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const EventCard = ({ event, eventImage, eventName, onDeletePress }) => {
  return (
    <View style={styles.card}>
      <ImageBackground
        source={{ uri: eventImage }}
        style={styles.image}
        imageStyle={styles.imageBorder}
      >
        <View style={styles.overlay}>
          <View style={styles.textContainer}>
            <Text style={styles.eventName}>{eventName}</Text>
            {event.subEventTotalImages !== 0 ? (
              <Text style={styles.mediaCount}>
                {event.subEventTotalImages} Photos
              </Text>
            ) : null
            }
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: "#FFF",
              alignSelf: "center",
              padding: 5,
              borderRadius: "50%",
            }}
            onPress={onDeletePress}
          >
            <Ionicons
              name="trash-bin"
              size={15}
              color="red"
              style={styles.deleteIcon}
            />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

export default EventCard;

const styles = StyleSheet.create({
  card: {
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: "hidden",
    marginTop: 8,
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
  deleteIcon: {
    alignSelf: "flex-start",
  },
});
