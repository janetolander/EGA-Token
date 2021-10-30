import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
// We import bootstrap to make our application look better.
import "bootstrap/dist/css/bootstrap.css";
import "../../assets/css/common.css";
import './index.scss'
import headerLogo from "../../assets/images/gahCion.png"

import MenuBar from "./menubar"

 
// Here, we display our Navbar
class Header extends Component {
   
  render() {
    const { user } = this.props.auth;
  return (
    <div className="container" style={{ minWidth:'100%',backgroundColor:'#262626', zIndex:910, position:'fixed', paddingLeft:0, paddingRight:0}}>
        <header style={{ minWidth:'100%', minHeight:120, position:'relative'}}>
          
          <a target="_blank" rel="noopener noreferrer" href="#">
            <img alt='Coin Panel Logo' lazy="true" src={headerLogo} style={{width:'18%'}}/>
            GAH-TOKEN Current Price
          </a>
        </header>
        <MenuBar />
    </div>
  );
  }
};
 
Header.propTypes = {
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps
)(Header);