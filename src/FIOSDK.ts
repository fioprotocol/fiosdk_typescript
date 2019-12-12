import { Fio } from '@fioprotocol/fiojs'
import {
  AbiResponse,
  AddPublicAddressResponse,
  AvailabilityResponse,
  BalanceResponse,
  FioFeeResponse,
  FioNamesResponse,
  PendingFioRequestsResponse,
  PublicAddressResponse,
  RecordSendResponse,
  RegisterFioAddressResponse,
  RegisterFioDomainResponse,
  RejectFundsResponse,
  RenewFioAddressResponse,
  RenewFioDomainResponse,
  RequestFundsResponse,
  SentFioRequestResponse,
  SetFioDomainVisibilityResponse,
  TransferTokensResponse,
} from './entities/responses'
import { EndPoint } from './entities/EndPoint'
import * as queries from './transactions/queries'
import * as SignedTransactions from './transactions/signed'
import { MockRegisterFioName } from './transactions/signed/MockRegisterFioName'
import { Transactions } from './transactions/Transactions'
import { Constants } from './utils/constants'

/**
 * @ignore
 */
const { Ecc } = require('@fioprotocol/fiojs')

/**
 * @ignore
 */
type FetchJson = (uri: string, opts?: object) => object

export class FIOSDK {
  /**
   * @ignore
   */
  public static ReactNativeFio: any

  /**
   * @ignore
   */
  public static async createPrivateKey(entropy: Buffer): Promise<any> {
    const bip39 = require('bip39')
    const mnemonic = bip39.entropyToMnemonic(entropy)
    return await FIOSDK.createPrivateKeyMnemonic(mnemonic)
  }

  /**
   * Create a FIO private key.
   *
   * @param mnemonic mnemonic used to generate a random unique private key.
   * @example real flame win provide layer trigger soda erode upset rate beef wrist fame design merit
   *
   * @returns New FIO private key
   */
  public static async createPrivateKeyMnemonic(mnemonic: string) {
    const hdkey = require('hdkey')
    const wif = require('wif')
    const bip39 = require('bip39')
    const seedBytes = await bip39.mnemonicToSeed(mnemonic)
    const seed = await seedBytes.toString('hex')
    const master = hdkey.fromMasterSeed(new Buffer(seed, 'hex'))
    const node = master.derive('m/44\'/235\'/0\'/0/0')
    const fioKey = wif.encode(128, node._privateKey, false)
    return { fioKey, mnemonic }
  }

  /**
   * Create a FIO public key.
   *
   * @param fioPrivateKey FIO private key.
   *
   * @returns FIO public key derived from the FIO private key.
   */
  public static derivedPublicKey(fioPrivateKey: string) {
    const publicKey = Ecc.privateToPublic(fioPrivateKey)
    return { publicKey }
  }

  public transactions: Transactions

  /**
   * @ignore
   */
  public registerMockUrl: string

  /**
   * the fio private key of the client sending requests to FIO API.
   */
  public privateKey: string

  /**
   * the fio public key of the client sending requests to FIO API.
   */
  public publicKey: string

  /**
   * @param privateKey the fio private key of the client sending requests to FIO API.
   * @param publicKey the fio public key of the client sending requests to FIO API.
   * @param baseUrl the url to the FIO API.
   * @param fetchjson
   * @param registerMockUrl the url to the mock server
   */
  constructor(
    privateKey: string,
    publicKey: string,
    baseUrl: string,
    fetchjson: FetchJson,
    registerMockUrl = '',
  ) {
    this.transactions = new Transactions()
    Transactions.baseUrl = baseUrl
    Transactions.FioProvider = Fio
    Transactions.fetchJson = fetchjson
    this.registerMockUrl = registerMockUrl
    this.privateKey = privateKey
    this.publicKey = publicKey

    for (const accountName of Constants.rawAbiAccountName) {
      this.getAbi(accountName)
        .then((response) => {
          Transactions.abiMap.set(response.account_name, response)
        })
        .catch((error) => {
          throw error
        })
    }
  }

  /**
   * Retrieves the FIO public key assigned to the FIOSDK instance.
   */
  public getFioPublicKey(): string {
    return this.publicKey
  }

