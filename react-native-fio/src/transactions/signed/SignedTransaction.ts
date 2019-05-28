import { Transactions } from "../Transactions";
import { Autorization } from '../../entities/Autorization';
import { RawAction } from "../../entities/RawAction";
import { RawTransaction } from "../../entities/RawTransaction";

export abstract class SignedTransaction extends Transactions{


    abstract ENDPOINT:string
    abstract ACTION:string
    abstract ACOUNT:string
    
    abstract getData():any


    async execute():Promise<any>{
        const rawTransaction = new RawTransaction()
        const rawaction = new RawAction()
        rawaction.account = this.getAcount()
        const actor = await this.getActor()
        
        rawaction.authorization.push(new Autorization(actor))
        rawaction.account = this.getAcount()
        rawaction.name = this.getAction()
        rawaction.data = this.getData()
        rawTransaction.actions.push(rawaction)    
        return this.pushToServer(rawTransaction,this.getEndPoint())
        
        
      //  return this.getData().then((res:any)=>{return this.serializeJson(res,this.getAction())})
        //.then((jsonData:any)=>{return jsonData.serialized_json})
        //.then((serializedData:string)=>{return this.pushToServer(serializedData,this.getAcount(),this.getAction(),this.getEndPoint())})
    }

    getAction(): string {
        return this.ACTION;
    }
    getAcount(): string {
       return this.ACOUNT
    }
    getEndPoint(): string {
        return this.ENDPOINT
    } 

    /*async execute2():Promise<any>{
        let data = await this.getData();
        let  jsonData =  await this.serializeJson(data,this.ACTION)
        let serializedData = jsonData.serialized_json;
        return this.pushToServer(serializedData,this.ACTOUNT,this.ACTION,this.endPoint)
    }*/

}