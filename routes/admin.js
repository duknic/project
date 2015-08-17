/**
 * Created by nic on 01/08/2015.
 */
var express = require('express');
var router = express.Router();
var stormpath = require('express-stormpath');
var app = require('../app');

router.get('/', stormpath.groupsRequired(['admins']), function (req, res) {
//router.get('/', function (req, res) {
    //updateLevelsFix(req.client);
    res.render('admin', {
        title: 'Admin',
        pageClass: 'admin',
        isAdmin: true,
        givenName: req.user.givenName
    });
});

// TODO this should be admin restricted
router.get('/getQuestionUsageData', function (req, res) {
    var db = req.db;
    var misconceptions = db.get('misconceptions');

    misconceptions.col.aggregate(
        [
            {
                $project: {
                    questionId: 1,
                    correct: {$cond: [{$eq: ["$isCorrect", "true"]}, 1, 0]},
                    incorrect: {$cond: [{$eq: ["$isCorrect", "false"]}, 1, 0]}
                }
            },
            {
                "$group": {
                    "_id": "$questionId",
                    "correct": {"$sum": "$correct"},
                    "incorrect": {"$sum": "$incorrect"}
                }
            }
        ],
        function (err, docs) {
            if (err) console.log(err);
            res.json(docs);
        }
    );
});

router.get('/getQuestionUsageData/:isCorrect/:qId', function (req, res) {
    var db = req.db;
    var misconceptions = db.get('misconceptions');
    var qId = req.params.qId;
    var isCorrect = req.params.isCorrect;

    misconceptions.col.aggregate(
        [
            {
                $match: {
                    isCorrect: isCorrect,
                    questionId: qId
                }
            },
            {
                $project: {
                    _id: 0,
                    answer: "$answer",
                    userEmail: "$userEmail",
                    //isCorrect : 1
                }
            },
            {
                $group: {
                    _id: {answer: "$answer", userEmail: "$userEmail"},
                    diffUsers: {$sum: 1},
                }
            },
            {
                $group: {
                    _id: "$_id.answer",
                    diffUsers: {$sum: 1},
                    timesSubmitted: {$sum: "$diffUsers"}
                }
            },

        ],
        function (err, docs) {
            if (err) console.log(err);
            res.json(docs);
        }
    );

})

function getEmailAddresses(client) {
    var fs = require('fs');
    fs.writeFile('emails.html', '// EMAILS FILE\n', function (err) {
    });
    client.getDirectory('https://api.stormpath.com/v1/applications/49OK2eLCja2aZpbQaaOxYo/accounts', {expand: 'customData'}, function (err, accounts) {
        accounts.forEach(function (acc) {
            //if(acc.customData.total_score <= 0) {
                fs.appendFile('emails.html', acc.email + '\n', function (err) {
                })
            //}
        })
    })
}

function updateLevelsFix(client) {
    client.getDirectory('https://api.stormpath.com/v1/applications/49OK2eLCja2aZpbQaaOxYo/accounts', {}, function (err, accounts) {
        accounts.forEach(function (acc) {
            //console.log('getting custom data for ' + acc.givenName)
            acc.getCustomData(function(err, customData){
                if(customData.progress.maxLevel > 1) {
                    console.log(acc.givenName);
                }
                //if (typeof customData.progress.compLevels == 'undefined') {
                //    customData.progress['compLevels'] = [];
                //}
                //var max = customData.progress.maxLevel;
                //for (var i = 1; i < max;i++) {
                //    customData.progress.compLevels.push(i);
                //}
                customData.save();
            })
        })
    })
}

module.exports = router;