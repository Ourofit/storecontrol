import React, { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Inputbox from "../Inputbox/Inputbox";
import Dropdown from "../Dropdown/Dropdown";
import "react-datepicker/dist/react-datepicker.css";
import { Form, Formik } from "formik";
import { connect } from "react-redux";
import axios from "axios";
import './NewClient.scss'


// prettier-ignore
function NewClient({ idModal = "new_client", allClients, Province, ...props }) {
    const { clients, Status } = props;




	if(localStorage.getItem('DepositoLogin') !== null) {
    JSON.parse(localStorage.getItem('DepositoLogin')).Type === 'Manager' || JSON.parse(localStorage.getItem('DepositoLogin')).Type === 'Master Manager') {
            navigate('/dashboard')
        } else {
            navigate('/employeeorder')
        }
    }
    const validate = (values) => {
        const errors = {};
        if (!values.Nombre) errors.Nombre = "Required";
        if (!values.Number) errors.Number = "Required";
        if (!values.Pais) errors.Pais = "Required";
        if (!values.Provincia) errors.Provincia = "Required";

        return errors;
    };

    const initialValues = {
        Nombre: "",
        Number: "",
        Pais:"",
        Provincia: "",
    };



    const onSubmit = async (values, { resetForm }) => {
        console.log(values)
        if (Status) {

            await axios.post("http://localhost:5000/register/new", {
                nombre: values.Nombre,
                number: values.Number,
                Country: values.Pais,
                Provincia: values.Provincia

            })
                .then(async (item) => {
                    clients(item.data)
                    var m = allClients;
                    m.push(item.data);

                    if (window.desktop) {
                        await window.api.addData(m, "Clients")
                    }

                    resetForm();
                }).catch(err => console.log(err))
        } else {
            var new_client = {
                nombre: values.Nombre,
                number: values.Number,
                Country: values.Pais,
                Provincia: values.Provincia

            }
            console.log(new_client)
            clients(new_client)

            var m = allClients;
            m.push(new_client);

            // setAllExpenses(m);
            if (window.desktop) {
                await window.api.addData(m, "Clients")
            }
            resetForm();



        }


        console.log("subtmiting data client")

    };


    const formRef = useRef();

    const settingval = (name, val) => {
        formRef.current.setFieldValue(name, val);
    };

    return (
        <div className="newclient">
            <div className="modal fade" id={idModal} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Registrar Cliente</h5>
                            <button
                                type="button"
                                style={{ backgroundColor: "transparent", border: 0 }}
                                className="close"
                                data-dismiss="modal"
                                aria-label="Close"
                                onClick={() => {
                                    formRef.current.resetForm()
                                }}
                            >
                                <FontAwesomeIcon icon="close" />
                            </button>
                        </div>
                        <Formik
                            initialValues={initialValues}
                            validate={validate}
                            onSubmit={onSubmit}
                            enableReinitialize={true}
                            innerRef={formRef}
                        >
                            {(props) => (
                                <Form>
                                    <div className="modal-body">


                                        <div className="container-fluid">
                                            <div className="row">

                                                <div className="col-4 d-flex align-items-center">
                                                    <span>Nombre</span>
                                                </div>
                                                <div className="col-8 d-flex align-items-center">
                                                    <Inputbox type="text" name="Nombre" placeholder="Nombre" />
                                                </div>
                                                <div className="col-4 d-flex align-items-center">
                                                    <span>Celular</span>
                                                </div>
                                                <div className="col-8 d-flex align-items-center">
                                                    <Inputbox type="text" name="Number" placeholder="Celular" />
                                                </div>
                                               <div >
                                                    <Dropdown name='Pais' onChange={settingval} dropvalues={['Argentina']} value_select={props.values.Pais} touched={props.touched.Pais} errors={props.errors.Pais} />
                                                </div >
                                                <div >
                                                    <Dropdown name='Provincia' onChange={settingval} dropvalues={Province?.provincias?.map((item) => item.nombre)} value_select={props.values.Provincia} touched={props.touched.Provincia} errors={props.errors.Provincia} />
                                                </div> 

                                            </div>
                                        </div>



                                    </div>
                                    <div className="modal-footer">
                                        <button type='submit' className="btn btn-primary">
                                            Guardar
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </div>
    );
}
const mapStateToProps = (state) => {
    return {
        Status: state.Status,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        clients: (val) => {
            dispatch({
                type: "CLIENTS",
                item: val,
            });
        },
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(NewClient);

