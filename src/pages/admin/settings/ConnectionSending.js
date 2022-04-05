import React from 'react';
import '../../../components/settingsMain.css'
import alertIcon from "../../../public/img/alert_icon.png"
import playIcon from "../../../public/img/play_btn_icon.png"
import editIcon from "../../../public/img/edit_btn_icon.png"
import closeIcon from "../../../public/img/close_btn_icon.png"
import pauseIcon from "../../../public/img/pause_btn_icon.png"
import SettingPop from '../../../components/common/settingPopUP'
import DeletePopUp from '../../../components/Admin/settings/delete';
import NavBar from "../../../components/layout/main-navigation/AdminMainNavigation";
import Footer from "../../../components/layout/footer/AdminFooter";
import SlideBar from "../../../components/layout/side-navigation/AdminSideNavigation";
import { connect, useSelector, useDispatch } from 'react-redux';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import Api from "../../../helper/api";
import useTranslation from "../../../components/customHooks/translations";
import getLanguage from "../../../components/customHooks/get-language";
import {setLanguage} from "../../../actions";

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
        const dispatch = useDispatch();
        return <Component {...props} translation={translation} language={language} dispatch={dispatch}/>;
    }
}

class ConnectionSending extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            // isHidden: true
            isHidden: false,
            api: new Api(this.props.token),
            data: {},
            userObject: {},
            filterUser: [],
            errors: {},
            isLoaded: false,
            selectedIndex: null,
            fields: {},
            message: null,
            email_notification: false,
            idActiveList: [],
            phone: null

        }
        this.toggleOffer = this.toggleOffer.bind(this);
    }

    toggleOffer() {
        this.setState({
            // isHidden: !this.state.isHidden
            isHidden: false
        })
    }

    componentDidMount() {

        this.loadData();
    }

    loadData = () => {

        console.log("data  start");

        this.state.api
            .getOwnAccountDetils()
            .then(response => {
                console.log("data getOwnAccountDetils  ", response.data.data);
                if (response.status === 200) {
                    let fields = {};
                    let data = response.data.data;

                    fields["user_firstName"] = data.name_en;
                    fields["user_fr"] = data.name_fr;
                    fields["user_email"] = data.contact_email;
                    fields["user_phone"] = data.contact_phone;
                    fields["user_address"] = data.address;
                    fields["user_postal"] = data.postal_code;
                    fields["user_city"] = data.city;
                    fields["user_province"] = data.province;
                    fields["user_country"] = data.country;
                    fields["user_lang"] = data.language_pref;
                    fields["status"] = data.status;
                    fields["admin_firsName"] = data.user[0].first_name;
                    fields["admin_lastName"] = data.user[0].last_name;
                    fields["admin_email"] = data.user[0].email;
                    fields["admin_password"] = "";

                    this.setState({
                        isLoaded: true,
                        data: response.data.data,
                        userObject: response.data.data.user[0],
                        email_notification: data.user[0].email_notification_enabled,
                        phone: data.contact_phone,
                        fields
                    });

                } else {
                    let errors = {};

                    errors["message"] = "Oops1 Try again later";
                    console.log("error ****");
                    this.setState({
                        isLoaded: true,
                        data: {},
                        errors: errors
                    });
                }
            }).catch((err) => console.log(err));


        this.state.api
            .getAllUsers()
            .then(response => {
                console.log("getAllUsers *** ", response);




                if (response.status === 200) {



                    let allUser = response.data.data;
                    let filterUser = [];
                    let n = 0;
                    allUser.forEach(userObject => {
                        if (userObject.deletable)
                            filterUser[n] = userObject
                        n++;
                    });


                    let userId = [];
                    let x = 0;
                    filterUser.forEach(ent => {

                        if (ent.status == "active") {
                            userId[x] = ent.id;
                        }
                        x++;
                    });
                    this.setState({
                        filterUser: filterUser,
                        idActiveList: userId,
                    });

                } else {
                    // let errors = {};
                    // errors["message"] = "Oops1 Try again later";
                    //     console.log("error ****");
                    this.setState({
                        filterUser: [],
                        idActiveList: [],

                    });

                }

            }).catch(err => {
                if (err.response.status == 401) {
                    this.props.history.push('/');
                }
            });
    }

    handleChange(field, e) {
        let fields = this.state.fields;

        console.log("fields ", fields);
        console.log("fields value", e.target.value);
        fields[field] = e.target.value;
        this.setState({ fields });
    }

    updateDataformSubmit(e) {
        e.preventDefault();
        let errors = {};

    }

    updateAccount(e) {
        e.preventDefault();

        console.log("update*******");

        const data = this.state.fields;
        let formData = new FormData();
        let statusEditValue = "active";

        // if(this.state.statusEdit ||  this.state.statusEdit == "active"){
        //   statusEditValue = "active";
        // }else{
        //   statusEditValue = "inactive";
        // }

        formData.append('name_en', data.user_firstName);
        formData.append('name_fr', data.user_firstName);
        formData.append('contact_phone', this.state.phone);
        formData.append('contact_email', data.user_email);
        formData.append('address', data.user_address);
        formData.append('postal_code', data.user_postal);
        formData.append('city', data.user_city);
        formData.append('province', data.user_province);
        formData.append('country', data.user_country);
        formData.append('language_pref', data.user_lang);
        formData.append('status', statusEditValue);
        // Super admin
        formData.append('first_name', data.admin_firsName);
        formData.append('last_name', data.admin_lastName);
        formData.append('username', data.admin_email);
        formData.append('password', data.admin_password);
        formData.append('superadmin', 1);
        formData.append('email', data.admin_email);
        formData.append('email_notification_enabled', this.state.email_notification);
        formData.append('lang', this.props.language);

        this.state.api
            .updateOwnAccountDetils(formData)
            .then(response => {
                const dispatch = this.props.dispatch;
                dispatch(setLanguage(data.user_lang));
                this.setState({
                    message: response.data.message
                })
                this.loadData();
            })
            .catch(err => {
                if (err.response.status == 401) {
                    this.props.history.push('/');
                }
            });
    }

    // handleValidation() {
    //     let fields = this.state.fields;
    //     let errors = {};
    //     let formIsValid = true;

    //     if (!fields["enterprisename"]) {
    //         formIsValid = false;
    //         console.log("formIsValid enterprisename", this.state.fields["enterprisename"]);
    //         errors["enterprisename"] = "Courriel est requis";
    //     }

    //     if (!fields["entrepriseemail"]) {
    //         formIsValid = false;
    //         console.log("formIsValid entrepriseemail", this.state.fields["entrepriseemail"]);
    //         errors["entrepriseemail"] = "Courriel est requis";
    //     } else {
    //         let lastAtPos = fields["entrepriseemail"].lastIndexOf('@');
    //         let lastDotPos = fields["entrepriseemail"].lastIndexOf('.');

    //         if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["entrepriseemail"].indexOf('@@') == -1 && lastDotPos > 2 && (fields["entrepriseemail"].length - lastDotPos) > 2)) {
    //             formIsValid = false;
    //             errors["entrepriseemail"] = "L'adresse de courriel n'est pas valide";
    //         }
    //     }

    //     if (!fields["superuserfname"]) {
    //         formIsValid = false;
    //         console.log("formIsValid superuserfname", this.state.fields["superuserfname"]);
    //         errors["superuserfname"] = "Courriel est requis";
    //     }

    //     if (!fields["superuserlname"]) {
    //         formIsValid = false;
    //         console.log("formIsValid superuserlname", this.state.fields["superuserlname"]);
    //         errors["superuserlname"] = "Courriel est requis";
    //     }

    //     // if (!fields["superusermobile"]) {
    //     //     formIsValid = false;
    //     //     console.log("formIsValid superusermobile", this.state.fields["superusermobile"]);
    //     //     errors["superusermobile"] = "Courriel est requis";
    //     // }

    //     if (!fields["superusermail"]) {
    //         formIsValid = false;
    //         console.log("formIsValid superusermail", this.state.fields["superusermail"]);
    //         errors["superusermail"] = "Courriel est requis";
    //     } else {
    //         let lastAtPos = fields["superusermail"].lastIndexOf('@');
    //         let lastDotPos = fields["superusermail"].lastIndexOf('.');

    //         if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["superusermail"].indexOf('@@') == -1 && lastDotPos > 2 && (fields["superusermail"].length - lastDotPos) > 2)) {
    //             formIsValid = false;
    //             errors["superusermail"] = "L'adresse de courriel n'est pas valide";
    //         }
    //     }

    //     if (!fields["superuserpassword"]) {
    //         formIsValid = false;
    //         console.log("formIsValid superuserpassword", this.state.fields["superuserpassword"]);
    //         errors["superuserpassword"] = "Courriel est requis";
    //     }

    //     this.setState({ errors: errors });
    //     console.log("formIsValid", formIsValid);
    //     return formIsValid

    // }

    onClickFunction = (idx) => {
        this.setState({ selectedIndex: idx })
    }

    DeleteAccount(id) {

        this.state.api
            .deleteAccounts(id)
            .then(response => {
                console.log("data  new delete** ", response);
                this.setState({ message: response.data.message });
            })
            .catch(err => {
                if (err.response.status == 401) {
                    this.props.history.push('/');
                }
            });

    }

    checkBoxEmail = () => {

        var email_notification = !this.state.email_notification
        console.log("email_notification *** ", email_notification);
        this.setState({
            email_notification: email_notification
        })

    }

    handleClick(e) {
        let ID = Number(e.target.id);
        console.log("id******", ID);
        let newIdList = this.state.idActiveList;
        if (newIdList.includes(ID)) {
            var index = newIdList.indexOf(ID)
            newIdList.splice(index, 1);
            this.updateUserStatus(ID, "inactive");
        } else {
            newIdList.push(ID);
            this.updateUserStatus(ID, "active");
        }

    }


    updateUserStatus(id, status) {


        const dataObject = {
            "status": status,
            "lang": this.props.language
        }

        this.state.api
            .updateUser([id, dataObject])
            .then(response => {
                console.log("data  new update** ", response.data);

                // setTimeout(this.loadData(), 500);
            })
            .catch(err => {

                if (err.response.status == 401) {
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

    onChangePhone(phone) {
        this.setState({ phone: phone });
    }

    render() {

        const { errors, isLoaded, data, userObject, filterUser, isHidden, selectedIndex, email_notification, idActiveList,fields } = this.state;
        // let user = data.user[0];

        if (!this.props.isLogged) {
            this.props.history.push('/');
        } else if (this.props.userRole != "ROLE_ADMIN") {
            this.props.history.push('/');
        }
        const translation = this.props.translation;
        return (
            <div className={isHidden ? "sb-nav-fixed" : "sb-nav-fixed sb-sidenav-toggled"}>
                <NavBar ></NavBar>
                <div>
                    {/* <SlideBar></SlideBar> */}
                    <div id="layoutSidenav_content" class="settings_content">
                        <main>
                            <div class="container-fluid" id="mainDivSelect">
                                <div class="row">

                                    <div className="col-md-3 sidebarbackgroundcolour">
                                        <SlideBar></SlideBar>
                                    </div>

                                    <div className="col-md-9 nopadding mb-5">
                                        <div class="card">
                                            <div className="col-lg-11 col-md-11 mx-auto">
                                                <form name="addAccountform" onSubmit={this.updateAccount.bind(this)}>
                                                    <h5 className="modal-title textColor headerTop"
                                                        id="exampleModalLabel">{translation.Primary_Contact_Information}</h5>
                                                    <div className="form-label-group ">
                                                        <div className="form-item-margin">
                                                            <strong htmlFor="inputEmail">{translation.Name}*</strong>
                                                        </div>
                                                        <input type="text" id="user_firstName" className="form-control"
                                                            name='username' defaultValue={data.name_en} onChange={this.handleChange.bind(this, "user_firstName")} required
                                                            autoFocus />
                                                    </div>

                                                    <div className="form-label-group">
                                                        <div className="form-item-margin">
                                                            <strong htmlFor="inputEmail">{translation.Phone_Number}</strong>
                                                        </div>
                                                        <div class="form-group">
                                                            <PhoneInput
                                                                country={'ca'}
                                                                value={this.state.phone}
                                                                onChange={phone => this.onChangePhone(phone)}
                                                                required={true}
                                                                onlyCountries={['ca']}
                                                                className="react-tel-input .form-control"
                                                            />
                                                            {(this.state.errors && this.state.errors["Téléphone"]) ? (<span style={{ color: "red" }}>{this.state.errors["Téléphone"]}</span>) : null}
                                                        </div>
                                                    </div>



                                                    <div class="form-label-group">
                                                        <div className="form-item-margin">
                                                            <strong htmlFor="inputEmail">{translation.Language}</strong>
                                                        </div>
                                                        <div className="input-group">
                                                            <select className="form-select form-control"
                                                                    id="language_pref"
                                                                    aria-label="Default select example"
                                                                    value={fields["user_lang"]}
                                                                    onChange={this.handleChange.bind(this, "user_lang")}>
                                                                {/*<option*/}
                                                                {/*    value={item.language_pref ? item.language_pref : ""}*/}
                                                                {/*    disabled*/}
                                                                {/*    hidden>{translation.Choose_Language}</option>*/}
                                                                <option value="FR">Francais</option>
                                                                <option value="EN">English</option>
                                                            </select>
                                                        </div>
                                                    </div>

                                                    <div className="form-label-group">
                                                        <div className="form-item-margin">
                                                            <strong htmlFor="inputEmail">{translation.Address}</strong>
                                                        </div>
                                                        <input type="text" id="username" className="form-control"
                                                            name='username' defaultValue={data.address} onChange={this.handleChange.bind(this, "user_address")}
                                                            required />
                                                    </div>

                                                    <div className="form-label-group">
                                                        <div className="form-item-margin">
                                                            <strong htmlFor="inputEmail">{translation.Postal_Code}</strong>
                                                        </div>
                                                        <input type="text" id="username" className="form-control"
                                                            name='username' defaultValue={data.postal_code} onChange={this.handleChange.bind(this, "user_postal")}
                                                            required />
                                                    </div>

                                                    <div className="form-label-group">
                                                        <div className="form-item-margin">
                                                            <strong htmlFor="inputEmail">{translation.City}</strong>
                                                        </div>
                                                        <input type="text" id="username" className="form-control"
                                                            name='username' defaultValue={data.city} onChange={this.handleChange.bind(this, "user_city")}
                                                            required />
                                                    </div>

                                                    <div className="form-label-group">
                                                        <div className="form-item-margin">
                                                            <strong htmlFor="inputEmail">{translation.Province}</strong>
                                                        </div>
                                                        <input type="text" id="username" className="form-control"
                                                            name='username' defaultValue={data.province} onChange={this.handleChange.bind(this, "user_province")}
                                                            required />
                                                    </div>

                                                    <div className="form-label-group">
                                                        <div className="form-item-margin">
                                                            <strong htmlFor="inputEmail">{translation.Country}</strong>
                                                        </div>
                                                        <input type="text" id="username" className="form-control"
                                                            name='username' defaultValue={data.country} onChange={this.handleChange.bind(this, "user_country")}
                                                            required />
                                                    </div>

                                                    <div className="form-label-group">
                                                        <div className="form-item-margin">
                                                            <strong htmlFor="inputEmail">{translation.Email}*</strong>
                                                        </div>
                                                        <input type="email" id="username" className="form-control"
                                                            name='username' defaultValue={data.contact_email} onChange={this.handleChange.bind(this, "user_email")}
                                                            required />
                                                    </div>
                                                    {/* <div className="form-label-group">
                                                    <div className="form-item-margin">
                                                        <strong htmlFor="inputEmail">Confirmation de courriel*</strong>
                                                    </div>
                                                    <input type="email" id="username" className="form-control"
                                                        name='username' defaultValue={data.contact_email}
                                                        placeholder="Entrez de nouveau l'adresse courriel"  required/>
                                                </div> */}
                                                    {/* <div className="form-label-group">
                                                    <div className="form-item-margin">
                                                        <strong htmlFor="inputEmail">Mot de passe*</strong>
                                                    </div>
                                                    <input type="email" id="username" className="form-control"
                                                        name='username' placeholder="Entrez un mot de passe" defaultValue={userObject.password}
                                                        required/>
                                                </div> */}



                                                    {/* <div className="form-label-group">
                                                    <div className="form-item-margin">
                                                        <strong htmlFor="inputEmail">Confirmation de mot de
                                                            passe*</strong>
                                                    </div>
                                                    <input type="email" id="username" className="form-control"
                                                        name='username'
                                                        placeholder="Entrez de nouveau le mot de passe" defaultValue={userObject.password} required/>
                                                </div> */}

                                                    <h5 className="modal-title textColor headerTop"
                                                        id="exampleModalLabel">{translation.Main_user_login_information}</h5>

                                                    <div className="form-label-group ">
                                                        <div className="form-item-margin">
                                                            <strong htmlFor="inputEmail">{translation.First_Name}*</strong>
                                                        </div>
                                                        <input type="text" id="username" className="form-control"
                                                            name='username' defaultValue={userObject.first_name} required onChange={this.handleChange.bind(this, "admin_firsName")}
                                                        />
                                                    </div>
                                                    <div className="form-label-group">
                                                        <div className="form-item-margin">
                                                            <strong htmlFor="inputEmail">{translation.Name}*</strong>
                                                        </div>
                                                        <input type="text" id="username" className="form-control"
                                                            name='username' defaultValue={userObject.last_name} onChange={this.handleChange.bind(this, "admin_lastName")} required />
                                                    </div>


                                                    <div className="form-label-group">
                                                        <div className="form-item-margin">
                                                            <strong htmlFor="inputEmail">{translation.Email}*</strong>
                                                        </div>
                                                        <input type="email" id="username" className="form-control"
                                                            name='username' defaultValue={userObject.email} onChange={this.handleChange.bind(this, "admin_email")}
                                                            required />
                                                    </div>

                                                    <div className="form-label-group">
                                                        <div className="form-item-margin">
                                                            <strong htmlFor="inputEmail">{translation.Password}</strong>
                                                        </div>
                                                        <input type="password" id="username" className="form-control" onChange={this.handleChange.bind(this, "admin_password")}
                                                            name='username' placeholder="********"
                                                        />
                                                    </div>

                                                    <div className="form-label-group">
                                                        <div className="form-item-margin">
                                                            <strong htmlFor="inputEmail">{translation.Password_Confirmation}</strong>
                                                        </div>
                                                        <input type="password" id="username" className="form-control" onChange={this.handleChange.bind(this, "admin_confirmPass")}
                                                            name='username'
                                                            placeholder="********" />
                                                    </div>

                                                    <div class="form-label-group">
                                                        <div className="form-item-margin">
                                                            <strong htmlFor="inputEmail">{translation.Enable_email_notifications}</strong>
                                                            <input
                                                                type="checkbox"
                                                                checked={email_notification}
                                                                id={data.id}
                                                                name='emailnotification'
                                                                onChange={this.checkBoxEmail}
                                                                style={{ marginLeft: '100px' }}
                                                            />
                                                        </div>
                                                        <div class="input-group">


                                                        </div>
                                                    </div>

                                                    <div class="container-fluid">
                                                        <div class="row form-item-margin">
                                                            <button type="submit" class="btn btn-primary primaryTop mobile_button">
                                                                {translation.Save}
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <p className="text-secondary form-item-margin">*{translation.Required_Field}</p>
                                                    <div class="form-group row">
                                                        <label for="inputPassword" class="col-sm-2 col-form-label"></label>
                                                        <div class="col-sm-12">
                                                            <label class="error-font-style" >{this.state.message}</label>
                                                        </div>
                                                    </div>

                                                </form>
                                                <h5 className="modal-title textColor form-item-margin"
                                                    id="exampleModalLabel">{translation.My_account_users}</h5>

                                                <div class="alert alert-secondary" role="alert">

                                                    <div class="row">
                                                        <div class="column_left_alert">
                                                            <img src={alertIcon}
                                                                class="form-group img-responsive img-center align-me "
                                                                alt="workimg" />
                                                        </div>
                                                        <div class="column_right_alert">
                                                            <p>
                                                                {translation.A_user_has_the_same_rights_as_you_You_can_give_limited_access_via}
                                                                <strong> {translation.connection_strong}.</strong>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {filterUser.map((item, index) => (

                                                    <div class={` row  inner-form-row-margin ${selectedIndex === index ? 'bg-light' : 'border'}`}

                                                        onClick={this.onClickFunction.bind(null, index)} >
                                                        <div class="column form-item-margin">
                                                            <div class="row " style={{ marginLeft: '0px' }}>
                                                                <label htmlFor="inputEmail">{item.first_name}</label>
                                                            </div>
                                                            <div class="row " style={{ marginLeft: '0px' }}>
                                                                <label htmlFor="inputEmail">{item.email}</label>
                                                            </div>
                                                        </div>

                                                        <div class="column">
                                                            <div class="row ">
                                                                <div id="small-img"
                                                                    class="col-xs-12 col-sm-12 col-md-12 col-lg-12 d-flex justify-content-end form-item-margin">
                                                                    <ul>
                                                                        <img onClick={this.handleClick.bind(this)} id={item.id}
                                                                            src={idActiveList.includes(item.id) ? pauseIcon : playIcon} />
                                                                        <img src={editIcon}
                                                                            className="img-responsive  inline-block"
                                                                            data-toggle="modal"
                                                                            alt="Responsive image"
                                                                            data-target={"#modal" + item.id} />
                                                                        <img src={closeIcon}
                                                                            class="img-responsive inline-block"
                                                                            alt="Responsive image"
                                                                            data-toggle="modal"
                                                                            data-target={"#exampleModaldelete" + item.id} />

                                                                        <DeletePopUp id={"exampleModaldelete" + item.id} dataId={item.id} type={"setting"} ></DeletePopUp>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <SettingPop id={"modal" + item.id} data={item} type={"update"}></SettingPop>
                                                    </div>
                                                ))
                                                }
                                                <div class="container-fluid">
                                                    <div class="row">
                                                        <button type="button" data-target="#addAccount"
                                                            data-toggle="modal"
                                                            class="btn btn-primary ml-auto headerTop">
                                                            {translation.Add_User}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </main>
                        <SettingPop id={"addAccount"} data={{}} type={"create"}></SettingPop>
                        <br /><br />
                        <Footer />
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, null)(withLanguageHook(ConnectionSending));