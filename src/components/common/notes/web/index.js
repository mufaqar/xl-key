import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import fuicon from "../../../../public/img/fileuploadicon.png";
import fuclose from "../../../../public/img/fileuploadclose.png";
import Notes from "../../../../public/img/NotesModel.svg";
import Notespredifine from "../../../../public/img/NotesCopy.svg";
import "./index.css"
import Api from "../../../../helper/notes-api";
import { connect, useSelector, useDispatch } from 'react-redux';
import React, { Component } from "react";
import ReactDOM from "react-dom";
import useTranslation from "../../../../components/customHooks/translations";
import Config from "../../../../config/config";
import getLanguage from "../../../customHooks/get-language";
import category from "../../category/category";
import Multiselect from "multiselect-react-dropdown";

const mapStateToProps = state => {
  let token = state.token;
  let userRole = state.userRole;
  let isLogged = state.isLogged;
  return { token, userRole, isLogged }
}

var createClass = require('create-react-class');

function withLanguageHook(Component) {
  return function WrappedComponent(props) {
      const translation = useTranslation();
      const language = getLanguage();
      return <Component {...props} translation={translation} language={language} />;
  }
}


var createNote = createClass({

  getInitialState: function () {
    return this.assignStates(
      this.props.token,
      this.props.pageId,
      this.props.folderId,
      this.props.tagCategories,
      this.props.type,
      this.props.sites,
      this.props.categories,
      this.props.noteQuizzes,
      this.props.acc_id,
      this.props.access_level,
      this.props.access_key
    );
  },

  assignStates: function (token, pageId, folderId, tagCategories, type, sites, categories, noteQuizzes, acc_id, access_level, access_key) {
    let fields = [];
    fields["title"] = "";
    fields["body"] = "";

    console.log("folderId",folderId)

    let initial_values = {
      imageUrl: this.getQueryVariable('image_url'),
      pageId: pageId,
      folderId: folderId,
      fields: fields,
      api: new Api(token, acc_id, access_level, access_key),
      tagCategories: tagCategories,
      message: "",
      selectedTags: [],
      selectedSites: [],
      selectedFields: [],
      selectedCategories: [],
      selectedFileName: null,
      selectedMoreFiles: [],
      selectedMoreFilesNames: [],
      type: type,
      sites: sites,
      categories: categories,
      noteQuizzes: noteQuizzes,
      quizzeId: null,
      quizzObject: null,
      quizzFields: [],
      quizzId: [],
      acc_id: acc_id,
      access_level: access_level,
      access_key: access_key
    }

    return initial_values;

  },
  getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    //console.log(query)//"app=article&act=news_content&aid=160990"
    var vars = query.split("&");
    //console.log(vars) //[ 'app=article', 'act=news_content', 'aid=160990' ]
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      //console.log(pair)//[ 'app', 'article' ][ 'act', 'news_content' ][ 'aid', '160990' ]
      if (pair[0] == variable) {
        return pair[1];
      }
    }
    return (false);
  },

  handleChange(field, e) {
    let fields = this.state.fields;
    fields[field] = e.target.value;
    this.setState({ fields });
  },

  handleQuizz(field, e) {
    let quizzFields = this.state.quizzFields;
    let fieldName = "answer_fr_" + e.target.id
    quizzFields[Number(e.target.id)] =
    {
      "name": fieldName,
      "value": e.target.value
    }

    this.setState({ quizzFields });
  },


  addTags(e) {
    let id = e.target.id;
    let selectedTags = this.state.selectedTags;
    if (selectedTags.includes(id)) {
      var index = selectedTags.indexOf(id)
      selectedTags.splice(index, 1);
    } else {
      selectedTags.push(id);
    }
    this.setState({
      selectedTags: selectedTags
    })

  },

  addSites(e) {
    let id = e.target.id;
    let selectedSites = this.state.selectedSites;
    if (selectedSites.includes(id)) {
      var index = selectedSites.indexOf(id)
      selectedSites.splice(index, 1);
    } else {
      selectedSites.push(id);
    }
    this.setState({
      selectedSites: selectedSites
    })

  },

  addFields(e) {
    let id = e.target.id;
    let selectedFields = this.state.selectedFields;
    if (selectedFields.includes(id)) {
      var index = selectedFields.indexOf(id)
      selectedFields.splice(index, 1);
    } else {
      selectedFields.push(id);
    }
    this.setState({
      selectedFields: selectedFields
    })

  },

  // handleCategories(e) {
  //   const category = e.target.value;
  //   this.setState({selectedCategories: category});
  // },

  createNote() {
    const data = this.state.fields;

    let formData = new FormData();
    let tags = this.state.selectedTags.join(',');
    let sites = this.state.selectedSites.join(',');
    let fields = this.state.selectedFields.join(',');

    formData.append('title_en', data.title);
    formData.append('title_fr', data.title);
    formData.append('body_en', data.body);
    formData.append('body_fr', data.body);
    formData.append('status', "active");
    formData.append('page_id', this.props.pageId);
    formData.append('folder_id', this.props.folderId);
    formData.append('file_en', this.state.selectedFile);
    formData.append('file_fr', this.state.selectedFile);
    formData.append('file_url_en', this.state.imageUrl);
    formData.append('file_url_fr', this.state.imageUrl);
    formData.append('tags', tags);
    formData.append('sites', sites);
    formData.append('fields', fields);
    formData.append('categories', this.state.selectedCategories);

    if (this.state.selectedMoreFiles && this.state.selectedMoreFiles[0]) {
      let selectedMoreFiles = this.state.selectedMoreFiles
      for (let i = 0; i < selectedMoreFiles.length; i++) {
        formData.append('etc_images', this.state.selectedMoreFiles[i]);
      }
    }

    this.state.api
      .createNote(formData)
      .then(response => {
        console.log("data  new ", response);
        this.setState({
          message: response.data.message
        });
        let url = window.location.search;
        let query = window.location.search.substring(1);
        url = url.replace(query,'');
        window.location.href = url;
        //window.location.reload(false);
      }
      ).catch(err => {

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


  createPredefineNote() {
    const data = this.state.fields;
    let formData = new FormData();
    let tags = this.state.selectedTags.join(',');
    let sites = this.state.selectedSites.join(',');
    let fields = this.state.selectedFields.join(',');
    let quizzId = this.state.quizzId.join(',');

    formData.append('title_en', data.title);
    formData.append('title_fr', data.title);
    formData.append('body_en', data.body);
    formData.append('body_fr', data.body);
    formData.append('status', "active");
    formData.append('page_id', this.props.pageId);
    formData.append('folder_id', this.props.folderId);
    formData.append('file_en', this.state.selectedFile);
    formData.append('file_fr', this.state.selectedFile);
    formData.append('file_url_en', this.state.imageUrl);
    formData.append('file_url_fr', this.state.imageUrl);
    formData.append('tags', tags);
    formData.append('sites', sites);
    formData.append('fields', fields);
    formData.append('predefined_id', this.state.quizzeId);
    formData.append('quizes', quizzId);
    formData.append('categories', this.state.selectedCategories);

    (this.state.quizzFields).forEach(quizz => {
      formData.append(quizz.name, quizz.value);
    });

    if (this.state.selectedMoreFiles && this.state.selectedMoreFiles[0]) {
      let selectedMoreFiles = this.state.selectedMoreFiles
      for (let i = 0; i < selectedMoreFiles.length; i++) {
        formData.append('etc_images', this.state.selectedMoreFiles[i]);
      }
    }

    this.state.api
      .createNote(formData)
      .then(response => {
        console.log("data  new ", response);
        this.setState({
          message: response.data.message
        });
        let url = window.location.search;
        let query = window.location.search.substring(1);
        url = url.replace(query,'');
        window.location.href = url;
        //window.location.reload(false);
      }
      ).catch(err => {

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


  fileSelectedHandler(event) {
    console.log(event.target.files);

    if (event.target.files && event.target.files[0]) {
      this.setState({
        selectedFile: event.target.files[0],
        selectedFileName: event.target.files[0].name
      }, () => {
        var selectedFile = event.target.files[0];
        const fileType = selectedFile['type'];
        const validImageTypes = ['image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/webp', 'image/tiff'];
        if (validImageTypes.includes(fileType)) {
          var reader = new FileReader();
          var imgtag = document.getElementById("noteImage");
          imgtag.title = selectedFile.name;
          reader.onload = function (event) {
            imgtag.src = event.target.result;
          };
          reader.readAsDataURL(selectedFile);
        }
      });
    }
  },

  removeSelectedImage() {
    this.setState({selectedFileName: null});
    document.getElementById("noteImage").src="";

  },


  moreFileSelectedHandler(event) {
    console.log(event.target.files);
    if (event.target.files && event.target.files[0]) {
      let files = this.state.selectedMoreFiles;
      let filesnames = this.state.selectedMoreFilesNames;
      let items = event.target.files;
      for (let i = 0; i < items.length; i++) {
        files.push(event.target.files[i]);
        filesnames.push(event.target.files[i].name);
        // files.push({
        //   selectedFile: event.target.files[i],
        //   selectedMoreFileName: event.target.files[i].name
        // })
      }
      this.setState({selectedMoreFiles: files});
      this.setState({selectedMoreFilesNames: filesnames});
    }
  },

  moreRemoveSelectedImage(i) {
    let selectedMoreFiles = this.state.selectedMoreFiles;
    let selectedMoreFilesNames = this.state.selectedMoreFilesNames;
    selectedMoreFiles.splice(i, 1);
    selectedMoreFilesNames.splice(i, 1);
    console.log(selectedMoreFilesNames);
    this.setState({selectedMoreFiles: selectedMoreFiles});
    this.setState({selectedMoreFilesNames: selectedMoreFilesNames});
  },

  getID(e) {
    let quizzeId = e.target.value;
    let quizzId = [];
    this.setState({
      quizzeId: quizzeId,
      quizzFields: [],
      quizzId: []
    })
    let n = 0;
    (this.props.noteQuizzes).forEach(element => {
      if (element.id == quizzeId) {
        this.setState({
          quizzObject: element
        })
        if (element.quizes) {
          (element.quizes).forEach(quiz_int => {
            quizzId.push(quiz_int.id);
          })
          this.setState({
            quizzId: quizzId
          })
        }
      }
      n++;
    });
  },

  closeModal () {
    this.setState({
      imageUrl: ""
    });
    let url = window.location.search;
    let query = window.location.search.substring(1);
    url = url.replace(query,'');
    window.location.href = url;
  },

  onSelectCategories(selectedList, selectedItem) {
    let selectedCategories = []
    selectedList.forEach(item => {
      selectedCategories.push(item.id)
    });
    let categories = selectedCategories.join(',');
    this.setState({selectedCategories: categories},()=>{
      console.log(this.state.selectedCategories);
    });
  },

  onRemove(selectedList, removedItem) {
    this.onSelectCategories(selectedList);
  },

  render: function () {
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    console.log(this.state.imageUrl);
    console.log(this.state.selectedFile);
    console.log(this.state.selectedMoreFiles);
    const { selectedTags, type, quizzObject, quizzeId, selectedFields, selectedSites } = this.state;
    const translation = this.props.translation;
    const language = this.props.language;
    console.log("12345",language);
    const isFrench = language == "FR";
    let showimportant = "";
    if (this.state.imageUrl && this.state.imageUrl!="") {
      showimportant = " showimportant ";
    }
    let multiselectname = isFrench ? "name_fr" : "name_en";
    console.log("folderId6",this.state.folderId);

    if (this.props.pageId != this.state.pageId ||
      this.props.folderId != this.state.folderId ||
      (this.state.acc_id && this.props.acc_id != this.state.acc_id)
    ) {
        this.setState(
          this.assignStates(
            this.props.token,
            this.props.pageId,
            this.props.folderId,
            this.props.tagCategories,
            this.props.type,
            this.props.sites,
            this.props.categories,
            this.props.noteQuizzes,
            this.props.acc_id,
            this.props.access_level,
            this.props.access_key
          )
        );
    }

    console.log("folderId7",this.state.folderId);
    return (
      <div className={"modal fade in show "+showimportant} id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-modal="true">
      {/* <div class="modal fade in show" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true"> */}
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              {/* <h5 class="modal-title" id="exampleModalLabel">Modal title</h5> */}
              <button type="button" class="close" data-dismiss="modal" aria-label="Close" onClick={this.closeModal}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">

              <Tabs>
                <div className="desktophidden">
                  <TabList>
                    <Tab><img src={Notes} />{translation.Notes}</Tab>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    {type == "PRODUCTEUR" && (
                      <Tab><img src={Notespredifine} />{translation.Predefined_notes}</Tab>
                    )}
                  </TabList>
                </div>
                <div className="mobilehidden">
                  <TabList>
                    <Tab><img src={Notes} />{translation.Notes}</Tab>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    {type == "PRODUCTEUR" && (
                      <Tab><img src={Notespredifine} />{translation.Predefined_notes}</Tab>
                    )}
                  </TabList>
                </div>
                <TabPanel>
                  <h6 className="producteure-note-popup-font-colour">{translation.Title}</h6>
                  <input type="email" id="username" className="form-control" name='username'
                    value={this.state.fields["title"]}
                    onChange={this.handleChange.bind(this, "title")} required />
                  <br />
                  <h6 className="producteure-note-popup-font-colour">{translation.Add_a_title_to_the_note}</h6>

                  <div className="form-label-group mb-2">
                    <textarea className="form-control update-fonts" rows="4" cols="50"

                      value={this.state.fields["body"]}
                      onChange={this.handleChange.bind(this, "body")}>
                    </textarea>
                  </div>
                  <br />
                  {
                    this.state.imageUrl ?
                        (
                            <div className="text-center">
                              <img src={Config.PhotoUrl + this.state.imageUrl} alt={translation.Photo_Full_Screen} />
                            </div>
                        ) :
                        (
                            <div className="producteure-note-popup-font-colour">{translation.Add_a_file}
                              <React.Fragment>
                                <button className="producteure-note-button2"
                                        onClick={() => this.refs.fileInput.click()}
                                >{translation.Upload}
                                </button>

                                <div>
                                  <input
                                      type="file"
                                      ref="fileInput"
                                      onChange={this.fileSelectedHandler}
                                      style={{display: "none"}}
                                      name="file"
                                      multiple={true}/>
                                  <div>
                                  </div>
                                </div>
                              </React.Fragment>

                            </div>
                        )
                  }

                  <br />
                  {(() => {
                    if (this.state.selectedFileName) {
                      if (this.state.selectedFile.type == "image/apng" || this.state.selectedFile.type == "image/avif" || this.state.selectedFile.type == "image/svg+xml" ||
                          this.state.selectedFile.type == "image/gif" || this.state.selectedFile.type == "image/jpeg" || this.state.selectedFile.type == "image/png" ||
                          this.state.selectedFile.type == "image/webp" || this.state.selectedFile.type == "image/tiff") {
                        return (
                            <div role="alert">
                              <div className="d-flex">
                                <div style={{position: "relative"}}>
                                  <img id="noteImage" alt="image" width="200" height="80"/>
                                  <img src={fuclose} className="img-responsive align-me" alt="workimg"
                                       style={{position: "absolute", right: "0px", top: "0px", backgroundColor: "red"}}
                                       onClick={() => this.removeSelectedImage()}/>
                                </div>
                              </div>
                            </div>
                        )
                      } else {
                        return (
                            <div className="setting-information-general-jpg-box" role="alert">
                              <div className="d-flex">
                                <div className="form-group-right">
                                  <img src={fuicon} alt="workimg"/>
                                </div>
                                <label htmlFor="inputEmail"
                                       style={{
                                         marginTop: '15px',
                                         color: '#0178D4'
                                       }}>{this.state.selectedFileName}</label>
                                <div className="ml-auto">
                                  <img src={fuclose} className="img-responsive align-me" alt="workimg" onClick={() => {
                                    this.setState({selectedFileName: null})
                                  }}/>
                                </div>
                              </div>
                            </div>
                        )
                      }
                    }
                  })()}


                  <br></br>
                  <div className="producteure-note-popup-font-colour">{translation.Add_more_files}
                    <React.Fragment>
                      <button className="producteure-note-button2"
                              onClick={() => this.refs.fileInput2.click()}
                      >{translation.Upload}
                      </button>
                      <div>
                        <input
                            type="file"
                            ref="fileInput2"
                            onChange={this.moreFileSelectedHandler}
                            style={{display: "none"}}
                            name="file"
                            multiple={true}/>
                        <div>
                        </div>
                      </div>
                    </React.Fragment>
                  </div>
                  <br />
                  {(() => {
                    if (this.state.selectedMoreFilesNames && this.state.selectedMoreFilesNames[0]) {
                        return (
                          <div>
                          {this.state.selectedMoreFilesNames.map(function(object, i){
                              return <div className="setting-information-general-jpg-box" role="alert">
                                <div className="d-flex">
                                  <div className="form-group-right">
                                    <img src={fuicon} alt="workimg"/>
                                  </div>
                                  <label htmlFor="inputEmail"
                                        style={{
                                          marginTop: '15px',
                                          color: '#0178D4'
                                        }}>{object}</label>
                                  <div className="ml-auto">
                                    <img src={fuclose} className="img-responsive align-me" alt="workimg" onClick={() => this.moreRemoveSelectedImage(i)}/>
                                  </div>
                                </div>
                              </div>
                          }, this)}
                          </div>
                        )
                    }
                  })()}

                  <br />
                  <br></br>
                  {type == "PRODUCTEUR" && (
                    <h4 className="producteure-note-popup-font-colour">{translation.Sites}</h4>
                  )}
                  <br></br>
                  {type == "PRODUCTEUR" && (
                    <div class="container">
                      {this.props.sites.map((site) => (
                        <div className="row">
                          <div className="col-12" >
                            <div className="checkbox" >

                              <input type="checkbox"
                                key={site.id}
                                // value={selectedSites.includes(site.id)}
                                checked={selectedSites.includes(site.id.toString())}

                                id={site.id}
                                onChange={this.addSites.bind(this)}
                              />
                              <label style={{ marginBottom: '15px', color: '#0178D4', marginLeft: "20px" }}>

                                {isFrench ? site.name_fr : site.name_en}
                              </label>
                            </div>
                          </div>
                          <br></br>


                          {selectedSites.includes(site.id.toString()) && (
                            <div className="col-12">
                              {(site.fields).map((field) => (
                                <div style={{ paddingLeft: "50px" }}>
                                  <div className="checkbox" >

                                    <input type="checkbox"
                                      key={field.id}
                                      value={selectedFields.includes(field.id.toString())}

                                      id={field.id}
                                      onChange={this.addFields.bind(this)}
                                    />
                                    <label style={{ fontSize: "15px", marginLeft: "15px" }}>
                                      {isFrench ? field.name_fr : field.name_en}
                                    </label>
                                  </div>
                                </div>
                              ))
                              }
                            </div>
                          )}

                          <br></br>
                          <br></br>
                        </div>
                      ))
                      }

                    </div>
                  )}
                  <br />
                  <br />

                  <h4 className="producteure-note-popup-font-colour">{translation.Tags}</h4>
                  <br></br>
                  <div class="container">
                    {this.props.tagCategories.map((tagCategory) => (
                      <div className="row">
                        <div className="col-6">
                          <button type="button" className="btn btn-light btn-sm" style={{ marginBottom: '15px', color: '#0178D4' }}>{isFrench ? tagCategory.name_fr : tagCategory.name_en}
                          </button>
                        </div>
                        <div className="col-6">

                        </div>
                        <br></br>

                        {(tagCategory.tags).map((tag) => (
                          <div className="col-3">
                            <div className="checkbox" >

                              <input type="checkbox"
                                key={tag.id}
                                value={selectedTags.includes(tag.id)}

                                id={tag.id}
                                onChange={this.addTags.bind(this)}
                              />
                              <label style={{ marginLeft: "10px", fontSize: "15px" }}>
                                {/* <span className="cr">
                                  <i
                                  className="cr-icon glyphicon glyphicon-ok"></i> 
                                  </span> */}
                                {isFrench ? tag.name_fr : tag.name_en}
                              </label>
                            </div>
                          </div>
                        ))
                        }
                        <br></br>
                        <br></br>
                      </div>
                    ))
                    }

                  </div>

                  <h4 className="producteure-note-popup-font-colour">{translation.Name_of_the_culture}</h4>
                  {/*<div className="dropdown dropDownPadding col-12 col-sm-7 col-md-5 col-lg-4 pl-0">*/}
                  {/*  <select className="form-select form-control" aria-label="Text input with dropdown button"*/}
                  {/*          onChange={this.handleCategories} value={this.state.selectedCategories}*/}
                  {/*          style={{backgroundColor: '#e9ecef'}}>*/}
                  {/*    <option selected value="">{translation.Select}</option>*/}
                  {/*    {*/}
                  {/*      this.props.categories.map((category) => (*/}
                  {/*          <option value={category.id}>{category.name_fr}</option>*/}
                  {/*      ))*/}
                  {/*    }*/}
                  {/*  </select>*/}
                  {/*</div>*/}

                  <div>
                    <div style={{ width: "250px" }}  >
                      <Multiselect
                          options={this.props.categories} // Options to display in the dropdown
                          selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
                          onSelect={this.onSelectCategories}
                          onRemove={this.onRemove}// Function will trigger on select event
                          displayValue={multiselectname} // Property name to display in the dropdown options
                          showCheckbox="true"
                          placeholder={translation.Name_of_the_culture}
                      />
                    </div>
                  </div>
                  <br />
                  <br />

                  <button type="button" class="btn btn-primary" onClick={this.createNote}>{translation.Add_note}</button>
                  <label class="error-font-style" >{this.state.message}</label>

                </TabPanel>

                {type == "PRODUCTEUR" && (


                  <TabPanel>

                    <h6 className="producteure-note-popup-font-colour">{translation.Type_of_Note}</h6>


                    <select class="form-select form-control" aria-label="Text input with dropdown button" onChange={this.getID} >
                      <option selected disabled hidden>{translation.Make_a_selection}</option>
                      {
                        this.props.noteQuizzes.map((obj) => (
                          <option value={obj.id}>{isFrench ? obj.name_fr : obj.name_en}</option>
                        ))

                      }
                    </select>

                    <h6 className="producteure-note-popup-font-colour">{translation.Title}</h6>
                    <input type="email" id="username" className="form-control" name='username'
                      value={this.state.fields["title"]}
                      onChange={this.handleChange.bind(this, "title")} required />

                    <br />
                    <h6 className="producteure-note-popup-font-colour">{translation.Description}</h6>

                    <div className="form-label-group mb-2">
                      <textarea className="form-control update-fonts" rows="4" cols="50"

                        value={this.state.fields["body"]}
                        onChange={this.handleChange.bind(this, "body")}>
                      </textarea>
                    </div>

                    <br />

                    {quizzeId != null && (
                      <div>
                        {quizzObject.quizes.map((quize) => (
                          <div>
                            <h6 className="producteure-note-popup-font-colour">{isFrench ? quize.name_fr : quize.name_en}</h6>
                            <div className="form-label-group mb-2">
                              <textarea className="form-control update-fonts" rows="4" cols="50"
                                placeholder={translation.Add_an_answer}
                                value={this.state.quizzFields["answer_fr_" + quize.id]}
                                id={quize.id}
                                onChange={this.handleQuizz.bind(this, quize.id)}>
                              </textarea>
                            </div>
                            <br />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* <div className="producteure-note-popup-font-colour">Ajouter un fichier <button className="producteure-note-button2">Télécharger</button>     </div>

                    <br />
                    <div class="setting-information-general-jpg-box" role="alert">
                      <div class="d-flex" >

                        <div class="form-group-right" >
                          <img src={fuicon} alt="workimg" />
                        </div>
                        <label htmlFor="inputEmail" style={{ marginTop: '15px', color: '#0178D4' }}>IMG-10212-1284.jpg</label>
                        <div class="ml-auto" >
                          <img src={fuclose} class="img-responsive align-me" alt="workimg" />
                        </div>
                      </div>

                    </div> */}

                    {
                      this.state.imageUrl ?
                          (
                              <div className="text-center">
                                <img src={Config.PhotoUrl + this.state.imageUrl} alt={translation.Photo_Full_Screen} />
                              </div>
                          ) :
                          (
                              <div className="producteure-note-popup-font-colour">{translation.Add_a_file}
                                <React.Fragment>
                                  <button className="producteure-note-button2"
                                          onClick={() => this.refs.fileInput.click()}


                                  >{translation.Upload}
                                  </button>

                                  <div>
                                    <input
                                        type="file"
                                        ref="fileInput"
                                        onChange={this.fileSelectedHandler}
                                        style={{display: "none"}}
                                        name="file"/>
                                    <div>
                                    </div>
                                  </div>
                                </React.Fragment>

                              </div>
                          )
                    }

                    <br />

                    {(() => {
                      if (this.state.selectedFileName) {
                        if (this.state.selectedFile.type == "image/gif" || this.state.selectedFile.type == "image/jpeg" || this.state.selectedFile.type == "image/png") {
                          return (
                              <div role="alert">
                                <div className="d-flex">
                                  <div style={{position: "relative"}}>
                                    <img id="noteImage" alt="image" width="200" height="80"/>
                                    <img src={fuclose} className="img-responsive align-me" alt="workimg"
                                         style={{position: "absolute", right: "0px", top: "0px", backgroundColor: "red"}}
                                         onClick={() => this.removeSelectedImage()}/>
                                  </div>
                                </div>
                              </div>
                          )
                        } else {
                          return (
                              <div className="setting-information-general-jpg-box" role="alert">
                                <div className="d-flex">
                                  <div className="form-group-right">
                                    <img src={fuicon} alt="workimg"/>
                                  </div>
                                  <label htmlFor="inputEmail"
                                         style={{
                                           marginTop: '15px',
                                           color: '#0178D4'
                                         }}>{this.state.selectedFileName}</label>
                                  <div className="ml-auto">
                                    <img src={fuclose} className="img-responsive align-me" alt="workimg" onClick={() => {
                                      this.setState({selectedFileName: null})
                                    }}/>
                                  </div>
                                </div>
                              </div>
                          )
                        }
                      }
                    })()}

                    
                    <br></br>
                    <div className="producteure-note-popup-font-colour">{translation.Add_more_files}
                      <React.Fragment>
                        <button className="producteure-note-button2"
                                onClick={() => this.refs.fileInput2.click()}
                        >{translation.Upload}
                        </button>
                        <div>
                          <input
                              type="file"
                              ref="fileInput2"
                              onChange={this.moreFileSelectedHandler}
                              style={{display: "none"}}
                              name="file"
                              multiple={true}/>
                          <div>
                          </div>
                        </div>
                      </React.Fragment>
                    </div>
                    <br />
                    {(() => {
                      if (this.state.selectedMoreFilesNames && this.state.selectedMoreFilesNames[0]) {
                          return (
                            <div>
                            {this.state.selectedMoreFilesNames.map(function(object, i){
                                return <div className="setting-information-general-jpg-box" role="alert">
                                  <div className="d-flex">
                                    <div className="form-group-right">
                                      <img src={fuicon} alt="workimg"/>
                                    </div>
                                    <label htmlFor="inputEmail"
                                          style={{
                                            marginTop: '15px',
                                            color: '#0178D4'
                                          }}>{object}</label>
                                    <div className="ml-auto">
                                      <img src={fuclose} className="img-responsive align-me" alt="workimg" onClick={() => this.moreRemoveSelectedImage(i)}/>
                                    </div>
                                  </div>
                                </div>
                            }, this)}
                            </div>
                          )
                      }
                    })()}

                    <br />
                    <br></br>

                    <h4 className="producteure-note-popup-font-colour">{translation.Sites}</h4>
                    <br></br>
                    <div class="container">

                      {this.props.sites.map((site) => (
                        <div className="row">
                          <div className="col-12" >
                            <div className="checkbox" >

                              <input type="checkbox"
                                key={site.id}
                                // value={selectedSites.includes(site.id)}
                                checked={selectedSites.includes(site.id.toString())}

                                id={site.id}
                                onChange={this.addSites.bind(this)}
                              />
                              <label style={{ marginBottom: '15px', color: '#0178D4', marginLeft: "20px" }}>

                                {isFrench ? site.name_fr : site.name_en}
                              </label>
                            </div>
                          </div>

                          {selectedSites.includes(site.id.toString()) && (
                            <div>
                              {(site.fields).map((field) => (
                                <div className="col-12" style={{ paddingLeft: "50px" }}>
                                  <div className="checkbox" >
                                    <input type="checkbox"
                                      key={field.id}
                                      value={selectedFields.includes(field.id)}

                                      id={field.id}
                                      onChange={this.addFields.bind(this)}
                                    />
                                    <label style={{ fontSize: "15px", marginLeft: "15px" }}>
                                      {isFrench ? field.name_fr : field.name_en}
                                    </label>
                                  </div>
                                </div>
                              ))
                              }
                            </div>
                          )}

                          <br></br>
                          <br></br>
                        </div>
                      ))
                      }
                    </div>
                    <br />
                    <br />

                    {/* <h6 className="producteure-note-popup-font-colour">Site</h6>

                  <div class="input-group">
                    <input type="text" class="form-control" aria-label="Text input with dropdown button" placeholder="Faire une selection"></input>
                    <div class="input-group-append">
                      <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
                      <div class="dropdown-menu">
                        <a class="dropdown-item" href="#">Action</a>
                        <a class="dropdown-item" href="#">Another action</a>
                        <a class="dropdown-item" href="#">Something else here</a>
                        <div role="separator" class="dropdown-divider">

                        </div>
                        <a class="dropdown-item" href="#">Separated link</a>
                      </div>
                    </div>
                  </div> */}



                    <h4 className="producteure-note-popup-font-colour">{translation.Tags}</h4>
                    <br></br>
                    <div class="container">
                      {this.props.tagCategories.map((tagCategory) => (
                        <div className="row">
                          <div className="col-6">
                            <button type="button" className="btn btn-light btn-sm" style={{ marginBottom: '15px', color: '#0178D4' }}>{isFrench ? tagCategory.name_fr : tagCategory.name_en}
                            </button>
                          </div>
                          <div className="col-6">
                            {/* <button type="button" className="btn btn-outline-primary btn-sm"
                            id="Popover2">Ajouter un tag
                          </button> */}
                          </div>
                          <br></br>

                          {(tagCategory.tags).map((tag) => (
                            <div className="col-3">
                              <div className="checkbox" >

                                <input type="checkbox"
                                  key={tag.id}
                                  value={selectedTags.includes(tag.id)}

                                  id={tag.id}
                                  onChange={this.addTags.bind(this)}
                                />
                                <label style={{ marginLeft: "10px", fontSize: "15px" }}>
                                  {/* <span className="cr">
                                  <i
                                  className="cr-icon glyphicon glyphicon-ok"></i> 
                                  </span> */}
                                  {isFrench ? tag.name_fr : tag.name_en}
                                </label>
                              </div>
                            </div>
                          ))
                          }
                          <br></br>
                          <br></br>
                        </div>
                      ))
                      }

                    </div>

                    <h4 className="producteure-note-popup-font-colour">{translation.Name_of_the_culture}</h4>
                    {/*<div className="dropdown dropDownPadding col-12 col-sm-7 col-md-5 col-lg-4 pl-0">*/}
                    {/*  <select className="form-select form-control" aria-label="Text input with dropdown button"*/}
                    {/*          onChange={this.handleCategories} value={this.state.selectedCategories}*/}
                    {/*          style={{backgroundColor: '#e9ecef'}}>*/}
                    {/*    <option selected value="">{translation.Select}</option>*/}
                    {/*    {*/}
                    {/*      this.props.categories.map((category) => (*/}
                    {/*          <option value={category.id}>{category.name_fr}</option>*/}
                    {/*      ))*/}
                    {/*    }*/}
                    {/*  </select>*/}
                    {/*</div>*/}

                    <div>
                      <div style={{ width: "250px" }}  >
                        <Multiselect
                            options={this.props.categories} // Options to display in the dropdown
                            selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
                            onSelect={this.onSelectCategories}
                            onRemove={this.onRemove}// Function will trigger on select event
                            displayValue={multiselectname} // Property name to display in the dropdown options
                            showCheckbox="true"
                            placeholder={translation.Name_of_the_culture}
                        />
                      </div>
                    </div>
                    <br />
                    <br />

                    <button type="button" class="btn btn-primary" onClick={this.createPredefineNote}>{translation.Add_note}</button>
                    <label class="error-font-style" >{this.state.message}</label>

                    {/* <h6 className="producteure-note-popup-font-colour">Tag</h6>
                  <br />
                  <button className="btn btn-light">
                    Récolte de Janvier
                  </button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <button className="btn btn-light">
                    Agriculture céréale
                  </button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <button className="btn btn-light">
                    Biologique
                  </button>
                  <br />
                  <button className="producteure-note-popup-button2">Ajouter un tag</button> */}

                  </TabPanel>

                )}
              </Tabs>
            </div>
            {/* <div class="modal-footer">

              <button type="button" class="btn btn-primary" onClick={this.createNote}>Ajouter une note</button>
              <label class="error-font-style" >{this.state.message}</label>
            </div> */}

          </div>
        </div>
      </div>


    )
  }

})
export default connect(mapStateToProps, null)(withLanguageHook(createNote));