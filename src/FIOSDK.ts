import { Fio } from '@fioprotocol/fiojs'
import { EndPoint } from './entities/EndPoint'
import {LockPeriod} from './entities/LockPeriod'
import { PublicAddress } from './entities/PublicAddress'
import {
  AbiResponse,
  AccountResponse,
  AddBundledTransactionsResponse,
  AddPublicAddressResponse,
  AvailabilityResponse,
  BalanceResponse,
  BurnFioAddressResponse,
  CancelFundsRequestResponse,
  CancelledFioRequestResponse,
  FioAddressesResponse,
  FioFeeResponse,
  FioNamesResponse,
  GetObtDataResponse,
  LocksResponse,
  PendingFioRequestsResponse,
  PermissionsResponse,
  PublicAddressesResponse,
  PublicAddressResponse,
  ReceivedFioRequestsResponse,
  RecordObtDataResponse,
  RegisterFioAddressResponse,
  RegisterFioDomainResponse,
  RejectFundsResponse,
  RemoveAllPublicAddressesResponse,
  RemovePublicAddressesResponse,
  RenewFioAddressResponse,
  RenewFioDomainResponse,
  RequestFundsResponse,
  SentFioRequestResponse,
  SetFioDomainVisibilityResponse,
  TransactionResponse,
  TransferFioAddressResponse,
  TransferFioDomainResponse,
  TransferLockedTokensResponse,
  TransferTokensResponse,
} from './entities/responses'
import { ValidationError } from './entities/ValidationError'
import * as queries from './transactions/queries'
import * as SignedTransactions from './transactions/signed'
import { EncryptOptions } from './transactions/signed/PushTransaction'
import { SignedTransaction } from './transactions/signed/SignedTransaction'
import { Transactions } from './transactions/Transactions'
import { Constants } from './utils/constants'
import { allRules, validate } from './utils/validation'

/**
 * @ignore
 */
// tslint:disable-next-line:no-var-requires
const { Ecc } = require('@fioprotocol/fiojs')

/**
 * @ignore
 */
type FetchJson = (uri: string, opts?: object) => Promise<object>

export class FIOSDK {
  private proxyHandle = {
    // We save refrenece to our class inside the object
    main: this,
    /**
     * The apply will be fired each time the function is called
     * @param  target Called function
     * @param  scope  Scope from where function was called
     * @param  args   Arguments passed to function
     * @return        Results of the function
     */
    apply: async function (target: any, scope: any, args: any) {
      // Remember that you have to exclude methods which you are gonna use
      // inside here to avoid “too much recursion” error

      const setAbi = async (accountName: string) => {
        if (!Transactions.abiMap.get(accountName)) {
          const response = await this.main.getAbi(accountName)
          Transactions.abiMap.set(response.account_name, response)
        }
      }
      let rawAbiAccountNameList = [];
      if (FIOSDK.customRawAbiAccountName) {
        rawAbiAccountNameList = [...Constants.rawAbiAccountName, ...FIOSDK.customRawAbiAccountName];
      } else {
        rawAbiAccountNameList = Constants.rawAbiAccountName;
      }

      const setAbiPromises = rawAbiAccountNameList.map(accountName => setAbi(accountName))

      await Promise.allSettled(setAbiPromises).then(results => results.forEach(result => {
        if (result.status === 'rejected') {
          let error = '';
          const reason = result.reason;

          const errorObj = reason.json || reason.errors && reason.errors[0].json;

          if (errorObj) {
            error = errorObj.error?.details[0]?.message;
          }
          if (!error) error = reason.message

          if (error.includes(Constants.missingAbiError)) {
            const abiAccountName = reason.requestParams && reason.requestParams.body && reason.requestParams.body.replace('{', '').replace('}', '').split(':')[1].replace('\"', '').replace('\"', '');

            if (!this.main.rawAbiMissingWarnings?.includes(abiAccountName) || (FIOSDK.customRawAbiAccountName && FIOSDK.customRawAbiAccountName.includes(abiAccountName))) {
              console.warn('\x1b[33m', 'FIO_SDK ABI WARNING:', error);
              FIOSDK.setRawAbiMissingWarnings(abiAccountName, this.main);
            }
          } else {
            throw new Error(`FIO_SDK ABI Error: ${result.reason}`);
          }
        }
      }));

      // Here we bind method with our class by accessing reference to instance
      return target.bind(this.main)(...args);
    }
  }

  /**
   * Needed for testing abi
  **/
  public static customRawAbiAccountName: string[] | null

