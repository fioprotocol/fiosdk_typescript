"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDomains = void 0;
const entities_1 = require("../../entities");
const Query_1 = require("./Query");
class GetDomains extends Query_1.Query {
    constructor(config, props) {
        super(config);
        this.props = props;
        this.ENDPOINT = `chain/${entities_1.EndPoint.getFioDomains}`;
        this.getData = () => ({
            fio_public_key: this.props.fioPublicKey,
            limit: this.props.limit,
            offset: this.props.offset,
        });
    }
}
exports.GetDomains = GetDomains;
//# sourceMappingURL=GetDomains.js.map