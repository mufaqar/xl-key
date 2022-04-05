import 'bootstrap/dist/css/bootstrap.css';
import React from 'react'
import '../settingsSecondBtn.css'
import '../settingsMain.css'
import fuicon from "../../../../public/img/fileuploadicon.png"
import {connect} from "react-redux";
import Api from "../../../../helper/subscription-api";
import HideModal from "../../../hideModal";
import 'react-tabs/style/react-tabs.css';
import useTranslation from "../../../customHooks/translations";
import getLanguage from "../../../customHooks/get-language";

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
            isHidden: false,
            api: new Api(this.props.token),
            hideModal: new HideModal(),
            selectedFileName: "",
            selectedFile: "",
            title_en: "",
            title_fr: "",
        }
        this.fileSelectedHandler = this.fileSelectedHandler.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.addSubscription = this.addSubscription.bind(this);
    }

    fileSelectedHandler(event) {
        console.log("fileSelectedHandler***", event.target.files[0].name);
        this.setState({
            selectedFile: event.target.files[0],
            selectedFileName: event.target.files[0].name
        });
    }

    handleInputChange(e) {
        this.setState({
            [e.target.id]: e.target.value,
        })
    }

    addSubscription() {
        const dataNew = this.state;
        console.log("data  new addAccount start", dataNew);
        let formData = new FormData();
        formData.append('title_en', dataNew.title_en);
        formData.append('title_fr', dataNew.title_fr);
        formData.append('pdf_link', dataNew.selectedFile);
        formData.append('pdf_type', 'invoice');
        formData.append('lang', this.props.language);
        this.state.api
            .createSubscription(formData)
            .then(response => {
                    console.log("data  new ", response);
                    this.setState({
                        message: response.data.message
                    });
                    setTimeout(window.location.reload(false), 1000);
                }
            )
            .catch(err => {
                if (err.response.status == 401) {
                    this.props.history.push('/');
                } else {
                    if (err.response.data.message) {
                        this.setState({message: err.response.data.message});
                    } else {
                        this.setState({message: "Quelque chose s'est mal passé !"});
                    }
                }
            });
    }

    render() {
        const translation = this.props.translation;
        return (
            <div class="modal fade" id="addInvoicePopup" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
                 aria-hidden="true">
                <div class="modal-dialog modelSizeFullScreenDialog " role="document">
                    <div class="modal-content modelSizeFullScreencontent">
                        <div class="modal-header">
                            <h5 className="modal-title textColor" id="exampleModalLabel">{translation.Add_a_farm_contract}Ajouter un invoice de ferme</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <strong htmlFor="inputEmail">Title (EN)*</strong>
                            <input type="text" id="title_en" className="form-control" name='title_en'
                                   
                                   defaultValue={this.state.title_en}
                                   onChange={this.handleInputChange} autoFocus/>
                            <div className="vspace1em"></div>
                            <strong htmlFor="inputEmail">Title (FR)*</strong>
                            <input type="text" id="title_fr" className="form-control" name='title_fr'
                                   
                                   defaultValue={this.state.title_fr}
                                   onChange={this.handleInputChange}/>
                            <div className="modal-body">
                                <div class="input-group mb-3"></div>
                                <strong htmlFor="inputEmail">{translation.Add_a_file}*</strong>
                                <React.Fragment>
                                    <button className="producteure-note-button2"
                                            onClick={() => this.refs.fileInput.click()}>
                                        {translation.Add}
                                    </button>

                                    <div>
                                        <input
                                            type="file"
                                            accept="application/pdf"
                                            ref="fileInput"
                                            onChange={this.fileSelectedHandler}
                                            style={{display: "none"}}
                                            name="file"
                                            required={true}/>
                                    </div>
                                </React.Fragment>
                            </div>

                            {this.state.selectedFileName && (
                                <div class="setting-information-general-jpg-box" role="alert">
                                    <div class="d-flex">
                                        <div class="form-group-right">
                                            <img src={fuicon} alt="workimg"/>
                                        </div>
                                        <label htmlFor="inputEmail" style={{
                                            marginTop: '15px',
                                            color: '#0178D4'
                                        }}>{this.state.selectedFileName}</label>
                                    </div>
                                </div>
                            )}

                            <div class="vspace1em"></div>
                            <div class="container-fluid">
                                <div class="row">
                                    <button type="button" class="btn btn-primary ml-auto primaryTop mobile_button"
                                            onClick={this.addSubscription}>
                                        {translation.Save}
                                    </button>
                                </div>
                            </div>
                            <div class="vspace1em"></div>
                            <div className="col-sm-12 text-center">
                                <label>{this.state.message}</label>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, null)(withLanguageHook(Modal));