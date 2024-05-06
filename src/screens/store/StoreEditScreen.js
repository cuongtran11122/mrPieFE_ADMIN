import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import HeaderContent from "../../components/HeaderContent";
import LoaderHandler from "../../components/loader/LoaderHandler";
import ErrorInput from "../../components/form/ErrorInput";
import ButtonGoBack from "../../components/ButtonGoBack";
import FileInput from "../../components/form/FileInput";
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
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [errorsUpload, setErrorsUpload] = useState("");
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
        setImage(store?.image);
      }
    }
  }, [dispatch, history, storeId, store, successUpdate, update]);
  const uploadingFileHandler = async (e) => {
    // e.preventDefault();
    let validFile = true;
    let errorsUp = "";
    //get first element from files which one is the image
    const file = e.target.files[0];

    const validImageTypes = ["image/gif", "image/jpeg", "image/png"];
    if (!validImageTypes.includes(file.type)) {
      validFile = false;
      errorsUp = "Only for uploading jpeg, jpg, png files";
      setErrorsUpload(errorsUp);
    }

    if (file && file.size / 1000000 > 5) {
      validFile = false;
      errorsUp = " The image maximum size is 5MB";
      setErrorsUpload(errorsUp);
    }
    //form instance
    if (validFile) {
      setErrorsUpload("");
      const formData = new FormData();
      //add file
      formData.append("image", file);
      //start loader
      setUploading(true);
      try {
        //form config
        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
        //api call to upload image
        const { data } = await axios.post("/api/v1/upload", formData, config);
        //set image path
        setImage(data);
        //stop loader
        setUploading(false);
      } catch (error) {
        setUploading(false);
      }
    }
  };
  const imageName = (image) => {
    const imageArray = image.split(`uploads`);
    return imageArray[1];
  };
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
      <div className="d-flex mt-5">
        {/* <img
          className="profile-user-img img-fluid"
          src={image}
          alt="User profile picture"
        /> */}
        <div className="w-25 h-25">
          <img
            className="profile-user-img img-fluid w-75  "
            src={
              image.length > 0
                ? image
                : "https://t4.ftcdn.net/jpg/04/70/29/97/360_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg"
            }
            alt="Product"
          />
        </div>
        <div className="w-75 h-25">
          <FileInput
            fileHandler={uploadingFileHandler}
            name={"photo"}
            image={imageName(image)}
            uploading={uploading}
          />
          <label className="text-danger">{errorsUpload} </label>
        </div>
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
