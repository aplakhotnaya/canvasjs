var context={};

var oauthToken='';

var express = require('express'),
    bodyParser = require('body-parser'),
    request = require('request'),
    qrcode = require('qrcode-npm'),
    decode = require('salesforce-signed-request'),
    consumerSecret = process.env.CONSUMER_SECRET,
    app = express();

app.set('view engine', 'ejs');
app.use(bodyParser()); // pull information from html in POST
app.use(express.static(__dirname + '/public'));

        app.post('/signedrequest', function(req, res) {
        var signedRequest = decode(req.body.signed_request, consumerSecret);
               context = signedRequest.context;
            oauthToken = signedRequest.client.oauthToken;
        var    instanceUrl = signedRequest.client.instanceUrl;
        var    query = "SELECT Id, FirstName, LastName, Phone, Email, AccountId FROM Contact WHERE Id = '" + context.environment.record.Id + "'";

        var    contactRequest = {
                url: instanceUrl + '/services/data/v29.0/query?q=' + query,
                headers: {
                    'Authorization': 'OAuth ' + oauthToken
                }
            };
 
        console.log(context);
      console.log(req);
        var signedRequestJson=JSON.stringify(context);

    request(contactRequest, function(err, response, body) {
        var qr = qrcode.qrcode(4, 'L'),
            contact = JSON.parse(body).records[0],
            text = 'MECARD:N:' + contact.LastName + ',' + contact.FirstName + ';TEL:' + contact.Phone + ';EMAIL:' + contact.Email + ';;';
        
        
        qr.addData(text);
        qr.make();
        var imgTag = qr.createImgTag(4);
            res.render('index', {context: context, 
                imgTag: imgTag, 
                contact:contact, 
                signedRequestJson: signedRequestJson,
                oauthToken:oauthToken});
    });

});

app.post('/page', function (req, res) {
    calling.aFunction();
    res.send('A message!');
});






app.set('port', process.env.PORT || 5000);

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});