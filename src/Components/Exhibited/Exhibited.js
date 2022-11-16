import React, { useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Products_data } from './../../Data/Products_data'
import FindProduct from "./.././FindProduct/FindProduct.js"
function Exhibited({ idModal }) {
    const [datap, setDatap] = useState(Products_data);




    return (
        <div >
            <div className="modal fade" id={idModal} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-lg" >
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Productos Exhibidos</h5>
                            <button
                                type="button"
                                style={{ backgroundColor: "transparent", border: 0 }}
                                className="close"
                                data-dismiss="modal"
                                aria-label="Close"

                            >
                                <FontAwesomeIcon icon="close" />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div style={{ float: "right" }}>

                                <button className="btn btn-primary mx-2" type="button" data-toggle="modal" data-target={`#addexhibited`}>Agregar</button>

                            </div>

                            <div style={{ padding: "15px,", marginTop: "2%" }}>
                                <table className="table table-striped table-hover">
                                    <thead>
                                        <tr className="head">
                                            <th>ID</th>
                                            <th>Imagen</th>
                                            <th>Nombre</th>
                                            <th>Color</th>
                                            <th>Código</th>
                                            <th>Subcódigo</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {datap?.map((i, index) => (

                                            <tr>
                                                <td >
                                                    <p>{i.Product_id} </p>
                                                </td>
                                                <td style={{ width: "20%" }}>
                                                    <img src={require('../../assets/product-default-image.png')} style={{ width: "60%" }} alt={index} />
                                                </td>
                                                <td >
                                                    <p>name </p>
                                                </td>
                                                <td >
                                                    <p>color </p>
                                                </td>
                                                <td >
                                                    <p>code</p>
                                                </td>
                                                <td >

                                                    <p>subcode</p>
                                                </td>

                                            </tr>


                                        ))}

                                    </tbody>
                                </table>
                      
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type='submit' className="btn btn-primary">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
export default Exhibited;