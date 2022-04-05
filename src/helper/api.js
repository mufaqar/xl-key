import * as axios from "axios";
import Config from "../config/config";

export default class Api {

    constructor(token, acc_id = 0, access_level=false, access_key=false) {
        this.api_token = token;
        this.client = null;
        this.api_url = Config.ApiUrl;
        this.acc_id = acc_id;
        this.access_level = access_level;
        this.access_key = access_key;
    }

    init = () => {
        // this.api_token = this.props.token
        let headers = {}
        if (this.access_level==1) {
            headers = {
                'Access-Control-Allow-Origin': '*',
                "x-access-token": this.api_token,
                "lang": "FR",
                "access": "true",
                "access_level": 1,
                "account_id": this.acc_id
            };
        }
        else if (this.access_level==2 && this.access_key) {
            headers = {
                'Access-Control-Allow-Origin': '*',
                "x-access-token": this.api_token,
                "lang": "FR",
                "access": "true",
                "access_level": 2,
                "access_key": this.access_key,
                "account_id": this.acc_id
            };
        }
        else if (this.acc_id) {
            headers = {
                'Access-Control-Allow-Origin': '*',
                "x-access-token": this.api_token,
                "lang": "FR",
                "impersonate": "true",
                "account_id": this.acc_id
            };
        } else {
            headers = {
                'Access-Control-Allow-Origin': '*',
                "x-access-token": this.api_token,
                "lang": "FR"
            };
        }

        this.client = axios.create({
            baseURL: this.api_url,
            timeout: (60000 * 35), // 35 minutes
            headers: headers,
        });
        return this.client;
    }

    getAccountList = (params) => {
        console.log("params** $params", params);
        let type = params[0];
        let limit = params[1];
        let pagenumber = params[2];
        let url;
        console.log("params** $params", params[0]);
        if (type === "entreprise") {
            url = "accounts/entreprise/all/withadmin/?limit=" + limit + "&page=" + pagenumber;
        } else if (type === "consultant") {
            url = "accounts/consultant/all/withadmin/?limit=" + limit + "&page=" + pagenumber;
        } else if (type === "producteur") {
            url = "accounts/producteur/all/withadmin/?limit=" + limit + "&page=" + pagenumber;
        }

        return this.init().get(url);
    };


    getAllEntreprise = () => {
        return this.init().get("accounts/entreprise/all");
    };

    createAccounts = (data) => {
        let type = data[0];
        let url;

        if (type == "entreprise") {
            url = "accounts/entreprise/create";
        } else if (type == "consultant") {
            url = "accounts/consultant/create";
        } else if (type == "producteur") {
            url = "accounts/producteur/create";
        }

        return this.init().post(url, data[1]);

    };

    updateAccounts = (data) => {
        let url = "accounts/update/" + data[0];
        console.log("url ***", url);
        return this.init().put(url, data[1]);
    };

    deleteAccounts = (data) => {
        console.log("url ***", data);
        let url = "accounts/delete/" + data;
        return this.init().delete(url);
    };

    userDetails = () => {
        const url = "accounts/withadmin/78/";
        return this.init().get(url);

    };

    fetchStatusList = (params) => {
        let type = params[0];
        let query = params[1];
        let status = params[2];
        let url;

        if (type == "entreprise") {
            url = "accounts/entreprise/all/withadmin/?limit=10&page=1&search=" + query + "&status=" + status;
        } else if (type == "consultant") {
            url = "accounts/consultant/all/withadmin/?limit=10&page=1&search=" + query + "&status=" + status;
        } else if (type == "producteur") {
            url = "accounts/producteur/all/withadmin/?limit=10&page=1&search=" + query + "&status=" + status;
        }

        return this.init().get(url);
    };

