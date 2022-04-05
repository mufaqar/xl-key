import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import allReducer from './reducers';
import { Provider } from 'react-redux';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' 
import sessionStorage from 'redux-persist/lib/storage/session'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { PersistGate } from 'redux-persist/integration/react';
import './index.css';
import Login from './components/login/Login';
import AdminClientsOrProducers from './pages/admin/ClientsOrProducers';
import AdminEnterprise from './pages/admin/Enterprise';
import AdminConsultants from './pages/admin/Consultants';
import AdminUploadImages from './pages/admin/UploadImages';
import AdminDashboard from './pages/admin/Dashboard';
import AdminSettingsConnectionSending from './pages/admin/settings/ConnectionSending';
import AdminSettingsCategory from './pages/admin/settings/Category';
import AdminSettingsTagsPhotos from './pages/admin/settings/TagsPhotos';
import AdminSettingsServices from "./pages/admin/settings/Services";
import AdminSettingsDossierdeNotes from "./pages/admin/settings/DossierdeNotes";
import AdminSettingsTagsNotes from './pages/admin/settings/TagsNotes';
import AdminSettingsConsultantCategories from "./pages/admin/settings/ConsultantCategories";
import ProducteurSettingsSettingsInformationGeneral from './pages/producer/settings/SettingsInformationGeneral';
import ProducteurSettingsSettingsConnectionSending from './pages/producer/settings/SettingsConnectionSending';
import ProducteurSettingsSettingsSiteAndCategories from './pages/producer/settings/SettingsSiteAndCategories';
import ProducteurSettingsSettingsPlanDeFerme from './pages/producer/settings/SettingsPlanDeFerme';
import ProducteurSettingsSettingsSubscriptionsInvoices from './pages/producer/settings/SettingsSubscriptionsInvoices';
import ProducteurSettingsSettingsAccessInvitations from './pages/producer/settings/SettingsAccessInvitations';
import ProducteurSettingsSettingsFileName from './pages/producer/settings/SettingsFileName';
import "./components/App.scss";
import ConsultantSettingsSettingsConnectionSending from './pages/consultant/settings/SettingsConnectionSending';
import EnterpriseSettingsSettingsConnectionSending from './pages/enterprise/settings/InformationConnection';
import ProducteurSettingsSettingsTagsNotes from './pages/producer/settings/SettingsTagsNotes';
import ConsultantSettingsSettingsTagsNotes from './pages/consultant/settings/SettingsTagsNotes';
import ProducteurSettingsSettingsTagsPhotos from './pages/producer/settings/SettingsTagsPhotos';
import home from './pages/producer/photos/Photos';
import NotFound from './pages/404';
import reportWebVitals from './reportWebVitals';
import Notification from './pages/producer/notification/Notification'
import services from './pages/producer/services/Services';
import producteuredashboard from './pages/producer/dashboard/Dashboard';
import consultantdashboard from './pages/consultant/dashboard/Dashboard';
import entreprisedashboard from './pages/enterprise/dashboard/Dashboard';
import consultantnotification from './pages/consultant/notification/Notification';
import producteurenote from './pages/producer/note/Notes';
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom"
import AccessInvitations from "./pages/consultant/settings/AccessInvitation";
import entreprisesettingservice from './pages/enterprise/settings/Services';
import EntreprisesettingsInfo from './pages/enterprise/settings/InformationGeneral';
import ListOfProducers from "./pages/enterprise/list-of-producers/ListOfProducers";
import ConsultantListOfProducers from "./pages/consultant/list-of-producers/ListOfProducers";
import ConsultantUploadImages from './pages/consultant/UploadImages';
import EntrepriseUploadImages from './pages/enterprise/UploadImages';
import ListOfConsultants from "./pages/enterprise/list-of-consultants/ListOfConsultants";
import ConsultantInformationGeneral from "./pages/consultant/settings/InformationGeneral";
import Consultantenote from "./pages/consultant/note/Notes";
import forgetpassword from "./components/login/forgetpassword";
import LanguageContextProvider from "./components/contexts/LanguageContext";


require('dotenv').config()

