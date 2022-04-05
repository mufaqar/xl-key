
import Footer from '../../../components/layout/footer/ProducerFooter';
import Header from "../../../components/layout/main-navigation/ProducerMainNavigation"
// import './index.css';
import miniclose from "../../../public/img/miniclose.svg"
import editpen from "../../../public/img/Edit.svg"
import editcopy from "../../../public/img/EditCopy.svg"
import file from "../../../public/img/file.svg"
import notepicture from "../../../public/img/notepicture.png"
import Filterpar from "../../../components/common/notes/mobile/index";
import SimpleTabs from "../../../components/common/notes/web/index";
import CommonNote from "./common_note"
import CommonPredefinedNote from "./common_predefined_note"
import Api from "../../../helper/notes-api";
import Multiselect from 'multiselect-react-dropdown';
import React, { Component } from 'react';

import { connect, useSelector, useDispatch } from 'react-redux';
import useTranslation from "../../../components/customHooks/translations";
import getLanguage from "../../customHooks/get-language";

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
var notePage = createClass({

    getInitialState: function () {
        this.state = {
            api: new Api(this.props.token, this.props.acc_id, this.props.access_level, this.props.access_key)
        }
        this.loadData(this.props.pageId)

        return this.assignStates(
            this.props.pageId,
            this.props.folderId,
            this.props.token,
            this.props.type,
            this.props.pageName,
            this.props.folderName,
            this.props.acc_id,
            this.props.base_url,
            this.props.access_level,
            this.props.access_key,
        );
    },

    assignStates: function (pageId, folderId, token, type, pageName, folderName, acc_id, base_url, access_level, access_key) {
        
    console.log("folderId2",folderId)

        let initial_values = {
            id: 1,
            type: type,
            api: new Api(token, acc_id, access_level, access_key),
            acc_id: acc_id,
            base_url: base_url,
            notes: [],
            tagCategories: [],
            noteQuizzes: [],
            sites: [],
            pageId: pageId,
            folderId: folderId,
            pageName: pageName,
            folderName: folderName,
            selectedYear: "",
            selectedTag: "",
            filterSites: [],
            selectedSites: "",
            years: [],
            categories: [],
            access_level: access_level,
            access_key: access_key
        }
        return initial_values;
    },

    loadData: function (pageId) {
        this.state.api
            .getPageNotes(pageId)
            .then(response => {
                this.setState({
                    notes: response.data.data,
                    pageName_fr: response.data.page.name_fr,
                    pageName_en: response.data.page.name_en,
                    folderName_fr: response.data.folder.name_fr,
                    folderName_en: response.data.folder.name_en,
                    folderId: response.data.folder.id
                })

            })
            .catch(err => {
                if (err.response && err.response.status == 401) {
                    this.props.history.push('/');
                }
            });


        this.state.api
            .getNotesTagCategoriesAll()
            .then(response => {
                this.setState({
                    tagCategories: response.data.data
                })
            })
            .catch(err => {
                if (err.response && err.response.status == 401) {
                    this.props.history.push('/');
                }
            });

        this.state.api
            .getAllPredefinedNoteQuizzes()
            .then(response => {
                let responseNoteQuizzes = [];
                if (response.data.data) {
                    let responseData = response.data.data;
                    for (var key in responseData) {
                        responseNoteQuizzes[responseData[key].id] = responseData[key];
                    }
                }
                this.setState({
                    noteQuizzes: responseNoteQuizzes
                })
            })
            .catch(err => {
                if (err.response && err.response.status == 401) {
                    this.props.history.push('/');
                }
            });

        this.state.api
            .getAllSites()
            .then(response => {
                this.setState({
                    sites: response.data.data
                })
            })
            .catch(err => {
                if (err.response && err.response.status == 401) {
                    this.props.history.push('/');
                }
            });


        this.state.api
            .getAllYears()
            .then(response => {
                this.setState({
                    years: response.data.data
                })
            })
            .catch(err => {
                if (err.response && err.response.status == 401) {
                    this.props.history.push('/');
                }
            });

        this.state.api
            .getAllCategories()
            .then(response => {
                this.setState({
                    categories: response.data.data
                })
            })
            .catch(err => {
                if (err.response && err.response.status == 401) {
                    this.props.history.push('/');
                }
            });
    },


    DeletePage() {
        this.state.api
            .deleteNotesPage(this.state.pageId)
            .then(response => {
                this.setState({ message: response.data.message });
                window.location.reload(false);
            })
            .catch(err => {
                // if (err.response && err.response.status == 401) {
                //     this.props.history.push('/');
                // }
            });

    },

    handleTagFilter(e) {
        const selectedTag = e.target.value;
        this.setState({ selectedTag: selectedTag }, () => {
            this.getPageNotesByFilter(this.state.selectedYear, selectedTag, this.state.selectedSites);
        });
    },

    handleYears(e) {
        const selectedYear = e.target.value;
        this.setState({ selectedYear: selectedYear }, () => {
            this.getPageNotesByFilter(selectedYear, this.state.selectedTag, this.state.selectedSites);
        });
    },

    getPageNotesByFilter(selectedYear, selectedTag, selectedSites) {

        this.state.api
            .getPageNotesByFilter([this.state.pageId, selectedYear, selectedTag, selectedSites])
            .then(response => {
                this.setState({
                    notes: response.data.data
                })
            })
            .catch(err => {
                if (err.response && err.response.status == 401) {
                    this.props.history.push('/');
                }
            });

    },

    onSelectedItemsChange(selectedItems) {
        this.setState({ selectedItems });
    },

    onSelectSites(selectedList, selectedItem) {
        let selectedSites = []
        selectedList.forEach(item => {
            selectedSites.push(item.id)
        });

        let sites = selectedSites.join(',');

        this.setState({ selectedSites: sites }, () => {
            this.getPageNotesByFilter(this.state.selectedYear, this.state.selectedTag, selectedSites);
        });
    },

    onSelectTags(selectedList, selectedItem) {

        let selectedTags = []
        selectedList.forEach(item => {
            selectedTags.push(item.id)
        });

        let tags = selectedTags.join(',');

        this.setState({ selectedTags: tags }, () => {
            this.getPageNotesByFilter(this.state.selectedYear, selectedTags, this.state.selectedSites);
        });
    },

    onRemove(selectedList, removedItem) {

    },


    render: function () {
        const { notes, pageId, folderId, tagCategories, pageName, folderName_fr, folderName_en, pageName_fr, pageName_en, type, sites, noteQuizzes, years, categories, access_level } = this.state;
        const { selectedItems } = this.state;
        var tagCategories_formatted = [];
        const language = this.props.language;
        const isFrench = language == "FR";

        console.log("folderId3",folderId)

        if (tagCategories) {
            let n = 0
            for (var key in tagCategories) {
                for (var key_2 in tagCategories[key].tags) {
                    let temp_tag = tagCategories[key].tags[key_2];
                    temp_tag.cat = tagCategories[key].name_fr;
                    tagCategories_formatted[n] = temp_tag;
                    n++;
                }
            }
        }

        if (this.props.pageId != this.state.pageId ||
            (this.state.acc_id && this.props.acc_id != this.state.acc_id)
        ) {
            this.setState(this.assignStates(
                this.props.pageId,
                this.props.folderId,
                this.props.token,
                this.props.type,
                this.props.pageName,
                this.props.folderName,
                this.props.acc_id,
                this.props.base_url,
                this.props.access_level,
                this.props.access_key
            ));
            this.loadData(this.props.pageId)
            console.log("folderId4",folderId)
        
        }
        const translation = this.props.translation;
        let multiselectname = isFrench ? "name_fr" : "name_en";
        console.log("folderId5",folderId)
    
        return (
            <div>
                <div className="producture-note-margin">
                    <div className="producteure-note-main-box">
                        <SimpleTabs token={this.state.token} acc_id={this.state.acc_id} type={type} pageId={pageId} folderId={folderId} tagCategories={tagCategories} sites={sites} categories={categories} noteQuizzes={noteQuizzes} access_level={this.state.access_level} access_key={this.state.access_key}></SimpleTabs>

                        <div class="row">
                            <div class="col-md-6">
                                <h3 className="headerColor"> {isFrench ? folderName_fr : folderName_en}</h3>
                                <h5 className="producture-note-topic-fonts"> {isFrench ? pageName_fr : pageName_en}</h5>
                            </div>

                            {!(pageId == "" || access_level == 2) && (
                                <div class="col-md-6">
                                    <button className="producteure-note-button" data-toggle="modal" data-target="#exampleModal">{translation.Add_note}</button>
                                </div>
                            )}
                        </div>

                        <hr className="producteure-note-hr"></hr>

                        <div class=" mobilehidden" >
                            <div class="btn-group BasicexampleMargin" role="group" aria-label="Basic example">
                                {pageId != "" && (
                                    <div class="dropdown dropDownPadding">
                                        <select class="form-select form-control" aria-label="Text input with dropdown button" onChange={this.handleYears} value={this.state.selectedYear}  >
                                            <option selected value="">{translation.Year}</option>
                                            {
                                                years.map((year) => (
                                                    <option value={year.name_fr}>{year.name_fr}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                )}
                                {pageId != "" && (
                                    <div>
                                        <div style={{ width: "200px" }}>
                                            <Multiselect
                                                options={tagCategories_formatted}
                                                selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
                                                onSelect={this.onSelectTags}
                                                onRemove={this.onRemove}// Function will trigger on select event
                                                displayValue={multiselectname} // Property name to display in the dropdown options
                                                showCheckbox="true"
                                                placeholder={translation.Tags}
                                                groupBy="cat"
                                            />
                                        </div>
                                    </div>
                                )}
                                &nbsp;&nbsp;
                                {(pageId != "" && type == "PRODUCTEUR") && (
                                    <div>
                                        <div style={{ width: "200px" }}  >
                                            <Multiselect
                                                options={sites} // Options to display in the dropdown
                                                selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
                                                onSelect={this.onSelectSites}
                                                onRemove={this.onRemove}// Function will trigger on select event
                                                displayValue={multiselectname} // Property name to display in the dropdown options
                                                showCheckbox="true"
                                                placeholder={translation.Sites}
                                            />
                                        </div>
                                    </div>
                                )}

                            </div>

                            {!(pageId == "" || access_level == 2) && (

                                <div className="camTag">

                                    <button className="producteure-note-button2"
                                        data-toggle="modal"
                                        data-target={"#deleteCat" + pageId}
                                    >{translation.Delete_all}</button>
                                </div>
                            )}


                            <div class="modal fade" id={"deleteCat" + pageId} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div class="modal-dialog" role="document" style={{ maxWidth: '100%' }}>
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title" id="exampleModalLabel">{translation.Do_you_want_to_delete}</h5>
                                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-primary" onClick={this.DeletePage} style={{ width: '40%' }}>{translation.Yes}</button>
                                            <button type="button" class="btn btn-secondary" data-dismiss="modal" style={{ width: '40%' }} >{translation.Close}</button>
                                            <br />
                                            <label class="error-font-style" >{this.state.message}</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="desktophidden">
                            <div className="camTag">
                                <a class="nav-link settingIconPointer" data-toggle="modal"
                                    data-target="#myModalright"><i class="fas fa-sliders-h"></i>{translation.All_filters}</a>
                            </div>


                            <div class="modal fade  come-from-modal right" id="myModalright" tabindex="-1" role="dialog"
                                aria-labelledby="myModalLabel">
                                <div class="modal-dialog modelSizeFullScreenDialog" role="document">
                                    <div class="modal-content rightModelTop modelSizeFullScreencontent">
                                        <div class="modal-header">
                                            <h4 class="modal-title" id="myModalLabel">{translation.Filter_by}</h4>
                                            <button type="button" class="close" data-dismiss="modal" title="Close"><span
                                                class="glyphicon glyphicon-remove">X</span></button>
                                        </div>
                                        <div class="modal-body">
                                            {pageId != "" && (
                                                <div class="dropdown dropDownPadding">
                                                    <select class="form-select form-control" aria-label="Text input with dropdown button" onChange={this.handleYears} value={this.state.selectedYear}  >
                                                        <option selected value="">{translation.Year}</option>
                                                        {
                                                            years.map((year) => (
                                                                <option value={year.name_fr}>{year.name_fr}</option>
                                                            ))
                                                        }
                                                    </select>
                                                </div>
                                            )}
                                            &nbsp;&nbsp;
                                            {(pageId != "" && type == "PRODUCTEUR") && (
                                                <div>
                                                    <div style={{ width: "200px" }}  >
                                                        <Multiselect
                                                            options={sites} // Options to display in the dropdown
                                                            selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
                                                            onSelect={this.onSelectSites}
                                                            onRemove={this.onRemove}// Function will trigger on select event
                                                            displayValue={multiselectname} // Property name to display in the dropdown options
                                                            showCheckbox="true"
                                                            placeholder={translation.Sites}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                            &nbsp;&nbsp;
                                            {pageId != "" && (
                                                <div>
                                                    <div style={{ width: "200px" }}>
                                                        <Multiselect
                                                            options={tagCategories_formatted}
                                                            selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
                                                            onSelect={this.onSelectTags}
                                                            onRemove={this.onRemove}// Function will trigger on select event
                                                            displayValue={multiselectname} // Property name to display in the dropdown options
                                                            showCheckbox="true"
                                                            placeholder={translation.Tags}
                                                            groupBy="cat"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                            <br></br>
                                            {!(pageId == "" || access_level == 2) && (

                                                <div className="camTag">

                                                    <button className="producteure-note-button2"
                                                        data-toggle="modal"
                                                        data-target={"#deleteMobile" + pageId}
                                                    >{translation.Delete_all}</button>
                                                </div>
                                            )}


                                            <div class="modal fade" id={"deleteMobile" + pageId} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                <div class="modal-dialog" role="document" style={{ maxWidth: '100%' }}>
                                                    <div class="modal-content">
                                                        <div class="modal-header">
                                                            <h5 class="modal-title" id="exampleModalLabel">{translation.Do_you_want_to_delete}</h5>
                                                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                                <span aria-hidden="true">&times;</span>
                                                            </button>
                                                        </div>
                                                        <div class="modal-footer">
                                                            <button type="button" class="btn btn-primary" onClick={this.DeletePage} style={{ width: '40%' }}>{translation.Yes}</button>
                                                            <button type="button" class="btn btn-secondary" data-dismiss="modal" style={{ width: '40%' }} >{translation.Close}</button>
                                                            <br />
                                                            <label class="error-font-style" >{this.state.message}</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>

                                        {/* <div class="modal-footer">
                                            <div class="col text-center">
                                                <button class="btn btn-outline-primary createButtonMargin" onClick={this.cleanFilter}>{translation.Delete_all}</button> */}
                                        {/* <button class="btn btn-primary createButtonMargin">Appliquer</button> */}
                                        {/* </div>
                                        </div> */}

                                    </div>
                                </div>
                            </div>

                        </div>
                        <br /><br />

                        {notes.map((note) => (
                            <div>
                                {note.predefined_id == null ?
                                    <div>
                                        <br /><br />
                                        <CommonNote acc_id={this.state.acc_id} type={type} note={note} tagCategories={tagCategories} folderId={folderId}
                                            sites={sites} access_level={this.state.access_level} categories={categories}></CommonNote>
                                        <br /><br />
                                    </div> :
                                    <div>
                                        <br /><br />
                                        <CommonPredefinedNote acc_id={this.state.acc_id} type={type} note={note} tagCategories={tagCategories} folderId={folderId}
                                            sites={sites} noteQuizzes={noteQuizzes} access_level={this.state.access_level} categories={categories}></CommonPredefinedNote>
                                        <br /><br />
                                    </div>
                                }
                            </div>
                        ))}

                        <br /><br />

                    </div>
                    <div>
                    </div>

                </div>
            </div>
        );
    }
})

export default connect(mapStateToProps, null)(withLanguageHook(notePage));
