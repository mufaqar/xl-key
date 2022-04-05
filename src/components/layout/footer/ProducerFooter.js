import 'bootstrap/dist/css/bootstrap.css';
import Logo from "../../../public/img/footerlogo.png";
import React from 'react';
import './index.css'
import useTranslation from "../../customHooks/translations";

function ProducerFooter(props) {
    const translation = useTranslation();
    return (
        <div className="footerbackground">
            <div class="container-fluid">

                <div class="row">
                    <div class="col-xl">
                        <img src={Logo} width="150" height="45"/>
                    </div>
                </div>
                <br/>
                <div className="pl-3 pr-3">
                    <div class="row">
                        <div class="col-md-8">
                            <div class="row">
                                <div class="col-6">
                                    <div className="textcolour">
                                        {translation.Experiences}
                                        <br/><br/>
                                        <a className="link-text" href="/producteur/dashboard">{translation.Dashboard}</a>
                                        <br/><br/>
                                        <a className="link-text" href="/producteur/photos">{translation.Photos}</a>
                                        <br/><br/>
                                        <a className="link-text" href="/producteur/notes">{translation.Notebook}</a>

                                        <br/><br/>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div className="textcolour">
                                        {translation.Find_out_more}
                                        <br/><br/>
                                        <a className="link-text" href="/producteur/services">{translation.Request_for_services}</a>
                                        <br/><br/>
                                        <a className="link-text" href="#">{translation.Website}</a>
                                        <br/><br/>
                                        <a className="link-text" href="#">{translation.Contact}</a>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <br/><br/>
                        <div class="col-md-4">
                            <div className="textcolour">
                                {translation.Account}
                                <br/><br/>
                                <a className="link-text" href="/producteur/settings/information-general">{translation.Settings}</a>
                                <br/><br/>
                                <a className="link-text" href="/producteur/notifications">{translation.Notifications}</a>

                            </div>
                        </div>
                    </div>
                    <br/><br/>
                    <div class="row">
                        <div class="col-md">
                            <div className="legaltextcolour">
                                <a className="link-text" href="#">{translation.Legal_Notice}</a>
                            </div>
                        </div>
                        {/* <div class="col-md-0  pr-3">
                            <div className="legaltextcolour">
                                EN
                            </div>
                        </div> */}
                    </div>

                    <div class="row pt-1">
                        <div class="col-md">
                            <div className="line">
                                <hr></hr>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md">
                            <br/>
                            <div className="textcolour">
                                <div className="centerword"> {translation.Copyright}</div>
                            </div>
                            <br/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProducerFooter;