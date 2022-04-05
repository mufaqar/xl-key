import React from 'react';
import '../../../components/settingsMain.css'
import editIcon from "../../../public/img/edit_btn_icon.png"
import closeIcon from "../../../public/img/close_btn_icon.png"
import arrowDownIcon from "../../../public/img/icon-arrow-down.png";
import arrowUpIcon from "../../../public/img/icon-arrow-up.png";
import glyphIvon from "../../../public/img/glyphicon.png";
import {Popover} from "react-tiny-popover";
import NavBar from "../../../components/layout/main-navigation/AdminMainNavigation";
import Footer from "../../../components/layout/footer/AdminFooter";
import SlideBar from "../../../components/layout/side-navigation/AdminSideNavigation";
import Api from "../../../helper/api"
import DeletePopUp from '../../../components/Admin/settings/delete';
import CategoryPopUp from './categoryPopUp';
import { connect, useSelector, useDispatch } from 'react-redux';
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

class ConsultantCategories extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isHidden: false,
            api: new Api(this.props.token),
            consultantCategories : []
        }
        this.toggleOffer = this.toggleOffer.bind(this);
    }

    state = {
        isPopoverOpen1: false,
        isPopoverOpen2: false,
        isPopoverOpen3: false,
        isPopoverOpen4: false,
        spy3: {}
    };

    toggle = (index) => {
        let collapse = "isOpen" + index;
        this.setState((prevState) => ({[collapse]: !prevState[collapse]}));
    };


    toggleOffer() {
        this.setState({
            // isHidden: !this.state.isHidden
            isHidden: false
        })
    }

    componentDidMount() {

        console.log("data  start");


        this.state.api
            .getAllConsultantCategories()
            .then(response => {
                console.log("data consultantCategories  ", response.data);
                if (response.status === 200) {
                    this.setState({
                        isLoaded: true,
                        consultantCategories: response.data,
                       
                    });
                } else {
                    let errors = {};

                    errors["message"] = "Oops1 Try again later";
                    console.log("error ****");
                    this.setState({
                        isLoaded: true,
                        consultantCategories: [],
                        errors: errors
                    });
                }
            })

            .catch((err) => console.log(err));
    }

    deleteCategory = (id) => {
        this.state.api
        .deleteCategory(id)
        .then(response => {
          console.log("data  new delete** ", response);
          this.setState({ message: response.data.message });
        })
        .catch(err => {
            console.log(err);
        });
      
      }

    render() {
        const {consultantCategories} = this.state;

        if(!this.props.isLogged){
            this.props.history.push('/');
        }else if (this.props.userRole!="ROLE_ADMIN") {
            this.props.history.push('/');
        }
        const {isHidden} = this.state
        const translation = this.props.translation;
        return (
            <div className={isHidden ? "sb-nav-fixed" : "sb-nav-fixed sb-sidenav-toggled"}>
                <NavBar></NavBar>
                <div id="mainDivSelect">
                    <div id="layoutSidenav_content" class="settings_content">
                        <main>
                            <div class="container-fluid">
                                <div class="row">
                                    <div className="col-md-3 sidebarbackgroundcolour">
                                        <SlideBar></SlideBar>
                                    </div>
                                    <div className="col-md-9 nopadding">
                                        <div class="card my-cart mb-5">
                                            <div className="col-lg-11 col-md-11 mx-auto">
                                                <h5 className="modal-title textColor headerTop"
                                                    id="exampleModalLabel">
                                                    {translation.Management_of_consultant_categories}
                                                </h5>

                                                <div
                                                    className="row alert alert-secondary alert-margin mb-3 ml-0 mr-0 align-center btn-right-pad"
                                                    role="alert">
                                                    <div className="col-7">
                                                        <div className="row">
                                                            <label className="mt-1 mb-1 ml-2">Consultante / Consultant</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-5 align-center pl-0 pr-0">
                                                        <div className="text-right">
                                                            <button type="button"
                                                                    data-target="#addAccount"
                                                                    data-toggle="modal"
                                                                    className="btn btn-primary ml-auto">
                                                                {translation.Add}
                                                            </button>
                                                        </div>
                                                        <CategoryPopUp id={"addAccount"}  data = {{}} type={"create"}></CategoryPopUp>
                                                    </div>
                                                </div>
                                                {consultantCategories.map((item) => (
                                                <div className="row border mb-3 ml-0 mr-0">
                                                    <div className="col-7">
                                                        <div className="row">
                                                            <label className="ml-4 mt-2 mb-3">{item.name_fr} /
                                                            {item.name_en}</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-5 align-center pl-0 pr-0">
                                                        <div className="text-right">
                                                            <div>
                                                                {/* <img src={arrowDownIcon}
                                                                     className="img-responsive image d-none d-sm-inline-block mt-0 mb-0"
                                                                     alt="Responsive "/>
                                                                <img src={arrowUpIcon}
                                                                     className="img-responsive image d-none d-sm-inline-block mt-0 mb-0"
                                                                     alt="Responsive "/> */}

                                                              <img src={editIcon}
                                                                    className="img-responsive image d-none d-sm-inline-block mt-0 mb-0"
                                                                    alt="Responsive image"
                                                                    data-toggle="modal" 
                                                                    data-target={"#modal" +item.id}/>

                                                                <img src={closeIcon}
                                                                     className="img-responsive image d-none d-sm-inline-block mt-0 mb-0"
                                                                     alt="Responsive "
                                                                     data-toggle="modal" 
                                                                     data-target={"#exampleModaldelete" +item.id}/>

                                                                  <DeletePopUp id ={"exampleModaldelete"+item.id} dataId= {item.id} type = {"category"} ></DeletePopUp>

                                                                       
                                                                <div>
                                                                    <Popover
                                                                        isOpen={this.state.isPopoverOpen1}
                                                                        position={'bottom'}
                                                                        containerClassName="shadow, pop-style-cat"
                                                                        content={({position, nudgedLeft, nudgedTop}) => ( // you can also provide a render function that injects some useful stuff!
                                                                            <div className="pop-main col-12 pt-2 pb-1">
                                                                                <div className="row">
                                                                                <img src={editIcon}
                                                                                          className="img-responsive image mt-0"
                                                                                          alt="Responsive image"
                                                                                        data-toggle="modal" 
                                                                                        data-target={"#modal" +item.id}/>
                                                                                   
                                                                                    <label className="">{translation.Edit}</label>
                                                                                         </div>
                                                                                <div className="row">
                                                                                    <img src={closeIcon}
                                                                                         className="img-responsive image mt-0"
                                                                                         alt="Responsive image"
                                                                                         data-toggle="modal" 
                                                                                         data-target={"#exampleModaldelete" +item.id}/>
                                                                                    <label
                                                                                        className="">{translation.Delete}</label>

                                                                                       <DeletePopUp id ={"exampleModaldelete"+item.id} dataId= {item.id} type = {"category"} ></DeletePopUp>

                                                                                </div>
                                                                            </div>
                                                                           
                                                                             
                                                                        )}
                                                                    >
                                                                        <img src={glyphIvon}
                                                                             className="img-responsive image d-inline-block d-sm-none mt-0 mb-0 mr-4"
                                                                             onClick={() => this.setState({
                                                                                 isPopoverOpen1: !this.state.isPopoverOpen1,
                                                                                 isPopoverOpen2: false,
                                                                                 isPopoverOpen3: false,
                                                                                 isPopoverOpen4: false,
                                                                             })}
                                                                             alt="Responsive "/>
                                                                            
                                                                           
                                                                    </Popover>
                                                                </div>

                                                                <CategoryPopUp id ={"modal"+item.id} data= {item} type={"update"}></CategoryPopUp>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                ))}
                                             </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Footer></Footer>
                        </main>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, null)(withLanguageHook(ConsultantCategories));