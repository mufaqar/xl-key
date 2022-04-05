import "bootstrap/dist/css/bootstrap.css";
import background from "../../public/img/Left.png";
import Logo from "../../public/img/logoxl.png";
import google from '../../public/img/google.png'
import apple from '../../public/img/apple.png'
import React from "react";
import "./index.css";
import { connect, useSelector, useDispatch } from "react-redux";
import {
  setLogo,
  getLogo,
  setName,
  getName,
  setLogin,
  setLogout,
  setToken,
  getToken,
  setUserRole,
  getUserRole,
  setLanguage,
} from "../../actions";
import useTranslation from "../customHooks/translations";
import LanguageHandler from "../LanguageHandler";
import getLanguage from "../customHooks/get-language";

const mapStateToProps = (state) => {
  let token = state.token;
  let userRole = state.userRole;
  let isLogged = state.isLogged;

  return { token, userRole, isLogged };
};

function withLanguageHook(Component) {
  return function WrappedComponent(props) {
    const translation = useTranslation();
    const language = getLanguage();
    const dispatch = useDispatch();
    return (
      <Component
        {...props}
        translation={translation}
        language={language}
        dispatch={dispatch}
      />
    );
  };
}

const mapDispatchToProps = {
  setLogo,
  getLogo,
  setName,
  getName,
  setToken,
  setLogin,
  getToken,
  setUserRole,
  getUserRole,
};

