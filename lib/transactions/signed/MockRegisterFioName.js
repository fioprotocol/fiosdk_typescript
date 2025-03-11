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
exports.MockRegisterFioName = void 0;
class MockRegisterFioName {
    constructor(props) {
        this.props = props;
        this.ENDPOINT = '/register_fio_name';
        // TODO add some validation
    }
    // any ? -> RegisterFioAddressResponse
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const body = {
                fio_name: this.props.fioName,
                owner_fio_public_key: this.props.publicKey,
            };
            const options = {
                body: JSON.stringify(body),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                method: 'POST',
            };
            return fetch(this.props.baseUrl + this.ENDPOINT, options).then((response) => {
                const statusCode = response.status;
                const data = response.json();
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
        });
    }
}
exports.MockRegisterFioName = MockRegisterFioName;
//# sourceMappingURL=MockRegisterFioName.js.map