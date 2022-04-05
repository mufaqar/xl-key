import * as axios from "axios";
import Config from "../config/config";
export default class AccessApi {

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

  getMyAccount = () => {
    return this.init().get("accounts/my/withadmin/");
  };

  createInvitationLevel2 = (data) => {
    let url;
    url = "invitations/create-level-2";
    return this.init().post(url, data);
  };

  getAllInvitationLevel2 = () => {
    return this.init().get("invitations/all-level-2");
  };

  setStatusLevel2 = (params) => {
    let id = params[0];
    let status = params[1];
    let url;
    if (status == "active") {
      url = "invitations/activate-level-2/" + id;
    } else if (status == "inactive") {
      url = "invitations/deactivate-level-2/" + id;
    }
    return this.init().put(url);
  };

  deleteAccessInvitationLevel2 = (data) => {
    console.log("url ***", data);
    let url = "invitations/delete-level-2/" + data;
    return this.init().delete(url);
  };

  createInvitationLevel1 = (data) => {
    let url;
    url = "invitations/create-level-1";
    return this.init().post(url, data);
  };

  getAllInvitationLevel1 = () => {
    return this.init().get("invitations/all-level-1");
  };

  setStatusLevel1 = (params) => {
    let id = params[0];
    let status = params[1];
    let url;
    if (status == "active") {
      url = "invitations/activate-level-1/" + id;
    } else if (status == "inactive") {
      url = "invitations/activate-level-1/" + id;
    }
    return this.init().put(url);
  };
  
  deleteAccessInvitationLevel1 = (data) => {
    console.log("url ***", data);
    let url = "invitations/delete-level-1/" + data;
    return this.init().delete(url);
  };

  createConsultantInvitationLevel1 = (data) => {
    let url;
    url = "invitations/consultant/create-level-1";
    return this.init().post(url, data);
  };

  getConsultantInvitationLevel1 = () => {
    return this.init().get("invitations/consultant/all-level-1");
  };

  sendInvitationProducture = (data) => {
    let url = "invitations/send-level-1";
    return this.init().post(url, data);
  }

  sendInvitationConsultant = (data) => {
    let url = "invitations/consultant/send-level-1";
    return this.init().post(url, data);
  }


}
