

// メイン

const vboxm = require('./vboxm.js');


console.log('start vboxm.');
// console.log(vboxm.getVMList());
// console.log(vboxm.getRunningVMList());
//
// // vboxm.getVMInfo('テスト用マシン');
// console.log(vboxm.getVMInfo('c17423bd-f643-4963-a429-299c465dfcff'));

let vmInfoList = vboxm.getVMInfoList();

vmInfoList.forEach((vmInfo) => {
	console.log(vmInfo.Name + '  ' + vmInfo.UUID);
	console.log('  ' + vmInfo.State);
});


// vboxm.start(vmInfoList[0].UUID);
vboxm.stop(vmInfoList[0].UUID);



