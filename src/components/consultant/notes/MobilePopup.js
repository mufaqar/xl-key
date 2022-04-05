import '../../settingsMain.css'
import 'bootstrap/dist/css/bootstrap.css';
import "../../App.scss";
import cx from "classnames";
import Collapse from "@kunukn/react-collapse";
import React from "react";

class MobilePopup extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            // isHidden: true,
            isHidden: false
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

    state = {
        isOpen1: false,
        isOpen2: false,
        isOpen3: false,
        isOpen4: false,
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

    render() {
        const {isHidden} = this.state
        return (
            <div className={isHidden ? "sb-nav-fixed" : "sb-nav-fixed sb-sidenav-toggled"}>
             
                <div id="mainDivSelect">

                    <div id="layoutSidenav_content" class="settings_content">
                        <main>
                            <div> {/*class="container-fluid" */}
            
                                    <div className="producture-note-mobile-popup-backgroundcolour">
                                        <div > {/*class="card my-cart" */}
                                            <div> {/*className="col-md-11 col-lg-11 mx-auto" */}
                                                
                                                 <button
                                                    className={cx("app__toggle producture-note-mobile-popup-backgroundcolour", {
                                                        "app__toggle--active": this.state.isOpen1
                                                    })}
                                                    onClick={() => this.toggle(1)}
                                                >
                                                    

                                                    <span className="app__toggle-text" style={{fontWeight: 'bold'}}>Année&nbsp;(1)</span>
                                                    <div className="rotate90 producture-note-mobile-popup-wordaligment">
                                                        <svg
                                                            className={cx("icon", {"icon--expanded": this.state.isOpen1})}
                                                            viewBox="6 0 12 24"
                                                        >
                                                            <polygon points="8 0 6 1.8 14.4 12 6 22.2 8 24 18 12"/>
                                                        </svg>
                                                    </div>
                                                  
                                                
                                                </button>
                                                
                                                <Collapse
                                                    isOpen={this.state.isOpen1}
                                                    className={
                                                        "producture-note-mobile-popup-backgroundcolour" +                   //app__collapse app__collapse--gradient 
                                                        (this.state.isOpen1 ? "app__collapse--active" : "")
                                                        + "collaps_bg"}
                                                >
                                                      <input className="producture-note-mobile-popup-wordaligment2" type="checkbox" id="vehicle1" name="vehicle1" value="Bike"/>&nbsp;&nbsp;
                                                      <label for="vehicle1"> 2019</label>
                                                      <label className="producture-note-mobile-popup-numberaligment" for="vehicle1"> 03</label><br/>
                                                      <input className="producture-note-mobile-popup-wordaligment2" type="checkbox" id="vehicle1" name="vehicle1" value="Bike"/>&nbsp;&nbsp;
                                                      <label for="vehicle1"> 2020</label>
                                                      <label className="producture-note-mobile-popup-numberaligment" for="vehicle1"> 53</label><br/>
                                                      <input className="producture-note-mobile-popup-wordaligment2" type="checkbox" id="vehicle1" name="vehicle1" value="Bike"/>&nbsp;&nbsp;
                                                      <label for="vehicle1"> 2021</label>
                                                      <label className="producture-note-mobile-popup-numberaligment" for="vehicle1"> 16</label><br/>
                                                      <input className="producture-note-mobile-popup-wordaligment2" type="checkbox" id="vehicle1" name="vehicle1" value="Bike"/>&nbsp;&nbsp;
                                                      <label for="vehicle1"> Toutes</label>
                                                      <label className="producture-note-mobile-popup-numberaligment2" for="vehicle1"> 45</label>
                                                    
                                                </Collapse>


                                                

                                                <button
                                                    className={cx("app__toggle producture-note-mobile-popup-backgroundcolour", {
                                                        "app__toggle--active": this.state.isOpen2
                                                    })}
                                                    onClick={() => this.toggle(2)}
                                                >
                                                    

                                                    <span className="app__toggle-text" style={{fontWeight: 'bold'}}>Site</span>
                                                    <div className="rotate90 producture-note-mobile-popup-wordaligment4">
                                                        <svg
                                                            className={cx("icon", {"icon--expanded": this.state.isOpen2})}
                                                            viewBox="6 0 12 24"
                                                        >
                                                            <polygon points="8 0 6 1.8 14.4 12 6 22.2 8 24 18 12"/>
                                                        </svg>
                                                    </div>
                                                  

                                                </button>


                                                <button
                                                    className={cx("app__toggle producture-note-mobile-popup-backgroundcolour", {
                                                        "app__toggle--active": this.state.isOpen3
                                                    })}
                                                    onClick={() => this.toggle(3)}
                                                >
                                                    

                                                    <span className="app__toggle-text" style={{fontWeight: 'bold'}}>Tags&nbsp;(2)</span>
                                                    <div className="rotate90 producture-note-mobile-popup-wordaligment5">
                                                        <svg
                                                            className={cx("icon", {"icon--expanded": this.state.isOpen3})}
                                                            viewBox="6 0 12 24"
                                                        >
                                                            <polygon points="8 0 6 1.8 14.4 12 6 22.2 8 24 18 12"/>
                                                        </svg>
                                                    </div>
                                                  

                                                </button>

                                    

                                          

                                               





                                            </div>
                                            <br/>
                                        </div>
                                        <br/>
                                    </div>
                              
                            </div>
                        </main>
                    </div>
                </div>
            
            </div>
        )
    }
}

export default MobilePopup

