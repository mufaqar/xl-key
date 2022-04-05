import React from 'react'
import miniclose from "../../../public/img/miniclose.svg"
import editpen from "../../../public/img/Edit.svg"
import editcopy from "../../../public/img/EditCopy.svg"
import file from "../../../public/img/file.svg"
import fuclose from "../../../public/img/fileuploadclose.png";
import Api from "../../../helper/notes-api";
import DownloadLink from "react-download-link";
import { connect, useSelector, useDispatch } from 'react-redux';
import useTranslation from "../../../components/customHooks/translations";
import getLanguage from "../../customHooks/get-language";
import fuicon from "../../../public/img/fileuploadicon.png";
import Config from "../../../config/config";
import Multiselect from "multiselect-react-dropdown";

const mapStateToProps = state => {
    let token = state.token;
    let userRole = state.userRole;
    let isLogged = state.isLogged;
    return { token, userRole, isLogged }
}

var createClass = require('create-react-class');

var TextField = createClass({
    render: function () {

        var text = this.props.text || 'Nothing yet'
        return (
            <div class="form-group" style={{ paddingTop: '8px' }}>
                <p>{text}</p>
            </div>
        )
    }
})

function withLanguageHook(Component) {
    return function WrappedComponent(props) {
        const translation = useTranslation();
        const language = getLanguage();
        return <Component {...props} translation={translation} language={language} />;
    }
}


