export class Autorization {
    actor:string
    permission:string 
    
    constructor(actor:string, permission='active'){
        this.actor = actor
        this.permission = permission
    }
}