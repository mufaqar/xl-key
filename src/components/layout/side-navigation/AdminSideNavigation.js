import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import React from 'react';
import {Popup} from "@progress/kendo-react-popup";
import Menuup from "../../../public/img/MenuUp.svg";
import Menudown from "../../../public/img/MenuDown.svg";
import {Link} from 'react-router-dom';
import useTranslation from "../../customHooks/translations";

function AdminSideNavigation() {
    const anchor = React.useRef(null);
    const [show, setShow] = React.useState(false);
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
                        <div class="sb-sidenav-menu">
                            <div class="nav">
                                <Link class="nav-link border-bottom border-top"
                                      to="/admin/settings/information-de-connexion">
                                    {translation.Login_Information}
                                </Link>
                                <Link class="nav-link border-bottom" to="/admin/settings/categories">{translation.Categories_admin}</Link>
                                <Link class="nav-link border-bottom" to="/admin/settings/tags-photos">{translation.Tags_Photos}</Link>
                                <Link class="nav-link border-bottom" to="/admin/settings/tags-notes">{translation.Tags_Notes}</Link>
                                <Link class="nav-link border-bottom" to="/admin/settings/categories-de-consultant">
                                    {translation.Consultant_categories}
                                </Link>
                                <Link class="nav-link border-bottom" to="/admin/settings/services">{translation.Services_sidebar}</Link>
                                <Link class="nav-link border-bottom" to="/admin/settings/dossier-de-notes">
                                    {translation.Notes_file}
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
                                                <Link class="nav-link" to="/admin/settings/information-de-connexion">
                                                {translation.Login_Information}
                                                </Link>
                                                <Link class="nav-link" to="/admin/settings/categories">{translation.Categories_admin}</Link>
                                                <Link class="nav-link" to="/admin/settings/tags-photos">
                                                {translation.Tags_Photos}
                                                </Link>
                                                <Link class="nav-link" to="/admin/settings/tags-notes">{translation.Tags_Notes}</Link>
                                                <Link class="nav-link" to="/admin/settings/categories-de-consultant">
                                                {translation.Tags_Notes}
                                                </Link>
                                                <Link class="nav-link" to="/admin/settings/services">{translation.Services_sidebar}</Link>
                                                <Link class="nav-link" to="/admin/settings/dossier-de-notes">
                                                {translation.Notes_file}
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

export default AdminSideNavigation;