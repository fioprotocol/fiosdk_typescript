"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Transactions_1 = require("./transactions/Transactions");
const queries = require("./transactions/queries");
const SignedTransactions = require("./transactions/signed");
const constants_1 = require("./utils/constants");
const MockRegisterFioName_1 = require("./transactions/signed/MockRegisterFioName");
const { Ecc } = require('fiojs');
const fiojs_1 = require("fiojs");
class FIOSDK {
    constructor(privateKey, publicKey, baseUrl, io, fetchjson, registerMockUrl = '') {
        this.transactions = new Transactions_1.Transactions();
        this.io = io;
        Transactions_1.Transactions.baseUrl = baseUrl;
        Transactions_1.Transactions.FioProvider = fiojs_1.Fio;
        Transactions_1.Transactions.io = io;
        Transactions_1.Transactions.fetchJson = fetchjson;
        this.registerMockUrl = registerMockUrl;
        this.privateKey = privateKey;
        this.publicKey = publicKey;
        for (let accountName of constants_1.Constants.rawAbiAccountName) {
            this.getAbi(accountName).then(response => {
                Transactions_1.Transactions.abiMap.set(response.account_name, response);
            }).catch(error => {
                throw error;
            });
        }
    }
    // mnemonic exanple = 'real flame win provide layer trigger soda erode upset rate beef wrist fame design merit'
    static createPrivateKey(entropy) {
        return __awaiter(this, void 0, void 0, function* () {
            const bip39 = require('bip39');
            const mnemonic = bip39.entropyToMnemonic(entropy);
            return yield FIOSDK.createPrivateKeyMnemonic(mnemonic);
        });
    }
    static createPrivateKeyMnemonic(mnemonic) {
        return __awaiter(this, void 0, void 0, function* () {
            const hdkey = require('hdkey');
            const wif = require('wif');
            const bip39 = require('bip39');
            const seedBytes = yield bip39.mnemonicToSeed(mnemonic);
            const seed = yield seedBytes.toString('hex');
            const master = hdkey.fromMasterSeed(new Buffer(seed, 'hex'));
            const node = master.derive("m/44'/235'/0'/0/0");
            const fioKey = wif.encode(128, node._privateKey, false);
            return { fioKey, mnemonic };
        });
    }
    static derivedPublicKey(fioPrivateKey) {
        const publicKey = Ecc.privateToPublic(fioPrivateKey);
        return { publicKey };
    }
    getFioPublicKey() {
        return this.publicKey;
    }
    registerFioAddress(fioAddress, maxFee, walletFioAddress = "") {
        let registerFioAddress = new SignedTransactions.RegisterFioAddress(fioAddress, maxFee, walletFioAddress);
        return registerFioAddress.execute(this.privateKey, this.publicKey);
    }
    registerFioDomain(fioDomain, maxFee, walletFioAddress = "") {
        let registerFioDomain = new SignedTransactions.RegisterFioDomain(fioDomain, maxFee, walletFioAddress);
        return registerFioDomain.execute(this.privateKey, this.publicKey);
    }
    renewFioAddress(fioAddress, maxFee, walletFioAddress = "") {
        let renewFioAddress = new SignedTransactions.RenewFioAddress(fioAddress, maxFee, walletFioAddress);
        return renewFioAddress.execute(this.privateKey, this.publicKey);
    }
    renewFioDomain(fioDomain, maxFee, walletFioAddress = "") {
        let renewFioDomain = new SignedTransactions.RenewFioDomain(fioDomain, maxFee, walletFioAddress);
        return renewFioDomain.execute(this.privateKey, this.publicKey);
    }
    addPublicAddress(fioAddress, tokenCode, publicAddress, maxFee) {
        let addPublicAddress = new SignedTransactions.AddPublicAddress(fioAddress, tokenCode, publicAddress, maxFee);
        return addPublicAddress.execute(this.privateKey, this.publicKey);
    }
    recordSend(fioRequestId, payerFIOAddress, payeeFIOAddress, payerTokenPublicAddress, payeeTokenPublicAddress, amount, tokenCode, status, obtId, maxFee, walletFioAddress = '', payeeFioPublicKey = null, memo = null, hash = null, offLineUrl = null) {
        return __awaiter(this, void 0, void 0, function* () {
            let payeeKey = { public_address: '' };
            if (!payeeFioPublicKey && typeof payeeFioPublicKey !== 'string') {
                payeeKey = yield this.getPublicAddress(payeeFIOAddress, 'FIO');
            }
            else {
                payeeKey.public_address = payeeFioPublicKey;
            }
            let recordSend = new SignedTransactions.RecordSend(fioRequestId, payerFIOAddress, payeeFIOAddress, payerTokenPublicAddress, payeeTokenPublicAddress, amount, tokenCode, obtId, maxFee, status, walletFioAddress, payeeKey.public_address, memo, hash, offLineUrl);
            return recordSend.execute(this.privateKey, this.publicKey);
        });
    }
    rejectFundsRequest(fioRequestId, maxFee, walletFioAddress = "") {
        let rejectFundsRequest = new SignedTransactions.RejectFundsRequest(fioRequestId, maxFee, walletFioAddress);
        return rejectFundsRequest.execute(this.privateKey, this.publicKey);
    }
    requestFunds(payerFioAddress, payeeFioAddress, payeePublicAddress, amount, tokenCode, memo, maxFee, payerFioPublicKey = null, walletFioAddress = '', hash, offlineUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            let payerKey = { public_address: '' };
            if (!payerFioPublicKey && typeof payerFioPublicKey !== 'string') {
                payerKey = yield this.getPublicAddress(payerFioAddress, 'FIO');
            }
            else {
                payerKey.public_address = payerFioPublicKey;
            }
            let requestNewFunds = new SignedTransactions.RequestNewFunds(payerFioAddress, payerKey.public_address, payeeFioAddress, walletFioAddress, maxFee, payeePublicAddress, amount, tokenCode, memo, hash, offlineUrl);
            return requestNewFunds.execute(this.privateKey, this.publicKey);
        });
    }
    isAvailable(fioName) {
        let availabilityCheck = new queries.AvailabilityCheck(fioName);
        return availabilityCheck.execute(this.publicKey);
    }
    getFioBalance(fioPublicKey) {
        let getFioBalance = new queries.GetFioBalance(fioPublicKey);
        return getFioBalance.execute(this.publicKey);
    }
    getFioNames(fioPublicKey) {
        let getNames = new queries.GetNames(fioPublicKey);
        return getNames.execute(this.publicKey);
    }
    getPendingFioRequests() {
        let pendingFioRequests = new queries.PendingFioRequests(this.publicKey);
        return pendingFioRequests.execute(this.publicKey, this.privateKey);
    }
    getSentFioRequests() {
        let sentFioRequest = new queries.SentFioRequests(this.publicKey);
        return sentFioRequest.execute(this.publicKey, this.privateKey);
    }
    getPublicAddress(fioAddress, tokenCode) {
        let publicAddressLookUp = new queries.PublicAddressLookUp(fioAddress, tokenCode);
        return publicAddressLookUp.execute(this.publicKey);
    }
    getFioPublicAddress(fioAddress) {
        let publicAddressLookUp = new queries.PublicAddressLookUp(fioAddress, "FIO");
        return publicAddressLookUp.execute(this.publicKey);
    }
    transferTokens(payeeFioPublicKey, amount, maxFee, walletFioAddress = "") {
        let transferTokens = new SignedTransactions.TransferTokens(payeeFioPublicKey, amount, maxFee, walletFioAddress);
        return transferTokens.execute(this.privateKey, this.publicKey);
    }
    getFee(endPoint, fioAddress = "") {
        let fioFee = new queries.GetFee(endPoint, fioAddress);
        return fioFee.execute(this.publicKey);
    }
    getAbi(accountName) {
        let abi = new queries.GetAbi(accountName);
        return abi.execute(this.publicKey);
    }
    registerFioNameOnBehalfOfUser(fioName, publicKey) {
        let server = this.registerMockUrl; // "mock.dapix.io/mockd/DEV2"
        let mockRegisterFioName = new MockRegisterFioName_1.MockRegisterFioName(fioName, publicKey, server);
        return mockRegisterFioName.execute();
    }
    getMultiplier() {
        return constants_1.Constants.multiplier;
    }
    genericAction(action, params) {
        switch (action) {
            case 'getFioPublicKey':
                return this.getFioPublicKey();
            case 'registerFioAddress':
                return this.registerFioAddress(params.fioAddress, params.maxFee, params.walletFioAddress || "");
            case 'registerFioDomain':
                return this.registerFioDomain(params.FioDomain, params.maxFee, params.walletFioAddress || "");
            case 'renewFioAddress':
                return this.renewFioAddress(params.fioAddress, params.maxFee, params.walletFioAddress || "");
            case 'addPublicAddress':
                return this.addPublicAddress(params.fioAddress, params.tokenCode, params.publicAddress, params.maxFee);
            case 'recordSend':
                return this.recordSend(params.fioRequestId, params.payerFIOAddress, params.payeeFIOAddress, params.payerTokenPublicAddress, params.payeeTokenPublicAddress, params.amount, params.tokenCode, params.status, params.obtId, params.maxFee, params.walletFioAddress || "", params.payerFioPublicKey, params.memo, params.hash, params.offLineUrl);
            case 'rejectFundsRequest':
                return this.rejectFundsRequest(params.fioRequestId, params.maxFees, params.walletFioAddress || "");
            case 'requestFunds':
                return this.requestFunds(params.payerFioAddress, params.payeeFioAddress, params.payeePublicAddress, params.amount, params.tokenCode, params.memo, params.maxFee, params.payerFioPublicKey, params.walletFioAddress || "", params.hash, params.offlineUrl);
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
                return this.getPendingFioRequests();
            case 'getSentFioRequests':
                return this.getSentFioRequests();
            case 'getPublicAddress':
                return this.getPublicAddress(params.fioAddress, params.tokenCode);
            case 'transferTokens':
                return this.transferTokens(params.payeeFioPublicKey, params.amount, params.maxFee, params.walletFioAddress || "");
            case 'getAbi':
                return this.getAbi(params.accountName);
            case 'getFee':
                return this.getFee(params.endPoint, params.fioAddress);
            case 'getMultiplier':
                return this.getMultiplier();
        }
    }
}
exports.FIOSDK = FIOSDK;
