import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import useAuth from "../Context/UserContext";
import Loading from "../Components/Loading";
import { View } from "react-native";

const GetLSDataLoading = () => {
  const { getItemFromLS } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    const checkToken = async () => {
      // Wait 8 seconds before running getItemFromLS
      setTimeout(async () => {
        await getItemFromLS(navigation);
      }, 2000);
    };

    checkToken();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <Loading />
    </View>
  );
};

export default GetLSDataLoading;
