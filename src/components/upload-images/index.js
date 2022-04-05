import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import './index.css'
import { Popover, PopoverBody, PopoverHeader } from 'reactstrap';
import { connect, useSelector, useDispatch } from 'react-redux';
import PhotoApi from "../../helper/photo-api";
import ImageUploading from "react-images-uploading";
import CommonPhotoPage from "../common/photos/upload_images";

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
            popoverOpen: false,
            setPopoverOpen: false,
            loading: false,
            isLoaded: false,
            error: null,
            errors: {},
            categories: [],
            sites: [],
            tagCategories: [],
            fields: [],
            images: [],
            isChecked: true,
            categoryId: false,
            statusEdit: false,
            checkboxCategories: []
        }
    }

    render() {
        const maxNumber = 10;
        const onChange = (imageList, addUpdateIndex) => {
            this.setState({
                images: imageList,
            });
        };

        const { error, isLoaded, checkboxCategories, sites, tagCategories, fields, images } = this.state;

        return (
            <div id="largeModal" class="modal fade" tabindex="-1" role="dialog">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true" style={{ position: "absolute", top: "15px", right: "15px", zIndex: 99 }}>&times;</button>
                        <CommonPhotoPage type="producture" popup="yes" acc_id={this.props.acc_id} access_key={this.props.access_key} access_level={this.props.access_level}
                        > </CommonPhotoPage>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, null)(Modal);