
const EventEmitter = require('events');

const emitter = new EventEmitter();

const Eventname = 'FirstEvent';

emitter.on(Eventname, function(arg) {
    console.log('My first event', arg);
});

emitter.emit(Eventname, {id:1});
