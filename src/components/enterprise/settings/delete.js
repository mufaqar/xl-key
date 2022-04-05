import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';
import Api from "../../../helper/api";
import React from 'react';

import { connect, useSelector, useDispatch } from 'react-redux';


const mapStateToProps = state => {
    let token = state.token;
    let userRole = state.userRole;
    let isLogged = state.isLogged;
    return { token, userRole, isLogged }
}


class Modal extends React.Component {

    constructor(props) {

        super(props)
    
        this.state = {
            dataId: this.props.dataId,
            acc_id: this.props.acc_id,
            api: new Api(this.props.token,this.props.acc_id),
            type: this.props.type,
            message : null
        }
    }

    deleteUser = () => {

      if(this.state.type == "setting"){
        this.state.api
        .deleteUser(this.state.dataId)
        .then(response => {
          console.log("data  new delete** ", response);
          this.setState({ message: response.data.message });
          window.location.reload(false);
        })
        .catch(err => {
            console.log(err);
        });
      }else {
            this.state.api
            .deleteCategory(this.state.dataId)
            .then(response => {
              console.log("data  new delete** ", response);
              this.setState({ message: response.data.message });
              window.location.reload(false);
            })
            .catch(err => {
                console.log(err);
            });
         }
      
      }

    handleInputChage(e) {
        this.setState({
            [e.target.id]: e.target.value,
        })
    }

    render() {
     
        return (
        <div class="modal fade" id={this.props.id} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document" style={{ maxWidth: '100%' }}>
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Voulez-vous supprimer cet élément</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" onClick={this.deleteUser} style={{ width: '40%' }}>Oui</button>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal" style={{ width: '40%' }} >Fermer</button>
                        <br />
                        <label class="error-font-style" >{this.state.message}</label>
                    </div>
                </div>
            </div>
        </div>);
    }

}

export default connect(mapStateToProps, null)(Modal);