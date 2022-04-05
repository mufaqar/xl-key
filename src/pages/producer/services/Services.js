import './index.css'
import 'bootstrap/dist/css/bootstrap.css';
import Header from '../../../components/layout/main-navigation/ProducerMainNavigation';
import Footer from '../../../components/layout/footer/ProducerFooter';
import lacoop from "../../../public/img/lacoop.png"
import "./index.scss";
import React from "react";
import {connect} from 'react-redux';
import ServiceItem from "../../../components/producer/services/service-item";
import Api from "../../../helper/service-api";
import useTranslation from "../../../components/customHooks/translations";
import dataLoader from "../../../dataLoading.gif";
import loader from "../../../loading.gif";
import PageLoader from "../../../components/PageLoader.js";
import getLanguage from "../../../components/customHooks/get-language";

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
        return <Component {...props} translation={translation} language={language} />;
    }
}

class Services extends React.Component {
    constructor(props) {
        super(props)
        const acc_id = this.props.match.params.acc_id;
        this.state = {
            isHidden: false,
            api: new Api(this.props.token, acc_id),
            adminServices: [],
            parentServices: [],
            adminLogo: "",
            parentLogo: "",
            dataAdminLoaded: false,
            dataParentLoaded: false,

            acc_id: acc_id,
            base_url: "/producteur",
            admin_base_url: "/admin/producteur/" + acc_id,
            entreprise_base_url: "/entreprise/producteur/" + acc_id,
            consultant_base_url: "/consultant/producteur/" + acc_id,
            pageLoader: true
        }
        this.stopPageLoader()
    }

    stopPageLoader() {
        setTimeout(()=>{
            this.setState({
                pageLoader: false
            });
        }, 1000)
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        this.state.api
            .getAllAdminServices()
            .then(response => {
                console.log("data response**services******* ", response);
                this.setState({
                    adminServices: response.data.data,
                    adminLogo: response.data.logo,
                    dataAdminLoaded: true
                })
            })
            .catch(err => {
                this.props.history.push('/');
            });
        this.state.api
            .getAllParentServices()
            .then(response => {
                console.log("data response**services******* ", response);
                this.setState({
                    parentServices: response.data.data,
                    parentLogo: response.data.logo,
                    dataParentLoaded: true
                })
            })
            .catch(err => {
                this.props.history.push('/');
            });
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
        const {isHidden, adminServices, parentServices, adminLogo, parentLogo} = this.state
        const translation = this.props.translation;
        return (
            <div className={isHidden ? "sb-nav-fixed" : "sb-nav-fixed sb-sidenav-toggled"}>
                {/*{this.state.pageLoader ? <PageLoader></PageLoader> : null}*/}
                <Header base_url={base_url} acc_id={this.state.acc_id}></Header>
                <div id="layoutSidenav">
                    <div class="settings_content">
                        <main>
                            <div class="card" id="mainDivSelect">
                                <div className="col-md-12 col-lg-12 mx-auto">
                                    <h4 className="modal-title  headerTop" id="exampleModalLabel">
                                        {translation.Services}
                                        {adminLogo ? (<img src={process.env.REACT_APP_IMAGE_URL + adminLogo} width="150" height="45"
                                             alt="working"/>) : null}
                                    </h4>
                                    {
                                        this.state.dataAdminLoaded ?
                                        ( 
                                            adminServices != null && adminServices.length != 0 ? 
                                            (adminServices.map((adminService) => (
                                                <ServiceItem service={adminService}></ServiceItem>
                                            )))
                                            :
                                            (
                                                <h6 className="text-left alert alert-primary">
                                                    {/*No Services Available*/}
                                                    {translation.No_services_available}
                                                </h6>
                                            )
                                        ) : 
                                        (<div className="text-center"><img src={dataLoader} /><br/><br/><br/></div>)
                                    }
                                    <br/>
                                    <br/>
                                    <h4>
                                        {translation.Services_offered_by}
                                        {parentLogo ? (<img src={process.env.REACT_APP_IMAGE_URL + parentLogo} width="150" height="45"
                                             alt="working"/>) : null}
                                    </h4>
                                    <div class="vspace1em"></div>
                                    {
                                        this.state.dataParentLoaded ?
                                        ( 
                                            parentServices != null && parentServices.length != 0 ? 
                                            (parentServices.map((parentService) => (
                                                <ServiceItem service={parentService}></ServiceItem>
                                            )))
                                            :
                                            (
                                                <h6 className="text-left alert alert-primary">
                                                    {/*No Services Available*/}
                                                    {translation.No_services_available}
                                                </h6>
                                            )
                                        ) : 
                                        (<div className="text-center"><img src={dataLoader} /><br/><br/><br/></div>)
                                    }
                                    <br/>
                                </div>
                            </div>
                        </main>
                        <br/>
                        <Footer></Footer>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, null)(withLanguageHook(Services));