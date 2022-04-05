import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';
import './index.scss';
import './index.css';
import one from "../../public/img/1.jpeg"
import two from "../../public/img/2.jpeg"
import three from "../../public/img/3.jpeg"
import four from "../../public/img/4.jpeg"
import five from "../../public/img/5.jpeg"
import six from "../../public/img/6.jpeg"
import seven from "../../public/img/7.jpeg"
import eight from "../../public/img/8.jpeg"
import nine from "../../public/img/9.jpeg"
import ten from "../../public/img/10.jpeg"
import eleven from "../../public/img/11.jpeg"

import React, { useState } from 'react';
import { Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap';
const Modal = (props) => {

    const [popoverOpen, setPopoverOpen] = useState(false);

    const toggle = () => setPopoverOpen(!popoverOpen);



    function desNon() {

    }


    return (
        <div id="lightbox4" class="modal fade " tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <button type="button" class="close closeButtonMargin" data-dismiss="modal" title="Close" style={{ marginLeft: "94%" }}> <span class="glyphicon glyphicon-remove">X</span></button>
                    <div class="clearfix"></div>
                    <div class="modal-body">
                        <div class="container">
                            <div class="row">
                                <div class="col-sm-6">
                                    <p>Date: 2021.03.24  Passage: 1</p>
                                </div>
                                <div class="col-sm-6">
                                    <p></p>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <p>Site: 700 Chemin de la grande ligne</p>
                                </div>
                                <div class="col-md-6">
                                    <span className="folderIconMain">
                                        <svg width="26" height="18" viewBox="0 0 26 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="26" height="18">
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M0 0H26V18H0V0Z" fill="white" />
                                            </mask>
                                            <g mask="url(#mask0)">
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M2.57988 16.5321L2.42396 16.532V16.5323C1.93718 16.5151 1.52766 16.1103 1.52766 15.6438V1.45831H7.58361L9.85262 3.15759H19.2584V4.86803H6.81854L3.75951 15.6173C3.61116 16.1385 3.13475 16.503 2.57988 16.5321ZM20.786 1.69933H10.3803L8.1113 0H0V15.6438C0 16.9047 1.07372 17.9574 2.39407 17.9903L20.4114 18H20.4129C21.5041 18 22.4658 17.298 22.7517 16.2925L26 4.86799H20.786V1.69933Z" fill="black" />
                                            </g>
                                        </svg>

                                    </span>
                                    <div className="iconPadding">
                                        <div class="btn-group">
                                            <button class="btn" type="button">
                                                <span>
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="4" y="2" width="16" height="20">
                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M4 2H20V22H4V2Z" fill="white" />
                                                        </mask>
                                                        <g mask="url(#mask0)">
                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M16.0586 8.25H7.93922C7.50385 8.25 7.15094 7.90023 7.15094 7.46875C7.15094 7.03727 7.50385 6.6875 7.93922 6.6875H16.0586C16.4939 6.6875 16.8469 7.03727 16.8469 7.46875C16.8469 7.90023 16.4939 8.25 16.0586 8.25ZM16.0586 11.375H7.93922C7.50385 11.375 7.15094 11.0252 7.15094 10.5938C7.15094 10.1623 7.50385 9.8125 7.93922 9.8125H16.0586C16.4939 9.8125 16.8469 10.1623 16.8469 10.5938C16.8469 11.0252 16.4939 11.375 16.0586 11.375ZM12.8704 14.5H7.93922C7.50385 14.5 7.15094 14.1502 7.15094 13.7188C7.15094 13.2873 7.50385 12.9375 7.93922 12.9375H12.8704C13.3058 12.9375 13.6587 13.2873 13.6587 13.7188C13.6587 14.1502 13.3058 14.5 12.8704 14.5ZM16.8469 2H16.8447H14.2083H7.15531C5.41667 2 4.00217 3.40191 4.00217 5.125V14.0274C4.00138 14.0417 4 14.0559 4 14.0703V18.875C4 20.5981 5.4145 22 7.15314 22H7.15531H9.7917H16.8447C18.5833 22 19.9978 20.5981 19.9978 18.875V9.97262C19.9986 9.95832 20 9.94418 20 9.92969V5.125C20 3.40191 18.5855 2 16.8469 2Z" fill="black" />
                                                        </g>
                                                    </svg>
                                                </span>
                                            </button>
                                            <button class="btn" type="button">
                                                <span>
                                                    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="5" y="2" width="15" height="20">
                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M5.77991 2L19.7799 2L19.7799 22L5.77991 22L5.77991 2Z" fill="white" />
                                                        </mask>
                                                        <g mask="url(#mask0)">
                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12.7799 12.8875C10.8379 12.8875 9.25807 11.2526 9.25807 9.24322C9.25807 7.23376 10.838 5.59899 12.7799 5.59899C14.7218 5.59899 16.3017 7.2338 16.3017 9.24325C16.3017 11.2527 14.7218 12.8875 12.7799 12.8875ZM12.7799 2C8.92009 2 5.77991 5.24926 5.77991 9.24322C5.77991 14.1998 12.0442 21.4763 12.3109 21.7836C12.5614 22.0724 12.9988 22.0719 13.2489 21.7836C13.5156 21.4763 19.7799 14.1998 19.7799 9.24322C19.7798 5.24926 16.6397 2 12.7799 2Z" fill="black" />
                                                        </g>
                                                    </svg>
                                                </span>
                                            </button>
                                            <button class="btn" type="button">
                                                <span>
                                                    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M17.5036 11.724C17.4023 11.4853 17.1798 11.3333 16.9348 11.3333H14.4348V2.66667C14.4348 2.29867 14.1548 2 13.8098 2H11.3098C10.9648 2 10.6848 2.29867 10.6848 2.66667V11.3333H8.18477C7.93977 11.3333 7.71731 11.4867 7.61602 11.724C7.51352 11.9627 7.55352 12.2413 7.71477 12.4387L12.0898 17.772C12.2085 17.9173 12.3798 18 12.5598 18C12.7398 18 12.9111 17.916 13.0298 17.772L17.4049 12.4387C17.5674 12.2427 17.6049 11.9627 17.5036 11.724Z" fill="black" />
                                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M19.893 16V20.2H5.22636V16H2.55969V21.6C2.55969 22.3742 3.15703 23 3.89303 23H21.2264C21.9637 23 22.5597 22.3742 22.5597 21.6V16H19.893Z" fill="black" />
                                                    </svg>
                                                </span>
                                            </button>
                                            <button class="btn" type="button">
                                                <span>
                                                    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M20.7041 4.74705C19.6696 3.63513 18.22 3.00246 16.7013 3.00012C15.1813 3.00188 13.7302 3.63421 12.6942 4.74634L12.341 5.11947L11.988 4.74634C9.93212 2.53368 6.47179 2.40661 4.25913 4.46247C4.16109 4.5536 4.06639 4.64825 3.97526 4.74634C1.79438 7.09868 1.79438 10.7341 3.97526 13.0865L11.8222 21.3615C12.0936 21.6481 12.5461 21.6604 12.8327 21.3889C12.842 21.38 12.8512 21.3709 12.86 21.3615L20.7041 13.0865C22.8848 10.7344 22.8848 7.09914 20.7041 4.74705Z" fill="#202124" />
                                                    </svg>
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div class="container h-100">
                            <div class="row justify-content-center align-items-center">
                                <div class="col-md-8 col-sm-12">
                                    <div class="carousel slide slideMargin" data-ride="carousel" id="carousel4" data-interval="false">
                                        <ol class="carousel-indicators">
                                            <li data-target="#carousel4" data-slide-to="0" class="pointer car_item"></li>
                                            <li data-target="#carousel4" data-slide-to="1" class="pointer car_item"></li>
                                            <li data-target="#carousel4" data-slide-to="2" class="pointer car_item active"></li>
                                            <li data-target="#carousel4" data-slide-to="3" class="pointer car_item"></li>
                                            <li data-target="#carousel4" data-slide-to="4" class="pointer car_item"></li>
                                            <li data-target="#carousel4" data-slide-to="5" class="pointer car_item"></li>
                                            <li data-target="#carousel4" data-slide-to="7" class="pointer car_item"></li>
                                            <li data-target="#carousel4" data-slide-to="8" class="pointer car_item"></li>
                                        </ol>
                                        <div class="carousel-inner" >
                                            <a class="folderIcon folderDisplay" href="#carousel4" role="button">
                                                <span class="folderIconFont" aria-hidden="true">
                                                    <svg width="40" height="34" viewBox="0 0 40 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <rect width="40" height="34" rx="4" fill="white" fill-opacity="0.8" />
                                                        <mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="8" y="8" width="26" height="18">
                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M8 8H34V26H8V8Z" fill="white" />
                                                        </mask>
                                                        <g mask="url(#mask0)">
                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M10.5799 24.5321L10.424 24.532V24.5323C9.93718 24.5151 9.52766 24.1103 9.52766 23.6438V9.45831H15.5836L17.8526 11.1576H27.2584V12.868H14.8185L11.7595 23.6173C11.6112 24.1385 11.1348 24.503 10.5799 24.5321ZM28.786 9.69933H18.3803L16.1113 8H8V23.6438C8 24.9047 9.07372 25.9574 10.3941 25.9903L28.4114 26H28.4129C29.5041 26 30.4658 25.298 30.7517 24.2925L34 12.868H28.786V9.69933Z" fill="black" />
                                                        </g>
                                                    </svg>

                                                </span>
                                            </a>
                                            <div class="carousel-item">
                                                <img class="d-block w-100" src={one} />
                                            </div>
                                            <div class="carousel-item">
                                                <img class="d-block w-100" src={two} />
                                            </div>
                                            <div class="carousel-item active">
                                                <img class="d-block w-100" src={three} />
                                            </div>
                                            <div class="carousel-item">
                                                <img class="d-block w-100" src={four} />
                                            </div>
                                            <div class="carousel-item">
                                                <img class="d-block w-100" src={five} />
                                            </div>
                                            <div class="carousel-item">
                                                <img class="d-block w-100" src={six} />
                                            </div>
                                            <div class="carousel-item">
                                                <img class="d-block w-100" src={seven} />
                                            </div>
                                            <div class="carousel-item">
                                                <img class="d-block w-100" src={eight} />


                                            </div>
                                        </div>
                                        <a class="carousel-control-prev prevButtonMargin" href="#carousel4" role="button" data-slide="prev">
                                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                        </a>
                                        <a class="carousel-control-next nextButtonMargin" href="#carousel4" role="button" data-slide="next">
                                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                        </a>

                                    </div>
                                    <br></br>

                                </div>
                                <div className="col-md-8 col-sm-12">

                                    <div class="container">
                                        <div class="row ">
                                            <button type="button" style={{ margin: "1%" }} class="btn btn-ligh btn-sm">Récolte de Janvier</button><br></br>
                                            <button type="button" style={{ margin: "1%" }} class="btn btn-ligh btn-sm">Agriculture céréale</button>
                                            <button type="button" style={{ margin: "1%" }} class="btn btn-ligh btn-sm">Biologique</button>
                                            <button type="button" style={{ margin: "1%" }} class="btn btn-outline-primary btn-sm">Ajouter</button>

                                        </div>
                                    </div>


                                    <div class="row">
                                        <div class="commentBoxWidth">
                                            <div class="">
                                                <div class="">
                                                    <textarea placeholder="Write your comment here!" class="pb-cmnt-textarea"></textarea>
                                                    <div class="container-fluid">
                                                        <div class="row form-item-margin">

                                                            <button type="button" class="btn btn-primary primaryTop mobile_button">Envoyer</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div class="row">
                                        <div class="commentBoxWidth">
                                            <div class="p-3 bg-white mt-2 rounded">
                                                <div class="d-flex justify-content-between">
                                                    <div class="d-flex flex-row user">

                                                        <div class="d-flex flex-column ml-2"><span class="font-weight-bold">@Nick</span><span class="day">1 day ago</span></div>
                                                    </div>
                                                    <div class="d-flex align-items-center px-3 heart "> 01-05-2012 <a id="Popover1" class="ml-2"><i href="" class="fas fa-ellipsis-h"></i>

                                                        <Popover className="proverLet" placement="bottom" isOpen={popoverOpen} target="Popover1" toggle={toggle}>
                                                            <PopoverHeader>Popover Title</PopoverHeader>
                                                            <PopoverBody>Sed posuere consectetur est at lobortis. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.</PopoverBody>
                                                        </Popover>
                                                    </a></div>
                                                </div>
                                                <div class="comment-text text-justify mt-2">
                                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                                                </div>
                                            </div>
                                            <div class="p-3 bg-white mt-2 rounded">
                                                <div class="d-flex justify-content-between">
                                                    <div class="d-flex flex-row user">

                                                        <div class="d-flex flex-column ml-2">
                                                            <span class="font-weight-bold">@Samantha</span><span class="day">2 days ago</span></div>
                                                    </div>
                                                    <div class="d-flex align-items-center px-3 heart "> 01-05-2012 <span class="ml-2"><i class="fas fa-ellipsis-h"></i></span></div>
                                                </div>
                                                <div class="comment-text text-justify mt-2">
                                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    )
}
export default Modal;