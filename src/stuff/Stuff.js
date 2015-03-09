var utils = require('./utils');
var EventEmitter = require('./EventEmitter');
var extend = require('node.extend');

function wrap(obj) {
  return JSON.stringify(obj);
}

function unwrap(obj) {
  var result;

  try {
    result = JSON.parse(obj);
  } catch (e) {
    console.error(e);
  }
  return result;
}

function getStoredValues(name) {
  return unwrap(localStorage.getItem(name));
}

function setStoredValues(name, storedValues) {
  localStorage.setItem(name, wrap(storedValues));
}

function Stuff(name) {

    if (!(this instanceof Stuff)) {
        return new Stuff(name);
    }

    if (!getStoredValues(name)) {
        setStoredValues(name, {});
    }

    this.name = name;
}

Stuff.create = function(name) {
    return new Stuff(name);
}


Stuff.prototype = new EventEmitter();
Stuff.prototype.add = function(value) {

    var id = utils.makeId();
    var val = getStoredValues(this.name); val[id] = value;
    setStoredValues(this.name, val);

    this.emit('add', [id, value]);
    this.emit('change', [id, value]);

    return id;
}


Stuff.prototype.remove = function(id) {
    var val = getStoredValues(this.name);
    if(val.hasOwnProperty(id)){
        var last = val[id];
        delete val[id];
        setStoredValues(this.name, val);

        this.emit('remove',[id, last]);
        this.emit('change',[id, undefined, last])

        return id;
    }else{
        return false;
    }
}

Stuff.prototype.get = function(id) {
    var val = getStoredValues(this.name);
    if(val.hasOwnProperty(id)){
        return val[id];
    }
}

Stuff.prototype.update = function(id, value) {
    var val = getStoredValues(this.name);
    if(val.hasOwnProperty(id)){
        var last = val[id];
        val[id] = value;
        setStoredValues(this.name, val);

        this.emit('update',[id, value, last]);
        this.emit('change',[id, value, last])
        return id;
    }else{
        return false;
    }
}

Stuff.prototype.clear = function() {
    this.emit('clear');
    var val = getStoredValues(this.name);
    for(var key in val){
        this.remove(key);
    }
}

Stuff.prototype.map = function(fn) {
    var val = getStoredValues(this.name);

    return Object.keys(val).reduce(function(prev,item){
        return prev.concat(fn(item));
    },[])
}

Stuff.prototype.reduce = function(fn, initialValue) {
    var current;
    var val = getStoredValues(this.name);

    if(typeof initialValue === 'number'){
        current = initialValue;
    }
    for(var key in val){
        if(!current && current !== 0){
          current = key;
            continue;
        }
        current = fn(current,key);
    }
    return current;
}

Stuff.prototype.filter = function(fn) {
    var val = getStoredValues(this.name);

    return Object.keys(val).reduce(function(prev,item){
        if(fn(item)){
            return prev.concat(item);
        }else{
            return prev;
        }
    },[])
}

Stuff.prototype.find = function(fn) {
    var val = getStoredValues(this.name);
    if(Object.keys(val).length !== 0){
        for(var key in val){
            if(fn(key)){
                return key;
            }
        }
    }else{
        return undefined;
    }
}

Stuff.prototype.forEach = function(fn) {
   var val = getStoredValues(this.name);
   for(var key in val){
       fn(key);
   }
}

module.exports = Stuff;
