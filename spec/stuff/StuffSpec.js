var expect = require('chai').expect;
var sinon = require('sinon');
var Stuff = require('../../src/stuff/Stuff');
var utils = require('../../src/stuff/utils');

function wrap(obj) { return JSON.stringify(obj); }
function unwrap(obj) { return JSON.parse(obj); }
function getStoredValues(name) { return unwrap(localStorage.getItem(name)); }


describe('Stuff', function() {
  var stuff, id, value;

  beforeEach(function() {
    localStorage.clear();
    stuff = Stuff('test');
  });

  beforeEach(function() {
    value = 'test value';
    id = stuff.add(value);
  });


  it('conforms to specific interface', function() {
    expect(stuff).to.respondTo('add');
    expect(stuff).to.respondTo('remove');
    expect(stuff).to.respondTo('get');
    expect(stuff).to.respondTo('update');
    expect(stuff).to.respondTo('clear');

    expect(stuff).to.respondTo('map');
    expect(stuff).to.respondTo('reduce');
    expect(stuff).to.respondTo('filter');
    expect(stuff).to.respondTo('forEach');
    expect(stuff).to.respondTo('find');
  });


  describe('initialize', function() {
    it('has several ways to create an instance', function() {
      expect(new Stuff('test')).to.be.an.instanceOf(Stuff);
      expect(Stuff('test')).to.be.an.instanceOf(Stuff);
      expect(Stuff.create('test')).to.be.an.instanceOf(Stuff);
    });

    it('creates a namespace in a localStorage', function() {
      expect(localStorage.test).not.to.be.undefined;
    });

    it('does not rewrite previosly created store', function() {
      var oldData = {'keyasfasf': { 'some': 'data' }};

      localStorage.setItem('OldStore', wrap(oldData));
      Stuff.create('OldStore');
      expect(getStoredValues('OldStore')).to.deep.equal(oldData);
    });

    it('rewrites previosly created store if it is not an object', function() {
      var oldData = 'some data';

      localStorage.setItem('OldStore', oldData);
      Stuff.create('OldStore');
      expect(getStoredValues('OldStore')).to.deep.equal({});
    });
  });


  describe('#add()', function() {
    it('returns entry id', function() {
      var id = 'somerandomid';
      sinon.stub(utils, 'makeId').returns(id);

      expect(stuff.add('test value')).to.equal(id);

      utils.makeId.restore();
    });

    it('saves value to localStorage', function() {
      var id = stuff.add('test value');
      expect(getStoredValues('test')[id]).to.equal('test value');
    });
  });


  describe('#remove()', function() {
    it('returns entry id if entry was removed', function() {
      expect(stuff.remove(id)).to.equal(id);
    });

    it('returns false if entry was not found', function() {
      expect(stuff.remove('unknownid')).to.be.false;
    });

    it('removes a value from localStorage', function() {
      expect(getStoredValues('test')[id]).not.to.be.undefined;
      stuff.remove(id);
      expect(getStoredValues('test')[id]).to.be.undefined;
    });
  });


  describe('#update()', function() {
    it('returns item id if it was updated', function() {
      expect(stuff.update(id, 'new test value')).to.equal(id);
    });

    it('returns false if entry was not found', function() {
      expect(stuff.update('unknownid', 'new test value')).to.be.false;
    });

    it('updates item in a localStorage', function() {
      var value = 'new test value';
      stuff.update(id, value);
      expect(getStoredValues('test')[id]).to.equal(value);
    });
  });


  describe('#get()', function() {
    it('returns an item by its id', function() {
      expect(stuff.get(id)).to.equal(value);
    });

    it('returns undefined if item was not found', function() {
      expect(stuff.get('unknownid')).to.be.undefined;
    });
  });


  describe('#clear()', function() {
    it('sets storage to its initial state', function() {
      stuff.clear();
      expect(getStoredValues('test')).to.deep.equal({});
    });
  });


  describe('collection helpers', function() {
    var ghAccounts, names;

    beforeEach(function() {
      ghAccounts = Stuff('githubAccounts');

      ghAccounts.add({ name: 'kevinsawicki', contribs: 12405, language: 'JavaScript' })
      ghAccounts.add({ name: 'michalbe', contribs: 12264, language: 'JavaScript' })
      ghAccounts.add({ name: 'taylorotwell', contribs: 7952, language: 'PHP' })
      ghAccounts.add({ name: 'michaelklishin', contribs: 7580, language: 'Ruby' })
      ghAccounts.add({ name: 'brianchandotcom', contribs: 7576, language: 'Java' })
      ghAccounts.add({ name: 'qiangxue', contribs: 7165, language: 'PHP' })
      ghAccounts.add({ name: 'fabpot', contribs: 6674, language: 'PHP' })
      ghAccounts.add({ name: 'mitchellh', contribs: 6233, language: 'Ruby' })
      ghAccounts.add({ name: 'cvrebert', contribs: 5872, language: 'JavaScript' })
      ghAccounts.add({ name: 'substack', contribs: 5757, language: 'JavaScript' })

      names = [
        'kevinsawicki',
        'michalbe',
        'taylorotwell',
        'michaelklishin',
        'brianchandotcom',
        'qiangxue',
        'fabpot',
        'mitchellh',
        'cvrebert',
        'substack'
      ];
    });


    describe('#forEach()', function() {
      it('does nothing if storage is empty', function() {
        var spy = sinon.spy();

        Stuff('new-stuff').forEach(spy);

        expect(spy.called).to.be.false;
      });

      it('calls a function for every item is storage', function() {
        var spy = sinon.spy();
        var wrapName = function(name) { return [name]; }

        ghAccounts.forEach(function(id) {
          spy(ghAccounts.get(id).name);
        });

        expect(spy.args).to.deep.equal(names.map(wrapName));
      });
    });


    describe('#reduce()', function() {
      var sumContribs = function(currentSum, id) {
        return currentSum + ghAccounts.get(id).contribs;
      };

      var minContribs = function(minId, id) {
        var current = ghAccounts.get(minId);
        var candidate = ghAccounts.get(id);
        return candidate.contribs < current.contribs ? id : minId;
      };

      it('folds stuff to single value by applying function to current value and accumulator', function() {
        var minContribsId = ghAccounts.reduce(minContribs);
        expect(ghAccounts.get(minContribsId).contribs).to.equal(5757);
      });

      it('takes a value to start folding from', function() {
        expect(ghAccounts.reduce(sumContribs, 0)).to.equal(79478);
      });

      it('works for empty storage', function() {
        expect(Stuff('empty').reduce(sumContribs, 1)).to.equal(1);
        expect(Stuff('empty').reduce(sumContribs)).to.be.undefined;
      });
    });


    describe('#map()', function() {
      var getName = function(id) {
        return ghAccounts.get(id).name;
      }

      it('returns empty array if storage is empty', function() {
        var spy = sinon.spy();

        expect(Stuff('empty').map(spy)).to.deep.equal([]);
        expect(spy.called).to.be.false;
      });

      it('maps storage values to provided function', function() {
        expect(ghAccounts.map(getName)).to.deep.equal(names);
      });
    });


    describe('#filter()', function() {
      var moreThanThousand = function(id) {
        return ghAccounts.get(id).contribs > 10000;
      }

      it('returns filtered values by applying filter function to each element', function() {
        var filteredIds = ghAccounts.filter(moreThanThousand);
        var filteredValues = filteredIds.map(ghAccounts.get.bind(ghAccounts));

        expect(filteredValues).to.deep.equal([
          { name: 'kevinsawicki', contribs: 12405, language: 'JavaScript' },
          { name: 'michalbe', contribs: 12264, language: 'JavaScript' }
        ]);
      });

      it('works for empty storage', function() {
        expect(Stuff('empty').filter(moreThanThousand)).to.deep.equal([]);
      });
    });


    describe('#find()', function() {
      var isSubstack = function(id) {
        return ghAccounts.get(id).name === 'substack';
      }

      it('returns first found value for which filter function returns true', function() {
        var id = ghAccounts.find(isSubstack);
        var substack = ghAccounts.get(id);

        expect(substack).to.deep.equal({
          name: 'substack', contribs: 5757, language: 'JavaScript'
        });
      });

      it('works for empty storage', function() {
        expect(Stuff('empty').find(isSubstack)).to.be.undefined;
      });
    });
  });


  describe('Events', function() {
    var spy;

    beforeEach(function() {
      spy = sinon.spy();
    });


    describe('add', function() {
      it('emits "add" event when new item is added', function() {
        stuff.on('add', spy);
        var id = stuff.add(value);

        expect(spy.calledWith(id, value)).to.be.true;
      });
    });


    describe('remove', function() {
      it('emits "remove" event when item is removed', function() {
        var id = stuff.add(value);

        stuff.on('remove', spy);
        stuff.remove(id);

        expect(spy.calledWith(id, value)).to.be.true;
      });
    });


    describe('update', function() {
      it('emits "update" event when item is updated', function() {
        var id = stuff.add(value);

        stuff.on('update', spy);
        stuff.update(id, 'new value');

        expect(spy.calledWith(id, 'new value', value)).to.be.true;
      });
    });

    describe('clear', function() {
      it('emits "clear" event when stuff is cleared', function() {
        stuff.on('clear', spy);
        stuff.clear();

        expect(spy.calledOnce).to.be.true;
      });

      it('emits "remove" event for every item being removed', function() {
        var id = stuff.add(value);

        stuff.on('remove', spy);
        stuff.clear();

        expect(spy.calledWith(id, value)).to.be.true;
      });
    });


    describe('change', function() {
      it('emits "change" when item is added', function() {
        stuff.on('change', spy);
        var id = stuff.add(value);

        expect(spy.calledWith(id, value, undefined)).to.be.true;
      });

      it('emits "change" when item is removed', function() {
        var id = stuff.add(value);

        stuff.on('change', spy);
        stuff.remove(id);

        expect(spy.calledWith(id, undefined, value)).to.be.true;
      });

      it('emits "change" when item is updated', function() {
        var id = stuff.add(value);

        stuff.on('change', spy);
        stuff.update(id, 'new value');

        expect(spy.calledWith(id, 'new value', value)).to.be.true;
      });
    });
  });
});
