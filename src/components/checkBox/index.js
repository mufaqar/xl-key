import 'bootstrap/dist/css/bootstrap.css';
import React, { useState } from 'react';
import './index.css'
function CheckBox(props){
    return (
        <div class="checkbox">
            <label style={{fontSize: "15px"}}>
                <input type="checkbox" value="" />
                <span class="cr"><i class="cr-icon glyphicon glyphicon-ok"></i></span>
                {props.name}
            </label>
        </div>
    )
}
export default CheckBox;

