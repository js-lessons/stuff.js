function EventEmitter() {
	this.events = {}
}


EventEmitter.prototype.on = function(event, fn) {
	this.events[event] = this.events[event] || [];
	this.events[event].push(fn);
	return this;
}


EventEmitter.prototype.off = function(event, fn) {
	this.events[event] = this.events[event] || [];
	if(typeof fn != 'undefined'){
		this.events[event].forEach(function(f, i, arr) {
			if(f==fn){
				delete arr[i];
			}
		});
	}else{
		delete this.events[event];
	}
	return this;
}


EventEmitter.prototype.emit = function(event, args) {
	this.events[event] = this.events[event] || [];
	args = args || [];
	this.events[event].forEach(function(fn) {
		fn.apply(this, args);
	});
	return this;
}


EventEmitter.prototype.once = function(event, fn) {
	this.events[event] = this.events[event] || [];
	var _this = this;
	var fun = function() {
		fn.apply(_this, arguments);
		_this.off(event, fun);
	}
	this.on(event, fun);
	return this;
}


module.exports = EventEmitter;
