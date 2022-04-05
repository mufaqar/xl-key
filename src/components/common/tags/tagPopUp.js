import 'bootstrap/dist/css/bootstrap.css';
import React from 'react'
import '../settingPopUp.css';
import $ from 'jquery';
import Api from "../../../helper/notes-api";

import { connect, useSelector, useDispatch } from 'react-redux';
import useTranslation from "../../customHooks/translations";
import getLanguage from "../../customHooks/get-language";


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

    if (this.props.type == "update") {
      this.state = {

        id: this.props.data.id,
        name_en :  this.props.data.name_en,
        name_fr :  this.props.data.name_fr,
        status: this.props.data.status,
        api: new Api(this.props.token),
        message: null,
        category: this.props.category,
        title: this.props.title,
        categoryId: this.props.categoryId
        
      }
    } else {
      this.state = {
        id: this.props.data.id,
        name_en :  "",
        name_fr : "",
        status: "",
        api: new Api(this.props.token),
        message: null,
        category: this.props.category,
        title: this.props.title,
        categoryId: this.props.categoryId
  
      }
    }

    console.log("category_id ", this.props.data.category_id);

  }
 

  addOrUpdateSubmit(e){
    e.preventDefault();
   
    if (this.props.type == "update") {
    console.log("data  new update type");
        this.updateAccount();

        // alert("Form submitted");
    } else  if (this.props.type == "create"){
    console.log("data  new addAccount type");
    this.createNewOne();
        // alert("Form is not submitted");
    }
  
};

createNewOne(){
  const dataNew = this.state;

  console.log("data  new addAccount start", dataNew);
  

 if(this.state.category == "categoryTags"){

  const dataObject = {
    "name_en": dataNew.name_en,
    "name_fr": dataNew.name_fr,
    "lang": this.props.language

  }

    this.state.api
    .createNotesTagCategories(dataObject)
    .then(response => {
        console.log("data  new ", response);
        this.setState({
          message : response.data.message
        });
        setTimeout(window.location.reload(false),500);
    }
    ) 
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

  }else{
    
    const dataObject = {
      "name_en": dataNew.name_en,
      "name_fr": dataNew.name_fr,
      "category_id": dataNew.categoryId,
        "lang": this.props.language
  
    }

    console.log("data  new  category_id ", dataNew.category_id);
    this.state.api
    .createNotesTags(dataObject)
    .then(response => {
        console.log("data  new  category_id ", response);
        this.setState({
          message : response.data.message
        });
        setTimeout(window.location.reload(false),500);
    }
    ) 
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
  
};

updateAccount(){

  const dataNew = this.state;

  console.log("data  new addAccount start", dataNew);

 
if(this.state.category == "categoryTags"){

  const dataObject = {
    "name_en": dataNew.name_en,
    "name_fr": dataNew.name_fr,
    "lang": this.props.language,
    "status": "active"

  }
  
  this.state.api
  .updateNotesTagsCategories([this.state.id,dataObject])
  .then(response => {
      console.log("data  new ", response);
      this.setState({
        message : response.data.message
      });
      setTimeout(window.location.reload(false),500);
  }
  ) 
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
}else{

  const dataObject = {
    "name_en": dataNew.name_en,
    "name_fr": dataNew.name_fr,
    "status": "active",
    "category_id": dataNew.categoryId,
    "lang": this.props.language

  }


  this.state.api
  .updateNotesTags([this.state.id,dataObject])
  .then(response => {
      console.log("data  new ", response);
      this.setState({
        message : response.data.message
      });
      setTimeout(window.location.reload(false),500);
  }
  ) 
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
            <h5 className="modal-title textColor" id="exampleModalLabel">
                {this.state.title === "Ajouter une catégorie de tags" ?
                    translation.Add_a_tag_category : this.state.title === "Ajouter un tag" ?
                        translation.Add_a_tag : this.state.title === "Mise à jour d'une catégorie de tags" ?
                            translation.Updating_a_tag_category : this.state.title === "Renommer la catégorie" ?
                                translation.Rename_category : this.state.title}
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div className="row">
              <div className="col-md-9 col-lg-8 mx-auto">
                <form name="addUserform" onSubmit={this.addOrUpdateSubmit.bind(this)}>
                  <div className="form-group row">
                    <strong htmlFor="inputEmail">Name (EN)*</strong>
                    <input type="text" id="name_en" className="form-control" name='name_en'  defaultValue={this.state.name_en}  onChange={this.handleInputChage.bind(this)} required autoFocus />
                  </div>
                  <div className="form-group row">
                    <strong htmlFor="inputEmail">Nom (FR)*</strong>
                    <input type="text" id="name_fr" className="form-control" name='name_fr'  defaultValue={this.state.name_fr} onChange={this.handleInputChage.bind(this)} required />
                  </div>

                  <div class="vspace1em"></div>
                  <div class="container-fluid">
                    <div class="row">
                      <button type="submit" class="btn btn-primary ml-auto primaryTop mobile_button">{translation.Submit}</button>
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

export default connect(mapStateToProps, null)(withLanguageHook(Modal));