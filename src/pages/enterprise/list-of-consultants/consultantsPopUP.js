import 'bootstrap/dist/css/bootstrap.css';
import React from 'react'
import '../../../components/producer/settings/settingsMain.css'
import FormMobile from './ConsultantsFormMobile'



class MyTablePopup extends React.Component {
  constructor(props) {
    super(props)
    console.log("props bnkhjiuhiouy", this.props.value);
  }

  render() {

    return (
      <div class="modal fade onlyForMobile" id={"modelExample" + this.props.value.id} tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
        <div class="modal-dialog" role="document" style={{maxWidth: '100%'}}>
          <div class="modal-content">
            <div class="modal-body">

              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            
              <FormMobile acc_id={this.props.acc_id} value= {this.props.value} type= {this.props.type}  entrepriseList={this.props.entrepriseList} categoryList ={this.props.categoryList}></FormMobile>
             
            </div> 

          </div>
        </div>
      </div>
    )
  }
}
export default MyTablePopup;