import React, { useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import HomeIcon from "../../assets/Icons/HomeIcon";
import AlbumIcon from "../../assets/Icons/AlbumIcon";
// import HeartIcon from "../../assets/Icons/HeartIcon";
import UserIcon from "../../assets/Icons/UserIcon";
import Home from "./Home";
import Account from "./Account";
import AlbumScreen from "./AlbumScreen";
import SelectIcon from "../../assets/Icons/SelectIcon";
import ImageSelection from "./ImageSelection";

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get("window");

const CustomTabBar = ({ state, navigation }) => {
  return (
    <View style={styles.container}>
      <BlurView intensity={30} tint="dark" style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const scaleValue = useSharedValue(isFocused ? 1.2 : 1);

          // ⚠️ Animate only after render
          useEffect(() => {
            scaleValue.value = withSpring(isFocused ? 1.2 : 1);
          }, [isFocused]);

          const animatedStyle = useAnimatedStyle(() => ({
            transform: [{ scale: scaleValue.value }],
          }));

          const IconComponent = {
            Home: HomeIcon,
            Albums: AlbumIcon,
            ImageSelection: SelectIcon,
            Account: UserIcon,
          }[route.name];

          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              style={styles.tabButton}
            >
              <Animated.View style={[styles.iconContainer, animatedStyle]}>
                <IconComponent
                  width={30}
                  height={30}
                  color={isFocused ? "#fff" : "#bbb"}
                />
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </BlurView>
    </View>
  );
};

const HomeScreen = () => {
  return (
    <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Albums"
        component={AlbumScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="ImageSelection"
        component={ImageSelection}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Account"
        component={Account}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: "center",
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 50,
    paddingVertical: 12,
    width: width - 40,
    alignItems: "center",
    justifyContent: "space-around",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    overflow: "hidden",
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    borderRadius: 50,
  },
});
