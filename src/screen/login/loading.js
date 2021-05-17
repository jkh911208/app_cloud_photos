import { useEffect, useContext } from "react";
import { Context as AuthContext } from "../../context/AuthContext";
import { createMediaTable, createMD5Index, createCreationTimeIndex } from "../../database";
import updateLocalPhotoLibrary from "../../compoent/updateLocalPhotoLibrary";

const Loading = () => {
  const { getLocalToken } = useContext(AuthContext);

  useEffect(() => {
    const runAsyncUseEffect = async () => {
      await updateLocalPhotoLibrary();
    };
    getLocalToken();
    createMediaTable();
    createMD5Index();
    createCreationTimeIndex();
    runAsyncUseEffect();
  }, []);

  return null;
};

export default Loading;
