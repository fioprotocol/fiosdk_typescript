"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Transactions_1 = require("./transactions/Transactions");
const queries = require("./transactions/queries");
const SignedTransactions = require("./transactions/signed");
const constants_1 = require("./utils/constants");
const MockRegisterFioAddress_1 = require("./transactions/signed/MockRegisterFioAddress");
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
    static createPrivateKey(entropy) {
        const hdkey = require('hdkey');
        const wif = require('wif');
        var sha512 = require('js-sha512').sha512;
        const master = hdkey.fromMasterSeed(sha512(entropy));
        const node = master.derive("m/44'/235'/0'/0/0");
        console.error("fioKey: " + wif.encode(128, node._privateKey, false));
        console.error("publicKey: " + Ecc.PublicKey(node._publicKey).toString());
        const fioKey = wif.encode(128, node._privateKey, false);
        return { fioKey };
    }
    // mnemonic exanple = 'real flame win provide layer trigger soda erode upset rate beef wrist fame design merit'
    static createPrivateKeyMnemonic(mnemonic) {
        const hdkey = require('hdkey');
        const wif = require('wif');
        const bip39 = require('bip39');
        const seed = bip39.mnemonicToSeedHex(mnemonic);
        const master = hdkey.fromMasterSeed(new Buffer(seed, 'hex'));
        const node = master.derive("m/44'/235'/0'/0/0");
        const fioKey = wif.encode(128, node._privateKey, false);
        // console.log("publicKey: "+Ecc.PublicKey(node._publicKey).toString())
        // console.log("privateKey: "+wif.encode(128, node._privateKey, false))
        return { fioKey };
    }
    static derivedPublicKey(fioKey) {
        const publicKey = Ecc.privateToPublic(fioKey);
        return { publicKey };
    }
    getActor() {
        return Transactions_1.Transactions.FioProvider.accountHash(this.publicKey);
    }
    getFioPublicKey() {
        return this.publicKey;
    }
    registerFioAddress(fioAddress) {
        let registerFioAddress = new SignedTransactions.RegisterFioAddress(fioAddress);
        return registerFioAddress.execute(this.privateKey, this.publicKey);
    }
    registerFioDomain(fioDomain) {
        let registerFioDomain = new SignedTransactions.RegisterFioDomain(fioDomain);
        return registerFioDomain.execute(this.privateKey, this.publicKey);
    }
    addPublicAddress(fioAddress, tokenCode, publicAddress, maxFee) {
        let addPublicAddress = new SignedTransactions.AddPublicAddress(fioAddress, tokenCode, publicAddress, maxFee);
        return addPublicAddress.execute(this.privateKey, this.publicKey);
    }
    recordSend(fioReqID = '', payerFIOAddress, payeeFIOAddress, payerPublicAddress, payeePublicAddress, amount, tokenCode, obtID, memo, maxFee) {
        let recordSend = new SignedTransactions.RecordSend(fioReqID, payerFIOAddress, payeeFIOAddress, payerPublicAddress, payeePublicAddress, amount, tokenCode, obtID, memo, maxFee);
        return recordSend.execute(this.privateKey, this.publicKey);
    }
    rejectFundsRequest(fioRequestId, maxFee) {
        let rejectFundsRequest = new SignedTransactions.RejectFundsRequest(fioRequestId, maxFee);
        return rejectFundsRequest.execute(this.privateKey, this.publicKey);
    }
    requestFunds(payerFioAddress, payeeFioAddress, payeePublicAddress, amount, tokenCode, metaData, maxFee) {
        let requestNewFunds = new SignedTransactions.RequestNewFunds(payerFioAddress, payeeFioAddress, payeePublicAddress, tokenCode, amount, metaData, maxFee);
        return requestNewFunds.execute(this.privateKey, this.publicKey);
    }
    isAvailable(fioName) {
        let availabilityCheck = new queries.AvailabilityCheck(fioName);
        return availabilityCheck.execute(this.publicKey);
    }
    getFioBalance() {
        let getFioBalance = new queries.GetFioBalance();
        return getFioBalance.execute(this.publicKey);
    }
    getFioNames(fioPublicKey) {
        let getNames = new queries.GetNames(fioPublicKey);
        return getNames.execute(this.publicKey);
    }
    getPendingFioRequests(fioPublicKey) {
        let pendingFioRequests = new queries.PendingFioRequests(fioPublicKey);
        return pendingFioRequests.execute(this.publicKey);
    }
    getSentFioRequests(fioPublicKey) {
        let sentFioRequest = new queries.SentFioRequests(fioPublicKey);
        return sentFioRequest.execute(this.publicKey);
    }
    getPublicAddress(fioAddress, tokenCode) {
        let publicAddressLookUp = new queries.PublicAddressLookUp(fioAddress, tokenCode);
        return publicAddressLookUp.execute(this.publicKey);
    }
    transferTokens(payeePublicKey, amount, maxFee, dryRun = false) {
        let transferTokens = new SignedTransactions.TransferTokens(payeePublicKey, amount, maxFee);
        return transferTokens.execute(this.privateKey, this.publicKey, dryRun);
    }
    getFee(endPoint, fioAddress = "") {
        let fioFee = new queries.GetFee(endPoint, fioAddress);
        return fioFee.execute(this.publicKey);
    }
    getAbi(accountName) {
        let abi = new queries.GetAbi(accountName);
        return abi.execute(this.publicKey);
    }
    registerFioAddressOnBehalfOfUser(fioAddress, publicKey) {
        let server = this.registerMockUrl; // "mock.dapix.io/mockd/DEV2"
        let mockRegisterFioAddress = new MockRegisterFioAddress_1.MockRegisterFioAddress(fioAddress, publicKey, server);
        return mockRegisterFioAddress.execute();
    }
    getMultiplier() {
        return constants_1.Constants.multiplier;
    }
    genericAction(action, params) {
        switch (action) {
            case 'getActor':
                return this.getActor();
                break;
            case 'getFioPublicKey':
                return this.getFioPublicKey();
                break;
            case 'registerFioAddress':
                return this.registerFioAddress(params.fioAddress);
                break;
            case 'registerFioDomain':
                return this.registerFioDomain(params.FioDomain);
                break;
            case 'addPublicAddress':
                return this.addPublicAddress(params.fioAddress, params.tokenCode, params.publicAddress, params.maxFee);
                break;
            case 'recordSend':
                return this.recordSend(params.fioReqID, params.payerFIOAddress, params.payeeFIOAddress, params.payerPublicAddress, params.payeePublicAddress, params.amount, params.tokenCode, params.obtID, params.memo, params.maxFee);
                break;
            case 'rejectFundsRequest':
                return this.rejectFundsRequest(params.fioRequestId, params.maxFee);
                break;
            case 'requestFunds':
                return this.requestFunds(params.payerFioAddress, params.payeeFioAddress, params.payeePublicAddress, params.amount, params.tokenCode, params.metaData, params.maxFee);
                break;
            case 'isAvailable':
                return this.isAvailable(params.fioName);
                break;
            case 'getFioBalance':
                return this.getFioBalance();
                break;
            case 'getFioNames':
                return this.getFioNames(params.fioPublicKey);
                break;
            case 'getPendingFioRequests':
                return this.getPendingFioRequests(params.fioPublicKey);
                break;
            case 'getSentFioRequests':
                return this.getSentFioRequests(params.fioPublicKey);
                break;
            case 'getPublicAddress':
                return this.getPublicAddress(params.fioAddress, params.tokenCode);
                break;
            case 'transferTokens':
                return this.transferTokens(params.payeePublicKey, params.amount, params.maxFee);
                break;
            case 'getAbi':
                return this.getAbi(params.accountName);
                break;
            case 'getFee':
                return this.getFee(params.endPoint, params.fioAddress);
                break;
            case 'getMultiplier':
                return this.getMultiplier();
                break;
        }
    }
}
exports.FIOSDK = FIOSDK;
