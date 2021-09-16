import React, {
  Component,
} from 'react'
import './index.scss'

// import binanceAPI from '../../services/api'
// import BitQueryAPI from '../../services/BitQueryApi'
import Poocoin from '../../services/poocoin'
// import Datafeed from '../../services/datafeed'
import {widget} from '../../scripts/charting_library/charting_library.esm'
import {options} from '../../global/tv'
import { resultKeyNameFromField } from '@apollo/client/utilities'

export default class TradingViewChart extends Component {
  constructor(props) {
    super()
    const {cOptions,tokenInfo} = props
    this.state = {
      isChartReady : false,
      tokenInfo : {}
    }

    // this.bqAPI = new BitQueryAPI({debug: false, apiData: apiData})
    this.bqAPI = new Poocoin({debug: false})
    // this.bqAPI = new binanceAPi({debug: false})
    // instPoocoin.callbacktt = function(pVal){console.log(pVal, "====")}
    this.widgetOptions = {
      container_id: "chart_container",
      datafeed: this.bqAPI,
      // datafeed: Datafeed,
      library_path: "../../scripts/charting_library/",
      ...options,
      ...cOptions // props override default values of constructor options
    }
    this.tradingViewWidget = null
    this.chartObject = null
    // sessionStorage.setItem("apiData", apiData);
  }

  chartReady = () => {
    this.tradingViewWidget.onChartReady(() => {
      this.setState({
        isChartReady: true
      })
    })
  }

  componentDidMount() {
    this.tradingViewWidget = new widget(this.widgetOptions)
    this.chartReady()
    
  }

  componentDidUpdate() {
    // Use events and methods here. All events and methods available here
    // Can use global context for changing/setting values 
    this.props.getTheme(this.tradingViewWidget.getTheme())
    this.chartObject = this.tradingViewWidget.chart()
    this.tradingViewWidget.save((obj) => {
      console.log(obj)
    })
    this.props.setFlg()
  }

  render() {
    return (
        <div id='chart_container' style={{ minWidth:'100%'}}></div>
    )
  }
}