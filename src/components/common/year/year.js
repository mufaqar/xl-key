import 'bootstrap/dist/css/bootstrap.css'
import '../../../components/settingsMain.css'
import editIcon from "../../../public/img/edit_btn_icon.png"
import closeIcon from "../../../public/img/close_btn_icon.png"
import addIcon from "../../../public/img/add_btn_icon.png"
import glyphIvon from "../../../public/img/glyphicon.png"
import arrowUpIcon from "../../../public/img/icon-arrow-up.png"
import arrowDownIcon from "../../../public/img/icon-arrow-down.png"
import {Popover} from 'react-tiny-popover'
import cx from "classnames";
import Collapse from "@kunukn/react-collapse";
import React from "react";
import {connect} from 'react-redux';
import HideModal from "../../../components/hideModal";
import Api from "../../../helper/photo-api";
import YearPopUp from "./year-popup";
import useTranslation from "../../customHooks/translations";
import SitePopUp from "../site/site-popup";

const mapStateToProps = state => {
    let token = state.token;
    let userRole = state.userRole;
    let isLogged = state.isLogged;
    return {token, userRole, isLogged}
}

function withLanguageHook(Component) {
    return function WrappedComponent(props) {
        const translation = useTranslation();
        return <Component {...props} translation={translation}/>;
    }
}

