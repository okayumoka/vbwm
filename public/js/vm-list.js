
$(function() {
	window.VmList = (function() {
		var method = {};

		var target = '#vm-list';
		var baseUrl = '.';
		var baseDiv = $(target);
		var vmDivTemplate = null;
		var vmData = null;

		var init = function() {
			vmDivTemplate = baseDiv.find('.vm.template');

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
			baseDiv.on('click', 'button.button-vmclone', function() {
				onClickVmClone($(this).attr('uuid'));
			});
			baseDiv.on('click', 'button.button-vmdestroy', function() {
				onClickControlVm($(this).attr('uuid'), 'destroy');
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
				var vm = vmDivTemplate.clone().removeClass('template');
				vm.find('.label-name').text(d['name']);
				vm.find('.label-uuid').text(d['UUID']);
				vm.find('.label-os').text(d['Guest OS']);
				vm.find('.label-mem').text(d['Memory size']);

				vm.removeClass('state-running state-stoped')
					.addClass(d.state == 'running' ? 'running' : 'stoped');

				// vm.find('.label-state').text(getStateText(d['state']));
				vm.find('.label-state').hide();
				switch (d['state']) {
					case 'saved': 
						vm.find('.label-state.saved').show(); 
						break;
					case 'powered off':
						vm.find('.label-state.poweredoff').show(); 
						break;
					case 'paused':
						vm.find('.label-state.paused').show(); 
						break;
					case 'running':
						vm.find('.label-state.running').show(); 
						break;
					default:
						vm.find('.label-state.other').text(d['state']).show(); 
						break;
				}
				
				vm.find('[uuid="{uuid}"]').attr('uuid', d['UUID']);
				vm.show().appendTo(baseDiv);

				switch (d.state) {
					case 'saved':
					case 'powered off':
						vm.find('.button-vmstart').prop('disabled', false);
						vm.find('.button-vmstop').prop('disabled', true);
						vm.find('.button-vmresume').prop('disabled', true);
						vm.find('.button-vmpause').prop('disabled', true);
						vm.find('.button-vmpoweroff').prop('disabled', true);
						vm.find('.button-vmclone').prop('disabled', false);
						vm.find('.button-vmdestroy').prop('disabled', false);
						break;
					case 'paused':
						vm.find('.button-vmstart').prop('disabled', true);
						vm.find('.button-vmstop').prop('disabled', true);
						vm.find('.button-vmresume').prop('disabled', false);
						vm.find('.button-vmpause').prop('disabled', true);
						vm.find('.button-vmpoweroff').prop('disabled', true);
						vm.find('.button-vmclone').prop('disabled', true);
						vm.find('.button-vmdestroy').prop('disabled', true);
						break;
					case 'running':
					default:
						vm.find('.button-vmstart').prop('disabled', true);
						vm.find('.button-vmstop').prop('disabled', false);
						vm.find('.button-vmresume').prop('disabled', true);
						vm.find('.button-vmpause').prop('disabled', false);
						vm.find('.button-vmpoweroff').prop('disabled', false);
						vm.find('.button-vmclone').prop('disabled', true);
						vm.find('.button-vmdestroy').prop('disabled', true);
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
				return false;
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
				if (vmData[i].UUID == uuid) {
					return vmData[i].name;
				}
			}
			return '';
		};

		var onClickControlVm = function(uuid, action) {
			var okAction = function() {
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
			if (action == 'info') {
				okAction();
			} else if (action == 'destroy') {
				// 二回出す
				var vmName = getVmNameByUUID(uuid);
				var title = window.label.confirm;
				var message = window.message.vmdelete.replace('{0}', vmName);
				window.YesNoDialog
					.show(title, message)
					.ok(function() {
						var title = window.label.danger;
						var message = window.message.vmdelete2;
						window.YesNoDialog
						.show(title, message)
						.ok(okAction);
					});
			} else {
				var vmName = getVmNameByUUID(uuid);
				var title = window.label.confirm;
				var message = window.message[action].replace('{0}', vmName);
				window.YesNoDialog
					.show(title, message)
					.ok(okAction);
			}
		};

		var onClickVmClone = function(uuid) {
			var vmName = getVmNameByUUID(uuid);
			window.VmCloneDialog.show(uuid, vmName);
		};

		init();
		clear();
		getVmList();

		return method;
	})();
});
