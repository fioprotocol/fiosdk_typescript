// TODO delete not used
export namespace Aes {
    function decrypt(private_key: any, public_key: any, nonce: any, message: any, checksum: any): any;
    function encrypt(private_key: any, public_key: any, message: any, ...args: any[]): any;
}
export function PrivateKey(d: any): any;
export namespace PrivateKey {
    function fromBuffer(buf: any): any;
    function fromHex(hex: any): any;
    function fromSeed(seed: any): any;
    function fromString(privateStr: any): any;
    function fromWif(str: any): any;
    function initialize(...args: any[]): any;
    function isValid(key: any): any;
    function isWif(text: any): any;
    function randomKey(...args: any[]): any;
    function unsafeRandomKey(): any;
}
export function PublicKey(Q: any, ...args: any[]): any;
export namespace PublicKey {
    function fromBinary(bin: any): any;
    function fromBuffer(buffer: any): any;
    function fromHex(hex: any): any;
    function fromPoint(point: any): any;
    function fromString(public_key: any, ...args: any[]): any;
    function fromStringHex(hex: any): any;
    function fromStringOrThrow(public_key: any, ...args: any[]): any;
    function isValid(pubkey: any, ...args: any[]): any;
}
export function Signature(r: any, s: any, i: any): any;
export namespace Signature {
    function from(o: any): any;
    function fromBuffer(buf: any): any;
    function fromHex(hex: any): any;
    function fromString(signature: any): any;
    function fromStringOrThrow(signature: any): any;
    function sign(data: any, privateKey: any, ...args: any[]): any;
    function signHash(dataSha256: any, privateKey: any, ...args: any[]): any;
}
export function initialize(...args: any[]): any;
export function isValidPrivate(wif: any): any;
export function isValidPublic(pubkey: any, ...args: any[]): any;
export namespace key_utils {
    function addEntropy(...args: any[]): void;
    function checkDecode(keyString: any, ...args: any[]): any;
    function checkEncode(keyBuffer: any, ...args: any[]): any;
    function cpuEntropy(...args: any[]): any;
    function entropyCount(): any;
    function random32ByteBuffer(...args: any[]): any;
}
export function privateToPublic(wif: any, ...args: any[]): any;
export function randomKey(cpuEntropyBits: any): any;
export function recover(signature: any, data: any, ...args: any[]): any;
export function recoverHash(signature: any, dataSha256: any, ...args: any[]): any;
export function seedPrivate(seed: any): any;
export function sha256(data: any, ...args: any[]): any;
export function sign(data: any, privateKey: any, ...args: any[]): any;
export function signHash(dataSha256: any, privateKey: any, ...args: any[]): any;
export function unsafeRandomKey(): any;
export function verify(signature: any, data: any, pubkey: any, ...args: any[]): any;
export function verifyHash(signature: any, dataSha256: any, pubkey: any, ...args: any[]): any;
