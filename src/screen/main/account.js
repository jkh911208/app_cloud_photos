import * as SecureStore from "expo-secure-store";

import { Header, ListItem } from "react-native-elements";
import React, { useContext } from "react";

import { Context as AuthContext } from "../../context/AuthContext";
import { FlatList } from "react-native";
import { SafeAreaView } from "react-navigation";

const Account = ({ navigation }) => {
  const { signout } = useContext(AuthContext);

  const account_list = [
    {
      title: "Backup Finished",
      onPress: () => {
        navigation.navigate("BackupFinished");
      },
    },
    {
      title: "Need Backup",
      onPress: () => {
        navigation.navigate("NeedBackup");
      },
    },
    {
      title: "Loaded From Cloud",
      onPress: () => {
        SecureStore.getItemAsync("token").then((result) => {
          navigation.navigate("LoadedFromCloud", { token: result });
        });
      },
    },
    {
      title: "Sign Out",
      onPress: signout,
    },
  ];

  const renderItem = ({ item }) => {
    return (
      <ListItem bottomDivider onPress={item.onPress}>
        <ListItem.Content>
          <ListItem.Title>{item.title}</ListItem.Title>
        </ListItem.Content>
      </ListItem>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#939597" }}>
      <Header
        statusBarProps={{ backgroundColor: "#939597" }}
        centerComponent={{
          text: "Account",
          style: { color: "#fff", fontSize: 25 },
        }}
        containerStyle={{
          backgroundColor: "#939597",
        }}
      />
      <FlatList
        data={account_list}
        renderItem={renderItem}
        keyExtractor={(item) => item.title}
      />
    </SafeAreaView>
  );
};

export default Account;
