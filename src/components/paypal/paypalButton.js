
import React from "react";
import ReactDOM from "react-dom";
import scriptLoader from "react-async-script-loader";
// import Spinner from "./Spinner";

 const CLIENT = {
   sandbox:
     "ARStqa-xTPho6-SAziKCa__unt5sBMDyZocBGBiAOqaTl0Cd6L8838Ud7rf6emO5W0dVsa6HD77gPvxN",
   production:
     "ARBEG9wQuQF0ZsKC9OLBokioEkokiNNv7mjAmv4uqYnI9Bo_5adWcVBdC9m-o0mENSYsuk-45OnPQWTH"
 };

 const CLIENT_ID = CLIENT.production;
//  const CLIENT_ID = CLIENT.sandbox;



let PayPalButton = null;
class PaypalButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showButtons: false,
      loading: true,
      paid: false,
      sendingComplete:this.props.sendingComplete
    };

    window.React = React;
    window.ReactDOM = ReactDOM;
  }

  componentDidMount() {
    const { isScriptLoaded, isScriptLoadSucceed } = this.props;

    if (isScriptLoaded && isScriptLoadSucceed) {
      PayPalButton = window.paypal.Buttons.driver("react", { React, ReactDOM });
      this.setState({ loading: false, showButtons: true });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { isScriptLoaded, isScriptLoadSucceed } = nextProps;

    const scriptJustLoaded =
      !this.state.showButtons && !this.props.isScriptLoaded && isScriptLoaded;

    if (scriptJustLoaded) {
      if (isScriptLoadSucceed) {
        PayPalButton = window.paypal.Buttons.driver("react", {
          React,
          ReactDOM
        });
        this.setState({ loading: false, showButtons: true });
      }
    }
  }
  createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          description: "EGA token ("+ this.props.amount + "EGA)",
          amount: {
            currency_code: "USD",
            value: (Number(this.props.price)).toFixed(2)
          }
        }
      ]
    });
  };

  onApprove = (data, actions) => {
    actions.order.capture().then(details => {
      const paymentData = {
        payerID: data.payerID,
        orderID: data.orderID
      };
      console.log("Payment Approved: ", paymentData);
      this.setState({ showButtons: false, paid: true });
    });
  };

  render() {
    const { showButtons, loading, paid } = this.state;
    if (paid) {
      console.log('your payment is successful, congratelation!!!')
      if(!this.state.sendingComplete){
        this.props.sendToken(this.props.amount);
      }
      
    }
    return (
      <div style={{width:'60%', backgroundColor:'#0a1c24', color:'white', borderRadius:5, minHeight:450}}>
        {/* {loading && <Spinner />} */}
            <div style={{width:'100%', textAlign:'center', margin:'auto', paddingTop:40, minHeight:450, borderRadius:5, maxHeight:600, overflowY:'scroll'}}>
                {showButtons && (
                <div>
                    <div>
                    <h2>E-FRANC token amounts : {this.props.amount} EFRANC</h2>
                    <h2>Price :  {(Number(this.props.price)).toFixed(2)} USD</h2>
                    </div>

                    <PayPalButton
                    createOrder={(data, actions) => this.createOrder(data, actions)}
                    onApprove={(data, actions) => this.onApprove(data, actions)}
                    />
                </div>
                )}

                {paid && (
                
                <div className="card" style={{margin:"auto", height:300, width:"55%"}}>
                    <div className="card-body">
                        <h1>Payment Successful!</h1>
                        <h2>Congratelations!, Please check your wallet</h2>
                    </div>
                </div>
                )}
            </div>
        </div>
    );
  }
}


 export default scriptLoader(`https://www.paypal.com/sdk/js?client-id=${CLIENT_ID}`)(PaypalButton);
