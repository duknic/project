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
    calculateUsabilityScore(req.db, function(score, numSubmissions){
        res.render('admin', {
            title: 'Admin',
            pageClass: 'admin',
            isAdmin: true,
            usabilityScore: score,
            numSubmissions: numSubmissions,
            givenName: req.user.givenName
        });
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

function calculateUsabilityScore(db, callback) {
    var usability = db.get('usability');
    // get all usability survey submissions
    usability.find({}, {}, function (err, docs) {
        var totalSum = 0.0;
        // for each submission
        docs.forEach(function (sub) {
            var sum = 0;
            // for every question in submission obj
            for (var q = 0; q <= 9; q++) {
                // get question number from JSON key e.g. 'sub3'
                var qNum = q + 1;
                // if question number is even
                if (qNum % 2 == 0) {
                    sum += 5 - sub['sus' + qNum];
                } else {
                    sum += sub['sus' + qNum] - 1;
                }
            }
            // multiple total by 2.5 to get SUS score
            totalSum += sum * 2.5;
        })
        if (typeof callback == 'function') {
            callback(Math.floor(totalSum / docs.length), docs.length);
        }
    })
}

// this was used to update all users with new levels array
function updateLevelsFix(client) {
    client.getDirectory('https://api.stormpath.com/v1/applications/49OK2eLCja2aZpbQaaOxYo/accounts', {}, function (err, accounts) {
        accounts.forEach(function (acc) {
            //console.log('getting custom data for ' + acc.givenName)
            acc.getCustomData(function (err, customData) {
                if (customData.progress.maxLevel > 1) {
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