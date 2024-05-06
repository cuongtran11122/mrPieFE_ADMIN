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

export const storeListReducer = (
  state = { loading: true, stores: [] },
  action
) => {
  switch (action.type) {
    case STORE_LIST_REQUEST:
      return { loading: true, stores: [] };
    case STORE_LIST_SUCCESS:
      return {
        loading: false,
        stores: action.payload.data.stores,
        pages: action.payload.data.pages,
        page: action.payload.data.page,
      };
    case STORE_LIST_FAIL:
      return { loading: false, error: action.payload };
    case STORE_LIST_RESET:
      return { stores: [] };
    default:
      return state;
  }
};

export const storeCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case STORE_CREATE_REQUEST:
      return { loading: true };
    case STORE_CREATE_SUCCESS:
      return { loading: false, success: true };
    case STORE_CREATE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const storeDetailsReducer = (state = { store: {} }, action) => {
  switch (action.type) {
    case STORE_DETAILS_REQUEST:
      return { ...state, loading: true };
    case STORE_DETAILS_SUCCESS:
      return { loading: false, store: action.payload.data.store };
    case STORE_DETAILS_FAIL:
      return { loading: false, error: action.payload.data.store };
    case STORE_DETAILS_RESET:
      return { store: {} };
    default:
      return state;
  }
};

export const storeUpdateReducer = (state = { store: {} }, action) => {
  switch (action.type) {
    case STORE_UPDATE_REQUEST:
      return { loading: true };
    case STORE_UPDATE_SUCCESS:
      return { loading: false, success: true, store: action.payload };
    case STORE_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case STORE_UPDATE_RESET:
      return { store: {} };
    default:
      return state;
  }
};

export const storeDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case STORE_DELETE_REQUEST:
      return { loading: true };
    case STORE_DELETE_SUCCESS:
      return { loading: false, success: true };
    case STORE_DELETE_FAIL:
      return { loading: false, error: action.payload };
    case STORE_DELETE_RESET:
      return {};
    default:
      return state;
  }
};
