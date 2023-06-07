import { PendingFioRequestsResponse } from '../../entities/PendingFioRequestsResponse'
import { GetEncryptKeyResponse } from '../../entities/GetEncryptKeyResponse'
import { FioRequestsItem } from '../../entities/FioRequestsItem'
import { getEncryptKeyForUnCipherContent } from '../../utils/utils'

import { Query } from './Query'

export class PendingFioRequests extends Query<PendingFioRequestsResponse> {
  public ENDPOINT: string = 'chain/get_pending_fio_requests'
  public fioPublicKey: string
  public limit: number | null
  public offset: number | null
  public isEncrypted = true
  public getEncryptKey: (fioAddress: string) => Promise<GetEncryptKeyResponse>

  constructor({ fioPublicKey, limit = null, offset = null, getEncryptKey }: { fioPublicKey: string, limit?: number | null, offset?: number | null, getEncryptKey: (fioAddress: string) => Promise<GetEncryptKeyResponse> }) {
    super()
    this.fioPublicKey = fioPublicKey
    this.limit = limit
    this.offset = offset
    this.getEncryptKey = getEncryptKey
  }

  public getData() {
    const data = { fio_public_key: this.fioPublicKey, limit: this.limit || null, offset: this.offset || null }

    return data
  }

  public async decrypt(result: PendingFioRequestsResponse): Promise<PendingFioRequestsResponse | undefined> {
    return new Promise(async (resolve, reject) => {
      if (result.requests.length > 0) {
        try {
          const requests = await Promise.allSettled(result.requests.map(async (value: FioRequestsItem) => {
            let encryptKey = this.publicKey;

            const { payee_fio_address, payee_fio_public_key, payer_fio_address, payer_fio_public_key } = value || {};

            try {
              encryptKey = await getEncryptKeyForUnCipherContent({
                getEncryptKey: this.getEncryptKey,
                method: 'PendingFioRequests',
                payeeFioAddress: payee_fio_address,
                payerFioAddress: payer_fio_address,
                payeePublicKey: payee_fio_public_key,
                payerPublicKey: payer_fio_public_key,
                publicKey: this.publicKey
              });
            } catch (error) {
              console.error(error);
            }

            try {
              value.content = this.getUnCipherContent(
                'new_funds_content',
                value.content,
                this.privateKey,
                encryptKey,
              );
            } catch (error) {
              console.warn(`PendingFioRequests: Get UnCipher Content for ${encryptKey} failed. Return original value.`);
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
