
import 'bootstrap/dist/css/bootstrap.css';
import Logo from "../../../public/img/Logo.png"
import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { Link, Route } from 'react-router-dom';

import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const bsdaf={
    backgroundColor:"white"
}
const sty={
    width: "150px"
}
const backgroundCo ={
    backgroundColor: '#f3020d !important'
}
function side(props){
    return(
        
        <div id="layoutSidenav_nav">
        <nav class="sb-sidenav accordion sb-sidenav-light" id="sidenavAccordion">
            <div class="sb-sidenav-menu">
                <div class="nav">
                    <div class="sb-sidenav-menu-heading">Settings</div>
                    <a class="nav-link"   href="/SettingsInformationGeneral">Information général</a>
                    <a class="nav-link" href="/ProducteurSettingsConnectionSending_1.5.1">Connexion et envoi</a>
                    <a class="nav-link" href="/SettingsSiteAndCategories">Sites et catégories</a>
                    <a class="nav-link" href="/SettingsTagsPhotos">Tags photos</a>
                    <a class="nav-link" href="/ProducteurSettingsTagsNotes_1.5.5">Tags notes</a>
                    <a class="nav-link" href="/SettingsAccessInvitations">Acces et invitations</a>
                    <a class="nav-link" href="/SettingsPlanDeFerme">Plan de ferme</a>
                    <a class="nav-link" href="/SettingsSubscriptionsInvoices">Abonnements et factures</a>
                    <a class="nav-link" href="/SettingsFileName">Nom des champs</a>
                </div>
            </div>
            
        </nav>
    </div>
    )
}
export default side;