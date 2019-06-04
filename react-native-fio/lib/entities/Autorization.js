"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Autorization {
    constructor(actor, permission = 'active') {
        this.actor = actor;
        this.permission = permission;
    }
}
exports.Autorization = Autorization;
