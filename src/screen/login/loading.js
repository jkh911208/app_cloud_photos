import { createCreationTimeIndex, createMD5Index, createMediaTable } from "../../database";
import { useContext, useEffect } from "react";

import { Context as AuthContext } from "../../context/AuthContext";
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
