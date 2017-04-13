
$(function() {
	window.VmList = (function() {
		var method = {};
		
		var target = '#vm-list';
		var baseUrl = '.';
		var baseHtml =
			'<div class="vm-list">' +
			'</div>';
		var vmHtml =
			'<div class="vm">' +
			'  <div class="label-name"></div>' +
			'  <div class="info">' +
			'    <div class="state">' +
			'      <i class="running fa fa-check-circle" aria-hidden="true"></i>' +
			'      <i class="stoped fa fa-minus-square" aria-hidden="true"></i>' +
			'      <div class="label-state"></div>' +
			'    </div>' +
			'    <div class="uuid"><div class="label-uuid"></div></div>' +
			'    <div class="os"><div class="label-os"></div></div>' +
			'    <div class="mem">Mem:<div class="label-mem"></div></div>' +
			'  </div>' +
			'  <div class="control">' +
			'    <button class="button-vminfo" uuid="{uuid}">Info</button>' +
			'    <button class="button-vmstart" uuid="{uuid}">Start</button>' +
			'    <button class="button-vmstop" uuid="{uuid}">Stop (Save state)</button>' +
			'    <button class="button-vmresume" uuid="{uuid}">Resume</button>' +
			'    <button class="button-vmpause" uuid="{uuid}">Pause</button>' +
			'    <button class="button-vmpoweroff" uuid="{uuid}">Power Off</button>' +
			'  </div>' +
			'</div>';
		var baseDiv = $(baseHtml).appendTo($(target));
		var vmData = null;

		var init = function() {
			baseDiv.on('click', 'button.button-vmstart', function() {
				onClickControlVm($(this).attr('uuid'), 'start');
			});
			baseDiv.on('click', 'button.button-vmstop', function() {
				onClickControlVm($(this).attr('uuid'), 'stop');
			});
			baseDiv.on('click', 'button.button-vmresume', function() {
				onClickControlVm($(this).attr('uuid'), 'resume');
			});
			baseDiv.on('click', 'button.button-vmpause', function() {
				onClickControlVm($(this).attr('uuid'), 'pause');
			});
			baseDiv.on('click', 'button.button-vmpoweroff', function() {
				onClickControlVm($(this).attr('uuid'), 'poweroff');
			});
			baseDiv.on('click', 'button.button-vminfo', function() {
				onClickControlVm($(this).attr('uuid'), 'info');
			});
		};

		var clear = function() {
			baseDiv.empty();
		};

		var getVmList = function() {
			window.Loading.show();
			$.ajax({
				'url': baseUrl + '/vm/list',
				'method': 'GET',
				'dataType': 'json',
				'timeout': 300000
			}).done(function(data) {
				console.log(data);
				if (checkServerError(data)) {
					vmData = data.list;
					render(data.list);
				}
				window.Loading.hide();
			}).fail(function(jqXHR, textStatus) {
				// TODO エラー処理
				window.Loading.hide();
				alert(textStatus);
			});
		};
		method.refresh = getVmList;

		var render = function(data) {
			clear();
			if (data == null || data.length == 0) {
				return;
			}

			for (var i = 0; i < data.length; i++) {
				var d = data[i];
				var vm = $(vmHtml);
				vm.find('.label-name').text(d['name']);
				vm.find('.label-uuid').text(d['UUID']);
				vm.find('.label-state').text(getStateText(d['state']));
				vm.find('.label-os').text(d['Guest OS']);
				vm.find('.label-mem').text(d['Memory size']);
				vm.removeClass('state-running state-stoped')
				.addClass(d.state == 'running' ? 'running' : 'stoped');
				//			vm.find('.state').removeClass('state-running state-stoped')
				//				.addClass(d.state == 'running' ? 'state-running' : 'state-stoped');
				vm.find('[uuid="{uuid}"]').attr('uuid', d['UUID']);
				vm.appendTo(baseDiv);

				switch (d.state) {
					case 'saved':
					case 'powered off':
					vm.find('.button-vmstart').prop('disabled', false);
					vm.find('.button-vmstop').prop('disabled', true);
					vm.find('.button-vmresume').prop('disabled', true);
					vm.find('.button-vmpause').prop('disabled', true);
					vm.find('.button-vmpoweroff').prop('disabled', true);
					break;
					case 'paused':
					vm.find('.button-vmstart').prop('disabled', true);
					vm.find('.button-vmstop').prop('disabled', true);
					vm.find('.button-vmresume').prop('disabled', false);
					vm.find('.button-vmpause').prop('disabled', true);
					vm.find('.button-vmpoweroff').prop('disabled', true);
					break;
					case 'running':
					default:
					vm.find('.button-vmstart').prop('disabled', true);
					vm.find('.button-vmstop').prop('disabled', false);
					vm.find('.button-vmresume').prop('disabled', true);
					vm.find('.button-vmpause').prop('disabled', false);
					vm.find('.button-vmpoweroff').prop('disabled', false);
					break;
				}
			}
		};

		var getStateText = function(state) {
			switch (state) {
				case 'saved':
				return 'Saved';
				case 'powered off':
				return 'Powered OFF';
				case 'paused':
				return 'Paused';
				case 'running':
				return 'Running';
				default:
				return state;
			}
		};

		var checkServerError = function(data) {
			if (data.status == null) {
				alert('サーバでエラーが発生しました。');
				return;
			}
			if (data.status != 'success') {
				alert('サーバでエラーが発生しました。' + data.message);
				return false;
			}
			return true;
		};

		var getVmNameByUUID = function(uuid) {
			if (uuid == null || vmData == null) return '';
			for (var i = 0; i < vmData.length; i++) {
				console.log(vmData[i].UUID);
				if (vmData[i].UUID == uuid) {
					return vmData[i].name;
				}
			}
			return '';
		};

		var onClickControlVm = function(uuid, action) {
			if (action != 'info') {
				var vmName = getVmNameByUUID(uuid);
				var actionName = action.substring(0,1).toUpperCase() + action.substring(1);
				var confirmMes = actionName + ' VM : ' + vmName + ' ?';
				if(!window.confirm(confirmMes)) {
					return;
				}
			}
			console.log(action + ' : ' + uuid);
			window.Loading.show();
			$.ajax({
				'url': baseUrl + '/vm/' + action + '/' + uuid,
				'method': 'GET',
				'async': true,
				'dataType': 'json',
				'timeout': 60000
			}).done(function(data) {
				window.Loading.hide();
				console.log(data);
				if (checkServerError(data)) {
					if (action == 'info') {
						VmInfo.show(data.info);
					} else {
						getVmList(); // 再読み込み
					}
				}
			}).fail(function(jqXHR, textStatus) {
				window.Loading.hide();
				alert(textStatus);
			});
		};

		var onClickVmStart = function(uuid) {
			onClickControlVm(uuid, 'start');
		};

		var onClickVmStop = function(uuid) {
			onClickControlVm(uuid, 'stop');
		};

		var onClickVmResume = function(uuid) {
			onClickControlVm(uuid, 'resume');
		};

		var onClickVmPause = function(uuid) {
			onClickControlVm(uuid, 'pause');
		};

		var onClickVmInfo = function(uuid) {
			onClickControlVm(uuid, 'info');
		};

		init();
		clear();
		getVmList();

		return method;
	})();
});
