import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
// We import bootstrap to make our application look better.
import "bootstrap/dist/css/bootstrap.css";
import "../../assets/css/common.css";
import './index.scss'

import axios from 'axios';
import {SERVER_MAIN_URL} from '../../config'

 
// Here, we display our Navbar
class SideBar extends Component {
    constructor(props) {
        super(props);
      }

  render() {
     let  tokenInfo  = this.props.token.token;
  return (
    <div className="row">
        <div className="col-md-3 col-lg-3 col-sm-12 col-xs-12" >
        <aside className="sidebar sidebar-default navs-rounded " style={{maxHeight:520,overflow:'scroll'}}>
            
            <ul className="navbar-nav ms-auto navbar-list mb-2 mb-lg-0 align-items-center">
                <li className="nav-item ">
                        &nbsp;
                </li>
                <li className="nav-item " style={{textAlign:'center'}}>
                    <p>GAH Total Supply:</p>
                    <p style={{color:'#1eff12', fontSize:22}}>{tokenInfo?tokenInfo.data.gahTotalSupply:0}</p>
                </li>
                <li className="nav-item " style={{textAlign:'center'}}>
                    <p>Distributed GAH:</p>
                    <p  style={{color:'#1eff12', fontSize:22}}>{tokenInfo?tokenInfo.data.gahDistributes:0}</p>
                </li>
                <li className="nav-item " style={{textAlign:'center'}}>
                    <p>GAH Balance:</p>
                    <p style={{color:'#1eff12', fontSize:22}}>{tokenInfo?tokenInfo.data.gahBalance:0}</p>
                </li>
                <li className="nav-item ">
                        &nbsp;
                </li>
                <li className="nav-item " style={{textAlign:'center'}}>
                    <p>E-FRANC Total Supply:</p>
                    <p style={{color:'#1eff12', fontSize:22}}>{tokenInfo?tokenInfo.data.mosTotalSupply:0}</p>
                </li>
                <li className="nav-item " style={{textAlign:'center'}}>
                    <p>Distributed E-FRANC :</p>
                    <p  style={{color:'#1eff12', fontSize:22}}>{tokenInfo?tokenInfo.data.mosDistributes:0}</p>
                </li>
                <li className="nav-item " style={{textAlign:'center'}}>
                    <p>E-FRAC Balance:</p>
                    <p style={{color:'#1eff12', fontSize:22}}>{tokenInfo?tokenInfo.data.mosBalance:0}</p>
                </li>
            </ul>
        </aside>
        </div>
    </div>
  );
  }
};
 
SideBar.propTypes = {
    auth: PropTypes.object.isRequired,
    token: PropTypes.object.isRequired,
    tokenprice: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    records: state.records,
    token: state.token,
    tokenprice: state.tokenprice
});

export default connect(
    mapStateToProps
)(SideBar);