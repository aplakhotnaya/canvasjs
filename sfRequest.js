var express = require('express'),
    bodyParser = require('body-parser'),
    request = require('request'),
    decode = require('salesforce-signed-request'),
    consumerSecret = process.env.CONSUMER_SECRET;

    function updaterecord(oauthToken,context) {
console.log(oauthToken);
console.log(context);
        /*var    contactRequest = {
            url: instanceUrl + '/services/data/v29.0/query?q=' + query,
            headers: {
                'Authorization': 'OAuth ' + oauthToken
            }
        };
        request(contactRequest, function(err, response, body) {
          console.log(body)
               // contact = JSON.parse(body).records[0],

        });*/

    }

