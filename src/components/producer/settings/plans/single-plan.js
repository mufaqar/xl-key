import 'bootstrap/dist/css/bootstrap.css'
import '../../../../components/settingsMain.css'
import closeIcon from "../../../../public/img/close_btn_icon.png"
import React from "react";
import {connect} from 'react-redux';
import HideModal from "../../../../components/hideModal";
import Api from "../../../../helper/plan-api";
import fuicon from "../../../../public/img/fileuploadicon.png";
import useTranslation from "../../../customHooks/translations";

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

class SinglePlan extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isHidden: false,
            api: new Api(this.props.token),
            hideModal: new HideModal(),
            plan: this.props.plan,
            isExpanded: false,
            isPopoverOpen: false,
            popoverId: null,
            mobilePlanPopoverId: null,
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

    togglePlanPopover = (index, prevPropCatId) => {
        let propCatId = index;
        if (prevPropCatId == index) {
            propCatId = null;
        }
        this.setState((prevState) => ({mobilePlanPopoverId: propCatId}));
    }

    toggleOffer() {
        this.setState({
            isHidden: false
        })
    }

    deletePlan = (id) => {
        console.log("data  new delete** id", id);
        this.state.api
            .deletePlan(id)
            .then(response => {
                console.log("data  new delete** ", response);
                this.setState({message: response.data.message});
                setTimeout(this.state.hideModal.hideModal(), 1000);
                setTimeout(window.location.reload(false), 500);
            })
            .catch(err => {
                if (err.response.status == 401) {
                    this.props.history.push('/');
                }
            });
    }

    render() {
        const {isHidden, plan} = this.state
        const translation = this.props.translation;
        return (
            <div style={{display: "contents"}}>
                <div className="form-label-group ">
                    <div className="form-item-margin">
                        <strong htmlFor="inputEmail">{plan.title_en}</strong>
                    </div>
                </div>

                <div className="container mt-2 mb-4">
                    <div className="row border ">
                        <div className="col-md-6 col-xs-12 text-left">
                            <img src={fuicon}
                                 style={{margin: '8px', marginRight: '20px'}}/>
                            <label style={{marginTop: '8px'}}
                                   htmlFor="inputEmail">{plan.pdf_link}</label>
                        </div>
                        <div className="col-md-6 col-xs-12 text-right button-align-mobile">
                            <React.Fragment>
                                <a href={process.env.REACT_APP_IMAGE_URL + "download/" + plan.pdf_link.replace('uploads/', '')}>
                                    <button type="button" className="btn btn-outline-primary "
                                            style={{marginTop: '8px', marginBottom: '8px', marginRight: '20px'}}>
                                        {translation.Download}
                                    </button>
                                </a>
                            </React.Fragment>
                            <img src={closeIcon} style={{margin: '10px'}}
                                 className="ml-auto d-none d-sm-inline-block"
                                 data-toggle="modal"
                                 data-target={"#deletePlan" + plan.id}/>
                        </div>

                        <div className="modal fade" id={"deletePlan" + plan.id}
                             tabIndex="-1"
                             role="dialog" aria-labelledby="exampleModalLabel"
                             aria-hidden="true">
                            <div className="modal-dialog" role="document"
                                 style={{maxWidth: '100%'}}>
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title"
                                            id="exampleModalLabel">
                                            {translation.Do_you_want_to_delete_this_item}
                                        </h5>
                                        <button type="button" className="close" data-dismiss="modal"
                                                aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-primary"
                                                onClick={this.deletePlan.bind(null, plan.id)}
                                                style={{width: '40%'}}>
                                            {translation.Yes}
                                        </button>
                                        <button type="button" className="btn btn-secondary"
                                                data-dismiss="modal"
                                                style={{width: '40%'}}>
                                            {translation.Close}
                                        </button>
                                        <br/>
                                        <label
                                            className="error-font-style">{this.state.message}</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, null)(withLanguageHook(SinglePlan));