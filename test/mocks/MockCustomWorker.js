const CustomWorker = require('../../lib/CustomWorker')
const { encodeHist, getHistograms } = require('../../lib/histUtil')

class MockCustomWorker extends CustomWorker {
  id
  opts

  constructor (_, options) {
    super()

    const { workerData } = options

    this.id = workerData.id || ''
    this.opts = workerData.opts || {}
  }

  postMessage (value) {
    const { cmd } = value

    console.log(`Worker ${this.id}: Received ${cmd} command.`)

    if (cmd === 'START') {
      const histograms = getHistograms()
      const { latencies, requests, throughput } = histograms
      const data = {
        latencies: encodeHist(latencies),
        requests: encodeHist(requests),
        throughput: encodeHist(throughput),
        statusCodeStats: {}
      }

      this.emit('message', { cmd: 'RESULT', error: null, data })
    }
  }
}

module.exports = MockCustomWorker
