function EventEmitter() {
  this.events = {
    forOn: {},
    forOnce: {}
  };
 //this.events = {};
}


EventEmitter.prototype.on = function(event, fn) {
  this.events.forOn[event] = this.events.forOn[event] || [];
  this.events.forOn[event].push(fn);
  return this;
  
 /* this.events[event] = this.events[event] || [];
  this.events[event].push(fn);
  return this;*/
}


EventEmitter.prototype.off = function(event, fn) {
 if(!fn) {
   delete this.events.forOn[event];
 }
 if(fn&&event) {
   this.events.forOn[event].forEach(function(item, i, array) {
     if (item===fn) {
       array.splice(i, 1);
     }
   })
 }
  return this;
  /*if(!fn) {
    delete this.events[event];
  }
  if(event&&fn) {
    this.events[event].forEach(function(item, i, array) {
      if(item===fn) {
        array.splice(i, 1);
      }
    })
  }
  return this;*/
}


EventEmitter.prototype.emit = function(event, args) {
  //this.events.forOn[event] = this.events.forOn[event] || [];
  //this.events.forOnce[event] = this.events.forOnce[event] || [];
  args = args || [];
  if (event in this.events.forOnce) {
    this.events.forOnce[event].forEach(function(fn, i, array) {
        fn.apply(this, args);
        array.splice(i, 1);
    });
  }
  if (event in this.events.forOn) {
    this.events.forOn[event].forEach(function(fn) {
      fn.apply(this, args);
    });
  } else {
    this.events.forOn[event] = this.events.forOn[event] || [];
  }
 /* this.events[event] = this.events[event] || [];
  args = args || [];
  this.events[event].forEach(function(fn) {
    fn.apply(this, args);
  })*/
  return this;
}


EventEmitter.prototype.once = function(event, fn) {
  this.events.forOnce[event] = this.events.forOnce[event] || [];
  this.events.forOnce[event].push(fn);
  return this;
}

module.exports = EventEmitter;
