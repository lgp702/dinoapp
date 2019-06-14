class DinoException extends Error {
  constructor(message) {
    super(message)

    this.name = this.constructor.name
    this.status = 404
    this.exception = message
  }

  statusCode() {
    return this.status
  }
}

module.exports = DinoException