import React from 'react'
import editIconInButton from "../../public/img/edit_icon_in_button.png"
import userIconInButton from "../../public/img/user_icon_in_button.png"
import DatePic from "./DatePic"
import EditForm from "../EditForms/Edit_Form"
import Api from "../../helper/api";

import { connect, useSelector, useDispatch } from 'react-redux';
import useTranslation from "../customHooks/translations";


const mapStateToProps = state => {
    let token = state.token;
    let userRole = state.userRole;
    let isLogged = state.isLogged;
    return {token, userRole, isLogged}
}

function withLanguageHook(Component) {
  return function WrappedComponent(props) {
      const translation = useTranslation();
      return <Component {...props} translation={translation} />;
  }
}



var createClass = require('create-react-class');

var FormMobile = createClass({


  onFormSubmit: function (e) {
    e.preventDefault();
    console.log(this.state.startDate)
  },

  getInitialState: function () {
    console.log("producerlist*****", this.props.producerlist);
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
    console.log("userIsEditing**", userIsEditing);
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
  render: function () {
    if (this.props.value.id!=this.state.id) {
      this.setState(this.assignStates(
          this.props.value, 
          this.props.token
          )
        );
    }
    
    var userIsEditing = this.state.userIsEditing
    let editForm_true;
    let editForm_false;
    let assignationdentreprise = "";

    if(this.props.type != "entreprise"){
      let element = this.props.entrepriseList[this.state.value.owned_by]; 
    
      if(element){
        assignationdentreprise = element.name_en;
      }
   }

    if (userIsEditing) {
      console.log("producerlist*****producerlist***2", this.props.producerlist);
      editForm_true = (<div class="col-sm-12" style={{ marginTop: '20px' }}>
      <EditForm valueNew= {this.state.value} isEdit={true}  assignationdentreprise = {assignationdentreprise} type= {this.props.type} entrepriseList={this.props.entrepriseList} producerlist={this.props.producerlist} categoryList ={this.props.categoryList} ></EditForm>
    </div> );
    } else {
      console.log("producerlist*****producerlist***3", this.props.producerlist);
      editForm_false = (<div class="col-sm-12" style={{ marginTop: '20px' }}>
      <EditForm valueNew= {this.state.value} isEdit={false} ownCategory = {this.props.ownCategory} assignationdentreprise = {assignationdentreprise} producerlist={this.props.producerlist} type= {this.props.type}  ></EditForm>
      </div> )
    }
    const translation = this.props.translation;
    return (
      <div>
        <div class="row">
          <div class="col-xs-12 ">

          
        { this.state.userIsEditing ? editForm_true : editForm_false }
           
          </div>
        </div>
        <div class="col-md-4 col-lg-3 col-sm-12 col-xs-12" >
          <button type="button" class="btn btn-primary primaryTop mobile_button" onClick={this.toggleEditing}>
            <img src={editIconInButton} style={{ margin: '0px' }} />
            <span class="btn-label"></span> {translation.Edit_profile}
                                                        </button>
        </div>
        <div class="col-md-4 col-lg-3 col-sm-12 col-xs-12" >
          <button type="button" class="btn btn-primary primaryTop mobile_button"
          >
            <img src={userIconInButton} style={{ margin: '0px' }} />
            <span class="btn-label"></span> {translation.Log_in_to_your_account}
                                                        </button>
        </div>
        <div class="col-md-4 col-lg-3 col-sm-12 col-xs-12 " >
          <button type="button" class="btn btn-outline-primary primaryTop mobile_button"data-toggle="modal" data-target={"#exampleModal" + this.state.id}>{translation.Delete_profile}</button>
        </div>

        <div class="modal fade" id={"exampleModal" + this.state.id} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
    )




  }
})

export default connect(mapStateToProps, null)(withLanguageHook(FormMobile));

