import React from 'react'
import { withRouter } from "react-router";
import Footer from '../../../components/layout/footer/ProducerFooter';
import Header from "../../../components/layout/main-navigation/ProducerMainNavigation"
import './index.css';
import miniclose from "../../../public/img/miniclose.svg"
import editpen from "../../../public/img/Edit.svg"
import editcopy from "../../../public/img/EditCopy.svg"
import file from "../../../public/img/file.svg"
import notepicture from "../../../public/img/notepicture.png"
import SlideBar from "../../../components/common/notes/sideNavigationproducer"
import SimpleTabs from "../../../components/producer/notes/web";
import Filterpar from "../../../components/producer/notes/mobile";
import NotePage from "../../../components/common/notes/note_page";
import { connect, useSelector, useDispatch } from 'react-redux';

const mapStateToProps = state => {
    let token = state.token;
    let userRole = state.userRole;
    let isLogged = state.isLogged;
    return { token, userRole, isLogged }
}

class ProducerNote extends React.Component {

    constructor(props) {
        super(props)
        const id = this.props.match.params.id;
        const acc_id = this.props.match.params.acc_id;
        const access = this.props.match.params.access;
        const key = this.props.match.params.key;
        let access_level = 0;
        if (access=="access" && key) {
            access_level = 2;
        } else if (access=="access") {
            access_level = 1;
        }
        this.state = {
            message: "",
            pageId: id,
            folderId:"",
            folderName:"",
            pageName:"",
            acc_id:acc_id,
            base_url:"/producteur",
            admin_base_url:"/admin/producteur/"+acc_id,
            entreprise_base_url:"/entreprise/producteur/"+acc_id,
            consultant_base_url:"/consultant/producteur/"+acc_id,
            access_level:access_level,
            access_key:key,
            access_level_1_url:"/consultant/access/producteur/"+acc_id,
            access_level_2_url:"/consultant/access/producteur/"+acc_id+"/"+key,
        }
    }
   
    handleCallback = (childData) =>{
        if (this.state.pageId != childData) {
            this.setState({pageId: childData})
        }
    }

    render() {
        let base_url = this.state.base_url;
        if (this.state.access_key) {
            base_url = this.state.access_level_2_url;
        } else if (!this.props.isLogged) {
            this.props.history.push('/');
        } else if (this.props.userRole=="ROLE_PRODUCTEUR") {

        } else if (this.props.userRole=="ROLE_ADMIN" && this.state.acc_id) {
            base_url = this.state.admin_base_url;
        } else if (this.props.userRole=="ROLE_ENTREPRISE" && this.state.acc_id) {
            base_url = this.state.entreprise_base_url;
        } else if (this.props.userRole=="ROLE_CONSULTANT" && this.state.acc_id) {
            if (this.state.access_level==1) {
                base_url = this.state.access_level_1_url;
            } else if (this.state.access_level==2) {
                base_url = this.state.access_level_2_url;
            } else {
                base_url = this.state.consultant_base_url;
            } 
        } else  {
            this.props.history.push('/');
        }

        return (
            <div>
                <Header base_url={base_url} acc_id={this.state.acc_id} access_level={this.state.access_level} access_key={this.state.access_key}></Header>
                <div>

                    <div>
                        <main>
                            <div className="headerBecground">

                                <div>

                                    <div class="row" id="mainDivSelect" >
                                        <div className="col-md-3 producteure-note-sidebar">
                                           <SlideBar base_url={base_url} acc_id={this.state.acc_id} parentCallback = {this.handleCallback} folderId = {this.handleCallback2} pageName = {this.handlePageName} folderName = {this.handleFolderName}
                                            access_level={this.state.access_level} access_key={this.state.access_key}/>
                                        </div>
                                     
                                        <div className="col-md-9">
                                            {this.state.pageId && (
                                                <NotePage token={this.state.token} base_url={base_url} acc_id={this.state.acc_id} type = "PRODUCTEUR" pageId= {this.state.pageId}
                                                access_level={this.state.access_level} access_key={this.state.access_key}></NotePage>
                                            )}
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

export default connect(mapStateToProps, null)(ProducerNote);