    searchAccount = (params) => {

        let type = params[0];
        let limit = params[1];
        let query = params[2];
        let status = params[3];
        let url;

        if (type == "entreprise") {
            url = "accounts/entreprise/all/withadmin/?limit=" + limit + "&page=1&search=" + query + "&status=" + status;
        } else if (type == "consultant") {
            url = "accounts/consultant/all/withadmin/?limit=" + limit + "&page=1&search=" + query + "&status=" + status;
        } else if (type == "producteur") {
            url = "accounts/producteur/all/withadmin/?limit=" + limit + "&page=1&search=" + query + "&status=" + status;
        }

        return this.init().get(url);
    };

    getAllUsers = () => {
        return this.init().get("users/all");
    };

    createNewUser = (data) => {
        return this.init().post("users/create", data);
    };

    updateUser = (data) => {
        let url = "users/update/" + data[0];
        console.log("url ***", url);
        return this.init().put(url, data[1]);
    };

    deleteUser = (data) => {
        let url = "users/delete/" + data;
        console.log("url ***", url);
        return this.init().delete(url);
    };

    getOwnAccountDetils = () => {
        const url = "accounts/my/withadmin/";
        return this.init().get(url);
    };

    updateOwnAccountDetils = (data) => {
        console.log("update*******", data);
        const url = "accounts/my/update/";
        return this.init().put(url, data);
    };

    deleteOwnAccountDetils = () => {
        let url = "accounts/my/delete/";
        return this.init().delete(url);
    };

    getConsultantCategories = () => {
        return this.init().get("consultant-categories/all");
    };

    allConsultantLoggedInEntreprise = (params) => { //To retrieve all consultant accounts of the logged in entreprise

        console.log("params** $params", params);
        let limit = params[0];
        let pagenumber = params[1];
        let url;
        console.log("params** $params", params[0]);

        url = "accounts/my/consultant/all/withadmin/?limit=" + limit + "&page=" + pagenumber;

        return this.init().get(url);

    };

    searchConsultantLoggedInEntreprise = (params) => { //To retrieve all consultant accounts of the logged in entreprise

        console.log("params** $params", params);
        let limit = params[0];
        let query = params[1];
        let status = params[2];
        let url;
        console.log("params** $params", params[0]);
        url = "accounts/my/consultant/all/withadmin/?limit=" + limit + "&page=1&search=" + query + "&status=" + status;

        return this.init().get(url);

    };

    fetchStatusConsultantLoggedInEntreprise = (params) => {

        let query = params[0];
        let status = params[1];
        let limit = params[2];
        let url;

        url = "accounts/my/consultant/all/withadmin/?limit=" + limit + "&page=1&search=" + query + "&status=" + status;
        return this.init().get(url);

    }

    fetchByDateConsultantLoggedInEntreprise = (params) => {

        let query = params[0];
        let status = params[1];
        let limit = params[2];
        let date = params[3];
        let url;

        url = "accounts/my/consultant/all/withadmin/?limit=" + limit + "&page=1&search=" + query + "&status=" + status + "&date=" + date;
        return this.init().get(url);

    }

    allProducteurLoggedInEntreprise = (params) => { //To retrieve all producteur accounts of the logged in entreprise

        console.log("params** $params", params);
        let limit = params[0];
        let pagenumber = params[1];
        let url;
        console.log("params** $params", params[0]);

        url = "accounts/my/producteur/all/withadmin/?limit=" + limit + "&page=" + pagenumber;

        return this.init().get(url);
        // return this.init().get("accounts/my/producteur/all/withadmin");
    };

    searchProducteurLoggedInEntreprise = (params) => { //To retrieve all consultant accounts of the logged in entreprise

        console.log("params** $params", params);
        let limit = params[0];
        let query = params[1];
        let status = params[2];

        let url;
        console.log("params** $params", params[0]);
        url = "accounts/my/producteur/all/withadmin/?limit=" + limit + "&page=1&search=" + query + "&status=" + status;
        return this.init().get(url);

    };


    fetchStatusProducteurLoggedInEntreprise = (params) => {

        let query = params[0];
        let status = params[1];
        let limit = params[2];
        let url;

        url = "accounts/my/producteur/all/withadmin/?limit=" + limit + "&page=1&search=" + query + "&status=" + status;
        return this.init().get(url);

    }

