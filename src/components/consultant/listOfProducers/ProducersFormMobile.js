import React from 'react'
import useTranslation from "../../customHooks/translations";
import getLanguage from "../../customHooks/get-language";
var createClass = require('create-react-class');

function withLanguageHook(Component) {
    return function WrappedComponent(props) {
        const translation = useTranslation();
        const language = getLanguage();
        return <Component {...props} translation={translation} language={language}/>;
    }
}

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
            // <select class="form-select" aria-label="XL KEY" >
            //                   <option selected></option>
            //                   <option value="Another1">Another1</option>
            //                   <option value="Another2">Another2</option>
            //                   <option value="Another3">Another3</option>
            //               </select>
        )
    }
})

var TextField = createClass({
    render: function () {

        var text = this.props.text || 'Nothing yet'
        return (
            <div>

                <p>{text}</p>
            </div>
        )
    }
})

var FormMobile = createClass({


    onFormSubmit: function (e) {
        e.preventDefault();
        console.log(this.state.startDate)
    },

    getInitialState: function () {
        return {
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
        }
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
        const { prod } = this.state;
        const translation = this.props.translation;
        const language = this.props.language;
        const isFrench = language == "FR";
        return (
            <div>
                <div class="row">
                    <div class="mb-3">
                        <div className="d-flex align-items-end" style={{ paddingLeft: '5px' }}>
                            <strong htmlFor="inputEmail" style={{ margin: '10px' }}>{translation.Status}: </strong>
                            <label htmlFor="inputEmail" style={{ margin: '10px' }}>{prod.producteur_account.status}</label>
                        </div>
                    </div>
                    <div class="container mb-4">
                        <strong htmlFor="inputEmail" style={{ margin: '10px', marginLeft: '0' }}>{translation.Primary_Contact_Information}</strong>
                        <div className="row mt-2">
                            <div className="col-4">
                                <p className="mb-0">{translation.Name}</p>
                            </div>
                            <div className="col-8">
                                <p className="mb-0">{isFrench ? prod.producteur_account.name_fr : prod.producteur_account.name_en}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-4">
                                <p className="mb-0">{translation.First_Name}</p>
                            </div>
                            <div className="col-8">
                                <p className="mb-0">{isFrench ? prod.producteur_account.name_fr : prod.producteur_account.name_en}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-4">
                                <p className="mb-0">{translation.Phone}</p>
                            </div>
                            <div className="col-8">
                                <p className="mb-0">{prod.producteur_account.contact_phone}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-4">
                                <p className="mb-0">{translation.Email}</p>
                            </div>
                            <div className="col-8">
                                <p className="mb-0">{prod.producteur_account.contact_email}</p>
                            </div>
                        </div>
                    </div>

                    <div class="container mb-3">
                        <strong htmlFor="inputEmail" style={{ margin: '10px', marginLeft: '0' }}>{translation.Producer_information}</strong>
                        <div className="row mt-2">
                            <div className="col-4">
                                <p className="mb-0">{translation.Name}</p>
                            </div>
                            <div className="col-8">
                                <p className="mb-0">{isFrench ? prod.producteur_account.name_fr : prod.producteur_account.name_en}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-4">
                                <p className="mb-0">{translation.Address}</p>
                            </div>
                            <div className="col-8">
                                <p className="mb-0">{prod.producteur_account.address}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-4">
                                <p className="mb-0">{translation.City}</p>
                            </div>
                            <div className="col-8">
                                <p className="mb-0">{prod.producteur_account.city}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-4">
                                <p className="mb-0">{translation.Postal_Code}</p>
                            </div>
                            <div className="col-8">
                                <p className="mb-0">{prod.producteur_account.postal_code}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-4">
                                <p className="mb-0">{translation.Province}</p>
                            </div>
                            <div className="col-8">
                                <p className="mb-0">{prod.producteur_account.province}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-4">
                                <p className="mb-0">{translation.Country}</p>
                            </div>
                            <div className="col-8">
                                <p className="mb-0">{prod.producteur_account.country}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
})

export default withLanguageHook(FormMobile);
