export type MockRegisterFioNameRequestProps = {
    fioName: string
    publicKey: string
    baseUrl: string,
}

export type MockRegisterFioNameRequestData = {
    fio_name: string
    owner_fio_public_key: string,
}

export class MockRegisterFioName {
    public ENDPOINT = '/register_fio_name'

    constructor(public props: MockRegisterFioNameRequestProps) {
        // TODO add some validation
    }

    // any ? -> RegisterFioAddressResponse
    public async execute(): Promise<any> {
        const body: MockRegisterFioNameRequestData = {
            fio_name: this.props.fioName,
            owner_fio_public_key: this.props.publicKey,
        }
        const options = {
            body: JSON.stringify(body),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
        }

        return fetch(this.props.baseUrl + this.ENDPOINT, options).then((response) => {
            const statusCode = response.status
            const data = response.json()
            return Promise.all([statusCode, data])
        })
            .then(([status, data]) => {
                if (status < 200 || status > 300) {
                    throw new Error(JSON.stringify({errorCode: status, msg: data}))
                } else {
                    return data
                }
            })
    }

}
