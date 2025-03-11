export class FioError extends Error {
    public list: Array<{ field: string, message: string }> = []
    public labelCode: string = ''
    public errorCode: number = 0
    public json: any

    constructor(message: string, code?: number, labelCode?: string, json?: any) {
        super(message)

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, FioError)
        }

        this.name = 'FioError'
        if (code) {
            this.errorCode = code
        }
        if (labelCode) {
            this.labelCode = labelCode
        }
        if (json) {
            this.json = json
        }
    }
}
