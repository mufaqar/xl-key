import React from 'react'
import "./notification.css";
import Api from "../../../helper/api";
import * as Moment from "moment";
import Pagination from "react-js-pagination";
import { connect, useSelector, useDispatch } from 'react-redux';
import dataLoader from "../../../dataLoading.gif";
import useTranslation from "../../customHooks/translations";
import getLanguage from "../../customHooks/get-language";

const mapStateToProps = state => {
    let token = state.token;
    let userRole = state.userRole;
    let isLogged = state.isLogged;
    return { token, userRole, isLogged }
}

var createClass = require('create-react-class');

function withLanguageHook(Component) {
    return function WrappedComponent(props) {
        const translation = useTranslation();
        const language = getLanguage();
        return <Component {...props} translation={translation} language={language}/>;
    }
}

var NotificationPage = createClass({

    getInitialState: function () {
        return this.assignStates(
            this.props.token,
            this.props.type,
            this.props.acc_id,
            this.props.base_url,
            this.props.access_level,
            this.props.access_key
        );
    },

    assignStates: function (token, type, acc_id, base_url, access_level, access_key) {

        let initial_values = {
            id: 1,
            type: type,
            api: new Api(token, acc_id, access_level, access_key),
            notifications: [],
            pageNumber: 1,
            limit: 12,
            acc_id: acc_id,
            total: 0,
            activePage: 1,
            newNotification: [],
            base_url: base_url
        }

        return initial_values;

    },

    componentDidMount() {
        this.getAllNotification(true);
    },

    getAllNotification(isStart) {
        this.state.api
            .getAllNotification([this.state.activePage, this.state.limit])
            .then(response => {

                this.setState({
                    notifications: response.data.data,
                    total: response.data.pagination.total,
                    notificationsLoaded: true,
                })
                if (isStart) {
                    this.sendViewedList(response.data.data);
                }
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

    },

    sendViewedList(notifications) {
        let newNotification = [];
        let n = 0;
        (notifications).forEach(item => {
            if (!item.queue.length) {
                newNotification.push(item.id);
            }
            if (item.queue.length && item.queue[0].status == "new") {
                newNotification.push(item.id);

            }
            n++;
        });

        if (newNotification.length) {
            let notificationList = newNotification.join(',');
            let data = {
                "notification_ids": notificationList
            }
            this.state.api
                .getNotificationViewed([data])
                .then(response => {

                })
                .catch(err => {
                    if (err.response && err.response.status == 401) {
                        this.props.history.push('/');
                    } else {

                    }
                });
        }
    },


    handlePageChange(pageNumber) {
        this.setState({ activePage: pageNumber, pageNumber: pageNumber }, () => {
            this.getAllNotification(false);
        });
    },

    getStatus(queue) {
        if (queue[0].status == "viewed") {
            return false;
        } else {
            return true;
        }
    },

    getDate(date) {
        Moment.locale('en');
        return Moment(date).format('YYYY MM DD');
    },

    render: function () {

        if (this.props.acc_id != this.state.acc_id) {
            this.setState(this.assignStates(
                this.props.valueNew,
                this.props.token,
                this.props.acc_id,
                this.props.base_url
            )
            );
        }
        const { notifications } = this.state;
        const translation = this.props.translation;
        const language = this.props.language;
        const isFrench = language == "FR";
        return (

            <div>
                <main>
                    <div id="mainDivSelect" className="headerBecground">
                        <div>
                            <div className="desktophidden">
                                <div className="producteure-dashboard-table-box">
                                    <h4 className="headerColor">{translation.Notifications}</h4>
                                    {this.state.notificationsLoaded ?
                                        (
                                            notifications != null && notifications.length != 0 ?
                                                <div className="table-responsive">
                                                    <table className="table">
                                                        {notifications.map((notification) => (
                                                            <tr>
                                                                <td>
                                                                    <div className="coloumn pl-1">

                                                                        <div className="row">

                                                                            {(notification.queue.length) ?
                                                                                <div>
                                                                                    {(this.getStatus(notification.queue)) && (<svg
                                                                                        className="svg-inline--fa fa-circle fa-w-16 fontColorRed"
                                                                                        viewBox="0 0 512 512">
                                                                                        <path fill="currentColor"
                                                                                            d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z"></path>
                                                                                    </svg>
                                                                                    )}
                                                                                </div> :
                                                                                <div>
                                                                                    {(!notification.queue.length && <svg
                                                                                        className="svg-inline--fa fa-circle fa-w-16 fontColorRed"
                                                                                        viewBox="0 0 512 512">
                                                                                        <path fill="currentColor"
                                                                                            d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z"></path>
                                                                                    </svg>)}

                                                                                </div>
                                                                            }

                                                                            <div className="pl-1">
                                                                                {this.getDate(notification.created_at)}
                                                                            </div>
                                                                        </div>

                                                                        {isFrench ? notification.text_fr : notification.text_en}<br />{notification.author.first_name} {notification.author.last_name}

                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}

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

                                    {
                                        (
                                            this.state.notificationsLoaded && notifications != null && notifications.length != 0 ?
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <div className="desktophidden">
                                                            <div style={{ marginTop: "-33px" }}>
                                                                <Pagination
                                                                    activePage={this.state.activePage}
                                                                    itemsCountPerPage={this.state.limit}
                                                                    totalItemsCount={this.state.total}
                                                                    pageRangeDisplayed={1}
                                                                    onChange={this.handlePageChange.bind(this)}
                                                                    itemClass='page-item'
                                                                    linkClass='page-link'
                                                                />
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                                :
                                                null
                                        )
                                    }
                                </div>
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
                                                notifications != null && notifications.length != 0 ?
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

                                                            {notifications.map((notification) => (

                                                                <tbody>
                                                                    <tr className=" border-top text-left"
                                                                        style={{ height: '70px' }}>
                                                                        {(notification.queue.length) ?
                                                                            <td>
                                                                                {(this.getStatus(notification.queue)) && (
                                                                                    <svg
                                                                                        className="svg-inline--fa fa-circle fa-w-16 fontColorRed"
                                                                                        viewBox="0 0 512 512">
                                                                                        <path fill="currentColor"
                                                                                            d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z"></path>
                                                                                    </svg>
                                                                                )}
                                                                            </td> :
                                                                            <td>
                                                                                {(!notification.queue.length && <svg
                                                                                    className="svg-inline--fa fa-circle fa-w-16 fontColorRed"
                                                                                    viewBox="0 0 512 512">
                                                                                    <path fill="currentColor"
                                                                                        d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z"></path>
                                                                                </svg>)}

                                                                            </td>
                                                                        }
                                                                        <td data-title="Nom" className="admin-entreprise-actions-button-child bloxaligment">{this.getDate(notification.created_at)}</td>
                                                                        <td className="d-none d-md-table-cell" data-title="Prénom">
                                                                            {isFrench ? notification.text_fr : notification.text_en}<br />
                                                                            {notification.model_ids && (
                                                                                <a href={this.state.base_url + "/photos/open/" + (notification.model_ids).replace(/,\s*$/, "") + "/"}>{process.env.REACT_APP_BASE_URL + this.state.base_url + "/photos/open/" + (notification.model_ids).replace(/,\s*$/, "") + "/"}</a>
                                                                            )}
                                                                        </td>
                                                                        <td className="d-none d-md-table-cell" data-title="Prénom">{notification.author.first_name} {notification.author.last_name} </td>
                                                                    </tr>
                                                                </tbody>

                                                            ))}


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
                                                <div className="text-center"><img src={dataLoader} /><br /><br /><br />
                                                </div>
                                            )
                                        }
                                    </div>
                                    <br />
                                    <br />
                                    {
                                        (
                                            this.state.notificationsLoaded && notifications != null && notifications.length != 0 ?
                                                <div className="row">
                                                    <div className="col-md-12">

                                                        <div className="mobilehidden">
                                                            <div style={{ marginTop: "-33px" }}>
                                                                <Pagination
                                                                    activePage={this.state.activePage}
                                                                    itemsCountPerPage={this.state.limit}
                                                                    totalItemsCount={this.state.total}
                                                                    pageRangeDisplayed={3}
                                                                    onChange={this.handlePageChange.bind(this)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                :
                                                null
                                        )
                                    }
                                </div>
                                <br /><br /><br /><br />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        )
    }
})

export default connect(mapStateToProps, null)(withLanguageHook(NotificationPage));