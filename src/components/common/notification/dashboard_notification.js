import React from 'react'
import { connect, useSelector, useDispatch } from 'react-redux';
import Api from "../../../helper/api"
import * as Moment from "moment";
import loader from "../../../loading.gif";
import dataLoader from "../../../dataLoading.gif";
import ServiceItem from "../../producer/services/service-item";
import useTranslation from "../../customHooks/translations";
import getLanguage from "../../customHooks/get-language";

const mapStateToProps = state => {
    let token = state.token;
    let userRole = state.userRole;
    let isLogged = state.isLogged;
    return { token, userRole, isLogged }
}

function withLanguageHook(Component) {
    return function WrappedComponent(props) {
        const translation = useTranslation();
        const language = getLanguage();
        return <Component {...props} translation={translation} language={language} />;
    }
}

class Dashboarnotification extends React.Component {

    constructor(props) {
        super(props)
        this.state = this.assignStates(
            this.props.token,
            this.props.type,
            this.props.acc_id,
            this.props.base_url,
            this.props.access_level,
            this.props.access_key
        );
    }

    assignStates = (token, type, acc_id, base_url, access_level, access_key) => {
        let initial_values = {
            producer: [],
            type: type,
            api: new Api(token, acc_id, access_level, access_key),
            notifications: [],
            notificationsLoaded: false,
            acc_id: acc_id,
            base_url: base_url,
            access_level: access_level,
            access_key: access_key
        }
        return initial_values;
    }

    componentDidMount() {
        this.state.api
            .getAllNotification([1, 3])
            .then(response => {
                this.setState({
                    producer: response.data.data,
                    notificationsLoaded: true,
                })
            })

            .catch(err => {
                if (err.response && err.response.status == 401) {
                    this.props.history.push('/');
                } else {
                    if (err.response && err.response.data.message) {
                        this.setState({ message: err.response.data.message });
                    } else {
                        this.setState({ message: "Quelque chose s'est mal passé !" });
                    }
                }

            });
    }


    getDate(date) {
        Moment.locale('en');
        return Moment(date).format('YYYY MM DD');
    }

    getStatus(queue) {
        if (queue[0].status == "viewed") {
            return false;
        } else {
            return true;
        }
    }

