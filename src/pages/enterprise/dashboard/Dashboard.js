import React from 'react'
import Footer from '../../../components/layout/footer/EnterpriseFooter';
import Header from "../../../components/layout/main-navigation/EnterpriseMainNavigation"
import Producteurs from "../../../public/img/Producteurs.svg"
import Consultants from "../../../public/img/Consultants.svg"
import Settings from "../../../public/img/AdminSettings.svg"
import Uploadphotos from "../../../public/img/Uploadphotos.svg"
import { connect, useSelector, useDispatch } from 'react-redux';
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

class EnterpriseDashboard extends React.Component {

    constructor(props) {
        super(props)
        const acc_id = this.props.match.params.acc_id;
        this.state = {
            message: "",
            acc_id:acc_id,
            base_url:"/entreprise",
            admin_base_url:"/admin/entreprise/"+acc_id,
            entreprise_base_url:"/entreprise/entreprise/"+acc_id,
            consultant_base_url:"/consultant/entreprise/"+acc_id,
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

    render() {
        let base_url = this.state.base_url;
        if (!this.props.isLogged) {
            this.props.history.push('/');
        } else if (this.props.userRole=="ROLE_ENTREPRISE") {

        } else if (this.props.userRole=="ROLE_ADMIN" && this.state.acc_id) {
            base_url = this.state.admin_base_url;
        } else  {
            this.props.history.push('/');
        }
        const translation = this.props.translation;
        return (
            <div>
                {this.state.pageLoader ? <PageLoader></PageLoader> : null}
                <Header base_url={base_url} acc_id={this.state.acc_id}></Header>
                <div>
                    <div>
                        <main>
                            <div id="mainDivSelect" className="headerBecground">
                                <div class="container-fluid">
                                    <div className="producteure-dashboard-box">
                                        <div class="row">
                                            <div class="col-md-12">
                                                <div id="grid" class="row">
                                                    <div class="col-md-6 col-6">
                                                        <a href={base_url+"/listes-des-producteurs"}>
                                                            <div className="producteure-dashboard-grid-item">
                                                                <img src={Producteurs} className="img-responsive"
                                                                     alt="workimg"/>
                                                                <p>{translation.Producers}</p>
                                                            </div>
                                                        </a>
                                                    </div>
                                                    <div class="col-md-6 col-6">
                                                        <a href={base_url+"/listes-des-consultants"}>
                                                            <div className="producteure-dashboard-grid-item">
                                                                <img src={Consultants} className="img-responsive"
                                                                     alt="workimg"/>
                                                                <p>{translation.Consultants}</p>
                                                            </div>
                                                        </a>
                                                    </div>
                                                    <div class="col-md-6 col-6">
                                                        <a href={base_url+"/upload-d-images"}>
                                                            <div className="producteure-dashboard-grid-item">
                                                                <img src={Uploadphotos} className="img-responsive"
                                                                     alt="workimg"/>
                                                                <p>{translation.Downloading_images}</p>
                                                            </div>
                                                        </a>
                                                    </div>
                                                    <div class="col-md-6 col-6">
                                                        <a href={base_url+"/settings/information-general"}>
                                                            <div className="producteure-dashboard-grid-item">
                                                                <img src={Settings} className="img-responsive"
                                                                     alt="workimg"/>
                                                                <p>{translation.Settings}</p>
                                                            </div>
                                                        </a>
                                                    </div>
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

export default connect(mapStateToProps, null)(withLanguageHook(EnterpriseDashboard));