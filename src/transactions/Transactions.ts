import { Api as FioJsApi, Fio } from '@fioprotocol/fiojs'
import {
  AbiProvider,
  AuthorityProvider,
  AuthorityProviderArgs,
  BinaryAbi,
} from '@fioprotocol/fiojs/dist/chain-api-interfaces'
import { PushTransactionArgs } from '@fioprotocol/fiojs/dist/chain-rpc-interfaces'

import { JsSignatureProvider } from '@fioprotocol/fiojs/dist/chain-jssig'
import { arrayToHex, base64ToBinary } from '@fioprotocol/fiojs/dist/chain-numeric'

import { TextDecoder, TextEncoder } from 'text-encoding'

import { AbiResponse } from '../entities/AbiResponse'
import { Autorization } from '../entities/Autorization'
import { RawAction } from '../entities/RawAction'
import { RawTransaction } from '../entities/RawTransaction'
import { ValidationError } from '../entities/ValidationError'

import { validate } from '../utils/validation'

type FetchJson = (uri: string, opts?: object) => any
interface SignedTxArgs {
  compression: number,
  packed_context_free_data: string,
  packed_trx: string,
  signatures: string[],
}

const defaultTextEncoder: TextEncoder = new TextEncoder()
const defaultTextDecoder: TextDecoder = new TextDecoder()

export const signAllAuthorityProvider: AuthorityProvider = {
  async getRequiredKeys(authorityProviderArgs: AuthorityProviderArgs) {
    const { availableKeys } = authorityProviderArgs
    return availableKeys
  },
}

export class Transactions {
  public static baseUrl: string
  public static abiMap: Map<string, AbiResponse> = new Map<string, AbiResponse>()
  public static FioProvider: {
    prepareTransaction(param: any): Promise<any>;
    accountHash(pubKey: string): string
  }

  public static fetchJson: FetchJson
  public publicKey: string = ''
  public privateKey: string = ''
  public serilizeEndpoint: string = 'chain/serialize_json'

  public validationData: object = {}
  public validationRules: any | null = null

  public getActor(publicKey: string = ''): string {
    return Transactions.FioProvider.accountHash((publicKey === '' || !publicKey) ? this.publicKey : publicKey)
  }

