import React from 'react'
import Footer from '../../../components/layout/footer/ConsultantFooter.js';
import Header from "../../../components/layout/main-navigation/ConsultantMainNavigation"
import miniclose from "../../../public/img/miniclose.svg"
import editpen from "../../../public/img/Edit.svg"
import editcopy from "../../../public/img/EditCopy.svg"
import file from "../../../public/img/file.svg"
import notepicture from "../../../public/img/notepicture.png"
import SlideBar from "../../../components/common/notes/sideNavigtionconsultant"
import SimpleTabs from "../../../components/consultant/notes";
import Filterpar from "../../../components/consultant/notes/MobilePopup.js";
import NotePage from "../../../components/common/notes/note_page";
import { connect, useSelector, useDispatch } from 'react-redux';

const mapStateToProps = state => {
    let token = state.token;
    let userRole = state.userRole;
    let isLogged = state.isLogged;
    return {token, userRole, isLogged}
}

class ConsultantNote extends React.Component {

    constructor(props) {
        super(props)
        const id = this.props.match.params.id;
        const acc_id = this.props.match.params.acc_id;
        this.state = {
            message: "",
            pageId: id,
            folderId:"",
            folderName: "",
            pageName: "",
            acc_id:acc_id,
            base_url:"/consultant",
            admin_base_url:"/admin/consultant/"+acc_id,
            entreprise_base_url:"/entreprise/consultant/"+acc_id,
            consultant_base_url:"/consultant/consultant/"+acc_id,
        }
    }

   
    handleCallback = (childData) =>{
        console.log("childData",childData)
        this.setState({pageId: childData})
    }

    handleCallback2 = (childData) =>{
        console.log("childData folderId",childData)
        this.setState({folderId: childData})
    }

    handlePageName = (childData) =>{
        console.log("childData folderId",childData)
        this.setState({pageName: childData})
    }

    handleFolderName = (childData) =>{
        console.log("childData folderId",childData)
        this.setState({folderName: childData})
    }

    
    render() {
        let base_url = this.state.base_url;
        if (!this.props.isLogged) {
            this.props.history.push('/');
        } else if (this.props.userRole=="ROLE_CONSULTANT") {

        } else if (this.props.userRole=="ROLE_ADMIN" && this.state.acc_id) {
            base_url = this.state.admin_base_url;
        } else if (this.props.userRole=="ROLE_ENTREPRISE" && this.state.acc_id) {
            base_url = this.state.entreprise_base_url;
        } else  {
            this.props.history.push('/');
        }

        return (

            <div>
                <Header base_url={base_url} acc_id={this.state.acc_id}></Header>
                <div>

                    <div>
                        <main>
                            <div className="headerBecground">

                                <div>

                                    <div class="row" id="mainDivSelect" >
                                        <div className="col-md-3 producteure-note-sidebar">
                                        <SlideBar base_url={base_url} acc_id={this.state.acc_id} parentCallback = {this.handleCallback} folderId = {this.handleCallback2} pageName = {this.handlePageName} folderName = {this.handleFolderName}/>
                                    
                                 
                                        </div>

                                        <div className="col-md-9">
                                        
                                         <NotePage base_url={base_url} acc_id={this.state.acc_id} type = "CONSULTANT" pageId= {this.state.pageId} folderId ={this.state.folderId} pageName={this.state.pageName} folderName = {this.state.folderName}></NotePage>
                                           

                                        </div>

                                    </div>

                                </div>


                            </div>



                        </main>

                        <Footer></Footer>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, null)(ConsultantNote);