import React, { useState, useEffect } from "react";
import { Dimensions, FlatList } from "react-native";
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
  SecureStore.getItemAsync("token").then((result) => {
    console.log("token", result);
    return setToken(result);
  });

  useEffect(() => {
    getMedia(setImage);
    // listener to change in library
    MediaLibrary.addListener((event) => {
      const runAsync = async () => {
        await updateLocalPhotoLibrary();
        await uploadPhotoToCloud();
        await getMedia(setImage);
      };
      runAsync();
    });

    uploadPhotoToCloud();
    let id = setInterval(() => {
      console.log("start interval")
      getCloudData();
      console.log("loaded all cloud data")
      getMedia(setImage);
      console.log("image state updated")
    }, 10000);
    return () => clearInterval(id);

    
  }, []);

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
            imageList: image,
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
