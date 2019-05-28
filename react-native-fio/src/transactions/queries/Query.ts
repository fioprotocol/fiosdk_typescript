import { Transactions } from '../Transactions';

export abstract class Query<T> extends Transactions{
        abstract ENDPOINT:string;
        abstract getData():any
    
        async execute(publicKey:string):Promise<T>{ 
            this.publicKey = publicKey
            return this.executeCall(this.getEndPoint(),JSON.stringify(this.getData()))
        }

        getEndPoint():string {
            return this.ENDPOINT
        } 

}