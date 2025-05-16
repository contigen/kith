import { cheqdApiClient } from '@/app/api/client'
import {
  DID,
  DIDBody,
  DIDLinkedResource,
  DIDResource,
  DIDResourceBody,
  KeyPair,
  VerifiableCredential,
  VerifiableCredentialPayload,
  VerifiedCredential,
  VerifiedCredentialPayload,
} from '@/types'

export async function createIdentityKeyPair() {
  return await cheqdApiClient<KeyPair>('key/create?type=Ed25519', {
    method: 'POST',
  })
}

export async function getIdentityKeyPair(kid: string) {
  return await cheqdApiClient<Omit<KeyPair, 'customer'>>(`key/read/${kid}`)
}

export async function createDID(data: DIDBody) {
  return await cheqdApiClient<DID>('did/create', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateDID(data: DIDBody) {
  return await cheqdApiClient<DID>('did/update', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function getDIDs() {
  return await cheqdApiClient<string[]>('did/list')
}

export async function resolveDID(did: string) {
  return await cheqdApiClient<DID>(`did/search/${did}`)
}

export async function createDIDLinkedResource(
  did: string,
  data: DIDResourceBody
) {
  return await cheqdApiClient<DIDResource>(`resource/create/${did}`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function getDIDLinkedResource(did: string) {
  return await cheqdApiClient<DIDLinkedResource>(`resource/search/${did}`)
}

export async function issueCredential(payload: VerifiableCredentialPayload) {
  return await cheqdApiClient<VerifiableCredential>('credential/issue', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function verifyCredential(payload: VerifiedCredentialPayload) {
  return await cheqdApiClient<VerifiedCredential>('credential/verify', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

// to be implemented

export function publishAccreditation() {}

export function verifyAccreditation() {}