const leftCol = {
  display: "inline-block",
  height: "100vh",
};
const rightCol = {
  backgroundImage: "url(" + background + ")",
  height: "inherit",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  // display: "inline-block",
  backgroundPosition: "center",
};
const flexDiv = {
  display: "flex",
};
const headerBackRoundColour = {
  color: "#205482",
};
const logoStyle = {
  paddingBottom: "13vh",
};
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      password: null,
      lang: this.props.language,
      /*...........................................*/
      fields: {},
      errors: {},
      /*...........................................*/
    };
  }

  /*...........................................*/
  handleValidation() {
    const isFrench = this.props.language == "FR";
    console.log(isFrench);
    let fields = this.state;
    let errors = {};
    let formIsValid = true;

    if (!fields["username"]) {
      formIsValid = false;
      errors["email"] = isFrench ? "L'e-mail est requis" : "Email is required";
    } else {
      let lastAtPos = fields["username"].lastIndexOf("@");
      let lastDotPos = fields["username"].lastIndexOf(".");

      if (
        !(
          lastAtPos < lastDotPos &&
          lastAtPos > 0 &&
          fields["username"].indexOf("@@") == -1 &&
          lastDotPos > 2 &&
          fields["username"].length - lastDotPos > 2
        )
      ) {
        formIsValid = false;
        errors["email"] = isFrench
          ? "L'email n'est pas valide"
          : "Email is not valid";
      }
    }

    if (!fields["password"]) {
      formIsValid = false;
      errors["password"] = isFrench
        ? "Mot de passe requis"
        : "Password required";
    }

    this.setState({ errors: errors });
    return formIsValid;
  }
  /*...........................................*/

  handleSubmit = async (event) => {
    event.preventDefault();
    this.setState({ lang: this.props.language });
    const data = this.state;
    data.lang = this.props.language;
    const isFrench = this.props.language == "FR";
    let errors = {};
    /*...........................................*/
    if (this.handleValidation()) {
      // alert("Form submitted");
      try {
        const response = await fetch(
          process.env.REACT_APP_API_URL + "auth/signin",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              // "lang" : this.state.lang
            },

            body: JSON.stringify(data),
          }
        );

        console.log("status==>  ", response.status);

        const responseData = await response.json();
        console.log("responseData ", responseData);

        if (response.status === 200) {
          console.log("SUCCESSS 200");

          const userRoleArray = responseData.data.roles;
          const user_fullname = responseData.data.name;
          const user_account_logo = responseData.data.logo;
          const userToken = responseData.data.accessToken;
          console.log("userRole with data", responseData.data);
          this.props.setLogin();
          console.log("user_fullname", user_fullname);
          console.log("user_account_logo", user_account_logo);
          console.log(
            "responseData.data.language_pref",
            responseData.data.language_pref
          );
          const dispatch = this.props.dispatch;
          dispatch(setLanguage(responseData.data.language_pref));
          // this.props.updateLanguage(responseData.data.language_pref);
          // updateLanguage(responseData.data.language_pref);

          if (userRoleArray.includes("ROLE_ADMIN")) {
            this.props.setUserRole("ROLE_ADMIN");
            this.props.setToken(userToken);
            this.props.setName(user_fullname);
            this.props.setLogo(user_account_logo);
            this.props.history.push("/admin/dashboard");
          } else if (userRoleArray.includes("ROLE_ENTREPRISE")) {
            this.props.setUserRole("ROLE_ENTREPRISE");
            this.props.setToken(userToken);
            this.props.setName(user_fullname);
            this.props.setLogo(user_account_logo);
            this.props.history.push("/entreprise/dashboard");
          } else if (userRoleArray.includes("ROLE_CONSULTANT")) {
            this.props.setUserRole("ROLE_CONSULTANT");
            this.props.setToken(userToken);
            this.props.setName(user_fullname);
            this.props.setLogo(user_account_logo);
            this.props.history.push("/consultant/dashboard");
          } else if (userRoleArray.includes("ROLE_PRODUCTEUR")) {
            this.props.setUserRole("ROLE_PRODUCTEUR");
            this.props.setToken(userToken);
            this.props.setName(user_fullname);
            this.props.setLogo(user_account_logo);
            this.props.history.push("/producteur/dashboard");
          } else {
            errors["message"] = isFrench
              ? "Aucun niveau d'accès n'est trouvé pour vos identifiants"
              : "No access level is found for your identifiers";
          }
        } else if (response.status === 401) {
          console.log("SOMETHING WENT WRONG");
          errors["message"] = responseData.message;

          // this.setState({ requestFailed: true })
        } else if (response.status === 403) {
          console.log("Quelque chose a mal tourné");
          errors["message"] = responseData.message;
          // this.setState({ requestFailed: true })
        } else {
          errors["message"] = responseData.message;
        }

        console.log("DATA status", response.status);
      } catch (error) {
        console.log("DATA error", error.response);
        errors["message"] = isFrench
          ? "Quelque chose a mal tourné"
          : "Something went wrong";
      }

      this.setState({ errors: errors });
      // this.setState({ errors })
      // this.props.history.push('/producteur/dashboard')
    } else {
      // alert("Form has errors.")
    }
    /*...........................................*/

    console.log("Final Data is", data);

    // this.props.history.push('/producteur/dashboard')
  };

  /*...........................................*/
  handleChange(field, e) {
    let fields = this.state.fields;
    fields[field] = e.target.value;
    this.setState({ fields });
  }
  /*...........................................*/

  handleInputChage = (event) => {
    event.preventDefault();
    this.setState({
      [event.target.id]: event.target.value,
    });
  };

  exampleMethod() {
    console.log("Js is running");
  }

  componentDidMount() {
    /* fetch('/api')
      .then(response => response.json())
      .then(data => this.setState({ totalReactPackages: data.total })); */
  }

  render() {
    //const { totalReactPackages } = this.state;
    // console.log("isLogged ", this.props.isLogged);
    // console.log("userToken ", this.props.token);
    // console.log("userRole ", this.props.userRole);
    const translation = this.props.translation;
    return (
      <div className="grid items-center justify-center h-screen grid-col-1 lg:grid-cols-3">
        <div style={rightCol} className="hidden lg:block">
          {/* <img src={background} className="w-full" /> */}
        </div>
        <div className="flex justify-center w-full lg:col-span-2">

          <div className="px-10 lg:w-96 lg:px-0">
            <div className="flex justify-center mb-8 lg:hidden">
              <img src={Logo} alt="logo" />
            </div>
            <h3 className="text-4xl font-bold text-center md:text-5xl lg:text-6xl"> 
            {/* {translation.Connection}  */}Connexion
            </h3>
            <p className="text-base font-normal text-center">
              {/* {translation.Access_to_your_space} */}
              Complétez les informations suivantes
            </p>

            <form onSubmit={this.handleSubmit}>
              <div className="">
                <label className="px-2 ml-3 text-gray-400 bg-white" htmlFor="inputEmail">
                  {/* {translation.Email} */} Mail
                </label>
                {/* <input type="email" id="username" className="form-control" name='username' placeholder="adresse@gmail.com" onChange={this.handleInputChage} required autoFocus /> */}

                <input
                  ref="email"
                  type="text"
                  id="username"
                  className="block w-full -mt-5 p-[10px] pl-3 border-2 border-gray-300 rounded-[10px] outline-none"
                  name="username"
                  placeholder="user@gmail.com"
                  onChange={this.handleInputChage}
                  value={this.state.fields["email"]}
                />
                <span style={{ color: "red" }}>
                  {this.state.errors["email"]}
                </span>
              </div>

              <div className="mt-3">
                <label
                  htmlFor="inputPassword"
                  className="px-2 ml-3 text-gray-400 bg-white"
                >
                  {translation.Password}
                </label>
                <input
                  ref="password"
                  type="password"
                  id="password"
                  className="block w-full -mt-5 p-[10px] pl-3 border-2 border-gray-300 rounded-[10px] outline-none"
                  placeholder="******"
                  name="password"
                  onChange={this.handleInputChage}
                  value={this.state.fields["password"]}
                />
                <span style={{ color: "red" }}>
                  {this.state.errors["password"]}
                </span>
              </div>

              <div className="flex justify-between mt-3">
                <div className="">
                    <input type="checkbox" name="memories" className="border border-gray-400 outline-none" />
                    <label htmlFor="inputMemories" className="px-2 ml-2 text-sm text-gray-400 bg-white">Mémoriser pendant 30 jours</label>
                </div>

                <a href="/login/forgetpassword">
                  <label className="text-sm text-gray-400 cursor-pointer ">
                    {/* {translation.Forgot_your_password} */}Forgot Password
                  </label>
                </a>
              </div>

              

              <span style={{ color: "red" }}>
                {this.state.errors["message"]}
              </span>
              {/* <button className="mb-2 btn btn-lg btn-primary btn-block btn-login text-uppercase font-weight-bold loginbuttonaligment" type="submit">Se connecter</button> */}

              <button
                className="w-full py-[10px] mt-[10px] cursor-pointer hover:bg-gray-900 text-white bg-orange-400 rounded-lg"
                type="submit"
              >
                {/* {translation.Log_in} */}Connexion
              </button>

              <div className="flex justify-between mt-4 space-x-3">
                <button className="flex items-center w-full justify-center pb-2 border-[1px] border-gray-400 rounded-[9px]">
                  <img src={google} alt="google" className="w-5 h-5" />
                  <span className="mt-2">Google</span>
                </button>
                <button className="flex items-center w-full justify-center pb-2 bg-gray-800 rounded-[9px]">
                  <img src={apple} alt="google" className="w-5 h-5" />
                  <span className="mt-2 text-white">Apple</span>
                </button>
              </div>

              <div className="mt-16 text-center">

                <label className="text-sm text-gray-500">
                {translation.Don_t_have_an_account} <a href="#" className="text-gray-500 underline"> {translation.Click_here} {translation.for_more_information}</a>
                </label>
                
                {/* <div className="btn btn-lg btn-block btn-login">
                  <LanguageHandler />
                </div> */}
                
              </div>
            </form>
          </div>
        </div>

      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withLanguageHook(Login));
