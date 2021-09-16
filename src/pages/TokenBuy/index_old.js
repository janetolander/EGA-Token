import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import './index.scss'

const useStyles = makeStyles((theme) => ({
    button: {
      margin: theme.spacing(-2),
    },
    root: {
        '& > *': {
          margin: theme.spacing(1),
          width: '25ch',
        },
    },
  }));

export default function TokenBuy(props) {
  const classes = useStyles();
  let data = props.arrData;
  const currentPrice = !props.fetchingData?data[data.length-1]['price']:0;
  const [value, setValue] = React.useState('stripe');
  const [egaAmount, setEgaAmount] = useState('');
  const [price, setPrice] = useState(0);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleAmountChange = (e) => {
    setEgaAmount(e.target.value)
    let usdPrice = Number(e.target.value) * currentPrice;
    setPrice(usdPrice);
  };

  const handleSubmit =(e) =>{
      console.log('herererer')
  }

  return (
    <div className='row' style={{minHeight:680, minWidth:'100%'}}>
        <TextField 
                    id="egaamount" 
                    label="Outlined" 
                    variant="Amount" 
                    onChange={handleAmountChange} 
                    value={egaAmount}
                />
        <form style={{width:'60%', margin:'auto', marginTop:15}} onSubmit={handleSubmit}>
            <div className='card'>
                <div className='card-header'>
                    EGA Token Buying
                </div>
                {/* <TextField 
                    id="egaamount" 
                    label="Outlined" 
                    variant="Amount" 
                    onChange={handleAmountChange} 
                    value={egaAmount}
                /> */}
                <div className='card-body'>
                    {/* <div>
                        <p>Token Amount : </p><TextField id="egaamount" label="Outlined" variant="Amount" onChange={handleAmountChange} value={egaAmount}/> <p> EGA</p>
                    </div>
                    <div>
                        <p>Price : </p><TextField id="usdprice" label="Outlined" variant="Price" value={price}/> <p> USD</p>
                    </div> */}
                    
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Select Payment!</FormLabel>
                        <RadioGroup aria-label="gender" name="gender1" value={value} onChange={handleChange}>
                            <FormControlLabel value="stripe" control={<Radio />} label="Credit Cart" />
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
                    >
                        Buy Now
                    </Button>
                </div>
            </div>
        </form>
    </div>
  );
}