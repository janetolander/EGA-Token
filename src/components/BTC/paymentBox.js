import React, { useState, useEffect } from 'react';
import {useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';

import {BACKEND_URL, MY_WALLET_ADDRESS} from '../../global/config'

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
const GreenCheckbox = withStyles({
    root: {
      color: '#1effbc',
      '&$checked': {
        color: '#1effbc',
      },
    },
    checked: {},
  })((props) => <Checkbox color="default" {...props} />);

export default function PaymentBox(props) {

    const { user } = useSelector(state => state.auth);

    const [recipientAddress, setRecipientAddress] = useState(MY_WALLET_ADDRESS);
    const [senderAddress, setSenderAddress] = useState('');
    const [senderPrivateKey, setSenderPrivateKey] = useState('');

    const classes = useStyles();

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
    
    const onChangeAddress = (e) => {
        setSenderAddress(e.target.value);
    };

    const onChangePrivatekey = (e) => {
        setSenderPrivateKey(e.target.value);
    };
    
    const handleSubmit =(e)=>{
        e.preventDefault();
       
        axios.get(`https://sochain.com/api/v2/get_address_balance/BTC/${senderAddress}`)
        .then((result)=>{
            if (Number(result.data.confirmBalance)== 0 && Number(result.data.confirmBalance)==0)
            alert('Your wallet balance is not enough to buy token.');
        })

        let sendBTCData = {
          recipientAddress: recipientAddress,
          senderAddress:senderAddress,
          senderPrivateKey: senderPrivateKey,
          amountToSend: props.price
          };
        axios
        .post(`${BACKEND_URL}/record/sendbitcoin`, sendBTCData)
        .then ((res) => {
          saveSubscribeDatabase()
        })
      }
    const saveSubscribeDatabase = () => {
        var datetime =  getCurrentDate();
        const transactionData = {
        personName:user.name,
        address:recipientAddress,
        walletAddress: "gah-"+user.id,
        tranDate:datetime,
        tokenName:'e-franc',
        tranType:'BUY',
        amount : props.amount,
        price : props.price + ' BTC'
        }
        axios
        .post(`${BACKEND_URL}/record/tranadd`, transactionData)
        .then((res) => {
            alert('Your payout successfull !');
            window.location.href = '/tokenbuy';
        })
        .catch((err) => {
            console.log(err);
            alert('Something went wrong with your payout.');
        })
        
     }
    
    return (
        <div style={{width:'60%', backgroundColor:'#0a1c24', color:'white', borderRadius:5, minHeight:350}}>
            <div style={{width:'100%', textAlign:'center', margin:'auto', paddingTop:40, minHeight:350, borderRadius:5, maxHeight:600, overflowY:'scroll'}}>
                <div style={{paddingBottom:25}}>
                    <h2>E-FRANC token amounts : {props.amount} EFRANC</h2>
                    <h2>Price :  {props.price} BTC</h2>
                </div>
                
                <form onSubmit={handleSubmit} style={{width:'100%'}}>
                    <div style={{padding:20}}>
                        <div className="row">
                            <div className="col-md-3">
                                <span style={{color:'white', fontSize:'18px', fontWeight:700, justifyContent:'center', float:'right'}}>Wallet Address : </span>
                            </div>
                            <div className="col-md-7">
                                <TextField
                                    placeholder="Please input your BTC wallet address"
                                    variant="outlined"
                                    onChange={onChangeAddress}   
                                    className="form-control" 
                                />
                            </div>
                        </div>    
                    </div>
                    <div style={{padding:20}}>
                        <div className="row">
                            <div className='col-md-3'>
                                <span style={{color:'white', fontSize:'18px', fontWeight:700, justifyContent:'center', float:'right'}}>Private Key : </span>
                            </div>
                            <div className='col-md-7'>
                                <TextField
                                    placeholder="Please input the private key."
                                    variant="outlined"
                                    onChange={onChangePrivatekey} 
                                    className="form-control"   
                                />
                            </div>
                        </div>
                    </div>
                    <div style={{paddingBottom:30}}>
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            type="submit"
                            onClick={handleSubmit}
                            
                        >
                            {`PAY (${props.price} BTC)`}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );

}