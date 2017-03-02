// ルーティング
// /api/vms

const express = require('express');
const router = express.Router();
const vboxm = require('../vm/vboxm.js');
 
router.get('/vm/list', function (req, res) {
	let vmList = vboxm.getVMInfoList();

	let data = vmList.map((info) => {
		return {
			name: info.Name,
			uuid: info.UUID,
			state: info.State.substring(0, info.State.indexOf(' (since'))
		};
	});
    res.send(data);
});

router.get('/vm/start/:uuid', function (req, res) {
	// console.log(req.params);
	// console.log(req.query);
	let stdout = vboxm.start(req.params.uuid);
    res.send({ status: 'success', message: stdout });
});

router.get('/vm/stop/:uuid', function (req, res) {
	// console.log(req.params);
	// console.log(req.query);
	let stdout = vboxm.stop(req.params.uuid);
    res.send({ status: 'success', message: stdout });
});

router.get('/vm/info/:uuid', function (req, res) {
	// console.log(req.params);
	// console.log(req.query);
	let stdout = vboxm.getVMInfo(req.params.uuid);
    res.send({ status: 'success', message: '', info: stdout });
});

module.exports = router;

