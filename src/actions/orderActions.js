import axios from "axios";
import {
    ORDER_LIST_REQUEST,
    ORDER_LIST_SUCCESS,
    ORDER_LIST_FAIL,
    ORDER_CREATE_REQUEST,
    ORDER_CREATE_SUCCESS,
    ORDER_CREATE_FAIL,
    ORDER_DETAILS_REQUEST,
    ORDER_DETAILS_SUCCESS,
    ORDER_DETAILS_FAIL,
    ORDER_UPDATE_REQUEST,
    ORDER_UPDATE_SUCCESS,
    ORDER_UPDATE_FAIL,
    ORDER_DELETE_REQUEST,
    ORDER_DELETE_SUCCESS,
    ORDER_DELETE_FAIL,
    ORDER_STATISTICS_REQUEST,
    ORDER_STATISTICS_SUCCESS,
    ORDER_STATISTICS_FAIL,
    ORDER_USER_LIST_REQUEST,
    ORDER_USER_LIST_SUCCESS,
    ORDER_USER_LIST_FAIL,
    ORDER_USER_LIST_RESET
} from "../constants/orderConstants";

//get all sales
export const getStatistics = () => async (dispatch, getState) => {
     
    try {
        dispatch({
            type: ORDER_STATISTICS_REQUEST,
        });
        
        //get user from state
        const {
            userLogin: { userInfo },
        } = getState();

       
        //headers
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
        
        //get all sales
        const { data } = await axios.get(`/api/v1/admin/order/statistics`, config);

        dispatch({
            type: ORDER_STATISTICS_SUCCESS,
            payload: data,
        });
    } catch (error) {
        //console.log(error)
        dispatch({
            type: ORDER_STATISTICS_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

//get all orders with pagination
export const listOrders = (options) => async (dispatch, getState) => {
    const { keyword, pageNumber, delivery } = options;
    try {
        dispatch({
            type: ORDER_LIST_REQUEST,
        });

        //get user from state
        const {
            userLogin: { userInfo },
        } = getState();

        //headers
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
        console.log(userInfo);
        //get all orders
        const { data } = await axios.get(
            `/api/v1/admin/order/list?keyword=${keyword}&pageNumber=${pageNumber}${
                delivery ? "&delivery=true" : ""
            }`,
            config
        );

        dispatch({
            type: ORDER_LIST_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: ORDER_LIST_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

//create a order
export const createOrder = (order) => async (dispatch, getState) => {
    try {
        dispatch({
            type: ORDER_CREATE_REQUEST,
        });

        //get order from state
        const {
            userLogin: { userInfo },
        } = getState();

        //headers
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        //create order
        const { data } = await axios.post("/api/orders", order, config);
        dispatch({
            type: ORDER_CREATE_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: ORDER_CREATE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

//get order details
export const listOrderDetails = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: ORDER_DETAILS_REQUEST });

        //get user from state
        const {
            userLogin: { userInfo },
        } = getState();

        //headers
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        //api call to get ORDER
        const { data } = await axios.get(`/api/v1/admin/order/${id}`, config);
        dispatch({
            type: ORDER_DETAILS_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: ORDER_DETAILS_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};


export const listOrdersUserDetail = (options,userID) => async (dispatch, getState) => {
    const { keyword, pageNumber, delivery } = options;
    try {
        dispatch({
            type: ORDER_USER_LIST_REQUEST,
        });

        //get user from state
        const {
            userLogin: { userInfo },
        } = getState();

        //headers
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
        console.log(userInfo);
        //get all orders
        const { data } = await axios.get(
            `/api/v1/admin/order/list/${userID}?keyword=${keyword}&pageNumber=${pageNumber}${
                delivery ? "&delivery=true" : ""
            }`,
            config
        );

        dispatch({
            type: ORDER_USER_LIST_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: ORDER_USER_LIST_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

//update a order
export const updateOrder = (order) => async (dispatch, getState) => {
    try {
        dispatch({
            type: ORDER_UPDATE_REQUEST,
        });

        //get user from state
        const {
            userLogin: { userInfo },
        } = getState();
        //headers
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        //update order
        const { data } = await axios.patch(
            `/api/v1/admin/order/${order.id}`,
            order,
            config
        );
        dispatch({
            type: ORDER_UPDATE_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: ORDER_UPDATE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

//update a order
export const updateOrderToPaid = (order) => async (dispatch, getState) => {
    try {
        const newOrder ={
            status: order.status
        }
        dispatch({
            type: ORDER_UPDATE_REQUEST,
        });


        //get user from state
        const {
            userLogin: { userInfo },
        } = getState();
        //headers
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
        //update order
        const { data } = await axios.patch(
            `/api/v1/admin/order/${order.id}/status`,
            newOrder,
            config
        );
        dispatch({
            type: ORDER_UPDATE_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: ORDER_UPDATE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

//delete order
export const deleteOrder = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: ORDER_DELETE_REQUEST,
        });

        //get user from state
        const {
            userLogin: { userInfo },
        } = getState();
        //headers
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        //api call to delete order
        await axios.delete(`/api/orders/${id}`, config);
        dispatch({
            type: ORDER_DELETE_SUCCESS,
        });
    } catch (error) {
        dispatch({
            type: ORDER_DELETE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};