  public async getChainInfo(): Promise<any> {
    const options = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'GET',
    }
    const res = await Transactions.fetchJson(Transactions.baseUrl + 'chain/get_info', options)
    return await res.json()
  }

  public async getBlock(chain: any): Promise<any> {
    if (chain === undefined || !chain) {
      throw new Error('chain undefined')
    }
    if (chain.last_irreversible_block_num === undefined) {
      throw new Error('chain.last_irreversible_block_num undefined')
    }
    const res = await Transactions.fetchJson(Transactions.baseUrl + 'chain/get_block', {
      body: JSON.stringify({
        block_num_or_id: chain.last_irreversible_block_num,
      }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    return await res.json()
  }

  public async getChainDataForTx(): Promise<{
    chain_id: number,
    ref_block_num: number,
    ref_block_prefix: number,
    expiration: string,
  }> {
    let chain
    let block
    try {
      chain = await this.getChainInfo()
    } catch (error) {
      // tslint:disable-next-line:no-console
      console.error('chain:: ' + error)
      const e: Error & { errorCode?: number } = new Error(`Error while fetching chain info`)
      e.errorCode = 800
      throw e
    }
    try {
      block = await this.getBlock(chain)
    } catch (error) {
      // tslint:disable-next-line:no-console
      console.error('block: ' + error)
      const e: Error & { errorCode?: number } = new Error(`Error while fetching block`)
      e.errorCode = 801
      throw e
    }
    const expiration = new Date(chain.head_block_time + 'Z')
    expiration.setSeconds(expiration.getSeconds() + 180)
    const expirationStr = expiration.toISOString()
    return  {
      chain_id: chain.chain_id,
      expiration: expirationStr.substr(0, expirationStr.length - 1),
      // tslint:disable-next-line:no-bitwise
      ref_block_num: block.block_num & 0xFFFF,
      ref_block_prefix: block.ref_block_prefix,
    }
  }

  public setRawTransactionExp(
    rawTransaction: RawTransaction,
    chainData: {
      ref_block_num: number,
      ref_block_prefix: number,
      expiration: string,
    },
  ): void {
    rawTransaction.ref_block_num = chainData.ref_block_num
    rawTransaction.ref_block_prefix = chainData.ref_block_prefix
    rawTransaction.expiration = chainData.expiration
  }

  public generateApiProvider(
    abiMap: Map<string, any>,
  ): AbiProvider {
    return {
      async getRawAbi(accountName: string) {
        const rawAbi = abiMap.get(accountName)
        if (!rawAbi) {
          throw new Error(`Missing ABI for account ${accountName}`)
        }
        const abi = base64ToBinary(rawAbi.abi)
        const binaryAbi: BinaryAbi = { accountName: rawAbi.account_name, abi }
        return binaryAbi
      },
    }
  }

  public initFioJsApi(
    {
      chainId,
      abiMap,
      textDecoder = defaultTextDecoder,
      textEncoder = defaultTextEncoder,
      privateKeys,
    }: {
      chainId: string,
      abiMap: Map<string, any>,
      privateKeys: string[],
      textDecoder?: TextDecoder,
      textEncoder?: TextEncoder,
    },
  ): FioJsApi {
    return new FioJsApi({
      abiProvider: this.generateApiProvider(abiMap),
      authorityProvider: signAllAuthorityProvider,
      chainId,
      signatureProvider: new JsSignatureProvider(privateKeys),
      textDecoder,
      textEncoder,
    })
  }

  public async createRawTransaction(
    { account, action, data, publicKey, chainData }: {
      account: string;
      action: string;
      data: any,
      publicKey?: string,
      chainData?: {
        ref_block_num: number,
        ref_block_prefix: number,
        expiration: string,
      }
    },
  ): Promise<RawTransaction> {
    const rawTransaction = new RawTransaction()
    const rawaction = new RawAction()
    rawaction.account = account
    const actor = await this.getActor(publicKey)

    if (!data.actor) {
      data.actor = actor
    }

    rawaction.authorization.push(new Autorization(data.actor, data.permission))
    rawaction.account = account
    rawaction.name = action
    rawaction.data = data
    rawTransaction.actions.push(rawaction)

    if (chainData && chainData.ref_block_num) {
      this.setRawTransactionExp(rawTransaction, chainData)
    }

    return rawTransaction
  }

  public async serialize(
    {
      chainId,
      abiMap = Transactions.abiMap,
      transaction,
      textDecoder = defaultTextDecoder,
      textEncoder = defaultTextEncoder,
    }: {
      transaction: RawTransaction,
      chainId: string,
      abiMap?: Map<string, any>,
      textDecoder?: TextDecoder,
      textEncoder?: TextEncoder,
    },
  ): Promise<PushTransactionArgs> {

    const api = this.initFioJsApi({
      abiMap,
      chainId,
      privateKeys: [],
      textDecoder,
      textEncoder,
    })

    return await api.transact(transaction, { sign: false })
  }

  public async deserialize(
    {
      chainId,
      abiMap = Transactions.abiMap,
      serializedTransaction,
      textDecoder = defaultTextDecoder,
      textEncoder = defaultTextEncoder,
    }: {
      serializedTransaction: Uint8Array,
      chainId: string,
      abiMap?: Map<string, any>,
      textDecoder?: TextDecoder,
      textEncoder?: TextEncoder,
    },
  ): Promise<RawTransaction> {

    const api = this.initFioJsApi({
      abiMap,
      chainId,
      privateKeys: [],
      textDecoder,
      textEncoder,
    })

    return await api.deserializeTransactionWithActions(serializedTransaction)
  }

  public async sign(
    {
      abiMap = Transactions.abiMap,
      chainId,
      privateKeys,
      transaction,
      serializedTransaction,
      serializedContextFreeData,
    }: {
      abiMap?: Map<string, any>,
      chainId: string,
      privateKeys: string[],
      transaction: RawTransaction,
      serializedTransaction: any,
      serializedContextFreeData: any,
    },
  ): Promise<SignedTxArgs> {
    const signatureProvider = new JsSignatureProvider(privateKeys)
    const availableKeys = await signatureProvider.getAvailableKeys()
    const requiredKeys = await signAllAuthorityProvider.getRequiredKeys({ transaction, availableKeys })

    const api = this.initFioJsApi({
      abiMap,
      chainId,
      privateKeys,
    })
    const abis: BinaryAbi[] = await api.getTransactionAbis(transaction)

    const signedTx = await signatureProvider.sign({
      abis,
      chainId,
      requiredKeys,
      serializedContextFreeData,
      serializedTransaction,
    })

    return {
      compression: 0,
      packed_context_free_data: arrayToHex(signedTx.serializedContextFreeData || new Uint8Array(0)),
      packed_trx: arrayToHex(signedTx.serializedTransaction),
      signatures: signedTx.signatures,
    }
  }

  public async pushToServer(transaction: RawTransaction, endpoint: string, dryRun: boolean): Promise<any> {
    const privky: string[] = new Array<string>()
    privky.push(this.privateKey)

    const chainData = await this.getChainDataForTx()

    this.setRawTransactionExp(transaction, chainData)

    if (dryRun) {
      return Transactions.FioProvider.prepareTransaction({
        abiMap: Transactions.abiMap,
        chainId: chainData.chain_id,
        privateKeys: privky,
        textDecoder: new TextDecoder(),
        textEncoder: new TextEncoder(),
        transaction,
      })
    } else {
      const signedTransaction = await Transactions.FioProvider.prepareTransaction({
        abiMap: Transactions.abiMap,
        chainId: chainData.chain_id,
        privateKeys: privky,
        textDecoder: new TextDecoder(),
        textEncoder: new TextEncoder(),
        transaction,
      })
      return this.executeCall(endpoint, JSON.stringify(signedTransaction))
    }

  }

  public async executeCall(endPoint: string, body: string, fetchOptions?: any): Promise<any> {
    let options: any
    this.validate()
    if (fetchOptions != null) {
      options = fetchOptions
      if (body != null) {
        options.body = body
      }
    } else {
      options = {
        body,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'POST',
      }
    }
    try {
      const res = await Transactions.fetchJson(Transactions.baseUrl + endPoint, options)
      if (!res.ok) {
        const error: Error & {
          json?: object,
          errorCode?: string,
          requestParams?: {
            endPoint: string,
            body: string,
            fetchOptions?: any,
          },
        } = new Error(`Error ${res.status} while fetching ${Transactions.baseUrl + endPoint}`)
        try {
          error.json = await res.json()
        } catch (e) {
          // tslint:disable-next-line:no-console
          console.log(e)
          error.json = {}
        }
        error.errorCode = res.status
        throw error
      }
      return res.json()
    } catch (e) {
      // @ts-ignore
      e.requestParams = { endPoint, body, fetchOptions }
      throw e
    }
  }

  public getCipherContent(contentType: string, content: any, privateKey: string, publicKey: string) {
    const cipher = Fio.createSharedCipher({
      privateKey,
      publicKey,
      textDecoder: defaultTextDecoder,
      textEncoder: defaultTextEncoder,
    })
    return cipher.encrypt(contentType, content)
  }

  public getUnCipherContent(contentType: string, content: any, privateKey: string, publicKey: string) {
    const cipher = Fio.createSharedCipher({
      privateKey,
      publicKey,
      textDecoder: defaultTextDecoder,
      textEncoder: defaultTextEncoder,
    })
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
