import SlideBar from '../../../components/layout/side-navigation/ProducerSideNavigation.js';
import '../../../components/settingsMain.css'
import 'bootstrap/dist/css/bootstrap.css';
import NavBar from '../../../components/layout/main-navigation/ProducerMainNavigation';
import Footer from '../../../components/layout/footer/ProducerFooter';
import "../../../components/App.scss";
import React from "react";
import {connect} from 'react-redux';
import Api from "../../../helper/photo-api";
import Field from "../../../components/common/field/field";
import HideModal from "../../../components/hideModal";
import dataLoader from "../../../dataLoading.gif";
import useTranslation from "../../../components/customHooks/translations";
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
        return <Component {...props} translation={translation} language={language}/>;
    }
}

class SettingsFileName extends React.Component {
    constructor(props) {
        super(props)
        const acc_id = this.props.match.params.acc_id;
        this.state = {
            isHidden: false,
            api: new Api(this.props.token, acc_id),
            hideModal: new HideModal(),
            sites: [],
            isExpanded: false,
            isPopoverOpen: false,
            popoverId: null,
            mobileFieldPopoverId: null,
            message: "",
            dataLoaded: false,
            
            acc_id:acc_id,
            base_url:"/producteur",
            admin_base_url:"/admin/producteur/"+acc_id,
            entreprise_base_url:"/entreprise/producteur/"+acc_id,
            consultant_base_url:"/consultant/producteur/"+acc_id,
        }
        this.toggleOffer = this.toggleOffer.bind(this);
    }

    toggle = (data) => {
        this.setState((prevState) => ({isExpanded: data}));
    };

    toggleOffer() {
        this.setState({
            isHidden: false
        })
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        this.setState({message: ""});
        this.state.api
            .getAllSites()
            .then(response => {
                console.log("data response**sites******* ", response);
                this.setState({
                    sites: response.data.data,
                    dataLoaded: true
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
        const {isHidden, sites} = this.state
        const translation = this.props.translation;
        const language = this.props.language;
        const isFrench = language == "FR";
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
                                    <div className="col-md-9 nopadding">
                                        <div class="card my-cart">
                                            <div className="col-md-11 col-lg-11 mx-auto">
                                                <h5 className="modal-title textColor headerTop"
                                                    id="exampleModalLabel">{translation.Field_Name}</h5>
                                                <div class="vspace1em"></div>
                                                {this.state.dataLoaded ?
                                                    (
                                                        sites != null && sites.length != 0 ?
                                                            (<div>
                                                                {(sites).map((site) => (
                                                                    <div>
                                                                        <div className="alert alert-secondary"
                                                                             role="alert">
                                                                            <div className="row inner-form-margin">
                                                                                <strong htmlFor="inputEmail"
                                                                                        style={{textSizeAdjust: '20px'}}>
                                                                                    {isFrench ? site.name_fr : site.name_en}
                                                                                </strong>
                                                                            </div>
                                                                        </div>
                                                                        <Field fields={site.fields} siteId={site.id}>
                                                                        </Field>
                                                                        <div className="vspace1em"></div>
                                                                    </div>
                                                                ))}
                                                            </div>)
                                                            :
                                                            (
                                                                <h6 className="text-left alert alert-primary">
                                                                    {translation.No_fields_found}
                                                                </h6>
                                                            )
                                                    ) :
                                                    (
                                                        <div className="text-center">
                                                            <img src={dataLoader}/><br/><br/><br/>
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

export default connect(mapStateToProps, null)(withLanguageHook(SettingsFileName));