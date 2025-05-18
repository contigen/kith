import 'server-only'
import prisma from './prisma'
import { Prisma } from '@prisma/client'
import { withTryCatch } from './utils'
import { VerifiableCredential } from '@/types'

export type CreateAgentInput = Prisma.AgentCreateInput

export type CreateRequestCredential = Prisma.CredentialRequestCreateInput

export function createUser(walletAddress: string) {
  return withTryCatch(async () => {
    return await prisma.user.create({
      data: {
        wallet: walletAddress,
      },
    })
  })
}

export function findUser(walletAddress: string) {
  return withTryCatch(async () => {
    return await prisma.user.findUnique({
      where: {
        wallet: walletAddress,
      },
    })
  })
}

export function createAgent(data: CreateAgentInput) {
  console.log('data:', data)
  return withTryCatch(async () => {
    return await prisma.agent.create({
      data,
    })
  })
}

export function findAgent(agentId: string) {
  return withTryCatch(async () => {
    return await prisma.agent.findUnique({
      where: { id: agentId },
      include: {
        credentials: true,
        timelineEvents: true,
        auditReports: true,
      },
    })
  })
}

export type Agent = Awaited<ReturnType<typeof findAgent>>

export function getAgents() {
  return withTryCatch(async () => {
    return await prisma.agent.findMany({
      include: {
        credentials: true,
        auditReports: true,
        timelineEvents: true,
      },
    })
  })
}

export function findAgentByDID(did: string) {
  return withTryCatch(async () => {
    return await prisma.agent.findUnique({
      where: { did },
      include: {
        credentials: true,
      },
    })
  })
}

export function countAgents() {
  return withTryCatch(async () => {
    return await prisma.agent.count()
  })
}

export type CredentialInput = Prisma.CredentialCreateInput

export async function createCredential(
  data: CredentialInput,
  agentId: string,
  credentialRequestId: string,
  score: number
) {
  return withTryCatch(async () => {
    const [credential] = await prisma.$transaction([
      prisma.credential.create({
        data,
      }),
      prisma.credentialRequest.update({
        where: { id: credentialRequestId },
        data: {
          status: `APPROVED`,
        },
      }),
      prisma.agent.update({
        where: { id: agentId },
        data: {
          trustScore: {
            set: score,
          },
        },
      }),
    ])
    return credential
  })
}

export function getCredentials() {
  return withTryCatch(async () => {
    return await prisma.credential.findMany({
      include: {
        agent: true,
      },
    })
  })
}

export function findCredentialByID(id: string) {
  return withTryCatch(async () => {
    return await prisma.credential.findFirst({
      where: {
        agentId: id,
      },
    })
  })
}

export function updateCredential(
  credentialId: string,
  credential: VerifiableCredential
) {
  return withTryCatch(async () => {
    return await prisma.credential.update({
      where: {
        id: credentialId,
      },
      data: {
        vcData: credential,
      },
    })
  })
}

export type VCredential = Awaited<ReturnType<typeof getCredentials>>

export async function createRequestCredential(data: CreateRequestCredential) {
  return withTryCatch(async () => {
    return await prisma.credentialRequest.create({
      data,
      include: {
        credential: {
          include: {
            agent: true,
          },
        },
      },
    })
  })
}

export async function getCredentialRequests() {
  return withTryCatch(async () => {
    return await prisma.credentialRequest.findMany({
      include: {
        agent: true,
        credential: true,
      },
    })
  })
}

export type VCredentialRequest = NonNullable<
  Awaited<ReturnType<typeof getCredentialRequests>>
>

export async function updateCredentialRequestStatus(
  credentialRequestId: string,
  credentialId: string
) {
  withTryCatch(async () => {
    return await prisma.credentialRequest.update({
      where: { id: credentialRequestId },
      data: {
        credential: {
          connect: { id: credentialId },
        },
        status: 'APPROVED',
      },
    })
  })
}
