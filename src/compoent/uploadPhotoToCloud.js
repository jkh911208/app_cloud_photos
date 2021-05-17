import * as SecureStore from "expo-secure-store";
import * as MediaLibrary from "expo-media-library";
import { updateCloudID, db } from "../database";
import * as FileSystem from "expo-file-system";
import { FileSystemUploadType } from "expo-file-system";
import * as Network from "expo-network";
import {API_URL} from "@env";

const uploadPhotoToCloud = async () => {
  const networkType = await Network.getNetworkStateAsync();
  if (networkType.type != Network.NetworkStateType.WIFI) {
    console.log("connect to wifi to upload");
    return null;
  } else {
    console.log("upload photo to cloud");
  }
  const token = await SecureStore.getItemAsync("token");
  const sevenDaysAgo = Date.now() - 604800000;

  // console.log(token)
  var needUpload = [];
  await db.transaction((tx) => {
    tx.executeSql(
      `SELECT * FROM media WHERE cloud_id IS NULL AND creationTime > ?;`,
      [sevenDaysAgo],
      async (tx, results) => {
        needUpload = results.rows._array;
        console.log(`found ${needUpload.length} files need upload`);

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
      }
    );
  });
};

export default uploadPhotoToCloud;
