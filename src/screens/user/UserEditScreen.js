import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

/* Components */
import HeaderContent from "../../components/HeaderContent";
import Input from "../../components/form/Input";

import ButtonGoBack from "../../components/ButtonGoBack";
import LoaderHandler from "../../components/loader/LoaderHandler";
import DisabledInput from "../../components/form/DisabledInput";

/* Constants */
import {
  USER_UPDATE_RESET,
  USER_DETAILS_RESET,
  USER_DELETE_RESET,
} from "../../constants/userConstants";

/* Actions */
import { listUserDetails, updateUser } from "../../actions/userActions";

const UserEditScreen = ({ history, match }) => {
  const userId = parseInt(match.params.id);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { adminInfo } = userLogin;

  //user details state
  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  //user update state
  const userUpdate = useSelector((state) => state.userUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = userUpdate;

  useEffect(() => {
    //after update redirect to users

    if (successUpdate) {
      dispatch({ type: USER_UPDATE_RESET });
      dispatch({ type: USER_DETAILS_RESET });
      dispatch({ type: USER_DELETE_RESET });
      history.push("/user");
    }

    if (user) {
      if (!user.name || user.id !== userId) {
        dispatch(listUserDetails(userId));
      } else {
        setName(user.name);
        setUsername(user.username);
        setEmail(user.email);
        setPhone(user.phone);
        setAddress(user.address);
      }
    }
    //load product data
  }, [dispatch, history, userId, user, successUpdate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    let errorsCheck = {};
    if (!name || name.length < 10 || name.length > 32) {
      errorsCheck.name = "Name must be between 10 and 32 characters";
    }

    if (!address || address.length < 10 || address.length > 64) {
      errorsCheck.address = "Address must be between 10 and 64 characters";
    }

    if (Object.keys(errorsCheck).length > 0) {
      setErrors(errorsCheck);
    } else {
      setErrors({});
    }

    if (Object.keys(errorsCheck).length === 0 && !user.isAdmin) {
      dispatch(
        updateUser({
          id: userId,
          name,
          address,
        })
      );
    }
  };

  const renderForm = () => (
    <form onSubmit={handleSubmit}>
      <Input
        label={"Name"}
        name={"name"}
        type={"text"}
        data={name}
        setData={setName}
        errors={errors}
      />
      <DisabledInput
        class="form-control item"
        name={"username"}
        type={"text"}
        placeholder={"username"}
        data={username}
        setData={setUsername}
        errors={errors}
      />
      <DisabledInput
        class="form-control item"
        name={"email"}
        type={"text"}
        placeholder={"email"}
        data={email}
        setData={setEmail}
        errors={errors}
      />
      <DisabledInput
        class="form-control item"
        name={"phone"}
        type={"text"}
        placeholder={"phone"}
        data={phone}
        setData={setPhone}
        errors={errors}
      />
      <Input
        label={"Address"}
        name={"address"}
        type={"text"}
        data={address}
        setData={setAddress}
        errors={errors}
      />

      {/* <Checkbox name={"Reset Avatar"} data={avatar} setData={setAvatar} />
            <hr />
            <Checkbox name={"Admin"} data={isAdmin} setData={setIsAdmin} />
            <hr /> */}
      <button
        type="submit"
        className="btn  btn-secondary  border border-black w-25"
      >
        Submit
      </button>
    </form>
  );

  return (
    <>
      {/* Content Header (Page header) */}
      <HeaderContent name={"Users"} />

      {/* Main content */}

      <section className="content">
        <div className="container-fluid">
          <ButtonGoBack history={history} />
          <div className="row justify-content-center">
            <div className="col-12 col-md-6">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Edit User</h3>
                </div>
                {/* /.card-header */}
                <div className="card-body">
                  <LoaderHandler loading={loadingUpdate} error={errorUpdate} />
                  <LoaderHandler
                    loading={loading}
                    error={error}
                    render={renderForm}
                  />
                </div>
                {/* /.card-body */}
              </div>
            </div>
            {/* /.col */}
          </div>
          {/* /.row */}
        </div>
        {/* /.container-fluid */}
      </section>
    </>
  );
};

export default UserEditScreen;
