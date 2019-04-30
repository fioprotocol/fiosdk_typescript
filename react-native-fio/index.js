import { NativeModules } from 'react-native';
const { RNFio } = NativeModules;

let ReactNativeFio = RNFio;

export default ReactNativeFio;

fio = require('./lib/FIOSDK');
const FIOSDK = fio;
FIOSDK.ReactNativeFio = ReactNativeFio;

export { FIOSDK };