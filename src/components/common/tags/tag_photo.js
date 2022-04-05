import '../../../components/settingsMain.css'
import 'bootstrap/dist/css/bootstrap.css';
import alertIcon from "../../../public/img/alert_icon.png"
import editIcon from "../../../public/img/edit_btn_icon.png"
import closeIcon from "../../../public/img/close_btn_icon.png"
import addIcon from "../../../public/img/add_btn_icon.png"
import glyphIvon from "../../../public/img/glyphicon.png"
import arrowUpIcon from "../../../public/img/icon-arrow-up.png"
import arrowDownIcon from "../../../public/img/icon-arrow-down.png"
import {Popover} from 'react-tiny-popover'
import "../../../components/App.scss";
import cx from "classnames";
import Collapse from "@kunukn/react-collapse";
import React from "react";
import Api from "../../../helper/photo-api";
import HideModal from "../../../components/hideModal";
import TagPopUp from "./tagphotopopup"
import {connect} from 'react-redux';
import dataLoader from "../../../dataLoading.gif";
import PassagePopUp from "../passage/passage-popup";
import loading from "../../../loading.gif";
import useTranslation from "../../customHooks/translations";

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
        return <Component {...props} translation={translation}/>;
    }
}

class TagPhotos extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            // isHidden: true,
            isHidden: false,
            api: new Api(this.props.token),
            hideModal: new HideModal(),
            tagCategories: [],
            tagCatId: null,
            popoverId: null,
            mobileTagPopoverId: null,
            message: "",
            type: this.props.type,
            dataLoaded: false,
            isDeleting: false,
        }
        this.toggleOffer = this.toggleOffer.bind(this);

    }

    toggle = (index, prevTagCatId) => {
        let tagCatId = index;
        if (prevTagCatId == index) {
            tagCatId = null;
        }
        this.setState((prevState) => ({ tagCatId: tagCatId }));
    };

    togglePopover = (index, prevPropCatId) => {
        let propId = index;
        if (prevPropCatId == index) {
            propId = null;
        }
        this.setState((prevState) => ({ popoverId: propId }));
    }

    toggleTagPopover = (index, prevTagPropCatId) => {
        let propTagId = index;
        if (prevTagPropCatId == index) {
            propTagId = null;
        }
        this.setState((prevState) => ({ mobileTagPopoverId: propTagId }));
    }


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
        this.setState({ message: "" });
        this.state.api
            .getphotoTagCategoriesAll()
            .then(response => {
                console.log("data response**tags******* ", response);
                this.setState({
                    tagCategories: response.data.data,
                    dataLoaded: true,
                })

            })
            .catch(err => {
                if (err.response && err.response.status == 401) {
                    this.props.history.push('/');
                }
            });
    }

    DeleteTagCategory = (id) => {
        console.log("data  new delete** id", id);
        this.setState({isDeleting: true})
        this.state.api
            .deletePhotoTagsCategories(id)
            .then(response => {
                console.log("data  new delete** ", response);
                this.setState({ message: response.data.message,isDeleting: false });
                setTimeout(this.state.hideModal.hideModal(), 1000);
                setTimeout(this.loadData(), 1000);

            })
            .catch(err => {
                this.setState({isDeleting: false})
                if (err.response && err.response.status == 401) {
                    this.props.history.push('/');
                }
            });

    }

    DeleteTag = (id) => {
        console.log("data  new delete** id", id);
        this.setState({isDeleting: true})
        this.state.api
            .deletePhotoTags(id)
            .then(response => {
                console.log("data  new delete** ", response);
                this.setState({ message: response.data.message,isDeleting: false });
                setTimeout(this.state.hideModal.hideModal(), 1000);
                setTimeout(this.loadData(), 1000);
            })
            .catch(err => {
                this.setState({isDeleting: false})
                if (err.response && err.response.status == 401) {
                    this.props.history.push('/');
                }
            });

    }

    render() {
        const translation = this.props.translation;
        const { isHidden, tagCategories, type } = this.state
        return (
            <div class="card my-cart">
                <div className="col-md-11 col-lg-11 mx-auto">
                    <h5 className="modal-title textColor headerTop" id="exampleModalLabel">
                        {translation.Managing_photo_tags}
                    </h5>
                    <div class="container-fluid">
                        <div class="row">
                            <button type="button"
                                data-target="#modalAddCategory"
                                data-toggle="modal"
                                class="btn btn-primary primaryTop mobile_button">
                                {translation.Add_a_tag_category}
                            </button>
                        </div>
                    </div>

                    <TagPopUp id={"modalAddCategory"} data={{}} type={"create"} category={"categoryTags"} title={"Ajouter une catégorie de tags"} categoryId="" ></TagPopUp>

                    {this.state.dataLoaded ?
                        (
                            tagCategories != null && tagCategories.length != 0 ?
                                (<div>
                                    {tagCategories.map((tagCategory) => (
                                        <div>
                                            <div class="vspace1em"></div>

                                            {(type != "admin" && tagCategory.account_id == 1) && (
                                                <div class="alert alert-secondary" role="alert">

                                                    <div class="row">
                                                        <div class="column_left_alert">
                                                            <img src={alertIcon}
                                                                 class="form-group img-responsive img-center align-me"
                                                                 alt="workimg"/>
                                                        </div>
                                                        <div class="column_right_alert">
                                                            <p>{translation.This_tag_category_cannot_be_deleted}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            <button
                                                className={cx("app__toggle", {
                                                    "app__toggle--active": this.state.tagCatId === tagCategory.id ? true : false
                                                })}
                                                onClick={() => this.toggle(tagCategory.id, this.state.tagCatId)}
                                            >
                                                <div className="rotate90">
                                                    <svg
                                                        className={cx("icon", {"icon--expanded": this.state.tagCatId === tagCategory.id ? true : false})}
                                                        viewBox="6 0 12 24"
                                                    >
                                                        <polygon points="8 0 6 1.8 14.4 12 6 22.2 8 24 18 12"/>
                                                    </svg>
                                                </div>

                                                <span className="app__toggle-text"
                                                      style={{fontWeight: 'bold'}}>{tagCategory.name_fr} / {tagCategory.name_en}</span>

                                                {(type != "admin" && tagCategory.account_id != 1) && (
                                                    <Popover
                                                        isOpen={this.state.popoverId == tagCategory.id ? true : false}
                                                        position={'bottom'}
                                                        containerClassName={'shadow'}
                                                        content={({position, nudgedLeft, nudgedTop}) => ( // you can also provide a render function that injects some useful stuff!
                                                            <div className="popover_style">
                                                                <div data-toggle="modal"
                                                                     data-target={"#addTags" + tagCategory.id}>
                                                                    <img src={addIcon} class="img-responsive"

                                                                         alt="Responsive image"/>
                                                                    <strong className="poppver_text_style"
                                                                            htmlFor="inputEmail">{translation.Add_a_tag}</strong>
                                                                </div>
                                                                <div data-toggle="modal"
                                                                     data-target={"#updateCat" + tagCategory.id}>
                                                                    <img src={editIcon} class="img-responsive"

                                                                         alt="Responsive image"/>
                                                                    <strong className="poppver_text_style"
                                                                            htmlFor="inputEmail">{translation.Rename_category}</strong>
                                                                </div>
                                                                <div data-toggle="modal"
                                                                     data-target={"#deleteCat" + tagCategory.id}>
                                                                    <img src={closeIcon} class="img-responsive"

                                                                         alt="Responsive image"/>
                                                                    <strong className="poppver_text_style"
                                                                            htmlFor="inputEmail">{translation.Delete_a_tag_category}</strong>
                                                                </div>
                                                            </div>
                                                        )}
                                                    >
                                                        <div className="glyph-icon-posision"
                                                             onClick={() => this.togglePopover(tagCategory.id, this.state.popoverId)}>
                                                            <img src={glyphIvon} class="img-responsive"
                                                                 alt="Responsive image"/>
                                                        </div>
                                                    </Popover>

                                                )}
                                                {(type == "admin") && (
                                                    <Popover
                                                        isOpen={this.state.popoverId == tagCategory.id ? true : false}
                                                        position={'bottom'}
                                                        containerClassName={'shadow'}
                                                        content={({position, nudgedLeft, nudgedTop}) => ( // you can also provide a render function that injects some useful stuff!
                                                            <div className="popover_style">
                                                                <div data-toggle="modal"
                                                                     data-target={"#addTags" + tagCategory.id}>
                                                                    <img src={addIcon} class="img-responsive"

                                                                         alt="Responsive image"/>
                                                                    <strong className="poppver_text_style"
                                                                            htmlFor="inputEmail">{translation.Add_a_tag}</strong>
                                                                </div>
                                                                <div data-toggle="modal"
                                                                     data-target={"#updateCat" + tagCategory.id}>
                                                                    <img src={editIcon} class="img-responsive"

                                                                         alt="Responsive image"/>
                                                                    <strong className="poppver_text_style"
                                                                            htmlFor="inputEmail">{translation.Rename_category}</strong>
                                                                </div>
                                                                <div data-toggle="modal"
                                                                     data-target={"#deleteCat" + tagCategory.id}>
                                                                    <img src={closeIcon} class="img-responsive"

                                                                         alt="Responsive image"/>
                                                                    <strong className="poppver_text_style"
                                                                            htmlFor="inputEmail">{translation.Delete_a_tag_category}</strong>
                                                                </div>
                                                            </div>
                                                        )}
                                                    >
                                                        <div className="glyph-icon-posision"
                                                             onClick={() => this.togglePopover(tagCategory.id, this.state.popoverId)}>
                                                            <img src={glyphIvon} class="img-responsive"
                                                                 alt="Responsive image"/>
                                                        </div>
                                                    </Popover>

                                                )}


                                                <TagPopUp id={"addTags" + tagCategory.id} data={{}} type={"create"}
                                                          category={"Tags"} title={"Ajouter un tag"}
                                                          categoryId={tagCategory.id}></TagPopUp>
                                                <TagPopUp id={"updateCat" + tagCategory.id} data={tagCategory}
                                                          type={"update"} category={"categoryTags"}
                                                          title={"Mise à jour d'une catégorie de tags"}
                                                          categoryId=""></TagPopUp>


                                                <div class="modal fade" id={"deleteCat" + tagCategory.id} tabindex="-1"
                                                     role="dialog" aria-labelledby="exampleModalLabel"
                                                     aria-hidden="true">
                                                    <div class="modal-dialog" role="document"
                                                         style={{maxWidth: '100%'}}>
                                                        <div class="modal-content">
                                                            <div class="modal-header">
                                                                <h5 class="modal-title"
                                                                    id="exampleModalLabel">
                                                                    {translation.Do_you_want_to_delete_this_item}
                                                                </h5>
                                                                <button type="button" class="close" data-dismiss="modal"
                                                                        aria-label="Close">
                                                                    <span aria-hidden="true">&times;</span>
                                                                </button>
                                                            </div>
                                                            <div class="modal-footer">
                                                                <button type="button" class="btn btn-primary"
                                                                        onClick={this.DeleteTagCategory.bind(null, tagCategory.id)}
                                                                        style={{width: '40%'}}>
                                                                    {translation.Yes}
                                                                </button>
                                                                <button type="button" class="btn btn-secondary"
                                                                        data-dismiss="modal"
                                                                        style={{width: '40%'}}>
                                                                    {translation.Close}
                                                                </button>
                                                                <br/>
                                                                <label
                                                                    class="error-font-style">{this.state.message}</label>
                                                            </div>
                                                            {
                                                                this.state.isDeleting ? (
                                                                    <div className="text-center"><img class="ml-5" src={loading}/><br/><br/></div>
                                                                ) : null
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>


                                            <Collapse
                                                isOpen={this.state.tagCatId === tagCategory.id ? true : false}
                                                className={
                                                    "app__collapse app__collapse--gradient" +
                                                    (this.state.tagCatId === tagCategory.id ? "app__collapse--active" : "")
                                                    + "collaps_bg"}
                                            >

                                                {tagCategory.tags != null && tagCategory.tags.length != 0 ?
                                                    (
                                                        <div>
                                                            {(tagCategory.tags).map((tag) => (
                                                                <div className="admin-column-white">
                                                                    <div className="row ">
                                                                        <div className="col-7">
                                                                            <label
                                                                                className="ml-4 mt-2 mb-3">{tag.name_fr} / {tag.name_en}</label>
                                                                        </div>

                                                                        {(type != "admin" && tagCategory.account_id != 1) && (
                                                                            <div
                                                                                className="col-5 align-center pl-0 pr-0">
                                                                                <div className="text-right">
                                                                                    <div>
                                                                                        <img src={arrowDownIcon}
                                                                                             className="img-responsive image d-none d-sm-inline-block mt-0 mb-0"
                                                                                             alt="Responsive "/>
                                                                                        <img src={arrowUpIcon}
                                                                                             className="img-responsive image d-none d-sm-inline-block mt-0 mb-0"
                                                                                             alt="Responsive "/>
                                                                                        <img src={editIcon}
                                                                                             data-toggle="modal"
                                                                                             data-target={"#modalTag" + tag.id}
                                                                                             className="img-responsive image d-none d-sm-inline-block mt-0 mb-0"
                                                                                             alt="Responsive "/>
                                                                                        <img src={closeIcon}
                                                                                             className="img-responsive image d-none d-sm-inline-block mt-0 mb-0"
                                                                                             alt="Responsive "
                                                                                             data-toggle="modal"
                                                                                             data-target={"#deleteTag" + tag.id}/>
                                                                                        <div>
                                                                                            <Popover

                                                                                                isOpen={this.state.mobileTagPopoverId == tag.id ? true : false}
                                                                                                position={'bottom'}
                                                                                                containerClassName="shadow, pop-style-cat"
                                                                                                content={({position, nudgedLeft, nudgedTop}) => ( // you can also provide a render function that injects some useful stuff!
                                                                                                    <div
                                                                                                        className="pop-main col-12 pt-2 pb-1">
                                                                                                        <div
                                                                                                            className="row">
                                                                                                            <img
                                                                                                                src={arrowDownIcon}
                                                                                                                className="img-responsive image mt-0"
                                                                                                                alt="Responsive image"/>
                                                                                                            <label
                                                                                                                className="">{translation.Go_down}</label>
                                                                                                        </div>
                                                                                                        <div
                                                                                                            className="row">
                                                                                                            <img
                                                                                                                src={arrowUpIcon}
                                                                                                                className="img-responsive image mt-0"
                                                                                                                alt="Responsive image"/>
                                                                                                            <label
                                                                                                                className="">{translation.Go_up}</label>
                                                                                                        </div>
                                                                                                        <div
                                                                                                            className="row">
                                                                                                            <img
                                                                                                                src={editIcon}
                                                                                                                className="img-responsive image mt-0"
                                                                                                                alt="Responsive image"
                                                                                                                data-toggle="modal"
                                                                                                                data-target={"#modalTag" + tag.id}/>
                                                                                                            <label
                                                                                                                className="">{translation.Edit}</label>
                                                                                                        </div>
                                                                                                        <div
                                                                                                            className="row">
                                                                                                            <img
                                                                                                                src={closeIcon}
                                                                                                                className="img-responsive image mt-0"
                                                                                                                alt="Responsive image"
                                                                                                                data-toggle="modal"
                                                                                                                data-target={"#deleteTag" + tag.id}/>
                                                                                                            <label
                                                                                                                className="">{translation.Delete}</label>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                )}
                                                                                            >
                                                                                                <img src={glyphIvon}
                                                                                                     className="img-responsive image d-inline-block d-sm-none mt-0 mb-0 mr-4"
                                                                                                     onClick={() => this.toggleTagPopover(tag.id, this.state.mobileTagPopoverId)}
                                                                                                     alt="Responsive "/>
                                                                                            </Popover>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div class="modal fade"
                                                                                         id={"deleteTag" + tag.id}
                                                                                         tabindex="-1"
                                                                                         role="dialog"
                                                                                         aria-labelledby="exampleModalLabel"
                                                                                         aria-hidden="true">
                                                                                        <div class="modal-dialog"
                                                                                             role="document"
                                                                                             style={{maxWidth: '100%'}}>
                                                                                            <div class="modal-content">
                                                                                                <div
                                                                                                    class="modal-header">
                                                                                                    <h5 class="modal-title"
                                                                                                        id="exampleModalLabel">
                                                                                                        {translation.Do_you_want_to_delete_this_item}
                                                                                                    </h5>
                                                                                                    <button
                                                                                                        type="button"
                                                                                                        class="close"
                                                                                                        data-dismiss="modal"
                                                                                                        aria-label="Close">
                                                                                            <span
                                                                                                aria-hidden="true">&times;</span>
                                                                                                    </button>
                                                                                                </div>
                                                                                                <div
                                                                                                    class="modal-footer">
                                                                                                    <button
                                                                                                        type="button"
                                                                                                        class="btn btn-primary"
                                                                                                        onClick={this.DeleteTag.bind(null, tag.id)}
                                                                                                        style={{width: '40%'}}>
                                                                                                        {translation.Yes}
                                                                                                    </button>
                                                                                                    <button
                                                                                                        type="button"
                                                                                                        class="btn btn-secondary"
                                                                                                        data-dismiss="modal"
                                                                                                        style={{width: '40%'}}>
                                                                                                        {translation.Close}
                                                                                                    </button>

                                                                                                    <br/>
                                                                                                    <label
                                                                                                        class="error-font-style">{this.state.message}</label>
                                                                                                </div>
                                                                                                {
                                                                                                    this.state.isDeleting ? (
                                                                                                        <div className="text-center"><img class="ml-5" src={loading}/><br/><br/></div>
                                                                                                    ) : null
                                                                                                }
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>

                                                                                    <TagPopUp id={"modalTag" + tag.id}
                                                                                              data={tag}
                                                                                              type={"update"}
                                                                                              category={"Tag"}
                                                                                              title={"Renommer la catégorie"}
                                                                                              categoryId={tagCategory.id}></TagPopUp>


                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                        {type == "admin" && (
                                                                            <div
                                                                                className="col-5 align-center pl-0 pr-0">
                                                                                <div className="text-right">
                                                                                    <div>
                                                                                        <img src={arrowDownIcon}
                                                                                             className="img-responsive image d-none d-sm-inline-block mt-0 mb-0"
                                                                                             alt="Responsive "/>
                                                                                        <img src={arrowUpIcon}
                                                                                             className="img-responsive image d-none d-sm-inline-block mt-0 mb-0"
                                                                                             alt="Responsive "/>
                                                                                        <img src={editIcon}
                                                                                             data-toggle="modal"
                                                                                             data-target={"#modalTag" + tag.id}
                                                                                             className="img-responsive image d-none d-sm-inline-block mt-0 mb-0"
                                                                                             alt="Responsive "/>
                                                                                        <img src={closeIcon}
                                                                                             className="img-responsive image d-none d-sm-inline-block mt-0 mb-0"
                                                                                             alt="Responsive "
                                                                                             data-toggle="modal"
                                                                                             data-target={"#deleteTag" + tag.id}/>
                                                                                        <div>
                                                                                            <Popover

                                                                                                isOpen={this.state.mobileTagPopoverId == tag.id ? true : false}
                                                                                                position={'bottom'}
                                                                                                containerClassName="shadow, pop-style-cat"
                                                                                                content={({position, nudgedLeft, nudgedTop}) => ( // you can also provide a render function that injects some useful stuff!
                                                                                                    <div
                                                                                                        className="pop-main col-12 pt-2 pb-1">
                                                                                                        <div
                                                                                                            className="row">
                                                                                                            <img
                                                                                                                src={arrowDownIcon}
                                                                                                                className="img-responsive image mt-0"
                                                                                                                alt="Responsive image"/>
                                                                                                            <label
                                                                                                                className="">{translation.Go_down}</label>
                                                                                                        </div>
                                                                                                        <div
                                                                                                            className="row">
                                                                                                            <img
                                                                                                                src={arrowUpIcon}
                                                                                                                className="img-responsive image mt-0"
                                                                                                                alt="Responsive image"/>
                                                                                                            <label
                                                                                                                className="">{translation.Go_up}</label>
                                                                                                        </div>
                                                                                                        <div
                                                                                                            className="row">
                                                                                                            <img
                                                                                                                src={editIcon}
                                                                                                                className="img-responsive image mt-0"
                                                                                                                alt="Responsive image"
                                                                                                                data-toggle="modal"
                                                                                                                data-target={"#modalTag" + tag.id}/>
                                                                                                            <label
                                                                                                                className="">{translation.Edit}</label>
                                                                                                        </div>
                                                                                                        <div
                                                                                                            className="row">
                                                                                                            <img
                                                                                                                src={closeIcon}
                                                                                                                className="img-responsive image mt-0"
                                                                                                                alt="Responsive image"
                                                                                                                data-toggle="modal"
                                                                                                                data-target={"#deleteTag" + tag.id}/>
                                                                                                            <label
                                                                                                                className="">{translation.Delete}</label>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                )}
                                                                                            >
                                                                                                <img src={glyphIvon}
                                                                                                     className="img-responsive image d-inline-block d-sm-none mt-0 mb-0 mr-4"
                                                                                                     onClick={() => this.toggleTagPopover(tag.id, this.state.mobileTagPopoverId)}
                                                                                                     alt="Responsive "/>
                                                                                            </Popover>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div class="modal fade"
                                                                                         id={"deleteTag" + tag.id}
                                                                                         tabindex="-1"
                                                                                         role="dialog"
                                                                                         aria-labelledby="exampleModalLabel"
                                                                                         aria-hidden="true">
                                                                                        <div class="modal-dialog"
                                                                                             role="document"
                                                                                             style={{maxWidth: '100%'}}>
                                                                                            <div class="modal-content">
                                                                                                <div
                                                                                                    class="modal-header">
                                                                                                    <h5 class="modal-title"
                                                                                                        id="exampleModalLabel">
                                                                                                        {translation.Do_you_want_to_delete_this_item}
                                                                                                    </h5>
                                                                                                    <button
                                                                                                        type="button"
                                                                                                        class="close"
                                                                                                        data-dismiss="modal"
                                                                                                        aria-label="Close">
                                                                                            <span
                                                                                                aria-hidden="true">&times;</span>
                                                                                                    </button>
                                                                                                </div>
                                                                                                <div
                                                                                                    class="modal-footer">
                                                                                                    <button
                                                                                                        type="button"
                                                                                                        class="btn btn-primary"
                                                                                                        onClick={this.DeleteTag.bind(null, tag.id)}
                                                                                                        style={{width: '40%'}}>
                                                                                                        {translation.Yes}
                                                                                                    </button>
                                                                                                    <button
                                                                                                        type="button"
                                                                                                        class="btn btn-secondary"
                                                                                                        data-dismiss="modal"
                                                                                                        style={{width: '40%'}}>
                                                                                                        {translation.Close}
                                                                                                    </button>
                                                                                                    <br/>
                                                                                                    <label
                                                                                                        class="error-font-style">{this.state.message}</label>
                                                                                                </div>
                                                                                                {
                                                                                                    this.state.isDeleting ? (
                                                                                                        <div className="text-center"><img class="ml-5" src={loading}/><br/><br/></div>
                                                                                                    ) : null
                                                                                                }
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>

                                                                                    <TagPopUp id={"modalTag" + tag.id}
                                                                                              data={tag}
                                                                                              type={"update"}
                                                                                              category={"Tag"}
                                                                                              title={"Renommer la catégorie"}
                                                                                              categoryId={tagCategory.id}></TagPopUp>


                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>


                                                                </div>
                                                            ))}
                                                        </div>
                                                    )
                                                    :
                                                    (
                                                        <h6 className="text-left alert alert-primary ml-4 mr-4">
                                                            {translation.No_tags_available}
                                                        </h6>
                                                    )
                                                }

                                            </Collapse>
                                        </div>
                                    ))}
                                </div>)
                                :
                                (
                                    <div>
                                        <br/><br/>
                                        <h6 className="text-left alert alert-primary ml-4 mr-4">
                                            {translation.No_users_found}
                                        </h6>
                                        <br/>
                                    </div>
                                )
                        ) :
                        (
                            <div className="text-center">
                                <br/><br/><img src={dataLoader}/><br/><br/><br/><br/>
                            </div>
                        )
                    }

                </div>
                <br />
            </div>



        )
    }
}

export default connect(mapStateToProps, null)(withLanguageHook(TagPhotos));