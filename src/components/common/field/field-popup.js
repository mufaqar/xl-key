import 'bootstrap/dist/css/bootstrap.css';
import React from 'react'
import '../settingPopUp.css';
import Api from "../../../helper/photo-api";
import {connect} from 'react-redux';
import useTranslation from "../../customHooks/translations";
import getLanguage from "../../customHooks/get-language";

const mapStateToProps = state => {
    let token = state.token;
    let userRole = state.userRole;
    let isLogged = state.isLogged;
    return {token, userRole, isLogged}
}

function withLanguageHook(Component) {
    return function WrappedComponent(props) {
        const translation = useTranslation();
        const language = getLanguage();
        return <Component {...props} translation={translation} language={language}/>;
    }
}

class Modal extends React.Component {

    constructor(props) {
        super(props)
        this.state = this.assignStates(
            this.props.type,
            this.props.data,
            this.props.title,
            this.props.fieldId,
            this.props.siteId,
            this.props.token,
          );
       
    }


    assignStates (type, data, title, fieldId, siteId, token) {
        let initial_values;
        if (type == "update") {
            initial_values = {
                id: data.id,
                name_en: data.name_en,
                name_fr: data.name_fr,
                status: data.status,
                api: new Api(token),
                message: null,
                title: title,
                fieldId: fieldId,
                siteId: siteId
            }
        } else {
            initial_values =  {
                id: data.id,
                name_en: "",
                name_fr: "",
                status: "",
                api: new Api(token),
                message: null,
                title: title,
                fieldId: fieldId,
                siteId: siteId
            }
        }

        return initial_values;
    }



    addOrUpdateSubmit(e) {
        e.preventDefault();

        if (this.props.type == "update") {
            console.log("data  new update type");
            this.updateAccount();

            // alert("Form submitted");
        } else if (this.props.type == "create") {
            console.log("data  new addAccount type");
            this.createNewOne();
            // alert("Form is not submitted");
        }

    };

    createNewOne() {
        const dataNew = this.state;
        console.log("data  new addAccount start", dataNew);
        const dataObject = {
            "name_en": dataNew.name_en,
            "name_fr": dataNew.name_fr,
            "site_id": dataNew.siteId,
            "lang": this.props.language
        }
        this.state.api
            .createField(dataObject)
            .then(response => {
                    console.log("data  new ", response);
                    this.setState({
                        message: response.data.message
                    });
                    setTimeout(window.location.reload(false), 500);
                }
            )
            .catch(err => {
                if (err.response && err.response.status == 401) {
                    this.props.history.push('/');
                } else {
                    if (err.response && err.response.data.message) {
                        this.setState({message: err.response.data.message});
                    } else {
                        this.setState({message: "Quelque chose s'est mal passé !"});
                    }
                }
            });
    };

    updateAccount() {
        const dataNew = this.state;
        console.log("data  new addAccount start", dataNew);
        const dataObject = {
            "name_en": dataNew.name_en,
            "name_fr": dataNew.name_fr,
            "site_id": dataNew.siteId,
            "lang": this.props.language,
            "status": "active"
        }
        this.state.api
            .updateField([this.state.id, dataObject])
            .then(response => {
                    console.log("data  new ", response);
                    this.setState({
                        message: response.data.message
                    });
                    setTimeout(window.location.reload(false), 500);
                }
            )
            .catch(err => {
                if (err.response && err.response.status == 401) {
                    this.props.history.push('/');
                } else {
                    if (err.response && err.response.data.message) {
                        this.setState({message: err.response.data.message});
                    } else {
                        this.setState({message: "Quelque chose s'est mal passé !"});
                    }
                }
            });
    };


    handleInputChage(e) {
        this.setState({
            [e.target.id]: e.target.value,
        })
    }

    render() {
        if (this.props.siteId != this.state.siteId) {
            this.setState(this.assignStates(
                this.props.type,
                this.props.data,
                this.props.title,
                this.props.fieldId,
                this.props.siteId,
                this.props.token,
              )
              );
          }
        const translation = this.props.translation;
        return (
            <div class="modal fade" id={this.props.id} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
                 aria-hidden="true">
                <div class="modal-dialog modelSizeFullScreenDialog " role="document">
                    <div class="modal-content modelSizeFullScreencontent">
                        <div class="modal-header">
                            <h5 className="modal-title textColor" id="exampleModalLabel">
                                {this.state.title === "Ajouter un field" ?
                                    translation.Add_a_field : this.state.title === "Renommer la field" ?
                                        translation.Rename_the_field : this.state.title}
                            </h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            {this.props.siteId}
                            <div className="row">
                                <div className="col-md-9 col-lg-8 mx-auto">
                                    <form name="addUserform" onSubmit={this.addOrUpdateSubmit.bind(this)}>
                                        <div className="form-group row">
                                            <strong htmlFor="inputEmail">Name (EN)*</strong>
                                            <input type="text" id="name_en" className="form-control" name='name_en'
                                                  
                                                   defaultValue={this.state.name_en}
                                                   onChange={this.handleInputChage.bind(this)} required autoFocus/>
                                        </div>
                                        <div className="form-group row">
                                            <strong htmlFor="inputEmail">Nom (FR)*</strong>
                                            <input type="text" id="name_fr" className="form-control" name='name_fr'
                                               
                                                   defaultValue={this.state.name_fr}
                                                   onChange={this.handleInputChage.bind(this)} required/>
                                        </div>

                                        <div class="vspace1em"></div>
                                        <div class="container-fluid">
                                            <div class="row">
                                                <button type="submit"
                                                        class="btn btn-primary ml-auto primaryTop mobile_button">
                                                    {translation.Submit}
                                                </button>
                                            </div>
                                        </div>
                                        <div class="vspace1em"></div>
                                        <div class="form-group row">
                                            <label for="inputPassword" class="col-sm-2 col-form-label"></label>
                                            <div class="col-sm-12">
                                                <label class="error-font-style">{this.state.message}</label>
                                            </div>
                                        </div>

                                    </form>
                                </div>

                            </div>

                        </div>


                    </div>
                </div>
            </div>
        );
    }

}

export default connect(mapStateToProps, null)(withLanguageHook(Modal));