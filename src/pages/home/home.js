import React, { useState, useEffect } from 'react';
import {useDispatch, useSelector } from 'react-redux';
import "bootstrap/dist/css/bootstrap.css";
import './home.scss'
import '../../index.css'
import SideBar from "../layout/sidebar";
import Header from "../layout/header";
import LineChart from '../../components/LineChart';
import ToolTip from '../../components/ToolTip';

import {BACKEND_URL} from '../../global/config'

export function getCorrectionValue(){
  return fetch(`${BACKEND_URL}/tokenprice`).then(res => {
    return res.json()
  })
}

export function getPairPriceHistory(){
  return fetch(`${BACKEND_URL}/currentpairprice/100`).then(res => {
    return res.json()
  })
}

export function getCalculatedPrice(){
  return fetch(`${BACKEND_URL}/egaprice`).then(res => {
    return res.json()
  })
}

function Home() {
  
  const { tokenprice } = useSelector(state => state.tokenprice);

    const [hoverLoc, setHoverLoc] = useState(null);
    const [activePoint, setActivePoint] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [currentPrice, setCurrentPrice] = useState(0);
    const [fetchingUSDData, setFetchingUSDData] = useState(true);
    const [chartWidth, setChartWidth] = useState(0);

    const handleChartHover = (hoverLoc, activePoint) =>{
        setActivePoint(activePoint);
        setHoverLoc(hoverLoc)
    }

    const setNecessaryState = ()=>{
     
      getPairPriceHistory().then(pp =>{
        if(pp){
          console.log('getPairprice history response is ', pp)
          let transaction_obj_arr = [];
          
          let wb_usdt_arr = pp;
          let j = 0
          for (let i=wb_usdt_arr.length; i-- ; i>=0) {

            // if(wb_usdt_arr[i].ega_usd == 'NaN'){ console.log('here is NAN')}
            
            const ega_price = wb_usdt_arr[i].ega_usd != 'NaN'?Number(wb_usdt_arr[i].ega_usd):Number(wb_usdt_arr[i-1].ega_usd);
            let date = window.innerWidth<990?(wb_usdt_arr[i].date).substring(5, (wb_usdt_arr[i].date).length):wb_usdt_arr[i].date
            transaction_obj_arr.push({
              d: date,
              p: ega_price,
              x: j,
              y: ega_price,
            });
            j++;
          }

          setTransactions(transaction_obj_arr);
          getCalculatedPrice().then(ep=>{
            let price  =  ep;
            getCorrectionValue().then(cv => {
              var egaprice = (Number(price) + Number(cv[0].ega)).toFixed(12)
              setCurrentPrice(egaprice)
              setFetchingUSDData(false);
            })
          })
        }
      });      
    }

    useEffect(() => {

      let width = window.innerWidth > 990?parseInt((window.innerWidth - 260)*0.75):parseInt(window.innerWidth*0.95);
      setChartWidth(width)
      
      const interval = setInterval(() => {
        setNecessaryState();
      }, 5000);

      return () => clearInterval(interval);
    
  }, []);

    return (
        <div>
          <Header />
          <SideBar />
          <div style={{paddingLeft:window.innerWidth > 990?'17%':0, paddingTop:245}}>
            <p style={{fontSize:28,fontWeight:700,color:'#1eff1e', paddingLeft:"35%"}}>{tokenprice.data?tokenprice.data.egaPrice + ' USD':''} </p>
            <div style={{maxWidth:'70%', margin:window.innerWidth > 990?'auto':10}}>
              <div>
                <div className='popup'>
                  {hoverLoc ? <ToolTip hoverLoc={hoverLoc} activePoint={activePoint}/> : null}
                </div>
              </div>
              <div className="trading-chart">
                  <div className='chart chart-div'>
                    { !fetchingUSDData ?
                      <LineChart data={transactions} onChartHover={ (a,b) => handleChartHover(a,b) } svgHeight={parseInt(chartWidth/1.7)} svgWidth={chartWidth}/>
                      : null }
                  </div>
              
              </div>
            </div>
          </div>
        </div>
    );
}

export default Home;