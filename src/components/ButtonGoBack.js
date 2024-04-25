import React from "react";

const ButtonGoBack = ({ history }) => {
    const handleClick = () => {
        history.goBack();
    };

    return (
        <button onClick={handleClick} className="btn  btn-secondary  border border-black ">
            Go Back
        </button>
    );
};

export default ButtonGoBack;
