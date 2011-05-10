var Core = function() {
	
	var moduleData = {};
	var listeners = {};
	
	return {
		register: function(moduleId, creator) {
			moduleData[moduleId] = {
				creator: creator,
				instance: null
			};
		},
		start: function(moduleId) {
			moduleData[moduleId].instance = moduleData[moduleId].creator(new Sandbox(this));
			moduleData[moduleId].instance.init();
		},
		startAll: function() {
			for(var moduleId in moduleData) {
				if (moduleData.hasOwnProperty(moduleId)) {
					this.start(moduleId);
				}
			}
		},
		listen: function(type, handler) {
			if (typeof listeners[type] == "undefined"){
				listeners[type] = [];
			}

			listeners[type].push(handler);
			this.listeners = listeners;
		},
		notify: function(event) {
			
			if (typeof this.listeners == "undefined") {
				this.listeners = {};
			}
			if (typeof event == "string"){
	            event = { type: event };
	        }
	        if (!event.target){
	            event.target = this;
	        }
	        if (!event.type){
	            throw new Error("Event object missing 'type' property.");
	        }
	        if (this.listeners[event.type] instanceof Array){
	            var listeners = this.listeners[event.type];
	            for (var i=0, len=listeners.length; i < len; i++){
	                listeners[i].call(this, event);
	            }
	        }
		},
		removeListener: function(type, handler) {
			if(this.listeners[type] instanceof Array){
				var listeners = this.listeners[type];
				for (var i=0, len=listeners.length; i < len; i++){
					if(listeners[i] == handler) {
	                	listeners[i].splice(i, 1);
						break;
					}
	            }
			}
		} 
	};
}();