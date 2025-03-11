import { AbiResponse, Account, AccountResponse, Action, AddBundledTransactionsOptions, AddBundledTransactionsResponse, AddPublicAddressesOptions, AddPublicAddressesResponse, AddPublicAddressOptions, AvailabilityResponse, BurnFioAddressOptions, BurnFioAddressResponse, CancelFundsRequestOptions, CancelFundsRequestResponse, CancelledFioRequestsDecryptedResponse, ContentType, GetEncryptKeyResponse, EndPoint, FetchJson, FioAddressesResponse, BalanceResponse, FioDomainsResponse, FioFeeResponse, FioLogger, FioNamesResponse, FioOracleFeesResponse, FioSdkOptions, RequestFundsResponse, GetAbiOptions, GetAccountOptions, GetAccountPubKeyResponse, GetAccountPubKeyOptions, GetCancelledFioRequestsOptions, GetEncryptKeyOptions, GetFeeForAddBundledTransactionsOptions, GetFeeForAddPublicAddressOptions, GetFeeForBurnFioAddressOptions, GetFeeForCancelFundsRequestOptions, GetFeeForNewFundsRequestOptions, GetFeeForRecordObtDataOptions, GetFeeForRejectFundsRequestOptions, GetFeeForRemoveAllPublicAddressesOptions, GetFeeForRemovePublicAddressesOptions, GetFeeForTransferFioAddressOptions, GetFeeForTransferFioDomainOptions, GetFeeForTransferLockedTokensOptions, GetFeeOptions, GetFioAddressesOptions, GetFioBalanceOptions, GetFioDomainsOptions, GetFioNamesOptions, GetFioPublicAddressOptions, GetGranteePermissionsOptions, GetGrantorPermissionsOptions, GetLocksOptions, GetNftsOptions, GetObjectPermissionsOptions, GetObtDataDecryptedResponse, GetObtDataOptions, GetOracleFeesOptions, GetPendingFioRequestsOptions, GetPublicAddressesOptions, GetPublicAddressOptions, GetReceivedFioRequestsOptions, GetSentFioRequestsOptions, IsAvailableOptions, LockPeriod, LocksResponse, NftsResponse, PendingFioRequestsDecryptedResponse, PermissionsResponse, PublicAddress, PublicAddressesResponse, PublicAddressResponse, PushTransactionOptions, ReceivedFioRequestsDecryptedResponse, RecordObtDataOptions, RecordObtDataResponse, RegisterFioAddressOptions, RegisterFioAddressResponse, RegisterFioDomainAddressOptions, RegisterFioDomainOptions, RegisterFioDomainResponse, RegisterOwnerFioAddressOptions, RegisterOwnerFioDomainOptions, RejectFundsRequestOptions, RejectFundsResponse, RemoveAllPublicAddressesOptions, RemoveAllPublicAddressesResponse, RemovePublicAddressesOptions, RemovePublicAddressesResponse, RenewFioAddressOptions, RenewFioAddressResponse, RenewFioDomainOptions, RenewFioDomainResponse, RequestFundsOptions, SentFioRequestsDecryptedResponse, SetFioDomainVisibilityOptions, SetFioDomainVisibilityResponse, StakeFioTokensOptions, TransactionResponse, TransferFioAddressOptions, TransferFioAddressResponse, TransferFioDomainOptions, TransferFioDomainResponse, TransferLockedTokensOptions, TransferLockedTokensResponse, TransferTokensResponse, TransferTokensOptions, UnStakeFioTokensOptions } from './entities';
import { RequestConfig } from './transactions/Transactions';
import * as fioConstants from './utils/constants';
export * from './utils/validation';
export * from './entities';
export { fioConstants };
export declare enum GenericAction {
    getFioPublicKey = "getFioPublicKey",
    getAccount = "getAccount",
    registerFioDomainAddress = "registerFioDomainAddress",
    registerFioAddress = "registerFioAddress",
    registerOwnerFioAddress = "registerOwnerFioAddress",
    transferLockedTokens = "transferLockedTokens",
    registerFioDomain = "registerFioDomain",
    registerOwnerFioDomain = "registerOwnerFioDomain",
    renewFioDomain = "renewFioDomain",
    renewFioAddress = "renewFioAddress",
    burnFioAddress = "burnFioAddress",
    transferFioAddress = "transferFioAddress",
    transferFioDomain = "transferFioDomain",
    addBundledTransactions = "addBundledTransactions",
    addPublicAddress = "addPublicAddress",
    addPublicAddresses = "addPublicAddresses",
    removePublicAddresses = "removePublicAddresses",
    getLocks = "getLocks",
    cancelFundsRequest = "cancelFundsRequest",
    removeAllPublicAddresses = "removeAllPublicAddresses",
    setFioDomainVisibility = "setFioDomainVisibility",
    recordObtData = "recordObtData",
    getObtData = "getObtData",
    getGranteePermissions = "getGranteePermissions",
    getGrantorPermissions = "getGrantorPermissions",
    getObjectPermissions = "getObjectPermissions",
    rejectFundsRequest = "rejectFundsRequest",
    requestFunds = "requestFunds",
    isAvailable = "isAvailable",
    getFioBalance = "getFioBalance",
    getFioNames = "getFioNames",
    getFioDomains = "getFioDomains",
    getFioAddresses = "getFioAddresses",
    getPendingFioRequests = "getPendingFioRequests",
    getReceivedFioRequests = "getReceivedFioRequests",
    getCancelledFioRequests = "getCancelledFioRequests",
    getSentFioRequests = "getSentFioRequests",
    getPublicAddress = "getPublicAddress",
    getFioPublicAddress = "getFioPublicAddress",
    getPublicAddresses = "getPublicAddresses",
    getNfts = "getNfts",
    transferTokens = "transferTokens",
    stakeFioTokens = "stakeFioTokens",
    unStakeFioTokens = "unStakeFioTokens",
    getOracleFees = "getOracleFees",
    getAbi = "getAbi",
    getFee = "getFee",
    getFeeForRecordObtData = "getFeeForRecordObtData",
    getFeeForNewFundsRequest = "getFeeForNewFundsRequest",
    getFeeForRejectFundsRequest = "getFeeForRejectFundsRequest",
    getFeeForBurnFioAddress = "getFeeForBurnFioAddress",
    getFeeForTransferFioAddress = "getFeeForTransferFioAddress",
    getFeeForTransferFioDomain = "getFeeForTransferFioDomain",
    getFeeForAddBundledTransactions = "getFeeForAddBundledTransactions",
    getFeeForAddPublicAddress = "getFeeForAddPublicAddress",
    getFeeForCancelFundsRequest = "getFeeForCancelFundsRequest",
    getFeeForRemovePublicAddresses = "getFeeForRemovePublicAddresses",
    getFeeForRemoveAllPublicAddresses = "getFeeForRemoveAllPublicAddresses",
    getFeeForTransferLockedTokens = "getFeeForTransferLockedTokens",
    getMultiplier = "getMultiplier",
    pushTransaction = "pushTransaction",
    getAccountPubKey = "getAccountPubKey",
    getEncryptKey = "getEncryptKey"
}
type GenericActions = {
    [GenericAction.getFioPublicKey]: {
        options: [];
        response: string;
    };
    [GenericAction.getAccount]: {
        options: [GetAccountOptions];
        response: Promise<AccountResponse>;
    };
    [GenericAction.registerFioDomainAddress]: {
        options: [RegisterFioDomainAddressOptions];
        response: Promise<RegisterFioAddressResponse>;
    };
    [GenericAction.registerFioAddress]: {
        options: [Omit<RegisterOwnerFioAddressOptions, 'ownerPublicKey'> & Partial<Pick<RegisterOwnerFioAddressOptions, 'ownerPublicKey'>>];
        response: Promise<RegisterFioAddressResponse>;
    };
    [GenericAction.registerOwnerFioAddress]: {
        options: [RegisterOwnerFioAddressOptions];
        response: Promise<RegisterFioAddressResponse>;
    };
    [GenericAction.transferLockedTokens]: {
        options: [TransferLockedTokensOptions];
        response: Promise<TransferLockedTokensResponse>;
    };
    [GenericAction.registerFioDomain]: {
        options: [RegisterFioDomainOptions];
        response: Promise<RegisterFioDomainResponse>;
    };
    [GenericAction.registerOwnerFioDomain]: {
        options: [RegisterOwnerFioDomainOptions];
        response: Promise<RegisterFioDomainResponse>;
    };
    [GenericAction.renewFioDomain]: {
        options: [RenewFioDomainOptions];
        response: Promise<RenewFioDomainResponse>;
    };
    [GenericAction.renewFioAddress]: {
        options: [RenewFioAddressOptions];
        response: Promise<RenewFioAddressResponse>;
    };
    [GenericAction.burnFioAddress]: {
        options: [BurnFioAddressOptions];
        response: Promise<BurnFioAddressResponse>;
    };
    [GenericAction.transferFioAddress]: {
        options: [TransferFioAddressOptions];
        response: Promise<TransferFioAddressResponse>;
    };
    [GenericAction.transferFioDomain]: {
        options: [TransferFioDomainOptions];
        response: Promise<TransferFioDomainResponse>;
    };
    [GenericAction.addBundledTransactions]: {
        options: [AddBundledTransactionsOptions];
        response: Promise<AddBundledTransactionsResponse>;
    };
    [GenericAction.addPublicAddress]: {
        options: [AddPublicAddressOptions];
        response: Promise<AddPublicAddressesResponse>;
    };
    [GenericAction.addPublicAddresses]: {
        options: [AddPublicAddressesOptions];
        response: Promise<AddPublicAddressesResponse>;
    };
    [GenericAction.removePublicAddresses]: {
        options: [RemovePublicAddressesOptions];
        response: Promise<RemovePublicAddressesResponse>;
    };
    [GenericAction.getLocks]: {
        options: [GetLocksOptions];
        response: Promise<LocksResponse>;
    };
    [GenericAction.cancelFundsRequest]: {
        options: [CancelFundsRequestOptions];
        response: Promise<CancelFundsRequestResponse>;
    };
    [GenericAction.removeAllPublicAddresses]: {
        options: [RemoveAllPublicAddressesOptions];
        response: Promise<RemoveAllPublicAddressesResponse>;
    };
    [GenericAction.setFioDomainVisibility]: {
        options: [SetFioDomainVisibilityOptions];
        response: Promise<SetFioDomainVisibilityResponse>;
    };
    [GenericAction.recordObtData]: {
        options: [RecordObtDataOptions];
        response: Promise<RecordObtDataResponse>;
    };
    [GenericAction.getObtData]: {
        options: [GetObtDataOptions];
        response: Promise<GetObtDataDecryptedResponse>;
    };
    [GenericAction.getGranteePermissions]: {
        options: [GetGranteePermissionsOptions];
        response: Promise<PermissionsResponse>;
    };
    [GenericAction.getGrantorPermissions]: {
        options: [GetGrantorPermissionsOptions];
        response: Promise<PermissionsResponse>;
    };
    [GenericAction.getObjectPermissions]: {
        options: [GetObjectPermissionsOptions];
        response: Promise<PermissionsResponse>;
    };
    [GenericAction.rejectFundsRequest]: {
        options: [RejectFundsRequestOptions];
        response: Promise<RejectFundsResponse>;
    };
    [GenericAction.requestFunds]: {
        options: [RequestFundsOptions];
        response: Promise<RequestFundsResponse>;
    };
    [GenericAction.isAvailable]: {
        options: [IsAvailableOptions];
        response: Promise<AvailabilityResponse>;
    };
    [GenericAction.getFioBalance]: {
        options: [GetFioBalanceOptions];
        response: Promise<BalanceResponse>;
    };
    [GenericAction.getFioNames]: {
        options: [GetFioNamesOptions];
        response: Promise<FioNamesResponse>;
    };
    [GenericAction.getFioDomains]: {
        options: [GetFioDomainsOptions];
        response: Promise<FioDomainsResponse>;
    };
    [GenericAction.getFioAddresses]: {
        options: [GetFioAddressesOptions];
        response: Promise<FioAddressesResponse>;
    };
    [GenericAction.getPendingFioRequests]: {
        options: [GetPendingFioRequestsOptions];
        response: Promise<PendingFioRequestsDecryptedResponse>;
    };
    [GenericAction.getReceivedFioRequests]: {
        options: [GetReceivedFioRequestsOptions];
        response: Promise<ReceivedFioRequestsDecryptedResponse>;
    };
    [GenericAction.getCancelledFioRequests]: {
        options: [GetCancelledFioRequestsOptions];
        response: Promise<CancelledFioRequestsDecryptedResponse>;
    };
    [GenericAction.getSentFioRequests]: {
        options: [GetSentFioRequestsOptions];
        response: Promise<SentFioRequestsDecryptedResponse>;
    };
    [GenericAction.getPublicAddress]: {
        options: [GetPublicAddressOptions];
        response: Promise<PublicAddressResponse>;
    };
    [GenericAction.getFioPublicAddress]: {
        options: [GetFioPublicAddressOptions];
        response: Promise<PublicAddressResponse>;
    };
    [GenericAction.getPublicAddresses]: {
        options: [GetPublicAddressesOptions];
        response: Promise<PublicAddressesResponse>;
    };
    [GenericAction.getNfts]: {
        options: [GetNftsOptions];
        response: Promise<NftsResponse>;
    };
    [GenericAction.transferTokens]: {
        options: [TransferTokensOptions];
        response: Promise<TransferTokensResponse>;
    };
    [GenericAction.stakeFioTokens]: {
        options: [StakeFioTokensOptions];
        response: Promise<TransactionResponse>;
    };
    [GenericAction.unStakeFioTokens]: {
        options: [UnStakeFioTokensOptions];
        response: Promise<TransactionResponse>;
    };
    [GenericAction.getOracleFees]: {
        options: [GetOracleFeesOptions];
        response: Promise<FioOracleFeesResponse>;
    };
    [GenericAction.getFee]: {
        options: [GetFeeOptions];
        response: Promise<FioFeeResponse>;
    };
    [GenericAction.getAbi]: {
        options: [GetAbiOptions];
        response: Promise<AbiResponse>;
    };
    [GenericAction.getFeeForRecordObtData]: {
        options: [GetFeeForRecordObtDataOptions];
        response: Promise<FioFeeResponse>;
    };
    [GenericAction.getFeeForNewFundsRequest]: {
        options: [GetFeeForNewFundsRequestOptions];
        response: Promise<FioFeeResponse>;
    };
    [GenericAction.getFeeForRejectFundsRequest]: {
        options: [GetFeeForRejectFundsRequestOptions];
        response: Promise<FioFeeResponse>;
    };
    [GenericAction.getFeeForBurnFioAddress]: {
        options: [GetFeeForBurnFioAddressOptions];
        response: Promise<FioFeeResponse>;
    };
    [GenericAction.getFeeForTransferFioAddress]: {
        options: [GetFeeForTransferFioAddressOptions];
        response: Promise<FioFeeResponse>;
    };
    [GenericAction.getFeeForTransferFioDomain]: {
        options: [GetFeeForTransferFioDomainOptions];
        response: Promise<FioFeeResponse>;
    };
    [GenericAction.getFeeForAddBundledTransactions]: {
        options: [GetFeeForAddBundledTransactionsOptions];
        response: Promise<FioFeeResponse>;
    };
    [GenericAction.getFeeForAddPublicAddress]: {
        options: [GetFeeForAddPublicAddressOptions];
        response: Promise<FioFeeResponse>;
    };
    [GenericAction.getFeeForCancelFundsRequest]: {
        options: [GetFeeForCancelFundsRequestOptions];
        response: Promise<FioFeeResponse>;
    };
    [GenericAction.getFeeForRemovePublicAddresses]: {
        options: [GetFeeForRemovePublicAddressesOptions];
        response: Promise<FioFeeResponse>;
    };
    [GenericAction.getFeeForRemoveAllPublicAddresses]: {
        options: [GetFeeForRemoveAllPublicAddressesOptions];
        response: Promise<FioFeeResponse>;
    };
    [GenericAction.getFeeForTransferLockedTokens]: {
        options: [GetFeeForTransferLockedTokensOptions];
        response: Promise<FioFeeResponse>;
    };
    [GenericAction.getMultiplier]: {
        options: [];
        response: number;
    };
    [GenericAction.pushTransaction]: {
        options: [PushTransactionOptions];
        response: Promise<unknown>;
    };
    [GenericAction.getAccountPubKey]: {
        options: [GetAccountPubKeyOptions];
        response: Promise<GetAccountPubKeyResponse>;
    };
    [GenericAction.getEncryptKey]: {
        options: [GetEncryptKeyOptions];
        response: Promise<GetEncryptKeyResponse>;
    };
};
export declare class FIOSDK {
    /**
     * @ignore
     * Needed for testing abi
     */
    static customRawAbiAccountName: string[] | null;
    /**
     * SUFs = Smallest Units of FIO
     */
    static SUFUnit: number;
    static rawAbiMissingWarnings: string[];
    /**
     * @ignore
     * Needed for testing abi
     */
    static setCustomRawAbiAccountName(customRawAbiAccountName: string | null): void;
    /**
     * Private key generation in the SDK is available for testing purposes only.
     * Do not generate private keys for production application using this method.
     * Instead pass securely generated private keys or seed phrase to the SDK constructor.
     *
     * @ignore
     */
    static createPrivateKey(entropy: Buffer): Promise<{
        fioKey: string;
        mnemonic: string;
    }>;
    /**
     * Create a FIO private key.
     *
     * Private key generation in the SDK is available for testing purposes only.
     * Do not generate private keys for production application using this method.
     * Instead pass securely generated private keys or seed phrase to the SDK constructor.
     *
     * @param mnemonic mnemonic used to generate a random unique private key.
     * @example real flame win provide layer trigger soda erode upset rate beef wrist fame design merit
     *
     * @returns New FIO private key
     */
    static createPrivateKeyMnemonic(mnemonic: string): Promise<{
        fioKey: any;
        mnemonic: string;
    }>;
    /**
     * Create a FIO public key.
     *
     * @param fioPrivateKey FIO private key.
     *
     * @returns FIO public key derived from the FIO private key.
     */
    static derivedPublicKey(fioPrivateKey: string): {
        publicKey: string;
    };
    /**
     * hash a pub key
     *
     * @param fioPublicKey FIO private key.
     *
     * @returns FIO account derived from pub key.
     */
    static accountHash(fioPublicKey: string): {
        accountnm: string;
    };
    /**
     * @deprecated use {@link FIOSDK#validateChainCode}
     * Is the Chain Code Valid?
     *
     * @param chainCode
     *
     * @returns Chain Code is Valid
     */
    static isChainCodeValid(chainCode: string): true;
    /**
     * @deprecated use {@link FIOSDK#validateTokenCode}
     * Is the Token Code Valid?
     *
     * @param tokenCode
     *
     * @returns Token Code is Valid
     */
    static isTokenCodeValid(tokenCode: string): true;
    /**
     * @deprecated use {@link FIOSDK#validateFioAddress}
     * Is the FIO Address Valid?
     *
     * @param fioAddress
     *
     * @returns Fio Address is Valid
     */
    static isFioAddressValid(fioAddress: string): true;
    /**
     * @deprecated use {@link FIOSDK#validateFioDomain}
     * Is the FIO Domain Valid?
     *
     * @param fioDomain
     *
     * @returns FIO Domain is Valid
     */
    static isFioDomainValid(fioDomain: string): true;
    /**
     * @deprecated use {@link FIOSDK#validateFioPublicKey}
     * Is the FIO Public Key Valid?
     *
     * @param fioPublicKey
     *
     * @returns FIO Public Key is Valid
     */
    static isFioPublicKeyValid(fioPublicKey: string): true;
    /**
     * @deprecated use {@link FIOSDK#validatePublicAddress}
     * Is the Public Address Valid?
     *
     * @param publicAddress
     *
     * @returns Public Address is Valid
     */
    static isPublicAddressValid(publicAddress: string): true;
    /**
     * Convert a FIO Token Amount to FIO SUFs
     *
     * @param amount
     *
     * 2.568 FIO should be 2568000000 SUFs
     *
     * @returns FIO SUFs
     */
    static amountToSUF(amount: number): number;
    /**
     * Convert FIO SUFs to a FIO Token amount
     *
     * @param suf {string | number}
     *
     * @returns FIO Token amount
     */
    static SUFToAmount(suf: number | string): number;
    /**
     * Convert a FIO Token Amount to FIO SUFs
     *
     * @param amount
     *
     * 2.568 FIO should be 2568000000 SUFs
     *
     * @returns {string} FIO SUFs
     */
    static amountToSUFString(amount: number | string): string;
    /**
     * Convert FIO SUFs to a FIO Token amount
     *
     * @param suf {string | number}
     *
     * @returns {string} FIO Token amount
     */
    static SUFToAmountString(suf: number | string): string;
    /**
     * Set stored raw abi missing warnings
     */
    static setRawAbiMissingWarnings(rawAbiName: string, fioSdkInstance: FIOSDK): void;
    config: RequestConfig;
    static get abiMap(): import("./transactions/Transactions").ApiMap;
    get transactions(): {
        createRawTransaction: ({ account, action, authPermission, data, publicKey, chainData, signingAccount }: {
            account: Account;
            action: Action;
            authPermission?: string;
            data: any;
            publicKey?: string;
            chainData?: {
                ref_block_num: number;
                ref_block_prefix: number;
                expiration: string;
            };
            signingAccount?: string;
        }) => Promise<import("./entities").RawRequest>;
        getActor: (publicKey?: string) => string;
        getBlock: (chain: import("./entities").FioInfoResponse) => Promise<import("@fioprotocol/fiojs/dist/chain-rpc-interfaces").GetBlockResult>;
        getChainDataForTx: () => Promise<{
            chain_id: string;
            ref_block_num: number;
            ref_block_prefix: number;
            expiration: string;
        }>;
        getChainInfo: () => Promise<import("./entities").FioInfoResponse>;
        getCipherContent: (contentType: ContentType, content: any, privateKey: string, publicKey: string) => string;
        getUnCipherContent: <T = any>(contentType: ContentType, content: string, privateKey: string, publicKey: string) => T;
        serialize: ({ chainId, abiMap, transaction, textDecoder, textEncoder, }: {
            transaction: import("./entities").RawRequest;
            chainId: string;
            abiMap?: Map<string, any>;
            textDecoder?: TextDecoder;
            textEncoder?: TextEncoder;
        }) => Promise<import("@fioprotocol/fiojs/dist/chain-rpc-interfaces").PushTransactionArgs>;
        deserialize: ({ chainId, abiMap, serializedTransaction, textDecoder, textEncoder, }: {
            serializedTransaction: Uint8Array;
            chainId: string;
            abiMap?: Map<string, any>;
            textDecoder?: TextDecoder;
            textEncoder?: TextEncoder;
        }) => Promise<import("./entities").RawRequest>;
    };
    /**
     * @ignore
     */
    registerMockUrl: string;
    /**
     * the fio private key of the client sending requests to FIO API.
     */
    privateKey: string;
    /**
     * the fio public key of the client sending requests to FIO API.
     */
    publicKey: string;
    /**
     * Default FIO Address of the wallet which generates transactions.
     */
    technologyProviderId: string;
    /**
     * Stored raw abi missing warnings
     */
    rawAbiMissingWarnings: string[];
    /**
     * @ignore
     */
    private proxyHandle;
    /**
     * @ignore
     * Defines whether SignedTransaction would execute or return prepared transaction
     */
    private returnPreparedTrx;
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
     * @param logger {@link FioLogger} FIO logger to handle all requests.
     */
    constructor(privateKey: string, publicKey: string, apiUrls: string[] | string, fetchJson: FetchJson, registerMockUrl?: string | null, technologyProviderId?: string | null, returnPreparedTrx?: boolean | null, logger?: FioLogger | null);
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
     * @param options.logger FIO logger to handle all requests.
     */
    constructor(options: FioSdkOptions);
    /**
     * Is the Chain Code Valid?
     *
     * @param chainCode
     *
     * @returns Chain Code is Valid
     */
    validateChainCode(chainCode: string): boolean;
    /**
     * Is the Token Code Valid?
     *
     * @param tokenCode
     *
     * @returns Token Code is Valid
     */
    validateTokenCode(tokenCode: string): boolean;
    /**
     * Is the FIO Address Valid?
     *
     * @param fioAddress
     *
     * @returns Fio Address is Valid
     */
    validateFioAddress(fioAddress: string): boolean;
    /**
     * Is the FIO Domain Valid?
     *
     * @param fioDomain
     *
     * @returns FIO Domain is Valid
     */
    validateFioDomain(fioDomain: string): boolean;
    /**
     * Is the FIO Public Key Valid?
     *
     * @param fioPublicKey
     *
     * @returns FIO Public Key is Valid
     */
    validateFioPublicKey(fioPublicKey: string): boolean;
    /**
     * Is the Public Address Valid?
     *
     * @param publicAddress
     *
     * @returns Public Address is Valid
     */
    validatePublicAddress(publicAddress: string): boolean;
    /**
     * Retrieves the FIO public key assigned to the FIOSDK instance.
     */
    getFioPublicKey(): string;
    /**
     * Returns technologyProviderId or default
     */
    getTechnologyProviderId(technologyProviderId?: string | null): string;
    /**
     * Set returnPreparedTrx
     */
    setSignedTrxReturnOption(returnPreparedTrx: boolean): void;
    /**
     * Set transactions baseUrls
     */
    setApiUrls(apiUrls: string[]): void;
    /**
     * Execute prepared transaction.
     *
     * @param endPoint endpoint.
     * @param preparedTrx
     */
    executePreparedTrx(endPoint: EndPoint, preparedTrx: unknown): Promise<any>;
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
    registerFioAddress(fioAddress: string, maxFee: number, technologyProviderId?: string | null, expirationOffset?: number | null): Promise<RegisterFioAddressResponse>;
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
    registerFioAddress(options: RegisterFioAddressOptions): Promise<RegisterFioAddressResponse>;
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
    registerOwnerFioAddress(fioAddress: string, ownerPublicKey: string, maxFee: number, technologyProviderId?: string | null, expirationOffset?: number | null): Promise<RegisterFioAddressResponse>;
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
    registerOwnerFioAddress(options: RegisterOwnerFioAddressOptions): Promise<RegisterFioAddressResponse>;
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
    registerFioDomainAddress(options: RegisterFioDomainAddressOptions): Promise<RegisterFioAddressResponse>;
    /**
     * @deprecated
     * Registers a FIO Domain on the FIO blockchain.
     *
     * @param fioDomain FIO Domain to register. The owner will be the public key associated with the FIO SDK instance.
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by @ [getFee] for correct value.
     * @param technologyProviderId FIO Address of the wallet which generates this transaction.
     * @param expirationOffset Expiration time offset for this transaction in seconds.
     * Default is 180 seconds. Increasing number of seconds gives transaction more lifetime term.
     */
    registerFioDomain(fioDomain: string, maxFee: number, technologyProviderId?: string | null, expirationOffset?: number | null): Promise<RegisterFioDomainResponse>;
    /**
     * Registers a FIO Domain on the FIO blockchain.
     *
     * @param options.fioDomain FIO Domain to register. The owner will be the public key associated
     * with the FIO SDK instance.
     * @param options.maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by @ [getFee] for correct value.
     * @param options.ownerPublicKey Owner FIO Public Key.
     * @param options.technologyProviderId FIO Address of the wallet which generates this transaction.
     * @param options.expirationOffset Expiration time offset for this transaction in seconds.
     * Default is 180 seconds. Increasing number of seconds gives transaction more lifetime term.
     */
    registerFioDomain(options: RegisterFioDomainOptions): Promise<RegisterFioDomainResponse>;
    /**
     * @deprecated
     * Registers a FIO Domain on behalf of the owner FIO Public key parameter. Owner FIO Public key owns the FIO domain.
     *
     * @param fioDomain FIO Domain to register. The owner will be the public key associated with the FIO SDK instance.
     * @param ownerPublicKey Owner FIO Public Key.
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by @ [getFee] for correct value.
     * @param technologyProviderId FIO Address of the wallet which generates this transaction.
     * @param expirationOffset Expiration time offset for this transaction in seconds.
     * Default is 180 seconds. Increasing number of seconds gives transaction more lifetime term.
     */
    registerOwnerFioDomain(fioDomain: string, ownerPublicKey: string, maxFee: number, technologyProviderId?: string | null, expirationOffset?: number | null): Promise<RegisterFioDomainResponse>;
    /**
     * Registers a FIO Domain on behalf of the owner FIO Public key parameter. Owner FIO Public key owns the FIO domain.
     *
     * @param options.fioDomain FIO Domain to register. The owner will be the public key associated
     * with the FIO SDK instance.
     * @param options.ownerPublicKey Owner FIO Public Key.
     * @param options.maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by @ [getFee] for correct value.
     * @param options.technologyProviderId FIO Address of the wallet which generates this transaction.
     * @param options.expirationOffset Expiration time offset for this transaction in seconds.
     * Default is 180 seconds. Increasing number of seconds gives transaction more lifetime term.
     */
    registerOwnerFioDomain(options: RegisterOwnerFioDomainOptions): Promise<RegisterFioDomainResponse>;
    /**
     * @deprecated
     * Burns a FIO Address on the FIO blockchain.
     *
     * @param fioAddress FIO Address to burn. The owner will be the public key associated with the FIO SDK instance.
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by @ [getFee] for correct value.
     * @param technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    burnFioAddress(fioAddress: string, maxFee: number, technologyProviderId?: string | null): Promise<BurnFioAddressResponse>;
    /**
     * Burns a FIO Address on the FIO blockchain.
     *
     * @param options.fioAddress FIO Address to burn. The owner will be the public key associated
     * with the FIO SDK instance.
     * @param options.maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by @ [getFee] for correct value.
     * @param options.technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    burnFioAddress(options: BurnFioAddressOptions): Promise<BurnFioAddressResponse>;
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
    transferFioDomain(fioDomain: string, newOwnerKey: string, maxFee: number, technologyProviderId?: string | null): Promise<TransferFioDomainResponse>;
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
    transferFioDomain(options: TransferFioDomainOptions): Promise<TransferFioDomainResponse>;
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
    transferFioAddress(fioAddress: string, newOwnerKey: string, maxFee: number, technologyProviderId?: string | null): Promise<TransferFioAddressResponse>;
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
    transferFioAddress(options: TransferFioAddressOptions): Promise<TransferFioAddressResponse>;
    /**
     * @deprecated
     * Adds bundles of transactions to FIO Address.
     *
     * @param fioAddress FIO Address to transfer. The owner will be the public key associated with the FIO SDK instance.
     * @param bundleSets Number of sets of bundles to add to FIO Address.
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by @ [getFee] for correct value.
     * @param technologyProviderId FIO Address of the wallet which generates this transaction.
     * @param expirationOffset Expiration time offset for this transaction in seconds.
     * Default is 180 seconds. Increasing number of seconds gives transaction more lifetime term.
     */
    addBundledTransactions(fioAddress: string, bundleSets: number, maxFee: number, technologyProviderId?: string | null, expirationOffset?: number | null): Promise<AddBundledTransactionsResponse>;
    /**
     * Adds bundles of transactions to FIO Address.
     *
     * @param options.fioAddress FIO Address to transfer.
     * The owner will be the public key associated with the FIO SDK instance.
     * @param options.bundleSets Number of sets of bundles to add to FIO Address.
     * @param options.maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by @ [getFee] for correct value.
     * @param options.technologyProviderId FIO Address of the wallet which generates this transaction.
     * @param options.expirationOffset Expiration time offset for this transaction in seconds.
     * Default is 180 seconds. Increasing number of seconds gives transaction more lifetime term.
     */
    addBundledTransactions(options: AddBundledTransactionsOptions): Promise<AddBundledTransactionsResponse>;
    /**
     * @deprecated
     * Renew a FIO Address on the FIO blockchain.
     *
     * @param fioAddress FIO Address to renew.
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by @ [getFee] for correct value.
     * @param technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    renewFioAddress(fioAddress: string, maxFee: number, technologyProviderId?: string | null): Promise<RenewFioAddressResponse>;
    /**
     * Renew a FIO Address on the FIO blockchain.
     *
     * @param options.fioAddress FIO Address to renew.
     * @param options.maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by @ [getFee] for correct value.
     * @param options.technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    renewFioAddress(options: RenewFioAddressOptions): Promise<RenewFioAddressResponse>;
    /**
     * @deprecated
     * Renew a FIO Domain on the FIO blockchain.
     *
     * @param fioDomain FIO Domain to renew.
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by @ [getFee] for correct value.
     * @param technologyProviderId FIO Address of the wallet which generates this transaction.
     * @param expirationOffset Expiration time offset for this transaction in seconds.
     * Default is 180 seconds. Increasing number of seconds gives transaction more lifetime term.
     */
    renewFioDomain(fioDomain: string, maxFee: number, technologyProviderId?: string | null, expirationOffset?: number | null): Promise<RenewFioDomainResponse>;
    /**
     * Renew a FIO Domain on the FIO blockchain.
     *
     * @param options.fioDomain FIO Domain to renew.
     * @param options.maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by @ [getFee] for correct value.
     * @param options.technologyProviderId FIO Address of the wallet which generates this transaction.
     * @param options.expirationOffset Expiration time offset for this transaction in seconds.
     * Default is 180 seconds. Increasing number of seconds gives transaction more lifetime term.
     */
    renewFioDomain(options: RenewFioDomainOptions): Promise<RenewFioDomainResponse>;
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
    addPublicAddress(fioAddress: string, chainCode: string, tokenCode: string, publicAddress: string, maxFee: number, technologyProviderId?: string | null): Promise<AddPublicAddressesResponse>;
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
    addPublicAddress(options: AddPublicAddressOptions): Promise<AddPublicAddressesResponse>;
    /**
     * @deprecated
     * This call cancels the specified fio funds request.
     *
     * @param fioRequestId The id of the request.
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by /get_fee for correct value.
     * @param technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    cancelFundsRequest(fioRequestId: number, maxFee: number, technologyProviderId?: string | null): Promise<CancelFundsRequestResponse>;
    /**
     * This call cancels the specified fio funds request.
     *
     * @param options.fioRequestId The id of the request.
     * @param options.maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by /get_fee for correct value.
     * @param options.technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    cancelFundsRequest(options: CancelFundsRequestOptions): Promise<CancelFundsRequestResponse>;
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
    removePublicAddresses(fioAddress: string, publicAddresses: PublicAddress[], maxFee: number, technologyProviderId?: string | null): Promise<RemovePublicAddressesResponse>;
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
    removePublicAddresses(options: RemovePublicAddressesOptions): Promise<RemovePublicAddressesResponse>;
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
    transferLockedTokens(payeePublicKey: string, canVote: boolean, periods: LockPeriod[], amount: number, maxFee: number, technologyProviderId?: string | null): Promise<TransferLockedTokensResponse>;
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
    transferLockedTokens(options: TransferLockedTokensOptions): Promise<TransferLockedTokensResponse>;
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
    removeAllPublicAddresses(fioAddress: string, maxFee: number, technologyProviderId?: string | null): Promise<RemoveAllPublicAddressesResponse>;
    /**
     * This call allows a user to remove all addresses from the specified FIO Address,
     * all addresses except the FIO address will be removed.
     *
     * @param options.fioAddress FIO Address which will be mapped to public address.
     * @param options.maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by /get_fee for correct value.
     * @param options.technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    removeAllPublicAddresses(options: RemoveAllPublicAddressesOptions): Promise<RemoveAllPublicAddressesResponse>;
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
    addPublicAddresses(fioAddress: string, publicAddresses: PublicAddress[], maxFee: number, technologyProviderId?: string | null): Promise<AddPublicAddressesResponse>;
    /**
     * This call allows a public addresses of the specific blockchain type to be added to the FIO Address.
     *
     * @param options.fioAddress FIO Address which will be mapped to public addresses.
     * @param options.publicAddresses Array of public addresses to be added to the FIO Address for the specified token.
     * @param options.maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by /get_fee for correct value.
     * @param options.technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    addPublicAddresses(options: AddPublicAddressesOptions): Promise<AddPublicAddressesResponse>;
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
    setFioDomainVisibility(fioDomain: string, isPublic: boolean, maxFee: number, technologyProviderId?: string | null): Promise<SetFioDomainVisibilityResponse>;
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
    setFioDomainVisibility(options: SetFioDomainVisibilityOptions): Promise<SetFioDomainVisibilityResponse>;
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
    recordObtData(options: RecordObtDataOptions): Promise<RecordObtDataResponse>;
    /**
     * Retrieves OBT metadata data stored using record send.
     *
     * @param options.limit Number of request to return. If omitted, all requests will be returned.
     * @param options.offset First request from list to return. If omitted, 0 is assumed.
     * @param options.tokenCode Code of the token to filter results
     * @param options.includeEncrypted Set to true if you want to include not encrypted data in return.
     */
    getObtData(options: GetObtDataOptions): Promise<GetObtDataDecryptedResponse>;
    /**
     * @deprecated
     * Gets FIO permissions for the specified grantee account.
     *
     * @param limit Number of request to return. If omitted, all requests will be returned.
     * @param offset First request from list to return. If omitted, 0 is assumed.
     * @param granteeAccount string account name of the grantee account
     */
    getGranteePermissions(granteeAccount: string, limit?: number, offset?: number): Promise<PermissionsResponse>;
    /**
     * Gets FIO permissions for the specified grantee account.
     *
     * @param options.limit Number of request to return. If omitted, all requests will be returned.
     * @param options.offset First request from list to return. If omitted, 0 is assumed.
     * @param options.granteeAccount string account name of the grantee account
     */
    getGranteePermissions(options: GetGranteePermissionsOptions): Promise<PermissionsResponse>;
    /**
     * @deprecated
     * Gets FIO permissions for the specified grantor account.
     *
     * @param limit Number of request to return. If omitted, all requests will be returned.
     * @param offset First request from list to return. If omitted, 0 is assumed.
     * @param grantorAccount string account name of the grantor account
     */
    getGrantorPermissions(grantorAccount: string, limit?: number | null, offset?: number | null): Promise<PermissionsResponse>;
    /**
     * Gets FIO permissions for the specified grantor account.
     *
     * @param options.limit Number of request to return. If omitted, all requests will be returned.
     * @param options.offset First request from list to return. If omitted, 0 is assumed.
     * @param options.grantorAccount string account name of the grantor account
     */
    getGrantorPermissions(options: GetGrantorPermissionsOptions): Promise<PermissionsResponse>;
    /**
     * @deprecated
     * Gets FIO permissions for the specified permission name and object name account.
     *
     * @param permissionName string permission name ex register_address_on_domain
     * @param objectName
     * @param limit Number of request to return. If omitted, all requests will be returned.
     * @param offset First request from list to return. If omitted, 0 is assumed.
     */
    getObjectPermissions(permissionName: string, objectName: string, limit?: number | null, offset?: number | null): Promise<PermissionsResponse>;
    /**
     * Gets FIO permissions for the specified permission name and object name account.
     *
     * @param options.permissionName string permission name ex register_address_on_domain
     * @param options.objectName
     * @param options.limit Number of request to return. If omitted, all requests will be returned.
     * @param options.offset First request from list to return. If omitted, 0 is assumed.
     */
    getObjectPermissions(options: GetObjectPermissionsOptions): Promise<PermissionsResponse>;
    /**
     * @deprecated
     * Reject funds request.
     *
     * @param fioRequestId Existing funds requestId
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by [getFee] for correct value.
     * @param technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    rejectFundsRequest(fioRequestId: number, maxFee: number, technologyProviderId?: string | null): Promise<RejectFundsResponse>;
    /**
     * Reject funds request.
     *
     * @param options.fioRequestId Existing funds requestId
     * @param options.maxFee Maximum amount of SUFs the user is willing to pay for fee.
     * Should be preceded by [getFee] for correct value.
     * @param options.technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    rejectFundsRequest(options: RejectFundsRequestOptions): Promise<RejectFundsResponse>;
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
    requestFunds(options: RequestFundsOptions): Promise<RequestFundsResponse>;
    /**
     * @deprecated
     * Retrieves info on locks for this pub key
     *
     * @param fioPublicKey FIO public key.
     */
    getLocks(fioPublicKey: string): Promise<LocksResponse>;
    /**
     * Retrieves info on locks for this pub key
     *
     * @param options.fioPublicKey FIO public key.
     */
    getLocks(options: GetLocksOptions): Promise<LocksResponse>;
    /**
     * @deprecated
     * Retrieves info on account for this actor
     *
     * @param actor FIO account.
     */
    getAccount(actor: string): Promise<AccountResponse>;
    /**
     * Retrieves info on account for this actor
     *
     * @param options.actor FIO account.
     */
    getAccount(options: GetAccountOptions): Promise<AccountResponse>;
    /**
     * @deprecated
     * Checks if a FIO Address or FIO Domain is available for registration.
     *
     * @param fioName FIO Address or FIO Domain to check.
     */
    isAvailable(fioName: string): Promise<AvailabilityResponse>;
    /**
     * Checks if a FIO Address or FIO Domain is available for registration.
     *
     * @param options.fioName FIO Address or FIO Domain to check.
     */
    isAvailable(options: IsAvailableOptions): Promise<AvailabilityResponse>;
    /**
     * @deprecated
     * Retrieves balance of FIO tokens
     *
     * @param fioPublicKey FIO public key.
     */
    getFioBalance(fioPublicKey?: string | null): Promise<BalanceResponse>;
    /**
     * Retrieves balance of FIO tokens
     *
     * @param options.fioPublicKey FIO public key.
     */
    getFioBalance(options: GetFioBalanceOptions): Promise<BalanceResponse>;
    /**
     * @deprecated
     * Returns FIO Addresses and FIO Domains owned by this public key.
     *
     * @param fioPublicKey FIO public key of owner.
     */
    getFioNames(fioPublicKey: string): Promise<FioNamesResponse>;
    /**
     * Returns FIO Addresses and FIO Domains owned by this public key.
     *
     * @param options.fioPublicKey FIO public key of owner.
     */
    getFioNames(options: GetFioNamesOptions): Promise<FioNamesResponse>;
    /**
     * @deprecated
     * Returns FIO Addresses  owned by this public key.
     *
     * @param fioPublicKey FIO public key of owner.
     * @param limit Number of request to return. If omitted, all requests will be returned.
     * @param offset First request from list to return. If omitted, 0 is assumed.
     */
    getFioAddresses(fioPublicKey: string, limit?: number | null, offset?: number | null): Promise<FioAddressesResponse>;
    /**
     * Returns FIO Addresses  owned by this public key.
     *
     * @param options.fioPublicKey FIO public key of owner.
     * @param options.limit Number of request to return. If omitted, all requests will be returned.
     * @param options.offset First request from list to return. If omitted, 0 is assumed.
     */
    getFioAddresses(options: GetFioAddressesOptions): Promise<FioAddressesResponse>;
    /**
     * @deprecated
     * Returns FIO domains  owned by this public key.
     *
     * @param fioPublicKey FIO public key of owner.
     * @param limit Number of request to return. If omitted, all requests will be returned.
     * @param offset First request from list to return. If omitted, 0 is assumed.
     */
    getFioDomains(fioPublicKey: string, limit?: number | null, offset?: number | null): Promise<FioDomainsResponse>;
    /**
     * Returns FIO domains  owned by this public key.
     *
     * @param options.fioPublicKey FIO public key of owner.
     * @param options.limit Number of request to return. If omitted, all requests will be returned.
     * @param options.offset First request from list to return. If omitted, 0 is assumed.
     */
    getFioDomains(options: GetFioDomainsOptions): Promise<FioDomainsResponse>;
    /**
     * Polls for any pending requests sent to public key associated with the FIO SDK instance.
     *
     * @param options.limit Number of request to return. If omitted, all requests will be returned.
     * @param options.offset First request from list to return. If omitted, 0 is assumed.
     * @param options.encryptKeys FIO Public Keys for decrypt content data.
     */
    getPendingFioRequests(options: GetPendingFioRequestsOptions): Promise<PendingFioRequestsDecryptedResponse | undefined>;
    /**
     * Polls for any received requests sent to public key associated with the FIO SDK instance.
     *
     * @param options.limit Number of request to return. If omitted, all requests will be returned.
     * @param options.offset First request from list to return. If omitted, 0 is assumed.
     * @param options.includeEncrypted Set to true if you want to include not encrypted data in return.
     * @param options.encryptKeys FIO Public Keys for decrypt content data.
     */
    getReceivedFioRequests(options: GetReceivedFioRequestsOptions): Promise<ReceivedFioRequestsDecryptedResponse | undefined>;
    /**
     * Polls for any sent requests sent by public key associated with the FIO SDK instance.
     *
     * @param options.limit Number of request to return. If omitted, all requests will be returned.
     * @param options.offset First request from list to return. If omitted, 0 is assumed.
     * @param options.includeEncrypted Set to true if you want to include not encrypted data in return.
     * @param options.encryptKeys FIO Public Keys for decrypt content data.
     */
    getSentFioRequests(options: GetSentFioRequestsOptions): Promise<SentFioRequestsDecryptedResponse | undefined>;
    /**
     * Polls for any cancelled requests sent by public key associated with the FIO SDK instance.
     *
     * @param options.limit Number of request to return. If omitted, all requests will be returned.
     * @param options.offset First request from list to return. If omitted, 0 is assumed.
     * @param options.encryptKeys FIO Public Keys for decrypt content data.
     */
    getCancelledFioRequests(options: GetCancelledFioRequestsOptions): Promise<CancelledFioRequestsDecryptedResponse | undefined>;
    /**
     * @deprecated
     * Returns a token public address for specified token code and FIO Address.
     *
     * @param fioAddress FIO Address for which the token public address is to be returned.
     * @param chainCode Blockchain code for which public address is to be returned.
     * @param tokenCode Token code for which public address is to be returned.
     */
    getPublicAddress(fioAddress: string, chainCode: string, tokenCode: string): Promise<PublicAddressResponse>;
    /**
     * Returns a token public address for specified token code and FIO Address.
     *
     * @param options.fioAddress FIO Address for which the token public address is to be returned.
     * @param options.chainCode Blockchain code for which public address is to be returned.
     * @param options.tokenCode Token code for which public address is to be returned.
     */
    getPublicAddress(options: GetPublicAddressOptions): Promise<PublicAddressResponse>;
    /**
     * @deprecated
     * Returns all public addresses for specified FIO Address.
     *
     * @param fioAddress FIO Address for which the token public address is to be returned.
     * @param limit Number of results to return. If omitted, all results will be returned.
     * @param offset First result from list to return. If omitted, 0 is assumed.
     */
    getPublicAddresses(fioAddress: string, limit?: number | null, offset?: number | null): Promise<PublicAddressesResponse>;
    /**
     * Returns all public addresses for specified FIO Address.
     *
     * @param options.fioAddress FIO Address for which the token public address is to be returned.
     * @param options.limit Number of results to return. If omitted, all results will be returned.
     * @param options.offset First result from list to return. If omitted, 0 is assumed.
     */
    getPublicAddresses(options: GetPublicAddressesOptions): Promise<PublicAddressesResponse>;
    /**
     * @deprecated
     * Returns the FIO token public address for specified FIO Address.
     *
     * @param fioAddress FIO Address for which fio token public address is to be returned.
     */
    getFioPublicAddress(fioAddress: string): Promise<PublicAddressResponse>;
    /**
     * Returns the FIO token public address for specified FIO Address.
     *
     * @param options.fioAddress FIO Address for which fio token public address is to be returned.
     */
    getFioPublicAddress(options: GetFioPublicAddressOptions): Promise<PublicAddressResponse>;
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
    getNfts(options: {
        fioAddress?: string | null;
        chainCode?: string | null;
        contractAddress?: string | null;
        tokenId?: string | null;
        hash?: string | null;
    }, limit?: number | null, offset?: number | null): Promise<NftsResponse>;
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
    getNfts(options: GetNftsOptions): Promise<NftsResponse>;
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
    transferTokens(payeeFioPublicKey: string, amount: number, maxFee: number, technologyProviderId?: string | null): Promise<TransferTokensResponse>;
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
    transferTokens(options: TransferTokensOptions): Promise<TransferTokensResponse>;
    /**
     * @deprecated
     * Compute and return fee amount for specific call and specific user
     *
     * @param fioAddress FIO Address incurring the fee and owned by signer.
     */
    getFeeForTransferLockedTokens(fioAddress: string): Promise<FioFeeResponse>;
    /**
     * Compute and return fee amount for specific call and specific user
     *
     * @param options.fioAddress FIO Address incurring the fee and owned by signer.
     */
    getFeeForTransferLockedTokens(options: GetFeeForTransferLockedTokensOptions): Promise<FioFeeResponse>;
    /**
     * @deprecated
     * Return oracle fees amount
     */
    getOracleFees(publicKey?: string | null): Promise<FioOracleFeesResponse>;
    getOracleFees(options: GetOracleFeesOptions): Promise<FioOracleFeesResponse>;
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
    getFee(endPoint: EndPoint, fioAddress?: string | null): Promise<FioFeeResponse>;
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
    getFee(options: GetFeeOptions): Promise<FioFeeResponse>;
    /**
     * @deprecated
     * Compute and return fee amount for specific call and specific user
     *
     * @param payerFioAddress Payer FIO Address incurring the fee and owned by signer.
     */
    getFeeForRecordObtData(payerFioAddress: string): Promise<FioFeeResponse>;
    /**
     * Compute and return fee amount for specific call and specific user
     *
     * @param options.payerFioAddress Payer FIO Address incurring the fee and owned by signer.
     */
    getFeeForRecordObtData(options: GetFeeForRecordObtDataOptions): Promise<FioFeeResponse>;
    /**
     * @deprecated
     * Compute and return fee amount for specific call and specific user
     *
     * @param payeeFioAddress Payee FIO Address incurring the fee and owned by signer.
     */
    getFeeForNewFundsRequest(payeeFioAddress: string): Promise<FioFeeResponse>;
    /**
     * Compute and return fee amount for specific call and specific user
     *
     * @param options.payeeFioAddress Payee FIO Address incurring the fee and owned by signer.
     */
    getFeeForNewFundsRequest(options: GetFeeForNewFundsRequestOptions): Promise<FioFeeResponse>;
    /**
     * @deprecated
     * Compute and return fee amount for specific call and specific user
     *
     * @param payerFioAddress Payer FIO Address incurring the fee and owned by signer.
     */
    getFeeForRejectFundsRequest(payerFioAddress: string): Promise<FioFeeResponse>;
    /**
     * Compute and return fee amount for specific call and specific user
     *
     * @param options.payerFioAddress Payer FIO Address incurring the fee and owned by signer.
     */
    getFeeForRejectFundsRequest(options: GetFeeForRejectFundsRequestOptions): Promise<FioFeeResponse>;
    /**
     * @deprecated
     * Compute and return fee amount for specific call and specific user
     *
     * @param fioAddress FIO Address incurring the fee and owned by signer.
     */
    getFeeForAddPublicAddress(fioAddress: string): Promise<FioFeeResponse>;
    /**
     * Compute and return fee amount for specific call and specific user
     *
     * @param options.fioAddress FIO Address incurring the fee and owned by signer.
     */
    getFeeForAddPublicAddress(options: GetFeeForAddPublicAddressOptions): Promise<FioFeeResponse>;
    /**
     * @deprecated
     * Compute and return fee amount for specific call and specific user
     *
     * @param fioAddress FIO Address incurring the fee and owned by signer.
     */
    getFeeForCancelFundsRequest(fioAddress: string): Promise<FioFeeResponse>;
    /**
     * Compute and return fee amount for specific call and specific user
     *
     * @param options.fioAddress FIO Address incurring the fee and owned by signer.
     */
    getFeeForCancelFundsRequest(options: GetFeeForCancelFundsRequestOptions): Promise<FioFeeResponse>;
    /**
     * @deprecated
     * Compute and return fee amount for specific call and specific user
     *
     * @param fioAddress FIO Address incurring the fee and owned by signer.
     */
    getFeeForRemovePublicAddresses(fioAddress: string): Promise<FioFeeResponse>;
    /**
     * Compute and return fee amount for specific call and specific user
     *
     * @param options.fioAddress FIO Address incurring the fee and owned by signer.
     */
    getFeeForRemovePublicAddresses(options: GetFeeForRemovePublicAddressesOptions): Promise<FioFeeResponse>;
    /**
     * @deprecated
     * Compute and return fee amount for specific call and specific user
     *
     * @param fioAddress FIO Address incurring the fee and owned by signer.
     */
    getFeeForRemoveAllPublicAddresses(fioAddress: string): Promise<FioFeeResponse>;
    /**
     * Compute and return fee amount for specific call and specific user
     *
     * @param options.fioAddress FIO Address incurring the fee and owned by signer.
     */
    getFeeForRemoveAllPublicAddresses(options: GetFeeForRemoveAllPublicAddressesOptions): Promise<FioFeeResponse>;
    /**
     * @deprecated
     * Compute and return fee amount for specific call and specific user
     *
     * @param fioAddress FIO Address incurring the fee and owned by signer.
     */
    getFeeForBurnFioAddress(fioAddress: string): Promise<FioFeeResponse>;
    /**
     * Compute and return fee amount for specific call and specific user
     *
     * @param options.fioAddress FIO Address incurring the fee and owned by signer.
     */
    getFeeForBurnFioAddress(options: GetFeeForBurnFioAddressOptions): Promise<FioFeeResponse>;
    /**
     * @deprecated
     * Compute and return fee amount for specific call and specific user
     *
     * @param fioAddress FIO Address incurring the fee and owned by signer.
     */
    getFeeForTransferFioAddress(fioAddress: string): Promise<FioFeeResponse>;
    /**
     * Compute and return fee amount for specific call and specific user
     *
     * @param options.fioAddress FIO Address incurring the fee and owned by signer.
     */
    getFeeForTransferFioAddress(options: GetFeeForTransferFioAddressOptions): Promise<FioFeeResponse>;
    /**
     * @deprecated
     * Compute and return fee amount for specific call and specific user
     *
     * @param fioAddress FIO Address incurring the fee and owned by signer.
     */
    getFeeForAddBundledTransactions(fioAddress: string): Promise<FioFeeResponse>;
    /**
     * Compute and return fee amount for specific call and specific user
     *
     * @param options.fioAddress FIO Address incurring the fee and owned by signer.
     */
    getFeeForAddBundledTransactions(options: GetFeeForAddBundledTransactionsOptions): Promise<FioFeeResponse>;
    /**
     * @deprecated
     * Compute and return fee amount for specific call and specific user
     *
     * @param fioAddress FIO Address incurring the fee and owned by signer.
     */
    getFeeForTransferFioDomain(fioAddress: string): Promise<FioFeeResponse>;
    /**
     * Compute and return fee amount for specific call and specific user
     *
     * @param options.fioAddress FIO Address incurring the fee and owned by signer.
     */
    getFeeForTransferFioDomain(options: GetFeeForTransferFioDomainOptions): Promise<FioFeeResponse>;
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
    stakeFioTokens(amount: number, fioAddress?: string | null, maxFee?: number | null, technologyProviderId?: string | null): Promise<TransactionResponse>;
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
    stakeFioTokens(options: StakeFioTokensOptions): Promise<TransactionResponse>;
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
    unStakeFioTokens(amount: number, fioAddress?: string | null, maxFee?: number | null, technologyProviderId?: string | null): Promise<TransactionResponse>;
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
    unStakeFioTokens(options: UnStakeFioTokensOptions): Promise<TransactionResponse>;
    getMultiplier(): number;
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
    pushTransaction(options: PushTransactionOptions): Promise<any>;
    /**
     * @deprecated
     * @description Method to get public key by account name.
     */
    getAccountPubKey(account: string): Promise<GetAccountPubKeyResponse>;
    /**
     * @description Method to get public key by account name.
     */
    getAccountPubKey(options: GetAccountPubKeyOptions): Promise<GetAccountPubKeyResponse>;
    /**
     * @deprecated
     * @description Method returns FIO Public Key that was set for encrypt/decrypt data.
     * By default, it is the same as FIO Handle wallet public key.
     * @param fioAddress FIO public key
     */
    getEncryptKey(fioAddress: string): Promise<GetEncryptKeyResponse>;
    /**
     * @description Method returns FIO Public Key that was set for encrypt/decrypt data.
     * By default, it is the same as FIO Handle wallet public key.
     * @param options.fioAddress FIO public key
     */
    getEncryptKey(options: GetEncryptKeyOptions): Promise<GetEncryptKeyResponse>;
    genericAction<T extends GenericAction | `${GenericAction}`>(action: T, ...args: GenericActions[typeof GenericAction[T]]['options']): GenericActions[typeof GenericAction[T]]['response'];
    /**
     * @ignore
     */
    registerFioNameOnBehalfOfUser(fioName: string, publicKey: string): Promise<any>;
    /**
     * @deprecated
     */
    getAbi(accountName: string): Promise<AbiResponse>;
    getAbi(options: GetAbiOptions): Promise<AbiResponse>;
}
//# sourceMappingURL=FIOSDK.d.ts.map