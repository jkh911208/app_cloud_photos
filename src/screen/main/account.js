import React, { useContext } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-navigation";
import { Button } from "react-native-elements";
import { Context as AuthContext } from "../../context/AuthContext";
import * as SecureStore from "expo-secure-store";

const Account = ({ navigation }) => {
  const { signout } = useContext(AuthContext);
  return (
    <SafeAreaView>
      <Button
        title="Backup Finished"
        onPress={() => navigation.navigate("BackupFinished")}
        buttonStyle={styles.button}
      />
      <Button
        title="Need Backup"
        onPress={() => navigation.navigate("NeedBackup")}
        buttonStyle={styles.button}
      />
      <Button
        title="Loaded From Cloud"
        onPress={() => {
          SecureStore.getItemAsync("token").then((result) => {
            navigation.navigate("LoadedFromCloud", { token: result });
          });
        }}
        buttonStyle={styles.button}
      />
      <Button title="Sign Out" onPress={signout} buttonStyle={styles.button} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  button: {
    margin: 5,
    borderRadius: 15,
    backgroundColor: "#F5dF4D",
  },
});

export default Account;
