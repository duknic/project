var express = require('express');
var router = express.Router();
var stormpath = require('express-stormpath');
var app = require('../app');

/* GET stats page. */
router.get('/', stormpath.loginRequired, function (req, res) {
    var client = req.client;
    var accounts = [];
    client.getDirectory('https://api.stormpath.com/v1/applications/49OK2eLCja2aZpbQaaOxYo/accounts', {expand: 'customData'}, function (err, accounts) {
        getLeaderboardData(accounts, function (leaderboardData) {
            res.render('stats', {
                title: 'Stats',
                pageClass: 'stats',
                isStats: true,
                givenName: req.user.givenName,
                leaderboardData: leaderboardData
            });
        });
    });
});


// TODO add field to leaderboardData - gameprogress, percentage
// TAKES ARRAY OF ACCOUNTS AND GENERATES LEADERBOARD DATA
function getLeaderboardData(accounts, callback) {
    var leaderboardData = new Array();
    accounts.forEach(function (acc) {
        var player = new Object();
        var createdDate = new Date(acc.createdAt);
        player.createdAt = createdDate.getFullYear() + ' | ' + (createdDate.getMonth() + 1) + ' | ' + createdDate.getDate();
        player.fullname = acc.givenName + ' ' + acc.surname;
        player.total_score = acc.customData.total_score;
        player.badges = acc.customData.badges;
        player.progenAnswered = acc.customData.progenAnswered;
        //player.maxLevel = acc.customData.progress.maxLevel;
        player.compLevels = acc.customData.progress.compLevels;
        leaderboardData.push(player);
    });

    if (typeof callback == 'function') {
        callback({"players": leaderboardData});
    }
}

module.exports = router;
