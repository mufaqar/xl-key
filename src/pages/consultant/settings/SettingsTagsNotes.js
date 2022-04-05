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
import NavBar from "../../../components/layout/main-navigation/ConsultantMainNavigation";
import Footer from "../../../components/layout/footer/ConsultantFooter"
import SlideBar from "../../../components/layout/side-navigation/ConsultantSideNavigation..js";
import TagNotes from "../../../components/common/tags/tag_notes";
import { connect, useSelector, useDispatch } from 'react-redux';

const mapStateToProps = state => {
    let token = state.token;
    let userRole = state.userRole;
    let isLogged = state.isLogged;
    return {token, userRole, isLogged}
}

class SettingsTagsNotes extends React.Component {
    constructor(props) {
        super(props)
        const acc_id = this.props.match.params.acc_id;
        this.state = {
            // isHidden: true,
            isHidden: false,
            
            acc_id:acc_id,
            base_url:"/consultant",
            admin_base_url:"/admin/consultant/"+acc_id,
            entreprise_base_url:"/entreprise/consultant/"+acc_id,
            consultant_base_url:"/consultant/consultant/"+acc_id,
        }
        this.toggleOffer = this.toggleOffer.bind(this);

    }



    toggleOffer() {
        this.setState({
            // isHidden: !this.state.isHidden
            isHidden: false

        })


    }


    render() {
        let base_url = this.state.base_url;
        if (!this.props.isLogged) {
            this.props.history.push('/');
        } else if (this.props.userRole=="ROLE_CONSULTANT") {

        } else if (this.props.userRole=="ROLE_ADMIN" && this.state.acc_id) {
            base_url = this.state.admin_base_url;
        } else if (this.props.userRole=="ROLE_ENTREPRISE" && this.state.acc_id) {
            base_url = this.state.entreprise_base_url;
        } else  {
            this.props.history.push('/');
        }

        const {isHidden} = this.state
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
                                    <TagNotes type = "COUNSULTANT"></TagNotes>
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

export default connect(mapStateToProps, null)(SettingsTagsNotes);