import axios from "axios";
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_FAIL,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_LIST_REQUEST,
  USER_LIST_SUCCESS,
  USER_LIST_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_FAIL,
  USER_UPDATE_REQUEST,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_FAIL,
  USER_DELETE_REQUEST,
  USER_DELETE_SUCCESS,
  USER_DELETE_FAIL,
  USER_DETAILS_RESET,
  USER_FORGOTPASSWORD_REQUEST,
  USER_FORGOTPASSWORD_SUCCESS,
  USER_FORGOTPASSWORD_FAIL,
  USER_UPDATEPASSWORD_REQUEST,
  USER_UPDATEPASSWORD_SUCCESS,
  USER_UPDATEPASSWORD_FAIL
} from "./../constants/userConstants";

//login
export const login = (username, password) => async (dispatch) => {
  try {
    dispatch({
      type: USER_LOGIN_REQUEST,
    });

    //headers
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    //get login data
    const { data } = await axios.post(
      "/api/v1/admin/login",
      { username, password },
      config
    );
    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });

    //set user info into local storage
    localStorage.setItem("adminInfo", JSON.stringify(data.data));
  } catch (error) {
    // console.log(error.response.data.error);
    dispatch({
      type: USER_LOGIN_FAIL,
      payload: error.response.data.error,
    });
  }
};

//logout
export const logout = () => (dispatch) => {
  localStorage.removeItem("adminInfo");
  dispatch({ type: USER_LOGOUT });
  dispatch({ type: USER_DETAILS_RESET });
  dispatch({ type: USER_LOGOUT });
};

//get all users
export const listUsers =
  (keyword = "", pageNumber = "") =>
  async (dispatch, getState) => {
    try {
      dispatch({
        type: USER_LIST_REQUEST,
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

      //get all users
      const { data } = await axios.get(
        `/api/v1/admin/customer/view_customer?keyword=${keyword}&pageNumber=${pageNumber}`,
        config
      );
      dispatch({
        type: USER_LIST_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: USER_LIST_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

//register an user
export const register = (admin) => async (dispatch, getState) => {
  const { name, username, email, password} = admin;

  try {
    dispatch({
      type: USER_REGISTER_REQUEST,
    });

    //get user from state
    // const {
    //   userLogin: { userInfo },
    // } = getState();

    //headers
    const config = {
      headers: {
        "Content-Type": "application/json",
        
      },
    };

    //get login data
    const { data } = await axios.post(
      "/api/v1/admin/account",
      { name, username, email, password},
      config
    );
    dispatch({
      type: USER_REGISTER_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload: error.response.data.error,
        
    });
  }
};

export const forgotPassword = (email) => async (dispatch, getState) =>{
    try{
      dispatch({
        type: USER_FORGOTPASSWORD_REQUEST
      });

      //headers
    const config = {
      headers: {
        "Content-Type": "application/json",
        
      },
    };

    const { data } = await axios.patch(
      "api/v1/admin/reset_passwords/forgot_password",
      {email},
      config
    );
    dispatch(
      {
        type: USER_FORGOTPASSWORD_SUCCESS,
        payload: data
      }
    )

    }catch(error){
      dispatch({
        type: USER_FORGOTPASSWORD_FAIL,
        payload: error.response.data.error
      })
    }
}

export const updatePassword = (newPassword) => async (dispatch, getState) =>{
  try{
    dispatch({
      type: USER_UPDATEPASSWORD_REQUEST
    })

    const config = {
      headers: {
        "Content-Type": "application/json",
        
      },
    };

    const { data } = await axios.patch(
      "api/v1/admin/reset_passwords/update_password",
      {newPassword},
      // {resetToken,newPassword},
      config
    );

    dispatch({
      type: USER_UPDATEPASSWORD_SUCCESS,
      payload: data
    })

  }catch(error){
    dispatch({
      type: USER_UPDATEPASSWORD_FAIL,
      payload: error.response.data.error
    })
  }
}

//get user details
export const listUserDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_DETAILS_REQUEST });

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

    //api call to get product
    const { data } = await axios.get(
      `/api/v1/admin/customer/view_customer/${id}`,
      config
    );
    dispatch({
      type: USER_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

//update an user
export const updateUser = (user) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_UPDATE_REQUEST,
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

    //update user
    const { data } = await axios.put(`/api/v1/admin/customer/${user.id}`, user, config);
    dispatch({
      type: USER_UPDATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

//delete user
export const deleteUser = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_DELETE_REQUEST,
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

    //api call to delete user
    await axios.delete(`/api/users/${id}`, config);
    dispatch({
      type: USER_DELETE_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: USER_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

//update profile
export const updateProfile = (user) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_UPDATE_REQUEST,
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

    //update user
    const { data } = await axios.put(
      `/api/users/profile/${user.id}`,
      user,
      config
    );
    dispatch({
      type: USER_UPDATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
