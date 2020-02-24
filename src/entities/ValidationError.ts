export type ErrObj = {
  field: string,
  message: string
}

export class ValidationError extends Error {
  public list: ErrObj[] = []

  constructor(list: ErrObj[], ...params: any) {
    super(...params)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError)
    }

    this.name = 'ValidationError'
    this.list = list
  }
}
