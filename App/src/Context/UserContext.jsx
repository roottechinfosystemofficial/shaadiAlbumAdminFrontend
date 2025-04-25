import React, { createContext, useContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const isLoggedIn = !!token;

  const getItemFromLS = async (navigation) => {
    try {
      const storedToken = await AsyncStorage.getItem("token");

      if (storedToken) {
        setToken(storedToken);
        await getUserData(storedToken, navigation);
      } else {
        if (navigation && navigation.getState().index === 0) {
          navigation.replace("Login");
        }
      }
    } catch (error) {
      console.error("Error loading stored data:", error.message);
      navigation.replace("Login"); // Fallback to Welcome
    }
  };

  const storeDataInLS = async (serverToken) => {
    try {
      await AsyncStorage.setItem("token", serverToken);
      setToken(serverToken);
    } catch (error) {
      console.error("Error storing token:", error.message);
    }
  };

  const getUserData = async (authToken, navigation) => {
    try {
      if (!authToken) {
        navigation.replace("Login");
        return;
      }

      const response = await fetch(
        "http://192.168.1.66:5000/api/v1/app-user/user",
        {
          method: "GET",
          headers: {
            Authorization: authToken,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();

        if (response.status === 401 || response.status === 403) {
          throw new Error("Session expired. Please log in again.");
        }
        throw new Error(errorData.message || "Failed to fetch user data");
      }
      const { data } = await response.json(); // ✅ Get 'data' first
      console.log(data);
      // const user = data // ✅ Extract user from data
      setUser(data);

      // ✅ Only navigate if needed
      if (navigation) {
        navigation.navigate("HomeScreen");
      }
    } catch (error) {
      console.error("Error fetching user data:", error.message);
      setToken(null);
      await AsyncStorage.removeItem("token");
      navigation.replace("Login");
    }
  };

  const removeTokenLogout = async (navigation) => {
    Alert.alert("Confirm", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        onPress: () => {
          console.log("Logout canceled");
        },
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: async () => {
          try {
            await AsyncStorage.clear();
            setToken(null);
            setUser(null);
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }], // Redirect to Welcome screen and clear back history
            }); // Or some other relevant route
          } catch (error) {
            console.error("Error during logout:", error.message);
          }
        },
        style: "destructive",
      },
    ]);
  };

  const getUserByUsername = async (username, token) => {
    try {
      const response = await fetch(
        `https://anyaa-backend.onrender.com/api/auth/profile/${username}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Error fetching profile: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching user profile:", error.message);
      throw error;
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        storeDataInLS,
        setToken,
        token,
        setUser,
        loading,
        isLoggedIn,
        removeTokenLogout,
        getUserData,
        getUserByUsername,
        getItemFromLS,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

const useAuth = () => {
  return useContext(UserContext);
};
export default useAuth;
