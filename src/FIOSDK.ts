import {Ecc, Fio} from '@fioprotocol/fiojs'
import {
    AbiResponse,
    AccountPubKeyResponse,
    AccountResponse,
    AddBundledResponse,
    AddBundledTransactionsOptions,
    AddPublicAddressesOptions,
    AddPublicAddressesResponse,
    AddPublicAddressOptions,
    AvailabilityCheckResponse,
    BurnFioAddressOptions,
    BurnFioAddressResponse,
    CancelFundsRequestOptions,
    CancelFundsRequestResponse,
    CancelledFioRequestsResponse,
    EncryptKeyResponse,
    EndPoint,
    FetchJson,
    FioAddressesResponse,
    FioBalanceResponse,
    FioDomainsResponse,
    FioFeeResponse,
    FioNamesResponse,
    FioOracleFeesResponse,
    FioSdkOptions,
    FundsRequestResponse,
    GetAccountOptions,
    GetAccountPubKeyOptions,
    GetCancelledFioRequestsOptions,
    GetEncryptKeyOptions,
    GetFeeForAddBundledTransactionsOptions,
    GetFeeForAddPublicAddressOptions,
    GetFeeForBurnFioAddressOptions,
    GetFeeForCancelFundsRequestOptions,
    GetFeeForNewFundsRequestOptions,
    GetFeeForRecordObtDataOptions,
    GetFeeForRejectFundsRequestOptions,
    GetFeeForRemoveAllPublicAddressesOptions,
    GetFeeForRemovePublicAddressesOptions,
    GetFeeForTransferFioAddressOptions,
    GetFeeForTransferFioDomainOptions,
    GetFeeForTransferLockedTokensOptions,
    GetFeeOptions,
    GetFioAddressesOptions,
    GetFioBalanceOptions,
    GetFioDomainsOptions,
    GetFioNamesOptions,
    GetFioPublicAddressOptions,
    GetGranteePermissionsOptions,
    GetGrantorPermissionsOptions,
    GetLocksOptions,
    GetNftsOptions,
    GetObjectPermissionsOptions,
    GetObtDataOptions,
    GetObtDataResponse,
    GetOracleFeesOptions,
    GetPendingFioRequestsOptions,
    GetPublicAddressesOptions,
    GetPublicAddressOptions,
    GetReceivedFioRequestsOptions,
    GetSentFioRequestsOptions,
    IsAvailableOptions,
    LockPeriod,
    LocksResponse,
    NftsResponse,
    PendingFioRequestsResponse,
    PermissionsResponse,
    PublicAddress,
    PublicAddressesResponse,
    PublicAddressResponse,
    PushTransactionOptions,
    ReceivedFioRequestsResponse,
    RecordObtDataOptions,
    RecordObtDataResponse,
    RegisterFioAddressOptions,
    RegisterFioAddressResponse,
    RegisterFioDomainAddressOptions,
    RegisterFioDomainOptions,
    RegisterFioDomainResponse,
    RegisterOwnerFioAddressOptions,
    RegisterOwnerFioDomainOptions,
    RejectFundsRequestOptions,
    RejectFundsRequestResponse,
    RemoveAllPublicAddressesOptions,
    RemoveAllPublicAddressesResponse,
    RemovePublicAddressesOptions,
    RemovePublicAddressesResponse,
    RenewFioAddressOptions,
    RenewFioAddressResponse,
    RenewFioDomainOptions,
    RenewFioDomainResponse,
    RequestFundsOptions,
    SentFioRequestsResponse,
    SetFioDomainVisibilityOptions,
    SetFioDomainVisibilityResponse,
    StakeFioTokensOptions,
    TransactionResponse,
    TransferFioAddressOptions,
    TransferFioAddressResponse,
    TransferFioDomainOptions,
    TransferFioDomainResponse,
    TransferLockedTokensOptions,
    TransferLockedTokensResponse,
    TransferTokensOptions,
    TransferTokensResponse,
    UnStakeFioTokensOptions,
    ValidationError,
} from './entities'
import * as queries from './transactions/queries'
import {Request, RequestConfig} from './transactions/Request'
import * as requests from './transactions/requests'
import {SignedRequest} from './transactions/requests/SignedRequest'
import {Constants} from './utils/constants'
import {cleanupObject, resolveOptions} from './utils/utils'
import {allRules, validate} from './utils/validation'

export * from './entities'

// TODO move all stuff for testing to another class and extend from FIOSDK
// TODO discus maybe add additional parameter notThrowValidationErrors {boolean} to constructor?
// true - validate methods return true or false
// false - validate methods return true or throw ValidationError
// TODO discus maybe add additional parameter useCamelCaseResponses {boolean} to constructor?
// true - transform all responses to camelcase
// false - left default responses
export class FIOSDK {

    // TODO if only for testing why not ignored?
    /**
     * Needed for testing abi
     */
    public static customRawAbiAccountName: string[] | null

    /**
     * SUFs = Smallest Units of FIO
     */
    public static SUFUnit: number = 1000000000
    public static rawAbiMissingWarnings: string[]

    // TODO if only for testing why not ignored?
    /**
     * Needed for testing abi
     */
    public static setCustomRawAbiAccountName(customRawAbiAccountName: string | null) {
        if (customRawAbiAccountName) {
            FIOSDK.customRawAbiAccountName = [customRawAbiAccountName]
        } else {
            FIOSDK.customRawAbiAccountName = null
        }
    }

    // TODO why ignore?
    /**
     * @ignore
     */
    public static async createPrivateKey(entropy: Buffer): Promise<{
        fioKey: string;
        mnemonic: string;
    }> {
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
        return {fioKey, mnemonic}
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
        return {publicKey}
    }

    /**
     * hash a pub key
     *
     * @param fioPublicKey FIO private key.
     *
     * @returns FIO account derived from pub key.
     */
    // TODO add return type
    public static accountHash(fioPublicKey: string) {
        const accountnm = Fio.accountHash(fioPublicKey)
        return {accountnm}
    }

