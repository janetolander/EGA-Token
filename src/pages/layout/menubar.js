import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import axios from 'axios';
// We import bootstrap to make our application look better.
import "bootstrap/dist/css/bootstrap.css";
import "../../assets/css/common.css";
import './layout.scss'
import { logoutUser } from "../../actions/authActions";
import { getTotalInfo } from "../../actions/tokenActions";
import { getCurrentPrice } from "../../actions/tokenPriceActions";
import {BACKEND_URL} from '../../global/config'


 
// Here, we display our Navbar
class MenuBar extends Component {
    constructor() {
        super();
        this.state = {
            gahPrice : 0,
            windowWidth : window.innerWidth,
        }
    }

    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };

  render() {
    const { user } = this.props.auth;
    const { tokenprice } = this.props.tokenprice;
    const { userauth } = this.props.userauth;
  return (
    <div>
        <div className="position-relative">
            <nav className="nav navbar navbar-expand-lg navbar-light iq-navbar border-bottom" style={{minHeight:65, padding:0}}>
                <div className="container-fluid navbar-inner" style={{padding:0}}>
                    
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" style={{float:'right'}}>
                        <span className="navbar-toggler-icon">
                            <span className="navbar-toggler-bar bar1 mt-2"></span>
                            <span className="navbar-toggler-bar bar2"></span>
                            <span className="navbar-toggler-bar bar3"></span>
                        </span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent" style={{background:'#303032', margin:'auto'}}>
                        <ul className="navbar-nav ms-auto navbar-list mb-2 mb-lg-0 align-items-center" style={{textAlign: 'center',display:this.state.windowWidth<990?'flex':'', flexDirection:this.state.windowWidth<990?'column':'', float:this.state.windowWidth>990?'right':'inherit'}}>
                            <li className="nav-item " style={{fontSize:20, color:'#1eff12', fontWeight:700}}>
                                1 GAH = {tokenprice.prices?(Number(tokenprice.prices.egaPrice) + Number(tokenprice.addingValue[0].ega)).toFixed(8) : 0} USD
                            </li>
                            <li className="nav-item" style={{fontSize:20, color:'#1eff12', fontWeight:700}}>
                                1 EFRANC = {tokenprice.prices?tokenprice.prices.mosPrice:0} EUR
                            </li>
                        </ul>                        
                        <ul className="navbar-nav ms-auto navbar-list mb-2 mb-lg-0 align-items-center" style={{textAlign: 'center',display:this.state.windowWidth<990?'flex':'', flexDirection:this.state.windowWidth<990?'column':'', float:this.state.windowWidth>990?'right':'inherit'}}>
                            <li className="nav-item " style={{padding:0}}>
                                <NavLink className="dropdown-item" to="/home">Home</NavLink>
                            </li>
                            <li className="nav-item " style={{padding:0}}>
                                <NavLink className="dropdown-item" to="/tokenbuy">Token Buying</NavLink>
                            </li>
                            
                            <li className="nav-item " style={{padding:0}}>
                                <NavLink className="dropdown-item" to="/tokensell">Token Sale</NavLink>
                            </li>
                            
                            <li className="nav-item " style={{padding:0}}>
                                <NavLink className="dropdown-item" to="/tokenswap">Token Swap</NavLink>
                            </li>
                            <li className="nav-item " style={{padding:0}}>
                                <NavLink className="dropdown-item" to="/tokensend">Token Send</NavLink>
                            </li>
                            
                            <li className="nav-item dropdown">
                                <a className="nav-link py-0 d-flex align-items-center" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <img src={user.avatar?`${BACKEND_URL}/${user.avatar}`:''} alt="User-Profile" className="img-fluid avatar avatar-50 avatar-rounded"/>
                                    <div className="caption ms-3 ">
                                        <h6 className="mb-0 caption-title">{user.name}</h6>
                                        {/* <p className="mb-0 caption-sub-title">Super Admin</p> */}
                                        <p className="mb-0 caption-sub-title" style={{fontSize:12}}>{"gah-" + user.id}</p>
                                    </div>
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                    <li className="border-0"><NavLink className="dropdown-item" to="/profile">My Profile</NavLink></li>
                                    <li className="border-0"><NavLink className="dropdown-item" to="/wallet">My Wallet</NavLink></li>
                                    <li className="border-0"><hr className="m-0 dropdown-divider"/></li>
                                    <li className="border-0"><a className="dropdown-item" href="#" onClick={this.onLogoutClick}>Logout</a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    </div>
  );
  }
};
 
MenuBar.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    token: PropTypes.object.isRequired,
    tokenprice: PropTypes.object.isRequired,
    userauth : PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    token: state.token,
    tokenprice: state.tokenprice,
    userauth:state.userauth
});

export default connect(
    mapStateToProps,
    { logoutUser, getTotalInfo, getCurrentPrice }
)(MenuBar);