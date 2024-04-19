import React from "react";

const ButtonGoBack = ({ history }) => {
    const handleClick = () => {
        history.goBack();
    };

    return (
        <button onClick={handleClick} className="custom_submit_btn">
            Go Back
        </button>
    );
};

export default ButtonGoBack;
