export class Transactions {
    static baseUrl:string;
    static publicKey:string;
    static privateKey:string;
    serilizeEndpoint:string = "chain/serialize_json";
    static ReactNativeFio:{
         getActor(param:any):Promise<any>;
         getSignedTransaction(params:any,params2:any,params3:any,params4:any,params5:any,params6:any,params7:any):Promise<any>;
    };
    async getActor():Promise<string>{
        let actor = await Transactions.ReactNativeFio.getActor(Transactions.publicKey)
        return actor;
    }

    serializeJson(data:any,action:string):Promise<any>{

        let body = {
            "action":action,
            "json":data
        }
        let fetchOptions = {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body:JSON.stringify(body)
        }
        return this.executeCall(this.serilizeEndpoint,<any>null,fetchOptions)
        
    }

    getChainInfo():Promise<any>{    
        return fetch(Transactions.baseUrl+'chain/get_info',{
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          }
      }).then((res)=> res.json());
    }
  
    getBlock(chain:any):Promise<any>{    
      return fetch(Transactions.baseUrl+'chain/get_block',{
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          block_num_or_id:chain.last_irreversible_block_num
        })
    }).then((res)=> res.json());
  }

    async pushToServer(serializedData:string,account:string,action:string,endpoint:string):Promise<any>{
        let chain = await this.getChainInfo().catch((error) => console.error("chain"))
        let block = await this.getBlock(chain).catch((error) => console.error("block"));
        let signedTransacion = await Transactions.ReactNativeFio.getSignedTransaction(account,action,
        serializedData,Transactions.publicKey,Transactions.privateKey,JSON.stringify(chain),JSON.stringify(block));
        let sigArray = new Array();
        sigArray.push(signedTransacion.signature);
        let data = {
            signatures:sigArray,
            packed_trx:signedTransacion.hex,
            compression:"none",
            packed_context_free_data:""
        }
        
        return this.executeCall(endpoint,JSON.stringify(data))
    }

    executeCall(endPoint:string,body:string,fetchOptions?:any):Promise<any>{
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
        return fetch(Transactions.baseUrl + endPoint,options).then(response => {
            let statusCode = response.status
            let data = response.json()
            return Promise.all([statusCode,data]);
        })
        .then(([status,data]) => {
                if(status < 200 || status >300){
                    throw new Error(JSON.stringify({errorCode:status,msg:data}))
                }else{
                    return data;
                }
        })
    }

}