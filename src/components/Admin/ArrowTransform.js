import React from 'react';
import arrowIconLeft from "../../public/img/sqr_arrow_icon_left.png"
import arrowIconDown from "../../public/img/sqr_arrow_icon_down.png"
import '../producer/settings/settingsMain.css'

class ArrowTransform extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rotate: false,
      toggle: false
    };
    this.rotatingDone = this.rotatingDone.bind(this);
  }
  componentDidMount() {
    const elm = this.image;
    elm.addEventListener("animationend", this.rotatingDone);
  }
  componentWillUnmount() {
    const elm = this.image;
    elm.removeEventListener("animationend", this.rotatingDone);
  }

  rotatingDone() {
    this.setState(function(state) {
      return {
        toggle: !state.toggle,
        rotate: false
      };
    });
  }
  render() {
    const { rotate, toggle } = this.state;
  
    return (
      <img
        src={
          toggle
            ? arrowIconLeft
            : arrowIconDown
        }
        ref={elm => {
          this.image = elm;
        }}
        
        onClick={toggle?() => this.setState({
           rotate: true ,
            toggle:false
         
          }):() => this.setState({
            rotate: true,
            toggle:true
           })}

        className={rotate && toggle ? "rotate" : "rotate_back"}

      //   onClick={toggle?() => this.setState({
      //     rotate: true ,
      //      toggle:false
        
      //    }):() => this.setState({
      //      rotate: false,
      //      toggle:true
      //     })}

      //  className={rotate && toggle ? "rotate" :  "rotate_back"}
      />
    );
  }
}
export default ArrowTransform
// ReactDOM.render(<ArrowTransform />, document.getElementById("container"));