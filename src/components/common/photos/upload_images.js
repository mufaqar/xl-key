import React from 'react'
import './upload_images.css';
import { connect } from 'react-redux';
import PhotoApi from "../../../helper/photo-api";
import Api from "../../../helper/api";
import ImageUploading from "react-images-uploading";
import '../../../components/producer/settings/settingsMain.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import loader from "../../../loading.gif"
import useTranslation from "../../customHooks/translations"
import getLanguage from "../../customHooks/get-language";

const mapStateToProps = state => {
    let token = state.token;
    let userRole = state.userRole;
    let isLogged = state.isLogged;
    return { token, userRole, isLogged }
}

function withLanguageHook(Component) {
    return function WrappedComponent(props) {
        const translation = useTranslation();
        const language = getLanguage();
        return <Component {...props} translation={translation} language={language} />;
    }
}

var createClass = require('create-react-class');

var CommonPhotoPage = createClass({

    getInitialState: function () {
        return this.assignStates(
            this.props.token,
            this.props.type,
            this.props.popup,
            this.props.acc_id,
            this.props.access_key,
            this.props.access_level
        );
    },

    assignStates: function (token, type, popup, acc_id, access_key, access_level) {
        let initial_values = {
            id: 1,
            type: type,
            popup: popup,
            photoApi: new PhotoApi(token, acc_id, access_key, access_level),
            api: new Api(token, acc_id, access_key, access_level),

            popoverOpen: false,
            setPopoverOpen: false,
            loading: false,
            isLoaded: false,
            error: null,
            errors: {},
            categories: [],
            productureList: [],
            selectedProducture: "",
            sites: [],
            tagCategories: [],
            fields: [],
            images: [],
            isChecked: true,
            categoryId: false,
            statusEdit: false,
            checkboxCategories: [],
            selectedSites: [],
            selectedFields: [],
            years: [],
            selectedYear: "",
            selectedCategories: [],
            selectedTags: [],
            passages: [],
            selectedPassages: [],
            isDrone: false,
            message: "",
            errormessage: "",
            responseMessage: "",
            access_key: access_key,
            access_level: access_level
        }

        // this.toggleOffer = this.toggleOffer.bind(this);
        return initial_values;
    },

    componentDidMount() {
        this.loadData();
    },

    loadData() {
        let type = this.state.type
        if (type != "producture") {

            this.state.photoApi
                .getAllProducteur(type)
                .then(response => {
                    let producer_ar = [];
                    if (type == "consultant") {
                        let dataArray = response.data.data;
                        dataArray.forEach(item => {
                            producer_ar.push(item.producteur_account);

                        });
                    } else {
                        producer_ar = response.data.data;
                    }

                    let produceritem = [];
                    let n = 0;
                    producer_ar.forEach(prod => {
                        produceritem[prod.id] = {
                            "id": prod.id,
                            "name_en": prod.name_en,
                            "name_fr": prod.name_fr
                        };
                        n++;
                    });
                    this.setState({
                        productureList: produceritem,
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
        }

        this.state.photoApi
            .getAllCategories()
            .then(response => {
                let categories = response.data.data;

                this.setState({
                    isLoaded: true,
                    categories: categories,

                });

            })
            .catch((err) => console.log(err));

            
        this.state.photoApi
            .getPhotosTags()
            .then(response => {
                this.setState({
                    isLoaded: true,
                    tagCategories: response.data.data,
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
                } else {
                    if (err.response && err.response.data.message) {
                        this.setState({ message: err.response.data.message });
                    } else {
                        this.setState({ message: "Quelque chose s'est mal passé !" });
                    }
                }
            });


        if (type == "admin") {
            this.state.photoApi
                .getAllPassage()
                .then(response => {
                    this.setState({
                        passages: response.data.data
                    })
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
        }

        if (type == "producture") {
            this.state.photoApi
                .getAllSites()
                .then(response => {

                    this.setState({
                        isLoaded: true,
                        sites: response.data.data,
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
        }

        this.state.photoApi
            .getPhotosTags()
            .then(response => {
                this.setState({
                    isLoaded: true,
                    tagCategories: response.data.data,
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



    insertPhotosFormSubmit(e) {
        e.preventDefault();
        this.insertPhotos(e);
    },

    insertPhotos(e) {
        this.setState({ loading: true })

        let formData = new FormData();
        const data = this.state.fields;
        let tags = this.state.selectedTags.join(',');
        let selectedSites = this.state.selectedSites.join(',');
        let fields = this.state.selectedFields.join(',');
        let categories = this.state.selectedCategories.join(',');
        let selectedPassages = this.state.selectedPassages.join(',');


        this.state.images.forEach(image => formData.append('photos', image.file));
        formData.append('name_en', 'aaaaa');
        formData.append('name_fr', 'bbbbb');
        if (data.comment) {
            formData.append('comment_en', data.comment);
            formData.append('comment_fr', data.comment);
        }
        formData.append('tags', tags);
        formData.append('sites', selectedSites);
        formData.append('fields', fields);
        formData.append('years', this.state.selectedYear);
        formData.append('categories', categories);
        formData.append('passages', selectedPassages);
        formData.append('account_id', this.state.selectedProducture);
        formData.append('lang', this.props.language);


        this.state.photoApi
            .insertPhotos(["admin", formData])
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        responseMessage: response.data.message,
                        errormessage: "",
                        loading: false
                    })
                }else{
                    this.setState({
                        errormessage: response.data.message,
                        responseMessage: "",
                        loading: false
                    })
                }
                setTimeout(window.location.reload(false), 500);

            })
            .catch(err => {
                if (err.response && err.response.status == 401) {
                    this.props.history.push('/');
                } else {
                    if (err.response && err.response.data.message) {
                        this.setState({
                            errormessage: err.response.data.message,
                            responseMessage: "",
                            loading: false
                        });
                    } else {
                        this.setState({
                            errormessage: "Quelque chose s'est mal passé !",
                            responseMessage: "",
                            loading: false
                        });
                    }
                }
            });

    },

    handleChange(field, e) {
        let fields = this.state.fields;
        fields[field] = e.target.value;
        this.setState({ fields });
    },

    selectProducutre(e) {
        let id = e.target.value;
        this.setState({ selectedProducture: id }, () => {
            this.getSitesPerProducteur(id);
        });

    },

    getSitesPerProducteur(selectedProducture) {
        this.state.photoApi
            .getSitesPerProducteur(selectedProducture)
            .then(response => {
                this.setState({
                    isLoaded: true,
                    sites: response.data.data,
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

    selectCategories(e) {
        let id = e.target.id;

        let selectedCategories = this.state.selectedCategories;

        if (selectedCategories.includes(id)) {
            var index = selectedCategories.indexOf(id)
            selectedCategories.splice(index, 1);
        } else {
            selectedCategories.push(id);

            if (e.target.name == "Drone" && this.state.type == "admin") {
                this.setState({ isDrone: true });
            }
        }
        this.setState({ selectedCategories: selectedCategories });

    },

    selectPassages(e) {
        let id = e.target.id;

        let selectedPassages = this.state.selectedPassages;
        if (selectedPassages.includes(id)) {
            var index = selectedPassages.indexOf(id)
            selectedPassages.splice(index, 1);
        } else {
            selectedPassages.push(id);

        }
        this.setState({ selectedPassages: selectedPassages });

    },


    selectYear(e) {
        let id = e.target.id;

        this.setState({
            selectedYear: id
        })

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

    render() {

        if ((this.state.acc_id && this.props.acc_id != this.state.acc_id) && this.props.access_key != this.state.access_key) {
        
            this.setState(
                this.assignStates(
                    this.props.token,
                    this.props.type,
                    this.props.popup,
                    this.props.acc_id,
                    this.props.access_key,
                    this.props.access_level
                )
            );
        }

        const maxNumber = 10;
        const onChange = (imageList, addUpdateIndex) => {
            this.setState({
                images: imageList,
            });
        };

        const { error, isLoaded, sites, tagCategories, fields, images, selectedSites, type, popup, selectedFields, years, selectedYear, categories,
            selectedCategories, selectedTags, isDrone, passages, selectedPassages, loading } = this.state;

        let stylePopup = { marginBottom: "50px" };
        if (popup == "yes") {
            stylePopup = {
                width: "100%",
                maxWidth: "100%",
                marginTop: "0px",
                marginBottom: "0px"
            }
        }
        const translation = this.props.translation;
        const language = this.props.language;
        const isFrench = language == "FR";
        return (
            <div>
                <main>
                    <div class="card" style={stylePopup}>
                        <div className="col-md-12 col-lg-12 mx-auto">
                            <div id="mainDivSelect">

                                <form name="insertPhotosForm" onSubmit={this.insertPhotosFormSubmit.bind(this)}>
                                    <div style={{ height: 'calc(100% - 2px)' }}>
                                        <main>
                                            <div class="row headerTop align-bottom "
                                                style={{
                                                    maxHeight: '100px',
                                                    marginLeft: '10px',
                                                    marginRight: '10px'
                                                }}>
                                                <div class="col-12 " style={{ marginTop: '10px', marginBottom: '10px' }}>
                                                    <h5 className="modal-title p-1 d-inline" id="exampleModalLabel">{translation.Upload_image}</h5>
                                                </div>
                                            </div>

                                            {type != "producture" && (
                                                <div class="row  " style={{
                                                    maxHeight: '100px',
                                                    marginLeft: '10px',
                                                    marginRight: '10px',
                                                    paddingTop: '20px'
                                                }}>



                                                    <div
                                                        class="col-md-8 col-lg-12 col-sm-12 col-xs-12 form-item-margin">
                                                        <div class="input-group ">
                                                            <strong class="d-inline p-2"
                                                                htmlFor="inputEmail">{translation.Producers}:</strong>
                                                            <div class="col-sm-7 ">
                                                                <div class="input-group-append">
                                                                    <select class="form-select form-control" aria-label="Text input with dropdown button" onChange={this.selectProducutre.bind(this)} >
                                                                        <option selected disabled hidden>{translation.Make_a_selection}</option>
                                                                        {
                                                                            this.state.productureList.map((obj) => (
                                                                                <option value={obj.id}>{isFrench ? obj.name_fr : obj.name_en}</option>
                                                                            ))

                                                                        }
                                                                    </select>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>

                                                </div>
                                            )}


                                            {(type != "consultant" && sites != "") && (
                                                <div className="row uploadFieldFix">
                                                    <div className="col-12" >
                                                        <div class="input-group ">
                                                            <strong className="uploadFieldsTitle" htmlFor="inputEmail">{translation.Sites}</strong>
                                                            <div class="container">
                                                                {sites.map((site) => (
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
                                                                    </div>
                                                                ))
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <hr></hr>
                                                </div>
                                            )}




                                            <div class="row  admin-upload-align uploadFieldFix">
                                                <div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 ">
                                                    <div class="input-group ">

                                                        <strong class="d-inline p-2"
                                                            htmlFor="inputEmail">{translation.Year}</strong>
                                                        <br></br>
                                                        <br></br>
                                                        <div class="container">
                                                            <div class="row">
                                                                {
                                                                    years.map((year) => (
                                                                        <div class="col">

                                                                            <div className="radio" >
                                                                                <label style={{ fontSize: "15px" }}>
                                                                                    <input type="radio"
                                                                                        type="radio"
                                                                                        id={year.id}
                                                                                        checked={selectedYear == year.id}
                                                                                        onChange={this.selectYear.bind(this)}
                                                                                        style={{ marginRight: "10px" }}
                                                                                       
                                                                                    />
                                                                                    {isFrench ? year.name_fr :year.name_en}
                                                                                </label>
                                                                            </div>


                                                                        </div>
                                                                    ))

                                                                }
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>

                                            </div>
                                            <hr></hr>

                                            <ImageUploading
                                                multiple
                                                value={images}
                                                onChange={onChange}
                                                maxNumber={maxNumber}
                                                dataURLKey="data_url"
                                            >
                                                {({
                                                    imageList,
                                                    onImageUpload,
                                                    onImageRemoveAll,
                                                    onImageUpdate,
                                                    onImageRemove,
                                                    isDragging,
                                                    dragProps
                                                }) => (
                                                    // write your building UI
                                                    <div className="row g-3"
                                                        onClick={onImageUpload}
                                                        {...dragProps}
                                                        {...isDragging ? "Drop here please" : "Upload space"}>
                                                        <div className="col-md-4">
                                                            <div className="paddingTop">
                                                                <div className="dotted imageboxSmallScreenHeight">
                                                                    <div align="center" className="">
                                                                        <div className="d-none  d-md-block">
                                                                            <span className="btn-label">
                                                                                <svg width="51" height="40" viewBox="0 0 51 40" fill="none"
                                                                                    xmlns="http://www.w3.org/2000/svg">
                                                                                    <path fill-rule="evenodd" style={{ fill: "#DCDCDC" }}
                                                                                        clip-rule="evenodd"
                                                                                        d="M48.4791 34.2996H48.4306C48.4306 35.1691 48.0913 35.9421 47.5095 36.5217C46.9278 37.1014 46.1521 37.4397 45.2795 37.4397H5.72053C4.84791 37.4397 4.07224 37.1014 3.49049 36.5217C2.90875 35.9421 2.56939 35.1691 2.56939 34.2996V10.2416C2.56939 9.37201 2.90875 8.59906 3.49049 8.01923C4.07224 7.43964 4.84791 7.10147 5.72053 7.10147H15.077C15.8042 7.10147 16.3859 6.52176 16.3859 5.79712V4.39603C16.3859 3.86475 16.5798 3.38165 16.9192 3.04349C17.2586 2.7052 17.7433 2.51208 18.2766 2.51208H32.7719C33.3051 2.51208 33.7899 2.7052 34.1293 3.04349C34.4686 3.38165 34.6625 3.86475 34.6625 4.39603V5.79712C34.6625 6.52176 35.2443 7.10147 35.9715 7.10147H45.3279C46.2006 7.10147 46.9762 7.43964 47.558 8.01923C48.1397 8.59906 48.4791 9.37201 48.4791 10.2416V34.2996ZM49.3032 6.2319C48.2852 5.1691 46.8793 4.54108 45.2795 4.54108H37.2319V4.44446C37.2319 3.23672 36.7472 2.0773 35.923 1.30435C35.0989 0.483093 33.9838 0 32.7719 0H18.2281C16.9677 0 15.8527 0.483093 15.0285 1.30435C14.2044 2.12561 13.7196 3.23672 13.7196 4.44446V4.54108H5.72053C4.12072 4.54108 2.71483 5.1691 1.69677 6.2319C0.678707 7.2464 0 8.69568 0 10.2416V34.2996C0 35.8937 0.630228 37.2948 1.69677 38.3092C2.71483 39.3238 4.1692 40 5.72053 40H45.2795C46.8793 40 48.2852 39.3721 49.3032 38.3092C50.3213 37.2948 51 35.8455 51 34.2996V10.2416C51 8.64737 50.3698 7.2464 49.3032 6.2319Z"
                                                                                        fill="black" />
                                                                                    <path fill-rule="evenodd" style={{ fill: "#DCDCDC" }}
                                                                                        clip-rule="evenodd"
                                                                                        d="M31.6341 28.6828C29.9268 30.3415 27.5854 31.4145 25 31.4145C22.4146 31.4145 20.0732 30.3415 18.3659 28.6828C16.6585 26.9755 15.6341 24.6342 15.6341 22.0488C15.6341 19.4634 16.7073 17.1219 18.3659 15.4146C20.0732 13.7073 22.4146 12.6829 25 12.6829C27.5854 12.6829 29.9268 13.7562 31.6341 15.4146C33.3415 17.1219 34.3659 19.4634 34.3659 22.0488C34.4146 24.6342 33.3415 26.9755 31.6341 28.6828ZM25 10C21.6829 10 18.6585 11.3658 16.5122 13.5123C14.3171 15.7074 13 18.6829 13 21.9999C13 25.317 14.3659 28.3414 16.5122 30.4878C18.7073 32.6829 21.6829 34 25 34C28.3171 34 31.3416 32.634 33.4878 30.4878C35.6829 28.2927 37 25.317 37 21.9999C37 18.6829 35.6341 15.6585 33.4878 13.5123C31.3416 11.3658 28.3171 10 25 10Z"
                                                                                        fill="black" />
                                                                                    <path fill-rule="evenodd" style={{ fill: "#DCDCDC" }}
                                                                                        clip-rule="evenodd"
                                                                                        d="M42.4999 10C43.8806 10 45 11.1193 45 12.5C45 13.8807 43.8806 15 42.4999 15C41.1194 15 40 13.8807 40 12.5C40 11.1193 41.1194 10 42.4999 10Z"
                                                                                        fill="black" />
                                                                                </svg>
                                                                            </span>
                                                                        </div>
                                                                        <br></br>

                                                                        <span>{translation.Add_your_photos}</span>
                                                                        <br></br>

                                                                        <br></br>
                                                                        <button type="button"
                                                                            className="btn btn-outline-primary">
                                                                            {translation.Upload}
                                                                        </button>
                                                                    </div>
                                                                    <div className="col-sm"></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-8">
                                                            <div className="paddingTop">
                                                                <div className="dotted" style={{ padding: "2%" }}>
                                                                    <div className="overflowClass">
                                                                        {images.map((image, index) => (
                                                                            <div
                                                                                className="container containerPadding">
                                                                                <div className="headerBecground">
                                                                                    <div className="container">
                                                                                        <div className="row">
                                                                                            <div
                                                                                                className="col-10 iconColor">
                                                                                                <span className="iconColor">
                                                                                                    <svg
                                                                                                        className="iconColor mr-2"
                                                                                                        width="12"
                                                                                                        height="18"
                                                                                                        viewBox="0 0 12 18" fill="none"
                                                                                                        xmlns="http://www.w3.org/2000/svg">
                                                                                                        <mask className="iconColor"
                                                                                                            id="mask0"
                                                                                                            mask-type="alpha"
                                                                                                            maskUnits="userSpaceOnUse"
                                                                                                            x="0" y="0" width="12"
                                                                                                            height="18">
                                                                                                            <path fill-rule="evenodd"
                                                                                                                clip-rule="evenodd"
                                                                                                                d="M0 0.75H12V17.25H0V0.75Z"
                                                                                                                fill="white" />
                                                                                                        </mask>
                                                                                                        <g mask="url(#mask0)">
                                                                                                            <path fill-rule="evenodd"
                                                                                                                clip-rule="evenodd"
                                                                                                                d="M8.23439 4.74239C8.19872 4.74239 8.16966 4.71214 8.16966 4.67493V2.79211L10.0408 4.74239H8.23439ZM1.14734 2.01335C1.14734 1.97613 1.17637 1.94588 1.21207 1.94588H7.02231V4.67493C7.02231 5.37153 7.56604 5.93827 8.23438 5.93827H10.8527V15.9867C10.8527 16.0239 10.8236 16.0542 10.7879 16.0542H1.21207C1.17637 16.0542 1.14734 16.0239 1.14734 15.9867V2.01335ZM11.8272 4.91319L8.00638 0.930843C7.89728 0.814221 7.75155 0.75 7.59597 0.75H1.21207C0.54373 0.75 0 1.31673 0 2.01334V15.9867C0 16.6833 0.54373 17.25 1.21207 17.25H10.7879C11.4563 17.25 12 16.6833 12 15.9867V5.34034C12 5.17849 11.9386 5.02684 11.8272 4.91319Z"
                                                                                                                fill="#202124" />
                                                                                                        </g>
                                                                                                    </svg>
                                                                                                    {image.file.name}
                                                                                                </span>
                                                                                            </div>
                                                                                            <div className="col-2"
                                                                                                onClick={() => onImageRemove(index)}>
                                                                                                <a className="iconColor closeIconFloat">X</a>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        ))
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </ImageUploading>

                                            <br clear="all"></br><br></br>
                                            <div class="row">
                                                <div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 ">
                                                    <div class="input-group ">
                                                        <strong className="uploadFieldsTitle" htmlFor="inputEmail">{translation.Categories}</strong>
                                                        <div class="container">
                                                            {
                                                                categories.map((category) => (
                                                                    <div class="row">
                                                                        {((type == "admin") || (category.name_fr != "Drone" && type != "admin")) && (
                                                                            <div className="col-12" >
                                                                                <div className="checkbox" >
                                                                                    <input type="checkbox"
                                                                                        key={category.id}
                                                                                        value={selectedCategories.includes(category.id.toString())}
                                                                                        name={category.name_fr}
                                                                                        id={category.id}
                                                                                        onChange={this.selectCategories.bind(this)}
                                                                                    />
                                                                                    <label style={{ fontSize: "15px", marginLeft: "15px" }}>
                                                                                        {isFrench ? category.name_fr :category.name_en}
                                                                                    </label>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ))
                                                            }
                                                        </div>
                                                    </div>

                                                </div>
                                                <hr></hr>
                                            </div>
                                            <hr></hr>
                                            <br clear="all"></br>
                                            {(isDrone && type == "admin") && (
                                                <div class="row">
                                                    <div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 ">
                                                        <div class="input-group ">
                                                            <strong className="uploadFieldsTitle" htmlFor="inputEmail">{translation.Passages}</strong>
                                                            <div class="container">
                                                                {passages.map((passage) => (
                                                                    <div class="row">
                                                                        <div className="col-12" >
                                                                            <div className="checkbox" >
                                                                                <input type="checkbox"
                                                                                    key={passage.id}
                                                                                    value={selectedPassages.includes(passage.id.toString())}
                                                                                    name={passage.name_fr}
                                                                                    id={passage.id}
                                                                                    onChange={this.selectPassages.bind(this)}
                                                                                />
                                                                                <label style={{ fontSize: "15px", marginLeft: "15px" }}>
                                                                                    {isFrench ? passage.name_fr :passage.name_en}
                                                                                </label>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                <br></br>
                                                                <hr></hr>
                                                            </div>
                                                        </div>
                                                        {/* <hr></hr> */}
                                                    </div>
                                                    {/* <hr></hr> */}
                                                </div>
                                            )}
                                            <br clear="all"></br>
                                            <div class="row">
                                                <div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 ">
                                                    <div class="input-group ">
                                                        <strong className="uploadFieldsTitle" htmlFor="inputEmail">{translation.Tags}</strong>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="container">
                                                {tagCategories.map((tagCategory) => (
                                                    <div className="row">
                                                        <div className="col-12">
                                                            <button type="button" className="btn btn-light btn-sm" style={{ marginLeft: "-5px", marginBottom: '15px', color: '#0178D4' }}>{isFrench ? tagCategory.name_fr :tagCategory.name_en}
                                                            </button>
                                                        </div>
                                                        <br></br>
                                                        {(tagCategory.tags).map((tag) => (
                                                            <div className="col-md-4 col-sm-6 col-xs-12">
                                                                <div className="checkbox" >
                                                                    <input type="checkbox"
                                                                        key={tag.id}
                                                                        value={selectedTags.includes(tag.id)}
                                                                        id={tag.id}
                                                                        onChange={this.addTags.bind(this)}
                                                                    />
                                                                    <label style={{ marginLeft: "10px", fontSize: "15px" }}>
                                                                        {/* 
                                                                        <span className="cr">
                                                                            <i className="cr-icon glyphicon glyphicon-ok"></i> 
                                                                        </span> 
                                                                        */}
                                                                        {isFrench ? tag.name_fr :tag.name_en}
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

                                            <hr></hr>


                                            <div class="row admin-upload-align-without-width ">
                                                <div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 ">
                                                    <div class="input-group ">

                                                        <strong class="d-inline p-2"
                                                            htmlFor="inputEmail">{translation.Comment}</strong>

                                                        <br></br>
                                                        <br></br>
                                                        <div class="container">
                                                            <div class="row">
                                                            <textarea placeholder={translation.Add_comment}
                                                                    class="pb-cmnt-textarea"
                                                                    value={fields["Commentaire"]}
                                                                    onChange={this.handleChange.bind(this, "comment")}
                                                                ></textarea>
                                                                <br></br>

                                                            </div>
                                                            <br></br>
                                                            <div className="row">
                                                                <div className="col-12 text-center">
                                                                    {loading && (
                                                                        <div className="text-center"><img src={loader} /></div>
                                                                    )}
                                                                    {(!loading && this.state.responseMessage ) && (
                                                                        <div class="text-center alert alert-success">
                                                                            <label class="error-font-style">{this.state.responseMessage}</label>
                                                                        </div>
                                                                    )}
                                                                    {(!loading && this.state.errormessage) && (
                                                                        <div class="text-center alert alert-danger">
                                                                            <label class="error-font-style">{this.state.errormessage}</label>
                                                                        </div>
                                                                    )}
                                                                    <br clear="all"></br>
                                                                </div>
                                                            </div>

                                                            <div class="row">
                                                                <div class="col-12 text-center buttonMaxwidthGroup">
                                                                    <button class="btn btn-primary buttonWidth">{translation.Add_selection}</button>
                                                                </div>
                                                                <br clear="all"></br>
                                                                <br></br>
                                                                <br></br>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </main>
                                    </div>
                                </form>



                            </div>
                        </div>
                    </div>
                </main>
            </div>

        )


    }
})

export default connect(mapStateToProps, null)(withLanguageHook(CommonPhotoPage));