    /**
     * Is the Chain Code Valid?
     *
     * @param chainCode
     *
     * @returns Chain Code is Valid
     */
    // TODO change throw error to return boolean
    public static isChainCodeValid(chainCode: string) {
        const validation = validate({chainCode}, {chainCode: allRules.chain})
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
    // TODO change throw error to return boolean
    public static isTokenCodeValid(tokenCode: string) {
        const validation = validate({tokenCode}, {tokenCode: allRules.chain})
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
    // TODO change throw error to return boolean
    public static isFioAddressValid(fioAddress: string) {
        const validation = validate({fioAddress}, {fioAddress: allRules.fioAddress})
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
    // TODO change throw error to return boolean
    public static isFioDomainValid(fioDomain: string) {
        const validation = validate({fioDomain}, {fioDomain: allRules.fioDomain})
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
    // TODO change throw error to return boolean
    public static isFioPublicKeyValid(fioPublicKey: string) {
        const validation = validate({fioPublicKey}, {fioPublicKey: allRules.fioPublicKey})
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
    // TODO change throw error to return boolean
    public static isPublicAddressValid(publicAddress: string) {
        const validation = validate({publicAddress}, {publicAddress: allRules.nativeBlockchainPublicAddress})
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

    /**
     * Set stored raw abi missing warnings
     */
    public static setRawAbiMissingWarnings(rawAbiName: string, fioSdkInstance: FIOSDK) {
        fioSdkInstance.rawAbiMissingWarnings.push(rawAbiName)
    }

    public config: RequestConfig

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
     * Stored raw abi missing warnings
     */
    public rawAbiMissingWarnings: string[]

    /**
     * @ignore
     */
    private proxyHandle = {
        // We save reference to our class inside the object
        main: this,
        /**
         * To apply will be fired each time the function is called
         * @param  target Called function
         * @param  scope  Scope from where function was called
         * @param  args   Arguments passed to function
         * @return        Results of the function
         */
        async apply(target: any, scope: any, args: any) {
            // Remember that you have to exclude methods which you are going to use
            // inside here to avoid “too much recursion” error

            const setAbi = async (accountName: string) => {
                if (!Request.abiMap.get(accountName)) {
                    const response = await this.main.getAbi(accountName)
                    Request.abiMap.set(response.account_name, response)
                }
            }
            let rawAbiAccountNameList = []
            if (FIOSDK.customRawAbiAccountName) {
                rawAbiAccountNameList = [...Constants.rawAbiAccountName, ...FIOSDK.customRawAbiAccountName]
            } else {
                rawAbiAccountNameList = Constants.rawAbiAccountName
            }

            const setAbiPromises = rawAbiAccountNameList.map((accountName) => setAbi(accountName))

            await Promise.allSettled(setAbiPromises).then((results) => results.forEach((result) => {
                if (result.status === 'rejected') {
                    let error = ''
                    const reason = result.reason

                    const errorObj = reason.json || reason.errors && reason.errors[0].json

                    if (errorObj) {
                        error = errorObj.error?.details[0]?.message
                    }
                    if (!error) {
                        error = reason.message
                    }

                    if (error.includes(Constants.missingAbiError)) {
                        const abiAccountName = reason.requestParams
                            && reason.requestParams.body
                            && reason.requestParams.body
                                .replace('{', '')
                                .replace('}', '')
                                .split(':')[1]
                                .replace('\"', '')
                                .replace('\"', '')

                        if (!this.main.rawAbiMissingWarnings?.includes(abiAccountName)
                            || (FIOSDK.customRawAbiAccountName
                                && FIOSDK.customRawAbiAccountName.includes(abiAccountName))
                        ) {
                            // tslint:disable-next-line:no-console
                            console.warn('\x1b[33m', 'FIO_SDK ABI WARNING:', error)
                            FIOSDK.setRawAbiMissingWarnings(abiAccountName, this.main)
                        }
                    } else {
                        throw new Error(`FIO_SDK ABI Error: ${result.reason}`)
                    }
                }
            }))

            // Here we bind method with our class by accessing reference to instance
            return target.bind(this.main)(...args)
        },
    }

    /**
     * @ignore
     * Defines whether SignedTransaction would execute or return prepared transaction
     */
    private returnPreparedTrx: boolean = false

    /**
     * @deprecated
     *
     * @param privateKey the fio private key of the client sending requests to FIO API.
     * @param publicKey the fio public key of the client sending requests to FIO API.
     * @param apiUrls the url or list of urls to the FIO API.
     * @param fetchJson - the module to use for HTTP Post/Get calls
     * How to instantiate fetchJson parameter:
     * ```ts
     * // i.e.
     * fetch = require('node-fetch')
     *
     * const fetchJson = async (uri, opts = {}) => {
     *     return fetch(uri, opts)
     * }
     * ```
     * @param registerMockUrl the url to the mock server
     * @param technologyProviderId Default FIO Address of the wallet which generates transactions.
     * @param returnPreparedTrx flag indicate that it should return prepared transaction or should be pushed to server.
     */
    constructor(
        privateKey: string,
        publicKey: string,
        apiUrls: string[] | string,
        fetchJson: FetchJson,
        registerMockUrl?: string,
        technologyProviderId?: string,
        returnPreparedTrx?: boolean,
    )
    /**
     * @param options.privateKey the fio private key of the client sending requests to FIO API.
     * @param options.publicKey the fio public key of the client sending requests to FIO API.
     * @param options.apiUrls the url or list of urls to the FIO API.
     * @param options.fetchJson - the module to use for HTTP Post/Get calls
     * How to instantiate fetchJson parameter i.e.:
     * fetch = require('node-fetch')
     *
     * const fetchJson = async (uri, opts = {}) => {
     *     return fetch(uri, opts)
     * }
     * @param options.registerMockUrl the url to the mock server
     * @param options.technologyProviderId Default FIO Address of the wallet which generates transactions.
     * @param options.returnPreparedTrx flag indicate that it should return prepared transaction
     * or should be pushed to server.
     */
    constructor(options: FioSdkOptions)
    constructor() {
        const {
            privateKey,
            publicKey,
            apiUrls,
            fetchJson,
            registerMockUrl = '',
            technologyProviderId = '',
            returnPreparedTrx = false,
        } = resolveOptions<FioSdkOptions>({
            arguments,
            keys: ['privateKey', 'publicKey', 'apiUrls', 'fetchJson', 'registerMockUrl', 'technologyProviderId', 'returnPreparedTrx'],
        })
        this.config = {
            baseUrls: Array.isArray(apiUrls) ? apiUrls : [apiUrls],
            fetchJson,
            // TODO Double check chainId
            // @ts-ignore
            fioProvider: Fio,
        }
        this.registerMockUrl = registerMockUrl
        this.privateKey = privateKey
        this.publicKey = publicKey
        this.technologyProviderId = technologyProviderId
        this.returnPreparedTrx = returnPreparedTrx
        this.rawAbiMissingWarnings = []

        const methods = Object.getOwnPropertyNames(FIOSDK.prototype)

        // Replace all methods with Proxy methods
        // Find and remove constructor as we don't need Proxy on it
        methods.filter((method) => !Constants.classMethodsToExcludeFromProxy.includes(method)).forEach((methodName) => {
            this[methodName as keyof FIOSDK] = new Proxy(this[methodName as keyof FIOSDK], this.proxyHandle)
        })
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
        return technologyProviderId !== undefined && technologyProviderId !== null
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
        this.config.baseUrls = apiUrls
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
        const response = await new Request(this.config).multicastServers({
            body: JSON.stringify(preparedTrx),
            endpoint: `chain/${endPoint}`,
        })
        return SignedRequest.prepareResponse(response, true)
    }

    /**
     * @deprecated
     * Registers a FIO Address on the FIO blockchain.
     * The owner will be the public key associated with the FIO SDK instance.
     *
     * @param fioAddress FIO Address to register.
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by @ [getFee] for correct value.
     * @param technologyProviderId FIO Address of the wallet which generates this transaction.
     * @param expirationOffset Expiration time offset for this transaction in seconds.
     * Default is 180 seconds. Increasing number of seconds gives transaction more lifetime term.
     */
    public registerFioAddress(
        fioAddress: string,
        maxFee: number,
        technologyProviderId?: string | null,
        expirationOffset?: number | null,
    ): Promise<RegisterFioAddressResponse>
    /**
     * Registers a FIO Address on the FIO blockchain.
     * The owner will be the public key associated with the FIO SDK instance.
     *
     * @param options.fioAddress FIO Address to register.
     * @param options.maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by @ [getFee] for correct value.
     * @param options.technologyProviderId FIO Address of the wallet which generates this transaction.
     * @param options.expirationOffset Expiration time offset for this transaction in seconds.
     * Default is 180 seconds. Increasing number of seconds gives transaction more lifetime term.
     */
    public registerFioAddress(options: RegisterFioAddressOptions): Promise<RegisterFioAddressResponse>
    public registerFioAddress(): Promise<RegisterFioAddressResponse> {
        const args = resolveOptions<RegisterFioAddressOptions>({
            arguments,
            keys: ['fioAddress', 'maxFee', 'technologyProviderId', 'expirationOffset'],
        })
        const registerFioAddress = new requests.RegisterFioAddressRequest(this.config, {
            ...args,
            technologyProviderId: this.getTechnologyProviderId(args.technologyProviderId),
        })
        return registerFioAddress.execute(
            this.privateKey,
            this.publicKey,
            this.returnPreparedTrx,
            args.expirationOffset,
        )
    }

    /**
     * @deprecated
     * Registers a Fio Address on behalf of the owner FIO Public key parameter.
     * Owner FIO Public key owns the FIO address
     *
     * @param fioAddress FIO Address to register.
     * @param ownerPublicKey Owner FIO Public Key.
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded
     * by @ [getFee] for correct value.
     * @param technologyProviderId FIO Address of the wallet which generates this transaction.
     * @param expirationOffset Expiration time offset for this transaction in seconds. Default is 180 seconds.
     * Increasing number of seconds gives transaction more lifetime term.
     */
    public registerOwnerFioAddress(
        fioAddress: string,
        ownerPublicKey: string,
        maxFee: number,
        technologyProviderId?: string | null,
        expirationOffset?: number | null,
    ): Promise<RegisterFioAddressResponse>
    /**
     * Registers a Fio Address on behalf of the owner FIO Public key parameter.
     * Owner FIO Public key owns the FIO address
     *
     * @param options.fioAddress FIO Address to register.
     * @param options.ownerPublicKey Owner FIO Public Key.
     * @param options.maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded
     * by @ [getFee] for correct value.
     * @param options.technologyProviderId FIO Address of the wallet which generates this transaction.
     * @param options.expirationOffset Expiration time offset for this transaction in seconds. Default is 180 seconds.
     * Increasing number of seconds gives transaction more lifetime term.
     */
    public registerOwnerFioAddress(options: RegisterOwnerFioAddressOptions): Promise<RegisterFioAddressResponse>
    public registerOwnerFioAddress(): Promise<RegisterFioAddressResponse> {
        const args = resolveOptions<RegisterOwnerFioAddressOptions>({
            arguments,
            keys: ['fioAddress', 'ownerPublicKey', 'maxFee', 'technologyProviderId', 'expirationOffset'],
        })
        const registerFioAddress = new requests.RegisterFioAddressRequest(
            this.config,
            {
                ...args,
                technologyProviderId: this.getTechnologyProviderId(args.technologyProviderId),
            },
        )
        return registerFioAddress.execute(
            this.privateKey,
            this.publicKey,
            this.returnPreparedTrx,
            args.expirationOffset,
        )
    }

    /**
     * Registers a FIO Address and FIO domain on behalf of the owner FIO Public key parameter.
     * Owner FIO Public key owns the FIO address
     *
     * @param options.fioAddress FIO Address to register.
     * @param options.isPublic true - allows anyone to register FIO Address,
     * false - only owner of domain can register FIO Address.
     * @param options.ownerPublicKey Owner FIO Public Key.
     * @param options.maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by @ [getFee] for correct value.
     * @param options.technologyProviderId FIO Address of the wallet which generates this transaction.
     * @param options.expirationOffset Expiration time offset for this transaction in seconds.
     * Default is 180 seconds. Increasing number of seconds gives transaction more lifetime term.
     */
    public registerFioDomainAddress(options: RegisterFioDomainAddressOptions): Promise<RegisterFioAddressResponse> {
        const args = cleanupObject(options)
        const registerFioDomainAddress = new requests.RegisterFioDomainAddressRequest(
            this.config,
            {
                ...args,
                technologyProviderId: this.getTechnologyProviderId(args.technologyProviderId),
            },
        )
        return registerFioDomainAddress.execute(
            this.privateKey,
            this.publicKey,
            this.returnPreparedTrx,
            args.expirationOffset,
        )
    }

    /**
     * @deprecated
     * Registers a FIO Domain on the FIO blockchain.
     *
     * @param fioDomain FIO Domain to register. The owner will be the public key associated with the FIO SDK instance.
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by @ [getFee] for correct value.
     * @param technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    public registerFioDomain(
        fioDomain: string,
        maxFee: number,
        technologyProviderId?: string | null,
    ): Promise<RegisterFioDomainResponse>
    /**
     * Registers a FIO Domain on the FIO blockchain.
     *
     * @param options.fioDomain FIO Domain to register. The owner will be the public key associated
     * with the FIO SDK instance.
     * @param options.maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by @ [getFee] for correct value.
     * @param options.technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    public registerFioDomain(options: RegisterFioDomainOptions): Promise<RegisterFioDomainResponse>
    public registerFioDomain(): Promise<RegisterFioDomainResponse> {
        const args = resolveOptions<RegisterFioDomainOptions>({
            arguments,
            keys: ['fioDomain', 'maxFee', 'technologyProviderId'],
        })
        const registerFioDomain = new requests.RegisterFioDomainRequest(
            this.config,
            {
                ...args,
                technologyProviderId: this.getTechnologyProviderId(args.technologyProviderId),
            },
        )
        return registerFioDomain.execute(this.privateKey, this.publicKey, this.returnPreparedTrx)
    }

    /**
     * @deprecated
     * Registers a FIO Domain on behalf of the owner FIO Public key parameter. Owner FIO Public key owns the FIO domain.
     *
     * @param fioDomain FIO Domain to register. The owner will be the public key associated with the FIO SDK instance.
     * @param ownerPublicKey Owner FIO Public Key.
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by @ [getFee] for correct value.
     * @param technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    public registerOwnerFioDomain(
        fioDomain: string,
        ownerPublicKey: string,
        maxFee: number,
        technologyProviderId?: string | null,
    ): Promise<RegisterFioDomainResponse>
    /**
     * Registers a FIO Domain on behalf of the owner FIO Public key parameter. Owner FIO Public key owns the FIO domain.
     *
     * @param options.fioDomain FIO Domain to register. The owner will be the public key associated
     * with the FIO SDK instance.
     * @param options.ownerPublicKey Owner FIO Public Key.
     * @param options.maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by @ [getFee] for correct value.
     * @param options.technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    public registerOwnerFioDomain(options: RegisterOwnerFioDomainOptions): Promise<RegisterFioDomainResponse>
    public registerOwnerFioDomain(): Promise<RegisterFioDomainResponse> {
        const args = resolveOptions<RegisterOwnerFioDomainOptions>({
            arguments,
            keys: ['fioDomain', 'ownerPublicKey', 'maxFee', 'technologyProviderId'],
        })
        const registerFioDomain = new requests.RegisterFioDomainRequest(this.config, {
                ...args,
                technologyProviderId: this.getTechnologyProviderId(args.technologyProviderId),
            },
        )
        return registerFioDomain.execute(this.privateKey, this.publicKey, this.returnPreparedTrx)
    }

    /**
     * @deprecated
     * Burns a FIO Address on the FIO blockchain.
     *
     * @param fioAddress FIO Address to burn. The owner will be the public key associated with the FIO SDK instance.
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by @ [getFee] for correct value.
     * @param technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    public burnFioAddress(
        fioAddress: string,
        maxFee: number,
        technologyProviderId?: string | null,
    ): Promise<BurnFioAddressResponse>
    /**
     * Burns a FIO Address on the FIO blockchain.
     *
     * @param options.fioAddress FIO Address to burn. The owner will be the public key associated
     * with the FIO SDK instance.
     * @param options.maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by @ [getFee] for correct value.
     * @param options.technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    public burnFioAddress(options: BurnFioAddressOptions): Promise<BurnFioAddressResponse>
    public burnFioAddress(): Promise<BurnFioAddressResponse> {
        const args = resolveOptions<BurnFioAddressOptions>({
            arguments,
            keys: ['fioAddress', 'maxFee', 'technologyProviderId'],
        })
        const burnFioAddress = new requests.BurnFioAddressRequest(
            this.config,
            {
                ...args,
                technologyProviderId: this.getTechnologyProviderId(args.technologyProviderId),
            },
        )
        return burnFioAddress.execute(this.privateKey, this.publicKey, this.returnPreparedTrx)
    }

    /**
     * @deprecated
     * Transfers a FIO Domain on the FIO blockchain.
     *
     * @param fioDomain FIO Domain to transfer. The owner will be the public key associated with the FIO SDK instance.
     * @param newOwnerKey FIO Public Key of the new owner.
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by @ [getFee] for correct value.
     * @param technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    public transferFioDomain(
        fioDomain: string,
        newOwnerKey: string,
        maxFee: number,
        technologyProviderId?: string | null,
    ): Promise<TransferFioDomainResponse>
    /**
     * Transfers a FIO Domain on the FIO blockchain.
     *
     * @param options.fioDomain FIO Domain to transfer. The owner will be the public key associated
     * with the FIO SDK instance.
     * @param options.newOwnerKey FIO Public Key of the new owner.
     * @param options.maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by @ [getFee] for correct value.
     * @param options.technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    public transferFioDomain(options: TransferFioDomainOptions): Promise<TransferFioDomainResponse>
    public transferFioDomain(): Promise<TransferFioDomainResponse> {
        const args = resolveOptions<TransferFioDomainOptions>({
            arguments,
            keys: ['fioDomain', 'newOwnerKey', 'maxFee', 'technologyProviderId'],
        })
        const transferFioDomain = new requests.TransferFioDomainRequest(
            this.config,
            {
                ...args,
                technologyProviderId: this.getTechnologyProviderId(args.technologyProviderId),
            },
        )
        return transferFioDomain.execute(this.privateKey, this.publicKey, this.returnPreparedTrx)
    }

    /**
     * @deprecated
     * Transfers a FIO Address on the FIO blockchain.
     *
     * @param fioAddress FIO Address to transfer. The owner will be the public key associated with the FIO SDK instance.
     * @param newOwnerKey FIO Public Key of the new owner.
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by @ [getFee] for correct value.
     * @param technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    public transferFioAddress(
        fioAddress: string,
        newOwnerKey: string,
        maxFee: number,
        technologyProviderId?: string | null,
    ): Promise<TransferFioAddressResponse>
    /**
     * Transfers a FIO Address on the FIO blockchain.
     *
     * @param options.fioAddress FIO Address to transfer. The owner will be the public key associated
     * with the FIO SDK instance.
     * @param options.newOwnerKey FIO Public Key of the new owner.
     * @param options.maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by @ [getFee] for correct value.
     * @param options.technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    public transferFioAddress(options: TransferFioAddressOptions): Promise<TransferFioAddressResponse>
    public transferFioAddress(): Promise<TransferFioAddressResponse> {
        const args = resolveOptions<TransferFioAddressOptions>({
            arguments,
            keys: ['fioAddress', 'newOwnerKey', 'maxFee', 'technologyProviderId'],
        })
        const transferFioAddress = new requests.TransferFioAddressRequest(
            this.config,
            {
                ...args,
                technologyProviderId: this.getTechnologyProviderId(args.technologyProviderId),
            },
        )
        return transferFioAddress.execute(this.privateKey, this.publicKey, this.returnPreparedTrx)
    }

    /**
     * @deprecated
     * Adds bundles of transactions to FIO Address.
     *
     * @param fioAddress FIO Address to transfer. The owner will be the public key associated with the FIO SDK instance.
     * @param bundleSets Number of sets of bundles to add to FIO Address.
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by @ [getFee] for correct value.
     * @param technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    public addBundledTransactions(
        fioAddress: string,
        bundleSets: number,
        maxFee: number,
        technologyProviderId?: string | null,
    ): Promise<AddBundledResponse>
    /**
     * Adds bundles of transactions to FIO Address.
     *
     * @param options.fioAddress FIO Address to transfer.
     * The owner will be the public key associated with the FIO SDK instance.
     * @param options.bundleSets Number of sets of bundles to add to FIO Address.
     * @param options.maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by @ [getFee] for correct value.
     * @param options.technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    public addBundledTransactions(options: AddBundledTransactionsOptions): Promise<AddBundledResponse>
    public addBundledTransactions(): Promise<AddBundledResponse> {
        const args = resolveOptions<AddBundledTransactionsOptions>({
            arguments,
            keys: ['fioAddress', 'bundleSets', 'maxFee', 'technologyProviderId'],
        })
        const addBundledTransactions = new requests.AddBundledRequest(
            this.config,
            {
                ...args,
                technologyProviderId: this.getTechnologyProviderId(args.technologyProviderId),
            },
        )
        return addBundledTransactions.execute(this.privateKey, this.publicKey, this.returnPreparedTrx)
    }

    /**
     * @deprecated
     * Renew a FIO Address on the FIO blockchain.
     *
     * @param fioAddress FIO Address to renew.
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by @ [getFee] for correct value.
     * @param technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    public renewFioAddress(
        fioAddress: string,
        maxFee: number,
        technologyProviderId?: string | null,
    ): Promise<RenewFioAddressResponse>
    /**
     * Renew a FIO Address on the FIO blockchain.
     *
     * @param options.fioAddress FIO Address to renew.
     * @param options.maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by @ [getFee] for correct value.
     * @param options.technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    public renewFioAddress(options: RenewFioAddressOptions): Promise<RenewFioAddressResponse>
    public renewFioAddress(): Promise<RenewFioAddressResponse> {
        const args = resolveOptions<RenewFioAddressOptions>({
            arguments,
            keys: ['fioAddress', 'maxFee', 'technologyProviderId'],
        })
        const renewFioAddress = new requests.RenewFioAddressRequest(
            this.config,
            {
                ...args,
                technologyProviderId: this.getTechnologyProviderId(args.technologyProviderId),
            },
        )
        return renewFioAddress.execute(this.privateKey, this.publicKey, this.returnPreparedTrx)
    }

    /**
     * @deprecated
     * Renew a FIO Domain on the FIO blockchain.
     *
     * @param fioDomain FIO Domain to renew.
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by @ [getFee] for correct value.
     * @param technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    public renewFioDomain(
        fioDomain: string,
        maxFee: number,
        technologyProviderId?: string | null,
    ): Promise<RenewFioDomainResponse>
    /**
     * Renew a FIO Domain on the FIO blockchain.
     *
     * @param options.fioDomain FIO Domain to renew.
     * @param options.maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by @ [getFee] for correct value.
     * @param options.technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    public renewFioDomain(options: RenewFioDomainOptions): Promise<RenewFioDomainResponse>
    public renewFioDomain(): Promise<RenewFioDomainResponse> {
        const args = resolveOptions<RenewFioDomainOptions>({
            arguments,
            keys: ['fioDomain', 'maxFee', 'technologyProviderId'],
        })
        const renewFioDomain = new requests.RenewFioDomainRequest(
            this.config,
            {
                ...args,
                technologyProviderId: this.getTechnologyProviderId(args.technologyProviderId),
            },
        )
        return renewFioDomain.execute(this.privateKey, this.publicKey, this.returnPreparedTrx)
    }

    /**
     * @deprecated
     * This call allows a public address of the specific blockchain type to be added to the FIO Address.
     *
     * @param fioAddress FIO Address which will be mapped to public address.
     * @param chainCode Blockchain code for blockchain hosting this token.
     * @param tokenCode Token code to be used with that public address.
     * @param publicAddress The public address to be added to the FIO Address for the specified token.
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by /get_fee for correct value.
     * @param technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    public addPublicAddress(
        fioAddress: string,
        chainCode: string,
        tokenCode: string,
        publicAddress: string,
        maxFee: number,
        technologyProviderId?: string | null,
    ): Promise<AddPublicAddressesResponse>
    /**
     * This call allows a public address of the specific blockchain type to be added to the FIO Address.
     *
     * @param options.fioAddress FIO Address which will be mapped to public address.
     * @param options.chainCode Blockchain code for blockchain hosting this token.
     * @param options.tokenCode Token code to be used with that public address.
     * @param options.publicAddress The public address to be added to the FIO Address for the specified token.
     * @param options.maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by /get_fee for correct value.
     * @param options.technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    public addPublicAddress(options: AddPublicAddressOptions): Promise<AddPublicAddressesResponse>
    public addPublicAddress(): Promise<AddPublicAddressesResponse> {
        const args = resolveOptions<AddPublicAddressOptions>({
            arguments,
            keys: ['fioAddress', 'chainCode', 'tokenCode', 'publicAddress', 'maxFee', 'technologyProviderId'],
        })
        const addPublicAddress = new requests.AddPublicAddressesRequest(
            this.config,
            {
                ...args,
                publicAddresses: [{
                    chain_code: args.chainCode,
                    public_address: args.publicAddress,
                    token_code: args.tokenCode,
                }],
                technologyProviderId: this.getTechnologyProviderId(args.technologyProviderId),
            },
        )
        return addPublicAddress.execute(this.privateKey, this.publicKey, this.returnPreparedTrx)
    }

    /**
     * @deprecated
     * This call cancels the specified fio funds request.
     *
     * @param fioRequestId The id of the request.
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by /get_fee for correct value.
     * @param technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    public cancelFundsRequest(
        fioRequestId: number,
        maxFee: number,
        technologyProviderId?: string | null,
    ): Promise<CancelFundsRequestResponse>
    /**
     * This call cancels the specified fio funds request.
     *
     * @param options.fioRequestId The id of the request.
     * @param options.maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by /get_fee for correct value.
     * @param options.technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    public cancelFundsRequest(options: CancelFundsRequestOptions): Promise<CancelFundsRequestResponse>
    public cancelFundsRequest(): Promise<CancelFundsRequestResponse> {
        const args = resolveOptions<CancelFundsRequestOptions>({
            arguments,
            keys: ['fioRequestId', 'maxFee', 'technologyProviderId'],
        })
        const cancelFundsRequest = new requests.CancelFundsRequestRequest(
            this.config,
            {
                ...args,
                technologyProviderId: this.getTechnologyProviderId(args.technologyProviderId),
            },
        )
        return cancelFundsRequest.execute(this.privateKey, this.publicKey, this.returnPreparedTrx)
    }

    /**
     * @deprecated
     * This call allows an any number of public addresses matching the blockchain code,
     * the token code and the public address to be removed from the FIO Address.
     *
     * @param fioAddress FIO Address which will be mapped to public address.
     * @param publicAddresses a list of publicAddresses, each containing chain_code, token_code, and public_address.
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by /get_fee for correct value.
     * @param technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    public removePublicAddresses(
        fioAddress: string,
        publicAddresses: PublicAddress[],
        maxFee: number,
        technologyProviderId?: string | null,
    ): Promise<RemovePublicAddressesResponse>
    /**
     * This call allows an any number of public addresses matching the blockchain code,
     * the token code and the public address to be removed from the FIO Address.
     *
     * @param options.fioAddress FIO Address which will be mapped to public address.
     * @param options.publicAddresses a list of publicAddresses,
     * each containing chain_code, token_code, and public_address.
     * @param options.maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by /get_fee for correct value.
     * @param options.technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    public removePublicAddresses(options: RemovePublicAddressesOptions): Promise<RemovePublicAddressesResponse>
    public removePublicAddresses(): Promise<RemovePublicAddressesResponse> {
        const args = resolveOptions<RemovePublicAddressesOptions>({
            arguments,
            keys: ['fioAddress', 'publicAddresses', 'maxFee', 'technologyProviderId'],
        })
        const removePublicAddresses = new requests.RemovePublicAddressesRequest(
            this.config,
            {
                ...args,
                technologyProviderId: this.getTechnologyProviderId(args.technologyProviderId),
            },
        )
        return removePublicAddresses.execute(this.privateKey, this.publicKey, this.returnPreparedTrx)
    }

    /**
     * @deprecated
     * This call allows a user to transfer locked tokens to the specified fio public key
     *
     * @param payeePublicKey this is the fio public key for the user to receive locked tokens.
     * @param canVote true if these locked tokens can be voted, false if these locked tokens are not to be voted.
     * @param periods this is an array of lock periods defining the duration and percent of each period,
     * must be in time order.
     * @param amount this is the amount in SUFs to be transferred.
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by /get_fee for correct value.
     * @param technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    public transferLockedTokens(
        payeePublicKey: string,
        canVote: boolean,
        periods: LockPeriod[],
        amount: number,
        maxFee: number,
        technologyProviderId?: string | null,
    ): Promise<TransferLockedTokensResponse>
    /**
     * This call allows a user to transfer locked tokens to the specified fio public key
     *
     * @param options.payeePublicKey this is the fio public key for the user to receive locked tokens.
     * @param options.canVote true if these locked tokens can be voted,
     * false if these locked tokens are not to be voted.
     * @param options.periods this is an array of lock periods defining the duration and percent of each period,
     * must be in time order.
     * @param options.amount this is the amount in SUFs to be transferred.
     * @param options.maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by /get_fee for correct value.
     * @param options.technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    public transferLockedTokens(options: TransferLockedTokensOptions): Promise<TransferLockedTokensResponse>
    public transferLockedTokens(): Promise<TransferLockedTokensResponse> {
        const args = resolveOptions<TransferLockedTokensOptions>({
            arguments,
            keys: ['payeePublicKey', 'canVote', 'periods', 'amount', 'maxFee', 'technologyProviderId'],
        })
        const transferLockedTokens = new requests.TransferLockedTokensRequest(
            this.config,
            {
                ...args,
                technologyProviderId: this.getTechnologyProviderId(args.technologyProviderId),
            },
        )
        return transferLockedTokens.execute(this.privateKey, this.publicKey)
    }

    /**
     * @deprecated
     * This call allows a user to remove all addresses from the specified FIO Address,
     * all addresses except the FIO address will be removed.
     *
     * @param fioAddress FIO Address which will be mapped to public address.
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by /get_fee for correct value.
     * @param technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    public removeAllPublicAddresses(
        fioAddress: string,
        maxFee: number,
        technologyProviderId?: string | null,
    ): Promise<RemoveAllPublicAddressesResponse>
    /**
     * This call allows a user to remove all addresses from the specified FIO Address,
     * all addresses except the FIO address will be removed.
     *
     * @param options.fioAddress FIO Address which will be mapped to public address.
     * @param options.maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by /get_fee for correct value.
     * @param options.technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    public removeAllPublicAddresses(options: RemoveAllPublicAddressesOptions): Promise<RemoveAllPublicAddressesResponse>
    public removeAllPublicAddresses(): Promise<RemoveAllPublicAddressesResponse> {
        const args = resolveOptions<RemoveAllPublicAddressesOptions>({
            arguments,
            keys: ['fioAddress', 'maxFee', 'technologyProviderId'],
        })
        const removeAllPublicAddresses = new requests.RemoveAllPublicAddressesRequest(
            this.config,
            {
                ...args,
                technologyProviderId: this.getTechnologyProviderId(args.technologyProviderId),
            },
        )
        return removeAllPublicAddresses.execute(this.privateKey, this.publicKey, this.returnPreparedTrx)
    }

    /**
     * @deprecated
     * This call allows a public addresses of the specific blockchain type to be added to the FIO Address.
     *
     * @param fioAddress FIO Address which will be mapped to public addresses.
     * @param publicAddresses Array of public addresses to be added to the FIO Address for the specified token.
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by /get_fee for correct value.
     * @param technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    public addPublicAddresses(
        fioAddress: string,
        publicAddresses: PublicAddress[],
        maxFee: number,
        technologyProviderId?: string | null,
    ): Promise<AddPublicAddressesResponse>
    /**
     * This call allows a public addresses of the specific blockchain type to be added to the FIO Address.
     *
     * @param options.fioAddress FIO Address which will be mapped to public addresses.
     * @param options.publicAddresses Array of public addresses to be added to the FIO Address for the specified token.
     * @param options.maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by /get_fee for correct value.
     * @param options.technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    public addPublicAddresses(options: AddPublicAddressesOptions): Promise<AddPublicAddressesResponse>
    public addPublicAddresses(): Promise<AddPublicAddressesResponse> {
        const args = resolveOptions<AddPublicAddressesOptions>({
            arguments,
            keys: ['fioAddress', 'publicAddresses', 'maxFee', 'technologyProviderId'],
        })
        const addPublicAddress = new requests.AddPublicAddressesRequest(
            this.config,
            {
                ...args,
                technologyProviderId: this.getTechnologyProviderId(args.technologyProviderId),
            },
        )
        return addPublicAddress.execute(this.privateKey, this.publicKey, this.returnPreparedTrx)
    }

    /**
     * @deprecated
     * By default, all FIO Domains are non-public, meaning only the owner can register FIO Addresses on that domain.
     * Setting them to public allows anyone to register a FIO Address on that domain.
     *
     * @param fioDomain FIO Domain to change visibility.
     * @param isPublic
     * true - allows anyone to register FIO Address,
     * false - only owner of domain can register FIO Address.
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by /get_fee for correct value.
     * @param technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    public setFioDomainVisibility(
        fioDomain: string,
        isPublic: boolean,
        maxFee: number,
        technologyProviderId?: string | null,
    ): Promise<SetFioDomainVisibilityResponse>
    /**
     * By default, all FIO Domains are non-public, meaning only the owner can register FIO Addresses on that domain.
     * Setting them to public allows anyone to register a FIO Address on that domain.
     *
     * @param options.fioDomain FIO Domain to change visibility.
     * @param options.isPublic
     * true - allows anyone to register FIO Address,
     * false - only owner of domain can register FIO Address.
     * @param options.maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by /get_fee for correct value.
     * @param options.technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    public setFioDomainVisibility(options: SetFioDomainVisibilityOptions): Promise<SetFioDomainVisibilityResponse>
    public setFioDomainVisibility(): Promise<SetFioDomainVisibilityResponse> {
        const args = resolveOptions<SetFioDomainVisibilityOptions>({
            arguments,
            keys: ['fioDomain', 'isPublic', 'maxFee', 'technologyProviderId'],
        })
        const SetFioDomainVisibility = new requests.SetFioDomainVisibilityRequest(
            this.config,
            {
                ...args,
                technologyProviderId: this.getTechnologyProviderId(args.technologyProviderId),
            },
        )
        return SetFioDomainVisibility.execute(this.privateKey, this.publicKey, this.returnPreparedTrx)
    }

    /**
     * Records information on the FIO blockchain about a transaction that occurred on other blockchain,
     * i.e. 1 BTC was sent on Bitcoin Blockchain, and both
     * sender and receiver have FIO Addresses. OBT stands for Other Blockchain Transaction
     *
     * @param options.fioRequestId ID of funds request, if this Record Send transaction
     * is in response to a previously received funds request. Send empty if no FIO Request ID
     * @param options.payerFioAddress FIO Address of the payer. This address initiated payment.
     * @param options.payeeFioAddress FIO Address of the payee. This address is receiving payment.
     * @param options.payerTokenPublicAddress Public address on other blockchain of user sending funds.
     * @param options.payeeTokenPublicAddress Public address on other blockchain of user receiving funds.
     * @param options.amount Amount sent.
     * @param options.chainCode Blockchain code for blockchain hosting this token.
     * @param options.tokenCode Code of the token represented in Amount requested, i.e. BTC.
     * @param options.status Status of this OBT. Allowed statuses are: sent_to_blockchain.
     * @param options.obtId Other Blockchain Transaction ID (OBT ID), i.e. Bitcoin transaction ID.
     * @param options.maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by /get_fee for correct value.
     * @param options.technologyProviderId FIO Address of the wallet which generates this transaction.
     * @param options.payeeFioPublicKey Public address on other blockchain of user receiving funds.
     * @param options.memo
     * @param options.hash
     * @param options.offlineUrl
     * @param options.encryptPrivateKey Encrypt Private Key for encrypt content. If missing uses this.privateKey.
     */
    public async recordObtData(options: RecordObtDataOptions): Promise<RecordObtDataResponse> {
        const args = cleanupObject(options)
        const payeeEncryptKey = await this.getEncryptKey({
            fioAddress: args.payeeFioAddress,
        })
        const recordObtData = new requests.RecordObtDataRequest(
            this.config,
            {
                ...args,
                payeeFioPublicKey: payeeEncryptKey?.encrypt_public_key || args.payeeFioPublicKey,
                technologyProviderId: this.getTechnologyProviderId(args.technologyProviderId),
            },
        )

        return recordObtData.execute(this.privateKey, this.publicKey, this.returnPreparedTrx)
    }

    /**
     * Retrieves OBT metadata data stored using record send.
     *
     * @param options.limit Number of request to return. If omitted, all requests will be returned.
     * @param options.offset First request from list to return. If omitted, 0 is assumed.
     * @param options.tokenCode Code of the token to filter results
     * @param options.includeEncrypted Set to true if you want to include not encrypted data in return.
     */
    public getObtData(options: GetObtDataOptions): Promise<GetObtDataResponse> {
        const args = cleanupObject(options)
        const getObtDataRequest = new queries.ObtDataQuery(this.config, {
            ...args,
            fioPublicKey: this.publicKey,
            getEncryptKey: this.getEncryptKey,
        })
        return getObtDataRequest.execute(this.publicKey, this.privateKey)
    }

    /**
     * @deprecated
     * Gets FIO permissions for the specified grantee account.
     *
     * @param limit Number of request to return. If omitted, all requests will be returned.
     * @param offset First request from list to return. If omitted, 0 is assumed.
     * @param granteeAccount string account name of the grantee account
     */
    public getGranteePermissions(
        granteeAccount: string,
        limit?: number,
        offset?: number,
    ): Promise<PermissionsResponse>
    /**
     * Gets FIO permissions for the specified grantee account.
     *
     * @param options.limit Number of request to return. If omitted, all requests will be returned.
     * @param options.offset First request from list to return. If omitted, 0 is assumed.
     * @param options.granteeAccount string account name of the grantee account
     */
    public getGranteePermissions(options: GetGranteePermissionsOptions): Promise<PermissionsResponse>
    public getGranteePermissions(): Promise<PermissionsResponse> {
        const args = resolveOptions<GetGranteePermissionsOptions>({
            arguments,
            keys: ['granteeAccount', 'limit', 'offset'],
        })
        const getGranteePermissions = new queries.GranteePermissionsQuery(this.config, args)
        return getGranteePermissions.execute(this.publicKey, this.privateKey)
    }

    /**
     * @deprecated
     * Gets FIO permissions for the specified grantor account.
     *
     * @param limit Number of request to return. If omitted, all requests will be returned.
     * @param offset First request from list to return. If omitted, 0 is assumed.
     * @param grantorAccount string account name of the grantor account
     */
    public getGrantorPermissions(
        grantorAccount: string,
        limit?: number | null,
        offset?: number | null,
    ): Promise<PermissionsResponse>
    /**
     * Gets FIO permissions for the specified grantor account.
     *
     * @param options.limit Number of request to return. If omitted, all requests will be returned.
     * @param options.offset First request from list to return. If omitted, 0 is assumed.
     * @param options.grantorAccount string account name of the grantor account
     */
    public getGrantorPermissions(options: GetGrantorPermissionsOptions): Promise<PermissionsResponse>
    public getGrantorPermissions(): Promise<PermissionsResponse> {
        const args = resolveOptions<GetGrantorPermissionsOptions>({
            arguments,
            keys: ['grantorAccount', 'limit', 'offset'],
        })
        const getGrantorPermissions = new queries.GrantorPermissionsQuery(this.config, args)
        return getGrantorPermissions.execute(this.publicKey, this.privateKey)
    }

    /**
     * @deprecated
     * Gets FIO permissions for the specified permission name and object name account.
     *
     * @param permissionName string permission name ex register_address_on_domain
     * @param objectName
     * @param limit Number of request to return. If omitted, all requests will be returned.
     * @param offset First request from list to return. If omitted, 0 is assumed.
     */
    public getObjectPermissions(
        permissionName: string,
        objectName: string,
        limit?: number | null,
        offset?: number | null,
    ): Promise<PermissionsResponse>
    /**
     * Gets FIO permissions for the specified permission name and object name account.
     *
     * @param options.permissionName string permission name ex register_address_on_domain
     * @param options.objectName
     * @param options.limit Number of request to return. If omitted, all requests will be returned.
     * @param options.offset First request from list to return. If omitted, 0 is assumed.
     */
    public getObjectPermissions(options: GetObjectPermissionsOptions): Promise<PermissionsResponse>
    public getObjectPermissions(): Promise<PermissionsResponse> {
        const args = resolveOptions<GetObjectPermissionsOptions>({
            arguments,
            keys: ['permissionName', 'objectName', 'limit', 'offset'],
        })
        const getObjectPermissions = new queries.ObjectPermissionsQuery(this.config, args)
        return getObjectPermissions.execute(this.publicKey, this.privateKey)
    }

    /**
     * @deprecated
     * Reject funds request.
     *
     * @param fioRequestId Existing funds requestId
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by [getFee] for correct value.
     * @param technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    public rejectFundsRequest(
        fioRequestId: number,
        maxFee: number,
        technologyProviderId?: string | null,
    ): Promise<RejectFundsRequestResponse>
    /**
     * Reject funds request.
     *
     * @param options.fioRequestId Existing funds requestId
     * @param options.maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by [getFee] for correct value.
     * @param options.technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    public rejectFundsRequest(options: RejectFundsRequestOptions): Promise<RejectFundsRequestResponse>
    public rejectFundsRequest(): Promise<RejectFundsRequestResponse> {
        const args = resolveOptions<RejectFundsRequestOptions>({
            arguments,
            keys: ['fioRequestId', 'maxFee', 'technologyProviderId'],
        })
        const rejectFundsRequest = new requests.RejectFundsRequestRequest(
            this.config,
            {
                ...args,
                technologyProviderId: this.getTechnologyProviderId(args.technologyProviderId),
            },
        )
        return rejectFundsRequest.execute(this.privateKey, this.publicKey, this.returnPreparedTrx)
    }

    /**
     * Create a new funds request on the FIO chain.
     *
     * @param options.amount Amount requested.
     * @param options.chainCode Blockchain code for blockchain hosting this token.
     * @param options.encryptPrivateKey Encrypt Private Key for encrypt content. If missing uses this.privateKey.
     * @param options.hash
     * @param options.maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by [getFee] for correct value.
     * @param options.memo
     * @param options.offlineUrl
     * @param options.payeeFioAddress FIO Address of the payee.
     * This address is sending the request and will receive payment.
     * @param options.payeeTokenPublicAddress Payee's public address where they want funds sent.
     * @param options.payerFioAddress FIO Address of the payer.
     * This address will receive the request and will initiate payment.
     * @param options.payerFioPublicKey Public address on other blockchain of user sending funds.
     * @param options.technologyProviderId FIO Address of the wallet which generates this transaction.
     * @param options.tokenCode Code of the token represented in amount requested.
     */
    public async requestFunds(options: RequestFundsOptions): Promise<FundsRequestResponse> {
        const args = cleanupObject(options)
        const payerEncryptKey = await this.getEncryptKey({
            fioAddress: args.payerFioAddress,
        })
        const requestNewFunds = new requests.FundsRequestRequest(
            this.config,
            {
                ...args,
                payerFioPublicKey: payerEncryptKey?.encrypt_public_key || args.payerFioPublicKey,
                technologyProviderId: this.getTechnologyProviderId(args.technologyProviderId),
            },
        )
        return requestNewFunds.execute(this.privateKey, this.publicKey, this.returnPreparedTrx)
    }

    /**
     * @deprecated
     * Retrieves info on locks for this pub key
     *
     * @param fioPublicKey FIO public key.
     */
    public getLocks(fioPublicKey: string): Promise<LocksResponse>
    /**
     * Retrieves info on locks for this pub key
     *
     * @param options.fioPublicKey FIO public key.
     */
    public getLocks(options: GetLocksOptions): Promise<LocksResponse>
    public getLocks(): Promise<LocksResponse> {
        const args = resolveOptions<GetLocksOptions>({keys: ['fioPublicKey'], arguments})
        const getLocks = new queries.LocksQuery(this.config, args)
        return getLocks.execute(this.publicKey)
    }

    /**
     * @deprecated
     * Retrieves info on account for this actor
     *
     * @param actor FIO account.
     */
    public getAccount(actor: string): Promise<AccountResponse>
    /**
     * Retrieves info on account for this actor
     *
     * @param options.actor FIO account.
     */
    public getAccount(options: GetAccountOptions): Promise<AccountResponse>
    public getAccount(): Promise<AccountResponse> {
        const args = resolveOptions<GetAccountOptions>({keys: ['actor'], arguments})
        const getAccount = new queries.AccountQuery(this.config, args)
        return getAccount.execute(this.publicKey)
    }

    /**
     * @deprecated
     * Checks if a FIO Address or FIO Domain is available for registration.
     *
     * @param fioName FIO Address or FIO Domain to check.
     */
    public isAvailable(fioName: string): Promise<AvailabilityCheckResponse>
    /**
     * Checks if a FIO Address or FIO Domain is available for registration.
     *
     * @param options.fioName FIO Address or FIO Domain to check.
     */
    public isAvailable(options: IsAvailableOptions): Promise<AvailabilityCheckResponse>
    public isAvailable(): Promise<AvailabilityCheckResponse> {
        const args = resolveOptions<IsAvailableOptions>({keys: ['fioName'], arguments})
        const availabilityCheck = new queries.AvailabilityCheckQuery(this.config, args)
        return availabilityCheck.execute(this.publicKey)
    }

    /**
     * @deprecated
     * Retrieves balance of FIO tokens
     *
     * @param fioPublicKey FIO public key.
     */
    public getFioBalance(fioPublicKey?: string | null): Promise<FioBalanceResponse>
    /**
     * Retrieves balance of FIO tokens
     *
     * @param options.fioPublicKey FIO public key.
     */
    public getFioBalance(options: GetFioBalanceOptions): Promise<FioBalanceResponse>
    public getFioBalance(): Promise<FioBalanceResponse> {
        const args = resolveOptions<GetFioBalanceOptions>({keys: ['fioPublicKey'], arguments})
        const getFioBalance = new queries.FioBalanceQuery(this.config, args)
        return getFioBalance.execute(this.publicKey)
    }

    /**
     * @deprecated
     * Returns FIO Addresses and FIO Domains owned by this public key.
     *
     * @param fioPublicKey FIO public key of owner.
     */
    public getFioNames(fioPublicKey: string): Promise<FioNamesResponse>
    /**
     * Returns FIO Addresses and FIO Domains owned by this public key.
     *
     * @param options.fioPublicKey FIO public key of owner.
     */
    public getFioNames(options: GetFioNamesOptions): Promise<FioNamesResponse>
    public getFioNames(): Promise<FioNamesResponse> {
        const args = resolveOptions<GetFioNamesOptions>({keys: ['fioPublicKey'], arguments})
        const getNames = new queries.FioNamesQuery(this.config, args)
        return getNames.execute(this.publicKey)
    }

    /**
     * @deprecated
     * Returns FIO Addresses  owned by this public key.
     *
     * @param fioPublicKey FIO public key of owner.
     * @param limit Number of request to return. If omitted, all requests will be returned.
     * @param offset First request from list to return. If omitted, 0 is assumed.
     */
    public getFioAddresses(
        fioPublicKey: string,
        limit?: number | null,
        offset?: number | null,
    ): Promise<FioAddressesResponse>
    /**
     * Returns FIO Addresses  owned by this public key.
     *
     * @param options.fioPublicKey FIO public key of owner.
     * @param options.limit Number of request to return. If omitted, all requests will be returned.
     * @param options.offset First request from list to return. If omitted, 0 is assumed.
     */
    public getFioAddresses(options: GetFioAddressesOptions): Promise<FioAddressesResponse>
    public getFioAddresses(): Promise<FioAddressesResponse> {
        const args = resolveOptions<GetFioAddressesOptions>({keys: ['fioPublicKey', 'limit', 'offset'], arguments})
        const getNames = new queries.FioAddressesQuery(this.config, args)
        return getNames.execute(this.publicKey)
    }

    /**
     * @deprecated
     * Returns FIO domains  owned by this public key.
     *
     * @param fioPublicKey FIO public key of owner.
     * @param limit Number of request to return. If omitted, all requests will be returned.
     * @param offset First request from list to return. If omitted, 0 is assumed.
     */
    public getFioDomains(
        fioPublicKey: string,
        limit?: number | null,
        offset?: number | null,
    ): Promise<FioDomainsResponse>
    /**
     * Returns FIO domains  owned by this public key.
     *
     * @param options.fioPublicKey FIO public key of owner.
     * @param options.limit Number of request to return. If omitted, all requests will be returned.
     * @param options.offset First request from list to return. If omitted, 0 is assumed.
     */
    public getFioDomains(options: GetFioDomainsOptions): Promise<FioDomainsResponse>
    public getFioDomains(): Promise<FioDomainsResponse> {
        const args = resolveOptions<GetFioDomainsOptions>({keys: ['fioPublicKey', 'limit', 'offset'], arguments})
        const getNames = new queries.FioDomainsQuery(this.config, args)
        return getNames.execute(this.publicKey)
    }

    /**
     * Polls for any pending requests sent to public key associated with the FIO SDK instance.
     *
     * @param options.limit Number of request to return. If omitted, all requests will be returned.
     * @param options.offset First request from list to return. If omitted, 0 is assumed.
     * @param options.encryptKeys // TODO add more docs
     */
    public getPendingFioRequests(
        options: GetPendingFioRequestsOptions,
    ): Promise<PendingFioRequestsResponse | undefined> {
        const args = cleanupObject(options)
        const pendingFioRequests = new queries.PendingFioRequestsQuery(this.config, {
            ...args,
            fioPublicKey: this.publicKey,
            getEncryptKey: this.getEncryptKey.bind(this),
        })
        return pendingFioRequests.execute(this.publicKey, this.privateKey)
    }

    /**
     * Polls for any received requests sent to public key associated with the FIO SDK instance.
     *
     * @param options.limit Number of request to return. If omitted, all requests will be returned.
     * @param options.offset First request from list to return. If omitted, 0 is assumed.
     * @param options.includeEncrypted Set to true if you want to include not encrypted data in return.
     * @param options.encryptKeys // TODO add more docs
     */
    public getReceivedFioRequests(
        options: GetReceivedFioRequestsOptions,
    ): Promise<ReceivedFioRequestsResponse | undefined> {
        const args = cleanupObject(options)
        const receivedFioRequests = new queries.ReceivedFioRequestsQuery(this.config, {
            ...args,
            fioPublicKey: this.publicKey,
            getEncryptKey: this.getEncryptKey.bind(this),
        })
        return receivedFioRequests.execute(this.publicKey, this.privateKey)
    }

    /**
     * Polls for any sent requests sent by public key associated with the FIO SDK instance.
     *
     * @param options.limit Number of request to return. If omitted, all requests will be returned.
     * @param options.offset First request from list to return. If omitted, 0 is assumed.
     * @param options.includeEncrypted Set to true if you want to include not encrypted data in return.
     * @param options.encryptKeys // TODO add more docs
     */
    public getSentFioRequests(options: GetSentFioRequestsOptions): Promise<SentFioRequestsResponse | undefined> {
        const args = cleanupObject(options)
        const sentFioRequest = new queries.SentFioRequestsQuery(this.config, {
            ...args,
            fioPublicKey: this.publicKey,
            getEncryptKey: this.getEncryptKey.bind(this),
        })
        return sentFioRequest.execute(this.publicKey, this.privateKey)
    }

    /**
     * Polls for any cancelled requests sent by public key associated with the FIO SDK instance.
     *
     * @param options.limit Number of request to return. If omitted, all requests will be returned.
     * @param options.offset First request from list to return. If omitted, 0 is assumed.
     * @param options.encryptKeys // TODO add more docs
     */
    public getCancelledFioRequests(
        options: GetCancelledFioRequestsOptions,
    ): Promise<CancelledFioRequestsResponse | undefined> {
        const args = cleanupObject(options)
        const cancelledFioRequest = new queries.CancelledFioRequestsQuery(this.config, {
            ...args,
            fioPublicKey: this.publicKey, getEncryptKey: this.getEncryptKey.bind(this),
        })
        return cancelledFioRequest.execute(this.publicKey, this.privateKey)
    }

    /**
     * @deprecated
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
    ): Promise<PublicAddressResponse>
    /**
     * Returns a token public address for specified token code and FIO Address.
     *
     * @param options.fioAddress FIO Address for which the token public address is to be returned.
     * @param options.chainCode Blockchain code for which public address is to be returned.
     * @param options.tokenCode Token code for which public address is to be returned.
     */
    public getPublicAddress(options: GetPublicAddressOptions): Promise<PublicAddressResponse>
    public getPublicAddress(): Promise<PublicAddressResponse> {
        const args = resolveOptions<GetPublicAddressOptions>({
            arguments,
            keys: ['fioAddress', 'chainCode', 'tokenCode'],
        })
        const publicAddressLookUp = new queries.PublicAddressQuery(this.config, args)
        return publicAddressLookUp.execute(this.publicKey)
    }

    /**
     * @deprecated
     * Returns all public addresses for specified FIO Address.
     *
     * @param fioAddress FIO Address for which the token public address is to be returned.
     * @param limit Number of results to return. If omitted, all results will be returned.
     * @param offset First result from list to return. If omitted, 0 is assumed.
     */
    public getPublicAddresses(
        fioAddress: string,
        limit?: number | null,
        offset?: number | null,
    ): Promise<PublicAddressesResponse>
    /**
     * Returns all public addresses for specified FIO Address.
     *
     * @param options.fioAddress FIO Address for which the token public address is to be returned.
     * @param options.limit Number of results to return. If omitted, all results will be returned.
     * @param options.offset First result from list to return. If omitted, 0 is assumed.
     */
    public getPublicAddresses(options: GetPublicAddressesOptions): Promise<PublicAddressesResponse>
    public getPublicAddresses(): Promise<PublicAddressesResponse> {
        const args = resolveOptions<GetPublicAddressesOptions>({keys: ['fioAddress', 'limit', 'offset'], arguments})
        const publicAddressesLookUp = new queries.PublicAddressesQuery(this.config, args)
        return publicAddressesLookUp.execute(this.publicKey)
    }

    /**
     * @deprecated
     * Returns the FIO token public address for specified FIO Address.
     *
     * @param fioAddress FIO Address for which fio token public address is to be returned.
     */
    public getFioPublicAddress(fioAddress: string): Promise<PublicAddressResponse>
    /**
     * Returns the FIO token public address for specified FIO Address.
     *
     * @param options.fioAddress FIO Address for which fio token public address is to be returned.
     */
    public getFioPublicAddress(options: GetFioPublicAddressOptions): Promise<PublicAddressResponse>
    public getFioPublicAddress(): Promise<PublicAddressResponse> {
        const {fioAddress} = resolveOptions<GetFioPublicAddressOptions>({keys: ['fioAddress'], arguments})
        return this.getPublicAddress({fioAddress, chainCode: 'FIO', tokenCode: 'FIO'})
    }

    /**
     * @deprecated
     * Returns all mapped NFTs which have the specified contract address and token id or FIO Address or hash.
     *
     * @param options Detects the way how to get the data.
     * @param options.fioAddress FIO Address.
     * @param options.chainCode Chain code where NFT contract resides.
     * @param options.contractAddress NFT contract address.
     * @param options.tokenId NFT token ID.
     * @param options.hash SHA-256 hash of NFT asset, e.g. media url.
     * @param limit Number of records to return. If omitted, all records will be returned.
     * Due to table read timeout, a value of less than 1,000 is recommended.
     * @param offset First record from list to return. If omitted, 0 is assumed.
     */
    public getNfts(
        options: {
            fioAddress?: string | null
            chainCode?: string | null
            contractAddress?: string | null
            tokenId?: string | null
            hash?: string | null,
        },
        limit?: number | null,
        offset?: number | null,
    ): Promise<NftsResponse>
    /**
     * Returns all mapped NFTs which have the specified contract address and token id or FIO Address or hash.
     *
     * @param options Detects the way how to get the data.
     * @param options.fioAddress FIO Address.
     * @param options.chainCode Chain code where NFT contract resides.
     * @param options.contractAddress NFT contract address.
     * @param options.tokenId NFT token ID.
     * @param options.hash SHA-256 hash of NFT asset, e.g. media url.
     * @param options.limit Number of records to return. If omitted, all records will be returned.
     * Due to table read timeout, a value of less than 1,000 is recommended.
     * @param options.offset First record from list to return. If omitted, 0 is assumed.
     */
    public getNfts(options: GetNftsOptions): Promise<NftsResponse>
    public getNfts(): Promise<NftsResponse> {
        const {
            fioAddress,
            chainCode,
            contractAddress,
            tokenId,
            hash,
            limit,
            offset,
        } = resolveOptions<GetNftsOptions>({
            arguments,
            keys: ['$base', 'limit', 'offset'],
        })

        let nftsLookUp

        if (fioAddress !== undefined && fioAddress !== '') {
            nftsLookUp = new queries.NftsByFioAddressQuery(this.config, {
                fioAddress,
                limit,
                offset,
            })
        }

        if (chainCode !== undefined && chainCode !== '' && contractAddress !== undefined && contractAddress !== '') {
            nftsLookUp = new queries.NftsByContractQuery(this.config, {
                chainCode,
                contractAddress,
                limit,
                offset,
                tokenId,
            })
        }

        if (hash !== undefined && hash !== '') {
            nftsLookUp = new queries.NftsByHashQuery(this.config, {
                hash,
                limit,
                offset,
            })
        }

        if (nftsLookUp == null) {
            throw new Error('At least one of these options should be set: fioAddress, chainCode/contractAddress, hash')
        }

        return nftsLookUp.execute(this.publicKey)
    }

    /**
     * @deprecated
     * Transfers FIO tokens from public key associated with the FIO SDK instance to
     * the payeePublicKey.
     *
     * @param payeeFioPublicKey FIO public Address of the one receiving the tokens.
     * @param amount Amount sent in SUFs.
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by /get_fee for correct value.
     * @param technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    public transferTokens(
        payeeFioPublicKey: string,
        amount: number,
        maxFee: number,
        technologyProviderId?: string | null,
    ): Promise<TransferTokensResponse>
    /**
     * Transfers FIO tokens from public key associated with the FIO SDK instance to
     * the payeePublicKey.
     *
     * @param options.payeeFioPublicKey FIO public Address of the one receiving the tokens.
     * @param options.amount Amount sent in SUFs.
     * @param options.maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by /get_fee for correct value.
     * @param options.technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    public transferTokens(options: TransferTokensOptions): Promise<TransferTokensResponse>
    public transferTokens(): Promise<TransferTokensResponse> {
        const args = resolveOptions<TransferTokensOptions>({
            arguments,
            keys: ['payeeFioPublicKey', 'amount', 'maxFee', 'technologyProviderId'],
        })
        const transferTokens = new requests.TransferTokensRequest(
            this.config,
            {
                ...args,
                technologyProviderId: this.getTechnologyProviderId(args.technologyProviderId),
            },
        )
        return transferTokens.execute(this.privateKey, this.publicKey, this.returnPreparedTrx)
    }

    /**
     * @deprecated
     * Compute and return fee amount for specific call and specific user
     *
     * @param fioAddress FIO Address incurring the fee and owned by signer.
     */
    public getFeeForTransferLockedTokens(fioAddress: string): Promise<FioFeeResponse>
    /**
     * Compute and return fee amount for specific call and specific user
     *
     * @param options.fioAddress FIO Address incurring the fee and owned by signer.
     */
    public getFeeForTransferLockedTokens(options: GetFeeForTransferLockedTokensOptions): Promise<FioFeeResponse>
    public getFeeForTransferLockedTokens(): Promise<FioFeeResponse> {
        const {fioAddress} = resolveOptions<GetFeeForTransferLockedTokensOptions>({keys: ['fioAddress'], arguments})
        return this.getFee({fioAddress, endPoint: EndPoint.transferLockedTokens})
    }

    // TODO Add more documentation
    /**
     * @deprecated
     * Return oracle fees amount
     */
    public getOracleFees(publicKey?: string | null): Promise<FioOracleFeesResponse>
    // TODO Add new js doc
    public getOracleFees(options: GetOracleFeesOptions): Promise<FioOracleFeesResponse>
    public getOracleFees(): Promise<FioOracleFeesResponse> {
        const {publicKey} = resolveOptions<GetOracleFeesOptions>({keys: ['publicKey'], arguments})
        const fioFee = new queries.OracleFeesQuery(this.config)
        return fioFee.execute(publicKey || this.publicKey)
    }

    /**
     * @deprecated
     * Compute and return fee amount for specific call and specific user
     *
     * @param endPoint Name of API call end point, e.g. add_pub_address.
     * @param fioAddress
     * if endPointName is RenewFioAddress, FIO Address incurring the fee and owned by signer.
     * if endPointName is RenewFioDomain, FIO Domain incurring the fee and owned by signer.
     * if endPointName is RecordObtData, Payer FIO Address incurring the fee and owned by signer.
     *
     * Omit for:
     * - register_fio_domain
     * - register_fio_address
     * - transfer_tokens_pub_key
     */
    public getFee(endPoint: EndPoint, fioAddress?: string | null): Promise<FioFeeResponse>
    /**
     * Compute and return fee amount for specific call and specific user
     *
     * @param options.endPoint Name of API call end point, e.g. add_pub_address.
     * @param options.fioAddress
     * if endPointName is RenewFioAddress, FIO Address incurring the fee and owned by signer.
     * if endPointName is RenewFioDomain, FIO Domain incurring the fee and owned by signer.
     * if endPointName is RecordObtData, Payer FIO Address incurring the fee and owned by signer.
     *
     * Omit for:
     * - register_fio_domain
     * - register_fio_address
     * - transfer_tokens_pub_key
     */
    public getFee(options: GetFeeOptions): Promise<FioFeeResponse>
    public getFee(): Promise<FioFeeResponse> {
        const args = resolveOptions<GetFeeOptions>({keys: ['endPoint', 'fioAddress'], arguments})
        const fioFee = new queries.FioFeeQuery(this.config, args)
        return fioFee.execute(this.publicKey)
    }

    /**
     * @deprecated
     * Compute and return fee amount for specific call and specific user
     *
     * @param payerFioAddress Payer FIO Address incurring the fee and owned by signer.
     */
    public getFeeForRecordObtData(payerFioAddress: string): Promise<FioFeeResponse>
    /**
     * Compute and return fee amount for specific call and specific user
     *
     * @param options.payerFioAddress Payer FIO Address incurring the fee and owned by signer.
     */
    public getFeeForRecordObtData(options: GetFeeForRecordObtDataOptions): Promise<FioFeeResponse>
    public getFeeForRecordObtData(): Promise<FioFeeResponse> {
        const args = resolveOptions<GetFeeForRecordObtDataOptions>({keys: ['payerFioAddress'], arguments})
        return this.getFee({fioAddress: args.payerFioAddress, endPoint: EndPoint.recordObtData})
    }

    /**
     * @deprecated
     * Compute and return fee amount for specific call and specific user
     *
     * @param payeeFioAddress Payee FIO Address incurring the fee and owned by signer.
     */
    public getFeeForNewFundsRequest(payeeFioAddress: string): Promise<FioFeeResponse>
    /**
     * Compute and return fee amount for specific call and specific user
     *
     * @param options.payeeFioAddress Payee FIO Address incurring the fee and owned by signer.
     */
    public getFeeForNewFundsRequest(options: GetFeeForNewFundsRequestOptions): Promise<FioFeeResponse>
    public getFeeForNewFundsRequest(): Promise<FioFeeResponse> {
        const args = resolveOptions<GetFeeForNewFundsRequestOptions>({keys: ['payeeFioAddress'], arguments})
        return this.getFee({fioAddress: args.payeeFioAddress, endPoint: EndPoint.newFundsRequest})
    }

    /**
     * @deprecated
     * Compute and return fee amount for specific call and specific user
     *
     * @param payerFioAddress Payer FIO Address incurring the fee and owned by signer.
     */
    public getFeeForRejectFundsRequest(payerFioAddress: string): Promise<FioFeeResponse>
    /**
     * Compute and return fee amount for specific call and specific user
     *
     * @param options.payerFioAddress Payer FIO Address incurring the fee and owned by signer.
     */
    public getFeeForRejectFundsRequest(options: GetFeeForRejectFundsRequestOptions): Promise<FioFeeResponse>
    public getFeeForRejectFundsRequest(): Promise<FioFeeResponse> {
        const args = resolveOptions<GetFeeForRejectFundsRequestOptions>({keys: ['payerFioAddress'], arguments})
        return this.getFee({fioAddress: args.payerFioAddress, endPoint: EndPoint.rejectFundsRequest})
    }

    /**
     * @deprecated
     * Compute and return fee amount for specific call and specific user
     *
     * @param fioAddress FIO Address incurring the fee and owned by signer.
     */
    public getFeeForAddPublicAddress(fioAddress: string): Promise<FioFeeResponse>
    /**
     * Compute and return fee amount for specific call and specific user
     *
     * @param options.fioAddress FIO Address incurring the fee and owned by signer.
     */
    public getFeeForAddPublicAddress(options: GetFeeForAddPublicAddressOptions): Promise<FioFeeResponse>
    public getFeeForAddPublicAddress(): Promise<FioFeeResponse> {
        const {fioAddress} = resolveOptions<GetFeeForAddPublicAddressOptions>({keys: ['fioAddress'], arguments})
        return this.getFee({fioAddress, endPoint: EndPoint.addPubAddress})
    }

    /**
     * @deprecated
     * Compute and return fee amount for specific call and specific user
     *
     * @param fioAddress FIO Address incurring the fee and owned by signer.
     */
    public getFeeForCancelFundsRequest(fioAddress: string): Promise<FioFeeResponse>
    /**
     * Compute and return fee amount for specific call and specific user
     *
     * @param options.fioAddress FIO Address incurring the fee and owned by signer.
     */
    public getFeeForCancelFundsRequest(options: GetFeeForCancelFundsRequestOptions): Promise<FioFeeResponse>
    public getFeeForCancelFundsRequest(): Promise<FioFeeResponse> {
        const {fioAddress} = resolveOptions<GetFeeForCancelFundsRequestOptions>({keys: ['fioAddress'], arguments})
        return this.getFee({fioAddress, endPoint: EndPoint.cancelFundsRequest})
    }

    /**
     * @deprecated
     * Compute and return fee amount for specific call and specific user
     *
     * @param fioAddress FIO Address incurring the fee and owned by signer.
     */
    public getFeeForRemovePublicAddresses(fioAddress: string): Promise<FioFeeResponse>
    /**
     * Compute and return fee amount for specific call and specific user
     *
     * @param options.fioAddress FIO Address incurring the fee and owned by signer.
     */
    public getFeeForRemovePublicAddresses(options: GetFeeForRemovePublicAddressesOptions): Promise<FioFeeResponse>
    public getFeeForRemovePublicAddresses(): Promise<FioFeeResponse> {
        const {fioAddress} = resolveOptions<GetFeeForRemovePublicAddressesOptions>({keys: ['fioAddress'], arguments})
        return this.getFee({fioAddress, endPoint: EndPoint.removePubAddress})
    }

    /**
     * @deprecated
     * Compute and return fee amount for specific call and specific user
     *
     * @param fioAddress FIO Address incurring the fee and owned by signer.
     */
    public getFeeForRemoveAllPublicAddresses(fioAddress: string): Promise<FioFeeResponse>
    /**
     * Compute and return fee amount for specific call and specific user
     *
     * @param options.fioAddress FIO Address incurring the fee and owned by signer.
     */
    public getFeeForRemoveAllPublicAddresses(options: GetFeeForRemoveAllPublicAddressesOptions): Promise<FioFeeResponse>
    public getFeeForRemoveAllPublicAddresses(): Promise<FioFeeResponse> {
        const {fioAddress} = resolveOptions<GetFeeForRemoveAllPublicAddressesOptions>({keys: ['fioAddress'], arguments})
        return this.getFee({fioAddress, endPoint: EndPoint.removeAllPubAddresses})
    }

    /**
     * @deprecated
     * Compute and return fee amount for specific call and specific user
     *
     * @param fioAddress FIO Address incurring the fee and owned by signer.
     */
    public getFeeForBurnFioAddress(fioAddress: string): Promise<FioFeeResponse>
    /**
     * Compute and return fee amount for specific call and specific user
     *
     * @param options.fioAddress FIO Address incurring the fee and owned by signer.
     */
    public getFeeForBurnFioAddress(options: GetFeeForBurnFioAddressOptions): Promise<FioFeeResponse>
    public getFeeForBurnFioAddress(): Promise<FioFeeResponse> {
        const {fioAddress} = resolveOptions<GetFeeForBurnFioAddressOptions>({keys: ['fioAddress'], arguments})
        return this.getFee({fioAddress, endPoint: EndPoint.burnFioAddress})
    }

    /**
     * @deprecated
     * Compute and return fee amount for specific call and specific user
     *
     * @param fioAddress FIO Address incurring the fee and owned by signer.
     */
    public getFeeForTransferFioAddress(fioAddress: string): Promise<FioFeeResponse>
    /**
     * Compute and return fee amount for specific call and specific user
     *
     * @param options.fioAddress FIO Address incurring the fee and owned by signer.
     */
    public getFeeForTransferFioAddress(options: GetFeeForTransferFioAddressOptions): Promise<FioFeeResponse>
    public getFeeForTransferFioAddress(): Promise<FioFeeResponse> {
        const {fioAddress} = resolveOptions<GetFeeForTransferFioAddressOptions>({keys: ['fioAddress'], arguments})
        return this.getFee({fioAddress, endPoint: EndPoint.transferFioAddress})
    }

    /**
     * @deprecated
     * Compute and return fee amount for specific call and specific user
     *
     * @param fioAddress FIO Address incurring the fee and owned by signer.
     */
    public getFeeForAddBundledTransactions(fioAddress: string): Promise<FioFeeResponse>
    /**
     * Compute and return fee amount for specific call and specific user
     *
     * @param options.fioAddress FIO Address incurring the fee and owned by signer.
     */
    public getFeeForAddBundledTransactions(options: GetFeeForAddBundledTransactionsOptions): Promise<FioFeeResponse>
    public getFeeForAddBundledTransactions(): Promise<FioFeeResponse> {
        const {fioAddress} = resolveOptions<GetFeeForAddBundledTransactionsOptions>({keys: ['fioAddress'], arguments})
        return this.getFee({fioAddress, endPoint: EndPoint.addBundledTransactions})
    }

    /**
     * @deprecated
     * Compute and return fee amount for specific call and specific user
     *
     * @param fioAddress FIO Address incurring the fee and owned by signer.
     */
    public getFeeForTransferFioDomain(fioAddress: string): Promise<FioFeeResponse>
    /**
     * Compute and return fee amount for specific call and specific user
     *
     * @param options.fioAddress FIO Address incurring the fee and owned by signer.
     */
    public getFeeForTransferFioDomain(options: GetFeeForTransferFioDomainOptions): Promise<FioFeeResponse>
    public getFeeForTransferFioDomain(): Promise<FioFeeResponse> {
        const {fioAddress} = resolveOptions<GetFeeForTransferFioDomainOptions>({keys: ['fioAddress'], arguments})
        return this.getFee({fioAddress, endPoint: EndPoint.transferFioDomain})
    }

    /**
     * @deprecated
     * Stake FIO Tokens.
     *
     * @param amount Amount of SUFs to stake.
     * @param fioAddress FIO Address if using bundled transactions to pay. May be left empty if paying a fee instead.
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by /get_fee for correct value.
     * @param technologyProviderId FIO Address of the entity which generates this transaction.
     * TPID rewards will be paid to this address. Set to empty if not known.
     */
    public async stakeFioTokens(
        amount: number,
        fioAddress?: string | null,
        maxFee?: number | null,
        technologyProviderId?: string | null,
    ): Promise<TransactionResponse>
    /**
     * Stake FIO Tokens.
     *
     * @param options.amount Amount of SUFs to stake.
     * @param options.fioAddress FIO Address if using bundled transactions to pay.
     * May be left empty if paying a fee instead.
     * @param options.maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by /get_fee for correct value.
     * @param options.technologyProviderId FIO Address of the entity which generates this transaction.
     * TPID rewards will be paid to this address. Set to empty if not known.
     */
    public async stakeFioTokens(options: StakeFioTokensOptions): Promise<TransactionResponse>
    public async stakeFioTokens(): Promise<TransactionResponse> {
        const {
            amount,
            fioAddress,
            maxFee,
            technologyProviderId,
        } = resolveOptions<StakeFioTokensOptions>({
            arguments,
            keys: ['amount', 'fioAddress', 'maxFee', 'technologyProviderId'],
        })
        let resolvedMaxFee = maxFee ?? 0
        if (!maxFee && fioAddress) {
            const {fee: stakeFee} = await this.getFee({fioAddress, endPoint: EndPoint.stakeFioTokens})
            resolvedMaxFee = stakeFee
        }
        return this.pushTransaction({
            account: 'fio.staking',
            action: 'stakefio',
            data: {
                amount,
                fio_address: fioAddress,
                max_fee: resolvedMaxFee,
                // TODO Why here we not use this.getTechnologyProviderId()
                tpid: technologyProviderId,
            },
        })
    }

    /**
     * @deprecated
     * Unstake FIO Tokens.
     *
     * @param amount Amount of SUFs to unstake.
     * @param fioAddress FIO Address if using bundled transactions to pay. May be left empty if paying a fee instead.
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by /get_fee for correct value.
     * @param technologyProviderId FIO Address of the entity which generates this transaction.
     * TPID rewards will be paid to this address. Set to empty if not known.
     */
    public async unStakeFioTokens(
        amount: number,
        fioAddress?: string | null,
        maxFee?: number | null,
        technologyProviderId?: string | null,
    ): Promise<TransactionResponse>
    /**
     * Unstake FIO Tokens.
     *
     * @param options.amount Amount of SUFs to unstake.
     * @param options.fioAddress FIO Address if using bundled transactions to pay.
     * May be left empty if paying a fee instead.
     * @param options.maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by /get_fee for correct value.
     * @param options.technologyProviderId FIO Address of the entity which generates this transaction.
     * TPID rewards will be paid to this address. Set to empty if not known.
     */
    public async unStakeFioTokens(options: UnStakeFioTokensOptions): Promise<TransactionResponse>
    public async unStakeFioTokens(): Promise<TransactionResponse> {
        const {
            amount,
            fioAddress,
            maxFee,
            technologyProviderId,
        } = resolveOptions<UnStakeFioTokensOptions>({
            arguments,
            keys: ['amount', 'fioAddress', 'maxFee', 'technologyProviderId'],
        })
        let resolvedMaxFee = maxFee ?? 0
        if (!maxFee && fioAddress) {
            const {fee: stakeFee} = await this.getFee({fioAddress, endPoint: EndPoint.unStakeFioTokens})
            resolvedMaxFee = stakeFee
        }
        return this.pushTransaction({
            account: 'fio.staking',
            action: 'unstakefio',
            data: {
                amount,
                fio_address: fioAddress,
                max_fee: resolvedMaxFee,
                tpid: technologyProviderId,
            },
        })
    }

    // TODO add more documentation
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
    public async pushTransaction(options: PushTransactionOptions): Promise<any> {
        const {
            account,
            action,
            data,
            authPermission,
            encryptOptions = {},
            signingAccount,
        } = cleanupObject(options)
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
            }
        }
        const pushTransaction = new requests.PushRequest(this.config, {
            account,
            action,
            authPermission,
            data,
            encryptOptions,
            signingAccount,
        })
        return pushTransaction.execute(this.privateKey, this.publicKey, this.returnPreparedTrx)
    }

    // TODO add more documentation
    /**
     * @deprecated
     */
    public getAccountPubKey(account: string): Promise<AccountPubKeyResponse>
    // TODO add new js doc
    public getAccountPubKey(options: GetAccountPubKeyOptions): Promise<AccountPubKeyResponse>
    public getAccountPubKey(): Promise<AccountPubKeyResponse> {
        const args = resolveOptions<GetAccountPubKeyOptions>({keys: ['account'], arguments})
        const getAccountPubKey = new queries.AccountPubKeyQuery(this.config, args)
        return getAccountPubKey.execute(this.publicKey)
    }

    // TODO add more documentation
    /**
     * @deprecated
     */
    public getEncryptKey(fioAddress: string): Promise<EncryptKeyResponse>
    // TODO add new js doc
    public getEncryptKey(options: GetEncryptKeyOptions): Promise<EncryptKeyResponse>
    public getEncryptKey(): Promise<EncryptKeyResponse> {
        const args = resolveOptions<GetEncryptKeyOptions>({keys: ['fioAddress'], arguments})
        const getEncryptKey = new queries.EncryptKeyQuery(this.config, args)
        return getEncryptKey.execute(this.publicKey)
    }

    public genericAction(action: 'getFioPublicKey'): string
    public genericAction(action: 'getAccount', params: GetAccountOptions): Promise<AccountResponse>
    public genericAction(
        action: 'registerFioDomainAddress',
        params: RegisterFioDomainAddressOptions,
    ): Promise<RegisterFioAddressResponse>
    public genericAction(
        action: 'registerFioAddress',
        params: RegisterOwnerFioAddressOptions & Partial<Pick<RegisterOwnerFioAddressOptions, 'ownerPublicKey'>>,
    ): Promise<RegisterFioAddressResponse>
    public genericAction(
        action: 'registerOwnerFioAddress',
        params: RegisterOwnerFioAddressOptions,
    ): Promise<RegisterFioAddressResponse>
    public genericAction(
        action: 'transferLockedTokens',
        params: TransferLockedTokensOptions,
    ): Promise<TransferLockedTokensResponse>
    public genericAction(
        action: 'registerFioDomain',
        params: RegisterFioDomainOptions,
    ): Promise<RegisterFioDomainResponse>
    public genericAction(
        action: 'registerOwnerFioDomain',
        params: RegisterOwnerFioDomainOptions,
    ): Promise<RegisterFioDomainResponse>
    public genericAction(action: 'renewFioDomain', params: RenewFioDomainOptions): Promise<RenewFioDomainResponse>
    public genericAction(action: 'renewFioAddress', params: RenewFioAddressOptions): Promise<RenewFioAddressResponse>
    public genericAction(action: 'burnFioAddress', params: BurnFioAddressOptions): Promise<BurnFioAddressResponse>
    public genericAction(
        action: 'transferFioAddress',
        params: TransferFioAddressOptions,
    ): Promise<TransferFioAddressResponse>
    public genericAction(
        action: 'transferFioDomain',
        params: TransferFioDomainOptions,
    ): Promise<TransferFioDomainResponse>
    public genericAction(
        action: 'addBundledTransactions',
        params: AddBundledTransactionsOptions,
    ): Promise<AddBundledResponse>
    public genericAction(
        action: 'addPublicAddress',
        params: AddPublicAddressOptions,
    ): Promise<AddPublicAddressesResponse>
    public genericAction(
        action: 'addPublicAddresses',
        params: AddPublicAddressesOptions,
    ): Promise<AddPublicAddressesResponse>
    public genericAction(
        action: 'removePublicAddresses',
        params: RemovePublicAddressesOptions,
    ): Promise<RemovePublicAddressesResponse>
    public genericAction(action: 'getLocks', params: GetLocksOptions): Promise<LocksResponse>
    public genericAction(
        action: 'cancelFundsRequest',
        params: CancelFundsRequestOptions,
    ): Promise<CancelFundsRequestResponse>
    public genericAction(
        action: 'removeAllPublicAddresses',
        params: RemoveAllPublicAddressesOptions,
    ): Promise<RemoveAllPublicAddressesResponse>
    public genericAction(
        action: 'setFioDomainVisibility',
        params: SetFioDomainVisibilityOptions,
    ): Promise<SetFioDomainVisibilityResponse>
    public genericAction(action: 'recordObtData', params: RecordObtDataOptions): Promise<RecordObtDataResponse>
    public genericAction(
        action: 'getFeeForTransferLockedTokens',
        params: GetFeeForTransferLockedTokensOptions,
    ): Promise<FioFeeResponse>
    public genericAction(action: 'getObtData', params: GetObtDataOptions): Promise<GetObtDataResponse>
    public genericAction(
        action: 'getGranteePermissions',
        params: GetGranteePermissionsOptions,
    ): Promise<PermissionsResponse>
    public genericAction(
        action: 'getGrantorPermissions',
        params: GetGrantorPermissionsOptions,
    ): Promise<PermissionsResponse>
    public genericAction(
        action: 'getObjectPermissions',
        params: GetObjectPermissionsOptions,
    ): Promise<PermissionsResponse>
    public genericAction(
        action: 'rejectFundsRequest',
        params: RejectFundsRequestOptions,
    ): Promise<RejectFundsRequestResponse>
    public genericAction(action: 'requestFunds', params: RequestFundsOptions): Promise<FundsRequestResponse>
    public genericAction(action: 'isAvailable', params: IsAvailableOptions): Promise<AvailabilityCheckResponse>
    public genericAction(action: 'getFioBalance', params: GetFioBalanceOptions): Promise<FioBalanceResponse>
    public genericAction(action: 'getFioNames', params: GetFioNamesOptions): Promise<FioNamesResponse>
    public genericAction(action: 'getFioDomains', params: GetFioDomainsOptions): Promise<FioDomainsResponse>
    public genericAction(action: 'getFioAddresses', params: GetFioAddressesOptions): Promise<FioAddressesResponse>
    public genericAction(
        action: 'getPendingFioRequests',
        params: GetPendingFioRequestsOptions,
    ): Promise<PendingFioRequestsResponse>
    public genericAction(
        action: 'getReceivedFioRequests',
        params: GetReceivedFioRequestsOptions,
    ): Promise<ReceivedFioRequestsResponse>
    public genericAction(
        action: 'getCancelledFioRequests',
        params: GetCancelledFioRequestsOptions,
    ): Promise<CancelledFioRequestsResponse>
    public genericAction(
        action: 'getSentFioRequests',
        params: GetSentFioRequestsOptions,
    ): Promise<SentFioRequestsResponse>
    public genericAction(action: 'getPublicAddress', params: GetPublicAddressOptions): Promise<PublicAddressResponse>
    public genericAction(
        action: 'getFioPublicAddress',
        params: GetFioPublicAddressOptions,
    ): Promise<PublicAddressResponse>
    public genericAction(
        action: 'getPublicAddresses',
        params: GetPublicAddressesOptions,
    ): Promise<PublicAddressesResponse>
    public genericAction(action: 'getNfts', params: GetNftsOptions): Promise<NftsResponse>
    public genericAction(action: 'transferTokens', params: TransferTokensOptions): Promise<TransferTokensResponse>
    public genericAction(action: 'stakeFioTokens', params: StakeFioTokensOptions): Promise<TransactionResponse>
    public genericAction(action: 'unStakeFioTokens', params: UnStakeFioTokensOptions): Promise<TransactionResponse>
    public genericAction(action: 'getFee', params: GetFeeOptions): Promise<FioFeeResponse>
    public genericAction(
        action: 'getFeeForRecordObtData',
        params: GetFeeForRecordObtDataOptions,
    ): Promise<FioFeeResponse>
    public genericAction(
        action: 'getFeeForNewFundsRequest',
        params: GetFeeForNewFundsRequestOptions,
    ): Promise<FioFeeResponse>
    public genericAction(
        action: 'getFeeForRejectFundsRequest',
        params: GetFeeForRejectFundsRequestOptions,
    ): Promise<FioFeeResponse>
    public genericAction(
        action: 'getFeeForBurnFioAddress',
        params: GetFeeForBurnFioAddressOptions,
    ): Promise<FioFeeResponse>
    public genericAction(
        action: 'getFeeForTransferFioAddress',
        params: GetFeeForTransferFioAddressOptions,
    ): Promise<FioFeeResponse>
    public genericAction(
        action: 'getFeeForTransferFioDomain',
        params: GetFeeForTransferFioDomainOptions,
    ): Promise<FioFeeResponse>
    public genericAction(
        action: 'getFeeForAddBundledTransactions',
        params: GetFeeForAddBundledTransactionsOptions,
    ): Promise<FioFeeResponse>
    public genericAction(
        action: 'getFeeForAddPublicAddress',
        params: GetFeeForAddPublicAddressOptions,
    ): Promise<FioFeeResponse>
    public genericAction(
        action: 'getFeeForCancelFundsRequest',
        params: GetFeeForCancelFundsRequestOptions,
    ): Promise<FioFeeResponse>
    public genericAction(
        action: 'getFeeForRemovePublicAddresses',
        params: GetFeeForRemovePublicAddressesOptions,
    ): Promise<FioFeeResponse>
    public genericAction(
        action: 'getFeeForRemoveAllPublicAddresses',
        params: GetFeeForRemoveAllPublicAddressesOptions,
    ): Promise<FioFeeResponse>
    public genericAction(action: 'getMultiplier'): number
    public genericAction<T>(action: 'pushTransaction', params: PushTransactionOptions): Promise<T>
    public genericAction(action: 'getAccountPubKey', params: GetAccountPubKeyOptions): Promise<AccountPubKeyResponse>
    public genericAction(action: 'getEncryptKey', params: GetEncryptKeyOptions): Promise<EncryptKeyResponse>
    public genericAction(action: string, params?: any) {
        switch (action) {
            case 'getFioPublicKey':
                return this.getFioPublicKey()
            case 'getAccount':
                return this.getAccount(params as GetAccountOptions)
            case 'registerFioDomainAddress':
                return this.registerFioDomainAddress(params as RegisterFioDomainAddressOptions)
            // TODO why here we resolve call if we have registerOwnerFioAddress action?
            case 'registerFioAddress':
                if (params.ownerPublicKey) {
                    return this.registerOwnerFioAddress(params as RegisterOwnerFioAddressOptions)
                } else {
                    return this.registerFioAddress(
                        params as RegisterOwnerFioAddressOptions
                            & Partial<Pick<RegisterOwnerFioAddressOptions, 'ownerPublicKey'>>,
                    )
                }
            case 'registerOwnerFioAddress':
                return this.registerOwnerFioAddress(params as RegisterOwnerFioAddressOptions)
            case 'transferLockedTokens':
                return this.transferLockedTokens(params as TransferLockedTokensOptions)
            case 'registerFioDomain':
                return this.registerFioDomain(params as RegisterFioDomainOptions)
            case 'registerOwnerFioDomain':
                return this.registerOwnerFioDomain(params as RegisterOwnerFioDomainOptions)
            case 'renewFioDomain':
                return this.renewFioDomain(params as RenewFioDomainOptions)
            case 'renewFioAddress':
                return this.renewFioAddress(params as RenewFioAddressOptions)
            case 'burnFioAddress':
                return this.burnFioAddress(params as BurnFioAddressOptions)
            case 'transferFioAddress':
                return this.transferFioAddress(params as TransferFioAddressOptions)
            case 'transferFioDomain':
                return this.transferFioDomain(params as TransferFioDomainOptions)
            case 'addBundledTransactions':
                return this.addBundledTransactions(params as AddBundledTransactionsOptions)
            case 'addPublicAddress':
                return this.addPublicAddress(params as AddPublicAddressOptions)
            case 'addPublicAddresses':
                return this.addPublicAddresses(params as AddPublicAddressesOptions)
            case 'removePublicAddresses':
                return this.removePublicAddresses(params as RemovePublicAddressesOptions)
            case 'getLocks':
                return this.getLocks(params as GetLocksOptions)
            case 'cancelFundsRequest':
                return this.cancelFundsRequest(params as CancelFundsRequestOptions)
            case 'removeAllPublicAddresses':
                return this.removeAllPublicAddresses(params as RemoveAllPublicAddressesOptions)
            case 'setFioDomainVisibility':
                return this.setFioDomainVisibility(params as SetFioDomainVisibilityOptions)
            case 'recordObtData':
                return this.recordObtData(params as RecordObtDataOptions)
            case 'getFeeForTransferLockedTokens':
                return this.getFeeForTransferLockedTokens(params as GetFeeForTransferLockedTokensOptions)
            case 'getObtData':
                return this.getObtData(params as GetObtDataOptions)
            case 'getGranteePermissions':
                return this.getGranteePermissions(params as GetGranteePermissionsOptions)
            case 'getGrantorPermissions':
                return this.getGrantorPermissions(params as GetGrantorPermissionsOptions)
            case 'getObjectPermissions':
                return this.getObjectPermissions(params as GetObjectPermissionsOptions)
            case 'rejectFundsRequest':
                return this.rejectFundsRequest(params as RejectFundsRequestOptions)
            case 'requestFunds':
                return this.requestFunds(params as RequestFundsOptions)
            case 'isAvailable':
                return this.isAvailable(params as IsAvailableOptions)
            case 'getFioBalance':
                return this.getFioBalance(params as GetFioBalanceOptions)
            case 'getFioNames':
                return this.getFioNames(params as GetFioNamesOptions)
            case 'getFioDomains':
                return this.getFioDomains(params as GetFioDomainsOptions)
            case 'getFioAddresses':
                return this.getFioAddresses(params as GetFioAddressesOptions)
            case 'getPendingFioRequests':
                return this.getPendingFioRequests(params as GetPendingFioRequestsOptions)
            case 'getReceivedFioRequests':
                return this.getReceivedFioRequests(params as GetReceivedFioRequestsOptions)
            case 'getCancelledFioRequests':
                return this.getCancelledFioRequests(params as GetCancelledFioRequestsOptions)
            case 'getSentFioRequests':
                return this.getSentFioRequests(params as GetSentFioRequestsOptions)
            case 'getPublicAddress':
                return this.getPublicAddress(params as GetPublicAddressOptions)
            case 'getFioPublicAddress':
                return this.getFioPublicAddress(params as GetFioPublicAddressOptions)
            case 'getPublicAddresses':
                return this.getPublicAddresses(params as GetPublicAddressesOptions)
            case 'getNfts':
                return this.getNfts(params as GetNftsOptions)
            case 'transferTokens':
                return this.transferTokens(params as TransferTokensOptions)
            case 'stakeFioTokens':
                return this.stakeFioTokens(params as StakeFioTokensOptions)
            case 'unStakeFioTokens':
                return this.unStakeFioTokens(params as UnStakeFioTokensOptions)
            case 'getOracleFees':
                return this.getOracleFees(params as GetOracleFeesOptions)
            case 'getFee':
                return this.getFee(params as GetFeeOptions)
            case 'getFeeForRecordObtData':
                return this.getFeeForRecordObtData(params as GetFeeForRecordObtDataOptions)
            case 'getFeeForNewFundsRequest':
                return this.getFeeForNewFundsRequest(params as GetFeeForNewFundsRequestOptions)
            case 'getFeeForRejectFundsRequest':
                return this.getFeeForRejectFundsRequest(params as GetFeeForRejectFundsRequestOptions)
            case 'getFeeForBurnFioAddress':
                return this.getFeeForBurnFioAddress(params as GetFeeForBurnFioAddressOptions)
            case 'getFeeForTransferFioAddress':
                return this.getFeeForTransferFioAddress(params as GetFeeForTransferFioAddressOptions)
            case 'getFeeForTransferFioDomain':
                return this.getFeeForTransferFioDomain(params as GetFeeForTransferFioDomainOptions)
            case 'getFeeForAddBundledTransactions':
                return this.getFeeForAddBundledTransactions(params as GetFeeForAddBundledTransactionsOptions)
            case 'getFeeForAddPublicAddress':
                return this.getFeeForAddPublicAddress(params as GetFeeForAddPublicAddressOptions)
            case 'getFeeForCancelFundsRequest':
                return this.getFeeForCancelFundsRequest(params as GetFeeForCancelFundsRequestOptions)
            case 'getFeeForRemovePublicAddresses':
                return this.getFeeForRemovePublicAddresses(params as GetFeeForRemovePublicAddressesOptions)
            case 'getFeeForRemoveAllPublicAddresses':
                return this.getFeeForRemoveAllPublicAddresses(params as GetFeeForRemoveAllPublicAddressesOptions)
            case 'getMultiplier':
                return this.getMultiplier()
            case 'pushTransaction':
                return this.pushTransaction(params as PushTransactionOptions)
            case 'getAccountPubKey':
                return this.getAccountPubKey(params as GetAccountPubKeyOptions)
            case 'getEncryptKey':
                return this.getEncryptKey(params as GetEncryptKeyOptions)
            default:
                throw new Error('Not supported generic action')
        }
    }

    // TODO why ignore?
    /**
     * @ignore
     */
    public registerFioNameOnBehalfOfUser(fioName: string, publicKey: string) {
        const baseUrl = this.registerMockUrl // "mock.dapix.io/mockd/DEV2"
        const mockRegisterFioName = new requests.MockRegisterFioNameRequest({
            baseUrl,
            fioName,
            publicKey,
        })
        return mockRegisterFioName.execute()
    }

    // TODO why ignore?
    /**
     * @ignore
     */
    private getAbi(accountName: string): Promise<AbiResponse> {
        const abi = new queries.AbiQuery(this.config, {accountName})
        return abi.execute(this.publicKey)
    }
}
