// アプリケーション エントリポイント


const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');

const app = express();


//app.use(app.router);

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


// トップ画面
app.use('/', require('./routes/index.js'));
app.use('/', require('./routes/vms.js'));


// 3000ポートで待ち受け開始
app.listen(3000);
console.log('server starting. port:3000');
