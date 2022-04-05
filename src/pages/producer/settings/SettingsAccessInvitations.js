import React from 'react';
import SlideBar from '../../../components/layout/side-navigation/ProducerSideNavigation.js';
import '../../../components/settingsMain.css'
import NavBar from '../../../components/layout/main-navigation/ProducerMainNavigation';
import playIcon from "../../../public/img/play_btn_icon.png"
import closeIcon from "../../../public/img/close_btn_icon.png"
import pauseIcon from "../../../public/img/pause_btn_icon.png"
import SettingPop from '../../../components/common/settingPopUP'
import Footer from '../../../components/layout/footer/ProducerFooter';
import AccessApi from "../../../helper/access-api"
import { connect, useSelector, useDispatch } from 'react-redux';
import loading from "../../../loading.gif";
import useTranslation from "../../../components/customHooks/translations";
import HideModal from "../../../components/hideModal";
import getLanguage from "../../../components/customHooks/get-language";

const mapStateToProps = state => {
    let token = state.token;
    let userRole = state.userRole;
    let isLogged = state.isLogged;
    return { token, userRole, isLogged }
}

function withLanguageHook(Component) {
    return function WrappedComponent(props) {
        const translation = useTranslation();
        const language = getLanguage();
        return <Component {...props} translation={translation} language={language} />;
    }
}


