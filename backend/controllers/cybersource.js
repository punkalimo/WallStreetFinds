const cybersourceRestApi = require('cybersource-rest-client');
const configuration = require('../controllers/calculator-controller/Data/Configuration');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const Payment = require('../models/payment')


const visaCheckout = async (req, res)=>{
    if(req.cookies.token){
		jwt.verify(req.cookies.token, process.env.SECRET_KEY, async (err, decoded)=>{
			const execute = async(callback, enable_capture)=> {
				try {
					const card = req.body.card;
					const month = req.body.month;
					const year = req.body.year;
					const firstName = req.body.firstName;
					const lastName = req.body.lastName;
					const address = req.body.address;
					const town = req.body.town;
					const state = req.body.state;
					const postalCode = req.body.postalCode;
					const country = req.body.country;
					const email = req.body.email;
					const phone = req.body.phone;
					var configObject = new configuration();
					var apiClient = new cybersourceRestApi.ApiClient();
					var requestObj = new cybersourceRestApi.CreatePaymentRequest();
			
					var clientReferenceInformation = new cybersourceRestApi.Ptsv2paymentsClientReferenceInformation();
					clientReferenceInformation.code = 'TC50171_3';
					requestObj.clientReferenceInformation = clientReferenceInformation;
			
					var processingInformation = new cybersourceRestApi.Ptsv2paymentsProcessingInformation();
					processingInformation.capture = false;
					if (enable_capture === true) {
						processingInformation.capture = true;
					}
			
					requestObj.processingInformation = processingInformation;
			
					var paymentInformation = new cybersourceRestApi.Ptsv2paymentsPaymentInformation();
					var paymentInformationCard = new cybersourceRestApi.Ptsv2paymentsPaymentInformationCard();
					paymentInformationCard.number = card;
					paymentInformationCard.expirationMonth = month;
					paymentInformationCard.expirationYear = year;
					paymentInformation.card = paymentInformationCard;
			
					requestObj.paymentInformation = paymentInformation;
			
					var orderInformation = new cybersourceRestApi.Ptsv2paymentsOrderInformation();
					var orderInformationAmountDetails = new cybersourceRestApi.Ptsv2paymentsOrderInformationAmountDetails();
					orderInformationAmountDetails.totalAmount = '50.00';
					orderInformationAmountDetails.currency = 'USD';
					orderInformation.amountDetails = orderInformationAmountDetails;
			
					var orderInformationBillTo = new cybersourceRestApi.Ptsv2paymentsOrderInformationBillTo();
					orderInformationBillTo.firstName = firstName;
					orderInformationBillTo.lastName = lastName;
					orderInformationBillTo.address1 = address;
					orderInformationBillTo.locality = town;
					orderInformationBillTo.administrativeArea = state;
					orderInformationBillTo.postalCode = postalCode;
					orderInformationBillTo.country = country;
					orderInformationBillTo.email = email;
					orderInformationBillTo.phoneNumber = phone;
					orderInformation.billTo = orderInformationBillTo;
			
					requestObj.orderInformation = orderInformation;
			
			
					var instance = new cybersourceRestApi.PaymentsApi(configObject, apiClient);
			
					instance.createPayment(requestObj, function (error, data, response) {
						if (error) {
							console.log('\nError : ' + JSON.stringify(error));
						}
						else if (data) {
							console.log('\nData : ' + JSON.stringify(data));
							if(data.status === 'AUTHORIZED'){
								const transaction = new Payment({
									userID: decoded.userID,
									paymentId: data.processorInformation.transactionId,
									payerId: data.id,
									paymentToken: req.cookies.token,
									paymentAmount: orderInformationAmountDetails.totalAmount,
									paymentCurrency: orderInformationAmountDetails.currency ,
									paymentStatus: data.status
								  });
								  transaction.save((err) => {
									if (err) {
									  console.log(err);
									  
									}
									// Payment saved successfully
									console.log(transaction);
								  });
							}
							res.send(data);
						}
			
						console.log('\nResponse : ' + JSON.stringify(response));
						console.log('\nResponse Code of Process a Payment : ' + JSON.stringify(response['status']));
						callback(error, data, response);
						//res.send(response);
					});
				}
				catch (error) {
					console.log('\nException on calling the API : ' + error);
				}
			}
			/*if (require.main === module) {
				simple_authorization_internet(function () {
					console.log('\nCreatePayment end.');
				});
			}*/
			execute( ()=> {
				console.log('\nCreatePayment end.');

			});
  
		  });
		}else{
		  res.status(503).send('Please login, invalid JWT')
		}
        
   
}
   
    

module.exports = visaCheckout;