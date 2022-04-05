import React from 'react'
import mapIconInButton from "../../../public/img/Map.png"
import userIconInButton from "../../../public/img/user_icon_in_button.png"
import useTranslation from "../../customHooks/translations";
import getLanguage from "../../customHooks/get-language";

var createClass = require('create-react-class');

var TextInput = createClass({
    handleInput: function () {
        var input = React.findDOMNode(this.refs.userInput)
        this.props.saveInput(input.value)

        //input.value = ''
    },
    render: function () {
        //var label = this.props.label
        return (
            <div class="form-group">

                <input
                    type="text"
                    class="form-control"
                    id="input-{ label }"
                    ref="userInput"
                />
                {/* <button onClick={ this.handleInput }>Save</button> */}
            </div>
        )
    }
})

function withLanguageHook(Component) {
    return function WrappedComponent(props) {
        const translation = useTranslation();
        const language = getLanguage();
        return <Component {...props} translation={translation} language={language}/>;
    }
}

var DropDown = createClass({
    render: function () {

        var text = this.props.text || 'Nothing yet'
        return (
            <div class="input-group">
                <input type="text" class="form-control" aria-label="Text input with dropdown button"
                    placeholder="XL KEY"></input>
                <div class="input-group-append">
                    <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown"
                        aria-haspopup="true" aria-expanded="false"></button>
                    <div class="dropdown-menu">
                        <a class="dropdown-item" href="#">Another1</a>
                        <a class="dropdown-item" href="#">Another2</a>
                        <a class="dropdown-item" href="#">Something else here</a>


                    </div>
                </div>
            </div>
        )
    }
})

var TextField = createClass({
    render: function () {

        var text = this.props.text || 'Nothing yet'
        return (
            <div style={{ paddingTop: '8px' }}>

                <p>{text}</p>
            </div>
        )
    }
})

