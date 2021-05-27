import { useEffect, useContext } from "react";
import { Context as AuthContext } from "../../context/AuthContext";
import { createMediaTable, createMD5Index, createCreationTimeIndex } from "../../database";
import updateLocalPhotoLibrary from "../../compoent/updateLocalPhotoLibrary";

const Loading = () => {
  const { getLocalToken } = useContext(AuthContext);

  useEffect(() => {
    getLocalToken();
    runAsyncUseEffect();
  }, []);

  const runAsyncUseEffect = async () => {
    await createMediaTable();
    await createMD5Index();
    await createCreationTimeIndex();
    await updateLocalPhotoLibrary();
  };

  return null;
};

export default Loading;
