import axios from "axios";
import {
  STORE_LIST_REQUEST,
  STORE_LIST_SUCCESS,
  STORE_LIST_FAIL,
  STORE_LIST_RESET,
  STORE_CREATE_REQUEST,
  STORE_CREATE_SUCCESS,
  STORE_CREATE_FAIL,
  STORE_DETAILS_REQUEST,
  STORE_DETAILS_SUCCESS,
  STORE_DETAILS_FAIL,
  STORE_DETAILS_RESET,
  STORE_UPDATE_REQUEST,
  STORE_UPDATE_SUCCESS,
  STORE_UPDATE_FAIL,
  STORE_UPDATE_RESET,
  STORE_DELETE_REQUEST,
  STORE_DELETE_SUCCESS,
  STORE_DELETE_FAIL,
  STORE_DELETE_RESET,
} from "../constants/storeConstants";

//get all products
export const listStores = (query) => async (dispatch) => {
  try {
    const { page, pageSize, sort, order, keyword } = query;
    const spage = page ? page : "";
    const spageSize = pageSize ? pageSize : "";
    const ssort = sort ? sort : "";
    const sorder = order ? order : "";
    const skeyword = keyword ? keyword : "";
    dispatch({
      type: STORE_LIST_REQUEST,
    });
    //headers
    const params = {
      page: spage,
      pageSize: spageSize,
      sort: ssort,
      order: sorder,
      keyword: skeyword,
    };
    //get all store
    const { data } = await axios.get(`/api/v1/admin/store/list`, {
      params: params,
    });
    dispatch({
      type: STORE_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: STORE_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

//create a product
export const createStore = (store) => async (dispatch, getState) => {
  try {
    dispatch({
      type: STORE_CREATE_REQUEST,
    });

    //get product from state
    const {
      userLogin: { adminInfo },
    } = getState();

    //headers
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminInfo.token}`,
      },
    };

    //create product
    const { data } = await axios.post("/api/v1/admin/store", store, config);
    dispatch({
      type: STORE_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: STORE_CREATE_FAIL,
      payload: error.response.data.error,
    });
  }
};

//get store details
export const listStoreDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: STORE_DETAILS_REQUEST });

    // Get user from state
    const {
      userLogin: { adminInfo },
    } = getState();

    // Headers
    const config = {
      headers: {
        Authorization: `Bearer ${adminInfo.token}`,
      },
    };

    // API call to get product details
    const { data: storeData } = await axios.get(
      `/api/v1/admin/store/${id}`,
      config
    );

    // Dispatch action to store product details
    dispatch({
      type: STORE_DETAILS_SUCCESS,
      payload: storeData,
    });
  } catch (error) {
    dispatch({
      type: STORE_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

//update a store
export const updateStore = (store) => async (dispatch, getState) => {
  try {
    dispatch({
      type: STORE_UPDATE_REQUEST,
    });

    //get user from state
    const {
      userLogin: { adminInfo },
    } = getState();
    //headers
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminInfo.token}`,
      },
    };

    //update product
    const { data } = await axios.put(
      `/api/v1/admin/store/${store.id}`,
      store,
      config
    );
    dispatch({
      type: STORE_UPDATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: STORE_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

//delete store
export const deleteStore = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: STORE_DELETE_REQUEST,
    });

    //get user from state
    const {
      userLogin: { adminInfo },
    } = getState();
    //headers
    const config = {
      headers: {
        Authorization: `Bearer ${adminInfo.token}`,
      },
    };
    console.log("checked id action", id);
    //api call to delete product
    await axios.delete(`/api/v1/admin/store/${id}`, config);
    dispatch({
      type: STORE_DELETE_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: STORE_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
