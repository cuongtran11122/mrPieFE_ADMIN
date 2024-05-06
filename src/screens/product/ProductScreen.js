import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
/* Components */
import HeaderContent from "../../components/HeaderContent";
import Modal from "react-modal";
import Input from "../../components/form/Input";
import FileInput from "../../components/form/FileInput";

import Loader from "../../components/Loader";

import DataTableLoader from "../../components/loader/DataTableLoader";
import Select from "../../components/Select";

import CustomTextarea from "../../components/form/CustomTextarea";

/* Actions */
import {
  listProducts,
  createProduct,
  deleteProduct,
} from "../../actions/productActions";
import { listCategories } from "../../actions/categoryActions";
import { PRODUCT_CREATE_FAIL } from "../../constants/productConstants";

/* Styles */

import Search from "../../components/Search";
import LoaderHandler from "../../components/loader/LoaderHandler";
import Pagination from "../../components/Pagination";
import Message from "../../components/Message";
import "../../style/product.css";
import CustomInput from "../../components/form/CustomInput";

import "../../../src/style/confirmModal.css";
import "../../style/button.css";
import ErrorInput from "../../components/form/ErrorInput";

Modal.setAppElement("#root");

const ProductScreen = ({ history }) => {
  const [name, setName] = useState("");
  const [name_en, setNameEn] = useState("");

  const [size, setSize] = useState({ S: 0, M: 0, L: 0, J: 0 });
  // const [quantity, setQuantity] = useState(0);
  const [category, setCategory] = useState(null);
  const [description, setDescription] = useState("");
  const [description_en, setDescription_en] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorsUpload, setErrorsUpload] = useState("");

  const [productID, setProductID] = useState(null);

  const [keyword, setKeyword] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [isAlert, setIsAlert] = useState(false);

  const dispatch = useDispatch();

  const categoryList = useSelector((state) => state.categoryList);
  const { categories } = categoryList;

  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page, pages } = productList;

  const userLogin = useSelector((state) => state.userLogin);
  const { adminInfo } = userLogin;

  const productCreate = useSelector((state) => state.productCreate);
  const {
    loading: createLoading,
    success: createSuccess,
    error: createError,
  } = productCreate;

  

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);

    refershForm();
  };

  useEffect(() => {
    if (createSuccess) {
      setName("");
      setNameEn("");
      setSize({ S: "", M: "", L: "", J: "" });
      // setQuantity(0);
      setCategory(null);
      setNameEn("");
      setModalIsOpen(false);
      setDescription("");
      setDescription_en("");
      setImage("");
    }
    if (createError) {
      dispatch({ type: PRODUCT_CREATE_FAIL });
      
    }
    dispatch(listProducts(keyword, pageNumber));
  }, [dispatch, history, adminInfo, pageNumber, keyword, createSuccess]);

  const handleSubmit = (e) => {
    e.preventDefault();

    let errorsCheck = {};

    if (!name) {
      errorsCheck.name = "Name is required";
    }
    if (!name) {
      errorsCheck.name_en = "English Name is required";
    }

    // if (!size.S || !size.M || !size.L || !size.J) {
    //     errorsCheck.size = "Price for each size is required";
    //   } else {
    //     // Check if any of the size inputs are empty
    //     for (let key in size) {
    //       if (!size[key]) {
    //         errorsCheck.size = "Price for each size is required";
    //         break;
    //       }
    //     }
    //   }

    //   if (size.S === undefined || size.S === null) {
    //     errorsCheck.size_S = "Price size value is required";
    // }

    // if (size.M === undefined || size.M === null) {
    //     errorsCheck.size_M = "Price size value is required";
    // }

    // if (size.L === undefined || size.L === null) {
    //     errorsCheck.size_L = "Price size value is required";
    // }

    // if (size.J === undefined || size.J === null) {
    //     errorsCheck.size_J = "Price size value is required";
    // }

    // if (!quantity) {
    //   errorsCheck.quantity = "Quantity is required";
    // }

    // if (!category) {
    //   errorsCheck.category = "Category is required";
    // }

    if (Object.keys(errorsCheck).length > 0) {
      setErrors(errorsCheck);
    } else {
      setErrors({});
    }

    if (Object.keys(errorsCheck).length === 0) {
      const product = {
        name: name,
        name_en: name_en,
        size: size,
        // quantity: quantity,
        category_id: category,
        image: image,
        description: description,
        description_en: description_en,
      };
      

      dispatch(createProduct(product));
      // refershForm();
    }
  };

  const deleteRow = (id) => {
    dispatch(deleteProduct(id));
    dispatch(listProducts(keyword, pageNumber));
  };

  const searchCategories = (e) => {
    dispatch(listCategories(e.target.value));
  };

  const renderCategoriesSelect = () => (
    <>
      <h1 style={{ fontSize: 16, fontWeight: "bold" }}>Category</h1>
      <Select
        data={category}
        setData={setCategory}
        items={categories}
        search={searchCategories}
      />
    </>
  );

  const refershForm = () => {
    setName("");
    setNameEn("");
    setSize({ S: "", M: "", L: "", J: "" });
    // setQuantity(0);
    setCategory(null);
    setNameEn("");
    // setModalIsOpen(false);
    setDescription("");
    setDescription_en("");
    setImage("");
  };

  const renderModalCreateProduct = () => (
    <>
      {/* <ModalButton
        modal={modalIsOpen}
        setModal={setModalIsOpen}
        classes={"btn-success btn-md mb-2 fw-bolder"}
      /> */}

      {/* This is modal */}
      {modalIsOpen && (
        <div id="modal" className="registration-form">
          {/* <img src="../../../public/plugins/close.png" className="w-25 h-25"/> */}

          <form style={{ position: "relative" }} onSubmit={handleSubmit}>
            {loading && <Loader variable={loading} />}
            {createError && <Message message={createError} color={"danger"} />}
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
              <h1 className="text-center mb-4">Creat product</h1>
            </span>
            <div className="form-group">
              {/* <input
              type="text"
              
              class="form-control item"
              id="username"
              placeholder="Username"
            /> */}
              <ErrorInput
                className="form-control item"
                name={"Product name"}
                type={"text"}
                data={name}
                setData={setName}
                errors={errors}
                nameError={"name"}
              />
            </div>
            <div className="form-group">
              <ErrorInput
                class="form-control item"
                name={"Product english name"}
                type={"text"}
                data={name_en}
                setData={setNameEn}
                errors={errors}
                nameError={"name_en"}
              />
            </div>

            <div className="form-group">
              <CustomTextarea
                class="form-control item"
                name={"description"}
                type={"text"}
                data={description}
                setData={setDescription}
                errors={errors}
              />
            </div>

            <div className="form-group">
              <CustomTextarea
                class="form-control item"
                name={"English description"}
                type={"text"}
                data={description_en}
                setData={setDescription_en}
                errors={errors}
              />
            </div>
            <div
              style={{
                display: "flex",
                gap: 4,
                justifyContent: "space-between",
              }}
            >
              <div className="form-group">
                <CustomInput
                  class="form-control item"
                  name={"size S"}
                  type={"text"}
                  placeholder={"price"}
                  data={size.S}
                  setData={(newValue) =>
                    setSize({ ...size, S: parseFloat(newValue) || "" })
                  }
                  errors={errors}
                />
              </div>
              <div className="form-group">
                <CustomInput
                  class="form-control item"
                  name={"size M"}
                  type={"text"}
                  placeholder={"price"}
                  data={size.M}
                  setData={(newValue) =>
                    setSize({ ...size, M: parseFloat(newValue) || "" })
                  }
                  errors={errors}
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: 4,
                justifyContent: "space-between",
              }}
            >
              <div className="form-group">
                <CustomInput
                  class="form-control item"
                  name={"size L"}
                  type={"text"}
                  placeholder={"price"}
                  data={size.L}
                  setData={(newValue) =>
                    setSize({ ...size, L: parseFloat(newValue) || "" })
                  }
                  errors={errors}
                />
              </div>
              <div className="form-group">
                <CustomInput
                  class="form-control item"
                  name={"size J"}
                  type={"text"}
                  placeholder={"price"}
                  data={size.J}
                  setData={(newValue) =>
                    setSize({ ...size, J: parseFloat(newValue) || "" })
                  }
                  errors={errors}
                />
              </div>
            </div>

            {/* <div className="form-group">
              <CustomInput
                class="form-control item"
                name={"quantity"}
                type={"number"}
                data={quantity}
                setData={setQuantity}
                errors={errors}
              />
            </div> */}
            {renderCategoriesSelect()}
            {errors.category && (
              <Message message={errors.category} color={"warning"} />
            )}
            <hr />
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
                      setIsAlert(false);
                    }}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
              </div>
            )}
            <div className="form-group">
              <button
                type="submit"
                className="btn  btn-secondary  border border-black "
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

  // upload file
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
        
        setUploading(false);
      }
    }
  };
  const imageName = (image) => {
    const imageArray = image.split(`uploads`);
    return imageArray[1];
  };

  const renderConfirmModal = (productID) => (
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
                deleteRow(productID);
                setProductID(null);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProductsTable = () => (
    <table className="table table-hover text-nowrap">
      <thead>
        <tr className="header_table">
          <th className="border-right border-bottom-0 border-left-0 border-top-0 ">
            Name
          </th>
          <th className="border-right border-bottom-0 border-left-0 border-top-0 ">
            Name English
          </th>
          {/* <th className="border-right border-bottom-0 border-left-0 border-top-0 ">
            Quantity
          </th> */}
          <th className="d-none d-sm-table-cell border-right border-bottom-0 border-left-0 border-top-0 ">
            Category
          </th>
          {/* <th className="d-none d-sm-table-cell">Image</th> */}
          <th className="border-right border-bottom-0 border-left-0 border-top-0"></th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr className="border-right border border-light" key={product.id}>
            <td className="py-4 border-right border border-light">
              {product.name}
            </td>

            <td className="py-4 border-right border border-light">
              {product.name_en}
            </td>
            {/* <td className="py-4 border-right border border-light ">
              {product.quantity}
            </td> */}
            <td className="d-none d-sm-table-cell py-4 border-right border border-light ">
              {!product.category ? "" : product.category.name}
            </td>

            <td className="py-4 border-right border border-light d-flex justify-content-center align items-center">
              {/* <Link
                to={`/product/${product.id}/edit`}
                className="btn btn-warning btn-md px-4 rounded text-white custom_edit_btn"
              >
                Edit
              </Link> */}

              <Link to={`/product/${product.id}/edit`}>
                <button className="btn  btn-light text-sm border border-black mr-4 ">
                  Edit
                </button>
              </Link>

              <button
                className="btn btn btn-light btn-sm border border-black"
                href="#myModal"
                data-toggle="modal"
                onClick={(e) => {
                  setProductID(product.id);
                }}
              >
                Delete
              </button>

              {/* <button
                type="button"
                className=" btn btn-danger btn-md rounded ml-5 custom_delete_btn"
                href="#myModal"
                data-toggle="modal"
                onClick={(e) => {
                  setProductID(product.id);
                }}
              >
                Delete
              </button> */}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <>
      <HeaderContent name={"Products"} />
      {/* Main content */}

      <section className="content">
        <div className="container-fluid">
          {renderModalCreateProduct()}
          {renderConfirmModal(productID)}
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title ">
                    <strong>Products table</strong>
                  </h3>
                  <div className="d-flex justify-content-end">
                    <div className="card-tools">
                      <Search
                        placeholder={"Search by name..."}
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
                    render={renderProductsTable}
                  />
                </div>
                {/* /.card-body */}
              </div>
              <Pagination page={page} pages={pages} setPage={setPageNumber} />
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

export default ProductScreen;
