import { Fio } from '@fioprotocol/fiojs'
import { TextDecoder, TextEncoder } from 'text-encoding'
import { AbiResponse } from '../entities/AbiResponse'
import { RawTransaction } from '../entities/RawTransaction'
import { ValidationError } from '../entities/ValidationError'
import { validate } from '../utils/validation'
import { asyncWaterfall, shuffleArray } from '../utils/utils';

type FetchJson = (uri: string, opts?: Object) => any
const textEncoder: TextEncoder = new TextEncoder()
const textDecoder: TextDecoder = new TextDecoder()

export const fioApiErrorCodes = [400, 403, 404, 409]
export const FIO_CHAIN_INFO_ERROR_CODE = 800
export const FIO_BLOCK_NUMBER_ERROR_CODE = 801
type FioErrorJson = {
  fields?: {
    error: string
  }[]
}

export class FioError extends Error {
  list: { field: string, message: string }[] = []
  labelCode: string = ''
  errorCode: number = 0
  json: any

  constructor(message: string, code?: number, labelCode?: string, json?: any) {
    super(message)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FioError)
    }

    this.name = 'FioError'
    if (code) this.errorCode = code
    if (labelCode) this.labelCode = labelCode
    if (json) this.json = json
  }
}

export class Transactions {
  public static baseUrls: string[]
  public static abiMap: Map<string, AbiResponse> = new Map<string, AbiResponse>()
  public static FioProvider: {
    prepareTransaction(param: any): Promise<any>;
    accountHash(pubkey: string): string
  }

  public static fetchJson: FetchJson
  public publicKey: string = ''
  public privateKey: string = ''
  public serilizeEndpoint: string = 'chain/serialize_json'

  public validationData: object = {}
  public validationRules: any | null = null

  public getActor(publicKey: string = ''): string {
    const actor = Transactions.FioProvider.accountHash((publicKey == '') ? this.publicKey : publicKey)
    return actor
  }

  public async getChainInfo(): Promise<any> {
    const options = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    }
    return await this.multicastServers('chain/get_info', null, options)
  }

  public async getBlock(chain: any): Promise<any> {
    if (chain == undefined) {
      throw new Error('chain undefined')
    }
    if (chain.last_irreversible_block_num == undefined) {
      throw new Error('chain.last_irreversible_block_num undefined')
    }
    return await this.multicastServers('chain/get_block', null,{
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        block_num_or_id: chain.last_irreversible_block_num,
      }),
    })
  }

  public async pushToServer(transaction: RawTransaction, endpoint: string, dryRun: boolean): Promise<any> {
    const privky: string[] = new Array<string>()
    privky.push(this.privateKey)
    let chain, block
    try {
      chain = await this.getChainInfo()
    } catch (error) {
      console.error('chain:: ' + error)
      const e: Error & { errorCode?: number } = new Error(`Error while fetching chain info`)
      e.errorCode = FIO_CHAIN_INFO_ERROR_CODE
      throw e
    }
    try {
      block = await this.getBlock(chain)
    } catch (error) {
      console.error('block: ' + error)
      const e: Error & { errorCode?: number } = new Error(`Error while fetching block`)
      e.errorCode = FIO_BLOCK_NUMBER_ERROR_CODE
      throw e
    }
    transaction.ref_block_num = block.block_num & 0xFFFF
    transaction.ref_block_prefix = block.ref_block_prefix
    const expiration = new Date(chain.head_block_time + 'Z')
    expiration.setSeconds(expiration.getSeconds() + 180)
    const expirationStr = expiration.toISOString()
    transaction.expiration = expirationStr.substr(0, expirationStr.length - 1)
    if (dryRun) {
      return Transactions.FioProvider.prepareTransaction({
        transaction, chainId: chain.chain_id, privateKeys: privky, abiMap: Transactions.abiMap,
        textDecoder: new TextDecoder(), textEncoder: new TextEncoder(),
      })
    } else {
      const signedTransaction = await Transactions.FioProvider.prepareTransaction({
        transaction, chainId: chain.chain_id, privateKeys: privky, abiMap: Transactions.abiMap,
        textDecoder: new TextDecoder(), textEncoder: new TextEncoder(),
      })
      return this.multicastServers(endpoint, JSON.stringify(signedTransaction))
    }
  }

  public async executeCall(baseUrl: string, endPoint: string, body: string | null, fetchOptions?: any): Promise<any> {
    let options: any
    this.validate()
    if (fetchOptions != null) {
      options = fetchOptions
      if (body != null) {
        options.body = body
      }
    } else {
      options = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body,
      }
    }
    try {
      const res = await Transactions.fetchJson(baseUrl + endPoint, options)
      if (!res.ok) {
        const error: Error & { json?: FioErrorJson, errorCode?: string, requestParams?: { endPoint: string, body: string, fetchOptions?: any } } = new Error(`Error ${res.status} while fetching ${baseUrl + endPoint}`)
        try {
          error.json = await res.json()
          if (fioApiErrorCodes.indexOf(res.status) > -1) {
            if (
              error.json &&
              error.json.fields &&
              error.json.fields[0] &&
              error.json.fields[0].error
            ) {
              error.message = error.json.fields[0].error
            }
            return {
              isError: true,
              data: {
                code: error.errorCode,
                message: error.message,
                json: error.json
              }
            }
          }
        } catch (e) {
          console.log(e);
          error.json = {}
        }
        error.errorCode = res.status
        throw error
      }
      return res.json()
    } catch (e) {
      e.requestParams = { baseUrl, endPoint, body, fetchOptions }
      throw e
    }
  }

  public async multicastServers(endpoint: string, body: string | null, fetchOptions?: any): Promise<any> {
    const res = await asyncWaterfall(
      shuffleArray(
        Transactions.baseUrls.map(apiUrl => () =>
          this.executeCall(apiUrl, endpoint, body, fetchOptions)
        )
      )
    )

    if (res.isError) {
      const error = new FioError(res.errorMessage || res.data.message)
      error.json = res.data.json
      error.list = res.data.list
      error.errorCode = res.data.code

      throw error
    }

    return res
  }

  public getCipherContent(contentType: string, content: any, privateKey: string, publicKey: string) {
    const cipher = Fio.createSharedCipher({ privateKey, publicKey, textEncoder, textDecoder })
    return cipher.encrypt(contentType, content)
  }

  public getUnCipherContent(contentType: string, content: any, privateKey: string, publicKey: string) {
    const cipher = Fio.createSharedCipher({ privateKey, publicKey, textEncoder, textDecoder })
    return cipher.decrypt(contentType, content)
  }

  public validate() {
    if (this.validationRules) {
      const validation = validate(this.validationData, this.validationRules)
      if (!validation.isValid) {
        throw new ValidationError(validation.errors, `Validation error`)
      }
    }
  }
}
