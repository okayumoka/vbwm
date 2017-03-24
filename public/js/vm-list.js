
$(function() {

	var target = '#vm-list';
	var baseUrl = '.';
	var baseHtml = 
		'<table class="vm-list-table">' + 
		'<thead>' + 
		'<tr>' + 
		'<th>Name (UUID)</th>' + 
		'<th>State</th>' + 
		'<th>Info</th>' + 
		'<th>Start</th>' + 
		'<th>Stop</th>' + 
		'<th>Resume</th>' + 
		'<th>Pause</th>' + 
		'<th>Poser Off</th>' + 
		'</tr>' + 
		'</thead>' + 
		'<tbody>' + 
		'</tbody>' + 
		'</table>';
	var rowHtml = 
		'<tr class="vm-list-table-row">' +
		'<td><span class="label-name"></span><br>(<span class="label-uuid"></span>)</td>' +
		'<td class="label-state"></td>' +
		'<td><button class="button-vminfo" uuid="{uuid}">Info</button></td>' +
		'<td><button class="button-vmstart" uuid="{uuid}">Start</button></td>' +
		'<td><button class="button-vmstop" uuid="{uuid}">Stop (Save state)</button></td>' +
		'<td><button class="button-vmresume" uuid="{uuid}">Resume</button></td>' +
		'<td><button class="button-vmpause" uuid="{uuid}">Pause</button></td>' +
		'<td><button class="button-vmpoweroff" uuid="{uuid}">Power Off</button></td>' +
		'</tr>';

	var table;
	var tbody;

	var init = function() {
		table = $(baseHtml).appendTo($(target));
		tbody = table.find('tbody');
		table.on('click', 'button.button-vmstart', function() {
			onClickControlVm($(this).attr('uuid'), 'start');
		});
		table.on('click', 'button.button-vmstop', function() {
			onClickControlVm($(this).attr('uuid'), 'stop');
		});
		table.on('click', 'button.button-vmresume', function() {
			onClickControlVm($(this).attr('uuid'), 'resume');
		});
		table.on('click', 'button.button-vmpause', function() {
			onClickControlVm($(this).attr('uuid'), 'pause');
		});
		table.on('click', 'button.button-vmpoweroff', function() {
			onClickControlVm($(this).attr('uuid'), 'poweroff');
		});
		table.on('click', 'button.button-vminfo', function() {
			onClickControlVm($(this).attr('uuid'), 'info');
		});
	};

	var clear = function() {
		table.find('tbody').empty();
	};

	var getVmList = function() {
		window.Loading.show();
		$.ajax({
			'url': baseUrl + '/vm/list',
			'method': 'GET',
			'dataType': 'json',
			'timeout': 60000
		}).done(function(data) {
			console.log(data);
			if (checkServerError(data)) {
				drawTable(data.list);
			}
			window.Loading.hide();
		}).fail(function(jqXHR, textStatus) {
			// TODO エラー処理
			window.Loading.hide();
			alert(textStatus);
		});
	};

	var drawTable = function(data) {
		clear();
		if (data == null || data.length == 0) {
			return;
		}
		console.log(data.length);

		for (var i = 0; i < data.length; i++) {
			var d = data[i];
			var row = $(rowHtml);
			row.find('.label-name').text(d.name);
			row.find('.label-uuid').text(d.uuid);
			row.find('.label-state').text(d.state);
			// row.find('.button-vmstart').attr('uuid', d.uuid);
			// row.find('.button-vmstop').attr('uuid', d.uuid);
			// row.find('.button-vmresume').attr('uuid', d.uuid);
			// row.find('.button-vmpause').attr('uuid', d.uuid);
			// row.find('.button-vminfo').attr('uuid', d.uuid);
			row.find('[uuid="{uuid}"]').attr('uuid', d.uuid);
			row.appendTo(tbody);

			switch (d.state) {
				case 'saved':
				case 'powered off':
					row.find('.button-vmstart').prop('disabled', false);
					row.find('.button-vmstop').prop('disabled', true);
					row.find('.button-vmresume').prop('disabled', true);
					row.find('.button-vmpause').prop('disabled', true);
					row.find('.button-vmpoweroff').prop('disabled', true);
					break;
				case 'paused':
					row.find('.button-vmstart').prop('disabled', true);
					row.find('.button-vmstop').prop('disabled', true);
					row.find('.button-vmresume').prop('disabled', false);
					row.find('.button-vmpause').prop('disabled', true);
					row.find('.button-vmpoweroff').prop('disabled', true);
					break;
				case 'running':
				default:
					row.find('.button-vmstart').prop('disabled', true);
					row.find('.button-vmstop').prop('disabled', false);
					row.find('.button-vmresume').prop('disabled', true);
					row.find('.button-vmpause').prop('disabled', false);
					row.find('.button-vmpoweroff').prop('disabled', false);
					break;
			}
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

	var onClickControlVm = function(uuid, action) {
		if (action != 'info') {
			var confirmMes = action + ' VM ?\nUUID : ' + uuid;
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
});

