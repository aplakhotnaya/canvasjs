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

console.log(req.body.signed_request);
console.log(consumerSecret);
console.log(decode(req.body.signed_request, consumerSecret));
    var signedRequest = decode(req.body.signed_request, consumerSecret),
        context = signedRequest.context,
        oauthToken = signedRequest.client.oauthToken,
        instanceUrl = signedRequest.client.instanceUrl,
        query = "SELECT Id, FirstName, LastName, Phone, Email, AccountId FROM Contact WHERE Id = '" + context.environment.record.Id + "'",

        contactRequest = {
            url: instanceUrl + '/services/data/v29.0/query?q=' + query,
            headers: {
                'Authorization': 'OAuth ' + oauthToken
            }


    
        };
    var accId='';
    request(contactRequest, function(err, response, body) {
        var qr = qrcode.qrcode(4, 'L'),
            contact = JSON.parse(body).records[0],
            text = 'MECARD:N:' + contact.LastName + ',' + contact.FirstName + ';TEL:' + contact.Phone + ';EMAIL:' + contact.Email + ';;';
        
            console.log(contact);
        qr.addData(text);
        qr.make();
        var imgTag = qr.createImgTag(4);
    accId=contact.AccountId;
       
        res.render('index', {context: context, imgTag: imgTag, contact:contact,signedRequestJson: JSON.stringify(context)});
    });


   /* var url = context.context.links.sobjectUrl+"Account/" + accId + "?_HttpMethod=PATCH";
    var externalId = 'TEST001';
    var accountInfo = {"Name" : "New Acc Name " + externalId};
      Sfdc.canvas.client.ajax(url,
            {	client : context.client,
                method: 'POST',
                contentType: "application/json",
                data: JSON.stringify(accountInfo),
                success : function(data) {
                    if (204 === data.status) {
                        alert("Success");
                    } else {
                        alert("Not Success result code : " + data.status);
                    }
                }
            });*/

});

app.set('port', process.env.PORT || 5000);

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});