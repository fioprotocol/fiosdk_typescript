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

    static createPrivateKey(entropy:Buffer):any{        
        const hdkey = require('hdkey')
        const wif = require('wif')
        var sha512 = require('js-sha512').sha512;
        const master = hdkey.fromMasterSeed(sha512(entropy))
        const node = master.derive("m/44'/235'/0'/0/0")
        const fioKey = wif.encode(128, node._privateKey, false)
        return {fioKey }
    }
    
    // mnemonic exanple = 'real flame win provide layer trigger soda erode upset rate beef wrist fame design merit'
    static async createPrivateKeyMnemonic(entropy:Buffer):Promise<any>{        
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



    static derivedPublicKey(fioKey:string){
        const publicKey = Ecc.privateToPublic(fioKey)
        return { publicKey }
    }

    getActor():string{
        return Transactions.FioProvider.accountHash(this.publicKey)
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

    addPublicAddress(fioAddress:string,tokenCode:string,publicAddress:string,maxFee:number):Promise<any>{
        let addPublicAddress = new SignedTransactions.AddPublicAddress(fioAddress,tokenCode,publicAddress,maxFee);
        return addPublicAddress.execute(this.privateKey, this.publicKey)
    }

    async recordSend(
    payerFIOAddress: string,
    payeeFIOAddress: string,
    payerPublicAddress: string,
    payeePublicAddress: string,
    amount: number,
    tokenCode: string,
    status: string,
    obtID: string,
    maxFee: string,
    tpid: string='',
    payerFioPublicKey: string|null = null,
    fioReqID: string = '0',
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
        payerFIOAddress, payeeFIOAddress, payerPublicAddress, payeePublicAddress,
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
    
    getFioBalance(othersBalance?:string):Promise<any>{
        let getFioBalance = new queries.GetFioBalance(othersBalance);
        return getFioBalance.execute(this.publicKey);
    }

    getFioNames(fioPublicKey:string):Promise<any>{
        let getNames = new queries.GetNames(fioPublicKey);
        return getNames.execute(this.publicKey)

    }

    getPendingFioRequests(fioPublicKey:string):Promise<any>{
        let pendingFioRequests = new queries.PendingFioRequests(fioPublicKey);
        return pendingFioRequests.execute(this.publicKey,this.privateKey)
    }

    getSentFioRequests(fioPublicKey:string):Promise<any>{
        let sentFioRequest = new queries.SentFioRequests(fioPublicKey);
        return sentFioRequest.execute(this.publicKey,this.privateKey)
    }

    getPublicAddress(fioAddress:string, tokenCode:string):Promise<any>{
        let publicAddressLookUp = new queries.PublicAddressLookUp(fioAddress, tokenCode);
        return publicAddressLookUp.execute(this.publicKey);
    }

    transferTokens(payeePublicKey:string,amount:number,maxFee:number,dryRun:boolean=false):Promise<any>{
        let transferTokens = new SignedTransactions.TransferTokens(payeePublicKey,amount,maxFee);
        return transferTokens.execute(this.privateKey, this.publicKey,dryRun)
    }

    getFee(endPoint:string,fioAddress=""):Promise<any>{
        let fioFee = new queries.GetFee(endPoint,fioAddress);
        return fioFee.execute(this.publicKey)
    }

    getAbi(accountName:string):Promise<AbiResponse>{
        let abi = new queries.GetAbi(accountName);
        return abi.execute(this.publicKey)
    }

    registerFioAddressOnBehalfOfUser(fioAddress:string,publicKey:string){
        let server = this.registerMockUrl // "mock.dapix.io/mockd/DEV2"
        let mockRegisterFioAddress = new MockRegisterFioAddress(fioAddress,publicKey,server)
        return mockRegisterFioAddress.execute();
    }

    getMultiplier(){
        return Constants.multiplier;
    }

    genericAction(action:string,params:any):any{
        switch(action){
            case 'getActor':
                return this.getActor()
                break
            case 'getFioPublicKey':
                return this.getFioPublicKey()
                break
            case 'registerFioAddress':
                return this.registerFioAddress(params.fioAddress, params.maxFee)
                break
            case 'registerFioDomain':
                return this.registerFioDomain(params.FioDomain,  params.maxFee)
                break
            case 'addPublicAddress':
                return this.addPublicAddress(params.fioAddress,params.tokenCode,params.publicAddress,params.maxFee)    
                break    
            case 'recordSend':
                return this.recordSend(params.payerFIOAddress, params.payeeFIOAddress, 
                    params.payerPublicAddress,params.payeePublicAddress, params.amount, params.tokenCode, 
                    params.obtID, params.maxFee, params.tpid,params.payerFioPublicKey, params.fioReqID, 
                    params.memo, params.hash, params.offLineUrl)
                break
            case 'rejectFundsRequest':
                return this.rejectFundsRequest(params.fioRequestId,params.maxFee)
                break
            case 'requestFunds':
                return this.requestFunds(params.payerFioAddress, params.payeeFioAddress, params.payeePublicAddress,
                    params.amount, params.tokenCode, params.memo, params.maxFee,params.payerFioPublicKey, params.tpid, params.hash, params.offlineUrl)
                break                
            case 'isAvailable':
                return this.isAvailable(params.fioName)
                break  
            case 'getFioBalance':
                if(params){
                    return this.getFioBalance(params.othersBalance)
                }else{
                    return this.getFioBalance()
                }
                break
            case 'getFioNames':
                return this.getFioNames(params.fioPublicKey)
                break
            case 'getPendingFioRequests':
                return this.getPendingFioRequests(params.fioPublicKey)
                break
            case 'getSentFioRequests':
                return this.getSentFioRequests(params.fioPublicKey)
                break                
            case 'getPublicAddress':
                return this.getPublicAddress(params.fioAddress, params.tokenCode)
                break  
            case 'transferTokens':
                return this.transferTokens(params.payeePublicKey,params.amount,params.maxFee)
                break
            case 'getAbi':
                return this.getAbi(params.accountName)
                break
            case 'getFee':
                return this.getFee(params.endPoint,params.fioAddress)
                break
            case 'getMultiplier':
                    return this.getMultiplier()
                    break                  
        }
    }
}