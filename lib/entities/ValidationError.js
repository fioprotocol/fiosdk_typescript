"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ValidationError extends Error {
    constructor(list, ...params) {
        super(...params);
        this.list = [];
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ValidationError);
        }
        this.name = 'ValidationError';
        this.list = list;
    }
}
exports.ValidationError = ValidationError;
