import React, { useRef, useState } from "react";

import { ErrorMessage, Field, Form, Formik } from "formik";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import "./TransferStock.scss";
import Dropdown from "../Dropdown/Dropdown";
import OneDetail from "../DetailsProduct/OneDetail";
import { connect } from "react-redux";

// prettier-ignore
function AddExhibited({ idModal}) {

    
    const [sizing, setSizing] = useState(null);
    const [preval, setPreVal] = useState(null);
    const [maxstock, setMaxStock] = useState(0);

    const formref = useRef();



    const initialValues = {
        transferir: "",
        Stock: "",
        Color: "",
        Size: "",
    };


    return (
        <div className="exhibited">
            <div
                className="modal fade"
                id={idModal}
                tabIndex="-1"
                role="dialog"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div
                    className="modal-dialog modal-dialog-centered"
                    role="document"
                >
                    <div className="modal-content">
                        <div className="modal-header d-flex justify-content-center">
                            <h3 className="modal-title" id="exampleModalLabel">
                           Agregar a Exhibidos
                            </h3>
                  
                        </div>
                     
                                    <div className="modal-body">
                                        <OneDetail
                                            name="Deposito"
                                            data={stocknum?.deposito.nombre}
                                        />
                                        <Dropdown
                                            name="transferir"  
                                            // dropvalues={Products.filter((item) => item.nombre === details_data?.nombre).map(val => stocknum?.deposito.nombre === val.deposito.nombre ? null : val.deposito.nombre)}
                                            dropvalues={Deposito.map((d) => stocknum?.deposito.nombre === d.nombre || d.Type === 'Master Manager' ? null : d.nombre)}
                                            value_select={
                                                props.values.transferir
                                            }
                                            onBlur={props.handleBlur}
                                            onChange={settingval}
                                            touched={props.touched.transferir}
                                            errors={props.errors.transferir}
                                        />
                                        <Dropdown
                                            name="Color"
                                            dropvalues={details_data?.Color.map(
                                                (color) => color
                                            )}
                                            value_select={props.values.Color}
                                            onBlur={props.handleBlur}
                                            onChange={settingval}
                                            touched={props.touched.Color}
                                            errors={props.errors.Color}
                                        />
                                        <Dropdown
                                            name="Size"
                                            dropvalues={
                                                sizing === null ? [""] : sizing
                                            }
                                            value_select={props.values.Size}
                                            onBlur={props.handleBlur}
                                            onChange={settingval}
                                            touched={props.touched.Size}
                                            errors={props.errors.Size}
                                        />

                                        <div className="container-fluid">
                                            <div className="row">
                                                <div className="col-4 d-flex align-items-center py-3">
                                                    <span>Stock</span>
                                                </div>
                                   
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            data-dismiss="modal"
                                            onClick={() => {
                                                formref.current.setFieldValue("transferir", "");
                                                formref.current.setFieldValue("Stock", "");
                                                formref.current.setFieldValue("Color", "");
                                                formref.current.setFieldValue("Size", "");
                                            }}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                        >
                                            Transfer
                                        </button>
                                    </div>
                   
                    </div>
                </div>
            </div>
        </div>
    );
}


export default AddExhibited;
