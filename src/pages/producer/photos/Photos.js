import React from 'react'
import Footer from '../../../components/layout/footer/ProducerFooter';
import SettingPop from '../../../components/SettingPopUp/setting.js'
import UploadImages from '../../../components/upload-images'
import SelectPhotos from '../../../components/SelectPhotos/selectPhotos'
import NotificationPhotos from '../../../components/SelectPhotos/notificationPhotos'
import Accordion from "../../../components/Accordion/Accordion.js"
import './index.css';
import Header from "../../../components/layout/main-navigation/ProducerMainNavigation"
import { connect } from 'react-redux';
import PhotoApi from "../../../helper/photo-api";
import Api from "../../../helper/api";
import Config from "../../../config/config";
import Pagination from "react-js-pagination";
import Multiselect from 'multiselect-react-dropdown';
import dataLoader from "../../../dataLoading.gif";
import loader from "../../../loading.gif";
import PageLoader from "../../../components/PageLoader.js";
import useTranslation from "../../../components/customHooks/translations";
import getLanguage from "../../../components/customHooks/get-language";

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
        return <Component {...props} translation={translation} language={language}/>;
    }
}


class Photos extends React.Component {
    constructor(props) {
        super(props)
        let openPopupPhotoArray = [];
        let id = false;
        if (this.props.match.params.id) {
            openPopupPhotoArray = JSON.parse("[" + this.props.match.params.id + "]");
            id = (openPopupPhotoArray && openPopupPhotoArray[0]) ? openPopupPhotoArray[0] : false;
        }
        const acc_id = this.props.match.params.acc_id;
        this.multiselectCategoryTop = React.createRef();
        this.multiselectCategory = React.createRef();
        this.multiselectPassage = React.createRef();
        this.multiselectSite = React.createRef();
        this.multiselectTags = React.createRef();
        const access = this.props.match.params.access;
        const key = this.props.match.params.key;
        let access_level = 0;
        if (access=="access" && key) {
            access_level = 2;
        } else if (access=="access") {
            access_level = 1;
        }
        
        this.state = {
            //isHidden: true
            activePage: 1,
            isHidden: false,
            loading: false,
            isLoaded: false,
            error: null,
            errors: {},
            photoApi: new PhotoApi(this.props.token, acc_id, access_level, key),
            api: new Api(this.props.token, acc_id, access_level, key),
            openPopupPhoto: null,
            openPopupPhotoId: id,
            openPopupPhotoArray: openPopupPhotoArray,
            photos: [],
            selectedPhoto: null,
            selectedIndex: 0,
            pagenumber: 1,
            limit: 12,
            total: 0,

            popoverOpen: false,
            setPopoverOpen: false,
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
            selectedPasages: [],
            selectedTags: [],
            passages: [],
            selectedPassages: [],
            isDrone: false,
            message: "",
            isArchieve: false,
            archieveResult: "active",
            isFavourite: false,
            acc_id:acc_id,
            base_url:"/producteur",
            access_level:access_level,
            access_key:key,
            admin_base_url:"/admin/producteur/"+acc_id,
            entreprise_base_url:"/entreprise/producteur/"+acc_id,
            consultant_base_url:"/consultant/producteur/"+acc_id,
            access_level_1_url:"/consultant/access/producteur/"+acc_id,
            access_level_2_url:"/consultant/access/producteur/"+acc_id+"/"+key,
            dataLoaded: false,
            pageLoader: false
        }
        this.toggleOffer = this.toggleOffer.bind(this);
        this.handleYears = this.handleYears.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.onSelectCategories = this.onSelectCategories.bind(this);
        this.onSelectPassages = this.onSelectPassages.bind(this);
        this.getAllPhotosByFilter = this.getAllPhotosByFilter.bind(this);
        this.onSelectSites = this.onSelectSites.bind(this);
        this.onSelectTags = this.onSelectTags.bind(this);
        this.changeFavourite = this.changeFavourite.bind(this);
        this.cleanFilter = this.cleanFilter.bind(this);
        //this.stopPageLoader()
    }

    stopPageLoader() {
        setTimeout(()=>{
            this.setState({
                pageLoader: false
            });
        }, 1000)
    }

    toggleOffer() {
        this.setState({
            //isHidden: !this.state.isHidden
            isHidden: false
        })
    }

    setSelectedPhoto(photo, index) {
        this.setState({
            selectedPhoto: photo,
            selectedIndex : index
        })
       
    }

