import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";

import SignIn from "./src/screen/login/signIn";
import SignUp from "./src/screen/login/signUp";
import Account from "./src/screen/main/account";
import Gallery from "./src/screen/main/gallery";
import Loading from "./src/screen/login/loading";
import SingleView from "./src/screen/main/singleview";
import BackupFinished from "./src/screen/account/backupFinished";
import LoadedFromCloud from "./src/screen/account/loadedFromCloud";
import NeedBackup from "./src/screen/account/needBackup";

import { Provider as AuthProvider } from "./src/context/AuthContext";

import { setNavigator } from "./src/navigationRef";

const switchNavigator = createSwitchNavigator({
  loading: Loading,
  loginFlow: createStackNavigator({
    Signup: SignUp,
    Signin: SignIn,
  }),
  mainFlow: createBottomTabNavigator({
    Media: createStackNavigator({
      Gallery: Gallery,
      SingleView: SingleView,
    }),
    Account: createStackNavigator({
      Account: Account,
      BackupFinished: BackupFinished,
      LoadedFromCloud: LoadedFromCloud,
      NeedBackup: NeedBackup,
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