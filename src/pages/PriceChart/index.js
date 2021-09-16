import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.css";
import './index.scss'
import '../index.css'

import {TOKEN_ADDRESS, API_KEY, MY_WALLET_ADDRESS, GENERATIVE_ADDRESS} from '../../global/config'
import LineChart from '../../components/LineChart';
import ToolTip from '../../components/ToolTip';

function PriceChart(props) {

    const [hoverLoc, setHoverLoc] = useState(null);
    const [activePoint, setActivePoint] = useState(null);

    const handleChartHover = (hoverLoc, activePoint) =>{
        setActivePoint(activePoint);
        setHoverLoc(hoverLoc)
    }
    return (
        <div>
            <div className='row'>
              <div className='popup'>
                {hoverLoc ? <ToolTip hoverLoc={hoverLoc} activePoint={activePoint}/> : null}
              </div>
            </div>
            <div className="trading-chart" style={{ backgroundColor:'#262626' }}>
              {/* <TradingViewChart cOptions={options} getTheme={getTheme} setFlg={setComplete}/> */}
              {/* <LineChart data={transactions} onChartHover={ (a,b) => handleChartHover(a,b) }/> */}
              <div className='row'>
                <div className='chart' style={{minWidth:'80%', minHeight:'650px'}}>
                  { !props.fetchingData ?
                    <LineChart data={props.chartData} onChartHover={ (a,b) => handleChartHover(a,b) }/>
                    : null }
                </div>
              </div>
            </div>
        </div>
    );
}

export default PriceChart;