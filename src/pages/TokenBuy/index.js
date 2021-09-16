import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

import PaypalButton from '../../components/paypal/paypalButton';
import './index.scss'

import Web3 from "web3";
import {Transaction} from 'ethereumjs-tx';
import EGA from '../../abi/EGAtoken.json';
import {TOKEN_ADDRESS, API_KEY, MY_WALLET_ADDRESS, GENERATIVE_ADDRESS, PRIVATE_KEY, BNB_ADDRESS} from '../../global/config'

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


export default function TokenBuy(props) {
  const classes = useStyles();
  let data = props.arrData;
  const currentPrice = !props.fetchingData?data[data.length-1]['price']:0;
  const [value, setValue] = React.useState('paypal');
  const [egaAmount, setEgaAmount] = useState(0);
  const [price, setPrice] = useState(0);

  const [open, setOpen] = React.useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [showPaypal, setShowPaypal] = useState(false);
  const [sendingComplete, setSendingComplete] = useState(false)

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const setPaycompleted = () =>{
    setPaymentCompleted(true);
  }

  const handleAmountChange = (e) => {
    if(!props.fetchingData){
        setEgaAmount(e.target.value)
        let usdPrice = Number(e.target.value) * currentPrice;
        setPrice(usdPrice.toFixed(2));
    }
    else alert('Neccessary Data have not been downloaded yet. Please wait...')
  };

  const handleUsdChange = (e) => {
    if(!props.fetchingData){
        setPrice(e.target.value)
        let amount = Number(e.target.value) / currentPrice;
        setEgaAmount(amount.toFixed(6));
    }
    else alert('Neccessary Data have not been downloaded yet. Please wait...')
  };

    const sendToken = async (tokenAmount) => {
        if(!sendingComplete){
            console.log('I am sendToken method. Nice to meet you.')
            var privKey = PRIVATE_KEY;
            
            var toAddress_bump = props.currentAccount;
            var toAddress = toAddress_bump[0].toLowerCase();
            var web3 = new Web3(new Web3.providers.HttpProvider('https://bsc-dataseed1.ninicoin.io'))
            var contract = new web3.eth.Contract(EGA, TOKEN_ADDRESS);
            var amount = web3.utils.toHex(Number(tokenAmount) * 1e16);
            try {
                let encoded = contract.methods.transfer(toAddress, amount).encodeABI();
                var tx = {
                    contractAddress:TOKEN_ADDRESS,
                    gasLimit: web3.utils.toHex(53000),
                    to: TOKEN_ADDRESS,
                    data: encoded
                }
                let signed = await web3.eth.accounts.signTransaction(tx, privKey);
                
                web3.eth
                    .sendSignedTransaction(signed.rawTransaction).once("receipt", function (receipt) {
                        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', privKey)
                        setSendingComplete(true)
                    })
            

            } catch (error) {
                console.error(error);
                throw error;
            };
        }
    }

  const handleSubmit =(e) =>{
    e.preventDefault();
 
    if(value == "paypal"){
        handleOpen();
        setShowPaypal(true);
    }
     
  }


  return (
    <div className='row' style={{minHeight:680, minWidth:'100%'}}>
        
        <form style={{width:'60%', margin:'auto', marginTop:15}} onSubmit={handleSubmit}>
            <div className='card'>
                <div className='card-header'>
                    EGA Token Buying
                </div>
                <div className='card-body'>
                    <div className='textfield'>
                        <p>Token Amount : </p>
                        <TextField id="standard-basic" type="number" variant="outlined" value={egaAmount} onChange={handleAmountChange}/>
                        <p> EGA</p>
                        
                    </div>
                    <br/>
                    <div className='textfield'>
                        <p>Price : </p>
                            <TextField id="filled-basic" type="number" variant="outlined" value={price} onChange={handleUsdChange}/>
                        <p> USD</p>
                    </div>
                   
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Select Payment!</FormLabel>
                        <RadioGroup aria-label="gender" name="gender1" value={value} onChange={handleChange}>
                            {/* <FormControlLabel value="stripe" control={<Radio />} label="Credit Cart" /> */}
                            <FormControlLabel value="paypal" control={<Radio />} label="Paypal" />
                            <FormControlLabel value="btc" control={<Radio />} label="BitCoin" />
                        </RadioGroup>
                    </FormControl>
                </div>
                <div className='card-footer'>
                    <Button
                        variant="contained"
                        color="secondary"
                        className={classes.button}
                    >
                        Cancel
                    </Button>
                    
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        type='submit'
                    >
                        Buy Now
                    </Button>
                    
                </div>
            </div>
        </form>
   
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
            timeout: 500,
            }}
        >
            <Fade in={open}>
                
                {value === 'paypal' ? 
                    <PaypalButton 
                        sendToken={sendToken}
                        amount={egaAmount} 
                        price={price}
                        sendingComplete = {sendingComplete}
                        setSendingComplete = {setSendingComplete}
                    />: null  
                }
                   
            </Fade>
        </Modal>
    </div>
  );
}