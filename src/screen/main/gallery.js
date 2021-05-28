import * as MediaLibrary from "expo-media-library";
import * as SecureStore from "expo-secure-store";

import { AppState, Dimensions, FlatList } from "react-native";
import React, { useEffect, useState } from "react";

import { Image } from "react-native-elements";
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
    await getMedia(setImage);
    await uploadPhotoToCloud();
    await getCloudData();
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
    await getMedia(setImage);
    await uploadPhotoToCloud();
    await getCloudData();
  };

  const renderItem = ({ item }) => {
    return (
      <Image
        source={{
          uri: item.thumbnail_uri,
          cache: "force-cache",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }}
        style={{ width: thumbnailWidth, height: thumbnailWidth }}
        onPress={() =>
          navigation.navigate("SingleView", {
            item: item,
            // imageList: image,
            token: token,
          })
        }
      />
    );
  };

  const reload = async () => {
    setRefreshing(true);
    console.log("reload");
    await changeListener();
    setRefreshing(false);
  };

  return (
    <SafeAreaView>
      <FlatList
        horizontal={false}
        numColumns={4}
        data={image}
        renderItem={renderItem}
        keyExtractor={(item) => item.md5}
        onRefresh={reload}
        refreshing={refreshing}
      />
    </SafeAreaView>
  );
};

export default Gallery;
