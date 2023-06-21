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
const abort_controller_1 = require("abort-controller");
const PROMISE_TIMEOUT = 5000;
const DEFAULT_REQUEST_TIMEOUT = 60000;
const snooze = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
function asyncWaterfall({ asyncFuncs, timeoutMs = PROMISE_TIMEOUT, requestTimeout = DEFAULT_REQUEST_TIMEOUT, }) {
    return __awaiter(this, void 0, void 0, function* () {
        let pending = asyncFuncs.length;
        const promises = [];
        for (const func of asyncFuncs) {
            const abortController = new abort_controller_1.AbortController();
            const timeoutPromise = snooze(requestTimeout).then(() => {
                abortController.abort();
                throw new Error('request_timeout');
            });
            const index = promises.length;
            const promise = Promise.any([func(abortController.signal), timeoutPromise])
                .catch((e) => {
                // Throw only one error instead of array of errors
                let errorToThrow = e;
                if (e instanceof AggregateError) {
                    const rejectionReasons = e.errors;
                    errorToThrow = rejectionReasons[0];
                    for (const [reasonIndex, reason] of rejectionReasons.entries()) {
                        if (reason.message === 'request_timeout') {
                            errorToThrow = rejectionReasons[reasonIndex];
                        }
                    }
                }
                errorToThrow.index = index;
                throw errorToThrow;
            });
            promises.push({ promise, abortController });
            if (pending > 1) {
                promises.push({
                    promise: new Promise(resolve => {
                        snooze(timeoutMs).then(() => {
                            resolve('async_waterfall_timed_out');
                        });
                    })
                });
            }
            try {
                const result = yield Promise.any(promises.map(p => p.promise));
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
                const rejectHandling = (handledError) => {
                    const i = handledError.index;
                    promises.splice(i, 1);
                    promises.pop();
                    --pending;
                    if (!pending) {
                        throw handledError;
                    }
                };
                if (error instanceof AggregateError) {
                    // Throw only one error instead of array of errors
                    rejectHandling(error.errors[0]);
                }
                else {
                    rejectHandling(error);
                }
            }
        }
    });
}
exports.asyncWaterfall = asyncWaterfall;
