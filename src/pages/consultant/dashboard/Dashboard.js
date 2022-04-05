import React from 'react'
import Footer from '../../../components/layout/footer/ConsultantFooter';
import Carnetdenote from "../../../public/img/Carnetdenote.svg"
import Settings from "../../../public/img/AdminSettings.svg"
import Producteurs from "../../../public/img/Producteurs.svg"
import { withRouter } from "react-router-dom";
import Uploadphotos from "../../../public/img/Uploadphotos.svg"
import NavBar from "../../../components/layout/main-navigation/ConsultantMainNavigation";
import { connect, useSelector, useDispatch } from 'react-redux';
import Dashboarnotification from "../../../components/common/notification/dashboard_notification"
import PageLoader from "../../../components/PageLoader.js";
import useTranslation from "../../../components/customHooks/translations";

const mapStateToProps = state => {
    let token = state.token;
    let userRole = state.userRole;
    let isLogged = state.isLogged;
    return { token, userRole, isLogged }
}

function withLanguageHook(Component) {
    return function WrappedComponent(props) {
        const translation = useTranslation();
        return <Component {...props} translation={translation}/>;
    }
}

class ConsultantDashboard extends React.Component {

    constructor(props) {
        super(props)
        const acc_id = this.props.match.params.acc_id;
        this.state = {
            message: "",
            acc_id: acc_id,
            base_url: "/consultant",
            admin_base_url: "/admin/consultant/" + acc_id,
            entreprise_base_url: "/entreprise/consultant/" + acc_id,
            consultant_base_url: "/consultant/consultant/" + acc_id,
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

    componentDidMount() {
    }

    onClick = () => this.props.history.push("/consultant/notifications");

    render() {
        let base_url = this.state.base_url;
        if (!this.props.isLogged) {
            this.props.history.push('/');
        } else if (this.props.userRole == "ROLE_CONSULTANT") {

        } else if (this.props.userRole == "ROLE_ADMIN" && this.state.acc_id) {
            base_url = this.state.admin_base_url;
        } else if (this.props.userRole == "ROLE_ENTREPRISE" && this.state.acc_id) {
            base_url = this.state.entreprise_base_url;
        } else {
            this.props.history.push('/');
        }
        const translation = this.props.translation;
        return (

            <div>
                {this.state.pageLoader ? <PageLoader></PageLoader> : null}
                <NavBar base_url={base_url} acc_id={this.state.acc_id}></NavBar>
                <div>

                    <div>
                        <main>
                            <div id="mainDivSelect" className="headerBecground">
                                {/* <Dashboarnotification type="consultant" acc_id={this.state.acc_id} base_url={base_url}/> */}
                                <div className="producteure-dashboard-box">

                                    <div class="row">
                                        <div class="col-md-12">

                                            <div id="grid" class="row">

                                                <div class="col-md-6 col-6">
                                                    <a href={base_url + "/liste-des-producteurs"}>
                                                        <div class="producteure-dashboard-grid-item">
                                                            <img src={Producteurs} class="img-responsive"
                                                                alt="workimg" />
                                                            <p>{translation.Producers}</p>
                                                        </div>
                                                    </a>
                                                </div>
                                                <div class="col-md-6 col-6">
                                                    <a href={base_url + "/notes"}>
                                                        <div class="producteure-dashboard-grid-item">
                                                            <img src={Carnetdenote} class="img-responsive"
                                                                alt="workimg" />
                                                            <p>{translation.Notebook}</p>
                                                        </div>
                                                    </a>
                                                </div>

                                                <div class="col-md-6 col-6">
                                                    <a href={base_url + "/upload-d-images"}>
                                                        <div class="producteure-dashboard-grid-item">
                                                            <img src={Uploadphotos} class="img-responsive"
                                                                alt="workimg" />
                                                            <p>{translation.Downloading_images}</p>
                                                        </div>
                                                    </a>
                                                </div>

                                                <div class="col-md-6 col-6">
                                                    <a href={base_url + "/settings/information-general"}>
                                                        <div class="producteure-dashboard-grid-item">

                                                            <img src={Settings} class="img-responsive"
                                                                alt="workimg" />
                                                            <p>{translation.Settings}</p>

                                                        </div>
                                                    </a>
                                                </div>

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

export default connect(mapStateToProps, null)(withLanguageHook(ConsultantDashboard));