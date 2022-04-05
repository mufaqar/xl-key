import SlideBar from '../../../components/layout/side-navigation/ProducerSideNavigation.js';
import '../../../components/settingsMain.css'
import 'bootstrap/dist/css/bootstrap.css';
import NavBar from '../../../components/layout/main-navigation/ProducerMainNavigation';
import Footer from '../../../components/layout/footer/ProducerFooter';
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
        const acc_id = this.props.match.params.acc_id;
        this.state = {
            // isHidden: true,
            isHidden: false,
            
            acc_id:acc_id,
            base_url:"/producteur",
            admin_base_url:"/admin/producteur/"+acc_id,
            entreprise_base_url:"/entreprise/producteur/"+acc_id,
            consultant_base_url:"/consultant/producteur/"+acc_id,
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
        } else if (this.props.userRole=="ROLE_PRODUCTEUR") {

        } else if (this.props.userRole=="ROLE_ADMIN" && this.state.acc_id) {
            base_url = this.state.admin_base_url;
        } else if (this.props.userRole=="ROLE_ENTREPRISE" && this.state.acc_id) {
            base_url = this.state.entreprise_base_url;
        } else if (this.props.userRole=="ROLE_CONSULTANT" && this.state.acc_id) {
            base_url = this.state.consultant_base_url;
        } else  {
            this.props.history.push('/');
        }
        const {isHidden} = this.state
        return (
          
            <div className={isHidden ? "sb-nav-fixed" : "sb-nav-fixed sb-sidenav-toggled"}>
                <NavBar base_url={base_url} acc_id={this.state.acc_id} toggleOffer={this.toggleOffer}></NavBar>
    
                <div id="mainDivSelect">

                    <div id="layoutSidenav_content" class="settings_content">
                        <main>
                            <div class="container-fluid">
                                <div class="row">
                                    <div className="col-md-3 sidebarbackgroundcolour">
                                        <SlideBar base_url={base_url}></SlideBar>

                                    </div>

                                    <div className="col-md-9 nopadding mb-4">

                                       <TagPhotos type={"product"} ></TagPhotos>
                                       
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
