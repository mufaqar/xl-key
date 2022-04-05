import React from 'react';
import '../../../components/settingsMain.css'
import '../../../components/consultant/settings/consultantSettings.scss'
import closeIcon from "../../../public/img/close_btn_icon.png"
import NavBar from "../../../components/layout/main-navigation/ConsultantMainNavigation";
import Footer from "../../../components/layout/footer/ConsultantFooter";
import SlideBar from "../../../components/layout/side-navigation/ConsultantSideNavigation..js";
import AccessApi from "../../../helper/access-api"
import HideModal from "../../../components/hideModal";
import { connect, useSelector, useDispatch } from 'react-redux';
import useTranslation from "../../../components/customHooks/translations";
import getLanguage from "../../../components/customHooks/get-language";
import loading from "../../../loading.gif";

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

class AccessInvitations extends React.Component {
    constructor(props) {
        super(props)
        const acc_id = this.props.match.params.acc_id;
        this.state = {
            // isHidden: true
            isHidden: false,
            acc_id:acc_id,
            api: new AccessApi(this.props.token),
            base_url:"/consultant",
            admin_base_url:"/admin/consultant/"+acc_id,
            entreprise_base_url:"/entreprise/consultant/"+acc_id,
            consultant_base_url:"/consultant/consultant/"+acc_id,

            access_code: "",
            message: "",
            messageLevel1: "",
            fields: {},
            consultantInvitations: [],
            isDeleting: false,
            hideModal: new HideModal(),
            emailSendMessage: "",
            account_name: "",
        }
        this.toggleOffer = this.toggleOffer.bind(this);
        this.copyText = this.copyText.bind(this);

    }

    toggleOffer() {
        this.setState({
            // isHidden: !this.state.isHidden
            isHidden: false
        })
    }

    componentDidMount() {
        this.consultantInvitationLevel1();
        const language = this.props.language;
        const isFrench = language == "FR";
        this.state.api
            .getMyAccount()
            .then(response => {
                console.log("response * ", response);
                let data = response.data.data;
                this.setState({
                    access_code: data.access_code,
                    account_name: isFrench ? data.name_fr : data.name_en
                })
            })

            .catch(err => {
                if (err.response && err.response.status == 401) {
                    this.props.history.push('/');
                } else {
                    if (err.response && err.response.data.message) {
                        this.setState({ message: err.response.data.message });
                    } else {
                        this.setState({ message: "Quelque chose s'est mal passé !" });
                    }
                }
            });
    }

    deleteAccessInvitationLevel1 = (id) => {
        this.setState({ isDeleting: true })
        this.state.api
            .deleteAccessInvitationLevel1(id)
            .then(response => {
                this.setState({ deleteSuccMsg: response.data.message, isDeleting: false });
                setTimeout(this.state.hideModal.hideModal(), 1000);
                setTimeout(this.consultantInvitationLevel1(), 500);
            })
            .catch(err => {
                this.setState({ isDeleting: false })
                if (err.response && err.response.status == 401) {
                    this.props.history.push('/');
                } else {
                    if (err.response && err.response.data.message) {
                        this.setState({ deleteSuccMsg: err.response.data.message });
                    } else {

                    }
                }
            });
    }
    
    consultantInvitationLevel1 = () => {
        this.state.api.getConsultantInvitationLevel1()
            .then(response => {
                this.setState({
                    consultantInvitations: response.data.data
                })
            })
            .catch(err => {
                if (err.response && err.response.status == 401) {
                    this.props.history.push('/');
                } else {
                    if (err.response && err.response.data.message) {
                        // this.setState({ message: err.response.data.message });
                        // alert(err.response.data.message);
                    } else {
                        // this.setState({ message: "Quelque chose s'est mal passé !" });
                        // alert("Quelque chose s'est mal passé !");
                    }
                }
            });
    }

    handleChange(field, e) {
        let fields = this.state.fields;
        fields[field] = e.target.value;
        this.setState({ fields });
    }

