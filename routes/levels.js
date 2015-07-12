/**
 * Created by nic on 11/07/2015.
 */
var express = require('express');
var router = express.Router();

router.get('/:num', function (req, res, next) {
    var num = req.params.num;
    var db = req.db;
    var col = db.get('questions');
    col.find({level_num: parseInt(num)}, {}, function (e, docs) {
        //res.write(docs);
        res.render('freetext', {title: 'Level ' + num, level: num, questions: docs}, null);

        //    function (e, docs) {
        //    //res.send(docs);
        //});
    });
});
module.exports = router;