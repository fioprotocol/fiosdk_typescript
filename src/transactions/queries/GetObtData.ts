import { GetObtDataRecord } from '../../entities/GetObtDataRecord'
import { GetObtDataResponse } from '../../entities/GetObtDataResponse'
import { GetEncryptKeyResponse } from '../../entities/GetEncryptKeyResponse'

import { Query } from './Query'

export class GetObtData extends Query<GetObtDataResponse> {
  public ENDPOINT: string = 'chain/get_obt_data'
  public fio_public_key: string
  public limit: number | undefined
  public offset: number | undefined
  public tokenCode: string
  public isEncrypted = true
  public getEncryptKey: (fioAddress: string) => Promise<GetEncryptKeyResponse>

  constructor({ fioPublicKey, limit = 0, offset = 0, tokenCode = '', getEncryptKey }: {
    fioPublicKey: string, limit?: number, offset?: number, tokenCode?: string, getEncryptKey: (fioAddress: string) => Promise<GetEncryptKeyResponse> }) {
    super()
    this.fio_public_key = fioPublicKey
    this.limit = limit
    this.offset = offset
    this.tokenCode = tokenCode
    this.getEncryptKey = getEncryptKey
  }

  public getData() {
    return { fio_public_key: this.fio_public_key, limit: this.limit || null, offset: this.offset || null }
  }

  public async decrypt(result: GetObtDataResponse): Promise<GetObtDataResponse> {
    return new Promise(async (resolve, reject) => {
      if (result.obt_data_records && result.obt_data_records.length > 0) {
        let content: {
          token_code: string;
        } | null = null;
        const contentType = 'record_obt_data_content'
        try {
          const requests = await Promise.allSettled(result.obt_data_records.map(async (obtDataRecord: GetObtDataRecord) => {
            let encryptKey = this.publicKey;
            if (obtDataRecord.payer_fio_address) {
              try {
                const payerEncryptKey = await this.getEncryptKey(obtDataRecord.payer_fio_address);
                if (payerEncryptKey && payerEncryptKey.encrypt_public_key) {
                  encryptKey = payerEncryptKey.encrypt_public_key;
                }
              } catch (error) {
                console.warn(`Get Encrypt Key for ${obtDataRecord.payer_fio_address} failed. Using publicKey.`);
                // Skip if getEncryptKey fails and continue with the publicKey
              }
            }

            try {
              if (obtDataRecord.payer_fio_public_key === encryptKey) {
                content = this.getUnCipherContent(
                  contentType,
                  obtDataRecord.content,
                  this.privateKey,
                  obtDataRecord.payee_fio_public_key,
                );
              } else {
                content = this.getUnCipherContent(
                  contentType,
                  obtDataRecord.content,
                  this.privateKey,
                  obtDataRecord.payer_fio_public_key,
                );
              }
            } catch (error) {
              console.warn(`Get UnCipher Content for ${encryptKey} failed. Return original value.`);
            }

            if (content) {
              if (this.tokenCode && content.token_code && content.token_code !== this.tokenCode) {
                return null;
              }
              obtDataRecord.content = content
            }

            return obtDataRecord;
          }));

          const fulfilledRequests: GetObtDataRecord[] = [];

          requests
            .forEach(result => result.status === 'fulfilled' && result.value && fulfilledRequests.push(result.value))

          resolve({ obt_data_records: fulfilledRequests, more: result.more });
        } catch (error) {
          reject(error);
        }
      } else {
        resolve(result);
      }
    });
  }
}
