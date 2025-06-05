import React, { useEffect, useRef, useState } from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  Dimensions,
} from "react-native";
import { WebView } from "react-native-webview";
import * as ScreenOrientation from "expo-screen-orientation";
import { useRoute } from "@react-navigation/native";

const FlipBookScreen = () => {
  const webviewRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const route = useRoute();
  const { eventId, flipId } = route.params;
    const [orientationReady, setOrientationReady] = useState(false);
  console.log(eventId,flipId,"uuuuuuuuuu")

  // useEffect(() => {
  //   const lockOrientation = async () => {
  //     try {
  //       await ScreenOrientation.lockAsync(
  //         ScreenOrientation.OrientationLock.LANDSCAPE
  //       );
  //       StatusBar.setHidden(true);
  //       setOrientationReady(true); 
  //     } catch (error) {
  //       console.error("Orientation lock failed", error);
  //       setOrientationReady(true);
  //     }
  //   };

  //   lockOrientation();

  //   return () => {
  //     ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
  //     StatusBar.setHidden(false);
  //   };
  // }, []);

    useEffect(() => {
    const lockOrientation = async () => {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE
      );
      StatusBar.setHidden(true);
    };

    lockOrientation();

    return () => {
      ScreenOrientation.unlockAsync();
      StatusBar.setHidden(false);
    };
  }, []);
  const { width, height } = Dimensions.get("window");
  const webViewUrl = `https://studio.shaadialbum.in/flipbookUser/${eventId}/${flipId}`;
  return (
    <View style={{ width, height, backgroundColor: "#000" }}>
      {loading && (
        <ActivityIndicator size="large" color="#fff" style={styles.loader} />
      )}
      <WebView
        ref={webviewRef}
        source={{ uri: webViewUrl }}
        onLoadEnd={() => setLoading(false)}
        javaScriptEnabled
        domStorageEnabled
        allowsFullscreenVideo
        scalesPageToFit={true}
        style={{
          width: width,
          height: height,
          backgroundColor: "#000",
          overflow: "hidden", // Prevent overflow of content
        }}
      />
    </View>
  );
};

export default FlipBookScreen;

const styles = StyleSheet.create({
  loader: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -20,
    marginTop: -20,
    zIndex: 10,
  },
});



// import React, { useEffect, useRef, useState } from "react";
// import {
//   View,
//   ActivityIndicator,
//   StyleSheet,
//   StatusBar,
//   Dimensions,
// } from "react-native";
// import { WebView } from "react-native-webview";
// import * as ScreenOrientation from "expo-screen-orientation";
// import { useRoute } from "@react-navigation/native";

// const FlipBookScreen = () => {
//   const webviewRef = useRef(null);
//   const [loading, setLoading] = useState(true);
//   const [htmlContent, setHtmlContent] = useState("");
//   const route = useRoute();
//   const { eventId, flipId } = route.params;
  
//   const webViewUrl = `https://api.shaadialbum.in/api/v1/s3/list-flipBookimagesByEventId/6836cfdd93e7fc3edda41ba5`;

//   useEffect(() => {
//     const fetchDataAndRenderFlipbook = async () => {
//       try {
//         // Fetch images from API
//         const response = await fetch(webViewUrl);
//         const data = await response.json(); // Parse as JSON
        
//         // Extract images array from response
//         const images = data.images || [];
        
//         console.log("Fetched images:", images.length);

//         // Generate HTML with actual images
//         const flipbookHTML = `
//           <!DOCTYPE html>
//           <html>
//             <head>
//               <meta charset="UTF-8" />
//               <title>Flipbook</title>
//               <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//               <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
//               <script src="https://cdn.jsdelivr.net/gh/blasten/turn.js@master/lib/turn.min.js"></script>
//               <style>
//                 html,
//                 body {
//                   margin: 0;
//                   padding: 0;
//                   background-color: black;
//                   overflow: hidden;
//                   width: 100vw;
//                   height: 100vh;
//                   touch-action: pan-y;
//                 }