  /**
   * Registers a FIO Address on the FIO blockchain.  The owner will be the public key associated with the FIO SDK instance.
   *
   * @param fioAddress FIO Address to register.
   * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by @ [getFee] for correct value.
   * @param walletFioAddress FIO Address of the wallet which generates this transaction.
   */
  public registerFioAddress(
    fioAddress: string,
    maxFee: number,
    walletFioAddress: string = '',
  ): Promise<RegisterFioAddressResponse> {
    const registerFioAddress = new SignedTransactions.RegisterFioAddress(
      fioAddress,
      maxFee,
      walletFioAddress,
    )
    return registerFioAddress.execute(this.privateKey, this.publicKey)
  }

  /**
   * Registers a FIO Domain on the FIO blockchain.
   *
   * @param fioDomain FIO Domain to register. The owner will be the public key associated with the FIO SDK instance.
   * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by @ [getFee] for correct value.
   * @param walletFioAddress FIO Address of the wallet which generates this transaction.
   */
  public registerFioDomain(
    fioDomain: string,
    maxFee: number,
    walletFioAddress: string = '',
  ): Promise<RegisterFioDomainResponse> {
    const registerFioDomain = new SignedTransactions.RegisterFioDomain(
      fioDomain,
      maxFee,
      walletFioAddress,
    )
    return registerFioDomain.execute(this.privateKey, this.publicKey)
  }

  /**
   * Renew a FIO Address on the FIO blockchain.
   *
   * @param fioAddress FIO Address to renew.
   * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by @ [getFee] for correct value.
   * @param walletFioAddress FIO Address of the wallet which generates this transaction.
   */
  public renewFioAddress(
    fioAddress: string,
    maxFee: number,
    walletFioAddress: string = '',
  ): Promise<RenewFioAddressResponse> {
    const renewFioAddress = new SignedTransactions.RenewFioAddress(
      fioAddress,
      maxFee,
      walletFioAddress,
    )
    return renewFioAddress.execute(this.privateKey, this.publicKey)
  }

  /**
   * Renew a FIO Domain on the FIO blockchain.
   *
   * @param fioDomain FIO Domain to renew.
   * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by @ [getFee] for correct value.
   * @param walletFioAddress FIO Address of the wallet which generates this transaction.
   */
  public renewFioDomain(
    fioDomain: string,
    maxFee: number,
    walletFioAddress: string = '',
  ): Promise<RenewFioDomainResponse> {
    const renewFioDomain = new SignedTransactions.RenewFioDomain(
      fioDomain,
      maxFee,
      walletFioAddress,
    )
    return renewFioDomain.execute(this.privateKey, this.publicKey)
  }

  /**
   * This call allows a public address of the specific blockchain type to be added to the FIO Address.
   *
   * @param fioAddress FIO Address which will be mapped to public address.
   * @param tokenCode Token code to be used with that public address.
   * @param publicAddress The public address to be added to the FIO Address for the specified token.
   * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by /get_fee for correct value.
   * @param walletFioAddress FIO Address of the wallet which generates this transaction.
   */
  public addPublicAddress(
    fioAddress: string,
    tokenCode: string,
    publicAddress: string,
    maxFee: number,
    walletFioAddress: string = '',
  ): Promise<AddPublicAddressResponse> {
    const addPublicAddress = new SignedTransactions.AddPublicAddress(
      fioAddress,
      tokenCode,
      publicAddress,
      maxFee,
      walletFioAddress,
    )
    return addPublicAddress.execute(this.privateKey, this.publicKey)
  }

  /**
   * By default all FIO Domains are non-public, meaning only the owner can register FIO Addresses on that domain. Setting them to public allows anyone to register a FIO Address on that domain.
   *
   * @param fioDomain FIO Domain to change visibility.
   * @param isPublic 1 - allows anyone to register FIO Address, 0 - only owner of domain can register FIO Address.
   * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by /get_fee for correct value.
   * @param walletFioAddress FIO Address of the wallet which generates this transaction.
   */
  public setFioDomainVisibility(
    fioDomain: string,
    isPublic: boolean,
    maxFee: number,
    walletFioAddress: string = '',
  ): Promise<SetFioDomainVisibilityResponse> {
    const SetFioDomainVisibility = new SignedTransactions.SetFioDomainVisibility(
      fioDomain,
      isPublic,
      maxFee,
      walletFioAddress,
    )
    return SetFioDomainVisibility.execute(this.privateKey, this.publicKey)
  }

