function EventEmitter() {
}

EventEmitter.prototype.obj = {};
EventEmitter.prototype.tempObj = {};

EventEmitter.prototype.on = function(event, fn) {
  this.obj[event] = this.obj[event] || [];
  this.obj[event].push(fn);
	return this;
}

EventEmitter.prototype.off = function(event, fn) {
 this.obj[event] = this.obj[event] || [];
 this.tempObj[event] = this.tempObj[event] || [];
 
 if( typeof fn ==='undefined'){
     delete this.obj[event];
     delete this.tempObj[event];
 }else{
 
  this.obj[event].forEach(function(f, i, arr) {
    if(f===fn){
      delete arr[i];
    }
  });
  
  this.tempObj[event].forEach(function(f, i, arr) {
    if(f===fn){
      delete arr[i];
    }
  });
 }
return this;
}


EventEmitter.prototype.emit = function(event, args) {
    this.obj[event] = this.obj[event] || [];
    args = args || [];
    this.obj[event].forEach(function(fn) {
      //console.log(args)
      fn.apply(this, args);
    });
	this.tempObj[event] = this.tempObj[event] || [];
    this.tempObj[event].forEach(function(fn) {
      //console.log(args)
      fn.apply(this, args);
    });
	delete this.tempObj[event];
	
  return this;
}


EventEmitter.prototype.once = function(event, fn) {
  this.tempObj[event] = this.tempObj[event] || [];
  this.tempObj[event].push(fn);
	return this;
}


module.exports = EventEmitter;
