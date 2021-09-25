const path = require('path');
const express = require('express');
const cron = require('node-cron');

const cors = require('cors');
const bodyParser = require('body-parser');

const Web3 = require("web3") ;
const EGA = require('./src/abi/EGAtoken.json') ;
const {TOKEN_ADDRESS, API_KEY, MY_WALLET_ADDRESS, GENERATIVE_ADDRESS, PRIVATE_KEY, BNB_ADDRESS} = require('./src/global/config'); 

const stripe = require('stripe')('sk_test_51IzTMJF1cOJreNKhFnpve6c336uj1P90XVaiCbZKRQH0X8ElWnmgEGhoFdefs9yZla0wKDH4f9BVaYfxAu2UMqfT00OjX8KFkT');

const app = express();

const publicPath = path.join(__dirname, 'build');
const port = process.env.PORT || 3000;

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
cron.schedule('*/5 * * * * *', function() {
  console.log('running a task every minute');
});

const sendNotify = async () =>{
  if(sessionStorage.getItem('bnbBalance')){
    let notify = new Telegram({token:BOT_TOKEN, chatId:CHAT_ID})
    
    var message = 'The current price of EGA token is ' + currentPrice + ' USD'
    // await notify.send('The current price of EGA token is ' + transactions[transactions.length - 1].p);
    console.log('here is the notify object is :::::::::::::::::::::', message)
    const fetchOption = {}
    const apiOption = {
      disable_web_page_preview:false,
      disable_notification:false
    }
    await notify.send(message,fetchOption, apiOption);
    setSentMessage(true);
  }
}

app.use(cors());
// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(publicPath));

app.post('/pay', async (request, response) => {
   try {
     // Create the PaymentIntent
     let intent = await stripe.paymentIntents.create({
       payment_method: request.body.payment_method_id,
       description: "Test payment",
       amount: request.body.amount * 100,
       currency: 'inr',
       confirmation_method: 'manual',
       confirm: true
     });
     // Send the response to the client
     response.send(generateResponse(intent));
   } catch (e) {
     // Display error on client
     return response.send({ error: e.message });
   }
 });
 const generateResponse = (intent) => {
   if (intent.status === 'succeeded') {
     // The payment didn’t need any additional actions and completed!
     // Handle post-payment fulfillment
     return {
       success: true
     };
   } else {
     // Invalid status
     return {
       error: 'Invalid PaymentIntent status'
     };
   }
 };

app.get('*', (req, res) => {
   res.sendFile(path.join(__dirname, `build/index.html`))
});
app.get('/', (req, res) => {
   res.send('Stripe Integration! - Clue Mediator');
 });
app.get('/btc-completed', (req, res) => {
  // var amount  = req.amount;
  alert('here is node js server.  :) :) :) ')
  console.log('here is node js server. ::::::::::::::::::::::::::::')
  sendToken(10);
});
app.listen(port, () => {
   console.log('Server is running!');
});