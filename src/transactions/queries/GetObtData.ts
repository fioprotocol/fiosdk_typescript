import { GetObtDataRecord } from '../../entities/GetObtDataRecord'
import { GetObtDataResponse } from '../../entities/GetObtDataResponse'
import { Query } from './Query'

export class GetObtData extends Query<GetObtDataResponse> {
  public ENDPOINT: string = 'chain/get_obt_data'
  public fio_public_key: string
  public limit: number | null
  public offset: number | null
  public tokenCode: string
  public isEncrypted = true

  constructor(fioPublicKey: string, limit: number = 0, offset: number = 0, tokenCode: string = '') {
    super()
    this.fio_public_key = fioPublicKey
    this.limit = limit
    this.offset = offset
    this.tokenCode = tokenCode
  }

  public getData() {
    return { fio_public_key: this.fio_public_key, limit: this.limit || null, offset: this.offset || null }
  }

  public decrypt(result: any): any {
    if (result.obt_data_records && result.obt_data_records.length > 0) {
      const obtDataRecords: GetObtDataRecord[] = []
      result.obt_data_records.forEach((obtDataRecord: GetObtDataRecord) => {
        let content
        const contentType = 'record_obt_data_content'
        try {
          if (obtDataRecord.payer_fio_public_key === this.publicKey) {
            content = this.getUnCipherContent(
              contentType,
              obtDataRecord.content,
              this.privateKey,
              obtDataRecord.payee_fio_public_key,
            )
          } else {
            content = this.getUnCipherContent(
              contentType,
              obtDataRecord.content,
              this.privateKey,
              obtDataRecord.payer_fio_public_key,
            )
          }
        } catch (e) {
          // UnCipherContent error
          // console.log(e)
        }
        if (content) {
          if (this.tokenCode && content.token_code && content.token_code !== this.tokenCode) { return }
          obtDataRecord.content = content
        }
        obtDataRecords.push(obtDataRecord)
      })
      return { obt_data_records: obtDataRecords, more: result.more }
    } else {
      return result
    }

  }
}