var Form = createClass({

    onFormSubmit: function (e) {
        e.preventDefault();
        console.log(this.state.startDate)
    },

    getInitialState: function () {

        return this.assignStates(
            this.props.token,
            this.props.value,
            this.props.acc_id,
            // this.props.assignationdproducer
          );
      
    

    },

    assignStates: function (token,value, acc_id) {
        let initial_values = {
            userIsEditing: false,
            prod: this.props.value,
            Nom: 'Graham',
            Prenom: 'Soria',
            Téléphone: '438 924 7638',
            Courriel: 'soria.graham@gmail.com',
            Assignationdentreprise: 'XL KEY',

            Nom1: 'Juan Esteban Sarmiento',
            Adresse: '15 rue des Lila',
            Ville: 'Québec',
            Codepostal: 'K4D 1K3',
            Province: 'Québec',
            Pays: 'Canada',
            newUrl: "",
            acc_id: this.props.acc_id

        }

        // this.toggleOffer = this.toggleOffer.bind(this);
        return initial_values;

    },


    componentDidMount() {
        this.urlencodedfunction();
    },
  

    urlencodedfunction: function () {
        let prod = this.props.value;


        let city = prod.producteur_account.city;
        let address = prod.producteur_account.address;
        let province = prod.producteur_account.province;
        let postal_code = prod.producteur_account.postal_code;
        let country = prod.producteur_account.country;


        var uri = address + "," + city + "," + province + "," + postal_code + "," + country;
        console.log("uri*********", uri)
        var res = encodeURI(uri);
        var url = "https://www.google.com/maps/place/" + res;
        console.log("uri*********", url)
        this.setState({newUrl: url});
       
    },
    

    toggleEditing: function () {
        var userIsEditing = !this.state.userIsEditing
        this.setState({
            userIsEditing: userIsEditing
        })

    },
    saveInput: function (input) {
        this.setState({
            favoriteFlavor: input
        })
    },
    render: function () {
        const language = this.props.language;
        const isFrench = language == "FR";
        if (this.props.acc_id !=this.state.acc_id) {
            this.setState(this.assignStates(
                this.props.token,
                this.props.value, 
                this.props.acc_id
                )
              );
          }

        const { prod } = this.state;
        const translation = this.props.translation;
        return (
            <div style={{ marginBottom: '20px' }}>
                <div class="row"
                    style={{
                        margin: '0px 40px',
                        borderBottom: '1px solid #F0F0F0',
                        borderTop: '1px solid #F0F0F0',
                        paddingBottom: '20px',
                        paddingTop: '20px',
                    }}>
      
                    <div class="col-xl-4 col-lg-5 col-md-6 col-sm-6">
                    <a href={this.state.newUrl} target="_blank">
                        <button
                            type="button" class="btn btn-primary"
                            >
                            <img src={mapIconInButton} style={{ margin: '0px' }}/>
                            <span class="btn-label">{translation.See_on_Google_Maps}</span>
                        </button>
                        </a>

                    </div>
                   
                    <div class="col-xl-4 col-lg-5 col-md-6 col-sm-6">
                        <button type="button" class="btn btn-primary">
                            <img src={userIconInButton} style={{ margin: '0px' }} />
                            <span class="btn-label">{translation.Log_in_to_your_account}</span>
                        </button>
                    </div>
                </div>
                <div class="row" style={{ marginTop: '20px', marginLeft: '50px', marginRight: '50px' }}>

                    <div class="col-md-6">
                        <div className="d-flex align-items-end mb-2">
                            <strong htmlFor="inputEmail" style={{ margin: '10px' }}>{translation.Status}: </strong>
                            <label htmlFor="inputEmail" style={{ margin: '10px' }}>{prod.producteur_account.status}</label>
                        </div>
                        <strong htmlFor="inputEmail" style={{ margin: '10px' }}>{translation.Primary_Contact_Information}</strong>
                        <div style={{ marginTop: '10px', paddingLeft: '10px' }}>
                            <div className="row">
                                <div className="col-md-4">
                                    <p htmlFor="inputEmail">{translation.Name}</p>
                                </div>
                                <div className="col-md-8">
                                    <p htmlFor="inputEmail">{isFrench ? prod.producteur_account.name_fr : prod.producteur_account.name_en}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-4">
                                    <p htmlFor="inputEmail">{translation.First_Name}</p>
                                </div>
                                <div className="col-md-8">
                                    <p htmlFor="inputEmail">{isFrench ? prod.producteur_account.name_fr : prod.producteur_account.name_en}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-4">
                                    <p htmlFor="inputEmail">{translation.Phone}</p>
                                </div>
                                <div className="col-md-8">
                                    <p htmlFor="inputEmail">{prod.producteur_account.contact_phone}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-4">
                                    <p htmlFor="inputEmail">{translation.Email}</p>
                                </div>
                                <div className="col-md-8">
                                    <p htmlFor="inputEmail">{prod.producteur_account.contact_email}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div className="mt-2">
                            <strong htmlFor="inputEmail" style={{ margin: '10px' }}>{translation.Producer_information}</strong>
                        </div>
                        <div style={{ marginTop: '10px', paddingLeft: '10px' }}>
                            <div className="row">
                                <div className="col-md-4">
                                    <p htmlFor="inputEmail">{translation.Name}</p>
                                </div>
                                <div className="col-md-8">
                                    <p htmlFor="inputEmail">{isFrench ? prod.producteur_account.name_fr : prod.producteur_account.name_en}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-4">
                                    <p htmlFor="inputEmail">{translation.Address}</p>
                                </div>
                                <div className="col-md-8">
                                    <p htmlFor="inputEmail">{prod.producteur_account.address}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-4">
                                    <p htmlFor="inputEmail">{translation.City}</p>
                                </div>
                                <div className="col-md-8">
                                    <p htmlFor="inputEmail">{prod.producteur_account.city}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-4">
                                    <p htmlFor="inputEmail">{translation.Postal_Code}</p>
                                </div>
                                <div className="col-md-8">
                                    <p htmlFor="inputEmail">{prod.producteur_account.postal_code}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-4">
                                    <p htmlFor="inputEmail">{translation.Province}</p>
                                </div>
                                <div className="col-md-8">
                                    <p htmlFor="inputEmail">{prod.producteur_account.province}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-4">
                                    <p htmlFor="inputEmail">{translation.Country}</p>
                                </div>
                                <div className="col-md-8">
                                    <p htmlFor="inputEmail">{prod.producteur_account.country}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
})

export default withLanguageHook(Form);