//                 #flipbook {
//                   width: 100vw;
//                   height: 100vh;
//                 }

//                 .page {
//                   width: 100%;
//                   height: 100%;
//                   background-color: black;
//                   display: flex;
//                   align-items: center;
//                   justify-content: center;
//                   user-select: none;
//                 }

//                 .page img {
//                   width: 100%;
//                   height: 100%;
//                   object-fit: contain;
//                   pointer-events: none;
//                 }

//                 .controls {
//                   position: absolute;
//                   bottom: 20px;
//                   left: 0;
//                   width: 100%;
//                   display: flex;
//                   justify-content: space-between;
//                   padding: 0 20px;
//                   z-index: 999;
//                 }

//                 .controls button {
//                   background-color: rgba(255, 255, 255, 0.1);
//                   color: white;
//                   border: none;
//                   padding: 10px 20px;
//                   font-size: 18px;
//                   border-radius: 8px;
//                   cursor: pointer;
//                   transition: background-color 0.2s ease;
//                 }

//                 .controls button:hover {
//                   background-color: rgba(255, 255, 255, 0.3);
//                 }
//               </style>
//             </head>
//             <body>
//               <div id="flipbook">
//                 ${images
//                   .map(
//                     (img) => `
//                   <div class="page">
//                     <img src="${img}" />
//                   </div>
//                 `
//                   )
//                   .join("")}
//               </div>

//               <div class="controls">
//                 <button onclick="$('#flipbook').turn('previous')">⟵ Previous</button>
//                 <button onclick="$('#flipbook').turn('next')">Next ⟶</button>
//               </div>

//               <script>
//                 $(function () {
//             // Initialize flipbook
//             $("#flipbook").turn({
//               width: window.innerWidth,
//               height: window.innerHeight,
//               autoCenter: true,
//               display: "single",
//               elevation: 50,
//               gradients: true,
//               acceleration: true,
//             });
            
//             // FIX: Proper event binding
//             $("#prevButton").on("click", function() {
//               $("#flipbook").turn("previous");
//             });
            
//             $("#nextButton").on("click", function() {
//               $("#flipbook").turn("next");
//             });

//             // Handle orientation changes
//             window.addEventListener("resize", function() {
//               $("#flipbook").turn("size", window.innerWidth, window.innerHeight);
//             });
//           });
//               </script>
//             </body>
//           </html>
//         `;

//         setHtmlContent(flipbookHTML);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error loading flipbook:", error);
//         setLoading(false);
//       }
//     };

//     fetchDataAndRenderFlipbook();
//   }, [eventId]);

//   useEffect(() => {
//     const lockOrientation = async () => {
//       await ScreenOrientation.lockAsync(
//         ScreenOrientation.OrientationLock.LANDSCAPE
//       );
//       StatusBar.setHidden(true);
//     };

//     lockOrientation();

//     return () => {
//       ScreenOrientation.unlockAsync();
//       StatusBar.setHidden(false);
//     };
//   }, []);

//   const { width, height } = Dimensions.get("window");

//   return (
//     <View style={{ width, height, backgroundColor: "#000" }}>
//       {loading && (
//         <ActivityIndicator size="large" color="#fff" style={styles.loader} />
//       )}
//       {!loading && htmlContent ? (
//         <WebView
//           ref={webviewRef}
//           source={{ html: htmlContent }}
//           javaScriptEnabled={true}
//           domStorageEnabled={true}
//           allowsFullscreenVideo={true}
//           startInLoadingState={true}
//           scalesPageToFit={true}
//           style={{
//             width: width,
//             height: height,
//             backgroundColor: "#000",
//           }}
//         />
//       ) : null}
//     </View>
//   );
// };

// export default FlipBookScreen;

// const styles = StyleSheet.create({
//   loader: {
//     position: "absolute",
//     top: "50%",
//     left: "50%",
//     marginLeft: -20,
//     marginTop: -20,
//     zIndex: 10,
//   },
// });