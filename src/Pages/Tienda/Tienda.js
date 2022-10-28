import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { IoCloseCircle } from "react-icons/io5";
// import { AiFillEdit } from "react-icons/ai";
import { store_Desposito } from "../../Functions/AllFunctions";
import axios from "axios";

import "./Tienda.scss";
import NewTienda from "../../Components/NewTienda/NewTienda";

// prettier-ignore
function Tienda(props) {

    const { Products, Deposito, deposito, Status } = props

    const [alldepo, setAllDepo] = useState(Deposito);
    const [details_data, setDetailsData] = useState(null);
	const loop = useRef(true)

	useEffect(() => {
		async function dep_method() {
			await store_Desposito('Tienda', Status, Deposito, deposito)
		}
		
		if(loop.current) {
			dep_method()
			loop.current = false
		}
	}, [Deposito, Status, deposito])

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
								: <tr key={key}>
									<th scope="row" className='text-center align-middle'>{key+1}</th>
									<td className='text-center align-middle'>{i.createdAt.split('T')[0]}</td>
									<td className='text-center align-middle'>{i.nombre}</td>
									<td className='text-center align-middle'>{Products.filter(ele => ele.Deposito_id === i.Deposito_id).length}</td>
									<td className='text-center align-middle'>{i.Type}</td>
									<td className='text-center align-middle'>No Direccion</td>
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
				</div>
            </div>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        Products: state.Products,
        Deposito: state.Deposito,
        Status: state.Status,
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
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Tienda);
