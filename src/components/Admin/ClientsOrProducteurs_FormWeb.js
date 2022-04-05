import React from 'react'
import editIconInButton from "../../public/img/edit_icon_in_button.png"
import userIconInButton from "../../public/img/user_icon_in_button.png"
import DatePic from "./DatePic"
import EditForm from "../EditForms/Edit_Form"

import Api from "../../helper/api.js";
import { connect, useSelector, useDispatch } from 'react-redux';
import useTranslation from "../customHooks/translations";


const mapStateToProps = state => {
  let token = state.token;
  let userRole = state.userRole;
  let isLogged = state.isLogged;
  return { token, userRole, isLogged }
}

function withLanguageHook(Component) {
  return function WrappedComponent(props) {
    const translation = useTranslation();
    return <Component {...props} translation={translation} />;
  }
}

var createClass = require('create-react-class');
var DropDown = createClass({
  render: function () {

    var text = this.props.text || 'Nothing yet'
    return (
      <div class="input-group">
        <input type="text" class="form-control" aria-label="Text input with dropdown button" placeholder="XL KEY"></input>
        <div class="input-group-append">
          <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
          <div class="dropdown-menu">
            <a class="dropdown-item" href="#">Another1</a>
            <a class="dropdown-item" href="#">Another2</a>
            <a class="dropdown-item" href="#">Something else here</a>



          </div>
        </div>
      </div>
    )
  }
})

var Form = createClass({


  onFormSubmit: function (e) {
    e.preventDefault();

  },

  getInitialState: function () {
    return this.assignStates(
      this.props.value,
      this.props.token
    );
  },

  assignStates: function (value, token) {
    let initial_values = {
      value: value,
      id: value.id,
      userIsEditing: false,
      api: new Api(token)
    }
    return initial_values;
  },

  toggleEditing: function () {
    var userIsEditing = !this.state.userIsEditing
    this.setState({
      userIsEditing: userIsEditing
    })

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

  DeleteAccount() {

    this.state.api
      .deleteAccounts(this.state.id)
      .then(response => {
        this.setState({ message: response.data.message });
        setTimeout(window.location.reload(false), 500);
        // window.location.reload(false);
      })
      .catch(err => {
        if (err.response && err.response.status == 401) {
          this.props.history.push('/');
        }
      });

  },


  saveInput: function (input) {
    this.setState({
      favoriteFlavor: input
    })
  },

  render: function () {
    if (this.props.value.id != this.state.id) {
      this.setState(this.assignStates(
        this.props.value,
        this.props.token
      )
      );
    }

    let items = [];
    var userIsEditing = this.state.userIsEditing
    let editForm_true;
    let editForm_false;
    let assignationdentreprise;
    let element = this.props.entrepriseList[this.state.value.owned_by];


    if (element) {
      assignationdentreprise = element.name_en;
    }
    if (userIsEditing) {


      editForm_true = (<div class="col-sm-12" style={{ marginTop: '20px' }}>
        <EditForm valueNew={this.state.value} isEdit={true} assignationdentreprise={assignationdentreprise} entrepriseList={this.props.entrepriseList} type="product"></EditForm>
      </div>);


    } else {

      editForm_false = (<div class="col-sm-12" style={{ marginTop: '20px' }}>
        <EditForm valueNew={this.state.value} isEdit={false} assignationdentreprise={assignationdentreprise} type="product" ></EditForm>
      </div>)

    }
    const translation = this.props.translation;
    return (
      <div style={{ marginLeft: '20px' }}>
        <div class="row" style={{ margin: '2px' }}>
          <div class="col-md-4 col-lg-3 col-sm-4 col-xs-12" >
            <button type="button" class="btn btn-primary primaryTop" onClick={this.toggleEditing}>
              <img src={editIconInButton} style={{ margin: '0px' }} />
              <span class="btn-label"></span> {translation.Edit_profile}
            </button>
          </div>

          <div class="col-md-4 col-lg-3 col-sm-4 col-xs-12" >
            <button type="button" class="btn btn-primary primaryTop "
              // eslint-disable-next-line no-restricted-globals
              onClick={() => (location.href = "/admin/producteur/" + this.state.id + "/dashboard")}>
              <img src={userIconInButton} style={{ margin: '0px' }} />
              <span class="btn-label"></span> {translation.Log_in_to_your_account}
            </button>
          </div>

          <div class="col-md-4 col-lg-3 col-sm-4 col-xs-12" >
            <button type="button" class="btn btn-outline-primary primaryTop mobile_button" data-toggle="modal" data-target={"#exampleModalPro" + this.state.id}>{translation.Delete_profile}</button>
          </div>

          <div class="modal fade" id={"exampleModalPro" + this.state.id} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document" style={{ maxWidth: '100%' }}>
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLabel">{translation.Do_you_want_to_delete}</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-primary" onClick={this.DeleteAccount} style={{ width: '40%' }}>{translation.Yes}</button>
                  <button type="button" class="btn btn-secondary" data-dismiss="modal" style={{ width: '40%' }} >{translation.Close}</button>
                  <br />
                  <label class="error-font-style" >{this.state.message}</label>
                </div>
              </div>
            </div>
          </div>
        </div>


        {this.state.userIsEditing ? editForm_true : editForm_false}
      </div>
    )

  }
})

export default connect(mapStateToProps, null)(withLanguageHook(Form));
