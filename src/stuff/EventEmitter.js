function EventEmitter() {
}

EventEmitter.prototype.subscriptions = {};


EventEmitter.prototype.on = function(event, fn) {
  this.subscriptions[event] = this.subscriptions[event] || [];
  this.subscriptions[event].push(fn);
	
return this;
}

EventEmitter.prototype.off = function(event, fn) {
 this.subscriptions[event] = this.subscriptions[event] || [];
 
 if( typeof fn ==='undefined'){
    delete this.subscriptions[event];
 }else{
    this.subscriptions[event].forEach(function(f, i, arr) {
     if(f===fn){
       delete arr[i];
     }
    });
}
return this;
}


EventEmitter.prototype.emit = function(event, args) {
  this.subscriptions[event] = this.subscriptions[event] || [];
  args = args || [];
  this.subscriptions[event].forEach(function(fn) {
     fn.apply(this, args);
    });
return this;
}


EventEmitter.prototype.once = function(event, fn) {
 var self = this;
 
 var f = function (){
   fn.apply(self, arguments);
   self.off(event, f);
 };
 this.on(event, f);
 
 return this;
}


module.exports = EventEmitter;
