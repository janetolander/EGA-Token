import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.css";
import './index.scss'
import '../index.css'

import BigNumber from "bignumber.js";
import {TOKEN_ADDRESS, API_KEY, MY_WALLET_ADDRESS, GENERATIVE_ADDRESS} from '../../global/config'
// import { Button, ButtonProps, useWalletModal} from '@pancakeswap-libs/uikit'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch
} from "react-router-dom";

import PriceChart from '../PriceChart';
import TokenBuy from '../TokenBuy';
import BTCSuccess from '../BTCSuccess';

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Telegram from 'telegram-notify';

import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import Web3 from "web3";
import EGA from '../../abi/EGAtoken.json';

import Poocoin from '../../services/poocoin'
import Price from '../../services/price'

import { initOnboard, initNotify } from './services'

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(-2),
  },
}));


function generalDateRange(){
  var range=[]
  var today = new Date();
  var thisyear = today.getFullYear();
  var lastyear = thisyear
  var beforeDay = parseInt(today.getDate()) - 10;
  var thisMonth = today.getMonth()<10?'0'+(today.getMonth() + 1):(today.getMonth() + 1)
  var lastMonth = thisMonth
  if(beforeDay<=0)
   lastMonth = today.getMonth()<10?'0'+(today.getMonth()):(today.getMonth())
  if(thisMonth == '01'){
    lastMonth = '12'
    lastyear = thisyear - 1
  }
  
  var thisDay = today.getDate()<10?'0'+(today.getDate()):today.getDate();
  var lastDay = (beforeDay<10)?'0'+beforeDay:beforeDay
  if(beforeDay<=0)lastDay = 30 + beforeDay
  var thisMonthToday = thisyear+'-'+thisMonth+'-'+thisDay
  var lastMonthToday = lastyear+'-'+lastMonth+'-'+lastDay
  var Hours = today.getHours()<10?'0'+today.getHours():today.getHours()
  var Minutes = today.getMinutes()<10?'0'+today.getMinutes():today.getMinutes()
  var Seconds = today.getSeconds()<10?'0'+today.getSeconds():today.getSeconds();
  var time = Hours+ ":" + Minutes + ":" + Seconds
  var fromDateTime = lastMonthToday + 'T' + time + 'Z'
  var toDateTime = thisMonthToday + 'T' + time + 'Z'
  range.push(fromDateTime)
  range.push(toDateTime)
  return range
}
export const dateRangeGlobal = generalDateRange()

export function totalSupplyMethod(){
  return fetch(`https://api.bscscan.com/api?module=stats&action=tokensupply&contractaddress=${TOKEN_ADDRESS}&apikey=${API_KEY}`).then(res => {
    return res.json()
  }).then(json => {
    return json.result
  })
}

export function circulationSupplies(){
  return fetch(`https://api.bscscan.com/api?module=stats&action=tokenCsupply&contractaddress=${TOKEN_ADDRESS}&apikey=${API_KEY}`).then(res => {
    return res.json()
  }).then(json => {
    return json.result
  })
}

export function getTokenInfo(){
  return fetch(`https://api.dex.guru/v1/tokens/0xef2ec90e0b8d4cdfdb090989ea1bc663f0d680bf-bsc`).then(res => {
    return res.json()
  })
}

export function getBNBPrice(){
  return fetch(`https://api.bscscan.com/api?module=stats&action=bnbprice&apikey=${API_KEY}`).then(res => {
    return res.json()
  })
}

const generateBigUnit = (tokenDecimalInt) => {
  // string
  const unit = new Array(tokenDecimalInt - 1).fill(0).join("");
  const smallestUnitString = `0.${unit}1`;
  return new BigNumber(smallestUnitString);
};

export function LoadTransactionsFromBSCScan(){
  let url = `https://api.bscscan.com/api?module=account&action=tokentx`;
  url += `&contractaddress=${TOKEN_ADDRESS}`;
  url += `&startBlock=9798039`;
  // url += `&endBlock=9999999999`;
  url += `&sort=asc`;
  url += `&apiKey=${API_KEY}`;
  // console.log("^&^&^&^&^&^&^&", url)
  return fetch(url).then(res => {
    return res.json()
  })
}


