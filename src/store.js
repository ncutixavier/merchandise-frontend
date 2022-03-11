import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import thunk from "redux-thunk";
import loginReducer from "./features/LoginSlice";
import getAllSamplesReducer from "./features/samples/getAllSamples";
import addNewSampleReducer from "./features/samples/addNewSample";
import deleteSampleReducer from "./features/samples/deleteSample";
import updateSampleReducer from "./features/samples/updateSample";

const reducer = {
  login: loginReducer,
  getAllSamples: getAllSamplesReducer,
  addNewSample: addNewSampleReducer,
  deleteSample: deleteSampleReducer,
  updateSample: updateSampleReducer,
};

const middleware = [];

if (process.env.NODE_ENV === `development`) {
  middleware.push(logger);
}

export default configureStore({
  reducer,
  middleware: [thunk, ...middleware],
});
