const path = require('path');
const express = require('express');

const cors = require('cors');
const bodyParser = require('body-parser');

const stripe = require('stripe')('sk_test_51IzTMJF1cOJreNKhFnpve6c336uj1P90XVaiCbZKRQH0X8ElWnmgEGhoFdefs9yZla0wKDH4f9BVaYfxAu2UMqfT00OjX8KFkT');

const app = express();

const publicPath = path.join(__dirname, 'build');
const port = process.env.PORT || 3000;

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
app.listen(port, () => {
   console.log('Server is running!');
});