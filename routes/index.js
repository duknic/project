var express = require('express');
var router = express.Router();
var stormpath = require('express-stormpath');
var app = require('../app');

/* GET home page. */
router.get('/', stormpath.loginRequired, function (req, res) {
    res.render('index', {title: 'Home', pageClass: 'index', givenName: req.user.givenName});
});

// get userdata from client and update database
router.post('/updateUserProgress', stormpath.loginRequired, function (req, res) {
    app.writeCustomDataToAccount(req.user, req.body);
    console.log("server received updated user data");
    res.status(200).send('user data updated');
});

router.post('/recordMisconception/:qId/:isCorrect/:answer', stormpath.loginRequired, function (req, res) {
    var db = req.db;
    var misconceptions = db.get('misconceptions');
    users.insert(
        {_id: getNextSequence("misconceptions")},
        {"userEmail": req.user.email},
        {"questionId": req.params.qId},
        {"isCorrect": req.params.isCorrect},
        {"answer": req.params.answer},
        {"dateTime": new Date().toISOString()},

        function (err, doc) {
            if (err) throw err;
        });
});

module.exports = router;
