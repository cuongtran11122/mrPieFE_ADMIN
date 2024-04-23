import React from "react";

const IconGoBack = ({ history }) => {
    const handleClick = () => {
        history.goBack();
    };

    return (
        
        <div onClick={handleClick} className="btn btn-primary ">
            <i className="	fas fa-arrow-left"></i>
            
        </div>
    );
};

export default IconGoBack;
