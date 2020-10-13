import { Fio } from '@fioprotocol/fiojs'
import {LockPeriod} from './entities/LockPeriod'
import {
  AbiResponse,
  AddPublicAddressResponse,
  CancelFundsRequestResponse,
  TransferLockedTokensResponse,
  AccountResponse,
  LocksResponse,
  RemovePublicAddressesResponse,
  RemoveAllPublicAddressesResponse,
  BurnFioAddressResponse,
  TransferFioAddressResponse,
  TransferFioDomainResponse,
  AvailabilityResponse,
  BalanceResponse,
  FioFeeResponse,
  FioNamesResponse,
  PendingFioRequestsResponse,
  PublicAddressResponse,
  RecordObtDataResponse,
  RegisterFioAddressResponse,
  RegisterFioDomainResponse,
  RejectFundsResponse,
  RenewFioAddressResponse,
  RenewFioDomainResponse,
  RequestFundsResponse,
  SentFioRequestResponse,
  SetFioDomainVisibilityResponse,
  TransferTokensResponse,
  GetObtDataResponse, CancelledFioRequestResponse, FioAddressesResponse,
} from './entities/responses'
import { EndPoint } from './entities/EndPoint'
import { PublicAddress } from './entities/PublicAddress'
import * as queries from './transactions/queries'
import * as SignedTransactions from './transactions/signed'
import { SignedTransaction } from './transactions/signed/SignedTransaction'
import { MockRegisterFioName } from './transactions/signed/MockRegisterFioName'
import { Transactions } from './transactions/Transactions'
import { Constants } from './utils/constants'
import { validate, allRules } from './utils/validation'
import { ValidationError } from './entities/ValidationError'
import { accountHash } from '@fioprotocol/fiojs/dist/AccountName'

/**
 * @ignore
 */
const { Ecc } = require('@fioprotocol/fiojs')

/**
 * @ignore
 */
