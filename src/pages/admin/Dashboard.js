import React from 'react'
import Footer from "../../components/layout/footer/AdminFooter"
import Producteurs from "../../public/img/Producteurs.svg"
import Consultants from "../../public/img/Consultants.svg"
import Entreprises from "../../public/img/Entreprises.svg"
import Settings from "../../public/img/AdminSettings.svg"
import Uploadphotos from "../../public/img/Uploadphotos.svg"
import NavBar from "../../components/layout/main-navigation/AdminMainNavigation";
import {Link} from 'react-router-dom';
import { connect, useSelector, useDispatch } from 'react-redux';
import PageLoader from "../../components/PageLoader.js";
import useTranslation from "../../components/customHooks/translations";

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

class Dashboard extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {
            message: "",
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
        if(!this.props.isLogged){
            this.props.history.push('/');
        }else if (this.props.userRole!="ROLE_ADMIN") {
            this.props.history.push('/');
        }
        const translation = this.props.translation;
        return (
            <div>
                {this.state.pageLoader ? <PageLoader></PageLoader> : null}
                <NavBar></NavBar>
                <div>
                    <div>
                        <main>
                            <div id="mainDivSelect" className="headerBecground">
                                <div class="container-fluid">
                                    <div className="admin-dashboard-box">
                                        <div class="row">
                                            <div class="col-md-12">
                                                <div id="grid" class="row">
                                                    <div class="col-md-6 col-6">
                                                        <Link to="/admin/producteurs">
                                                            <div className="admin-dashboard-grid-item">
                                                                <img src={Producteurs} className="img-responsive"
                                                                     alt="workimg"/>
                                                                <p>{translation.Producers}</p>
                                                            </div>
                                                        </Link>
                                                    </div>
                                                    <div class="col-md-6 col-6">
                                                        <Link to="/admin/consultants">
                                                            <div class="admin-dashboard-grid-item">
                                                                <img src={Consultants} class="img-responsive"
                                                                     alt="workimg"/>
                                                                <p>{translation.Consultants}</p>
                                                            </div>
                                                        </Link>
                                                    </div>
                                                    <div class="col-md-6 col-6">
                                                        <Link to="/admin/entreprise">
                                                            <div class="admin-dashboard-grid-item">
                                                                <img src={Entreprises} class="img-responsive"
                                                                     alt="workimg"/>
                                                                <p>{translation.Entreprise}</p>
                                                            </div>
                                                        </Link>
                                                    </div>
                                                    <div class="col-md-6 col-6">
                                                        <Link to="/admin/settings/information-de-connexion">
                                                            <div class="admin-dashboard-grid-item">
                                                                <img src={Settings} class="img-responsive"
                                                                     alt="workimg"/>
                                                                <p>{translation.Settings}</p>
                                                            </div>
                                                        </Link>
                                                    </div>
                                                    <div class="col-md-6 col-6">
                                                        <Link to="/admin/upload-d-images">
                                                            <div className="admin-dashboard-grid-item">
                                                                <img src={Uploadphotos} className="img-responsive"
                                                                     alt="workimg"/>
                                                                <p>{translation.Downloading_images}</p>
                                                            </div>
                                                        </Link>
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

export default connect(mapStateToProps, null)(withLanguageHook(Dashboard));