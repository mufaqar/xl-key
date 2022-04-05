import React from 'react';
import '../producer/settings/settingsMain.css'
import '../Admin/settings/index.css'
import editIcon from "../../public/img/edit_btn_icon.png"
import closeIcon from "../../public/img/close_btn_icon.png"
import pauseIcon from "../../public/img/pause_btn_icon.png"
import arrowDownIcon from "../../public/img/icon-arrow-down.png";
import arrowUpIcon from "../../public/img/icon-arrow-up.png";
import glyphIvon from "../../public/img/glyphicon.png";
import {Popover} from "react-tiny-popover";
import {connect} from 'react-redux';
import Api from "../../helper/service-api";
import HideModal from "../hideModal";
import ServicePopUp from "./services-popup";
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

class ServicesList extends React.Component {
    constructor(props) {
        super(props)
        this.state = this.assignStates(this.props.type, this.props.token, this.props.acc_id);
    }
    
    assignStates = (type, token, acc_id) => {
        let initial_values = {
            isHidden: false,
            api: new Api(token, acc_id),
            hideModal: new HideModal(),
            services: [],
            isPopoverOpen: false,
            popoverId: null,
            mobileServicePopoverId: null,
            type: type,
            errors: {},
            fields: {},
            message: null,
        }
        return initial_values
    }

    toggleServicePopover = (index, prevPropCatId) => {
        let propCatId = index;
        if (prevPropCatId == index) {
            propCatId = null;
        }
        this.setState((prevState) => ({mobileServicePopoverId: propCatId}));
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        this.setState({message: ""});
        this.state.api
            .getAllServices()
            .then(response => {
                console.log("data response**services******* ", response);
                this.setState({
                    services: response.data.data
                })
            })
            .catch(err => {
                if (err.response && err.response.status == 401) {
                    this.props.history.push('/');
                }
            });
    }

    handleChange(field, e) {
        let fields = this.state.fields;

        console.log("fields ", fields);
        console.log("fields value", e.target.value);
        fields[field] = e.target.value;
        this.setState({fields});
    }

    createService(e) {
        e.preventDefault();
        console.log("create*******");
        const data = this.state.fields;
        const dataObject = {
            "title_en": data.title_en,
            "title_fr": data.title_fr,
            "description_en": data.description_en,
            "description_fr": data.description_fr,
            "form_link_en": data.form_link_en,
            "form_link_fr": data.form_link_fr,
            "contact_1_en": data.contact_1_en,
            "contact_1_fr": data.contact_1_fr,
            "contact_2_en": data.contact_2_en,
            "contact_2_fr": data.contact_2_fr,
            "lang": this.props.language,
            "status": "active"
        }
        console.log(dataObject);
        this.state.api
            .createService(dataObject)
            .then(response => {
                console.log("data  new ** ", response);
                this.setState({
                    message: response.data.message
                })
                this.loadData();
            })
            .catch(err => {
                if (err.response && err.response.status == 401) {
                    this.props.history.push('/');
                }
            });
    }

    deleteService = (id) => {
        console.log("data  new delete** id", id);
        this.state.api
            .deleteService(id)
            .then(response => {
                console.log("data  new delete** ", response);
                this.setState({message: response.data.message});
                setTimeout(this.state.hideModal.hideModal(), 1000);
                this.loadData();
            })
            .catch(err => {
                if (err.response && err.response.status == 401) {
                    this.props.history.push('/');
                }
            });
    }

    orderUpService = (id) => {
        this.state.api
            .orderUpService(id)
            .then(response => {
                this.loadData();
            })
            .catch(err => {
                if (err.response && err.response.status == 401) {
                    this.props.history.push('/');
                }
            });
    }

    orderDownService = (id) => {
        this.state.api
            .orderDownService(id)
            .then(response => {
                this.loadData();
            })
            .catch(err => {
                if (err.response && err.response.status == 401) {
                    this.props.history.push('/');
                }
            });
    }

