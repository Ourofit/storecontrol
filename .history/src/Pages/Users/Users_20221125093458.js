import React, { useEffect, useState } from 'react'
import { IoCloseCircle } from "react-icons/io5";
import { AiFillEdit } from "react-icons/ai";
import { connect } from "react-redux";
import "./Users.scss"
import axios from 'axios'
import NewClient from '../../Components/NewClient/NewClient';
import { store_Desposito, store_Category, store_Products, store_Orders } from '../../Functions/AllFunctions';
function Users(props) {
    const { allClients, Clients, Status } = props;
    const [Province, setProvince] = useState();

    useEffect(() => {
        async function dep_method() {
			await store_Desposito('Users', Status, Deposito, deposito)
			await store_Category('Users', Status, CategoryAdd, category)
			await store_Products('Users', Status, Products, allproduct, setAllPro, Sales_Activity, allorders, allsalesactivity)
			await store_Orders('Users', Status, Orders, allorders, notify)
		}
		
		if(loop.current) {
			dep_method()
			loop.current = false
		}
        if (Status) {
            axios.get("http://localhost:5000/register").then((response) => (
                allClients(response.data)
                /*    if(window.desktop) {
                       window.api.getAllData("Users").then(items => items.)
                   } */
            ))
        }
        if (Status) {
            axios.get(
                `https://apis.datos.gob.ar/georef/api/provincias?orden=nombre&aplanar=true&campos=basico&max=5000&exacto=true&formato=json`
            )
                .then((response) => {
                    setProvince(response.data);
                })
                .catch((err) => console.log(err));
        }
        /*      axios.delete(`http://localhost:5000/register/delete/${id}`).then( dele => {
               axios.get("http://localhost:5000/register").then( (response) => {
                  
                     allClients(response.data)
              
                  window.api.addData(response.data, "Clients")
                 }) 
             }) */


    }, [])

    const removeClient = async (id) => {
        var e = Clients.filter(function (x) { return x.Clients !== id })

        var result = [];
        result = e

        allClients(result)
        if (Status) {
            await axios.delete(`http://localhost:5000/register/delete/${id}`);
        } else {
            if (window.desktop) {
                await window.api.addData(result, "Clients")
                var cli_ret2 = []
                await window.api.getAllData('Clients_Returns').then(async retur => {
                    // console.log(return_ord.Orders_Returns)
                    if (retur.Clients_Returns) {
                        cli_ret2 = retur.Clients_Returns
                    }
                    var extra = {
                        id: id,
                    }
                    cli_ret2.push(extra)
                    // console.log(ord_ret)
                    await window.api.addData(cli_ret2, "Clients_Returns")
                })
            }
        }
    }

    return (
        <div className="users">
            <div className="btn_new_user">
                <button
                    type="button"
                    className="btn_color"
                    data-toggle="modal"
                    data-target="#new_client"
                // onClick={() => setModalShow(true)}
                >
                    Registrar cliente
                </button>

                <div className='table_overflow'>
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th scope="col" className='text-center'>ID</th>
                                <th scope="col" className='text-center'>Nombre</th>
                                <th scope="col" className='text-center'>Celular</th>
                                <th scope="col" className='text-center'>Provincia</th>
                                <th scope="col" className='text-center'>Pais</th>
                                <th scope="col" className='text-center'>Eliminar</th>
                                <th scope="col" className='text-center'>Editar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Clients.map((i, key) => (

                                <tr key={key} >
                                    <th scope="row" className='text-center align-middle'>{key + 1}</th>

                                    <td className='text-center align-middle'>{i.nombre}</td>
                                    <td className='text-center align-middle'>{i.number} </td>
                                    <td className='text-center align-middle'>{i.Province}</td>
                                    <td className='text-center align-middle'>{i.Country}</td>
                                    <td className='edit text-center align-middle'>
                                        <IoCloseCircle style={{ display: "inline" }} className="close_icon_ind" onClick={() => removeClient(i.id)} />

                                    </td>

                                    <td className='edit text-center align-middle'>

                                        <AiFillEdit style={{ display: "inline" }} className="edit_icon_ind" data-toggle="modal" data-target="#expenseedit" />
                                    </td>
                                </tr>




                            ))}



                        </tbody>
                    </table>
                </div>
            </div>
            <NewClient allClients={Clients} Province={Province} />
        </div>
    )
}


const mapStateToProps = (state) => {
    return {
        Clients: state.Clients,

        Status: state.Status,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        allClients: (val) => {
            dispatch({
                type: "CLIENTS",
                item: val,
            });
        },

    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Users);