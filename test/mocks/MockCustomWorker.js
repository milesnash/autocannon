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
        statusCodeStats: {
          '1xx': { count: 0 },
          '2xx': { count: 2 },
          '3xx': { count: 0 },
          '4xx': { count: 0 },
          '5xx': { count: 1 }
        },
        totalCompletedRequests: 2,
        totalRequests: 2,
        totalBytes: 2,
        samples: 2,
        errors: 1,
        timeouts: 1,
        mismatches: 1,
        '1xx': 0,
        '2xx': 2,
        '3xx': 0,
        '4xx': 0,
        '5xx': 1,
        non2xx: 1,
        resets: 1,
        duration: 1000,
        start: new Date(),
        finish: new Date()
      }

      this.emit('message', { cmd: 'RESULT', error: null, data })
    }
  }
}

module.exports = MockCustomWorker