  /**
   *
   * Records information on the FIO blockchain about a transaction that occurred on other blockchain, i.e. 1 BTC was sent on Bitcoin Blockchain, and both
   * sender and receiver have FIO Addresses. OBT stands for Other Blockchain Transaction
   *
   * @param fioRequestId ID of funds request, if this Record Send transaction is in response to a previously received funds request.  Send empty if no FIO Request ID
   * @param payerFIOAddress FIO Address of the payer. This address initiated payment.
   * @param payeeFIOAddress FIO Address of the payee. This address is receiving payment.
   * @param payerTokenPublicAddress Public address on other blockchain of user sending funds.
   * @param payeeTokenPublicAddress Public address on other blockchain of user receiving funds.
   * @param amount Amount sent.
   * @param tokenCode Code of the token represented in Amount requested, i.e. BTC.
   * @param status Status of this OBT. Allowed statuses are: sent_to_blockchain.
   * @param obtId Other Blockchain Transaction ID (OBT ID), i.e Bitcoin transaction ID.
   * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by /get_fee for correct value.
   * @param walletFioAddress FIO Address of the wallet which generates this transaction.
   * @param payeeFioPublicKey Public address on other blockchain of user receiving funds.
   * @param memo
   * @param hash
   * @param offlineUrl
   */
  public async recordSend(
    fioRequestId: string,
    payerFIOAddress: string,
    payeeFIOAddress: string,
    payerTokenPublicAddress: string,
    payeeTokenPublicAddress: string,
    amount: number,
    tokenCode: string,
    status: string,
    obtId: string,
    maxFee: number,
    walletFioAddress: string = '',
    payeeFioPublicKey: string | null = null,
    memo: string | null = null,
    hash: string | null = null,
    offLineUrl: string | null = null,
  ): Promise<RecordSendResponse> {
    let payeeKey: any = { public_address: '' }
    if (!payeeFioPublicKey && typeof payeeFioPublicKey !== 'string') {
      payeeKey = await this.getPublicAddress(payeeFIOAddress, 'FIO')
    } else {
      payeeKey.public_address = payeeFioPublicKey
    }
    const recordSend = new SignedTransactions.RecordSend(
      fioRequestId,
      payerFIOAddress,
      payeeFIOAddress,
      payerTokenPublicAddress,
      payeeTokenPublicAddress,
      amount,
      tokenCode,
      obtId,
      maxFee,
      status,
      walletFioAddress,
      payeeKey.public_address,
      memo,
      hash,
      offLineUrl,
    )
    return recordSend.execute(this.privateKey, this.publicKey)
  }

  /**
   * Reject funds request.
   *
   * @param fioRequestId Existing funds request Id
   * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by [getFee] for correct value.
   * @param walletFioAddress FIO Address of the wallet which generates this transaction.
   */
  public rejectFundsRequest(
    fioRequestId: string,
    maxFee: number,
    walletFioAddress: string = '',
  ): Promise<RejectFundsResponse> {
    const rejectFundsRequest = new SignedTransactions.RejectFundsRequest(
      fioRequestId,
      maxFee,
      walletFioAddress,
    )
    return rejectFundsRequest.execute(this.privateKey, this.publicKey)
  }

  /**
   * Create a new funds request on the FIO chain.
   *
   * @param payerFioAddress FIO Address of the payer. This address will receive the request and will initiate payment.
   * @param payeeFioAddress FIO Address of the payee. This address is sending the request and will receive payment.
   * @param payeePublicAddress Payee's public address where they want funds sent.
   * @param amount Amount requested.
   * @param tokenCode Code of the token represented in amount requested.
   * @param memo
   * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by [getFee] for correct value.
   * @param payerFioPublicKey Public address on other blockchain of user sending funds.
   * @param walletFioAddress FIO Address of the wallet which generates this transaction.
   * @param hash
   * @param offlineUrl
   */
  public async requestFunds(
    payerFioAddress: string,
    payeeFioAddress: string,
    payeePublicAddress: string,
    amount: number,
    tokenCode: string,
    memo: string,
    maxFee: number,
    payerFioPublicKey: string | null = null,
    walletFioAddress: string = '',
    hash?: string,
    offlineUrl?: string,
  ): Promise<RequestFundsResponse> {
    let payerKey: any = { public_address: '' }
    if (!payerFioPublicKey && typeof payerFioPublicKey !== 'string') {
      payerKey = await this.getPublicAddress(payerFioAddress, 'FIO')
    } else {
      payerKey.public_address = payerFioPublicKey
    }
    const requestNewFunds = new SignedTransactions.RequestNewFunds(
      payerFioAddress,
      payerKey.public_address,
      payeeFioAddress,
      walletFioAddress,
      maxFee,
      payeePublicAddress,
      amount,
      tokenCode,
      memo,
      hash,
      offlineUrl,
    )
    return requestNewFunds.execute(this.privateKey, this.publicKey)
  }

