import React, { Component } from "react";
// This will require to npm install axios
import axios from 'axios';
import PropTypes from "prop-types";
import {connect} from "react-redux";

import 'react-confirm-alert/src/react-confirm-alert.css';
import Header from "../layout/header";
import SideBar from "../layout/sidebar";
import {SERVER_MAIN_URL} from '../../config'
import "../../assets/css/common.css";

import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import {BACKEND_URL} from '../../global/config'

class TokenSell extends Component {
  // This is the constructor that shall store our data retrieved from the database
 
  constructor(props) {
    super(props);
    this.state = { 
      ega_usd: '',
      ega_btc:0,
      salelimit: 0,
      limitega: 0,
      mins:0,
      mosAmount : 0,
      usdAmount : 0,
      eurAmount : 0,
      btcAmount : 0,
      mos_eur:0,
      mos_usd:0,
      mos_btc:0,
      opening:false,
      radioValue:'paypal',
      address : '',
      mosBalance:0,
      disbaledBTN:'',
      displayerr1:'none',
      displayerr2:'none',
      errors: {}
    };
    this.getData = this.getData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleModalSubmit = this.handleModalSubmit.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.savingToDatabase = this.savingToDatabase.bind(this);

    this.user = this.props.auth;
    
  }

  getCurrentDate = () => {
    var today = new Date();
    var thisyear = today.getFullYear();
    var thisMonth = today.getMonth()<9?'0'+(today.getMonth() + 1):(today.getMonth() + 1);
    var thisDay = today.getDate()<10?'0'+(today.getDate()):today.getDate();
    var thisMonthToday = thisyear+'-'+thisMonth+'-'+thisDay;
    var Hours = today.getHours()<10?'0'+today.getHours():today.getHours();
    var Minutes = today.getMinutes()<10?'0'+today.getMinutes():today.getMinutes();
    var Seconds = today.getSeconds()<10?'0'+today.getSeconds():today.getSeconds();
    var time = Hours+ ":" + Minutes + ":" + Seconds;
    var currentDateTime = thisMonthToday + 'T' + time + 'Z';
    return currentDateTime ;
  }
  
  onChangeMOS = e => {
    this.setState({ mosAmount: e.target.value });
    var mos_usd =  this.state.mos_usd;
    var mos_eur = this.state.mos_eur;
    var mos_btc = this.state.mos_btc;
    var usd_amount = Number(e.target.value) * mos_usd;
    var eur_amount = Number(e.target.value) * mos_eur;
    var btc_amount = Number(e.target.value) * mos_btc;
    this.setState({ usdAmount : usd_amount.toFixed(6) });
    this.setState({ eurAmount : eur_amount.toFixed(6) });
    this.setState({ btcAmount : btc_amount.toFixed(6) });
    if(e.target.value > this.state.mosBalance) {
      this.setState({disbaledBTN:'disabled', displayerr1:'', displayerr2:'none'});
      if(e.target.value > Number(this.state.limitega))
        this.setState({disbaledBTN:'disabled', displayerr1:'', displayerr2:''});
    } else if(e.target.value < Number(this.state.mins)){
      this.setState({disbaledBTN:'disabled', displayerr1:'none', displayerr2:''});
    } 
    else {
      this.setState({disbaledBTN:'', displayerr1:'none', displayerr2:'none'})
    }   
  }

  onChangeBTC = e => {
    this.setState({ btcAmount: e.target.value });
    var mos_usd =  this.state.mos_usd;
    var mos_eur = this.state.mos_eur;
    var mos_btc = this.state.mos_btc;
    var mos_amount = Number(e.target.value) / mos_btc;
    var eur_amount = mos_amount * mos_eur;
    var usd_amount = mos_amount * mos_usd;
    this.setState({ mosAmount : mos_amount.toFixed(6) })
    this.setState({ eurAmount : eur_amount.toFixed(6) })
    this.setState({ usdAmount : usd_amount.toFixed(6) })
    if(mos_amount > this.state.mosBalance) {
      this.setState({disbaledBTN:'disabled', displayerr1:'', displayerr2:'none'});
      if(mos_amount > Number(this.state.limitega))
        this.setState({disbaledBTN:'disabled', displayerr1:'', displayerr2:''});
    }
    else if(mos_amount < Number(this.state.mins)){
      this.setState({disbaledBTN:'disabled', displayerr1:'none', displayerr2:''});
    }  
    else {
      this.setState({disbaledBTN:'', displayerr1:'none', displayerr2:'none'})
    }
  }

