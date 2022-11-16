import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import axios from "axios";

import "./OrderList.scss";
// import FindProduct from '../../Components/FindProduct/FindProduct'
// import { Products_data } from "../../Data/Products_data";
// import { Employee_master } from "../../Data/Employee_master";
import { connect } from "react-redux";
import Dropdown from "../Dropdown/Dropdown";
// import { Categoria } from "../../Data/Categories";
// import { Order_master } from '../../Data/Order_master'

// prettier-ignore
function OrderList({ details_data, setDetailsData, order, setOrder, particularOrder, componentRef, handlePrint, paymentType, setPaymentType, addorder, client_name, setClientName, deposito_err, setDepositoErr, employee_name, setEmployeeName, allpro, setAllPro, ...props }) {

	const { Products, CategoryAdd, DepositoAdd, Status, Orders } = props
	const [product, setProduct] = useState(null)
	const [employee, setEmployee] = useState(null)
	const [employee_err,] = useState('Required')
	const loop = useRef(true)
	// console.log(order, details_data, product)

	useEffect(() => {
		// console.log('--------OrderList--------')
		var result = []
		if(order?.Employee_name !== undefined) {
			setEmployeeName(order.Employee_name)
			setPaymentType(order.Tipo_de_Cliente)
			if(order?.order_product !== undefined) {
				for(var k=0; k < order?.order_product.length; k++) {
					var pro1
					for(var l=0; l < Products.length; l++) {
						if(Products[l].Product_id === order?.order_product[k]?.Product_id) {
							pro1 = Products[l]
						}
					}
					result.push(pro1)
				}
			} else {
				var pro
				for(var i=0; i < details_data?.length; i++) {
					for(var p=0; p < Products.length; p++) {
						if(Products[p].Product_id === details_data[i]?.Product_id) {
							pro = Products[p]
						}
					}
				}
				result.push(pro)
			}
		}
		async function pro_method() {
			
        }
		if(loop.current) {
			pro_method()
			loop.current = false
		}
		// console.log('OrderList', details_data, result)
		var DepositoLogin = JSON.parse(localStorage.getItem('DepositoLogin'))
		var deposit = DepositoAdd.find(item => item.Deposito_id === DepositoLogin.Deposito_id)
		// console.log(deposit)
		if(deposit) {
			setEmployee(JSON.parse(deposit.Employee_list))
		}
		// setEmployee(Employee?.filter(function(x){return x.Employee_id === order?.Employee_id})[0])
		setProduct(result)
		
		var barc = ''
		const handleBarcode = (event) => {
			if(event.code === 'Enter') {
				var scan
				var flag = 0
				var prod = Products.filter(item => item.deposito.nombre === DepositoLogin.nombre)
				console.log(prod)
				for(var j=0; j < prod.length; j++) {
					// if(prod[j].deposito.nombre === Employee[0].deposito.nombre) {
						// console.log(prod[j].deposito.nombre, Employee[0].deposito.nombre)
						// setDepositoErr(false)
						for(var h=0; h<prod[j].codigo.length; h++) {
							for(var r=0; r<prod[j].codigo[h].length; r++) {
								if(prod[j].codigo[h][r] === barc) {
									// console.log(prod[j].Stock[h][r] !== 0)
									if(prod[j].Stock[h][r] !== 0) {
										setDepositoErr('')
										scan = prod[j]
										addorder(scan, barc, h, r)
										flag = 0
									} else {
										setDepositoErr(`No hay existencias en ${DepositoLogin.nombre}`)
									}
									return
								} else {
									flag = 1
								}
							}
						}
						// flag = 0
						// return
					// } else {
					// 	flag = 1
					// }
				}
				if(flag === 1) {
					setDepositoErr(`El producto no está presente en su tienda (${DepositoLogin.nombre})`)
				} else if(flag === 2) {
					
				}
				barc = ''
				return
			}
			if(event.key !== 'Shift') barc += event.key
		}

		window.addEventListener('keydown', handleBarcode);
		
		return() => {
			window.removeEventListener('keydown', handleBarcode)
		}
	}, [Products, addorder, details_data, setDepositoErr, DepositoAdd, Status, setPaymentType, setEmployeeName, order, setDetailsData, Orders])

	const qtychange = (val, code, pro) => {
		var pricing = 0
		for(var i=0; i < details_data.length; i++) {
			if(details_data[i].code === code) {
				if(paymentType === 'Compras por Mayor') {
					pricing = pro.costoCompra[details_data[i].parentArray][details_data[i].childArray]
				} else if(paymentType === 'Compra por menor') {
					pricing = pro.costoMenor[details_data[i].parentArray][details_data[i].childArray]
				}
				setDetailsData([
					...details_data.slice(0,i), 
					{
						...details_data[i], 
						Qty: val === 'minus' ? details_data[i].Qty - 1 : details_data[i].Qty + 1,
						Total_price: val === 'minus' ? pricing * (details_data[i].Qty - 1) : pricing * (details_data[i].Qty + 1)
					}, 
					...details_data.slice(i+1, details_data.length)
				])
				setOrder({...order, Total_price: val === 'minus' ? order.Total_price - pricing : order.Total_price + pricing})
				return
			}
		}
	}

	const deletingproduct = (e, val) => {
		e.preventDefault()
		if(details_data.length === 1) {
			setDetailsData(null)
			setOrder(null)
		} else {
			setDetailsData(details_data.filter(function(x) {return !(x.Product_id === val.Product_id && x.parentArray === val.parentArray && x.childArray === val.childArray)}))
			setOrder({...order, Total_price: order.Total_price - val.Total_price})
		}
	}

	const handleRadio = (e) => {
		setPaymentType(e.target.value)
		var pricing = 0
		var details = details_data
		var orders = order
		for(var i=0; i < details_data?.length; i++) {
			for(var j=0; j < Products.length; j++) {
				if(details_data[i].Product_id === Products[j].Product_id) {
					if(e.target.value === 'Compras por Mayor') {
						pricing = Products[j].costoCompra[details_data[i].parentArray][details_data[i].childArray]
					} else if(e.target.value === 'Compra por menor') {
						pricing = Products[j].costoMenor[details_data[i].parentArray][details_data[i].childArray]
					}
					let item = {...details[i]};
					var pre_price = item.Total_price
					item.Total_price = pricing * details[i].Qty;
					details[i] = item;
					orders.Total_price = orders.Total_price + (pricing * details[i].Qty) - pre_price
					// setDetailsData([
					// 	...details_data.slice(0,i), 
					// 	{
					// 		...details_data[i], 
					// 		Total_price: pricing * details_data[i].Qty
					// 	}, 
					// 	...details_data.slice(i+1, details_data.length)
					// ])
					// setOrder({...order, Total_price: order.Total_price + (pricing * details_data[i].Qty) - details_data[i].Total_price})
				}
			}
		}
	}
	
	// const barcode = (e) => {
	// 	var DepositoLogin = JSON.parse(localStorage.getItem('DepositoLogin'))
	// 	var scan
	// 	var flag = 0
	// 	var prod = Products.filter(item => item.deposito.nombre === DepositoLogin.nombre)
	// 	// console.log(prod)
	// 	for(var j=0; j < prod.length; j++) {
	// 		// if(prod[j].deposito.nombre === Employee[0].deposito.nombre) {
	// 			// console.log(prod[j].deposito.nombre, Employee[0].deposito.nombre)
	// 			// setDepositoErr(false)
	// 			for(var h=0; h<prod[j].codigo.length; h++) {
	// 				for(var r=0; r<prod[j].codigo[h].length; r++) {
	// 					if(prod[j].codigo[h][r] === e.target.value) {
	// 						// console.log(prod[j].Stock[h][r] !== 0)
	// 						if(prod[j].Stock[h][r] !== 0) {
	// 							setDepositoErr('')
	// 							scan = prod[j]
	// 							addorder(scan, e.target.value, h, r)
	// 							flag = 0
	// 						} else {
	// 							setDepositoErr(`No hay existencias en ${DepositoLogin.nombre}`)
	// 						}
	// 						return
	// 					} else {
	// 						flag = 1
	// 					}
	// 				}
	// 			}
	// 			// flag = 0
	// 			// return
	// 		// } else {
	// 		// 	flag = 1
	// 		// }
	// 	}
	// 	if(flag === 1) {
	// 		setDepositoErr(`El producto no está presente en su tienda (${DepositoLogin.nombre})`)
	// 	} else if(flag === 2) {
			
	// 	}
	// 	// console.log(e.target.value)
	// 	// for(var j=0; j < Products_data.length; j++) {
	// 	// 	if(Products_data[j].codigo === e.target.value) {
	// 	// 		scan = Products_data[j]
	// 	// 		addorder(scan)
	// 	// 		document.getElementsByName('barcode_scan')[0].value = ''
	// 	// 		break
	// 	// 	}
	// 	// }
	// }

	const settingval = (name,val) => {
		setDepositoErr('')
		setEmployeeName(val)
	}

	return (
		<div className='orderlist' ref={componentRef}>
			<div className='container-fluid'>
				<div className='order_details mb-5'>
					<div className='container-fluid'>
						<div className='row'>
							<div className='col-md'>
								{/* <div className='order_id'>
									<span>Orden ID: </span>
									<span>{order?.Order_id}</span>
								</div> */}
								<div className='order_client my-1'>
									{/* <span>Nombre Vendedor: </span> */}
									{
										order?.createdAt
										? <>
											<span>Nombre Vendedor: </span>
											<span>{order.Employee_name}</span>
										</>
										:<Dropdown name='Nombre Vendedor :' dropvalues={employee?.map((emp) => emp)} inputbox={true} value_select={employee_name} onChange={settingval} errors={employee_err} />
									}
									{/* <span>{employee?.First_name} {employee?.Last_name}</span> */}
								</div>
								<div className='order_date'>
									<span>Fecha orden: </span>
									<span>{order?.Fecha}</span>
								</div>
								<div className='order_price'>
									<span>Precio Total: </span>
									<span>${order?.Total_price}</span>
								</div>
							</div>
							<div className='col-md'>
								<div className='order_status my-1'>
									<span>Orden Estado: </span>
									{order?.Order_status === 'Paid' ? (
										<span className={`${order?.Order_status === 'Paid' ? 'bg-success' : 'bg-danger'} px-2 py-1 rounded text-light`}>Cobrado</span>
									) : (
										<span className={`${order?.Order_status === 'Paid' ? 'bg-success' : 'bg-danger'} px-2 py-1 rounded text-light`}>A cobrar</span>
									)}
								</div>
								<div className='order_payment'>
									<span>Tipo de Cliente:</span>
									{
										order?.createdAt
										? <span>{order.Tipo_de_Cliente}</span>
										: <div>
											<div className='py-2 d-flex align-items-center'>
												<input className="form-check-input" type="radio" name="paymentType" value='Compras por Mayor' id="flexRadioDefault2" onChange={handleRadio} checked={paymentType === 'Compras por Mayor'} />
												<label className="form-check-label px-2" htmlFor="flexRadioDefault2">
													Compras por Mayor
												</label>
											</div>
											<div className='py-2 d-flex align-items-center'>
												<input className="form-check-input" type="radio" name="paymentType" value='Compra por menor' id="flexRadioDefault3" onChange={handleRadio} />
												<label className="form-check-label px-2" htmlFor="flexRadioDefault3">
													Compra por menor
												</label>
											</div>
										</div>
									}
								</div>
							</div>
						</div>
					</div>
				</div>
				<fieldset>
					<legend>
						Productos Pedidos
					</legend>
					<div className='product_btn'>
						<div className='btn_print px-2'>
							<div>
								{
									deposito_err !== ''
									? <span style={{color: 'red'}}>{deposito_err}</span>
									: null
								}
							</div>
							{/* <input type='text' name='barcode_scan' onChange={barcode} autoFocus /> */}
							<button className='btn border border-dark' onClick={handlePrint}><FontAwesomeIcon icon="print"/></button>
						</div>
					</div>
					<div>
						{/* {console.log('OrderList Main', details_data)} */}
						{
							details_data?.map((item, index) => 
								<div className='productorder' key={index}>
									{/* {console.log('OrderList Loop', product[index]?.Product_id, item.Product_id, index)} */}
									<div className='row'>
										<div className='col-md-2'>
											<div className='image_display'>
												<div className='image_outside'>
													{/* {Products.filter(pro => pro.Product_id === item.Product_id)} */}
													{
														Products.filter(pro => pro.Product_id === item.Product_id)[0].Image.length === 0 ||
														Products.filter(pro => pro.Product_id === item.Product_id)[0].Image[0].length === 0
														? <img src={require('../../assets/product-default-image.png')} alt={index} />
														: <img src={Products.filter(pro => pro.Product_id === item.Product_id)[0].Image[0][0].url} alt={index} />
													}
												</div>
											</div>
										</div>
										<div className='col-md-8'>
											<div className='product_data'>
												<div className='container-fluid d-flex flex-column justify-content-between h-100'>
													<div className='row'>
														<div className='col-md'>
															<div className='product_name'>
																<span>{product[index]?.nombre}</span>
															</div>
														</div>
														<div className='col-md deposito_col'>
															<div>
																<span>{product[index]?.deposito.nombre}</span>
															</div>
														</div>
													</div>
													<div className='row'>
														<div className='col-md first_col'>
															<div className='product_qty'>
																<span style={{fontWeight: 600}}>Qty: </span>
																<button className='btn btn-primary' onClick={() => qtychange('minus', item.code, product[index])} disabled={item.Qty <= 1}>
																	<FontAwesomeIcon icon="circle-minus" />
																</button>
																<span> {item.Qty} </span>
																<button className='btn btn-primary' onClick={() => qtychange('plus', item.code, product[index])} disabled={item.Qty >= product[index]?.Stock[item.parentArray][item.childArray]}>
																	<FontAwesomeIcon icon="circle-plus" />
																</button>
															</div>
															<div className='product_price'>
																
																<span style={{fontSize: 18}}>${item.Total_price}</span>
															</div>
														</div>
														<div className='col-md second_col'>
															<div>
																<span>{CategoryAdd?.filter(function (x) {return x.Category_id === product[index]?.Category_id;})[0]?.Name}</span>
															</div>
														</div>
														<div className='col-md third_col'>
															<div>
																<span style={{fontWeight: '600'}}>Color: {product[index]?.Color[item.parentArray]}</span>
															</div>
															<div>
																<span style={{fontWeight: '600'}}>Talle: {product[index]?.Size[item.parentArray][item.childArray]}</span>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
										<div className='col-md-2'>
											<div className='delete_btn'>
												{/* <button className='btn border border-dark' data-toggle='modal' data-target='#editorder' onClick={() => particularOrder(index)}>
													<FontAwesomeIcon icon="edit"/>
												</button> */}
												<button type="button" className='btn text-light bg-danger' onClick={(e) => deletingproduct(e, item)}><FontAwesomeIcon icon="trash"/></button>
											</div>
										</div>
									</div>
								</div>
							)
						}
					</div>
				</fieldset>
			</div>
		</div>
	)
}

const mapStateToProps = (state) => {
    return {
        Products: state.Products,
        CategoryAdd: state.CategoryAdd,
        Employee: state.Employee,
        DepositoLogin: state.DepositoLogin,
        DepositoAdd: state.Deposito,
        Status: state.Status,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        allproduct: (val) => {
            dispatch({
                type: "PRODUCTS",
                item: val,
            });
        },
        category: (val) => {
            dispatch({
                type: "CATEGORYADD",
                item: val,
            });
        },
        DepositoLog: (val) => {
            dispatch({
                type: "DEPOSITOLOGIN",
                item: val,
            });
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderList);
