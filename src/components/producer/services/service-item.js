import 'bootstrap/dist/css/bootstrap.css'
import '../../../components/settingsMain.css'
import cx from "classnames";
import Collapse from "@kunukn/react-collapse";
import React from "react";
import {connect} from 'react-redux';
import Api from "../../../helper/service-api";
import useTranslation from "../../customHooks/translations";
import getLanguage from "../../customHooks/get-language";

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

class Service extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isHidden: false,
            api: new Api(this.props.token),
            service: this.props.service,
            isExpanded: false,
            message: "",
            type: this.props.type,
        }
    }

    toggle = (data) => {
        this.setState((prevState) => ({isExpanded: data}));
    };

    openLink = (isFrench) => {
        window.open(isFrench ? this.state.service.form_link_fr : this.state.service.form_link_en, '_blank');
    }

    render() {
        const {isHidden, service} = this.state;
        const translation = this.props.translation;
        const language = this.props.language;
        const isFrench = language == "FR";
        return (
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
                          style={{fontWeight: 'bold'}}>{isFrench ? service.title_fr : service.title_en}</span>
                </button>

                <Collapse
                    isOpen={this.state.isExpanded}
                    className={
                        "app__collapse app__collapse--gradient" +
                        (this.state.isExpanded ? "app__collapse--active" : "")
                        + "collaps_bg"}>
                    <div className="inner-service-row-margin-para ">
                        <p className="parastyle">{isFrench ? service.description_fr : service.description_en}</p>
                    </div>

                    <div className="inner-service-row-margin-category">
                        <div style={{fontWeight: 'bold'}}> &nbsp;&nbsp; {translation.Contact_information}</div>
                        {/*&nbsp;&nbsp;&nbsp;Geoffrey Blanc<br/>*/}
                        &nbsp;&nbsp;{isFrench ? service.contact_1_fr : service.contact_1_en} - &nbsp;&nbsp;{isFrench ? service.contact_2_fr : service.contact_2_en}
                    </div>

                    <div className="inner-service-button-aligment">
                        <button type="button" className="btn btn-primary primaryTop"
                                onClick={() => this.openLink(isFrench)}>
                            {translation.Make_a_request_for_this_service}
                        </button>
                    </div>
                </Collapse>
                <div className="vspace1em"></div>
            </div>
        )
    }
}

export default connect(mapStateToProps, null)(withLanguageHook(Service));