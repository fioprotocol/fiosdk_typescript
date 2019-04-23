"use strict";
//import ReactNativeFio from 'react-native-fio'
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
        return __awaiter(this, void 0, void 0, function* () {
            let actor = yield Transactions.ReactNativeFio.getActor(Transactions.publicKey);
            return actor;
        });
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
        return fetch(Transactions.baseUrl + 'chain/get_info', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then((res) => res.json());
    }
    getBlock(chain) {
        return fetch(Transactions.baseUrl + 'chain/get_block', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                block_num_or_id: chain.last_irreversible_block_num
            })
        }).then((res) => res.json());
    }
    pushToServer(serializedData, account, action, endpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            let chain = yield this.getChainInfo().catch((error) => console.error("chain"));
            let block = yield this.getBlock(chain).catch((error) => console.error("block"));
            let signedTransacion = yield Transactions.ReactNativeFio.getSignedTransaction(account, action, serializedData, Transactions.publicKey, Transactions.privateKey, JSON.stringify(chain), JSON.stringify(block));
            let sigArray = new Array();
            sigArray.push(signedTransacion.signature);
            let data = {
                signatures: sigArray,
                packed_trx: signedTransacion.hex,
                compression: "none",
                packed_context_free_data: ""
            };
            return this.executeCall(endpoint, JSON.stringify(data));
        });
    } //11 70539183 13:39
    executeCall(endPoint, body, fetchOptions) {
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
        }
        return fetch(Transactions.baseUrl + endPoint, options).then(response => {
            let statusCode = response.status;
            let data = response.json();
            return Promise.all([statusCode, data]);
        })
            .then(([status, data]) => {
            if (status < 200 || status > 300) {
                throw new Error(JSON.stringify({ errorCode: status, msg: data }));
            }
            else {
                return data;
            }
        });
    }
}
exports.Transactions = Transactions;
