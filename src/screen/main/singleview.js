import { Dimensions, Platform, StyleSheet } from "react-native";
import { Header, Image } from "react-native-elements";
import React, { useEffect } from "react";

import GestureRecognizer from "react-native-swipe-gestures";
import JWT from "expo-jwt";
import { SECRET } from "@env";
import { SafeAreaView } from "react-navigation";

const imageDisplayWidth = Dimensions.get("window").width;
// import * as MediaLibrary from "expo-media-library";
// import * as FileSystem from "expo-file-system";

const SingleView = ({ navigation }) => {
  const { item, token } = navigation.state.params;
  // console.log(item)

  // useEffect(() => {
  //   const runAsyncUseEffect = async () => {
  //     console.log(item)
  //     let fsInfo = await FileSystem.getInfoAsync(item.uri, {
  //       md5: true,
  //       size: true,
  //     });
  //     let assetInfo = await MediaLibrary.getAssetInfoAsync(item.local_id);
  //     console.log(assetInfo);
  //     console.log(fsInfo);
  //   };
  //   runAsyncUseEffect();
  // });

  const onSwipeDown = () => {
    navigation.goBack();
  };

  const onSwipeUp = () => {
    console.log("swipe up");
  };

  return (
    <>
      <Header
        statusBarProps={{ backgroundColor: "black" }}
        leftComponent={{
          icon: "chevron-left",
          color: "#fff",
          size: 25,
          onPress: () => {
            navigation.goBack();
          },
        }}
        centerComponent={{
          text: "Cloud Photos",
          style: { color: "#fff", fontSize: 25 },
        }}
        containerStyle={{
          backgroundColor: "black",
        }}
      />
      <SafeAreaView
        style={styles.container}
        forceInset={{ top: "always", bottom: "always" }}
      >
        <GestureRecognizer
          onSwipeDown={() => onSwipeDown()}
          onSwipeUp={() => onSwipeUp()}
        >
          <Image
            source={{
              uri: item.uri,
              cache: "force-cache",
              headers: {
                Authorization: `Bearer ${token}`,
                "X-Custom-Auth": JWT.encode({ timestamp: Date.now() }, SECRET),
              },
            }}
            style={{
              width: imageDisplayWidth,
              height: (item.height * imageDisplayWidth) / item.width,
            }}
          />
        </GestureRecognizer>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
  },
});
export default SingleView;
