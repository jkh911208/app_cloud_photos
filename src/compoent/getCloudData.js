import * as SecureStore from "expo-secure-store";

import { API_URL } from "@env";
import { Platform } from "react-native";
import api from "../api/api";
import { insertMedia } from "../database";

const getCloudData = async () => {
  const token = await SecureStore.getItemAsync("token");
  if (!token) {
    return null;
  } else {
    console.log("get cloud data", Platform.OS);
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  var lastCloudCreated = 0;

  while (true) {
    console.log(lastCloudCreated);

    const result = await api.get(
      `/api/v1/photo/list/${lastCloudCreated}`,
      config
    );

    const data = result.data.result;
    const hasNext = result.data.has_next;

    // console.log(data);

    for (let i = 0; i < data.length; i++) {
      await insertMedia(
        null,
        data[i].id,
        data[i].original_width,
        data[i].original_height,
        `${API_URL}/api/v1/photo/${data[i].resize}`,
        `${API_URL}/api/v1/photo/${data[i].thumbnail}`,
        data[i].original_datetime,
        data[i].md5
      );

      lastCloudCreated = Math.max(lastCloudCreated, data[i].created);
    }

    if (!hasNext) {
      break;
    }
  }
};

export default getCloudData;
