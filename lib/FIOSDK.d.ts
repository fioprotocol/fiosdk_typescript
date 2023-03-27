/// <reference types="node" />
import { EndPoint } from './entities/EndPoint';
import { LockPeriod } from './entities/LockPeriod';
import { PublicAddress } from './entities/PublicAddress';
import { AccountResponse, AddBundledTransactionsResponse, AddPublicAddressResponse, AvailabilityResponse, BalanceResponse, BurnFioAddressResponse, CancelFundsRequestResponse, CancelledFioRequestResponse, FioAddressesResponse, FioFeeResponse, FioNamesResponse, GetObtDataResponse, LocksResponse, PendingFioRequestsResponse, PublicAddressesResponse, PublicAddressResponse, ReceivedFioRequestsResponse, RecordObtDataResponse, RegisterFioAddressResponse, RegisterFioDomainResponse, RejectFundsResponse, RemoveAllPublicAddressesResponse, RemovePublicAddressesResponse, RenewFioAddressResponse, RenewFioDomainResponse, RequestFundsResponse, SentFioRequestResponse, SetFioDomainVisibilityResponse, TransactionResponse, TransferFioAddressResponse, TransferFioDomainResponse, TransferLockedTokensResponse, TransferTokensResponse } from './entities/responses';
import { EncryptOptions } from './transactions/signed/PushTransaction';
import { Transactions } from './transactions/Transactions';
/**
 * @ignore
 */
