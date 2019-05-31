class MockFioProvider{
    
    accountHash(param){
        return Promise.resolve("actor");
    }

    prepareTransaction(params,params2,params3,params4,params5,params6,params7){
        var arr = Array();
        arr['hex'] = "hexhexhex";
        arr['signature'] = "signature";
        return Promise.resolve(arr);
    }
};

exports.MockFioProvider = MockFioProvider;