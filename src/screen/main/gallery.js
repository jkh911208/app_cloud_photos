import React, { useState, useEffect } from "react";
import { Dimensions, FlatList, AppState } from "react-native";
import { SafeAreaView } from "react-navigation";
import { Image } from "react-native-elements";
import { getMedia } from "../../database";
import updateLocalPhotoLibrary from "../../compoent/updateLocalPhotoLibrary";
import * as MediaLibrary from "expo-media-library";
import uploadPhotoToCloud from "../../compoent/uploadPhotoToCloud";
import getCloudData from "../../compoent/getCloudData";
import * as SecureStore from "expo-secure-store";
const thumbnailWidth = Dimensions.get("window").width / 4;

const Gallery = ({ navigation }) => {
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

  return (
    <SafeAreaView>
      <FlatList
        horizontal={false}
        numColumns={4}
        data={image}
        renderItem={renderItem}
        keyExtractor={(item) => item.md5}
      />
    </SafeAreaView>
  );
};

export default Gallery;
