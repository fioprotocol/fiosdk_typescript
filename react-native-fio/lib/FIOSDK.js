"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SignedTransactions = require("./transactions/signed");
const queries = require("./transactions/queries");
const Transactions_1 = require("./transactions/Transactions");
const  ReactNativeFio = requiere('react-native-fio');

// todo's:
// How do we do unit tests?  We should have unit tests.
// Add a new method called: getFioPublicAddress()  this will return the fio public key (which is currently the generated actor value)
// change 'pendingFioRequests' to 'getpendingFioRequests'
// change 'sentFioRequests' to 'getSentFioRequests'
// the difference between fioAddress i.e. alice.brd AND fioPublicAddress i.e. '0x132432'
class FIOSDK {
    constructor(baseUrl, publicKey, privateKey) {
        this.transactions = new Transactions_1.Transactions();
        Transactions_1.Transactions.baseUrl = baseUrl;
        Transactions_1.Transactions.publicKey = publicKey;
        Transactions_1.Transactions.privateKey = privateKey;
        Transactions_1.Transactions.ReactNativeFio = ReactNativeFio;
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
    // spell out the parameter name i.e. fioRequestId
    rejectFundsRequest(fioreqid) {
        let rejectFundsRequest = new SignedTransactions.RejectFundsRequest(fioreqid);
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
    // parameter name should be: fioPublicAddress
    getFioBalance(fioAddress) {
        let getFioBalance = new queries.GetFioBalance(fioAddress);
        return getFioBalance.execute();
    }
    // parameter name should be: fioPublicAddress
    getNames(fioAddress) {
        let getNames = new queries.GetNames(fioAddress);
        return getNames.execute();
    }
    // parameter name should be: fioPublicAddress
    pendingFioRequests(publicAddress) {
        let pendingFioRequests = new queries.PendingFioRequests(publicAddress);
        return pendingFioRequests.execute();
    }
    // parameter name should be: fioPublicAddress
    sentFioRequests(fioAddress) {
        let sentFioRequest = new queries.SentFioRequests(fioAddress);
        return sentFioRequest.execute();
    }
    publicAddressLookUp(fioAddress, tokenCode) {
        let publicAddressLookUp = new queries.PublicAddressLookUp(fioAddress, tokenCode);
        return publicAddressLookUp.execute();
    }
}
exports.FIOSDK = FIOSDK;
