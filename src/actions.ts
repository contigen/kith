'use server'

import {
  RESOURCE_NAME,
  RESOURCE_TYPE,
  TRUST_SCORE_SYSTEM_INSTRUCTION,
} from './constants'
import {
  createDID,
  createDIDLinkedResource,
  createIdentityKeyPair,
  getDIDLinkedResource,
  getDIDs,
  issueCredential,
  resolveDID,
  verifyCredential,
} from './lib/cheqd'
import {
  createAgent,
  CreateAgentInput,
  createRequestCredential,
  CreateRequestCredential,
  findAgentByDID,
} from './lib/db-queries'
import { trustScoreSchema } from './lib/schema'
import { toBase64 } from './lib/utils'
import { google } from '@ai-sdk/google'
import { generateObject } from 'ai'

const issuerDid = (() => {
  if (!process.env.ISSUER_DID) throw new Error('ISSUER_DID missing')
  return process.env.ISSUER_DID
})()

export async function createIdentityKeyPairAction() {
  const identityKeyPair = await createIdentityKeyPair()
  console.log('identity key pair: ', identityKeyPair)
}

export async function createAgentAction(
  data: CreateAgentInput,
  linkedResource: Record<string, string>
) {
  const { capabilities, limitations, category, creator, description } =
    linkedResource
  const agent = await createAgent(data)
  console.log('agent: ', agent)
  if (!agent) return false
  try {
    const resource = await createDIDLinkedResourceAction(data.did, {
      capabilities,
      limitations,
      category,
      creator,
      description,
    })
    console.log('resource: ', resource)
    if (!('resourceURI' in resource))
      throw new Error('Error creating DID Linked Resource')
  } catch {
    return false
  }
  return true
}

export async function createDIDAction() {
  const { did } = await createDID({
    network: 'testnet',
    identifierFormatType: 'uuid',
    assertionMethod: false,
    // options: {
    // key: 'edf4c84e85ade245d03bd6202bf6353f0bd8c81cbce0026d8bcb7efa0bb3136a',
    verificationMethodType: 'Ed25519VerificationKey2018',
    // },
  })
  return did
}

export async function getDIDsAction() {
  const DIDs = await getDIDs()
  console.log('DIDs: ', DIDs)
}

export async function resolveDIDAction(did: string) {
  const resolvedDID = await resolveDID(did)
  console.log(resolvedDID)
  return resolvedDID
}

export async function createDIDLinkedResourceAction(
  did: string,
  data: Record<string, string>
) {
  const { resource } = await createDIDLinkedResource(did, {
    data: toBase64(data),
    encoding: 'base64',
    name: RESOURCE_NAME,
    type: RESOURCE_TYPE,
  })
  return resource
}

export async function getDIDLinkedResourceAction() {
  const resource = await getDIDLinkedResource(
    'did:cheqd:testnet:b6d55d34-0cd9-477c-b043-6b2668e7b243'
  )
  console.log('resource:', resource)
}

export async function issueCredentialAction(
  subjectDid: string,
  attributes: Record<string, string>,
  credentialType: string
) {
  const credential = await issueCredential({
    issuerDid,
    // subjectDid: 'did:cheqd:testnet:58eb7c21-c52d-4bba-859e-094273030b29',
    subjectDid,
    attributes,
    // '@context': ['https://schema.org'],
    type: [credentialType],
  })
  console.log('credential: ', credential)
  return credential
}

export async function verifyCredentialAction() {
  const credential = await verifyCredential({})
}

export async function generateTrustScore() {
  const { response } = await generateObject({
    model: google('gemini-2.5-pro-exp-03-25'),
    system: TRUST_SCORE_SYSTEM_INSTRUCTION,
    schema: trustScoreSchema,
  })
  console.log('response from AI: ', response)
  return response
}

export async function requestCredentialAction(data: CreateRequestCredential) {
  try {
    const requestCredential = await createRequestCredential(data)
    if (requestCredential) return true
    else {
      return false
    }
  } catch {
    return false
  }
}

export async function verifyDID(did: string) {
  return await findAgentByDID(did)
}
export async function uploadImageToIPFS(formData: FormData): Promise<{
  success: boolean
  message: string
  ipfsUrl?: string
  ipfsHash?: string
}> {
  try {
    const file = formData.get('file') as File

    if (!file) {
      return { success: false, message: 'No file uploaded' }
    }

    if (!file.type.startsWith('image/')) {
      return { success: false, message: 'File must be an image' }
    }
    const pinataFormData = new FormData()

    pinataFormData.append('file', file)
    const metadata = JSON.stringify({
      name: file.name,
      keyvalues: {
        uploadDate: new Date().toISOString(),
      },
    })
    pinataFormData.append('pinataMetadata', metadata)
    const options = JSON.stringify({
      cidVersion: 1,
    })
    pinataFormData.append('pinataOptions', options)
    const apiKey = process.env.PINATA_API_KEY
    const apiSecret = process.env.PINATA_API_SECRET

    if (!apiKey || !apiSecret) {
      return { success: false, message: 'Pinata API keys not configured' }
    }

    // Make request to Pinata API
    const response = await fetch(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      {
        method: 'POST',
        headers: {
          pinata_api_key: apiKey,
          pinata_secret_api_key: apiSecret,
        },
        body: pinataFormData as any, // Type casting needed due to differences between FormData types
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      return { success: false, message: `Pinata Error: ${errorText}` }
    }

    const data = await response.json()
    const ipfsHash = data.IpfsHash
    const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`

    return {
      success: true,
      message: 'File uploaded to IPFS successfully',
      ipfsUrl,
      ipfsHash,
    }
  } catch (error) {
    console.error('Error uploading to IPFS:', error)
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}
