import 'bootstrap/dist/css/bootstrap.css';
import './Home.css';
import React from 'react'
// import '../settingPopUp.css';
import {connect} from 'react-redux';
import useTranslation from "../customHooks/translations";
import getLanguage from "../customHooks/get-language";
import Api from "../../helper/notes-api";
import HideModal from "../hideModal";

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
        this.state = {
            isHidden: false,
            api: new Api(this.props.token, this.props.acc_id),
            imageUrl: this.props.imageUrl,
            acc_id: this.props.acc_id,
            hideModal: new HideModal(),
            message: "",
            folders: [],
            pages: [],
            selectedFolderId: null,
            selectedPageId: null,
        }
        this.handleFolders = this.handleFolders.bind(this);
        this.handlePages = this.handlePages.bind(this);
        this.navigateToNote = this.navigateToNote.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        this.setState({message: ""});
        this.state.api
            .getAllFolderswithAdmin()
            .then(response => {
                this.setState({
                    folders: response.data.data,
                    // pages: response.data.data[0].pages
                })
            })
            .catch(err => {
                if (err.response && err.response.status == 401) {
                    this.props.history.push('/');
                }
            });
    }

    handleFolders(e) {
        const selectedFolderId = e.target.value;
        if (selectedFolderId) {
            const selectedFolder = this.state.folders.find(folder => folder.id == selectedFolderId);
            this.setState({
                selectedFolderId: selectedFolderId,
                selectedPageId: selectedFolder.pages != null && selectedFolder.pages.length != 0 ? selectedFolder.pages[0].id : null,
                pages: selectedFolder.pages
            });
        } else {
            this.setState({
                selectedFolderId: null,
                selectedPageId: null,
                pages: null
            });
        }
    }

    handlePages(e) {
        const selectedPageId = e.target.value;
        this.setState({
            selectedPageId: selectedPageId
        });
    }

    navigateToNote(e) {
        console.log(this.state.selectedFolderId);
        console.log(this.state.selectedPageId);
        console.log("/producteur/notes/page/" + this.state.selectedPageId);
        let url;
        if (this.state.selectedPageId) {
            url = "/producteur/notes/page/" + this.state.selectedPageId + "/?image_url=" + this.state.imageUrl;
        } else {
            url = "/producteur/notes"
        }
        window.location.href = url;
    }

    render() {
        const {folders, pages} = this.state;
        const translation = this.props.translation;
        const language = this.props.language;
        const isFrench = language == "FR";
        return (
            <div class="modal fade" id={this.props.id} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
                 aria-hidden="true">
                <div class="modal-dialog note-popup-dialog" role="document" style={{maxWidth: '100%'}}>
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title"
                                id="exampleModalLabel">{translation.select_note_folder_and_page}</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body align-center">
                            <div className="row">
                                <label className="mt-2">{translation.select_a_folder}</label>
                                <div className="dropdown dropDownPadding ml-3">
                                    <select className="form-select form-control" onChange={this.handleFolders}
                                            aria-label="Text input with dropdown button">
                                        <option selected value="">{translation.folder}</option>
                                        {(folders).map((folder) => (
                                            <option value={folder.id}>{isFrench ? folder.name_fr :  folder.name_en}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <br/>
                            {pages != null && pages.length != 0 &&
                            <div className="row">
                                <label className="mt-2">{translation.select_a_page}</label>
                                <div className="dropdown dropDownPadding ml-3">
                                    <select className="form-select form-control" onChange={this.handlePages}
                                            aria-label="Text input with dropdown button">
                                        {/*<option selected value="">Page</option>*/}
                                        {(pages).map((page) => (
                                            <option value={page.id}>{isFrench ? page.name_fr :  page.name_en}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            }
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary" onClick={this.navigateToNote}
                                    style={{width: '40%'}}>{translation.Yes}</button>
                            <button type="button" class="btn btn-secondary" data-dismiss="modal"
                                    style={{width: '40%'}}>{translation.Close}</button>
                            <br/>
                            {/*<label class="error-font-style">{this.state.message}</label>*/}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default connect(mapStateToProps, null)(withLanguageHook(Modal));
