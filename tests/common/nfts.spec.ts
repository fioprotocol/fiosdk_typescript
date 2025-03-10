import { expect } from 'chai';
import { Account, Action, FIOSDK, TransactionResponse } from '../../src/FIOSDK';
import { generateHashForNft, timeout } from '../utils';
import { defaultFee } from '../constants';

export const NftsTests = ({
  fioSdk,
  testFioAddressName
}: {
  fioSdk: FIOSDK,
  testFioAddressName: string
}) => describe('NFT tests', () => {
  const contractAddress1 = `0x63c0691d05f45ca${Date.now()}`
  const tokenId1 = Date.now()
  const contractAddress2 = `atomicassets${Date.now()}`
  const tokenId2 = Date.now() + 4
  const hash = generateHashForNft()

  it(`Sign NFT`, async () => {
    const result = await fioSdk.genericAction('pushTransaction', {
      account: Account.address,
      action: Action.addNft,
      data: {
        fio_address: testFioAddressName,
        max_fee: defaultFee,
        nfts: [
          {
            chain_code: 'ETH',
            contract_address: contractAddress1,
            hash,
            metadata: '',
            token_id: tokenId1,
            url: 'ipfs://ipfs/QmZ15eQX8FPjfrtdX3QYbrhZxJpbLpvDpsgb2p3VEH8Bqq',
          },
          {
            chain_code: 'EOS',
            contract_address: contractAddress2,
            hash: '',
            metadata: '{\'creator_url\':\'https://yahoo.com/\'}',
            token_id: tokenId2,
            url: '',
          },
        ],
        tpid: '',
      },
    }) as TransactionResponse

    expect(result).to.have.all.keys('transaction_id', 'block_num', 'block_time', 'status', 'fee_collected')
    expect(result.status).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
    expect(result.block_num).to.be.a('number')
    expect(result.transaction_id).to.be.a('string')
  })

  it(`getNfts by chain code and contract address`, async () => {
    await timeout(2000)
    const ccResult = await fioSdk.getNfts({
      chainCode: 'ETH',
      contractAddress: contractAddress1,
    }, 10, 0)

    expect(ccResult).to.have.all.keys('nfts', 'more')
    expect(ccResult.nfts).to.be.a('array')
    expect(ccResult.more).to.be.a('number')
    expect(ccResult.nfts[0].fio_address).to.be.a('string')
    expect(ccResult.nfts[0].fio_address).to.equal(testFioAddressName)
    expect(ccResult.nfts[0].contract_address).to.equal(contractAddress1)
  })

  it(`getNfts by FIO Address`, async () => {
    const fioAddressResult = await fioSdk.getNfts({ fioAddress: testFioAddressName }, 10, 0)

    expect(fioAddressResult).to.have.all.keys('nfts', 'more')
    expect(fioAddressResult.nfts).to.be.a('array')
    expect(fioAddressResult.more).to.be.a('number')
    expect(fioAddressResult.nfts.length).to.gte(2)
  })

  it(`getNfts by hash`, async () => {
    const hashResult = await fioSdk.getNfts({
      hash,
    }, 10, 0)

    expect(hashResult).to.have.all.keys('nfts', 'more')
    expect(hashResult.nfts).to.be.a('array')
    expect(hashResult.more).to.be.a('number')
    expect(hashResult.nfts[0].hash).to.be.a('string')
    expect(hashResult.nfts[0].hash).to.equal(hash)
  })
});
