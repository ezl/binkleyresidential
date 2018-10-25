'use strict';

/* https://www.smashingmagazine.com/2018/05/building-serverless-contact-form-static-website/ */

const AWS = require('aws-sdk');
const SES = new AWS.SES();

function sendEmail(formData, callback) {
  const emailParams = {
    Source: 'ericzliu@gmail.com', // SES SENDING EMAIL
    ReplyToAddresses: [formData.reply_to],
    Destination: {
      ToAddresses: ['ericzliu@gmail.com'], // SES RECEIVING EMAIL
    },
    Message: {
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: `New Lead:\n

First Name: ${formData.firstName}
Last Name: ${formData.lastName}
Date of Birth: ${formData.dobMonth} ${formData.dobDay}, ${formData.dobYear}
Email: ${formData.email}
Current Address: ${formData.currentAddressStreet}`,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'New lead from binkleyresidential.com',
      },
    },
  };

  SES.sendEmail(emailParams, callback);
}

module.exports.processForm = (event, context, callback) => {
  const formData = JSON.parse(event.body);

  sendEmail(formData, function(err, data) {
    const response = {
      statusCode: err ? 500 : 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        message: err ? err.message : data,
      }),
    };

    callback(null, response);
  });

};

