"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Transactions_1 = require("./transactions/Transactions");
const SignedTransactions = require("./transactions/signed");
const queries = require("./transactions/queries");
class FIOSDK {
    constructor(baseUrl, publicKey, privateKey) {
        this.transactions = new Transactions_1.Transactions();
        Transactions_1.Transactions.baseUrl = baseUrl;
        Transactions_1.Transactions.publicKey = publicKey;
        Transactions_1.Transactions.privateKey = privateKey;
        Transactions_1.Transactions.ReactNativeFio = FIOSDK.ReactNativeFio;
    }
    getFioPublicAddress() {
        return this.transactions.getActor();
    }
    registerName(name) {
        let registerName = new SignedTransactions.RegisterName(name);
        return registerName.execute();
    }
    addPublicAddress(fioAddress, tokenCode, publicAddress) {
        let addPublicAddress = new SignedTransactions.AddPublicAddress(fioAddress, tokenCode, publicAddress);
        return addPublicAddress.execute();
    }
    recordSend(recordSendRequest) {
        let recordSend = new SignedTransactions.RecordSend(recordSendRequest);
        return recordSend.execute();
    }
    rejectFundsRequest(fioRequestId) {
        let rejectFundsRequest = new SignedTransactions.RejectFundsRequest(fioRequestId);
        return rejectFundsRequest.execute();
    }
    requestNewFunds(payerFioAddress, payeeFioAddress, payeePublicAddress, tokenCode, amount, metaData) {
        let requestNewFunds = new SignedTransactions.RequestNewFunds(payerFioAddress, payeeFioAddress, payeePublicAddress, tokenCode, amount, metaData);
        return requestNewFunds.execute();
    }
    availabilityCheck(fioName) {
        let availabilityCheck = new queries.AvailabilityCheck(fioName);
        return availabilityCheck.execute();
    }
    getFioBalance(fioPublicAddress) {
        let getFioBalance = new queries.GetFioBalance(fioPublicAddress);
        return getFioBalance.execute();
    }
    getNames(fioPublicAddress) {
        let getNames = new queries.GetNames(fioPublicAddress);
        return getNames.execute();
    }
    getpendingFioRequests(fioPublicAddress) {
        let pendingFioRequests = new queries.PendingFioRequests(fioPublicAddress);
        return pendingFioRequests.execute();
    }
    getSentFioRequests(fioPublicAddress) {
        let sentFioRequest = new queries.SentFioRequests(fioPublicAddress);
        return sentFioRequest.execute();
    }
    publicAddressLookUp(fioAddress, tokenCode) {
        let publicAddressLookUp = new queries.PublicAddressLookUp(fioAddress, tokenCode);
        return publicAddressLookUp.execute();
    }
}
exports.FIOSDK = FIOSDK;
