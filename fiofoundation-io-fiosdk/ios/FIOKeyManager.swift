import Foundation

private let slipFIO: UInt32 = 235

/**
 * Manages FIO's public and private keys. Private keys follow HD BIP44 specs.
 */
internal class FIOKeyManager {
    
    private let keychain: KeychainInteractor!
    
    init(keychainInteractor: KeychainInteractor) {
        self.keychain = keychainInteractor
    }
    
    convenience init() {
        self.init(keychainInteractor: KeychainInteractor())
    }
    
    /// This method retrieves private and public key. If they are not present it calls private public key generation with the given mnemonic.
    ///
    /// - Parameters:
    ///   - mnemonic: The text to use in key pair generation.
    /// - Return: A tuple containing both private and public keys.
    func privatePubKeyPair(mnemonic: String?) -> (privateKey: String, publicKey: String) {
        guard let mnemonic = mnemonic else { return ("", "") }
        do {
            if let fioPrivKey: String? = try? keychain.keychainItem(key: KeychainKeys.fioPrivKey),
                let fioPubKey: String? = try? keychain.keychainItem(key: KeychainKeys.fioPubKey) {
                if fioPrivKey != nil && fioPubKey != nil && !fioPrivKey!.isEmpty && !fioPubKey!.isEmpty {
                    print("[FIOKeyManager] Stored FIO privkey: \(fioPrivKey!) and pubkey: \(fioPubKey!)");
                    return (fioPrivKey!, fioPubKey!)
                }
            }
            let keyPair = generatePrivatePubKeyPair(forMnemonic: mnemonic)
            try keychain.setKeychainItem(key: KeychainKeys.fioPrivKey, item: keyPair.privateKey)
            try keychain.setKeychainItem(key: KeychainKeys.fioPubKey, item: keyPair.publicKey)
            print("[FIOKeyManager] Generated FIO privkey: \(keyPair.privateKey) and pubkey: \(keyPair.publicKey)");
            return keyPair
        }
        catch let error {
            print("[FIOKeyManager] fioPrivKey error: \(error)")
            return ("", "")
        }
    }
    
    /// This method creates a private and public key based on a mnemonic. It uses SwiftyEOS classes for that.
    ///
    /// - Parameters:
    ///   - mnemonic: The text to use in key pair generation.
    /// - Return: A tuple containing both private and public keys.
    func generatePrivatePubKeyPair(forMnemonic mnemonic: String) -> (privateKey: String, publicKey: String) {
        do {
            let privKey = try PrivateKey(enclave: .Secp256k1, mnemonicString: mnemonic, slip: slipFIO)
            guard let pk = privKey else { return ("", "") }
            return (pk.rawPrivateKey(), PublicKey(privateKey: pk).rawPublicKey())
        }
        catch {
            return ("", "")
        }
    }
    
    func wipeKeys() throws {
        try keychain.setKeychainItem(key: KeychainKeys.fioPrivKey, item: nil as String?)
        try keychain.setKeychainItem(key: KeychainKeys.fioPubKey, item: nil as String?)
    }
    
}