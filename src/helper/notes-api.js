import * as axios from "axios";
import Config from "../config/config";
export default class Api  {

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

  getAllNotes = () => {
    return this.init().get("notes/all");
  }

  getPageNotes = (data) => {
    let url = "notes/page/" + data + "/all"; 
    return this.init().get(url);
  }


  createNote = (data) => {
    return this.init().post("notes/create", data);
  };


  updateNote = (data) => {
    let url = "notes/update/" + data[0]; 
    console.log("url ***", url);
    return this.init().put(url, data[1]);
  };

  deleteNote = (data) => {
    let url = "notes/delete/" + data;
    console.log("url ***", url);
    return this.init().delete(url);
  };

  createFolder = (data) => {
    return this.init().post("notes/folders/create",data);
  }

  createPage = (data) => {
    return this.init().post("notes/pages/create",data);
  }

  getAllFolders = () =>{
    return this.init().get("notes/folders/all");
  }

  getFolder = (data) =>{
    let url = "notes/folders/find/"+data ;
    return this.init().get(url);
  }

  getPage = (data) =>{
    let url = "notes/pages/find"+data ;
    return this.init().get(url);
  }

  updateFolder = (data) =>{
    
    let url = "notes/folders/update/" + data[0]; 
    console.log("url ***", url);
    return this.init().put(url, data[1]);
  }

  updatePage = (data) =>{
    let url = "notes/pages/update/" + data[0]; 
    console.log("url ***", url);
    return this.init().put(url, data[1]);
  }

  deleteFolder = (data) => {
    let url = "notes/folders/delete/" + data;
    console.log("url ***", url);
    return this.init().delete(url);
  };

  deletePage = (data) => {
    let url = "notes/pages/delete/" + data;
    console.log("url ***", url);
    return this.init().delete(url);
  };


  getNotesTagCategoriesAll = () => {
    return this.init().get("notes/tag-categories/all");
  }

  createNotesTagCategories = (data) => {
    return this.init().post("notes/tag-categories/create", data);
  }

  createNotesTags = (data) => {
    return this.init().post("notes/tags/create", data);
  }

  updateNotesTagsCategories = (data) => {
    let url = "notes/tag-categories/update/" + data[0]; 
    console.log("url ***", url);
    return this.init().put(url, data[1]);
  };

  updateNotesTags = (data) => {
    let url = "notes/tags/update/" + data[0]; 
    console.log("url ***", url);
    return this.init().put(url, data[1]);
  };


  deleteNotesTags = (data) => {
    let url = "notes/tags/delete/" + data;
    console.log("url ***", url);
    return this.init().delete(url);
  };

  deleteNotesTagsCategories = (data) => {
    let url = "notes/tag-categories/delete/" + data;
    console.log("url ***", url);
    return this.init().delete(url);
  };

  deleteNotesPage = (data) => {
    let url = "notes/delete/page/" + data;
    console.log("url ***", url);
    return this.init().delete(url);
  }

  getPageNotesByFilter = (data) =>{
    let id = data[0];
    let year = data[1];
    let tag = data[2];  
    let sites = data[3]; 

  
    // e/1995/all?year=2021&tags=28
    let url = "notes/page/" + id + "/all?year=" + year + "&tags=" +tag + "&sites=" + sites; 

    return this.init().get(url);
  }

 
  getAllSites = () => {
    return this.init().get("sites/all");
  }
  
  getAllPredefinedNoteQuizzes = () => {
    return this.init().get("notes/predefined/all");
  }

  getAllFolderswithAdmin = () =>{
    return this.init().get("notes/folders/all/with-admin-folders");
  }

  getAllYears = () =>{
    return this.init().get("years/all");
  }

    getAllCategories = () => {
        return this.init().get("categories/all");
    }

}