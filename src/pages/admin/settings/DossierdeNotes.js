import React from 'react';
import '../../../components/settingsMain.css'
import editIcon from "../../../public/img/edit_btn_icon.png"
import closeIcon from "../../../public/img/close_btn_icon.png"
import arrowDownIcon from "../../../public/img/icon-arrow-down.png";
import arrowUpIcon from "../../../public/img/icon-arrow-up.png";
import glyphIvon from "../../../public/img/glyphicon.png";
import { Popover } from "react-tiny-popover";
import NavBar from "../../../components/layout/main-navigation/AdminMainNavigation";
import Footer from "../../../components/layout/footer/AdminFooter";
import SlideBar from "../../../components/layout/side-navigation/AdminSideNavigation";
import Api from "../../../helper//notes-api";
import DeletePopUp from '../../../components/Admin/settings/deletedossier';
import CategoryPopUp from './dossierPopup';
import playIcon from "../../../public/img/sqr_play_icon.png"
import pauseIcon from "../../../public/img/sqr_pause_icon.png"
import { connect, useSelector, useDispatch } from 'react-redux';
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

class DossierdeNotes extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isHidden: false,
            api: new Api(this.props.token),
            consultantCategories: [],
            folders: [],
            mobileTagPopoverId: null,
            idActiveList: []
        }
        this.toggleOffer = this.toggleOffer.bind(this);
    }

    toggleTagPopover = (index, prevTagPropCatId) => {
        let propTagId = index;
        if (prevTagPropCatId == index) {
            propTagId = null;
        }
        this.setState((prevState) => ({ mobileTagPopoverId: propTagId }));
    }

    toggle = (index) => {
        let collapse = "isOpen" + index;
        this.setState((prevState) => ({ [collapse]: !prevState[collapse] }));
    };


    toggleOffer() {
        this.setState({
            // isHidden: !this.state.isHidden
            isHidden: false
        })
    }

    componentDidMount() {

        this.loadData();
    }


    loadData = () => {
        this.state.api
            .getAllFolders()
            .then(response => {
                console.log("data response********* ", response);
                let folders = response.data.data;
                let FolderId = [];
                let n = 0;
                folders.forEach(folder => {
            
                    if(folder.status == "active"){
                        FolderId[n] = folder.id;
                    }
                    n++;
                });


                this.setState({
                    folders: response.data.data,
                    idActiveList: FolderId
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


    deleteCategory = (id) => {
        this.state.api
            .deleteFolder(id)
            .then(response => {
                console.log("data  new delete** ", response);
                this.setState({ message: response.data.message });
            })
            .catch(err => {
                console.log(err);
            });

    }

    handleClick(e) {
        let ID = Number(e.target.id);
        let newIdList = this.state.idActiveList;
        if (newIdList.includes(ID)) {
            var index = newIdList.indexOf(ID)
            newIdList.splice(index, 1);
            this.updateFolderStatus(ID, "inactive");
        } else {
            newIdList.push(ID);
            this.updateFolderStatus(ID, "active");
        }

        this.setState({idActiveList: newIdList})

    }

    updateFolderStatus(id, status) {


        const dataObject = {
            "status": status,
            "lang": this.props.language
        }


        this.state.api
            .updateFolder([id, dataObject])
            .then(response => {
                console.log("data  new ", response);
                this.setState({
                    message: response.data.message
                });
                this.loadData();
            })
            .catch(err => {
                if (err.response && err.response.status == 401) {
                    this.props.history.push('/');
                }
            });
    }

    render() {
        const { consultantCategories, folders, idActiveList, } = this.state;

        if (!this.props.isLogged) {
            this.props.history.push('/');
        } else if (this.props.userRole != "ROLE_ADMIN") {
            this.props.history.push('/');
        }
        const { isHidden } = this.state
        const translation = this.props.translation;
        return (
            <div className={isHidden ? "sb-nav-fixed" : "sb-nav-fixed sb-sidenav-toggled"}>
                <NavBar></NavBar>
                <div id="mainDivSelect">
                    <div id="layoutSidenav_content" class="settings_content">
                        <main>
                            <div class="container-fluid">
                                <div class="row">
                                    <div className="col-md-3 sidebarbackgroundcolour">
                                        <SlideBar></SlideBar>
                                    </div>
                                    <div className="col-md-9 nopadding">
                                        <div class="card my-cart mb-5">
                                            <div className="col-lg-11 col-md-11 mx-auto">
                                                <h5 className="modal-title textColor headerTop"
                                                    id="exampleModalLabel">{translation.Notes_files}
                                                </h5>

                                                <div
                                                    className="row alert alert-secondary alert-margin mb-3 ml-0 mr-0 align-center btn-right-pad"
                                                    role="alert">
                                                    <div className="col-7">
                                                        <div className="row">
                                                            <label className="mt-1 mb-1 ml-2">{translation.Add_a_note_folder}</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-5 align-center pl-0 pr-0">
                                                        <div className="text-right">
                                                            <button type="button"
                                                                data-target="#addAccount"
                                                                data-toggle="modal"
                                                                className="btn btn-primary ml-auto">{translation.Add}
                                                            </button>
                                                        </div>
                                                        <CategoryPopUp id={"addAccount"} data={{}} type={"create"}></CategoryPopUp>
                                                    </div>
                                                </div>
                                                {folders.map((folder) => (
                                                    <div className="row border mb-3 ml-0 mr-0">
                                                        <div className="col-7">
                                                            <div className="row">
                                                                <label className="ml-4 mt-2 mb-3">{folder.name_fr} /
                                                                    {folder.name_en}</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-5 align-center pl-0 pr-0">
                                                            <div className="text-right">
                                                                <div>
                                                                    <img onClick={this.handleClick.bind(this)} id={folder.id}
                                                                        src={idActiveList.includes(folder.id) ? pauseIcon : playIcon}
                                                                        className="img-responsive image d-none d-sm-inline-block mt-0 mb-0"
                                                                        alt="Responsive image" />

                                                                    <img src={editIcon}
                                                                        className="img-responsive image d-none d-sm-inline-block mt-0 mb-0"
                                                                        alt="Responsive image"
                                                                        data-toggle="modal"
                                                                        data-target={"#modal" + folder.id} />

                                                                    <img src={closeIcon}
                                                                        className="img-responsive image d-none d-sm-inline-block mt-0 mb-0"
                                                                        alt="Responsive "
                                                                        data-toggle="modal"
                                                                        data-target={"#exampleModaldelete" + folder.id} />

                                                                    <DeletePopUp id={"exampleModaldelete" + folder.id} dataId={folder.id} type={"category"} ></DeletePopUp>


                                                                    <div>
                                                                        <Popover
                                                                            isOpen={this.state.mobileTagPopoverId == folder.id ? true : false}
                                                                            position={'bottom'}
                                                                            containerClassName="shadow, pop-dossiernotes"
                                                                            content={({ position, nudgedLeft, nudgedTop }) => ( // you can also provide a render function that injects some useful stuff!
                                                                                <div className="pop-main col-12 pt-2 pb-1">

                                                                                    <div className="row">
                                                                                        <img onClick={this.handleClick.bind(this)} id={folder.id}
                                                                                            src={idActiveList.includes(folder.id) ? pauseIcon : playIcon}
                                                                                            className="img-responsive image mt-0"
                                                                                            alt="Responsive image" />
                                                                                        <label className="">{translation.status}</label>
                                                                                    </div>

                                                                                    <div className="row">
                                                                                        <img src={editIcon}
                                                                                            className="img-responsive image mt-0"
                                                                                            alt="Responsive image"
                                                                                            data-toggle="modal"
                                                                                            data-target={"#modal" + folder.id} />

                                                                                        <label className="">{translation.Edit}</label>
                                                                                    </div>
                                                                                    <div className="row">
                                                                                        <img src={closeIcon}
                                                                                            className="img-responsive image mt-0"
                                                                                            alt="Responsive image"
                                                                                            data-toggle="modal"
                                                                                            data-target={"#exampleModaldelete" + folder.id} />
                                                                                        <label
                                                                                            className="">{translation.Delete}</label>

                                                                                        <DeletePopUp id={"exampleModaldelete" + folder.id} dataId={folder.id} type={"category"} ></DeletePopUp>

                                                                                    </div>
                                                                                </div>


                                                                            )}
                                                                        >
                                                                            <img src={glyphIvon}
                                                                                className="img-responsive image d-inline-block d-sm-none mt-0 mb-0 mr-4"
                                                                                onClick={() => this.toggleTagPopover(folder.id, this.state.mobileTagPopoverId)}
                                                                                alt="Responsive " />


                                                                        </Popover>
                                                                    </div>

                                                                    <div class="modal fade" id={"modalDelete" + folder.id} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                                        <div class="modal-dialog" role="document" style={{ maxWidth: '100%' }}>
                                                                            <div class="modal-content">
                                                                                <div class="modal-header">
                                                                                    <h5 class="modal-title" id="exampleModalLabel">{translation.Do_you_want_to_delete_this_item}</h5>
                                                                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                                                        <span aria-hidden="true">&times;</span>
                                                                                    </button>
                                                                                </div>
                                                                                <div class="modal-footer">
                                                                                    <button type="button" value={folder.id} class="btn btn-primary" style={{ width: '40%' }}>{translation.Yes}</button>
                                                                                    <button type="button" class="btn btn-secondary" data-dismiss="modal" style={{ width: '40%' }} >{translation.Close}</button>
                                                                                    <br />
                                                                                    <label class="error-font-style" >{this.state.message}</label>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <CategoryPopUp id={"modal" + folder.id} data={folder} type={"update"}></CategoryPopUp>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Footer></Footer>
                        </main>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, null)(withLanguageHook(DossierdeNotes));