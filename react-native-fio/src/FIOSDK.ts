import { RecordSendRequest }  from './entities/RecordSendRequest';
import { Transactions } from './transactions/Transactions';
import  * as  SignedTransactions  from './transactions/signed';
import * as queries from './transactions/queries';
import { Constants } from './utils/constants'
import { RegisterFioAddress } from './transactions/signed/RegisterFioAddress';
import { MockRegisterFioAddress } from './transactions/signed/MockRegisterFioAddress';

export class FIOSDK{
    static ReactNativeFio:any;
    transactions:Transactions 
    constructor(privateKey:string,publicKey:string,baseUrl:string){
        this.transactions = new Transactions();   
        Transactions.baseUrl = baseUrl;
        Transactions.publicKey = publicKey;
        Transactions.privateKey = privateKey; 
        Transactions.ReactNativeFio = FIOSDK.ReactNativeFio;   
    }
    
    static createKeyPair(mnemonic:string):Promise<any>{
        return FIOSDK.ReactNativeFio.generatePrivatePubKeyPair(mnemonic)
    }

    getFioPublicAddress():Promise<any>{
        return this.transactions.getActor()
    }

    RegisterFioAddress(fioAddress:string):Promise<any>{
        let registerFioAddress =  new SignedTransactions.RegisterFioAddress(fioAddress);
        return registerFioAddress.execute()
    }

    RegisterFioDomain(fioDomain:string):Promise<any>{
        let registerFioDomain =  new SignedTransactions.RegisterFioDomain(fioDomain);
        return registerFioDomain.execute()
    }

    addPublicAddress(fioAddress:string,tokenCode:string,publicAddress:string):Promise<any>{
        let addPublicAddress = new SignedTransactions.AddPublicAddress(fioAddress,tokenCode,publicAddress);
        return addPublicAddress.execute()
    }

    recordSend(recordSendRequest: RecordSendRequest):Promise<any>{
        let recordSend = new SignedTransactions.RecordSend(recordSendRequest);
        return recordSend.execute();
    }

    rejectFundsRequest(fioRequestId: string):Promise<any>{
        let rejectFundsRequest = new SignedTransactions.RejectFundsRequest(fioRequestId)
        return rejectFundsRequest.execute();
    }

    requestNewFunds(payerFioAddress: string, payeeFioAddress: string, payeePublicAddress: string, tokenCode: string, amount: Number, metaData: string):Promise<any>{
        let requestNewFunds = new SignedTransactions.RequestNewFunds(payerFioAddress,payeeFioAddress,payeePublicAddress,tokenCode,amount,metaData);
        return requestNewFunds.execute();
    }

    availabilityCheck(fioName:string):Promise<any>{
        let availabilityCheck = new queries.AvailabilityCheck(fioName);
        return availabilityCheck.execute();
    }
    
    getFioBalance(fioPublicAddress: string):Promise<any>{
        let getFioBalance = new queries.GetFioBalance(fioPublicAddress);
        return getFioBalance.execute();
    }

    getNames(fioPublicKey:string):Promise<any>{
        let getNames = new queries.GetNames(fioPublicKey);
        return getNames.execute()

    }

    getpendingFioRequests(fioPublicKey:string):Promise<any>{
        let pendingFioRequests = new queries.PendingFioRequests(fioPublicKey);
        return pendingFioRequests.execute()
    }

    getSentFioRequests(fioPublicKey:string):Promise<any>{
        let sentFioRequest = new queries.SentFioRequests(fioPublicKey);
        return sentFioRequest.execute()
    }

    publicAddressLookUp(fioAddress:string, tokenCode:string):Promise<any>{
        let publicAddressLookUp = new queries.PublicAddressLookUp(fioAddress, tokenCode);
        return publicAddressLookUp.execute();
    }

    transferTokens(payeePublicKey:string,amount:string):Promise<any>{
        let transferTokens = new SignedTransactions.TransferTokens(payeePublicKey,amount);
        return transferTokens.execute()
    }

    getFee(endPoint:string,fioAddress=""):Promise<any>{
        let fioFee = new queries.GetFee(endPoint,fioAddress);
        return fioFee.execute()
    }

    MockRegisterFioAddress(fioAddress:string,publicKey:string){
        let server = "mock.dapix.io/mockd/DEV2"
        let mockRegisterFioAddress = new MockRegisterFioAddress(fioAddress,publicKey,server)
        return mockRegisterFioAddress.execute();
    }

    getMultiplier(){
        return Constants.multiplier;
    }
}