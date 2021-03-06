"use strict";

var expect = require('expect.js')
var Class = require('../')
var implement = require('../implement');

var Animal = new Class({

    initialized: false,

    initialize: function(name, sound){
        this.name = name;
        this.sound = sound || '';
        this.initialized = true;
    },

    eat: function(){
        return 'animal:eat:' + this.name;
    },

    say: function(){
        return 'animal:say:' + this.name;
    }

});



var Cat = new Class({

    Extends: Animal,

    ferocious: false,

    initialize: function(name, sound){
        Cat.parent.initialize.call(this, name, sound || 'miao');
    },

    eat: function(){
        return 'cat:eat:' + this.name;
    },

    play: function(){
        return 'cat:play:' + this.name;
    }

});




var Lion = new Class({

    Extends: Cat,

    ferocious: true,

    initialize: function(name){
        Lion.parent.initialize.call(this, name, "rarr");
    },

    eat: function(){
        return 'lion:eat:' + this.name;
    }

});

var Actions = new Class({

    jump: function(){
        return 'actions:jump:' + this.name;
    },

    sleep: function(){
        return 'actions:sleep:' + this.name;
    }

});


var Attributes = new Class({

    color: function(){
        return 'attributes:color:' + this.name;
    },

    size: function(){
        return 'attributes:size:' + this.name;
    }

});





var One = new Class({})
var Two = new Class({Extends: One, initialize: function(){
    this.id = "TWO"
}})
var Three = new Class({Extends: Two});




describe("prime constructors", function(){

    it("should have the correct constructor", function(){
        var one = new One();
        expect(one.constructor).to.be(One);

        var two = new Two();
        expect(two.constructor).to.be(Two);

        var three = new Three();
        expect(three.constructor).to.be(Three);

    })

    it("should call the parent constructor, even when not explicitly set", function(){
        var one = new One();
        expect(one.id).to.be(undefined);

        var two = new Two();
        expect(two.id).to.be("TWO");

        var three = new Three();
        expect(three.id).to.be("TWO");

        expect(One.prototype.constructor).to.be.a(Function)
        expect(Three.prototype.constructor).to.be.a(Function)

    })

})

describe('prime creation', function(){

    it("should call the constructor upon instantiation", function(){
        var animal = new Animal('lamina');
        expect(animal.name).to.be('lamina');
        expect(animal.initialized).to.be.ok();
        expect(animal.say()).to.be('animal:say:lamina');
    });

    it("should use 'inherits' property to extend another prime", function(){
        var cat = new Cat('fluffy');
        expect(cat.name).to.be('fluffy');
        expect(cat.sound).to.be('miao');
        expect(cat.ferocious).to.eql(false);
        expect(cat.say()).to.be('animal:say:fluffy');
        expect(cat.eat()).to.be('cat:eat:fluffy');
        expect(cat.play()).to.be('cat:play:fluffy');
    });

    it("should use 'inherits' property to extend an extended prime", function(){
        var leo = new Lion('leo');
        expect(leo.name).to.be('leo');
        expect(leo.sound).to.be('rarr');
        expect(leo.ferocious).to.be.ok();
        expect(leo.say()).to.be('animal:say:leo');
        expect(leo.eat()).to.be('lion:eat:leo');
        expect(leo.play()).to.be('cat:play:leo');
    });

    it("should accept functions as constructors", function(){
        var Dog = new Class(function(name) {
            this.name = name;
        });
        var rover = new Dog('rover');
        expect(rover.name).to.be('rover');
    });

    it("should use mixin to implement any number of primes", function(){
        var Dog = new Class({
            Extends: Animal,
            Implements: [Actions, Attributes]
        });

        var rover = new Dog('rover');

        expect(rover.initialized).to.be.ok();
        expect(rover.eat()).to.be('animal:eat:rover');
        expect(rover.say()).to.be('animal:say:rover');
        expect(rover.jump()).to.be('actions:jump:rover');
        expect(rover.sleep()).to.be('actions:sleep:rover');
        expect(rover.size()).to.be('attributes:size:rover');
        expect(rover.color()).to.be('attributes:color:rover');

        var Fox = new Class({
            Extends: Animal,
            Implements: Actions
        });

        var roger = new Fox('roger');

        expect(roger.jump()).to.be('actions:jump:roger');
        expect(roger.sleep()).to.be('actions:sleep:roger');
    });

    it("should alter the prime's prototype when implementing new methods", function(){
        var Dog = new Class({
            Extends: Animal
        });

        var rover = new Dog('rover');

        implement(Dog, {
            jump: function(){
                return 'dog:jump:' + this.name;
            }
        });

        var spot = new Dog('spot');

        expect(spot.jump()).to.be('dog:jump:spot');
        expect(rover.jump()).to.be('dog:jump:rover');
    });

    it("should alter the prime's prototype when implementing new methods into the super prime", function(){
        var Dog = new Class({
            Extends: Animal
        });

        var rover = new Dog('rover');

        implement(Animal, {
            jump: function(){
                return 'animal:jump:' + this.name;
            }
        });

        var spot = new Dog('spot');

        expect(spot.jump()).to.be('animal:jump:spot');
        expect(rover.jump()).to.be('animal:jump:rover');
    });

    it("should alter the prime's prototype when overwriting methods in the super prime", function(){
        var Dog = new Class({
            Extends: Animal
        });

        var rover = new Dog('rover');
        expect(rover.say()).to.be('animal:say:rover');

        implement(Animal, {
            say: function(){
                return 'NEW:animal:say:' + this.name;
            }
        });

        var spot = new Dog('spot');

        expect(spot.say()).to.be('NEW:animal:say:spot');
        expect(rover.say()).to.be('NEW:animal:say:rover');
    });

});

describe('prime::implement', function(){

    it('should implement an object', function(){
        var Dog = new Class({
            Extends: Animal
        });

        implement(Dog, new Actions);

        var rover = new Dog('rover');

        expect(rover.name).to.be('rover');
        expect(rover.jump()).to.be('actions:jump:rover');
        expect(rover.sleep()).to.be('actions:sleep:rover');
    });

    it('should implement any number of objects', function(){
        var Dog = new Class({
            Extends: Animal
        });

        implement(implement(Dog, new Actions), new Attributes);

        var rover = new Dog('rover');

        expect(rover.name).to.be('rover');
        expect(rover.jump()).to.be('actions:jump:rover');
        expect(rover.sleep()).to.be('actions:sleep:rover');
        expect(rover.size()).to.be('attributes:size:rover');
        expect(rover.color()).to.be('attributes:color:rover');
    });

    it('should implement key-value objects', function(){
        var Dog = new Class({
            Extends: Animal
        });

        implement(Dog, {
            bark: function(){
                return 'woof!';
            },
            jump: function(){
                return 'jump';
            }
        });

        var rover = new Dog('rover');

        expect(rover.bark()).to.be('woof!');
        expect(rover.jump()).to.be('jump');
    });

});

describe('prime toString', function(){

    it('should allow to implement toString', function(){

        var Person = new Class({

            initialize: function(name){
                this.name = name;
            },

            toString: function(){
                return this.name;
            }

        });

        var Italian = new Class({

            Extends: Person,

            toString: function(){
                return "It's me, " + this.name;
            }

        });

        expect((new Person('Valerio')) + '').to.be('Valerio');

        expect((new Italian('Valerio')) + '').to.be("It's me, Valerio");
    });

});
