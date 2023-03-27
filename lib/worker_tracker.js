
const multipart = require('./multipart')
const run = require('./run')

function workerTracker (msgPort, opts, cb) {
  const createHist = (name) => ({
    __custom: true,
    recordValue: v => updateHist(name, v),
    destroy: () => {},
    reset: () => resetHist(name)
  })

  const updateHist = (name, value) => {
    msgPort.postMessage({
      cmd: 'UPDATE_HIST',
      data: { name, value }
    })
  }

  const resetHist = (name) => {
    msgPort.postMessage({
      cmd: 'RESET_HIST',
      data: { name }
    })
  }

  const tracker = run({
    ...opts,
    ...(opts.form ? { form: multipart(opts.form) } : undefined),
    ...(opts.setupClient ? { setupClient: require(opts.setupClient) } : undefined),
    ...(opts.verifyBody ? { verifyBody: require(opts.verifyBody) } : undefined),
    requests: opts.requests
      ? opts.requests.map(r => ({
        ...r,
        ...(r.setupRequest ? { setupRequest: require(r.setupRequest) } : undefined),
        ...(r.onResponse ? { onResponse: require(r.onResponse) } : undefined)
      }))
      : undefined,
    histograms: {
      requests: createHist('requests'),
      throughput: createHist('throughput')
    },
    isChildThread: true
  }, null, cb)

  tracker.on('tick', (data) => {
    msgPort.postMessage({ cmd: 'TICK', data })
  })

  return {
    stop: tracker.stop
  }
}

module.exports = workerTracker
