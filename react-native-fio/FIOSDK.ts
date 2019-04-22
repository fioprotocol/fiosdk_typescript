import  * as  SignedTransactions  from './transactions/signed';
import * as queries from './transactions/queries'
import { Transactions } from './transactions/Transactions';
import { RecordSendRequest }  from './entities/RecordSendRequest';

export class FIOSDK{
    transactions:Transactions 
    constructor(baseUrl:string,publicKey:string,privateKey:string){
        this.transactions = new Transactions();   
        Transactions.baseUrl = baseUrl;
        Transactions.publicKey = publicKey;
        Transactions.privateKey = privateKey;     
    }

    registerName(name:string):Promise<any>{
        let registerName =  new SignedTransactions.RegisterName(name);
        return registerName.execute()
    }

    addPublicAddress(fioAddress:string,tokenCode:string,publicAddress:string):Promise<any>{
        let addPublicAddress = new SignedTransactions.AddPublicAddress(fioAddress,tokenCode,publicAddress);
        return addPublicAddress.execute()
    }

    recordSend(recordSendRequest: RecordSendRequest):Promise<any>{
        let recordSend = new SignedTransactions.RecordSend(recordSendRequest);
        return recordSend.execute();
    }

    rejectFundsRequest(fioreqid: string):Promise<any>{
        let rejectFundsRequest = new SignedTransactions.RejectFundsRequest(fioreqid)
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
    
    getFioBalance(fioAddress: string):Promise<any>{
        let getFioBalance = new queries.GetFioBalance(fioAddress);
        return getFioBalance.execute();
    }

    getNames(fioAddress:string):Promise<any>{
        let getNames = new queries.GetNames(fioAddress);
        return getNames.execute()

    }

    pendingFioRequests(publicAddress:string):Promise<any>{
        let pendingFioRequests = new queries.PendingFioRequests(publicAddress);
        return pendingFioRequests.execute()
    }

    sentFioRequests(fioAddress:string):Promise<any>{
        let sentFioRequest = new queries.SentFioRequests(fioAddress);
        return sentFioRequest.execute()
    }

    publicAddressLookUp(fioAddress:string, tokenCode:string):Promise<any>{
        let publicAddressLookUp = new queries.PublicAddressLookUp(fioAddress, tokenCode);
        return publicAddressLookUp.execute();
    }
}