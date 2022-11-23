import React, {useEffect} from 'react'
import { IoCloseCircle } from "react-icons/io5";
import { AiFillEdit } from "react-icons/ai";
import { connect } from "react-redux";
import "./Users.scss"
import axios from 'axios'
function Users(props) {
    const {allClients, Clients, Status} = props;


    useEffect(() =>{ 
        if(Status){
            axios.get("http://localhost:5000/register").then((response)=>(
            
     
                allClients(response.data)
             /*    if(window.desktop) {
                    window.api.getAllData("Users").then(items => items.)
                } */
                ))  
        }
   
},[])
console.log(Clients, 'cliens')
    return (
        <div className="users">
            <div className="btn_new_user">
                <button
                    type="button"
                    className="btn_color"
                    data-toggle="modal"
                    data-target="#newexpense"
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
{Clients.map(i => (






))}
                            <tr >
                                <th scope="row" className='text-center align-middle'>1</th>

                                <td className='text-center align-middle'>Ayelen</td>
                                <td className='text-center align-middle'>1125152015 </td>
                                <td className='text-center align-middle'>Ituzaingo</td>
                                <td className='text-center align-middle'>Provincia</td>
                                <td className='edit text-center align-middle'>
                                    <IoCloseCircle style={{ display: "inline" }} className="close_icon_ind" />

                                </td>

                                <td className='edit text-center align-middle'>

                                    <AiFillEdit style={{ display: "inline" }} className="edit_icon_ind" data-toggle="modal" data-target="#expenseedit" />
                                </td>
                            </tr>


                        </tbody>
                    </table>
                </div>
            </div>
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