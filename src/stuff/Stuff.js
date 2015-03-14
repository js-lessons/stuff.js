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
  var storedValues = getStoredValues(this.name);
  storedValues[id] = value;
  setStoredValues(this.name, storedValues);

  this.emit('add', [id, value]);
  this.emit('change', [id, value]);
  
  return id;
}


Stuff.prototype.remove = function(id) {
  var storedValues = getStoredValues(this.name);
  if (id in storedValues) {
    var  removedValue = storedValues[id];
    delete storedValues[id];
    setStoredValues(this.name, storedValues);
    
    this.emit('remove', [id, removedValue]);
    this.emit('change', [id, undefined, removedValue]);
    
    return id;
  } else {
    return false;
  }
}


Stuff.prototype.get = function(id) {
  var storedValues = getStoredValues(this.name);
  if (id in storedValues) {
    return storedValues[id];
  }
}


Stuff.prototype.update = function(id, value) {
  var storedValues = getStoredValues(this.name);
  if (id in storedValues) {
    var oldValue = storedValues[id];
    storedValues[id] = value;
    setStoredValues(this.name, storedValues);
    
    this.emit('update', [id, value, oldValue]);
    this.emit('change', [id, value, oldValue]);
    
    return id;
  } else {
    return false;
  }
}


Stuff.prototype.clear = function() {
  var storedValues = getStoredValues(this.name);
  for (var key in storedValues) {
    this.remove(key);
  }
  this.emit('clear');
}


Stuff.prototype.map = function(fn) {
  var storedValues = getStoredValues(this.name);
  return Object.keys(storedValues).reduce(function(prevVal, nextVal) {
    return prevVal.concat(fn(nextVal));
  }, []);
}


Stuff.prototype.reduce = function(fn, initialValue) {
  var reducedValue;
  var storedValues = getStoredValues(this.name);
  var arr = Object.keys(storedValues);
  (initialValue!==undefined) ? reducedValue = initialValue : reducedValue = arr.shift();
  for (var i=0; i<arr.length; i++) {
    reducedValue = fn(reducedValue, arr[i]);
  }
  return reducedValue;
}


Stuff.prototype.filter = function(fn) {
  var storedValues = getStoredValues(this.name);
  return Object.keys(storedValues).reduce(function(prevVal, nextVal) {
    return fn(nextVal) ? prevVal.concat(nextVal) : prevVal;
  }, []);
}


Stuff.prototype.find = function(fn) {
  var storedValues = getStoredValues(this.name);
  for (var key in storedValues) {
    if (fn(key)) {
      return key;
      break;
    }
  }
}


Stuff.prototype.forEach = function(fn) {
  var storedValues = getStoredValues(this.name);
  for (var key in storedValues) {
    fn(key);
  }
}


module.exports = Stuff;
