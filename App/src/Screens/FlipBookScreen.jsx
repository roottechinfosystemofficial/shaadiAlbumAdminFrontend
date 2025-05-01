import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Dimensions,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  Platform,
} from "react-native";
import { WebView } from "react-native-webview";
import * as ScreenOrientation from "expo-screen-orientation";
import { hp } from "../helpers/Common";
const { width, height } = Dimensions.get("window");
const FlipBookScreen = () => {
  const webviewRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const lockOrientation = async () => {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE
      );
      StatusBar.setHidden(true); // Hide the status bar
    };

    lockOrientation();

    return () => {
      ScreenOrientation.unlockAsync();
      StatusBar.setHidden(false); // Show it again on unmount
    };
  }, []);

  return (
    <View style={styles.container}>
      {loading && (
        <ActivityIndicator size="large" color="#000" style={styles.loader} />
      )}
      <WebView
        ref={webviewRef}
        source={{
          uri: "https://shaadialbumadminfrontend.onrender.com/flipbookUser/680b55e432fff6cc637292e7/68106258bba9ef2a98415856",
        }}
        onLoadEnd={() => setLoading(false)}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
        style={{ width, height }} // 👈 key fix here
      />
    </View>
  );
};

export default FlipBookScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loader: {
    position: "absolute",
    top: "50%",
    left: "50%",
    zIndex: 10,
  },
  // webview: {
  //   width: Dimensions.get("window").width,
  //   height: Dimensions.get("window").height,
  // },
});