let provider = null;
let web3 = null;
let accounts = null;

function App(){
  const classes = useStyles();

  const [totalSupply, setTotalSupply] = useState()

  const bqAPI = new Poocoin({debug: false})
  const priceClss = new Price()

  const [BNBPrice, setBNBPrice] = useState();
  const [completeFlg, setComponentFlg] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [transactionsArr, setTransactionsArr] = useState([]);
  const [currentAccount, setCurrentAccount] = useState('');

  const [fetchingData, setFetchingData] = useState(true);
  const [fetchingUSDData, setFetchingUSDData] = useState(true);
  const [fetchingBalance, setFetchingBalance] = useState(false);
  const [fetchingTotal, setFetchingTotal] = useState(false);
  const [connectionFlg, setConnectionFlg] = useState(false);
  const [balance, setBalance] = useState();

  const [wallet, setWallet] = useState({})
  const [address, setAddress] = useState(null)
  const [ens, setEns] = useState(null)
  const [network, setNetwork] = useState(null)
  const [onboard, setOnboard] = useState(null)
  const [notify, setNotify] = useState(null)
  const [walletBalance, setWalletBalance] = useState(null)
  const [currentPrice, setCurrentPrice] = useState(0)
  
  const setComplete = () => {
    setComponentFlg(true)
  }
  const handleChartHover = (hoverLoc, activePoint) =>{
    setActivePoint(activePoint);
    setHoverLoc(hoverLoc)
  }
  const checkConnection = async () => {

    // Check if browser is running Metamask
    let web3;
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
    } else if (window.web3) {
        web3 = new Web3(window.web3.currentProvider);
    };

    // Check if User is already connected by retrieving the accounts
    web3.eth.getAccounts()
        .then(async (addr) => {
            // Set User account into state
            if(addr.length !== 0) {
              setConnectionFlg(true);
              setCurrentAccount(addr);
            }
        });
  };
  const getBalance =()=>{
    var web3 = new Web3(new Web3.providers.HttpProvider('https://bsc-dataseed1.ninicoin.io'))
    var contract = new web3.eth.Contract(EGA, TOKEN_ADDRESS, {from: MY_WALLET_ADDRESS})
    contract.methods.balanceOf(MY_WALLET_ADDRESS).call().then(function(bal){
      const decimal = 16;
      const bigValue = new BigNumber(bal);
      const bigTokenDecimal = generateBigUnit(decimal);
      const bigHumanValue = bigValue.dividedBy(
      new BigNumber(1).dividedBy(bigTokenDecimal)
    );
    console.log('**********************', bigHumanValue.c[0])
    setBalance(bigHumanValue);
    setFetchingBalance(true);
    })    
  }

  const getTotalSupply =()=>{
    var web3 = new Web3(new Web3.providers.HttpProvider('https://bsc-dataseed1.ninicoin.io'))
    var contract = new web3.eth.Contract(EGA, TOKEN_ADDRESS)
    contract.methods.totalSupply().call().then(function(bal){
      console.log('XXXXXXXXXXXXXXXXXXX',bal)
      const decimal = 16;
      const bigValue = new BigNumber(bal);
      const bigTokenDecimal = generateBigUnit(decimal);
      const bigHumanValue = bigValue.dividedBy(
      new BigNumber(1).dividedBy(bigTokenDecimal)
    );
    console.log(':::::::::::::::::::::::', bigHumanValue.c[0])
    setTotalSupply(bigHumanValue.c[0]);
    setFetchingTotal(true);
    })
  }

  const setNecessaryState = ()=>{
    // console.log('************************************************')
    // if(completeFlg == true){
      getBalance();
      getTotalSupply();
      checkConnection();
      
      getBNBPrice().then(bp=>{
        setBNBPrice(bp.result.ethusd)
        priceClss.getPrice();
      }) 
   
      if(sessionStorage.getItem('bnbBalance')){
        bqAPI.loadBitqueryDataUSDT(dateRangeGlobal[0]).then(usds =>{
          let transaction_obj_arr = [];
          let wb_usdt_arr = usds.data.ethereum.dexTrades;
          wb_usdt_arr.map((arr, index) => {
            
            const ega_price = (sessionStorage.getItem('bnbBalance') / sessionStorage.getItem('egaBalance')) * (Number(arr.quotePrice) /100)
  
            transaction_obj_arr.push({
              d: arr.timeInterval.minute,
              p: ega_price,
              x: index,
              y: ega_price,
            });
          })
  
          setTransactions(transaction_obj_arr);
          var price = (transaction_obj_arr[transaction_obj_arr.length - 1].p).toFixed(9)
          setCurrentPrice(price)
          setFetchingUSDData(false);
          
        });
      }
      
  }

  async function buyNft(){
    const web3Modal = new Web3Modal()
    web3 = await connect(web3Modal);
    accounts = await web3.eth.getAccounts();
    setCurrentAccount(accounts);
  }
  async function connect(web3Modal) {
    provider = await web3Modal.connect();
    return new Web3(provider);
  }
  useEffect(() => {
      
      const interval = setInterval(() => {
        setComplete();
        setNecessaryState();
      }, 5000);

      return () => clearInterval(interval);
    
  }, []);
  
  useEffect(() => {
    const onboard = initOnboard({
      address: setAddress,
      ens: setEns,
      network: setNetwork,
      balance: setWalletBalance,
      wallet: wallet => {
        if (wallet.provider) {
          setWallet(wallet)

          const ethersProvider = new ethers.providers.Web3Provider(
            wallet.provider
          )

          provider = ethersProvider

          window.localStorage.setItem('selectedWallet', wallet.name)
        } else {
          provider = null
          setWallet({})
        }
      }
    })

    setOnboard(onboard)

    setNotify(initNotify())
  }, [])



  useEffect(() => {
    const previouslySelectedWallet = window.localStorage.getItem(
      'selectedWallet'
    )

    if (previouslySelectedWallet && onboard) {
      onboard.walletSelect(previouslySelectedWallet)
    }
  }, [onboard])
  
    return (
      <Router>  
      <div className="container" style={{ minWidth:'100%',backgroundColor:'#262626' }}>
        <header style={{ minWidth:'100%', minHeight:120, position:'relative'}}>
          
          <a target="_blank" rel="noopener noreferrer" href="#">
            <img alt='Coin Panel Logo' lazy="true" src="./images/photo_ega_coin.png" style={{width:100}}/>
            EGA-Coin Current Price<br/> 
            {/* <span style={{fontSize:16, color:"white", fontWeight:700}}>{!fetchingData?TOKEN_ADDRESS:''}</span>  */}
          </a>
          
          {/* <p>{currentAccount}</p> */}
        </header>
        <div className="menuBar">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/token-buy">Token Buying</Link>
            </li>
            <li>
                <div>
                {!wallet.provider && (
                  <button
                    className="bn-demo-button"
                    onClick={() => {
                      onboard.walletSelect()
                    }}
                  >
                    Select a Wallet
                  </button>
                )}

                {wallet.provider && (
                  <button className="bn-demo-button" onClick={onboard.walletCheck}>
                    Wallet Checks
                  </button>
                )}

                {wallet.provider && (
                  <button className="bn-demo-button" onClick={onboard.walletSelect}>
                    Switch Wallets
                  </button>
                )}

                {wallet.provider && wallet.dashboard && (
                  <button className="bn-demo-button" onClick={wallet.dashboard}>
                    Open Wallet Dashboard
                  </button>
                )}
                {wallet.provider && wallet.type === 'hardware' && address && (
                  <button
                    className="bn-demo-button"
                    onClick={onboard.accountSelect}
                  >
                    Switch Account
                  </button>
                )}
              </div>
            </li>
          </ul>
        </div> 
        <div className="row">
          <div className="col-md-3 col-sm-12">
            <div>
              <ul >
                <li>
                      &nbsp;
                </li>
                <li>
                  <p>Total Supply:</p>
                  <p className="greenCharacter" >{fetchingTotal?totalSupply:''}</p>
                </li>
                <li>
                  <p>Distributed token:</p>
                  {/* <p className="greenCharacter"><span>$</span>{(parseInt(parseFloat(totalSupply)*(parseFloat(tokenInfo.priceUSD).toFixed(15))/1.4107)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p> */}
                  <p className="greenCharacter">{fetchingBalance && fetchingTotal?(Number(totalSupply)-balance).toFixed(5):''}</p>
                </li>
                <li>
                  <p>Wallet Balance Amount:</p>
                  {/* <p className="greenCharacter"><span>$</span>{(parseInt(parseFloat(totalSupply)*(parseFloat(tokenInfo.priceUSD).toFixed(15))/1.4107)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p> */}
                  {/* <p className="greenCharacter">{!fetchingData?Number(transactionsArr[transactionsArr.length - 1]['balance']).toFixed(4):''}</p> */}
                  {/* <p className="greenCharacter">{!fetchingData?(Number(totalSupply)-Number(transactionsArr[transactionsArr.length - 1]['DAM'])).toFixed(4):''}</p> */}
                  <p className="greenCharacter">{fetchingBalance?(balance).toFixed(5) + 'EGA':''}</p>
                </li>
                
              </ul>
            </div>
          </div>
          <div className="col-md-9 col-sm-12">
            <div className="row">
              <div className="col-md-4">
                <div style={{position:'relative',height:70}}>
                  {!fetchingUSDData?
                  <div style={{position:'absolute', top:10}}>
                      {/* <img style={{width:40}} src="https://bscscan.com/images/svg/brands/bnb.svg?v=1.3"/> */}
                      <a style={{color:"white", fontSize:23, fontWeight:700}}>
                        <img style={{width:'10%'}} src="./images/photo_ega_coin.png"/> &nbsp;
                        EGA
                      </a>
                  </div>
                  :null}
                  {/* <div style={{position:'absolute',top:15, left:50}}>
                    {!fetchingData ?
                    <p style={{color:"white", fontSize:23, fontWeight:700}}>{transactionsArr[transactionsArr.length - 1]['name']} ({transactionsArr[transactionsArr.length - 1]['symbol']})</p>
                    :null}
                  </div> */}
                  {/* <div style={{position:'absolute',top:27, left:50}}>
                    <p style={{color:"white", fontSize:18, fontWeight:500, textTransfrom:"upercase"}}>{!fetchingData?TOKEN_ADDRESS:''}</p>
                  </div> */}
                </div>
              </div>
              <div className="col-md-8">
                {/* <p style={{fontSize:28,fontWeight:700,color:'#1eff1e'}}>{!fetchingUSDData?(sessionStorage.getItem('bnbBalance') / sessionStorage.getItem('egaBalance')) * (Number(BNBPrice) /100) + ' USD':''} </p> */}
                
                {/* <p style={{fontSize:28,fontWeight:700,color:'#1eff1e'}}>{!fetchingUSDData?transactions[transactions.length - 1].p + 'USD':''} </p> */}
                <p style={{fontSize:28,fontWeight:700,color:'#1eff1e'}}>{!fetchingUSDData?currentPrice + 'USD':''} </p>
                {/* <p style={{fontSize:28,fontWeight:700,color:'#1eff1e'}}>{!fetchingUSDData?transactions[transactions.length - 1].y*BNBPrice + 'USD':''} </p> */}
              </div>
              
            </div>

            <Switch>
              <Route exact path="/">
                <PriceChart
                  arrData={transactionsArr}
                  chartData={transactions}
                  fetchingData={fetchingUSDData}
                />
              </Route>
              <Route path='/token-buy'>
                {/* <TokenBuy 
                  arrData={transactionsArr} 
                  fetchingData={fetchingData}
                /> */}
                <TokenBuy arrData={transactionsArr} currentPrice={currentPrice} fetchingData={fetchingUSDData} currentAccount = {currentAccount}/>
              </Route>
              <Route path='/btc-success'>
                {/* <TokenBuy 
                  arrData={transactionsArr} 
                  fetchingData={fetchingData}
                /> */}
                <BTCSuccess arrData={transactionsArr} fetchingData={fetchingUSDData} currentAccount = {currentAccount}/>
              </Route>
            </Switch>
            
            {/* <div className="trading-chart" style={{ backgroundColor:'#262626', width:'100%', maxHeight:460, marginTop:20}}>
              <TransactionList cOptions={options} callbackAction={setTotalSupply}/>
            </div> */}
          </div>
          
        </div>
          
      </div>
      </Router>
    )
  
}

export default App;