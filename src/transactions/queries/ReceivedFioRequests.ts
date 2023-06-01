import { ReceivedFioRequestsResponse } from '../../entities/ReceivedFioRequestsResponse'
import { GetEncryptKeyResponse } from '../../entities/GetEncryptKeyResponse'
import { FioRequestsItem } from '../../entities/FioRequestsItem'

import { Query } from './Query'

export class ReceivedFioRequests extends Query<ReceivedFioRequestsResponse> {
  public ENDPOINT: string = 'chain/get_received_fio_requests'
  public fioPublicKey: string
  public limit: number | null
  public offset: number | null
  public includeEncrypted: boolean
  public isEncrypted = true
  public getEncryptKey: (fioAddress: string) => Promise<GetEncryptKeyResponse>

  constructor({ fioPublicKey, limit = null, offset = null, includeEncrypted = false, getEncryptKey }: { fioPublicKey: string, limit?: number | null, offset?: number | null, includeEncrypted?: boolean, getEncryptKey: (fioAddress: string) => Promise<GetEncryptKeyResponse> }) {
    super()
    this.fioPublicKey = fioPublicKey
    this.limit = limit
    this.offset = offset
    this.includeEncrypted = includeEncrypted
    this.getEncryptKey = getEncryptKey
  }

  public getData() {
    const data = { fio_public_key: this.fioPublicKey, limit: this.limit || null, offset: this.offset || null }

    return data
  }

  public async decrypt(result: ReceivedFioRequestsResponse): Promise<ReceivedFioRequestsResponse | undefined> {
    return new Promise(async (resolve, reject) => {
      if (result.requests.length > 0) {
        try {
          const requests = await Promise.allSettled(result.requests.map(async (value: FioRequestsItem) => {
            let encryptKey = this.publicKey;
            if (value.payer_fio_address) {
              try {
                const payerEncryptKey = await this.getEncryptKey(value.payer_fio_address);
                if (payerEncryptKey && payerEncryptKey.encrypt_public_key) {
                  encryptKey = payerEncryptKey.encrypt_public_key;
                }
              } catch (error) {
                console.warn(`Get Encrypt Key for ${value.payer_fio_address} failed. Using publicKey.`);
                // Skip if getEncryptKey fails and continue with the publicKey
              }
            }

            try {
              if (value.payer_fio_public_key === encryptKey) {
                value.content = this.getUnCipherContent(
                  'new_funds_content',
                  value.content,
                  this.privateKey,
                  value.payee_fio_public_key,
                );
              } else {
                value.content = this.getUnCipherContent(
                  'new_funds_content',
                  value.content,
                  this.privateKey,
                  value.payer_fio_public_key,
                );
              }
            } catch (error) {
              console.warn(`Get UnCipher Content for ${encryptKey} failed. Return original value.`);

              // Return original value if getUnCipherContent fails
              if (this.includeEncrypted) return value;
            }

            return value;
          }));

          const fulfilledRequests: FioRequestsItem[] = [];

          requests
            .forEach(result => result.status === 'fulfilled' && fulfilledRequests.push(result.value))

          resolve({ requests: fulfilledRequests, more: result.more });
        } catch (error) {
          reject(error);
        }
      } else {
        resolve(undefined);
      }
    });
  }
}
