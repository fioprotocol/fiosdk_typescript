class ReactNativeFio{
    
    getActor(param){
        return Promise.resolve("actor");
    }

    getSignedTransaction(params,params2,params3,params4,params5,params6,params7){
        var arr = Array();
        arr['hex'] = "hexhexhex";
        arr['signature'] = "signature";
        return Promise.resolve(arr);
    }
};

exports.ReactNativeFio = ReactNativeFio;