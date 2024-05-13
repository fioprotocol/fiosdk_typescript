import { SentFioRequestResponse } from '../../entities/SentFioRequestsResponse'
import { GetEncryptKeyResponse } from '../../entities/GetEncryptKeyResponse'
import { FioSentRequestsItem } from '../../entities/FioSentRequestsItem'
import { getEncryptKeyForUnCipherContent } from '../../utils/utils'

import { Query } from './Query'

export class SentFioRequests extends Query<SentFioRequestResponse> {
  public ENDPOINT: string = 'chain/get_sent_fio_requests'
  public fioPublicKey: string
  public limit: number | null
  public offset: number | null
  public includeEncrypted: boolean
  public isEncrypted = true
  public encryptKeys: Map<string, { privateKey: string, publicKey: string }[]> | undefined
  public getEncryptKey: (fioAddress: string) => Promise<GetEncryptKeyResponse>

  constructor({
    fioPublicKey,
    limit = null,
    offset = null,
    includeEncrypted = false,
    encryptKeys,
    getEncryptKey
  } : {
    fioPublicKey: string,
    limit?: number | null,
    offset?: number | null,
    includeEncrypted?: boolean,
    encryptKeys?: Map<string, { privateKey: string, publicKey: string }[]>,
    getEncryptKey: (fioAddress: string) => Promise<GetEncryptKeyResponse>
}) {
    super()
    this.fioPublicKey = fioPublicKey
    this.limit = limit
    this.offset = offset
    this.includeEncrypted = includeEncrypted
    this.encryptKeys = encryptKeys
    this.getEncryptKey = getEncryptKey
  }

  public getData() {
    const data = { fio_public_key: this.fioPublicKey, limit: this.limit || null, offset: this.offset || null }

    return data
  }

  public async decrypt(result: SentFioRequestResponse): Promise<SentFioRequestResponse | undefined> {
    return new Promise(async (resolve, reject) => {
      if (result.requests.length > 0) {
        try {
          const requests = await Promise.allSettled(result.requests.map(async (value: FioSentRequestsItem) => {
            let encryptPublicKeysArray: string[] = [];
            let encryptPrivateKeysArray: string[] = [];

            const { payer_fio_address, payer_fio_public_key } = value || {};

            try {
              const uncipherEncryptKey = await getEncryptKeyForUnCipherContent({
                getEncryptKey: this.getEncryptKey,
                method: 'SentFioRequests',
                fioAddress: payer_fio_address,
              });
              if (uncipherEncryptKey) {
                encryptPublicKeysArray.push(uncipherEncryptKey)
              }
            } catch (error) {
              console.error(error);
            }

            const account = this.getActor();

            if (this.encryptKeys) {
              const accountEncryptKeys = this.encryptKeys.get(account);
              if (accountEncryptKeys && accountEncryptKeys.length > 0) {
                encryptPrivateKeysArray =
                  encryptPrivateKeysArray.concat(
                    accountEncryptKeys.map(
                      (accountEncryptKey) =>
                        accountEncryptKey.privateKey
                    )
                  );
              }
            }

            if (payer_fio_public_key) {
              encryptPublicKeysArray.push(payer_fio_public_key);
            }

            encryptPublicKeysArray.push(this.publicKey);
            encryptPrivateKeysArray.push(this.privateKey);

            let content = null;

            try {
              for (let i = 0; i < encryptPublicKeysArray.length; i++) {
                const publicKey = encryptPublicKeysArray[i];
                for (let j = 0; j < encryptPrivateKeysArray.length; j++) {
                  const privateKey = encryptPrivateKeysArray[j];
                  let result = null;
                  try {
                    result = this.getUnCipherContent('new_funds_content', value.content, privateKey, publicKey);
                    if (result !== null) {
                      content = result;
                      break; // Exit the inner loop if a successful result is obtained
                    }
                  } catch (error) { }
                }
              }

              if (content === null) {
                throw new Error(`SentFioRequests: Get UnCipher Content for account ${account} failed.`); // Throw an error if all keys failed
              } else {
                value.content = content;
              }
            } catch (error) {
              if (this.includeEncrypted) return value;

              console.error(error);
              throw error;
            }

            return value;
          }));

          const fulfilledRequests: FioSentRequestsItem[] = [];

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
