$(function() {
	window.VmRefresh = (function() {
		var method = {};
		var target = '#vm-refresh';
		var baseHtml =
			'<button class="vm-refresh-button">' +
			'  <i class="fa fa-refresh" aria-hidden="true">' +
			'  Refresh</i>' +
			'</button>';

		var button;

		var init = function() {
			button = $(baseHtml).appendTo($(target));
			button.on('click', method.refresh);
		};

		method.refresh = function() {
			console.log('refresh!');
			if (window.VmList != null) {
				window.VmList.refresh();
			}
		};

		init();

		return method;
	})();
});
