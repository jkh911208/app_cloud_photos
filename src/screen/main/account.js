import * as SecureStore from "expo-secure-store";

import { FlatList, StyleSheet, View } from "react-native";
import { Header, ListItem, Switch, Text } from "react-native-elements";
import React, { useContext, useEffect, useState } from "react";

import { Context as AuthContext } from "../../context/AuthContext";
import { SafeAreaView } from "react-navigation";

const Account = ({ navigation }) => {
  const { signout } = useContext(AuthContext);
  const [wifiOnly, setWifiOnly] = useState();

  useEffect(() => {
    SecureStore.getItemAsync("wifiOnly").then((result) => {
      const currentWifiOnly = result == "false" ? false : true;
      setWifiOnly(currentWifiOnly);
    });
  }, []);

  const toggleWifiOnly = () => {
    const newValue = !wifiOnly;
    console.log(newValue);
    SecureStore.setItemAsync("wifiOnly", newValue.toString()).then((result) => {
      setWifiOnly((previousState) => !previousState);
    });
  };

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
      <View style={styles.switch_view}>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={wifiOnly ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleWifiOnly}
          value={wifiOnly}
          style={{ marginRight: 15 }}
        />
        <Text>{`Upload Photos on Wifi Only`}</Text>
      </View>
      <FlatList
        data={account_list}
        renderItem={renderItem}
        keyExtractor={(item) => item.title}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  switch_view: {
    flexDirection: "row",
    marginVertical: 10,
    marginLeft: 5,
  },
});

export default Account;
