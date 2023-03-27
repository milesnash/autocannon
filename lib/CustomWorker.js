const EventEmitter = require('events')

class CustomWorker extends EventEmitter {
  postMessage () {}
}

module.exports = CustomWorker
