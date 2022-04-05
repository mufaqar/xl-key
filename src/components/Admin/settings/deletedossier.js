import 'bootstrap/dist/css/bootstrap.css';
import './index.css'
import Api from "../../../helper//notes-api";
import React from 'react';
import {connect} from 'react-redux';
import useTranslation from "../../customHooks/translations";

const mapStateToProps = state => {
    let token = state.token;
    let userRole = state.userRole;
    let isLogged = state.isLogged;
    return { token, userRole, isLogged }
}

function withLanguageHook(Component) {
    return function WrappedComponent(props) {
        const translation = useTranslation();
        return <Component {...props} translation={translation}/>;
    }
}

class Modal extends React.Component {

    constructor(props) {

        super(props)
        console.log("type***", this.props.type);
        this.state = {
            dataId: this.props.dataId,
            api: new Api(this.props.token),
            type: this.props.type,
            message: null
        }
    }

    deleteUser = () => {


        this.state.api
            .deleteFolder(this.state.dataId)
            .then(response => {
                console.log("data  new delete** ", response);
                this.setState({ message: response.data.message });
                setTimeout(window.location.reload(false),500);
            })
            
            .catch(err => {
                console.log(err);
            });


    }

    handleInputChage(e) {
        this.setState({
            [e.target.id]: e.target.value,
        })
    }

    render() {
        const translation = this.props.translation;
        return (
            <div>
            <div class="modal fade" id={this.props.id} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document" style={{ maxWidth: '100%' }}>
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">{translation.Do_you_want_to_delete_this_item}</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary" onClick={this.deleteUser} style={{ width: '40%' }}>{translation.Yes}</button>
                            <button type="button" class="btn btn-secondary" data-dismiss="modal" style={{ width: '40%' }} >{translation.Close}</button>
                            <br />
                            <label class="error-font-style" >{this.state.message}</label>
                        </div>
                    </div>
                </div>
            </div>
            </div>);
    }

}

export default connect(mapStateToProps, null)(withLanguageHook(Modal));