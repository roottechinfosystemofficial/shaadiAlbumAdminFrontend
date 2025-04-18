import React from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import "react-native-gesture-handler";

import { UserProvider } from "./src/Context/UserContext";
import AppNavigator from "./src/Navigation/AppNavigator";

// Request FCM Permissions and Get Token

const AppContent = () => {
  return (
    <NavigationContainer>
      <StatusBar
        barStyle={"light-content"}
        backgroundColor={"white"}
        translucent={false}
      />
      <AppNavigator />
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}
