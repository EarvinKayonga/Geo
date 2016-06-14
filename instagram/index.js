var router        = require('express').Router();
var cookieParser  = require('cookie-parser');
var instagramApi  = require('instagram-node').instagram();
var fs            = require('fs');
var Bluebird      = require('bluebird');
var config        = require('./config');

Bluebird.promisifyAll(instagramApi);

/* Redirect user to Instagram for authentication */
router.get('/authorize-user', function (req, res) {
  instagramApi.use({
    client_id: config.instagram_client_id,
    client_secret: config.instagram_client_secret
  });
  res.redirect(instagramApi.get_authorization_url(config.instagram_redirect_uri));
});

/* Set cookie once Instagram sends access code */
router.get('/handleauth', function (req, res) {
  instagramApi.authorize_userAsync(req.query.code, config.instagram_redirect_uri)
  .then(function (result) {
    res.cookie('instaToken',result.access_token, { maxAge: 900000, httpOnly: true });
    res.redirect('/');
  })
  .catch(function (errors) {
    console.log(errors);
  });
});

/* Index Page */
router.get('/', function (req, res) {
  if (req.cookies.instaToken) {
    instagramApi.use({ access_token: req.cookies.instaToken });
    return instagramApi.user_self_media_recentAsync(50)
    .spread(function (medias, pagination, remaining, limit) {
      return Bluebird.all([
        /*instagramApi.mediaAsync(medias[Math.floor(Math.random() * medias.length -1) + 1].id),
        instagramApi.mediaAsync(medias[Math.floor(Math.random() * medias.length -1) + 1].id),
        instagramApi.mediaAsync(medias[Math.floor(Math.random() * medias.length -1) + 1].id)*/
      ]);
    })
    .spread(function (image1, image2, image3) {
      res.render('index', {
        image1: image1[0].images.standard_resolution.url,
        image2: image2[0].images.standard_resolution.url,
        image3: image3[0].images.standard_resolution.url,
        access_token: req.cookies.instaToken
      });
    })
    .catch(function (errors) {
      console.log(errors);
    });
  } else {
    res.render('index', {
      showLogin: true
    });
  }
});

module.exports = router;
