import React, { useState, useEffect } from 'react';
// import { Input, Checkbox, Button, message } from "antd";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles'
import FormControlLabel from '@material-ui/core/FormControlLabel';

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
    const [state, setState] = useState({
        checkedA: true,
        checkedB: true,
        checkedF: true,
        checkedG: true,
        });
    const [email, setEmail] = useState('lyappunov19@outlook.com')
    const [confirm, setConfirm] = useState()

    const classes = useStyles();
    
    const handleInput = (e) => {
        
        setEmail(e.target.value)
    };

    const handleCheckbox = (e) => {
        setConfirm(e.target.checked)
    };

    const handleCheckChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });
    };
    
    const handleSubmit = () => {
        // sendToken(props.amount)
        props.sendToken(props.amount)
    }
    
    return (
        <div style={{width:'60%', backgroundColor:'grey', color:'white', borderRadius:5, minHeight:350}}>
            <div style={{width:'100%', textAlign:'center', margin:'auto', paddingTop:40, minHeight:350, borderRadius:5, maxHeight:600, overflowY:'scroll'}}>
                <div>
                    <h2>EGA token amounts : {props.amount} EGA</h2>
                    <h2>Price :  {props.price} USD</h2>
                    <h2>Price :  {props.currentAccount} USD</h2>
                </div>
                <form
                    method="POST"
                    action="https://btcpayjungle.com/apps/2PT5KLwGodnxDEYgUuZNgpwf6QU9/pos"
                >
                    <div style={{padding:20, display:'inline'}}>
                        <span style={{color:'white', fontSize:'18px', fontWeight:700, justifyContent:'center'}}>Email : </span>
                        <TextField
                            placeholder="Please input your email"
                            variant="outlined"
                            onChange={handleInput}
                            
                        />
                    </div>
                    <div style={{padding:20}}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={state.checkedB}
                                    onChange={handleCheckChange}
                                    name="checkedB"
                                    color="primary"
                                />
                            }
                            label="I Accept the Terms and Conditions"
                        />
                    </div>
                    <input type="hidden" name="email" value={email} />
                    <input type="hidden" name="orderId" value="CustomSockShopId" />
                    <input
                        type="hidden"
                        name="redirectUrl"
                        value="https://ega-coin2.vercel.app/"
                    />
                    <div>
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            type="submit"
                            onClick={handleSubmit}
                            
                        >
                            {`To Payment ($${props.price})`}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );

}