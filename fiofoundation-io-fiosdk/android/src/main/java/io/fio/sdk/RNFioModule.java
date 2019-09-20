
package io.fio.sdk;


import io.fio.sdk.types.Action;
import io.fio.sdk.types.EosChainInfo;
import io.fio.sdk.types.TypePermissionLevel;
import io.fio.sdk.utils.EosByteWriter;
import io.fio.sdk.utils.HashId2;
import io.fio.sdk.utils.Hex;
import io.fio.sdk.utils.TypeChainId;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.google.gson.Gson;

import dagger.Module;


@Module
public class RNFioModule extends ReactContextBaseJavaModule {

    private final int TX_EXPIRATION_IN_MILSEC = 120 * 1000;
    private final ReactApplicationContext reactContext;
    //EosCommanderApp app;

    public RNFioModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
       // app = new EosCommanderApp(reactContext);
    }

    @Override
    public String getName() {
        return "RNFio";
    }

    @ReactMethod
    public void setUrl(String scheme, String url, int port, final Promise promise) {
       // app.setUrl(scheme, url, port);
        promise.resolve("Success");
    }

    @ReactMethod
    public void getInfo(final Promise promise) {
       // app.getInfo(promise);
        promise.resolve("nice");
    }

    @ReactMethod
    public void pushAction(String contract, String action, String message, String permissionAccount, String permissionType, String privateKey, final Promise promise) {
        try {
           // app.pushAction(contract, action, message, permissionAccount, permissionType, privateKey, promise);
        } catch (Exception ex) {
            promise.reject("ERR_UNEXPECTED_EXCEPTION", ex);
        }
    }

    @ReactMethod
    public void getSignedTransaction(String account, String action,
                                     String serializedData, String pubKey, String privateKey,
                                     String chainJSON, String blockJSON,
                                     final Promise promise) {
        HashId2 hashId2 = new HashId2(pubKey);

        String actor;
        try {
            actor = hashId2.getString();
        }catch (Exception e){
            promise.reject(e);
            return;
        }

        SignedTransaction transaction = new SignedTransaction();
        TypePermissionLevel auth = new TypePermissionLevel(actor, "active");
        Action transactionAction = new Action(account, action, auth, serializedData);
        transaction.addAction(transactionAction);
        Gson gson = new Gson();
        EosChainInfo chainInfo = gson.fromJson(chainJSON,EosChainInfo.class);
        transaction.setReferenceBlock(chainInfo.getHeadBlockId());
        transaction.setExpiration(chainInfo.getTimeAfterHeadBlockTime(TX_EXPIRATION_IN_MILSEC));
        transaction.setPrivKey(privateKey);
        transaction.sign(new TypeChainId(chainInfo.getChain_id()));
        EosByteWriter writer = new EosByteWriter(255);
        transaction.pack(writer);
        String hexTransaction = Hex.toHex(writer.toBytes());
        WritableMap map = Arguments.createMap();
        map.putString("hex",hexTransaction);

        map.putString("signature",transaction.getSignatures().get(0));
        promise.resolve(map);
    }

    @ReactMethod
    public void getActor(String publicKey,Promise promise){
        HashId2 hashId2 = new HashId2(publicKey);

        String actor;
        try {
            actor = hashId2.getString();
            promise.resolve(actor);
        }catch (Exception e){
            promise.reject(e);
            return;
        }
    }



}