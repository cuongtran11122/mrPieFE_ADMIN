import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
/* Components */
import Message from "../../components/Message";
import Select from "../../components/Select";
import Input from "../../components/form/Input";
import FileInput from "../../components/form/FileInput";
import HeaderContent from "../../components/HeaderContent";
import ButtonGoBack from "../../components/ButtonGoBack";
import LoaderHandler from "../../components/loader/LoaderHandler";
import ErrorInput from "../../components/form/ErrorInput";
import CustomInput from "../../components/form/CustomInput";
import CustomTextarea from "../../components/form/CustomTextarea";
import "../../style/product.css";

/* Constants */
import {
  PRODUCT_UPDATE_RESET,
  PRODUCT_DETAILS_RESET,
} from "../../constants/productConstants";

/* Actions */
import { listCategories } from "../../actions/categoryActions";
import {
  updateProduct,
  listProductDetails,
} from "../../actions/productActions";

const ProductEditScreen = ({ history, match }) => {
  const productId = parseInt(match.params.id);

  const [name, setName] = useState("");
  const [name_en, setNameEn] = useState("");
  const [size, setSize] = useState({ S: "", M: "", L: "", J: "" });
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [description_en, setDescription_en] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);

  const [errors, setErrors] = useState({});
  const [errorsUpload, setErrorsUpload] = useState("");
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);

  const { adminInfo } = userLogin;

  const categoryList = useSelector((state) => state.categoryList);
  const { categories } = categoryList;

  //product details state
  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  //product update state
  const productUpdate = useSelector((state) => state.productUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate;

  useEffect(() => {
    //after update redirect to users
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      dispatch({ type: PRODUCT_DETAILS_RESET });
      history.push("/product");
    }

    if (product) {
      //load product data
      if (!product.name || product.id !== productId) {
        dispatch(listProductDetails(productId));
      } else {
        //set states
        setName(product.name);
        setNameEn(product.name_en);
        setCategory(product.category_id);
        setImage(product.image);
        setDescription(product.description);
        setDescription_en(product.description_en);

        const sizePrices = { S: "", M: "", L: "", J: "" };
        product.attributes.forEach((attribute) => {
          sizePrices[attribute.product_size] = attribute.product_price;
        });

        // Update the size state object with the extracted product prices
        setSize(sizePrices);
      }
    }
  }, [dispatch, history, productId, product, successUpdate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    let errorsCheck = {};

    if (!name || name.length > 32) {
      errorsCheck.name = "Name is required and must be maximum 32 characters";
    }

    if (!name_en || name_en.length > 32) {
      errorsCheck.name_en =
        "English name is required and must be maximum 32 characters";
    }

    if(size.S !== ""){
      if (!validatePrice(size.S)) {
        errorsCheck.size_S = "Price must be less than or equal to 10 digits";
      }
    }
    
    if(size.M !== ""){
      if (!validatePrice(size.M)) {
        errorsCheck.size_M = "Price must be less than or equal to 10 digits";
      }
    }
    if(size.L !== ""){
      if (!validatePrice(size.L)) {
        errorsCheck.size_L = "Price must be less than or equal to 10 digits";
      }
    }
    if(size.J !== ""){
      if (!validatePrice(size.J)) {
        errorsCheck.size_J = "Price must be less than or equal to 10 digits";
      }
    }

    if (!description || description.length > 255) {
      errorsCheck.description =
        "Description is required and must be maximum 255 characters";
    }

    if (
      !description_en ||
      description_en.length > 255 ||
      description_en === null
    ) {
      errorsCheck.description_en =
        "English description is required and must be maximum 255 characters";
    }
    

    if (Object.keys(errorsCheck).length > 0) {
      setErrors(errorsCheck);
    } else {
      setErrors({});
    }

    if (Object.keys(errorsCheck).length === 0) {
      dispatch(
        updateProduct({
          id: productId,
          name,
          name_en,
          size,
          category_id: category,
          image,
          description,
          description_en,
        })
      );
    }
  };

  const validatePrice = (price) => {
    const pricePattern = /^\d{1,10}$/;
    return pricePattern.test(price);
  };

  const searchCategories = (e) => {
    dispatch(listCategories(e.target.value));
  };

  const uploadingFileHandler = async (e) => {
    let validFile = true;
    let errorsUp = "";
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

    if (validFile) {
      setErrorsUpload("");
      const formData = new FormData();
      formData.append("image", file);
      setUploading(true);
      try {
        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
        const { data } = await axios.post("/api/v1/upload", formData, config);
        setImage(data);
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

  const renderCategoriesSelect = () => (
    <div className="form-group">
      <label htmlFor="">Category</label>
      <Select
        data={category}
        setData={setCategory}
        items={categories}
        search={searchCategories}
      />
    </div>
  );

  const renderForm = () => (
    <form onSubmit={handleSubmit}>
      <ErrorInput
        name={"Product name"}
        type={"text"}
        data={name}
        setData={setName}
        errors={errors}
        nameError={"name"}
      />
     
     <ErrorInput
        name={"Product english name"}
        type={"text"}
        data={name_en}
        setData={setNameEn}
        errors={errors}
        nameError={"name_en"}
      />

      <CustomTextarea
        class="form-control item"
        name={"description"}
        label={"Description"}
        type={"text"}
        data={description}
        setData={setDescription}
        errors={errors}
      />

      <CustomTextarea
        class="form-control item"
        label={"English description"}
        name={"description_en"}
        type={"text"}
        data={description_en}
        setData={setDescription_en}
        errors={errors}
      />

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
            data={size && size.S}
            setData={(newValue) =>
              setSize({ ...size, S: parseFloat(newValue) || "" })
            }
            errors={errors}
          />
          {errors.size_S && (
            <span className="text-danger text-bold">{errors.size_S}</span>
          )}
        </div>
        <div className="form-group">
          <CustomInput
            class="form-control item"
            name={"size M"}
            type={"text"}
            placeholder={"price"}
            data={size && size.M}
            setData={(newValue) =>
              setSize({ ...size, M: parseFloat(newValue) || "" })
            }
            errors={errors}
          />
          {errors.size_M && (
            <span className="text-danger text-bold">{errors.size_M}</span>
          )}
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
            data={size && size.L}
            setData={(newValue) =>
              setSize({ ...size, L: parseFloat(newValue) || "" })
            }
            errors={errors}
          />
          {errors.size_L && (
            <span className="text-danger text-bold">{errors.size_L}</span>
          )}
        </div>
        <div className="form-group">
          <CustomInput
            class="form-control item"
            name={"size J"}
            type={"text"}
            placeholder={"price"}
            data={size && size.J}
            setData={(newValue) =>
              setSize({ ...size, J: parseFloat(newValue) || "" })
            }
            errors={errors}
          />
          {errors.size_J && (
            <span className="text-danger text-bold">{errors.size_J}</span>
          )}
        </div>
      </div>

      {renderCategoriesSelect()}
      {errors.category && (
        <Message message={errors.category} color={"warning"} />
      )}

      <div className="d-flex mt-5">
        <div className="w-25 h-25">
          <img
            className="profile-user-img img-fluid w-75"
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
      <button
        type="submit"
        className="btn  btn-secondary  border border-black w-25 "
      >
        Submit
      </button>
    </form>
  );

  return (
    <>
      <HeaderContent name={"Products"} />
      <section className="content">
        <div className="container-fluid">
          <ButtonGoBack history={history} />
          <div className="row justify-content-center">
            <div className="col-12 col-md-6">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">
                    <strong>Edit Product</strong>
                  </h3>
                </div>
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

export default ProductEditScreen;
