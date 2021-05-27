import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as Network from "expo-network";
import * as SecureStore from "expo-secure-store";

import { db, updateCloudID } from "../database";

import { API_URL } from "@env";
import { FileSystemUploadType } from "expo-file-system";

const uploadPhotoToCloud = async () => {
  const networkType = await Network.getNetworkStateAsync();
  if (networkType.type != Network.NetworkStateType.WIFI) {
    console.log("connect to wifi to upload");
    return null;
  } else {
    console.log("upload photo to cloud");
  }
  const token = await SecureStore.getItemAsync("token");

  if (token) {
    console.log("found token for upload");
  } else {
    console.log("need login to upload");
    return null;
  }

  // console.log(token);
  const needUpload = await getNeedUpload();
  console.log(`found ${needUpload.length} media to upload`);
  const headers = {
    accept: "application/json",
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${token}`,
  };

  // upload file to cloud
  for (let i = 0; i < needUpload.length; i++) {
    const image_data = await MediaLibrary.getAssetInfoAsync(
      needUpload[i].local_id
    );

    let fsInfo = await FileSystem.getInfoAsync(needUpload[i].uri, {
      md5: true,
      size: true,
    });

    const options = {
      headers,
      httpMethod: "POST",
      uploadType: FileSystemUploadType.MULTIPART,
      fieldName: "file",
      parameters: {
        md5: fsInfo.md5,
        size: fsInfo.size.toString(),
        creationTime: image_data.creationTime.toString(),
        height: image_data.height.toString(),
        width: image_data.width.toString(),
      },
    };

    const response = await FileSystem.uploadAsync(
      `${API_URL}/api/v1/photo/`,
      image_data.localUri,
      options
    );

    // if response is 201 update cloud_id field
    if (response.status == 201) {
      var obj = JSON.parse(response.body);
      // console.log(obj)
      await updateCloudID(fsInfo.md5, obj.id);
    }
  }
};

const getNeedUpload = async () => {
  const sevenDaysAgo = Date.now() - 604800000;
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM media WHERE cloud_id IS NULL AND creationTime > ?;`,
        [sevenDaysAgo],
        (tx, result) => {
          // console.log(result.rows.length);
          resolve(result.rows._array);
        }
      );
    });
  });
};

export default uploadPhotoToCloud;
