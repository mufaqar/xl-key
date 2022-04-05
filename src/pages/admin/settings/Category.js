import 'bootstrap/dist/css/bootstrap.css'
import '../../../components/settingsMain.css'
import React from "react";
import NavBar from "../../../components/layout/main-navigation/AdminMainNavigation";
import Footer from "../../../components/layout/footer/AdminFooter";
import SlideBar from "../../../components/layout/side-navigation/AdminSideNavigation"
import {connect} from 'react-redux';
import Categories from "../../../components/common/category/category";
import Years from "../../../components/common/year/year";
import Passages from "../../../components/common/passage/passage";
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

class Category extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isHidden: false
        }
        this.toggleOffer = this.toggleOffer.bind(this);
    }

    toggleOffer() {
        this.setState({
            isHidden: false
        })
    }

    render() {
        if (!this.props.isLogged) {
            this.props.history.push('/');
        } else if (this.props.userRole != "ROLE_ADMIN") {
            this.props.history.push('/');
        }
        const {isHidden} = this.state
        const translation = this.props.translation;
        return (
            <div className={isHidden ? "sb-nav-fixed" : "sb-nav-fixed sb-sidenav-toggled"}>
                <NavBar toggleOffer={this.toggleOffer}></NavBar>
                <div id="mainDivSelect">
                    <div id="layoutSidenav_content" class="settings_content">
                        <main>
                            <div class="container-fluid">
                                <div class="row">
                                    <div className="col-md-3 sidebarbackgroundcolour">
                                        <SlideBar></SlideBar>
                                    </div>
                                    <div className="col-md-9 nopadding">
                                        <div className="card my-cart mb-5">
                                            <div className="col-md-11 col-lg-11 mx-auto">
                                                <h5 className="modal-title textColor headerTop"
                                                    id="exampleModalLabel">{translation.Category_Management}</h5>
                                                <div className="vspace1em"></div>
                                                <Years type="ADMIN"></Years>
                                                <Categories type="ADMIN"></Categories>
                                                <div className="vspace1em"></div>
                                                <p className="text-secondary form-item-margin">{translation.Related_only_to_the_Drone_category}</p>
                                                <Passages type="ADMIN"></Passages>
                                                <div className="vspace1em"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </main>
                        <Footer/>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, null)(withLanguageHook(Category));