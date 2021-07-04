import * as MediaLibrary from "expo-media-library";

import { Alert, Dimensions, FlatList, StyleSheet, View } from "react-native";
import { Button, Footer, FooterTab } from "native-base";
import { Icon, Image } from "react-native-elements";
import React, { useState } from "react";
import { deleteUsingMD5Async, getMedia } from "../../database";

import GestureRecognizer from "react-native-swipe-gestures";
import JWT from "expo-jwt";
import { SECRET } from "@env";
import { SafeAreaView } from "react-navigation";
import { Video } from "expo-av";
import api from "../../api/api";

const imageDisplayWidth = Dimensions.get("window").width;

const SingleView = ({ navigation }) => {
  const { token, image, index, setThumbImage } = navigation.state.params;
  const [renderImage, setRenderImage] = useState(image);
  const onSwipeDown = () => {
    navigation.goBack();
  };

  const onSwipeUp = () => {
    console.log("swipe up");
    console.log(renderImage[index])
  };

  const deleteAlert = async () =>
    new Promise((resolve) => {
      Alert.alert(
        "Delete Image",
        "Do you want to delete image from Cloud?",
        [
          {
            text: "Cancel",
            onPress: async () => {
              resolve(false);
            },
            style: "cancel",
          },
          {
            text: "Delete",
            onPress: async () => {
              resolve(true);
            },
          },
        ],
        { cancelable: false }
      );
    });

  const CustomFooter = ({ index }) => {
    return (
      <Footer>
        <FooterTab style={styles.footer}>
          <Button>
            <Icon name="share" color={"white"} type="feather" />
          </Button>
          <Button>
            <Icon name="info" color={"white"} type="feather" />
          </Button>
          <Button>
            <Icon
              name="trash"
              color={"white"}
              type="feather"
              onPress={async () => {
                console.log(renderImage[index]);
                const id = renderImage[index].local_id;
                const md5 = renderImage[index].md5;
                const cloudId = renderImage[index].cloud_id;
                var deleteResult = null;
                if (id != null) {
                  try {
                    deleteResult = await MediaLibrary.deleteAssetsAsync(id);
                  } catch {
                    deleteResult = false;
                  }
                } else {
                  deleteResult = await deleteAlert();
                }
                console.log("delete result", deleteResult);

                if (deleteResult) {
                  var temp = [];
                  for (let i = 0; i < renderImage.length; i++) {
                    if (i != index) {
                      temp.push(renderImage[i]);
                    }
                  }
                  setRenderImage(temp);
                  setThumbImage(temp);
                  deleteUsingMD5Async(md5);
                  if (cloudId) {
                    const config = {
                      headers: {
                        Authorization: `Bearer ${token}`,
                        "X-Custom-Auth": JWT.encode(
                          { timestamp: Date.now() },
                          SECRET
                        ),
                      },
                    };
                    // console.log(config);
                    // console.log(api);
                    api.delete(`/api/v1/photo/${cloudId}`, config);
                  }
                }
              }}
            />
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
    );
  };

  const renderItem = ({ item, index }) => {
    // console.log(`render item index of ${index}`)
    if (item.duration > 0) {
      return renderVideo(item, index);
    } else {
      return renderPhoto(item, index);
    }
  };

  const renderVideo = (item, index) => {
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
            onError={async () => {
              console.log("not able to load single view video");
              await deleteUsingMD5Async(item.md5);
              const media = await getMedia(Date.now(), renderImage.length);
              setRenderImage(media);
              setThumbImage(media);
            }}
          />
        </View>
        <CustomFooter index={index} />
      </GestureRecognizer>
    );
  };

  const renderPhoto = (item, index) => {
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
            onError={async () => {
              console.log("not able to load single view photo");
              await deleteUsingMD5Async(item.md5);
              const media = await getMedia(Date.now(), renderImage.length);
              setRenderImage(media);
              setThumbImage(media);
            }}
          />
        </View>
        <CustomFooter index={index} />
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
      const temp = renderImage.concat(result);
      setRenderImage(temp);
      setThumbImage(temp);
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
          // initialNumToRender={3}
          horizontal
          pagingEnabled
          data={renderImage}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          keyExtractor={(item) => item.md5}
          onEndReached={onEndReached}
          // updateCellsBatchingPeriod={2000}
        />
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
