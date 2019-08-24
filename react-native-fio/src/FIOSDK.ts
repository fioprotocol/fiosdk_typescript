import { Transactions } from './transactions/Transactions'

import * as queries from './transactions/queries'
import  * as  SignedTransactions  from './transactions/signed'
import { Constants } from './utils/constants'
import { MockRegisterFioName } from './transactions/signed/MockRegisterFioName'
const { Ecc } = require('fiojs') 
import { Fio } from 'fiojs'
import { AbiResponse } from './entities/AbiResponse';

type FetchJson = (uri: string, opts?: Object) => Object


export class FIOSDK{
    static ReactNativeFio:any
    transactions:Transactions 
    io:{fetch(param:any,param2:any):any}
    registerMockUrl:string
    privateKey:string
    publicKey:string
    constructor(privateKey:string,publicKey:string,baseUrl:string,io:any,fetchjson:FetchJson,registerMockUrl=''){
        this.transactions = new Transactions()
        this.io = io
        Transactions.baseUrl = baseUrl
        Transactions.FioProvider = Fio
        Transactions.io = io
        Transactions.fetchJson = fetchjson
        this.registerMockUrl = registerMockUrl
        this.privateKey = privateKey
        this.publicKey = publicKey
        for (let accountName of Constants.rawAbiAccountName) {
            this.getAbi(accountName).then(response => {
                Transactions.abiMap.set(response.account_name, response)
            }).catch(error => {
                throw error    
            })
        }
    }
    
    // mnemonic exanple = 'real flame win provide layer trigger soda erode upset rate beef wrist fame design merit'
    static async createPrivateKey(entropy:Buffer):Promise<any>{        
        const hdkey = require('hdkey')
        const wif = require('wif')
        const bip39 = require('bip39')
        const mnemonic = bip39.entropyToMnemonic(entropy)
        const seedBytes = await bip39.mnemonicToSeed(mnemonic)
        const seed = await seedBytes.toString('hex')
        const master = hdkey.fromMasterSeed(new Buffer(seed, 'hex'))
        const node = master.derive("m/44'/235'/0'/0/0")
        const fioKey = wif.encode(128, node._privateKey, false)
        return {fioKey, mnemonic}
    }

    static derivedPublicKey(fioPrivateKey:string){
        const publicKey = Ecc.privateToPublic(fioPrivateKey)
        return { publicKey }
    }

    getFioPublicKey():string{
        return this.publicKey
    }

    registerFioAddress(fioAddress:string, maxFee:number):Promise<any>{
        let registerFioAddress =  new SignedTransactions.RegisterFioAddress(fioAddress, maxFee);
        return registerFioAddress.execute(this.privateKey, this.publicKey)
    }

    registerFioDomain(fioDomain:string, maxFee:number):Promise<any>{
        let registerFioDomain =  new SignedTransactions.RegisterFioDomain(fioDomain, maxFee);
        return registerFioDomain.execute(this.privateKey, this.publicKey)
    }

    renewFioAddress(fioAddress:string, maxFee:number,tpid:string=""):Promise<any>{
        let renewFioAddress =  new SignedTransactions.RenewFioAddress(fioAddress, maxFee,tpid);
        return renewFioAddress.execute(this.privateKey, this.publicKey)
    }

    renewFioDomain(fioDomain:string, maxFee:number,tpid:string=""):Promise<any>{
        let renewFioDomain =  new SignedTransactions.RenewFioDomain(fioDomain, maxFee,tpid);
        return renewFioDomain.execute(this.privateKey, this.publicKey)
    }

    addPublicAddress(fioAddress:string,tokenCode:string,publicAddress:string,maxFee:number):Promise<any>{
        let addPublicAddress = new SignedTransactions.AddPublicAddress(fioAddress,tokenCode,publicAddress,maxFee);
        return addPublicAddress.execute(this.privateKey, this.publicKey)
    }

    async recordSend(
    payerFIOAddress: string,
    payeeFIOAddress: string,
    payerTokenPublicAddress: string,
    payeeTokenPublicAddress: string,
    amount: number,
    tokenCode: string,
    status: string,
    obtID: string,
    maxFee: string,
    tpid: string='',
    payerFioPublicKey: string|null = null,
    fioReqID: string = '',
    memo: string|null = null,
    hash:string|null = null,
    offLineUrl:string|null = null
    ):Promise<any>{
        let payerKey
        if(!payerFioPublicKey){
            payerKey = await this.getPublicAddress(payerFIOAddress,'FIO')
        }else{
            payerKey = payerFioPublicKey
        }
        let recordSend = new SignedTransactions.RecordSend(
        payerFIOAddress, payeeFIOAddress, payerTokenPublicAddress, payeeTokenPublicAddress,
        amount, tokenCode, obtID, maxFee, status, tpid, payerKey.public_address,fioReqID,memo,hash,offLineUrl);
        return recordSend.execute(this.privateKey, this.publicKey);
    }

    rejectFundsRequest(fioRequestId: string,maxFee:number):Promise<any>{
        let rejectFundsRequest = new SignedTransactions.RejectFundsRequest(fioRequestId,maxFee)
        return rejectFundsRequest.execute(this.privateKey, this.publicKey);
    }

