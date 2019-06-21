class DinoException extends Error {
  // constructor(message) {
  //   super(message)

  //   this.name = this.constructor.name;
  //   // this.status = 404
  //   this.exceptionMessage = message;
  // }

  constructor(opt) {
    super(opt.message)

    this.name = this.constructor.name;
    // this.status = 404
    this.exceptionMessage = opt.message;
    this.error = opt.error
  }

  statusCode() {
    return this.status
  }
}

module.exports = DinoException