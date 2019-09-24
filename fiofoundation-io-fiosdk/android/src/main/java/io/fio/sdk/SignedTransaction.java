
package io.fio.sdk;

import io.fio.sdk.utils.EcDsa;
import io.fio.sdk.utils.EcSignature;
import io.fio.sdk.utils.EosByteWriter;
import io.fio.sdk.utils.EosPrivateKey;
import io.fio.sdk.utils.HexUtils;
import io.fio.sdk.utils.Sha256;
import io.fio.sdk.utils.TypeChainId;
import com.google.gson.annotations.Expose;

import java.util.ArrayList;
import java.util.List;


/**
 * Created by swapnibble on 2017-09-11.
 */

public class SignedTransaction extends Transaction {

    @Expose
    private List<String> signatures = null;

    @Expose
    private List<String> context_free_data = new ArrayList<>();
    private EosPrivateKey privateKey = null;


    public SignedTransaction(){
        super();
    }

    public SignedTransaction( SignedTransaction anotherTxn){
        super(anotherTxn);
        this.signatures = deepCopyOnlyContainer( anotherTxn.signatures );
        this.context_free_data = deepCopyOnlyContainer(anotherTxn.context_free_data);
    }

    public List<String> getSignatures() {
        return signatures;
    }

    public void putSignatures(List<String> signatures) {
        this.signatures = signatures;
    }

    public int getCtxFreeDataCount() {
        return ( context_free_data == null ) ? 0 : context_free_data.size();
    }

    public List<String> getCtxFreeData() {
        return context_free_data;
    }

    private byte[] getCfdHash() {
        if (context_free_data.size() <= 0 ) {
            return Sha256.ZERO_HASH.getBytes();
        }

        EosByteWriter writer = new EosByteWriter(255);

        writer.putVariableUInt( context_free_data.size());

        for ( String hexData : context_free_data) {
            byte[] rawData = HexUtils.toBytes( hexData);
            writer.putVariableUInt( rawData.length);
            writer.putBytes( rawData);
        }

        return Sha256.from( writer.toBytes()).getBytes();
    }


    private Sha256 getDigestForSignature(TypeChainId chainId) {
        EosByteWriter writer = new EosByteWriter(255);

        // data layout to sign :
        // [ {chainId}, {Transaction( parent class )}, {hash of context_free_data} ]

        writer.putBytes(chainId.getBytes());
        pack( writer);
        writer.putBytes( getCfdHash());

        return Sha256.from(writer.toBytes());
    }

    public void sign(EosPrivateKey privateKey, TypeChainId chainId) {
        if ( null == this.signatures){
            this.signatures = new ArrayList<>();
        }

        EcSignature signature = EcDsa.sign(getDigestForSignature( chainId ), privateKey);
        this.signatures.add( signature.toString());
    }

    public void sign(TypeChainId chainId) {
        if ( null == this.signatures){
            this.signatures = new ArrayList<>();
        }
        EcSignature signature = EcDsa.sign(getDigestForSignature( chainId ), this.privateKey);
        this.signatures.add( signature.toString());
    }

    public void setPrivKey(String privateKey) {
        this.privateKey = new EosPrivateKey(privateKey);
    }
}
