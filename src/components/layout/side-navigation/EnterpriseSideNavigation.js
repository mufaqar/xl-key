import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import React from 'react';
import {Popup} from "@progress/kendo-react-popup";
import Menuup from "../../../public/img/MenuUp.svg";
import Menudown from "../../../public/img/MenuDown.svg";
import {Link} from 'react-router-dom';
import useTranslation from "../../customHooks/translations";

function EnterpriseSideNavigation(props) {
    const anchor = React.useRef(null);
    const [show, setShow] = React.useState(false);
    const base_url = props.base_url;
    const translation = useTranslation();
    React.useEffect(() => {
        setShow(true);
    }, []);

    const onClick = () => {
        setShow(!show);
    };

    return (
        <div>
            <div class=" mobilehidden">
                <div id="layoutSidenav_nav">
                    <nav class="sb-sidenav accordion sb-sidenav-light" id="sidenavAccordion">
                        <div className="sb-sidenav-menu-heading mb-3" style={{marginRight: 'auto', fontSize: '20px'}}>
                        {translation.Settings}
                        </div>
                        <div className="sb-sidenav-menu">
                            <div className="nav">
                                <Link className="nav-link border-bottom border-top"
                                      to={base_url+"/settings/information-general"}>
                                    {translation.Information_General}
                                </Link>
                                <Link className="nav-link border-bottom"
                                      to={base_url+"/settings/information-de-connexion"}>
                                    {translation.Login_Information}
                                </Link>
                                <Link className="nav-link border-bottom" 
                                      to={base_url+"/settings/services"}>
                                    {translation.Services_sidebar}
                                </Link>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>

            <div className="desktophidden">
                <div class="row">
                    <div className="col-12">

                        <button class="btn btn-light full-width-btn" onClick={onClick} ref={anchor}>
                            <div className="navbarbuttonstyle">
                            {translation.Settings}
                                {show ? <img src={Menudown}/> : <img src={Menuup}/>}
                            </div>
                        </button>
                        {!show ? <Popup anchor={anchor.current} show={!show} popupClass={'popup-content'}>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class=".col-sm">
                                        <div class="col">
                                            <div>
                                                <Link class="nav-link" to="/entreprise/settings/information-general">
                                                {translation.Information_General}
                                                </Link>
                                                <Link class="nav-link"
                                                      to="/entreprise/settings/information-de-connexion">
                                                    {translation.Login_Information}
                                                </Link>
                                                <Link class="nav-link" to="/entreprise/settings/services">
                                                {translation.Services_sidebar}

                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Popup> : null}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EnterpriseSideNavigation;