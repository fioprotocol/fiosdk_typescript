import { GetObtDataRecord } from '../../entities/GetObtDataRecord'
import { GetObtDataResponse } from '../../entities/GetObtDataResponse'
import { GetEncryptKeyResponse } from '../../entities/GetEncryptKeyResponse'
import { getEncryptKeyForUnCipherContent } from '../../utils/utils'

import { Query } from './Query'

export class GetObtData extends Query<GetObtDataResponse> {
  public ENDPOINT: string = 'chain/get_obt_data'
  public fio_public_key: string
  public limit: number | undefined
  public offset: number | undefined
  public tokenCode: string
  public includeEncrypted: boolean
  public encryptKeys: Map<string, { privateKey: string, publicKey: string } []> | undefined
  public isEncrypted = true
  public getEncryptKey: (fioAddress: string) => Promise<GetEncryptKeyResponse>

  constructor({ fioPublicKey, limit = 0, offset = 0, tokenCode = '', includeEncrypted = false, encryptKeys, getEncryptKey }: {
    fioPublicKey: string,
    limit?: number,
    offset?: number,
    tokenCode?: string,
    includeEncrypted: boolean,
    encryptKeys?: Map<string, { privateKey: string, publicKey: string }[]>,
    getEncryptKey: (fioAddress: string) => Promise<GetEncryptKeyResponse>
  }) {
    super()
    this.fio_public_key = fioPublicKey
    this.limit = limit
    this.offset = offset
    this.tokenCode = tokenCode
    this.includeEncrypted = includeEncrypted
    this.encryptKeys = encryptKeys
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
        try {
          const requests = await Promise.allSettled(result.obt_data_records.map(async (obtDataRecord: GetObtDataRecord) => {
            let encryptPublicKeysArray: string[] = [];
            let encryptPrivateKeysArray: string[] = [];

            const { content: obtDataRecordContent, payee_fio_address, payee_fio_public_key, payer_fio_address, payer_fio_public_key } = obtDataRecord || {};

            try {
              const payerEncryptKeyRes = await getEncryptKeyForUnCipherContent({
                getEncryptKey: this.getEncryptKey,
                method: 'GetObtData',
                fioAddress: payer_fio_address,
              });
              if (payerEncryptKeyRes) {
                encryptPublicKeysArray.push(payerEncryptKeyRes);
              }
            } catch (error) {
              console.error(error);
            }
            try {
              const payeeEncryptKeyRes = await getEncryptKeyForUnCipherContent({
                getEncryptKey: this.getEncryptKey,
                method: 'GetObtData',
                fioAddress: payee_fio_address,
              });
              if (payeeEncryptKeyRes) {
                encryptPublicKeysArray.push(payeeEncryptKeyRes);
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

            if (payee_fio_public_key) {
              encryptPublicKeysArray.push(payee_fio_public_key);
            }

            if (payer_fio_public_key) {
              encryptPublicKeysArray.push(payer_fio_public_key);
            }

            encryptPublicKeysArray.push(this.publicKey);
            encryptPrivateKeysArray.push(this.privateKey);

            try {
              for (let i = 0; i < encryptPublicKeysArray.length; i++) {
                const publicKey = encryptPublicKeysArray[i];
                for (let j = 0; j < encryptPrivateKeysArray.length; j++) {
                  const privateKey = encryptPrivateKeysArray[j];
                  let result = null;
                  try {
                    result = this.getUnCipherContent(
                      'record_obt_data_content',
                      obtDataRecordContent,
                      privateKey,
                      publicKey
                    );
                    if (result !== null) {
                      content = result;
                      break; // Exit the inner loop if a successful result is obtained
                    }
                  } catch (error) { }
                }
              }

              if (content === null) {
                throw new Error(`GetObtData: Get UnCipher Content for account ${account} failed.`); // Throw an error if all keys failed
              }
            } catch (error) {
              if (this.includeEncrypted) return obtDataRecord;

              console.error(error);
              throw error
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
