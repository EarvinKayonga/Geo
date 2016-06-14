const express = require('express'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    instagram = require('./instagram'),
    app = express();

/* App Setup */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());

/* Include our Instagram Module */
app.use('/', instagram);

app.set('port', process.env.PORT || 3000);
var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
});

module.exports = app;
