import React from 'react'
import { IoCloseCircle } from "react-icons/io5";
import "./Users.scss"
function Users(){
return(
    <div className="users">
		<div className="btn_new_user">
				<button
					type="button"
					className="btn_color"
					data-toggle="modal"
					data-target="#newexpense"
				// onClick={() => setModalShow(true)}
				>
					Nuevo Gasto
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
						
								<tr >
									<th scope="row" className='text-center align-middle'>1</th>
							
									<td className='text-center align-middle'>Ayelen</td>
									<td className='text-center align-middle'>1125152015 </td>
									<td className='text-center align-middle'>Ituzaingo</td>
									<td className='text-center align-middle'>Provincia</td>
									<td className='edit text-center align-middle'> 
										<IoCloseCircle style={{ display: "inline" }}  className="close_icon_ind" />
										 <AiFillEdit style={{ display: "inline" }} className="edit_icon_ind" onClick={() => seteditexp(i)}  data-toggle="modal" data-target="#expenseedit" /> */}
									</td>
								</tr>

							
						</tbody>
					</table>
				</div>
			</div>
    </div>
)
}
export default Users;