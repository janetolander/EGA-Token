import React, { useState, useEffect } from 'react';
import './index.scss'

import Web3 from "web3";
import EGA from '../../abi/EGAtoken.json';
import {TOKEN_ADDRESS, PRIVATE_KEY } from '../../global/config'


export default function BTCSuccess() {
    
  return (
    <div className='row' style={{minHeight:680, minWidth:'100%'}}>
        <div className="card" style={{margin:"auto", height:300, width:"55%"}}>
            <div className="card-body">
                <h1>Payment Successful!</h1>
                <h2>Congratelations!, Please check your wallet</h2>
            </div>
        </div>
    </div>
  );
}