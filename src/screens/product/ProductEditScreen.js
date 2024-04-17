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
import CustomInput from "../../components/form/CustomInput";

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

  const [quantity, setQuantity] = useState(0);
  const [size, setSize] = useState({ S: "", M: "", L: "", J: "" });
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);

  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

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

        setSize(product.size_S)
        setSize(product.size_M)
        setSize(product.size_L)
        setSize(product.size_J)
        setQuantity(product.quantity);
        setCategory(product.category_id);
        setImage(product.image);
        setDescription(product.description);
      }
    }
  }, [dispatch, history, productId, product, successUpdate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    let errorsCheck = {};

    if (!name) {
      errorsCheck.name = "Name is required";
    }
    if (!name) {
      errorsCheck.name_en = "English name is required";
    }

    if (!quantity) {
      errorsCheck.quantity = "quantity is required";
    }
    // if (!category) {
    //     errorsCheck.category = "Category is required";
    // }

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
          quantity,
          size,
          category_id: category,
          image,
          description,
        })
      );
    }
  };

  const searchCategories = (e) => {
    dispatch(listCategories(e.target.value));
  };

  // upload file
  const uploadingFileHandler = async (e) => {
    //get first element from files which one is the image
    const file = e.target.files[0];
    //form instance
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
      //console.log(file);return false;
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
      <Input
        name={"name"}
        type={"text"}
        data={name}
        setData={setName}
        errors={errors}
      />
      <Input
        name={"name_en"}
        type={"text"}
        data={name_en}
        setData={setNameEn}
        errors={errors}
      />

      <Input
        name={"description"}
        type={"text"}
        data={description}
        setData={setDescription}
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
          {/* <CustomInput
                  class="form-control item"
                  name={"size_S"}
                  type={"text"}
                  placeholder={"price"}
                  data={size.S}
                  setData={(newValue) =>
                    setSize({ ...size, S: parseFloat(newValue) || "" })
                  }
                  errors={errors}
                /> */}
          <CustomInput
            class="form-control item"
            name={"size_S"}
            type={"text"}
            placeholder={"price"}
            data={size && size.S} // Check if size is not null or undefined before accessing its properties
            setData={
              (newValue) => setSize({ ...size, S: parseFloat(newValue) || "" }) // Update only the 'S' property
            }
            errors={errors}
          />
        </div>
        <div className="form-group">
        <CustomInput
            class="form-control item"
            name={"size_M"}
            type={"text"}
            placeholder={"price"}
            data={size && size.M} // Check if size is not null or undefined before accessing its properties
            setData={
              (newValue) => setSize({ ...size, M: parseFloat(newValue) || "" }) // Update only the 'S' property
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
          {/* <CustomInput
                  class="form-control item"
                  name={"size_S"}
                  type={"text"}
                  placeholder={"price"}
                  data={size.S}
                  setData={(newValue) =>
                    setSize({ ...size, S: parseFloat(newValue) || "" })
                  }
                  errors={errors}
                /> */}
          <CustomInput
            class="form-control item"
            name={"size_L"}
            type={"text"}
            placeholder={"price"}
            data={size && size.L} // Check if size is not null or undefined before accessing its properties
            setData={
            (newValue) => setSize({ ...size, L: parseFloat(newValue) || "" }) // Update only the 'S' property
            }
            errors={errors}
          />
        </div>
        <div className="form-group">
        <CustomInput
            class="form-control item"
            name={"size_J"}
            type={"text"}
            placeholder={"price"}
            data={size && size.J} // Check if size is not null or undefined before accessing its properties
            setData={
              (newValue) => setSize({ ...size, J: parseFloat(newValue) || "" }) // Update only the 'S' property
            }
            errors={errors}
          />
        </div>
      </div>

      <div className="form-group">
              <CustomInput
                class="form-control item"
                name={"quantity"}
                type={"number"}
                data={quantity}
                setData={setQuantity}
                errors={errors}
              />
            </div>

      {/* <Input
        name={"quantity"}
        type={"number"}
        data={quantity}
        setData={setQuantity}
        errors={errors}
      /> */}

      {renderCategoriesSelect()}
      {errors.category && (
        <Message message={errors.category} color={"warning"} />
      )}
      <div className="">
        {/* <img
          className="profile-user-img img-fluid"
          src={image}
          alt="User profile picture"
        /> */}
        <img
                className="profile-user-img img-fluid  "
                src={
                  image.length > 0
                    ? image
                    : "https://t4.ftcdn.net/jpg/04/70/29/97/360_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg"
                }
                alt="User profile picture"
              />
      </div>
      <FileInput
        fileHandler={uploadingFileHandler}
        name={"photo"}
        image={imageName(image)}
        uploading={uploading}
      />

      <hr />
      <button type="submit" className="btn btn-success">
        Submit
      </button>
    </form>
  );

  return (
    <>
      {/* Content Header (Page header) */}
      <HeaderContent name={"Products"} />

      {/* Main content */}
      <section className="content">
        <div className="container-fluid">
          <ButtonGoBack history={history} />
          <div className="row justify-content-center">
            <div className="col-12 col-md-6">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Edit Product</h3>
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

export default ProductEditScreen;
