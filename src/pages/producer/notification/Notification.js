import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import Header from '../../../components/layout/main-navigation/ProducerMainNavigation';
import Footer from '../../../components/layout/footer/ProducerFooter';
import SettingPop from '../../../components/SettingPopUp/setting.js'
import NotificationPage from '../../../components/common/notification/notification_page'
import { connect, useSelector, useDispatch } from 'react-redux';

const mapStateToProps = state => {
    let token = state.token;
    let userRole = state.userRole;
    let isLogged = state.isLogged;
    return {token, userRole, isLogged}
}

class Notification extends React.Component {
    constructor(props) {
        super(props)
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
        //   isHidden: true
          isHidden: false,
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
    
        this.toggleOffer = this.toggleOffer.bind(this);
      }
    
      toggleOffer() {
        this.setState({
        //   isHidden: !this.state.isHidden
        isHidden: false
        })
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
        const { isHidden } = this.state
        return (
            <div className={isHidden ? "sb-nav-fixed" : "sb-nav-fixed sb-sidenav-toggled"} >
            <Header base_url={base_url} acc_id={this.state.acc_id} access_level={this.state.access_level} access_key={this.state.access_key}></Header>
            <div>
            {/* <SlideBar></SlideBar> */}
            <div id="layoutSidenav_content">
 
                    <div>
                        <NotificationPage type="producture" acc_id={this.state.acc_id} base_url={base_url} access_level={this.state.access_level} access_key={this.state.access_key}> </NotificationPage>
                    </div>

                    <SettingPop></SettingPop>
                    <Footer></Footer>
                    </div>
                    </div>
                    </div>
        );
    }
}

export default connect(mapStateToProps, null)(Notification);