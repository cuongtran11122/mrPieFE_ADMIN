import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  userLoginReducer,
  userListReducer,
  userRegisterReducer,
  userDetailsReducer,
  userUpdateReducer,
  userForgotPasswordReducer,
  userUpdatePasswordReducer,
} from "./reducers/userReducers";
import {
  categoryListReducer,
  categoryCreateReducer,
  categoryDetailsReducer,
  categoryUpdateReducer,
} from "./reducers/categoryReducers";

import {
  tableAllReducer,
  tableListReducer,
  tableCreateReducer,
  tableDetailsReducer,
  tableUpdateReducer,
} from "./reducers/tableReducers";

import {
  clientListReducer,
  clientCreateReducer,
  clientDetailsReducer,
  clientUpdateReducer,
} from "./reducers/clientReducers";

import {
  productListReducer,
  productCreateReducer,
  productDetailsReducer,
  productUpdateReducer,
} from "./reducers/productReducers";

import {
  orderListReducer,
  orderCreateReducer,
  orderDetailsReducer,
  orderUpdateReducer,
  statisticsReducer,
  orderListUserReducer,
} from "./reducers/orderReducers";

import {
  storeListReducer,
  storeCreateReducer,
  storeDeleteReducer,
  storeDetailsReducer,
  storeUpdateReducer,
} from "./reducers/storeReducer";

const reducer = combineReducers({
  userLogin: userLoginReducer,
  userList: userListReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  userUpdate: userUpdateReducer,
  userForgotPassword: userForgotPasswordReducer,
  userUpdatePassword: userUpdatePasswordReducer,

  categoryList: categoryListReducer,
  categoryCreate: categoryCreateReducer,
  categoryDetails: categoryDetailsReducer,
  categoryUpdate: categoryUpdateReducer,

  productList: productListReducer,
  productCreate: productCreateReducer,
  productDetails: productDetailsReducer,
  productUpdate: productUpdateReducer,

  storeList: storeListReducer,
  storeCreate: storeCreateReducer,
  storeDetails: storeDetailsReducer,
  storeUpdate: storeUpdateReducer,
  storeDelete: storeDeleteReducer,

  tableAll: tableAllReducer,
  tableList: tableListReducer,
  tableCreate: tableCreateReducer,
  tableDetails: tableDetailsReducer,
  tableUpdate: tableUpdateReducer,

  clientList: clientListReducer,
  clientCreate: clientCreateReducer,
  clientDetails: clientDetailsReducer,
  clientUpdate: clientUpdateReducer,

  orderStatistics: statisticsReducer,
  orderList: orderListReducer,
  orderCreate: orderCreateReducer,
  orderDetails: orderDetailsReducer,
  orderUpdate: orderUpdateReducer,
  orderUserList: orderListUserReducer,
});

const adminInfoFromStorage = localStorage.getItem("adminInfo")
  ? JSON.parse(localStorage.getItem("adminInfo"))
  : null;

const initialState = {
  userLogin: { adminInfo: adminInfoFromStorage },
};

const middleware = [thunk];
const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
