// オブザーバーの生成
// window.observer = (function() {
// 	var method = {};
// 	var callbackMap = {};
//
// 	method.on = function(eventName, callback) {
// 		if (callback != null) {
// 			callbackMap[eventName] = callback;
// 		} else {
// 			delete callbackMap[eventName];
// 		}
// 	};
//
// 	method.fire = function(eventName, params) {
// 		var callback = callbackMap[eventName];
// 		if (typeof callback === 'function') {
// 			callback(params);
// 		}
// 	};
//
// 	return method;
// })();


// ローディング表示
$(function() {
	window.Loading = (function() {

		var method = {};
		var baseHtml = 
			'<div class="wrapper">' +
			'<div class="center">' +
			'<div class="loader"></div>' + 
			'<span class="message"></span>'
			'</div>';
			'</div>';
		var wrapperCss = {
			'position': 'fixed',
			'top': '0',
			'right': '0',
			'bottom': '0',
			'left': '0',
			'margin': '0',
			'padding': '0',
			'width': '100%',
			'height': '100%',
			'z-index': '100',
			'background': 'rgba(0,0,0,0.5)'
		};
		var centerCss = {
			'position': 'absolute',
			'top': '50%',
			'left': '50%',
			'color': '#ffffff',
			'transform': 'translateY(-50%) translateX(-50%) ',
			'margin-top': '0'
		};
		var loaderCss = {
			// 特になし
		};

		// 初期化
		var $loader = $(baseHtml).appendTo($('body'));
		$loader.css(wrapperCss);
		$loader.find('div.center').css(centerCss);
		$loader.find('div.loader').css(loaderCss);
		$loader.hide();

		var visible = false;

		// メソッド類
		method.show = function(message) {
			if (visible) {
				// すでに表示されている
				return;
			}
			$loader.show();
			visible = true;
			var $message = $loader.find('.message');
			if (message != null) {
				$message.text(message);
			} else {
				$message.empty();
			}
			// 操作ができないようにする
			var body = $('body');
			body.on('keydown.loading-keydown', function(event) {
				$loader.focus();
				event.preventDefault();
			});
			body.on('mousedown.loading-mousedown', function(event) {
				$loader.focus();
				event.preventDefault();
			});
		};

		method.hide = function() {
			visible = false;
			$loader.hide();
			var body = $('body');
			body.off('keydown.loading-keydown');
			body.off('mousedown.loading-mousedown');
		};


		return method;
	})();
});


