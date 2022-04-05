import 'bootstrap/dist/css/bootstrap.css';
import './index.css'
import $ from 'jquery';
import Api from "../../../helper/api";
import React from 'react';

import { connect, useSelector, useDispatch } from 'react-redux';


const mapStateToProps = state => {
    let token = state.token;
    let userRole = state.userRole;
    let isLogged = state.isLogged;
    return {token, userRole, isLogged}
}


class Modal extends React.Component {

  constructor(props) {
    
    super(props)
    console.log("props 123456789", this.props.data.language_pref);
    this.state = {
      id: this.props.data.id,
      first_name :  this.props.data.first_name,
      last_name :  this.props.data.last_name,
      username: this.props.data.email,
      password: this.props.data.password,
      email: this.props.data.email,
      language_pref: this.props.data.language_pref,
      access_code: this.props.data.access_code,
      email_notification_enabled: true,
      status: true,
      deletable: true,
      api: new Api(this.props.token),
      message: null,

    }
  }
 

  addOrUpdateSubmit(e){
    e.preventDefault();
    let errors = {};
    console.log("update *** ", this.props.type);
   
    if (this.props.type == "update") {
      console.log("data  new update type");
        this.updateAccount();

        // alert("Form submitted");
    } else  if (this.props.type == "create"){
      console.log("data  new addAccount type");
      this.addAccount();
        // alert("Form is not submitted");
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
    "deletable": true
}


  this.state.api
  .createNewUser(dataObject)
  .then(response => {
      console.log("data  new ", response);
      this.setState({
        message : response.data.message
      });

      window.location.reload(false);
  }
  ) .catch(err => {

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
    "deletable": true
  }

  this.state.api
  .updateUser([data.id,dataObject])
  .then(response => {
      console.log("data  new ", response);
      this.setState({
        message : response.data.message
      });
      window.location.reload(false);
  }
  ) .catch(err => {
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

};


handleInputChage(e) {
  this.setState({
    [e.target.id]: e.target.value,
  })
}

render() {
  console.log(" data.language_pref,", this.state.language_pref);
  return (
    <div class="modal fade" id={this.props.id} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modelSizeFullScreenDialog " role="document">
        <div class="modal-content modelSizeFullScreencontent">
          <div class="modal-header">
            <h5 className="modal-title textColor" id="exampleModalLabel">Ajouter/Modifier un utilisateur</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div className="row">
              <div className="col-md-9 col-lg-8 mx-auto">
                <form name="addUserform" onSubmit={this.addOrUpdateSubmit.bind(this)}>
                  <div className="form-label-group">
                    <strong htmlFor="inputEmail">Prénom*</strong>
                    <input type="text" id="first_name" className="form-control" name='username'  defaultValue={this.state.first_name}  onChange={this.handleInputChage.bind(this)} required autoFocus />
                  </div>
                  <div className="form-label-group">
                    <strong htmlFor="inputEmail">Nom*</strong>
                    <input type="text" id="last_name" className="form-control" name='username'  defaultValue={this.state.last_name} onChange={this.handleInputChage.bind(this)} required />
                  </div>

                  <div class="form-label-group">
                    <strong htmlFor="inputEmail">Langue</strong>
                    <div>
                      <div class="input-group">                                     
                        <select class="form-select form-control" id="language_pref" aria-label="Default select example" value={this.props.type == "update"? this.props.data.language_pref : ""}   onChange={this.handleInputChage.bind(this)} >         
                        <option value="" disabled hidden>Choisir la langue</option>
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
                    <strong htmlFor="inputEmail">Courriel*</strong>
                    <input type="email" id="email" className="form-control" name='username'  defaultValue={this.state.email} onChange={this.handleInputChage.bind(this)}  required />
                  </div>
                 
                  <div className="form-label-group">
                    <strong htmlFor="inputEmail">Confirmation de courriel*</strong>
                    <input type="email" id="email_confirm" className="form-control" name='username'  defaultValue={this.state.email} onChange={this.handleInputChage.bind(this)} required />
                  </div>
                  <div className="form-label-group">
                    <strong htmlFor="inputPassword">Mot de passe*</strong>
                    <input type="password" id="password" className="form-control" placeholder="*******" name='password'  onChange={this.handleInputChage.bind(this)}  />
                  </div>
                  <div className="form-label-group">
                    <strong htmlFor="inputPassword">Confirmation de mot de passe*</strong>
                    <input type="password" id="password_confirm" className="form-control" placeholder="********" name='password'  onChange={this.handleInputChage.bind(this)}  />
                  </div>
               
                  <div class="vspace1em"></div>
                  <div class="container-fluid">
                    <div class="row">
                      <button type="submit" class="btn btn-primary ml-auto primaryTop mobile_button">Enregistrer</button>
                    </div>
                  </div>
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

export default connect(mapStateToProps, null)(Modal);