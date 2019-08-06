import { FIOSDK } from 'react-native-fio'
const fetch = require('node-fetch');
import { Fio } from 'fiojs'
import { TextDecoder, TextEncoder } from 'text-encoding';

type FetchJson = (uri: string, opts?: Object) => Object
const textEncoder: TextEncoder = new TextEncoder();
const textDecoder: TextDecoder = new TextDecoder();

function makeFetchJson (): FetchJson {
    return function fetchJson (uri, opts) {
      return fetch(uri, opts).then(reply => {
        if (!reply.ok) {
            const error: Error & { json?: Object, errorCode?:number, uri?:string } = new Error(
                `Error ${reply.status} while fetching ${uri}`
              )
              return reply.json().then(
                json => {
                  error.json = json
                  error.errorCode = reply.status
                  error.uri = uri
                  return Promise.reject(error)
                },
                e => Promise.reject(error)
              )
        }
        return reply.json()
      })
    }
  }

class Keys {
    async createKey():Promise<{privateKey:string,publicKey:string}>{
        const buf = Buffer.from('F0000F00F0000F000F000F0000000000')
        const key = await FIOSDK.createPrivateKeyMnemonic(buf)
        const privateKey = key.fioKey
        
        console.log('privateKey %s',privateKey)
         const publick = FIOSDK.derivedPublicKey(privateKey)
         const publicKey = publick.publicKey
        console.log('publicKey %s',publicKey)
        return {privateKey,publicKey}
    }

}

class Worker{
    fetchJson = makeFetchJson()
    fioSDK:any
    privateKey:string=''
    publicKey=''
    async getkeys(){
        const keys = new Keys()
        const key= await keys.createKey()
        return key
    }
    async setupSDK(){
        const key = await this.getkeys()
        this.privateKey = key.privateKey
        this.publicKey = key.publicKey
        this.fioSDK = await new FIOSDK(this.privateKey,this.publicKey, /*'http://192.168.86.23:8888/v1/'*/ 'http://54.184.39.43:8889/v1/', null, this.fetchJson, 'http://mock.dapix.io/mockd/DEV4')
    }

    getSDK():any{
        return this.fioSDK
    }

    async doSomething(){
        await this.setupSDK()
        this.fioSDK.requestFunds('faucet:fio','fire:edge',this.publicKey,8,'FIO','memo',3000000000,null)
        .then(res => {console.log('res: ', res)}).catch(error => {console.log('error: ', error)})
    }
    
    async recordSend(){
        await this.setupSDK()
        this.fioSDK.recordSend('casey:dapix','adam:dapix','PAYERKEYOTHER','PAYEEKEYOTHER',3,'BTC','sent_to_blockchain','obtid','40000000000','adam.dapix')
        .then(res => {console.log('res: ', res)}).catch(error => {console.log('error: ', error)})
    }

    async doSomethingElse(){
        await this.setupSDK()
        this.fioSDK.getPendingFioRequests(this.publicKey)
        .then(res => {console.log('res: ', res)}).catch(error => {console.log('error: ', error)})
    }
    async getBalance(){
        await this.setupSDK()
        this.fioSDK.getFioBalance(this.publicKey)
        .then(res => {console.log('res: ', res)}).catch(error => {console.log('error: ', error)})
    }
    async doSomethingElse2(){
        await this.setupSDK()
        this.fioSDK.getSentFioRequests(this.publicKey)
        .then(res => {console.log('res: ', res)}).catch(error => {console.log('error: ', error)})
    }
    async decrypt():Promise<string> {
        const key = await this.getkeys()
        this.privateKey = key.privateKey
        this.publicKey = key.publicKey
        const params = {
            privateKey:this.privateKey,
            publicKey:this.publicKey,
            textEncoder:textEncoder, 
            textDecoder:textDecoder 
        }
        console.error('params',params)
        const cipher = Fio.createSharedCipher(params)
        return cipher.decrypt('new_funds_content','fcbb5df83cce121bda60fab613806a86dc4e2a47c36d116b747880e024480784c3a3fd9998dc0e9873112db1512c6ae9dbbef8854a3d3afacb501cbd0896af55c1fb5b51c01cb847dd67a018d7e1abacf91620b4f5ef2291edd90e22f0314153f05aeb5670c508cfffd3792937563767b9a85e0df4bc26eaaecdf58924f925cc')
    }

}


const worker = new Worker() 

// worker.getBalance()
 worker.recordSend()
// worker.doSomethingElse2()
// worker.doSomething()
// worker.getBalance()

// worker.decrypt().then(content => {console.error('content: ', content)})
