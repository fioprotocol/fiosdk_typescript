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
        this.publicKey = '';
        this.privateKey = '';
        this.serilizeEndpoint = "chain/serialize_json";
    }
    getActor(publicKey = '') {
        const actor = Transactions.FioProvider.accountHash((publicKey == '') ? this.publicKey : publicKey);
        return actor;
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
    pushToServer(transaction, endpoint, dryRun) {
        return __awaiter(this, void 0, void 0, function* () {
            const privky = new Array();
            privky.push(this.privateKey);
            let chain = yield this.getChainInfo().catch((error) => console.error("chain:: " + error));
            let block = yield this.getBlock(chain).catch((error) => console.error("block"));
            transaction.ref_block_num = block.block_num & 0xFFFF;
            transaction.ref_block_prefix = block.ref_block_prefix;
            let expiration = new Date(block.timestamp + "Z");
            expiration.setSeconds(expiration.getSeconds() + 120);
            let expirationStr = expiration.toISOString();
            transaction.expiration = expirationStr.substr(0, expirationStr.length - 1);
            if (dryRun) {
                return Transactions.FioProvider.prepareTransaction({
                    transaction, chainId: chain.chain_id, privateKeys: privky, abiMap: Transactions.abiMap,
                    textDecoder: new TextDecoder(), textEncoder: new TextEncoder()
                });
            }
            else {
                const signedTransaction = yield Transactions.FioProvider.prepareTransaction({
                    transaction, chainId: chain.chain_id, privateKeys: privky, abiMap: Transactions.abiMap,
                    textDecoder: new TextDecoder(), textEncoder: new TextEncoder()
                });
                return this.executeCall(endpoint, JSON.stringify(signedTransaction));
            }
        });
    }
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
        const res = Transactions.fetchJson(Transactions.baseUrl + endPoint, options);
        return res;
    }
}
Transactions.abiMap = new Map();
exports.Transactions = Transactions;
