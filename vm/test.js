const vboxm = require('./vboxm.js');


//vboxm.clone('8a07a800-4bef-4cc7-9581-6d03a2fab45f', 'vboxm.cloneテスト');
// vboxm.delete('db7cd51b-ac5b-4915-859e-20b88bcf68c2');


let name = 'aiueo,kakikukeko???kdfajlsd';
let regResult = name.match(/^[a-zA-Z0-9!\(\)-=^~\\|@`\[{;+:*\]},<.>/?\_ ]+$/);
console.log(regResult);
