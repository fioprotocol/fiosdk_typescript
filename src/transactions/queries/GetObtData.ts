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
  public encryptKeys: Map<string, { privateKey: string, publicKey: string } []> | undefined
  public isEncrypted = true
  public getEncryptKey: (fioAddress: string) => Promise<GetEncryptKeyResponse>

  constructor({ fioPublicKey, limit = 0, offset = 0, tokenCode = '', encryptKeys, getEncryptKey }: {
    fioPublicKey: string,
    limit?: number,
    offset?: number,
    tokenCode?: string,
    encryptKeys?: Map<string, { privateKey: string, publicKey: string }[]>,
    getEncryptKey: (fioAddress: string) => Promise<GetEncryptKeyResponse>
  }) {
    super()
    this.fio_public_key = fioPublicKey
    this.limit = limit
    this.offset = offset
    this.tokenCode = tokenCode
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
            let encryptKeysArray: { publicKey: string, privateKey?: string }[] = [];

            const { content: obtDataRecordContent, payee_fio_address, payee_fio_public_key, payer_fio_address, payer_fio_public_key } = obtDataRecord || {};

            try {
              const payerEncryptKeyRes = await getEncryptKeyForUnCipherContent({
                getEncryptKey: this.getEncryptKey,
                method: 'GetObtData',
                fioAddress: payer_fio_address,
              });
              if (payerEncryptKeyRes) {
                encryptKeysArray.push({ publicKey: payerEncryptKeyRes });
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
                encryptKeysArray.push({ publicKey: payeeEncryptKeyRes });
              }
            } catch (error) {
              console.error(error);
            }

            const account = this.getActor();

            if (this.encryptKeys) {
              const accountEncryptKeys = this.encryptKeys.get(account);
              if (accountEncryptKeys && accountEncryptKeys.length > 0) {
                encryptKeysArray = encryptKeysArray.concat(accountEncryptKeys);
              }
            }

            if (payee_fio_public_key) {
              encryptKeysArray.push({ publicKey: payee_fio_public_key });
            }

            if (payer_fio_public_key) {
              encryptKeysArray.push({ publicKey: payer_fio_public_key });
            }

            encryptKeysArray.push({ publicKey: this.publicKey });

            try {
              for (let i = 0; i < encryptKeysArray.length; i++) {
                const { publicKey, privateKey } = encryptKeysArray[i];

                let result = null;

                try {
                  result = this.getUnCipherContent(
                    'record_obt_data_content',
                    obtDataRecordContent,
                    privateKey || this.privateKey,
                    publicKey
                  );
                } catch (error) {}

                // Check if the result is successful
                if (result !== null) {
                  content = result;
                  break; // Exit the loop if a successful result is obtained
                }
              }

              if (content === null) {
                throw new Error(`GetObtData: Get UnCipher Content for account ${account} failed.`); // Throw an error if all keys failed
              }
            } catch (error) {
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
