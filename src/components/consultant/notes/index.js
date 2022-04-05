import {Tab, TabList, TabPanel, Tabs} from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import fuicon from "../../../public/img/fileuploadicon.png";
import fuclose from "../../../public/img/fileuploadclose.png";
import Notes from "../../../public/img/NotesModel.svg";
import Notespredifine from "../../../public/img/NotesCopy.svg";

export default () => (
  <Tabs>
    <div className="desktophidden">
    <TabList>
      <Tab><img src={Notes}/>Notes</Tab>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      {/* <Tab><img src={Notespredifine}/>Notes prédéfini</Tab> */}
    </TabList>
    </div>

    <div className="mobilehidden">
    <TabList>
      <Tab><img src={Notes}/>Notes</Tab>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      {/* <Tab><img src={Notespredifine}/>Notes prédéfini</Tab> */}
    </TabList>
    </div>

    <TabPanel>
      <h6 className="producteure-note-popup-font-colour">Titre</h6>
      <input type="email" id="username" className="form-control" name='username'  required />
      <br />
      <h6 className="producteure-note-popup-font-colour">Ajouter un titre à la note</h6>

      <div className="form-label-group mb-2">
        <textarea className="form-control update-fonts" rows="4" cols="50"
          >
        </textarea>
      </div>
      <br />
      <div className="producteure-note-popup-font-colour">Ajouter un fichier <button className="producteure-note-button2">Télécharger</button>     </div>

      <br />

      <div class="setting-information-general-jpg-box" role="alert">
        <div class="d-flex" >

          <div class="form-group-right" >
            <img src={fuicon} alt="workimg" />
          </div>
          <label htmlFor="inputEmail" style={{ marginTop: '15px', color: '#0178D4' }}>IMG-10212-1284.jpg</label>
          <div class="ml-auto" >
            <img src={fuclose} class="img-responsive align-me" alt="workimg" />
          </div>
        </div>

      </div>
      <br />
      <h6 className="producteure-note-popup-font-colour">Site</h6>

      <div class="input-group">
        <input type="text" class="form-control" aria-label="Text input with dropdown button" placeholder="Faire une selection"></input>
        <div class="input-group-append">
          <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
          <div class="dropdown-menu">
            <a class="dropdown-item" href="#">Action</a>
            <a class="dropdown-item" href="#">Another action</a>
            <a class="dropdown-item" href="#">Something else here</a>
            <div role="separator" class="dropdown-divider">

            </div>
            <a class="dropdown-item" href="#">Separated link</a>
          </div>
        </div>
      </div>
      <br />
      <h6 className="producteure-note-popup-font-colour">Tag</h6>
      <br />
      <button className="btn btn-light">
        Récolte de Janvier
      </button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <button className="btn btn-light">
        Agriculture céréale
      </button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <button className="btn btn-light">
        Biologique
      </button>
      <br />
      <button className="producteure-note-popup-button2">Ajouter un tag</button>

    </TabPanel>



    {/* <TabPanel>
      <h6 className="producteure-note-popup-font-colour">Titre</h6>
      <input type="email" id="username" className="form-control" name='username' placeholder="Ajouter un titre à la note" required />

      <br />
      <h6 className="producteure-note-popup-font-colour">Description</h6>

      <div className="form-label-group mb-2">
        <textarea className="form-control update-fonts" rows="4" cols="50"
          placeholder="Ajouter une description ">
        </textarea>
      </div>

      <br />
      <h6 className="producteure-note-popup-font-colour">Question A</h6>

      <div className="form-label-group mb-2">
        <textarea className="form-control update-fonts" rows="4" cols="50"
          placeholder="Ajouter une description ">
        </textarea>
      </div>

      <br />
      <h6 className="producteure-note-popup-font-colour">Question B</h6>

      <div className="form-label-group mb-2">
        <textarea className="form-control update-fonts" rows="4" cols="50"
          placeholder="Ajouter une description ">
        </textarea>
      </div>

      <br />
      <h6 className="producteure-note-popup-font-colour">Question C</h6>

      <div className="form-label-group mb-2">
        <textarea className="form-control update-fonts" rows="4" cols="50"
          placeholder="Ajouter une description ">
        </textarea>
      </div>
      <br />

      <div className="producteure-note-popup-font-colour">Ajouter un fichier <button className="producteure-note-button2">Télécharger</button>     </div>

      <br />
      <div class="setting-information-general-jpg-box" role="alert">
        <div class="d-flex" >

          <div class="form-group-right" >
            <img src={fuicon} alt="workimg" />
          </div>
          <label htmlFor="inputEmail" style={{ marginTop: '15px', color: '#0178D4' }}>IMG-10212-1284.jpg</label>
          <div class="ml-auto" >
            <img src={fuclose} class="img-responsive align-me" alt="workimg" />
          </div>
        </div>

      </div>

      <br />

      <h6 className="producteure-note-popup-font-colour">Site</h6>

      <div class="input-group">
        <input type="text" class="form-control" aria-label="Text input with dropdown button" placeholder="Faire une selection"></input>
        <div class="input-group-append">
          <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
          <div class="dropdown-menu">
            <a class="dropdown-item" href="#">Action</a>
            <a class="dropdown-item" href="#">Another action</a>
            <a class="dropdown-item" href="#">Something else here</a>
            <div role="separator" class="dropdown-divider">

            </div>
            <a class="dropdown-item" href="#">Separated link</a>
          </div>
        </div>
      </div>
      <br />
      <h6 className="producteure-note-popup-font-colour">Tag</h6>
      <br />
      <button className="btn btn-light">
        Récolte de Janvier
      </button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <button className="btn btn-light">
        Agriculture céréale
      </button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <button className="btn btn-light">
        Biologique
      </button>
      <br />
      <button className="producteure-note-popup-button2">Ajouter un tag</button>

    </TabPanel> */}
  </Tabs>
);