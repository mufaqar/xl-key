import 'bootstrap/dist/css/bootstrap.css';
import React, { Fragment, useRef, Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import { Popup } from "@progress/kendo-react-popup";
import Menuup from "../../../public/img/MenuUp.svg";
import Menudown from "../../../public/img/MenuDown.svg";
import dotbutton from "../../../public/img/dotbutton.svg";
import Add from "../../../public/img/Add.svg";
import Close from "../../../public/img/miniclose.svg";
import "./sidenavbar.css";
import arrowleft from "../../../public/img/arrowleft.svg";
import { connect, useSelector, useDispatch } from 'react-redux';
import { findByDisplayValue } from '@testing-library/react';
import cx from "classnames";
import { Popover } from 'react-tiny-popover';
import addIcon from "../../../public/img/add_btn_icon.png";
import Collapse from "@kunukn/react-collapse";
import Api from "../../../helper/notes-api";
import HideModal from "../../hideModal";
import { Button } from 'reactstrap';
import useTranslation from "../../../components/customHooks/translations";
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
        return <Component {...props} translation={translation} language={language}/>;
    }
}

class NoteSideNavigation extends React.Component {


    constructor(props) {
        super(props)
        this.state = {
            show: true,
            anchor: React.createRef(),
            folders: [],
            isHidden: false,
            api: new Api(this.props.token, this.props.acc_id, this.props.access_level, this.props.access_key),
            base_url: this.props.base_url,
            access_level: this.props.access_level,
            access_key: this.props.access_key,
            hideModal: new HideModal(),
            openFolderId: null,
            fields: {},
            message: "",
        }
        this.toggleOffer = this.toggleOffer.bind(this);
        this.addAccount = this.addAccount.bind(this);
        this.addPageSubmit = this.addPageSubmit.bind(this);
        this.onTrigger = this.onTrigger.bind(this);
    }

    state = {
        isPopoverOpen1: false
    };
    state = {
        isOpen1: false,
    };

    toggle = (index) => {
        let openFolderId = index;
        if (this.state.openFolderId == index) {
            openFolderId = null;
        }

        this.setState((prevState) => ({ openFolderId: openFolderId }));


    };

