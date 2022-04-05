import 'bootstrap/dist/css/bootstrap.css'

import '../../../components/App.scss';
import '../../../components/settingsMain.css'
import React from "react";
import NavBar from "../../../components/layout/main-navigation/AdminMainNavigation";
import Footer from "../../../components/layout/footer/AdminFooter";
import SlideBar from "../../../components/layout/side-navigation/AdminSideNavigation";
import TagNotes from "../../../components/common/tags/tag_notes";
import {connect} from 'react-redux';

const mapStateToProps = state => {
    let token = state.token;
    let userRole = state.userRole;
    let isLogged = state.isLogged;
    return {token, userRole, isLogged}
}

class TagsNotes extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isHidden: true,

        }
        this.toggleOffer = this.toggleOffer.bind(this);

    }

    toggle = (index) => {
        let collapse = "isOpen" + index;
        this.setState((prevState) => ({[collapse]: !prevState[collapse]}));
    };

    toggleOffer() {
        this.setState({
            isHidden: !this.state.isHidden
        })
    }


    render() {
        if(!this.props.isLogged){
            this.props.history.push('/');
        }else if (this.props.userRole!="ROLE_ADMIN") {
            this.props.history.push('/');
        }
        const {isHidden} = this.state
        const {isInsidePopoverOpen} = this.state

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
                                <div className="col-md-9 nopadding mb-4">
                                <TagNotes type={"admin"}></TagNotes>
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

export default connect(mapStateToProps, null)(TagsNotes);