  onChangeUSD = e => {
    this.setState({ usdAmount: e.target.value });
    var mos_usd =  this.state.mos_usd;
    var mos_eur = this.state.mos_eur;
    var mos_btc = this.state.mos_btc;
    var mos_amount = Number(e.target.value) / mos_usd;
    var eur_amount = mos_amount * mos_eur;
    var btc_amount = mos_amount * mos_btc;
    this.setState({ mosAmount : mos_amount.toFixed(6) });
    this.setState({ eurAmount : eur_amount.toFixed(6) });
    this.setState({ btcAmount : btc_amount.toFixed(6) });
    if(mos_amount > this.state.mosBalance) {
      this.setState({disbaledBTN:'disabled', displayerr1:'', displayerr2:'none'});
      if(mos_amount > Number(this.state.limitega))
        this.setState({disbaledBTN:'disabled', displayerr1:'none', displayerr2:''});
    } 
    else if(mos_amount < Number(this.state.mins)){
      this.setState({disbaledBTN:'disabled', displayerr1:'', displayerr2:''});
    } 
    else {
      this.setState({disbaledBTN:'', displayerr1:'none', displayerr2:'none'})
    }
  }

  onChangeEUR = e => {
    this.setState({ eurAmount: e.target.value });
    var mos_usd =  this.state.mos_usd;
    var mos_eur = this.state.mos_eur;
    var mos_btc = this.state.mos_btc;
    
    var mos_amount = Number(e.target.value) / mos_eur;
    var usd_amount = mos_amount * mos_usd;
    var btc_amount = mos_amount * mos_btc;
    this.setState({ mosAmount : mos_amount.toFixed(6) })
    this.setState({ usdAmount : usd_amount.toFixed(6) })
    this.setState({ btcAmount : btc_amount.toFixed(6) });
    if(mos_amount > this.state.mosBalance) {
      this.setState({disbaledBTN:'disabled', displayerr1:'', displayerr2:'none'});
      if(mos_amount > Number(this.state.limitega))
        this.setState({disbaledBTN:'disabled', displayerr1:'', displayerr2:''});
    } 
    else if(mos_amount < Number(this.state.mins)){
      this.setState({disbaledBTN:'disabled', displayerr1:'none', displayerr2:''});
    } 
    else {
      this.setState({disbaledBTN:'', displayerr1:'none', displayerr2:'none'})
    }
  }
  handleRadio = (event) => {
    this.setState({radioValue:event.target.value});
  };

  onChangeAddress = e => {
    this.setState({address : e.target.value})
  }

  handleSubmit(e){
    e.preventDefault();
   
    if(Number(this.state.mosAmount) > Number(this.state.limitega)){
      alert(`You can sell the your token for maximum ${this.state.salelimit} USD (${this.state.limitega} E-FRANC)`)
    }
    else
    this.handleOpen();
  }

  handleModalSubmit(e){
    e.preventDefault();
    this.savingToDatabase();
  }
  // This method will get the data from the database.
  handleOpen () {
    this.setState({opening:true});
  };

  handleClose () {
    this.setState({opening:false});
  };
  componentDidMount() {
    this.getData();
    this.getBalanceData();
  }

  componentWillReceiveProps(nextProps) {
    this.getData()
    this.getLimitedAmount()
    if (nextProps.errors) {
        this.setState({
            errors: nextProps.errors
        });
    }
  }

  savingToDatabase(){
    var datetime =  this.getCurrentDate();
    const subscriber = this.props.auth.user;
    console.log('subscriber is ', subscriber)
    const subscribeData = {
        subscriber:subscriber.name,
        walletAddress: 'gah-'+subscriber.id,
        subscribeDate:datetime,
        tokenName:'e-franc',
        amount : this.state.mosAmount,
        paymentKind:this.state.radioValue,
        usdPrice:this.state.usdAmount,
        eurPrice:this.state.eurAmount,
        btcPrice:this.state.btcAmount,
        address:this.state.address,
        paymentState:'pending'
    }
    axios
        .post(`${BACKEND_URL}/record/salesubscribe`, subscribeData)
        .then(res =>{
            alert("Your subscribe successfull ! Your subscribe will be approve in 24 hours.")
            this.handleClose();
        }
            
        ).catch(err =>{
            
            alert('Token has some problems. So, you failed to save your token.')
        }
        
    );
  }

