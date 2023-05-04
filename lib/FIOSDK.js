"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FIOSDK = void 0;
const fiojs_1 = require("@fioprotocol/fiojs");
const EndPoint_1 = require("./entities/EndPoint");
const ValidationError_1 = require("./entities/ValidationError");
const queries = require("./transactions/queries");
const SignedTransactions = require("./transactions/signed");
const MockRegisterFioName_1 = require("./transactions/signed/MockRegisterFioName");
const SignedTransaction_1 = require("./transactions/signed/SignedTransaction");
const Transactions_1 = require("./transactions/Transactions");
const constants_1 = require("./utils/constants");
const validation_1 = require("./utils/validation");
/**
 * @ignore
 */
// tslint:disable-next-line:no-var-requires
const { Ecc } = require('@fioprotocol/fiojs');
class FIOSDK {
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
    constructor(privateKey, publicKey, apiUrls, fetchjson, registerMockUrl = '', technologyProviderId = '', returnPreparedTrx = false) {
        /**
         * Defines whether SignedTransaction would execute or return prepared transaction
         */
        this.returnPreparedTrx = false;
        this.transactions = new Transactions_1.Transactions();
        Transactions_1.Transactions.baseUrls = Array.isArray(apiUrls) ? apiUrls : [apiUrls];
        Transactions_1.Transactions.FioProvider = fiojs_1.Fio;
        Transactions_1.Transactions.fetchJson = fetchjson;
        this.registerMockUrl = registerMockUrl;
        this.privateKey = privateKey;
        this.publicKey = publicKey;
        this.technologyProviderId = technologyProviderId;
        this.returnPreparedTrx = returnPreparedTrx;
        for (const accountName of constants_1.Constants.rawAbiAccountName) {
            if (!Transactions_1.Transactions.abiMap.get(accountName)) {
                this.getAbi(accountName)
                    .then((response) => {
                    Transactions_1.Transactions.abiMap.set(response.account_name, response);
                })
                    .catch((error) => {
                    throw error;
                });
            }
        }
    }
    /**
     * @ignore
     */
    static createPrivateKey(entropy) {
        return __awaiter(this, void 0, void 0, function* () {
            const bip39 = require('bip39');
            const mnemonic = bip39.entropyToMnemonic(entropy);
            return yield FIOSDK.createPrivateKeyMnemonic(mnemonic);
        });
    }
    /**
     * Create a FIO private key.
     *
     * @param mnemonic mnemonic used to generate a random unique private key.
     * @example real flame win provide layer trigger soda erode upset rate beef wrist fame design merit
     *
     * @returns New FIO private key
     */
    static createPrivateKeyMnemonic(mnemonic) {
        return __awaiter(this, void 0, void 0, function* () {
            const hdkey = require('hdkey');
            const wif = require('wif');
            const bip39 = require('bip39');
            const seedBytes = yield bip39.mnemonicToSeed(mnemonic);
            const seed = yield seedBytes.toString('hex');
            const master = hdkey.fromMasterSeed(new Buffer(seed, 'hex'));
            const node = master.derive('m/44\'/235\'/0\'/0/0');
            const fioKey = wif.encode(128, node._privateKey, false);
            return { fioKey, mnemonic };
        });
    }
    /**
     * Create a FIO public key.
     *
     * @param fioPrivateKey FIO private key.
     *
     * @returns FIO public key derived from the FIO private key.
     */
    static derivedPublicKey(fioPrivateKey) {
        const publicKey = Ecc.privateToPublic(fioPrivateKey);
        return { publicKey };
    }
    /**
     * hash a pub key
     *
     * @param fiopubkey FIO private key.
     *
     * @returns FIO account derived from pub key.
     */
    static accountHash(fiopubkey) {
        const accountnm = fiojs_1.Fio.accountHash(fiopubkey);
        return { accountnm };
    }
    /**
     * Is the Chain Code Valid?
     *
     * @param chainCode
     *
     * @returns Chain Code is Valid
     */
    static isChainCodeValid(chainCode) {
        const validation = (0, validation_1.validate)({ chainCode }, { chainCode: validation_1.allRules.chain });
        if (!validation.isValid) {
            throw new ValidationError_1.ValidationError(validation.errors, `Validation error`);
        }
        return true;
    }
    /**
     * Is the Token Code Valid?
     *
     * @param tokenCode
     *
     * @returns Token Code is Valid
     */
    static isTokenCodeValid(tokenCode) {
        const validation = (0, validation_1.validate)({ tokenCode }, { tokenCode: validation_1.allRules.chain });
        if (!validation.isValid) {
            throw new ValidationError_1.ValidationError(validation.errors);
        }
        return true;
    }
    /**
     * Is the FIO Address Valid?
     *
     * @param fioAddress
     *
     * @returns Fio Address is Valid
     */
    static isFioAddressValid(fioAddress) {
        const validation = (0, validation_1.validate)({ fioAddress }, { fioAddress: validation_1.allRules.fioAddress });
        if (!validation.isValid) {
            throw new ValidationError_1.ValidationError(validation.errors);
        }
        return true;
    }
    /**
     * Is the FIO Domain Valid?
     *
     * @param fioDomain
     *
     * @returns FIO Domain is Valid
     */
    static isFioDomainValid(fioDomain) {
        const validation = (0, validation_1.validate)({ fioDomain }, { fioDomain: validation_1.allRules.fioDomain });
        if (!validation.isValid) {
            throw new ValidationError_1.ValidationError(validation.errors);
        }
        return true;
    }
    /**
     * Is the FIO Public Key Valid?
     *
     * @param fioPublicKey
     *
     * @returns FIO Public Key is Valid
     */
    static isFioPublicKeyValid(fioPublicKey) {
        const validation = (0, validation_1.validate)({ fioPublicKey }, { fioPublicKey: validation_1.allRules.fioPublicKey });
        if (!validation.isValid) {
            throw new ValidationError_1.ValidationError(validation.errors);
        }
        return true;
    }
    /**
     * Is the Public Address Valid?
     *
     * @param publicAddress
     *
     * @returns Public Address is Valid
     */
    static isPublicAddressValid(publicAddress) {
        const validation = (0, validation_1.validate)({ publicAddress }, { publicAddress: validation_1.allRules.nativeBlockchainPublicAddress });
        if (!validation.isValid) {
            throw new ValidationError_1.ValidationError(validation.errors);
        }
        return true;
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
    static amountToSUF(amount) {
        // get integer part
        const floor = Math.floor(amount);
        const tempResult = floor * this.SUFUnit;
        // get remainder
        const remainder = Number((amount % 1).toFixed(9));
        const remainderResult = remainder * (this.SUFUnit);
        const floorRemainder = Math.floor(remainderResult);
        // add integer and remainder
        return tempResult + floorRemainder;
    }
    /**
     * Convert FIO SUFs to a FIO Token amount
     *
     * @param suf
     *
     * @returns FIO Token amount
     */
    static SUFToAmount(suf) {
        return parseInt(`${suf}`, 10) / this.SUFUnit;
    }
    /**
     * Retrieves the FIO public key assigned to the FIOSDK instance.
     */
    getFioPublicKey() {
        return this.publicKey;
    }
    /**
     * Returns technologyProviderId or default
     */
    getTechnologyProviderId(technologyProviderId) {
        return technologyProviderId !== null ? technologyProviderId : this.technologyProviderId;
    }
    /**
     * Set returnPreparedTrx
     */
    setSignedTrxReturnOption(returnPreparedTrx) {
        this.returnPreparedTrx = returnPreparedTrx;
    }
    /**
     * Set transactions baseUrls
     */
    setApiUrls(apiUrls) {
        Transactions_1.Transactions.baseUrls = apiUrls;
    }
    /**
     * Execute prepared transaction.
     *
     * @param endPoint endpoint.
     * @param preparedTrx
     */
    executePreparedTrx(endPoint, preparedTrx) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.transactions.multicastServers(`chain/${endPoint}`, JSON.stringify(preparedTrx));
            return SignedTransaction_1.SignedTransaction.prepareResponse(response, true);
        });
    }
    /**
     * Registers a FIO Address on the FIO blockchain. The owner will be the public key associated with the FIO SDK instance.
     *
     * @param fioAddress FIO Address to register.
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by @ [getFee] for correct value.
     * @param technologyProviderId FIO Address of the wallet which generates this transaction.
     * @param expirationOffset Expiration time offset for this transaction in seconds. Default is 180 seconds. Increasing number of seconds gives transaction more lifetime term.
     */
    registerFioAddress(fioAddress, maxFee, technologyProviderId = null, expirationOffset) {
        const registerFioAddress = new SignedTransactions.RegisterFioAddress(fioAddress, null, maxFee, this.getTechnologyProviderId(technologyProviderId));
        return registerFioAddress.execute(this.privateKey, this.publicKey, this.returnPreparedTrx, expirationOffset);
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
    registerOwnerFioAddress(fioAddress, ownerPublicKey, maxFee, technologyProviderId = null, expirationOffset) {
        const registerFioAddress = new SignedTransactions.RegisterFioAddress(fioAddress, ownerPublicKey, maxFee, this.getTechnologyProviderId(technologyProviderId));
        return registerFioAddress.execute(this.privateKey, this.publicKey, this.returnPreparedTrx, expirationOffset);
    }
    /**
     * Registers a FIO Domain on the FIO blockchain.
     *
     * @param fioDomain FIO Domain to register. The owner will be the public key associated with the FIO SDK instance.
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by @ [getFee] for correct value.
     * @param technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    registerFioDomain(fioDomain, maxFee, technologyProviderId = null) {
        const registerFioDomain = new SignedTransactions.RegisterFioDomain(fioDomain, null, maxFee, this.getTechnologyProviderId(technologyProviderId));
        return registerFioDomain.execute(this.privateKey, this.publicKey, this.returnPreparedTrx);
    }
    /**
     * Registers a FIO Domain on behalf of the owner FIO Public key parameter. Owner FIO Public key owns the FIO domain.
     *
     * @param fioDomain FIO Domain to register. The owner will be the public key associated with the FIO SDK instance.
     * @param ownerPublicKey Owner FIO Public Key.
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by @ [getFee] for correct value.
     * @param technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    registerOwnerFioDomain(fioDomain, ownerPublicKey, maxFee, technologyProviderId = null) {
        const registerFioDomain = new SignedTransactions.RegisterFioDomain(fioDomain, ownerPublicKey, maxFee, this.getTechnologyProviderId(technologyProviderId));
        return registerFioDomain.execute(this.privateKey, this.publicKey, this.returnPreparedTrx);
    }
    /**
     * Burns a FIO Address on the FIO blockchain.
     *
     * @param fioAddress FIO Address to burn. The owner will be the public key associated with the FIO SDK instance.
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by @ [getFee] for correct value.
     * @param technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    burnFioAddress(fioAddress, maxFee, technologyProviderId = null) {
        const burnFioAddress = new SignedTransactions.BurnFioAddress(fioAddress, maxFee, this.getTechnologyProviderId(technologyProviderId));
        return burnFioAddress.execute(this.privateKey, this.publicKey, this.returnPreparedTrx);
    }
    /**
     * Transfers a FIO Domain on the FIO blockchain.
     *
     * @param fioDomain FIO Domain to transfer. The owner will be the public key associated with the FIO SDK instance.
     * @param newOwnerKey FIO Public Key of the new owner.
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by @ [getFee] for correct value.
     * @param technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    transferFioDomain(fioDomain, newOwnerKey, maxFee, technologyProviderId = null) {
        const transferFioDomain = new SignedTransactions.TransferFioDomain(fioDomain, newOwnerKey, maxFee, this.getTechnologyProviderId(technologyProviderId));
        return transferFioDomain.execute(this.privateKey, this.publicKey, this.returnPreparedTrx);
    }
    /**
     * Transfers a FIO Address on the FIO blockchain.
     *
     * @param fioAddress FIO Address to transfer. The owner will be the public key associated with the FIO SDK instance.
     * @param newOwnerKey FIO Public Key of the new owner.
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by @ [getFee] for correct value.
     * @param technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    transferFioAddress(fioAddress, newOwnerKey, maxFee, technologyProviderId = null) {
        const transferFioAddress = new SignedTransactions.TransferFioAddress(fioAddress, newOwnerKey, maxFee, this.getTechnologyProviderId(technologyProviderId));
        return transferFioAddress.execute(this.privateKey, this.publicKey, this.returnPreparedTrx);
    }
    /**
     * Adds bundles of transactions to FIO Address.
     *
     * @param fioAddress FIO Address to transfer. The owner will be the public key associated with the FIO SDK instance.
     * @param bundleSets Number of sets of bundles to add to FIO Address.
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by @ [getFee] for correct value.
     * @param technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    addBundledTransactions(fioAddress, bundleSets, maxFee, technologyProviderId = null) {
        const addBundledTransactions = new SignedTransactions.AddBundledTransactions(fioAddress, bundleSets, maxFee, this.getTechnologyProviderId(technologyProviderId));
        return addBundledTransactions.execute(this.privateKey, this.publicKey, this.returnPreparedTrx);
    }
    /**
     * Renew a FIO Address on the FIO blockchain.
     *
     * @param fioAddress FIO Address to renew.
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by @ [getFee] for correct value.
     * @param technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    renewFioAddress(fioAddress, maxFee, technologyProviderId = null) {
        const renewFioAddress = new SignedTransactions.RenewFioAddress(fioAddress, maxFee, this.getTechnologyProviderId(technologyProviderId));
        return renewFioAddress.execute(this.privateKey, this.publicKey, this.returnPreparedTrx);
    }
    /**
     * Renew a FIO Domain on the FIO blockchain.
     *
     * @param fioDomain FIO Domain to renew.
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by @ [getFee] for correct value.
     * @param technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    renewFioDomain(fioDomain, maxFee, technologyProviderId = null) {
        const renewFioDomain = new SignedTransactions.RenewFioDomain(fioDomain, maxFee, this.getTechnologyProviderId(technologyProviderId));
        return renewFioDomain.execute(this.privateKey, this.publicKey, this.returnPreparedTrx);
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
    addPublicAddress(fioAddress, chainCode, tokenCode, publicAddress, maxFee, technologyProviderId = null) {
        const addPublicAddress = new SignedTransactions.AddPublicAddress(fioAddress, [{
                chain_code: chainCode,
                token_code: tokenCode,
                public_address: publicAddress,
            }], maxFee, this.getTechnologyProviderId(technologyProviderId));
        return addPublicAddress.execute(this.privateKey, this.publicKey, this.returnPreparedTrx);
    }
    /**
     * This call cancels the specified fio funds request..
     *
     * @param fioRequestID The id of the request.
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by /get_fee for correct value.
     * @param technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    cancelFundsRequest(fioRequestId, maxFee, technologyProviderId = null) {
        const cancelFundsRequest = new SignedTransactions.CancelFundsRequest(fioRequestId, maxFee, this.getTechnologyProviderId(technologyProviderId));
        return cancelFundsRequest.execute(this.privateKey, this.publicKey, this.returnPreparedTrx);
    }
    /**
     * This call allows a any number of public addresses matching the blockchain code, the token code and the public address to be removed from the FIO Address.
     *
     * @param fioAddress FIO Address which will be mapped to public address.
     * @param publicAddresses a list of publicAddresses, each containing chain_code, token_code, and public_address.
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by /get_fee for correct value.
     * @param technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    removePublicAddresses(fioAddress, publicAddresses, maxFee, technologyProviderId = null) {
        const removePublicAddresses = new SignedTransactions.RemovePublicAddresses(fioAddress, publicAddresses, maxFee, this.getTechnologyProviderId(technologyProviderId));
        return removePublicAddresses.execute(this.privateKey, this.publicKey, this.returnPreparedTrx);
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
    transferLockedTokens(payeePublicKey, canVote, periods, amount, maxFee, technologyProviderId = null) {
        const transferLockedTokens = new SignedTransactions.TransferLockedTokens(payeePublicKey, canVote, periods, amount, maxFee, this.getTechnologyProviderId(technologyProviderId));
        return transferLockedTokens.execute(this.privateKey, this.publicKey);
    }
    /**
     * This call allows a user to remove all addresses from the specified FIO Address, all addresses except the FIO address will be removed.
     *
     * @param fioAddress FIO Address which will be mapped to public address.
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by /get_fee for correct value.
     * @param technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    removeAllPublicAddresses(fioAddress, maxFee, technologyProviderId = null) {
        const removeAllPublicAddresses = new SignedTransactions.RemoveAllPublicAddresses(fioAddress, maxFee, this.getTechnologyProviderId(technologyProviderId));
        return removeAllPublicAddresses.execute(this.privateKey, this.publicKey, this.returnPreparedTrx);
    }
    /**
     * This call allows a public addresses of the specific blockchain type to be added to the FIO Address.
     *
     * @param fioAddress FIO Address which will be mapped to public addresses.
     * @param publicAddresses Array of public addresses to be added to the FIO Address for the specified token.
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by /get_fee for correct value.
     * @param technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    addPublicAddresses(fioAddress, publicAddresses, maxFee, technologyProviderId = null) {
        const addPublicAddress = new SignedTransactions.AddPublicAddress(fioAddress, publicAddresses, maxFee, this.getTechnologyProviderId(technologyProviderId));
        return addPublicAddress.execute(this.privateKey, this.publicKey, this.returnPreparedTrx);
    }
    /**
     * By default all FIO Domains are non-public, meaning only the owner can register FIO Addresses on that domain. Setting them to public allows anyone to register a FIO Address on that domain.
     *
     * @param fioDomain FIO Domain to change visibility.
     * @param isPublic 1 - allows anyone to register FIO Address, 0 - only owner of domain can register FIO Address.
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by /get_fee for correct value.
     * @param technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    setFioDomainVisibility(fioDomain, isPublic, maxFee, technologyProviderId = null) {
        const SetFioDomainVisibility = new SignedTransactions.SetFioDomainVisibility(fioDomain, isPublic, maxFee, this.getTechnologyProviderId(technologyProviderId));
        return SetFioDomainVisibility.execute(this.privateKey, this.publicKey, this.returnPreparedTrx);
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
    recordObtData(fioRequestId, payerFioAddress, payeeFioAddress, payerTokenPublicAddress, payeeTokenPublicAddress, amount, chainCode, tokenCode, status, obtId, maxFee, technologyProviderId = null, payeeFioPublicKey = null, memo = null, hash = null, offLineUrl = null) {
        return __awaiter(this, void 0, void 0, function* () {
            let payeeKey = { public_address: '' };
            if (!payeeFioPublicKey && typeof payeeFioPublicKey !== 'string') {
                payeeKey = yield this.getFioPublicAddress(payeeFioAddress);
            }
            else {
                payeeKey.public_address = payeeFioPublicKey;
            }
            const recordObtData = new SignedTransactions.RecordObtData(fioRequestId, payerFioAddress, payeeFioAddress, payerTokenPublicAddress, payeeTokenPublicAddress, amount, chainCode, tokenCode, obtId, maxFee, status, this.getTechnologyProviderId(technologyProviderId), payeeKey.public_address, memo, hash, offLineUrl);
            return recordObtData.execute(this.privateKey, this.publicKey, this.returnPreparedTrx);
        });
    }
    /**
     * Retrives OBT metadata data stored using record send.
     *
     * @param limit Number of request to return. If omitted, all requests will be returned.
     * @param offset First request from list to return. If omitted, 0 is assumed.
     * @param tokenCode Code of the token to filter results
     */
    getObtData(limit, offset, tokenCode) {
        const getObtDataRequest = new queries.GetObtData(this.publicKey, limit, offset, tokenCode);
        return getObtDataRequest.execute(this.publicKey, this.privateKey);
    }
    /**
     * Gets FIO permissions for the specified grantee account.
     *
     * @param limit Number of request to return. If omitted, all requests will be returned.
     * @param offset First request from list to return. If omitted, 0 is assumed.
     * @param granteeAccount string account name of the grantee account
     */
    getGranteePermissions(granteeAccount, limit, offset) {
        const getGranteePermissions = new queries.GetGranteePermissions(granteeAccount, limit, offset);
        return getGranteePermissions.execute(this.publicKey, this.privateKey);
    }
    /**
     * Gets FIO permissions for the specified grantor account.
     *
     * @param limit Number of request to return. If omitted, all requests will be returned.
     * @param offset First request from list to return. If omitted, 0 is assumed.
     * @param grantorAccount string account name of the grantor account
     */
    getGrantorPermissions(grantorAccount, limit, offset) {
        const getGrantorPermissions = new queries.GetGrantorPermissions(grantorAccount, limit, offset);
        return getGrantorPermissions.execute(this.publicKey, this.privateKey);
    }
    /**
     * Gets FIO permissions for the specified permission name and object name account.
     *
     * @param limit Number of request to return. If omitted, all requests will be returned.
     * @param offset First request from list to return. If omitted, 0 is assumed.
     * @param permissionName string permission name ex register_address_on_domain
     */
    getObjectPermissions(permissionName, objectName, limit, offset) {
        const getObjectPermissions = new queries.GetObjectPermissions(permissionName, objectName, limit, offset);
        return getObjectPermissions.execute(this.publicKey, this.privateKey);
    }
    /**
     * Reject funds request.
     *
     * @param fioRequestId Existing funds request Id
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by [getFee] for correct value.
     * @param technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    rejectFundsRequest(fioRequestId, maxFee, technologyProviderId = null) {
        const rejectFundsRequest = new SignedTransactions.RejectFundsRequest(fioRequestId, maxFee, this.getTechnologyProviderId(technologyProviderId));
        return rejectFundsRequest.execute(this.privateKey, this.publicKey, this.returnPreparedTrx);
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
    requestFunds(payerFioAddress, payeeFioAddress, payeeTokenPublicAddress, amount, chainCode, tokenCode, memo, maxFee, payerFioPublicKey = null, technologyProviderId = null, hash, offlineUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            let payerKey = { public_address: '' };
            if (!payerFioPublicKey && typeof payerFioPublicKey !== 'string') {
                payerKey = yield this.getFioPublicAddress(payerFioAddress);
            }
            else {
                payerKey.public_address = payerFioPublicKey;
            }
            const requestNewFunds = new SignedTransactions.RequestNewFunds(payerFioAddress, payerKey.public_address, payeeFioAddress, this.getTechnologyProviderId(technologyProviderId), maxFee, payeeTokenPublicAddress, amount, chainCode, tokenCode, memo, hash, offlineUrl);
            return requestNewFunds.execute(this.privateKey, this.publicKey, this.returnPreparedTrx);
        });
    }
    /**
     * Retrieves info on locks for this pub key
     *
     * @param fioPublicKey FIO public key.
     */
    getLocks(fioPublicKey) {
        const getLocks = new queries.GetLocks(fioPublicKey);
        return getLocks.execute(this.publicKey);
    }
    /*
     * Retrieves info on account for this actor
     *
     * @param account FIO account.
     */
    getAccount(actor) {
        const getAccount = new queries.GetAccount(actor);
        return getAccount.execute(this.publicKey);
    }
    /**
     * Checks if a FIO Address or FIO Domain is available for registration.
     *
     * @param fioName FIO Address or FIO Domain to check.
     */
    isAvailable(fioName) {
        const availabilityCheck = new queries.AvailabilityCheck(fioName);
        return availabilityCheck.execute(this.publicKey);
    }
    /**
     * Retrieves balance of FIO tokens
     *
     * @param fioPublicKey FIO public key.
     */
    getFioBalance(fioPublicKey) {
        const getFioBalance = new queries.GetFioBalance(fioPublicKey);
        return getFioBalance.execute(this.publicKey);
    }
    /**
     * Returns FIO Addresses and FIO Domains owned by this public key.
     *
     * @param fioPublicKey FIO public key of owner.
     */
    getFioNames(fioPublicKey) {
        const getNames = new queries.GetNames(fioPublicKey);
        return getNames.execute(this.publicKey);
    }
    /**
     * Returns FIO Addresses  owned by this public key.
     *
     * @param fioPublicKey FIO public key of owner.
     * @param limit Number of request to return. If omitted, all requests will be returned.
     * @param offset First request from list to return. If omitted, 0 is assumed.
     */
    getFioAddresses(fioPublicKey, limit, offset) {
        const getNames = new queries.GetAddresses(fioPublicKey, limit, offset);
        return getNames.execute(this.publicKey);
    }
    /**
     * Returns FIO domains  owned by this public key.
     *
     * @param fioPublicKey FIO public key of owner.
     * @param limit Number of request to return. If omitted, all requests will be returned.
     * @param offset First request from list to return. If omitted, 0 is assumed.
     */
    getFioDomains(fioPublicKey, limit, offset) {
        const getNames = new queries.GetDomains(fioPublicKey, limit, offset);
        return getNames.execute(this.publicKey);
    }
    /**
     * Polls for any pending requests sent to public key associated with the FIO SDK instance.
     *
     * @param limit Number of request to return. If omitted, all requests will be returned.
     * @param offset First request from list to return. If omitted, 0 is assumed.
     */
    getPendingFioRequests(limit, offset) {
        const pendingFioRequests = new queries.PendingFioRequests(this.publicKey, limit, offset);
        return pendingFioRequests.execute(this.publicKey, this.privateKey);
    }
    /**
     * Polls for any received requests sent to public key associated with the FIO SDK instance.
     *
     * @param limit Number of request to return. If omitted, all requests will be returned.
     * @param offset First request from list to return. If omitted, 0 is assumed.
     * @param includeEncrypted Set to true if you want to include not encrypted data in return.
     */
    getReceivedFioRequests(limit, offset, includeEncrypted) {
        const receivedFioRequests = new queries.ReceivedFioRequests(this.publicKey, limit, offset, includeEncrypted);
        return receivedFioRequests.execute(this.publicKey, this.privateKey);
    }
    /**
     * Polls for any sent requests sent by public key associated with the FIO SDK instance.
     *
     * @param limit Number of request to return. If omitted, all requests will be returned.
     * @param offset First request from list to return. If omitted, 0 is assumed.
     * @param includeEncrypted Set to true if you want to include not encrypted data in return.
     */
    getSentFioRequests(limit, offset, includeEncrypted) {
        const sentFioRequest = new queries.SentFioRequests(this.publicKey, limit, offset, includeEncrypted);
        return sentFioRequest.execute(this.publicKey, this.privateKey);
    }
    /**
     * Polls for any cancelled requests sent by public key associated with the FIO SDK instance.
     *
     * @param limit Number of request to return. If omitted, all requests will be returned.
     * @param offset First request from list to return. If omitted, 0 is assumed.
     */
    getCancelledFioRequests(limit, offset) {
        const cancelledFioRequest = new queries.CancelledFioRequests(this.publicKey, limit, offset);
        return cancelledFioRequest.execute(this.publicKey, this.privateKey);
    }
    /**
     * Returns a token public address for specified token code and FIO Address.
     *
     * @param fioAddress FIO Address for which the token public address is to be returned.
     * @param chainCode Blockchain code for which public address is to be returned.
     * @param tokenCode Token code for which public address is to be returned.
     */
    getPublicAddress(fioAddress, chainCode, tokenCode) {
        const publicAddressLookUp = new queries.GetPublicAddress(fioAddress, chainCode, tokenCode);
        return publicAddressLookUp.execute(this.publicKey);
    }
    /**
     * Returns all public addresses for specified FIO Address.
     *
     * @param fioAddress FIO Address for which the token public address is to be returned.
     * @param limit Number of results to return. If omitted, all results will be returned.
     * @param offset First result from list to return. If omitted, 0 is assumed.
     */
    getPublicAddresses(fioAddress, limit, offset) {
        const publicAddressesLookUp = new queries.GetPublicAddresses(fioAddress, limit, offset);
        return publicAddressesLookUp.execute(this.publicKey);
    }
    /**
     * Returns the FIO token public address for specified FIO Address.
     *
     * @param fioAddress FIO Address for which fio token public address is to be returned.
     */
    getFioPublicAddress(fioAddress) {
        return this.getPublicAddress(fioAddress, 'FIO', 'FIO');
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
    getNfts(options, limit, offset) {
        const { fioAddress, chainCode, contractAddress, tokenId, hash, } = options;
        let nftsLookUp;
        if (fioAddress != null && fioAddress != '') {
            nftsLookUp = new queries.GetNftsByFioAddress(fioAddress, limit, offset);
        }
        if (chainCode != null && chainCode != '' && contractAddress != null && contractAddress != '') {
            nftsLookUp = new queries.GetNftsByContract(chainCode, contractAddress, tokenId, limit, offset);
        }
        if (hash != null && hash != '') {
            nftsLookUp = new queries.GetNftsByHash(hash, limit, offset);
        }
        if (nftsLookUp == null) {
            throw new Error('At least one of these options should be set: fioAddress, chainCode/contractAddress, hash');
        }
        return nftsLookUp.execute(this.publicKey);
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
    transferTokens(payeeFioPublicKey, amount, maxFee, technologyProviderId = null) {
        const transferTokens = new SignedTransactions.TransferTokens(payeeFioPublicKey, amount, maxFee, this.getTechnologyProviderId(technologyProviderId));
        return transferTokens.execute(this.privateKey, this.publicKey, this.returnPreparedTrx);
    }
    /**
     * Compute and return fee amount for specific call and specific user
     *
     * @param fioAddress FIO Address incurring the fee and owned by signer.
     */
    getFeeForTransferLockedTokens(fioAddress) {
        return this.getFee(EndPoint_1.EndPoint.transferLockedTokens, fioAddress);
    }
    /**
     * Return oracle fees amount
     */
    getOracleFees(publicKey) {
        const fioFee = new queries.GetOracleFees();
        return fioFee.execute(publicKey || this.publicKey);
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
    getFee(endPoint, fioAddress = '') {
        const fioFee = new queries.GetFee(endPoint, fioAddress);
        return fioFee.execute(this.publicKey);
    }
    /**
     * Compute and return fee amount for specific call and specific user
     *
     * @param payerFioAddress, Payer FIO Address incurring the fee and owned by signer.
     */
    getFeeForRecordObtData(payerFioAddress) {
        return this.getFee(EndPoint_1.EndPoint.recordObtData, payerFioAddress);
    }
    /**
     * Compute and return fee amount for specific call and specific user
     *
     * @param payeeFioAddress Payee FIO Address incurring the fee and owned by signer.
     */
    getFeeForNewFundsRequest(payeeFioAddress) {
        return this.getFee(EndPoint_1.EndPoint.newFundsRequest, payeeFioAddress);
    }
    /**
     * Compute and return fee amount for specific call and specific user
     *
     * @param payerFioAddress Payer FIO Address incurring the fee and owned by signer.
     */
    getFeeForRejectFundsRequest(payerFioAddress) {
        return this.getFee(EndPoint_1.EndPoint.rejectFundsRequest, payerFioAddress);
    }
    /**
     * Compute and return fee amount for specific call and specific user
     *
     * @param fioAddress FIO Address incurring the fee and owned by signer.
     */
    getFeeForAddPublicAddress(fioAddress) {
        return this.getFee(EndPoint_1.EndPoint.addPubAddress, fioAddress);
    }
    /**
     * Compute and return fee amount for specific call and specific user
     *
     * @param fioAddress FIO Address incurring the fee and owned by signer.
     */
    getFeeForCancelFundsRequest(fioAddress) {
        return this.getFee(EndPoint_1.EndPoint.cancelFundsRequest, fioAddress);
    }
    /**
     * Compute and return fee amount for specific call and specific user
     *
     * @param fioAddress FIO Address incurring the fee and owned by signer.
     */
    getFeeForRemovePublicAddresses(fioAddress) {
        return this.getFee(EndPoint_1.EndPoint.removePubAddress, fioAddress);
    }
    /**
     * Compute and return fee amount for specific call and specific user
     *
     * @param fioAddress FIO Address incurring the fee and owned by signer.
     */
    getFeeForRemoveAllPublicAddresses(fioAddress) {
        return this.getFee(EndPoint_1.EndPoint.removeAllPubAddresses, fioAddress);
    }
    /**
     * Compute and return fee amount for specific call and specific user
     *
     * @param fioAddress FIO Address incurring the fee and owned by signer.
     */
    getFeeForBurnFioAddress(fioAddress) {
        return this.getFee(EndPoint_1.EndPoint.burnFioAddress, fioAddress);
    }
    /**
     * Compute and return fee amount for specific call and specific user
     *
     * @param fioAddress FIO Address incurring the fee and owned by signer.
     */
    getFeeForTransferFioAddress(fioAddress) {
        return this.getFee(EndPoint_1.EndPoint.transferFioAddress, fioAddress);
    }
    /**
     * Compute and return fee amount for specific call and specific user
     *
     * @param fioAddress FIO Address incurring the fee and owned by signer.
     */
    getFeeForAddBundledTransactions(fioAddress) {
        return this.getFee(EndPoint_1.EndPoint.addBundledTransactions, fioAddress);
    }
    /**
     * Compute and return fee amount for specific call and specific user
     *
     * @param fioAddress FIO Address incurring the fee and owned by signer.
     */
    getFeeForTransferFioDomain(fioAddress) {
        return this.getFee(EndPoint_1.EndPoint.transferFioDomain, fioAddress);
    }
    /**
     * @ignore
     */
    registerFioNameOnBehalfOfUser(fioName, publicKey) {
        const server = this.registerMockUrl; // "mock.dapix.io/mockd/DEV2"
        const mockRegisterFioName = new MockRegisterFioName_1.MockRegisterFioName(fioName, publicKey, server);
        return mockRegisterFioName.execute();
    }
    /**
     * Stake FIO Tokens.
     *
     * @param amount Amount of SUFs to stake.
     * @param fioAddress FIO Address if using bundled transactions to pay. May be left empty if paying a fee instead.
     * @param fee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by /get_fee for correct value.
     * @param technologyProviderId FIO Address of the entity which generates this transaction. TPID rewards will be paid to this address. Set to empty if not known.
     */
    stakeFioTokens(amount, fioAddress = '', fee = 0, technologyProviderId = null) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!fee && fioAddress) {
                const { fee: stakeFee } = yield this.getFee(EndPoint_1.EndPoint.stakeFioTokens, fioAddress);
                fee = stakeFee;
            }
            return this.pushTransaction('fio.staking', 'stakefio', {
                amount,
                fio_address: fioAddress,
                max_fee: fee,
                tpid: technologyProviderId,
            });
        });
    }
    /**
     * Unstake FIO Tokens.
     *
     * @param amount Amount of SUFs to unstake.
     * @param fioAddress FIO Address if using bundled transactions to pay. May be left empty if paying a fee instead.
     * @param fee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by /get_fee for correct value.
     * @param technologyProviderId FIO Address of the entity which generates this transaction. TPID rewards will be paid to this address. Set to empty if not known.
     */
    unStakeFioTokens(amount, fioAddress = '', fee = 0, technologyProviderId = null) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!fee && fioAddress) {
                const { fee: stakeFee } = yield this.getFee(EndPoint_1.EndPoint.unStakeFioTokens, fioAddress);
                fee = stakeFee;
            }
            return this.pushTransaction('fio.staking', 'unstakefio', {
                amount,
                fio_address: fioAddress,
                max_fee: fee,
                tpid: technologyProviderId,
            });
        });
    }
    /**
     * @ignore
     */
    getMultiplier() {
        return constants_1.Constants.multiplier;
    }
    /**
     * Allows advance user to send their own content directly to FIO contracts
     *
     * @param account Account name
     * @param action Name of action
     * @param data JSON object with params for action
     * @param encryptOptions JSON object with params for encryption
     */
    pushTransaction(account, action, data, encryptOptions = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            data.tpid = this.getTechnologyProviderId(data.tpid);
            if (data.content && !encryptOptions.key) {
                switch (action) {
                    case 'newfundsreq': {
                        const payerKey = yield this.getFioPublicAddress(data.payer_fio_address);
                        encryptOptions.key = payerKey.public_address;
                        encryptOptions.contentType = 'new_funds_content';
                        break;
                    }
                    case 'recordobt': {
                        const payeeKey = yield this.getFioPublicAddress(data.payee_fio_address);
                        encryptOptions.key = payeeKey.public_address;
                        encryptOptions.contentType = 'record_obt_data_content';
                        break;
                    }
                    default:
                    //
                }
            }
            const pushTransaction = new SignedTransactions.PushTransaction(action, account, data, encryptOptions);
            return pushTransaction.execute(this.privateKey, this.publicKey, this.returnPreparedTrx);
        });
    }
    /**
     * @ignore
     */
    getAccountPubKey(account) {
        const getAccountPubKey = new queries.GetAccountPubKey(account);
        return getAccountPubKey.execute(this.publicKey);
    }

    /**
     * @ignore
     */
    getEncryptKey(fioAddress) {
        const getEncryptKey = new queries.GetEncryptKey(fioAddress);
        return getEncryptKey.execute(this.publicKey);
    }
    /**
     * @ignore
     */
    genericAction(action, params) {
        switch (action) {
            case 'getFioPublicKey':
                return this.getFioPublicKey();
            case 'getAccount':
                return this.getAccount(params.account);
            case 'registerFioAddress':
                if (params.ownerPublicKey) {
                    return this.registerOwnerFioAddress(params.fioAddress, params.ownerPublicKey, params.maxFee, params.technologyProviderId, params.expirationOffset);
                }
                else {
                    return this.registerFioAddress(params.fioAddress, params.maxFee, params.technologyProviderId, params.expirationOffset);
                }
            case 'registerOwnerFioAddress':
                return this.registerOwnerFioAddress(params.fioAddress, params.ownerPublicKey, params.maxFee, params.technologyProviderId);
            case 'transferLockedTokens':
                return this.transferLockedTokens(params.payeePublicKey, params.canVote, params.periods, params.amount, params.maxFee, params.technologyProviderId);
            case 'registerFioDomain':
                return this.registerFioDomain(params.fioDomain, params.maxFee, params.technologyProviderId);
            case 'registerOwnerFioDomain':
                return this.registerOwnerFioDomain(params.fioDomain, params.ownerPublicKey, params.maxFee, params.technologyProviderId);
            case 'renewFioDomain':
                return this.renewFioDomain(params.fioDomain, params.maxFee, params.technologyProviderId);
            case 'renewFioAddress':
                return this.renewFioAddress(params.fioAddress, params.maxFee, params.technologyProviderId);
            case 'burnFioAddress':
                return this.burnFioAddress(params.fioAddress, params.maxFee, params.technologyProviderId);
            case 'transferFioAddress':
                return this.transferFioAddress(params.fioAddress, params.newOwnerKey, params.maxFee, params.technologyProviderId);
            case 'transferFioDomain':
                return this.transferFioDomain(params.fioDomain, params.newOwnerKey, params.maxFee, params.technologyProviderId);
            case 'addBundledTransactions':
                return this.addBundledTransactions(params.fioAddress, params.bundleSets, params.maxFee, params.technologyProviderId);
            case 'addPublicAddress':
                return this.addPublicAddress(params.fioAddress, params.chainCode, params.tokenCode, params.publicAddress, params.maxFee, params.technologyProviderId);
            case 'addPublicAddresses':
                return this.addPublicAddresses(params.fioAddress, params.publicAddresses, params.maxFee, params.technologyProviderId);
            case 'removePublicAddresses':
                return this.removePublicAddresses(params.fioAddress, params.publicAddresses, params.maxFee, params.technologyProviderId);
            case 'getLocks':
                return this.getLocks(params.fioPublicKey);
            case 'cancelFundsRequest':
                return this.cancelFundsRequest(params.fioRequestId, params.maxFee, params.technologyProviderId);
            case 'removeAllPublicAddresses':
                return this.removeAllPublicAddresses(params.fioAddress, params.maxFee, params.technologyProviderId);
            case 'setFioDomainVisibility':
                return this.setFioDomainVisibility(params.fioDomain, params.isPublic, params.maxFee, params.technologyProviderId);
            case 'recordObtData':
                return this.recordObtData(params.fioRequestId || null, params.payerFioAddress, params.payeeFioAddress, params.payerTokenPublicAddress, params.payeeTokenPublicAddress, params.amount, params.chainCode, params.tokenCode, params.status || '', params.obtId, params.maxFee, params.technologyProviderId, params.payeeFioPublicKey, params.memo, params.hash, params.offLineUrl);
            case 'getFeeForTransferLockedTokens':
                return this.getFeeForTransferLockedTokens(params.fioAddress);
            case 'getObtData':
                return this.getObtData(params.limit, params.offset, params.tokenCode);
            case 'getGranteePermissions':
                return this.getGranteePermissions(params.granteeAccount, params.limit, params.offset);
            case 'getGrantorPermissions':
                return this.getGrantorPermissions(params.grantorAccount, params.limit, params.offset);
            case 'getObjectPermissions':
                return this.getObjectPermissions(params.permissionName, params.objectName, params.limit, params.offset);
            case 'rejectFundsRequest':
                return this.rejectFundsRequest(params.fioRequestId, params.maxFee, params.technologyProviderId);
            case 'requestFunds':
                return this.requestFunds(params.payerFioAddress, params.payeeFioAddress, params.payeeTokenPublicAddress, params.amount, params.chainCode, params.tokenCode, params.memo, params.maxFee, params.payerFioPublicKey, params.technologyProviderId, params.hash, params.offlineUrl);
            case 'isAvailable':
                return this.isAvailable(params.fioName);
            case 'getFioBalance':
                if (params) {
                    return this.getFioBalance(params.fioPublicKey);
                }
                else {
                    return this.getFioBalance();
                }
            case 'getFioNames':
                return this.getFioNames(params.fioPublicKey);
            case 'getFioDomains':
                return this.getFioDomains(params.fioPublicKey, params.limit, params.offset);
            case 'getFioAddresses':
                return this.getFioAddresses(params.fioPublicKey, params.limit, params.offset);
            case 'getPendingFioRequests':
                return this.getPendingFioRequests(params.limit, params.offset);
            case 'getReceivedFioRequests':
                return this.getReceivedFioRequests(params.limit, params.offset, params.includeEncrypted);
            case 'getCancelledFioRequests':
                return this.getCancelledFioRequests(params.limit, params.offset);
            case 'getSentFioRequests':
                return this.getSentFioRequests(params.limit, params.offset, params.includeEncrypted);
            case 'getPublicAddress':
                return this.getPublicAddress(params.fioAddress, params.chainCode, params.tokenCode);
            case 'getPublicAddresses':
                return this.getPublicAddresses(params.fioAddress, params.limit, params.offset);
            case 'getNfts':
                return this.getNfts(params.options, params.limit, params.offset);
            case 'transferTokens':
                return this.transferTokens(params.payeeFioPublicKey, params.amount, params.maxFee, params.technologyProviderId);
            case 'stakeFioTokens':
                return this.stakeFioTokens(params.amount, params.fioAddress, params.maxFee, params.technologyProviderId);
            case 'unStakeFioTokens':
                return this.unStakeFioTokens(params.amount, params.fioAddress, params.maxFee, params.technologyProviderId);
            case 'getFee':
                return this.getFee(params.endPoint, params.fioAddress);
            case 'getFeeForRecordObtData':
                return this.getFeeForRecordObtData(params.payerFioAddress);
            case 'getFeeForNewFundsRequest':
                return this.getFeeForNewFundsRequest(params.payeeFioAddress);
            case 'getFeeForRejectFundsRequest':
                return this.getFeeForRejectFundsRequest(params.payerFioAddress);
            case 'getFeeForBurnFioAddress':
                return this.getFeeForBurnFioAddress(params.fioAddress);
            case 'getFeeForTransferFioAddress':
                return this.getFeeForTransferFioAddress(params.fioAddress);
            case 'getFeeForTransferFioDomain':
                return this.getFeeForTransferFioDomain(params.fioAddress);
            case 'getFeeForAddBundledTransactions':
                return this.getFeeForAddBundledTransactions(params.fioAddress);
            case 'getFeeForAddPublicAddress':
                return this.getFeeForAddPublicAddress(params.fioAddress);
            case 'getFeeForCancelFundsRequest':
                return this.getFeeForCancelFundsRequest(params.fioAddress);
            case 'getFeeForRemovePublicAddresses':
                return this.getFeeForRemovePublicAddresses(params.fioAddress);
            case 'getFeeForRemoveAllPublicAddresses':
                return this.getFeeForRemoveAllPublicAddresses(params.fioAddress);
            case 'getMultiplier':
                return this.getMultiplier();
            case 'pushTransaction':
                return this.pushTransaction(params.account, params.action, params.data, params.encryptOptions);
            case 'getAccountPubKey':
                return this.getAccountPubKey(params.account);
            case 'getEncryptKey':
                return this.getEncryptKey(params.fioAddress);
        }
    }
    /**
     * @ignore
     */
    getAbi(accountName) {
        const abi = new queries.GetAbi(accountName);
        return abi.execute(this.publicKey);
    }
}
exports.FIOSDK = FIOSDK;
/**
 * SUFs = Smallest Units of FIO
 */
FIOSDK.SUFUnit = 1000000000;
