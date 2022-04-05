import 'bootstrap/dist/css/bootstrap.css';
import React from 'react'
import '../../../components/settingsMain.css'
import FormMobile from './ConsultantsFormMobile'
import Close from "../../../public/img/Close.svg";

class MyTablePopup extends React.Component {
    constructor() {
        super()
    }

    render() {
        return (
            <div class="modal fade" id="modelExample" tabindex="-1" role="dialog"
                 aria-labelledby="exampleModalLongTitle" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <button className="btn btn-outline-light text-right" data-dismiss="modal" aria-label="Close">
                            {<img src={Close}/>}
                        </button>
                        {/*<button type="button" className="close" data-dismiss="modal" aria-label="Close">*/}
                        {/*    <span aria-hidden="true">&times;</span>*/}
                        {/*</button>*/}
                        <div class="modal-body" style={{
                            paddingTop: '0px',
                            paddingLeft: '22px',
                            paddingRight: '22px',
                        }}>

                            <FormMobile></FormMobile>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

export default MyTablePopup;