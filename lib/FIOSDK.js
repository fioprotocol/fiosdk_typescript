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
const queries = require("./transactions/queries");
const SignedTransactions = require("./transactions/signed");
const MockRegisterFioName_1 = require("./transactions/signed/MockRegisterFioName");
const Transactions_1 = require("./transactions/Transactions");
const constants_1 = require("./utils/constants");
const validation_1 = require("./utils/validation");
const ValidationError_1 = require("./entities/ValidationError");
/**
 * @ignore
 */
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
     * @param baseUrl the url to the FIO API.
     * @param fetchjson - the module to use for HTTP Post/Get calls (see above for example)
     * @param registerMockUrl the url to the mock server
     * @param technologyProviderId Default FIO Address of the wallet which generates transactions.
     */
    constructor(privateKey, publicKey, baseUrl, fetchjson, registerMockUrl = '', technologyProviderId = '') {
        this.transactions = new Transactions_1.Transactions();
        Transactions_1.Transactions.baseUrl = baseUrl;
        Transactions_1.Transactions.FioProvider = fiojs_1.Fio;
        Transactions_1.Transactions.fetchJson = fetchjson;
        this.registerMockUrl = registerMockUrl;
        this.privateKey = privateKey;
        this.publicKey = publicKey;
        this.technologyProviderId = technologyProviderId;
        for (const accountName of constants_1.Constants.rawAbiAccountName) {
            this.getAbi(accountName)
                .then((response) => {
                Transactions_1.Transactions.abiMap.set(response.account_name, response);
            })
                .catch((error) => {
                throw error;
            });
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
     * Is the Chain Code Valid?
     *
     * @param chainCode
     *
     * @returns Chain Code is Valid
     */
    static isChainCodeValid(chainCode) {
        const validation = validation_1.validate({ chainCode }, { chainCode: validation_1.allRules.chain });
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
        const validation = validation_1.validate({ tokenCode }, { tokenCode: validation_1.allRules.chain });
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
        const validation = validation_1.validate({ fioAddress }, { fioAddress: validation_1.allRules.fioAddress });
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
        const validation = validation_1.validate({ fioDomain }, { fioDomain: validation_1.allRules.fioDomain });
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
        const validation = validation_1.validate({ fioPublicKey }, { fioPublicKey: validation_1.allRules.fioPublicKey });
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
        const validation = validation_1.validate({ publicAddress }, { publicAddress: validation_1.allRules.nativeBlockchainPublicAddress });
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
        var floor = Math.floor(amount);
        var tempResult = floor * this.SUFUnit;
        // get remainder
        var remainder = (amount % 1);
        var remainderResult = remainder * (this.SUFUnit);
        var floorRemainder = Math.floor(remainderResult);
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
        return parseInt(`${suf}`) / this.SUFUnit;
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
     * Registers a FIO Address on the FIO blockchain. The owner will be the public key associated with the FIO SDK instance.
     *
     * @param fioAddress FIO Address to register.
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by @ [getFee] for correct value.
     * @param technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    registerFioAddress(fioAddress, maxFee, technologyProviderId = null) {
        const registerFioAddress = new SignedTransactions.RegisterFioAddress(fioAddress, null, maxFee, this.getTechnologyProviderId(technologyProviderId));
        return registerFioAddress.execute(this.privateKey, this.publicKey);
    }
    /**
     * Registers a Fio Address on behalf of the owner FIO Public key parameter. Owner FIO Public key owns the FIO address
     *
     * @param fioAddress FIO Address to register.
     * @param ownerPublicKey Owner FIO Public Key.
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by @ [getFee] for correct value.
     * @param technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    registerOwnerFioAddress(fioAddress, ownerPublicKey, maxFee, technologyProviderId = null) {
        const registerFioAddress = new SignedTransactions.RegisterFioAddress(fioAddress, ownerPublicKey, maxFee, this.getTechnologyProviderId(technologyProviderId));
        return registerFioAddress.execute(this.privateKey, this.publicKey);
    }
    /**
     * Registers a FIO Domain on the FIO blockchain.
     *
     * @param fioDomain FIO Domain to register. The owner will be the public key associated with the FIO SDK instance.
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by @ [getFee] for correct value.
     * @param technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    registerFioDomain(fioDomain, maxFee, technologyProviderId = null) {
        const registerFioDomain = new SignedTransactions.RegisterFioDomain(fioDomain, maxFee, this.getTechnologyProviderId(technologyProviderId));
        return registerFioDomain.execute(this.privateKey, this.publicKey);
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
        return renewFioAddress.execute(this.privateKey, this.publicKey);
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
        return renewFioDomain.execute(this.privateKey, this.publicKey);
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
                public_address: publicAddress
            }], maxFee, this.getTechnologyProviderId(technologyProviderId));
        return addPublicAddress.execute(this.privateKey, this.publicKey);
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
        return addPublicAddress.execute(this.privateKey, this.publicKey);
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
        return SetFioDomainVisibility.execute(this.privateKey, this.publicKey);
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
            return recordObtData.execute(this.privateKey, this.publicKey);
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
     * Reject funds request.
     *
     * @param fioRequestId Existing funds request Id
     * @param maxFee Maximum amount of SUFs the user is willing to pay for fee. Should be preceded by [getFee] for correct value.
     * @param technologyProviderId FIO Address of the wallet which generates this transaction.
     */
    rejectFundsRequest(fioRequestId, maxFee, technologyProviderId = null) {
        const rejectFundsRequest = new SignedTransactions.RejectFundsRequest(fioRequestId, maxFee, this.getTechnologyProviderId(technologyProviderId));
        return rejectFundsRequest.execute(this.privateKey, this.publicKey);
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
            return requestNewFunds.execute(this.privateKey, this.publicKey);
        });
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
     * Polls for any sent requests sent by public key associated with the FIO SDK instance.
     *
     * @param limit Number of request to return. If omitted, all requests will be returned.
     * @param offset First request from list to return. If omitted, 0 is assumed.
     */
    getSentFioRequests(limit, offset) {
        const sentFioRequest = new queries.SentFioRequests(this.publicKey, limit, offset);
        return sentFioRequest.execute(this.publicKey, this.privateKey);
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
     * Returns the FIO token public address for specified FIO Address.
     *
     * @param fioAddress FIO Address for which fio token public address is to be returned.
     */
    getFioPublicAddress(fioAddress) {
        return this.getPublicAddress(fioAddress, 'FIO', 'FIO');
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
        return transferTokens.execute(this.privateKey, this.publicKey);
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
     * @ignore
     */
    registerFioNameOnBehalfOfUser(fioName, publicKey) {
        const server = this.registerMockUrl; // "mock.dapix.io/mockd/DEV2"
        const mockRegisterFioName = new MockRegisterFioName_1.MockRegisterFioName(fioName, publicKey, server);
        return mockRegisterFioName.execute();
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
     */
    pushTransaction(account, action, data) {
        const pushTransaction = new SignedTransactions.PushTransaction(action, account, data);
        return pushTransaction.execute(this.privateKey, this.publicKey);
    }
    /**
     * @ignore
     */
    genericAction(action, params) {
        switch (action) {
            case 'getFioPublicKey':
                return this.getFioPublicKey();
            case 'registerFioAddress':
                if (params.ownerPublicKey) {
                    return this.registerOwnerFioAddress(params.fioAddress, params.ownerPublicKey, params.maxFee, params.technologyProviderId);
                }
                else {
                    return this.registerFioAddress(params.fioAddress, params.maxFee, params.technologyProviderId);
                }
            case 'registerOwnerFioAddress':
                return this.registerOwnerFioAddress(params.fioAddress, params.ownerPublicKey, params.maxFee, params.technologyProviderId);
            case 'registerFioDomain':
                return this.registerFioDomain(params.fioDomain, params.maxFee, params.technologyProviderId);
            case 'renewFioDomain':
                return this.renewFioDomain(params.fioDomain, params.maxFee, params.technologyProviderId);
            case 'renewFioAddress':
                return this.renewFioAddress(params.fioAddress, params.maxFee, params.technologyProviderId);
            case 'addPublicAddress':
                return this.addPublicAddress(params.fioAddress, params.chainCode, params.tokenCode, params.publicAddress, params.maxFee, params.technologyProviderId);
            case 'addPublicAddresses':
                return this.addPublicAddresses(params.fioAddress, params.publicAddresses, params.maxFee, params.technologyProviderId);
            case 'setFioDomainVisibility':
                return this.setFioDomainVisibility(params.fioDomain, params.isPublic, params.maxFee, params.technologyProviderId);
            case 'recordObtData':
                return this.recordObtData(params.fioRequestId || null, params.payerFioAddress, params.payeeFioAddress, params.payerTokenPublicAddress, params.payeeTokenPublicAddress, params.amount, params.chainCode, params.tokenCode, params.status || '', params.obtId, params.maxFee, params.technologyProviderId, params.payeeFioPublicKey, params.memo, params.hash, params.offLineUrl);
            case 'getObtData':
                return this.getObtData(params.limit, params.offset, params.tokenCode);
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
            case 'getPendingFioRequests':
                return this.getPendingFioRequests(params.limit, params.offset);
            case 'getSentFioRequests':
                return this.getSentFioRequests(params.limit, params.offset);
            case 'getPublicAddress':
                return this.getPublicAddress(params.fioAddress, params.chainCode, params.tokenCode);
            case 'transferTokens':
                return this.transferTokens(params.payeeFioPublicKey, params.amount, params.maxFee, params.technologyProviderId);
            case 'getFee':
                return this.getFee(params.endPoint, params.fioAddress);
            case 'getFeeForRecordObtData':
                return this.getFeeForRecordObtData(params.payerFioAddress);
            case 'getFeeForNewFundsRequest':
                return this.getFeeForNewFundsRequest(params.payeeFioAddress);
            case 'getFeeForRejectFundsRequest':
                return this.getFeeForRejectFundsRequest(params.payerFioAddress);
            case 'getFeeForAddPublicAddress':
                return this.getFeeForAddPublicAddress(params.fioAddress);
            case 'getMultiplier':
                return this.getMultiplier();
            case 'pushTransaction':
                return this.pushTransaction(params.account, params.action, params.data);
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
