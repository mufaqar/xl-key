import * as axios from "axios";
import Config from "../config/config";

export default class PhotoApi {
    
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

    getAllOwnTags = () => {
        return this.init().get("tags/own");
    }

    getAllCategories = () => {
        return this.init().get("categories/all");
    }

    deleteCategory = (id) => {
        let url = "categories/delete/" + id;
        console.log("url ***", url);
        return this.init().delete(url);
    };

    createCategory = (data) => {
        return this.init().post("categories/create", data);
    }

    updateCategory = (data) => {
        let url = "categories/update/" + data[0];
        console.log("url ***", url);
        return this.init().put(url, data[1]);
    };

    getAllYears = () => {
        return this.init().get("years/all");
    }

    deleteYear = (id) => {
        let url = "years/delete/" + id;
        console.log("url ***", url);
        return this.init().delete(url);
    };

    createYear = (data) => {
        return this.init().post("years/create", data);
    }

    updateYear = (data) => {
        let url = "years/update/" + data[0];
        console.log("url ***", url);
        return this.init().put(url, data[1]);
    };

    getAllPassages = () => {
        return this.init().get("passages/all");
    }

    deletePassage = (id) => {
        let url = "passages/delete/" + id;
        console.log("url ***", url);
        return this.init().delete(url);
    };

    createPassage = (data) => {
        return this.init().post("passages/create", data);
    }

    updatePassage = (data) => {
        let url = "passages/update/" + data[0];
        console.log("url ***", url);
        return this.init().put(url, data[1]);
    };

    getAllSites = () => {
        return this.init().get("sites/all");
    }

    deleteSite = (id) => {
        let url = "sites/delete/" + id;
        console.log("url ***", url);
        return this.init().delete(url);
    };

    createSite = (data) => {
        return this.init().post("sites/create", data);
    }

    updateSite = (data) => {
        let url = "sites/update/" + data[0];
        console.log("url ***", url);
        return this.init().put(url, data[1]);
    };

    getAllFields = () => {
        return this.init().get("fields/all");
    }

    deleteField = (id) => {
        let url = "fields/delete/" + id;
        console.log("url ***", url);
        return this.init().delete(url);
    };

    createField = (data) => {
        return this.init().post("fields/create", data);
    }

    updateField = (data) => {
        let url = "fields/update/" + data[0];
        console.log("url ***", url);
        return this.init().put(url, data[1]);
    };

    getAllCommentsOfPhoto = (id) => {
        return this.init().get("comments/photo/" + id + "/all");
    }

    createComment = (data) => {
        return this.init().post("comments/create", data);
    }

    deleteComment = (id) => {
        let url = "comments/delete/" + id;
        return this.init().delete(url);
    };

    archivePhoto = (data) => {
        let url = "photos/update/" + data[0];
        console.log("url ***", url);
        return this.init().put(url, data[1]);
    };

    updateFavourite = (id) => {
        let url = "photos/favourite/create/" + id;
        console.log("url ***", url);
        return this.init().put(url);
    };

    deleteFavourite = (id) => {
        let url = "photos/favourite/delete/" + id;
        console.log("url ***", url);
        return this.init().delete(url);
    };

    getSitesPerProducteur = (data) => {
        return this.init().get("sites/producteur/" + data + "/all");
    }


    getAllFieldsOfOneSite = () => {
        return this.init().get("fields/all/site");
    }

    insertPhotos = (data) => {
        let type = data[0];
        let url;

        url = "photos/producteur/create";

        return this.init().post(url, data[1]);
    }

    getAllPhotos = (data) => {
        let type = data;
        let url;
        if (type === "entreprise") {
            url = "photos/entreprise/all";
        } else if (type === "consultant") {
            url = "photos/consultant/all";
        } else if (type === "producteur") {
            url = "photos/producteur/all";
        }
        return this.init().get(url);
    }

    getSinglePhoto = (data) => {
        let id = data;
        let url = "photos/find/"+id;
        return this.init().get(url);
    }

    getAllPhotosByFilter = (params) => {

        let limit = params[0];
        let pagenumber = params[1];
        let sites = params[2];
        let year = params[3];
        let tags = params[4];
        let categories = params[5];
        let passages = params[6];
        let status = params[7];
        let isFavourite = params[8];
        console.log("status****** ", status);
        console.log("status******isFavourite  ", isFavourite);
        console.log("pagenumber *********** ", pagenumber);
        let url;

        url = "photos/producteur/all?limit=" + limit +"&page=" + pagenumber +"&years=" + year + "&tags=" +tags + "&sites=" + sites +  "&categories=" + categories +
         "&passages=" + passages + "&status=" + status + "&favourites=" + isFavourite ;
         console.log("status******url  ", url);
        return this.init().get(url);
    }


    getSelectedPhoto = (params) => {

        let limit = params[0];
        let pagenumber = params[1];
        let sites = params[2];
        let year = params[3];
        let tags = params[4];
        let categories = params[5];
        let passages = params[6];
        let status = params[7];
        let isFavourite = params[8];
        let index = params[9];
        console.log("getAllPhoto data index", index);
        let url;

        url = "/photos/producteur/next/" + index + "/?limit=" + limit +"&page=" + pagenumber +"&years=" + year + "&tags=" +tags + "&sites=" + sites +  "&categories=" + categories +
         "&passages=" + passages + "&status=" + status + "&favourites=" + isFavourite ;
         console.log("getAllPhoto data url  ", url);
        return this.init().get(url);
    }

    createphototagcategory = (data) => {
        return this.init().post("photos/tag-categories/create", data);
    }

    createphototag = (data) => {
        return this.init().post("photos/tags/create", data);
    }

    getphotoTagCategoriesAll = () => {
        return this.init().get("photos/tag-categories/all");
    }

    updatePhotoTagsCategories = (data) => {
        let url = "photos/tag-categories/update/" + data[0];
        console.log("url ***", url);
        return this.init().put(url, data[1]);
    }

    updatePhotoTags = (data) => {
        let url = "photos/tags/update/" + data[0];
        console.log("url ***", url);
        return this.init().put(url, data[1]);
    };

    deletePhotoTagsCategories = (data) => {
        let url = "photos/tag-categories/delete/" + data;
        console.log("url ***", url);
        return this.init().delete(url);
    };

    deletePhotoTags = (data) => {
        let url = "photos/tags/delete/" + data;
        console.log("url ***", url);
        return this.init().delete(url);
    };

    getPhotosTags = () => {
        return this.init().get("/photos/tag-categories/all");
    }

    getAllPassage = () => {
        return this.init().get("/passages/all");
    }

    getAllProducteur = (data) => {

        let type = data;
        let url;

        if (type == "entreprise") {
            url = "/accounts/my/producteur/all/withadmin";
        } else if (type == "consultant") {
            url = "/accounts/my/consultant/producteur/all/withadmin";
        } else if (type == "admin") {
            url = "/accounts/producteur/all";
        }

        return this.init().get(url);
    };


}