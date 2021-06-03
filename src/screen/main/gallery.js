import * as MediaLibrary from "expo-media-library";
import * as SecureStore from "expo-secure-store";

import { AppState, Dimensions, FlatList } from "react-native";
import { Header, Image } from "react-native-elements";
import React, { useEffect, useState } from "react";

import JWT from "expo-jwt";
import { SECRET } from "@env";
import { SafeAreaView } from "react-navigation";
import getCloudData from "../../compoent/getCloudData";
import { getMedia } from "../../database";
import updateLocalPhotoLibrary from "../../compoent/updateLocalPhotoLibrary";
import uploadPhotoToCloud from "../../compoent/uploadPhotoToCloud";

const Gallery = ({ navigation }) => {
  const thumbnailWidth = Dimensions.get("window").width / 4;
  const [refreshing, setRefreshing] = useState(false);
  const [image, setImage] = useState([]);
  const [token, setToken] = useState(null);

  useEffect(() => {
    SecureStore.getItemAsync("token").then((result) => {
      setToken(result);
    });
    runInitSetup();
  }, []);

  const runInitSetup = async () => {
    const result = await getMedia(Date.now());
    if (result.length == 0) {
      await updateLocalPhotoLibrary();
      return runInitSetup();
    }
    setImage(result);
    await uploadPhotoToCloud();
    getCloudData();
  };

  useEffect(() => {
    AppState.addEventListener("change", _handleAppStateChange);

    MediaLibrary.addListener((event) => {
      changeListener();
    });

    return () => {
      MediaLibrary.removeAllListeners();
      AppState.removeEventListener("change", _handleAppStateChange);
    };
  }, []);

  const _handleAppStateChange = (nextAppState) => {
    if (nextAppState === "active") {
      changeListener();
    }
  };

  const changeListener = async () => {
    await updateLocalPhotoLibrary();
    await getCloudData();
    const result = await getMedia(Date.now());
    setImage(result);
    await uploadPhotoToCloud();
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
            index,
          });
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
    const result = await getMedia(image[image.length - 1].creationTime);
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
    </SafeAreaView>
  );
};

export default Gallery;
