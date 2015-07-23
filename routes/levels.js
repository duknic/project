/**
 * Created by nic on 11/07/2015.
 */
var express = require('express');
var router = express.Router();
var stormpath = require('express-stormpath');
//var randexp = require('randexp');

router.get('/', stormpath.loginRequired, function (req, res, next) {
    var levelData = req.user.customData;
    res.render('levelChoose', {
        givenName: req.user.givenName,
        levelData: levelData,
        pageClass: 'levels',
        isLevels: true
    }, null);
    //TODO load user data, what levels have they completed. Pass this as argument to HTML template
});

router.get('/progen', stormpath.loginRequired, function (req, res) {
    res.render('progen', {
        title: 'Arcade mode',
        pageClass: 'progen',
        givenName: req.user.givenName,
        isProgen: true
    }, null);
});

router.get('/:num', stormpath.loginRequired, function (req, res, next) {
    var levelData = req.user.customData;
    var num = req.params.num;
    var db = req.db;
    var col = db.get('questions');
    col.find({level_num: parseInt(num)}, {}, function (e, docs) {
        console.log(docs);
        res.render('freetext', {
            pageClass: 'freetext',
            title: 'Level ' + num,
            level: num,
            questions: docs,
            givenName: req.user.givenName,
            levelData: levelData
        }, null);
    });
});

module.exports = router;