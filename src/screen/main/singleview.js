import { Dimensions, FlatList, StyleSheet } from "react-native";
import { Header, Image } from "react-native-elements";

import GestureRecognizer from "react-native-swipe-gestures";
import JWT from "expo-jwt";
import React from "react";
import { SECRET } from "@env";
import { SafeAreaView } from "react-navigation";

const imageDisplayWidth = Dimensions.get("window").width;

const SingleView = ({ navigation }) => {
  const { token, image, index } = navigation.state.params;

  const onSwipeDown = () => {
    navigation.goBack();
  };

  const onSwipeUp = () => {
    console.log("swipe up");
  };

  const renderItem = ({ item }) => {
    const imageHeight = (item.height * imageDisplayWidth) / item.width;
    var marginTop = 0;
    // console.log("window height", Dimensions.get("window").height)
    // console.log("image height", imageHeight)
    if (imageDisplayWidth > imageHeight) {
      marginTop = Math.floor(
        (Dimensions.get("window").height - imageHeight) / 4
      );
    }
    return (
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
            height: imageHeight,
            marginTop,
          }}
        />
      </GestureRecognizer>
    );
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
        <FlatList
          getItemLayout={(data, index) => {
            return {
              length: imageDisplayWidth,
              index,
              offset: imageDisplayWidth * index,
            };
          }}
          initialScrollIndex={index}
          initialNumToRender={1}
          horizontal
          pagingEnabled
          data={image}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          keyExtractor={(item) => item.md5}
        />
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