  getData(){
    axios
      .get(`${SERVER_MAIN_URL}/currentpairprice/1`)
      .then((response) => {
        console.log('the result of getData method is ', response.data)
        this.setState({ega_usd: Number(response.data[0].ega_usd)});
        this.setState({mos_usd: Number(response.data[0].ega_usd)/Number(response.data[0].ega_mos)});
        this.setState({mos_btc: Number(response.data[0].ega_btc)/Number(response.data[0].ega_mos)});
        this.setState({ega_btc: response.data[0].ega_btc});
        axios
          .get(`${SERVER_MAIN_URL}/limitamount`)
          .then((reslim) => {
            this.setState({salelimit: Number(reslim.data[0].saleMAX)});
            this.setState({mins: Number(reslim.data[0].buyMIN)});
            let limit_ega = (Number(reslim.data[0].saleMAX)/(Number(response.data[0].ega_usd)/Number(response.data[0].ega_mos))).toFixed(6);
            this.setState({ limitega : limit_ega });
            axios
            .get(`${SERVER_MAIN_URL}/tokenprice`)
            .then((resmos) => {
              this.setState({mos_eur: Number(resmos.data[0].mos)});
            })
            .catch(function (error) {
              console.log(error);
            });
          })
          .catch(function (err) {
            console.log(err);
          });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  getBalanceData = () =>{
    axios
      .get(`${BACKEND_URL}/getwalletbalance/gah-${this.user.user.id}`)
      .then((response) => {
        this.setState({mosBalance:Number(response.data.mos)});
      })
      .catch(function (error) {
        console.log(error);
      });
  }


  // This following section will display the table with the records of individuals.
  render() {
    const { user } = this.props.auth;
    return (
      <div>
        <Header />
        <SideBar />
          <div className="container-fluid content-inner pb-0" style={{minHeight:680, minWidth:'100%',margin:'auto', paddingLeft:'17%', paddingTop:245}}>
                <div className="row">
                    <div className="col-sm-10">
                        <div className="card">
                            <div className="card-header-tb" style={{paddingRight:70}}>
                                <h4 className="card-title text-white">Token Sale</h4>
                            </div>
                            <div className='row' style={{paddingLeft:25, paddingTop:25}}>
                              <div className='col-lg-5'>
                                  <p style={{color:'green'}}>* 1 E-FRANC = {(this.state.mos_usd).toFixed(6)} USD </p>
                                  <p style={{color:'green'}}>* 1 E-FRANC = {(this.state.mos_eur)} EURO </p>
                              </div>
                              <div className='col-lg-7'>
                                  <p style={{color:'green'}}>E-FRANC balance : {this.state.mosBalance} EFRANC</p>
                                  <p style={{color:'green'}}>1 EFRANC : {this.state.ega_btc} BTC</p>
                              </div>
                            </div>
                            
                            <div className="d-flex mt-4 ms-4 me-4 justify-content-between" style={{paddingBottom : 20}}>
                            
                              <form onSubmit={this.handleSubmit} style={{width:'100%',margin:'auto'}}>
                                <div className="modal-content">
                                      
                                      <div className="modal-body">
                                      
                                          <div className="form-floating mb-4">
                                              <input type="number" className="form-control" id="mosAmount" placeholder="0" onChange={this.onChangeMOS} value={this.state.mosAmount}/>
                                              <label>E-FRANC</label>
                                          </div>
                                          <div>
                                            <p style={{color:'#ff0000', display:this.state.displayerr1}} >* Invalid amount because it's more than the balance in your wallet. </p>
                                          </div>
                                          <div>
                                            <p style={{color:'#ff0000', display:this.state.displayerr2}} >* Invalid amount because it's more than the maximum amounts or less than minimum amounts. </p>
                                          </div>
                                          <div className="form-floating mb-4">
                                              <input type="number" className="form-control" id="btcAmount" placeholder="0" onChange={this.onChangeBTC} value={this.state.btcAmount}/>
                                              <label>BTC</label>
                                          </div>
                                          <div className="form-floating mb-4">
                                              <input type="number" className="form-control" id="usdAmount" placeholder="0" onChange={this.onChangeUSD} value={this.state.usdAmount}/>
                                              <label>USD</label>
                                          </div>
                                          
                                          <div className="form-floating mb-4">
                                              <input type="number" className="form-control" id="eurAmount" placeholder="0" onChange={this.onChangeEUR} value={this.state.eurAmount}/>
                                              <label>EURO</label>
                                          </div>
                                          <p style={{color:'grey'}}>* You can sell the your token for maximum {this.state.salelimit} USD ({this.state.limitega} EFRANC)</p>
                                          <p style={{color:'grey'}}>* If you would like to sell EFRANC token in BTC, You should the token for minimum {this.state.mins} EFRANC</p>
                                      </div>
                                      <div className="modal-footer">
                                          {/* <button type="button" className="btn btn-secondary" onClick={this.editClose}>Close</button> */}
                                          <button type="submit" className="btn btn-primary" disabled={this.state.disbaledBTN}>Sale Subscribe</button>
                                      </div>
                                </div>
                              </form>
                            </div>
                        </div>
                    </div>
                </div>
          </div>
          <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={this.state.opening}
                onClose={this.handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                timeout: 500,
                }}
                style={{display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',}}
            >
                <Fade in={this.state.opening}>
                  <div style={{width:'55%', backgroundColor:'#262626', color:'white', borderRadius:5, minHeight:450}}>
                    <form style={{width:'100%', margin:'auto'}} onSubmit={this.handleModalSubmit}>
                        <div className='modal-content' style={{width:'100%', textAlign:'center', margin:'auto', padding:40, minHeight:450, borderRadius:5, maxHeight:600, overflowY:'scroll'}}>
                            <div>
                              <h2><span>E-FRANC : </span><span style={{color:'#1eff12'}}>{this.state.mosAmount}</span> <span>EFRANC</span></h2>
                              <h2><span>Price : </span><span style={{color:'#1eff12'}}>{this.state.eurAmount}</span> <span>EURO</span></h2>
                              <h2><span>E-FRANC : </span><span style={{color:'#1eff12'}}>{this.state.usdAmount}</span> <span>USD</span></h2>
                            </div>
                            <div className='modal-body'>
                             
                                <FormControl component="fieldset">
                                    <FormLabel component="legend" style={{color:'green'}}>Select Payment!</FormLabel>
                                    <RadioGroup aria-label="gender" name="gender1" value={this.state.radioValue} onChange={this.handleRadio}>
                                        {/* <FormControlLabel value="stripe" control={<Radio />} label="Credit Cart" /> */}
                                        <FormControlLabel value="paypal" control={<Radio />} label="Paypal" />
                                        <FormControlLabel value="btc" control={<Radio />} label="BitCoin" />
                                    </RadioGroup>
                                </FormControl>
                                <p>Your Name : <span>{user.name}</span></p>
                                <p>Your Wallet Address : <span>{'gah-'+user.id}</span></p>
                                {this.state.radioValue == 'paypal'?
                                  <div className="form-floating mb-4">
                                      <input type="text" className="form-control" id="address" placeholder="0" onChange={this.onChangeAddress} />
                                      <label>Paypal Accont (E-mail Address)</label>
                                  </div>:
                                  <div className="form-floating mb-4">
                                      <input type="text" className="form-control" id="address" placeholder="0" onChange={this.onChangeAddress}/>
                                      <label>BitCoin Wallet Address</label>
                                  </div>
                                }
                            </div>
                            <div className="modal-footer">
                              <button type="submit" className="btn btn-primary">Submit</button>
                            </div>
                          </div>
                        </form>
                    </div>
                </Fade>
            </Modal>
      </div>
    );
  }
}

TokenSell.propTypes = {
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth,
    records: state.records
});

export default connect(
    mapStateToProps
)(TokenSell);
