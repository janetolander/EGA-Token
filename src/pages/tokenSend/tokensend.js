import React, { useState, useEffect } from 'react';
import {useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormControl from '@material-ui/core/FormControl';

import Header from "../layout/header";
import SideBar from "../layout/sidebar";
import './index.scss'

import {BACKEND_URL} from '../../global/config'

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    button: {
        margin: theme.spacing(1),
    },
    root: {
        '& > *': {
        margin: theme.spacing(1),
        width: '25ch',
    },
  },
}));

// const stripePromise = loadStripe("pk_test_51IzTMJF1cOJreNKh78LrrhTY7mYt7NpOnSSKfYjoJtttFvAchGI4IuYGJDbQU3E5PwToWFbSV6g4iZE2JQhkKMDn00VDqjegXn");


export default function TokenSend() {
  const { user } = useSelector(state => state.auth);
  console.log('current users info is ', user)
  const classes = useStyles();

  const [amount, setAmount] = useState(0);
  const [address, setAddress] = useState('');

  const [mosBalance, setMosBalance] = useState(0);
  const [disabledBTN, setDisabledBTN] = useState('disabled');
  const [displayerr, setDisplayerr] = useState('none');


  const getCurrentDate = () => {
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
  
  const getBalanceData = () =>{
    axios
      .get(`${BACKEND_URL}/getwalletbalance/gah-${user.id}`)
      .then((response) => {
        setMosBalance(Number(response.data.mos));
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const savingToDatabase = () => {
    var datetime =  getCurrentDate();
    const transactionData = {
        personName:user.name,
        walletAddress:'gah-' + user.id,
        toWalletAddress: address,
        tranDate:datetime,
        tokenName:'e-franc',
        tranType:'SEND',
        amount : amount
    }
    axios
        .post(`${BACKEND_URL}/record/tranadd`, transactionData)
        .then(res =>{
            alert('Your transferring is successful !')
            getBalanceData()
        }
            
        ).catch(err =>{
            
            alert('Sorry, Your transferring is failed.')
        }
        
    );
  }

  const onChangeAmount = e => {
    setAmount(e.target.value);
    
    if(e.target.value > mosBalance){
        setDisabledBTN('disabled');
        setDisplayerr('');
    }else{
        setDisabledBTN('');
        setDisplayerr('none');
    }

  }

  const onChangeAddress = e => {
    setAddress(e.target.value);
  }


const handleSubmit =(e) =>{
    e.preventDefault();
    savingToDatabase();  
}

useEffect(()=>{
    getBalanceData();
}, [])

  return (
    <div>
        <Header />
        <SideBar />
        <div className='row' style={{minHeight:680, minWidth:'100%', paddingLeft:'17%', paddingTop:245}}>
            
            <form style={{width:'75%', margin:'auto', marginTop:15}} onSubmit={handleSubmit}>
                <div className='card'>
                    <div className='card-header-tb'>
                        Token Sending 
                    </div>
                    <div className='card-body'>
                        <div className="row">
                            <div className='col-lg-7'>
                                <p style={{color:'green'}}>* E-FRANC balance in Your Wallet : {mosBalance} EFRANC</p>
                            </div>
                        </div>
                        <div style={{width:'100%'}}>
                            <div className='row'>
                                <div className='col-lg-3' style={{textAlign:'right'}}>
                                    <p>Amount : </p>
                                </div>
                                <div className='col-lg-5'>
                                    <TextField id="amount" className='form-control' type="number" variant="outlined" value={amount} onChange={onChangeAmount} min={50}/>
                                </div>
                                <div className='col-lg-2'>
                                    <p>EFRANC</p>
                                </div>
                            </div>    
                        </div>
                        <div>
                            <p style={{color:'#ff0000', display:displayerr}} >* Invalid amount because it's more than the balance in your wallet. </p>
                        </div>
                        <br/>
                        <div>
                            <div className='row'>
                                <div className='col-md-3' style={{textAlign:'right'}}>
                                    <p>To Address : </p>
                                </div>
                                <div className='col-md-7'>
                                    <TextField id="toAddress" className='form-control' type="text" variant="outlined" value={address} onChange={onChangeAddress}/>
                                </div>
                            </div>   
                        </div>

                    </div>
                    <div className='card-footer'>
                        <button type="submit" className="btn btn-primary" disabled={disabledBTN}>Send</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
  );
}