import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import thunk from "redux-thunk";
import loginReducer from "./features/LoginSlice";
import getAllSamplesReducer from "./features/samples/getAllSamples";
import addNewSampleReducer from "./features/samples/addNewSample";
import deleteSampleReducer from "./features/samples/deleteSample";
import updateSampleReducer from "./features/samples/updateSample";
import getAllOrdersReducer from "./features/order/getAllOrders";
import addNewOrderReducer from "./features/order/addNewOrder";
import deleteOrderReducer from "./features/order/deleteOrder";
import updateOrderReducer from "./features/order/updateOrder";
import getAllProductionReducer from "./features/production/getAllProduction";
import addNewProductionReducer from "./features/production/addNewProduction";
import deleteProductionReducer from "./features/production/deleteProduction";
import updateProductionReducer from "./features/production/updateProduction";
import getAllPurchaseOrder from "./features/purchaseOrder/getAllPurchaseOrder";
import addNewPurchaseOrder from "./features/purchaseOrder/addNewPurchaseOrder";
import deletePurchaseOrder from "./features/purchaseOrder/deletePurchaseOrder";
import addNewStyleReducer from "./features/style/addNewStyle";
import getAllStylesReducer from "./features/style/getAllStyles";
import deleteStyleReducer from "./features/style/deleteStyle";
import logoutReducer from "./features/LogoutSlice";

const reducer = {
  login: loginReducer,
  getAllSamples: getAllSamplesReducer,
  addNewSample: addNewSampleReducer,
  deleteSample: deleteSampleReducer,
  updateSample: updateSampleReducer,
  getAllOrders: getAllOrdersReducer,
  addNewOrder: addNewOrderReducer,
  deleteOrder: deleteOrderReducer,
  updateOrder: updateOrderReducer,
  getAllProduction: getAllProductionReducer,
  addNewProduction: addNewProductionReducer,
  deleteProduction: deleteProductionReducer,
  updateProduction: updateProductionReducer,
  getAllPurchaseOrder: getAllPurchaseOrder,
  addNewPurchaseOrder: addNewPurchaseOrder,
  deletePurchaseOrder: deletePurchaseOrder,
  addNewStyle: addNewStyleReducer,
  getAllStyles: getAllStylesReducer,
  deleteStyle: deleteStyleReducer,
  logout: logoutReducer,
};

const middleware = [];

if (process.env.NODE_ENV === `development`) {
  middleware.push(logger);
}

export default configureStore({
  reducer,
  middleware: [thunk, ...middleware],
});
