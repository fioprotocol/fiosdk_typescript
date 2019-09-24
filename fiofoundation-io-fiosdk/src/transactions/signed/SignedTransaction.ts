import { Transactions } from "../Transactions";
import { Autorization } from '../../entities/Autorization';
import { RawAction } from "../../entities/RawAction";
import { RawTransaction } from "../../entities/RawTransaction";

export abstract class SignedTransaction extends Transactions{


    abstract ENDPOINT:string
    abstract ACTION:string
    abstract ACOUNT:string
    
    abstract getData():any


    async execute(privateKey:string, publicKey:string,dryRun=false):Promise<any>{
        this.privateKey = privateKey
        this.publicKey = publicKey

        const rawTransaction = new RawTransaction()
        const rawaction = new RawAction()
        rawaction.account = this.getAcount()
        const actor = await this.getActor()
        
        rawaction.authorization.push(new Autorization(actor))
        rawaction.account = this.getAcount()
        rawaction.name = this.getAction()
        rawaction.data = this.getData()
        rawTransaction.actions.push(rawaction)    
        return this.pushToServer(rawTransaction,this.getEndPoint(),dryRun)
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
}