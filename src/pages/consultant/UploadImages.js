import '../../components/producer/settings/settingsMain.css'
import React from 'react';
import "react-datepicker/dist/react-datepicker.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from "../../components/layout/main-navigation/ConsultantMainNavigation";
import Footer from "../../components/layout/footer/ConsultantFooter"
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
            base_url:"/consultant",
            admin_base_url:"/admin/consultant/"+acc_id,
            entreprise_base_url:"/entreprise/consultant/"+acc_id,
            consultant_base_url:"/consultant/consultant/"+acc_id,
        }
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
                <NavBar base_url={base_url} acc_id={this.state.acc_id}></NavBar>
                <div>
                    <CommonPhotoPage type="consultant" acc_id={this.state.acc_id}> </CommonPhotoPage>
                    </div>
                <Footer />
            </div>
        )
    }
}

export default connect(mapStateToProps, null)(UploadImages);