import React from "react";
import './PageLoader.css';
import logoImage from "../xlkey-icon.png";

class PageLoader extends React.Component {
    render() {
        return (
            <div className="page_loader_wrapper">
                <section class="page_loader">
                    <div class="loaderLogoImage">
                        <img src={logoImage} style={{width: "50px", height: "50px"}} />
                    </div>
                    <div class="loader loader-6">
                        <div class="loader-inner">
                            {/* <img src={logoImage} style={{width: "50px", height: "50px"}} /> */}
                        </div>
                    </div>
                    {/* <div class="loader loader-20">
                        <div class="css-diamond"></div>
                    </div> */}
                </section>
            </div>
        )
    }
}
export default PageLoader;