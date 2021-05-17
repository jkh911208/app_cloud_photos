import * as MediaLibrary from "expo-media-library";
import { insertMedia } from "../database";
import * as FileSystem from "expo-file-system";

const updateLocalPhotoLibrary = async () => {
  console.log("updateLocalPhotoLibrary");
  // check permission
  const permission = await MediaLibrary.getPermissionsAsync();
  if (!permission.granted) {
    // get permission
    const permission = await MediaLibrary.requestPermissionsAsync();
  }

  var options = {
    first: 50,
    sortBy: [["creationTime", false]],
    createdBefore: Date.now(),
  };

  while (true) {
    var asset = await MediaLibrary.getAssetsAsync(options);
    // console.log(asset.assets);

    for (let i = 0; i < asset.assets.length; i++) {
      let fsInfo = await FileSystem.getInfoAsync(asset.assets[i].uri, {
        md5: true,
      });
      // console.log(fsInfo);
      // console.log("updatel local photo library", asset.assets[i])
      await insertMedia(
        asset.assets[i].id,
        null,
        asset.assets[i].width,
        asset.assets[i].height,
        asset.assets[i].uri,
        asset.assets[i].uri,
        asset.assets[i].creationTime,
        fsInfo.md5
      );
    }
    if (!asset.hasNextPage) {
      break;
    }
    options.createdBefore = asset.assets[asset.assets.length - 1].creationTime;
  }
};

export default updateLocalPhotoLibrary;
