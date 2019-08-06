import { AbiResponse } from '../entities/AbiResponse';
import { RawTransaction } from '../entities/RawTransaction';
import { Fio } from 'fiojs'
import { TextDecoder, TextEncoder } from 'text-encoding';


type FetchJson = (uri: string, opts?: Object) => Object
const textEncoder: TextEncoder = new TextEncoder();
const textDecoder: TextDecoder = new TextDecoder();

export class Transactions {
    static baseUrl:string;
    publicKey:string='';
    privateKey:string='';
    static abiMap: Map<string, AbiResponse> = new Map<string, AbiResponse>();
    static io:{fetch(param:any,param2:any):Promise<any>}
    static FioProvider:{
        prepareTransaction(param:any):Promise<any>;
        accountHash(pubkey : string) : string
    };

    static fetchJson:FetchJson
    serilizeEndpoint:string = "chain/serialize_json";


    getActor(publicKey:string=''):string{
        const actor = Transactions.FioProvider.accountHash((publicKey=='')? this.publicKey: publicKey)
        return actor
    }

    async getChainInfo():Promise<any>{
        let options = {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            }
        }   
        const res = await Transactions.fetchJson(Transactions.baseUrl + 'chain/get_info', options);
        return res
    }
  
    async getBlock(chain:any):Promise<any>{   
        if( chain == undefined){
            throw new Error("chain undefined")
        } 
        if( chain.last_irreversible_block_num == undefined){
            throw new Error("chain.last_irreversible_block_num undefined")
        } 
      const res = await Transactions.fetchJson(Transactions.baseUrl + 'chain/get_block', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                block_num_or_id: chain.last_irreversible_block_num
            })
        });
        return  res
  }

    async pushToServer(transaction:RawTransaction,endpoint:string,dryRun:boolean):Promise<any>{
        const privky:Array<string> = new Array<string>()
        privky.push(this.privateKey)
        let chain = await this.getChainInfo().catch((error) => console.error("chain:: " + error))
        let block = await this.getBlock(chain).catch((error) => console.error("block: " + error));
        transaction.ref_block_num = block.block_num & 0xFFFF
        transaction.ref_block_prefix = block.ref_block_prefix
        let expiration = new Date(block.timestamp  + "Z")
        expiration.setSeconds(expiration.getSeconds() + 120)
        let expirationStr = expiration.toISOString()
        transaction.expiration = expirationStr.substr(0, expirationStr.length - 1);
        console.error("transaction:",JSON.stringify(transaction))
        if(dryRun){
            return Transactions.FioProvider.prepareTransaction({
                transaction, chainId: chain.chain_id, privateKeys: privky, abiMap: Transactions.abiMap,
                textDecoder: new TextDecoder(), textEncoder: new TextEncoder()})
        }else{
            const signedTransaction = await Transactions.FioProvider.prepareTransaction({
                transaction, chainId: chain.chain_id, privateKeys: privky, abiMap: Transactions.abiMap,
                textDecoder: new TextDecoder(), textEncoder: new TextEncoder()})
            return this.executeCall(endpoint,JSON.stringify(signedTransaction))
        }

    }

    executeCall(endPoint:string,body:string,fetchOptions?:any):any{
        let options:any;
        if(fetchOptions != null){
            options = fetchOptions;
            if(body!=null){
                options.body = body
            }
        }else{
            options = {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body:body
            }
        } 
        /* const res =  Transactions.fetchJson(Transactions.baseUrl + endPoint,options)
        return res*/
        return Transactions.fetchJson(Transactions.baseUrl + endPoint,options)
    }

    getCipherContent(contentType:string,content:any,privateKey:string,publicKey:string){
        const cipher = Fio.createSharedCipher({privateKey,publicKey,textEncoder, textDecoder})
        return cipher.encrypt(contentType,content)
    }
    getUnCipherContent(contentType:string,content:any,privateKey:string,publicKey:string){
        const cipher = Fio.createSharedCipher({privateKey,publicKey,textEncoder, textDecoder})
        return cipher.decrypt(contentType,content)
    }
}