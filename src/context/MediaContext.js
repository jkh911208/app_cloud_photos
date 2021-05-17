import createDataContext from "./createDataContext";
import * as SecureStore from "expo-secure-store";
import { navigate } from "../navigationRef";

const mediaReducer = (state, action) => {
  switch (action.type) {
    case "updateMedia":
        console.log("mediaReducer updateMedia")
        return {...state, media:action.payload}
    default:
      return state;
  }
};

const updateMedia = (dispatch) => async ({media}) => {
    dispatch({ type: "updateMedia", payload: media });
};

export const { Provider, Context } = createDataContext(
  mediaReducer,
  { updateMedia },
  { media: [] }
);