    toggleOffer() {
        this.setState({
            isHidden: false
        })

    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        this.state.api
            .getAllFolderswithAdmin()
            .then(response => {
                this.setState({
                    folders: response.data.data
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


    changeOpenFolder = (id) => {
        this.setState({ openFolderId: id })
    }

    addAccount(e) {
        const data = this.state.fields;;

        const dataObject = {
            "name_en": data.ename,
            "name_fr": data.fname,
            'lang': this.props.language,
        }


        this.state.api
            .createFolder(dataObject)
            .then(response => {
                data['ename'] = "";
                data['fname'] = "";
                this.setState({
                    message: response.data.message
                });
                setTimeout(window.location.reload(false), 500);
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

    }

    addAccountformSubmit(e) {
        e.preventDefault();
        let errors = {};
        this.setState({ message: '' });

        this.addAccount(e);

    }

    DeleteFolder = (id) => {
        this.state.api
            .deleteFolder(id)
            .then(response => {
                this.setState({ message: response.data.message });
                // setTimeout(this.state.hideModal.hideModal(), 1000);
                // setTimeout(this.loadData(), 1000);
                setTimeout(window.location.reload(false), 500);

            })
            .catch(err => {
                if (err.response && err.response.status == 401) {
                    this.props.history.push('/');
                }
            });

    }

    addPage(e) {
        // e.preventDefault();
        const data = this.state.fields;
        const dataObject = {
            "name_en": data.ename,
            "name_fr": data.fname,
            "folder_id": e.target.id,
            'lang': this.props.language,
        }
        this.state.api
            .createPage(dataObject)
            .then(response => {
                data['ename'] = "";
                data['fname'] = "";

                this.setState({
                    message: response.data.message,
                    fields: data
                });

                // this.state.hideModal.hideModal()
                // setTimeout(this.loadData, 500);
                setTimeout(window.location.reload(false), 500);

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

    }

    addPageSubmit(e) {
        e.preventDefault();
        let errors = {};
        this.addPage(e);
    }

    DeletePage = (id) => {
        this.state.api
            .deletePage(id)
            .then(response => {
                this.setState({ message: response.data.message });
                setTimeout(window.location.reload(false), 500);

            })
            .catch(err => {
                if (err.response && err.response.status == 401) {
                    this.props.history.push('/');
                }
            });

    }

    handleChange(field, e) {
        let fields = this.state.fields;
        fields[field] = e.target.value;
        this.setState({ fields });
    }

    onTrigger = (pageId, folderId, pageName, folderName, isMobile) => {

        this.props.history.push(this.state.base_url + '/notes/page/' + pageId + '/');
        this.props.parentCallback(pageId);

        if (isMobile) {
            this.onClickPopUP();
        }
    }

    onClickPopUP = () => {
        this.setState({
            show: !this.state.show
        })
    };



    render() {
        const { show, anchor, isPopoverOpen, folders } = this.state;

        const translation = this.props.translation;
        const language = this.props.language;
        const isFrench = language == "FR";
        return (
            <div>
                <div class=" mobilehidden">
                    <div id="layoutSidenav_nav">
                        <nav>
                            <div class="sb-sidenav-menu">
                                <div class="row">
                                    <div class="col-12">
                                        <h4 style={{ paddingLeft: '15px', paddingTop: '20px' }}>{translation.Notes}</h4>

                                    </div>
                                </div>
                                <hr></hr>

                                {folders.map((folder) => (

                                    <div class="row">

                                        <div class="col-6 text-left">
                                            <div class="previous">

                                                <button
                                                    className={cx("app__toggle", {
                                                        "app__toggle--active": this.state.isOpen1
                                                    })}
                                                    onClick={() => this.toggle(folder.id)}
                                                    style={{ backgroundColor: 'white', paddingTop: '0px' }}
                                                >

                                                    <span className="app__toggle-text" style={{ fontWeight: 'bold', textAlign: 'left' }}>{isFrench ? folder.name_fr : folder.name_en}</span>
                                                    <Popover
                                                        isOpen={this.state.isPopoverOpen1}
                                                        position={'bottom'}
                                                        containerClassName={'shadow'}
                                                        content={({ position, nudgedLeft, nudgedTop }) => ( // you can also provide a render function that injects some useful stuff!
                                                            <div className="popover_style">
                                                                <img src={addIcon} class="img-responsive" alt="Responsive image" />
                                                                <strong className="poppver_text_style" htmlFor="inputEmail">{translation.Add_a_tag}</strong>

                                                            </div>
                                                        )}
                                                    >
                                                        <div className="glyph-icon-posision"
                                                            onClick={() => this.setState({ isPopoverOpen1: !this.state.isPopoverOpen1 })}>

                                                        </div>
                                                    </Popover>
                                                </button>

                                                <Collapse
                                                    isOpen={this.state.openFolderId === folder.id ? true : false}

                                                    className={
                                                        "app__collapse app__collapse--gradient" +
                                                        (this.state.openFolderId === folder.id ? "app__collapse--active" : "")
                                                        + "collaps_bg"}
                                                    style={{ backgroundColor: 'white', width: '220%' }}
                                                >

                                                    {(folder.pages).map((page) => (
                                                        <div class="inner-service-row-margin-para  " style={{ marginLeft: '30px', marginBottom: '0px', zIndex: '99', position: "relative" }}>
                                                            <div class="row" style={{ backgroundColor: 'white' }}>
                                                                <div class="col" style={{ paddingRight: '0px' }} onClick={this.onTrigger.bind(this, page.id, folder.id, page.name_fr, folder.name_fr, false)} id={page.id}>
                                                                    <div class="row">
                                                                        <div class="col-6 text-left">
                                                                            <div class="previous">
                                                                                <p className="parastyle" name="pageId" value={page.id} style={{ backgroundColor: 'white' }}>{isFrench ? page.name_fr : page.name_en}</p>
                                                                            </div>
                                                                        </div>

                                                                    {this.state.access_level !=2 && (
                                                                        <div class="col-6 text-right">
                                                                            <div class="next">
                                                                                <a data-toggle="modal" data-target={"#deletePage" + page.id} href="#"><img className="producture-note-mini-icon-aligmment" src={Close} /></a>
                                                                            </div>
                                                                        </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div class="modal fade" id={"deletePage" + page.id} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                                    <div class="modal-dialog" role="document" style={{ maxWidth: '100%' }}>
                                                                        <div class="modal-content">
                                                                            <div class="modal-header">
                                                                                <h5 class="modal-title" id="exampleModalLabel">{translation.Do_you_want_to_delete}</h5>
                                                                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                                                    <span aria-hidden="true">&times;</span>
                                                                                </button>
                                                                            </div>
                                                                            <div class="modal-footer">
                                                                                <button type="button" class="btn btn-primary" onClick={this.DeletePage.bind(null, page.id)} style={{ width: '40%' }}>{translation.Yes}</button>
                                                                                <button type="button" class="btn btn-secondary" data-dismiss="modal" style={{ width: '40%' }} >{translation.Close}</button>
                                                                                <br />
                                                                                <label class="error-font-style" >{this.state.message}</label>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>


                                                            </div>
                                                        </div>
                                                    ))}



                                                </Collapse>

                                            </div>

                                        </div>

                                        {this.state.access_level != 2 && (
                                        <div class="col-6 text-right">

                                            <div class="next">
                                                <div class="row dropright" style={{ flexDirection: 'row-reverse' }}>

                                                    <button class="btn btn-outline-light" data-toggle="dropdown" aria-haspopup="true"
                                                        aria-expanded="false">

                                                        <img src={dotbutton} className="producteure-note-doted-button-aligment" />
                                                    </button>

                                                    <div class="dropdown-menu">
                                                        <a data-toggle="modal" data-target={"#AddPage" + folder.id} class="dropdown-item" href="#"><img className="producture-note-mini-icon-aligmment" src={Add} />{translation.Add_page}</a>

                                                        {folder.account_id != 1 && (
                                                            <a data-toggle="modal" data-target={"#deleteFolder" + folder.id} class="dropdown-item" href="#"><img className="producture-note-mini-icon-aligmment" src={Close} />&nbsp;{translation.Delete_folder}</a>
                                                        )}

                                                    </div>


                                                    <div class="modal fade" id={"deleteFolder" + folder.id} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                        <div class="modal-dialog" role="document" style={{ maxWidth: '100%' }}>
                                                            <div class="modal-content">
                                                                <div class="modal-header">
                                                                    <h5 class="modal-title" id="exampleModalLabel">{translation.Do_you_want_to_delete}</h5>
                                                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                                        <span aria-hidden="true">&times;</span>
                                                                    </button>
                                                                </div>
                                                                <div class="modal-footer">
                                                                    <button type="button" class="btn btn-primary" onClick={this.DeleteFolder.bind(null, folder.id)} style={{ width: '40%' }}>{translation.Yes}</button>
                                                                    <button type="button" class="btn btn-secondary" data-dismiss="modal" style={{ width: '40%' }} >{translation.Close}</button>
                                                                    <br />
                                                                    <label class="error-font-style" >{this.state.message}</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="modal fade" id={"AddPage" + folder.id} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                        <div class="modal-dialog" role="document" style={{ maxWidth: '100%' }}>
                                                            <div class="modal-content">
                                                                <div class="modal-header">
                                                                    <h5 class="modal-title" id="exampleModalLabel">{translation.Name_of_the_page}</h5>
                                                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                                        <span aria-hidden="true">&times;</span>
                                                                    </button>
                                                                </div>


                                                                <div class="modal-body">
                                                                    <div className="row">
                                                                        <div className="col-md-9 col-lg-8 mx-auto">
                                                                            <form name="addUserform" id={folder.id} onSubmit={this.addPageSubmit.bind(this)}>
                                                                                <div className="form-group row">
                                                                                    <strong htmlFor="inputEmail">{translation.Name} (EN)*</strong>
                                                                                    <input type="text" id="ename" name="ename" className="form-control" onChange={this.handleChange.bind(this, "ename")} value={this.state.fields["ename"]} required autoFocus />
                                                                                </div>
                                                                                <div className="form-group row">
                                                                                    <strong htmlFor="inputEmail">{translation.Name} (FR)*</strong>
                                                                                    <input type="text" id="fname" name="fname" className="form-control" onChange={this.handleChange.bind(this, "fname")} value={this.state.fields["fname"]} required />
                                                                                </div>

                                                                                <div class="vspace1em"></div>
                                                                                <div class="container-fluid">
                                                                                    <div class="row">
                                                                                        <button type="submit" value="Submit" class="btn btn-primary ml-auto primaryTop mobile_button">{translation.Submit}</button>
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
                                                </div>
                                            </div>
                                        </div>
                                        )}
                                    </div>
                                ))}
                                {this.state.access_level != 2 && (
                                    <div class="row">
                                        <div class="col-2"></div>
                                    <div class="col-10">
                                        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalWeb">{translation.Add_folder}</button>
                                        <div class="modal fade" id="exampleModalWeb" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                            <div class="modal-dialog" role="document" style={{ maxWidth: '100%' }}>
                                                <div class="modal-content">
                                                    <div class="modal-header">
                                                        <h5 class="modal-title" id="exampleModalLabel">{translation.Add_folder}</h5>
                                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                            <span aria-hidden="true">&times;</span>
                                                        </button>
                                                    </div>
                                            {/* <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalWeb">Ajouter un dossier</button> */}
                                            {/* <div class="modal fade" id="exampleModalWeb" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true"> */}
                                                {/* <div class="modal-dialog" role="document" style={{ maxWidth: '100%' }}> */}
                                                    {/* <div class="modal-content"> */}
                                                        {/* <div class="modal-header">
                                                            <h5 class="modal-title" id="exampleModalLabel">Ajouter un dossier</h5>
                                                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                                <span aria-hidden="true">&times;</span>
                                                            </button>
                                                        </div> */}
                                                    <div class="modal-body">
                                                        <div className="row">
                                                            <div className="col-md-9 col-lg-8 mx-auto">
                                                                <form name="addAccountform" onSubmit={this.addAccountformSubmit.bind(this)}>
                                                                    <div className="form-group row">
                                                                        <strong htmlFor="inputEmail">{translation.Name} (EN)*</strong>
                                                                        <input type="text" id="ename" name="ename" className="form-control" onChange={this.handleChange.bind(this, "ename")} value={this.state.fields["ename"]} required autoFocus />
                                                                    </div>
                                                                    <div className="form-group row">
                                                                        <strong htmlFor="inputEmail">{translation.Name} (FR)*</strong>
                                                                        <input type="text" id="fname" name="fname" className="form-control" onChange={this.handleChange.bind(this, "fname")} value={this.state.fields["fname"]} required />
                                                                    </div>

                                                                    <div class="vspace1em"></div>
                                                                    <div class="container-fluid">
                                                                        <div class="row">
                                                                            <button type="submit" value="Submit" class="btn btn-primary ml-auto primaryTop mobile_button">{translation.Submit}</button>
                                                                        </div>
                                                                        {/* <div className="form-group row">
                                                                            <strong htmlFor="inputEmail">Nom (FR)*</strong>
                                                                            <input type="text" id="fname" name="fname" className="form-control" onChange={this.handleChange.bind(this, "fname")} value={this.state.fields["fname"]} required />
                                                                        </div> */}

                                                                        {/* <div class="vspace1em"></div>
                                                                        <div class="container-fluid">
                                                                            <div class="row">
                                                                                <button type="submit" value="Submit" class="btn btn-primary ml-auto primaryTop mobile_button">Soumettre</button>
                                                                            </div>
                                                                        </div> */}
                                                                        <div class="vspace1em"></div>
                                                                        <div class="form-group row">
                                                                            <label for="inputPassword" class="col-sm-2 col-form-label"></label>
                                                                            <div class="col-sm-12">
                                                                                <label class="error-font-style" >{this.state.message}</label>
                                                                            </div>
                                                                        </div>
                                                                        </div>
                                                                    </form>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    {/* </div> */}
                                                {/* </div> */}
                                            {/* </div> */}
                                        </div>
                                    </div>
                            </div>
                            </div>
                            </div>
                                )}
                                </div>
                        </nav>
                        <br />
                        <br />
                    </div>
                </div>
                <div className="desktophidden">
                    <div class="row">
                        <div className="col-12">
                            <button class="btn btn-light full-width-btn" onClick={this.onClickPopUP} ref={anchor}>
                                <div className="navbarbuttonstyle">
                                    {translation.Notes}
                                    {show ? <img src={Menudown} /> : <img src={Menuup} />}
                                </div>
                            </button>
                            {!show ? <Popup anchor={anchor.current} show={!show} popupClass={'popup-content'}
                                className="producture-note-mobile-sidebar-background-color">
                                <div className="producture-note-mobile-sidebar-font-color">

                                    {folders.map((folder) => (

                                        <div class="row">
                                            <div class="col-1"> </div>

                                            <div class="col-7">

                                                <button
                                                    className={cx("app__toggle", {
                                                        "app__toggle--active": this.state.isOpen1
                                                    })}
                                                    onClick={() => this.toggle(folder.id)}
                                                    style={{ backgroundColor: 'white', paddingTop: '0px' }}
                                                >

                                                    <span className="app__toggle-text" style={{ fontWeight: 'bold', textAlign: 'left' }}>{isFrench ? folder.name_fr : folder.name_en}</span>
                                                    <Popover
                                                        isOpen={this.state.isPopoverOpen1}
                                                        position={'bottom'}
                                                        containerClassName={'shadow'}
                                                        content={({ position, nudgedLeft, nudgedTop }) => ( // you can also provide a render function that injects some useful stuff!
                                                            <div className="popover_style">
                                                                <img src={addIcon} class="img-responsive" alt="Responsive image" />
                                                                <strong className="poppver_text_style" htmlFor="inputEmail">{translation.Add_a_tag}</strong>
                                                            </div>
                                                        )}
                                                    >
                                                        <div className="glyph-icon-posision"
                                                            onClick={() => this.setState({ isPopoverOpen1: !this.state.isPopoverOpen1 })}>

                                                        </div>
                                                    </Popover>
                                                </button>

                                                <Collapse
                                                    isOpen={this.state.openFolderId === folder.id ? true : false}

                                                    className={
                                                        "app__collapse app__collapse--gradient" +
                                                        (this.state.openFolderId === folder.id ? "app__collapse--active" : "")
                                                        + "collaps_bg"}
                                                    style={{ backgroundColor: 'white', width: '150%' }}
                                                >

                                                    {(folder.pages).map((page) => (
                                                        <div class="inner-service-row-margin-para ">
                                                            <div class="row" style={{ backgroundColor: 'white' }}>


                                                                <div class="col" style={{ paddingRight: '0px' }}>

                                                                    <div class="row" onClick={this.onTrigger.bind(this, page.id, folder.id, page.name_fr, folder.name_fr, true)} id={page.id}>
                                                                        <div class="col-6 text-left">
                                                                            <div class="previous">
                                                                                <p className="parastyle" name="pageId" value={page.id} style={{ backgroundColor: 'white' }}>{isFrench ? page.name_fr : page.name_en}</p>
                                                                            </div>
                                                                        </div>

                                                                        {this.state.access_level != 2 && (
                                                                        <div class="col-6 text-right">
                                                                            <div class="next">
                                                                                <a data-toggle="modal" data-target={"#deletePageMobile" + page.id} href="#"><img className="producture-note-mini-icon-aligmment" src={Close} /></a>
                                                                            </div>
                                                                        </div>
                                                                        )}
                                                                    </div>

                                                                    {/* <p className="parastyle" style={{ backgroundColor: 'white', marginTop: '-23px' }}>{page.name_fr}</p>
                                                                    <a data-toggle="modal" data-target={"#deletePageMobile" + page.id} href="#"><img className="producture-note-mini-icon-aligmment" src={Close} /></a> */}

                                                                </div>
                                                                <div class="modal fade" id={"deletePageMobile" + page.id} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                                    <div class="modal-dialog" role="document" style={{ maxWidth: '100%' }}>
                                                                        <div class="modal-content">
                                                                            <div class="modal-header">
                                                                                <h5 class="modal-title" id="exampleModalLabel">{translation.Do_you_want_to_delete}</h5>
                                                                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                                                    <span aria-hidden="true">&times;</span>
                                                                                </button>
                                                                            </div>
                                                                            <div class="modal-footer">
                                                                                <button type="button" class="btn btn-primary" onClick={this.DeletePage.bind(null, page.id)} style={{ width: '40%' }}>{translation.Yes}</button>
                                                                                <button type="button" class="btn btn-secondary" data-dismiss="modal" style={{ width: '40%' }} >{translation.Close}</button>
                                                                                <br />
                                                                                <label class="error-font-style" >{this.state.message}</label>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </Collapse>

                                            </div>
                                      
                                        
                                            <div class="col-4">
                                                <div class="row">

                                                    <button class="btn btn-outline-light" data-toggle="dropdown" aria-haspopup="true"
                                                        aria-expanded="false">
                                                        <img src={dotbutton} className="producteure-note-doted-button-aligment" />
                                                    </button>

                                                    <div class="dropdown-menu" style={{ marginLeft: "-82px" }}>
                                                        <a data-toggle="modal" data-target={"#AddPageMobile" + folder.id} class="dropdown-item" href="#"><img className="producture-note-mini-icon-aligmment" src={Add} />{translation.Add_page}</a>

                                                        {folder.account_id != 1 && (
                                                        <a data-toggle="modal" data-target={"#deleteFolderMobile" + folder.id} class="dropdown-item" href="#"><img className="producture-note-mini-icon-aligmment" src={Close} />&nbsp;{translation.Delete_folder}</a>
                                                        )}
                                                    </div>


                                                    <div class="modal fade" id={"deleteFolderMobile" + folder.id} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                        <div class="modal-dialog" role="document" style={{ maxWidth: '100%' }}>
                                                            <div class="modal-content">
                                                                <div class="modal-header">
                                                                    <h5 class="modal-title" id="exampleModalLabel">{translation.Do_you_want_to_delete}</h5>
                                                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                                        <span aria-hidden="true">&times;</span>
                                                                    </button>
                                                                </div>
                                                                <div class="modal-footer">
                                                                    <button type="button" class="btn btn-primary" onClick={this.DeleteFolder.bind(null, folder.id)} style={{ width: '40%' }}>{translation.Yes}</button>
                                                                    <button type="button" class="btn btn-secondary" data-dismiss="modal" style={{ width: '40%' }} >{translation.Close}</button>
                                                                    <br />
                                                                    <label class="error-font-style" >{this.state.message}</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="modal fade" id={"AddPageMobile" + folder.id} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                        <div class="modal-dialog" role="document" style={{ maxWidth: '100%' }}>
                                                            <div class="modal-content">
                                                                <div class="modal-header">
                                                                    <h5 class="modal-title" id="exampleModalLabel">{translation.Name_of_the_page}</h5>
                                                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                                        <span aria-hidden="true">&times;</span>
                                                                    </button>
                                                                </div>

                                                                <div class="modal-body">
                                                                    <div className="row">
                                                                        <div className="mx-auto">
                                                                            <form name="addUserform" id={folder.id} onSubmit={this.addPageSubmit.bind(this)}>
                                                                                <div className="form-group row">
                                                                                    <strong htmlFor="inputEmail">{translation.Name} (EN)*</strong>
                                                                                    <input type="text" id="ename" name="ename" className="form-control" onChange={this.handleChange.bind(this, "ename")} value={this.state.fields["ename"]} required autoFocus />
                                                                                </div>
                                                                                <div className="form-group row">
                                                                                    <strong htmlFor="inputEmail">{translation.Name} (FR)*</strong>
                                                                                    <input type="text" id="fname" name="fname" className="form-control" onChange={this.handleChange.bind(this, "fname")} value={this.state.fields["fname"]} required />
                                                                                </div>

                                                                                <div class="vspace1em"></div>
                                                                                <div class="container-fluid">
                                                                                    <div class="row">
                                                                                        <button type="submit" value="Submit" class="btn btn-primary ml-auto primaryTop mobile_button">{translation.Submit}</button>
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

                                                </div>
                                            </div>
                                           
                                        </div>

                                    ))}

                                    <div class="row">
                                        <div class="col-2"></div>

                                        <div class="col-10">

                                            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalMobile">{translation.Add_folder}</button>
                                            <div class="modal fade" id="exampleModalMobile" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                <div class="modal-dialog" role="document" style={{ maxWidth: '100%' }}>
                                                    <div class="modal-content">
                                                        <div class="modal-header">
                                                            <h5 class="modal-title" id="exampleModalLabel">{translation.Add_folder}</h5>
                                                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                                <span aria-hidden="true">&times;</span>
                                                            </button>
                                                        </div>
                                                        <div class="modal-body">
                                                            <div className="row">
                                                                <div className="mx-auto">
                                                                    <form name="addAccountform" onSubmit={this.addAccountformSubmit.bind(this)}>
                                                                        <div className="form-group row">
                                                                            <strong htmlFor="inputEmail">{translation.Name} (EN)*</strong>
                                                                            <input type="text" id="ename" name="ename" className="form-control" onChange={this.handleChange.bind(this, "ename")} value={this.state.fields["ename"]} required autoFocus />
                                                                        </div>
                                                                        <div className="form-group row">
                                                                            <strong htmlFor="inputEmail">{translation.Name} (FR)*</strong>
                                                                            <input type="text" id="fname" name="fname" className="form-control" onChange={this.handleChange.bind(this, "fname")} value={this.state.fields["fname"]} required />
                                                                        </div>

                                                                        <div class="vspace1em"></div>
                                                                        <div class="container-fluid">
                                                                            <div class="row">
                                                                                <button type="submit" value="Submit" class="btn btn-primary ml-auto primaryTop mobile_button">{translation.Submit}</button>
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
                                        </div>



                                    </div>



                                </div>
                            </Popup> : null}
                        </div>
                    </div>

                </div>

            </div>
        );
    }

}

export default connect(mapStateToProps, null)(withRouter(withLanguageHook(NoteSideNavigation)));

