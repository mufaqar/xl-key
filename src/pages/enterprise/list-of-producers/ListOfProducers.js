import '../../../components/settingsMain.css'
import '../../../components/enterprise/enterprise.scss';
import React from 'react';
import DatePic from '../../../components/enterprise/DatePic'
import MyTablePopup from './ProducteursTablePopup'
import "react-datepicker/dist/react-datepicker.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import playIcon from "../../../public/img/sqr_play_icon.png"
import pauseIcon from "../../../public/img/sqr_pause_icon.png"
import arrowIcon from "../../../public/img/sqr_arrow_icon.png"
import userIcon from "../../../public/img/sqr_user_icon.png"
import ArrowTransform from "../../../components/enterprise/ArrowTransform";
import Form from "./ProducteursFormWeb"
import NavBar from "../../../components/layout/main-navigation/EnterpriseMainNavigation";
import Footer from "../../../components/layout/footer/EnterpriseFooter";
import Api from "../../../helper/api";
import HideModal from "../../../components/hideModal";
import Pagination from "react-js-pagination";
import { connect, useSelector, useDispatch } from 'react-redux';
import DatePicker from 'react-datepicker';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import useTranslation from "../../../components/customHooks/translations";
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

class ClientsOrProducers extends React.Component {
    constructor(props) {
        super(props)
        const acc_id = this.props.match.params.acc_id;
        this.state = {
            timer:0,
            activePage: 1,
            selectedStatus: "",
            error: null,
            isLoaded: false,
            items: [],
            enterpriseitem: [],
            total: 0,
            entreprisetotal: 0,
            response: null,
            entreprisestatus: "active",
            superadminnumber: "1",
            pagenumber: 1,
            limit: 10,

            enterprisename: null,
            entrepriseemail: null,
            superuserfname: null,
            superuserlname: null,
            superusermobile: null,
            superusermail: null,
            api: new Api(this.props.token),
            hideModal: new HideModal(),
            startDate: new Date(),

            fields: {},
            errors: {},
            reset: false,
            lang: {
                EN: false,
                FR: false,
                NONE: true
            },

            query: '',
            results: {},
            loading: false,
            message: '',
            idActiveList: [],
            fetching: false,

            acc_id: acc_id,
            base_url: "/entreprise",
            admin_base_url: "/admin/entreprise/" + acc_id,
            entreprise_base_url: "/entreprise/entreprise/" + acc_id,
            consultant_base_url: "/consultant/entreprise/" + acc_id,
        }
        this.addAccount = this.addAccount.bind(this);
        this.handleLimit = this.handleLimit.bind(this);
        this.handleChangeDate = this.handleChangeDate.bind(this);
        this.handleStatusChange = this.handleStatusChange.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        this.state.api
            .allProducteurLoggedInEntreprise([this.state.limit, this.state.pagenumber])
            .then(response => {
                if (response.status === 200) {

                    let consultant_ar = response.data.data;
                    let consultantId = [];
                    let n = 0;
                    consultant_ar.forEach(ent => {
                        if (ent.status == "active") {
                            consultantId[n] = ent.id;
                        }
                        n++;
                    });

                    this.setState({
                        isLoaded: true,
                        fetching: false,
                        items: response.data.data,
                        response: response.data,
                        idActiveList: consultantId,
                        total: response.data.pagination.total
                    });
                } else {
                    let errors = {};
                    errors["message"] = "Oops1 Try again later";
                    this.setState({
                        isLoaded: true,
                        fetching: false,
                        items: [],
                        idActiveList: [],
                        errors: errors
                    });
                }
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

    addAccount(e) {
        // const api = new Api();
        const data = this.state.fields;
        let formData = new FormData();
        let language = "FR"

        if(data.lang == "undefined"){
            language = data.lang;
        } else{
            language = "FR";
        }
     
        formData.append('name_en', data.enterprisename);
        formData.append('name_fr', data.enterprisename);
        formData.append('contact_phone', this.state.phone);
        formData.append('contact_email', data.entrepriseemail);
        formData.append('address', data.entrepriseaddress);
        formData.append('postal_code', data.entreprisepostalcode);
        formData.append('city', data.entreprisecity);
        formData.append('province', data.entrepriseprovice);
        formData.append('country', data.entreprisecountry);
        formData.append('logo', this.state.selectedFile);
        formData.append('language_pref', language);
        formData.append('status', this.state.entreprisestatus);
        formData.append('first_name', data.superuserfname);
        formData.append('last_name', data.superuserlname);
        formData.append('username', data.superusermail);
        formData.append('password', data.superuserpassword);
        formData.append('superadmin', this.state.superadminnumber);
        formData.append('email', data.superusermail);
        formData.append('parent', data.assignEntreprise);
        formData.append('email_notification_enabled', data.emailnotification);
        formData.append('lang', this.props.language);

        this.state.api
            .createAccounts(["producteur", formData])
            .then(response => {
                this.setState({ message: response.data.message });

                if (response.status === 200) {
                    let fields = this.state.fields;
                    fields["enterprisename"] = "";
                    fields["enterprisemobile"] = "";
                    fields["entrepriseemail"] = "";
                    fields["entrepriseaddress"] = "";
                    fields["entreprisepostalcode"] = "";
                    fields["entreprisecity"] = "";
                    fields["entrepriseprovice"] = "";
                    fields["entreprisecountry"] = "";
                    fields["superuserfname"] = "";
                    fields["superuserlname"] = "";
                    fields["superusermail"] = "";
                    fields["superuserpassword"] = "";
                    this.setState({ fields });
                    setTimeout(window.location.reload(false),500);
                    this.loadData();
                    // this.state.hideModal.hideModal();
                }
            })
            .catch((err) => {
                if (err.response && err.response.status == 401) {
                    this.props.history.push('/');
                } else {
                    if (err.response && err.response.data.message) {
                        this.setState({ message: err.response.data.message });
                    } else {
                        this.setState({ message: "Quelque chose s'est mal passé !" });
                    }
                }

            })

    }


    handleValidation() {
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;
        let isValid = true;
        const isFrench = this.props.language == "FR";

        if (!fields["enterprisename"]) {
            formIsValid = false;
            errors["enterprisename"] = isFrench ? "Le nom de l'entreprise est requis" : "Company name is required";
        }

        if (!fields["entrepriseemail"]) {
            formIsValid = false;
            errors["entrepriseemail"] = isFrench ?"Le courriel est requis":"Email is required";
        } else {
            let lastAtPos = fields["entrepriseemail"].lastIndexOf('@');
            let lastDotPos = fields["entrepriseemail"].lastIndexOf('.');

            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["entrepriseemail"].indexOf('@@') == -1 && lastDotPos > 2 && (fields["entrepriseemail"].length - lastDotPos) > 2)) {
                formIsValid = false;
                errors["entrepriseemail"] = isFrench ? "L'adresse de courriel n'est pas valide" : "The email address is not valid";
            }
        }

        if (!fields["superuserfname"]) {
            formIsValid = false;
            errors["superuserfname"] = isFrench ?"Le nom est requis" : "Name is required";
        }

        if (!fields["superuserlname"]) {
            formIsValid = false;
            errors["superuserlname"] = isFrench ?"Le prénom est requis":"First name is required";
        }

        // if (!fields["superusermobile"]) {
        //     formIsValid = false;
        //     errors["superusermobile"] = "Courriel est requis";
        // }

        if (!fields["superusermail"]) {
            formIsValid = false;
            errors["superusermail"] = isFrench ?"Le courriel est requis":"Email is required";
        } else {
            let lastAtPos = fields["superusermail"].lastIndexOf('@');
            let lastDotPos = fields["superusermail"].lastIndexOf('.');

            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["superusermail"].indexOf('@@') == -1 && lastDotPos > 2 && (fields["superusermail"].length - lastDotPos) > 2)) {
                formIsValid = false;
                errors["superusermail"] = isFrench ? "L'adresse de courriel n'est pas valide" : "The email address is not valid";
            }
        }

