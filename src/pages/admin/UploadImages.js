import '../../components/producer/settings/settingsMain.css'
import React from 'react';
import "react-datepicker/dist/react-datepicker.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from "../../components/layout/main-navigation/AdminMainNavigation";
import Footer from "../../components/layout/footer/AdminFooter"
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
        this.state = {
            popoverOpen: false,
            setPopoverOpen: false,
        }
    }

    render() {
        if (!this.props.isLogged) {
            this.props.history.push('/');
        } else if (this.props.userRole != "ROLE_ADMIN") {
            this.props.history.push('/');
        }

        return (
            <div>
                <NavBar></NavBar>
                <div>
                    <CommonPhotoPage type="admin"> </CommonPhotoPage>
                    </div>
                <Footer />
            </div>
        )
    }
}

export default connect(mapStateToProps, null)(UploadImages);