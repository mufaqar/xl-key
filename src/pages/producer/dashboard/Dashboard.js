import React from 'react'
import Footer from '../../../components/layout/footer/ProducerFooter';
import './index.css';
import Header from '../../../components/layout/main-navigation/ProducerMainNavigation';
import AlbumPhoto from "../../../public/img/AlbumPhoto.svg"
import Carnetdenote from "../../../public/img/Carnetdenote.svg"
import Demandedeservices from "../../../public/img/Uploadphotos.svg"
import Settings from "../../../public/img/AdminSettings.svg"
import {withRouter} from "react-router-dom";
import { connect, useSelector, useDispatch } from 'react-redux';
import Dashboarnotification from "../../../components/common/notification/dashboard_notification";
import PageLoader from "../../../components/PageLoader.js";
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

class ProducerDashboard extends React.Component {

    constructor(props) {
        super(props)
        const acc_id = this.props.match.params.acc_id;
        const access = this.props.match.params.access;
        const key = this.props.match.params.key;
        let access_level = 0;
        if (access=="access" && key) {
            access_level = 2;
        } else if (access=="access") {
            access_level = 1;
        }
        this.state = {
            message: "",
            acc_id:acc_id,
            access_level:access_level,
            access_key:key,
            base_url:"/producteur",
            admin_base_url:"/admin/producteur/"+acc_id,
            entreprise_base_url:"/entreprise/producteur/"+acc_id,
            consultant_base_url:"/consultant/producteur/"+acc_id,
            access_level_1_url:"/consultant/access/producteur/"+acc_id,
            access_level_2_url:"/consultant/access/producteur/"+acc_id+"/"+key,
            pageLoader: true
        }
        this.stopPageLoader();
    }

    stopPageLoader() {
        setTimeout(()=>{
            this.setState({
                pageLoader: false
            });
        }, 2500)
    }

    // onClick = () => this.props.history.push("/producteur/notifications");

    render() {
        let base_url = this.state.base_url;
        const translation = this.props.translation;
        if (this.state.access_key) {
            base_url = this.state.access_level_2_url;
        } else if (!this.props.isLogged) {
            this.props.history.push('/');
        } else if (this.props.userRole=="ROLE_PRODUCTEUR") {

        } else if (this.props.userRole=="ROLE_ADMIN" && this.state.acc_id) {
            base_url = this.state.admin_base_url;
        } else if (this.props.userRole=="ROLE_ENTREPRISE" && this.state.acc_id) {
            base_url = this.state.entreprise_base_url;
        } else if (this.props.userRole=="ROLE_CONSULTANT" && this.state.acc_id) {
            if (this.state.access_level==1) {
                base_url = this.state.access_level_1_url;
            } else if (this.state.access_level==2) {
                base_url = this.state.access_level_2_url;
            } else {
                base_url = this.state.consultant_base_url;
            }
        } else  {
            this.props.history.push('/');
        }
        return (
            <div>
                {this.state.pageLoader ? <PageLoader></PageLoader> : null}
                <Header base_url={base_url} acc_id={this.state.acc_id} access_level={this.state.access_level} access_key={this.state.access_key}></Header>
                <div>
                    <div>
                        <main id="mainDivSelect">
                            <div className="headerBecground">
                                <Dashboarnotification type="producture" base_url={base_url} acc_id={this.state.acc_id} access_level={this.state.access_level} access_key={this.state.access_key}/>
                                <div className="producteure-dashboard-box">
                                    <div class="row">
                                        <div class="col-md-12">
                                            <div id="grid" class="row">
                                                <div class="col-md-6 col-6">
                                                    <div>
                                                        <div class="producteure-dashboard-grid-item">
                                                            <a href={base_url+"/photos"}>
                                                                <img src={AlbumPhoto} class="img-responsive"
                                                                     alt="workimg"/>
                                                                <p>{translation.Album_Photo}</p>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-md-6 col-6">
                                                    <div>
                                                        <div class="producteure-dashboard-grid-item">
                                                            <a href={base_url+"/notes"}>
                                                                <img src={Carnetdenote} class="img-responsive"
                                                                     alt="workimg"/>
                                                                <p>{translation.Notebook}</p>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                                {!(this.state.access_level==1 || this.state.access_level==2) && (
                                                <div class="col-md-6 col-6">
                                                    <div>
                                                        <div class="producteure-dashboard-grid-item">
                                                            <a href={base_url+"/services"}>
                                                                <img src={Demandedeservices} class="img-responsive"
                                                                     alt="workimg"/>
                                                                <p>{translation.Request_for_services}</p>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                                )}
                                                {!(this.state.access_level==1 || this.state.access_level==2) && (
                                                <div class="col-md-6 col-6">
                                                    <div>
                                                        <div class="producteure-dashboard-grid-item">
                                                            <a href={base_url+"/settings/information-general"}>
                                                                <img src={Settings} class="img-responsive"
                                                                     alt="workimg"/>
                                                                <p>{translation.Settings}</p>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                                )}
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

export default connect(mapStateToProps, null)(withLanguageHook(ProducerDashboard));