  /**
   * Checks if a FIO Address or FIO Domain is available for registration.
   *
   * @param fioName FIO Address or FIO Domain to check.
   */
  public isAvailable(fioName: string): Promise<AvailabilityResponse> {
    const availabilityCheck = new queries.AvailabilityCheck(fioName)
    return availabilityCheck.execute(this.publicKey)
  }

  /**
   * Retrieves balance of FIO tokens
   *
   * @param fioPublicKey FIO public key.
   */
  public getFioBalance(fioPublicKey?: string): Promise<BalanceResponse> {
    const getFioBalance = new queries.GetFioBalance(fioPublicKey)
    return getFioBalance.execute(this.publicKey)
  }

  /**
   * Returns FIO Addresses and FIO Domains owned by this public key.
   *
   * @param fioPublicKey FIO public key of owner.
   */
  public getFioNames(fioPublicKey: string): Promise<FioNamesResponse> {
    const getNames = new queries.GetNames(fioPublicKey)
    return getNames.execute(this.publicKey)
  }

  /**
   * Polls for any pending requests sent to public key associated with the FIO SDK instance.
   *
   * @param limit Number of request to return. If omitted, all requests will be returned.
   * @param offset First request from list to return. If omitted, 0 is assumed.
   */
  public getPendingFioRequests(limit?: number, offset?: number): Promise<PendingFioRequestsResponse> {
    const pendingFioRequests = new queries.PendingFioRequests(this.publicKey, limit, offset)
    return pendingFioRequests.execute(this.publicKey, this.privateKey)
  }

  /**
   * Polls for any sent requests sent by public key associated with the FIO SDK instance.
   *
   * @param limit Number of request to return. If omitted, all requests will be returned.
   * @param offset First request from list to return. If omitted, 0 is assumed.
   */
  public getSentFioRequests(limit?: number, offset?: number): Promise<SentFioRequestResponse> {
    const sentFioRequest = new queries.SentFioRequests(this.publicKey, limit, offset)
    return sentFioRequest.execute(this.publicKey, this.privateKey)
  }

  /**
   * Returns a token public address for specified token code and FIO Address.
   *
   * @param fioAddress FIO Address for which the token public address is to be returned.
   * @param tokenCode Token code for which public address is to be returned.
   */
  public getPublicAddress(
    fioAddress: string,
    tokenCode: string,
  ): Promise<PublicAddressResponse> {
    const publicAddressLookUp = new queries.PublicAddressLookUp(
      fioAddress,
      tokenCode,
    )
    return publicAddressLookUp.execute(this.publicKey)
  }

  /**
   * Returns the FIO token public address for specified FIO Address.
   *
   * @param fioAddress FIO Address for which fio token public address is to be returned.
   */
  public getFioPublicAddress(fioAddress: string): Promise<PublicAddressResponse> {
    const publicAddressLookUp = new queries.PublicAddressLookUp(
      fioAddress,
      'FIO',
    )
    return publicAddressLookUp.execute(this.publicKey)
  }

  /**
   *
   * Transfers FIO tokens from public key associated with the FIO SDK instance to
   * the payeePublicKey.
   *
   * @param payeeFioPublicKey FIO public Address of the one receiving the tokens.
   * @param amount Amount sent in SUFs.
   * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by /get_fee for correct value.
   * @param walletFioAddress FIO Address of the wallet which generates this transaction.
   */
  public transferTokens(
    payeeFioPublicKey: string,
    amount: number,
    maxFee: number,
    walletFioAddress: string = '',
  ): Promise<TransferTokensResponse> {
    const transferTokens = new SignedTransactions.TransferTokens(
      payeeFioPublicKey,
      amount,
      maxFee,
      walletFioAddress,
    )
    return transferTokens.execute(this.privateKey, this.publicKey)
  }