        if (!fields["superuserpassword"]) {
            formIsValid = false;
            errors["superuserpassword"] = isFrench ?"Le mot de passe est requis" : "Password is required";
        }

        if (typeof !this.state.phone) {
            isValid = false;
            var pattern = new RegExp(/^[0-9\b\+\-\(\)]+$/);

            if (!pattern.test(this.state.phone)) {
                isValid = false;
                errors["enterprisemobile"] = isFrench ?"Veuillez vérifier le numéro de téléphone":"Please check the phone number";
            }
            // else if (fields["enterprisemobile"].length != 10) {
            //     isValid = false;
            //     errors["enterprisemobile"] = "Veuillez entrer un numéro de téléphone valide";
            // }
        }

        this.setState({ errors: errors });
        return formIsValid

    }
    handleClick(e) {
        let ID = Number(e.target.id);
        let newIdList = this.state.idActiveList;
        if (newIdList.includes(ID)) {
            var index = newIdList.indexOf(ID)
            newIdList.splice(index, 1);
            this.updateAccountStatus(ID, "inactive");
        } else {
            newIdList.push(ID);
            this.updateAccountStatus(ID, "active");
        }

    }

    updateAccountStatus(id, status) {

        const data = this.state.fields;
        let formData = new FormData();
        let statusEditValue = "inactive";


        formData.append('status', status);
        // Super admin


        this.state.api
            .updateAccounts([id, formData])
            .then(response => {

                this.setState({ fetching: true });
                setTimeout(this.loadData(), 500);
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

    addAccountformSubmit(e) {
        e.preventDefault();
        let errors = {};

        if (this.handleValidation()) {
            this.setState({ errors: errors });
            this.addAccount(e);

            // alert("Form submitted");
        } else {

            // alert("Form is not submitted");
        }
    }

    handleInputChange(field, e) {
        const target = e.target;
        let fields = this.state.fields;

        if (target.checked) {
            fields[field] = e.target.value;
            this.setState({ fields });
        } else {
            fields[field] = 0;
            this.setState({ fields });
        }

    }

    handleDropdownChange(e) {
        this.setState({ lang: e.target.value });
    }

    fileSelectedHandler = event => {
        this.setState({
            selectedFile: event.target.files[0]
        })
    }

    contactSubmit(e) {
        e.preventDefault();
        let errors = {};

        if (this.handleValidation()) {
            this.setState({ errors: errors });
            alert("Form submitted");
        } else {

            alert("Form is not submitted");
        }

    }

    handleChange(field, e) {
        let fields = this.state.fields;
        fields[field] = e.target.value;
        this.setState({ fields });
    }

    getCreatedDate(created_at) {
        let date = created_at;
        let dateFormat = require("dateformat");
        let correctdate = dateFormat(date, "yyyy-mm-dd");

        return correctdate;
    }


    handleOnInputChange = (event) => {
        if (this.state.timer) {
            clearTimeout(this.state.timer);
            this.setState({timer: 0});
        }
        const query = event.target.value;
        this.setState({
            query: query,
            loading: true,
            message: '',
            timer: setTimeout(() => this.fetchSearchReults(query), 1500)
        });
    }

    handleLimit(e) {
        const limitValue = e.target.value;
        this.setState({ limit: limitValue, loading: true, message: '' }, () => {
            this.setPagination(this.state.pagenumber, limitValue);
        });
    }


    fetchSearchReults = (query) => {

        this.state.api
            .searchProducteurLoggedInEntreprise([this.state.limit, query, this.state.selectedStatus])
            .then(response => {
                this.setState({
                    isLoaded: true,
                    items: response.data.data
                });
            })
            .catch(err => {
                if (err.response.status == 401) {
                    this.props.history.push('/');
                }
            });

    }

    setPagination = (updatedPageNo, limit) => {


        this.state.api
            .allProducteurLoggedInEntreprise([this.state.limit, this.state.pagenumber])
            .then(response => {
                this.setState({
                    isLoaded: true,
                    items: response.data.data
                });
            })
            .catch((err) => {
                if (err.response && err.response.status == 401) {
                    this.props.history.push('/');
                } else {
                    if (err.response && err.response.data.message) {
                        this.setState({ message: err.response.data.message });
                    } else {
                        this.setState({ message: "Quelque chose s'est mal passé !" });
                    }
                }

            })
    }

    handlePageChange(pageNumber) {
        this.setState({ activePage: pageNumber, pageNumber: pageNumber }, () => {
            this.setPagination(pageNumber, this.state.limit);
        });
    };

    fetchStatusResults = (status) => {


        let newQuery = "";
        if (!this.state.query) {
            this.setState({ query: "" });
        } else {
            newQuery = this.state.query;
        }

        this.state.api
            .fetchStatusProducteurLoggedInEntreprise([newQuery, status, this.state.limit])
            .then(response => {
                this.setState({
                    isLoaded: true,
                    items: response.data.data
                });
            })
            .catch(err => {
                if (err.response.status == 401) {
                    this.props.history.push('/');
                }
            });
    }

    handleStatusChange(e) {
        const selectedStatus = e.target.value;
        this.setState({ selectedStatus: selectedStatus }, () => {
            this.fetchStatusResults(selectedStatus);
        });
    };


    handleChangeDate(date) {
        let created_at = date;
        let dateFormat = require("dateformat");
        let correctdate = dateFormat(created_at, "yyyy-mm-dd");
        this.setState({ startDate: date, }, () => {
            this.fetchByDate(correctdate);
        });

    }

    fetchByDate = (date) => {

        this.state.api
            .fetchByDateProducteurLoggedInEntreprise([this.state.query, this.state.selectedStatus, this.state.limit, date])
            .then(response => {

                this.setState({
                    items: response.data.data,
                });

            })
            .catch(err => {
                if (err.response.status == 401) {
                    this.props.history.push('/');
                }
            });

    }



    render() {
        const { error, isLoaded, items, query, total, idActiveList } = this.state;
        const translation = this.props.translation;
        const language = this.props.language;
        const isFrench = language == "FR";

        let base_url = this.state.base_url;
        if (!this.props.isLogged) {
            this.props.history.push('/');
        } else if (this.props.userRole == "ROLE_ENTREPRISE") {

        } else if (this.props.userRole == "ROLE_ADMIN" && this.state.acc_id) {
            base_url = this.state.admin_base_url;
        } else {
            this.props.history.push('/');
        }

        if (error) {
            return <div>{translation.Error}: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>{translation.Loading}...</div>;
        } else {

            

            return (
                <div>
                    <NavBar base_url={base_url} acc_id={this.state.acc_id}></NavBar>
                    <div>
                        <main>
                            <div id="mainDivSelect">
                                <div>
                                    <main style={{ backgroundColor: '#F0F0F0' }}>
                                        <div class="row headerTop align-bottom "
                                            style={{ maxHeight: '100px', marginLeft: '10px', marginRight: '10px', marginTop: '0px' }}>
                                            <div class="col-md-4 col-lg-4 col-sm-4  col-xs-12 "
                                                style={{ marginTop: '10px', marginBottom: '10px' }}>


                                                <h5 className="modal-title p-1 d-inline" id="exampleModalLabel">{translation.Customers_Producers}</h5>
                                                <label class="p-2 d-inline" htmlFor="inputEmail">{total}</label>

                                            </div>
                                            <div class="col-md-4 col-lg-3 col-sm-12 col-xs-12">
                                                <button type="button" class="btn btn-primary primaryTop mobile_button" data-toggle="modal" data-target="#exampleModalLong">{translation.Add_a_person}</button>

                                                <div class="modal fade" id="exampleModalLong" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
                                                    <div class="modal-dialog" role="document" style={{ maxWidth: '100%' }} >
                                                        <div class="modal-content">
                                                            <div class="modal-header">
                                                                <h5 class="modal-title" id="exampleModalLongTitle">{translation.Customers_Producers}</h5>
                                                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                                    <span aria-hidden="true">&times;</span>
                                                                </button>
                                                            </div>
                                                            <div class="modal-body">

                                                                <form name="addAccountform" onSubmit={this.addAccountformSubmit.bind(this)}>
                                                                    <div class="form-group row">
                                                                        <label for="staticEmail" class="col-sm-5  col-form-label">{translation.Name_of_the_producer}:</label>
                                                                        <div class="col-sm-7 ">
                                                                            <input type="text" class="form-control" ref="enterprisename" id="enterprisename" name='enterprisename' onChange={this.handleChange.bind(this, "enterprisename")} value={this.state.fields["enterprisename"]} />
                                                                            <span style={{ color: "red" }}>{this.state.errors["enterprisename"]}</span>
                                                                        </div>
                                                                    </div>
                                                                    <div class="form-group row">
                                                                        <label for="inputPassword" class="col-sm-5 col-form-label">{translation.Phone_Number}:</label>
                                                                        <div class="col-sm-7 ">
                                                                            <PhoneInput
                                                                                country={'ca'}
                                                                                value={this.state.phone}
                                                                                onChange={phone => this.setState({ phone })}
                                                                                required={true}
                                                                                onlyCountries={['ca']}
                                                                                className="react-tel-input .form-control"
                                                                            />   <span style={{ color: "red" }}>{this.state.errors["enterprisemobile"]}</span>
                                                                        </div>
                                                                    </div>
                                                                    <div class="form-group row">
                                                                        <label for="inputPassword" class="col-sm-5 col-form-label">{translation.Email}:</label>
                                                                        <div class="col-sm-7 ">
                                                                            <input type="text" class="form-control" ref="entrepriseemail" id="entrepriseemail" name='entrepriseemail' onChange={this.handleChange.bind(this, "entrepriseemail")} value={this.state.fields["entrepriseemail"]} />
                                                                            <span style={{ color: "red" }}>{this.state.errors["entrepriseemail"]}</span>
                                                                        </div>
                                                                    </div>
                                                                    <div class="form-group row">
                                                                        <label for="inputPassword" class="col-sm-5 col-form-label">{translation.Address}:</label>
                                                                        <div class="col-sm-7 ">
                                                                            <input type="text" class="form-control" ref="entrepriseaddress" id="entrepriseaddress" name='entrepriseaddress' onChange={this.handleChange.bind(this, "entrepriseaddress")} value={this.state.fields["entrepriseaddress"]} />
                                                                        </div>
                                                                    </div>
                                                                    <div class="form-group row">
                                                                        <label for="inputPassword" class="col-sm-5 col-form-label">{translation.Postal_Code}:</label>
                                                                        <div class="col-sm-7 ">
                                                                            <input type="text" class="form-control" ref="entreprisepostalcode" id="entreprisepostalcode" name='entreprisepostalcode' onChange={this.handleChange.bind(this, "entreprisepostalcode")} value={this.state.fields["entreprisepostalcode"]} />
                                                                        </div>
                                                                    </div>
                                                                    <div class="form-group row">
                                                                        <label for="inputPassword" class="col-sm-5 col-form-label">{translation.City}:</label>
                                                                        <div class="col-sm-7 ">
                                                                            <input type="text" class="form-control" ref="entreprisecity" id="entreprisecity" name='entreprisecity' onChange={this.handleChange.bind(this, "entreprisecity")} value={this.state.fields["entreprisecity"]} />
                                                                        </div>
                                                                    </div>
                                                                    <div class="form-group row">
                                                                        <label for="inputPassword" class="col-sm-5 col-form-label">{translation.Province}:</label>
                                                                        <div class="col-sm-7 ">
                                                                            <input type="text" class="form-control" ref="entrepriseprovice" id="entrepriseprovice" name='entrepriseprovice' onChange={this.handleChange.bind(this, "entrepriseprovice")} value={this.state.fields["entrepriseprovice"]} />
                                                                        </div>
                                                                    </div>
                                                                    <div class="form-group row">
                                                                        <label for="inputPassword" class="col-sm-5 col-form-label">{translation.Country}:</label>
                                                                        <div class="col-sm-7 ">
                                                                            <input type="text" class="form-control" ref="entreprisecountry" id="entreprisecountry" name='entreprisecountry' onChange={this.handleChange.bind(this, "entreprisecountry")} value={this.state.fields["entreprisecountry"]} />
                                                                        </div>
                                                                    </div>
                                                                    <div class="form-group row">
                                                                        <label for="inputPassword" class="col-sm-5 col-form-label">{translation.Logo}:</label>
                                                                        <div class="col-sm-7 ">
                                                                            <input type="file" ref="logo" id="logo" name='logo' onChange={this.fileSelectedHandler} value={this.state.fields["logo"]} />
                                                                        </div>
                                                                    </div>
                                                                    {/* <div class="form-group row">
                                                                        <label for="inputPassword" class="col-sm-5 col-form-label">Assignationd ’entreprise:</label>
                                                                        <div class="col-sm-7 ">
                                                                            <div class="input-group-append">
                                                                                <select class="form-select form-control" aria-label="Text input with dropdown button"  onChange={this.handleChange.bind(this, "assignEntreprise")} >
                                                                                <option selected disabled hidden>Faire une selection</option>
                                                                                { 
                                                                                    this.state.enterpriseitem.map((obj) => (
                                                                               <option value={obj.id}>{obj.name_en}</option>
                                                                                ))
                                                                                
                                                                                }
                                                                                </select>
                                                                            </div>
                                                                        </div>
                                                                    </div> */}
                                                                    <hr></hr>

                                                                    <div class="form-group row">
                                                                        <label for="staticEmail" class="col-sm-5  col-form-label">{translation.Super_user}</label>

                                                                    </div>

                                                                    <div class="form-group row">
                                                                        <label for="staticEmail" class="col-sm-5  col-form-label">{translation.Name}:</label>
                                                                        <div class="col-sm-7 ">
                                                                            <input type="text" class="form-control" id="superuserfname" name='superuserfname' onChange={this.handleChange.bind(this, "superuserfname")} value={this.state.fields["superuserfname"]} />
                                                                            <span style={{ color: "red" }}>{this.state.errors["superuserfname"]}</span>
                                                                        </div>
                                                                    </div>
                                                                    <div class="form-group row">
                                                                        <label for="inputPassword" class="col-sm-5 col-form-label">{translation.First_Name}:</label>
                                                                        <div class="col-sm-7 ">
                                                                            <input type="text" class="form-control" id="superuserlname" name='superuserlname' onChange={this.handleChange.bind(this, "superuserlname")} value={this.state.fields["superuserlname"]} />
                                                                            <span style={{ color: "red" }}>{this.state.errors["superuserlname"]}</span>
                                                                        </div>
                                                                    </div>
                                                                    <div class="form-group row">
                                                                        <label for="inputPassword" class="col-sm-5 col-form-label">{translation.Email}:</label>
                                                                        <div class="col-sm-7 ">
                                                                            <input type="text" class="form-control" id="superusermail" name='superusermail' onChange={this.handleChange.bind(this, "superusermail")} value={this.state.fields["superusermail"]} />
                                                                            <span style={{ color: "red" }}>{this.state.errors["superusermail"]}</span>
                                                                        </div>
                                                                    </div>


                                                                    <div class="form-group row">
                                                                        <label for="inputPassword" class="col-sm-5 col-form-label">{translation.Password}:</label>
                                                                        <div class="col-sm-7 ">
                                                                            <input type="password" class="form-control" id="superuserpassword" name='superuserpassword' onChange={this.handleChange.bind(this, "superuserpassword")} value={this.state.fields["superuserpassword"]} maxlength="8" minlength="6" />
                                                                            <span style={{ color: "red" }}>{this.state.errors["superuserpassword"]}</span>
                                                                        </div>
                                                                    </div>

                                                                    <div class="form-group row">
                                                                        <label for="inputPassword" class="col-sm-5 col-form-label"> {translation.Language}:</label>
                                                                        <div class="col-sm-7 ">
                                                                            <div class="input-group">
                                                                                <select class="form-select form-control" aria-label="Default select example" onChange={this.handleChange.bind(this, "lang")}  >
                                                                                    <option selected={this.state.lang.FR ? "selected" : ""} value="FR">{translation.French}</option>
                                                                                    <option selected={this.state.lang.EN ? "selected" : ""} value="EN">{translation.English}</option>
                                                                                </select>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div class="form-group row">
                                                                        <label for="inputPassword" class="col-sm-5 col-form-label"> {translation.Email_Notifications}:</label>
                                                                        <div class="col-sm-7 ">
                                                                            <input type="checkbox" value="1" id="emailnotification" name='emailnotification' onChange={this.handleInputChange.bind(this, "emailnotification")}></input>
                                                                        </div>
                                                                    </div>

                                                                    <div class="form-group row">
                                                                        <label for="inputPassword" class="col-sm-5 col-form-label"></label>
                                                                        <div class="col-sm-7 ">
                                                                            <button type="submit" class="btn btn-primary">{translation.Add_a_person}</button>
                                                                        </div>
                                                                    </div>
                                                                    <div class="form-group row">
                                                                        <label for="inputPassword" class="col-sm-2 col-form-label"></label>
                                                                        <div class="col-sm-12">
                                                                            <label class="error-font-style" >{this.state.message}</label>
                                                                        </div>
                                                                    </div>
                                                                </form>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-4 col-lg-4 col-sm-12 col-xs-12 ml-auto"
                                                style={{ marginTop: '10px', marginBottom: '10px' }}>
                                                <div class="input-group">
                                                    <input type="text" class="form-control" name="query" value={query} id="search-input"
                                                        placeholder={translation.city_producers_name} onChange={this.handleOnInputChange} />
                                                    <div class="input-group-append">
                                                        <button class="btn btn-secondary" type="button">
                                                            <i class="fa fa-search"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="row headerTop " style={{
                                            maxHeight: '100px',
                                            marginLeft: '10px',
                                            marginRight: '10px',
                                            paddingTop: '20px'
                                        }}>
                                            <div class="col-md-4 col-lg-6 col-sm-12 col-xs-12 form-item-margin">

                                                <strong class="d-inline p-2" htmlFor="inputEmail">{translation.Filter_by}:</strong>

                                                <DatePicker
                                                    selected={this.state.startDate}
                                                    onChange={this.handleChangeDate}
                                                    dateFormat="yyyy-MM-dd"
                                                    className="form-control d-inline p-2"

                                                />

                                            </div>
                                            {/* <div class="col-md-4 col-lg-3 col-sm-12 col-xs-12 form-item-margin">
                                                <div class="input-group ">
                                                    <strong class="d-inline p-2" htmlFor="inputEmail">Entreprise:</strong>

                                                    <select class="form-select form-control" aria-label="Text input with dropdown button"  >
                                                        <option selected disabled hidden>Faire une selection</option>
                                                        <option value="active">Action</option>
                                                        <option value="deactive">Another action</option>
                                                        <option value="deactive">Something else here</option>
                                                        <option value="deactive">Separated link</option>
                                                    </select>
                                                </div>
                                            </div> */}
                                            <div class="col-md-4 col-lg-3 col-sm-12 col-xs-12 form-item-margin" >
                                                <div class="input-group" >

                                                    <strong class="d-inline p-2" htmlFor="inputEmail">{translation.Status}:</strong>
                                                    <div class="input-group-append" >
                                                        <select class="form-select form-control" aria-label="Text input with dropdown button" onChange={this.handleStatusChange} value={this.state.selectedStatu} >
                                                            <option selected disabled hidden>{translation.Make_a_selection}</option>
                                                            <option value="">{translation.All}</option>
                                                            <option value="active">{translation.Active}</option>
                                                            <option value="inactive">{translation.Inactive}</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="margintopscreen">

                                            {this.state.fetching && (
                                                <div id="no-more-tables"
                                                    className="admin-entreprise-actions-view-size"
                                                >

                                                    <table class="col-sm-12   table-condensed cf" style={{ backgroundColor: 'white' }}>
                                                        <thead class="cf" >
                                                            <tr class="text-left" style={{ height: '70px' }}>
                                                                <th >{translation.Name_of_the_producer}</th>
                                                                <th className="d-none d-md-table-cell">{translation.City}</th>
                                                                <th className="d-none d-md-table-cell">{translation.Postal_Code}</th>
                                                                <th className="d-none d-md-table-cell">{translation.Renewal_date}</th>
                                                                <th className="d-none d-md-table-cell">{translation.Entreprise}</th>
                                                                <th>{translation.Status}</th>
                                                                <th class="text-center" style={{ paddingLeft: '65px' }}>{translation.Actions}</th>
                                                            </tr>
                                                        </thead>
                                                    </table>
                                                </div>
                                            )}

                                            {!this.state.fetching && (
                                                <div id="no-more-tables"
                                                    className="admin-entreprise-actions-view-size"
                                                >

                                                    <table class="col-sm-12   table-condensed cf" style={{ backgroundColor: 'white' }}>
                                                        <thead class="cf" >
                                                            <tr class="text-left" style={{ height: '70px' }}>
                                                                <th >{translation.Name_of_the_producer}</th>
                                                                <th className="d-none d-md-table-cell">{translation.City}</th>
                                                                <th className="d-none d-md-table-cell">{translation.Postal_Code}</th>
                                                                <th className="d-none d-md-table-cell">{translation.Renewal_date}</th>
                                                                <th className="d-none d-md-table-cell">{translation.Entreprise}</th>
                                                                <th>{translation.Status}</th>
                                                                <th class="text-center" style={{ paddingLeft: '65px' }}>{translation.Actions}</th>
                                                            </tr>
                                                        </thead>
                                                        {items.map((item) => (
                                                            <tbody>
                                                                <tr class=" border-top text-left">
                                                                    <td data-title={translation.Name} className="admin-entreprise-actions-button-child">{isFrench ? item.name_fr : item.name_en}</td>
                                                                    <td className="d-none d-md-table-cell" data-title="Prénom">{item.city}</td>
                                                                    <td className="d-none d-md-table-cell" data-title="Prénom">{item.postal_code}</td>
                                                                    <td className="d-none d-md-table-cell" data-title="Prénom">{this.getCreatedDate(item.created_at)}</td>
                                                                    <td className="d-none d-md-table-cell" data-title="Prénom">{item.roles[0].name}</td>
                                                                    <td className="d-none d-md-table-cell" data-title="Prénom">{item.status}</td>
                                                                    <td data-title={translation.Actions} style={{ paddingLeft: '70px' }}>
                                                                        <div class="text-center">   {/*class="row d-flex" */}
                                                                            <ul class="ml-auto arrow_collapse_margin admin-entreprise-actions-button-parent" style={{ margin: "0px" }}>

                                                                                <img onClick={this.handleClick.bind(this)} id={item.id}
                                                                                    src={idActiveList.includes(item.id) ? pauseIcon : playIcon} />

                                                                                {/* <img src={playIcon} class="img-responsive " alt="Responsive image" /> */}
                                                                                <a href={"/entreprise/producteur/" + item.id + "/dashboard"}><img src={userIcon} class="img-responsive inline-block" alt="Responsive image" /></a>

                                                                                <span className="admin-entreprise-actions-button-child-two">
                                                                                    <span className="onlyForMobile" data-toggle="modal" data-target={"#modelExample" + item.id} data-href="{{ $e->id }}">
                                                                                        <span className="d-none d-md-inline" data-toggle="collapse" data-target={"#collapseExample" + item.id} aria-expanded="false" aria-controls="collapseExample" data-href="{{ $e->id }}">
                                                                                            <ArrowTransform class=" inline-block"  > </ArrowTransform>
                                                                                        </span>
                                                                                        <img src={arrowIcon} className="d-inline d-md-none" data-toggle="collapse" data-target={"#collapseExample" + item.id} aria-expanded="false" aria-controls="collapseExample" data-href="{{ $e->id }}"></img>
                                                                                    </span>
                                                                                    <span className="onlyForDesktop">
                                                                                        <span className="d-none d-md-inline" data-toggle="collapse" data-target={"#collapseExample" + item.id} aria-expanded="false" aria-controls="collapseExample" data-href="{{ $e->id }}">
                                                                                            <ArrowTransform class=" inline-block"  > </ArrowTransform>
                                                                                        </span>
                                                                                        <img src={arrowIcon} className="d-inline d-md-none" data-toggle="collapse" data-target={"#collapseExample" + item.id} aria-expanded="false" aria-controls="collapseExample" data-href="{{ $e->id }}"></img>
                                                                                    </span>
                                                                                </span>

                                                                            </ul>
                                                                        </div>
                                                                    </td>
                                                                </tr>

                                                                <MyTablePopup value={item} type="product" entrepriseList={this.state.enterpriseitem} ></MyTablePopup>
                                                                <tr class="hide-table-padding d-none d-md-table-row">
                                                                    <td colspan="8" class="">
                                                                        <div id={"collapseExample" + item.id} class="collapse">
                                                                            <Form value={item} entrepriseList={this.state.enterpriseitem} ></Form>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        ))
                                                        }

                                                    </table>
                                                </div>
                                            )}

                                        </div>
                                        {/* <div style={{
                                        marginLeft: '35px',
                                        marginRight: '22px',
                                        paddingBottom: '20px'
                                    }}>

                                        <div id="no-more-tables">


                                            <table class="table" style={{ backgroundColor: 'white' }}>
                                                <thead>
                                                    <tr>
                                                        <th scope="col">Nom du producteur</th>
                                                        <th scope="col" style={{ verticalAlign: 'top' }} className="d-none d-md-table-cell" >Ville</th>
                                                        <th scope="col" className="d-none d-md-table-cell" >Code postal</th>
                                                        <th scope="col" className="d-none d-md-table-cell" >Date de renouvellement</th>
                                                        <th scope="col" style={{ verticalAlign: 'top' }} className="d-none d-md-table-cell">Entreprise</th>
                                                        <th scope="col" style={{ verticalAlign: 'top' }}>Statut</th>
                                                        <th scope="col" class="text-center" style={{ verticalAlign: 'top' }}>Actions</th>
                                                    </tr>
                                                </thead>
                                                {items.map((item) => (
                                                    <tbody>
                                                        <tr>
                                                            <th data-title="Nom du producteur" >{item.name_en}</th>
                                                            <td className="d-none d-md-table-cell" data-title="Ville">{item.city}</td>
                                                            <td className="d-none d-md-table-cell" data-title="Code postal">{item.postal_code}</td>
                                                            <td className="d-none d-md-table-cell" data-title="Date de renouvellement" >{this.getCreatedDate(item.created_at)}</td>
                                                            <td className="d-none d-md-table-cell" data-title="Entreprise" >{item.roles[0].name}</td>
                                                            <td className="d-none d-md-table-cell" data-title="Statut">{item.status}</td>
                                                            <td>
                                                                <div data-title="Actions" class="text-center" style={{ marginTop: '-14px' }}>
                                                                    <ul>
                                                                        <div>
                                                                        <img src={pauseIcon} class="img-responsive " alt="Responsive image" />
                                                                        <img src={userIcon} class="img-responsive inline-block" alt="Responsive image" />
                                                                        </div>
                                                                        <span data-toggle="modal" data-target="#modelExample" data-href="{{ $e->id }}">
                                                                            <span className="d-none d-md-inline" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample" data-href="{{ $e->id }}">
                                                                                <ArrowTransform class=" inline-block "> </ArrowTransform>
                                                                            </span>
                                                                            <img src={arrowIcon} className="d-inline d-md-none" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample"></img>
                                                                        </span>
                                                                    </ul>
                                                                </div>
                                                            </td>


                                                        </tr>


                                                        <MyTablePopup></MyTablePopup>
                                                        <tr class="hide-table-padding d-none d-md-table-row ">

                                                            <td colspan="7" class="" style={{borderTop:"none"}}>
                                                                <div id="collapseExample" class="collapse">
                                                                 <Form value= {item}></Form>

                                                                </div>

                                                            </td>
                                                        </tr>

                                                    </tbody>
                                                ))
                                                }
                                            </table>
                                           
                                        </div>

                                   

                                    </div> */}
                                    </main>


                                    <nav aria-label="Page navigation example" style={{ margin: '32px' }}>
                                        <label htmlFor="inputEmail" >{translation.View}</label>
                                        <select value={this.state.limit} style={{ margin: '10px' }} onChange={this.handleLimit}>
                                            <option name="male">10</option>
                                            <option name="male">20</option>
                                            <option name="female">50</option>
                                            <option name="female">100</option>
                                        </select>
                                        <div className="desktophidden">
                                            <div style={{ marginTop: "-33px" }}>
                                                <Pagination
                                                    activePage={this.state.activePage}
                                                    itemsCountPerPage={this.state.limit}
                                                    totalItemsCount={this.state.total}
                                                    pageRangeDisplayed={1}
                                                    onChange={this.handlePageChange.bind(this)}
                                                    itemClass='page-item'
                                                    linkClass='page-link'
                                                />
                                            </div>
                                        </div>
                                        <div className="mobilehidden">
                                            <div style={{ marginTop: "-33px" }}>
                                                <Pagination
                                                    activePage={this.state.activePage}
                                                    itemsCountPerPage={this.state.limit}
                                                    totalItemsCount={this.state.total}
                                                    pageRangeDisplayed={3}
                                                    onChange={this.handlePageChange.bind(this)}
                                                />
                                            </div>
                                        </div>
                                    </nav>
                                </div>
                            </div>
                        </main>

                        <Footer />
                    </div>
                </div>
            );
        }
    }
}

export default connect(mapStateToProps, null)(withLanguageHook(ClientsOrProducers));





// import '../../../components/settingsMain.css'
// import '../../../components/enterprise/enterprise.scss';
// import NavBar from "../../../components/layout/main-navigation/EnterpriseMainNavigation";
// import React from 'react';
// import DatePic from '../../../components/enterprise/DatePic'
// import MyTablePopup from './ProducteursTablePopup'
// import "react-datepicker/dist/react-datepicker.css";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import playIcon from "../../../public/img/sqr_play_icon.png"
// import pauseIcon from "../../../public/img/sqr_pause_icon.png"
// import arrowIcon from "../../../public/img/sqr_arrow_icon.png"
// import userIcon from "../../../public/img/sqr_user_icon.png"
// import Form from "./ProducteursFormWeb"
// import ArrowTransform from "../../../components/enterprise/ArrowTransform";
// import Footer from "../../../components/layout/footer/EnterpriseFooter";
// import { connect, useSelector, useDispatch } from 'react-redux';

// const mapStateToProps = state => {
//     let token = state.token;
//     let userRole = state.userRole;
//     let isLogged = state.isLogged;
//     return {token, userRole, isLogged}
// }

// class ListOfProducers extends React.Component {
//     constructor() {
//         super()
//     }

//     render() {
//         if(!this.props.isLogged){
//             this.props.history.push('/');
//         }else if (this.props.userRole!="ROLE_ENTREPRISE") {
//             this.props.history.push('/');
//         }
//         return (
//             <div>
//                 <NavBar></NavBar>
//                 <main>
//                     <div id="mainDivSelect">
//                         <div>
//                             <main style={{backgroundColor: '#F0F0F0'}}>
//                                 <div className="row pt-4 align-bottom"
//                                      style={{
//                                          maxHeight: '200px',
//                                          marginLeft: '10px',
//                                          marginRight: '10px',
//                                          marginBottom: '0',
//                                      }}>
//                                     <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-xs-12"
//                                          style={{marginTop: '10px', marginBottom: '10px'}}>
//                                         <h3 className="modal-title p-1 d-inline" id="exampleModalLabel">
//                                             Clients - Producteurs
//                                         </h3>
//                                         <label className="p-2 d-inline">125</label>
//                                     </div>
//                                     <div className="col-xl-3 col-lg-4 col-md-4 col-sm-4 col-xs-12">
//                                         <button type="button"
//                                                 className="btn btn-primary primaryTop mobile_button">Ajouter une
//                                             personne
//                                         </button>
//                                     </div>
//                                     <div className="col-xl-3 col-lg-4 col-md-4 col-sm-4 col-xs-12 ml-auto "
//                                          style={{marginTop: '10px', marginBottom: '10px'}}>
//                                         <div className="input-group">
//                                             <input type="text" className="form-control"
//                                                    placeholder="ville - nom du producteur..."/>
//                                             <div className="input-group-append">
//                                                 <button className="btn btn-secondary" type="button">
//                                                     <i className="fa fa-search"></i>
//                                                 </button>
//                                             </div>

//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="row headerTop align-bottom"
//                                      style={{
//                                          maxHeight: '220px',
//                                          marginLeft: '10px',
//                                          marginRight: '10px',
//                                          marginTop: '0',
//                                      }}>
//                                     <div
//                                         className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-2">
//                                         <div className="input-group">
//                                             <strong className="d-inline p-2" htmlFor="inputEmail">
//                                                 Filtrer par:
//                                             </strong>
//                                             <div className="date-picker">
//                                                 <DatePic></DatePic>
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div
//                                         className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-2">
//                                         <div className="input-group">
//                                             <strong className="d-inline p-2" htmlFor="inputEmail">Statut:</strong>
//                                             <input type="text" className="form-control input-picker"
//                                                    aria-label="Text input with dropdown button"
//                                                    placeholder="Faire une selection"></input>
//                                             <div className="input-group-append">
//                                                 <button className="btn btn-outline-secondary dropdown-toggle"
//                                                         type="button"
//                                                         data-toggle="dropdown" aria-haspopup="true"
//                                                         aria-expanded="false"></button>
//                                                 <div className="dropdown-menu">
//                                                     <a className="dropdown-item" href="#">Action</a>
//                                                     <a className="dropdown-item" href="#">Another action</a>
//                                                     <a className="dropdown-item" href="#">Something else here</a>
//                                                     <div role="separator" className="dropdown-divider">

//                                                     </div>
//                                                     <a className="dropdown-item" href="#">Separated link</a>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div style={{
//                                     marginLeft: '28px',
//                                     marginRight: '28px',
//                                     paddingBottom: '20px'
//                                 }}>
//                                     <div id="enterpriseTable">
//                                         <table className="col-sm-12   table-condensed cf"
//                                                style={{backgroundColor: 'white'}}>
//                                             <thead className="cf">
//                                             <tr className="text-left" style={{height: '70px'}}>
//                                                 <th className="d-md-table-cell">Nom du producteur</th>
//                                                 <th className="d-none d-md-table-cell">Ville</th>
//                                                 <th className="d-none d-md-table-cell">Code postal</th>
//                                                 <th className="d-none d-md-table-cell">Date de renouvellement</th>
//                                                 <th className="d-none d-md-table-cell">Statut</th>
//                                                 <th className="action-padding" width="20%">Actions</th>
//                                             </tr>
//                                             </thead>
//                                             <tbody>
//                                             <tr className="border-top text-left">
//                                                 <td data-title="Nom du producteur">Ferme Marion</td>
//                                                 <td className="d-none d-md-table-cell" data-title="Ville">Montréal
//                                                 </td>
//                                                 <td className="d-none d-md-table-cell" data-title="Code postal">H2J
//                                                     1G1
//                                                 </td>
//                                                 <td className="d-none d-md-table-cell"
//                                                     data-title="Date de renouvellement">2021.01.03
//                                                 </td>
//                                                 <td className="d-none d-md-table-cell"
//                                                     data-title="Statut">Désactivé
//                                                 </td>
//                                                 <td data-title="Actions">
//                                                     <div className="row">
//                                                         <ul className="ul-padding">
//                                                             <img src={pauseIcon} className="img-responsive "
//                                                                  alt="Responsive image"/>
//                                                             <img src={userIcon}
//                                                                  className="img-responsive inline-block"
//                                                                  alt="Responsive image"/>
//                                                             <span data-toggle="modal" data-target="#modelExample"
//                                                                   data-href="{{ $e->id }}">
//                                                         <span className="d-none d-md-inline" data-toggle="collapse"
//                                                               data-target="#collapseExample" aria-expanded="false"
//                                                               aria-controls="collapseExample" data-href="{{ $e->id }}">
//                                                             <ArrowTransform class=" inline-block "> </ArrowTransform>
//                                                         </span>
//                                                         <img src={arrowIcon} className="d-inline d-md-none"
//                                                              data-toggle="collapse" data-target="#collapseExample"
//                                                              aria-expanded="false"
//                                                              aria-controls="collapseExample"></img>
//                                                     </span>
//                                                         </ul>
//                                                     </div>
//                                                 </td>
//                                             </tr>

//                                             <MyTablePopup></MyTablePopup>
//                                             <tr className="hide-table-padding d-none d-md-table-row ">

//                                                 <td colSpan="7" className="" style={{paddingRight: '30px'}}>
//                                                     <div id="collapseExample" className="collapse">
//                                                         <Form></Form>
//                                                     </div>

//                                                 </td>
//                                             </tr>
//                                             <tr className=" border-top text-left">
//                                                 <td data-title="Nom du producteur">La Terre du jardin</td>
//                                                 <td className="d-none d-md-table-cell"
//                                                     data-title="Ville">St-Hyacinthe
//                                                 </td>
//                                                 <td className="d-none d-md-table-cell" data-title="Code postal">H2J
//                                                     3h5
//                                                 </td>
//                                                 <td className="d-none d-md-table-cell"
//                                                     data-title="Date de renouvellement">2021.04.24
//                                                 </td>
//                                                 <td className="d-none d-md-table-cell" data-title="Statut">Actif
//                                                 </td>
//                                                 <td data-title="Actions">
//                                                     <div className="row d-flex">
//                                                         <ul className="ul-padding">
//                                                             <img src={playIcon} className="img-responsive "
//                                                                  alt="Responsive image"/>
//                                                             <img src={userIcon}
//                                                                  className="img-responsive inline-block"
//                                                                  alt="Responsive image"/>
//                                                             <span data-toggle="modal" data-target="#modelExample"
//                                                                   data-href="{{ $e->id }}">
//                                                         <span className="d-none d-md-inline" data-toggle="collapse"
//                                                               data-target="#collapseExample1" aria-expanded="false"
//                                                               aria-controls="collapseExample" data-href="{{ $e->id }}">
//                                                             <ArrowTransform class=" inline-block"> </ArrowTransform>
//                                                         </span>
//                                                         <img src={arrowIcon} className="d-inline d-md-none"
//                                                              data-toggle="collapse" data-target="#collapseExample1"
//                                                              aria-expanded="false"
//                                                              aria-controls="collapseExample"></img>
//                                                     </span>

//                                                         </ul>
//                                                     </div>
//                                                 </td>
//                                             </tr>

//                                             <MyTablePopup></MyTablePopup>
//                                             <tr className="hide-table-padding d-none d-md-table-row">

//                                                 <td colSpan="7" className="" style={{paddingRight: '30px'}}>
//                                                     <div id="collapseExample1" className="collapse">
//                                                         <Form></Form>
//                                                     </div>
//                                                 </td>
//                                             </tr>

//                                             <tr className=" border-top text-left">
//                                                 <td data-title="Nom du producteur">La Terre du jardin</td>
//                                                 <td className="d-none d-md-table-cell"
//                                                     data-title="Ville">St-Hyacinthe
//                                                 </td>
//                                                 <td className="d-none d-md-table-cell" data-title="Code postal">H2J
//                                                     3h5
//                                                 </td>
//                                                 <td className="d-none d-md-table-cell"
//                                                     data-title="Date de renouvellement">2021.04.24
//                                                 </td>
//                                                 <td className="d-none d-md-table-cell" data-title="Statut">Actif
//                                                 </td>
//                                                 <td data-title="Actions">
//                                                     <div className="row d-flex">
//                                                         <ul className="ul-padding">
//                                                             <img src={pauseIcon} className="img-responsive "
//                                                                  alt="Responsive image"/>
//                                                             <img src={userIcon}
//                                                                  className="img-responsive inline-block"
//                                                                  alt="Responsive image"/>
//                                                             <span data-toggle="modal" data-target="#modelExample"
//                                                                   data-href="{{ $e->id }}">
//                                                         <span className="d-none d-md-inline" data-toggle="collapse"
//                                                               data-target="#collapseExample2" aria-expanded="false"
//                                                               aria-controls="collapseExample" data-href="{{ $e->id }}">
//                                                             <ArrowTransform class=" inline-block"> </ArrowTransform>
//                                                         </span>
//                                                         <img src={arrowIcon} className="d-inline d-md-none"
//                                                              data-toggle="collapse" data-target="#collapseExample2"
//                                                              aria-expanded="false"
//                                                              aria-controls="collapseExample"></img>
//                                                     </span>

//                                                         </ul>
//                                                     </div>
//                                                 </td>
//                                             </tr>

//                                             <MyTablePopup></MyTablePopup>
//                                             <tr className="hide-table-padding d-none d-md-table-row"
//                                                 style={{borderWidth: '0px'}}>

//                                                 <td colSpan="7" className="" style={{paddingRight: '30px'}}>
//                                                     <div id="collapseExample2" className="collapse">
//                                                         <Form></Form>
//                                                     </div>
//                                                 </td>
//                                             </tr>
//                                             </tbody>
//                                         </table>
//                                     </div>

//                                 </div>
//                             </main>

//                             <nav aria-label="Page navigation example" style={{margin: '10px 28px'}}>
//                                 <label htmlFor="inputEmail" style={{marginRight: '5px'}}>Afficher</label>
//                                 <select className="form-select" aria-label="Default select example">
//                                     <option selected>10</option>
//                                     <option value="1">20</option>
//                                     <option value="2">50</option>
//                                     <option value="3">100</option>
//                                 </select>
//                                 <ul className="pagination">
//                                     <li className="page-item">
//                                         <a className="page-link" href="#" aria-label="Previous">
//                                             <span aria-hidden="true">&laquo;</span>
//                                             <span className="sr-only">Previous</span>
//                                         </a>
//                                     </li>
//                                     <li className="page-item"><a className="page-link" href="#">1</a></li>
//                                     <li className="page-item"><a className="page-link" href="#">2</a></li>
//                                     <li className="page-item"><a className="page-link" href="#">3</a></li>
//                                     <li className="page-item">
//                                         <a className="page-link" href="#" aria-label="Next">
//                                             <span aria-hidden="true">&raquo;</span>
//                                             <span className="sr-only">Next</span>
//                                         </a>
//                                     </li>
//                                 </ul>
//                             </nav>
//                         </div>
//                     </div>
//                 </main>
//                 <Footer/>
//             </div>
//         )
//     }
// }

// export default connect(mapStateToProps, null)(ListOfProducers);