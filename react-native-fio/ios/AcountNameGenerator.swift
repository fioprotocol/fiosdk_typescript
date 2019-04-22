//
//  AcountNameGenerator.swift
//  RNEosEcc
//
//  Created by David Faerman on 15/04/2019.
//  Copyright © 2019 Eva Foundation. All rights reserved.
//

import Foundation

/**
 * This class is responsible for account name API parameter https://stealth.atlassian.net/wiki/spaces/DEV/pages/53280776/API#API-Generatingactor, which is a generated hash following this https://stealth.atlassian.net/wiki/spaces/DEV/pages/130482236/Hash+function+definition specs
 * Account name is also called actor or FIO public address
 */
struct AccountNameGenerator {
    
    /**
     * Generate account name with given public key based on a hash function.
     * If the public key has less than 4 chars its considered invalid and an empty value will be returned.
     * This function will also return an empty string in the case of an invalid base58 generation from the public key.
     * - Parameter withPublicKey: A valid public key to derive the account name from.
     * - Return: account name value.
     */
    public static func run(withPublicKey publicKey: String) -> String {
        guard publicKey.count > 3 else { return "" }

        //STEP 1 AND STEP 2 are not needed we receive the public key
        var pubKey = publicKey
        //STEP 3 remove 4 chars
        pubKey.removeSubrange(pubKey.startIndex..<pubKey.index(pubKey.startIndex, offsetBy: 3))
        //STEP 4 Base58 the pubkey
        guard let decoded58 = Data.decode(base58: pubKey) else { return "" }
        let long = shortenKey(decoded58)
        //STEP 5 Generate the name from long
        return longToString(long)
    }
    
    private static func longToString(_ value: UInt64) -> String {
        var charMap: [UInt8] = ".12345abcdefghijklmnopqrstuvwxyz".ascii
        var temp = value
        
        var characters: [UInt8] = [UInt8](repeating: 0, count: 13)
        
        characters[12] = charMap[Int(temp & 0x0f)]
        temp = temp >> 4
        
        for i in 1...12 {
            let c = charMap[Int(temp & 0x1f)]
            characters[12-i] = c
            temp = temp >> 5
        }
        
        var result = String(bytes: characters, encoding: .ascii)!
        if result.count > 12 {
            result = String(result[..<result.index(result.startIndex, offsetBy: 12)])
        }
        return result
    }
    
    private static func shortenKey(_ key: Data) -> UInt64 {
        var res: UInt64 = 0
        var temp: UInt64 = 0
        var toShift = 0
        var i = 1
        var len = 0
        
        while (len <= 12) {
            assert(i < 33, "Means the key has > 20 bytes with trailing zeroes...")
            temp = UInt64(key[i]) & (len == 12 ? 0x0f : 0x1f)
            if (temp == 0) {
                i+=1
                continue
            }
            toShift = len == 12 ? 0 : (5 * (12 - len) - 1)
            res = res | temp << toShift
            len+=1
            i+=1
        }
        
        return res;
    }
    
}

internal extension String {
    
    var ascii: [UInt8] {
        return unicodeScalars.compactMap { $0.isASCII ? UInt8($0.value) : nil }
    }
    
}