  /**
   * Compute and return fee amount for specific call and specific user
   *
   * @param endPoint Name of API call end point, e.g. add_pub_address.
   * @param fioAddress
   *        if endPointName is RenewFioAddress, FIO Address incurring the fee and owned by signer.
   *        if endPointName is RenewFioDomain, FIO Domain incurring the fee and owned by signer.
   *        if endPointName is RecordSend, Payee FIO Address incurring the fee and owned by signer.
   */
  public getFee(endPoint: EndPoint, fioAddress = ''): Promise<FioFeeResponse> {
    const fioFee = new queries.GetFee(endPoint, fioAddress)
    return fioFee.execute(this.publicKey)
  }

  /**
   * @ignore
   */
  public registerFioNameOnBehalfOfUser(fioName: string, publicKey: string) {
    const server = this.registerMockUrl // "mock.dapix.io/mockd/DEV2"
    const mockRegisterFioName = new MockRegisterFioName(
      fioName,
      publicKey,
      server,
    )
    return mockRegisterFioName.execute()
  }

  /**
   * @ignore
   */
  public getMultiplier() {
    return Constants.multiplier
  }

  /**
   * @ignore
   */
  public genericAction(action: string, params: any): any {
    switch (action) {
      case 'getFioPublicKey':
        return this.getFioPublicKey()
      case 'registerFioAddress':
        return this.registerFioAddress(
          params.fioAddress,
          params.maxFee,
          params.walletFioAddress || '',
        )
      case 'registerFioDomain':
        return this.registerFioDomain(
          params.fioDomain,
          params.maxFee,
          params.walletFioAddress || '',
        )
      case 'renewFioDomain':
        return this.renewFioDomain(
          params.fioDomain,
          params.maxFee,
          params.walletFioAddress || '',
        )
      case 'renewFioAddress':
        return this.renewFioAddress(
          params.fioAddress,
          params.maxFee,
          params.walletFioAddress || '',
        )
      case 'addPublicAddress':
        return this.addPublicAddress(
          params.fioAddress,
          params.tokenCode,
          params.publicAddress,
          params.maxFee,
          params.walletFioAddress,
        )
      case 'setFioDomainVisibility':
        return this.setFioDomainVisibility(
          params.fioDomain,
          params.isPublic,
          params.maxFee,
          params.walletFioAddress,
        )
      case 'recordSend':
        return this.recordSend(
          params.fioRequestId,
          params.payerFIOAddress,
          params.payeeFIOAddress,
          params.payerTokenPublicAddress,
          params.payeeTokenPublicAddress,
          params.amount,
          params.tokenCode,
          params.status,
          params.obtId,
          params.maxFee,
          params.walletFioAddress || '',
          params.payerFioPublicKey,
          params.memo,
          params.hash,
          params.offLineUrl,
        )
      case 'rejectFundsRequest':
        return this.rejectFundsRequest(
          params.fioRequestId,
          params.maxFee,
          params.walletFioAddress || '',
        )
      case 'requestFunds':
        return this.requestFunds(
          params.payerFioAddress,
          params.payeeFioAddress,
          params.payeePublicAddress,
          params.amount,
          params.tokenCode,
          params.memo,
          params.maxFee,
          params.payerFioPublicKey,
          params.walletFioAddress || '',
          params.hash,
          params.offlineUrl,
        )
      case 'isAvailable':
        return this.isAvailable(params.fioName)
      case 'getFioBalance':
        if (params) {
          return this.getFioBalance(params.fioPublicKey)
        } else {
          return this.getFioBalance()
        }
      case 'getFioNames':
        return this.getFioNames(params.fioPublicKey)
      case 'getPendingFioRequests':
        return this.getPendingFioRequests(params.limit, params.offset)
      case 'getSentFioRequests':
        return this.getSentFioRequests(params.limit, params.offset)
      case 'getPublicAddress':
        return this.getPublicAddress(params.fioAddress, params.tokenCode)
      case 'transferTokens':
        return this.transferTokens(
          params.payeeFioPublicKey,
          params.amount,
          params.maxFee,
          params.walletFioAddress || '',
        )
      case 'getAbi':
        return this.getAbi(params.accountName)
      case 'getFee':
        return this.getFee(params.endPoint, params.fioAddress)
      case 'getMultiplier':
        return this.getMultiplier()
    }
  }

  /**
   * @ignore
   */
  public getAbi(accountName: string): Promise<AbiResponse> {
    const abi = new queries.GetAbi(accountName)
    return abi.execute(this.publicKey)
  }
}
