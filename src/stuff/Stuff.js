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
}

Stuff.create = function(name) {
}


Stuff.prototype.add = function(value) {
}


Stuff.prototype.remove = function(id) {
}


Stuff.prototype.get = function(id) {
}


Stuff.prototype.update = function(id, value) {
}


Stuff.prototype.clear = function() {
}


Stuff.prototype.map = function(fn) {
}


Stuff.prototype.reduce = function(fn, initialValue) {
}


Stuff.prototype.filter = function(fn) {
}


Stuff.prototype.find = function(fn) {
}


Stuff.prototype.forEach = function(fn) {
}


module.exports = Stuff;
