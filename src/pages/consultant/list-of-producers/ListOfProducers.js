import '../../../components/settingsMain.css'
import '../../../components/consultant/consultant.scss';
import React from 'react';
import "react-datepicker/dist/react-datepicker.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import RectangleMap from "../../../public/img/RectangleMap.png"
import arrowIcon from "../../../public/img/sqr_arrow_icon.png"
import userIcon from "../../../public/img/sqr_user_icon.png"
import Form from "../../../components/consultant/listOfProducers/ProducersFormWeb"
import ArrowTransform from "../../../components/enterprise/ArrowTransform";
import NavBar from "../../../components/layout/main-navigation/ConsultantMainNavigation";
import Footer from "../../../components/layout/footer/ConsultantFooter";
import MyTablePopup from "../../../components/consultant/listOfProducers/ProducersTablePopup";
import { connect, useSelector, useDispatch } from 'react-redux';
import Api from "../../../helper/api";
import Pagination from "react-js-pagination";
import useTranslation from "../../../components/customHooks/translations";
import getLanguage from "../../../components/customHooks/get-language";

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
        return <Component {...props} translation={translation} language={language}/>;
    }
}

class ConsultantListOfProducers extends React.Component {
    constructor(props) {
        super(props)
        const acc_id = this.props.match.params.acc_id;
        this.state = {
            timer:0,
            api: new Api(this.props.token, acc_id),
            producer: [],
            activePage: 1,
            limit: 10,
            total: 0,
            pagenumber: 1,
            query: "",
            
            acc_id:acc_id,
            base_url:"/consultant",
            admin_base_url:"/admin/consultant/"+acc_id,
            entreprise_base_url:"/entreprise/consultant/"+acc_id,
            consultant_base_url:"/consultant/consultant/"+acc_id,
        }
        this.handleLimit = this.handleLimit.bind(this);
        this.urlencodedfunction = this.urlencodedfunction.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        this.state.api
            .getAllProducers([this.state.limit, this.state.pagenumber])
            .then(response => {
                this.setState({
                    producer: response.data.data,
                    total: response.data.pagination.total
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

    setPagination = (updatedPageNo, limit) => {

        this.state.api
            .getAllProducers(limit, updatedPageNo)
            .then(response => {
                this.setState({
                    isLoaded: true,
                    items: response.data.data
                });
            })
            .catch(err => {
                if( err.response.status == 401){
                    this.props.history.push('/');
                  }
              });
    }

    handlePageChange(pageNumber) {
        this.setState({ activePage: pageNumber, pageNumber: pageNumber }, () => {
            this.setPagination(pageNumber, this.state.limit);
        });
    };

    handleLimit(e) {
        const limitValue = e.target.value;
        this.setState({ limit: limitValue, isLoaded: true, message: '' }, () => {
            this.setPagination(this.state.pagenumber, limitValue);
        });

    }

    getCreatedDate(created_at) {
        let date = created_at;
        let dateFormat = require("dateformat");
        let correctdate = dateFormat(date, "yyyy-mm-dd");

        return correctdate;
    }

    urlencodedfunction(prod) {
        
        let city = prod.producteur_account.city;
        let address = prod.producteur_account.address;
        let province = prod.producteur_account.province;
        let postal_code = prod.producteur_account.postal_code;
        let country = prod.producteur_account.country;


        var uri = address + "," + city + "," + province + "," + postal_code + "," + country;
        var res = encodeURI(uri);
        var url = "https://www.google.com/maps/place/" + res;   
        window.open(url, '_blank')
    }


    handleOnInputChange = (event) => {
        if (this.state.timer) {
            clearTimeout(this.state.timer);
            this.setState({timer: 0});
        }
        const query = event.target.value;
        this.setState({
            query: query,
            loading: true,
            message: '',
            timer: setTimeout(() => this.fetchSearchReults(query), 1500)
        });

    };

    fetchSearchReults = (query) => {

        this.state.api
            .searchlProducersLoggedInConsultant([this.state.limit, query])
            .then(response => {

                console.log("data  search", response);
                this.setState({
                    isLoaded: true,
                    producer: response.data.data
                });
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


    render() {
        let base_url = this.state.base_url;
        if (!this.props.isLogged) {
            this.props.history.push('/');
        } else if (this.props.userRole=="ROLE_CONSULTANT") {

        } else if (this.props.userRole=="ROLE_ADMIN" && this.state.acc_id) {
            base_url = this.state.admin_base_url;
        } else if (this.props.userRole=="ROLE_ENTREPRISE" && this.state.acc_id) {
            base_url = this.state.entreprise_base_url;
        } else  {
            this.props.history.push('/');
        }

        const { producer, query } = this.state;
        const translation = this.props.translation;
        return (
            <div>
                <NavBar base_url={base_url} acc_id={this.state.acc_id}></NavBar>
                <div>
                    <main>
                        <div id="mainDivSelect">
                            <div>
                                <main style={{ backgroundColor: '#F0F0F0' }}>
                                    <div className="row pt-4 align-bottom"
                                        style={{
                                            maxHeight: '200px',
                                            marginLeft: '10px',
                                            marginRight: '10px',
                                            marginBottom: '20px',
                                        }}>
                                        <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-xs-12"
                                            style={{ marginTop: '10px', marginBottom: '10px' }}>


                                            <h3 className="modal-title p-1 d-inline" id="exampleModalLabel">
                                                {translation.Producers}
                                            </h3>
                                            <label className="p-2 d-inline">{this.state.total}</label>

                                        </div>
                           

                                        <div className="col-xl-4 col-lg-5 col-md-6 col-sm-6 col-xs-12 ml-auto "
                                        style={{ marginTop: '10px', marginBottom: '10px' }}>
                                        <div className="input-group">
                                            <input type="text" className="form-control"
                                                name="query" value={query} id="search-input" placeholder={translation.city_producers_name} onChange={this.handleOnInputChange} />
                                            <div className="input-group-append">
                                                <button className="btn btn-secondary" type="button">
                                                    <i className="fa fa-search"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    </div>

                                    <div>

                                        <div>
                                            <div id="no-more-tables"
                                                className="admin-entreprise-actions-view-size"
                                            >

                                                <table class="col-sm-12   table-condensed cf" style={{ backgroundColor: 'white' }}>
                                                    <thead class="cf" >
                                                        <tr class="text-left" style={{ height: '70px' }}>
                                                            <th >{translation.Name_of_the_producer}</th>
                                                            <th className="d-none d-md-table-cell">{translation.City}</th>
                                                            <th className="d-none d-md-table-cell">{translation.Postal_Code}</th>
                                                            <th className="d-none d-md-table-cell">{translation.Renewal_date}</th>
                                                            <th>{translation.Status}</th>
                                                            <th class="text-center" style={{ paddingLeft: '65px' }}>{translation.Actions}</th>
                                                        </tr>
                                                    </thead>

                                                    {producer.map((prod) => (

                                                        <tbody>
                                                            <tr class=" border-top text-left" style={{ height: '70px' }}>
                                                                <td data-title={translation.Name_of_the_producer}
                                                                    className="admin-entreprise-actions-button-child bloxaligment">
                                                                    {this.props.language == "FR" ? prod.producteur_account.name_fr : prod.producteur_account.name_en}
                                                                </td>
                                                                <td className="d-none d-md-table-cell" data-title="Prénom">{prod.producteur_account.city}</td>
                                                                <td className="d-none d-md-table-cell" data-title="Prénom">{prod.producteur_account.postal_code}</td>
                                                                <td className="d-none d-md-table-cell" data-title="Prénom">{this.getCreatedDate(prod.producteur_account.created_at)}</td>
                                                                <td className="d-none d-md-table-cell" data-title="Prénom">{prod.producteur_account.status}</td>
                                                                <td data-title={translation.Status} style={{ paddingLeft: '70px' }}>
                                                                    <div class="text-center">
                                                                        <ul class="ml-auto arrow_collapse_margin admin-entreprise-actions-button-parent" style={{ margin: "0px" }}>
                                                                            <img src={RectangleMap} className="img-responsive " onClick={ () => this.urlencodedfunction(prod)}
                                                                                alt="Responsive image" />
                                                                            <a href={"/consultant/producteur/"+prod.producteur_account.id+"/dashboard"}><img src={userIcon}
                                                                                className="img-responsive inline-block"
                                                                                alt="Responsive image" /></a>
                                                                            {/* <span data-toggle="modal" data-target="#modelExample" data-href="{{ $e->id }}">
                                                                                <span className="d-none d-md-inline" data-toggle="collapse"
                                                                                    data-target="#collapseExample" aria-expanded="false"
                                                                                    aria-controls="collapseExample" data-href="{{ $e->id }}">
                                                                                    <ArrowTransform class=" inline-block "> </ArrowTransform>
                                                                                </span>
                                                                                <img src={arrowIcon} className="d-inline d-md-none"
                                                                                    data-toggle="collapse" data-target="#collapseExample"
                                                                                    aria-expanded="false"
                                                                                    aria-controls="collapseExample"></img>
                                                                            </span> */}

                                                                            <span className="admin-entreprise-actions-button-child-two">
                                                                                <span className="onlyForMobile" data-toggle="modal" data-target={"#modelExample" + prod.id} data-href="{{ $e->id }}">
                                                                                    <span className="d-none d-md-inline" data-toggle="collapse" data-target={"#collapseExample" + prod.id} aria-expanded="false" aria-controls="collapseExample" data-href="{{ $e->id }}">
                                                                                        <ArrowTransform class=" inline-block"  > </ArrowTransform>
                                                                                    </span>
                                                                                    <img src={arrowIcon} className="d-inline d-md-none" data-toggle="collapse" data-target={"#collapseExample" + prod.id} aria-expanded="false" aria-controls="collapseExample" data-href="{{ $e->id }}"></img>
                                                                                </span>
                                                                                <span className="onlyForDesktop">
                                                                                    <span className="d-none d-md-inline" data-toggle="collapse" data-target={"#collapseExample" + prod.id} aria-expanded="false" aria-controls="collapseExample" data-href="{{ $e->id }}">
                                                                                        <ArrowTransform class=" inline-block"  > </ArrowTransform>
                                                                                    </span>
                                                                                    <img src={arrowIcon} className="d-inline d-md-none" data-toggle="collapse" data-target={"#collapseExample" + prod.id} aria-expanded="false" aria-controls="collapseExample" data-href="{{ $e->id }}"></img>
                                                                                </span>
                                                                            </span>

                                                                        </ul>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <div id={"collapseExample" + prod.id} class="collapse">
                                                                <MyTablePopup value={prod} acc_id={this.state.acc_id}></MyTablePopup>
                                                            </div>
                                                            <tr class="hide-table-padding d-none d-md-table-row">
                                                                <td colspan="8" class="">
                                                                    <div id={"collapseExample" + prod.id} class="collapse">
                                                                        {/* <Form value={item} entrepriseList={this.state.enterpriseitem} ></Form> */}
                                                                        <Form value={prod} acc_id={this.state.acc_id}></Form>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </tbody>

                                                    ))}

                                                </table>
                                            </div>
                                        </div>

                                    </div>
                                </main>


                                <nav aria-label="Page navigation example" style={{ margin: '29px 28px' }}>
                                    <label htmlFor="inputEmail" >{translation.View}</label>
                                    <select value={this.state.limit} style={{ margin: '10px' }} onChange={this.handleLimit}>
                                        <option name="male">10</option>
                                        <option name="male">20</option>
                                        <option name="female">50</option>
                                        <option name="female">100</option>
                                    </select>
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
                                </nav>
                            </div>
                        </div>
                    </main>
                    <Footer />
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, null)(withLanguageHook(ConsultantListOfProducers));