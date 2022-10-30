import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { IoCloseCircle } from "react-icons/io5";
// import { AiFillEdit } from "react-icons/ai";
import {
    store_Category,
    store_Desposito,
    store_Products,
} from "../../Functions/AllFunctions";
import axios from "axios";

import "./Tienda.scss";
import NewTienda from "../../Components/NewTienda/NewTienda";
import DetailsStore from "../../Components/DetailsStore/DetailsStore";
import DetailsProduct from "../../Components/DetailsProduct/DetailsProduct";
import TransferStock from "../../Components/TransferStock/TransferStock";

// prettier-ignore
function Tienda(props) {

    const { CategoryAdd, category, Products, Deposito, deposito, Status, allproduct, Sales_Activity, allsalesactivity, allorders } = props

    const [alldepo, setAllDepo] = useState(Deposito);
    const [allpro, setAllPro] = useState(Products);
    const [details_data, setDetailsData] = useState(null);
	const [co, setCo] = useState(null)
	const loop = useRef(true)

    const [details_store, setDetailsStore] = useState(null);
	const [cop, setCop] = useState(null)
    const [stocknum, setStockNum] = useState();

	useEffect(() => {
		async function dep_method() {
			await store_Desposito('Tienda', Status, Deposito, deposito)
			await store_Products('Tienda', Status, Products, allproduct, setAllPro, Sales_Activity, allorders, allsalesactivity)
			await store_Category('Tineda', Status, CategoryAdd, category)
		}
		
		if(loop.current) {
			dep_method()
			loop.current = false
		}
	}, [Deposito, Status, deposito, Products, Sales_Activity, allorders, allproduct, allsalesactivity, CategoryAdd, category])

	const removetienda = async (id) => {
		var e = Deposito.filter(function (x) { return x.Deposito_id !== id })

		var result = [];
		result = e

		deposito(result)
		if(Status) {
			await axios.delete(`http://localhost:5000/deposito/delete/${id}`);
		} else {
			if(window.desktop) {
				await window.api.addData(result, "Deposito")
				// var exp_ret2 = []
                // await window.api.getAllData('Expenses_Returns').then(async return_exp => {
                //     // console.log(return_ord.Orders_Returns)
                //     if(return_exp.Expenses_Returns) {
                //         exp_ret2 = return_exp.Expenses_Returns
                //     }
                //     var extra = {
                //         Expense_id: id,
                //     }
                //     exp_ret2.push(extra)
                //     // console.log(ord_ret)
                //     await window.api.addData(exp_ret2, "Expenses_Returns")
                // })
			}
		}
	}

	const detail_store = (store) => {
		var index = Deposito.findIndex((item) => item.Deposito_id === store.Deposito_id)
        setDetailsData(store);
        setCo(index)
	}

	const stocktransfer = (val) => {
        setStockNum(val);
    };

	const details = (pro) => {
        var index = Products.findIndex((item) => item.Product_id === pro.Product_id)
        setDetailsStore(pro);
        setCop(index)
    };
    
    return (
        <div className="tienda">
            <div className="btn_new_tienda">
                <NewTienda details_data={details_data} setDetailsData={setDetailsData} setAllPro={setAllDepo} allpro={alldepo} />
                <h3 style={{margin: 15}}>Mi Tienda</h3>
                <div className='table_overflow'>
					<table className="table table-striped table-hover">
						<thead>
							<tr>
								<th scope="col" className='text-center'>ID</th>
								<th scope="col" className='text-center'>Fecha</th>
								<th scope="col" className='text-center'>Nombre Tienda</th>
								<th scope="col" className='text-center'>Total De Productos</th>
								<th scope="col" className='text-center'>Type</th>
								<th scope="col" className='text-center'>Direccion</th>
								<th scope="col" className='text-center'>Edit / Delete</th>
							</tr>
						</thead>
						<tbody>
							{Deposito?.map((i, key) => (
								i.Type === 'Master Manager'
								? null
								: <tr key={key} style={{ cursor: 'pointer' }}>
									<th scope="row" className='text-center align-middle' data-toggle='modal' data-target="#detailsStore" onClick={() => detail_store(i)}>{key+1}</th>
									<td className='text-center align-middle' data-toggle='modal' data-target="#detailsStore" onClick={() => detail_store(i)}>{i.createdAt.split('T')[0]}</td>
									<td className='text-center align-middle' data-toggle='modal' data-target="#detailsStore" onClick={() => detail_store(i)}>{i.nombre}</td>
									<td className='text-center align-middle' data-toggle='modal' data-target="#detailsStore" onClick={() => detail_store(i)}>{Products.filter(ele => ele.Deposito_id === i.Deposito_id).length}</td>
									<td className='text-center align-middle' data-toggle='modal' data-target="#detailsStore" onClick={() => detail_store(i)} >{i.Type}</td>
									<td className='text-center align-middle' data-toggle='modal' data-target="#detailsStore" onClick={() => detail_store(i)}>No Direccion</td>
									<td className='edit text-center align-middle'> 
										{/* <IoCloseCircle style={{ display: "inline" }} onClick={() => removeExp(i.ExpenseId)} className="close_icon_ind" />
										<AiFillEdit style={{ display: "inline" }} className="edit_icon_ind" onClick={() => seteditexp(i)}  data-toggle="modal" data-target="#expenseedit" /> */}
                                        <IoCloseCircle style={{ display: "inline" }} onClick={() => removetienda(i.Deposito_id)} className="close_icon_ind" />
										{/* <AiFillEdit style={{ display: "inline" }} className="edit_icon_ind" data-toggle="modal" data-target="#expenseedit" /> */}
									</td>
								</tr>

							))}
						</tbody>
					</table>
					<DetailsStore 
						details_data={details_data}
						setDetailsData={setDetailsData}
						index={co}
						allpro={allpro}
						setAllPro={setAllPro}
						allproduct={allproduct}
						details={details}
					/>
					<DetailsProduct
						details_data={details_store}
						setDetailsData={setDetailsStore}
						index={cop}
						stocktransfer={stocktransfer}
					/>
					<TransferStock
						details_data={details_store}
						stocknum={stocknum}
						setAllPro={setAllPro}
					/>
				</div>
            </div>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        Products: state.Products,
        CategoryAdd: state.CategoryAdd,
        Deposito: state.Deposito,
        Status: state.Status,
        Sales_Activity: state.Sales_Activity,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        deposito: (val) => {
            dispatch({
                type: "DEPOSITO",
                item: val,
            });
        },
        allproduct: (val) => {
            dispatch({
                type: "PRODUCTS",
                item: val,
            });
        },
        allsalesactivity: (val) => {
            dispatch({
                type: "SALESACTIVITY",
                item: val,
            });
        },
        allorders: (val) => {
            dispatch({
                type: "ORDERS",
                item: val,
            });
        },
        category: (val) => {
            dispatch({
                type: "CATEGORYADD",
                item: val,
            });
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Tienda);