  /**
   * Needed for testing abi
  **/
  public static setCustomRawAbiAccountName(customRawAbiAccountName: string | null) {
    if (customRawAbiAccountName) {
      FIOSDK.customRawAbiAccountName = [customRawAbiAccountName];
    } else {
      FIOSDK.customRawAbiAccountName = null;
    }
  }

  /**
   * @ignore
   */
  public static ReactNativeFio: any

  /**
   * SUFs = Smallest Units of FIO
   */
  public static SUFUnit: number = 1000000000

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
    const accountnm = Fio.accountHash(fiopubkey)
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
    const floor = Math.floor(amount)
    const tempResult = floor * this.SUFUnit

    // get remainder
    const remainder: number = Number((amount % 1).toFixed(9))
    const remainderResult = remainder * (this.SUFUnit)
    const floorRemainder = Math.floor(remainderResult)

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
    return parseInt(`${suf}`, 10) / this.SUFUnit
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
   * Defines whether SignedTransaction would execute or return prepared transaction
   */
  private returnPreparedTrx: boolean = false

  /**
   * Stored raw abi missing warnings
  **/
  public rawAbiMissingWarnings: string[]
  static rawAbiMissingWarnings: string[]

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
   * @param apiUrls the url or list of urls to the FIO API.
   * @param fetchjson - the module to use for HTTP Post/Get calls (see above for example)
   * @param registerMockUrl the url to the mock server
   * @param technologyProviderId Default FIO Address of the wallet which generates transactions.
   * @param returnPreparedTrx flag indicate that it should return prepared transaction or should be pushed to server.
   */
  constructor(
    privateKey: string,
    publicKey: string,
    apiUrls: string[] | string,
    fetchjson: FetchJson,
    registerMockUrl = '',
    technologyProviderId: string = '',
    returnPreparedTrx: boolean = false,
  ) {
    this.transactions = new Transactions()
    Transactions.baseUrls = Array.isArray(apiUrls) ? apiUrls : [apiUrls]
    Transactions.FioProvider = Fio
    Transactions.fetchJson = fetchjson
    this.registerMockUrl = registerMockUrl
    this.privateKey = privateKey
    this.publicKey = publicKey
    this.technologyProviderId = technologyProviderId
    this.returnPreparedTrx = returnPreparedTrx
    this.rawAbiMissingWarnings = []

    const methods = Object.getOwnPropertyNames(FIOSDK.prototype);

    // Replace all methods with Proxy methods
    // Find and remove constructor as we don't need Proxy on it
    methods.filter(method => !Constants.classMethodsToExcludeFromProxy.includes(method)).forEach(methodName => {
      this[methodName as keyof FIOSDK] = new Proxy(this[methodName as keyof FIOSDK], this.proxyHandle);
    });
  }

