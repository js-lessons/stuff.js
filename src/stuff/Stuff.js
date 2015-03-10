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
    var storageValues = getStoredValues(this.name);
	
    storageValues[id] = value;
    setStoredValues(this.name, storageValues);

    this.emit('add', [id, value]);
    this.emit('change', [id, value]);

    return id;
}


Stuff.prototype.remove = function(id) {
    var storageValues = getStoredValues(this.name);
	
    if (id in storageValues) {
        var deletedValue = storageValues[id];
        delete storageValues[id];
		
        setStoredValues(this.name, storageValues);

        this.emit('remove', [id, deletedValue]);
        this.emit('change', [id, undefined, deletedValue])

        return id;
    } else {
        return false;
    }
}

Stuff.prototype.get = function(id) {
    var storageValues = getStoredValues(this.name);
	
    if (id in storageValues) {
        return storageValues[id];
    }
}

Stuff.prototype.update = function(id, value) {
    var storageValues = getStoredValues(this.name);
	
    if (id in storageValues) {
        var oldValue = storageValues[id];
        storageValues[id] = value;
		
        setStoredValues(this.name, storageValues);

        this.emit('update', [id, value, oldValue]);
        this.emit('change', [id, value, oldValue]);
		
        return id;
    } else {
        return false;
    }
}

Stuff.prototype.clear = function() {
    var self = this;
    var storageValues = getStoredValues(this.name);
    var arrKeys = Object.keys(storageValues);
	
    arrKeys.forEach(function(key) {
        self.remove(key);
    });
	
    self.emit('clear');
}

Stuff.prototype.map = function(fn) {
    var storageValues = getStoredValues(this.name);
    var arrKeys = Object.keys(storageValues);

    var newArray = [];
	
    for (var i = 0; i < arrKeys.length; i++) {
        newArray.push(fn(arrKeys[i]));
    }
    return newArray;
}


Stuff.prototype.reduce = function(fn, initialValue) {
    var storageValues = getStoredValues(this.name);
    var arrKeys = Object.keys(storageValues);

    var resArr;
    if (arrKeys.length === 0 && typeof initialValue != 'undefined') {
        return initialValue;
    }

    if (arrKeys.length > 0 && typeof initialValue != 'undefined') {
        arrKeys.unshift(initialValue);
    }
    resArr = arrKeys[0];
    for (var i = 1; i < arrKeys.length; i++) {
        var resArr = fn(resArr, arrKeys[i]);
    }
    return resArr;
}



Stuff.prototype.filter = function(fn) {

    var storageValues = getStoredValues(this.name);
    var arrKeys = Object.keys(storageValues);

    var newArray = [];
    for (var i = 0; i < arrKeys.length; i++) {
        if (fn(arrKeys[i])) {
            newArray.push(arrKeys[i]);
        }
    }

    return newArray;
}


Stuff.prototype.find = function(fn) {
    var storageValues = getStoredValues(this.name);
    var arrKeys = Object.keys(storageValues);

    if (arrKeys.length !== 0) {

        for (var key in storageValues) {
            if (fn(key)) {
                return key;
            }
        }
    } else {
        return undefined;
    }
}

Stuff.prototype.forEach = function(fn) {
    var storageValues = getStoredValues(this.name);
    for (var key in storageValues) {
        fn(key);
    }
}

module.exports = Stuff;