type FetchJson = (uri: string, opts?: object) => Promise<object>

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

  /**
   * hash a pub key
   *
   * @param fiopubkey FIO private key.
   *
   * @returns FIO account derived from pub key.
   */
  public static accountHash(fiopubkey: string) {
    const accountnm = accountHash(fiopubkey)
    return { accountnm }
  }

  /**
   * Is the Chain Code Valid?
   *
   * @param chainCode
   *
   * @returns Chain Code is Valid
   */
  public static isChainCodeValid(chainCode: string) {
    const validation = validate({ chainCode }, { chainCode: allRules.chain })
    if (!validation.isValid) {
      throw new ValidationError(validation.errors, `Validation error`)
    }

    return true
  }

  /**
   * Is the Token Code Valid?
   *
   * @param tokenCode
   *
   * @returns Token Code is Valid
   */
  public static isTokenCodeValid(tokenCode: string) {
    const validation = validate({ tokenCode }, { tokenCode: allRules.chain })
    if (!validation.isValid) {
      throw new ValidationError(validation.errors)
    }

    return true
  }

  /**
   * Is the FIO Address Valid?
   *
   * @param fioAddress
   *
   * @returns Fio Address is Valid
   */
  public static isFioAddressValid(fioAddress: string) {
    const validation = validate({ fioAddress }, { fioAddress: allRules.fioAddress })
    if (!validation.isValid) {
      throw new ValidationError(validation.errors)
    }

    return true
  }

  /**
   * Is the FIO Domain Valid?
   *
   * @param fioDomain
   *
   * @returns FIO Domain is Valid
   */
  public static isFioDomainValid(fioDomain: string) {
    const validation = validate({ fioDomain }, { fioDomain: allRules.fioDomain })
    if (!validation.isValid) {
      throw new ValidationError(validation.errors)
    }

    return true
  }

  /**
   * Is the FIO Public Key Valid?
   *
   * @param fioPublicKey
   *
   * @returns FIO Public Key is Valid
   */
  public static isFioPublicKeyValid(fioPublicKey: string) {
    const validation = validate({ fioPublicKey }, { fioPublicKey: allRules.fioPublicKey })
    if (!validation.isValid) {
      throw new ValidationError(validation.errors)
    }

    return true
  }

  /**
   * Is the Public Address Valid?
   *
   * @param publicAddress
   *
   * @returns Public Address is Valid
   */
  public static isPublicAddressValid(publicAddress: string) {
    const validation = validate({ publicAddress }, { publicAddress: allRules.nativeBlockchainPublicAddress })
    if (!validation.isValid) {
      throw new ValidationError(validation.errors)
    }

    return true
  }


  /**
   * Convert a FIO Token Amount to FIO SUFs
   *
   * @param amount
   *
   * 2.568 FIO should be 2568000000 SUFs
   *
   * @returns FIO SUFs
   */
  public static amountToSUF(amount: number): number {

    // get integer part
    var floor = Math.floor(amount)
    var tempResult = floor * this.SUFUnit

    // get remainder
    var remainder = (amount % 1)
    var remainderResult = remainder * (this.SUFUnit)
    var floorRemainder = Math.floor(remainderResult)

    // add integer and remainder
    return tempResult + floorRemainder
  }

  /**
   * Convert FIO SUFs to a FIO Token amount
   *
   * @param suf
   *
   * @returns FIO Token amount
   */
  public static SUFToAmount(suf: number): number {
    return parseInt(`${suf}`) / this.SUFUnit
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
   * Default FIO Address of the wallet which generates transactions.
   */
  public technologyProviderId: string

  /**
   * SUFs = Smallest Units of FIO
   */
  public static SUFUnit: number = 1000000000

  /**
   * Defines whether SignedTransaction would execute or return prepared transaction
   */
  private returnPreparedTrx: boolean = false

  /**
   * // how to instantiate fetchJson parameter
   * i.e.
   * fetch = require('node-fetch')
   *
   * const fetchJson = async (uri, opts = {}) => {
   *  return fetch(uri, opts)
   * }
   *
   * @param privateKey the fio private key of the client sending requests to FIO API.
   * @param publicKey the fio public key of the client sending requests to FIO API.
   * @param baseUrl the url to the FIO API.
   * @param fetchjson - the module to use for HTTP Post/Get calls (see above for example)
   * @param registerMockUrl the url to the mock server
   * @param technologyProviderId Default FIO Address of the wallet which generates transactions.
   */
  constructor(
    privateKey: string,
    publicKey: string,
    baseUrl: string,
    fetchjson: FetchJson,
    registerMockUrl = '',
    technologyProviderId: string = '',
    returnPreparedTrx: boolean = false,
  ) {
    this.transactions = new Transactions()
    Transactions.baseUrl = baseUrl
    Transactions.FioProvider = Fio
    Transactions.fetchJson = fetchjson
    this.registerMockUrl = registerMockUrl
    this.privateKey = privateKey
    this.publicKey = publicKey
    this.technologyProviderId = technologyProviderId
    this.returnPreparedTrx = returnPreparedTrx

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
   * Returns technologyProviderId or default
   */
  public getTechnologyProviderId(technologyProviderId: string | null): string {
    return technologyProviderId !== null ? technologyProviderId : this.technologyProviderId
  }

  /**
   * Set returnPreparedTrx
   */
  public setSignedTrxReturnOption(returnPreparedTrx: boolean): void {
    this.returnPreparedTrx = returnPreparedTrx
  }

  /**
   * Execute prepared transaction.
   *
   * @param endPoint endpoint.
   * @param preparedTrx
   */
  public async executePreparedTrx(
    endPoint: string,
    preparedTrx: object
  ): Promise<any> {
    const response = await this.transactions.executeCall(`chain/${endPoint}`, JSON.stringify(preparedTrx))
    return SignedTransaction.prepareResponse(response)
  }

  /**
   * Registers a FIO Address on the FIO blockchain. The owner will be the public key associated with the FIO SDK instance.
   *
   * @param fioAddress FIO Address to register.
   * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by @ [getFee] for correct value.
   * @param technologyProviderId FIO Address of the wallet which generates this transaction.
   */
  public registerFioAddress(
    fioAddress: string,
    maxFee: number,
    technologyProviderId: string | null = null,
  ): Promise<RegisterFioAddressResponse> {
    const registerFioAddress = new SignedTransactions.RegisterFioAddress(
      fioAddress,
      null,
      maxFee,
      this.getTechnologyProviderId(technologyProviderId),
    )
    return registerFioAddress.execute(this.privateKey, this.publicKey, this.returnPreparedTrx)
  }

  /**
   * Registers a Fio Address on behalf of the owner FIO Public key parameter. Owner FIO Public key owns the FIO address
   *
   * @param fioAddress FIO Address to register.
   * @param ownerPublicKey Owner FIO Public Key.
   * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by @ [getFee] for correct value.
   * @param technologyProviderId FIO Address of the wallet which generates this transaction.
   */
  public registerOwnerFioAddress(
    fioAddress: string,
    ownerPublicKey: string,
    maxFee: number,
    technologyProviderId: string | null = null,
  ): Promise<RegisterFioAddressResponse> {
    const registerFioAddress = new SignedTransactions.RegisterFioAddress(
      fioAddress,
      ownerPublicKey,
      maxFee,
      this.getTechnologyProviderId(technologyProviderId),
    )
    return registerFioAddress.execute(this.privateKey, this.publicKey, this.returnPreparedTrx)
  }

  /**
   * Registers a FIO Domain on the FIO blockchain.
   *
   * @param fioDomain FIO Domain to register. The owner will be the public key associated with the FIO SDK instance.
   * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by @ [getFee] for correct value.
   * @param technologyProviderId FIO Address of the wallet which generates this transaction.
   */
  public registerFioDomain(
    fioDomain: string,
    maxFee: number,
    technologyProviderId: string | null = null,
  ): Promise<RegisterFioDomainResponse> {
    const registerFioDomain = new SignedTransactions.RegisterFioDomain(
      fioDomain,
      null,
      maxFee,
      this.getTechnologyProviderId(technologyProviderId),
    )
    return registerFioDomain.execute(this.privateKey, this.publicKey, this.returnPreparedTrx)
  }

  /**
   * Registers a FIO Domain on behalf of the owner FIO Public key parameter. Owner FIO Public key owns the FIO domain.
   *
   * @param fioDomain FIO Domain to register. The owner will be the public key associated with the FIO SDK instance.
   * @param ownerPublicKey Owner FIO Public Key.
   * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by @ [getFee] for correct value.
   * @param technologyProviderId FIO Address of the wallet which generates this transaction.
   */
  public registerOwnerFioDomain(
    fioDomain: string,
    ownerPublicKey: string,
    maxFee: number,
    technologyProviderId: string | null = null,
  ): Promise<RegisterFioDomainResponse> {
    const registerFioDomain = new SignedTransactions.RegisterFioDomain(
      fioDomain,
      ownerPublicKey,
      maxFee,
      this.getTechnologyProviderId(technologyProviderId),
    )
    return registerFioDomain.execute(this.privateKey, this.publicKey, this.returnPreparedTrx)
  }

    /**
     * Burns a FIO Address on the FIO blockchain.
     *
     * @param fioAddress FIO Address to burn. The owner will be the public key associated with the FIO SDK instance.
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by @ [getFee] for correct value.
     * @param technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    public burnFioAddress(
        fioAddress: string,
        maxFee: number,
        technologyProviderId: string | null = null,
    ): Promise<BurnFioAddressResponse> {
        const burnFioAddress = new SignedTransactions.BurnFioAddress(
            fioAddress,
            maxFee,
            this.getTechnologyProviderId(technologyProviderId),
        )
        return burnFioAddress.execute(this.privateKey, this.publicKey, this.returnPreparedTrx)
    }

  /**
   * Transfers a FIO Domain on the FIO blockchain.
   *
   * @param fioDomain FIO Domain to transfer. The owner will be the public key associated with the FIO SDK instance.
   * @param newOwnerKey FIO Public Key of the new owner.
   * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by @ [getFee] for correct value.
   * @param technologyProviderId FIO Address of the wallet which generates this transaction.
   */
  public transferFioDomain(
      fioDomain: string,
      newOwnerKey: string,
      maxFee: number,
      technologyProviderId: string | null = null,
  ): Promise<TransferFioDomainResponse> {
    const transferFioDomain = new SignedTransactions.TransferFioDomain(
        fioDomain,
        newOwnerKey,
        maxFee,
        this.getTechnologyProviderId(technologyProviderId),
    )
    return transferFioDomain.execute(this.privateKey, this.publicKey, this.returnPreparedTrx)
  }

  /**
   * Transfers a FIO Address on the FIO blockchain.
   *
   * @param fioAddress FIO Address to transfer. The owner will be the public key associated with the FIO SDK instance.
   * @param newOwnerKey FIO Public Key of the new owner.
   * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by @ [getFee] for correct value.
   * @param technologyProviderId FIO Address of the wallet which generates this transaction.
   */
  public transferFioAddress(
      fioAddress: string,
      newOwnerKey: string,
      maxFee: number,
      technologyProviderId: string | null = null,
  ): Promise<TransferFioAddressResponse> {
    const transferFioAddress = new SignedTransactions.TransferFioAddress(
        fioAddress,
        newOwnerKey,
        maxFee,
        this.getTechnologyProviderId(technologyProviderId),
    )
    return transferFioAddress.execute(this.privateKey, this.publicKey, this.returnPreparedTrx)
  }

  /**
   * Renew a FIO Address on the FIO blockchain.
   *
   * @param fioAddress FIO Address to renew.
   * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by @ [getFee] for correct value.
   * @param technologyProviderId FIO Address of the wallet which generates this transaction.
   */
  public renewFioAddress(
    fioAddress: string,
    maxFee: number,
    technologyProviderId: string | null = null,
  ): Promise<RenewFioAddressResponse> {
    const renewFioAddress = new SignedTransactions.RenewFioAddress(
      fioAddress,
      maxFee,
      this.getTechnologyProviderId(technologyProviderId),
    )
    return renewFioAddress.execute(this.privateKey, this.publicKey, this.returnPreparedTrx)
  }

  /**
   * Renew a FIO Domain on the FIO blockchain.
   *
   * @param fioDomain FIO Domain to renew.
   * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by @ [getFee] for correct value.
   * @param technologyProviderId FIO Address of the wallet which generates this transaction.
   */
  public renewFioDomain(
    fioDomain: string,
    maxFee: number,
    technologyProviderId: string | null = null,
  ): Promise<RenewFioDomainResponse> {
    const renewFioDomain = new SignedTransactions.RenewFioDomain(
      fioDomain,
      maxFee,
      this.getTechnologyProviderId(technologyProviderId),
    )
    return renewFioDomain.execute(this.privateKey, this.publicKey, this.returnPreparedTrx)
  }

  /**
   * This call allows a public address of the specific blockchain type to be added to the FIO Address.
   *
   * @param fioAddress FIO Address which will be mapped to public address.
   * @param chainCode Blockchain code for blockchain hosting this token.
   * @param tokenCode Token code to be used with that public address.
   * @param publicAddress The public address to be added to the FIO Address for the specified token.
   * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by /get_fee for correct value.
   * @param technologyProviderId FIO Address of the wallet which generates this transaction.
   */
  public addPublicAddress(
    fioAddress: string,
    chainCode: string,
    tokenCode: string,
    publicAddress: string,
    maxFee: number,
    technologyProviderId: string | null = null,
  ): Promise<AddPublicAddressResponse> {
    const addPublicAddress = new SignedTransactions.AddPublicAddress(
      fioAddress,
      [{
        chain_code: chainCode,
        token_code: tokenCode,
        public_address: publicAddress
      }],
      maxFee,
      this.getTechnologyProviderId(technologyProviderId),
    )
    return addPublicAddress.execute(this.privateKey, this.publicKey, this.returnPreparedTrx)
  }

  /**
   * This call cancels the specified fio funds request..
   *
   * @param fioRequestID The id of the request.
   * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by /get_fee for correct value.
   * @param technologyProviderId FIO Address of the wallet which generates this transaction.
   */
  public cancelFundsRequest(
      fioRequestId: number,
      maxFee: number,
      technologyProviderId: string | null = null,
  ): Promise<CancelFundsRequestResponse> {
    const cancelFundsRequest = new SignedTransactions.CancelFundsRequest(
        fioRequestId,
        maxFee,
        this.getTechnologyProviderId(technologyProviderId),
    )
    return cancelFundsRequest.execute(this.privateKey, this.publicKey, this.returnPreparedTrx)
  }


  /**
   * This call allows a any number of public addresses matching the blockchain code, the token code and the public address to be removed from the FIO Address.
   *
   * @param fioAddress FIO Address which will be mapped to public address.
   * @param publicAddresses a list of publicAddresses, each containing chain_code, token_code, and public_address.
   * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by /get_fee for correct value.
   * @param technologyProviderId FIO Address of the wallet which generates this transaction.
   */
  public removePublicAddresses(
    fioAddress: string,
    publicAddresses: PublicAddress[],
    maxFee: number,
    technologyProviderId: string | null = null,
  ): Promise<RemovePublicAddressesResponse> {
    const removePublicAddresses = new SignedTransactions.RemovePublicAddresses(
      fioAddress,
      publicAddresses,
      maxFee,
      this.getTechnologyProviderId(technologyProviderId),
    )
    return removePublicAddresses.execute(this.privateKey, this.publicKey, this.returnPreparedTrx)
  }

  /**
   * This call allows a user to transfer locked tokens to the specified fio public key
   *
   * @param payeePublicKey this is the fio public key for the user to receive locked tokens.
   * @param canVote true if these locked tokens can be voted, false if these locked tokens are not to be voted.
   * @param periods this is an array of lockperiods defining the duration and percent of each period, must be in time order.
   * @param amount this is the amount in SUFs to be transfered.
   * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by /get_fee for correct value.
   * @param technologyProviderId FIO Address of the wallet which generates this transaction.
   */
  public transferLockedTokens(
      payeePublicKey: string,
      canVote: boolean,
      periods: LockPeriod[],
      amount: number,
      maxFee: number,
      technologyProviderId: string | null = null,
  ): Promise<TransferLockedTokensResponse> {
    const transferLockedTokens = new SignedTransactions.TransferLockedTokens(
        payeePublicKey,
        canVote,
        periods,
        amount,
        maxFee,
        this.getTechnologyProviderId(technologyProviderId),
    )
    return transferLockedTokens.execute(this.privateKey, this.publicKey)
  }



  /**
   * This call allows a user to remove all addresses from the specified FIO Address, all addresses except the FIO address will be removed.
   *
   * @param fioAddress FIO Address which will be mapped to public address.
   * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by /get_fee for correct value.
   * @param technologyProviderId FIO Address of the wallet which generates this transaction.
   */
  public removeAllPublicAddresses(
      fioAddress: string,
      maxFee: number,
      technologyProviderId: string | null = null,
  ): Promise<RemoveAllPublicAddressesResponse> {
    const removeAllPublicAddresses = new SignedTransactions.RemoveAllPublicAddresses(
        fioAddress,
        maxFee,
        this.getTechnologyProviderId(technologyProviderId),
    )
    return removeAllPublicAddresses.execute(this.privateKey, this.publicKey, this.returnPreparedTrx)
  }


  /**
   * This call allows a public addresses of the specific blockchain type to be added to the FIO Address.
   *
   * @param fioAddress FIO Address which will be mapped to public addresses.
   * @param publicAddresses Array of public addresses to be added to the FIO Address for the specified token.
   * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by /get_fee for correct value.
   * @param technologyProviderId FIO Address of the wallet which generates this transaction.
   */
  public addPublicAddresses(
    fioAddress: string,
    publicAddresses: PublicAddress[],
    maxFee: number,
    technologyProviderId: string | null = null,
  ): Promise<AddPublicAddressResponse> {
    const addPublicAddress = new SignedTransactions.AddPublicAddress(
      fioAddress,
      publicAddresses,
      maxFee,
      this.getTechnologyProviderId(technologyProviderId),
    )
    return addPublicAddress.execute(this.privateKey, this.publicKey, this.returnPreparedTrx)
  }

  /**
   * By default all FIO Domains are non-public, meaning only the owner can register FIO Addresses on that domain. Setting them to public allows anyone to register a FIO Address on that domain.
   *
   * @param fioDomain FIO Domain to change visibility.
   * @param isPublic 1 - allows anyone to register FIO Address, 0 - only owner of domain can register FIO Address.
   * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by /get_fee for correct value.
   * @param technologyProviderId FIO Address of the wallet which generates this transaction.
   */
  public setFioDomainVisibility(
    fioDomain: string,
    isPublic: boolean,
    maxFee: number,
    technologyProviderId: string | null = null,
  ): Promise<SetFioDomainVisibilityResponse> {
    const SetFioDomainVisibility = new SignedTransactions.SetFioDomainVisibility(
      fioDomain,
      isPublic,
      maxFee,
      this.getTechnologyProviderId(technologyProviderId),
    )
    return SetFioDomainVisibility.execute(this.privateKey, this.publicKey, this.returnPreparedTrx)
  }

  /**
   *
   * Records information on the FIO blockchain about a transaction that occurred on other blockchain, i.e. 1 BTC was sent on Bitcoin Blockchain, and both
   * sender and receiver have FIO Addresses. OBT stands for Other Blockchain Transaction
   *
   * @param fioRequestId ID of funds request, if this Record Send transaction is in response to a previously received funds request.  Send empty if no FIO Request ID
   * @param payerFioAddress FIO Address of the payer. This address initiated payment.
   * @param payeeFioAddress FIO Address of the payee. This address is receiving payment.
   * @param payerTokenPublicAddress Public address on other blockchain of user sending funds.
   * @param payeeTokenPublicAddress Public address on other blockchain of user receiving funds.
   * @param amount Amount sent.
   * @param chainCode Blockchain code for blockchain hosting this token.
   * @param tokenCode Code of the token represented in Amount requested, i.e. BTC.
   * @param status Status of this OBT. Allowed statuses are: sent_to_blockchain.
   * @param obtId Other Blockchain Transaction ID (OBT ID), i.e Bitcoin transaction ID.
   * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by /get_fee for correct value.
   * @param technologyProviderId FIO Address of the wallet which generates this transaction.
   * @param payeeFioPublicKey Public address on other blockchain of user receiving funds.
   * @param memo
   * @param hash
   * @param offlineUrl
   */
  public async recordObtData(
    fioRequestId: number | null,
    payerFioAddress: string,
    payeeFioAddress: string,
    payerTokenPublicAddress: string,
    payeeTokenPublicAddress: string,
    amount: number,
    chainCode: string,
    tokenCode: string,
    status: string,
    obtId: string,
    maxFee: number,
    technologyProviderId: string | null = null,
    payeeFioPublicKey: string | null = null,
    memo: string | null = null,
    hash: string | null = null,
    offLineUrl: string | null = null,
  ): Promise<RecordObtDataResponse> {
    let payeeKey: any = { public_address: '' }
    if (!payeeFioPublicKey && typeof payeeFioPublicKey !== 'string') {
      payeeKey = await this.getFioPublicAddress(payeeFioAddress)
    } else {
      payeeKey.public_address = payeeFioPublicKey
    }
    const recordObtData = new SignedTransactions.RecordObtData(
      fioRequestId,
      payerFioAddress,
      payeeFioAddress,
      payerTokenPublicAddress,
      payeeTokenPublicAddress,
      amount,
      chainCode,
      tokenCode,
      obtId,
      maxFee,
      status,
      this.getTechnologyProviderId(technologyProviderId),
      payeeKey.public_address,
      memo,
      hash,
      offLineUrl,
    )
    return recordObtData.execute(this.privateKey, this.publicKey, this.returnPreparedTrx)
  }

  /**
   * Retrives OBT metadata data stored using record send.
   *
   * @param limit Number of request to return. If omitted, all requests will be returned.
   * @param offset First request from list to return. If omitted, 0 is assumed.
   * @param tokenCode Code of the token to filter results
   */
  public getObtData(limit?: number, offset?: number, tokenCode?: string): Promise<GetObtDataResponse> {
    const getObtDataRequest = new queries.GetObtData(this.publicKey, limit, offset, tokenCode)
    return getObtDataRequest.execute(this.publicKey, this.privateKey)
  }

  /**
   * Reject funds request.
   *
   * @param fioRequestId Existing funds request Id
   * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by [getFee] for correct value.
   * @param technologyProviderId FIO Address of the wallet which generates this transaction.
   */
  public rejectFundsRequest(
    fioRequestId: number,
    maxFee: number,
    technologyProviderId: string | null = null,
  ): Promise<RejectFundsResponse> {
    const rejectFundsRequest = new SignedTransactions.RejectFundsRequest(
      fioRequestId,
      maxFee,
      this.getTechnologyProviderId(technologyProviderId),
    )
    return rejectFundsRequest.execute(this.privateKey, this.publicKey, this.returnPreparedTrx)
  }

  /**
   * Create a new funds request on the FIO chain.
   *
   * @param payerFioAddress FIO Address of the payer. This address will receive the request and will initiate payment.
   * @param payeeFioAddress FIO Address of the payee. This address is sending the request and will receive payment.
   * @param payeeTokenPublicAddress Payee's public address where they want funds sent.
   * @param amount Amount requested.
   * @param chainCode Blockchain code for blockchain hosting this token.
   * @param tokenCode Code of the token represented in amount requested.
   * @param memo
   * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by [getFee] for correct value.
   * @param payerFioPublicKey Public address on other blockchain of user sending funds.
   * @param technologyProviderId FIO Address of the wallet which generates this transaction.
   * @param hash
   * @param offlineUrl
   */
  public async requestFunds(
    payerFioAddress: string,
    payeeFioAddress: string,
    payeeTokenPublicAddress: string,
    amount: number,
    chainCode: string,
    tokenCode: string,
    memo: string,
    maxFee: number,
    payerFioPublicKey: string | null = null,
    technologyProviderId: string | null = null,
    hash?: string,
    offlineUrl?: string,
  ): Promise<RequestFundsResponse> {
    let payerKey: any = { public_address: '' }
    if (!payerFioPublicKey && typeof payerFioPublicKey !== 'string') {
      payerKey = await this.getFioPublicAddress(payerFioAddress)
    } else {
      payerKey.public_address = payerFioPublicKey
    }
    const requestNewFunds = new SignedTransactions.RequestNewFunds(
      payerFioAddress,
      payerKey.public_address,
      payeeFioAddress,
      this.getTechnologyProviderId(technologyProviderId),
      maxFee,
      payeeTokenPublicAddress,
      amount,
      chainCode,
      tokenCode,
      memo,
      hash,
      offlineUrl,
    )
    return requestNewFunds.execute(this.privateKey, this.publicKey, this.returnPreparedTrx)
  }

  /**
   * Retrieves info on locks for this pub key
   *
   * @param fioPublicKey FIO public key.
   */
  public getLocks(fioPublicKey: string): Promise<LocksResponse> {
    const getLocks = new queries.GetLocks(fioPublicKey)
    return getLocks.execute(this.publicKey)
  }

  /*
   * Retrieves info on account for this actor
   *
   * @param account FIO account.
   */
  public getAccount(actor: string): Promise<AccountResponse> {
    const getAccount = new queries.GetAccount(actor)
    return getAccount.execute(this.publicKey)
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
   * Returns FIO Addresses  owned by this public key.
   *
   * @param fioPublicKey FIO public key of owner.
   * @param limit Number of request to return. If omitted, all requests will be returned.
   * @param offset First request from list to return. If omitted, 0 is assumed.
   */
  public getFioAddresses(fioPublicKey: string, limit?: number, offset?: number): Promise<FioAddressesResponse> {
    const getNames = new queries.GetAddresses(fioPublicKey, limit, offset)
    return getNames.execute(this.publicKey)
  }

  /**
   * Returns FIO domains  owned by this public key.
   *
   * @param fioPublicKey FIO public key of owner.
   * @param limit Number of request to return. If omitted, all requests will be returned.
   * @param offset First request from list to return. If omitted, 0 is assumed.
   */
  public getFioDomains(fioPublicKey: string, limit?: number, offset?: number): Promise<FioAddressesResponse> {
    const getNames = new queries.GetDomains(fioPublicKey, limit, offset)
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
   * Polls for any cancelled requests sent by public key associated with the FIO SDK instance.
   *
   * @param limit Number of request to return. If omitted, all requests will be returned.
   * @param offset First request from list to return. If omitted, 0 is assumed.
   */
  public getCancelledFioRequests(limit?: number, offset?: number): Promise<CancelledFioRequestResponse> {
    const cancelledFioRequest = new queries.CancelledFioRequests(this.publicKey, limit, offset)
    return cancelledFioRequest.execute(this.publicKey, this.privateKey)
  }

  /**
   * Returns a token public address for specified token code and FIO Address.
   *
   * @param fioAddress FIO Address for which the token public address is to be returned.
   * @param chainCode Blockchain code for which public address is to be returned.
   * @param tokenCode Token code for which public address is to be returned.
   */
  public getPublicAddress(
    fioAddress: string,
    chainCode: string,
    tokenCode: string,
  ): Promise<PublicAddressResponse> {
    const publicAddressLookUp = new queries.GetPublicAddress(
      fioAddress,
      chainCode,
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
    return this.getPublicAddress(fioAddress, 'FIO', 'FIO')
  }

  /**
   *
   * Transfers FIO tokens from public key associated with the FIO SDK instance to
   * the payeePublicKey.
   *
   * @param payeeFioPublicKey FIO public Address of the one receiving the tokens.
   * @param amount Amount sent in SUFs.
   * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by /get_fee for correct value.
   * @param technologyProviderId FIO Address of the wallet which generates this transaction.
   */
  public transferTokens(
    payeeFioPublicKey: string,
    amount: number,
    maxFee: number,
    technologyProviderId: string | null = null,
  ): Promise<TransferTokensResponse> {
    const transferTokens = new SignedTransactions.TransferTokens(
      payeeFioPublicKey,
      amount,
      maxFee,
      this.getTechnologyProviderId(technologyProviderId),
    )
    return transferTokens.execute(this.privateKey, this.publicKey, this.returnPreparedTrx)
  }

  /**
   * Compute and return fee amount for specific call and specific user
   *
   * @param fioAddress FIO Address incurring the fee and owned by signer.
   */
  public getFeeForTransferLockedTokens(fioAddress: string): Promise<FioFeeResponse> {
    return this.getFee(EndPoint.transferLockedTokens, fioAddress)
  }


  /**
   * Compute and return fee amount for specific call and specific user
   *
   * @param endPoint Name of API call end point, e.g. add_pub_address.
   * @param fioAddress
   *        if endPointName is RenewFioAddress, FIO Address incurring the fee and owned by signer.
   *        if endPointName is RenewFioDomain, FIO Domain incurring the fee and owned by signer.
   *        if endPointName is RecordObtData, Payer FIO Address incurring the fee and owned by signer.
   *
   *        Omit for:
   *        - register_fio_domain
   *        - register_fio_address
   *        - transfer_tokens_pub_key
   */
  public getFee(endPoint: EndPoint, fioAddress: string = ''): Promise<FioFeeResponse> {
    const fioFee = new queries.GetFee(endPoint, fioAddress)
    return fioFee.execute(this.publicKey)
  }

  /**
   * Compute and return fee amount for specific call and specific user
   *
   * @param payerFioAddress, Payer FIO Address incurring the fee and owned by signer.
   */
  public getFeeForRecordObtData(payerFioAddress: string): Promise<FioFeeResponse> {
    return this.getFee(EndPoint.recordObtData, payerFioAddress)
  }

  /**
   * Compute and return fee amount for specific call and specific user
   *
   * @param payeeFioAddress Payee FIO Address incurring the fee and owned by signer.
   */
  public getFeeForNewFundsRequest(payeeFioAddress: string): Promise<FioFeeResponse> {
    return this.getFee(EndPoint.newFundsRequest, payeeFioAddress)
  }

  /**
   * Compute and return fee amount for specific call and specific user
   *
   * @param payerFioAddress Payer FIO Address incurring the fee and owned by signer.
   */
  public getFeeForRejectFundsRequest(payerFioAddress: string): Promise<FioFeeResponse> {
    return this.getFee(EndPoint.rejectFundsRequest, payerFioAddress)
  }

  /**
   * Compute and return fee amount for specific call and specific user
   *
   * @param fioAddress FIO Address incurring the fee and owned by signer.
   */
  public getFeeForAddPublicAddress(fioAddress: string): Promise<FioFeeResponse> {
    return this.getFee(EndPoint.addPubAddress, fioAddress)
  }

  /**
   * Compute and return fee amount for specific call and specific user
   *
   * @param fioAddress FIO Address incurring the fee and owned by signer.
   */
  public getFeeForCancelFundsRequest(fioAddress: string): Promise<FioFeeResponse> {
    return this.getFee(EndPoint.cancelFundsRequest, fioAddress)
  }

  /**
   * Compute and return fee amount for specific call and specific user
   *
   * @param fioAddress FIO Address incurring the fee and owned by signer.
   */
  public getFeeForRemovePublicAddresses(fioAddress: string): Promise<FioFeeResponse> {
    return this.getFee(EndPoint.removePubAddress, fioAddress)
  }

  /**
   * Compute and return fee amount for specific call and specific user
   *
   * @param fioAddress FIO Address incurring the fee and owned by signer.
   */
  public getFeeForRemoveAllPublicAddresses(fioAddress: string): Promise<FioFeeResponse> {
    return this.getFee(EndPoint.removeAllPubAddresses, fioAddress)
  }

    /**
     * Compute and return fee amount for specific call and specific user
     *
     * @param fioAddress FIO Address incurring the fee and owned by signer.
     */
    public getFeeForBurnFioAddress(fioAddress: string): Promise<FioFeeResponse> {
        return this.getFee(EndPoint.burnFioAddress, fioAddress)
    }

  /**
   * Compute and return fee amount for specific call and specific user
   *
   * @param fioAddress FIO Address incurring the fee and owned by signer.
   */
  public getFeeForTransferFioAddress(fioAddress: string): Promise<FioFeeResponse> {
    return this.getFee(EndPoint.transferFioAddress, fioAddress)
  }

  /**
   * Compute and return fee amount for specific call and specific user
   *
   * @param fioAddress FIO Address incurring the fee and owned by signer.
   */
  public getFeeForTransferFioDomain(fioAddress: string): Promise<FioFeeResponse> {
    return this.getFee(EndPoint.transferFioDomain, fioAddress)
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
   * Allows advance user to send their own content directly to FIO contracts
   *
   * @param account Account name
   * @param action Name of action
   * @param data JSON object with params for action
   */
  public pushTransaction(account: string, action: string, data: any): Promise<any> {
    data.tpid = this.getTechnologyProviderId(data.tpid)
    const pushTransaction = new SignedTransactions.PushTransaction(
      action,
      account,
      data,
    )
    return pushTransaction.execute(this.privateKey, this.publicKey, this.returnPreparedTrx)
  }

  /**
   * @ignore
   */
  public genericAction(action: string, params: any): any {
    switch (action) {
      case 'getFioPublicKey':
        return this.getFioPublicKey()
      case 'getAccount':
        return this.getAccount(params.account)
      case 'registerFioAddress':
        if (params.ownerPublicKey) {
          return this.registerOwnerFioAddress(
            params.fioAddress,
            params.ownerPublicKey,
            params.maxFee,
            params.technologyProviderId,
          )
        } else {
          return this.registerFioAddress(
            params.fioAddress,
            params.maxFee,
            params.technologyProviderId,
          )
        }
      case 'registerOwnerFioAddress':
        return this.registerOwnerFioAddress(
          params.fioAddress,
          params.ownerPublicKey,
          params.maxFee,
          params.technologyProviderId,
        )
      case 'transferLockedTokens':
        return this.transferLockedTokens(
            params.payeePublicKey,
            params.canVote,
            params.periods,
            params.amount,
            params.maxFee,
            params.technologyProviderId,
        )
      case 'registerFioDomain':
        return this.registerFioDomain(
          params.fioDomain,
          params.maxFee,
          params.technologyProviderId,
        )
      case 'registerOwnerFioDomain':
        return this.registerOwnerFioDomain(
          params.fioDomain,
          params.ownerPublicKey,
          params.maxFee,
          params.technologyProviderId,
        )
      case 'renewFioDomain':
        return this.renewFioDomain(
          params.fioDomain,
          params.maxFee,
          params.technologyProviderId,
        )
      case 'renewFioAddress':
        return this.renewFioAddress(
          params.fioAddress,
          params.maxFee,
          params.technologyProviderId,
        )
      case 'burnFioAddress':
        return this.burnFioAddress(
          params.fioAddress,
          params.maxFee,
          params.technologyProviderId,
        )
      case 'transferFioAddress':
        return this.transferFioAddress(
            params.fioAddress,
            params.newOwnerKey,
            params.maxFee,
            params.technologyProviderId,
        )
      case 'transferFioDomain':
        return this.transferFioDomain(
            params.fioDomain,
            params.newOwnerKey,
            params.maxFee,
            params.technologyProviderId,
        )
      case 'addPublicAddress':
        return this.addPublicAddress(
          params.fioAddress,
          params.chainCode,
          params.tokenCode,
          params.publicAddress,
          params.maxFee,
          params.technologyProviderId,
        )
      case 'addPublicAddresses':
        return this.addPublicAddresses(
          params.fioAddress,
          params.publicAddresses,
          params.maxFee,
          params.technologyProviderId,
        )
      case 'removePublicAddresses':
        return this.removePublicAddresses(
          params.fioAddress,
          params.publicAddresses,
          params.maxFee,
          params.technologyProviderId,
        )
      case 'getLocks':
        return this.getLocks(params.fioPublicKey)
      case 'cancelFundsRequest':
        return this.cancelFundsRequest(
            params.fioRequestId,
            params.maxFee,
            params.technologyProviderId,
        )
      case 'removeAllPublicAddresses':
        return this.removeAllPublicAddresses(
            params.fioAddress,
            params.maxFee,
            params.technologyProviderId,
        )
      case 'setFioDomainVisibility':
        return this.setFioDomainVisibility(
          params.fioDomain,
          params.isPublic,
          params.maxFee,
          params.technologyProviderId,
        )
      case 'recordObtData':
        return this.recordObtData(
          params.fioRequestId || null,
          params.payerFioAddress,
          params.payeeFioAddress,
          params.payerTokenPublicAddress,
          params.payeeTokenPublicAddress,
          params.amount,
          params.chainCode,
          params.tokenCode,
          params.status || '',
          params.obtId,
          params.maxFee,
          params.technologyProviderId,
          params.payeeFioPublicKey,
          params.memo,
          params.hash,
          params.offLineUrl,
        )
      case 'getFeeForTransferLockedTokens':
        return this.getFeeForTransferLockedTokens(params.fioAddress)
      case 'getObtData':
        return this.getObtData(params.limit, params.offset, params.tokenCode)
      case 'rejectFundsRequest':
        return this.rejectFundsRequest(
          params.fioRequestId,
          params.maxFee,
          params.technologyProviderId,
        )
      case 'requestFunds':
        return this.requestFunds(
          params.payerFioAddress,
          params.payeeFioAddress,
          params.payeeTokenPublicAddress,
          params.amount,
          params.chainCode,
          params.tokenCode,
          params.memo,
          params.maxFee,
          params.payerFioPublicKey,
          params.technologyProviderId,
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
        case 'getFioDomains':
            return this.getFioDomains(params.fioPublicKey, params.limit, params.offset)
        case 'getFioAddresses':
            return this.getFioAddresses(params.fioPublicKey, params.limit, params.offset)
      case 'getPendingFioRequests':
        return this.getPendingFioRequests(params.limit, params.offset)
      case 'getCancelledFioRequests':
        return this.getCancelledFioRequests(params.limit, params.offset)
      case 'getSentFioRequests':
        return this.getSentFioRequests(params.limit, params.offset)
      case 'getPublicAddress':
        return this.getPublicAddress(params.fioAddress, params.chainCode, params.tokenCode)
      case 'transferTokens':
        return this.transferTokens(
          params.payeeFioPublicKey,
          params.amount,
          params.maxFee,
          params.technologyProviderId,
        )
      case 'getFee':
        return this.getFee(params.endPoint, params.fioAddress)
      case 'getFeeForRecordObtData':
        return this.getFeeForRecordObtData(params.payerFioAddress)
      case 'getFeeForNewFundsRequest':
        return this.getFeeForNewFundsRequest(params.payeeFioAddress)
      case 'getFeeForRejectFundsRequest':
        return this.getFeeForRejectFundsRequest(params.payerFioAddress)
      case 'getFeeForBurnFioAddress':
        return this.getFeeForBurnFioAddress(params.fioAddress)
      case 'getFeeForTransferFioAddress':
        return this.getFeeForTransferFioAddress(params.fioAddress)
      case 'getFeeForTransferFioDomain':
        return this.getFeeForTransferFioDomain(params.fioAddress)
      case 'getFeeForAddPublicAddress':
        return this.getFeeForAddPublicAddress(params.fioAddress)
      case 'getFeeForCancelFundsRequest':
        return this.getFeeForCancelFundsRequest(params.fioAddress)
      case 'getFeeForRemovePublicAddresses':
        return this.getFeeForRemovePublicAddresses(params.fioAddress)
      case 'getFeeForRemoveAllPublicAddresses':
        return this.getFeeForRemoveAllPublicAddresses(params.fioAddress)
      case 'getMultiplier':
        return this.getMultiplier()
      case 'pushTransaction':
        return this.pushTransaction(params.account, params.action, params.data)
    }
  }

  /**
   * @ignore
   */
  private getAbi(accountName: string): Promise<AbiResponse> {
    const abi = new queries.GetAbi(accountName)
    return abi.execute(this.publicKey)
  }
}