class SettingsAccessInvitations extends React.Component {
    constructor(props) {
        super(props)
        const acc_id = this.props.match.params.acc_id;
        this.state = {
            isHidden: true,
            acc_id: acc_id,
            api: new AccessApi(this.props.token),
            base_url: "/producteur",
            admin_base_url: "/admin/producteur/" + acc_id,
            entreprise_base_url: "/entreprise/producteur/" + acc_id,
            consultant_base_url: "/consultant/producteur/" + acc_id,

            access_code: "",
            message: "",
            emailSendMessage: "",
            messageLevel1: "",
            fields: {},
            allInvitations: [],
            account_name: "",
            allInvitLevel1: [],
            isDeleting: false,
            hideModal: new HideModal(),
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
        this.getAllInvitationLevel2();
        this.getAllInvitationLevel1();
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

    copyText() {
        var copyText = this.state.access_code;
        if (navigator && navigator.clipboard) {
            navigator.clipboard.writeText(copyText);
        }
    }

    createInvitationLevel2 = (e) => {
        e.preventDefault();
        const data = this.state.fields;
        const dataObject = {
            "first_name": data.firstName,
            "last_name": data.lastName,
            "sent_to_email": data.email,
            "account_name": this.state.account_name,
            'lang': this.props.language,
        }
        this.state.api.createInvitationLevel2(dataObject)
            .then(response => {
                console.log("data  getAllInvitationLevel2 create ", response);
                data['firstName'] = "";
                data['lastName'] = "";
                data['email'] = "";
                this.setState({
                    fields: data,
                    message: response.data.message
                });
                this.getAllInvitationLevel2();
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

    returnInvitationLevel2 = (firstName, lastName, email) => {

        const dataObject = {
            "first_name": firstName,
            "last_name:": lastName,
            "sent_to_email": email,
            "account_name": this.state.account_name,
            'lang': this.props.language,
        }
        this.state.api.createInvitationLevel2(dataObject)
            .then(response => {
                console.log("data  getAllInvitationLevel2 create ", response);
            
                this.setState({
                    message: response.data.message
                });
                this.getAllInvitationLevel2();
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

    createInvitationLevel1 = (e) => {
        e.preventDefault();
        const data = this.state.fields;
        const dataObject = {
            "access_code": data.accessCode,
            'lang': this.props.language,

        }
        this.state.api.createInvitationLevel1(dataObject)
            .then(response => {
                console.log("data  getAllInvitationLevel1 create ", response);
                data['accessCode'] = "";
                this.setState({
                    fields: data,
                    messageLevel1: response.data.message
                });
                this.getAllInvitationLevel1();
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

    getAllInvitationLevel2 = () => {
        this.state.api.getAllInvitationLevel2()
            .then(response => {
                console.log("data == level2 ", response.data.data);
                this.setState({
                    allInvitations: response.data.data
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

    getAllInvitationLevel1 = () => {
        this.state.api.getAllInvitationLevel1()
            .then(response => {
                console.log("data****  ", response.data.data);
                this.setState({
                    allInvitLevel1: response.data.data
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

    changeStatusLevel2(e) {
        let id = e.target.id;
        let status = e.target.name;
        console.log(" status ************** ", status);
        if (status == "active") {
            status = "inactive";
        } else {
            status = "active"
        }
        this.setStatusLevel2(id, status);
    }

    changeStatusLevel1(e) {
        let id = e.target.id;
        let status = e.target.name;
        console.log(" status ************** ", status);
        if (status == "active") {
            status = "inactive";
        } else {
            status = "active"
        }
        this.setStatusLevel1(id, status);
    }

    setStatusLevel2(id, status) {

        this.state.api
            .setStatusLevel2([id, status])
            .then(response => {
                console.log(" status **************response  ", response);
                setTimeout(this.getAllInvitationLevel2(), 500);
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

    setStatusLevel1(id, status) {

        this.state.api
            .setStatusLevel1([id, status])
            .then(response => {
                console.log(" status **************response  ", response);
                setTimeout(this.getAllInvitationLevel1(), 500);
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

    deleteAccessInvitationLevel2 = (id) => {
        this.setState({ isDeleting: true })
        this.state.api
            .deleteAccessInvitationLevel2(id)
            .then(response => {
                console.log("data  new delete** ", response);
                this.setState({ deleteSuccMsg: response.data.message, isDeleting: false });
                setTimeout(this.state.hideModal.hideModal(), 1000);
                setTimeout(this.getAllInvitationLevel2(), 500);
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

    deleteAccessInvitationLevel1 = (id) => {
        this.setState({ isDeleting: true })
        this.state.api
            .deleteAccessInvitationLevel1(id)
            .then(response => {
                console.log("data  new delete** ", response);
                this.setState({ deleteSuccMsg: response.data.message, isDeleting: false });
                setTimeout(this.state.hideModal.hideModal(), 1000);
                setTimeout(this.getAllInvitationLevel1(), 500);
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

    sendEmail = (e) => {
        e.preventDefault();
        const data = this.state.fields;
        const dataObject = {
            "account_name": this.state.account_name,
            'lang': this.props.language,
            "access_code": this.state.access_code,
            "sent_to_email": data.sendEmail
        }
        console.log("sendInvitationProducture dataObject", dataObject);
        this.state.api.sendInvitationProducture(dataObject)
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


    render() {
        let base_url = this.state.base_url;
        if (!this.props.isLogged) {
            this.props.history.push('/');
        } else if (this.props.userRole == "ROLE_PRODUCTEUR") {

        } else if (this.props.userRole == "ROLE_ADMIN" && this.state.acc_id) {
            base_url = this.state.admin_base_url;
        } else if (this.props.userRole == "ROLE_ENTREPRISE" && this.state.acc_id) {
            base_url = this.state.entreprise_base_url;
        } else if (this.props.userRole == "ROLE_CONSULTANT" && this.state.acc_id) {
            base_url = this.state.consultant_base_url;
        } else {
            this.props.history.push('/');
        }
        const { isHidden, access_code, allInvitations, allInvitLevel1 } = this.state
        const translation = this.props.translation;
        return (
            <div className={isHidden ? "sb-nav-fixed" : "sb-nav-fixed sb-sidenav-toggled"}>
                <NavBar base_url={base_url} acc_id={this.state.acc_id} toggleOffer={this.toggleOffer}></NavBar>
                <div id="mainDivSelect">

                    <div id="layoutSidenav_content" class="settings_content">
                        <main>
                            <div class="container-fluid">
                                <div class="row">
                                    <div className="col-md-3 sidebarbackgroundcolour">
                                        <SlideBar base_url={base_url}></SlideBar>
                                    </div>

                                    <div className="col-md-9 nopadding mb-4">
                                        <div class="card my-cart">
                                            <div className="col-md-11 col-lg-11 mx-auto">
                                                <h5 className="modal-title textColor headerTop"
                                                    id="exampleModalLabel">{translation.connection_strong}</h5>

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

                                                <h5 className="modal-title headerTop">{translation.Send_an_invitation_to_a_friend}</h5>

                                                <div class="alert alert-secondary" role="alert">
                                                    <form name="addAccountform" onSubmit={this.createInvitationLevel2.bind(this)}>
                                                        <div class="row">
                                                            <div class="col-md-6 col-sm-6 col-xs-6">
                                                                <div className="form-label-group ">
                                                                    <div className="form-item-margin">
                                                                        <strong htmlFor="inputEmail">{translation.Name}*</strong>
                                                                    </div>
                                                                    <input type="text" id="username" onChange={this.handleChange.bind(this, "firstName")} value={this.state.fields["firstName"]}
                                                                        className="form-control" name='username'
                                                                        required autoFocus />
                                                                </div>
                                                            </div>
                                                            <div class="col-md-6 col-sm-6 col-xs-6">
                                                                <div className="form-label-group">
                                                                    <div className="form-item-margin">
                                                                        <strong htmlFor="inputEmail">{translation.First_Name}*</strong>
                                                                    </div>
                                                                    <input type="text" id="username" onChange={this.handleChange.bind(this, "lastName")} value={this.state.fields["lastName"]}
                                                                        className="form-control" name='username'
                                                                        required />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="row">
                                                            <div class="col-md-8-2 col-sm-8 col-xs-7">
                                                                <div className="form-label-group ">
                                                                    <div className="form-item-margin">
                                                                        <strong htmlFor="inputEmail">{translation.Email}*</strong>
                                                                    </div>
                                                                    <input type="email" id="username" onChange={this.handleChange.bind(this, "email")} value={this.state.fields["email"]}
                                                                        className="form-control" name='username'
                                                                        required />
                                                                </div>
                                                            </div>
                                                            <div class="col-md-3-10 col-sm-4 col-xs-5">
                                                                <div class="vspace1em"></div>
                                                                <div class="vspace1em"></div>
                                                                <div class="vspace1em"></div>
                                                                <button type="submit"
                                                                    class="btn btn-primary mobile_button d-flex ml-auto justify-content-center"
                                                                    style={{ minWidth: '120px' }}>{translation.Send}
                                                                </button>
                                                                <div class="col-sm-12">
                                                                    <label class="error-font-style" >{this.state.message}</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>

                                                {allInvitations.map((invitation) => (
                                                    // <div class="row bg-light inner-form-row-margin">
                                                    <div class="row border inner-form-row-margin">
                                                        <div class="col-9">
                                                            <div class="row inner-form-row-margin">
                                                                <div class="col-md-7 col-md-7 col-sm-7 col-xs-12">
                                                                    <div class="row ">
                                                                        <label htmlFor="inputEmail">{invitation.first_name} {invitation.last_name}</label>
                                                                    </div>
                                                                    <div class="row ">
                                                                        <label
                                                                            htmlFor="inputEmail">{invitation.sent_to_email}</label>
                                                                    </div>
                                                                    <div class="row ">
                                                                        <label htmlFor="inputEmail">{translation.Date_sent} :&nbsp;
                                                                            {this.getCreatedDate(invitation.created_at)}</label>
                                                                    </div>
                                                                    <div class="vspace1em"></div>
                                                                </div>

                                                                <div class="col-md-5 col-sm-5 col-xs-12 ">
                                                                    <div>
                                                                        <div class="row ">
                                                                            <button type="button"
                                                                                class="btn btn-outline-primary"
                                                                                onClick= {this.returnInvitationLevel2.bind(null, invitation.first_name, invitation.last_name, invitation.sent_to_email)}
                                                                               >{translation.Return_the_invitation}
                                                                            </button>
                                                                        </div>

                                                                        {/* <div class="row form-item-margin">
                                                                            <button type="button"
                                                                                class="btn btn-outline-primary ">Copier&nbsp;le&nbsp;code
                                                                            </button>
                                                                        </div> */}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="vspace1em"></div>
                                                        </div>

                                                        <div class="col-3">
                                                            <div class="row form-item-margin "
                                                                style={{ marginRight: '10px' }}>
                                                                <div class="input-group-btn ml-auto">

                                                                    <img onClick={this.changeStatusLevel2.bind(this)} id={invitation.id} name={invitation.status}
                                                                        src={invitation.status == "active" ? pauseIcon : playIcon}
                                                                        class="img-responsive right-actin-buttons"
                                                                        alt="Responsive image"
                                                                        style={{ marginRight: '10px' }} />
                                                                    <img src={closeIcon}
                                                                        data-toggle="modal"
                                                                        data-target={"#deleteInvitation" + invitation.id}
                                                                        class="img-responsive  right-actin-buttons"
                                                                        alt="Responsive image" />
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
                                                                                    onClick={this.deleteAccessInvitationLevel2.bind(null, invitation.id)}
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

                                                <h5 className="modal-title headerTop">{translation.Consultants}</h5>


                                                <div class="alert alert-secondary" role="alert">
                                                    <form name="addAccountform" onSubmit={this.createInvitationLevel1.bind(this)}>
                                                        <div class="row">
                                                            <div class="col-md-8-2 col-sm-8 col-xs-7">

                                                                <div className="form-label-group ">

                                                                    <div className="form-item-margin">
                                                                        <strong htmlFor="inputEmail">{translation.consultant_with_Access_Code}</strong>
                                                                    </div>
                                                                    {/* <input type="tw" id="username"
                                                                    className="form-control" name='username'
                                                                    required /> */}
                                                                    <input type="text" id="username" onChange={this.handleChange.bind(this, "accessCode")} value={this.state.fields["accessCode"]}
                                                                        className="form-control" name='username'
                                                                        required />
                                                                </div>
                                                            </div>
                                                            <div class="col-md-3-10 col-sm-4 col-xs-5">
                                                                <div class="vspace1em"></div>
                                                                <div class="vspace1em"></div>
                                                                <div class="vspace1em"></div>

                                                                <button type="submit"
                                                                    class="btn btn-primary mobile_button d-flex ml-auto justify-content-center"
                                                                    style={{ minWidth: '120px' }}>{translation.Add}
                                                                </button>
                                                                <div class="col-sm-12">
                                                                    <label class="error-font-style" >{this.state.messageLevel1}</label>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>

                                                {allInvitLevel1.map((invitLevel1) => (
                                                    // <div class="row bg-light inner-form-row-margin">
                                                    <div class="row border inner-form-row-margin">
                                                        <div class="col-9">
                                                            <div class="row inner-form-row-margin">
                                                                <div class="col-md-7 col-md-7 col-sm-7 col-xs-12">
                                                                    <div class="row ">
                                                                        <label htmlFor="inputEmail">{invitLevel1.consultant_account.contact_first_name} {invitLevel1.consultant_account.contact_last_name}</label>
                                                                    </div>
                                                                    <div class="row ">
                                                                        <label
                                                                            htmlFor="inputEmail">{invitLevel1.consultant_account.contact_email}</label>
                                                                    </div>
                                                                    <div class="vspace1em"></div>
                                                                </div>
                                                                <div class="col-md-5 col-sm-5 col-xs-12 ">
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div class="col-3">
                                                            <div class="row form-item-margin "
                                                                style={{ marginRight: '10px' }}>
                                                                <div class="input-group-btn ml-auto">


                                                                    <img onClick={this.changeStatusLevel1.bind(this)} id={invitLevel1.id} name={invitLevel1.status}
                                                                        src={invitLevel1.status == "active" ? pauseIcon : playIcon}
                                                                        class="img-responsive right-actin-buttons"
                                                                        alt="Responsive image"
                                                                        style={{ marginRight: '10px' }} />
                                                                    <img src={closeIcon}
                                                                        data-toggle="modal"
                                                                        data-target={"#deleteinvitLevel1" + invitLevel1.id}
                                                                        class="img-responsive  right-actin-buttons"
                                                                        alt="Responsive image" />
                                                                </div>

                                                                <div class="modal fade"
                                                                    id={"deleteinvitLevel1" + invitLevel1.id}
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
                                                                                    onClick={this.deleteAccessInvitationLevel1.bind(null, invitLevel1.id)}
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
                                            <br />
                                        </div>
                                        <br />
                                    </div>
                                </div>
                            </div>

                        </main>
                        {/* <SettingPop acc_id={this.state.acc_id}></SettingPop> */}
                    </div>
                </div>
                <Footer></Footer>
            </div>
        )
    }
}

export default connect(mapStateToProps, null)(withLanguageHook(SettingsAccessInvitations));