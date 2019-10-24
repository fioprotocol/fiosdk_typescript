export class ValidationError extends Error {
  public list: object[] = []

  constructor(list: object, ...params: any) {
    super(...params)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError)
    }

    this.name = 'ValidationError'
    this.list = Object.keys(list).map(key => ({ field: key, message: list[key] }))
  }
}