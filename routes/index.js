var express = require('express');
var router = express.Router();
var stormpath = require('express-stormpath');
var app = require('../app');

/* GET home page. */
router.get('/', stormpath.loginRequired, function (req, res, next) {

    res.render('index', {title: 'Home', givenName: req.user.givenName});

});

router.get('/secret', stormpath.loginRequired, function (req, res) {
    res.send('your email address is: ');
});

router.get('/getCustomData', stormpath.loginRequired, function (req, res) {
    // TODO return this users customData json
    res.json(req.user.customData);
})

// get userdata from client and update database
router.post('/updateUserProgress', stormpath.loginRequired, function (req, res) {
    app.writeCustomDataToAccount(req.user, req.body);
    console.log("server received updated user data");
    res.status(200).send('user data updated');
});

module.exports = router;
