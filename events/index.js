var Class = require('uclass');
var guid  = require('mout/random/guid');
var forIn  = require('mout/object/forIn');

var EventEmitter = new Class({
  Binds : ['on', 'off', 'once', 'emit'],

  callbacks : {},

  initialize : function() {
    this.addEvent = this.on;
    this.removeListener = this.off;
    this.fireEvent = this.emit;
  },

  emit:function(event, payload){
    if(!this.callbacks[event])
      return;

    var args = Array.prototype.slice.call(arguments, 1);

    forIn(this.callbacks[event], function(callback){
      callback.apply(null, args);
    });
  },


  on:function(event, callback){
    if(!this.callbacks[event])
      this.callbacks[event] = {};
    this.callbacks[event][guid()] = callback;
  },

  once:function(event, callback){
    var self = this;
    var once = function(){
      self.removeListener(event, once);
      callback.apply(null, arguments);
    };

    this.on(event, once);
  },

  off:function(event, callback){
    forIn(this.callbacks[event] || {}, function(v, k) {
      if(v == callback)
        delete this.callbacks[event][k];
    }, this);
  },
});

module.exports = EventEmitter;