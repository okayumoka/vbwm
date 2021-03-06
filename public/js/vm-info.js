
$(function() {
	window.VmInfo = (function() {
		var method = {};
		var screen = '#vm-info-screen';
		var target = '#vm-info';
		var baseHtml =
			'<table class="vm-info-table">' +
			'<thead>' +
			'<tr>' +
			'</tr>' + 
			'</thead>' +
			'<tbody>' +
			'</tbody>' +
			'</table>';
		var rowHtml =
			'<tr class="vm-info-table-row">' +
			'<th class="key"></td>' +
			'<td class="value"></td>' +
			'</tr>';

		var table;
		var tbody;

		var init = function() {
			table = $(baseHtml).appendTo($(target));
			tbody = table.find('tbody');
		};

		var clear = function() {
			$(target).scrollTop(0);
			table.find('tbody').empty();
		};

		method.show = function(info) {
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

			$(screen).css({ opacity: 0 }).show();
			$(target).scrollTop(0);
			$(screen).css({ opacity: 1 }).hide();

			$(screen).plainModal('open', {
				open: function() {
					//$(target).scrollTop(0);
				}
			});
		};

		method.hide = function() {
			$(screen).plainModal('close');
		};

		init();
		clear();
		method.hide();

		return method;
	})();
});
