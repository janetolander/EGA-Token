import React, { useState, useEffect } from 'react';
import {useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@material-ui/core/FormControl';
import Header from "../layout/header";
import SideBar from "../layout/sidebar";
import './tokenswap.scss';
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


export default function TokenSwap() {
  const { user } = useSelector(state => state.auth);
  console.log('current users info is ', user)
  const classes = useStyles();


  const [ega_usd, setEgaUsd] = useState(0);
  const [ega_eur, setEgaEur] = useState(0);
  const [ega_mos, setEgaMos] = useState(0);

  const [selectedFrom, setSelectedFrom] = useState('');
  const [selectedTo, setSelectedTo] = useState('');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');

  const [gahBalance, setGahBalance] = useState(0);
  const [mosBalance, setMosBalance] = useState(0);
  const [disabledBTN, setDisabledBTN] = useState('');
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
  const getData = () =>{
    axios
      .get(`${BACKEND_URL}/currentpairprice/1`)
      .then((response) => {
        console.log('the result of getData method is ', response.data)
        setEgaUsd(Number(response.data[0].ega_usd));
        setEgaMos(Number(response.data[0].ega_mos));
        setEgaEur(Number(response.data[0].ega_eur));
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const getBalanceData = () =>{
    axios
      .get(`${BACKEND_URL}/getwalletbalance/gah-${user.id}`)
      .then((response) => {

        setGahBalance(Number(response.data.gah));
        setMosBalance(Number(response.data.mos));
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  const savingToDatabase = () => {
    var datetime =  getCurrentDate();
    let swappingData = {
        name:user.name,
        walletAddress:'gah-'+user.id,
        fromToken: selectedFrom,
        toToken: selectedTo,
        fromAmount: fromAmount,
        toAmount: toAmount,
        swapDate:datetime
    }
    axios
        .post(`${BACKEND_URL}/record/swapping`, swappingData)
        .then(res =>{
            alert('Your swapping is successful !');
            window.loction.href = '/wallet'
        }
            
        ).catch(err =>{
            
            alert('Token has some problems. So, you failed to save your token.')
        }
        
    );
  }

  const handleChangeSelectFrom = (event) => {
    setSelectedFrom(event.target.value);
    if(event.target.value=='gah') {
        let fromAmountBump = fromAmount;
        setSelectedTo('efranc');
        setToAmount((fromAmountBump*ega_mos).toFixed(5));
        if(fromAmountBump > gahBalance){
            setDisabledBTN('disabled');
            setDisplayerr('');
        }else{
            setDisabledBTN('');
            setDisplayerr('none');
        }
    }
    if(event.target.value=='efranc') {
        setSelectedTo('gah');
        let fromAmountBump = fromAmount;
        setToAmount((fromAmountBump/ega_mos).toFixed(5));
        if(fromAmountBump > mosBalance){
            setDisabledBTN('disabled');
            setDisplayerr('');
        }else{
            setDisabledBTN('');
            setDisplayerr('none');
        }
    }
  }

  const onChangeFromAmount = e => {
    setFromAmount(e.target.value);
    if(selectedFrom == 'gah') {
        setToAmount((e.target.value * ega_mos).toFixed(5))
        if(e.target.value > gahBalance){
            setDisabledBTN('disabled');
            setDisplayerr('');
        }else{
            setDisabledBTN('');
            setDisplayerr('none');
        }
    };
    if(selectedFrom == 'efranc') {
        setToAmount((e.target.value / ega_mos).toFixed(5));
        if(e.target.value > mosBalance){
            setDisabledBTN('disabled');
            setDisplayerr('');
        }else{
            setDisabledBTN('');
            setDisplayerr('none');
        }
    }
  }


const handleSubmit =(e) =>{
    e.preventDefault();
    savingToDatabase();  
}

useEffect(()=>{
    getData();
    getBalanceData();
}, [])

  return (
    <div>
        <Header />
        <SideBar />
        <div className='row' style={{minHeight:680, minWidth:'100%', paddingLeft:'17%', paddingTop:245}}>
            
            <form style={{width:'60%', margin:'auto', marginTop:15}} onSubmit={handleSubmit}>
                <div className='card'>
                    <div className='card-header-tb'>
                        Token Swaping 
                    </div>
                    <div className='card-body'>
                        <div className="row">
                            <div className='col-lg-5'>
                                <p style={{color:'green'}}>* 1 GAH = {(ega_mos).toFixed(6)} EFRANC </p>
                                <p style={{color:'green'}}>* 1 FRANC = {(1/(ega_mos)).toFixed(6)} GAH </p>
                            </div>
                        
                            <div className='col-lg-7'>
                                <p style={{color:'green'}}>* GAH balance : {gahBalance} GAH</p>
                                <p style={{color:'green'}}>* E-FRANC balance : {mosBalance} EFRANC</p>
                            </div>
                        </div>
                        <div className='textfield'>
                            <p>From Token : </p>
                            <FormControl sx={{ m: 1, minWidth: 250 }}>
                                <Select
                                    value={selectedFrom}
                                    onChange={handleChangeSelectFrom}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    
                                >
                                    <MenuItem value=''>
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={'gah'}>GAH TOKEN</MenuItem>
                                    <MenuItem value={'efranc'}>E-FRANC</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField id="standard-basic" type="number" variant="outlined" value={fromAmount} onChange={onChangeFromAmount} min={50}/>
                            <p> {selectedFrom.toUpperCase()}</p>
                            
                        </div>
                        <div>
                            <p style={{color:'#ff0000', display:displayerr}} >* Invalid amount because it's more than the balance in your wallet. </p>
                        </div>
                        <br/>
                        <div className='textfield'>
                            <p>To token : </p>
                            <FormControl sx={{ m: 1, minWidth: 250 }}>
                                <Select
                                    value={selectedTo}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    disabled
                                >
                                <MenuItem value=''>
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={'gah'}>GAH TOKEN</MenuItem>
                                <MenuItem value={'efranc'}>E-FRANC</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField id="standard-basic" type="number" variant="outlined" value={toAmount} min={50} disabled/>
                            <p> {selectedTo.toUpperCase()}</p>
                        </div>

                    </div>
                    <div className='card-footer'>
                        <button type="submit" className="btn btn-primary" disabled={disabledBTN}>Swap</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
  );
}