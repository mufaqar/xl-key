import React from 'react'
import editIconInButton from "../../../public/img/edit_icon_in_button.png"
import userIconInButton from "../../../public/img/user_icon_in_button.png"
import closeIcon from "../../../public/img/close_btn_icon.png"
import DatePic from "../../../components/enterprise/DatePic"
import Api from "../../../helper/api";
import UserEditForm from "../../../components/EditForms/user_EditForms"
import useTranslation from "../../../components/customHooks/translations";


// import React from 'react'
// import editIconInButton from "../../../public/img/edit_icon_in_button.png"
// import userIconInButton from "../../../public/img/user_icon_in_button.png"
// import closeIcon from "../../../public/img/close_btn_icon.png";
// var createClass = require('create-react-class');

import { connect, useSelector, useDispatch } from 'react-redux';


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
    return this.assignStates(
      this.props.value, 
      this.props.token, 
      this.props.acc_id
      );
  },

  assignStates: function(value, token, acc_id) {
    let initial_values = {
      value: value,
      id: value.id,
      userIsEditing: false,
      api: new Api(token, acc_id)
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

      window.location.reload(false);
      
    })
    .catch(err => {
      if(err.response.status == 401){
        this.props.history.push('/');
      }
    });
    

  },
  render: function () {

    if ((this.props.value.id!=this.state.id)  || (this.props.acc_id != this.state.acc_id)){
      this.setState(this.assignStates(
          this.props.value, 
          this.props.token,
          this.props.acc_id
          )
        );
    }
    
    var userIsEditing = this.state.userIsEditing
    let editForm_true;
    let editForm_false;
    if (userIsEditing) {
      editForm_true = (<div class="col-sm-12" style={{ marginTop: '20px' }}>
      <UserEditForm acc_id={this.state.acc_id} valueNew= {this.state.value} isEdit={true} type= {this.props.type} entrepriseList={this.props.entrepriseList} categoryList ={this.props.categoryList} ></UserEditForm>
    </div> );
    } else {
     
      editForm_false = (<div class="col-sm-12" style={{ marginTop: '20px' }}>
      <UserEditForm acc_id={this.state.acc_id} valueNew= {this.state.value} isEdit={false} type= {this.props.type}  ></UserEditForm>
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




// import React from 'react'
// import editIconInButton from "../../../public/img/edit_icon_in_button.png"
// import userIconInButton from "../../../public/img/user_icon_in_button.png"
// import closeIcon from "../../../public/img/close_btn_icon.png";
// var createClass = require('create-react-class');

// var TextInput = createClass({
//     handleInput: function () {
//         var input = React.findDOMNode(this.refs.userInput)
//         this.props.saveInput(input.value)

//         //input.value = ''
//     },
//     render: function () {
//         //var label = this.props.label
//         return (
//             <div class="form-group">

//                 <input
//                     type="text"
//                     class="form-control"
//                     id="input-{ label }"
//                     ref="userInput"
//                 />
//                 {/* <button onClick={ this.handleInput }>Save</button> */}
//             </div>
//         )
//     }
// })

// var DropDown = createClass({
//     render: function () {

//         var text = this.props.text || 'Nothing yet'
//         return (
//             <div class="input-group">
//                 <input type="text" class="form-control" aria-label="Text input with dropdown button"
//                        placeholder="XL KEY"></input>
//                 <div class="input-group-append">
//                     <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown"
//                             aria-haspopup="true" aria-expanded="false"></button>
//                     <div class="dropdown-menu">
//                         <a class="dropdown-item" href="#">Another1</a>
//                         <a class="dropdown-item" href="#">Another2</a>
//                         <a class="dropdown-item" href="#">Something else here</a>


//                     </div>
//                 </div>
//             </div>
//             // <select class="form-select" aria-label="XL KEY" >
//             //                   <option selected></option>
//             //                   <option value="Another1">Another1</option>
//             //                   <option value="Another2">Another2</option>
//             //                   <option value="Another3">Another3</option>
//             //               </select>
//         )
//     }
// })

// var TextField = createClass({
//     render: function () {

//         var text = this.props.text || 'Nothing yet'
//         return (
//             <div>

//                 <p>{text}</p>
//             </div>
//         )
//     }
// })

// var FormMobile = createClass({


//     onFormSubmit: function (e) {
//         e.preventDefault();
//         console.log(this.state.startDate)
//     },

//     getInitialState: function () {
//         return {
//             userIsEditing: false,
//             Nom: 'Graham',
//             Prenom: 'Soria',
//             Téléphone: '438 924 7638',
//             Courriel: 'soria.graham@gmail.com',
//             Assignationdentreprise: 'XL KEY',

//             Nom1: 'Juan Esteban Sarmiento',
//             Adresse: '15 rue des Lila',
//             Ville: 'Québec',
//             Codepostal: 'K4D 1K3',
//             Province: 'Québec',
//             Pays: 'Canada',
//         }
//     },
//     toggleEditing: function () {
//         var userIsEditing = !this.state.userIsEditing
//         this.setState({
//             userIsEditing: userIsEditing
//         })

//     },
//     saveInput: function (input) {
//         this.setState({
//             favoriteFlavor: input
//         })
//     },
//     render: function () {
//         var userIsEditing = this.state.userIsEditing
//         let Nom;
//         let Prenom;
//         let Téléphone;
//         let Courriel;
//         let Assignationdentreprise;

//         let Nom1;
//         let Adresse;
//         let Ville;
//         let Codepostal;
//         let Province;
//         let Pays;
//         if (userIsEditing) {
//             Nom = <TextInput saveInput={this.saveInput}/>
//             Prenom = <TextInput saveInput={this.saveInput}/>
//             Téléphone = <TextInput saveInput={this.saveInput}/>
//             Courriel = <TextInput saveInput={this.saveInput}/>
//             Assignationdentreprise = <DropDown text={this.saveInput}/>

//             Nom1 = <TextInput saveInput={this.saveInput}/>
//             Adresse = <TextInput saveInput={this.saveInput}/>
//             Ville = <TextInput saveInput={this.saveInput}/>
//             Codepostal = <TextInput saveInput={this.saveInput}/>
//             Province = <TextInput saveInput={this.saveInput}/>
//             Pays = <TextInput saveInput={this.saveInput}/>
//         } else {
//             Nom = <TextField text={this.state.Nom}/>
//             Prenom = <TextField text={this.state.Prenom}/>
//             Téléphone = <TextField text={this.state.Téléphone}/>
//             Courriel = <TextField text={this.state.Courriel}/>
//             Assignationdentreprise = <TextField text={this.state.Assignationdentreprise}/>

//             Nom1 = <TextField text={this.state.Nom1}/>
//             Adresse = <TextField text={this.state.Adresse}/>
//             Ville = <TextField text={this.state.Ville}/>
//             Codepostal = <TextField text={this.state.Codepostal}/>
//             Province = <TextField text={this.state.Province}/>
//             Pays = <TextField text={this.state.Pays}/>
//         }
//         return (
//             <div>
//                 <div class="row">
//                     <div class="col-xs-12">

//                         <div className="d-flex align-items-end" style={{paddingLeft: '5px'}}>
//                             <strong htmlFor="inputEmail" style={{margin: '10px'}}>Statut: </strong>
//                             <label htmlFor="inputEmail" style={{margin: '10px'}}>Actif </label>
//                             <label class="switch" style={{margin: '10px'}}>
//                                 <input type="checkbox" class="primary"></input>
//                                 <span class="slider round"></span>
//                             </label>
//                             <label htmlFor="inputEmail" style={{margin: '10px'}}>Désactivé</label>
//                         </div>
//                     </div>
//                     <div class="container">
//                         <strong htmlFor="inputEmail" style={{margin: '10px', marginLeft: '0'}}>Information du contact
//                             principal</strong>
//                         <div className="form-label-group mb-2 mt-2">
//                             <input type="text" className="form-control update-fonts input-height"
//                                    placeholder="Nom"/>
//                         </div>
//                         <div className="form-label-group mb-2">
//                             <input type="text" className="form-control update-fonts input-height"
//                                    placeholder="Prénom"/>
//                         </div>
//                         <div className="form-label-group mb-2">
//                             <input type="text" className="form-control update-fonts input-height"
//                                    placeholder="Numéro de téléphone"/>
//                         </div>
//                         <div className="form-label-group mb-3">
//                             <input type="text" className="form-control update-fonts input-height"
//                                    placeholder="Courriel"/>
//                         </div>
//                         <div className="col-12 alert alert-secondary ml-0" role="alert">
//                             <div className="form-item-margin left ml-3 mt-2 mb-1 text-alignment">
//                                 <div className="row">CATÉGORIE</div>
//                             </div>
//                             <div className="form-label-group mb-3">
//                                 <div className="input-group ">
//                                     <input type="text" className="form-control"
//                                            aria-label="Text input with dropdown button"
//                                            placeholder="Agronome"></input>
//                                     <div className="input-group-append">
//                                         <button className="btn btn-outline-secondary dropdown-toggle"
//                                                 type="button" data-toggle="dropdown" aria-haspopup="true"
//                                                 aria-expanded="false"></button>
//                                         <div className="dropdown-menu">
//                                             <a className="dropdown-item" href="#">Agronome</a>
//                                             <a className="dropdown-item" href="#">Cat 1</a>
//                                             <a className="dropdown-item" href="#">Cat 2</a>
//                                             <a className="dropdown-item" href="#">Cat 3</a>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="col-12 alert alert-secondary ml-0" role="alert">
//                             <div className="form-item-margin left ml-3 mt-2 mb-1 text-alignment">
//                                 <div className="row">AJOUTER UN PRODUCTEUR</div>
//                             </div>
//                             <div className="form-label-group mb-3">
//                                 <div className="input-group ">
//                                     <input type="text" className="form-control"
//                                            aria-label="Text input with dropdown button"
//                                            placeholder="Producteur ABC"></input>
//                                     <div className="input-group-append">
//                                         <button className="btn btn-outline-secondary dropdown-toggle"
//                                                 type="button" data-toggle="dropdown" aria-haspopup="true"
//                                                 aria-expanded="false"></button>
//                                         <div className="dropdown-menu">
//                                             <a className="dropdown-item" href="#">Producteur ABC</a>
//                                             <a className="dropdown-item" href="#">Producteur ABCDEF</a>
//                                             <a className="dropdown-item" href="#">Producteur ABCDEFGHJ</a>
//                                             <a className="dropdown-item" href="#">Producteur QWE</a>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="col-12 row border mb-3 ml-0 mr-0 align-items-center">
//                             <div className="col-11 col-xs-10 pl-0 pr-0">
//                                 <label className="mb-0 ml-2">Producteur ABCD</label>
//                             </div>
//                             <div className="col-1 col-xs-2 pl-0 pr-0">
//                                 <div className="text-right">
//                                     <img src={closeIcon} className="img-responsive inline-block"
//                                          style={{margin: '16px 5px'}}
//                                          alt="Responsive image"/>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="col-12 row border mb-3 ml-0 mr-0 align-items-center">
//                             <div className="col-11 col-xs-10 pl-0 pr-0">
//                                 <label className="mb-0 ml-2">Producteur ABCDQWER</label>
//                             </div>
//                             <div className="col-1 col-xs-2 pl-0 pr-0">
//                                 <div className="text-right">
//                                     <img src={closeIcon} className="img-responsive inline-block"
//                                          style={{margin: '16px 5px'}}
//                                          alt="Responsive image"/>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="row float-right mb-3 mr-0">
//                             <button type="button" className="btn btn-primary" onClick={this.toggleEditing}>
//                                 <span className="btn-label">SAUVEGARDER</span>
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//                 <div class="col-xs-12">
//                     <button type="button" class="btn btn-primary primaryTop mobile_button" onClick={this.toggleEditing}>
//                         <img src={editIconInButton} style={{margin: '0px'}}/>
//                         <span class="btn-label"></span> Éditer le profil
//                     </button>
//                 </div>
//                 <div class="col-xs-12">
//                     <button type="button" class="btn btn-primary primaryTop mobile_button">
//                         <img src={userIconInButton} style={{margin: '0px'}}/>
//                         <span class="btn-label"></span> Se connecter au compte
//                     </button>
//                 </div>

//             </div>
//         )


//     }
// })

// export default FormMobile;
