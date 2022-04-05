import 'bootstrap/dist/css/bootstrap.css';
import React from 'react'
import './settingPopUp.css';
import $ from 'jquery';
import Api from "../../helper/api";

import { connect, useSelector, useDispatch } from 'react-redux';
import useTranslation from "../customHooks/translations";
import loading from "../../loading.gif";
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

class Modal extends React.Component {

  constructor(props) {
    
    super(props)
    const acc_id = this.props.acc_id;

    if (this.props.type == "update") {
      this.state = {
        id: this.props.data.id,
        first_name :  this.props.data.first_name,
        last_name :  this.props.data.last_name,
        username: this.props.data.username,
        password: "",
        password_confirm: "",
        email: this.props.data.email,
        email_confirm :  this.props.data.email,
        language_pref: this.props.data.language_pref,
        access_code: this.props.data.access_code,
        email_notification_enabled: true,
        status: true,
        deletable: true,
        api: new Api(this.props.token, acc_id),
        message: null,
        isSaving: false,
  
        acc_id:acc_id,
        base_url:"/producteur",
        admin_base_url:"/admin/producteur/"+acc_id,
        entreprise_base_url:"",
        consultant_base_url:"",
      }
    } else {
      this.state = {
        id: this.props.data.id,
        first_name :  "",
        last_name : "",
        username: "",
        password: "",
        password_confirm: "",
        email: "",
        email_confirm :  "",
        language_pref: "",
        access_code: "",
        email_notification_enabled: true,
        status: true,
        deletable: true,
        api: new Api(this.props.token, acc_id),
        message: null,
  
        acc_id:acc_id,
        base_url:"/producteur",
        admin_base_url:"/admin/producteur/"+acc_id,
        entreprise_base_url:"",
        consultant_base_url:"",
      }
    }

  }
 
  checkSameValue(val, confirmVal){
      
      if(val == confirmVal){
        return true;
      }else{
          return false;
      }
  }

