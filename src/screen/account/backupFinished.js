import React, { useState, useEffect } from "react";
import { FlatList, Dimensions } from "react-native";
import { SafeAreaView } from "react-navigation";
import { Image, Text } from "react-native-elements";
import { getBackupFinished } from "../../database";

const thumbnailWidth = Dimensions.get("window").width / 4;

function BackupFinished() {
  const [list, setList] = useState([]);

  useEffect(() => {
    // console.log("start use effect");
    getBackupFinished(setList);
  }, []);

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
      <Text>Back up finished</Text>
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

export default BackupFinished;