class Year extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isHidden: false,
            api: new Api(this.props.token, this.props.acc_id),
            acc_id: this.props.acc_id,
            hideModal: new HideModal(),
            years: [],
            isExpanded: false,
            isPopoverOpen: false,
            popoverId: null,
            mobileYearPopoverId: null,
            message: "",
            type: this.props.type,
        }
        this.toggleOffer = this.toggleOffer.bind(this);
    }

    toggle = (data) => {
        this.setState((prevState) => ({isExpanded: data}));
    };

    togglePopover = (data) => {
        this.setState((prevState) => ({isPopoverOpen: data}));
    }

    toggleYearPopover = (index, prevPropCatId) => {
        let propCatId = index;
        if (prevPropCatId == index) {
            propCatId = null;
        }
        this.setState((prevState) => ({mobileYearPopoverId: propCatId}));
    }

    toggleOffer() {
        this.setState({
            isHidden: false
        })
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        this.setState({message: ""});
        this.state.api
            .getAllYears()
            .then(response => {
                console.log("data response**years******* ", response);
                this.setState({
                    years: response.data.data
                })
            })
            .catch(err => {
                if (err.response && err.response.status == 401) {
                    this.props.history.push('/');
                }
            });
    }

    deleteYear = (id) => {
        console.log("data  new delete** id", id);
        this.state.api
            .deleteYear(id)
            .then(response => {
                console.log("data  new delete** ", response);
                this.setState({message: response.data.message});
                setTimeout(this.state.hideModal.hideModal(), 1000);
                setTimeout(this.loadData(), 1000);

            })
            .catch(err => {
                if (err.response && err.response.status == 401) {
                    this.props.history.push('/');
                }
            });
    }

    render() {
        const {isHidden, years} = this.state
        const translation = this.props.translation;
        return (
            <div>
                {this.state.type !== "PRODUCTEUR" && (
                    <YearPopUp id={"modalAddYear"} data={{}} type={"create"}
                               title={"Ajouter une catégorie de years"} yearId="">
                    </YearPopUp>
                )}
                <div>
                    <button
                        className={cx("app__toggle", {
                            "app__toggle--active": this.state.isExpanded
                        })}
                        onClick={() => this.toggle(!this.state.isExpanded)}>
                        <div className="rotate90">
                            <svg
                                className={cx("icon", {"icon--expanded": this.state.isExpanded})}
                                viewBox="6 0 12 24">
                                <polygon points="8 0 6 1.8 14.4 12 6 22.2 8 24 18 12"/>
                            </svg>
                        </div>

                        <span className="app__toggle-text"
                              style={{fontWeight: 'bold'}}>Années/Years</span>

                        <Popover
                            isOpen={this.state.isPopoverOpen}
                            position={'bottom'}
                            containerClassName={'shadow'}
                            content={({position, nudgedLeft, nudgedTop}) => ( // you can also provide a render function that injects some useful stuff!
                                <div className="popover_style">
                                    {this.state.type !== "PRODUCTEUR" && (
                                        <div data-toggle="modal"
                                             data-target={"#addYears"}>
                                            <img src={addIcon} className="img-responsive"

                                                 alt="Responsive image"/>
                                            <strong className="poppver_text_style" htmlFor="inputEmail">
                                                {translation.Add_a_year}
                                            </strong>
                                        </div>
                                    )}
                                </div>
                            )}>
                            <div className="glyph-icon-posision"
                                 onClick={() => this.togglePopover(!this.state.isPopoverOpen)}>
                                <img src={glyphIvon} className="img-responsive"
                                     alt="Responsive image"/>
                            </div>
                        </Popover>
                        {this.state.type !== "PRODUCTEUR" && (
                            <YearPopUp id={"addYears" + ""} data={{}} type={"create"} acc_id={this.state.acc_id}
                                       title={"Ajouter un annee"} yearId="">
                            </YearPopUp>
                        )}

                    </button>

                    <Collapse
                        isOpen={this.state.isExpanded}
                        className={
                            "app__collapse app__collapse--gradient" +
                            (this.state.isExpanded ? "app__collapse--active" : "")
                            + "collaps_bg"}>
                        {years != null && years.length != 0 ?
                            (
                                <div>
                                    {(years).map((year) => (

                                        <div className="admin-column-white">
                                            <div className="row ">
                                                <div className="col-7">
                                                    <label
                                                        className="ml-4 mt-2 mb-3">{year.name_fr} / {year.name_en}</label>
                                                </div>
                                                <div className="col-5 align-center pl-0 pr-0">
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
                                                                 data-target={"#modalYear" + year.id}
                                                                 className="img-responsive image d-none d-sm-inline-block mt-0 mb-0"
                                                                 alt="Responsive "/>
                                                            <img src={closeIcon}
                                                                 className="img-responsive image d-none d-sm-inline-block mt-0 mb-0"
                                                                 alt="Responsive "
                                                                 data-toggle="modal"
                                                                 data-target={"#deleteYear" + year.id}/>
                                                            <div>
                                                                <Popover

                                                                    isOpen={this.state.mobileYearPopoverId == year.id ? true : false}
                                                                    position={'bottom'}
                                                                    containerClassName="shadow, pop-style-cat"
                                                                    content={({position, nudgedLeft, nudgedTop}) => ( // you can also provide a render function that injects some useful stuff!
                                                                        <div
                                                                            className="pop-main col-12 pt-2 pb-1">
                                                                            <div className="row">
                                                                                <img src={arrowDownIcon}
                                                                                     className="img-responsive image mt-0"
                                                                                     alt="Responsive image"/>
                                                                                <label
                                                                                    className="">{translation.Go_down}</label>
                                                                            </div>
                                                                            <div className="row">
                                                                                <img src={arrowUpIcon}
                                                                                     className="img-responsive image mt-0"
                                                                                     alt="Responsive image"/>
                                                                                <label
                                                                                    className="">{translation.Go_up}</label>
                                                                            </div>
                                                                            <div className="row">
                                                                                <img src={editIcon}
                                                                                     className="img-responsive image mt-0"
                                                                                     alt="Responsive image"
                                                                                     data-toggle="modal"
                                                                                     data-target={"#modalYear" + year.id}/>
                                                                                <label
                                                                                    className="">{translation.Edit}</label>
                                                                            </div>
                                                                            <div className="row">
                                                                                <img src={closeIcon}
                                                                                     className="img-responsive image mt-0"
                                                                                     alt="Responsive image"
                                                                                     data-toggle="modal"
                                                                                     data-target={"#deleteYear" + year.id}/>
                                                                                <label
                                                                                    className="">{translation.Delete}</label>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                >
                                                                    <img src={glyphIvon}
                                                                         className="img-responsive image d-inline-block d-sm-none mt-0 mb-0 mr-4"
                                                                         onClick={() => this.toggleYearPopover(year.id, this.state.mobileYearPopoverId)}
                                                                         alt="Responsive "/>
                                                                </Popover>
                                                            </div>
                                                        </div>
                                                        {this.state.type !== "PRODUCTEUR" && (
                                                            <div class="modal fade" id={"deleteYear" + year.id}
                                                                 tabindex="-1"
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
                                                                            <button type="button" class="close"
                                                                                    data-dismiss="modal"
                                                                                    aria-label="Close">
                                                                                <span aria-hidden="true">&times;</span>
                                                                            </button>
                                                                        </div>
                                                                        <div class="modal-footer">
                                                                            <button type="button"
                                                                                    class="btn btn-primary"
                                                                                    onClick={this.deleteYear.bind(null, year.id)}
                                                                                    style={{width: '40%'}}>
                                                                                {translation.Yes}
                                                                            </button>
                                                                            <button type="button"
                                                                                    class="btn btn-secondary"
                                                                                    data-dismiss="modal"
                                                                                    style={{width: '40%'}}>
                                                                                {translation.Close}
                                                                            </button>
                                                                            <br/>
                                                                            <label
                                                                                class="error-font-style">{this.state.message}</label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {this.state.type !== "PRODUCTEUR" && (
                                                            <YearPopUp id={"modalYear" + year.id} data={year}
                                                                       type={"update"} title={"Renommer la annee"}
                                                                       yearId={year.id}>
                                                            </YearPopUp>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )
                            :
                            (
                                <h6 className="text-left alert alert-primary ml-4 mr-4">
                                    {translation.No_Years_available}
                                </h6>
                            )
                        }
                    </Collapse>
                </div>
                <div className="vspace1em"></div>
            </div>
        )
    }
}

export default connect(mapStateToProps, null)(withLanguageHook(Year));