    getCreatedDate(created_at) {
        let date = created_at;
        let dateFormat = require("dateformat");
        let correctdate = dateFormat(date, "yyyy.mm.dd");

        return correctdate;
    }

    changeStatusLevel1(e) {
        let id = e.target.id;
        let status = e.target.name;
        if (status == "active") {
            status = "inactive";
        } else {
            status = "active"
        }
        this.setStatusLevel1(id, status);
    }

    setStatusLevel1(id, status) {
        this.state.api
            .setStatusLevel1([id, status])
            .then(response => {
                setTimeout(this.consultantInvitationLevel1(), 500);
            })
            .catch(err => {
                if (err.response && err.response.status == 401) {
                    this.props.history.push('/');
                } else {
                    if (err.response && err.response.data.message) {

                    } else {

                    }
                }
            });
    }

    createConsultantInvitationLevel1 = (e) => {
        e.preventDefault();
        const data = this.state.fields;
        const dataObject = {
            "access_code": data.accessCode,
            'lang': this.props.language,
        }
        this.state.api.createConsultantInvitationLevel1(dataObject)
            .then(response => {
                console.log("createConsultantInvitationLevel1", response);
                data['accessCode'] = "";
                this.setState({
                    fields: data,
                    messageLevel1: response.data.message
                });
                this.consultantInvitationLevel1();
            }
            )
            .catch(err => {
                if (err.response && err.response.status == 401) {
                    this.props.history.push('/');
                } else {
                    if (err.response && err.response.data.message) {
                        this.setState({
                            message: err.response.message
                        })
                    } else {
                        this.setState({
                            message: "Quelque chose s'est mal passé !"
                        })
                    }
                }
            });
    }

    sendEmail = (e) => {
        e.preventDefault();
        const data = this.state.fields;
        const dataObject = {
            "account_name": this.state.account_name,
            'lang': this.props.language,
            "access_code": this.state.access_code,
            "sent_to_email": data.sendEmail
        }
        this.state.api.sendInvitationConsultant(dataObject)
            .then(response => {
                console.log("sendInvitationProducture ", response);
                this.setState({
                    emailSendMessage: response.data.message
                });
                setTimeout(window.location.reload(false), 500);

            }
            )
            .catch(err => {
                if (err.response && err.response.status == 401) {
                    this.props.history.push('/');
                } else {
                    if (err.response && err.response.data.message) {
                        this.setState({
                            emailSendMessage: err.response.message
                        })
                    } else {
                        this.setState({
                            emailSendMessage: "Quelque chose s'est mal passé !"
                        })

                    }
                }
            });
    }

    
    copyText() {
        var copyText = this.state.access_code;
        if (navigator && navigator.clipboard) {
            navigator.clipboard.writeText(copyText);
        }
    }