    render() {
        const { producer } = this.state;
        const translation = this.props.translation;
        const language = this.props.language;
        const isFrench = language == "FR";
        return (
            <div>
                <div className="desktophidden">
                    <div className="producteure-dashboard-table-box">
                        <h4 className="headerColor">{translation.Notifications}</h4>
                        {this.state.notificationsLoaded ?
                            (
                                producer != null && producer.length != 0 ?
                                    <div className="table-responsive">
                                        <table className="table">
                                            {producer.map((prod) => (
                                                <tr>
                                                    <td>
                                                        <div className="coloumn pl-1">
                                                            <div className="row">

                                                                {(prod.queue.length) ?
                                                                    <div>
                                                                        {(this.getStatus(prod.queue)) && (<svg
                                                                            className="svg-inline--fa fa-circle fa-w-16 fontColorRed"
                                                                            viewBox="0 0 512 512">
                                                                            <path fill="currentColor"
                                                                                d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z"></path>
                                                                        </svg>
                                                                        )}
                                                                    </div> :
                                                                    <div>
                                                                        {(!prod.queue.length && <svg
                                                                            className="svg-inline--fa fa-circle fa-w-16 fontColorRed"
                                                                            viewBox="0 0 512 512">
                                                                            <path fill="currentColor"
                                                                                d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z"></path>
                                                                        </svg>)}

                                                                    </div>
                                                                }
                                                                <div className="pl-1">
                                                                    {this.getDate(prod.created_at)}
                                                                </div>
                                                            </div>
                                                            {isFrench ? prod.text_fr : prod.text_en}<br />
                                                            {prod.model_ids && (
                                                                <a href={this.state.base_url + "/photos/open/" + (prod.model_ids).replace(/,\s*$/, "") + "/"}>{process.env.REACT_APP_IMAGE_URL + this.state.base_url + "/photos/open/" + (prod.model_ids).replace(/,\s*$/, "") + "/"}</a>
                                                            )}<br />
                                                            {prod.author.first_name} {prod.author.last_name}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}

                                            <tr>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                <a href={this.state.base_url + "/notifications"}>
                                                    <button type="button" className="btn btn-primary primaryTop">{translation.View_all_notifications}</button>
                                                </a>
                                            </tr>
                                        </table>
                                    </div>
                                    :
                                    (
                                        <h6 className="text-left alert alert-primary">
                                            {translation.No_notifications_found}
                                        </h6>
                                    )
                            ) :
                            (
                                <div className="text-center"><img src={dataLoader} /><br /><br /><br /></div>
                            )
                        }
                    </div>
                </div>

                <br></br>
                <div class=" mobilehidden">
                    <div class="container-fluid">
                        <div class="card-body">
                            <div className="producteure-dashboard-table-box">
                                <h4 className="headerColor">{translation.Notifications}</h4>
                                {this.state.notificationsLoaded ?
                                    (
                                        producer != null && producer.length != 0 ?
                                            <div className="table-responsive">
                                                <table className="table " width="100%" cellSpacing="0">
                                                    <thead>
                                                        <tr>
                                                            <th></th>
                                                            <th>{translation.Date}</th>
                                                            <th>{translation.Activity}</th>
                                                            <th>{translation.Author}</th>
                                                        </tr>
                                                    </thead>
                                                    {/*
                                        <tr>

                                            <td>
                                                <svg
                                                    class="svg-inline--fa fa-circle fa-w-16 fontColorRed"
                                                    viewBox="0 0 512 512">
                                                    <path fill="currentColor"
                                                        d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z"></path>
                                                </svg>
                                            </td>
                                            <td>2021-03-29</td>
                                            <td>Une nouvelle photo à été ajouté</td>
                                            <td>Victor Morin</td>
                                        </tr> */}


                                                    <tbody>

                                                        {producer.map((prod) => (
                                                            <tr className=" border-top text-left" style={{ height: '70px' }}>

                                                                {(prod.queue.length) ?
                                                                    <td>
                                                                        {(this.getStatus(prod.queue)) && (<svg
                                                                            className="svg-inline--fa fa-circle fa-w-16 fontColorRed"
                                                                            viewBox="0 0 512 512">
                                                                            <path fill="currentColor"
                                                                                d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z"></path>
                                                                        </svg>
                                                                        )}
                                                                    </td> :
                                                                    <td>
                                                                        {(!prod.queue.length && <svg
                                                                            className="svg-inline--fa fa-circle fa-w-16 fontColorRed"
                                                                            viewBox="0 0 512 512">
                                                                            <path fill="currentColor"
                                                                                d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z"></path>
                                                                        </svg>)}

                                                                    </td>
                                                                }

                                                                <td data-title="Nom"
                                                                    className="admin-entreprise-actions-button-child bloxaligment">{this.getDate(prod.created_at)}</td>
                                                                <td className="d-none d-md-table-cell"
                                                                    data-title="Prénom">{isFrench ? prod.text_fr : prod.text_en}<br />
                                                                    {prod.model_ids && (
                                                                        <a href={this.state.base_url + "/photos/open/" + (prod.model_ids).replace(/,\s*$/, "") + "/"}>{process.env.REACT_APP_BASE_URL + this.state.base_url + "/photos/open/" + (prod.model_ids).replace(/,\s*$/, "") + "/"}</a>
                                                                    )}<br />
                                                                </td>
                                                                <td className="d-none d-md-table-cell"
                                                                    data-title="Prénom">{prod.author.first_name} {prod.author.last_name} </td>


                                                            </tr>
                                                        ))}
                                                        <tr>
                                                            <td></td>
                                                            <td></td>
                                                            <td></td>
                                                            <td>
                                                                <a href={this.state.base_url + "/notifications"}>
                                                                    <button type="button" className="btn btn-primary primaryTop">{translation.View_all_notifications}</button>
                                                                </a>
                                                            </td>
                                                        </tr>


                                                    </tbody>


                                                </table>

                                            </div>
                                            :
                                            (
                                                <h6 className="text-left alert alert-primary">
                                                    {translation.No_notifications_found}
                                                </h6>
                                            )

                                    ) :
                                    (
                                        <div className="text-center"><img src={dataLoader} /><br /><br /><br /></div>
                                    )
                                }
                            </div>
                            <br />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, null)(withLanguageHook(Dashboarnotification));