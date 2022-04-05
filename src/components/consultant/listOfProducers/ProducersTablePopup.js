import 'bootstrap/dist/css/bootstrap.css';
import React from 'react'
import '../../../components/producer/settings/settingsMain.css'
import FormMobile from './ProducersFormMobile'
import Close from "../../../public/img/Close.svg";

class MyTablePopup extends React.Component {
    constructor() {
        super()
    }

    render() {
        return (
            <div class="modal fade onlyForMobile" id={"modelExample" + this.props.value.id} tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <button className="btn btn-outline-light text-right" data-dismiss="modal" aria-label="Close">
                            {<img src={Close}/>}
                        </button>
                   
                        <div class="modal-body" style={{
                            paddingTop: '0px',
                            paddingLeft: '22px',
                            paddingRight: '22px',
                        }}>

                        <FormMobile  value={this.props.value} acc_id={this.props.acc_id} ></FormMobile>

                        </div>

                    </div>
                </div>
            </div>


        )
    }
}

export default MyTablePopup;