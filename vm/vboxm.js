const iconv = require('iconv-lite');
const execSync = require('child_process').execSync;
const config = require('../config');

const basePath = config.basePath;
const managerPath = config.managerPath;
const encoding = config.encoding;
const uuidLength = config.uuidLength;

// VBoxManage list を実行する
var execListVms = function(opt = 'vms') {
	let stdout = execSync(managerPath + ' list ' + opt);
	let stdoutStr = iconv.decode(stdout, encoding);

	let lines = stdoutStr.split(/\r\n|\n|\r/);
	let list = []; 
	lines.forEach((line) => {
		line = line.trim();
		if (line == '') return;
		let uuid = line.slice(-uuidLength + 1, -1).slice();
		let name = line.slice(1, line.length - uuidLength - 2);
		list.push({ name, uuid });
	});
	// console.log(list);
	return list;
}

/**
 * VMの一覧を取得
 * @return {Array.Object} VMの一覧 {name, uuid}
 */
exports.getVMList = function() {
	return execListVms('vms');
};

/**
 * 実行中のVMの一覧を取得
 * @return {Array.Object} VMの一覧 {name, uuid}
 */
exports.getRunningVMList = function() {
	return execListVms('runningvms');
};

/**
 * VM情報を取得
 * @param {String} uuid UUID、またはVM名
 * @return {Object} VM情報
 */
exports.getVMInfo = function(uuid) {
	let stdout = execSync(managerPath + ' showvminfo ' + uuid);
	let stdoutStr = iconv.decode(stdout, encoding);

	let lines = stdoutStr.split(/\r\n|\n|\r/);
	let map = {}; 
	lines.forEach((line) => {
		line = line.trim();
		if (line == '') return;

		let colon = line.indexOf(':');
		if (colon === -1) return;

		let key = line.substring(0, colon);
		let value = line.substring(colon + 1).trim();
		map[key] = value;
	});
	return map;
};

/**
 * すべてのVMの情報を取得
 * @return {Array.Object} vm情報リスト
 */
exports.getVMInfoList = function() {
	let vmList = exports.getVMList();
	console.log(vmList);

	let infoList = [];
	vmList.forEach((vm) => {
		let info = exports.getVMInfo(vm.uuid);
		info.name = vm.name;
		infoList.push(info);
	});
	return infoList;
};

exports.start = function(uuid) {
	let cmd = `${managerPath} startvm --type headless ${uuid}`;
	let stdout = execSync(cmd);
	return iconv.decode(stdout, encoding);
};

exports.stop = function(uuid) {
	let cmd = `${managerPath} controlvm ${uuid} savestate`;
	let stdout = execSync(cmd);
	return iconv.decode(stdout, encoding);
};

exports.resume = function(uuid) {
	let cmd = `${managerPath} controlvm ${uuid} resume`;
	let stdout = execSync(cmd);
	return iconv.decode(stdout, encoding);
};

exports.pause = function(uuid) {
	let cmd = `${managerPath} controlvm ${uuid} pause`;
	let stdout = execSync(cmd);
	return iconv.decode(stdout, encoding);
};

exports.poweroff = function(uuid) {
	let cmd = `${managerPath} controlvm ${uuid} poweroff`;
	let stdout = execSync(cmd);
	return iconv.decode(stdout, encoding);
};

exports.acpipowerbutton = function(uuid) {
	let cmd = `${managerPath} controlvm ${uuid} acpipowerbutton`;
	let stdout = execSync(cmd);
	return iconv.decode(stdout, encoding);
};

exports.reset = function(uuid) {
	let cmd = `${managerPath} controlvm ${uuid} reset`;
	let stdout = execSync(cmd);
	return iconv.decode(stdout, encoding);
};





