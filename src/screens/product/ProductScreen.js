import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
/* Components */
import HeaderContent from "../../components/HeaderContent";
import Modal from "react-modal";
import Input from "../../components/form/Input";
import FileInput from "../../components/form/FileInput";
import ModalButton from "../../components/ModalButton";
import DataTableLoader from "../../components/loader/DataTableLoader";
import Select from "../../components/Select";

/* Actions */
import { listProducts, createProduct, deleteProduct } from "../../actions/productActions";
import { listCategories } from "../../actions/categoryActions";

/* Styles */
import { modalStyles } from "../../utils/styles";
import Search from "../../components/Search";
import LoaderHandler from "../../components/loader/LoaderHandler";
import Pagination from "../../components/Pagination";
import Message from "../../components/Message";

Modal.setAppElement("#root");

const ProductScreen = ({ history }) => {
    const [name, setName] = useState("");
    const [name_en, setNameEn] = useState("");
    const [price, setPrice] = useState(0);
    const [size, setSize] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [category, setCategory] = useState(null);
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [uploading, setUploading] = useState(false);
    const [errors, setErrors] = useState({});

    const [keyword, setKeyword] = useState("");
    const [pageNumber, setPageNumber] = useState(1);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const dispatch = useDispatch();

    const categoryList = useSelector((state) => state.categoryList);
    const { categories } = categoryList;

    const productList = useSelector((state) => state.productList);
    const { loading, error, products, page, pages } = productList;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const productCreate = useSelector((state) => state.productCreate);
    const {
        loading: createLoading,
        success: createSuccess,
        error: createError,
    } = productCreate;

    useEffect(() => {
        if (createSuccess) {
            setName("");
            setNameEn("");
            setPrice(0);
            setQuantity(0);
            setCategory(null);
            setNameEn("");
            setModalIsOpen(false);
            setDescription("");
        }
        dispatch(listProducts(keyword, pageNumber));
    }, [dispatch, history, userInfo, pageNumber, keyword, createSuccess]);

    const handleSubmit = (e) => {
        e.preventDefault();

        let errorsCheck = {};

        if (!name) {
            errorsCheck.name = "Name is required";
        }
        // if (!name) {
        //     errorsCheck.name_en = "English Name is required";
        // }
        if (!price) {
            errorsCheck.price = "Price is required";
        }
        if (!size) {
            errorsCheck.size = "Size is required";
        }

        if (!quantity) {
            errorsCheck.quantity = "Quantity is required";
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
            const product = {
                name: name,
                name_en: name_en,
                price: price,
                size: size,
                quantity: quantity,
                category_id: category,
                image:image,
                description: description
            };

            dispatch(createProduct(product));
        }
    };

    const deleteRow = (id) => {
        dispatch(deleteProduct(id));
    }

    const searchCategories = (e) => {
        dispatch(listCategories(e.target.value));
    };

    const renderCategoriesSelect = () => (
        <Select
            data={category}
            setData={setCategory}
            items={categories}
            search={searchCategories}
        />
    );

    const renderModalCreateProduct = () => (
        <>
            <ModalButton
                modal={modalIsOpen}
                setModal={setModalIsOpen}
                classes={"btn-success btn-lg mb-2"}
            />
            <Modal
                style={modalStyles}
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)} overflow="overflow"
            >
                <LoaderHandler loading={createLoading} error={createError} />
                <h2>Create Form</h2>
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
                    <Input
                        name={"size"}
                        type={"string"}
                        data={size}
                        setData={setSize}
                        errors={errors}
                    />
                    <Input
                        name={"price"}
                        type={"number"}
                        data={price}
                        setData={setPrice}
                        errors={errors}
                    />
                    <Input
                        name={"quantity"}
                        type={"number"}
                        data={quantity}
                        setData={setQuantity}
                        errors={errors}
                    />
                    {renderCategoriesSelect()}
                    {errors.category && (
                        <Message message={errors.category} color={"warning"} />
                    )}
                    <hr />
                    <div className="">
                         
                        <img
                            className="profile-user-img img-fluid  "
                            src={image.length > 0 ? image : 'https://t4.ftcdn.net/jpg/04/70/29/97/360_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg'}
                            alt="User profile picture"
                        />
                    </div>
                    <FileInput
                        fileHandler={uploadingFileHandler}
                        name={"photo"}
                        image={imageName(image)}
                        uploading={uploading}
                    />
                    <button type="submit" className="btn btn-primary">
                        Submit
                    </button>
                    <ModalButton
                        modal={modalIsOpen}
                        setModal={setModalIsOpen}
                        classes={"btn-danger float-right"}
                    />
                </form>
            </Modal>
        </>
    );

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

    const renderProductsTable = () => (
        <table className="table table-hover text-nowrap">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th className="d-none d-sm-table-cell">Category</th>
                    <th className="d-none d-sm-table-cell">Image</th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {products.map((product) => (
                    <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>{product.price}</td>
                        <td>{product.quantity}</td>
                        <td className="d-none d-sm-table-cell">
                            {product.category.name}
                        </td>
                        <td className="d-none d-sm-table-cell">
                            {/* {product.createdAt.slice(0, 10)} */}
                            <div className="">
                                <img
                                    className="profile-user-img img-fluid img-circle"
                                    src={product.image}
                                    alt="User profile picture"
                                />
                            </div>
                        </td>
                        <td>
                            <Link
                                to={`/product/${product.id}/edit`}
                                className="btn btn-warning btn-lg"
                            >
                                Edit
                            </Link>
                        </td>
                        <td>
                        <button
                                type="button"
                                className="btn btn-danger btn-lg btn-mdf"
                                onClick={(e) => {
                                    deleteRow(`${product.id}`)
                                }}
                            >
                                Delete
                            </button>
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

                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">
                                        Products table
                                    </h3>
                                    <div className="card-tools">
                                        <Search
                                            keyword={keyword}
                                            setKeyword={setKeyword}
                                            setPage={setPageNumber}
                                        />
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
                            <Pagination
                                page={page}
                                pages={pages}
                                setPage={setPageNumber}
                            />
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
