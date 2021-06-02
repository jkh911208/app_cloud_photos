import { Dimensions, FlatList, StyleSheet, View } from "react-native";
import { Header, Image } from "react-native-elements";
import React, { useState } from "react";

import GestureRecognizer from "react-native-swipe-gestures";
import JWT from "expo-jwt";
import { SECRET } from "@env";
import { SafeAreaView } from "react-navigation";
import { getMedia } from "../../database";

const imageDisplayWidth = Dimensions.get("window").width;

const SingleView = ({ navigation }) => {
  const { token, image, index } = navigation.state.params;
  const [renderImage, setRenderImage] = useState(image);

  const onSwipeDown = () => {
    navigation.goBack();
  };

  const onSwipeUp = () => {
    console.log("swipe up");
  };

  const renderItem = ({ item }) => {
    const imageHeight = (item.height * imageDisplayWidth) / item.width;
    return (
      <GestureRecognizer
        onSwipeDown={() => onSwipeDown()}
        onSwipeUp={() => onSwipeUp()}
      >
        <View style={styles.container}>
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
            }}
            resizeMode="contain"
            resizeMethod="auto"
          />
        </View>
      </GestureRecognizer>
    );
  };

  const onEndReached = async () => {
    console.log(
      "end reached single view",
      renderImage[renderImage.length - 1].creationTime
    );
    const result = await getMedia(
      renderImage[renderImage.length - 1].creationTime
    );
    console.log("result length", result.length);
    if (result.length > 0) {
      setRenderImage(renderImage.concat(result));
    }
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
      <SafeAreaView style={styles.container}>
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
          data={renderImage}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          keyExtractor={(item) => item.md5}
          onEndReached={onEndReached}
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
