interface ExecuteCallErrorJson {
    fields?: Array<{
        error: string,
    }>,
}

interface ExecuteCallErrorRequestParams {
    fields?: Array<{
        error: string,
    }>,
}

export class ExecuteCallError extends Error {
    constructor(
        message: string,
        public errorCode = '',
        public requestParams?: ExecuteCallErrorRequestParams,
        public json?: ExecuteCallErrorJson,
    ) {
        super(message)

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ExecuteCallError)
        }

        this.name = 'ExecuteCallError'
    }
}
