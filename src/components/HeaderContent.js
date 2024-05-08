import React from 'react';

const HeaderContent = ({name}) => {
    return ( 
        <section className="content-header">
            <div className="container-fluid">
            <div className="row mb-2">
                <div className="col-sm-6">
                <h3>{name}</h3>
                </div>
                
            </div>
            </div>{/* /.container-fluid */}
        </section>
     );
}
 
export default HeaderContent;