import 'bootstrap/dist/css/bootstrap.css';
import React from 'react'
import '../producer/settings/settingsMain.css'
import FormMobile from './Enterprise_FormMobile'



class MyTablePopup extends React.Component {
  constructor(props) {
    super(props)
    console.log("producerlist***qa", this.props.qa);
    console.log("producerlist***", this.props.producerlist);
    console.log("producerlist***entrepriseList", this.props.entrepriseList);
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
            
              <FormMobile value= {this.props.value} type= {this.props.type} ownCategory = {this.props.ownCategory} entrepriseList={this.props.entrepriseList} producerlist={this.props.producerlist} categoryList ={this.props.categoryList}></FormMobile>
             
            </div> 

          </div>
        </div>
      </div>
    )
  }
}
export default MyTablePopup;