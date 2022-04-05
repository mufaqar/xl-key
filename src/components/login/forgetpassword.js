import 'bootstrap/dist/css/bootstrap.css';
import background from "../../public/img/Login.png"
import Logo from "../../public/img/Logo.png"
import React from 'react';
import "./index.css";
import useTranslation from "../customHooks/translations";
import LanguageHandler from "../LanguageHandler";
import getLanguage from "../customHooks/get-language";

const leftCol = {
  display: 'inline-block',
  height: '100vh'
}
const rightCol = {
  backgroundImage: 'url(' + background + ')',
  height: 'inherit',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  display: 'inline-block',
  backgroundPosition: 'center'
}
const flexDiv = {
  display: 'flex'
}
const headerBackRoundColour = {
  color: '#205482'
}
const logoStyle = {
  paddingBottom: '13vh'
}
function withLanguageHook(Component) {
  return function WrappedComponent(props) {
    const translation = useTranslation();
    const language = getLanguage();
    return <Component {...props} translation={translation} language={language}/>;
  }
}
class forgetpassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      password: null,
      lang: this.props.language,
      errors: null
    }
  }
  handleSubmit = async event => {
    event.preventDefault()
    this.setState({ lang: this.props.language });
    const data = this.state;
    data.lang = this.props.language;
    const isFrench = this.props.language == "FR";
    let errors = null;

    try {
      const response = await fetch(process.env.REACT_APP_API_URL + "auth/forget-password",
        {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "lang": this.state.lang,
          },
          body: JSON.stringify(data)
        });
      const responseData = await response.json();
      errors = responseData.message;
    } catch (error) {
      console.log("DATA error", error.response);
      errors = isFrench ? "Quelque chose a mal tourné" : "Something went wrong";
    }
    this.setState({ errors: errors });
  }
  handleInputChage = (event) => {
    event.preventDefault()
    this.setState({
      [event.target.id]: event.target.value,
    })
  }
  exampleMethod() {
    console.log("Js is running");
  }

  componentDidMount() {
    fetch('/api')
      .then(response => response.json())
      .then(data => this.setState({ totalReactPackages: data.total }));
  }

  render() {
    const { totalReactPackages } = this.state;


    const translation = this.props.translation;
    return (
      <div style={flexDiv}>
        <div className="col-md-6 col-lg-6" style={leftCol}>
          <div className="login d-flex align-items-center py-5">

            <div className="container">

              <div className="row">
                <div className="col-md-9 col-lg-8 mx-auto">
                  <img src={Logo} style={logoStyle} />
                  <h3 className="login-heading mb-4 " style={headerBackRoundColour}>{translation.Forgot_your_password} </h3>


                  <form onSubmit={this.handleSubmit}>
                    <div className="form-label-group">
                      <label className="loginfontcolour" htmlFor="inputEmail">{translation.Email}</label>
                      <input type="email" id="username" className="form-control" name='username' placeholder="adresse@gmail.com" onChange={this.handleInputChage} required autoFocus />

                    </div>

                    <span style={{ color: "red" }}>{this.state.errors}</span>
                    <button className="btn btn-lg btn-primary btn-block btn-login loginbuttonaligment" type="submit">{translation.Forgot_password_button}</button>
                    <div className="btn btn-lg btn-block btn-login loginbuttonaligment">
                      <LanguageHandler />
                    </div>


                  </form>

                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="d-none d-md-flex col-md-6 col-lg-6" style={rightCol}>

          {/* <img src={background} ></img> */}
        </div>
      </div>
    )

  }
}

export default withLanguageHook(forgetpassword);