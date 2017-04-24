// ルーティング
// /index

const express = require('express');
const config = require('../config');
const packagejson = require('../package.json')
const router = express.Router();

router.get('/', function (req, res) {
	var i18n = require('i18n');
	res.render('index', {
		ver: packagejson.version,
		serverName: config.serverName,
	});
});
 
module.exports = router;

