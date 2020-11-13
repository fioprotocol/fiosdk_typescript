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
exports.asyncWaterfall = exports.shuffleArray = void 0;
const snooze = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
function shuffleArray(array) {
    let currentIndex = array.length;
    let temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}
exports.shuffleArray = shuffleArray;
function asyncWaterfall(asyncFuncs, timeoutMs = 5000) {
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
                const result = yield Promise.race(promises);
                if (result === 'async_waterfall_timed_out') {
                    promises.pop();
                    --pending;
                }
                else {
                    return result;
                }
            }
            catch (e) {
                const i = e.index;
                promises.splice(i, 1);
                promises.pop();
                --pending;
                if (!pending) {
                    throw e;
                }
            }
        }
    });
}
exports.asyncWaterfall = asyncWaterfall;
