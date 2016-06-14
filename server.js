const http = require('http');
const express = require('express');
const api = require('instagram-node').instagram();
const app = express();
/*
app.configure(function() {
    // The usual...
});*/

api.use({
    client_id: "aksjahlshazsasazsa!àç!", //YOUR_CLIENT_ID,
    client_secret: "YOUR_CLIENT_SECRET"
});

var redirect_uri = 'http://yoursite.com/handleauth';

exports.authorize_user = function(req, res) {
    res.redirect(api.get_authorization_url(redirect_uri, {
        scope: ['likes'],
        state: 'a state'
    }));
};

exports.handleauth = function(req, res) {
    api.authorize_user(req.query.code, redirect_uri, function(err, result) {
        if (err) {
            console.log(err.body);
            res.send("Didn't work");
        } else {
            console.log('Yay! Access token is ' + result.access_token);
            res.send('You made it!!');
        }
    });
};

// This is where you would initially send users to authorize
app.get('/authorize_user', exports.authorize_user);
// This is your redirect URI
app.get('/handleauth', exports.handleauth);

http.createServer(app).listen(3000, function() {
    console.log("Express server listening on port " + 3000);
});
