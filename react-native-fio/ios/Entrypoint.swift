//
//  RnEosEcc.swift
//  RNEosEcc
//
//  Created by Raphaël Gaudreault on 2019-01-20.
//  Copyright © 2019 Eva. All rights reserved.
//
import Foundation

@objc(Entrypoint)
class Entrypoint: NSObject {
    private var count = 0
    private var url = "http://localhost:8888"
    
    @objc
    func getInfo(_ callback: @escaping RCTResponseSenderBlock) {
       // EOSRPC.endpoint = url
        //EOSRPC.sharedInstance.chainInfo { (chainInfo, error) in
            //if error == nil {
            //    let value = "\(chainInfo)"
            //    callback(["\(chainInfo!)"])
            //} else {
            //    callback(["error"])
           // }
        //}
    }

    @objc func setUrl(_ scheme: NSString, urlSent: NSString, port: NSNumber) {
        let myScheme = scheme as String
        let myUrlSent = urlSent as String
        let myPort = port as! Int64
        url = myScheme + "://" + myUrlSent + ":" + String(myPort);
       // EOSRPC.endpoint = url
    }

   @objc func pushAction(_ contract: NSString, action: NSString, message: NSString, permissionAccount: NSString, permissionType: NSString, privateKeyString: NSString, resolver resolve: @escaping RCTPromiseResolveBlock,  rejecter reject: @escaping RCTPromiseRejectBlock) {
//        let myContract = contract as String
//        let myAction = action as String
//        let myMessage = message as String
//        let myPermissionAccount = permissionAccount as String
//        let myPermissionType = permissionType as String
//        let myPrivateKeyString = privateKeyString as String
//        let myPrivateKey = try! PrivateKey(keyString: myPrivateKeyString)
       // EOSRPC.endpoint = url
       // let abi = try! AbiJson(code: myContract, action: myAction, json: myMessage)
        
//        TransactionUtil.pushTransaction(abi: abi, account: myPermissionAccount, privateKey: myPrivateKey!, completion: { (result, error) in
//            if error != nil {
//                reject("ERROR", "ERROR", error);
//            } else {
//                let returnValue = "Ok. Txid: \(result!.transactionId)"
//                resolve(returnValue)
//            }
//        })
    }
    
    @objc func getActor(_ publicKey: NSString, resolver resolve: @escaping RCTPromiseResolveBlock,  rejecter reject: @escaping RCTPromiseRejectBlock) {
        let actor = AccountNameGenerator.run(withPublicKey: publicKey as String)
        guard !actor.isEmpty else { reject("code","message", NSError(domain: "io.dapix", code: -999, userInfo: nil)); return }
        resolve(actor)
    }
    
    @objc func test(_ banana: NSString, nothing:NSString, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        resolve("ok test")
    }
    
    @objc func getSignedTransaction(_ account: NSString,action: NSString, serializedData: NSString,pubKey: NSString,privKey: NSString,chainJson: NSString,blockJson:NSString ,resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        if let chainData = chainJson.data(using: String.Encoding.utf8.rawValue),
           let blockData = blockJson.data(using: String.Encoding.utf8.rawValue) {
            do{
                let chainInfo = try JSONDecoder().decode(ChainInfo.self, from: chainData)
                let blockInfo = try JSONDecoder().decode(BlockInfo.self, from: blockData)
                let privateKey = try PrivateKey(keyString: privKey as String)
                if let unboxedPrivateKey = privateKey {
                    let actor = AccountNameGenerator.run(withPublicKey: pubKey as String)
                    let signedTransaction = TransactionUtil.packAndSignTransaction(blockInfo: blockInfo, chainInfo: chainInfo, account: account as String, action: action as String, data: serializedData as String, actor: actor, privateKey: unboxedPrivateKey)
                    let result = ["hex": signedTransaction.packedTrx, "signature": signedTransaction.signatures.first ?? ""]
                    resolve(result)
                }
                else {
                    reject("code","message", NSError(domain: "io.dapix1", code: -999, userInfo: nil))
                }
                
            }
            catch {
                reject("code","message", error as NSError)
                
            }
        }
        else {
            reject("code","message", NSError(domain: "io.dapix3", code: -999, userInfo: nil))
        }
    }
    
    @objc
    static func requiresMainQueueSetup() -> Bool {
        return true
    }
}



