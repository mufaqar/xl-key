import React from 'react'
import editIconInButton from "../../public/img/edit_icon_in_button.png"
import userIconInButton from "../../public/img/user_icon_in_button.png"
import DatePic from "./DatePic"
import Api from "../../helper/api";
import EditForm from "../EditForms/Edit_Form"
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

var TextInput = createClass({
  handleInput: function () {
    var input = React.findDOMNode(this.refs.userInput)
    this.props.saveInput(input.value)

    //input.value = ''
  },
  render: function () {
    //var label = this.props.label
    return (
      <div class="form-group">

        <input
          type="text"
          class="form-control"
          id="input-{ label }"
          ref="userInput"
        />
        {/* <button onClick={ this.handleInput }>Save</button> */}
      </div>
    )
  }
})

var TextField = createClass({
  render: function () {

    var text = this.props.text || 'Nothing yet'
    return (
      <div style={{ backgroundColor: 'white' }}>

        <p>{text}</p>
      </div>
    )
  }
})

var Form = createClass({

  onFormSubmit: function (e) {
    e.preventDefault();
    this.updateAccount();
  },
  
  getInitialState: function () {
    return this.assignStates(
      this.props.value, 
      this.props.token
      );
  },

  assignStates: function(value, token) {
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
  saveInput: function (input) {
    this.setState({
      favoriteFlavor: input
    })
  },

  DeleteAccount(){

    this.state.api
    .deleteAccounts(this.state.id)
    .then(response => {
      console.log("data  new delete** ", response);
      this.setState({ message: response.data.message });
      setTimeout(window.location.reload(false),500);
      // window.location.reload(false);
    })
    .catch(err => {
      if(err.response.status == 401){
        this.props.history.push('/');
      }
    });
  
  },

  handleChange(field, e) {
    let fields = this.state.fields;
    fields[field] = e.target.value;
    console.log("email_notification_enabled ***", fields[field])
    this.setState({ fields });
  },


  render: function () {
    
    if (this.props.value.id!=this.state.id) {
      this.setState(this.assignStates(
          this.props.value, 
          this.props.token
          )
        );
    }

    var userIsEditing = this.state.userIsEditing
  
    let items = [];

    var userIsEditing = this.state.userIsEditing
    let editForm_true;
    let editForm_false;
    let assignationdentreprise;
    let element = this.props.entrepriseList[this.state.value.owned_by]; 
    
    if(element){
      assignationdentreprise = element.name_en;
    }

  
    if (userIsEditing) { 
   
      editForm_true = (<div class="col-sm-12" style={{ marginTop: '20px' }}>
        <EditForm valueNew= {this.state.value} ownCategory = {this.props.ownCategory} isEdit={true}   assignationdentreprise = {assignationdentreprise}  type= "consultant" entrepriseList={this.props.entrepriseList} categoryList ={this.props.categoryList} ></EditForm>
      </div> );


    } else {
  
      editForm_false = (<div class="col-sm-12" style={{ marginTop: '20px' }}>
      <EditForm valueNew= {this.state.value} ownCategory = {this.props.ownCategory}  isEdit={false}  assignationdentreprise = {assignationdentreprise}  type= "consultant"></EditForm>
      </div> )

    }

    console.log("ownCategory**",this.props.ownCategory);
    console.log("assignationdentreprise**",assignationdentreprise);
    
    const width100percent = "100%";
    const translation = this.props.translation;
    return (
      <div>
        <div class="row" style={{ margin: '10px' }}>
          <div class="col-md-4 col-lg-3 col-sm-4 col-xs-12" >
            <button type="button" class="btn btn-primary primaryTop" onClick={this.toggleEditing}>
              <img src={editIconInButton} style={{ margin: '0px' }} />
              <span class="btn-label"></span> {translation.Edit_profile}
            </button>
          </div>

          <div class="col-md-4 col-lg-3 col-sm-4 col-xs-12" >
            <button type="button" class="btn btn-primary primaryTop "
                 // eslint-disable-next-line no-restricted-globals
                    onClick={() => (location.href="/admin/consultant/" + this.state.id + "/dashboard")}>
              <img src={userIconInButton} style={{ margin: '0px' }} />
              <span class="btn-label"></span> {translation.Log_in_to_your_account}
            </button>
          </div>




          <div class="col-md-4 col-lg-3 col-sm-4 col-xs-12" >
          <button type="button" class="btn btn-outline-primary primaryTop mobile_button"data-toggle="modal" data-target={"#exampleModalWeb" + this.state.id}>{translation.Delete_profile}</button>
          </div>

          <div class="modal fade" id={"exampleModalWeb" + this.state.id} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document" style={{maxWidth:'100%'}}>
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLabel">{translation.Do_you_want_to_delete}</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-primary" onClick={this.DeleteAccount} style={{width:'40%'}}>{translation.Yes}</button>
                  <button type="button" class="btn btn-secondary" data-dismiss="modal" style={{width:'40%'}} >{translation.Close}</button>
                  <br/>
                  <label class="error-font-style" >{this.state.message}</label>
                </div>
              </div>
            </div>
          </div>

        </div>


        { this.state.userIsEditing ? editForm_true : editForm_false }


      </div>

    )

  }
})

export default connect(mapStateToProps, null)(withLanguageHook(Form));
