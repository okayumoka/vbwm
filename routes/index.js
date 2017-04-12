// ルーティング
// /index

const express = require('express');
const config = require('../config');
const packagejson = require('../package.json')
const router = express.Router();

router.get('/', function (req, res) {
	res.render('index', {
		title: 'VirtualBox Web Manager',
		ver: packagejson.version,
		serverName: config.serverName
	});
});
 
module.exports = router;

