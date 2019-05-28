"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class Transactions {
    constructor() {
        this.serilizeEndpoint = "chain/serialize_json";
    }
    getActor() {
        const actor = Transactions.FioProvider.accountHash(Transactions.publicKey);
        return actor;
    }
    serializeJson(data, action) {
        let body = {
            "action": action,
            "json": data
        };
        let fetchOptions = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        };
        return this.executeCall(this.serilizeEndpoint, null, fetchOptions);
    }
    getChainInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            let options = {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            };
            /*
            {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            }
            */
            const res = yield Transactions.fetchJson(Transactions.baseUrl + 'chain/get_info', options);
            return res;
        });
    }
    getBlock(chain) {
        return __awaiter(this, void 0, void 0, function* () {
            if (chain == undefined) {
                throw new Error("chain undefined");
            }
            if (chain.last_irreversible_block_num == undefined) {
                throw new Error("chain.last_irreversible_block_num undefined");
            }
            const res = yield Transactions.fetchJson(Transactions.baseUrl + 'chain/get_block', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    block_num_or_id: chain.last_irreversible_block_num
                })
            });
            return res;
        });
    }
    pushToServer(transaction, endpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            console.error("pushToServerX");
            console.error("Transactions.privateKey::" + Transactions.privateKey);
            const privky = new Array();
            privky.push(Transactions.privateKey);
            let chain = yield this.getChainInfo().catch((error) => console.error("chain:: " + error));
            let block = yield this.getBlock(chain).catch((error) => console.error("block"));
            transaction.ref_block_num = block.block_num;
            transaction.ref_block_prefix = block.ref_block_prefix;
            let expiration = new Date(block.timestamp + "Z");
            expiration.setSeconds(expiration.getSeconds() + 120);
            let expirationStr = expiration.toISOString();
            transaction.expiration = expirationStr.substr(0, expirationStr.length - 1);
            console.error("Transactions.prepareTransaction::ANTES");
            console.error("transaction:: " + JSON.stringify(transaction));
            const signedTransaction = yield Transactions.FioProvider.prepareTransaction({
                transaction, chainId: chain.chain_id, privateKeys: privky, abiMap: Transactions.abiMap,
                textDecoder: new TextDecoder(), textEncoder: new TextEncoder()
            });
            console.error("Transactions.prepareTransaction::OK");
            /*let sigArray = new Array();
            sigArray.push(signedTransaction.signature);
            let data = {
                signatures:sigArray,
                packed_trx:signedTransaction.hex,
                compression:"none",
                packed_context_free_data:""
            }*/
            console.error('signedTransaction:: ' + JSON.stringify(signedTransaction));
            return this.executeCall(endpoint, JSON.stringify(signedTransaction));
        });
    }
    executeCall(endPoint, body, fetchOptions) {
        console.error("Transactions.executeCall::" + endPoint);
        let options;
        if (fetchOptions != null) {
            options = fetchOptions;
            if (body != null) {
                options.body = body;
            }
        }
        else {
            options = {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: body
            };
        } // Transactions.fetchJson
        /*return Transactions.io.fetch(Transactions.baseUrl + endPoint,options).then(response => {
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
        })*/
        console.error('Transactions.baseUrlX:: ' + Transactions.baseUrl);
        const res = Transactions.fetchJson(Transactions.baseUrl + endPoint, options);
        return res;
    }
}
Transactions.abiMap = new Map();
exports.Transactions = Transactions;
