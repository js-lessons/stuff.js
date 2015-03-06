function EventEmitter() {
    this.events = {};
}

EventEmitter.prototype.on = function(event, fn, flag) {
    this.events[event] = this.events[event] || [];
    this.events[event].push({func:fn, flags: flag || false});
    return this;
}

EventEmitter.prototype.off = function(event, fn) {
    this.events[event] = this.events[event] || [];
    if(fn && event){
        this.events[event] = this.events[event].filter(function(elem){
            return elem['func'] !== fn;
        })
        return this;
    }
    if(event){
        delete this.events[event];
    }
    return this;
}

EventEmitter.prototype.emit = function(event, args) {
   var that = this;
   this.events[event] = this.events[event] || [];
   this.events[event].forEach(function(val){
       val['func'].apply(this, args);
       if(val['flags']){
           that.off(event, val['func']);
       }
   })
    return this;

}

EventEmitter.prototype.once = function(event, fn) {
    this.on(event, fn, true);
    return this;
}

module.exports = EventEmitter;