var NotePage = createClass({

    getInitialState: function () {

        return this.assignStates(
            this.props.note,
            this.props.token,
            this.props.tagCategories,
            this.props.noteQuizzes,
            this.props.type,
            this.props.acc_id,
            this.props.access_level,
            this.props.access_key
        );

    },

    assignStates: function (note, token, tagCategories, noteQuizzes, type, acc_id, access_level, access_key) {

        let fields = [];
        let quizzFields = [];
        let quizzId = [];

        fields["title"] = note.title_en;
        fields["body"] = note.body_en;
        let selectedFileName = null
        if (note.file_url_en != "") {
            selectedFileName = note.file_url_en
        }
        let etcFiles = [];
        if (note.etcImages != "") {
          etcFiles = note.etcImages
        }
    
        let selectedTags = [];
        let selectedSites = [];
        let selectedFields = [];
        let selectedCategories = note.note_category;
        let n = 0;
        (note.note_tag).forEach(tag => {
            selectedTags.push(tag.id.toString());
            n++;
        });

        let x = 0;
        (note.note_site).forEach(site => {
            selectedSites.push(site.id.toString());
            x++;
        });

        let y = 0;
        (note.note_field).forEach(field => {
            selectedFields.push(field.id.toString());
            y++;
        });

        // let z = 0;
        // (note.note_category).forEach(category => {
        //     selectedCategories.push(category.id.toString());
        //     z++;
        // });

        let selectedPredefinedQuizes = [];
        if (note.predefined_id) {
            let selectedPredefinedQuizAll = noteQuizzes[note.predefined_id];
            if (selectedPredefinedQuizAll && selectedPredefinedQuizAll.quizes) {
                selectedPredefinedQuizes = selectedPredefinedQuizAll.quizes;

            }
        }

        if (note.answers) {
            let temp_answers = note.answers;
            note.answers = [];
            for (var key in temp_answers) {
                note.answers[temp_answers[key].quiz_id] = temp_answers[key];
                quizzId.push(temp_answers[key].quiz_id);
                let fieldName = "answer_fr_" + temp_answers[key].quiz_id

                if (temp_answers[key].answer_fr) {
                    quizzFields[Number(temp_answers[key].quiz_id)] =
                    {
                        "name": fieldName,
                        "value": temp_answers[key].answer_fr
                    }
                } else {
                    quizzFields[Number(temp_answers[key].quiz_id)] =
                    {
                        "name": fieldName,
                        "value": ""
                    }
                }
            }
        }

        let initial_values = {
            note: note,
            id: note.id,
            api: new Api(token, acc_id, access_level, access_key),
            message: "",
            title: note.title_en,
            body: note.body_en,
            fields: fields,
            isEdit: false,
            selectedTags: selectedTags,
            selectedSites: selectedSites,
            selectedFields: selectedFields,
            tagCategories: tagCategories,
            selectedCategories: selectedCategories,
            selectedValue: selectedCategories,
            noteQuizzes: noteQuizzes,
            selectedPredefinedQuizes: selectedPredefinedQuizes,
            selectedFileName: selectedFileName,
            selectedMoreFiles: [],
            selectedMoreFilesNames: [],
            selectedetcFiles: etcFiles,
            removeOldSelectedImages: '',
            type: type,
            quizzFields: quizzFields,
            quizzId: quizzId,
            predefined_id: note.predefined_id,
            acc_id: acc_id,
            access_level: access_level,
            access_key: access_key
        }

        return initial_values;

    },

    getCreatedDate(created_at) {
        let date = created_at;
        let dateFormat = require("dateformat");
        let correctdate = dateFormat(date, "yyyy.mm.dd");
        return correctdate;
    },

    DeleteAccount() {
        this.state.api
            .deleteNote(this.state.id)
            .then(response => {
                this.setState({ message: response.data.message });
                window.location.reload(false);
            })
            .catch(err => {
                if (err.response && err.response.status == 401) {
                    this.props.history.push('/');
                }
            });
    },



    updateAccount() {

        let tags = this.state.selectedTags.join(',');
        let sites = this.state.selectedSites.join(',');
        let selectedFields = this.state.selectedFields.join(',');
        let quizzId = this.state.quizzId.join(',');
        const data = this.state.fields;
        let formData = new FormData();

        formData.append('title_en', data.title);
        formData.append('title_fr', data.title);
        formData.append('body_en', data.body);
        formData.append('body_fr', data.body);
        formData.append('status', "active");
        formData.append('page_id', this.state.note.page_id);
        formData.append('folder_id', this.state.note.folder_id);
        formData.append('file_en', this.state.selectedFile);
        formData.append('file_fr', this.state.selectedFile);
        formData.append('tags', tags);
        formData.append('sites', sites);
        formData.append('fields', selectedFields);
        formData.append('categories', this.state.selectedCategories);
        formData.append('predefined_id', this.state.predefined_id);
        formData.append('quizes', quizzId);
        formData.append('lang', this.props.language);
        formData.append('etc_images_deleted', this.state.removeOldSelectedImages);

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
            .updateNote([this.state.id, formData])
            .then(response => {
                this.setState({
                    message: response.data.message
                });
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

    handleChange(field, e) {
        let fields = this.state.fields;
        fields[field] = e.target.value;
        this.setState({ fields });
    },

    toggleEditing: function () {
        var isEdit = !this.state.isEdit
        this.setState({
            isEdit: isEdit
        })
    },

    updateAnswers(e) {
        const note = this.state.note;
        note.answers[e.target.id] = e.target.value;
        this.setState({
            note: note
        }
        );
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
    //     const category = e.target.value;
    //     this.setState({selectedCategories: category});
    // },

    onSelectCategories(selectedList, selectedItem) {
        let selectedCategories = [];
        console.log(selectedList);
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

    fileSelectedHandler(event) {
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

    handleQuizz(field, e) {
        let quizzFields = this.state.quizzFields;
        let fieldName = "answer_fr_" + e.target.id;
        let quizzId = this.state.quizzId;
        quizzFields[Number(e.target.id)] =
        {
            "name": fieldName,
            "value": e.target.value
        }

        if (!quizzId.includes(e.target.id)) {
            quizzId.push(e.target.id);
        }


        this.setState({
            quizzFields: quizzFields,
            quizzId: quizzId
        });
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
    
  removeSelectedImageOldOnes(i1,i2) {
    // Add removed id to the form fields
    let removeOldSelectedImages = this.state.removeOldSelectedImages;
    if (removeOldSelectedImages=='') {
      removeOldSelectedImages += i1;
    } else {
      removeOldSelectedImages += ','+i1;
    }
    console.log('removeOldSelectedImages',removeOldSelectedImages);
    this.setState({removeOldSelectedImages: removeOldSelectedImages});
    // Remove the item from the display
    let selectedetcFiles = this.state.selectedetcFiles;
    selectedetcFiles.splice(i2, 1);
    console.log(selectedetcFiles);
    this.setState({selectedetcFiles: selectedetcFiles});
  },

    render: function () {

        let titleField;
        let bodyField;

        if (this.state.isEdit) {

            titleField = <div class="form-group">
                <input
                    type="text"
                    class="form-control"
                    id={this.state.title}
                    ref="userInput"
                    value={this.state.fields["title"]}
                    onChange={this.handleChange.bind(this, "title")}
                />
            </div>

            bodyField = <div class="form-group">
                <textarea
                    className="form-control update-fonts"
                    id={this.state.body}
                    rows="4"
                    cols="50"
                    value={this.state.fields["body"]}
                    onChange={this.handleChange.bind(this, "body")}
                >
                </textarea>
            </div>

        } else {
            titleField = <TextField text={this.state.title} />
            bodyField = <TextField text={this.state.body} />
        }

        const { note, id, isEdit, type, selectedSites, access_level, selectedFileName } = this.state;

        console.log("this.state.selectedFileName ", this.state.selectedFileName)
        console.log("this.state.selectedMoreFilesNames ", this.state.selectedMoreFilesNames)
    
        if(selectedFileName == "false"){
            this.setState({
              selectedFileName : null
          })
        }

        const width100percent = "100%";
        const translation = this.props.translation;
        const language = this.props.language;
        const isFrench = language == "FR";
        let multiselectname = isFrench ? "name_fr" : "name_en";
        return (
            <div className="producteure-note-sub-box">
                {access_level != 2 && (
                    <img src={miniclose}
                        className="producteure-note-icon-navigation"
                        alt="Responsive image"
                        data-toggle="modal"
                        data-target={"#exampleModalNote" + id} />
                )}
                {access_level != 2 && (
                    <img src={editpen} className="producteure-note-icon-navigation" onClick={this.toggleEditing} />
                )}
                <div class="modal fade" id={"exampleModalNote" + id} tabindex="-1" role="dialog"
                    aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document" style={{ maxWidth: '100%' }}>
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">{translation.Do_you_want_to_delete}</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-primary" onClick={this.DeleteAccount}
                                    style={{ width: '40%' }}>{translation.Yes}
                                </button>
                                <button type="button" class="btn btn-secondary" data-dismiss="modal"
                                    style={{ width: '40%' }}>{translation.Close}
                                </button>
                                <br />
                                <label class="error-font-style">{this.state.message}</label>
                            </div>
                        </div>
                    </div>
                </div>
                <br />

                <h5 className="producture-note-topic-fonts">{this.getCreatedDate(note.created_at)}</h5>

                <h5 className="producture-note-topic-fonts">{titleField}</h5>
                <h6 className="producture-note-paragraph">{bodyField}</h6>

                {!isEdit && (
                    <div>
                        {
                            this.state.selectedPredefinedQuizes.map((obj) => (
                                <div>
                                    <table class="table">
                                        <div class="row">
                                            <div class="col-8">
                                                <button className="btn btn-light" style={{ marginRight: "40px" }}>
                                                    {isFrench ? obj.name_fr : obj.name_en}
                                                </button>
                                            </div>
                                            <div class="col-4">
                                                {note.answers[obj.id].answer_fr}
                                            </div>
                                        </div>
                                    </table>
                                </div>
                            ))
                        }
                    </div>
                )}


                {isEdit && (
                    <div>
                        {this.state.selectedPredefinedQuizes.map((obj) => (
                            <div>
                                <h6 className="producteure-note-popup-font-colour">{isFrench ? obj.name_fr : obj.name_en}</h6>
                                <div className="form-label-group mb-2">
                                    <textarea className="form-control update-fonts" rows="4" cols="50"
                                        placeholder={translation.Add_an_answer}
                                        // value={note.answers[obj.id].answer_fr}
                                        id={note.answers[obj.id].quiz_id}
                                        onChange={this.handleQuizz.bind(this, note.answers[obj.id].quiz_id)}
                                        value={this.state.quizzFields[obj.id].value}
                                        // id={note.answers[obj.id].id}
                                        ref="userInput"
                                    // value={note.answers[obj.id].answer_fr}
                                    >
                                    </textarea>
                                </div>
                                <br />
                            </div>
                        ))}
                    </div>
                )}

                <div className="producteure-note-sub-box-2">
                    {(() => {
                        if (this.state.selectedFile) {
                            if (this.state.selectedFile.type == "image/gif" || this.state.selectedFile.type == "image/jpeg" || this.state.selectedFile.type == "image/png") {
                                return (
                                    <img id="noteImage" alt="image" width="200" height="80" style={{marginTop:'8px'}}/>
                                )
                            } else {
                                return (
                                    <div>
                                        <img src={fuicon} alt="workimg" style={{marginTop: '6px'}}/>
                                        <label htmlFor="inputEmail" style={{marginTop: '15px'}}>
                                            {this.state.selectedFileName}
                                        </label>
                                    </div>
                                )
                            }
                        }
                        if (selectedFileName) {
                            if (selectedFileName.match(/\.(jpeg|jpg|gif|png)$/) != null) {
                                return (
                                    <div style={{display:'flex',width:'100%',overflow:'hidden',height:'auto',alignItems:'baseline',justifyContent: 'space-between'}}>
                                        <img src={Config.PhotoUrl + selectedFileName} alt={selectedFileName} width="200" height="80" style={{marginTop:'8px'}}/>
                                        {!isEdit && (
                                            <React.Fragment>
                                                <a href={process.env.REACT_APP_IMAGE_URL + "download/" + selectedFileName.replace('uploads/', '')}>
                                                    <button className="producteure-note-button3">{translation.Download}</button>
                                                </a>
                                            </React.Fragment>
                                        )}
                                    </div>
                                )
                            } else {
                                return (
                                    <div style={{display:'flex',width:'100%',overflow:'hidden',height:'auto',alignItems:'baseline',justifyContent: 'space-between'}}>
                                        <div>
                                            <img src={fuicon} alt="workimg" style={{marginTop: '6px'}}/>
                                            <label htmlFor="inputEmail" style={{marginTop: '15px'}}>
                                                {this.state.selectedFileName}
                                            </label>
                                        </div>
                                        {!isEdit && (
                                            <React.Fragment>
                                                <a href={process.env.REACT_APP_IMAGE_URL + "download/" + selectedFileName.replace('uploads/', '')}>
                                                    <button className="producteure-note-button3">{translation.Download}</button>
                                                </a>
                                            </React.Fragment>
                                        )}
                                    </div>
                                )
                            }
                        }
                    })()}
                </div>

                {isEdit && (
                    <React.Fragment>
                        <button className="producteure-note-button3" onClick={() => this.refs.fileInput.click()}>
                        {translation.Upload}
                        </button>
                        <div>
                            <input
                                type="file"
                                ref="fileInput"
                                onChange={this.fileSelectedHandler}
                                style={{ display: "none" }}
                                name="file" />
                            <div>
                            </div>
                        </div>
                    </React.Fragment>
                )}

                <br/><br/>
                <div className="producteure-note-sub-box-2">
                {(() => {
                    if (this.state.selectedetcFiles && this.state.selectedetcFiles[0]) {
                        return (
                        <div>
                        {this.state.selectedetcFiles.map(function(object, i){
                            if (object.image_link.match(/\.(jpeg|jpg|gif|png)$/) != null) {
                            return (
                                <div style={{display:'flex',width:'100%',overflow:'hidden',height:'auto',alignItems:'baseline',justifyContent: 'space-between'}}>
                                    <img src={Config.PhotoUrl + object.image_link} alt={object.image_link} width="200" height="80" style={{marginTop:'8px'}}/>
                                    {!isEdit && (
                                        <React.Fragment>
                                        <a href={process.env.REACT_APP_IMAGE_URL + "download/" + object.image_link.replace('uploads/', '')}>
                                            <button className="producteure-note-button3">{translation.Download}</button>
                                        </a>
                                        </React.Fragment>
                                    )}
                                    {isEdit && (
                                      <div className="ml-auto">
                                        <img src={fuclose} className="img-responsive align-me" alt="workimg" onClick={() => this.removeSelectedImageOldOnes(object.id, i)}/>
                                      </div>
                                    )}
                                </div>
                            )
                            } else {
                            return (
                                <div style={{display:'flex',width:'100%',overflow:'hidden',height:'auto',alignItems:'baseline',justifyContent: 'space-between'}}>
                                    <div>
                                        <img src={fuicon} alt="workimg" style={{marginTop: '6px'}}/>
                                        <label htmlFor="inputEmail" style={{marginTop: '15px'}}>
                                        {object.image_link}
                                        </label>
                                    </div>
                                    {!isEdit && (
                                        <React.Fragment>
                                        <a href={process.env.REACT_APP_IMAGE_URL + "download/" + object.image_link.replace('uploads/', '')}>
                                            <button className="producteure-note-button3">{translation.Download}</button>
                                        </a>
                                        </React.Fragment>
                                    )}
                                    {isEdit && (
                                      <div className="ml-auto">
                                        <img src={fuclose} className="img-responsive align-me" alt="workimg" onClick={() => this.removeSelectedImageOldOnes(object.id, i)}/>
                                      </div>
                                    )}
                                </div>
                            )
                            }
                          }, this)
                        }
                        </div>
                    )}
                })()}
                </div>

                {isEdit && (
                <React.Fragment>
                    <button className="producteure-note-button3"
                    onClick={() => this.refs.fileInput2.click()}
                    >{translation.Upload}
                    </button>

                    <div>
                    <input
                        type="file"
                        ref="fileInput2"
                        onChange={this.moreFileSelectedHandler}
                        style={{ display: "none" }}
                        name="file"
                        multiple={true} />
                    <div>
                    </div>
                    </div>
                </React.Fragment>
                )}

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

                <br></br>
                {(isEdit && type == "PRODUCTEUR") && (
                    <div>
                        <br />

                        <h4 className="producteure-note-popup-font-colour">{translation.Sites}</h4>
                        <br></br>
                        <div class="container">
                            {this.props.sites.map((site) => (
                                <div className="row">
                                    <div className="col-12" >
                                        <div className="checkbox" >
                                            <input type="checkbox"
                                                key={site.id}
                                                checked={this.state.selectedSites.includes(site.id.toString())}

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
                                                            checked={this.state.selectedFields.includes(field.id.toString())}
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

                    </div>)}


                <br />

                {isEdit && (
                    <div>
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


                                            <div>

                                                <input
                                                    type="checkbox"

                                                    checked={this.state.selectedTags.includes(tag.id.toString())}

                                                    id={tag.id}

                                                    onChange={this.addTags} />

                                                <label style={{ marginLeft: "10px", fontSize: "15px" }}>

                                                    {tag.name_en}
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


                    </div>
                )}



                {(!isEdit && (this.state.selectedSites) != "" && type == "PRODUCTEUR") && (
                    <div>

                        <h6 className="producteure-note-popup-font-colour">{translation.Sites}</h6>
                        <br />

                        <div class="container">

                            {this.props.sites.map((site) => (
                                <div>
                                    {this.state.selectedSites.includes(site.id.toString()) && (
                                        <div>
                                            <button className="btn btn-light" style={{ marginRight: "50px" }}>
                                                {isFrench ? site.name_fr : site.name_en}
                                            </button>
                                            <br clear="all" /><br />
                                            {(site.fields).map((field) => (this.state.selectedFields.includes(field.id.toString()) && (
                                                <button className="btn btn-light" style={{ marginRight: "50px" }}>
                                                    {isFrench ? field.name_fr : field.name_en}
                                                </button>
                                            )))}
                                        </div>
                                    )}
                                </div>
                            ))
                            }
                            <br /><br />
                        </div>


                    </div>
                )}




                {(!isEdit && (note.note_tag) != "") && (

                    <div>
                        <h6 className="producteure-note-popup-font-colour">{translation.Tags}</h6>
                        <br></br>
                        {note.note_tag.map((tag) => (

                            <button className="btn btn-light" style={{ marginRight: "50px" }}>
                                {isFrench ? tag.name_fr : tag.name_en}
                            </button>

                        ))}
                    </div>
                )}

                <br/>
                {(!isEdit && (note.note_category) != "") && (
                    <div>
                        <h6 className="producteure-note-popup-font-colour">{translation.Name_of_the_culture}</h6>
                        {note.note_category.map((category) => (
                            <button className="btn btn-light" style={{marginRight: "20px"}}>
                                {isFrench ? category.name_fr : category.name_en}
                            </button>
                        ))}
                    </div>
                )}

                {isEdit && (
                    <div>
                        <br/>
                        <h4 className="producteure-note-popup-font-colour">{translation.Name_of_the_culture}</h4>
                        {/*<div className="container">*/}
                        {/*    <div className="dropdown dropDownPadding col-12 col-sm-7 col-md-6 col-lg-4 pl-0">*/}
                        {/*        <select className="form-select form-control"*/}
                        {/*                aria-label="Text input with dropdown button"*/}
                        {/*                onChange={this.handleCategories} value={this.state.selectedCategories}*/}
                        {/*                style={{backgroundColor: '#e9ecef'}}>*/}
                        {/*            <option selected value="">{translation.Select}</option>*/}
                        {/*            {*/}
                        {/*                this.props.categories.map((category) => (*/}
                        {/*                    <option value={category.id}>{category.name_fr}</option>*/}
                        {/*                ))*/}
                        {/*            }*/}
                        {/*        </select>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
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
                )}
                <br/><br/>

                {/* {(isEdit && type == "PRODUCTEUR") && (
                    <div>
                        <br />
                        <h4 className="producteure-note-popup-font-colour">Site(s)</h4>
                        <br></br>
                        <div class="container">
                            {this.props.sites.map((site) => (
                                <div className="row">
                                    <div className="col-12" >
                                        <div className="checkbox" >
                                            <input type="checkbox"
                                                key={site.id}
                                                checked={this.state.selectedSites.includes(site.id.toString())}

                                                id={site.id}
                                                onChange={this.addSites.bind(this)}
                                            />
                                            <label style={{ marginBottom: '15px', color: '#0178D4', marginLeft: "20px" }}>
                                                {site.name_fr}
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
                                                            checked={this.state.selectedFields.includes(field.id.toString())}
                                                            id={field.id}
                                                            onChange={this.addFields.bind(this)}
                                                        />
                                                        <label style={{ fontSize: "15px", marginLeft: "15px" }}>
                                                            {field.name_fr}
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

                    </div>)}
                <br />
                {isEdit && (
                    <div>
                        <br />

                        <h4 className="producteure-note-popup-font-colour">Tag(s)</h4>
                        <br></br>
                        <div class="container">
                            {this.props.tagCategories.map((tagCategory) => (
                                <div className="row">
                                    <div className="col-6">
                                        <button type="button" className="btn btn-light btn-sm"
                                            style={{ marginBottom: '15px', color: '#0178D4' }}>{tagCategory.name_fr}
                                        </button>
                                    </div>
                                    <div className="col-6">

                                    </div>
                                    <br></br>

                                    {(tagCategory.tags).map((tag) => (
                                        <div className="col-3">


                                            <div>

                                                <input
                                                    type="checkbox"

                                                    checked={this.state.selectedTags.includes(tag.id.toString())}

                                                    id={tag.id}

                                                    onChange={this.addTags} />

                                                <label style={{ marginLeft: "10px", fontSize: "15px" }}>

                                                    {tag.name_en}
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

                        <br />
                    </div>
                )}


                {(!isEdit && (this.state.selectedSites) != "") && (
                    <div>
                        <br />

                        <h6 className="producteure-note-popup-font-colour">Site(s)</h6>
                        <br></br>
                        <div class="container">

                            {this.props.sites.map((site) => (
                                <div className="row">
                                    <div className="col-7">
                                        {this.state.selectedSites.includes(site.id.toString()) && (
                                            <button className="btn btn-light" style={{ marginRight: "50px" }}>
                                                {site.name_fr}
                                            </button>
                                        )}
                                    </div>
                                    <div className="col-5">

                                    </div>
                                    <br></br>
                                    <br></br>

                                    {(site.fields).map((field) => (
                                        <div className="col-3" style={{ marginLeft: "10px" }}>
                                            {this.state.selectedFields.includes(field.id.toString()) && (
                                                <button className="btn btn-light" style={{ marginRight: "50px" }}>
                                                    {field.name_fr}
                                                </button>
                                            )}
                                        </div>
                                    ))
                                    }
                                    <br></br>
                                    <br></br>
                                </div>
                            ))
                            }

                        </div>

                        <br />
                    </div>
                )}


                <br></br>

                {(!isEdit && (note.note_tag) != "") && (

                    <div>
                        <h6 className="producteure-note-popup-font-colour">Tag(s)</h6>
                        <br></br>
                        {note.note_tag.map((tag) => (

                            <button className="btn btn-light" style={{ marginRight: "50px" }}>
                                {tag.name_fr}
                            </button>

                        ))}
                    </div>
                )} */}



                {isEdit && (
                    <button type="button" class="btn btn-primary" onClick={this.updateAccount}>{translation.Update}</button>
                )}

                {isEdit && (
                    <p>{this.state.message}</p>
                )}

                <br /><br />

            </div>
        )

    },

})

export default connect(mapStateToProps, null)(withLanguageHook(NotePage));