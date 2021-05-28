import { Button, Input, Text } from "react-native-elements";
import React, { useContext, useEffect, useState } from "react";

import { Context as AuthContext } from "../../context/AuthContext";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { StyleSheet } from "react-native";
import updateLocalPhotoLibrary from "../../compoent/updateLocalPhotoLibrary";

const SignUp = ({ navigation }) => {
  const { state, signup } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const runUseEffectAsync = async () => {
      await updateLocalPhotoLibrary();
    }
    runUseEffectAsync()
  }, []);

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      resetScrollToCoords={{ x: 0, y: 0 }}
      scrollEnabled={true}
    >
      <Input
        label="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Input
        label="Password"
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry
      />
      <Input
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry
      />
      {state.error ? <Text style={styles.error}>{state.error}</Text> : null}
      <Button
        title="Sign Up"
        onPress={() => signup({ username, password, confirmPassword })}
        buttonStyle={{
          width: 200,
          height: 40,
          borderRadius: 25,
          backgroundColor: "#939597",
        }}
      />
      <Text
        style={styles.signInText}
        onPress={() => navigation.navigate("Signin")}
      >
        Already have account? Sign in
      </Text>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  error: {
    marginBottom: 25,
  },
  container: {
    flex: 1,
    backgroundColor: "#F5dF4D",
    alignItems: "center",
    justifyContent: "center",
  },
  signInText: {
    marginTop: 25,
    color: "#939597",
  },
});

export default SignUp;
