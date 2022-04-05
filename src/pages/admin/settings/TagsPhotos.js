import SlideBar from '../../../components/layout/side-navigation/AdminSideNavigation';
import '../../../components/settingsMain.css'
import 'bootstrap/dist/css/bootstrap.css';
import NavBar from '../../../components/layout/main-navigation/AdminMainNavigation';
import Footer from '../../../components/layout/footer/AdminFooter';
import "../../../components/App.scss";
import React from "react";
import TagPhotos from "../../../components/common/tags/tag_photo";
import { connect, useSelector, useDispatch } from 'react-redux';

const mapStateToProps = state => {
    let token = state.token;
    let userRole = state.userRole;
    let isLogged = state.isLogged;
    return {token, userRole, isLogged}
}

class SettingsTagsPhotos extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            // isHidden: true,
            isHidden: false
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
        if(!this.props.isLogged){
            this.props.history.push('/');
        }else if (this.props.userRole!="ROLE_ADMIN") {
            this.props.history.push('/');
        }
        const {isHidden} = this.state
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

                                    <div className="col-md-9 nopadding mb-4">

                                       <TagPhotos type={"admin"}></TagPhotos>
                                       
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

export default connect(mapStateToProps, null)(SettingsTagsPhotos);
