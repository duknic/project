var express = require('express');
var router = express.Router();
var stormpath = require('express-stormpath');
var app = require('../app');

/* GET home page. */
router.get('/', stormpath.loginRequired, function (req, res) {
    res.render('index', {
        title: 'Home',
        pageClass: 'home',
        isHome: true,
        givenName: req.user.givenName
    });
});

// get userdata from client and update database
router.post('/updateUserProgress', stormpath.loginRequired, function (req, res) {
    app.writeCustomDataToAccount(req.user, req.body, function (newData) {
        app.checkForBadges(newData, function (badges) {
            res.status(200).json(badges);
        });
        console.log("server received updated user data");
    });
});

router.post('/recordMisconception/:qId/:isCorrect', stormpath.loginRequired, function (req, res) {
    var db = req.db;
    var misconceptions = db.get('misconceptions');
    var qId = decodeURIComponent(req.params.qId);
    var isCorrect = decodeURIComponent(req.params.isCorrect);
    var answer = req.body.answer;
    misconceptions.insert(
        {
            "userEmail": req.user.email,
            "questionId": qId,
            "isCorrect": isCorrect,
            "answer": answer,
            "dateTime": new Date().toISOString()
        },
        function (err, doc) {
            if (err) throw err;
            res.status(200).send('logged misconception');
        });

});

module.exports = router;
