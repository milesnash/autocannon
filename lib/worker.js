'use strict'

const { parentPort, workerData } = require('worker_threads')
const workerTracker = require('./worker_tracker')

if (parentPort) {
  const { opts } = workerData
  let tracker
  parentPort.on('message', (msg) => {
    const { cmd } = msg

    if (cmd === 'START') {
      tracker = workerTracker(parentPort, opts, (error, data) => {
        parentPort.postMessage({ cmd: error ? 'ERROR' : 'RESULT', error, data })
        parentPort.close()
      })
    } else if (cmd === 'STOP') {
      tracker.stop()
      parentPort.close()
    }
  })
}
