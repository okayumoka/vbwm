
$(function() {
	window.YesNoDialog = (function() {
		var method = {};
		var target = '#yes-no-dialog';
		var onClickOkCallback = null;
		var onClickCancelCallback = null;

		$(target).on('click', '.yes-no-dialog-cancel', function() {
			method.hide();
			if (onClickCancelCallback) onClickCancelCallback();
		});
		$(target).on('click', '.yes-no-dialog-ok', function() {
			method.hide();
			if (onClickOkCallback) onClickOkCallback();
		});

		method.show = function(title, message, iconClass) {
			var lines = message.split(/\n/);
			var p = $(target).find('.yes-no-dialog-message').empty();
			for (var i = 0; i < lines.length; i++) {
				if (i > 0) p.append($('<br />'));
				p.append($('<span></span>').text(lines[i]));
			}
			$(target).dialog({
				autoOpen: true,
				minWidth: 500,
				modal: true,
				title: title
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

		method.cancel = function(callback) {
			onClickCancelCallback = callback;
			return method;
		};

		return method;
	})();
});
