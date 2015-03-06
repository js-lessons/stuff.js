//var expect = require('chai').expect;
//var sinon = require('sinon');
//var EventEmitter = require('../../src/stuff/EventEmitter');
//
//describe('EventEmitter', function() {
//  var emitter, cb, ev;
//
//  beforeEach(function() {
//    emitter = new EventEmitter();
//    cb = sinon.spy();
//    ev = 'event';
//
//    emitter.on(ev, cb);
//  });
//
//  it('conforms to specific interface', function() {
//    expect(emitter).to.respondTo('on');
//    expect(emitter).to.respondTo('off');
//    expect(emitter).to.respondTo('emit');
//    expect(emitter).to.respondTo('once');
//  });
//
//  describe('#on()', function() {
//    it('returns link to instance for easy chaining', function() {
//      expect(emitter.on('ev', cb)).to.be.equal(emitter);
//    });
//
//    describe('when event is emitted', function() {
//      it('callback is called', function() {
//        emitter.emit(ev);
//        expect(cb.calledOnce).to.be.true;
//      });
//
//      it('callback is called twice', function() {
//        emitter.emit(ev);
//        emitter.emit(ev);
//        expect(cb.calledTwice).to.be.true;
//      });
//    });
//
//    describe('when event is not emitted', function() {
//      it('callback is not called', function() {
//        emitter.emit('other-event');
//        expect(cb.called).to.be.false;
//      });
//    });
//  });
//
//  describe('#emit()', function() {
//    it('returns link to instance for easy chaining', function() {
//      expect(emitter.emit('ev')).to.be.equal(emitter);
//    });
//
//    it('takes args for subscribers', function() {
//      var eventPayload = ['event', 'payload'];
//      emitter.emit(ev, eventPayload);
//      expect(cb.calledWith('event', 'payload')).to.be.true;
//    });
//  });
//
//  describe('#off()', function() {
//    var cb1, cb2;
//
//    beforeEach(function() {
//      cb1 = sinon.spy();
//      cb2 = sinon.spy();
//
//      emitter.on(ev, cb1);
//      emitter.on(ev, cb2);
//    });
//
//    it('returns link to instance for easy chaining', function() {
//      expect(emitter.off('ev')).to.be.equal(emitter);
//    });
//
//    it('removes all listeners for provided event', function() {
//      emitter.off(ev);
//      emitter.emit(ev);
//
//      expect(cb1.called).to.be.false;
//      expect(cb2.called).to.be.false;
//    });
//
//    it('removes specific listeners for provided event and callback', function() {
//      emitter.off(ev, cb1);
//      emitter.emit(ev);
//
//      expect(cb1.called).to.be.false;
//      expect(cb2.called).to.be.true;
//    });
//  });
//
//  describe('#once()', function() {
//    it('returns link to instance for easy chaining', function() {
//      expect(emitter.once('ev', cb)).to.be.equal(emitter);
//    });
//
//    it('fires callback only once', function() {
//      var cb = sinon.spy();
//      emitter.once(ev, cb);
//
//      emitter.emit(ev);
//      emitter.emit(ev);
//      emitter.emit(ev);
//
//      expect(cb.calledOnce).to.be.true;
//    });
//  });
//});
