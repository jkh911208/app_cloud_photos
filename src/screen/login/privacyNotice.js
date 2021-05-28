import { Button, Text } from "react-native-elements";
import { Linking, StyleSheet } from "react-native";

import React from "react";
import { SafeAreaView } from "react-navigation";

const PrivacyNotice = ({ navigation }) => {
  return (
    <SafeAreaView
    style={styles.container}>
      <Text h2>Privacy Notice</Text>
      <Text style={styles.bodyText}>Cloud Photos will collect user photos and upload to our server. Photos will not be automatically removed until further user request.</Text>
      <Button
        title="Privacy Policy"
        onPress={() => Linking.openURL('https://www.cloudphotos.net/#/privacy')}
        buttonStyle={{
          width: 250,
          height: 50,
          borderRadius: 15,
          backgroundColor: "#939597",
          marginBottom:15
        }}
      />
      <Button
        title="Accept & continue"
        onPress={() => navigation.navigate("Signup")}
        buttonStyle={{
          width: 250,
          height: 60,
          borderRadius: 15,
          backgroundColor: "#4189d6",
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5dF4D",
    alignItems: "center",
    justifyContent: "center",
  },
  bodyText: {
    margin: 60,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default PrivacyNotice;
