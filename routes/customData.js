var express = require('express');
var router = express.Router();
//var subrouter = express.Router({mergeParams: true});
var stormpath = require('express-stormpath');
var app = require('../app');

//router.use('/:field/subfield', subrouter);

router.get('/', stormpath.loginRequired, function (req, res) {
    // TODO return this users customData json
    res.json(req.user.customData);
});

router.get('/:field', stormpath.loginRequired, function (req, res) {
    res.json(req.user.customData[req.params.field]);
});

router.get('/:field/:sub1', stormpath.loginRequired, function (req, res) {
    res.json(req.user.customData[req.params.field][req.params.sub1]);
});

router.get('/:field/:sub1/:sub2', stormpath.loginRequired, function (req, res) {
    res.json(req.user.customData[req.params.field][req.params.sub1][req.params.sub2]);
});

router.get('/:field/:sub1/:sub2/:sub3', stormpath.loginRequired, function (req, res) {
    res.json(req.user.customData[req.params.field][req.params.sub1][req.params.sub2][req.params.sub3]);
});
module.exports = router;