// redux store
/* const store = createStore(
  allReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
); */

const persistConfig = {
  key: 'root',
  storage: storage,
}
const persistedReducer = persistReducer(persistConfig, allReducer)

let store = createStore(persistedReducer)
let persistor = persistStore(store)

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
       <LanguageContextProvider>
          <Router>
            <Switch>
              <Route exact path='/' component={Login}/>
              <Route exact path='/404' component={NotFound}/>

              <Route exact path='/admin/dashboard' component={AdminDashboard}/>
              <Route exact path='/admin/producteurs' component={AdminClientsOrProducers}/>
              <Route exact path='/admin/consultants' component={AdminConsultants}/>
              <Route exact path='/admin/entreprise' component={AdminEnterprise}/>
              <Route exact path="/admin/upload-d-images" component={AdminUploadImages}/>
              <Route exact path='/admin/settings/information-de-connexion' component={AdminSettingsConnectionSending}/>
              <Route exact path='/admin/settings/categories' component={AdminSettingsCategory}/>
              <Route exact path='/admin/settings/tags-photos' component={AdminSettingsTagsPhotos}/>
              <Route exact path='/admin/settings/tags-notes' component={AdminSettingsTagsNotes}/>
              <Route exact path='/admin/settings/categories-de-consultant'
                     component={AdminSettingsConsultantCategories}/>
              <Route exact path='/admin/settings/services' component={AdminSettingsServices}/>
              <Route exact path='/admin/settings/dossier-de-notes' component={AdminSettingsDossierdeNotes}/>

              <Route exact path='/entreprise/dashboard' component={entreprisedashboard}/>
              <Route exact path='/entreprise/listes-des-producteurs' component={ListOfProducers}/>
              <Route exact path='/entreprise/listes-des-consultants' component={ListOfConsultants}/>
              <Route exact path="/entreprise/upload-d-images" component={EntrepriseUploadImages}/>
              <Route exact path='/entreprise/settings/information-general' component={EntreprisesettingsInfo}/>
              <Route exact path='/entreprise/settings/information-de-connexion'
                     component={EnterpriseSettingsSettingsConnectionSending}/>
              <Route exact path='/entreprise/settings/services' component={entreprisesettingservice}/>

              <Route exact path='/consultant/dashboard' component={consultantdashboard}/>
              <Route exact path='/consultant/liste-des-producteurs' component={ConsultantListOfProducers}/>
              <Route exact path="/consultant/notes" component={Consultantenote}/>
              <Route exact path='/consultant/notes/page/:id/' component={Consultantenote}/>
              <Route exact path="/consultant/upload-d-images" component={ConsultantUploadImages}/>
              <Route exact path='/consultant/settings/information-general' component={ConsultantInformationGeneral}/>
              <Route exact path='/consultant/settings/information-de-connexion'
                     component={ConsultantSettingsSettingsConnectionSending}/>
              <Route exact path='/consultant/settings/tags-notes' component={ConsultantSettingsSettingsTagsNotes}/>
              <Route exact path='/consultant/settings/acces-and-invitation' component={AccessInvitations}/>
              <Route exact path='/consultant/notifications' component={consultantnotification}/>

              <Route exact path='/producteur/dashboard' component={producteuredashboard}/>
              <Route exact path='/producteur/photos' component={home}/>
              <Route exact path='/producteur/photos/open/:id/' component={home}/>
              <Route exact path='/producteur/notes' component={producteurenote}/>
              <Route exact path='/producteur/notes/page/:id/' component={producteurenote}/>
              {/*<Route exact path='/producteur/notes/page/:id/:image_url' component={producteurenote}/>*/}
              <Route exact path='/producteur/services' component={services}/>
              <Route exact path='/producteur/settings/information-general'
                     component={ProducteurSettingsSettingsInformationGeneral}/>
              <Route exact path="/producteur/settings/information-de-connexion-et-d-envoi"
                     component={ProducteurSettingsSettingsConnectionSending}/>
              <Route exact path='/producteur/settings/site-and-categories'
                     component={ProducteurSettingsSettingsSiteAndCategories}/>
              <Route exact path='/producteur/settings/tags-photos' component={ProducteurSettingsSettingsTagsPhotos}/>
              <Route exact path='/producteur/settings/nom-des-champs' component={ProducteurSettingsSettingsFileName}/>
              <Route exact path='/producteur/settings/tags-notes' component={ProducteurSettingsSettingsTagsNotes}/>
              <Route exact path='/producteur/settings/acces-and-invitations'
                     component={ProducteurSettingsSettingsAccessInvitations}/>
              <Route exact path='/producteur/settings/plan-de-ferme' component={ProducteurSettingsSettingsPlanDeFerme}/>
              <Route exact path='/producteur/settings/abonnement-et-facture'
                     component={ProducteurSettingsSettingsSubscriptionsInvoices}/>
              <Route exact path='/producteur/notifications' component={Notification}/>

              <Route exact path='/login/forgetpassword' component={forgetpassword}/>

              {/* Impersonate feature of producteur for admin */}
              <Route exact path='/admin/producteur/:acc_id/dashboard' component={producteuredashboard}/>
              <Route exact path='/admin/producteur/:acc_id/photos' component={home}/>
              <Route exact path='/admin/producteur/:acc_id/photos/open/:id/' component={home}/>
              <Route exact path='/admin/producteur/:acc_id/notes/page/:id/' component={producteurenote}/>
              <Route exact path='/admin/producteur/:acc_id/notes' component={producteurenote}/>
              <Route exact path='/admin/producteur/:acc_id/services' component={services}/>
              <Route exact path='/admin/producteur/:acc_id/settings/information-general'
                     component={ProducteurSettingsSettingsInformationGeneral}/>
              <Route exact path="/admin/producteur/:acc_id/settings/information-de-connexion-et-d-envoi"
                     component={ProducteurSettingsSettingsConnectionSending}/>
              <Route exact path='/admin/producteur/:acc_id/settings/site-and-categories'
                     component={ProducteurSettingsSettingsSiteAndCategories}/>
              <Route exact path='/admin/producteur/:acc_id/settings/tags-photos'
                     component={ProducteurSettingsSettingsTagsPhotos}/>
              <Route exact path='/admin/producteur/:acc_id/settings/nom-des-champs'
                     component={ProducteurSettingsSettingsFileName}/>
              <Route exact path='/admin/producteur/:acc_id/settings/tags-notes'
                     component={ProducteurSettingsSettingsTagsNotes}/>
              <Route exact path='/admin/producteur/:acc_id/settings/acces-and-invitations'
                     component={ProducteurSettingsSettingsAccessInvitations}/>
              <Route exact path='/admin/producteur/:acc_id/settings/plan-de-ferme'
                     component={ProducteurSettingsSettingsPlanDeFerme}/>
              <Route exact path='/admin/producteur/:acc_id/settings/abonnement-et-facture'
                     component={ProducteurSettingsSettingsSubscriptionsInvoices}/>
              <Route exact path='/admin/producteur/:acc_id/notifications' component={Notification}/>

              {/* Impersonate feature of producteur for entreprise */}
              <Route exact path='/entreprise/producteur/:acc_id/dashboard' component={producteuredashboard}/>
              <Route exact path='/entreprise/producteur/:acc_id/photos' component={home}/>
              <Route exact path='/entreprise/producteur/:acc_id/photos/open/:id/' component={home}/>
              <Route exact path='/entreprise/producteur/:acc_id/notes/page/:id/' component={producteurenote}/>
              <Route exact path='/entreprise/producteur/:acc_id/notes' component={producteurenote}/>
              <Route exact path='/entreprise/producteur/:acc_id/services' component={services}/>
              <Route exact path='/entreprise/producteur/:acc_id/settings/information-general'
                     component={ProducteurSettingsSettingsInformationGeneral}/>
              <Route exact path="/entreprise/producteur/:acc_id/settings/information-de-connexion-et-d-envoi"
                     component={ProducteurSettingsSettingsConnectionSending}/>
              <Route exact path='/entreprise/producteur/:acc_id/settings/site-and-categories'
                     component={ProducteurSettingsSettingsSiteAndCategories}/>
              <Route exact path='/entreprise/producteur/:acc_id/settings/tags-photos'
                     component={ProducteurSettingsSettingsTagsPhotos}/>
              <Route exact path='/entreprise/producteur/:acc_id/settings/nom-des-champs'
                     component={ProducteurSettingsSettingsFileName}/>
              <Route exact path='/entreprise/producteur/:acc_id/settings/tags-notes'
                     component={ProducteurSettingsSettingsTagsNotes}/>
              <Route exact path='/entreprise/producteur/:acc_id/settings/acces-and-invitations'
                     component={ProducteurSettingsSettingsAccessInvitations}/>
              <Route exact path='/entreprise/producteur/:acc_id/settings/plan-de-ferme'
                     component={ProducteurSettingsSettingsPlanDeFerme}/>
              <Route exact path='/entreprise/producteur/:acc_id/settings/abonnement-et-facture'
                     component={ProducteurSettingsSettingsSubscriptionsInvoices}/>
              <Route exact path='/entreprise/producteur/:acc_id/notifications' component={Notification}/>

              {/* Impersonate feature of producteur for consultant */}
              <Route exact path='/consultant/producteur/:acc_id/dashboard' component={producteuredashboard}/>
              <Route exact path='/consultant/producteur/:acc_id/photos' component={home}/>
              <Route exact path='/consultant/producteur/:acc_id/photos/open/:id/' component={home}/>
              <Route exact path='/consultant/producteur/:acc_id/notes/page/:id/' component={producteurenote}/>
              <Route exact path='/consultant/producteur/:acc_id/notes' component={producteurenote}/>
              <Route exact path='/consultant/producteur/:acc_id/services' component={services}/>
              <Route exact path='/consultant/producteur/:acc_id/settings/information-general'
                     component={ProducteurSettingsSettingsInformationGeneral}/>
              <Route exact path="/consultant/producteur/:acc_id/settings/information-de-connexion-et-d-envoi"
                     component={ProducteurSettingsSettingsConnectionSending}/>
              <Route exact path='/consultant/producteur/:acc_id/settings/site-and-categories'
                     component={ProducteurSettingsSettingsSiteAndCategories}/>
              <Route exact path='/consultant/producteur/:acc_id/settings/tags-photos'
                     component={ProducteurSettingsSettingsTagsPhotos}/>
              <Route exact path='/consultant/producteur/:acc_id/settings/nom-des-champs'
                     component={ProducteurSettingsSettingsFileName}/>
              <Route exact path='/consultant/producteur/:acc_id/settings/tags-notes'
                     component={ProducteurSettingsSettingsTagsNotes}/>
              <Route exact path='/consultant/producteur/:acc_id/settings/acces-and-invitations'
                     component={ProducteurSettingsSettingsAccessInvitations}/>
              <Route exact path='/consultant/producteur/:acc_id/settings/plan-de-ferme'
                     component={ProducteurSettingsSettingsPlanDeFerme}/>
              <Route exact path='/consultant/producteur/:acc_id/settings/abonnement-et-facture'
                     component={ProducteurSettingsSettingsSubscriptionsInvoices}/>
              <Route exact path='/consultant/producteur/:acc_id/notifications' component={Notification}/>

              {/* Impersonate feature of consultant for admin */}
              <Route exact path='/admin/consultant/:acc_id/dashboard' component={consultantdashboard}/>
              <Route exact path='/admin/consultant/:acc_id/liste-des-producteurs'
                     component={ConsultantListOfProducers}/>
              <Route exact path="/admin/consultant/:acc_id/notes" component={Consultantenote}/>
              <Route exact path='/admin/consultant/:acc_id/notes/page/:id/' component={Consultantenote}/>
              <Route exact path="/admin/consultant/:acc_id/upload-d-images" component={ConsultantUploadImages}/>
              <Route exact path='/admin/consultant/:acc_id/settings/information-general'
                     component={ConsultantInformationGeneral}/>
              <Route exact path='/admin/consultant/:acc_id/settings/information-de-connexion'
                     component={ConsultantSettingsSettingsConnectionSending}/>
              <Route exact path='/admin/consultant/:acc_id/settings/tags-notes'
                     component={ConsultantSettingsSettingsTagsNotes}/>
              <Route exact path='/admin/consultant/:acc_id/settings/acces-and-invitation'
                     component={AccessInvitations}/>
              <Route exact path='/admin/consultant/:acc_id/notifications' component={consultantnotification}/>

              {/* Impersonate feature of consultant for entreprise */}
              <Route exact path='/entreprise/consultant/:acc_id/dashboard' component={consultantdashboard}/>
              <Route exact path='/entreprise/consultant/:acc_id/liste-des-producteurs'
                     component={ConsultantListOfProducers}/>
              <Route exact path="/entreprise/consultant/:acc_id/notes" component={Consultantenote}/>
              <Route exact path='/entreprise/consultant/:acc_id/notes/page/:id/' component={Consultantenote}/>
              <Route exact path="/entreprise/consultant/:acc_id/upload-d-images" component={ConsultantUploadImages}/>
              <Route exact path='/entreprise/consultant/:acc_id/settings/information-general'
                     component={ConsultantInformationGeneral}/>
              <Route exact path='/entreprise/consultant/:acc_id/settings/information-de-connexion'
                     component={ConsultantSettingsSettingsConnectionSending}/>
              <Route exact path='/entreprise/consultant/:acc_id/settings/tags-notes'
                     component={ConsultantSettingsSettingsTagsNotes}/>
              <Route exact path='/entreprise/consultant/:acc_id/settings/acces-and-invitation'
                     component={AccessInvitations}/>
              <Route exact path='/entreprise/consultant/:acc_id/notifications' component={consultantnotification}/>

              {/* Impersonate feature of entreprise for admin */}
              <Route exact path='/admin/entreprise/:acc_id/dashboard' component={entreprisedashboard}/>
              <Route exact path='/admin/entreprise/:acc_id/listes-des-producteurs' component={ListOfProducers}/>
              <Route exact path='/admin/entreprise/:acc_id/listes-des-consultants' component={ListOfConsultants}/>
              <Route exact path="/admin/entreprise/:acc_id/upload-d-images" component={EntrepriseUploadImages}/>
              <Route exact path='/admin/entreprise/:acc_id/settings/information-general'
                     component={EntreprisesettingsInfo}/>
              <Route exact path='/admin/entreprise/:acc_id/settings/information-de-connexion'
                     component={EnterpriseSettingsSettingsConnectionSending}/>
              <Route exact path='/admin/entreprise/:acc_id/settings/services' component={entreprisesettingservice}/>

              {/* Access & Invitation feature level 1 of producteur for consultant */}
              <Route exact path='/consultant/:access/producteur/:acc_id/dashboard' component={producteuredashboard}/>
              <Route exact path='/consultant/:access/producteur/:acc_id/photos' component={home}/>
              <Route exact path='/consultant/:access/producteur/:acc_id/photos/open/:id/' component={home}/>
              <Route exact path='/consultant/:access/producteur/:acc_id/notes/page/:id/' component={producteurenote}/>
              <Route exact path='/consultant/:access/producteur/:acc_id/notes' component={producteurenote}/>
              <Route exact path='/consultant/:access/producteur/:acc_id/notifications' component={Notification}/>

              {/* Access & Invitation feature level 2 (encrypted key) of producteur for consultant */}
              <Route exact path='/consultant/:access/producteur/:acc_id/:key/dashboard' component={producteuredashboard}/>
              <Route exact path='/consultant/:access/producteur/:acc_id/:key/photos' component={home}/>
              <Route exact path='/consultant/:access/producteur/:acc_id/:key/photos/open/:id/' component={home}/>
              <Route exact path='/consultant/:access/producteur/:acc_id/:key/notes/page/:id/' component={producteurenote}/>
              <Route exact path='/consultant/:access/producteur/:acc_id/:key/notes' component={producteurenote}/>
              <Route exact path='/consultant/:access/producteur/:acc_id/:key/notifications' component={Notification}/>

              <Redirect to="/404"></Redirect>
            </Switch>
          </Router>
       </LanguageContextProvider>
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
