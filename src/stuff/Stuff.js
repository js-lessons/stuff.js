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
	var storedValue = getStoredValues(this.name);
	storedValue[id] = value;
	setStoredValues(this.name, storedValue);
	
	this.emit('add', [id, value]);
	this.emit('change', [id, value]);
	
	return id;
}


Stuff.prototype.remove = function(id) {
	var storedValue = getStoredValues(this.name);
	if(storedValue.hasOwnProperty(id)){
		var last = storedValue[id];
		delete storedValue[id];
		setStoredValues(this.name, storedValue);
		this.emit('remove',[id, last]);
		this.emit('change',[id, undefined, last])
		
		return id;
	}else{
		return false;
	}
}


Stuff.prototype.get = function(id) {
	var storedValue = getStoredValues(this.name);
	if(storedValue.hasOwnProperty(id)){
		return storedValue[id];
	}
}


Stuff.prototype.update = function(id, value) {
	var storedValue = getStoredValues(this.name);
	if(storedValue.hasOwnProperty(id)){
		var last = storedValue[id];
		storedValue[id] = value;
		setStoredValues(this.name, storedValue);
		this.emit('update',[id, value, last]);
		this.emit('change',[id, value, last])
		return id;
	}else{
		return false;
	}
}


Stuff.prototype.clear = function() {
	this.emit('clear');
	var storedValue = getStoredValues(this.name);
	for (var key in storedValue){
		this.remove(key);
	};
}


Stuff.prototype.map = function(fn) {
	var storedValue = getStoredValues(this.name);
	var values = Object.keys(storedValue);
	var result = new Array();
	for (var i=0; i<values.length; i++){
		result.push(fn(values[i]));
	}
	
	return result;
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
	var storedValue = getStoredValues(this.name);
	var values = Object.keys(storedValue);
	if(values.length !== 0){
		for (var key in storedValue){
			if(fn(key)){
				return key;
			}
		};
	}else{
		return undefined;
	}
}


Stuff.prototype.forEach = function(fn) {
	var storedValue = getStoredValues(this.name);
	for (var key in storedValue) {
		fn(key);
	}
}


module.exports = Stuff;
