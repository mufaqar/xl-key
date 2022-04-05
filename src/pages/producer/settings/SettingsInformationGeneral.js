import React from 'react';
import NavBar from '../../../components/layout/main-navigation/ProducerMainNavigation';
import Footer from '../../../components/layout/footer/ProducerFooter';
import SlideBar from '../../../components/layout/side-navigation/ProducerSideNavigation.js';
import { connect, useSelector, useDispatch } from 'react-redux';
import Api from "../../../helper/api"
import useTranslation from "../../../components/customHooks/translations";
import dataLoader from "../../../dataLoading.gif";
import loading from "../../../loading.gif";
import PageLoader from "../../../components/PageLoader";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import getLanguage from "../../../components/customHooks/get-language";
import {setLanguage} from "../../../actions";


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
        const dispatch = useDispatch();
        return <Component {...props} translation={translation} language={language} dispatch={dispatch}/>;
    }
}

class SettingsInformationGeneral extends React.Component {
    constructor(props) {
        super(props)
        const acc_id = this.props.match.params.acc_id;
        this.state = {
            // isHidden: true
            isHidden: false,
            data: null,
            api: new Api(this.props.token, acc_id),
            item: {},
            user: {},
            fields: {},
            message: null,
            selectedFile: null,
            email_notification: true,
            dataLoaded: false,
            isSaving: false,
            phone: null,

            acc_id:acc_id,
            base_url:"/producteur",
            admin_base_url:"/admin/producteur/"+acc_id,
            entreprise_base_url:"/entreprise/producteur/"+acc_id,
            consultant_base_url:"/consultant/producteur/"+acc_id,
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
        
        console.log("data  start");
        this.state.api
        .getOwnAccountDetils() 
        .then(response => {
            console.log("data message  ", response);
            let data
            if(response.status === 200){

                let fields = {};
                let data =  response.data.data;

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
                fields["logo"]  = data.logo_url;

                this.setState({
                    isLoaded: true,
                    item: response.data.data,
                    user:  response.data.data.user[0],
                    email_notification: response.data.data.user[0].email_notification_enabled,
                    dataLoaded: true,
                    phone: data.contact_phone,
                    fields
                    });

           }else {
            let errors = {};
    
            errors["message"] = "Oops1 Try again later";
               console.log("error ****");
            this.setState({
                isLoaded: true,
                item: {},
                user:{},
                errors: errors 
            });
           }
        }).catch((err) => console.log(err));
    }

    updateAccount(e) {
        e.preventDefault();

        this.setState({isSaving: true})
        const data = this.state.fields;
        let formData = new FormData();
        let statusEditValue  = "active";
        let email_notification  = 0;
    
        // if(this.state.email_notification ||  this.state.statusEdit == "active"){
        //   statusEditValue = "active";
        // }else{
        //   statusEditValue = "inactive";
        // }

        if(this.state.email_notification ){
            email_notification  = "1";
        }else{
            email_notification  = "0";
        }
        
    
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
        formData.append('email_notification_enabled', 1);
        formData.append('logo', this.state.selectedFile);
        formData.append('lang', this.props.language);

        console.log("update******* 123", email_notification);
        this.state.api
          .updateOwnAccountDetils(formData) 
          .then(response => {
              const dispatch = this.props.dispatch;
              dispatch(setLanguage(data.user_lang));
            console.log("data  new update** ", response.data);
            this.setState({
              message : response.data.message,
              isSaving: false,
            })
              setTimeout(
                  function() {
                      this.setState({message: ""})
                  }
                      .bind(this),
                  4000
              );

          })
          .catch(err => {
            if( err.response.status == 401){
                this.props.history.push('/');
            }else{
                this.setState({isSaving: false});
                if (err.response && err.response.data.message) {
                    this.setState({ message: err.response.data.message});  
                } else {
                    this.setState({ message: "Quelque chose s'est mal passé !"});
                }
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

    checkBoxEditing =()  => {
   
        var email_notification = !this.state.email_notification
        console.log("email_notification *** ", email_notification);
        this.setState({
            email_notification: email_notification
        })
    
      }
    
    fileSelectedHandler = event => {
       this.setState({ selectedFile:event.target.files[0]});
    };

    onChangePhone(phone) {
        this.setState({ phone: phone });
    };

    render() {

        const {  item, user,fields, selectedFile, email_notification } = this.state;

        let base_url = this.state.base_url;
        if (!this.props.isLogged) {
            this.props.history.push('/');
        } else if (this.props.userRole=="ROLE_PRODUCTEUR") {

        } else if (this.props.userRole=="ROLE_ADMIN" && this.state.acc_id) {
            base_url = this.state.admin_base_url;
        } else if (this.props.userRole=="ROLE_ENTREPRISE" && this.state.acc_id) {
            base_url = this.state.entreprise_base_url;
        } else if (this.props.userRole=="ROLE_CONSULTANT" && this.state.acc_id) {
            base_url = this.state.consultant_base_url;
        } else  {
            this.props.history.push('/');
        }
        const translation = this.props.translation;
        const {isHidden} = this.state
        return (
            <div className={isHidden ? "sb-nav-fixed" : "sb-nav-fixed sb-sidenav-toggled"} >
            <NavBar base_url={base_url} acc_id={this.state.acc_id}></NavBar>
            <div id="mainDivSelect">
                <div id="layoutSidenav_content" class="settings_content">
                    <main>
                        <div class="container-fluid">
                            <div class="row">
                                <div className="col-md-3 sidebarbackgroundcolour">
                                    <SlideBar base_url={base_url}></SlideBar>
                                </div>

                                <div className="col-md-9 nopadding mb-5">
                                    <form name="updateAccountform" onSubmit={this.updateAccount.bind(this)}>
                                        <div className="card my-cart pb-4">
                                            <div className="col-md-11 col-lg-11 cal-sm-11 mx-auto">

                                                <h5 className="modal-title textColor headerTop" id="exampleModalLabel">
                                                    {translation.Primary_Contact_Information}
                                                </h5>
                                                {this.state.dataLoaded ?
                                                    (
                                                        <div>
                                                            <div className="form-label-group">
                                                                <div className="form-item-margin">
                                                                    <strong htmlFor="inputEmail">{translation.Name}</strong>
                                                                </div>
                                                                <input type="text" id="username" className="form-control"
                                                                       name='username' 
                                                                       value={fields["user_firstName"]}
                                                                       onChange={this.handleChange.bind(this, "user_firstName")}
                                                                       required autoFocus/>
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
                                                            <div className="form-label-group">
                                                                <div className="form-item-margin">
                                                                    <strong
                                                                        htmlFor="inputEmail">{translation.Email}</strong>
                                                                </div>
                                                                <input type="email" id="username" className="form-control"
                                                                       name='username'
                                                                       
                                                                       value={fields["user_email"]}
                                                                       onChange={this.handleChange.bind(this, "user_email")}
                                                                       required/>
                                                            </div>

                                                            <div className="form-label-group">
                                                                <div className="form-item-margin">
                                                                    <strong
                                                                        htmlFor="inputEmail">{translation.Address}</strong>
                                                                </div>
                                                                <input type="text" id="username" className="form-control"
                                                                       name='username' defaultValue="address"
                                                                       
                                                                       value={fields["user_address"]}
                                                                       onChange={this.handleChange.bind(this, "user_address")}
                                                                       required/>
                                                            </div>
                                                            <div className="form-label-group">
                                                                <div className="form-item-margin">
                                                                    <strong
                                                                        htmlFor="inputEmail">{translation.Postal_Code}</strong>
                                                                </div>
                                                                <input type="text" id="username" className="form-control"
                                                                       name='username' 
                                                                       value={fields["user_postal"]}
                                                                       onChange={this.handleChange.bind(this, "user_postal")}
                                                                       required/>
                                                            </div>
                                                            <div className="form-label-group">
                                                                <div className="form-item-margin">
                                                                    <strong htmlFor="inputEmail">{translation.City}</strong>
                                                                </div>
                                                                <input type="text" id="username" className="form-control"
                                                                       name='username' 
                                                                       value={fields["user_city"]}
                                                                       onChange={this.handleChange.bind(this, "user_city")}
                                                                       required/>
                                                            </div>
                                                            <div className="form-label-group">
                                                                <div className="form-item-margin">
                                                                    <strong
                                                                        htmlFor="inputEmail">{translation.Province}</strong>
                                                                </div>
                                                                <input type="text" id="username" className="form-control"
                                                                       name='username' 
                                                                       value={fields["user_province"]}
                                                                       onChange={this.handleChange.bind(this, "user_province")}
                                                                       required/>
                                                            </div>
                                                            <div className="form-label-group">
                                                                <div className="form-item-margin">
                                                                    <strong
                                                                        htmlFor="inputEmail">{translation.Country}</strong>
                                                                </div>
                                                                <input type="text" id="username" className="form-control"
                                                                       name='username' 
                                                                       value={fields["user_country"]}
                                                                       onChange={this.handleChange.bind(this, "user_country")}
                                                                       required/>
                                                            </div>

                                                            <div className="form-label-group">
                                                                <div className="form-item-margin">
                                                                    <strong htmlFor="inputEmail">{translation.Logo}</strong>
                                                                </div>

                                                                <div className="input-group">

                                                                    {

                                                                        item.logo_url != "" ? (<div className="form-group"
                                                                                                    style={{width: '3.5em'}}>
                                                                                <img
                                                                                    src={process.env.REACT_APP_IMAGE_URL + item.logo_url}/>
                                                                            </div>) :
                                                                            <div></div>

                                                                    }
                                                                    <input
                                                                        type="file"
                                                                        accept="image/*"
                                                                        ref="logo_url"
                                                                        id={item.id}
                                                                        name='logo'
                                                                        onChange={this.fileSelectedHandler}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <h5 className="modal-title textColor headerTop"
                                                                id="exampleModalLabel">{translation.Primary_User_Information}</h5>
                                                            <div className="form-label-group">
                                                                <div className="form-item-margin">
                                                                    <strong
                                                                        htmlFor="inputEmail">{translation.First_Name}</strong>
                                                                </div>
                                                                <input type="text" id="username" className="form-control"
                                                                       name='username' 
                                                                       value={fields["admin_firsName"]}
                                                                       onChange={this.handleChange.bind(this, "admin_firsName")}
                                                                       required/>
                                                            </div>
                                                            <div className="form-label-group">
                                                                <div className="form-item-margin">
                                                                    <strong htmlFor="inputEmail">{translation.Name}</strong>
                                                                </div>
                                                                <input type="text" id="username" className="form-control"
                                                                       name='username' 
                                                                       value={fields["admin_lastName"]}
                                                                       onChange={this.handleChange.bind(this, "admin_lastName")}
                                                                       required/>
                                                            </div>

                                                            <div className="form-label-group">
                                                                <div className="form-item-margin">
                                                                    <strong
                                                                        htmlFor="inputEmail">{translation.Email}</strong>
                                                                </div>
                                                                <input type="email" id="username" className="form-control"
                                                                       name='username'
                                                                    
                                                                       value={fields["admin_email"]}
                                                                       onChange={this.handleChange.bind(this, "admin_email")}
                                                                       required/>
                                                            </div>
                                                            {/* <div className="form-label-group">
                                                    <div className="form-item-margin">
                                                        <strong htmlFor="inputEmail">Nom d'utilisateur</strong>
                                                    </div>
                                                    <input type="email" id="username" className="form-control" name='username' placeholder="Entrez votre adresse courriel" required />
                                                </div> */}
                                                            <div className="form-label-group">
                                                                <div className="form-item-margin">
                                                                    <strong
                                                                        htmlFor="inputEmail">{translation.Password}</strong>
                                                                </div>
                                                                <input type="text" id="username" className="form-control"
                                                                       name='username' placeholder="*******"
                                                                       value={fields["admin_password"]}
                                                                       onChange={this.handleChange.bind(this, "admin_password")}/>
                                                            </div>
                                                            <div className="form-label-group">
                                                                <div className="form-item-margin">
                                                                    <strong
                                                                        htmlFor="inputEmail">{translation.Language}</strong>
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
                                                                    <strong
                                                                        htmlFor="inputEmail">{translation.Enable_email_notifications}</strong>
                                                                    <input
                                                                        type="checkbox"
                                                                        value={email_notification}
                                                                        id={item.id}
                                                                        name='emailnotification'
                                                                        defaultChecked={user.email_notification_enabled}
                                                                        onChange={this.checkBoxEditing}
                                                                        style={{marginLeft: '100px'}}
                                                                    />
                                                                </div>
                                                                <div className="input-group">


                                                                </div>
                                                            </div>

                                                            <div className="form-group">
                                                                <button type="submit"
                                                                        className="btn btn-primary primaryTop mobile_button col-sm-5 col-form-label">{translation.Save}</button>
                                                                {
                                                                    this.state.isSaving ? (
                                                                            <div className="mobile_button col-sm-5 col-form-label text-center"><img
                                                                                src={loading}/></div>
                                                                        ) :
                                                                        null
                                                                }

                                                            </div>
                                                            <p className="text-secondary">* {translation.Required_Field}</p>

                                                            <div className="form-group">
                                                                <label htmlFor="inputPassword"
                                                                       className="col-sm-2 col-form-label"></label>
                                                                <div className="col-sm-12">
                                                                    <label
                                                                        className="error-font-style">{this.state.message}</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) :
                                                    (
                                                        <div className="text-center"><img src={dataLoader}/><br/><br/><br/></div>
                                                    )
                                                }

                                            </div>
                                        </div>
                                    </form>
                                </div>

                            </div>
                        </div>

                    </main>

                </div>
            </div>
            <Footer></Footer>
        </div>
)
    }
}

export default connect(mapStateToProps, null)(withLanguageHook(SettingsInformationGeneral));