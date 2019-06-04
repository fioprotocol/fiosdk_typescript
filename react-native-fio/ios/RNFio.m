
#import "RNFio.h"

@interface RCT_EXTERN_REMAP_MODULE(RNFio, Entrypoint, NSObject)
RCT_EXTERN_METHOD(getInfo: (RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(
                  setUrl:(nonnull NSString *)scheme
                  urlSent:(nonnull NSString *)urlSent
                  port:(nonnull NSNumber *)port
                  )
RCT_EXTERN_METHOD(
                  pushAction:(nonnull NSString *)contract
                  action:(nonnull NSString *)action
                  message:(nonnull NSString *)message
                  permissionAccount:(nonnull NSString *)permissionAccount
                  permissionType:(nonnull NSString *)permissionType
                  privateKeyString:(nonnull NSString *)privateKeyString
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  )
RCT_EXTERN_METHOD(
                  getActor:(nonnull NSString *)publicKey
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  )
RCT_EXTERN_METHOD(
                  getSignedTransaction:(nonnull NSString *)account
                  action:(nonnull NSString *)action
                  serializedData:(nonnull NSString *)serializedData
                  pubKey:(nonnull NSString *)pubKey
                  privKey:(nonnull NSString *)privKey
                  chainJson:(nonnull NSString *)chainJson
                  blockJson:(nonnull NSString *)blockJson
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  )
RCT_EXTERN_METHOD(
    generatePrivatePubKeyPair:(nonnull NSString *)mnemonic
    resolver:(RCTPromiseResolveBlock)resolve  
    rejecter:(RCTPromiseRejectBlock)reject
) 
@end
