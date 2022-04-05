import 'bootstrap/dist/css/bootstrap.css';
import React from 'react'
import '../common/settingPopUp.css';
import Api from "../../helper/service-api";
import {connect} from 'react-redux';
import useTranslation from "../customHooks/translations";
import getLanguage from "../customHooks/get-language";

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
        this.state = {
            id: this.props.data.id,
            title_en: this.props.data.title_en,
            title_fr: this.props.data.title_fr,
            description_en: this.props.data.description_en,
            description_fr: this.props.data.description_fr,
            form_link_en: this.props.data.form_link_en,
            form_link_fr: this.props.data.form_link_fr,
            contact_1_en: this.props.data.contact_1_en,
            contact_1_fr: this.props.data.contact_1_fr,
            contact_2_en: this.props.data.contact_2_en,
            contact_2_fr: this.props.data.contact_2_fr,
            api: new Api(this.props.token),
            message: null,
            title: this.props.title,
        }
    }

    updateService(e) {
        e.preventDefault();
        const dataNew = this.state;
        console.log("data updateService start", dataNew);
        const dataObject = {
            "title_en": dataNew.title_en,
            "title_fr": dataNew.title_fr,
            "description_en": dataNew.description_en,
            "description_fr": dataNew.description_fr,
            "form_link_en": dataNew.form_link_en,
            "form_link_fr": dataNew.form_link_fr,
            "contact_1_en": dataNew.contact_1_en,
            "contact_1_fr": dataNew.contact_1_fr,
            "contact_2_en": dataNew.contact_2_en,
            "contact_2_fr": dataNew.contact_2_fr,
            "lang": this.props.language,
            "status": "active"
        }
        console.log(dataObject);
        this.state.api
            .updateService([this.state.id, dataObject])
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

    handleInputChange(e) {
        this.setState({
            [e.target.id]: e.target.value,
        })
    }

    render() {
        const translation = this.props.translation;
        return (
            <div class="modal fade" id={this.props.id} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
                 aria-hidden="true">
                <div class="modal-dialog modelSizeFullScreenDialog " role="document">
                    <div class="modal-content modelSizeFullScreencontent">
                        <div class="modal-header">
                            <h5 className="modal-title textColor" id="exampleModalLabel">{this.state.title}</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div className="row">
                                <div className="col-md-9 col-lg-8 mx-auto">
                                    <form name="addUserform" onSubmit={this.updateService.bind(this)}>
                                        <div className="form-group row">
                                            <strong htmlFor="inputEmail">{translation.TITLE_FR}</strong>
                                            <input type="text" id="title_fr" className="form-control"
                                                   
                                                   defaultValue={this.state.title_fr}
                                                   onChange={this.handleInputChange.bind(this)} autoFocus required/>
                                        </div>
                                        <div className="form-group row">
                                            <strong htmlFor="inputEmail">{translation.TITLE_EN}</strong>
                                            <input type="text" id="title_en" className="form-control"
                                                   
                                                   defaultValue={this.state.title_en}
                                                   onChange={this.handleInputChange.bind(this)} required/>
                                        </div>
                                        <div className="form-group row">
                                            <strong htmlFor="inputEmail">{translation.DESCRIPTION_FR}</strong>
                                            <input type="text" id="description_fr" className="form-control"
                                                   
                                                   defaultValue={this.state.description_fr}
                                                   onChange={this.handleInputChange.bind(this)} required/>
                                        </div>
                                        <div className="form-group row">
                                            <strong htmlFor="inputEmail">{translation.DESCRIPTION_EN}</strong>
                                            <input type="text" id="description_en" className="form-control"
                                                   
                                                   defaultValue={this.state.description_en}
                                                   onChange={this.handleInputChange.bind(this)} required/>
                                        </div>
                                        <div className="form-group row">
                                            <strong htmlFor="inputEmail">{translation.GOOGLE_FORM_LINK_OR_OTHER_FR}</strong>
                                            <input type="text" id="form_link_fr" className="form-control"
                                                  
                                                   defaultValue={this.state.form_link_fr}
                                                   onChange={this.handleInputChange.bind(this)} required/>
                                        </div>
                                        <div className="form-group row">
                                            <strong htmlFor="inputEmail">{translation.GOOGLE_FORM_LINK_OR_OTHER_EN}</strong>
                                            <input type="text" id="form_link_en" className="form-control"
                                                   
                                                   defaultValue={this.state.form_link_en}
                                                   onChange={this.handleInputChange.bind(this)} required/>
                                        </div>
                                        <div className="form-group row">
                                            <strong htmlFor="inputEmail">{translation.CONTACT_INFORMATION_1_FR}</strong>
                                            <input type="text" id="contact_1_fr" className="form-control"
                                                   
                                                   defaultValue={this.state.contact_1_fr}
                                                   onChange={this.handleInputChange.bind(this)} required/>
                                        </div>
                                        <div className="form-group row">
                                            <strong htmlFor="inputEmail">{translation.CONTACT_INFORMATION_1_EN}</strong>
                                            <input type="text" id="contact_1_en" className="form-control"
                                                   
                                                   defaultValue={this.state.contact_1_en}
                                                   onChange={this.handleInputChange.bind(this)} required/>
                                        </div>
                                        <div className="form-group row">
                                            <strong htmlFor="inputEmail">{translation.CONTACT_INFORMATION_2_FR}</strong>
                                            <input type="text" id="contact_2_fr" className="form-control"
                                                   
                                                   defaultValue={this.state.contact_2_fr}
                                                   onChange={this.handleInputChange.bind(this)} required/>
                                        </div>
                                        <div className="form-group row">
                                            <strong htmlFor="inputEmail">{translation.CONTACT_INFORMATION_2_EN}</strong>
                                            <input type="text" id="contact_2_en" className="form-control"
                                                   
                                                   defaultValue={this.state.contact_2_en}
                                                   onChange={this.handleInputChange.bind(this)} required/>
                                        </div>
                                        <div class="vspace1em"></div>
                                        <div class="container-fluid">
                                            <div class="row">
                                                <button type="submit"
                                                        class="btn btn-primary ml-auto primaryTop mobile_button">{translation.Submit}
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