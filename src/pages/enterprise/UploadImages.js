import '../../components/producer/settings/settingsMain.css'
import React from 'react';
import "react-datepicker/dist/react-datepicker.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from "../../components/layout/main-navigation/EnterpriseMainNavigation";
import Footer from "../../components/layout/footer/EnterpriseFooter"
import CommonPhotoPage from "../../components/common/photos/upload_images";
import { connect, useSelector, useDispatch } from 'react-redux';


const mapStateToProps = state => {
    let token = state.token;
    let userRole = state.userRole;
    let isLogged = state.isLogged;
    return { token, userRole, isLogged }
}
class UploadImages extends React.Component {

    constructor(props) {
        super(props)
        const acc_id = this.props.match.params.acc_id;
        this.state = {
            popoverOpen: false,
            setPopoverOpen: false,
            acc_id:acc_id,
            base_url:"/entreprise",
            admin_base_url:"/admin/entreprise/"+acc_id,
            entreprise_base_url:"/entreprise/entreprise/"+acc_id,
            consultant_base_url:"/consultant/entreprise/"+acc_id,
        }
    }

    render() {

        let base_url = this.state.base_url;
        if (!this.props.isLogged) {
            this.props.history.push('/');
        } else if (this.props.userRole=="ROLE_ENTREPRISE") {

        } else if (this.props.userRole=="ROLE_ADMIN" && this.state.acc_id) {
            base_url = this.state.admin_base_url;
        } else  {
            this.props.history.push('/');
        }
        
        return (
            <div>
                <NavBar base_url={base_url} acc_id={this.state.acc_id}></NavBar>
                <div>
                    <CommonPhotoPage acc_id={this.state.acc_id} base_url={base_url} type="entreprise"> </CommonPhotoPage>
                </div>
                <Footer />
            </div>
        )
    }
}

export default connect(mapStateToProps, null)(UploadImages);