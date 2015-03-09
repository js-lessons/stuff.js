function EventEmitter() {
}

<<<<<<< HEAD
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
=======
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
>>>>>>> 83223b10dac79a84e5633aa91c43edbfcda388e3
return this;
}


EventEmitter.prototype.emit = function(event, args) {
<<<<<<< HEAD
  this.subscriptions[event] = this.subscriptions[event] || [];
  args = args || [];
  this.subscriptions[event].forEach(function(fn) {
     fn.apply(this, args);
    });
return this;
=======
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
>>>>>>> 83223b10dac79a84e5633aa91c43edbfcda388e3
}


EventEmitter.prototype.once = function(event, fn) {
<<<<<<< HEAD
 var self = this;
 
 var f = function (){
   fn.apply(self, arguments);
   self.off(event, f);
 };
 this.on(event, f);
 
 return this;
=======
  this.tempObj[event] = this.tempObj[event] || [];
  this.tempObj[event].push(fn);
	return this;
>>>>>>> 83223b10dac79a84e5633aa91c43edbfcda388e3
}


module.exports = EventEmitter;
