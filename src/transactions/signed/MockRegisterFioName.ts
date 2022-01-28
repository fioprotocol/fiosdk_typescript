import { Constants } from '../../utils/constants'

export class MockRegisterFioName {

  public ENDPOINT: string = '/register_fio_name'
  public ACTION: string = 'regaddress'
  public ACOUNT: string = Constants.defaultAccount
  public fioName: string
  public publicKey: string
  public server: string

  constructor(fioName: string, publicKey: string, server: string) {
    this.fioName = fioName
    this.publicKey = publicKey
    this.server = server
  }

  public async execute(): Promise<any> {
    const body = {
      fio_name: this.fioName,
      owner_fio_public_key: this.publicKey,
    }
    const options = {
      method: 'POST',
      headers: {
        "Accept": 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }

    return fetch(this.server + this.ENDPOINT, options).then((response) => {
      const statusCode = response.status
      const data = response.json()
      return Promise.all([statusCode, data])
    })
      .then(([status, data]) => {
        if (status < 200 || status > 300) {
          throw new Error(JSON.stringify({ errorCode: status, msg: data }))
        } else {
          return data
        }
      })
  }

}
