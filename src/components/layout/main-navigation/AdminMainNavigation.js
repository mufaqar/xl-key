import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import Logo from "../../../public/img/Logo.png"
import { Popup } from "@progress/kendo-react-popup";
import Close from "../../../public/img/Close.svg";
import Menu from "../../../public/img/Menu.svg";
import Dashboard from "../../../public/img/Dashboard.svg";
import Entreprises from "../../../public/img/Entreprises.svg";
import Uploadphotos from "../../../public/img/Uploadphotos.svg";
import Settings from "../../../public/img/Settings.svg";
import Producteurs from "../../../public/img/Producteurs.svg";
import Consultants from "../../../public/img/Consultants.svg";
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Api from "../../../helper/api";
import { useHistory } from "react-router-dom";
import { setLogout } from '../../../actions';
import LanguageHandler from "../../LanguageHandler";
import useTranslation from "../../customHooks/translations";



function AdminMainNavigation(props) {
    const dispatch = useDispatch();
    const user_fullname = useSelector(state => state.name);
    let user_account_logo = useSelector(state => state.logo);
    const token = useSelector(state => state.token);
    let history = useHistory();
    const [logo, setLogo] = React.useState(user_account_logo);
    const [api, setApi] = React.useState(new Api(token, props.acc_id));
    if(props.acc_id) getHeader();
    const anchor = React.useRef(null);
    const [show, setShow] = React.useState(false);
    React.useEffect(() => {
        setShow(true);
    }, []);

    const onClick = () => {
        setShow(!show);
        makeBlur1();
    };

    var [toggle, settoggle] = React.useState(0.2)

    function makeBlur1() {
        if (toggle == 0.2) {
            settoggle(1)
        } else {
            settoggle(0.2)
        }
        document.getElementById("mainDivSelect").style.opacity = toggle;
    }

    function handleClickLogout() {
        dispatch(setLogout())
        history.push("/");
    }


    function getHeader(){
         api.getHeader(props.acc_id)
    
            .then(response => {
            
                console.log("data  fetchByEntreprise", response);
                let data = response.data.data;
                if(data.logo_url){
                    let logo = process.env.REACT_APP_IMAGE_URL + data.logo_url;                   
                    setLogo(logo)
                }              
            })
            .catch(err => {
                if( err.response.status == 401){
                    this.props.history.push('/');
                  }
              });
    }

    const translation = useTranslation();
    return (
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <button class="btn btn-outline-light" onClick={onClick} ref={anchor}>
                {show ? <img src={Menu} /> : <img src={Close} />}
            </button>
            {!show ? <Popup anchor={anchor.current} show={!show} popupClass={'popup-content'}>

                <div className="row">
                    <div className="col-5 ml-5">
                        <Link to="/admin/dashboard">
                            <div className="row">
                                <img src={Dashboard} width="40" height="40" style={{ marginTop: '8px' }} />
                                <div className="column">
                                    <div className="topic-font ml-0">{translation.Dashboard}</div>
                                    <div className="description-font ml-0"></div>
                                </div>
                            </div>
                        </Link>
                        <Link to="/admin/producteurs">
                            <div className="row">
                                <img src={Producteurs} width="40" height="40" style={{ marginTop: '8px' }} />
                                <div className="column">
                                    <div className="topic-font ml-0">{translation.Producers}</div>
                                    <div className="description-font ml-0"></div>
                                </div>
                            </div>
                        </Link>
                        <Link to="/admin/upload-d-images">
                            <div className="row">
                                <img src={Uploadphotos} width="40" height="40" style={{ marginTop: '8px' }} />
                                <div className="column">
                                    <div className="topic-font ml-0">{translation.Downloading_images}</div>
                                    <div className="description-font ml-0"></div>
                                </div>
                            </div>
                        </Link>
                    </div>
                    <div className="col-5 ml-5">
                        <Link to="/admin/entreprise">
                            <div className="row">
                                <img src={Entreprises} width="40" height="40" style={{ marginTop: '8px' }} />
                                <div className="column">
                                    <div className="topic-font ml-0">{translation.Entreprise}</div>
                                    <div className="description-font ml-0"></div>
                                </div>
                            </div>
                        </Link>
                        <Link to="/admin/consultants">
                            <div className="row">
                                <img src={Consultants} width="40" height="40" style={{ marginTop: '8px' }} />
                                <div className="column">
                                    <div className="topic-font ml-0">{translation.Consultants}</div>
                                    <div className="description-font ml-0"></div>
                                </div>
                            </div>
                        </Link>
                        <Link to="/admin/settings/information-de-connexion">
                            <div className="row">
                                <img src={Settings} width="40" height="40" style={{ marginTop: '8px' }} />
                                <div className="column">
                                    <div className="topic-font ml-0">{translation.Settings}</div>
                                    <div className="description-font ml-0"></div>
                                </div>
                            </div>
                        </Link>
                        <div className="desktophidden">
                            <li class="nav-item belPadding">
                                <LanguageHandler />
                            </li>
                        </div>
                        <br/>
                        <div className="desktophidden">
                        <button class="nav-link" type="button" onClick={handleClickLogout}>{translation.Logout}</button>
                        </div>
                    </div>
                </div>
            </Popup> : null}

            {/* <button  class="navbar-toggler buttonClass" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button> */}

            <a class="navbar-brand logoMargin" style={{ width: "50%" }} href="/admin/dashboard"><img src={user_account_logo} height="35" style={{height:'75px'}}/></a>
            {/* <a class="navbar-brand bellIconMoble" href="#">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M12 2C10.3725 2 9.04834 3.19359 9.04834 4.66055V5.46328H10.5751V4.66055C10.5751 3.95231 11.2145 3.37613 12 3.37613C12.7857 3.37613 13.4252 3.95227 13.4252 4.66055V5.46328H14.9519V4.66055C14.9519 3.19359 13.6275 2 12 2Z"
                        fill="black" />
                    <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M14.0865 18.7658C14.0865 19.7904 13.1618 20.6238 12.0254 20.6238H11.9745C10.8381 20.6238 9.91343 19.7904 9.91343 18.7658H8.38672C8.38672 20.5493 9.99616 22 11.9745 22H12.0254C14.0038 22 15.6132 20.5493 15.6132 18.7658H14.0865Z"
                        fill="black" />
                    <mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="2" y="4" width="20" height="16">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M2 4.54585H22V19.5688H2V4.54585Z"
                            fill="white" />
                    </mask>
                    <g mask="url(#mask0)">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M4.16152 18.1927L5.69538 16.0418C5.77452 15.931 5.81677 15.8016 5.81677 15.6697V11.5642C5.81677 8.4532 8.59058 5.92203 12 5.92203C15.4097 5.92203 18.1833 8.45324 18.1833 11.5642V15.6697C18.1833 15.8016 18.2253 15.9307 18.3044 16.0418L19.8383 18.1927H4.16152ZM21.8787 18.5087L19.71 15.4677V11.5642C19.71 7.69425 16.2512 4.54585 12 4.54585C7.74859 4.54585 4.29006 7.69425 4.29006 11.5642V15.4677L2.12136 18.5085C1.9702 18.7202 1.95954 18.9895 2.09336 19.2103C2.22719 19.4312 2.48396 19.5688 2.76335 19.5688H21.2367C21.5161 19.5688 21.7728 19.4312 21.9065 19.2106C22.0405 18.9897 22.0298 18.7204 21.8787 18.5087Z"
                            fill="black" />
                    </g>
                </svg>
            </a> */}
            <div class="collapse navbar-collapse flex-grow-1 text-right" id="navbarSupportedContent1">
                <ul class="navbar-nav ml-auto flex-nowrap">
                    {/* <li class="nav-item belPadding">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M12 2C10.3725 2 9.04834 3.19359 9.04834 4.66055V5.46328H10.5751V4.66055C10.5751 3.95231 11.2145 3.37613 12 3.37613C12.7857 3.37613 13.4252 3.95227 13.4252 4.66055V5.46328H14.9519V4.66055C14.9519 3.19359 13.6275 2 12 2Z"
                                fill="black" />
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M14.0865 18.7658C14.0865 19.7904 13.1618 20.6238 12.0254 20.6238H11.9745C10.8381 20.6238 9.91343 19.7904 9.91343 18.7658H8.38672C8.38672 20.5493 9.99616 22 11.9745 22H12.0254C14.0038 22 15.6132 20.5493 15.6132 18.7658H14.0865Z"
                                fill="black" />
                            <mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="2" y="4" width="20"
                                height="16">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M2 4.54585H22V19.5688H2V4.54585Z"
                                    fill="white" />
                            </mask>
                            <g mask="url(#mask0)">
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M4.16152 18.1927L5.69538 16.0418C5.77452 15.931 5.81677 15.8016 5.81677 15.6697V11.5642C5.81677 8.4532 8.59058 5.92203 12 5.92203C15.4097 5.92203 18.1833 8.45324 18.1833 11.5642V15.6697C18.1833 15.8016 18.2253 15.9307 18.3044 16.0418L19.8383 18.1927H4.16152ZM21.8787 18.5087L19.71 15.4677V11.5642C19.71 7.69425 16.2512 4.54585 12 4.54585C7.74859 4.54585 4.29006 7.69425 4.29006 11.5642V15.4677L2.12136 18.5085C1.9702 18.7202 1.95954 18.9895 2.09336 19.2103C2.22719 19.4312 2.48396 19.5688 2.76335 19.5688H21.2367C21.5161 19.5688 21.7728 19.4312 21.9065 19.2106C22.0405 18.9897 22.0298 18.7204 21.8787 18.5087Z"
                                    fill="black" />
                            </g>
                        </svg>
                    </li> */}
                    <li class="nav-item belPadding">
                        <LanguageHandler />
                    </li>

                    <li class="nav-item"><span class="testname">{translation.Hello},{user_fullname} </span>

                        <svg className="logout-btn" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="1" y="1" width="22"
                                height="22">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M1 1H23V23H1V1Z" fill="white" />
                            </mask>
                            <g mask="url(#mask0)">
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M8.12066 18.5815C8.73627 18.9456 9.39885 19.2206 10.09 19.399C10.3746 19.4724 10.5734 19.7291 10.5734 20.0231V20.9747C10.5734 21.3807 10.9037 21.7109 11.3097 21.7109H12.6904C13.0963 21.7109 13.4266 21.3807 13.4266 20.9747V20.0231C13.4266 19.7291 13.6255 19.4724 13.9101 19.399C14.6012 19.2206 15.2638 18.9456 15.8794 18.5815C16.1327 18.4318 16.4552 18.4725 16.6633 18.6806L17.3374 19.3547C17.6281 19.6457 18.0947 19.6389 18.3783 19.355L19.3548 18.3785C19.6376 18.096 19.6471 17.6292 19.3551 17.3376L18.6807 16.6632C18.4726 16.4552 18.4319 16.1326 18.5816 15.8793C18.9457 15.2638 19.2207 14.6012 19.3991 13.91C19.4725 13.6254 19.7292 13.4266 20.0231 13.4266H20.9748C21.3807 13.4266 21.711 13.0964 21.711 12.6904V11.3096C21.711 10.9037 21.3807 10.5735 20.9748 10.5735H20.0231C19.7292 10.5735 19.4725 10.3746 19.3991 10.09C19.2207 9.39886 18.9456 8.73628 18.5816 8.12071C18.4319 7.86745 18.4726 7.54493 18.6807 7.33691L19.3548 6.66273C19.6462 6.37166 19.6386 5.90502 19.3551 5.62186L18.3786 4.64535C18.0956 4.36192 17.6287 4.35363 17.3377 4.64513L16.6634 5.31949C16.4553 5.52758 16.1327 5.56832 15.8794 5.41857C15.2638 5.05445 14.6012 4.77945 13.9101 4.60105C13.6255 4.52761 13.4267 4.27096 13.4267 3.97697V3.02521C13.4267 2.61932 13.0964 2.28907 12.6905 2.28907H11.3097C10.9038 2.28907 10.5735 2.61932 10.5735 3.02521V3.97688C10.5735 4.27083 10.3746 4.52753 10.09 4.60096C9.39889 4.77937 8.73631 5.05441 8.1207 5.41844C7.86735 5.56823 7.54487 5.52745 7.33682 5.3194L6.66272 4.6453C6.37208 4.35432 5.90531 4.36102 5.62185 4.64496L4.6453 5.62147C4.36248 5.90395 4.35302 6.37072 4.64504 6.66239L5.31944 7.33679C5.52749 7.54484 5.56822 7.86736 5.41848 8.12062C5.0544 8.73624 4.7794 9.39877 4.60104 10.0899C4.52756 10.3746 4.27087 10.5734 3.97696 10.5734H3.02529C2.61936 10.5734 2.28906 10.9037 2.28906 11.3096V12.6904C2.28906 13.0963 2.61936 13.4265 3.02529 13.4265H3.97692C4.27087 13.4265 4.52752 13.6254 4.601 13.91C4.77936 14.6011 5.0544 15.2637 5.41844 15.8793C5.56818 16.1326 5.52745 16.4551 5.31939 16.6631L4.64526 17.3373C4.35384 17.6283 4.36145 18.095 4.645 18.3782L5.62146 19.3547C5.9045 19.6381 6.37131 19.6464 6.66238 19.3549L7.33673 18.6806C7.49005 18.5272 7.809 18.3972 8.12066 18.5815ZM12.6904 23H11.3096C10.1929 23 9.28434 22.0915 9.28434 20.9748V20.5076C8.80957 20.356 8.3483 20.1645 7.90517 19.9352L7.57414 20.2662C6.77238 21.069 5.48809 21.0454 4.70962 20.2659L3.73376 19.2901C2.95392 18.5111 2.93149 17.2272 3.73402 16.4256L4.06479 16.0948C3.83547 15.6516 3.64404 15.1905 3.49232 14.7156H3.02525C1.90857 14.7156 1 13.8071 1 12.6904V11.3096C1 10.1929 1.90857 9.28435 3.02529 9.28435H3.49236C3.64408 8.80959 3.83551 8.34836 4.06483 7.90522L3.7338 7.57423C2.93175 6.77303 2.95388 5.489 3.73406 4.70971L4.71001 3.73381C5.49028 2.95246 6.77427 2.93291 7.57448 3.73402L7.90521 4.06475C8.34835 3.83547 8.80962 3.644 9.28438 3.49228V3.02521C9.28438 1.90853 10.1929 1 11.3097 1H12.6904C13.8071 1 14.7156 1.90853 14.7156 3.02521V3.49232C15.1904 3.644 15.6517 3.83547 16.0948 4.0648L16.4258 3.73381C17.2276 2.93102 18.5119 2.95457 19.2903 3.73406L20.2662 4.70989C21.0461 5.48887 21.0685 6.77278 20.2659 7.5744L19.9352 7.90522C20.1645 8.34836 20.3559 8.80954 20.5076 9.28435H20.9747C22.0915 9.28435 23 10.1929 23 11.3096V12.6904C23 13.8071 22.0915 14.7156 20.9747 14.7156H20.5076C20.3559 15.1904 20.1645 15.6516 19.9352 16.0948L20.2662 16.4258C21.0683 17.2271 21.0462 18.511 20.2659 19.2903L19.29 20.2662C18.5097 21.0476 17.2257 21.0671 16.4255 20.266L16.0948 19.9353C15.6517 20.1646 15.1904 20.356 14.7156 20.5077V20.9748C14.7156 22.0915 13.8071 23 12.6904 23Z"
                                    fill="black" />
                            </g>
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M12 8.3465C9.98541 8.3465 8.3465 9.98546 8.3465 12C8.3465 14.0145 9.98546 15.6535 12 15.6535C14.0145 15.6535 15.6535 14.0145 15.6535 12C15.6535 9.98546 14.0146 8.3465 12 8.3465ZM12 17C9.24295 17 7 14.757 7 12C7 9.243 9.24295 7 12 7C14.757 7 17 9.243 17 12C17 14.757 14.757 17 12 17Z"
                                fill="black" />
                        </svg>
                        <div class="dropdown-menu dropdown-menu-right">
                            <button class="dropdown-item" type="button" onClick={handleClickLogout}>{translation.Logout}</button>
                        </div>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default AdminMainNavigation;