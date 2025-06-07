// import React from "react";
// import { StyleSheet, View, Text } from "react-native";
// import ScreenWrapper from "../Components/ScreenWrapper";
// import CardAlbum from "../Components/CardAlbum";
// import { useNavigation } from "@react-navigation/native";
// import { theme } from "../constants/themes.js";
// import useAuth from "../Context/UserContext.jsx";

// const albumImage = require("../../assets/flipbook/cover-album.jpeg");

// const AlbumScreen = () => {
//   const navigation = useNavigation();
//   const { eventListIds } = useAuth();

//   console.log(JSON.stringify(eventListIds),"ddddd")
//   return (
//     <ScreenWrapper bg="white">
//       {/* <View style={{ padding: 20 }}> */}
//       <View style={styles.header}>
//         <Text style={styles.greeting}>Flip Albums</Text>
//       </View>
//       {eventListIds?.searchEvent.map((event, index) => (
//         <View key={index}>
//           <CardAlbum
//             title={event.eventName}
//             photos={event.image}
//             // videos={12}
//             image={albumImage}
//             onPress={() => navigation.navigate("Flipbook",{flipId: eventListIds?.flipBooks[0]?._id,eventId: eventListIds?.flipBooks[0]?.eventId})}
//           />
//         </View>
//       ))}
//     </ScreenWrapper>
//   );
// };

// export default AlbumScreen;

// const styles = StyleSheet.create({
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 20,
//   },
//   greeting: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: theme.colours.primary,
//   },
// });

import React, { useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import ScreenWrapper from "../Components/ScreenWrapper";
import CardAlbum from "../Components/CardAlbum";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { theme } from "../constants/themes.js";
import useAuth from "../Context/UserContext.jsx";

const albumImage = require("../../assets/flipbook/cover-album.jpeg");

const AlbumScreen = () => {
  const navigation = useNavigation();
  const { eventListIds, fetchEventListIds, eventLoading, user } = useAuth();

  console.log(JSON.stringify(eventListIds), "eventListIds data");

  // Fetch data when component mounts if not already available
  useEffect(() => {
    if (!eventListIds && user) {
      fetchEventListIds();
    }
  }, []);

  console.log(JSON.stringify(eventListIds), "eventListIds data");

  // // Refresh data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (fetchEventListIds && !eventLoading && user) {
        fetchEventListIds();
      }
    }, [])
  );

  // Helper function to handle navigation with better error checking
  const handleAlbumPress = (event) => {
    const flipBook = eventListIds?.flipBooks?.find(book => book.eventId === event.eventId) || eventListIds?.flipBooks?.[0];
    
    if (flipBook && flipBook._id) {
      navigation.navigate("Flipbook", {
        flipId: flipBook._id,
        eventId: flipBook.eventId
      });
    } else {
      console.warn("No valid flipbook found for navigation");
      // Optionally show an alert or handle the error case
    }
  };

  // Show loading state if data is not available
  // if (eventLoading) {
  //   return (
  //     <ScreenWrapper bg="white">
  //       <View style={styles.header}>
  //         <Text style={styles.greeting}>Flip Albums</Text>
  //       </View>
  //       <View style={styles.loadingContainer}>
  //         <Text>Loading albums...</Text>
  //       </View>
  //     </ScreenWrapper>
  //   );
  // }

  // Show empty state if no events
  if (!eventListIds || !eventListIds.searchEvent || eventListIds.searchEvent.length === 0) {
    return (
      <ScreenWrapper bg="white">
        <View style={styles.header}>
          <Text style={styles.greeting}>Flip Albums</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text>No albums available</Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper bg="white">
      <View style={styles.header}>
        <Text style={styles.greeting}>Flip Albums</Text>
      </View>
      {eventListIds.searchEvent.map((event, index) => {
      // Find matching flipbook where flipBook.eventId === event._id
      const matchingFlipBook = eventListIds.flipBooks?.find(
        (flipBook) => flipBook.eventId === event._id
      );

      if (!matchingFlipBook) {
        return null; // Skip rendering if no flipbook found
      }

      return (
        <View key={event._id || index}>
          <CardAlbum
            title={event.eventName}
            // photos={event.eventImage}
            image={albumImage}
            onPress={() =>
              navigation.navigate("Flipbook", {
                flipId: matchingFlipBook._id,
                eventId: matchingFlipBook.eventId,
              })
            }
          />
        </View>
      );
    })}
    </ScreenWrapper>
  );
};

export default AlbumScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colours.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});



// import React from "react";
// import { StyleSheet, View, Text } from "react-native";
// import ScreenWrapper from "../Components/ScreenWrapper";
// import CardAlbum from "../Components/CardAlbum";
// import { useNavigation } from "@react-navigation/native";
// import { theme } from "../constants/themes.js";
// import useAuth from "../Context/UserContext.jsx";

// const albumImage = require("../../assets/flipbook/cover-album.jpeg");

// const AlbumScreen = () => {
//   const navigation = useNavigation();
//   const { eventListIds } = useAuth();
//   console.log(JSON.stringify(eventListIds),"allddkdkd")

  
//   return (
//     <ScreenWrapper bg="white">
//       <View style={styles.header}>
//         <Text style={styles.greeting}>Flip Albums</Text>
//       </View>
//       {eventListIds?.searchEvent?.map((event, index) => {
//         // Find the flipbook that matches this event
//         const flipbook = eventListIds?.flipBooks?.find(
//           fb => fb.eventId !== event._id
//         );
        
//         return (
//           <View key={`${event._id}-${index}`}>
//             <CardAlbum
//               title={event.eventName}
//               photos={event.image}
//               image={albumImage}
//               onPress={() => {
//                 if (flipbook) {
//                   navigation.navigate("Flipbook", {
//                     flipId: flipbook._id,
//                     eventId: event._id
//                   });
//                 } else {
//                   console.warn("No flipbook found for event:", event.eventName);
//                 }
//               }}
//             />
//           </View>
//         );
//       })}
//     </ScreenWrapper>
//   );
// };

// export default AlbumScreen;

// const styles = StyleSheet.create({
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 20,
//   },
//   greeting: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: theme.colours.primary,
//   },
// });