  /**
   * Set stored raw abi missing warnings
  **/
  public static setRawAbiMissingWarnings(rawAbiName: string, fioSdkInctance: FIOSDK) {
    fioSdkInctance.rawAbiMissingWarnings.push(rawAbiName);
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
  public getTechnologyProviderId(technologyProviderId?: string | null): string {
    return technologyProviderId !== null && technologyProviderId !== undefined
        ? technologyProviderId
        : this.technologyProviderId
  }

  /**
   * Set returnPreparedTrx
   */
  public setSignedTrxReturnOption(returnPreparedTrx: boolean): void {
    this.returnPreparedTrx = returnPreparedTrx
  }

  /**
   * Set transactions baseUrls
   */
  public setApiUrls(apiUrls: string[]): void {
    Transactions.baseUrls = apiUrls
  }

  /**
   * Execute prepared transaction.
   *
   * @param endPoint endpoint.
   * @param preparedTrx
   */
  public async executePreparedTrx(
    endPoint: string,
    preparedTrx: object,
  ): Promise<any> {
    const response = await this.transactions.multicastServers({ endpoint: `chain/${endPoint}`, body: JSON.stringify(preparedTrx) })
    return SignedTransaction.prepareResponse(response, true)
  }

  /**
   * Registers a FIO Address on the FIO blockchain. The owner will be the public key associated with the FIO SDK instance.
   *
   * @param fioAddress FIO Address to register.
   * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by @ [getFee] for correct value.
   * @param technologyProviderId FIO Address of the wallet which generates this transaction.
   * @param expirationOffset Expiration time offset for this transaction in seconds. Default is 180 seconds. Increasing number of seconds gives transaction more lifetime term.
   */
  public registerFioAddress(
    fioAddress: string,
    maxFee: number,
    technologyProviderId: string | null = null,
    expirationOffset?: number,
  ): Promise<RegisterFioAddressResponse> {
    const registerFioAddress = new SignedTransactions.RegisterFioAddress(
      fioAddress,
      null,
      maxFee,
      this.getTechnologyProviderId(technologyProviderId),
    )
    return registerFioAddress.execute(this.privateKey, this.publicKey, this.returnPreparedTrx, expirationOffset)
  }

  /**
   * Registers a Fio Address on behalf of the owner FIO Public key parameter. Owner FIO Public key owns the FIO address
   *
   * @param fioAddress FIO Address to register.
   * @param ownerPublicKey Owner FIO Public Key.
   * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by @ [getFee] for correct value.
   * @param technologyProviderId FIO Address of the wallet which generates this transaction.
   * @param expirationOffset Expiration time offset for this transaction in seconds. Default is 180 seconds. Increasing number of seconds gives transaction more lifetime term.
   */
  public registerOwnerFioAddress(
    fioAddress: string,
    ownerPublicKey: string,
    maxFee: number,
    technologyProviderId: string | null = null,
    expirationOffset?: number,
  ): Promise<RegisterFioAddressResponse> {
    const registerFioAddress = new SignedTransactions.RegisterFioAddress(
      fioAddress,
      ownerPublicKey,
      maxFee,
      this.getTechnologyProviderId(technologyProviderId),
    )
    return registerFioAddress.execute(this.privateKey, this.publicKey, this.returnPreparedTrx, expirationOffset)
  }

  /**
   * Registers a FIO Address and FIO domain on behalf of the owner FIO Public key parameter. Owner FIO Public key owns the FIO address
   *
   * @param options.fioAddress FIO Address to register.
   * @param options.isPublic true - allows anyone to register FIO Address, false - only owner of domain can register FIO Address.
   * @param options.ownerPublicKey Owner FIO Public Key.
   * @param options.maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by @ [getFee] for correct value.
   * @param options.technologyProviderId FIO Address of the wallet which generates this transaction.
   * @param options.expirationOffset Expiration time offset for this transaction in seconds. Default is 180 seconds. Increasing number of seconds gives transaction more lifetime term.
   */
  public registerFioDomainAddress(
      options: {
        fioAddress: string;
        maxFee: number;
        isPublic?: boolean;
        ownerPublicKey?: string | null;
        technologyProviderId?: string | null;
        expirationOffset?: number;
      },
  ): Promise<RegisterFioAddressResponse> {
    const registerFioDomainAddress = new SignedTransactions.RegisterFioDomainAddress(
        {...options, technologyProviderId: this.getTechnologyProviderId(options.technologyProviderId)}
    )
    return registerFioDomainAddress.execute(this.privateKey, this.publicKey, this.returnPreparedTrx, options.expirationOffset)
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
   * Adds bundles of transactions to FIO Address.
   *
   * @param fioAddress FIO Address to transfer. The owner will be the public key associated with the FIO SDK instance.
   * @param bundleSets Number of sets of bundles to add to FIO Address.
   * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by @ [getFee] for correct value.
   * @param technologyProviderId FIO Address of the wallet which generates this transaction.
   */
  public addBundledTransactions(
      fioAddress: string,
      bundleSets: number,
      maxFee: number,
      technologyProviderId: string | null = null,
  ): Promise<AddBundledTransactionsResponse> {
    const addBundledTransactions = new SignedTransactions.AddBundledTransactions(
        fioAddress,
        bundleSets,
        maxFee,
        this.getTechnologyProviderId(technologyProviderId),
    )
    return addBundledTransactions.execute(this.privateKey, this.publicKey, this.returnPreparedTrx)
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
        public_address: publicAddress,
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
   * @param options.fioRequestId ID of funds request, if this Record Send transaction is in response to a previously received funds request.  Send empty if no FIO Request ID
   * @param options.payerFioAddress FIO Address of the payer. This address initiated payment.
   * @param options.payeeFioAddress FIO Address of the payee. This address is receiving payment.
   * @param options.payerTokenPublicAddress Public address on other blockchain of user sending funds.
   * @param options.payeeTokenPublicAddress Public address on other blockchain of user receiving funds.
   * @param options.amount Amount sent.
   * @param options.chainCode Blockchain code for blockchain hosting this token.
   * @param options.tokenCode Code of the token represented in Amount requested, i.e. BTC.
   * @param options.status Status of this OBT. Allowed statuses are: sent_to_blockchain.
   * @param options.obtId Other Blockchain Transaction ID (OBT ID), i.e Bitcoin transaction ID.
   * @param options.maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by /get_fee for correct value.
   * @param options.technologyProviderId FIO Address of the wallet which generates this transaction.
   * @param options.payeeFioPublicKey Public address on other blockchain of user receiving funds.
   * @param options.memo
   * @param options.hash
   * @param options.offlineUrl
   * @param options.encryptPrivateKey Encrypt Private Key for ecnrypt content. If missig uses this.privateKey.
   */
  public async recordObtData(options: {
    amount: number,
    chainCode: string,
    encryptPrivateKey: string | null,
    fioRequestId: number | null,
    hash: string | null,
    maxFee: number,
    memo: string | null,
    obtId: string,
    offLineUrl: string | null,
    payeeFioAddress: string,
    payeeFioPublicKey: string,
    payeeTokenPublicAddress: string,
    payerFioAddress: string,
    payerTokenPublicAddress: string,
    status: string,
    technologyProviderId: string | null,
    tokenCode: string,
  }): Promise<RecordObtDataResponse> {
    const {
      amount,
      chainCode,
      encryptPrivateKey = null,
      fioRequestId = null,
      hash = null,
      maxFee,
      memo = null,
      obtId,
      offLineUrl = null,
      payeeFioAddress,
      payeeFioPublicKey = '',
      payeeTokenPublicAddress,
      payerFioAddress,
      payerTokenPublicAddress,
      status,
      technologyProviderId = null,
      tokenCode,
    } = options;

    let payeeKey = ''
    const encryptKey = await this.getEncryptKey(payeeFioAddress)

    if (encryptKey && encryptKey.encrypt_public_key) {
      payeeKey = encryptKey.encrypt_public_key
    } else if (payeeFioPublicKey && typeof payeeFioPublicKey === 'string') {
      payeeKey = payeeFioPublicKey
    }

    const recordObtData = new SignedTransactions.RecordObtData({
      amount,
      chainCode,
      encryptPrivateKey,
      fioRequestId,
      hash,
      maxFee,
      memo,
      obtId,
      offLineUrl,
      payeeFioAddress,
      payeeFioPublicKey: payeeKey,
      payeePublicAddress: payeeTokenPublicAddress,
      payerFioAddress,
      payerPublicAddress: payerTokenPublicAddress,
      status,
      technologyProviderId: this.getTechnologyProviderId(technologyProviderId),
      tokenCode,
    });

    return recordObtData.execute(this.privateKey, this.publicKey, this.returnPreparedTrx)
  }

  /**
   * Retrives OBT metadata data stored using record send.
   *
   * @param options.limit Number of request to return. If omitted, all requests will be returned.
   * @param options.offset First request from list to return. If omitted, 0 is assumed.
   * @param options.tokenCode Code of the token to filter results
   * @param options.includeEncrypted Set to true if you want to include not encrypted data in return.
   */
  public getObtData(options: { limit?: number, offset?: number, tokenCode?: string, includeEncrypted: boolean, encryptKeys?: Map<string, { privateKey: string, publicKey: string }[]> }): Promise<GetObtDataResponse> {
    const { limit, offset, tokenCode, includeEncrypted, encryptKeys } = options;
    const getObtDataRequest = new queries.GetObtData({ fioPublicKey: this.publicKey, limit, offset, tokenCode, includeEncrypted, encryptKeys, getEncryptKey: this.getEncryptKey })
    return getObtDataRequest.execute(this.publicKey, this.privateKey)
  }

  /**
   * Gets FIO permissions for the specified grantee account.
   *
   * @param limit Number of request to return. If omitted, all requests will be returned.
   * @param offset First request from list to return. If omitted, 0 is assumed.
   * @param granteeAccount string account name of the grantee account
   */
  public getGranteePermissions(granteeAccount: string, limit?: number, offset?: number): Promise<PermissionsResponse> {
    const getGranteePermissions = new queries.GetGranteePermissions( granteeAccount, limit, offset)
    return getGranteePermissions.execute(this.publicKey, this.privateKey)
  }

  /**
   * Gets FIO permissions for the specified grantor account.
   *
   * @param limit Number of request to return. If omitted, all requests will be returned.
   * @param offset First request from list to return. If omitted, 0 is assumed.
   * @param grantorAccount string account name of the grantor account
   */
  public getGrantorPermissions(grantorAccount: string, limit?: number, offset?: number): Promise<PermissionsResponse> {
    const getGrantorPermissions = new queries.GetGrantorPermissions( grantorAccount, limit, offset)
    return getGrantorPermissions.execute(this.publicKey, this.privateKey)
  }

  /**
   * Gets FIO permissions for the specified permission name and object name account.
   *
   * @param limit Number of request to return. If omitted, all requests will be returned.
   * @param offset First request from list to return. If omitted, 0 is assumed.
   * @param permissionName string permission name ex register_address_on_domain
   */
  public getObjectPermissions(permissionName: string, objectName: string, limit?: number, offset?: number): Promise<PermissionsResponse> {
    const getObjectPermissions = new queries.GetObjectPermissions( permissionName, objectName, limit, offset)
    return getObjectPermissions.execute(this.publicKey, this.privateKey)
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
   * @param options.amount Amount requested.
   * @param options.chainCode Blockchain code for blockchain hosting this token.
   * @param options.encryptPrivateKey Encrypt Private Key for ecnrypt content. If missig uses this.privateKey.
   * @param options.hash
   * @param options.maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by [getFee] for correct value.
   * @param options.memo
   * @param options.offlineUrl
   * @param options.payeeFioAddress FIO Address of the payee. This address is sending the request and will receive payment.
   * @param options.payeeTokenPublicAddress Payee's public address where they want funds sent.
   * @param options.payerFioAddress FIO Address of the payer. This address will receive the request and will initiate payment.
   * @param options.payerFioPublicKey Public address on other blockchain of user sending funds.
   * @param options.technologyProviderId FIO Address of the wallet which generates this transaction.
   * @param options.tokenCode Code of the token represented in amount requested.
   */
  public async requestFunds(options: {
    amount: number,
    chainCode: string,
    encryptPrivateKey: string | null,
    hash: string | null,
    maxFee: number,
    memo: string,
    offlineUrl: string | null,
    payeeFioAddress: string,
    payeeTokenPublicAddress: string,
    payerFioAddress: string,
    payerFioPublicKey: string | null,
    technologyProviderId: string | null,
    tokenCode: string,
  }): Promise<RequestFundsResponse> {
    const {
      amount,
      chainCode,
      encryptPrivateKey = null,
      hash = null,
      maxFee,
      memo,
      offlineUrl = null,
      payeeFioAddress,
      payeeTokenPublicAddress,
      payerFioAddress,
      payerFioPublicKey = null,
      technologyProviderId = null,
      tokenCode,
    } = options;

    let payerKey = ''
    const encryptKey = await this.getEncryptKey(payerFioAddress)

    if (encryptKey && encryptKey.encrypt_public_key) {
      payerKey = encryptKey.encrypt_public_key
    } else if (payerFioPublicKey && typeof payerFioPublicKey === 'string') {
      payerKey = payerFioPublicKey
    }

    const requestNewFunds = new SignedTransactions.RequestNewFunds({
      amount,
      chainCode,
      encryptPrivateKey,
      hash,
      maxFee,
      memo,
      offlineUrl,
      payeeFioAddress,
      payeeTokenPublicAddress,
      payerFioAddress,
      payerFioPublicKey: payerKey,
      technologyProviderId: this.getTechnologyProviderId(technologyProviderId),
      tokenCode,
    });
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
   * @param options.limit Number of request to return. If omitted, all requests will be returned.
   * @param options.offset First request from list to return. If omitted, 0 is assumed.
   * @param options.encryptKeys
   */
  public getPendingFioRequests(options: {
      limit?: number,
      offset?: number
      encryptKeys?: Map<string, { privateKey: string, publicKey: string }[]>
    }): Promise<PendingFioRequestsResponse> {
    const {
      limit, offset, encryptKeys
    } = options;
    const pendingFioRequests = new queries.PendingFioRequests({
      fioPublicKey: this.publicKey,
      limit,
      offset,
      encryptKeys,
      getEncryptKey: this.getEncryptKey.bind(this)
    })
    return pendingFioRequests.execute(this.publicKey, this.privateKey)
  }

  /**
   * Polls for any received requests sent to public key associated with the FIO SDK instance.
   *
   * @param options.limit Number of request to return. If omitted, all requests will be returned.
   * @param options.offset First request from list to return. If omitted, 0 is assumed.
   * @param options.includeEncrypted Set to true if you want to include not encrypted data in return.
   * @param options.encryptKeys
   */
  public getReceivedFioRequests(options: {
    limit?: number,
    offset?: number,
    includeEncrypted?: boolean,
    encryptKeys?: Map<string, { privateKey: string, publicKey: string }[]>
  }): Promise<ReceivedFioRequestsResponse> {
    const {
      limit,
      offset,
      includeEncrypted,
      encryptKeys,
    } = options;
    const receivedFioRequests = new queries.ReceivedFioRequests({
      fioPublicKey: this.publicKey,
      limit,
      offset,
      includeEncrypted,
      encryptKeys,
      getEncryptKey: this.getEncryptKey.bind(this)
    })
    return receivedFioRequests.execute(this.publicKey, this.privateKey)
  }

  /**
   * Polls for any sent requests sent by public key associated with the FIO SDK instance.
   *
   * @param options.limit Number of request to return. If omitted, all requests will be returned.
   * @param options.offset First request from list to return. If omitted, 0 is assumed.
   * @param options.includeEncrypted Set to true if you want to include not encrypted data in return.
   * @param options.encryptKeys
   */
  public getSentFioRequests(options: {
    limit?: number,
    offset?: number,
    includeEncrypted?: boolean,
    encryptKeys?: Map<string, { privateKey: string, publicKey: string }[]>
  }): Promise<SentFioRequestResponse> {
    const {
      limit,
      offset,
      includeEncrypted,
      encryptKeys,
    } = options;
    const sentFioRequest = new queries.SentFioRequests({ fioPublicKey: this.publicKey, limit, offset, includeEncrypted, encryptKeys, getEncryptKey: this.getEncryptKey.bind(this) })
    return sentFioRequest.execute(this.publicKey, this.privateKey)
  }

  /**
   * Polls for any cancelled requests sent by public key associated with the FIO SDK instance.
   *
   * @param options.limit Number of request to return. If omitted, all requests will be returned.
   * @param options.offset First request from list to return. If omitted, 0 is assumed.
   * @param options.encryptKeys
   */
  public getCancelledFioRequests(options: {
    limit?: number,
    offset?: number
    encryptKeys?: Map<string, { privateKey: string, publicKey: string }[]>
  }): Promise<CancelledFioRequestResponse> {
    const { limit, offset, encryptKeys } = options;
    const cancelledFioRequest = new queries.CancelledFioRequests({ fioPublicKey: this.publicKey, limit, offset, encryptKeys, getEncryptKey: this.getEncryptKey.bind(this) })
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
   * Returns all public addresses for specified FIO Address.
   *
   * @param fioAddress FIO Address for which the token public address is to be returned.
   * @param limit Number of results to return. If omitted, all results will be returned.
   * @param offset First result from list to return. If omitted, 0 is assumed.
   */
  public getPublicAddresses(
    fioAddress: string,
    limit?: number,
    offset?: number,
  ): Promise<PublicAddressesResponse> {
    const publicAddressesLookUp = new queries.GetPublicAddresses(
      fioAddress,
      limit,
      offset,
    )
    return publicAddressesLookUp.execute(this.publicKey)
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
   * Returns all mapped NFTs which have the specified contract address and token id or FIO Address or hash.
   *
   * @param options Detects the way how to get the data.
   * @param options.fioAddress FIO Address.
   * @param options.chainCode Chain code where NFT contract resides.
   * @param options.contractAddress NFT contract address.
   * @param options.tokenId NFT token ID.
   * @param options.hash SHA-256 hash of NFT asset, e.g. media url.
   * @param limit Number of records to return. If omitted, all records will be returned. Due to table read timeout, a value of less than 1,000 is recommended.
   * @param offset First record from list to return. If omitted, 0 is assumed.
   */
  public getNfts(
    options: {
      fioAddress?: string;
      chainCode?: string;
      contractAddress?: string;
      tokenId?: string;
      hash?: string;
    },
    limit?: number,
    offset?: number,
  ): Promise<PublicAddressesResponse> {
    const {
      fioAddress,
      chainCode,
      contractAddress,
      tokenId,
      hash,
    } = options
    let nftsLookUp
    if (fioAddress != null && fioAddress != '') {
      nftsLookUp = new queries.GetNftsByFioAddress(
        fioAddress,
        limit,
        offset,
      )
    }
    if (chainCode != null && chainCode != '' && contractAddress != null && contractAddress != '') {
      nftsLookUp = new queries.GetNftsByContract(
        chainCode,
        contractAddress,
        tokenId,
        limit,
        offset,
      )
    }
    if (hash != null && hash != '') {
      nftsLookUp = new queries.GetNftsByHash(
        hash,
        limit,
        offset,
      )
    }

    if (nftsLookUp == null) { throw new Error('At least one of these options should be set: fioAddress, chainCode/contractAddress, hash') }
    return nftsLookUp.execute(this.publicKey)
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
   * Return oracle fees amount
   */
  public getOracleFees(publicKey?: string): Promise<FioFeeResponse> {
    const fioFee = new queries.GetOracleFees()
    return fioFee.execute(publicKey || this.publicKey)
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
   * @param payerFioAddress Payer FIO Address incurring the fee and owned by signer.
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
  public getFeeForAddBundledTransactions(fioAddress: string): Promise<FioFeeResponse> {
    return this.getFee(EndPoint.addBundledTransactions, fioAddress)
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
    const mockRegisterFioName = new SignedTransactions.MockRegisterFioName(
      fioName,
      publicKey,
      server,
    )
    return mockRegisterFioName.execute()
  }

  /**
   * Stake FIO Tokens.
   *
   * @param amount Amount of SUFs to stake.
   * @param fioAddress FIO Address if using bundled transactions to pay. May be left empty if paying a fee instead.
   * @param fee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by /get_fee for correct value.
   * @param technologyProviderId FIO Address of the entity which generates this transaction. TPID rewards will be paid to this address. Set to empty if not known.
   */
  public async stakeFioTokens(
    amount: number,
    fioAddress: string = '',
    fee: number = 0,
    technologyProviderId: string | null = null,
  ): Promise<TransactionResponse> {
    if (!fee && fioAddress) {
      const { fee: stakeFee } = await this.getFee(EndPoint.stakeFioTokens, fioAddress)
      fee = stakeFee
    }
    return this.pushTransaction({
      account: 'fio.staking',
      action: 'stakefio',
      data: {
        amount,
        fio_address: fioAddress,
        max_fee: fee,
        tpid: technologyProviderId,
      },
    })
  }

  /**
   * Unstake FIO Tokens.
   *
   * @param amount Amount of SUFs to unstake.
   * @param fioAddress FIO Address if using bundled transactions to pay. May be left empty if paying a fee instead.
   * @param fee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by /get_fee for correct value.
   * @param technologyProviderId FIO Address of the entity which generates this transaction. TPID rewards will be paid to this address. Set to empty if not known.
   */
  public async unStakeFioTokens(
    amount: number,
    fioAddress: string = '',
    fee: number = 0,
    technologyProviderId: string | null = null,
  ): Promise<TransactionResponse> {
    if (!fee && fioAddress) {
      const { fee: stakeFee } = await this.getFee(EndPoint.unStakeFioTokens, fioAddress)
      fee = stakeFee
    }
    return this.pushTransaction({
      account: 'fio.staking',
      action: 'unstakefio',
      data: {
        amount,
        fio_address: fioAddress,
        max_fee: fee,
        tpid: technologyProviderId,
      },
    })
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
   * @param options.account Account name
   * @param options.action Name of action
   * @param options.data JSON object with params for action
   * @param options.authPermission
   * @param options.encryptOptions JSON object with params for encryption
   * @param options.signingAccount
   */
  public async pushTransaction(options: {
    account: string,
    action: string,
    data: any,
    authPermission?: string,
    encryptOptions?: EncryptOptions,
    signingAccount?: string,
}): Promise<any> {
    const {
      account,
      action,
      data,
      authPermission,
      encryptOptions = {},
      signingAccount,
    } = options;
    data.tpid = this.getTechnologyProviderId(data.tpid)
    if (data.content && !encryptOptions.publicKey) {
      switch (action) {
        case 'newfundsreq': {
          const payerKey = await this.getEncryptKey(data.payer_fio_address)
          encryptOptions.publicKey = payerKey.encrypt_public_key
          encryptOptions.contentType = 'new_funds_content'
          break
        }
        case 'recordobt': {
          const payeeKey = await this.getEncryptKey(data.payee_fio_address)
          encryptOptions.publicKey = payeeKey.encrypt_public_key
          encryptOptions.contentType = 'record_obt_data_content'
          break
        }
        default:
        //
      }
    }
    const pushTransaction = new SignedTransactions.PushTransaction({
      action,
      account,
      authPermission,
      data,
      encryptOptions,
      signingAccount,
})
    return pushTransaction.execute(this.privateKey, this.publicKey, this.returnPreparedTrx)
  }

  /**
   * @ignore
   */
  getAccountPubKey(account: string) {
    const getAccountPubKey = new queries.GetAccountPubKey(account);
    return getAccountPubKey.execute(this.publicKey);
  }

  /**
  * @ignore
  */
  public getEncryptKey(fioAddress: string) {
    const getEncryptKey = new queries.GetEncryptKey(fioAddress)
    return getEncryptKey.execute(this.publicKey)
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
      case 'registerFioDomainAddress':
        return this.registerFioDomainAddress(params)
      case 'registerFioAddress':
        if (params.ownerPublicKey) {
          return this.registerOwnerFioAddress(
            params.fioAddress,
            params.ownerPublicKey,
            params.maxFee,
            params.technologyProviderId,
            params.expirationOffset,
          )
        } else {
          return this.registerFioAddress(
            params.fioAddress,
            params.maxFee,
            params.technologyProviderId,
            params.expirationOffset,
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
      case 'addBundledTransactions':
        return this.addBundledTransactions(
            params.fioAddress,
            params.bundleSets,
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
        return this.recordObtData({
          amount: params.amount,
          chainCode: params.chainCode,
          encryptPrivateKey: params.encryptPrivateKey || null,
          fioRequestId: params.fioRequestId || null,
          hash: params.hash,
          maxFee: params.maxFee,
          memo: params.memo,
          obtId: params.obtId,
          offLineUrl: params.offLineUrl,
          payeeFioAddress: params.payeeFioAddress,
          payeeFioPublicKey: params.payeeFioPublicKey,
          payeeTokenPublicAddress: params.payeeTokenPublicAddress,
          payerFioAddress: params.payerFioAddress,
          payerTokenPublicAddress: params.payerTokenPublicAddress,
          status: params.status || '',
          technologyProviderId: params.technologyProviderId,
          tokenCode: params.tokenCode,
      })
      case 'getFeeForTransferLockedTokens':
        return this.getFeeForTransferLockedTokens(params.fioAddress)
      case 'getObtData':
        return this.getObtData({
          limit: params.limit,
          offset: params.offset,
          tokenCode: params.tokenCode,
          includeEncrypted: params.includeEncrypted,
          encryptKeys: params.encryptKeys
        })
      case 'getGranteePermissions':
        return this.getGranteePermissions(params.granteeAccount, params.limit, params.offset)
      case 'getGrantorPermissions':
        return this.getGrantorPermissions(params.grantorAccount, params.limit, params.offset)
      case 'getObjectPermissions':
        return this.getObjectPermissions(params.permissionName, params.objectName, params.limit, params.offset)
      case 'rejectFundsRequest':
        return this.rejectFundsRequest(
          params.fioRequestId,
          params.maxFee,
          params.technologyProviderId,
        )
      case 'requestFunds':
        return this.requestFunds({
          amount: params.amount,
          chainCode: params.chainCode,
          encryptPrivateKey: params.encryptPrivateKey,
          hash: params.hash,
          maxFee: params.maxFee,
          memo: params.memo,
          offlineUrl: params.offlineUrl,
          payeeFioAddress: params.payeeFioAddress,
          payeeTokenPublicAddress: params.payeeTokenPublicAddress,
          payerFioAddress: params.payerFioAddress,
          payerFioPublicKey: params.payerFioPublicKey,
          technologyProviderId: params.technologyProviderId,
          tokenCode: params.tokenCode,
        })
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
        return this.getPendingFioRequests({
          limit: params.limit,
          offset: params.offset,
          encryptKeys: params.encryptKeys
        })
      case 'getReceivedFioRequests':
        return this.getReceivedFioRequests({
          limit: params.limit,
          offset: params.offset,
          includeEncrypted: params.includeEncrypted,
          encryptKeys: params.encryptKeys
        })
      case 'getCancelledFioRequests':
        return this.getCancelledFioRequests({ limit: params.limit, offset: params.offset, encryptKeys: params.encryptKeys })
      case 'getSentFioRequests':
        return this.getSentFioRequests({
          limit: params.limit,
          offset: params.offset,
          includeEncrypted: params.includeEncrypted,
          encryptKeys: params.encryptKeys
        })
      case 'getPublicAddress':
        return this.getPublicAddress(params.fioAddress, params.chainCode, params.tokenCode)
      case 'getPublicAddresses':
        return this.getPublicAddresses(params.fioAddress, params.limit, params.offset)
      case 'getNfts':
        return this.getNfts(params.options, params.limit, params.offset)
      case 'transferTokens':
        return this.transferTokens(
          params.payeeFioPublicKey,
          params.amount,
          params.maxFee,
          params.technologyProviderId,
        )
      case 'stakeFioTokens':
        return this.stakeFioTokens(
          params.amount,
          params.fioAddress,
          params.maxFee,
          params.technologyProviderId,
        )
      case 'unStakeFioTokens':
        return this.unStakeFioTokens(
          params.amount,
          params.fioAddress,
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
      case 'getFeeForAddBundledTransactions':
        return this.getFeeForAddBundledTransactions(params.fioAddress)
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
        return this.pushTransaction({
          account: params.account,
          action: params.action,
          data: params.data,
          authPermission: params.authPermission,
          encryptOptions: params.encryptOptions,
          signingAccount: params.signingAccount,
        })
      case 'getAccountPubKey':
        return this.getAccountPubKey(params.account)
      case 'getEncryptKey':
        return this.getEncryptKey(params.fioAddress)
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
