import * as SecureStore from "expo-secure-store";

import { AppState, Dimensions, FlatList, View } from "react-native";
import { Header, Image, Text } from "react-native-elements";
import React, { useEffect, useState } from "react";
import { deleteUsingMD5Async, getMedia } from "../../database";

import JWT from "expo-jwt";
import { SECRET } from "@env";
import { SafeAreaView } from "react-navigation";
import { Spinner } from "native-base";
import getCloudData from "../../compoent/getCloudData";
import updateLocalPhotoLibrary from "../../compoent/updateLocalPhotoLibrary";
import uploadPhotoToCloud from "../../compoent/uploadPhotoToCloud";

const Gallery = ({ navigation }) => {
  const thumbnailWidth = Dimensions.get("window").width / 4;
  const [refreshing, setRefreshing] = useState(false);
  const [image, setNewImage] = useState([]);
  const [token, setToken] = useState(null);
  var appState = AppState.currentState;
  var trackImage = image;

  const setImage = (data) => {
    setNewImage(data);
    trackImage = data;
  };

  useEffect(() => {
    SecureStore.getItemAsync("token").then((result) => {
      setToken(result);
    });
    runInitSetup();
  }, []);

  const runInitSetup = async () => {
    var result = await getMedia(Date.now());
    if (result.length == 0) {
      await updateLocalPhotoLibrary(0);
      result = await getMedia(Date.now());
    }
    setImage(result);
    await uploadPhotoToCloud();
    getCloudData();
  };

  useEffect(() => {
    AppState.addEventListener("change", _handleAppStateChange);

    return () => {
      AppState.removeEventListener("change", _handleAppStateChange);
    };
  }, []);

  const _handleAppStateChange = (nextAppState) => {
    console.log("app state changed", appState, nextAppState);
    if (appState === "background" && nextAppState === "active") {
      console.log("changed from background to active");
      changeListener();
    }
    appState = nextAppState;
  };

  const changeListener = async () => {
    if (AppState.currentState == "active") {
      console.log("app state changed to active");
      console.log("track image type", typeof trackImage)
      const updated = await updateLocalPhotoLibrary(
        trackImage[trackImage.length - 1].creationTime
      );
      console.log("local library updated", updated);
      if (updated) {
        var result = await getMedia(
          Date.now(),
          image.length > 0 ? image.length : 100
        );
        setImage(result);
      }
      await getCloudData();
      result = await getMedia(
        Date.now(),
        image.length > 0 ? image.length : 100
      );
      setImage(result);
      await uploadPhotoToCloud();
    } else {
      console.log("app state", AppState.currentState);
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      <Image
        source={{
          uri: item.thumbnail_uri,
          cache: "force-cache",
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Custom-Auth": JWT.encode({ timestamp: Date.now() }, SECRET),
          },
        }}
        style={{ width: thumbnailWidth, height: thumbnailWidth, margin: 1 }}
        onPress={() => {
          console.log("index", index);
          navigation.navigate("SingleView", {
            image,
            token,
            initIndex: index,
            setThumbImage: setImage,
          });
        }}
        onError={async () => {
          if (token) {
            console.log("not able to load image in gallery view");
            await deleteUsingMD5Async(item.md5);
            setImage(await getMedia(Date.now(), image.length));
          }
        }}
      />
    );
  };

  const reload = async () => {
    setRefreshing(true);
    console.log("reload");
    await changeListener();
    setRefreshing(false);
  };

  const onEndReached = async () => {
    console.log("end reached gallery");
    const result = await getMedia(
      image[image.length - 1].creationTime,
      image.length
    );
    if (result.length > 0) {
      setImage(image.concat(result));
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#939597" }}>
      <Header
        statusBarProps={{ backgroundColor: "#939597" }}
        centerComponent={{
          text: "Cloud Photos",
          style: { color: "#fff", fontSize: 25 },
        }}
        containerStyle={{
          backgroundColor: "#939597",
        }}
      />
      {image.length > 0 ? (
        <FlatList
          horizontal={false}
          numColumns={4}
          data={image}
          renderItem={renderItem}
          keyExtractor={(item) => item.md5}
          onRefresh={reload}
          refreshing={refreshing}
          onEndReached={onEndReached}
        />
      ) : (
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={{ color: "white", fontSize: 30 }}>
            Updating Database
          </Text>
          <Spinner />
        </View>
      )}
    </SafeAreaView>
  );
};

export default Gallery;
