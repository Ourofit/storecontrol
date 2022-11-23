import React from 'react'
import { IoCloseCircle } from "react-icons/io5";
function Users(){
return(
    <div>
		<div className="btn_new_expense">
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
								<th scope="col" className='text-center'>Número</th>
								<th scope="col" className='text-center'>Categoría</th>
								<th scope="col" className='text-center'>Descripción</th>
								<th scope="col" className='text-center'>Tipo de Pago</th>
								<th scope="col" className='text-center'>Delete</th>
							</tr>
						</thead>
						<tbody>
						
								<tr >
									<th scope="row" className='text-center align-middle'>1</th>
							
									<td className='text-center align-middle'></td>
									<td className='text-center align-middle'> </td>
									<td className='text-center align-middle'></td>
									<td className='text-center align-middle'></td>
									<td className='edit text-center align-middle'> 
										<IoCloseCircle style={{ display: "inline" }}  className="close_icon_ind" />
										{/* <AiFillEdit style={{ display: "inline" }} className="edit_icon_ind" onClick={() => seteditexp(i)}  data-toggle="modal" data-target="#expenseedit" /> */}
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