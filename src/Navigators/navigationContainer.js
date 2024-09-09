import 'react-native-gesture-handler';
import React from 'react';
import { LogBox } from 'react-native';
import { useSelector, } from 'react-redux';
import { TransitionPresets } from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { enableScreens } from 'react-native-screens';
import SplashScreen from '../Pages/SplashScreen';
import LocationAllowScreen from '../Pages/LocationAllowScreen';
import SignINScreen from '../Pages/SignINScreen';
import SignUpScreen from '../Pages/SignUpScreen';
import OrganizeParty from '../Pages/OrganizeParty';
import DiscoverPage from '../Pages/BottomTabs/DiscoverPage';
import SettingPref from '../Pages/SettingPref';
import OtpVerify from '../Pages/OtpVerify';
import PlannedParties from '../Pages/PlannedParties';
import PreviousParties from '../Pages/PreviousParties';
import FavouriteParties from '../Pages/FavouriteParties';
import ViewSearchResultPage from '../Pages/ViewSearchResultPage';
import AllListingParty from '../Pages/AllListingParty';
import ChangePassword from '../Pages/ChangePassword';
import ForgotPassword1 from '../Pages/ForgotPassword1';
import ForgotPassword2 from '../Pages/ForgotPassword2';
import ForgotPassword3 from '../Pages/ForgotPassword3';
import ForgotPassword4 from '../Pages/ForgotPassword4';
import OrganizePartyStartPage from '../Pages/OrganizePartyStartPage';
import MyPartyNewDesign from '../Pages/MyPartyNewDesign';
import VendorDetail from '../Pages/VendorDetail';
import ViewGalleryVendor from '../Pages/ViewGalleryVendor';
import AllReviewPage from '../Pages/AllReviewPage';
import CheckoutPageDetail from '../Pages/CheckoutPageDetail';
import PaymentSuccessfulPAge from '../Pages/PaymentSuccessfulPAge';
import WebviewCall from '../Pages/WebviewCall';
import ProfileInfo from '../Pages/ProfileInfo';
import NotificationListPage from '../Pages/NotificationListPage';
import NotificationAPIPage from '../Pages/NotificationAPIPage';
import CardDetailsList from '../Pages/CardDetailsList';

enableScreens(false);

const splashStack = createNativeStackNavigator();
const introStack = createNativeStackNavigator();
const authStack = createNativeStackNavigator();
const appStack = createNativeStackNavigator();

/***
 * Splash Stack
 */
const Splash = () => {
  return (
    <splashStack.Navigator screenOptions={{
      headerShown: false,
      ...TransitionPresets.SlideFromRightIOS
    }} >
      <splashStack.Screen name="Splash" component={SplashScreen} />
    </splashStack.Navigator>
  )
};

/***
 * Location Stack
 */
const Intro = () => {
  return (
    <introStack.Navigator screenOptions={{
      headerShown: false,
      ...TransitionPresets.SlideFromRightIOS
    }}>
      <introStack.Screen name="Intro" component={LocationAllowScreen} />
    </introStack.Navigator>
  )
};

/***
 * Auth Stack
*/
const Auth = ({ ...props }) => {
  return (
    <authStack.Navigator
      name="auth"
      initialRouteName={props.from == "signUp" ? "signup" : "signin"}
      screenOptions={{ headerShown: false, ...TransitionPresets.SlideFromRightIOS }}>
      <authStack.Screen name="signin" component={SignINScreen} />
      <authStack.Screen name="signup" component={SignUpScreen} />
      <authStack.Screen name="OtpVerify" component={OtpVerify} />
      <authStack.Screen name="OrganizeParty" component={OrganizeParty} />
      <authStack.Screen name="ForgotPassword1" component={ForgotPassword1} />
      <authStack.Screen name="ForgotPassword2" component={ForgotPassword2} />
      <authStack.Screen name="ForgotPassword3" component={ForgotPassword3} />
      <authStack.Screen name="ForgotPassword4" component={ForgotPassword4} />
      <authStack.Screen name="ChangePassword" component={ChangePassword} />
      <authStack.Screen name="SettingPref" component={SettingPref} />

    </authStack.Navigator>
  )
};


/***
 * App Stack
*/
const AppStack = () => {
  return (
    <appStack.Navigator name="appStack" screenOptions={{
      headerShown: false,
      ...TransitionPresets.SlideFromRightIOS
    }} initialRouteName="DiscoverPage" >
      <appStack.Screen name="discoverpage" component={DiscoverPage} />
      <appStack.Screen name="PlannedParties" component={PlannedParties} />
      <appStack.Screen name="PreviousParties" component={PreviousParties} />
      <appStack.Screen name="FavouriteParties" component={FavouriteParties} />
      <appStack.Screen name="ViewSearchResultPage" component={ViewSearchResultPage} />
      <appStack.Screen name="AllListingParty" component={AllListingParty} />
      <appStack.Screen name="OrganizePartyStartPage" component={OrganizePartyStartPage} />
      <appStack.Screen name="MyPartyNewDesign" component={MyPartyNewDesign} />
      <appStack.Screen name="VendorDetail" component={VendorDetail} />
      <appStack.Screen name="ViewGalleryVendor" component={ViewGalleryVendor} />
      <appStack.Screen name="AllReviewPage" component={AllReviewPage} />
      <appStack.Screen name="CheckoutPageDetail" component={CheckoutPageDetail} />
      <appStack.Screen name="PaymentSuccessfulPAge" component={PaymentSuccessfulPAge} />
      <appStack.Screen name="WebviewCall" component={WebviewCall} />
      <appStack.Screen name="ProfileInfo" component={ProfileInfo} />
      <appStack.Screen name="NotificationListPage" component={NotificationListPage} />
      <appStack.Screen name="NotificationAPIPage" component={NotificationAPIPage} />
      <appStack.Screen name="CardDetailsList" component={CardDetailsList} />
    </appStack.Navigator>
  )
};

LogBox.ignoreAllLogs(true)

const AppNavigator = () => {
  const appState = useSelector(state => state.app);
  return (
    appState.appStatus ?
      appState.appStatus.status == 'splash' ?
        <Splash />
        :
        appState.appStatus.status == 'intro' ?
          <Intro />
          :
          appState.appStatus.status == 'auth' ?
            <Auth from={appState.appStatus.from} />
            :
            <AppStack />
      :
      <Auth from={"signin"} />
  );
};

export default AppNavigator;