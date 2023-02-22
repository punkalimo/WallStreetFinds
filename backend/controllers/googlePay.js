/*const {google} = require('googleapis');
const googleAuth = require('google-auth-library');

const paymentAPI = google.payments('v1');

paymentAPI.accounts.get({
  accountId: '1234567890'
}).then(response => {
  console.log(response.data);
}).catch(err => {
  console.error('Error occurred', err);
});
// Set up Google OAuth2 authentication
const authClient = new googleAuth.OAuth2Client({
  clientId: '975528423229-nsglajm1hum8ard70aca92t9jdi1cade.apps.googleusercontent.com',
  clientSecret: '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',
  redirectUri: 'http://localhost:5000/google-pay',
});

const authUrl = authClient.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent',
  scope: 'https://www.googleapis.com/auth/userinfo.email'
});
console.log('Authorize this app by visiting this URL:', authUrl);



const googlePay = async(req, res)=>{
  const authorizationCode = req.query.code;
  
  const access_token = authClient.getToken(authorizationCode, (err, tokens) => {
    if (err) {
      console.error('Error:', err);
      return;
    } 
    const accessToken = tokens.access_token;
    console.log('Access token:', accessToken);
    const payClient = google.payments('v1');

// Create a payment request
const paymentRequest = {
  apiVersion: 2,
  apiVersionMinor: 0,
  totalPriceStatus: 'FINAL',
  totalPrice: '1.00',
  currencyCode: 'USD',
  countryCode: 'US',
  merchantInfo: {
    merchantName: 'WallStreet Finds',
  },
  allowedPaymentMethods: [
    {
      type: 'CARD',
      parameters: {
        allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
        allowedCardNetworks: ['MASTERCARD', 'VISA'],
      },
      tokenizationSpecification: {
        type: 'PAYMENT_GATEWAY',
        parameters: {
          gateway: 'example',
        },
      },
    },
  ],
};

// Send the payment request to the Google Pay API
const pay = ()=>{
  payClient.payments.create({
    access_token,
    requestBody: paymentRequest,
  }).then((response) => {
    // Handle the payment response
    console.log('Payment response:', response.data);
  }).catch((error) => {
    console.error('Error:', error);
  });
  
}
  });
}

// Set up Google Pay API client


module.exports = googlePay;*/