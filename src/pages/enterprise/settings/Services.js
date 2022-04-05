import 'bootstrap/dist/css/bootstrap.css';
import alertIcon from "../../../public/img/alert_icon.png"
import React from "react";
import NavBar from "../../../components/layout/main-navigation/EnterpriseMainNavigation";
import Footer from "../../../components/layout/footer/EnterpriseFooter"
import SlideBar from "../../../components/layout/side-navigation/EnterpriseSideNavigation.js";
import {connect} from 'react-redux';
import Api from "../../../helper/service-api";
import ServicesList from "../../../components/services-list/services-list";
import useTranslation from "../../../components/customHooks/translations";

const mapStateToProps = state => {
    let token = state.token;
    let userRole = state.userRole;
    let isLogged = state.isLogged;
    return {token, userRole, isLogged}
}

function withLanguageHook(Component) {
    return function WrappedComponent(props) {
        const translation = useTranslation();
        return <Component {...props} translation={translation} />;
    }
}

class Services extends React.Component {
    constructor(props) {
        super(props)
        const acc_id = this.props.match.params.acc_id;
        this.state = {
            isHidden: false,
            api: new Api(this.props.token, acc_id),
            acc_id:acc_id,
            base_url:"/entreprise",
            admin_base_url:"/admin/entreprise/"+acc_id,
            entreprise_base_url:"/entreprise/entreprise/"+acc_id,
            consultant_base_url:"/consultant/entreprise/"+acc_id,
        }
    }

    render() {
        let base_url = this.state.base_url;
        if (!this.props.isLogged) {
            this.props.history.push('/');
        } else if (this.props.userRole=="ROLE_ENTREPRISE") {

        } else if (this.props.userRole=="ROLE_ADMIN" && this.state.acc_id) {
            base_url = this.state.admin_base_url;
        } else  {
            this.props.history.push('/');
        }
        
        const {isHidden} = this.state
        const translation = this.props.translation;
        return (
            <div className={isHidden ? "sb-nav-fixed" : "sb-nav-fixed sb-sidenav-toggled"}>
                <NavBar base_url={base_url} acc_id={this.state.acc_id}></NavBar>
                <div>
                    <div id="layoutSidenav_content" class="settings_content">
                        <main>
                            <div class="container-fluid" id="mainDivSelect">
                                <div class="row">
                                    <div className="col-md-3 sidebarbackgroundcolour">
                                        <SlideBar base_url={base_url}></SlideBar>
                                    </div>
                                    <div className="col-md-9 nopadding mb-5">
                                        <div class="card">
                                            <div className="col-md-11 col-lg-11 mx-auto">
                                                <h5 className="modal-title textColor headerTop" id="exampleModalLabel">
                                                    {translation.Services}
                                                </h5>
                                                <div class="alert alert-secondary" role="alert">
                                                    <div class="row">
                                                        <div class="column_left_alert">
                                                            <img src={alertIcon}
                                                                 class="form-group img-responsive img-center align-me"
                                                                 alt="workimg"/>
                                                        </div>
                                                        <div class="column_right_alert">
                                                            <p>{translation.already_created_by_XLKey}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <ServicesList acc_id={this.state.acc_id}></ServicesList>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </main>
                        <br/><br/>
                        <Footer/>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, null)(withLanguageHook(Services));