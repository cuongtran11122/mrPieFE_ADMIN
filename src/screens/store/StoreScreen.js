import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import Input from "../../components/form/Input";
import HeaderContent from "../../components/HeaderContent";
import DataTableLoader from "../../components/loader/DataTableLoader";
import Search from "../../components/Search";
import LoaderHandler from "../../components/loader/LoaderHandler";
import Pagination from "../../components/Pagination";
import FileInput from "../../components/form/FileInput";
import {
  listStores,
  deleteStore,
  createStore,
} from "../../actions/storeAction";

import "../../style/button.css";

const StoreScreen = ({ history, match }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [name, setName] = useState("");
  const [name_en, setNameEn] = useState("");
  const [address, setAddress] = useState("");
  const [openingTime, setOpeningTime] = useState("");
  const [closeTime, setCloseTime] = useState("");
  const [errors, setErrors] = useState({});
  const [storeId, setStoreId] = useState("");
  const [update, setUpdate] = useState(false);
  const dispatch = useDispatch();
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isAlert, setIsAlert] = useState(false);
  const [errorsUpload, setErrorsUpload] = useState("");
  const userLogin = useSelector((state) => state.userLogin);
  const { adminInfo } = userLogin;
  const storeList = useSelector((state) => state.storeList);
  const { loading, error, stores, page, pages } = storeList;
  const newStoreCreate = useSelector((state) => state.storeCreate);
  const {
    loading: storeLoading,
    success: storeSuccess,
    error: storeError,
  } = newStoreCreate;

  useEffect(() => {
    if (!adminInfo) {
      history.push("/login");
    }
    const params = {
      keyword: keyword,
      page: pageNumber,
    };
    dispatch(listStores(params));
    if (storeSuccess) {
      setName("");
      setModalIsOpen(false);
    }
  }, [dispatch, history, adminInfo, pageNumber, keyword, storeSuccess, update]);
  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    refreshForm();
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
      const NewStore = {
        name: name.trim(),
        name_en: name_en.trim(),
        address: address.trim(),
        openingTime: openingTime.trim(),
        closeTime: closeTime.trim(),
        image: image,
      };
      dispatch(createStore(NewStore));
      refreshForm();
    }
  };
  const uploadingFileHandler = async (e) => {
    // Get the first element from files which should be the image

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
        console.error(error);
        setUploading(false);
      }
    }
  };
  const imageName = (image) => {
    const imageArray = image.split(`uploads`);
    return imageArray[1];
  };
  const refreshForm = () => {
    setName("");
    setNameEn("");
    setAddress("");
    setCloseTime("");
    setOpeningTime("");
    setImage("");
  };
  const deleteRow = (id) => {
    dispatch(deleteStore(id));
    setUpdate(!update);
  };
  const renderModalCreateCategory = () => (
    <>
      {/* This is modal */}
      {modalIsOpen && (
        <div id="modal" className="registration-form">
          {/* <img src="../../../public/plugins/close.png" className="w-25 h-25"/> */}

          <form style={{ position: "relative" }} onSubmit={handleSubmit}>
            <img
              onClick={closeModal}
              style={{
                width: 20,
                height: 20,
                cursor: "pointer",
                position: "absolute",
                right: 0,
                top: 0,
                margin: 25,
              }}
              src={"/close.png"}
              alt="User profile picture"
            />
            <span>
              <h1 className="text-center mb-4">Create Store</h1>
            </span>
            <div className="form-group">
              <Input
                label={"Name"}
                name={"name"}
                type={"text"}
                data={name}
                setData={setName}
                errors={errors}
              />
            </div>
            <div className="form-group">
              <Input
                label={"Name English"}
                name={"name_en"}
                type={"text"}
                data={name_en}
                setData={setNameEn}
                errors={errors}
              />
            </div>
            <div className="form-group">
              <Input
                label={"Address"}
                name={"address"}
                type={"text"}
                data={address}
                setData={setAddress}
                errors={errors}
              />
            </div>
            <div className="form-group">
              <Input
                label={"Opening Time"}
                name={"openingTime"}
                type={"text"}
                data={openingTime}
                setData={setOpeningTime}
                errors={errors}
              />
            </div>
            <div className="form-group">
              <Input
                label={"Close Time"}
                name={"closeTime"}
                type={"text"}
                data={closeTime}
                setData={setCloseTime}
                errors={errors}
              />
            </div>

            <div className="form-group d-flex">
              <img
                className="profile-user-img img-fluid  "
                src={
                  image.length > 0
                    ? image
                    : "https://t4.ftcdn.net/jpg/04/70/29/97/360_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg"
                }
                alt="User profile picture"
              />
              <FileInput
                fileHandler={uploadingFileHandler}
                name={"photo"}
                image={imageName(image)}
                uploading={uploading}
              />
            </div>
            <label className="text-danger">{errorsUpload} </label>
            {isAlert && (
              <div className="form-group">
                <div
                  class="alert alert-danger alert-dismissible fade show"
                  role="alert"
                >
                  <strong>Alert</strong> You should select image file or the
                  size of image less than 5MB
                  <button
                    type="button"
                    class="close"
                    data-dismiss="alert"
                    aria-label="Close"
                    onClick={() => {
                      // setIsAlert(false);
                    }}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
              </div>
            )}
            <hr />
            <div className="form-group">
              <button
                type="submit"
                className="btn  btn-secondary  border border-black"
                style={{ width: "100%" }}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );

  const renderConfirmModal = (sid) => (
    <div id="myModal" className="modal fade">
      <div className="modal-dialog modal-confirm">
        <div className="modal-content">
          <div className="modal-header flex-column">
            <div className="icon-box">
              <i className="material-icons">&#xE5CD;</i>
            </div>
            <h4 className="modal-title w-100">Are you sure?</h4>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-hidden="true"
            >
              &times;
            </button>
          </div>
          <div className="modal-body">
            <p>
              Do you really want to delete these records? This process cannot be
              undone.
            </p>
          </div>
          <div className="modal-footer justify-content-center">
            <button
              type="button"
              className="btn btn-secondary"
              data-dismiss="modal"
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              data-dismiss="modal"
              onClick={(e) => {
                deleteRow(storeId);
                setStoreId("");
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTable = () => (
    <table className="table table-hover text-nowrap">
      <thead>
        <tr className="header_table">
          <th className="border-right border-bottom-0 border-left-0 border-top-0 ">
            ID
          </th>
          <th className="border-right border-bottom-0 border-left-0 border-top-0 ">
            Name
          </th>
          <th className="border-right border-bottom-0 border-left-0 border-top-0 ">
            Name English
          </th>
          <th className="d-none d-sm-table-cell border-right border-bottom-0 border-left-0 border-top-0">
            Address
          </th>
          <th className="d-none d-sm-table-cell border-right border-bottom-0 border-left-0 border-top-0">
            Opening Time
          </th>
          <th className="d-none d-sm-table-cell border-right border-bottom-0 border-left-0 border-top-0">
            Close Time
          </th>
          <th className=" d-none d-sm-table-cell border-right border-bottom-0 border-left-0 border-top-0">
            Created At
          </th>
          <th className=" d-none flex d-sm-table-cell border-right border-bottom-0 border-left-0 border-top-0">
            Action
          </th>
        </tr>
      </thead>
      <tbody>
        {stores?.length === 0 ? (
          <span className="text-center" style={{ fontSize: "20px" }}>
            No Store Data
          </span>
        ) : (
          stores?.map((el, index) => (
            <tr className="border-right border border-light" key={el?.id}>
              <td className="py-4 border-right border border-light">
                {index + 1}
              </td>
              <td className="py-4 border-right border border-light">
                {el?.name}
              </td>
              <td className="py-4 border-right border border-light">
                {el?.name_en}
              </td>
              <td className="py-4 border-right border border-light">
                {el?.address}
              </td>
              <td className="py-4 border-right border border-light">
                {el?.openingTime}
              </td>
              <td className="py-4 border-right border border-light">
                {el?.closeTime}
              </td>
              <td className="d-none d-sm-table-cell py-4 border-right border border-light">
                {el?.createdAt?.slice(0, 10)}
              </td>
              <td className="py-4  border-right border border-light d-flex justify-content-center align items-center">
                <Link to={`/store/${el?.id}/edit`}>
                  <button
                    type="button"
                    className="btn  btn-light text-sm border border-black mr-4"
                  >
                    Edit
                  </button>
                </Link>

                <button
                  type="button"
                  className=" btn  btn-light text-sm border border-black mr-4"
                  href="#myModal"
                  data-toggle="modal"
                  onClick={() => {
                    setStoreId(el?.id);
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );

  return (
    <>
      <HeaderContent name={"Stories"} />
      {/* Main content */}
      <section className="content">
        <div className="container-fluid">
          {renderModalCreateCategory()}
          {renderConfirmModal(storeId)}
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title align-middle ">
                    <strong>Stories</strong>
                  </h3>
                  <div className="d-flex justify-content-end">
                    <div className="card-tools">
                      <Search
                        placeholder={"Search by name or address..."}
                        keyword={keyword}
                        setKeyword={setKeyword}
                        setPage={setPageNumber}
                      />
                    </div>
                    <button
                      id="createBtn"
                      className="btn  btn-secondary  border border-black ml-2"
                      onClick={openModal}
                    >
                      Create
                    </button>
                  </div>
                </div>
                {/* /.card-header */}
                <div className="card-body table-responsive p-0">
                  <LoaderHandler
                    loading={loading}
                    error={error}
                    loader={<DataTableLoader />}
                    render={renderTable}
                  />
                </div>
              </div>
              <Pagination page={page} pages={pages} setPage={setPageNumber} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default StoreScreen;
