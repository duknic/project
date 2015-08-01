/**
 * Created by nic on 01/08/2015.
 */
var express = require('express');
var router = express.Router();
var stormpath = require('express-stormpath');
var app = require('../app');

//router.get('/', stormpath.groupsRequired(['admins']), function (req, res) {
router.get('/', function (req, res) {
    res.render('admin', {
        title: 'Admin',
        pageClass: 'admin',
        isAdmin: true,
        //givenName: req.user.givenName
    });
});

// TODO this should be admin restricted
router.get('/getQuestionUsageData', function (req, res) {
    var db = req.db;
    var col = db.get('misconceptions');
    var response = {};

    var maxQid = 0;
    // find max question id
    col.find({}, {limit: 1, sort: {questionId: -1}}, function (e, result) {
        maxQid = result[0].questionId;
        // for every question in database
        for (var i = 1; i <= maxQid; i++) {
            var qId = i.toString();
            response[qId] = {"numCorrectMis": 0, "numIncorrectMis": 0};
            col.find({questionId: i.toString()}, {}, function (err, result) {
                //console.log(result);
                for (var misCon = 0; misCon < result.length; misCon++) {
                    var isCorrect = JSON.parse(result[misCon].isCorrect);
                    isCorrect ? response[qId].numCorrectMis++ : response[qId].numIncorrectMis++;
                }
            });
        }
        res.json(response);
    });
});


function getQuesitonUsageData(callback) {
    var response = new Object();
    col.find({}, {}, function (e, docs) {
        docs.forEach(function (misCon) {
            if (response[misCon.questionId].numCorrectMis == 'undefined') {
                response[misCon.questionId].numCorrectMis = 0;
            }
            if (response[misCon.questionId].numCorrectMis == 'undefined') {
                response[misCon.questionId].numCorrectMis = 0;
            }
            misCon.isCorrect ? response[misCon.questionId].numCorrectMis++ : response[misCon.questionId].numIncorrectMis += 1;
        })
    });
}

router.get('/getQuestionUsageData/:qId', function (req, res) {
    var qId = req.params.qId;

});

module.exports = router;