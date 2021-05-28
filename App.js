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