declare type FetchJson = (uri: string, opts?: object) => Promise<object>;
export declare class FIOSDK {
    /**
     * @ignore
     */
    static ReactNativeFio: any;
    /**
     * SUFs = Smallest Units of FIO
     */
    static SUFUnit: number;
    /**
     * @ignore
     */
    static createPrivateKey(entropy: Buffer): Promise<any>;
    /**
     * Create a FIO private key.
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
        publicKey: any;
    };
    /**
     * hash a pub key
     *
     * @param fiopubkey FIO private key.
     *
     * @returns FIO account derived from pub key.
     */
    static accountHash(fiopubkey: string): {
        accountnm: string;
    };
    /**
     * Is the Chain Code Valid?
     *
     * @param chainCode
     *
     * @returns Chain Code is Valid
     */
    static isChainCodeValid(chainCode: string): boolean;
    /**
     * Is the Token Code Valid?
     *
     * @param tokenCode
     *
     * @returns Token Code is Valid
     */
    static isTokenCodeValid(tokenCode: string): boolean;
    /**
     * Is the FIO Address Valid?
     *
     * @param fioAddress
     *
     * @returns Fio Address is Valid
     */
    static isFioAddressValid(fioAddress: string): boolean;
    /**
     * Is the FIO Domain Valid?
     *
     * @param fioDomain
     *
     * @returns FIO Domain is Valid
     */
    static isFioDomainValid(fioDomain: string): boolean;
    /**
     * Is the FIO Public Key Valid?
     *
     * @param fioPublicKey
     *
     * @returns FIO Public Key is Valid
     */
    static isFioPublicKeyValid(fioPublicKey: string): boolean;
    /**
     * Is the Public Address Valid?
     *
     * @param publicAddress
     *
     * @returns Public Address is Valid
     */
    static isPublicAddressValid(publicAddress: string): boolean;
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
     * @param suf
     *
     * @returns FIO Token amount
     */
    static SUFToAmount(suf: number): number;
    transactions: Transactions;
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
     * Defines whether SignedTransaction would execute or return prepared transaction
     */
    private returnPreparedTrx;
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
    constructor(privateKey: string, publicKey: string, baseUrl: string, fetchjson: FetchJson, registerMockUrl?: string, technologyProviderId?: string, returnPreparedTrx?: boolean);
    /**
     * Retrieves the FIO public key assigned to the FIOSDK instance.
     */
    getFioPublicKey(): string;
    /**
     * Returns technologyProviderId or default
     */
    getTechnologyProviderId(technologyProviderId: string | null): string;
    /**
     * Set returnPreparedTrx
     */
    setSignedTrxReturnOption(returnPreparedTrx: boolean): void;
    /**
     * Execute prepared transaction.
     *
     * @param endPoint endpoint.
     * @param preparedTrx
     */
    executePreparedTrx(endPoint: string, preparedTrx: object): Promise<any>;
    /**
     * Registers a FIO Address on the FIO blockchain. The owner will be the public key associated with the FIO SDK instance.
     *
     * @param fioAddress FIO Address to register.
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by @ [getFee] for correct value.
     * @param technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    registerFioAddress(fioAddress: string, maxFee: number, technologyProviderId?: string | null): Promise<RegisterFioAddressResponse>;
    /**
     * Registers a Fio Address on behalf of the owner FIO Public key parameter. Owner FIO Public key owns the FIO address
     *
     * @param fioAddress FIO Address to register.
     * @param ownerPublicKey Owner FIO Public Key.
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by @ [getFee] for correct value.
     * @param technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    registerOwnerFioAddress(fioAddress: string, ownerPublicKey: string, maxFee: number, technologyProviderId?: string | null): Promise<RegisterFioAddressResponse>;
    /**
     * Registers a FIO Domain on the FIO blockchain.
     *
     * @param fioDomain FIO Domain to register. The owner will be the public key associated with the FIO SDK instance.
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by @ [getFee] for correct value.
     * @param technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    registerFioDomain(fioDomain: string, maxFee: number, technologyProviderId?: string | null): Promise<RegisterFioDomainResponse>;
    /**
     * Registers a FIO Domain on behalf of the owner FIO Public key parameter. Owner FIO Public key owns the FIO domain.
     *
     * @param fioDomain FIO Domain to register. The owner will be the public key associated with the FIO SDK instance.
     * @param ownerPublicKey Owner FIO Public Key.
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by @ [getFee] for correct value.
     * @param technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    registerOwnerFioDomain(fioDomain: string, ownerPublicKey: string, maxFee: number, technologyProviderId?: string | null): Promise<RegisterFioDomainResponse>;
    /**
     * Burns a FIO Address on the FIO blockchain.
     *
     * @param fioAddress FIO Address to burn. The owner will be the public key associated with the FIO SDK instance.
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by @ [getFee] for correct value.
     * @param technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    burnFioAddress(fioAddress: string, maxFee: number, technologyProviderId?: string | null): Promise<BurnFioAddressResponse>;
    /**
     * Transfers a FIO Domain on the FIO blockchain.
     *
     * @param fioDomain FIO Domain to transfer. The owner will be the public key associated with the FIO SDK instance.
     * @param newOwnerKey FIO Public Key of the new owner.
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by @ [getFee] for correct value.
     * @param technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    transferFioDomain(fioDomain: string, newOwnerKey: string, maxFee: number, technologyProviderId?: string | null): Promise<TransferFioDomainResponse>;
    /**
     * Transfers a FIO Address on the FIO blockchain.
     *
     * @param fioAddress FIO Address to transfer. The owner will be the public key associated with the FIO SDK instance.
     * @param newOwnerKey FIO Public Key of the new owner.
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by @ [getFee] for correct value.
     * @param technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    transferFioAddress(fioAddress: string, newOwnerKey: string, maxFee: number, technologyProviderId?: string | null): Promise<TransferFioAddressResponse>;
    /**
     * Adds bundles of transactions to FIO Address.
     *
     * @param fioAddress FIO Address to transfer. The owner will be the public key associated with the FIO SDK instance.
     * @param bundleSets Number of sets of bundles to add to FIO Address.
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by @ [getFee] for correct value.
     * @param technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    addBundledTransactions(fioAddress: string, bundleSets: number, maxFee: number, technologyProviderId?: string | null): Promise<AddBundledTransactionsResponse>;
    /**
     * Renew a FIO Address on the FIO blockchain.
     *
     * @param fioAddress FIO Address to renew.
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by @ [getFee] for correct value.
     * @param technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    renewFioAddress(fioAddress: string, maxFee: number, technologyProviderId?: string | null): Promise<RenewFioAddressResponse>;
    /**
     * Renew a FIO Domain on the FIO blockchain.
     *
     * @param fioDomain FIO Domain to renew.
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by @ [getFee] for correct value.
     * @param technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    renewFioDomain(fioDomain: string, maxFee: number, technologyProviderId?: string | null): Promise<RenewFioDomainResponse>;
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
    addPublicAddress(fioAddress: string, chainCode: string, tokenCode: string, publicAddress: string, maxFee: number, technologyProviderId?: string | null): Promise<AddPublicAddressResponse>;
    /**
     * This call cancels the specified fio funds request..
     *
     * @param fioRequestID The id of the request.
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by /get_fee for correct value.
     * @param technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    cancelFundsRequest(fioRequestId: number, maxFee: number, technologyProviderId?: string | null): Promise<CancelFundsRequestResponse>;
    /**
     * This call allows a any number of public addresses matching the blockchain code, the token code and the public address to be removed from the FIO Address.
     *
     * @param fioAddress FIO Address which will be mapped to public address.
     * @param publicAddresses a list of publicAddresses, each containing chain_code, token_code, and public_address.
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by /get_fee for correct value.
     * @param technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    removePublicAddresses(fioAddress: string, publicAddresses: PublicAddress[], maxFee: number, technologyProviderId?: string | null): Promise<RemovePublicAddressesResponse>;
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
    transferLockedTokens(payeePublicKey: string, canVote: boolean, periods: LockPeriod[], amount: number, maxFee: number, technologyProviderId?: string | null): Promise<TransferLockedTokensResponse>;
    /**
     * This call allows a user to remove all addresses from the specified FIO Address, all addresses except the FIO address will be removed.
     *
     * @param fioAddress FIO Address which will be mapped to public address.
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by /get_fee for correct value.
     * @param technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    removeAllPublicAddresses(fioAddress: string, maxFee: number, technologyProviderId?: string | null): Promise<RemoveAllPublicAddressesResponse>;
    /**
     * This call allows a public addresses of the specific blockchain type to be added to the FIO Address.
     *
     * @param fioAddress FIO Address which will be mapped to public addresses.
     * @param publicAddresses Array of public addresses to be added to the FIO Address for the specified token.
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by /get_fee for correct value.
     * @param technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    addPublicAddresses(fioAddress: string, publicAddresses: PublicAddress[], maxFee: number, technologyProviderId?: string | null): Promise<AddPublicAddressResponse>;
    /**
     * By default all FIO Domains are non-public, meaning only the owner can register FIO Addresses on that domain. Setting them to public allows anyone to register a FIO Address on that domain.
     *
     * @param fioDomain FIO Domain to change visibility.
     * @param isPublic 1 - allows anyone to register FIO Address, 0 - only owner of domain can register FIO Address.
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by /get_fee for correct value.
     * @param technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    setFioDomainVisibility(fioDomain: string, isPublic: boolean, maxFee: number, technologyProviderId?: string | null): Promise<SetFioDomainVisibilityResponse>;
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
    recordObtData(fioRequestId: number | null, payerFioAddress: string, payeeFioAddress: string, payerTokenPublicAddress: string, payeeTokenPublicAddress: string, amount: number, chainCode: string, tokenCode: string, status: string, obtId: string, maxFee: number, technologyProviderId?: string | null, payeeFioPublicKey?: string | null, memo?: string | null, hash?: string | null, offLineUrl?: string | null): Promise<RecordObtDataResponse>;
    /**
     * Retrives OBT metadata data stored using record send.
     *
     * @param limit Number of request to return. If omitted, all requests will be returned.
     * @param offset First request from list to return. If omitted, 0 is assumed.
     * @param tokenCode Code of the token to filter results
     */
    getObtData(limit?: number, offset?: number, tokenCode?: string): Promise<GetObtDataResponse>;
    /**
     * Reject funds request.
     *
     * @param fioRequestId Existing funds request Id
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by [getFee] for correct value.
     * @param technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    rejectFundsRequest(fioRequestId: number, maxFee: number, technologyProviderId?: string | null): Promise<RejectFundsResponse>;
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
    requestFunds(payerFioAddress: string, payeeFioAddress: string, payeeTokenPublicAddress: string, amount: number, chainCode: string, tokenCode: string, memo: string, maxFee: number, payerFioPublicKey?: string | null, technologyProviderId?: string | null, hash?: string, offlineUrl?: string): Promise<RequestFundsResponse>;
    /**
     * Retrieves info on locks for this pub key
     *
     * @param fioPublicKey FIO public key.
     */
    getLocks(fioPublicKey: string): Promise<LocksResponse>;
    getAccount(actor: string): Promise<AccountResponse>;
    /**
     * Checks if a FIO Address or FIO Domain is available for registration.
     *
     * @param fioName FIO Address or FIO Domain to check.
     */
    isAvailable(fioName: string): Promise<AvailabilityResponse>;
    /**
     * Retrieves balance of FIO tokens
     *
     * @param fioPublicKey FIO public key.
     */
    getFioBalance(fioPublicKey?: string): Promise<BalanceResponse>;
    /**
     * Returns FIO Addresses and FIO Domains owned by this public key.
     *
     * @param fioPublicKey FIO public key of owner.
     */
    getFioNames(fioPublicKey: string): Promise<FioNamesResponse>;
    /**
     * Returns FIO Addresses  owned by this public key.
     *
     * @param fioPublicKey FIO public key of owner.
     * @param limit Number of request to return. If omitted, all requests will be returned.
     * @param offset First request from list to return. If omitted, 0 is assumed.
     */
    getFioAddresses(fioPublicKey: string, limit?: number, offset?: number): Promise<FioAddressesResponse>;
    /**
     * Returns FIO domains  owned by this public key.
     *
     * @param fioPublicKey FIO public key of owner.
     * @param limit Number of request to return. If omitted, all requests will be returned.
     * @param offset First request from list to return. If omitted, 0 is assumed.
     */
    getFioDomains(fioPublicKey: string, limit?: number, offset?: number): Promise<FioAddressesResponse>;
    /**
     * Polls for any pending requests sent to public key associated with the FIO SDK instance.
     *
     * @param limit Number of request to return. If omitted, all requests will be returned.
     * @param offset First request from list to return. If omitted, 0 is assumed.
     */
    getPendingFioRequests(limit?: number, offset?: number): Promise<PendingFioRequestsResponse>;
    /**
     * Polls for any received requests sent to public key associated with the FIO SDK instance.
     *
     * @param limit Number of request to return. If omitted, all requests will be returned.
     * @param offset First request from list to return. If omitted, 0 is assumed.
     * @param includeEncrypted Set to true if you want to include not encrypted data in return.
     */
    getReceivedFioRequests(limit?: number, offset?: number, includeEncrypted?: boolean): Promise<ReceivedFioRequestsResponse>;
    /**
     * Polls for any sent requests sent by public key associated with the FIO SDK instance.
     *
     * @param limit Number of request to return. If omitted, all requests will be returned.
     * @param offset First request from list to return. If omitted, 0 is assumed.
     * @param includeEncrypted Set to true if you want to include not encrypted data in return.
     */
    getSentFioRequests(limit?: number, offset?: number, includeEncrypted?: boolean): Promise<SentFioRequestResponse>;
    /**
     * Polls for any cancelled requests sent by public key associated with the FIO SDK instance.
     *
     * @param limit Number of request to return. If omitted, all requests will be returned.
     * @param offset First request from list to return. If omitted, 0 is assumed.
     */
    getCancelledFioRequests(limit?: number, offset?: number): Promise<CancelledFioRequestResponse>;
    /**
     * Returns a token public address for specified token code and FIO Address.
     *
     * @param fioAddress FIO Address for which the token public address is to be returned.
     * @param chainCode Blockchain code for which public address is to be returned.
     * @param tokenCode Token code for which public address is to be returned.
     */
    getPublicAddress(fioAddress: string, chainCode: string, tokenCode: string): Promise<PublicAddressResponse>;
    /**
     * Returns all public addresses for specified FIO Address.
     *
     * @param fioAddress FIO Address for which the token public address is to be returned.
     * @param limit Number of results to return. If omitted, all results will be returned.
     * @param offset First result from list to return. If omitted, 0 is assumed.
     */
    getPublicAddresses(fioAddress: string, limit?: number, offset?: number): Promise<PublicAddressesResponse>;
    /**
     * Returns the FIO token public address for specified FIO Address.
     *
     * @param fioAddress FIO Address for which fio token public address is to be returned.
     */
    getFioPublicAddress(fioAddress: string): Promise<PublicAddressResponse>;
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
    getNfts(options: {
        fioAddress?: string;
        chainCode?: string;
        contractAddress?: string;
        tokenId?: string;
        hash?: string;
    }, limit?: number, offset?: number): Promise<PublicAddressesResponse>;
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
    transferTokens(payeeFioPublicKey: string, amount: number, maxFee: number, technologyProviderId?: string | null): Promise<TransferTokensResponse>;
    /**
     * Compute and return fee amount for specific call and specific user
     *
     * @param fioAddress FIO Address incurring the fee and owned by signer.
     */
    getFeeForTransferLockedTokens(fioAddress: string): Promise<FioFeeResponse>;
    /**
     * Return oracle fees amount
     */
    getOracleFees(publicKey?: string): Promise<FioFeeResponse>;
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
    getFee(endPoint: EndPoint, fioAddress?: string): Promise<FioFeeResponse>;
    /**
     * Compute and return fee amount for specific call and specific user
     *
     * @param payerFioAddress, Payer FIO Address incurring the fee and owned by signer.
     */
    getFeeForRecordObtData(payerFioAddress: string): Promise<FioFeeResponse>;
    /**
     * Compute and return fee amount for specific call and specific user
     *
     * @param payeeFioAddress Payee FIO Address incurring the fee and owned by signer.
     */
    getFeeForNewFundsRequest(payeeFioAddress: string): Promise<FioFeeResponse>;
    /**
     * Compute and return fee amount for specific call and specific user
     *
     * @param payerFioAddress Payer FIO Address incurring the fee and owned by signer.
     */
    getFeeForRejectFundsRequest(payerFioAddress: string): Promise<FioFeeResponse>;
    /**
     * Compute and return fee amount for specific call and specific user
     *
     * @param fioAddress FIO Address incurring the fee and owned by signer.
     */
    getFeeForAddPublicAddress(fioAddress: string): Promise<FioFeeResponse>;
    /**
     * Compute and return fee amount for specific call and specific user
     *
     * @param fioAddress FIO Address incurring the fee and owned by signer.
     */
    getFeeForCancelFundsRequest(fioAddress: string): Promise<FioFeeResponse>;
    /**
     * Compute and return fee amount for specific call and specific user
     *
     * @param fioAddress FIO Address incurring the fee and owned by signer.
     */
    getFeeForRemovePublicAddresses(fioAddress: string): Promise<FioFeeResponse>;
    /**
     * Compute and return fee amount for specific call and specific user
     *
     * @param fioAddress FIO Address incurring the fee and owned by signer.
     */
    getFeeForRemoveAllPublicAddresses(fioAddress: string): Promise<FioFeeResponse>;
    /**
     * Compute and return fee amount for specific call and specific user
     *
     * @param fioAddress FIO Address incurring the fee and owned by signer.
     */
    getFeeForBurnFioAddress(fioAddress: string): Promise<FioFeeResponse>;
    /**
     * Compute and return fee amount for specific call and specific user
     *
     * @param fioAddress FIO Address incurring the fee and owned by signer.
     */
    getFeeForTransferFioAddress(fioAddress: string): Promise<FioFeeResponse>;
    /**
     * Compute and return fee amount for specific call and specific user
     *
     * @param fioAddress FIO Address incurring the fee and owned by signer.
     */
    getFeeForAddBundledTransactions(fioAddress: string): Promise<FioFeeResponse>;
    /**
     * Compute and return fee amount for specific call and specific user
     *
     * @param fioAddress FIO Address incurring the fee and owned by signer.
     */
    getFeeForTransferFioDomain(fioAddress: string): Promise<FioFeeResponse>;
    /**
     * @ignore
     */
    registerFioNameOnBehalfOfUser(fioName: string, publicKey: string): Promise<any>;
    /**
     * Stake FIO Tokens.
     *
     * @param amount Amount of SUFs to stake.
     * @param fioAddress FIO Address if using bundled transactions to pay. May be left empty if paying a fee instead.
     * @param fee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by /get_fee for correct value.
     * @param technologyProviderId FIO Address of the entity which generates this transaction. TPID rewards will be paid to this address. Set to empty if not known.
     */
    stakeFioTokens(amount: number, fioAddress?: string, fee?: number, technologyProviderId?: string | null): Promise<TransactionResponse>;
    /**
     * Unstake FIO Tokens.
     *
     * @param amount Amount of SUFs to unstake.
     * @param fioAddress FIO Address if using bundled transactions to pay. May be left empty if paying a fee instead.
     * @param fee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by /get_fee for correct value.
     * @param technologyProviderId FIO Address of the entity which generates this transaction. TPID rewards will be paid to this address. Set to empty if not known.
     */
    unStakeFioTokens(amount: number, fioAddress?: string, fee?: number, technologyProviderId?: string | null): Promise<TransactionResponse>;
    /**
     * @ignore
     */
    getMultiplier(): number;
    /**
     * Allows advance user to send their own content directly to FIO contracts
     *
     * @param account Account name
     * @param action Name of action
     * @param data JSON object with params for action
     * @param encryptOptions JSON object with params for encryption
     */
    pushTransaction(account: string, action: string, data: any, encryptOptions?: EncryptOptions): Promise<any>;
    /**
     * @ignore
     */
    genericAction(action: string, params: any): any;
    /**
     * @ignore
     */
    private getAbi;
}
export {};
//# sourceMappingURL=FIOSDK.d.ts.map