import { RecordSendRequest }  from './entities/RecordSendRequest'
import { Transactions } from './transactions/Transactions'

import * as queries from './transactions/queries'
import  * as  SignedTransactions  from './transactions/signed'
import { Constants } from './utils/constants'
import { MockRegisterFioAddress } from './transactions/signed/MockRegisterFioAddress'
const { Ecc } = require('fiojs') 
import { Fio } from 'fiojs'
import { AbiResponse } from './entities/AbiResponse';

type FetchJson = (uri: string, opts?: Object) => Object


export class FIOSDK{
    static ReactNativeFio:any
    transactions:Transactions 
    io:{fetch(param:any,param2:any):any}
    registerMockUrl:string
    constructor(privateKey:string,publicKey:string,baseUrl:string,io:any,fetchjson:FetchJson,registerMockUrl=''){
        this.transactions = new Transactions()
        this.io = io
        Transactions.baseUrl = baseUrl
        Transactions.publicKey = publicKey
        Transactions.privateKey = privateKey
        Transactions.FioProvider = Fio
        Transactions.io = io
        Transactions.fetchJson = fetchjson
        this.registerMockUrl = registerMockUrl
        for (let accountName of Constants.rawAbiAccountName) {
            this.getAbi(accountName).then(response => {
                Transactions.abiMap.set(response.account_name, response)
            }).catch(error => {
                throw error    
            })
        }
    }
    
     static async createPrivateKeyPair():Promise<any>{        
        const privateOwnerKey = await Ecc.PrivateKey.randomKey()
        const fioOwnerKey = privateOwnerKey.toString();
        const privateActiveKey = await Ecc.PrivateKey.randomKey()
        const fioKey = privateActiveKey.toString();
        return { fioOwnerKey, fioKey }
    }

    static derivedPublicKey(fioOwnerKey:string, fioKey:string){
        const publicKey = Ecc.privateToPublic(fioKey)
        let ownerPublicKey
        if (fioOwnerKey) {
          ownerPublicKey = Ecc.privateToPublic(fioOwnerKey)
        }
        return { publicKey, ownerPublicKey }
    }

    getFioPublicAddress():string{
        return 'publicFioAddress'
    }

    registerFioAddress(fioAddress:string):Promise<any>{
        let registerFioAddress =  new SignedTransactions.RegisterFioAddress(fioAddress);
        return registerFioAddress.execute()
    }

    registerFioDomain(fioDomain:string):Promise<any>{
        let registerFioDomain =  new SignedTransactions.RegisterFioDomain(fioDomain);
        return registerFioDomain.execute()
    }

    addPublicAddress(fioAddress:string,tokenCode:string,publicAddress:string,maxFee:number):Promise<any>{
        let addPublicAddress = new SignedTransactions.AddPublicAddress(fioAddress,tokenCode,publicAddress,maxFee);
        return addPublicAddress.execute()
    }

    recordSend(recordSendRequest: RecordSendRequest):Promise<any>{
        let recordSend = new SignedTransactions.RecordSend(recordSendRequest);
        return recordSend.execute();
    }

    rejectFundsRequest(fioRequestId: string,maxFee:number):Promise<any>{
        let rejectFundsRequest = new SignedTransactions.RejectFundsRequest(fioRequestId,maxFee)
        return rejectFundsRequest.execute();
    }

    requestFunds(payerFioAddress: string, payeeFioAddress: string, payeePublicAddress: string, amount: Number,tokenCode: string, metaData: string,maxFee:number):Promise<any>{
        let requestNewFunds = new SignedTransactions.RequestNewFunds(payerFioAddress,payeeFioAddress,payeePublicAddress,tokenCode,amount,metaData,maxFee);
        return requestNewFunds.execute();
    }

    isAvailable(fioName:string):Promise<any>{
        let availabilityCheck = new queries.AvailabilityCheck(fioName);
        return availabilityCheck.execute();
    }
    
    getFioBalance(fioPublicAddress: string):Promise<any>{
        let getFioBalance = new queries.GetFioBalance(fioPublicAddress);
        return getFioBalance.execute();
    }

    getFioNames(fioPublicKey:string):Promise<any>{
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

    getPublicAddress(fioAddress:string, tokenCode:string):Promise<any>{
        let publicAddressLookUp = new queries.PublicAddressLookUp(fioAddress, tokenCode);
        return publicAddressLookUp.execute();
    }

    transferTokens(payeePublicKey:string,amount:number,maxFee:number):Promise<any>{
        let transferTokens = new SignedTransactions.TransferTokens(payeePublicKey,amount,maxFee);
        return transferTokens.execute()
    }

    getFee(endPoint:string,fioAddress=""):Promise<any>{
        let fioFee = new queries.GetFee(endPoint,fioAddress);
        return fioFee.execute()
    }

    getAbi(accountName:string):Promise<AbiResponse>{
        let abi = new queries.GetAbi(accountName);
        return abi.execute()
    }

    registerFIOAddressOnBehalfOfUser(fioAddress:string,publicKey:string){
        let server = this.registerMockUrl // "mock.dapix.io/mockd/DEV2"
        let mockRegisterFioAddress = new MockRegisterFioAddress(fioAddress,publicKey,server)
        return mockRegisterFioAddress.execute();
    }

    getMultiplier(){
        return Constants.multiplier;
    }
}