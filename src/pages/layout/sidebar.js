import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
// We import bootstrap to make our application look better.
import "bootstrap/dist/css/bootstrap.css";
import "../../assets/css/common.css";
import './layout.scss'

import axios from 'axios';
import {SERVER_MAIN_URL} from '../../config'

 
// Here, we display our Navbar
class SideBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed : false
        }
    this.toggleCollapse = this.toggleCollapse.bind(this);
    }

  toggleCollapse(e){
    e.preventDefault()
      let currentCollapsed = this.state.collapsed;
      this.setState({collapsed : !currentCollapsed});
  }
  render() {
     let  tokenInfo  = this.props.token.token;

  return (
    <div>
        <div className="nav">
            <div className="sidebar-toggle" data-toggle="sidebar" data-active="true">
                <i className="icon" onClick={this.toggleCollapse}>
                <svg width="20px" height="20px" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z" />
                </svg>
                </i>
            </div>
        </div>
        <div className="row">
            <div className="col-md-12 col-lg-3 col-sm-12 col-xs-12" >
                <aside className={!this.state.collapsed?"sidebar sidebar-default navs-rounded":"sidebar sidebar-default navs-rounded mincollapsed"} style={{maxHeight:520,overflow:'scroll', maxWidth:window.innerWidth>990?'16.2rem':'99%'}}>
                    
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