  addOrUpdateSubmit(e){
    e.preventDefault();
    let errors = {};
    let confirmState = true;
    console.log("update *** ", this.props.type);

    if(!this.checkSameValue(this.state.email, this.state.email_confirm )){
        this.setState({
            message : "L'email et l'email de confirmation doivent être identiques"
        });
        confirmState = false;
    }
    if(!this.checkSameValue(this.state.password, this.state.password_confirm )){
        this.setState({
            message : "Le mot de passe et le mot de passe de confirmation doivent être identiques"
        });
        confirmState = false;
    }
    if (confirmState){
        this.setState({isSaving: true})
        if (this.props.type == "update") {
        console.log("data  new update type");
            this.updateAccount();

            // alert("Form submitted");
        } else  if (this.props.type == "create"){
        console.log("data  new addAccount type");
        this.addAccount();
            // alert("Form is not submitted");
        }
    }

};

addAccount(){
  const data = this.state;

  console.log("data  new addAccount start", data);
  const dataObject = {
    "username": data.email,
    "password": data.password,
    "email": data.email,
    "first_name": data.first_name,
    "last_name": data.last_name,
    "language_pref":  data.language_pref,
    "access_code": "Elinor987",
    "email_notification_enabled": true,
    "status": "active",
    "deletable": true,
    "lang": this.props.language,
}


  this.state.api
  .createNewUser(dataObject)
  .then(response => {
      console.log("data  new ", response);
      this.setState({
        message : response.data.message,
        isSaving: false,
      });
      setTimeout(window.location.reload(false),500);
  }
  ) 
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

};

updateAccount(){

  const data = this.state;

  console.log("data  new addAccount start", data);
  const dataObject = {
    "username": data.email,
    "password": data.password,
    "email": data.email,
    "first_name": data.first_name,
    "last_name": data.last_name,
    "language_pref": data.language_pref,
    "access_code": "Elinor987",
    "email_notification_enabled": true,
    "status": "active",
    "deletable": true,
    "lang": this.props.language,
}
 

  this.state.api
  .updateUser([this.state.id,dataObject])
  .then(response => {
      console.log("data  new ", response);
      this.setState({
        message : response.data.message,
        isSaving: false,
      });
      setTimeout(window.location.reload(false),500);
  }
  ) 
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

};


handleInputChage(e) {
  this.setState({
    [e.target.id]: e.target.value,
  })
}

render() {
    const translation = this.props.translation;
  return (
    <div class="modal fade" id={this.props.id} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modelSizeFullScreenDialog " role="document">
        <div class="modal-content modelSizeFullScreencontent">
          <div class="modal-header">
            <h5 className="modal-title textColor" id="exampleModalLabel">{translation.Add_Modify_user}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div className="row">
              <div className="col-md-9 col-lg-8 mx-auto">
                <form name="addUserform" onSubmit={this.addOrUpdateSubmit.bind(this)}>
                  <div className="form-label-group">
                    <strong htmlFor="inputEmail">{translation.First_Name}*</strong>
                    <input type="text" id="first_name" className="form-control" name='username' placeholder={translation.Enter_user_name} defaultValue={this.state.first_name}  onChange={this.handleInputChage.bind(this)} required autoFocus />
                  </div>
                  <div className="form-label-group">
                    <strong htmlFor="inputEmail">{translation.Name}*</strong>
                    <input type="text" id="last_name" className="form-control" name='username' placeholder={translation.Enter_user_first_name} defaultValue={this.state.last_name} onChange={this.handleInputChage.bind(this)} required />
                  </div>

               
                  <div class="form-label-group">
                    <strong htmlFor="inputEmail">{translation.Language}</strong>
                    <div>
                      <div class="input-group">
                        <select class="form-select form-control" id="language_pref" aria-label="Default select example" value={this.state.language_pref}  onChange={this.handleInputChage.bind(this)} >
                          <option value=""  disabled hidden>{translation.Choose_Language}</option>
                          <option value="FR">Francais</option>
                          <option value="EN">English</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  {/* <div className="form-label-group">
                    <strong htmlFor="inputEmail">Nom d'utilisateur</strong>
                    <input type="email" id="username" className="form-control" name='username' placeholder="Entrez le nom d'utilisateur" defaultValue={this.state.username} onChange={this.handleInputChage.bind(this)}  required />
                  </div> */}
                  <div className="form-label-group">
                    <strong htmlFor="inputEmail">{translation.Email}*</strong>
                    <input type="email" id="email" className="form-control" name='username' placeholder="Entrez le courriel de l'utilisateur" defaultValue={this.state.email} onChange={this.handleInputChage.bind(this)}  required />
                  </div>
                 
                  <div className="form-label-group">
                    <strong htmlFor="inputEmail">{translation.Email_Confirmation}*</strong>
                    <input type="email" id="email_confirm" className="form-control" name='email_confirm' placeholder="Entrez le nouveau le l'courriel" defaultValue={this.state.email_confirm} onChange={this.handleInputChage.bind(this)} required />
                  </div>
                  <div className="form-label-group">
                    <strong htmlFor="inputPassword">{translation.Password}*</strong>
                    <input type="password" id="password" className="form-control" placeholder="*******" name='password'  onChange={this.handleInputChage.bind(this)}  />
                  </div>
                  <div className="form-label-group">
                    <strong htmlFor="inputPassword">{translation.Password_Confirmation}*</strong>
                    <input type="password" id="password_confirm" className="form-control" placeholder="********" name='password_confirm'  onChange={this.handleInputChage.bind(this)}  />
                  </div>
               
                  <div class="vspace1em"></div>
                  <div class="container-fluid">
                    <div class="row">
                      <button type="submit" class="btn btn-primary ml-auto primaryTop mobile_button">{translation.Save}</button>
                    </div>
                  </div>
                    {
                        this.state.isSaving ? (
                                <div className="text-center"><img
                                    src={loading}/></div>
                            ) : null
                    }
                  <div class="vspace1em"></div>
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
    </div>
  );
}

}

export default connect(mapStateToProps, null)(withLanguageHook(Modal));