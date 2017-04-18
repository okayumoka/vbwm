// ルーティング
// /api/vms

const express = require('express');
const router = express.Router();
const vboxm = require('../vm/vboxm.js');

router.get('/vm/list', function (req, res) {
	let vmList = vboxm.getVMInfoList();


	vmList.forEach((info) => {
		info.state = info.State.substring(0, info.State.indexOf(' (since'))
	});
	res.send({ action: 'list', status: 'success', list: vmList});
	// let list = vmList.map((info) => {
	// 	return {
	// 		name: info.name,
	// 		uuid: info.UUID,
	// 		state: info.State.substring(0, info.State.indexOf(' (since'))
	// 		os: info['']
	// 	};
	// });
	// res.send({ action: 'list', status: 'success', list: list});
});

router.get('/vm/start/:uuid', function (req, res) {
	let stdout = vboxm.start(req.params.uuid);
    res.send({ action: 'start', status: 'success', message: stdout });
});

router.get('/vm/stop/:uuid', function (req, res) {
	let stdout = vboxm.stop(req.params.uuid);
    res.send({ action: 'stop', status: 'success', message: stdout });
});

router.get('/vm/resume/:uuid', function (req, res) {
	let stdout = vboxm.resume(req.params.uuid);
    res.send({ action: 'resume', status: 'success', message: stdout });
});

router.get('/vm/pause/:uuid', function (req, res) {
	let stdout = vboxm.pause(req.params.uuid);
    res.send({ action: 'pause', status: 'success', message: stdout });
});

router.get('/vm/poweroff/:uuid', function (req, res) {
	let stdout = vboxm.poweroff(req.params.uuid);
    res.send({ action: 'poweroff', status: 'success', message: stdout });
});

router.get('/vm/info/:uuid', function (req, res) {
	let stdout = vboxm.getVMInfo(req.params.uuid);
    res.send({ action: 'info', status: 'success', message: '', info: stdout });
});

router.post('/vm/clone/:uuid', function (req, res) {
	let stdout = vboxm.clone(req.params.uuid, req.body.name);
    res.send({ action: 'clone', status: 'success', message: stdout});
});

router.get('/vm/destroy/:uuid', function (req, res) {
	let stdout = vboxm.delete(req.params.uuid);
    res.send({ action: 'destroy', status: 'success', message: stdout});
});


module.exports = router;
