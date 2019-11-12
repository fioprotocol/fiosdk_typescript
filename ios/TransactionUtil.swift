//
//  TransactionUtil.swift
//  SwiftyEOS
//
//  Created by croath on 2018/8/16.
//  Copyright © 2018 ProChain. All rights reserved.
//

import Foundation

@objcMembers class TransactionUtil: NSObject {
    
    static func packAndSignTransaction(blockInfo: BlockInfo, chainInfo: ChainInfo, account: String, action: String, data: String, actor: String, privateKey: PrivateKey) -> PackedTransaction {
        var actions: [Action] = []
        let auth = Authorization(actor: actor, permission: "active")
        let action = Action(account: account, name: action, authorization: [auth], data: data)
        actions.append(action)
        let rawTx = Transaction(blockInfo: blockInfo, actions: actions)
        var tx = PackedTransaction(transaction: rawTx, compression: "none")
        tx.sign(pk: privateKey, chainId: chainInfo.chainId!)
        return tx
    }

}