import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import {Popup} from "@progress/kendo-react-popup";
import Menuup from "../../../public/img/MenuUp.svg";
import Menudown from "../../../public/img/MenuDown.svg";
import dotbutton from "../../../public/img/dotbutton.svg";
import Add from "../../../public/img/Add.svg";
import Close from "../../../public/img/miniclose.svg";
import "./sidebarstyle.css"
import arrowleft from "../../../public/img/arrowleft.svg";

function ConsultantNoteSideNavigation() {

    const anchor = React.useRef(null);
    const [show, setShow] = React.useState(false);
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
                    <nav>
                        <div class="sb-sidenav-menu">
                            <div>
                                <div class="sb-sidenav-menu-heading">&nbsp;&nbsp;Notes</div>
                                <hr></hr>
                                &nbsp;&nbsp;&nbsp;&nbsp;Plantage
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <div class="btn-group dropright">
                                    <button class="btn btn-outline-light" data-toggle="dropdown" aria-haspopup="true"
                                            aria-expanded="false">
                                        <img src={dotbutton} className="producteure-note-doted-button-aligment"/>
                                    </button>
                                    <div class="dropdown-menu">
                                        <a class="dropdown-item" href="#"><img
                                            className="producture-note-mini-icon-aligmment" src={Add}/>&nbsp;Ajouter une
                                            page</a>
                                    </div>
                                </div>
                                <br/>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Premier trimestre<br/>
                                &nbsp;&nbsp;<img className="producture-note-sidebar-arrow" src={arrowleft}/>Opération
                                spéciale<br/>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Caractère technique<br/>
                                <br/>
                                <hr></hr>
                                &nbsp;&nbsp;&nbsp;&nbsp;Arrosage
                                <hr className="producteure-note-hr"></hr>
                                &nbsp;&nbsp;&nbsp;&nbsp;Épandage de fumier
                                <hr className="producteure-note-hr"></hr>
                                &nbsp;&nbsp;&nbsp;&nbsp;Post-levé
                                <hr className="producteure-note-hr"></hr>
                                &nbsp;&nbsp;&nbsp;&nbsp;Récolte
                                <hr className="producteure-note-hr"></hr>
                                &nbsp;&nbsp;&nbsp;&nbsp;Travail de sol
                                <hr className="producteure-note-hr"></hr>
                                &nbsp;&nbsp;&nbsp;&nbsp;Engrais vert
                                <hr className="producteure-note-hr"></hr>
                                &nbsp;&nbsp;&nbsp;&nbsp;Notes de l’agronome
                                <hr className="producteure-note-hr"></hr>
                                &nbsp;&nbsp;&nbsp;&nbsp;PAEF
                                <hr className="producteure-note-hr"></hr>
                                &nbsp;&nbsp;&nbsp;&nbsp;Plan de ferme
                                <hr className="producteure-note-hr"></hr>
                                &nbsp;&nbsp;&nbsp;&nbsp;Dossier 2021
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br/>
                                <button className="producteure-note-button" data-toggle="modal" data-target="#exampleModal">Ajouter une note</button>
                                <div class="btn-group dropright">
                                    <button class="btn btn-outline-light" data-toggle="dropdown" aria-haspopup="true"
                                            aria-expanded="false">
                                        <img src={dotbutton} className="producteure-note-doted-button-aligment"/>
                                    </button>
                                    <div class="dropdown-menu">
                                        <a class="dropdown-item" href="#"><img
                                            className="producture-note-mini-icon-aligmment" src={Add}/>&nbsp;Ajouter une
                                            page</a>
                                        <a class="dropdown-item" href="#"><img
                                            className="producture-note-mini-icon-aligmment" src={Close}/>&nbsp;Supprimer
                                            le dossier</a>
                                    </div>
                                </div>
                                <hr className="producteure-note-hr"></hr>
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
                                Settings
                                {show ? <img src={Menudown}/> : <img src={Menuup}/>}
                            </div>
                        </button>
                        {!show ? <Popup anchor={anchor.current} show={!show} popupClass={'popup-content'}
                                        className="producture-note-mobile-sidebar-background-color">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class=".col-sm">
                                        <div class="col">
                                            <div className="producture-note-mobile-sidebar-font-color">
                                                <hr></hr>
                                                &nbsp;&nbsp;&nbsp;&nbsp;Plantage
                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                <div class="btn-group">
                                                    <button class="btn btn-outline-light" data-toggle="dropdown"
                                                            aria-haspopup="true" aria-expanded="false">
                                                        <img src={dotbutton}
                                                             className="producteure-note-doted-button-aligment"/>
                                                    </button>
                                                    <div class="dropdown-menu">
                                                        <a class="dropdown-item" href="#"><img
                                                            className="producture-note-mini-icon-aligmment"
                                                            src={Add}/>&nbsp;Ajouter une page</a>
                                                    </div>
                                                </div>
                                                <br/>
                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Premier trimestre<br/>
                                                &nbsp;&nbsp;<img className="producture-note-sidebar-arrow"
                                                                 src={arrowleft}/>Opération spéciale<br/>
                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Caractère technique<br/><br/>
                                                <button type="button" class="btn btn-primary">Ajouter une page</button>
                                                <br/>
                                                <hr></hr>
                                                &nbsp;&nbsp;&nbsp;&nbsp;Arrosage
                                                <hr className="producteure-note-hr"></hr>
                                                &nbsp;&nbsp;&nbsp;&nbsp;Épandage de fumier
                                                <hr className="producteure-note-hr"></hr>
                                                &nbsp;&nbsp;&nbsp;&nbsp;Post-levé
                                                <hr className="producteure-note-hr"></hr>
                                                &nbsp;&nbsp;&nbsp;&nbsp;Récolte
                                                <hr className="producteure-note-hr"></hr>
                                                &nbsp;&nbsp;&nbsp;&nbsp;Travail de sol
                                                <hr className="producteure-note-hr"></hr>
                                                &nbsp;&nbsp;&nbsp;&nbsp;Engrais vert
                                                <hr className="producteure-note-hr"></hr>
                                                &nbsp;&nbsp;&nbsp;&nbsp;Notes de l’agronome
                                                <hr className="producteure-note-hr"></hr>
                                                &nbsp;&nbsp;&nbsp;&nbsp;PAEF
                                                <hr className="producteure-note-hr"></hr>
                                                &nbsp;&nbsp;&nbsp;&nbsp;Plan de ferme
                                                <hr className="producteure-note-hr"></hr>
                                                &nbsp;&nbsp;&nbsp;&nbsp;Dossier ABCD
                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                <div class="btn-group">
                                                    <button class="btn btn-outline-light" data-toggle="dropdown"
                                                            aria-haspopup="true" aria-expanded="false">
                                                        <img src={dotbutton}
                                                             className="producteure-note-doted-button-aligment"/>
                                                    </button>
                                                    <div class="dropdown-menu">
                                                        <a class="dropdown-item" href="#"><img
                                                            className="producture-note-mini-icon-aligmment"
                                                            src={Add}/>&nbsp;Ajouter une page</a>
                                                        <a class="dropdown-item" href="#"><img
                                                            className="producture-note-mini-icon-aligmment"
                                                            src={Close}/>&nbsp;Supprimer le dossier</a>
                                                    </div>
                                                </div>
                                                <hr className="producteure-note-hr"></hr>
                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                <button type="button" class="btn btn-primary">Ajouter un dossier
                                                </button>
                                                <hr className="producteure-note-hr"></hr>
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

export default ConsultantNoteSideNavigation;