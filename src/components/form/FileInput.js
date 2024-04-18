import React from "react";
import { capitalize } from "../../utils/functions";
import Loader from "../Loader";

const FileInput = ({ fileHandler, name, image, uploading }) => {
    return (
        <div className="form-group" >
            <label htmlFor={name}>{capitalize(name)}</label>
            <div className="input-group" style={{display:"flex"}} >
                <label style={{  zIndex: 0 }} htmlFor={name} className="custom-file-label">
                    {image}
                </label>
                <input
                    style={{zIndex: -99 }} // Set zIndex to a positive value
                    type="file"
                    className="custom-file-input"
                    aria-describedby={name}
                    id={name}
                    onChange={fileHandler}
                    accept=".jpg, .jpeg, .png"
                />
            </div>
            
            {uploading && <Loader variable={uploading} />}
        </div>
    );
};

export default FileInput;
