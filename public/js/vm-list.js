
$(function() {

	var target = '#vm-list';
	var baseUrl = '.';
	var baseHtml = 
		'<table class="vm-list-table">' + 
		'<thead>' + 
		'<tr>' + 
		'<th>Name</th>' + 
		'<th>UUID</th>' + 
		'<th>State</th>' + 
		'<th>Start</th>' + 
		'<th>Stop</th>' + 
		'<th>Info</th>' + 
		'</tr>' + 
		'</thead>' + 
		'<tbody>' + 
		'</tbody>' + 
		'</table>';
	var rowHtml = 
		'<tr class="vm-list-table-row">' +
		'<td class="label-name"></td>' +
		'<td class="label-uuid"></td>' +
		'<td class="label-state"></td>' +
		'<td><button class="button-vmstart">Start</button></td>' +
		'<td><button class="button-vmstop">Stop</button></td>' +
		'<td><button class="button-vminfo">Info</button></td>' +
		'</tr>';

	var table;
	var tbody;

	var init = function() {
		table = $(baseHtml).appendTo($(target));
		tbody = table.find('tbody');
		table.on('click', 'button.button-vmstart', function() {
			onClickVmStart($(this).attr('uuid'));
		});
		table.on('click', 'button.button-vmstop', function() {
			onClickVmStop($(this).attr('uuid'));
		});
		table.on('click', 'button.button-vminfo', function() {
			onClickVmInfo($(this).attr('uuid'));
		});
	};

	var clear = function() {
		table.find('tbody').empty();
	};

	var getVmList = function() {
		window.Loading.show();
		$.ajax({
			url: baseUrl + '/vm/list',
			method: 'GET',
			dataType: 'json'
		}).done(function(data) {
			console.log(data);
			drawTable(data);
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
			row.find('.button-vmstart').attr('uuid', d.uuid);
			row.find('.button-vmstop').attr('uuid', d.uuid);
			row.find('.button-vminfo').attr('uuid', d.uuid);
			row.appendTo(tbody);
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

	var onClickVmStart = function(uuid) {
		window.Loading.show();
		$.ajax({
			'url': baseUrl + '/vm/start/' + uuid,
			'method': 'GET',
			'async': true,
			'dataType': 'json'
		}).done(function(data) {
			window.Loading.hide();
			console.log(data);
			if (checkServerError(data)) {
				getVmList(); // 再読み込み
			}
		}).fail(function(jqXHR, textStatus) {
			window.Loading.hide();
			alert(textStatus);
		});
	};

	var onClickVmStop = function(uuid) {
		window.Loading.show();
		$.ajax({
			'url': baseUrl + '/vm/stop/' + uuid,
			'method': 'GET',
			'async': true,
			'dataType': 'json'
		}).done(function(data) {
			window.Loading.hide();
			console.log(data);
			if (checkServerError(data)) {
				getVmList(); // 再読み込み
			}
		}).fail(function(jqXHR, textStatus) {
			window.Loading.hide();
			alert(textStatus);
		});
	};

	var onClickVmInfo = function(uuid) {
		window.Loading.show();
		$.ajax({
			'url': baseUrl + '/vm/info/' + uuid,
			'method': 'GET',
			'async': true,
			'dataType': 'json'
		}).done(function(data) {
			window.Loading.hide();
			console.log(data);
			if (checkServerError(data)) {
				window.VmInfo.show(data.info);
			}
		}).fail(function(jqXHR, textStatus) {
			window.Loading.hide();
			alert(textStatus);
		});
	};

	init();
	clear();
	getVmList();
});

