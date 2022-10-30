import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./DetailsStore.scss";
// import OneDetail from "./OneDetail";
// import Colorpicker from "../Colorpicker/Colorpicker";
import { connect } from "react-redux";
// import DetailsProduct from "../DetailsProduct/DetailsProduct";
// import TransferStock from "../TransferStock/TransferStock";
import { IoCloseCircle } from "react-icons/io5";
import { AiFillEdit } from "react-icons/ai";
import axios from "axios";
// import { Table } from 'react-bootstrap'

// prettier-ignore
function DetailsStore({ idModal="detailsStore", details_data, setDetailsData, index, allpro, setAllPro, allproduct, details, ...props }) {

	const { CategoryAdd, Deposito, Products, Orders, Status } = props
	
	const [search,] = useState("");
    // const [details_store, setDetailsStore] = useState(null);
	// const [cop, setCop] = useState(null)
    // const [stocknum, setStockNum] = useState();
    const [printBar, setPrintBar] = useState([]);

	// const details = (pro) => {
    //     var index = Products.findIndex((item) => item.Product_id === pro.Product_id)
    //     setDetailsStore(pro);
    //     setCop(index)
    // };

	// const stocktransfer = (val) => {
    //     setStockNum(val);
    // };

	const checking = (e, val) => {
        if (e.target.checked) {
            setPrintBar([...printBar, val]);
        } else {
            setPrintBar(
                printBar.filter(function (x) {
                    return x.Product_id !== val.Product_id;
                })
            );
        }
    };

	const remove = async (i) => {
        var p = Products.filter(function(x) {return x.Product_id !== i})
        var result = [];
        if (search !== "") {
            for (var j = 0; j < p.length; j++) {
                if (
                    p[j].nombre.toUpperCase().indexOf(
                        search.toUpperCase()
                    ) > -1
                ) {
                    result.push(p[j]);
                }
            }
        } else {
            result = p;
        }
        // console.log(result)
        allproduct(result)
        setAllPro(p)
        if(Status) {
            await axios.delete(
                `http://localhost:5000/product/delete/${i}`
            );
        } else {
            if (window.desktop) {
                await window.api.addData(result, "Products")
                var pro_ret2 = []
                await window.api.getAllData('Products_Returns').then(async return_pro => {
                    // console.log(return_ord.Orders_Returns)
                    if(return_pro.Orders_Returns) {
                        pro_ret2 = return_pro.Products_Returns
                    }
                    var extra = {
                        Product_id: i,
                    }
                    pro_ret2.push(extra)
                    // console.log(ord_ret)
                    await window.api.addData(pro_ret2, "Products_Returns")
                })
            }
        }
        // inspro();
    };

	const change = (e) => {
        if (e.target.value === "") {
            document.getElementsByClassName(
                "edit" + e.target.name + "error" + e.target.className
            )[0].style.display = "inherit";
            document.getElementsByClassName(
                "edit" + e.target.name + "error" + e.target.className
            )[0].innerHTML = "Required";
        } else {
            for (var k = 0; k < Products.length; k++) {
                if (e.target.value === Products[k].ProductName) {
                    if (e.target.name === "pname") {
                        document.getElementsByClassName(
                            "edit" +
                            e.target.name +
                            "error" +
                            e.target.className
                        )[0].style.display = "inherit";
                        document.getElementsByClassName(
                            "edit" +
                            e.target.name +
                            "error" +
                            e.target.className
                        )[0].innerHTML = "Already Exist";
                        break;
                    }
                } else {
                    document.getElementsByClassName(
                        "edit" + e.target.name + "error" + e.target.className
                    )[0].style.display = "none";
                    document.getElementsByClassName(
                        "edit" + e.target.name + "error" + e.target.className
                    )[0].innerHTML = "";
                }
            }
        }
    };

    const edit_record = async (e) => {
        if (e.key === "Enter") {
            var u = parseInt(e.target.className);
            var pname = document.getElementsByClassName("editpnameerror" + e.target.className)[0].innerHTML;
            var pdes = document.getElementsByClassName("editpdeserror" + e.target.className)[0].innerHTML;
            var pcate = document.getElementsByClassName("editpcateerror" + e.target.className)[0].innerHTML;

            if (e.target.name === "pname") {
                if (pname !== "Required") {
                    if (pname !== "Already Exist") {
                        document.getElementsByName("pcate")[0].focus();
                    }
                }
            }

            if (e.target.name === "pcate") {
                if (pcate !== "Required") {
                    document.getElementsByName("pdes")[0].focus();
                }
            }

            if (e.target.name === "pdes") {
                if (pdes !== "Required") {
                    var db_val = {
                        Product_id: Products[u].Product_id,
                        nombre: document.getElementsByName("pname")[0].value,
                        description: document.getElementsByName("pdes")[0].value,
                        Category_id: document.getElementsByName("pcate")[0].value,
                        Image: JSON.stringify(Products[u].Image),
                        Color: JSON.stringify(Products[u].Color),
                        Size: JSON.stringify(Products[u].Size),
                        Stock: JSON.stringify(Products[u].Stock),
                        precioVenta: JSON.stringify(Products[u].precioVenta),
                        costoCompra: JSON.stringify(Products[u].costoCompra),
                        costoMenor: JSON.stringify(Products[u].costoMenor),
                    };
                    var p = Products.map(obj =>
                        obj.Product_id === Products[u].Product_id
                            ? {
                                ...obj,
                                nombre: document.getElementsByName("pname")[0].value,
                                description: document.getElementsByName("pdes")[0].value,
                                Category_id: document.getElementsByName("pcate")[0].value
                            }
                            : obj
                    );
                    setAllPro(p)
                    allproduct(p)
                    if(window.desktop) {
                        await window.api.addData(p, "Products");
                    }
                    if(Status) {
                        await axios.put("http://localhost:5000/product/edit", db_val);
                    }

                    // var p = await axios
                    //     .get(
                    //         "https://dtodo-indumentaria-server.herokuapp.com/product/all"
                    //     )
                    //     .then((res) => res.data);
                    // inspro('update')
                    // console.log(Products)

                    document.getElementsByClassName('update' + u)[0].innerHTML = `${p[u].nombre}`;
                    document.getElementsByClassName('update' + u)[0].nextElementSibling.nextElementSibling.innerHTML = `${CategoryAdd?.filter(function (x) { return x.Category_id === p[u].Category_id; })[0]?.nombre}`;
                    document.getElementsByClassName('update' + u)[0].nextElementSibling.nextElementSibling.nextElementSibling.innerHTML = `${p[u].description}`;
                    update();

                    for (var t = 0; t < document.getElementsByClassName("update" + u).length; t++) {
                        document.getElementsByClassName("update" + u)[t].setAttribute("data-toggle", "modal")
                    }

                    var lengt1 = document.getElementsByClassName("edit_icon_ind_pro").length;
                    for (var c = 0; c < lengt1; c++) {
                        document.getElementsByClassName("edit_icon_ind_pro")[c].style.display = "inline";
                        var flag1 = 0
                        for(var z=0; z<Orders.length; z++) {
                            for(var y=0; y<Orders[z].order_product.length; y++) {
                                if(Orders[z].order_product[y].Product_id === Products[c].Product_id) {
                                    // console.log(Orders[z].order_product[y].Product_id, Products[c].Product_id)
                                    flag1 = 1
                                    break
                                }
                            }
                        }
                        if(flag1 === 0) {
                            document.getElementsByClassName("close_icon_ind_pro")[c].style.display = "inline";
                        }
                    }
                }
            }
        }
    };

	const edit = (i) => {
        var lengt = document.getElementsByClassName("edit_icon_ind_pro").length;
        for (var c = 0; c < lengt; c++) {
            document.getElementsByClassName("edit_icon_ind_pro")[c].style.display = "none";
            document.getElementsByClassName("close_icon_ind_pro")[c].style.display = "none";
        }
        for (var j = 0; j < Products.length; j++) {
            // console.log(document.getElementsByClassName("update"+i)[j], j)
            if (Products[i].nombre === Products[j].nombre) {

                for (var t = 0; t < document.getElementsByClassName("update" + i).length; t++) {
                    document.getElementsByClassName("update" + i)[t].removeAttribute("data-toggle")
                }

                document.getElementsByClassName('update' + i)[0].innerHTML = `
                    <input type="text" placeholder="Enter Product nombre" id="pname" name="pname" class=${i} value='${Products[i].nombre}' />
                    <div style="color: red; display: none;" class=${"editpnameerror" + i}></div>
                `;
                var pname_input = document.getElementById("pname");
                pname_input.addEventListener("keyup", edit_record);
                pname_input.addEventListener("input", change);

                let selectmap = CategoryAdd?.map((c, ij) => {
                    return `<option value='${c.Category_id}' ${Products[i].Category_id === c.Category_id ? 'selected' : ''}>${c.nombre}</option>`;
                }).join("");

                document.getElementsByClassName('update' + i)[0].nextElementSibling.nextElementSibling.nextElementSibling.innerHTML = `
                    <input type="text" style="width: 100%" placeholder="Enter description" id="pdes" name="pdes" class=${i} value="${Products[i].description}" />
                    <div style="color: red; display: none;" class=${"editpdeserror" + i
                    }></div>
                `;
                var des_input = document.getElementById("pdes");
                des_input.addEventListener("keyup", edit_record);
                des_input.addEventListener("input", change);

                document.getElementsByClassName('update' + i)[0].nextElementSibling.nextElementSibling.innerHTML = `
                    <select id="pcate" name="pcate" class=${i} values="${Products[i].Category_id}">
                        <option value="">Select</option>
                        ${selectmap}
                    </select>
                    <div style="color: red; display: none;" class=${"editpcateerror" + i
                    }></div>
                `;

                for (
                    var q = 0;
                    q < document.getElementById("pcate").options.length;
                    q++
                ) {
                    if (
                        parseInt(document.getElementById("pcate").options[q].value) === Products[i].Category_id
                    ) {
                        document.getElementById("pcate").selectedIndex = q;
                        break;
                    }
                }
                var pcate_input = document.getElementById("pcate");
                pcate_input.addEventListener("keyup", edit_record);
                pcate_input.addEventListener("input", change);

                // Products[i].nombre = j
            }
        }
    };

	const update = () => {
		var specific_pro = allpro.filter(ele => ele.Deposito_id === details_data?.Deposito_id)
        var product_len = specific_pro?.length;
        if (product_len > 0) {
            return specific_pro.map((p, i) =>
                <tr key={i} style={{ cursor: 'pointer' }}>
                    <td className="text-center align-middle" data-toggle='modal' data-target="#detailsproduct" onClick={() => details(p)}>
                        {i + 1}
                    </td>
                    {/* <td></td> */}
                    <td data-toggle="modal" className="text-center" data-target="#detailsproduct" onClick={() => details(p)}>
                        <img
                            // src={
                            //     JSON.parse(p.Image)[0] !== undefined
                            //         ? `${JSON.parse(p.Image)[0][0]}`
                            //         : null
                            // }
                            src={p.Image.length === 0 || p.Image[0].length === 0 ? require("../../assets/product-default-image.png") : p.Image[0][0].url}
                            alt=""
                            style={{ width: "50px" }}
                        />
                    </td>
                    <td className={`align-middle update${i}`} data-toggle="modal" data-target="#detailsproduct" onClick={() => details(p)}>{p.nombre}</td>
                    <td className={`text-center align-middle`} data-toggle="modal" data-target="#detailsproduct" onClick={() => details(p)}>{p.deposito.nombre}</td>
                    <td className={`text-center align-middle update${i}`} data-toggle="modal" data-target="#detailsproduct" onClick={() => details(p)}>
                        {CategoryAdd?.filter(function (x) { return x.Category_id === p.Category_id; })[0]?.nombre}
                    </td>
                    <td className={`align-middle update${i}`} data-toggle="modal" data-target="#detailsproduct" onClick={() => details(p)}>{p.description}</td>
                    <td className="edit text-center align-middle" style={{ width: 25 }}>
                        <IoCloseCircle 
                            style={{ 
                                display: Orders.filter(ord => ord.order_product.find(ordpro => ordpro.Product_id === p.Product_id)).length === 0 ? "inline" : "none"
                            }}
                            className="close_icon_ind_pro" onClick={() => remove(p.Product_id)} />
                        <AiFillEdit style={{ display: "inline" }} className="edit_icon_ind_pro" onClick={() => edit(i)} />
                    </td>
                    <td className='text-center align-middle' style={{ width: 25 }}>
                        <input type='checkbox' onChange={(e) => checking(e, p)} style={{ zIndex: 10 }} />
                    </td>
                </tr>
            );
        } else {
            return (
                <tr>
                    <td colSpan="8" style={{ textAlign: "center" }}>
                        No Products
                    </td>
                </tr>
            );
        }
    };

	return (
		<div className='detailsStore'>
			<div className="modal fade" id={idModal} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
				<div className="modal-dialog modal-dialog-centered" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="exampleModalLabel">Store Details</h5>
							<button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => setDetailsData(null)}>
								<span aria-hidden="true"><FontAwesomeIcon icon="close"/></span>
							</button>
						</div>
						<div className="modal-body">
							<div className='container-fluid'>
								<div className='row'>
									<div className="col-6 p-1">
										<div className="container-fluid">
											<div className="row">
												<div className='col-6 p-1'>
													<span style={{fontSize: 20, fontWeight: '600'}}>Created Date</span>
												</div>
												<div className='col-6 p-1'>
													<span style={{fontSize: 20, fontWeight: '400'}}>{details_data?.createdAt.split('T')[0]}</span>
												</div>
												<div className='col-6 p-1'>
													<span style={{fontSize: 20, fontWeight: '600'}}>Deposito Nombre</span>
												</div>
												<div className='col-6 p-1'>
													<span style={{fontSize: 20, fontWeight: '400'}}>{details_data?.nombre}</span>
												</div>
												<div className='col-6 p-1'>
													<span style={{fontSize: 20, fontWeight: '600'}}>Email</span>
												</div>
												<div className='col-6 p-1'>
													<span style={{fontSize: 20, fontWeight: '400'}}>{details_data?.Email}</span>
												</div>
												<div className='col-6 p-1'>
													<span style={{fontSize: 20, fontWeight: '600'}}>Password</span>
												</div>
												<div className='col-6 p-1'>
													<span style={{fontSize: 20, fontWeight: '400'}}>{details_data?.Password}</span>
												</div>
											</div>
										</div>
									</div>
									<div className="col-6 p-1">
										<div className="container-fluid">
											<div className="row">
												<div className='col-6 p-1'>
													<span style={{fontSize: 20, fontWeight: '600'}}>Type</span>
												</div>
												<div className='col-6 p-1'>
													<span style={{fontSize: 20, fontWeight: '400'}}>{details_data?.Type}</span>
												</div>
												{
													details_data?.Type !== "Manager"
													? <>
														<div className='col-6 p-1'>
															<span style={{fontSize: 20, fontWeight: '600'}}>Store Manager</span>
														</div>
														<div className='col-6 p-1'>
															<span style={{fontSize: 20, fontWeight: '400'}}>{Deposito.find(ele => ele.Deposito_id === details_data?.Deposito_id_fk)?.nombre}</span>
														</div>
													</>
													: null
												}
												<div className='col-6 p-1'>
													<span style={{fontSize: 20, fontWeight: '600'}}>Employee List</span>
												</div>
												<div className='col-6 p-1'>
													{
														details_data?.Employee_list === undefined
														? null
														: JSON.parse(details_data?.Employee_list)?.length === 0
															? <span style={{fontSize: 20, fontWeight: '400'}}>No Employee</span>
															: <ul>
															{
																JSON.parse(details_data?.Employee_list)?.map(emp => 
																	<li>{emp}</li>
																)
															}
															</ul>
													}
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							{
								details_data?.Type === "Manager"
								? <div className="table_overflow">
									<table className="table table-striped table-hover">
										<thead>
											<tr>
												{/* <th scope="col">Nombre</th>
												<th scope="col" className='text-center'>Stock</th>
												<th scope="col" className='text-center'>Precio</th>
												<th scope="col" className='text-center'>Fecha</th> */}
												<th scope="col" className='text-center'>ID</th>
												<th scope="col" className='text-center'>Image</th>
												<th scope="col" className='text-center'>Product nombre</th>
												<th scope="col" className='text-center'>Deposito</th>
												<th scope="col" className='text-center'>Categoria</th>
												<th scope="col" className='text-center'>Description</th>
												<th scope="col" className='text-center'>Edit/Remove</th>
												<th scope="col" className='text-center'>Print Barcode</th>
											</tr>
										</thead>
										<tbody>
											{update()}
										</tbody>
									</table>
									{/* <DetailsProduct
										details_data={details_store}
										setDetailsData={setDetailsStore}
										index={cop}
										stocktransfer={stocktransfer}
									/>
									<TransferStock
										details_data={details_store}
										stocknum={stocknum}
										setAllPro={setAllPro}
									/> */}
									{/* <FindProduct setAllPro={setAllPro}/>
									<div style={{ display: "none" }}>
										<PrintBarcode printRef={printRef} printBar={printBar} />
									</div> */}
								</div>
								: null
							}
							{/* <OneDetail key={index} name={'Stock'} data={details_data} transfer={true} stocktransfer={stocktransfer} /> */}
							{/* {
								Products[index] !== undefined
								? <Colorpicker colap={index} addorder={addorder} />
								: null
							} */}
							<div>
								{/* <div className='container-fluid'>
									<div className='row'>
										<div className='col-md-6'>
											<div className='image_slide'>
												<div id="carouselExampleControls" className="carousel slide" data-ride="carousel" data-interval={false}>
													<div className="carousel-inner">
														<div className="carousel-item active">
															<img className="" src={require('../../assets/Product1.jpg')} alt="First slide" />
														</div>
														<div className="carousel-item">
															<img className="" src={require('../../assets/Product2.jpg')} alt="Second slide" />
														</div>
														<div className="carousel-item">
															<img className="" src={require('../../assets/Product3.jpg')} alt="Third slide" />
														</div>
													</div>
													<a className="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
														<span style={{fontSize: 30}} aria-hidden="true"><FontAwesomeIcon icon="angle-left"/></span>
														<span className="sr-only">Previous</span>
													</a>
													<a className="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
														<span style={{fontSize: 30}} aria-hidden="true"><FontAwesomeIcon icon="angle-right"/></span>
														<span className="sr-only">Next</span>
													</a>
												</div>
											</div>
										</div>
										<div className='col-md-6'>
											<OneDetail name='Nombre' data={details_data?.nombre} />
											<OneDetail name='Codigo' data={details_data?.codigo} /> */}
											{/* <OneDetail name='Stock' data={details_data?.stock} /> */}
											{/* <OneDetail name='Description' data={details_data?.description} /> */}
											{/* {
												details_data?.stock.map((item, index) => <OneDetail key={index} name={item.name} data={item} transfer={true} stocktransfer={stocktransfer} />)
											} */}
											{/* <OneDetail name='Deposito' data={details_data?.deposito} transfer={true} /> */}
											{/* <OneDetail name='Categoria' data={details_data?.categoria} />
											<OneDetail name='Talles' data={details_data?.talles} />
											<OneDetail name='Color' data={details_data?.Color} />
											<OneDetail name='Estado' data={details_data?.estado} />
										</div>
										<div className='col-md-4 my-3 border-top'>
											<div className='title my-2'>
												<span style={{fontSize: 23, fontWeight: 600}}>Ventas</span>
											</div>
											<OneDetail name='Precio de Venta' data={`$${details_data?.precioVenta}`} />
											<OneDetail name='IVA por defecto' data={`$${details_data?.ivaVenta}`} />
										</div>
										<div className='col-md-4 my-3 border-top'>
											<div className='title my-2'>
												<span style={{fontSize: 23, fontWeight: 600}}>Compras por Mayor</span>
											</div>
											<OneDetail name='Costo' data={`$${details_data?.costoCompra}`} />
											<OneDetail name='IVA por defecto' data={`$${details_data?.ivaCompra}`} />
										</div>
										<div className='col-md-4 my-3 border-top'>
											<div className='title my-2'>
												<span style={{fontSize: 23, fontWeight: 600}}>Compra por menor</span>
											</div>
											<OneDetail name='Menor Costo' data={`$${details_data?.costoMenor}`} />
											<OneDetail name='IVA por defecto' data={`$${details_data?.menorCompra}`} />
										</div>
									</div>
								</div> */}
							</div>
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => setDetailsData(null)}>Close</button>
							{/* <button type="button" className="btn btn-primary" data-dismiss="modal" data-toggle='modal' data-target='#newproduct'>Edit Productos</button> */}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

const mapStateToProps = (state) => {
    return {
        Products: state.Products,
        Deposito: state.Deposito,
        Orders: state.Orders,
        CategoryAdd: state.CategoryAdd,
        Status: state.Status,
    };
};

export default connect(mapStateToProps)(DetailsStore);
