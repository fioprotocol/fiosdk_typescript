import nodeFetch from 'node-fetch'

import type { FioError as FioErrorType } from '../src/entities/types/FioError.d.ts';

export type ErrorType = Error & FioErrorType;

export const generateTestingFioAddress = (customDomain: string): string => {
  return `testing${Date.now()}@${customDomain}`
}

export const generateTestingFioDomain = (): string => {
  return `testing-domain-${Date.now()}`
}

export const timeout = async (ms: number) => {
  await new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export const generateHashForNft = () => {
  const now = `${Date.now()}`
  return `f83b5702557b1ee76d966c6bf92ae0d038cd176aaf36f86a18e${now.slice(0, 13)}`
}

export const generateObtId = () => {
  return `${Date.now()}`
}

export const fetchJson = async (uri: string, opts = {}) => {
  return nodeFetch(uri, opts)
}

export const mnemonic = 'property follow talent guilt uncover someone gain powder urge slot taxi sketch';
export const mnemonic2 = 'round work clump little air glue lemon gravity shed charge assault orbit';

function randStr(len: number) {
  const charset = 'abcdefghijklmnopqrstuvwxyz'
  let result = ''
  for (let i = 0; i < len; i++) {
    result += charset[Math.floor(Math.random() * charset.length)]
  }
  return result
}

export const getMnemonic = () => 'test health mine over uncover someone gain powder urge slot property ' + randStr(7);
