
$(function() {
	window.VmInfo = (function() {
		var method = {};
		var target = '#vm-info';
		var baseHtml = 
			'<table class="vm-list-table">' + 
			'<thead>' + 
			'<tr>' + 
			'<th>Key</th>' + 
			'<th>Value</th>' + 
			'</tr>' + 
			'</thead>' + 
			'<tbody>' + 
			'</tbody>' + 
			'</table>';
		var rowHtml = 
			'<tr class="vm-list-table-row">' +
			'<td class="key"></td>' +
			'<td class="value"></td>' +
			'</tr>';

		var table;
		var tbody;

		var init = function() {
			table = $(baseHtml).appendTo($(target));
			tbody = table.find('tbody');
		};

		var clear = function() {
			table.find('tbody').empty();
		};

		method.show = function(info) {
			$(target).show();

			clear();
			if (info == null) {
				return;
			}

			for (var key in info) {
				var row = $(rowHtml);
				row.find('.key').text(key);
				row.find('.value').text(info[key]);
				row.appendTo(tbody);
			}
		};

		method.hide = function() {
			$(target).hide();
		};

		init();
		clear();
		method.hide();

		return method;
	})();
});

