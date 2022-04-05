import React from 'react';
import SlideBar from '../../../components/layout/side-navigation/ProducerSideNavigation.js';
import '../../../components/settingsMain.css'
import NavBar from '../../../components/layout/main-navigation/ProducerMainNavigation';
import Footer from '../../../components/layout/footer/ProducerFooter';
import {connect} from 'react-redux';
import Api from "../../../helper/subscription-api";
import HideModal from "../../../components/hideModal";
import SingleSubscription from "../../../components/producer/settings/subscriptions/single-subscription";
import AddContractPopup from "../../../components/producer/settings/subscriptions/add-contract-popup";
import AddInvoicePopup from "../../../components/producer/settings/subscriptions/add-invoice-popup";
import AddOtherPopup from "../../../components/producer/settings/subscriptions/add-other-popup";
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

class SettingsSubscriptionsInvoices extends React.Component {
    constructor(props) {
        super(props)
        const acc_id = this.props.match.params.acc_id;
        this.state = {
            isHidden: true,
            api: new Api(this.props.token),
            hideModal: new HideModal(),
            contracts: [],
            invoices: [],
            other: [],
            isExpanded: false,
            isPopoverOpen: false,
            popoverId: null,
            mobilePlanPopoverId: null,
            message: "",
            acc_id: acc_id,
            base_url: "/producteur",
            admin_base_url: "/admin/producteur/" + acc_id,
            entreprise_base_url: "/entreprise/producteur/" + acc_id,
            consultant_base_url: "/consultant/producteur/" + acc_id,
            userType: "",
        }
        this.toggleOffer = this.toggleOffer.bind(this);
    }

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
            .getAllSubscriptionsByType("contract")
            .then(response => {
                this.setState({contracts: response.data.data, userType: response.data.user_type})
            }).catch(err => this.props.history.push('/'));
        this.state.api
            .getAllSubscriptionsByType("invoice")
            .then(response => {
                this.setState({invoices: response.data.data})
            }).catch(err => this.props.history.push('/'));
        this.state.api
            .getAllSubscriptionsByType("other")
            .then(response => {
                this.setState({other: response.data.data})
            }).catch(err => this.props.history.push('/'));
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
        const {isHidden, contracts, invoices, other} = this.state
        const translation = this.props.translation;
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
                                        <div class="card my-cart">
                                            <div className="col-md-11 col-lg-11 mx-auto">
                                                <div class="row inner-form-row-margin ">
                                                    <h5 className="modal-title textColor headerTop" id="exampleModalLabel">
                                                        {translation.Subscription_and_invoices}
                                                    </h5>
                                                </div>

                                                {this.state.userType === "normal_user" ? (
                                                    <h3>
                                                        {translation.Only_the_super_administrator_can_access_this_feature}
                                                    </h3>
                                                ) : (
                                                    <div>
                                                        <div className="row ">
                                                            <div
                                                                className="col-md-6 col-sm-6 col-xs-12 align-self-center">
                                                                <strong htmlFor="inputEmail">{translation.Contracts}</strong>
                                                            </div>
                                                            {this.props.userRole == "ROLE_ADMIN" && (
                                                                <div
                                                                    className="col-md-6  col-sm-6 col-xs-12 text-xs-right text-sm-right text-md-right text-lg-right text-xl-right ">
                                                                    <button type="button" data-toggle="modal"
                                                                            data-target="#addContractPopup"
                                                                            className="btn btn-primary">
                                                                        {translation.Add_a_contract}
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                        {(contracts).map((contract) => (
                                                            <SingleSubscription subscription={contract}
                                                                                userRole={this.props.userRole}>
                                                            </SingleSubscription>
                                                        ))}
                                                        <div className="vspace1em"></div>

                                                        <div className="alert alert-secondary" role="alert">
                                                            <div className="row">
                                                                <p style={{padding: '10px'}}>{translation.ContractPara}</p>
                                                            </div>
                                                        </div>
                                                        <div className="vspace1em"></div>
                                                        <div className="vspace1em"></div>
                                                        <div className="vspace1em"></div>

                                                        <div className="row ">
                                                            <div
                                                                className="col-md-6 col-sm-6 col-xs-12 align-self-center">
                                                                <strong htmlFor="inputEmail">
                                                                    {translation.Subscription_invoices}</strong>
                                                            </div>
                                                            {this.props.userRole == "ROLE_ADMIN" && (
                                                                <div
                                                                    className="col-md-6  col-sm-6 col-xs-12 text-xs-right text-sm-right text-md-right text-lg-right text-xl-right ">
                                                                    <button type="button" data-toggle="modal"
                                                                            data-target="#addInvoicePopup"
                                                                            className="btn btn-primary">
                                                                        {translation.Add_an_invoice}
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                        {(invoices).map((invoice) => (
                                                            <SingleSubscription subscription={invoice}
                                                                                userRole={this.props.userRole}>
                                                            </SingleSubscription>
                                                        ))}
                                                        <div className="vspace1em"></div>
                                                        <div className="vspace1em"></div>
                                                        <div className="vspace1em"></div>
                                                        <div className="vspace1em"></div>

                                                        <div className="row ">
                                                            <div
                                                                className="col-md-6 col-sm-6 col-xs-12 align-self-center">
                                                                <strong htmlFor="inputEmail">{translation.Other_invoices}</strong>
                                                            </div>
                                                            {this.props.userRole == "ROLE_ADMIN" && (
                                                                <div
                                                                    className="col-md-6  col-sm-6 col-xs-12 text-xs-right text-sm-right text-md-right text-lg-right text-xl-right ">
                                                                    <button type="button" data-toggle="modal"
                                                                            data-target="#addOtherPopup"
                                                                            className="btn btn-primary">
                                                                        {translation.Add_another_type_of_invoice}
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                        {(other).map((subscription) => (
                                                            <SingleSubscription subscription={subscription}
                                                                                userRole={this.props.userRole}>
                                                            </SingleSubscription>
                                                        ))}
                                                        <div className="vspace1em"></div>
                                                        <div className="vspace1em"></div>
                                                    </div>
                                                )}

                                            </div>
                                            <br/>
                                        </div>
                                        <br/>
                                    </div>
                                </div>
                            </div>
                        </main>
                        <AddContractPopup></AddContractPopup>
                        <AddInvoicePopup></AddInvoicePopup>
                        <AddOtherPopup></AddOtherPopup>
                    </div>
                </div>
                <Footer></Footer>
            </div>
        )
    }
}

export default connect(mapStateToProps, null)(withLanguageHook(SettingsSubscriptionsInvoices));