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
    result = 1;
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

    this.name = name;
    if (!(this instanceof Stuff)) {
        return new Stuff(name);
    }
    if (!getStoredValues(name)) {
        setStoredValues(name, {});
    } else {
        if (getStoredValues(name) === 1) {
            setStoredValues(name, {});
        }
    }
}

Stuff.create = function(name) {
    return new Stuff(name);
}


Stuff.prototype = new EventEmitter();
Stuff.prototype.add = function(value) {

    var id = utils.makeId();
    this.emit('add', [id, value]);
    var val = getStoredValues(this.name); val[id] = value;
    setStoredValues(this.name, val);
    var val = getStoredValues(this.name);
    this.emit('change', [id, val[id]]);
    return id;
}


Stuff.prototype.remove = function(id) {
    var val = getStoredValues(this.name);
    if(val.hasOwnProperty(id)){
        var last = val[id];
        this.emit('remove',[id, last]);
        delete val[id];
        setStoredValues(this.name, val);
        val = getStoredValues(this.name);
        this.emit('change',[id, val[id], last])
        return id;
    }else{
        return false;
    }
}

Stuff.prototype.get = function(id) {
    var val = getStoredValues(this.name);
    if(val.hasOwnProperty(id)){
        return val[id];
    }else{
        return undefined;
    }
}

Stuff.prototype.update = function(id, value) {
    var val = getStoredValues(this.name);
    if(val.hasOwnProperty(id)){
        var last = val[id]
        this.emit('update',[id, value, last]);
        val[id] = value;
        setStoredValues(this.name, val);
        val = getStoredValues(this.name);
        this.emit('change',[id, val[id], last])
        return id;
    }else{
        return false;
    }
}

Stuff.prototype.clear = function() {
    this.emit('clear');
    var val = getStoredValues(this.name);
    for(var key in val){
        this.emit('remove',[key, val[key]]);
    }
    setStoredValues(this.name, {});
}

Stuff.prototype.map = function(fn) {
    var val = getStoredValues(this.name);
    var array = [];
    if(Object.keys(val).length !== 0){
        for(var key in val){
            array.push(fn(key));
        }
        return array;
    }else{
        return [];
    }
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
    var array = [];
    if(Object.keys(val).length !== 0){
        for(var key in val){
            if(fn(key)){
                array.push(key);
            }
        }
    }else{
        return [];
    }
    return array;
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


//ghAccounts = Stuff('githubAccounts');
//
//ghAccounts.add({ name: 'kevinsawicki', contribs: 12405, language: 'JavaScript' })
//extend
//var destObject = extend(Stuff, EventEmitter);
//module.exports = destObject;

module.exports = Stuff;
