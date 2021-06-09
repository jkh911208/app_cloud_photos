import { Button, Footer, FooterTab } from "native-base";
import { Dimensions, FlatList, StyleSheet, View } from "react-native";
import { Icon, Image } from "react-native-elements";
import React, { useState } from "react";

import GestureRecognizer from "react-native-swipe-gestures";
import JWT from "expo-jwt";
import { SECRET } from "@env";
import { SafeAreaView } from "react-navigation";
import { Video } from "expo-av";
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

  const renderItem = ({ item, index }) => {
    if (item.duration > 0) {
      return renderVideo(item);
    } else {
      return renderPhoto(item);
    }
  };

  const renderVideo = (item) => {
    const imageHeight = (item.height * imageDisplayWidth) / item.width;
    return (
      <GestureRecognizer
        onSwipeDown={() => onSwipeDown()}
        onSwipeUp={() => onSwipeUp()}
      >
        <View style={styles.container}>
          <Video
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
            useNativeControls
            resizeMode="contain"
            resizeMethod="auto"
          />
        </View>
      </GestureRecognizer>
    );
  };

  const renderPhoto = (item) => {
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
          initialNumToRender={3}
          horizontal
          pagingEnabled
          data={renderImage}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          keyExtractor={(item) => item.md5}
          onEndReached={onEndReached}
          updateCellsBatchingPeriod={2000}
        />
        <Footer>
          <FooterTab style={styles.footer}>
            <Button>
              <Icon name="share" color={"white"} type="feather" />
            </Button>
            <Button>
              <Icon name="info" color={"white"} type="feather" />
            </Button>
            <Button>
              <Icon name="trash" color={"white"} type="feather" />
            </Button>
            <Button>
              <Icon
                name="chevron-left"
                color={"white"}
                onPress={() => {
                  navigation.goBack();
                }}
              />
            </Button>
          </FooterTab>
        </Footer>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  footer: {
    backgroundColor: "black",
  },
  container: {
    flex: 1,
    alignContent: "space-between",
    justifyContent: "space-evenly",
    backgroundColor: "black",
  },
});
export default SingleView;
