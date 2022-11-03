import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { connect } from "react-redux";

import "./ShowOrders.scss";

// prettier-ignore
function ShowOrders({ idModal, details_data, show_data, setShowData, setDetailsData, setOrder, refund=false, ...props }) {

    const { Orders } = props
    // console.log(details_data)

    const [talles, setTalles] = useState('')
    const [color, setColor] = useState(null)

    const details = (product, pro) => {
		// if (employee === null) {
			setDetailsData(product)
			setOrder(pro)
		// } else {
			// setOrderDetail(product)
			// setOrdering(pro)
		// }
	}

    const changetalles = (e) => {
        setTalles(e.target.value)
    }
    const changecolor = (e) => {
        setColor(e.target.value)
    }

    return (
        <div className='showorders'>
			<div className="modal fade" id={idModal} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
				<div className="modal-dialog modal-dialog-centered" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="exampleModalLabel">Productos Details</h5>
							<button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => setShowData(null)}>
								<span aria-hidden="true"><FontAwesomeIcon icon="close"/></span>
							</button>
						</div>
						<div className="modal-body">
                            <div>
                                <select name="color" value={color === null ? '' : color} onChange={changecolor}>
                                    <option value="">Color</option>
                                    {
                                        details_data?.Color.map((co, i) => 
                                            co !== ''
                                            ? <option key={co+i} value={i}>{co}</option>
                                            : null
                                        )
                                    }
                                </select>
                                <select name="talles" value={talles} onChange={changetalles}>
                                    <option value={null}>Talles</option>
                                    {
                                        color !== null
                                        ? details_data?.Size[color].map((si, i) => 
                                            si !== ''
                                            ? <option key={si+i} value={si}>{si}</option>
                                            : null
                                        )
                                        : null
                                    }
                                </select>
                            </div>
                            <div className='table_overflow'>
                                <table className="table table-striped table-hover">
                                    <thead>
                                        <tr>
                                            <th scope="col" className='text-center'>ID</th>
                                            <th scope="col" className='text-center'>Nombre Cliente</th>
                                            <th scope="col" className='text-center'>Deposito</th>
                                            <th scope="col" className='text-center'>Precio Total</th>
                                            <th scope="col" className='text-center'>Productos Total</th>
                                            <th scope="col" className='text-center' style={{ cursor: 'pointer' }}>
                                                Fecha 
                                                {/* {
                                                    arr === 'desc' 
                                                    ? <FontAwesomeIcon icon="angle-down" style={{ color: 'gray', fontSize: 15 }} /> 
                                                    : <FontAwesomeIcon icon="angle-up" style={{ color: 'gray', fontSize: 15 }} />
                                                } */}
                                                </th>
                                            <th scope="col" className='text-center'>Nombre Vendedor</th>
                                            <th scope="col" className='text-center'>Estado Orden</th>
                                            {/* {
                                                refund
                                                    ? <th scope="col" className='text-center'>Reembolso</th>
                                                    : null
                                            } */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            show_data?.map((pro, index) =>
                                                <tr key={index} style={{ cursor: 'pointer' }} onClick={() => { if (!refund) details(Orders?.filter(function (x) { return x.Order_id === undefined ? x.Fecha === pro.Fecha ? x : null : x.Order_id === pro.Order_id ? x : null }), pro) }} data-toggle="modal" data-target="#detailsorder">
                                                    <th scope="row" className='text-center align-middle'>{index + 1}</th>
                                                    <td className='text-center align-middle'>{pro.Client_name}</td>
                                                    <td className='text-center align-middle'>{pro.Deposito_name}</td>
                                                    <td className='text-center align-middle'>${pro.Total_price}</td>
                                                    <td className='text-center align-middle'>{pro.order_product?.length}</td>
                                                    <td className='text-center align-middle'>{pro.Fecha.split(',')[0]}</td>
                                                    <td className='text-center align-middle'>
                                                        {pro.Employee_name}
                                                        {/* <span>{Employee?.filter(item => item.Employee_id === pro.Employee_id)[0]?.First_name} &nbsp;
                                                        {Employee?.filter(item => item.Employee_id === pro.Employee_id)[0]?.Last_name} </span> */}
                                                    </td>
                                                    <td className='text-center align-middle'>
                                                        {
                                                        pro?.Order_status === 'Paid' ? (
                                                            <span className={`${pro?.Order_status === 'Paid' ? 'bg-success' : 'bg-danger'} px-2 py-1 rounded text-light`}>Cobrado</span>
                                                        ) : (
                                                            <span className={`${pro?.Order_status === 'Paid' ? 'bg-success' : 'bg-danger'} px-2 py-1 rounded text-light`}>A cobrar</span>
                                                        )

                                                        }
                                                    </td>
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </table>
                            </div>
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => setShowData(null)}>Close</button>
							{/* <button type="button" className="btn btn-primary" data-dismiss="modal" data-toggle='modal' data-target='#newproduct'>Edit Productos</button> */}
						</div>
					</div>
				</div>
			</div>
		</div>
    );
}

const mapStateToProps = (state) => {
    return {
        Orders: state.Orders,
    };
};

export default connect(mapStateToProps)(ShowOrders);
