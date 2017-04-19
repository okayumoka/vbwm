
$(function() {
	window.InformDialog = (function() {
		var method = {};
		var target = '#inform-dialog';
		var onClickOkCallback = null;

		$(target).on('click', '.inform-dialog-ok', function() {
			method.hide();
			if (onClickOkCallback) onClickOkCallback();
		});

		method.show = function(title, message, iconClass) {
			var lines = message.split(/\n/);
			var p = $(target).find('.inform-dialog-message').empty();
			for (var i = 0; i < lines.length; i++) {
				if (i > 0) p.append($('<br />'));
				p.append($('<span></span>').text(lines[i]));
			}
			$(target).dialog({
				autoOpen: true,
				minWidth: 500,
				modal: true,
				title: title,
				draggable: false
			});
			return method;
		};

		method.hide = function() {
			$(target).dialog('close');
			return method;
		};

		method.ok = function(callback) {
			onClickOkCallback = callback;
			return method;
		};

		return method;
	})();
});
