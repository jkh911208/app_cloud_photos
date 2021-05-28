import { createAppContainer, createSwitchNavigator } from "react-navigation";

import Account from "./src/screen/main/account";
import { Provider as AuthProvider } from "./src/context/AuthContext";
import BackupFinished from "./src/screen/account/backupFinished";
import Gallery from "./src/screen/main/gallery";
import LoadedFromCloud from "./src/screen/account/loadedFromCloud";
import Loading from "./src/screen/login/loading";
import NeedBackup from "./src/screen/account/needBackup";
import PrivacyNotice from "./src/screen/login/privacyNotice";
import React from "react";
import SignIn from "./src/screen/login/signIn";
import SignUp from "./src/screen/login/signUp";
import SingleView from "./src/screen/main/singleview";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { createStackNavigator } from "react-navigation-stack";
import { setNavigator } from "./src/navigationRef";

const switchNavigator = createSwitchNavigator({
  loading: Loading,
  privacyNotice: PrivacyNotice,
  loginFlow: createStackNavigator({
    Signup: {
      screen: SignUp,
      navigationOptions: {
        headerShown: false,
      },
    },
    Signin: {
      screen: SignIn,
      navigationOptions: {
        headerShown: false,
      },
    },
  }),
  mainFlow: createBottomTabNavigator({
    Media: createStackNavigator({
      Gallery: {
        screen: Gallery,
        navigationOptions: {
          headerShown: false,
        },
      },
      SingleView: {
        screen: SingleView,
        navigationOptions: {
          headerShown: false,
        },
      },
    }),
    Account: createStackNavigator({
      Account: {
        screen: Account,
        navigationOptions: {
          headerShown: false,
        },
      },
      BackupFinished: {
        screen: BackupFinished,
        navigationOptions: {
          headerShown: false,
        },
      },
      LoadedFromCloud: {
        screen: LoadedFromCloud,
        navigationOptions: {
          headerShown: false,
        },
      },
      NeedBackup: {
        screen: NeedBackup,
        navigationOptions: {
          headerShown: false,
        },
      },
    }),
  }),
});

const App = createAppContainer(switchNavigator);

export default () => {
  return (
    <AuthProvider>
      <App
        ref={(navigator) => {
          setNavigator(navigator);
        }}
      />
    </AuthProvider>
  );
};
