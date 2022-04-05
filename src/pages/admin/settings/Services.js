import React from 'react';
import '../../../components/producer/settings/settingsMain.css'
import '../../../components/Admin/settings/index.css'
import NavBar from "../../../components/layout/main-navigation/AdminMainNavigation";
import Footer from "../../../components/layout/footer/AdminFooter";
import SlideBar from "../../../components/layout/side-navigation/AdminSideNavigation";
import {connect} from 'react-redux';
import Api from "../../../helper/service-api";
import ServicesList from "../../../components/services-list/services-list";

const mapStateToProps = state => {
    let token = state.token;
    let userRole = state.userRole;
    let isLogged = state.isLogged;
    return {token, userRole, isLogged}
}

class AdminServices extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isHidden: false,
            api: new Api(this.props.token),
        }
    }

    render() {
        if (!this.props.isLogged) {
            this.props.history.push('/');
        } else if (this.props.userRole != "ROLE_ADMIN") {
            this.props.history.push('/');
        }
        const {isHidden} = this.state
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
                                                <h5 className="modal-title textColor headerTop" id="exampleModalLabel">
                                                    SERVICES
                                                </h5>
                                                <ServicesList></ServicesList>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </main>
                        <Footer></Footer>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, null)(AdminServices);