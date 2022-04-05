import React from 'react';
import SlideBar from '../../../components/layout/side-navigation/ProducerSideNavigation.js';
import '../../../components/settingsMain.css'
import NavBar from '../../../components/layout/main-navigation/ProducerMainNavigation';
import SettingPopupSecond from '../../../components/producer/settings/plans/add-plan-popup.js'
import Footer from '../../../components/layout/footer/ProducerFooter';
import {connect} from 'react-redux';
import SinglePlan from "../../../components/producer/settings/plans/single-plan";
import Api from "../../../helper/plan-api";
import HideModal from "../../../components/hideModal";
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

class SettingsPlanDeFerme extends React.Component {
    constructor(props) {
        super(props)
        const acc_id = this.props.match.params.acc_id;
        this.state = {
            // isHidden: true
            isHidden: false,
            api: new Api(this.props.token),
            hideModal: new HideModal(),
            plans: [],
            isExpanded: false,
            isPopoverOpen: false,
            popoverId: null,
            mobilePlanPopoverId: null,
            message: "",
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
            isHidden: false
        })
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        this.setState({message: ""});
        this.state.api
            .getAllPlans()
            .then(response => {
                console.log("data response**plans******* ", response);
                this.setState({
                    plans: response.data.data
                })
            })
            .catch(err => {
                this.props.history.push('/');
            });
    }

    render() {
        const translation = this.props.translation;
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
        const {isHidden, plans} = this.state
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

                                                <div class="row ">
                                                    <div className="col-md-6 col-sm-6 col-xs-12">
                                                        <h5 className="modal-title textColor headerTop"
                                                            id="exampleModalLabel">{translation.Farm_plan}</h5>
                                                    </div>
                                                    <div
                                                        className="col-md-6  col-sm-6 col-xs-12 text-xs-right text-sm-right text-md-right text-lg-right text-xl-right ">
                                                        <button type="button" data-toggle="modal"
                                                                data-target="#myPopupSecond"
                                                                class="btn btn-primary headerTop">{translation.Add_a_plan}
                                                        </button>
                                                    </div>
                                                </div>
                                                {(plans).map((plan) => (
                                                    <SinglePlan plan={plan}></SinglePlan>
                                                ))}
                                            </div>
                                            <br/>
                                        </div>
                                        <br/>
                                    </div>
                                </div>
                            </div>
                        </main>
                        <SettingPopupSecond></SettingPopupSecond>
                    </div>
                </div>
                <Footer></Footer>
            </div>
        )
    }
}

export default connect(mapStateToProps, null)(withLanguageHook(SettingsPlanDeFerme));