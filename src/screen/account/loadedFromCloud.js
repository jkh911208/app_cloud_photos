import React, { useState, useEffect } from "react";
import { FlatList, Dimensions } from "react-native";
import { SafeAreaView } from "react-navigation";
import { Image, Text } from "react-native-elements";
import { getLoadedFromCloud } from "../../database";

const thumbnailWidth = Dimensions.get("window").width / 4;

function LoadedFromCloud({ navigation }) {
  const [list, setList] = useState([]);
  const { token } = navigation.state.params;

  useEffect(() => {
    getLoadedFromCloud(setList);
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
      />
    );
  };

  return (
    <SafeAreaView>
      <Text>Loaded from Cloud, not stored in this device</Text>
      <FlatList
        horizontal={false}
        numColumns={4}
        data={list}
        renderItem={renderItem}
        keyExtractor={(item) => item.md5}
      />
    </SafeAreaView>
  );
}

export default LoadedFromCloud;
