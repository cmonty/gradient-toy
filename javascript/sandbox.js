var Sandbox = function() {
	
	return {
		notify: function (message) {
			Core.notify(message);
		},
	
		listen: function (messageType, handler) {
			Core.listen(messageType, handler);
		}
	};	
};