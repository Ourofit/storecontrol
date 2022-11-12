import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Overall from "../../Components/Overall/Overall";

// import { Order_master } from "../../Data/Order_master";
// import { Employee_master } from "../../Data/Employee_master";
// import { Order_product } from "../../Data/Order_product";

import "./Orders.scss";
import DetailsOrder from "../../Components/DetailsOrder/DetailsOrder";
import EditOrder from "../../Components/EditOrder/EditOrder";
import AdminOrder from "../../Components/AdminOrder/AdminOrder";
import { connect } from "react-redux";
import AreYouSure from "../../Components/AreYouSure/AreYouSure";
import axios from "axios";
// import { store_Orders } from "../../Functions/AllFunctions";
// import FindProduct from '../../Components/FindProduct/FindProduct'

// prettier-ignore
function Orders({ setOrderDetails, setOrdering, boxes = false, employee = null, refund = false, seRefund, searchbox = true, ...props }) {

	const { Orders, Sales_Activity, allsalesactivity, Status, allproduct, Products, allorders} = props

	const [arr, setArr] = useState('desc')
	const [search, setSeatrch] = useState('')
	const [allorder, setAllOrders] = useState()
	const [details_data, setDetailsData] = useState(null)
	const [order, setOrder] = useState(null)
	const [particular, setparticular] = useState(null)
	const [searching_val, ] = useState('Nombre Cliente')
	const [return_val, setReturnVal] = useState()
	const [returned_data, setReturnedData] = useState(null)
	const loop = useRef(true)

	useEffect(() => {
		async function order_data() {
			// await store_Orders('Orders', Status, Orders, allorders, notify)
			// if(Orders.length === 0) {
			// 	if(Status) {
			// 		await axios.get('http://localhost:5000/ordermaster')
			// 		.then(async (item) => {
			// 				console.log('Orders -> Orders')
			// 				item.data.sort(function (d1, d2) {
			// 					return new Date(d2.createdAt) - new Date(d1.createdAt);
			// 				});
			// 				allorders(item.data)
			// 				if(window.desktop) {
			// 					var flag = 0
			// 					await window.api.getAllData("Orders").then((item) => {
			// 						item.Orders.forEach(async function (ord, index) {
			// 							if(!Object.keys(ord).includes("Order_id")) {
			// 								flag = 1
			// 								return
			// 							}
			// 						})
			// 					});
			// 					if(flag === 0) {
			// 						// console.log('There is no values to save')
			// 						await window.api.addData(item.data, "Orders")
			// 					}
            //                 }
			// 			})
			// 	} else {
			// 		if(window.desktop) {
            //             await window.api.getAllData("Orders").then((item) => {
			// 				item.Orders.sort(function (d1, d2) {
			// 					return new Date(d2.createdAt) - new Date(d1.createdAt);
			// 				});
			// 				allorders(item.Orders)
			// 			});
			// 			await window.api.getAllData("Notification").then((item) => notify(item.Notification))
            //         }
			// 	}
			// }
		}
		if (loop.current) {
			order_data()
			loop.current = false
		}
		
		async function order_storing() {
			if(employee !== null) {
				var result = []
				for (var i = 0; i < Orders.length; i++) {
					if (Orders[i].Deposito_name === employee) {
						result.push(Orders[i])
					}
				}
				setAllOrders(result)
			} else {
				setAllOrders(Orders)
			}
		}
		order_storing()
	}, [Orders, employee])

	const onChange = (e) => {
		setSeatrch(e.target.value)
		var result = []
		if(e.target.value !== '') {
			for (var i = 0; i < Orders.length; i++) {
				if(searching_val === 'Nombre Vendedor') {
					var fullname = Orders[i].Employee_name
					if (fullname.toUpperCase().indexOf(e.target.value.toUpperCase()) > -1) {
						result.push(Orders[i])
					}
				} else {
					var client = Orders[i].Client_name
					if(client.toUpperCase().indexOf(e.target.value.toUpperCase()) > -1) {
						result.push(Orders[i])
					}
				}
			}
		} else {
			result = Orders
		}
		setAllOrders(result)
	}

	const details = (product, pro) => {
		if (employee === null) {
			setDetailsData(product)
			setOrder(pro)
		} else {
			setOrderDetails(product)
			setOrdering(pro)
		}
	}

	const particularOrder = (index) => {
		setparticular(index)
	}

	const arrange = () => {
		setArr(arr === 'desc' ? 'asec' : 'desc')
		if(arr === 'desc') {
			allorder.sort(function (d1, d2) {
				return new Date(d1.createdAt) - new Date(d2.createdAt);
			});
		} else {
			allorder.sort(function (d1, d2) {
				return new Date(d2.createdAt) - new Date(d1.createdAt);
			});
		}
	}

	const returnProduct = async (val) => {
		if(details_data[0].order_product.length === 1) {
			setDetailsData(null)
			setOrder(null)
			var stock = Products.filter((p) => p.Product_id === details_data[0].order_product[0].Product_id)[0].Stock
			var total_stock = stock[details_data[0].order_product[0].parentArray][details_data[0].order_product[0].childArray] + details_data[0].order_product[0].Qty
			stock[details_data[0].order_product[0].parentArray][details_data[0].order_product[0].childArray] = total_stock
			var req_data = {
				Product_id: details_data[0].order_product[0].Product_id,
				Stock: JSON.stringify(stock)
			}
			var single_pro = Products.findIndex((p) => p.Product_id === details_data[0].order_product[0].Product_id)
			Products[single_pro].Stock = stock
			allproduct(Products)
			// console.log(Products[single_pro].Stock)
			if(window.desktop) {
				await window.api.addData(Products, "Products");
			}
			if(Status) {
				await axios.put('http://localhost:5000/product/quantity', req_data)
				await axios.delete(`http://localhost:5000/ordermaster/delete/${order.Order_id}`)
				await axios.delete(`http://localhost:5000/orderproduct/delete/${val.Order_pro_id}`)
				.then(async item => {
					await axios.get('http://localhost:5000/ordermaster')
						.then(async prod => {
							let months_data = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
							prod.data.sort(function (d1, d2) {
								return new Date(d2.createdAt) - new Date(d1.createdAt);
							});
							allorders(prod.data)
							if(window.desktop) {
								await window.api.addData(prod.data, "Orders")
							}
							var year = new Date(order.createdAt).getFullYear()
							var month = new Date(order.createdAt).getMonth()
							var date = new Date(order.createdAt).getDate()
							var tot = 0
							for(var q=0; q<prod.data.length; q++) {
								if(new Date(prod.data[q].createdAt).toDateString() === new Date(order.createdAt).toDateString()) {
									tot = prod.data[q].Total_price + tot
								}
							}
							var index = Sales_Activity.findIndex(item => item.year === year)
							Sales_Activity[index][months_data[month]][date-1].sales = tot
							for(var t=0; t < Sales_Activity.length; t++) {
								for(var m=0; m < months_data.length; m++) {
									Sales_Activity[t][months_data[m]] = JSON.stringify(Sales_Activity[t][months_data[m]])
								}
							}
							await axios.put('http://localhost:5000/salesactivity/day', {
								Sales_id: Sales_Activity[index].Sales_id,
								...Sales_Activity[index]
							})
							await axios.get('http://localhost:5000/salesactivity')
								.then(async item => {
									for(var t=0; t < item.data.length; t++) {
										for(var m=0; m < months_data.length; m++) {
											item.data[t][months_data[m]] = JSON.parse(item.data[t][months_data[m]])
										}
									}
									allsalesactivity(item.data)
								})
						})
				})
			} else {
				var ord = Orders.filter(x => x.Order_id === undefined ? x.Fecha !== order.Fecha ? x : null : x.Order_id !== order.Order_id ? x : null)
				ord.sort(function (d1, d2) {
					return new Date(d2.createdAt) - new Date(d1.createdAt);
				});
				allorders(ord)
				if(window.desktop) {
					await window.api.addData(ord, "Orders")
					var ord_ret2 = []
					await window.api.getAllData('Orders_Returns').then(async return_ord => {
						// console.log(return_ord.Orders_Returns)
						if(return_ord.Orders_Returns) {
							ord_ret2 = return_ord.Orders_Returns
						}
						var extra = {
							...req_data,
							order: order,
							del: true,
							val: val
						}
						ord_ret2.push(extra)
						// console.log(ord_ret)
						await window.api.addData(ord_ret2, "Orders_Returns")
					})
				}
			}
		} else {
			var stock_el = Products.filter((p) => p.Product_id === val.Product_id)[0].Stock
			var total_stock_el = stock_el[val.parentArray][val.childArray] + val.Qty
			stock_el[val.parentArray][val.childArray] = total_stock_el
			var req_data_el = {
				Product_id: val.Product_id,
				Stock: JSON.stringify(stock_el)
			}
			var single_pro_el = Products.findIndex((p) => p.Product_id === val.Product_id)
			Products[single_pro_el].Stock = stock_el
			allproduct(Products)
			// console.log(Products[single_pro_el].Stock)
			if(window.desktop) {
				await window.api.addData(Products, "Products");
			}
			var spec = details_data[0].order_product.filter(function(x) {return !(x.Order_pro_id === val.Order_pro_id)})
			details_data[0].order_product = spec
			setDetailsData(details_data)
			setOrder({...order, Total_price: order.Total_price - val.Total_price})
			if(Status) {
				await axios.put('http://localhost:5000/product/quantity', req_data_el)
				await axios.put(`http://localhost:5000/ordermaster/price`, {
					Order_id: order.Order_id,
					Total_price: order.Total_price - val.Total_price
				})
				await axios.delete(`http://localhost:5000/orderproduct/delete/${val.Order_pro_id}`)
					.then(async item => {
						await axios.get('http://localhost:5000/ordermaster')
							.then( async prod => {
								let months_data = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
								prod.data.sort(function (d1, d2) {
									return new Date(d2.createdAt) - new Date(d1.createdAt);
								});
								allorders(prod.data)
								if(window.desktop) {
									await window.api.addData(prod.data, "Orders")
								}
								var year = new Date(order.createdAt).getFullYear()
								var month = new Date(order.createdAt).getMonth()
								var date = new Date(order.createdAt).getDate()
								var tot = 0
								for(var q=0; q<prod.data.length; q++) {
									if(new Date(prod.data[q].createdAt).toDateString() === new Date(val.createdAt).toDateString()) {
										tot = prod.data[q].Total_price + tot
									}
								}
								var index = Sales_Activity.findIndex(item => item.year === year)
								Sales_Activity[index][months_data[month]][date-1].sales = tot
								for(var t=0; t < Sales_Activity.length; t++) {
									for(var m=0; m < months_data.length; m++) {
										Sales_Activity[t][months_data[m]] = JSON.stringify(Sales_Activity[t][months_data[m]])
									}
								}
								await axios.put('http://localhost:5000/salesactivity/day', {
									Sales_id: Sales_Activity[index].Sales_id,
									...Sales_Activity[index]
								})
								await axios.get('http://localhost:5000/salesactivity')
									.then(async item => {
										for(var t=0; t < item.data.length; t++) {
											for(var m=0; m < months_data.length; m++) {
												item.data[t][months_data[m]] = JSON.parse(item.data[t][months_data[m]])
											}
										}
										allsalesactivity(item.data)
									})
							})
					})
			} else {
				details_data[0].Total_price = details_data[0].Total_price - val.Total_price
				var ord2 = Orders.map(x => x.Order_id === undefined ? x.Fecha !== details_data.Fecha ? x : details_data : x.Order_id !== details_data.Order_id ? x : details_data)
				allorders(ord2)
				if(window.desktop) {
					await window.api.addData(ord2, "Orders")
					var ord_ret = []
					await window.api.getAllData('Orders_Returns').then(async return_ord => {
						// console.log(return_ord.Orders_Returns)
						if(return_ord.Orders_Returns) {
							ord_ret = return_ord.Orders_Returns
						}
						var extra = {
							...req_data_el,
							order: order,
							del: false,
							val: val
						}
						ord_ret.push(extra)
						// console.log(ord_ret)
						await window.api.addData(ord_ret, "Orders_Returns")
					})
				}
			}
		}
	}

	// ----------------OVERALL DATA------------------------
	let cantVentas = Orders.length;
	const cobradoVentas =()=>{
		let total;
		let onlyPaid =  allorder?.filter(status => status.Order_status==="Paid")
		total= onlyPaid?.reduce((acc, value) => acc + value.Total_price, 0)
		return total;
	}
	const no_Cobrado =()=>{
		let total;
		let onlyPaid =  allorder?.filter(status => status.Order_status==="Unpaid");
		total= onlyPaid?.reduce((acc, value) => acc + value.Total_price, 0)
		return total;
	}
	let totalVentas = allorder?.reduce((acc, value )=> acc + value.Total_price, 0);

	
	return (
		<div className='orders_main' style={{ padding: searchbox ? 20 : 0 }}>
			{
				boxes
					? <div className='container-fluid p-0 my-2'>
						<div className='row'>
							<div className='col-md p-2'>
								<Overall title="Cantidad de Ventas" stock={cantVentas} color="rgb(250,143,19)" />
							</div>
							<div className='col-md p-2'>
								<Overall title="Cobrado" price={cobradoVentas()} color="rgb(126,204,106)" />
							</div>
							<div className='col-md p-2'>
								<Overall title="A cobrar" price={no_Cobrado()} color="rgb(244,96,96)" />
							</div>
							<div className='col-md p-2'>
								<Overall title="Total de Ventas" price={totalVentas} color="rgb(240,6,217)" />
							</div>
						</div>
					</div>
					: null

			}

			{
				employee === null && searchbox
					? <div className='container-fluid p-0'>
						<div className='row'>
							<div className='col-md my-2'>
								{/* <NewProduct details_data={details_data} setDetailsData={setDetailsData}  /> */}
								<button type='button' className='btn btn-dark' data-toggle='modal' data-target='#adminorder'>Nueva Venta</button>
							</div>
							<div className='col-md text-right my-2'>
								<div className='d-flex justify-content-end'>
									<div className='search'>
										<input type='text' className='txt_input' placeholder={`Search by ${searching_val}`} defaultValue={search} onChange={onChange} />
										<button className='btn'>
											<FontAwesomeIcon icon="search" size='lg' />
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
					: null
			}

			<div className='table_overflow'>
				<table className="table table-striped table-hover">
					<thead>
						<tr>
							<th scope="col" className='text-center'>ID</th>
							<th scope="col" className='text-center'>Nombre Cliente</th>
							<th scope="col" className='text-center'>Deposito</th>
							<th scope="col" className='text-center'>Precio Total</th>
							<th scope="col" className='text-center'>Productos Total</th>
							<th scope="col" className='text-center' style={{ cursor: 'pointer' }} onClick={arrange}>
								Fecha {
									arr === 'desc' 
									? <FontAwesomeIcon icon="angle-down" style={{ color: 'gray', fontSize: 15 }} /> 
									: <FontAwesomeIcon icon="angle-up" style={{ color: 'gray', fontSize: 15 }} />
								}
								</th>
							<th scope="col" className='text-center'>Nombre Vendedor</th>
							<th scope="col" className='text-center'>Estado Orden</th>
							{
								refund
									? <th scope="col" className='text-center'>Reembolso</th>
									: null
							}
						</tr>
					</thead>
					<tbody>
						{
							allorder?.map((pro, index) =>
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
										{pro?.Order_status === 'Paid' ? (
											<span className={`${pro?.Order_status === 'Paid' ? 'bg-success' : 'bg-danger'} px-2 py-1 rounded text-light`}>Cobrado</span>

										) : (<span className={`${pro?.Order_status === 'Paid' ? 'bg-success' : 'bg-danger'} px-2 py-1 rounded text-light`}>A cobrar</span>

										)

										}
									</td>
									{
										refund
											? <td className='text-center align-middle'><button className='btn btn-danger' data-toggle='modal' data-target='#areyousure'>Refund</button></td>
											: null
									}
								</tr>
							)
						}
					</tbody>
				</table>
				{
					employee === null
						? <>
							<DetailsOrder details_data={details_data} setDetailsData={setDetailsData} order={order} setOrder={setOrder} particularOrder={particularOrder} setReturnVal={setReturnVal} />
							<AreYouSure returnProduct={returnProduct} return_val={return_val} setReturnedData={setReturnedData} />
							<EditOrder details_data={details_data} particular={particular} />
							<AdminOrder setOrder_Data={setDetailsData} returned_data={returned_data} order_return={order} setOrderReturn={setOrder} setReturnedData={setReturnedData} />
						</>
						: null
				}
			</div>
		</div>
	)
}

const mapStateToProps = (state) => {
    return {
        Products: state.Products,
        CategoryAdd: state.CategoryAdd,
        Sales_Activity: state.Sales_Activity,
        Notific: state.NotifyMaster,
        Orders: state.Orders,
        Status: state.Status,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        allorders: (val) => {
            dispatch({
                type: "ORDERS",
                item: val,
            });
        },
        allemployee: (val) => {
            dispatch({
                type: "EMPLOYEE",
                item: val,
            });
        },
        notify: (val) => {
            dispatch({
                type: "NOTIFICATION",
                item: val,
            });
        },
        allsalesactivity: (val) => {
            dispatch({
                type: "SALESACTIVITY",
                item: val,
            });
        },
        allproduct: (val) => {
            dispatch({
                type: "PRODUCTS",
                item: val,
            });
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Orders);
