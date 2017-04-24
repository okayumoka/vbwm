
$(function() {
	window.VmCloneDialog = (function() {
		var method = {};
		var baseUrl = '.';
		var target = '#vm-clone-dialog';
		var uuid = null;

		$(target).on('click', '.vm-clone-dialog-cancel', function() {
			method.hide();
		});
		$(target).on('click', '.vm-clone-dialog-clone', function() {
			method.hide();
			var name = $(target).find('.vm-clone-dialog-name').val();
			if (name == '') {
				// TODO error
			} else {
				var title = window.label.confirm;
				var message = window.message.clone.replace('{0}', name);
				window.YesNoDialog
					.show(title, message)
					.ok(function() {
						createClone();
					});
			}
		});

		method.show = function(srcUuid, srcName) {
			uuid = srcUuid;
			$(target).find('.vm-clone-dialog-name').val('');
			$(target).dialog({
				autoOpen: true,
				minWidth: 500,
				modal: true,
				title: window.label.cloneTitle.replace('{0}', srcName),
				draggable: false
			});
		};

		method.hide = function() {
			$(target).dialog('close');
		};

		var createClone = function() {
			// TODO
			var name = $(target).find('.vm-clone-dialog-name').val();
			window.Loading.show();
			$.ajax({
				'url': baseUrl + '/vm/clone/' + uuid,
				'method': 'POST',
				'data': {
					name: name
				},
				'dataType': 'json',
				'timeout': 300000
			}).done(function(data) {
				console.log(data);
				if (checkServerError(data)) {
					window.VmList.refresh();
				}
				window.Loading.hide();
			}).fail(function(jqXHR, textStatus) {
				// TODO エラー処理
				window.Loading.hide();
				alert(textStatus);
			});
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

		return method;
	})();
});
