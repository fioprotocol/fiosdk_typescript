//
//  PrivateKey+Extensions.swift
//  FIOSDK
//
//  Created by Vitor Navarro on 2019-03-22.
//  Copyright © 2019 Dapix, Inc. All rights reserved.
//
import Foundation

extension PrivateKey {
    
    init?(enclave: SecureEnclave, mnemonicString: String, slip: UInt32) throws {
        self.enclave = enclave
        
        let phraseStr = mnemonicString.cString(using: .utf8)
        if mnemonic_check(phraseStr) == 0 {
            throw NSError(domain: "com.swiftyeos.error", code: 1, userInfo: [NSLocalizedDescriptionKey: "Invalid Mnemonic"])
        }
        
        var seed = Data(count: 512/8)
        seed.withUnsafeMutableBytes { bytes in
            mnemonic_to_seed(phraseStr, "", bytes, nil)
        }
        
        var node = seed.withUnsafeBytes { (bytes: UnsafePointer<UInt8>) -> HDNode in
            var node = HDNode()
            hdnode_from_seed(bytes, Int32(seed.count), UnsafePointer<Int8>("secp256k1"), &node)
            return node
        }
        
        hdnode_private_ckd(&node, (0x80000000 | (44)));   // 44' - BIP 44 (purpose field)
        hdnode_private_ckd(&node, (0x80000000 | (slip)));  // 194'- EOS (see SLIP 44)
        hdnode_private_ckd(&node, (0x80000000 | (0)));    // 0'  - Account 0
        hdnode_private_ckd(&node, 0);                     // 0   - External
        hdnode_private_ckd(&node, 0);                     // 0   - Slot #0
        
        let data =  withUnsafeBytes(of: &node.private_key) { (rawPtr) -> Data in
            let ptr = rawPtr.baseAddress!.assumingMemoryBound(to: UInt8.self)
            return Data(bytes: ptr, count: 32)
        }
        
        self.data = data
    }
    
}