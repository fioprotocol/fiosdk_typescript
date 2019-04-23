import { NativeModules } from 'react-native';
const { RNFio } = NativeModules;

let ReactNativeFio = RNFio;

export default ReactNativeFio;

//export { FIOSDK } from 'react-native-fio/FIOSDK';
import { FIOSDK } from 'react-native-fio/lib/FIOSDK';
const FioSDK = FIOSDK;
FioSDK.ReactNativeFio = ReactNativeFio;

export { FioSDK };