    async requestFunds(payerFioAddress: string, payeeFioAddress: string,payeePublicAddress: string, amount: number,tokenCode: string, memo: string,maxFee:number, payerFioPublicKey?:string, tpid:string='', hash?:string, offlineUrl?:string):Promise<any>{
        let payerKey
        if(!payerFioPublicKey){
            payerKey = await this.getPublicAddress(payerFioAddress,'FIO')
        }else{
            payerKey = payerFioPublicKey
        }
        let requestNewFunds = new SignedTransactions.RequestNewFunds(payerFioAddress,payerKey.public_address,payeeFioAddress,tpid,maxFee,payeePublicAddress,amount,tokenCode,memo,hash,offlineUrl);
        return requestNewFunds.execute(this.privateKey, this.publicKey);
    }

    isAvailable(fioName:string):Promise<any>{
        let availabilityCheck = new queries.AvailabilityCheck(fioName);
        return availabilityCheck.execute(this.publicKey);
    }
    
    getFioBalance(fioPublicKey?:string):Promise<any>{
        let getFioBalance = new queries.GetFioBalance(fioPublicKey);
        return getFioBalance.execute(this.publicKey);
    }

    getFioNames(fioPublicKey:string):Promise<any>{
        let getNames = new queries.GetNames(fioPublicKey);
        return getNames.execute(this.publicKey)

    }

    getPendingFioRequests():Promise<any>{
        let pendingFioRequests = new queries.PendingFioRequests(this.publicKey);
        return pendingFioRequests.execute(this.publicKey,this.privateKey)
    }

    getSentFioRequests():Promise<any>{
        let sentFioRequest = new queries.SentFioRequests(this.publicKey);
        return sentFioRequest.execute(this.publicKey,this.privateKey)
    }

    getPublicAddress(fioAddress:string, tokenCode:string):Promise<any>{
        let publicAddressLookUp = new queries.PublicAddressLookUp(fioAddress, tokenCode);
        return publicAddressLookUp.execute(this.publicKey);
    }

    getFioPublicAddress(fioAddress:string):Promise<any>{
        let publicAddressLookUp = new queries.PublicAddressLookUp(fioAddress, "FIO");
        return publicAddressLookUp.execute(this.publicKey);
    }

    transferTokens(payeeFioPublicKey:string,amount:number,maxFee:number):Promise<any>{
        let transferTokens = new SignedTransactions.TransferTokens(payeeFioPublicKey,amount,maxFee);
        return transferTokens.execute(this.privateKey, this.publicKey)
    }

    getFee(endPoint:string,fioAddress=""):Promise<any>{
        let fioFee = new queries.GetFee(endPoint,fioAddress);
        return fioFee.execute(this.publicKey)
    }

    getAbi(accountName:string):Promise<AbiResponse>{
        let abi = new queries.GetAbi(accountName);
        return abi.execute(this.publicKey)
    }

    registerFioNameOnBehalfOfUser(fioName:string,publicKey:string){
        let server = this.registerMockUrl // "mock.dapix.io/mockd/DEV2"
        let mockRegisterFioName = new MockRegisterFioName(fioName,publicKey,server)
        return mockRegisterFioName.execute();
    }

    getMultiplier(){
        return Constants.multiplier;
    }

    genericAction(action:string,params:any):any{
        switch(action){
            case 'getFioPublicKey':
                return this.getFioPublicKey()
            case 'registerFioAddress':
                return this.registerFioAddress(params.fioAddress, params.maxFee)
            case 'registerFioDomain':
                return this.registerFioDomain(params.FioDomain,  params.maxFee)
            case 'renewFioAddress':
                return this.renewFioAddress(params.fioAddress,  params.maxFee)
            case 'addPublicAddress':
                return this.addPublicAddress(params.fioAddress,params.tokenCode,params.publicAddress,params.maxFee)    
            case 'recordSend':
                return this.recordSend(params.payerFIOAddress, params.payeeFIOAddress, 
                    params.payerPublicAddress,params.payeePublicAddress, params.amount, params.tokenCode, 
                    params.obtID, params.maxFee, params.tpid,params.payerFioPublicKey, params.fioReqID, 
                    params.memo, params.hash, params.offLineUrl)
            case 'rejectFundsRequest':
                return this.rejectFundsRequest(params.fioRequestId,params.maxFee)
            case 'requestFunds':
                return this.requestFunds(params.payerFioAddress, params.payeeFioAddress, params.payeePublicAddress,
                    params.amount, params.tokenCode, params.memo, params.maxFee,params.payerFioPublicKey, params.tpid, params.hash, params.offlineUrl)
            case 'isAvailable':
                return this.isAvailable(params.fioName)
            case 'getFioBalance':
                if(params){
                    return this.getFioBalance(params.fioPublicKey)
                }else{
                    return this.getFioBalance()
                }
            case 'getFioNames':
                return this.getFioNames(params.fioPublicKey)
            case 'getPendingFioRequests':
                return this.getPendingFioRequests()
            case 'getSentFioRequests':
                return this.getSentFioRequests()
            case 'getPublicAddress':
                return this.getPublicAddress(params.fioAddress, params.tokenCode)
                break  
            case 'transferTokens':
                return this.transferTokens(params.payeeFioPublicKey,params.amount,params.maxFee)
            case 'getAbi':
                return this.getAbi(params.accountName)
            case 'getFee':
                return this.getFee(params.endPoint,params.fioAddress)
            case 'getMultiplier':
                    return this.getMultiplier()
        }
    }
}