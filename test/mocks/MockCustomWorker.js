const CustomWorker = require('../../lib/CustomWorker')

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
      this.run()
    }
  }
}

module.exports = MockCustomWorker