    render() {
        let base_url = this.state.base_url;
        if (!this.props.isLogged) {
            this.props.history.push('/');
        } else if (this.props.userRole=="ROLE_CONSULTANT") {

        } else if (this.props.userRole=="ROLE_ADMIN" && this.state.acc_id) {
            base_url = this.state.admin_base_url;
        } else if (this.props.userRole=="ROLE_ENTREPRISE" && this.state.acc_id) {
            base_url = this.state.entreprise_base_url;
        } else  {
            this.props.history.push('/');
        }

        const {isHidden, access_code, consultantInvitations} = this.state
        const translation = this.props.translation;
        const language = this.props.language;
        const isFrench = language == "FR";
        return (
            <div className={isHidden ? "sb-nav-fixed" : "sb-nav-fixed sb-sidenav-toggled"}>
                <NavBar base_url={base_url} acc_id={this.state.acc_id}></NavBar>
                <div id="mainDivSelect">
                    <div id="layoutSidenav_content" class="settings_content">
                        <main>
                            <div class="container-fluid">
                                <div class="row">
                                    <div className="col-md-3 sidebarbackgroundcolour">
                                        <SlideBar base_url={base_url}></SlideBar>
                                    </div>
                                    <div className="col-md-9 nopadding">
                                        <div class="card my-cart mb-5">
                                            <div className="col-md-11 col-lg-11 mx-auto mb-5">

                                                <h5 className="modal-title textColor headerTop" id="exampleModalLabel">
                                                    {translation.connection_strong}
                                                </h5>

                                                <div class="row inner-form-row-margin">
                                                    <div class="col-md-8 col-sm-8 col-xs-12 bg-light ">
                                                        <div class="alert ">
                                                            <div class="row " style={{ marginTop: '12%' }}>
                                                                <div
                                                                    class="col-md-6 col-sm-12 col-xs-12 alert-height-invitation ">
                                                                    <h6 className="modal-title center-element">{translation.ACCESS_CODE}</h6>
                                                                </div>
                                                                <div
                                                                    class="col-md-6 col-sm-12 col-xs-12 alert-height-invitation">
                                                                    <h5 className="modal-title center-element" id="accessCode">{access_code}</h5>
                                                                    {/* <input type="text" value="Hello World Anu" id="myInput"></input> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-md-4 col-sm-4 col-xs-12 align-me"
                                                        style={{ minHeight: '130px' }}>
                                                        <div class="container">
                                                            <div class="row ">
                                                                <button type="button"
                                                                    class="btn btn-primary center-two-buttons mobile_button"
                                                                    style={{ minWidth: '180px' }}
                                                                    data-toggle="modal" data-target="#sharedEmail">{translation.Share_by_email}
                                                                </button>
                                                            </div>
                                                            <div class="vspace1em"></div>
                                                            <div class="row ">
                                                                <button type="button"
                                                                    class="btn btn-outline-primary center-two-buttons mobile_button"
                                                                    style={{ minWidth: '180px' }}
                                                                    onclick={this.copyText()}>{translation.Copy}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="modal fade" id="sharedEmail" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                        <div class="modal-dialog" role="document" style={{ maxWidth: '100%' }}>
                                                            <div class="modal-content">
                                                                <div class="modal-header">
                                                                    <h5 class="modal-title" id="exampleModalLabel">{translation.Share_by_email}</h5>
                                                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                                        <span aria-hidden="true">&times;</span>
                                                                    </button>
                                                                </div>
                                                                <div class="modal-body">
                                                                    <div className="row">
                                                                        <div className="col-md-9 col-lg-8 mx-auto">
                                                                            <form name="addAccountform" onSubmit={this.sendEmail.bind(this)}>
                                                                                <div className="form-group row">
                                                                                    <strong htmlFor="inputEmail">{translation.Email}</strong>
                                                                                    <input type="email" id="ename" name="ename" className="form-control" onChange={this.handleChange.bind(this, "sendEmail")} value={this.state.fields["sendEmail"]} required autoFocus />
                                                                                </div>
                                                                                <div class="vspace1em"></div>
                                                                                <div class="container-fluid">
                                                                                    <div class="row">
                                                                                        <button type="submit" value="Submit" class="btn btn-primary ml-auto primaryTop mobile_button">{translation.Submit}</button>
                                                                                    </div>
                                                                                    <div class="form-group row">
                                                                                        <label for="inputPassword" class="col-sm-2 col-form-label"></label>
                                                                                        <div class="col-sm-12">
                                                                                            <label class="error-font-style" >{this.state.emailSendMessage}</label>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </form>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                             
                                                </div>

                                                <h5 className="modal-title headerTop">{translation.Producers}</h5>

                                                <div className="alert alert-secondary pb-4" role="alert">
                                                <form name="addAccountform" onSubmit={this.createConsultantInvitationLevel1.bind(this)}>
                                                    <div className="row">
                                                        <div className="col-md-8-2 col-sm-8 col-xs-7">
                                                            <div className="form-label-group">
                                                                <div
                                                                    className="form-item-margin left ml-3 mt-3 text-alignment">
                                                                    <div class="row" htmlFor="inputEmail">
                                                                        {translation.producer_ACCESS_CODE}
                                                                    </div>
                                                                </div>
                                                                <input type="text" id="username" onChange={this.handleChange.bind(this, "accessCode")} value={this.state.fields["accessCode"]}
                                                                        className="form-control" name='username'
                                                                        required />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-3-10 col-sm-4 col-xs-5 btn-margin">
                                                            <button type="submit"
                                                                    className="btn btn-primary mobile_button d-flex ml-auto justify-content-center"
                                                                    style={{minWidth: '120px'}}>
                                                                {translation.Send}
                                                            </button>
                                                            <div class="col-sm-12">
                                                                    <label class="error-font-style" >{this.state.message}</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                   </form>
                                                </div>
                                                {consultantInvitations.map((invitation) => (
                                                <div class="row border inner-form-row-margin pb-2 pt-2">
                                                    <div class="col-sm-8 align-center col-12">
                                                        <div class="row">
                                                            <div className="col-4 text-center align-center">
                                                                <label htmlFor="inputEmail">{this.getCreatedDate(invitation.created_at)}</label>
                                                            </div>
                                                            <div className="col-8">
                                                                <p class="mb-0">{isFrench ? invitation.producteur_account.name_fr : invitation.producteur_account.name_en}</p>
                                                                <p class="mb-0">{invitation.producteur_account.contact_email}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-sm-4 align-center col-12 row-margin">
                                                        <div className="row">
                                                            <div className="col-9 align-center text-right">
                                                                <a href={this.state.base_url+"/access/producteur/"+invitation.producteur_account.id+"/dashboard"}>
                                                                    <button type="button" className="btn btn-outline-primary ">
                                                                        {translation.Connection}
                                                                    </button>
                                                                </a>
                                                            </div>
                                                            <div className="col-3 align-center text-center">
                                                                <img src={closeIcon}
                                                                     className="img-responsive inline-block right-actin-buttons"
                                                                     alt="Responsive image"
                                                                     data-toggle="modal"
                                                                     data-target={"#deleteInvitation" + invitation.id}
                                                                     class="img-responsive  right-actin-buttons"/>
                                                            </div>
                                                            <div class="modal fade"
                                                                    id={"deleteInvitation" + invitation.id}
                                                                    tabindex="-1"
                                                                    role="dialog"
                                                                    aria-labelledby="exampleModalLabel"
                                                                    aria-hidden="true">
                                                                    <div class="modal-dialog"
                                                                        role="document"
                                                                        style={{ maxWidth: '100%' }}>
                                                                        <div class="modal-content">
                                                                            <div
                                                                                class="modal-header">
                                                                                <h5 class="modal-title"
                                                                                    id="exampleModalLabel">
                                                                                    {translation.Do_you_want_to_delete_this_item}
                                                                                </h5>
                                                                                <button
                                                                                    type="button"
                                                                                    class="close"
                                                                                    data-dismiss="modal"
                                                                                    aria-label="Close">
                                                                                    <span
                                                                                        aria-hidden="true">&times;</span>
                                                                                </button>
                                                                            </div>
                                                                            <div
                                                                                class="modal-footer">
                                                                                <button
                                                                                    type="button"
                                                                                    class="btn btn-primary"
                                                                                    onClick={this.deleteAccessInvitationLevel1.bind(null, invitation.id)}
                                                                                    style={{ width: '40%' }}>
                                                                                    {translation.Yes}
                                                                                </button>
                                                                                <button
                                                                                    type="button"
                                                                                    class="btn btn-secondary"
                                                                                    data-dismiss="modal"
                                                                                    style={{ width: '40%' }}>
                                                                                    {translation.Close}
                                                                                </button>

                                                                                <br />
                                                                                <label
                                                                                    class="error-font-style">{this.state.deleteSuccMsg}</label>
                                                                            </div>
                                                                            {
                                                                                this.state.isDeleting ? (
                                                                                    <div className="text-center"><img class="ml-5" src={loading} /><br /><br /></div>
                                                                                ) : null
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                ))}

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </main>
                        <Footer/>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, null)(withLanguageHook(AccessInvitations));