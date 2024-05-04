import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import HeaderContent from "../../components/HeaderContent";
import LoaderHandler from "../../components/loader/LoaderHandler";
import ErrorInput from "../../components/form/ErrorInput";
import ButtonGoBack from "../../components/ButtonGoBack";

import {
  STORE_UPDATE_RESET,
  STORE_DETAILS_RESET,
  STORE_DELETE_RESET,
} from "../../constants/storeConstants";

import { updateStore, listStoreDetails } from "../../actions/storeAction";

const StoreEditScreen = ({ history, match }) => {
  const storeId = parseInt(match.params.id);

  const [name, setName] = useState("");
  const [name_en, setNameEn] = useState("");
  const [address, setAddress] = useState("");
  const [openingTime, setOpeningTime] = useState("");
  const [closeTime, setCloseTime] = useState("");
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { adminInfo } = userLogin;
  const [update, setUpdate] = useState(false);
  const storeDetails = useSelector((state) => state.storeDetails);
  const { loading, error, store } = storeDetails;
  const storeUpdate = useSelector((state) => state.storeUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = storeUpdate;

  useEffect(() => {
    //after update redirect
    if (successUpdate) {
      dispatch({ type: STORE_UPDATE_RESET });
      dispatch({ type: STORE_DETAILS_RESET });
      dispatch({ type: STORE_DELETE_RESET });
      history.push("/store/list");
    }

    //load product data
    if (store) {
      if (!store?.name || store?.id !== storeId) {
        dispatch(listStoreDetails(storeId));
      } else {
        //set states
        setName(store?.name);
        setNameEn(store?.name_en);
        setAddress(store?.address);
        setOpeningTime(store?.openingTime);
        setCloseTime(store?.closeTime);
      }
    }
  }, [dispatch, history, storeId, store, successUpdate, update]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let errorsCheck = {};

    if (!name) {
      errorsCheck.name = "Name is required";
    }

    if (!name_en) {
      errorsCheck.name_en = "English Name is required";
    }

    if (!address) {
      errorsCheck.address = "Address is required";
    }

    if (!openingTime) {
      errorsCheck.openingTime = "Opening Time is required";
    }

    if (!closeTime) {
      errorsCheck.closeTime = "Close Time is required";
    }

    if (Object.keys(errorsCheck).length > 0) {
      setErrors(errorsCheck);
    } else {
      setErrors({});
    }

    if (Object.keys(errorsCheck).length === 0) {
      dispatch(
        updateStore({
          id: storeId,
          name: name,
          name_en: name_en,
          address: address,
          openingTime: openingTime,
          closeTime: closeTime,
        })
      );
      if (successUpdate) setUpdate(!update);
    }
  };

  const renderForm = () => (
    <form onSubmit={handleSubmit}>
      <ErrorInput
        name={"Name"}
        type={"text"}
        data={name}
        setData={setName}
        errors={errors}
        nameError={"name"}
      />
      <ErrorInput
        name={"English name "}
        type={"text"}
        data={name_en}
        setData={setNameEn}
        errors={errors}
        nameError={"name_en"}
      />
      <ErrorInput
        name={"Address"}
        type={"text"}
        data={address}
        setData={setAddress}
        errors={errors}
        nameError={"address"}
      />
      <ErrorInput
        name={"Opening Time"}
        type={"text"}
        data={openingTime}
        setData={setOpeningTime}
        errors={errors}
        nameError={"openingTime"}
      />
      <div className="form-group">
        <ErrorInput
          name={"Close Time"}
          type={"text"}
          data={closeTime}
          setData={setCloseTime}
          errors={errors}
          nameError={"closeTime"}
        />
      </div>
      <hr />
      <div className="w-100 d-flex justify-content-start">
        <button
          type="submit"
          className="btn  btn-secondary  border border-black w-25"
        >
          Submit
        </button>
      </div>
    </form>
  );

  return (
    <>
      {/* Content Header (Page header) */}
      <HeaderContent name={"Stores"} />
      {/* Main content */}

      <section className="content">
        <div className="container-fluid">
          <ButtonGoBack history={history} />
          <div className="row justify-content-center">
            <div className="col-12 col-md-6">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Edit Store</h3>
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
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default StoreEditScreen;
