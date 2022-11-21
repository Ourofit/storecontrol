import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./ModalProduct.scss";

// prettier-ignore
function ModalProduct({addorder, moreOrder}) {

    const [statePro, setStatePro] = useState('Product')
    const [option, setOption] = useState()

    return (
        <div className="modalproduct">
            <div className="modal fade" id="modalproduct" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document" >
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">
                                Seleccionar producto
                            </h5>
                            <button type="button" className="close" 
                                onClick={() => {
                                    document.getElementById('modalproduct').style.display = 'none'
                                    document.getElementById('modalproduct').classList.remove('show')
                                    document.getElementById('modalproduct').setAttribute('aria-hidden', 'true')
                                    setStatePro('Product')
                                }}
                            >
                                <span aria-hidden="true">
                                    <FontAwesomeIcon icon="close" />
                                </span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                {
                                    moreOrder?.map((order, i) => 
                                        <div className='d-flex justify-content-center align-items-center' key={i}>
                                            <label className={`w-100 form-check-label d-flex justify-content-between align-items-center ${option !== undefined && option === order.scan.Color[order.h] ? 'form-check-label-active' : null}`} htmlFor={order.scan.Color[order.h]}>
                                                <div>
                                                    <span style={{fontSize: 20}}>{order.scan.Color[order.h]}</span>
                                                </div>
                                                <input className="form-check-input" type="radio" name="pro" value={order.scan.Color[order.h]} id={order.scan.Color[order.h]} onChange={(e) => setOption(e.target.value)} />
                                            </label>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                        <div className="modal-footer">
                            <div className="container-fluid m-0">
                                <div className="row">
                                    {/* <div className="col p-0">
                                        <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={() => return_type === 'Devolver el Producto' ? returnProduct(return_val) : Submit()}>
                                            No
                                        </button>
                                    </div> */}
                                    {/* <div className="col p-0"> */}
                                        <button type="button" data-toggle="modal" data-target="#modalproduct" className="btn btn-primary">
                                            Submit
                                        </button>
                                    {/* </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalProduct;
