/**
 * Created by nic on 11/07/2015.
 */
var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {

    res.render('levelChoose', {}, null);
    //TODO load user data, what levels have they completed. Pass this as argument to HTML template
});

router.get('/:num', function (req, res, next) {
    var num = req.params.num;
    var db = req.db;
    var col = db.get('questions');
    col.find({level_num: parseInt(num)}, {}, function (e, docs) {
        //res.write(docs);
        res.render('freetext', {title: 'Level ' + num, level: num, questions: docs}, function () {
        });
    });
});
module.exports = router;