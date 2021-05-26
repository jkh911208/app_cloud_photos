import React, { useState, useEffect } from "react";
import { FlatList, Dimensions } from "react-native";
import { SafeAreaView } from "react-navigation";
import { Image, Text } from "react-native-elements";
import { getNeedBackup } from "../../database";

const thumbnailWidth = Dimensions.get("window").width / 4;

function NeedBackup() {
  const [list, setList] = useState([]);

  useEffect(() => {
    getNeedBackup(setList);
  },[])

  const renderItem = ({ item }) => {
    return (
      <Image
        source={{
          uri: item.thumbnail_uri,
        }}
        style={{ width: thumbnailWidth, height: thumbnailWidth }}
      />
    );
  };

  return (
    <SafeAreaView>
      <Text>Need backup, Only HEIC and JPEG/JPG supported</Text>
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

export default NeedBackup;
