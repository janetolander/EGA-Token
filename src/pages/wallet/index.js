import React, { useState, useEffect } from 'react';
import {useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Header from "../layout/header";
import SideBar from "../layout/sidebar";
// import './common.css'

import {BACKEND_URL} from '../../global/config'

const Record = (props) => {
    return (
        <tr >
            <td>{props.record.tranDate}</td>
            <td>{props.record.type}</td>
            <td>{props.record.content}</td>
        </tr>
    )
};

export default function Wallet() {
    const { user } = useSelector(state => state.auth);
    const [tableData, setTableData] = useState([]);
    const [gahBalance, setGahBalance] = useState(0);
    const [mosBalance, setMosBalance] = useState(0);

    const getHistoryData = () =>{
        axios
        .get(`${BACKEND_URL}/gethistory/gah-${user.id}`)
        .then((response) => {
            let historyData = [];
            let responseData = response.data;
            if(responseData[0].length != 0){
                responseData[0].forEach(trans => {
                    let verb = '';
                    if(trans.tranType == 'BUY') verb = 'bought for ' + trans.price;
                    else if (trans.tranType == 'SELL') verb = 'sold for '+ trans.price;
                    else if (trans.tranType == 'SEND') verb = 'send to ' + trans.toWalletAddress;
                    let tranDate = (trans.tranDate).replace('T', ' ');
                    tranDate = tranDate.replace('Z', '');
                    let rawData = {
                        tranDate : tranDate,
                        type : trans.tranType,
                        content : trans.amount + ' of E-FRANC token was ' + verb + '.'
                    };
                    historyData.push(rawData);
                });
            }
            
            if(responseData[1].length != 0){
                responseData[1].forEach(swap => {
                    let fromToken = ''
                        if(swap.fromToken == 'efranc') fromToken = 'E-FRANC token';
                        if(swap.fromToken == 'gah') fromToken = 'GAH token';
                    let toToken = ''
                        if(swap.toToken == 'efranc') toToken = 'E-FRANC token';
                        if(swap.toToken == 'gah') toToken = 'GAH token';
                    let tranDate = (swap.swapDate).replace('T', ' ');
                    tranDate = tranDate.replace('Z', '');
                    let rawData_swap = {
                        tranDate : tranDate,
                        type : 'SWAP',
                        content : 'Swapped ' + swap.fromAmount + ' of ' + fromToken + ' with ' + swap.toAmount + ' of ' + toToken + '.'
                    };
                    historyData.push(rawData_swap);
                });
            }
            
            if(responseData[2].length != 0){
                responseData[2].forEach(receive => {
                    let tranDate = (receive.tranDate).replace('T', ' ');
                    tranDate = tranDate.replace('Z', '');
                    let rawData_receive = {
                        tranDate : tranDate,
                        type : 'RECEIVE',
                        content : receive.amount + ' of E-FRANC token was received.'
                    };
                    historyData.push(rawData_receive);
                });
    
            }
            
            historyData.sort(function(a, b){
                return new Date(b.tranDate) - new Date(a.tranDate);
            })

            setTableData(historyData);

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

    useEffect(()=>{
        getHistoryData();
        getBalanceData();
    }, [])

    return (
      <div>
        <Header />
        <SideBar />
            <div style={{minHeight:680, maxWidth:'90%', paddingLeft:'19%', paddingTop:245, margin:'auto'}}>
                <div className='card' style={{width:'50%'}}>
                    <div className='card-header-tb'>
                        Wallet Balance
                    </div>
                    <div className='card-body'>
                        <div className="row">
                            <div className='col-lg-12'>
                                <p style={{color:'green'}}>* GAH balance : {gahBalance} GAH</p>
                                <p style={{color:'green'}}>* E-FRANC balance : {mosBalance} EFRANC</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        <div >
                            <div  style={{paddingRight:70}}>
                                <h4 >Transaction List ( {tableData.length} Items )</h4>
                            </div>
                            <div >
                                <table className="table table-striped" style={{ marginTop: 20 }}>
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Type</th>
                                            <th>Content</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            tableData.map((currentrecord, index) => {
                                                console.log('here is Table');
                                                return(
                                                    <Record
                                                        record={currentrecord}
                                                        key={index}
                                                    />
                                                );
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          
      </div>
    );
}

