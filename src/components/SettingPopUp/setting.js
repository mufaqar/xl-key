import 'bootstrap/dist/css/bootstrap.css';
import React from 'react'
import './settings.css'
import $ from 'jquery';
function Modal() {


  return (
    <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 className="modal-title textColor" id="exampleModalLabel">Ajouter/Modifier un utilisateur</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div className="row">
              <div className="col-md-9 col-lg-8 mx-auto">
                <form >
                  <div className="form-label-group">
                    <label htmlFor="inputEmail">Nom*</label>
                    <input type="email" id="username" className="form-control" name='username' required autoFocus />
                  </div>
                  <div className="form-label-group">
                    <label htmlFor="inputEmail">Prénom*</label>
                    <input type="email" id="username" className="form-control" name='username' required />
                  </div>
                  <div className="form-label-group">
                    <label htmlFor="inputEmail">Courriel*</label>
                    <input type="email" id="username" className="form-control" name='username' required />
                  </div>

                  <div className="form-label-group">
                    <label htmlFor="inputEmail">Confirmation de courriel*</label>
                    <input type="email" id="username" className="form-control" name='username' required />
                  </div>
                  <div className="form-label-group">
                    <label htmlFor="inputPassword">Mot de passe*</label>
                    <input type="password" id="password" className="form-control" placeholder="*******" name='password' required />
                  </div>
                  <div className="form-label-group">
                    <label htmlFor="inputPassword">Confirmation de mot de passe*</label>
                    <input type="password" id="password" className="form-control" placeholder="*******" name='password' required />
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Modal;