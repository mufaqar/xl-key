import React from 'react';
import SlideBar from '../../../components/layout/side-navigation/ProducerSideNavigation.js';
import '../../../components/settingsMain.css'
import NavBar from '../../../components/layout/main-navigation/ProducerMainNavigation';
import alertIcon from "../../../public/img/alert_icon.png"
import playIcon from "../../../public/img/play_btn_icon.png"
import editIcon from "../../../public/img/edit_btn_icon.png"
import closeIcon from "../../../public/img/close_btn_icon.png"
import pauseIcon from "../../../public/img/pause_btn_icon.png"
import SettingPop from '../../../components/common/settingPopUP'
import Footer from '../../../components/layout/footer/ProducerFooter';
import { connect, useSelector, useDispatch } from 'react-redux';
import Api from "../../../helper/api.js";
import DeletePopUp from '../../../components/producer/settings/delete';
import useTranslation from "../../../components/customHooks/translations";
import dataLoader from "../../../dataLoading.gif";
import getLanguage from "../../../components/customHooks/get-language";

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

class SettingsConnectionSending extends React.Component {
    constructor(props) {
        super(props)
        const acc_id = this.props.match.params.acc_id;
        this.state = {
            // isHidden: true
            isHidden: false,
            api: new Api(this.props.token, acc_id),
            data:  {},
            userObject: {},
            filterUser: [],
            errors: {},
            isLoaded: false,
            selectedIndex: null,
            fields: {},
            email_notification: false,
            message: null,
            idActiveList:[],
            dataLoaded: false,
            
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
      
        this.loadData();
   }

    loadData = () => {
        
        console.log("data  start");
    
        this.state.api
        .getOwnAccountDetils() 
        .then(response => {
            console.log("data getOwnAccountDetils  ", response.data.data.user[0]);
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
                fields["user_lang"] = data.laguage_pref;   
                fields["status"] = data.status;
                fields["admin_firsName"] = data.user[0].first_name;
                fields["admin_lastName"] = data.user[0].last_name;
                fields["admin_email"] = data.user[0].email;
                fields["admin_password"] = "";
            
              

                this.setState({ fields });

            this.setState({
                isLoaded: true,
                data: response.data.data,
                email_notification : data.user[0].email_notification_enabled,
                userObject: response.data.data.user[0],
                dataLoaded: true,
            });

           
           }else {
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
            console.log("getAllUsers *** ",response );

            if(response.status === 200){
                let allUser = response.data.data;
                let filterUser = [];
                let n = 0;
                allUser.forEach(userObject => {
                    if(userObject.deletable)
                    filterUser[n] = userObject
                    n++;
                });
              
                let userId = [];
                let x = 0;
                filterUser.forEach(ent => {
            
                    if(ent.status == "active"){
                        userId[x] = ent.id;
                    }
                    x++;
                });
                this.setState({
                    filterUser: filterUser,
                    idActiveList: userId,
                });
              
      
            }else {
            this.setState({
                filterUser:[],
                idActiveList: [],

            });

            }
           
        }) .catch(err => {
            if( err.response.status == 401){
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

        // if (this.handleValidation()) {
        //     this.setState({ errors: errors });
        //     this.addAccount(e);

        //     // alert("Form submitted");
        // } else {

        //     // alert("Form is not submitted");
        // }
    }

    updateAccount(e) {
        e.preventDefault();

        console.log("update*******");

        const data = this.state.fields;
        let formData = new FormData();
        let statusEditValue  = "active";
    
        // if(this.state.statusEdit ||  this.state.statusEdit == "active"){
        //   statusEditValue = "active";
        // }else{
        //   statusEditValue = "inactive";
        // }
    
        formData.append('name_en', data.user_firstName);
        formData.append('name_fr', data.user_firstName);
        formData.append('contact_phone', data.user_phone);
        formData.append('contact_email', data.user_email);
        formData.append('address', data.user_address);
        formData.append('postal_code', data.user_postal);
        formData.append('city', data.user_city);
        formData.append('province', data.user_province);
        formData.append('country', data.user_country);
        formData.append('laguage_pref', data.user_lang);
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
        // formData.append('logo', this.state.selectedFile);
    

        console.log("update******* 123");
        this.state.api
          .updateOwnAccountDetils(formData) 
          .then(response => {
            console.log("update******* 123", response.data);
            console.log("data  new update** ", response.data);
            this.setState({
              message : response.data.message
            })
            this.loadData();
          })
          .catch(err => {
            if( err.response.status == 401){
                this.props.history.push('/');
            }else{
                if (err.response && err.response.data.message) {
                    this.setState({ message: err.response.data.message});  
                } else {
                    this.setState({ message: "Quelque chose s'est mal passé !"});
                }
            }
          });
      }



    onClickFunction = (idx) => {
        this.setState({selectedIndex: idx})
    }

    checkBoxEmail =()  => {

        var email_notification = !this.state.email_notification
        console.log("email_notification *** ", email_notification);
        this.setState({
            email_notification: email_notification
        })
    
        }

        
    handleClick(e){
        let ID = Number(e.target.id);
        console.log("id******", ID );
        let newIdList = this.state.idActiveList;
        if(newIdList.includes(ID)){
            var index = newIdList.indexOf(ID)
            newIdList.splice(index, 1);
            this.updateUserStatus(ID, "inactive");
        }else{
            newIdList.push(ID);
            this.updateUserStatus(ID, "active");
        }
       
    }
    

    updateUserStatus(id, status) {

        const dataObject = {
            "status": status
        }
    
        this.state.api
          .updateUser([id,dataObject])
          .then(response => {
            console.log("data  new update** ", response.data);

            // setTimeout(this.loadData(), 500);
          })
          .catch(err => {

            if( err.response.status == 401){
                this.props.history.push('/');
            }else{
                if (err.response && err.response.data.message) {
                    this.setState({ message: err.response.data.message});  
                } else {
                    this.setState({ message: "Quelque chose s'est mal passé !"});
                }
            }
          });
    }



    render() {
        
        const {errors, isLoaded, data, userObject, filterUser, isHidden, selectedIndex, email_notification, idActiveList} = this.state;
        // let user = data.user[0];

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
            return (
                <div className={isHidden ? "sb-nav-fixed" : "sb-nav-fixed sb-sidenav-toggled"}>
                <NavBar base_url={base_url} acc_id={this.state.acc_id} toggleOffer={this.toggleOffer}></NavBar>
                <div>
                    {/* <SlideBar></SlideBar> */}
                    <div id="layoutSidenav_content" class="settings_content">
                        <main>
                            <div class="container-fluid" id="mainDivSelect">
                                <div class="row">

                                    <div className="col-md-3 sidebarbackgroundcolour">
                                        <SlideBar base_url={base_url}></SlideBar>
                                    </div>

                                    <div className="col-md-9 nopadding mb-5">
                                        <div class="card">
                                            <div className="col-lg-11 col-md-11 mx-auto">

                                                <h5 className="modal-title textColor form-item-margin"
                                                    id="exampleModalLabel">{translation.My_Account_Users}</h5>

                                                <div class="alert alert-secondary" role="alert">

                                                    <div class="row">
                                                        <div class="column_left_alert">
                                                            <img src={alertIcon}
                                                                class="form-group img-responsive img-center align-me "
                                                                alt="workimg"/>
                                                        </div>
                                                        <div class="column_right_alert">
                                                            <p>{translation.connection_paragraph}
                                                                <strong> {translation.connection_strong}</strong>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {this.state.dataLoaded ?
                                                    (
                                                        filterUser != null && filterUser.length != 0 ?
                                                            (<div>
                                                                {filterUser.map((item, index) => (

                                                                    <div
                                                                        class={` row  inner-form-row-margin ${selectedIndex === index ? 'bg-light' : 'border'}`}

                                                                        onClick={this.onClickFunction.bind(null, index)}>
                                                                        <div class="column form-item-margin">
                                                                            <div class="row "
                                                                                 style={{marginLeft: '0px'}}>
                                                                                <label
                                                                                    htmlFor="inputEmail">{item.first_name}</label>
                                                                            </div>
                                                                            <div class="row "
                                                                                 style={{marginLeft: '0px'}}>
                                                                                <label
                                                                                    htmlFor="inputEmail">{item.email}</label>
                                                                            </div>
                                                                        </div>

                                                                        <div class="column">
                                                                            <div class="row ">
                                                                                <div id="small-img"
                                                                                     class="col-xs-12 col-sm-12 col-md-12 col-lg-12 d-flex justify-content-end form-item-margin">
                                                                                    <ul>
                                                                                        <img
                                                                                            onClick={this.handleClick.bind(this)}
                                                                                            id={item.id}
                                                                                            src={idActiveList.includes(item.id) ? pauseIcon : playIcon}/>
                                                                                        <img src={editIcon}
                                                                                             className="img-responsive  inline-block"
                                                                                             data-toggle="modal"
                                                                                             alt="Responsive image"
                                                                                             data-target={"#modal" + item.id}/>
                                                                                        <img src={closeIcon}
                                                                                             class="img-responsive inline-block"
                                                                                             alt="Responsive image"
                                                                                             data-toggle="modal"
                                                                                             data-target={"#exampleModaldelete" + item.id}/>
                                                                                        <DeletePopUp
                                                                                            id={"exampleModaldelete" + item.id}
                                                                                            dataId={item.id}
                                                                                            type={"setting"}></DeletePopUp>
                                                                                    </ul>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <SettingPop id={"modal" + item.id} data={item}
                                                                                    type={"update"}></SettingPop>
                                                                    </div>
                                                                ))
                                                                }
                                                            </div>)
                                                            :
                                                            (
                                                                <h6 className="text-left alert alert-primary">
                                                                    {translation.No_users_found}
                                                                </h6>
                                                            )
                                                    ) :
                                                    (
                                                        <div className="text-center">
                                                            <img src={dataLoader}/><br/><br/><br/>
                                                        </div>
                                                    )
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
                        <SettingPop id={"addAccount"}  data = {{}} type={"create"}></SettingPop>
                        <br/><br/>
                        <Footer/>
                    </div>
                </div>
            </div>
        )
    }
   

  
}

export default connect(mapStateToProps, null)(withLanguageHook(SettingsConnectionSending));