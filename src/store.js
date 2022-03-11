import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import thunk from "redux-thunk";
import loginReducer from "./features/LoginSlice";
import getAllSamplesReducer from "./features/samples/getAllSamples";
import addNewSampleReducer from "./features/samples/addNewSample";

const reducer = {
  login: loginReducer,
  getAllSamples: getAllSamplesReducer,
  addNewSample: addNewSampleReducer,
};

const middleware = [];

if (process.env.NODE_ENV === `development`) {
  middleware.push(logger);
}

export default configureStore({
  reducer,
  middleware: [thunk, ...middleware],
});
