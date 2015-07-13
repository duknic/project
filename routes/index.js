var express = require('express');
var router = express.Router();
var stormpath = require('express-stormpath');

/* GET home page. */
router.get('/', stormpath.loginRequired, function (req, res, next) {

    res.render('index', {title: 'Home', givenName: req.user.givenName});

});

router.get('/secret', stormpath.loginRequired, function (req, res) {
    res.send('your email address is: ');
});

module.exports = router;