    componentDidMount() {
        this.loadData();
        if (this.state.openPopupPhotoId) {
            this.state.photoApi
                .getSinglePhoto(this.state.openPopupPhotoId)
                .then(response => {
                    let photo_open = response.data.data;
                    this.setState({
                        openPopupPhoto: photo_open,
                    });
                    this.handleClick();
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
            .getAllPhotosByFilter([12, 1, this.state.selectedSites, this.state.selectedYear,
                this.state.selectedTags, this.state.selectedCategories, this.state.selectedPasages, this.state.archieveResult, this.state.isFavourite])
            .then(response => {
                this.setState({
                    pageLoader: false,
                    dataLoaded: true
                });
               
                if (response.status === 200) {
                    this.setState({
                        isLoaded: true,
                        photos: (response.data != null || response.data.length !== 0) ? response.data.data : null,
                        selectedPhoto: response.data.data[0],
                        total: response.data.pagination.total,
                        limit: response.data.pagination.limit,
                        pagenumber: response.data.pagination.page,
                    });
                } else {
                    let errors = {};
                    errors["message"] = "Oops1 Try again later";
                   
                    this.setState({
                        isLoaded: true,
                        photos: null,
                        errors: errors
                    });
                }
            })
            .catch((err) => console.log(err));
    }

    loadData() {
        let type = this.state.type

        this.state.photoApi
            .getAllCategories()
            .then(response => {
                let categories = response.data.data;

                this.setState({
                    isLoaded: true,
                    categories: categories,

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
    }

    handleYears(e) {
        const year = e.target.value;

        this.setState({ selectedYear: year, limit: 12, pagenumber: 1,activePage: 1  }, () => {
            this.getAllPhotosByFilter();
        })

    }

    onSelectCategories(selectedList, selectedItem) {
        let isDroneBool = false;
        let selectedCategories = []
        selectedList.forEach(item => {
            selectedCategories.push(item.id)
            if (item.name_fr == "Drone") {
                isDroneBool = true;
            }
        });

        let categories = selectedCategories.join(',');
        this.setState({ selectedCategories: categories, limit: 10, pagenumber: 1, activePage: 1 , isDrone: isDroneBool }, () => {
            this.getAllPhotosByFilter();
        });

    }

    selectArchive() {
        let isArchieve = this.state.isArchieve;
        let archieveResult;
        if (isArchieve) {
            isArchieve = !isArchieve;
            archieveResult = "active"

        } else {
            isArchieve = !isArchieve;
            archieveResult = "archive"
        }

        this.setState({ isArchieve: isArchieve, archieveResult: archieveResult, limit: 12, pagenumber: 1,  activePage: 1  }, () => {
            this.getAllPhotosByFilter();
        });

    }

    onSelectPassages(selectedList, selectedItem) {      

        let selectedPasages = []
        selectedList.forEach(item => {
            selectedPasages.push(item.id)

        });

        let passages = selectedPasages.join(',');
        this.setState({ selectedPassages: passages, limit: 12, pagenumber: 1,  activePage: 1  }, () => {
            this.getAllPhotosByFilter();
        });

    }

    handlePageChange(pageNumber) {
        this.setState({ activePage: pageNumber, pageNumber: 2 }, () => {
            this.getAllPhotosByFilter();
        });
    };

    onSelectSites(selectedList, selectedItem) {
       
        let selectedSites = []
        selectedList.forEach(item => {
            selectedSites.push(item.id)
        });

        let sites = selectedSites.join(',');

        this.setState({ selectedSites: sites, limit: 12, pagenumber: 1,  activePage: 1 }, () => {
            this.getAllPhotosByFilter();
        });

    }

    onSelectTags(selectedList, selectedItem) {

        let selectedTags = []
        selectedList.forEach(item => {
            selectedTags.push(item.id)
        });

        let tags = selectedTags.join(',');

        this.setState({ selectedTags: tags, limit: 12, pagenumber: 1,  activePage: 1 }, () => {
            this.getAllPhotosByFilter();
        });

    }

    changeFavourite(e) {
        let isFavourite = this.state.isFavourite;
        isFavourite = !isFavourite;
        this.setState({ isFavourite: isFavourite, limit: 12, pagenumber: 1,  activePage: 1}, () => {
            this.getAllPhotosByFilter();
        });
    }

    getAllPhotosByFilter() { 

        let pageNumber = this.state.pagenumber;
        if( this.state.pagenumber != this.state.activePage) pageNumber = this.state.activePage;

        this.state.photoApi
            .getAllPhotosByFilter([this.state.limit, this.state.activePage, this.state.selectedSites, this.state.selectedYear,
            this.state.selectedTags, this.state.selectedCategories, this.state.selectedPasages, this.state.archieveResult, this.state.isFavourite])
            .then(response => {
                   if (response.status === 200) {
                    this.setState({
                        isLoaded: true,
                        photos: (response.data != null || response.data.length !== 0) ? response.data.data : null,
                        total: response.data.pagination.total,
                        limit: response.data.pagination.limit,
                        pagenumber: response.data.pagination.page,

                    });
                } else {
                    let errors = {};
                    errors["message"] = "Oops1 Try again later";
                    this.setState({
                        isLoaded: true,
                        photos: null,
                        errors: errors
                    });
                }
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

    cleanFilter() {
        if(this.state.selectedCategories != []) this.multiselectCategoryTop.current.resetSelectedValues() ;
        if(this.state.selectedCategories != [])  this.multiselectCategory.current.resetSelectedValues() ;
        if(this.state.selectedSites != []) this.multiselectSite.current.resetSelectedValues() ;
        if(this.state.selectedPassages != []) this.multiselectPassage.current.resetSelectedValues();
        if(this.state.selectedTags != []) this.multiselectTags.current.resetSelectedValues() ;
        this.setState({
        selectedYear: "", 
        limit: 12, 
        pagenumber: 1,
        activePage: 1,
        selectedFields: [],
        selectedSites: [],
        selectedCategories: [],
        selectedPasages: [],
        selectedTags: [],
        selectedPassages: [],
        isFavourite: false,
        }, () => {
            this.getAllPhotosByFilter();
        })
    }

    
    handleClick = (e) => {
        this.inputElement.click();
    }

    render() {

        let base_url = this.state.base_url;
        if (this.state.access_key) {
            base_url = this.state.access_level_2_url;
        } else if (!this.props.isLogged) {
            this.props.history.push('/');
        } else if (this.props.userRole=="ROLE_PRODUCTEUR") {

        } else if (this.props.userRole=="ROLE_ADMIN" && this.state.acc_id) {
            base_url = this.state.admin_base_url;
        } else if (this.props.userRole=="ROLE_ENTREPRISE" && this.state.acc_id) {
            base_url = this.state.entreprise_base_url;
        } else if (this.props.userRole=="ROLE_CONSULTANT" && this.state.acc_id) {
            if (this.state.access_level==1) {
                base_url = this.state.access_level_1_url;
            } else if (this.state.access_level==2) {
                base_url = this.state.access_level_2_url;
            } else {
                base_url = this.state.consultant_base_url;
            } 
        } else  {
            this.props.history.push('/');
        }
        const { isHidden } = this.state;

        const { years, photos, categories, passages, tagCategories, sites, isDrone, total, isArchieve } = this.state;

        var tagCategories_formatted = [];
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

        const translation = this.props.translation;
        const language = this.props.language;
        const isFrench = language == "FR";
        let multiselectname = isFrench ? "name_fr": "name_en" ;
        return (
            <div className={isHidden ? "sb-nav-fixed" : "sb-nav-fixed sb-sidenav-toggled"}>
                <Header base_url={base_url} acc_id={this.state.acc_id} access_level={this.state.access_level} access_key={this.state.access_key}></Header>
                <div className="pageLoaderIncluded">
                    {this.state.pageLoader ? <PageLoader></PageLoader> : null}
                    <div>
                        <main>
                            <div className="headerBecground" style={{ paddingLeft: "20px", paddingRight: "20px" }}>
                                <div class="btn-group BasicexampleMargin" role="group" aria-label="Basic example">

                                    <div class="dropdown dropDownPadding" >
                                        <select class="form-select form-control" aria-label="Text input with dropdown button" onChange={this.handleYears} value={this.state.selectedYear} style={{ backgroundColor: '#e9ecef' }}  >
                                            <option selected value="">{translation.Year}</option>
                                            {
                                                years.map((year) => (
                                                    <option value={year.id}>{year.name_fr}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <div>
                                        <div style={{ width: "200px", backgroundColor: '#e9ecef' }}>
                                            <Multiselect
                                                ref={this.multiselectCategoryTop}
                                                options={categories} // Options to display in the dropdown
                                                selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
                                                onSelect={this.onSelectCategories}
                                                onRemove={this.onRemove}// Function will trigger on select event
                                                displayValue={multiselectname} // Property name to display in the dropdown options
                                                showCheckbox="true"
                                                placeholder={translation.Categories}
                                            />
                                        </div>
                                    </div>
                                </div>
                        
                              
                                <div className="camTag">
                                    <a class="nav-link settingIconPointer" data-toggle="modal"
                                        data-target="#myModalright"><i class="fas fa-sliders-h"></i>{translation.All_filters}</a>
                                    
                                    {this.state.access_level != 2 && (
                                    <button type="button" data-toggle="modal" data-target="#largeModal"
                                        class="btn btn-labeled btn-primary">
                                        <span class="btn-label"><i class="fas fa-camera"></i></span> {translation.Add_photo}
                                    </button>
                                      )}
                                </div>
                              
                            </div>
                            <br clear="all"></br>
                            <div id="mainDivSelect" className="myDIV" style={{ paddingLeft: "20px", paddingRight: "20px" }}>
                                <div class="container-fluid">
                                    <div class="row">
                                        <div class="col-md-12">
                                            <div class="row">
                                                <div className="col-6">
                                                    <div class="col-md-4 col-lg-4 col-sm-4 col-xs-12 ">
                                                        <h5 className="modal-title p-1 d-inline"
                                                            id="exampleModalLabel">{translation.Photos}</h5>
                                                        <label class="p-2 d-inline" htmlFor="inputEmail">{this.state.total}</label>
                                                    </div>
                                                </div>
                                                {/* <label htmlFor="inputEmail" style={{ margin: '10px' }}>Inactive</label> */}
                                                <div className="col-6 text-right">
                                                    <strong>{translation.Favorites_only} &nbsp;&nbsp;</strong>
                                                    <label class="switch" >
                                                        <input type="checkbox"
                                                            value={this.state.isArchieve}
                                                            onChange={this.changeFavourite.bind(this)}
                                                            class="primary"></input>
                                                        <span class="slider round"></span>
                                                    </label>
                                                </div>
                                            </div>

                                            <br></br>
                                            <br></br>
                                            <div>
                                                {!this.state.dataLoaded ? (
                                                    <div className="text-center"><img src={dataLoader} /><br/><br/><br/></div>
                                                ) : (
                                                    <div id="grid" class="row">
                                                    {photos != null && (photos.map((photo, index) => (
                                                        <div className="mix col-sm-4 margin30" style={{ backgroundColor: "#000000", borderLeft: "15px #ffffff solid", borderRight: "0px #ffffff solid", padding: "0px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                            <div className="item-img-wrap " style={{ width: "100%", backgroundColor: "#000000" }}>
                                                                {/* <img src={Config.PhotoUrl + photo.url} */}
                                                                <img src={"data:image/png;base64," + photo.thumbnail_small} className="img-responsive" style={{ width: "100%", margin: "0px" }} alt="Photo" />
                                                                <div className="item-img-overlay">
                                                                    <a href="#" data-toggle="modal" data-target="#lightbox4"
                                                                        className="show-image" onClick={() => this.setSelectedPhoto(photo,(index+1))}>
                                                                        <span href="#carousel4" data-slide-to="5"></span>
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )))
                                                    }
                                                    </div>
                                                )} 
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="container-fluid">
                                    <div class="row gallery-bottom">
                                        <br clear="all" />
                                        <div class="col-sm-12">
                                            <div className="desktophidden">
                                                <div style={{ marginTop: "-33px" }}>
                                                    <Pagination
                                                        activePage={this.state.activePage}
                                                        itemsCountPerPage={this.state.limit}
                                                        totalItemsCount={total}
                                                        pageRangeDisplayed={1}
                                                        onChange={this.handlePageChange.bind(this)}
                                                        itemClass='page-item'
                                                        linkClass='page-link'
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-sm-12">
                                            <div className="mobilehidden">
                                                <div style={{ marginRight: "-5px", marginTop: "10px" }}>
                                                    <Pagination
                                                        activePage={this.state.activePage}
                                                        itemsCountPerPage={this.state.limit}
                                                        totalItemsCount={total}
                                                        pageRangeDisplayed={3}
                                                        onChange={this.handlePageChange.bind(this)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </main>

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
                                        <div class="dropdown dropDownPadding">
                                            <select class="form-select form-control" aria-label="Text input with dropdown button" onChange={this.handleYears} value={this.state.selectedYear}  >
                                                <option selected value="">{translation.Year}</option>
                                                {
                                                    years.map((year) => (
                                                        <option value={year.id}>{year.name_fr}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                        <br></br>
                                        <div>
                                            <div  >
                                                <Multiselect
                                                   ref={this.multiselectCategory}
                                                    options={categories} // Options to display in the dropdown
                                                    selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
                                                    onSelect={this.onSelectCategories}
                                                    onRemove={this.onRemove}// Function will trigger on select event
                                                    displayValue={multiselectname} // Property name to display in the dropdown options
                                                    showCheckbox="true"
                                                    placeholder={translation.Categories}
                                                />
                                            </div>
                                        </div>
                                        <br></br>
                                        {isDrone && (
                                            <div>
                                                <div >
                                                    <Multiselect
                                                        ref={this.multiselectPassage}
                                                        options={passages} // Options to display in the dropdown
                                                        selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
                                                        onSelect={this.onSelectPassages}
                                                        onRemove={this.onRemove}// Function will trigger on select event
                                                        displayValue={multiselectname} // Property name to display in the dropdown options
                                                        showCheckbox="true"
                                                        placeholder={translation.Passages}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        {isDrone && (
                                            <br></br>
                                        )}
                                        <div>
                                            <div>
                                                <Multiselect
                                                    ref={this.multiselectSite}
                                                    options={sites} // Options to display in the dropdown
                                                    selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
                                                    onSelect={this.onSelectSites}
                                                    onRemove={this.onRemove}// Function will trigger on select event
                                                    displayValue={multiselectname} // Property name to display in the dropdown options
                                                    showCheckbox="true"
                                                    placeholder={translation.Select_sites}
                                                />
                                            </div>
                                        </div>
                                        <br></br>
                                        <div>
                                            <div>
                                                <Multiselect
                                                    ref={this.multiselectTags}
                                                    options={tagCategories_formatted}
                                                    selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
                                                    onSelect={this.onSelectTags}
                                                    onRemove={this.onRemove}// Function will trigger on select event
                                                    displayValue={multiselectname} // Property name to display in the dropdown options
                                                    showCheckbox="true"
                                                    placeholder={translation.Select_tags}
                                                    groupBy="cat"
                                                />
                                            </div>
                                        </div>
                                        <br></br>
                                        <div className="checkbox" >
                                            <div className="checkbox">
                                                <div style={{ marginLeft: "10px" }}>
                                                    <input type="checkbox"
                                                        onChange={this.selectArchive.bind(this)}
                                                        checked={isArchieve}
                                                    />
                                                    <label style={{ fontSize: "15px", marginLeft: "15px" }}>
                                                    {translation.Archived_photos} {isArchieve}
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="modal-footer">
                                        <div class="col text-center">
                                            <button class="btn btn-outline-primary createButtonMargin" onClick={this.cleanFilter}>{translation.Delete_all}</button>
                                            {/* <button class="btn btn-primary createButtonMargin">Appliquer</button> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {this.state.selectedPhoto ? 
                        <SelectPhotos
                            photo={this.state.selectedPhoto}
                            token={this.props.token}
                            tags={this.state.selectedTags}
                            sites={this.state.selectedSites}
                            categories={this.state.selectedCategories}
                            years={this.state.selectedYear}
                            favourite={this.state.isFavourite}
                            archieveResult={this.state.archieveResult}
                            passages={this.state.selectedPassages} 
                            page={this.state.pagenumber}
                            total={this.state.total}
                            index={this.state.selectedIndex}
                            acc_id={this.state.acc_id}
                            access_level={this.state.access_level} 
                            access_key={this.state.access_key}
                            >
                            </SelectPhotos> : null}

                        {this.state.openPopupPhoto ? 
                            <div>
                                <a href="#" data-toggle="modal" data-target="#lightbox4" className="show-image" style={{display:"none"}}>
                                    <span href="#carousel4" data-slide-to="5" ref={input => this.inputElement = input}></span>
                                </a>
                                <NotificationPhotos
                                    photo={this.state.openPopupPhoto}
                                    token={this.props.token}
                                    tags={this.state.selectedTags}
                                    sites={this.state.selectedSites}
                                    categories={this.state.selectedCategories}
                                    years={this.state.selectedYear}
                                    favourite={this.state.isFavourite}
                                    archieveResult={this.state.archieveResult}
                                    passages={this.state.selectedPassages} 
                                    page={this.state.pagenumber}
                                    total={this.state.total}
                                    index={this.state.selectedIndex}
                                    acc_id={this.state.acc_id}
                                    openPopupPhotoArray={this.state.openPopupPhotoArray}
                                    access_level={this.state.access_level} 
                                    access_key={this.state.access_key}>
                                </NotificationPhotos>
                            </div>
                             : null}
                        <SettingPop acc_id={this.state.acc_id} access_level={this.state.access_level} 
                            access_key={this.state.access_key}></SettingPop>

                            {this.props.isLogged &&(
                        <UploadImages acc_id={this.state.acc_id} access_level={this.state.access_level} 
                            access_key={this.state.access_key} ></UploadImages>
                            )}
                    </div>
                </div>
                <Footer></Footer>
            </div >
        )
    }
}

export default connect(mapStateToProps, null)(withLanguageHook(Photos));