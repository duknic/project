var express = require('express');
var router = express.Router();
var stormpath = require('express-stormpath');
var app = require('../app');

/* GET home page. */
router.get('/', function (req, res) {
    var userName = "";
    if (userName != 'undefined'){userName = req.user.givenName};
    res.render('index', {
        title: 'Home',
        pageClass: 'home',
        isHome: true,
        givenName: userName
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

router.post('/submitFeedback', stormpath.loginRequired, function (req, res) {
    var db = req.db;
    var feedback = db.get('feedback');
    feedback.insert(
        {
            "didLearn": req.body.didLearn,
            "arcadeMode": req.body.arcadeMode,
            "gamification": req.body.gamification,
            "moreQuestions": req.body.moreQuestions,
            "freeComment": req.body.freeComment,
            "agreement": req.body.aggreement,
            "browser": req.headers['user-agent'],
            "dateTime": new Date().toISOString()
        },
        function (err, doc) {
            if (err) throw err;
            res.status(200).send('logged feedback');
        });
});

module.exports = router;
