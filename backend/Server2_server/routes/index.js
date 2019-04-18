var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/url', function(req, res, next) {
  // const mapUrl = req.body.url;
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;

  // console.log(req.body.url);
  // res.redirect(mapUrl);

  res.render('convert', {
    latitude: latitude,
    longitude: longitude
  });

});

module.exports = router;
