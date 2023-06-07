import { AbortController, AbortSignal } from 'abort-controller';
import { GetEncryptKeyResponse } from '../entities/GetEncryptKeyResponse'; 

const DEFAULT_REQUEST_TIMEOUT = 60000;

export async function asyncWaterfall({
  asyncFuncs,
  requestTimeout = DEFAULT_REQUEST_TIMEOUT,
}: {
  asyncFuncs: Array<(signal: AbortSignal) => Promise<any>>;
  requestTimeout?: number;
}): Promise<any> {
  const timeoutIds: NodeJS.Timeout[] = [];

  try {
    for (let i = 0; i < asyncFuncs.length; i++) {
      const func = asyncFuncs[i];
      const abortController = new AbortController();
      let timeoutId: NodeJS.Timeout | undefined;

      const timeoutPromise = new Promise<void>((_, reject) => {
        timeoutId = setTimeout(() => {
          abortController.abort();
          reject(new Error('request_timeout'));
        }, requestTimeout);
        timeoutIds.push(timeoutId!);
      });

      try {
        const result = await Promise.race([func(abortController.signal), timeoutPromise]);
        clearTimeout(timeoutId!);
        if (result.isError) {
          throw result.data;
        }
        if (result !== undefined) {
          return result;
        }
      } catch (error: any) {
        clearTimeout(timeoutId!);
        if (i === asyncFuncs.length - 1) {
          throw error;
        }
      }
    }
  } finally {
    timeoutIds.forEach((timeoutId) => clearTimeout(timeoutId));
  }
}

export async function getEncryptKeyForUnCipherContent({
  getEncryptKey,
  method = '',
  payeeFioAddress,
  payerFioAddress,
  payeePublicKey,
  payerPublicKey,
  publicKey
}: {
  getEncryptKey: (fioAddress: string) => Promise<GetEncryptKeyResponse>,
  method?: string,
  payeeFioAddress: string,
  payerFioAddress: string,
  payeePublicKey: string,
  payerPublicKey: string,
  publicKey: string
}) {
  let encryptKey = null;
  let payerEncryptKey = payerPublicKey;
  let payeeEncryptKey = payeePublicKey;

  if (payerFioAddress) {
    try {
      const payerEncryptKeyRes = await getEncryptKey(payerFioAddress);
      if (payerEncryptKeyRes && payerEncryptKeyRes.encrypt_public_key) {
        payerEncryptKey = payerEncryptKeyRes.encrypt_public_key;
      }
    } catch (error) {
      console.warn(`${method}: Get Encrypt Key for payer_fio_address ${payerFioAddress} failed. Using publicKey.`);
      // Skip if getEncryptKey fails and continue with the publicKey
    }
  }

  if (payeeFioAddress) {
    try {
      const payeeEncryptKeyRes = await getEncryptKey(payeeFioAddress);
      if (payeeEncryptKeyRes && payeeEncryptKeyRes.encrypt_public_key) {
        payeeEncryptKey = payeeEncryptKeyRes.encrypt_public_key;
      }
    } catch (error) {
      console.warn(`${method}: Get Encrypt Key for payee_fio_address ${payeeFioAddress} failed. Using publicKey.`);
      // Skip if getEncryptKey fails and continue with the publicKey
    }
  }

  if (payerEncryptKey === publicKey || payerPublicKey === publicKey) {
    encryptKey = payeeEncryptKey
  } else {
    encryptKey = payerEncryptKey
  }

  return encryptKey;
}
