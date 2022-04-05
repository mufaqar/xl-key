import '../../components/settingsMain.css'
import React from 'react';
import DatePic from '../../components/Admin/DatePic'
import MyTablePopup from '../../components/Admin/Enterprise_TablePopup'
import "react-datepicker/dist/react-datepicker.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import playIcon from "../../public/img/sqr_play_icon.png"
import pauseIcon from "../../public/img/sqr_pause_icon.png"
import arrowIcon from "../../public/img/sqr_arrow_icon.png"
import userIcon from "../../public/img/sqr_user_icon.png"
import ArrowTransform from "../../components/Admin/ArrowTransform"
import Form from "../../components/Admin/Consultants_FormWeb"
import NavBar from "../../components/layout/main-navigation/AdminMainNavigation";
import Footer from "../../components/layout/footer/AdminFooter";
import Api from "../../helper/api";
import Pagination from "react-js-pagination";
import HideModal from "../../components/hideModal";
import { connect, useSelector, useDispatch } from 'react-redux';
import DatePicker from 'react-datepicker';
import Multiselect from 'multiselect-react-dropdown';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import useTranslation from "../../components/customHooks/translations";
import getLanguage from "../../components/customHooks/get-language";

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

class Consultants extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            timer:0,
            activePage: 1,
            selectedStatus: "",
            error: null,
            isLoaded: false,
            items: [],
            enterpriseitem: [],
            produceritem: [],
            producermulti: [],
            selectedProduct: "",
            total: 0,
            response: null,
            entreprisestatus: "active",
            superadminnumber: "1",
            pagenumber: 1,
            limit: 10,
            api: new Api(this.props.token),
            hideModal: new HideModal(),
            consultantCategoryList: [],
            ownCategory: [],

            enterprisename: null,
            entrepriseemail: null,
            superuserfname: null,
            superuserlname: null,
            superusermobile: null,
            superusermail: null,
            emailnotification: false,


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
            fetching: false,
            message: '',
            startDate: new Date(),
            idActiveList: []
        }

        this.handleLimit = this.handleLimit.bind(this);
        this.handleStatusChange = this.handleStatusChange.bind(this);
        this.handleChangeDate = this.handleChangeDate.bind(this);
        this.handleChangeEntreprise = this.handleChangeEntreprise.bind(this);
        this.onSelectSites = this.onSelectSites.bind(this);


    }

    componentDidMount() {

        this.loadData();
    }

    loadData = () => {

        this.state.api
            .getAccountList(["consultant", this.state.limit, this.state.pagenumber])
            .then(response => {
                if (response.status === 200) {

                    let consultant_ar = response.data.data;
                    let consultantId = [];
                    let ownCategory = []
                    let n = 0;
                    consultant_ar.forEach(ent => {

                        if (ent.status == "active") {
                            consultantId[n] = ent.id;
                        }
                        ownCategory[n] = ent.consultant_category[0];
                        n++;
                    });

                    this.setState({
                        isLoaded: true,
                        items: response.data.data,
                        response: response.data,
                        fetching: false,
                        idActiveList: consultantId,
                        ownCategory: ownCategory,
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


        this.state.api
            .getAllEntreprise()
            .then(response => {
                if (response.status === 200) {
                    let entreprises_ar = response.data.data;
                    let enterpriseitem = [];
                    let n = 0;
                    const allItem = {
                        "id": "",
                        "name_en": "All",
                        "name_fr": "Tous"
                    };
                    enterpriseitem.push(allItem);
                    entreprises_ar.forEach(ent => {
                        enterpriseitem[ent.id] = {
                            "id": ent.id,
                            "name_en": ent.name_en,
                            "name_fr": ent.name_fr
                        };
                        n++;
                    });
                    this.setState({
                        enterpriseitem: enterpriseitem,
                    });
                } else {
                    let errors = {};
                    errors["message"] = "Oops1 Try again later";
                    this.setState({
                        enterpriseitem: [],
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


        this.state.api
            .getConsultantCategories()
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        consultantCategoryList: response.data

                    });
                } else {
                    this.setState({
                        consultantCategoryList: []

                    });

                }
            }
            )
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

        this.state.api
            .getAllProducteur()
            .then(response => {
                this.setState({
                    producermulti: response.data.data
                })
                if (response.status === 200) {
                    let producer_ar = response.data.data;
                    let produceritem = [];
                    let n = 0;
                    producer_ar.forEach(prod => {
                        produceritem[prod.id] = {
                            "id": prod.id,
                            "name_en": prod.name_en,
                            "name_fr": prod.name_fr
                        };
                        n++;
                    });
                    this.setState({
                        produceritem: produceritem,
                    });
                } else {
                    let errors = {};
                    errors["message"] = "Oops1 Try again later";
                    this.setState({
                        produceritem: [],
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

    addAccount(e) {

        const data = this.state.fields;
        let formData = new FormData();
        let language = "FR"

        if(data.lang == "undefined"){
            language = data.lang;
        } else{
            language = "FR";
        }
    
        formData.append('name_en', data.enterprisename);
        formData.append('contact_last_name', data.superuserlname);
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
        formData.append('email', data.superusermail);
        formData.append('parent', data.assignEntreprise);
        formData.append('producteurs', this.state.selectedProduct);
        formData.append('superadmin', "1");
        formData.append('email_notification_enabled', this.state.emailnotification);
        formData.append('consultant_category', data.categoryId);
        formData.append('lang', this.props.language);

        this.state.api
            .createAccounts(["consultant", formData])
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
                    setTimeout(window.location.reload(false), 500);
                    this.loadData();
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

    fetchByEntreprise = (selectedEntreprise) => {
        this.state.api
            .fetchbyConsultantinEntreprise(selectedEntreprise)
            .then(response => {

                this.setState({
                    items: response.data.data
                });

            })
            .catch(err => {
                if (err.response && err.response.status == 401) {
                    this.props.history.push('/');
                }
            });

    }

    handleChangeEntreprise(e) {
        let selectedEntreprise = e.target.value;
        let IntValue = Number(selectedEntreprise);
        this.setState({ selectedEntreprise: IntValue });
        this.fetchByEntreprise(IntValue);
    }

    addAccountformSubmit(e) {
        e.preventDefault();
        let errors = {};

        if (this.handleValidation()) {
            this.setState({ errors: errors });
            this.addAccount(e);

        } else {

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

    handleNotificationChange = () => {
        var emailnotification = !this.state.emailnotification
        this.setState({
            emailnotification: emailnotification
        })
    }

    handleDropdownChange(e) {
        this.setState({ lang: e.target.value });
    }

    fileSelectedHandler = event => {
        this.setState({
            selectedFile: event.target.files[0]
        })
    }

    setPagination = (updatedPageNo, limit) => {

        this.state.api
            .getAccountList(["consultant", limit, updatedPageNo])
            .then(response => {
                this.setState({
                    isLoaded: true,
                    items: response.data.data
                });
            }).catch(err => {
                if (err.response && err.response.status == 401) {
                    this.props.history.push('/');
                }
            }
            );

    }


    fetchStatusResults = (status) => {

        this.state.api
            .fetchStatusList(["consultant", this.state.query, status])
            .then(response => {
                this.setState({
                    isLoaded: true,
                    items: response.data.data
                })
            })
            .catch(err => {
                if (err.response && err.response.status == 401) {
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

    handleLimit(e) {
        const limitValue = e.target.value;
        this.setState({ limit: limitValue, message: '' }, () => {
            this.setPagination(this.state.pagenumber, limitValue);
        });
    };

    handleOnInputChange = (event) => {
        if (this.state.timer) {
            clearTimeout(this.state.timer);
            this.setState({timer: 0});
        }
        const query = event.target.value;
        this.setState({
            query: query, message: '', timer: setTimeout(() => this.fetchSearchReults(query), 1500)
        });
    };

    setFetching = () => {
        this.setState({
            fetching: false,
        });
    }


    fetchSearchReults = (query) => {

        this.state.api
            .searchAccount(["consultant", this.state.limit, query, this.state.selectedStatus])
            .then(response => {
                this.setState({
                    isLoaded: true,
                    items: response.data.data
                });
                // this.setState( ({
                //     // isLoaded: true,
                //     items: response.data.data
                // }), () => {
                //     //after callback 
                //     setTimeout(this.setFetching(), 500);
                // });
            })
            .catch(err => {
                if (err.response && err.response.status == 401) {
                    this.props.history.push('/');
                }
            });
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

    handlePageChange(pageNumber) {
        this.setState({ activePage: pageNumber, pageNumber: pageNumber }, () => {
            this.setPagination(pageNumber, this.state.limit);
        });
    };

    getParentName = (owned_by) => {
        let assignationdentreprise = "Admin";
        let element = this.state.enterpriseitem[owned_by];
        if (element) {
            assignationdentreprise = element.name_en;
        }
        return assignationdentreprise;
    }

    // getProducerName = (owned_by) => {
    //     let assignationdproducer = "Admin";
    //     let element = this.state.selectedProduct[owned_by];
    //     if (element) {
    //         assignationdproducer = element.name_en;
    //     }
    //     return assignationdproducer;
    // }


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
            .fetchByDateConsultant([this.state.query, this.state.selectedStatus, this.state.limit, date])
            .then(response => {

                this.setState({
                    items: response.data.data,
                });

            })
            .catch(err => {
                if (err.response && err.response.status == 401) {
                    this.props.history.push('/');
                }
            });
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

    onSelectedItemsChange(selectedItems) {
        this.setState({ selectedItems });
    }

    onSelectSites(selectedList, selectedItem) {
        let selectedProduducture = []
        selectedList.forEach(item => {
            selectedProduducture.push(item.id)
        });

        let produducture = selectedProduducture.join(',');
        this.setState({ selectedProduct: produducture });

        // {
        //     this.state.produceritem.map((obj) => (
        //         <option value={obj.id}>{obj.name_en}</option>
        //     ))
        // }

    }

    onRemove(selectedList, removedItem) {
    }

    render() {
        const { query, emailnotification, idActiveList, ownCategory, producermulti, selectedItems } = this.state;
        const translation = this.props.translation;
        const language = this.props.language;
        const isFrench = language == "FR";


        if (!this.props.isLogged) {
            this.props.history.push('/');
        } else if (this.props.userRole != "ROLE_ADMIN") {
            this.props.history.push('/');
        }

        const { error, isLoaded } = this.state;
        if (error) {
            return <div>{translation.Error}: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>{translation.Loading}...</div>;
        } else {
            return (
                <div>
                    <NavBar />
                    <div>
                        <main>
                            <div id="mainDivSelect">
                                <div>
                                    <main style={{ backgroundColor: '#F0F0F0' }}>
                                        <div class="row headerTop align-bottom "
                                            style={{ maxHeight: '100px', marginLeft: '10px', marginRight: '10px', marginTop: '0px' }}>
                                            <div class="col-md-4 col-lg-4 col-sm-4  col-xs-12 "
                                                style={{ marginTop: '10px', marginBottom: '10px' }}>
                                                <h5 className="modal-title p-1 d-inline"
                                                    id="exampleModalLabel">{translation.Consultants}</h5>
                                                <label class="p-2 d-inline" htmlFor="inputEmail">{this.state.total}</label>
                                            </div>
                                            <div class="col-md-4 col-lg-3 col-sm-12 col-xs-12">
                                                <button type="button" class="btn btn-primary primaryTop mobile_button" data-toggle="modal" data-target="#exampleModalLong">{translation.Add_a_person} </button>

                                                <div class="modal fade" id="exampleModalLong" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
                                                    <div class="modal-dialog" role="document" style={{ maxWidth: '100%' }} >
                                                        <div class="modal-content">
                                                            <div class="modal-header">
                                                                <h5 class="modal-title" id="exampleModalLongTitle">{translation.Consultants}</h5>
                                                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                                    <span aria-hidden="true">&times;</span>
                                                                </button>
                                                            </div>
                                                            <div class="modal-body">
                                                                <form name="contactform" onSubmit={this.addAccountformSubmit.bind(this)}>
                                                                    <div class="form-group row">
                                                                        <label for="staticEmail" class="col-sm-5  col-form-label">{translation.Name}:</label>
                                                                        <div class="col-sm-7 ">
                                                                            <input type="text" class="form-control" ref="enterprisename" id="enterprisename" name='enterprisename' onChange={this.handleChange.bind(this, "enterprisename")} value={this.state.fields["enterprisename"]} />
                                                                            <span style={{ color: "red" }}>{this.state.errors["enterprisename"]}</span>
                                                                        </div>
                                                                    </div>
                                                                    <div class="form-group row">
                                                                        <label for="inputPassword" class="col-sm-5 col-form-label">{translation.Phone_Number}:</label>
                                                                        <div class="col-sm-7 "> <PhoneInput
                                                                            country={'ca'}
                                                                            value={this.state.phone}
                                                                            onChange={phone => this.setState({ phone })}
                                                                            required={true}
                                                                            onlyCountries={['ca']}
                                                                            className="react-tel-input .form-control"
                                                                        /><span style={{ color: "red" }}>{this.state.errors["enterprisemobile"]}</span>
                                                                        </div>
                                                                    </div>
                                                                    <div class="form-group row">
                                                                        <label for="inputPassword" class="col-sm-5 col-form-label">{translation.Email}:</label>
                                                                        <div class="col-sm-7 " >
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

                                                                    <div class="form-group row">
                                                                        <label for="inputPassword" class="col-sm-5 col-form-label">{translation.Category}:</label>
                                                                        <div class="col-sm-7 ">
                                                                            <div class="input-group-append">
                                                                                <select class="form-select form-control" aria-label="Text input with dropdown button" onChange={this.handleChange.bind(this, "categoryId")}  >
                                                                                    <option selected disabled hidden>{translation.Make_a_selection}</option>
                                                                                    {
                                                                                        this.state.consultantCategoryList.map((obj) => (
                                                                                            <option value={obj.id}>{isFrench ? obj.name_fr : obj.name_en}</option>
                                                                                        ))

                                                                                    }
                                                                                </select>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div class="form-group row">
                                                                        <label for="inputPassword" class="col-sm-5 col-form-label">{translation.Corporate_Assignment}:</label>
                                                                        <div class="col-sm-7 ">
                                                                            <div class="input-group-append">
                                                                                <select class="form-select form-control" aria-label="Text input with dropdown button" onChange={this.handleChange.bind(this, "assignEntreprise")} >
                                                                                    <option selected disabled hidden>{translation.Make_a_selection}</option>
                                                                                    {
                                                                                        this.state.enterpriseitem.map((obj) => (
                                                                                            <option value={obj.id}>{isFrench ? obj.name_fr : obj.name_en}</option>
                                                                                        ))

                                                                                    }
                                                                                </select>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    {/* <div class="form-group row">
                                                                        <label for="inputPassword" class="col-sm-5 col-form-label">Assignation d’producers:</label>
                                                                        <div class="col-sm-7 ">
                                                                            <div class="input-group-append">
                                                                                <Multiselect
                                                                                    options={producermulti} // Options to display in the dropdown
                                                                                    selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
                                                                                    onSelect={this.onSelectSites}
                                                                                    onRemove={this.onRemove}// Function will trigger on select event
                                                                                    displayValue="name_en" // Property name to display in the dropdown options
                                                                                    showCheckbox="true"
                                                                                    placeholder="Select Sites"
                                                                                />
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
                                                                            <input type="checkbox" value={emailnotification} id="emailnotification" name='emailnotification' onChange={this.handleNotificationChange}></input>
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
                                            <div class="col-md-4 col-lg-4 col-sm-12 col-xs-12 ml-auto "
                                                style={{ marginTop: '10px', marginBottom: '10px' }}>
                                                <div class="input-group">
                                                    <input type="text" class="form-control" name="query" value={query} id="search-input" placeholder={translation.city_name_of_consultant} onChange={this.handleOnInputChange} />
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
                                            <div class="col-md-5 col-lg-6 col-sm-12 col-xs-12 form-item-margin">

                                                <strong class="d-inline p-2" htmlFor="inputEmail">{translation.Filter_by}:</strong>

                                                <DatePicker
                                                    selected={this.state.startDate}
                                                    onChange={this.handleChangeDate}
                                                    dateFormat="yyyy-MM-dd"
                                                    className="form-control d-inline p-2"

                                                />

                                            </div>
                                            <div class="col-md-4 col-lg-3 col-sm-12 col-xs-12 form-item-margin">
                                                <div class="input-group ">
                                                    <strong class="d-inline p-2" htmlFor="inputEmail">{translation.Entreprise}:</strong>

                                                    <select class="form-select form-control" aria-label="Text input with dropdown button" onChange={this.handleChangeEntreprise.bind(this)} >
                                                        <option selected disabled hidden>{translation.Make_a_selection}</option>
                                                        {
                                                            this.state.enterpriseitem.map((obj) => (
                                                                <option value={obj.id}>{isFrench ? obj.name_fr : obj.name_en}</option>

                                                            ))
                                                        }
                                                    </select>

                                                    {/* <input type="text" class="form-control"
                                                        aria-label="Text input with dropdown button"
                                                        placeholder="Faire une selection"></input>
                                                    <div class="input-group-append">
                                                        <button class="btn btn-outline-secondary dropdown-toggle"
                                                            type="button" data-toggle="dropdown" aria-haspopup="true"
                                                            aria-expanded="false"></button>
                                                        <div class="dropdown-menu">9
                                                            <a class="dropdown-item" href="#">Action</a>
                                                            <a class="dropdown-item" href="#">Another action</a>
                                                            <a class="dropdown-item" href="#">Something else here</a>
                                                            <div role="separator" class="dropdown-divider">

                                                            </div>
                                                            <a class="dropdown-item" href="#">Separated link</a>
                                                        </div>
                                                    </div> */}
                                                </div>
                                            </div>
                                            <div class="col-md-3 col-lg-3 col-sm-12 col-xs-12 form-item-margin" >
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
                                                <div id="no-more-tables" >
                                                    <table class="col-sm-12   table-condensed cf" style={{ backgroundColor: 'white' }}>

                                                        <thead class="cf" >
                                                            <tr class="text-left" style={{ height: '70px' }}>
                                                                <th >{translation.Name}</th>
                                                                <th className="d-none d-md-table-cell">{translation.First_Name}</th>
                                                                <th className="d-none d-md-table-cell">{translation.Email}</th>
                                                                <th className="d-none d-md-table-cell">{translation.Categories}</th>
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
                                                                <th >{translation.Name}</th>
                                                                <th className="d-none d-md-table-cell">{translation.First_Name}</th>
                                                                <th className="d-none d-md-table-cell">{translation.Email}</th>
                                                                <th className="d-none d-md-table-cell">{translation.Categories}</th>
                                                                <th className="d-none d-md-table-cell">{translation.Entreprise}</th>
                                                                <th>{translation.Status}</th>
                                                                <th class="text-center" style={{ paddingLeft: '65px' }}>{translation.Actions}</th>
                                                            </tr>
                                                        </thead>
                                                        {this.state.items.map((item, index) => (
                                                            <tbody>
                                                                <tr class=" border-top text-left">
                                                                    <td data-title={translation.Name} className="admin-entreprise-actions-button-child">{item.name_en}</td>
                                                                    <td className="d-none d-md-table-cell" data-title="Prénom">{item.contact_last_name}</td>
                                                                    <td className="d-none d-md-table-cell" data-title="Prénom">{item.contact_email}</td>
                                                                    <td className="d-none d-md-table-cell" data-title="Prénom">{ownCategory[index] ? ownCategory[index].name_en : "Nothing yet"}</td>
                                                                    <td className="d-none d-md-table-cell" data-title="Prénom">{this.getParentName(item.owned_by)}</td>
                                                                    <td className="d-none d-md-table-cell" data-title="Prénom">{item.status}</td>
                                                                    <td data-title={translation.Actions} style={{ paddingLeft: '70px' }}>
                                                                        <div class="text-center">   {/*class="row d-flex" */}
                                                                            <ul class="ml-auto arrow_collapse_margin admin-entreprise-actions-button-parent" style={{ margin: "0px" }}>

                                                                                <img onClick={this.handleClick.bind(this)} id={item.id}
                                                                                    src={idActiveList.includes(item.id) ? pauseIcon : playIcon} />


                                                                                {/* <img src={playIcon} class="img-responsive " alt="Responsive image" /> */}
                                                                                <a href={"/admin/consultant/" + item.id + "/dashboard"}><img src={userIcon} class="img-responsive inline-block" alt="Responsive image" /></a>

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

                                                                <MyTablePopup value={item} ownCategory={ownCategory[index]} type="consultant" entrepriseList={this.state.enterpriseitem} categoryList={this.state.consultantCategoryList} qa="qa" producerlist={producermulti} preselectprodlist={this.state.selectedValue}></MyTablePopup>
                                                                <tr class="hide-table-padding d-none d-md-table-row">
                                                                    <td colspan="8" class="">
                                                                        <div id={"collapseExample" + item.id} class="collapse">
                                                                            <Form value={item} ownCategory={ownCategory[index]} entrepriseList={this.state.enterpriseitem} categoryList={this.state.consultantCategoryList} qa="qa" producerlist={producermulti} preselectprodlist={this.state.selectedValue}></Form>
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
                                    </main>


                                    <nav aria-label="Page navigation example" style={{ margin: '40px' }}>
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
            )
        }
    }
}

export default connect(mapStateToProps, null)(withLanguageHook(Consultants));