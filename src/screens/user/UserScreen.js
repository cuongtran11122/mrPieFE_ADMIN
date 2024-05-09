import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Input from "../../components/form/Input";
import ModalButton from "../../components/ModalButton";
import { modalStyles } from "../../utils/styles";
import Modal from "react-modal";

/* Components */
import HeaderContent from "../../components/HeaderContent";
// import Input from "../../components/form/Input";
// import ModalButton from "../../components/ModalButton";
// import Modal from "react-modal";

import DataTableLoader from "../../components/loader/DataTableLoader";
import Search from "../../components/Search";
import Pagination from "../../components/Pagination";
import LoaderHandler from "../../components/loader/LoaderHandler";
import "../../style/product.css";
import "../../style/button.css";

/* Actions */
import { listUsers, register } from "../../actions/userActions";

/* Styles */
// import { modalStyles } from "../../utils/styles";

const UserScreen = ({ history }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [pageNumber, setPageNumber] = useState(1);


    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    // const [isAdmin, setIsAdmin] = useState(false);
    const [errors, setErrors] = useState({});
    const [address, setAddress] = useState("");
  
    const dispatch = useDispatch();

  const userList = useSelector((state) => state.userList);
  const { loading, error, users, page, pages } = userList;

  const userLogin = useSelector((state) => state.userLogin);
  const { adminInfo } = userLogin;

  const userRegister = useSelector((state) => state.userRegister);
  const {
    loading: createLoading,
    success: createSuccess,
    error: createError,
  } = userRegister;

    

    useEffect(() => {
        if (adminInfo) {
            dispatch(listUsers(keyword, pageNumber));
        }
        if (createSuccess) {
            setName("");
            setPassword("");
            setEmail("");
            // setIsAdmin(false);
            setAddress("");
            setModalIsOpen(false);
        }
    }, [dispatch, adminInfo, pageNumber, keyword, history, createSuccess]);


  const handleSubmit = (e) => {
    e.preventDefault();

        let errorsCheck = {};
        // if (!name) {
        //     errorsCheck.name = "Name is required";
        // }
        if (!password) {
            errorsCheck.password = "Password is required";
        }

        if (!email) {
            errorsCheck.email = "Email is required";
        }
        if (!name || name.length < 10 || name.length > 32 ) {
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

        if (Object.keys(errorsCheck).length === 0) {
            const user = {
                name: name,
                email: email,
                password: password,
                // isAdmin: isAdmin,
                address: address,
            };

      dispatch(register(user));
    }
  };

  const renderTable = () => (
    <table className="table table-hover text-nowrap">
      <thead>
        <tr className="header_table">
          {/* <th className="d-none d-sm-table-cell">ID</th> */}
          <th className="border-right border-bottom-0 border-left-0 border-top-0 ">
            Name
          </th>
          <th className="border-right border-bottom-0 border-left-0 border-top-0 ">
            Username
          </th>
          <th className="border-right border-bottom-0 border-left-0 border-top-0 ">
            Email
          </th>
          <th className="border-right border-bottom-0 border-left-0 border-top-0 ">
            Phone
          </th>
          <th className="border-right border-bottom-0 border-left-0 border-top-0 ">
            Address
          </th>
          <th className="d-none d-sm-table-cell border-right border-bottom-0 border-left-0 border-top-0">
            Type
          </th>
          <th className="d-none d-sm-table-cell border-right border-bottom-0 border-left-0 border-top-0">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {users?.map((user) => (
          <tr className="border-right border border-light" key={user?.id}>
            {/* <td className="d-none d-sm-table-cell">{user.id}</td> */}
            <td className="py-4 border-right border border-light">
              {user?.name}
            </td>
            <td className="py-4 border-right border border-light">
              {user?.username}
            </td>
            <td className="py-4 border-right border border-light">
              {user?.email}
            </td>
            <td className="py-4 border-right border border-light">
              {user?.phone}
            </td>
            <td className="py-4 border-right border border-light">
              {user?.address}
            </td>

            <td className="d-none d-sm-table-cell py-4 border-right border border-light">
              {user?.username ? "registered" : "unregistered"}
            </td>
            <td className="py-4 border-right border border-light d-flex justify-content-center align items-center">
              <Link
                to={`/list/${user?.id}/orders`}
                className="btn  btn-light text-sm border border-black mr-4"
              >
                List Orders
              </Link>
              <Link
                to={`/user/${user?.id}/edit`}
                className="btn  btn-light text-sm border border-black mr-4"
              >
                Edit
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderModalCreateUser = () => (
    <>
      <ModalButton
        modal={modalIsOpen}
        setModal={setModalIsOpen}
        classes={"btn-success btn-lg mb-2"}
      />
      <Modal
        style={modalStyles}
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
      >
        <h2>Create Form</h2>
        <LoaderHandler loading={createLoading} error={createError} />
        <form onSubmit={handleSubmit}>
          <Input
            name={"name"}
            type={"text"}
            data={name}
            setData={setName}
            errors={errors}
          />
          <Input
            name={"email"}
            type={"email"}
            data={email}
            setData={setEmail}
            errors={errors}
          />
          <Input
            name={"password"}
            type={"password"}
            data={password}
            setData={setPassword}
            errors={errors}
          />

          <hr />
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

  return (
    <>
      {/* Content Header (Page header) */}
      <HeaderContent name={"Users"} />
      {/* Main content */}

      <section className="content">
        <div className="container-fluid">
          {/* {renderModalCreateUser()} */}

          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">
                    <strong>Users List</strong>
                  </h3>
                  <div className="card-tools">
                    <Search
                      placeholder={"Search by name, address, phone, email..."}
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
                    render={renderTable}
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

export default UserScreen;
