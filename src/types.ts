export type DIDBody = {
  network: 'testnet' | 'mainnet'
  identifierFormatType: 'uuid' | 'uuid-based' | string
  assertionMethod: boolean
  options?: {
    key: string
    verificationMethodType:
      | 'Ed25519VerificationKey2018'
      | '"Ed25519VerificationKey2020"'
      | 'JSONWebKey2020'
  }
  key?: string
  verificationMethodType:
    | 'Ed25519VerificationKey2018'
    | '"Ed25519VerificationKey2020"'
    | 'JSONWebKey2020'
  didDocument?: {
    '@context': string[]
    id: string
    controller: string[]
    authentication: string[]
    service: DIDService[]
  }
}

export type DID = {
  did: string
  controllerKeyId: string
  keys: {
    kid: string
    kms: 'postgres'
    type: 'Ed25519' | 'Secp256k1'
    publicKeyHex: string
    meta: PublicKeyMeta
    controller: string
  }[]
  services: DIDService[]
}

type DIDService = {
  id: string
  type: 'LinkedDomains' | string
  serviceEndpoint: string[]
}

export type DIDResourceBody = {
  data: string
  encoding: 'base64' | 'base64url' | 'hex'
  name: string
  type: string
}

export type DIDResource = {
  resource: {
    resourceURI: `did:cheqd:${string}`
    resourceCollectionId: string
    resourceId: string
    resourceName: string
    resourceType: string
    mediaType: string
    resourceVersion: string
    checksum: string
    created: string
    nextVersionId: string | null
    previousVersionId: string | null
  }
}

type PublicKeyMeta = {
  algorithms: ('EdDSA' | 'Ed25519')[]
}

type CustomerInfo = {
  customerId: string
  name: string
  email: string
  description: string | null
  createdAt: string
  updatedAt: string
  paymentProviderId: string
}

export type KeyPair = {
  kid: string
  kms: 'postgres'
  type: 'Ed25519' | 'Secp256k1'
  publicKeyHex: string
  meta: PublicKeyMeta
  publicKeyAlias: string | null
  createdAt: string
  updatedAt: string
  customer: CustomerInfo
}

type VerificationMethod = {
  id: string
  type: string
  controller: string
  publicKeyBase58?: string
}

type DIDDocument = {
  '@context': string[]
  id: string
  controller: string[]
  verificationMethod: VerificationMethod[]
  authentication: string[]
}

type DIDResolutionMetadata = {
  contentType: string
  retrieved: string
  did: {
    didString: string
    methodSpecificId: string
    method: 'cheqd'
  }
}

type LinkedResourceMetadata = {
  resourceURI: string
  resourceCollectionId: string
  resourceId: string
  resourceName: string
  mediaType: string
  resourceType: string
  checksum: string
  created: string
  previousVersionId: string | null
  nextVersionId: string | null
  resourceVersion: string
}

type DIDDocumentMetadata = {
  created: string
  versionId: string
  linkedResourceMetadata: LinkedResourceMetadata[]
}

export type DIDLinkedResource = {
  '@context': string
  didDocument: DIDDocument
  didResolutionMetadata: DIDResolutionMetadata
  didDocumentMetadata: DIDDocumentMetadata
}

type CredentialStatus = {
  statusPurpose: 'revocation' | 'suspension' | string
  statusListName: string
  statusListIndex: number
}

export type VerifiableCredentialPayload = {
  issuerDid: string
  subjectDid: string
  attributes: Record<string, string>
  '@context'?: string[]
  type?: string[]
  format?: 'jwt' | 'jsonld'
  credentialStatus?: CredentialStatus
}

type Issuer = {
  id: string
}

type Proof = {
  type: 'JwtProof2020' | string
  jwt: string
}

export type VerifiableCredential = {
  credentialSubject: Record<string, string>
  issuer: Issuer
  type: string[]
  '@context': string[]
  issuanceDate: string
  proof: Proof
}

export type VerificationPolicy = {
  issuanceDate: boolean
  expirationDate: boolean
  audience: boolean
}

export type VerifiedCredentialPayload = {
  credential: Record<string, unknown>
  policies: VerificationPolicy
}

type Signer = {
  controller: string
  id: string
  publicKeyBase58: string
  type: 'Ed25519VerificationKey2018' | string
}

export type VerifiedCredential = {
  verified: boolean
  policies: Record<string, unknown>
  issuer: string
  signer: Signer
}
