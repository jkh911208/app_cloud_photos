import React, { useEffect } from "react";
import { Dimensions, StyleSheet, Platform } from "react-native";
import { SafeAreaView } from "react-navigation";
import { Image } from "react-native-elements";
import GestureRecognizer from "react-native-swipe-gestures";
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
            },
          }}
          style={{
            width: imageDisplayWidth,
            height: (item.height * imageDisplayWidth) / item.width,
          }}
        />
      </GestureRecognizer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
export default SingleView;
