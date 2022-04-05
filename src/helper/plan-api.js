import * as axios from "axios";
import Config from "../config/config";

export default class PlanApi {

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

    getAllPlans = () => {
        return this.init().get("plans/all");
    }

    createPlan = (data) => {
        return this.init().post("plans/create", data);
    };

    updatePlan = (data) => {
        let url = "plans/update/" + data[0];
        console.log("url ***", url);
        return this.init().put(url, data[1]);
    };

    deletePlan = (data) => {
        let url = "plans/delete/" + data;
        console.log("url ***", url);
        return this.init().delete(url);
    };

}