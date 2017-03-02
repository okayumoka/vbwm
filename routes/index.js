// ルーティング
// /index

const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
    res.render('index', { title: 'VWM ver 1.0' });
});
 
module.exports = router;

