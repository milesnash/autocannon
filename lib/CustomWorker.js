const EventEmitter = require('events')
const workerTracker = require('./worker_tracker')

class CustomWorker extends EventEmitter {
  id
  opts

  postMessage () {}

  run (cb) {
    const defaultCb = (error, data) => {
      this.emit('message', { cmd: error ? 'ERROR' : 'RESULT', error, data })
      this.close()
    }

    cb = cb || defaultCb

    workerTracker(this, this.opts, cb)
  }

  close () {}
}

module.exports = CustomWorker
