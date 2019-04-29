const FIOSDK = require('../lib/FIOSDK');
const Transactions = require ('../lib/transactions/Transactions');
const ReactNativeFio = require('./ReactNativeFioMock');

FIOSDK.FIOSDK.ReactNativeFio = new ReactNativeFio.ReactNativeFio();
fiosdk = new FIOSDK.FIOSDK("http://34.220.57.45:8889/v1/","EOS7isxEua78KPVbGzKemH4nj2bWE52gqj8Hkac3tc7jKNvpfWzYS",
"5KBX1dwHME4VyuUss2sYM25D5ZTDvyYrbEz37UJqwAVAsR4tGuY");

test('getActor, should return a string "actor"', () => {
  fiosdk.getFioPublicAddress().then(res => expect(res).toBe("actor"));
});

test('signing, should be an array',() => {
  var arr = Array();
  arr['hex'] = "hexhexhex";
  arr['signature'] = "signature";
  Transactions.Transactions.ReactNativeFio.getSignedTransaction(1,2,3,4,5,6,7).then(res => expect(res).toBe(arr))
})


