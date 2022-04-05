import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';
import './home.scss';
import './Home.css';
import Config from "../../config/config";
import closeIcon from "../../public/img/close_btn_icon.png"
import glyphIvon from "../../public/img/glyphicon.png"
import cx from "classnames";

import React, { useEffect, useState, useRef } from 'react';
import { Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Api from "../../helper/photo-api";
import * as Moment from "moment";
import useTranslation from "../customHooks/translations"
import getLanguage from "../customHooks/get-language";

const mapStateToProps = state => {
    let token = state.token;
    let userRole = state.userRole;
    let isLogged = state.isLogged;
    return { token, userRole, isLogged }
}

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideAlerter(ref, ref2) {
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                alert("You clicked outside of me!");
            }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);
}

const Modal = (props) => {

    const [popoverOpen, setPopoverOpen] = useState(false);
    const [viewer, setViewer] = useState(false);
    const [photo, setPhoto] = useState(props.photo);
    const [index, setIndex] = useState((props.index));
    const [api, setApi] = useState(new Api(props.token, props.acc_id));
    const [favourite, setFavourite] = useState(photo.favourites != null && photo.favourites[0] != null);
    const [comments, setComments] = useState([]);
    const [commentId, setCommentId] = useState();
    const [message, setMessage] = useState();
    const [clicked, setClicked] = useState(false);
    const [photoArray, setPhotoArray] = useState(props.openPopupPhotoArray);

    if (photo.id != props.photo.id) {
        if (!clicked) {
            setPhoto(props.photo)
            setIndex(props.index)
        }
    }

    const wrapperRef = useRef(null);

    const closePopup = () => {
        setClicked(false);
    };

    const closePopupOnOverlay = (event) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setClicked(false);
            //alert("You clicked outside of me!");
            //return;
        }
    };

    useEffect(() => {
        getComments();
        const modelOverlay = document.querySelector('#lightbox4');
        modelOverlay.addEventListener("mousedown", closePopupOnOverlay);
    }, []);

    const getComments = () => {
        api.getAllCommentsOfPhoto(photo.id)
            .then(response => {
                setComments(response.data.data);
            })
            .catch(err => {
                if (err.response && err.response.status == 401) {
                    this.props.history.push('/');
                } else {
                    if (err.response && err.response.data.message) {
                        this.setState({ message: err.response.data.message });
                    } else {
                        this.setState({ message: "Quelque chose s'est mal passé !" });
                    }
                }
            });
    }

    // const toggle = () => {
    //     setPopoverOpen(!popoverOpen);
    //     // console.log(id);
    // };

    const toggle = (id) => {

        let selectedComment = id;
        if (commentId == selectedComment) {
            selectedComment = null;
        }
        setCommentId(selectedComment);
        setPopoverOpen(!popoverOpen);

    };

    const deleteComment = () => {
        api.deleteComment(commentId)
            .then(response => {
                getComments();
            }
            )
            .catch(err => {
                if (err.response && err.response.status == 401) {
                    props.history.push('/');
                } else {
                    // if (err.response && err.response.data.message) {
                    //     this.setState({message: err.response.data.message});
                    // } else {
                    //     this.setState({message: "Quelque chose s'est mal passé !"});
                    // }
                }
            });
    };

    const [value, setValue] = useState(props.name);
    const handleCommentChange = (event) => {
        setValue(event.target.value);
    };

    const submitComment = (event) => {
        event.preventDefault();
        createNewOne();
    };

    const createNewOne = () => {
        const dataObject = {
            "comment_en": value,
            "comment_fr": value,
            "photo_id": photo.id
        }
        api.createComment(dataObject)
            .then(response => {
                console.log("data  new ", response);
                setValue('');
                getComments();
            }
            )
            .catch(err => {
                if (err.response && err.response.status == 401) {
                    props.history.push('/');
                } else {
                    if (err.response && err.response.data.message) {
                        setMessage(err.response && err.response.data.message);
                    } else {
                        setMessage("Quelque chose s'est mal passé !");
                    }
                }
            });
    };

    const createFavourite = () => {
        api.updateFavourite(photo.id)
            .then(response => {
                window.location.reload(false);
                }
            )
            .catch(err => {
                if (err.response && err.response.status == 401) {
                    props.history.push('/');
                } else {
                    // if (err.response && err.response.data.message) {
                    //     this.setState({message: err.response.data.message});
                    // } else {
                    //     this.setState({message: "Quelque chose s'est mal passé !"});
                    // }
                }
            });
    };

    const deleteFavourite = () => {
        // event.preventDefault();
        api.deleteFavourite(photo.id)
            .then(response => {
                window.location.reload(false);
                }
            )
            .catch(err => {
                if (err.response && err.response.status == 401) {
                    props.history.push('/');
                } else {
                    // if (err.response && err.response.data.message) {
                    //     this.setState({message: err.response.data.message});
                    // } else {
                    //     this.setState({message: "Quelque chose s'est mal passé !"});
                    // }
                }
            });
    };

    const archivePhoto = () => {
        const dataObject = {
            "status": "archive"
        }
        api.archivePhoto([photo.id, dataObject])
            .then(response => {
                window.location.reload(false);
            }
            )
            .catch(err => {
                if (err.response && err.response.status == 401) {
                    props.history.push('/');
                } else {
                    // if (err.response && err.response.data.message) {
                    //     this.setState({message: err.response.data.message});
                    // } else {
                    //     this.setState({message: "Quelque chose s'est mal passé !"});
                    // }
                }
            });
    };

    const unArchivePhoto = () => {
        const dataObject = {
            "status": "active"
        }
        api.archivePhoto([photo.id, dataObject])
            .then(response => {
                    window.location.reload(false);
                }
            )
            .catch(err => {
                if (err.response && err.response.status == 401) {
                    props.history.push('/');
                } else {
                    // if (err.response && err.response.data.message) {
                    //     this.setState({message: err.response.data.message});
                    // } else {
                    //     this.setState({message: "Quelque chose s'est mal passé !"});
                    // }
                }
            });
    };

    const getDate = (date) => {
        Moment.locale('en');
        return Moment(date).format('YYYY MM DD');
    }

    const getNextPhoto = () => {
        let new_index = index+1;
        if (photoArray.length <= new_index) {
            new_index = photoArray.length-1;
        } 
        setClicked(true, setIndex(new_index, getSelectedPhoto(photoArray[new_index])));
    }

    const getPrevPhoto = () => {
        let new_index = index-1;
        if (0 > new_index) new_index = 0;
        setClicked(true, setIndex(new_index, getSelectedPhoto(photoArray[new_index])));
    }

    const getSelectedPhoto = (new_index) => {

        api
            .getSinglePhoto(new_index)
            .then(response => {
                if (response.status === 200) {
                    setPhoto(response.data.data)
                }
            })
            .catch(err => {
                if (err.response && err.response.status == 401) {
                    this.props.history.push('/');
                } else {
                    if (err.response && err.response.data.message) {
                        setMessage(err.response && err.response.data.message);
                    } else {
                        setMessage("Quelque chose s'est mal passé !");
                    }
                }
            });
    }

    const translation = useTranslation();
    const language = getLanguage();
    const isFrench = language == "FR";
    return (
        <div>
            <div id="lightbox4" class="modal fade " role="dialog" aria-hidden="true">
                <div ref={wrapperRef} class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <div class="pull-left"></div>
                            <button type="button" class="close" data-dismiss="modal" title="Close" onClick={() => closePopup()}> <span class="glyphicon glyphicon-remove">X</span></button>
                        </div>
                        <div class="clearfix"></div>
                        {photo ? (
                            <div class="modal-body">
                                <div class="container">
                                    <div class="row">
                                        <div class="col-sm-6">
                                            <p>{translation.Year}: {(photo.photo_year && photo.photo_year[0]) && ( photo.photo_year[0].name_fr )}</p>
                                        </div>
                                        <div class="col-sm-6">
                                            <p>{translation.Passages}:
                                                {photo.photo_passage != null && ((photo.photo_passage).map((passage) => (
                                                    <div>
                                                        {isFrench ? passage.name_fr : passage.name_en}
                                                    </div>
                                                )))}
                                            </p>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-sm-6">
                                            <p>{translation.Sites}:
                                                {photo.photo_site != null && ((photo.photo_site).map((site) => (
                                                    
                                                    <div>
                                                        {isFrench ? site.name_fr :site.name_en}
                                                    </div>
                                                )))}
                                            </p>
                                        </div>
                                        <div class="col-sm-6">
                                            <p>{translation.Fields}:
                                                {photo.photo_field != null && ((photo.photo_field).map((field) => (
                                                    <div>
                                                        {isFrench ? field.name_fr :field.name_en}
                                                    </div>
                                                )))}
                                            </p>
                                        </div>
                                        <div class="col-sm-12">
                                            <div className="iconPadding">
                                                <div class="btn-group">
                                                    <button class="btn" type="button" onClick={() => setViewer(true)}><span class="fa fa-expand fa-lg"></span></button>
                                                    <button class="btn" type="button"><span class="fa fa-sticky-note fa-lg"></span></button>
                                                    {(photo.longitute && photo.latitute) && (<a href={"https://www.google.com/maps/?q=" + (photo.latitute) + "," + (photo.longitute)} target="_blank"><button class="btn" type="button"><span class="fa fa-map-marker fa-lg"></span></button></a>)}
                                                    <a href={process.env.REACT_APP_IMAGE_URL + "download/" + (photo.url).replace('uploads/', '')}><button class="btn" type="button"><span class="fa fa-download fa-lg"></span></button></a>
                                                    {
                                                        photo.favourites != null && photo.favourites[0] != null ? (
                                                                <button className="btn" type="button"
                                                                        style={{color: '#007bff'}}
                                                                        onClick={deleteFavourite}>
                                                                    <span className="fa fa-heart fa-lg"></span>
                                                                </button>
                                                            ) :
                                                            (
                                                                <button className="btn" type="button"
                                                                        onClick={createFavourite}>
                                                                    <span className="fa fa-heart fa-lg"></span>
                                                                </button>
                                                            )
                                                    }
                                                    {
                                                        photo.status == "active" ? (
                                                                <button className="btn" type="button"
                                                                        onClick={archivePhoto}>
                                                                    <span className="fa fa-folder fa-lg"></span>
                                                                </button>
                                                            ) :
                                                            (
                                                                <button className="btn" type="button"
                                                                        style={{color: '#007bff'}}
                                                                        onClick={unArchivePhoto}>
                                                                    <span className="fa fa-folder fa-lg"></span>
                                                                </button>
                                                            )
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="container h-100">
                                    <div class="row h-100 justify-content-center align-items-center">
                                        <div class="col-12">
                                            <div class="carousel slide" data-ride="carousel" id="carousel4" data-interval="false">
                                                <div class="carousel-inner" >
                                                    <div class="carousel-item active" onClick={() => setViewer(true)}>
                                                        <img class="d-block w-100 " src={"data:image/png;base64," + photo.thumbnail_small} />
                                                    </div>
                                                </div>
                                                {/* Pagination */}
                                                <a class="carousel-control-prev" href="#carousel4" role="button" data-slide="prev" onClick={() => getPrevPhoto()}>
                                                    <span class="carousel-control-prev-icon" aria-hidden="true" ></span>
                                                </a>
                                                <a class="carousel-control-next" href="#carousel4" role="button" data-slide="next" onClick={() => getNextPhoto()}>
                                                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                                </a>
                                            </div>
                                            <br></br>
                                            <div>
                                                <p>{translation.Tags}:
                                                    {photo.tag != null && ((photo.tag).map((t) => (
                                                        <button type="button" className="btn btn-light" style={{ margin: "5px" }}>
                                                            {isFrench ? t.name_fr :t.name_en}
                                                        </button>
                                                    )))}
                                                </p>
                                            </div>
                                            <br></br>
                                            <form id="noter-save-form">
                                                <div className="row">
                                                    <div class="commentBoxWidth">
                                                        <div class="">
                                                            <div class="">
                                                                <textarea placeholder={translation.Write_comment}
                                                                    class="pb-cmnt-textarea"
                                                                    id="noter-text-area" name="textarea" value={value}
                                                                    onChange={handleCommentChange}>
                                                                </textarea>
                                                                <form class="form-inline shareButtonFloat">
                                                                    <button class="btn btn-primary pull-right"
                                                                        value="Save" onClick={submitComment}>{translation.Send}
                                                                    </button>
                                                                </form>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                            <div class="row">
                                                <div class="commentBoxWidth">
                                                    {comments.length !== 0 && (comments.map((comment) => (
                                                        <div class="p-3 bg-white mt-2 rounded">
                                                            <div class="d-flex justify-content-between">
                                                                <div class="d-flex flex-row user">
                                                                    <div class="d-flex flex-column ml-2"><span
                                                                        class="font-weight-bold">@{comment.user.first_name + " " + comment.user.last_name}</span>{/*<span class="day">1 day ago</span>*/}
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    class="d-flex align-items-center px-3 heart ">{getDate(comment.created_at)}
                                                                    <a id={"Popover1" + comment.id} class="ml-2">
                                                                        <i href="" class="fas fa-ellipsis-h"></i>
                                                                        <Popover
                                                                            isOpen={commentId == comment.id ? true : false}
                                                                            target={"Popover1" + comment.id}
                                                                            position={'bottom'}
                                                                            toggle={(() => toggle(comment.id))}
                                                                            containerClassName={'shadow'}
                                                                            content={() => ( // you can also provide a render function that injects some useful stuff!
                                                                                <div className="popover_style">
                                                                                    <img src={closeIcon} class="img-responsive" alt="Responsive image" />
                                                                                    <strong className="poppver_text_style" htmlFor="inputEmail">Supprimer</strong>
                                                                                </div>

                                                                            )}>

                                                                            <PopoverHeader onClick={deleteComment}>{translation.Delete}</PopoverHeader>
                                                                        </Popover>
                                                                        {/* <Popover
                                                                            isOpen={commentId == comment.id ? true : false}
                                                                            position={'bottom'}
                                                                            containerClassName={'shadow'}
                                                                            content={({ position, nudgedLeft, nudgedTop }) => ( // you can also provide a render function that injects some useful stuff!
                                                                                <div className="popover_style">
                                                                                    <img src={closeIcon} class="img-responsive" alt="Responsive image" />
                                                                                    <strong className="poppver_text_style" htmlFor="inputEmail">Supprimer</strong>
                                                                                </div>

                                                                            )}
                                                                        >
                                                                    
                                                                            <div className="glyph-icon-posision"
                                                                              onClick={toggle(comment.id)}>
                                                                                <img src={glyphIvon} className="img-responsive"
                                                                                    alt="Responsive image" />
                                                                            </div>
                                                                        </Popover> */}
                                                                    </a>
                                                                </div>
                                                            </div>
                                                            <div class="comment-text text-justify mt-2 ml-2">
                                                                <p>{isFrench ? comment.comment_fr :comment.comment_en}</p>
                                                            </div>
                                                        </div>
                                                    )))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
            {viewer ? (
                <div className="fullscreen" id="fullscreen">
                    {/* <InnerImageZoom src={im1} zoomSrc="https://phpstack-338654-2008628.cloudwaysapps.com/uploads/1630594833138-100_0001_0409.JPG" /> */}
                    <TransformWrapper
                        initialScale={1}
                        initialPositionX={0}
                        initialPositionY={0}
                    >
                        {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                            <React.Fragment>
                                <div className="tools">
                                    <button onClick={() => zoomIn()}>+</button>
                                    <button onClick={() => zoomOut()}>-</button>
                                    <button onClick={() => setViewer(false)}>x</button>
                                </div>
                                <TransformComponent>
                                    <img src={Config.PhotoUrl + photo.url} alt={translation.Photo_Full_Screen} />
                                </TransformComponent>
                            </React.Fragment>
                        )}
                    </TransformWrapper>
                </div>
            ) : null}
        </div>
    )
}
export default Modal;