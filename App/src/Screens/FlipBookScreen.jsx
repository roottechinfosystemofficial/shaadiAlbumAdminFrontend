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

const FlipBookScreen = () => {
  const webviewRef = useRef(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <View style={{ width, height, backgroundColor: "#000" }}>
      {loading && (
        <ActivityIndicator size="large" color="#fff" style={styles.loader} />
      )}
      <WebView
        ref={webviewRef}
        source={{
          uri: "https://shaadialbumadminfrontend.onrender.com/flipbookUser/680b55e432fff6cc637292e7/68106258bba9ef2a98415856",
        }}
        onLoadEnd={() => setLoading(false)}
        javaScriptEnabled
        domStorageEnabled
        allowsFullscreenVideo
        scalesPageToFit={false}
        style={{ width: width, height, backgroundColor: "#000" }}
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
