function EventEmitter() {
 this.events = {};
}


EventEmitter.prototype.on = function(event, fn) {
  this.events[event] = this.events[event] || [];
  this.events[event].push(fn);
  return this;
}


EventEmitter.prototype.off = function(event, fn) {
  if(!fn) {
    delete this.events[event];
  }
  if(event&&fn) {
    this.events[event].forEach(function(item, i, array) {
      if(item===fn) {
        array.splice(i, 1);
      }
    })
  }
  return this;
}


EventEmitter.prototype.emit = function(event, args) {
  this.events[event] = this.events[event] || [];
  args = args || [];
  this.events[event].forEach(function(fn) {
    fn.apply(this, args);
  })
  return this;
}


EventEmitter.prototype.once = function(event, fn) {
  this.events[event] = this.events[event] || [];
  var that = this;
  var func = function() {
    fn.apply(that, arguments);
    that.off(event, func);
  }
  this.on(event, func);
  return this;
}

module.exports = EventEmitter;
