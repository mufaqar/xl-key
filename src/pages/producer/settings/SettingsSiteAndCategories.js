import SlideBar from '../../../components/layout/side-navigation/ProducerSideNavigation.js';
import '../../../components/settingsMain.css'
import 'bootstrap/dist/css/bootstrap.css';
import NavBar from '../../../components/layout/main-navigation/ProducerMainNavigation';
import alertIcon from "../../../public/img/alert_icon.png"
import Footer from '../../../components/layout/footer/ProducerFooter';
import "../../../components/App.scss";
import React from 'react';
import {connect} from 'react-redux';
import Categories from "../../../components/common/category/category";
import Years from "../../../components/common/year/year";
import Passages from "../../../components/common/passage/passage";
import Sites from "../../../components/common/site/site";
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
        return <Component {...props} translation={translation}/>;
    }
}

class SettingsSiteAndCategories extends React.Component {
    constructor(props) {
        super(props)
        const acc_id = this.props.match.params.acc_id;
        this.state = {
            isHidden: false,

            acc_id: acc_id,
            base_url: "/producteur",
            admin_base_url: "/admin/producteur/" + acc_id,
            entreprise_base_url: "/entreprise/producteur/" + acc_id,
            consultant_base_url: "/consultant/producteur/" + acc_id,
        }
        this.toggleOffer = this.toggleOffer.bind(this);
    }

    toggleOffer() {
        this.setState({
            isHidden: false
        })
    }

    render() {
        let base_url = this.state.base_url;
        if (!this.props.isLogged) {
            this.props.history.push('/');
        } else if (this.props.userRole == "ROLE_PRODUCTEUR") {

        } else if (this.props.userRole == "ROLE_ADMIN" && this.state.acc_id) {
            base_url = this.state.admin_base_url;
        } else if (this.props.userRole == "ROLE_ENTREPRISE" && this.state.acc_id) {
            base_url = this.state.entreprise_base_url;
        } else if (this.props.userRole == "ROLE_CONSULTANT" && this.state.acc_id) {
            base_url = this.state.consultant_base_url;
        } else {
            this.props.history.push('/');
        }
        const {isHidden} = this.state
        const translation = this.props.translation;
        const type = this.props.userRole == "ROLE_PRODUCTEUR" ? "PRODUCTEUR" : "ADMIN";
        return (
            <div className={isHidden ? "sb-nav-fixed" : "sb-nav-fixed sb-sidenav-toggled"}>
                <NavBar base_url={base_url} acc_id={this.state.acc_id}></NavBar>
                <div id="mainDivSelect">
                    <div id="layoutSidenav_content" class="settings_content">
                        <main>
                            <div class="container-fluid">
                                <div class="row">
                                    <div className="col-md-3 sidebarbackgroundcolour">
                                        <SlideBar base_url={base_url}></SlideBar>
                                    </div>
                                    <div className="col-md-9 nopadding mb-4">
                                        <div class="card my-cart">
                                            <div className="col-md-11 col-lg-11 mx-auto disabled">
                                                <h5 className="modal-title textColor headerTop"
                                                    id="exampleModalLabel">{translation.Category_Management}</h5>

                                                <div class="alert alert-secondary" role="alert">

                                                    <div class="row">
                                                        <div class="column_left_alert ">
                                                            <img src={alertIcon}
                                                                 class="form-group img-responsive img-center align-me"
                                                                 alt="workimg"/>
                                                        </div>
                                                        <div class="column_right_alert">
                                                            <p>
                                                                {translation.Category_para1}
                                                                <strong> {translation.Categories} </strong>
                                                                {translation.Category_para2}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div style={{opacity: 0.4}}>
                                                    <Years type="PRODUCTEUR" base_url={base_url} acc_id={this.state.acc_id}></Years>
                                                </div>

                                                <div style={{opacity: 0.4}}>
                                                    <Categories type="PRODUCTEUR" base_url={base_url} acc_id={this.state.acc_id}></Categories>
                                                </div>
                                                <div class="vspace1em"></div>

                                                <div style={{opacity: 0.4}}>
                                                    <Passages type="PRODUCTEUR" base_url={base_url} acc_id={this.state.acc_id}></Passages>
                                                </div>

                                                <p class="text-secondary form-item-margin">{translation.Category_Des}</p>
                                                <br clear="all"></br>
                                                <h5 className="modal-title textColor headerTop "
                                                    id="exampleModalLabel">{translation.Site_Management}</h5>

                                                <div class="alert alert-secondary" role="alert">
                                                    <div class="row">
                                                        <div class="column_left_alert">
                                                            <img src={alertIcon}
                                                                 class="form-group img-responsive img-center align-me"
                                                                 alt="workimg"/>
                                                        </div>
                                                        <div class="column_right_alert">
                                                            <p>{translation.Site_para}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                {
                                                    type == "PRODUCTEUR" ? (
                                                        <div style={{opacity: 0.4}}>
                                                            <Sites type={type} base_url={base_url} acc_id={this.state.acc_id}></Sites>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <Sites type={type} base_url={base_url} acc_id={this.state.acc_id}></Sites>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                            <br/>
                                        </div>
                                        <br/>
                                    </div>

                                </div>
                            </div>
                        </main>
                    </div>
                </div>
                <Footer></Footer>
            </div>
        )
    }
}

export default connect(mapStateToProps, null)(withLanguageHook(SettingsSiteAndCategories));