    inactiveService = (id) => {
        console.log("inactiveService start");
        const dataObject = {
            "status": "inactive",
            "lang": this.props.language
        }
        console.log(dataObject);
        this.state.api
            .updateService([id, dataObject])
            .then(response => {
                    console.log("data  new ", response);
                    this.setState({
                        message: response.data.message
                    });
                    setTimeout(this.state.hideModal.hideModal(), 1000);
                    this.loadData();
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
    }

    render() {
        const {services} = this.state
        const translation = this.props.translation;
        const language = this.props.language;
        const isFrench = language == "FR";
        if (this.state.acc_id && (this.props.acc_id != this.state.acc_id)) {
            this.setState(
                this.assignStates(
                    this.props.type, this.props.token, this.props.acc_id
                )
            );
        }
    
        return (
            <div>
                {(services).map((service) => (
                    <div className="row border mb-3 ml-0 mr-0">
                        <div className="col-7">
                            <div className="row">
                                <label className="ml-4 mt-2 mb-3">{isFrench ? service.title_fr : service.title_en}</label>
                            </div>
                        </div>
                        <div className="col-5 align-center pl-0 pr-0">
                            <div className="text-right">
                                <div>
                                    <img src={pauseIcon}
                                         className="img-responsive image d-none d-sm-inline-block mt-0 mb-0"
                                         data-toggle="modal"
                                         data-target={"#inactiveService" + service.id}
                                         alt="Responsive "/>
                                    <img src={arrowDownIcon}
                                         className="img-responsive image d-none d-sm-inline-block mt-0 mb-0"
                                         alt="Responsive "
                                         onClick={this.orderDownService.bind(null, service.id)}/>
                                    <img src={arrowUpIcon}
                                         className="img-responsive image d-none d-sm-inline-block mt-0 mb-0"
                                         alt="Responsive "
                                         onClick={this.orderUpService.bind(null, service.id)}/>
                                    <img src={editIcon}
                                         className="img-responsive image d-none d-sm-inline-block mt-0 mb-0"
                                         data-toggle="modal"
                                         data-target={"#modalService" + service.id}
                                         alt="Responsive "/>
                                    <img src={closeIcon}
                                         className="img-responsive image d-none d-sm-inline-block mt-0 mb-0"
                                         data-toggle="modal"
                                         data-target={"#deleteService" + service.id}
                                         alt="Responsive "/>
                                    <div>
                                        <Popover
                                            isOpen={this.state.mobileServicePopoverId == service.id ? true : false}
                                            position={'bottom'}
                                            containerClassName="shadow, pop-style"
                                            content={({position, nudgedLeft, nudgedTop}) => ( // you can also provide a render function that injects some useful stuff!
                                                <div className="pop-main col-12 pt-2 pb-1">
                                                    <div className="row">
                                                        <img src={pauseIcon}
                                                             className="img-responsive image mt-0"
                                                             data-toggle="modal"
                                                             data-target={"#inactiveService" + service.id}
                                                             alt="Responsive image"/>
                                                        <label className="">{translation.Pause}</label>
                                                    </div>
                                                    <div className="row">
                                                        <img src={arrowDownIcon}
                                                             className="img-responsive image mt-0"
                                                             alt="Responsive image"
                                                             onClick={this.orderDownService.bind(null, service.id)}/>
                                                        <label className="">{translation.Go_up}</label>
                                                    </div>
                                                    <div className="row">
                                                        <img src={arrowUpIcon}
                                                             className="img-responsive image mt-0"
                                                             alt="Responsive image"
                                                             onClick={this.orderUpService.bind(null, service.id)}/>
                                                        <label
                                                            className="">{translation.Go_down}</label>
                                                    </div>
                                                    <div className="row">
                                                        <img src={editIcon}
                                                             className="img-responsive image mt-0"
                                                             data-toggle="modal"
                                                             data-target={"#modalService" + service.id}
                                                             alt="Responsive image"/>
                                                        <label className="">{translation.Edit}</label>
                                                    </div>
                                                    <div className="row">
                                                        <img src={closeIcon}
                                                             className="img-responsive image mt-0"
                                                             data-toggle="modal"
                                                             data-target={"#deleteService" + service.id}
                                                             alt="Responsive image"/>
                                                        <label
                                                            className="">{translation.Delete}</label>
                                                    </div>
                                                </div>
                                            )}>
                                            <img src={glyphIvon}
                                                 className="img-responsive image d-inline-block d-sm-none mt-0 mb-0 mr-4"
                                                 onClick={() => this.toggleServicePopover(service.id, this.state.mobileServicePopoverId)}
                                                 alt="Responsive "/>
                                        </Popover>
                                    </div>
                                </div>
                                <div className="modal fade" id={"deleteService" + service.id}
                                     tabIndex="-1"
                                     role="dialog" aria-labelledby="exampleModalLabel"
                                     aria-hidden="true">
                                    <div className="modal-dialog" role="document"
                                         style={{maxWidth: '100%'}}>
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title"
                                                    id="exampleModalLabel">{translation.Do_you_want_to_delete}</h5>
                                                <button type="button" className="close" data-dismiss="modal"
                                                        aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-primary"
                                                        onClick={this.deleteService.bind(null, service.id)}
                                                        style={{width: '40%'}}>{translation.Yes}
                                                </button>
                                                <button type="button" className="btn btn-secondary"
                                                        data-dismiss="modal"
                                                        style={{width: '40%'}}>{translation.Close}
                                                </button>
                                                <br/>
                                                <label className="error-font-style">{this.state.message}</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal fade" id={"inactiveService" + service.id}
                                     tabIndex="-1"
                                     role="dialog" aria-labelledby="exampleModalLabel"
                                     aria-hidden="true">
                                    <div className="modal-dialog" role="document"
                                         style={{maxWidth: '100%'}}>
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title"
                                                    id="exampleModalLabel">
                                                    {translation.Inactive_Service}
                                                </h5>
                                                <button type="button" className="close" data-dismiss="modal"
                                                        aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-primary"
                                                        onClick={this.inactiveService.bind(null, service.id)}
                                                        style={{width: '40%'}}>{translation.Yes}
                                                </button>
                                                <button type="button" className="btn btn-secondary"
                                                        data-dismiss="modal"
                                                        style={{width: '40%'}}>{translation.Close}
                                                </button>
                                                <br/>
                                                <label className="error-font-style">{this.state.message}</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <ServicePopUp id={"modalService" + service.id} data={service} title={"Renommer la service"}>
                        </ServicePopUp>
                    </div>
                ))}
                <form onSubmit={this.createService.bind(this)}>
                    <div className="alert alert-secondary alert-margin des-top" role="alert">
                        <div
                            className="form-item-margin left ml-3 mt-2 mb-3 text-alignment">
                            <div className="row">{translation.ADD_A_SERVICE}</div>
                        </div>
                        <div className="form-label-group mb-2">
                            <input type="text"
                                   className="form-control update-fonts input-height"
                                   placeholder={translation.TITLE_FR}
                                   onChange={this.handleChange.bind(this, "title_fr")}
                                   autoFocus required/>
                        </div>
                        <div className="form-label-group mb-2">
                            <input type="text"
                                   className="form-control update-fonts input-height"
                                   placeholder={translation.TITLE_EN}
                                   onChange={this.handleChange.bind(this, "title_en")}
                                   required/>
                        </div>
                        <div className="form-label-group mb-2">
                        <textarea className="form-control update-fonts" rows="4"
                                  cols="50"
                                  placeholder={translation.DESCRIPTION_FR}
                                  onChange={this.handleChange.bind(this, "description_fr")}
                                  required>
                        </textarea>
                        </div>
                        <div className="form-label-group mb-2">
                        <textarea className="form-control update-fonts" rows="4"
                                  cols="50"
                                  placeholder={translation.DESCRIPTION_EN}
                                  onChange={this.handleChange.bind(this, "description_en")}
                                  required>
                        </textarea>
                        </div>
                        <div className="form-label-group mb-2">
                            <input type="text"
                                   className="form-control update-fonts input-height"
                                   placeholder={translation.GOOGLE_FORM_LINK_OR_OTHER_FR}
                                   onChange={this.handleChange.bind(this, "form_link_fr")}
                                   required/>
                        </div>
                        <div className="form-label-group mb-2">
                            <input type="text"
                                   className="form-control update-fonts input-height"
                                   placeholder={translation.GOOGLE_FORM_LINK_OR_OTHER_EN}
                                   onChange={this.handleChange.bind(this, "form_link_en")}
                                   required/>
                        </div>
                        <div className="form-label-group mb-2">
                            <input type="text"
                                   className="form-control update-fonts input-height"
                                   placeholder={translation.CONTACT_INFORMATION_1_FR}
                                   onChange={this.handleChange.bind(this, "contact_1_fr")}
                                   required/>
                        </div>
                        <div className="form-label-group mb-2">
                            <input type="text"
                                   className="form-control update-fonts input-height"
                                   placeholder={translation.CONTACT_INFORMATION_1_EN}
                                   onChange={this.handleChange.bind(this, "contact_1_en")}
                                   required/>
                        </div>
                        <div className="form-label-group mb-2">
                            <input type="text"
                                   className="form-control update-fonts input-height"
                                   placeholder={translation.CONTACT_INFORMATION_2_FR}
                                   onChange={this.handleChange.bind(this, "contact_2_fr")}
                                   required/>
                        </div>
                        <div className="form-label-group mb-2">
                            <input type="text"
                                   className="form-control update-fonts input-height"
                                   placeholder={translation.CONTACT_INFORMATION_2_EN}
                                   onChange={this.handleChange.bind(this, "contact_2_en")}
                                   required/>
                        </div>
                        <div className="form-label-group text-center">
                            <button type="submit" className="btn btn-primary ml-auto mt-3 mb-2">
                                {translation.SAFEGUARD}
                            </button>
                        </div>
                        <div className="col-sm-12 text-center">
                            <label className="error-font-style">{this.state.message}</label>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

export default connect(mapStateToProps, null)(withLanguageHook(ServicesList));