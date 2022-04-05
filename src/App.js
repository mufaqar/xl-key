// Note: Uncomment import lines during working with JSX Compiler.
import 'bootstrap/dist/css/bootstrap.css';
import background from "./public/img/Login.png"
import React from 'react';
import './index.css'

const appStyle = {

    };
    
    const formStyle = {
        margin: 'auto',
        padding: '10px',
        border: '1px solid #c9c9c9',
        borderRadius: '5px',
        background: '#f5f5f5',
        width: '220px',
      display: 'block'
    };
    
    const labelStyle = {
        margin: '10px 0 5px 0',
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: '15px',
    };
    
    const header = {
        margin: 'auto',
        padding: '10px',
        fontFamily: 'Arial, Helvetica, sans-serif',
        width: '220px',
      display: 'block'
    };
    
    const inputStyle = {
        margin: '5px 0 10px 0',
        padding: '5px',
        border: '1px solid #bfbfbf',
        borderRadius: '3px',
        boxSizing: 'border-box',
        width: '100%'
    };
    
    const submitStyle = {
        margin: '10px 0 0 0',
        padding: '7px 10px',
        border: '1px solid #efffff',
        borderRadius: '3px',
        background: '#3085d6',
        width: '100%',
        fontSize: '15px',
        color: 'white',
        display: 'block'
    };
    const leftCol ={
      display: 'inline-block',
      height: '100vh'
    }
    const rightCol={
      backgroundImage: 'url(' + background + ')',
      height: 'inherit',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      display: 'inline-block',
      backgroundPosition: 'center'
    }
    const flexDiv={
      display: 'flex'
    }
    // const Extrasmalldevices = useMediaQuery({query: '(max-width: 600px)'})
    // const Smalldevicesportrait = useMediaQuery({query: '(min-width: 600px)'});
    // const Mediumdevices = useMediaQuery({query: '(min-width: 768px)'});
    // const Largedevices = useMediaQuery({query: '(min-width: 992px)'});
    // const Extralargedevices = useMediaQuery({query: '(min-width: 1200px)'});
    // const isBigScreen = useMediaQuery({ query: '(min-width: 1824px)' })
    // const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
    // const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })
    // const isRetina = useMediaQuery({ query: '(min-resolution: 2dppx)' })
    const Field = React.forwardRef(({label, type}, ref) => {
        return (
          <div >

            <div class="col-md-6">
            <label style={labelStyle} >{label}</label>
            <input ref={ref} type={type} style={inputStyle} />
            </div>
          </div>
        );
    });
    
    const Form = ({onSubmit}) => {
        const usernameRef = React.useRef();
        const passwordRef = React.useRef();
        const handleSubmit = e => {
            e.preventDefault();
            const data = {
                username: usernameRef.current.value,
                password: passwordRef.current.value
            };
            onSubmit(data);
        };
        return (
         <div style={flexDiv}>
            <div class="col-md-6 col-lg-6" style={leftCol}>
            <div class="login d-flex align-items-center py-5">
              
            <div class="container">
          <div class="row">
          <div class="col-md-9 col-lg-8 mx-auto">
          <h3 class="login-heading mb-4">Welcome back!</h3>
          <form>
          <div class="form-label-group">
                  <input type="email" id="inputEmail" class="form-control" placeholder="Email address" required autofocus />
                  <label for="inputEmail">Email address</label>
                </div>
                <div class="form-label-group">
                  <input type="password" id="inputPassword" class="form-control" placeholder="Password" required />
                  <label for="inputPassword">Password</label>
                </div>

                <div class="custom-control custom-checkbox mb-3">
                  <input type="checkbox" class="custom-control-input" id="customCheck1" />
                  <label class="custom-control-label" for="customCheck1">Remember password</label>
                </div>
                <button class="btn btn-lg btn-primary btn-block btn-login text-uppercase font-weight-bold mb-2" type="submit">Sign in</button>
                <div class="text-center">
                  <a class="small" href="#">Forgot password?</a></div>
          </form>
            </div>
            </div>
            </div>
            </div>
           </div>
           <div class="d-none d-md-flex col-md-6 col-lg-6" style={rightCol}>
           
           {/* <img src={background} ></img> */}
           </div>
         </div>

        );
    };
    
    // Usage example:
    
    const App = () => {
        const handleSubmit = data => {
            const json = JSON.stringify(data, null, 4);
           
        };
        return (
          <div >
            <Form onSubmit={handleSubmit} />
          </div>
        );
    };
    export default App; 
  