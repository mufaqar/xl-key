import React from 'react'
import editIconInButton from "../../public/img/edit_icon_in_button.png"
import userIconInButton from "../../public/img/user_icon_in_button.png"
import DatePic from "../Admin/DatePic"
import Api from "../../helper/api";
import { connect, useSelector, useDispatch } from 'react-redux';
import Multiselect from 'multiselect-react-dropdown';
import { config } from 'dotenv';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import useTranslation from "../customHooks/translations";
import getLanguage from "../customHooks/get-language";

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
      return <Component {...props} translation={translation} language={language}/>;
  }
}

var createClass = require('create-react-class');

var TextField = createClass({
  render: function () {
    var text;
    if(this.props.text == "undefined")  {
      text =  'Nothing yet'
    } else {
      text = this.props.text || 'Nothing yet'
    }

    return (
      <div class="form-group" style={{ paddingTop: '8px' }}>
        <p>{text}</p>
      </div>
    )
  }
})


var EditForm = createClass({

  checkBoxEditing: function () {
    var statusEdited = !this.state.statusEdit
    this.setState({
      statusEdit: statusEdited
    })
  },

  onFormSubmit: function (e) {

    e.preventDefault();
    let errors = {};
    if (this.handleValidation()) {
      this.setState({ errors: errors });
      this.updateAccount();
    } else {
    }

  },

  getInitialState: function () {
    return this.assignStates(
      this.props.valueNew,
      this.props.token,
      this.props.entrepriseList,
      this.props.assignationdentreprise,
      this.props.producerlist
    );
  },

  assignStates: function (value, token, entrepriseList, assignationdentreprise) {

    let booleanStatus = false;
    let category = null;

    let fields = [];
    fields["Nom"] = value.name_en;
    fields["Téléphone"] = value.contact_phone;
    fields["Courriel"] = value.contact_email;
    fields["Adresse"] = value.address;
    fields["Codepostal"] = value.postal_code;
    fields["Ville"] = value.city;
    fields["Province"] = value.province;
    fields["Pays"] = value.country;
    fields["Prenom"] = value.admins[0].first_name;
    fields["Nom1"] = value.admins[0].last_name;
    fields["AdminTel"] = value.contact_phone;
    fields["admin_Courriel"] = value.admins[0].email;
    fields["admin_userName"] = value.admins[0].username;
    fields["admin_password"] = "";
    // fields["admin_lang"] = value.admins[0].language_pref;
    fields["admin_lang"] = value.language_pref;
    fields["status"] = value.status;
    fields["assignEntreprise"] = value.owned_by;


    if (this.props.type == "consultant" && this.props.ownCategory) {
      fields["categoryId"] = this.props.ownCategory.id;
      category = this.props.ownCategory.name_en;
    }

    if (value.status === "active") {
      booleanStatus = true;
    } else {
      booleanStatus = false;
    }

    let initial_values = {
      id: value.id,
      Nom: value.name_en,
      created_at: value.created_at,
      Téléphone: value.contact_phone,
      phone: value.contact_phone,
      Courriel: value.contact_email,
      Adresse: value.address,
      Codepostal: value.postal_code,
      Ville: value.city,
      Province: value.province,
      Pays: value.country,

      Prenom: value.admins[0].first_name,
      Nom1: value.admins[0].last_name,
      AdminTel: value.contact_phone,
      admin_Courriel: value.admins[0].email,
      admin_userName: value.admins[0].username,
      // admin_lang: value.admins[0].language_pref,
      admin_lang: value.admins[0].language_pref,
      logo: value.logo_url,
      statusEdit: booleanStatus,
      status: booleanStatus,
      status_bool: false,
      email_notification_edited: value.admins[0].email_notification_enabled,
      message: null,
      api: new Api(token),
      category: category,
      entrepriseList: entrepriseList,
      owned_by: value.owned_by,
      Assignationdentreprise: assignationdentreprise,
      // Assignationdproducer: assignationdproducer,
      fields: fields,
    }
    return initial_values;
  },

  getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.total !== prevState.total) {
      return ({ total: nextProps.total }) // <- this is setState equivalent
    }
    return null
  },

  handleChange(field, e) {
    let fields = this.state.fields;
    fields[field] = e.target.value;
    this.setState({ fields });
  },

  fileSelectedHandler(event) {
    this.setState({
      selectedFile: event.target.files[0]
    })
  },

  updateAccount() {
    const data = this.state.fields;
    let formData = new FormData();
    let statusEditValue = "inactive";
    if (this.state.statusEdit) {
      statusEditValue = "active";
    } else {
      statusEditValue = "inactive";
    }
    let id = this.state.id;
    formData.append('name_en', data.Nom);
    formData.append('name_fr', data.Nom);
    formData.append('contact_phone',  this.state.phone);
    formData.append('contact_email', data.Courriel);
    formData.append('address', data.Adresse);
    formData.append('postal_code', data.Codepostal);
    formData.append('city', data.Ville);
    formData.append('province', data.Province);
    formData.append('country', data.Pays);
    formData.append('language_pref', data.admin_lang);
    formData.append('status', statusEditValue);
    // Super admin
    formData.append('first_name', data.Prenom);
    formData.append('last_name', data.Nom1);
    formData.append('username', data.admin_Courriel);
    formData.append('password', data.admin_password);
    formData.append('superadmin', 1);
    // formData.append('roles', ["entreprise"]);
    formData.append('email', data.admin_Courriel);
    formData.append('email_notification_enabled', this.state.email_notification_edited);
    formData.append('logo', this.state.selectedFile);
    formData.append('owned_by', data.assignEntreprise);
    formData.append('lang', this.props.language);

    if (this.props.type == "consultant" && data.categoryId != "undefined") {
      formData.append('consultant_category', data.categoryId);
    }

    this.state.api
      .updateAccounts([id, formData])
      .then(response => {
        this.setState({
          message: response.data.message
        })
        window.location.reload(false);
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
  },

  handleValidation() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    let isValid = true;
    const isFrench = this.props.language == "FR";

    if (!fields["Nom"]) {
      formIsValid = false;
      errors["Nom"] = isFrench ? "Le nom de l'entreprise est requis" : "Company name is required";
    }

    if (!fields["Courriel"]) {
      formIsValid = false;
      errors["Courriel"] = isFrench ?"Le courriel est requis":"Email is required";
    } else {
      let lastAtPos = fields["Courriel"].lastIndexOf('@');
      let lastDotPos = fields["Courriel"].lastIndexOf('.');

      if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["Courriel"].indexOf('@@') == -1 && lastDotPos > 2 && (fields["Courriel"].length - lastDotPos) > 2)) {
        formIsValid = false;
        errors["Courriel"] = isFrench ? "L'adresse de courriel n'est pas valide" : "The email address is not valid";
      }
    }

    if (!fields["Prenom"]) {
      formIsValid = false;
      errors["Prenom"] = isFrench ?"Le nom est requis" : "Name is required";
    }

    if (!fields["Nom1"]) {
      formIsValid = false;
      console.log("formIsValid superuserlname", this.state.fields["Nom1"]);
      errors["Nom1"] = isFrench ?"Le prénom est requis":"First name is required";
    }

    // if (!fields["superusermobile"]) {
    //     formIsValid = false;
    //     console.log("formIsValid superusermobile", this.state.fields["superusermobile"]);
    //     errors["superusermobile"] = "Courriel est requis";
    // }

    if (!fields["admin_Courriel"]) {
      formIsValid = false;
      errors["admin_Courriel"] = isFrench ?"Le courriel est requis":"Email is required";
    } else {
      let lastAtPos = fields["admin_Courriel"].lastIndexOf('@');
      let lastDotPos = fields["admin_Courriel"].lastIndexOf('.');

      if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["admin_Courriel"].indexOf('@@') == -1 && lastDotPos > 2 && (fields["admin_Courriel"].length - lastDotPos) > 2)) {
        formIsValid = false;
        errors["admin_Courriel"] = isFrench ? "L'adresse de courriel n'est pas valide" : "The email address is not valid";
      }
    }

    // if (!fields["admin_password"]) {
    //   formIsValid = false;
    //   console.log("formIsValid superuserpassword", this.state.fields["admin_password"]);
    //   errors["admin_password"] = "Le mot de passe est requis";
    // }

    if (typeof !this.state.phone) {
      isValid = false;
      var pattern = new RegExp(/^[0-9\b\+\-\(\)]+$/);

      if (!pattern.test(this.state.phone)) {
        isValid = false;
        errors["Téléphone"] = isFrench ?"Veuillez vérifier le numéro de téléphone":"Please check the phone number";
      }
      // else if (fields["enterprisemobile"].length != 10) {
      //     isValid = false;
      //     errors["enterprisemobile"] = "Veuillez entrer un numéro de téléphone valide";
      // }
    }

    this.setState({ errors: errors });
    return formIsValid

  },

  getCreatedDate(created_at) {
    let date = created_at;
    let dateFormat = require("dateformat");
    let correctdate = dateFormat(date, "yyyy-mm-dd");
    return correctdate;
  },

  handleNotificationChange() {
    var email_notification_edited = !this.state.email_notification_edited
    this.setState({
      email_notification_edited: !this.state.email_notification_edited
    })
  },

  onSelectedItemsChange(selectedItems) {
    this.setState({ selectedItems });
  },

  onSelectSites(selectedList, selectedItem) {
    let selectedProduducture = []
    selectedList.forEach(item => {
      selectedProduducture.push(item.id)
    });
    let produducture = selectedProduducture.join(',');
    this.setState({ selectedProduct: produducture });
  },

  onRemove(selectedList, removedItem) {

  },

  onChangePhone(phone){
    this.setState({phone: phone});
  },

  render: function () {

    const translation = this.props.translation;

    if (this.props.valueNew.id != this.state.id) {
      this.setState(this.assignStates(
        this.props.valueNew,
        this.props.token,
        this.props.entrepriseList,
        this.props.assignationdentreprise,
        this.props.producerlist
        // this.props.assignationdproducer
      )
      );
    }

    let items = [];
    let Nom;
    let Téléphone;
    let Courriel;
    let Adresse;
    let Codepostal;
    let Ville;
    let Province;
    let Pays;
    let Assignationdentreprise;
    let Assignationdproducer;
    let logo;

    let Nom1;
    let Prenom;
    let AdminTel;
    let admin_Courriel;
    let admin_userName;
    let admin_password;
    let admin_lang;
    let emailnotification;
    let status = this.state.status;
    let admin_lang_name;
    let category;

    if (this.props.isEdit) {
      console.log("object***", this.state.errors)
      Nom = <div class="form-group">
        <input
          type="text"
          class="form-control"
          id={this.state.id}
          ref="userInput"
          defaultValue={this.state.Nom}
          value={this.state.fields["Nom"]}
          onChange={this.handleChange.bind(this, "Nom")}
        />
        {(this.state.errors && this.state.errors["Nom"]) ? (<span style={{ color: "red" }}>{this.state.errors["Nom"]}</span>) : null}
      </div>


      Téléphone = <div class="form-group">
        <PhoneInput
          country={'ca'}
          value={this.state.phone}
          onChange={phone =>this.onChangePhone(phone)}
          required={true}
          onlyCountries={['ca']}
          className="react-tel-input .form-control"
        />
        {(this.state.errors && this.state.errors["Téléphone"]) ? (<span style={{ color: "red" }}>{this.state.errors["Téléphone"]}</span>) : null}
      </div>

      Courriel = <div class="form-group">
        <input
          type="text"
          class="form-control"
          id={this.state.id}
          ref="userInput"
          defaultValue={this.state.Courriel}
          value={this.state.fields["Courriel"]}
          onChange={this.handleChange.bind(this, "Courriel")}
        />
        {(this.state.errors && this.state.errors["Courriel"]) ? (<span style={{ color: "red" }}>{this.state.errors["Courriel"]}</span>) : null}
      </div>

      Adresse = <div class="form-group">
        <input
          type="text"
          class="form-control"
          id={this.state.id}
          ref="userInput"
          defaultValue={this.state.Adresse}
          value={this.state.fields["Adresse"]}
          onChange={this.handleChange.bind(this, "Adresse")}
        />
      </div>

      Codepostal = <div class="form-group">
        <input
          type="text"
          class="form-control"
          id={this.state.id}
          ref="userInput"
          defaultValue={this.state.Codepostal}
          value={this.state.fields["Codepostal"]}
          onChange={this.handleChange.bind(this, "Codepostal")}
        />
      </div>

      Ville = <div class="form-group">
        <input
          type="text"
          class="form-control"
          id={this.state.id}
          ref="userInput"
          defaultValue={this.state.Ville}
          value={this.state.fields["Ville"]}
          onChange={this.handleChange.bind(this, "Ville")}
        />
      </div>

      Province = <div class="form-group">
        <input
          type="text"
          class="form-control"
          id={this.state.id}
          ref="userInput"
          defaultValue={this.state.Ville}
          value={this.state.fields["Province"]}
          onChange={this.handleChange.bind(this, "Province")}
        />
      </div>

      Pays = <div class="form-group">
        <input
          type="text"
          class="form-control"
          id={this.state.id}
          ref="userInput"
          defaultValue={this.state.Pays}
          value={this.state.fields["Pays"]}
          onChange={this.handleChange.bind(this, "Pays")}
        />
      </div>

      logo = <div class="form-group">
        <input
          type="file"
          ref="logo"
          id={this.state.id}
          name='logo'
          onChange={this.fileSelectedHandler}
          value={this.state.fields["logo"]} />
      </div>

      Nom1 = <div class="form-group">
        <input
          type="text"
          class="form-control"
          id={this.state.id}
          ref="userInput"
          defaultValue={this.state.Nom1}
          value={this.state.fields["Nom1"]}
          onChange={this.handleChange.bind(this, "Nom1")}
        />
        {(this.state.errors && this.state.errors["Nom1"]) ? (<span style={{ color: "red" }}>{this.state.errors["Nom1"]}</span>) : null}
      </div>

      Prenom = <div class="form-group">
        <input
          type="text"
          class="form-control"
          id={this.state.id}
          ref="userInput"
          defaultValue={this.state.Prenom}
          value={this.state.fields["Prenom"]}
          onChange={this.handleChange.bind(this, "Prenom")}
        />
        {(this.state.errors && this.state.errors["Prenom"]) ? (<span style={{ color: "red" }}>{this.state.errors["Prenom"]}</span>) : null}
      </div>

   
      admin_Courriel = <div class="form-group">
        <input
          type="text"
          class="form-control"
          id={this.state.id}
          ref="userInput"
          defaultValue={this.state.admin_Courriel}
          value={this.state.fields["admin_Courriel"]}
          onChange={this.handleChange.bind(this, "admin_Courriel")}
        />
        {(this.state.errors && this.state.errors["admin_Courriel"]) ? (<span style={{ color: "red" }}>{this.state.errors["admin_Courriel"]}</span>) : null}
      </div>

      emailnotification = <div class="form-group">
        <input
          type="checkbox"
          checked={this.state.email_notification_edited}
          id={this.state.id}
          name='emailnotification'
          onChange={this.handleNotificationChange} />
      </div>

      //  Assignationdentreprise = <div class="form-group">
      //     <div class="input-group">
      //       <select class="form-select form-control" aria-label="Default select example" onChange={this.handleChange.bind(this, "admin_lang")} value={this.state.fields["admin_lang"]} >
      //         <option selected disabled hidden>Choisir la langue</option>
      //         <option value="xlKey">XLKey</option>
      //         <option value="en1">Entreprise 1</option>
      //         <option value="en1">Entreprise 2</option>
      //         <option value="en1">Etc... </option>
      //       </select>
      //     </div>
      //     </div>

      admin_lang = <div class="form-group">
        <div class="input-group">
          <select class="form-select form-control" aria-label="Default select example" onChange={this.handleChange.bind(this, "admin_lang")} value={this.state.fields["admin_lang"]} >
            <option selected disabled hidden>{translation.Choose_Language}</option>
            <option value="FR">{translation.French}</option>
            <option value="EN">{translation.English}</option>
          </select>
        </div>
      </div>

      if (this.props.type === "consultant") {
        category =
          <div class="form-group">
            <select class="form-select form-control" aria-label="Text input with dropdown button" onChange={this.handleChange.bind(this, "categoryId")} value={this.state.fields["categoryId"]} >
              <option selected disabled hidden>{translation.Make_a_selection}</option>
              {
                this.props.categoryList.map((obj) => (
                  <option value={obj.id}>{obj.name_en}</option>
                ))
              }
            </select>
          </div>
        Assignationdentreprise =
          <div class="form-group">
            <select class="form-select form-control" aria-label="Text input with dropdown button" onChange={this.handleChange.bind(this, "assignEntreprise")} value={this.state.fields["assignEntreprise"]} >
              <option selected disabled hidden>{translation.Make_a_selection}</option>
              {
                this.props.entrepriseList.map((obj) => (
                  <option value={obj.id}>{obj.name_en}</option>
                ))
              }
            </select>
          </div>
      } else if (this.props.type === "product") {
        Assignationdentreprise =
          <div class="form-group">
            <select class="form-select form-control" aria-label="Text input with dropdown button" onChange={this.handleChange.bind(this, "assignEntreprise")} value={this.state.fields["assignEntreprise"]} >
              <option selected disabled hidden>{translation.Make_a_selection}</option>
              {
                this.props.entrepriseList.map((obj) => (
                  <option value={obj.id}>{obj.name_en}</option>
                ))
              }
            </select>
          </div>
      }

      admin_password = <div class="form-group">
        <input
          type="password"
          class="form-control"
          id={this.state.id}
          ref="userInput"
          placeholder="*******"
          onChange={this.handleChange.bind(this, "admin_password")}
        />
      </div>


    } else {
      Nom = <TextField text={this.state.Nom} />
      Téléphone = <TextField text={this.state.Téléphone} />
      console.log("Téléphone ************ ",this.state.Téléphone);
      Courriel = <TextField text={this.state.Courriel} />
      Adresse = <TextField text={this.state.Adresse} />
      Codepostal = <TextField text={this.state.Codepostal} />
      Ville = <TextField text={this.state.Ville} />
      Province = <TextField text={this.state.Province} />
      Pays = <TextField text={this.state.Pays} />

      Nom1 = <TextField text={this.state.Nom1} />
      Prenom = <TextField text={this.state.Prenom} />
      // AdminTel = <TextField text={this.state.AdminTel} />
      admin_Courriel = <TextField text={this.state.admin_Courriel} />
      // admin_userName = <TextField text={this.state.admin_userName} />
      admin_password = <TextField text="*****" />
      category = <TextField text={this.state.category} />


      Assignationdentreprise = <TextField text={this.props.assignationdentreprise} />

      if (this.state.admin_lang == "FR") {
        admin_lang_name = "Francais";
      }
      else {
        admin_lang_name = "English";
      }
      admin_lang = <TextField text={admin_lang_name} />

      emailnotification = <div class="form-group">
        <input
          type="checkbox"
          id="emailnotification"
          name='emailnotification'
          checked={this.state.email_notification_edited}
          disabled={true}
        />
      </div>

      logo = this.state.logo != "" ? <div className="form-group logo-upload-field">
        <img src={process.env.REACT_APP_IMAGE_URL + this.state.logo} />
      </div> : <div ></div>


    }

    const width100percent = "100%";
    return (

      <form name="addAccountform" onSubmit={this.onFormSubmit}>
        <div style={{ width: width100percent }}>
          <div class="row " style={{ marginTop: '20px' }}>

            <div class="col-md-6 ">
              {this.props.isEdit && (
                <div className="d-flex align-items-end" style={{ marginLeft: '-10px' }} >
                  <strong htmlFor="inputEmail" style={{ margin: '10px' }}>{translation.Status}: </strong>
                  <label htmlFor="inputEmail" style={{ margin: '10px' }}>{translation.Inactive}</label>
                  <label class="switch" style={{ margin: '10px' }}>
                    <input type="checkbox" disabled={!this.props.isEdit} checked={this.props.isEdit ? (this.state.statusEdit) : status} onChange={this.checkBoxEditing} class="primary"></input>
                    <span class="slider round"></span>
                  </label>
                  <label htmlFor="inputEmail" style={{ margin: '10px' }}>{translation.Active}</label>
                </div>
              )}


              {!this.props.isEdit && (
                <div className="d-flex align-items-end" style={{ marginLeft: '-10px' }} >
                  <strong htmlFor="inputEmail" style={{ margin: '10px' }}>{translation.Status}: </strong>
                  {this.state.status && (<label htmlFor="inputEmail" style={{ margin: '10px' }}>{translation.Active} </label>
                  )}
                  {!this.state.status && (<label htmlFor="inputEmail" style={{ margin: '10px' }}>{translation.Inactive}</label>
                  )}

                </div>
              )}

              {/* <strong htmlFor="inputEmail">Information du contact principal </strong> style={{ margin: '10px' }} */}
              <div>
                <div style={{ margin: '10px' }}>

                  <div class="form-group  form-item-margin row">
                    <label for="inputPassword" class="col-sm-6 col-form-label">{translation.Name_of_the_company}</label>
                    <div class="col-sm-6 ">
                      {Nom}
                    </div>
                  </div>


                  <div class="form-group  form-item-margin row">
                    <label for="inputPassword" class="col-sm-6 col-form-label">{translation.Phone_Number}</label>
                    <div class="col-sm-6 ">
                      {Téléphone}
                    </div>
                  </div>



                  <div class="form-group  form-item-margin row">
                    <label for="inputPassword" class="col-sm-6 col-form-label">{translation.Email}</label>
                    <div class="col-sm-6 ">
                      {Courriel}
                    </div>
                  </div>


                  <div class="form-group  form-item-margin row">
                    <label for="inputPassword" class="col-sm-6 col-form-label">{translation.Address}</label>
                    <div class="col-sm-6 ">
                      {Adresse}
                    </div>
                  </div>

                  <div class="form-group  form-item-margin row">
                    <label for="inputPassword" class="col-sm-6 col-form-label">{translation.Postal_Code}</label>
                    <div class="col-sm-6 ">
                      {Codepostal}
                    </div>
                  </div>


                  <div class="form-group  form-item-margin row">
                    <label for="inputPassword" class="col-sm-6 col-form-label">{translation.City}</label>
                    <div class="col-sm-6 ">
                      {Ville}
                    </div>
                  </div>

                  <div class="form-group  form-item-margin row">
                    <label for="inputPassword" class="col-sm-6 col-form-label">{translation.Province}</label>
                    <div class="col-sm-6 ">
                      {Province}
                    </div>
                  </div>

                  <div class="form-group  form-item-margin row">
                    <label for="inputPassword" class="col-sm-6 col-form-label">{translation.Country}</label>
                    <div class="col-sm-6 ">
                      {Pays}
                    </div>
                  </div>

                  {/* <div class="form-group  form-item-margin row">
                      <label for="inputPassword" class="col-sm-6 col-form-label">Assignation D'Entreprise</label>
                      <div class="col-sm-6 ">
                        {Assignationdentreprise}
                      </div>
                    </div> */}




                  {/* {this.props.type === "consultant" && ( 
              <div class="row " style={{ margin: '10px' }}>
                  <div class="col-md-12" style={{ margin: '10px', padding: '10px', backgroundColor: '#ccc' }}>
                    <label htmlFor="inputEmail" >Category</label>
                    {category}
                  </div>
                </div>
                 )} */}

                  {this.props.type === "consultant" && (
                    <div class="form-group  form-item-margin row">
                      <label for="inputPassword" class="col-sm-6 col-form-label">{translation.Category}</label>
                      <div class="col-sm-6 ">
                        {category}
                      </div>
                    </div>
                  )}


                  {this.props.type === "consultant" && (
                    <div class="form-group  form-item-margin row">
                      <label for="inputPassword" class="col-sm-6 col-form-label">{translation.Corporate_Assignment}</label>
                      <div class="col-sm-6 ">
                        {Assignationdentreprise}
                      </div>
                    </div>
                  )}

                  {this.props.type === "product" && (
                    <div class="form-group  form-item-margin row">
                      <label for="inputPassword" class="col-sm-6 col-form-label">{translation.Corporate_Assignment}</label>
                      <div class="col-sm-6 ">
                        {Assignationdentreprise}
                      </div>
                    </div>
                  )}

                  {/* {this.props.type === "consultant" && (
                    <div class="form-group  form-item-margin row">
                      <label for="inputPassword" class="col-sm-6 col-form-label">Assignation d’producers</label>
                      <div class="col-sm-6 ">
                        {Assignationdproducer}
                      </div>
                    </div>
                  )} */}

                  <div class="form-group  form-item-margin row">
                    <label for="inputPassword" class="col-sm-6 col-form-label">{translation.Logo}</label>
                    <div class="col-sm-6 ">
                      {logo}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div class="col-md-6" style={{ paddingRight: '0px', paddingLeft: '0px' }}>


              <div class="col-md-12">


                {this.props.type === "product" && (
                  <div class="form-group  form-item-margin row d-flex">
                    <strong htmlFor="inputEmail" class="col-sm-4 col-form-label">{translation.Renewal_date}</strong>
                    <div class="col-sm-6 ">
                      <DatePic disabled={this.props.isEdit} initDate={new Date(this.state.created_at)} ></DatePic>
                    </div>
                  </div>
                )}
                {/* <strong htmlFor="inputEmail" >{translation.Primary_account_user}</strong> */}
                <div>
                  <div style={{ margin: '10px' }}>

                    <div class="form-group  form-item-margin row">
                      <label for="inputPassword" class="col-sm-6 col-form-label">{translation.First_Name}</label>
                      <div class="col-sm-6 ">
                        {Prenom}
                      </div>
                    </div>

                    <div class="form-group  form-item-margin row">
                      <label for="inputPassword" class="col-sm-6 col-form-label">{translation.Name}</label>
                      <div class="col-sm-6 ">
                        {Nom1}
                      </div>
                    </div>

                    {/* <div class="form-group  form-item-margin row">
                      <label for="inputPassword" class="col-sm-6 col-form-label">Téléphone</label>
                      <div class="col-sm-6 ">
                        {AdminTel}
                      </div>
                    </div> */}

                    <div class="form-group  form-item-margin row">
                      <label for="inputPassword" class="col-sm-6 col-form-label">{translation.Email}</label>
                      <div class="col-sm-6 ">
                        {admin_Courriel}
                      </div>
                    </div>

                    {/* <div class="form-group  form-item-margin row">
                      <label for="inputPassword" class="col-sm-6 col-form-label">Nom d'utilisateur</label>
                      <div class="col-sm-6 ">
                        {admin_userName}
                      </div>
                    </div> */}

                    <div class="form-group  form-item-margin row">
                      <label for="inputPassword" class="col-sm-6 col-form-label">{translation.Password}</label>
                      <div class="col-sm-6 ">
                        {admin_password}
                      </div>
                    </div>

                    <div class="form-group  form-item-margin row">
                      <label for="inputPassword" class="col-sm-6 col-form-label">{translation.Language}</label>
                      <div class="col-sm-6 ">
                        {admin_lang}
                      </div>
                    </div>

                    <div class="form-group  form-item-margin row">
                      <label for="inputPassword" class="col-sm-6 col-form-label">{translation.Email_Notifications}</label>
                      <div class="col-sm-6 ">
                        {emailnotification}
                      </div>
                    </div>

                    <div class="form-group  form-item-margin row">
                      <label for="inputPassword" class="col-sm-6 col-form-label"></label>
                      <div class="col-sm-6 ">
                        {this.props.isEdit && (
                          <button type="submit" class="btn btn-primary primaryTop mobile_button" style={{ padding: '10px' }}>{translation.Register_the_profile}</button>
                        )}

                      </div>
                    </div>

                    {this.props.isEdit && (
                      <p>{this.state.message}</p>
                    )}

                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </form>
    )


  },

})

export default connect(mapStateToProps, null)(withLanguageHook(EditForm));