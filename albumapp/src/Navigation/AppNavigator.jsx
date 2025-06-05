// src/navigation/AppNavigator.js
import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import GetLSDataLoading from "../Components/GetLSDataLoading";
import Welcome from "../Screens/Welcome";
import Login from "../Screens/Login";
import Home from "../Screens/Home";
import AuthPage from "../Screens/AuthPage";
import SignUp from "../Screens/SignUp";
import ForgotPassword from "../Screens/ForgotPassword";
import PinVerify from "../Screens/PinVerify";
import ResetPassword from "../Screens/ResetPassword";
import ResetSuccess from "../Screens/ResetSuccess";
import SuccessSignUp from "../Screens/SuccessSignUp";
import HomeScreen from "../Screens/HomeScreen";
import Account from "../Screens/Account";
import Favorites from "../Screens/Favorites";
import EditProfile from "../Screens/EditProfile";
import AlbumScreen from "../Screens/AlbumScreen";
import QRScanner from "../Components/QRScanner";
import SelfieWithFaceDetector from "../Components/SelfieWithFaceDetector";
import FaceIDVerification from "../Components/FaceIDVerification/FaceIDVerification";
import FlipBookScreen from "../Screens/FlipBookScreen";
import EventImages from "../Screens/EventImages";
import ImageSelection from "../Screens/ImageSelection";
import SeletEventImages from "../Screens/SelectEventImages";
import EventFolders from "../Screens/EventFolders";
import SelectionEventFolders from "../Screens/SelectionEventFolders";
import FaceSelfieCam from "../Components/FaceIDVerification/FaceSelfieCam";
import ChangePassword from "../Screens/ChangePassword";
import ContactUs from "../Screens/ContactUs";
import Policy from "../Screens/Policy";
import FeedBack from "../Screens/FeedBack";
import Faq from "../Screens/Faq";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="GetLSDataLoading"
    >
      <Stack.Screen name="GetLSDataLoading" component={GetLSDataLoading} />
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="AuthPage" component={AuthPage} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="PinVerify" component={PinVerify} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="ResetSuccess" component={ResetSuccess} />
      <Stack.Screen name="SuccessSignUp" component={SuccessSignUp} />
      <Stack.Screen name="Account" component={Account} />
      <Stack.Screen name="Favorites" component={Favorites} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="AlbumScreen" component={AlbumScreen} />
      <Stack.Screen name="Flipbook" component={FlipBookScreen} />
      <Stack.Screen name="QRScanner" component={QRScanner} />
      <Stack.Screen name="FaceIDVerification" component={FaceIDVerification} />
      <Stack.Screen name="EventImages" component={EventImages} />
      <Stack.Screen name="ImageSelection" component={ImageSelection} />
      <Stack.Screen name="SeletEventImages" component={SeletEventImages} />
      <Stack.Screen name="EventFolders" component={EventFolders} />
      <Stack.Screen name="FaceSelfieCam" component={FaceSelfieCam} />
      <Stack.Screen name="ContactUs" component={ContactUs} />
      <Stack.Screen name="Policy" component={Policy} />
      <Stack.Screen name="FeedBack" component={FeedBack} />
      <Stack.Screen name="Faq" component={Faq} />
      <Stack.Screen
        name="SelectionEventFolders"
        component={SelectionEventFolders}
      />
      <Stack.Screen
        name="SelfieWithFaceDetector"
        component={SelfieWithFaceDetector}
      />

      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