    fetchByDateProducteurLoggedInEntreprise = (params) => {

        let query = params[0];
        let status = params[1];
        let limit = params[2];
        let date = params[3];
        let url;

        url = "accounts/my/producteur/all/withadmin/?limit=" + limit + "&page=1&search=" + query + "&status=" + status + "&date=" + date;
        return this.init().get(url);

    }


    allProducteurAssociatedConsultant = (params) => { //To retrieve all producteur accounts associated to the consultant

        console.log("params** $params", params);
        let limit = params[0];
        let pagenumber = params[1];
        let url;
        console.log("params** $params", params[0]);

        url = "accounts/my/consultant/producteur/all/withadmin/?limit=" + limit + "&page=" + pagenumber;

        return this.init().get(url);
        // return this.init().get("accounts/my/consultant/producteur/all/withadmin");
    };

    getAllConsultantCategories = () => {
        return this.init().get("consultant-categories/all");
    };


    createCategory = (data) => {
        return this.init().post("consultant-categories/create", data);
    };

    updateCategory = (data) => {
        let url = "consultant-categories/update/" + data[0];
        return this.init().put(url, data[1]);
    };

    deleteCategory = (data) => {
        console.log("url ***", data);
        let url = "consultant-categories/delete/" + data;
        return this.init().delete(url);
    };

    fetchByDateConsultant = (params) => {

        let query = params[0];
        let status = params[1];
        let limit = params[2];
        let date = params[3];
        let url;

        url = "accounts/consultant/all/withadmin/?limit=" + limit + "&page=1&search=" + query + "&status=" + status + "&date=" + date; //date:2021-07-11
        return this.init().get(url);
    }

    fetchByDateProducteur = (params) => {

        let query = params[0];
        let status = params[1];
        let limit = params[2];
        let date = params[3];
        let url;

        url = "accounts/producteur/all/withadmin/?limit=" + limit + "&page=1&search=" + query + "&status=" + status + "&date=" + date; //date:2021-07-11
        return this.init().get(url);
    }

    fetchbyProducerinEntreprise = (data) => {
        let url = "accounts/withadmin/" + data + "/producteur/all/withadmin";
        if (data == 0) {
            url = "accounts/producteur/all/withadmin";
        }
        return this.init().get(url);
    };

    fetchbyConsultantinEntreprise = (data) => {
        console.log("url ***", data);
        let url = "accounts/withadmin/" + data + "/consultant/all/withadmin";
        if (data == 0) {
            url = "accounts/consultant/all/withadmin";
        }
        return this.init().get(url);
    };

    getAllProducteur = () => {
        return this.init().get("accounts/producteur/all");
    };

    getMyProducteur = () => {
        return this.init().get("accounts/my/producteur/all/");
    }

    getAllYears = () => {
        return this.init().get("years/all");
    }

    getAllProducers = (params) => {
        let limit = params[0];
        let pagenumber = params[1];
        return this.init().get("accounts/my/consultant/producteur/all/withadmin/?limit=" + limit + "&page=" + pagenumber);
    }

    searchlProducersLoggedInConsultant = (params) => { //To retrieve all consultant accounts of the logged in entreprise

        console.log("params** $params", params);
        let limit = params[0];
        let query = params[1];
        let url;
        console.log("params** $params", params[0]);
        url = "accounts/my/consultant/producteur/all/withadmin/?limit=" + limit + "&page=1&search=" + query;

        return this.init().get(url);
    };

    getAllNotification = (params) => {
        let pagenumber = params[0];
        let limit = params[1];
        return this.init().get("notifications/all/?page=" + pagenumber + "&limit=" + limit);
    }

    getNotificationViewed = (params) => {
        let viewed = params[0];
        return this.init().post("notifications/viewed", viewed);
    }

    getHeader = (data) => {
        console.log("url ***", data);
        let url = "accounts/producteur/"+data+"/";
        return this.init().get(url);
    };
}
