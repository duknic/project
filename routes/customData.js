var express = require('express');
var router = express.Router();
var stormpath = require('express-stormpath');
var app = require('../app');

router.get('/', stormpath.loginRequired, function (req, res) {
    // TODO return this users customData json
    res.json(req.user.customData);
});

router.get('/:field', stormpath.loginRequired, function (req, res) {
    res.json(req.user.customData[req.params.field]);
});

module.exports = router;
