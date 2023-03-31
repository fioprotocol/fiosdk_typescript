"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncWaterfall = void 0;
const PROMISE_TIMEOUT = 5000;
const snooze = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
function asyncWaterfall(asyncFuncs, timeoutMs = PROMISE_TIMEOUT) {
    return __awaiter(this, void 0, void 0, function* () {
        let pending = asyncFuncs.length;
        const promises = [];
        for (const func of asyncFuncs) {
            const index = promises.length;
            promises.push(func().catch((e) => {
                e.index = index;
                throw e;
            }));
            if (pending > 1) {
                promises.push(new Promise(resolve => {
                    snooze(timeoutMs).then(() => {
                        resolve('async_waterfall_timed_out');
                    });
                }));
            }
            try {
                const result = yield Promise.any(promises);
                if (result.isError)
                    throw result.data;
                if (result === 'async_waterfall_timed_out') {
                    promises.pop();
                    --pending;
                }
                else {
                    return result;
                }
            }
            catch (error) {
                const i = error.index;
                promises.splice(i, 1);
                promises.pop();
                --pending;
                if (!pending) {
                    throw error;
                }
            }
        }
    });
}
exports.asyncWaterfall = asyncWaterfall;
