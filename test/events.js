"use strict";

var expect = require('expect.js')
var Class = require('../')
var Events = require('../events')
var Options = require('../options')

var Time = new Class({
  Binds : ['add_minute', 'add_houre'],
  Implements: [Events, Options],

  foo : 'bar',

});


describe("events testing", function(){


    it("should fire every time", function(){
        var time = new Time(8, 55);
        var a = 0, inc = function(){
            a += 1;
        };
        time.on("fooa", inc);
        time.emit("fooa");

        expect(a).to.be(1);
        time.emit("fooa");
        expect(a).to.be(2);
    });


    it("should be well binded", function(){
        var time = new Time(8, 55);
        var a = 0, inc = function(){
            a += 1;
        };
        var c = {on : time.on, emit : time.emit};
        c.on("fooa", inc);
        c.emit("fooa");

        expect(a).to.be(1);
        c.emit("fooa");
        expect(a).to.be(2);
    });


    it("should allow multiple subscriptions", function(){
        var time = new Time(8, 55);
        var b = 0, a = 0, ainc = function(){
            a += 1;
        }, binc = function(){
            b += 1;
        };

        time.once("foo", ainc);
        time.on("foo", binc);


        time.emit("foo");
        expect(a).to.be(1);
        expect(b).to.be(1);
    });


    it("should support complex mixing once & on", function(){
        var time = new Time(8, 55);
        var b = 0, a = 0, ainc = function(){
            a += 1;
        }, binc = function(){
            b += 1;
        };

        time.once("foo", ainc);
        time.on("foo", binc);


        time.emit("foo");
        expect(a).to.be(1);
        expect(b).to.be(1);

        time.emit("foo");
        expect(a).to.be(1);
        expect(b).to.be(2);

    });




});




var Clock = new Class({
  Extends : Time,
  Binds   : [
    'bar',
  ],
  bar : function(){
    return this.foo; //bar from Time
  }

});


describe("derivated event testing", function(){


    it("should fire every time", function(){
        var time = new Clock(8, 55);
        var a = 0, inc = function(){
            a += 1;
        };
        time.on("fooa", inc);
        time.emit("fooa");

        expect(a).to.be(1);
        time.emit("fooa");
        expect(a).to.be(2);
    });


    it("should be well binded", function(){
        var time = new Clock(8, 55);
        expect(time.bar()).to.be('bar');
        var a = 0, inc = function(){
            a += 1;
        };
        var c = {on : time.on, emit : time.emit};
        c.on("fooa", inc);
        c.emit("fooa");

        expect(a).to.be(1);
        c.emit("fooa");
        expect(a).to.be(2);
    });






});